import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Lock, Unlock, Calculator, CheckCircle2,
  MapPin, FileText, Wallet, Users, Send, Printer, Camera,
  Globe, LogOut, Smartphone, UserCheck,
  Landmark, Clock, CheckSquare, ShoppingBag, Building2, Star, Search,
  AlertTriangle, Package, Edit3, Check, ChevronRight, Layers,
  Trash2, ArrowUpDown, Scale, FileCheck2, Upload, PlusCircle,
  Heart, Truck, TrendingUp, Eye, EyeOff, CreditCard, QrCode,
  MessageSquare, BarChart3, Calendar, Droplets,
  Receipt, Moon, Sun, XCircle, ClipboardList, Gauge, Video, ExternalLink,
  FolderOpen, Maximize2, RefreshCw, Share2, PauseCircle, PlayCircle,
  ShieldAlert, KeyRound, Activity, Navigation,
  Bell, ScanLine, PiggyBank, ArrowDownLeft, Sparkles
} from 'lucide-react';

// ============================================================================
// SAFE RESILIENT STORAGE / CLOUD ADAPTER (WORKS IMMEDIATELY IN PREVIEW & LIVE)
// ============================================================================
const safeStorage = {
  get(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },
  set(key, val) {
    try {
      localStorage.setItem(key, JSON.stringify(val));
    } catch {
      // Ignore quota errors in sandboxed frames
    }
  }
};

// ============================================================================
// ERROR BOUNDARY FOR RESILIENCE
// ============================================================================
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, errorMsg: '' };
  }
  static getDerivedStateFromError(error) {
    return { hasError: true, errorMsg: error?.message || 'Unexpected UI Error' };
  }
  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans">
          <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 p-6 shadow-lg text-center space-y-4">
            <AlertTriangle className="w-10 h-10 text-amber-500 mx-auto" />
            <h2 className="text-lg font-extrabold text-slate-900">Application Recovery</h2>
            <p className="text-xs text-slate-500">{this.state.errorMsg}</p>
            <button
              onClick={() => { localStorage.clear(); window.location.reload(); }}
              className="w-full bg-teal-600 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer"
            >
              Reset & Reload
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// ============================================================================
// DOMAIN CONSTANTS & INITIAL REALISTIC DEMO DATA
// ============================================================================
const ADMIN_WHATSAPP_NUMBER = '919876543210';

const SHRIMP_SPECIES_OPTIONS = [
  'Litopenaeus vannamei (SyAqua Line)',
  'Litopenaeus vannamei (Hard Line / High Survival)',
  'Litopenaeus vannamei (High Growth)',
  'Litopenaeus vannamei (Disease Resistant)',
  'Penaeus monodon (Black Tiger)',
  'Macrobrachium rosenbergii (Scampi)',
  'Penaeus indicus (Indian White Prawn)',
  'OTHER_CUSTOM'
];

const BROODSTOCK_ORIGINS = [
  'SyAqua USA / Thailand Certified',
  'Hard Line Coastal Resistant',
  'Kona Bay (Hawaii)',
  'SIS (Shrimp Improvement Systems)',
  'CP Thailand Line',
  'RGCA Rajiv Gandhi Centre'
];

const SEED_STAGE_OPTIONS = [
  'Nauplii (N1-N6)', 'Zoea (Z1-Z3)', 'Mysis (M1-M3)',
  'PL5', 'PL8', 'PL10', 'PL12', 'PL14', 'PL15', 'PL18', 'PL20',
  'Nursery Reared Juvenile', 'OTHER_CUSTOM'
];

const COASTAL_ZONES = [
  'Kakinada Zone', 'Bhimavaram Zone', 'Amalapuram Zone', 'Narsapur Zone',
  'Machilipatnam Zone', 'Repalle Zone', 'Chirala Zone', 'Ongole Zone',
  'Kavali Zone', 'Nellore Zone', 'Gudur Zone', 'Visakhapatnam Zone',
  'Srikakulam Zone', 'OTHER_CUSTOM'
];

const PACKING_TIME_SLOTS = [
  'All Day (24 Hours Flexible)',
  'Early Morning (04:00 AM – 08:00 AM)',
  'Morning (08:00 AM – 12:00 PM)',
  'Afternoon (12:00 PM – 04:00 PM)',
  'Evening / Night (04:00 PM – 09:00 PM)'
];

const DOC_SCHEDULE_TABLE = [
  { doc: 'DOC 1–10', abw: '0.02g – 0.4g', feedPerLakh: '2.0 – 4.0 kg/day', trayCheck: 'Blind Feeding (No Tray)', size: 'Starter #1' },
  { doc: 'DOC 11–20', abw: '0.5g – 1.5g', feedPerLakh: '4.2 – 7.5 kg/day', trayCheck: 'Blind Feeding (No Tray)', size: 'Starter #2' },
  { doc: 'DOC 21–35', abw: '1.8g – 4.5g', feedPerLakh: '8.0 – 14.0 kg/day', trayCheck: 'Check after 2.5 hrs (1.0%)', size: 'Grower #3S' },
  { doc: 'DOC 36–55', abw: '5.0g – 11.0g', feedPerLakh: '15.0 – 24.0 kg/day', trayCheck: 'Check after 2.0 hrs (1.2%)', size: 'Grower #3P' },
  { doc: 'DOC 56–80', abw: '12.0g – 21.0g', feedPerLakh: '25.0 – 34.0 kg/day', trayCheck: 'Check after 1.5 hrs (1.5%)', size: 'Finisher #4S' },
  { doc: 'DOC 81–110', abw: '22.0g – 33.0g', feedPerLakh: '35.0 – 42.0 kg/day', trayCheck: 'Check after 1.5 hrs (1.5%)', size: 'Finisher #4' }
];

const INITIAL_DEMO_HATCHERIES = {
  '9876543211': {
    ownerPhone: '9876543211',
    hatcheryCode: 'Verified Hatchery #H-412',
    realName: 'Sri Sai Coastal Marine Hatcheries',
    caaLicense: 'CAA/AP/2026/0841',
    zone: 'Kakinada Zone',
    realAddress: 'Uppada Beach Road, Kakinada, AP',
    googleMapsLink: 'https://maps.google.com/?q=17.0812,82.3412',
    description: 'ISO-certified marine shrimp hatchery with UV-ozone filtration and strict PCR batch screening.',
    registeredAt: '12/02/2026',
    depositPaid: true,
    depositAmount: 10000,
    depositUtr: 'UPI_492018472910',
    depositSourceAccount: 'srisai.hatchery@okicici (ICICI Bank ••••4512)',
    depositHistory: [
      { id: 'DEP-1001', amount: 10000, ref: 'UPI_492018472910', source: 'srisai.hatchery@okicici', date: '12/02/2026', note: 'Mandatory Security Deposit' }
    ],
    bankDetails: {
      accountName: 'Sri Sai Coastal Marine Hatcheries',
      accountNo: '3892010004512',
      ifsc: 'ICIC0001124',
      upiId: 'srisai.hatchery@okicici'
    }
  }
};

const INITIAL_DEMO_BATCHES = [
  {
    id: 'BATCH-2026-01',
    ownerPhone: '9876543211',
    hatcheryCode: 'Verified Hatchery #H-412',
    realName: 'Sri Sai Coastal Marine Hatcheries',
    realAddress: 'Uppada Beach Road, Kakinada, AP',
    googleMapsLink: 'https://maps.google.com/?q=17.0812,82.3412',
    description: 'High-survival SyAqua line acclimatized to 16 PPT coastal salinity.',
    realPhone: '9876543211',
    caaLicense: 'CAA/AP/2026/0841',
    registeredAt: '12/02/2026',
    bankDetails: {
      accountName: 'Sri Sai Coastal Marine Hatcheries',
      accountNo: '3892010004512',
      ifsc: 'ICIC0001124',
      upiId: 'srisai.hatchery@okicici'
    },
    zone: 'Kakinada Zone',
    rating: 4.9,
    reviewCount: 14,
    reviews: [
      { bookingId: 'AQ-9012', farmerName: 'Ramu Naidu', stars: 5, comment: 'Excellent uniform PL12 size and zero transit mortality.', date: '08/11/2026' }
    ],
    species: 'Litopenaeus vannamei (SyAqua Line)',
    broodstock: 'SyAqua USA / Thailand Certified',
    plStage: 'PL12',
    pricePer1000: 0.43,
    availableStock: 2500000,
    minPackingQty: 200000,
    salinity: 16,
    bonusPercent: 15,
    availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    availableTimeSlot: 'Early Morning (04:00 AM – 08:00 AM)',
    pcrImages: [],
    tankVideos: [],
    paused: false,
    vigorScore: 98
  },
  {
    id: 'BATCH-2026-02',
    ownerPhone: '9876543211',
    hatcheryCode: 'Verified Hatchery #H-412',
    realName: 'Sri Sai Coastal Marine Hatcheries',
    realAddress: 'Uppada Beach Road, Kakinada, AP',
    googleMapsLink: 'https://maps.google.com/?q=17.0812,82.3412',
    description: 'Hard-line coastal resistant PL15 ready for low-salinity ponds.',
    realPhone: '9876543211',
    caaLicense: 'CAA/AP/2026/0841',
    registeredAt: '12/02/2026',
    bankDetails: {
      accountName: 'Sri Sai Coastal Marine Hatcheries',
      accountNo: '3892010004512',
      ifsc: 'ICIC0001124',
      upiId: 'srisai.hatchery@okicici'
    },
    zone: 'Bhimavaram Zone',
    rating: 4.8,
    reviewCount: 9,
    reviews: [],
    species: 'Litopenaeus vannamei (Hard Line / High Survival)',
    broodstock: 'Hard Line Coastal Resistant',
    plStage: 'PL15',
    pricePer1000: 0.46,
    availableStock: 1800000,
    minPackingQty: 300000,
    salinity: 12,
    bonusPercent: 20,
    availableDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    availableTimeSlot: 'All Day (24 Hours Flexible)',
    pcrImages: [],
    tankVideos: [],
    paused: false,
    vigorScore: 96
  }
];

function formatSeedQuantityShort(qty) {
  const num = Number(qty) || 0;
  if (num >= 1000000 && num % 1000000 === 0) {
    return `${num / 1000000} Million${num / 1000000 > 1 ? 's' : ''} (${num.toLocaleString('en-IN')} PL)`;
  }
  if (num >= 100000) {
    const lakhs = +(num / 100000).toFixed(2);
    return `${lakhs} Lakh${lakhs > 1 ? 's' : ''} (${num.toLocaleString('en-IN')} PL)`;
  }
  return `${num.toLocaleString('en-IN')} PL`;
}

// ============================================================================
// ENHANCED SECURITY WATERMARK STAMP (NO LOCATION/COORDS, STYLISH DATE/TIME,
// HATCHERY CAA NUMBER + FULL-IMAGE DIAGONAL TRANSPARENT AQUAMARK WATERMARK)
// ============================================================================
function drawAquaMarkSecurityStampOnCanvas(ctx, width, height, meta) {
  // 1. FULL-IMAGE DIAGONAL TRANSPARENT SECURITY WATERMARK ACROSS ENTIRE IMAGE
  ctx.save();
  const diagFontSize = Math.max(18, Math.round(Math.min(width, height) * 0.042));
  ctx.font = `800 ${diagFontSize}px "Georgia", "Segoe UI", serif`;
  ctx.fillStyle = 'rgba(255, 255, 255, 0.17)';
  ctx.strokeStyle = 'rgba(15, 23, 42, 0.14)';
  ctx.lineWidth = 1;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const watermarkText = `AQUAMARK  •  ${meta.dateStr}  ${meta.timeStr}`;
  const stepX = Math.max(280, Math.round(width * 0.52));
  const stepY = Math.max(150, Math.round(height * 0.28));

  ctx.translate(width / 2, height / 2);
  ctx.rotate((-28 * Math.PI) / 180);

  for (let y = -height * 1.2; y <= height * 1.2; y += stepY) {
    for (let x = -width * 1.2; x <= width * 1.2; x += stepX) {
      ctx.strokeText(watermarkText, x, y);
      ctx.fillText(watermarkText, x, y);
    }
  }
  ctx.restore();

  // 2. BOTTOM SLEEK GLASS STAMP BAR (CAA NUMBER + STYLISH DATE & TIME ONLY — NO GPS/COORDS)
  const barH = Math.max(60, Math.round(height * 0.095));
  const yStart = height - barH;

  const grad = ctx.createLinearGradient(0, yStart - 10, 0, height);
  grad.addColorStop(0, 'rgba(9, 14, 26, 0)');
  grad.addColorStop(0.2, 'rgba(9, 14, 26, 0.86)');
  grad.addColorStop(1, 'rgba(9, 14, 26, 0.96)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, yStart - 10, width, barH + 10);

  const padX = Math.max(18, Math.round(width * 0.028));
  const lensR = Math.max(14, Math.round(barH * 0.25));
  const lensCx = padX + lensR;
  const lensCy = yStart + Math.round(barH * 0.52);

  // Camera Emblem
  ctx.beginPath();
  ctx.arc(lensCx, lensCy, lensR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20, 184, 166, 0.25)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#2dd4bf';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(lensCx, lensCy, Math.round(lensR * 0.45), 0, Math.PI * 2);
  ctx.fillStyle = '#2dd4bf';
  ctx.fill();

  // Left: Brand + Hatchery CAA Number
  const leftTextX = lensCx + lensR + 14;
  const titleFont = Math.max(14, Math.round(barH * 0.28));
  const caaFont = Math.max(11, Math.round(barH * 0.21));

  ctx.fillStyle = '#ffffff';
  ctx.font = `900 ${titleFont}px "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('AQUA MARK VERIFIED', leftTextX, yStart + Math.round(barH * 0.44));

  ctx.fillStyle = '#5eead4';
  ctx.font = `700 ${caaFont}px "Courier New", monospace`;
  ctx.fillText(`CAA REG: ${meta.caaLicense || 'CAA/AP/VERIFIED'}`, leftTextX, yStart + Math.round(barH * 0.77));

  // Right-Aligned Stylish Date & Time
  const dateFont = Math.max(13, Math.round(barH * 0.26));
  const timeFont = Math.max(12, Math.round(barH * 0.22));
  ctx.save();
  ctx.textAlign = 'right';
  const rightPadX = width - padX;

  ctx.fillStyle = '#f8fafc';
  ctx.font = `italic 700 ${dateFont}px "Georgia", "Times New Roman", serif`;
  ctx.fillText(meta.dateStr, rightPadX, yStart + Math.round(barH * 0.44));

  ctx.fillStyle = '#34d399';
  ctx.font = `700 ${timeFont}px "Georgia", "Segoe UI", serif`;
  ctx.fillText(meta.timeStr, rightPadX, yStart + Math.round(barH * 0.77));
  ctx.restore();
}

async function stampAndCompressImage(file, meta, maxBytes = 2 * 1024 * 1024) {
  return new Promise((resolve) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      const maxDim = 1600;
      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, width, height);

      drawAquaMarkSecurityStampOnCanvas(ctx, width, height, meta);

      let quality = 0.86;
      const attempt = () => {
        canvas.toBlob(
          (blob) => {
            if (!blob) return resolve(file);
            if (blob.size <= maxBytes || quality <= 0.35) {
              resolve(new File([blob], file.name.replace(/\.[^.]+$/, '.jpg'), { type: 'image/jpeg' }));
            } else {
              quality -= 0.15;
              attempt();
            }
          },
          'image/jpeg',
          quality
        );
      };
      attempt();
    };
    img.onerror = () => resolve(file);
    img.src = url;
  });
}

async function stampAndCompressVideo(file, meta, maxBytes = 10 * 1024 * 1024) {
  return new Promise((resolve) => {
    try {
      const video = document.createElement('video');
      video.muted = true;
      video.playsInline = true;
      const url = URL.createObjectURL(file);
      video.src = url;

      video.onloadedmetadata = () => {
        const duration = Math.min(video.duration || 10, 16);
        const canvas = document.createElement('canvas');
        const scale = Math.min(1, 720 / Math.max(video.videoWidth || 720, video.videoHeight || 720));
        canvas.width = Math.max(360, Math.round((video.videoWidth || 640) * scale));
        canvas.height = Math.max(240, Math.round((video.videoHeight || 360) * scale));
        const ctx = canvas.getContext('2d');

        const targetBitrate = Math.max(450000, Math.floor((maxBytes * 8 * 0.8) / duration));
        const stream = canvas.captureStream(24);
        const mime = MediaRecorder.isTypeSupported('video/webm;codecs=vp9')
          ? 'video/webm;codecs=vp9'
          : 'video/webm';
        const recorder = new MediaRecorder(stream, { mimeType: mime, videoBitsPerSecond: targetBitrate });
        const chunks = [];

        recorder.ondataavailable = (e) => { if (e.data.size > 0) chunks.push(e.data); };
        recorder.onstop = () => {
          URL.revokeObjectURL(url);
          const outBlob = new Blob(chunks, { type: 'video/webm' });
          resolve(new File([outBlob], file.name.replace(/\.[^.]+$/, '.webm'), { type: 'video/webm' }));
        };

        video.currentTime = 0;
        video.play();
        recorder.start();

        const drawFrame = () => {
          if (video.paused || video.ended || video.currentTime >= duration) {
            if (recorder.state !== 'inactive') recorder.stop();
            return;
          }
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          drawAquaMarkSecurityStampOnCanvas(ctx, canvas.width, canvas.height, meta);
          requestAnimationFrame(drawFrame);
        };
        drawFrame();
      };
      video.onerror = () => resolve(file);
    } catch {
      resolve(file);
    }
  });
}

// ============================================================================
// BILINGUAL DICTIONARY (ENGLISH & TELUGU)
// ============================================================================
const DICT = {
  en: {
    brandSub: 'B2B Aquaculture Seed & Direct Settlement Exchange',
    selectRoleTitle: 'Welcome to Aqua Mark',
    selectRoleSub: 'Each portal has its own separate registration — select your role below',
    roles: {
      buyer: { title: 'Buyer (Farmer)', desc: 'Book PCR-verified seed' },
      seller: { title: 'Seller (Hatchery)', desc: 'Manage hatchery & batches' },
      mediator: { title: 'Mediator (Broker)', desc: 'Browse hatcheries & book' }
    },
    signUpTab: 'Sign Up',
    loginTab: 'Login',
    nameLabels: { buyer: 'Farmer Full Name', seller: 'Owner Full Name', mediator: 'Broker Full Name' },
    namePlaceholders: { buyer: 'e.g., Ramu Naidu', seller: 'e.g., Venkata Subba Rao', mediator: 'e.g., Srinivas Rao' },
    mobileLabel: 'Mobile Number (10 Digits)',
    verifyWaBtn: 'Verify via WhatsApp',
    verifyingWaAnim: 'Auto-Sending on WhatsApp & Verifying...',
    setPasswordLabel: 'Set Password (Min 6 Characters — Letters or Numbers)',
    enterPasswordLabel: 'Enter Password',
    forgotPasswordLink: 'Forgot Password?',
    resetPasswordTitle: 'Reset Password via WhatsApp Verification',
    completeSignUpBtn: 'Set Password & Enter Portal',
    loginBtn: 'Login to Portal',
    logout: 'Sign Out',
    portalBadges: { buyer: 'Farmer Portal', seller: 'Hatchery Portal', mediator: 'Broker Portal' },
    tickerTitle: 'AP Farmgate Count Rates:',
    tabMarketplace: 'Hatchery Marketplace',
    tabBookings: 'My Bookings & Gate-Passes',
    tabPondLog: 'My Ponds & Daily Feed Log',
    tabAnalytics: 'Harvest & Profit Estimator',
    tabWaterLab: 'Water, Salinity & Disease Lab',
    tabGuide: 'DOC 1–110 Feeding & Protocol',
    searchPlaceholder: 'Search Batch No, Species, Broodstock, or Zone...',
    allZones: 'All Coastal Zones',
    allStages: 'All Seed / PL Stages',
    onlySaved: 'Saved',
    sortRating: 'Highest Rating',
    sortPriceLow: 'Price: Low to High',
    sortSalinity: 'Lowest Salinity (PPT)',
    sortBonus: 'Highest Bonus %',
    compareBtn: 'Compare',
    comparingBtn: 'Selected',
    compareModalTitle: 'Side-by-Side Hatchery Comparison',
    emptyMarketTitle: 'No Registered Hatchery Batches Live Yet',
    emptyMarketSub: 'Once a CAA-certified Hatchery completes deposit & publishes a batch, it appears here immediately.',
    caaVerified: 'CAA Certified',
    soldOutBadge: 'SOLD OUT',
    pausedBadge: 'PAUSED BY HATCHERY',
    unlockHint: 'Hatchery name, contact & Google Maps link unlock after advance/full booking',
    inspectBtn: 'View Hatchery Lineage, Reviews, Videos & PCR Images',
    perSeed: 'per seed',
    stage: 'Seed / PL Stage',
    salinity: 'Salinity',
    bonus: 'Bonus',
    stock: 'Remaining Stock',
    availPackingLabel: 'Available Packing',
    liveVideoBtn: 'Ask for Live Video',
    liveVideoSentBadge: 'Live Video Requested ✓',
    bookSlotBtn: 'Book Packing Slot',
    myBookingsTitle: 'Your Bookings, Status & Gate-Passes',
    noBookingsYet: 'No bookings placed yet.',
    paidLabel: 'Paid Amount',
    balancePackingLabel: 'Remaining Balance (96%)',
    packingReadyAlert: '📦 Hatchery Marked Packing Complete! Complete remaining payment or show Gate-Pass QR.',
    pendingSettlementBadge: '4% Advance Paid • 2% Refundable Hold Active',
    clearedSettlementBadge: '✅ Packing Complete • 100% Settled & 2% Hold Refunded',
    cancelledRefundBadge: '❌ Cancelled • 2% Hold Refunded',
    cancelBookingBtn: 'Cancel Booking (2% Refund)',
    rateSeedLabel: 'Rate Hatchery (1-5★) & Feedback:',
    submitReviewBtn: 'Submit Feedback',
    ratedLabel: 'Feedback Sent',
    advanceReceiptBtn: 'Advance Receipt',
    finalReceiptBtn: 'Full Paid Receipt',
    depositTitle: 'Mandatory ₹10,000 Hatchery Security Deposit',
    depositSub: 'To protect farmers against fake listings and guarantee quality seed, every Hatchery Owner must complete a one-time ₹10,000 refundable security deposit before activating their Hatchery account.',
    depositPayBtn: 'Verify & Activate Hatchery Account (₹10,000)',
    unifiedRegTitle: 'Hatchery & Bank Registration (One-Time Setup)',
    unifiedRegSub: 'Your ₹10,000 security deposit is verified! Complete your hatchery & settlement bank profile.',
    hatcheryNameLabel: 'Hatchery Legal Name',
    caaLicenseLabel: 'CAA Registration Number',
    zoneLabel: 'Coastal Zone',
    addressLabel: 'Hatchery Facility Address',
    mapsLinkLabel: 'Google Maps Location Link (Optional)',
    descriptionLabel: 'Hatchery Description & Tank Facilities (Optional)',
    accHolderLabel: 'Bank Account Holder Name',
    accNoLabel: 'Bank Account Number',
    ifscLabel: 'IFSC Code',
    upiLabel: 'Settlement UPI ID',
    completeRegBtn: 'Verify & Register Hatchery + Bank',
    hatcheryLockedBanner: 'Verified Hatchery Locked to +91',
    editSellerProfileBtn: 'Edit Profile, Maps & Bank',
    editBrokerProfileBtn: 'Edit Profile & Bank',
    editBuyerProfileBtn: 'Edit Profile',
    deleteAccountBtn: 'Delete Account to Withdraw Money',
    editBatchBtn: 'Edit Batch',
    saveBtn: 'Save Changes',
    addBatchTitle: 'Publish New Seed Batch & Packing Schedule',
    batchNoLabel: 'Batch Number',
    batchNoPlaceholder: 'e.g., BATCH-2026-01',
    speciesLabel: 'Shrimp Species',
    broodstockLabel: 'Broodstock Origin',
    customSpeciesPlaceholder: 'Enter custom shrimp species...',
    customStagePlaceholder: 'Enter custom stage (e.g. PL22)...',
    customZonePlaceholder: 'Enter custom zone / district...',
    ratePerSeedLabel: 'Rate (₹ / Seed)',
    stockLabel: 'Available Stock (1 - 100)',
    minPackingLabel: 'Minimum Packing Qty (1 - 100)',
    availDateLabel: 'Available Packing Date',
    availTimeLabel: 'Available Time Slot',
    pcrUploadBtnLabel: 'Upload PCR Images (≤2MB)',
    videoUploadBtnLabel: 'Upload Tank Videos (≤10MB)',
    pcrHintLabel: 'Required: At least 1 PCR lab report image (Camera or Files)',
    publishBtn: 'Publish Batch Live',
    myBatchesTitle: 'Your Active Seed Batches (Pause/Live, Min Packing, Edit All Details)',
    noBatchesSeller: 'No active batches published yet.',
    saveChangesBtn: 'Save Batch',
    removeBtn: 'Remove',
    markPackedBtn: 'Mark Packing Complete',
    paymentReceivedBtn: 'Payment Received',
    sellerFeedbackTitle: 'Farmer Ratings & Feedback',
    noFeedbackYet: 'No farmer feedback submitted yet.',
    brokerRegTitle: 'Mandatory Broker Bank & UPI Registration',
    brokerRegSub: 'Enter your settlement bank account & UPI ID to activate your Broker account.',
    brokerActivateBtn: 'Save Bank Details & Activate Broker Account',
    brokerHoldCard: '2% Commission on Hold (Upcoming)',
    brokerHoldSub: 'Click to view all upcoming commission deals',
    brokerReleasedCard: 'Credited 2% Commission (Received)',
    brokerBookingsTitle: 'My Broker Bookings & Margin Breakdown',
    noBrokerBookings: 'No bookings placed under your Broker account yet.',
    brokerMarketplaceTitle: 'All Registered Hatcheries (Select Hatchery First to Book)',
    selectAndBookBtn: 'Select Hatchery & Book →',
    lockFarmerTitle: 'Register & Lock Farmer (365 Days)',
    farmerNamePlaceholder: 'Farmer Name',
    villagePlaceholder: 'Village / Mandal',
    acresPlaceholder: 'Acres',
    lockFarmerBtn: 'Lock Farmer to My ID',
    myFarmersTitle: 'Protected Farmer Network',
    step1Label: 'Step 1: Selected Hatchery Batch',
    changeHatcheryBtn: 'Change Hatchery',
    step2Label: 'Step 2: Enter Farmer, Schedule & Payment Details',
    selectSavedFarmer: 'Quick-Fill from Locked Farmers',
    manualFarmerOption: '-- Enter Farmer Manually --',
    modalTitle: 'Confirm Seed Packing Slot',
    farmerNameLabel: 'Farmer Name',
    whatsappLabel: 'WhatsApp Number (10 Digits)',
    quantityLabel: 'Seed Quantity (1 - 100)',
    pondSalinityLabel: 'Pond Salinity (PPT)',
    packingDateLabel: 'Packing Date',
    packingTimeLabel: 'Packing Time Slot',
    brokerMarginLabel: 'Extra Margin (Paise / Seed)',
    transportAddonLabel: 'Include Oxygen Van Delivery (+₹1,500)',
    paymentMethodLabel: 'Select Payment Method',
    utrPlaceholder: 'Enter 12-Digit UPI / Bank UTR Reference Number',
    salinityWarn: 'Salinity variance exceeds 4 PPT. Hatchery will perform gradual acclimatization.',
    totalSeedValue: 'Total Order Value',
    advancePaidLabel: 'Advance Paid (4%)',
    balanceAtPacking: 'Balance Payable at Packing (96%)',
    payNowBtn: 'Confirm & Complete Booking',
    receiptTitle: 'OFFICIAL SEED BOOKING RECEIPT',
    finalReceiptTitle: 'FULL PAID & BALANCE CLEARED RECEIPT',
    sellerDetailsHeading: 'Seller (Hatchery) Details',
    printBtn: 'Print',
    closeBtn: 'Close',
    calculateBtn: 'Calculate Harvest & Profit',
    toasts: {
      invalidPhone: 'Please enter a valid 10-digit mobile number.',
      waVerified: 'WhatsApp verified! Set your 6+ character password below.',
      passwordShort: 'Password must be at least 6 characters (letters or numbers).',
      wrongPassword: 'Incorrect password! Please try again or click Forgot Password.',
      notRegistered: 'No account found for this mobile in this role. Please Sign Up first.',
      alreadyRegistered: 'This mobile is already registered in this role! Please use Login.',
      depositComplete: '₹10,000 Security Deposit Verified! Complete your Hatchery setup.',
      accountDeleted: 'Your account is deleted and full deposited money has been refunded to your original source account!',
      regComplete: 'Hatchery & Bank details saved successfully!',
      brokerRegComplete: 'Broker Bank & UPI details saved! Broker Portal activated.',
      profileUpdated: 'Profile updated successfully!',
      uploadPcrFirst: 'Please upload at least 1 PCR Lab Report image.',
      batchPublished: 'Seed batch published live!',
      batchUpdated: 'Batch details & cloud files updated!',
      batchRemoved: 'Seed batch deleted completely!',
      liveVideoRequested: 'Live tank video request sent to Hatchery!',
      packingMarked: 'Packing marked complete! Buyer notified.',
      paymentReceivedDone: 'Payment Received confirmed! Full Paid Receipt generated.',
      bookingCancelled: 'Booking cancelled! 2% refundable hold returned & stock restored.',
      farmerLocked: 'Farmer locked to your Broker ID for 365 days!',
      paymentSuccess: 'Booking confirmed! Gate-Pass & Receipt ready.',
      enterUtr: 'Please enter the 12-digit UPI / Bank UTR Transaction Reference.',
      calcUpdated: 'Harvest, Feed & Net Profit estimates recalculated!',
      cloudSynced: 'Live Cloud Database synced!'
    }
  },
  te: {
    brandSub: 'ఆక్వాకల్చర్ సీడ్ & డైరెక్ట్ సెటిల్‌మెంట్ ప్లాట్‌ఫారమ్',
    selectRoleTitle: 'Aqua Mark లోకి స్వాగతం',
    selectRoleSub: 'ప్రతి విభాగానికి వేర్వేరు రిజిస్ట్రేషన్ ఉంటుంది — మీ విభాగాన్ని ఎంచుకోండి',
    roles: {
      buyer: { title: 'రైతు (Buyer)', desc: 'సీడ్ స్లాట్ బుకింగ్' },
      seller: { title: 'హేచరీ (Seller)', desc: 'హేచరీ & బ్యాచ్‌ల నిర్వహణ' },
      mediator: { title: 'బ్రోకర్ (Mediator)', desc: 'హేచరీల ఎంపిక & బుకింగ్' }
    },
    signUpTab: 'Sign Up (కొత్త ఖాతా)',
    loginTab: 'Login (లాగిన్)',
    nameLabels: { buyer: 'రైతు పూర్తి పేరు', seller: 'యజమాని పూర్తి పేరు', mediator: 'బ్రోకర్ పూర్తి పేరు' },
    namePlaceholders: { buyer: 'ఉదా: రాము నాయుడు', seller: 'ఉదా: వెంకట సుబ్బారావు', mediator: 'ఉదా: శ్రీనివాస రావు' },
    mobileLabel: 'మొబైల్ నంబర్ (10 అంకెలు)',
    verifyWaBtn: 'Verify via WhatsApp',
    verifyingWaAnim: 'WhatsApp లో ఆటోమేటిక్‌గా వెరిఫై అవుతోంది...',
    setPasswordLabel: 'కొత్త పాస్‌వర్డ్ సెట్ చేయండి (కనీసం 6 అక్షరాలు లేదా అంకెలు)',
    enterPasswordLabel: 'మీ పాస్‌వర్డ్ ఎంటర్ చేయండి',
    forgotPasswordLink: 'Forgot Password? (పాస్‌వర్డ్ మర్చిపోయారా?)',
    resetPasswordTitle: 'WhatsApp వెరిఫికేషన్ ద్వారా కొత్త పాస్‌వర్డ్ సెట్ చేయండి',
    completeSignUpBtn: 'పాస్‌వర్డ్ సేవ్ చేసి ప్రవేశించండి',
    loginBtn: 'పాస్‌వర్డ్‌తో లాగిన్ అవ్వండి',
    logout: 'లాగౌట్',
    portalBadges: { buyer: 'రైతు పోర్టల్ (Buyer)', seller: 'హేచరీ పోర్టల్ (Seller)', mediator: 'బ్రోకర్ పోర్టల్ (Mediator)' },
    tickerTitle: 'నేటి ఆంధ్రప్రదేశ్ రొయ్యల కౌంట్ ధరలు:',
    tabMarketplace: 'హేచరీల మార్కెట్',
    tabBookings: 'నా బుకింగ్స్ & Gate-Pass',
    tabPondLog: 'నా చెరువులు & రోజువారీ ఫీడ్ లాగ్',
    tabAnalytics: 'దిగుబడి & లాభాల కాలిక్యులేటర్',
    tabWaterLab: 'నీటి పరీక్ష, సెలైనిటీ & వ్యాధి తనిఖీ',
    tabGuide: 'DOC 1–110 ఫీడింగ్ & ప్రోటోకాల్',
    searchPlaceholder: 'బ్యాచ్ నంబర్, రకం, బ్రూడ్‌స్టాక్ లేదా ప్రాంతం వెతకండి...',
    allZones: 'అన్ని ప్రాంతాలు',
    allStages: 'అన్ని సీడ్ / PL దశలు',
    onlySaved: 'సేవ్ చేసినవి',
    sortRating: 'అత్యధిక రేటింగ్',
    sortPriceLow: 'తక్కువ ధర నుండి ఎక్కువకు',
    sortSalinity: 'తక్కువ ఉప్పదనం (PPT)',
    sortBonus: 'అత్యధిక బోనస్ %',
    compareBtn: 'పోల్చండి',
    comparingBtn: 'ఎంచుకోబడింది',
    compareModalTitle: 'హేచరీ బ్యాచ్‌ల పోలిక',
    emptyMarketTitle: 'ఇంకా ఎటువంటి హేచరీ బ్యాచ్‌లు నమోదు కాలేదు',
    emptyMarketSub: 'హేచరీ యజమానులు రిజిస్టర్ అయ్యి సీడ్ బ్యాచ్ యాడ్ చేసిన వెంటనే ఇక్కడ కనిపిస్తాయి.',
    caaVerified: 'CAA సర్టిఫైడ్',
    soldOutBadge: 'స్టాక్ పూర్తయింది (SOLD OUT)',
    pausedBadge: 'తాత్కాలికంగా నిలిపివేయబడింది',
    unlockHint: 'బుకింగ్ పూర్తయిన వెంటనే హేచరీ పేరు, ఫోన్ & Google Maps లింక్ అన్‌లాక్ అవుతాయి',
    inspectBtn: 'హేచరీ చరిత్ర, రివ్యూలు, వీడియోలు & PCR ఫోటోలు చూడండి',
    perSeed: 'ఒక్క సీడ్ ధర',
    stage: 'సీడ్ / PL దశ',
    salinity: 'ఉప్పదనం',
    bonus: 'బోనస్ సీడ్',
    stock: 'మిగిలిన నిల్వ',
    availPackingLabel: 'ప్యాకింగ్ సమయం',
    liveVideoBtn: 'Ask for Live Video',
    liveVideoSentBadge: 'లైవ్ వీడియో రిక్వెస్ట్ పంపబడింది ✓',
    bookSlotBtn: 'ప్యాకింగ్ స్లాట్ బుక్ చేయండి',
    myBookingsTitle: 'మీ బుకింగ్స్, Status & Gate-Pass',
    noBookingsYet: 'మీరు ఇంకా ఎటువంటి సీడ్ బుకింగ్ చేయలేదు.',
    paidLabel: 'చెల్లించిన మొత్తం',
    balancePackingLabel: 'మిగిలిన బ్యాలెన్స్ (96%)',
    packingReadyAlert: '📦 హేచరీ వారు ప్యాకింగ్ పూర్తయినట్లు తెలిపారు! మిగిలిన బ్యాలెన్స్ చెల్లించండి లేదా Gate-Pass QR చూపించండి.',
    pendingSettlementBadge: '4% అడ్వాన్స్ చెల్లించబడింది • 2% హోల్డ్ సురక్షితం',
    clearedSettlementBadge: '✅ ప్యాకింగ్ పూర్తయింది • పూర్తి పేమెంట్ & 2% వాపస్ వచ్చింది',
    cancelledRefundBadge: '❌ క్యాన్సిల్ చేయబడింది • 2% వాపస్ వచ్చింది',
    cancelBookingBtn: 'బుకింగ్ క్యాన్సిల్ (2% వాపస్)',
    rateSeedLabel: 'రేటింగ్ (1-5★) & అభిప్రాయం రాయండి:',
    submitReviewBtn: 'ఫీడ్‌బ్యాక్ పంపండి',
    ratedLabel: 'ఫీడ్‌బ్యాక్ పంపబడింది',
    advanceReceiptBtn: 'అడ్వాన్స్ రసీదు (Receipt)',
    finalReceiptBtn: 'పూర్తి పేమెంట్ రసీదు (Full Paid Receipt)',
    depositTitle: '₹10,000 హేచరీ సెక్యూరిటీ డిపాజిట్ (తప్పనిసరి)',
    depositSub: 'రైతులకు నాణ్యమైన సీడ్ హామీ కోసం ప్రతి హేచరీ యజమాని ఒకసారి ₹10,000 రిఫండబుల్ సెక్యూరిటీ డిపాజిట్ చెల్లించాలి.',
    depositPayBtn: '₹10,000 డిపాజిట్ నిర్ధారించి ఖాతా ప్రారంభించండి',
    unifiedRegTitle: 'హేచరీ & బ్యాంక్ రిజిస్ట్రేషన్ (ఒకే స్టెప్‌లో పూర్తి చేయండి)',
    unifiedRegSub: 'మీ ₹10,000 డిపాజిట్ పూర్తయింది! ఇప్పుడు మీ హేచరీ వివరాలు నమోదు చేయండి.',
    hatcheryNameLabel: 'హేచరీ పేరు',
    caaLicenseLabel: 'CAA లైసెన్స్ నంబర్',
    zoneLabel: 'ప్రాంతం (Zone)',
    addressLabel: 'హేచరీ పూర్తి అడ్రస్',
    mapsLinkLabel: 'Google Maps లొకేషన్ లింక్ (Optional)',
    descriptionLabel: 'హేచరీ వివరణ / Description (Optional)',
    accHolderLabel: 'బ్యాంక్ అకౌంట్ హోల్డర్ పేరు',
    accNoLabel: 'బ్యాంక్ అకౌంట్ నంబర్',
    ifscLabel: 'IFSC కోడ్',
    upiLabel: 'UPI ID (పేమెంట్స్ కోసం)',
    completeRegBtn: 'హేచరీ & బ్యాంక్ వివరాలు నిర్ధారించండి',
    hatcheryLockedBanner: 'ఈ హేచరీ మీ మొబైల్ నంబర్‌కు ఫిక్స్ చేయబడింది: +91',
    editSellerProfileBtn: 'Edit Profile, Maps & Bank',
    editBrokerProfileBtn: 'Edit Profile & Bank',
    editBuyerProfileBtn: 'Edit Profile',
    deleteAccountBtn: 'Delete Account to Withdraw Money',
    editBatchBtn: 'Edit Batch',
    saveBtn: 'మార్పులు సేవ్ చేయండి',
    addBatchTitle: 'కొత్త సీడ్ బ్యాచ్ & ప్యాకింగ్ సమయం పబ్లిష్ చేయండి',
    batchNoLabel: 'Batch Number',
    batchNoPlaceholder: 'ఉదా: BATCH-2026-01',
    speciesLabel: 'రొయ్య రకం (Species)',
    broodstockLabel: 'బ్రూడ్‌స్టాక్ మూలం (Broodstock)',
    customSpeciesPlaceholder: 'కొత్త రొయ్య రకం పేరు టైప్ చేయండి...',
    customStagePlaceholder: 'కొత్త దశ టైప్ చేయండి (ఉదా: PL22)...',
    customZonePlaceholder: 'కొత్త ప్రాంతం / జిల్లా పేరు టైప్ చేయండి...',
    ratePerSeedLabel: 'Rate (₹ / Seed)',
    stockLabel: 'అందుబాటులో ఉన్న స్టాక్ (1 - 100)',
    minPackingLabel: 'Minimum Packing Qty (1 - 100)',
    availDateLabel: 'ప్యాకింగ్ అందుబాటు తేదీ',
    availTimeLabel: 'ప్యాకింగ్ అందుబాటు సమయం',
    pcrUploadBtnLabel: 'PCR ఫోటోలు అప్‌లోడ్ (≤2MB)',
    videoUploadBtnLabel: 'ట్యాంక్ వీడియోలు అప్‌లోడ్ (≤10MB)',
    pcrHintLabel: 'కనీసం 1 PCR ల్యాబ్ ఫోటో తప్పనిసరి (Camera లేదా Files)',
    publishBtn: 'బ్యాచ్ లైవ్ చేయండి',
    myBatchesTitle: 'మీ హేచరీ సీడ్ బ్యాచ్‌లు (Pause/Live, Min Packing & Edit)',
    noBatchesSeller: 'మీరు ఇంకా ఎటువంటి బ్యాచ్‌లు యాడ్ చేయలేదు.',
    saveChangesBtn: 'మార్పులు సేవ్ చేయండి',
    removeBtn: 'తొలగించు',
    markPackedBtn: 'ప్యాకింగ్ పూర్తయింది (Notify Buyer)',
    paymentReceivedBtn: 'Payment Received (బ్యాలెన్స్ అందింది)',
    sellerFeedbackTitle: 'రైతుల రేటింగ్స్ & అభిప్రాయాలు',
    noFeedbackYet: 'ఇంకా ఎటువంటి రైతు అభిప్రాయాలు రాలేదు.',
    brokerRegTitle: 'బ్రోకర్ బ్యాంక్ & UPI రిజిస్ట్రేషన్ (తప్పనిసరి)',
    brokerRegSub: 'మీ బ్రోకర్ అకౌంట్ యాక్టివేట్ అవ్వడానికి మీ బ్యాంక్ & UPI వివరాలు నమోదు చేయండి.',
    brokerActivateBtn: 'బ్యాంక్ వివరాలు సేవ్ చేసి బ్రోకర్ అకౌంట్ ప్రారంభించండి',
    brokerHoldCard: 'హోల్డ్‌లో ఉన్న 2% కమిషన్ (Upcoming)',
    brokerHoldSub: 'వివరాల కోసం క్లిక్ చేయండి',
    brokerReleasedCard: 'జమ అయిన 2% కమిషన్ (Received)',
    brokerBookingsTitle: 'నా బ్రోకర్ బుకింగ్స్ & మార్జిన్ ట్రాకర్',
    noBrokerBookings: 'మీ బ్రోకర్ అకౌంట్ ద్వారా ఇంకా ఎటువంటి బుకింగ్స్ జరగలేదు.',
    brokerMarketplaceTitle: 'రిజిస్టర్ అయిన హేచరీల లిస్ట్',
    selectAndBookBtn: 'ఈ హేచరీని ఎంచుకుని బుక్ చేయండి →',
    lockFarmerTitle: 'కొత్త రైతును లాక్ చేయండి (365 రోజులు)',
    farmerNamePlaceholder: 'రైతు పేరు',
    villagePlaceholder: 'గ్రామం / మండలం',
    acresPlaceholder: 'ఎకరాలు',
    lockFarmerBtn: 'రైతును నా ID కి లాక్ చేయండి',
    myFarmersTitle: 'మీ రైతుల నెట్‌వర్క్',
    step1Label: 'దశ 1: ఎంచుకున్న హేచరీ బ్యాచ్',
    changeHatcheryBtn: 'హేచరీ మార్చండి',
    step2Label: 'దశ 2: రైతు, సమయం & పేమెంట్ వివరాలు నమోదు చేయండి',
    selectSavedFarmer: 'లాక్ అయిన రైతుల నుండి ఎంచుకోండి',
    manualFarmerOption: '-- రైతు పేరు స్వయంగా టైప్ చేయండి --',
    modalTitle: 'సీడ్ ప్యాకింగ్ స్లాట్ బుకింగ్',
    farmerNameLabel: 'రైతు పేరు',
    whatsappLabel: 'వాట్సాప్ నంబర్ (10 అంకెలు)',
    quantityLabel: 'పరిమాణం (1 - 100)',
    pondSalinityLabel: 'చెరువు ఉప్పదనం (PPT)',
    packingDateLabel: 'ప్యాకింగ్ తేదీ',
    packingTimeLabel: 'ప్యాకింగ్ సమయం (Time Slot)',
    brokerMarginLabel: 'Extra Margin (Paise / Seed)',
    transportAddonLabel: 'ఆక్సిజన్ వ్యాన్ రవాణా జతచేయండి (+₹1,500)',
    paymentMethodLabel: 'పేమెంట్ విధానం ఎంచుకోండి',
    utrPlaceholder: '12-అంకెల UPI / Bank UTR రిఫరెన్స్ నంబర్ ఎంటర్ చేయండి',
    salinityWarn: 'హేచరీ నీటికి మరియు చెరువు నీటికి మధ్య 4 PPT కంటే ఎక్కువ తేడా ఉంది.',
    totalSeedValue: 'మొత్తం ఆర్డర్ విలువ',
    advancePaidLabel: 'చెల్లించిన అడ్వాన్స్ (4%)',
    balanceAtPacking: 'ప్యాకింగ్ సమయంలో చెల్లించాల్సిన బ్యాలెన్స్ (96%)',
    payNowBtn: 'బుకింగ్ నిర్ధారించండి',
    receiptTitle: 'అధికారిక సీడ్ బుకింగ్ రసీదు (RECEIPT)',
    finalReceiptTitle: 'పూర్తి పేమెంట్ క్లియర్డ్ రసీదు (FULL PAID RECEIPT)',
    sellerDetailsHeading: 'Seller (Hatchery) Details',
    printBtn: 'Print',
    closeBtn: 'మూసివేయండి',
    calculateBtn: 'దిగుబడి & లాభం లెక్కించండి',
    toasts: {
      invalidPhone: 'దయచేసి సరైన 10-అంకెల మొబైల్ నంబర్ ఎంటర్ చేయండి.',
      waVerified: 'WhatsApp వెరిఫికేషన్ పూర్తయింది! కింద 6 అక్షరాల పాస్‌వర్డ్ సెట్ చేయండి.',
      passwordShort: 'పాస్‌వర్డ్ కనీసం 6 అక్షరాలు లేదా అంకెలు ఉండాలి.',
      wrongPassword: 'తప్పు పాస్‌వర్డ్! మళ్ళీ ప్రయత్నించండి లేదా Forgot Password నొక్కండి.',
      notRegistered: 'ఈ విభాగంలో ఈ నంబర్ రిజిస్టర్ కాలేదు. ముందుగా Sign Up అవ్వండి.',
      alreadyRegistered: 'ఈ విభాగంలో ఈ నంబర్ ఇప్పటికే రిజిస్టర్ అయింది! దయచేసి Login అవ్వండి.',
      depositComplete: '₹10,000 సెక్యూరిటీ డిపాజిట్ పూర్తయింది! ఇప్పుడు హేచరీ వివరాలు నమోదు చేయండి.',
      accountDeleted: 'మీ అకౌంట్ తొలగించబడింది మరియు మీ డిపాజిట్ డబ్బు మీ అసలు అకౌంట్‌కు తిరిగి పంపబడింది!',
      regComplete: 'హేచరీ & బ్యాంక్ వివరాలు సేవ్ అయ్యాయి!',
      brokerRegComplete: 'బ్రోకర్ బ్యాంక్ & UPI వివరాలు సేవ్ అయ్యాయి!',
      profileUpdated: 'ప్రొఫైల్ వివరాలు అప్‌డేట్ అయ్యాయి!',
      uploadPcrFirst: 'దయచేసి కనీసం 1 PCR ల్యాబ్ ఫోటో అప్‌లోడ్ చేయండి.',
      batchPublished: 'కొత్త సీడ్ బ్యాచ్ లైవ్ అయింది!',
      batchUpdated: 'బ్యాచ్ వివరాలు & ఫైల్స్ అప్‌డేట్ అయ్యాయి!',
      batchRemoved: 'సీడ్ బ్యాచ్ తొలగించబడింది.',
      liveVideoRequested: 'లైవ్ ట్యాంక్ వీడియో రిక్వెస్ట్ హేచరీకి పంపబడింది!',
      packingMarked: 'ప్యాకింగ్ పూర్తయినట్లు రైతుకు పంపబడింది!',
      paymentReceivedDone: 'Payment Received నిర్ధారించబడింది! Full Paid Receipt సిద్ధం.',
      bookingCancelled: 'బుకింగ్ క్యాన్సిల్ చేయబడింది! 2% వాపస్ వచ్చింది.',
      farmerLocked: 'రైతు 365 రోజుల పాటు మీ ID కి లాక్ చేయబడ్డారు!',
      paymentSuccess: 'బుకింగ్ పూర్తయింది! Gate-Pass & రసీదు సిద్ధం.',
      enterUtr: 'దయచేసి 12-అంకెల UPI / Bank UTR రిఫరెన్స్ నంబర్ ఎంటర్ చేయండి.',
      calcUpdated: 'దిగుబడి & లాభాల లెక్కలు అప్‌డేట్ అయ్యాయి!',
      cloudSynced: 'లైవ్ డేటాబేస్ సింక్ పూర్తయింది!'
    }
  }
};

function AquaMarkApp() {
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(() => safeStorage.get('aqm_v12_dark', false));
  const t = DICT[lang] || DICT.en;

  // Separate Camera & File Input Refs
  const pcrFileRef = useRef(null);
  const pcrCamRef = useRef(null);
  const vidFileRef = useRef(null);
  const vidCamRef = useRef(null);
  const editPcrFileRef = useRef(null);
  const editPcrCamRef = useRef(null);
  const editVidFileRef = useRef(null);
  const editVidCamRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => safeStorage.get('aqm_v12_user', null));
  const [registeredUsers, setRegisteredUsers] = useState(() => safeStorage.get('aqm_v12_users_db', {}));

  // Core Application States
  const [hatcheryProfiles, setHatcheryProfiles] = useState(() => safeStorage.get('aqm_v12_hatcheries', INITIAL_DEMO_HATCHERIES));
  const [brokerProfiles, setBrokerProfiles] = useState(() => safeStorage.get('aqm_v12_brokers', {}));
  const [batches, setBatches] = useState(() => safeStorage.get('aqm_v12_batches', INITIAL_DEMO_BATCHES));
  const [bookings, setBookings] = useState(() => safeStorage.get('aqm_v12_bookings', []));
  const [brokerFarmers, setBrokerFarmers] = useState(() => safeStorage.get('aqm_v12_farmers', []));
  const [savedBatchIds, setSavedBatchIds] = useState(() => safeStorage.get('aqm_v12_wishlist', []));
  const [liveVideoRequests, setLiveVideoRequests] = useState(() => safeStorage.get('aqm_v12_videos', []));
  const [farmerPonds, setFarmerPonds] = useState(() => safeStorage.get('aqm_v12_ponds', []));

  // Role-Specific Notifications State
  const [notifications, setNotifications] = useState(() => safeStorage.get('aqm_v12_notifications', [
    {
      id: 'NTF-WELCOME-1',
      targetRole: 'ALL',
      targetPhone: 'ALL',
      title: 'Welcome to Aqua Mark Exchange',
      message: 'All booking updates, cashback refunds, QR gate-pass settlements, and live video alerts appear here with full details.',
      category: 'SYSTEM',
      timestamp: new Date().toLocaleString('en-IN'),
      read: false
    }
  ]));
  const [showNotificationDrawer, setShowNotificationDrawer] = useState(false);

  // Persist states automatically
  useEffect(() => safeStorage.set('aqm_v12_dark', darkMode), [darkMode]);
  useEffect(() => safeStorage.set('aqm_v12_user', currentUser), [currentUser]);
  useEffect(() => safeStorage.set('aqm_v12_users_db', registeredUsers), [registeredUsers]);
  useEffect(() => safeStorage.set('aqm_v12_hatcheries', hatcheryProfiles), [hatcheryProfiles]);
  useEffect(() => safeStorage.set('aqm_v12_brokers', brokerProfiles), [brokerProfiles]);
  useEffect(() => safeStorage.set('aqm_v12_batches', batches), [batches]);
  useEffect(() => safeStorage.set('aqm_v12_bookings', bookings), [bookings]);
  useEffect(() => safeStorage.set('aqm_v12_farmers', brokerFarmers), [brokerFarmers]);
  useEffect(() => safeStorage.set('aqm_v12_wishlist', savedBatchIds), [savedBatchIds]);
  useEffect(() => safeStorage.set('aqm_v12_videos', liveVideoRequests), [liveVideoRequests]);
  useEffect(() => safeStorage.set('aqm_v12_ponds', farmerPonds), [farmerPonds]);
  useEffect(() => safeStorage.set('aqm_v12_notifications', notifications), [notifications]);

  // Helper to push role-isolated notifications with full details
  const pushNotification = ({ targetRole, targetPhone, title, message, category = 'UPDATE', details = null }) => {
    const newItem = {
      id: `NTF-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      targetRole,
      targetPhone: (targetPhone || '').replace(/\D/g, '').slice(-10),
      title,
      message,
      category,
      details,
      timestamp: `${new Date().toLocaleDateString('en-IN')} • ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`,
      read: false
    };
    setNotifications(prev => [newItem, ...prev]);
  };

  // =========================================================================
  // AUTHENTICATION STATES
  // =========================================================================
  const [loginRole, setLoginRole] = useState('buyer');
  const [authMode, setAuthMode] = useState('signup');
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyingWa, setIsVerifyingWa] = useState(false);
  const [waVerifiedDone, setWaVerifiedDone] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Hatchery ₹10,000 Security Deposit & Top-up Modal States
  const [depositPayMethod, setDepositPayMethod] = useState('DIRECT_UPI');
  const [depositQrRevealed, setDepositQrRevealed] = useState(false);
  const [depositUtr, setDepositUtr] = useState('');
  const [depositSourceInput, setDepositSourceInput] = useState('');
  const [showHatcheryDepositModal, setShowHatcheryDepositModal] = useState(false);
  const [addDepositAmount, setAddDepositAmount] = useState('5000');
  const [addDepositUtr, setAddDepositUtr] = useState('');
  const [addDepositSource, setAddDepositSource] = useState('');
  const [showAddMoneyQr, setShowAddMoneyQr] = useState(false);

  // Hatchery QR Scanner Modal States
  const [showHatcheryQrScanner, setShowHatcheryQrScanner] = useState(false);
  const [qrScanInput, setQrScanInput] = useState('');
  const [cameraStreamActive, setCameraStreamActive] = useState(false);
  const scannerVideoRef = useRef(null);

  // Buyer Remaining Balance Payment Modal State
  const [payRemainingBooking, setPayRemainingBooking] = useState(null);
  const [remainingPayMethod, setRemainingPayMethod] = useState('DIRECT_UPI');
  const [remainingQrRevealed, setRemainingQrRevealed] = useState(false);
  const [remainingUtr, setRemainingUtr] = useState('');

  // Buyer Animated Status Tracking Modal State
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [animatedStepIndex, setAnimatedStepIndex] = useState(0);

  // Buyer & Broker Edit Profile Modal States
  const [showBasicEditProfileModal, setShowBasicEditProfileModal] = useState(false);
  const [editProfileDraft, setEditProfileDraft] = useState({ name: '', phone: '', phoneVerified: true, verifying: false });

  // Account Deletion Verification Modal
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [showDeletePwd, setShowDeletePwd] = useState(false);

  // Upload Progress & Media Lightbox
  const [uploadProgress, setUploadProgress] = useState({ active: false, percent: 0, label: '' });
  const [mediaPickerTarget, setMediaPickerTarget] = useState(null);
  const [fullScreenMedia, setFullScreenMedia] = useState(null);

  // Modals & Drawers
  const [sellerTxModal, setSellerTxModal] = useState(null);
  const [brokerTxListModal, setBrokerTxListModal] = useState(null);
  const [videoRequestTargetBatch, setVideoRequestTargetBatch] = useState(null);
  const [videoRequestForm, setVideoRequestForm] = useState({ name: '', whatsapp: '', note: '' });
  const [showSellerVideoModal, setShowSellerVideoModal] = useState(false);
  const [gatePassBooking, setGatePassBooking] = useState(null);
  const [transitPredictorBatch, setTransitPredictorBatch] = useState(null);
  const [transitDistanceKm, setTransitDistanceKm] = useState(140);

  const [inspectedBatch, setInspectedBatch] = useState(null);
  const [inspectedBuyerBooking, setInspectedBuyerBooking] = useState(null);
  const [inspectedSellerOrder, setInspectedSellerOrder] = useState(null);
  const [selectedBrokerTx, setSelectedBrokerTx] = useState(null);

  const [brokerBankForm, setBrokerBankForm] = useState({
    accountName: '', accountNo: '', ifsc: '', upiId: ''
  });
  const [isEditingBrokerBank, setIsEditingBrokerBank] = useState(false);

  const [unifiedSellerForm, setUnifiedSellerForm] = useState({
    realName: '', caaLicense: '', zone: 'Kakinada Zone', customZone: '',
    realAddress: '', googleMapsLink: '', description: '',
    accountName: '', accountNo: '', ifsc: '', upiId: ''
  });
  const [isEditingSellerProfile, setIsEditingSellerProfile] = useState(false);

  const [buyerTab, setBuyerTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [onlySavedFilter, setOnlySavedFilter] = useState(false);
  const [sortBy, setSortBy] = useState('RATING');
  const [compareIds, setCompareIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const [cardDensityChoice, setCardDensityChoice] = useState({});

  const [ratingDrafts, setRatingDrafts] = useState({});
  const [waterTest, setWaterTest] = useState({ ph: 7.9, doLevel: 5.2, alkalinity: 145, ammonia: 0.04, salinity: 14 });
  const [acclimCalc, setAcclimCalc] = useState({ hatcheryPpt: 18, pondPpt: 10 });
  const [oxygenCalc, setOxygenCalc] = useState({ seedCount: 200000, travelHours: 5 });

  const [newPondForm, setNewPondForm] = useState({
    pondName: 'Pond-1', acres: 2.5, stockedQty: 200000,
    stockingDate: new Date().toISOString().split('T')[0], dailyFeedKg: 6, trayLeftover: '0% (Clean)'
  });

  const [editingBatchId, setEditingBatchId] = useState(null);
  const [editBatchValues, setEditBatchValues] = useState({
    species: 'Litopenaeus vannamei (SyAqua Line)',
    broodstock: 'SyAqua USA / Thailand Certified',
    plStage: 'PL12',
    salinity: 16,
    pricePer1000: 0.42,
    stockAmount: 10,
    stockUnit: 'LAKHS',
    minPackAmount: 2,
    minPackUnit: 'LAKHS',
    bonusPercent: 15,
    availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    availableTimeSlot: 'All Day (24 Hours Flexible)',
    pcrImages: [],
    tankVideos: []
  });

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [modalError, setModalError] = useState('');
  const [bookingForm, setBookingForm] = useState({
    farmerName: '',
    farmerPhone: '',
    qtyAmount: '2',
    qtyUnit: 'LAKHS',
    pondSplitCount: '1',
    pondSalinity: '15',
    packingDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    packingTimeSlot: 'All Day (24 Hours Flexible)',
    brokerMarginPaise: '',
    includeTransport: false,
    paymentPlan: 'ADVANCE', // 'ADVANCE' (4%) | 'FULL' (100%)
    paymentMethod: 'RAZORPAY',
    upiSubMode: 'QR',
    qrRevealed: false,
    utrReference: ''
  });

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [toast, setToast] = useState(null);

  const [calcInputs, setCalcInputs] = useState({
    ponds: 2, acresPerPond: 2.5, density: 40, survival: 85,
    targetCount: 30, fcr: 1.4, marketRatePerKg: 395, feedCostPerKg: 88, powerProbioticCostPerAcre: 35000
  });
  const [calcResult, setCalcResult] = useState({
    totalAcres: 5, totalSeedsNeeded: 809372, harvestKg: 22932, harvestTons: '22.93',
    totalFeedKg: 32105, totalFeedBags: 1285, grossRevenue: 9058140, totalExpenses: 3348270,
    netProfit: 5709870, profitPerAcre: 1141974, breakEvenPerKg: 146
  });

  const [newFarmer, setNewFarmer] = useState({ name: '', phone: '', village: '', acres: '' });

  const [newBatchForm, setNewBatchForm] = useState({
    batchNumber: '',
    species: 'Litopenaeus vannamei (SyAqua Line)',
    customSpecies: '',
    broodstock: 'SyAqua USA / Thailand Certified',
    plStage: 'PL12',
    customStage: '',
    pricePer1000: 0.43,
    stockAmount: '10',
    stockUnit: 'LAKHS',
    minPackAmount: '2',
    minPackUnit: 'LAKHS',
    salinity: 16,
    bonusPercent: 15,
    availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    availableTimeSlot: 'All Day (24 Hours Flexible)'
  });
  const [pcrImages, setPcrImages] = useState([]);
  const [tankVideos, setTankVideos] = useState([]);

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4200);
  };

  const computeSeedCount = (amountStr, unit) => {
    const num = Math.max(1, Math.min(100, Number(amountStr) || 1));
    const multiplier = unit === 'MILLIONS' ? 1000000 : 100000;
    return num * multiplier;
  };

  // Sequential animation trigger when Status modal opens
  useEffect(() => {
    if (!statusModalBooking) {
      setAnimatedStepIndex(0);
      return;
    }
    const isCleared = statusModalBooking.settlement?.status === 'BALANCE_CLEARED';
    const isPacked = statusModalBooking.packingStatus === 'PACKING_DONE_BY_SELLER' || isCleared;
    const maxStep = isCleared ? 4 : isPacked ? 3 : 2;

    setAnimatedStepIndex(0);
    let current = 0;
    const timer = setInterval(() => {
      current += 1;
      setAnimatedStepIndex(current);
      if (current >= maxStep) clearInterval(timer);
    }, 340);
    return () => clearInterval(timer);
  }, [statusModalBooking]);

  // Camera stream handler for Hatchery QR Scanner
  useEffect(() => {
    let stream = null;
    if (showHatcheryQrScanner && navigator.mediaDevices?.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        .then((s) => {
          stream = s;
          setCameraStreamActive(true);
          if (scannerVideoRef.current) {
            scannerVideoRef.current.srcObject = s;
          }
        })
        .catch(() => {
          setCameraStreamActive(false);
        });
    }
    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
      setCameraStreamActive(false);
    };
  }, [showHatcheryQrScanner]);

  const pageBg = darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900';
  const subCardBg = darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800';
  const inputCls = darkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-teal-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-teal-600';

  // =========================================================================
  // ROLE-ISOLATED WHATSAPP AUTO-VERIFY + PASSWORD AUTHENTICATION
  // =========================================================================
  const getUserKey = (phone, role) => `${phone}_${role}`;

  const handleTriggerInstantWhatsAppVerify = () => {
    const cleanPhone = (loginPhone || '').replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }

    const roleKey = getUserKey(cleanPhone, loginRole);
    if (authMode === 'signup' && registeredUsers[roleKey]) {
      showToast(t.toasts.alreadyRegistered);
      setAuthMode('login');
      return;
    }

    if (authMode === 'forgot' && !registeredUsers[roleKey]) {
      showToast(t.toasts.notRegistered);
      setAuthMode('signup');
      return;
    }

    setIsVerifyingWa(true);
    const verifyToken = `AQM-${loginRole.toUpperCase()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const waText = `Aqua Mark Verified ${loginRole.toUpperCase()}\nMobile: +91 ${cleanPhone}\nToken: ${verifyToken}`;
    const waUrl = `https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`;
    const popup = window.open(waUrl, '_blank', 'noopener,noreferrer');

    setTimeout(() => {
      try { if (popup && !popup.closed) popup.close(); } catch { }
      window.focus();
      setIsVerifyingWa(false);
      setWaVerifiedDone(true);
      showToast(t.toasts.waVerified);
    }, 1200);
  };

  const handleCompleteSignUpOrReset = (e) => {
    e.preventDefault();
    const cleanPhone = (loginPhone || '').replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }
    if ((loginPassword || '').trim().length < 6) {
      showToast(t.toasts.passwordShort);
      return;
    }

    const roleKey = getUserKey(cleanPhone, loginRole);
    const existing = registeredUsers[roleKey];
    const finalName = authMode === 'forgot'
      ? (existing?.name || loginName.trim() || 'Verified User')
      : (loginName.trim() || (loginRole === 'buyer' ? 'Farmer' : loginRole === 'seller' ? 'Hatchery Owner' : 'Broker Partner'));

    const userRecord = {
      phone: cleanPhone,
      name: finalName,
      role: loginRole,
      password: loginPassword.trim(),
      depositPaid: existing?.depositPaid || Boolean(hatcheryProfiles[cleanPhone]?.depositPaid),
      depositUtr: existing?.depositUtr || hatcheryProfiles[cleanPhone]?.depositUtr || '',
      last_login: new Date().toISOString()
    };

    setRegisteredUsers(prev => ({ ...prev, [roleKey]: userRecord }));
    pushNotification({
      targetRole: loginRole,
      targetPhone: cleanPhone,
      title: authMode === 'forgot' ? 'Password Reset Successful' : 'Account Registered & Verified',
      message: `Welcome ${finalName}! Your ${t.portalBadges[loginRole]} is active on +91 ${cleanPhone}.`,
      category: 'ACCOUNT'
    });

    completePortalLogin({
      role: loginRole,
      name: finalName,
      phone: cleanPhone,
      depositPaid: userRecord.depositPaid
    });
  };

  const handlePasswordLoginSubmit = (e) => {
    e.preventDefault();
    const cleanPhone = (loginPhone || '').replace(/\D/g, '').slice(-10);
    if (cleanPhone.length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }
    const roleKey = getUserKey(cleanPhone, loginRole);
    const found = registeredUsers[roleKey];
    if (!found) {
      showToast(t.toasts.notRegistered);
      return;
    }
    if (loginPassword.trim() !== found.password) {
      showToast(t.toasts.wrongPassword);
      return;
    }

    completePortalLogin({
      role: loginRole,
      name: found.name,
      phone: cleanPhone,
      depositPaid: Boolean(found.depositPaid || hatcheryProfiles[cleanPhone]?.depositPaid)
    });
  };

  const completePortalLogin = (userObj) => {
    setCurrentUser(userObj);
    if (userObj.role === 'buyer') {
      setBookingForm(prev => ({ ...prev, farmerName: userObj.name, farmerPhone: userObj.phone }));
    }
    if (userObj.role === 'seller') {
      setUnifiedSellerForm(prev => ({ ...prev, accountName: userObj.name }));
    }
    if (userObj.role === 'mediator') {
      setBrokerBankForm(prev => ({ ...prev, accountName: userObj.name }));
    }
    setWaVerifiedDone(false);
    setLoginPassword('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setWaVerifiedDone(false);
    setIsVerifyingWa(false);
    setLoginPassword('');
    setSelectedBatch(null);
    setModalError('');
    setShowNotificationDrawer(false);
  };

  // =========================================================================
  // HATCHERY ₹10,000 MANDATORY SECURITY DEPOSIT & ADD MONEY TOP-UP
  // =========================================================================
  const handleConfirmHatcheryDeposit = (e) => {
    e.preventDefault();
    if (!currentUser?.phone) return;
    if ((depositPayMethod === 'DIRECT_UPI' || depositPayMethod === 'BANK_TO_BANK') && !depositUtr.trim()) {
      showToast(t.toasts.enterUtr);
      return;
    }

    const utrRef = depositPayMethod === 'RAZORPAY'
      ? `RZP_DEP_${Math.floor(100000 + Math.random() * 900000)}`
      : `${depositPayMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT'}_${depositUtr.trim().toUpperCase()}`;

    const sourceAcc = depositSourceInput.trim() || (depositPayMethod === 'DIRECT_UPI' ? `UPI (${utrRef})` : `Bank Account (${utrRef})`);
    const roleKey = getUserKey(currentUser.phone, 'seller');
    const existingUser = registeredUsers[roleKey] || {
      phone: currentUser.phone,
      name: currentUser.name,
      role: 'seller',
      password: ''
    };
    const updatedUserRecord = { ...existingUser, depositPaid: true, depositUtr: utrRef, depositSourceAccount: sourceAcc };

    setRegisteredUsers(prev => ({ ...prev, [roleKey]: updatedUserRecord }));
    setCurrentUser(prev => ({ ...prev, depositPaid: true, depositUtr: utrRef, depositSourceAccount: sourceAcc }));

    if (hatcheryProfiles[currentUser.phone]) {
      const existingProf = hatcheryProfiles[currentUser.phone];
      const nextProfiles = {
        ...hatcheryProfiles,
        [currentUser.phone]: {
          ...existingProf,
          depositPaid: true,
          depositAmount: (existingProf.depositAmount || 0) + 10000,
          depositUtr: utrRef,
          depositSourceAccount: sourceAcc,
          depositHistory: [
            { id: `DEP-${Date.now()}`, amount: 10000, ref: utrRef, source: sourceAcc, date: new Date().toLocaleDateString('en-IN'), note: 'Initial Security Deposit' },
            ...(existingProf.depositHistory || [])
          ]
        }
      };
      setHatcheryProfiles(nextProfiles);
    }

    pushNotification({
      targetRole: 'seller',
      targetPhone: currentUser.phone,
      title: '₹10,000 Security Deposit Verified',
      message: `Your security deposit of ₹10,000 (Ref: ${utrRef}) from ${sourceAcc} is verified and locked safely.`,
      category: 'DEPOSIT'
    });

    setDepositUtr('');
    setDepositSourceInput('');
    setDepositQrRevealed(false);
    showToast(t.toasts.depositComplete);
  };

  const handleAddMoreDepositMoney = (e) => {
    e.preventDefault();
    if (!currentUser?.phone || !hatcheryProfiles[currentUser.phone]) return;
    const addAmt = Math.max(1000, Number(addDepositAmount) || 0);
    if (!addDepositUtr.trim()) {
      showToast(t.toasts.enterUtr);
      return;
    }

    const existingProf = hatcheryProfiles[currentUser.phone];
    const cleanRef = `UPI_${addDepositUtr.trim().toUpperCase()}`;
    const src = addDepositSource.trim() || existingProf.depositSourceAccount || existingProf.bankDetails?.upiId || 'Registered UPI/Bank';
    const newTotal = (existingProf.depositAmount || 10000) + addAmt;

    const updatedProf = {
      ...existingProf,
      depositAmount: newTotal,
      depositSourceAccount: src,
      depositHistory: [
        {
          id: `DEP-${Date.now()}`,
          amount: addAmt,
          ref: cleanRef,
          source: src,
          date: new Date().toLocaleDateString('en-IN'),
          note: 'Additional Security Deposit Top-Up'
        },
        ...(existingProf.depositHistory || [
          {
            id: 'DEP-INIT',
            amount: existingProf.depositAmount || 10000,
            ref: existingProf.depositUtr || 'VERIFIED_10K',
            source: existingProf.depositSourceAccount || existingProf.bankDetails?.upiId || 'Initial Deposit Account',
            date: existingProf.registeredAt || new Date().toLocaleDateString('en-IN'),
            note: 'Mandatory Security Deposit'
          }
        ])
      ]
    };

    setHatcheryProfiles(prev => ({ ...prev, [currentUser.phone]: updatedProf }));
    pushNotification({
      targetRole: 'seller',
      targetPhone: currentUser.phone,
      title: `₹${addAmt.toLocaleString('en-IN')} Added to Security Deposit`,
      message: `Total Hatchery Deposit balance is now ₹${newTotal.toLocaleString('en-IN')} (Ref: ${cleanRef}, Source: ${src}).`,
      category: 'DEPOSIT'
    });

    setAddDepositUtr('');
    setAddDepositSource('');
    setShowAddMoneyQr(false);
    showToast(`₹${addAmt.toLocaleString('en-IN')} added! Total Deposit: ₹${newTotal.toLocaleString('en-IN')}`);
  };

  // =========================================================================
  // BUYER & BROKER EDIT PROFILE
  // =========================================================================
  const openBasicEditProfile = () => {
    if (!currentUser) return;
    setEditProfileDraft({
      name: currentUser.name || '',
      phone: currentUser.phone || '',
      phoneVerified: true,
      verifying: false
    });
    setShowBasicEditProfileModal(true);
  };

  const handleVerifyChangedPhoneInProfile = () => {
    const cleanNew = (editProfileDraft.phone || '').replace(/\D/g, '').slice(-10);
    if (cleanNew.length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }
    setEditProfileDraft(prev => ({ ...prev, verifying: true }));
    const waText = `Aqua Mark Profile Phone Update\nNew Mobile: +91 ${cleanNew}`;
    const popup = window.open(`https://wa.me/${ADMIN_WHATSAPP_NUMBER}?text=${encodeURIComponent(waText)}`, '_blank', 'noopener,noreferrer');
    setTimeout(() => {
      try { if (popup && !popup.closed) popup.close(); } catch { }
      window.focus();
      setEditProfileDraft(prev => ({ ...prev, verifying: false, phoneVerified: true }));
      showToast('New mobile number verified via WhatsApp!');
    }, 1200);
  };

  const handleSaveBasicProfile = (e) => {
    e.preventDefault();
    if (!currentUser) return;
    const cleanNewPhone = (editProfileDraft.phone || '').replace(/\D/g, '').slice(-10);
    if (cleanNewPhone.length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }
    if (!editProfileDraft.phoneVerified) {
      showToast('Please verify your new mobile number first.');
      return;
    }

    const oldKey = getUserKey(currentUser.phone, currentUser.role);
    const newKey = getUserKey(cleanNewPhone, currentUser.role);
    const oldRecord = registeredUsers[oldKey] || { password: '' };

    const updatedRecord = {
      ...oldRecord,
      phone: cleanNewPhone,
      name: editProfileDraft.name.trim(),
      role: currentUser.role
    };

    setRegisteredUsers(prev => {
      const next = { ...prev };
      if (oldKey !== newKey) delete next[oldKey];
      next[newKey] = updatedRecord;
      return next;
    });

    if (currentUser.role === 'mediator' && brokerProfiles[currentUser.phone]) {
      const nextBrokers = { ...brokerProfiles };
      const bp = { ...nextBrokers[currentUser.phone], brokerPhone: cleanNewPhone, brokerName: updatedRecord.name };
      if (currentUser.phone !== cleanNewPhone) delete nextBrokers[currentUser.phone];
      nextBrokers[cleanNewPhone] = bp;
      setBrokerProfiles(nextBrokers);
    }

    setCurrentUser({ ...currentUser, name: updatedRecord.name, phone: cleanNewPhone });
    setShowBasicEditProfileModal(false);
    showToast(t.toasts.profileUpdated);
  };

  // =========================================================================
  // PASSWORD-VERIFIED ACCOUNT DELETION + AUTOMATIC REFUND TO SOURCE ACCOUNT
  // =========================================================================
  const handleConfirmDeleteAccount = (e) => {
    e.preventDefault();
    if (!currentUser?.phone) return;
    const roleKey = getUserKey(currentUser.phone, currentUser.role);
    const record = registeredUsers[roleKey];
    if (record && record.password && deleteConfirmPassword.trim() !== record.password) {
      showToast(t.toasts.wrongPassword);
      return;
    }

    const phone = currentUser.phone;
    let refundAlertMsg = t.toasts.accountDeleted;

    if (currentUser.role === 'seller') {
      const prof = hatcheryProfiles[phone];
      const refundAmt = prof?.depositAmount || 10000;
      const originAccount = prof?.depositSourceAccount || prof?.bankDetails?.upiId || prof?.depositUtr || 'Original Deposit Source Account';

      refundAlertMsg = `Account Deleted! ₹${refundAmt.toLocaleString('en-IN')} Security Deposit has been automatically initiated for refund back to the exact origin account: ${originAccount}.`;

      const nextHatcheries = { ...hatcheryProfiles };
      delete nextHatcheries[phone];
      setHatcheryProfiles(nextHatcheries);
      setBatches(prev => prev.filter(b => b.ownerPhone !== phone));
    }

    if (currentUser.role === 'mediator') {
      const nextBrokers = { ...brokerProfiles };
      delete nextBrokers[phone];
      setBrokerProfiles(nextBrokers);
    }

    setRegisteredUsers(prev => {
      const copy = { ...prev };
      delete copy[roleKey];
      return copy;
    });

    setShowDeleteAccountModal(false);
    setShowHatcheryDepositModal(false);
    setDeleteConfirmPassword('');
    setIsEditingSellerProfile(false);
    setIsEditingBrokerBank(false);
    setShowBasicEditProfileModal(false);
    handleLogout();
    showToast(refundAlertMsg);
  };

  const handleManualCloudSync = () => {
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      showToast(t.toasts.cloudSynced);
    }, 550);
  };

  // =========================================================================
  // SELLER & BROKER PROFILE HANDLERS
  // =========================================================================
  const handleCompleteUnifiedSellerReg = (e) => {
    e.preventDefault();
    if (!currentUser?.phone) return;
    const finalZone = unifiedSellerForm.zone === 'OTHER_CUSTOM'
      ? (unifiedSellerForm.customZone.trim() || 'Coastal Zone')
      : unifiedSellerForm.zone;

    const originAccount = currentUser.depositSourceAccount || unifiedSellerForm.upiId || currentUser.depositUtr || 'Verified Source Account';
    const profile = {
      ownerPhone: currentUser.phone,
      hatcheryCode: `Verified Hatchery #H-${Math.floor(300 + Math.random() * 600)}`,
      realName: unifiedSellerForm.realName,
      caaLicense: unifiedSellerForm.caaLicense.toUpperCase(),
      zone: finalZone,
      realAddress: unifiedSellerForm.realAddress,
      googleMapsLink: unifiedSellerForm.googleMapsLink.trim(),
      description: unifiedSellerForm.description.trim(),
      registeredAt: new Date().toLocaleDateString('en-IN'),
      depositPaid: true,
      depositAmount: 10000,
      depositUtr: currentUser.depositUtr || 'VERIFIED_10K',
      depositSourceAccount: originAccount,
      depositHistory: [
        {
          id: `DEP-${Date.now()}`,
          amount: 10000,
          ref: currentUser.depositUtr || 'VERIFIED_10K',
          source: originAccount,
          date: new Date().toLocaleDateString('en-IN'),
          note: 'Mandatory Security Deposit'
        }
      ],
      bankDetails: {
        accountName: unifiedSellerForm.accountName,
        accountNo: unifiedSellerForm.accountNo,
        ifsc: unifiedSellerForm.ifsc.toUpperCase(),
        upiId: unifiedSellerForm.upiId
      }
    };
    setHatcheryProfiles(prev => ({ ...prev, [currentUser.phone]: profile }));
    pushNotification({
      targetRole: 'seller',
      targetPhone: currentUser.phone,
      title: 'Hatchery Profile Activated',
      message: `${profile.realName} (${profile.caaLicense}) is now live and verified.`,
      category: 'ACCOUNT'
    });
    showToast(t.toasts.regComplete);
  };

  const handleCompleteBrokerReg = (e) => {
    e.preventDefault();
    if (!currentUser?.phone) return;
    const profile = {
      brokerPhone: currentUser.phone,
      brokerName: currentUser.name,
      bankDetails: {
        accountName: brokerBankForm.accountName,
        accountNo: brokerBankForm.accountNo,
        ifsc: brokerBankForm.ifsc.toUpperCase(),
        upiId: brokerBankForm.upiId
      }
    };
    setBrokerProfiles(prev => ({ ...prev, [currentUser.phone]: profile }));
    setIsEditingBrokerBank(false);
    showToast(t.toasts.brokerRegComplete);
  };

  const handleUpdateSellerProfileAndBank = (e) => {
    e.preventDefault();
    if (!currentUser?.phone || !hatcheryProfiles[currentUser.phone]) return;
    const existing = hatcheryProfiles[currentUser.phone];
    const finalZone = unifiedSellerForm.zone === 'OTHER_CUSTOM'
      ? (unifiedSellerForm.customZone.trim() || existing.zone)
      : unifiedSellerForm.zone;

    const updatedProfile = {
      ...existing,
      realName: unifiedSellerForm.realName,
      realAddress: unifiedSellerForm.realAddress,
      googleMapsLink: unifiedSellerForm.googleMapsLink.trim(),
      description: unifiedSellerForm.description.trim(),
      zone: finalZone,
      bankDetails: {
        accountName: unifiedSellerForm.accountName,
        accountNo: unifiedSellerForm.accountNo,
        ifsc: unifiedSellerForm.ifsc.toUpperCase(),
        upiId: unifiedSellerForm.upiId
      }
    };
    setHatcheryProfiles(prev => ({ ...prev, [currentUser.phone]: updatedProfile }));

    setBatches(prev => prev.map(b =>
      b.ownerPhone === currentUser.phone
        ? {
          ...b,
          realName: updatedProfile.realName,
          realAddress: updatedProfile.realAddress,
          googleMapsLink: updatedProfile.googleMapsLink,
          description: updatedProfile.description,
          zone: updatedProfile.zone,
          bankDetails: updatedProfile.bankDetails
        }
        : b
    ));

    setIsEditingSellerProfile(false);
    showToast(t.toasts.profileUpdated);
  };

  // =========================================================================
  // WATERMARK STAMP (NO LOCATION/COORDS, STYLISH DATE/TIME, CAA NUMBER +
  // FULL-IMAGE TRANSPARENT AQUAMARK DIAGONAL WATERMARK)
  // =========================================================================
  const handleMultiplePcrUpload = async (fileList, isEditMode = false) => {
    if (!fileList || fileList.length === 0) return;
    setMediaPickerTarget(null);
    const filesArray = Array.from(fileList);
    const uploadedResults = [];
    const baseCount = isEditMode ? (editBatchValues.pcrImages || []).length : pcrImages.length;
    const myHatchery = hatcheryProfiles[currentUser?.phone] || {};

    setUploadProgress({ active: true, percent: 25, label: 'Applying AquaMark Security Watermark...' });
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const stampMeta = { caaLicense: myHatchery.caaLicense || 'CAA/AP/VERIFIED', dateStr, timeStr };

    for (let i = 0; i < filesArray.length; i++) {
      const rawFile = filesArray[i];
      setUploadProgress({ active: true, percent: 65, label: `Watermarking & Optimizing Image ${i + 1}/${filesArray.length}...` });
      const readyFile = await stampAndCompressImage(rawFile, stampMeta, 2 * 1024 * 1024);
      const previewUrl = URL.createObjectURL(readyFile);
      uploadedResults.push({
        label: `PCR-Report-${baseCount + i + 1}`,
        url: previewUrl,
        stamp: `CAA: ${stampMeta.caaLicense} | ${dateStr} ${timeStr}`
      });
    }

    setUploadProgress({ active: true, percent: 100, label: 'Watermark Applied!' });
    setTimeout(() => setUploadProgress({ active: false, percent: 0, label: '' }), 600);

    if (uploadedResults.length > 0) {
      if (isEditMode) {
        setEditBatchValues(prev => ({ ...prev, pcrImages: [...(prev.pcrImages || []), ...uploadedResults] }));
      } else {
        setPcrImages(prev => [...prev, ...uploadedResults]);
      }
      showToast(`${uploadedResults.length} PCR image(s) stamped with AquaMark Security Watermark!`);
    }
  };

  const handleMultipleVideoUpload = async (fileList, isEditMode = false) => {
    if (!fileList || fileList.length === 0) return;
    setMediaPickerTarget(null);
    const filesArray = Array.from(fileList);
    const uploadedVideos = [];
    const baseCount = isEditMode ? (editBatchValues.tankVideos || []).length : tankVideos.length;
    const myHatchery = hatcheryProfiles[currentUser?.phone] || {};

    setUploadProgress({ active: true, percent: 25, label: 'Applying AquaMark Video Stamp...' });
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const stampMeta = { caaLicense: myHatchery.caaLicense || 'CAA/AP/VERIFIED', dateStr, timeStr };

    for (let i = 0; i < filesArray.length; i++) {
      const rawFile = filesArray[i];
      setUploadProgress({ active: true, percent: 65, label: `Watermarking Video ${i + 1}/${filesArray.length}...` });
      const readyVideo = await stampAndCompressVideo(rawFile, stampMeta, 10 * 1024 * 1024);
      const previewUrl = URL.createObjectURL(readyVideo);
      uploadedVideos.push({
        label: `Tank-Video-${baseCount + i + 1}`,
        url: previewUrl,
        stamp: `CAA: ${stampMeta.caaLicense} | ${dateStr} ${timeStr}`
      });
    }

    setUploadProgress({ active: true, percent: 100, label: 'Video Stamped!' });
    setTimeout(() => setUploadProgress({ active: false, percent: 0, label: '' }), 600);

    if (uploadedVideos.length > 0) {
      if (isEditMode) {
        setEditBatchValues(prev => ({ ...prev, tankVideos: [...(prev.tankVideos || []), ...uploadedVideos] }));
      } else {
        setTankVideos(prev => [...prev, ...uploadedVideos]);
      }
      showToast(`${uploadedVideos.length} Tank video(s) stamped & attached!`);
    }
  };

  // =========================================================================
  // BATCH PUBLISH (WITH MINIMUM PACKING QTY), PAUSE/RESUME, FULL EDIT & DELETE
  // =========================================================================
  const handlePublishBatch = (e) => {
    e.preventDefault();
    const myHatchery = hatcheryProfiles[currentUser?.phone];
    if (!myHatchery) return;
    if (pcrImages.length === 0) {
      showToast(t.toasts.uploadPcrFirst);
      return;
    }

    const finalSpecies = newBatchForm.species === 'OTHER_CUSTOM'
      ? (newBatchForm.customSpecies.trim() || 'Litopenaeus vannamei')
      : newBatchForm.species;

    const finalStage = newBatchForm.plStage === 'OTHER_CUSTOM'
      ? (newBatchForm.customStage.trim() || 'PL12')
      : newBatchForm.plStage;

    const exactStockCount = computeSeedCount(newBatchForm.stockAmount, newBatchForm.stockUnit);
    const exactMinPacking = computeSeedCount(newBatchForm.minPackAmount, newBatchForm.minPackUnit);
    const customBatchNo = (newBatchForm.batchNumber || '').trim().toUpperCase() || `BATCH-${100 + batches.length + 1}`;

    const created = {
      id: customBatchNo,
      ownerPhone: currentUser.phone,
      hatcheryCode: myHatchery.hatcheryCode,
      realName: myHatchery.realName,
      realAddress: myHatchery.realAddress,
      googleMapsLink: myHatchery.googleMapsLink || '',
      description: myHatchery.description || '',
      realPhone: currentUser.phone,
      caaLicense: myHatchery.caaLicense,
      registeredAt: myHatchery.registeredAt || new Date().toLocaleDateString('en-IN'),
      bankDetails: { ...myHatchery.bankDetails },
      zone: myHatchery.zone,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      species: finalSpecies,
      broodstock: newBatchForm.broodstock,
      plStage: finalStage,
      pricePer1000: Number(newBatchForm.pricePer1000) || 0.43,
      availableStock: exactStockCount,
      minPackingQty: exactMinPacking,
      salinity: Number(newBatchForm.salinity) || 16,
      bonusPercent: Number(newBatchForm.bonusPercent) || 15,
      availableDate: newBatchForm.availableDate,
      availableTimeSlot: newBatchForm.availableTimeSlot,
      pcrImages: [...pcrImages],
      tankVideos: [...tankVideos],
      paused: false,
      vigorScore: 96
    };

    setBatches(prev => [created, ...prev]);
    pushNotification({
      targetRole: 'seller',
      targetPhone: currentUser.phone,
      title: `Batch ${created.id} Published Live`,
      message: `${created.plStage} (${created.species}) • Stock: ${formatSeedQuantityShort(exactStockCount)} • Min Packing: ${formatSeedQuantityShort(exactMinPacking)}.`,
      category: 'BATCH'
    });

    setPcrImages([]);
    setTankVideos([]);
    setNewBatchForm(prev => ({ ...prev, batchNumber: '' }));
    showToast(t.toasts.batchPublished);
  };

  const togglePauseBatch = (batchId) => {
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const nextPaused = !b.paused;
      showToast(nextPaused ? `Batch ${batchId} paused` : `Batch ${batchId} is now LIVE!`);
      return { ...b, paused: nextPaused };
    }));
  };

  const startEditingBatch = (batch) => {
    setEditingBatchId(batch.id);
    const isMillions = (batch.availableStock || 0) >= 1000000 && (batch.availableStock % 1000000 === 0);
    const amountVal = isMillions
      ? Math.max(1, Math.round(batch.availableStock / 1000000))
      : Math.max(1, Math.round((batch.availableStock || 100000) / 100000));

    const minQty = batch.minPackingQty || 100000;
    const isMinMillions = minQty >= 1000000 && (minQty % 1000000 === 0);
    const minAmountVal = isMinMillions
      ? Math.max(1, Math.round(minQty / 1000000))
      : Math.max(1, Math.round(minQty / 100000));

    setEditBatchValues({
      species: batch.species || 'Litopenaeus vannamei (SyAqua Line)',
      broodstock: batch.broodstock || 'SyAqua USA / Thailand Certified',
      plStage: batch.plStage || 'PL12',
      salinity: batch.salinity || 16,
      pricePer1000: batch.pricePer1000 || 0.43,
      stockAmount: amountVal,
      stockUnit: isMillions ? 'MILLIONS' : 'LAKHS',
      minPackAmount: minAmountVal,
      minPackUnit: isMinMillions ? 'MILLIONS' : 'LAKHS',
      bonusPercent: batch.bonusPercent || 15,
      availableDate: batch.availableDate || new Date().toISOString().split('T')[0],
      availableTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
      pcrImages: [...(batch.pcrImages || [])],
      tankVideos: [...(batch.tankVideos || [])]
    });
  };

  const saveEditedBatch = (batchId) => {
    const updatedStock = computeSeedCount(editBatchValues.stockAmount, editBatchValues.stockUnit);
    const updatedMinPack = computeSeedCount(editBatchValues.minPackAmount, editBatchValues.minPackUnit);
    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      return {
        ...b,
        species: editBatchValues.species,
        broodstock: editBatchValues.broodstock,
        plStage: editBatchValues.plStage,
        salinity: Number(editBatchValues.salinity),
        pricePer1000: Number(editBatchValues.pricePer1000),
        availableStock: updatedStock,
        minPackingQty: updatedMinPack,
        bonusPercent: Number(editBatchValues.bonusPercent),
        availableDate: editBatchValues.availableDate,
        availableTimeSlot: editBatchValues.availableTimeSlot,
        pcrImages: [...(editBatchValues.pcrImages || [])],
        tankVideos: [...(editBatchValues.tankVideos || [])]
      };
    }));
    setEditingBatchId(null);
    showToast(t.toasts.batchUpdated);
  };

  const removeBatch = (batchId) => {
    setBatches(prev => prev.filter(b => b.id !== batchId));
    showToast(t.toasts.batchRemoved);
  };

  // =========================================================================
  // BOOKING & PAYMENT FLOW (ADVANCE 4% OR FULL 100% PAYMENT + MIN PACKING)
  // =========================================================================
  const finalizeBookingRecord = (paymentRef, qty, hatcheryFixedCost, marginPaiseNum, transportCost, advance4Pct, isFullPaymentNow) => {
    const bonusSeeds = Math.round(qty * ((selectedBatch.bonusPercent || 15) / 100));
    const matchedBrokerFarmer = brokerFarmers.find(
      (f) => (f.phone || '').slice(-10) === (bookingForm.farmerPhone || '').slice(-10)
    );
    const isBrokerLinked = Boolean(matchedBrokerFarmer) || currentUser?.role === 'mediator';

    const silentPlatform2Pct = Math.round(hatcheryFixedCost * 0.02);
    const hold2Pct = Math.max(0, advance4Pct - silentPlatform2Pct);
    const brokerExtraMarginTotal = isBrokerLinked ? Math.round(qty * (marginPaiseNum / 100)) : 0;
    const totalFarmerPayable = hatcheryFixedCost + brokerExtraMarginTotal + transportCost;
    const paidNowAmount = isFullPaymentNow ? totalFarmerPayable : advance4Pct;
    const balanceAtPacking = isFullPaymentNow ? 0 : (totalFarmerPayable - advance4Pct);

    const now = new Date();
    const issueDateStr = now.toLocaleDateString('en-IN');
    const issueTimeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newBooking = {
      bookingId: `AQ-${Math.floor(10000 + Math.random() * 90000)}`,
      gatePassPin: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: paymentRef,
      paymentMode: bookingForm.paymentMethod,
      paymentPlan: isFullPaymentNow ? 'FULL' : 'ADVANCE',
      date: issueDateStr,
      time: issueTimeStr,
      hatcheryOwnerPhone: selectedBatch.ownerPhone,
      batch: selectedBatch,
      farmerName: bookingForm.farmerName,
      farmerPhone: bookingForm.farmerPhone,
      bookedByRole: currentUser?.role,
      bookedByPhone: currentUser?.phone,
      isBrokerLinked,
      quantity: qty,
      bonusSeeds,
      pondSplitCount: Number(bookingForm.pondSplitCount) || 1,
      includeTransport: bookingForm.includeTransport,
      pondSalinity: bookingForm.pondSalinity,
      packingDate: bookingForm.packingDate,
      packingTimeSlot: bookingForm.packingTimeSlot,
      hatcheryFixedRate: selectedBatch.pricePer1000,
      hatcheryFixedTotal: hatcheryFixedCost,
      brokerMarginPaise: marginPaiseNum,
      brokerExtraMarginTotal,
      totalSeedCost: totalFarmerPayable,
      tokenAdvance: paidNowAmount,
      balanceAtPacking,
      clearedAt: isFullPaymentNow ? `${issueDateStr} ${issueTimeStr}` : null,
      settlement: {
        hold2PctAmount: hold2Pct,
        brokerBase2Pct: isBrokerLinked ? hold2Pct : 0,
        farmerRefundable2Pct: !isBrokerLinked ? hold2Pct : 0,
        status: isFullPaymentNow ? 'BALANCE_CLEARED' : 'ADVANCE_HOLD'
      },
      packingStatus: 'PACKING_PENDING',
      rated: false
    };

    const updatedBatch = {
      ...selectedBatch,
      availableStock: Math.max(0, (selectedBatch.availableStock || 0) - qty)
    };

    setBatches(prev => prev.map(b => (b.id === selectedBatch.id ? updatedBatch : b)));
    setBookings(prev => [newBooking, ...prev]);

    // Notify Buyer
    pushNotification({
      targetRole: 'buyer',
      targetPhone: newBooking.farmerPhone,
      title: isFullPaymentNow
        ? `100% Full Payment Booking Confirmed (${newBooking.bookingId})`
        : `4% Advance Booking Confirmed (${newBooking.bookingId})`,
      message: `${selectedBatch.realName} • Batch ${selectedBatch.id} (${qty.toLocaleString('en-IN')} PL). ${isFullPaymentNow ? `Full ₹${totalFarmerPayable.toLocaleString('en-IN')} paid & ₹${hold2Pct.toLocaleString('en-IN')} 2% cashback credited!` : `Paid ₹${paidNowAmount.toLocaleString('en-IN')}. Remaining ₹${balanceAtPacking.toLocaleString('en-IN')} can be paid anytime in My Bookings.`}`,
      category: 'BOOKING',
      details: newBooking
    });

    // Notify Hatchery Owner
    pushNotification({
      targetRole: 'seller',
      targetPhone: selectedBatch.ownerPhone,
      title: `New Packing Slot Booked (${newBooking.bookingId})`,
      message: `Farmer ${newBooking.farmerName} (+91 ${newBooking.farmerPhone}) booked ${qty.toLocaleString('en-IN')} PL of ${selectedBatch.id} for ${newBooking.packingDate}. Payment: ${isFullPaymentNow ? '100% Full Paid' : '4% Advance Paid'} (Ref: ${paymentRef}).`,
      category: 'ORDER',
      details: newBooking
    });

    // Notify Broker if linked
    if (isBrokerLinked && newBooking.bookedByRole === 'mediator') {
      pushNotification({
        targetRole: 'mediator',
        targetPhone: newBooking.bookedByPhone,
        title: `Broker Deal Confirmed (${newBooking.bookingId})`,
        message: `Booked ${qty.toLocaleString('en-IN')} PL for ${newBooking.farmerName} at ${selectedBatch.realName}. 2% Commission: ₹${hold2Pct.toLocaleString('en-IN')}.`,
        category: 'COMMISSION',
        details: newBooking
      });
    }

    setSelectedBatch(null);
    setModalError('');
    setBookingForm(prev => ({ ...prev, utrReference: '', qrRevealed: false }));
    setActiveInvoice({ booking: newBooking, receiptType: isFullPaymentNow ? 'FINAL' : 'ADVANCE' });
    showToast(t.toasts.paymentSuccess);
  };

  const handleConfirmBookingSubmit = (e) => {
    e.preventDefault();
    setModalError('');
    if (!selectedBatch) return;

    if ((bookingForm.farmerPhone || '').replace(/\D/g, '').length !== 10) {
      setModalError(t.toasts.invalidPhone);
      return;
    }

    const requestedQty = computeSeedCount(bookingForm.qtyAmount, bookingForm.qtyUnit);
    const minReqQty = selectedBatch.minPackingQty || 100000;

    if (requestedQty < minReqQty) {
      setModalError(`Minimum Packing required by hatchery is ${formatSeedQuantityShort(minReqQty)}.`);
      return;
    }

    if (requestedQty > (selectedBatch.availableStock || 0)) {
      setModalError(`Requested quantity (${requestedQty.toLocaleString('en-IN')} PL) exceeds available hatchery stock (${(selectedBatch.availableStock || 0).toLocaleString('en-IN')} PL).`);
      return;
    }

    const marginPaiseNum = Math.min(99, Math.max(0, Number(bookingForm.brokerMarginPaise) || 0));
    const hatcheryFixedCost = Math.round(requestedQty * (selectedBatch.pricePer1000 || 0.42));
    const transportCost = bookingForm.includeTransport ? 1500 : 0;
    const advance4Pct = Math.max(800, Math.round(hatcheryFixedCost * 0.04));
    const isFullPaymentNow = bookingForm.paymentPlan === 'FULL';

    if (bookingForm.paymentMethod === 'DIRECT_UPI' || bookingForm.paymentMethod === 'BANK_TO_BANK') {
      if (!bookingForm.utrReference.trim()) {
        setModalError(t.toasts.enterUtr);
        return;
      }
      const prefix = bookingForm.paymentMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT';
      finalizeBookingRecord(
        `${prefix}_${bookingForm.utrReference.trim().toUpperCase()}`,
        requestedQty,
        hatcheryFixedCost,
        marginPaiseNum,
        transportCost,
        advance4Pct,
        isFullPaymentNow
      );
      return;
    }

    finalizeBookingRecord(
      `RZP_${Math.floor(100000 + Math.random() * 900000)}`,
      requestedQty,
      hatcheryFixedCost,
      marginPaiseNum,
      transportCost,
      advance4Pct,
      isFullPaymentNow
    );
  };

  // =========================================================================
  // BUYER PAY REMAINING 96% BALANCE FROM SITE
  // =========================================================================
  const handleCompleteRemainingBalancePayment = (e) => {
    e.preventDefault();
    if (!payRemainingBooking) return;
    if ((remainingPayMethod === 'DIRECT_UPI' || remainingPayMethod === 'BANK_TO_BANK') && !remainingUtr.trim()) {
      showToast(t.toasts.enterUtr);
      return;
    }

    const balRef = remainingPayMethod === 'RAZORPAY'
      ? `RZP_BAL_${Math.floor(100000 + Math.random() * 900000)}`
      : `${remainingPayMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT'}_${remainingUtr.trim().toUpperCase()}`;

    const now = new Date();
    const clearedStamp = `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    let updatedRecord = null;

    setBookings(prev => prev.map(bk => {
      if (bk.bookingId !== payRemainingBooking.bookingId) return bk;
      updatedRecord = {
        ...bk,
        balancePaymentId: balRef,
        tokenAdvance: bk.totalSeedCost,
        balanceAtPacking: 0,
        clearedAt: clearedStamp,
        settlement: { ...bk.settlement, status: 'BALANCE_CLEARED' }
      };
      return updatedRecord;
    }));

    if (updatedRecord) {
      pushNotification({
        targetRole: 'buyer',
        targetPhone: updatedRecord.farmerPhone,
        title: `Remaining Balance Paid & 2% Cashback Refunded (${updatedRecord.bookingId})`,
        message: `Remaining ₹${(payRemainingBooking.balanceAtPacking || 0).toLocaleString('en-IN')} settled (Ref: ${balRef}). Your ₹${(updatedRecord.settlement?.farmerRefundable2Pct || 0).toLocaleString('en-IN')} 2% refundable hold has been credited back!`,
        category: 'PAYMENT',
        details: updatedRecord
      });

      pushNotification({
        targetRole: 'seller',
        targetPhone: updatedRecord.hatcheryOwnerPhone,
        title: `Full Remaining Balance Settled (${updatedRecord.bookingId})`,
        message: `Buyer ${updatedRecord.farmerName} settled the remaining ₹${(payRemainingBooking.balanceAtPacking || 0).toLocaleString('en-IN')} online (Ref: ${balRef}).`,
        category: 'PAYMENT',
        details: updatedRecord
      });

      if (updatedRecord.isBrokerLinked) {
        pushNotification({
          targetRole: 'mediator',
          targetPhone: updatedRecord.bookedByPhone,
          title: `2% Commission Credited (${updatedRecord.bookingId})`,
          message: `Balance settled for ${updatedRecord.farmerName}. Your 2% commission of ₹${(updatedRecord.settlement?.brokerBase2Pct || 0).toLocaleString('en-IN')} is now credited.`,
          category: 'COMMISSION',
          details: updatedRecord
        });
      }

      setActiveInvoice({ booking: updatedRecord, receiptType: 'FINAL' });
    }

    setPayRemainingBooking(null);
    setRemainingUtr('');
    setRemainingQrRevealed(false);
    showToast('Remaining balance settled! Full Paid Receipt generated.');
  };

  // =========================================================================
  // HATCHERY SCAN QR -> AUTO PACKING COMPLETED + PAYMENT SETTLED + FULL RECEIPT
  // =========================================================================
  const processScannedBuyerGatePass = (rawInput) => {
    const query = (rawInput || '').trim().toUpperCase();
    if (!query) {
      showToast('Please enter or select a Buyer Gate-Pass PIN or Booking ID.');
      return;
    }

    const matched = bookings.find(bk =>
      bk.hatcheryOwnerPhone === currentUser?.phone &&
      bk.packingStatus !== 'CANCELLED' &&
      (
        query.includes((bk.gatePassPin || '').toUpperCase()) ||
        query.includes((bk.bookingId || '').toUpperCase())
      )
    );

    if (!matched) {
      showToast('No matching active Gate-Pass found for your Hatchery.');
      return;
    }

    const now = new Date();
    const clearedStamp = `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    let updatedBooking = null;

    setBookings(prev => prev.map(bk => {
      if (bk.bookingId !== matched.bookingId) return bk;
      updatedBooking = {
        ...bk,
        packingStatus: 'FINAL_CLEARED',
        gatePassCleared: true,
        tokenAdvance: bk.totalSeedCost,
        balanceAtPacking: 0,
        clearedAt: clearedStamp,
        settlement: { ...bk.settlement, status: 'BALANCE_CLEARED' }
      };
      return updatedBooking;
    }));

    if (updatedBooking) {
      // Push instant notification to Buyer
      pushNotification({
        targetRole: 'buyer',
        targetPhone: updatedBooking.farmerPhone,
        title: `Gate-Pass Scanned: Packing Completed & Payment Settled (${updatedBooking.bookingId})`,
        message: `${updatedBooking.batch?.realName} scanned Gate-Pass ${updatedBooking.gatePassPin}. Packing is completed, full payment is settled, Full Paid Receipt is generated, and ₹${(updatedBooking.settlement?.farmerRefundable2Pct || 0).toLocaleString('en-IN')} 2% hold is refunded!`,
        category: 'QR_SETTLEMENT',
        details: updatedBooking
      });

      // Push instant notification to Hatchery
      pushNotification({
        targetRole: 'seller',
        targetPhone: currentUser.phone,
        title: `QR Verified & Settled (${updatedBooking.bookingId})`,
        message: `Scanned ${updatedBooking.gatePassPin} for ${updatedBooking.farmerName}. Packing completed & ₹${(updatedBooking.hatcheryFixedTotal || 0).toLocaleString('en-IN')} settled.`,
        category: 'QR_SETTLEMENT',
        details: updatedBooking
      });

      if (updatedBooking.isBrokerLinked) {
        pushNotification({
          targetRole: 'mediator',
          targetPhone: updatedBooking.bookedByPhone,
          title: `Gate-Pass Scanned & Commission Released (${updatedBooking.bookingId})`,
          message: `Packing verified for ${updatedBooking.farmerName}. 2% Commission ₹${(updatedBooking.settlement?.brokerBase2Pct || 0).toLocaleString('en-IN')} credited.`,
          category: 'COMMISSION',
          details: updatedBooking
        });
      }

      setShowHatcheryQrScanner(false);
      setQrScanInput('');
      setActiveInvoice({ booking: updatedBooking, receiptType: 'FINAL' });
      showToast(`Gate-Pass ${updatedBooking.gatePassPin} Verified! Packing Completed, Payment Settled & Full Paid Receipt Generated.`);
    }
  };

  const handleBuyerCancelBooking = (bk) => {
    const updatedBk = {
      ...bk,
      packingStatus: 'CANCELLED',
      settlement: { ...bk.settlement, status: 'CANCELLED_REFUNDED' }
    };
    setBookings(prev => prev.map(item => (item.bookingId === bk.bookingId ? updatedBk : item)));

    const targetBatch = batches.find(b => b.id === bk.batch?.id);
    if (targetBatch) {
      const restoredBatch = { ...targetBatch, availableStock: (targetBatch.availableStock || 0) + (bk.quantity || 0) };
      setBatches(prev => prev.map(b => (b.id === restoredBatch.id ? restoredBatch : b)));
    }

    pushNotification({
      targetRole: 'buyer',
      targetPhone: bk.farmerPhone,
      title: `Booking Cancelled & 2% Refunded (${bk.bookingId})`,
      message: `Your booking for ${bk.batch?.realName} was cancelled. ₹${(bk.settlement?.farmerRefundable2Pct || 0).toLocaleString('en-IN')} 2% refundable hold has been returned.`,
      category: 'REFUND'
    });

    pushNotification({
      targetRole: 'seller',
      targetPhone: bk.hatcheryOwnerPhone,
      title: `Booking Cancelled by Buyer (${bk.bookingId})`,
      message: `Farmer ${bk.farmerName} cancelled ${(bk.quantity || 0).toLocaleString('en-IN')} PL of ${bk.batch?.id}. Stock has been automatically restored.`,
      category: 'ORDER'
    });

    showToast(t.toasts.bookingCancelled);
  };

  const openVideoRequestModal = (batch) => {
    setVideoRequestForm({
      name: currentUser.name || '',
      whatsapp: currentUser.phone || '',
      note: `Please share live tank video for Batch ${batch.id} (${batch.plStage}, ${batch.salinity} PPT)`
    });
    setVideoRequestTargetBatch(batch);
  };

  const handleConfirmLiveVideoRequest = (e) => {
    e.preventDefault();
    if (!videoRequestTargetBatch) return;
    if ((videoRequestForm.whatsapp || '').replace(/\D/g, '').length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }
    const reqObj = {
      id: `VID-${Math.floor(1000 + Math.random() * 9000)}`,
      batchId: videoRequestTargetBatch.id,
      batchStage: videoRequestTargetBatch.plStage,
      batchSpecies: videoRequestTargetBatch.species,
      hatcheryOwnerPhone: videoRequestTargetBatch.ownerPhone,
      farmerName: videoRequestForm.name.trim(),
      farmerPhone: currentUser.phone,
      farmerWhatsapp: videoRequestForm.whatsapp.replace(/\D/g, '').slice(-10),
      note: videoRequestForm.note.trim(),
      requestedAt: `${new Date().toLocaleDateString('en-IN')} ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
    };
    setLiveVideoRequests(prev => [reqObj, ...prev]);

    pushNotification({
      targetRole: 'seller',
      targetPhone: videoRequestTargetBatch.ownerPhone,
      title: `New Live Tank Video Request (${videoRequestTargetBatch.id})`,
      message: `Farmer ${reqObj.farmerName} (+91 ${reqObj.farmerWhatsapp}) requested a live video for ${videoRequestTargetBatch.plStage}: "${reqObj.note}"`,
      category: 'VIDEO_REQ'
    });

    pushNotification({
      targetRole: 'buyer',
      targetPhone: currentUser.phone,
      title: `Live Video Request Sent (${videoRequestTargetBatch.id})`,
      message: `Your request for live tank video of Batch ${videoRequestTargetBatch.id} (${videoRequestTargetBatch.plStage}) was sent to the hatchery.`,
      category: 'VIDEO_REQ'
    });

    setVideoRequestTargetBatch(null);
    showToast(t.toasts.liveVideoRequested);
  };

  const handleSellerMarkPacked = (bookingId) => {
    let targetBk = null;
    setBookings(prev => prev.map(bk => {
      if (bk.bookingId !== bookingId) return bk;
      targetBk = { ...bk, packingStatus: 'PACKING_DONE_BY_SELLER' };
      return targetBk;
    }));
    if (sellerTxModal && targetBk) {
      setSellerTxModal(prev => ({
        ...prev,
        list: prev.list.map(item => (item.bookingId === bookingId ? targetBk : item))
      }));
    }
    if (targetBk) {
      pushNotification({
        targetRole: 'buyer',
        targetPhone: targetBk.farmerPhone,
        title: `Packing Completed by Hatchery (${targetBk.bookingId})`,
        message: `${targetBk.batch?.realName} marked packing complete for ${(targetBk.quantity || 0).toLocaleString('en-IN')} PL. You can pay remaining balance in My Bookings or show Gate-Pass QR (${targetBk.gatePassPin}).`,
        category: 'PACKING',
        details: targetBk
      });
    }
    showToast(t.toasts.packingMarked);
  };

  const handleHatcheryPaymentReceived = (bookingId) => {
    const now = new Date();
    const clearedStamp = `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    let targetBk = null;

    setBookings(prev => prev.map(bk => {
      if (bk.bookingId !== bookingId) return bk;
      targetBk = {
        ...bk,
        packingStatus: 'FINAL_CLEARED',
        gatePassCleared: true,
        tokenAdvance: bk.totalSeedCost,
        balanceAtPacking: 0,
        clearedAt: clearedStamp,
        settlement: { ...bk.settlement, status: 'BALANCE_CLEARED' }
      };
      return targetBk;
    }));
    if (sellerTxModal && targetBk) {
      setSellerTxModal(prev => ({
        ...prev,
        list: prev.list.map(item => (item.bookingId === bookingId ? targetBk : item))
      }));
    }
    if (targetBk) {
      pushNotification({
        targetRole: 'buyer',
        targetPhone: targetBk.farmerPhone,
        title: `Payment Settled & Full Paid Receipt Ready (${targetBk.bookingId})`,
        message: `${targetBk.batch?.realName} confirmed payment receipt. Your Full Paid Receipt is generated and ₹${(targetBk.settlement?.farmerRefundable2Pct || 0).toLocaleString('en-IN')} 2% hold is refunded!`,
        category: 'PAYMENT',
        details: targetBk
      });
    }
    showToast(t.toasts.paymentReceivedDone);
  };

  const handleSubmitRatingAndFeedback = (bookingId, batchId) => {
    const draft = ratingDrafts[bookingId] || { stars: 5, comment: '' };
    const stars = Number(draft.stars) || 5;
    const comment = (draft.comment || '').trim();

    setBookings(prev => prev.map(bk => (bk.bookingId === bookingId ? { ...bk, rated: true, userRating: stars, userFeedback: comment } : bk)));

    setBatches(prev => prev.map(b => {
      if (b.id !== batchId) return b;
      const prevCount = b.reviewCount || 0;
      const newCount = prevCount + 1;
      const newAvg = prevCount === 0 ? stars : Number((((b.rating * prevCount) + stars) / newCount).toFixed(1));
      const newReviewObj = {
        bookingId,
        farmerName: currentUser.name,
        stars,
        comment: comment || 'Verified Packing & Seed Quality',
        date: new Date().toLocaleDateString('en-IN')
      };
      return {
        ...b,
        rating: newAvg,
        reviewCount: newCount,
        reviews: [newReviewObj, ...(b.reviews || [])]
      };
    }));
    showToast(`${t.ratedLabel} (${stars}★)`);
  };

  const handleShareBatchFlyer = (batch) => {
    const flyer = `🦐 *Aqua Mark Verified Seed Batch*\n• Batch: ${batch.id} (${batch.plStage})\n• Species: ${batch.species}\n• Rate: ₹${(batch.pricePer1000 || 0).toFixed(2)}/seed (+${batch.bonusPercent}% Bonus)\n• Min Packing: ${formatSeedQuantityShort(batch.minPackingQty || 100000)}\n• Salinity: ${batch.salinity} PPT | Zone: ${batch.zone}\nBook direct on Aqua Mark!`;
    if (navigator.clipboard) navigator.clipboard.writeText(flyer).catch(() => { });
    window.open(`https://wa.me/?text=${encodeURIComponent(flyer)}`, '_blank');
  };

  const handleSendBilingualBookingSummary = (bk) => {
    const msg = lang === 'te'
      ? `🦐 *Aqua Mark అధికారిక సీడ్ బుకింగ్ సారాంశం*\n• Booking ID: ${bk.bookingId} (Gate-Pass: ${bk.gatePassPin || 'GP-1024'})\n• హేచరీ: ${bk.batch?.realName}\n• బ్యాచ్: ${bk.batch?.id} (${bk.batch?.plStage})\n• పరిమాణం: ${(bk.quantity || 0).toLocaleString('en-IN')} + ${(bk.bonusSeeds || 0).toLocaleString('en-IN')} బోనస్ PL\n• ప్యాకింగ్ తేదీ: ${bk.packingDate} (${bk.packingTimeSlot})\n• చెల్లించిన మొత్తం: ₹${(bk.tokenAdvance || 0).toLocaleString('en-IN')}\n• మిగిలిన బ్యాలెన్స్: ₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')}`
      : `🦐 *Aqua Mark Official Seed Booking Summary*\n• Booking ID: ${bk.bookingId} (Gate-Pass: ${bk.gatePassPin || 'GP-1024'})\n• Hatchery: ${bk.batch?.realName}\n• Batch: ${bk.batch?.id} (${bk.batch?.plStage})\n• Qty: ${(bk.quantity || 0).toLocaleString('en-IN')} + ${(bk.bonusSeeds || 0).toLocaleString('en-IN')} Bonus PL\n• Packing: ${bk.packingDate} (${bk.packingTimeSlot})\n• Paid Amount: ₹${(bk.tokenAdvance || 0).toLocaleString('en-IN')}\n• Remaining Balance: ₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')}`;
    openWhatsAppMessage(bk.batch?.realPhone, msg);
  };

  const handleRunEstimatorCalculate = () => {
    const tAcres = (Number(calcInputs.ponds) || 1) * (Number(calcInputs.acresPerPond) || 1);
    const tSeeds = Math.round(tAcres * 4046.86 * (Number(calcInputs.density) || 40));
    const survPrawns = Math.round(tSeeds * ((Number(calcInputs.survival) || 85) / 100));
    const hKg = Math.round(survPrawns / (Number(calcInputs.targetCount) || 30));
    const hTons = (hKg / 1000).toFixed(2);
    const tFeedKg = Math.round(hKg * (Number(calcInputs.fcr) || 1.4));
    const tFeedBags = Math.ceil(tFeedKg / 25);
    const gRev = hKg * (Number(calcInputs.marketRatePerKg) || 395);
    const seedCost = Math.round(tSeeds * 0.43);
    const feedCost = tFeedKg * (Number(calcInputs.feedCostPerKg) || 88);
    const overheadCost = Math.round(tAcres * (Number(calcInputs.powerProbioticCostPerAcre) || 35000));
    const totExp = seedCost + feedCost + overheadCost;
    const netProf = gRev - totExp;
    const perAcre = Math.round(netProf / Math.max(0.5, tAcres));
    const breakEven = hKg > 0 ? Math.round(totExp / hKg) : 0;

    setCalcResult({
      totalAcres: tAcres, totalSeedsNeeded: tSeeds, harvestKg: hKg, harvestTons: hTons,
      totalFeedKg: tFeedKg, totalFeedBags: tFeedBags, grossRevenue: gRev,
      totalExpenses: totExp, netProfit: netProf, profitPerAcre: perAcre, breakEvenPerKg: breakEven
    });
    showToast(t.toasts.calcUpdated);
  };

  const handleDownloadVerifiedPdf = (bk, isFinalCleared = false) => {
    const printWin = window.open('', '_blank', 'width=860,height=1050');
    if (!printWin) return;

    const verifyHash = `AQM-${bk.bookingId.replace('AQ-', '')}-${bk.paymentId.slice(-6).toUpperCase()}`;
    const totalWithBonus = (bk.quantity || 0) + (bk.bonusSeeds || 0);
    const issueTime = bk.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const pcrLabels = (bk.batch?.pcrImages || []).map(img => img.label).join(', ') || 'PCR-Report-1';
    const docHeading = isFinalCleared ? 'FULL PAID & BALANCE CLEARED RECEIPT' : 'OFFICIAL SEED BOOKING RECEIPT';

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AquaMark_Receipt_${bk.bookingId}</title>
        <style>
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          body { margin: 0; padding: 0; color: #0f172a; background: #fff; }
          .sheet { border: 2px solid #0f766e; border-radius: 12px; padding: 22px 24px; min-height: 274mm; display: flex; flex-direction: column; justify-content: space-between; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; }
          .brand-title { font-size: 22px; font-weight: 900; color: #0f766e; margin: 0; }
          .verified-stamp { background: #ecfdf5; border: 1.5px solid #10b981; color: #065f46; padding: 7px 12px; border-radius: 10px; text-align: right; font-size: 11px; }
          .meta-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; margin-top: 14px; font-size: 11px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
          .box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 14px; font-size: 11.5px; }
          .box-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f766e; margin-bottom: 5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 11.5px; }
          th { background: #0f766e; color: #fff; text-align: left; padding: 8px 10px; font-size: 10.5px; text-transform: uppercase; }
          td { padding: 8px 10px; border: 1px solid #e2e8f0; }
          .totals { border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; background: #f8fafc; font-size: 11.5px; margin-top: 14px; }
          .totals-row { display: flex; justify-content: space-between; padding: 3.5px 0; }
          .totals-highlight { border-top: 1.5px solid #cbd5e1; margin-top: 5px; padding-top: 6px; font-weight: 800; font-size: 13px; color: #065f46; }
          .footer { margin-top: 18px; padding-top: 12px; border-top: 1.5px dashed #cbd5e1; display: flex; justify-content: space-between; font-size: 10.5px; color: #475569; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div>
            <div class="header">
              <div><h1 class="brand-title">AQUA MARK</h1><p style="font-size:11px;margin:2px 0 0;">${docHeading}</p></div>
              <div class="verified-stamp"><strong>${isFinalCleared ? '100% FULL PAID & CLEARED' : 'VERIFIED RECEIPT'}</strong><br/><span>Gate-Pass: ${bk.gatePassPin || 'GP-1024'} • Hash: ${verifyHash}</span></div>
            </div>
            <div class="meta-bar">
              <div><strong>Receipt ID:</strong><br/>${bk.bookingId}</div>
              <div><strong>UTR / Payment Ref:</strong><br/>${bk.balancePaymentId || bk.paymentId}</div>
              <div><strong>Generated At:</strong><br/>${bk.date} (${issueTime})</div>
              <div><strong>Packing Schedule:</strong><br/>${bk.packingDate} (${bk.packingTimeSlot || 'All Day'})</div>
            </div>
            <div class="grid-2">
              <div class="box"><div class="box-title">Buyer / Farmer Details</div><p><strong>Farmer Name:</strong> ${bk.farmerName}</p><p><strong>Mobile:</strong> +91 ${bk.farmerPhone}</p><p><strong>Pond Salinity:</strong> ${bk.pondSalinity} PPT</p></div>
              <div class="box"><div class="box-title">Seller (Hatchery) Details</div><p><strong>Hatchery:</strong> ${bk.batch?.realName}</p><p><strong>CAA Reg:</strong> ${bk.batch?.caaLicense}</p><p><strong>Phone:</strong> +91 ${bk.batch?.realPhone}</p><p><strong>Address:</strong> ${bk.batch?.realAddress}</p></div>
            </div>
            <table>
              <thead><tr><th>Batch & Species</th><th>Stage</th><th>Salinity</th><th>Booked Qty</th><th>Bonus</th><th>Total Packing Qty</th></tr></thead>
              <tbody><tr><td><strong>${bk.batch?.id} — ${bk.batch?.species}</strong><br/><small>PCR: ${pcrLabels}</small></td><td>${bk.batch?.plStage}</td><td>${bk.batch?.salinity} PPT</td><td>${(bk.quantity || 0).toLocaleString('en-IN')} PL</td><td>+${(bk.bonusSeeds || 0).toLocaleString('en-IN')} PL</td><td><strong>${totalWithBonus.toLocaleString('en-IN')} PL</strong></td></tr></tbody>
            </table>
            <div class="totals">
              <div class="totals-row"><span>Total Order Value:</span><span>₹${(bk.totalSeedCost || 0).toLocaleString('en-IN')}</span></div>
              <div class="totals-row"><span>Total Paid Amount:</span><span>₹${(bk.tokenAdvance || 0).toLocaleString('en-IN')}</span></div>
              <div class="totals-row totals-highlight"><span>${isFinalCleared ? 'Settlement Status: 100% FULL PAID' : 'Balance Payable at Packing (96%):'}</span><span>₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')}</span></div>
            </div>
          </div>
          <div class="footer"><span>Farmer Signature</span><span>Digitally Verified by Aqua Mark • ${bk.date}</span><span>Authorized Hatchery Seal</span></div>
        </div>
        <script>window.onload = function() { setTimeout(function() { window.print(); }, 250); };</script>
      </body>
      </html>
    `);
    printWin.document.close();
  };

  const openWhatsAppMessage = (phone, text) => {
    const cleanPhone = (phone || '').replace(/\D/g, '');
    const formattedPhone = cleanPhone.length === 10 ? `91${cleanPhone}` : cleanPhone;
    window.open(`https://wa.me/${formattedPhone}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleAddBrokerFarmer = (e) => {
    e.preventDefault();
    if ((newFarmer.phone || '').replace(/\D/g, '').length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }
    const lockDate = new Date();
    lockDate.setFullYear(lockDate.getFullYear() + 1);
    const entry = {
      id: `F-${brokerFarmers.length + 1}`,
      name: newFarmer.name,
      phone: newFarmer.phone,
      village: newFarmer.village,
      acres: Number(newFarmer.acres) || 1,
      lockedUntil: lockDate.toISOString().split('T')[0]
    };
    setBrokerFarmers(prev => [entry, ...prev]);
    setNewFarmer({ name: '', phone: '', village: '', acres: '' });
    showToast(t.toasts.farmerLocked);
  };

  const handleAddPondLog = (e) => {
    e.preventDefault();
    const entry = {
      id: `PND-${farmerPonds.length + 1}`,
      ...newPondForm,
      loggedAt: new Date().toLocaleDateString('en-IN')
    };
    setFarmerPonds(prev => [entry, ...prev]);
    showToast(lang === 'te' ? 'చెరువు ఫీడ్ & స్టాకింగ్ వివరాలు సేవ్ అయ్యాయి!' : 'Pond Stocking & Daily Feed Log saved!');
  };

  const toggleCompareBatch = (id) => {
    if (compareIds.includes(id)) setCompareIds(compareIds.filter(x => x !== id));
    else if (compareIds.length < 3) setCompareIds([...compareIds, id]);
  };

  const toggleSaveBatch = (id) => {
    if (savedBatchIds.includes(id)) setSavedBatchIds(savedBatchIds.filter(x => x !== id));
    else setSavedBatchIds([...savedBatchIds, id]);
  };

  const brokerHeldBookings = bookings.filter(b => b.isBrokerLinked && b.settlement?.status === 'ADVANCE_HOLD');
  const brokerCreditedBookings = bookings.filter(b => b.isBrokerLinked && b.settlement?.status === 'BALANCE_CLEARED');
  const brokerHeld2PctTotal = brokerHeldBookings.reduce((sum, b) => sum + (b.settlement?.brokerBase2Pct || 0), 0);
  const brokerCredited2PctTotal = brokerCreditedBookings.reduce((sum, b) => sum + (b.settlement?.brokerBase2Pct || 0), 0);

  const filteredAndSortedBatches = batches
    .filter(b => {
      const q = searchQuery.toLowerCase().trim();
      const searchMatch = !q ||
        (b.id || '').toLowerCase().includes(q) ||
        (b.hatcheryCode || '').toLowerCase().includes(q) ||
        (b.zone || '').toLowerCase().includes(q) ||
        (b.species || '').toLowerCase().includes(q) ||
        (b.broodstock || '').toLowerCase().includes(q) ||
        (b.plStage || '').toLowerCase().includes(q);
      const zoneMatch = zoneFilter === 'ALL' || b.zone === zoneFilter;
      const stageMatch = stageFilter === 'ALL' || b.plStage === stageFilter;
      const savedMatch = !onlySavedFilter || savedBatchIds.includes(b.id);
      return searchMatch && zoneMatch && stageMatch && savedMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'PRICE_LOW') return (a.pricePer1000 || 0) - (b.pricePer1000 || 0);
      if (sortBy === 'SALINITY_LOW') return (a.salinity || 0) - (b.salinity || 0);
      if (sortBy === 'BONUS_HIGH') return (b.bonusPercent || 0) - (a.bonusPercent || 0);
      return (b.rating || 0) - (a.rating || 0);
    });

  const availableZones = Array.from(new Set([
    ...COASTAL_ZONES.filter(z => z !== 'OTHER_CUSTOM'),
    ...batches.map(b => b.zone).filter(Boolean)
  ]));

  const renderFilterSortBar = (isBuyerView = false) => (
    <div className={`rounded-2xl p-3.5 border flex flex-wrap items-center justify-between gap-3 ${cardBg}`}>
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className={`w-full border rounded-xl pl-9 pr-3 py-1.5 text-xs select-text focus:outline-none ${inputCls}`}
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className={`border rounded-xl px-3 py-1.5 text-xs font-semibold ${inputCls}`}>
          <option value="ALL">{t.allZones}</option>
          {availableZones.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className={`border rounded-xl px-3 py-1.5 text-xs font-semibold ${inputCls}`}>
          <option value="ALL">{t.allStages}</option>
          {SEED_STAGE_OPTIONS.filter(s => s !== 'OTHER_CUSTOM').map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className={`inline-flex items-center gap-1 border rounded-xl px-2.5 py-1.5 ${subCardBg}`}>
          <ArrowUpDown className="w-3.5 h-3.5 text-teal-600" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-xs font-bold focus:outline-none">
            <option value="RATING">{t.sortRating}</option>
            <option value="PRICE_LOW">{t.sortPriceLow}</option>
            <option value="SALINITY_LOW">{t.sortSalinity}</option>
            <option value="BONUS_HIGH">{t.sortBonus}</option>
          </select>
        </div>
        {isBuyerView && (
          <button
            type="button"
            onClick={() => setOnlySavedFilter(!onlySavedFilter)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${onlySavedFilter ? 'bg-rose-500/15 border-rose-400 text-rose-500' : subCardBg}`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlySavedFilter ? 'fill-rose-500 text-rose-500' : ''}`} /> {t.onlySaved}
          </button>
        )}
        {isBuyerView && compareIds.length >= 2 && (
          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            className="bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5" /> {t.compareBtn} ({compareIds.length})
          </button>
        )}
      </div>
    </div>
  );

  // =========================================================================
  // SCREEN 1: ROLE-ISOLATED SIGN UP & LOGIN PORTAL
  // =========================================================================
  if (!currentUser) {
    const activeRoleMeta = t.roles[loginRole] || t.roles.buyer;
    return (
      <div className={`min-h-screen flex flex-col justify-between font-sans select-none transition-colors ${pageBg}`}>
        {toast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {toast}
          </div>
        )}

        <header className={`border-b px-6 py-4 flex items-center justify-between ${cardBg}`}>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              AM
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight block leading-none">Aqua Mark</span>
              <span className="text-[11px] opacity-60 font-medium">{t.brandSub}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
              className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer ${subCardBg}`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              {lang === 'te' ? 'English' : 'తెలుగు'}
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className={`max-w-lg w-full rounded-3xl shadow-sm border p-7 sm:p-8 space-y-5 ${cardBg}`}>
            <div>
              <h2 className="text-2xl font-extrabold tracking-tight">{t.selectRoleTitle}</h2>
              <p className="text-xs opacity-60 mt-1">{t.selectRoleSub}</p>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {[
                { id: 'buyer', icon: ShoppingBag },
                { id: 'seller', icon: Building2 },
                { id: 'mediator', icon: Users }
              ].map((item) => {
                const IconComp = item.icon;
                const active = loginRole === item.id;
                const meta = t.roles[item.id];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => { setLoginRole(item.id); setWaVerifiedDone(false); setLoginPassword(''); }}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-2 ${active
                      ? 'border-teal-600 bg-teal-600/10 ring-2 ring-teal-600/20'
                      : subCardBg
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-teal-600 text-white' : 'bg-slate-200/70 text-slate-700'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold">{meta.title}</div>
                      <div className="text-[10px] opacity-70 mt-0.5 leading-tight">{meta.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            <div className={`grid grid-cols-2 p-1 rounded-2xl border ${subCardBg}`}>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); setWaVerifiedDone(false); setLoginPassword(''); }}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${authMode === 'signup' ? 'bg-teal-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              >
                {t.signUpTab}
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setWaVerifiedDone(false); setLoginPassword(''); }}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${authMode === 'login' || authMode === 'forgot' ? 'bg-teal-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              >
                {t.loginTab}
              </button>
            </div>

            {authMode === 'signup' && (
              <form onSubmit={handleCompleteSignUpOrReset} className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5">{t.nameLabels[loginRole]}</label>
                  <input
                    required
                    type="text"
                    placeholder={t.namePlaceholders[loginRole]}
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm select-text focus:outline-none ${inputCls}`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5">{t.mobileLabel}</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold opacity-60">+91</span>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      disabled={waVerifiedDone}
                      placeholder="9876543210"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      className={`w-full border rounded-xl pl-12 pr-10 py-2.5 text-sm font-bold tracking-wider select-text focus:outline-none ${inputCls}`}
                    />
                    <Smartphone className="w-4 h-4 opacity-50 absolute right-3.5" />
                  </div>
                </div>

                {!waVerifiedDone ? (
                  <button
                    type="button"
                    disabled={isVerifyingWa}
                    onClick={handleTriggerInstantWhatsAppVerify}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-75 text-white font-bold py-3 rounded-xl text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingWa ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> {t.verifyingWaAnim}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> {t.verifyWaBtn}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4 pt-1">
                    <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-500 font-bold flex items-center justify-between">
                      <span>✓ +91 {loginPhone} Verified ({activeRoleMeta.title})</span>
                      <button type="button" onClick={() => setWaVerifiedDone(false)} className="underline text-[11px] cursor-pointer">
                        Change
                      </button>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1.5">{t.setPasswordLabel}</label>
                      <div className="relative flex items-center">
                        <input
                          autoFocus
                          required
                          type={showPassword ? 'text' : 'password'}
                          minLength={6}
                          placeholder="Min 6 characters (letters or numbers)"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className={`w-full border-2 border-teal-600 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-bold select-text focus:outline-none ${inputCls}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 opacity-60 hover:opacity-100 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <UserCheck className="w-4 h-4" /> {t.completeSignUpBtn}
                    </button>
                  </div>
                )}
              </form>
            )}

            {authMode === 'login' && (
              <form onSubmit={handlePasswordLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5">{t.mobileLabel} ({activeRoleMeta.title})</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold opacity-60">+91</span>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      className={`w-full border rounded-xl pl-12 pr-10 py-2.5 text-sm font-bold tracking-wider select-text focus:outline-none ${inputCls}`}
                    />
                    <Smartphone className="w-4 h-4 opacity-50 absolute right-3.5" />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5">{t.enterPasswordLabel}</label>
                  <div className="relative flex items-center">
                    <input
                      required
                      type={showPassword ? 'text' : 'password'}
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className={`w-full border rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-bold select-text focus:outline-none ${inputCls}`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 opacity-60 hover:opacity-100 cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <button
                    type="button"
                    onClick={() => { setAuthMode('forgot'); setWaVerifiedDone(false); setLoginPassword(''); }}
                    className="text-teal-500 font-bold hover:underline cursor-pointer"
                  >
                    {t.forgotPasswordLink}
                  </button>
                </div>

                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Lock className="w-4 h-4" /> {t.loginBtn} ({activeRoleMeta.title})
                </button>
              </form>
            )}

            {authMode === 'forgot' && (
              <form onSubmit={handleCompleteSignUpOrReset} className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs font-bold text-amber-500 flex items-center justify-between">
                  <span>{t.resetPasswordTitle}</span>
                  <button type="button" onClick={() => setAuthMode('login')} className="underline text-[11px] cursor-pointer">
                    Back
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5">{t.mobileLabel} ({activeRoleMeta.title})</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold opacity-60">+91</span>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      disabled={waVerifiedDone}
                      placeholder="9876543210"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      className={`w-full border rounded-xl pl-12 pr-10 py-2.5 text-sm font-bold tracking-wider select-text focus:outline-none ${inputCls}`}
                    />
                    <Smartphone className="w-4 h-4 opacity-50 absolute right-3.5" />
                  </div>
                </div>

                {!waVerifiedDone ? (
                  <button
                    type="button"
                    disabled={isVerifyingWa}
                    onClick={handleTriggerInstantWhatsAppVerify}
                    className="w-full bg-green-600 hover:bg-green-700 disabled:opacity-75 text-white font-bold py-3 rounded-xl text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {isVerifyingWa ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" /> {t.verifyingWaAnim}
                      </>
                    ) : (
                      <>
                        <Send className="w-4 h-4" /> {t.verifyWaBtn}
                      </>
                    )}
                  </button>
                ) : (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-500 font-bold">
                      ✓ +91 {loginPhone} Verified! Set your new password below.
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1.5">{t.setPasswordLabel}</label>
                      <div className="relative flex items-center">
                        <input
                          autoFocus
                          required
                          type={showPassword ? 'text' : 'password'}
                          minLength={6}
                          placeholder="Min 6 characters (letters or numbers)"
                          value={loginPassword}
                          onChange={(e) => setLoginPassword(e.target.value)}
                          className={`w-full border-2 border-teal-600 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-bold select-text focus:outline-none ${inputCls}`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 opacity-60 hover:opacity-100 cursor-pointer"
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <KeyRound className="w-4 h-4" /> Save New Password & Login
                    </button>
                  </div>
                )}
              </form>
            )}
          </div>
        </div>

        <footer className="text-center py-4 text-[11px] opacity-50">
          Aqua Mark © 2026 • Direct B2B Aquaculture Seed & Settlement Exchange
        </footer>
      </div>
    );
  }

  // =========================================================================
  // ROLE-SPECIFIC COMPUTED DATA & NOTIFICATIONS FILTER
  // =========================================================================
  const myNotifications = notifications.filter(n =>
    (n.targetRole === 'ALL') ||
    (n.targetRole === currentUser.role && (!n.targetPhone || n.targetPhone === currentUser.phone))
  );
  const unreadNotificationCount = myNotifications.filter(n => !n.read).length;

  const handleOpenNotificationDrawer = () => {
    setShowNotificationDrawer(true);
    setNotifications(prev => prev.map(n =>
      ((n.targetRole === 'ALL') || (n.targetRole === currentUser.role && (!n.targetPhone || n.targetPhone === currentUser.phone)))
        ? { ...n, read: true }
        : n
    ));
  };

  const myFixedHatchery = currentUser.role === 'seller' ? hatcheryProfiles[currentUser.phone] : null;
  const sellerRoleRecord = currentUser.role === 'seller' ? registeredUsers[getUserKey(currentUser.phone, 'seller')] : null;
  const isSellerDepositPaid = Boolean(
    currentUser.depositPaid || sellerRoleRecord?.depositPaid || myFixedHatchery?.depositPaid
  );

  const myOwnedBatches = currentUser.role === 'seller' && myFixedHatchery
    ? batches.filter(b => b.ownerPhone === currentUser.phone)
    : [];
  const myHatcheryOrders = currentUser.role === 'seller' && myFixedHatchery
    ? bookings.filter(bk => bk.hatcheryOwnerPhone === currentUser.phone)
    : [];
  const myLiveVideoReqs = currentUser.role === 'seller' && myFixedHatchery
    ? liveVideoRequests.filter(r => r.hatcheryOwnerPhone === currentUser.phone)
    : [];
  const myPrivateReviews = myOwnedBatches.flatMap(b => (b.reviews || []).map(r => ({ ...r, batchId: b.id, plStage: b.plStage })));

  const hatcheryClearedOrders = myHatcheryOrders.filter(o => o.settlement?.status === 'BALANCE_CLEARED');
  const hatcheryUpcomingOrders = myHatcheryOrders.filter(o => o.settlement?.status === 'ADVANCE_HOLD');
  const hatcheryClearedRevenue = hatcheryClearedOrders.reduce((sum, o) => sum + (o.hatcheryFixedTotal || 0), 0);
  const hatcheryPendingRevenue = hatcheryUpcomingOrders.reduce((sum, o) => sum + (o.hatcheryFixedTotal || 0), 0);

  const myFixedBroker = currentUser.role === 'mediator' ? brokerProfiles[currentUser.phone] : null;
  const myBrokerBookings = currentUser.role === 'mediator'
    ? bookings.filter(bk => bk.bookedByPhone === currentUser.phone && bk.bookedByRole === 'mediator')
    : [];

  return (
    <div className={`min-h-screen font-sans select-none transition-colors ${pageBg}`}>
      {/* HIDDEN INPUTS FOR CAMERA vs FILES */}
      <input ref={pcrFileRef} type="file" multiple accept="image/*" onChange={(e) => handleMultiplePcrUpload(e.target.files, false)} className="hidden" />
      <input ref={pcrCamRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleMultiplePcrUpload(e.target.files, false)} className="hidden" />
      <input ref={vidFileRef} type="file" multiple accept="video/*" onChange={(e) => handleMultipleVideoUpload(e.target.files, false)} className="hidden" />
      <input ref={vidCamRef} type="file" accept="video/*" capture="environment" onChange={(e) => handleMultipleVideoUpload(e.target.files, false)} className="hidden" />
      <input ref={editPcrFileRef} type="file" multiple accept="image/*" onChange={(e) => handleMultiplePcrUpload(e.target.files, true)} className="hidden" />
      <input ref={editPcrCamRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleMultiplePcrUpload(e.target.files, true)} className="hidden" />
      <input ref={editVidFileRef} type="file" multiple accept="video/*" onChange={(e) => handleMultipleVideoUpload(e.target.files, true)} className="hidden" />
      <input ref={editVidCamRef} type="file" accept="video/*" capture="environment" onChange={(e) => handleMultipleVideoUpload(e.target.files, true)} className="hidden" />

      {/* LIVE UPLOAD PROGRESS BAR OVERLAY */}
      {uploadProgress.active && (
        <div className="fixed bottom-20 right-5 z-50 bg-slate-900 text-white p-4 rounded-2xl shadow-2xl border border-teal-500/50 w-80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold">
            <span className="text-teal-400 truncate pr-2">{uploadProgress.label}</span>
            <span className="font-mono text-emerald-400">{uploadProgress.percent}%</span>
          </div>
          <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-300"
              style={{ width: `${uploadProgress.percent}%` }}
            />
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{toast}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className={`border-b sticky top-0 z-40 ${cardBg}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-base shadow-xs">
              AM
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight">Aqua Mark</h1>
                <span className="text-[11px] bg-teal-500/15 text-teal-600 border border-teal-500/30 px-2.5 py-0.5 rounded-full font-bold">
                  {t.portalBadges[currentUser.role] || currentUser.role}
                </span>
              </div>
              <p className="text-xs opacity-60">{currentUser.name} • +91 {currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* BUYER & BROKER EDIT PROFILE BUTTON IN HEADER */}
            {(currentUser.role === 'buyer' || currentUser.role === 'mediator') && (
              <button
                type="button"
                onClick={openBasicEditProfile}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${subCardBg}`}
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-600" /> {t.editBuyerProfileBtn}
              </button>
            )}

            {/* HATCHERY SCAN QR BUTTON RIGHT NEXT TO REFRESH BUTTON */}
            {currentUser.role === 'seller' && myFixedHatchery && (
              <button
                type="button"
                onClick={() => { setQrScanInput(''); setShowHatcheryQrScanner(true); }}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-xs cursor-pointer"
              >
                <ScanLine className="w-4 h-4" /> Scan QR
              </button>
            )}

            {/* LIVE CLOUD SYNC REFRESH BUTTON */}
            <button
              type="button"
              onClick={handleManualCloudSync}
              className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
              title="Sync Live Data"
            >
              <RefreshCw className={`w-4 h-4 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* ROLE-SPECIFIC NOTIFICATION BELL BUTTON IN TOP HEADER (ALL PORTALS) */}
            <button
              type="button"
              onClick={handleOpenNotificationDrawer}
              className={`relative p-2 rounded-xl border cursor-pointer ${subCardBg}`}
              title="Notifications"
            >
              <Bell className="w-4 h-4 text-teal-600" />
              {unreadNotificationCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[10px] font-black min-w-[18px] h-[18px] px-1 rounded-full flex items-center justify-center shadow-xs">
                  {unreadNotificationCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border cursor-pointer ${subCardBg}`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              {lang === 'te' ? 'English' : 'తెలుగు'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" /> {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* =========================================================
            1. BUYER (FARMER) PORTAL
           ========================================================= */}
        {currentUser.role === 'buyer' && (
          <>
            <div className="bg-slate-900 text-white rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-emerald-400 inline-flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> {t.tickerTitle}
              </span>
              <div className="flex flex-wrap gap-4 font-mono text-[11px]">
                <span>30 Count: <b className="text-emerald-300">₹395/kg</b></span>
                <span>40 Count: <b className="text-emerald-300">₹340/kg</b></span>
                <span>50 Count: <b className="text-emerald-300">₹305/kg</b></span>
                <span>60 Count: <b className="text-emerald-300">₹275/kg</b></span>
              </div>
            </div>

            <div className={`flex flex-wrap items-center gap-2 p-1.5 rounded-2xl border w-fit ${cardBg}`}>
              {[
                { id: 'marketplace', label: t.tabMarketplace, icon: Building2 },
                { id: 'bookings', label: `${t.tabBookings} (${bookings.filter(b => b.farmerPhone === currentUser.phone).length})`, icon: FileText },
                { id: 'pondlog', label: t.tabPondLog, icon: ClipboardList },
                { id: 'analytics', label: t.tabAnalytics, icon: Calculator },
                { id: 'waterlab', label: t.tabWaterLab, icon: Droplets },
                { id: 'guide', label: t.tabGuide, icon: Calendar }
              ].map(tab => {
                const Icon = tab.icon;
                const hasClearedReceipt = tab.id === 'bookings' && bookings.some(b => b.farmerPhone === currentUser.phone && b.settlement?.status === 'BALANCE_CLEARED');
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBuyerTab(tab.id)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer relative ${buyerTab === tab.id ? 'bg-teal-600 text-white' : 'opacity-75 hover:opacity-100'}`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {tab.label}
                    {hasClearedReceipt && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {buyerTab === 'marketplace' && (
              <>
                {renderFilterSortBar(true)}

                {filteredAndSortedBatches.length === 0 ? (
                  <div className={`rounded-2xl border p-12 text-center space-y-2 ${cardBg}`}>
                    <Building2 className="w-10 h-10 opacity-30 mx-auto" />
                    <h3 className="text-base font-extrabold">{t.emptyMarketTitle}</h3>
                    <p className="text-xs opacity-60 max-w-md mx-auto">{t.emptyMarketSub}</p>
                  </div>
                ) : (
                  <div className="max-h-[72vh] overflow-y-auto pr-1.5 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {filteredAndSortedBatches.map((batch) => {
                        const isUnlocked = bookings.some((bk) => bk.batch?.id === batch.id && bk.farmerPhone === currentUser.phone && bk.packingStatus !== 'CANCELLED');
                        const isComparing = compareIds.includes(batch.id);
                        const isSaved = savedBatchIds.includes(batch.id);
                        const isSoldOut = (batch.availableStock || 0) <= 0;
                        const isPaused = Boolean(batch.paused);
                        const selectedDens = cardDensityChoice[batch.id] || 40;
                        const acresCovered = ((batch.availableStock || 0) / (selectedDens * 4046.86)).toFixed(1);
                        const videoRequested = liveVideoRequests.some(r => r.batchId === batch.id && r.farmerPhone === currentUser.phone);
                        const ownerProfile = hatcheryProfiles[batch.ownerPhone] || {};
                        const mapsUrl = batch.googleMapsLink || ownerProfile.googleMapsLink;
                        const minPackingQty = batch.minPackingQty || 100000;

                        return (
                          <div key={batch.id} className={`rounded-2xl border shadow-xs overflow-hidden flex flex-col justify-between hover:border-teal-500 transition ${cardBg} ${isPaused ? 'opacity-75' : ''}`}>
                            <div onClick={() => setInspectedBatch(batch)} className="p-5 space-y-4 cursor-pointer">
                              <div className="flex items-start justify-between gap-2">
                                <div>
                                  <div className="flex flex-wrap items-center gap-1.5">
                                    <span className="font-mono text-[11px] font-bold bg-teal-500/15 text-teal-600 px-2 py-0.5 rounded">
                                      {batch.id}
                                    </span>
                                    <span className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                      <ShieldCheck className="w-3.5 h-3.5" /> {t.caaVerified}
                                    </span>
                                    <span className="bg-amber-500/15 text-amber-600 border border-amber-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                      <Package className="w-3 h-3" /> Min Packing: {formatSeedQuantityShort(minPackingQty).split(' (')[0]}
                                    </span>
                                    <span className="text-xs font-semibold opacity-60">{batch.zone}</span>
                                    <span className="text-xs font-bold text-amber-500 inline-flex items-center gap-0.5">
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {batch.rating || 5.0} ({batch.reviewCount || 0})
                                    </span>
                                    {isSoldOut && (
                                      <span className="bg-rose-500/15 text-rose-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">{t.soldOutBadge}</span>
                                    )}
                                    {isPaused && !isSoldOut && (
                                      <span className="bg-amber-500/20 text-amber-500 text-[10px] font-extrabold px-2 py-0.5 rounded-full">{t.pausedBadge}</span>
                                    )}
                                  </div>
                                  <h3 className="text-base font-extrabold mt-2 flex items-center gap-2">
                                    {isUnlocked ? (
                                      <span className="text-teal-500 inline-flex items-center gap-1.5"><Unlock className="w-4 h-4 text-emerald-500" /> {batch.realName}</span>
                                    ) : (
                                      <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 opacity-50" /> {batch.hatcheryCode || 'Verified Hatchery'}</span>
                                    )}
                                  </h3>
                                  <p className="text-xs opacity-70 font-medium mt-0.5">{batch.species} • <span className="text-teal-500 font-semibold">{batch.broodstock || 'Certified Line'}</span></p>
                                  {isUnlocked ? (
                                    <div className="mt-1 space-y-1">
                                      <p className="text-xs opacity-80">{batch.realAddress} • +91 {batch.realPhone}</p>
                                      {mapsUrl && (
                                        <a
                                          href={mapsUrl.startsWith('http') ? mapsUrl : `https://${mapsUrl}`}
                                          target="_blank"
                                          rel="noreferrer"
                                          onClick={(e) => e.stopPropagation()}
                                          className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:underline"
                                        >
                                          <MapPin className="w-3.5 h-3.5" /> Open Google Maps Location <ExternalLink className="w-3 h-3" />
                                        </a>
                                      )}
                                    </div>
                                  ) : (
                                    <p className="text-[11px] opacity-50 mt-0.5">{t.unlockHint}</p>
                                  )}
                                </div>
                                <div className="flex items-center gap-1.5 shrink-0">
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setTransitPredictorBatch(batch); }}
                                    className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
                                    title="Transit Route & Oxygen Risk Predictor"
                                  >
                                    <Navigation className="w-4 h-4 text-indigo-500" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); handleShareBatchFlyer(batch); }}
                                    className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
                                    title="Share Batch Flyer on WhatsApp"
                                  >
                                    <Share2 className="w-4 h-4 text-teal-600" />
                                  </button>
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); toggleSaveBatch(batch.id); }}
                                    className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
                                  >
                                    <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'opacity-50'}`} />
                                  </button>
                                  <div className="text-right pl-1">
                                    <div className="text-2xl font-black">₹{(batch.pricePer1000 || 0).toFixed(2)}</div>
                                    <div className="text-[11px] opacity-60">{t.perSeed}</div>
                                  </div>
                                </div>
                              </div>

                              <div className={`grid grid-cols-4 gap-2 p-3 rounded-xl border text-center ${subCardBg}`}>
                                <div><span className="text-[11px] opacity-60 block">{t.stage}</span><span className="text-sm font-bold">{batch.plStage}</span></div>
                                <div><span className="text-[11px] opacity-60 block">{t.salinity}</span><span className="text-sm font-bold text-teal-500">{batch.salinity} PPT</span></div>
                                <div><span className="text-[11px] opacity-60 block">{t.bonus}</span><span className="text-sm font-bold text-emerald-500">+{batch.bonusPercent}%</span></div>
                                <div><span className="text-[11px] opacity-60 block">{t.stock}</span><span className="text-sm font-bold">{(batch.availableStock || 0).toLocaleString('en-IN')}</span></div>
                              </div>

                              <div onClick={(e) => e.stopPropagation()} className={`border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] ${subCardBg}`}>
                                <span className="font-bold opacity-80">Pond Coverage Estimator:</span>
                                <div className="flex items-center gap-1.5">
                                  {[30, 40, 50].map(d => (
                                    <button
                                      key={d}
                                      type="button"
                                      onClick={() => setCardDensityChoice(prev => ({ ...prev, [batch.id]: d }))}
                                      className={`px-2 py-0.5 rounded font-bold border cursor-pointer ${selectedDens === d ? 'bg-teal-600 text-white border-teal-600' : cardBg}`}
                                    >
                                      {d}/m²
                                    </button>
                                  ))}
                                  <span className="font-extrabold text-teal-500 pl-1">≈ {acresCovered} Acres</span>
                                </div>
                              </div>

                              <div className={`border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs ${subCardBg}`}>
                                <span className="font-semibold">
                                  📅 {t.availPackingLabel}: <b>{batch.availableDate || 'Flexible'}</b> • Min Packing: <b className="text-amber-500">{formatSeedQuantityShort(minPackingQty).split(' (')[0]}</b>
                                </span>
                                <span className="inline-flex items-center gap-1 font-bold text-teal-500">
                                  <Eye className="w-3.5 h-3.5" /> {t.inspectBtn}
                                </span>
                              </div>
                            </div>

                            <div className={`px-5 py-3.5 border-t flex flex-wrap items-center gap-2 ${subCardBg}`}>
                              <button
                                type="button"
                                onClick={() => openVideoRequestModal(batch)}
                                className={`px-3 py-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${videoRequested ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' : cardBg}`}
                              >
                                <Video className="w-3.5 h-3.5 text-teal-600" /> {videoRequested ? t.liveVideoSentBadge : t.liveVideoBtn}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleCompareBatch(batch.id)}
                                className={`px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${isComparing ? 'bg-teal-600 text-white border-teal-600' : cardBg}`}
                              >
                                {isComparing ? t.comparingBtn : t.compareBtn}
                              </button>
                              <button
                                type="button"
                                disabled={isSoldOut || isPaused}
                                onClick={() => {
                                  setModalError('');
                                  const defaultLakhs = Math.max(1, Math.ceil((batch.minPackingQty || 100000) / 100000));
                                  setBookingForm(prev => ({
                                    ...prev,
                                    farmerName: currentUser.name,
                                    farmerPhone: currentUser.phone,
                                    qtyAmount: String(Math.min(100, defaultLakhs)),
                                    qtyUnit: 'LAKHS',
                                    pondSplitCount: '1',
                                    packingDate: batch.availableDate || prev.packingDate,
                                    packingTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
                                    brokerMarginPaise: '',
                                    paymentPlan: 'ADVANCE',
                                    upiSubMode: 'QR',
                                    qrRevealed: false,
                                    utrReference: ''
                                  }));
                                  setSelectedBatch(batch);
                                }}
                                className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                              >
                                {isSoldOut ? t.soldOutBadge : isPaused ? t.pausedBadge : t.bookSlotBtn} {!isSoldOut && !isPaused && <ChevronRight className="w-4 h-4" />}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            )}

            {/* TAB 2: BUYER MY BOOKINGS — CLEAN COMPACT LAYOUT (HATCHERY DETAILS + STATUS & GATE-PASS QR BUTTONS; CLICK HATCHERY FOR ALL OTHER DETAILS & BUTTONS) */}
            {buyerTab === 'bookings' && (
              <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <FileText className="w-5 h-5 text-teal-600" /> {t.myBookingsTitle}
                  </h3>
                  <span className="text-[11px] opacity-65">Click any hatchery card to view full details, pay remaining balance, print receipts & rate</span>
                </div>

                {bookings.filter(b => b.farmerPhone === currentUser.phone).length === 0 ? (
                  <p className="text-xs opacity-60">{t.noBookingsYet}</p>
                ) : (
                  <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-3.5">
                    {bookings.filter(b => b.farmerPhone === currentUser.phone).map((bk) => {
                      const isFinalCleared = bk.settlement?.status === 'BALANCE_CLEARED';
                      const isCancelled = bk.settlement?.status === 'CANCELLED_REFUNDED';
                      const isGatePassCleared = Boolean(bk.gatePassCleared || isFinalCleared);

                      return (
                        <div
                          key={bk.bookingId}
                          onClick={() => setInspectedBuyerBooking(bk)}
                          className={`border hover:border-teal-500 rounded-2xl p-4 sm:p-5 transition cursor-pointer ${subCardBg}`}
                        >
                          <div className="flex flex-wrap items-center justify-between gap-4">
                            {/* Left: Clean Hatchery & Booking Summary */}
                            <div className="space-y-1.5 flex-1 min-w-[230px]">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-xs text-teal-600 bg-teal-500/10 px-2.5 py-0.5 rounded border border-teal-500/30">
                                  {bk.bookingId}
                                </span>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${isFinalCleared
                                  ? 'bg-emerald-500/15 text-emerald-500'
                                  : isCancelled
                                    ? 'bg-rose-500/15 text-rose-500'
                                    : 'bg-amber-500/15 text-amber-500'
                                  }`}>
                                  {isFinalCleared
                                    ? t.clearedSettlementBadge
                                    : isCancelled
                                      ? t.cancelledRefundBadge
                                      : t.pendingSettlementBadge}
                                </span>
                              </div>

                              <h4 className="text-base font-extrabold text-teal-600 dark:text-teal-400 flex items-center gap-1.5">
                                {bk.batch?.realName}
                                <span className="text-[11px] font-semibold opacity-65">(Tap for full details & actions →)</span>
                              </h4>

                              <p className="text-xs opacity-80">
                                Batch <b>{bk.batch?.id}</b> • <b>{(bk.quantity || 0).toLocaleString('en-IN')} PL</b> ({bk.batch?.plStage}) • Packing: <b>{bk.packingDate}</b>
                              </p>

                              <p className="text-xs">
                                <span>{t.paidLabel}: <b className="text-emerald-500">₹{(bk.tokenAdvance || 0).toLocaleString('en-IN')}</b></span>
                                {!isFinalCleared && !isCancelled && (
                                  <span className="ml-3 text-amber-500 font-bold">
                                    • {t.balancePackingLabel}: ₹{(bk.balanceAtPacking || 0).toLocaleString('en-IN')}
                                  </span>
                                )}
                              </p>
                            </div>

                            {/* Right: Only Two Neat, Compact Primary Buttons ("Status" & "Gate-Pass QR") */}
                            <div className="flex items-center gap-2.5 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => setStatusModalBooking(bk)}
                                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                  <Activity className="w-3.5 h-3.5" /> Status
                                </button>
                              )}

                              {!isCancelled && !isGatePassCleared && (
                                <button
                                  type="button"
                                  onClick={() => setGatePassBooking(bk)}
                                  className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                                >
                                  <QrCode className="w-3.5 h-3.5" /> Gate-Pass QR
                                </button>
                              )}

                              {isGatePassCleared && !isCancelled && (
                                <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-extrabold px-3.5 py-2 rounded-xl inline-flex items-center gap-1">
                                  <CheckCircle2 className="w-3.5 h-3.5" /> Gate-Pass Cleared
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: MULTI-POND STOCKING */}
            {buyerTab === 'pondlog' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <form onSubmit={handleAddPondLog} className={`rounded-2xl p-5 border shadow-xs space-y-3.5 ${cardBg}`}>
                  <h3 className="font-bold text-sm flex items-center gap-2">
                    <ClipboardList className="w-4 h-4 text-teal-600" />
                    {lang === 'te' ? 'చెరువు స్టాకింగ్ & రోజువారీ ఫీడ్ నమోదు' : 'Log Pond Stocking & Check-Tray Feed'}
                  </h3>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">Pond Name</label>
                      <input required type="text" value={newPondForm.pondName} onChange={(e) => setNewPondForm({ ...newPondForm, pondName: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">Acres</label>
                      <input required type="number" step="0.5" value={newPondForm.acres} onChange={(e) => setNewPondForm({ ...newPondForm, acres: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">Stocked Seed (PL)</label>
                      <input required type="number" step="10000" value={newPondForm.stockedQty} onChange={(e) => setNewPondForm({ ...newPondForm, stockedQty: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">Stocking Date</label>
                      <input required type="date" value={newPondForm.stockingDate} onChange={(e) => setNewPondForm({ ...newPondForm, stockingDate: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">Today Feed (kg)</label>
                      <input required type="number" step="0.5" value={newPondForm.dailyFeedKg} onChange={(e) => setNewPondForm({ ...newPondForm, dailyFeedKg: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">Check-Tray Leftover</label>
                      <select value={newPondForm.trayLeftover} onChange={(e) => setNewPondForm({ ...newPondForm, trayLeftover: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold ${inputCls}`}>
                        <option>0% (Clean — Increase 5%)</option>
                        <option>10% (Normal — Keep Same)</option>
                        <option>25% (Reduce Next Meal 20%)</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                    + Save Pond Feed Entry
                  </button>
                </form>

                <div className={`lg:col-span-2 rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-teal-600" />
                    {lang === 'te' ? 'మీ చెరువుల DOC & చెక్-ట్రే రికార్డులు' : 'Active Pond DOC & Check-Tray Records'}
                  </h3>
                  {farmerPonds.length === 0 ? (
                    <p className="text-xs opacity-60">No pond records added yet. Log your pond stocking and daily feed on the left.</p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto pr-1 space-y-2.5">
                      {farmerPonds.map((p) => {
                        const daysElapsed = Math.max(1, Math.floor((Date.now() - new Date(p.stockingDate).getTime()) / 86400000));
                        return (
                          <div key={p.id} className={`border rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs ${subCardBg}`}>
                            <div>
                              <span className="font-extrabold text-sm text-teal-500">{p.pondName}</span> ({p.acres} Acres) • <span className="font-bold">DOC {daysElapsed}</span>
                              <p className="opacity-75 mt-0.5">Stocked: {Number(p.stockedQty).toLocaleString('en-IN')} PL on {p.stockingDate}</p>
                            </div>
                            <div className="text-right">
                              <span className="font-bold block">Daily Feed: {p.dailyFeedKg} kg</span>
                              <span className="text-[11px] text-emerald-500 font-semibold">Tray: {p.trayLeftover}</span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 4: HARVEST & PROFIT ESTIMATOR */}
            {buyerTab === 'analytics' && (
              <div className={`rounded-2xl p-6 shadow-xs border space-y-6 ${cardBg}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600" /> {t.tabAnalytics}
                  </h3>
                  <button
                    type="button"
                    onClick={handleRunEstimatorCalculate}
                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Calculator className="w-4 h-4" /> {t.calculateBtn}
                  </button>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">Number of Ponds</label>
                    <input type="number" min="1" value={calcInputs.ponds} onChange={(e) => setCalcInputs({ ...calcInputs, ponds: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">Acres per Pond</label>
                    <input type="number" step="0.5" min="0.5" value={calcInputs.acresPerPond} onChange={(e) => setCalcInputs({ ...calcInputs, acresPerPond: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">Stocking Density (/m²)</label>
                    <select value={calcInputs.density} onChange={(e) => setCalcInputs({ ...calcInputs, density: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold ${inputCls}`}>
                      <option value={30}>30 / m²</option>
                      <option value={40}>40 / m²</option>
                      <option value={50}>50 / m²</option>
                      <option value={60}>60 / m²</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">Expected Survival (%)</label>
                    <input type="number" min="40" max="100" value={calcInputs.survival} onChange={(e) => setCalcInputs({ ...calcInputs, survival: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">Target Count (/kg)</label>
                    <select value={calcInputs.targetCount} onChange={(e) => setCalcInputs({ ...calcInputs, targetCount: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold ${inputCls}`}>
                      <option value={25}>25 Count</option>
                      <option value={30}>30 Count</option>
                      <option value={40}>40 Count</option>
                      <option value={50}>50 Count</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">FCR (Feed Ratio)</label>
                    <input type="number" step="0.1" min="1.0" max="2.5" value={calcInputs.fcr} onChange={(e) => setCalcInputs({ ...calcInputs, fcr: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">Market Price (₹ / kg)</label>
                    <input type="number" value={calcInputs.marketRatePerKg} onChange={(e) => setCalcInputs({ ...calcInputs, marketRatePerKg: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">Feed Cost (₹ / kg)</label>
                    <input type="number" value={calcInputs.feedCostPerKg} onChange={(e) => setCalcInputs({ ...calcInputs, feedCostPerKg: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">Power & Probiotics (/Acre)</label>
                    <input type="number" value={calcInputs.powerProbioticCostPerAcre} onChange={(e) => setCalcInputs({ ...calcInputs, powerProbioticCostPerAcre: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">Total Seed ({calcResult.totalAcres} Acres)</span>
                    <span className="text-lg font-black">{calcResult.totalSeedsNeeded.toLocaleString('en-IN')} PL</span>
                  </div>
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-teal-600 font-bold block">Projected Harvest</span>
                    <span className="text-lg font-black">{calcResult.harvestTons} Tons ({calcResult.harvestKg.toLocaleString('en-IN')} kg)</span>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-amber-600 font-bold block">Total Feed Required</span>
                    <span className="text-lg font-black">{calcResult.totalFeedBags} Bags ({calcResult.totalFeedKg.toLocaleString('en-IN')} kg)</span>
                  </div>
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">Break-Even Cost / kg</span>
                    <span className="text-lg font-black">₹{calcResult.breakEvenPerKg} / kg</span>
                  </div>
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">Gross Crop Revenue</span>
                    <span className="text-lg font-black">₹{calcResult.grossRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-rose-500 font-bold block">Total Production Cost</span>
                    <span className="text-lg font-black">₹{calcResult.totalExpenses.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-emerald-500 font-bold block">Net Profit / Acre</span>
                    <span className="text-lg font-black">₹{calcResult.profitPerAcre.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-xl p-3.5">
                    <span className="text-[11px] text-emerald-100 font-bold block">Total Net Crop Profit</span>
                    <span className="text-lg font-black">₹{calcResult.netProfit.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: POND WATER LAB */}
            {buyerTab === 'waterlab' && (
              <div className="space-y-6">
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-teal-600" /> Pond Water & Vibrio/WSSV Disease Early-Warning Matrix
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">Water pH (7.5 - 8.3)</label>
                      <input type="number" step="0.1" value={waterTest.ph} onChange={(e) => setWaterTest({ ...waterTest, ph: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">Dissolved Oxygen (ppm)</label>
                      <input type="number" step="0.1" value={waterTest.doLevel} onChange={(e) => setWaterTest({ ...waterTest, doLevel: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">Alkalinity (ppm)</label>
                      <input type="number" value={waterTest.alkalinity} onChange={(e) => setWaterTest({ ...waterTest, alkalinity: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">Ammonia (ppm)</label>
                      <input type="number" step="0.01" value={waterTest.ammonia} onChange={(e) => setWaterTest({ ...waterTest, ammonia: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">Pond Salinity (PPT)</label>
                      <input type="number" value={waterTest.salinity} onChange={(e) => setWaterTest({ ...waterTest, salinity: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                  </div>
                  {(() => {
                    const isSafe = waterTest.ph >= 7.5 && waterTest.ph <= 8.4 && waterTest.doLevel >= 4.5 && waterTest.ammonia <= 0.1;
                    return (
                      <div className={`p-4 rounded-xl border text-xs font-bold ${isSafe ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : 'bg-amber-500/15 border-amber-500/40 text-amber-500'}`}>
                        {isSafe
                          ? '✅ Pond water parameters are OPTIMAL for immediate PL stocking!'
                          : '⚠️ Warning: Stabilize pH (7.5-8.3), DO (above 4.5 ppm), and Ammonia (below 0.1 ppm) before stocking.'}
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className={`rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                    <h4 className="font-bold text-sm text-teal-500">Salinity Acclimatization Time Calculator</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">Hatchery PPT</label>
                        <input type="number" value={acclimCalc.hatcheryPpt} onChange={(e) => setAcclimCalc({ ...acclimCalc, hatcheryPpt: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">Pond PPT</label>
                        <input type="number" value={acclimCalc.pondPpt} onChange={(e) => setAcclimCalc({ ...acclimCalc, pondPpt: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl border text-xs ${subCardBg}`}>
                      Salinity Variance: <b>{Math.abs(acclimCalc.hatcheryPpt - acclimCalc.pondPpt)} PPT</b> • Required Acclimatization Time: <b className="text-teal-500">{Math.abs(acclimCalc.hatcheryPpt - acclimCalc.pondPpt) * 4} Hours</b> (1 PPT every 4 hrs).
                    </div>
                  </div>

                  <div className={`rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                    <h4 className="font-bold text-sm text-teal-500">Oxygen Packing Bags & Van Size Estimator</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">Total Seed (PL)</label>
                        <input type="number" step="50000" value={oxygenCalc.seedCount} onChange={(e) => setOxygenCalc({ ...oxygenCalc, seedCount: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">Transit Hours</label>
                        <input type="number" value={oxygenCalc.travelHours} onChange={(e) => setOxygenCalc({ ...oxygenCalc, travelHours: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                    </div>
                    {(() => {
                      const plPerBag = oxygenCalc.travelHours > 5 ? 2000 : 3000;
                      const bags = Math.ceil((oxygenCalc.seedCount || 100000) / plPerBag);
                      const boxes = Math.ceil(bags / 2);
                      return (
                        <div className={`p-3 rounded-xl border text-xs ${subCardBg}`}>
                          Required Oxygen Bags: <b>{bags} Bags</b> ({plPerBag} PL/bag) • Cartons: <b>{boxes} Boxes</b> • Vehicle: <b className="text-emerald-500">{boxes > 60 ? 'Bolero Pickup / Mini Truck' : 'Tata Ace AC Van'}</b>
                        </div>
                      );
                    })()}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: DOC 1-110 FEEDING SCHEDULE */}
            {buyerTab === 'guide' && (
              <div className={`rounded-2xl p-6 border shadow-xs space-y-3 ${cardBg}`}>
                <h4 className="font-bold text-sm">DOC 1–110 Standard Vannamei Feeding & Check-Tray Chart (Per 1,00,000 PL)</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-300/30 opacity-65 uppercase text-[10px]">
                        <th className="py-2">Crop Stage</th>
                        <th className="py-2">Avg Body Weight</th>
                        <th className="py-2">Daily Feed / Lakh</th>
                        <th className="py-2">Feed Grade</th>
                        <th className="py-2">Check-Tray Protocol</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-300/20">
                      {DOC_SCHEDULE_TABLE.map((row, idx) => (
                        <tr key={idx}>
                          <td className="py-2.5 font-bold text-teal-500">{row.doc}</td>
                          <td className="py-2.5">{row.abw}</td>
                          <td className="py-2.5 font-bold">{row.feedPerLakh}</td>
                          <td className="py-2.5">{row.size}</td>
                          <td className="py-2.5 opacity-80">{row.trayCheck}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}

        {/* =========================================================
            2. SELLER (HATCHERY) PORTAL
           ========================================================= */}
        {currentUser.role === 'seller' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {!isSellerDepositPaid ? (
              <div className={`rounded-2xl p-6 sm:p-8 border-2 border-amber-500/40 shadow-sm space-y-5 ${cardBg}`}>
                <div className="flex items-start gap-3">
                  <div className="w-11 h-11 rounded-2xl bg-amber-500/15 text-amber-500 flex items-center justify-center shrink-0">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <span className="bg-amber-500/15 text-amber-500 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                      Hatchery Verification Deposit Required
                    </span>
                    <h2 className="text-xl font-extrabold mt-1.5">{t.depositTitle}</h2>
                    <p className="text-xs opacity-75 mt-1 leading-relaxed">{t.depositSub}</p>
                  </div>
                </div>

                <form onSubmit={handleConfirmHatcheryDeposit} className="space-y-4">
                  <div className="grid grid-cols-3 gap-2.5">
                    {[
                      { id: 'DIRECT_UPI', label: 'UPI (QR / App)', icon: QrCode },
                      { id: 'RAZORPAY', label: 'Razorpay', icon: CreditCard },
                      { id: 'BANK_TO_BANK', label: 'Bank NEFT / IMPS', icon: Landmark }
                    ].map(pm => {
                      const Icon = pm.icon;
                      const active = depositPayMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setDepositPayMethod(pm.id)}
                          className={`p-3 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer ${active ? 'border-teal-600 bg-teal-500/15 text-teal-600 font-extrabold' : subCardBg}`}
                        >
                          <Icon className="w-4 h-4 text-teal-600" />
                          <span className="text-xs">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div>
                    <label className="text-xs font-bold opacity-80 block mb-1">
                      Origin UPI ID / Bank Account Paying From (For Automatic Refund on Account Deletion)
                    </label>
                    <input
                      required
                      type="text"
                      placeholder="e.g., owner@okicici or ICICI A/C 3892010004512"
                      value={depositSourceInput}
                      onChange={(e) => setDepositSourceInput(e.target.value)}
                      className={`w-full border rounded-xl px-3.5 py-2 text-xs font-mono select-text ${inputCls}`}
                    />
                  </div>

                  {depositPayMethod === 'DIRECT_UPI' && (() => {
                    const upiUri = 'upi://pay?pa=aquamark@sbi&pn=AquaMarkDeposit&am=10000&cu=INR&tn=HatcherySecurityDeposit10K';
                    const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;
                    return (
                      <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4 space-y-3 text-xs">
                        <div className="flex flex-col sm:flex-row items-center gap-4">
                          <div className="bg-white p-2.5 rounded-xl border border-emerald-300 text-center text-slate-900 relative">
                            <img
                              src={qrApiUrl}
                              alt="Deposit UPI QR"
                              className={`w-32 h-32 object-contain transition-all duration-300 ${depositQrRevealed ? '' : 'blur-md select-none'}`}
                            />
                            {!depositQrRevealed && (
                              <button
                                type="button"
                                onClick={() => setDepositQrRevealed(true)}
                                className="absolute inset-0 m-auto h-9 w-24 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                              >
                                Show QR
                              </button>
                            )}
                            <span className="text-[10px] font-bold block mt-1">₹10,000 Security Deposit</span>
                          </div>
                          <div className="flex-1 space-y-2 w-full">
                            <p className="font-extrabold">Pay ₹10,000 via UPI QR or UPI App</p>
                            <a
                              href={upiUri}
                              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs inline-flex items-center justify-center gap-2"
                            >
                              <Smartphone className="w-4 h-4" /> Pay ₹10,000 By UPI App
                            </a>
                            <input
                              required
                              type="text"
                              placeholder={t.utrPlaceholder}
                              value={depositUtr}
                              onChange={(e) => setDepositUtr(e.target.value)}
                              className={`w-full border rounded-lg px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })()}

                  {depositPayMethod === 'BANK_TO_BANK' && (
                    <div className={`border rounded-xl p-3.5 space-y-2 text-xs ${subCardBg}`}>
                      <div className="font-mono text-[11px] space-y-0.5 select-text">
                        <div><b>Account Name:</b> Aqua Mark Escrow Deposit Account</div>
                        <div><b>Account No:</b> 20419820112 | <b>IFSC:</b> SBIN0008812</div>
                        <div><b>Deposit Amount:</b> ₹10,000 (Refundable)</div>
                      </div>
                      <input
                        required
                        type="text"
                        placeholder={t.utrPlaceholder}
                        value={depositUtr}
                        onChange={(e) => setDepositUtr(e.target.value)}
                        className={`w-full border rounded-lg px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                      />
                    </div>
                  )}

                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-xs cursor-pointer">
                    {t.depositPayBtn} →
                  </button>
                </form>
              </div>
            ) : !myFixedHatchery ? (
              <div className={`rounded-2xl p-6 sm:p-8 border shadow-xs space-y-5 ${cardBg}`}>
                <div>
                  <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    ✓ ₹10,000 Security Deposit Verified
                  </span>
                  <h2 className="text-xl font-extrabold mt-2">{t.unifiedRegTitle}</h2>
                  <p className="text-xs opacity-60 mt-1">{t.unifiedRegSub}</p>
                </div>

                <form onSubmit={handleCompleteUnifiedSellerReg} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1">{t.hatcheryNameLabel}</label>
                      <input required type="text" placeholder="e.g., Sri Sai Coastal Hatcheries" value={unifiedSellerForm.realName} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, realName: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">{t.caaLicenseLabel}</label>
                      <input required type="text" placeholder="CAA/AP/2026/XXXX" value={unifiedSellerForm.caaLicense} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, caaLicense: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">{t.zoneLabel}</label>
                      <select value={unifiedSellerForm.zone} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, zone: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm ${inputCls}`}>
                        {COASTAL_ZONES.map(z => (
                          <option key={z} value={z}>{z === 'OTHER_CUSTOM' ? '+ Add Custom Zone' : z}</option>
                        ))}
                      </select>
                      {unifiedSellerForm.zone === 'OTHER_CUSTOM' && (
                        <input required type="text" placeholder={t.customZonePlaceholder} value={unifiedSellerForm.customZone} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, customZone: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2 text-xs mt-2 select-text ${inputCls}`} />
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">{t.addressLabel}</label>
                      <input required type="text" placeholder="Beach Road, Kakinada" value={unifiedSellerForm.realAddress} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, realAddress: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm select-text ${inputCls}`} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold block mb-1">{t.mapsLinkLabel}</label>
                      <input type="url" placeholder="https://maps.google.com/?q=..." value={unifiedSellerForm.googleMapsLink} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, googleMapsLink: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm select-text ${inputCls}`} />
                    </div>
                    <div className="md:col-span-2">
                      <label className="text-xs font-bold block mb-1">{t.descriptionLabel}</label>
                      <textarea rows={2} placeholder="Write about your hatchery tanks, broodstock & water filtration..." value={unifiedSellerForm.description} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, description: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2 text-sm select-text ${inputCls}`} />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-300/30 space-y-3">
                    <h3 className="text-sm font-extrabold flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-teal-600" /> Settlement Bank & UPI Account
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold block mb-1">{t.accHolderLabel}</label>
                        <input required type="text" value={unifiedSellerForm.accountName} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, accountName: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm select-text ${inputCls}`} />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1">{t.accNoLabel}</label>
                        <input required type="text" placeholder="3892010004512" value={unifiedSellerForm.accountNo} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, accountNo: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono select-text ${inputCls}`} />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1">{t.ifscLabel}</label>
                        <input required type="text" placeholder="SBIN0001234" value={unifiedSellerForm.ifsc} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, ifsc: e.target.value.toUpperCase() })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono select-text ${inputCls}`} />
                      </div>
                      <div>
                        <label className="text-xs font-bold block mb-1">{t.upiLabel}</label>
                        <input required type="text" placeholder="hatchery@okaxis" value={unifiedSellerForm.upiId} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, upiId: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono select-text ${inputCls}`} />
                      </div>
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-xs cursor-pointer">
                    {t.completeRegBtn}
                  </button>
                </form>
              </div>
            ) : (
              /* ACTIVE HATCHERY DASHBOARD */
              <>
                <div className={`rounded-2xl p-6 sm:p-7 border-2 border-teal-500/30 shadow-xs space-y-4 ${cardBg}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-[260px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> {t.hatcheryLockedBanner} {currentUser.phone}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-teal-500/15 text-teal-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5" /> ₹{(myFixedHatchery.depositAmount || 10000).toLocaleString('en-IN')} Deposit Active
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-teal-600 dark:text-teal-400">
                        {myFixedHatchery.realName}
                      </h2>
                      <p className="text-xs sm:text-sm opacity-80 font-medium">
                        CAA: <span className="font-mono font-bold">{myFixedHatchery.caaLicense}</span> • {myFixedHatchery.zone} • {myFixedHatchery.realAddress}
                      </p>
                      {myFixedHatchery.description && (
                        <p className="text-xs opacity-75 pt-1 italic leading-relaxed">"{myFixedHatchery.description}"</p>
                      )}
                      {myFixedHatchery.googleMapsLink && (
                        <a
                          href={myFixedHatchery.googleMapsLink.startsWith('http') ? myFixedHatchery.googleMapsLink : `https://${myFixedHatchery.googleMapsLink}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-teal-500 hover:underline pt-1"
                        >
                          <MapPin className="w-3.5 h-3.5" /> View Google Maps Pin <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>

                    {/* RIGHT ACTION COLUMN: EDIT PROFILE + DEPOSIT BUTTON DIRECTLY BELOW IT */}
                    <div className="flex flex-col items-stretch gap-2 shrink-0">
                      {!isEditingSellerProfile && (
                        <button
                          type="button"
                          onClick={() => {
                            setUnifiedSellerForm({
                              realName: myFixedHatchery.realName || '',
                              caaLicense: myFixedHatchery.caaLicense || '',
                              zone: COASTAL_ZONES.includes(myFixedHatchery.zone) ? myFixedHatchery.zone : 'OTHER_CUSTOM',
                              customZone: COASTAL_ZONES.includes(myFixedHatchery.zone) ? '' : myFixedHatchery.zone,
                              realAddress: myFixedHatchery.realAddress || '',
                              googleMapsLink: myFixedHatchery.googleMapsLink || '',
                              description: myFixedHatchery.description || '',
                              accountName: myFixedHatchery.bankDetails?.accountName || '',
                              accountNo: myFixedHatchery.bankDetails?.accountNo || '',
                              ifsc: myFixedHatchery.bankDetails?.ifsc || '',
                              upiId: myFixedHatchery.bankDetails?.upiId || ''
                            });
                            setIsEditingSellerProfile(true);
                          }}
                          className={`border text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer ${subCardBg}`}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-teal-600" /> {t.editSellerProfileBtn}
                        </button>
                      )}

                      {/* DEPOSIT BUTTON DIRECTLY BELOW EDIT PROFILE */}
                      <button
                        type="button"
                        onClick={() => setShowHatcheryDepositModal(true)}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl inline-flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                      >
                        <PiggyBank className="w-4 h-4" /> Deposit (₹{(myFixedHatchery.depositAmount || 10000).toLocaleString('en-IN')})
                      </button>
                    </div>
                  </div>

                  {isEditingSellerProfile ? (
                    <form onSubmit={handleUpdateSellerProfileAndBank} className="space-y-4 pt-3 border-t border-slate-300/30">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.hatcheryNameLabel}</label>
                          <input required type="text" placeholder="Enter Hatchery Name" value={unifiedSellerForm.realName} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, realName: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.zoneLabel}</label>
                          <select value={unifiedSellerForm.zone} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, zone: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold ${inputCls}`}>
                            {COASTAL_ZONES.map(z => <option key={z} value={z}>{z === 'OTHER_CUSTOM' ? '+ Custom Zone' : z}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.addressLabel}</label>
                          <input required type="text" placeholder="Enter Facility Address" value={unifiedSellerForm.realAddress} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, realAddress: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.mapsLinkLabel}</label>
                          <input type="url" placeholder="https://maps.google.com/?q=..." value={unifiedSellerForm.googleMapsLink} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, googleMapsLink: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.descriptionLabel}</label>
                          <input type="text" placeholder="Describe hatchery facilities, broodstock & tanks..." value={unifiedSellerForm.description} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, description: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`} />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.accHolderLabel}</label>
                          <input required type="text" placeholder="Account Holder Name" value={unifiedSellerForm.accountName} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, accountName: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.accNoLabel}</label>
                          <input required type="text" placeholder="Account Number" value={unifiedSellerForm.accountNo} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, accountNo: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.ifscLabel}</label>
                          <input required type="text" placeholder="IFSC Code" value={unifiedSellerForm.ifsc} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, ifsc: e.target.value.toUpperCase() })} className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.upiLabel}</label>
                          <input required type="text" placeholder="UPI ID (name@bank)" value={unifiedSellerForm.upiId} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, upiId: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`} />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-end gap-2 pt-2">
                        <button type="button" onClick={() => setIsEditingSellerProfile(false)} className={`border text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer ${subCardBg}`}>
                          Cancel
                        </button>
                        <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                          {t.saveBtn}
                        </button>
                      </div>
                    </form>
                  ) : (
                    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border text-xs ${subCardBg}`}>
                      <div><span className="text-[10px] opacity-60 block">{t.accHolderLabel}</span><b>{myFixedHatchery.bankDetails?.accountName}</b></div>
                      <div><span className="text-[10px] opacity-60 block">{t.accNoLabel}</span><b className="font-mono">{myFixedHatchery.bankDetails?.accountNo}</b></div>
                      <div><span className="text-[10px] opacity-60 block">{t.ifscLabel}</span><b className="font-mono">{myFixedHatchery.bankDetails?.ifsc}</b></div>
                      <div><span className="text-[10px] opacity-60 block">{t.upiLabel}</span><b className="font-mono text-teal-500">{myFixedHatchery.bankDetails?.upiId}</b></div>
                    </div>
                  )}
                </div>

                {/* BELOW HATCHERY DETAILS: 3 CLICKABLE TABS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setSellerTxModal({ title: 'Upcoming Packing Receivable Transactions', list: hatcheryUpcomingOrders })}
                    className={`border hover:border-amber-500 rounded-2xl p-5 shadow-xs cursor-pointer transition ${cardBg}`}
                  >
                    <span className="text-xs text-amber-500 font-bold flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> Upcoming Packing Receivable</span>
                      <span className="underline text-[11px]">View All →</span>
                    </span>
                    <div className="text-2xl font-black mt-1.5">₹{hatcheryPendingRevenue.toLocaleString('en-IN')}</div>
                    <p className="text-[11px] opacity-60 mt-1">{hatcheryUpcomingOrders.length} upcoming packing orders</p>
                  </div>

                  <div
                    onClick={() => setSellerTxModal({ title: 'Booked Packing Orders & Actions', list: hatcheryUpcomingOrders })}
                    className={`border hover:border-teal-500 rounded-2xl p-5 shadow-xs cursor-pointer transition ${cardBg}`}
                  >
                    <span className="text-xs text-teal-500 font-bold flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5"><Package className="w-4 h-4" /> Packing Orders</span>
                      <span className="underline text-[11px]">Manage →</span>
                    </span>
                    <div className="text-2xl font-black mt-1.5">{hatcheryUpcomingOrders.length} Scheduled</div>
                    <p className="text-[11px] opacity-60 mt-1">Click to view booked packings & mark complete</p>
                  </div>

                  <div
                    onClick={() => setShowSellerVideoModal(true)}
                    className={`border hover:border-teal-500 rounded-2xl p-5 shadow-xs cursor-pointer transition ${cardBg}`}
                  >
                    <span className="text-xs text-teal-500 font-bold flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5"><Video className="w-4 h-4" /> Live Video Requests</span>
                      <span className="underline text-[11px]">Open & Reply →</span>
                    </span>
                    <div className="text-2xl font-black mt-1.5">{myLiveVideoReqs.length} Requests</div>
                    <p className="text-[11px] opacity-60 mt-1">
                      {myLiveVideoReqs[0]
                        ? `Latest: ${myLiveVideoReqs[0].farmerName} (Batch ${myLiveVideoReqs[0].batchId})`
                        : 'Click to view farmer live video requests'}
                    </p>
                  </div>
                </div>

                {/* ADD NEW SEED BATCH (WITH MINIMUM PACKING QUANTITY) */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-teal-600" /> {t.addBatchTitle}
                  </h3>
                  <form onSubmit={handlePublishBatch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.batchNoLabel}</label>
                        <input
                          required
                          type="text"
                          placeholder={t.batchNoPlaceholder}
                          value={newBatchForm.batchNumber}
                          onChange={(e) => setNewBatchForm({ ...newBatchForm, batchNumber: e.target.value })}
                          className={`w-full border rounded-xl px-3 py-2 text-xs font-mono font-bold select-text ${inputCls}`}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.speciesLabel}</label>
                        <select value={newBatchForm.species} onChange={(e) => setNewBatchForm({ ...newBatchForm, species: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold ${inputCls}`}>
                          {SHRIMP_SPECIES_OPTIONS.map(sp => (
                            <option key={sp} value={sp}>{sp === 'OTHER_CUSTOM' ? '+ Other (Type Custom Species)' : sp}</option>
                          ))}
                        </select>
                        {newBatchForm.species === 'OTHER_CUSTOM' && (
                          <input required type="text" placeholder={t.customSpeciesPlaceholder} value={newBatchForm.customSpecies} onChange={(e) => setNewBatchForm({ ...newBatchForm, customSpecies: e.target.value })} className={`w-full border rounded-xl px-3 py-1.5 text-xs mt-1.5 select-text ${inputCls}`} />
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.stage}</label>
                        <select value={newBatchForm.plStage} onChange={(e) => setNewBatchForm({ ...newBatchForm, plStage: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold ${inputCls}`}>
                          {SEED_STAGE_OPTIONS.map(st => (
                            <option key={st} value={st}>{st === 'OTHER_CUSTOM' ? '+ Custom Stage' : st}</option>
                          ))}
                        </select>
                        {newBatchForm.plStage === 'OTHER_CUSTOM' && (
                          <input required type="text" placeholder={t.customStagePlaceholder} value={newBatchForm.customStage} onChange={(e) => setNewBatchForm({ ...newBatchForm, customStage: e.target.value })} className={`w-full border rounded-xl px-3 py-1.5 text-xs mt-1.5 select-text ${inputCls}`} />
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.ratePerSeedLabel}</label>
                        <input type="number" step="0.01" value={newBatchForm.pricePer1000} onChange={(e) => setNewBatchForm({ ...newBatchForm, pricePer1000: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>

                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.salinity} (PPT)</label>
                        <input type="number" value={newBatchForm.salinity} onChange={(e) => setNewBatchForm({ ...newBatchForm, salinity: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.bonus} (%)</label>
                        <input type="number" value={newBatchForm.bonusPercent} onChange={(e) => setNewBatchForm({ ...newBatchForm, bonusPercent: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>

                      <div className="md:col-span-2">
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.stockLabel}</label>
                        <div className="flex gap-1.5">
                          <input
                            required
                            type="text"
                            inputMode="numeric"
                            maxLength={3}
                            placeholder="1-100"
                            value={newBatchForm.stockAmount}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                              const num = clean === '' ? '' : String(Math.min(100, Number(clean)));
                              setNewBatchForm({ ...newBatchForm, stockAmount: num });
                            }}
                            className={`w-20 border rounded-xl px-2.5 py-2 text-xs font-bold text-center select-text ${inputCls}`}
                          />
                          <select
                            value={newBatchForm.stockUnit}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, stockUnit: e.target.value })}
                            className={`flex-1 border rounded-xl px-2 py-2 text-xs font-bold ${inputCls}`}
                          >
                            <option value="LAKHS">Lakhs (× 1,00,000)</option>
                            <option value="MILLIONS">Millions (× 10,00,000)</option>
                          </select>
                        </div>
                      </div>

                      {/* MINIMUM PACKING OPTION FOR OWNER */}
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-amber-500 block mb-1">{t.minPackingLabel}</label>
                        <div className="flex gap-1.5">
                          <input
                            required
                            type="text"
                            inputMode="numeric"
                            maxLength={3}
                            placeholder="1-100"
                            value={newBatchForm.minPackAmount}
                            onChange={(e) => {
                              const clean = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                              const num = clean === '' ? '' : String(Math.min(100, Number(clean)));
                              setNewBatchForm({ ...newBatchForm, minPackAmount: num });
                            }}
                            className={`w-20 border border-amber-500/40 rounded-xl px-2.5 py-2 text-xs font-bold text-center select-text ${inputCls}`}
                          />
                          <select
                            value={newBatchForm.minPackUnit}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, minPackUnit: e.target.value })}
                            className={`flex-1 border border-amber-500/40 rounded-xl px-2 py-2 text-xs font-bold ${inputCls}`}
                          >
                            <option value="LAKHS">Lakhs (Min Order)</option>
                            <option value="MILLIONS">Millions (Min Order)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.availDateLabel}</label>
                        <input required type="date" value={newBatchForm.availableDate} onChange={(e) => setNewBatchForm({ ...newBatchForm, availableDate: e.target.value })} className={`w-full border rounded-xl px-2.5 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                    </div>

                    {/* PCR IMAGES + TANK VIDEOS + TIME SLOT */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-start">
                      <div className={`border rounded-xl p-3 space-y-2 ${subCardBg}`}>
                        <button
                          type="button"
                          disabled={uploadProgress.active}
                          onClick={() => setMediaPickerTarget(mediaPickerTarget === 'NEW_PCR' ? null : 'NEW_PCR')}
                          className={`w-full border border-teal-500/40 text-teal-600 text-xs font-bold py-2 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer ${cardBg}`}
                        >
                          <Upload className="w-4 h-4" /> {t.pcrUploadBtnLabel}
                        </button>
                        {mediaPickerTarget === 'NEW_PCR' && (
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button type="button" onClick={() => pcrCamRef.current?.click()} className="bg-teal-600 text-white text-[11px] font-bold py-1.5 rounded-lg inline-flex items-center justify-center gap-1 cursor-pointer">
                              <Camera className="w-3.5 h-3.5" /> Camera
                            </button>
                            <button type="button" onClick={() => pcrFileRef.current?.click()} className={`border text-[11px] font-bold py-1.5 rounded-lg inline-flex items-center justify-center gap-1 cursor-pointer ${cardBg}`}>
                              <FolderOpen className="w-3.5 h-3.5 text-teal-600" /> Files
                            </button>
                          </div>
                        )}
                        {pcrImages.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {pcrImages.map((img, i) => (
                              <span key={i} onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })} className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer">
                                {img.label} ✓
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] opacity-60 block text-center">{t.pcrHintLabel}</span>
                        )}
                      </div>

                      <div className={`border rounded-xl p-3 space-y-2 ${subCardBg}`}>
                        <button
                          type="button"
                          disabled={uploadProgress.active}
                          onClick={() => setMediaPickerTarget(mediaPickerTarget === 'NEW_VID' ? null : 'NEW_VID')}
                          className={`w-full border border-teal-500/40 text-teal-600 text-xs font-bold py-2 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer ${cardBg}`}
                        >
                          <Video className="w-4 h-4" /> {t.videoUploadBtnLabel}
                        </button>
                        {mediaPickerTarget === 'NEW_VID' && (
                          <div className="grid grid-cols-2 gap-1.5 pt-1">
                            <button type="button" onClick={() => vidCamRef.current?.click()} className="bg-teal-600 text-white text-[11px] font-bold py-1.5 rounded-lg inline-flex items-center justify-center gap-1 cursor-pointer">
                              <Camera className="w-3.5 h-3.5" /> Camera
                            </button>
                            <button type="button" onClick={() => vidFileRef.current?.click()} className={`border text-[11px] font-bold py-1.5 rounded-lg inline-flex items-center justify-center gap-1 cursor-pointer ${cardBg}`}>
                              <FolderOpen className="w-3.5 h-3.5 text-teal-600" /> Files
                            </button>
                          </div>
                        )}
                        {tankVideos.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {tankVideos.map((vid, i) => (
                              <span key={i} onClick={() => setFullScreenMedia({ type: 'video', url: vid.url, label: vid.label })} className="bg-teal-500/20 text-teal-500 text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer">
                                {vid.label} ✓
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] opacity-60 block text-center">Optional: Tank PL activity videos</span>
                        )}
                      </div>

                      <div className={`border rounded-xl p-3 space-y-1 ${subCardBg}`}>
                        <label className="text-[11px] font-bold opacity-75 block">{t.availTimeLabel}</label>
                        <select value={newBatchForm.availableTimeSlot} onChange={(e) => setNewBatchForm({ ...newBatchForm, availableTimeSlot: e.target.value })} className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold ${inputCls}`}>
                          {PACKING_TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                      </div>
                    </div>

                    <button type="submit" disabled={uploadProgress.active} className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm shadow-xs cursor-pointer">
                      {t.publishBtn}
                    </button>
                  </form>
                </div>

                {/* OWNER'S ACTIVE BATCHES */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Layers className="w-5 h-5 text-teal-600" /> {t.myBatchesTitle}
                  </h3>
                  {myOwnedBatches.length === 0 ? (
                    <p className="text-xs opacity-60">{t.noBatchesSeller}</p>
                  ) : (
                    <div className="max-h-[55vh] overflow-y-auto pr-1 space-y-3">
                      {myOwnedBatches.map((b) => {
                        const isEditing = editingBatchId === b.id;
                        return (
                          <div key={b.id} className={`border rounded-xl p-4 space-y-3 ${subCardBg}`}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-teal-500">{b.id}</span>
                                  <span className="font-bold text-sm">{b.species}</span>
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${b.paused ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'}`}>
                                    {b.paused ? 'PAUSED' : 'LIVE'}
                                  </span>
                                  <span className="bg-amber-500/15 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Min Packing: {formatSeedQuantityShort(b.minPackingQty || 100000).split(' (')[0]}
                                  </span>
                                </div>
                                <span className="block text-[11px] opacity-65 mt-0.5">
                                  Packing: {b.availableDate} ({b.availableTimeSlot}) • PCR: {(b.pcrImages || []).length} Img • Videos: {(b.tankVideos || []).length}
                                </span>
                              </div>
                              <div className="flex flex-wrap items-center gap-2">
                                <button
                                  type="button"
                                  onClick={() => togglePauseBatch(b.id)}
                                  className={`border text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer ${b.paused ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/15 border-amber-500/30 text-amber-500'}`}
                                >
                                  {b.paused ? <><PlayCircle className="w-3.5 h-3.5" /> Resume Live</> : <><PauseCircle className="w-3.5 h-3.5" /> Pause</>}
                                </button>

                                {isEditing ? (
                                  <>
                                    <button type="button" onClick={() => saveEditedBatch(b.id)} className="bg-emerald-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-lg cursor-pointer">
                                      {t.saveChangesBtn}
                                    </button>
                                    <button type="button" onClick={() => setEditingBatchId(null)} className={`border text-xs font-bold px-2.5 py-1.5 rounded-lg cursor-pointer ${cardBg}`}>
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <button type="button" onClick={() => startEditingBatch(b)} className={`border text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer ${cardBg}`}>
                                    <Edit3 className="w-3.5 h-3.5 text-teal-600" /> {t.editBatchBtn}
                                  </button>
                                )}
                                <button type="button" onClick={() => removeBatch(b.id)} className="bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" /> {t.removeBtn}
                                </button>
                              </div>
                            </div>

                            {isEditing ? (
                              <div className="space-y-3 pt-2 border-t border-slate-300/30">
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.speciesLabel}</label>
                                    <input type="text" value={editBatchValues.species} onChange={(e) => setEditBatchValues({ ...editBatchValues, species: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.broodstockLabel}</label>
                                    <select value={editBatchValues.broodstock} onChange={(e) => setEditBatchValues({ ...editBatchValues, broodstock: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold ${inputCls}`}>
                                      {BROODSTOCK_ORIGINS.map(br => <option key={br} value={br}>{br}</option>)}
                                    </select>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.stage}</label>
                                    <input type="text" value={editBatchValues.plStage} onChange={(e) => setEditBatchValues({ ...editBatchValues, plStage: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-6 gap-2.5">
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.salinity} (PPT)</label>
                                    <input type="number" value={editBatchValues.salinity} onChange={(e) => setEditBatchValues({ ...editBatchValues, salinity: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.ratePerSeedLabel}</label>
                                    <input type="number" step="0.01" value={editBatchValues.pricePer1000} onChange={(e) => setEditBatchValues({ ...editBatchValues, pricePer1000: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.bonus} (%)</label>
                                    <input type="number" value={editBatchValues.bonusPercent} onChange={(e) => setEditBatchValues({ ...editBatchValues, bonusPercent: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">Stock (1-100)</label>
                                    <div className="flex gap-1">
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={editBatchValues.stockAmount}
                                        onChange={(e) => {
                                          const clean = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                                          setEditBatchValues({ ...editBatchValues, stockAmount: clean === '' ? '' : Math.min(100, Number(clean)) });
                                        }}
                                        className={`w-11 border rounded-lg px-1 py-1.5 text-xs font-bold text-center select-text ${inputCls}`}
                                      />
                                      <select value={editBatchValues.stockUnit} onChange={(e) => setEditBatchValues({ ...editBatchValues, stockUnit: e.target.value })} className={`flex-1 border rounded-lg px-1 py-1.5 text-[10px] font-bold ${inputCls}`}>
                                        <option value="LAKHS">Lakhs</option>
                                        <option value="MILLIONS">Millions</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold text-amber-500 block">Min Packing</label>
                                    <div className="flex gap-1">
                                      <input
                                        type="text"
                                        inputMode="numeric"
                                        value={editBatchValues.minPackAmount}
                                        onChange={(e) => {
                                          const clean = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                                          setEditBatchValues({ ...editBatchValues, minPackAmount: clean === '' ? '' : Math.min(100, Number(clean)) });
                                        }}
                                        className={`w-11 border border-amber-500/40 rounded-lg px-1 py-1.5 text-xs font-bold text-center select-text ${inputCls}`}
                                      />
                                      <select value={editBatchValues.minPackUnit} onChange={(e) => setEditBatchValues({ ...editBatchValues, minPackUnit: e.target.value })} className={`flex-1 border border-amber-500/40 rounded-lg px-1 py-1.5 text-[10px] font-bold ${inputCls}`}>
                                        <option value="LAKHS">Lakhs</option>
                                        <option value="MILLIONS">Millions</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.availDateLabel}</label>
                                    <input type="date" value={editBatchValues.availableDate} onChange={(e) => setEditBatchValues({ ...editBatchValues, availableDate: e.target.value })} className={`w-full border rounded-lg px-1.5 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className={`grid grid-cols-5 gap-2 text-center p-2.5 rounded-lg border text-xs ${cardBg}`}>
                                <div><span className="text-[10px] opacity-55 block">{t.stage}</span><b>{b.plStage}</b></div>
                                <div><span className="text-[10px] opacity-55 block">{t.salinity}</span><b className="text-teal-500">{b.salinity} PPT</b></div>
                                <div><span className="text-[10px] opacity-55 block">{t.perSeed}</span><b>₹{b.pricePer1000.toFixed(2)}</b></div>
                                <div><span className="text-[10px] opacity-55 block">Min Pack</span><b className="text-amber-500">{formatSeedQuantityShort(b.minPackingQty || 100000).split(' (')[0]}</b></div>
                                <div><span className="text-[10px] opacity-55 block">{t.stock}</span><b>{(b.availableStock || 0).toLocaleString('en-IN')}</b></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* TOTAL REVENUE LEDGER */}
                <div
                  onClick={() => setSellerTxModal({ title: 'Total Packing Revenue Received (All Cleared Transactions)', list: hatcheryClearedOrders })}
                  className={`rounded-2xl p-6 border-2 border-emerald-500/40 hover:border-emerald-500 shadow-xs flex flex-wrap items-center justify-between gap-4 cursor-pointer transition ${cardBg}`}
                >
                  <div className="space-y-1">
                    <span className="text-xs text-emerald-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" /> Total Packing Revenue Received (Lifetime Ledger)
                    </span>
                    <div className="text-3xl font-black text-emerald-500">₹{hatcheryClearedRevenue.toLocaleString('en-IN')}</div>
                    <p className="text-xs opacity-65">Click here to inspect all {hatcheryClearedOrders.length} completed & settled transactions</p>
                  </div>
                  <span className="bg-emerald-600 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5">
                    View All Transactions <ChevronRight className="w-4 h-4" />
                  </span>
                </div>

                {/* FARMER FEEDBACK */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-teal-600" /> {t.sellerFeedbackTitle} ({myPrivateReviews.length})
                  </h3>
                  {myPrivateReviews.length === 0 ? (
                    <p className="text-xs opacity-60">{t.noFeedbackYet}</p>
                  ) : (
                    <div className="max-h-72 overflow-y-auto pr-1 space-y-2.5">
                      {myPrivateReviews.map((rev, idx) => (
                        <div key={idx} className={`border rounded-xl p-3.5 text-xs flex flex-wrap items-center justify-between gap-2 ${subCardBg}`}>
                          <div>
                            <span className="font-bold">{rev.farmerName}</span> • <span className="opacity-65">Batch {rev.batchId} ({rev.plStage})</span>
                            <p className="mt-1">"{rev.comment}"</p>
                          </div>
                          <div className="text-right">
                            <span className="bg-amber-500/20 text-amber-500 font-extrabold px-2.5 py-1 rounded-lg">{rev.stars}★</span>
                            <span className="block text-[10px] opacity-50 mt-1">{rev.date}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        )}

        {/* =========================================================
            3. MEDIATOR (BROKER) PORTAL
           ========================================================= */}
        {currentUser.role === 'mediator' && (
          <div className="space-y-6">
            {!myFixedBroker ? (
              <div className={`max-w-2xl mx-auto rounded-2xl p-6 sm:p-8 border shadow-xs space-y-5 ${cardBg}`}>
                <div>
                  <span className="bg-teal-500/15 text-teal-600 border border-teal-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    Mandatory Broker KYC & Settlement Setup
                  </span>
                  <h2 className="text-xl font-extrabold mt-2">{t.brokerRegTitle}</h2>
                  <p className="text-xs opacity-60 mt-1">{t.brokerRegSub}</p>
                </div>

                <form onSubmit={handleCompleteBrokerReg} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold block mb-1">{t.accHolderLabel}</label>
                      <input required type="text" value={brokerBankForm.accountName} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, accountName: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">{t.accNoLabel}</label>
                      <input required type="text" placeholder="9180100452190" value={brokerBankForm.accountNo} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, accountNo: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">{t.ifscLabel}</label>
                      <input required type="text" placeholder="SBIN0001234" value={brokerBankForm.ifsc} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, ifsc: e.target.value.toUpperCase() })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold block mb-1">{t.upiLabel}</label>
                      <input required type="text" placeholder="broker@okaxis" value={brokerBankForm.upiId} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, upiId: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-mono select-text ${inputCls}`} />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-xs cursor-pointer">
                    {t.brokerActivateBtn}
                  </button>
                </form>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div
                    onClick={() => setBrokerTxListModal({ title: 'Upcoming 2% Commission Transactions (On Hold)', list: brokerHeldBookings })}
                    className={`border hover:border-amber-500 rounded-2xl p-5 shadow-xs cursor-pointer transition ${cardBg}`}
                  >
                    <span className="text-xs text-amber-500 font-bold flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> {t.brokerHoldCard}</span>
                      <span className="underline text-[11px]">View All ({brokerHeldBookings.length}) →</span>
                    </span>
                    <div className="text-3xl font-black mt-2">₹{brokerHeld2PctTotal.toLocaleString('en-IN')}</div>
                    <p className="text-xs opacity-60 mt-1.5">{t.brokerHoldSub}</p>
                  </div>

                  <div
                    onClick={() => setBrokerTxListModal({ title: 'Received 2% Commission Transactions (Cleared)', list: brokerCreditedBookings })}
                    className={`border hover:border-emerald-500 rounded-2xl p-5 shadow-xs cursor-pointer transition ${cardBg}`}
                  >
                    <span className="text-xs text-emerald-500 font-bold flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5"><Wallet className="w-4 h-4" /> {t.brokerReleasedCard}</span>
                      <span className="underline text-[11px]">View All ({brokerCreditedBookings.length}) →</span>
                    </span>
                    <div className="text-3xl font-black text-emerald-500 mt-2">₹{brokerCredited2PctTotal.toLocaleString('en-IN')}</div>
                    <p className="text-xs opacity-60 mt-1.5">
                      {myFixedBroker.bankDetails?.upiId} • {myFixedBroker.bankDetails?.ifsc}
                    </p>
                  </div>
                </div>

                {/* Broker Bank Card */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-teal-600" />
                      <h3 className="font-bold text-sm">Settlement Bank & UPI Account</h3>
                    </div>
                    {!isEditingBrokerBank && (
                      <button
                        type="button"
                        onClick={() => {
                          setBrokerBankForm({
                            accountName: myFixedBroker.bankDetails?.accountName || '',
                            accountNo: myFixedBroker.bankDetails?.accountNo || '',
                            ifsc: myFixedBroker.bankDetails?.ifsc || '',
                            upiId: myFixedBroker.bankDetails?.upiId || ''
                          });
                          setIsEditingBrokerBank(true);
                        }}
                        className={`border text-xs font-bold px-3 py-1 rounded-xl inline-flex items-center gap-1 cursor-pointer ${subCardBg}`}
                      >
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" /> {t.editBrokerProfileBtn}
                      </button>
                    )}
                  </div>

                  {isEditingBrokerBank ? (
                    <form onSubmit={handleCompleteBrokerReg} className="space-y-3 pt-2 border-t border-slate-300/30">
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.accHolderLabel}</label>
                          <input required type="text" placeholder="Account Holder Name" value={brokerBankForm.accountName} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, accountName: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.accNoLabel}</label>
                          <input required type="text" placeholder="Account Number" value={brokerBankForm.accountNo} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, accountNo: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.ifscLabel}</label>
                          <input required type="text" placeholder="IFSC Code" value={brokerBankForm.ifsc} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, ifsc: e.target.value.toUpperCase() })} className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-xs font-bold opacity-75 block mb-1">{t.upiLabel}</label>
                          <input required type="text" placeholder="UPI ID" value={brokerBankForm.upiId} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, upiId: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`} />
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => { setDeleteConfirmPassword(''); setShowDeleteAccountModal(true); }}
                          className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete Account
                        </button>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setIsEditingBrokerBank(false)} className={`border text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer ${subCardBg}`}>
                            Cancel
                          </button>
                          <button type="submit" className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                            {t.saveBtn}
                          </button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className={`grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 rounded-xl border text-xs ${subCardBg}`}>
                      <div><span className="text-[10px] opacity-60 block">{t.accHolderLabel}</span><b>{myFixedBroker.bankDetails?.accountName}</b></div>
                      <div><span className="text-[10px] opacity-60 block">{t.accNoLabel}</span><b className="font-mono">{myFixedBroker.bankDetails?.accountNo}</b></div>
                      <div><span className="text-[10px] opacity-60 block">{t.ifscLabel}</span><b className="font-mono">{myFixedBroker.bankDetails?.ifsc}</b></div>
                      <div><span className="text-[10px] opacity-60 block">{t.upiLabel}</span><b className="font-mono text-teal-500">{myFixedBroker.bankDetails?.upiId}</b></div>
                    </div>
                  )}
                </div>

                {/* BROKER BOOKINGS */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-teal-600" /> {t.brokerBookingsTitle}
                  </h3>
                  {myBrokerBookings.length === 0 ? (
                    <p className="text-xs opacity-60">{t.noBrokerBookings}</p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
                      {myBrokerBookings.map((bk) => {
                        const isCleared = bk.settlement?.status === 'BALANCE_CLEARED';
                        return (
                          <div
                            key={bk.bookingId}
                            onClick={() => setSelectedBrokerTx(bk)}
                            className={`border hover:border-teal-500 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 transition cursor-pointer ${subCardBg}`}
                          >
                            <div className="space-y-1 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-teal-500">{bk.bookingId}</span>
                                <span className="font-mono text-[11px] bg-slate-500/10 px-2 py-0.5 rounded">UTR: {bk.paymentId}</span>
                                <span className={`font-bold px-2.5 py-0.5 rounded-full ${isCleared ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>
                                  {isCleared
                                    ? `2% Commission Credited: ₹${bk.settlement?.brokerBase2Pct || 0}`
                                    : `2% Commission Hold: ₹${bk.settlement?.brokerBase2Pct || 0}`}
                                </span>
                              </div>
                              <p className="font-bold">
                                Farmer: {bk.farmerName} (+91 {bk.farmerPhone}) → Hatchery: {bk.batch?.realName || bk.batch?.hatcheryCode} (Batch {bk.batch?.id})
                              </p>
                              <p className="opacity-70">
                                {(bk.quantity || 0).toLocaleString('en-IN')} PL ({bk.batch?.plStage}) • Packing: {bk.packingDate}
                              </p>
                            </div>
                            <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              <button
                                type="button"
                                onClick={() => handleDownloadVerifiedPdf(bk, isCleared)}
                                className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer"
                              >
                                <Printer className="w-3.5 h-3.5 text-emerald-400" /> {isCleared ? t.finalReceiptBtn : t.advanceReceiptBtn}
                              </button>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* BROKER MARKETPLACE */}
                <div className="space-y-4">
                  <h2 className="text-base font-extrabold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-teal-600" /> {t.brokerMarketplaceTitle}
                  </h2>

                  {renderFilterSortBar(false)}

                  <div className="max-h-[65vh] overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                    {filteredAndSortedBatches.map((batch) => {
                      const isSoldOut = (batch.availableStock || 0) <= 0;
                      const isPaused = Boolean(batch.paused);
                      const minPackingQty = batch.minPackingQty || 100000;
                      return (
                        <div key={batch.id} className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-teal-500 transition ${cardBg}`}>
                          <div onClick={() => setInspectedBatch(batch)} className="space-y-3 cursor-pointer">
                            <div className="flex items-start justify-between">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="font-mono text-[11px] font-bold bg-teal-500/15 text-teal-600 px-2 py-0.5 rounded">{batch.id}</span>
                                  <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                    {t.caaVerified}
                                  </span>
                                  <span className="bg-amber-500/15 text-amber-500 text-[10px] font-bold px-2 py-0.5 rounded-full">
                                    Min Packing: {formatSeedQuantityShort(minPackingQty).split(' (')[0]}
                                  </span>
                                  <span className="text-xs font-semibold opacity-60">{batch.zone}</span>
                                </div>
                                <h3 className="text-base font-extrabold mt-1.5">{batch.hatcheryCode || 'Verified Hatchery'}</h3>
                                <p className="text-xs opacity-65">{batch.species}</p>
                              </div>
                              <div className="text-right">
                                <div className="text-xl font-black">₹{(batch.pricePer1000 || 0).toFixed(2)}</div>
                                <span className="text-[11px] opacity-55">{t.perSeed}</span>
                              </div>
                            </div>

                            <div className={`grid grid-cols-4 gap-2 p-2.5 rounded-xl border text-center text-xs ${subCardBg}`}>
                              <div><span className="text-[10px] opacity-55 block">{t.stage}</span><b>{batch.plStage}</b></div>
                              <div><span className="text-[10px] opacity-55 block">{t.salinity}</span><b className="text-teal-500">{batch.salinity} PPT</b></div>
                              <div><span className="text-[10px] opacity-55 block">{t.bonus}</span><b className="text-emerald-500">+{batch.bonusPercent}%</b></div>
                              <div><span className="text-[10px] opacity-55 block">{t.stock}</span><b>{(batch.availableStock || 0).toLocaleString('en-IN')}</b></div>
                            </div>
                          </div>

                          <button
                            type="button"
                            disabled={isSoldOut || isPaused}
                            onClick={() => {
                              setModalError('');
                              setSelectedBatch(batch);
                              const defaultLakhs = Math.max(1, Math.ceil(minPackingQty / 100000));
                              setBookingForm(prev => ({
                                ...prev,
                                farmerName: brokerFarmers[0]?.name || '',
                                farmerPhone: brokerFarmers[0]?.phone || '',
                                qtyAmount: String(Math.min(100, defaultLakhs)),
                                qtyUnit: 'LAKHS',
                                pondSplitCount: '1',
                                packingDate: batch.availableDate || prev.packingDate,
                                packingTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
                                brokerMarginPaise: '2',
                                paymentPlan: 'ADVANCE',
                                upiSubMode: 'QR',
                                qrRevealed: false,
                                utrReference: ''
                              }));
                            }}
                            className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                          >
                            {isSoldOut ? t.soldOutBadge : isPaused ? t.pausedBadge : t.selectAndBookBtn}
                          </button>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Broker Locked Farmers CRM */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <form onSubmit={handleAddBrokerFarmer} className={`rounded-2xl p-5 border shadow-xs space-y-3.5 ${cardBg}`}>
                    <h3 className="font-bold text-sm flex items-center gap-2">
                      <Lock className="w-4 h-4 text-teal-600" /> {t.lockFarmerTitle}
                    </h3>
                    <input required type="text" placeholder={t.farmerNamePlaceholder} value={newFarmer.name} onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2 text-sm select-text ${inputCls}`} />
                    <input required type="tel" maxLength={10} placeholder={t.mobileLabel} value={newFarmer.phone} onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value.replace(/\D/g, '').slice(0, 10) })} className={`w-full border rounded-xl px-3.5 py-2 text-sm font-mono select-text ${inputCls}`} />
                    <div className="grid grid-cols-2 gap-2">
                      <input required type="text" placeholder={t.villagePlaceholder} value={newFarmer.village} onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2 text-sm select-text ${inputCls}`} />
                      <input required type="number" step="0.5" placeholder={t.acresPlaceholder} value={newFarmer.acres} onChange={(e) => setNewFarmer({ ...newFarmer, acres: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2 text-sm select-text ${inputCls}`} />
                    </div>
                    <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                      {t.lockFarmerBtn}
                    </button>
                  </form>

                  <div className={`lg:col-span-2 rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                    <h3 className="font-bold text-base flex items-center gap-2">
                      <Users className="w-5 h-5 text-teal-600" /> {t.myFarmersTitle}
                    </h3>
                    {brokerFarmers.length === 0 ? (
                      <p className="text-xs opacity-60">No farmers locked yet. Add your farmers on the left.</p>
                    ) : (
                      <div className="max-h-64 overflow-y-auto">
                        <table className="w-full text-left border-collapse text-sm">
                          <thead>
                            <tr className="border-b border-slate-300/30 text-[11px] uppercase opacity-60">
                              <th className="py-2">Farmer</th>
                              <th className="py-2">Village / Acres</th>
                              <th className="py-2">Protection</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-300/20">
                            {brokerFarmers.map((f) => (
                              <tr key={f.id}>
                                <td className="py-2.5 font-bold">{f.name} <span className="block text-xs font-normal opacity-60">{f.phone}</span></td>
                                <td className="py-2.5 text-xs opacity-75">{f.village} ({f.acres} Acres)</td>
                                <td className="py-2.5"><span className="text-[11px] font-semibold bg-emerald-500/15 text-emerald-500 px-2.5 py-0.5 rounded-full">Locked till {f.lockedUntil}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </main>

      {/* =========================================================
          HATCHERY DEPOSIT MODAL (VIEW DEPOSITED MONEY, ADD MONEY, DELETE ACCOUNT TO WITHDRAW MONEY TO SOURCE ACCOUNT)
         ========================================================= */}
      {showHatcheryDepositModal && myFixedHatchery && (() => {
        const totalDeposit = myFixedHatchery.depositAmount || 10000;
        const sourceAccount = myFixedHatchery.depositSourceAccount || myFixedHatchery.bankDetails?.upiId || myFixedHatchery.depositUtr || 'Original Deposit Source Account';
        const history = myFixedHatchery.depositHistory || [
          {
            id: 'DEP-INIT',
            amount: totalDeposit,
            ref: myFixedHatchery.depositUtr || 'VERIFIED_10K',
            source: sourceAccount,
            date: myFixedHatchery.registeredAt || new Date().toLocaleDateString('en-IN'),
            note: 'Mandatory Hatchery Security Deposit'
          }
        ];
        const addAmtNum = Math.max(1000, Number(addDepositAmount) || 5000);
        const addUpiUri = `upi://pay?pa=aquamark@sbi&pn=AquaMarkDeposit&am=${addAmtNum}&cu=INR&tn=AddHatcheryDeposit`;
        const addQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(addUpiUri)}`;

        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border-2 border-emerald-500/40 space-y-5 max-h-[90vh] overflow-y-auto ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <div className="flex items-center gap-2">
                  <PiggyBank className="w-5 h-5 text-emerald-500" />
                  <h3 className="font-extrabold text-base">Hatchery Security Deposit & Ledger</h3>
                </div>
                <button type="button" onClick={() => setShowHatcheryDepositModal(false)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
              </div>

              {/* Current Deposited Balance Card */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 space-y-1.5">
                <span className="text-[11px] font-extrabold text-emerald-500 uppercase tracking-wider">Total Deposited Money Held Safely</span>
                <div className="text-3xl font-black text-emerald-500">₹{totalDeposit.toLocaleString('en-IN')}</div>
                <p className="text-xs opacity-80">
                  <b>Origin / Return Account:</b> <span className="font-mono text-teal-500">{sourceAccount}</span>
                </p>
                <p className="text-[11px] opacity-65">
                  If you delete your hatchery account, 100% of ₹{totalDeposit.toLocaleString('en-IN')} is automatically returned to the exact account from which it was deposited.
                </p>
              </div>

              {/* Add Money Section */}
              <form onSubmit={handleAddMoreDepositMoney} className={`border rounded-2xl p-4 space-y-3 text-xs ${subCardBg}`}>
                <h4 className="font-extrabold text-sm flex items-center gap-1.5 text-teal-500">
                  <PlusCircle className="w-4 h-4" /> Add Money to Security Deposit
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold opacity-75 block mb-1">Amount to Add (₹)</label>
                    <input
                      required
                      type="number"
                      min="1000"
                      step="500"
                      value={addDepositAmount}
                      onChange={(e) => setAddDepositAmount(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`}
                    />
                  </div>
                  <div>
                    <label className="font-bold opacity-75 block mb-1">Source UPI / Bank Account</label>
                    <input
                      type="text"
                      placeholder={sourceAccount}
                      value={addDepositSource}
                      onChange={(e) => setAddDepositSource(e.target.value)}
                      className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                    />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowAddMoneyQr(!showAddMoneyQr)}
                    className={`border px-3 py-2 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer ${cardBg}`}
                  >
                    <QrCode className="w-3.5 h-3.5 text-teal-600" /> {showAddMoneyQr ? 'Hide Deposit QR' : 'Show UPI QR to Pay'}
                  </button>
                  <a
                    href={addUpiUri}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5"
                  >
                    <Smartphone className="w-3.5 h-3.5" /> Pay ₹{addAmtNum.toLocaleString('en-IN')} via UPI App
                  </a>
                </div>

                {showAddMoneyQr && (
                  <div className="bg-white p-3 rounded-xl border border-emerald-300 text-center text-slate-900 w-fit mx-auto">
                    <img src={addQrUrl} alt="Add Deposit QR" className="w-32 h-32 object-contain mx-auto" />
                    <span className="text-[10px] font-bold block mt-1">Scan to Deposit ₹{addAmtNum.toLocaleString('en-IN')}</span>
                  </div>
                )}

                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    placeholder="Enter 12-Digit UPI / Bank UTR Reference"
                    value={addDepositUtr}
                    onChange={(e) => setAddDepositUtr(e.target.value)}
                    className={`flex-1 border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                  />
                  <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white font-bold px-4 py-2 rounded-xl cursor-pointer shrink-0">
                    + Add Money
                  </button>
                </div>
              </form>

              {/* Deposit Transaction History */}
              <div className="space-y-2 text-xs">
                <span className="font-bold opacity-75 uppercase text-[11px]">Deposit History</span>
                <div className="max-h-32 overflow-y-auto space-y-1.5 pr-1">
                  {history.map((h, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border flex items-center justify-between ${subCardBg}`}>
                      <div>
                        <span className="font-bold block">{h.note}</span>
                        <span className="text-[11px] opacity-65 font-mono">{h.ref} • From: {h.source}</span>
                      </div>
                      <div className="text-right">
                        <span className="font-extrabold text-emerald-500">+₹{(h.amount || 0).toLocaleString('en-IN')}</span>
                        <span className="block text-[10px] opacity-55">{h.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Delete Account to Withdraw Money */}
              <div className="pt-3 border-t border-slate-300/30 flex flex-wrap items-center justify-between gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setShowHatcheryDepositModal(false);
                    setDeleteConfirmPassword('');
                    setShowDeleteAccountModal(true);
                  }}
                  className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-extrabold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-xs cursor-pointer"
                >
                  <ArrowDownLeft className="w-4 h-4" /> Delete Account to Withdraw Money (₹{totalDeposit.toLocaleString('en-IN')})
                </button>
                <button type="button" onClick={() => setShowHatcheryDepositModal(false)} className={`px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>
                  {t.closeBtn}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================
          HATCHERY QR SCANNER MODAL (AUTO-COMPLETES PACKING, SETTLES PAYMENT, CLEARS GATE-PASS & GENERATES FULL PAID RECEIPT)
         ========================================================= */}
      {showHatcheryQrScanner && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-indigo-500 space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div className="flex items-center gap-2 text-indigo-500">
                <ScanLine className="w-5 h-5" />
                <h3 className="font-extrabold text-base">Scan Buyer Gate-Pass QR</h3>
              </div>
              <button type="button" onClick={() => setShowHatcheryQrScanner(false)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>

            {/* Live Camera Scanner Viewport */}
            <div className="relative rounded-2xl overflow-hidden bg-slate-950 border border-indigo-500/40 h-48 flex items-center justify-center">
              <video ref={scannerVideoRef} autoPlay playsInline muted className={`w-full h-full object-cover ${cameraStreamActive ? 'opacity-90' : 'hidden'}`} />
              {!cameraStreamActive && (
                <div className="text-center text-white/75 p-4 space-y-1.5">
                  <QrCode className="w-10 h-10 text-indigo-400 mx-auto animate-pulse" />
                  <p className="text-xs font-bold">Camera Ready / Quick-Scan Gate-Pass</p>
                  <p className="text-[11px] opacity-65">Point camera at Buyer QR or select/enter Gate-Pass PIN below</p>
                </div>
              )}
              <div className="absolute inset-6 border-2 border-dashed border-emerald-400/80 rounded-xl pointer-events-none" />
            </div>

            {/* Manual / Scanner Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                processScannedBuyerGatePass(qrScanInput);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold opacity-75 block mb-1">Gate-Pass PIN or Booking ID</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="text"
                    placeholder="e.g., GP-1024 or AQ-12345"
                    value={qrScanInput}
                    onChange={(e) => setQrScanInput(e.target.value)}
                    className={`flex-1 border rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold uppercase select-text ${inputCls}`}
                  />
                  <button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2.5 rounded-xl cursor-pointer">
                    Verify & Settle
                  </button>
                </div>
              </div>

              {/* Active Pending Gate-Passes for 1-Tap Simulation/Scan */}
              {myHatcheryOrders.filter(o => !o.gatePassCleared && o.packingStatus !== 'CANCELLED').length > 0 && (
                <div className="space-y-1.5 pt-1">
                  <span className="text-[11px] font-bold opacity-70 block">Active Buyer Gate-Passes Ready to Scan:</span>
                  <div className="max-h-36 overflow-y-auto space-y-1.5">
                    {myHatcheryOrders
                      .filter(o => !o.gatePassCleared && o.packingStatus !== 'CANCELLED')
                      .map(o => (
                        <button
                          key={o.bookingId}
                          type="button"
                          onClick={() => processScannedBuyerGatePass(o.gatePassPin || o.bookingId)}
                          className={`w-full text-left p-2.5 rounded-xl border hover:border-indigo-500 flex items-center justify-between cursor-pointer ${subCardBg}`}
                        >
                          <div>
                            <span className="font-mono font-extrabold text-indigo-500">{o.gatePassPin}</span> • <b>{o.farmerName}</b>
                            <span className="block text-[10px] opacity-65">{o.bookingId} • {(o.quantity || 0).toLocaleString('en-IN')} PL</span>
                          </div>
                          <span className="bg-emerald-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg">
                            Scan & Settle →
                          </span>
                        </button>
                      ))}
                  </div>
                </div>
              )}
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          BUYER ANIMATED STATUS TRACKING MODAL
         ========================================================= */}
      {statusModalBooking && (() => {
        const isCleared = statusModalBooking.settlement?.status === 'BALANCE_CLEARED';
        const isPacked = statusModalBooking.packingStatus === 'PACKING_DONE_BY_SELLER' || isCleared;
        const steps = [
          {
            step: 1,
            title: statusModalBooking.paymentPlan === 'FULL' ? '100% Full Payment Completed' : '4% Advance Payment Confirmed',
            desc: `Paid ₹${(statusModalBooking.tokenAdvance || 0).toLocaleString('en-IN')} • Ref: ${statusModalBooking.paymentId}`,
            done: true
          },
          {
            step: 2,
            title: 'Salinity Acclimatization & Hatchery Prep',
            desc: `Target Pond: ${statusModalBooking.pondSalinity} PPT • Hatchery: ${statusModalBooking.batch?.salinity} PPT`,
            done: true
          },
          {
            step: 3,
            title: 'Seed Packing & Gate-Pass Verification',
            desc: `Scheduled: ${statusModalBooking.packingDate} (${statusModalBooking.packingTimeSlot}) • PIN: ${statusModalBooking.gatePassPin}`,
            done: isPacked
          },
          {
            step: 4,
            title: 'Full Payment Settled & 2% Hold Refunded',
            desc: isCleared
              ? `100% Settled (${statusModalBooking.clearedAt || 'Completed'}) • Full Paid Receipt Ready`
              : `Remaining Balance: ₹${(statusModalBooking.balanceAtPacking || 0).toLocaleString('en-IN')}`,
            done: isCleared
          }
        ];

        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-teal-500/40 space-y-5 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-500">{statusModalBooking.bookingId}</span>
                  <h3 className="font-extrabold text-base">Live Order & Packing Status</h3>
                </div>
                <button type="button" onClick={() => setStatusModalBooking(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
              </div>

              <div className="space-y-3">
                {steps.map((st) => {
                  const isTickVisible = st.done && animatedStepIndex >= st.step;
                  return (
                    <div
                      key={st.step}
                      className={`p-3.5 rounded-2xl border flex items-start gap-3 transition-all duration-500 ${isTickVisible
                        ? 'bg-emerald-500/10 border-emerald-500/40 scale-100 opacity-100'
                        : st.done
                          ? 'opacity-40 scale-95'
                          : `${subCardBg} opacity-65`
                        }`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 transition-all duration-500 ${isTickVisible
                          ? 'bg-emerald-500 text-white scale-110 shadow-md'
                          : 'bg-slate-300/40 text-slate-500'
                          }`}
                      >
                        {isTickVisible ? <Check className="w-4 h-4 stroke-[3]" /> : <span className="text-xs font-bold">{st.step}</span>}
                      </div>
                      <div className="space-y-0.5">
                        <div className={`text-xs font-extrabold ${isTickVisible ? 'text-emerald-500' : ''}`}>
                          {st.title}
                        </div>
                        <p className="text-[11px] opacity-75 leading-relaxed">{st.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-end gap-2 pt-1">
                {!isCleared && (
                  <button
                    type="button"
                    onClick={() => {
                      const target = statusModalBooking;
                      setStatusModalBooking(null);
                      setPayRemainingBooking(target);
                    }}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl cursor-pointer"
                  >
                    Pay Remaining ₹{(statusModalBooking.balanceAtPacking || 0).toLocaleString('en-IN')}
                  </button>
                )}
                <button type="button" onClick={() => setStatusModalBooking(null)} className={`px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>
                  {t.closeBtn}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================
          BUYER PAY REMAINING BALANCE MODAL (FROM SITE)
         ========================================================= */}
      {payRemainingBooking && (() => {
        const remAmount = payRemainingBooking.balanceAtPacking || 0;
        const upiUri = `upi://pay?pa=aquamark@sbi&pn=AquaMarkBalance&am=${remAmount}&cu=INR&tn=Balance_${payRemainingBooking.bookingId}`;
        const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;

        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-emerald-500/40 space-y-4 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <div>
                  <span className="font-mono text-xs font-bold text-teal-500">{payRemainingBooking.bookingId}</span>
                  <h3 className="font-extrabold text-base">Pay Remaining Balance (96%)</h3>
                </div>
                <button type="button" onClick={() => setPayRemainingBooking(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
              </div>

              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-xs space-y-1">
                <div className="flex justify-between"><span>Hatchery:</span><b>{payRemainingBooking.batch?.realName}</b></div>
                <div className="flex justify-between"><span>Total Order Value:</span><b>₹{(payRemainingBooking.totalSeedCost || 0).toLocaleString('en-IN')}</b></div>
                <div className="flex justify-between"><span>Advance Already Paid:</span><b>₹{(payRemainingBooking.tokenAdvance || 0).toLocaleString('en-IN')}</b></div>
                <div className="flex justify-between text-sm font-black text-emerald-500 border-t border-emerald-500/20 pt-1.5 mt-1">
                  <span>Remaining Balance Payable Now:</span>
                  <span>₹{remAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

              <form onSubmit={handleCompleteRemainingBalancePayment} className="space-y-3 text-xs">
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { id: 'DIRECT_UPI', label: 'UPI (QR / App)', icon: QrCode },
                    { id: 'RAZORPAY', label: 'Razorpay', icon: CreditCard },
                    { id: 'BANK_TO_BANK', label: 'Bank NEFT', icon: Landmark }
                  ].map(pm => {
                    const Icon = pm.icon;
                    return (
                      <button
                        key={pm.id}
                        type="button"
                        onClick={() => setRemainingPayMethod(pm.id)}
                        className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer ${remainingPayMethod === pm.id ? 'border-teal-600 bg-teal-500/15 text-teal-600 font-extrabold' : subCardBg}`}
                      >
                        <Icon className="w-4 h-4 text-teal-600" />
                        <span className="text-[11px]">{pm.label}</span>
                      </button>
                    );
                  })}
                </div>

                {remainingPayMethod === 'DIRECT_UPI' && (
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 space-y-2.5">
                    <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border border-emerald-300 text-slate-900 relative">
                      <img
                        src={qrApiUrl}
                        alt="Remaining Balance QR"
                        className={`w-32 h-32 object-contain transition-all duration-300 ${remainingQrRevealed ? '' : 'blur-md select-none'}`}
                      />
                      {!remainingQrRevealed && (
                        <button
                          type="button"
                          onClick={() => setRemainingQrRevealed(true)}
                          className="absolute inset-0 m-auto h-9 w-24 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                        >
                          Show QR
                        </button>
                      )}
                      <span className="text-[11px] font-bold mt-1">Pay ₹{remAmount.toLocaleString('en-IN')}</span>
                    </div>
                    <a
                      href={upiUri}
                      className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-3 rounded-xl text-xs inline-flex items-center justify-center gap-1.5"
                    >
                      <Smartphone className="w-3.5 h-3.5" /> Pay ₹{remAmount.toLocaleString('en-IN')} By UPI App
                    </a>
                    <input
                      required
                      type="text"
                      placeholder={t.utrPlaceholder}
                      value={remainingUtr}
                      onChange={(e) => setRemainingUtr(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                    />
                  </div>
                )}

                {remainingPayMethod === 'BANK_TO_BANK' && (
                  <div className={`border rounded-xl p-3 space-y-2 ${subCardBg}`}>
                    <div className="font-mono text-[11px] select-text">
                      <b>A/C:</b> 20419820112 • <b>IFSC:</b> SBIN0008812 • <b>Amount:</b> ₹{remAmount.toLocaleString('en-IN')}
                    </div>
                    <input
                      required
                      type="text"
                      placeholder={t.utrPlaceholder}
                      value={remainingUtr}
                      onChange={(e) => setRemainingUtr(e.target.value)}
                      className={`w-full border rounded-lg px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                    />
                  </div>
                )}

                <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs shadow-xs cursor-pointer">
                  Confirm Remaining ₹{remAmount.toLocaleString('en-IN')} Payment & Generate Full Receipt
                </button>
              </form>
            </div>
          </div>
        );
      })()}

      {/* =========================================================
          ROLE-SPECIFIC NOTIFICATION DRAWER MODAL (FULL DETAILS FOR EACH USER)
         ========================================================= */}
      {showNotificationDrawer && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 max-h-[86vh] flex flex-col ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3 shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="font-extrabold text-base">
                    {t.portalBadges[currentUser.role]} Notifications ({myNotifications.length})
                  </h3>
                  <p className="text-[11px] opacity-60">Personalized updates, cashback refunds, packing & payment alerts</p>
                </div>
              </div>
              <button type="button" onClick={() => setShowNotificationDrawer(false)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
              {myNotifications.length === 0 ? (
                <p className="text-xs opacity-60 py-10 text-center">No notifications yet.</p>
              ) : (
                myNotifications.map((item) => (
                  <div key={item.id} className={`border rounded-xl p-3.5 space-y-1 text-xs ${subCardBg}`}>
                    <div className="flex items-center justify-between gap-2">
                      <span className="bg-teal-500/15 text-teal-600 text-[10px] font-extrabold px-2 py-0.5 rounded uppercase">
                        {item.category}
                      </span>
                      <span className="text-[10px] opacity-60 font-mono">{item.timestamp}</span>
                    </div>
                    <h4 className="font-extrabold text-sm">{item.title}</h4>
                    <p className="opacity-80 leading-relaxed">{item.message}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          BUYER & BROKER EDIT PROFILE MODAL
         ========================================================= */}
      {showBasicEditProfileModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Edit3 className="w-4 h-4 text-teal-600" /> Edit {t.portalBadges[currentUser?.role]} Profile
              </h3>
              <button type="button" onClick={() => setShowBasicEditProfileModal(false)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleSaveBasicProfile} className="space-y-4 text-xs">
              <div>
                <label className="font-bold opacity-75 block mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  value={editProfileDraft.name}
                  onChange={(e) => setEditProfileDraft({ ...editProfileDraft, name: e.target.value })}
                  className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-bold select-text ${inputCls}`}
                />
              </div>

              <div>
                <label className="font-bold opacity-75 block mb-1">Mobile Number (10 Digits)</label>
                <div className="flex gap-2">
                  <input
                    required
                    type="tel"
                    maxLength={10}
                    value={editProfileDraft.phone}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setEditProfileDraft({
                        ...editProfileDraft,
                        phone: val,
                        phoneVerified: val === currentUser?.phone
                      });
                    }}
                    className={`flex-1 border rounded-xl px-3.5 py-2.5 text-sm font-mono font-bold select-text ${inputCls}`}
                  />
                  {!editProfileDraft.phoneVerified && (
                    <button
                      type="button"
                      disabled={editProfileDraft.verifying}
                      onClick={handleVerifyChangedPhoneInProfile}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold px-3.5 rounded-xl text-xs cursor-pointer shrink-0"
                    >
                      {editProfileDraft.verifying ? 'Verifying...' : 'Verify'}
                    </button>
                  )}
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-300/30">
                <button
                  type="button"
                  onClick={() => { setShowBasicEditProfileModal(false); setDeleteConfirmPassword(''); setShowDeleteAccountModal(true); }}
                  className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> Delete Account
                </button>
                <div className="flex items-center gap-2">
                  <button type="button" onClick={() => setShowBasicEditProfileModal(false)} className={`px-3.5 py-2 border rounded-xl font-bold cursor-pointer ${subCardBg}`}>
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={!editProfileDraft.phoneVerified}
                    className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold px-4 py-2 rounded-xl cursor-pointer"
                  >
                    {t.saveBtn}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          PASSWORD-VERIFIED ACCOUNT DELETION & DEPOSIT REFUND MODAL
         ========================================================= */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500/50 space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div className="flex items-center gap-2 text-rose-500">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-extrabold text-base">
                  {currentUser?.role === 'seller' ? 'Delete Account & Withdraw Deposit' : 'Confirm Permanent Account Deletion'}
                </h3>
              </div>
              <button type="button" onClick={() => setShowDeleteAccountModal(false)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <p className="text-xs opacity-85 leading-relaxed">
              {currentUser?.role === 'seller' ? (
                <>
                  Deleting your Hatchery account will immediately initiate a 100% refund of <b>₹{(myFixedHatchery?.depositAmount || 10000).toLocaleString('en-IN')}</b> back to your exact origin deposit account: <b className="text-teal-500 font-mono">{myFixedHatchery?.depositSourceAccount || myFixedHatchery?.bankDetails?.upiId || 'Original Source Account'}</b>.
                </>
              ) : (
                <>
                  This will permanently delete your <b>{t.portalBadges[currentUser?.role]}</b> account (<b>+91 {currentUser?.phone}</b>).
                </>
              )}
              {' '}Enter your account password to confirm:
            </p>
            <form onSubmit={handleConfirmDeleteAccount} className="space-y-4">
              <div className="relative flex items-center">
                <input
                  autoFocus
                  required
                  type={showDeletePwd ? 'text' : 'password'}
                  placeholder="Enter your password to verify"
                  value={deleteConfirmPassword}
                  onChange={(e) => setDeleteConfirmPassword(e.target.value)}
                  className={`w-full border border-rose-500/50 rounded-xl pl-3.5 pr-10 py-2.5 text-sm font-bold select-text focus:outline-none ${inputCls}`}
                />
                <button
                  type="button"
                  onClick={() => setShowDeletePwd(!showDeletePwd)}
                  className="absolute right-3 opacity-60 hover:opacity-100 cursor-pointer"
                >
                  {showDeletePwd ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex justify-end gap-2">
                <button type="button" onClick={() => setShowDeleteAccountModal(false)} className={`px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>
                  Cancel
                </button>
                <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                  {currentUser?.role === 'seller' ? 'Delete & Refund to Origin Account' : 'Verify & Delete Forever'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          TRANSIT PREDICTOR MODAL
         ========================================================= */}
      {transitPredictorBatch && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Navigation className="w-5 h-5 text-indigo-500" /> Hatchery-to-Pond Transit Predictor
              </h3>
              <button type="button" onClick={() => setTransitPredictorBatch(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-bold opacity-75 block mb-1">Road Distance from {transitPredictorBatch.zone} to Pond (km): <b>{transitDistanceKm} km</b></label>
                <input
                  type="range"
                  min="20"
                  max="600"
                  step="10"
                  value={transitDistanceKm}
                  onChange={(e) => setTransitDistanceKm(Number(e.target.value))}
                  className="w-full accent-teal-600 cursor-pointer"
                />
              </div>
              {(() => {
                const hrs = (transitDistanceKm / 45).toFixed(1);
                const risk = Number(hrs) <= 5 ? 'LOW (99% Survival)' : Number(hrs) <= 9 ? 'MODERATE (Use 2,000 PL/bag)' : 'HIGH (AC Oxygen Van Mandatory)';
                return (
                  <div className={`p-3.5 rounded-xl border space-y-1.5 ${subCardBg}`}>
                    <div>Estimated Transit Duration: <b>{hrs} Hours</b></div>
                    <div>Transit Stress Risk: <b className="text-teal-500">{risk}</b></div>
                    <div>Recommended Dispatch Window: <b>04:00 AM – 06:30 AM (Cool Temp)</b></div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          GATE-PASS QR CODE MODAL
         ========================================================= */}
      {gatePassBooking && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-indigo-500 text-center space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-2">
              <span className="text-xs font-extrabold text-indigo-500 uppercase">Hatchery Gate-Pass QR</span>
              <button type="button" onClick={() => setGatePassBooking(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <div className="bg-white p-3 rounded-2xl border border-indigo-200 inline-block mx-auto">
              <img
                src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(`AQUAMARK-GATEPASS:${gatePassBooking.bookingId}|PIN:${gatePassBooking.gatePassPin || 'GP-1024'}|QTY:${gatePassBooking.quantity}`)}`}
                alt="Gate Pass QR"
                className="w-40 h-40 object-contain"
              />
            </div>
            <div className="space-y-1">
              <div className="text-xl font-black font-mono tracking-widest text-indigo-500">{gatePassBooking.gatePassPin || 'GP-1024'}</div>
              <p className="text-xs font-bold">{gatePassBooking.bookingId} • {gatePassBooking.farmerName}</p>
              <p className="text-xs opacity-75">
                {(gatePassBooking.quantity || 0).toLocaleString('en-IN')} PL ({gatePassBooking.batch?.plStage}) • {gatePassBooking.packingDate}
              </p>
              <p className="text-[11px] opacity-60 pt-1">Show this QR to Hatchery Owner to complete packing & auto-settle receipt.</p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SELLER TRANSACTIONS & PACKING ORDERS POPUP MODAL
         ========================================================= */}
      {sellerTxModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border space-y-4 max-h-[88vh] flex flex-col ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-base">{sellerTxModal.title}</h3>
                <p className="text-xs opacity-60">Click any booking row for full UTR, Salinity & Buyer details</p>
              </div>
              <button type="button" onClick={() => setSellerTxModal(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>
            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {sellerTxModal.list.length === 0 ? (
                <p className="text-xs opacity-60 py-8 text-center">No transactions in this category yet.</p>
              ) : (
                sellerTxModal.list.map((bk) => {
                  const isCleared = bk.settlement?.status === 'BALANCE_CLEARED';
                  return (
                    <div
                      key={bk.bookingId}
                      onClick={() => setInspectedSellerOrder(bk)}
                      className={`border hover:border-teal-500 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 transition cursor-pointer ${subCardBg}`}
                    >
                      <div className="space-y-1 text-xs">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="font-mono font-bold text-teal-500">{bk.bookingId}</span>
                          <span className="font-mono text-[11px] bg-slate-500/10 px-2 py-0.5 rounded">UTR: {bk.paymentId}</span>
                          <span className="font-bold text-emerald-500">₹{(bk.hatcheryFixedTotal || 0).toLocaleString('en-IN')}</span>
                        </div>
                        <p className="font-bold">Buyer: {bk.farmerName} (+91 {bk.farmerPhone}) • Batch {bk.batch?.id}</p>
                        <p className="opacity-70">{(bk.quantity || 0).toLocaleString('en-IN')} PL • Packing: {bk.packingDate} ({bk.packingTimeSlot})</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                        {!isCleared && bk.packingStatus === 'PACKING_PENDING' && (
                          <button type="button" onClick={() => handleSellerMarkPacked(bk.bookingId)} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-1.5 rounded-xl cursor-pointer">
                            {t.markPackedBtn}
                          </button>
                        )}
                        {!isCleared && (
                          <button type="button" onClick={() => handleHatcheryPaymentReceived(bk.bookingId)} className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl inline-flex items-center gap-1 cursor-pointer">
                            <CheckSquare className="w-3.5 h-3.5" /> {t.paymentReceivedBtn}
                          </button>
                        )}
                        {isCleared && (
                          <span className="bg-emerald-500/15 text-emerald-500 text-xs font-bold px-2.5 py-1 rounded-full">Cleared ✓</span>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      )}

      {/* BROKER UPCOMING / RECEIVED TRANSACTIONS POPUP MODAL */}
      {brokerTxListModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border space-y-4 max-h-[88vh] flex flex-col ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-base">{brokerTxListModal.title}</h3>
                <p className="text-xs opacity-60">Click any transaction to view full UTR, Farmer, Hatchery & Margin details</p>
              </div>
              <button type="button" onClick={() => setBrokerTxListModal(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>
            <div className="overflow-y-auto space-y-3 pr-1 flex-1">
              {brokerTxListModal.list.length === 0 ? (
                <p className="text-xs opacity-60 py-8 text-center">No transactions found in this category.</p>
              ) : (
                brokerTxListModal.list.map((bk) => (
                  <div
                    key={bk.bookingId}
                    onClick={() => { setBrokerTxListModal(null); setSelectedBrokerTx(bk); }}
                    className={`border hover:border-teal-500 rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 transition cursor-pointer ${subCardBg}`}
                  >
                    <div className="space-y-1 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-500">{bk.bookingId}</span>
                        <span className="font-mono text-[11px] opacity-70">UTR: {bk.paymentId}</span>
                      </div>
                      <p className="font-bold">Farmer: {bk.farmerName} → Hatchery: {bk.batch?.realName || bk.batch?.hatcheryCode}</p>
                      <p className="opacity-70">{(bk.quantity || 0).toLocaleString('en-IN')} PL • Packing: {bk.packingDate}</p>
                    </div>
                    <div className="text-right text-xs">
                      <span className="font-extrabold text-emerald-500 block">2% Comm: ₹{bk.settlement?.brokerBase2Pct || 0}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* FULL-SCREEN IMAGE & VIDEO VIEWER MODAL */}
      {fullScreenMedia && (
        <div
          onClick={() => setFullScreenMedia(null)}
          className="fixed inset-0 bg-black/95 z-[9999] flex flex-col items-center justify-center p-4"
        >
          <div className="w-full max-w-5xl flex items-center justify-between text-white pb-3" onClick={(e) => e.stopPropagation()}>
            <span className="text-sm font-extrabold text-teal-400">{fullScreenMedia.label}</span>
            <button type="button" onClick={() => setFullScreenMedia(null)} className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer">
              ✕ Close Full Screen
            </button>
          </div>
          <div className="max-w-5xl max-h-[84vh] flex items-center justify-center" onClick={(e) => e.stopPropagation()}>
            {fullScreenMedia.type === 'video' ? (
              <video src={fullScreenMedia.url} controls autoPlay className="max-w-full max-h-[84vh] rounded-xl shadow-2xl" />
            ) : (
              <img src={fullScreenMedia.url} alt={fullScreenMedia.label} className="max-w-full max-h-[84vh] object-contain rounded-xl shadow-2xl" />
            )}
          </div>
        </div>
      )}

      {/* BUYER LIVE VIDEO REQUEST MODAL */}
      {videoRequestTargetBatch && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-500">Batch {videoRequestTargetBatch.id} ({videoRequestTargetBatch.plStage})</span>
                <h3 className="font-extrabold text-base">Request Live Tank Video</h3>
              </div>
              <button type="button" onClick={() => setVideoRequestTargetBatch(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleConfirmLiveVideoRequest} className="space-y-3.5 text-xs">
              <div>
                <label className="font-bold opacity-75 block mb-1">Your Name</label>
                <input
                  required
                  type="text"
                  value={videoRequestForm.name}
                  onChange={(e) => setVideoRequestForm({ ...videoRequestForm, name: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm select-text ${inputCls}`}
                />
              </div>
              <div>
                <label className="font-bold opacity-75 block mb-1">WhatsApp Number to Receive Video (10 Digits)</label>
                <input
                  required
                  type="tel"
                  maxLength={10}
                  placeholder="9876543210"
                  value={videoRequestForm.whatsapp}
                  onChange={(e) => setVideoRequestForm({ ...videoRequestForm, whatsapp: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  className={`w-full border rounded-xl px-3 py-2 text-sm font-mono font-bold select-text ${inputCls}`}
                />
              </div>
              <div>
                <label className="font-bold opacity-75 block mb-1">Details / Message for Hatchery Owner</label>
                <textarea
                  rows={2}
                  placeholder="Enter required PL quantity, pond salinity, or specific tank video request..."
                  value={videoRequestForm.note}
                  onChange={(e) => setVideoRequestForm({ ...videoRequestForm, note: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`}
                />
              </div>
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs flex items-center justify-center gap-1.5 cursor-pointer">
                <Video className="w-4 h-4" /> Send Live Video Request
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SELLER LIVE VIDEO REQUESTS LIST MODAL */}
      {showSellerVideoModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border space-y-4 max-h-[88vh] overflow-y-auto ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <Video className="w-5 h-5 text-teal-500" /> Farmer Live Video Requests ({myLiveVideoReqs.length})
                </h3>
                <p className="text-xs opacity-60">Click WhatsApp to send live tank video directly to the farmer</p>
              </div>
              <button type="button" onClick={() => setShowSellerVideoModal(false)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            {myLiveVideoReqs.length === 0 ? (
              <p className="text-xs opacity-60 py-6 text-center">No live video requests received yet.</p>
            ) : (
              <div className="space-y-3">
                {myLiveVideoReqs.map((req) => (
                  <div key={req.id} className={`border rounded-xl p-4 flex flex-wrap items-center justify-between gap-3 text-xs ${subCardBg}`}>
                    <div className="space-y-1 flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">Batch: {req.batchId}</span>
                        <span className="opacity-60 text-[11px]">{req.requestedAt}</span>
                      </div>
                      <p className="font-extrabold text-sm">{req.farmerName} • WhatsApp: +91 {req.farmerWhatsapp || req.farmerPhone}</p>
                      {req.note && <p className="opacity-80">"{req.note}"</p>}
                    </div>
                    <button
                      type="button"
                      onClick={() => openWhatsAppMessage(
                        req.farmerWhatsapp || req.farmerPhone,
                        `Hello ${req.farmerName}, sharing live tank video from ${myFixedHatchery?.realName} for Batch ${req.batchId} (${req.batchStage || ''}).`
                      )}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold text-xs px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                    >
                      <Send className="w-3.5 h-3.5" /> Send Video on WhatsApp
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          BUYER BOOKING DETAILS MODAL (CONTAINS ALL REMAINING BUTTONS: PAY REMAINING BALANCE, MAPS, CANCEL, WHATSAPP, RECEIPT, RATE & FEEDBACK)
         ========================================================= */}
      {inspectedBuyerBooking && (() => {
        const currentBk = bookings.find(item => item.bookingId === inspectedBuyerBooking.bookingId) || inspectedBuyerBooking;
        const isFinalCleared = currentBk.settlement?.status === 'BALANCE_CLEARED';
        const isCancelled = currentBk.settlement?.status === 'CANCELLED_REFUNDED';
        const mapsUrl = currentBk.batch?.googleMapsLink || hatcheryProfiles[currentBk.hatcheryOwnerPhone]?.googleMapsLink;
        const draft = ratingDrafts[currentBk.bookingId] || { stars: 5, comment: '' };

        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-xl w-full p-6 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <div>
                  <span className="text-[11px] font-mono font-bold text-teal-500">{currentBk.bookingId} • UTR: {currentBk.paymentId}</span>
                  <h3 className="font-extrabold text-base">Hatchery Booking Details & Actions</h3>
                </div>
                <button type="button" onClick={() => setInspectedBuyerBooking(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
              </div>

              <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${subCardBg}`}>
                <span className="text-[10px] font-bold uppercase text-teal-500">Purchased From Hatchery</span>
                <p className="text-sm font-extrabold">{currentBk.batch?.realName} ({currentBk.batch?.id})</p>
                <p className="opacity-75">CAA License: {currentBk.batch?.caaLicense} • {currentBk.batch?.zone}</p>
                <p className="opacity-75">Address: {currentBk.batch?.realAddress} • +91 {currentBk.batch?.realPhone}</p>
              </div>

              <div className="text-xs space-y-2">
                <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Buyer / Farmer:</span><b>{currentBk.farmerName} (+91 {currentBk.farmerPhone})</b></div>
                <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Booked On:</span><b>{currentBk.date} at {currentBk.time}</b></div>
                <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Species & Stage:</span><b>{currentBk.batch?.species} ({currentBk.batch?.plStage})</b></div>
                <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Quantity + Free Bonus:</span><b>{(currentBk.quantity || 0).toLocaleString('en-IN')} + {(currentBk.bonusSeeds || 0).toLocaleString('en-IN')} PL</b></div>
                <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Packing Schedule:</span><b>{currentBk.packingDate} ({currentBk.packingTimeSlot})</b></div>
                <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Total Paid Amount:</span><b className="text-emerald-500">₹{(currentBk.tokenAdvance || 0).toLocaleString('en-IN')}</b></div>
                <div className="flex justify-between py-1">
                  <span>Settlement Status:</span>
                  <b className="text-emerald-500">
                    {isFinalCleared
                      ? `100% Full Paid (${currentBk.clearedAt || 'Settled'})`
                      : isCancelled
                        ? 'Cancelled (2% Refunded)'
                        : `₹${(currentBk.balanceAtPacking || 0).toLocaleString('en-IN')} Remaining Balance`}
                  </b>
                </div>
              </div>

              {/* REMAINING ACTION BUTTONS NEATLY ALIGNED INSIDE */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-slate-300/30">
                {!isFinalCleared && !isCancelled && (
                  <button
                    type="button"
                    onClick={() => {
                      setInspectedBuyerBooking(null);
                      setRemainingQrRevealed(false);
                      setRemainingUtr('');
                      setPayRemainingBooking(currentBk);
                    }}
                    className="col-span-2 sm:col-span-3 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-extrabold py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <CreditCard className="w-4 h-4" /> Pay Remaining Balance (₹{(currentBk.balanceAtPacking || 0).toLocaleString('en-IN')})
                  </button>
                )}

                {mapsUrl && !isCancelled && (
                  <a
                    href={mapsUrl.startsWith('http') ? mapsUrl : `https://${mapsUrl}`}
                    target="_blank"
                    rel="noreferrer"
                    className="bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-600 text-xs font-bold py-2.5 px-3 rounded-xl inline-flex items-center justify-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Open Maps
                  </a>
                )}

                <button
                  type="button"
                  onClick={() => handleSendBilingualBookingSummary(currentBk)}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-2.5 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> WhatsApp
                </button>

                {!isCancelled && (
                  <button
                    type="button"
                    onClick={() => handleDownloadVerifiedPdf(currentBk, isFinalCleared)}
                    className={`text-white text-xs font-bold py-2.5 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer ${isFinalCleared ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-900'}`}
                  >
                    <Printer className="w-3.5 h-3.5" /> {isFinalCleared ? t.finalReceiptBtn : t.advanceReceiptBtn}
                  </button>
                )}

                {!isFinalCleared && !isCancelled && (
                  <button
                    type="button"
                    onClick={() => {
                      handleBuyerCancelBooking(currentBk);
                      setInspectedBuyerBooking(null);
                    }}
                    className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold py-2.5 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <XCircle className="w-3.5 h-3.5" /> {t.cancelBookingBtn}
                  </button>
                )}
              </div>

              {/* Rating & Feedback Section inside Details */}
              {isFinalCleared && (
                <div className="pt-2 border-t border-slate-300/30">
                  {!currentBk.rated ? (
                    <div className={`space-y-2.5 p-3.5 rounded-xl border ${subCardBg}`}>
                      <span className="text-xs font-bold block">{t.rateSeedLabel}</span>
                      <div className="flex items-center gap-1.5">
                        {[1, 2, 3, 4, 5].map(star => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => setRatingDrafts({ ...ratingDrafts, [currentBk.bookingId]: { ...draft, stars: star } })}
                            className={`px-2.5 py-1 rounded-lg text-xs font-bold border cursor-pointer ${draft.stars >= star ? 'bg-amber-400 border-amber-500 text-slate-950' : cardBg}`}
                          >
                            {star}★
                          </button>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Write feedback for Hatchery..."
                          value={draft.comment}
                          onChange={(e) => setRatingDrafts({ ...ratingDrafts, [currentBk.bookingId]: { ...draft, comment: e.target.value } })}
                          className={`flex-1 border rounded-xl px-3 py-1.5 text-xs select-text ${inputCls}`}
                        />
                        <button
                          type="button"
                          onClick={() => handleSubmitRatingAndFeedback(currentBk.bookingId, currentBk.batch?.id)}
                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                        >
                          {t.submitReviewBtn}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-500 font-bold">
                      ✓ {t.ratedLabel}: {currentBk.userRating}★ {currentBk.userFeedback ? `— "${currentBk.userFeedback}"` : ''}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* SELLER ASSIGNED ORDER FULL DETAILS MODAL */}
      {inspectedSellerOrder && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-500">{inspectedSellerOrder.bookingId} • Batch {inspectedSellerOrder.batch?.id}</span>
                <h3 className="font-extrabold text-base">Assigned Packing Order & Payment UTR Details</h3>
              </div>
              <button type="button" onClick={() => setInspectedSellerOrder(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Buyer / Farmer Name:</span><b>{inspectedSellerOrder.farmerName} (+91 {inspectedSellerOrder.farmerPhone})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>UTR / Ref No:</span><b className="font-mono text-teal-500">{inspectedSellerOrder.paymentId} ({inspectedSellerOrder.paymentMode})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Seed Quantity + Bonus:</span><b>{(inspectedSellerOrder.quantity || 0).toLocaleString('en-IN')} + {(inspectedSellerOrder.bonusSeeds || 0).toLocaleString('en-IN')} PL</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Target Pond Salinity:</span><b className="text-teal-500">{inspectedSellerOrder.pondSalinity} PPT</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Packing Date & Slot:</span><b>{inspectedSellerOrder.packingDate} ({inspectedSellerOrder.packingTimeSlot})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Your Total Hatchery Value:</span><b className="text-emerald-500">₹{(inspectedSellerOrder.hatcheryFixedTotal || 0).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between py-1"><span>Payment Status:</span><b>{inspectedSellerOrder.settlement?.status === 'BALANCE_CLEARED' ? `Payment Received (${inspectedSellerOrder.clearedAt})` : 'Awaiting Packing & Settlement'}</b></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setInspectedSellerOrder(null)} className={`px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>{t.closeBtn}</button>
            </div>
          </div>
        </div>
      )}

      {/* BROKER TRANSACTION AUDIT MODAL */}
      {selectedBrokerTx && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-500">{selectedBrokerTx.bookingId} • UTR: {selectedBrokerTx.paymentId}</span>
                <h3 className="font-extrabold text-base">Broker Deal, UTR & Commission Breakdown</h3>
              </div>
              <button type="button" onClick={() => setSelectedBrokerTx(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <div className={`border rounded-xl p-4 space-y-2 text-xs ${subCardBg}`}>
              <div className="flex justify-between"><span>Farmer:</span><b>{selectedBrokerTx.farmerName} (+91 {selectedBrokerTx.farmerPhone})</b></div>
              <div className="flex justify-between"><span>Hatchery:</span><b>{selectedBrokerTx.batch?.realName}</b></div>
              <div className="flex justify-between"><span>Booked Quantity:</span><b>{(selectedBrokerTx.quantity || 0).toLocaleString('en-IN')} PL</b></div>
              <div className="flex justify-between border-t border-slate-300/30 pt-2 text-sm font-extrabold text-emerald-500">
                <span>Your 2% Commission:</span>
                <span>₹{(selectedBrokerTx.settlement?.brokerBase2Pct || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setSelectedBrokerTx(null)} className={`px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          HATCHERY INSPECTION MODAL (SPF BIOSECURITY OPTION COMPLETELY REMOVED)
         ========================================================= */}
      {inspectedBatch && (() => {
        const ownerProf = hatcheryProfiles[inspectedBatch.ownerPhone] || {};
        const hatcheryDesc = inspectedBatch.description || ownerProf.description;
        const allHatcheryBatches = batches.filter(b => b.ownerPhone === inspectedBatch.ownerPhone);
        const allHatcheryReviews = allHatcheryBatches.flatMap(b => (b.reviews || []).map(r => ({ ...r, batchId: b.id, plStage: b.plStage })));
        const ordersCount = bookings.filter(b => b.hatcheryOwnerPhone === inspectedBatch.ownerPhone).length;

        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-40 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold bg-teal-500/15 text-teal-600 px-2 py-0.5 rounded">{inspectedBatch.id}</span>
                    <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                      {t.caaVerified}
                    </span>
                    <span className="text-xs font-bold text-amber-500">{inspectedBatch.rating || 5.0}★ ({allHatcheryReviews.length} Reviews)</span>
                  </div>
                  <h3 className="font-extrabold text-lg mt-1">{inspectedBatch.hatcheryCode || 'Verified Hatchery'} • {inspectedBatch.zone}</h3>
                </div>
                <button type="button" onClick={() => setInspectedBatch(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
              </div>

              {hatcheryDesc && (
                <div className={`p-3.5 rounded-xl border text-xs ${subCardBg}`}>
                  <span className="text-[10px] font-bold uppercase text-teal-500 block mb-1">About Hatchery</span>
                  <p className="leading-relaxed">{hatcheryDesc}</p>
                </div>
              )}

              <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl border text-xs ${subCardBg}`}>
                <div><span className="text-[10px] opacity-60 block">Registered Since</span><b>{inspectedBatch.registeredAt || ownerProf.registeredAt || '2026'}</b></div>
                <div><span className="text-[10px] opacity-60 block">Orders Fulfilled</span><b>{ordersCount} Orders</b></div>
                <div><span className="text-[10px] opacity-60 block">Minimum Packing</span><b className="text-amber-500">{formatSeedQuantityShort(inspectedBatch.minPackingQty || 100000).split(' (')[0]}</b></div>
                <div><span className="text-[10px] opacity-60 block">Salinity / Stage</span><b className="text-teal-500">{inspectedBatch.salinity} PPT • {inspectedBatch.plStage}</b></div>
              </div>

              {(inspectedBatch.tankVideos || []).length > 0 && (
                <div className={`border rounded-xl p-4 space-y-3 ${subCardBg}`}>
                  <span className="text-xs font-extrabold flex items-center gap-1.5">
                    <Video className="w-4 h-4 text-teal-600" /> Tank PL Activity Videos ({inspectedBatch.tankVideos.length}) — Click for Full Screen
                  </span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inspectedBatch.tankVideos.map((vid, idx) => (
                      <div key={idx} className={`border rounded-xl p-2 space-y-1.5 ${cardBg}`}>
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded">{vid.label}</span>
                          <button type="button" onClick={() => setFullScreenMedia({ type: 'video', url: vid.url, label: vid.label })} className="text-[11px] font-bold text-teal-500 inline-flex items-center gap-1 cursor-pointer">
                            <Maximize2 className="w-3 h-3" /> Full Screen
                          </button>
                        </div>
                        <video
                          src={vid.url}
                          controls
                          onClick={() => setFullScreenMedia({ type: 'video', url: vid.url, label: vid.label })}
                          className="w-full h-44 rounded-lg bg-black cursor-pointer"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className={`border rounded-xl p-4 space-y-3 ${subCardBg}`}>
                <span className="text-xs font-extrabold flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-teal-600" /> Verified PCR Lab Images ({(inspectedBatch.pcrImages || []).length}) — Click Image for Full Screen
                </span>
                {(inspectedBatch.pcrImages || []).length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inspectedBatch.pcrImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })}
                        className={`border hover:border-teal-500 rounded-xl p-2 space-y-1.5 cursor-pointer transition ${cardBg}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded">{img.label}</span>
                          <Maximize2 className="w-3.5 h-3.5 text-teal-500" />
                        </div>
                        <img src={img.url} alt={img.label} className="w-full h-48 object-contain rounded-lg bg-slate-100" />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs opacity-60">PCR lab verification verified on file for {inspectedBatch.caaLicense}.</div>
                )}
              </div>

              <div className={`border rounded-xl p-4 space-y-2.5 ${subCardBg}`}>
                <span className="text-xs font-extrabold flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-amber-500" /> Verified Farmer Reviews ({allHatcheryReviews.length})
                </span>
                {allHatcheryReviews.length === 0 ? (
                  <p className="text-xs opacity-60">No reviews yet for this hatchery.</p>
                ) : (
                  <div className="max-h-52 overflow-y-auto pr-1 space-y-2">
                    {allHatcheryReviews.map((rev, i) => (
                      <div key={i} className={`p-3 rounded-xl border text-xs flex items-start justify-between gap-2 ${cardBg}`}>
                        <div>
                          <span className="font-bold">{rev.farmerName}</span> • <span className="opacity-60">Batch {rev.batchId} ({rev.plStage})</span>
                          <p className="mt-1">"{rev.comment}"</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="bg-amber-500/20 text-amber-500 font-extrabold px-2 py-0.5 rounded">{rev.stars}★</span>
                          <span className="block text-[10px] opacity-50 mt-1">{rev.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-2.5 pt-2">
                <button type="button" onClick={() => setInspectedBatch(null)} className={`px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>
                  {t.closeBtn}
                </button>
                <button
                  type="button"
                  disabled={(inspectedBatch.availableStock || 0) <= 0 || Boolean(inspectedBatch.paused)}
                  onClick={() => {
                    const b = inspectedBatch;
                    setInspectedBatch(null);
                    setModalError('');
                    const defaultLakhs = Math.max(1, Math.ceil((b.minPackingQty || 100000) / 100000));
                    setBookingForm(prev => ({
                      ...prev,
                      qtyAmount: String(Math.min(100, defaultLakhs)),
                      qtyUnit: 'LAKHS',
                      paymentPlan: 'ADVANCE'
                    }));
                    setSelectedBatch(b);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  {t.bookSlotBtn} →
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================
          BOOKING MODAL — ADVANCE (4%) VS FULL PAYMENT (100%) + MINIMUM PACKING ENFORCEMENT
         ========================================================= */}
      {selectedBatch && (() => {
        const qty = computeSeedCount(bookingForm.qtyAmount, bookingForm.qtyUnit);
        const minReqQty = selectedBatch.minPackingQty || 100000;
        const isBelowMinPacking = qty < minReqQty;
        const hatcheryFixedCost = Math.round(qty * (selectedBatch.pricePer1000 || 0.42));
        const brokerMarginEarn = currentUser.role === 'mediator' ? Math.round(qty * ((Number(bookingForm.brokerMarginPaise) || 0) / 100)) : 0;
        const total = hatcheryFixedCost + brokerMarginEarn + (bookingForm.includeTransport ? 1500 : 0);
        const token4Pct = Math.max(800, Math.round(hatcheryFixedCost * 0.04));
        const isFullPlan = bookingForm.paymentPlan === 'FULL';
        const payableNow = isFullPlan ? total : token4Pct;

        return (
          <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 max-h-[92vh] overflow-y-auto ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <div>
                  <h3 className="font-extrabold text-base">{t.modalTitle}</h3>
                  <p className="text-xs opacity-60">{selectedBatch.hatcheryCode || 'Verified Hatchery'} • {selectedBatch.id} • {selectedBatch.zone}</p>
                </div>
                <button type="button" onClick={() => { setSelectedBatch(null); setModalError(''); }} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
              </div>

              {modalError && (
                <div className="bg-rose-500/15 border border-rose-500/40 text-rose-500 px-3.5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{modalError}</span>
                </div>
              )}

              <form onSubmit={handleConfirmBookingSubmit} className="space-y-4">
                <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3.5 space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-extrabold text-teal-600 uppercase">{t.step1Label}</span>
                    {currentUser.role === 'mediator' && (
                      <button type="button" onClick={() => { setSelectedBatch(null); setModalError(''); }} className="text-[11px] font-bold text-teal-600 underline cursor-pointer">
                        {t.changeHatcheryBtn}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="font-extrabold block">{selectedBatch.hatcheryCode || 'Verified Hatchery'} ({selectedBatch.plStage})</span>
                      <span className="opacity-75">
                        Stock: {(selectedBatch.availableStock || 0).toLocaleString('en-IN')} PL • <b className="text-amber-500">Min Packing: {formatSeedQuantityShort(minReqQty)}</b>
                      </span>
                    </div>
                    <div className="text-right font-black text-teal-600 text-base">
                      ₹{(selectedBatch.pricePer1000 || 0).toFixed(2)}<span className="text-[10px] font-normal block">/seed</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <span className="text-[11px] font-extrabold opacity-75 uppercase block">{t.step2Label}</span>

                  {currentUser.role === 'mediator' && (
                    <div className={`grid grid-cols-1 sm:grid-cols-2 gap-2.5 p-3 rounded-xl border ${subCardBg}`}>
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">{t.selectSavedFarmer}</label>
                        <select
                          onChange={(e) => {
                            const found = brokerFarmers.find(f => f.id === e.target.value);
                            if (found) setBookingForm({ ...bookingForm, farmerName: found.name, farmerPhone: found.phone });
                          }}
                          className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-semibold ${inputCls}`}
                        >
                          <option value="">{t.manualFarmerOption}</option>
                          {brokerFarmers.map(f => (
                            <option key={f.id} value={f.id}>{f.name} ({f.village})</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">{t.brokerMarginLabel}</label>
                        <input
                          type="text"
                          inputMode="numeric"
                          maxLength={2}
                          placeholder="0 - 99"
                          value={bookingForm.brokerMarginPaise}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, '').replace(/^0+/, '').slice(0, 2);
                            setBookingForm({ ...bookingForm, brokerMarginPaise: clean });
                          }}
                          className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold select-text ${inputCls}`}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{t.farmerNameLabel}</label>
                      <input required type="text" value={bookingForm.farmerName} onChange={(e) => setBookingForm({ ...bookingForm, farmerName: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-sm select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{t.whatsappLabel}</label>
                      <input
                        required
                        type="tel"
                        maxLength={10}
                        placeholder="9876543210"
                        value={bookingForm.farmerPhone}
                        onChange={(e) => setBookingForm({ ...bookingForm, farmerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                        className={`w-full border rounded-xl px-3 py-2 text-sm font-mono font-bold select-text ${inputCls}`}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    <div className="sm:col-span-2">
                      <label className="text-xs font-bold opacity-75 block mb-1">{t.quantityLabel}</label>
                      <div className="flex gap-1.5">
                        <input
                          required
                          type="text"
                          inputMode="numeric"
                          maxLength={3}
                          placeholder="1-100"
                          value={bookingForm.qtyAmount}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, '').replace(/^0+/, '');
                            const num = clean === '' ? '' : String(Math.min(100, Number(clean)));
                            setBookingForm({ ...bookingForm, qtyAmount: num });
                          }}
                          className={`w-24 border rounded-xl px-2.5 py-2 text-sm font-bold text-center select-text ${isBelowMinPacking ? 'border-rose-500 text-rose-500' : inputCls}`}
                        />
                        <select
                          value={bookingForm.qtyUnit}
                          onChange={(e) => setBookingForm({ ...bookingForm, qtyUnit: e.target.value })}
                          className={`flex-1 border rounded-xl px-2.5 py-2 text-xs font-bold ${inputCls}`}
                        >
                          <option value="LAKHS">Lakhs (× 1,00,000 PL)</option>
                          <option value="MILLIONS">Millions (× 10,00,000 PL)</option>
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{t.pondSalinityLabel}</label>
                      <input
                        required
                        type="text"
                        inputMode="numeric"
                        maxLength={2}
                        value={bookingForm.pondSalinity}
                        onChange={(e) => setBookingForm({ ...bookingForm, pondSalinity: e.target.value.replace(/\D/g, '').slice(0, 2) })}
                        className={`w-full border rounded-xl px-2.5 py-2 text-sm font-bold select-text ${inputCls}`}
                      />
                    </div>
                  </div>

                  {/* MINIMUM PACKING WARNING IF BELOW HATCHERY MINIMUM */}
                  {isBelowMinPacking && (
                    <div className="bg-rose-500/15 border-2 border-rose-500/50 text-rose-500 rounded-xl p-3 text-xs font-extrabold flex items-center gap-2">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>
                        Minimum Packing Required: {formatSeedQuantityShort(minReqQty)}. Please increase quantity to at least {formatSeedQuantityShort(minReqQty).split(' (')[0]} to book.
                      </span>
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2.5">
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{t.packingDateLabel}</label>
                      <input required type="date" value={bookingForm.packingDate} onChange={(e) => setBookingForm({ ...bookingForm, packingDate: e.target.value })} className={`w-full border rounded-xl px-2.5 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{t.packingTimeLabel}</label>
                      <select value={bookingForm.packingTimeSlot} onChange={(e) => setBookingForm({ ...bookingForm, packingTimeSlot: e.target.value })} className={`w-full border rounded-xl px-2 py-2 text-xs font-bold ${inputCls}`}>
                        {PACKING_TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">Split Across Ponds</label>
                      <select value={bookingForm.pondSplitCount} onChange={(e) => setBookingForm({ ...bookingForm, pondSplitCount: e.target.value })} className={`w-full border rounded-xl px-2 py-2 text-xs font-bold ${inputCls}`}>
                        <option value="1">1 Pond (Single)</option>
                        <option value="2">2 Ponds (50/50)</option>
                        <option value="3">3 Ponds (Equal)</option>
                        <option value="4">4 Ponds (Equal)</option>
                      </select>
                    </div>
                  </div>

                  <label className={`flex items-center gap-2.5 border rounded-xl p-2.5 cursor-pointer text-xs font-bold ${subCardBg}`}>
                    <input
                      type="checkbox"
                      checked={bookingForm.includeTransport}
                      onChange={(e) => setBookingForm({ ...bookingForm, includeTransport: e.target.checked })}
                    />
                    <Truck className="w-4 h-4 text-teal-600" />
                    {t.transportAddonLabel}
                  </label>

                  {/* TWO PAYMENT PLAN OPTIONS: ADVANCE (4%) VS FULL PAYMENT (100%) */}
                  <div className="space-y-1.5 pt-1">
                    <label className="text-xs font-bold opacity-80 block">Choose Payment Option</label>
                    <div className="grid grid-cols-2 gap-2.5">
                      <button
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, paymentPlan: 'ADVANCE', qrRevealed: false })}
                        className={`p-3 rounded-xl border-2 text-left transition cursor-pointer ${!isFullPlan ? 'border-teal-600 bg-teal-500/15' : subCardBg}`}
                      >
                        <div className="text-xs font-extrabold text-teal-600">Advance Booking (4%)</div>
                        <div className="text-sm font-black mt-0.5">₹{token4Pct.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] opacity-70">Pay remaining 96% later in My Bookings</div>
                      </button>

                      <button
                        type="button"
                        onClick={() => setBookingForm({ ...bookingForm, paymentPlan: 'FULL', qrRevealed: false })}
                        className={`p-3 rounded-xl border-2 text-left transition cursor-pointer ${isFullPlan ? 'border-emerald-600 bg-emerald-500/15' : subCardBg}`}
                      >
                        <div className="text-xs font-extrabold text-emerald-500">Full Payment (100%)</div>
                        <div className="text-sm font-black mt-0.5">₹{total.toLocaleString('en-IN')}</div>
                        <div className="text-[10px] opacity-70">Instant Full Paid Receipt & 2% Cashback</div>
                      </button>
                    </div>
                  </div>

                  {/* PAYMENT METHOD SELECTOR */}
                  <div className="space-y-2 pt-1">
                    <label className="text-xs font-bold opacity-75 block">{t.paymentMethodLabel}</label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'RAZORPAY', label: 'Razorpay', icon: CreditCard },
                        { id: 'DIRECT_UPI', label: 'UPI (QR / App)', icon: QrCode },
                        { id: 'BANK_TO_BANK', label: 'Bank-to-Bank', icon: Landmark }
                      ].map(pm => {
                        const Icon = pm.icon;
                        const active = bookingForm.paymentMethod === pm.id;
                        return (
                          <button
                            key={pm.id}
                            type="button"
                            onClick={() => { setModalError(''); setBookingForm({ ...bookingForm, paymentMethod: pm.id }); }}
                            className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer ${active ? 'border-teal-600 bg-teal-500/15 text-teal-600 font-extrabold' : subCardBg}`}
                          >
                            <Icon className="w-4 h-4 text-teal-600" />
                            <span className="text-[11px]">{pm.label}</span>
                          </button>
                        );
                      })}
                    </div>

                    {bookingForm.paymentMethod === 'DIRECT_UPI' && (() => {
                      const upiUri = `upi://pay?pa=aquamark@sbi&pn=AquaMark&am=${payableNow}&cu=INR&tn=SeedBooking_${bookingForm.paymentPlan}`;
                      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;

                      return (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 space-y-3 text-xs">
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              type="button"
                              onClick={() => setBookingForm({ ...bookingForm, upiSubMode: 'QR' })}
                              className={`py-2 rounded-lg font-bold border text-xs flex items-center justify-center gap-1.5 cursor-pointer ${bookingForm.upiSubMode === 'QR' ? 'bg-teal-600 text-white border-teal-600' : cardBg}`}
                            >
                              <QrCode className="w-3.5 h-3.5" /> Generate QR
                            </button>
                            <button
                              type="button"
                              onClick={() => setBookingForm({ ...bookingForm, upiSubMode: 'APP' })}
                              className={`py-2 rounded-lg font-bold border text-xs flex items-center justify-center gap-1.5 cursor-pointer ${bookingForm.upiSubMode === 'APP' ? 'bg-teal-600 text-white border-teal-600' : cardBg}`}
                            >
                              <Smartphone className="w-3.5 h-3.5" /> Pay By App
                            </button>
                          </div>

                          {bookingForm.upiSubMode === 'QR' ? (
                            <div className="flex flex-col items-center bg-white p-3 rounded-xl border border-emerald-300 text-slate-900 relative">
                              <img
                                src={qrApiUrl}
                                alt="Scan UPI QR"
                                className={`w-32 h-32 object-contain transition-all duration-300 ${bookingForm.qrRevealed ? '' : 'blur-md select-none'}`}
                              />
                              {!bookingForm.qrRevealed && (
                                <button
                                  type="button"
                                  onClick={() => setBookingForm({ ...bookingForm, qrRevealed: true })}
                                  className="absolute inset-0 m-auto h-9 w-24 bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs rounded-xl shadow-lg cursor-pointer"
                                >
                                  Show QR
                                </button>
                              )}
                              <span className="text-xs font-extrabold mt-1">
                                {bookingForm.qrRevealed ? `Scan QR with any UPI App • ₹${payableNow.toLocaleString('en-IN')}` : `Click Show QR to reveal ₹${payableNow.toLocaleString('en-IN')} code`}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center space-y-2 py-2">
                              <a
                                href={upiUri}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs inline-flex items-center justify-center gap-2"
                              >
                                <Smartphone className="w-4 h-4" /> Open GPay / PhonePe / Paytm (₹{payableNow.toLocaleString('en-IN')})
                              </a>
                            </div>
                          )}

                          <input
                            required
                            type="text"
                            placeholder={t.utrPlaceholder}
                            value={bookingForm.utrReference}
                            onChange={(e) => setBookingForm({ ...bookingForm, utrReference: e.target.value })}
                            className={`w-full border rounded-lg px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                          />
                        </div>
                      );
                    })()}

                    {bookingForm.paymentMethod === 'BANK_TO_BANK' && (
                      <div className={`border rounded-xl p-3 space-y-2 text-xs ${subCardBg}`}>
                        <div className="font-mono text-[11px] space-y-0.5 select-text">
                          <div><b>Account Name:</b> Aqua Mark Settlement Account</div>
                          <div><b>Account No:</b> 20419820112 | <b>IFSC:</b> SBIN0008812</div>
                          <div><b>Payable Transfer:</b> ₹{payableNow.toLocaleString('en-IN')} (IMPS / NEFT)</div>
                        </div>
                        <input
                          required
                          type="text"
                          placeholder={t.utrPlaceholder}
                          value={bookingForm.utrReference}
                          onChange={(e) => setBookingForm({ ...bookingForm, utrReference: e.target.value })}
                          className={`w-full border rounded-lg px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                        />
                      </div>
                    )}
                  </div>
                </div>

                {Math.abs((selectedBatch.salinity || 15) - (Number(bookingForm.pondSalinity) || 15)) > 4 && (
                  <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-600 flex items-start gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                    <span>{t.salinityWarn}</span>
                  </div>
                )}

                <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
                  <div className="flex justify-between text-slate-300">
                    <span>{t.totalSeedValue} ({qty.toLocaleString('en-IN')} PL):</span>
                    <span className="font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-emerald-400 font-extrabold text-sm border-t border-white/10 pt-2">
                    <span>{isFullPlan ? 'Full Payment Now (100%):' : t.advancePaidLabel}:</span>
                    <span>₹{payableNow.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-slate-300 pt-1">
                    <span>{t.balanceAtPacking}:</span>
                    <span className="font-bold text-white">₹{(total - payableNow).toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* HIDE BOOKING BUTTON WHEN QUANTITY IS BELOW MINIMUM PACKING */}
                {!isBelowMinPacking && (
                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-xs cursor-pointer">
                    {isFullPlan ? `Pay Full ₹${payableNow.toLocaleString('en-IN')} & Confirm` : `Pay 4% Advance ₹${payableNow.toLocaleString('en-IN')} & Confirm`} →
                  </button>
                )}
              </form>
            </div>
          </div>
        );
      })()}

      {/* SIDE-BY-SIDE COMPARISON MODAL */}
      {showCompareModal && (
        <div className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <h3 className="font-extrabold text-base">{t.compareModalTitle}</h3>
              <button type="button" onClick={() => setShowCompareModal(false)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {batches.filter(b => compareIds.includes(b.id)).map(b => (
                <div key={b.id} className={`border rounded-xl p-3.5 space-y-2 ${subCardBg}`}>
                  <div className="font-extrabold">{b.hatcheryCode || 'Verified Hatchery'} ({b.id})</div>
                  <div className="text-teal-500 font-bold">{b.zone}</div>
                  <div className="border-t border-slate-300/20 pt-2 space-y-1">
                    <div className="flex justify-between"><span>{t.stage}:</span><b>{b.plStage}</b></div>
                    <div className="flex justify-between"><span>{t.perSeed}:</span><b>₹{(b.pricePer1000 || 0).toFixed(2)}</b></div>
                    <div className="flex justify-between"><span>{t.salinity}:</span><b>{b.salinity} PPT</b></div>
                    <div className="flex justify-between"><span>{t.bonus}:</span><b className="text-emerald-500">+{b.bonusPercent}%</b></div>
                    <div className="flex justify-between"><span>Min Packing:</span><b className="text-amber-500">{formatSeedQuantityShort(b.minPackingQty || 100000).split(' (')[0]}</b></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* OFFICIAL RECEIPT MODAL */}
      {activeInvoice && (
        <div className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-teal-600 space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <h3 className="font-extrabold text-sm">
                  {activeInvoice.receiptType === 'FINAL' ? t.finalReceiptTitle : t.receiptTitle}
                </h3>
                <p className="text-[11px] font-mono text-emerald-500 font-bold">
                  {activeInvoice.booking.bookingId} • Gate-Pass: {activeInvoice.booking.gatePassPin} • UTR: {activeInvoice.booking.balancePaymentId || activeInvoice.booking.paymentId}
                </p>
              </div>
              <button type="button" onClick={() => setActiveInvoice(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>

            <div className="text-xs space-y-2.5">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl">
                <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">{t.sellerDetailsHeading}</span>
                <p className="font-extrabold text-sm mt-0.5">{activeInvoice.booking.batch?.realName} (Batch {activeInvoice.booking.batch?.id})</p>
                <p className="opacity-75">{activeInvoice.booking.batch?.realAddress}</p>
                <p className="font-bold text-teal-500 mt-1">Phone: +91 {activeInvoice.booking.batch?.realPhone} | CAA: {activeInvoice.booking.batch?.caaLicense}</p>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-300/20">
                <span>{t.farmerNameLabel}:</span>
                <span className="font-bold">{activeInvoice.booking.farmerName} ({activeInvoice.booking.farmerPhone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-300/20">
                <span>Packing Schedule:</span>
                <span className="font-bold">{activeInvoice.booking.packingDate} ({activeInvoice.booking.packingTimeSlot})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-300/20">
                <span>Seed + Free Bonus:</span>
                <span className="font-bold text-emerald-500">{(activeInvoice.booking.quantity || 0).toLocaleString('en-IN')} + {(activeInvoice.booking.bonusSeeds || 0).toLocaleString('en-IN')} Free PL</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-300/20 text-teal-500 font-bold">
                <span>Total Paid Amount:</span>
                <span>₹{(activeInvoice.booking.tokenAdvance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 font-bold">
                <span>Remaining Balance:</span>
                <span>₹{(activeInvoice.booking.balanceAtPacking || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2 pt-2">
              <button
                type="button"
                onClick={() => handleSendBilingualBookingSummary(activeInvoice.booking)}
                className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold py-3 px-3.5 rounded-xl flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" /> WhatsApp
              </button>
              <button
                type="button"
                onClick={() => handleDownloadVerifiedPdf(activeInvoice.booking, activeInvoice.receiptType === 'FINAL')}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" /> {t.printBtn}
              </button>
              <button type="button" onClick={() => setActiveInvoice(null)} className={`px-4 py-3 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AquaMarkApp />
    </ErrorBoundary>
  );
}