// ============================================================================
// AQUA MARK — CLOUDFLARE PAGES _worker.js (CLASS C OPTIMIZED)
// Reduces Backblaze B2 Class C transactions by ~95%+ with zero DB/UI changes:
// 1. 18-hour two-layer caching (Isolate RAM + Cloudflare Edge Cache) for
//    b2_authorize_account with automatic 401 self-healing retry.
// 2. Caches uploaded fileId in Cloudflare Edge Cache so /api/delete calls
//    b2_delete_file_version (Class A, Free) directly without b2_list_file_names
//    (Class C), with automatic prefix-narrowed fallback for older files.
// 3. Clean Cloudflare CDN caching for /files/... images & safe Range support
//    for videos, plus cache purge on delete.
// ============================================================================

const AUTH_TTL_SECONDS = 18 * 60 * 60; // 18 hours (B2 auth tokens last up to 24h)
const FILE_ID_TTL_SECONDS = 30 * 24 * 60 * 60; // 30 days
const INTERNAL_CACHE_HOST = "https://b2-internal-cache.aquamark";

// Layer 1: Fast in-memory isolate cache
let memoryAuthCache = null;

function getAuthCacheRequest(env) {
    return new Request(`${INTERNAL_CACHE_HOST}/auth/${encodeURIComponent(env.B2_KEY_ID || "default")}`, {
        method: "GET",
    });
}

function getFileIdCacheRequest(fileName) {
    return new Request(`${INTERNAL_CACHE_HOST}/fileid/${encodeURIComponent(fileName)}`, {
        method: "GET",
    });
}

async function clearB2AuthCache(env) {
    memoryAuthCache = null;
    try {
        await caches.default.delete(getAuthCacheRequest(env));
    } catch {
        // Ignore cache delete errors
    }
}

async function getB2Auth(env, ctx, forceRefresh = false) {
    const now = Date.now();

    if (!forceRefresh) {
        // Layer 1: Check isolate RAM cache (0ms, 0 Class C)
        if (memoryAuthCache && memoryAuthCache.expiresAt > now) {
            return memoryAuthCache.data;
        }

        // Layer 2: Check Cloudflare Edge Cache (0 Class C across isolates)
        try {
            const cachedRes = await caches.default.match(getAuthCacheRequest(env));
            if (cachedRes) {
                const parsed = await cachedRes.json();
                if (parsed && parsed.authorizationToken && parsed.expiresAt > now) {
                    memoryAuthCache = { data: parsed, expiresAt: parsed.expiresAt };
                    return parsed;
                }
            }
        } catch {
            // Fall through to live auth
        }
    }

    // Cache miss or forced refresh: call b2_authorize_account (1 Class C call)
    const authString = btoa(`${env.B2_KEY_ID}:${env.B2_APP_KEY}`);
    const authRes = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
        headers: { Authorization: `Basic ${authString}` },
    });

    if (!authRes.ok) {
        throw new Error(`B2 Auth Failed (${authRes.status})`);
    }

    const data = await authRes.json();
    const expiresAt = now + AUTH_TTL_SECONDS * 1000;
    const payload = { ...data, expiresAt };

    memoryAuthCache = { data: payload, expiresAt };

    const cacheResponse = new Response(JSON.stringify(payload), {
        headers: {
            "Content-Type": "application/json",
            "Cache-Control": `public, max-age=${AUTH_TTL_SECONDS}`,
        },
    });
    if (ctx && typeof ctx.waitUntil === "function") {
        ctx.waitUntil(caches.default.put(getAuthCacheRequest(env), cacheResponse));
    } else {
        await caches.default.put(getAuthCacheRequest(env), cacheResponse);
    }

    return payload;
}

// Helper: executes a B2 API call with cached auth and auto-retries once on 401
async function b2FetchWithAuth(env, ctx, buildRequest) {
    let authData = await getB2Auth(env, ctx, false);
    let res = await buildRequest(authData);

    if (res.status === 401) {
        await clearB2AuthCache(env);
        authData = await getB2Auth(env, ctx, true);
        res = await buildRequest(authData);
    }

    return { res, authData };
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // 0. ప్రైవేట్ Super Admin Password Verification (POST /api/admin-auth)
        if (url.pathname === "/api/admin-auth" && request.method === "POST") {
            try {
                if (!env.ADMIN_SECRET) {
                    return Response.json({ ok: false, error: "ADMIN_SECRET not configured" }, { status: 503 });
                }
                const { password } = await request.json();
                if (typeof password === "string" && password === env.ADMIN_SECRET) {
                    return Response.json({ ok: true });
                }
                return Response.json({ ok: false, error: "Unauthorized" }, { status: 401 });
            } catch {
                return Response.json({ ok: false, error: "Invalid request" }, { status: 400 });
            }
        }

        // 1. ఫైల్ అప్‌లోడ్ API (POST /api/upload)
        if (url.pathname === "/api/upload" && request.method === "POST") {
            try {
                const formData = await request.formData();
                const file = formData.get("file");
                if (!file) return new Response("No file", { status: 400 });

                const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
                const fileBuffer = await file.arrayBuffer();

                // b2_get_upload_url is Class A (Free); uses cached B2 auth (0 Class C!)
                const { res: uploadUrlRes } = await b2FetchWithAuth(env, ctx, (authData) =>
                    fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
                        method: "POST",
                        headers: {
                            Authorization: authData.authorizationToken,
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ bucketId: env.B2_BUCKET_ID }),
                    })
                );

                if (!uploadUrlRes.ok) return new Response("B2 Upload URL Failed", { status: 500 });
                const uploadUrlData = await uploadUrlRes.json();

                const sha1Buffer = await crypto.subtle.digest("SHA-1", fileBuffer);
                const sha1Hex = Array.from(new Uint8Array(sha1Buffer))
                    .map((b) => b.toString(16).padStart(2, "0"))
                    .join("");

                const uploadRes = await fetch(uploadUrlData.uploadUrl, {
                    method: "POST",
                    headers: {
                        Authorization: uploadUrlData.authorizationToken,
                        "X-Bz-File-Name": encodeURIComponent(fileName),
                        "Content-Type": file.type || "b2/x-auto",
                        "X-Bz-Content-Sha1": sha1Hex,
                    },
                    body: fileBuffer,
                });

                if (!uploadRes.ok) return new Response("B2 Upload Failed", { status: 500 });

                // Cache returned fileId so future /api/delete skips b2_list_file_names (0 Class C!)
                try {
                    const uploadedMeta = await uploadRes.json();
                    if (uploadedMeta && uploadedMeta.fileId) {
                        const fileIdRes = new Response(JSON.stringify({ fileId: uploadedMeta.fileId }), {
                            headers: {
                                "Content-Type": "application/json",
                                "Cache-Control": `public, max-age=${FILE_ID_TTL_SECONDS}`,
                            },
                        });
                        ctx.waitUntil(caches.default.put(getFileIdCacheRequest(fileName), fileIdRes));
                    }
                } catch {
                    // Non-fatal if metadata cache fails
                }

                return Response.json({ url: `${url.origin}/files/${fileName}` });
            } catch (err) {
                return new Response(err.message, { status: 500 });
            }
        }

        // 2. ఫైల్ డిలీట్ API (POST /api/delete)
        if (url.pathname === "/api/delete" && request.method === "POST") {
            try {
                const { fileNames } = await request.json();

                for (const rawName of (fileNames || [])) {
                    const name = decodeURIComponent(String(rawName || "").replace(/^\/?files\//, ""));
                    if (!name) continue;

                    let deleted = false;

                    // Fast path: check cached fileId -> direct b2_delete_file_version (Class A Free, 0 Class C!)
                    try {
                        const cachedIdRes = await caches.default.match(getFileIdCacheRequest(name));
                        if (cachedIdRes) {
                            const { fileId } = await cachedIdRes.json();
                            if (fileId) {
                                const { res: delRes } = await b2FetchWithAuth(env, ctx, (authData) =>
                                    fetch(`${authData.apiUrl}/b2api/v2/b2_delete_file_version`, {
                                        method: "POST",
                                        headers: {
                                            Authorization: authData.authorizationToken,
                                            "Content-Type": "application/json",
                                        },
                                        body: JSON.stringify({ fileName: name, fileId }),
                                    })
                                );
                                if (delRes.ok) {
                                    deleted = true;
                                }
                            }
                        }
                    } catch {
                        // Fall through to prefix-narrowed list lookup
                    }

                    // Fallback for older files not in cache: narrow prefix + maxFileCount: 1 (minimal Class C)
                    if (!deleted) {
                        const { res: listRes, authData } = await b2FetchWithAuth(env, ctx, (auth) =>
                            fetch(`${auth.apiUrl}/b2api/v2/b2_list_file_names`, {
                                method: "POST",
                                headers: {
                                    Authorization: auth.authorizationToken,
                                    "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                    bucketId: env.B2_BUCKET_ID,
                                    prefix: name,
                                    startFileName: name,
                                    maxFileCount: 1,
                                }),
                            })
                        );

                        if (listRes.ok) {
                            const listData = await listRes.json();
                            const target = (listData.files || []).find((f) => f.fileName === name);
                            if (target) {
                                await fetch(`${authData.apiUrl}/b2api/v2/b2_delete_file_version`, {
                                    method: "POST",
                                    headers: {
                                        Authorization: authData.authorizationToken,
                                        "Content-Type": "application/json",
                                    },
                                    body: JSON.stringify({ fileName: target.fileName, fileId: target.fileId }),
                                });
                            }
                        }
                    }

                    // Clean up Cloudflare edge caches for the deleted file
                    ctx.waitUntil(caches.default.delete(getFileIdCacheRequest(name)));
                    ctx.waitUntil(
                        caches.default.delete(new Request(`${url.origin}/files/${name}`, { method: "GET" }))
                    );
                }

                return Response.json({ deleted: true });
            } catch (err) {
                return new Response(err.message, { status: 500 });
            }
        }

        // 3. Private Bucket నుంచి ఫైల్ తెచ్చి Cloudflare Cache లో సేవ్ చేయడం (GET /files/...)
        if (url.pathname.startsWith("/files/")) {
            const cache = caches.default;
            const rangeHeader = request.headers.get("Range");
            const cacheKey = new Request(`${url.origin}${url.pathname}`, { method: "GET" });

            // Serve full cached images/files directly from Cloudflare Edge (0 Class B, 0 Class C!)
            if (!rangeHeader) {
                const cachedResponse = await cache.match(cacheKey);
                if (cachedResponse) return cachedResponse;
            }

            const fileName = url.pathname.replace("/files/", "");

            const { res: b2Response } = await b2FetchWithAuth(env, ctx, (authData) => {
                const headers = { Authorization: authData.authorizationToken };
                if (rangeHeader) headers["Range"] = rangeHeader;
                return fetch(`${authData.downloadUrl}/file/${env.B2_BUCKET_NAME}/${fileName}`, { headers });
            });

            if (!b2Response.ok && b2Response.status !== 206) {
                return new Response("File not found", { status: 404 });
            }

            const response = new Response(b2Response.body, b2Response);
            response.headers.set("Cache-Control", "public, max-age=31536000, immutable");

            // Cloudflare Cache API stores 200 OK full responses cleanly
            if (b2Response.status === 200 && !rangeHeader) {
                ctx.waitUntil(cache.put(cacheKey, response.clone()));
            }

            return response;
        }

        // 4. మీ React వెబ్‌సైట్ లోడ్ అవుతుంది
        return env.ASSETS.fetch(request);
    },
};