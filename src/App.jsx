import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Lock, Unlock, Calculator, CheckCircle2,
  MapPin, FileText, Wallet, Users, Send, Printer, Camera,
  BadgeCheck, ArrowRight, Globe, LogOut, Smartphone, UserCheck,
  Landmark, Clock, CheckSquare, ShoppingBag, Building2, Star, Search,
  AlertTriangle, Package, Edit3, Check, ChevronRight, Layers,
  Trash2, ArrowUpDown, Scale, FileCheck2, Upload, PlusCircle,
  Heart, Truck, TrendingUp, Eye, EyeOff, CreditCard, QrCode,
  MessageSquare, BarChart3, Calendar, Droplets,
  Receipt, Moon, Sun, XCircle, ClipboardList, Gauge, Video, ExternalLink,
  FolderOpen, Maximize2, RefreshCw, Share2, PauseCircle, PlayCircle,
  Sparkles, ShieldAlert, KeyRound, Activity, Navigation, Split,
  Thermometer, Award, Layers as LayersIcon, CheckCircle, Bell, Phone
} from 'lucide-react';
import { supabase } from './supabaseClient';

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
// DOMAIN CONSTANTS
// ============================================================================
const ADMIN_WHATSAPP_NUMBER = '919876543210';

const SHRIMP_SPECIES_OPTIONS = [
  'Litopenaeus vannamei (SyAqua Line)',
  'Litopenaeus vannamei (Hard Line / High Survival)',
  'Litopenaeus vannamei (SPF)',
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
  'Kona Bay (Hawaii SPF)',
  'SIS (Shrimp Improvement Systems)',
  'CPSPF Thailand Line',
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

// ============================================================================
// VIVO-STYLE CAMERA WATERMARK STAMP (LOCATION NAME + GPS + DATE & TIME)
// ============================================================================
async function getRichLocationDetails() {
  return new Promise((resolve) => {
    const fallback = {
      placeName: 'Kakinada Coastal Belt, AP, India',
      coords: '16.9891° N, 82.2475° E'
    };
    if (!navigator.geolocation) {
      resolve(fallback);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        const coordsStr = `${lat.toFixed(4)}° N, ${lon.toFixed(4)}° E`;
        try {
          const resp = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=14`
          );
          if (resp.ok) {
            const geo = await resp.json();
            const addr = geo.address || {};
            const town = addr.village || addr.town || addr.city || addr.suburb || addr.county || 'Coastal Zone';
            const state = addr.state || 'Andhra Pradesh';
            resolve({
              placeName: `${town}, ${state}, India`,
              coords: coordsStr
            });
            return;
          }
        } catch {
          // Offline / CORS fallback
        }
        resolve({ placeName: 'Coastal Aquaculture Zone, AP', coords: coordsStr });
      },
      () => resolve(fallback),
      { timeout: 4000 }
    );
  });
}

function drawVivoWatermarkOnCanvas(ctx, width, height, meta) {
  // Cross / Diagonal Transparent Security Watermark across entire image
  ctx.save();
  const diagFontSize = Math.max(14, Math.round(Math.min(width, height) * 0.032));
  ctx.font = `800 ${diagFontSize}px "Inter", "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const wmText = `AQUA MARK • ${meta.dateTime}`;
  const stepX = Math.max(260, Math.round(width * 0.42));
  const stepY = Math.max(140, Math.round(height * 0.25));

  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 6); // -30 deg cross diagonal
  for (let y = -height; y <= height; y += stepY) {
    for (let x = -width; x <= width; x += stepX) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.14)';
      ctx.fillText(wmText, x + 1.5, y + 1.5);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.20)';
      ctx.fillText(wmText, x, y);
    }
  }
  ctx.restore();

  const barH = Math.max(54, Math.round(height * 0.085));
  const yStart = height - barH;

  // Sleek translucent dark glass bottom band
  const grad = ctx.createLinearGradient(0, yStart - 12, 0, height);
  grad.addColorStop(0, 'rgba(10, 15, 28, 0)');
  grad.addColorStop(0.22, 'rgba(10, 15, 28, 0.86)');
  grad.addColorStop(1, 'rgba(10, 15, 28, 0.95)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, yStart - 12, width, barH + 12);

  const padX = Math.max(16, Math.round(width * 0.025));
  const lensR = Math.max(13, Math.round(barH * 0.25));
  const lensCx = padX + lensR;
  const lensCy = yStart + Math.round(barH * 0.52);

  ctx.beginPath();
  ctx.arc(lensCx, lensCy, lensR, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20, 184, 166, 0.22)';
  ctx.fill();
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#2dd4bf';
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(lensCx, lensCy, Math.round(lensR * 0.45), 0, Math.PI * 2);
  ctx.fillStyle = '#2dd4bf';
  ctx.fill();

  // Left Brand Title + CAA Number
  const leftTextX = lensCx + lensR + 12;
  const titleFont = Math.max(13, Math.round(barH * 0.28));
  const subFont = Math.max(10, Math.round(barH * 0.20));

  ctx.fillStyle = '#ffffff';
  ctx.font = `800 ${titleFont}px "Inter", "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('AQUA MARK', leftTextX, yStart + Math.round(barH * 0.44));

  ctx.fillStyle = '#5eead4';
  ctx.font = `700 ${subFont}px "Inter", "Segoe UI", Roboto, sans-serif`;
  ctx.fillText(`CAA NO: ${meta.caaNumber || 'CAA-VERIFIED'}`, leftTextX, yStart + Math.round(barH * 0.78));

  // Vertical Divider
  const divX = Math.round(width * 0.48);
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(divX, yStart + Math.round(barH * 0.22));
  ctx.lineTo(divX, height - Math.round(barH * 0.18));
  ctx.stroke();

  // Right Side: Clean Stylish Date & Time (No Location / Coordinates)
  const rightX = divX + 14;
  const dateFont = Math.max(12, Math.round(barH * 0.25));
  const tagFont = Math.max(10, Math.round(barH * 0.18));

  ctx.fillStyle = '#f8fafc';
  ctx.font = `700 ${dateFont}px "Georgia", "Inter", serif`;
  ctx.fillText(`${meta.dateTime}`, rightX, yStart + Math.round(barH * 0.46));

  ctx.fillStyle = '#34d399';
  ctx.font = `700 ${tagFont}px "Inter", "Segoe UI", Roboto, sans-serif`;
  ctx.fillText('VERIFIED TIMESTAMP • SECURITY SEAL', rightX, yStart + Math.round(barH * 0.78));
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

      drawVivoWatermarkOnCanvas(ctx, width, height, meta);

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
          drawVivoWatermarkOnCanvas(ctx, canvas.width, canvas.height, meta);
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

function extractStoragePathFromUrl(publicUrl, bucketName) {
  if (!publicUrl || typeof publicUrl !== 'string') return null;
  const marker = `/object/public/${bucketName}/`;
  const idx = publicUrl.indexOf(marker);
  if (idx === -1) return null;
  return decodeURIComponent(publicUrl.slice(idx + marker.length));
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
      buyer: { title: 'Buyer (Farmer)', desc: 'Book CAA & PCR-verified seed' },
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
    unlockHint: 'Hatchery name, contact & Google Maps link unlock after 4% advance booking',
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
    myBookingsTitle: 'Your Bookings, Escrow Timeline & Gate-Passes',
    noBookingsYet: 'No bookings placed yet.',
    paidLabel: 'Advance Paid (4%)',
    balancePackingLabel: 'Balance at Packing (96%)',
    packingReadyAlert: '📦 Hatchery Marked Packing Complete! Complete remaining payment at packing.',
    pendingSettlementBadge: '4% Advance Paid • 2% Refundable Hold Active',
    clearedSettlementBadge: '✅ Packing Complete • 2% Hold Refunded to You',
    cancelledRefundBadge: '❌ Cancelled • 2% Hold Refunded',
    cancelBookingBtn: 'Cancel Booking (2% Refund)',
    rateSeedLabel: 'Rate Hatchery (1-5★) & Feedback:',
    submitReviewBtn: 'Submit Feedback',
    ratedLabel: 'Feedback Sent',
    advanceReceiptBtn: 'Advance Receipt',
    finalReceiptBtn: 'Final Cleared Receipt',
    depositTitle: 'Mandatory ₹10,000 Hatchery Security Deposit',
    depositSub: 'To protect farmers against fake listings and guarantee SPF seed quality, every Hatchery Owner must complete a one-time ₹10,000 refundable security deposit before activating their Hatchery account.',
    depositPayBtn: 'Verify & Activate Hatchery Account (₹10,000)',
    unifiedRegTitle: 'Hatchery & Bank Registration (One-Time Setup)',
    unifiedRegSub: 'Your ₹10,000 security deposit is verified! Complete your hatchery & settlement bank profile.',
    hatcheryNameLabel: 'Hatchery Legal Name',
    caaLicenseLabel: 'CAA Registration Number',
    zoneLabel: 'Coastal Zone',
    addressLabel: 'Hatchery Facility Address',
    mapsLinkLabel: 'Google Maps Location Link (Optional)',
    descriptionLabel: 'Hatchery Description & Biosecurity Info (Optional)',
    accHolderLabel: 'Bank Account Holder Name',
    accNoLabel: 'Bank Account Number',
    ifscLabel: 'IFSC Code',
    upiLabel: 'Settlement UPI ID',
    completeRegBtn: 'Verify & Register Hatchery + Bank',
    hatcheryLockedBanner: 'Verified Hatchery Locked to +91',
    editSellerProfileBtn: 'Edit Profile, Maps & Bank',
    editBrokerProfileBtn: 'Edit Profile & Bank',
    editBuyerProfileBtn: 'Edit Profile',
    deleteAccountBtn: 'Delete Account',
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
    availDateLabel: 'Available Packing Date',
    availTimeLabel: 'Available Time Slot',
    pcrUploadBtnLabel: 'Upload PCR Images (≤2MB)',
    videoUploadBtnLabel: 'Upload Tank Videos (≤10MB)',
    pcrHintLabel: 'Required: At least 1 PCR lab report image (Camera or Files)',
    gpsLockedBtn: 'GPS Locked',
    captureGpsBtn: 'Tag Tank GPS',
    publishBtn: 'Publish Batch Live',
    myBatchesTitle: 'Your Active Seed Batches (Pause/Live, Edit All Details & Media)',
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
    paymentMethodLabel: 'Select 4% Advance Payment Method',
    utrPlaceholder: 'Enter 12-Digit UPI / Bank UTR Reference Number',
    salinityWarn: 'Salinity variance exceeds 4 PPT. Hatchery will perform gradual acclimatization.',
    totalSeedValue: 'Total Hatchery Value',
    advancePaidLabel: 'Advance Paid Now (4%)',
    balanceAtPacking: 'Balance Payable at Packing (96%)',
    payNowBtn: 'Confirm & Pay 4% Advance',
    receiptTitle: 'OFFICIAL SEED BOOKING RECEIPT',
    finalReceiptTitle: 'FINAL BALANCE CLEARED RECEIPT',
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
      accountDeleted: 'Your account and all associated database records have been permanently deleted.',
      regComplete: 'Hatchery & Bank details saved successfully!',
      brokerRegComplete: 'Broker Bank & UPI details saved! Broker Portal activated.',
      profileUpdated: 'Profile updated successfully!',
      gpsLocked: 'Tank GPS coordinates locked.',
      uploadPcrFirst: 'Please upload at least 1 PCR Lab Report image.',
      batchPublished: 'Seed batch published live!',
      batchUpdated: 'Batch details & cloud files updated!',
      batchRemoved: 'Seed batch & storage files deleted completely!',
      liveVideoRequested: 'Live tank video request sent to Hatchery!',
      packingMarked: 'Packing marked complete! Buyer notified.',
      paymentReceivedDone: 'Payment Received confirmed! Final Cleared Receipt generated.',
      bookingCancelled: 'Booking cancelled! 2% refundable hold returned & stock restored.',
      farmerLocked: 'Farmer locked to your Broker ID for 365 days!',
      paymentSuccess: '4% Advance paid! Gate-Pass & Receipt ready.',
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
    unlockHint: '4% అడ్వాన్స్ బుకింగ్ పూర్తయిన వెంటనే హేచరీ పేరు, ఫోన్ & Google Maps లింక్ అన్‌లాక్ అవుతాయి',
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
    myBookingsTitle: 'మీ బుకింగ్స్, Gate-Pass & రసీదులు',
    noBookingsYet: 'మీరు ఇంకా ఎటువంటి సీడ్ బుకింగ్ చేయలేదు.',
    paidLabel: 'చెల్లించిన అడ్వాన్స్ (4%)',
    balancePackingLabel: 'ప్యాకింగ్ సమయంలో చెల్లించాల్సినది (96%)',
    packingReadyAlert: '📦 హేచరీ వారు ప్యాకింగ్ పూర్తయినట్లు తెలిపారు! ప్యాకింగ్ వద్ద బ్యాలెన్స్ చెల్లించండి.',
    pendingSettlementBadge: '4% అడ్వాన్స్ చెల్లించబడింది • 2% హోల్డ్ సురక్షితం',
    clearedSettlementBadge: '✅ ప్యాకింగ్ పూర్తయింది • 2% హోల్డ్ మీకు వాపస్ వచ్చింది',
    cancelledRefundBadge: '❌ క్యాన్సిల్ చేయబడింది • 2% వాపస్ వచ్చింది',
    cancelBookingBtn: 'బుకింగ్ క్యాన్సిల్ (2% వాపస్)',
    rateSeedLabel: 'రేటింగ్ (1-5★) & అభిప్రాయం రాయండి:',
    submitReviewBtn: 'ఫీడ్‌బ్యాక్ పంపండి',
    ratedLabel: 'ఫీడ్‌బ్యాక్ పంపబడింది',
    advanceReceiptBtn: 'అడ్వాన్స్ రసీదు (Receipt)',
    finalReceiptBtn: 'ఫైనల్ క్లియర్డ్ రసీదు (Receipt)',
    depositTitle: '₹10,000 హేచరీ సెక్యూరిటీ డిపాజిట్ (తప్పనిసరి)',
    depositSub: 'రైతులకు నాణ్యమైన SPF సీడ్ హామీ కోసం ప్రతి హేచరీ యజమాని ఒకసారి ₹10,000 రిఫండబుల్ సెక్యూరిటీ డిపాజిట్ చెల్లించాలి.',
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
    deleteAccountBtn: 'Delete Account',
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
    availDateLabel: 'ప్యాకింగ్ అందుబాటు తేదీ',
    availTimeLabel: 'ప్యాకింగ్ అందుబాటు సమయం',
    pcrUploadBtnLabel: 'PCR ఫోటోలు అప్‌లోడ్ (≤2MB)',
    videoUploadBtnLabel: 'ట్యాంక్ వీడియోలు అప్‌లోడ్ (≤10MB)',
    pcrHintLabel: 'కనీసం 1 PCR ల్యాబ్ ఫోటో తప్పనిసరి (Camera లేదా Files)',
    gpsLockedBtn: 'GPS లాక్ అయింది',
    captureGpsBtn: 'GPS ట్యాగ్ చేయండి',
    publishBtn: 'బ్యాచ్ లైవ్ చేయండి',
    myBatchesTitle: 'మీ హేచరీ సీడ్ బ్యాచ్‌లు (Pause/Live & Edit)',
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
    paymentMethodLabel: '4% అడ్వాన్స్ పేమెంట్ విధానం ఎంచుకోండి',
    utrPlaceholder: '12-అంకెల UPI / Bank UTR రిఫరెన్స్ నంబర్ ఎంటర్ చేయండి',
    salinityWarn: 'హేచరీ నీటికి మరియు చెరువు నీటికి మధ్య 4 PPT కంటే ఎక్కువ తేడా ఉంది.',
    totalSeedValue: 'హేచరీ ఆర్డర్ విలువ',
    advancePaidLabel: 'చెల్లించిన అడ్వాన్స్ (4%)',
    balanceAtPacking: 'ప్యాకింగ్ సమయంలో చెల్లించాల్సిన బ్యాలెన్స్ (96%)',
    payNowBtn: '4% అడ్వాన్స్ చెల్లించి బుక్ చేయండి',
    receiptTitle: 'అధికారిక సీడ్ బుకింగ్ రసీదు (RECEIPT)',
    finalReceiptTitle: 'ఫైనల్ బ్యాలెన్స్ క్లియర్డ్ రసీదు (FINAL RECEIPT)',
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
      accountDeleted: 'మీ అకౌంట్ మరియు డేటాబేస్ వివరాలు శాశ్వతంగా తొలగించబడ్డాయి.',
      regComplete: 'హేచరీ & బ్యాంక్ వివరాలు సేవ్ అయ్యాయి!',
      brokerRegComplete: 'బ్రోకర్ బ్యాంక్ & UPI వివరాలు సేవ్ అయ్యాయి!',
      profileUpdated: 'ప్రొఫైల్ వివరాలు అప్‌డేట్ అయ్యాయి!',
      gpsLocked: 'హేచరీ GPS లొకేషన్ లాక్ అయింది.',
      uploadPcrFirst: 'దయచేసి కనీసం 1 PCR ల్యాబ్ ఫోటో అప్‌లోడ్ చేయండి.',
      batchPublished: 'కొత్త సీడ్ బ్యాచ్ లైవ్ అయింది!',
      batchUpdated: 'బ్యాచ్ వివరాలు & ఫైల్స్ అప్‌డేట్ అయ్యాయి!',
      batchRemoved: 'సీడ్ బ్యాచ్ & స్టోరేజ్ ఫైల్స్ తొలగించబడ్డాయి.',
      liveVideoRequested: 'లైవ్ ట్యాంక్ వీడియో రిక్వెస్ట్ హేచరీకి పంపబడింది!',
      packingMarked: 'ప్యాకింగ్ పూర్తయినట్లు రైతుకు పంపబడింది!',
      paymentReceivedDone: 'Payment Received నిర్ధారించబడింది! Final Receipt సిద్ధం.',
      bookingCancelled: 'బుకింగ్ క్యాన్సిల్ చేయబడింది! 2% వాపస్ వచ్చింది.',
      farmerLocked: 'రైతు 365 రోజుల పాటు మీ ID కి లాక్ చేయబడ్డారు!',
      paymentSuccess: '4% అడ్వాన్స్ పేమెంట్ పూర్తయింది! Gate-Pass & రసీదు సిద్ధం.',
      enterUtr: 'దయచేసి 12-అంకెల UPI / Bank UTR రిఫరెన్స్ నంబర్ ఎంటర్ చేయండి.',
      calcUpdated: 'దిగుబడి & లాభాల లెక్కలు అప్‌డేట్ అయ్యాయి!',
      cloudSynced: 'లైవ్ డేటాబేస్ సింక్ పూర్తయింది!'
    }
  }
};

function safeLoadStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    const parsed = JSON.parse(raw);
    return parsed ?? fallback;
  } catch {
    return fallback;
  }
}

function AquaMarkApp() {
  const [lang, setLang] = useState('en');
  const [darkMode, setDarkMode] = useState(() => safeLoadStorage('aqm_v11_dark', false));
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

  const [currentUser, setCurrentUser] = useState(() => safeLoadStorage('aqm_v11_user', null));
  // Role-isolated user map keyed by `${phone}_${role}` so same mobile has separate Sign Up & Password per role
  const [registeredUsers, setRegisteredUsers] = useState(() => safeLoadStorage('aqm_v11_users_db', {}));

  // Live Supabase States
  const [hatcheryProfiles, setHatcheryProfiles] = useState({});
  const [brokerProfiles, setBrokerProfiles] = useState({});
  const [batches, setBatches] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [brokerFarmers, setBrokerFarmers] = useState([]);
  const [savedBatchIds, setSavedBatchIds] = useState(() => safeLoadStorage('aqm_v11_wishlist', []));
  const [liveVideoRequests, setLiveVideoRequests] = useState([]);
  const [farmerPonds, setFarmerPonds] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [showNotifPanel, setShowNotifPanel] = useState(false);
  const [selectedNotifDetail, setSelectedNotifDetail] = useState(null);
  const [showSellerDepositModal, setShowSellerDepositModal] = useState(false);
  const [addDepositAmount, setAddDepositAmount] = useState('5000');
  const [addDepositUtr, setAddDepositUtr] = useState('');
  const [addDepositMethod, setAddDepositMethod] = useState('DIRECT_UPI');
  const [addDepositQrRevealed, setAddDepositQrRevealed] = useState(false);
  const [isWithdrawingOnDelete, setIsWithdrawingOnDelete] = useState(false);
  const [showSellerScanQrModal, setShowSellerScanQrModal] = useState(false);
  const [scanQrInput, setScanQrInput] = useState('');
  const [scanQrError, setScanQrError] = useState('');
  const [statusModalBooking, setStatusModalBooking] = useState(null);
  const [statusAnimStep, setStatusAnimStep] = useState(0);
  const [payRemainingBooking, setPayRemainingBooking] = useState(null);
  const [payRemainingForm, setPayRemainingForm] = useState({ paymentMethod: 'DIRECT_UPI', upiSubMode: 'QR', qrRevealed: false, utrReference: '' });

  useEffect(() => { try { localStorage.setItem('aqm_v11_dark', JSON.stringify(darkMode)); } catch { } }, [darkMode]);
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('aqm_v11_user', JSON.stringify(currentUser));
      else localStorage.removeItem('aqm_v11_user');
    } catch { }
  }, [currentUser]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_users_db', JSON.stringify(registeredUsers)); } catch { } }, [registeredUsers]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_wishlist', JSON.stringify(savedBatchIds)); } catch { } }, [savedBatchIds]);

  // =========================================================================
  // LOAD & SYNC ALL DATA FROM SUPABASE
  // =========================================================================
  const syncAllFromSupabase = async () => {
    try {
      const [batchesRes, bookingsRes, kvRes, usersRes] = await Promise.all([
        supabase.from('batches').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('app_kv_store').select('*'),
        supabase.from('app_users').select('*')
      ]);

      if (batchesRes.data) {
        setBatches(batchesRes.data.map(r => (r.data && r.data.id ? r.data : {
          id: r.id,
          ownerPhone: r.owner_phone,
          realName: r.real_name,
          species: r.species,
          plStage: r.pl_stage,
          pricePer1000: Number(r.price_per_1000 || 0.43),
          availableStock: Number(r.available_stock || 0),
          salinity: Number(r.salinity || 16),
          bonusPercent: Number(r.bonus_percent || 15),
          zone: r.zone,
          pcrImages: r.pcr_images || [],
          tankVideos: []
        })));
      }

      if (bookingsRes.data) {
        setBookings(bookingsRes.data.map(r => (r.data && r.data.bookingId ? r.data : {
          bookingId: r.booking_id,
          farmerPhone: r.farmer_phone,
          farmerName: r.farmer_name,
          hatcheryOwnerPhone: r.hatchery_owner_phone,
          quantity: Number(r.quantity || 0),
          totalSeedCost: Number(r.total_seed_cost || 0),
          packingStatus: r.packing_status,
          settlement: r.settlement || {}
        })));
      }

      if (kvRes.data) {
        kvRes.data.forEach(item => {
          if (item.key === 'hatcheries') setHatcheryProfiles(item.value || {});
          if (item.key === 'brokers') setBrokerProfiles(item.value || {});
          if (item.key === 'farmers') setBrokerFarmers(item.value || []);
          if (item.key === 'ponds') setFarmerPonds(item.value || []);
          if (item.key === 'live_videos') setLiveVideoRequests(item.value || []);
          if (item.key === 'notifications') setNotifications(item.value || []);
        });
      }

      if (usersRes.data) {
        const dbMap = {};
        usersRes.data.forEach(u => {
          const compositeKey = u.phone.includes('_') ? u.phone : `${u.phone}_${u.role || 'buyer'}`;
          dbMap[compositeKey] = {
            ...u,
            phone: u.phone.split('_')[0]
          };
        });
        setRegisteredUsers(prev => ({ ...prev, ...dbMap }));
      }
    } catch (err) {
      console.error('Supabase sync error:', err);
    }
  };

  useEffect(() => {
    syncAllFromSupabase();
  }, []);

  const saveKvToSupabase = async (key, value) => {
    await supabase.from('app_kv_store').upsert({ key, value, updated_at: new Date().toISOString() });
  };

  const pushAppNotification = async (targetPhone, targetRole, title, message, details = {}) => {
    if (!targetPhone) return;
    const now = new Date();
    const notif = {
      id: `NTF-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      targetPhone: String(targetPhone).slice(-10),
      targetRole: targetRole || null,
      title,
      message,
      details,
      read: false,
      createdAt: `${now.toLocaleDateString('en-IN')} • ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`
    };
    setNotifications(prev => {
      const next = [notif, ...prev].slice(0, 100);
      saveKvToSupabase('notifications', next);
      return next;
    });
  };

  const saveBatchToSupabase = async (batchObj) => {
    await supabase.from('batches').upsert({
      id: batchObj.id,
      owner_phone: batchObj.ownerPhone,
      real_name: batchObj.realName,
      species: batchObj.species,
      pl_stage: batchObj.plStage,
      price_per_1000: batchObj.pricePer1000,
      available_stock: batchObj.availableStock,
      salinity: batchObj.salinity,
      bonus_percent: batchObj.bonusPercent,
      zone: batchObj.zone,
      pcr_images: batchObj.pcrImages || [],
      data: batchObj
    });
  };

  const saveBookingToSupabase = async (bkObj) => {
    await supabase.from('bookings').upsert({
      booking_id: bkObj.bookingId,
      farmer_phone: bkObj.farmerPhone,
      farmer_name: bkObj.farmerName,
      hatchery_owner_phone: bkObj.hatcheryOwnerPhone,
      quantity: bkObj.quantity,
      total_seed_cost: bkObj.totalSeedCost,
      packing_status: bkObj.packingStatus,
      settlement: bkObj.settlement,
      data: bkObj
    });
  };

  const deleteStorageFilesByUrls = async (urls, bucketName) => {
    if (!urls || urls.length === 0) return;
    const paths = urls.map(u => extractStoragePathFromUrl(u, bucketName)).filter(Boolean);
    if (paths.length > 0) {
      await supabase.storage.from(bucketName).remove(paths);
    }
  };

  // =========================================================================
  // AUTHENTICATION STATES (ROLE-ISOLATED SIGN UP / LOGIN / FORGOT PASSWORD)
  // =========================================================================
  const [loginRole, setLoginRole] = useState('buyer');
  const [authMode, setAuthMode] = useState('signup'); // 'signup' | 'login' | 'forgot'
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isVerifyingWa, setIsVerifyingWa] = useState(false);
  const [waVerifiedDone, setWaVerifiedDone] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  // Hatchery ₹10,000 Security Deposit States
  const [depositPayMethod, setDepositPayMethod] = useState('DIRECT_UPI');
  const [depositQrRevealed, setDepositQrRevealed] = useState(false);
  const [depositUtr, setDepositUtr] = useState('');

  // Buyer & Broker Edit Profile Modal States
  const [showBasicEditProfileModal, setShowBasicEditProfileModal] = useState(false);
  const [editProfileDraft, setEditProfileDraft] = useState({ name: '', phone: '', phoneVerified: true, verifying: false });

  // Account Deletion Verification Modal
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [deleteConfirmPassword, setDeleteConfirmPassword] = useState('');
  const [showDeletePwd, setShowDeletePwd] = useState(false);

  // Upload Progress & Media Lightbox (Top-Layer z-[9999])
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
    minPackingLakhs: 1,
    bonusPercent: 15,
    availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    availableTimeSlot: 'All Day (24 Hours Flexible)',
    pcrImages: [],
    tankVideos: [],
    removedPcrUrls: [],
    removedVideoUrls: []
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
    paymentMethod: 'RAZORPAY',
    paymentOption: 'ADVANCE', // 'ADVANCE' | 'FULL'
    upiSubMode: 'QR', // 'QR' | 'APP'
    qrRevealed: false, // Blurred until "Show QR" is clicked
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
    minPackingLakhs: '1',
    salinity: 16,
    bonusPercent: 15,
    availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    availableTimeSlot: 'All Day (24 Hours Flexible)'
  });
  const [pcrImages, setPcrImages] = useState([]);
  const [tankVideos, setTankVideos] = useState([]);
  const [gpsLocation, setGpsLocation] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  const computeSeedCount = (amountStr, unit) => {
    const num = Math.max(1, Math.min(100, Number(amountStr) || 1));
    const multiplier = unit === 'MILLIONS' ? 1000000 : 100000;
    return num * multiplier;
  };

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

    // Open WhatsApp with pre-filled verification message and automatically return focus to portal
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
    }, 1800);
  };

  const handleCompleteSignUpOrReset = async (e) => {
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
      depositPaid: existing?.depositPaid || false,
      depositUtr: existing?.depositUtr || '',
      last_login: new Date().toISOString()
    };

    setRegisteredUsers(prev => ({ ...prev, [roleKey]: userRecord }));
    await supabase.from('app_users').upsert({
      phone: roleKey,
      name: finalName,
      role: loginRole,
      password: loginPassword.trim(),
      last_login: new Date().toISOString()
    });

    completePortalLogin({
      role: loginRole,
      name: finalName,
      phone: cleanPhone,
      depositPaid: userRecord.depositPaid
    });
  };

  const handlePasswordLoginSubmit = async (e) => {
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

    await supabase.from('app_users').update({
      last_login: new Date().toISOString()
    }).eq('phone', roleKey);

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
    syncAllFromSupabase();
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setWaVerifiedDone(false);
    setIsVerifyingWa(false);
    setLoginPassword('');
    setSelectedBatch(null);
    setModalError('');
  };

  // =========================================================================
  // HATCHERY ₹10,000 MANDATORY SECURITY DEPOSIT CONFIRMATION
  // =========================================================================
  const handleConfirmHatcheryDeposit = async (e) => {
    e.preventDefault();
    if (!currentUser?.phone) return;
    if ((depositPayMethod === 'DIRECT_UPI' || depositPayMethod === 'BANK_TO_BANK') && !depositUtr.trim()) {
      showToast(t.toasts.enterUtr);
      return;
    }

    const utrRef = depositPayMethod === 'RAZORPAY'
      ? `RZP_DEP_${Math.floor(100000 + Math.random() * 900000)}`
      : `${depositPayMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT'}_${depositUtr.trim().toUpperCase()}`;

    const roleKey = getUserKey(currentUser.phone, 'seller');
    const existingUser = registeredUsers[roleKey] || {
      phone: currentUser.phone,
      name: currentUser.name,
      role: 'seller',
      password: ''
    };
    const updatedUserRecord = { ...existingUser, depositPaid: true, depositUtr: utrRef };

    setRegisteredUsers(prev => ({ ...prev, [roleKey]: updatedUserRecord }));
    setCurrentUser(prev => ({ ...prev, depositPaid: true, depositUtr: utrRef }));

    await supabase.from('app_users').upsert({
      phone: roleKey,
      name: currentUser.name,
      role: 'seller',
      password: existingUser.password,
      last_login: new Date().toISOString()
    });

    if (hatcheryProfiles[currentUser.phone]) {
      const nextProfiles = {
        ...hatcheryProfiles,
        [currentUser.phone]: {
          ...hatcheryProfiles[currentUser.phone],
          depositPaid: true,
          depositUtr: utrRef,
          depositAmount: Number(hatcheryProfiles[currentUser.phone]?.depositAmount || 0) + 10000,
          depositSourceAccount: utrRef
        }
      };
      setHatcheryProfiles(nextProfiles);
      await saveKvToSupabase('hatcheries', nextProfiles);
    }

    setDepositUtr('');
    setDepositQrRevealed(false);
    showToast(t.toasts.depositComplete);
  };

  // =========================================================================
  // BUYER & BROKER EDIT PROFILE (NAME + MOBILE WITH RE-VERIFICATION)
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
    }, 1500);
  };

  const handleSaveBasicProfile = async (e) => {
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

    if (oldKey !== newKey) {
      await supabase.from('app_users').delete().eq('phone', oldKey);
    }
    await supabase.from('app_users').upsert({
      phone: newKey,
      name: updatedRecord.name,
      role: currentUser.role,
      password: updatedRecord.password,
      last_login: new Date().toISOString()
    });

    if (currentUser.role === 'mediator' && brokerProfiles[currentUser.phone]) {
      const nextBrokers = { ...brokerProfiles };
      const bp = { ...nextBrokers[currentUser.phone], brokerPhone: cleanNewPhone, brokerName: updatedRecord.name };
      if (currentUser.phone !== cleanNewPhone) delete nextBrokers[currentUser.phone];
      nextBrokers[cleanNewPhone] = bp;
      setBrokerProfiles(nextBrokers);
      await saveKvToSupabase('brokers', nextBrokers);
    }

    setCurrentUser({ ...currentUser, name: updatedRecord.name, phone: cleanNewPhone });
    setShowBasicEditProfileModal(false);
    showToast(t.toasts.profileUpdated);
  };

  // =========================================================================
  // PASSWORD-VERIFIED ACCOUNT DELETION (REMOVES FROM SUPABASE & STATE)
  // =========================================================================
  const handleConfirmDeleteAccount = async (e) => {
    e.preventDefault();
    if (!currentUser?.phone) return;
    const roleKey = getUserKey(currentUser.phone, currentUser.role);
    const record = registeredUsers[roleKey];
    if (record && record.password && deleteConfirmPassword.trim() !== record.password) {
      showToast(t.toasts.wrongPassword);
      return;
    }

    const phone = currentUser.phone;
    setRegisteredUsers(prev => {
      const copy = { ...prev };
      delete copy[roleKey];
      return copy;
    });
    await supabase.from('app_users').delete().eq('phone', roleKey);

    if (currentUser.role === 'seller') {
      const nextHatcheries = { ...hatcheryProfiles };
      delete nextHatcheries[phone];
      setHatcheryProfiles(nextHatcheries);
      await saveKvToSupabase('hatcheries', nextHatcheries);

      const owned = batches.filter(b => b.ownerPhone === phone);
      for (const b of owned) {
        await deleteStorageFilesByUrls((b.pcrImages || []).map(i => i.url), 'pcr-reports');
        await deleteStorageFilesByUrls((b.tankVideos || []).map(v => v.url), 'tank-videos');
        await supabase.from('batches').delete().eq('id', b.id);
      }
      setBatches(prev => prev.filter(b => b.ownerPhone !== phone));
    }

    if (currentUser.role === 'mediator') {
      const nextBrokers = { ...brokerProfiles };
      delete nextBrokers[phone];
      setBrokerProfiles(nextBrokers);
      await saveKvToSupabase('brokers', nextBrokers);
    }

    const withdrawnAmt = currentUser.role === 'seller' ? (hatcheryProfiles[phone]?.depositAmount || 10000) : 0;
    const refundSource = currentUser.role === 'seller' ? (hatcheryProfiles[phone]?.depositSourceAccount || hatcheryProfiles[phone]?.depositUtr || hatcheryProfiles[phone]?.bankDetails?.upiId || 'Original Source Account') : '';
    setShowDeleteAccountModal(false);
    setShowSellerDepositModal(false);
    setIsWithdrawingOnDelete(false);
    setDeleteConfirmPassword('');
    setIsEditingSellerProfile(false);
    setIsEditingBrokerBank(false);
    setShowBasicEditProfileModal(false);
    handleLogout();
    showToast(withdrawnAmt > 0 ? `Account deleted! ₹${withdrawnAmt.toLocaleString('en-IN')} deposit refunded to ${refundSource}.` : t.toasts.accountDeleted);
  };

  const handleManualCloudSync = async () => {
    setIsSyncing(true);
    await syncAllFromSupabase();
    setIsSyncing(false);
    showToast(t.toasts.cloudSynced);
  };

  // =========================================================================
  // SELLER & BROKER PROFILE HANDLERS
  // =========================================================================
  const handleCompleteUnifiedSellerReg = async (e) => {
    e.preventDefault();
    if (!currentUser?.phone) return;
    const finalZone = unifiedSellerForm.zone === 'OTHER_CUSTOM'
      ? (unifiedSellerForm.customZone.trim() || 'Coastal Zone')
      : unifiedSellerForm.zone;

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
      depositUtr: currentUser.depositUtr || 'VERIFIED_10K',
      bankDetails: {
        accountName: unifiedSellerForm.accountName,
        accountNo: unifiedSellerForm.accountNo,
        ifsc: unifiedSellerForm.ifsc.toUpperCase(),
        upiId: unifiedSellerForm.upiId
      }
    };
    const nextProfiles = { ...hatcheryProfiles, [currentUser.phone]: profile };
    setHatcheryProfiles(nextProfiles);
    await saveKvToSupabase('hatcheries', nextProfiles);
    showToast(t.toasts.regComplete);
  };

  const handleCompleteBrokerReg = async (e) => {
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
    const nextBrokers = { ...brokerProfiles, [currentUser.phone]: profile };
    setBrokerProfiles(nextBrokers);
    setIsEditingBrokerBank(false);
    await saveKvToSupabase('brokers', nextBrokers);
    showToast(t.toasts.brokerRegComplete);
  };

  const handleUpdateSellerProfileAndBank = async (e) => {
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
    const nextProfiles = { ...hatcheryProfiles, [currentUser.phone]: updatedProfile };
    setHatcheryProfiles(nextProfiles);
    await saveKvToSupabase('hatcheries', nextProfiles);

    const updatedBatchesList = batches.map(b =>
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
    );
    setBatches(updatedBatchesList);
    for (const b of updatedBatchesList.filter(x => x.ownerPhone === currentUser.phone)) {
      await saveBatchToSupabase(b);
    }

    setIsEditingSellerProfile(false);
    showToast(t.toasts.profileUpdated);
  };

  // =========================================================================
  // VIVO WATERMARK STAMP + COMPRESS & UPLOAD MEDIA TO SUPABASE STORAGE
  // =========================================================================
  const handleMultiplePcrUpload = async (fileList, isEditMode = false) => {
    if (!fileList || fileList.length === 0) return;
    setMediaPickerTarget(null);
    const filesArray = Array.from(fileList);
    const uploadedResults = [];
    const baseCount = isEditMode ? (editBatchValues.pcrImages || []).length : pcrImages.length;

    setUploadProgress({ active: true, percent: 15, label: 'Generating Security Timestamp & CAA Watermark...' });
    const myCaa = hatcheryProfiles[currentUser?.phone]?.caaLicense || 'CAA-VERIFIED';
    const dateTimeStr = `${new Date().toLocaleDateString('en-IN')} • ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    const vivoMeta = { caaNumber: myCaa, dateTime: dateTimeStr };

    for (let i = 0; i < filesArray.length; i++) {
      const rawFile = filesArray[i];
      setUploadProgress({ active: true, percent: 45, label: `Applying Vivo GPS Stamp & Compressing ${i + 1}/${filesArray.length}...` });

      const readyFile = await stampAndCompressImage(rawFile, vivoMeta, 2 * 1024 * 1024);
      setUploadProgress({ active: true, percent: 80, label: `Uploading Image ${i + 1}/${filesArray.length} to Cloud...` });

      const filePath = `pcr_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.jpg`;
      const { error } = await supabase.storage
        .from('pcr-reports')
        .upload(filePath, readyFile, { upsert: true });

      if (!error) {
        const { data: pub } = supabase.storage.from('pcr-reports').getPublicUrl(filePath);
        uploadedResults.push({
          label: `Image-${baseCount + i + 1}`,
          url: pub.publicUrl,
          stamp: `CAA: ${vivoMeta.caaNumber} | ${vivoMeta.dateTime}`
        });
      } else {
        showToast(`Image Upload Error: ${error.message}`);
      }
    }

    setUploadProgress({ active: true, percent: 100, label: 'Upload Complete!' });
    setTimeout(() => setUploadProgress({ active: false, percent: 0, label: '' }), 850);

    if (uploadedResults.length > 0) {
      if (isEditMode) {
        setEditBatchValues(prev => ({ ...prev, pcrImages: [...(prev.pcrImages || []), ...uploadedResults] }));
      } else {
        setPcrImages(prev => [...prev, ...uploadedResults]);
      }
      showToast(`${uploadedResults.length} PCR image(s) stamped & uploaded!`);
    }
  };

  const handleMultipleVideoUpload = async (fileList, isEditMode = false) => {
    if (!fileList || fileList.length === 0) return;
    setMediaPickerTarget(null);
    const filesArray = Array.from(fileList);
    const uploadedVideos = [];
    const baseCount = isEditMode ? (editBatchValues.tankVideos || []).length : tankVideos.length;

    setUploadProgress({ active: true, percent: 15, label: 'Generating Security Timestamp & CAA Watermark...' });
    const myCaa = hatcheryProfiles[currentUser?.phone]?.caaLicense || 'CAA-VERIFIED';
    const dateTimeStr = `${new Date().toLocaleDateString('en-IN')} • ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    const vivoMeta = { caaNumber: myCaa, dateTime: dateTimeStr };

    for (let i = 0; i < filesArray.length; i++) {
      const rawFile = filesArray[i];
      setUploadProgress({ active: true, percent: 45, label: `Stamping & Compressing Video ${i + 1}/${filesArray.length} (≤10MB)...` });

      const readyVideo = await stampAndCompressVideo(rawFile, vivoMeta, 10 * 1024 * 1024);
      setUploadProgress({ active: true, percent: 80, label: `Uploading Video ${i + 1}/${filesArray.length} to Cloud...` });

      const ext = readyVideo.name.split('.').pop() || 'webm';
      const filePath = `vid_${Date.now()}_${Math.random().toString(36).slice(2, 7)}.${ext}`;

      const { error } = await supabase.storage
        .from('tank-videos')
        .upload(filePath, readyVideo, { upsert: true });

      if (!error) {
        const { data: pub } = supabase.storage.from('tank-videos').getPublicUrl(filePath);
        uploadedVideos.push({
          label: `Tank-Video-${baseCount + i + 1}`,
          url: pub.publicUrl,
          stamp: `CAA: ${vivoMeta.caaNumber} | ${vivoMeta.dateTime}`
        });
      } else {
        showToast(`Video Upload Error: ${error.message}`);
      }
    }

    setUploadProgress({ active: true, percent: 100, label: 'Video Upload Complete!' });
    setTimeout(() => setUploadProgress({ active: false, percent: 0, label: '' }), 850);

    if (uploadedVideos.length > 0) {
      if (isEditMode) {
        setEditBatchValues(prev => ({ ...prev, tankVideos: [...(prev.tankVideos || []), ...uploadedVideos] }));
      } else {
        setTankVideos(prev => [...prev, ...uploadedVideos]);
      }
      showToast(`${uploadedVideos.length} Tank video(s) stamped & uploaded!`);
    }
  };

  const handleCaptureGps = async () => {
    const loc = await getRichLocationDetails();
    setGpsLocation(`${loc.placeName} (${loc.coords})`);
    showToast(t.toasts.gpsLocked);
  };

  // =========================================================================
  // BATCH PUBLISH, PAUSE/RESUME TOGGLE, FULL EDIT & DELETE
  // =========================================================================
  const handlePublishBatch = async (e) => {
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
    const minPackingCount = Math.max(1, Number(newBatchForm.minPackingLakhs) || 1) * 100000;
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
      minPacking: minPackingCount,
      salinity: Number(newBatchForm.salinity) || 16,
      bonusPercent: Number(newBatchForm.bonusPercent) || 15,
      availableDate: newBatchForm.availableDate,
      availableTimeSlot: newBatchForm.availableTimeSlot,
      pcrImages: [...pcrImages],
      tankVideos: [...tankVideos],
      gpsCoords: gpsLocation || '17.0005° N, 82.2510° E',
      paused: false,
      vigorScore: 96
    };

    setBatches([created, ...batches]);
    await saveBatchToSupabase(created);

    setPcrImages([]);
    setTankVideos([]);
    setNewBatchForm(prev => ({ ...prev, batchNumber: '' }));
    showToast(t.toasts.batchPublished);
  };

  const togglePauseBatch = async (batchId) => {
    let updatedObj = null;
    const nextList = batches.map(b => {
      if (b.id !== batchId) return b;
      updatedObj = { ...b, paused: !b.paused };
      return updatedObj;
    });
    setBatches(nextList);
    if (updatedObj) {
      await saveBatchToSupabase(updatedObj);
      showToast(updatedObj.paused ? `Batch ${batchId} paused` : `Batch ${batchId} is now LIVE!`);
    }
  };

  const startEditingBatch = (batch) => {
    setEditingBatchId(batch.id);
    const isMillions = (batch.availableStock || 0) >= 1000000 && (batch.availableStock % 1000000 === 0);
    const amountVal = isMillions
      ? Math.max(1, Math.round(batch.availableStock / 1000000))
      : Math.max(1, Math.round((batch.availableStock || 100000) / 100000));

    setEditBatchValues({
      species: batch.species || 'Litopenaeus vannamei (SyAqua Line)',
      broodstock: batch.broodstock || 'SyAqua USA / Thailand Certified',
      plStage: batch.plStage || 'PL12',
      salinity: batch.salinity || 16,
      pricePer1000: batch.pricePer1000 || 0.43,
      stockAmount: amountVal,
      stockUnit: isMillions ? 'MILLIONS' : 'LAKHS',
      minPackingLakhs: Math.max(1, Math.round((batch.minPacking || 100000) / 100000)),
      bonusPercent: batch.bonusPercent || 15,
      availableDate: batch.availableDate || new Date().toISOString().split('T')[0],
      availableTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
      pcrImages: [...(batch.pcrImages || [])],
      tankVideos: [...(batch.tankVideos || [])],
      removedPcrUrls: [],
      removedVideoUrls: []
    });
  };

  const saveEditedBatch = async (batchId) => {
    const updatedStock = computeSeedCount(editBatchValues.stockAmount, editBatchValues.stockUnit);
    let updatedObj = null;
    const updatedList = batches.map(b => {
      if (b.id !== batchId) return b;
      updatedObj = {
        ...b,
        species: editBatchValues.species,
        broodstock: editBatchValues.broodstock,
        plStage: editBatchValues.plStage,
        salinity: Number(editBatchValues.salinity),
        pricePer1000: Number(editBatchValues.pricePer1000),
        availableStock: updatedStock,
        minPacking: Math.max(1, Number(editBatchValues.minPackingLakhs) || 1) * 100000,
        bonusPercent: Number(editBatchValues.bonusPercent),
        availableDate: editBatchValues.availableDate,
        availableTimeSlot: editBatchValues.availableTimeSlot,
        pcrImages: [...(editBatchValues.pcrImages || [])],
        tankVideos: [...(editBatchValues.tankVideos || [])]
      };
      return updatedObj;
    });

    await deleteStorageFilesByUrls(editBatchValues.removedPcrUrls, 'pcr-reports');
    await deleteStorageFilesByUrls(editBatchValues.removedVideoUrls, 'tank-videos');

    setBatches(updatedList);
    if (updatedObj) await saveBatchToSupabase(updatedObj);
    setEditingBatchId(null);
    showToast(t.toasts.batchUpdated);
  };

  const removeBatch = async (batchId) => {
    const targetBatch = batches.find(b => b.id === batchId);
    if (targetBatch) {
      await deleteStorageFilesByUrls((targetBatch.pcrImages || []).map(i => i.url), 'pcr-reports');
      await deleteStorageFilesByUrls((targetBatch.tankVideos || []).map(v => v.url), 'tank-videos');
    }
    setBatches(batches.filter(b => b.id !== batchId));
    await supabase.from('batches').delete().eq('id', batchId);
    showToast(t.toasts.batchRemoved);
  };

  // =========================================================================
  // BOOKING & PAYMENT FLOW (WITH BLURRED-TO-REVEAL QR GENERATOR)
  // =========================================================================
  const finalizeBookingRecord = async (paymentRef, qty, hatcheryFixedCost, marginPaiseNum, transportCost, advance4Pct, isFullPayment = false) => {
    const bonusSeeds = Math.round(qty * ((selectedBatch.bonusPercent || 15) / 100));
    const matchedBrokerFarmer = brokerFarmers.find(
      (f) => (f.phone || '').slice(-10) === (bookingForm.farmerPhone || '').slice(-10)
    );
    const isBrokerLinked = Boolean(matchedBrokerFarmer) || currentUser?.role === 'mediator';

    const silentPlatform2Pct = Math.round(hatcheryFixedCost * 0.02);
    const hold2Pct = Math.max(0, advance4Pct - silentPlatform2Pct);
    const brokerExtraMarginTotal = isBrokerLinked ? Math.round(qty * (marginPaiseNum / 100)) : 0;
    const totalFarmerPayable = hatcheryFixedCost + brokerExtraMarginTotal + transportCost;
    const paidNow = isFullPayment ? totalFarmerPayable : advance4Pct;
    const balanceAtPacking = isFullPayment ? 0 : (totalFarmerPayable - advance4Pct);

    const now = new Date();
    const issueDateStr = now.toLocaleDateString('en-IN');
    const issueTimeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newBooking = {
      bookingId: `AQ-${Math.floor(10000 + Math.random() * 90000)}`,
      gatePassPin: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: paymentRef,
      paymentMode: bookingForm.paymentMethod,
      paymentOption: isFullPayment ? 'FULL' : 'ADVANCE',
      fullPaid: isFullPayment,
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
      tokenAdvance: paidNow,
      balanceAtPacking,
      clearedAt: isFullPayment ? `${issueDateStr} ${issueTimeStr}` : undefined,
      settlement: {
        hold2PctAmount: hold2Pct,
        brokerBase2Pct: isBrokerLinked ? hold2Pct : 0,
        farmerRefundable2Pct: !isBrokerLinked ? hold2Pct : 0,
        status: isFullPayment ? 'BALANCE_CLEARED' : 'ADVANCE_HOLD'
      },
      packingStatus: 'PACKING_PENDING',
      gatePassCleared: false,
      rated: false
    };

    const updatedBatch = {
      ...selectedBatch,
      availableStock: Math.max(0, (selectedBatch.availableStock || 0) - qty)
    };

    setBatches(prev => prev.map(b => (b.id === selectedBatch.id ? updatedBatch : b)));
    setBookings([newBooking, ...bookings]);

    await saveBookingToSupabase(newBooking);
    await saveBatchToSupabase(updatedBatch);

    await pushAppNotification(
      selectedBatch.ownerPhone,
      'seller',
      `New Seed Booking (${newBooking.bookingId})`,
      `${bookingForm.farmerName} booked ${qty.toLocaleString('en-IN')} PL (${isFullPayment ? '100% Full Paid' : '4% Advance Paid'}).`,
      { bookingId: newBooking.bookingId, batchId: selectedBatch.id, farmerName: bookingForm.farmerName, farmerPhone: bookingForm.farmerPhone, amount: paidNow, packingDate: bookingForm.packingDate }
    );
    await pushAppNotification(
      bookingForm.farmerPhone,
      'buyer',
      isFullPayment ? `Full Payment Confirmed (${newBooking.bookingId})` : `Booking Confirmed (${newBooking.bookingId})`,
      `Your slot at ${selectedBatch.realName} for ${qty.toLocaleString('en-IN')} PL is confirmed. Gate-Pass PIN: ${newBooking.gatePassPin}.`,
      { bookingId: newBooking.bookingId, batchId: selectedBatch.id, hatcheryName: selectedBatch.realName, amount: paidNow, balance: balanceAtPacking }
    );

    setSelectedBatch(null);
    setModalError('');
    setBookingForm(prev => ({ ...prev, utrReference: '', qrRevealed: false, paymentOption: 'ADVANCE' }));
    setActiveInvoice({ booking: newBooking, receiptType: isFullPayment ? 'FINAL' : 'ADVANCE' });
    showToast(isFullPayment ? '100% Full Payment confirmed! Final Receipt & Gate-Pass ready.' : t.toasts.paymentSuccess);
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
    const minPackingQty = selectedBatch.minPacking || 100000;
    if (requestedQty < minPackingQty) {
      setModalError(`Minimum Packing required is ${(minPackingQty / 100000).toFixed(1).replace(/\.0$/, '')} Lakh PL (${minPackingQty.toLocaleString('en-IN')} PL).`);
      return;
    }
    if (requestedQty > (selectedBatch.availableStock || 0)) {
      setModalError(`Requested quantity (${requestedQty.toLocaleString('en-IN')} PL) exceeds available hatchery stock (${(selectedBatch.availableStock || 0).toLocaleString('en-IN')} PL).`);
      return;
    }

    const marginPaiseNum = Math.min(99, Math.max(0, Number(bookingForm.brokerMarginPaise) || 0));
    const hatcheryFixedCost = Math.round(requestedQty * (selectedBatch.pricePer1000 || 0.42));
    const transportCost = bookingForm.includeTransport ? 1500 : 0;
    const brokerExtraMarginTotal = currentUser?.role === 'mediator' ? Math.round(requestedQty * (marginPaiseNum / 100)) : 0;
    const totalPayable = hatcheryFixedCost + brokerExtraMarginTotal + transportCost;
    const advance4Pct = Math.max(800, Math.round(hatcheryFixedCost * 0.04));
    const isFullPayment = bookingForm.paymentOption === 'FULL';
    const chargeNow = isFullPayment ? totalPayable : advance4Pct;

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
        isFullPayment
      );
      return;
    }

    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (rzpKey && window.Razorpay) {
      const options = {
        key: rzpKey,
        amount: chargeNow * 100,
        currency: 'INR',
        name: 'Aqua Mark',
        description: `${selectedBatch.plStage} Seed ${isFullPayment ? '100% Full Payment' : '4% Advance'} (${requestedQty.toLocaleString('en-IN')} PL)`,
        prefill: { name: bookingForm.farmerName || 'Farmer', contact: bookingForm.farmerPhone, method: 'upi' },
        theme: { color: '#0d9488' },
        handler: function (response) {
          finalizeBookingRecord(response.razorpay_payment_id, requestedQty, hatcheryFixedCost, marginPaiseNum, transportCost, advance4Pct, isFullPayment);
        }
      };
      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', (resp) => setModalError(`Payment Failed: ${resp.error?.description || 'Cancelled'}`));
      rzp.open();
    } else {
      finalizeBookingRecord(`RZP_${Math.floor(100000 + Math.random() * 900000)}`, requestedQty, hatcheryFixedCost, marginPaiseNum, transportCost, advance4Pct, isFullPayment);
    }
  };

  const handleBuyerCancelBooking = async (bk) => {
    const updatedBk = {
      ...bk,
      packingStatus: 'CANCELLED',
      settlement: { ...bk.settlement, status: 'CANCELLED_REFUNDED' }
    };
    setBookings(prev => prev.map(item => (item.bookingId === bk.bookingId ? updatedBk : item)));
    await saveBookingToSupabase(updatedBk);

    const targetBatch = batches.find(b => b.id === bk.batch?.id);
    if (targetBatch) {
      const restoredBatch = { ...targetBatch, availableStock: (targetBatch.availableStock || 0) + (bk.quantity || 0) };
      setBatches(prev => prev.map(b => (b.id === restoredBatch.id ? restoredBatch : b)));
      await saveBatchToSupabase(restoredBatch);
    }
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

  const handleConfirmLiveVideoRequest = async (e) => {
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
    const nextReqs = [reqObj, ...liveVideoRequests];
    setLiveVideoRequests(nextReqs);
    await saveKvToSupabase('live_videos', nextReqs);
    setVideoRequestTargetBatch(null);
    showToast(t.toasts.liveVideoRequested);
  };

  const handleSellerMarkPacked = async (bookingId) => {
    let targetBk = null;
    const nextList = bookings.map(bk => {
      if (bk.bookingId !== bookingId) return bk;
      targetBk = { ...bk, packingStatus: 'PACKING_DONE_BY_SELLER' };
      return targetBk;
    });
    setBookings(nextList);
    if (sellerTxModal) {
      setSellerTxModal(prev => ({
        ...prev,
        list: prev.list.map(item => (item.bookingId === bookingId ? targetBk : item))
      }));
    }
    if (targetBk) {
      await saveBookingToSupabase(targetBk);
      await pushAppNotification(
        targetBk.farmerPhone,
        'buyer',
        `Packing Ready (${targetBk.bookingId})`,
        `${targetBk.batch?.realName} marked packing complete for Batch ${targetBk.batch?.id}. Present Gate-Pass QR at gate.`,
        { bookingId: targetBk.bookingId, batchId: targetBk.batch?.id, hatcheryName: targetBk.batch?.realName, balance: targetBk.balanceAtPacking }
      );
    }
    showToast(t.toasts.packingMarked);
  };

  const handleHatcheryPaymentReceived = async (bookingId) => {
    const now = new Date();
    const clearedStamp = `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    let targetBk = null;

    const nextList = bookings.map(bk => {
      if (bk.bookingId !== bookingId) return bk;
      targetBk = {
        ...bk,
        packingStatus: 'FINAL_CLEARED',
        fullPaid: true,
        balanceAtPacking: 0,
        clearedAt: clearedStamp,
        settlement: { ...bk.settlement, status: 'BALANCE_CLEARED' }
      };
      return targetBk;
    });
    setBookings(nextList);
    if (sellerTxModal) {
      setSellerTxModal(prev => ({
        ...prev,
        list: prev.list.map(item => (item.bookingId === bookingId ? targetBk : item))
      }));
    }
    if (targetBk) {
      await saveBookingToSupabase(targetBk);
      await pushAppNotification(
        targetBk.farmerPhone,
        'buyer',
        `Payment Settled & 2% Cashback Refunded (${targetBk.bookingId})`,
        `Full balance settled for ${targetBk.batch?.realName}. 2% Cashback Hold (₹${(targetBk.settlement?.farmerRefundable2Pct || 0).toLocaleString('en-IN')}) refunded to your account.`,
        { bookingId: targetBk.bookingId, cashback: targetBk.settlement?.farmerRefundable2Pct || 0, totalPaid: targetBk.totalSeedCost }
      );
    }
    showToast(t.toasts.paymentReceivedDone);
  };

  const handleAddHatcheryDepositMoney = async (e) => {
    e.preventDefault();
    const amt = Number(addDepositAmount) || 0;
    if (amt < 500) {
      showToast('Minimum deposit top-up is ₹500.');
      return;
    }
    if ((addDepositMethod === 'DIRECT_UPI' || addDepositMethod === 'BANK_TO_BANK') && !addDepositUtr.trim()) {
      showToast(t.toasts.enterUtr);
      return;
    }
    const ref = addDepositMethod === 'RAZORPAY'
      ? `RZP_DEP_${Math.floor(100000 + Math.random() * 900000)}`
      : `${addDepositMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT'}_${addDepositUtr.trim().toUpperCase()}`;

    const prevAmt = Number(hatcheryProfiles[currentUser.phone]?.depositAmount || 10000);
    const nextAmt = prevAmt + amt;
    const nextHatcheries = {
      ...hatcheryProfiles,
      [currentUser.phone]: {
        ...hatcheryProfiles[currentUser.phone],
        depositPaid: true,
        depositAmount: nextAmt,
        depositSourceAccount: ref
      }
    };
    setHatcheryProfiles(nextHatcheries);
    await saveKvToSupabase('hatcheries', nextHatcheries);
    await pushAppNotification(
      currentUser.phone,
      'seller',
      `₹${amt.toLocaleString('en-IN')} Deposit Added`,
      `Your Hatchery Security Deposit balance is now ₹${nextAmt.toLocaleString('en-IN')} (Ref: ${ref}).`,
      { amountAdded: amt, newBalance: nextAmt, ref }
    );
    setAddDepositUtr('');
    setAddDepositQrRevealed(false);
    showToast(`₹${amt.toLocaleString('en-IN')} added! Total Deposit: ₹${nextAmt.toLocaleString('en-IN')}`);
  };

  const handleSellerScanQrComplete = async (rawInput) => {
    setScanQrError('');
    const cleaned = (rawInput || '').trim();
    if (!cleaned) {
      setScanQrError('Please enter or scan a Booking ID / Gate-Pass QR code.');
      return;
    }
    let matchedId = cleaned;
    if (cleaned.includes('AQUAMARK-GATEPASS:')) {
      const part = cleaned.split('AQUAMARK-GATEPASS:')[1] || '';
      matchedId = part.split('|')[0].trim();
    }
    const targetBk = bookings.find(
      bk => bk.hatcheryOwnerPhone === currentUser?.phone &&
        (bk.bookingId.toUpperCase() === matchedId.toUpperCase() || (bk.gatePassPin || '').toUpperCase() === matchedId.toUpperCase())
    );
    if (!targetBk) {
      setScanQrError('No matching active booking found for this Hatchery Gate-Pass QR / Booking ID.');
      return;
    }
    if (targetBk.settlement?.status === 'CANCELLED_REFUNDED') {
      setScanQrError('This booking was cancelled and cannot be scanned.');
      return;
    }

    const now = new Date();
    const clearedStamp = `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const updatedBk = {
      ...targetBk,
      packingStatus: 'FINAL_CLEARED',
      gatePassCleared: true,
      fullPaid: true,
      balanceAtPacking: 0,
      clearedAt: clearedStamp,
      settlement: { ...targetBk.settlement, status: 'BALANCE_CLEARED' }
    };

    setBookings(prev => prev.map(b => (b.bookingId === updatedBk.bookingId ? updatedBk : b)));
    await saveBookingToSupabase(updatedBk);

    await pushAppNotification(
      updatedBk.farmerPhone,
      'buyer',
      `Packing Completed & Payment Settled (${updatedBk.bookingId})`,
      `Your Gate-Pass QR was scanned by ${updatedBk.batch?.realName}. Packing is complete, payment is settled, 2% Cashback (₹${(updatedBk.settlement?.farmerRefundable2Pct || 0).toLocaleString('en-IN')}) refunded, and your Full Paid Receipt is ready!`,
      { bookingId: updatedBk.bookingId, batchId: updatedBk.batch?.id, hatcheryName: updatedBk.batch?.realName, clearedAt: clearedStamp, totalPaid: updatedBk.totalSeedCost }
    );
    await pushAppNotification(
      currentUser.phone,
      'seller',
      `Gate-Pass Scanned (${updatedBk.bookingId})`,
      `Packing marked complete & payment settled for ${updatedBk.farmerName} (${(updatedBk.quantity || 0).toLocaleString('en-IN')} PL).`,
      { bookingId: updatedBk.bookingId, farmerName: updatedBk.farmerName, amount: updatedBk.totalSeedCost }
    );

    setShowSellerScanQrModal(false);
    setScanQrInput('');
    setActiveInvoice({ booking: updatedBk, receiptType: 'FINAL' });
    showToast(`QR Verified! ${updatedBk.bookingId} marked Packing Completed & Payment Settled.`);
  };

  const handleBuyerPayRemainingSubmit = async (e) => {
    e.preventDefault();
    if (!payRemainingBooking) return;
    const bk = payRemainingBooking;
    if ((payRemainingForm.paymentMethod === 'DIRECT_UPI' || payRemainingForm.paymentMethod === 'BANK_TO_BANK') && !payRemainingForm.utrReference.trim()) {
      showToast(t.toasts.enterUtr);
      return;
    }
    const prefix = payRemainingForm.paymentMethod === 'DIRECT_UPI' ? 'UPI' : payRemainingForm.paymentMethod === 'BANK_TO_BANK' ? 'NEFT' : 'RZP';
    const ref = payRemainingForm.paymentMethod === 'RAZORPAY'
      ? `RZP_BAL_${Math.floor(100000 + Math.random() * 900000)}`
      : `${prefix}_${payRemainingForm.utrReference.trim().toUpperCase()}`;

    const now = new Date();
    const clearedStamp = `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const updatedBk = {
      ...bk,
      fullPaid: true,
      balancePaymentRef: ref,
      tokenAdvance: bk.totalSeedCost,
      balanceAtPacking: 0,
      clearedAt: clearedStamp,
      settlement: { ...bk.settlement, status: 'BALANCE_CLEARED' }
    };

    setBookings(prev => prev.map(item => (item.bookingId === bk.bookingId ? updatedBk : item)));
    await saveBookingToSupabase(updatedBk);

    await pushAppNotification(
      bk.hatcheryOwnerPhone,
      'seller',
      `Full Remaining Payment Received (${bk.bookingId})`,
      `${bk.farmerName} paid remaining ₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')} (Ref: ${ref}).`,
      { bookingId: bk.bookingId, farmerName: bk.farmerName, amount: bk.balanceAtPacking, ref }
    );
    await pushAppNotification(
      bk.farmerPhone,
      'buyer',
      `Full Payment Completed (${bk.bookingId})`,
      `Remaining balance of ₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')} paid. Your Final Cleared Receipt is ready.`,
      { bookingId: bk.bookingId, amount: bk.balanceAtPacking, ref }
    );

    setPayRemainingBooking(null);
    setPayRemainingForm({ paymentMethod: 'DIRECT_UPI', upiSubMode: 'QR', qrRevealed: false, utrReference: '' });
    setActiveInvoice({ booking: updatedBk, receiptType: 'FINAL' });
    showToast('Remaining balance paid! Final Cleared Receipt generated.');
  };

  const openAnimatedStatusModal = (bk) => {
    setStatusModalBooking(bk);
    setStatusAnimStep(0);
    setTimeout(() => setStatusAnimStep(1), 180);
    setTimeout(() => setStatusAnimStep(2), 480);
    setTimeout(() => setStatusAnimStep(3), 780);
    setTimeout(() => setStatusAnimStep(4), 1080);
  };

  const handleSubmitRatingAndFeedback = async (bookingId, batchId) => {
    const draft = ratingDrafts[bookingId] || { stars: 5, comment: '' };
    const stars = Number(draft.stars) || 5;
    const comment = (draft.comment || '').trim();

    let updatedBk = null;
    setBookings(bookings.map(bk => {
      if (bk.bookingId !== bookingId) return bk;
      updatedBk = { ...bk, rated: true, userRating: stars, userFeedback: comment };
      return updatedBk;
    }));
    if (updatedBk) await saveBookingToSupabase(updatedBk);

    let updatedBatch = null;
    setBatches(batches.map(b => {
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
      updatedBatch = {
        ...b,
        rating: newAvg,
        reviewCount: newCount,
        reviews: [newReviewObj, ...(b.reviews || [])]
      };
      return updatedBatch;
    }));
    if (updatedBatch) await saveBatchToSupabase(updatedBatch);
    showToast(`${t.ratedLabel} (${stars}★)`);
  };

  const handleShareBatchFlyer = (batch) => {
    const flyer = `🦐 *Aqua Mark Verified Seed Batch*\n• Batch: ${batch.id} (${batch.plStage})\n• Species: ${batch.species}\n• Rate: ₹${(batch.pricePer1000 || 0).toFixed(2)}/seed (+${batch.bonusPercent}% Bonus)\n• Salinity: ${batch.salinity} PPT | Zone: ${batch.zone}\nBook direct on Aqua Mark!`;
    if (navigator.clipboard) navigator.clipboard.writeText(flyer).catch(() => { });
    window.open(`https://wa.me/?text=${encodeURIComponent(flyer)}`, '_blank');
  };

  const handleSendBilingualBookingSummary = (bk) => {
    const msg = lang === 'te'
      ? `🦐 *Aqua Mark అధికారిక సీడ్ బుకింగ్ సారాంశం*\n• Booking ID: ${bk.bookingId} (Gate-Pass: ${bk.gatePassPin || 'GP-1024'})\n• హేచరీ: ${bk.batch?.realName}\n• బ్యాచ్: ${bk.batch?.id} (${bk.batch?.plStage})\n• పరిమాణం: ${(bk.quantity || 0).toLocaleString('en-IN')} + ${(bk.bonusSeeds || 0).toLocaleString('en-IN')} బోనస్ PL\n• ప్యాకింగ్ తేదీ: ${bk.packingDate} (${bk.packingTimeSlot})\n• చెల్లించిన అడ్వాన్స్: ₹${(bk.tokenAdvance || 0).toLocaleString('en-IN')}\n• ప్యాకింగ్ వద్ద బ్యాలెన్స్: ₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')}`
      : `🦐 *Aqua Mark Official Seed Booking Summary*\n• Booking ID: ${bk.bookingId} (Gate-Pass: ${bk.gatePassPin || 'GP-1024'})\n• Hatchery: ${bk.batch?.realName}\n• Batch: ${bk.batch?.id} (${bk.batch?.plStage})\n• Qty: ${(bk.quantity || 0).toLocaleString('en-IN')} + ${(bk.bonusSeeds || 0).toLocaleString('en-IN')} Bonus PL\n• Packing: ${bk.packingDate} (${bk.packingTimeSlot})\n• Advance Paid: ₹${(bk.tokenAdvance || 0).toLocaleString('en-IN')}\n• Balance at Packing: ₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')}`;
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

    const verifyHash = `AQM-${bk.bookingId.replace('AQ-', '')}-${(bk.paymentId || '000000').slice(-6).toUpperCase()}`;
    const totalWithBonus = (bk.quantity || 0) + (bk.bonusSeeds || 0);
    const issueTime = bk.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    const pcrLabels = (bk.batch?.pcrImages || []).map(img => img.label).join(', ') || 'Image-1';
    const srcPpt = Number(bk.batch?.salinity || 16);
    const dstPpt = Number(bk.pondSalinity || 15);
    const pptVariance = Math.abs(srcPpt - dstPpt);
    const transportLabel = bk.includeTransport ? 'Oxygen Van Delivery' : 'Self Pickup from Hatchery';
    const bonusPct = bk.batch?.bonusPercent || 15;
    const isPaidFull = isFinalCleared || bk.fullPaid || bk.balanceAtPacking === 0;

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AquaMark_Certificate_${bk.bookingId}</title>
        <style>
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          body { margin: 0; padding: 0; color: #0f172a; background: #fff; }
          .sheet { position: relative; border: 2px solid #0f766e; border-radius: 16px; padding: 20px 22px; min-height: 274mm; display: flex; flex-direction: column; justify-content: space-between; overflow: hidden; }
          .bg-wm { position: absolute; top: 46%; left: 50%; transform: translate(-50%, -50%) rotate(-18deg); font-size: 46px; font-weight: 900; color: rgba(15, 118, 110, 0.06); white-space: nowrap; pointer-events: none; letter-spacing: 3px; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 1.5px solid #e2e8f0; padding-bottom: 14px; }
          .brand-wrap { display: flex; align-items: center; gap: 12px; }
          .logo-box { width: 42px; height: 42px; border: 1.5px solid #99f6e4; background: #f0fdfa; border-radius: 10px; display: flex; align-items: center; justify-content: center; padding: 4px; }
          .brand-title { font-size: 22px; font-weight: 900; color: #0f766e; margin: 0; letter-spacing: -0.3px; }
          .brand-sub { font-size: 11px; color: #475569; margin: 2px 0 0; }
          .verified-stamp { background: #ecfdf5; border: 1.5px solid #6ee7b7; color: #065f46; padding: 8px 14px; border-radius: 10px; text-align: right; font-size: 10.5px; line-height: 1.45; }
          .verified-stamp strong { font-size: 11.5px; letter-spacing: 0.3px; }
          .meta-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 10px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; margin-top: 14px; font-size: 11px; line-height: 1.45; }
          .meta-bar strong { color: #334155; font-size: 10.5px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
          .box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 14px; font-size: 11.5px; line-height: 1.55; background: rgba(255,255,255,0.92); }
          .box p { margin: 2px 0; }
          .box-title { font-size: 10.5px; font-weight: 800; text-transform: uppercase; color: #0f766e; margin-bottom: 6px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; letter-spacing: 0.3px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 11.5px; background: rgba(255,255,255,0.92); }
          th { background: #0f766e; color: #fff; text-align: left; padding: 9px 10px; font-size: 10px; text-transform: uppercase; letter-spacing: 0.3px; }
          td { padding: 10px; border: 1px solid #cbd5e1; vertical-align: top; }
          .totals-box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 14px; background: #f8fafc; font-size: 11.5px; }
          .totals-row { display: flex; justify-content: space-between; padding: 3.5px 0; }
          .totals-highlight { border-top: 1.5px solid #cbd5e1; margin-top: 5px; padding-top: 6px; font-weight: 800; color: #065f46; }
          .terms-box { border: 1px solid #a7f3d0; background: #f0fdf4; border-radius: 10px; padding: 12px 14px; margin-top: 14px; font-size: 10.8px; line-height: 1.55; color: #064e3b; }
          .terms-box strong { display: block; margin-bottom: 4px; color: #0f766e; font-size: 11px; }
          .checklist-box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; margin-top: 12px; font-size: 10.5px; color: #334155; background: #fff; }
          .footer { margin-top: 18px; padding-top: 12px; border-top: 1.5px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10.5px; color: #475569; text-align: center; }
          .sig-line { border-top: 1px solid #94a3b8; width: 150px; padding-top: 4px; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="bg-wm">AQUA MARK VERIFIED</div>
          <div>
            <div class="header">
              <div class="brand-wrap">
                <div class="logo-box">
                  <img src="/favicon.svg" alt="Aqua Mark" style="width:100%;height:100%;object-fit:contain;" />
                </div>
                <div>
                  <h1 class="brand-title">AQUA MARK</h1>
                  <p class="brand-sub">Official Aquaculture Seed Booking & Quality Certificate</p>
                </div>
              </div>
              <div class="verified-stamp">
                <strong>${isPaidFull ? '100% PAID & VERIFIED CERTIFICATE' : '100% VERIFIED CERTIFICATE'}</strong><br/>
                <span>Date: ${bk.date} • Time: ${issueTime}</span><br/>
                <span>Hash: ${verifyHash}</span>
              </div>
            </div>

            <div class="meta-bar">
              <div><strong>Booking ID:</strong><br/>${bk.bookingId}</div>
              <div><strong>Payment Ref:</strong><br/>${bk.paymentId}</div>
              <div><strong>Generated At:</strong><br/>${bk.date} (${issueTime})</div>
              <div><strong>Scheduled Packing:</strong><br/>${bk.packingDate}</div>
            </div>

            <div class="grid-2">
              <div class="box">
                <div class="box-title">Buyer / Farmer Details</div>
                <p><strong>Farmer Name:</strong> ${bk.farmerName}</p>
                <p><strong>WhatsApp / Mobile:</strong> +91 ${bk.farmerPhone}</p>
                <p><strong>Target Pond Salinity:</strong> ${dstPpt} PPT</p>
                <p><strong>Transport Mode:</strong> ${transportLabel}</p>
              </div>
              <div class="box">
                <div class="box-title">Hatchery (Seller) Details</div>
                <p><strong>Hatchery Name:</strong> ${bk.batch?.realName}</p>
                <p><strong>CAA Reg. Number:</strong> ${bk.batch?.caaLicense}</p>
                <p><strong>Hatchery Phone:</strong> +91 ${bk.batch?.realPhone}</p>
                <p><strong>Facility Address:</strong> ${bk.batch?.realAddress} (${bk.batch?.zone || 'Coastal Zone'})</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Batch & Species</th>
                  <th>Stage</th>
                  <th>Hatchery PPT</th>
                  <th>Booked Qty</th>
                  <th>Bonus (+${bonusPct}%)</th>
                  <th>Total Packing Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${bk.batch?.id} — ${bk.batch?.species}</strong><br/><small style="color:#475569;">PCR Lab Attachments: ${pcrLabels}</small></td>
                  <td>${bk.batch?.plStage}</td>
                  <td>${srcPpt} PPT</td>
                  <td>${(bk.quantity || 0).toLocaleString('en-IN')} PL</td>
                  <td style="color:#059669;font-weight:700;">+${(bk.bonusSeeds || 0).toLocaleString('en-IN')} PL</td>
                  <td><strong>${totalWithBonus.toLocaleString('en-IN')} PL</strong></td>
                </tr>
              </tbody>
            </table>

            <div class="grid-2">
              <div class="box">
                <div class="box-title">Salinity Acclimatization & Packing Schedule</div>
                <p><strong>Source Tank Salinity:</strong> ${srcPpt} PPT</p>
                <p><strong>Destination Pond Salinity:</strong> ${dstPpt} PPT</p>
                <p><strong>Variance:</strong> ${pptVariance} PPT (Adjust 1 PPT / 4 hrs)</p>
                <p><strong>Packing Slot:</strong> ${bk.packingTimeSlot || 'All Day'}</p>
              </div>
              <div class="totals-box">
                <div class="totals-row"><span>Unit Seed Rate:</span><span>₹${(bk.hatcheryFixedRate || bk.batch?.pricePer1000 || 0.43).toFixed(2)} / seed</span></div>
                <div class="totals-row"><span>Total Order Value:</span><span><b>₹${(bk.totalSeedCost || 0).toLocaleString('en-IN')}</b></span></div>
                <div class="totals-row totals-highlight"><span>${isPaidFull ? 'Total Paid (100% Settled):' : '4% Advance Paid:'}</span><span>₹${(isPaidFull ? bk.totalSeedCost : bk.tokenAdvance || 0).toLocaleString('en-IN')}</span></div>
                <div class="totals-row"><span>${isPaidFull ? 'Remaining Balance:' : '96% Balance at Hatchery:'}</span><span><b>₹${(isPaidFull ? 0 : bk.balanceAtPacking || 0).toLocaleString('en-IN')}</b></span></div>
              </div>
            </div>

            <div class="terms-box">
              <strong>Mandatory Hatchery Quality & Bio-Security Terms:</strong>
              1. Hatchery certifies that the above batch is quality-tested for WSSV, EHP, IHHNV, and TSV as per attached PCR reports (${pcrLabels}).<br/>
              2. Oxygen packing density must not exceed 1,000 PL per liter for transit durations exceeding 4 hours.<br/>
              3. Farmer must inspect active swimming behavior and sample count at the hatchery before confirming final release.
            </div>

            <div class="checklist-box">
              <strong>Gate Dispatch Verification Checklist:</strong> &nbsp;&nbsp;
              [ ✓ ] CAA License Verified &nbsp;&nbsp;&nbsp;
              [ ✓ ] PCR Lab Images Attached (${pcrLabels}) &nbsp;&nbsp;&nbsp;
              [ ✓ ] ${isPaidFull ? '100% Payment Settled' : '4% Advance Confirmed'} &nbsp;&nbsp;&nbsp;
              [ ${bk.gatePassCleared ? '✓' : '&nbsp;'} ] Oxygen Packing Count Checked at Hatchery
            </div>
          </div>

          <div class="footer">
            <div class="sig-line">Farmer / Buyer Signature</div>
            <div><strong>Digitally Verified by Aqua Mark</strong><br/>Timestamp: ${bk.date} ${issueTime}</div>
            <div class="sig-line">Authorized Hatchery Seal & Sign</div>
          </div>
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

  const handleAddBrokerFarmer = async (e) => {
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
    const nextFarmers = [entry, ...brokerFarmers];
    setBrokerFarmers(nextFarmers);
    await saveKvToSupabase('farmers', nextFarmers);
    setNewFarmer({ name: '', phone: '', village: '', acres: '' });
    showToast(t.toasts.farmerLocked);
  };

  const handleAddPondLog = async (e) => {
    e.preventDefault();
    const entry = {
      id: `PND-${farmerPonds.length + 1}`,
      ...newPondForm,
      loggedAt: new Date().toLocaleDateString('en-IN')
    };
    const nextPonds = [entry, ...farmerPonds];
    setFarmerPonds(nextPonds);
    await saveKvToSupabase('ponds', nextPonds);
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
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5">
              <img src="/favicon.svg" alt="Aqua Mark Logo" className="w-full h-full object-contain" />
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

            {/* ROLE TABS (BUYER / SELLER / MEDIATOR — COMPLETELY SEPARATE REGISTRATIONS) */}
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

            {/* SIGN UP & LOGIN TABS UNDERNEATH */}
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

            {/* MODE A: SIGN UP */}
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

            {/* MODE B: LOGIN */}
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

            {/* MODE C: FORGOT PASSWORD */}
            {authMode === 'forgot' && (
              <form onSubmit={handleCompleteSignUpOrReset} className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs font-bold text-amber-500 flex items-center justify-between">
                  <span>{t.resetPasswordTitle}</span>
                  <button type="button" onClick={() => setAuthMode('login')} className="underline text-[11px] cursor-pointer">
                    {t.back}
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
          Aqua Mark © 2026 • Live Cloud Database Connected
        </footer>
      </div>
    );
  }

  // =========================================================================
  // ROLE-SPECIFIC COMPUTED DATA
  // =========================================================================
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

  const buyerRefundedTotal = currentUser.role === 'buyer'
    ? bookings
      .filter(b => b.farmerPhone === currentUser.phone && !b.isBrokerLinked && (b.settlement?.status === 'BALANCE_CLEARED' || b.settlement?.status === 'CANCELLED_REFUNDED'))
      .reduce((sum, b) => sum + (b.settlement?.farmerRefundable2Pct || 0), 0)
    : 0;

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
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5">
              <img src="/favicon.svg" alt="Aqua Mark Logo" className="w-full h-full object-contain" />
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

            {/* HATCHERY SCAN QR BUTTON NEXT TO REFRESH */}
            {currentUser.role === 'seller' && isSellerDepositPaid && myFixedHatchery && (
              <button
                type="button"
                onClick={() => { setScanQrInput(''); setScanQrError(''); setShowSellerScanQrModal(true); }}
                className="inline-flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold cursor-pointer"
                title="Scan Buyer Gate-Pass QR"
              >
                <QrCode className="w-3.5 h-3.5" /> Scan QR
              </button>
            )}

            {/* LIVE CLOUD SYNC REFRESH BUTTON */}
            <button
              type="button"
              onClick={handleManualCloudSync}
              className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
              title="Sync Live Cloud Data"
            >
              <RefreshCw className={`w-4 h-4 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* NOTIFICATION BELL BUTTON FOR ALL USERS */}
            {(() => {
              const myUnreadCount = notifications.filter(
                n => n.targetPhone === currentUser.phone && (!n.targetRole || n.targetRole === currentUser.role) && !n.read
              ).length;
              return (
                <button
                  type="button"
                  onClick={() => { setSelectedNotifDetail(null); setShowNotifPanel(true); }}
                  className={`relative p-2 rounded-xl border cursor-pointer ${subCardBg}`}
                  title="Notifications"
                >
                  <Bell className="w-4 h-4 text-teal-600" />
                  {myUnreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[9px] font-black w-4 h-4 rounded-full flex items-center justify-center">
                      {myUnreadCount > 9 ? '9+' : myUnreadCount}
                    </span>
                  )}
                </button>
              );
            })()}

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
              className="inline-flex items-center gap-1.5 bg-teal-600 hover:bg-teal-700 px-[13px] py-[5px] rounded-xl text-[11px] font-bold text-white cursor-pointer"
            >
              <LogOut className="w-3 h-3" /> {t.logout}
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
                  /* INTERNAL SCROLLABLE HATCHERIES CONTAINER */
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
                                    {/* FEATURE 1: PL VIGOR & STRESS-TEST LAB SCORECARD BADGE */}
                                    <span className="bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                      <Activity className="w-3 h-3" /> Vigor {batch.vigorScore || 96}%
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
                                  <p className="text-xs opacity-70 font-medium mt-0.5">{batch.species} • <span className="text-teal-500 font-semibold">{batch.broodstock || 'SPF Certified'}</span></p>
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
                                  {/* FEATURE 2: TRANSIT MORTALITY & ROUTE PREDICTOR BUTTON */}
                                  <button
                                    type="button"
                                    onClick={(e) => { e.stopPropagation(); setTransitPredictorBatch(batch); }}
                                    className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
                                    title="Transit Route & Oxygen Risk Predictor"
                                  >
                                    <Navigation className="w-4 h-4 text-indigo-500" />
                                  </button>
                                  {/* FEATURE 9: WHATSAPP FLYER SHARE BUTTON */}
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

                              {/* POND COVERAGE QUICK-ESTIMATOR ON CARD */}
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
                                  📅 {t.availPackingLabel}: <b>{batch.availableDate || 'Flexible'}</b> ({batch.availableTimeSlot || 'All Day'}) • <span className="text-amber-500 font-bold">Min Packing: {((batch.minPacking || 100000) / 100000).toFixed(1).replace(/\.0$/, '')} Lakh PL</span>
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
                                  setBookingForm(prev => ({
                                    ...prev,
                                    farmerName: currentUser.name,
                                    farmerPhone: currentUser.phone,
                                    qtyAmount: '2',
                                    qtyUnit: 'LAKHS',
                                    pondSplitCount: '1',
                                    packingDate: batch.availableDate || prev.packingDate,
                                    packingTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
                                    brokerMarginPaise: '',
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

            {/* TAB 2: BUYER BOOKINGS, DIGITAL ESCROW TIMELINE & GATE-PASSES */}
            {buyerTab === 'bookings' && (
              <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" /> {t.myBookingsTitle}
                </h3>
                {bookings.filter(b => b.farmerPhone === currentUser.phone).length === 0 ? (
                  <p className="text-xs opacity-60">{t.noBookingsYet}</p>
                ) : (
                  <div className="max-h-[68vh] overflow-y-auto pr-1 space-y-4">
                    {bookings.filter(b => b.farmerPhone === currentUser.phone).map((bk) => {
                      const draft = ratingDrafts[bk.bookingId] || { stars: 5, comment: '' };
                      const isFinalCleared = bk.settlement?.status === 'BALANCE_CLEARED';
                      const isCancelled = bk.settlement?.status === 'CANCELLED_REFUNDED';
                      const isPacked = bk.packingStatus === 'PACKING_DONE_BY_SELLER' || isFinalCleared;
                      const mapsUrl = bk.batch?.googleMapsLink || hatcheryProfiles[bk.hatcheryOwnerPhone]?.googleMapsLink;

                      return (
                        <div
                          key={bk.bookingId}
                          onClick={() => setInspectedBuyerBooking(bk)}
                          className={`border hover:border-teal-500 rounded-2xl p-4 space-y-3 transition cursor-pointer ${subCardBg}`}
                        >
                          {bk.packingStatus === 'PACKING_DONE_BY_SELLER' && !isFinalCleared && !isCancelled && (
                            <div className="bg-teal-600 text-white px-4 py-2 rounded-xl text-xs font-bold">
                              {t.packingReadyAlert}
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-3">
                            <div className="space-y-1 flex-1 min-w-[230px]">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-xs text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded border border-teal-500/30">{bk.bookingId}</span>
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
                              <p className="text-sm font-extrabold text-teal-600 dark:text-teal-400">
                                {bk.batch?.realName} • +91 {bk.batch?.realPhone}
                              </p>
                              <p className="text-xs opacity-75">
                                Batch <b>{bk.batch?.id}</b> • {(bk.quantity || 0).toLocaleString('en-IN')} PL ({bk.batch?.plStage}) • {t.packingDateLabel}: <b>{bk.packingDate}</b>
                              </p>
                              <p className="text-[11px] opacity-65">
                                {isFinalCleared
                                  ? <span className="text-emerald-500 font-bold">100% Full Paid (₹{(bk.totalSeedCost || 0).toLocaleString('en-IN')}) ✓</span>
                                  : isCancelled
                                    ? <span className="text-rose-500 font-bold">Cancelled • 2% Refunded ✓</span>
                                    : <span>Paid: <b>₹{(bk.tokenAdvance || 0).toLocaleString('en-IN')}</b> • Balance: <b>₹{(bk.balanceAtPacking || 0).toLocaleString('en-IN')}</b></span>}
                                {' '}• <span className="text-teal-500 underline font-semibold">Click Hatchery for all details & receipts</span>
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2 shrink-0" onClick={(e) => e.stopPropagation()}>
                              {/* STATUS ANIMATION BUTTON */}
                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => openAnimatedStatusModal(bk)}
                                  className={`border border-teal-500/40 text-teal-600 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${cardBg}`}
                                >
                                  <Activity className="w-3.5 h-3.5" /> Status
                                </button>
                              )}

                              {/* FULL PAYMENT BUTTON IF ADVANCE PAID */}
                              {!isFinalCleared && !isCancelled && (bk.balanceAtPacking || 0) > 0 && (
                                <button
                                  type="button"
                                  onClick={() => {
                                    setPayRemainingForm({ paymentMethod: 'DIRECT_UPI', upiSubMode: 'QR', qrRevealed: false, utrReference: '' });
                                    setPayRemainingBooking(bk);
                                  }}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <CreditCard className="w-3.5 h-3.5" /> Full Payment
                                </button>
                              )}

                              {/* GATE-PASS QR (CLEARED WHEN SCANNED BY HATCHERY) */}
                              {!isCancelled && (
                                bk.gatePassCleared ? (
                                  <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1">
                                    <CheckCircle2 className="w-3.5 h-3.5" /> Gate-Pass Cleared
                                  </span>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setGatePassBooking(bk)}
                                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                                  >
                                    <QrCode className="w-3.5 h-3.5" /> Gate-Pass QR
                                  </button>
                                )
                              )}
                            </div>
                          </div>

                          {isFinalCleared && (
                            <div className="pt-3 border-t border-slate-300/30" onClick={(e) => e.stopPropagation()}>
                              {!bk.rated ? (
                                <div className={`flex flex-wrap items-center gap-2.5 p-3 rounded-xl border ${cardBg}`}>
                                  <span className="text-xs font-bold">{t.rateSeedLabel}</span>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRatingDrafts({ ...ratingDrafts, [bk.bookingId]: { ...draft, stars: star } })}
                                        className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${draft.stars >= star ? 'bg-amber-400 border-amber-500 text-slate-950' : subCardBg}`}
                                      >
                                        {star}★
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder={lang === 'te' ? 'హేచరీ గురించి మీ అభిప్రాయం రాయండి...' : 'Write feedback for Hatchery...'}
                                    value={draft.comment}
                                    onChange={(e) => setRatingDrafts({ ...ratingDrafts, [bk.bookingId]: { ...draft, comment: e.target.value } })}
                                    className={`flex-1 min-w-[180px] border rounded-xl px-3 py-1.5 text-xs select-text ${inputCls}`}
                                  />
                                  <button
                                    type="button"
                                    onClick={() => handleSubmitRatingAndFeedback(bk.bookingId, bk.batch?.id)}
                                    className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl cursor-pointer"
                                  >
                                    {t.submitReviewBtn}
                                  </button>
                                </div>
                              ) : (
                                <div className="text-xs text-emerald-500 font-bold">
                                  ✓ {t.ratedLabel}: {bk.userRating}★ {bk.userFeedback ? `— "${bk.userFeedback}"` : ''}
                                </div>
                              )}
                            </div>
                          )}
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

            {/* TAB 4: HARVEST & PROFIT ESTIMATOR + FEATURE 8 SENSITIVITY MATRIX */}
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

                {/* FEATURE 8: HARVEST COUNT & MARKET RATE SENSITIVITY MATRIX */}
                <div className={`p-4 rounded-2xl border space-y-2 ${subCardBg}`}>
                  <h4 className="text-xs font-extrabold uppercase text-teal-500">Count-Wise Profit Sensitivity Matrix (At {calcInputs.survival}% Survival)</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    {[
                      { count: 30, rate: 395 },
                      { count: 40, rate: 340 },
                      { count: 50, rate: 305 }
                    ].map(sc => {
                      const surv = Math.round(calcResult.totalSeedsNeeded * (calcInputs.survival / 100));
                      const kg = Math.round(surv / sc.count);
                      const prof = (kg * sc.rate) - calcResult.totalExpenses;
                      return (
                        <div key={sc.count} className={`p-3 rounded-xl border ${cardBg}`}>
                          <div className="font-extrabold">{sc.count} Count @ ₹{sc.rate}/kg</div>
                          <div className="text-[11px] opacity-70">Harvest: {kg.toLocaleString('en-IN')} kg</div>
                          <div className={`font-black mt-1 ${prof >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            Net Profit: ₹{prof.toLocaleString('en-IN')}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: POND WATER, VIBRIO DISEASE EARLY-WARNING & OXYGEN CALCULATOR */}
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
                    const vibrioRisk = waterTest.ph > 8.4 && waterTest.salinity > 20 ? 'HIGH' : waterTest.ammonia > 0.08 ? 'MODERATE' : 'LOW';
                    return (
                      <div className="space-y-2">
                        <div className={`p-4 rounded-xl border text-xs font-bold ${isSafe ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : 'bg-amber-500/15 border-amber-500/40 text-amber-500'}`}>
                          {isSafe
                            ? '✅ Pond water parameters are OPTIMAL for immediate PL stocking!'
                            : '⚠️ Warning: Stabilize pH (7.5-8.3), DO (above 4.5 ppm), and Ammonia (below 0.1 ppm) before stocking.'}
                        </div>
                        {/* FEATURE 7: VIBRIO / PATHOGEN RISK BADGE */}
                        <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${subCardBg}`}>
                          <span>Luminescent Vibrio & EHP Susceptibility Risk:</span>
                          <span className={vibrioRisk === 'LOW' ? 'text-emerald-500' : vibrioRisk === 'MODERATE' ? 'text-amber-500' : 'text-rose-500'}>
                            {vibrioRisk} RISK ({vibrioRisk === 'LOW' ? 'Safe Bio-floc Balance' : 'Apply Gut Probiotics & Minerals'})
                          </span>
                        </div>
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
            2. SELLER (HATCHERY) PORTAL — ₹10K DEPOSIT GATE -> PROMINENT HATCHERY CARD -> 3 TABS
           ========================================================= */}
        {currentUser.role === 'seller' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {/* STEP A: MANDATORY ₹10,000 SECURITY DEPOSIT GATE IF NOT YET PAID */}
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
              /* STEP B: ONE-STEP HATCHERY & BANK REGISTRATION AFTER DEPOSIT */
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
                      <textarea rows={2} placeholder="Write about your hatchery tanks, SPF broodstock, water filtration & biosecurity..." value={unifiedSellerForm.description} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, description: e.target.value })} className={`w-full border rounded-xl px-3.5 py-2 text-sm select-text ${inputCls}`} />
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
              /* STEP C: ACTIVE HATCHERY DASHBOARD — PROMINENT HATCHERY DETAILS AT TOP, 3 TABS BELOW */
              <>
                <div className={`rounded-2xl p-6 sm:p-7 border-2 border-teal-500/30 shadow-xs space-y-4 ${cardBg}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1.5 flex-1 min-w-[260px]">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> {t.hatcheryLockedBanner} {currentUser.phone}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-teal-500/15 text-teal-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5" /> ₹10,000 Security Deposit Active
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
                    <div className="flex flex-col items-end gap-2">
                      {!isEditingSellerProfile && (
                        <>
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
                            className={`border text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer ${subCardBg}`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-teal-600" /> {t.editSellerProfileBtn}
                          </button>
                          <button
                            type="button"
                            onClick={() => { setAddDepositQrRevealed(false); setAddDepositUtr(''); setShowSellerDepositModal(true); }}
                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Wallet className="w-3.5 h-3.5" /> Deposit (₹{(myFixedHatchery?.depositAmount || 10000).toLocaleString('en-IN')})
                          </button>
                        </>
                      )}
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
                          <input type="text" placeholder="Describe hatchery facilities, broodstock & biosecurity..." value={unifiedSellerForm.description} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, description: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`} />
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
                      <div className="flex flex-wrap items-center justify-between gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => { setDeleteConfirmPassword(''); setShowDeleteAccountModal(true); }}
                          className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> {t.deleteAccountBtn}
                        </button>
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => setIsEditingSellerProfile(false)} className={`border text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer ${subCardBg}`}>
                            Cancel
                          </button>
                          <button type="submit" className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                            {t.saveBtn}
                          </button>
                        </div>
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

                {/* ADD NEW SEED BATCH */}
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
                        <label className="text-xs font-bold opacity-75 block mb-1">Min. Packing (Lakhs)</label>
                        <input required type="number" min="1" max="100" value={newBatchForm.minPackingLakhs} onChange={(e) => setNewBatchForm({ ...newBatchForm, minPackingLakhs: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
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
                            className={`w-24 border rounded-xl px-3 py-2 text-xs font-bold text-center select-text ${inputCls}`}
                          />
                          <select
                            value={newBatchForm.stockUnit}
                            onChange={(e) => setNewBatchForm({ ...newBatchForm, stockUnit: e.target.value })}
                            className={`flex-1 border rounded-xl px-2.5 py-2 text-xs font-bold ${inputCls}`}
                          >
                            <option value="LAKHS">Lakhs (× 1,00,000)</option>
                            <option value="MILLIONS">Millions (× 10,00,000)</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.availDateLabel}</label>
                        <input required type="date" value={newBatchForm.availableDate} onChange={(e) => setNewBatchForm({ ...newBatchForm, availableDate: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.availTimeLabel}</label>
                        <select value={newBatchForm.availableTimeSlot} onChange={(e) => setNewBatchForm({ ...newBatchForm, availableTimeSlot: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold ${inputCls}`}>
                          {PACKING_TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                        </select>
                      </div>
                    </div>

                    {/* PCR IMAGES + TANK VIDEOS (CAMERA OR FILES WITH VIVO GPS STAMP) */}
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

                      <div className={`border rounded-xl p-3 flex items-center justify-between gap-2 ${subCardBg}`}>
                        <div>
                          <span className="text-xs font-bold flex items-center gap-1"><Camera className="w-4 h-4 text-teal-600" /> Tank GPS</span>
                          <p className="text-[11px] opacity-60 truncate max-w-[140px]">{gpsLocation || 'Auto Vivo Stamp'}</p>
                        </div>
                        <button type="button" onClick={handleCaptureGps} className="bg-teal-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer shrink-0">
                          <MapPin className="w-3.5 h-3.5" /> {gpsLocation ? t.gpsLockedBtn : t.captureGpsBtn}
                        </button>
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
                                <div className="flex items-center gap-2">
                                  <span className="font-mono text-xs font-bold text-teal-500">{b.id}</span>
                                  <span className="font-bold text-sm">{b.species}</span>
                                  <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${b.paused ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'}`}>
                                    {b.paused ? 'PAUSED' : 'LIVE'}
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
                                    <label className="text-[10px] font-bold opacity-60 block">Min. Packing (Lakhs)</label>
                                    <input type="number" min="1" max="100" value={editBatchValues.minPackingLakhs} onChange={(e) => setEditBatchValues({ ...editBatchValues, minPackingLakhs: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
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
                                    <label className="text-[10px] font-bold opacity-60 block">{t.availDateLabel}</label>
                                    <input type="date" value={editBatchValues.availableDate} onChange={(e) => setEditBatchValues({ ...editBatchValues, availableDate: e.target.value })} className={`w-full border rounded-lg px-1.5 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.availTimeLabel}</label>
                                    <select value={editBatchValues.availableTimeSlot} onChange={(e) => setEditBatchValues({ ...editBatchValues, availableTimeSlot: e.target.value })} className={`w-full border rounded-lg px-1.5 py-1.5 text-[10px] font-bold ${inputCls}`}>
                                      {PACKING_TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                                    </select>
                                  </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-300/20">
                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold">PCR Images ({(editBatchValues.pcrImages || []).length})</span>
                                      <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => editPcrCamRef.current?.click()} className="text-[11px] font-bold text-teal-500 underline cursor-pointer">+ Camera</button>
                                        <button type="button" onClick={() => editPcrFileRef.current?.click()} className="text-[11px] font-bold text-teal-500 underline cursor-pointer">+ Files</button>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {(editBatchValues.pcrImages || []).map((img, i) => (
                                        <span key={i} className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[11px] font-bold ${cardBg}`}>
                                          <span onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })} className="cursor-pointer underline">{img.label}</span>
                                          <button
                                            type="button"
                                            onClick={() => setEditBatchValues(prev => ({
                                              ...prev,
                                              removedPcrUrls: [...(prev.removedPcrUrls || []), img.url],
                                              pcrImages: prev.pcrImages.filter((_, idx) => idx !== i)
                                            }))}
                                            className="text-rose-500 ml-1 cursor-pointer"
                                          >
                                            ✕
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-1.5">
                                    <div className="flex items-center justify-between">
                                      <span className="text-[11px] font-bold">Tank Videos ({(editBatchValues.tankVideos || []).length})</span>
                                      <div className="flex items-center gap-2">
                                        <button type="button" onClick={() => editVidCamRef.current?.click()} className="text-[11px] font-bold text-teal-500 underline cursor-pointer">+ Camera</button>
                                        <button type="button" onClick={() => editVidFileRef.current?.click()} className="text-[11px] font-bold text-teal-500 underline cursor-pointer">+ Files</button>
                                      </div>
                                    </div>
                                    <div className="flex flex-wrap gap-1.5">
                                      {(editBatchValues.tankVideos || []).map((vid, i) => (
                                        <span key={i} className={`inline-flex items-center gap-1 border px-2 py-0.5 rounded text-[11px] font-bold ${cardBg}`}>
                                          <span onClick={() => setFullScreenMedia({ type: 'video', url: vid.url, label: vid.label })} className="cursor-pointer underline">{vid.label}</span>
                                          <button
                                            type="button"
                                            onClick={() => setEditBatchValues(prev => ({
                                              ...prev,
                                              removedVideoUrls: [...(prev.removedVideoUrls || []), vid.url],
                                              tankVideos: prev.tankVideos.filter((_, idx) => idx !== i)
                                            }))}
                                            className="text-rose-500 ml-1 cursor-pointer"
                                          >
                                            ✕
                                          </button>
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ) : (
                              <div className={`grid grid-cols-5 gap-2 text-center p-2.5 rounded-lg border text-xs ${cardBg}`}>
                                <div><span className="text-[10px] opacity-55 block">{t.stage}</span><b>{b.plStage}</b></div>
                                <div><span className="text-[10px] opacity-55 block">{t.salinity}</span><b className="text-teal-500">{b.salinity} PPT</b></div>
                                <div><span className="text-[10px] opacity-55 block">{t.perSeed}</span><b>₹{b.pricePer1000.toFixed(2)}</b></div>
                                <div><span className="text-[10px] opacity-55 block">{t.bonus}</span><b className="text-emerald-500">+{b.bonusPercent}%</b></div>
                                <div><span className="text-[10px] opacity-55 block">{t.stock}</span><b>{(b.availableStock || 0).toLocaleString('en-IN')}</b></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* LONG FULL-WIDTH TOTAL REVENUE TAB BELOW BATCHES */}
                <div
                  onClick={() => setSellerTxModal({ title: 'Total Packing Revenue Received (All Cleared Transactions)', list: hatcheryClearedOrders })}
                  className={`rounded-2xl p-6 border-2 border-emerald-500/40 hover:border-emerald-500 shadow-xs flex flex-wrap items-center justify-between gap-4 cursor-pointer transition ${cardBg}`}
                >
                  <div className="space-y-1">
                    <span className="text-xs text-emerald-500 font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" /> Total Packing Revenue Received (Lifetime Ledger)
                    </span>
                    <div className="text-3xl font-black text-emerald-500">₹{hatcheryClearedRevenue.toLocaleString('en-IN')}</div>
                    <p className="text-xs opacity-65">Click here to inspect all {hatcheryClearedOrders.length} completed & settled transactions from start to end</p>
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
                          <Trash2 className="w-3.5 h-3.5" /> {t.deleteAccountBtn}
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
                                {bk.brokerExtraMarginTotal > 0 && (
                                  <span className="bg-teal-500/15 text-teal-500 font-bold px-2.5 py-0.5 rounded-full">
                                    + Extra Margin: ₹{bk.brokerExtraMarginTotal.toLocaleString('en-IN')} ({bk.brokerMarginPaise}p/seed)
                                  </span>
                                )}
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

                  {filteredAndSortedBatches.length === 0 ? (
                    <div className={`rounded-2xl border p-10 text-center space-y-2 ${cardBg}`}>
                      <Building2 className="w-9 h-9 opacity-30 mx-auto" />
                      <h3 className="text-sm font-extrabold">{t.emptyMarketTitle}</h3>
                      <p className="text-xs opacity-60">{t.emptyMarketSub}</p>
                    </div>
                  ) : (
                    <div className="max-h-[65vh] overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredAndSortedBatches.map((batch) => {
                        const isSoldOut = (batch.availableStock || 0) <= 0;
                        const isPaused = Boolean(batch.paused);
                        return (
                          <div key={batch.id} className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-teal-500 transition ${cardBg}`}>
                            <div onClick={() => setInspectedBatch(batch)} className="space-y-3 cursor-pointer">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="font-mono text-[11px] font-bold bg-teal-500/15 text-teal-600 px-2 py-0.5 rounded">{batch.id}</span>
                                    <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                      {t.caaVerified}
                                    </span>
                                    <span className="text-xs font-semibold opacity-60">{batch.zone}</span>
                                    <span className="text-xs font-bold text-amber-500 inline-flex items-center gap-0.5">
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {batch.rating || 5.0}
                                    </span>
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

                              <div className="text-xs text-teal-500 font-bold flex items-center gap-1.5">
                                <Eye className="w-3.5 h-3.5" /> {t.inspectBtn}
                              </div>
                            </div>

                            <button
                              type="button"
                              disabled={isSoldOut || isPaused}
                              onClick={() => {
                                setModalError('');
                                setSelectedBatch(batch);
                                setBookingForm(prev => ({
                                  ...prev,
                                  farmerName: brokerFarmers[0]?.name || '',
                                  farmerPhone: brokerFarmers[0]?.phone || '',
                                  qtyAmount: '2',
                                  qtyUnit: 'LAKHS',
                                  pondSplitCount: '1',
                                  packingDate: batch.availableDate || prev.packingDate,
                                  packingTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
                                  brokerMarginPaise: '2',
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
                  )}
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
          BUYER & BROKER EDIT PROFILE MODAL (NAME + MOBILE RE-VERIFY + DELETE ACCOUNT)
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
                {!editProfileDraft.phoneVerified && (
                  <span className="text-[11px] text-amber-500 font-bold mt-1 block">
                    Mobile number changed — click Verify to confirm via WhatsApp before saving.
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-300/30">
                <button
                  type="button"
                  onClick={() => { setShowBasicEditProfileModal(false); setDeleteConfirmPassword(''); setShowDeleteAccountModal(true); }}
                  className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" /> {t.deleteAccountBtn}
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
          PASSWORD-VERIFIED ACCOUNT DELETION MODAL
         ========================================================= */}
      {showDeleteAccountModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-rose-500/50 space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div className="flex items-center gap-2 text-rose-500">
                <ShieldAlert className="w-5 h-5" />
                <h3 className="font-extrabold text-base">Confirm Permanent Account Deletion</h3>
              </div>
              <button type="button" onClick={() => setShowDeleteAccountModal(false)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <p className="text-xs opacity-80 leading-relaxed">
              This will permanently delete your <b>{t.portalBadges[currentUser?.role]}</b> account (<b>+91 {currentUser?.phone}</b>) and all associated records from Supabase.
              {isWithdrawingOnDelete && currentUser?.role === 'seller' && (
                <span className="block mt-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 font-bold">
                  ₹{(hatcheryProfiles[currentUser.phone]?.depositAmount || 10000).toLocaleString('en-IN')} security deposit will be automatically refunded to the source account ({hatcheryProfiles[currentUser.phone]?.depositSourceAccount || hatcheryProfiles[currentUser.phone]?.depositUtr || hatcheryProfiles[currentUser.phone]?.bankDetails?.upiId || 'Original Payment Account'}).
                </span>
              )}
              {' '}Enter your account password to verify:
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
                  Verify & Delete Forever
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================================
          FEATURE 2: TRANSIT ROUTE & OXYGEN MORTALITY RISK PREDICTOR MODAL
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
          FEATURE 6: PACKING DISPATCH GATE-PASS / QR CODE MODAL
         ========================================================= */}
      {gatePassBooking && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-indigo-500 text-center space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-2">
              <span className="text-xs font-extrabold text-indigo-500 uppercase">Hatchery Gate-Pass</span>
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
              <p className="text-[11px] opacity-60 pt-1">Present this QR & PIN at {gatePassBooking.batch?.realName} dispatch gate.</p>
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
                      {bk.brokerExtraMarginTotal > 0 && (
                        <span className="text-teal-500 font-bold block">+ Margin: ₹{bk.brokerExtraMarginTotal.toLocaleString('en-IN')}</span>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          TOP-LAYER FULL-SCREEN IMAGE & VIDEO VIEWER MODAL (z-[9999])
         ========================================================= */}
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

      {/* BUYER OLD TRANSACTION INSPECTION MODAL */}
      {inspectedBuyerBooking && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-500">{inspectedBuyerBooking.bookingId} • UTR: {inspectedBuyerBooking.paymentId}</span>
                <h3 className="font-extrabold text-base">Seed Purchase & Transaction Details</h3>
              </div>
              <button type="button" onClick={() => setInspectedBuyerBooking(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${subCardBg}`}>
              <span className="text-[10px] font-bold uppercase text-teal-500">Purchased From Hatchery</span>
              <p className="text-sm font-extrabold">{inspectedBuyerBooking.batch?.realName} ({inspectedBuyerBooking.batch?.id})</p>
              <p className="opacity-75">CAA License: {inspectedBuyerBooking.batch?.caaLicense} • {inspectedBuyerBooking.batch?.zone}</p>
              <p className="opacity-75">Address: {inspectedBuyerBooking.batch?.realAddress} • +91 {inspectedBuyerBooking.batch?.realPhone}</p>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Buyer / Farmer:</span><b>{inspectedBuyerBooking.farmerName} (+91 {inspectedBuyerBooking.farmerPhone})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>UTR / Payment Ref:</span><b className="font-mono">{inspectedBuyerBooking.paymentId} ({inspectedBuyerBooking.paymentMode})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Booked On:</span><b>{inspectedBuyerBooking.date} at {inspectedBuyerBooking.time}</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Species & Stage:</span><b>{inspectedBuyerBooking.batch?.species} ({inspectedBuyerBooking.batch?.plStage})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Quantity + Free Bonus:</span><b>{(inspectedBuyerBooking.quantity || 0).toLocaleString('en-IN')} + {(inspectedBuyerBooking.bonusSeeds || 0).toLocaleString('en-IN')} PL</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Packing Schedule:</span><b>{inspectedBuyerBooking.packingDate} ({inspectedBuyerBooking.packingTimeSlot})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Advance Paid (4%):</span><b>₹{(inspectedBuyerBooking.tokenAdvance || 0).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between py-1"><span>Settlement Status:</span><b className="text-emerald-500">{inspectedBuyerBooking.settlement?.status === 'BALANCE_CLEARED' ? `Balance Cleared (${inspectedBuyerBooking.clearedAt})` : inspectedBuyerBooking.settlement?.status === 'CANCELLED_REFUNDED' ? 'Cancelled (2% Refunded)' : `₹${(inspectedBuyerBooking.balanceAtPacking || 0).toLocaleString('en-IN')} Pending at Packing`}</b></div>
            </div>
            {(() => {
              const bk = inspectedBuyerBooking;
              const isFinalCleared = bk.settlement?.status === 'BALANCE_CLEARED';
              const isCancelled = bk.settlement?.status === 'CANCELLED_REFUNDED';
              const mapsUrl = bk.batch?.googleMapsLink || hatcheryProfiles[bk.hatcheryOwnerPhone]?.googleMapsLink;
              return (
                <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-slate-300/20">
                  <div className="flex flex-wrap items-center gap-2">
                    {mapsUrl && !isCancelled && (
                      <a
                        href={mapsUrl.startsWith('http') ? mapsUrl : `https://${mapsUrl}`}
                        target="_blank"
                        rel="noreferrer"
                        className="bg-teal-500/15 hover:bg-teal-500/25 border border-teal-500/30 text-teal-600 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1"
                      >
                        <MapPin className="w-3.5 h-3.5" /> Maps
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={() => handleSendBilingualBookingSummary(bk)}
                      className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                    >
                      <Send className="w-3.5 h-3.5" /> WhatsApp
                    </button>
                    {!isFinalCleared && !isCancelled && (bk.balanceAtPacking || 0) > 0 && (
                      <button
                        type="button"
                        onClick={() => {
                          setInspectedBuyerBooking(null);
                          setPayRemainingForm({ paymentMethod: 'DIRECT_UPI', upiSubMode: 'QR', qrRevealed: false, utrReference: '' });
                          setPayRemainingBooking(bk);
                        }}
                        className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                      >
                        <CreditCard className="w-3.5 h-3.5" /> Full Payment
                      </button>
                    )}
                    {!isFinalCleared && !isCancelled && (
                      <button
                        type="button"
                        onClick={() => { handleBuyerCancelBooking(bk); setInspectedBuyerBooking(null); }}
                        className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                      >
                        <XCircle className="w-3.5 h-3.5" /> {t.cancelBookingBtn}
                      </button>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    {!isCancelled && (
                      <button type="button" onClick={() => handleDownloadVerifiedPdf(bk, isFinalCleared)} className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer">
                        <Printer className="w-3.5 h-3.5" /> {isFinalCleared ? t.finalReceiptBtn : t.advanceReceiptBtn}
                      </button>
                    )}
                    <button type="button" onClick={() => setInspectedBuyerBooking(null)} className={`px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>{t.closeBtn}</button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}

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
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Advance UTR / Ref No:</span><b className="font-mono text-teal-500">{inspectedSellerOrder.paymentId} ({inspectedSellerOrder.paymentMode})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Booked Timestamp:</span><b>{inspectedSellerOrder.date} {inspectedSellerOrder.time}</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Seed Quantity + Bonus:</span><b>{(inspectedSellerOrder.quantity || 0).toLocaleString('en-IN')} + {(inspectedSellerOrder.bonusSeeds || 0).toLocaleString('en-IN')} PL</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Target Pond Salinity:</span><b className="text-teal-500">{inspectedSellerOrder.pondSalinity} PPT (Source: {inspectedSellerOrder.batch?.salinity} PPT)</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Packing Date & Slot:</span><b>{inspectedSellerOrder.packingDate} ({inspectedSellerOrder.packingTimeSlot})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Logistics Mode:</span><b>{inspectedSellerOrder.includeTransport ? 'Oxygen Van Delivery (+₹1,500)' : 'Self Pickup'}</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Hatchery Rate:</span><b>₹{(inspectedSellerOrder.hatcheryFixedRate || 0).toFixed(2)} / seed</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Your Total Hatchery Value:</span><b className="text-emerald-500">₹{(inspectedSellerOrder.hatcheryFixedTotal || 0).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between py-1"><span>Payment Status:</span><b>{inspectedSellerOrder.settlement?.status === 'BALANCE_CLEARED' ? `Payment Received (${inspectedSellerOrder.clearedAt})` : 'Awaiting Packing & Payment Received'}</b></div>
            </div>
            <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-300/20">
              <div className="flex items-center gap-2">
                <a
                  href={`tel:+91${(inspectedSellerOrder.farmerPhone || '').replace(/\D/g, '').slice(-10)}`}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5"
                >
                  <Phone className="w-3.5 h-3.5" /> Call Farmer
                </a>
                <button
                  type="button"
                  onClick={() => openWhatsAppMessage(
                    inspectedSellerOrder.farmerPhone,
                    `Hello ${inspectedSellerOrder.farmerName}, regarding your Aqua Mark Booking ${inspectedSellerOrder.bookingId} (Batch ${inspectedSellerOrder.batch?.id}, ${(inspectedSellerOrder.quantity || 0).toLocaleString('en-IN')} PL) scheduled on ${inspectedSellerOrder.packingDate}.`
                  )}
                  className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" /> WhatsApp Farmer
                </button>
              </div>
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

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${subCardBg}`}>
                <span className="text-[10px] opacity-60 uppercase font-bold block">Buyer / Farmer Full Details</span>
                <b className="text-sm block mt-0.5">{selectedBrokerTx.farmerName}</b>
                <span className="opacity-75">+91 {selectedBrokerTx.farmerPhone}</span>
                <span className="block text-[11px] opacity-65 mt-0.5">Pond Salinity: {selectedBrokerTx.pondSalinity} PPT</span>
              </div>
              <div className={`p-3 rounded-xl border ${subCardBg}`}>
                <span className="text-[10px] opacity-60 uppercase font-bold block">Hatchery (Seller) Details</span>
                <b className="text-sm block mt-0.5">{selectedBrokerTx.batch?.realName}</b>
                <span className="opacity-75">{selectedBrokerTx.batch?.zone} • Batch {selectedBrokerTx.batch?.id}</span>
              </div>
            </div>

            <div className={`border rounded-xl p-4 space-y-2 text-xs ${subCardBg}`}>
              <div className="flex justify-between"><span>Payment UTR / Ref:</span><b className="font-mono text-teal-500">{selectedBrokerTx.paymentId} ({selectedBrokerTx.paymentMode})</b></div>
              <div className="flex justify-between"><span>Booked Quantity:</span><b>{(selectedBrokerTx.quantity || 0).toLocaleString('en-IN')} PL ({selectedBrokerTx.batch?.plStage})</b></div>
              <div className="flex justify-between"><span>Packing Schedule:</span><b>{selectedBrokerTx.packingDate} ({selectedBrokerTx.packingTimeSlot})</b></div>
              <div className="flex justify-between"><span>Hatchery Rate:</span><b>₹{(selectedBrokerTx.hatcheryFixedRate || 0).toFixed(2)} / seed</b></div>
              <div className="flex justify-between"><span>Extra Margin Added by You:</span><b className="text-teal-500">+{selectedBrokerTx.brokerMarginPaise || 0} paise / seed</b></div>
              <div className="flex justify-between border-t border-slate-300/30 pt-2">
                <span>Your 2% Commission (From Advance Hold):</span>
                <b>₹{(selectedBrokerTx.settlement?.brokerBase2Pct || 0).toLocaleString('en-IN')} ({selectedBrokerTx.settlement?.status === 'BALANCE_CLEARED' ? 'Credited' : 'On Hold'})</b>
              </div>
              <div className="flex justify-between">
                <span>Your Extra Margin Profit (Collected at Packing):</span>
                <b>₹{(selectedBrokerTx.brokerExtraMarginTotal || 0).toLocaleString('en-IN')}</b>
              </div>
              <div className="flex justify-between border-t border-slate-300/30 pt-2 text-sm font-extrabold text-emerald-500">
                <span>Total Broker Combined Earnings:</span>
                <span>₹{((selectedBrokerTx.settlement?.brokerBase2Pct || 0) + (selectedBrokerTx.brokerExtraMarginTotal || 0)).toLocaleString('en-IN')}</span>
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
          HATCHERY INSPECTION MODAL (FEATURE 10 SPF LINEAGE AUDIT + MEDIA)
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
                <div><span className="text-[10px] opacity-60 block">Active Batches</span><b>{allHatcheryBatches.length} Batches</b></div>
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
                  <div className="p-4 text-center text-xs opacity-60">No PCR images uploaded.</div>
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
          BOOKING MODAL — BLURRED-TO-REVEAL QR ("Show QR") + MULTI-POND SPLIT
         ========================================================= */}
      {selectedBatch && (
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
                    <span className="opacity-75">{selectedBatch.species} • Remaining: {(selectedBatch.availableStock || 0).toLocaleString('en-IN')} PL</span>
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
                    <label className="text-xs font-bold opacity-75 block mb-1">
                      {t.quantityLabel} <span className="text-amber-500">(Min: {((selectedBatch.minPacking || 100000) / 100000).toFixed(1).replace(/\.0$/, '')} Lakh PL)</span>
                    </label>
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
                        className={`w-24 border rounded-xl px-2.5 py-2 text-sm font-bold text-center select-text ${inputCls}`}
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
                {(() => {
                  const qtyNow = computeSeedCount(bookingForm.qtyAmount, bookingForm.qtyUnit);
                  const minRequired = selectedBatch.minPacking || 100000;
                  if (qtyNow < minRequired) {
                    return (
                      <div className="bg-rose-500/15 border border-rose-500/40 text-rose-500 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-2">
                        <AlertTriangle className="w-4 h-4 shrink-0" />
                        <span>Minimum Packing required: {((minRequired) / 100000).toFixed(1).replace(/\.0$/, '')} Lakh PL ({minRequired.toLocaleString('en-IN')} PL). Booking disabled below minimum.</span>
                      </div>
                    );
                  }
                  return null;
                })()}

                {/* FEATURE 3: MULTI-POND SPLIT-ORDER PLANNER */}
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

                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold opacity-75 block">Select Payment Option</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, paymentOption: 'ADVANCE', qrRevealed: false })}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${bookingForm.paymentOption !== 'FULL' ? 'border-teal-600 bg-teal-500/15 text-teal-600' : subCardBg}`}
                    >
                      4% Advance Booking
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, paymentOption: 'FULL', qrRevealed: false })}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${bookingForm.paymentOption === 'FULL' ? 'border-emerald-600 bg-emerald-500/15 text-emerald-600' : subCardBg}`}
                    >
                      100% Full Payment
                    </button>
                  </div>
                </div>

                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold opacity-75 block">{bookingForm.paymentOption === 'FULL' ? 'Select Full Payment Method' : t.paymentMethodLabel}</label>
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

                  {(() => {
                    const qty = computeSeedCount(bookingForm.qtyAmount, bookingForm.qtyUnit);
                    const hatcheryFixedCost = Math.round(qty * (selectedBatch.pricePer1000 || 0.42));
                    const brokerMarginEarn = currentUser.role === 'mediator' ? Math.round(qty * ((Number(bookingForm.brokerMarginPaise) || 0) / 100)) : 0;
                    const fullTotal = hatcheryFixedCost + brokerMarginEarn + (bookingForm.includeTransport ? 1500 : 0);
                    const advToken = Math.max(800, Math.round(hatcheryFixedCost * 0.04));
                    const token = bookingForm.paymentOption === 'FULL' ? fullTotal : advToken;

                    // UPI PAYMENT: BLURRED QR UNTIL "Show QR" CLICKED + "Pay By App" (NO REQUEST BY VPA)
                    if (bookingForm.paymentMethod === 'DIRECT_UPI') {
                      const upiUri = `upi://pay?pa=aquamark@sbi&pn=AquaMark&am=${token}&cu=INR&tn=${bookingForm.paymentOption === 'FULL' ? 'SeedFullPayment' : 'SeedAdvance4Pct'}`;
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
                                {bookingForm.qrRevealed ? `Scan QR with any UPI App • ₹${token.toLocaleString('en-IN')}` : `Click Show QR to reveal ₹${token.toLocaleString('en-IN')} code`}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center space-y-2 py-2">
                              <a
                                href={upiUri}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs inline-flex items-center justify-center gap-2"
                              >
                                <Smartphone className="w-4 h-4" /> Open GPay / PhonePe / Paytm (₹{token.toLocaleString('en-IN')})
                              </a>
                              <p className="text-[11px] opacity-70">After completing payment in your UPI app, enter the 12-digit UTR below.</p>
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
                    }

                    if (bookingForm.paymentMethod === 'BANK_TO_BANK') {
                      return (
                        <div className={`border rounded-xl p-3 space-y-2 text-xs ${subCardBg}`}>
                          <div className="font-mono text-[11px] space-y-0.5 select-text">
                            <div><b>Account Name:</b> Aqua Mark Settlement Account</div>
                            <div><b>Account No:</b> 20419820112 | <b>IFSC:</b> SBIN0008812</div>
                            <div><b>4% Advance Transfer:</b> ₹{token.toLocaleString('en-IN')} (IMPS / NEFT)</div>
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
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {Math.abs((selectedBatch.salinity || 15) - (Number(bookingForm.pondSalinity) || 15)) > 4 && (
                <div className="bg-amber-500/15 border border-amber-500/30 rounded-xl p-3 text-xs text-amber-600 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{t.salinityWarn}</span>
                </div>
              )}

              {(() => {
                const qty = computeSeedCount(bookingForm.qtyAmount, bookingForm.qtyUnit);
                const minRequired = selectedBatch.minPacking || 100000;
                const isBelowMin = qty < minRequired;
                const hatcheryFixedCost = Math.round(qty * (selectedBatch.pricePer1000 || 0.42));
                const brokerMarginEarn = currentUser.role === 'mediator' ? Math.round(qty * ((Number(bookingForm.brokerMarginPaise) || 0) / 100)) : 0;
                const total = hatcheryFixedCost + brokerMarginEarn + (bookingForm.includeTransport ? 1500 : 0);
                const isFull = bookingForm.paymentOption === 'FULL';
                const payNowAmt = isFull ? total : Math.max(800, Math.round(hatcheryFixedCost * 0.04));
                return (
                  <>
                    <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
                      <div className="flex justify-between text-slate-300">
                        <span>{t.totalSeedValue} ({qty.toLocaleString('en-IN')} PL):</span>
                        <span className="font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-emerald-400 font-extrabold text-sm border-t border-white/10 pt-2">
                        <span>{isFull ? 'Pay Now (100% Full Payment):' : t.advancePaidLabel}:</span>
                        <span>₹{payNowAmt.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between text-slate-300 pt-1">
                        <span>{t.balanceAtPacking}:</span>
                        <span className="font-bold text-white">₹{(total - payNowAmt).toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    {!isBelowMin ? (
                      <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-xs cursor-pointer">
                        {isFull ? `Confirm & Pay Full ₹${payNowAmt.toLocaleString('en-IN')}` : t.payNowBtn} →
                      </button>
                    ) : (
                      <div className="w-full bg-rose-500/15 border border-rose-500/30 text-rose-500 font-bold py-3 rounded-xl text-xs text-center">
                        Minimum Packing: {((minRequired) / 100000).toFixed(1).replace(/\.0$/, '')} Lakh PL — Increase quantity to book
                      </div>
                    )}
                  </>
                );
              })()}
            </form>
          </div>
        </div>
      )}


      {/* =========================================================
          NOTIFICATIONS PANEL MODAL (ALL ROLES + FULL DETAILS)
         ========================================================= */}
      {showNotifPanel && (() => {
        const myNotifs = notifications.filter(
          n => n.targetPhone === currentUser?.phone && (!n.targetRole || n.targetRole === currentUser?.role)
        );
        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 max-h-[88vh] flex flex-col ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-teal-600" />
                  <div>
                    <h3 className="font-extrabold text-base">Notifications & Live Updates</h3>
                    <p className="text-[11px] opacity-60">Click any notification to view full details</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {myNotifs.some(n => !n.read) && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = notifications.map(n =>
                          n.targetPhone === currentUser?.phone && (!n.targetRole || n.targetRole === currentUser?.role)
                            ? { ...n, read: true }
                            : n
                        );
                        setNotifications(next);
                        saveKvToSupabase('notifications', next);
                      }}
                      className="text-[11px] font-bold text-teal-600 hover:underline cursor-pointer"
                    >
                      Mark all read
                    </button>
                  )}
                  <button type="button" onClick={() => setShowNotifPanel(false)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
                </div>
              </div>

              <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
                {myNotifs.length === 0 ? (
                  <p className="text-xs opacity-60 py-8 text-center">No notifications yet. All booking, packing, cashback & payment updates appear here.</p>
                ) : (
                  myNotifs.map(n => {
                    const isExpanded = selectedNotifDetail?.id === n.id;
                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          setSelectedNotifDetail(isExpanded ? null : n);
                          if (!n.read) {
                            const next = notifications.map(item => (item.id === n.id ? { ...item, read: true } : item));
                            setNotifications(next);
                            saveKvToSupabase('notifications', next);
                          }
                        }}
                        className={`border rounded-xl p-3.5 space-y-1.5 cursor-pointer transition ${!n.read ? 'border-teal-500 bg-teal-500/5' : subCardBg}`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-extrabold flex items-center gap-1.5">
                            {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />}
                            {n.title}
                          </span>
                          <span className="text-[10px] opacity-60 shrink-0">{n.createdAt}</span>
                        </div>
                        <p className="text-xs opacity-80 leading-relaxed">{n.message}</p>
                        {isExpanded && n.details && Object.keys(n.details).length > 0 && (
                          <div className={`mt-2 p-2.5 rounded-lg border text-[11px] space-y-1 ${cardBg}`}>
                            <span className="text-[10px] font-extrabold uppercase text-teal-600 block">Full Notification Details</span>
                            {Object.entries(n.details).map(([k, v]) => (
                              <div key={k} className="flex justify-between gap-2">
                                <span className="opacity-65 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                                <b className="font-mono">{typeof v === 'number' ? v.toLocaleString('en-IN') : String(v)}</b>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================
          HATCHERY SECURITY DEPOSIT MODAL (VIEW, ADD MONEY, DELETE TO WITHDRAW)
         ========================================================= */}
      {showSellerDepositModal && myFixedHatchery && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <Wallet className="w-5 h-5 text-emerald-500" /> Hatchery Security Deposit
              </h3>
              <button type="button" onClick={() => setShowSellerDepositModal(false)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 text-center space-y-1">
              <span className="text-[11px] font-bold uppercase text-emerald-600">Current Deposited Money</span>
              <div className="text-3xl font-black text-emerald-600">₹{(myFixedHatchery.depositAmount || 10000).toLocaleString('en-IN')}</div>
              <p className="text-[11px] opacity-70">
                Source Ref: <span className="font-mono font-bold">{myFixedHatchery.depositSourceAccount || myFixedHatchery.depositUtr || 'VERIFIED_10K'}</span>
              </p>
            </div>

            <form onSubmit={handleAddHatcheryDepositMoney} className={`border rounded-2xl p-4 space-y-3 text-xs ${subCardBg}`}>
              <h4 className="font-extrabold text-sm">Add Money to Deposit</h4>
              <div>
                <label className="font-bold opacity-75 block mb-1">Amount (₹)</label>
                <input
                  required
                  type="number"
                  min="500"
                  step="500"
                  value={addDepositAmount}
                  onChange={(e) => setAddDepositAmount(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`}
                />
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {['DIRECT_UPI', 'BANK_TO_BANK', 'RAZORPAY'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setAddDepositMethod(m)}
                    className={`py-2 rounded-lg font-bold border text-[11px] cursor-pointer ${addDepositMethod === m ? 'bg-teal-600 text-white border-teal-600' : cardBg}`}
                  >
                    {m === 'DIRECT_UPI' ? 'UPI' : m === 'BANK_TO_BANK' ? 'Bank' : 'Razorpay'}
                  </button>
                ))}
              </div>
              {addDepositMethod === 'DIRECT_UPI' && (
                <div className="flex flex-col items-center bg-white p-2.5 rounded-xl border text-slate-900 relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=aquamark@sbi&pn=AquaMarkDeposit&am=${Number(addDepositAmount) || 5000}&cu=INR`)}`}
                    alt="Add Deposit QR"
                    className={`w-28 h-28 object-contain ${addDepositQrRevealed ? '' : 'blur-md select-none'}`}
                  />
                  {!addDepositQrRevealed && (
                    <button type="button" onClick={() => setAddDepositQrRevealed(true)} className="absolute inset-0 m-auto h-8 w-24 bg-teal-600 text-white font-bold text-xs rounded-lg cursor-pointer">
                      Show QR
                    </button>
                  )}
                </div>
              )}
              {(addDepositMethod === 'DIRECT_UPI' || addDepositMethod === 'BANK_TO_BANK') && (
                <input
                  required
                  type="text"
                  placeholder={t.utrPlaceholder}
                  value={addDepositUtr}
                  onChange={(e) => setAddDepositUtr(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                />
              )}
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer">
                + Add Money to Deposit
              </button>
            </form>

            <div className="pt-2 border-t border-slate-300/30 space-y-2">
              <button
                type="button"
                onClick={() => {
                  setIsWithdrawingOnDelete(true);
                  setDeleteConfirmPassword('');
                  setShowDeleteAccountModal(true);
                }}
                className="w-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold py-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-4 h-4" /> Delete Account to Withdraw Money
              </button>
              <p className="text-[10px] opacity-65 text-center">
                Deleting your account automatically refunds your deposited money back to the exact source account it came from.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          HATCHERY SCAN QR MODAL (AUTO-PACKED + PAYMENT SETTLED + FULL RECEIPT)
         ========================================================= */}
      {showSellerScanQrModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <QrCode className="w-5 h-5 text-indigo-500" /> Scan Buyer Gate-Pass QR
              </h3>
              <button type="button" onClick={() => setShowSellerScanQrModal(false)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>

            {scanQrError && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-500 px-3 py-2 rounded-xl text-xs font-bold">
                {scanQrError}
              </div>
            )}

            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSellerScanQrComplete(scanQrInput);
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold opacity-75 block mb-1">Scan / Paste Gate-Pass QR Code or Booking ID / PIN</label>
                <input
                  autoFocus
                  type="text"
                  placeholder="e.g. AQ-75733 or GP-1024"
                  value={scanQrInput}
                  onChange={(e) => setScanQrInput(e.target.value)}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm font-mono font-bold select-text ${inputCls}`}
                />
              </div>
              <button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer">
                Verify QR & Complete Packing + Settle Payment
              </button>
            </form>

            {hatcheryUpcomingOrders.length > 0 && (
              <div className={`border rounded-xl p-3 space-y-2 max-h-48 overflow-y-auto ${subCardBg}`}>
                <span className="text-[10px] font-extrabold uppercase opacity-70 block">Quick-Scan Active Hatchery Gate-Passes</span>
                {hatcheryUpcomingOrders.map(bk => (
                  <div key={bk.bookingId} className={`flex items-center justify-between gap-2 p-2 rounded-lg border text-xs ${cardBg}`}>
                    <div>
                      <b className="font-mono text-teal-600">{bk.bookingId}</b> • {bk.farmerName}
                      <span className="block text-[10px] opacity-65">PIN: {bk.gatePassPin || 'GP-1024'} • {(bk.quantity || 0).toLocaleString('en-IN')} PL</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleSellerScanQrComplete(bk.bookingId)}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-lg cursor-pointer shrink-0"
                    >
                      Scan & Settle
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* =========================================================
          BUYER ANIMATED STATUS TRACKING MODAL
         ========================================================= */}
      {statusModalBooking && (() => {
        const bk = statusModalBooking;
        const isFinalCleared = bk.settlement?.status === 'BALANCE_CLEARED';
        const isPacked = bk.packingStatus === 'PACKING_DONE_BY_SELLER' || isFinalCleared;
        const steps = [
          { title: bk.fullPaid ? '100% Full Payment Paid' : '4% Advance Paid', sub: `Ref: ${bk.paymentId}`, done: true },
          { title: 'Salinity Acclimatization', sub: `Hatchery ${bk.batch?.salinity || 16} PPT → Pond ${bk.pondSalinity || 15} PPT`, done: true },
          { title: 'Packing & Gate-Pass Ready', sub: `${bk.packingDate} (${bk.packingTimeSlot || 'All Day'})`, done: isPacked },
          { title: 'Gate-Pass Scanned & Payment Settled', sub: isFinalCleared ? `Cleared ${bk.clearedAt || ''}` : 'Pending at Hatchery Gate', done: isFinalCleared }
        ];
        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <div>
                  <span className="font-mono text-[11px] font-bold text-teal-600">{bk.bookingId}</span>
                  <h3 className="font-extrabold text-base">Live Booking & Escrow Status</h3>
                </div>
                <button type="button" onClick={() => setStatusModalBooking(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
              </div>
              <div className="space-y-3">
                {steps.map((st, idx) => {
                  const revealed = statusAnimStep >= idx + 1;
                  const showTick = revealed && st.done;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-500 ${revealed ? 'opacity-100 translate-x-0' : 'opacity-30 -translate-x-2'} ${showTick ? 'border-emerald-500/40 bg-emerald-500/10' : subCardBg}`}
                    >
                      <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-transform duration-300 ${showTick ? 'bg-emerald-500 text-white scale-105' : 'bg-slate-400/20 text-slate-400'}`}>
                        {showTick ? <Check className="w-4 h-4" /> : <Clock className="w-3.5 h-3.5" />}
                      </div>
                      <div className="text-xs">
                        <div className={`font-extrabold ${showTick ? 'text-emerald-600 dark:text-emerald-400' : ''}`}>{st.title}</div>
                        <div className="text-[11px] opacity-70">{st.sub}</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-end">
                <button type="button" onClick={() => setStatusModalBooking(null)} className={`px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>{t.closeBtn}</button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* =========================================================
          BUYER PAY REMAINING 96% FULL PAYMENT MODAL
         ========================================================= */}
      {payRemainingBooking && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="font-mono text-[11px] font-bold text-teal-600">{payRemainingBooking.bookingId}</span>
                <h3 className="font-extrabold text-base">Pay Remaining Balance (Full Payment)</h3>
              </div>
              <button type="button" onClick={() => setPayRemainingBooking(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold opacity-75 block">Remaining Balance Payable</span>
              <span className="text-2xl font-black text-emerald-600">₹{(payRemainingBooking.balanceAtPacking || 0).toLocaleString('en-IN')}</span>
            </div>
            <form onSubmit={handleBuyerPayRemainingSubmit} className="space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-2">
                {['DIRECT_UPI', 'BANK_TO_BANK', 'RAZORPAY'].map(m => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setPayRemainingForm({ ...payRemainingForm, paymentMethod: m })}
                    className={`py-2 rounded-xl border font-bold text-[11px] cursor-pointer ${payRemainingForm.paymentMethod === m ? 'bg-teal-600 text-white border-teal-600' : subCardBg}`}
                  >
                    {m === 'DIRECT_UPI' ? 'UPI (QR/App)' : m === 'BANK_TO_BANK' ? 'Bank Transfer' : 'Razorpay'}
                  </button>
                ))}
              </div>
              {payRemainingForm.paymentMethod === 'DIRECT_UPI' && (
                <div className="flex flex-col items-center bg-white p-3 rounded-xl border text-slate-900 relative">
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=aquamark@sbi&pn=AquaMark&am=${payRemainingBooking.balanceAtPacking || 0}&cu=INR&tn=Balance${payRemainingBooking.bookingId}`)}`}
                    alt="Balance QR"
                    className={`w-32 h-32 object-contain ${payRemainingForm.qrRevealed ? '' : 'blur-md select-none'}`}
                  />
                  {!payRemainingForm.qrRevealed && (
                    <button type="button" onClick={() => setPayRemainingForm({ ...payRemainingForm, qrRevealed: true })} className="absolute inset-0 m-auto h-8 w-24 bg-teal-600 text-white font-bold text-xs rounded-lg cursor-pointer">
                      Show QR
                    </button>
                  )}
                </div>
              )}
              {(payRemainingForm.paymentMethod === 'DIRECT_UPI' || payRemainingForm.paymentMethod === 'BANK_TO_BANK') && (
                <input
                  required
                  type="text"
                  placeholder={t.utrPlaceholder}
                  value={payRemainingForm.utrReference}
                  onChange={(e) => setPayRemainingForm({ ...payRemainingForm, utrReference: e.target.value })}
                  className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                />
              )}
              <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer">
                Confirm & Pay ₹{(payRemainingBooking.balanceAtPacking || 0).toLocaleString('en-IN')} →
              </button>
            </form>
          </div>
        </div>
      )}

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
                    <div className="flex justify-between"><span>PL Vigor:</span><b className="text-indigo-500">{b.vigorScore || 96}%</b></div>
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
                  {activeInvoice.booking.bookingId} • Gate-Pass: {activeInvoice.booking.gatePassPin} • UTR: {activeInvoice.booking.paymentId}
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
                {(activeInvoice.booking.batch?.googleMapsLink || hatcheryProfiles[activeInvoice.booking.hatcheryOwnerPhone]?.googleMapsLink) && (
                  <a
                    href={(activeInvoice.booking.batch?.googleMapsLink || hatcheryProfiles[activeInvoice.booking.hatcheryOwnerPhone]?.googleMapsLink)}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 underline mt-1"
                  >
                    <MapPin className="w-3.5 h-3.5" /> Open Google Maps Location
                  </a>
                )}
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
                <span>{t.advancePaidLabel}:</span>
                <span>₹{(activeInvoice.booking.tokenAdvance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 font-bold">
                <span>{t.balanceAtPacking}:</span>
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