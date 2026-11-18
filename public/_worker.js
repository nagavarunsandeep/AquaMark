async function getB2Auth(env) {
    const authString = btoa(`${env.B2_KEY_ID}:${env.B2_APP_KEY}`);
    const authRes = await fetch("https://api.backblazeb2.com/b2api/v2/b2_authorize_account", {
        headers: { Authorization: `Basic ${authString}` },
    });
    return authRes.json();
}

export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // 1. ఫైల్ అప్‌లోడ్ API (POST /api/upload)
        if (url.pathname === "/api/upload" && request.method === "POST") {
            try {
                const formData = await request.formData();
                const file = formData.get("file");
                if (!file) return new Response("No file", { status: 400 });

                const fileName = `${Date.now()}-${file.name.replace(/\s+/g, "_")}`;
                const fileBuffer = await file.arrayBuffer();
                const authData = await getB2Auth(env);

                const uploadUrlRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_get_upload_url`, {
                    method: "POST",
                    headers: {
                        Authorization: authData.authorizationToken,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ bucketId: env.B2_BUCKET_ID }),
                });
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

                return Response.json({ url: `${url.origin}/files/${fileName}` });
            } catch (err) {
                return new Response(err.message, { status: 500 });
            }
        }

        // 2. ఫైల్ డిలీట్ API (POST /api/delete)
        if (url.pathname === "/api/delete" && request.method === "POST") {
            try {
                const { fileNames } = await request.json();
                const authData = await getB2Auth(env);
                for (const name of (fileNames || [])) {
                    const listRes = await fetch(`${authData.apiUrl}/b2api/v2/b2_list_file_names`, {
                        method: "POST",
                        headers: { Authorization: authData.authorizationToken, "Content-Type": "application/json" },
                        body: JSON.stringify({ bucketId: env.B2_BUCKET_ID, startFileName: name, maxFileCount: 1 }),
                    });
                    const listData = await listRes.json();
                    const target = (listData.files || []).find((f) => f.fileName === name);
                    if (target) {
                        await fetch(`${authData.apiUrl}/b2api/v2/b2_delete_file_version`, {
                            method: "POST",
                            headers: { Authorization: authData.authorizationToken, "Content-Type": "application/json" },
                            body: JSON.stringify({ fileName: target.fileName, fileId: target.fileId }),
                        });
                    }
                }
                return Response.json({ deleted: true });
            } catch (err) {
                return new Response(err.message, { status: 500 });
            }
        }

        // 3. Private Bucket నుంచి ఫైల్ తెచ్చి Cloudflare Cache లో సేవ్ చేయడం (GET /files/...)
        if (url.pathname.startsWith("/files/")) {
            const cache = caches.default;
            let response = await cache.match(request);

            if (!response) {
                const fileName = url.pathname.replace("/files/", "");
                const authData = await getB2Auth(env);
                const b2Url = `${authData.downloadUrl}/file/${env.B2_BUCKET_NAME}/${fileName}`;

                const b2Response = await fetch(b2Url, {
                    headers: { Authorization: authData.authorizationToken },
                });

                if (!b2Response.ok) return new Response("File not found", { status: 404 });

                response = new Response(b2Response.body, b2Response);
                response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
                ctx.waitUntil(cache.put(request, response.clone()));
            }
            return response;
        }

        // 4. మీ React వెబ్‌సైట్ లోడ్ అవుతుంది
        return env.ASSETS.fetch(request);
    },
};