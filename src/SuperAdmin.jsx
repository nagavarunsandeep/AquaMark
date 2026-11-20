import React, { useState, useEffect, useMemo } from 'react';
import {
    ShieldCheck, Lock, LogOut, RefreshCw, Search, Download,
    Users, Building2, Package, Wallet, TrendingUp, CheckCircle2,
    PauseCircle, PlayCircle, Trash2, Megaphone, Sun, Moon,
    Eye, EyeOff, AlertTriangle, Send, Copy, Layers, Calendar,
    PhoneCall, MapPin, ExternalLink, ShieldAlert, BarChart3,
    Video, Printer, Award, Clock, ChevronRight, Filter
} from 'lucide-react';
import { supabase } from './supabaseClient';

// ============================================================================
// AQUA MARK — EXECUTIVE SUPER ADMIN COMMAND CENTER (18+ PRO FEATURES)
// - Zero database schema changes (uses existing app_users, batches, bookings, app_kv_store)
// - Zero Backblaze B2 media calls (zero Class B / Class C impact)
// - Server-verified login via Cloudflare Worker (/api/admin-auth + ADMIN_SECRET)
// ============================================================================

export default function SuperAdmin() {
    const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('aqm_super_admin_ok') === '1');
    const [adminPassInput, setAdminPassInput] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const [darkMode, setDarkMode] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // bookings | dispatch | hatcheries | brokers | users | analytics | security | broadcast
    const [loading, setLoading] = useState(false);
    const [lastSyncedAt, setLastSyncedAt] = useState('');
    const [autoRefresh, setAutoRefresh] = useState(false);
    const [toast, setToast] = useState('');

    // Data
    const [usersList, setUsersList] = useState([]);
    const [batchesList, setBatchesList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [kvStore, setKvStore] = useState({});

    // Global Omni-Search & Filters
    const [globalQuery, setGlobalQuery] = useState('');
    const [dateRange, setDateRange] = useState('ALL'); // ALL | TODAY | 7D | 30D
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingFilter, setBookingFilter] = useState('ALL'); // ALL | ADVANCE | SETTLED | CANCELLED
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('ALL'); // ALL | buyer | seller | mediator
    const [batchSearch, setBatchSearch] = useState('');
    const [batchStatusFilter, setBatchStatusFilter] = useState('ALL'); // ALL | LIVE | PAUSED | SOLD

    // Rich Detail Inspector Modals
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [selectedBatch, setSelectedBatch] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    // Broadcast form
    const [broadcastRole, setBroadcastRole] = useState('ALL');
    const [broadcastTitle, setBroadcastTitle] = useState('');
    const [broadcastMsg, setBroadcastMsg] = useState('');
    const [sendingBroadcast, setSendingBroadcast] = useState(false);

    useEffect(() => {
        document.title = 'AquaMark | Super Admin';
    }, []);

    const notify = (msg) => {
        setToast(msg);
        setTimeout(() => setToast(''), 3500);
    };

    const copyText = (val, label = 'Copied') => {
        if (!val) return;
        navigator.clipboard?.writeText(String(val)).catch(() => { });
        notify(`${label}: ${val}`);
    };

    const openWhatsApp = (phone, text) => {
        const clean = String(phone || '').replace(/\D/g, '').slice(-10);
        if (clean.length !== 10) return notify('Invalid 10-digit phone number');
        window.open(`https://wa.me/91${clean}?text=${encodeURIComponent(text || 'Hello from AquaMark Support.')}`, '_blank', 'noopener,noreferrer');
    };

    const handleAdminLogin = async (e) => {
        e.preventDefault();
        setAuthError('');
        const pwd = adminPassInput.trim();
        if (!pwd) {
            setAuthError('Please enter your Super Admin password.');
            return;
        }

        setAuthLoading(true);
        try {
            const res = await fetch('/api/admin-auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ password: pwd }),
            });

            if (res.ok) {
                const data = await res.json();
                if (data?.ok) {
                    sessionStorage.setItem('aqm_super_admin_ok', '1');
                    setIsUnlocked(true);
                    setAdminPassInput('');
                    setAuthLoading(false);
                    return;
                }
            }

            if (res.status === 429) {
                setAuthError('Too many failed attempts. Locked for 15 minutes.');
                setAuthLoading(false);
                return;
            }
            if (res.status === 401) {
                setAuthError('Incorrect Super Admin password.');
                setAuthLoading(false);
                return;
            }
            if (res.status === 503) {
                setAuthError('ADMIN_SECRET is not set in Cloudflare Pages Environment Variables.');
                setAuthLoading(false);
                return;
            }

            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const localSecret = import.meta.env.VITE_ADMIN_SECRET;
            if (isLocal && localSecret && pwd === localSecret) {
                sessionStorage.setItem('aqm_super_admin_ok', '1');
                setIsUnlocked(true);
                setAdminPassInput('');
                setAuthLoading(false);
                return;
            }

            setAuthError('Verification failed. Check your password or Cloudflare ADMIN_SECRET.');
        } catch {
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const localSecret = import.meta.env.VITE_ADMIN_SECRET;
            if (isLocal && localSecret && pwd === localSecret) {
                sessionStorage.setItem('aqm_super_admin_ok', '1');
                setIsUnlocked(true);
                setAdminPassInput('');
            } else {
                setAuthError('Unable to reach /api/admin-auth. Make sure _worker.js is deployed.');
            }
        } finally {
            setAuthLoading(false);
        }
    };

    const handleLockAdmin = () => {
        sessionStorage.removeItem('aqm_super_admin_ok');
        setIsUnlocked(false);
        setAdminPassInput('');
    };

    const fetchAllData = async (silent = false) => {
        setLoading(true);
        try {
            const [uRes, bRes, bkRes, kvRes] = await Promise.all([
                supabase.from('app_users').select('*'),
                supabase.from('batches').select('*').order('created_at', { ascending: false }),
                supabase.from('bookings').select('*').order('created_at', { ascending: false }),
                supabase.from('app_kv_store').select('*'),
            ]);

            if (uRes.data) {
                setUsersList(uRes.data.map((r) => ({ ...r, ...(r.data || {}), rawKey: r.phone })));
            }
            if (bRes.data) {
                setBatchesList(bRes.data.map((r) => ({ ...(r.data || {}), id: r.id, createdAtDb: r.created_at })));
            }
            if (bkRes.data) {
                setBookingsList(bkRes.data.map((r) => ({ ...(r.data || {}), bookingId: r.booking_id || r.data?.bookingId, createdAtDb: r.created_at })));
            }
            if (kvRes.data) {
                const map = {};
                kvRes.data.forEach((item) => { map[item.key] = item.value; });
                setKvStore(map);
            }
            setLastSyncedAt(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
            if (!silent) notify('Live Supabase data synced!');
        } catch (err) {
            notify(`Sync error: ${err?.message || 'Check connection'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isUnlocked) fetchAllData(true);
    }, [isUnlocked]);

    useEffect(() => {
        if (!isUnlocked || !autoRefresh) return;
        const id = setInterval(() => fetchAllData(true), 30000);
        return () => clearInterval(id);
    }, [isUnlocked, autoRefresh]);

    // Date-range filtered bookings for KPIs & views
    const dateFilteredBookings = useMemo(() => {
        if (dateRange === 'ALL') return bookingsList;
        const now = Date.now();
        const todayStr = new Date().toISOString().slice(0, 10);
        const msWindow = dateRange === '7D' ? 7 * 86400000 : dateRange === '30D' ? 30 * 86400000 : 86400000;
        return bookingsList.filter((b) => {
            if (dateRange === 'TODAY') {
                if (b.packingDate === todayStr) return true;
                if (b.createdAtDb && b.createdAtDb.slice(0, 10) === todayStr) return true;
            }
            const ts = b.createdAtDb ? new Date(b.createdAtDb).getTime() : 0;
            return ts > 0 ? (now - ts) <= msWindow : true;
        });
    }, [bookingsList, dateRange]);

    const hatcheryProfilesMap = kvStore.hatchery_profiles || {};
    const brokerProfilesMap = kvStore.broker_profiles || {};
    const liveVideoReqs = Array.isArray(kvStore.live_videos) ? kvStore.live_videos : [];

    // KPI Metrics
    const stats = useMemo(() => {
        const isCancelledFn = (b) =>
            b.packingStatus === 'CANCELLED' ||
            b.settlement?.status === 'CANCELLED_NON_REFUNDABLE' ||
            b.settlement?.status === 'CANCELLED_REFUNDED';

        const activeBookings = dateFilteredBookings.filter((b) => !isCancelledFn(b));
        const settledBookings = dateFilteredBookings.filter((b) => b.settlement?.status === 'BALANCE_CLEARED');
        const cancelledBookings = dateFilteredBookings.filter(isCancelledFn);

        const totalGmv = activeBookings.reduce((s, b) => s + (Number(b.totalSeedCost) || 0), 0);
        const platform2Pct = activeBookings.reduce(
            (s, b) => s + (Number(b.settlement?.platform2Pct) || Math.round((Number(b.totalSeedCost) || 0) * 0.02)),
            0
        );
        const totalAdvanceCollected = activeBookings.reduce((s, b) => s + (Number(b.tokenAdvance) || 0), 0);
        const totalPendingBalance = activeBookings.reduce((s, b) => s + (Number(b.balanceAtPacking) || 0), 0);
        const totalPlBooked = activeBookings.reduce((s, b) => s + (Number(b.quantity) || 0), 0);

        const buyers = usersList.filter((u) => u.role === 'buyer').length;
        const sellers = usersList.filter((u) => u.role === 'seller').length;
        const brokers = usersList.filter((u) => u.role === 'mediator').length;
        const liveBatches = batchesList.filter((b) => !b.paused && (b.availableStock || 0) > 0).length;
        const totalStockPl = batchesList.filter((b) => !b.paused).reduce((s, b) => s + (Number(b.availableStock) || 0), 0);

        return {
            totalGmv,
            platform2Pct,
            totalAdvanceCollected,
            totalPendingBalance,
            totalPlBooked,
            totalBookings: dateFilteredBookings.length,
            activeCount: activeBookings.length,
            settledCount: settledBookings.length,
            cancelledCount: cancelledBookings.length,
            buyers,
            sellers,
            brokers,
            liveBatches,
            totalBatches: batchesList.length,
            totalStockPl,
        };
    }, [dateFilteredBookings, usersList, batchesList]);

    // Duplicate UTR & Security Fraud Watchdog
    const securityAlerts = useMemo(() => {
        const alerts = [];
        const utrMap = {};
        bookingsList.forEach((bk) => {
            const refs = [bk.paymentId, bk.balancePaymentRef, bk.finalPaymentId].filter(Boolean);
            refs.forEach((r) => {
                const key = String(r).trim().toUpperCase();
                if (!key) return;
                if (!utrMap[key]) utrMap[key] = [];
                utrMap[key].push(bk.bookingId);
            });
            if ((Number(bk.tokenAdvance) || 0) > 80000 && bk.paymentMode === 'DIRECT_UPI') {
                alerts.push({
                    severity: 'high',
                    title: `UPI > ₹80,000 Detected (${bk.bookingId})`,
                    detail: `${bk.farmerName} recorded ₹${(bk.tokenAdvance || 0).toLocaleString('en-IN')} via DIRECT_UPI.`,
                    booking: bk,
                });
            }
            if (!bk.paymentId || String(bk.paymentId).length < 8) {
                alerts.push({
                    severity: 'medium',
                    title: `Missing / Short Payment Ref (${bk.bookingId})`,
                    detail: `Booking by ${bk.farmerName} has unusual payment ref: "${bk.paymentId || 'EMPTY'}"`,
                    booking: bk,
                });
            }
        });

        Object.entries(utrMap).forEach(([ref, ids]) => {
            if (ids.length > 1) {
                alerts.push({
                    severity: 'high',
                    title: `Duplicate Payment Ref / UTR Found`,
                    detail: `Reference "${ref}" appears on ${ids.length} bookings: ${ids.join(', ')}`,
                    booking: bookingsList.find((b) => b.bookingId === ids[0]),
                });
            }
        });

        const unhashedUsers = usersList.filter((u) => u.password && !String(u.password).startsWith('pbkdf2_v1$'));
        if (unhashedUsers.length > 0) {
            alerts.push({
                severity: 'info',
                title: `${unhashedUsers.length} Legacy Password Account(s)`,
                detail: 'These accounts will automatically upgrade to PBKDF2-SHA256 hash on their next login.',
            });
        }

        return alerts;
    }, [bookingsList, usersList]);

    // Zone-wise Analytics & Top Hatcheries Leaderboard
    const analyticsData = useMemo(() => {
        const zoneMap = {};
        const hatcheryMap = {};
        const activeBks = dateFilteredBookings.filter(
            (b) => b.packingStatus !== 'CANCELLED' && b.settlement?.status !== 'CANCELLED_NON_REFUNDABLE'
        );

        activeBks.forEach((bk) => {
            const zone = bk.batch?.zone || 'Other Zone';
            const gmv = Number(bk.totalSeedCost) || 0;
            const qty = Number(bk.quantity) || 0;
            if (!zoneMap[zone]) zoneMap[zone] = { zone, gmv: 0, orders: 0, pl: 0 };
            zoneMap[zone].gmv += gmv;
            zoneMap[zone].orders += 1;
            zoneMap[zone].pl += qty;

            const hKey = bk.hatcheryOwnerPhone || bk.batch?.realName || 'Unknown';
            if (!hatcheryMap[hKey]) {
                hatcheryMap[hKey] = {
                    phone: bk.hatcheryOwnerPhone,
                    name: bk.batch?.realName || hatcheryProfilesMap[bk.hatcheryOwnerPhone]?.realName || 'Hatchery',
                    zone,
                    gmv: 0,
                    orders: 0,
                    settled: 0,
                    pl: 0,
                };
            }
            hatcheryMap[hKey].gmv += gmv;
            hatcheryMap[hKey].orders += 1;
            hatcheryMap[hKey].pl += qty;
            if (bk.settlement?.status === 'BALANCE_CLEARED') hatcheryMap[hKey].settled += 1;
        });

        const zones = Object.values(zoneMap).sort((a, b) => b.gmv - a.gmv);
        const maxZoneGmv = Math.max(1, ...zones.map((z) => z.gmv));
        const topHatcheries = Object.values(hatcheryMap).sort((a, b) => b.gmv - a.gmv);
        return { zones, maxZoneGmv, topHatcheries };
    }, [dateFilteredBookings, hatcheryProfilesMap]);

    // Broker Payout Ledger
    const brokerLedger = useMemo(() => {
        const map = {};
        usersList
            .filter((u) => u.role === 'mediator')
            .forEach((u) => {
                const cleanPhone = String(u.phone || '').replace(/^mediator_/, '');
                const prof = brokerProfilesMap[cleanPhone] || {};
                map[cleanPhone] = {
                    name: u.name || prof.name || 'Broker',
                    phone: cleanPhone,
                    bank: prof.bankDetails || {},
                    orders: 0,
                    heldComm: 0,
                    clearedComm: 0,
                    extraMargin: 0,
                };
            });

        bookingsList.forEach((bk) => {
            if (!bk.isBrokerLinked) return;
            if (bk.packingStatus === 'CANCELLED' || bk.settlement?.status === 'CANCELLED_NON_REFUNDABLE') return;
            const bPhone = String(bk.brokerPhone || bk.bookedByPhone || '').replace(/\D/g, '').slice(-10);
            if (!bPhone) return;
            if (!map[bPhone]) {
                map[bPhone] = {
                    name: brokerProfilesMap[bPhone]?.name || `Broker (${bPhone})`,
                    phone: bPhone,
                    bank: brokerProfilesMap[bPhone]?.bankDetails || {},
                    orders: 0,
                    heldComm: 0,
                    clearedComm: 0,
                    extraMargin: 0,
                };
            }
            const comm = Number(bk.settlement?.brokerBase2Pct || bk.settlement?.hold2PctAmount) || 0;
            map[bPhone].orders += 1;
            map[bPhone].extraMargin += Number(bk.brokerExtraMarginTotal) || 0;
            if (bk.settlement?.status === 'BALANCE_CLEARED') {
                map[bPhone].clearedComm += comm;
            } else {
                map[bPhone].heldComm += comm;
            }
        });

        return Object.values(map).sort((a, b) => (b.clearedComm + b.heldComm) - (a.clearedComm + a.heldComm));
    }, [usersList, bookingsList, brokerProfilesMap]);

    // Today & Tomorrow Dispatch Queue
    const dispatchQueue = useMemo(() => {
        const today = new Date().toISOString().slice(0, 10);
        const tmr = new Date(Date.now() + 86400000).toISOString().slice(0, 10);
        const active = bookingsList.filter(
            (b) => b.packingStatus !== 'CANCELLED' && b.settlement?.status !== 'CANCELLED_NON_REFUNDABLE'
        );
        return {
            todayStr: today,
            tmrStr: tmr,
            todayList: active.filter((b) => b.packingDate === today),
            tmrList: active.filter((b) => b.packingDate === tmr),
            upcomingList: active.filter((b) => b.packingDate && b.packingDate > tmr).sort((a, b) => String(a.packingDate).localeCompare(String(b.packingDate))),
        };
    }, [bookingsList]);

    // Global Omni-Search Results
    const omniResults = useMemo(() => {
        const q = globalQuery.trim().toLowerCase();
        if (q.length < 2) return null;
        const matchedBookings = bookingsList.filter((b) =>
            `${b.bookingId} ${b.farmerName} ${b.farmerPhone} ${b.batch?.realName} ${b.paymentId} ${b.balancePaymentRef || ''}`.toLowerCase().includes(q)
        ).slice(0, 5);
        const matchedBatches = batchesList.filter((b) =>
            `${b.id} ${b.realName} ${b.hatcheryCode} ${b.zone} ${b.species} ${b.ownerPhone}`.toLowerCase().includes(q)
        ).slice(0, 5);
        const matchedUsers = usersList.filter((u) =>
            `${u.name} ${u.phone} ${u.role}`.toLowerCase().includes(q)
        ).slice(0, 5);
        return { matchedBookings, matchedBatches, matchedUsers, total: matchedBookings.length + matchedBatches.length + matchedUsers.length };
    }, [globalQuery, bookingsList, batchesList, usersList]);

    // Admin Mutating Actions
    const handleAdminMarkSettled = async (bk) => {
        if (!window.confirm(`Mark ${bk.bookingId} as 100% BALANCE_CLEARED & Gate-Pass Completed?`)) return;
        const nowStr = new Date().toLocaleString('en-IN');
        const updated = {
            ...bk,
            fullPaid: true,
            gatePassCleared: true,
            packingStatus: 'FINAL_CLEARED',
            tokenAdvance: bk.totalSeedCost,
            balanceAtPacking: 0,
            clearedAt: nowStr,
            settlement: { ...bk.settlement, status: 'BALANCE_CLEARED' },
        };
        const { error } = await supabase.from('bookings').upsert({
            booking_id: updated.bookingId,
            farmer_phone: updated.farmerPhone,
            farmer_name: updated.farmerName,
            hatchery_owner_phone: updated.hatcheryOwnerPhone,
            quantity: updated.quantity,
            total_seed_cost: updated.totalSeedCost,
            packing_status: updated.packingStatus,
            settlement: updated.settlement,
            data: updated,
        });
        if (error) return notify(`Update failed: ${error.message}`);
        setBookingsList((prev) => prev.map((x) => (x.bookingId === updated.bookingId ? updated : x)));
        setSelectedBooking(updated);
        notify(`Booking ${updated.bookingId} marked 100% Cleared!`);
    };

    const handleAdminCancelBooking = async (bk) => {
        if (!window.confirm(`Cancel Booking ${bk.bookingId} and restore ${(bk.quantity || 0).toLocaleString('en-IN')} PL back to batch stock?`)) return;
        const updated = {
            ...bk,
            packingStatus: 'CANCELLED',
            settlement: { ...bk.settlement, status: 'CANCELLED_NON_REFUNDABLE' },
        };
        const { error } = await supabase.from('bookings').upsert({
            booking_id: updated.bookingId,
            farmer_phone: updated.farmerPhone,
            farmer_name: updated.farmerName,
            hatchery_owner_phone: updated.hatcheryOwnerPhone,
            quantity: updated.quantity,
            total_seed_cost: updated.totalSeedCost,
            packing_status: updated.packingStatus,
            settlement: updated.settlement,
            data: updated,
        });
        if (error) return notify(`Cancel failed: ${error.message}`);

        const targetBatch = batchesList.find((b) => b.id === bk.batch?.id);
        if (targetBatch) {
            const restored = { ...targetBatch, availableStock: (targetBatch.availableStock || 0) + (bk.quantity || 0) };
            await supabase.from('batches').upsert({ id: restored.id, owner_phone: restored.ownerPhone, data: restored });
            setBatchesList((prev) => prev.map((b) => (b.id === restored.id ? restored : b)));
        }
        setBookingsList((prev) => prev.map((x) => (x.bookingId === updated.bookingId ? updated : x)));
        setSelectedBooking(updated);
        notify(`Booking ${updated.bookingId} cancelled & stock restored.`);
    };

    const handleTogglePauseBatch = async (batch) => {
        const updated = { ...batch, paused: !batch.paused };
        const { error } = await supabase.from('batches').upsert({
            id: updated.id,
            owner_phone: updated.ownerPhone,
            data: updated,
        });
        if (error) return notify(`Failed to update batch: ${error.message}`);
        setBatchesList((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        if (selectedBatch?.id === updated.id) setSelectedBatch(updated);
        notify(updated.paused ? `Batch ${updated.id} paused!` : `Batch ${updated.id} resumed LIVE!`);
    };

    const handleDeleteBatch = async (batch) => {
        if (!window.confirm(`Permanently delete Batch ${batch.id} (${batch.realName || batch.hatcheryCode})?`)) return;
        const { error } = await supabase.from('batches').delete().eq('id', batch.id);
        if (error) return notify(`Delete failed: ${error.message}`);
        setBatchesList((prev) => prev.filter((b) => b.id !== batch.id));
        if (selectedBatch?.id === batch.id) setSelectedBatch(null);
        notify(`Batch ${batch.id} deleted.`);
    };

    const handleDeleteUser = async (user) => {
        if (!window.confirm(`Delete user ${user.name} (${user.rawKey || user.phone}) permanently?`)) return;
        const { error } = await supabase.from('app_users').delete().eq('phone', user.rawKey || user.phone);
        if (error) return notify(`Delete failed: ${error.message}`);
        setUsersList((prev) => prev.filter((u) => (u.rawKey || u.phone) !== (user.rawKey || user.phone)));
        setSelectedUser(null);
        notify(`User ${user.name} removed.`);
    };

    const handleSendBroadcast = async (e) => {
        e.preventDefault();
        if (!broadcastTitle.trim() || !broadcastMsg.trim()) return;
        setSendingBroadcast(true);
        try {
            const targets = usersList.filter((u) => broadcastRole === 'ALL' || u.role === broadcastRole);
            const existingNotifs = Array.isArray(kvStore.notifications) ? kvStore.notifications : [];
            const nowStr = new Date().toLocaleString('en-IN');
            const newEntries = targets.map((u, idx) => ({
                id: `ADMIN-${Date.now()}-${idx}`,
                targetPhone: String(u.phone || '').replace(/^(buyer|seller|mediator)_/, ''),
                targetRole: u.role,
                title: `📢 ${broadcastTitle.trim()}`,
                message: broadcastMsg.trim(),
                time: nowStr,
                read: false,
            }));
            const merged = [...newEntries, ...existingNotifs].slice(0, 600);
            const { error } = await supabase.from('app_kv_store').upsert({
                key: 'notifications',
                value: merged,
                updated_at: new Date().toISOString(),
            });
            if (error) {
                notify(`Broadcast failed: ${error.message}`);
            } else {
                setKvStore((prev) => ({ ...prev, notifications: merged }));
                setBroadcastTitle('');
                setBroadcastMsg('');
                notify(`Broadcast sent to ${targets.length} users!`);
            }
        } finally {
            setSendingBroadcast(false);
        }
    };

    const exportCsv = (filename, headers, rows) => {
        const escape = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
        const csv = [headers.map(escape).join(','), ...rows.map((r) => r.map(escape).join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = filename;
        a.click();
        URL.revokeObjectURL(a.href);
    };

    const handlePrintExecutiveReport = () => {
        const win = window.open('', '_blank', 'width=900,height=700');
        if (!win) return notify('Allow popups to print report.');
        win.document.write(`
      <html><head><title>AquaMark Executive Report</title>
      <style>
        body{font-family:system-ui,sans-serif;padding:28px;color:#0f172a}
        h1{margin:0 0 4px;color:#0f766e}
        .grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:18px 0}
        .box{border:1px solid #cbd5e1;border-radius:10px;padding:12px}
        .val{font-size:22px;font-weight:800;margin-top:4px}
        table{width:100%;border-collapse:collapse;margin-top:14px;font-size:12px}
        th,td{border:1px solid #cbd5e1;padding:7px;text-align:left}
        th{background:#f1f5f9}
      </style></head><body>
      <h1>AquaMark — Executive Platform Report</h1>
      <p style="font-size:12px;color:#475569">Generated: ${new Date().toLocaleString('en-IN')} • Filter: ${dateRange}</p>
      <div class="grid">
        <div class="box"><div>AquaMark 2% Share</div><div class="val">₹${stats.platform2Pct.toLocaleString('en-IN')}</div></div>
        <div class="box"><div>Total GMV</div><div class="val">₹${stats.totalGmv.toLocaleString('en-IN')}</div></div>
        <div class="box"><div>Active / Settled</div><div class="val">${stats.activeCount} / ${stats.settledCount}</div></div>
        <div class="box"><div>Total Users</div><div class="val">${usersList.length}</div></div>
      </div>
      <h3>Top Hatcheries by GMV</h3>
      <table><thead><tr><th>Hatchery</th><th>Zone</th><th>Orders</th><th>Settled</th><th>Total PL</th><th>GMV (₹)</th></tr></thead><tbody>
        ${analyticsData.topHatcheries.map((h) => `<tr><td>${h.name}</td><td>${h.zone}</td><td>${h.orders}</td><td>${h.settled}</td><td>${h.pl.toLocaleString('en-IN')}</td><td>₹${h.gmv.toLocaleString('en-IN')}</td></tr>`).join('')}
      </tbody></table>
      <script>window.print();</script>
      </body></html>
    `);
        win.document.close();
    };

    // Filtered lists
    const filteredBookings = useMemo(() => {
        const q = bookingSearch.trim().toLowerCase();
        return dateFilteredBookings.filter((bk) => {
            const isSettled = bk.settlement?.status === 'BALANCE_CLEARED';
            const isCancelled = bk.packingStatus === 'CANCELLED' || bk.settlement?.status === 'CANCELLED_NON_REFUNDABLE' || bk.settlement?.status === 'CANCELLED_REFUNDED';
            if (bookingFilter === 'SETTLED' && !isSettled) return false;
            if (bookingFilter === 'CANCELLED' && !isCancelled) return false;
            if (bookingFilter === 'ADVANCE' && (isSettled || isCancelled)) return false;
            if (q) {
                const hay = `${bk.bookingId} ${bk.farmerName} ${bk.farmerPhone} ${bk.batch?.realName} ${bk.paymentId} ${bk.balancePaymentRef || ''}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [dateFilteredBookings, bookingSearch, bookingFilter]);

    const filteredUsers = useMemo(() => {
        const q = userSearch.trim().toLowerCase();
        return usersList.filter((u) => {
            if (userRoleFilter !== 'ALL' && u.role !== userRoleFilter) return false;
            if (q && !`${u.name} ${u.phone} ${u.role}`.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [usersList, userSearch, userRoleFilter]);

    const filteredBatches = useMemo(() => {
        const q = batchSearch.trim().toLowerCase();
        return batchesList.filter((b) => {
            if (batchStatusFilter === 'LIVE' && (b.paused || (b.availableStock || 0) <= 0)) return false;
            if (batchStatusFilter === 'PAUSED' && !b.paused) return false;
            if (batchStatusFilter === 'SOLD' && (b.availableStock || 0) > 0) return false;
            if (q && !`${b.id} ${b.realName} ${b.hatcheryCode} ${b.zone} ${b.species} ${b.ownerPhone}`.toLowerCase().includes(q)) return false;
            return true;
        });
    }, [batchesList, batchSearch, batchStatusFilter]);

    const pageBg = darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
    const cardBg = darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900';
    const subBg = darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800';
    const inputCls = darkMode ? 'bg-slate-950 border-slate-700 text-white placeholder-slate-500' : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400';

    // LOCKED LOGIN GATE
    if (!isUnlocked) {
        return (
            <div className={`min-h-screen flex items-center justify-center p-4 font-sans ${pageBg}`}>
                <div className={`max-w-md w-full rounded-3xl border p-6 sm:p-8 shadow-xl space-y-5 ${cardBg}`}>
                    <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5 shrink-0">
                            <img src="/favicon.svg" alt="AquaMark" className="w-full h-full object-contain" />
                        </div>
                        <div>
                            <h1 className="text-xl font-black tracking-tight">AquaMark Super Admin</h1>
                            <p className="text-xs opacity-65">Private Owner Command Center • Restricted Access</p>
                        </div>
                    </div>

                    <form onSubmit={handleAdminLogin} className="space-y-4">
                        <div>
                            <label className="text-xs font-bold opacity-75 block mb-1.5">Master Admin Password</label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    autoFocus
                                    value={adminPassInput}
                                    onChange={(e) => { setAuthError(''); setAdminPassInput(e.target.value); }}
                                    placeholder="Enter your secret Cloudflare ADMIN_SECRET"
                                    className={`w-full border rounded-xl px-4 py-3 pr-10 text-sm font-mono ${inputCls}`}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 opacity-60 hover:opacity-100 cursor-pointer"
                                >
                                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {authError && (
                            <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 text-xs font-bold p-3 rounded-xl flex items-start gap-2">
                                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                                <span>{authError}</span>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={authLoading}
                            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2 cursor-pointer"
                        >
                            <Lock className="w-4 h-4" />
                            {authLoading ? 'Verifying...' : 'Unlock Super Admin'}
                        </button>
                    </form>

                    <div className="pt-2 border-t border-slate-500/20 flex items-center justify-between text-[11px] opacity-60">
                        <span>Brute-Force Protected (Cloudflare Worker)</span>
                        <a href="/" className="text-teal-500 font-bold hover:underline">← Main Site</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen font-sans pb-14 overflow-x-hidden ${pageBg}`}>
            {toast && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-teal-500/40 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2 max-w-[92vw]">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span className="truncate">{toast}</span>
                </div>
            )}

            {/* TOP NAVBAR — CLEAN SINGLE-LINE MOBILE ACTIONS */}
            <header className={`border-b sticky top-0 z-40 ${cardBg}`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5">
                            <img src="/favicon.svg" alt="AquaMark" className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-black tracking-tight">AquaMark</h1>
                                <span className="text-[10px] bg-rose-500/15 text-rose-500 border border-rose-500/30 px-2 py-0.5 rounded-full font-extrabold whitespace-nowrap">
                                    SUPER ADMIN
                                </span>
                            </div>
                            <p className="text-[11px] opacity-60 truncate">
                                {lastSyncedAt ? `Last Synced: ${lastSyncedAt} • Zero B2 Cost` : 'Private Command Center'}
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-nowrap items-center justify-between sm:justify-end gap-1.5 sm:gap-2 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={() => setAutoRefresh((p) => !p)}
                            className={`px-2 sm:px-2.5 py-1.5 rounded-xl border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${autoRefresh ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : subBg
                                }`}
                            title="Auto-sync every 30s"
                        >
                            <Clock className="w-3.5 h-3.5 shrink-0" /> {autoRefresh ? 'Live 30s' : 'Auto'}
                        </button>
                        <button
                            type="button"
                            onClick={() => fetchAllData(false)}
                            className={`px-2.5 py-1.5 rounded-xl border text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0 ${subBg}`}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-teal-500 shrink-0 ${loading ? 'animate-spin' : ''}`} /> Sync
                        </button>
                        <button
                            type="button"
                            onClick={handlePrintExecutiveReport}
                            className={`p-1.5 sm:px-2.5 sm:py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer shrink-0 ${subBg}`}
                            title="Print Executive PDF Report"
                        >
                            <Printer className="w-3.5 h-3.5 text-teal-500 shrink-0" />
                            <span className="hidden sm:inline">Report</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-1.5 sm:p-2 rounded-xl border cursor-pointer shrink-0 ${subBg}`}
                            title="Toggle Theme"
                        >
                            {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />}
                        </button>
                        <button
                            type="button"
                            onClick={handleLockAdmin}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-2.5 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap shrink-0"
                        >
                            <LogOut className="w-3.5 h-3.5 shrink-0" /> Lock
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-3 sm:px-6 py-4 sm:py-5 space-y-4 sm:space-y-5">
                {/* GLOBAL OMNI-SEARCH + DATE RANGE BAR */}
                <div className={`rounded-2xl p-3 sm:p-4 border shadow-xs space-y-3 ${cardBg}`}>
                    <div className="flex flex-col md:flex-row md:items-center gap-2.5">
                        <div className="relative flex-1">
                            <Search className="w-4 h-4 opacity-50 absolute left-3.5 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={globalQuery}
                                onChange={(e) => setGlobalQuery(e.target.value)}
                                placeholder="Global Search: Booking ID, UTR, Farmer Phone, Hatchery, Batch ID, Zone..."
                                className={`w-full border rounded-xl pl-10 pr-8 py-2.5 text-xs sm:text-sm ${inputCls}`}
                            />
                            {globalQuery && (
                                <button
                                    type="button"
                                    onClick={() => setGlobalQuery('')}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-xs opacity-60 hover:opacity-100 cursor-pointer font-bold"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        <div className="flex items-center gap-1.5 overflow-x-auto">
                            <Filter className="w-3.5 h-3.5 opacity-60 shrink-0" />
                            {[
                                { id: 'ALL', label: 'All Time' },
                                { id: 'TODAY', label: 'Today' },
                                { id: '7D', label: '7 Days' },
                                { id: '30D', label: '30 Days' },
                            ].map((dr) => (
                                <button
                                    key={dr.id}
                                    type="button"
                                    onClick={() => setDateRange(dr.id)}
                                    className={`px-2.5 py-1.5 rounded-xl border text-[11px] font-bold cursor-pointer whitespace-nowrap shrink-0 ${dateRange === dr.id ? 'bg-teal-600 text-white border-teal-600' : subBg
                                        }`}
                                >
                                    {dr.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* LIVE OMNI-SEARCH DROPDOWN RESULTS */}
                    {omniResults && (
                        <div className={`border rounded-xl p-3 space-y-2.5 text-xs ${subBg}`}>
                            <div className="flex items-center justify-between font-bold">
                                <span className="text-teal-500">Instant Search Results ({omniResults.total})</span>
                                <span className="opacity-60 text-[11px]">Click any item to inspect full details</span>
                            </div>
                            {omniResults.total === 0 ? (
                                <p className="opacity-60 text-center py-2">No matching records found for "{globalQuery}".</p>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                                    {omniResults.matchedBookings.length > 0 && (
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-extrabold uppercase opacity-60">Bookings</span>
                                            {omniResults.matchedBookings.map((bk) => (
                                                <button
                                                    key={bk.bookingId}
                                                    type="button"
                                                    onClick={() => setSelectedBooking(bk)}
                                                    className={`w-full text-left p-2 rounded-lg border hover:border-teal-500 cursor-pointer ${cardBg}`}
                                                >
                                                    <div className="font-mono font-bold text-teal-500">{bk.bookingId}</div>
                                                    <div className="truncate font-bold">{bk.farmerName} • {bk.batch?.realName}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {omniResults.matchedBatches.length > 0 && (
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-extrabold uppercase opacity-60">Hatcheries & Batches</span>
                                            {omniResults.matchedBatches.map((b) => (
                                                <button
                                                    key={b.id}
                                                    type="button"
                                                    onClick={() => setSelectedBatch(b)}
                                                    className={`w-full text-left p-2 rounded-lg border hover:border-teal-500 cursor-pointer ${cardBg}`}
                                                >
                                                    <div className="font-mono font-bold text-teal-500">{b.id}</div>
                                                    <div className="truncate font-bold">{b.realName || b.hatcheryCode} • {b.zone}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    {omniResults.matchedUsers.length > 0 && (
                                        <div className="space-y-1.5">
                                            <span className="text-[10px] font-extrabold uppercase opacity-60">Users</span>
                                            {omniResults.matchedUsers.map((u, idx) => (
                                                <button
                                                    key={`${u.rawKey || u.phone}-${idx}`}
                                                    type="button"
                                                    onClick={() => setSelectedUser(u)}
                                                    className={`w-full text-left p-2 rounded-lg border hover:border-teal-500 cursor-pointer ${cardBg}`}
                                                >
                                                    <div className="font-bold truncate">{u.name}</div>
                                                    <div className="font-mono text-[11px] opacity-70">{u.role} • {String(u.phone || '').replace(/^(buyer|seller|mediator)_/, '')}</div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* CLICKABLE KPI SUMMARY CARDS (TAP TO DRILL DOWN) */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <button
                        type="button"
                        onClick={() => setActiveTab('analytics')}
                        className={`text-left rounded-2xl p-3.5 sm:p-4 border hover:border-emerald-500 transition shadow-xs cursor-pointer ${cardBg}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-emerald-500 inline-flex items-center gap-1">
                                <Wallet className="w-3.5 h-3.5" /> AquaMark 2% Share
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black text-emerald-500 mt-1">
                            ₹{stats.platform2Pct.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[11px] opacity-65 mt-0.5 truncate">GMV: ₹{stats.totalGmv.toLocaleString('en-IN')}</p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('bookings')}
                        className={`text-left rounded-2xl p-3.5 sm:p-4 border hover:border-teal-500 transition shadow-xs cursor-pointer ${cardBg}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-teal-500 inline-flex items-center gap-1">
                                <Package className="w-3.5 h-3.5" /> Bookings ({stats.totalBookings})
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black mt-1">
                            {(stats.totalPlBooked / 100000).toFixed(1).replace(/\.0$/, '')}L <span className="text-xs opacity-60 font-bold">PL</span>
                        </div>
                        <p className="text-[11px] opacity-65 mt-0.5 truncate">
                            {stats.settledCount} Settled • {stats.activeCount - stats.settledCount} Pending • {stats.cancelledCount} Cancel
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('users')}
                        className={`text-left rounded-2xl p-3.5 sm:p-4 border hover:border-indigo-500 transition shadow-xs cursor-pointer ${cardBg}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-indigo-500 inline-flex items-center gap-1">
                                <Users className="w-3.5 h-3.5" /> Total Users
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black mt-1">{usersList.length}</div>
                        <p className="text-[11px] opacity-65 mt-0.5 truncate">
                            {stats.buyers} Buyers • {stats.sellers} Sellers • {stats.brokers} Brokers
                        </p>
                    </button>

                    <button
                        type="button"
                        onClick={() => setActiveTab('hatcheries')}
                        className={`text-left rounded-2xl p-3.5 sm:p-4 border hover:border-amber-500 transition shadow-xs cursor-pointer ${cardBg}`}
                    >
                        <div className="flex items-center justify-between">
                            <span className="text-[11px] font-bold text-amber-500 inline-flex items-center gap-1">
                                <Layers className="w-3.5 h-3.5" /> Live Batches
                            </span>
                            <ChevronRight className="w-3.5 h-3.5 opacity-40" />
                        </div>
                        <div className="text-xl sm:text-2xl font-black mt-1">
                            {stats.liveBatches} <span className="text-xs opacity-60 font-bold">/ {stats.totalBatches}</span>
                        </div>
                        <p className="text-[11px] opacity-65 mt-0.5 truncate">
                            Stock: {(stats.totalStockPl / 100000).toFixed(1).replace(/\.0$/, '')}L PL • Bal: ₹{stats.totalPendingBalance.toLocaleString('en-IN')}
                        </p>
                    </button>
                </div>

                {/* NAVIGATION TABS — SCROLLABLE PILLS ON MOBILE, CLEAN BAR ON LAPTOP */}
                <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 overflow-x-auto ${cardBg}`}>
                    {[
                        { id: 'bookings', label: `Bookings (${filteredBookings.length})`, icon: TrendingUp },
                        { id: 'dispatch', label: `Dispatch (${dispatchQueue.todayList.length + dispatchQueue.tmrList.length})`, icon: Calendar },
                        { id: 'hatcheries', label: `Hatcheries (${batchesList.length})`, icon: Building2 },
                        { id: 'brokers', label: `Brokers (${brokerLedger.length})`, icon: Award },
                        { id: 'users', label: `Users (${usersList.length})`, icon: Users },
                        { id: 'analytics', label: 'Analytics', icon: BarChart3 },
                        { id: 'security', label: `Security (${securityAlerts.length})`, icon: ShieldAlert },
                        { id: 'broadcast', label: 'Broadcast', icon: Megaphone },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 transition ${activeTab === tab.id ? 'bg-teal-600 text-white shadow-xs' : 'opacity-75 hover:opacity-100'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5 shrink-0" /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* ================================================================
            TAB 1: BOOKINGS & PAYMENTS (CLICK ANY CARD FOR FULL DETAILS)
           ================================================================ */}
                {activeTab === 'bookings' && (
                    <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={bookingSearch}
                                    onChange={(e) => setBookingSearch(e.target.value)}
                                    placeholder="Filter bookings by ID, Farmer, Hatchery, UTR..."
                                    className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs ${inputCls}`}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    exportCsv(
                                        `AquaMark_Bookings_${new Date().toISOString().slice(0, 10)}.csv`,
                                        ['Booking ID', 'Date', 'Farmer', 'Phone', 'Hatchery', 'Qty PL', 'Total INR', 'Paid INR', 'Balance INR', 'AquaMark 2%', 'Mode', 'UTR / Ref', 'Status'],
                                        filteredBookings.map((b) => [
                                            b.bookingId, b.date, b.farmerName, b.farmerPhone, b.batch?.realName,
                                            b.quantity, b.totalSeedCost, b.tokenAdvance, b.balanceAtPacking,
                                            b.settlement?.platform2Pct || 0, b.paymentMode, b.paymentId, b.settlement?.status
                                        ])
                                    )
                                }
                                className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${subBg}`}
                            >
                                <Download className="w-3.5 h-3.5 text-teal-500" /> Export CSV
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { id: 'ALL', label: `All (${dateFilteredBookings.length})` },
                                { id: 'ADVANCE', label: `Advance Hold (${stats.activeCount - stats.settledCount})` },
                                { id: 'SETTLED', label: `Settled (${stats.settledCount})` },
                                { id: 'CANCELLED', label: `Cancelled (${stats.cancelledCount})` },
                            ].map((f) => (
                                <button
                                    key={f.id}
                                    type="button"
                                    onClick={() => setBookingFilter(f.id)}
                                    className={`px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${bookingFilter === f.id ? 'bg-teal-600 text-white border-teal-600' : subBg
                                        }`}
                                >
                                    {f.label}
                                </button>
                            ))}
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto space-y-3 pr-1">
                            {filteredBookings.length === 0 ? (
                                <p className="text-xs opacity-60 text-center py-8">No matching bookings found.</p>
                            ) : (
                                filteredBookings.map((bk) => {
                                    const isSettled = bk.settlement?.status === 'BALANCE_CLEARED';
                                    const isCancelled = bk.packingStatus === 'CANCELLED' || bk.settlement?.status === 'CANCELLED_NON_REFUNDABLE';
                                    return (
                                        <div
                                            key={bk.bookingId}
                                            onClick={() => setSelectedBooking(bk)}
                                            className={`border hover:border-teal-500 rounded-xl p-3.5 text-xs space-y-2 cursor-pointer transition ${subBg}`}
                                        >
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <span className="font-mono font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">{bk.bookingId}</span>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isSettled ? 'bg-emerald-500/15 text-emerald-500' : isCancelled ? 'bg-rose-500/15 text-rose-500' : 'bg-amber-500/15 text-amber-500'
                                                        }`}>
                                                        {bk.settlement?.status || 'ADVANCE_HOLD'}
                                                    </span>
                                                    <span className="opacity-60">{bk.date} {bk.time}</span>
                                                </div>
                                                <span className="font-extrabold text-emerald-500 inline-flex items-center gap-1">
                                                    2%: ₹{(bk.settlement?.platform2Pct || 0).toLocaleString('en-IN')} <ChevronRight className="w-3.5 h-3.5" />
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <div>
                                                    <span className="opacity-60 block text-[10px]">Farmer</span>
                                                    <b>{bk.farmerName}</b> (+91 {bk.farmerPhone})
                                                </div>
                                                <div>
                                                    <span className="opacity-60 block text-[10px]">Hatchery & Packing</span>
                                                    <b>{bk.batch?.realName}</b> • {(bk.quantity || 0).toLocaleString('en-IN')} PL ({bk.packingDate})
                                                </div>
                                                <div>
                                                    <span className="opacity-60 block text-[10px]">Payment & Ref</span>
                                                    <b>₹{(bk.tokenAdvance || 0).toLocaleString('en-IN')}</b> / ₹{(bk.totalSeedCost || 0).toLocaleString('en-IN')}
                                                    <div className="font-mono text-[10px] text-teal-500 truncate">Ref: {bk.paymentId}</div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* ================================================================
            TAB 2: TODAY & TOMORROW LIVE PACKING DISPATCH + VIDEO REQUESTS
           ================================================================ */}
                {activeTab === 'dispatch' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                        <div className={`lg:col-span-2 rounded-2xl p-4 sm:p-5 border shadow-xs space-y-4 ${cardBg}`}>
                            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                                <Calendar className="w-5 h-5 text-teal-500" /> Live Packing Dispatch Queue
                            </h3>
                            {[
                                { title: `Today (${dispatchQueue.todayStr})`, list: dispatchQueue.todayList, badge: 'bg-rose-500/15 text-rose-500' },
                                { title: `Tomorrow (${dispatchQueue.tmrStr})`, list: dispatchQueue.tmrList, badge: 'bg-amber-500/15 text-amber-500' },
                                { title: 'Upcoming Scheduled', list: dispatchQueue.upcomingList.slice(0, 12), badge: 'bg-teal-500/15 text-teal-500' },
                            ].map((grp) => (
                                <div key={grp.title} className="space-y-2">
                                    <div className="flex items-center justify-between text-xs font-extrabold">
                                        <span>{grp.title}</span>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] ${grp.badge}`}>{grp.list.length} Orders</span>
                                    </div>
                                    {grp.list.length === 0 ? (
                                        <p className="text-xs opacity-50 italic pl-1">No packings scheduled.</p>
                                    ) : (
                                        <div className="space-y-2">
                                            {grp.list.map((bk) => (
                                                <div
                                                    key={bk.bookingId}
                                                    onClick={() => setSelectedBooking(bk)}
                                                    className={`border hover:border-teal-500 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs cursor-pointer ${subBg}`}
                                                >
                                                    <div className="min-w-0">
                                                        <span className="font-mono font-bold text-teal-500">{bk.bookingId}</span> • <b>{bk.batch?.realName}</b>
                                                        <div className="opacity-75 text-[11px]">{bk.farmerName} • {(bk.quantity || 0).toLocaleString('en-IN')} PL • {bk.packingDate} ({bk.packingTimeSlot})</div>
                                                    </div>
                                                    <span className="font-bold text-amber-500">Bal: ₹{(bk.balanceAtPacking || 0).toLocaleString('en-IN')}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>

                        <div className={`rounded-2xl p-4 sm:p-5 border shadow-xs space-y-3 ${cardBg}`}>
                            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                                <Video className="w-5 h-5 text-indigo-500" /> Live Video Requests ({liveVideoReqs.length})
                            </h3>
                            <div className="max-h-[55vh] overflow-y-auto space-y-2.5 pr-1 text-xs">
                                {liveVideoReqs.length === 0 ? (
                                    <p className="opacity-60 text-center py-6">No live video requests yet.</p>
                                ) : (
                                    liveVideoReqs.map((r) => (
                                        <div key={r.id} className={`border rounded-xl p-3 space-y-1 ${subBg}`}>
                                            <div className="flex items-center justify-between">
                                                <span className="font-mono font-bold text-teal-500">{r.batchId}</span>
                                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${r.status === 'COMPLETED' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>
                                                    {r.status === 'COMPLETED' ? 'Done' : 'Pending'}
                                                </span>
                                            </div>
                                            <p className="font-bold">{r.farmerName} (+91 {r.farmerWhatsapp || r.farmerPhone})</p>
                                            <p className="opacity-65 text-[11px]">Hatchery: +91 {r.hatcheryOwnerPhone} • {r.requestedAt}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* ================================================================
            TAB 3: HATCHERIES & BATCHES CONTROL (CLICK FOR FULL DETAILS)
           ================================================================ */}
                {activeTab === 'hatcheries' && (
                    <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={batchSearch}
                                    onChange={(e) => setBatchSearch(e.target.value)}
                                    placeholder="Search Batch ID, Hatchery Name, Zone, Phone..."
                                    className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs ${inputCls}`}
                                />
                            </div>
                            <div className="flex flex-wrap items-center gap-1.5">
                                {['ALL', 'LIVE', 'PAUSED', 'SOLD'].map((st) => (
                                    <button
                                        key={st}
                                        type="button"
                                        onClick={() => setBatchStatusFilter(st)}
                                        className={`px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${batchStatusFilter === st ? 'bg-teal-600 text-white border-teal-600' : subBg
                                            }`}
                                    >
                                        {st}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto space-y-3 pr-1">
                            {filteredBatches.length === 0 ? (
                                <p className="text-xs opacity-60 text-center py-8">No matching batches found.</p>
                            ) : (
                                filteredBatches.map((b) => (
                                    <div
                                        key={b.id}
                                        onClick={() => setSelectedBatch(b)}
                                        className={`border hover:border-teal-500 rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs cursor-pointer transition ${subBg}`}
                                    >
                                        <div className="space-y-1 min-w-0 flex-1">
                                            <div className="flex flex-wrap items-center gap-1.5">
                                                <span className="font-mono font-bold text-teal-500">{b.id}</span>
                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${b.paused ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'}`}>
                                                    {b.paused ? 'PAUSED' : 'LIVE'}
                                                </span>
                                                <span className="inline-flex items-center gap-0.5 text-emerald-500 font-bold text-[10px]">
                                                    <ShieldCheck className="w-3 h-3" /> {b.caaLicense || 'CAA'}
                                                </span>
                                            </div>
                                            <p className="font-extrabold text-sm">{b.realName || b.hatcheryCode} • +91 {b.ownerPhone}</p>
                                            <p className="opacity-75">
                                                {b.zone} • {b.species} ({b.plStage}) • ₹{b.pricePer1000}/seed • Stock: <b>{(b.availableStock || 0).toLocaleString('en-IN')} PL</b>
                                            </p>
                                        </div>

                                        <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                                            <button
                                                type="button"
                                                onClick={() => handleTogglePauseBatch(b)}
                                                className={`px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer ${b.paused ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/15 border-amber-500/30 text-amber-500'
                                                    }`}
                                            >
                                                {b.paused ? <><PlayCircle className="w-3.5 h-3.5" /> Resume</> : <><PauseCircle className="w-3.5 h-3.5" /> Pause</>}
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => handleDeleteBatch(b)}
                                                className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 px-3 py-2 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                                            >
                                                <Trash2 className="w-3.5 h-3.5" /> Delete
                                            </button>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                )}

                {/* ================================================================
            TAB 4: BROKER COMMISSION & PAYOUT LEDGER
           ================================================================ */}
                {activeTab === 'brokers' && (
                    <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                                <Award className="w-5 h-5 text-indigo-500" /> Broker Commission & Payout Ledger
                            </h3>
                            <button
                                type="button"
                                onClick={() =>
                                    exportCsv(
                                        `AquaMark_Broker_Payouts_${new Date().toISOString().slice(0, 10)}.csv`,
                                        ['Broker Name', 'Phone', 'Orders', 'Held 2% INR', 'Cleared 2% INR', 'Extra Margin INR', 'UPI ID', 'Account No', 'IFSC'],
                                        brokerLedger.map((b) => [b.name, b.phone, b.orders, b.heldComm, b.clearedComm, b.extraMargin, b.bank?.upiId || '', b.bank?.accountNo || '', b.bank?.ifsc || ''])
                                    )
                                }
                                className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${subBg}`}
                            >
                                <Download className="w-3.5 h-3.5 text-teal-500" /> Export Payouts CSV
                            </button>
                        </div>

                        {brokerLedger.length === 0 ? (
                            <p className="text-xs opacity-60 text-center py-8">No brokers registered yet.</p>
                        ) : (
                            <div className="space-y-3">
                                {brokerLedger.map((br) => (
                                    <div key={br.phone} className={`border rounded-xl p-4 space-y-2.5 text-xs ${subBg}`}>
                                        <div className="flex flex-wrap items-center justify-between gap-2">
                                            <div>
                                                <p className="font-extrabold text-sm">{br.name} • +91 {br.phone}</p>
                                                <p className="opacity-70 font-mono text-[11px]">
                                                    UPI: {br.bank?.upiId || 'Not set'} • IFSC: {br.bank?.ifsc || '-'}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-1.5">
                                                {br.bank?.upiId && (
                                                    <button type="button" onClick={() => copyText(br.bank.upiId, 'Broker UPI')} className={`px-2.5 py-1.5 rounded-lg border font-bold inline-flex items-center gap-1 cursor-pointer ${cardBg}`}>
                                                        <Copy className="w-3 h-3" /> Copy UPI
                                                    </button>
                                                )}
                                                <button type="button" onClick={() => openWhatsApp(br.phone, `Hello ${br.name}, AquaMark Admin here regarding your broker payout.`)} className="bg-green-600 text-white px-2.5 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer">
                                                    <Send className="w-3 h-3" /> WhatsApp
                                                </button>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-slate-300/20">
                                            <div><span className="opacity-60 block text-[10px]">Total Orders</span><b>{br.orders}</b></div>
                                            <div><span className="opacity-60 block text-[10px]">Held 2% Comm</span><b className="text-amber-500">₹{br.heldComm.toLocaleString('en-IN')}</b></div>
                                            <div><span className="opacity-60 block text-[10px]">Cleared 2% Comm</span><b className="text-emerald-500">₹{br.clearedComm.toLocaleString('en-IN')}</b></div>
                                            <div><span className="opacity-60 block text-[10px]">Extra Margin</span><b className="text-indigo-400">₹{br.extraMargin.toLocaleString('en-IN')}</b></div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ================================================================
            TAB 5: USERS DIRECTORY (CLICK ANY USER FOR FULL DETAILS)
           ================================================================ */}
                {activeTab === 'users' && (
                    <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={userSearch}
                                    onChange={(e) => setUserSearch(e.target.value)}
                                    placeholder="Search user by Name or Mobile..."
                                    className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs ${inputCls}`}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    exportCsv(
                                        `AquaMark_Users_${new Date().toISOString().slice(0, 10)}.csv`,
                                        ['Name', 'Phone', 'Role', 'Security', 'Last Login'],
                                        filteredUsers.map((u) => [u.name, String(u.phone || '').replace(/^(buyer|seller|mediator)_/, ''), u.role, String(u.password || '').startsWith('pbkdf2_v1$') ? 'PBKDF2 Hashed' : 'Legacy', u.last_login || ''])
                                    )
                                }
                                className={`px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${subBg}`}
                            >
                                <Download className="w-3.5 h-3.5 text-teal-500" /> Export Users CSV
                            </button>
                        </div>

                        <div className="flex flex-wrap items-center gap-1.5">
                            {[
                                { id: 'ALL', label: `All (${usersList.length})` },
                                { id: 'buyer', label: `Buyers (${stats.buyers})` },
                                { id: 'seller', label: `Sellers (${stats.sellers})` },
                                { id: 'mediator', label: `Brokers (${stats.brokers})` },
                            ].map((r) => (
                                <button
                                    key={r.id}
                                    type="button"
                                    onClick={() => setUserRoleFilter(r.id)}
                                    className={`px-3 py-1 rounded-full text-[11px] font-bold border cursor-pointer ${userRoleFilter === r.id ? 'bg-teal-600 text-white border-teal-600' : subBg
                                        }`}
                                >
                                    {r.label}
                                </button>
                            ))}
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto space-y-2.5 pr-1">
                            {filteredUsers.map((u, idx) => {
                                const cleanPh = String(u.phone || '').replace(/^(buyer|seller|mediator)_/, '');
                                const isHashed = String(u.password || '').startsWith('pbkdf2_v1$');
                                return (
                                    <div
                                        key={`${u.rawKey || u.phone}-${idx}`}
                                        onClick={() => setSelectedUser(u)}
                                        className={`border hover:border-teal-500 rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs cursor-pointer transition ${subBg}`}
                                    >
                                        <div>
                                            <p className="font-extrabold text-sm">{u.name || 'Unnamed User'}</p>
                                            <p className="font-mono opacity-75">+91 {cleanPh}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${isHashed ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>
                                                {isHashed ? '🔒 Hashed' : 'Legacy'}
                                            </span>
                                            <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${u.role === 'seller' ? 'bg-teal-500/15 text-teal-500' : u.role === 'mediator' ? 'bg-indigo-500/15 text-indigo-500' : 'bg-emerald-500/15 text-emerald-500'
                                                }`}>
                                                {u.role}
                                            </span>
                                            <ChevronRight className="w-4 h-4 opacity-50" />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* ================================================================
            TAB 6: ZONE ANALYTICS & TOP HATCHERIES LEADERBOARD
           ================================================================ */}
                {activeTab === 'analytics' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-teal-500" /> Coastal Zone-Wise GMV & Demand
                            </h3>
                            {analyticsData.zones.length === 0 ? (
                                <p className="text-xs opacity-60 py-6 text-center">No zone data yet.</p>
                            ) : (
                                <div className="space-y-3">
                                    {analyticsData.zones.map((z) => {
                                        const pct = Math.max(8, Math.round((z.gmv / analyticsData.maxZoneGmv) * 100));
                                        return (
                                            <div key={z.zone} className="space-y-1 text-xs">
                                                <div className="flex items-center justify-between font-bold">
                                                    <span>{z.zone} ({z.orders} orders)</span>
                                                    <span className="text-emerald-500">₹{z.gmv.toLocaleString('en-IN')}</span>
                                                </div>
                                                <div className="h-2.5 rounded-full bg-slate-500/20 overflow-hidden">
                                                    <div className="h-full bg-teal-500 rounded-full" style={{ width: `${pct}%` }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                        </div>

                        <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                            <div className="flex items-center justify-between">
                                <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                                    <Award className="w-5 h-5 text-amber-500" /> Top Hatcheries Leaderboard
                                </h3>
                                <button
                                    type="button"
                                    onClick={() =>
                                        exportCsv(
                                            `AquaMark_Hatchery_Revenue_${new Date().toISOString().slice(0, 10)}.csv`,
                                            ['Hatchery', 'Zone', 'Phone', 'Orders', 'Settled', 'Total PL', 'GMV INR'],
                                            analyticsData.topHatcheries.map((h) => [h.name, h.zone, h.phone, h.orders, h.settled, h.pl, h.gmv])
                                        )
                                    }
                                    className={`px-2.5 py-1.5 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${subBg}`}
                                >
                                    <Download className="w-3 h-3" /> CSV
                                </button>
                            </div>
                            {analyticsData.topHatcheries.length === 0 ? (
                                <p className="text-xs opacity-60 py-6 text-center">No hatchery sales data yet.</p>
                            ) : (
                                <div className="space-y-2.5">
                                    {analyticsData.topHatcheries.map((h, i) => (
                                        <div key={`${h.phone}-${i}`} className={`border rounded-xl p-3 flex items-center justify-between gap-2 text-xs ${subBg}`}>
                                            <div className="min-w-0">
                                                <div className="font-extrabold text-sm truncate">#{i + 1} {h.name}</div>
                                                <div className="opacity-70 text-[11px]">{h.zone} • {h.orders} orders ({h.settled} settled) • {(h.pl / 100000).toFixed(1)}L PL</div>
                                            </div>
                                            <div className="text-right shrink-0">
                                                <div className="font-black text-emerald-500">₹{h.gmv.toLocaleString('en-IN')}</div>
                                                <div className="text-[10px] opacity-65">2%: ₹{Math.round(h.gmv * 0.02).toLocaleString('en-IN')}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* ================================================================
            TAB 7: SECURITY & DUPLICATE UTR FRAUD WATCHDOG
           ================================================================ */}
                {activeTab === 'security' && (
                    <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                        <div>
                            <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                                <ShieldAlert className="w-5 h-5 text-rose-500" /> Payment Fraud & Security Watchdog
                            </h3>
                            <p className="text-xs opacity-65 mt-0.5">Automatically detects duplicate UTRs, ₹80k+ UPI violations, missing payment refs & legacy passwords.</p>
                        </div>
                        {securityAlerts.length === 0 ? (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 p-4 rounded-xl text-xs font-bold flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 shrink-0" /> All bookings, UTR references & accounts passed integrity checks!
                            </div>
                        ) : (
                            <div className="space-y-2.5">
                                {securityAlerts.map((al, idx) => (
                                    <div
                                        key={idx}
                                        onClick={() => al.booking && setSelectedBooking(al.booking)}
                                        className={`border rounded-xl p-3.5 text-xs space-y-1 ${al.booking ? 'cursor-pointer hover:border-teal-500' : ''} ${al.severity === 'high' ? 'border-rose-500/40 bg-rose-500/10' : al.severity === 'medium' ? 'border-amber-500/40 bg-amber-500/10' : subBg
                                            }`}
                                    >
                                        <div className="font-extrabold flex items-center justify-between gap-2">
                                            <span>{al.title}</span>
                                            <span className="uppercase text-[10px] px-2 py-0.5 rounded-full bg-slate-900/40">{al.severity}</span>
                                        </div>
                                        <p className="opacity-85">{al.detail}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* ================================================================
            TAB 8: GLOBAL BROADCAST
           ================================================================ */}
                {activeTab === 'broadcast' && (
                    <form onSubmit={handleSendBroadcast} className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 max-w-2xl ${cardBg}`}>
                        <div>
                            <h3 className="font-extrabold text-base flex items-center gap-2">
                                <Megaphone className="w-5 h-5 text-teal-500" /> Send Global Announcement
                            </h3>
                            <p className="text-xs opacity-65 mt-0.5">Delivers an instant in-app notification bell alert to selected user portals.</p>
                        </div>

                        <div className="space-y-3 text-xs">
                            <div>
                                <label className="font-bold opacity-75 block mb-1">Target Audience</label>
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                                    {[
                                        { id: 'ALL', label: 'All Users' },
                                        { id: 'buyer', label: 'All Buyers' },
                                        { id: 'seller', label: 'All Sellers' },
                                        { id: 'mediator', label: 'All Brokers' },
                                    ].map((opt) => (
                                        <button
                                            key={opt.id}
                                            type="button"
                                            onClick={() => setBroadcastRole(opt.id)}
                                            className={`py-2 px-3 rounded-xl border font-bold cursor-pointer ${broadcastRole === opt.id ? 'bg-teal-600 text-white border-teal-600' : subBg
                                                }`}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className="font-bold opacity-75 block mb-1">Notice Title</label>
                                <input
                                    required
                                    type="text"
                                    value={broadcastTitle}
                                    onChange={(e) => setBroadcastTitle(e.target.value)}
                                    placeholder="e.g., Peak Season Hatchery Verification Update"
                                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm ${inputCls}`}
                                />
                            </div>

                            <div>
                                <label className="font-bold opacity-75 block mb-1">Message</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={broadcastMsg}
                                    onChange={(e) => setBroadcastMsg(e.target.value)}
                                    placeholder="Write your announcement in English or Telugu..."
                                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm ${inputCls}`}
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={sendingBroadcast}
                                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-extrabold px-5 py-3 rounded-xl inline-flex items-center gap-2 cursor-pointer"
                            >
                                <Send className="w-4 h-4" /> {sendingBroadcast ? 'Sending...' : 'Send Broadcast Now'}
                            </button>
                        </div>
                    </form>
                )}
            </main>

            {/* ================================================================
          MODAL 1: BOOKING FULL-DETAIL INSPECTOR & DISPUTE RESOLUTION
         ================================================================ */}
            {selectedBooking && (
                <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
                    <div className={`rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border space-y-4 max-h-[88vh] overflow-y-auto ${cardBg}`}>
                        <div className="flex items-start justify-between gap-2 border-b border-slate-500/20 pb-3">
                            <div>
                                <div className="flex items-center gap-2">
                                    <span className="font-mono font-black text-teal-500 text-sm">{selectedBooking.bookingId}</span>
                                    <button type="button" onClick={() => copyText(selectedBooking.bookingId, 'Booking ID')} className="opacity-70 hover:opacity-100 cursor-pointer"><Copy className="w-3.5 h-3.5" /></button>
                                </div>
                                <p className="text-[11px] opacity-65">{selectedBooking.date} • {selectedBooking.time}</p>
                            </div>
                            <button type="button" onClick={() => setSelectedBooking(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer p-1">✕</button>
                        </div>

                        <div className="text-xs space-y-2">
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Status:</span><b className="text-teal-500">{selectedBooking.settlement?.status}</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Farmer:</span><b>{selectedBooking.farmerName} (+91 {selectedBooking.farmerPhone})</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Hatchery:</span><b>{selectedBooking.batch?.realName} ({selectedBooking.batch?.id})</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Quantity + Bonus:</span><b>{(selectedBooking.quantity || 0).toLocaleString('en-IN')} + {(selectedBooking.bonusSeeds || 0).toLocaleString('en-IN')} PL</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Packing Slot:</span><b>{selectedBooking.packingDate} ({selectedBooking.packingTimeSlot})</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Total Cost:</span><b>₹{(selectedBooking.totalSeedCost || 0).toLocaleString('en-IN')}</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Paid Now / Advance:</span><b className="text-emerald-500">₹{(selectedBooking.tokenAdvance || 0).toLocaleString('en-IN')}</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Balance at Packing:</span><b className="text-amber-500">₹{(selectedBooking.balanceAtPacking || 0).toLocaleString('en-IN')}</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>AquaMark 2% Share:</span><b className="text-emerald-500">₹{(selectedBooking.settlement?.platform2Pct || 0).toLocaleString('en-IN')}</b></div>
                            <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Gate-Pass PIN:</span><b className="font-mono">{selectedBooking.gatePassPin} {selectedBooking.gatePassCleared ? '✓ Cleared' : '(Pending)'}</b></div>
                            <div className="py-1">
                                <span className="opacity-70 block">Payment Ref / UTR ({selectedBooking.paymentMode}):</span>
                                <div className="flex items-center justify-between gap-2 mt-1">
                                    <b className="font-mono text-teal-500 break-all">{selectedBooking.paymentId}</b>
                                    <button type="button" onClick={() => copyText(selectedBooking.paymentId, 'UTR')} className={`px-2 py-1 rounded-lg border text-[11px] font-bold cursor-pointer shrink-0 ${subBg}`}>Copy</button>
                                </div>
                                {selectedBooking.balancePaymentRef && (
                                    <div className="font-mono text-[11px] text-emerald-500 mt-1 break-all">Balance Ref: {selectedBooking.balancePaymentRef}</div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-500/20 text-xs">
                            <a href={`tel:+91${selectedBooking.farmerPhone}`} className={`py-2 px-3 rounded-xl border font-bold inline-flex items-center justify-center gap-1.5 ${subBg}`}>
                                <PhoneCall className="w-3.5 h-3.5 text-teal-500" /> Call Farmer
                            </a>
                            <button type="button" onClick={() => openWhatsApp(selectedBooking.hatcheryOwnerPhone, `Hello from AquaMark Admin regarding Booking ${selectedBooking.bookingId}.`)} className="bg-green-600 text-white py-2 px-3 rounded-xl font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                <Send className="w-3.5 h-3.5" /> WhatsApp Hatchery
                            </button>
                            {selectedBooking.settlement?.status !== 'BALANCE_CLEARED' && selectedBooking.packingStatus !== 'CANCELLED' && (
                                <>
                                    <button type="button" onClick={() => handleAdminMarkSettled(selectedBooking)} className="bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-3 rounded-xl font-bold cursor-pointer">
                                        Mark 100% Cleared
                                    </button>
                                    <button type="button" onClick={() => handleAdminCancelBooking(selectedBooking)} className="bg-rose-500/15 border border-rose-500/30 text-rose-500 py-2 px-3 rounded-xl font-bold cursor-pointer">
                                        Cancel & Restore
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* ================================================================
          MODAL 2: HATCHERY & BATCH FULL-DETAIL INSPECTOR
         ================================================================ */}
            {selectedBatch && (() => {
                const prof = hatcheryProfilesMap[selectedBatch.ownerPhone] || {};
                const batchBks = bookingsList.filter((b) => b.batch?.id === selectedBatch.id && b.packingStatus !== 'CANCELLED');
                const batchGmv = batchBks.reduce((s, b) => s + (Number(b.totalSeedCost) || 0), 0);
                return (
                    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
                        <div className={`rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border space-y-4 max-h-[88vh] overflow-y-auto ${cardBg}`}>
                            <div className="flex items-start justify-between gap-2 border-b border-slate-500/20 pb-3">
                                <div>
                                    <span className="font-mono text-xs font-bold text-teal-500">{selectedBatch.id}</span>
                                    <h3 className="font-extrabold text-base">{selectedBatch.realName || selectedBatch.hatcheryCode}</h3>
                                </div>
                                <button type="button" onClick={() => setSelectedBatch(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer p-1">✕</button>
                            </div>

                            <div className="text-xs space-y-2">
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Owner Mobile:</span><b className="font-mono">+91 {selectedBatch.ownerPhone}</b></div>
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>CAA License:</span><b className="font-mono">{selectedBatch.caaLicense || prof.caaLicense || '-'}</b></div>
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Coastal Zone:</span><b>{selectedBatch.zone}</b></div>
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Species / Stage:</span><b>{selectedBatch.species} ({selectedBatch.plStage})</b></div>
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Rate / Bonus / Salinity:</span><b>₹{selectedBatch.pricePer1000} • +{selectedBatch.bonusPercent}% • {selectedBatch.salinity} PPT</b></div>
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Available Stock:</span><b>{(selectedBatch.availableStock || 0).toLocaleString('en-IN')} PL</b></div>
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Orders / GMV:</span><b className="text-emerald-500">{batchBks.length} Orders • ₹{batchGmv.toLocaleString('en-IN')}</b></div>
                                {prof.bankDetails?.upiId && (
                                    <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Hatchery UPI:</span><b className="font-mono text-teal-500">{prof.bankDetails.upiId}</b></div>
                                )}
                                {(selectedBatch.googleMapsLink || prof.googleMapsLink) && (
                                    <a href={selectedBatch.googleMapsLink || prof.googleMapsLink} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-emerald-500 font-bold hover:underline pt-1">
                                        <MapPin className="w-3.5 h-3.5" /> Open Hatchery Google Maps <ExternalLink className="w-3 h-3" />
                                    </a>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-500/20 text-xs">
                                <button type="button" onClick={() => openWhatsApp(selectedBatch.ownerPhone, `Hello ${selectedBatch.realName}, AquaMark Admin here.`)} className="bg-green-600 text-white py-2 px-3 rounded-xl font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                    <Send className="w-3.5 h-3.5" /> WhatsApp Owner
                                </button>
                                <button type="button" onClick={() => handleTogglePauseBatch(selectedBatch)} className="bg-amber-500/15 border border-amber-500/30 text-amber-500 py-2 px-3 rounded-xl font-bold cursor-pointer">
                                    {selectedBatch.paused ? 'Resume Live' : 'Pause Batch'}
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}

            {/* ================================================================
          MODAL 3: USER FULL-DETAIL INSPECTOR
         ================================================================ */}
            {selectedUser && (() => {
                const cleanPh = String(selectedUser.phone || '').replace(/^(buyer|seller|mediator)_/, '');
                const userBks = bookingsList.filter(
                    (b) => b.farmerPhone === cleanPh || b.hatcheryOwnerPhone === cleanPh || b.brokerPhone === cleanPh
                );
                const totalVol = userBks.filter((b) => b.packingStatus !== 'CANCELLED').reduce((s, b) => s + (Number(b.totalSeedCost) || 0), 0);
                return (
                    <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
                        <div className={`rounded-2xl max-w-md w-full p-5 sm:p-6 shadow-2xl border space-y-4 ${cardBg}`}>
                            <div className="flex items-start justify-between gap-2 border-b border-slate-500/20 pb-3">
                                <div>
                                    <span className="uppercase text-[10px] font-extrabold text-teal-500">{selectedUser.role}</span>
                                    <h3 className="font-extrabold text-base">{selectedUser.name || 'Unnamed User'}</h3>
                                </div>
                                <button type="button" onClick={() => setSelectedUser(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer p-1">✕</button>
                            </div>

                            <div className="text-xs space-y-2">
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Mobile:</span><b className="font-mono">+91 {cleanPh}</b></div>
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Password Security:</span><b className={String(selectedUser.password || '').startsWith('pbkdf2_v1$') ? 'text-emerald-500' : 'text-amber-500'}>{String(selectedUser.password || '').startsWith('pbkdf2_v1$') ? 'PBKDF2-SHA256 Hashed' : 'Legacy (Auto-upgrades on login)'}</b></div>
                                <div className="flex justify-between py-1 border-b border-slate-500/15"><span>Related Bookings:</span><b>{userBks.length} Orders (₹{totalVol.toLocaleString('en-IN')})</b></div>
                                <div className="flex justify-between py-1"><span>Last Login:</span><b>{selectedUser.last_login ? new Date(selectedUser.last_login).toLocaleString('en-IN') : '-'}</b></div>
                            </div>

                            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-500/20 text-xs">
                                <a href={`tel:+91${cleanPh}`} className={`py-2 px-3 rounded-xl border font-bold inline-flex items-center justify-center gap-1.5 ${subBg}`}>
                                    <PhoneCall className="w-3.5 h-3.5 text-teal-500" /> Call User
                                </a>
                                <button type="button" onClick={() => openWhatsApp(cleanPh, `Hello ${selectedUser.name}, AquaMark Support here.`)} className="bg-green-600 text-white py-2 px-3 rounded-xl font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                    <Send className="w-3.5 h-3.5" /> WhatsApp
                                </button>
                                <button type="button" onClick={() => handleDeleteUser(selectedUser)} className="col-span-2 bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 py-2 px-3 rounded-xl font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                    <Trash2 className="w-3.5 h-3.5" /> Remove Account
                                </button>
                            </div>
                        </div>
                    </div>
                );
            })()}
        </div>
    );
}