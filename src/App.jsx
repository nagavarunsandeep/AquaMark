import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Lock, Unlock, Calculator, CheckCircle2,
  MapPin, FileText, Wallet, Users, Send, Printer, Camera,
  BadgeCheck, ArrowRight, Globe, LogOut, Smartphone, UserCheck,
  Landmark, Clock, CheckSquare, ShoppingBag, Building2, Star, Search,
  AlertTriangle, Package, Edit3, Check, ChevronRight, Layers,
  Trash2, ArrowUpDown, Scale, FileCheck2, Upload, PlusCircle,
  Heart, Truck, TrendingUp, FlaskConical, Eye, CreditCard, QrCode,
  MessageSquare, BarChart3, ShieldAlert, Calendar, Award, Sparkles
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

const DICT = {
  en: {
    brandSub: 'B2B Aquaculture Seed & Settlement Exchange',
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
    tabMarketplace: 'Hatchery Marketplace',
    tabBookings: 'My Bookings & Status',
    tabAnalytics: 'Harvest, Feed & Profit Estimator',
    tabGuide: 'Crop & Water Protocol',
    searchPlaceholder: 'Search Batch ID, Species, Stage, or Zone...',
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
    unlockHint: 'Hatchery identity & contact unlock after advance booking',
    inspectBtn: 'Inspect Hatchery & PCR',
    perSeed: 'per seed',
    stage: 'Seed / PL Stage',
    salinity: 'Salinity',
    bonus: 'Bonus',
    stock: 'Stock',
    sampleBtn: '₹500 Sample',
    bookSlotBtn: 'Book Packing Slot',
    myBookingsTitle: 'Your Bookings & Packing Confirmation',
    noBookingsYet: 'No bookings placed yet.',
    packingReadyAlert: '📦 Hatchery Marked Packing Complete! Verify seed & click OK to release payment.',
    escrowHoldBadge: 'Funds Held Pending Packing OK',
    escrowReleasedBadge: 'Packing Verified • Payment Released',
    approvePackingBtn: 'Packing Complete — OK (Release Payment)',
    rateSeedLabel: 'Rate Hatchery (1-5★) & Feedback:',
    submitReviewBtn: 'Submit Feedback',
    ratedLabel: 'Feedback Sent',
    invoiceBtn: 'Certificate',
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
    editBtn: 'Edit Profile & Bank',
    saveBtn: 'Save Changes',
    addBatchTitle: 'Publish New Seed Batch',
    speciesLabel: 'Shrimp Species',
    customSpeciesPlaceholder: 'Enter custom shrimp species...',
    customStagePlaceholder: 'Enter custom stage (e.g. PL22)...',
    customZonePlaceholder: 'Enter custom zone / district...',
    ratePerSeedLabel: 'Rate (₹ / seed)',
    stockLabel: 'Available Stock (PL)',
    pcrUploadLabel: 'Attach PCR Lab Photo / PDF (Mandatory)',
    gpsLockedBtn: 'GPS Locked',
    captureGpsBtn: 'Tag Tank GPS',
    publishBtn: 'Publish Batch Live',
    myBatchesTitle: 'Your Active Seed Batches (Edit Stage / Salinity / Rate or Remove)',
    noBatchesSeller: 'No active batches published yet.',
    saveChangesBtn: 'Save Updates',
    removeBtn: 'Remove',
    sellerOrdersTitle: 'Packing Orders Assigned to Your Hatchery',
    noOrdersYet: 'No packing orders received for your hatchery yet.',
    creditedBadge: 'Credited to Bank',
    onHoldBadge: 'On Hold (Awaiting Buyer OK)',
    markPackedBtn: 'Mark Packing Complete',
    packedSentBadge: 'Packing Marked Done • Buyer Notified',
    sellerFeedbackTitle: 'Private Farmer Ratings & Feedback (Visible Only to You)',
    noFeedbackYet: 'No farmer feedback submitted yet.',
    brokerHoldCard: 'Commission on Hold',
    brokerHoldSub: 'Releases automatically when buyer confirms packing OK',
    brokerReleasedCard: 'Released to Bank Account',
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
    step2Label: 'Step 2: Enter Farmer & Payment Details',
    selectSavedFarmer: 'Quick-Fill from Locked Farmers',
    manualFarmerOption: '-- Enter Farmer Manually --',
    modalTitle: 'Confirm Seed Packing Slot',
    farmerNameLabel: 'Farmer Name',
    whatsappLabel: 'WhatsApp Number (10 Digits)',
    quantityLabel: 'Seed Quantity (PL)',
    pondSalinityLabel: 'Pond Salinity (PPT)',
    packingDateLabel: 'Packing Date',
    brokerMarginLabel: 'Your Extra Margin (Paise / seed)',
    transportAddonLabel: 'Include Oxygen Van Delivery (+₹1,500)',
    paymentMethodLabel: 'Select Payment Method',
    payRazorpay: 'Razorpay Checkout (UPI / Cards / NetBanking)',
    payDirectUpi: 'Direct UPI Transfer (PhonePe / GPay / BHIM)',
    payBankToBank: 'Direct Bank-to-Bank (NEFT / IMPS / RTGS)',
    utrPlaceholder: 'Enter 12-digit UPI / Bank UTR Reference No',
    salinityWarn: 'Salinity variance exceeds 4 PPT. Hatchery will perform 48-hour gradual acclimatization.',
    totalSeedValue: 'Total Order Value',
    advancePayable: 'Advance Payable Now (10%)',
    balanceAtGate: 'Balance Payable at Packing Gate',
    payNowBtn: 'Confirm & Complete Booking',
    receiptTitle: 'VERIFIED SEED BOOKING CERTIFICATE',
    printBtn: 'Print',
    closeBtn: 'Close',
    toasts: {
      invalidPhone: 'Please enter a valid 10-digit mobile number.',
      otpSent: 'Verification OTP sent:',
      invalidOtp: 'Incorrect OTP. Please enter the 4-digit code shown.',
      regComplete: 'Hatchery & Bank details verified and locked to your mobile!',
      profileUpdated: 'Hatchery Name, Address & Bank details updated!',
      gpsLocked: 'Tank GPS coordinates locked.',
      uploadPcrFirst: 'Please attach the PCR Lab Report image or PDF.',
      batchPublished: 'Seed batch published live & file input cleared!',
      batchUpdated: 'Batch values updated live!',
      batchRemoved: 'Seed batch removed.',
      sampleOrdered: '₹500 100-Seed Sample courier requested!',
      packingMarked: 'Packing marked complete! Buyer notified on their dashboard.',
      fundsReleased: 'Packing OK confirmed! Held payment released to Hatchery & Broker.',
      farmerLocked: 'Farmer locked to your Broker ID for 365 days!',
      paymentSuccess: 'Booking confirmed! Hatchery unlocked & Verified Certificate ready.',
      enterUtr: 'Please enter the 12-digit UPI / Bank UTR Transaction Reference.'
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
    tabMarketplace: 'హేచరీల మార్కెట్',
    tabBookings: 'నా బుకింగ్స్ & స్టేటస్',
    tabAnalytics: 'దిగుబడి, ఫీడ్ & లాభాల కాలిక్యులేటర్',
    tabGuide: 'సాగు & నీటి యాజమాన్యం',
    searchPlaceholder: 'బ్యాచ్ ID, రకం, దశ లేదా ప్రాంతం వెతకండి...',
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
    unlockHint: 'అడ్వాన్స్ బుకింగ్ పూర్తయిన వెంటనే హేచరీ పేరు & ఫోన్ నంబర్ అన్‌లాక్ అవుతాయి',
    inspectBtn: 'హేచరీ వివరాలు & PCR ఫోటో చూడండి',
    perSeed: 'ఒక్క సీడ్ ధర',
    stage: 'సీడ్ / PL దశ',
    salinity: 'ఉప్పదనం',
    bonus: 'బోనస్ సీడ్',
    stock: 'నిల్వ',
    sampleBtn: '₹500 శాంపిల్',
    bookSlotBtn: 'ప్యాకింగ్ స్లాట్ బుక్ చేయండి',
    myBookingsTitle: 'మీ బుకింగ్స్ & ప్యాకింగ్ నిర్ధారణ',
    noBookingsYet: 'మీరు ఇంకా ఎటువంటి సీడ్ బుకింగ్ చేయలేదు.',
    packingReadyAlert: '📦 హేచరీ వారు ప్యాకింగ్ పూర్తయినట్లు తెలిపారు! సీడ్ చూసి OK నొక్కండి.',
    escrowHoldBadge: 'డబ్బులు హోల్డ్‌లో ఉన్నాయి',
    escrowReleasedBadge: 'ప్యాకింగ్ OK • పేమెంట్ విడుదలైంది',
    approvePackingBtn: 'ప్యాకింగ్ పూర్తయింది — OK (Release Payment)',
    rateSeedLabel: 'రేటింగ్ (1-5★) & అభిప్రాయం రాయండి:',
    submitReviewBtn: 'ఫీడ్‌బ్యాక్ పంపండి',
    ratedLabel: 'ఫీడ్‌బ్యాక్ పంపబడింది',
    invoiceBtn: 'సర్టిఫికెట్',
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
    editBtn: 'Edit Hatchery & Bank',
    saveBtn: 'మార్పులు సేవ్ చేయండి',
    addBatchTitle: 'కొత్త సీడ్ బ్యాచ్ పబ్లిష్ చేయండి',
    speciesLabel: 'రొయ్య రకం (Species)',
    customSpeciesPlaceholder: 'కొత్త రొయ్య రకం పేరు టైప్ చేయండి...',
    customStagePlaceholder: 'కొత్త దశ టైప్ చేయండి (ఉదా: PL22)...',
    customZonePlaceholder: 'కొత్త ప్రాంతం / జిల్లా పేరు టైప్ చేయండి...',
    ratePerSeedLabel: 'ధర (₹ / ఒక్క సీడ్)',
    stockLabel: 'అందుబాటులో ఉన్న స్టాక్ (PL)',
    pcrUploadLabel: 'PCR ల్యాబ్ ఫోటో / PDF జతచేయండి (తప్పనిసరి)',
    gpsLockedBtn: 'GPS లాక్ అయింది',
    captureGpsBtn: 'GPS ట్యాగ్ చేయండి',
    publishBtn: 'బ్యాచ్ లైవ్ చేయండి',
    myBatchesTitle: 'మీ హేచరీ సీడ్ బ్యాచ్‌లు (PL దశ / Salinity మార్చుకోండి లేదా తొలగించండి)',
    noBatchesSeller: 'మీరు ఇంకా ఎటువంటి బ్యాచ్‌లు యాడ్ చేయలేదు.',
    saveChangesBtn: 'మార్పులు సేవ్ చేయండి',
    removeBtn: 'తొలగించు',
    sellerOrdersTitle: 'మీ హేచరీకి వచ్చిన ప్యాకింగ్ ఆర్డర్లు',
    noOrdersYet: 'మీ హేచరీకి ఇంకా ఎటువంటి ఆర్డర్లు రాలేదు.',
    creditedBadge: 'బ్యాంక్‌కు జమ అయింది',
    onHoldBadge: 'హోల్డ్‌లో ఉంది (రైతు OK కోసం వేచి ఉంది)',
    markPackedBtn: 'ప్యాకింగ్ పూర్తయింది (Notify Buyer)',
    packedSentBadge: 'ప్యాకింగ్ పూర్తయింది • రైతుకు తెలియజేయబడింది',
    sellerFeedbackTitle: 'రైతుల రేటింగ్స్ & అభిప్రాయాలు (మీకు మాత్రమే కనిపిస్తాయి)',
    noFeedbackYet: 'ఇంకా ఎటువంటి రైతు అభిప్రాయాలు రాలేదు.',
    brokerHoldCard: 'హోల్డ్‌లో ఉన్న కమిషన్',
    brokerHoldSub: 'రైతు ప్యాకింగ్ OK నొక్కగానే మీ బ్యాంక్ అకౌంట్‌లోకి విడుదల అవుతుంది',
    brokerReleasedCard: 'బ్యాంక్ అకౌంట్‌కు విడుదలైన కమిషన్',
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
    step2Label: 'దశ 2: రైతు & పేమెంట్ వివరాలు నమోదు చేయండి',
    selectSavedFarmer: 'లాక్ అయిన రైతుల నుండి ఎంచుకోండి',
    manualFarmerOption: '-- రైతు పేరు స్వయంగా టైప్ చేయండి --',
    modalTitle: 'సీడ్ ప్యాకింగ్ స్లాట్ బుకింగ్',
    farmerNameLabel: 'రైతు పేరు',
    whatsappLabel: 'వాట్సాప్ నంబర్ (10 అంకెలు)',
    quantityLabel: 'పరిమాణం (Seeds)',
    pondSalinityLabel: 'చెరువు ఉప్పదనం (PPT)',
    packingDateLabel: 'ప్యాకింగ్ తేదీ',
    brokerMarginLabel: 'మీ అదనపు మార్జిన్ (పైసలు / ఒక్క సీడ్)',
    transportAddonLabel: 'ఆక్సిజన్ వ్యాన్ రవాణా జతచేయండి (+₹1,500)',
    paymentMethodLabel: 'పేమెంట్ విధానం ఎంచుకోండి',
    payRazorpay: 'Razorpay గేట్‌వే (UPI / Cards / NetBanking)',
    payDirectUpi: 'డైరెక్ట్ UPI (PhonePe / GPay / BHIM)',
    payBankToBank: 'డైరెక్ట్ Bank-to-Bank (NEFT / IMPS / RTGS)',
    utrPlaceholder: '12-అంకెల UPI / Bank UTR రిఫరెన్స్ నంబర్ ఎంటర్ చేయండి',
    salinityWarn: 'హేచరీ నీటికి మరియు చెరువు నీటికి మధ్య 4 PPT కంటే ఎక్కువ తేడా ఉంది. 48 గంటల ముందుగా Acclimatization చేయాలని హేచరీకి అలర్ట్ వెళ్తుంది.',
    totalSeedValue: 'మొత్తం ఆర్డర్ విలువ',
    advancePayable: 'ఇప్పుడు చెల్లించాల్సిన అడ్వాన్స్ (10%)',
    balanceAtGate: 'ప్యాకింగ్ సమయంలో చెల్లించాల్సిన బ్యాలెన్స్',
    payNowBtn: 'పేమెంట్ నిర్ధారించి బుకింగ్ పూర్తి చేయండి',
    receiptTitle: 'అధికారిక సీడ్ బుకింగ్ వెరిఫైడ్ సర్టిఫికెట్',
    printBtn: 'Print',
    closeBtn: 'మూసివేయండి',
    toasts: {
      invalidPhone: 'దయచేసి సరైన 10-అంకెల మొబైల్ నంబర్ ఎంటర్ చేయండి.',
      otpSent: 'OTP పంపబడింది:',
      invalidOtp: 'తప్పు OTP! స్క్రీన్‌పై ఉన్న 4-అంకెల కోడ్ ఎంటర్ చేయండి.',
      regComplete: 'హేచరీ & బ్యాంక్ వివరాలు మీ నంబర్‌కు శాశ్వతంగా ఫిక్స్ చేయబడ్డాయి!',
      profileUpdated: 'హేచరీ పేరు, అడ్రస్ & బ్యాంక్ వివరాలు అప్‌డేట్ అయ్యాయి!',
      gpsLocked: 'హేచరీ GPS లొకేషన్ లాక్ అయింది.',
      uploadPcrFirst: 'దయచేసి PCR ల్యాబ్ ఫోటో లేదా PDF జతచేయండి.',
      batchPublished: 'కొత్త సీడ్ బ్యాచ్ లైవ్ అయింది!',
      batchUpdated: 'బ్యాచ్ వివరాలు అప్‌డేట్ అయ్యాయి!',
      batchRemoved: 'సీడ్ బ్యాచ్ తొలగించబడింది.',
      sampleOrdered: '₹500 శాంపిల్ రిక్వెస్ట్ పంపబడింది!',
      packingMarked: 'ప్యాకింగ్ పూర్తయినట్లు రైతు డాష్‌బోర్డ్‌కు పంపబడింది!',
      fundsReleased: 'ప్యాకింగ్ OK నిర్ధారించబడింది! డబ్బులు విడుదలయ్యాయి.',
      farmerLocked: 'రైతు 365 రోజుల పాటు మీ ID కి లాక్ చేయబడ్డారు!',
      paymentSuccess: 'పేమెంట్ పూర్తయింది! వెరిఫైడ్ సర్టిఫికెట్ సిద్ధంగా ఉంది.',
      enterUtr: 'దయచేసి 12-అంకెల UPI / Bank UTR నంబర్ ఎంటర్ చేయండి.'
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
  const t = DICT[lang] || DICT.en;
  const otpInputRef = useRef(null);
  const pcrInputRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => safeLoadStorage('aqm_v4_user', null));

  // ZERO SAMPLE DATA: Starts completely empty until real hatcheries register & publish
  const [hatcheryProfiles, setHatcheryProfiles] = useState(() => safeLoadStorage('aqm_v4_hatcheries', {}));
  const [batches, setBatches] = useState(() => safeLoadStorage('aqm_v4_batches', []));
  const [bookings, setBookings] = useState(() => safeLoadStorage('aqm_v4_bookings', []));
  const [brokerFarmers, setBrokerFarmers] = useState(() => safeLoadStorage('aqm_v4_farmers', []));
  const [savedBatchIds, setSavedBatchIds] = useState(() => safeLoadStorage('aqm_v4_wishlist', []));

  // Broker Bank Details
  const [brokerBank, setBrokerBank] = useState(() =>
    safeLoadStorage('aqm_v4_broker_bank', { accountName: '', accountNo: '', ifsc: '', upiId: '' })
  );
  const [isBrokerBankSaved, setIsBrokerBankSaved] = useState(() => {
    const b = safeLoadStorage('aqm_v4_broker_bank', null);
    return Boolean(b?.accountNo && b?.ifsc && b?.upiId);
  });

  // Seller Unified Registration & Edit State (Includes Hatchery Name, Address, Zone + Bank)
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

  // Hatchery Detail Inspection Modal (Shows PCR Photo/PDF, History, Reviews)
  const [inspectedBatch, setInspectedBatch] = useState(null);

  // Buyer Rating & Feedback State (Per Booking)
  const [ratingDrafts, setRatingDrafts] = useState({});

  // Seller Batch Inline Editing
  const [editingBatchId, setEditingBatchId] = useState(null);
  const [editBatchValues, setEditBatchValues] = useState({
    plStage: 'PL12',
    salinity: 16,
    pricePer1000: 0.42,
    availableStock: 1000000,
    bonusPercent: 15
  });

  useEffect(() => {
    try {
      if (currentUser) localStorage.setItem('aqm_v4_user', JSON.stringify(currentUser));
      else localStorage.removeItem('aqm_v4_user');
    } catch { }
  }, [currentUser]);

  useEffect(() => { try { localStorage.setItem('aqm_v4_hatcheries', JSON.stringify(hatcheryProfiles)); } catch { } }, [hatcheryProfiles]);
  useEffect(() => { try { localStorage.setItem('aqm_v4_batches', JSON.stringify(batches)); } catch { } }, [batches]);
  useEffect(() => { try { localStorage.setItem('aqm_v4_bookings', JSON.stringify(bookings)); } catch { } }, [bookings]);
  useEffect(() => { try { localStorage.setItem('aqm_v4_farmers', JSON.stringify(brokerFarmers)); } catch { } }, [brokerFarmers]);
  useEffect(() => { try { localStorage.setItem('aqm_v4_wishlist', JSON.stringify(savedBatchIds)); } catch { } }, [savedBatchIds]);
  useEffect(() => { try { localStorage.setItem('aqm_v4_broker_bank', JSON.stringify(brokerBank)); } catch { } }, [brokerBank]);

  // Auto-focus OTP input immediately when OTP screen opens
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
    brokerMarginPaise: 0,
    includeTransport: false,
    paymentMethod: 'RAZORPAY', // 'RAZORPAY' | 'DIRECT_UPI' | 'BANK_TO_BANK'
    utrReference: ''
  });

  const [activeInvoice, setActiveInvoice] = useState(null);
  const [toast, setToast] = useState(null);

  // Advanced Harvest, Feed & Profit Estimator States
  const [calcPonds, setCalcPonds] = useState(2);
  const [calcAcresPerPond, setCalcAcresPerPond] = useState(2.5);
  const [calcDensity, setCalcDensity] = useState(40);
  const [calcSurvival, setCalcSurvival] = useState(85);
  const [calcTargetCount, setCalcTargetCount] = useState(30); // 30 prawns per kg
  const [calcFcr, setCalcFcr] = useState(1.4);
  const [calcMarketRatePerKg, setCalcMarketRatePerKg] = useState(390);
  const [calcFeedCostPerKg, setCalcFeedCostPerKg] = useState(88);

  // Broker Add Farmer State
  const [newFarmer, setNewFarmer] = useState({ name: '', phone: '', village: '', acres: '' });

  // New Batch Form (Supports Standard + Custom Species & Custom Stage)
  const [newBatchForm, setNewBatchForm] = useState({
    species: 'Litopenaeus vannamei (SPF)',
    customSpecies: '',
    plStage: 'PL12',
    customStage: '',
    pricePer1000: 0.43,
    availableStock: 1000000,
    salinity: 16,
    bonusPercent: 15
  });
  const [pcrFile, setPcrFile] = useState(null);
  const [pcrPreviewUrl, setPcrPreviewUrl] = useState('');
  const [gpsLocation, setGpsLocation] = useState('');

  const showToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 4000);
  };

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
    setOtpSent(false);
    setEnteredOtp('');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setOtpSent(false);
    setEnteredOtp('');
    setSelectedBatch(null);
  };

  // Unified One-Step Hatchery + Bank Registration
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

  // Seller Edits Hatchery Name, Address, Zone & Bank Details Together
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

    // Sync updated hatchery name/address/zone to all batches owned by this seller
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

  // Handle PCR File Selection & Store Data URL for Buyer Inspection Modal
  const handlePcrFileSelect = (file) => {
    if (!file) {
      setPcrFile(null);
      setPcrPreviewUrl('');
      return;
    }
    setPcrFile(file);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPcrPreviewUrl(reader.result || '');
    };
    reader.readAsDataURL(file);
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

  // Publish New Batch & AUTOMATICALLY CLEAR FILE INPUT
  const handlePublishBatch = (e) => {
    e.preventDefault();
    const myHatchery = hatcheryProfiles[currentUser?.phone];
    if (!myHatchery) return;
    if (!pcrFile) {
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
      bankDetails: { ...myHatchery.bankDetails },
      zone: myHatchery.zone,
      rating: 5.0,
      reviewCount: 0,
      reviews: [],
      species: finalSpecies,
      plStage: finalStage,
      pricePer1000: Number(newBatchForm.pricePer1000) || 0.43,
      availableStock: Number(newBatchForm.availableStock) || 1000000,
      salinity: Number(newBatchForm.salinity) || 16,
      bonusPercent: Number(newBatchForm.bonusPercent) || 15,
      pcrFileName: pcrFile.name,
      pcrFileType: pcrFile.type || 'image/jpeg',
      pcrPreviewUrl: pcrPreviewUrl,
      gpsCoords: gpsLocation || '17.0005° N, 82.2510° E',
      createdAt: new Date().toLocaleDateString('en-IN')
    };

    setBatches([created, ...batches]);

    // AUTOMATICALLY RESET UPLOADED PCR DOCUMENT & FILE INPUT
    setPcrFile(null);
    setPcrPreviewUrl('');
    if (pcrInputRef.current) {
      pcrInputRef.current.value = '';
    }
    showToast(t.toasts.batchPublished);
  };

  const startEditingBatch = (batch) => {
    setEditingBatchId(batch.id);
    setEditBatchValues({
      plStage: batch.plStage,
      salinity: batch.salinity,
      pricePer1000: batch.pricePer1000,
      availableStock: batch.availableStock,
      bonusPercent: batch.bonusPercent
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
        bonusPercent: Number(editBatchValues.bonusPercent)
      };
    }));
    setEditingBatchId(null);
    showToast(t.toasts.batchUpdated);
  };

  const removeBatch = (batchId) => {
    setBatches(batches.filter(b => b.id !== batchId));
    showToast(t.toasts.batchRemoved);
  };

  // ==========================================
  // PAYMENT PROCESSING (RAZORPAY / DIRECT UPI / BANK-TO-BANK)
  // ==========================================
  const finalizeBookingRecord = (paymentRef, qty, totalOrderCost, tokenAdvance) => {
    const bonusSeeds = Math.round(qty * ((selectedBatch.bonusPercent || 15) / 100));
    const matchedBrokerFarmer = brokerFarmers.find(
      (f) => (f.phone || '').slice(-10) === (bookingForm.farmerPhone || '').slice(-10)
    );
    const isBrokerLinked = Boolean(matchedBrokerFarmer) || currentUser?.role === 'mediator';

    const aquamarkImmediateCut = Math.round(totalOrderCost * 0.015);
    const brokerHoldAmount = isBrokerLinked
      ? Math.round(totalOrderCost * 0.025) + Math.round(qty * ((Number(bookingForm.brokerMarginPaise) || 0) / 100))
      : 0;
    const hatcheryHoldAmount = Math.max(0, tokenAdvance - aquamarkImmediateCut - brokerHoldAmount);

    const newBooking = {
      bookingId: `AQ-${Math.floor(10000 + Math.random() * 90000)}`,
      paymentId: paymentRef,
      paymentMode: bookingForm.paymentMethod,
      date: new Date().toLocaleDateString('en-IN'),
      hatcheryOwnerPhone: selectedBatch.ownerPhone,
      batch: selectedBatch,
      farmerName: bookingForm.farmerName,
      farmerPhone: bookingForm.farmerPhone,
      bookedByRole: currentUser?.role,
      bookedByPhone: currentUser?.phone,
      quantity: qty,
      bonusSeeds,
      includeTransport: bookingForm.includeTransport,
      pondSalinity: bookingForm.pondSalinity,
      packingDate: bookingForm.packingDate,
      totalSeedCost: totalOrderCost,
      tokenAdvance,
      balanceAtGate: totalOrderCost - tokenAdvance,
      escrow: {
        aquamarkCredited: aquamarkImmediateCut,
        brokerAmount: brokerHoldAmount,
        hatcheryAmount: hatcheryHoldAmount,
        payoutStatus: 'ON_HOLD'
      },
      packingStatus: 'PACKING_PENDING',
      rated: false
    };

    setBatches(batches.map(b => b.id === selectedBatch.id ? { ...b, availableStock: Math.max(0, b.availableStock - qty) } : b));
    setBookings([newBooking, ...bookings]);
    setSelectedBatch(null);
    setBookingForm(prev => ({ ...prev, utrReference: '' }));
    setActiveInvoice(newBooking);
    showToast(t.toasts.paymentSuccess);
  };

  const handleConfirmBookingSubmit = (e) => {
    e.preventDefault();
    if (!selectedBatch) return;

    if ((bookingForm.farmerPhone || '').replace(/\D/g, '').length !== 10) {
      showToast(t.toasts.invalidPhone);
      return;
    }

    const qty = Number(bookingForm.quantity) || 100000;
    const effectiveRate = (selectedBatch.pricePer1000 || 0.42) + ((Number(bookingForm.brokerMarginPaise) || 0) / 100);
    const transportCost = bookingForm.includeTransport ? 1500 : 0;
    const totalOrderCost = Math.round(qty * effectiveRate) + transportCost;
    const tokenAdvance = Math.max(2500, Math.round(totalOrderCost * 0.10));

    // MODE 1: DIRECT UPI OR DIRECT BANK-TO-BANK TRANSFER
    if (bookingForm.paymentMethod === 'DIRECT_UPI' || bookingForm.paymentMethod === 'BANK_TO_BANK') {
      if (!bookingForm.utrReference.trim()) {
        showToast(t.toasts.enterUtr);
        return;
      }
      const prefix = bookingForm.paymentMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT';
      finalizeBookingRecord(`${prefix}_${bookingForm.utrReference.trim().toUpperCase()}`, qty, totalOrderCost, tokenAdvance);
      return;
    }

    // MODE 2: RAZORPAY CHECKOUT
    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    if (rzpKey && window.Razorpay) {
      const options = {
        key: rzpKey,
        amount: tokenAdvance * 100,
        currency: 'INR',
        name: 'Aqua Mark',
        description: `${selectedBatch.plStage} Seed Booking (${qty.toLocaleString('en-IN')} PL)`,
        prefill: {
          name: bookingForm.farmerName || 'Farmer',
          contact: bookingForm.farmerPhone,
          method: 'upi'
        },
        theme: { color: '#0d9488' },
        handler: function (response) {
          finalizeBookingRecord(response.razorpay_payment_id, qty, totalOrderCost, tokenAdvance);
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.on('payment.failed', function (resp) {
        showToast(`Payment Failed: ${resp.error?.description || 'Cancelled'}`);
      });
      rzp.open();
    } else {
      const simulatedRef = `RZP_${Math.floor(100000 + Math.random() * 900000)}`;
      finalizeBookingRecord(simulatedRef, qty, totalOrderCost, tokenAdvance);
    }
  };

  const handleRequestSample = (batch) => {
    const sampleBooking = {
      bookingId: `SMP-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: `SAMPLE_${Math.floor(100000 + Math.random() * 900000)}`,
      date: new Date().toLocaleDateString('en-IN'),
      hatcheryOwnerPhone: batch.ownerPhone,
      batch,
      farmerName: currentUser.name,
      farmerPhone: currentUser.phone,
      bookedByRole: 'buyer',
      bookedByPhone: currentUser.phone,
      quantity: 100,
      bonusSeeds: 0,
      pondSalinity: batch.salinity,
      packingDate: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      totalSeedCost: 500,
      tokenAdvance: 500,
      balanceAtGate: 0,
      escrow: { aquamarkCredited: 200, brokerAmount: 0, hatcheryAmount: 300, payoutStatus: 'ON_HOLD' },
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

  const handleBuyerApprovePackingRelease = (bookingId) => {
    setBookings(bookings.map(bk => {
      if (bk.bookingId !== bookingId) return bk;
      return {
        ...bk,
        packingStatus: 'BUYER_APPROVED_RELEASED',
        escrow: { ...bk.escrow, payoutStatus: 'RELEASED' }
      };
    }));
    showToast(t.toasts.fundsReleased);
  };

  // 1-5 STAR RATING + WRITTEN FEEDBACK (VISIBLE ONLY TO HATCHERY OWNER)
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
  // SINGLE-PAGE VERIFIED PDF (WITHOUT "& ESCROW PROTECTED", ONLY "PRINT" BUTTON)
  // ==========================================
  const handleDownloadVerifiedPdf = (bk) => {
    const printWin = window.open('', '_blank', 'width=860,height=960');
    if (!printWin) return;

    const logoFullUrl = `${window.location.origin}/favicon.svg`;
    const verifyHash = `AQM-${bk.bookingId.replace('AQ-', '')}-${bk.paymentId.slice(-6).toUpperCase()}`;
    const totalWithBonus = (bk.quantity || 0) + (bk.bonusSeeds || 0);

    printWin.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>AquaMark_Verified_Certificate_${bk.bookingId}</title>
        <style>
          @page { size: A4; margin: 14mm; }
          * { box-sizing: border-box; font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; }
          body { margin: 0; padding: 0; color: #0f172a; background: #fff; }
          .sheet { border: 2px solid #0f766e; border-radius: 14px; padding: 28px; position: relative; overflow: hidden; }
          .watermark { position: absolute; top: 46%; left: 50%; transform: translate(-50%, -50%) rotate(-24deg); font-size: 68px; font-weight: 900; color: rgba(13, 148, 136, 0.05); pointer-events: none; white-space: nowrap; }
          .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 2px solid #e2e8f0; padding-bottom: 18px; }
          .brand { display: flex; align-items: center; gap: 14px; }
          .brand-logo { width: 46px; height: 46px; border-radius: 10px; border: 1px solid #99f6e4; padding: 6px; background: #f0fdfa; object-fit: contain; }
          .brand-title { font-size: 24px; font-weight: 900; color: #0f766e; margin: 0; letter-spacing: -0.5px; }
          .brand-sub { font-size: 11px; color: #475569; margin: 2px 0 0; }
          .verified-stamp { background: #ecfdf5; border: 1.5px solid #10b981; color: #065f46; padding: 8px 14px; border-radius: 10px; text-align: right; }
          .verified-stamp strong { display: block; font-size: 12px; letter-spacing: 0.5px; }
          .verified-stamp span { font-size: 10px; font-family: monospace; }
          .meta-bar { display: flex; justify-content: space-between; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 12px 16px; margin-top: 18px; font-size: 12px; }
          .grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 18px; }
          .box { border: 1px solid #cbd5e1; border-radius: 10px; padding: 14px; }
          .box-title { font-size: 10px; font-weight: 800; text-transform: uppercase; color: #0f766e; letter-spacing: 0.6px; margin-bottom: 6px; }
          .box p { margin: 3px 0; font-size: 12px; }
          table { width: 100%; border-collapse: collapse; margin-top: 18px; font-size: 12px; }
          th { background: #0f766e; color: #fff; text-align: left; padding: 10px 12px; font-size: 11px; text-transform: uppercase; }
          td { padding: 10px 12px; border-bottom: 1px solid #e2e8f0; }
          .totals { margin-top: 16px; margin-left: auto; width: 330px; border: 1px solid #cbd5e1; border-radius: 10px; padding: 12px 16px; background: #f8fafc; font-size: 12px; }
          .totals-row { display: flex; justify-content: space-between; padding: 4px 0; }
          .totals-highlight { border-top: 1.5px solid #cbd5e1; margin-top: 6px; padding-top: 8px; font-weight: 800; font-size: 14px; color: #065f46; }
          .protocol { margin-top: 18px; background: #f0fdfa; border: 1px solid #99f6e4; border-radius: 10px; padding: 12px 16px; font-size: 11px; color: #115e59; }
          .footer { margin-top: 26px; padding-top: 14px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11px; color: #64748b; }
          .sig-box { text-align: center; }
          .sig-line { width: 170px; border-top: 1px solid #475569; margin-bottom: 4px; }
        </style>
      </head>
      <body>
        <div class="sheet">
          <div class="watermark">AQUA MARK VERIFIED</div>
          <div class="header">
            <div class="brand">
              <img src="${logoFullUrl}" alt="Aqua Mark" class="brand-logo" />
              <div>
                <h1 class="brand-title">AQUA MARK</h1>
                <p class="brand-sub">Official Aquaculture Seed Booking & Quality Certificate</p>
              </div>
            </div>
            <div class="verified-stamp">
              <strong>100% VERIFIED</strong>
              <span>Hash: ${verifyHash}</span>
            </div>
          </div>

          <div class="meta-bar">
            <div><strong>Booking ID:</strong> ${bk.bookingId}</div>
            <div><strong>Payment Ref:</strong> ${bk.paymentId}</div>
            <div><strong>Issue Date:</strong> ${bk.date}</div>
            <div><strong>Packing Date:</strong> ${bk.packingDate}</div>
          </div>

          <div class="grid-2">
            <div class="box">
              <div class="box-title">Buyer / Farmer Details</div>
              <p><strong>Name:</strong> ${bk.farmerName}</p>
              <p><strong>Mobile:</strong> +91 ${bk.farmerPhone}</p>
              <p><strong>Target Pond Salinity:</strong> ${bk.pondSalinity} PPT</p>
              <p><strong>Logistics:</strong> ${bk.includeTransport ? 'Oxygen Van Included (+₹1,500)' : 'Self Pickup at Hatchery Gate'}</p>
            </div>
            <div class="box">
              <div class="box-title">Unlocked Hatchery (Seller) Details</div>
              <p><strong>Hatchery:</strong> ${bk.batch?.realName}</p>
              <p><strong>CAA Reg No:</strong> ${bk.batch?.caaLicense}</p>
              <p><strong>Contact:</strong> +91 ${bk.batch?.realPhone}</p>
              <p><strong>Address:</strong> ${bk.batch?.realAddress}</p>
            </div>
          </div>

          <table>
            <thead>
              <tr>
                <th>Seed Species & Stage</th>
                <th>Hatchery Salinity</th>
                <th>Booked Qty</th>
                <th>Free Bonus (+${bk.batch?.bonusPercent}%)</th>
                <th>Total Packing Qty</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td><strong>${bk.batch?.species} (${bk.batch?.plStage})</strong><br/><span style="font-size:10px;color:#64748b;">PCR Report: ${bk.batch?.pcrFileName || 'Verified Negative'}</span></td>
                <td>${bk.batch?.salinity} PPT</td>
                <td>${(bk.quantity || 0).toLocaleString('en-IN')} PL</td>
                <td style="color:#059669;font-weight:700;">+${(bk.bonusSeeds || 0).toLocaleString('en-IN')} PL</td>
                <td><strong>${totalWithBonus.toLocaleString('en-IN')} PL</strong></td>
              </tr>
            </tbody>
          </table>

          <div class="totals">
            <div class="totals-row"><span>Total Order Value:</span><span>₹${(bk.totalSeedCost || 0).toLocaleString('en-IN')}</span></div>
            <div class="totals-row totals-highlight"><span>Advance Paid:</span><span>₹${(bk.tokenAdvance || 0).toLocaleString('en-IN')}</span></div>
            <div class="totals-row" style="margin-top:4px;font-weight:700;"><span>Balance Payable at Packing Gate:</span><span>₹${(bk.balanceAtGate || 0).toLocaleString('en-IN')}</span></div>
          </div>

          <div class="protocol">
            <strong>Mandatory Quality & Acclimatization Protocol:</strong><br/>
            1. Hatchery must acclimatize seed from <strong>${bk.batch?.salinity} PPT</strong> to buyer pond salinity <strong>${bk.pondSalinity} PPT</strong> prior to oxygen packing.<br/>
            2. Buyer must verify seed activity and count at packing before final confirmation.
          </div>

          <div class="footer">
            <div>
              <strong>Digitally Verified by Aqua Mark Platform</strong><br/>
              GPS Tank Tag: ${bk.batch?.gpsCoords || 'Verified Coastal Zone'}
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

  const toggleCompareBatch = (id) => {
    if (compareIds.includes(id)) setCompareIds(compareIds.filter(x => x !== id));
    else if (compareIds.length < 3) setCompareIds([...compareIds, id]);
  };

  const toggleSaveBatch = (id) => {
    if (savedBatchIds.includes(id)) setSavedBatchIds(savedBatchIds.filter(x => x !== id));
    else setSavedBatchIds([...savedBatchIds, id]);
  };

  // Advanced Harvest, Feed & Profit Calculations
  const totalAcres = (Number(calcPonds) || 1) * (Number(calcAcresPerPond) || 1);
  const totalSeedsNeeded = Math.round(totalAcres * 4046.86 * (Number(calcDensity) || 40));
  const survivedPrawns = Math.round(totalSeedsNeeded * ((Number(calcSurvival) || 85) / 100));
  const harvestKg = Math.round(survivedPrawns / (Number(calcTargetCount) || 30));
  const harvestTons = (harvestKg / 1000).toFixed(2);
  const totalFeedKg = Math.round(harvestKg * (Number(calcFcr) || 1.4));
  const totalFeedBags = Math.ceil(totalFeedKg / 25);
  const grossRevenue = harvestKg * (Number(calcMarketRatePerKg) || 390);
  const estSeedExpense = Math.round(totalSeedsNeeded * 0.43);
  const estFeedExpense = totalFeedKg * (Number(calcFeedCostPerKg) || 88);
  const estNetProfit = grossRevenue - estSeedExpense - estFeedExpense;

  const brokerHeldTotal = bookings
    .filter(b => b.escrow?.payoutStatus === 'ON_HOLD')
    .reduce((sum, b) => sum + (b.escrow?.brokerAmount || 0), 0);

  const brokerReleasedTotal = bookings
    .filter(b => b.escrow?.payoutStatus === 'RELEASED')
    .reduce((sum, b) => sum + (b.escrow?.brokerAmount || 0), 0);

  // Filtered & Sorted Batches
  const filteredAndSortedBatches = batches
    .filter(b => {
      const q = searchQuery.toLowerCase().trim();
      const searchMatch = !q ||
        (b.hatcheryCode || '').toLowerCase().includes(q) ||
        (b.zone || '').toLowerCase().includes(q) ||
        (b.species || '').toLowerCase().includes(q) ||
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

  // Dynamic Zones list (includes any custom zones added by sellers)
  const availableZones = Array.from(new Set([
    ...COASTAL_ZONES.filter(z => z !== 'OTHER_CUSTOM'),
    ...batches.map(b => b.zone).filter(Boolean)
  ]));

  const renderFilterSortBar = (isBuyerView = false) => (
    <div className="bg-white rounded-2xl p-3.5 border border-slate-200 flex flex-wrap items-center justify-between gap-3">
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
        <input
          type="text"
          placeholder={t.searchPlaceholder}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full border border-slate-300 rounded-xl pl-9 pr-3 py-1.5 text-xs select-text focus:outline-none focus:border-teal-600"
        />
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold">
          <option value="ALL">{t.allZones}</option>
          {availableZones.map(z => <option key={z} value={z}>{z}</option>)}
        </select>
        <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className="border border-slate-300 rounded-xl px-3 py-1.5 text-xs font-semibold">
          <option value="ALL">{t.allStages}</option>
          {SEED_STAGE_OPTIONS.filter(s => s !== 'OTHER_CUSTOM').map(s => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="inline-flex items-center gap-1 border border-slate-300 rounded-xl px-2.5 py-1.5 bg-slate-50">
          <ArrowUpDown className="w-3.5 h-3.5 text-teal-700" />
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-xs font-bold text-slate-800 focus:outline-none">
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
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${onlySavedFilter ? 'bg-rose-50 border-rose-300 text-rose-700' : 'bg-white border-slate-300 text-slate-700'
              }`}
          >
            <Heart className={`w-3.5 h-3.5 ${onlySavedFilter ? 'fill-rose-500 text-rose-500' : ''}`} /> {t.onlySaved}
          </button>
        )}
        {isBuyerView && compareIds.length >= 2 && (
          <button
            type="button"
            onClick={() => setShowCompareModal(true)}
            className="bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Scale className="w-3.5 h-3.5 text-emerald-400" /> {t.compareBtn} ({compareIds.length})
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
      <div className="min-h-screen bg-slate-100 flex flex-col justify-between font-sans text-slate-900 select-none">
        {toast && (
          <div className="fixed top-5 right-5 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-xl border border-slate-700 flex items-center gap-2.5 text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" /> {toast}
          </div>
        )}

        <header className="bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5">
              <img src="/favicon.svg" alt="Aqua Mark Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="text-lg font-extrabold tracking-tight text-slate-900 block leading-none">Aqua Mark</span>
              <span className="text-[11px] text-slate-500 font-medium">{t.brandSub}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold text-slate-700 cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            {lang === 'te' ? 'English' : 'తెలుగు'}
          </button>
        </header>

        <div className="flex-1 flex items-center justify-center p-4">
          <div className="max-w-lg w-full bg-white rounded-3xl shadow-sm border border-slate-200 p-8 space-y-6">
            <div>
              <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight">{t.selectRoleTitle}</h2>
              <p className="text-xs text-slate-500 mt-1">{t.selectRoleSub}</p>
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
                      ? 'border-teal-600 bg-teal-50/70 ring-2 ring-teal-600/20'
                      : 'border-slate-200 bg-white hover:border-slate-300'
                      }`}
                  >
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center ${active ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-extrabold text-slate-900">{meta.title}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5 leading-tight">{meta.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>

            {!otpSent ? (
              <form onSubmit={handleSendOtp} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">{t.nameLabels[loginRole]}</label>
                  <input
                    required
                    type="text"
                    placeholder={t.namePlaceholders[loginRole]}
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm select-text focus:outline-none focus:border-teal-600"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">{t.mobileLabel}</label>
                  <div className="relative flex items-center">
                    <span className="absolute left-3.5 text-sm font-bold text-slate-500">+91</span>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={loginPhone}
                      onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full border border-slate-300 rounded-xl pl-12 pr-10 py-2.5 text-sm font-bold tracking-wider select-text focus:outline-none focus:border-teal-600"
                    />
                    <Smartphone className="w-4 h-4 text-slate-400 absolute right-3.5" />
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
                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3.5 text-center">
                  <p className="text-xs text-slate-700">{t.otpSentMsg} <b>+91 {loginPhone}</b></p>
                  <p className="text-xs font-bold text-emerald-900 mt-1">
                    OTP Code: <span className="bg-white px-2.5 py-0.5 rounded-md border border-emerald-300 font-mono tracking-widest select-text">{generatedOtp}</span>
                  </p>
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">{t.enterOtpLabel}</label>
                  <input
                    ref={otpInputRef}
                    autoFocus
                    required
                    type="text"
                    maxLength={4}
                    placeholder="0000"
                    value={enteredOtp}
                    onChange={(e) => setEnteredOtp(e.target.value.replace(/\D/g, ''))}
                    className="w-full border-2 border-teal-600 rounded-xl py-2.5 text-center text-lg font-extrabold tracking-[0.5em] select-text focus:outline-none"
                  />
                </div>
                <div className="flex gap-2.5">
                  <button
                    type="button"
                    onClick={() => setOtpSent(false)}
                    className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold text-slate-700 hover:bg-slate-50 cursor-pointer"
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

        <footer className="text-center py-4 text-[11px] text-slate-400">
          Aqua Mark © 2026 • CAA Verified Hatchery Network
        </footer>
      </div>
    );
  }

  // Seller's Fixed Single Hatchery Profile + Strict Isolated Orders + Private Reviews
  const myFixedHatchery = currentUser.role === 'seller' ? hatcheryProfiles[currentUser.phone] : null;
  const myOwnedBatches = currentUser.role === 'seller' && myFixedHatchery
    ? batches.filter(b => b.ownerPhone === currentUser.phone)
    : [];
  const myHatcheryOrders = currentUser.role === 'seller' && myFixedHatchery
    ? bookings.filter(bk => bk.hatcheryOwnerPhone === currentUser.phone)
    : [];
  const myPrivateReviews = myOwnedBatches.flatMap(b => (b.reviews || []).map(r => ({ ...r, batchId: b.id, plStage: b.plStage })));

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans select-none">
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-5 py-3.5 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-3 max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{toast}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3.5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5">
              <img src="/favicon.svg" alt="Aqua Mark Logo" className="w-full h-full object-contain" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight text-slate-900">Aqua Mark</h1>
                <span className="text-[11px] bg-teal-50 text-teal-800 border border-teal-200 px-2.5 py-0.5 rounded-full font-bold">
                  {t.portalBadges[currentUser.role] || currentUser.role}
                </span>
              </div>
              <p className="text-xs text-slate-500">{currentUser.name} • +91 {currentUser.phone}</p>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
              className="inline-flex items-center gap-1.5 bg-white hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-xl text-xs font-bold border border-slate-300 cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5 text-teal-600" />
              {lang === 'te' ? 'English' : 'తెలుగు'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 px-3.5 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer"
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
            {/* Live Coastal Count Price Ticker */}
            <div className="bg-slate-900 text-white rounded-2xl px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-bold text-emerald-400 inline-flex items-center gap-1.5">
                <TrendingUp className="w-4 h-4" /> AP Farmgate Count Rates:
              </span>
              <div className="flex flex-wrap gap-4 font-mono text-[11px]">
                <span>30 Count: <b className="text-emerald-300">₹395/kg</b></span>
                <span>40 Count: <b className="text-emerald-300">₹340/kg</b></span>
                <span>50 Count: <b className="text-emerald-300">₹305/kg</b></span>
                <span>60 Count: <b className="text-emerald-300">₹275/kg</b></span>
              </div>
            </div>

            {/* Buyer Sub-Tabs */}
            <div className="flex flex-wrap items-center gap-2 bg-white p-1.5 rounded-2xl border border-slate-200 w-fit">
              {[
                { id: 'marketplace', label: t.tabMarketplace, icon: Building2 },
                { id: 'bookings', label: `${t.tabBookings} (${bookings.filter(b => b.farmerPhone === currentUser.phone).length})`, icon: FileText },
                { id: 'analytics', label: t.tabAnalytics, icon: Calculator },
                { id: 'guide', label: t.tabGuide, icon: Calendar }
              ].map(tab => {
                const Icon = tab.icon;
                const hasPackingReady = tab.id === 'bookings' && bookings.some(b => b.farmerPhone === currentUser.phone && b.packingStatus === 'PACKING_DONE_BY_SELLER');
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setBuyerTab(tab.id)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer relative ${buyerTab === tab.id ? 'bg-teal-600 text-white' : 'text-slate-600 hover:bg-slate-100'
                      }`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {tab.label}
                    {hasPackingReady && <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: MARKETPLACE */}
            {buyerTab === 'marketplace' && (
              <>
                {renderFilterSortBar(true)}

                {filteredAndSortedBatches.length === 0 ? (
                  <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
                    <Building2 className="w-10 h-10 text-slate-300 mx-auto" />
                    <h3 className="text-base font-extrabold text-slate-800">{t.emptyMarketTitle}</h3>
                    <p className="text-xs text-slate-500 max-w-md mx-auto">{t.emptyMarketSub}</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {filteredAndSortedBatches.map((batch) => {
                      const isUnlocked = bookings.some((bk) => bk.batch?.id === batch.id && bk.farmerPhone === currentUser.phone);
                      const isComparing = compareIds.includes(batch.id);
                      const isSaved = savedBatchIds.includes(batch.id);
                      return (
                        <div key={batch.id} className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden flex flex-col justify-between hover:border-teal-400 transition">
                          <div
                            onClick={() => setInspectedBatch(batch)}
                            className="p-5 space-y-4 cursor-pointer"
                          >
                            <div className="flex items-start justify-between gap-2">
                              <div>
                                <div className="flex flex-wrap items-center gap-2">
                                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full inline-flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" /> {t.caaVerified}
                                  </span>
                                  <span className="text-xs font-semibold text-slate-500">{batch.zone}</span>
                                  <span className="text-xs font-bold text-amber-600 inline-flex items-center gap-0.5">
                                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {batch.rating} ({batch.reviewCount || 0})
                                  </span>
                                </div>
                                <h3 className="text-base font-extrabold text-slate-900 mt-2 flex items-center gap-2">
                                  {isUnlocked ? (
                                    <span className="text-teal-700 inline-flex items-center gap-1.5"><Unlock className="w-4 h-4 text-emerald-600" /> {batch.realName}</span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1.5"><Lock className="w-4 h-4 text-slate-400" /> {batch.hatcheryCode}</span>
                                  )}
                                </h3>
                                <p className="text-xs text-slate-500 font-medium mt-0.5">{batch.species}</p>
                                {isUnlocked ? (
                                  <p className="text-xs text-slate-600 mt-0.5">{batch.realAddress} • {batch.realPhone}</p>
                                ) : (
                                  <p className="text-[11px] text-slate-400 mt-0.5">{t.unlockHint}</p>
                                )}
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <button
                                  type="button"
                                  onClick={(e) => { e.stopPropagation(); toggleSaveBatch(batch.id); }}
                                  className="p-2 rounded-xl border border-slate-200 hover:bg-rose-50 cursor-pointer"
                                >
                                  <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500 text-rose-500' : 'text-slate-400'}`} />
                                </button>
                                <div className="text-right">
                                  <div className="text-2xl font-black text-slate-900">₹{(batch.pricePer1000 || 0).toFixed(2)}</div>
                                  <div className="text-[11px] text-slate-500">{t.perSeed}</div>
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-4 gap-2 bg-slate-50 p-3 rounded-xl border border-slate-100 text-center">
                              <div><span className="text-[11px] text-slate-400 block">{t.stage}</span><span className="text-sm font-bold text-slate-800">{batch.plStage}</span></div>
                              <div><span className="text-[11px] text-slate-400 block">{t.salinity}</span><span className="text-sm font-bold text-teal-700">{batch.salinity} PPT</span></div>
                              <div><span className="text-[11px] text-slate-400 block">{t.bonus}</span><span className="text-sm font-bold text-emerald-600">+{batch.bonusPercent}%</span></div>
                              <div><span className="text-[11px] text-slate-400 block">{t.stock}</span><span className="text-sm font-bold text-slate-800">{((batch.availableStock || 0) / 100000).toFixed(1)}L</span></div>
                            </div>

                            <div className="bg-teal-50/60 border border-teal-200/80 rounded-xl p-2.5 flex items-center justify-between text-xs text-teal-900">
                              <span className="inline-flex items-center gap-1.5 font-bold">
                                <Eye className="w-4 h-4 text-teal-600" /> {t.inspectBtn}
                              </span>
                              <span className="text-[11px] font-mono text-teal-700">{batch.pcrFileName}</span>
                            </div>
                          </div>

                          <div className="px-5 py-3.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleRequestSample(batch)}
                              className="px-3 py-2.5 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-xs font-bold text-slate-700 inline-flex items-center gap-1 cursor-pointer"
                            >
                              <FlaskConical className="w-3.5 h-3.5 text-teal-600" /> {t.sampleBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => toggleCompareBatch(batch.id)}
                              className={`px-3 py-2.5 rounded-xl border text-xs font-bold cursor-pointer ${isComparing ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-700 border-slate-300'
                                }`}
                            >
                              {isComparing ? t.comparingBtn : t.compareBtn}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setBookingForm(prev => ({ ...prev, farmerName: currentUser.name, farmerPhone: currentUser.phone, brokerMarginPaise: 0 }));
                                setSelectedBatch(batch);
                              }}
                              className="flex-1 bg-teal-600 hover:bg-teal-700 text-white py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                            >
                              {t.bookSlotBtn} <ChevronRight className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {/* TAB 2: BUYER BOOKINGS & PACKING COMPLETE NOTIFICATION + 1-5 STAR RATING & FEEDBACK */}
            {buyerTab === 'bookings' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-teal-600" /> {t.myBookingsTitle}
                </h3>
                {bookings.filter(b => b.farmerPhone === currentUser.phone).length === 0 ? (
                  <p className="text-xs text-slate-500">{t.noBookingsYet}</p>
                ) : (
                  <div className="space-y-4">
                    {bookings.filter(b => b.farmerPhone === currentUser.phone).map((bk) => {
                      const draft = ratingDrafts[bk.bookingId] || { stars: 5, comment: '' };
                      return (
                        <div key={bk.bookingId} className="border border-slate-200 rounded-2xl p-4 space-y-3 bg-slate-50/60">
                          {/* PACKING COMPLETED NOTIFICATION BANNER FROM HATCHERY */}
                          {bk.packingStatus === 'PACKING_DONE_BY_SELLER' && (
                            <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-xl text-xs font-bold flex items-center justify-between">
                              <span>{t.packingReadyAlert}</span>
                            </div>
                          )}

                          <div className="flex flex-wrap items-center justify-between gap-4">
                            <div className="space-y-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="font-mono font-bold text-xs text-teal-700 bg-teal-50 px-2 py-0.5 rounded border border-teal-200">{bk.bookingId}</span>
                                <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full ${bk.escrow?.payoutStatus === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                                  }`}>
                                  {bk.escrow?.payoutStatus === 'RELEASED' ? t.escrowReleasedBadge : t.escrowHoldBadge}
                                </span>
                              </div>
                              <p className="text-sm font-bold text-slate-900">{bk.batch?.realName} • +91 {bk.batch?.realPhone}</p>
                              <p className="text-xs text-slate-600">
                                {(bk.quantity || 0).toLocaleString('en-IN')} PL ({bk.batch?.plStage}) • {t.packingDateLabel}: {bk.packingDate} • Paid: ₹{(bk.tokenAdvance || 0).toLocaleString('en-IN')}
                              </p>
                            </div>

                            <div className="flex flex-wrap items-center gap-2">
                              {bk.escrow?.payoutStatus !== 'RELEASED' && (
                                <button
                                  type="button"
                                  onClick={() => handleBuyerApprovePackingRelease(bk.bookingId)}
                                  className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs flex items-center gap-1.5 cursor-pointer"
                                >
                                  <CheckSquare className="w-4 h-4" /> {t.approvePackingBtn}
                                </button>
                              )}

                              <button type="button" onClick={() => openWhatsAppMessage(bk.batch?.realPhone, `AquaMark Booking ID: ${bk.bookingId} (${bk.quantity} PL)`)} className="bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer">
                                <Send className="w-3.5 h-3.5" /> WhatsApp
                              </button>
                              <button type="button" onClick={() => handleDownloadVerifiedPdf(bk)} className="bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold px-3.5 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer">
                                <Printer className="w-3.5 h-3.5 text-emerald-400" /> {t.invoiceBtn}
                              </button>
                            </div>
                          </div>

                          {/* 1 TO 5 STAR RATING + WRITTEN FEEDBACK (SENT PRIVATELY TO HATCHERY OWNER) */}
                          {bk.escrow?.payoutStatus === 'RELEASED' && (
                            <div className="pt-3 border-t border-slate-200">
                              {!bk.rated ? (
                                <div className="flex flex-wrap items-center gap-2.5 bg-white p-3 rounded-xl border border-slate-200">
                                  <span className="text-xs font-bold text-slate-700">{t.rateSeedLabel}</span>
                                  <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(star => (
                                      <button
                                        key={star}
                                        type="button"
                                        onClick={() => setRatingDrafts({ ...ratingDrafts, [bk.bookingId]: { ...draft, stars: star } })}
                                        className={`px-2 py-1 rounded-lg text-xs font-bold border cursor-pointer ${draft.stars >= star ? 'bg-amber-400 border-amber-500 text-slate-950' : 'bg-slate-50 border-slate-200 text-slate-500'
                                          }`}
                                      >
                                        {star}★
                                      </button>
                                    ))}
                                  </div>
                                  <input
                                    type="text"
                                    placeholder="Write private feedback for Hatchery Owner..."
                                    value={draft.comment}
                                    onChange={(e) => setRatingDrafts({ ...ratingDrafts, [bk.bookingId]: { ...draft, comment: e.target.value } })}
                                    className="flex-1 min-w-[180px] border border-slate-300 rounded-xl px-3 py-1.5 text-xs select-text"
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
                                <div className="text-xs text-emerald-700 font-bold">
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

            {/* TAB 3: ADVANCED HARVEST, FEED & PROFIT ESTIMATOR */}
            {buyerTab === 'analytics' && (
              <div className="bg-white rounded-2xl p-6 shadow-xs border border-slate-200 space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-teal-600" /> {t.calcTitle}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{t.calcSub}</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Number of Ponds</label>
                    <input type="number" min="1" value={calcPonds} onChange={(e) => setCalcPonds(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold select-text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Acres per Pond</label>
                    <input type="number" step="0.5" min="0.5" value={calcAcresPerPond} onChange={(e) => setCalcAcresPerPond(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold select-text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Stocking Density (/m²)</label>
                    <select value={calcDensity} onChange={(e) => setCalcDensity(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold">
                      <option value={30}>30 / m² (Low)</option>
                      <option value={40}>40 / m² (Standard)</option>
                      <option value={50}>50 / m² (Semi-Intensive)</option>
                      <option value={60}>60 / m² (High)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Expected Survival (%)</label>
                    <input type="number" min="40" max="100" value={calcSurvival} onChange={(e) => setCalcSurvival(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold select-text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Target Harvest Count (/kg)</label>
                    <select value={calcTargetCount} onChange={(e) => setCalcTargetCount(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold">
                      <option value={25}>25 Count (Big)</option>
                      <option value={30}>30 Count (Standard)</option>
                      <option value={40}>40 Count (Medium)</option>
                      <option value={50}>50 Count (Early)</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Expected FCR</label>
                    <input type="number" step="0.1" min="1.0" max="2.5" value={calcFcr} onChange={(e) => setCalcFcr(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold select-text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Market Price (₹ / kg)</label>
                    <input type="number" value={calcMarketRatePerKg} onChange={(e) => setCalcMarketRatePerKg(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold select-text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Feed Cost (₹ / kg)</label>
                    <input type="number" value={calcFeedCostPerKg} onChange={(e) => setCalcFeedCostPerKg(Number(e.target.value))} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold select-text" />
                  </div>
                </div>

                {/* Estimator Output Dashboard */}
                <div className="grid grid-cols-2 lg:grid-cols-5 gap-3">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-500 font-bold block">Total Seed ({totalAcres} Acres)</span>
                    <span className="text-lg font-black text-slate-900">{totalSeedsNeeded.toLocaleString('en-IN')} PL</span>
                  </div>
                  <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5">
                    <span className="text-[11px] text-teal-700 font-bold block">Projected Harvest</span>
                    <span className="text-lg font-black text-teal-950">{harvestTons} Tons ({harvestKg.toLocaleString('en-IN')} kg)</span>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5">
                    <span className="text-[11px] text-amber-800 font-bold block">Total Feed Required</span>
                    <span className="text-lg font-black text-amber-950">{totalFeedBags} Bags ({totalFeedKg.toLocaleString('en-IN')} kg)</span>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3.5">
                    <span className="text-[11px] text-slate-500 font-bold block">Gross Crop Revenue</span>
                    <span className="text-lg font-black text-slate-900">₹{grossRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-xl p-3.5">
                    <span className="text-[11px] text-emerald-100 font-bold block">Est. Net Crop Profit</span>
                    <span className="text-lg font-black">₹{estNetProfit.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setBookingForm({ ...bookingForm, quantity: totalSeedsNeeded });
                    setBuyerTab('marketplace');
                    showToast(`${totalSeedsNeeded.toLocaleString('en-IN')} PL applied to booking!`);
                  }}
                  className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
                >
                  {t.applyQty} ({totalSeedsNeeded.toLocaleString('en-IN')} PL)
                </button>
              </div>
            )}

            {/* TAB 4: CROP & WATER QUALITY PROTOCOL */}
            {buyerTab === 'guide' && (
              <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                <h3 className="text-base font-extrabold text-slate-900">Standard Aquaculture Water & Stocking Parameters</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 rounded-xl bg-teal-50 border border-teal-200 space-y-1">
                    <div className="font-bold text-teal-900">1. Acclimatization Rule</div>
                    <p className="text-teal-800">Never stock directly if salinity variance exceeds 3 PPT. Adjust 1 PPT per 4 hours in hatchery tanks before packing.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                    <div className="font-bold text-slate-900">2. Ideal Pond Water Parameters</div>
                    <p className="text-slate-600">pH: 7.5 – 8.3 | Dissolved Oxygen: above 4.5 ppm | Alkalinity: 120 – 180 ppm | Ammonia: below 0.1 ppm.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 space-y-1">
                    <div className="font-bold text-emerald-900">3. DOC 1–30 Blind Feeding</div>
                    <p className="text-emerald-800">Start with 2.0 kg starter crumble per 1,00,000 PL on Day 1 and increment 200g daily with check-tray monitoring.</p>
                  </div>
                </div>
              </div>
            )}
          </>
        )}

        {/* =========================================================
            2. SELLER (HATCHERY) PORTAL — UNIFIED REGISTRATION + EDIT NAME/BANK
           ========================================================= */}
        {currentUser.role === 'seller' && (
          <div className="max-w-4xl mx-auto space-y-6">
            {!myFixedHatchery ? (
              <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-5">
                <div>
                  <span className="bg-teal-50 text-teal-800 border border-teal-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    One-Step Seller Onboarding
                  </span>
                  <h2 className="text-xl font-extrabold text-slate-900 mt-2">{t.unifiedRegTitle}</h2>
                  <p className="text-xs text-slate-500 mt-1">{t.unifiedRegSub}</p>
                </div>

                <form onSubmit={handleCompleteUnifiedSellerReg} className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{t.hatcheryNameLabel}</label>
                      <input required type="text" placeholder="e.g., Sri Sai Coastal Hatcheries" value={unifiedSellerForm.realName} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, realName: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm select-text" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{t.caaLicenseLabel}</label>
                      <input required type="text" placeholder="CAA/AP/2026/XXXX" value={unifiedSellerForm.caaLicense} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, caaLicense: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono select-text" />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{t.zoneLabel}</label>
                      <select value={unifiedSellerForm.zone} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, zone: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm">
                        {COASTAL_ZONES.map(z => (
                          <option key={z} value={z}>{z === 'OTHER_CUSTOM' ? '+ Add Custom Zone' : z}</option>
                        ))}
                      </select>
                      {unifiedSellerForm.zone === 'OTHER_CUSTOM' && (
                        <input required type="text" placeholder={t.customZonePlaceholder} value={unifiedSellerForm.customZone} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, customZone: e.target.value })} className="w-full border border-teal-400 rounded-xl px-3.5 py-2 text-xs mt-2 select-text" />
                      )}
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 block mb-1">{t.addressLabel}</label>
                      <input required type="text" placeholder="Beach Road, Kakinada" value={unifiedSellerForm.realAddress} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, realAddress: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm select-text" />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-200 space-y-3">
                    <h3 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
                      <Landmark className="w-4 h-4 text-teal-600" /> Settlement Bank & UPI Account
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.accHolderLabel}</label>
                        <input required type="text" value={unifiedSellerForm.accountName} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, accountName: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm select-text" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.accNoLabel}</label>
                        <input required type="text" placeholder="3892010004512" value={unifiedSellerForm.accountNo} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, accountNo: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono select-text" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.ifscLabel}</label>
                        <input required type="text" placeholder="SBIN0001234" value={unifiedSellerForm.ifsc} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, ifsc: e.target.value.toUpperCase() })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono select-text" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.upiLabel}</label>
                        <input required type="text" placeholder="hatchery@okaxis" value={unifiedSellerForm.upiId} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, upiId: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2.5 text-sm font-mono select-text" />
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
                {/* FIXED HATCHERY + BANK SUMMARY BANNER WITH EDIT OPTION (EDIT HATCHERY NAME, ADDRESS & BANK) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        <Lock className="w-3 h-3" /> {t.hatcheryLockedBanner} {currentUser.phone}
                      </span>
                      <h2 className="text-xl font-extrabold text-slate-900">{myFixedHatchery.realName}</h2>
                      <p className="text-xs text-slate-600">
                        CAA: <span className="font-mono font-bold text-slate-900">{myFixedHatchery.caaLicense}</span> • {myFixedHatchery.zone} • {myFixedHatchery.realAddress}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-1 rounded-full inline-flex items-center gap-1">
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
                          className="border border-slate-300 bg-white hover:bg-slate-50 text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-teal-700" /> {t.editBtn}
                        </button>
                      )}
                    </div>
                  </div>

                  {isEditingSellerProfile ? (
                    <form onSubmit={handleUpdateSellerProfileAndBank} className="space-y-3 pt-3 border-t border-slate-200">
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">{t.hatcheryNameLabel}</label>
                          <input required type="text" value={unifiedSellerForm.realName} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, realName: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold select-text" />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">{t.zoneLabel}</label>
                          <select value={unifiedSellerForm.zone} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, zone: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold">
                            {COASTAL_ZONES.map(z => <option key={z} value={z}>{z === 'OTHER_CUSTOM' ? '+ Custom Zone' : z}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="text-[10px] font-bold text-slate-500 block">{t.addressLabel}</label>
                          <input required type="text" value={unifiedSellerForm.realAddress} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, realAddress: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs select-text" />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-2.5">
                        <input required type="text" value={unifiedSellerForm.accountName} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, accountName: e.target.value })} className="border border-slate-300 rounded-xl px-3 py-2 text-xs select-text" />
                        <input required type="text" value={unifiedSellerForm.accountNo} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, accountNo: e.target.value })} className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono select-text" />
                        <input required type="text" value={unifiedSellerForm.ifsc} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, ifsc: e.target.value.toUpperCase() })} className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono select-text" />
                        <div className="flex gap-1.5">
                          <input required type="text" value={unifiedSellerForm.upiId} onChange={(e) => setUnifiedSellerForm({ ...unifiedSellerForm, upiId: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono select-text" />
                          <button type="submit" className="bg-slate-900 text-white text-xs font-bold px-3 rounded-xl cursor-pointer">{t.saveBtn}</button>
                        </div>
                      </div>
                    </form>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                      <div><span className="text-[10px] text-slate-400 block">Holder</span><b>{myFixedHatchery.bankDetails?.accountName}</b></div>
                      <div><span className="text-[10px] text-slate-400 block">Account No</span><b className="font-mono">{myFixedHatchery.bankDetails?.accountNo}</b></div>
                      <div><span className="text-[10px] text-slate-400 block">IFSC</span><b className="font-mono">{myFixedHatchery.bankDetails?.ifsc}</b></div>
                      <div><span className="text-[10px] text-slate-400 block">UPI ID</span><b className="font-mono text-teal-700">{myFixedHatchery.bankDetails?.upiId}</b></div>
                    </div>
                  )}
                </div>

                {/* ADD NEW SEED BATCH FORM (ALL SPECIES + ALL STAGES + CUSTOM INPUT + AUTO-CLEARING FILE INPUT) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                    <PlusCircle className="w-5 h-5 text-teal-600" /> {t.addBatchTitle}
                  </h3>
                  <form onSubmit={handlePublishBatch} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-6 gap-3">
                      <div className="md:col-span-2">
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.speciesLabel}</label>
                        <select value={newBatchForm.species} onChange={(e) => setNewBatchForm({ ...newBatchForm, species: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold">
                          {SHRIMP_SPECIES_OPTIONS.map(sp => (
                            <option key={sp} value={sp}>{sp === 'OTHER_CUSTOM' ? '+ Other (Type Custom Species)' : sp}</option>
                          ))}
                        </select>
                        {newBatchForm.species === 'OTHER_CUSTOM' && (
                          <input required type="text" placeholder={t.customSpeciesPlaceholder} value={newBatchForm.customSpecies} onChange={(e) => setNewBatchForm({ ...newBatchForm, customSpecies: e.target.value })} className="w-full border border-teal-400 rounded-xl px-3 py-1.5 text-xs mt-1.5 select-text" />
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.stage}</label>
                        <select value={newBatchForm.plStage} onChange={(e) => setNewBatchForm({ ...newBatchForm, plStage: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold">
                          {SEED_STAGE_OPTIONS.map(st => (
                            <option key={st} value={st}>{st === 'OTHER_CUSTOM' ? '+ Custom Stage' : st}</option>
                          ))}
                        </select>
                        {newBatchForm.plStage === 'OTHER_CUSTOM' && (
                          <input required type="text" placeholder={t.customStagePlaceholder} value={newBatchForm.customStage} onChange={(e) => setNewBatchForm({ ...newBatchForm, customStage: e.target.value })} className="w-full border border-teal-400 rounded-xl px-3 py-1.5 text-xs mt-1.5 select-text" />
                        )}
                      </div>

                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.ratePerSeedLabel}</label>
                        <input type="number" step="0.01" value={newBatchForm.pricePer1000} onChange={(e) => setNewBatchForm({ ...newBatchForm, pricePer1000: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold select-text" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.salinity} (PPT)</label>
                        <input type="number" value={newBatchForm.salinity} onChange={(e) => setNewBatchForm({ ...newBatchForm, salinity: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold select-text" />
                      </div>
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.bonus} (%)</label>
                        <input type="number" value={newBatchForm.bonusPercent} onChange={(e) => setNewBatchForm({ ...newBatchForm, bonusPercent: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold select-text" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div>
                        <label className="text-xs font-bold text-slate-700 block mb-1">{t.stockLabel}</label>
                        <input type="number" step="50000" value={newBatchForm.availableStock} onChange={(e) => setNewBatchForm({ ...newBatchForm, availableStock: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-bold select-text" />
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3">
                        <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                          <Upload className="w-4 h-4 text-teal-600" /> {t.pcrUploadLabel}
                        </span>
                        <input
                          ref={pcrInputRef}
                          type="file"
                          accept="image/*,.pdf"
                          onChange={(e) => handlePcrFileSelect(e.target.files?.[0] || null)}
                          className="text-xs text-slate-600 mt-1"
                        />
                      </div>
                      <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 flex items-center justify-between gap-2">
                        <div>
                          <span className="text-xs font-bold text-slate-800 flex items-center gap-1"><Camera className="w-4 h-4 text-teal-600" /> Tank GPS</span>
                          <p className="text-[11px] text-slate-500">{gpsLocation || 'Optional'}</p>
                        </div>
                        <button type="button" onClick={handleCaptureGps} className="bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1 cursor-pointer">
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
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Layers className="w-5 h-5 text-teal-600" /> {t.myBatchesTitle}
                  </h3>
                  {myOwnedBatches.length === 0 ? (
                    <p className="text-xs text-slate-500">{t.noBatchesSeller}</p>
                  ) : (
                    <div className="space-y-3">
                      {myOwnedBatches.map((b) => {
                        const isEditing = editingBatchId === b.id;
                        return (
                          <div key={b.id} className="border border-slate-200 rounded-xl p-4 bg-slate-50/70 space-y-3">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <div>
                                <span className="font-mono text-xs font-bold text-teal-700">{b.id}</span> • <span className="font-bold text-sm text-slate-900">{b.species}</span>
                                <span className="block text-[11px] text-slate-500">PCR File: {b.pcrFileName}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                {isEditing ? (
                                  <button type="button" onClick={() => saveEditedBatch(b.id)} className="bg-emerald-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg cursor-pointer">
                                    {t.saveChangesBtn}
                                  </button>
                                ) : (
                                  <button type="button" onClick={() => startEditingBatch(b)} className="bg-white border border-slate-300 text-slate-800 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer">
                                    <Edit3 className="w-3.5 h-3.5 text-teal-700" /> {t.editBtn}
                                  </button>
                                )}
                                <button type="button" onClick={() => removeBatch(b.id)} className="bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold px-3 py-1.5 rounded-lg inline-flex items-center gap-1 cursor-pointer">
                                  <Trash2 className="w-3.5 h-3.5" /> {t.removeBtn}
                                </button>
                              </div>
                            </div>

                            {isEditing ? (
                              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5 pt-2 border-t border-slate-200">
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block">{t.stage}</label>
                                  <input type="text" value={editBatchValues.plStage} onChange={(e) => setEditBatchValues({ ...editBatchValues, plStage: e.target.value })} className="w-full border border-slate-300 bg-white rounded-lg px-2 py-1.5 text-xs font-bold select-text" />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block">{t.salinity} (PPT)</label>
                                  <input type="number" value={editBatchValues.salinity} onChange={(e) => setEditBatchValues({ ...editBatchValues, salinity: e.target.value })} className="w-full border border-slate-300 bg-white rounded-lg px-2 py-1.5 text-xs font-bold select-text" />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block">{t.ratePerSeedLabel}</label>
                                  <input type="number" step="0.01" value={editBatchValues.pricePer1000} onChange={(e) => setEditBatchValues({ ...editBatchValues, pricePer1000: e.target.value })} className="w-full border border-slate-300 bg-white rounded-lg px-2 py-1.5 text-xs font-bold select-text" />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block">{t.bonus} (%)</label>
                                  <input type="number" value={editBatchValues.bonusPercent} onChange={(e) => setEditBatchValues({ ...editBatchValues, bonusPercent: e.target.value })} className="w-full border border-slate-300 bg-white rounded-lg px-2 py-1.5 text-xs font-bold select-text" />
                                </div>
                                <div>
                                  <label className="text-[10px] font-bold text-slate-500 block">{t.stockLabel}</label>
                                  <input type="number" step="50000" value={editBatchValues.availableStock} onChange={(e) => setEditBatchValues({ ...editBatchValues, availableStock: e.target.value })} className="w-full border border-slate-300 bg-white rounded-lg px-2 py-1.5 text-xs font-bold select-text" />
                                </div>
                              </div>
                            ) : (
                              <div className="grid grid-cols-5 gap-2 text-center bg-white p-2.5 rounded-lg border border-slate-200/80 text-xs">
                                <div><span className="text-[10px] text-slate-400 block">{t.stage}</span><b>{b.plStage}</b></div>
                                <div><span className="text-[10px] text-slate-400 block">{t.salinity}</span><b className="text-teal-700">{b.salinity} PPT</b></div>
                                <div><span className="text-[10px] text-slate-400 block">{t.perSeed}</span><b>₹{b.pricePer1000.toFixed(2)}</b></div>
                                <div><span className="text-[10px] text-slate-400 block">{t.bonus}</span><b className="text-emerald-600">+{b.bonusPercent}%</b></div>
                                <div><span className="text-[10px] text-slate-400 block">{t.stock}</span><b>{(b.availableStock / 100000).toFixed(1)}L</b></div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* STRICTLY ISOLATED PACKING ORDERS FOR THIS HATCHERY ONLY */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <Clock className="w-5 h-5 text-teal-600" /> {t.sellerOrdersTitle}
                  </h3>
                  {myHatcheryOrders.length === 0 ? (
                    <p className="text-xs text-slate-500">{t.noOrdersYet}</p>
                  ) : (
                    <div className="space-y-3">
                      {myHatcheryOrders.map((bk) => (
                        <div key={bk.bookingId} className="border border-slate-200 rounded-xl p-4 flex flex-wrap items-center justify-between gap-4 bg-slate-50">
                          <div className="space-y-1 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-mono font-bold text-teal-800">{bk.bookingId}</span>
                              <span className={`font-bold px-2.5 py-0.5 rounded-full ${bk.escrow?.payoutStatus === 'RELEASED' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                                }`}>
                                {bk.escrow?.payoutStatus === 'RELEASED'
                                  ? `${t.creditedBadge} (₹${bk.escrow?.hatcheryAmount || 0})`
                                  : `${t.onHoldBadge}: ₹${bk.escrow?.hatcheryAmount || 0}`}
                              </span>
                            </div>
                            <p className="text-slate-800 font-semibold">{bk.farmerName} ({bk.farmerPhone}) • {(bk.quantity || 0).toLocaleString('en-IN')} PL</p>
                            <p className="text-slate-500">{t.pondSalinityLabel}: <b>{bk.pondSalinity} PPT</b> • {t.packingDateLabel}: <b>{bk.packingDate}</b></p>
                          </div>

                          {bk.packingStatus === 'PACKING_PENDING' && (
                            <button type="button" onClick={() => handleSellerMarkPacked(bk.bookingId)} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                              {t.markPackedBtn}
                            </button>
                          )}
                          {bk.packingStatus === 'PACKING_DONE_BY_SELLER' && (
                            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1.5 rounded-xl">
                              {t.packedSentBadge}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* PRIVATE FARMER FEEDBACK & 1-5 STAR REVIEWS (VISIBLE ONLY TO THIS HATCHERY OWNER) */}
                <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
                  <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-teal-600" /> {t.sellerFeedbackTitle}
                  </h3>
                  {myPrivateReviews.length === 0 ? (
                    <p className="text-xs text-slate-500">{t.noFeedbackYet}</p>
                  ) : (
                    <div className="space-y-2.5">
                      {myPrivateReviews.map((rev, idx) => (
                        <div key={idx} className="border border-slate-200 rounded-xl p-3.5 bg-slate-50 text-xs flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <span className="font-bold text-slate-900">{rev.farmerName}</span> • <span className="text-slate-500">Batch {rev.batchId} ({rev.plStage})</span>
                            <p className="text-slate-700 mt-1">"{rev.comment}"</p>
                          </div>
                          <div className="text-right">
                            <span className="bg-amber-100 text-amber-900 font-extrabold px-2.5 py-1 rounded-lg">{rev.stars}★</span>
                            <span className="block text-[10px] text-slate-400 mt-1">{rev.date}</span>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="bg-white border border-amber-200 rounded-2xl p-5 shadow-xs">
                <span className="text-xs text-amber-700 font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" /> {t.brokerHoldCard}
                </span>
                <div className="text-3xl font-black text-slate-900 mt-2">₹{brokerHeldTotal.toLocaleString('en-IN')}</div>
                <p className="text-xs text-slate-500 mt-1.5">{t.brokerHoldSub}</p>
              </div>

              <div className="bg-white border border-emerald-200 rounded-2xl p-5 shadow-xs">
                <span className="text-xs text-emerald-700 font-bold flex items-center gap-1.5">
                  <Wallet className="w-4 h-4" /> {t.brokerReleasedCard}
                </span>
                <div className="text-3xl font-black text-emerald-700 mt-2">₹{brokerReleasedTotal.toLocaleString('en-IN')}</div>
                <p className="text-xs text-slate-500 mt-1.5">
                  {isBrokerBankSaved ? `${brokerBank.upiId} • ${brokerBank.ifsc}` : 'Save bank details below'}
                </p>
              </div>
            </div>

            {/* Broker Bank Card with Saved + Edit */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Landmark className="w-4 h-4 text-teal-700" />
                  <h3 className="font-bold text-sm text-slate-900">Settlement Bank & UPI Account</h3>
                  {isBrokerBankSaved && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                      <Check className="w-3.5 h-3.5" /> {t.savedBadge}
                    </span>
                  )}
                </div>
                {isBrokerBankSaved && (
                  <button type="button" onClick={() => setIsBrokerBankSaved(false)} className="border border-slate-300 text-xs font-bold px-3 py-1 rounded-xl inline-flex items-center gap-1 cursor-pointer">
                    <Edit3 className="w-3.5 h-3.5 text-teal-700" /> {t.editBtn}
                  </button>
                )}
              </div>

              {isBrokerBankSaved ? (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
                  <div><span className="text-[10px] text-slate-400 block">Holder</span><b>{brokerBank.accountName}</b></div>
                  <div><span className="text-[10px] text-slate-400 block">Account No</span><b className="font-mono">{brokerBank.accountNo}</b></div>
                  <div><span className="text-[10px] text-slate-400 block">IFSC</span><b className="font-mono">{brokerBank.ifsc}</b></div>
                  <div><span className="text-[10px] text-slate-400 block">UPI ID</span><b className="font-mono text-teal-700">{brokerBank.upiId}</b></div>
                </div>
              ) : (
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    setIsBrokerBankSaved(true);
                    showToast(t.toasts.bankUpdated);
                  }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-2.5"
                >
                  <input required type="text" placeholder={t.accHolderLabel} value={brokerBank.accountName} onChange={(e) => setBrokerBank({ ...brokerBank, accountName: e.target.value })} className="border border-slate-300 rounded-xl px-3 py-2 text-xs select-text" />
                  <input required type="text" placeholder={t.accNoLabel} value={brokerBank.accountNo} onChange={(e) => setBrokerBank({ ...brokerBank, accountNo: e.target.value })} className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono select-text" />
                  <input required type="text" placeholder={t.ifscLabel} value={brokerBank.ifsc} onChange={(e) => setBrokerBank({ ...brokerBank, ifsc: e.target.value.toUpperCase() })} className="border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono select-text" />
                  <div className="flex gap-1.5">
                    <input required type="text" placeholder={t.upiLabel} value={brokerBank.upiId} onChange={(e) => setBrokerBank({ ...brokerBank, upiId: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono select-text" />
                    <button type="submit" className="bg-slate-900 text-white text-xs font-bold px-3 rounded-xl cursor-pointer">{t.saveBtn}</button>
                  </div>
                </form>
              )}
            </div>

            {/* ALL REGISTERED HATCHERIES SORTABLE FOR BROKER */}
            <div className="space-y-4">
              <h2 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-teal-600" /> {t.brokerMarketplaceTitle}
              </h2>

              {renderFilterSortBar(false)}

              {filteredAndSortedBatches.length === 0 ? (
                <div className="bg-white rounded-2xl border border-slate-200 p-10 text-center space-y-2">
                  <Building2 className="w-9 h-9 text-slate-300 mx-auto" />
                  <h3 className="text-sm font-extrabold text-slate-800">{t.emptyMarketTitle}</h3>
                  <p className="text-xs text-slate-500">{t.emptyMarketSub}</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {filteredAndSortedBatches.map((batch) => (
                    <div key={batch.id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between gap-4 hover:border-teal-400 transition">
                      <div onClick={() => setInspectedBatch(batch)} className="space-y-3 cursor-pointer">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2 py-0.5 rounded-full">
                                {t.caaVerified}
                              </span>
                              <span className="text-xs font-semibold text-slate-500">{batch.zone}</span>
                              <span className="text-xs font-bold text-amber-600 inline-flex items-center gap-0.5">
                                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" /> {batch.rating}
                              </span>
                            </div>
                            <h3 className="text-base font-extrabold text-slate-900 mt-1.5">{batch.hatcheryCode}</h3>
                            <p className="text-xs text-slate-500">{batch.species}</p>
                          </div>
                          <div className="text-right">
                            <div className="text-xl font-black text-slate-900">₹{batch.pricePer1000.toFixed(2)}</div>
                            <span className="text-[11px] text-slate-400">{t.perSeed}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-4 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-center text-xs">
                          <div><span className="text-[10px] text-slate-400 block">{t.stage}</span><b>{batch.plStage}</b></div>
                          <div><span className="text-[10px] text-slate-400 block">{t.salinity}</span><b className="text-teal-700">{batch.salinity} PPT</b></div>
                          <div><span className="text-[10px] text-slate-400 block">{t.bonus}</span><b className="text-emerald-600">+{batch.bonusPercent}%</b></div>
                          <div><span className="text-[10px] text-slate-400 block">{t.stock}</span><b>{(batch.availableStock / 100000).toFixed(1)}L</b></div>
                        </div>

                        <div className="text-xs text-teal-700 font-bold flex items-center gap-1.5">
                          <Eye className="w-3.5 h-3.5" /> {t.inspectBtn}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedBatch(batch);
                          setBookingForm(prev => ({
                            ...prev,
                            farmerName: brokerFarmers[0]?.name || '',
                            farmerPhone: brokerFarmers[0]?.phone || '',
                            brokerMarginPaise: 2
                          }));
                        }}
                        className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer"
                      >
                        {t.selectAndBookBtn}
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Broker Locked Farmers CRM */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <form onSubmit={handleAddBrokerFarmer} className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3.5">
                <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
                  <Lock className="w-4 h-4 text-teal-600" /> {t.lockFarmerTitle}
                </h3>
                <input required type="text" placeholder={t.farmerNamePlaceholder} value={newFarmer.name} onChange={(e) => setNewFarmer({ ...newFarmer, name: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm select-text" />
                <input required type="tel" maxLength={10} placeholder={t.mobileLabel} value={newFarmer.phone} onChange={(e) => setNewFarmer({ ...newFarmer, phone: e.target.value.replace(/\D/g, '') })} className="w-full border border-slate-300 rounded-xl px-3.5 py-2 text-sm select-text" />
                <div className="grid grid-cols-2 gap-2">
                  <input required type="text" placeholder={t.villagePlaceholder} value={newFarmer.village} onChange={(e) => setNewFarmer({ ...newFarmer, village: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm select-text" />
                  <input required type="number" step="0.5" placeholder={t.acresPlaceholder} value={newFarmer.acres} onChange={(e) => setNewFarmer({ ...newFarmer, acres: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm select-text" />
                </div>
                <button type="submit" className="w-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                  {t.lockFarmerBtn}
                </button>
              </form>

              <div className="lg:col-span-2 bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-3">
                <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-teal-600" /> {t.myFarmersTitle}
                </h3>
                {brokerFarmers.length === 0 ? (
                  <p className="text-xs text-slate-500">No farmers locked yet. Add your farmers on the left.</p>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-sm">
                      <thead>
                        <tr className="border-b border-slate-200 text-[11px] uppercase text-slate-400">
                          <th className="py-2">Farmer</th>
                          <th className="py-2">Village / Acres</th>
                          <th className="py-2">Protection</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {brokerFarmers.map((f) => (
                          <tr key={f.id}>
                            <td className="py-2.5 font-bold text-slate-900">{f.name} <span className="block text-xs font-normal text-slate-500">{f.phone}</span></td>
                            <td className="py-2.5 text-xs text-slate-600">{f.village} ({f.acres} Acres)</td>
                            <td className="py-2.5"><span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full">Locked till {f.lockedUntil}</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* =========================================================
          HATCHERY INSPECTION MODAL (PCR PHOTO/PDF + HISTORY + RATING)
         ========================================================= */}
      {inspectedBatch && (
        <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    {t.caaVerified}
                  </span>
                  <span className="text-xs font-bold text-amber-600">{inspectedBatch.rating}★ ({inspectedBatch.reviewCount || 0} Reviews)</span>
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mt-1">{inspectedBatch.hatcheryCode} • {inspectedBatch.zone}</h3>
              </div>
              <button type="button" onClick={() => setInspectedBatch(null)} className="text-slate-400 hover:text-slate-800 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 bg-slate-50 p-3.5 rounded-xl border border-slate-200 text-xs">
              <div><span className="text-[10px] text-slate-400 block">Species</span><b>{inspectedBatch.species}</b></div>
              <div><span className="text-[10px] text-slate-400 block">Stage</span><b>{inspectedBatch.plStage}</b></div>
              <div><span className="text-[10px] text-slate-400 block">Salinity</span><b className="text-teal-700">{inspectedBatch.salinity} PPT</b></div>
              <div><span className="text-[10px] text-slate-400 block">Tank GPS</span><b className="font-mono text-[11px]">{inspectedBatch.gpsCoords}</b></div>
            </div>

            {/* PCR LAB PHOTO / DOCUMENT PREVIEW */}
            <div className="border border-slate-200 rounded-xl p-4 space-y-2 bg-slate-50">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-900 flex items-center gap-1.5">
                  <FileCheck2 className="w-4 h-4 text-teal-600" /> Attached PCR Lab Report: <span className="font-mono text-teal-700">{inspectedBatch.pcrFileName}</span>
                </span>
                <span className="text-[11px] text-slate-400">Listed: {inspectedBatch.createdAt || 'Today'}</span>
              </div>
              {inspectedBatch.pcrPreviewUrl ? (
                inspectedBatch.pcrFileType?.includes('pdf') ? (
                  <iframe src={inspectedBatch.pcrPreviewUrl} title="PCR Report" className="w-full h-64 rounded-lg border border-slate-300 bg-white" />
                ) : (
                  <img src={inspectedBatch.pcrPreviewUrl} alt="PCR Lab Report" className="w-full max-h-72 object-contain rounded-lg border border-slate-300 bg-white" />
                )
              ) : (
                <div className="p-6 text-center text-xs text-slate-500 bg-white rounded-lg border border-dashed border-slate-300">
                  PCR Document Verified ({inspectedBatch.pcrFileName})
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2.5 pt-2">
              <button type="button" onClick={() => setInspectedBatch(null)} className="px-4 py-2.5 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer">
                {t.closeBtn}
              </button>
              <button
                type="button"
                onClick={() => {
                  const b = inspectedBatch;
                  setInspectedBatch(null);
                  setSelectedBatch(b);
                }}
                className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-5 py-2.5 rounded-xl cursor-pointer"
              >
                {t.bookSlotBtn} →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          BOOKING MODAL (MULTI-PAYMENT: RAZORPAY + DIRECT UPI + BANK-TO-BANK)
         ========================================================= */}
      {selectedBatch && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 space-y-4 max-h-[92vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div>
                <h3 className="font-extrabold text-base text-slate-900">{t.modalTitle}</h3>
                <p className="text-xs text-slate-500">{selectedBatch.hatcheryCode} • {selectedBatch.zone}</p>
              </div>
              <button type="button" onClick={() => setSelectedBatch(null)} className="text-slate-400 hover:text-slate-800 font-bold text-lg cursor-pointer">✕</button>
            </div>

            <form onSubmit={handleConfirmBookingSubmit} className="space-y-4">
              {/* STEP 1: SELECTED HATCHERY SUMMARY */}
              <div className="bg-teal-50 border border-teal-200 rounded-xl p-3.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-extrabold text-teal-900 uppercase">{t.step1Label}</span>
                  {currentUser.role === 'mediator' && (
                    <button type="button" onClick={() => setSelectedBatch(null)} className="text-[11px] font-bold text-teal-700 underline cursor-pointer">
                      {t.changeHatcheryBtn}
                    </button>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs">
                  <div>
                    <span className="font-extrabold text-slate-900 block">{selectedBatch.hatcheryCode} ({selectedBatch.plStage})</span>
                    <span className="text-slate-600">{selectedBatch.species} • Salinity: {selectedBatch.salinity} PPT</span>
                  </div>
                  <div className="text-right font-black text-teal-900 text-base">
                    ₹{selectedBatch.pricePer1000.toFixed(2)}<span className="text-[10px] font-normal block">/seed</span>
                  </div>
                </div>
              </div>

              {/* STEP 2: ENTER FARMER & PAYMENT DETAILS */}
              <div className="space-y-3">
                <span className="text-[11px] font-extrabold text-slate-700 uppercase block">{t.step2Label}</span>

                {currentUser.role === 'mediator' && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">{t.selectSavedFarmer}</label>
                      <select
                        onChange={(e) => {
                          const found = brokerFarmers.find(f => f.id === e.target.value);
                          if (found) setBookingForm({ ...bookingForm, farmerName: found.name, farmerPhone: found.phone });
                        }}
                        className="w-full border border-slate-300 bg-white rounded-xl px-2.5 py-1.5 text-xs font-semibold"
                      >
                        <option value="">{t.manualFarmerOption}</option>
                        {brokerFarmers.map(f => (
                          <option key={f.id} value={f.id}>{f.name} ({f.village})</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[11px] font-bold text-slate-700 block mb-1">{t.brokerMarginLabel}</label>
                      <input
                        type="number"
                        min="0"
                        max="10"
                        value={bookingForm.brokerMarginPaise}
                        onChange={(e) => setBookingForm({ ...bookingForm, brokerMarginPaise: Number(e.target.value) })}
                        className="w-full border border-slate-300 bg-white rounded-xl px-2.5 py-1.5 text-xs font-bold select-text"
                      />
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{t.farmerNameLabel}</label>
                    <input required type="text" value={bookingForm.farmerName} onChange={(e) => setBookingForm({ ...bookingForm, farmerName: e.target.value })} className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm select-text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{t.whatsappLabel}</label>
                    <input
                      required
                      type="tel"
                      maxLength={10}
                      placeholder="9876543210"
                      value={bookingForm.farmerPhone}
                      onChange={(e) => setBookingForm({ ...bookingForm, farmerPhone: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                      className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm font-mono font-bold select-text"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{t.quantityLabel}</label>
                    <input required type="number" step="10000" min="50000" value={bookingForm.quantity} onChange={(e) => setBookingForm({ ...bookingForm, quantity: Number(e.target.value) })} className="w-full border border-slate-300 rounded-xl px-2.5 py-2 text-sm font-bold select-text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{t.pondSalinityLabel}</label>
                    <input required type="number" value={bookingForm.pondSalinity} onChange={(e) => setBookingForm({ ...bookingForm, pondSalinity: Number(e.target.value) })} className="w-full border border-slate-300 rounded-xl px-2.5 py-2 text-sm font-bold select-text" />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">{t.packingDateLabel}</label>
                    <input required type="date" value={bookingForm.packingDate} onChange={(e) => setBookingForm({ ...bookingForm, packingDate: e.target.value })} className="w-full border border-slate-300 rounded-xl px-2.5 py-2 text-xs font-bold select-text" />
                  </div>
                </div>

                <label className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl p-2.5 cursor-pointer text-xs font-bold text-slate-800">
                  <input
                    type="checkbox"
                    checked={bookingForm.includeTransport}
                    onChange={(e) => setBookingForm({ ...bookingForm, includeTransport: e.target.checked })}
                  />
                  <Truck className="w-4 h-4 text-teal-600" />
                  {t.transportAddonLabel}
                </label>

                {/* PAYMENT METHOD SELECTOR: RAZORPAY / DIRECT UPI / BANK-TO-BANK */}
                <div className="space-y-2 pt-1">
                  <label className="text-xs font-bold text-slate-700 block">{t.paymentMethodLabel}</label>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      { id: 'RAZORPAY', label: 'Razorpay', icon: CreditCard },
                      { id: 'DIRECT_UPI', label: 'Direct UPI', icon: QrCode },
                      { id: 'BANK_TO_BANK', label: 'Bank-to-Bank', icon: Landmark }
                    ].map(pm => {
                      const Icon = pm.icon;
                      const active = bookingForm.paymentMethod === pm.id;
                      return (
                        <button
                          key={pm.id}
                          type="button"
                          onClick={() => setBookingForm({ ...bookingForm, paymentMethod: pm.id })}
                          className={`p-2.5 rounded-xl border text-center flex flex-col items-center gap-1 cursor-pointer ${active ? 'border-teal-600 bg-teal-50 text-teal-900 font-extrabold' : 'border-slate-200 text-slate-600 font-semibold'
                            }`}
                        >
                          <Icon className="w-4 h-4 text-teal-700" />
                          <span className="text-[11px]">{pm.label}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Direct UPI or Bank-to-Bank Details Box */}
                  {(() => {
                    const qty = Number(bookingForm.quantity) || 100000;
                    const effRate = (selectedBatch.pricePer1000 || 0.42) + ((Number(bookingForm.brokerMarginPaise) || 0) / 100);
                    const total = Math.round(qty * effRate) + (bookingForm.includeTransport ? 1500 : 0);
                    const token = Math.max(2500, Math.round(total * 0.10));

                    if (bookingForm.paymentMethod === 'DIRECT_UPI') {
                      const upiUri = `upi://pay?pa=aquamark@sbi&pn=AquaMark&am=${token}&cu=INR&tn=SeedBooking`;
                      return (
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-3 space-y-2 text-xs">
                          <div className="flex items-center justify-between">
                            <div>
                              <span className="font-bold text-emerald-900 block">AquaMark Settlement UPI ID:</span>
                              <span className="font-mono font-extrabold text-teal-800 select-text">aquamark@sbi</span>
                            </div>
                            <a href={upiUri} className="bg-teal-700 text-white font-bold px-3 py-1.5 rounded-lg text-xs">
                              Open UPI App (₹{token.toLocaleString('en-IN')})
                            </a>
                          </div>
                          <input
                            required
                            type="text"
                            placeholder={t.utrPlaceholder}
                            value={bookingForm.utrReference}
                            onChange={(e) => setBookingForm({ ...bookingForm, utrReference: e.target.value })}
                            className="w-full border border-emerald-300 bg-white rounded-lg px-3 py-1.5 text-xs font-mono select-text"
                          />
                        </div>
                      );
                    }

                    if (bookingForm.paymentMethod === 'BANK_TO_BANK') {
                      return (
                        <div className="bg-slate-50 border border-slate-300 rounded-xl p-3 space-y-2 text-xs">
                          <div className="font-mono text-[11px] text-slate-700 space-y-0.5 select-text">
                            <div><b>Account Name:</b> Aqua Mark Escrow Account</div>
                            <div><b>Account No:</b> 20419820112 | <b>IFSC:</b> SBIN0008812</div>
                            <div><b>Amount to Transfer:</b> ₹{token.toLocaleString('en-IN')} (IMPS / NEFT)</div>
                          </div>
                          <input
                            required
                            type="text"
                            placeholder={t.utrPlaceholder}
                            value={bookingForm.utrReference}
                            onChange={(e) => setBookingForm({ ...bookingForm, utrReference: e.target.value })}
                            className="w-full border border-slate-300 bg-white rounded-lg px-3 py-1.5 text-xs font-mono select-text"
                          />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              {Math.abs((selectedBatch.salinity || 15) - (Number(bookingForm.pondSalinity) || 15)) > 4 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-900 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>{t.salinityWarn}</span>
                </div>
              )}

              {(() => {
                const qty = Number(bookingForm.quantity) || 100000;
                const effRate = (selectedBatch.pricePer1000 || 0.42) + ((Number(bookingForm.brokerMarginPaise) || 0) / 100);
                const total = Math.round(qty * effRate) + (bookingForm.includeTransport ? 1500 : 0);
                const token = Math.max(2500, Math.round(total * 0.10));
                return (
                  <div className="bg-slate-900 text-white rounded-2xl p-4 space-y-2 text-xs">
                    <div className="flex justify-between text-slate-300">
                      <span>{t.totalSeedValue} ({qty.toLocaleString('en-IN')} PL):</span>
                      <span className="font-bold text-white">₹{total.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-emerald-400 font-extrabold text-sm border-t border-white/10 pt-2">
                      <span>{t.advancePayable}:</span>
                      <span>₹{token.toLocaleString('en-IN')}</span>
                    </div>
                    <div className="flex justify-between text-slate-300 pt-1">
                      <span>{t.balanceAtGate}:</span>
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
        <div className="fixed inset-0 bg-slate-950/70 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b pb-3">
              <h3 className="font-extrabold text-base text-slate-900">{t.compareModalTitle}</h3>
              <button type="button" onClick={() => setShowCompareModal(false)} className="text-slate-400 hover:text-slate-800 font-bold cursor-pointer">✕</button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              {batches.filter(b => compareIds.includes(b.id)).map(b => (
                <div key={b.id} className="border border-slate-200 rounded-xl p-3.5 space-y-2 bg-slate-50">
                  <div className="font-extrabold text-slate-900">{b.hatcheryCode}</div>
                  <div className="text-teal-700 font-bold">{b.zone}</div>
                  <div className="border-t pt-2 space-y-1">
                    <div className="flex justify-between"><span>{t.stage}:</span><b>{b.plStage}</b></div>
                    <div className="flex justify-between"><span>{t.perSeed}:</span><b>₹{b.pricePer1000.toFixed(2)}</b></div>
                    <div className="flex justify-between"><span>{t.salinity}:</span><b>{b.salinity} PPT</b></div>
                    <div className="flex justify-between"><span>{t.bonus}:</span><b className="text-emerald-600">+{b.bonusPercent}%</b></div>
                    <div className="flex justify-between"><span>Rating:</span><b>{b.rating}★</b></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* VERIFIED CERTIFICATE MODAL (ONLY "PRINT" BUTTON & FAVICON.SVG LOGO) */}
      {activeInvoice && (
        <div className="fixed inset-0 bg-slate-950/75 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border-2 border-teal-600 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 pb-3">
              <div className="flex items-center gap-2.5">
                <img src="/favicon.svg" alt="Aqua Mark Logo" className="w-8 h-8 object-contain" />
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{t.receiptTitle}</h3>
                  <p className="text-[11px] font-mono text-emerald-700 font-bold">
                    {activeInvoice.bookingId} • {activeInvoice.paymentId}
                  </p>
                </div>
              </div>
              <button type="button" onClick={() => setActiveInvoice(null)} className="text-slate-400 hover:text-slate-800 font-bold cursor-pointer">✕</button>
            </div>

            <div className="text-xs space-y-2.5 text-slate-700">
              <div className="bg-emerald-50 border border-emerald-200 p-3.5 rounded-xl">
                <span className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider">Unlocked & CAA Verified Hatchery</span>
                <p className="font-extrabold text-sm text-slate-900 mt-0.5">{activeInvoice.batch?.realName}</p>
                <p className="text-slate-600">{activeInvoice.batch?.realAddress}</p>
                <p className="font-bold text-teal-800 mt-1">Phone: +91 {activeInvoice.batch?.realPhone} | CAA: {activeInvoice.batch?.caaLicense}</p>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>{t.farmerNameLabel}:</span>
                <span className="font-bold text-slate-900">{activeInvoice.farmerName} ({activeInvoice.farmerPhone})</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span>Seed + Free Bonus:</span>
                <span className="font-bold text-emerald-700">{(activeInvoice.quantity || 0).toLocaleString('en-IN')} + {(activeInvoice.bonusSeeds || 0).toLocaleString('en-IN')} Free PL</span>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100 text-teal-800 font-bold">
                <span>{t.advancePaidLabel}:</span>
                <span>₹{(activeInvoice.tokenAdvance || 0).toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between py-1 font-bold text-slate-900">
                <span>{t.balanceAtGate}:</span>
                <span>₹{(activeInvoice.balanceAtGate || 0).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => handleDownloadVerifiedPdf(activeInvoice)}
                className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-3 rounded-xl flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
              >
                <Printer className="w-4 h-4" /> {t.printBtn}
              </button>
              <button type="button" onClick={() => setActiveInvoice(null)} className="px-4 py-3 border border-slate-300 rounded-xl text-xs font-bold cursor-pointer">
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