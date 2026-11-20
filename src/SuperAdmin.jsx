import React, { useState, useEffect, useMemo } from 'react';
import {
    ShieldCheck, Lock, LogOut, RefreshCw, Search, Download,
    Users, Building2, Package, Wallet, TrendingUp, CheckCircle2,
    PauseCircle, PlayCircle, Trash2, Megaphone, Sun, Moon,
    Eye, EyeOff, AlertTriangle, Send, Copy, Layers
} from 'lucide-react';
import { supabase } from './supabaseClient';

// ============================================================================
// AQUA MARK — PRIVATE SUPER ADMIN COMMAND CENTER
// - Zero database schema changes (uses existing app_users, batches, bookings, app_kv_store)
// - Zero Backblaze B2 calls (does not auto-fetch media)
// - Server-verified login via Cloudflare Worker (/api/admin-auth + ADMIN_SECRET env var)
// ============================================================================

export default function SuperAdmin() {
    const [isUnlocked, setIsUnlocked] = useState(() => sessionStorage.getItem('aqm_super_admin_ok') === '1');
    const [adminPassInput, setAdminPassInput] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    const [darkMode, setDarkMode] = useState(true);
    const [activeTab, setActiveTab] = useState('bookings'); // bookings | hatcheries | users | broadcast
    const [loading, setLoading] = useState(false);
    const [toast, setToast] = useState('');

    const [usersList, setUsersList] = useState([]);
    const [batchesList, setBatchesList] = useState([]);
    const [bookingsList, setBookingsList] = useState([]);
    const [kvStore, setKvStore] = useState({});

    // Filters
    const [bookingSearch, setBookingSearch] = useState('');
    const [bookingFilter, setBookingFilter] = useState('ALL'); // ALL | ADVANCE | SETTLED | CANCELLED
    const [userSearch, setUserSearch] = useState('');
    const [userRoleFilter, setUserRoleFilter] = useState('ALL'); // ALL | buyer | seller | mediator
    const [batchSearch, setBatchSearch] = useState('');

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
            // 1. Live Cloudflare Pages: Verify against server-side ADMIN_SECRET in _worker.js
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

            if (res.status === 401) {
                setAuthError('Incorrect Super Admin password.');
                setAuthLoading(false);
                return;
            }

            if (res.status === 503) {
                setAuthError('ADMIN_SECRET is not set in Cloudflare Pages Environment Variables yet.');
                setAuthLoading(false);
                return;
            }

            // 2. Localhost Vite dev fallback (only when running locally without Cloudflare Worker)
            const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
            const localSecret = import.meta.env.VITE_ADMIN_SECRET;
            if (isLocal && localSecret && pwd === localSecret) {
                sessionStorage.setItem('aqm_super_admin_ok', '1');
                setIsUnlocked(true);
                setAdminPassInput('');
                setAuthLoading(false);
                return;
            }

            setAuthError('Verification failed. Check your password or Cloudflare ADMIN_SECRET setup.');
        } catch {
            // Offline / local Vite fallback
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

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [uRes, bRes, bkRes, kvRes] = await Promise.all([
                supabase.from('app_users').select('*'),
                supabase.from('batches').select('*').order('created_at', { ascending: false }),
                supabase.from('bookings').select('*').order('created_at', { ascending: false }),
                supabase.from('app_kv_store').select('*'),
            ]);

            if (uRes.data) {
                setUsersList(uRes.data.map((r) => ({ ...r, ...(r.data || {}) })));
            }
            if (bRes.data) {
                setBatchesList(bRes.data.map((r) => ({ ...(r.data || {}), id: r.id })));
            }
            if (bkRes.data) {
                setBookingsList(bkRes.data.map((r) => ({ ...(r.data || {}), bookingId: r.booking_id || r.data?.bookingId })));
            }
            if (kvRes.data) {
                const map = {};
                kvRes.data.forEach((item) => { map[item.key] = item.value; });
                setKvStore(map);
            }
            notify('Live Supabase data synced!');
        } catch (err) {
            notify(`Sync error: ${err?.message || 'Check connection'}`);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (isUnlocked) {
            fetchAllData();
        }
    }, [isUnlocked]);

    // KPI Metrics
    const stats = useMemo(() => {
        const activeBookings = bookingsList.filter(
            (b) => b.packingStatus !== 'CANCELLED' && b.settlement?.status !== 'CANCELLED_NON_REFUNDABLE' && b.settlement?.status !== 'CANCELLED_REFUNDED'
        );
        const settledBookings = bookingsList.filter((b) => b.settlement?.status === 'BALANCE_CLEARED');
        const cancelledBookings = bookingsList.filter(
            (b) => b.packingStatus === 'CANCELLED' || b.settlement?.status === 'CANCELLED_NON_REFUNDABLE' || b.settlement?.status === 'CANCELLED_REFUNDED'
        );

        const totalGmv = activeBookings.reduce((s, b) => s + (Number(b.totalSeedCost) || 0), 0);
        const platform2Pct = activeBookings.reduce(
            (s, b) => s + (Number(b.settlement?.platform2Pct) || Math.round((Number(b.totalSeedCost) || 0) * 0.02)),
            0
        );
        const totalAdvanceCollected = activeBookings.reduce((s, b) => s + (Number(b.tokenAdvance) || 0), 0);
        const buyers = usersList.filter((u) => u.role === 'buyer').length;
        const sellers = usersList.filter((u) => u.role === 'seller').length;
        const brokers = usersList.filter((u) => u.role === 'mediator').length;
        const liveBatches = batchesList.filter((b) => !b.paused && (b.availableStock || 0) > 0).length;

        return {
            totalGmv,
            platform2Pct,
            totalAdvanceCollected,
            totalBookings: bookingsList.length,
            activeCount: activeBookings.length,
            settledCount: settledBookings.length,
            cancelledCount: cancelledBookings.length,
            buyers,
            sellers,
            brokers,
            liveBatches,
            totalBatches: batchesList.length,
        };
    }, [bookingsList, usersList, batchesList]);

    // Actions
    const handleTogglePauseBatch = async (batch) => {
        const updated = { ...batch, paused: !batch.paused };
        const { error } = await supabase.from('batches').upsert({
            id: updated.id,
            owner_phone: updated.ownerPhone,
            data: updated,
        });
        if (error) {
            notify(`Failed to update batch: ${error.message}`);
            return;
        }
        setBatchesList((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        notify(updated.paused ? `Batch ${updated.id} paused!` : `Batch ${updated.id} resumed live!`);
    };

    const handleDeleteBatch = async (batch) => {
        if (!window.confirm(`Permanently delete Batch ${batch.id} (${batch.realName || batch.hatcheryCode})?`)) return;
        const { error } = await supabase.from('batches').delete().eq('id', batch.id);
        if (error) {
            notify(`Delete failed: ${error.message}`);
            return;
        }
        setBatchesList((prev) => prev.filter((b) => b.id !== batch.id));
        notify(`Batch ${batch.id} deleted from database.`);
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
                targetPhone: u.phone,
                targetRole: u.role,
                title: `📢 ${broadcastTitle.trim()}`,
                message: broadcastMsg.trim(),
                time: nowStr,
                read: false,
            }));
            const merged = [...newEntries, ...existingNotifs].slice(0, 500);
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

    // Filtered lists
    const filteredBookings = useMemo(() => {
        const q = bookingSearch.trim().toLowerCase();
        return bookingsList.filter((bk) => {
            const isSettled = bk.settlement?.status === 'BALANCE_CLEARED';
            const isCancelled = bk.packingStatus === 'CANCELLED' || bk.settlement?.status === 'CANCELLED_NON_REFUNDABLE' || bk.settlement?.status === 'CANCELLED_REFUNDED';
            if (bookingFilter === 'SETTLED' && !isSettled) return false;
            if (bookingFilter === 'CANCELLED' && !isCancelled) return false;
            if (bookingFilter === 'ADVANCE' && (isSettled || isCancelled)) return false;
            if (q) {
                const hay = `${bk.bookingId} ${bk.farmerName} ${bk.farmerPhone} ${bk.batch?.realName} ${bk.paymentId} ${bk.finalPaymentId || ''}`.toLowerCase();
                if (!hay.includes(q)) return false;
            }
            return true;
        });
    }, [bookingsList, bookingSearch, bookingFilter]);

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
            if (!q) return true;
            return `${b.id} ${b.realName} ${b.hatcheryCode} ${b.zone} ${b.species} ${b.ownerPhone}`.toLowerCase().includes(q);
        });
    }, [batchesList, batchSearch]);

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
                            <img src="/favicon.svg" alt="Aqua Mark" className="w-full h-full object-contain" />
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
                        <span>Server-Verified via Cloudflare Worker</span>
                        <a href="/" className="text-teal-500 font-bold hover:underline">← Main Site</a>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen font-sans pb-12 overflow-x-hidden ${pageBg}`}>
            {toast && (
                <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 bg-slate-900 text-white border border-teal-500/40 px-4 py-2.5 rounded-2xl shadow-2xl text-xs font-bold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{toast}</span>
                </div>
            )}

            {/* TOP NAVBAR */}
            <header className={`border-b sticky top-0 z-40 ${cardBg}`}>
                <div className="max-w-7xl mx-auto px-3 sm:px-6 py-3 flex flex-wrap items-center justify-between gap-2.5">
                    <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5">
                            <img src="/favicon.svg" alt="Aqua Mark" className="w-full h-full object-contain" />
                        </div>
                        <div className="min-w-0">
                            <div className="flex items-center gap-2">
                                <h1 className="text-base font-black tracking-tight">AquaMark</h1>
                                <span className="text-[10px] bg-rose-500/15 text-rose-500 border border-rose-500/30 px-2 py-0.5 rounded-full font-extrabold">
                                    SUPER ADMIN
                                </span>
                            </div>
                            <p className="text-[11px] opacity-60 truncate">Private Owner Control Panel • Zero B2 Media Cost</p>
                        </div>
                    </div>

                    <div className="flex flex-nowrap items-center gap-1.5 sm:gap-2">
                        <button
                            type="button"
                            onClick={fetchAllData}
                            className={`px-2.5 sm:px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${subBg}`}
                        >
                            <RefreshCw className={`w-3.5 h-3.5 text-teal-500 ${loading ? 'animate-spin' : ''}`} />
                            <span>Sync</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setDarkMode(!darkMode)}
                            className={`p-2 rounded-xl border cursor-pointer ${subBg}`}
                            title="Toggle Theme"
                        >
                            {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
                        </button>
                        <button
                            type="button"
                            onClick={handleLockAdmin}
                            className="bg-rose-600 hover:bg-rose-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                            <LogOut className="w-3.5 h-3.5" /> Lock
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-3 sm:px-6 py-5 space-y-5">
                {/* KPI SUMMARY CARDS */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <div className={`rounded-2xl p-4 border shadow-xs ${cardBg}`}>
                        <span className="text-[11px] font-bold text-emerald-500 inline-flex items-center gap-1">
                            <Wallet className="w-3.5 h-3.5" /> AquaMark 2% Revenue
                        </span>
                        <div className="text-xl sm:text-2xl font-black text-emerald-500 mt-1">
                            ₹{stats.platform2Pct.toLocaleString('en-IN')}
                        </div>
                        <p className="text-[11px] opacity-65 mt-0.5">Total GMV: ₹{stats.totalGmv.toLocaleString('en-IN')}</p>
                    </div>

                    <div className={`rounded-2xl p-4 border shadow-xs ${cardBg}`}>
                        <span className="text-[11px] font-bold text-teal-500 inline-flex items-center gap-1">
                            <Package className="w-3.5 h-3.5" /> Total Bookings
                        </span>
                        <div className="text-xl sm:text-2xl font-black mt-1">{stats.totalBookings}</div>
                        <p className="text-[11px] opacity-65 mt-0.5">
                            {stats.activeCount} Active • {stats.settledCount} Settled • {stats.cancelledCount} Cancel
                        </p>
                    </div>

                    <div className={`rounded-2xl p-4 border shadow-xs ${cardBg}`}>
                        <span className="text-[11px] font-bold text-indigo-500 inline-flex items-center gap-1">
                            <Users className="w-3.5 h-3.5" /> Registered Users
                        </span>
                        <div className="text-xl sm:text-2xl font-black mt-1">{usersList.length}</div>
                        <p className="text-[11px] opacity-65 mt-0.5">
                            {stats.buyers} Buyers • {stats.sellers} Sellers • {stats.brokers} Brokers
                        </p>
                    </div>

                    <div className={`rounded-2xl p-4 border shadow-xs ${cardBg}`}>
                        <span className="text-[11px] font-bold text-amber-500 inline-flex items-center gap-1">
                            <Layers className="w-3.5 h-3.5" /> Live Seed Batches
                        </span>
                        <div className="text-xl sm:text-2xl font-black mt-1">
                            {stats.liveBatches} <span className="text-xs opacity-60 font-bold">/ {stats.totalBatches}</span>
                        </div>
                        <p className="text-[11px] opacity-65 mt-0.5">
                            Advance Pool: ₹{stats.totalAdvanceCollected.toLocaleString('en-IN')}
                        </p>
                    </div>
                </div>

                {/* NAVIGATION TABS */}
                <div className={`p-1.5 rounded-2xl border flex items-center gap-1.5 overflow-x-auto ${cardBg}`}>
                    {[
                        { id: 'bookings', label: `Bookings & Payments (${bookingsList.length})`, icon: TrendingUp },
                        { id: 'hatcheries', label: `Hatcheries & Batches (${batchesList.length})`, icon: Building2 },
                        { id: 'users', label: `Users (${usersList.length})`, icon: Users },
                        { id: 'broadcast', label: 'Broadcast Notice', icon: Megaphone },
                    ].map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                type="button"
                                onClick={() => setActiveTab(tab.id)}
                                className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap shrink-0 ${activeTab === tab.id ? 'bg-teal-600 text-white' : 'opacity-75 hover:opacity-100'
                                    }`}
                            >
                                <Icon className="w-3.5 h-3.5" /> {tab.label}
                            </button>
                        );
                    })}
                </div>

                {/* TAB 1: BOOKINGS & PAYMENTS */}
                {activeTab === 'bookings' && (
                    <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="relative flex-1 max-w-md">
                                <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                                <input
                                    type="text"
                                    value={bookingSearch}
                                    onChange={(e) => setBookingSearch(e.target.value)}
                                    placeholder="Search Booking ID, Farmer, Hatchery, or UTR..."
                                    className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs ${inputCls}`}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={() =>
                                    exportCsv(
                                        `AquaMark_Bookings_${new Date().toISOString().slice(0, 10)}.csv`,
                                        ['Booking ID', 'Date', 'Farmer', 'Phone', 'Hatchery', 'Qty PL', 'Total INR', 'Advance INR', 'Balance INR', 'AquaMark 2%', 'Payment Mode', 'UTR / Ref', 'Status'],
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
                                { id: 'ALL', label: `All (${bookingsList.length})` },
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
                                        <div key={bk.bookingId} className={`border rounded-xl p-3.5 text-xs space-y-2 ${subBg}`}>
                                            <div className="flex flex-wrap items-center justify-between gap-2">
                                                <div className="flex flex-wrap items-center gap-1.5">
                                                    <button
                                                        type="button"
                                                        onClick={() => copyText(bk.bookingId, 'Booking ID')}
                                                        className="font-mono font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded inline-flex items-center gap-1 cursor-pointer"
                                                    >
                                                        {bk.bookingId} <Copy className="w-3 h-3" />
                                                    </button>
                                                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-extrabold ${isSettled ? 'bg-emerald-500/15 text-emerald-500' : isCancelled ? 'bg-rose-500/15 text-rose-500' : 'bg-amber-500/15 text-amber-500'
                                                        }`}>
                                                        {bk.settlement?.status || 'ADVANCE_HOLD'}
                                                    </span>
                                                    <span className="opacity-60">{bk.date} {bk.time}</span>
                                                </div>
                                                <span className="font-extrabold text-emerald-500">
                                                    AquaMark 2%: ₹{(bk.settlement?.platform2Pct || 0).toLocaleString('en-IN')}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                                <div>
                                                    <span className="opacity-60 block text-[10px]">Farmer</span>
                                                    <b>{bk.farmerName}</b> (+91 {bk.farmerPhone})
                                                </div>
                                                <div>
                                                    <span className="opacity-60 block text-[10px]">Hatchery & Batch</span>
                                                    <b>{bk.batch?.realName}</b> ({bk.batch?.id}) • {(bk.quantity || 0).toLocaleString('en-IN')} PL
                                                </div>
                                                <div>
                                                    <span className="opacity-60 block text-[10px]">Payment & UTR</span>
                                                    <b>₹{(bk.tokenAdvance || 0).toLocaleString('en-IN')}</b> paid / ₹{(bk.totalSeedCost || 0).toLocaleString('en-IN')} total
                                                    <div className="font-mono text-[10px] text-teal-500 break-all">
                                                        Ref: {bk.paymentId} {bk.finalPaymentId ? `| Final: ${bk.finalPaymentId}` : ''}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                        </div>
                    </div>
                )}

                {/* TAB 2: HATCHERIES & BATCHES CONTROL */}
                {activeTab === 'hatcheries' && (
                    <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                        <div className="relative max-w-md">
                            <Search className="w-4 h-4 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                value={batchSearch}
                                onChange={(e) => setBatchSearch(e.target.value)}
                                placeholder="Search Batch ID, Hatchery Name, Zone, Phone..."
                                className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs ${inputCls}`}
                            />
                        </div>

                        <div className="max-h-[65vh] overflow-y-auto space-y-3 pr-1">
                            {filteredBatches.length === 0 ? (
                                <p className="text-xs opacity-60 text-center py-8">No batches found.</p>
                            ) : (
                                filteredBatches.map((b) => (
                                    <div key={b.id} className={`border rounded-xl p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${subBg}`}>
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

                                        <div className="grid grid-cols-2 sm:flex items-center gap-2 shrink-0">
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

                {/* TAB 3: USERS DIRECTORY */}
                {activeTab === 'users' && (
                    <div className={`rounded-2xl p-4 sm:p-6 border shadow-xs space-y-4 ${cardBg}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
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
                                        ['Name', 'Phone', 'Role', 'Joined'],
                                        filteredUsers.map((u) => [u.name, u.phone, u.role, u.created_at || ''])
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
                            {filteredUsers.map((u, idx) => (
                                <div key={`${u.phone}-${u.role}-${idx}`} className={`border rounded-xl p-3 flex flex-wrap items-center justify-between gap-2 text-xs ${subBg}`}>
                                    <div>
                                        <p className="font-extrabold text-sm">{u.name || 'Unnamed User'}</p>
                                        <p className="font-mono opacity-75">+91 {String(u.phone || '').replace(/^(buyer|seller|mediator)_/, '')}</p>
                                    </div>
                                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${u.role === 'seller' ? 'bg-teal-500/15 text-teal-500' : u.role === 'mediator' ? 'bg-indigo-500/15 text-indigo-500' : 'bg-emerald-500/15 text-emerald-500'
                                        }`}>
                                        {u.role}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* TAB 4: GLOBAL BROADCAST */}
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
        </div>
    );
}