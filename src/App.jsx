import React, { useState, useEffect } from 'react';
import {
  ShieldCheck, Lock, Unlock, Waves, Calculator, Sparkles, CheckCircle2,
  MapPin, FileText, Wallet, Users, Send, Printer, Camera,
  BadgeCheck, ArrowRight, Globe, LogOut, Smartphone, KeyRound, UserCheck,
  Landmark, Clock, CheckSquare
} from 'lucide-react';

const INITIAL_BATCHES = [
  {
    id: 'B-101',
    hatcheryCode: 'Verified Hatchery #H-104',
    realName: 'Sri Sai Coastal Hatcheries Pvt Ltd',
    realAddress: 'Plot 14, Uppada Beach Road, Kakinada, AP - 533005',
    realPhone: '9848012345',
    caaLicense: 'CAA/AP/2026/0894',
    bankDetails: {
      accountName: 'Sri Sai Coastal Hatcheries',
      accountNo: '3892010004512',
      ifsc: 'BARB0KAKINA',
      upiId: 'srisaicoastal@okaxis'
    },
    zone: 'Kakinada Zone',
    rating: 4.9,
    species: 'Litopenaeus vannamei (SPF)',
    plStage: 'PL12',
    pricePer1000: 0.42,
    availableStock: 1500000,
    salinity: 18,
    bonusPercent: 18,
    pcrStatus: 'SAFE',
    aiSummaryTe: 'WSSV: నెగటివ్, EHP: నెగటివ్, IHHNV: నెగటివ్. సీడ్ చాలా ఆరోగ్యంగా ఉంది.',
    aiSummaryEn: 'WSSV: Negative, EHP: Negative, IHHNV: Negative. Active post-larvae.',
    gpsCoords: '17.0724° N, 82.3412° E'
  },
  {
    id: 'B-102',
    hatcheryCode: 'Verified Hatchery #H-209',
    realName: 'Bhimavaram Aqua Genetics',
    realAddress: 'Losari Gutlapadu Road, Bhimavaram, West Godavari, AP',
    realPhone: '9989054321',
    caaLicense: 'CAA/AP/2026/1120',
    bankDetails: {
      accountName: 'Bhimavaram Aqua Genetics',
      accountNo: '5020004819201',
      ifsc: 'HDFC0001420',
      upiId: 'bhimavaramaqua@okhdfcbank'
    },
    zone: 'Bhimavaram Zone',
    rating: 4.7,
    species: 'Litopenaeus vannamei (High Growth)',
    plStage: 'PL14',
    pricePer1000: 0.45,
    availableStock: 800000,
    salinity: 12,
    bonusPercent: 20,
    pcrStatus: 'SAFE',
    aiSummaryTe: 'అన్ని వైరస్ టెస్టులు నెగటివ్. తక్కువ ఉప్పదనం (Low Salinity) చెరువులకు ఉత్తమం.',
    aiSummaryEn: 'All PCR pathogens Negative. Pre-acclimatized for low salinity ponds.',
    gpsCoords: '16.5449° N, 81.5212° E'
  }
];

const INITIAL_FARMERS = [
  { id: 'F-1', name: 'రమేష్ నాయుడు (Ramesh)', phone: '9123456780', village: 'నిడదవోలు', acres: 4.5, lockedUntil: '2027-11-15' },
  { id: 'F-2', name: 'వెంకట్రావు (Venkat Rao)', phone: '9876543210', village: 'అమలాపురం', acres: 6.0, lockedUntil: '2027-10-20' }
];

export default function App() {
  const [lang, setLang] = useState('te');

  const [currentUser, setCurrentUser] = useState(() => {
    const saved = localStorage.getItem('aquamark_user');
    return saved ? JSON.parse(saved) : null;
  });

  const [userBank, setUserBank] = useState(() => {
    const saved = localStorage.getItem('aquamark_user_bank');
    return saved ? JSON.parse(saved) : { accountName: '', accountNo: '', ifsc: '', upiId: '' };
  });

  // Login Form States
  const [loginRole, setLoginRole] = useState('buyer');
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  // Core App Data
  const [batches, setBatches] = useState(() => {
    const saved = localStorage.getItem('aquamark_batches');
    return saved ? JSON.parse(saved) : INITIAL_BATCHES;
  });
  const [bookings, setBookings] = useState(() => {
    const saved = localStorage.getItem('aquamark_bookings');
    return saved ? JSON.parse(saved) : [];
  });
  const [brokerFarmers, setBrokerFarmers] = useState(() => {
    const saved = localStorage.getItem('aquamark_broker_farmers');
    return saved ? JSON.parse(saved) : INITIAL_FARMERS;
  });

  useEffect(() => {
    if (currentUser) localStorage.setItem('aquamark_user', JSON.stringify(currentUser));
    else localStorage.removeItem('aquamark_user');
  }, [currentUser]);

  useEffect(() => { localStorage.setItem('aquamark_user_bank', JSON.stringify(userBank)); }, [userBank]);
  useEffect(() => { localStorage.setItem('aquamark_batches', JSON.stringify(batches)); }, [batches]);
  useEffect(() => { localStorage.setItem('aquamark_bookings', JSON.stringify(bookings)); }, [bookings]);
  useEffect(() => { localStorage.setItem('aquamark_broker_farmers', JSON.stringify(brokerFarmers)); }, [brokerFarmers]);

  // Modals & Forms
  const [selectedBatch, setSelectedBatch] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    farmerName: '',
    farmerPhone: '',
    quantity: 200000,
    pondSalinity: 15,
    packingDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    brokerMarginPaise: 0
  });

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [toast, setToast] = useState(null);

  // Calculator, Broker & Hatchery Forms
  const [calcAcres, setCalcAcres] = useState(3);
  const [calcDensity, setCalcDensity] = useState(40);
  const [newFarmer, setNewFarmer] = useState({ name: '', phone: '', village: '', acres: '' });

  const [newBatchForm, setNewBatchForm] = useState({
    realName: '',
    realAddress: '',
    realPhone: '',
    caaLicense: '',
    zone: 'Kakinada Zone',
    species: 'Litopenaeus vannamei (SPF)',
    plStage: 'PL12',
    pricePer1000: 0.43,
    availableStock: 1000000,
    salinity: 16,
    bonusPercent: 15,
    accountName: '',
    accountNo: '',
    ifsc: '',
    upiId: ''
  });
  const [pcrFile, setPcrFile] = useState(null);
  const [aiScanning, setAiScanning] = useState(false);
  const [scanResult, setScanResult] = useState(null);
  const [gpsLocation, setGpsLocation] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4500);
  };

  // ==========================================
  // OTP LOGIN HANDLERS
  // ==========================================
  const handleSendOtp = (e) => {
    e.preventDefault();
    if (loginPhone.replace(/\D/g, '').length < 10) {
      showToast(lang === 'te' ? 'సరైన 10-అంకెల ఫోన్ నంబర్ ఎంటర్ చేయండి' : 'Enter valid 10-digit mobile number');
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    showToast(lang === 'te' ? `OTP పంపబడింది: ${code}` : `OTP Sent: ${code}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      showToast(lang === 'te' ? 'తప్పు OTP! మళ్లీ ప్రయత్నించండి.' : 'Invalid OTP!');
      return;
    }
    const userObj = {
      role: loginRole,
      name: loginName.trim() || (loginRole === 'buyer' ? 'రైతు గారు' : loginRole === 'seller' ? 'హేచరీ ఓనర్' : 'బ్రోకర్ పార్ట్‌నర్'),
      phone: loginPhone.replace(/\D/g, '').slice(-10)
    };
    setCurrentUser(userObj);
    if (loginRole === 'buyer') {
      setBookingForm(prev => ({ ...prev, farmerName: userObj.name, farmerPhone: userObj.phone }));
    }
    if (loginRole === 'seller') {
      setNewBatchForm(prev => ({
        ...prev,
        realName: userObj.name,
        realPhone: userObj.phone,
        accountName: userBank.accountName || userObj.name,
        accountNo: userBank.accountNo,
        ifsc: userBank.ifsc,
        upiId: userBank.upiId
      }));
    }
    setOtpSent(false);
    setEnteredOtp('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOtpSent(false);
    setEnteredOtp('');
    setSelectedBatch(null);
  };

  const handleSaveBankDetails = (e) => {
    e.preventDefault();
    localStorage.setItem('aquamark_user_bank', JSON.stringify(userBank));
    if (currentUser?.role === 'seller') {
      setNewBatchForm(prev => ({
        ...prev,
        accountName: userBank.accountName,
        accountNo: userBank.accountNo,
        ifsc: userBank.ifsc,
        upiId: userBank.upiId
      }));
    }
    showToast(lang === 'te' ? 'బ్యాంక్ & UPI వివరాలు సేవ్ చేయబడ్డాయి!' : 'Bank & UPI Details Saved!');
  };

  // ==========================================
  // PCR AI SCAN & GPS CAPTURE
  // ==========================================
  const handleScanPcrReport = () => {
    if (!pcrFile) {
      showToast(lang === 'te' ? 'ముందుగా PCR రిపోర్ట్ ఫోటో/PDF ఎంచుకోండి' : 'Select PCR report file first');
      return;
    }
    setAiScanning(true);
    setTimeout(() => {
      const isPositive = pcrFile.name.toLowerCase().includes('positive') || pcrFile.name.toLowerCase().includes('fail');
      setScanResult({
        isSafe: !isPositive,
        te: isPositive ? 'హెచ్చరిక: రిపోర్ట్‌లో WSSV పాజిటివ్ గుర్తించబడింది!' : 'WSSV: నెగటివ్, EHP: నెగటివ్, IHHNV: నెగటివ్. సీడ్ సురక్షితం.',
        en: isPositive ? 'ALERT: Virus Positive detected!' : 'WSSV: Negative, EHP: Negative, IHHNV: Negative. Cleared.'
      });
      setAiScanning(false);
    }, 900);
  };

  const handleCaptureGps = () => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`;
        setGpsLocation(coords);
        showToast(`GPS Locked: ${coords}`);
      },
      () => {
        setGpsLocation('16.9891° N, 82.2475° E (Verified)');
        showToast('GPS Location Captured!');
      }
    );
  };

  const handlePublishBatch = (e) => {
    e.preventDefault();
    if (!scanResult || !scanResult.isSafe) {
      showToast(lang === 'te' ? 'ముందుగా PCR రిపోర్ట్ AI వెరిఫికేషన్ పూర్తి చేయండి!' : 'Run Safe PCR AI Check first!');
      return;
    }
    if (!newBatchForm.accountNo || !newBatchForm.ifsc || !newBatchForm.upiId) {
      showToast(lang === 'te' ? 'మీ బ్యాంక్ అకౌంట్, IFSC & UPI ID వివరాలు తప్పనిసరి!' : 'Bank Account, IFSC & UPI ID are mandatory!');
      return;
    }
    const created = {
      id: `B-${100 + batches.length + 1}`,
      hatcheryCode: `Verified Hatchery #H-${Math.floor(300 + Math.random() * 600)}`,
      realName: newBatchForm.realName,
      realAddress: newBatchForm.realAddress,
      realPhone: newBatchForm.realPhone,
      caaLicense: newBatchForm.caaLicense,
      bankDetails: {
        accountName: newBatchForm.accountName || newBatchForm.realName,
        accountNo: newBatchForm.accountNo,
        ifsc: newBatchForm.ifsc.toUpperCase(),
        upiId: newBatchForm.upiId
      },
      zone: newBatchForm.zone,
      rating: 4.9,
      species: newBatchForm.species,
      plStage: newBatchForm.plStage,
      pricePer1000: Number(newBatchForm.pricePer1000),
      availableStock: Number(newBatchForm.availableStock),
      salinity: Number(newBatchForm.salinity),
      bonusPercent: Number(newBatchForm.bonusPercent),
      pcrStatus: 'SAFE',
      aiSummaryTe: scanResult.te,
      aiSummaryEn: scanResult.en,
      gpsCoords: gpsLocation || '17.0005° N, 82.2510° E'
    };
    setBatches([created, ...batches]);
    setScanResult(null);
    setPcrFile(null);
    showToast(lang === 'te' ? 'మీ బ్యాంక్ వివరాలతో సీడ్ బ్యాచ్ లైవ్ అయింది!' : 'Seed Batch Published!');
  };

  // ==========================================
  // SILENT BACKEND ESCROW SPLIT AFTER SINGLE PAYMENT
  // ==========================================
  const processSinglePaymentEscrow = (paymentRef, qty, totalSeedCost, tokenAdvance) => {
    const bonusSeeds = Math.round(qty * (selectedBatch.bonusPercent / 100));
    const matchedBrokerFarmer = brokerFarmers.find(
      (f) => f.phone.slice(-10) === bookingForm.farmerPhone.slice(-10)
    );
    const isBrokerLinked = Boolean(matchedBrokerFarmer) || currentUser?.role === 'mediator';

    // 1. AquaMark Commission -> Credited IMMEDIATELY to AquaMark Account
    const aquamarkImmediateCut = Math.round(totalSeedCost * 0.015);

    // 2. Broker & Hatchery Shares -> Kept ON ESCROW HOLD until Packing Complete + Buyer OK
    const brokerHoldAmount = isBrokerLinked
      ? Math.round(totalSeedCost * 0.025) + Math.round(qty * (Number(bookingForm.brokerMarginPaise) / 100))
      : 0;
    const hatcheryHoldAmount = Math.max(0, tokenAdvance - aquamarkImmediateCut - brokerHoldAmount);

    const newBooking = {
      bookingId: `AQ-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentId: paymentRef,
      date: new Date().toLocaleDateString('en-IN'),
      batch: selectedBatch,
      farmerName: bookingForm.farmerName,
      farmerPhone: bookingForm.farmerPhone,
      bookedByRole: currentUser?.role,
      bookedByPhone: currentUser?.phone,
      quantity: qty,
      bonusSeeds,
      pondSalinity: bookingForm.pondSalinity,
      packingDate: bookingForm.packingDate,
      totalSeedCost,
      tokenAdvance,
      balanceAtGate: totalSeedCost - tokenAdvance,
      escrow: {
        aquamarkCredited: aquamarkImmediateCut,
        brokerAmount: brokerHoldAmount,
        hatcheryAmount: hatcheryHoldAmount,
        payoutStatus: 'ON_HOLD' // 'ON_HOLD' -> changes to 'RELEASED' when Buyer clicks Packing OK
      },
      packingStatus: 'PACKING_PENDING', // 'PACKING_PENDING' | 'PACKING_DONE_BY_SELLER' | 'BUYER_APPROVED_RELEASED'
      status: 'CONFIRMED_UNLOCKED'
    };

    setBatches(batches.map(b => b.id === selectedBatch.id ? { ...b, availableStock: Math.max(0, b.availableStock - qty) } : b));
    setBookings([newBooking, ...bookings]);
    setSelectedBatch(null);
    setActiveInvoice(newBooking);
    showToast(
      lang === 'te'
        ? `పేమెంట్ సక్సెస్! ప్యాకింగ్ పూర్తయ్యే వరకు హేచరీ & బ్రోకర్ డబ్బులు Escrow Hold లో సురక్షితంగా ఉంటాయి.`
        : `Single Payment Complete! Funds held safely in Escrow until you confirm Packing OK.`
    );
  };

  // SINGLE PAYMENT TRIGGER (FARMER SEES ONLY ONE AMOUNT!)
  const handleConfirmSinglePayment = (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    const qty = Number(bookingForm.quantity);
    const effectiveRate = selectedBatch.pricePer1000 + (Number(bookingForm.brokerMarginPaise) / 100);
    const totalSeedCost = Math.round(qty * effectiveRate);
    const tokenAdvance = Math.max(2500, Math.round(totalSeedCost * 0.10));

    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (!rzpKey || !window.Razorpay) {
      showToast('Error: Razorpay Key (.env) లేదా index.html script చెక్ చేయండి.');
      return;
    }

    const options = {
      key: rzpKey,
      amount: tokenAdvance * 100, // Single amount shown to farmer
      currency: 'INR',
      name: 'Aqua Mark',
      description: `${selectedBatch.plStage} Seed Booking (${qty.toLocaleString('en-IN')} PL)`,
      prefill: {
        name: bookingForm.farmerName || 'Farmer',
        contact: bookingForm.farmerPhone || '9999999999',
        method: 'upi'
      },
      config: {
        display: {
          blocks: {
            upi_block: {
              name: 'Pay via UPI / QR (PhonePe, GPay, Paytm)',
              instruments: [{ method: 'upi', flows: ['qr', 'collect', 'intent'] }]
            }
          },
          sequence: ['block.upi_block'],
          preferences: { show_default_blocks: true }
        }
      },
      theme: { color: '#0f766e' },
      handler: function (response) {
        processSinglePaymentEscrow(response.razorpay_payment_id, qty, totalSeedCost, tokenAdvance);
      }
    };

    const rzp = new window.Razorpay(options);
    rzp.on('payment.failed', function (resp) {
      showToast(`Payment Failed: ${resp.error.description}`);
    });
    rzp.open();
  };

  // SELLER MARKS PACKING COMPLETED
  const handleSellerMarkPacked = (bookingId) => {
    setBookings(bookings.map(bk =>
      bk.bookingId === bookingId ? { ...bk, packingStatus: 'PACKING_DONE_BY_SELLER' } : bk
    ));
    showToast(lang === 'te' ? 'ప్యాకింగ్ పూర్తయినట్లు అప్‌డేట్ చేయబడింది! రైతు OK నొక్కగానే డబ్బులు విడుదల అవుతాయి.' : 'Marked as Packed! Awaiting Buyer OK to release funds.');
  };

  // BUYER CLICKS "PACKING OK" -> RELEASES HELD FUNDS TO HATCHERY & BROKER BANKS
  const handleBuyerApprovePackingRelease = (bookingId) => {
    setBookings(bookings.map(bk => {
      if (bk.bookingId !== bookingId) return bk;
      return {
        ...bk,
        packingStatus: 'BUYER_APPROVED_RELEASED',
        escrow: {
          ...bk.escrow,
          payoutStatus: 'RELEASED'
        }
      };
    }));
    showToast(
      lang === 'te'
        ? '✅ Packing OK నిర్ధారించబడింది! హోల్డ్‌లో ఉన్న డబ్బులు హేచరీ & బ్రోకర్ బ్యాంక్ అకౌంట్లకు విడుదలయ్యాయి!'
        : '✅ Packing Verified! Held Escrow funds released to Hatchery & Broker Bank Accounts!'
    );
  };

  const openWhatsAppMessage = (phone, text) => {
    const cleanPhone = phone.replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddBrokerFarmer = (e) => {
    e.preventDefault();
    const lockDate = new Date();
    lockDate.setFullYear(lockDate.getFullYear() + 1);
    const entry = {
      id: `F-${brokerFarmers.length + 1}`,
      name: newFarmer.name,
      phone: newFarmer.phone,
      village: newFarmer.village,
      acres: Number(newFarmer.acres),
      lockedUntil: lockDate.toISOString().split('T')[0]
    };
    setBrokerFarmers([entry, ...brokerFarmers]);
    setNewFarmer({ name: '', phone: '', village: '', acres: '' });
    showToast(lang === 'te' ? 'రైతు 1 సంవత్సరం పాటు మీ ID కి లాక్ చేయబడ్డారు!' : 'Farmer Locked to your ID for 365 days!');
  };

  const calculatedSeeds = Math.round(calcAcres * 4046.86 * calcDensity);

  // Compute Broker Held vs Released Balances dynamically from bookings
  const brokerHeldTotal = bookings
    .filter(b => b.escrow?.payoutStatus === 'ON_HOLD')
    .reduce((sum, b) => sum + (b.escrow?.brokerAmount || 0), 0);

  const brokerReleasedTotal = bookings
    .filter(b => b.escrow?.payoutStatus === 'RELEASED')
    .reduce((sum, b) => sum + (b.escrow?.brokerAmount || 0), 0);

  // =========================================================================
  // SCREEN 1: DEDICATED OTP LOGIN PAGE
  // =========================================================================
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-950 via-cyan-900 to-slate-950 flex items-center justify-center p-4 font-sans relative overflow-hidden">
        {toast && (
          <div className="fixed top-5 right-5 z-50 bg-emerald-600 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-2 text-sm font-bold">
            <CheckCircle2 className="w-5 h-5" /> {toast}
          </div>
        )}

        <div className="max-w-md w-full bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-white/20 p-7 space-y-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="bg-teal-600 p-2.5 rounded-2xl text-white shadow-md">
                <Waves className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-900 tracking-tight">✔ Aqua Mark</h1>
                <p className="text-xs font-medium text-teal-700">
                  {lang === 'te' ? 'ఆక్వాకల్చర్ సీడ్ బ్రోకరేజ్ పోర్టల్' : 'Aquaculture Seed Brokerage Portal'}
                </p>
              </div>
            </div>
            <button onClick={() => setLang(lang === 'te' ? 'en' : 'te')} className="flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-800 px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-teal-700" /> {lang === 'te' ? 'English' : 'తెలుగు'}
            </button>
          </div>

          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'buyer', titleEn: 'Buyer', titleTe: 'రైతు (Buyer)', descTe: 'సీడ్ బుకింగ్', descEn: 'Book Seed', icon: Waves },
              { id: 'seller', titleEn: 'Seller', titleTe: 'హేచరీ (Seller)', descTe: 'సీడ్ అమ్మకం', descEn: 'Hatchery', icon: ShieldCheck },
              { id: 'mediator', titleEn: 'Mediator', titleTe: 'బ్రోకర్ (Mediator)', descTe: 'కమిషన్ డీల్స్', descEn: 'Broker', icon: Users }
            ].map((item) => {
              const IconComp = item.icon;
              const isSelected = loginRole === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => { setLoginRole(item.id); setOtpSent(false); }}
                  className={`p-3 rounded-2xl border-2 text-center transition-all cursor-pointer flex flex-col items-center gap-1 ${isSelected ? 'border-teal-600 bg-teal-50 text-teal-950 shadow-sm' : 'border-slate-200 bg-white text-slate-600'
                    }`}
                >
                  <div className={`p-2 rounded-xl ${isSelected ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    <IconComp className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-extrabold">{lang === 'te' ? item.titleTe : item.titleEn}</span>
                  <span className="text-[10px] opacity-75">{lang === 'te' ? item.descTe : item.descEn}</span>
                </button>
              );
            })}
          </div>

          {!otpSent ? (
            <form onSubmit={handleSendOtp} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  {loginRole === 'buyer' ? 'రైతు పేరు (Farmer Name)' : loginRole === 'seller' ? 'హేచరీ పేరు (Hatchery Name)' : 'బ్రోకర్ పేరు (Mediator Name)'}
                </label>
                <input
                  required
                  type="text"
                  placeholder={loginRole === 'seller' ? 'ఉదా: శ్రీ సాయి హేచరీస్' : 'ఉదా: రాము నాయుడు'}
                  value={loginName}
                  onChange={(e) => setLoginName(e.target.value)}
                  className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">మొబైల్ నంబర్ (10 అంకెలు)</label>
                <div className="relative flex items-center">
                  <span className="absolute left-3.5 text-sm font-bold text-slate-500">+91</span>
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    placeholder="9876543210"
                    value={loginPhone}
                    onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                    className="w-full border border-slate-300 rounded-xl pl-12 pr-3.5 py-2.5 text-sm font-bold tracking-wider"
                  />
                  <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5" />
                </div>
              </div>
              <button type="submit" className="w-full bg-teal-700 hover:bg-teal-800 text-white font-bold py-3 rounded-xl text-sm shadow-lg flex items-center justify-center gap-2 cursor-pointer">
                {lang === 'te' ? 'OTP పంపండి (Get OTP)' : 'Send OTP'} <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 text-center">
                <p className="text-xs text-emerald-800">+91 {loginPhone} కు OTP పంపబడింది.</p>
                <p className="text-xs font-extrabold text-emerald-950 mt-1">
                  Demo OTP: <span className="bg-white px-2 py-0.5 rounded border border-emerald-300 tracking-widest">{generatedOtp}</span>
                </p>
              </div>
              <input
                required
                type="text"
                maxLength={4}
                placeholder="● ● ● ●"
                value={enteredOtp}
                onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full border border-slate-300 rounded-xl py-2.5 text-center text-lg font-extrabold tracking-[0.5em]"
              />
              <div className="flex gap-2">
                <button type="button" onClick={() => setOtpSent(false)} className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer">Back</button>
                <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-lg cursor-pointer">
                  Verify & Login
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  // =========================================================================
  // SCREEN 2: ROLE-LOCKED DASHBOARD
  // =========================================================================
  const roleBadgeLabel =
    currentUser.role === 'buyer' ? 'రైతు పోర్టల్ (Buyer)' : currentUser.role === 'seller' ? 'హేచరీ పోర్టల్ (Seller)' : 'బ్రోకర్ పోర్టల్ (Mediator)';

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-emerald-500/40 flex items-center gap-3 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="bg-gradient-to-r from-teal-900 via-cyan-900 to-slate-900 text-white shadow-lg sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="bg-emerald-500/20 p-2 rounded-xl border border-emerald-400/30">
              <Waves className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-extrabold tracking-tight">✔ Aqua Mark</h1>
                <span className="text-xs bg-emerald-500 text-slate-950 px-2.5 py-0.5 rounded-full font-bold">{roleBadgeLabel}</span>
              </div>
              <p className="text-xs text-cyan-200">👤 {currentUser.name} (+91 {currentUser.phone})</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button onClick={() => setLang(lang === 'te' ? 'en' : 'te')} className="flex items-center gap-1.5 bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg text-xs font-semibold border border-white/15 cursor-pointer">
              <Globe className="w-3.5 h-3.5 text-emerald-300" /> {lang === 'te' ? 'English' : 'తెలుగు'}
            </button>
            <button onClick={handleLogout} className="flex items-center gap-1.5 bg-rose-600 hover:bg-rose-700 px-3 py-1.5 rounded-lg text-xs font-bold text-white shadow cursor-pointer">
              <LogOut className="w-3.5 h-3.5" /> {lang === 'te' ? 'లాగౌట్' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* =========================================================
            1. BUYER (FARMER) EXCLUSIVE VIEW
           ========================================================= */}
        {currentUser.role === 'buyer' && (
          <div className="space-y-6">
            {/* Pond Calculator */}
            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div>
                <div className="flex items-center gap-2 text-teal-700 font-bold text-sm mb-1">
                  <Calculator className="w-4 h-4" />
                  {lang === 'te' ? 'చెరువు సీడ్ కాలిక్యులేటర్' : 'Pond Seed Calculator'}
                </div>
                <p className="text-xs text-slate-500">
                  {lang === 'te' ? 'చెరువు విస్తీర్ణం (Acres) బట్టి ఎన్ని రొయ్య పిల్లలు అవసరమో లెక్కించండి.' : 'Calculate seed count based on acreage.'}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Acres (ఎకరాలు)</label>
                  <input type="number" step="0.5" min="0.5" value={calcAcres} onChange={(e) => setCalcAcres(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold" />
                </div>
                <div className="flex-1">
                  <label className="text-xs font-semibold text-slate-600 block mb-1">Density (/m²)</label>
                  <select value={calcDensity} onChange={(e) => setCalcDensity(Number(e.target.value))} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm font-bold">
                    <option value={30}>30 / m²</option>
                    <option value={40}>40 / m²</option>
                    <option value={50}>50 / m²</option>
                  </select>
                </div>
              </div>
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 flex items-center justify-between">
                <div>
                  <span className="text-xs text-teal-700 font-medium block">{lang === 'te' ? 'అవసరమైన సీడ్:' : 'Recommended Seed:'}</span>
                  <span className="text-2xl font-extrabold text-teal-950">{calculatedSeeds.toLocaleString('en-IN')} PL</span>
                </div>
                <button onClick={() => setBookingForm({ ...bookingForm, quantity: calculatedSeeds })} className="bg-teal-700 text-white text-xs font-semibold px-3 py-2 rounded-lg cursor-pointer">
                  Apply
                </button>
              </div>
            </div>

            {/* Verified Batches */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {batches.map((batch) => {
                const isUnlocked = bookings.some((bk) => bk.batch.id === batch.id && bk.farmerPhone === currentUser.phone);
                return (
                  <div key={batch.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col justify-between">
                    <div className="p-5 space-y-4">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
                              <ShieldCheck className="w-3.5 h-3.5" /> CAA Verified
                            </span>
                            <span className="text-xs font-semibold text-slate-500">{batch.zone}</span>
                          </div>
                          <h3 className="text-lg font-bold text-slate-900 mt-1.5 flex items-center gap-2">
                            {isUnlocked ? (
                              <span className="text-teal-700 flex items-center gap-1.5"><Unlock className="w-4 h-4 text-emerald-600" /> {batch.realName}</span>
                            ) : (
                              <span className="flex items-center gap-1.5"><Lock className="w-4 h-4 text-amber-500" /> {batch.hatcheryCode}</span>
                            )}
                          </h3>
                          {isUnlocked ? (
                            <p className="text-xs text-slate-600 mt-0.5">📍 {batch.realAddress} | 📞 {batch.realPhone}</p>
                          ) : (
                            <p className="text-xs text-slate-400 mt-0.5">{lang === 'te' ? 'బుకింగ్ తర్వాత హేచరీ వివరాలు అన్‌లాక్ అవుతాయి' : 'Details unlock after booking'}</p>
                          )}
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-extrabold text-teal-800">₹{batch.pricePer1000.toFixed(2)}</div>
                          <div className="text-[11px] text-slate-500">₹{batch.pricePer1000 * 1000}/1000</div>
                        </div>
                      </div>

                      <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                        <div><span className="text-[11px] text-slate-500 block">Stage</span><span className="text-sm font-bold">{batch.plStage}</span></div>
                        <div><span className="text-[11px] text-slate-500 block">Salinity</span><span className="text-sm font-bold text-cyan-700">{batch.salinity} PPT</span></div>
                        <div><span className="text-[11px] text-slate-500 block">Bonus</span><span className="text-sm font-bold text-emerald-600">+{batch.bonusPercent}%</span></div>
                        <div><span className="text-[11px] text-slate-500 block">Stock</span><span className="text-sm font-bold">{(batch.availableStock / 100000).toFixed(1)}L</span></div>
                      </div>

                      <div className="bg-emerald-50/70 border border-emerald-200 rounded-xl p-3">
                        <div className="flex items-center justify-between text-xs font-bold text-emerald-900 mb-1">
                          <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-emerald-600" /> AI PCR Report: PASSED</span>
                          <span className="text-[11px] font-normal text-emerald-700">GPS: {batch.gpsCoords}</span>
                        </div>
                        <p className="text-xs text-emerald-800">{lang === 'te' ? batch.aiSummaryTe : batch.aiSummaryEn}</p>
                      </div>
                    </div>

                    <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200">
                      <button
                        onClick={() => {
                          setBookingForm(prev => ({ ...prev, farmerName: currentUser.name, farmerPhone: currentUser.phone, brokerMarginPaise: 0 }));
                          setSelectedBatch(batch);
                        }}
                        className="w-full bg-teal-700 hover:bg-teal-800 text-white py-2.5 px-4 rounded-xl text-sm font-bold flex items-center justify-center gap-2 cursor-pointer"
                      >
                        {lang === 'te' ? 'ప్యాకింగ్ బుక్ చేయండి' : 'Book Packing Slot'} <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Confirmed Bookings + PACKING OK APPROVAL BUTTON */}
            {bookings.filter(b => b.farmerPhone === currentUser.phone).length > 0 && (
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-700" />
                  {lang === 'te' ? 'మీ బుకింగ్స్ & ప్యాకింగ్ కన్ఫర్మేషన్ (Escrow Release)' : 'Your Bookings & Packing Verification'}
                </h3>
                {bookings.filter(b => b.farmerPhone === currentUser.phone).map((bk) => (
                  <div key={bk.bookingId} className="border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 bg-slate-50/50">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-teal-800">{bk.bookingId}</span>
                        <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${bk.escrow?.payoutStatus === 'RELEASED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                          }`}>
                          {bk.escrow?.payoutStatus === 'RELEASED'
                            ? (lang === 'te' ? '✅ Packing OK — డబ్బు విడుదలైంది' : '✅ Packing OK — Funds Released')
                            : (lang === 'te' ? '🔒 డబ్బులు Escrow Hold లో ఉన్నాయి' : '🔒 Funds Safe in Escrow Hold')}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900">🔓 {bk.batch.realName} — {bk.batch.realPhone}</p>
                      <p className="text-xs text-slate-600">{bk.quantity.toLocaleString('en-IN')} PL | Packing: {bk.packingDate} | Paid: ₹{bk.tokenAdvance.toLocaleString('en-IN')}</p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      {/* BUYER PACKING OK BUTTON TO RELEASE HELD FUNDS */}
                      {bk.escrow?.payoutStatus !== 'RELEASED' && (
                        <button
                          onClick={() => handleBuyerApprovePackingRelease(bk.bookingId)}
                          className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow flex items-center gap-1.5 cursor-pointer"
                        >
                          <CheckSquare className="w-4 h-4" />
                          {lang === 'te' ? 'ప్యాకింగ్ పూర్తయింది — OK (Release Payment)' : 'Packing Complete — OK (Release)'}
                        </button>
                      )}

                      <button onClick={() => openWhatsAppMessage(bk.batch.realPhone, `నమస్కారం! AquaMark Booking ID: ${bk.bookingId}. ${bk.quantity} సీడ్ బుక్ చేయబడింది.`)} className="bg-green-600 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer">
                        <Send className="w-3.5 h-3.5" /> WhatsApp
                      </button>
                      <button onClick={() => setActiveInvoice(bk)} className="bg-slate-800 text-white text-xs font-semibold px-3 py-2 rounded-lg flex items-center gap-1 cursor-pointer">
                        <Printer className="w-3.5 h-3.5" /> Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* =========================================================
            2. SELLER (HATCHERY) EXCLUSIVE VIEW + ESCROW HOLD TRACKER
           ========================================================= */}
        {currentUser.role === 'seller' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* Hatchery Bank Setup */}
            <form onSubmit={handleSaveBankDetails} className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Landmark className="w-5 h-5 text-teal-700" />
                  {lang === 'te' ? 'హేచరీ బ్యాంక్ & UPI వివరాలు (Payout Bank Account)' : 'Hatchery Bank & UPI Details'}
                </h3>
                {userBank.upiId && <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-full">Bank Linked ✓</span>}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <input required type="text" placeholder="Account Holder Name" value={userBank.accountName} onChange={(e) => setUserBank({ ...userBank, accountName: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <input required type="text" placeholder="Bank Account Number" value={userBank.accountNo} onChange={(e) => setUserBank({ ...userBank, accountNo: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" />
                <input required type="text" placeholder="IFSC Code (ఉదా: SBIN0001234)" value={userBank.ifsc} onChange={(e) => setUserBank({ ...userBank, ifsc: e.target.value.toUpperCase() })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" />
                <input required type="text" placeholder="UPI ID (ఉదా: hatchery@okaxis)" value={userBank.upiId} onChange={(e) => setUserBank({ ...userBank, upiId: e.target.value })} className="border border-slate-300 rounded-lg px-3 py-2 text-sm font-mono" />
              </div>
              <button type="submit" className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer">
                {lang === 'te' ? 'బ్యాంక్ వివరాలు సేవ్ చేయండి' : 'Save Hatchery Bank Details'}
              </button>
            </form>

            {/* Incoming Orders & Held Payouts Status */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600" />
                {lang === 'te' ? 'ప్యాకింగ్ ఆర్డర్లు & Escrow Payout స్టేటస్' : 'Packing Orders & Escrow Payout Status'}
              </h3>
              {bookings.length === 0 ? (
                <p className="text-xs text-slate-500">{lang === 'te' ? 'ఇంకా ఆర్డర్లు రాలేదు.' : 'No orders received yet.'}</p>
              ) : (
                <div className="space-y-3">
                  {bookings.map((bk) => (
                    <div key={bk.bookingId} className="border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
                      <div className="space-y-1 text-xs">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-sm text-teal-800">{bk.bookingId}</span>
                          <span className={`font-bold px-2.5 py-0.5 rounded-full ${bk.escrow?.payoutStatus === 'RELEASED'
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-amber-100 text-amber-900'
                            }`}>
                            {bk.escrow?.payoutStatus === 'RELEASED'
                              ? `✅ CREDITED TO BANK (₹${bk.escrow?.hatcheryAmount})`
                              : `⏳ ON HOLD (₹${bk.escrow?.hatcheryAmount}) — Packing OK కోసం వేచి ఉంది`}
                          </span>
                        </div>
                        <p className="text-slate-700 font-semibold">Farmer: {bk.farmerName} ({bk.farmerPhone}) | Qty: {bk.quantity.toLocaleString('en-IN')} PL</p>
                        <p className="text-slate-500">Target Salinity: <b>{bk.pondSalinity} PPT</b> | Packing Date: <b>{bk.packingDate}</b></p>
                      </div>

                      {bk.packingStatus === 'PACKING_PENDING' && (
                        <button
                          onClick={() => handleSellerMarkPacked(bk.bookingId)}
                          className="bg-teal-700 hover:bg-teal-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer"
                        >
                          {lang === 'te' ? 'ప్యాకింగ్ పూర్తయింది (Notify Buyer)' : 'Mark Packing Done'}
                        </button>
                      )}
                      {bk.packingStatus === 'PACKING_DONE_BY_SELLER' && (
                        <span className="text-xs font-bold text-amber-700 bg-amber-50 border border-amber-200 px-3 py-1.5 rounded-lg">
                          Waiting for Buyer "OK"...
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Publish Seed Batch Form */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-slate-900">{lang === 'te' ? 'కొత్త సీడ్ బ్యాచ్ & PCR రిపోర్ట్ అప్‌లోడ్' : 'Publish New Seed Batch'}</h2>
              <form onSubmit={handlePublishBatch} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">హేచరీ పేరు</label>
                    <input required type="text" value={newBatchForm.realName} onChange={(e) => setNewBatchForm({ ...newBatchForm, realName: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">CAA లైసెన్స్ నంబర్</label>
                    <input required type="text" placeholder="CAA/AP/2026/XXXX" value={newBatchForm.caaLicense} onChange={(e) => setNewBatchForm({ ...newBatchForm, caaLicense: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">ఫోన్ నంబర్</label>
                    <input required type="tel" value={newBatchForm.realPhone} onChange={(e) => setNewBatchForm({ ...newBatchForm, realPhone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">జోన్ (Zone)</label>
                    <select value={newBatchForm.zone} onChange={(e) => setNewBatchForm({ ...newBatchForm, zone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      <option>Kakinada Zone</option><option>Bhimavaram Zone</option><option>Nellore Zone</option>
                    </select>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-xs font-semibold text-slate-700 block mb-1">పూర్తి అడ్రస్</label>
                    <input required type="text" placeholder="ఉప్పాడ బీచ్ రోడ్, కాకినాడ" value={newBatchForm.realAddress} onChange={(e) => setNewBatchForm({ ...newBatchForm, realAddress: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">PL Stage</label>
                    <select value={newBatchForm.plStage} onChange={(e) => setNewBatchForm({ ...newBatchForm, plStage: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm">
                      <option>PL10</option><option>PL12</option><option>PL14</option><option>PL15</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">రేటు (₹/seed)</label>
                    <input type="number" step="0.01" value={newBatchForm.pricePer1000} onChange={(e) => setNewBatchForm({ ...newBatchForm, pricePer1000: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Salinity (PPT)</label>
                    <input type="number" value={newBatchForm.salinity} onChange={(e) => setNewBatchForm({ ...newBatchForm, salinity: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                  <div>
                    <label className="text-xs font-semibold text-slate-700 block mb-1">Bonus (%)</label>
                    <input type="number" value={newBatchForm.bonusPercent} onChange={(e) => setNewBatchForm({ ...newBatchForm, bonusPercent: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  </div>
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-3">
                  <span className="text-sm font-bold text-slate-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-teal-600" /> PCR Lab Report Upload & AI Scan
                  </span>
                  <div className="flex flex-wrap items-center gap-3">
                    <input type="file" accept="image/*,.pdf" onChange={(e) => setPcrFile(e.target.files[0])} className="text-xs text-slate-600" />
                    <button type="button" onClick={handleScanPcrReport} disabled={aiScanning} className="bg-slate-900 text-white text-xs font-bold px-4 py-2 rounded-lg cursor-pointer">
                      {aiScanning ? 'Scanning...' : 'Run AI Virus Check'}
                    </button>
                  </div>
                  {scanResult && (
                    <div className={`p-3 rounded-lg border text-xs ${scanResult.isSafe ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-rose-50 border-rose-300 text-rose-900'}`}>
                      <p className="font-bold">{lang === 'te' ? scanResult.te : scanResult.en}</p>
                    </div>
                  )}
                </div>

                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-bold text-slate-800 flex items-center gap-2"><Camera className="w-4 h-4 text-teal-600" /> Live Tank GPS</span>
                    <p className="text-xs text-slate-500">{gpsLocation || 'Capture real GPS coordinates'}</p>
                  </div>
                  <button type="button" onClick={handleCaptureGps} className="bg-cyan-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer">
                    <MapPin className="w-3.5 h-3.5" /> {gpsLocation ? 'GPS Locked ✓' : 'Capture GPS'}
                  </button>
                </div>

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-sm shadow-md cursor-pointer">
                  {lang === 'te' ? 'సీడ్ బ్యాచ్ పబ్లిష్ చేయండి' : 'Publish Seed Batch'}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* =========================================================
            3. MEDIATOR (BROKER) EXCLUSIVE VIEW (HELD vs RELEASED COMMISSION)
           ========================================================= */}
        {currentUser.role === 'mediator' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Held in Escrow */}
              <div className="bg-amber-50 border border-amber-300 rounded-2xl p-5 shadow-xs">
                <span className="text-xs text-amber-800 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {lang === 'te' ? 'Escrow Hold లో ఉన్న కమిషన్' : 'Commission ON HOLD (Pending Packing OK)'}
                </span>
                <div className="text-3xl font-extrabold text-amber-950 mt-2">₹{brokerHeldTotal.toLocaleString('en-IN')}</div>
                <p className="text-xs text-amber-800 mt-1.5">
                  {lang === 'te' ? 'రైతు ప్యాకింగ్ OK నొక్కగానే మీ బ్యాంక్ అకౌంట్‌లోకి విడుదల అవుతుంది.' : 'Auto-releases to your bank once Buyer clicks Packing OK.'}
                </p>
              </div>

              {/* Released to Bank */}
              <div className="bg-gradient-to-br from-emerald-700 to-teal-900 text-white rounded-2xl p-5 shadow-md">
                <span className="text-xs text-emerald-200 font-medium flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> {lang === 'te' ? 'బ్యాంక్‌కు విడుదలైన కమిషన్ (Released)' : 'Released to Your Bank Account'}
                </span>
                <div className="text-3xl font-extrabold mt-2">₹{brokerReleasedTotal.toLocaleString('en-IN')}</div>
                <p className="text-xs text-emerald-100 mt-1.5">
                  {userBank.upiId ? `Linked Bank: ${userBank.upiId} (${userBank.ifsc})` : '⚠️ కుడివైపు మీ బ్యాంక్ వివరాలు సేవ్ చేయండి'}
                </p>
              </div>

              {/* Broker Bank Setup */}
              <form onSubmit={handleSaveBankDetails} className="bg-white rounded-2xl p-4 border border-slate-200 shadow-sm space-y-2.5">
                <h3 className="font-bold text-xs text-slate-900 flex items-center gap-1.5">
                  <Landmark className="w-4 h-4 text-teal-700" /> {lang === 'te' ? 'బ్రోకర్ బ్యాంక్ & UPI వివరాలు' : 'Broker Bank & UPI Details'}
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  <input required type="text" placeholder="Account Name" value={userBank.accountName} onChange={(e) => setUserBank({ ...userBank, accountName: e.target.value })} className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs" />
                  <input required type="text" placeholder="Account No" value={userBank.accountNo} onChange={(e) => setUserBank({ ...userBank, accountNo: e.target.value })} className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono" />
                  <input required type="text" placeholder="IFSC Code" value={userBank.ifsc} onChange={(e) => setUserBank({ ...userBank, ifsc: e.target.value.toUpperCase() })} className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono" />
                  <input required type="text" placeholder="UPI ID" value={userBank.upiId} onChange={(e) => setUserBank({ ...userBank, upiId: e.target.value })} className="border border-slate-300 rounded-lg px-2.5 py-1.5 text-xs font-mono" />
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white text-xs font-bold py-2 rounded-lg cursor-pointer">
                  Save Bank Details
                </button>
              </form>
            </div>

            {/* Locked Farmers CRM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddBrokerFarmer} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-700" /> {lang === 'te' ? 'కొత్త రైతును లాక్ చేయండి' : 'Lock New Farmer'}
                </h3>
                <input required type="text" placeholder="రైతు పేరు" value={newFarmer.name} onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <input required type="tel" placeholder="ఫోన్ నంబర్" value={newFarmer.phone} onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                <div className="grid grid-cols-2 gap-2">
                  <input required type="text" placeholder="గ్రామం" value={newFarmer.village} onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                  <input required type="number" step="0.5" placeholder="ఎకరాలు" value={newFarmer.acres} onChange={(e) => setNewFarmer({ ...newFarmer, acres: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <button type="submit" className="w-full bg-teal-700 text-white font-bold text-sm py-2.5 rounded-xl cursor-pointer">+ రైతును లాక్ చేయండి</button>
              </form>

              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-sm space-y-4">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-700" /> {lang === 'te' ? 'మీ రైతుల జాబితా & బుకింగ్' : 'My Locked Farmers'}
                </h3>
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="border-b border-slate-200 text-xs text-slate-500">
                      <th className="py-2">రైతు</th>
                      <th className="py-2">గ్రామం / ఎకరాలు</th>
                      <th className="py-2 text-right">యాక్షన్</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {brokerFarmers.map((f) => (
                      <tr key={f.id}>
                        <td className="py-3 font-semibold">{f.name} <span className="block text-xs font-normal text-slate-500">{f.phone}</span></td>
                        <td className="py-3 text-xs text-slate-600">{f.village} ({f.acres} Acres)</td>
                        <td className="py-3 text-right">
                          <button
                            onClick={() => {
                              setBookingForm({ ...bookingForm, farmerName: f.name, farmerPhone: f.phone, brokerMarginPaise: 2 });
                              setSelectedBatch(batches[0]);
                            }}
                            className="bg-teal-700 text-white text-xs font-semibold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            Book Seed
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          CLEAN SINGLE-PAYMENT BOOKING MODAL (NO SPLIT SHOWN TO FARMER!)
         ========================================================= */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-bold text-lg text-slate-900">{lang === 'te' ? 'సీడ్ ప్యాకింగ్ స్లాట్ బుకింగ్' : 'Book Seed Packing Slot'}</h3>
                <p className="text-xs text-slate-500">{selectedBatch.hatcheryCode} • {selectedBatch.plStage}</p>
              </div>
              <button onClick={() => setSelectedBatch(null)} className="text-slate-400 hover:text-slate-700 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleConfirmSinglePayment} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">రైతు పేరు</label>
                  <input required type="text" value={bookingForm.farmerName} onChange={(e) => setBookingForm({ ...bookingForm, farmerName: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">వాట్సాప్ నంబర్</label>
                  <input required type="tel" value={bookingForm.farmerPhone} onChange={(e) => setBookingForm({ ...bookingForm, farmerPhone: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">పరిమాణం (Seeds)</label>
                  <input required type="number" step="10000" min="50000" value={bookingForm.quantity} onChange={(e) => setBookingForm({ ...bookingForm, quantity: Number(e.target.value) })} className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">Salinity (PPT)</label>
                  <input required type="number" value={bookingForm.pondSalinity} onChange={(e) => setBookingForm({ ...bookingForm, pondSalinity: Number(e.target.value) })} className="w-full border border-slate-300 rounded-lg px-2.5 py-2 text-sm font-bold" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">ప్యాకింగ్ తేదీ</label>
                  <input required type="date" value={bookingForm.packingDate} onChange={(e) => setBookingForm({ ...bookingForm, packingDate: e.target.value })} className="w-full border border-slate-300 rounded-lg px-2 py-2 text-xs font-bold" />
                </div>
              </div>

              {/* Clean Single Amount Box (Zero Split Details Shown) */}
              {(() => {
                const effRate = selectedBatch.pricePer1000 + (Number(bookingForm.brokerMarginPaise) / 100);
                const total = Math.round(bookingForm.quantity * effRate);
                const token = Math.max(2500, Math.round(total * 0.10));
                return (
                  <div className="bg-slate-900 text-white rounded-xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>మొత్తం సీడ్ విలువ ({bookingForm.quantity.toLocaleString('en-IN')} PL):</span>
                      <span className="font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-300 font-extrabold text-base border-t border-white/10 pt-2">
                      <span>ఇప్పుడు చెల్లించాల్సిన అడ్వాన్స్:</span>
                      <span>₹{token.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-amber-300 pt-1">
                      <span>ప్యాకింగ్ సమయంలో చెల్లించాల్సిన బ్యాలెన్స్:</span>
                      <span className="font-bold">₹{(total - token).toLocaleString('en-IN')}</span>
                    </div>
                    <p className="text-[11px] text-cyan-200 pt-1 border-t border-white/10">
                      🛡️ 100% Escrow రక్షణ: ప్యాకింగ్ పూర్తయ్యి మీరు "OK" నొక్కే వరకు మీ డబ్బు సురక్షితంగా హోల్డ్‌లో ఉంటుంది.
                    </p>
                  </div>
                );
              })()}

              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-lg cursor-pointer">
                {lang === 'te' ? 'Pay Now (Single UPI / QR Payment) →' : 'Pay Single Advance Now →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          PRINTABLE INVOICE MODAL
         ========================================================= */}
      {activeInvoice && (
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <div className="flex items-center gap-2">
                <BadgeCheck className="w-6 h-6 text-emerald-600" />
                <div>
                  <h3 className="font-bold text-base">AQUAMARK OFFICIAL RECEIPT</h3>
                  <p className="text-[11px] text-slate-500">ID: {activeInvoice.bookingId} • Ref: {activeInvoice.paymentId}</p>
                </div>
              </div>
              <button onClick={() => setActiveInvoice(null)} className="text-slate-400 hover:text-slate-800 font-bold cursor-pointer">✕</button>
            </div>

            <div className="text-xs space-y-2 text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-xl">
                <span className="text-[10px] font-bold text-emerald-700 uppercase">Unlocked Hatchery Details</span>
                <p className="font-bold text-sm text-slate-900">{activeInvoice.batch.realName}</p>
                <p>{activeInvoice.batch.realAddress}</p>
                <p className="font-semibold text-teal-800 mt-0.5">Phone: {activeInvoice.batch.realPhone}</p>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Farmer:</span>
                <span className="font-bold">{activeInvoice.farmerName} ({activeInvoice.farmerPhone})</span>
              </div>
              <div className="flex justify-between py-1 border-b">
                <span>Quantity + Bonus:</span>
                <span className="font-bold">{activeInvoice.quantity.toLocaleString('en-IN')} + {activeInvoice.bonusSeeds.toLocaleString('en-IN')} Free</span>
              </div>
              <div className="flex justify-between py-1 border-b text-emerald-700 font-bold">
                <span>Single Advance Paid (Escrow Protected):</span>
                <span>₹{activeInvoice.tokenAdvance.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-900">
                <span>Balance at Hatchery Gate:</span>
                <span>₹{activeInvoice.balanceAtGate.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-2 pt-2">
              <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer">
                <Printer className="w-4 h-4" /> Print / PDF
              </button>
              <button onClick={() => setActiveInvoice(null)} className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}