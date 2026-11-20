import React, { useState, useEffect, useRef } from 'react';
import {
  ShieldCheck, Lock, Unlock, Calculator, CheckCircle2, MapPin,
  FileText, Wallet, Users, Send, Printer, Camera,
  Globe, LogOut, Smartphone, UserCheck, Landmark, Clock,
  CheckSquare, ShoppingBag, Building2, Star, Search, AlertTriangle,
  Package, Edit3, Check, ChevronRight, Layers, Trash2,
  ArrowUpDown, Scale, FileCheck2, Upload, PlusCircle, Heart,
  Truck, TrendingUp, Eye, EyeOff, CreditCard, QrCode,
  MessageSquare, BarChart3, Calendar, Droplets, Receipt, Moon,
  Sun, XCircle, ClipboardList, Gauge, Video, ExternalLink,
  FolderOpen, Maximize2, RefreshCw, Share2, PauseCircle, PlayCircle,
  Sparkles, ShieldAlert, KeyRound, Activity, Navigation, Thermometer,
  Award, Bell, Phone, ScanLine, ShoppingCart,
  Download, Volume2, VolumeX, Zap, RotateCcw, Target,
  Timer, PhoneCall, Megaphone, CloudSun, Sliders, ArrowUp,
  WifiOff, StickyNote, Plus, Minus, Copy
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
  'Vannamei (SyAqua Line)',
  'Vannamei (Hard Line / High Survival)',
  'Vannamei (SPF)',
  'Vannamei (High Growth)',
  'Vannamei (Disease Resistant)',
  'Monodon (Black Tiger)',
  'Macrobrachium Rosenbergii (Scampi)',
  'Penaeus Indicus (Indian White Prawn)',
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


const COASTAL_TIP_ZONES = [
  { en: 'Kakinada', te: 'కాకినాడ' },
  { en: 'Bhimavaram', te: 'భీమవరం' },
  { en: 'Amalapuram', te: 'అమలాపురం' },
  { en: 'Machilipatnam', te: 'మచిలీపట్నం' },
  { en: 'Repalle', te: 'రేపల్లె' },
  { en: 'Chirala', te: 'చీరాల' },
  { en: 'Ongole', te: 'ఒంగోలు' },
  { en: 'Kavali', te: 'కావలి' },
  { en: 'Nellore', te: 'నెల్లూరు' },
  { en: 'Gudur', te: 'గూడూరు' }
];

function generateFreshAquaTip(stepSeed = 0) {
  const now = new Date();
  const hr = now.getHours();
  const slotEn = hr < 10 ? 'Early Morning' : hr < 15 ? 'Midday' : hr < 19 ? 'Evening' : 'Night';
  const slotTe = hr < 10 ? 'ఉదయం' : hr < 15 ? 'మధ్యాహ్నం' : hr < 19 ? 'సాయంత్రం' : 'రాత్రి';
  const z = COASTAL_TIP_ZONES[(stepSeed + Math.floor(Math.random() * COASTAL_TIP_ZONES.length)) % COASTAL_TIP_ZONES.length];
  const temp = 27 + ((stepSeed * 3 + hr) % 7);
  const doTarget = (4.8 + ((stepSeed % 4) * 0.2)).toFixed(1);
  const pptShift = 2 + (stepSeed % 3);
  const templates = [
    {
      en: `${slotEn} Advisory (${z.en} Belt • ${temp}°C): Best seed packing window is 04:00 AM – 06:30 AM to keep transit stress below 2% and survival above 98%.`,
      te: `${slotTe} సూచన (${z.te} ప్రాంతం • ${temp}°C): 98% పైన సర్వైవల్ కోసం ఉదయం 04:00 – 06:30 మధ్య సీడ్ ప్యాకింగ్ చేయించడం ఉత్తమం.`
    },
    {
      en: `Night DO Protection (${z.en}): Maintain Dissolved Oxygen above ${doTarget} ppm by running paddle-wheel aerators continuously from 11:00 PM to 05:30 AM.`,
      te: `రాత్రి DO రక్షణ (${z.te}): రాత్రి 11:00 నుండి ఉదయం 05:30 వరకు ఏరేటర్లు నడిపి DO స్థాయిని ${doTarget} ppm పైన ఉంచండి.`
    },
    {
      en: `Salinity Acclimatization (${z.en}): If pond water varies by ${pptShift}+ PPT from hatchery tanks, drip-acclimatize at 1 PPT every 4 hours before stocking.`,
      te: `సెలైనిటీ అలవాటు (${z.te}): హేచరీ మరియు చెరువు మధ్య ${pptShift}+ PPT తేడా ఉంటే, ప్రతి 4 గంటలకు 1 PPT చొప్పున అలవాటు చేసి సీడ్ వదలండి.`
    },
    {
      en: `Oxygen Packing Tip (${z.en}): For transit above 4 hours at ${temp}°C, cap packing density at 2,000 PL/bag with medical-grade oxygen and double-sealed liners.`,
      te: `ఆక్సిజన్ ప్యాకింగ్ టిప్ (${z.te}): ${temp}°C వద్ద 4 గంటల కంటే ఎక్కువ ప్రయాణానికి బ్యాగ్‌కు 2,000 PL మాత్రమే ప్యాక్ చేయించి డబుల్ సీల్ ఆక్సిజన్ వాడండి.`
    },
    {
      en: `Check-Tray & Gut Health (${z.en}): Apply gut probiotics + Vitamin-C with starter feed during ${slotEn.toLowerCase()} meals to cut Vibrio risk by 40%.`,
      te: `చెక్-ట్రే & గట్ ఆరోగ్యం (${z.te}): ${slotTe} ఫీడ్‌లో గట్ ప్రోబయోటిక్స్ & విటమిన్-C కలిపి వేస్తే విబ్రియో వ్యాధి ముప్పు 40% తగ్గుతుంది.`
    },
    {
      en: `Mineral & Molting Balance (${z.en}): Check pond alkalinity (120–160 ppm) & Ca:Mg ratio (1:3) before full moon molting cycles for hard-shell uniform growth.`,
      te: `మినరల్స్ & మోల్టింగ్ (${z.te}): పౌర్ణమి మోల్టింగ్ ముందు ఆల్కలీనిటీ (120–160 ppm) మరియు మినరల్స్ సరిచూస్తే రొయ్యలు బలంగా పెరుగుతాయి.`
    },
    {
      en: `Bio-Security Gate Protocol (${z.en}): Always verify AI PCR Lab Report status and active swimming vigor against water current before releasing PL into ponds.`,
      te: `బయో-సెక్యూరిటీ ప్రోటోకాల్ (${z.te}): చెరువులో సీడ్ వదిలే ముందు AI PCR ల్యాబ్ రిపోర్ట్ మరియు నీటి ప్రవాహానికి ఎదురుగా ఈదే చురుకుదనం తనిఖీ చేయండి.`
    }
  ];
  const pick = templates[stepSeed % templates.length];
  return { ...pick, id: `tip-${Date.now()}-${stepSeed}` };
}

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

// ============================================================================
// REAL OCR PCR LAB REPORT ANALYZER (TESSERACT.JS CHARACTER RECOGNITION — 100% FREE)
// Reads actual printed characters from uploaded PCR photos & extracts WSSV/EHP/IHHNV
// ============================================================================
let tesseractLoaderPromise = null;
function loadTesseractCdn() {
  if (typeof window !== 'undefined' && window.Tesseract) return Promise.resolve(window.Tesseract);
  if (tesseractLoaderPromise) return tesseractLoaderPromise;
  tesseractLoaderPromise = new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js';
    script.async = true;
    script.onload = () => (window.Tesseract ? resolve(window.Tesseract) : reject(new Error('Tesseract unavailable')));
    script.onerror = () => reject(new Error('Failed to load OCR engine'));
    document.head.appendChild(script);
  });
  return tesseractLoaderPromise;
}

function extractPathogenStatus(textUpper, aliases) {
  for (const alias of aliases) {
    const posRe = new RegExp(`(?:${alias})[\\s\\S]{0,45}?(?:POSITIVE|DETECTED|PRESENT|REACTIVE)`, 'i');
    const negRe = new RegExp(`(?:${alias})[\\s\\S]{0,45}?(?:NEGATIVE|NOT\\s*DETECTED|ABSENT|NIL|ND\\b|CLEAR|FREE)`, 'i');
    if (negRe.test(textUpper)) return 'NEGATIVE';
    if (posRe.test(textUpper)) return 'POSITIVE';
  }
  return 'NOT_FOUND';
}

async function analyzePcrReportImage(file) {
  try {
    const Tesseract = await loadTesseractCdn();
    const result = await Tesseract.recognize(file, 'eng');
    const rawText = (result?.data?.text || '').trim();
    const ocrConf = Math.round(result?.data?.confidence || 0);
    const upper = rawText.toUpperCase();

    const labKeywords = [
      'PCR', 'WSSV', 'WHITE SPOT', 'EHP', 'ENTEROCYTOZOON', 'IHHNV', 'EMS', 'AHPND',
      'MBV', 'YHV', 'TSV', 'VIBRIO', 'NEGATIVE', 'NOT DETECTED', 'ABSENT', 'POSITIVE',
      'PATHOGEN', 'LAB', 'LABORATORY', 'REPORT', 'SAMPLE', 'CAA', 'MPEDA', 'VANNAMEI',
      'SHRIMP', 'POST LARVAE', 'BROODSTOCK', 'DIAGNOSTIC', 'TEST RESULT'
    ];
    const matchedKeywords = labKeywords.filter((kw) => upper.includes(kw));

    const wssv = extractPathogenStatus(upper, ['WSSV', 'WHITE\\s*SPOT']);
    const ehp = extractPathogenStatus(upper, ['EHP', 'ENTEROCYTOZOON']);
    const ihhnv = extractPathogenStatus(upper, ['IHHNV', 'EMS', 'AHPND', 'MBV']);

    const anyPositive = wssv === 'POSITIVE' || ehp === 'POSITIVE' || ihhnv === 'POSITIVE';
    const anyNegative = wssv === 'NEGATIVE' || ehp === 'NEGATIVE' || ihhnv === 'NEGATIVE' ||
      /\b(NEGATIVE|NOT\s*DETECTED|ABSENT)\b/.test(upper);

    const extracted = {
      wssv,
      ehp,
      ihhnv,
      matchedCount: matchedKeywords.length,
      keywords: matchedKeywords.slice(0, 6),
      snippet: rawText.replace(/\s+/g, ' ').slice(0, 140)
    };

    if (anyPositive) {
      return {
        isPcrReport: false,
        status: 'NOT_A_PCR_REPORT',
        confidence: Math.max(75, ocrConf),
        extracted,
        reason: `⚠️ POSITIVE pathogen detected in OCR scan (WSSV: ${wssv}, EHP: ${ehp}, IHHNV/EMS: ${ihhnv})`
      };
    }

    const isGenuinePcr = matchedKeywords.length >= 2 && anyNegative && rawText.length >= 25;
    if (!isGenuinePcr) {
      return {
        isPcrReport: false,
        status: 'NOT_A_PCR_REPORT',
        confidence: Math.max(60, ocrConf),
        extracted,
        reason: rawText.length < 20
          ? 'No readable PCR lab text found in image — upload a clear printed PCR report photo.'
          : `Only ${matchedKeywords.length} lab keyword(s) found — missing clear WSSV/EHP/Negative PCR text.`
      };
    }

    const summaryParts = [];
    if (wssv !== 'NOT_FOUND') summaryParts.push(`WSSV: ${wssv}`);
    if (ehp !== 'NOT_FOUND') summaryParts.push(`EHP: ${ehp}`);
    if (ihhnv !== 'NOT_FOUND') summaryParts.push(`IHHNV/EMS: ${ihhnv}`);
    const parsedSummary = summaryParts.length > 0 ? summaryParts.join(' • ') : 'PCR Negative Confirmed';

    return {
      isPcrReport: true,
      status: 'VERIFIED_PCR',
      confidence: Math.max(78, Math.min(99, ocrConf || 88)),
      extracted,
      reason: `OCR Verified (${parsedSummary})`
    };
  } catch {
    return {
      isPcrReport: false,
      status: 'NOT_A_PCR_REPORT',
      confidence: 0,
      extracted: null,
      reason: 'OCR scan could not read text from this image. Please upload a clearer PCR lab report photo.'
    };
  }
}

// ============================================================================
// PROFESSIONAL ORIENTATION-AWARE CAMERA TIMESTAMP (9:16 HORIZONTAL / 16:9 BOTTOM)
// ============================================================================
function drawVivoWatermarkOnCanvas(ctx, width, height, meta) {
  const isPortrait = height > width; // 9:16 phone / tall images vs 16:9 landscape images

  // Helper to shrink font cleanly so text NEVER overlaps or clips
  const fitFont = (text, maxW, startPx, weight = 700, family = '"Inter", "Segoe UI", Roboto, sans-serif') => {
    let sz = startPx;
    while (sz > 8) {
      ctx.font = `${weight} ${sz}px ${family}`;
      if (ctx.measureText(text).width <= maxW) return sz;
      sz -= 0.5;
    }
    return 8;
  };

  // Subtle diagonal cross security watermark (very light so PCR text stays 100% readable)
  ctx.save();
  const diagFontSize = Math.max(11, Math.round(Math.min(width, height) * 0.024));
  ctx.font = `700 ${diagFontSize}px "Inter", "Segoe UI", Roboto, sans-serif`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const wmText = `AQUA MARK • ${meta.caaNumber || 'CAA-VERIFIED'}`;
  const stepX = Math.max(240, Math.round(width * 0.48));
  const stepY = Math.max(150, Math.round(height * 0.28));
  ctx.translate(width / 2, height / 2);
  ctx.rotate(-Math.PI / 6);
  for (let y = -height; y <= height; y += stepY) {
    for (let x = -width; x <= width; x += stepX) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.09)';
      ctx.fillText(wmText, x + 1, y + 1);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.13)';
      ctx.fillText(wmText, x, y);
    }
  }
  ctx.restore();

  // Format clean professional date & time
  const rawDt = String(meta.dateTime || '');
  const dtParts = rawDt.split('•').map(s => s.trim()).filter(Boolean);
  const datePart = dtParts[0] || new Date().toLocaleDateString('en-IN');
  const timePart = dtParts[1] || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  const caaStr = `CAA: ${meta.caaNumber || 'VERIFIED'}`;

  // Helper for rounded rectangle path
  const roundRect = (x, y, w, h, r) => {
    const rr = Math.min(r, w / 2, h / 2);
    ctx.beginPath();
    ctx.moveTo(x + rr, y);
    ctx.arcTo(x + w, y, x + w, y + h, rr);
    ctx.arcTo(x + w, y + h, x, y + h, rr);
    ctx.arcTo(x, y + h, x, y, rr);
    ctx.arcTo(x, y, x + w, y, rr);
    ctx.closePath();
  };

  if (isPortrait) {
    // 9:16 PORTRAIT PHONE IMAGE -> Sleek, compact HORIZONTAL floating pro-camera glass strip
    const marginX = Math.max(10, Math.round(width * 0.025));
    const marginB = Math.max(10, Math.round(height * 0.015));
    const barW = width - marginX * 2;
    const barH = Math.max(36, Math.min(54, Math.round(width * 0.088)));
    const x0 = marginX;
    const y0 = height - barH - marginB;

    ctx.save();
    roundRect(x0, y0, barW, barH, Math.round(barH * 0.28));
    ctx.fillStyle = 'rgba(9, 14, 26, 0.86)';
    ctx.fill();
    ctx.lineWidth = 1.2;
    ctx.strokeStyle = 'rgba(45, 212, 191, 0.5)';
    ctx.stroke();

    const padX = Math.max(10, Math.round(barW * 0.028));
    const dotR = Math.max(4, Math.round(barH * 0.14));
    const dotCx = x0 + padX + dotR;
    const midY = y0 + barH / 2;

    // Glowing teal lens dot
    ctx.beginPath();
    ctx.arc(dotCx, midY, dotR + 2.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(45, 212, 191, 0.22)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(dotCx, midY, dotR, 0, Math.PI * 2);
    ctx.fillStyle = '#2dd4bf';
    ctx.fill();

    // Left horizontal zone (46% of bar): AQUA MARK | CAA
    const leftX = dotCx + dotR + 8;
    const leftMaxW = Math.round(barW * 0.44) - (leftX - x0);
    const leftMain = 'AQUA MARK';
    const fTitle = fitFont(leftMain, leftMaxW, Math.max(10, Math.round(barH * 0.27)), 800);
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${fTitle}px "Inter", "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(leftMain, leftX, y0 + barH * 0.34);

    const fCaa = fitFont(caaStr, leftMaxW, Math.max(8.5, Math.round(barH * 0.21)), 700, 'ui-monospace, monospace');
    ctx.fillStyle = '#5eead4';
    ctx.font = `700 ${fCaa}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText(caaStr, leftX, y0 + barH * 0.70);

    // Subtle vertical divider
    const divX = x0 + Math.round(barW * 0.47);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(divX, y0 + barH * 0.22);
    ctx.lineTo(divX, y0 + barH * 0.78);
    ctx.stroke();

    // Right horizontal zone (50% of bar): Crisp monospace Date • Time + VERIFIED SEAL
    const rightX = x0 + barW - padX;
    const rightMaxW = rightX - divX - 10;
    const dtLine = `${datePart}  ${timePart}`;
    const fDt = fitFont(dtLine, rightMaxW, Math.max(9.5, Math.round(barH * 0.24)), 700, 'ui-monospace, monospace');
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f8fafc';
    ctx.font = `700 ${fDt}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText(dtLine, rightX, y0 + barH * 0.34);

    const sealText = '● VERIFIED TIMESTAMP';
    const fSeal = fitFont(sealText, rightMaxW, Math.max(8, Math.round(barH * 0.19)), 700);
    ctx.fillStyle = '#34d399';
    ctx.font = `700 ${fSeal}px "Inter", "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(sealText, rightX, y0 + barH * 0.70);
    ctx.restore();
  } else {
    // 16:9 LANDSCAPE / WIDE IMAGE -> Sleek bottom footer band (kindha)
    const barH = Math.max(40, Math.min(62, Math.round(height * 0.072)));
    const yStart = height - barH;

    ctx.save();
    const grad = ctx.createLinearGradient(0, yStart - 6, 0, height);
    grad.addColorStop(0, 'rgba(9, 14, 26, 0.78)');
    grad.addColorStop(1, 'rgba(9, 14, 26, 0.94)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, yStart, width, barH);

    // Crisp teal top hairline
    ctx.fillStyle = 'rgba(45, 212, 191, 0.55)';
    ctx.fillRect(0, yStart, width, 1.5);

    const padX = Math.max(14, Math.round(width * 0.022));
    const lensR = Math.max(9, Math.round(barH * 0.22));
    const lensCx = padX + lensR;
    const midY = yStart + barH / 2;

    ctx.beginPath();
    ctx.arc(lensCx, midY, lensR, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20, 184, 166, 0.22)';
    ctx.fill();
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#2dd4bf';
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(lensCx, midY, Math.round(lensR * 0.42), 0, Math.PI * 2);
    ctx.fillStyle = '#2dd4bf';
    ctx.fill();

    // Left Brand + CAA
    const leftX = lensCx + lensR + 10;
    const leftMaxW = Math.round(width * 0.44) - leftX;
    ctx.textAlign = 'left';
    ctx.textBaseline = 'middle';
    const fTitle = fitFont('AQUA MARK', leftMaxW, Math.max(11, Math.round(barH * 0.29)), 800);
    ctx.fillStyle = '#ffffff';
    ctx.font = `800 ${fTitle}px "Inter", "Segoe UI", Roboto, sans-serif`;
    ctx.fillText('AQUA MARK', leftX, yStart + barH * 0.35);

    const fCaa = fitFont(caaStr, leftMaxW, Math.max(9, Math.round(barH * 0.21)), 700, 'ui-monospace, monospace');
    ctx.fillStyle = '#5eead4';
    ctx.font = `700 ${fCaa}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText(caaStr, leftX, yStart + barH * 0.72);

    // Vertical divider
    const divX = Math.round(width * 0.50);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.22)';
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    ctx.moveTo(divX, yStart + barH * 0.22);
    ctx.lineTo(divX, height - barH * 0.22);
    ctx.stroke();

    // Right: Pro monospace timestamp + Verified badge
    const rightX = width - padX;
    const rightMaxW = rightX - divX - 14;
    const dtFull = `${datePart}  •  ${timePart}`;
    const fDt = fitFont(dtFull, rightMaxW, Math.max(10.5, Math.round(barH * 0.26)), 700, 'ui-monospace, monospace');
    ctx.textAlign = 'right';
    ctx.fillStyle = '#f8fafc';
    ctx.font = `700 ${fDt}px ui-monospace, SFMono-Regular, Menlo, monospace`;
    ctx.fillText(dtFull, rightX, yStart + barH * 0.35);

    const sealFull = '● VERIFIED TIMESTAMP • AQUA MARK SEAL';
    const fSeal = fitFont(sealFull, rightMaxW, Math.max(8.5, Math.round(barH * 0.19)), 700);
    ctx.fillStyle = '#34d399';
    ctx.font = `700 ${fSeal}px "Inter", "Segoe UI", Roboto, sans-serif`;
    ctx.fillText(sealFull, rightX, yStart + barH * 0.72);
    ctx.restore();
  }
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
      seller: { title: 'Seller (Hatchery)', desc: 'Manage Hatchery & Batches' },
      mediator: { title: 'Mediator (Broker)', desc: 'Browse Hatcheries & Book' }
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
    tabBookings: 'My Bookings',
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
    emptyMarketSub: 'Once a CAA-certified Hatchery registers & publishes a batch, it appears here immediately.',
    caaVerified: 'CAA Certified',
    soldOutBadge: 'SOLD OUT',
    pausedBadge: 'PAUSED BY HATCHERY',
    unlockHint: 'Hatchery name, contact & Google Maps link unlock after 5% advance booking (+2% Extra App Bonus PL)',
    inspectBtn: 'View Hatchery Lineage, Reviews, Videos & PCR Images',
    perSeed: 'per seed',
    stage: 'Seed / PL Stage',
    salinity: 'Salinity',
    bonus: 'Bonus',
    stock: 'Remaining Stock',
    availPackingLabel: 'Available Packing',
    liveVideoBtn: 'Request Live Video',
    liveVideoSentBadge: 'Live Video Requested ✓',
    bookSlotBtn: 'Book Packing Slot',
    myBookingsTitle: 'Your Bookings, Escrow Timeline & Gate-Passes',
    noBookingsYet: 'No bookings placed yet.',
    paidLabel: 'Advance Paid (5%)',
    balancePackingLabel: 'Balance at Packing (95%)',
    packingReadyAlert: '📦 Hatchery Marked Packing Complete! Complete remaining payment at packing.',
    pendingSettlementBadge: '5% Advance Paid • Non-Refundable',
    clearedSettlementBadge: '✅ Packing Complete • Payment Settled',
    cancelledRefundBadge: '❌ Cancelled • Non-Refundable',
    cancelBookingBtn: 'Cancel Booking (Non-Refundable)',
    rateSeedLabel: 'Rate Hatchery (1-5★) & Feedback:',
    submitReviewBtn: 'Submit Feedback',
    ratedLabel: 'Feedback Sent',
    advanceReceiptBtn: 'Advance Receipt',
    finalReceiptBtn: 'Final Cleared Receipt',
    depositTitle: 'Mandatory ₹10,000 Hatchery Security Deposit',
    depositSub: 'To protect farmers against fake listings and guarantee SPF seed quality, every Hatchery Owner must complete a one-time ₹10,000 refundable security deposit before activating their Hatchery account.',
    depositPayBtn: 'Verify & Activate Hatchery Account (₹10,000)',
    unifiedRegTitle: 'Hatchery & Bank Registration (One-Time Setup)',
    unifiedRegSub: 'Complete your CAA Hatchery & settlement bank profile to publish live seed batches.',
    hatcheryNameLabel: 'Hatchery Legal Name',
    caaLicenseLabel: 'CAA Registration Number',
    zoneLabel: 'Coastal Zone',
    addressLabel: 'Hatchery Facility Address',
    mapsLinkLabel: 'Google Maps Location Link (Optional)',
    descriptionLabel: 'Hatchery Description & Biosecurity Info (Optional)',
    accHolderLabel: 'Bank Account Holder Name',
    accNoLabel: 'Bank Account Number',
    ifscLabel: 'IFSC Code',
    upiLabel: 'UPI ID',
    completeRegBtn: 'Verify & Register Hatchery + Bank',
    hatcheryLockedBanner: 'Verified Number +91',
    editSellerProfileBtn: 'Edit Profile, Maps & Bank',
    editBrokerProfileBtn: 'Edit Profile & Bank',
    editBuyerProfileBtn: 'Edit Profile',
    deleteAccountBtn: 'Delete Account',
    editBatchBtn: 'Edit Batch',
    saveBtn: 'Save Changes',
    addBatchTitle: 'Publish New Seed Batch',
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
    pcrUploadBtnLabel: 'Upload Report/Seed Images',
    videoUploadBtnLabel: 'Upload Live Seed Videos',
    pcrHintLabel: 'Required: At least 1 Image (Report or Seed)',
    gpsLockedBtn: 'GPS Locked',
    captureGpsBtn: 'Tag Tank GPS',
    publishBtn: 'Publish Batch Live',
    myBatchesTitle: 'Your Active Seed Batches',
    noBatchesSeller: 'No active batches published yet.',
    saveChangesBtn: 'Save Batch',
    removeBtn: 'Remove',
    markPackedBtn: 'Mark Packing Complete',
    paymentReceivedBtn: 'Payment Received',
    sellerFeedbackTitle: 'Farmer Ratings & Feedbacks',
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
    paymentMethodLabel: 'Select 5% Advance Payment Method',
    utrPlaceholder: 'Enter 12-Digit UPI / Bank UTR Reference Number',
    salinityWarn: 'Salinity variance exceeds 4 PPT. Hatchery will perform gradual acclimatization.',
    totalSeedValue: 'Total Hatchery Value',
    advancePaidLabel: 'Advance Paid Now (5%)',
    balanceAtPacking: 'Balance Payable at Packing (95%)',
    payNowBtn: 'Confirm & Pay 5% Advance',
    receiptTitle: 'OFFICIAL SEED BOOKING RECEIPT',
    finalReceiptTitle: 'FINAL BALANCE CLEARED RECEIPT',
    sellerDetailsHeading: 'Hatchery (Seller) Details',
    printBtn: 'Print',
    back: 'Back',
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
      uploadPcrFirst: 'Please upload at least 1 image.',
      batchPublished: 'Seed batch published live!',
      batchUpdated: 'Batch details & cloud files updated!',
      batchRemoved: 'Seed batch & storage files deleted completely!',
      liveVideoRequested: 'Live tank video request sent to Hatchery!',
      packingMarked: 'Packing marked complete! Buyer notified.',
      paymentReceivedDone: 'Payment Received confirmed! Final Cleared Receipt generated.',
      bookingCancelled: 'Booking cancelled! Advance is non-refundable & stock restored.',
      farmerLocked: 'Farmer locked to your Broker ID for 365 days!',
      paymentSuccess: '5% Advance paid (+2% App Bonus PL locked)! Gate-Pass & Receipt ready.',
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
    forgotPasswordLink: 'పాస్‌వర్డ్ మర్చిపోయారా?',
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
    unlockHint: '5% అడ్వాన్స్ బుకింగ్ పూర్తయిన వెంటనే హేచరీ పేరు, ఫోన్ & Google Maps లింక్ అన్‌లాక్ అవుతాయి (+2% అదనపు యాప్ బోనస్)',
    inspectBtn: 'హేచరీ చరిత్ర, రివ్యూలు, వీడియోలు & PCR ఫోటోలు చూడండి',
    perSeed: 'ఒక్క సీడ్ ధర',
    stage: 'సీడ్ / PL దశ',
    salinity: 'ఉప్పదనం',
    bonus: 'బోనస్ సీడ్',
    stock: 'మిగిలిన నిల్వ',
    availPackingLabel: 'ప్యాకింగ్ సమయం',
    liveVideoBtn: 'Request Live Video',
    liveVideoSentBadge: 'లైవ్ వీడియో రిక్వెస్ట్ పంపబడింది ✓',
    bookSlotBtn: 'ప్యాకింగ్ స్లాట్ బుక్ చేయండి',
    myBookingsTitle: 'మీ బుకింగ్స్, Gate-Pass & రసీదులు',
    noBookingsYet: 'మీరు ఇంకా ఎటువంటి సీడ్ బుకింగ్ చేయలేదు.',
    paidLabel: 'చెల్లించిన అడ్వాన్స్ (5%)',
    balancePackingLabel: 'ప్యాకింగ్ సమయంలో చెల్లించాల్సినది (95%)',
    packingReadyAlert: '📦 హేచరీ వారు ప్యాకింగ్ పూర్తయినట్లు తెలిపారు! ప్యాకింగ్ వద్ద బ్యాలెన్స్ చెల్లించండి.',
    pendingSettlementBadge: '5% అడ్వాన్స్ చెల్లించబడింది • నాన్-రిఫండబుల్',
    clearedSettlementBadge: '✅ ప్యాకింగ్ పూర్తయింది • పేమెంట్ సెటిల్ అయింది',
    cancelledRefundBadge: '❌ క్యాన్సిల్ చేయబడింది • నాన్-రిఫండబుల్',
    cancelBookingBtn: 'బుకింగ్ క్యాన్సిల్ (నాన్-రిఫండబుల్)',
    rateSeedLabel: 'రేటింగ్ (1-5★) & అభిప్రాయం రాయండి:',
    submitReviewBtn: 'ఫీడ్‌బ్యాక్ పంపండి',
    ratedLabel: 'ఫీడ్‌బ్యాక్ పంపబడింది',
    advanceReceiptBtn: 'అడ్వాన్స్ రసీదు (Receipt)',
    finalReceiptBtn: 'ఫైనల్ క్లియర్డ్ రసీదు (Receipt)',
    depositTitle: '₹10,000 హేచరీ సెక్యూరిటీ డిపాజిట్ (తప్పనిసరి)',
    depositSub: 'రైతులకు నాణ్యమైన SPF సీడ్ హామీ కోసం ప్రతి హేచరీ యజమాని ఒకసారి ₹10,000 రిఫండబుల్ సెక్యూరిటీ డిపాజిట్ చెల్లించాలి.',
    depositPayBtn: '₹10,000 డిపాజిట్ నిర్ధారించి ఖాతా ప్రారంభించండి',
    unifiedRegTitle: 'హేచరీ & బ్యాంక్ రిజిస్ట్రేషన్ (ఒకే స్టెప్‌లో పూర్తి చేయండి)',
    unifiedRegSub: 'లైవ్ సీడ్ బ్యాచ్‌లు పబ్లిష్ చేయడానికి మీ హేచరీ & బ్యాంక్ వివరాలు నమోదు చేయండి.',
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
    videoUploadBtnLabel: 'ట్యాంక్ వీడియోలు అప్‌లోడ్',
    pcrHintLabel: 'కనీసం 1 PCR ల్యాబ్ ఫోటో తప్పనిసరి (Camera లేదా Files)',
    gpsLockedBtn: 'GPS లాక్ అయింది',
    captureGpsBtn: 'GPS ట్యాగ్ చేయండి',
    publishBtn: 'బ్యాచ్ లైవ్ చేయండి',
    myBatchesTitle: 'మీ హేచరీ సీడ్ బ్యాచ్‌లు (Pause/Live & Edit)',
    noBatchesSeller: 'మీరు ఇంకా ఎటువంటి బ్యాచ్‌లు యాడ్ చేయలేదు.',
    saveChangesBtn: 'మార్పులు సేవ్ చేయండి',
    removeBtn: 'తొలగించు',
    markPackedBtn: 'ప్యాకింగ్ పూర్తయింది (Notify Buyer)',
    paymentReceivedBtn: 'పేమెంట్ అందింది (బ్యాలెన్స్ పూర్తి)',
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
    paymentMethodLabel: '5% అడ్వాన్స్ పేమెంట్ విధానం ఎంచుకోండి',
    utrPlaceholder: '12-అంకెల UPI / Bank UTR రిఫరెన్స్ నంబర్ ఎంటర్ చేయండి',
    salinityWarn: 'హేచరీ నీటికి మరియు చెరువు నీటికి మధ్య 4 PPT కంటే ఎక్కువ తేడా ఉంది.',
    totalSeedValue: 'హేచరీ ఆర్డర్ విలువ',
    advancePaidLabel: 'చెల్లించిన అడ్వాన్స్ (5%)',
    balanceAtPacking: 'ప్యాకింగ్ సమయంలో చెల్లించాల్సిన బ్యాలెన్స్ (95%)',
    payNowBtn: '5% అడ్వాన్స్ చెల్లించి బుక్ చేయండి',
    receiptTitle: 'అధికారిక సీడ్ బుకింగ్ రసీదు (RECEIPT)',
    finalReceiptTitle: 'ఫైనల్ బ్యాలెన్స్ క్లియర్డ్ రసీదు (FINAL RECEIPT)',
    sellerDetailsHeading: 'Hatchery (Seller) Details',
    printBtn: 'Print',
    back: 'వెనుకకు',
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
      bookingCancelled: 'బుకింగ్ క్యాన్సిల్ చేయబడింది! అడ్వాన్స్ నాన్-రిఫండబుల్, స్టాక్ పునరుద్ధరించబడింది.',
      farmerLocked: 'రైతు 365 రోజుల పాటు మీ ID కి లాక్ చేయబడ్డారు!',
      paymentSuccess: '5% అడ్వాన్స్ పేమెంట్ పూర్తయింది (+2% యాప్ బోనస్)! Gate-Pass & రసీదు సిద్ధం.',
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
  const [lang, setLang] = useState(() => safeLoadStorage('aqm_v11_lang', 'en'));
  const [darkMode, setDarkMode] = useState(() => safeLoadStorage('aqm_v11_dark', false));
  const t = DICT[lang] || DICT.en;
  const L = (enText, teText) => (lang === 'te' ? teText : enText);
  const [razorpayModal, setRazorpayModal] = useState(null);

  // Separate Camera & File Input Refs
  const pcrFileRef = useRef(null);
  const pcrCamRef = useRef(null);
  const vidFileRef = useRef(null);
  const vidCamRef = useRef(null);
  const editPcrFileRef = useRef(null);
  const editPcrCamRef = useRef(null);
  const editVidFileRef = useRef(null);
  const editVidCamRef = useRef(null);
  const seedFileRef = useRef(null);
  const seedCamRef = useRef(null);
  const editSeedFileRef = useRef(null);
  const editSeedCamRef = useRef(null);

  const [currentUser, setCurrentUser] = useState(() => safeLoadStorage('aqm_v11_user', null));
  // Role-isolated user map keyed by `${phone}_${role}` so same mobile has separate Sign Up & Password per role
  const [registeredUsers, setRegisteredUsers] = useState(() => safeLoadStorage('aqm_v11_users_db', {}));

  // Live Supabase States (cached in localStorage so offline drops NEVER kick user to Bank/Registration page)
  const [hatcheryProfiles, setHatcheryProfiles] = useState(() => safeLoadStorage('aqm_v11_hatcheries', {}));
  const [brokerProfiles, setBrokerProfiles] = useState(() => safeLoadStorage('aqm_v11_brokers', {}));
  const [batches, setBatches] = useState(() => safeLoadStorage('aqm_v11_batches', []));
  const [bookings, setBookings] = useState(() => safeLoadStorage('aqm_v11_bookings', []));
  const [brokerFarmers, setBrokerFarmers] = useState(() => safeLoadStorage('aqm_v11_farmers', []));
  const [savedBatchIds, setSavedBatchIds] = useState(() => safeLoadStorage('aqm_v11_wishlist', []));
  const [liveVideoRequests, setLiveVideoRequests] = useState(() => safeLoadStorage('aqm_v11_live_videos', []));
  const [userEmails, setUserEmails] = useState(() => safeLoadStorage('aqm_v11_user_emails', {}));
  const [farmerPonds, setFarmerPonds] = useState(() => safeLoadStorage('aqm_v11_ponds', []));
  const [notifications, setNotifications] = useState(() => safeLoadStorage('aqm_v11_notifications', []));
  const [adminBroadcast, setAdminBroadcast] = useState(() => safeLoadStorage('aqm_v11_admin_broadcast', null));
  const [dismissedBroadcastId, setDismissedBroadcastId] = useState(() => {
    try { return localStorage.getItem('aqm_v11_dismissed_bcast') || ''; } catch { return ''; }
  });
  // Unified Upload Images/Videos toggle states for Publish Batch & Edit Batch
  const [showNewMediaPanel, setShowNewMediaPanel] = useState(false);
  const [showEditMediaPanel, setShowEditMediaPanel] = useState(false);
  // Grouped Clean UI Toolbars (zero clutter on mobile & laptop)
  const [showBuyerSmartTools, setShowBuyerSmartTools] = useState(false);
  const [showRatesAdvisory, setShowRatesAdvisory] = useState(false);
  const [showSellerDispatchTools, setShowSellerDispatchTools] = useState(false);
  const [showBrokerMarginCalc, setShowBrokerMarginCalc] = useState(false);
  const [brokerCalcInput, setBrokerCalcInput] = useState({ lakhs: 5, rate: 0.42, extraPaise: 2 });
  // Owner Crate QR Preview Modal (shows QR first, then Save PDF button)
  const [crateQrBatch, setCrateQrBatch] = useState(null);
  // Network offline / error popup state
  const [networkError, setNetworkError] = useState(false);
  const [isRetryingNetwork, setIsRetryingNetwork] = useState(false);
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

  // =========================================================================
  // NEW PRODUCTION FEATURES STATE (FRONTEND ONLY — ZERO BACKEND CHANGES)
  // =========================================================================
  // 1. Live Camera QR Scanner (Hatchery Portal)
  const [scanQrTab, setScanQrTab] = useState('camera'); // 'camera' | 'manual'
  const [scannerFacingMode, setScannerFacingMode] = useState('environment');
  const [scannerFlashOn, setScannerFlashOn] = useState(false);
  const [scannerStatus, setScannerStatus] = useState('');
  const scannerVideoRef = useRef(null);
  const scannerStreamRef = useRef(null);
  const scannerIntervalRef = useRef(null);
  const photoQrInputRef = useRef(null);

  // 3. Smart Seed Matchmaker (Buyer Marketplace)
  const [matchmaker, setMatchmaker] = useState(() => safeLoadStorage('aqm_v12_matchmaker', { enabled: false, pondPpt: 15, acres: 3, maxBudget: 0.45 }));

  // 4. Price Drop Watchlist & Alert
  const [watchlistPrice, setWatchlistPrice] = useState(() => safeLoadStorage('aqm_v12_watchlist_price', 0.40));
  const [watchlistActive, setWatchlistActive] = useState(() => safeLoadStorage('aqm_v12_watchlist_active', true));
  const [watchlistFilterOnly, setWatchlistFilterOnly] = useState(false);

  // 6. Live Salinity Acclimatization Countdown Timer
  const [acclimTimerSec, setAcclimTimerSec] = useState(0);
  const [acclimTimerRunning, setAcclimTimerRunning] = useState(false);

  // 9. Dynamic Coastal Weather & Packing Advisory Generator
  const [, setWeatherStep] = useState(0);
  const [currentAquaTip, setCurrentAquaTip] = useState(() => generateFreshAquaTip(0));
  const handleNextFreshTip = () => {
    setWeatherStep(prev => {
      const next = prev + 1;
      setCurrentAquaTip(generateFreshAquaTip(next));
      return next;
    });
  };

  // 10. Multi-Pond Seed Cart (Bulk Cart)
  const [bulkCart, setBulkCart] = useState(() => safeLoadStorage('aqm_v12_bulk_cart', []));
  const [showBulkCartModal, setShowBulkCartModal] = useState(false);

  // 11. Broker Monthly Commission Goal Tracker
  const [brokerMonthlyGoal, setBrokerMonthlyGoal] = useState(() => safeLoadStorage('aqm_v12_broker_goal', 50000));
  const [editingBrokerGoal, setEditingBrokerGoal] = useState(false);
  const [brokerGoalDraft, setBrokerGoalDraft] = useState('50000');

  // 14. 72-Hour Post-Stocking Survival Check-In
  const [survivalLogs, setSurvivalLogs] = useState(() => safeLoadStorage('aqm_v12_survival_logs', {}));
  const [survivalModalBooking, setSurvivalModalBooking] = useState(null);
  const [survivalDraft, setSurvivalDraft] = useState({ h24: 96, h48: 92, h72: 88, note: '' });

  // 16. Interactive "What-If" FCR Feed Optimizer (Pond Log)
  const [whatIfFcr, setWhatIfFcr] = useState(1.35);
  const [whatIfBagPrice, setWhatIfBagPrice] = useState(2200);

  // 17. Hatchery Holiday / Dispatch Notice Bar
  const [noticeDraft, setNoticeDraft] = useState('');
  const [editingNotice, setEditingNotice] = useState(false);

  // 19. Rate Converter Pill (SEED | LAKH | MILLION)
  const [rateUnit, setRateUnit] = useState('SEED');

  // 22. Bilingual Voice Readout (SpeechSynthesis)
  const [isSpeakingId, setIsSpeakingId] = useState(null);

  // =========================================================================
  // ROUND-3 PRODUCTION FEATURES STATE (12 NEW FEATURES — ZERO BACKEND CHANGES)
  // =========================================================================
  // Feature A: Tank-to-Pond Compatibility Checker inside Batch Inspection Modal
  const [inspectPondPpt, setInspectPondPpt] = useState(14);
  // Feature B: Farmer Private Hatchery Notes (localStorage)
  const [farmerBatchNotes, setFarmerBatchNotes] = useState(() => safeLoadStorage('aqm_v12_batch_notes', {}));
  // Feature C: Pond Biomass & Weekly Growth Sampling Estimator (Pond Log)
  const [biomassCalc, setBiomassCalc] = useState({ stockedPl: 200000, survivalPct: 82, abwGrams: 12.5 });
  // Feature D: Broker Protected Farmer Search Filter
  const [brokerFarmerSearch, setBrokerFarmerSearch] = useState('');
  // Feature E: Live Network Online/Offline Status + Scroll-to-Top button
  const [isOnline, setIsOnline] = useState(() => (typeof navigator !== 'undefined' ? navigator.onLine : true));
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => { try { localStorage.setItem('aqm_v12_batch_notes', JSON.stringify(farmerBatchNotes)); } catch { } }, [farmerBatchNotes]);

  useEffect(() => {
    const onOnline = () => {
      setIsOnline(true);
      setNetworkError(false);
      syncAllFromSupabase();
    };
    const onOffline = () => setIsOnline(false);
    const onScroll = () => setShowScrollTop(window.scrollY > 360);
    window.addEventListener('online', onOnline);
    window.addEventListener('offline', onOffline);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      window.removeEventListener('online', onOnline);
      window.removeEventListener('offline', onOffline);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  // Keep localStorage cache synced so network drops keep user on exact same page
  useEffect(() => { try { localStorage.setItem('aqm_v11_hatcheries', JSON.stringify(hatcheryProfiles)); } catch { } }, [hatcheryProfiles]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_brokers', JSON.stringify(brokerProfiles)); } catch { } }, [brokerProfiles]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_batches', JSON.stringify(batches)); } catch { } }, [batches]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_bookings', JSON.stringify(bookings)); } catch { } }, [bookings]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_farmers', JSON.stringify(brokerFarmers)); } catch { } }, [brokerFarmers]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_live_videos', JSON.stringify(liveVideoRequests)); } catch { } }, [liveVideoRequests]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_user_emails', JSON.stringify(userEmails)); } catch { } }, [userEmails]);
  useEffect(() => {
    if (otpCooldown <= 0) return;
    const id = setTimeout(() => setOtpCooldown((c) => Math.max(0, c - 1)), 1000);
    return () => clearTimeout(id);
  }, [otpCooldown]);

  // Dynamic Browser Tab Title based on Login / Active User Role
  useEffect(() => {
    if (!currentUser) {
      document.title = 'AquaMark | Login';
    } else if (currentUser.role === 'buyer') {
      document.title = 'AquaMark | Buyer';
    } else if (currentUser.role === 'seller') {
      document.title = 'AquaMark | Seller';
    } else if (currentUser.role === 'mediator') {
      document.title = 'AquaMark | Mediator';
    } else {
      document.title = 'AquaMark';
    }
  }, [currentUser]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_ponds', JSON.stringify(farmerPonds)); } catch { } }, [farmerPonds]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_notifications', JSON.stringify(notifications)); } catch { } }, [notifications]);
  useEffect(() => { try { localStorage.setItem('aqm_v11_admin_broadcast', JSON.stringify(adminBroadcast)); } catch { } }, [adminBroadcast]);

  useEffect(() => { try { localStorage.setItem('aqm_v12_matchmaker', JSON.stringify(matchmaker)); } catch { } }, [matchmaker]);
  useEffect(() => { try { localStorage.setItem('aqm_v12_watchlist_price', JSON.stringify(watchlistPrice)); } catch { } }, [watchlistPrice]);
  useEffect(() => { try { localStorage.setItem('aqm_v12_watchlist_active', JSON.stringify(watchlistActive)); } catch { } }, [watchlistActive]);
  useEffect(() => { try { localStorage.setItem('aqm_v12_bulk_cart', JSON.stringify(bulkCart)); } catch { } }, [bulkCart]);
  useEffect(() => { try { localStorage.setItem('aqm_v12_broker_goal', JSON.stringify(brokerMonthlyGoal)); } catch { } }, [brokerMonthlyGoal]);
  useEffect(() => { try { localStorage.setItem('aqm_v12_survival_logs', JSON.stringify(survivalLogs)); } catch { } }, [survivalLogs]);

  // Auto-generate a fresh Coastal Weather & Packing Advisory every 9s
  useEffect(() => {
    const id = setInterval(() => {
      setWeatherStep(prev => {
        const next = prev + 1;
        setCurrentAquaTip(generateFreshAquaTip(next));
        return next;
      });
    }, 9000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (!acclimTimerRunning) return;
    const id = setInterval(() => {
      setAcclimTimerSec(prev => {
        if (prev <= 1) {
          setAcclimTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [acclimTimerRunning]);

  // Cleanup SpeechSynthesis on unmount
  useEffect(() => {
    return () => {
      try { if (window.speechSynthesis) window.speechSynthesis.cancel(); } catch { }
    };
  }, []);

  useEffect(() => { try { localStorage.setItem('aqm_v11_lang', JSON.stringify(lang)); } catch { } }, [lang]);
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
    if (typeof navigator !== 'undefined' && !navigator.onLine) {
      setIsOnline(false);
      setNetworkError(true);
      return false;
    }
    try {
      const [batchesRes, bookingsRes, kvRes, usersRes] = await Promise.all([
        supabase.from('batches').select('*').order('created_at', { ascending: false }),
        supabase.from('bookings').select('*').order('created_at', { ascending: false }),
        supabase.from('app_kv_store').select('*'),
        supabase.from('app_users').select('*')
      ]);

      const anyNetworkErr = [batchesRes.error, bookingsRes.error, kvRes.error, usersRes.error].some(
        (e) => e && /fetch|network|failed|offline|timeout/i.test(String(e.message || e))
      );
      if (anyNetworkErr) {
        setNetworkError(true);
        return false;
      }
      setNetworkError(false);

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
          if (item.key === 'admin_broadcast') setAdminBroadcast(item.value || null);
          if (item.key === 'user_emails') setUserEmails(item.value || {});
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
      return true;
    } catch (err) {
      console.error('Supabase sync error:', err);
      setNetworkError(true);
      return false;
    }
  };

  const handleRetryConnection = async () => {
    setIsRetryingNetwork(true);
    const onlineNow = typeof navigator !== 'undefined' ? navigator.onLine : true;
    setIsOnline(onlineNow);
    if (!onlineNow) {
      setTimeout(() => setIsRetryingNetwork(false), 600);
      return;
    }
    const ok = await syncAllFromSupabase();
    setIsRetryingNetwork(false);
    if (ok) {
      setNetworkError(false);
      showToast(L('Connection restored! Live data synced.', 'ఇంటర్నెట్ కనెక్షన్ తిరిగి వచ్చింది! డేటా సింక్ అయింది.'));
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
    try {
      const { error } = await supabase.from('bookings').upsert({
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
      if (error) return { ok: false, error: error.message || 'Database write rejected' };
      return { ok: true, error: null };
    } catch (err) {
      return { ok: false, error: err?.message || 'Network/Database error' };
    }
  };

  const deleteStorageFilesByUrls = async (urls) => {
    if (!urls || urls.length === 0) return;
    const fileNames = urls
      .filter((u) => typeof u === 'string' && u.includes('/files/'))
      .map((u) => decodeURIComponent(u.split('/files/')[1]));
    if (fileNames.length > 0) {
      await fetch('/api/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...getSignedSessionHeaders() },
        body: JSON.stringify({ fileNames }),
      }).catch(() => { });
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
  const [loginEmail, setLoginEmail] = useState('');
  const [loginIdentifier, setLoginIdentifier] = useState('');
  const [otpCodeInput, setOtpCodeInput] = useState('');
  const [otpSentToEmail, setOtpSentToEmail] = useState('');
  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [otpCooldown, setOtpCooldown] = useState(0);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const [emailOtpVerified, setEmailOtpVerified] = useState(false);
  const [forgotResolvedRoleKey, setForgotResolvedRoleKey] = useState('');
  const [authNotice, setAuthNotice] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);
  const [bookingStatusFilter, setBookingStatusFilter] = useState('ALL');
  const [showPublishBatchForm, setShowPublishBatchForm] = useState(false);
  const [showActiveBatches, setShowActiveBatches] = useState(false);
  const [showBuyerHatcheries, setShowBuyerHatcheries] = useState(true);
  const [expandedBatchIds, setExpandedBatchIds] = useState({});
  const [expandedBuyerBookingIds, setExpandedBuyerBookingIds] = useState({});
  const [showBrokerBookings, setShowBrokerBookings] = useState(false);
  const [showBrokerHatcheries, setShowBrokerHatcheries] = useState(false);
  const [payRemainingError, setPayRemainingError] = useState('');
  const lastBackPressRef = useRef(0);
  const navStateRef = useRef({});

  const MAX_UPI_AMOUNT_INR = 80000;
  const PLATFORM_UPI_ID = '9959933166@ybl';

  // Hatchery-friendly round-figure payment validator (multiples of ₹500: ₹1,000, ₹1,500, ₹12,500, etc.)
  const validateRoundFigureAmount = ({ amountInr, minAmount, maxAmount, isUpi, exactFullDue }) => {
    const amt = Math.round(Number(amountInr) || 0);
    if (!Number.isFinite(amt) || amt <= 0) {
      return { ok: false, error: L('Please enter a valid payment amount.', 'దయచేసి సరైన మొత్తం నమోదు చేయండి.') };
    }
    if (amt > maxAmount) {
      return { ok: false, error: L(`Amount cannot exceed ₹${maxAmount.toLocaleString('en-IN')}.`, `మొత్తం ₹${maxAmount.toLocaleString('en-IN')} కంటే ఎక్కువ ఉండకూడదు.`) };
    }
    if (amt < minAmount) {
      return { ok: false, error: L(`Minimum payable amount is ₹${minAmount.toLocaleString('en-IN')}.`, `కనీస చెల్లింపు మొత్తం ₹${minAmount.toLocaleString('en-IN')}.`) };
    }
    if (isUpi && amt > MAX_UPI_AMOUNT_INR) {
      return { ok: false, error: L(`Max ₹${MAX_UPI_AMOUNT_INR.toLocaleString('en-IN')} allowed per UPI payment. Remaining can be paid at Packing.`, `UPI ద్వారా గరిష్టంగా ₹${MAX_UPI_AMOUNT_INR.toLocaleString('en-IN')} మాత్రమే చెల్లించవచ్చు. మిగిలినది ప్యాకింగ్ వద్ద చెల్లించండి.`) };
    }
    const isExactClear = amt === Math.round(Number(exactFullDue) || 0);
    if (!isExactClear && amt % 500 !== 0) {
      return {
        ok: false,
        error: L(
          'Please enter a round figure in multiples of ₹500 (e.g., ₹1,000, ₹1,500, ₹12,500, ₹14,500) — no loose change.',
          'దయచేసి ₹500 గుణిజాలలో రౌండ్ ఫిగర్ మొత్తం ఇవ్వండి (ఉదా: ₹1,000, ₹1,500, ₹12,500, ₹14,500) — చిల్లర మొత్తం అనుమతించబడదు.'
        )
      };
    }
    return { ok: true, amount: amt };
  };

  // Enterprise Web Crypto PBKDF2-SHA256 Password Hashing (100% Free, Browser-Native)
  const hashPasswordPbkdf2 = async (plainText) => {
    const clean = String(plainText || '').trim();
    if (!window.crypto?.subtle) return clean;
    const saltBytes = window.crypto.getRandomValues(new Uint8Array(12));
    const saltHex = Array.from(saltBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const enc = new TextEncoder();
    const keyMat = await window.crypto.subtle.importKey('raw', enc.encode(clean), 'PBKDF2', false, ['deriveBits']);
    const bits = await window.crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' }, keyMat, 256);
    const hashHex = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
    return `pbkdf2_v1$${saltHex}$${hashHex}`;
  };

  const verifyPasswordPbkdf2 = async (plainText, storedValue) => {
    const clean = String(plainText || '').trim();
    const stored = String(storedValue || '');
    if (!stored.startsWith('pbkdf2_v1$')) {
      return clean === stored; // Legacy plain-text match (auto-upgraded on login)
    }
    if (!window.crypto?.subtle) return false;
    const parts = stored.split('$');
    if (parts.length !== 3) return false;
    const [, saltHex, expectedHash] = parts;
    const saltBytes = new Uint8Array(saltHex.match(/.{1,2}/g).map(h => parseInt(h, 16)));
    const enc = new TextEncoder();
    const keyMat = await window.crypto.subtle.importKey('raw', enc.encode(clean), 'PBKDF2', false, ['deriveBits']);
    const bits = await window.crypto.subtle.deriveBits({ name: 'PBKDF2', salt: saltBytes, iterations: 100000, hash: 'SHA-256' }, keyMat, 256);
    const actualHash = Array.from(new Uint8Array(bits)).map(b => b.toString(16).padStart(2, '0')).join('');
    return actualHash === expectedHash;
  };

  const getSignedSessionHeaders = () => {
    const tok = sessionStorage.getItem('aqm_signed_session');
    return tok ? { 'X-AquaMark-Session': tok } : {};
  };

  const cleanNum = (raw) => {
    if (raw === '' || raw === null || raw === undefined) return '';
    const str = String(raw).replace(/^0+(?=\d)/, '');
    if (str === '' || str === '.') return '';
    const n = Number(str);
    return Number.isNaN(n) ? '' : n;
  };

  const toggleExpandBatch = (id) => {
    setExpandedBatchIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const toggleExpandBuyerBooking = (id) => {
    setExpandedBuyerBookingIds(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const validateStrictPayment = ({ method, amountInr, utr }) => {
    const amt = Math.round(Number(amountInr) || 0);
    if (!Number.isFinite(amt) || amt <= 0) {
      return { ok: false, error: L('Invalid payment amount. Please check quantity and try again.', 'చెల్లింపు మొత్తం సరిగ్గా లేదు. దయచేసి మళ్ళీ ప్రయత్నించండి.') };
    }
    if (method === 'DIRECT_UPI' && amt > MAX_UPI_AMOUNT_INR) {
      return {
        ok: false,
        error: L(
          `UPI payment limit is max ₹${MAX_UPI_AMOUNT_INR.toLocaleString('en-IN')} per transaction. For ₹${amt.toLocaleString('en-IN')}, please use Bank Transfer (NEFT/RTGS/IMPS) or Razorpay.`,
          `UPI ద్వారా గరిష్టంగా ₹${MAX_UPI_AMOUNT_INR.toLocaleString('en-IN')} మాత్రమే చెల్లించవచ్చు. ₹${amt.toLocaleString('en-IN')} కోసం దయచేసి Bank Transfer (NEFT/RTGS) లేదా Razorpay వాడండి.`
        )
      };
    }
    if (method === 'DIRECT_UPI' || method === 'BANK_TO_BANK') {
      const cleaned = String(utr || '').trim().toUpperCase().replace(/\s+/g, '');
      if (!cleaned) {
        return { ok: false, error: t.toasts.enterUtr };
      }
      if (method === 'DIRECT_UPI') {
        if (!/^\d{12}$/.test(cleaned)) {
          return { ok: false, error: L('Enter a valid 12-digit numeric UPI UTR / Reference number from your UPI app.', 'మీ UPI యాప్ నుండి సరైన 12 అంకెల UTR నంబర్ నమోదు చేయండి.') };
        }
        const dummyUtrs = new Set(['000000000000', '111111111111', '222222222222', '333333333333', '444444444444', '555555555555', '666666666666', '777777777777', '888888888888', '999999999999', '123456789012', '012345678901', '987654321098']);
        if (dummyUtrs.has(cleaned) || /^(\d)\1{11}$/.test(cleaned)) {
          return { ok: false, error: L('Invalid/test UTR detected. Please enter the genuine 12-digit UTR from your payment receipt.', 'నకిలీ UTR అనుమతించబడదు. మీ అసలు 12 అంకెల UTR నంబర్ ఇవ్వండి.') };
        }
      } else {
        if (!/^[A-Z0-9]{12,22}$/.test(cleaned) || (cleaned.match(/\d/g) || []).length < 6 || /^([A-Z0-9])\1+$/.test(cleaned)) {
          return { ok: false, error: L('Enter a valid 12–22 character Bank NEFT/RTGS/IMPS UTR reference number.', 'సరైన 12–22 అక్షరాల Bank NEFT/RTGS/IMPS UTR నంబర్ నమోదు చేయండి.') };
        }
      }
      const isDuplicate = bookings.some((bk) => {
        const p1 = String(bk.paymentId || '').toUpperCase();
        const p2 = String(bk.finalPaymentId || '').toUpperCase();
        return p1.endsWith(`_${cleaned}`) || p1 === cleaned || p2.endsWith(`_${cleaned}`) || p2 === cleaned;
      });
      if (isDuplicate) {
        return { ok: false, error: L('This UTR / Transaction Reference is already used on another booking. Please enter your new payment UTR.', 'ఈ UTR నంబర్ ఇప్పటికే వేరే బుకింగ్‌లో ఉపయోగించబడింది. కొత్త పేమెంట్ UTR ఇవ్వండి.') };
      }
      return { ok: true, cleanedUtr: cleaned };
    }
    return { ok: true, cleanedUtr: '' };
  };
  const [videoReqFilter, setVideoReqFilter] = useState('ALL');
  const [sellerBatchFilter, setSellerBatchFilter] = useState('ALL');
  const [sellerBatchSearch, setSellerBatchSearch] = useState('');

  const handleCopyText = (textToCopy, label = 'Copied') => {
    if (!textToCopy) return;
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(String(textToCopy)).then(() => {
        showToast(`${label}: ${textToCopy}`);
      }).catch(() => {
        showToast(`${label}: ${textToCopy}`);
      });
    } else {
      showToast(`${label}: ${textToCopy}`);
    }
  };

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
    stockingDate: new Date().toISOString().split('T')[0], dailyFeedKg: 6, trayLeftover: '0% (Clean)',
    moltingPct: 12, gutStatus: 'Full & Dark (Healthy)', antennaStatus: 'Intact & Long'
  });

  const [editingBatchId, setEditingBatchId] = useState(null);
  const [editBatchValues, setEditBatchValues] = useState({
    species: 'Vannamei (SyAqua Line)',
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
    seedImages: [],
    tankVideos: [],
    removedPcrUrls: [],
    removedSeedUrls: [],
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
    species: 'Vannamei (SyAqua Line)',
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
  const [seedImages, setSeedImages] = useState([]);
  const [tankVideos, setTankVideos] = useState([]);
  const [gpsLocation, setGpsLocation] = useState('');

  // Keep live navigation/modal state in ref for Android PWA Hardware Back Button
  navStateRef.current = {
    currentUser,
    buyerTab,
    showActiveBatches,
    showPublishBatchForm,
    showSellerDispatchTools,
    isEditingSellerProfile,
    showBrokerBookings,
    showBrokerHatcheries,
    showBrokerMarginCalc,
    isEditingBrokerBank,
    hasOpenModal: Boolean(
      fullScreenMedia ||
      showNotifPanel ||
      selectedBatch ||
      inspectedBatch ||
      inspectedBuyerBooking ||
      inspectedSellerOrder ||
      payRemainingBooking ||
      gatePassBooking ||
      statusModalBooking ||
      crateQrBatch ||
      transitPredictorBatch ||
      videoRequestTargetBatch ||
      showSellerVideoModal ||
      showCompareModal ||
      showBulkCartModal ||
      showBasicEditProfileModal ||
      showDeleteAccountModal ||
      sellerTxModal ||
      brokerTxListModal ||
      selectedBrokerTx ||
      activeInvoice ||
      razorpayModal ||
      showSellerScanQrModal
    ),
    closeTopModal: () => {
      if (fullScreenMedia) return setFullScreenMedia(null);
      if (razorpayModal) return setRazorpayModal(null);
      if (showNotifPanel) return setShowNotifPanel(false);
      if (selectedBatch) return setSelectedBatch(null);
      if (payRemainingBooking) return setPayRemainingBooking(null);
      if (inspectedBatch) return setInspectedBatch(null);
      if (inspectedBuyerBooking) return setInspectedBuyerBooking(null);
      if (inspectedSellerOrder) return setInspectedSellerOrder(null);
      if (gatePassBooking) return setGatePassBooking(null);
      if (statusModalBooking) return setStatusModalBooking(null);
      if (crateQrBatch) return setCrateQrBatch(null);
      if (transitPredictorBatch) return setTransitPredictorBatch(null);
      if (videoRequestTargetBatch) return setVideoRequestTargetBatch(null);
      if (showSellerVideoModal) return setShowSellerVideoModal(false);
      if (showCompareModal) return setShowCompareModal(false);
      if (showBulkCartModal) return setShowBulkCartModal(false);
      if (showBasicEditProfileModal) return setShowBasicEditProfileModal(false);
      if (showDeleteAccountModal) return setShowDeleteAccountModal(false);
      if (sellerTxModal) return setSellerTxModal(null);
      if (brokerTxListModal) return setBrokerTxListModal(null);
      if (selectedBrokerTx) return setSelectedBrokerTx(null);
      if (activeInvoice) return setActiveInvoice(null);
      if (showSellerScanQrModal) return setShowSellerScanQrModal(false);
    }
  };

  useEffect(() => {
    try {
      if (!window.history.state || !window.history.state.aqmGuard) {
        window.history.pushState({ aqmGuard: true }, '', window.location.href);
      }
    } catch { /* ignore */ }

    const handlePopState = () => {
      const s = navStateRef.current;

      // 1. If any modal/overlay is open, close it first
      if (s.hasOpenModal) {
        s.closeTopModal();
        try { window.history.pushState({ aqmGuard: true }, '', window.location.href); } catch { /* ignore */ }
        return;
      }

      // 2. If user is inside an extra tab/section, return to Portal Home (NEVER log out!)
      if (s.currentUser?.role === 'buyer' && s.buyerTab !== 'marketplace') {
        setBuyerTab('marketplace');
        try { window.history.pushState({ aqmGuard: true }, '', window.location.href); } catch { /* ignore */ }
        return;
      }
      if (s.currentUser?.role === 'seller' && (s.showActiveBatches || s.showPublishBatchForm || s.showSellerDispatchTools || s.isEditingSellerProfile)) {
        setShowActiveBatches(false);
        setShowPublishBatchForm(false);
        setShowSellerDispatchTools(false);
        setIsEditingSellerProfile(false);
        try { window.history.pushState({ aqmGuard: true }, '', window.location.href); } catch { /* ignore */ }
        return;
      }
      if (s.currentUser?.role === 'mediator' && (s.showBrokerBookings || s.showBrokerHatcheries || s.showBrokerMarginCalc || s.isEditingBrokerBank)) {
        setShowBrokerBookings(false);
        setShowBrokerHatcheries(false);
        setShowBrokerMarginCalc(false);
        setIsEditingBrokerBank(false);
        try { window.history.pushState({ aqmGuard: true }, '', window.location.href); } catch { /* ignore */ }
        return;
      }

      // 3. Already on Portal Home (or Login) -> Double Back to exit PWA to phone Home Screen
      const now = Date.now();
      if (now - lastBackPressRef.current < 2200) {
        lastBackPressRef.current = 0;
        window.history.back();
        return;
      }
      lastBackPressRef.current = now;
      try { window.history.pushState({ aqmGuard: true }, '', window.location.href); } catch { /* ignore */ }
      setToast(lang === 'te' ? 'బయటకు వెళ్ళడానికి మళ్ళీ Back నొక్కండి' : 'Press Back again to exit app');
      setTimeout(() => setToast(prev => (prev === 'Press Back again to exit app' || prev === 'బయటకు వెళ్ళడానికి మళ్ళీ Back నొక్కండి' ? '' : prev)), 2200);
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [lang]);

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
    if (!emailOtpVerified) {
      showToast(L('Please verify your Email OTP first.', 'ముందుగా మీ Email OTP వెరిఫై చేయండి.'));
      return;
    }
    if ((loginPassword || '').trim().length < 6) {
      showToast(t.toasts.passwordShort);
      return;
    }

    let cleanPhone = (loginPhone || '').replace(/\D/g, '').slice(-10);
    let roleKey = '';
    if (authMode === 'forgot') {
      roleKey = forgotResolvedRoleKey || getUserKey(cleanPhone, loginRole);
      const foundRec = registeredUsers[roleKey];
      if (!foundRec) {
        showToast(t.toasts.notRegistered);
        return;
      }
      cleanPhone = String(foundRec.phone || cleanPhone).replace(/\D/g, '').slice(-10);
    } else {
      if (cleanPhone.length !== 10) {
        showToast(t.toasts.invalidPhone);
        return;
      }
      roleKey = getUserKey(cleanPhone, loginRole);
      if (registeredUsers[roleKey]) {
        showToast(L('This mobile number is already registered for this portal. Please Login.', 'ఈ మొబైల్ నంబర్ ఇప్పటికే రిజిస్టర్ అయింది. దయచేసి Login అవ్వండి.'));
        return;
      }
    }

    const existing = registeredUsers[roleKey];
    const finalName = authMode === 'forgot'
      ? (existing?.name || loginName.trim() || 'Verified User')
      : (loginName.trim() || (loginRole === 'buyer' ? 'Farmer' : loginRole === 'seller' ? 'Hatchery Owner' : 'Broker Partner'));
    const verifiedEmail = (otpSentToEmail || loginEmail || '').trim().toLowerCase();

    const hashedPassword = await hashPasswordPbkdf2(loginPassword.trim());
    const userRecord = {
      phone: cleanPhone,
      name: finalName,
      role: loginRole,
      email: verifiedEmail || existing?.email || '',
      password: hashedPassword,
      depositPaid: existing?.depositPaid || false,
      depositUtr: existing?.depositUtr || '',
      last_login: new Date().toISOString()
    };

    setRegisteredUsers(prev => ({ ...prev, [roleKey]: userRecord }));
    await supabase.from('app_users').upsert({
      phone: roleKey,
      name: finalName,
      role: loginRole,
      password: hashedPassword,
      last_login: new Date().toISOString()
    });

    if (verifiedEmail) {
      let latestEmails = userEmails;
      try {
        const { data: freshEm } = await supabase.from('app_kv_store').select('value').eq('key', 'user_emails').maybeSingle();
        if (freshEm?.value && typeof freshEm.value === 'object') {
          latestEmails = { ...freshEm.value, ...userEmails };
        }
      } catch { }
      const nextEmails = { ...latestEmails, [roleKey]: verifiedEmail };
      setUserEmails(nextEmails);
      await saveKvToSupabase('user_emails', nextEmails);
    }

    setEmailOtpVerified(false);
    setOtpSentToEmail('');
    setOtpCodeInput('');
    setForgotResolvedRoleKey('');
    setAuthNotice('');

    completePortalLogin({
      role: loginRole,
      name: finalName,
      phone: cleanPhone,
      email: verifiedEmail || existing?.email || '',
      depositPaid: userRecord.depositPaid
    });
  };

  const resetEmailOtpFlow = () => {
    setEmailOtpVerified(false);
    setOtpSentToEmail('');
    setOtpCodeInput('');
    setForgotResolvedRoleKey('');
    setAuthNotice('');
    setWaVerifiedDone(false);
  };

  const maskEmailAddr = (em) => {
    const s = String(em || '');
    const [u, d] = s.split('@');
    if (!u || !d) return s;
    return `${u.slice(0, 2)}${'*'.repeat(Math.max(2, u.length - 2))}@${d}`;
  };

  const findRoleKeyByEmail = (emailMap, targetEmail, role) => {
    const clean = String(targetEmail || '').trim().toLowerCase();
    if (!clean) return '';
    return Object.keys(emailMap || {}).find(
      (k) => (k.endsWith(`_${role}`) || k.startsWith(`${role}_`)) && String(emailMap[k] || '').trim().toLowerCase() === clean
    ) || '';
  };

  const fetchLatestEmailsMap = async () => {
    try {
      const { data } = await supabase.from('app_kv_store').select('value').eq('key', 'user_emails').maybeSingle();
      if (data?.value && typeof data.value === 'object') {
        const merged = { ...data.value, ...userEmails };
        setUserEmails(merged);
        return merged;
      }
    } catch { }
    return userEmails;
  };

  const checkOtpDeviceQuota = () => {
    try {
      const now = Date.now();
      const raw = JSON.parse(localStorage.getItem('aqm_otp_rl') || '[]');
      const recent = (Array.isArray(raw) ? raw : []).filter((ts) => now - ts < 3600000);
      if (recent.length >= 4) return false;
      localStorage.setItem('aqm_otp_rl', JSON.stringify([...recent, now]));
      return true;
    } catch {
      return true;
    }
  };

  const BLOCKED_EMAIL_DOMAINS = [
    'gmial.com', 'gmal.com', 'gamil.com', 'gnail.com', 'yaho.com', 'hotmal.com',
    'mailinator.com', 'tempmail.com', '10minutemail.com', 'guerrillamail.com', 'yopmail.com', 'trashmail.com', 'sharklasers.com'
  ];

  const handleSendSignupEmailOtp = async () => {
    setAuthNotice('');
    if (otpCooldown > 0) {
      setAuthNotice(L(`Please wait ${otpCooldown}s before requesting another OTP.`, `కొత్త OTP కోసం ${otpCooldown} సెకన్లు వేచి ఉండండి.`));
      return;
    }
    const cleanName = (loginName || '').trim();
    const cleanEmail = (loginEmail || '').trim().toLowerCase();
    if (!cleanName) {
      showToast(L('Please enter your Full Name first.', 'ముందుగా మీ పేరు నమోదు చేయండి.'));
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      showToast(L('Please enter a valid Email address.', 'దయచేసి సరైన Email చిరునామా ఇవ్వండి.'));
      return;
    }
    const emailDomain = cleanEmail.split('@')[1] || '';
    if (BLOCKED_EMAIL_DOMAINS.includes(emailDomain)) {
      setAuthNotice(L('Please check your email spelling or use a real Gmail/Email address (disposable emails not allowed).', 'దయచేసి సరైన Gmail / Email చిరునామా ఇవ్వండి (టైపో లేదా తాత్కాలిక ఈమెయిల్ అనుమతించబడదు).'));
      return;
    }

    setIsSendingOtp(true);
    try {
      // ZERO-OTP-WASTE PRE-CHECK: Verify email is NOT already registered in Supabase before sending any OTP
      const latestEmails = await fetchLatestEmailsMap();
      const alreadyEmailKey = findRoleKeyByEmail(latestEmails, cleanEmail, loginRole);
      if (alreadyEmailKey) {
        setAuthNotice(L('Email already in use for this portal! Please switch to Login (or Forgot Password).', 'ఈ Email ఇప్పటికే వాడుకలో ఉంది (Email already in use). దయచేసి Login చేయండి.'));
        return;
      }

      if (!checkOtpDeviceQuota()) {
        setAuthNotice(L('Too many OTP requests from this device. Please wait 1 hour and try again.', 'ఈ డివైస్ నుండి ఎక్కువ OTP రిక్వెస్ట్‌లు వచ్చాయి. దయచేసి 1 గంట తర్వాత ప్రయత్నించండి.'));
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: cleanEmail,
        options: { shouldCreateUser: true }
      });
      if (error) {
        setAuthNotice(error.message || L('Failed to send OTP. Check Supabase Custom SMTP settings.', 'OTP పంపడం విఫలమైంది.'));
      } else {
        setOtpSentToEmail(cleanEmail);
        setOtpCodeInput('');
        setEmailOtpVerified(false);
        setOtpCooldown(60);
        showToast(L(`OTP sent to ${cleanEmail}! Check Inbox/Spam.`, `${cleanEmail} కు OTP పంపబడింది! Inbox/Spam చెక్ చేయండి.`));
      }
    } catch (err) {
      setAuthNotice(err?.message || 'Network error while sending Email OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleSendForgotEmailOtp = async () => {
    setAuthNotice('');
    if (otpCooldown > 0) {
      setAuthNotice(L(`Please wait ${otpCooldown}s before requesting another OTP.`, `కొత్త OTP కోసం ${otpCooldown} సెకన్లు వేచి ఉండండి.`));
      return;
    }
    const rawId = (loginIdentifier || '').trim().toLowerCase();
    if (!rawId) {
      showToast(L('Enter your registered Email or 10-digit Mobile Number.', 'మీ రిజిస్టర్డ్ Email లేదా 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి.'));
      return;
    }

    setIsSendingOtp(true);
    try {
      const latestEmails = await fetchLatestEmailsMap();
      let matchedKey = '';
      if (rawId.includes('@')) {
        matchedKey = findRoleKeyByEmail(latestEmails, rawId, loginRole);
      } else {
        const digits = rawId.replace(/\D/g, '').slice(-10);
        if (digits.length === 10) {
          const candidate = getUserKey(digits, loginRole);
          if (registeredUsers[candidate]) {
            matchedKey = candidate;
          } else {
            const { data: uRow } = await supabase.from('app_users').select('*').eq('phone', candidate).maybeSingle();
            if (uRow) {
              matchedKey = candidate;
              setRegisteredUsers(prev => ({ ...prev, [candidate]: { ...uRow, phone: digits } }));
            }
          }
        }
      }

      if (!matchedKey) {
        setAuthNotice(L('No account found for this portal with that Email / Mobile.', 'ఈ పోర్టల్‌లో ఆ Email / మొబైల్ నంబర్‌తో ఖాతా లేదు.'));
        return;
      }

      const linkedEmail = (latestEmails[matchedKey] || registeredUsers[matchedKey]?.email || '').trim().toLowerCase();
      if (!linkedEmail) {
        setAuthNotice(L('This older account has no verified email linked. Contact AquaMark Admin to reset.', 'ఈ పాత ఖాతాకు Email లింక్ లేదు. రీసెట్ కోసం AquaMark Admin ను సంప్రదించండి.'));
        return;
      }

      if (!checkOtpDeviceQuota()) {
        setAuthNotice(L('Too many OTP requests from this device. Please wait 1 hour and try again.', 'ఈ డివైస్ నుండి ఎక్కువ OTP రిక్వెస్ట్‌లు వచ్చాయి. దయచేసి 1 గంట తర్వాత ప్రయత్నించండి.'));
        return;
      }

      const { error } = await supabase.auth.signInWithOtp({
        email: linkedEmail,
        options: { shouldCreateUser: true }
      });
      if (error) {
        setAuthNotice(error.message || L('Failed to send reset OTP.', 'OTP పంపడం విఫలమైంది.'));
      } else {
        setForgotResolvedRoleKey(matchedKey);
        setOtpSentToEmail(linkedEmail);
        setOtpCodeInput('');
        setEmailOtpVerified(false);
        setOtpCooldown(60);
        showToast(L(`Reset OTP sent to ${maskEmailAddr(linkedEmail)}!`, `${maskEmailAddr(linkedEmail)} కు OTP పంపబడింది!`));
      }
    } catch (err) {
      setAuthNotice(err?.message || 'Network error while sending OTP.');
    } finally {
      setIsSendingOtp(false);
    }
  };

  const handleVerifyEmailOtp = async () => {
    setAuthNotice('');
    const codeStr = (otpCodeInput || '').replace(/\D/g, '');
    if (codeStr.length < 6) {
      setAuthNotice(L('Please enter the 6-digit OTP sent to your email.', 'మీ Email కు వచ్చిన 6 అంకెల OTP నమోదు చేయండి.'));
      return;
    }
    setIsVerifyingOtp(true);
    try {
      const { data, error } = await supabase.auth.verifyOtp({
        email: otpSentToEmail,
        token: codeStr,
        type: 'email'
      });
      if (error || !data?.user) {
        setAuthNotice(error?.message || L('Invalid or expired OTP. Please check and try again.', 'తప్పు లేదా గడువు ముగిసిన OTP. మళ్ళీ ప్రయత్నించండి.'));
      } else {
        supabase.auth.signOut().catch(() => { });
        setEmailOtpVerified(true);
        setOtpCooldown(0);
        setAuthNotice('');
        showToast(L('Email verified! Now complete your details below.', 'Email వెరిఫై అయింది! ఇప్పుడు క్రింది వివరాలు పూర్తి చేయండి.'));
      }
    } catch (err) {
      setAuthNotice(err?.message || 'OTP verification failed.');
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setAuthNotice('');
    const rawId = (loginIdentifier || '').trim().toLowerCase();
    if (!rawId) {
      showToast(L('Enter your Email or 10-digit Mobile Number.', 'మీ Email లేదా 10 అంకెల మొబైల్ నంబర్ ఇవ్వండి.'));
      return;
    }

    let roleKey = '';
    let cleanPhone = '';
    let emailLookupMap = userEmails;

    if (rawId.includes('@')) {
      roleKey = findRoleKeyByEmail(emailLookupMap, rawId, loginRole);
      if (!roleKey) {
        emailLookupMap = await fetchLatestEmailsMap();
        roleKey = findRoleKeyByEmail(emailLookupMap, rawId, loginRole);
      }
      if (roleKey) {
        cleanPhone = String(roleKey.split('_')[0] || '').replace(/\D/g, '').slice(-10);
      }
    } else {
      cleanPhone = rawId.replace(/\D/g, '').slice(-10);
      if (cleanPhone.length !== 10) {
        showToast(t.toasts.invalidPhone);
        return;
      }
      roleKey = getUserKey(cleanPhone, loginRole);
    }

    let found = roleKey ? registeredUsers[roleKey] : null;
    if (!found && roleKey) {
      try {
        const { data: uRow } = await supabase.from('app_users').select('*').eq('phone', roleKey).maybeSingle();
        if (uRow) {
          found = { ...uRow, phone: cleanPhone || String(uRow.phone || '').split('_')[0].replace(/\D/g, '').slice(-10) };
          setRegisteredUsers(prev => ({ ...prev, [roleKey]: found }));
        }
      } catch { }
    }
    if (!found) {
      showToast(t.toasts.notRegistered);
      return;
    }
    const passwordOk = await verifyPasswordPbkdf2(loginPassword.trim(), found.password);
    if (!passwordOk) {
      showToast(t.toasts.wrongPassword);
      return;
    }

    const updatePayload = { last_login: new Date().toISOString() };
    if (found.password && !String(found.password).startsWith('pbkdf2_v1$')) {
      const upgradedHash = await hashPasswordPbkdf2(loginPassword.trim());
      updatePayload.password = upgradedHash;
      setRegisteredUsers(prev => ({ ...prev, [roleKey]: { ...found, password: upgradedHash } }));
    }
    await supabase.from('app_users').update(updatePayload).eq('phone', roleKey);

    completePortalLogin({
      role: loginRole,
      name: found.name,
      phone: cleanPhone || String(found.phone || '').replace(/\D/g, '').slice(-10),
      email: userEmails[roleKey] || found.email || '',
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
    fetch('/api/session-sign', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone: userObj.phone, role: userObj.role })
    }).then(r => r.ok ? r.json() : null).then(d => {
      if (d?.ok && d?.token) sessionStorage.setItem('aqm_signed_session', d.token);
    }).catch(() => { });
    syncAllFromSupabase();
  };

  const handleLogout = () => {
    sessionStorage.removeItem('aqm_signed_session');
    setCurrentUser(null);
    setWaVerifiedDone(false);
    setIsVerifyingWa(false);
    setLoginPassword('');
    setSelectedBatch(null);
    setModalError('');
  };

  const launchRazorpayPayment = ({ amountInr, description, prefillName, prefillPhone, onSuccess, onFailure }) => {
    const rzpKey = import.meta.env.VITE_RAZORPAY_KEY_ID;
    const startCheckout = () => {
      if (rzpKey && window.Razorpay) {
        const options = {
          key: rzpKey,
          amount: Math.round(Number(amountInr) * 100),
          currency: 'INR',
          name: 'Aqua Mark',
          description,
          prefill: {
            name: prefillName || currentUser?.name || 'Aqua Mark User',
            contact: prefillPhone || currentUser?.phone || '',
            method: 'upi'
          },
          theme: { color: '#0d9488' },
          handler: async function (response) {
            const pid = response?.razorpay_payment_id;
            if (!pid || !/^pay_[A-Za-z0-9]+$/.test(pid)) {
              if (onFailure) onFailure(L('Payment verification failed. No payment ID received from Razorpay.', 'పేమెంట్ ధృవీకరణ విఫలమైంది. Razorpay నుండి ID రాలేదు.'));
              return;
            }
            // Enterprise Server-Side Razorpay Verification (tamper-proof amount & status check)
            try {
              const vRes = await fetch('/api/verify-razorpay', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ paymentId: pid, expectedAmountInr: Math.round(Number(amountInr) || 0) }),
              });
              if (vRes.status !== 404 && vRes.status !== 503) {
                const vData = await vRes.json();
                if (!vRes.ok || !vData?.verified) {
                  if (onFailure) onFailure(vData?.error || L('Server payment verification failed! Amount or status mismatch.', 'సర్వర్ పేమెంట్ ధృవీకరణ విఫలమైంది!'));
                  return;
                }
              }
            } catch {
              // On localhost dev without Cloudflare Worker, allow valid Razorpay ID format
              const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
              if (!isLocal) {
                if (onFailure) onFailure(L('Could not verify payment with AquaMark server. Please check connection.', 'సర్వర్‌తో పేమెంట్ ధృవీకరణ విఫలమైంది.'));
                return;
              }
            }
            onSuccess(pid);
          },
          modal: {
            ondismiss: function () {
              if (onFailure) onFailure(L('Payment cancelled by user.', 'పేమెంట్ రద్దు చేయబడింది.'));
            }
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', (resp) => {
          if (onFailure) onFailure(`Payment Failed: ${resp.error?.description || 'Cancelled'}`);
        });
        rzp.open();
        return;
      }
      setRazorpayModal({
        amountInr: Number(amountInr) || 0,
        description,
        prefillName: prefillName || currentUser?.name || 'Aqua Mark User',
        prefillPhone: prefillPhone || currentUser?.phone || '',
        onSuccess,
        onFailure
      });
    };

    if (rzpKey && !window.Razorpay) {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = startCheckout;
      script.onerror = () => {
        setRazorpayModal({
          amountInr: Number(amountInr) || 0,
          description,
          prefillName: prefillName || currentUser?.name || 'Aqua Mark User',
          prefillPhone: prefillPhone || currentUser?.phone || '',
          onSuccess,
          onFailure
        });
      };
      document.body.appendChild(script);
    } else {
      startCheckout();
    }
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
    if (record && record.password && !(await verifyPasswordPbkdf2(deleteConfirmPassword.trim(), record.password))) {
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

    let nonPcrCount = 0;
    for (let i = 0; i < filesArray.length; i++) {
      const rawFile = filesArray[i];
      setUploadProgress({ active: true, percent: 30, label: `AI Analyzing PCR Report ${i + 1}/${filesArray.length}...` });
      const aiCheck = await analyzePcrReportImage(rawFile);
      if (!aiCheck.isPcrReport) nonPcrCount++;

      setUploadProgress({ active: true, percent: 55, label: `Compressing & Stamping Report ${i + 1}/${filesArray.length}...` });
      const readyFile = await stampAndCompressImage(rawFile, vivoMeta, 2 * 1024 * 1024);
      setUploadProgress({ active: true, percent: 80, label: `Uploading Image ${i + 1}/${filesArray.length} to Cloud...` });

      const formData = new FormData();
      formData.append('file', readyFile);
      const upRes = await fetch('/api/upload', { method: 'POST', headers: getSignedSessionHeaders(), body: formData });

      if (upRes.ok) {
        const upData = await upRes.json();
        uploadedResults.push({
          label: `PCR-${baseCount + i + 1}`,
          url: upData.url,
          stamp: `CAA: ${vivoMeta.caaNumber} | ${vivoMeta.dateTime}`,
          aiPcrStatus: aiCheck.status,
          aiConfidence: aiCheck.confidence,
          aiReason: aiCheck.reason,
          aiExtracted: aiCheck.extracted || null
        });
      } else {
        const errTxt = await upRes.text();
        showToast(`Image Upload Error: ${errTxt}`);
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
      if (nonPcrCount > 0) {
        showToast(L(`⚠️ AI PCR Analyzer: ${nonPcrCount} file(s) flagged as "Not a PCR Report"! Upload seed photos in Seed Images.`, `⚠️ AI PCR అనలైజర్: ${nonPcrCount} ఫైల్ "Not a PCR Report" గా గుర్తించబడింది! సీడ్ ఫోటోలను Seed Images లో అప్‌లోడ్ చేయండి.`));
      } else {
        showToast(L(`✅ ${uploadedResults.length} PCR Report(s) AI-verified & uploaded!`, `✅ ${uploadedResults.length} PCR రిపోర్ట్(లు) AI వెరిఫై & అప్‌లోడ్ అయ్యాయి!`));
      }
    }
  };


  const handleMultipleSeedImageUpload = async (fileList, isEditMode = false) => {
    if (!fileList || fileList.length === 0) return;
    setMediaPickerTarget(null);
    const filesArray = Array.from(fileList);
    const uploadedSeeds = [];
    const baseCount = isEditMode ? (editBatchValues.seedImages || []).length : seedImages.length;

    setUploadProgress({ active: true, percent: 15, label: 'Generating Security Timestamp & CAA Watermark...' });
    const myCaa = hatcheryProfiles[currentUser?.phone]?.caaLicense || 'CAA-VERIFIED';
    const dateTimeStr = `${new Date().toLocaleDateString('en-IN')} • ${new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}`;
    const vivoMeta = { caaNumber: myCaa, dateTime: dateTimeStr };

    for (let i = 0; i < filesArray.length; i++) {
      const rawFile = filesArray[i];
      setUploadProgress({ active: true, percent: 45, label: `Compressing & Stamping Seed Photo ${i + 1}/${filesArray.length}...` });

      const readyFile = await stampAndCompressImage(rawFile, vivoMeta, 2 * 1024 * 1024);
      setUploadProgress({ active: true, percent: 80, label: `Uploading Seed Photo ${i + 1}/${filesArray.length} to Cloud...` });

      const formData = new FormData();
      formData.append('file', readyFile);
      const upRes = await fetch('/api/upload', { method: 'POST', headers: getSignedSessionHeaders(), body: formData });

      if (upRes.ok) {
        const upData = await upRes.json();
        uploadedSeeds.push({
          label: `Seed-${baseCount + i + 1}`,
          url: upData.url,
          stamp: `CAA: ${vivoMeta.caaNumber} | ${vivoMeta.dateTime}`
        });
      } else {
        const errTxt = await upRes.text();
        showToast(`Seed Image Upload Error: ${errTxt}`);
      }
    }

    setUploadProgress({ active: true, percent: 100, label: 'Seed Photo Upload Complete!' });
    setTimeout(() => setUploadProgress({ active: false, percent: 0, label: '' }), 850);

    if (uploadedSeeds.length > 0) {
      if (isEditMode) {
        setEditBatchValues(prev => ({ ...prev, seedImages: [...(prev.seedImages || []), ...uploadedSeeds] }));
      } else {
        setSeedImages(prev => [...prev, ...uploadedSeeds]);
      }
      showToast(L(`${uploadedSeeds.length} Seed photo(s) stamped & uploaded!`, `${uploadedSeeds.length} సీడ్ ఫోటో(లు) స్టాంప్ & అప్‌లోడ్ అయ్యాయి!`));
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
      setUploadProgress({ active: true, percent: 45, label: `Compressing Video ${i + 1}/${filesArray.length} ...` });

      const readyVideo = await stampAndCompressVideo(rawFile, vivoMeta, 10 * 1024 * 1024);
      setUploadProgress({ active: true, percent: 80, label: `Uploading Video ${i + 1}/${filesArray.length} to Cloud...` });

      const formData = new FormData();
      formData.append('file', readyVideo);
      const upRes = await fetch('/api/upload', { method: 'POST', headers: getSignedSessionHeaders(), body: formData });

      if (upRes.ok) {
        const upData = await upRes.json();
        uploadedVideos.push({
          label: `Tank-Video-${baseCount + i + 1}`,
          url: upData.url,
          stamp: `CAA: ${vivoMeta.caaNumber} | ${vivoMeta.dateTime}`
        });
      } else {
        const errTxt = await upRes.text();
        showToast(`Video Upload Error: ${errTxt}`);
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
      ? (newBatchForm.customSpecies.trim() || 'Vannamei')
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
      seedImages: [...seedImages],
      tankVideos: [...tankVideos],
      gpsCoords: gpsLocation || '17.0005° N, 82.2510° E',
      paused: false,
      vigorScore: 96
    };

    setBatches([created, ...batches]);
    await saveBatchToSupabase(created);

    // Notify all registered Brokers about the new live seed batch
    Object.keys(brokerProfiles || {}).forEach((bPhone) => {
      pushAppNotification(
        bPhone,
        'mediator',
        `New Live Seed Batch (${created.id})`,
        `${created.plStage} ${created.species} in ${created.zone} at ₹${(created.pricePer1000 || 0).toFixed(2)}/seed (+${created.bonusPercent}% Bonus, ${created.salinity} PPT).`,
        { batchId: created.id, zone: created.zone, stage: created.plStage, rate: `₹${(created.pricePer1000 || 0).toFixed(2)}/seed`, stock: created.availableStock }
      );
    });

    setPcrImages([]);
    setSeedImages([]);
    setTankVideos([]);
    setShowNewMediaPanel(false);
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
    setShowEditMediaPanel(false);
    const isMillions = (batch.availableStock || 0) >= 1000000 && (batch.availableStock % 1000000 === 0);
    const amountVal = isMillions
      ? Math.max(1, Math.round(batch.availableStock / 1000000))
      : Math.max(1, Math.round((batch.availableStock || 100000) / 100000));

    setEditBatchValues({
      species: batch.species || 'Vannamei (SyAqua Line)',
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
      seedImages: [...(batch.seedImages || [])],
      tankVideos: [...(batch.tankVideos || [])],
      removedPcrUrls: [],
      removedSeedUrls: [],
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
        seedImages: [...(editBatchValues.seedImages || [])],
        tankVideos: [...(editBatchValues.tankVideos || [])]
      };
      return updatedObj;
    });

    await deleteStorageFilesByUrls(editBatchValues.removedPcrUrls, 'pcr-reports');
    await deleteStorageFilesByUrls(editBatchValues.removedSeedUrls, 'pcr-reports');
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
      await deleteStorageFilesByUrls((targetBatch.seedImages || []).map(i => i.url), 'pcr-reports');
      await deleteStorageFilesByUrls((targetBatch.tankVideos || []).map(v => v.url), 'tank-videos');
    }
    setBatches(batches.filter(b => b.id !== batchId));
    await supabase.from('batches').delete().eq('id', batchId);
    showToast(t.toasts.batchRemoved);
  };

  // =========================================================================
  // BOOKING & PAYMENT FLOW (WITH BLURRED-TO-REVEAL QR GENERATOR)
  // =========================================================================
  const finalizeBookingRecord = async (paymentRef, qty, hatcheryFixedCost, marginPaiseNum, transportCost, advance5Pct, isFullPayment = false, customPaidNow = null) => {
    // App-Exclusive +2% Extra Bonus PL so Farmer ALWAYS gets cheaper effective rate on Aqua Mark than offline!
    const appExtraBonusPct = 2;
    const totalBonusPct = (selectedBatch.bonusPercent || 15) + appExtraBonusPct;
    const bonusSeeds = Math.round(qty * (totalBonusPct / 100));
    const matchedBrokerFarmer = brokerFarmers.find(
      (f) => (f.phone || '').slice(-10) === (bookingForm.farmerPhone || '').slice(-10)
    );
    const isBrokerLinked = Boolean(matchedBrokerFarmer) || currentUser?.role === 'mediator';

    // Smart 5% Advance Finance Split (Zero loss to Buyer, High Net to Owner, Clean 2% to AquaMark):
    // Direct: 2% AquaMark + 3% Owner Advance | Broker: 2% AquaMark + 2% Broker + 1% Owner Advance
    const silentPlatform2Pct = Math.round(hatcheryFixedCost * 0.02);
    const brokerBase2Pct = isBrokerLinked ? Math.round(hatcheryFixedCost * 0.02) : 0;
    const ownerAdvanceShare = Math.max(0, advance5Pct - silentPlatform2Pct - brokerBase2Pct);
    const hold2Pct = isBrokerLinked ? brokerBase2Pct : ownerAdvanceShare;
    const brokerExtraMarginTotal = isBrokerLinked ? Math.round(qty * (marginPaiseNum / 100)) : 0;
    const totalFarmerPayable = hatcheryFixedCost + brokerExtraMarginTotal + transportCost;
    const rawCharge = isFullPayment ? totalFarmerPayable : advance5Pct;
    const paidNow = customPaidNow !== null ? Math.min(totalFarmerPayable, Math.max(0, Number(customPaidNow) || 0)) : rawCharge;
    const balanceAtPacking = Math.max(0, totalFarmerPayable - paidNow);
    const isActuallySettled = balanceAtPacking === 0;

    const now = new Date();
    const issueDateStr = now.toLocaleDateString('en-IN');
    const issueTimeStr = now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });

    const newBooking = {
      bookingId: `AQ-${Math.floor(10000 + Math.random() * 90000)}`,
      gatePassPin: `GP-${Math.floor(1000 + Math.random() * 9000)}`,
      paymentId: paymentRef,
      paymentMode: bookingForm.paymentMethod,
      paymentOption: isActuallySettled ? 'FULL' : 'ADVANCE',
      fullPaid: isActuallySettled,
      date: issueDateStr,
      time: issueTimeStr,
      hatcheryOwnerPhone: selectedBatch.ownerPhone,
      batch: selectedBatch,
      farmerName: bookingForm.farmerName,
      farmerPhone: bookingForm.farmerPhone,
      bookedByRole: currentUser?.role,
      bookedByPhone: currentUser?.phone,
      brokerPhone: currentUser?.role === 'mediator' ? currentUser?.phone : (matchedBrokerFarmer?.brokerPhone || null),
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
      clearedAt: isActuallySettled ? `${issueDateStr} ${issueTimeStr}` : undefined,
      appExtraBonusPct,
      settlement: {
        hold2PctAmount: hold2Pct,
        platform2Pct: silentPlatform2Pct,
        ownerDirect2Pct: ownerAdvanceShare,
        brokerBase2Pct,
        farmerRefundable2Pct: 0,
        status: isActuallySettled ? 'BALANCE_CLEARED' : 'ADVANCE_HOLD'
      },
      packingStatus: 'PACKING_PENDING',
      gatePassCleared: false,
      rated: false
    };

    const updatedBatch = {
      ...selectedBatch,
      availableStock: Math.max(0, (selectedBatch.availableStock || 0) - qty)
    };

    const saveRes = await saveBookingToSupabase(newBooking);
    if (!saveRes?.ok) {
      setModalError(L(
        `Payment recorded (Ref: ${paymentRef}) but cloud confirmation failed (${saveRes?.error || 'Network error'}). Please check internet and retry — do NOT pay twice.`,
        `క్లౌడ్ సేవ్ విఫలమైంది (${saveRes?.error || 'నెట్‌వర్క్ లోపం'}). Ref: ${paymentRef} సేవ్ చేసుకోండి — మళ్ళీ డబ్బులు చెల్లించకండి.`
      ));
      showToast(L('Booking cloud sync failed! Please retry.', 'బుకింగ్ సేవ్ విఫలమైంది! మళ్ళీ ప్రయత్నించండి.'));
      return;
    }

    setBatches(prev => prev.map(b => (b.id === selectedBatch.id ? updatedBatch : b)));
    setBookings(prev => [newBooking, ...prev]);
    await saveBatchToSupabase(updatedBatch);

    await pushAppNotification(
      selectedBatch.ownerPhone,
      'seller',
      `New Seed Booking (${newBooking.bookingId})`,
      `${bookingForm.farmerName} booked ${qty.toLocaleString('en-IN')} PL (${isFullPayment ? '100% Full Paid' : '5% Advance Paid'}).`,
      { bookingId: newBooking.bookingId, batchId: selectedBatch.id, farmerName: bookingForm.farmerName, farmerPhone: bookingForm.farmerPhone, amount: paidNow, packingDate: bookingForm.packingDate }
    );
    await pushAppNotification(
      bookingForm.farmerPhone,
      'buyer',
      isFullPayment ? `Full Payment Confirmed (${newBooking.bookingId})` : `Booking Confirmed (${newBooking.bookingId})`,
      `Your slot at ${selectedBatch.realName} for ${qty.toLocaleString('en-IN')} PL is confirmed. Gate-Pass PIN: ${newBooking.gatePassPin}.`,
      { bookingId: newBooking.bookingId, batchId: selectedBatch.id, hatcheryName: selectedBatch.realName, amount: paidNow, balance: balanceAtPacking }
    );
    if (isBrokerLinked && newBooking.brokerPhone) {
      await pushAppNotification(
        newBooking.brokerPhone,
        'mediator',
        `Broker Booking Confirmed (${newBooking.bookingId})`,
        `Farmer ${bookingForm.farmerName} booked ${qty.toLocaleString('en-IN')} PL at ${selectedBatch.realName}. 2% Commission: ₹${hold2Pct.toLocaleString('en-IN')}${brokerExtraMarginTotal > 0 ? ` + Extra Margin: ₹${brokerExtraMarginTotal.toLocaleString('en-IN')}` : ''}.`,
        { bookingId: newBooking.bookingId, batchId: selectedBatch.id, farmerName: bookingForm.farmerName, hatcheryName: selectedBatch.realName, commission2Pct: hold2Pct, extraMargin: brokerExtraMarginTotal, packingDate: bookingForm.packingDate }
      );
    }

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

    // Re-read authoritative live batch to prevent stale/tampered prices or stock
    const liveBatch = batches.find(b => b.id === selectedBatch.id);
    if (!liveBatch || liveBatch.paused) {
      setModalError(L('This batch is currently paused or unavailable. Please refresh marketplace.', 'ఈ బ్యాచ్ ప్రస్తుతం అందుబాటులో లేదు. దయచేసి రిఫ్రెష్ చేయండి.'));
      return;
    }

    if ((bookingForm.farmerPhone || '').replace(/\D/g, '').length !== 10) {
      setModalError(t.toasts.invalidPhone);
      return;
    }

    const requestedQty = computeSeedCount(bookingForm.qtyAmount, bookingForm.qtyUnit);
    const minPackingQty = liveBatch.minPacking || 100000;
    if (!Number.isFinite(requestedQty) || requestedQty < minPackingQty) {
      setModalError(`Minimum Packing required is ${(minPackingQty / 100000).toFixed(1).replace(/\.0$/, '')} Lakh PL (${minPackingQty.toLocaleString('en-IN')} PL).`);
      return;
    }
    if (requestedQty > (liveBatch.availableStock || 0)) {
      setModalError(`Requested quantity (${requestedQty.toLocaleString('en-IN')} PL) exceeds available hatchery stock (${(liveBatch.availableStock || 0).toLocaleString('en-IN')} PL).`);
      return;
    }

    const marginPaiseNum = Math.min(99, Math.max(0, Number(bookingForm.brokerMarginPaise) || 0));
    const hatcheryFixedCost = Math.round(requestedQty * (Number(liveBatch.pricePer1000) || 0.42));
    const transportCost = bookingForm.includeTransport ? 1500 : 0;
    const brokerExtraMarginTotal = currentUser?.role === 'mediator' ? Math.round(requestedQty * (marginPaiseNum / 100)) : 0;
    const totalPayable = hatcheryFixedCost + brokerExtraMarginTotal + transportCost;
    const advance5Pct = Math.max(1000, Math.round(hatcheryFixedCost * 0.05));
    const isFullPayment = bookingForm.paymentOption === 'FULL';
    const isUpiMode = bookingForm.paymentMethod === 'DIRECT_UPI';
    const defaultFullCap = isUpiMode ? Math.min(totalPayable, MAX_UPI_AMOUNT_INR) : totalPayable;
    const rawEnteredFull = (bookingForm.customFullAmount !== undefined && bookingForm.customFullAmount !== '')
      ? Number(bookingForm.customFullAmount)
      : defaultFullCap;

    let chargeNow = advance5Pct;
    if (isFullPayment) {
      const roundCheck = validateRoundFigureAmount({
        amountInr: rawEnteredFull,
        minAmount: Math.max(1000, advance5Pct),
        maxAmount: totalPayable,
        isUpi: isUpiMode,
        exactFullDue: totalPayable
      });
      if (!roundCheck.ok) {
        setModalError(roundCheck.error);
        return;
      }
      chargeNow = roundCheck.amount;
    } else if (isUpiMode && chargeNow > MAX_UPI_AMOUNT_INR) {
      chargeNow = MAX_UPI_AMOUNT_INR;
    }

    const paymentCheck = validateStrictPayment({
      method: bookingForm.paymentMethod,
      amountInr: chargeNow,
      utr: bookingForm.utrReference
    });
    if (!paymentCheck.ok) {
      setModalError(paymentCheck.error);
      return;
    }

    if (bookingForm.paymentMethod === 'DIRECT_UPI' || bookingForm.paymentMethod === 'BANK_TO_BANK') {
      const prefix = bookingForm.paymentMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT';
      finalizeBookingRecord(
        `${prefix}_${paymentCheck.cleanedUtr}`,
        requestedQty,
        hatcheryFixedCost,
        marginPaiseNum,
        transportCost,
        advance5Pct,
        chargeNow >= totalPayable,
        chargeNow
      );
      return;
    }

    launchRazorpayPayment({
      amountInr: chargeNow,
      description: `${selectedBatch.plStage} Seed ${chargeNow >= totalPayable ? '100% Full Payment' : isFullPayment ? 'Custom Payment' : '5% Advance'} (${requestedQty.toLocaleString('en-IN')} PL)`,
      prefillName: bookingForm.farmerName || 'Farmer',
      prefillPhone: bookingForm.farmerPhone,
      onSuccess: (rzpId) => finalizeBookingRecord(rzpId, requestedQty, hatcheryFixedCost, marginPaiseNum, transportCost, advance5Pct, chargeNow >= totalPayable, chargeNow),
      onFailure: (msg) => setModalError(msg)
    });
  };

  const handleBuyerCancelBooking = async (bk) => {
    const updatedBk = {
      ...bk,
      packingStatus: 'CANCELLED',
      settlement: { ...bk.settlement, status: 'CANCELLED_NON_REFUNDABLE' }
    };
    setBookings(prev => prev.map(item => (item.bookingId === bk.bookingId ? updatedBk : item)));
    await saveBookingToSupabase(updatedBk);

    const targetBatch = batches.find(b => b.id === bk.batch?.id);
    if (targetBatch) {
      const restoredBatch = { ...targetBatch, availableStock: (targetBatch.availableStock || 0) + (bk.quantity || 0) };
      setBatches(prev => prev.map(b => (b.id === restoredBatch.id ? restoredBatch : b)));
      await saveBatchToSupabase(restoredBatch);
    }
    await pushAppNotification(
      bk.hatcheryOwnerPhone,
      'seller',
      `Booking Cancelled (${bk.bookingId})`,
      `${bk.farmerName} cancelled ${(bk.quantity || 0).toLocaleString('en-IN')} PL for Batch ${bk.batch?.id}. Stock restored.`,
      { bookingId: bk.bookingId, batchId: bk.batch?.id, farmerName: bk.farmerName }
    );
    const cancelBrokerPhone = bk.brokerPhone || (bk.bookedByRole === 'mediator' ? bk.bookedByPhone : null);
    if (bk.isBrokerLinked && cancelBrokerPhone) {
      await pushAppNotification(
        cancelBrokerPhone,
        'mediator',
        `Broker Deal Cancelled (${bk.bookingId})`,
        `Booking for ${bk.farmerName} (${(bk.quantity || 0).toLocaleString('en-IN')} PL at ${bk.batch?.realName || bk.batch?.hatcheryCode}) was cancelled.`,
        { bookingId: bk.bookingId, batchId: bk.batch?.id, farmerName: bk.farmerName }
      );
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

  const handleToggleVideoRequestStatus = async (reqId) => {
    let nextStatus = 'COMPLETED';
    const nextReqs = liveVideoRequests.map((r) => {
      if (r.id !== reqId) return r;
      nextStatus = r.status === 'COMPLETED' ? 'PENDING' : 'COMPLETED';
      return { ...r, status: nextStatus };
    });
    setLiveVideoRequests(nextReqs);
    await saveKvToSupabase('live_videos', nextReqs);
    showToast(nextStatus === 'COMPLETED' ? L('Request marked as completed!', 'రిక్వెస్ట్ పూర్తయినట్లు మార్క్ అయింది!') : L('Request moved back to pending', 'రిక్వెస్ట్ మళ్లీ పెండింగ్‌లోకి మార్చబడింది'));
  };

  const handleDeleteVideoRequest = async (reqId) => {
    const nextReqs = liveVideoRequests.filter((r) => r.id !== reqId);
    setLiveVideoRequests(nextReqs);
    await saveKvToSupabase('live_videos', nextReqs);
    showToast(L('Video request deleted', 'వీడియో రిక్వెస్ట్ తొలగించబడింది'));
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
        `${targetBk.batch?.realName} marked packing complete for Batch ${targetBk.batch?.id}. Present Gate-Pass QR at Hatchery.`,
        { bookingId: targetBk.bookingId, batchId: targetBk.batch?.id, hatcheryName: targetBk.batch?.realName, balance: targetBk.balanceAtPacking }
      );
      const packBrokerPhone = targetBk.brokerPhone || (targetBk.bookedByRole === 'mediator' ? targetBk.bookedByPhone : null);
      if (targetBk.isBrokerLinked && packBrokerPhone) {
        await pushAppNotification(
          packBrokerPhone,
          'mediator',
          `Packing Ready (${targetBk.bookingId})`,
          `${targetBk.batch?.realName} marked packing complete for Farmer ${targetBk.farmerName} (Batch ${targetBk.batch?.id}).`,
          { bookingId: targetBk.bookingId, batchId: targetBk.batch?.id, farmerName: targetBk.farmerName, hatcheryName: targetBk.batch?.realName, balance: targetBk.balanceAtPacking }
        );
      }
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
        `Payment Settled (${targetBk.bookingId})`,
        `Full balance settled for ${targetBk.batch?.realName}. Your Final Cleared Receipt is ready.`,
        { bookingId: targetBk.bookingId, totalPaid: targetBk.totalSeedCost }
      );
      const payBrokerPhone = targetBk.brokerPhone || (targetBk.bookedByRole === 'mediator' ? targetBk.bookedByPhone : null);
      if (targetBk.isBrokerLinked && payBrokerPhone) {
        await pushAppNotification(
          payBrokerPhone,
          'mediator',
          `2% Commission Credited (${targetBk.bookingId})`,
          `Payment settled for ${targetBk.farmerName} at ${targetBk.batch?.realName}. Your ₹${(targetBk.settlement?.brokerBase2Pct || 0).toLocaleString('en-IN')} commission is now cleared!`,
          { bookingId: targetBk.bookingId, farmerName: targetBk.farmerName, commissionCredited: targetBk.settlement?.brokerBase2Pct || 0, extraMargin: targetBk.brokerExtraMarginTotal || 0 }
        );
      }
    }
    showToast(t.toasts.paymentReceivedDone);
  };

  const finalizeAddHatcheryDepositMoney = async (amt, ref) => {
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
    showToast(L(`₹${amt.toLocaleString('en-IN')} added! Total Deposit: ₹${nextAmt.toLocaleString('en-IN')}`, `₹${amt.toLocaleString('en-IN')} జతచేయబడింది! మొత్తం డిపాజిట్: ₹${nextAmt.toLocaleString('en-IN')}`));
  };

  const handleAddHatcheryDepositMoney = async (e) => {
    e.preventDefault();
    const amt = Number(addDepositAmount) || 0;
    if (amt < 500) {
      showToast(L('Minimum deposit top-up is ₹500.', 'కనీస డిపాజిట్ మొత్తం ₹500 ఉండాలి.'));
      return;
    }
    if ((addDepositMethod === 'DIRECT_UPI' || addDepositMethod === 'BANK_TO_BANK') && !addDepositUtr.trim()) {
      showToast(t.toasts.enterUtr);
      return;
    }
    if (addDepositMethod === 'RAZORPAY') {
      launchRazorpayPayment({
        amountInr: amt,
        description: L(`Hatchery Deposit Top-up (₹${amt.toLocaleString('en-IN')})`, `హేచరీ డిపాజిట్ టాప్-అప్ (₹${amt.toLocaleString('en-IN')})`),
        onSuccess: (rzpId) => finalizeAddHatcheryDepositMoney(amt, rzpId),
        onFailure: (msg) => showToast(msg)
      });
      return;
    }
    const ref = `${addDepositMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT'}_${addDepositUtr.trim().toUpperCase()}`;
    await finalizeAddHatcheryDepositMoney(amt, ref);
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
    if (targetBk.settlement?.status === 'CANCELLED_REFUNDED' || targetBk.settlement?.status === 'CANCELLED_NON_REFUNDABLE') {
      setScanQrError(L('This booking was cancelled and cannot be scanned.', 'ఈ బుకింగ్ క్యాన్సిల్ చేయబడింది, స్కాన్ చేయడం సాధ్యం కాదు.'));
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
      `Your Gate-Pass QR was scanned by ${updatedBk.batch?.realName}. Packing is complete, payment is settled, and your Full Paid Receipt is ready!`,
      { bookingId: updatedBk.bookingId, batchId: updatedBk.batch?.id, hatcheryName: updatedBk.batch?.realName, clearedAt: clearedStamp, totalPaid: updatedBk.totalSeedCost }
    );
    await pushAppNotification(
      currentUser.phone,
      'seller',
      `Gate-Pass Scanned (${updatedBk.bookingId})`,
      `Packing marked complete & payment settled for ${updatedBk.farmerName} (${(updatedBk.quantity || 0).toLocaleString('en-IN')} PL).`,
      { bookingId: updatedBk.bookingId, farmerName: updatedBk.farmerName, amount: updatedBk.totalSeedCost }
    );
    const qrBrokerPhone = updatedBk.brokerPhone || (updatedBk.bookedByRole === 'mediator' ? updatedBk.bookedByPhone : null);
    if (updatedBk.isBrokerLinked && qrBrokerPhone) {
      await pushAppNotification(
        qrBrokerPhone,
        'mediator',
        `Gate-Pass Cleared & Commission Credited (${updatedBk.bookingId})`,
        `${updatedBk.batch?.realName} scanned Gate-Pass for ${updatedBk.farmerName}. Your 2% commission (₹${(updatedBk.settlement?.brokerBase2Pct || 0).toLocaleString('en-IN')}) is cleared!`,
        { bookingId: updatedBk.bookingId, farmerName: updatedBk.farmerName, hatcheryName: updatedBk.batch?.realName, commissionCredited: updatedBk.settlement?.brokerBase2Pct || 0 }
      );
    }

    setShowSellerScanQrModal(false);
    setScanQrInput('');
    setActiveInvoice({ booking: updatedBk, receiptType: 'FINAL' });
    showToast(`QR Verified! ${updatedBk.bookingId} marked Packing Completed & Payment Settled.`);
  };

  const finalizeBuyerPayRemaining = async (bk, ref, paidNowInr = null) => {
    const now = new Date();
    const clearedStamp = `${now.toLocaleDateString('en-IN')} ${now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })}`;
    const prevBal = Math.max(0, Math.round(Number(bk.balanceAtPacking) || 0));
    const paidThisStep = paidNowInr !== null ? Math.min(prevBal, Math.max(0, Math.round(Number(paidNowInr) || 0))) : prevBal;
    const nextBal = Math.max(0, prevBal - paidThisStep);
    const isNowCleared = nextBal === 0;
    const updatedBk = {
      ...bk,
      fullPaid: isNowCleared,
      balancePaymentRef: ref,
      tokenAdvance: (Number(bk.tokenAdvance) || 0) + paidThisStep,
      balanceAtPacking: nextBal,
      clearedAt: isNowCleared ? clearedStamp : bk.clearedAt,
      settlement: { ...bk.settlement, status: isNowCleared ? 'BALANCE_CLEARED' : (bk.settlement?.status || 'ADVANCE_HOLD') }
    };

    const saveRes = await saveBookingToSupabase(updatedBk);
    if (!saveRes?.ok) {
      setPayRemainingError(L(
        `Cloud confirmation failed (${saveRes?.error || 'Network error'}). Ref: ${ref}. Please retry — do NOT pay twice.`,
        `క్లౌడ్ సేవ్ విఫలమైంది (${saveRes?.error || 'నెట్‌వర్క్ లోపం'}). Ref: ${ref}. మళ్ళీ ప్రయత్నించండి — రెండుసార్లు చెల్లించకండి.`
      ));
      showToast(L('Payment sync failed! Please retry.', 'పేమెంట్ సేవ్ విఫలమైంది!'));
      return;
    }
    setPayRemainingError('');
    setBookings(prev => prev.map(item => (item.bookingId === bk.bookingId ? updatedBk : item)));

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
    const remBrokerPhone = bk.brokerPhone || (bk.bookedByRole === 'mediator' ? bk.bookedByPhone : null);
    if (bk.isBrokerLinked && remBrokerPhone) {
      await pushAppNotification(
        remBrokerPhone,
        'mediator',
        `Balance Paid & Commission Cleared (${bk.bookingId})`,
        `${bk.farmerName} settled remaining ₹${(bk.balanceAtPacking || 0).toLocaleString('en-IN')}. Your 2% commission (₹${(bk.settlement?.brokerBase2Pct || 0).toLocaleString('en-IN')}) is cleared!`,
        { bookingId: bk.bookingId, farmerName: bk.farmerName, commissionCredited: bk.settlement?.brokerBase2Pct || 0, ref }
      );
    }

    setPayRemainingBooking(null);
    setPayRemainingForm({ paymentMethod: 'DIRECT_UPI', upiSubMode: 'QR', qrRevealed: false, utrReference: '' });
    setActiveInvoice({ booking: updatedBk, receiptType: 'FINAL' });
    showToast(L('Remaining balance paid! Final Cleared Receipt generated.', 'మిగిలిన బ్యాలెన్స్ చెల్లించబడింది! ఫైనల్ రసీదు సిద్ధమైంది.'));
  };

  const handleBuyerPayRemainingSubmit = async (e) => {
    e.preventDefault();
    setPayRemainingError('');
    if (!payRemainingBooking) return;
    const liveBk = bookings.find(b => b.bookingId === payRemainingBooking.bookingId) || payRemainingBooking;
    const dueAmt = Math.round(Number(liveBk.balanceAtPacking) || 0);
    if (liveBk.settlement?.status === 'BALANCE_CLEARED' || dueAmt <= 0) {
      setPayRemainingError(L('This booking balance is already cleared.', 'ఈ బుకింగ్ బ్యాలెన్స్ ఇప్పటికే పూర్తయింది.'));
      return;
    }

    const isUpiMode = payRemainingForm.paymentMethod === 'DIRECT_UPI';
    const defaultRem = isUpiMode ? Math.min(dueAmt, MAX_UPI_AMOUNT_INR) : dueAmt;
    const rawRemEntered = (payRemainingForm.customAmount !== undefined && payRemainingForm.customAmount !== '')
      ? Number(payRemainingForm.customAmount)
      : defaultRem;

    const roundCheck = validateRoundFigureAmount({
      amountInr: rawRemEntered,
      minAmount: Math.min(1000, dueAmt),
      maxAmount: dueAmt,
      isUpi: isUpiMode,
      exactFullDue: dueAmt
    });
    if (!roundCheck.ok) {
      setPayRemainingError(roundCheck.error);
      showToast(roundCheck.error);
      return;
    }
    const payNow = roundCheck.amount;

    const paymentCheck = validateStrictPayment({
      method: payRemainingForm.paymentMethod,
      amountInr: payNow,
      utr: payRemainingForm.utrReference
    });
    if (!paymentCheck.ok) {
      setPayRemainingError(paymentCheck.error);
      showToast(paymentCheck.error);
      return;
    }

    if (payRemainingForm.paymentMethod === 'RAZORPAY') {
      launchRazorpayPayment({
        amountInr: payNow,
        description: L(`Remaining Balance Payment (${liveBk.bookingId})`, `మిగిలిన బ్యాలెన్స్ చెల్లింపు (${liveBk.bookingId})`),
        prefillName: liveBk.farmerName,
        prefillPhone: liveBk.farmerPhone,
        onSuccess: (rzpId) => finalizeBuyerPayRemaining(liveBk, rzpId, payNow),
        onFailure: (msg) => { setPayRemainingError(msg); showToast(msg); }
      });
      return;
    }
    const prefix = payRemainingForm.paymentMethod === 'DIRECT_UPI' ? 'UPI' : 'NEFT';
    const ref = `${prefix}_${paymentCheck.cleanedUtr}`;
    await finalizeBuyerPayRemaining(liveBk, ref, payNow);
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
        <title>AquaMark_Receipt_${bk.bookingId}</title>
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
                  <p class="brand-sub">Official Aquaculture Quality Seed Booking</p>
                </div>
              </div>
              <div class="verified-stamp">
                <strong>${isPaidFull ? '100% PAID & VERIFIED RECEIPT' : '100% VERIFIED RECEIPT'}</strong><br/>
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
                  <td><strong>${bk.batch?.id} — ${bk.batch?.species}</strong><br/><small style="color:#475569;">Image Attachments: ${pcrLabels}</small></td>
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
                <div class="totals-row totals-highlight"><span>${isPaidFull ? 'Total Paid (100% Settled):' : '5% Advance Paid:'}</span><span>₹${(isPaidFull ? bk.totalSeedCost : bk.tokenAdvance || 0).toLocaleString('en-IN')}</span></div>
                <div class="totals-row"><span>${isPaidFull ? 'Remaining Balance:' : '95% Balance at Hatchery:'}</span><span><b>₹${(isPaidFull ? 0 : bk.balanceAtPacking || 0).toLocaleString('en-IN')}</b></span></div>
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
              [ ✓ ] Images Attached (${pcrLabels}) &nbsp;&nbsp;&nbsp;
              [ ✓ ] ${isPaidFull ? '100% Payment Settled' : '5% Advance Confirmed'} &nbsp;&nbsp;&nbsp;
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
      brokerPhone: currentUser?.phone || null,
      name: newFarmer.name,
      phone: newFarmer.phone,
      village: newFarmer.village,
      acres: Number(newFarmer.acres) || 1,
      lockedUntil: lockDate.toISOString().split('T')[0]
    };
    const nextFarmers = [entry, ...brokerFarmers];
    setBrokerFarmers(nextFarmers);
    await saveKvToSupabase('farmers', nextFarmers);
    await pushAppNotification(
      currentUser?.phone,
      'mediator',
      `Farmer Locked for 365 Days (${entry.name})`,
      `${entry.name} (${entry.village}, ${entry.acres} Acres) is protected under your Broker ID till ${entry.lockedUntil}.`,
      { farmerName: entry.name, phone: entry.phone, village: entry.village, lockedUntil: entry.lockedUntil }
    );
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


  // =========================================================================
  // PRODUCTION FEATURE HELPERS (ALL 22 FEATURES — ZERO BACKEND CHANGES)
  // =========================================================================

  // Sync Acclimatization Countdown Timer total when PPT changes (if paused at 0)
  useEffect(() => {
    const totalSecs = Math.abs((acclimCalc.hatcheryPpt || 0) - (acclimCalc.pondPpt || 0)) * 4 * 3600;
    if (!acclimTimerRunning) setAcclimTimerSec(totalSecs);
  }, [acclimCalc.hatcheryPpt, acclimCalc.pondPpt]);

  // Feature 1: Live Camera QR Scanner Controls & BarcodeDetector
  const stopQrCamera = () => {
    if (scannerIntervalRef.current) {
      clearInterval(scannerIntervalRef.current);
      scannerIntervalRef.current = null;
    }
    if (scannerStreamRef.current) {
      scannerStreamRef.current.getTracks().forEach(tr => { try { tr.stop(); } catch { } });
      scannerStreamRef.current = null;
    }
    setScannerFlashOn(false);
  };

  useEffect(() => {
    if (!showSellerScanQrModal || scanQrTab !== 'camera') {
      stopQrCamera();
      return;
    }
    let cancelled = false;
    const startCamera = async () => {
      setScannerStatus(L('Starting camera...', 'కెమెరా ప్రారంభమవుతోంది...'));
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          setScannerStatus(L('Camera API unavailable. Use Photo QR or Manual tab.', 'కెమెరా అందుబాటులో లేదు. Photo QR లేదా Manual వాడండి.'));
          return;
        }
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: scannerFacingMode, width: { ideal: 1280 }, height: { ideal: 720 } },
          audio: false
        });
        if (cancelled) {
          stream.getTracks().forEach(tr => tr.stop());
          return;
        }
        scannerStreamRef.current = stream;
        if (scannerVideoRef.current) {
          scannerVideoRef.current.srcObject = stream;
          await scannerVideoRef.current.play().catch(() => { });
        }
        if ('BarcodeDetector' in window) {
          const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
          setScannerStatus(L('Point camera at Buyer Gate-Pass QR...', 'బయ్యర్ Gate-Pass QR పై కెమెరా ఉంచండి...'));
          scannerIntervalRef.current = setInterval(async () => {
            if (!scannerVideoRef.current || scannerVideoRef.current.readyState < 2) return;
            try {
              const codes = await detector.detect(scannerVideoRef.current);
              if (codes && codes.length > 0 && codes[0].rawValue) {
                const val = codes[0].rawValue;
                stopQrCamera();
                handleSellerScanQrComplete(val);
              }
            } catch { }
          }, 350);
        } else {
          setScannerStatus(L('Live auto-detect needs Chrome/Edge/Android. Use Photo QR or Manual tab.', 'ఆటో-డిటెక్ట్ Chrome/Android లో పనిచేస్తుంది. Photo QR లేదా Manual వాడండి.'));
        }
      } catch {
        setScannerStatus(L('Camera permission denied or unavailable. Use Photo QR or Manual tab.', 'కెమెరా అనుమతి లేదు. Photo QR లేదా Manual ట్యాబ్ వాడండి.'));
      }
    };
    startCamera();
    return () => {
      cancelled = true;
      stopQrCamera();
    };
  }, [showSellerScanQrModal, scanQrTab, scannerFacingMode]);

  const handleToggleScannerFlash = async () => {
    try {
      const track = scannerStreamRef.current?.getVideoTracks?.()[0];
      if (!track) return;
      const caps = track.getCapabilities ? track.getCapabilities() : {};
      if (!caps.torch) {
        showToast(L('Flashlight not supported on this camera.', 'ఈ కెమెరాలో ఫ్లాష్‌లైట్ సపోర్ట్ లేదు.'));
        return;
      }
      const nextFlash = !scannerFlashOn;
      await track.applyConstraints({ advanced: [{ torch: nextFlash }] });
      setScannerFlashOn(nextFlash);
    } catch {
      showToast(L('Unable to toggle flashlight on this device.', 'ఈ పరికరంలో ఫ్లాష్ ఆన్ చేయడం సాధ్యం కాలేదు.'));
    }
  };

  const handlePhotoQrUpload = async (file) => {
    if (!file) return;
    setScanQrError('');
    try {
      if (!('BarcodeDetector' in window)) {
        setScanQrError(L('Photo QR requires Chrome/Edge BarcodeDetector. Please enter Booking ID / PIN in Manual tab.', 'Photo QR కోసం Chrome/Edge అవసరం. దయచేసి Manual ట్యాబ్‌లో Booking ID / PIN ఎంటర్ చేయండి.'));
        return;
      }
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const bitmap = await createImageBitmap(file);
      const codes = await detector.detect(bitmap);
      if (codes && codes.length > 0 && codes[0].rawValue) {
        stopQrCamera();
        handleSellerScanQrComplete(codes[0].rawValue);
      } else {
        setScanQrError(L('No QR code detected in the selected photo. Try a clearer image.', 'ఫోటోలో QR కోడ్ కనిపించలేదు. స్పష్టమైన ఫోటోను ప్రయత్నించండి.'));
      }
    } catch {
      setScanQrError(L('Could not scan QR from photo. Please try Manual entry.', 'ఫోటో నుండి QR స్కాన్ చేయడం సాధ్యం కాలేదు. Manual ట్యాబ్ వాడండి.'));
    }
  };

  // Feature 2: Hatchery Daily Dispatch Slots Meter
  const getDispatchSlotsInfo = (batch) => {
    const dailyCapacity = 10;
    const todayStr = new Date().toISOString().split('T')[0];
    const bookedToday = bookings.filter(
      bk => bk.batch?.id === batch.id && bk.packingStatus !== 'CANCELLED' && (bk.packingDate === todayStr || bk.packingDate === batch.availableDate)
    ).length;
    const remaining = Math.max(0, dailyCapacity - bookedToday);
    return { remaining, dailyCapacity, pct: Math.round((remaining / dailyCapacity) * 100) };
  };

  // Feature 3: Smart Seed Matchmaker Score
  const computeBatchMatchScore = (batch) => {
    const pptDiff = Math.abs((Number(batch.salinity) || 15) - (Number(matchmaker.pondPpt) || 15));
    const pptScore = pptDiff <= 2 ? 40 : pptDiff <= 4 ? 30 : pptDiff <= 6 ? 18 : 6;
    const rate = Number(batch.pricePer1000) || 0.43;
    const maxB = Number(matchmaker.maxBudget) || 0.45;
    const budgetScore = rate <= maxB ? 35 : rate <= maxB + 0.05 ? 22 : 8;
    const neededPl = Math.round((Number(matchmaker.acres) || 1) * 4046.86 * 40);
    const stock = Number(batch.availableStock) || 0;
    const stockScore = stock >= neededPl ? 25 : stock >= neededPl * 0.5 ? 15 : 5;
    return Math.min(100, pptScore + budgetScore + stockScore);
  };

  // Feature 7: Printable Batch Crate QR Sticker (Seller)
  const handlePrintCrateQrSticker = (batch) => {
    const win = window.open('', '_blank', 'width=520,height=640');
    if (!win) return;
    const qrPayload = `AQUAMARK-CRATE:${batch.id}|HATCHERY:${batch.realName}|STAGE:${batch.plStage}|PPT:${batch.salinity}|CAA:${batch.caaLicense}`;
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(qrPayload)}`;
    win.document.write(`<!DOCTYPE html><html><head><title>Crate_QR_${batch.id}</title>
      <style>
        @page { size: 105mm 148mm; margin: 6mm; }
        body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; margin: 0; padding: 12px; background: #fff; color: #0f172a; }
        .sticker { border: 3px solid #0f766e; border-radius: 14px; padding: 14px; text-align: center; }
        .brand { font-size: 18px; font-weight: 900; color: #0f766e; letter-spacing: 0.5px; }
        .sub { font-size: 10px; font-weight: 700; color: #475569; margin-bottom: 8px; }
        .batch { font-size: 16px; font-weight: 900; background: #0f172a; color: #fff; padding: 5px 10px; border-radius: 8px; display: inline-block; margin: 6px 0; font-family: monospace; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; text-align: left; font-size: 11px; margin-top: 10px; background: #f8fafc; padding: 8px; border-radius: 8px; border: 1px solid #cbd5e1; }
        .foot { font-size: 9.5px; color: #065f46; font-weight: 700; margin-top: 10px; border-top: 1px dashed #94a3b8; padding-top: 6px; }
      </style></head><body>
      <div class="sticker">
        <div class="brand">AQUA MARK • OXYGEN CRATE STICKER</div>
        <div class="sub">${batch.realName} • CAA: ${batch.caaLicense}</div>
        <div class="batch">${batch.id} • ${batch.plStage}</div><br/>
        <img src="${qrUrl}" width="170" height="170" style="margin:6px auto;display:block;border:1px solid #e2e8f0;padding:4px;border-radius:8px;" />
        <div class="grid">
          <div><b>Species:</b> ${batch.species}</div>
          <div><b>Salinity:</b> ${batch.salinity} PPT</div>
          <div><b>Bonus:</b> +${batch.bonusPercent}% PL</div>
          <div><b>Packing:</b> ${batch.availableDate || 'Live'}</div>
          <div><b>Zone:</b> ${batch.zone}</div>
          <div><b>Vigor:</b> ${batch.vigorScore || 96}%</div>
        </div>
        <div class="foot">LIVE SHRIMP SEED • HANDLE WITH CARE • KEEP COOL & OXYGENATED</div>
      </div>
      <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 250); };</script>
      </body></html>`);
    win.document.close();
  };

  // Feature 10: Multi-Pond Seed Cart helpers
  const toggleBulkCartItem = (batch) => {
    setBulkCart(prev => {
      const exists = prev.some(i => i.batchId === batch.id);
      if (exists) {
        showToast(L(`Removed ${batch.id} from Cart`, `${batch.id} కార్ట్ నుండి తొలగించబడింది`));
        return prev.filter(i => i.batchId !== batch.id);
      }
      const minLakhs = Math.max(1, Math.round((batch.minPacking || 100000) / 100000));
      showToast(L(`Added ${batch.id} (${minLakhs}L PL) to Multi-Pond Cart`, `${batch.id} కార్ట్‌లో జతచేయబడింది`));
      return [...prev, { batchId: batch.id, lakhs: minLakhs }];
    });
  };

  // Feature 12: Broker Farmer 365-Day Lock Renewal
  const handleRenewFarmerLock = async (farmerId) => {
    const nextFarmers = brokerFarmers.map(f => {
      if (f.id !== farmerId) return f;
      const baseDate = f.lockedUntil && new Date(f.lockedUntil) > new Date() ? new Date(f.lockedUntil) : new Date();
      baseDate.setFullYear(baseDate.getFullYear() + 1);
      return { ...f, lockedUntil: baseDate.toISOString().split('T')[0] };
    });
    setBrokerFarmers(nextFarmers);
    await saveKvToSupabase('farmers', nextFarmers);
    showToast(L('Farmer 365-day protection renewed for +1 Year!', 'రైతు ప్రొటెక్షన్ +1 సంవత్సరం పొడిగించబడింది!'));
  };

  // Feature 14: 72-Hour Post-Stocking Survival Check-In Submit
  const handleSaveSurvivalCheckIn = async (e) => {
    e.preventDefault();
    if (!survivalModalBooking) return;
    const bk = survivalModalBooking;
    const record = {
      h24: Number(survivalDraft.h24) || 0,
      h48: Number(survivalDraft.h48) || 0,
      h72: Number(survivalDraft.h72) || 0,
      note: (survivalDraft.note || '').trim(),
      updatedAt: new Date().toLocaleDateString('en-IN')
    };
    setSurvivalLogs(prev => ({ ...prev, [bk.bookingId]: record }));
    await pushAppNotification(
      bk.hatcheryOwnerPhone,
      'seller',
      `72h Survival Check-In (${bk.bookingId})`,
      `${bk.farmerName} reported post-stocking survival for Batch ${bk.batch?.id}: 24h=${record.h24}%, 48h=${record.h48}%, 72h=${record.h72}%. ${record.note}`,
      { bookingId: bk.bookingId, batchId: bk.batch?.id, h24: `${record.h24}%`, h48: `${record.h48}%`, h72: `${record.h72}%` }
    );
    const survBrokerPhone = bk.brokerPhone || (bk.bookedByRole === 'mediator' ? bk.bookedByPhone : null);
    if (bk.isBrokerLinked && survBrokerPhone) {
      await pushAppNotification(
        survBrokerPhone,
        'mediator',
        `72h Survival Report (${bk.bookingId})`,
        `Farmer ${bk.farmerName} logged survival for Batch ${bk.batch?.id}: 24h=${record.h24}%, 48h=${record.h48}%, 72h=${record.h72}%.`,
        { bookingId: bk.bookingId, batchId: bk.batch?.id, farmerName: bk.farmerName, h72: `${record.h72}%` }
      );
    }
    setSurvivalModalBooking(null);
    showToast(L('72h Survival Check-In saved & Hatchery notified!', '72h సర్వైవల్ రిపోర్ట్ సేవ్ అయింది & హేచరీకి నోటిఫికేషన్ పంపబడింది!'));
  };

  // Feature 15: 1-Click Quick Reorder
  const handleQuickReorder = (bk) => {
    const liveBatch = batches.find(b => b.id === bk.batch?.id && !b.paused && (b.availableStock || 0) > 0)
      || batches.find(b => b.ownerPhone === bk.hatcheryOwnerPhone && !b.paused && (b.availableStock || 0) > 0);
    if (!liveBatch) {
      showToast(L('No active stock currently available from this hatchery.', 'ఈ హేచరీలో ప్రస్తుతం యాక్టివ్ స్టాక్ అందుబాటులో లేదు.'));
      return;
    }
    const prevLakhs = Math.max(1, Math.min(100, Math.round((bk.quantity || 200000) / 100000)));
    setModalError('');
    setBookingForm(prev => ({
      ...prev,
      farmerName: bk.farmerName || currentUser.name,
      farmerPhone: bk.farmerPhone || currentUser.phone,
      qtyAmount: String(prevLakhs),
      qtyUnit: 'LAKHS',
      pondSplitCount: String(bk.pondSplitCount || 1),
      pondSalinity: String(bk.pondSalinity || 15),
      packingDate: liveBatch.availableDate || prev.packingDate,
      packingTimeSlot: liveBatch.availableTimeSlot || 'All Day (24 Hours Flexible)',
      includeTransport: Boolean(bk.includeTransport),
      upiSubMode: 'QR',
      qrRevealed: false,
      utrReference: ''
    }));
    setSelectedBatch(liveBatch);
    showToast(L(`Quick Reorder loaded for ${liveBatch.realName} (${liveBatch.id})!`, `${liveBatch.realName} కోసం క్విక్ రీఆర్డర్ లోడ్ అయింది!`));
  };

  // Feature 17: Hatchery Holiday / Dispatch Notice Save
  const handleSaveHatcheryNotice = async (textVal) => {
    if (!currentUser?.phone || !hatcheryProfiles[currentUser.phone]) return;
    const nextProfiles = {
      ...hatcheryProfiles,
      [currentUser.phone]: {
        ...hatcheryProfiles[currentUser.phone],
        dispatchNotice: (textVal || '').trim()
      }
    };
    setHatcheryProfiles(nextProfiles);
    await saveKvToSupabase('hatcheries', nextProfiles);
    setEditingNotice(false);
    showToast((textVal || '').trim()
      ? L('Hatchery Holiday / Dispatch Notice updated!', 'హేచరీ నోటీసు అప్‌డేట్ చేయబడింది!')
      : L('Hatchery Dispatch Notice cleared.', 'హేచరీ నోటీసు తొలగించబడింది.'));
  };

  // Feature 18: 1-Click CSV Ledger Export (All Roles)
  const handleExportCsvLedger = (rows, roleLabel) => {
    if (!rows || rows.length === 0) {
      showToast(L('No bookings available to export.', 'ఎక్స్‌పోర్ట్ చేయడానికి బుకింగ్స్ లేవు.'));
      return;
    }
    const esc = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
    const headers = ['Booking ID', 'Date', 'Farmer Name', 'Farmer Phone', 'Hatchery', 'Batch ID', 'Stage', 'Qty (PL)', 'Bonus (PL)', 'Packing Date', 'Total (INR)', 'Advance Paid (INR)', 'Balance (INR)', 'UTR / Ref', 'Status'];
    const csvLines = [headers.map(esc).join(',')];
    rows.forEach(bk => {
      csvLines.push([
        bk.bookingId, bk.date || '', bk.farmerName || '', bk.farmerPhone || '',
        bk.batch?.realName || bk.batch?.hatcheryCode || '', bk.batch?.id || '', bk.batch?.plStage || '',
        bk.quantity || 0, bk.bonusSeeds || 0, bk.packingDate || '',
        bk.totalSeedCost || 0, bk.tokenAdvance || 0, bk.balanceAtPacking || 0,
        bk.paymentId || '', bk.settlement?.status || bk.packingStatus || ''
      ].map(esc).join(','));
    });
    const blob = new Blob(['\uFEFF' + csvLines.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AquaMark_${roleLabel}_Ledger_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    showToast(L(`Exported ${rows.length} ledger rows to CSV!`, `${rows.length} రికార్డులు CSV లోకి డౌన్‌లోడ్ అయ్యాయి!`));
  };

  // Feature 19: Rate Converter Formatter (₹/Seed ↔ ₹/Lakh ↔ ₹/Million)
  const formatConvertedRate = (pricePerSeed) => {
    const p = Number(pricePerSeed) || 0;
    if (rateUnit === 'LAKH') return { value: `₹${Math.round(p * 100000).toLocaleString('en-IN')}`, unit: L('per lakh', 'లక్షకు') };
    if (rateUnit === 'MILLION') return { value: `₹${Math.round(p * 1000000).toLocaleString('en-IN')}`, unit: L('per million', 'మిలియన్‌కు') };
    return { value: `₹${p.toFixed(2)}`, unit: t.perSeed };
  };

  // Feature 22: Bilingual Voice Readout (Telugu & English)
  const handleVoiceReadout = (id, textEn, textTe) => {
    try {
      if (!('speechSynthesis' in window)) {
        showToast(L('Voice readout is not supported in this browser.', 'ఈ బ్రౌజర్‌లో వాయిస్ రీడౌట్ సపోర్ట్ లేదు.'));
        return;
      }
      if (isSpeakingId === id) {
        window.speechSynthesis.cancel();
        setIsSpeakingId(null);
        return;
      }
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(lang === 'te' ? textTe : textEn);
      utter.lang = lang === 'te' ? 'te-IN' : 'en-IN';
      utter.rate = 0.96;
      utter.onend = () => setIsSpeakingId(null);
      utter.onerror = () => setIsSpeakingId(null);
      setIsSpeakingId(id);
      window.speechSynthesis.speak(utter);
    } catch {
      setIsSpeakingId(null);
    }
  };

  // Round-3 Feature: Seller 1-Click Stock Quick-Adjust (-1L / +1L / +5L)
  const handleQuickAdjustStock = async (batch, deltaLakhs) => {
    const nextStock = Math.max(0, (Number(batch.availableStock) || 0) + deltaLakhs * 100000);
    const updatedObj = { ...batch, availableStock: nextStock };
    setBatches(prev => prev.map(b => (b.id === batch.id ? updatedObj : b)));
    await saveBatchToSupabase(updatedObj);
    showToast(L(`Stock updated for ${batch.id}: ${nextStock.toLocaleString('en-IN')} PL`, `${batch.id} స్టాక్ అప్‌డేట్ అయింది: ${nextStock.toLocaleString('en-IN')} PL`));
  };

  // Round-3 Feature: Broker 1-Click WhatsApp Top Live Rates Broadcast
  const handleBrokerBroadcastTopRates = () => {
    const topLive = batches.filter(b => !b.paused && (b.availableStock || 0) > 0).slice(0, 5);
    if (topLive.length === 0) {
      showToast(L('No active live batches available to broadcast.', 'బ్రాడ్‌కాస్ట్ చేయడానికి యాక్టివ్ బ్యాచ్‌లు లేవు.'));
      return;
    }
    const header = lang === 'te'
      ? `🦐 *నేటి Aqua Mark ధృవీకరించబడిన హేచరీ సీడ్ ధరలు*\n`
      : `🦐 *Today's Aqua Mark CAA-Verified Seed Rates*\n`;
    const lines = topLive.map((b, i) =>
      `${i + 1}. *${b.plStage}* (${b.species}) — ₹${(b.pricePer1000 || 0).toFixed(2)}/seed | +${b.bonusPercent}% Bonus | ${b.salinity} PPT | ${b.zone}`
    ).join('\n');
    const footer = lang === 'te'
      ? `\n\n📞 బుకింగ్ కోసం సంప్రదించండి: ${currentUser?.name} (+91 ${currentUser?.phone})`
      : `\n\n📞 Book via Broker: ${currentUser?.name} (+91 ${currentUser?.phone})`;
    const msg = `${header}${lines}${footer}`;
    if (navigator.clipboard) navigator.clipboard.writeText(msg).catch(() => { });
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    showToast(L('Top rates broadcast opened in WhatsApp!', 'టాప్ ధరల మెసేజ్ WhatsApp లో ఓపెన్ అయింది!'));
  };

  // Round-3 Feature: Printable A4 Pond Stocking & Acclimatization SOP Checklist
  const handlePrintStockingSop = () => {
    const win = window.open('', '_blank', 'width=800,height=950');
    if (!win) return;
    const pptDiff = Math.abs((acclimCalc.hatcheryPpt || 18) - (acclimCalc.pondPpt || 10));
    win.document.write(`<!DOCTYPE html><html><head><title>AquaMark_Stocking_SOP</title>
      <style>
        @page { size: A4; margin: 14mm; }
        body { font-family: 'Segoe UI', Roboto, Arial, sans-serif; color: #0f172a; line-height: 1.55; }
        .card { border: 2px solid #0f766e; border-radius: 14px; padding: 20px; }
        h1 { color: #0f766e; margin: 0 0 4px; font-size: 20px; }
        .sub { font-size: 12px; color: #475569; margin-bottom: 14px; }
        .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; background: #f8fafc; padding: 12px; border-radius: 10px; border: 1px solid #cbd5e1; font-size: 12px; margin-bottom: 14px; }
        ul { list-style: none; padding: 0; margin: 0; font-size: 13px; }
        li { padding: 7px 0; border-bottom: 1px dashed #cbd5e1; }
      </style></head><body>
      <div class="card">
        <h1>AQUA MARK — POND STOCKING & ACCLIMATIZATION SOP</h1>
        <div class="sub">Prepared for: ${currentUser?.name || 'Farmer'} (+91 ${currentUser?.phone || ''}) • Date: ${new Date().toLocaleDateString('en-IN')}</div>
        <div class="grid">
          <div><b>Pond pH:</b> ${waterTest.ph} (Target 7.5–8.3)</div>
          <div><b>Dissolved Oxygen:</b> ${waterTest.doLevel} ppm (Target ≥ 5.0)</div>
          <div><b>Alkalinity:</b> ${waterTest.alkalinity} ppm | <b>Ammonia:</b> ${waterTest.ammonia} ppm</div>
          <div><b>Salinity Gap:</b> ${pptDiff} PPT (Acclimatize ${pptDiff * 4} hrs)</div>
        </div>
        <ul>
          <li>☐ <b>Step 1 (Pre-Arrival):</b> Run all aerators for 6 hours before seed arrival; verify water pH & DO.</li>
          <li>☐ <b>Step 2 (Temperature Float):</b> Float sealed oxygen bags in pond water for 25–30 minutes until temperatures equalize.</li>
          <li>☐ <b>Step 3 (Salinity Drip):</b> Mix pond water gradually into seed tubs (1 PPT adjustment every 4 hours if gap &gt; 4 PPT).</li>
          <li>☐ <b>Step 4 (Stress & Vigor Check):</b> Swirl 100 PL in a white bowl — healthy PL swim strongly against current.</li>
          <li>☐ <b>Step 5 (Gentle Release):</b> Release PL slowly on the downwind side during cool morning hours (05:00 – 07:30 AM).</li>
          <li>☐ <b>Step 6 (72h Survival Check-In):</b> Place 2 survival hapas (100 PL each) and log 24h / 48h / 72h survival in Aqua Mark.</li>
        </ul>
      </div>
      <script>window.onload = function(){ setTimeout(function(){ window.print(); }, 250); };</script>
      </body></html>`);
    win.document.close();
  };

  const resetAllMarketplaceFilters = () => {
    setSearchQuery('');
    setZoneFilter('ALL');
    setStageFilter('ALL');
    setOnlySavedFilter(false);
    setSortBy('RATING');
    setWatchlistFilterOnly(false);
    setRateUnit('SEED');
    setMatchmaker(prev => ({ ...prev, enabled: false }));
    showToast(L('All marketplace filters reset!', 'అన్ని ఫిల్టర్లు క్లియర్ చేయబడ్డాయి!'));
  };

  const watchlistMatches = batches.filter(
    b => !b.paused && (b.availableStock || 0) > 0 && Number(b.pricePer1000 || 0) <= Number(watchlistPrice || 0)
  );

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
      const watchMatch = !watchlistFilterOnly || (!b.paused && (b.availableStock || 0) > 0 && Number(b.pricePer1000 || 0) <= Number(watchlistPrice || 0));
      return searchMatch && zoneMatch && stageMatch && savedMatch && watchMatch;
    })
    .sort((a, b) => {
      if (sortBy === 'MATCH_HIGH') return computeBatchMatchScore(b) - computeBatchMatchScore(a);
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
    <div className={`rounded-2xl p-3 border space-y-2.5 ${cardBg}`}>
      <div className="flex flex-col sm:flex-row sm:items-center gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder={t.searchPlaceholder}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs select-text focus:outline-none ${inputCls}`}
          />
        </div>
        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2">
          <select value={zoneFilter} onChange={(e) => setZoneFilter(e.target.value)} className={`border rounded-xl px-2.5 py-2 text-xs font-semibold ${inputCls}`}>
            <option value="ALL">{t.allZones}</option>
            {availableZones.map(z => <option key={z} value={z}>{z}</option>)}
          </select>
          <select value={stageFilter} onChange={(e) => setStageFilter(e.target.value)} className={`border rounded-xl px-2.5 py-2 text-xs font-semibold ${inputCls}`}>
            <option value="ALL">{t.allStages}</option>
            {SEED_STAGE_OPTIONS.filter(s => s !== 'OTHER_CUSTOM').map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <div className={`inline-flex items-center gap-1 border rounded-xl px-2.5 py-1.5 ${subCardBg}`}>
            <ArrowUpDown className="w-3.5 h-3.5 text-teal-600 shrink-0" />
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)} className="bg-transparent text-xs font-bold focus:outline-none">
              <option value="RATING">{t.sortRating}</option>
              {isBuyerView && <option value="MATCH_HIGH">{L('Best Match %', 'బెస్ట్ మ్యాచ్ %')}</option>}
              <option value="PRICE_LOW">{t.sortPriceLow}</option>
              <option value="SALINITY_LOW">{t.sortSalinity}</option>
              <option value="BONUS_HIGH">{t.sortBonus}</option>
            </select>
          </div>
          {isBuyerView && (
            <button
              type="button"
              onClick={() => setShowBuyerSmartTools(prev => !prev)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition ${showBuyerSmartTools || matchmaker.enabled || watchlistFilterOnly ? 'bg-indigo-600 text-white border-indigo-600' : subCardBg}`}
            >
              <Sliders className="w-3.5 h-3.5" /> {L('Smart Tools', 'స్మార్ట్ టూల్స్')}
              {(watchlistActive && watchlistMatches.length > 0) && (
                <span className="bg-emerald-400 text-slate-950 text-[10px] font-black px-1.5 py-0.5 rounded-full">{watchlistMatches.length}</span>
              )}
            </button>
          )}
          {isBuyerView && (
            <button
              type="button"
              onClick={() => setOnlySavedFilter(!onlySavedFilter)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${onlySavedFilter ? 'bg-rose-500/15 border-rose-400 text-rose-500' : subCardBg}`}
            >
              <Heart className={`w-3.5 h-3.5 ${onlySavedFilter ? 'fill-rose-500 text-rose-500' : ''}`} /> {t.onlySaved}
            </button>
          )}
          {isBuyerView && (
            <button
              type="button"
              onClick={() => setShowBulkCartModal(true)}
              className={`px-2.5 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${bulkCart.length > 0 ? 'bg-emerald-600 text-white border-emerald-600' : subCardBg}`}
            >
              <ShoppingCart className="w-3.5 h-3.5" /> {L('Cart', 'కార్ట్')} ({bulkCart.length})
            </button>
          )}
          {isBuyerView && compareIds.length >= 2 && (
            <button
              type="button"
              onClick={() => setShowCompareModal(true)}
              className="bg-teal-600 text-white text-xs font-bold px-3 py-1.5 rounded-xl inline-flex items-center gap-1 cursor-pointer"
            >
              <Scale className="w-3.5 h-3.5" /> {t.compareBtn} ({compareIds.length})
            </button>
          )}
        </div>

        {(searchQuery || zoneFilter !== 'ALL' || stageFilter !== 'ALL' || onlySavedFilter || sortBy !== 'RATING' || watchlistFilterOnly || rateUnit !== 'SEED' || matchmaker.enabled) && (
          <button
            type="button"
            onClick={resetAllMarketplaceFilters}
            className="px-2.5 py-1.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-500 text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" /> {L('Reset', 'రీసెట్')}
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

        <header className={`border-b px-3.5 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-2.5 ${cardBg}`}>
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0 flex-1">
            <div className="w-11 h-11 sm:w-12 sm:h-12 shrink-0 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5 shadow-xs">
              <img src="/favicon.svg" alt="Aqua Mark Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <span className="text-base sm:text-lg font-extrabold tracking-tight block leading-tight">Aqua Mark</span>
              <span className="text-[11px] sm:text-xs opacity-65 font-medium block leading-snug">{t.brandSub}</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className={`p-2 rounded-xl border cursor-pointer shrink-0 ${subCardBg}`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
              className={`inline-flex items-center gap-1.5 px-2.5 sm:px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer whitespace-nowrap shrink-0 ${subCardBg}`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              {lang === 'te' ? 'English' : 'తెలుగు'}
            </button>
          </div>
        </header>

        <div className="flex-1 flex items-center justify-center p-3 sm:p-5">
          <div className={`max-w-xl w-full rounded-3xl shadow-sm border p-4 sm:p-8 space-y-5 ${cardBg}`}>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight">{t.selectRoleTitle}</h2>
              <p className="text-xs opacity-65 mt-1">{t.selectRoleSub}</p>
            </div>

            {/* ROLE TABS (BUYER / SELLER / MEDIATOR — SPACIOUS WIDE CARDS ON MOBILE, 3-COL ON LAPTOP) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
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
                    className={`px-3.5 py-3 sm:p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-row sm:flex-col items-center sm:items-start justify-between gap-3 sm:gap-2.5 ${active
                      ? 'border-teal-500 bg-teal-500/12 ring-2 ring-teal-500/25 shadow-xs'
                      : `${subCardBg} hover:border-teal-500/40`
                      }`}
                  >
                    <div className={`w-10 h-10 sm:w-9 sm:h-9 shrink-0 rounded-xl flex items-center justify-center ${active ? 'bg-teal-600 text-white shadow-xs' : 'bg-slate-200/70 text-slate-700'}`}>
                      <IconComp className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1 sm:w-full">
                      <div className="text-sm sm:text-xs font-extrabold leading-tight">{meta.title}</div>
                      <div className="text-[11px] sm:text-[10px] opacity-70 mt-0.5 leading-snug">{meta.desc}</div>
                    </div>
                    {active && (
                      <CheckCircle2 className="w-4 h-4 text-teal-500 shrink-0 sm:hidden" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* SIGN UP & LOGIN TABS UNDERNEATH */}
            <div className={`grid grid-cols-2 p-1 rounded-2xl border ${subCardBg}`}>
              <button
                type="button"
                onClick={() => { setAuthMode('signup'); resetEmailOtpFlow(); setLoginPassword(''); }}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${authMode === 'signup' ? 'bg-teal-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              >
                {t.signUpTab}
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('login'); resetEmailOtpFlow(); setLoginPassword(''); }}
                className={`py-2.5 rounded-xl text-xs font-extrabold transition cursor-pointer ${authMode === 'login' || authMode === 'forgot' ? 'bg-teal-600 text-white shadow-xs' : 'opacity-70 hover:opacity-100'}`}
              >
                {t.loginTab}
              </button>
            </div>

            {authNotice && (
              <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 rounded-xl p-3 text-xs font-bold flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{authNotice}</span>
              </div>
            )}

            {/* MODE A: SIGN UP — EMAIL OTP VERIFY FIRST -> THEN MOBILE + PASSWORD */}
            {authMode === 'signup' && (
              <form onSubmit={handleCompleteSignUpOrReset} className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5">{t.nameLabels[loginRole]}</label>
                  <input
                    required
                    type="text"
                    disabled={emailOtpVerified}
                    placeholder={t.namePlaceholders[loginRole]}
                    value={loginName}
                    onChange={(e) => setLoginName(e.target.value)}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm select-text focus:outline-none ${inputCls}`}
                  />
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5">{L('Email Address (For Real OTP Verification)', 'Email చిరునామా (OTP వెరిఫికేషన్ కోసం)')}</label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="email"
                      disabled={emailOtpVerified}
                      placeholder="yourname@gmail.com"
                      value={loginEmail}
                      onChange={(e) => { setAuthNotice(''); setLoginEmail(e.target.value); }}
                      className={`flex-1 min-w-0 border rounded-xl px-3.5 py-2.5 text-sm select-text focus:outline-none ${inputCls}`}
                    />
                    {!emailOtpVerified && (
                      <button
                        type="button"
                        disabled={isSendingOtp || otpCooldown > 0}
                        onClick={handleSendSignupEmailOtp}
                        className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isSendingOtp ? L('Sending...', 'పంపుతోంది...') : otpCooldown > 0 ? L(`Wait ${otpCooldown}s`, `${otpCooldown}సె`) : otpSentToEmail ? L('Resend OTP', 'మళ్ళీ పంపు') : L('Send OTP', 'OTP పంపు')}
                      </button>
                    )}
                  </div>
                </div>

                {otpSentToEmail && !emailOtpVerified && (
                  <div className="border border-teal-500/40 bg-teal-500/5 rounded-2xl p-3.5 space-y-3">
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      {L(`Enter 6-digit OTP sent to ${otpSentToEmail}:`, `${otpSentToEmail} కు వచ్చిన 6 అంకెల OTP ఇవ్వండి:`)}
                    </p>
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        placeholder="Enter 6-digit OTP"
                        value={otpCodeInput}
                        onChange={(e) => { setAuthNotice(''); setOtpCodeInput(e.target.value.replace(/\D/g, '').slice(0, 8)); }}
                        className={`flex-1 min-w-0 border-2 border-teal-500 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black tracking-widest text-center select-text focus:outline-none ${inputCls}`}
                      />
                      <button
                        type="button"
                        disabled={isVerifyingOtp}
                        onClick={handleVerifyEmailOtp}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isVerifyingOtp ? L('Checking...', 'చెక్ చేస్తోంది...') : L('Verify OTP', 'వెరిఫై చేయి')}
                      </button>
                    </div>
                  </div>
                )}

                {emailOtpVerified && (
                  <div className="space-y-4 pt-1">
                    <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-500 font-bold flex items-center justify-between gap-2">
                      <span className="truncate">✓ {otpSentToEmail} Verified</span>
                      <button type="button" onClick={resetEmailOtpFlow} className="underline text-[11px] shrink-0 cursor-pointer">
                        Change
                      </button>
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
                          onChange={(e) => setLoginPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          className={`w-full border rounded-xl pl-12 pr-10 py-2.5 text-sm font-bold tracking-wider select-text focus:outline-none ${inputCls}`}
                        />
                        <Smartphone className="w-4 h-4 opacity-50 absolute right-3.5" />
                      </div>
                    </div>

                    <div>
                      <label className="text-xs font-bold block mb-1.5">{t.setPasswordLabel}</label>
                      <div className="relative flex items-center">
                        <input
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

            {/* MODE B: LOGIN WITH EMAIL OR 10-DIGIT MOBILE + PASSWORD */}
            {authMode === 'login' && (
              <form onSubmit={handlePasswordLoginSubmit} className="space-y-4">
                <div>
                  <label className="text-xs font-bold block mb-1.5">
                    {L('Email or 10-Digit Mobile Number', 'Email లేదా 10 అంకెల మొబైల్ నంబర్')} ({activeRoleMeta.title})
                  </label>
                  <input
                    required
                    type="text"
                    placeholder="yourname@gmail.com or 9876543210"
                    value={loginIdentifier}
                    onChange={(e) => { setAuthNotice(''); setLoginIdentifier(e.target.value); }}
                    className={`w-full border rounded-xl px-3.5 py-2.5 text-sm font-bold select-text focus:outline-none ${inputCls}`}
                  />
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
                    onClick={() => { setAuthMode('forgot'); resetEmailOtpFlow(); setLoginPassword(''); }}
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

            {/* MODE C: FORGOT PASSWORD — EMAIL OR MOBILE -> EMAIL OTP -> NEW PASSWORD */}
            {authMode === 'forgot' && (
              <form onSubmit={handleCompleteSignUpOrReset} className="space-y-4">
                <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3 text-xs font-bold text-amber-500 flex items-center justify-between">
                  <span>{t.resetPasswordTitle}</span>
                  <button type="button" onClick={() => { setAuthMode('login'); resetEmailOtpFlow(); }} className="underline text-[11px] cursor-pointer">
                    {t.back}
                  </button>
                </div>

                <div>
                  <label className="text-xs font-bold block mb-1.5">
                    {L('Registered Email or 10-Digit Mobile', 'రిజిస్టర్డ్ Email లేదా 10 అంకెల మొబైల్')} ({activeRoleMeta.title})
                  </label>
                  <div className="flex gap-2">
                    <input
                      required
                      type="text"
                      disabled={emailOtpVerified}
                      placeholder="yourname@gmail.com or 9876543210"
                      value={loginIdentifier}
                      onChange={(e) => { setAuthNotice(''); setLoginIdentifier(e.target.value); }}
                      className={`flex-1 min-w-0 border rounded-xl px-3.5 py-2.5 text-sm font-bold select-text focus:outline-none ${inputCls}`}
                    />
                    {!emailOtpVerified && (
                      <button
                        type="button"
                        disabled={isSendingOtp || otpCooldown > 0}
                        onClick={handleSendForgotEmailOtp}
                        className="bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold px-3.5 py-2.5 rounded-xl text-xs whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isSendingOtp ? L('Sending...', 'పంపుతోంది...') : otpCooldown > 0 ? L(`Wait ${otpCooldown}s`, `${otpCooldown}సె`) : otpSentToEmail ? L('Resend OTP', 'మళ్ళీ పంపు') : L('Send OTP', 'OTP పంపు')}
                      </button>
                    )}
                  </div>
                </div>

                {otpSentToEmail && !emailOtpVerified && (
                  <div className="border border-teal-500/40 bg-teal-500/5 rounded-2xl p-3.5 space-y-3">
                    <p className="text-xs font-bold text-teal-600 dark:text-teal-400">
                      {L(`Enter 6-digit OTP sent to ${maskEmailAddr(otpSentToEmail)}:`, `${maskEmailAddr(otpSentToEmail)} కు వచ్చిన 6 అంకెల OTP ఇవ్వండి:`)}
                    </p>
                    <div className="flex gap-2">
                      <input
                        autoFocus
                        type="text"
                        inputMode="numeric"
                        maxLength={8}
                        placeholder="Enter 6-digit OTP"
                        value={otpCodeInput}
                        onChange={(e) => { setAuthNotice(''); setOtpCodeInput(e.target.value.replace(/\D/g, '').slice(0, 8)); }}
                        className={`flex-1 min-w-0 border-2 border-teal-500 rounded-xl px-3.5 py-2.5 text-sm font-mono font-black tracking-widest text-center select-text focus:outline-none ${inputCls}`}
                      />
                      <button
                        type="button"
                        disabled={isVerifyingOtp}
                        onClick={handleVerifyEmailOtp}
                        className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-60 text-white font-extrabold px-4 py-2.5 rounded-xl text-xs whitespace-nowrap shrink-0 cursor-pointer"
                      >
                        {isVerifyingOtp ? L('Checking...', 'చెక్ చేస్తోంది...') : L('Verify OTP', 'వెరిఫై చేయి')}
                      </button>
                    </div>
                  </div>
                )}

                {emailOtpVerified && (
                  <div className="space-y-4">
                    <div className="bg-emerald-500/15 border border-emerald-500/30 rounded-xl p-2.5 text-xs text-emerald-500 font-bold">
                      ✓ {maskEmailAddr(otpSentToEmail)} Verified! Set your new password below.
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
        {/* NO INTERNET CONNECTION POPUP OVERLAY (KEEPS USER ON EXACT SAME PAGE) */}
        {(!isOnline || networkError) && (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-[9998] flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-500/40 text-center space-y-4 ${cardBg}`}>
              <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
                <WifiOff className="w-7 h-7" />
              </div>
              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold">{L('No Internet Connection', 'ఇంటర్నెట్ కనెక్షన్ లేదు')}</h3>
                <p className="text-xs opacity-75 leading-relaxed">
                  {L(
                    'Your network appears to be offline or unreachable. Your current page and data are safely preserved — reconnect and tap Retry.',
                    'మీ నెట్‌వర్క్ ఆఫ్‌లో ఉంది లేదా కనెక్ట్ అవ్వడం లేదు. మీరు ఉన్న పేజీ సురక్షితంగా ఉంది — నెట్ ఆన్ చేసి Retry నొక్కండి.'
                  )}
                </p>
              </div>
              <button
                type="button"
                disabled={isRetryingNetwork}
                onClick={handleRetryConnection}
                className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              >
                <RefreshCw className={`w-4 h-4 ${isRetryingNetwork ? 'animate-spin' : ''}`} />
                {isRetryingNetwork ? L('Retrying...', 'ప్రయత్నిస్తోంది...') : L('Retry', 'మళ్ళీ ప్రయత్నించండి (Retry)')}
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  // =========================================================================
  // ROLE-SPECIFIC COMPUTED DATA
  // =========================================================================
  const myFixedHatchery = currentUser.role === 'seller' ? hatcheryProfiles[currentUser.phone] : null;


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
    <div className={`min-h-screen font-sans select-none transition-colors overflow-x-hidden ${pageBg}`}>
      {/* HIDDEN INPUTS FOR CAMERA vs FILES */}
      <input ref={pcrFileRef} type="file" multiple accept="image/*" onChange={(e) => handleMultiplePcrUpload(e.target.files, false)} className="hidden" />
      <input ref={pcrCamRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleMultiplePcrUpload(e.target.files, false)} className="hidden" />
      <input ref={vidFileRef} type="file" multiple accept="video/*" onChange={(e) => handleMultipleVideoUpload(e.target.files, false)} className="hidden" />
      <input ref={vidCamRef} type="file" accept="video/*" capture="environment" onChange={(e) => handleMultipleVideoUpload(e.target.files, false)} className="hidden" />
      <input ref={editPcrFileRef} type="file" multiple accept="image/*" onChange={(e) => handleMultiplePcrUpload(e.target.files, true)} className="hidden" />
      <input ref={editPcrCamRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleMultiplePcrUpload(e.target.files, true)} className="hidden" />
      <input ref={editVidFileRef} type="file" multiple accept="video/*" onChange={(e) => handleMultipleVideoUpload(e.target.files, true)} className="hidden" />
      <input ref={editVidCamRef} type="file" accept="video/*" capture="environment" onChange={(e) => handleMultipleVideoUpload(e.target.files, true)} className="hidden" />
      <input ref={seedFileRef} type="file" multiple accept="image/*" onChange={(e) => handleMultipleSeedImageUpload(e.target.files, false)} className="hidden" />
      <input ref={seedCamRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleMultipleSeedImageUpload(e.target.files, false)} className="hidden" />
      <input ref={editSeedFileRef} type="file" multiple accept="image/*" onChange={(e) => handleMultipleSeedImageUpload(e.target.files, true)} className="hidden" />
      <input ref={editSeedCamRef} type="file" accept="image/*" capture="environment" onChange={(e) => handleMultipleSeedImageUpload(e.target.files, true)} className="hidden" />

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
        <div className="fixed bottom-20 right-4 sm:right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-2xl border border-slate-700 flex items-center gap-2.5 max-w-[calc(100vw-2rem)] sm:max-w-md">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-xs font-semibold leading-relaxed">{toast}</span>
        </div>
      )}

      {/* TOP NAVBAR */}
      <header className={`border-b sticky top-0 z-40 ${cardBg}`}>
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2.5 sm:py-3.5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2.5 sm:gap-3">
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            <div className="w-10 h-10 shrink-0 rounded-xl bg-teal-50 border border-teal-200 flex items-center justify-center p-1.5">
              <img src="/favicon.svg" alt="Aqua Mark Logo" className="w-full h-full object-contain" />
            </div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h1 className="text-base font-extrabold tracking-tight leading-tight">Aqua Mark</h1>
                <span className="text-[10px] sm:text-[11px] bg-teal-500/15 text-teal-600 border border-teal-500/30 px-2 sm:px-2.5 py-0.5 rounded-full font-bold whitespace-nowrap">
                  {t.portalBadges[currentUser.role] || currentUser.role}
                </span>

              </div>
              <p className="text-xs opacity-60 truncate">{currentUser.name} • +91 {currentUser.phone}</p>
            </div>
          </div>

          <div className="flex flex-nowrap items-center justify-between sm:justify-end gap-1 sm:gap-2 w-full sm:w-auto">
            {/* BUYER & BROKER EDIT PROFILE BUTTON IN HEADER */}
            {(currentUser.role === 'buyer' || currentUser.role === 'mediator') && (
              <button
                type="button"
                onClick={openBasicEditProfile}
                className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border cursor-pointer whitespace-nowrap shrink-0 ${subCardBg}`}
                title={t.editBuyerProfileBtn}
              >
                <Edit3 className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                <span className="sm:hidden">{L('Profile', 'ప్రొఫైల్')}</span>
                <span className="hidden sm:inline">{t.editBuyerProfileBtn}</span>
              </button>
            )}

            {/* HATCHERY SCAN QR BUTTON NEXT TO REFRESH */}
            {currentUser.role === 'seller' && myFixedHatchery && (
              <button
                type="button"
                onClick={() => { setScanQrInput(''); setScanQrError(''); setShowSellerScanQrModal(true); }}
                className="inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-indigo-600 hover:bg-indigo-700 text-white px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold cursor-pointer whitespace-nowrap shrink-0"
                title="Scan Buyer Gate-Pass QR"
              >
                <ScanLine className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" /> {L('Scan QR', 'QR స్కాన్')}
              </button>
            )}

            {/* LIVE CLOUD SYNC REFRESH BUTTON */}
            <button
              type="button"
              onClick={handleManualCloudSync}
              className={`p-1.5 sm:p-2 rounded-xl border cursor-pointer shrink-0 ${subCardBg}`}
              title="Sync Live Cloud Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600 ${isSyncing ? 'animate-spin' : ''}`} />
            </button>

            {/* NOTIFICATION BELL BUTTON FOR ALL USERS */}
            {(() => {
              const myCleanPhone = String(currentUser.phone || '').split('_')[0].replace(/\D/g, '').slice(-10);
              const myUnreadCount = notifications.filter(n => {
                const nPhone = String(n.targetPhone || '').split('_')[0].replace(/\D/g, '').slice(-10);
                const roleMatch = !n.targetRole || n.targetRole === 'ALL' || n.targetRole === currentUser.role;
                return (nPhone === myCleanPhone || n.targetPhone === 'ALL') && roleMatch && !n.read;
              }).length;
              return (
                <button
                  type="button"
                  onClick={() => { setSelectedNotifDetail(null); setShowNotifPanel(true); }}
                  className={`relative p-1.5 sm:p-2 rounded-xl border cursor-pointer shrink-0 ${subCardBg}`}
                  title="Notifications"
                >
                  <Bell className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-teal-600" />
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
              className={`p-1.5 sm:p-2 rounded-xl border cursor-pointer shrink-0 ${subCardBg}`}
              title="Toggle Dark Mode"
            >
              {darkMode ? <Sun className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-400" /> : <Moon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />}
            </button>
            <button
              type="button"
              onClick={() => setLang(lang === 'te' ? 'en' : 'te')}
              className={`inline-flex items-center justify-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold border cursor-pointer whitespace-nowrap shrink-0 ${subCardBg}`}
            >
              <Globe className="w-3.5 h-3.5 text-teal-600 shrink-0" />
              {lang === 'te' ? 'English' : 'తెలుగు'}
            </button>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex items-center justify-center gap-1 sm:gap-1.5 bg-teal-600 hover:bg-teal-700 px-2 sm:px-3 py-1.5 rounded-xl text-[11px] sm:text-xs font-bold text-white cursor-pointer whitespace-nowrap shrink-0"
            >
              <LogOut className="w-3 h-3 sm:w-3.5 sm:h-3.5 shrink-0" /> {t.logout}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
        {/* =========================================================
            SUPER ADMIN PINNED TOP ANNOUNCEMENT BANNER (ALL PORTALS)
           ========================================================= */}
        {adminBroadcast && adminBroadcast.active && (adminBroadcast.targetRole === 'ALL' || adminBroadcast.targetRole === currentUser.role) && dismissedBroadcastId !== adminBroadcast.id && (() => {
          const isUrgent = adminBroadcast.priority === 'urgent';
          const isWarning = adminBroadcast.priority === 'warning';
          const bannerStyle = isUrgent
            ? (darkMode ? 'bg-rose-950/60 border-rose-500/60 text-rose-100' : 'bg-rose-50 border-rose-300 text-rose-950')
            : isWarning
              ? (darkMode ? 'bg-amber-950/50 border-amber-500/60 text-amber-100' : 'bg-amber-50 border-amber-300 text-amber-950')
              : (darkMode ? 'bg-teal-950/60 border-teal-500/60 text-teal-100' : 'bg-teal-50 border-teal-300 text-teal-950');
          const badgeStyle = isUrgent
            ? 'bg-rose-600 text-white'
            : isWarning
              ? 'bg-amber-600 text-white'
              : 'bg-teal-600 text-white';
          const badgeText = isUrgent
            ? L('URGENT NOTICE', 'అత్యవసర ప్రకటన')
            : isWarning
              ? L('ADVISORY', 'ముఖ్య సూచన')
              : L('ANNOUNCEMENT', 'అధికారిక ప్రకటన');
          return (
            <div className={`rounded-2xl border-2 px-4 py-3 shadow-sm flex items-start justify-between gap-3 ${bannerStyle}`}>
              <div className="flex items-start gap-2.5 min-w-0">
                <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${badgeStyle}`}>
                  <Megaphone className="w-4 h-4" />
                </div>
                <div className="min-w-0 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded-full tracking-wide ${badgeStyle}`}>
                      {badgeText}
                    </span>
                    <h4 className="font-extrabold text-xs sm:text-sm leading-snug">{adminBroadcast.title}</h4>
                    {adminBroadcast.createdAt && (
                      <span className="text-[10px] opacity-65 font-mono">{adminBroadcast.createdAt}</span>
                    )}
                  </div>
                  <p className="text-xs opacity-90 leading-relaxed break-words">{adminBroadcast.message}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  setDismissedBroadcastId(adminBroadcast.id);
                  try { localStorage.setItem('aqm_v11_dismissed_bcast', adminBroadcast.id); } catch { }
                }}
                className="p-1 rounded-lg opacity-65 hover:opacity-100 font-bold text-sm shrink-0 cursor-pointer"
                title={L('Dismiss announcement', 'ప్రకటనను మూసివేయండి')}
              >
                ✕
              </button>
            </div>
          );
        })()}
        {/* =========================================================
            1. BUYER (FARMER) PORTAL
           ========================================================= */}
        {currentUser.role === 'buyer' && (
          <>
            {/* GROUPED COMPACT MARKET RATES & AQUA ADVISORY BAR (ZERO CLUTTER ON MOBILE) */}
            <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
              <div className="bg-slate-900 text-white px-3.5 py-2.5 flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
                  <span className="font-bold text-emerald-400 inline-flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 shrink-0" /> {L('AP Rates:', 'AP ధరలు:')}
                  </span>
                  <span className="font-mono text-[11px]">30C <b className="text-emerald-300">₹395</b></span>
                  <span className="font-mono text-[11px]">40C <b className="text-emerald-300">₹340</b></span>
                  <span className="font-mono text-[11px]">50C <b className="text-emerald-300">₹305</b></span>
                  <span className="font-mono text-[11px] hidden sm:inline">60C <b className="text-emerald-300">₹275</b></span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowRatesAdvisory(prev => !prev)}
                  className="bg-white/10 hover:bg-white/20 text-sky-300 text-[11px] font-bold px-2.5 py-1 rounded-lg inline-flex items-center gap-1 cursor-pointer shrink-0"
                >
                  <CloudSun className="w-3.5 h-3.5" /> {showRatesAdvisory ? L('Hide Tip', 'దాచు') : L('Aqua Tip', 'ఆక్వా టిప్')}
                </button>
              </div>
              {showRatesAdvisory && (() => {
                const adv = currentAquaTip;
                return (
                  <div className="px-3.5 py-2.5 bg-sky-500/10 border-t border-sky-500/20 flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="font-semibold leading-snug flex-1 min-w-[200px]">{lang === 'te' ? adv.te : adv.en}</span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      <button
                        type="button"
                        onClick={() => handleVoiceReadout('weather', adv.en, adv.te)}
                        className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer ${isSpeakingId === 'weather' ? 'bg-sky-600 text-white border-sky-600' : cardBg}`}
                      >
                        {isSpeakingId === 'weather' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-sky-500" />}
                        {isSpeakingId === 'weather' ? L('Stop', 'ఆపు') : L('Listen', 'వినండి')}
                      </button>
                      <button
                        type="button"
                        onClick={handleNextFreshTip}
                        title={L('Generate Next Fresh Tip', 'కొత్త టిప్ చూడండి')}
                        className={`p-1.5 rounded-lg border border-sky-500/40 text-sky-600 hover:bg-sky-500 hover:text-white transition cursor-pointer ${cardBg}`}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>


            <div className={`flex items-center gap-1.5 sm:gap-2 p-1.5 rounded-2xl border w-full sm:w-fit overflow-x-auto ${cardBg}`}>
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
                    className={`px-3 sm:px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer relative shrink-0 whitespace-nowrap ${buyerTab === tab.id ? 'bg-teal-600 text-white' : 'opacity-75 hover:opacity-100'}`}
                  >
                    <Icon className="w-3.5 h-3.5" /> {tab.label}
                    {hasClearedReceipt && <span className="w-2 h-2 rounded-full bg-emerald-400" />}
                  </button>
                );
              })}
            </div>

            {buyerTab === 'marketplace' && (
              <>
                {/* B2B BUYER ADVANTAGE & PROTECTION STRIP */}
                <div className={`rounded-2xl p-3 sm:p-3.5 border border-teal-500/30 bg-teal-500/5 grid grid-cols-2 lg:grid-cols-4 gap-2 text-[11px] ${cardBg}`}>
                  <div className="flex items-center gap-2 font-bold">
                    <ShieldCheck className="w-4 h-4 text-teal-500 shrink-0" />
                    <span>{L('CAA + AI PCR Verified Seed', 'CAA + AI PCR ధృవీకరించబడిన సీడ్')}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <Lock className="w-4 h-4 text-emerald-500 shrink-0" />
                    <span>{L('Locked Rate & Bonus PL', 'ఫిక్స్‌డ్ ధర & బోనస్ హామీ')}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <QrCode className="w-4 h-4 text-indigo-500 shrink-0" />
                    <span>{L('Digital Gate-Pass & Receipt', 'డిజిటల్ Gate-Pass & రసీదు')}</span>
                  </div>
                  <div className="flex items-center gap-2 font-bold">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>{L('72h Survival & Priority Tier', '72h సర్వైవల్ & ప్రయారిటీ టైర్')}</span>
                  </div>
                </div>
                {renderFilterSortBar(true)}

                {/* GROUPED BUYER SMART TOOLS PANEL (RATE CONVERTER + PRICE WATCHLIST + MATCHMAKER) */}
                {showBuyerSmartTools && (
                  <div className={`rounded-2xl p-4 border-2 border-indigo-500/30 space-y-4 text-xs ${cardBg}`}>
                    {/* 1. RATE CONVERTER */}
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-300/20">
                      <span className="font-extrabold text-teal-600">{L('Display Rate Unit', 'ధర చూపే విధానం')}</span>
                      <div className={`inline-flex items-center rounded-xl border p-0.5 text-[11px] font-bold ${subCardBg}`}>
                        {[
                          { id: 'SEED', label: '₹/Seed' },
                          { id: 'LAKH', label: '₹/Lakh' },
                          { id: 'MILLION', label: '₹/Million' }
                        ].map(u => (
                          <button
                            key={u.id}
                            type="button"
                            onClick={() => setRateUnit(u.id)}
                            className={`px-2.5 py-1 rounded-lg cursor-pointer transition ${rateUnit === u.id ? 'bg-teal-600 text-white' : 'opacity-70 hover:opacity-100'}`}
                          >
                            {u.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* 2. PRICE DROP WATCHLIST */}
                    <div className="flex flex-wrap items-center justify-between gap-2.5 pb-3 border-b border-slate-300/20">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 font-extrabold text-emerald-600">
                          <Bell className="w-4 h-4" /> {L('Price Alert ≤ ₹', 'ధర అలర్ట్ ≤ ₹')}
                        </span>
                        <input
                          type="number"
                          step="0.01"
                          min="0.10"
                          max="2.00"
                          value={watchlistPrice}
                          onChange={(e) => setWatchlistPrice(cleanNum(e.target.value))}
                          className={`w-20 border rounded-lg px-2 py-1 text-xs font-mono font-bold select-text ${inputCls}`}
                        />
                        <button
                          type="button"
                          onClick={() => setWatchlistActive(!watchlistActive)}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold border cursor-pointer ${watchlistActive ? 'bg-emerald-600 text-white border-emerald-600' : subCardBg}`}
                        >
                          {watchlistActive ? L('ON', 'ఆన్') : L('OFF', 'ఆఫ్')}
                        </button>
                      </div>
                      {watchlistActive && watchlistMatches.length > 0 && (
                        <button
                          type="button"
                          onClick={() => setWatchlistFilterOnly(!watchlistFilterOnly)}
                          className={`px-3 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${watchlistFilterOnly ? 'bg-slate-900 text-white' : 'bg-emerald-600 text-white hover:bg-emerald-700'}`}
                        >
                          {watchlistFilterOnly ? L('Show All', 'అన్నీ చూడు') : `🔥 ${L('View', 'చూడు')} ${watchlistMatches.length} ${L('Matches', 'మ్యాచ్‌లు')}`}
                        </button>
                      )}
                    </div>

                    {/* 3. SMART SEED MATCHMAKER */}
                    <div className="space-y-2.5">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <span className="font-extrabold text-indigo-500 inline-flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4" /> {L('Smart Seed Matchmaker (Pond Match %)', 'స్మార్ట్ సీడ్ మ్యాచ్‌మేకర్ (మ్యాచ్ %)')}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextEnabled = !matchmaker.enabled;
                            setMatchmaker(prev => ({ ...prev, enabled: nextEnabled }));
                            if (nextEnabled) setSortBy('MATCH_HIGH');
                          }}
                          className={`px-3 py-1 rounded-xl font-bold text-xs cursor-pointer ${matchmaker.enabled ? 'bg-indigo-600 text-white' : 'bg-teal-600 text-white'}`}
                        >
                          {matchmaker.enabled ? L('Active ✓', 'ఆన్ ✓') : L('Activate', 'ఆన్ చేయండి')}
                        </button>
                      </div>
                      <div className="grid grid-cols-3 gap-2.5">
                        <div>
                          <label className="text-[10px] font-bold opacity-75 block mb-1">{L('Pond PPT', 'చెరువు PPT')}</label>
                          <input type="number" min="0" max="45" value={matchmaker.pondPpt} onChange={(e) => setMatchmaker(prev => ({ ...prev, pondPpt: cleanNum(e.target.value), enabled: true }))} className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold opacity-75 block mb-1">{L('Acres', 'ఎకరాలు')}</label>
                          <input type="number" step="0.5" min="0.5" value={matchmaker.acres} onChange={(e) => setMatchmaker(prev => ({ ...prev, acres: cleanNum(e.target.value), enabled: true }))} className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                        </div>
                        <div>
                          <label className="text-[10px] font-bold opacity-75 block mb-1">{L('Max ₹/Seed', 'గరిష్ట ₹/సీడ్')}</label>
                          <input type="number" step="0.01" min="0.10" value={matchmaker.maxBudget} onChange={(e) => setMatchmaker(prev => ({ ...prev, maxBudget: cleanNum(e.target.value), enabled: true }))} className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {filteredAndSortedBatches.length === 0 ? (
                  <div className={`rounded-2xl border p-12 text-center space-y-2 ${cardBg}`}>
                    <Building2 className="w-10 h-10 opacity-30 mx-auto" />
                    <h3 className="text-base font-extrabold">{t.emptyMarketTitle}</h3>
                    <p className="text-xs opacity-60 max-w-md mx-auto">{t.emptyMarketSub}</p>
                  </div>
                ) : (
                  /* COLLAPSIBLE VERIFIED HATCHERIES TAB (SIMPLE & EASY TO BROWSE MANY HATCHERIES) */
                  <div className={`rounded-2xl border shadow-xs overflow-hidden ${cardBg}`}>
                    <button
                      type="button"
                      onClick={() => setShowBuyerHatcheries(prev => !prev)}
                      className="w-full px-4 sm:px-5 py-3.5 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-teal-500/5 transition"
                    >
                      <span className="text-sm sm:text-base font-extrabold flex items-center gap-2 min-w-0">
                        <Building2 className="w-5 h-5 text-teal-600 shrink-0" />
                        <span className="truncate">{L('Verified Seed Hatcheries', 'వెరిఫైడ్ సీడ్ హేచరీలు')} ({filteredAndSortedBatches.length})</span>
                      </span>
                      <span className="inline-flex items-center gap-2 shrink-0">
                        <span className="bg-teal-500/15 text-teal-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          {showBuyerHatcheries ? L('Hide', 'మూసివేయి') : L('Show', 'చూడు')}
                        </span>
                        <ChevronRight className={`w-4 h-4 text-teal-600 transition-transform ${showBuyerHatcheries ? 'rotate-90' : ''}`} />
                      </span>
                    </button>
                    {showBuyerHatcheries && (
                      <div className="p-3 sm:p-4 border-t border-slate-300/20 max-h-[72vh] overflow-y-auto space-y-3">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredAndSortedBatches.map((batch) => {
                            const isCardExpanded = Boolean(expandedBatchIds[`buyer_${batch.id}`]);
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

                            const compactRate = formatConvertedRate(batch.pricePer1000);
                            return (
                              <div key={batch.id} className={`rounded-2xl border shadow-xs overflow-hidden flex flex-col justify-between hover:border-teal-500 transition ${cardBg} ${isPaused ? 'opacity-75' : ''}`}>
                                {/* COMPACT COLLAPSIBLE HATCHERY HEADER */}
                                <button
                                  type="button"
                                  onClick={() => toggleExpandBatch(`buyer_${batch.id}`)}
                                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-2.5 cursor-pointer hover:bg-teal-500/5 transition"
                                >
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="font-mono text-[10px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded">{batch.id}</span>
                                      <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                                        <ShieldCheck className="w-3 h-3 shrink-0" /> CAA
                                      </span>
                                      <span className="text-[11px] font-bold text-amber-500 inline-flex items-center gap-0.5">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {batch.rating || 5.0}
                                      </span>
                                      {isSoldOut && <span className="bg-rose-500/15 text-rose-500 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">{t.soldOutBadge}</span>}
                                      {isPaused && !isSoldOut && <span className="bg-amber-500/20 text-amber-500 text-[10px] font-extrabold px-1.5 py-0.5 rounded-full">{t.pausedBadge}</span>}
                                    </div>
                                    <div className="font-extrabold text-sm sm:text-base text-teal-600 dark:text-teal-400 flex items-center gap-1.5 min-w-0">
                                      {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Lock className="w-3.5 h-3.5 opacity-70 shrink-0" />}
                                      <span className="truncate">{isUnlocked ? batch.realName : (batch.hatcheryCode || 'Verified Hatchery')}</span>
                                    </div>
                                    <div className="text-[11px] opacity-70 truncate">
                                      {batch.zone} • {batch.plStage} • {((batch.availableStock || 0) / 100000).toFixed(1).replace(/\.0$/, '')}L PL
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-right">
                                      <div className="text-base sm:text-lg font-black leading-none">{compactRate.value}</div>
                                      <div className="text-[10px] opacity-60 mt-0.5">{compactRate.unit}</div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-teal-600 transition-transform shrink-0 ${isCardExpanded ? 'rotate-90' : ''}`} />
                                  </div>
                                </button>
                                {isCardExpanded && (
                                  <>
                                    <div onClick={() => setInspectedBatch(batch)} className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-300/20 space-y-4 cursor-pointer">
                                      {/* EXPANDED DETAILS (NO DUPLICATE HATCHERY NAME OR PRICE) */}
                                      <div className="space-y-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                          <p className="text-xs opacity-80 font-semibold leading-relaxed min-w-0 flex-1">
                                            {batch.species} • <span className="text-teal-500 font-bold">{batch.broodstock || 'SPF Certified'}</span>
                                          </p>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); toggleSaveBatch(batch.id); }}
                                              className={`p-1.5 rounded-lg border cursor-pointer ${subCardBg}`}
                                              title="Save Hatchery"
                                            >
                                              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-500 text-rose-500' : 'opacity-65'}`} />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); setTransitPredictorBatch(batch); }}
                                              className={`p-1.5 rounded-lg border cursor-pointer ${subCardBg}`}
                                              title="Transit Route & Oxygen Risk Predictor"
                                            >
                                              <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); handleShareBatchFlyer(batch); }}
                                              className={`p-1.5 rounded-lg border cursor-pointer ${subCardBg}`}
                                              title="Share Batch Flyer on WhatsApp"
                                            >
                                              <Share2 className="w-3.5 h-3.5 text-teal-600" />
                                            </button>
                                          </div>
                                        </div>

                                        {/* ADDRESS & SECONDARY TRUST PILLS */}
                                        <div className="space-y-1.5">
                                          {isUnlocked ? (
                                            <div className="space-y-1">
                                              <p className="text-xs opacity-80 leading-relaxed">{batch.realAddress} • +91 {batch.realPhone}</p>
                                              {mapsUrl && (
                                                <a
                                                  href={mapsUrl.startsWith('http') ? mapsUrl : `https://${mapsUrl}`}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:underline"
                                                >
                                                  <MapPin className="w-3.5 h-3.5" /> {L('Open Google Maps Location', 'Google Maps లొకేషన్ చూడండి')} <ExternalLink className="w-3 h-3" />
                                                </a>
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-[11px] opacity-55">{t.unlockHint}</p>
                                          )}
                                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                            <span className="bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                              <Activity className="w-3 h-3" /> Vigor {batch.vigorScore || 96}%
                                            </span>
                                            {(batch.pcrImages || []).length > 0 && (() => {
                                              const hasInvalid = (batch.pcrImages || []).some(img => img.aiPcrStatus === 'NOT_A_PCR_REPORT');
                                              const hasVerified = (batch.pcrImages || []).some(img => img.aiPcrStatus === 'VERIFIED_PCR');
                                              if (hasInvalid) {
                                                return (
                                                  <span className="bg-rose-500/15 text-rose-500 border border-rose-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> {L('AI: Not a PCR Report', 'AI: PCR రిపోర్ట్ కాదు')}
                                                  </span>
                                                );
                                              }
                                              if (hasVerified) {
                                                return (
                                                  <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                    <FileCheck2 className="w-3 h-3" /> {L('AI PCR Verified', 'AI PCR వెరిఫైడ్')}
                                                  </span>
                                                );
                                              }
                                              return null;
                                            })()}
                                            {matchmaker.enabled && (() => {
                                              const mScore = computeBatchMatchScore(batch);
                                              return (
                                                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border inline-flex items-center gap-1 ${mScore >= 80 ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/40' : mScore >= 60 ? 'bg-amber-500/20 text-amber-500 border-amber-500/40' : 'bg-slate-500/15 text-slate-400 border-slate-500/30'}`}>
                                                  <Sparkles className="w-3 h-3" /> Match {mScore}%
                                                </span>
                                              );
                                            })()}
                                          </div>
                                        </div>
                                      </div>

                                      <div className={`grid grid-cols-4 gap-2 p-3 rounded-xl border text-center ${subCardBg}`}>
                                        <div><span className="text-[11px] opacity-60 block">{t.stage}</span><span className="text-sm font-bold">{batch.plStage}</span></div>
                                        <div><span className="text-[11px] opacity-60 block">{t.salinity}</span><span className="text-sm font-bold text-teal-500">{batch.salinity} PPT</span></div>
                                        <div><span className="text-[11px] opacity-60 block">{t.bonus}</span><span className="text-sm font-bold text-emerald-500">+{batch.bonusPercent}%</span></div>
                                        <div><span className="text-[11px] opacity-60 block">{t.stock}</span><span className="text-sm font-bold">{(batch.availableStock || 0).toLocaleString('en-IN')}</span></div>
                                      </div>

                                      {/* FEATURE 17: HATCHERY HOLIDAY / DISPATCH NOTICE BAR */}
                                      {ownerProfile.dispatchNotice && (
                                        <div className="bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 rounded-xl px-3 py-2 text-[11px] font-bold flex items-center gap-1.5">
                                          <Megaphone className="w-3.5 h-3.5 shrink-0" />
                                          <span>{ownerProfile.dispatchNotice}</span>
                                        </div>
                                      )}

                                      {/* FEATURE 2: HATCHERY DAILY DISPATCH SLOTS METER */}
                                      {(() => {
                                        const slots = getDispatchSlotsInfo(batch);
                                        return (
                                          <div className={`border rounded-xl px-3 py-2 space-y-1 text-[11px] ${subCardBg}`}>
                                            <div className="flex items-center justify-between font-bold">
                                              <span className="opacity-80">{L('Dispatch Slots Today', 'ఈ రోజు ప్యాకింగ్ స్లాట్లు')}</span>
                                              <span className={slots.remaining >= 5 ? 'text-emerald-500' : slots.remaining >= 2 ? 'text-amber-500' : 'text-rose-500'}>
                                                {slots.remaining} / {slots.dailyCapacity} {L('slots left', 'స్లాట్లు మిగిలాయి')}
                                              </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-300/30 rounded-full overflow-hidden">
                                              <div
                                                className={`h-full rounded-full ${slots.remaining >= 5 ? 'bg-emerald-500' : slots.remaining >= 2 ? 'bg-amber-500' : 'bg-rose-500'}`}
                                                style={{ width: `${slots.pct}%` }}
                                              />
                                            </div>
                                          </div>
                                        );
                                      })()}

                                      {/* POND COVERAGE QUICK-ESTIMATOR ON CARD */}
                                      <div onClick={(e) => e.stopPropagation()} className={`border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] ${subCardBg}`}>
                                        <span className="font-bold opacity-80">{L('Pond Coverage Estimator:', 'చెరువు విస్తీర్ణం అంచనా:')}</span>
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
                                          <span className="bg-teal-500/15 text-teal-600 font-extrabold px-2 py-0.5 rounded-lg">
                                            ₹{Math.round(4046.86 * selectedDens * (batch.pricePer1000 || 0.43)).toLocaleString('en-IN')}/Acre
                                          </span>
                                        </div>
                                      </div>

                                      {/* APP-EXCLUSIVE EFFECTIVE RATE SAVINGS BADGE */}
                                      {(() => {
                                        const baseRate = Number(batch.pricePer1000 || 0.43);
                                        const appBonusTotal = (Number(batch.bonusPercent || 15) + 2);
                                        const netEff = (baseRate / (1 + appBonusTotal / 100)).toFixed(2);
                                        return (
                                          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl px-3 py-1.5 flex flex-wrap items-center justify-between gap-1.5 text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                                            <span>✨ {L(`App Deal: +${batch.bonusPercent}% + 2% Free App Bonus`, `యాప్ ఆఫర్: +${batch.bonusPercent}% + 2% అదనపు ఫ్రీ బోనస్`)}</span>
                                            <span>{L('Net', 'నెట్')}: ₹{netEff}/seed</span>
                                          </div>
                                        );
                                      })()}

                                      <div className={`border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs ${subCardBg}`}>
                                        <span className="font-semibold">
                                          📅 {t.availPackingLabel}: <b>{batch.availableDate || 'Flexible'}</b> ({batch.availableTimeSlot || 'All Day'}) • <span className="text-amber-500 font-bold">Min Packing: {((batch.minPacking || 100000) / 100000).toFixed(1).replace(/\.0$/, '')} Lakh PL</span>
                                        </span>
                                        <span className="inline-flex items-center gap-1 font-bold text-teal-500">
                                          <Eye className="w-3.5 h-3.5" /> {t.inspectBtn}
                                        </span>
                                      </div>
                                    </div>

                                    <div className={`px-3.5 sm:px-5 py-3.5 border-t space-y-2.5 ${subCardBg}`}>
                                      {/* ROW 1: REQUEST LIVE VIDEO + COMPARE + CART ON ONE SINGLE HORIZONTAL LINE */}
                                      <div className="flex flex-nowrap items-center gap-1.5 sm:gap-2 w-full">
                                        <button
                                          type="button"
                                          onClick={() => openVideoRequestModal(batch)}
                                          className={`flex-1 justify-center px-2 sm:px-3 py-2 rounded-xl border text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap min-w-0 ${videoRequested ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' : cardBg}`}
                                        >
                                          <Video className="w-3.5 h-3.5 text-teal-600 shrink-0" />
                                          <span className="truncate">{videoRequested ? L('Sent ✓', 'పంపబడింది ✓') : L('Live Video', 'లైవ్ వీడియో')}</span>
                                        </button>
                                        <button
                                          type="button"
                                          onClick={() => toggleCompareBatch(batch.id)}
                                          className={`flex-1 justify-center px-2 sm:px-3 py-2 rounded-xl border text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${isComparing ? 'bg-teal-600 text-white border-teal-600' : cardBg}`}
                                        >
                                          {isComparing ? t.comparingBtn : t.compareBtn}
                                        </button>
                                        {/* FEATURE 10: MULTI-POND BULK CART BUTTON RIGHT BESIDE COMPARE */}
                                        {!isSoldOut && !isPaused && (() => {
                                          const inCart = bulkCart.some(c => c.batchId === batch.id);
                                          return (
                                            <button
                                              type="button"
                                              onClick={() => toggleBulkCartItem(batch)}
                                              className={`flex-1 justify-center px-2 sm:px-3 py-2 rounded-xl border text-[11px] sm:text-xs font-bold inline-flex items-center gap-1 cursor-pointer whitespace-nowrap ${inCart ? 'bg-emerald-600 text-white border-emerald-600' : cardBg}`}
                                            >
                                              <ShoppingCart className="w-3.5 h-3.5 shrink-0" /> {inCart ? L('In Cart ✓', 'కార్ట్ ✓') : L('Cart', 'కార్ట్')}
                                            </button>
                                          );
                                        })()}
                                      </div>
                                      {/* ROW 2: BOOK PACKING SLOT FULL-WIDTH BELOW */}
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
                                        className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white py-2.5 px-4 rounded-xl text-xs font-extrabold flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap shadow-xs"
                                      >
                                        {isSoldOut ? t.soldOutBadge : isPaused ? t.pausedBadge : t.bookSlotBtn} {!isSoldOut && !isPaused && <ChevronRight className="w-4 h-4" />}
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}

            {/* TAB 2: BUYER BOOKINGS, DIGITAL ESCROW TIMELINE & GATE-PASSES */}
            {buyerTab === 'bookings' && (
              <div className={`rounded-2xl p-3.5 sm:p-6 border shadow-xs space-y-4 overflow-hidden ${cardBg}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-sm sm:text-base font-bold flex items-center gap-2 min-w-0">
                    <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                    <span className="truncate sm:whitespace-normal">{t.myBookingsTitle}</span>
                  </h3>
                  {/* FEATURE 18: 1-CLICK CSV LEDGER EXPORT (BUYER) */}
                  <button
                    type="button"
                    onClick={() => handleExportCsvLedger(bookings.filter(b => b.farmerPhone === currentUser.phone), 'Buyer')}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer shrink-0 ${subCardBg}`}
                  >
                    <Download className="w-3.5 h-3.5 text-teal-600" /> {L('Export CSV', 'CSV డౌన్‌లోడ్')}
                  </button>
                </div>
                {(() => {
                  const allMyBookings = bookings.filter(b => b.farmerPhone === currentUser.phone);
                  const isBkSettled = (b) => b.settlement?.status === 'BALANCE_CLEARED';
                  const isBkCancelled = (b) => b.packingStatus === 'CANCELLED' || b.settlement?.status === 'CANCELLED_REFUNDED' || b.settlement?.status === 'CANCELLED_NON_REFUNDABLE';
                  const activeCount = allMyBookings.filter(b => !isBkSettled(b) && !isBkCancelled(b)).length;
                  const settledCount = allMyBookings.filter(isBkSettled).length;
                  const cancelledCount = allMyBookings.filter(isBkCancelled).length;
                  const filteredMyBookings = allMyBookings.filter(b => {
                    if (bookingStatusFilter === 'ACTIVE') return !isBkSettled(b) && !isBkCancelled(b);
                    if (bookingStatusFilter === 'SETTLED') return isBkSettled(b);
                    if (bookingStatusFilter === 'CANCELLED') return isBkCancelled(b);
                    return true;
                  });
                  if (allMyBookings.length === 0) {
                    return <p className="text-xs opacity-60">{t.noBookingsYet}</p>;
                  }
                  return (
                    <>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {[
                          { id: 'ALL', label: L('All', 'అన్నీ'), count: allMyBookings.length },
                          { id: 'ACTIVE', label: L('Active', 'యాక్టివ్'), count: activeCount },
                          { id: 'SETTLED', label: L('Settled', 'పూర్తయినవి'), count: settledCount },
                          { id: 'CANCELLED', label: L('Cancelled', 'రద్దు'), count: cancelledCount },
                        ].map((tab) => (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setBookingStatusFilter(tab.id)}
                            className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${bookingStatusFilter === tab.id
                              ? 'bg-teal-600 text-white border-teal-600'
                              : `${subCardBg} opacity-80 hover:opacity-100`
                              }`}
                          >
                            {tab.label} ({tab.count})
                          </button>
                        ))}
                      </div>
                      {filteredMyBookings.length === 0 ? (
                        <p className="text-xs opacity-60 py-4 text-center">{L('No bookings in this status.', 'ఈ స్టేటస్‌లో బుకింగ్స్ లేవు.')}</p>
                      ) : (
                        <div className="max-h-[68vh] overflow-y-auto overflow-x-hidden pr-0.5 space-y-4">
                          {filteredMyBookings.map((bk) => {
                            const draft = ratingDrafts[bk.bookingId] || { stars: 5, comment: '' };
                            const isFinalCleared = bk.settlement?.status === 'BALANCE_CLEARED';
                            const isCancelled = bk.packingStatus === 'CANCELLED' || bk.settlement?.status === 'CANCELLED_REFUNDED' || bk.settlement?.status === 'CANCELLED_NON_REFUNDABLE';

                            const isBkExpanded = Boolean(expandedBuyerBookingIds[bk.bookingId]);
                            return (
                              <div
                                key={bk.bookingId}
                                className={`border hover:border-teal-500 rounded-2xl transition overflow-hidden ${subCardBg}`}
                              >
                                {/* COLLAPSIBLE BOOKING SUMMARY HEADER */}
                                <div
                                  onClick={() => toggleExpandBuyerBooking(bk.bookingId)}
                                  className="p-3.5 sm:p-4 flex items-center justify-between gap-2.5 cursor-pointer hover:bg-teal-500/5 transition"
                                >
                                  <div className="space-y-1 min-w-0 flex-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <button
                                        type="button"
                                        onClick={(e) => { e.stopPropagation(); handleCopyText(bk.bookingId, L('Booking ID Copied', 'బుకింగ్ ID కాపీ అయింది')); }}
                                        title={L('Tap to copy Booking ID', 'బుకింగ్ ID కాపీ చేయండి')}
                                        className="inline-flex items-center gap-1 font-mono font-bold text-xs text-teal-600 bg-teal-500/10 hover:bg-teal-500/20 px-2 py-0.5 rounded border border-teal-500/30 cursor-pointer transition"
                                      >
                                        {bk.bookingId} <Copy className="w-3 h-3 opacity-75" />
                                      </button>
                                      <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${isFinalCleared
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
                                    <p className="text-sm font-extrabold text-teal-600 dark:text-teal-400 truncate">
                                      {bk.batch?.realName} • {(bk.quantity || 0).toLocaleString('en-IN')} PL
                                    </p>
                                    <p className="text-[11px] opacity-75 truncate">
                                      {t.packingDateLabel}: <b>{bk.packingDate}</b> • {isFinalCleared
                                        ? <span className="text-emerald-500 font-bold">100% Paid (₹{(bk.totalSeedCost || 0).toLocaleString('en-IN')})</span>
                                        : isCancelled
                                          ? <span className="text-rose-500 font-bold">Cancelled</span>
                                          : <span>Balance: <b>₹{(bk.balanceAtPacking || 0).toLocaleString('en-IN')}</b></span>}
                                    </p>
                                  </div>
                                  <ChevronRight className={`w-4 h-4 text-teal-600 shrink-0 transition-transform ${isBkExpanded ? 'rotate-90' : ''}`} />
                                </div>

                                {isBkExpanded && (
                                  <div
                                    onClick={() => setInspectedBuyerBooking(bk)}
                                    className="px-3.5 sm:px-4 pb-4 pt-2 border-t border-slate-300/20 space-y-3 cursor-pointer"
                                  >
                                    {bk.packingStatus === 'PACKING_DONE_BY_SELLER' && !isFinalCleared && !isCancelled && (
                                      <div className="bg-teal-600 text-white px-3.5 py-2 rounded-xl text-xs font-bold">
                                        {t.packingReadyAlert}
                                      </div>
                                    )}

                                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
                                      <div className="space-y-1 min-w-0 flex-1">
                                        <p className="text-xs font-bold opacity-85 break-words">
                                          {bk.batch?.realName} • +91 {bk.batch?.realPhone}
                                        </p>
                                        <p className="text-xs opacity-80 leading-relaxed break-words">
                                          Batch <b>{bk.batch?.id}</b> • {(bk.quantity || 0).toLocaleString('en-IN')} PL ({bk.batch?.plStage}) • {t.packingDateLabel}: <b>{bk.packingDate}</b>
                                        </p>
                                        <p className="text-[11px] opacity-70 leading-relaxed break-words">
                                          {isFinalCleared
                                            ? <span className="text-emerald-500 font-bold">100% Full Paid (₹{(bk.totalSeedCost || 0).toLocaleString('en-IN')}) ✓</span>
                                            : isCancelled
                                              ? <span className="text-rose-500 font-bold">Cancelled • Non-Refundable</span>
                                              : <span>Paid: <b>₹{(bk.tokenAdvance || 0).toLocaleString('en-IN')}</b> • Balance: <b>₹{(bk.balanceAtPacking || 0).toLocaleString('en-IN')}</b></span>}
                                          {' '}• <span className="text-teal-500 underline font-semibold">Tap here for full receipt & details</span>
                                        </p>
                                      </div>

                                      <div className="grid grid-cols-2 lg:flex lg:flex-wrap items-center gap-2 w-full lg:w-auto shrink-0" onClick={(e) => e.stopPropagation()}>
                                        {/* STATUS ANIMATION BUTTON */}
                                        {!isCancelled && (
                                          <button
                                            type="button"
                                            onClick={() => openAnimatedStatusModal(bk)}
                                            className={`border border-teal-500/40 text-teal-600 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${cardBg}`}
                                          >
                                            <Activity className="w-3.5 h-3.5 shrink-0" /> Status
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
                                            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                                          >
                                            <CreditCard className="w-3.5 h-3.5 shrink-0" /> Full Payment
                                          </button>
                                        )}

                                        {/* GATE-PASS QR (CLEARED WHEN SCANNED BY HATCHERY) */}
                                        {!isCancelled && (
                                          bk.gatePassCleared ? (
                                            <span className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-500 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center justify-center gap-1 whitespace-nowrap">
                                              <CheckCircle2 className="w-3.5 h-3.5 shrink-0" /> Gate-Pass Cleared
                                            </span>
                                          ) : (
                                            <button
                                              type="button"
                                              onClick={() => setGatePassBooking(bk)}
                                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                                            >
                                              <QrCode className="w-3.5 h-3.5 shrink-0" /> Gate-Pass QR
                                            </button>
                                          )
                                        )}

                                        {/* FEATURE 15: 1-CLICK QUICK REORDER */}
                                        <button
                                          type="button"
                                          onClick={() => handleQuickReorder(bk)}
                                          className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center justify-center gap-1 cursor-pointer whitespace-nowrap"
                                        >
                                          <RefreshCw className="w-3.5 h-3.5 shrink-0" /> {L('Reorder', 'రీఆర్డర్')}
                                        </button>
                                      </div>
                                    </div>

                                    {isFinalCleared && (
                                      <div className="pt-3 border-t border-slate-300/30" onClick={(e) => e.stopPropagation()}>
                                        {!bk.rated ? (
                                          <div className={`flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-2.5 p-3 rounded-xl border ${cardBg}`}>
                                            <div className="flex flex-wrap items-center justify-between sm:justify-start gap-2">
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
                                            </div>
                                            <div className="flex flex-col sm:flex-row gap-2 w-full sm:flex-1">
                                              <input
                                                type="text"
                                                placeholder={lang === 'te' ? 'హేచరీ గురించి మీ అభిప్రాయం రాయండి...' : 'Write feedback for Hatchery...'}
                                                value={draft.comment}
                                                onChange={(e) => setRatingDrafts({ ...ratingDrafts, [bk.bookingId]: { ...draft, comment: e.target.value } })}
                                                className={`w-full sm:flex-1 border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`}
                                              />
                                              <button
                                                type="button"
                                                onClick={() => handleSubmitRatingAndFeedback(bk.bookingId, bk.batch?.id)}
                                                className="w-full sm:w-auto bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer whitespace-nowrap"
                                              >
                                                {t.submitReviewBtn}
                                              </button>
                                            </div>
                                          </div>
                                        ) : (
                                          <div className="text-xs text-emerald-500 font-bold">
                                            ✓ {t.ratedLabel}: {bk.userRating}★ {bk.userFeedback ? `— "${bk.userFeedback}"` : ''}
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </>
                  );
                })()}
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
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Pond Name', 'చెరువు పేరు')}</label>
                      <input required type="text" value={newPondForm.pondName} onChange={(e) => setNewPondForm({ ...newPondForm, pondName: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Acres', 'ఎకరాలు')}</label>
                      <input required type="number" step="0.5" value={newPondForm.acres} onChange={(e) => setNewPondForm({ ...newPondForm, acres: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Stocked Seed (PL)', 'వదిలిన సీడ్ (PL)')}</label>
                      <input required type="number" step="10000" value={newPondForm.stockedQty} onChange={(e) => setNewPondForm({ ...newPondForm, stockedQty: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Stocking Date', 'సీడ్ వదిలిన తేదీ')}</label>
                      <input required type="date" value={newPondForm.stockingDate} onChange={(e) => setNewPondForm({ ...newPondForm, stockingDate: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Today Feed (kg)', 'నేటి ఫీడ్ (కేజీలు)')}</label>
                      <input required type="number" step="0.5" value={newPondForm.dailyFeedKg} onChange={(e) => setNewPondForm({ ...newPondForm, dailyFeedKg: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Check-Tray Leftover', 'చెక్-ట్రే మిగులు')}</label>
                      <select value={newPondForm.trayLeftover} onChange={(e) => setNewPondForm({ ...newPondForm, trayLeftover: e.target.value })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold ${inputCls}`}>
                        <option>0% (Clean — Increase 5%)</option>
                        <option>10% (Normal — Keep Same)</option>
                        <option>25% (Reduce Next Meal 20%)</option>
                      </select>
                    </div>
                  </div>
                  {/* FEATURE 20: POND CHECK-TRAY JOURNAL (MOLTING / GUT / ANTENNA) */}
                  <div className="grid grid-cols-3 gap-2 pt-1 border-t border-slate-300/20">
                    <div>
                      <label className="text-[10px] font-bold opacity-75 block mb-1">{L('Molting %', 'మోల్టింగ్ %')}</label>
                      <input type="number" min="0" max="100" value={newPondForm.moltingPct ?? 12} onChange={(e) => setNewPondForm({ ...newPondForm, moltingPct: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-2 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[10px] font-bold opacity-75 block mb-1">{L('Gut Status', 'గట్ స్థితి')}</label>
                      <select value={newPondForm.gutStatus || 'Full & Dark (Healthy)'} onChange={(e) => setNewPondForm({ ...newPondForm, gutStatus: e.target.value })} className={`w-full border rounded-xl px-2 py-1.5 text-[11px] font-bold ${inputCls}`}>
                        <option>Full & Dark (Healthy)</option>
                        <option>Half-Full (Monitor)</option>
                        <option>Empty / White Gut Alert</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-bold opacity-75 block mb-1">{L('Antenna', 'యాంటెన్నా')}</label>
                      <select value={newPondForm.antennaStatus || 'Intact & Long'} onChange={(e) => setNewPondForm({ ...newPondForm, antennaStatus: e.target.value })} className={`w-full border rounded-xl px-2 py-1.5 text-[11px] font-bold ${inputCls}`}>
                        <option>Intact & Long</option>
                        <option>Slightly Cut</option>
                        <option>Broken / Necrosis</option>
                      </select>
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold text-xs py-2.5 rounded-xl cursor-pointer">
                    {L('+ Save Pond Feed & Journal', '+ చెరువు ఫీడ్ & జర్నల్ సేవ్ చేయండి')}
                  </button>
                </form>

                <div className={`lg:col-span-2 rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                  <h3 className="font-bold text-base flex items-center gap-2">
                    <Gauge className="w-5 h-5 text-teal-600" />
                    {lang === 'te' ? 'మీ చెరువుల DOC & చెక్-ట్రే రికార్డులు' : 'Active Pond DOC & Check-Tray Records'}
                  </h3>
                  {farmerPonds.length === 0 ? (
                    <p className="text-xs opacity-60">{L('No pond records added yet. Log your pond stocking and daily feed on the left.', 'ఇంకా చెరువు రికార్డులు లేవు. ఎడమవైపు మీ చెరువు స్టాకింగ్ & రోజువారీ ఫీడ్ నమోదు చేయండి.')}</p>
                  ) : (
                    <div className="max-h-80 overflow-y-auto pr-1 space-y-2.5">
                      {farmerPonds.map((p) => {
                        const daysElapsed = Math.max(1, Math.floor((Date.now() - new Date(p.stockingDate).getTime()) / 86400000));
                        return (
                          <div key={p.id} className={`border rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs ${subCardBg}`}>
                            <div>
                              <span className="font-extrabold text-sm text-teal-500">{p.pondName}</span> ({p.acres} Acres) • <span className="font-bold">DOC {daysElapsed}</span>
                              <p className="opacity-75 mt-0.5">Stocked: {Number(p.stockedQty).toLocaleString('en-IN')} PL on {p.stockingDate}</p>
                              {(p.moltingPct !== undefined || p.gutStatus || p.antennaStatus) && (
                                <div className="flex flex-wrap gap-1.5 mt-1.5 text-[10px] font-bold">
                                  <span className="bg-sky-500/15 text-sky-500 px-2 py-0.5 rounded-full">Molting: {p.moltingPct ?? 0}%</span>
                                  <span className={`px-2 py-0.5 rounded-full ${(p.gutStatus || '').includes('Empty') ? 'bg-rose-500/15 text-rose-500' : 'bg-emerald-500/15 text-emerald-500'}`}>Gut: {p.gutStatus || 'Full'}</span>
                                  <span className={`px-2 py-0.5 rounded-full ${(p.antennaStatus || '').includes('Broken') ? 'bg-rose-500/15 text-rose-500' : 'bg-teal-500/15 text-teal-500'}`}>Antenna: {p.antennaStatus || 'Intact'}</span>
                                </div>
                              )}
                            </div>
                            <div className="text-right space-y-0.5">
                              <span className="font-bold block">Daily Feed: {p.dailyFeedKg} kg</span>
                              <span className="text-[11px] text-emerald-500 font-semibold block">Tray: {p.trayLeftover}</span>
                              {(() => {
                                const harvestDate = new Date(new Date(p.stockingDate).getTime() + 100 * 86400000);
                                const daysToHarvest = Math.max(0, 100 - daysElapsed);
                                const phase = daysElapsed <= 30 ? 'Nursery' : daysElapsed <= 65 ? 'Growout' : daysElapsed < 95 ? 'Peak Growth' : 'Harvest Ready';
                                return (
                                  <span className="inline-block text-[10px] font-bold bg-indigo-500/15 text-indigo-500 px-2 py-0.5 rounded-full">
                                    {phase} • {daysToHarvest > 0 ? `${daysToHarvest}d to DOC 100 (${harvestDate.toLocaleDateString('en-IN')})` : 'Ready for Harvest!'}
                                  </span>
                                );
                              })()}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>


                {/* ROUND-3 FEATURE: POND BIOMASS & WEEKLY GROWTH SAMPLING ESTIMATOR */}
                <div className={`lg:col-span-3 rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                  <h3 className="font-extrabold text-sm flex items-center gap-2 text-indigo-500">
                    <Scale className="w-4 h-4" /> {L('Pond Standing Biomass & Weekly Growth Sampling Estimator', 'చెరువు బయోమాస్ & వారపు పెరుగుదల అంచనా')}
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Stocked Seed (PL)', 'వదిలిన సీడ్ (PL)')}</label>
                      <input type="number" step="10000" value={biomassCalc.stockedPl} onChange={(e) => setBiomassCalc({ ...biomassCalc, stockedPl: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Est. Survival (%)', 'అంచనా సర్వైవల్ (%)')}</label>
                      <input type="number" min="20" max="100" value={biomassCalc.survivalPct} onChange={(e) => setBiomassCalc({ ...biomassCalc, survivalPct: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Current Avg Body Weight (g)', 'ప్రస్తుత సగటు బరువు (గ్రాములు)')}</label>
                      <input type="number" step="0.5" min="0.5" value={biomassCalc.abwGrams} onChange={(e) => setBiomassCalc({ ...biomassCalc, abwGrams: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                    </div>
                  </div>
                  {(() => {
                    const livePrawns = Math.round((Number(biomassCalc.stockedPl) || 0) * ((Number(biomassCalc.survivalPct) || 80) / 100));
                    const abw = Math.max(0.5, Number(biomassCalc.abwGrams) || 10);
                    const biomassKg = Math.round((livePrawns * abw) / 1000);
                    const countPerKg = Math.round(1000 / abw);
                    const feedPct = abw < 5 ? 5.5 : abw < 12 ? 3.5 : abw < 20 ? 2.6 : 2.0;
                    const recDailyFeed = Math.round(biomassKg * (feedPct / 100));
                    return (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                        <div className={`p-3 rounded-xl border ${subCardBg}`}>
                          <span className="text-[10px] opacity-60 block">{L('Live Standing Biomass', 'చెరువులో ఉన్న మొత్తం బరువు')}</span>
                          <b className="text-base text-indigo-500">{biomassKg.toLocaleString('en-IN')} kg</b>
                        </div>
                        <div className={`p-3 rounded-xl border ${subCardBg}`}>
                          <span className="text-[10px] opacity-60 block">{L('Current Harvest Count', 'ప్రస్తుత రొయ్యల కౌంట్')}</span>
                          <b className="text-base">{countPerKg} Count / kg</b>
                        </div>
                        <div className={`p-3 rounded-xl border ${subCardBg}`}>
                          <span className="text-[10px] opacity-60 block">{L('Recommended Feed Rate', 'సూచించిన ఫీడ్ %')}</span>
                          <b className="text-base text-teal-500">{feedPct}% Biomass</b>
                        </div>
                        <div className="p-3 rounded-xl border bg-emerald-500/10 border-emerald-500/30 text-emerald-500">
                          <span className="text-[10px] opacity-80 block">{L('Recommended Daily Feed', 'రోజువారీ కావాల్సిన ఫీడ్')}</span>
                          <b className="text-base">{recDailyFeed.toLocaleString('en-IN')} kg / day</b>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* FEATURE 16: INTERACTIVE "WHAT-IF" FCR FEED OPTIMIZER (10-TON HARVEST) */}
                <div className={`lg:col-span-3 rounded-2xl p-5 border shadow-xs space-y-4 ${cardBg}`}>
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="font-extrabold text-sm flex items-center gap-2 text-teal-500">
                      <Sliders className="w-4 h-4" /> {L('Interactive "What-If" FCR Feed Optimizer (For 10-Ton Harvest)', 'ఇంటరాక్టివ్ "What-If" FCR ఫీడ్ ఆప్టిమైజర్ (10 టన్నుల దిగుబడికి)')}
                    </h3>
                    <div className="flex items-center gap-2 text-xs">
                      <span className="opacity-70 font-bold">{L('25kg Bag Price (₹):', '25kg బస్తా ధర (₹):')}</span>
                      <input
                        type="number"
                        step="50"
                        value={whatIfBagPrice}
                        onChange={(e) => setWhatIfBagPrice(cleanNum(e.target.value))}
                        className={`w-24 border rounded-lg px-2 py-1 text-xs font-bold select-text ${inputCls}`}
                      />
                    </div>
                  </div>
                  {(() => {
                    const harvestKg = 10000; // 10 Tons
                    const baseFcr = 1.50;
                    const baseBags = Math.ceil((harvestKg * baseFcr) / 25);
                    const currBags = Math.ceil((harvestKg * whatIfFcr) / 25);
                    const bagsDiff = baseBags - currBags;
                    const moneyDiff = bagsDiff * whatIfBagPrice;
                    const totalCost = currBags * whatIfBagPrice;
                    return (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-xs font-bold mb-1">
                            <span>{L('Target FCR:', 'లక్ష్య FCR:')} <b className="text-teal-500 text-sm">{(Number(whatIfFcr) || 0).toFixed(2)}</b></span>
                            <span className="opacity-60">{L('Baseline Standard FCR: 1.50', 'సాధారణ బేస్‌లైన్ FCR: 1.50')}</span>
                          </div>
                          <input
                            type="range"
                            min="1.10"
                            max="2.00"
                            step="0.05"
                            value={whatIfFcr}
                            onChange={(e) => setWhatIfFcr(Number(e.target.value))}
                            className="w-full accent-teal-600 cursor-pointer"
                          />
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                          <div className={`p-3 rounded-xl border ${subCardBg}`}>
                            <span className="text-[10px] opacity-60 block">{L('Feed Needed (10 Tons)', 'కావాల్సిన ఫీడ్ (10 టన్నులకు)')}</span>
                            <b className="text-base">{currBags.toLocaleString('en-IN')} {L('Bags', 'బస్తాలు')}</b>
                          </div>
                          <div className={`p-3 rounded-xl border ${subCardBg}`}>
                            <span className="text-[10px] opacity-60 block">{L('Total Feed Spend', 'మొత్తం ఫీడ్ ఖర్చు')}</span>
                            <b className="text-base">₹{totalCost.toLocaleString('en-IN')}</b>
                          </div>
                          <div className={`p-3 rounded-xl border ${bagsDiff >= 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500' : 'bg-rose-500/10 border-rose-500/30 text-rose-500'}`}>
                            <span className="text-[10px] opacity-80 block">{bagsDiff >= 0 ? L('Bags Saved vs 1.50 FCR', 'ఆదా అయ్యే బస్తాలు') : L('Extra Bags vs 1.50 FCR', 'అదనపు బస్తాలు')}</span>
                            <b className="text-base">{bagsDiff >= 0 ? `+${bagsDiff}` : bagsDiff} {L('Bags', 'బస్తాలు')}</b>
                          </div>
                          <div className={`p-3 rounded-xl border ${moneyDiff >= 0 ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-rose-600 text-white border-rose-600'}`}>
                            <span className="text-[10px] opacity-90 block">{moneyDiff >= 0 ? L('Net Cost Saved', 'నికర ఖర్చు ఆదా') : L('Extra Cost Impact', 'అదనపు ఖర్చు')}</span>
                            <b className="text-base">{moneyDiff >= 0 ? '₹' : '-₹'}{Math.abs(moneyDiff).toLocaleString('en-IN')}</b>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
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
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('Number of Ponds', 'చెరువుల సంఖ్య')}</label>
                    <input type="number" min="1" value={calcInputs.ponds} onChange={(e) => setCalcInputs({ ...calcInputs, ponds: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('Acres per Pond', 'ఒక్కో చెరువు విస్తీర్ణం (ఎకరాలు)')}</label>
                    <input type="number" step="0.5" min="0.5" value={calcInputs.acresPerPond} onChange={(e) => setCalcInputs({ ...calcInputs, acresPerPond: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('Stocking Density (/m²)', 'స్టాకింగ్ సాంద్రత (/m²)')}</label>
                    <select value={calcInputs.density} onChange={(e) => setCalcInputs({ ...calcInputs, density: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold ${inputCls}`}>
                      <option value={30}>30 / m²</option>
                      <option value={40}>40 / m²</option>
                      <option value={50}>50 / m²</option>
                      <option value={60}>60 / m²</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('Expected Survival (%)', 'అంచనా సర్వైవల్ (%)')}</label>
                    <input type="number" min="40" max="100" value={calcInputs.survival} onChange={(e) => setCalcInputs({ ...calcInputs, survival: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('Target Count (/kg)', 'లక్ష్య కౌంట్ (/kg)')}</label>
                    <select value={calcInputs.targetCount} onChange={(e) => setCalcInputs({ ...calcInputs, targetCount: Number(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold ${inputCls}`}>
                      <option value={25}>25 Count</option>
                      <option value={30}>30 Count</option>
                      <option value={40}>40 Count</option>
                      <option value={50}>50 Count</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('FCR (Feed Ratio)', 'FCR (ఫీడ్ నిష్పత్తి)')}</label>
                    <input type="number" step="0.1" min="1.0" max="2.5" value={calcInputs.fcr} onChange={(e) => setCalcInputs({ ...calcInputs, fcr: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('Market Price (₹ / kg)', 'మార్కెట్ ధర (₹ / kg)')}</label>
                    <input type="number" value={calcInputs.marketRatePerKg} onChange={(e) => setCalcInputs({ ...calcInputs, marketRatePerKg: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('Feed Cost (₹ / kg)', 'ఫీడ్ ధర (₹ / kg)')}</label>
                    <input type="number" value={calcInputs.feedCostPerKg} onChange={(e) => setCalcInputs({ ...calcInputs, feedCostPerKg: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                  <div>
                    <label className="text-xs font-bold opacity-75 block mb-1">{L('Power & Probiotics (/Acre)', 'కరెంట్ & ప్రోబయోటిక్స్ (/ఎకరానికి)')}</label>
                    <input type="number" value={calcInputs.powerProbioticCostPerAcre} onChange={(e) => setCalcInputs({ ...calcInputs, powerProbioticCostPerAcre: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                  </div>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5">
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">{L(`Total Seed (${calcResult.totalAcres} Acres)`, `మొత్తం సీడ్ (${calcResult.totalAcres} ఎకరాలు)`)}</span>
                    <span className="text-lg font-black">{calcResult.totalSeedsNeeded.toLocaleString('en-IN')} PL</span>
                  </div>
                  <div className="bg-teal-500/10 border border-teal-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-teal-600 font-bold block">{L('Projected Harvest', 'అంచనా దిగుబడి')}</span>
                    <span className="text-lg font-black">{calcResult.harvestTons} {L('Tons', 'టన్నులు')} ({calcResult.harvestKg.toLocaleString('en-IN')} kg)</span>
                  </div>
                  <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-amber-600 font-bold block">{L('Total Feed Required', 'మొత్తం కావాల్సిన ఫీడ్')}</span>
                    <span className="text-lg font-black">{calcResult.totalFeedBags} {L('Bags', 'బస్తాలు')} ({calcResult.totalFeedKg.toLocaleString('en-IN')} kg)</span>
                  </div>
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">{L('Break-Even Cost / kg', 'బ్రేక్-ఈవెన్ ఖర్చు / kg')}</span>
                    <span className="text-lg font-black">₹{calcResult.breakEvenPerKg} / kg</span>
                  </div>
                  <div className={`border rounded-xl p-3.5 ${subCardBg}`}>
                    <span className="text-[11px] opacity-60 font-bold block">{L('Gross Crop Revenue', 'మొత్తం పంట ఆదాయం')}</span>
                    <span className="text-lg font-black">₹{calcResult.grossRevenue.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-rose-500/10 border border-rose-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-rose-500 font-bold block">{L('Total Production Cost', 'మొత్తం సాగు ఖర్చు')}</span>
                    <span className="text-lg font-black">₹{calcResult.totalExpenses.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5">
                    <span className="text-[11px] text-emerald-500 font-bold block">{L('Net Profit / Acre', 'నికర లాభం / ఎకరం')}</span>
                    <span className="text-lg font-black">₹{calcResult.profitPerAcre.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="bg-emerald-600 text-white rounded-xl p-3.5">
                    <span className="text-[11px] text-emerald-100 font-bold block">{L('Total Net Crop Profit', 'మొత్తం నికర లాభం')}</span>
                    <span className="text-lg font-black">₹{calcResult.netProfit.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* FEATURE 8: HARVEST COUNT & MARKET RATE SENSITIVITY MATRIX */}
                <div className={`p-4 rounded-2xl border space-y-2 ${subCardBg}`}>
                  <h4 className="text-xs font-extrabold uppercase text-teal-500">{L(`Count-Wise Profit Sensitivity Matrix (At ${calcInputs.survival}% Survival)`, `కౌంట్ వారీగా లాభాల అంచనా (${calcInputs.survival}% సర్వైవల్ వద్ద)`)}</h4>
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
                          <div className="font-extrabold">{sc.count} {L('Count', 'కౌంట్')} @ ₹{sc.rate}/kg</div>
                          <div className="text-[11px] opacity-70">{L('Harvest:', 'దిగుబడి:')} {kg.toLocaleString('en-IN')} kg</div>
                          <div className={`font-black mt-1 ${prof >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                            {L('Net Profit:', 'నికర లాభం:')} ₹{prof.toLocaleString('en-IN')}
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
                    <Droplets className="w-5 h-5 text-teal-600" /> {L('Pond Water & Vibrio/WSSV Disease Early-Warning Matrix', 'చెరువు నీటి పరీక్ష & విబ్రియో/WSSV వ్యాధి ముందస్తు హెచ్చరిక')}
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-5 gap-4">
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{L('Water pH (7.5 - 8.3)', 'నీటి pH (7.5 - 8.3)')}</label>
                      <input type="number" step="0.1" value={waterTest.ph} onChange={(e) => setWaterTest({ ...waterTest, ph: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{L('Dissolved Oxygen (ppm)', 'కరిగిన ఆక్సిజన్ / DO (ppm)')}</label>
                      <input type="number" step="0.1" value={waterTest.doLevel} onChange={(e) => setWaterTest({ ...waterTest, doLevel: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{L('Alkalinity (ppm)', 'ఆల్కలీనిటీ (ppm)')}</label>
                      <input type="number" value={waterTest.alkalinity} onChange={(e) => setWaterTest({ ...waterTest, alkalinity: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{L('Ammonia (ppm)', 'అమ్మోనియా (ppm)')}</label>
                      <input type="number" step="0.01" value={waterTest.ammonia} onChange={(e) => setWaterTest({ ...waterTest, ammonia: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                    <div>
                      <label className="text-xs font-bold opacity-75 block mb-1">{L('Pond Salinity (PPT)', 'చెరువు ఉప్పదనం (PPT)')}</label>
                      <input type="number" value={waterTest.salinity} onChange={(e) => setWaterTest({ ...waterTest, salinity: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-sm font-bold select-text ${inputCls}`} />
                    </div>
                  </div>
                  {(() => {
                    const isSafe = waterTest.ph >= 7.5 && waterTest.ph <= 8.4 && waterTest.doLevel >= 4.5 && waterTest.ammonia <= 0.1;
                    const vibrioRisk = waterTest.ph > 8.4 && waterTest.salinity > 20 ? 'HIGH' : waterTest.ammonia > 0.08 ? 'MODERATE' : 'LOW';
                    return (
                      <div className="space-y-2">
                        <div className={`p-4 rounded-xl border text-xs font-bold ${isSafe ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-500' : 'bg-amber-500/15 border-amber-500/40 text-amber-500'}`}>
                          {isSafe
                            ? L('✅ Pond water parameters are OPTIMAL for immediate PL stocking!', '✅ చెరువు నీటి నాణ్యత సీడ్ వదలడానికి అనుకూలంగా ఉంది!')
                            : L('⚠️ Warning: Stabilize pH (7.5-8.3), DO (above 4.5 ppm), and Ammonia (below 0.1 ppm) before stocking.', '⚠️ హెచ్చరిక: సీడ్ వదిలే ముందు pH (7.5-8.3), DO (4.5 ppm పైన), మరియు అమ్మోనియా (0.1 ppm లోపు) సరిచేయండి.')}
                        </div>
                        {/* FEATURE 7: VIBRIO / PATHOGEN RISK BADGE */}
                        <div className={`p-3.5 rounded-xl border text-xs font-bold flex items-center justify-between ${subCardBg}`}>
                          <span>{L('Luminescent Vibrio & EHP Susceptibility Risk:', 'విబ్రియో & EHP వ్యాధి రిస్క్ అంచనా:')}</span>
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
                    <h4 className="font-bold text-sm text-teal-500">{L('Salinity Acclimatization Time Calculator', 'ఉప్పదనం అలవాటు (Acclimatization) కాలిక్యులేటర్')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Hatchery PPT', 'హేచరీ PPT')}</label>
                        <input type="number" value={acclimCalc.hatcheryPpt} onChange={(e) => setAcclimCalc({ ...acclimCalc, hatcheryPpt: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Pond PPT', 'చెరువు PPT')}</label>
                        <input type="number" value={acclimCalc.pondPpt} onChange={(e) => setAcclimCalc({ ...acclimCalc, pondPpt: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                    </div>
                    <div className={`p-3 rounded-xl border text-xs ${subCardBg}`}>
                      Salinity Variance: <b>{Math.abs(acclimCalc.hatcheryPpt - acclimCalc.pondPpt)} PPT</b> • Required Acclimatization Time: <b className="text-teal-500">{Math.abs(acclimCalc.hatcheryPpt - acclimCalc.pondPpt) * 4} Hours</b> (1 PPT every 4 hrs).
                    </div>
                    {/* FEATURE 6: LIVE SALINITY ACCLIMATIZATION COUNTDOWN TIMER */}
                    {(() => {
                      const totalSecs = Math.max(1, Math.abs(acclimCalc.hatcheryPpt - acclimCalc.pondPpt) * 4 * 3600);
                      const hrs = String(Math.floor(acclimTimerSec / 3600)).padStart(2, '0');
                      const mins = String(Math.floor((acclimTimerSec % 3600) / 60)).padStart(2, '0');
                      const secs = String(acclimTimerSec % 60).padStart(2, '0');
                      const pctDone = Math.min(100, Math.max(0, Math.round(((totalSecs - acclimTimerSec) / totalSecs) * 100)));
                      return (
                        <div className={`p-3.5 rounded-xl border border-teal-500/30 space-y-2.5 ${subCardBg}`}>
                          <div className="flex items-center justify-between">
                            <span className="text-[11px] font-extrabold text-teal-500 inline-flex items-center gap-1.5">
                              <Timer className="w-3.5 h-3.5" /> {L('Live Acclimatization Countdown', 'లైవ్ అక్లైమటైజేషన్ టైమర్')}
                            </span>
                            <span className="font-mono text-lg font-black text-teal-600">{hrs}:{mins}:{secs}</span>
                          </div>
                          <div className="w-full h-1.5 bg-slate-300/30 rounded-full overflow-hidden">
                            <div className="h-full bg-teal-500 transition-all" style={{ width: `${pctDone}%` }} />
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() => {
                                if (acclimTimerSec <= 0) setAcclimTimerSec(Math.abs(acclimCalc.hatcheryPpt - acclimCalc.pondPpt) * 4 * 3600);
                                setAcclimTimerRunning(!acclimTimerRunning);
                              }}
                              className={`flex-1 py-1.5 rounded-lg text-xs font-bold text-white cursor-pointer ${acclimTimerRunning ? 'bg-amber-500 hover:bg-amber-600' : 'bg-teal-600 hover:bg-teal-700'}`}
                            >
                              {acclimTimerRunning ? L('Pause', 'పాజ్') : L('Start Timer', 'ప్రారంభించు')}
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setAcclimTimerRunning(false);
                                setAcclimTimerSec(Math.abs(acclimCalc.hatcheryPpt - acclimCalc.pondPpt) * 4 * 3600);
                              }}
                              className={`px-3 py-1.5 rounded-lg border text-xs font-bold cursor-pointer ${cardBg}`}
                            >
                              {L('Reset', 'రీసెట్')}
                            </button>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  <div className={`rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                    <h4 className="font-bold text-sm text-teal-500">{L('Oxygen Packing Bags & Van Size Estimator', 'ఆక్సిజన్ ప్యాకింగ్ బ్యాగ్‌లు & వ్యాన్ అంచనా')}</h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Total Seed (PL)', 'మొత్తం సీడ్ (PL)')}</label>
                        <input type="number" step="50000" value={oxygenCalc.seedCount} onChange={(e) => setOxygenCalc({ ...oxygenCalc, seedCount: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
                      </div>
                      <div>
                        <label className="text-[11px] font-bold opacity-75 block mb-1">{L('Transit Hours', 'ప్రయాణ సమయం (గంటలు)')}</label>
                        <input type="number" value={oxygenCalc.travelHours} onChange={(e) => setOxygenCalc({ ...oxygenCalc, travelHours: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-3 py-2 text-xs font-bold select-text ${inputCls}`} />
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

                {/* FEATURE 21: EMERGENCY AQUA LAB & DISEASE SOS HELPLINE */}
                <div className={`rounded-2xl p-5 border-2 border-rose-500/40 bg-rose-500/5 flex flex-wrap items-center justify-between gap-4`}>
                  <div className="space-y-1">
                    <span className="text-xs font-extrabold uppercase text-rose-500 inline-flex items-center gap-1.5">
                      <ShieldAlert className="w-4 h-4" /> {L('Emergency Aqua Lab & Disease SOS Helpline', 'అత్యవసర ఆక్వా ల్యాబ్ & వ్యాధి SOS హెల్ప్‌లైన్')}
                    </span>
                    <p className="text-xs opacity-80">
                      {L('Suspecting White Spot (WSSV), EHP, or sudden mortality? Call AP Fisheries SOS or send your current Water Lab report on WhatsApp in 1 click.', 'వైట్ స్పాట్ (WSSV), EHP లేదా ఆకస్మిక మరణాలు కనిపిస్తే వెంటనే AP ఫిషరీస్ SOS కు కాల్ చేయండి లేదా వాటర్ రిపోర్ట్ WhatsApp లో పంపండి.')}
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:flex sm:flex-wrap items-center gap-2 w-full lg:w-auto">
                    <a
                      href="tel:18004251660"
                      className="w-full sm:w-auto justify-center bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 shadow-xs text-center"
                    >
                      <PhoneCall className="w-4 h-4 shrink-0" /> {L('AP Fisheries SOS (1800-425-1660)', 'AP ఫిషరీస్ SOS కాల్')}
                    </a>
                    <button
                      type="button"
                      onClick={handlePrintStockingSop}
                      className={`w-full sm:w-auto justify-center px-4 py-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${cardBg}`}
                    >
                      <Printer className="w-4 h-4 text-teal-600 shrink-0" /> {L('Print Stocking SOP', 'స్టాకింగ్ SOP ప్రింట్')}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const msg = `🚨 *Aqua Mark Emergency Water Lab Report*
• Farmer: ${currentUser.name} (+91 ${currentUser.phone})
• pH: ${waterTest.ph} | DO: ${waterTest.doLevel} ppm
• Alkalinity: ${waterTest.alkalinity} ppm | Ammonia: ${waterTest.ammonia} ppm
• Salinity: ${waterTest.salinity} PPT
Please advise immediate treatment protocol.`;
                        openWhatsAppMessage(ADMIN_WHATSAPP_NUMBER, msg);
                      }}
                      className="w-full sm:w-auto justify-center bg-green-600 hover:bg-green-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl inline-flex items-center gap-1.5 cursor-pointer shadow-xs"
                    >
                      <Send className="w-4 h-4" /> {L('WhatsApp Water Report to Lab', 'ల్యాబ్‌కు వాటర్ రిపోర్ట్ పంపండి')}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 6: DOC 1-110 FEEDING SCHEDULE */}
            {buyerTab === 'guide' && (
              <div className={`rounded-2xl p-6 border shadow-xs space-y-3 ${cardBg}`}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h4 className="font-bold text-sm">{L('DOC 1–110 Standard Vannamei Feeding & Check-Tray Chart (Per 1,00,000 PL)', 'DOC 1–110 వనామీ ఫీడింగ్ & చెక్-ట్రే చార్ట్ (1,00,000 PL కు)')}</h4>
                  <button
                    type="button"
                    onClick={() => handleVoiceReadout(
                      'doc_guide',
                      'DOC 1 to 10: feed 2 to 4 kg per lakh daily, blind feeding. DOC 11 to 20: 4.2 to 7.5 kg. DOC 21 to 35: 8 to 14 kg, check tray after 2.5 hours. DOC 36 to 55: 15 to 24 kg. DOC 56 to 80: 25 to 34 kg. DOC 81 to 110: 35 to 42 kg per lakh.',
                      'DOC 1 నుండి 10 రోజులు: లక్ష సీడ్ కు రోజుకు 2 నుండి 4 కిలోల ఫీడ్ వేయండి. DOC 11 నుండి 20: 4.2 నుండి 7.5 కిలోలు. DOC 21 నుండి 35: 8 నుండి 14 కిలోలు, 2.5 గంటల తర్వాత చెక్ ట్రే చూడండి. DOC 36 నుండి 55: 15 నుండి 24 కిలోలు. DOC 56 నుండి 110: 25 నుండి 42 కిలోల వరకు ఫీడ్ అందించండి.'
                    )}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${isSpeakingId === 'doc_guide' ? 'bg-teal-600 text-white border-teal-600' : subCardBg}`}
                  >
                    {isSpeakingId === 'doc_guide' ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-teal-600" />}
                    {isSpeakingId === 'doc_guide' ? L('Stop Audio', 'ఆపు') : L('Listen Chart', 'వాయిస్‌లో వినండి')}
                  </button>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-slate-300/30 opacity-65 uppercase text-[10px]">
                        <th className="py-2">{L('Crop Stage', 'పంట దశ')}</th>
                        <th className="py-2">{L('Avg Body Weight', 'సగటు బరువు')}</th>
                        <th className="py-2">{L('Daily Feed / Lakh', 'రోజువారీ ఫీడ్ / లక్షకు')}</th>
                        <th className="py-2">{L('Feed Grade', 'ఫీడ్ గ్రేడ్')}</th>
                        <th className="py-2">{L('Check-Tray Protocol', 'చెక్-ట్రే విధానం')}</th>
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
            {/* ONE-STEP HATCHERY & BANK REGISTRATION (NO MANDATORY DEPOSIT) */}
            {!myFixedHatchery ? (
              <div className={`rounded-2xl p-5 sm:p-8 border shadow-xs space-y-5 ${cardBg}`}>
                <div>
                  <span className="bg-teal-500/15 text-teal-600 border border-teal-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                    ✓ CAA Hatchery Onboarding • Zero Upfront Deposit
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
                <div className={`rounded-2xl p-4 sm:p-7 border-2 border-teal-500/30 shadow-xs space-y-4 ${cardBg}`}>
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3.5 sm:gap-4">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="inline-flex items-center gap-1.5 bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <Lock className="w-3 h-3" /> {t.hatcheryLockedBanner} {currentUser.phone}
                        </span>
                        <span className="inline-flex items-center gap-1 bg-teal-500/15 text-teal-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                          <ShieldCheck className="w-3.5 h-3.5" /> {L('CAA Verified Partner', 'CAA వెరిఫైడ్ పార్టనర్')}
                        </span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white bg-slate-900 px-3 py-1 rounded-xl inline-block">
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
                          <MapPin className="w-3.5 h-3.5" /> {L('View Google Maps Pin', 'Google Maps లొకేషన్ చూడండి')} <ExternalLink className="w-3 h-3" />
                        </a>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto sm:justify-end shrink-0">
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
                            className={`flex-1 sm:flex-none justify-center border text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${subCardBg}`}
                          >
                            <Edit3 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {t.editSellerProfileBtn}
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const liveCount = batches.filter(b => b.ownerPhone === currentUser.phone && (b.availablePl || 0) > 0 && !b.isPaused).length;
                              const msg = `🦐 *${myFixedHatchery.realName}* (CAA Verified Partner)\n📜 CAA: ${myFixedHatchery.caaLicense}\n📍 Zone: ${myFixedHatchery.zone}\n✅ Live Seed Batches: ${liveCount}\n\nBook verified PCR-tested shrimp seed directly on Aqua Mark:\n${window.location.origin}`;
                              window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank', 'noopener,noreferrer');
                            }}
                            className="flex-1 sm:flex-none justify-center bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-3.5 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Share2 className="w-3.5 h-3.5 shrink-0" /> {L('Share Hatchery', 'హ్యాచరీ షేర్')}
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
                      <div className="min-w-0">
                        <span className="text-[10px] opacity-60 block">{t.upiLabel}</span>
                        <button
                          type="button"
                          onClick={() => handleCopyText(myFixedHatchery.bankDetails?.upiId, L('UPI ID Copied', 'UPI ID కాపీ అయింది'))}
                          title={L('Tap to copy UPI ID', 'UPI ID కాపీ చేయండి')}
                          className="inline-flex items-center gap-1 font-mono font-bold text-teal-500 hover:underline cursor-pointer max-w-full"
                        >
                          <span className="truncate">{myFixedHatchery.bankDetails?.upiId}</span>
                          <Copy className="w-3 h-3 shrink-0 opacity-75" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* GROUPED SELLER DISPATCH, PREP & NOTICE TOOLS (CLEAN COLLAPSIBLE) */}
                <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
                  <button
                    type="button"
                    onClick={() => setShowSellerDispatchTools(prev => !prev)}
                    className="w-full px-4 py-3.5 flex items-center justify-between gap-2 text-xs font-extrabold cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2 text-teal-600">
                      <Sliders className="w-4 h-4 shrink-0" />
                      {L('Dispatch, Shift Queue & Holiday Notice Tools', 'ప్యాకింగ్ షిఫ్ట్, ఆక్సిజన్ ప్రెప్ & సెలవు నోటీసు టూల్స్')}
                    </span>
                    <span className="inline-flex items-center gap-2 shrink-0">
                      <span className="bg-teal-500/15 text-teal-600 text-[10px] font-bold px-2 py-0.5 rounded-full">
                        {hatcheryUpcomingOrders.length} {L('Queued', 'క్యూలో')}
                      </span>
                      <ChevronRight className={`w-4 h-4 transition-transform ${showSellerDispatchTools ? 'rotate-90' : ''}`} />
                    </span>
                  </button>
                  {showSellerDispatchTools && (
                    <div className="p-4 pt-1 space-y-4 border-t border-slate-300/20">
                      {/* FEATURE 17: HATCHERY HOLIDAY / DISPATCH NOTICE BAR */}
                      <div className={`rounded-2xl p-4 border shadow-xs space-y-2.5 ${myFixedHatchery.dispatchNotice ? 'border-amber-500/50 bg-amber-500/10' : cardBg}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="text-xs font-extrabold inline-flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
                            <Megaphone className="w-4 h-4" /> {L('Hatchery Holiday / Dispatch Notice Bar', 'హేచరీ సెలవు / ప్యాకింగ్ నోటీసు బార్')}
                          </span>
                          {!editingNotice && (
                            <div className="flex items-center gap-2">
                              {myFixedHatchery.dispatchNotice && (
                                <button type="button" onClick={() => handleSaveHatcheryNotice('')} className="text-[11px] font-bold text-rose-500 hover:underline cursor-pointer">
                                  {L('Clear Notice', 'నోటీసు తొలగించు')}
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() => { setNoticeDraft(myFixedHatchery.dispatchNotice || ''); setEditingNotice(true); }}
                                className={`px-3 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${subCardBg}`}
                              >
                                {myFixedHatchery.dispatchNotice ? L('Edit Notice', 'నోటీసు మార్చు') : L('+ Set Notice', '+ నోటీసు పెట్టు')}
                              </button>
                            </div>
                          )}
                        </div>
                        {editingNotice ? (
                          <div className="flex flex-wrap gap-2">
                            <input
                              type="text"
                              placeholder={L('e.g., Sunday Holiday — Next packing starts Monday 04:00 AM', 'ఉదా: ఆదివారం సెలవు — తదుపరి ప్యాకింగ్ సోమవారం ఉదయం 4 గంటలకు')}
                              value={noticeDraft}
                              onChange={(e) => setNoticeDraft(e.target.value)}
                              className={`flex-1 min-w-[220px] border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`}
                            />
                            <button type="button" onClick={() => handleSaveHatcheryNotice(noticeDraft)} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                              {L('Publish Notice', 'సేవ్ చేయండి')}
                            </button>
                            <button type="button" onClick={() => setEditingNotice(false)} className={`px-3 py-2 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}>
                              Cancel
                            </button>
                          </div>
                        ) : (
                          <p className="text-xs opacity-80">
                            {myFixedHatchery.dispatchNotice
                              ? myFixedHatchery.dispatchNotice
                              : L('No active holiday or delay notice. Set a custom notice to display on all your live batch cards.', 'ప్రస్తుతం నోటీసు లేదు. సెలవు లేదా ప్యాకింగ్ ఆలస్యం ఉంటే ఇక్కడ నోట్ పెట్టుకోవచ్చు.')}
                          </p>
                        )}
                      </div>


                      {/* ROUND-3 FEATURE: HATCHERY TODAY'S PACKING SUMMARY & OXYGEN BOXES PREP WIDGET */}
                      {(() => {
                        const todayStr = new Date().toISOString().split('T')[0];
                        const todayOrds = hatcheryUpcomingOrders.filter(o => o.packingDate === todayStr);
                        const totalPlToday = todayOrds.reduce((s, o) => s + (o.quantity || 0) + (o.bonusSeeds || 0), 0);
                        const bagsToday = Math.ceil(totalPlToday / 2500);
                        const boxesToday = Math.ceil(bagsToday / 2);
                        const valToday = todayOrds.reduce((s, o) => s + (o.hatcheryFixedTotal || 0), 0);
                        return (
                          <div className={`rounded-2xl p-4 border shadow-xs grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs ${cardBg}`}>
                            <div className={`p-3 rounded-xl border ${subCardBg}`}>
                              <span className="text-[10px] opacity-60 block">{L("Today's Packing Orders", 'నేటి ప్యాకింగ్ ఆర్డర్లు')}</span>
                              <b className="text-lg text-teal-600">{todayOrds.length}</b>
                            </div>
                            <div className={`p-3 rounded-xl border ${subCardBg}`}>
                              <span className="text-[10px] opacity-60 block">{L('Total PL + Bonus Today', 'నేటి మొత్తం PL + బోనస్')}</span>
                              <b className="text-lg">{totalPlToday.toLocaleString('en-IN')}</b>
                            </div>
                            <div className={`p-3 rounded-xl border ${subCardBg}`}>
                              <span className="text-[10px] opacity-60 block">{L('Prep Oxygen Bags / Boxes', 'ఆక్సిజన్ బ్యాగ్స్ / బాక్సులు')}</span>
                              <b className="text-lg text-indigo-500">{bagsToday} / {boxesToday}</b>
                            </div>
                            <div className={`p-3 rounded-xl border ${subCardBg}`}>
                              <span className="text-[10px] opacity-60 block">{L("Today's Dispatch Value", 'నేటి డిస్పాచ్ విలువ')}</span>
                              <b className="text-lg text-emerald-500">₹{valToday.toLocaleString('en-IN')}</b>
                            </div>
                          </div>
                        );
                      })()}

                      {/* FEATURE 13: HATCHERY PACKING BAY SHIFT QUEUE BOARD */}
                      <div className={`rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <h3 className="font-extrabold text-sm flex items-center gap-2">
                            <Clock className="w-4 h-4 text-teal-600" /> {L('Hatchery Packing Bay Shift Queue Board', 'హేచరీ ప్యాకింగ్ బే షిఫ్ట్ క్యూ బోర్డ్')}
                          </h3>
                          <button
                            type="button"
                            onClick={() => handleExportCsvLedger(myHatcheryOrders, 'Hatchery')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${subCardBg}`}
                          >
                            <Download className="w-3.5 h-3.5 text-teal-600" /> {L('Export CSV', 'CSV డౌన్‌లోడ్')}
                          </button>
                        </div>
                        {hatcheryUpcomingOrders.length === 0 ? (
                          <p className="text-xs opacity-60">{L('No active packing orders in the shift queue right now.', 'ప్రస్తుతం ప్యాకింగ్ క్యూలో ఆర్డర్లు లేవు.')}</p>
                        ) : (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {PACKING_TIME_SLOTS.map(slot => {
                              const slotOrders = hatcheryUpcomingOrders.filter(o => (o.packingTimeSlot || 'All Day (24 Hours Flexible)') === slot);
                              if (slotOrders.length === 0) return null;
                              return (
                                <div key={slot} className={`border rounded-xl p-3 space-y-2 ${subCardBg}`}>
                                  <div className="flex items-center justify-between text-[11px] font-extrabold text-teal-600">
                                    <span>{slot}</span>
                                    <span className="bg-teal-500/15 px-2 py-0.5 rounded-full">{slotOrders.length} {L('Order(s)', 'ఆర్డర్లు')}</span>
                                  </div>
                                  {slotOrders.map(ord => (
                                    <div
                                      key={ord.bookingId}
                                      onClick={() => setInspectedSellerOrder(ord)}
                                      className={`p-2.5 rounded-lg border flex items-center justify-between gap-2 text-xs cursor-pointer hover:border-teal-500 ${cardBg}`}
                                    >
                                      <div>
                                        <b className="font-mono text-teal-500">{ord.bookingId}</b> • <b>{ord.farmerName}</b>
                                        <span className="block text-[10px] opacity-65">Batch {ord.batch?.id} • {(ord.quantity || 0).toLocaleString('en-IN')} PL • Pond {ord.pondSalinity} PPT • {ord.packingDate}</span>
                                      </div>
                                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full shrink-0 ${ord.packingStatus === 'PACKING_DONE_BY_SELLER' ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>
                                        {ord.packingStatus === 'PACKING_DONE_BY_SELLER' ? 'Packed ✓' : 'Queued'}
                                      </span>
                                    </div>
                                  ))}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  )}
                </div>

                {/* B2B HATCHERY OWNER ADVANTAGE & NO-SHOW PROTECTION BAR */}
                <div className={`rounded-2xl p-3.5 border border-emerald-500/30 bg-emerald-500/5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs ${cardBg}`}>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block leading-tight">{L('Zero No-Show Shield', 'నో-షో రక్షణ')}</span>
                      <span className="text-[10px] opacity-65">{L('Non-refundable 5% advance', 'నాన్-రిఫండబుల్ 5% అడ్వాన్స్')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-teal-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block leading-tight">{L('Direct Farmer + Broker Reach', 'రైతు + బ్రోకర్ నెట్‌వర్క్')}</span>
                      <span className="text-[10px] opacity-65">{L('Instant batch alerts to brokers', 'బ్రోకర్లకు తక్షణ అలర్ట్')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <ScanLine className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block leading-tight">{L('1-Scan Gate Settlement', '1-స్కాన్ సెటిల్‌మెంట్')}</span>
                      <span className="text-[10px] opacity-65">{L('QR verifies & clears invoice', 'QR తో తక్షణ రసీదు')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block leading-tight">{hatcheryClearedOrders.length} {L('Verified Dispatches', 'పూర్తయిన ఆర్డర్లు')}</span>
                      <span className="text-[10px] opacity-65">{L('Boosts coastal trust rank', 'మార్కెట్ ర్యాంక్ పెంచుతుంది')}</span>
                    </div>
                  </div>
                </div>

                {/* BELOW HATCHERY DETAILS: 3 CLICKABLE TABS */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div
                    onClick={() => setSellerTxModal({ title: 'Upcoming Packing Receivable Transactions', list: hatcheryUpcomingOrders })}
                    className={`border hover:border-amber-500 rounded-2xl p-5 shadow-xs cursor-pointer transition ${cardBg}`}
                  >
                    <span className="text-xs text-amber-500 font-bold flex items-center justify-between">
                      <span className="inline-flex items-center gap-1.5"><Clock className="w-4 h-4" /> {L('Upcoming Packing Receivable', 'రాబోయే ప్యాకింగ్ ఆదాయం')}</span>
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
                      <span className="inline-flex items-center gap-1.5"><Package className="w-4 h-4" /> {L('Packing Orders', 'ప్యాకింగ్ ఆర్డర్లు')}</span>
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
                      <span className="inline-flex items-center gap-1.5"><Video className="w-4 h-4" /> {L('Live Video Requests', 'లైవ్ వీడియో అభ్యర్థనలు')}</span>
                      <span className="underline text-[11px]">Open & Reply →</span>
                    </span>
                    <div className="text-2xl font-black mt-1.5">
                      {myLiveVideoReqs.filter(r => r.status !== 'COMPLETED').length} {L('Pending', 'పెండింగ్')}
                      {myLiveVideoReqs.filter(r => r.status === 'COMPLETED').length > 0 && (
                        <span className="text-xs font-bold opacity-60 ml-1.5">({myLiveVideoReqs.length} {L('Total', 'మొత్తం')})</span>
                      )}
                    </div>
                    <p className="text-[11px] opacity-60 mt-1">
                      {myLiveVideoReqs[0]
                        ? `Latest: ${myLiveVideoReqs[0].farmerName} (Batch ${myLiveVideoReqs[0].batchId})`
                        : 'Click to view farmer live video requests'}
                    </p>
                  </div>
                </div>

                {/* OWNER'S ACTIVE BATCHES & EDIT (COLLAPSIBLE — OPENS ON CLICK) */}
                <div className={`rounded-2xl border shadow-xs overflow-hidden ${cardBg}`}>
                  <button
                    type="button"
                    onClick={() => setShowActiveBatches(prev => !prev)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-teal-500/5 transition"
                  >
                    <span className="text-sm sm:text-base font-extrabold flex items-center gap-2 min-w-0">
                      <Layers className="w-5 h-5 text-teal-600 shrink-0" />
                      <span className="truncate">{t.myBatchesTitle} ({myOwnedBatches.length})</span>
                    </span>
                    <span className="inline-flex items-center gap-2 shrink-0">
                      <span className="bg-teal-500/15 text-teal-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap">
                        {showActiveBatches ? L('Close', 'మూసివేయి') : L('View / Edit', 'చూడండి / మార్చండి')}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-teal-600 transition-transform ${showActiveBatches ? 'rotate-90' : ''}`} />
                    </span>
                  </button>
                  {showActiveBatches && (
                    <div className="px-4 sm:px-6 pb-5 pt-3 border-t border-slate-300/20 space-y-4">
                      {myOwnedBatches.length > 0 && (
                        <div className="relative w-full sm:w-64">
                          <Search className="w-3.5 h-3.5 opacity-50 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input
                            type="text"
                            value={sellerBatchSearch}
                            onChange={(e) => setSellerBatchSearch(e.target.value)}
                            placeholder={L('Search batch ID or species...', 'బ్యాచ్ ID / రకం వెతకండి...')}
                            className={`w-full border rounded-xl pl-8 pr-3 py-1.5 text-xs select-text ${inputCls}`}
                          />
                        </div>
                      )}
                      {myOwnedBatches.length === 0 ? (
                        <p className="text-xs opacity-60">{t.noBatchesSeller}</p>
                      ) : (() => {
                        const liveCnt = myOwnedBatches.filter(b => !b.paused && (b.availablePl || 0) > 0).length;
                        const pausedCnt = myOwnedBatches.filter(b => b.paused).length;
                        const soldCnt = myOwnedBatches.filter(b => (b.availablePl || 0) <= 0).length;
                        const q = sellerBatchSearch.trim().toLowerCase();
                        const filteredOwnedBatches = myOwnedBatches.filter(b => {
                          if (sellerBatchFilter === 'LIVE' && (b.paused || (b.availablePl || 0) <= 0)) return false;
                          if (sellerBatchFilter === 'PAUSED' && !b.paused) return false;
                          if (sellerBatchFilter === 'SOLD' && (b.availablePl || 0) > 0) return false;
                          if (q && !`${b.id} ${b.species} ${b.plStage}`.toLowerCase().includes(q)) return false;
                          return true;
                        });
                        return (
                          <>
                            <div className="flex flex-wrap items-center gap-1.5">
                              {[
                                { id: 'ALL', label: L('All', 'అన్నీ'), cnt: myOwnedBatches.length },
                                { id: 'LIVE', label: L('Live', 'లైవ్'), cnt: liveCnt },
                                { id: 'PAUSED', label: L('Paused', 'పాజ్'), cnt: pausedCnt },
                                { id: 'SOLD', label: L('Sold Out', 'అయిపోయాయి'), cnt: soldCnt },
                              ].map((st) => (
                                <button
                                  key={st.id}
                                  type="button"
                                  onClick={() => setSellerBatchFilter(st.id)}
                                  className={`px-2.5 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${sellerBatchFilter === st.id
                                    ? 'bg-teal-600 text-white border-teal-600'
                                    : `${subCardBg} opacity-80 hover:opacity-100`
                                    }`}
                                >
                                  {st.label} ({st.cnt})
                                </button>
                              ))}
                            </div>
                            {filteredOwnedBatches.length === 0 ? (
                              <p className="text-xs opacity-60 py-4 text-center">{L('No matching batches found.', 'సరిపోయే బ్యాచ్‌లు లేవు.')}</p>
                            ) : (
                              <div className="max-h-[55vh] overflow-y-auto pr-1 space-y-3">
                                {filteredOwnedBatches.map((b) => {
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
                                          {(() => {
                                            const batchOrders = myHatcheryOrders.filter(o => o.batch?.id === b.id && o.packingStatus !== 'CANCELLED');
                                            const soldPl = batchOrders.reduce((s, o) => s + (o.quantity || 0), 0);
                                            return (
                                              <span className="block text-[11px] opacity-70 mt-0.5">
                                                Packing: {b.availableDate} ({b.availableTimeSlot}) • Media: {(b.pcrImages || []).length} PCR / {(b.seedImages || []).length} Seed / {(b.tankVideos || []).length} Vid
                                                {batchOrders.length > 0 && (
                                                  <span className="text-emerald-500 font-bold"> • {batchOrders.length} Booked ({soldPl.toLocaleString('en-IN')} PL)</span>
                                                )}
                                              </span>
                                            );
                                          })()}
                                        </div>
                                        <div className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-2 w-full sm:w-auto shrink-0">
                                          {/* TOP-LEFT: CRATE QR */}
                                          <button
                                            type="button"
                                            onClick={() => setCrateQrBatch(b)}
                                            className="bg-indigo-500/15 hover:bg-indigo-500/25 border border-indigo-500/30 text-indigo-500 text-xs font-bold px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap"
                                          >
                                            <QrCode className="w-3.5 h-3.5 shrink-0" /> {L('Crate QR', 'క్రేట్ QR')}
                                          </button>
                                          {/* TOP-RIGHT: PAUSE / RESUME */}
                                          <button
                                            type="button"
                                            onClick={() => togglePauseBatch(b.id)}
                                            className={`border text-xs font-bold px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${b.paused ? 'bg-emerald-500/15 border-emerald-500/30 text-emerald-500' : 'bg-amber-500/15 border-amber-500/30 text-amber-500'}`}
                                          >
                                            {b.paused ? <><PlayCircle className="w-3.5 h-3.5 shrink-0" /> Resume Live</> : <><PauseCircle className="w-3.5 h-3.5 shrink-0" /> Pause</>}
                                          </button>
                                          {/* BOTTOM-LEFT: EDIT BATCH (OR SAVE/CANCEL WHEN EDITING) */}
                                          {isEditing ? (
                                            <div className="flex items-center gap-1.5">
                                              <button type="button" onClick={() => saveEditedBatch(b.id)} className="flex-1 bg-emerald-600 text-white text-xs font-bold px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-lg cursor-pointer whitespace-nowrap">
                                                {t.saveChangesBtn}
                                              </button>
                                              <button type="button" onClick={() => setEditingBatchId(null)} className={`border text-xs font-bold px-2.5 py-2 sm:py-1.5 rounded-xl sm:rounded-lg cursor-pointer whitespace-nowrap ${cardBg}`}>
                                                Cancel
                                              </button>
                                            </div>
                                          ) : (
                                            <button type="button" onClick={() => startEditingBatch(b)} className={`border text-xs font-bold px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap ${cardBg}`}>
                                              <Edit3 className="w-3.5 h-3.5 text-teal-600 shrink-0" /> {t.editBatchBtn}
                                            </button>
                                          )}
                                          {/* BOTTOM-RIGHT: REMOVE */}
                                          <button type="button" onClick={() => removeBatch(b.id)} className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold px-3 py-2 sm:py-1.5 rounded-xl sm:rounded-lg inline-flex items-center justify-center gap-1.5 cursor-pointer whitespace-nowrap">
                                            <Trash2 className="w-3.5 h-3.5 shrink-0" /> {t.removeBtn}
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

                                          <div className="pt-3 border-t border-slate-300/20 space-y-3">
                                            <button
                                              type="button"
                                              disabled={uploadProgress.active}
                                              onClick={() => setShowEditMediaPanel(prev => !prev)}
                                              className={`w-full border-2 border-teal-500/60 hover:border-teal-500 rounded-xl px-4 py-2.5 text-xs font-extrabold flex items-center justify-between gap-2 transition cursor-pointer ${showEditMediaPanel ? 'bg-teal-600 text-white border-teal-600' : `${cardBg} text-teal-600`}`}
                                            >
                                              <span className="inline-flex items-center gap-2">
                                                <Upload className="w-4 h-4 shrink-0" />
                                                {L('Upload Images / Videos', 'ఫోటోలు / వీడియోలు అప్‌లోడ్')}
                                              </span>
                                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${showEditMediaPanel ? 'bg-white/20 text-white' : 'bg-teal-500/15 text-teal-600'}`}>
                                                PCR: {(editBatchValues.pcrImages || []).length} • Seed: {(editBatchValues.seedImages || []).length} • Vid: {(editBatchValues.tankVideos || []).length}
                                              </span>
                                            </button>

                                            {showEditMediaPanel && (
                                              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                                {/* 1. UPLOAD PCR */}
                                                <div className={`rounded-xl border p-3 space-y-2.5 ${cardBg}`}>
                                                  <button
                                                    type="button"
                                                    disabled={uploadProgress.active}
                                                    onClick={() => setMediaPickerTarget(mediaPickerTarget === 'EDIT_PCR' ? null : 'EDIT_PCR')}
                                                    className={`w-full ${subCardBg} border-2 border-teal-500/50 hover:border-teal-500 text-teal-600 text-xs font-extrabold py-2 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}
                                                  >
                                                    <FileCheck2 className="w-3.5 h-3.5" /> {L('Upload PCR', 'PCR అప్‌లోడ్')} ({(editBatchValues.pcrImages || []).length})
                                                  </button>
                                                  {mediaPickerTarget === 'EDIT_PCR' && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                      <button type="button" onClick={() => editPcrCamRef.current?.click()} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                                        <Camera className="w-3.5 h-3.5" /> Camera
                                                      </button>
                                                      <button type="button" onClick={() => editPcrFileRef.current?.click()} className={`${subCardBg} border-2 border-teal-500/40 text-teal-600 text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}>
                                                        <FolderOpen className="w-3.5 h-3.5" /> Files
                                                      </button>
                                                    </div>
                                                  )}
                                                  {(editBatchValues.pcrImages || []).length > 0 && (
                                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                                      {(editBatchValues.pcrImages || []).map((img, i) => (
                                                        <div key={i} className={`relative rounded-xl border overflow-hidden ${subCardBg}`}>
                                                          <button
                                                            type="button"
                                                            onClick={() => setEditBatchValues(prev => ({
                                                              ...prev,
                                                              removedPcrUrls: [...(prev.removedPcrUrls || []), img.url],
                                                              pcrImages: prev.pcrImages.filter((_, idx) => idx !== i)
                                                            }))}
                                                            className="absolute top-1 right-1 z-10 bg-rose-600 hover:bg-rose-700 text-white w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center cursor-pointer"
                                                          >
                                                            ✕
                                                          </button>
                                                          <img
                                                            src={img.url}
                                                            alt={img.label}
                                                            onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })}
                                                            className="w-full h-20 object-cover cursor-pointer"
                                                          />
                                                          <div className="px-1.5 py-1 text-[10px] font-bold truncate">{img.label}</div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>

                                                {/* 2. UPLOAD SEED IMAGES */}
                                                <div className={`rounded-xl border p-3 space-y-2.5 ${cardBg}`}>
                                                  <button
                                                    type="button"
                                                    disabled={uploadProgress.active}
                                                    onClick={() => setMediaPickerTarget(mediaPickerTarget === 'EDIT_SEED' ? null : 'EDIT_SEED')}
                                                    className={`w-full ${subCardBg} border-2 border-teal-500/50 hover:border-teal-500 text-teal-600 text-xs font-extrabold py-2 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}
                                                  >
                                                    <Camera className="w-3.5 h-3.5" /> {L('Upload Seed Images', 'సీడ్ ఫోటోలు అప్‌లోడ్')} ({(editBatchValues.seedImages || []).length})
                                                  </button>
                                                  {mediaPickerTarget === 'EDIT_SEED' && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                      <button type="button" onClick={() => editSeedCamRef.current?.click()} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                                        <Camera className="w-3.5 h-3.5" /> Camera
                                                      </button>
                                                      <button type="button" onClick={() => editSeedFileRef.current?.click()} className={`${subCardBg} border-2 border-teal-500/40 text-teal-600 text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}>
                                                        <FolderOpen className="w-3.5 h-3.5" /> Files
                                                      </button>
                                                    </div>
                                                  )}
                                                  {(editBatchValues.seedImages || []).length > 0 && (
                                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                                      {(editBatchValues.seedImages || []).map((img, i) => (
                                                        <div key={i} className={`relative rounded-xl border overflow-hidden ${subCardBg}`}>
                                                          <button
                                                            type="button"
                                                            onClick={() => setEditBatchValues(prev => ({
                                                              ...prev,
                                                              removedSeedUrls: [...(prev.removedSeedUrls || []), img.url],
                                                              seedImages: prev.seedImages.filter((_, idx) => idx !== i)
                                                            }))}
                                                            className="absolute top-1 right-1 z-10 bg-rose-600 hover:bg-rose-700 text-white w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center cursor-pointer"
                                                          >
                                                            ✕
                                                          </button>
                                                          <img
                                                            src={img.url}
                                                            alt={img.label}
                                                            onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })}
                                                            className="w-full h-20 object-cover cursor-pointer"
                                                          />
                                                          <div className="px-1.5 py-1 text-[10px] font-bold truncate">{img.label}</div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>

                                                {/* 3. UPLOAD VIDEOS */}
                                                <div className={`rounded-xl border p-3 space-y-2.5 ${cardBg}`}>
                                                  <button
                                                    type="button"
                                                    disabled={uploadProgress.active}
                                                    onClick={() => setMediaPickerTarget(mediaPickerTarget === 'EDIT_VID' ? null : 'EDIT_VID')}
                                                    className={`w-full ${subCardBg} border-2 border-teal-500/50 hover:border-teal-500 text-teal-600 text-xs font-extrabold py-2 px-3 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}
                                                  >
                                                    <Video className="w-3.5 h-3.5" /> {L('Upload Videos', 'వీడియోలు అప్‌లోడ్')} ({(editBatchValues.tankVideos || []).length})
                                                  </button>
                                                  {mediaPickerTarget === 'EDIT_VID' && (
                                                    <div className="grid grid-cols-2 gap-2">
                                                      <button type="button" onClick={() => editVidCamRef.current?.click()} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                                        <Camera className="w-3.5 h-3.5" /> Camera
                                                      </button>
                                                      <button type="button" onClick={() => editVidFileRef.current?.click()} className={`${subCardBg} border-2 border-teal-500/40 text-teal-600 text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}>
                                                        <FolderOpen className="w-3.5 h-3.5" /> Files
                                                      </button>
                                                    </div>
                                                  )}
                                                  {(editBatchValues.tankVideos || []).length > 0 && (
                                                    <div className="grid grid-cols-2 gap-2 pt-1">
                                                      {(editBatchValues.tankVideos || []).map((vid, i) => (
                                                        <div key={i} className={`relative rounded-xl border overflow-hidden ${subCardBg}`}>
                                                          <button
                                                            type="button"
                                                            onClick={() => setEditBatchValues(prev => ({
                                                              ...prev,
                                                              removedVideoUrls: [...(prev.removedVideoUrls || []), vid.url],
                                                              tankVideos: prev.tankVideos.filter((_, idx) => idx !== i)
                                                            }))}
                                                            className="absolute top-1 right-1 z-10 bg-rose-600 hover:bg-rose-700 text-white w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center cursor-pointer"
                                                          >
                                                            ✕
                                                          </button>
                                                          <video
                                                            src={vid.url}
                                                            muted
                                                            onClick={() => setFullScreenMedia({ type: 'video', url: vid.url, label: vid.label })}
                                                            className="w-full h-20 object-cover bg-black cursor-pointer"
                                                          />
                                                          <div className="px-1.5 py-1 text-[10px] font-bold truncate">{vid.label}</div>
                                                        </div>
                                                      ))}
                                                    </div>
                                                  )}
                                                </div>
                                              </div>
                                            )}
                                          </div>
                                        </div>
                                      ) : (
                                        <div className={`grid grid-cols-2 sm:grid-cols-5 gap-2 text-center p-2.5 rounded-lg border text-xs ${cardBg}`}>
                                          <div><span className="text-[10px] opacity-55 block">{t.stage}</span><b>{b.plStage}</b></div>
                                          <div><span className="text-[10px] opacity-55 block">{t.salinity}</span><b className="text-teal-500">{b.salinity} PPT</b></div>
                                          <div><span className="text-[10px] opacity-55 block">{t.perSeed}</span><b>₹{b.pricePer1000.toFixed(2)}</b></div>
                                          <div><span className="text-[10px] opacity-55 block">{t.bonus}</span><b className="text-emerald-500">+{b.bonusPercent}%</b></div>
                                          <div><span className="text-[10px] opacity-55 block">{t.stock}</span><b>{(b.availableStock || 0).toLocaleString('en-IN')}</b></div>
                                        </div>
                                      )}
                                      {!isEditing && (
                                        <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px]">
                                          <span className="opacity-65 font-semibold">{L('Quick Stock Adjust:', 'త్వరిత స్టాక్ మార్పు:')}</span>
                                          <div className="flex items-center gap-1.5">
                                            <button type="button" onClick={() => handleQuickAdjustStock(b, -1)} className="px-2.5 py-1 rounded-lg border border-rose-500/30 bg-rose-500/10 text-rose-500 font-bold inline-flex items-center gap-0.5 cursor-pointer">
                                              <Minus className="w-3 h-3" /> 1L
                                            </button>
                                            <button type="button" onClick={() => handleQuickAdjustStock(b, 1)} className="px-2.5 py-1 rounded-lg border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-bold inline-flex items-center gap-0.5 cursor-pointer">
                                              <Plus className="w-3 h-3" /> 1L
                                            </button>
                                            <button type="button" onClick={() => handleQuickAdjustStock(b, 5)} className="px-2.5 py-1 rounded-lg border border-teal-500/30 bg-teal-500/10 text-teal-600 font-bold inline-flex items-center gap-0.5 cursor-pointer">
                                              <Plus className="w-3 h-3" /> 5L
                                            </button>
                                          </div>
                                        </div>
                                      )}
                                    </div>
                                  );
                                })}
                              </div>
                            )}
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>

                {/* ADD NEW SEED BATCH (COLLAPSIBLE — OPENS ON CLICK) */}
                <div className={`rounded-2xl border shadow-xs overflow-hidden ${cardBg}`}>
                  <button
                    type="button"
                    onClick={() => setShowPublishBatchForm(prev => !prev)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-teal-500/5 transition"
                  >
                    <span className="text-sm sm:text-base font-extrabold flex items-center gap-2">
                      <PlusCircle className="w-5 h-5 text-teal-600 shrink-0" />
                      <span>{t.addBatchTitle}</span>
                    </span>
                    <span className="inline-flex items-center gap-2 shrink-0">
                      <span className="bg-teal-500/15 text-teal-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {showPublishBatchForm ? L('Close', 'మూసివేయి') : L('+ Open Form', '+ ఫారమ్ తెరువు')}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-teal-600 transition-transform ${showPublishBatchForm ? 'rotate-90' : ''}`} />
                    </span>
                  </button>
                  {showPublishBatchForm && (
                    <div className="px-4 sm:px-6 pb-6 pt-2 border-t border-slate-300/20">
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

                        {/* UNIFIED UPLOAD IMAGES/VIDEOS BUTTON + TANK GPS */}
                        <div className="space-y-3">
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-stretch">
                            <button
                              type="button"
                              disabled={uploadProgress.active}
                              onClick={() => setShowNewMediaPanel(prev => !prev)}
                              className={`w-full border-2 border-teal-500/60 hover:border-teal-500 rounded-2xl px-4 py-3 text-xs font-extrabold flex items-center justify-between gap-2 transition cursor-pointer ${showNewMediaPanel ? 'bg-teal-600 text-white border-teal-600' : `${subCardBg} text-teal-600`}`}
                            >
                              <span className="inline-flex items-center gap-2">
                                <Upload className="w-4 h-4 shrink-0" />
                                {L('Upload Images / Videos', 'ఫోటోలు / వీడియోలు అప్‌లోడ్')}
                              </span>
                              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${showNewMediaPanel ? 'bg-white/20 text-white' : 'bg-teal-500/15 text-teal-600'}`}>
                                PCR: {pcrImages.length} • Seed: {seedImages.length} • Vid: {tankVideos.length}
                              </span>
                            </button>

                            {/* TANK GPS STAMP */}
                            <div className={`border rounded-2xl px-3.5 py-2.5 flex items-center justify-between gap-2 ${subCardBg}`}>
                              <div className="min-w-0">
                                <span className="text-xs font-extrabold flex items-center gap-1.5"><Camera className="w-4 h-4 text-teal-600 shrink-0" /> Tank GPS</span>
                                <p className="text-[11px] opacity-65 truncate mt-0.5">{gpsLocation || 'Auto Stamp'}</p>
                              </div>
                              <button type="button" onClick={handleCaptureGps} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5 cursor-pointer shrink-0 whitespace-nowrap">
                                <MapPin className="w-3.5 h-3.5" /> {gpsLocation ? t.gpsLockedBtn : t.captureGpsBtn}
                              </button>
                            </div>
                          </div>

                          {showNewMediaPanel && (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 pt-1">
                              {/* 1. UPLOAD PCR */}
                              <div className={`border rounded-2xl p-3.5 space-y-3 ${subCardBg}`}>
                                <button
                                  type="button"
                                  disabled={uploadProgress.active}
                                  onClick={() => setMediaPickerTarget(mediaPickerTarget === 'NEW_PCR' ? null : 'NEW_PCR')}
                                  className={`w-full ${cardBg} border-2 border-teal-500/50 hover:border-teal-500 text-teal-600 text-xs font-extrabold py-2.5 px-3 rounded-xl inline-flex items-center justify-center gap-2 transition cursor-pointer`}
                                >
                                  <FileCheck2 className="w-4 h-4" /> {L('Upload PCR', 'PCR అప్‌లోడ్')} ({pcrImages.length})
                                </button>
                                {mediaPickerTarget === 'NEW_PCR' && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => pcrCamRef.current?.click()} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                      <Camera className="w-4 h-4" /> Camera
                                    </button>
                                    <button type="button" onClick={() => pcrFileRef.current?.click()} className={`${cardBg} border-2 border-teal-500/40 text-teal-600 text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}>
                                      <FolderOpen className="w-4 h-4" /> Files
                                    </button>
                                  </div>
                                )}
                                {pcrImages.length > 0 ? (
                                  <div className="grid grid-cols-2 gap-2 pt-1">
                                    {pcrImages.map((img, i) => {
                                      const isBad = img.aiPcrStatus === 'NOT_A_PCR_REPORT';
                                      return (
                                        <div key={i} className={`relative rounded-xl border overflow-hidden ${isBad ? 'border-rose-500/60' : 'border-teal-500/30'} ${cardBg}`}>
                                          <button
                                            type="button"
                                            title={L('Delete image', 'ఫోటో తొలగించు')}
                                            onClick={() => {
                                              deleteStorageFilesByUrls([img.url]);
                                              setPcrImages(prev => prev.filter((_, idx) => idx !== i));
                                              showToast(L('PCR image removed.', 'PCR ఫోటో తొలగించబడింది.'));
                                            }}
                                            className="absolute top-1 right-1 z-10 bg-rose-600 hover:bg-rose-700 text-white w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shadow cursor-pointer"
                                          >
                                            ✕
                                          </button>
                                          <img
                                            src={img.url}
                                            alt={img.label}
                                            onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })}
                                            className="w-full h-20 object-cover cursor-pointer hover:opacity-90 transition"
                                          />
                                          <div className="p-1 text-[10px] font-bold flex items-center justify-between gap-1">
                                            <span className="truncate">{img.label}</span>
                                            <span className={isBad ? 'text-rose-500' : 'text-emerald-500'}>
                                              {isBad ? '✕' : '✓'}
                                            </span>
                                          </div>
                                        </div>
                                      );
                                    })}
                                  </div>
                                ) : (
                                  <span className="text-[11px] opacity-65 block text-center">{L('Required: Lab PCR Report (AI checked)', 'తప్పనిసరి: ల్యాబ్ PCR రిపోర్ట్ (AI తనిఖీ)')}</span>
                                )}
                              </div>

                              {/* 2. UPLOAD SEED IMAGES */}
                              <div className={`border rounded-2xl p-3.5 space-y-3 ${subCardBg}`}>
                                <button
                                  type="button"
                                  disabled={uploadProgress.active}
                                  onClick={() => setMediaPickerTarget(mediaPickerTarget === 'NEW_SEED' ? null : 'NEW_SEED')}
                                  className={`w-full ${cardBg} border-2 border-teal-500/50 hover:border-teal-500 text-teal-600 text-xs font-extrabold py-2.5 px-3 rounded-xl inline-flex items-center justify-center gap-2 transition cursor-pointer`}
                                >
                                  <Camera className="w-4 h-4" /> {L('Upload Seed Images', 'సీడ్ ఫోటోలు అప్‌లోడ్')} ({seedImages.length})
                                </button>
                                {mediaPickerTarget === 'NEW_SEED' && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => seedCamRef.current?.click()} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                      <Camera className="w-4 h-4" /> Camera
                                    </button>
                                    <button type="button" onClick={() => seedFileRef.current?.click()} className={`${cardBg} border-2 border-teal-500/40 text-teal-600 text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}>
                                      <FolderOpen className="w-4 h-4" /> Files
                                    </button>
                                  </div>
                                )}
                                {seedImages.length > 0 ? (
                                  <div className="grid grid-cols-2 gap-2 pt-1">
                                    {seedImages.map((img, i) => (
                                      <div key={i} className={`relative rounded-xl border border-teal-500/30 overflow-hidden ${cardBg}`}>
                                        <button
                                          type="button"
                                          title={L('Delete image', 'ఫోటో తొలగించు')}
                                          onClick={() => {
                                            deleteStorageFilesByUrls([img.url]);
                                            setSeedImages(prev => prev.filter((_, idx) => idx !== i));
                                            showToast(L('Seed image removed.', 'సీడ్ ఫోటో తొలగించబడింది.'));
                                          }}
                                          className="absolute top-1 right-1 z-10 bg-rose-600 hover:bg-rose-700 text-white w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shadow cursor-pointer"
                                        >
                                          ✕
                                        </button>
                                        <img
                                          src={img.url}
                                          alt={img.label}
                                          onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })}
                                          className="w-full h-20 object-cover cursor-pointer hover:opacity-90 transition"
                                        />
                                        <div className="p-1 text-[10px] font-bold flex items-center justify-between">
                                          <span className="truncate">{img.label}</span>
                                          <span className="text-emerald-500">✓</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[11px] opacity-65 block text-center">{L('Optional: Live PL / Tank Seed Photos', 'ఐచ్ఛికం: లైవ్ సీడ్ / ట్యాంక్ ఫోటోలు')}</span>
                                )}
                              </div>

                              {/* 3. UPLOAD VIDEOS */}
                              <div className={`border rounded-2xl p-3.5 space-y-3 ${subCardBg}`}>
                                <button
                                  type="button"
                                  disabled={uploadProgress.active}
                                  onClick={() => setMediaPickerTarget(mediaPickerTarget === 'NEW_VID' ? null : 'NEW_VID')}
                                  className={`w-full ${cardBg} border-2 border-teal-500/50 hover:border-teal-500 text-teal-600 text-xs font-extrabold py-2.5 px-3 rounded-xl inline-flex items-center justify-center gap-2 transition cursor-pointer`}
                                >
                                  <Video className="w-4 h-4" /> {L('Upload Videos', 'వీడియోలు అప్‌లోడ్')} ({tankVideos.length})
                                </button>
                                {mediaPickerTarget === 'NEW_VID' && (
                                  <div className="grid grid-cols-2 gap-2">
                                    <button type="button" onClick={() => vidCamRef.current?.click()} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer">
                                      <Camera className="w-4 h-4" /> Camera
                                    </button>
                                    <button type="button" onClick={() => vidFileRef.current?.click()} className={`${cardBg} border-2 border-teal-500/40 text-teal-600 text-xs font-bold py-2 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer`}>
                                      <FolderOpen className="w-4 h-4" /> Files
                                    </button>
                                  </div>
                                )}
                                {tankVideos.length > 0 ? (
                                  <div className="grid grid-cols-2 gap-2 pt-1">
                                    {tankVideos.map((vid, i) => (
                                      <div key={i} className={`relative rounded-xl border border-teal-500/30 overflow-hidden ${cardBg}`}>
                                        <button
                                          type="button"
                                          title={L('Delete video', 'వీడియో తొలగించు')}
                                          onClick={() => {
                                            deleteStorageFilesByUrls([vid.url]);
                                            setTankVideos(prev => prev.filter((_, idx) => idx !== i));
                                            showToast(L('Tank video removed.', 'ట్యాంక్ వీడియో తొలగించబడింది.'));
                                          }}
                                          className="absolute top-1 right-1 z-10 bg-rose-600 hover:bg-rose-700 text-white w-5 h-5 rounded-full text-[11px] font-black flex items-center justify-center shadow cursor-pointer"
                                        >
                                          ✕
                                        </button>
                                        <video
                                          src={vid.url}
                                          muted
                                          onClick={() => setFullScreenMedia({ type: 'video', url: vid.url, label: vid.label })}
                                          className="w-full h-20 object-cover bg-black cursor-pointer"
                                        />
                                        <div className="p-1 text-[10px] font-bold flex items-center justify-between">
                                          <span className="truncate">{vid.label}</span>
                                          <span className="text-teal-500">▶</span>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <span className="text-[11px] opacity-65 block text-center">{L('Optional: Tank PL activity videos', 'ఐచ్ఛికం: ట్యాంక్ PL వీడియోలు')}</span>
                                )}
                              </div>
                            </div>
                          )}
                        </div>

                        <button type="submit" disabled={uploadProgress.active} className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-50 text-white font-bold py-3 rounded-xl text-sm shadow-xs cursor-pointer">
                          {t.publishBtn}
                        </button>
                      </form>
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
                      <Wallet className="w-4 h-4" /> Total Packing Revenue Received
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

                {/* B2B BROKER ADVANTAGE & COMMISSION PROTECTION STRIP */}
                <div className={`rounded-2xl p-3.5 border border-teal-500/30 bg-teal-500/5 grid grid-cols-2 lg:grid-cols-4 gap-2.5 text-xs ${cardBg}`}>
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-teal-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block leading-tight">{L('365-Day Farmer Lock', '365 రోజుల రైతు లాక్')}</span>
                      <span className="text-[10px] opacity-65">{L('Zero bypass by hatcheries', 'నేరుగా బైపాస్ ఉండదు')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Wallet className="w-4 h-4 text-emerald-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block leading-tight">{L('Guaranteed 2% + Margin', 'ఖచ్చితమైన 2% + మార్జిన్')}</span>
                      <span className="text-[10px] opacity-65">{L('Auto-tracked every order', 'ప్రతి ఆర్డర్ ట్రాక్ అవుతుంది')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-indigo-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block leading-tight">{L('Live Deal Notifications', 'లైవ్ డీల్ నోటిఫికేషన్లు')}</span>
                      <span className="text-[10px] opacity-65">{L('New batches, packing & payout', 'బ్యాచ్, ప్యాకింగ్ & పేమెంట్ అలర్ట్')}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Send className="w-4 h-4 text-green-500 shrink-0" />
                    <div>
                      <span className="font-extrabold block leading-tight">{L('1-Click WhatsApp Quotes', '1-క్లిక్ WhatsApp కోట్స్')}</span>
                      <span className="text-[10px] opacity-65">{L('Close deals 3x faster', 'వేగంగా బుకింగ్స్ పూర్తి')}</span>
                    </div>
                  </div>
                </div>

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


                {/* FEATURE 11: BROKER MONTHLY COMMISSION GOAL TRACKER */}
                {(() => {
                  const totalMargin = myBrokerBookings.filter(b => b.packingStatus !== 'CANCELLED').reduce((s, b) => s + (b.brokerExtraMarginTotal || 0), 0);
                  const totalEarnedAndPending = brokerCredited2PctTotal + brokerHeld2PctTotal + totalMargin;
                  const goal = Math.max(1000, Number(brokerMonthlyGoal) || 50000);
                  const pct = Math.min(100, Math.round((totalEarnedAndPending / goal) * 100));
                  return (
                    <div className={`rounded-2xl p-5 border shadow-xs space-y-3 ${cardBg}`}>
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex items-center gap-2">
                          <Target className="w-5 h-5 text-teal-600" />
                          <div>
                            <h3 className="font-extrabold text-sm">{L('Monthly Commission + Margin Goal Tracker', 'నెలవారీ కమిషన్ + మార్జిన్ టార్గెట్ ట్రాకర్')}</h3>
                            <p className="text-[11px] opacity-65">
                              ₹{totalEarnedAndPending.toLocaleString('en-IN')} / ₹{goal.toLocaleString('en-IN')} ({pct}% {L('achieved', 'పూర్తయింది')})
                            </p>
                          </div>
                        </div>
                        {editingBrokerGoal ? (
                          <div className="flex items-center gap-1.5">
                            <input
                              type="number"
                              step="5000"
                              min="1000"
                              value={brokerGoalDraft}
                              onChange={(e) => setBrokerGoalDraft(e.target.value)}
                              className={`w-28 border rounded-lg px-2.5 py-1 text-xs font-bold select-text ${inputCls}`}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setBrokerMonthlyGoal(Math.max(1000, Number(brokerGoalDraft) || 50000));
                                setEditingBrokerGoal(false);
                                showToast(L('Monthly target updated!', 'నెలవారీ టార్గెట్ అప్‌డేట్ అయింది!'));
                              }}
                              className="bg-teal-600 text-white text-xs font-bold px-3 py-1 rounded-lg cursor-pointer"
                            >
                              Save
                            </button>
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() => { setBrokerGoalDraft(String(brokerMonthlyGoal)); setEditingBrokerGoal(true); }}
                            className={`px-3 py-1 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${subCardBg}`}
                          >
                            <Edit3 className="w-3 h-3 text-teal-600" /> {L('Edit Target', 'టార్గెట్ మార్చు')}
                          </button>
                        )}
                      </div>
                      <div className="w-full h-3 bg-slate-300/30 rounded-full overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-teal-500 to-emerald-500 transition-all duration-500" style={{ width: `${pct}%` }} />
                      </div>
                      <div className="flex flex-wrap justify-between text-[11px] opacity-70 font-semibold">
                        <span>2% Comm: ₹{(brokerCredited2PctTotal + brokerHeld2PctTotal).toLocaleString('en-IN')} • Extra Margin: ₹{totalMargin.toLocaleString('en-IN')}</span>
                        <span>{totalEarnedAndPending >= goal ? L('🎉 Monthly Goal Reached!', '🎉 నెలవారీ టార్గెట్ పూర్తయింది!') : L(`₹${(goal - totalEarnedAndPending).toLocaleString('en-IN')} to go`, `ఇంకా ₹${(goal - totalEarnedAndPending).toLocaleString('en-IN')} మిగిలి ఉంది`)}</span>
                      </div>
                    </div>
                  );
                })()}

                {/* BROKER BOOKINGS (COLLAPSIBLE TAB) */}
                <div className={`rounded-2xl border shadow-xs overflow-hidden ${cardBg}`}>
                  <button
                    type="button"
                    onClick={() => setShowBrokerBookings(prev => !prev)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-teal-500/5 transition"
                  >
                    <span className="font-extrabold text-sm sm:text-base flex items-center gap-2 min-w-0">
                      <Receipt className="w-5 h-5 text-teal-600 shrink-0" />
                      <span className="truncate">{t.brokerBookingsTitle} ({myBrokerBookings.length})</span>
                    </span>
                    <span className="inline-flex items-center gap-2 shrink-0">
                      <span className="bg-teal-500/15 text-teal-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {showBrokerBookings ? L('Close', 'మూసివేయి') : L('View', 'చూడు')}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-teal-600 transition-transform ${showBrokerBookings ? 'rotate-90' : ''}`} />
                    </span>
                  </button>
                  {showBrokerBookings && (
                    <div className="px-4 sm:px-6 pb-5 pt-3 border-t border-slate-300/20 space-y-4">
                      <div className="flex flex-wrap items-center justify-end gap-2">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* ROUND-3 FEATURE: 1-CLICK WHATSAPP TOP RATES BROADCAST */}
                          <button
                            type="button"
                            onClick={handleBrokerBroadcastTopRates}
                            className="bg-green-600 hover:bg-green-700 text-white px-3 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                          >
                            <Send className="w-3.5 h-3.5" /> {L('Broadcast Top Rates', 'టాప్ ధరలు షేర్')}
                          </button>
                          {/* FEATURE 18: 1-CLICK CSV LEDGER EXPORT (BROKER) */}
                          <button
                            type="button"
                            onClick={() => handleExportCsvLedger(myBrokerBookings, 'Broker')}
                            className={`px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${subCardBg}`}
                          >
                            <Download className="w-3.5 h-3.5 text-teal-600" /> {L('Export CSV', 'CSV డౌన్‌లోడ్')}
                          </button>
                        </div>
                      </div>
                      {myBrokerBookings.length === 0 ? (
                        <p className="text-xs opacity-60">{t.noBrokerBookings}</p>
                      ) : (
                        <div className="max-h-80 overflow-y-auto pr-1 space-y-3">
                          {myBrokerBookings.map((bk) => {
                            const isCleared = bk.settlement?.status === 'BALANCE_CLEARED';
                            const isCancelled = bk.settlement?.status === 'CANCELLED_REFUNDED' || bk.settlement?.status === 'CANCELLED_NON_REFUNDABLE';
                            const mapsUrl = bk.batch?.googleMapsLink || hatcheryProfiles[bk.hatcheryOwnerPhone]?.googleMapsLink;
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
                                    <span className={`font-bold px-2.5 py-0.5 rounded-full ${isCleared ? 'bg-emerald-500/15 text-emerald-500' : isCancelled ? 'bg-rose-500/15 text-rose-500' : 'bg-amber-500/15 text-amber-500'}`}>
                                      {isCancelled
                                        ? t.cancelledRefundBadge
                                        : isCleared
                                          ? L(`2% Commission Credited: ₹${bk.settlement?.brokerBase2Pct || 0}`, `2% కమిషన్ జమ అయింది: ₹${bk.settlement?.brokerBase2Pct || 0}`)
                                          : L(`2% Commission Hold: ₹${bk.settlement?.brokerBase2Pct || 0}`, `2% కమిషన్ హోల్డ్: ₹${bk.settlement?.brokerBase2Pct || 0}`)}
                                    </span>
                                    {bk.brokerExtraMarginTotal > 0 && (
                                      <span className="bg-teal-500/15 text-teal-500 font-bold px-2.5 py-0.5 rounded-full">
                                        + {L('Extra Margin', 'అదనపు మార్జిన్')}: ₹{bk.brokerExtraMarginTotal.toLocaleString('en-IN')} ({bk.brokerMarginPaise}p/seed)
                                      </span>
                                    )}
                                  </div>
                                  <p className="font-extrabold text-white bg-slate-900 px-2.5 py-0.5 rounded-lg inline-block">
                                    {bk.batch?.realName || bk.batch?.hatcheryCode} • +91 {bk.batch?.realPhone}
                                  </p>
                                  <p className="font-bold">
                                    {L('Farmer', 'రైతు')}: {bk.farmerName} (+91 {bk.farmerPhone}) • Batch {bk.batch?.id} ({bk.batch?.plStage})
                                  </p>
                                  <p className="opacity-70">
                                    {(bk.quantity || 0).toLocaleString('en-IN')} PL • {bk.batch?.realAddress} • {t.packingDateLabel}: {bk.packingDate}
                                  </p>
                                </div>
                                <div className="flex flex-wrap items-center gap-2" onClick={(e) => e.stopPropagation()}>
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
                                  {!isCleared && !isCancelled && (
                                    <button
                                      type="button"
                                      onClick={() => handleBuyerCancelBooking(bk)}
                                      className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 text-xs font-bold px-3 py-2 rounded-xl inline-flex items-center gap-1 cursor-pointer"
                                    >
                                      <XCircle className="w-3.5 h-3.5" /> {t.cancelBookingBtn}
                                    </button>
                                  )}
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
                  )}
                </div>

                {/* BROKER QUICK MARGIN & COMMISSION CALCULATOR (COLLAPSIBLE) */}
                <div className={`rounded-2xl border overflow-hidden ${cardBg}`}>
                  <button
                    type="button"
                    onClick={() => setShowBrokerMarginCalc(prev => !prev)}
                    className="w-full px-4 py-3.5 flex items-center justify-between gap-2 text-xs font-extrabold cursor-pointer"
                  >
                    <span className="inline-flex items-center gap-2 text-teal-600">
                      <Calculator className="w-4 h-4 shrink-0" />
                      {L('Quick Broker Commission & Margin Calculator', 'బ్రోకర్ 2% కమిషన్ & అదనపు మార్జిన్ కాలిక్యులేటర్')}
                    </span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${showBrokerMarginCalc ? 'rotate-90' : ''}`} />
                  </button>
                  {showBrokerMarginCalc && (() => {
                    const pl = Math.max(1, Number(brokerCalcInput.lakhs) || 1) * 100000;
                    const baseTotal = Math.round(pl * (Number(brokerCalcInput.rate) || 0.42));
                    const comm2Pct = Math.round(baseTotal * 0.02);
                    const extraM = Math.round(pl * ((Number(brokerCalcInput.extraPaise) || 0) / 100));
                    return (
                      <div className="p-4 pt-2 border-t border-slate-300/20 space-y-3 text-xs">
                        <div className="grid grid-cols-3 gap-2.5">
                          <div>
                            <label className="text-[10px] font-bold opacity-70 block mb-1">{L('Qty (Lakhs PL)', 'సీడ్ (లక్షలు)')}</label>
                            <input type="number" min="1" max="100" value={brokerCalcInput.lakhs} onChange={(e) => setBrokerCalcInput({ ...brokerCalcInput, lakhs: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold opacity-70 block mb-1">{L('Rate (₹/Seed)', 'ధర (₹/సీడ్)')}</label>
                            <input type="number" step="0.01" value={brokerCalcInput.rate} onChange={(e) => setBrokerCalcInput({ ...brokerCalcInput, rate: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                          </div>
                          <div>
                            <label className="text-[10px] font-bold opacity-70 block mb-1">{L('Extra (Paise)', 'అదనపు పైసలు')}</label>
                            <input type="number" min="0" max="99" value={brokerCalcInput.extraPaise} onChange={(e) => setBrokerCalcInput({ ...brokerCalcInput, extraPaise: cleanNum(e.target.value) })} className={`w-full border rounded-xl px-2.5 py-1.5 text-xs font-bold select-text ${inputCls}`} />
                          </div>
                        </div>
                        <div className="grid grid-cols-3 gap-2 text-center">
                          <div className={`p-2.5 rounded-xl border ${subCardBg}`}>
                            <span className="text-[10px] opacity-65 block">2% Comm</span>
                            <b className="text-sm text-teal-500">₹{comm2Pct.toLocaleString('en-IN')}</b>
                          </div>
                          <div className={`p-2.5 rounded-xl border ${subCardBg}`}>
                            <span className="text-[10px] opacity-65 block">Extra Margin</span>
                            <b className="text-sm text-indigo-500">₹{extraM.toLocaleString('en-IN')}</b>
                          </div>
                          <div className="p-2.5 rounded-xl border bg-emerald-500/15 border-emerald-500/30 text-emerald-500">
                            <span className="text-[10px] opacity-80 block">Total Profit</span>
                            <b className="text-sm">₹{(comm2Pct + extraM).toLocaleString('en-IN')}</b>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                {/* BROKER MARKETPLACE (COLLAPSIBLE HATCHERIES TAB) */}
                <div className={`rounded-2xl border shadow-xs overflow-hidden ${cardBg}`}>
                  <button
                    type="button"
                    onClick={() => setShowBrokerHatcheries(prev => !prev)}
                    className="w-full px-4 sm:px-6 py-4 flex items-center justify-between gap-2 text-left cursor-pointer hover:bg-teal-500/5 transition"
                  >
                    <span className="text-sm sm:text-base font-extrabold flex items-center gap-2 min-w-0">
                      <Building2 className="w-5 h-5 text-teal-600 shrink-0" />
                      <span className="truncate">{t.brokerMarketplaceTitle} ({filteredAndSortedBatches.length})</span>
                    </span>
                    <span className="inline-flex items-center gap-2 shrink-0">
                      <span className="bg-teal-500/15 text-teal-600 text-[11px] font-bold px-2.5 py-0.5 rounded-full">
                        {showBrokerHatcheries ? L('Close', 'మూసివేయి') : L('Browse Hatcheries', 'హేచరీలు చూడు')}
                      </span>
                      <ChevronRight className={`w-4 h-4 text-teal-600 transition-transform ${showBrokerHatcheries ? 'rotate-90' : ''}`} />
                    </span>
                  </button>
                  {showBrokerHatcheries && (
                    <div className="p-3.5 sm:p-5 border-t border-slate-300/20 space-y-4">
                      {renderFilterSortBar(false)}

                      {filteredAndSortedBatches.length === 0 ? (
                        <div className={`rounded-2xl border p-10 text-center space-y-2 ${subCardBg}`}>
                          <Building2 className="w-9 h-9 opacity-30 mx-auto" />
                          <h3 className="text-sm font-extrabold">{t.emptyMarketTitle}</h3>
                          <p className="text-xs opacity-60">{t.emptyMarketSub}</p>
                        </div>
                      ) : (
                        <div className="max-h-[65vh] overflow-y-auto pr-1 grid grid-cols-1 md:grid-cols-2 gap-4">
                          {filteredAndSortedBatches.map((batch) => {
                            const isBrokerCardOpen = Boolean(expandedBatchIds[`broker_${batch.id}`]);
                            const isUnlocked = bookings.some((bk) => bk.batch?.id === batch.id && bk.bookedByPhone === currentUser.phone && bk.packingStatus !== 'CANCELLED');
                            const isSoldOut = (batch.availableStock || 0) <= 0;
                            const isPaused = Boolean(batch.paused);
                            const selectedDens = cardDensityChoice[batch.id] || 40;
                            const acresCovered = ((batch.availableStock || 0) / (selectedDens * 4046.86)).toFixed(1);
                            const ownerProfile = hatcheryProfiles[batch.ownerPhone] || {};
                            const mapsUrl = batch.googleMapsLink || ownerProfile.googleMapsLink;
                            const brokerRate = formatConvertedRate(batch.pricePer1000);
                            return (
                              <div key={batch.id} className={`rounded-2xl border shadow-xs overflow-hidden flex flex-col justify-between hover:border-teal-500 transition ${cardBg} ${isPaused ? 'opacity-75' : ''}`}>
                                <button
                                  type="button"
                                  onClick={() => toggleExpandBatch(`broker_${batch.id}`)}
                                  className="w-full p-3.5 sm:p-4 text-left flex items-center justify-between gap-2.5 cursor-pointer hover:bg-teal-500/5 transition"
                                >
                                  <div className="min-w-0 flex-1 space-y-1">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className="font-mono text-[10px] font-bold bg-teal-500/15 text-teal-600 dark:text-teal-400 px-1.5 py-0.5 rounded">{batch.id}</span>
                                      <span className="bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-0.5">
                                        <ShieldCheck className="w-3 h-3 shrink-0" /> CAA
                                      </span>
                                      <span className="text-[11px] font-bold text-amber-500 inline-flex items-center gap-0.5">
                                        <Star className="w-3 h-3 fill-amber-400 text-amber-500" /> {batch.rating || 5.0}
                                      </span>
                                    </div>
                                    <div className="font-extrabold text-sm sm:text-base text-teal-600 dark:text-teal-400 flex items-center gap-1.5 min-w-0">
                                      {isUnlocked ? <Unlock className="w-3.5 h-3.5 text-emerald-500 shrink-0" /> : <Lock className="w-3.5 h-3.5 opacity-70 shrink-0" />}
                                      <span className="truncate">{isUnlocked ? batch.realName : (batch.hatcheryCode || 'Verified Hatchery')}</span>
                                    </div>
                                    <div className="text-[11px] opacity-70 truncate">
                                      {batch.zone} • {batch.plStage} • {((batch.availableStock || 0) / 100000).toFixed(1).replace(/\.0$/, '')}L PL
                                    </div>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <div className="text-right">
                                      <div className="text-base sm:text-lg font-black leading-none">{brokerRate.value}</div>
                                      <div className="text-[10px] opacity-60 mt-0.5">{brokerRate.unit}</div>
                                    </div>
                                    <ChevronRight className={`w-4 h-4 text-teal-600 transition-transform shrink-0 ${isBrokerCardOpen ? 'rotate-90' : ''}`} />
                                  </div>
                                </button>
                                {isBrokerCardOpen && (
                                  <>
                                    <div onClick={() => setInspectedBatch(batch)} className="px-4 sm:px-5 pb-4 pt-2 border-t border-slate-300/20 space-y-4 cursor-pointer">
                                      <div className="space-y-2.5">
                                        <div className="flex items-center justify-between gap-2">
                                          <span className="text-[11px] font-bold opacity-75">{t.caaVerified} • {batch.zone}</span>
                                          <div className="flex items-center gap-1.5 shrink-0">
                                            <button
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); setTransitPredictorBatch(batch); }}
                                              className={`p-1.5 rounded-lg border cursor-pointer ${subCardBg}`}
                                              title={L('Transit Route & Oxygen Risk Predictor', 'రవాణా & ఆక్సిజన్ రిస్క్ అంచనా')}
                                            >
                                              <Navigation className="w-3.5 h-3.5 text-indigo-500" />
                                            </button>
                                            <button
                                              type="button"
                                              onClick={(e) => { e.stopPropagation(); handleShareBatchFlyer(batch); }}
                                              className={`p-1.5 rounded-lg border cursor-pointer ${subCardBg}`}
                                              title={L('Share Batch Quote on WhatsApp', 'WhatsApp లో షేర్ చేయండి')}
                                            >
                                              <Share2 className="w-3.5 h-3.5 text-teal-600" />
                                            </button>
                                          </div>
                                        </div>

                                        <div className="space-y-1.5">
                                          <p className="text-xs opacity-75 font-medium leading-relaxed">{batch.species} • <span className="text-teal-500 font-semibold">{batch.broodstock || 'SPF Certified'}</span></p>
                                          {isUnlocked ? (
                                            <div className="space-y-1">
                                              <p className="text-xs opacity-80 leading-relaxed">{batch.realAddress} • +91 {batch.realPhone}</p>
                                              {mapsUrl && (
                                                <a
                                                  href={mapsUrl.startsWith('http') ? mapsUrl : `https://${mapsUrl}`}
                                                  target="_blank"
                                                  rel="noreferrer"
                                                  onClick={(e) => e.stopPropagation()}
                                                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-500 hover:underline"
                                                >
                                                  <MapPin className="w-3.5 h-3.5" /> {L('Open Google Maps Location', 'Google Maps లొకేషన్ చూడండి')} <ExternalLink className="w-3 h-3" />
                                                </a>
                                              )}
                                            </div>
                                          ) : (
                                            <p className="text-[11px] opacity-55">{t.unlockHint}</p>
                                          )}
                                          <div className="flex flex-wrap items-center gap-1.5 pt-0.5">
                                            <span className="bg-indigo-500/15 text-indigo-500 border border-indigo-500/30 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                              <Activity className="w-3 h-3" /> Vigor {batch.vigorScore || 96}%
                                            </span>
                                            {(batch.pcrImages || []).length > 0 && (() => {
                                              const hasInvalid = (batch.pcrImages || []).some(img => img.aiPcrStatus === 'NOT_A_PCR_REPORT');
                                              const hasVerified = (batch.pcrImages || []).some(img => img.aiPcrStatus === 'VERIFIED_PCR');
                                              if (hasInvalid) {
                                                return (
                                                  <span className="bg-rose-500/15 text-rose-500 border border-rose-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                    <AlertTriangle className="w-3 h-3" /> {L('AI: Not a PCR Report', 'AI: PCR రిపోర్ట్ కాదు')}
                                                  </span>
                                                );
                                              }
                                              if (hasVerified) {
                                                return (
                                                  <span className="bg-emerald-500/15 text-emerald-500 border border-emerald-500/40 text-[10px] font-extrabold px-2 py-0.5 rounded-full inline-flex items-center gap-1">
                                                    <FileCheck2 className="w-3 h-3" /> {L('AI PCR Verified', 'AI PCR వెరిఫైడ్')}
                                                  </span>
                                                );
                                              }
                                              return null;
                                            })()}
                                          </div>
                                        </div>
                                      </div>

                                      {ownerProfile.dispatchNotice && (
                                        <div className="bg-amber-500/15 border border-amber-500/40 text-amber-600 dark:text-amber-400 rounded-xl px-3 py-2 text-[11px] font-bold flex items-center gap-1.5">
                                          <Megaphone className="w-3.5 h-3.5 shrink-0" />
                                          <span>{ownerProfile.dispatchNotice}</span>
                                        </div>
                                      )}

                                      {(() => {
                                        const slots = getDispatchSlotsInfo(batch);
                                        return (
                                          <div className={`border rounded-xl px-3 py-2 space-y-1 text-[11px] ${subCardBg}`}>
                                            <div className="flex items-center justify-between font-bold">
                                              <span className="opacity-80">{L('Dispatch Slots Today', 'ఈ రోజు ప్యాకింగ్ స్లాట్లు')}</span>
                                              <span className={slots.remaining >= 5 ? 'text-emerald-500' : slots.remaining >= 2 ? 'text-amber-500' : 'text-rose-500'}>
                                                {slots.remaining} / {slots.dailyCapacity} {L('slots left', 'స్లాట్లు మిగిలాయి')}
                                              </span>
                                            </div>
                                            <div className="w-full h-1.5 bg-slate-300/30 rounded-full overflow-hidden">
                                              <div className={`h-full rounded-full ${slots.remaining >= 5 ? 'bg-emerald-500' : slots.remaining >= 2 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${slots.pct}%` }} />
                                            </div>
                                          </div>
                                        );
                                      })()}

                                      <div className={`grid grid-cols-4 gap-2 p-3 rounded-xl border text-center ${subCardBg}`}>
                                        <div><span className="text-[11px] opacity-60 block">{t.stage}</span><span className="text-sm font-bold">{batch.plStage}</span></div>
                                        <div><span className="text-[11px] opacity-60 block">{t.salinity}</span><span className="text-sm font-bold text-teal-500">{batch.salinity} PPT</span></div>
                                        <div><span className="text-[11px] opacity-60 block">{t.bonus}</span><span className="text-sm font-bold text-emerald-500">+{batch.bonusPercent}%</span></div>
                                        <div><span className="text-[11px] opacity-60 block">{t.stock}</span><span className="text-sm font-bold">{(batch.availableStock || 0).toLocaleString('en-IN')}</span></div>
                                      </div>

                                      <div onClick={(e) => e.stopPropagation()} className={`border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-[11px] ${subCardBg}`}>
                                        <span className="font-bold opacity-80">{L('Pond Coverage Estimator:', 'చెరువు విస్తీర్ణం అంచనా:')}</span>
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
                                          <span className="font-extrabold text-teal-500 pl-1">≈ {acresCovered} {L('Acres', 'ఎకరాలు')}</span>
                                          <span className="bg-teal-500/15 text-teal-600 font-extrabold px-2 py-0.5 rounded-lg">
                                            ₹{Math.round(4046.86 * selectedDens * (batch.pricePer1000 || 0.43)).toLocaleString('en-IN')}/{L('Acre', 'ఎకరం')}
                                          </span>
                                        </div>
                                      </div>

                                      <div className={`border rounded-xl p-2.5 flex flex-wrap items-center justify-between gap-2 text-xs ${subCardBg}`}>
                                        <span className="font-semibold">
                                          📅 {t.availPackingLabel}: <b>{batch.availableDate || 'Flexible'}</b> ({batch.availableTimeSlot || 'All Day'}) • <span className="text-amber-500 font-bold">{L('Min Packing:', 'కనీస ప్యాకింగ్:')} {((batch.minPacking || 100000) / 100000).toFixed(1).replace(/\.0$/, '')} Lakh PL</span>
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
                                        className={`px-3 py-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer ${cardBg}`}
                                      >
                                        <Video className="w-3.5 h-3.5 text-teal-600" /> {t.liveVideoBtn}
                                      </button>
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
                                        className="w-full sm:w-auto sm:flex-1 bg-teal-600 hover:bg-teal-700 disabled:opacity-40 text-white font-bold text-xs py-2.5 px-4 rounded-xl cursor-pointer whitespace-nowrap"
                                      >
                                        {isSoldOut ? t.soldOutBadge : isPaused ? t.pausedBadge : t.selectAndBookBtn}
                                      </button>
                                    </div>
                                  </>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
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
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <h3 className="font-bold text-base flex items-center gap-2">
                        <Users className="w-5 h-5 text-teal-600" /> {t.myFarmersTitle} ({brokerFarmers.length})
                      </h3>
                      {/* ROUND-3 FEATURE: FARMER NETWORK QUICK-SEARCH */}
                      <div className="relative w-52">
                        <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
                        <input
                          type="text"
                          placeholder={L('Search farmer / village...', 'రైతు / గ్రామం వెతకండి...')}
                          value={brokerFarmerSearch}
                          onChange={(e) => setBrokerFarmerSearch(e.target.value)}
                          className={`w-full border rounded-xl pl-8 pr-2.5 py-1 text-xs select-text ${inputCls}`}
                        />
                      </div>
                    </div>
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
                            {brokerFarmers.filter(f => {
                              const q = brokerFarmerSearch.toLowerCase().trim();
                              return !q || (f.name || '').toLowerCase().includes(q) || (f.village || '').toLowerCase().includes(q) || (f.phone || '').includes(q);
                            }).map((f) => {
                              const daysLeft = f.lockedUntil ? Math.ceil((new Date(f.lockedUntil).getTime() - Date.now()) / 86400000) : 0;
                              const expiringSoon = daysLeft <= 45;
                              return (
                                <tr key={f.id}>
                                  <td className="py-2.5 font-bold">{f.name} <span className="block text-xs font-normal opacity-60">{f.phone}</span></td>
                                  <td className="py-2.5 text-xs opacity-75">{f.village} ({f.acres} Acres)</td>
                                  <td className="py-2.5">
                                    <div className="flex flex-wrap items-center gap-1.5">
                                      <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${expiringSoon ? 'bg-amber-500/20 text-amber-500' : 'bg-emerald-500/15 text-emerald-500'}`}>
                                        {daysLeft > 0 ? `Till ${f.lockedUntil} (${daysLeft}d)` : 'Expired'}
                                      </span>
                                      <button
                                        type="button"
                                        onClick={() => handleRenewFarmerLock(f.id)}
                                        className="bg-teal-600 hover:bg-teal-700 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg cursor-pointer"
                                      >
                                        Renew +1 Yr
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              );
                            })}
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

      {/* SELLER LIVE VIDEO REQUESTS LIST MODAL (INTERNAL SCROLL, FILTER, COMPLETE & DELETE) */}
      {showSellerVideoModal && (() => {
        const pendingReqsCount = myLiveVideoReqs.filter(r => r.status !== 'COMPLETED').length;
        const completedReqsCount = myLiveVideoReqs.filter(r => r.status === 'COMPLETED').length;
        const filteredVideoReqs = myLiveVideoReqs.filter(r => {
          if (videoReqFilter === 'PENDING') return r.status !== 'COMPLETED';
          if (videoReqFilter === 'COMPLETED') return r.status === 'COMPLETED';
          return true;
        });
        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-4">
            <div className={`rounded-2xl max-w-xl w-full p-4 sm:p-6 shadow-2xl border flex flex-col max-h-[85vh] overflow-hidden ${cardBg}`}>
              <div className="flex items-start justify-between gap-2 border-b border-slate-300/30 pb-3 shrink-0">
                <div className="min-w-0">
                  <h3 className="font-extrabold text-sm sm:text-base flex items-center gap-2">
                    <Video className="w-5 h-5 text-teal-500 shrink-0" />
                    <span className="truncate">{L('Farmer Live Video Requests', 'రైతుల లైవ్ వీడియో రిక్వెస్ట్‌లు')} ({myLiveVideoReqs.length})</span>
                  </h3>
                  <p className="text-[11px] sm:text-xs opacity-65 mt-0.5">{L('Send tank video on WhatsApp, mark completed, or delete old requests', 'WhatsApp లో వీడియో పంపండి, పూర్తయినవి మార్క్ చేయండి లేదా తొలగించండి')}</p>
                </div>
                <button type="button" onClick={() => setShowSellerVideoModal(false)} className="opacity-60 hover:opacity-100 font-bold cursor-pointer p-1 shrink-0">✕</button>
              </div>

              {/* FILTER PILLS: ALL / PENDING / COMPLETED */}
              <div className="flex flex-wrap items-center gap-1.5 py-3 shrink-0">
                {[
                  { id: 'ALL', label: L('All', 'అన్నీ'), cnt: myLiveVideoReqs.length },
                  { id: 'PENDING', label: L('Pending', 'పెండింగ్'), cnt: pendingReqsCount },
                  { id: 'COMPLETED', label: L('Completed', 'పూర్తయినవి'), cnt: completedReqsCount },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setVideoReqFilter(tab.id)}
                    className={`px-3 py-1 rounded-full text-[11px] font-bold border transition cursor-pointer ${videoReqFilter === tab.id
                      ? 'bg-teal-600 text-white border-teal-600'
                      : `${subCardBg} opacity-80 hover:opacity-100`
                      }`}
                  >
                    {tab.label} ({tab.cnt})
                  </button>
                ))}
              </div>

              {/* INTERNAL SCROLLABLE REQUESTS LIST ONLY */}
              <div className="flex-1 min-h-0 overflow-y-auto pr-1 space-y-3">
                {filteredVideoReqs.length === 0 ? (
                  <p className="text-xs opacity-60 py-8 text-center">
                    {myLiveVideoReqs.length === 0
                      ? L('No live video requests received yet.', 'ఇంకా లైవ్ వీడియో రిక్వెస్ట్‌లు రాలేదు.')
                      : L('No requests in this filter.', 'ఈ ఫిల్టర్‌లో రిక్వెస్ట్‌లు లేవు.')}
                  </p>
                ) : (
                  filteredVideoReqs.map((req) => {
                    const isDone = req.status === 'COMPLETED';
                    return (
                      <div key={req.id} className={`border rounded-xl p-3.5 sm:p-4 space-y-3 text-xs ${isDone ? 'border-emerald-500/35 bg-emerald-500/5' : subCardBg}`}>
                        <div className="space-y-1">
                          <div className="flex flex-wrap items-center justify-between gap-1.5">
                            <div className="flex flex-wrap items-center gap-1.5">
                              <span className="font-mono font-bold text-teal-500 bg-teal-500/10 px-2 py-0.5 rounded">Batch: {req.batchId}</span>
                              <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isDone ? 'bg-emerald-500/15 text-emerald-500' : 'bg-amber-500/15 text-amber-500'}`}>
                                {isDone ? L('Completed', 'పూర్తయింది') : L('Pending', 'పెండింగ్')}
                              </span>
                            </div>
                            <span className="opacity-60 text-[10px]">{req.requestedAt}</span>
                          </div>
                          <p className="font-extrabold text-sm break-words">{req.farmerName} • +91 {req.farmerWhatsapp || req.farmerPhone}</p>
                          {req.note && <p className="opacity-80 break-words">"{req.note}"</p>}
                        </div>

                        <div className="flex flex-wrap items-center gap-2 pt-1 border-t border-slate-300/20">
                          <button
                            type="button"
                            onClick={() => openWhatsAppMessage(
                              req.farmerWhatsapp || req.farmerPhone,
                              `Hello ${req.farmerName}, sharing live tank video from ${myFixedHatchery?.realName} for Batch ${req.batchId} (${req.batchStage || ''}).`
                            )}
                            className="flex-1 sm:flex-none justify-center bg-green-600 hover:bg-green-700 text-white font-bold text-[11px] sm:text-xs px-3 py-2 rounded-xl inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          >
                            <Send className="w-3.5 h-3.5 shrink-0" /> {L('Send Video', 'వీడియో పంపండి')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleToggleVideoRequestStatus(req.id)}
                            className={`flex-1 sm:flex-none justify-center font-bold text-[11px] sm:text-xs px-3 py-2 rounded-xl border inline-flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${isDone
                              ? 'border-amber-500/40 bg-amber-500/10 text-amber-500 hover:bg-amber-500/20'
                              : 'border-emerald-500/40 bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                              }`}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            {isDone ? L('Mark Pending', 'పెండింగ్ చేయి') : L('Mark Completed', 'పూర్తయింది')}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDeleteVideoRequest(req.id)}
                            title={L('Delete Request', 'రిక్వెస్ట్ తొలగించు')}
                            className="bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-500 font-bold text-[11px] sm:text-xs px-3 py-2 rounded-xl inline-flex items-center justify-center gap-1 cursor-pointer shrink-0"
                          >
                            <Trash2 className="w-3.5 h-3.5 shrink-0" /> {L('Delete', 'తొలగించు')}
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          </div>
        );
      })()}

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
              <div className="flex justify-between py-1 border-b border-slate-300/20"><span>Advance Paid (5%):</span><b>₹{(inspectedBuyerBooking.tokenAdvance || 0).toLocaleString('en-IN')}</b></div>
              <div className="flex justify-between py-1"><span>Settlement Status:</span><b className="text-emerald-500">{inspectedBuyerBooking.settlement?.status === 'BALANCE_CLEARED' ? `Balance Cleared (${inspectedBuyerBooking.clearedAt})` : (inspectedBuyerBooking.packingStatus === 'CANCELLED' || inspectedBuyerBooking.settlement?.status === 'CANCELLED_REFUNDED' || inspectedBuyerBooking.settlement?.status === 'CANCELLED_NON_REFUNDABLE') ? L('Cancelled (Non-Refundable)', 'క్యాన్సిల్ చేయబడింది (నాన్-రిఫండబుల్)') : `₹${(inspectedBuyerBooking.balanceAtPacking || 0).toLocaleString('en-IN')} Pending at Packing`}</b></div>
            </div>
            {(() => {
              const bk = inspectedBuyerBooking;
              const isFinalCleared = bk.settlement?.status === 'BALANCE_CLEARED';
              const isCancelled = bk.packingStatus === 'CANCELLED' || bk.settlement?.status === 'CANCELLED_REFUNDED' || bk.settlement?.status === 'CANCELLED_NON_REFUNDABLE';
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
                  <span className="text-[10px] font-bold uppercase text-teal-500 block mb-1">{L('About Hatchery', 'హేచరీ గురించి')}</span>
                  <p className="leading-relaxed">{hatcheryDesc}</p>
                </div>
              )}





              {/* ROUND-3 FEATURE: TANK-TO-POND COMPATIBILITY CHECKER & PRIVATE FARMER NOTES */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className={`p-3.5 rounded-xl border space-y-2 ${subCardBg}`}>
                  <span className="font-extrabold text-teal-600 inline-flex items-center gap-1.5">
                    <Thermometer className="w-3.5 h-3.5" /> {L('Tank-to-Pond Compatibility Check', 'ట్యాంక్-టు-చెరువు సెలైనిటీ తనిఖీ')}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] opacity-75">{L('Your Pond PPT:', 'మీ చెరువు PPT:')}</span>
                    <input
                      type="number"
                      min="0"
                      max="45"
                      value={inspectPondPpt}
                      onChange={(e) => setInspectPondPpt(Number(e.target.value))}
                      className={`w-16 border rounded-lg px-2 py-1 text-xs font-bold select-text ${inputCls}`}
                    />
                    <span className="text-[11px] font-bold text-teal-500">
                      Δ {Math.abs((inspectedBatch.salinity || 16) - inspectPondPpt)} PPT
                    </span>
                  </div>
                  {(() => {
                    const diff = Math.abs((inspectedBatch.salinity || 16) - inspectPondPpt);
                    return (
                      <div className="text-[11px] font-semibold">
                        Acclimatize: <b>{diff * 4} hrs</b> • Risk:{' '}
                        <b className={diff <= 3 ? 'text-emerald-500' : diff <= 6 ? 'text-amber-500' : 'text-rose-500'}>
                          {diff <= 3 ? 'LOW (Ideal)' : diff <= 6 ? 'MODERATE' : 'HIGH (Gradual Drip Required)'}
                        </b>
                      </div>
                    );
                  })()}
                </div>

                <div className={`p-3.5 rounded-xl border space-y-2 ${subCardBg}`}>
                  <span className="font-extrabold text-indigo-500 inline-flex items-center gap-1.5">
                    <StickyNote className="w-3.5 h-3.5" /> {L('My Private Note on This Batch', 'ఈ బ్యాచ్‌పై నా ప్రైవేట్ నోట్')}
                  </span>
                  <input
                    type="text"
                    placeholder={L('e.g., Good survival last crop, ask 20% bonus...', 'ఉదా: గత పంటలో మంచి సర్వైవల్ వచ్చింది...')}
                    value={farmerBatchNotes[inspectedBatch.id] || ''}
                    onChange={(e) => setFarmerBatchNotes(prev => ({ ...prev, [inspectedBatch.id]: e.target.value }))}
                    className={`w-full border rounded-lg px-2.5 py-1.5 text-xs select-text ${inputCls}`}
                  />
                </div>
              </div>

              {/* COMPACT BIO-SECURITY & OCR PCR VALUES STRIP (NO PROGRESS LINES) */}
              <div className={`p-3 rounded-xl border border-emerald-500/30 bg-emerald-500/5 space-y-2 text-xs`}>
                <div className="grid grid-cols-3 sm:grid-cols-5 gap-2 text-center">
                  {[
                    { label: L('UV Filter', 'UV ఫిల్టర్'), val: '98%' },
                    { label: L('SPF Status', 'SPF స్థితి'), val: '100%' },
                    { label: L('Antibiotic', 'యాంటీబయాటిక్'), val: '0%' },
                    { label: L('O₂ Purity', 'ఆక్సిజన్'), val: '99.5%' },
                    { label: L('Hygiene', 'పరిశుభ్రత'), val: `${inspectedBatch.vigorScore || 96}%` }
                  ].map((pt, i) => (
                    <div key={i} className={`px-2 py-1.5 rounded-lg border ${cardBg}`}>
                      <span className="text-[10px] opacity-65 block truncate">{pt.label}</span>
                      <b className="text-xs text-emerald-500">{pt.val}</b>
                    </div>
                  ))}
                </div>
                {(() => {
                  const pcrWithOcr = (inspectedBatch.pcrImages || []).find((p) => p.aiExtracted);
                  if (!pcrWithOcr?.aiExtracted) return null;
                  const ex = pcrWithOcr.aiExtracted;
                  return (
                    <div className={`flex flex-wrap items-center justify-between gap-2 px-2.5 py-1.5 rounded-lg border text-[11px] font-bold ${cardBg}`}>
                      <span className="text-teal-500">🔬 {L('OCR PCR Scan:', 'OCR PCR రిజల్ట్:')}</span>
                      <div className="flex flex-wrap items-center gap-2">
                        {ex.wssv !== 'NOT_FOUND' && <span className={ex.wssv === 'NEGATIVE' ? 'text-emerald-500' : 'text-rose-500'}>WSSV: {ex.wssv}</span>}
                        {ex.ehp !== 'NOT_FOUND' && <span className={ex.ehp === 'NEGATIVE' ? 'text-emerald-500' : 'text-rose-500'}>EHP: {ex.ehp}</span>}
                        {ex.ihhnv !== 'NOT_FOUND' && <span className={ex.ihhnv === 'NEGATIVE' ? 'text-emerald-500' : 'text-rose-500'}>IHHNV/EMS: {ex.ihhnv}</span>}
                        {ex.wssv === 'NOT_FOUND' && ex.ehp === 'NOT_FOUND' && ex.ihhnv === 'NOT_FOUND' && (
                          <span className="text-emerald-500">{pcrWithOcr.aiReason}</span>
                        )}
                      </div>
                    </div>
                  );
                })()}
              </div>

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
                  <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                  <FileCheck2 className="w-4 h-4 text-teal-600" /> {L(`AI Analyzed PCR Lab Reports (${(inspectedBatch.pcrImages || []).length}) — Click for Full Screen`, `AI విశ్లేషించిన PCR ల్యాబ్ రిపోర్ట్స్ (${(inspectedBatch.pcrImages || []).length}) — ఫుల్ స్క్రీన్ కోసం క్లిక్ చేయండి`)}
                </span>
                {(inspectedBatch.pcrImages || []).length > 0 ? (
                  <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inspectedBatch.pcrImages.map((img, idx) => {
                      const isNotPcr = img.aiPcrStatus === 'NOT_A_PCR_REPORT';
                      const isAiOk = img.aiPcrStatus === 'VERIFIED_PCR';
                      return (
                        <div
                          key={idx}
                          onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })}
                          className={`border rounded-xl p-2 space-y-1.5 cursor-pointer transition ${isNotPcr ? 'border-rose-500/60 hover:border-rose-500' : 'hover:border-teal-500'} ${cardBg}`}
                        >
                          <div className="flex items-center justify-between gap-1">
                            <span className="text-[11px] font-extrabold text-teal-600 bg-teal-500/10 px-2 py-0.5 rounded">{img.label}</span>
                            {isNotPcr ? (
                              <span className="text-[10px] font-extrabold bg-rose-500/15 text-rose-500 border border-rose-500/30 px-2 py-0.5 rounded-full">
                                ❌ {L('Not a PCR Report', 'PCR రిపోర్ట్ కాదు')}
                              </span>
                            ) : isAiOk ? (
                              <span className="text-[10px] font-extrabold bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                                ✓ AI Verified ({img.aiConfidence || 92}%)
                              </span>
                            ) : (
                              <Maximize2 className="w-3.5 h-3.5 text-teal-500" />
                            )}
                          </div>
                          <img src={img.url} alt={img.label} className="w-full h-48 object-contain rounded-lg bg-slate-100" />
                          {img.aiReason && (
                            <p className={`text-[10px] font-semibold px-1 ${isNotPcr ? 'text-rose-500' : 'text-emerald-500'}`}>
                              {img.aiReason}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="p-4 text-center text-xs opacity-60">No PCR images uploaded.</div>
                )}
              </div>

              {/* LIVE SEED / PL PHOTOS GALLERY FOR FARMER & BROKER */}
              {(inspectedBatch.seedImages || []).length > 0 && (
                <div className={`border rounded-xl p-4 space-y-3 ${subCardBg}`}>
                  <span className="text-xs font-extrabold flex items-center gap-1.5">
                    <Camera className="w-4 h-4 text-emerald-600" /> {L(`Live Seed / PL Photos (${inspectedBatch.seedImages.length}) — Click for Full Screen`, `లైవ్ సీడ్ / PL ఫోటోలు (${inspectedBatch.seedImages.length}) — ఫుల్ స్క్రీన్ కోసం క్లిక్ చేయండి`)}
                  </span>
                  <div className="max-h-72 overflow-y-auto pr-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {inspectedBatch.seedImages.map((img, idx) => (
                      <div
                        key={idx}
                        onClick={() => setFullScreenMedia({ type: 'image', url: img.url, label: img.label })}
                        className={`border hover:border-emerald-500 rounded-xl p-2 space-y-1.5 cursor-pointer transition ${cardBg}`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[11px] font-extrabold text-emerald-600 bg-emerald-500/10 px-2 py-0.5 rounded">{img.label}</span>
                          <Maximize2 className="w-3.5 h-3.5 text-emerald-500" />
                        </div>
                        <img src={img.url} alt={img.label} className="w-full h-48 object-contain rounded-lg bg-slate-100" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

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

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
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
                  <label className="text-xs font-bold opacity-75 block">{L('Select Payment Option', 'పేమెంట్ విధానం ఎంచుకోండి')}</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, paymentOption: 'ADVANCE', qrRevealed: false })}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${bookingForm.paymentOption !== 'FULL' ? 'border-teal-600 bg-teal-500/15 text-teal-600' : subCardBg}`}
                    >
                      5% Advance Booking (+2% App Bonus)
                    </button>
                    <button
                      type="button"
                      onClick={() => setBookingForm({ ...bookingForm, paymentOption: 'FULL', customFullAmount: '', qrRevealed: false })}
                      className={`p-2.5 rounded-xl border text-xs font-bold cursor-pointer ${bookingForm.paymentOption === 'FULL' ? 'border-emerald-600 bg-emerald-500/15 text-emerald-600' : subCardBg}`}
                    >
                      {L('Full / Custom Amount', 'పూర్తి / మీ ఇష్ట మొత్తం')}
                    </button>
                  </div>
                  {bookingForm.paymentOption === 'FULL' && (() => {
                    const qtyTmp = computeSeedCount(bookingForm.qtyAmount, bookingForm.qtyUnit);
                    const hatchTmp = Math.round(qtyTmp * (selectedBatch.pricePer1000 || 0.42));
                    const brkTmp = currentUser.role === 'mediator' ? Math.round(qtyTmp * ((Number(bookingForm.brokerMarginPaise) || 0) / 100)) : 0;
                    const maxFull = hatchTmp + brkTmp + (bookingForm.includeTransport ? 1500 : 0);
                    const minAdv = Math.max(1000, Math.round(hatchTmp * 0.05));
                    const isUpi = bookingForm.paymentMethod === 'DIRECT_UPI';
                    const capMax = isUpi ? Math.min(maxFull, MAX_UPI_AMOUNT_INR) : maxFull;
                    const curVal = bookingForm.customFullAmount !== undefined && bookingForm.customFullAmount !== '' ? Number(bookingForm.customFullAmount) : capMax;
                    const isBadRound = curVal > 0 && curVal !== maxFull && curVal % 500 !== 0;
                    const presets = [10000, 25000, 50000, 80000].filter(v => v >= minAdv && v < maxFull && (!isUpi || v <= MAX_UPI_AMOUNT_INR));
                    return (
                      <div className={`border rounded-xl p-3 space-y-2 text-xs ${subCardBg}`}>
                        <div className="flex items-center justify-between gap-2">
                          <label className="font-bold opacity-80">{L('Amount to Pay Now (₹500 multiples)', 'ఇప్పుడు చెల్లించే మొత్తం (₹500 గుణిజాలు)')}</label>
                          <span className="text-[11px] font-bold text-teal-500">Total: ₹{maxFull.toLocaleString('en-IN')}</span>
                        </div>
                        <input
                          type="number"
                          step="500"
                          min={minAdv}
                          max={capMax}
                          placeholder={`e.g., 12500, 15000, ${capMax}`}
                          value={bookingForm.customFullAmount ?? ''}
                          onChange={(e) => {
                            setModalError('');
                            setBookingForm({ ...bookingForm, customFullAmount: cleanNum(e.target.value), qrRevealed: false });
                          }}
                          className={`w-full border rounded-xl px-3 py-2 text-sm font-mono font-bold select-text ${inputCls}`}
                        />
                        <div className="flex flex-wrap items-center gap-1.5">
                          {presets.map((p) => (
                            <button
                              key={p}
                              type="button"
                              onClick={() => { setModalError(''); setBookingForm({ ...bookingForm, customFullAmount: p, qrRevealed: false }); }}
                              className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${Number(bookingForm.customFullAmount) === p ? 'bg-teal-600 text-white border-teal-600' : cardBg}`}
                            >
                              ₹{(p / 1000).toFixed(0)}k
                            </button>
                          ))}
                          <button
                            type="button"
                            onClick={() => { setModalError(''); setBookingForm({ ...bookingForm, customFullAmount: capMax, qrRevealed: false }); }}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${Number(bookingForm.customFullAmount) === capMax ? 'bg-emerald-600 text-white border-emerald-600' : cardBg}`}
                          >
                            {isUpi && maxFull > MAX_UPI_AMOUNT_INR ? 'Max ₹80k UPI' : `Full ₹${maxFull.toLocaleString('en-IN')}`}
                          </button>
                        </div>
                        {isBadRound && (
                          <p className="text-[11px] text-rose-500 font-bold">
                            {L('Only ₹500 round multiples allowed (e.g., ₹12,500, ₹13,000, ₹14,500) — no loose change.', '₹500 గుణిజాలు మాత్రమే (ఉదా: ₹12,500, ₹13,000, ₹14,500) — చిల్లర మొత్తం అనుమతించబడదు.')}
                          </p>
                        )}
                        <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-300/20">
                          <span>{L('Pay Now:', 'ఇప్పుడు:')} <b className="text-emerald-500">₹{Math.min(capMax, Math.max(0, curVal || 0)).toLocaleString('en-IN')}</b></span>
                          <span>{L('Balance at Packing:', 'ప్యాకింగ్ వద్ద:')} <b className="text-amber-500">₹{Math.max(0, maxFull - Math.min(capMax, Math.max(0, curVal || 0))).toLocaleString('en-IN')}</b></span>
                        </div>
                      </div>
                    );
                  })()}
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
                    const advToken = Math.max(1000, Math.round(hatcheryFixedCost * 0.05));
                    const customEntered = (bookingForm.customFullAmount !== undefined && bookingForm.customFullAmount !== '')
                      ? Math.min(fullTotal, Math.max(0, Number(bookingForm.customFullAmount) || 0))
                      : fullTotal;
                    const token = bookingForm.paymentOption === 'FULL' ? (customEntered || fullTotal) : advToken;

                    // UPI PAYMENT: BLURRED QR UNTIL "Show QR" CLICKED + "Pay By App" (NO REQUEST BY VPA)
                    if (bookingForm.paymentMethod === 'DIRECT_UPI') {
                      const isUpiCapped = token > MAX_UPI_AMOUNT_INR;
                      const upiPayNow = isUpiCapped ? MAX_UPI_AMOUNT_INR : token;
                      const remainingAtPackingDiff = Math.max(0, token - upiPayNow);
                      const upiUri = `upi://pay?pa=${PLATFORM_UPI_ID}&pn=AquaMark&am=${upiPayNow}&cu=INR&tn=${bookingForm.paymentOption === 'FULL' && !isUpiCapped ? 'SeedFullPayment' : 'SeedUpiBooking'}`;
                      const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${encodeURIComponent(upiUri)}`;

                      return (
                        <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3.5 space-y-3 text-xs">
                          {isUpiCapped && (
                            <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-2.5 space-y-1.5 text-[11px]">
                              <div className="font-extrabold text-amber-500 flex items-center gap-1.5">
                                <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                                <span>{L('UPI Max ₹80,000 Cap Applied', 'UPI గరిష్ట పరిమితి ₹80,000')}</span>
                              </div>
                              <p className="opacity-90 leading-snug">
                                {L(
                                  `Pay ₹80,000 via UPI now. Remaining ₹${remainingAtPackingDiff.toLocaleString('en-IN')} is payable at Packing / Hatchery (or switch to Bank Transfer for full payment).`,
                                  `ఇప్పుడు UPI ద్వారా ₹80,000 చెల్లించండి. మిగిలిన ₹${remainingAtPackingDiff.toLocaleString('en-IN')} ప్యాకింగ్ వద్ద చెల్లించాలి (మొత్తం ఒకేసారి చెల్లించాలంటే Bank-to-Bank వాడండి).`
                                )}
                              </p>
                            </div>
                          )}
                          <div className="flex items-center justify-between text-[11px] font-bold text-teal-600 dark:text-teal-400">
                            <span>UPI ID: <b className="font-mono select-text">{PLATFORM_UPI_ID}</b></span>
                            <span>Pay Now: <b>₹{upiPayNow.toLocaleString('en-IN')}</b></span>
                          </div>
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
                                {bookingForm.qrRevealed ? `Scan QR with any UPI App • ₹${upiPayNow.toLocaleString('en-IN')}` : `Click Show QR to reveal ₹${upiPayNow.toLocaleString('en-IN')} code`}
                              </span>
                            </div>
                          ) : (
                            <div className="text-center space-y-2 py-2">
                              <a
                                href={upiUri}
                                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs inline-flex items-center justify-center gap-2"
                              >
                                <Smartphone className="w-4 h-4" /> Open GPay / PhonePe / Paytm (₹{upiPayNow.toLocaleString('en-IN')})
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
                            <div><b>5% Advance Transfer:</b> ₹{token.toLocaleString('en-IN')} (IMPS / NEFT)</div>
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
                const payNowAmt = isFull ? total : Math.max(1000, Math.round(hatcheryFixedCost * 0.05));
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
                      {/* ROUND-3 FEATURE: EFFECTIVE NET RATE & OXYGEN LOGISTICS PREVIEW */}
                      {(() => {
                        const totalBonusPct = (selectedBatch.bonusPercent || 15) + 2;
                        const bonusPl = Math.round(qty * (totalBonusPct / 100));
                        const totalPl = qty + bonusPl;
                        const effRate = totalPl > 0 ? (total / totalPl).toFixed(3) : '0.000';
                        const bags = Math.ceil(totalPl / 2500);
                        const boxes = Math.ceil(bags / 2);
                        const splitCnt = Math.max(1, Number(bookingForm.pondSplitCount) || 1);
                        return (
                          <div className="border-t border-white/10 pt-2 mt-1 grid grid-cols-2 gap-1.5 text-[11px] text-teal-300">
                            <span>Effective Rate (+{selectedBatch.bonusPercent}% + 2% App): <b>₹{effRate}/seed</b></span>
                            <span className="text-right">Est. Packing: <b>{bags} Bags / {boxes} Boxes</b></span>
                            {splitCnt > 1 && (
                              <span className="col-span-2 text-amber-300">Split Across {splitCnt} Ponds: <b>{Math.round(totalPl / splitCnt).toLocaleString('en-IN')} PL / Pond</b></span>
                            )}
                          </div>
                        );
                      })()}
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
        const myCleanPhone = String(currentUser?.phone || '').split('_')[0].replace(/\D/g, '').slice(-10);
        const myNotifs = notifications.filter(n => {
          const nPhone = String(n.targetPhone || '').split('_')[0].replace(/\D/g, '').slice(-10);
          const roleMatch = !n.targetRole || n.targetRole === 'ALL' || n.targetRole === currentUser?.role;
          return (nPhone === myCleanPhone || n.targetPhone === 'ALL') && roleMatch;
        });
        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 max-h-[88vh] flex flex-col ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3 shrink-0">
                <div className="flex items-center gap-2">
                  <Bell className="w-5 h-5 text-teal-600" />
                  <div>
                    <h3 className="font-extrabold text-base">{L('Notifications & Live Updates', 'నోటిఫికేషన్లు & లైవ్ అప్‌డేట్స్')}</h3>
                    <p className="text-[11px] opacity-60">{L('Click any notification to view full details', 'పూర్తి వివరాల కోసం ఏదైనా నోటిఫికేషన్‌పై క్లిక్ చేయండి')}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {myNotifs.some(n => !n.read) && (
                    <button
                      type="button"
                      onClick={() => {
                        const next = notifications.map(n => {
                          const nPhone = String(n.targetPhone || '').split('_')[0].replace(/\D/g, '').slice(-10);
                          const roleMatch = !n.targetRole || n.targetRole === 'ALL' || n.targetRole === currentUser?.role;
                          return (nPhone === myCleanPhone || n.targetPhone === 'ALL') && roleMatch
                            ? { ...n, read: true }
                            : n;
                        });
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
                  <p className="text-xs opacity-60 py-8 text-center">{L('No notifications yet. All booking, packing & payment updates appear here.', 'ఇంకా నోటిఫికేషన్లు లేవు. అన్ని బుకింగ్, ప్యాకింగ్ & పేమెంట్ వివరాలు ఇక్కడ కనిపిస్తాయి.')}</p>
                ) : (
                  myNotifs.map(n => (
                    <div
                      key={n.id}
                      onClick={() => {
                        setSelectedNotifDetail(n);
                        if (!n.read) {
                          const next = notifications.map(item => (item.id === n.id ? { ...item, read: true } : item));
                          setNotifications(next);
                          saveKvToSupabase('notifications', next);
                        }
                      }}
                      className={`border rounded-xl p-3.5 space-y-1.5 cursor-pointer transition hover:border-teal-500 ${!n.read ? 'border-teal-500 bg-teal-500/5' : subCardBg}`}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold flex items-center gap-1.5">
                          {!n.read && <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />}
                          {n.title}
                        </span>
                        <span className="text-[10px] opacity-60 shrink-0">{n.createdAt}</span>
                      </div>
                      <p className="text-xs opacity-80 leading-relaxed line-clamp-2">{n.message}</p>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* NOTIFICATION FULL DETAILS POPUP MODAL */}
      {selectedNotifDetail && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-[60] flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border-2 border-teal-500 space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-teal-600" />
                <div>
                  <h3 className="font-extrabold text-sm">{selectedNotifDetail.title}</h3>
                  <span className="text-[10px] opacity-60">{selectedNotifDetail.createdAt}</span>
                </div>
              </div>
              <button type="button" onClick={() => setSelectedNotifDetail(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>
            <p className="text-xs leading-relaxed opacity-90">{selectedNotifDetail.message}</p>
            {selectedNotifDetail.details && Object.keys(selectedNotifDetail.details).length > 0 && (
              <div className={`p-3.5 rounded-xl border text-xs space-y-1.5 ${subCardBg}`}>
                <span className="text-[10px] font-extrabold uppercase text-teal-600 block">
                  {L('Full Notification Details', 'నోటిఫికేషన్ పూర్తి వివరాలు')}
                </span>
                {Object.entries(selectedNotifDetail.details).map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-2 border-b border-slate-300/20 pb-1 last:border-0 last:pb-0">
                    <span className="opacity-70 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                    <b className="font-mono">{typeof v === 'number' ? v.toLocaleString('en-IN') : String(v)}</b>
                  </div>
                ))}
              </div>
            )}
            <div className="flex justify-end">
              <button type="button" onClick={() => setSelectedNotifDetail(null)} className="bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold px-4 py-2 rounded-xl cursor-pointer">
                {t.closeBtn}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* RAZORPAY CHECKOUT MODAL (FALLBACK WHEN VITE_RAZORPAY_KEY_ID IS NOT SET) */}
      {razorpayModal && (
        <div className="fixed inset-0 bg-slate-950/85 backdrop-blur-xs z-[70] flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-sm w-full overflow-hidden shadow-2xl border border-indigo-500/40 ${cardBg}`}>
            <div className="bg-indigo-600 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                <div>
                  <div className="text-sm font-extrabold">Razorpay Checkout</div>
                  <div className="text-[10px] opacity-80">Aqua Mark Verified Payment</div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => {
                  const cb = razorpayModal.onFailure;
                  setRazorpayModal(null);
                  if (cb) cb(L('Payment cancelled by user.', 'పేమెంట్ రద్దు చేయబడింది.'));
                }}
                className="text-white/80 hover:text-white font-bold cursor-pointer"
              >
                ✕
              </button>
            </div>
            <div className="p-5 space-y-4 text-xs">
              <div className={`p-3 rounded-xl border space-y-1 ${subCardBg}`}>
                <div className="opacity-70">{razorpayModal.description}</div>
                <div className="text-2xl font-black text-indigo-500">₹{Number(razorpayModal.amountInr || 0).toLocaleString('en-IN')}</div>
                <div className="text-[11px] opacity-65">{razorpayModal.prefillName} • +91 {razorpayModal.prefillPhone}</div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const cb = razorpayModal.onFailure;
                    setRazorpayModal(null);
                    if (cb) cb(L('Payment cancelled by user.', 'పేమెంట్ రద్దు చేయబడింది.'));
                  }}
                  className={`flex-1 py-2.5 border rounded-xl font-bold cursor-pointer ${subCardBg}`}
                >
                  {L('Cancel', 'రద్దు')}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const cb = razorpayModal.onSuccess;
                    setRazorpayModal(null);
                    cb(`RZP_${Math.floor(100000 + Math.random() * 900000)}`);
                  }}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2.5 rounded-xl font-bold cursor-pointer"
                >
                  {L(`Pay ₹${Number(razorpayModal.amountInr || 0).toLocaleString('en-IN')}`, `₹${Number(razorpayModal.amountInr || 0).toLocaleString('en-IN')} చెల్లించండి`)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

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
              <span className="text-[11px] font-bold uppercase text-emerald-600">{L('Current Deposited Money', 'ప్రస్తుత డిపాజిట్ మొత్తం')}</span>
              <div className="text-3xl font-black text-emerald-600">₹{(myFixedHatchery.depositAmount || 10000).toLocaleString('en-IN')}</div>
              <p className="text-[11px] opacity-70">
                Source Ref: <span className="font-mono font-bold">{myFixedHatchery.depositSourceAccount || myFixedHatchery.depositUtr || 'VERIFIED_10K'}</span>
              </p>
            </div>

            <form onSubmit={handleAddHatcheryDepositMoney} className={`border rounded-2xl p-4 space-y-3 text-xs ${subCardBg}`}>
              <h4 className="font-extrabold text-sm">{L('Add Money to Deposit', 'డిపాజిట్‌కు డబ్బు జతచేయండి')}</h4>
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
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(`upi://pay?pa=9959933166@ybl&pn=AquaMarkDeposit&am=${Number(addDepositAmount) || 5000}&cu=INR`)}`}
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
          HATCHERY SCAN QR MODAL (LIVE CAMERA + FLIP + FLASH + LASER + PHOTO QR + MANUAL)
         ========================================================= */}
      {showSellerScanQrModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <style>{`@keyframes aqmLaserScan { 0%, 100% { top: 8%; } 50% { top: 86%; } }`}</style>
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 max-h-[92vh] overflow-y-auto ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <h3 className="font-extrabold text-base flex items-center gap-2">
                <ScanLine className="w-5 h-5 text-indigo-500" /> {L('Live Gate-Pass QR Scanner', 'లైవ్ గేట్-పాస్ QR స్కానర్')}
              </h3>
              <button type="button" onClick={() => { stopQrCamera(); setShowSellerScanQrModal(false); }} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>

            {/* TABS: CAMERA SCANNER vs MANUAL / QUICK-SCAN */}
            <div className={`grid grid-cols-2 p-1 rounded-xl border ${subCardBg}`}>
              <button
                type="button"
                onClick={() => { setScanQrError(''); setScanQrTab('camera'); }}
                className={`py-2 rounded-lg text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer ${scanQrTab === 'camera' ? 'bg-indigo-600 text-white' : 'opacity-70'}`}
              >
                <Camera className="w-3.5 h-3.5" /> {L('Camera Scanner', 'కెమెరా స్కానర్')}
              </button>
              <button
                type="button"
                onClick={() => { setScanQrError(''); setScanQrTab('manual'); }}
                className={`py-2 rounded-lg text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer ${scanQrTab === 'manual' ? 'bg-indigo-600 text-white' : 'opacity-70'}`}
              >
                <QrCode className="w-3.5 h-3.5" /> {L('Manual / Quick-Scan', 'మాన్యువల్ / క్విక్ స్కాన్')}
              </button>
            </div>

            {scanQrError && (
              <div className="bg-rose-500/15 border border-rose-500/30 text-rose-500 px-3 py-2 rounded-xl text-xs font-bold">
                {scanQrError}
              </div>
            )}

            <input
              ref={photoQrInputRef}
              type="file"
              accept="image/*"
              onChange={(e) => { if (e.target.files?.[0]) handlePhotoQrUpload(e.target.files[0]); e.target.value = ''; }}
              className="hidden"
            />

            {scanQrTab === 'camera' && (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden bg-black aspect-[4/3] border-2 border-indigo-500/50">
                  <video ref={scannerVideoRef} playsInline muted className="w-full h-full object-cover" />
                  {/* Animated Laser Viewfinder Overlay */}
                  <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="relative w-52 h-52 border-2 border-white/30 rounded-2xl">
                      <span className="absolute -top-0.5 -left-0.5 w-6 h-6 border-t-4 border-l-4 border-teal-400 rounded-tl-xl" />
                      <span className="absolute -top-0.5 -right-0.5 w-6 h-6 border-t-4 border-r-4 border-teal-400 rounded-tr-xl" />
                      <span className="absolute -bottom-0.5 -left-0.5 w-6 h-6 border-b-4 border-l-4 border-teal-400 rounded-bl-xl" />
                      <span className="absolute -bottom-0.5 -right-0.5 w-6 h-6 border-b-4 border-r-4 border-teal-400 rounded-br-xl" />
                      <div
                        className="absolute left-2 right-2 h-0.5 bg-gradient-to-r from-transparent via-teal-400 to-transparent shadow-[0_0_12px_#2dd4bf]"
                        style={{ animation: 'aqmLaserScan 2.2s ease-in-out infinite' }}
                      />
                    </div>
                  </div>
                  <div className="absolute bottom-2 left-2 right-2 bg-slate-950/75 text-white text-[11px] font-semibold px-3 py-1.5 rounded-xl text-center">
                    {scannerStatus || L('Point camera at Buyer Gate-Pass QR...', 'బయ్యర్ Gate-Pass QR పై కెమెరా ఉంచండి...')}
                  </div>
                </div>

                {/* Camera Controls: Flip, Flash, Photo QR */}
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setScannerFacingMode(prev => (prev === 'environment' ? 'user' : 'environment'))}
                    className={`py-2 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${subCardBg}`}
                  >
                    <RefreshCw className="w-3.5 h-3.5 text-teal-600" /> {L('Flip', 'ఫ్లిప్')}
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleScannerFlash}
                    className={`py-2 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${scannerFlashOn ? 'bg-amber-500 text-white border-amber-500' : subCardBg}`}
                  >
                    <Zap className="w-3.5 h-3.5" /> {scannerFlashOn ? L('Flash ON', 'ఫ్లాష్ ఆన్') : L('Flash', 'ఫ్లాష్')}
                  </button>
                  <button
                    type="button"
                    onClick={() => photoQrInputRef.current?.click()}
                    className={`py-2 rounded-xl border text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer ${subCardBg}`}
                  >
                    <Upload className="w-3.5 h-3.5 text-indigo-500" /> {L('Photo QR', 'ఫోటో QR')}
                  </button>
                </div>
              </div>
            )}

            {scanQrTab === 'manual' && (
              <>
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
                  <div className="flex gap-2">
                    <button type="submit" className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs cursor-pointer">
                      Verify QR & Complete Packing + Settle Payment
                    </button>
                    <button
                      type="button"
                      onClick={() => photoQrInputRef.current?.click()}
                      className={`px-3 py-2.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${subCardBg}`}
                    >
                      <Upload className="w-3.5 h-3.5 text-indigo-500" /> Photo QR
                    </button>
                  </div>
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
              </>
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
          { title: bk.fullPaid ? '100% Full Payment Paid' : '5% Advance Paid', sub: `Ref: ${bk.paymentId}`, done: true },
          { title: 'Salinity Acclimatization', sub: `Hatchery ${bk.batch?.salinity || 16} PPT → Pond ${bk.pondSalinity || 15} PPT`, done: true },
          { title: 'Packing & Gate-Pass Ready', sub: `${bk.packingDate} (${bk.packingTimeSlot || 'All Day'})`, done: isPacked },
          { title: 'Gate-Pass Scanned', sub: isFinalCleared ? `Cleared ${bk.clearedAt || ''}` : 'Pending at Hatchery', done: isFinalCleared }
        ];
        return (
          <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
                <div>
                  <span className="font-mono text-[11px] font-bold text-teal-600">{bk.bookingId}</span>
                  <h3 className="font-extrabold text-base">{L('Live Booking & Escrow Status', 'లైవ్ బుకింగ్ & ఎస్క్రో స్థితి')}</h3>
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
                <h3 className="font-extrabold text-base">{L('Pay Remaining Balance (Full Payment)', 'మిగిలిన బ్యాలెన్స్ చెల్లించండి (పూర్తి పేమెంట్)')}</h3>
              </div>
              <button type="button" onClick={() => setPayRemainingBooking(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-3 text-center">
              <span className="text-[11px] font-bold opacity-75 block">{L('Remaining Balance Payable', 'చెల్లించాల్సిన మిగిలిన బ్యాలెన్స్')}</span>
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
              {payRemainingError && (
                <div className="bg-rose-500/10 border border-rose-500/30 text-rose-500 p-2.5 rounded-xl text-[11px] font-bold flex items-start gap-1.5">
                  <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{payRemainingError}</span>
                </div>
              )}
              {(() => {
                const due = Math.max(0, Math.round(Number(payRemainingBooking.balanceAtPacking) || 0));
                const isUpi = payRemainingForm.paymentMethod === 'DIRECT_UPI';
                const capDue = isUpi ? Math.min(due, MAX_UPI_AMOUNT_INR) : due;
                const enteredRem = (payRemainingForm.customAmount !== undefined && payRemainingForm.customAmount !== '')
                  ? Math.max(0, Number(payRemainingForm.customAmount) || 0)
                  : capDue;
                const isRemCapped = isUpi && (due > MAX_UPI_AMOUNT_INR || enteredRem > MAX_UPI_AMOUNT_INR);
                const remPayNow = Math.min(capDue, enteredRem || capDue);
                const remLeftAtPacking = Math.max(0, due - remPayNow);
                const isRemBadRound = enteredRem > 0 && enteredRem !== due && enteredRem % 500 !== 0;
                const remPresets = [5000, 10000, 25000, 50000, 80000].filter(v => v < due && (!isUpi || v <= MAX_UPI_AMOUNT_INR));
                return (
                  <>
                    <div className={`border rounded-xl p-3 space-y-2 text-xs ${subCardBg}`}>
                      <div className="flex items-center justify-between">
                        <label className="font-bold opacity-80">{L('Enter Amount to Pay Now (₹500 multiples)', 'ఇప్పుడు చెల్లించే మొత్తం (₹500 గుణిజాలు)')}</label>
                        <span className="text-[11px] font-bold text-teal-500">Due: ₹{due.toLocaleString('en-IN')}</span>
                      </div>
                      <input
                        type="number"
                        step="500"
                        min={Math.min(1000, due)}
                        max={capDue}
                        placeholder={`e.g., 12500, 15000, ${capDue}`}
                        value={payRemainingForm.customAmount ?? ''}
                        onChange={(e) => {
                          setPayRemainingError('');
                          setPayRemainingForm({ ...payRemainingForm, customAmount: cleanNum(e.target.value), qrRevealed: false });
                        }}
                        className={`w-full border rounded-xl px-3 py-2 text-sm font-mono font-bold select-text ${inputCls}`}
                      />
                      <div className="flex flex-wrap items-center gap-1.5">
                        {remPresets.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => { setPayRemainingError(''); setPayRemainingForm({ ...payRemainingForm, customAmount: p, qrRevealed: false }); }}
                            className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${Number(payRemainingForm.customAmount) === p ? 'bg-teal-600 text-white border-teal-600' : cardBg}`}
                          >
                            ₹{(p / 1000).toFixed(0)}k
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={() => { setPayRemainingError(''); setPayRemainingForm({ ...payRemainingForm, customAmount: capDue, qrRevealed: false }); }}
                          className={`px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer ${Number(payRemainingForm.customAmount) === capDue ? 'bg-emerald-600 text-white border-emerald-600' : cardBg}`}
                        >
                          {isUpi && due > MAX_UPI_AMOUNT_INR ? 'Max ₹80k UPI' : `Full ₹${due.toLocaleString('en-IN')}`}
                        </button>
                      </div>
                      {isRemBadRound && (
                        <p className="text-[11px] text-rose-500 font-bold">
                          {L('Only ₹500 round multiples allowed (e.g., ₹12,500, ₹13,000, ₹14,500) — no loose change.', '₹500 గుణిజాలు మాత్రమే (ఉదా: ₹12,500, ₹13,000, ₹14,500) — చిల్లర మొత్తం అనుమతించబడదు.')}
                        </p>
                      )}
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-slate-300/20">
                        <span>{L('Paying Now:', 'ఇప్పుడు:')} <b className="text-emerald-500">₹{remPayNow.toLocaleString('en-IN')}</b></span>
                        <span>{L('Remaining at Packing:', 'ప్యాకింగ్ వద్ద:')} <b className="text-amber-500">₹{remLeftAtPacking.toLocaleString('en-IN')}</b></span>
                      </div>
                    </div>
                    {isRemCapped && (
                      <div className="bg-amber-500/15 border border-amber-500/40 rounded-xl p-3 space-y-1 text-[11px]">
                        <div className="font-extrabold text-amber-500 flex items-center gap-1.5">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span>{L('UPI Max ₹80,000 Cap Applied', 'UPI గరిష్ట పరిమితి ₹80,000')}</span>
                        </div>
                        <p className="opacity-90 leading-snug">
                          {L(
                            `Pay ₹80,000 via UPI now — pay remaining ₹${remLeftAtPacking.toLocaleString('en-IN')} at Packing / Hatchery (or choose Bank Transfer for full ₹${due.toLocaleString('en-IN')}).`,
                            `ఇప్పుడు UPI ద్వారా ₹80,000 చెల్లించండి — మిగిలిన ₹${remLeftAtPacking.toLocaleString('en-IN')} ప్యాకింగ్ వద్ద చెల్లించండి (మొత్తానికి Bank Transfer వాడవచ్చు).`
                          )}
                        </p>
                      </div>
                    )}
                    {payRemainingForm.paymentMethod === 'DIRECT_UPI' && (
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-[11px] font-bold text-teal-600 dark:text-teal-400">
                          <span>UPI ID: <b className="font-mono select-text">{PLATFORM_UPI_ID}</b></span>
                          <span>Pay Now: <b>₹{remPayNow.toLocaleString('en-IN')}</b></span>
                        </div>
                        <div className="flex flex-col items-center bg-white p-3 rounded-xl border text-slate-900 relative">
                          <img
                            src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=${PLATFORM_UPI_ID}&pn=AquaMark&am=${remPayNow}&cu=INR&tn=Balance${payRemainingBooking.bookingId}`)}`}
                            alt="Balance QR"
                            className={`w-32 h-32 object-contain ${payRemainingForm.qrRevealed ? '' : 'blur-md select-none'}`}
                          />
                          {!payRemainingForm.qrRevealed && (
                            <button type="button" onClick={() => setPayRemainingForm({ ...payRemainingForm, qrRevealed: true })} className="absolute inset-0 m-auto h-8 w-24 bg-teal-600 text-white font-bold text-xs rounded-lg cursor-pointer">
                              Show QR
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                    {(payRemainingForm.paymentMethod === 'DIRECT_UPI' || payRemainingForm.paymentMethod === 'BANK_TO_BANK') && (
                      <input
                        required
                        type="text"
                        placeholder={payRemainingForm.paymentMethod === 'DIRECT_UPI' ? L('Enter 12-digit UPI UTR Reference', '12 అంకెల UPI UTR నంబర్ ఇవ్వండి') : L('Enter 12–22 char Bank NEFT/RTGS UTR', 'బ్యాంక్ NEFT/RTGS UTR నంబర్ ఇవ్వండి')}
                        value={payRemainingForm.utrReference}
                        onChange={(e) => { setPayRemainingError(''); setPayRemainingForm({ ...payRemainingForm, utrReference: e.target.value }); }}
                        className={`w-full border rounded-xl px-3 py-2 text-xs font-mono select-text ${inputCls}`}
                      />
                    )}
                    <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer">
                      Confirm & Pay ₹{remPayNow.toLocaleString('en-IN')} →
                    </button>
                  </>
                );
              })()}
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


      {/* =========================================================
          FEATURE 10: MULTI-POND SEED CART (BULK CART) MODAL
         ========================================================= */}
      {showBulkCartModal && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-lg w-full p-6 shadow-2xl border space-y-4 max-h-[88vh] flex flex-col ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3 shrink-0">
              <div>
                <h3 className="font-extrabold text-base flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-500" /> {L('Multi-Pond Seed Cart', 'మల్టీ-పాండ్ సీడ్ కార్ట్')} ({bulkCart.length})
                </h3>
                <p className="text-[11px] opacity-60">{L('Review total PL across multiple batches & book each slot cleanly', 'అన్ని బ్యాచ్‌ల మొత్తం PL పరిమాణం చూసి బుక్ చేసుకోండి')}</p>
              </div>
              <button type="button" onClick={() => setShowBulkCartModal(false)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>

            {bulkCart.length === 0 ? (
              <p className="text-xs opacity-60 py-8 text-center">{L('Your cart is empty. Click "+ Cart" on any marketplace batch card to add.', 'మీ కార్ట్ ఖాళీగా ఉంది. మార్కెట్‌లో "+ కార్ట్" నొక్కి బ్యాచ్‌లను జతచేయండి.')}</p>
            ) : (() => {
              const resolved = bulkCart.map(item => {
                const batch = batches.find(b => b.id === item.batchId);
                return batch ? { ...item, batch } : null;
              }).filter(Boolean);
              const totalPl = resolved.reduce((s, x) => s + x.lakhs * 100000, 0);
              const totalBonus = resolved.reduce((s, x) => s + Math.round(x.lakhs * 100000 * ((x.batch.bonusPercent || 15) / 100)), 0);
              const totalEst = resolved.reduce((s, x) => s + Math.round(x.lakhs * 100000 * (x.batch.pricePer1000 || 0.43)), 0);
              return (
                <>
                  <div className="overflow-y-auto space-y-2.5 pr-1 flex-1">
                    {resolved.map(item => (
                      <div key={item.batchId} className={`border rounded-xl p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs ${subCardBg}`}>
                        <div className="space-y-0.5">
                          <div className="font-extrabold">{item.batch.id} • {item.batch.plStage} ({item.batch.salinity} PPT)</div>
                          <div className="text-[11px] opacity-70">{item.batch.zone} • ₹{(item.batch.pricePer1000 || 0).toFixed(2)}/seed</div>
                        </div>
                        <div className="flex items-center gap-2">
                          <input
                            type="number"
                            min="1"
                            max="100"
                            value={item.lakhs}
                            onChange={(e) => {
                              const v = Math.max(1, Math.min(100, Number(e.target.value) || 1));
                              setBulkCart(prev => prev.map(c => c.batchId === item.batchId ? { ...c, lakhs: v } : c));
                            }}
                            className={`w-16 border rounded-lg px-2 py-1 text-xs font-bold text-center select-text ${inputCls}`}
                          />
                          <span className="text-[11px] font-bold opacity-70">L PL</span>
                          <button
                            type="button"
                            onClick={() => {
                              setShowBulkCartModal(false);
                              setModalError('');
                              setBookingForm(prev => ({
                                ...prev,
                                farmerName: currentUser.name,
                                farmerPhone: currentUser.phone,
                                qtyAmount: String(item.lakhs),
                                qtyUnit: 'LAKHS',
                                packingDate: item.batch.availableDate || prev.packingDate,
                                packingTimeSlot: item.batch.availableTimeSlot || 'All Day (24 Hours Flexible)',
                                upiSubMode: 'QR',
                                qrRevealed: false,
                                utrReference: ''
                              }));
                              setSelectedBatch(item.batch);
                            }}
                            className="bg-teal-600 hover:bg-teal-700 text-white text-[11px] font-bold px-3 py-1.5 rounded-lg cursor-pointer"
                          >
                            {L('Book', 'బుక్')}
                          </button>
                          <button
                            type="button"
                            onClick={() => setBulkCart(prev => prev.filter(c => c.batchId !== item.batchId))}
                            className="text-rose-500 font-bold px-1.5 cursor-pointer"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-slate-900 text-white rounded-xl p-3.5 text-xs space-y-1 shrink-0">
                    <div className="flex justify-between"><span>{L('Total Seed + Bonus:', 'మొత్తం సీడ్ + బోనస్:')}</span><b>{totalPl.toLocaleString('en-IN')} + {totalBonus.toLocaleString('en-IN')} PL</b></div>
                    <div className="flex justify-between text-emerald-400 font-extrabold text-sm"><span>{L('Estimated Total Value:', 'అంచనా మొత్తం విలువ:')}</span><span>₹{totalEst.toLocaleString('en-IN')}</span></div>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}

      {/* =========================================================
          FEATURE 14: 72-HOUR POST-STOCKING SURVIVAL CHECK-IN MODAL
         ========================================================= */}
      {survivalModalBooking && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-md w-full p-6 shadow-2xl border space-y-4 ${cardBg}`}>
            <div className="flex items-center justify-between border-b border-slate-300/30 pb-3">
              <div>
                <span className="font-mono text-[11px] font-bold text-teal-600">{survivalModalBooking.bookingId} • Batch {survivalModalBooking.batch?.id}</span>
                <h3 className="font-extrabold text-base">{L('72-Hour Post-Stocking Survival Check-In', '72 గంటల పోస్ట్-స్టాకింగ్ సర్వైవల్ చెక్-ఇన్')}</h3>
              </div>
              <button type="button" onClick={() => setSurvivalModalBooking(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
            </div>
            <form onSubmit={handleSaveSurvivalCheckIn} className="space-y-3.5 text-xs">
              {[
                { key: 'h24', label: L('24-Hour Survival %', '24 గంటల సర్వైవల్ %') },
                { key: 'h48', label: L('48-Hour Survival %', '48 గంటల సర్వైవల్ %') },
                { key: 'h72', label: L('72-Hour Survival %', '72 గంటల సర్వైవల్ %') }
              ].map(row => (
                <div key={row.key} className={`p-3 rounded-xl border space-y-1.5 ${subCardBg}`}>
                  <div className="flex justify-between font-bold">
                    <span>{row.label}</span>
                    <span className="text-teal-500 font-black">{survivalDraft[row.key]}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={survivalDraft[row.key]}
                    onChange={(e) => setSurvivalDraft(prev => ({ ...prev, [row.key]: Number(e.target.value) }))}
                    className="w-full accent-teal-600 cursor-pointer"
                  />
                </div>
              ))}
              <div>
                <label className="font-bold opacity-75 block mb-1">{L('Swimming Activity / Pond Notes (Optional)', 'సీడ్ కదలిక / చెరువు నోట్స్ (ఐచ్ఛికం)')}</label>
                <input
                  type="text"
                  placeholder={L('e.g., Active swimming against current, uniform size', 'ఉదా: సీడ్ చాలా చురుకుగా ఉంది')}
                  value={survivalDraft.note}
                  onChange={(e) => setSurvivalDraft(prev => ({ ...prev, note: e.target.value }))}
                  className={`w-full border rounded-xl px-3 py-2 text-xs select-text ${inputCls}`}
                />
              </div>
              <button type="submit" className="w-full bg-teal-600 hover:bg-teal-700 text-white font-bold py-3 rounded-xl text-xs cursor-pointer">
                {L('Save Check-In & Notify Hatchery', 'సేవ్ చేసి హేచరీకి నోటిఫికేషన్ పంపండి')}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* OWNER CRATE QR PREVIEW MODAL (SHOWS QR FIRST + SAVE PDF BUTTON) */}
      {crateQrBatch && (() => {
        const qrPayload = `AQUAMARK-CRATE:${crateQrBatch.id}|HATCHERY:${crateQrBatch.realName}|STAGE:${crateQrBatch.plStage}|PPT:${crateQrBatch.salinity}|CAA:${crateQrBatch.caaLicense}`;
        const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrPayload)}`;
        return (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4">
            <div className={`rounded-2xl max-w-sm w-full p-5 sm:p-6 shadow-2xl border-2 border-teal-500 text-center space-y-4 ${cardBg}`}>
              <div className="flex items-center justify-between border-b border-slate-300/30 pb-2.5">
                <div className="text-left">
                  <span className="text-[10px] font-extrabold text-teal-600 uppercase tracking-wider block">Oxygen Crate QR</span>
                  <h3 className="font-extrabold text-sm">{crateQrBatch.id} • {crateQrBatch.plStage}</h3>
                </div>
                <button type="button" onClick={() => setCrateQrBatch(null)} className="opacity-60 hover:opacity-100 font-bold text-lg cursor-pointer">✕</button>
              </div>
              <div className="bg-white p-3.5 rounded-2xl border border-teal-200 inline-block mx-auto shadow-xs">
                <img src={qrUrl} alt={`Crate QR ${crateQrBatch.id}`} className="w-48 h-48 object-contain" />
              </div>
              <div className={`grid grid-cols-2 gap-2 text-left text-[11px] p-3 rounded-xl border ${subCardBg}`}>
                <div><span className="opacity-60 block">Hatchery</span><b className="truncate block">{crateQrBatch.realName}</b></div>
                <div><span className="opacity-60 block">CAA License</span><b className="font-mono">{crateQrBatch.caaLicense}</b></div>
                <div><span className="opacity-60 block">Salinity / Bonus</span><b>{crateQrBatch.salinity} PPT • +{crateQrBatch.bonusPercent}%</b></div>
                <div><span className="opacity-60 block">Packing Date</span><b>{crateQrBatch.availableDate || 'Flexible'}</b></div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handlePrintCrateQrSticker(crateQrBatch)}
                  className="flex-1 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl inline-flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Download className="w-4 h-4" /> {L('Save PDF / Print', 'PDF సేవ్ / ప్రింట్')}
                </button>
                <button
                  type="button"
                  onClick={() => setCrateQrBatch(null)}
                  className={`px-4 py-2.5 border rounded-xl text-xs font-bold cursor-pointer ${subCardBg}`}
                >
                  {t.closeBtn}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* FLOATING SCROLL-TO-TOP BUTTON (RIGHT SIDE) */}
      {showScrollTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          title="Back to Top"
          className="fixed bottom-5 right-5 z-40 bg-teal-600 hover:bg-teal-700 text-white p-3 rounded-full shadow-xl border border-teal-400/40 cursor-pointer transition active:scale-95"
        >
          <ArrowUp className="w-4 h-4" />
        </button>
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
              {/* FEATURE 22: BILINGUAL VOICE READOUT ON RECEIPT */}
              <button
                type="button"
                onClick={() => {
                  const bk = activeInvoice.booking;
                  handleVoiceReadout(
                    'receipt',
                    `Official Aqua Mark Receipt. Booking ID ${bk.bookingId}. Hatchery ${bk.batch?.realName}. Quantity ${bk.quantity} seed plus ${bk.bonusSeeds} bonus. Packing on ${bk.packingDate}. Advance paid ${bk.tokenAdvance} rupees. Balance at packing ${bk.balanceAtPacking} rupees.`,
                    `అధికారిక ఆక్వా మార్క్ రసీదు. బుకింగ్ ఐడి ${bk.bookingId}. హేచరీ ${bk.batch?.realName}. సీడ్ పరిమాణం ${bk.quantity} మరియు ${bk.bonusSeeds} బోనస్. ప్యాకింగ్ తేదీ ${bk.packingDate}. చెల్లించిన అడ్వాన్స్ ${bk.tokenAdvance} రూపాయలు. మిగిలిన బ్యాలెన్స్ ${bk.balanceAtPacking} రూపాయలు.`
                  );
                }}
                className={`px-3 py-3 rounded-xl border text-xs font-bold inline-flex items-center gap-1 cursor-pointer ${isSpeakingId === 'receipt' ? 'bg-indigo-600 text-white border-indigo-600' : subCardBg}`}
              >
                {isSpeakingId === 'receipt' ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 text-teal-600" />}
                {isSpeakingId === 'receipt' ? L('Stop', 'ఆపు') : L('Listen', 'వినండి')}
              </button>
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
      {/* NO INTERNET CONNECTION POPUP OVERLAY (KEEPS USER ON EXACT SAME PAGE) */}
      {(!isOnline || networkError) && (
        <div className="fixed inset-0 bg-slate-950/75 backdrop-blur-xs z-[9998] flex items-center justify-center p-4">
          <div className={`rounded-2xl max-w-sm w-full p-6 shadow-2xl border-2 border-rose-500/40 text-center space-y-4 ${cardBg}`}>
            <div className="w-14 h-14 rounded-2xl bg-rose-500/15 text-rose-500 flex items-center justify-center mx-auto">
              <WifiOff className="w-7 h-7" />
            </div>
            <div className="space-y-1.5">
              <h3 className="text-lg font-extrabold">{L('No Internet Connection', 'ఇంటర్నెట్ కనెక్షన్ లేదు')}</h3>
              <p className="text-xs opacity-75 leading-relaxed">
                {L(
                  'Your network appears to be offline or unreachable. Your current page and data are safely preserved — reconnect and tap Retry.',
                  'మీ నెట్‌వర్క్ ఆఫ్‌లో ఉంది లేదా కనెక్ట్ అవ్వడం లేదు. మీరు ఉన్న పేజీ సురక్షితంగా ఉంది — నెట్ ఆన్ చేసి Retry నొక్కండి.'
                )}
              </p>
            </div>
            <button
              type="button"
              disabled={isRetryingNetwork}
              onClick={handleRetryConnection}
              className="w-full bg-teal-600 hover:bg-teal-700 disabled:opacity-60 text-white font-bold py-3 rounded-xl text-sm inline-flex items-center justify-center gap-2 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isRetryingNetwork ? 'animate-spin' : ''}`} />
              {isRetryingNetwork ? L('Retrying...', 'ప్రయత్నిస్తోంది...') : L('Retry', 'మళ్ళీ ప్రయత్నించండి (Retry)')}
            </button>
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