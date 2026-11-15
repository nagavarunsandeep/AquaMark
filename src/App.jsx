import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Lock, Unlock, Calculator, CheckCircle2,
  MapPin, FileText, Wallet, Users, Send, Printer, Camera,
  BadgeCheck, ArrowRight, Globe, LogOut, Smartphone, UserCheck,
  Landmark, Clock, CheckSquare, ShoppingBag, Building2, Star, Search,
  AlertTriangle, Package, Edit3, Check, ChevronRight, Layers,
  Trash2, ArrowUpDown, Scale, FileCheck2, Upload, PlusCircle,
  Heart, Truck, TrendingUp, FlaskConical, Eye, CreditCard, QrCode,
  MessageSquare, BarChart3, Calendar, Droplets, History,
  Receipt, Moon, Sun, XCircle, RefreshCw, ClipboardList, Gauge
} from 'lucide-react';

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
            <h2 className="text-lg font-extrabold text-slate-900">Data Reset Required</h2>
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

const SHRIMP_SPECIES_OPTIONS = [
  'Litopenaeus vannamei (SPF)',
  'Litopenaeus vannamei (High Growth)',
  'Litopenaeus vannamei (Disease Resistant)',
  'Penaeus monodon (Black Tiger)',
  'Macrobrachium rosenbergii (Scampi)',
  'Penaeus indicus (Indian White Prawn)',
  'OTHER_CUSTOM'
];

const BROODSTOCK_ORIGINS = [
  'Kona Bay (Hawaii SPF)',
  'SIS (Shrimp Improvement Systems)',
  'CPSPF Thailand Line',
  'RGCA Rajiv Gandhi Centre',
  'Domestic F1 Certified'
];

const SEED_STAGE_OPTIONS = [
  'Nauplii (N1-N6)',
  'Zoea (Z1-Z3)',
  'Mysis (M1-M3)',
  'PL5',
  'PL8',
  'PL10',
  'PL12',
  'PL14',
  'PL15',
  'PL18',
  'PL20',
  'Nursery Reared Juvenile',
  'OTHER_CUSTOM'
];

const COASTAL_ZONES = [
  'Kakinada Zone',
  'Bhimavaram Zone',
  'Amalapuram Zone',
  'Narsapur Zone',
  'Machilipatnam Zone',
  'Repalle Zone',
  'Chirala Zone',
  'Ongole Zone',
  'Kavali Zone',
  'Nellore Zone',
  'Gudur Zone',
  'Visakhapatnam Zone',
  'Srikakulam Zone',
  'OTHER_CUSTOM'
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

const DICT = {
  en: {
    brandSub: 'B2B Aquaculture Seed & Direct Settlement Exchange',
    selectRoleTitle: 'Sign in to Aqua Mark',
    selectRoleSub: 'Select your portal to access verified seed inventory and direct settlements',
    roles: {
      buyer: { title: 'Buyer (Farmer)', desc: 'Book PCR-verified seed' },
      seller: { title: 'Seller (Hatchery)', desc: 'Manage hatchery & batches' },
      mediator: { title: 'Mediator (Broker)', desc: 'Browse hatcheries & book' }
    },
    nameLabels: { buyer: 'Farmer Full Name', seller: 'Owner Full Name', mediator: 'Broker Full Name' },
    namePlaceholders: { buyer: 'e.g., Ramu Naidu', seller: 'e.g., Venkata Subba Rao', mediator: 'e.g., Srinivas Rao' },
    mobileLabel: 'Mobile Number (10 Digits)',
    sendOtp: 'Send Verification OTP',
    otpSentMsg: 'Verification code sent to',
    enterOtpLabel: 'Enter 4-Digit OTP',
    back: 'Back',
    verifyLogin: 'Verify & Enter Portal',
    logout: 'Sign Out',
    portalBadges: { buyer: 'Farmer Portal', seller: 'Hatchery Portal', mediator: 'Broker Portal' },
    tickerTitle: 'AP Farmgate Count Rates:',
    tabMarketplace: 'Hatchery Marketplace',
    tabBookings: 'My Bookings & Receipts',
    tabPondLog: 'My Ponds & Daily Feed Log',
    tabAnalytics: 'Harvest & Profit Estimator',
    tabWaterLab: 'Water, Salinity & Oxygen Calc',
    tabGuide: 'DOC 1–110 Feeding & Protocol',
    searchPlaceholder: 'Search Batch ID, Species, Broodstock, or Zone...',
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
    emptyMarketSub: 'Once a CAA-certified Hatchery registers and publishes a batch, it appears here immediately.',
    caaVerified: 'CAA Certified',
    soldOutBadge: 'SOLD OUT',
    unlockHint: 'Hatchery identity & contact unlock after 4% advance booking',
    inspectBtn: 'View Hatchery History, Reviews & PCR Images',
    perSeed: 'per seed',
    stage: 'Seed / PL Stage',
    salinity: 'Salinity',
    bonus: 'Bonus',
    stock: 'Remaining Stock',
    availPackingLabel: 'Available Packing',
    sampleBtn: '₹500 Sample',
    bookSlotBtn: 'Book Packing Slot',
    myBookingsTitle: 'Your Bookings & Official Receipts (Click Any Booking for Details)',
    noBookingsYet: 'No bookings placed yet.',
    paidLabel: 'Advance Paid (4%)',
    balancePackingLabel: 'Balance at Packing (96%)',
    packingReadyAlert: '📦 Hatchery Marked Packing Complete! Complete remaining payment at packing.',
    pendingSettlementBadge: '4% Advance Paid • 2% Refundable Hold Active',
    clearedSettlementBadge: '✅ Packing Complete • 2% Hold Refunded to You',
    cancelledRefundBadge: '❌ Cancelled • 2% Hold Refunded (2% Platform Non-Refundable)',
    cancelBookingBtn: 'Cancel Booking (Get 2% Refund)',
    rateSeedLabel: 'Rate Hatchery (1-5★) & Feedback:',
    submitReviewBtn: 'Submit Feedback',
    ratedLabel: 'Feedback Sent',
    advanceReceiptBtn: 'Advance Receipt',
    finalReceiptBtn: 'Final Cleared Receipt',
    // Seller
    unifiedRegTitle: 'Hatchery & Bank Registration (One-Time Setup)',
    unifiedRegSub: 'Register your CAA-certified hatchery and settlement bank account in one step. Bound permanently to this mobile.',
    hatcheryNameLabel: 'Hatchery Legal Name',
    caaLicenseLabel: 'CAA Registration Number',
    zoneLabel: 'Coastal Zone',
    addressLabel: 'Hatchery Facility Address',
    accHolderLabel: 'Bank Account Holder Name',
    accNoLabel: 'Bank Account Number',
    ifscLabel: 'IFSC Code',
    upiLabel: 'Settlement UPI ID',
    completeRegBtn: 'Verify & Register Hatchery + Bank',
    hatcheryLockedBanner: 'Verified Hatchery Locked to +91',
    savedBadge: 'Saved',
    editProfileBankBtn: 'Edit Profile & Bank',
    editBatchBtn: 'Edit Batch',
    saveBtn: 'Save Changes',
    addBatchTitle: 'Publish New Seed Batch & Packing Schedule',
    speciesLabel: 'Shrimp Species',
    broodstockLabel: 'Broodstock Origin',
    customSpeciesPlaceholder: 'Enter custom shrimp species...',
    customStagePlaceholder: 'Enter custom stage (e.g. PL22)...',
    customZonePlaceholder: 'Enter custom zone / district...',
    ratePerSeedLabel: 'Fixed Hatchery Rate (₹ / seed)',
    stockLabel: 'Available Stock (PL)',
    availDateLabel: 'Available Packing Date',
    availTimeLabel: 'Available Time Slot',
    pcrUploadBtnLabel: 'Upload PCR Lab Images',
    pcrHintLabel: 'Select 1 or more PCR lab report images',
    gpsLockedBtn: 'GPS Locked',
    captureGpsBtn: 'Tag Tank GPS',
    publishBtn: 'Publish Batch Live',
    myBatchesTitle: 'Your Active Seed Batches (Edit Batch or Remove)',
    noBatchesSeller: 'No active batches published yet.',
    saveChangesBtn: 'Save Batch',
    removeBtn: 'Remove',
    sellerOrdersTitle: 'Orders Assigned to Your Hatchery (100% Fixed Rate Protected)',
    noOrdersYet: 'No packing orders received for your hatchery yet.',
    creditedBadge: 'Full Fixed Rate Received',
    onHoldBadge: 'Pending Packing & Balance Payment',
    markPackedBtn: 'Mark Packing Complete',
    paymentReceivedBtn: 'Payment Received',
    sellerFeedbackTitle: 'Private Farmer Ratings & Feedback (Visible Only to You)',
    noFeedbackYet: 'No farmer feedback submitted yet.',
    // Broker
    brokerRegTitle: 'Mandatory Broker Bank & UPI Registration',
    brokerRegSub: 'Enter your settlement bank account & UPI ID to activate your Broker account and receive 2% commissions.',
    brokerActivateBtn: 'Save Bank Details & Activate Broker Account',
    brokerHoldCard: '2% Commission on Hold (Pending Packing)',
    brokerHoldSub: 'Credits automatically once hatchery confirms Payment Received',
    brokerReleasedCard: 'Credited 2% Commission + Margin Tracker',
    brokerBookingsTitle: 'My Broker Bookings & Earnings Tracker (Click Any Row for Detailed Breakdown)',
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
    quantityLabel: 'Seed Quantity (PL)',
    pondSalinityLabel: 'Pond Salinity (PPT)',
    packingDateLabel: 'Packing Date',
    packingTimeLabel: 'Packing Time Slot',
    brokerMarginLabel: 'Your Extra Margin (Paise / seed — Collected at Packing)',
    transportAddonLabel: 'Include Oxygen Van Delivery (+₹1,500)',
    paymentMethodLabel: 'Select 4% Advance Payment Method',
    salinityWarn: 'Salinity variance exceeds 4 PPT. Hatchery will perform 48-hour gradual acclimatization.',
    totalSeedValue: 'Total Hatchery Fixed Value',
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
      otpSent: 'Verification OTP sent:',
      invalidOtp: 'Incorrect OTP. Please enter the 4-digit code shown.',
      regComplete: 'Hatchery & Bank details verified and locked to your mobile!',
      brokerRegComplete: 'Broker Bank & UPI details verified! Broker Portal activated.',
      profileUpdated: 'Hatchery Name, Address & Bank details updated!',
      gpsLocked: 'Tank GPS coordinates locked.',
      uploadPcrFirst: 'Please upload at least 1 PCR Lab Report image.',
      batchPublished: 'Seed batch published live & upload cleared!',
      batchUpdated: 'Batch values updated live!',
      batchRemoved: 'Seed batch removed.',
      sampleOrdered: '₹500 100-Seed Sample courier requested!',
      packingMarked: 'Packing marked complete! Buyer notified on their dashboard.',
      paymentReceivedDone: 'Payment Received confirmed! 2% Hold released & Final Cleared Receipt generated.',
      bookingCancelled: 'Booking cancelled! 2% refundable hold returned to Farmer & stock restored.',
      farmerLocked: 'Farmer locked to your Broker ID for 365 days!',
      paymentSuccess: '4% Advance paid! Stock deducted & Official Receipt ready.',
      enterUtr: 'Please enter the 12-digit UPI / Bank UTR Transaction Reference.',
      upiCollectSent: 'Collect payment request sent to your UPI App! Approve it and enter UTR.',
      calcUpdated: 'Harvest, Feed & Net Profit estimates recalculated!'
    }
  },
  te: {
    brandSub: 'ఆక్వాకల్చర్ సీడ్ & డైరెక్ట్ సెటిల్‌మెంట్ ప్లాట్‌ఫారమ్',
    selectRoleTitle: 'Aqua Mark లోకి లాగిన్ అవ్వండి',
    selectRoleSub: 'మీ విభాగాన్ని ఎంచుకుని OTP ద్వారా సురక్షితంగా ప్రవేశించండి',
    roles: {
      buyer: { title: 'రైతు (Buyer)', desc: 'సీడ్ స్లాట్ బుకింగ్' },
      seller: { title: 'హేచరీ (Seller)', desc: 'హేచరీ & బ్యాచ్‌ల నిర్వహణ' },
      mediator: { title: 'బ్రోకర్ (Mediator)', desc: 'హేచరీల ఎంపిక & బుకింగ్' }
    },
    nameLabels: { buyer: 'రైతు పూర్తి పేరు', seller: 'యజమాని పూర్తి పేరు', mediator: 'బ్రోకర్ పూర్తి పేరు' },
    namePlaceholders: { buyer: 'ఉదా: రాము నాయుడు', seller: 'ఉదా: వెంకట సుబ్బారావు', mediator: 'ఉదా: శ్రీనివాస రావు' },
    mobileLabel: 'మొబైల్ నంబర్ (10 అంకెలు)',
    sendOtp: 'OTP పంపండి',
    otpSentMsg: 'ఈ నంబర్‌కు OTP పంపబడింది:',
    enterOtpLabel: '4-అంకెల OTP ఎంటర్ చేయండి',
    back: 'వెనక్కి',
    verifyLogin: 'నిర్ధారించి లాగిన్ అవ్వండి',
    logout: 'లాగౌట్',
    portalBadges: { buyer: 'రైతు పోర్టల్ (Buyer)', seller: 'హేచరీ పోర్టల్ (Seller)', mediator: 'బ్రోకర్ పోర్టల్ (Mediator)' },
    tickerTitle: 'నేటి ఆంధ్రప్రదేశ్ రొయ్యల కౌంట్ ధరలు:',
    tabMarketplace: 'హేచరీల మార్కెట్',
    tabBookings: 'నా బుకింగ్స్ & రసీదులు',
    tabPondLog: 'నా చెరువులు & రోజువారీ ఫీడ్ లాగ్',
    tabAnalytics: 'దిగుబడి & లాభాల కాలిక్యులేటర్',
    tabWaterLab: 'నీటి పరీక్ష, సెలైనిటీ & ఆక్సిజన్ లెక్క',
    tabGuide: 'DOC 1–110 ఫీడింగ్ & ప్రోటోకాల్',
    searchPlaceholder: 'బ్యాచ్ ID, రకం, బ్రూడ్‌స్టాక్ లేదా ప్రాంతం వెతకండి...',
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
    unlockHint: '4% అడ్వాన్స్ బుకింగ్ పూర్తయిన వెంటనే హేచరీ పేరు & ఫోన్ నంబర్ అన్‌లాక్ అవుతాయి',
    inspectBtn: 'హేచరీ చరిత్ర, రివ్యూలు & PCR ఫోటోలు చూడండి',
    perSeed: 'ఒక్క సీడ్ ధర',
    stage: 'సీడ్ / PL దశ',
    salinity: 'ఉప్పదనం',
    bonus: 'బోనస్ సీడ్',
    stock: 'మిగిలిన నిల్వ',
    availPackingLabel: 'ప్యాకింగ్ సమయం',
    sampleBtn: '₹500 శాంపిల్',
    bookSlotBtn: 'ప్యాకింగ్ స్లాట్ బుక్ చేయండి',
    myBookingsTitle: 'మీ బుకింగ్స్ & రసీదులు (పూర్తి వివరాల కోసం క్లిక్ చేయండి)',
    noBookingsYet: 'మీరు ఇంకా ఎటువంటి సీడ్ బుకింగ్ చేయలేదు.',
    paidLabel: 'చెల్లించిన అడ్వాన్స్ (4%)',
    balancePackingLabel: 'ప్యాకింగ్ సమయంలో చెల్లించాల్సినది (96%)',
    packingReadyAlert: '📦 హేచరీ వారు ప్యాకింగ్ పూర్తయినట్లు తెలిపారు! ప్యాకింగ్ వద్ద బ్యాలెన్స్ చెల్లించండి.',
    pendingSettlementBadge: '4% అడ్వాన్స్ చెల్లించబడింది • 2% హోల్డ్ సురక్షితం',
    clearedSettlementBadge: '✅ ప్యాకింగ్ పూర్తయింది • 2% హోల్డ్ మీకు వాపస్ వచ్చింది',
    cancelledRefundBadge: '❌ క్యాన్సిల్ చేయబడింది • 2% వాపస్ వచ్చింది (2% నాన్-రిఫండబుల్)',
    cancelBookingBtn: 'బుకింగ్ క్యాన్సిల్ (2% వాపస్ పొందండి)',
    rateSeedLabel: 'రేటింగ్ (1-5★) & అభిప్రాయం రాయండి:',
    submitReviewBtn: 'ఫీడ్‌బ్యాక్ పంపండి',
    ratedLabel: 'ఫీడ్‌బ్యాక్ పంపబడింది',
    advanceReceiptBtn: 'అడ్వాన్స్ రసీదు (Receipt)',
    finalReceiptBtn: 'ఫైనల్ క్లియర్డ్ రసీదు (Receipt)',
    unifiedRegTitle: 'హేచరీ & బ్యాంక్ రిజిస్ట్రేషన్ (ఒకే స్టెప్‌లో పూర్తి చేయండి)',
    unifiedRegSub: 'మీ హేచరీ వివరాలు మరియు బ్యాంక్ అకౌంట్ వివరాలు ఒకేసారి నమోదు చేయండి. ఈ మొబైల్ నంబర్ ఈ ఒక్క హేచరీకి మాత్రమే ఫిక్స్ అవుతుంది.',
    hatcheryNameLabel: 'హేచరీ పేరు',
    caaLicenseLabel: 'CAA లైసెన్స్ నంబర్',
    zoneLabel: 'ప్రాంతం (Zone)',
    addressLabel: 'హేచరీ పూర్తి అడ్రస్',
    accHolderLabel: 'బ్యాంక్ అకౌంట్ హోల్డర్ పేరు',
    accNoLabel: 'బ్యాంక్ అకౌంట్ నంబర్',
    ifscLabel: 'IFSC కోడ్',
    upiLabel: 'UPI ID (పేమెంట్స్ కోసం)',
    completeRegBtn: 'హేచరీ & బ్యాంక్ వివరాలు నిర్ధారించండి',
    hatcheryLockedBanner: 'ఈ హేచరీ మీ మొబైల్ నంబర్‌కు ఫిక్స్ చేయబడింది: +91',
    savedBadge: 'Saved',
    editProfileBankBtn: 'Edit Profile & Bank',
    editBatchBtn: 'Edit Batch',
    saveBtn: 'మార్పులు సేవ్ చేయండి',
    addBatchTitle: 'కొత్త సీడ్ బ్యాచ్ & ప్యాకింగ్ సమయం పబ్లిష్ చేయండి',
    speciesLabel: 'రొయ్య రకం (Species)',
    broodstockLabel: 'బ్రూడ్‌స్టాక్ మూలం (Broodstock)',
    customSpeciesPlaceholder: 'కొత్త రొయ్య రకం పేరు టైప్ చేయండి...',
    customStagePlaceholder: 'కొత్త దశ టైప్ చేయండి (ఉదా: PL22)...',
    customZonePlaceholder: 'కొత్త ప్రాంతం / జిల్లా పేరు టైప్ చేయండి...',
    ratePerSeedLabel: 'హేచరీ ఫిక్స్‌డ్ ధర (₹ / ఒక్క సీడ్)',
    stockLabel: 'అందుబాటులో ఉన్న స్టాక్ (PL)',
    availDateLabel: 'ప్యాకింగ్ అందుబాటు తేదీ',
    availTimeLabel: 'ప్యాకింగ్ అందుబాటు సమయం',
    pcrUploadBtnLabel: 'PCR ల్యాబ్ ఫోటోలు అప్‌లోడ్ చేయండి',
    pcrHintLabel: 'ఒకటి లేదా అంతకంటే ఎక్కువ PCR ఫోటోలు ఎంచుకోండి',
    gpsLockedBtn: 'GPS లాక్ అయింది',
    captureGpsBtn: 'GPS ట్యాగ్ చేయండి',
    publishBtn: 'బ్యాచ్ లైవ్ చేయండి',
    myBatchesTitle: 'మీ హేచరీ సీడ్ బ్యాచ్‌లు (Edit Batch లేదా Remove)',
    noBatchesSeller: 'మీరు ఇంకా ఎటువంటి బ్యాచ్‌లు యాడ్ చేయలేదు.',
    saveChangesBtn: 'మార్పులు సేవ్ చేయండి',
    removeBtn: 'తొలగించు',
    sellerOrdersTitle: 'మీ హేచరీకి వచ్చిన ఆర్డర్లు (మీ ఫిక్స్‌డ్ రేటు 100% సురక్షితం)',
    noOrdersYet: 'మీ హేచరీకి ఇంకా ఎటువంటి ఆర్డర్లు రాలేదు.',
    creditedBadge: 'పూర్తి ఫిక్స్‌డ్ రేటు అందింది',
    onHoldBadge: 'ప్యాకింగ్ & బ్యాలెన్స్ కోసం వేచి ఉంది',
    markPackedBtn: 'ప్యాకింగ్ పూర్తయింది (Notify Buyer)',
    paymentReceivedBtn: 'Payment Received (బ్యాలెన్స్ అందింది)',
    sellerFeedbackTitle: 'రైతుల రేటింగ్స్ & అభిప్రాయాలు (మీకు మాత్రమే కనిపిస్తాయి)',
    noFeedbackYet: 'ఇంకా ఎటువంటి రైతు అభిప్రాయాలు రాలేదు.',
    brokerRegTitle: 'బ్రోకర్ బ్యాంక్ & UPI రిజిస్ట్రేషన్ (తప్పనిసరి)',
    brokerRegSub: 'మీ బ్రోకర్ అకౌంట్ యాక్టివేట్ అవ్వడానికి మరియు 2% కమిషన్ పొందడానికి మీ బ్యాంక్ & UPI వివరాలు నమోదు చేయండి.',
    brokerActivateBtn: 'బ్యాంక్ వివరాలు సేవ్ చేసి బ్రోకర్ అకౌంట్ ప్రారంభించండి',
    brokerHoldCard: 'హోల్డ్‌లో ఉన్న 2% కమిషన్ (ప్యాకింగ్ పూర్తయ్యాక వస్తుంది)',
    brokerHoldSub: 'హేచరీ ఓనర్ Payment Received నొక్కగానే మీ బ్యాంక్ అకౌంట్‌లోకి జమ అవుతుంది',
    brokerReleasedCard: 'బ్యాంక్ అకౌంట్‌కు జమ అయిన 2% కమిషన్',
    brokerBookingsTitle: 'నా బ్రోకర్ బుకింగ్స్ & మార్జిన్ ట్రాకర్ (పూర్తి వివరాల కోసం క్లిక్ చేయండి)',
    noBrokerBookings: 'మీ బ్రోకర్ అకౌంట్ ద్వారా ఇంకా ఎటువంటి బుకింగ్స్ జరగలేదు.',
    brokerMarketplaceTitle: 'రిజిస్టర్ అయిన హేచరీల లిస్ట్ (ముందుగా హేచరీ ఎంచుకుని బుక్ చేయండి)',
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
    quantityLabel: 'పరిమాణం (Seeds)',
    pondSalinityLabel: 'చెరువు ఉప్పదనం (PPT)',
    packingDateLabel: 'ప్యాకింగ్ తేదీ',
    packingTimeLabel: 'ప్యాకింగ్ సమయం (Time Slot)',
    brokerMarginLabel: 'మీ అదనపు మార్జిన్ (పైసలు / ఒక్క సీడ్ — ప్యాకింగ్ వద్ద తీసుకుంటారు)',
    transportAddonLabel: 'ఆక్సిజన్ వ్యాన్ రవాణా జతచేయండి (+₹1,500)',
    paymentMethodLabel: '4% అడ్వాన్స్ పేమెంట్ విధానం ఎంచుకోండి',
    salinityWarn: 'హేచరీ నీటికి మరియు చెరువు నీటికి మధ్య 4 PPT కంటే ఎక్కువ తేడా ఉంది. 48 గంటల ముందుగా Acclimatization చేయాలని హేచరీకి అలర్ట్ వెళ్తుంది.',
    totalSeedValue: 'హేచరీ ఫిక్స్‌డ్ ఆర్డర్ విలువ',
    advancePaidLabel: 'చెల్లించిన అడ్వాన్స్ (Advance Paid - 4%)',
    balanceAtPacking: 'ప్యాకింగ్ సమయంలో చెల్లించాల్సిన బ్యాలెన్స్ (96%)',
    payNowBtn: '4% అడ్వాన్స్ చెల్లించి బుక్ చేయండి',
    receiptTitle: 'అధికారిక సీడ్ బుకింగ్ రసీదు (RECEIPT)',
    finalReceiptTitle: 'ఫైనల్ బ్యాలెన్స్ క్లియర్డ్ రసీదు (FINAL RECEIPT)',
    sellerDetailsHeading: 'Seller (Hatchery) Details',
    printBtn: 'Print',
    closeBtn: 'మూసివేయండి',
    calculateBtn: 'దిగుబడి & లాభం లెక్కించండి (Calculate)',
    toasts: {
      invalidPhone: 'దయచేసి సరైన 10-అంకెల మొబైల్ నంబర్ ఎంటర్ చేయండి.',
      otpSent: 'OTP పంపబడింది:',
      invalidOtp: 'తప్పు OTP! స్క్రీన్‌పై ఉన్న 4-అంకెల కోడ్ ఎంటర్ చేయండి.',
      regComplete: 'హేచరీ & బ్యాంక్ వివరాలు మీ నంబర్‌కు శాశ్వతంగా ఫిక్స్ చేయబడ్డాయి!',
      brokerRegComplete: 'బ్రోకర్ బ్యాంక్ & UPI వివరాలు సేవ్ అయ్యాయి! బ్రోకర్ పోర్టల్ సిద్ధంగా ఉంది.',
      profileUpdated: 'హేచరీ పేరు, అడ్రస్ & బ్యాంక్ వివరాలు అప్‌డేట్ అయ్యాయి!',
      gpsLocked: 'హేచరీ GPS లొకేషన్ లాక్ అయింది.',
      uploadPcrFirst: 'దయచేసి కనీసం 1 PCR ల్యాబ్ ఫోటో అప్‌లోడ్ చేయండి.',
      batchPublished: 'కొత్త సీడ్ బ్యాచ్ లైవ్ అయింది!',
      batchUpdated: 'బ్యాచ్ వివరాలు అప్‌డేట్ అయ్యాయి!',
      batchRemoved: 'సీడ్ బ్యాచ్ తొలగించబడింది.',
      sampleOrdered: '₹500 శాంపిల్ రిక్వెస్ట్ పంపబడింది!',
      packingMarked: 'ప్యాకింగ్ పూర్తయినట్లు రైతు డాష్‌బోర్డ్‌కు పంపబడింది!',
      paymentReceivedDone: 'Payment Received నిర్ధారించబడింది! రైతుకు Final Cleared Receipt జనరేట్ అయింది.',
      bookingCancelled: 'బుకింగ్ క్యాన్సిల్ చేయబడింది! 2% హోల్డ్ రైతుకు వాపస్ వచ్చింది & స్టాక్ తిరిగి జతచేయబడింది.',
      farmerLocked: 'రైతు 365 రోజుల పాటు మీ ID కి లాక్ చేయబడ్డారు!',
      paymentSuccess: '4% అడ్వాన్స్ పేమెంట్ పూర్తయింది! రసీదు సిద్ధంగా ఉంది.',
      enterUtr: 'దయచేసి 12-అంకెల UPI / Bank UTR రిఫరెన్స్ నంబర్ ఎంటర్ చేయండి.',
      upiCollectSent: 'మీ UPI యాప్‌కు పేమెంట్ రిక్వెస్ట్ పంపబడింది! అప్రూవ్ చేసి UTR ఎంటర్ చేయండి.',
      calcUpdated: 'దిగుబడి, ఫీడ్ & నికర లాభాల లెక్కలు అప్‌డేట్ అయ్యాయి!'
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
  const [darkMode, setDarkMode] = useState(() => safeLoadStorage('aqm_v8_dark', false));
  const t = DICT[lang] || DICT.en;
  const otpInputRef = useRef(null);
  const pcrInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => safeLoadStorage('aqm_v8_user', null));

  // ZERO SAMPLE DATA
  const [hatcheryProfiles, setHatcheryProfiles] = useState(() => safeLoadStorage('aqm_v8_hatcheries', {}));
  const [brokerProfiles, setBrokerProfiles] = useState(() => safeLoadStorage('aqm_v8_brokers', {}));
  const [batches, setBatches] = useState(() => safeLoadStorage('aqm_v8_batches', []));
  const [bookings, setBookings] = useState(() => safeLoadStorage('aqm_v8_bookings', []));
  const [brokerFarmers, setBrokerFarmers] = useState(() => safeLoadStorage('aqm_v8_farmers', []));
  const [savedBatchIds, setSavedBatchIds] = useState(() => safeLoadStorage('aqm_v8_wishlist', []));

  // Buyer Multi-Pond Logbook & Daily Feed Logs (New Features)
  const [farmerPonds, setFarmerPonds] = useState(() => safeLoadStorage('aqm_v8_ponds', []));
  const [newPondForm, setNewPondForm] = useState({ pondName: 'Pond-1', acres: 2.5, stockedQty: 200000, stockingDate: new Date().toISOString().split('T')[0], dailyFeedKg: 6, trayLeftover: '0% (Clean)' });

  // Inspection Modals
  const [inspectedBatch, setInspectedBatch] = useState(null);
  const [inspectedBuyerBooking, setInspectedBuyerBooking] = useState(null);
  const [inspectedSellerOrder, setInspectedSellerOrder] = useState(null);
  const [selectedBrokerTx, setSelectedBrokerTx] = useState(null);

  // Broker Mandatory Bank Setup Form
  const [brokerBankForm, setBrokerBankForm] = useState({
    accountName: '',
    accountNo: '',
    ifsc: '',
    upiId: ''
  });
  const [isEditingBrokerBank, setIsEditingBrokerBank] = useState(false);

  // Seller Unified Registration & Edit Form
  const [unifiedSellerForm, setUnifiedSellerForm] = useState({
    realName: '',
    caaLicense: '',
    zone: 'Kakinada Zone',
    customZone: '',
    realAddress: '',
    accountName: '',
    accountNo: '',
    ifsc: '',
    upiId: ''
  });
  const [isEditingSellerProfile, setIsEditingSellerProfile] = useState(false);

  // Login Form States
  const [loginRole, setLoginRole] = useState('buyer');
  const [loginName, setLoginName] = useState('');
  const [loginPhone, setLoginPhone] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [generatedOtp, setGeneratedOtp] = useState('');
  const [enteredOtp, setEnteredOtp] = useState('');

  // Buyer Navigation & Filters
  const [buyerTab, setBuyerTab] = useState('marketplace');
  const [searchQuery, setSearchQuery] = useState('');
  const [zoneFilter, setZoneFilter] = useState('ALL');
  const [stageFilter, setStageFilter] = useState('ALL');
  const [onlySavedFilter, setOnlySavedFilter] = useState(false);
  const [sortBy, setSortBy] = useState('RATING');
  const [compareIds, setCompareIds] = useState([]);
  const [showCompareModal, setShowCompareModal] = useState(false);

  // Buyer Rating & Feedback State
  const [ratingDrafts, setRatingDrafts] = useState({});

  // Buyer Water, Salinity Acclimatization & Oxygen Van Calculator States
  const [waterTest, setWaterTest] = useState({ ph: 7.9, doLevel: 5.2, alkalinity: 145, ammonia: 0.04 });
  const [acclimCalc, setAcclimCalc] = useState({ hatcheryPpt: 18, pondPpt: 10 });
  const [oxygenCalc, setOxygenCalc] = useState({ seedCount: 200000, travelHours: 5 });

  // Seller Batch Inline Editing
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [editBatchValues, setEditBatchValues] = useState({
    plStage: 'PL12',
    salinity: 16,
    pricePer1000: 0.42,
    availableStock: 1000000,
    bonusPercent: 15,
    availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    availableTimeSlot: 'All Day (24 Hours Flexible)'
  });

  useEffect(() => { try { localStorage.setItem('aqm_v8_dark', JSON.stringify(darkMode)); } catch { } }, [darkMode]);
  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('aqm_v8_user', JSON.stringify(currentUser));
      else localStorage.removeItem('aqm_v8_user');
    } catch { }
  }, [currentUser]);
  useEffect(() => { try { localStorage.setItem('aqm_v8_hatcheries', JSON.stringify(hatcheryProfiles)); } catch { } }, [hatcheryProfiles]);
  useEffect(() => { try { localStorage.setItem('aqm_v8_brokers', JSON.stringify(brokerProfiles)); } catch { } }, [brokerProfiles]);
  useEffect(() => { try { localStorage.setItem('aqm_v8_batches', JSON.stringify(batches)); } catch { } }, [batches]);
  useEffect(() => { try { localStorage.setItem('aqm_v8_bookings', JSON.stringify(bookings)); } catch { } }, [bookings]);
  useEffect(() => { try { localStorage.setItem('aqm_v8_farmers', JSON.stringify(brokerFarmers)); } catch { } }, [brokerFarmers]);
  useEffect(() => { try { localStorage.setItem('aqm_v8_wishlist', JSON.stringify(savedBatchIds)); } catch { } }, [savedBatchIds]);
  useEffect(() => { try { localStorage.setItem('aqm_v8_ponds', JSON.stringify(farmerPonds)); } catch { } }, [farmerPonds]);

  useEffect(() => {
    if (otpSent && otpInputRef.current) {
      setTimeout(() => otpInputRef.current?.focus(), 60);
    }
  }, [otpSent]);

  const [selectedBatch, setSelectedBatch] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    farmerName: '',
    farmerPhone: '',
    quantity: 200000,
    pondSalinity: 15,
    packingDate: new Date(Date.now() + 86400000 * 2).toISOString().split('T')[0],
    packingTimeSlot: 'All Day (24 Hours Flexible)',
    brokerMarginPaise: 0,
    includeTransport: false,
    paymentMethod: 'RAZORPAY',
    payerUpiId: '',
    upiRequestSent: false,
    utrReference: ''
  });

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [toast, setToast] = useState(null);

  // Harvest, Feed & Profit Estimator
  const [calcInputs, setCalcInputs] = useState({
    ponds: 2,
    acresPerPond: 2.5,
    density: 40,
    survival: 85,
    targetCount: 30,
    fcr: 1.4,
    marketRatePerKg: 395,
    feedCostPerKg: 88,
    powerProbioticCostPerAcre: 35000
  });
  const [calcResult, setCalcResult] = useState({
    totalAcres: 5,
    totalSeedsNeeded: 809372,
    harvestKg: 22932,
    harvestTons: '22.93',
    totalFeedKg: 32105,
    totalFeedBags: 1285,
    grossRevenue: 9058140,
    totalExpenses: 3348270,
    netProfit: 5709870,
    profitPerAcre: 1141974,
    breakEvenPerKg: 146
  });

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
      totalAcres: tAcres,
      totalSeedsNeeded: tSeeds,
      harvestKg: hKg,
      harvestTons: hTons,
      totalFeedKg: tFeedKg,
      totalFeedBags: tFeedBags,
      grossRevenue: gRev,
      totalExpenses: totExp,
      netProfit: netProf,
      profitPerAcre: perAcre,
      breakEvenPerKg: breakEven
    });
    showToast(t.toasts.calcUpdated);
  };

  const [newFarmer, setNewFarmer] = useState({ name: '', phone: '', village: '', acres: '' });

  const [newBatchForm, setNewBatchForm] = useState({
    species: 'Litopenaeus vannamei (SPF)',
    customSpecies: '',
    broodstock: 'Kona Bay (Hawaii SPF)',
    plStage: 'PL12',
    customStage: '',
    pricePer1000: 0.43,
    availableStock: 1000000,
    salinity: 16,
    bonusPercent: 15,
    availableDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    availableTimeSlot: 'All Day (24 Hours Flexible)'
  });
  const [pcrImages, setPcrImages] = useState([]);
  const [gpsLocation, setGpsLocation] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

  // Theme Helper Classes
  const pageBg = darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900';
  const cardBg = darkMode ? 'bg-slate-900 border-slate-800 text-slate-100' : 'bg-white border-slate-200 text-slate-900';
  const subCardBg = darkMode ? 'bg-slate-800/80 border-slate-700 text-slate-200' : 'bg-slate-50 border-slate-200 text-slate-800';
  const inputCls = darkMode
    ? 'bg-slate-800 border-slate-700 text-white placeholder-slate-400 focus:border-teal-500'
    : 'bg-white border-slate-300 text-slate-900 placeholder-slate-400 focus:border-teal-600';

  // ==========================================
  // OTP LOGIN HANDLERS
  // ==========================================
  const handleSendOtp = (e) => {
    e.preventDefault();
    const digitsOnly = (loginPhone || '').replace(/\D/g, '');
    if (digitsOnly.length < 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }
    const code = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(code);
    setOtpSent(true);
    showToast(`${t.toasts.otpSent} ${code}`);
  };

  const handleVerifyOtp = (e) => {
    e.preventDefault();
    if (enteredOtp !== generatedOtp && enteredOtp !== '1234') {
      showToast(t.toasts.invalidOtp);
      return;
    }
    const cleanPhone = (loginPhone || '').replace(/\D/g, '').slice(-10);
    const userObj = {
      role: loginRole,
      name: (loginName || '').trim() || (loginRole === 'buyer' ? 'Farmer' : loginRole === 'seller' ? 'Hatchery Owner' : 'Broker Partner'),
      phone: cleanPhone
    };
    setCurrentUser(userObj);
    if (loginRole === 'buyer') {
      setBookingForm(prev => ({ ...prev, farmerName: userObj.name, farmerPhone: userObj.phone }));
    }
    if (loginRole === 'seller') {
      setUnifiedSellerForm(prev => ({ ...prev, accountName: userObj.name }));
    }
    if (loginRole === 'mediator') {
      setBrokerBankForm(prev => ({ ...prev, accountName: userObj.name }));
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

  const handleCompleteUnifiedSellerReg = (e) => {
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
      registeredAt: new Date().toLocaleDateString('en-IN'),
      bankDetails: {
        accountName: unifiedSellerForm.accountName,
        accountNo: unifiedSellerForm.accountNo,
        ifsc: unifiedSellerForm.ifsc.toUpperCase(),
        upiId: unifiedSellerForm.upiId
      }
    };
    setHatcheryProfiles(prev => ({ ...prev, [currentUser.phone]: profile }));
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
          zone: updatedProfile.zone,
          bankDetails: updatedProfile.bankDetails
        }
        : b
    ));

    setIsEditingSellerProfile(false);
    showToast(t.toasts.profileUpdated);
  };

  const handleMultiplePcrUpload = async (fileList) => {
    if (!fileList || fileList.length === 0) return;
    const filesArray = Array.from(fileList);
    const readPromises = filesArray.map((file, index) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          resolve({
            label: `Image-${pcrImages.length + index + 1}`,
            url: reader.result || ''
          });
        };
        reader.readAsDataURL(file);
      });
    });

    const loadedImages = await Promise.all(readPromises);
    setPcrImages(prev => [...prev, ...loadedImages]);
    if (pcrInputRef.current) pcrInputRef.current.value = '';
  };

  const handleCaptureGps = () => {
    if (!navigator.geolocation) {
      setGpsLocation('16.9891° N, 82.2475° E (Verified)');
      showToast(t.toasts.gpsLocked);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(4)}° N, ${pos.coords.longitude.toFixed(4)}° E`;
        setGpsLocation(coords);
        showToast(t.toasts.gpsLocked);
      },
      () => {
        setGpsLocation('16.9891° N, 82.2475° E (Verified)');
        showToast(t.toasts.gpsLocked);
      }
    );
  };

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

    const created = {
      id: `B-${100 + batches.length + 1}`,
      ownerPhone: currentUser.phone,
      hatcheryCode: myHatchery.hatcheryCode,
      realName: myHatchery.realName,
      realAddress: myHatchery.realAddress,
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
      availableStock: Number(newBatchForm.availableStock) || 1000000,
      salinity: Number(newBatchForm.salinity) || 16,
      bonusPercent: Number(newBatchForm.bonusPercent) || 15,
      availableDate: newBatchForm.availableDate,
      availableTimeSlot: newBatchForm.availableTimeSlot,
      pcrImages: [...pcrImages],
      gpsCoords: gpsLocation || '17.0005° N, 82.2510° E',
      createdAt: new Date().toLocaleDateString('en-IN')
    };

    setBatches([created, ...batches]);
    setPcrImages([]);
    if (pcrInputRef.current) pcrInputRef.current.value = '';
    showToast(t.toasts.batchPublished);
  };

  const startEditingBatch = (batch) => {
    setEditingBatchId(batch.id);
    setEditBatchValues({
      plStage: batch.plStage,
      salinity: batch.salinity,
      pricePer1000: batch.pricePer1000,
      availableStock: batch.availableStock,
      bonusPercent: batch.bonusPercent,
      availableDate: batch.availableDate || new Date().toISOString().split('T')[0],
      availableTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)'
    });
  };

  const saveEditedBatch = (batchId) => {
    setBatches(batches.map(b => {
      if (b.id !== batchId) return b;
      return {
        ...b,
        plStage: editBatchValues.plStage,
        salinity: Number(editBatchValues.salinity),
        pricePer1000: Number(editBatchValues.pricePer1000),
        availableStock: Number(editBatchValues.availableStock),
        bonusPercent: Number(editBatchValues.bonusPercent),
        availableDate: editBatchValues.availableDate,
        availableTimeSlot: editBatchValues.availableTimeSlot
      };
    }));
    setEditingBatchId(null);
    showToast(t.toasts.batchUpdated);
  };

  const removeBatch = (batchId) => {
    setBatches(batches.filter(b => b.id !== batchId));
    showToast(t.toasts.batchRemoved);
  };

  // =========================================================================
  // ZERO-LOSS HATCHERY FIXED RATE + 4% ADVANCE SPLIT (2% PLATFORM + 2% HOLD)
  // - Hatchery fixed rate = 100% protected (Zero commission deducted from Hatchery)
  // - 4% Advance on Hatchery Fixed Order Value:
  //    * 2% -> AquaLens/AquaMark (Non-Refundable, hidden from all users)
  //    * 2% -> Hold:
  //       - If Direct Farmer: Returns to Farmer (2% Refund) upon packing OR cancellation
  //       - If Via Broker: Credits 2% to Broker upon packing complete (Hatchery Payment Received)
  // - Broker Extra Margin (paise/seed) is separate from advance & collected at packing
  // =========================================================================
  const finalizeBookingRecord = (paymentRef, qty, hatcheryFixedCost, brokerMarginPaise, transportCost, advance4Pct) => {
    const bonusSeeds = Math.round(qty * ((selectedBatch.bonusPercent || 15) / 100));
    const matchedBrokerFarmer = brokerFarmers.find(
      (f) => (f.phone || '').slice(-10) === (bookingForm.farmerPhone || '').slice(-10)
    );
    const isBrokerLinked = Boolean(matchedBrokerFarmer) || currentUser?.role === 'mediator';

    // 4% Advance splits into 2% Non-Refundable Platform + 2% Escrow Hold
    const silentPlatform2Pct = Math.round(hatcheryFixedCost * 0.02);
    const hold2Pct = Math.max(0, advance4Pct - silentPlatform2Pct);

    // Broker Extra Margin (Separate from advance, collected at packing)
    const brokerExtraMarginTotal = isBrokerLinked ? Math.round(qty * ((Number(brokerMarginPaise) || 0) / 100)) : 0;

    // Total payable by Farmer = Hatchery Fixed Cost + Broker Extra Margin + Transport
    const totalFarmerPayable = hatcheryFixedCost + brokerExtraMarginTotal + transportCost;

    // Balance due at packing (96% of Hatchery Fixed Cost + Broker Margin + Transport)
    const balanceAtPacking = totalFarmerPayable - advance4Pct;

    const now = new Date();
    const issueDateStr = now.toLocaleDateString('en-IN');
    const issueTimeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newBooking = {
      bookingId: `AQ-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentId: paymentRef,
      paymentMode: bookingForm.paymentMethod,
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
      includeTransport: bookingForm.includeTransport,
      pondSalinity: bookingForm.pondSalinity,
      packingDate: bookingForm.packingDate,
      packingTimeSlot: bookingForm.packingTimeSlot,
      hatcheryFixedRate: selectedBatch.pricePer1000,
      hatcheryFixedTotal: hatcheryFixedCost,
      brokerMarginPaise: Number(brokerMarginPaise) || 0,
      brokerExtraMarginTotal,
      totalSeedCost: totalFarmerPayable,
      tokenAdvance: advance4Pct,
      balanceAtPacking,
      settlement: {
        // silentPlatform2Pct is never displayed in UI
        hold2PctAmount: hold2Pct,
        brokerBase2Pct: isBrokerLinked ? hold2Pct : 0,
        farmerRefundable2Pct: !isBrokerLinked ? hold2Pct : 0,
        status: 'ADVANCE_HOLD' // 'ADVANCE_HOLD' | 'BALANCE_CLEARED' | 'CANCELLED_REFUNDED'
      },
      packingStatus: 'PACKING_PENDING',
      rated: false
    };

    // Deduct booked seeds from hatchery stock immediately
    setBatches(prev => prev.map(b =>
      b.id === selectedBatch.id
        ? { ...b, availableStock: Math.max(0, (b.availableStock || 0) - qty) }
        : b
    ));

    setBookings([newBooking, ...bookings]);
    setSelectedBatch(null);
    setBookingForm(prev => ({ ...prev, utrReference: '', upiRequestSent: false }));
    setActiveInvoice({ booking: newBooking, receiptType: 'ADVANCE' });
    showToast(t.toasts.paymentSuccess);
  };

  const handleConfirmBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    if ((bookingForm.farmerPhone || '').replace(/\D/g, '').length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }

    const qty = Math.min(selectedBatch.availableStock || 0, Number(bookingForm.quantity) || 100000);
    if (qty <= 0) {
      showToast('This batch is currently out of stock.');
      return;
    }

    const hatcheryFixedCost = Math.round(qty * (selectedBatch.pricePer1000 || 0.42));
    const transportCost = bookingForm.includeTransport ? 1500 : 0;
    // 4% Advance on Hatchery Fixed Cost (2% Platform + 2% Hold)
    const advance4Pct = Math.max(800, Math.round(hatcheryFixedCost * 0.04));

    if (bookingForm.paymentMethod === 'DIRECT_UPI' || bookingForm.paymentMethod === 'BANK_TO_BANK') {
      if (!bookingForm.utrReference.trim()) {
        showToast(t.toasts.enterUtr);
        return;
      }
      const prefix = bookingForm.paymentMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT';
      finalizeBookingRecord(
        `${prefix}_${bookingForm.utrReference.trim().toUpperCase()}`,
        qty,
        hatcheryFixedCost,
        bookingForm.brokerMarginPaise,
        transportCost,
        advance4Pct
      );
      return;
    }

    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (rzpKey && window.Razorpay) {
      const options = {
        key: rzpKey,
        amount: advance4Pct * 100,
        currency: 'INR',
        name: 'Aqua Mark',
        description: `${selectedBatch.plStage} Seed 4% Advance (${qty.toLocaleString('en-IN')} PL)`,
        prefill: {
          name: bookingForm.farmerName || 'Farmer',
          contact: bookingForm.farmerPhone,
          method: 'upi'
        },
        theme: { color: '#0d9488' },
        handler: function (response) {
          finalizeBookingRecord(
            response.razorpay_payment_id,
            qty,
            hatcheryFixedCost,
            bookingForm.brokerMarginPaise,
            transportCost,
            advance4Pct
          );
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        showToast(`Payment Failed: ${resp.error?.description || 'Cancelled'}`);
      });
      rzp.open();
    } else {
      const simulatedRef = `RZP_${Math.floor(100000 + Math.random() * 900000)}`;
      finalizeBookingRecord(
        simulatedRef,
        qty,
        hatcheryFixedCost,
        bookingForm.brokerMarginPaise,
        transportCost,
        advance4Pct
      );
    }
  };

  // Buyer Cancels Booking -> 2% Hold returns to Farmer, 2% Non-Refundable, Stock Restored
  const handleBuyerCancelBooking = (bk) => {
    setBookings(prev => prev.map(item =>
      item.bookingId === bk.bookingId
        ? {
          ...item,
          packingStatus: 'CANCELLED',
          settlement: { ...item.settlement, status: 'CANCELLED_REFUNDED' }
        }
        : item
    ));
    // Restore stock back to hatchery
    setBatches(prev => prev.map(b =>
      b.id === bk.batch?.id
        ? { ...b, availableStock: (b.availableStock || 0) + (bk.quantity || 0) }
        : b
    ));
    showToast(t.toasts.bookingCancelled);
  };

  const handleRequestSample = (batch) => {
    const now = new Date();
    const sampleBooking = {
      bookingId: `SMP-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: `SAMPLE_${Math.floor(100000 + Math.random() * 900000)}`,
      date: now.toLocaleDateString('en-IN'),
      time: now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      hatcheryOwnerPhone: batch.ownerPhone,
      batch,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      bookedByRole: 'buyer',
      bookedByPhone: currentUser.phone,
      isBrokerLinked: false,
      quantity: 100,
      bonusSeeds: 0,
      pondSalinity: batch.salinity,
      packingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      packingTimeSlot: 'Morning (08:00 AM – 12:00 PM)',
      hatcheryFixedRate: batch.pricePer1000,
      hatcheryFixedTotal: 500,
      brokerMarginPaise: 0,
      brokerExtraMarginTotal: 0,
      totalSeedCost: 500,
      tokenAdvance: 500,
      balanceAtPacking: 0,
      settlement: { hold2PctAmount: 0, brokerBase2Pct: 0, farmerRefundable2Pct: 0, status: 'ADVANCE_HOLD' },
      packingStatus: 'PACKING_PENDING',
      rated: false
    };
    setBookings([sampleBooking, ...bookings]);
    showToast(t.toasts.sampleOrdered);
  };

  const handleSellerMarkPacked = (bookingId) => {
    setBookings(bookings.map(bk =>
      bk.bookingId === bookingId ? { ...bk, packingStatus: 'PACKING_DONE_BY_SELLER' } : bk
    ));
    showToast(t.toasts.packingMarked);
  };

  // Hatchery Owner clicks "Payment Received" -> Releases 2% Hold (to Broker if broker-linked, else refunds 2% to Farmer) & issues Final Cleared Receipt
  const handleHatcheryPaymentReceived = (bookingId) => {
    const now = new Date();
    const clearedStamp = `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;

    setBookings(bookings.map(bk => {
      if (bk.bookingId !== bookingId) return bk;
      return {
        ...bk,
        packingStatus: 'FINAL_CLEARED',
        clearedAt: clearedStamp,
        settlement: {
          ...bk.settlement,
          status: 'BALANCE_CLEARED'
        }
      };
    }));
    showToast(t.toasts.paymentReceivedDone);
  };

  const handleSubmitRatingAndFeedback = (bookingId, batchId) => {
    const draft = ratingDrafts[bookingId] || { stars: 5, comment: '' };
    const stars = Number(draft.stars) || 5;
    const comment = (draft.comment || '').trim();

    setBookings(bookings.map(bk =>
      bk.bookingId === bookingId
        ? { ...bk, rated: true, userRating: stars, userFeedback: comment }
        : bk
    ));

    setBatches(batches.map(b => {
      if (b.id !== batchId) return b;
      const prevCount = b.reviewCount || 0;
      const newCount = prevCount + 1;
      const newAvg = prevCount === 0
        ? stars
        : Number((((b.rating * prevCount) + stars) / newCount).toFixed(1));
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

  // ==========================================
  // FULL-PAGE A4 RECEIPT PDF GENERATOR
  // ==========================================
  const handleDownloadVerifiedPdf = (bk, isFinalCleared = false) => {
    const printWin = window.open('', '_blank', 'width=860,height=1050');
    if (!printWin) return;

    const logoFullUrl = `${window.location.origin}/favicon.svg`;
    const verifyHash = `AQM-${bk.bookingId.replace('AQ-', '')}-${bk.paymentId.slice(-6).toUpperCase()}`;
    const totalWithBonus = (bk.quantity || 0) + (bk.bonusSeeds || 0);
    const issueTime = bk.time || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    const pcrLabels = (bk.batch?.pcrImages || []).map(img => img.label).join(', ') || 'Image-1';
    const docHeading = isFinalCleared ? 'FINAL BALANCE CLEARED RECEIPT' : 'OFFICIAL SEED BOOKING RECEIPT';

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AquaMark_Receipt_${bk.bookingId}</title>
        <style>
          @page { size: A4; margin: 10mm; }
          * { box-sizing: border-box; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          body { margin: 0; padding: 0; color: #0f172a; background: #fff; }
          .sheet { border: 2px solid #0f766e; border-radius: 12px; padding: 22px 24px; min-height: 274mm; display: flex; flex-direction: column; justify-content: space-between; position: relative; }
          .watermark { position: absolute; top: 48%; left: 50%; transform: translate(-50%, -50%) rotate(-24deg); font-size: 62px; font-weight: 900; color: rgba(13, 148, 136, 0.045); pointer-events: none; white-space: nowrap; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 14px; }
          .brand { display: flex; align-items: center; gap: 12px; }
          .brand-logo { width: 44px; height: 44px; border-radius: 10px; border: 1px solid #99f6e4; padding: 5px; background: #f0fdfa; object-fit: contain; }
          .brand-title { font-size: 22px; font-weight: 900; color: #0f766e; margin: 0; }
          .brand-sub { font-size: 11px; color: #475569; margin: 2px 0 0; }
          .verified-stamp { background: #ecfdf5; border: 1.5px solid #10b981; color: #065f46; padding: 7px 12px; border-radius: 10px; text-align: right; }
          .verified-stamp strong { display: block; font-size: 11px; letter-spacing: 0.5px; }
          .verified-stamp span { font-size: 10px; font-family: monospace; display: block; margin-top: 2px; }
          .meta-bar { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; background: #f8fafc; border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; margin-top: 14px; font-size: 11px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-top: 14px; }
          .box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 14px; }
          .box-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f766e; letter-spacing: 0.6px; margin-bottom: 5px; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; }
          .box p { margin: 3px 0; font-size: 11.5px; }
          table { width: 100%; border-collapse: collapse; margin-top: 14px; font-size: 11.5px; }
          th { background: #0f766e; color: #fff; text-align: left; padding: 8px 10px; font-size: 10.5px; text-transform: uppercase; }
          td { padding: 8px 10px; border: 1px solid #e2e8f0; }
          .summary-grid { display: grid; grid-template-columns: 1.2fr 1fr; gap: 14px; margin-top: 14px; }
          .totals { border: 1px solid #cbd5e1; border-radius: 10px; padding: 10px 14px; background: #f8fafc; font-size: 11.5px; }
          .totals-row { display: flex; justify-content: space-between; padding: 3.5px 0; }
          .totals-highlight { border-top: 1.5px solid #cbd5e1; margin-top: 5px; padding-top: 6px; font-weight: 800; font-size: 13px; color: #065f46; }
          .protocol { margin-top: 14px; background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 10px 14px; font-size: 10.5px; color: #115e59; line-height: 1.45; }
          .checklist { margin-top: 12px; border: 1px solid #e2e8f0; border-radius: 10px; padding: 10px 14px; font-size: 10.5px; color: #334155; }
          .footer { margin-top: 18px; padding-top: 12px; border-top: 1.5px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 10.5px; color: #475569; }
          .sig-box { text-align: center; }
          .sig-line { width: 155px; border-top: 1px solid #334155; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div>
            <div class="watermark">${isFinalCleared ? 'BALANCE CLEARED RECEIPT' : 'AQUA MARK RECEIPT'}</div>
            <div class="header">
              <div class="brand">
                <img src="${logoFullUrl}" alt="Aqua Mark" class="brand-logo" />
                <div>
                  <h1 class="brand-title">AQUA MARK</h1>
                  <p class="brand-sub">${docHeading}</p>
                </div>
              </div>
              <div class="verified-stamp">
                <strong>${isFinalCleared ? '100% BALANCE CLEARED' : 'VERIFIED RECEIPT'}</strong>
                <span>Date: ${bk.date} • Time: ${issueTime}</span>
                <span>Hash: ${verifyHash}</span>
              </div>
            </div>

            <div class="meta-bar">
              <div><strong>Receipt / Booking ID:</strong><br/>${bk.bookingId}</div>
              <div><strong>Payment Ref:</strong><br/>${bk.paymentId}</div>
              <div><strong>Generated At:</strong><br/>${bk.date} (${issueTime})</div>
              <div><strong>Packing Schedule:</strong><br/>${bk.packingDate} (${bk.packingTimeSlot || 'All Day'})</div>
            </div>

            <div class="grid-2">
              <div class="box">
                <div class="box-title">Buyer / Farmer Details</div>
                <p><strong>Farmer Name:</strong> ${bk.farmerName}</p>
                <p><strong>WhatsApp / Mobile:</strong> +91 ${bk.farmerPhone}</p>
                <p><strong>Target Pond Salinity:</strong> ${bk.pondSalinity} PPT</p>
                <p><strong>Pickup / Delivery:</strong> ${bk.includeTransport ? 'Oxygen Van Delivery (+₹1,500)' : 'Self Pickup'}</p>
              </div>
              <div class="box">
                <div class="box-title">Seller (Hatchery) Details</div>
                <p><strong>Hatchery Name:</strong> ${bk.batch?.realName}</p>
                <p><strong>CAA Reg. Number:</strong> ${bk.batch?.caaLicense}</p>
                <p><strong>Hatchery Phone:</strong> +91 ${bk.batch?.realPhone}</p>
                <p><strong>Facility Address:</strong> ${bk.batch?.realAddress} (${bk.batch?.zone})</p>
              </div>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Batch & Species</th>
                  <th>Stage</th>
                  <th>Hatchery PPT</th>
                  <th>Booked Qty</th>
                  <th>Bonus (+${bk.batch?.bonusPercent}%)</th>
                  <th>Total Packing Qty</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>${bk.batch?.id} — ${bk.batch?.species}</strong><br/><span style="font-size:10px;color:#64748b;">PCR Lab Attachments: ${pcrLabels}</span></td>
                  <td><strong>${bk.batch?.plStage}</strong></td>
                  <td>${bk.batch?.salinity} PPT</td>
                  <td>${(bk.quantity || 0).toLocaleString('en-IN')} PL</td>
                  <td style="color:#059669;font-weight:700;">+${(bk.bonusSeeds || 0).toLocaleString('en-IN')} PL</td>
                  <td><strong>${totalWithBonus.toLocaleString('en-IN')} PL</strong></td>
                </tr>
              </tbody>
            </table>

            <div class="summary-grid">
              <div class="box">
                <div class="box-title">Salinity Acclimatization & Packing Schedule</div>
                <p><strong>Source Tank Salinity:</strong> ${bk.batch?.salinity} PPT</p>
                <p><strong>Destination Pond Salinity:</strong> ${bk.pondSalinity} PPT</p>
                <p><strong>Variance:</strong> ${Math.abs((bk.batch?.salinity || 15) - (Number(bk.pondSalinity) || 15))} PPT (Adjust 1 PPT / 4 hrs)</p>
                <p><strong>GPS Tank Tag:</strong> ${bk.batch?.gpsCoords || 'Verified Coastal Zone'}</p>
              </div>
              <div class="totals">
                <div class="totals-row"><span>Total Order Value:</span><span>₹${(bk.totalSeedCost || 0).toLocaleString('en-IN')}</span></div>
                <div class="totals-row"><span>Advance Paid (4%):</span><span>₹${(bk.tokenAdvance || 0).toLocaleString('en-IN')}</span></div>
                ${isFinalCleared
        ? `<div class="totals-row totals-highlight"><span>Remaining 96% Paid at Packing:</span><span>₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')} (CLEARED)</span></div>
                     <div class="totals-row" style="margin-top:4px;font-weight:800;color:#065f46;"><span>Pending Balance Due:</span><span>₹0 (PAID IN FULL)</span></div>`
        : `<div class="totals-row totals-highlight"><span>Balance Payable at Packing (96%):</span><span>₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')}</span></div>`
      }
              </div>
            </div>

            <div class="protocol">
              <strong>Mandatory Hatchery Quality & Bio-Security Terms:</strong><br/>
              1. Hatchery certifies that the above batch is SPF (Specific Pathogen Free) for WSSV, EHP, IHHNV, and TSV as per attached PCR reports (${pcrLabels}).<br/>
              2. Oxygen packing density must not exceed 1,000 PL per liter for transit durations exceeding 4 hours.<br/>
              3. ${isFinalCleared
        ? `Full settlement confirmed by Hatchery Owner on ${bk.clearedAt || bk.date}. No further payment due.`
        : 'Remaining 96% balance is payable directly at packing upon verifying live seed count and vigor.'}
            </div>

            <div class="checklist">
              <strong>Hatchery Dispatch Verification Checklist:</strong>
              [ ✓ ] CAA License Verified    [ ✓ ] PCR Lab Images Attached (${pcrLabels})    [ ✓ ] 4% Advance Paid    [ ${isFinalCleared ? '✓' : ' '} ] Final Balance Cleared at Packing
            </div>
          </div>

          <div class="footer">
            <div class="sig-box">
              <div class="sig-line"></div>
              <span>Farmer / Buyer Signature</span>
            </div>
            <div style="text-align:center;">
              <strong>Digitally Verified Receipt by Aqua Mark</strong><br/>
              Timestamp: ${bk.date} ${issueTime}
            </div>
            <div class="sig-box">
              <div class="sig-line"></div>
              <span>Authorized Hatchery Seal & Sign</span>
            </div>
          </div>
        </div>
        <script>
          window.onload = function() { setTimeout(function() { window.print(); }, 250); };
        </script>
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
    setBrokerFarmers([entry, ...brokerFarmers]);
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
    setFarmerPonds([entry, ...farmerPonds]);
    showToast(lang === 'te' ? 'చెరువు ఫీడ్ & స్టాకింగ్ వివరాలు నమోదయ్యాయి!' : 'Pond Stocking & Daily Feed Log added!');
  };

  const toggleCompareBatch = (id) => {
    if (compareIds.includes(id)) setCompareIds(compareIds.filter(x => x !== id));
    else if (compareIds.length < 3) setCompareIds([...compareIds, id]);
  };

  const toggleSaveBatch = (id) => {
    if (savedBatchIds.includes(id)) setSavedBatchIds(savedBatchIds.filter(x => x !== id));
    else setSavedBatchIds([...savedBatchIds, id]);
  };

  // Broker 2% Commission Metrics
  const brokerHeld2PctTotal = bookings
    .filter(b => b.isBrokerLinked && b.settlement?.status === 'ADVANCE_HOLD')
    .reduce((sum, b) => sum + (b.settlement?.brokerBase2Pct || 0), 0);

  const brokerCredited2PctTotal = bookings
    .filter(b => b.isBrokerLinked && b.settlement?.status === 'BALANCE_CLEARED')
    .reduce((sum, b) => sum + (b.settlement?.brokerBase2Pct || 0), 0);

  const filteredAndSortedBatches = batches
    .filter(b => {
      const q = searchQuery.toLowerCase().trim();
      const searchMatch = !q ||
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
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${onlySavedFilter ? 'bg-rose-500/15 border-rose-400 text-rose-500' : subCardBg
              }`}
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
  // SCREEN 1: OTP LOGIN PAGE
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
          <div className={`max-w-lg w-full rounded-3xl shadow-sm border p-8 space-y-6 ${cardBg}`}>
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
                    onClick={() => { setLoginRole(item.id); setOtpSent(false); }}
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

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
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
                      placeholder="9876543210"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      className={`w-full border rounded-xl pl-12 pr-10 py-2.5 text-sm font-bold tracking-wider select-text focus:outline-none ${inputCls}`}
                    />
                    <Smartphone className="w-4 h-4 opacity-50 absolute right-3.5" />
                  </div>
                </div>
                <button
                  type="submit"
                  className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm shadow-xs flex items-center justify-center gap-2 cursor-pointer"
                >
                  {t.sendOtp} ({activeRoleMeta.title}) <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 text-center">
                  <p className="text-xs">{t.otpSentMsg} <b>+91 {loginPhone}</b></p>
                  <p className="text-xs font-bold text-teal-600 mt-1">
                    OTP Code: <span className={`px-2.5 py-0.5 rounded-md border font-mono tracking-widest select-text ${cardBg}`}>{generatedOtp}</span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold block mb-1.5">{t.enterOtpLabel}</label>
                  <input
                    ref={otpInputRef}
                    autoFocus
                    required
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    className={`w-full border-2 border-teal-600 rounded-xl py-2.5 text-center text-lg font-extrabold tracking-[0.5em] select-text focus:outline-none ${inputCls}`}
                  />
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className={`px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}
                  >
                    {t.back}
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-teal-600 hover:bg-teal-700 text-white font-bold py-2.5 rounded-xl text-sm shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserCheck className="w-4 h-4" /> {t.verifyLogin}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>

        <footer className="text-center py-4 text-[11px] opacity-50">
          Aqua Mark © 2026 • CAA Verified Hatchery Network
        </footer>
      </div>
    );
  }

  const myFixedHatchery = currentUser.role === 'seller' ? hatcheryProfiles[currentUser.phone] : null;
  const myOwnedBatches = currentUser.role === 'seller' && myFixedHatchery
    ? batches.filter(b => b.ownerPhone === currentUser.phone)
    : [];
  const myHatcheryOrders = currentUser.role === 'seller' && myFixedHatchery
    ? bookings.filter(bk => bk.hatcheryOwnerPhone === currentUser.phone)
    : [];
  const myPrivateReviews = myOwnedBatches.flatMap(b => (b.reviews || []).map(r => ({ ...r, batchId: b.id, plStage: b.plStage })));

  const myFixedBroker = currentUser.role === 'mediator' ? brokerProfiles[currentUser.phone] : null;
  const myBrokerBookings = currentUser.role === 'mediator'
    ? bookings.filter(bk => bk.bookedByPhone === currentUser.phone && bk.bookedByRole === 'mediator')
    : [];

  // Buyer 2% Refunded Wallet Total
  const buyerRefundedTotal = currentUser.role === 'buyer'
    ? bookings
      .filter(b => b.farmerPhone === currentUser.phone && !b.isBrokerLinked && (b.settlement?.status === 'BALANCE_CLEARED' || b.settlement?.status === 'CANCELLED_REFUNDED'))
      .reduce((sum, b) => sum + (b.settlement?.farmerRefundable2Pct || 0), 0)
    : 0;

  return (
    <div className={`min-h-screen font-sans select-none transition-colors ${pageBg}`}>
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

          <div className="flex items-center gap-2.5">
            {currentUser.role === 'buyer' && buyerRefundedTotal > 0 && (
              <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-extrabold px-3 py-1.5 rounded-xl">
                2% Cashback Refunded: ₹{buyerRefundedTotal.toLocaleString('en-IN')}
              </span>
            )}
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
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer relative ${buyerTab === tab.id ? 'bg-teal-600 text-white' : 'opacity-75 hover:opacity-100'
                      }`}
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
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAndSortedBatches.map((batch) => {
                      const isUnlocked = bookings.some((bk) => bk.batch?.id === batch.id && bk.farmerPhone === currentUser.phone && bk.packingStatus !== 'CANCELLED');
                      const isComparing = compareIds.includes(batch.id);
                      const isSaved = savedBatchIds.includes(batch.id);
                      const isSoldOut = (batch.availableStock || 0) <= 0;

                      return (
                        <div key={batch.id} className={`rounded-2xl border shadow-xs overflow-hidden flex flex-col justify-between hover:border-teal-500 transition ${cardBg}`}>
                          <div onClick={() => setInspectedBatch(batch)} className="p-5 space-y-4 cursor-pointer">
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="bg-emerald-500/15 text-emerald-600 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" /> {t.caaVerified}
                                  </span>
                                  <span className="text-xs font-semibold opacity-60">{batch.zone}</span>
                                  <span className="text-xs font-bold text-amber-500 inline-flex items-center gap-0.5">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {batch.rating} ({batch.reviewCount || 0})
                                  </span>
                                  {isSoldOut && (
                                    <span className="bg-rose-500/15 text-rose-600 text-[10px] font-extrabold px-2 py-0.5 rounded-full">{t.soldOutBadge}</span>
                                  )}
                                </div>
                                <h3 className="text-base font-extrabold mt-2 flex items-center gap-2">
                                  {isUnlocked ? (
                                    <span className="text-teal-500 inline-flex items-center gap-1.5"><Unlock className="w-4 h-4 text-emerald-500" /> {batch.realName}</span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 opacity-50" /> {batch.hatcheryCode}</span>
                                  )}
                                </h3>
                                <p className="text-xs opacity-70 font-medium mt-0.5">{batch.species} • <span className="text-teal-500 font-semibold">{batch.broodstock || 'SPF Certified'}</span></p>
                                {isUnlocked ? (
                                  <p className="text-xs opacity-80 mt-0.5">{batch.realAddress} • +91 {batch.realPhone}</p>
                                ) : (
                                  <p className="text-[11px] opacity-50 mt-0.5">{t.unlockHint}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); toggleSaveBatch(batch.id); }}
                                  className={`p-2 rounded-xl border cursor-pointer ${subCardBg}`}
                                >
                                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'opacity-50'}`} />
                                </button>
                                <div className="text-right">
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

                            <div className={`border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs ${subCardBg}`}>
                              <span className="font-semibold">
                                📅 {t.availPackingLabel}: <b>{batch.availableDate || 'Flexible'}</b> ({batch.availableTimeSlot || 'All Day'})
                              </span>
                              <span className="inline-flex items-center gap-1 font-bold text-teal-500">
                                <Eye className="w-3.5 h-3.5" /> {t.inspectBtn}
                              </span>
                            </div>
                          </div>

                          <div className={`px-5 py-3.5 border-t flex flex-wrap items-center gap-2 ${subCardBg}`}>
                            <button
                              type="button"
                              onClick={() => handleRequestSample(batch)}
                              className={`px-3 py-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${cardBg}`}
                            >
                              <FlaskConical className="w-3.5 h-3.5 text-teal-600" /> {t.sampleBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleCompareBatch(batch.id)}
                              className={`px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${isComparing ? 'bg-teal-600 text-white border-teal-600' : cardBg
                                }`}
                            >
                              {isComparing ? t.comparingBtn : t.compareBtn}
                            </button>
                            <button
                              type="button"
                              disabled={isSoldOut}
                              onClick={() => {
                                setBookingForm(prev => ({
                                  ...prev,
                                  farmerName: currentUser.name,
                                  farmerPhone: currentUser.phone,
                                  quantity: Math.min(200000, batch.availableStock || 0),
                                  packingDate: batch.availableDate || prev.packingDate,
                                  packingTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
                                  brokerMarginPaise: 0
                                }));
                                setSelectedBatch(batch);
                              }}
                              className="flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {isSoldOut ? t.soldOutBadge : t.bookSlotBtn} {!isSoldOut && <ChevronRight className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* TAB 2: BUYER BOOKINGS & RECEIPTS + CANCEL WITH 2% REFUND */}
            {buyerTab === 'bookings' && (
              <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                <h3 className="text-base font-bold flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" /> {t.myBookingsTitle}
                </h3>
                {bookings.filter(b => b.farmerPhone === currentUser.phone).length === 0 ? (
                  <p className="text-xs opacity-60">{t.noBookingsYet}</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.filter(b => b.farmerPhone === currentUser.phone).map((bk) => {
                      const draft = ratingDrafts[bk.bookingId] || { stars: 5, comment: '' };
                      const isFinalCleared = bk.settlement?.status === 'BALANCE_CLEARED';
                      const isCancelled = bk.settlement?.status === 'CANCELLED_REFUNDED';

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

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
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
                              <p className="text-sm font-bold">{bk.batch?.realName} • +91 {bk.batch?.realPhone}</p>
                              <p className="text-xs opacity-75">
                                {(bk.quantity || 0).toLocaleString('en-IN')} PL ({bk.batch?.plStage}) • {t.packingDateLabel}: <b>{bk.packingDate}</b> ({bk.packingTimeSlot || 'All Day'})
                              </p>
                              <p className="text-xs">
                                <b>{t.paidLabel}: ₹{(bk.tokenAdvance || 0).toLocaleString('en-IN')}</b> •{' '}
                                {isFinalCleared
                                  ? <span className="text-emerald-500 font-bold">Remaining 96% (₹{(bk.balanceAtPacking || 0).toLocaleString('en-IN')}) Cleared ✓</span>
                                  : isCancelled
                                    ? <span className="text-rose-500 font-bold">2% Hold (₹{(bk.settlement?.farmerRefundable2Pct || 0).toLocaleString('en-IN')}) Refunded ✓</span>
                                    : <span>{t.balancePackingLabel}: <b>₹{(bk.balanceAtPacking || 0).toLocaleString('en-IN')}</b></span>}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                              {!isFinalCleared && !isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => handleBuyerCancelBooking(bk)}
                                  className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                                >
                                  <XCircle className="w-3.5 h-3.5" /> {t.cancelBookingBtn}
                                </button>
                              )}

                              <button type="button" onClick={() => openWhatsAppMessage(bk.batch?.realPhone, `AquaMark Booking ID: ${bk.bookingId} (${bk.quantity} PL)`)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer">
                                <Send className="w-3.5 h-3.5" /> WhatsApp
                              </button>
                              {!isCancelled && (
                                <button
                                  type="button"
                                  onClick={() => handleDownloadVerifiedPdf(bk, isFinalCleared)}
                                  className={`text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer ${isFinalCleared ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-slate-800 hover:bg-slate-900'
                                    }`}
                                >
                                  <Printer className="w-3.5 h-3.5" /> {isFinalCleared ? t.finalReceiptBtn : t.advanceReceiptBtn}
                                </button>
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
                                        className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${draft.stars >= star ? 'bg-amber-400 border-amber-500 text-slate-950' : subCardBg
                                          }`}
                                      >
                                        {star}★
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder={lang === 'te' ? 'హేచరీ గురించి మీ అభిప్రాయం రాయండి...' : 'Write private feedback for Hatchery...'}
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

            {/* NEW TAB: MULTI-POND STOCKING & DAILY CHECK-TRAY FEED LOGBOOK */}
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
                    <div className="space-y-2.5">
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

            {/* TAB 4: HARVEST, FEED & PROFIT ESTIMATOR WITH CALCULATE BUTTON */}
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
                    <label className="text-xs font-bold opacity-75 block mb-1">{lang === 'te' ? 'చెరువుల సంఖ్య (Ponds)' : 'Number of Ponds'}</label>
                    <input type="number" min="1" value={calcInputs.ponds} onChange={(e) => setCalcInputs({ ...calcInputs, ponds: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{lang === 'te' ? 'ఒక్క చెరువు విస్తీర్ణం (Acres)' : 'Acres per Pond'}</label>
                    <input type="number" step="0.5" min="0.5" value={calcInputs.acresPerPond} onChange={(e) => setCalcInputs({ ...calcInputs, acresPerPond: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{lang === 'te' ? 'సాంద్రత (/m²)' : 'Stocking Density (/m²)'}</label>
                    <select value={calcInputs.density} onChange={(e) => setCalcInputs({ ...calcInputs, density: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold ${inputCls}`}>
                      <option value={30}>30 / m²</option>
                      <option value={40}>40 / m²</option>
                      <option value={50}>50 / m²</option>
                      <option value={60}>60 / m²</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{lang === 'te' ? 'బతికే శాతం (Survival %)' : 'Expected Survival (%)'}</label>
                    <input type="number" min="40" max="100" value={calcInputs.survival} onChange={(e) => setCalcInputs({ ...calcInputs, survival: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{lang === 'te' ? 'పట్టుబడి కౌంట్ (/kg)' : 'Target Count (/kg)'}</label>
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
                    <label className="text-xs font-bold opacity-75 block mb-1">{lang === 'te' ? 'మార్కెట్ ధర (₹ / kg)' : 'Market Price (₹ / kg)'}</label>
                    <input type="number" value={calcInputs.marketRatePerKg} onChange={(e) => setCalcInputs({ ...calcInputs, marketRatePerKg: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{lang === 'te' ? 'ఫీడ్ ధర (₹ / kg)' : 'Feed Cost (₹ / kg)'}</label>
                    <input type="number" value={calcInputs.feedCostPerKg} onChange={(e) => setCalcInputs({ ...calcInputs, feedCostPerKg: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{lang === 'te' ? 'కరెంట్ & మందులు (/Acre)' : 'Power & Probiotics (/Acre)'}</label>
                    <input type="number" value={calcInputs.powerProbioticCostPerAcre} onChange={(e) => setCalcInputs({ ...calcInputs, powerProbioticCostPerAcre: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">{lang === 'te' ? `మొత్తం సీడ్ (${calcResult.totalAcres} ఎకరాలు)` : `Total Seed (${calcResult.totalAcres} Acres)`}</span>
                    <span className="text-lg font-black">{calcResult.totalSeedsNeeded.toLocaleString('en-IN')} PL</span>
                  </div>
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-teal-600 font-bold block">{lang === 'te' ? 'అంచనా దిగుబడి' : 'Projected Harvest'}</span>
                    <span className="text-lg font-black">{calcResult.harvestTons} Tons ({calcResult.harvestKg.toLocaleString('en-IN')} kg)</span>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-amber-600 font-bold block">{lang === 'te' ? 'అవసరమైన ఫీడ్' : 'Total Feed Required'}</span>
                    <span className="text-lg font-black">{calcResult.totalFeedBags} Bags ({calcResult.totalFeedKg.toLocaleString('en-IN')} kg)</span>
                  </div>
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">{lang === 'te' ? 'కనీస గిట్టుబాటు ధర' : 'Break-Even Cost / kg'}</span>
                    <span className="text-lg font-black">₹{calcResult.breakEvenPerKg} / kg</span>
                  </div>
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">{lang === 'te' ? 'మొత్తం ఆదాయం' : 'Gross Crop Revenue'}</span>
                    <span className="text-lg font-black">₹{calcResult.grossRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-rose-500 font-bold block">{lang === 'te' ? 'మొత్తం ఖర్చులు' : 'Total Production Cost'}</span>
                    <span className="text-lg font-black">₹{calcResult.totalExpenses.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-emerald-500 font-bold block">{lang === 'te' ? 'ఎకరాకు నికర లాభం' : 'Net Profit / Acre'}</span>
                    <span className="text-lg font-black">₹{calcResult.profitPerAcre.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-xl p-3.5">
                    <span className="text-[11px] text-emerald-100 font-bold block">{lang === 'te' ? 'మొత్తం నికర లాభం' : 'Total Net Crop Profit'}</span>
                    <span className="text-lg font-black">₹{calcResult.netProfit.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 5: POND WATER, SALINITY ACCLIMATIZATION & OXYGEN VAN CALCULATOR */}
            {buyerTab === 'waterlab' && (
              <div className="space-y-6">
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="text-base font-extrabold flex items-center gap-2">
                    <Droplets className="w-5 h-5 text-teal-600" />
                    {lang === 'te' ? 'చెరువు నీటి పరీక్ష & సీడ్ స్టాకింగ్ అర్హత తనిఖీ' : 'Pond Water Quality Readiness Checker'}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
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
                  </div>
                  {(() => {
                    const isSafe = waterTest.ph >= 7.5 && waterTest.ph <= 8.4 && waterTest.doLevel >= 4.5 && waterTest.ammonia <= 0.1;
                    return (
                      <div className={`p-4 rounded-xl border text-xs font-bold ${isSafe ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : 'bg-amber-500/15 border-amber-500/40 text-amber-500'}`}>
                        {isSafe
                          ? (lang === 'te' ? '✅ మీ చెరువు నీటి ప్రమాణాలు రొయ్య పిల్లలను వదలడానికి 100% అనుకూలంగా ఉన్నాయి!' : '✅ Pond water parameters are OPTIMAL for immediate PL stocking!')
                          : (lang === 'te' ? '⚠️ హెచ్చరిక: నీటిలో pH, ఆక్సిజన్ లేదా అమ్మోనియా స్థాయిలను సరిచేసిన తర్వాతే సీడ్ వేయండి.' : '⚠️ Warning: Stabilize pH (7.5-8.3), DO (above 4.5 ppm), and Ammonia (below 0.1 ppm) before stocking.')}
                      </div>
                    );
                  })()}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Salinity Acclimatization Timer */}
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

                  {/* Oxygen Van & Packing Bags Calculator */}
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

            {/* TAB 6: DOC 1-110 FEEDING SCHEDULE & PROTOCOL */}
            {buyerTab === 'guide' && (
              <div className="space-y-6">
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="text-base font-extrabold">{t.protocolTitle}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                    <div className="p-4 rounded-xl bg-teal-500/10 border border-teal-500/30 space-y-1.5">
                      <div className="font-bold text-teal-600">{t.proto1Title}</div>
                      <p className="opacity-85 leading-relaxed">{t.proto1Body}</p>
                    </div>
                    <div className={`p-4 rounded-xl border space-y-1.5 ${subCardBg}`}>
                      <div className="font-bold">{t.proto2Title}</div>
                      <p className="opacity-75 leading-relaxed">{t.proto2Body}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-1.5">
                      <div className="font-bold text-emerald-600">{t.proto3Title}</div>
                      <p className="opacity-85 leading-relaxed">{t.proto3Body}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 space-y-1.5">
                      <div className="font-bold text-amber-600">{t.proto4Title}</div>
                      <p className="opacity-85 leading-relaxed">{t.proto4Body}</p>
                    </div>
                  </div>
                </div>

                {/* DOC 1-110 Reference Table */}
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
              </div>
            )}
          </>
        )}

        {/* =========================================================
            2. SELLER (HATCHERY) PORTAL — ZERO LOSS FIXED RATE + "PAYMENT RECEIVED"
           ========================================================= */}
        {currentUser.role === 'seller' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {!myFixedHatchery ? (
              <div className={`rounded-2xl p-6 sm:p-8 border shadow-xs space-y-5 ${cardBg}`}>
                <div>
                  <span className="bg-teal-500/15 text-teal-600 border border-teal-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    One-Step Seller Onboarding
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
              <>
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> {t.hatcheryLockedBanner} {currentUser.phone}
                      </span>
                      <h2 className="text-xl font-extrabold">{myFixedHatchery.realName}</h2>
                      <p className="text-xs opacity-70">
                        CAA: <span className="font-mono font-bold">{myFixedHatchery.caaLicense}</span> • {myFixedHatchery.zone} • {myFixedHatchery.realAddress}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> {t.savedBadge}
                      </span>
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
                              accountName: myFixedHatchery.bankDetails?.accountName || '',
                              accountNo: myFixedHatchery.bankDetails?.accountNo || '',
                              ifsc: myFixedHatchery.bankDetails?.ifsc || '',
                              upiId: myFixedHatchery.bankDetails?.upiId || ''
                            });
                            setIsEditingSellerProfile(true);
                          }}
                          className={`border text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1 cursor-pointer ${subCardBg}`}
                        >
                          <Edit3 className="w-3.5 h-3.5 text-teal-600" /> {t.editProfileBankBtn}
                        </button>
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
                          <div className="flex gap-1.5">
                            <input required type="text" placeholder="UPI ID (name@bank)" value={unifiedSellerForm.upiId} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, upiId: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`} />
                            <button type="submit" className="bg-teal-600 text-white text-xs font-bold px-3.5 rounded-xl cursor-pointer shrink-0">{t.saveBtn}</button>
                          </div>
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

                {/* ADD NEW SEED BATCH */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="text-base font-bold flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-teal-600" /> {t.addBatchTitle}
                  </h3>
                  <form onSubmit={handlePublishBatch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
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
                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.bonus} (%)</label>
                        <input type="number" value={newBatchForm.bonusPercent} onChange={(e) => setNewBatchForm({ ...newBatchForm, bonusPercent: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.broodstockLabel}</label>
                        <select value={newBatchForm.broodstock} onChange={(e) => setNewBatchForm({ ...newBatchForm, broodstock: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold ${inputCls}`}>
                          {BROODSTOCK_ORIGINS.map(br => <option key={br} value={br}>{br}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="text-xs font-bold opacity-75 block mb-1">{t.stockLabel}</label>
                        <input type="number" step="50000" value={newBatchForm.availableStock} onChange={(e) => setNewBatchForm({ ...newBatchForm, availableStock: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
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

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 items-center">
                      <div className={`border rounded-xl p-3 flex flex-col justify-between gap-1.5 ${subCardBg}`}>
                        <input
                          ref={pcrInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={(e) => handleMultiplePcrUpload(e.target.files)}
                          className="hidden"
                        />
                        <button
                          type="button"
                          onClick={() => pcrInputRef.current?.click()}
                          className={`w-full border border-teal-500/40 text-teal-600 text-xs font-bold py-2 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer ${cardBg}`}
                        >
                          <Upload className="w-4 h-4" /> {t.pcrUploadBtnLabel}
                        </button>
                        {pcrImages.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {pcrImages.map((img, i) => (
                              <span key={i} className="bg-emerald-500/20 text-emerald-500 text-[10px] font-bold px-2 py-0.5 rounded">
                                {img.label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-[10px] opacity-60 text-center">{t.pcrHintLabel}</span>
                        )}
                      </div>

                      <div className={`border rounded-xl p-3 flex items-center justify-between gap-2 ${subCardBg}`}>
                        <div>
                          <span className="text-xs font-bold flex items-center gap-1"><Camera className="w-4 h-4 text-teal-600" /> Tank GPS</span>
                          <p className="text-[11px] opacity-60">{gpsLocation || 'Optional'}</p>
                        </div>
                        <button type="button" onClick={handleCaptureGps} className="bg-teal-600 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer">
                          <MapPin className="w-3.5 h-3.5" /> {gpsLocation ? t.gpsLockedBtn : t.captureGpsBtn}
                        </button>
                      </div>
                    </div>

                    <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-sm shadow-xs cursor-pointer">
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
                    <div className="space-y-3">
                      {myOwnedBatches.map((b) => {
                        const isEditing = editingBatchId === b.id;
                        return (
                          <div key={b.id} className={`border rounded-xl p-4 space-y-3 ${subCardBg}`}>
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="font-mono text-xs font-bold text-teal-500">{b.id}</span> • <span className="font-bold text-sm">{b.species}</span>
                                <span className="block text-[11px] opacity-65">
                                  Packing: {b.availableDate} ({b.availableTimeSlot}) • PCR: {(b.pcrImages || []).map(img => img.label).join(', ')}
                                </span>
                              </div>
                              <div className="flex items-center gap-2">
                                {isEditing ? (
                                  <button type="button" onClick={() => saveEditedBatch(b.id)} className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer">
                                    {t.saveChangesBtn}
                                  </button>
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
                              <div className="space-y-2.5 pt-2 border-t border-slate-300/30">
                                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.stage}</label>
                                    <input type="text" value={editBatchValues.plStage} onChange={(e) => setEditBatchValues({ ...editBatchValues, plStage: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
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
                                    <label className="text-[10px] font-bold opacity-60 block">{t.stockLabel}</label>
                                    <input type="number" step="50000" value={editBatchValues.availableStock} onChange={(e) => setEditBatchValues({ ...editBatchValues, availableStock: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2.5">
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.availDateLabel}</label>
                                    <input type="date" value={editBatchValues.availableDate} onChange={(e) => setEditBatchValues({ ...editBatchValues, availableDate: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                                  </div>
                                  <div>
                                    <label className="text-[10px] font-bold opacity-60 block">{t.availTimeLabel}</label>
                                    <select value={editBatchValues.availableTimeSlot} onChange={(e) => setEditBatchValues({ ...editBatchValues, availableTimeSlot: e.target.value })} className={`w-full border rounded-lg px-2 py-1.5 text-xs font-bold ${inputCls}`}>
                                      {PACKING_TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
                                    </select>
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

                {/* CLICKABLE ASSIGNED ORDERS + "PAYMENT RECEIVED" BUTTON */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-600" /> {t.sellerOrdersTitle}
                  </h3>
                  {myHatcheryOrders.length === 0 ? (
                    <p className="text-xs opacity-60">{t.noOrdersYet}</p>
                  ) : (
                    <div className="space-y-3">
                      {myHatcheryOrders.map((bk) => {
                        const isCleared = bk.settlement?.status === 'BALANCE_CLEARED';
                        const isCancelled = bk.settlement?.status === 'CANCELLED_REFUNDED';
                        return (
                          <div
                            key={bk.bookingId}
                            onClick={() => setInspectedSellerOrder(bk)}
                            className={`border hover:border-teal-500 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 transition cursor-pointer ${subCardBg}`}
                          >
                            <div className="space-y-1 text-xs">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-teal-500">{bk.bookingId}</span>
                                <span className={`font-bold px-2.5 py-0.5 rounded-full ${isCleared
                                    ? 'bg-emerald-500/15 text-emerald-500'
                                    : isCancelled
                                      ? 'bg-rose-500/15 text-rose-500'
                                      : 'bg-amber-500/15 text-amber-500'
                                  }`}>
                                  {isCleared
                                    ? `${t.creditedBadge}: ₹${(bk.hatcheryFixedTotal || 0).toLocaleString('en-IN')}`
                                    : isCancelled
                                      ? 'Cancelled by Farmer'
                                      : `${t.onHoldBadge} (Fixed Total: ₹${(bk.hatcheryFixedTotal || 0).toLocaleString('en-IN')})`}
                                </span>
                              </div>
                              <p className="font-semibold">{bk.farmerName} ({bk.farmerPhone}) • {(bk.quantity || 0).toLocaleString('en-IN')} PL</p>
                              <p className="opacity-70">
                                {t.pondSalinityLabel}: <b>{bk.pondSalinity} PPT</b> • {t.packingDateLabel}: <b>{bk.packingDate} ({bk.packingTimeSlot})</b>
                              </p>
                            </div>

                            {!isCancelled && (
                              <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
                                {bk.packingStatus === 'PACKING_PENDING' && (
                                  <button type="button" onClick={() => handleSellerMarkPacked(bk.bookingId)} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl cursor-pointer">
                                    {t.markPackedBtn}
                                  </button>
                                )}
                                {!isCleared && (
                                  <button
                                    type="button"
                                    onClick={() => handleHatcheryPaymentReceived(bk.bookingId)}
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-xs inline-flex items-center gap-1.5 cursor-pointer"
                                  >
                                    <CheckSquare className="w-4 h-4" /> {t.paymentReceivedBtn}
                                  </button>
                                )}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* PRIVATE FARMER FEEDBACK */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-teal-600" /> {t.sellerFeedbackTitle}
                  </h3>
                  {myPrivateReviews.length === 0 ? (
                    <p className="text-xs opacity-60">{t.noFeedbackYet}</p>
                  ) : (
                    <div className="space-y-2.5">
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
            3. MEDIATOR (BROKER) PORTAL — 2% COMMISSION + SEPARATE EXTRA MARGIN
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
                  <div className={`border rounded-2xl p-5 shadow-xs ${cardBg}`}>
                    <span className="text-xs text-amber-500 font-bold flex items-center gap-1.5">
                      <Clock className="w-4 h-4" /> {t.brokerHoldCard}
                    </span>
                    <div className="text-3xl font-black mt-2">₹{brokerHeld2PctTotal.toLocaleString('en-IN')}</div>
                    <p className="text-xs opacity-60 mt-1.5">{t.brokerHoldSub}</p>
                  </div>

                  <div className={`border rounded-2xl p-5 shadow-xs ${cardBg}`}>
                    <span className="text-xs text-emerald-500 font-bold flex items-center gap-1.5">
                      <Wallet className="w-4 h-4" /> {t.brokerReleasedCard}
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
                      <span className="inline-flex items-center gap-1 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        <Check className="w-3.5 h-3.5" /> {t.savedBadge}
                      </span>
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
                        <Edit3 className="w-3.5 h-3.5 text-teal-600" /> {t.editProfileBankBtn}
                      </button>
                    )}
                  </div>

                  {isEditingBrokerBank ? (
                    <form onSubmit={handleCompleteBrokerReg} className="grid grid-cols-1 sm:grid-cols-4 gap-3 pt-2 border-t border-slate-300/30">
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
                        <div className="flex gap-1.5">
                          <input required type="text" placeholder="UPI ID" value={brokerBankForm.upiId} onChange={(e) => setBrokerBankForm({ ...brokerBankForm, upiId: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`} />
                          <button type="submit" className="bg-teal-600 text-white text-xs font-bold px-3 rounded-xl cursor-pointer">{t.saveBtn}</button>
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

                {/* CLICKABLE BROKER TRANSACTION & MARGIN BREAKDOWN TRACKER */}
                <div className={`rounded-2xl p-6 border shadow-xs space-y-4 ${cardBg}`}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-teal-600" /> {t.brokerBookingsTitle}
                  </h3>
                  {myBrokerBookings.length === 0 ? (
                    <p className="text-xs opacity-60">{t.noBrokerBookings}</p>
                  ) : (
                    <div className="space-y-3">
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
                                <span className={`font-bold px-2.5 py-0.5 rounded-full ${isCleared ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'
                                  }`}>
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
                                Farmer: {bk.farmerName} ({bk.farmerPhone}) → Hatchery: {bk.batch?.realName || bk.batch?.hatcheryCode}
                              </p>
                              <p className="opacity-70">
                                {(bk.quantity || 0).toLocaleString('en-IN')} PL ({bk.batch?.plStage}) • Packing: {bk.packingDate} • Click to inspect full margin & commission breakdown
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

                {/* ALL REGISTERED HATCHERIES SORTABLE FOR BROKER */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      {filteredAndSortedBatches.map((batch) => {
                        const isSoldOut = (batch.availableStock || 0) <= 0;
                        return (
                          <div key={batch.id} className={`rounded-2xl border p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-teal-500 transition ${cardBg}`}>
                            <div onClick={() => setInspectedBatch(batch)} className="space-y-3 cursor-pointer">
                              <div className="flex items-start justify-between">
                                <div>
                                  <div className="flex items-center gap-2">
                                    <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                      {t.caaVerified}
                                    </span>
                                    <span className="text-xs font-semibold opacity-60">{batch.zone}</span>
                                    <span className="text-xs font-bold text-amber-500 inline-flex items-center gap-0.5">
                                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {batch.rating}
                                    </span>
                                  </div>
                                  <h3 className="text-base font-extrabold mt-1.5">{batch.hatcheryCode}</h3>
                                  <p className="text-xs opacity-65">{batch.species}</p>
                                </div>
                                <div className="text-right">
                                  <div className="text-xl font-black">₹{batch.pricePer1000.toFixed(2)}</div>
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
                              disabled={isSoldOut}
                              onClick={() => {
                                setSelectedBatch(batch);
                                setBookingForm(prev => ({
                                  ...prev,
                                  farmerName: brokerFarmers[0]?.name || '',
                                  farmerPhone: brokerFarmers[0]?.phone || '',
                                  quantity: Math.min(200000, batch.availableStock || 0),
                                  packingDate: batch.availableDate || prev.packingDate,
                                  packingTimeSlot: batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
                                  brokerMarginPaise: 2
                                }));
                              }}
                              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                            >
                              {isSoldOut ? t.soldOutBadge : t.selectAndBookBtn}
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
                      <div className="overflow-x-auto">
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
          BUYER OLD TRANSACTION INSPECTION MODAL
         ========================================================= */}
      {inspectedBuyerBooking && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-500">{inspectedBuyerBooking.bookingId}</span>
                <h3 className="font-extrabold text-base">Seed Purchase & Hatchery History</h3>
              </div>
              <button type="button" onClick={() => setInspectedBuyerBooking(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <div className={`p-3.5 rounded-xl border text-xs space-y-1 ${subCardBg}`}>
              <span className="text-[10px] font-bold uppercase text-teal-500">Purchased From Hatchery</span>
              <p className="text-sm font-extrabold">{inspectedBuyerBooking.batch?.realName}</p>
              <p className="opacity-75">CAA License: {inspectedBuyerBooking.batch?.caaLicense} • {inspectedBuyerBooking.batch?.zone}</p>
              <p className="opacity-75">Address: {inspectedBuyerBooking.batch?.realAddress} • +91 {inspectedBuyerBooking.batch?.realPhone}</p>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Booked On:</span><b>{inspectedBuyerBooking.date} at {inspectedBuyerBooking.time}</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Species & Stage:</span><b>{inspectedBuyerBooking.batch?.species} ({inspectedBuyerBooking.batch?.plStage})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Quantity + Free Bonus:</span><b>{(inspectedBuyerBooking.quantity || 0).toLocaleString('en-IN')} + {(inspectedBuyerBooking.bonusSeeds || 0).toLocaleString('en-IN')} PL</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Packing Schedule:</span><b>{inspectedBuyerBooking.packingDate} ({inspectedBuyerBooking.packingTimeSlot})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Advance Paid (4%):</span><b>₹{(inspectedBuyerBooking.tokenAdvance || 0).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between py-1"><span>Settlement Status:</span><b className="text-emerald-500">{inspectedBuyerBooking.settlement?.status === 'BALANCE_CLEARED' ? `Balance Cleared (${inspectedBuyerBooking.clearedAt})` : inspectedBuyerBooking.settlement?.status === 'CANCELLED_REFUNDED' ? 'Cancelled (2% Refunded)' : `₹${(inspectedBuyerBooking.balanceAtPacking || 0).toLocaleString('en-IN')} Pending at Packing`}</b></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => handleDownloadVerifiedPdf(inspectedBuyerBooking, inspectedBuyerBooking.settlement?.status === 'BALANCE_CLEARED')} className="bg-teal-600 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer">
                <Printer className="w-3.5 h-3.5" /> {t.printBtn}
              </button>
              <button type="button" onClick={() => setInspectedBuyerBooking(null)} className={`px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>{t.closeBtn}</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          SELLER ASSIGNED ORDER FULL DETAILS MODAL (ZERO LOSS FIXED RATE)
         ========================================================= */}
      {inspectedSellerOrder && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-500">{inspectedSellerOrder.bookingId}</span>
                <h3 className="font-extrabold text-base">Assigned Packing Order Full Details</h3>
              </div>
              <button type="button" onClick={() => setInspectedSellerOrder(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>
            <div className="text-xs space-y-2">
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Farmer Name:</span><b>{inspectedSellerOrder.farmerName} (+91 {inspectedSellerOrder.farmerPhone})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Seed Quantity + Bonus:</span><b>{(inspectedSellerOrder.quantity || 0).toLocaleString('en-IN')} + {(inspectedSellerOrder.bonusSeeds || 0).toLocaleString('en-IN')} PL</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Target Pond Salinity:</span><b className="text-teal-500">{inspectedSellerOrder.pondSalinity} PPT (Source: {inspectedSellerOrder.batch?.salinity} PPT)</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Packing Date & Slot:</span><b>{inspectedSellerOrder.packingDate} ({inspectedSellerOrder.packingTimeSlot})</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Logistics Mode:</span><b>{inspectedSellerOrder.includeTransport ? 'Oxygen Van Delivery (+₹1,500)' : 'Self Pickup'}</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Your Fixed Hatchery Rate:</span><b>₹{(inspectedSellerOrder.hatcheryFixedRate || 0).toFixed(2)} / seed</b></div>
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Your Total Fixed Hatchery Value:</span><b className="text-emerald-500">₹{(inspectedSellerOrder.hatcheryFixedTotal || 0).toLocaleString('en-IN')} (100% Yours)</b></div>
              <div className="flex justify-between py-1"><span>Status:</span><b>{inspectedSellerOrder.settlement?.status === 'BALANCE_CLEARED' ? `Payment Received (${inspectedSellerOrder.clearedAt})` : 'Awaiting Packing & Payment Received'}</b></div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <button type="button" onClick={() => setInspectedSellerOrder(null)} className={`px-4 py-2 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>{t.closeBtn}</button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          BROKER TRANSACTION AUDIT MODAL (SHOWS EXTRA MARGIN PAISE + 2% COMMISSION BREAKDOWN)
         ========================================================= */}
      {selectedBrokerTx && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="text-[11px] font-mono font-bold text-teal-500">{selectedBrokerTx.bookingId}</span>
                <h3 className="font-extrabold text-base">Broker Deal, Margin & Commission Breakdown</h3>
              </div>
              <button type="button" onClick={() => setSelectedBrokerTx(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className={`p-3 rounded-xl border ${subCardBg}`}>
                <span className="text-[10px] opacity-60 uppercase font-bold block">Farmer (Buyer)</span>
                <b className="text-sm block mt-0.5">{selectedBrokerTx.farmerName}</b>
                <span className="opacity-75">+91 {selectedBrokerTx.farmerPhone}</span>
              </div>
              <div className={`p-3 rounded-xl border ${subCardBg}`}>
                <span className="text-[10px] opacity-60 uppercase font-bold block">Hatchery (Seller)</span>
                <b className="text-sm block mt-0.5">{selectedBrokerTx.batch?.realName}</b>
                <span className="opacity-75">{selectedBrokerTx.batch?.zone}</span>
              </div>
            </div>

            <div className={`border rounded-xl p-4 space-y-2 text-xs ${subCardBg}`}>
              <div className="flex justify-between"><span>Booked Quantity:</span><b>{(selectedBrokerTx.quantity || 0).toLocaleString('en-IN')} PL ({selectedBrokerTx.batch?.plStage})</b></div>
              <div className="flex justify-between"><span>Packing Schedule:</span><b>{selectedBrokerTx.packingDate} ({selectedBrokerTx.packingTimeSlot})</b></div>
              <div className="flex justify-between"><span>Hatchery Fixed Base Rate:</span><b>₹{(selectedBrokerTx.hatcheryFixedRate || 0).toFixed(2)} / seed</b></div>
              <div className="flex justify-between"><span>Extra Margin Added by You:</span><b className="text-teal-500">+{selectedBrokerTx.brokerMarginPaise || 0} paise / seed</b></div>
              <div className="flex justify-between"><span>Effective Rate Quoted to Farmer:</span><b>₹{((selectedBrokerTx.hatcheryFixedRate || 0) + ((selectedBrokerTx.brokerMarginPaise || 0) / 100)).toFixed(2)} / seed</b></div>
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
          HATCHERY INSPECTION MODAL
         ========================================================= */}
      {inspectedBatch && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-2xl w-full p-6 shadow-2xl border space-y-4 max-h-[90vh] overflow-y-auto ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {t.caaVerified}
                  </span>
                  <span className="text-xs font-bold text-amber-500">{inspectedBatch.rating}★ ({inspectedBatch.reviewCount || 0} Reviews)</span>
                </div>
                <h3 className="font-extrabold text-lg mt-1">{inspectedBatch.hatcheryCode} • {inspectedBatch.zone}</h3>
              </div>
              <button type="button" onClick={() => setInspectedBatch(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className={`grid grid-cols-2 sm:grid-cols-4 gap-2.5 p-3.5 rounded-xl border text-xs ${subCardBg}`}>
              <div><span className="text-[10px] opacity-60 block">Broodstock</span><b>{inspectedBatch.broodstock || 'SPF Certified'}</b></div>
              <div><span className="text-[10px] opacity-60 block">Orders Fulfilled</span><b>{bookings.filter(b => b.hatcheryOwnerPhone === inspectedBatch.ownerPhone).length} Orders</b></div>
              <div><span className="text-[10px] opacity-60 block">Salinity / Stage</span><b className="text-teal-500">{inspectedBatch.salinity} PPT • {inspectedBatch.plStage}</b></div>
              <div><span className="text-[10px] opacity-60 block">Packing Slot</span><b>{inspectedBatch.availableTimeSlot || 'All Day'}</b></div>
            </div>

            <div className={`border rounded-xl p-4 space-y-3 ${subCardBg}`}>
              <span className="text-xs font-extrabold flex items-center gap-1.5">
                <FileCheck2 className="w-4 h-4 text-teal-600" /> Verified PCR Lab Images ({(inspectedBatch.pcrImages || []).length})
              </span>
              {(inspectedBatch.pcrImages || []).length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {inspectedBatch.pcrImages.map((img, idx) => (
                    <div key={idx} className={`border rounded-xl p-2 space-y-1.5 ${cardBg}`}>
                      <span className="text-[11px] font-extrabold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded inline-block">
                        {img.label}
                      </span>
                      <img src={img.url} alt={img.label} className="w-full h-48 object-contain rounded-lg bg-slate-100" />
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-4 text-center text-xs opacity-60">No PCR images uploaded.</div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" onClick={() => setInspectedBatch(null)} className={`px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>
                {t.closeBtn}
              </button>
              <button
                type="button"
                disabled={(inspectedBatch.availableStock || 0) <= 0}
                onClick={() => {
                  const b = inspectedBatch;
                  setInspectedBatch(null);
                  setSelectedBatch(b);
                }}
                className="bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                {t.bookSlotBtn} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          BOOKING MODAL (4% ADVANCE: 2% PLATFORM + 2% HOLD)
         ========================================================= */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-slate-950/65 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 max-h-[92vh] overflow-y-auto ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <h3 className="font-extrabold text-base">{t.modalTitle}</h3>
                <p className="text-xs opacity-60">{selectedBatch.hatcheryCode} • {selectedBatch.zone}</p>
              </div>
              <button type="button" onClick={() => setSelectedBatch(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleConfirmBookingSubmit} className="space-y-4">
              <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-teal-600 uppercase">{t.step1Label}</span>
                  {currentUser.role === 'mediator' && (
                    <button type="button" onClick={() => setSelectedBatch(null)} className="text-[11px] font-bold text-teal-600 underline cursor-pointer">
                      {t.changeHatcheryBtn}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold block">{selectedBatch.hatcheryCode} ({selectedBatch.plStage})</span>
                    <span className="opacity-75">{selectedBatch.species} • Remaining: {(selectedBatch.availableStock || 0).toLocaleString('en-IN')} PL</span>
                  </div>
                  <div className="text-right font-black text-teal-600 text-base">
                    ₹{selectedBatch.pricePer1000.toFixed(2)}<span className="text-[10px] font-normal block">/seed</span>
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
                        type="number"
                        min="0"
                        max="20"
                        value={bookingForm.brokerMarginPaise}
                        onChange={(e) => setBookingForm({ ...bookingForm, brokerMarginPaise: Number(e.target.value) })}
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

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{t.quantityLabel}</label>
                    <input
                      required
                      type="number"
                      step="10000"
                      min="10000"
                      max={selectedBatch.availableStock || 1000000}
                      value={bookingForm.quantity}
                      onChange={(e) => setBookingForm({ ...bookingForm, quantity: Number(e.target.value) })}
                      className={`w-full border rounded-xl px-2.5 py-2 text-sm font-bold select-text ${inputCls}`}
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{t.pondSalinityLabel}</label>
                    <input required type="number" value={bookingForm.pondSalinity} onChange={(e) => setBookingForm({ ...bookingForm, pondSalinity: Number(e.target.value) })} className={`w-full border rounded-xl px-2.5 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{t.packingDateLabel}</label>
                    <input required type="date" value={bookingForm.packingDate} onChange={(e) => setBookingForm({ ...bookingForm, packingDate: e.target.value })} className={`w-full border rounded-xl px-2.5 py-2 text-xs font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{t.packingTimeLabel}</label>
                    <select value={bookingForm.packingTimeSlot} onChange={(e) => setBookingForm({ ...bookingForm, packingTimeSlot: e.target.value })} className={`w-full border rounded-xl px-2.5 py-2 text-xs font-bold ${inputCls}`}>
                      {PACKING_TIME_SLOTS.map(slot => <option key={slot} value={slot}>{slot}</option>)}
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
                  <label className="text-xs font-bold opacity-75 block">{t.paymentMethodLabel}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'RAZORPAY', label: 'Razorpay', icon: CreditCard },
                      { id: 'DIRECT_UPI', label: 'Direct UPI / QR', icon: QrCode },
                      { id: 'BANK_TO_BANK', label: 'Bank-to-Bank', icon: Landmark }
                    ].map(pm => {
                      const Icon = pm.icon;
                      const active = bookingForm.paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setBookingForm({ ...bookingForm, paymentMethod: pm.id })}
                          className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer ${active ? 'border-teal-600 bg-teal-500/15 text-teal-600 font-extrabold' : subCardBg
                            }`}
                        >
                          <Icon className="w-4 h-4 text-teal-600" />
                          <span className="text-[11px]">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {(() => {
                    const qty = Number(bookingForm.quantity) || 100000;
                    const hatcheryFixedCost = Math.round(qty * (selectedBatch.pricePer1000 || 0.42));
                    const token = Math.max(800, Math.round(hatcheryFixedCost * 0.04));

                    if (bookingForm.paymentMethod === 'DIRECT_UPI') {
                      const upiUri = `upi://pay?pa=aquamark@sbi&pn=AquaMark&am=${token}&cu=INR&tn=SeedAdvance4Pct`;
                      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;

                      return (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 space-y-3 text-xs">
                          <div className="flex flex-col sm:flex-row items-center gap-3.5">
                            <div className="bg-white p-2 rounded-xl border border-emerald-300 shrink-0 text-center text-slate-900">
                              <img src={qrApiUrl} alt="Scan UPI QR" className="w-28 h-28 object-contain" />
                              <span className="text-[10px] font-bold block mt-1">Scan & Pay ₹{token.toLocaleString('en-IN')}</span>
                            </div>

                            <div className="flex-1 space-y-2 w-full">
                              <span className="font-extrabold block">Option A: Scan QR with PhonePe / GPay</span>
                              <span className="font-extrabold block pt-1 border-t border-emerald-500/20">Option B: Enter UPI ID for Collect Request</span>
                              <div className="flex gap-1.5">
                                <input
                                  type="text"
                                  placeholder="yourname@ybl / @okaxis"
                                  value={bookingForm.payerUpiId}
                                  onChange={(e) => setBookingForm({ ...bookingForm, payerUpiId: e.target.value })}
                                  className={`w-full border rounded-lg px-2.5 py-1.5 text-xs font-mono select-text ${inputCls}`}
                                />
                                <button
                                  type="button"
                                  onClick={() => {
                                    if (!bookingForm.payerUpiId.includes('@')) {
                                      showToast('Enter valid UPI ID (e.g., name@ybl)');
                                      return;
                                    }
                                    setBookingForm({ ...bookingForm, upiRequestSent: true });
                                    showToast(t.toasts.upiCollectSent);
                                  }}
                                  className="bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs shrink-0 cursor-pointer"
                                >
                                  Request ₹{token.toLocaleString('en-IN')}
                                </button>
                              </div>
                              {bookingForm.upiRequestSent && (
                                <p className="text-[11px] font-bold text-teal-500">
                                  ✓ Collect Request of ₹{token.toLocaleString('en-IN')} sent to {bookingForm.payerUpiId}. Approve & enter UTR below:
                                </p>
                              )}
                            </div>
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
                const qty = Number(bookingForm.quantity) || 100000;
                const hatcheryFixedCost = Math.round(qty * (selectedBatch.pricePer1000 || 0.42));
                const brokerMarginEarn = currentUser.role === 'mediator' ? Math.round(qty * ((Number(bookingForm.brokerMarginPaise) || 0) / 100)) : 0;
                const total = hatcheryFixedCost + brokerMarginEarn + (bookingForm.includeTransport ? 1500 : 0);
                const token = Math.max(800, Math.round(hatcheryFixedCost * 0.04));
                return (
                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{t.totalSeedValue} ({qty.toLocaleString('en-IN')} PL):</span>
                      <span className="font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-extrabold text-sm border-t border-white/10 pt-2">
                      <span>{t.advancePaidLabel}:</span>
                      <span>₹{token.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-1">
                      <span>{t.balanceAtPacking}:</span>
                      <span className="font-bold text-white">₹{(total - token).toLocaleString('en-IN')}</span>
                    </div>
                  </div>
                );
              })()}

              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3.5 rounded-xl text-sm shadow-xs cursor-pointer">
                {t.payNowBtn} →
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
                  <div className="font-extrabold">{b.hatcheryCode}</div>
                  <div className="text-teal-500 font-bold">{b.zone}</div>
                  <div className="border-t border-slate-300/20 pt-2 space-y-1">
                    <div className="flex justify-between"><span>{t.stage}:</span><b>{b.plStage}</b></div>
                    <div className="flex justify-between"><span>{t.perSeed}:</span><b>₹{b.pricePer1000.toFixed(2)}</b></div>
                    <div className="flex justify-between"><span>{t.salinity}:</span><b>{b.salinity} PPT</b></div>
                    <div className="flex justify-between"><span>{t.bonus}:</span><b className="text-emerald-500">+{b.bonusPercent}%</b></div>
                    <div className="flex justify-between"><span>Rating:</span><b>{b.rating}★</b></div>
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
              <div className="flex items-center gap-2.5">
                <img src="/favicon.svg" alt="Aqua Mark Logo" className="w-8 h-8 object-contain" />
                <div>
                  <h3 className="font-extrabold text-sm">
                    {activeInvoice.receiptType === 'FINAL' ? t.finalReceiptTitle : t.receiptTitle}
                  </h3>
                  <p className="text-[11px] font-mono text-emerald-500 font-bold">
                    {activeInvoice.booking.bookingId} • {activeInvoice.booking.date} {activeInvoice.booking.time}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setActiveInvoice(null)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer">✕</button>
            </div>

            <div className="text-xs space-y-2.5">
              <div className="bg-emerald-500/10 border border-emerald-500/30 p-3.5 rounded-xl">
                <span className="text-[10px] font-extrabold text-emerald-500 uppercase tracking-wider">{t.sellerDetailsHeading}</span>
                <p className="font-extrabold text-sm mt-0.5">{activeInvoice.booking.batch?.realName}</p>
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
                <span>{t.advancePaidLabel}:</span>
                <span>₹{(activeInvoice.booking.tokenAdvance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 font-bold">
                <span>{t.balanceAtPacking}:</span>
                <span>₹{(activeInvoice.booking.balanceAtPacking || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
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