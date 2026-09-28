import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertsContext';
import { QuickActionBanner } from '../components/QuickActionBanner';
import { FarmerFieldCardModal } from '../components/FarmerFieldCardModal';
import { DEMO_WEATHER } from '../services/marketWeatherService';
import {
  CloudSun,
  Sprout,
  AlertTriangle,
  Droplets,
  HeartPulse,
  Calculator,
  Calendar,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
  Printer,
  Store,
  Sparkles,
  Power,
  Layers,
  CheckSquare,
  Square,
  Plus,
  ArrowRight,
  LogOut,
  Waves,
  Activity,
  FileText,
  Crosshair,
  Navigation,
  MapPin,
  Compass,
  Footprints,
  ExternalLink,
} from 'lucide-react';
import {
  calculateDistanceKm,
  calculatePolygonAreaAcres,
  reverseGeocodeTamilNadu,
  KNOWN_AGRI_FACILITIES,
  ACTIVE_OUTBREAK_LOCATIONS,
} from '../services/locationService';

interface DashboardPageProps {
  onNavigate: (tabId: string) => void;
  onOpenVoiceModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenVoiceModal,
}) => {
  const { language, t } = useLanguage();
  const { farmer, logout } = useAuth();
  const { alerts } = useAlerts();

  const [isFieldCardOpen, setIsFieldCardOpen] = useState(false);
  const [selectedCropStage, setSelectedCropStage] = useState<'basal' | 'tillering' | 'panicle' | 'heading'>('tillering');

  // --- Smart Irrigation State & Remote Controls ---
  const [isPumpOn, setIsPumpOn] = useState(false);
  const [irrigationMode, setIrrigationMode] = useState<'auto' | 'manual'>('auto');
  const [soilMoisture, setSoilMoisture] = useState(72); // percentage
  const [waterDepthCm, setWaterDepthCm] = useState(2.5); // AWD depth
  const [lastWateredTime, setLastWateredTime] = useState(
    language === 'ta' ? 'நேற்று காலை 6:30' : 'Yesterday, 6:30 AM'
  );
  const [irrigationNotice, setIrrigationNotice] = useState<string | null>(null);

  // --- Crop Management State & Tasks ---
  const [cropTasks, setCropTasks] = useState([
    {
      id: 't1',
      textTa: 'கோனோ-வீடர் மூலம் களை எடுத்து வேர்களுக்கு காற்றோட்டம் கூட்டவும்',
      textEn: 'Run cono-weeder across SRI rows for soil aeration',
      done: true,
      category: 'weeding',
    },
    {
      id: 't2',
      textTa: 'வயலில் 2.5 செ.மீ மெல்லிய நீர் அளவை சரிபார்க்கவும் (AWD பாசனம்)',
      textEn: 'Verify shallow 2.5cm standing water depth (AWD cycle)',
      done: false,
      category: 'water',
    },
    {
      id: 't3',
      textTa: 'வேப்பம் புண்ணாக்குடன் யூரியா மேலுரம் இடவும் (தூர்க்கட்டும் பருவம்)',
      textEn: 'Apply Urea top-dressing mixed with Neem cake (5:1 ratio)',
      done: false,
      category: 'fertilizer',
    },
    {
      id: 't4',
      textTa: 'குருத்துப்பூச்சி & இலைசுருட்டு தாக்குதல் தீவிர கண்காணிப்பு',
      textEn: 'Monitor yellow stem borer egg masses & leaf folder',
      done: false,
      category: 'pest',
    },
  ]);

  const [activityNotes, setActivityNotes] = useState<string[]>([
    '02-Sep: 25kg Urea + 15kg MOP applied at tillering stage.',
    '28-Aug: Field water drained for 2 days as per AWD regimen.',
  ]);
  const [newNoteInput, setNewNoteInput] = useState('');

  // Toggle Pump function
  const handleTogglePump = () => {
    const newState = !isPumpOn;
    setIsPumpOn(newState);
    if (newState) {
      setLastWateredTime(language === 'ta' ? 'தற்போது இயங்குகிறது...' : 'Running now...');
      setIrrigationNotice(
        language === 'ta'
          ? 'மோட்டார் பாசனம் இயக்கப்பட்டது. வயல் நீர்மட்டம் கண்காணிக்கப்படுகிறது.'
          : 'Motor pump activated. Monitoring water depth.'
      );
    } else {
      const nowStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
      setLastWateredTime(language === 'ta' ? `இன்று ${nowStr}` : `Today, ${nowStr}`);
      setIrrigationNotice(
        language === 'ta'
          ? 'மோட்டார் நிறுத்தப்பட்டது. தேவையான நீர் மட்டம் எட்டப்பட்டது.'
          : 'Pump shut off. Required AWD depth reached.'
      );
    }
    // Auto clear feedback notice after 4 seconds
    setTimeout(() => setIrrigationNotice(null), 4000);
  };

  // Toggle task completion
  const handleToggleTask = (id: string) => {
    setCropTasks((prev) =>
      prev.map((t) => (t.id === id ? { ...t, done: !t.done } : t))
    );
  };

  // Add quick activity note
  const handleAddActivityNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteInput.trim()) return;
    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    setActivityNotes((prev) => [`${dateStr}: ${newNoteInput.trim()}`, ...prev]);
    setNewNoteInput('');
  };

  const nearbyAlert = alerts[0];

  // Fertilizer recommendations per acre calculated for farmer's land size
  const acres = farmer?.farmSizeAcres || 2.5;

  const fertilizerDoses = {
    basal: {
      stageTa: 'அடி உரம் (Basal - 0-3 நாட்கள்)',
      stageEn: 'Basal Application (Day 0-3)',
      ureaBags: (0.3 * acres).toFixed(1),
      dapBags: (0.6 * acres).toFixed(1),
      potashBags: (0.25 * acres).toFixed(1),
      zincKg: (5 * acres).toFixed(0),
      instructionsTa: 'கடைசி உழவின் போது மண்ணில் இட்டு சமன் செய்யவும். ஜிங்க் சல்பேட்டை DAP உடன் கலக்கக் கூடாது.',
      instructionsEn: 'Incorporate during final puddling. Do not mix Zinc Sulphate directly with DAP.',
    },
    tillering: {
      stageTa: 'முதல் மேலுரம் - தூர்க்கட்டும் பருவம் (Day 20-25)',
      stageEn: '1st Top Dressing - Active Tillering (Day 20-25)',
      ureaBags: (0.6 * acres).toFixed(1),
      dapBags: '0.0',
      potashBags: (0.15 * acres).toFixed(1),
      zincKg: (4 * acres).toFixed(0),
      instructionsTa: 'களை எடுத்த 2 நாட்களுக்குப் பின், வயலில் மெல்லிய நீர் இருக்கும் போது வேப்பம் புண்ணாக்குடன் கலந்து இடவும்.',
      instructionsEn: 'Apply after weeding when thin film of water is present. Mix Urea with neem cake (5:1) for slow release.',
    },
    panicle: {
      stageTa: 'இரண்டாம் மேலுரம் - தூர் முதிர்தல் (Day 40-45)',
      stageEn: '2nd Top Dressing - Panicle Initiation (Day 40-45)',
      ureaBags: (0.45 * acres).toFixed(1),
      dapBags: '0.0',
      potashBags: (0.35 * acres).toFixed(1),
      zincKg: '0',
      instructionsTa: 'கதிர் உருவாகும் தருணம். பொட்டாஷ் மணி திரட்சியை அதிகரிக்கும்; நோய் எதிர்ப்பாற்றல் கூட்டும்.',
      instructionsEn: 'Crucial for grain weight. MOP improves disease resistance and prevents lodging.',
    },
    heading: {
      stageTa: 'கதிர் வரும் பருவம் (Heading - Day 70-75)',
      stageEn: 'Heading Stage (Day 70-75)',
      ureaBags: '0.0',
      dapBags: '0.0',
      potashBags: (0.2 * acres).toFixed(1),
      zincKg: '0',
      instructionsTa: '1% பொட்டாசியம் நைட்ரேட் (KNO3) இலைவழி தெளிப்பு 100 லிட்டர் நீரில் கலந்து காலை வேளையில் தெளிக்கலாம்.',
      instructionsEn: 'Foliar spray of 1% KNO3 (Potassium Nitrate) in early morning to boost 1000-grain weight.',
    },
  };

  const currentDose = fertilizerDoses[selectedCropStage];

  // --- Field Location Tracking System State ---
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [gpsCoords, setGpsCoords] = useState<{
    latitude: number;
    longitude: number;
    accuracy: number;
    altitude: number;
  }>({
    latitude: 10.8785,
    longitude: 79.1022,
    accuracy: 3.5,
    altitude: 46,
  });
  const [addressDetails, setAddressDetails] = useState(() =>
    reverseGeocodeTamilNadu(10.8785, 79.1022)
  );
  const [isMeasuringWalk, setIsMeasuringWalk] = useState(false);
  const [fieldBoundary, setFieldBoundary] = useState(() =>
    calculatePolygonAreaAcres([
      { latitude: 10.8785, longitude: 79.1022 },
      { latitude: 10.8795, longitude: 79.1035 },
      { latitude: 10.8780, longitude: 79.1042 },
      { latitude: 10.8770, longitude: 79.1028 },
    ])
  );
  const [pinnedToast, setPinnedToast] = useState(false);

  // Toggle live GPS
  const handleToggleDashboardGps = () => {
    if (!isGpsActive) {
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (pos) => {
            const loc = {
              latitude: pos.coords.latitude,
              longitude: pos.coords.longitude,
              accuracy: Math.round(pos.coords.accuracy * 10) / 10,
              altitude: pos.coords.altitude ? Math.round(pos.coords.altitude) : 46,
            };
            setGpsCoords(loc);
            setAddressDetails(reverseGeocodeTamilNadu(loc.latitude, loc.longitude));
            setIsGpsActive(true);
          },
          () => {
            setIsGpsActive(true);
          },
          { enableHighAccuracy: true }
        );
      } else {
        setIsGpsActive(true);
      }
    } else {
      setIsGpsActive(false);
    }
  };

  // Toggle Perimeter Walk
  const handleToggleDashboardWalk = () => {
    setIsMeasuringWalk(!isMeasuringWalk);
  };

  // Pin farm location
  const handlePinLocation = () => {
    setPinnedToast(true);
    setTimeout(() => setPinnedToast(false), 3500);
  };

  // Nearest Agri Facility with distance
  const nearestFacility = KNOWN_AGRI_FACILITIES.map((f) => ({
    ...f,
    distanceKm: calculateDistanceKm(gpsCoords.latitude, gpsCoords.longitude, f.latitude, f.longitude),
  })).sort((a, b) => (a.distanceKm || 0) - (b.distanceKm || 0))[0];

  // Nearest Pest Outbreak with distance
  const nearestOutbreak = ACTIVE_OUTBREAK_LOCATIONS.map((o) => ({
    ...o,
    distanceKm: calculateDistanceKm(gpsCoords.latitude, gpsCoords.longitude, o.latitude, o.longitude),
  })).sort((a, b) => a.distanceKm - b.distanceKm)[0];

  // Dynamic farmer representation
  const farmerDisplayName =
    farmer?.name ||
    (farmer?.mobile ? `+91 ${farmer.mobile.slice(0, 5)} ${farmer.mobile.slice(5)}` : (language === 'ta' ? 'உழவரே' : 'Farmer'));
  
  const farmerDisplayLocation = [farmer?.village, farmer?.district].filter(Boolean).join(', ') || 'Tamil Nadu';

  // Real Tamil Nadu Mandi Snapshots
  const liveMandiRates = [
    {
      commodityTa: 'நெல் (சன்ன ரகம் - பொன்னி)',
      commodityEn: 'Paddy (Fine - Ponni)',
      marketTa: 'தஞ்சாவூர் DPC',
      marketEn: 'Thanjavur DPC',
      rate: '₹2,380',
      unitTa: '/ குவிண்டால்',
      unitEn: '/ qtl',
      trend: '+₹25',
      trendType: 'up',
    },
    {
      commodityTa: 'தக்காளி (நாட்டு)',
      commodityEn: 'Tomato (Local)',
      marketTa: 'ஒட்டன்சத்திரம்',
      marketEn: 'Oddanchatram',
      rate: '₹1,550',
      unitTa: '/ குவிண்டால்',
      unitEn: '/ qtl',
      trend: '+₹40',
      trendType: 'up',
    },
    {
      commodityTa: 'சின்ன வெங்காயம்',
      commodityEn: 'Small Shallots',
      marketTa: 'திண்டுக்கல் மார்க்கெட்',
      marketEn: 'Dindigul Market',
      rate: '₹4,800',
      unitTa: '/ குவிண்டால்',
      unitEn: '/ qtl',
      trend: '+₹120',
      trendType: 'up',
    },
    {
      commodityTa: 'வாழை (பூவன்)',
      commodityEn: 'Banana (Poovan)',
      marketTa: 'திருச்சி காந்தி மார்க்கெட்',
      marketEn: 'Trichy Gandhi Mkt',
      rate: '₹2,200',
      unitTa: '/ 100 தார்',
      unitEn: '/ 100 Bunches',
      trend: 'நிலையானது',
      trendType: 'steady',
    },
    {
      commodityTa: 'தேங்காய் (நடுத்தரம்)',
      commodityEn: 'Coconut (Medium)',
      marketTa: 'பொள்ளாச்சி மண்டி',
      marketEn: 'Pollachi Mandi',
      rate: '₹31,500',
      unitTa: '/ 1,000 காய்',
      unitEn: '/ 1,000 nuts',
      trend: '+₹300',
      trendType: 'up',
    },
  ];

  return (
    <div className="space-y-6 pb-6">
      {/* Field Identity & Farmer Passport Banner */}
      <div className="bg-[#1b3d2b] text-white rounded-3xl p-5 sm:p-7 shadow-sm border border-emerald-950/20 relative overflow-hidden">
        {/* Subtle decorative grain background */}
        <div className="absolute -right-8 -bottom-10 opacity-10 pointer-events-none">
          <Sprout className="w-64 h-64 text-emerald-300" />
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-emerald-800/80 px-3 py-1 rounded-full text-emerald-200 border border-emerald-700/50">
                {farmerDisplayLocation}
              </span>
              {farmer?.mobile && (
                <span className="text-xs font-mono font-bold bg-emerald-950/70 text-emerald-300 px-2.5 py-1 rounded-full border border-emerald-700/40">
                  +91 {farmer.mobile.slice(0, 5)} {farmer.mobile.slice(5)}
                </span>
              )}
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-800/40">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>TNAU & KVK பரிந்துரை நெறிமுறை</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              {language === 'ta'
                ? `வணக்கம், ${farmerDisplayName}!`
                : `Vanakkam, ${farmerDisplayName}!`}
            </h2>

            {/* Farm snapshot pills */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs text-emerald-100 pt-1">
              <div className="bg-emerald-900/90 px-2.5 py-1 rounded-lg border border-emerald-700/40">
                <span className="text-emerald-300 font-medium">{language === 'ta' ? 'நிலப்பரப்பு' : 'Area'}: </span>
                <span className="font-bold text-white">{farmer?.farmSizeAcres || 2.5} ஏக்கர் (Acres)</span>
              </div>
              <div className="bg-emerald-900/90 px-2.5 py-1 rounded-lg border border-emerald-700/40">
                <span className="text-emerald-300 font-medium">{language === 'ta' ? 'நடப்பு பயிர்' : 'Crop'}: </span>
                <span className="font-bold text-white">{farmer?.mainCrop || 'சம்பா நெல் - CR 1009'}</span>
              </div>
              <div className="bg-emerald-900/90 px-2.5 py-1 rounded-lg border border-emerald-700/40">
                <span className="text-emerald-300 font-medium">{language === 'ta' ? 'மண்' : 'Soil'}: </span>
                <span className="font-bold text-white">{farmer?.soilType || 'களிமண் வண்டல்'}</span>
              </div>
              <div className="bg-emerald-900/90 px-2.5 py-1 rounded-lg border border-emerald-700/40">
                <span className="text-emerald-300 font-medium">{language === 'ta' ? 'பாசனம்' : 'Irrigation'}: </span>
                <span className="font-bold text-white">{farmer?.irrigationType || 'ஆழ்துளை & வாய்க்கால்'}</span>
              </div>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={() => setIsFieldCardOpen(true)}
              className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm border border-emerald-600/50 shadow-xs transition-colors"
            >
              <Printer className="w-4 h-4 text-emerald-300" />
              <span>{language === 'ta' ? 'பயிர் அட்டை (Field Card)' : 'View Field Card'}</span>
            </button>

            <button
              onClick={onOpenVoiceModal}
              className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
            >
              <span>🎙 {language === 'ta' ? 'தமிழில் பேச' : 'Voice Assistant'}</span>
            </button>

            <button
              onClick={() => {
                logout();
                onNavigate('login');
              }}
              className="inline-flex items-center gap-1.5 bg-red-800/80 hover:bg-red-700 text-white font-bold px-3 py-2.5 rounded-xl text-xs border border-red-600/50 shadow-xs transition-colors"
              title="Logout"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'வெளியேறு' : 'Logout'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Mandi Rate Marquee / Ticker */}
      <div className="bg-white rounded-2xl border border-stone-200 p-3 shadow-2xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 mb-2 border-b border-stone-100">
          <div className="flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-700" />
            <h3 className="font-extrabold text-xs sm:text-sm text-stone-900">
              {language === 'ta'
                ? 'இன்றைய உழவர் சந்தை & ஒழுங்குமுறை விற்பனைக்கூட நிலவரம் (TN Mandi Rates)'
                : 'Today\'s Verified Tamil Nadu Mandi & Market Rates'}
            </h3>
            <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.5 rounded">
              Live
            </span>
          </div>
          <button
            onClick={() => onNavigate('market')}
            className="text-xs text-emerald-700 font-bold hover:underline self-start sm:self-auto"
          >
            {language === 'ta' ? 'அனைத்து சந்தை விலைகள் →' : 'View All 38 Districts →'}
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
          {liveMandiRates.map((item, idx) => (
            <div
              key={idx}
              className="bg-stone-50 hover:bg-emerald-50/50 p-2.5 rounded-xl border border-stone-200/80 transition-colors"
            >
              <div className="text-[10px] text-stone-500 truncate">
                {language === 'ta' ? item.marketTa : item.marketEn}
              </div>
              <div className="text-xs font-black text-stone-900 truncate">
                {language === 'ta' ? item.commodityTa : item.commodityEn}
              </div>
              <div className="flex items-baseline justify-between mt-1">
                <span className="text-sm font-extrabold text-emerald-800">
                  {item.rate}
                  <span className="text-[10px] text-stone-500 font-normal">
                    {language === 'ta' ? item.unitTa : item.unitEn}
                  </span>
                </span>
                <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100/60 px-1 rounded">
                  {item.trend}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Action Touch Banner */}
      <QuickActionBanner
        onSelectAction={onNavigate}
        onOpenVoiceModal={onOpenVoiceModal}
      />

      {/* Primary Dashboard Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {/* Card 1: Live Weather */}
        <div
          onClick={() => onNavigate('weather')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-sm text-stone-800 flex items-center gap-2">
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>{t.dashboard.weatherTitle}</span>
            </span>
            <span className="text-xs text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              <span>{language === 'ta' ? 'வானிலை' : 'Details'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-3xl font-black text-stone-900">
                {DEMO_WEATHER.tempC}°C
              </div>
              <div className="text-xs text-stone-600 font-medium mt-0.5">
                {language === 'ta' ? DEMO_WEATHER.conditionTa : DEMO_WEATHER.conditionEn}
              </div>
            </div>
            <div className="text-right text-xs space-y-0.5 text-stone-500">
              <div>
                {language === 'ta' ? 'ஈரப்பதம்' : 'Humidity'}: <b className="text-stone-800">{DEMO_WEATHER.humidityPct}%</b>
              </div>
              <div>
                {language === 'ta' ? 'மழை வாய்ப்பு' : 'Rain Prob'}:{' '}
                <b className="text-amber-600 font-bold">{DEMO_WEATHER.rainProbabilityPct}%</b>
              </div>
              <div>
                {language === 'ta' ? 'காற்று' : 'Wind'}: <b className="text-stone-800">{DEMO_WEATHER.windSpeedKmh} km/h</b>
              </div>
            </div>
          </div>
          <div className="mt-3 pt-2.5 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>{farmer?.district || 'Tamil Nadu'} Microclimate</span>
            <span className="text-emerald-700 font-semibold">5-Day Forecast →</span>
          </div>
        </div>

        {/* Card 2: Current Crop Status */}
        <div
          onClick={() => onNavigate('crop-management')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-sm text-stone-800 flex items-center gap-2">
              <Sprout className="w-4 h-4 text-emerald-600" />
              <span>{t.dashboard.currentCropTitle}</span>
            </span>
            <span className="text-xs text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              <span>{language === 'ta' ? 'மேலாண்மை' : 'Manage'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-start justify-between">
            <div>
              <div className="text-base font-extrabold text-stone-900 leading-tight">
                {farmer?.mainCrop || (language === 'ta' ? 'சம்பா நெல் (CR 1009 / பொன்னி)' : 'Samba Paddy (CR 1009)')}
              </div>
              <div className="inline-block mt-1 bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs px-2 py-0.5 rounded-md font-semibold">
                {language === 'ta' ? 'பருவம்: தூர்க்கட்டும் பருவம் (Tillering)' : 'Stage: Active Tillering'}
              </div>
            </div>
            <span className="text-2xl font-black text-emerald-700">38d</span>
          </div>

          <div className="mt-3.5 space-y-1.5 text-xs text-stone-600">
            <div className="flex justify-between">
              <span>{language === 'ta' ? 'விதைத்த நாள்' : 'Sowing Date'}:</span>
              <b className="text-stone-800">06-Aug-2026</b>
            </div>
            <div className="flex justify-between">
              <span>{language === 'ta' ? 'எதிர்பார்க்கப்படும் அறுவடை' : 'Est. Harvest'}:</span>
              <b className="text-stone-800">18-Nov-2026 (~75 days left)</b>
            </div>
          </div>
        </div>

        {/* Card 3: Nearby Disease Outbreak Alert */}
        <div
          onClick={() => onNavigate('alerts')}
          className="bg-white p-5 rounded-2xl border border-red-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group bg-gradient-to-b from-white to-red-50/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-sm text-red-700 flex items-center gap-1.5">
              <AlertTriangle className="w-4 h-4 text-red-600" />
              <span>{t.dashboard.diseaseAlertsTitle}</span>
            </span>
            <span className="text-[10px] uppercase font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full">
              {nearbyAlert?.severity || 'High'} Alert
            </span>
          </div>

          <div>
            <div className="font-extrabold text-sm text-stone-900">
              {language === 'ta' ? nearbyAlert?.diseaseTa : nearbyAlert?.diseaseEn}
            </div>
            <div className="text-xs text-stone-600 mt-1 flex items-center gap-1">
              <span>{nearbyAlert?.village || 'Thiruvaiyaru'}, {nearbyAlert?.district || 'Thanjavur'}</span>
              <span>•</span>
              <span className="text-red-600 font-semibold">{nearbyAlert?.activeCasesCount} farms affected</span>
            </div>
            <p className="text-xs text-stone-700 mt-2 bg-red-50 p-2 rounded-xl border border-red-100 line-clamp-2">
              {language === 'ta' ? nearbyAlert?.recommendationTa : nearbyAlert?.recommendationEn}
            </p>
          </div>
        </div>

        {/* Card 4: Smart Irrigation Advice */}
        <div
          onClick={() => onNavigate('irrigation')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-sm text-cyan-800 flex items-center gap-2">
              <Droplets className="w-4 h-4 text-cyan-600" />
              <span>{t.dashboard.irrigationTitle}</span>
            </span>
            <span className="text-xs text-cyan-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              <span>{language === 'ta' ? 'அட்டவணை' : 'Schedule'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-stone-600">{language === 'ta' ? 'மண் ஈரப்பதம்' : 'Soil Moisture'}:</span>
              <span className="text-sm font-black text-cyan-700">{soilMoisture}% (போதுமானது)</span>
            </div>
            {/* Visual Moisture Bar */}
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full transition-all" style={{ width: `${soilMoisture}%` }} />
            </div>

            <div className="pt-2 text-xs">
              <div className="font-bold text-amber-700 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'இன்று பாசனம் செய்ய தேவையில்லை' : 'Irrigation Postponed Today'}</span>
              </div>
              <p className="text-stone-600 text-[11px] mt-1 leading-snug">
                {language === 'ta'
                  ? 'நாளை மதியம் மழை பெய்ய 65% வாய்ப்புள்ளதால், தண்ணீர் பாய்ச்சுவதை ஒத்திவைக்கவும்.'
                  : 'Rain expected within 48h. Postpone irrigation to save water and avoid fertilizer runoff.'}
              </p>
            </div>
          </div>
        </div>

        {/* Card 5: Crop Health & Disease Scan */}
        <div
          onClick={() => onNavigate('disease-detection')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-sm text-stone-800 flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-600" />
              <span>{t.dashboard.cropHealthTitle}</span>
            </span>
            <span className="text-xs text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              <span>{language === 'ta' ? 'ஸ்கேன் செய்' : 'Scan Leaf'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-black text-emerald-700">92%</div>
              <div className="text-xs text-stone-600 font-medium">
                {language === 'ta' ? 'ஆரோக்கியமான நிலை' : 'Good Health Condition'}
              </div>
            </div>
            <div className="w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
              ✓
            </div>
          </div>

          <p className="text-xs text-stone-500 mt-3 pt-2 border-t border-stone-100">
            {language === 'ta'
              ? 'கடைசி இலை ஸ்கேன்: 3 நாட்களுக்கு முன். ஏதேனும் கருகல் அல்லது புள்ளி தோன்றினால் கேமரா மூலம் ஸ்கேன் செய்யுங்கள்.'
              : 'Last leaf scan: 3 days ago. Tap here to take photo or upload leaf for instant AI pathology diagnosis.'}
          </p>
        </div>

        {/* Card 6: Yield & Profit Forecast */}
        <div
          onClick={() => onNavigate('profit-prediction')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-sm text-stone-800 flex items-center gap-2">
              <Calculator className="w-4 h-4 text-emerald-600" />
              <span>{t.dashboard.expectedProfitTitle}</span>
            </span>
            <span className="text-xs text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              <span>{language === 'ta' ? 'கணக்கீடு' : 'Calculator'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="flex items-baseline justify-between">
            <div>
              <div className="text-2xl font-black text-emerald-700">₹39,800</div>
              <div className="text-[11px] text-stone-500 font-medium">
                {language === 'ta' ? 'ஏக்கருக்கு நிகர லாபம் (Est.)' : 'Net Profit / Acre (CR 1009)'}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm font-bold text-stone-800">2.8 {language === 'ta' ? 'டன்' : 'tonnes'}</div>
              <div className="text-[10px] text-stone-500">{language === 'ta' ? 'எதிர்பார்க்கப்படும் மகசூல்' : 'Expected Yield'}</div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-stone-100 text-xs">
            <div className="bg-stone-50 p-1.5 rounded-lg text-stone-600">
              <span className="block text-[10px] text-stone-400">{language === 'ta' ? 'செலவு' : 'Total Cost'}</span>
              <span className="font-bold text-stone-800">₹26,000</span>
            </div>
            <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-800">
              <span className="block text-[10px] text-emerald-600">{language === 'ta' ? 'வருவாய்' : 'Gross Revenue'}</span>
              <span className="font-bold text-emerald-900">₹65,800</span>
            </div>
          </div>
        </div>

        {/* Card 7: Field GPS Location & Land Tracker */}
        <div
          onClick={() => onNavigate('location-tracker')}
          className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs hover:shadow-md transition-all cursor-pointer group bg-gradient-to-b from-white to-emerald-50/20"
        >
          <div className="flex items-center justify-between mb-3">
            <span className="font-extrabold text-sm text-emerald-900 flex items-center gap-2">
              <Crosshair className="w-4 h-4 text-emerald-600 animate-pulse" />
              <span>{language === 'ta' ? 'கள GPS அமைவிடம்' : 'Field GPS Location'}</span>
            </span>
            <span className="text-xs text-emerald-700 font-bold group-hover:translate-x-0.5 transition-transform flex items-center">
              <span>{language === 'ta' ? 'டிராக்கர்' : 'Tracker'}</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-baseline justify-between">
              <div>
                <div className="text-base sm:text-lg font-black text-stone-900 font-mono">
                  {gpsCoords.latitude.toFixed(4)}° N, {gpsCoords.longitude.toFixed(4)}° E
                </div>
                <div className="text-[11px] text-emerald-800 font-bold">
                  {addressDetails.village.split('(')[0]} • {addressDetails.taluk}
                </div>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-extrabold">
                ±{gpsCoords.accuracy}m
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-stone-100 text-xs">
              <div className="bg-stone-50 p-1.5 rounded-lg text-stone-600">
                <span className="block text-[10px] text-stone-400">{language === 'ta' ? 'அருகிலுள்ள மண்டி' : 'Nearest Mandi'}</span>
                <span className="font-bold text-stone-800">{nearestFacility?.distanceKm || 1.8} km</span>
              </div>
              <div className="bg-emerald-50 p-1.5 rounded-lg text-emerald-800">
                <span className="block text-[10px] text-emerald-600">{language === 'ta' ? 'அளவீடு செய்த பரப்பு' : 'Boundary Area'}</span>
                <span className="font-bold text-emerald-900">{fieldBoundary.acres} ac ({fieldBoundary.cents}ct)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. DEDICATED SMART IRRIGATION SECTION (Visible, Functional & Accessible) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-cyan-200 shadow-sm space-y-5 bg-gradient-to-br from-white via-cyan-50/20 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-cyan-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center shadow-xs">
                <Droplets className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                {language === 'ta' ? 'நுண்ணறிவு பாசன மேலாண்மை (Smart Irrigation)' : 'Smart Irrigation & Water Management'}
              </h3>
              <span className="bg-cyan-100 text-cyan-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-cyan-200">
                Live Sensor
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {language === 'ta'
                ? 'மண் ஈரப்பதம், மழை கணிப்பு மற்றும் மாற்று ஈரப்படுத்துதல் & உலர்த்துதல் (AWD) நேரலை பாசன வழிகாட்டி'
                : 'Real-time precision soil moisture, AWD cycle tracking, and remote motor pump control'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('irrigation')}
            className="inline-flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <span>{language === 'ta' ? 'முழு பாசன வழிகாட்டி & அட்டவணை' : 'Open Full Irrigation Schedule'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Irrigation notice banner when toggled */}
        {irrigationNotice && (
          <div className="p-3 bg-cyan-100 border border-cyan-300 rounded-xl text-xs font-semibold text-cyan-900 flex items-center gap-2 animate-in fade-in">
            <Waves className="w-4 h-4 text-cyan-700 animate-pulse" />
            <span>{irrigationNotice}</span>
          </div>
        )}

        {/* 4 Interactive Irrigation Status Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
          {/* Card 1: Soil Moisture Gauge */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-cyan-600" />
                <span>{language === 'ta' ? 'மண் ஈரப்பதம்' : 'Soil Moisture'}</span>
              </span>
              <span className="text-[10px] font-extrabold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                {language === 'ta' ? 'போதுமானது' : 'Optimal'}
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-cyan-800">{soilMoisture}%</span>
              <span className="text-xs text-stone-500 font-medium">/ 100%</span>
            </div>

            <div className="w-full bg-stone-200 h-2.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-cyan-400 to-cyan-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${soilMoisture}%` }}
              />
            </div>
            <span className="text-[10px] text-stone-500 mt-2 block">
              {language === 'ta' ? 'வரம்பு: 60% - 80% உகந்த வளர்ச்சிக்கு' : 'Target: 60% - 80% for tillering'}
            </span>
          </div>

          {/* Card 2: Interactive Pump Control Switch */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <Power className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'ta' ? 'மோட்டார் பாசன சுவிட்ச்' : 'Pump Control'}</span>
              </span>
              {/* Mode switch button */}
              <button
                onClick={() => setIrrigationMode(irrigationMode === 'auto' ? 'manual' : 'auto')}
                className="text-[10px] font-bold text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded hover:bg-cyan-200"
                title="Switch Auto/Manual"
              >
                {irrigationMode === 'auto' ? (language === 'ta' ? 'தானியங்கி' : 'Auto') : (language === 'ta' ? 'கைமுறை' : 'Manual')}
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <span className={`text-base font-black ${isPumpOn ? 'text-emerald-700' : 'text-stone-700'}`}>
                  {isPumpOn
                    ? (language === 'ta' ? 'தண்ணீர் பாய்கிறது' : 'Pump ON (Flowing)')
                    : (language === 'ta' ? 'மோட்டார் நிறுத்தம்' : 'Pump OFF (Idle)')}
                </span>
                <span className="text-[10px] text-stone-500 block">{lastWateredTime}</span>
              </div>

              {/* Functional interactive Pump Toggle Button */}
              <button
                onClick={handleTogglePump}
                className={`p-3 rounded-xl font-bold flex items-center gap-1.5 transition-all shadow-xs ${
                  isPumpOn
                    ? 'bg-emerald-600 text-white hover:bg-emerald-700 ring-2 ring-emerald-300'
                    : 'bg-stone-200 text-stone-700 hover:bg-stone-300'
                }`}
                title={isPumpOn ? 'Turn Pump Off' : 'Turn Pump On'}
              >
                <Power className={`w-4 h-4 ${isPumpOn ? 'animate-pulse' : ''}`} />
                <span className="text-xs">{isPumpOn ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            <span className="text-[10px] text-stone-500 mt-2 block">
              {isPumpOn
                ? (language === 'ta' ? '● வயலில் தண்ணீர் பாய்ந்து கொண்டிருக்கிறது' : '● Water actively filling field')
                : (language === 'ta' ? '○ மோட்டார் நிறுத்தப்பட்டுள்ளது' : '○ Standby mode')}
            </span>
          </div>

          {/* Card 3: AWD Water Depth Level */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 flex flex-col justify-between">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1.5">
                <Waves className="w-3.5 h-3.5 text-cyan-600" />
                <span>{language === 'ta' ? 'AWD நீர் மட்டம்' : 'AWD Water Depth'}</span>
              </span>
              <span className="text-[10px] font-bold bg-cyan-100 text-cyan-800 px-2 py-0.5 rounded">
                2.5 cm
              </span>
            </div>

            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-stone-900">{waterDepthCm}</span>
              <span className="text-xs text-stone-500 font-bold">{language === 'ta' ? 'செ.மீ (ஆழம்)' : 'cm depth'}</span>
            </div>

            <div className="w-full bg-stone-200 h-2.5 rounded-full mt-2 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '50%' }} />
            </div>

            <span className="text-[10px] text-stone-500 mt-2 block">
              {language === 'ta' ? 'பரிந்துரை: 2.5 செ.மீ மெல்லிய நீர் நிறுத்தம்' : 'Safe AWD thin water film'}
            </span>
          </div>

          {/* Card 4: Automated Weather Advisory */}
          <div className="bg-amber-50/70 p-4 rounded-2xl border border-amber-200 flex flex-col justify-between text-xs">
            <div className="flex items-center gap-1.5 text-amber-900 font-extrabold mb-1">
              <CloudSun className="w-4 h-4 text-amber-600" />
              <span>{language === 'ta' ? 'வானிலை பாசன ஆலோசனை' : 'Weather-Linked Advice'}</span>
            </div>

            <p className="text-stone-700 text-[11px] leading-relaxed my-1">
              {language === 'ta'
                ? 'அடுத்த 48 மணி நேரத்தில் 65% மழை வாய்ப்புள்ளதால் பாசனம் தேவையில்லை. 12,000 லிட்டர் தண்ணீர் சேமிக்கப்படுகிறது.'
                : '65% rain forecast in 48h. Irrigation postponed to save water and avoid fertilizer leaching.'}
            </p>

            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-[10px]">
              <span className="font-bold text-amber-800">{language === 'ta' ? 'அடுத்த பாசனம்:' : 'Next Irrigation:'}</span>
              <span className="font-bold text-stone-800">{language === 'ta' ? '2 நாட்கள் கழித்து' : 'In 2 days'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 2. DEDICATED CROP MANAGEMENT SECTION (Visible, Functional & Accessible) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-300 shadow-sm space-y-5 bg-gradient-to-br from-white via-emerald-50/20 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Sprout className="w-4 h-4" />
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                {language === 'ta' ? 'பயிர் மேலாண்மை & களப்பணி அட்டவணை' : 'Crop Management & Field Operations'}
              </h3>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200">
                Active Cycle
              </span>
            </div>
            <p className="text-xs text-stone-600">
              {language === 'ta'
                ? 'நடப்பு பயிர் வளர்ச்சி நிலைகள், இன்றைய விவசாயப் பணிகள் மற்றும் களக்குறிப்புகள்'
                : 'Current crop growth stages, today\'s agronomy tasks checklist, and field activity logs'}
            </p>
          </div>

          <button
            onClick={() => onNavigate('crop-management')}
            className="inline-flex items-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-xs transition-colors self-start sm:self-auto shrink-0"
          >
            <span>{language === 'ta' ? 'முழு பயிர் காலண்டர் & குறிப்புகள்' : 'Open Full Crop Management'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Growth Stage Progression Pipeline */}
        <div className="bg-emerald-950 text-white p-4 sm:p-5 rounded-2xl border border-emerald-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="text-[11px] text-emerald-300 font-bold uppercase tracking-wider block">
                {language === 'ta' ? 'பயிர் & பருவம்' : 'Active Crop & Phenology'}
              </span>
              <span className="text-base sm:text-lg font-black text-white">
                {farmer?.mainCrop || (language === 'ta' ? 'சம்பா நெல் (CR 1009 / பொன்னி)' : 'Samba Paddy (CR 1009)')}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs bg-emerald-800 text-emerald-200 font-bold px-3 py-1 rounded-full border border-emerald-700">
                {language === 'ta' ? 'நாள் 38 / 135 (தூர்க்கட்டும் பருவம்)' : 'Day 38 / 135 (Tillering Stage)'}
              </span>
            </div>
          </div>

          {/* 5-step visual pipeline */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-2 text-xs">
            <div className="p-2.5 rounded-xl bg-emerald-800/80 border border-emerald-600/60 text-emerald-100">
              <span className="text-[10px] text-emerald-300 font-bold block">1-25 {language === 'ta' ? 'நாள்' : 'days'}</span>
              <span className="font-extrabold text-white block">நாற்றங்கால் (Nursery)</span>
              <span className="text-[10px] text-emerald-300 flex items-center gap-1 mt-1">✓ {language === 'ta' ? 'முடிந்தது' : 'Done'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-amber-400 text-stone-950 font-bold shadow-md ring-2 ring-amber-300">
              <span className="text-[10px] text-stone-900 font-black block">26-55 {language === 'ta' ? 'நாள்' : 'days'}</span>
              <span className="font-black text-stone-950 block">தூர்க்கட்டு (Tillering)</span>
              <span className="text-[10px] text-stone-900 flex items-center gap-1 mt-1 font-black">● {language === 'ta' ? 'தற்போது நடப்பில்' : 'Current Stage'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-800 text-emerald-300">
              <span className="text-[10px] text-emerald-400 block">56-75 {language === 'ta' ? 'நாள்' : 'days'}</span>
              <span className="font-bold text-white block">கதிர் உருவாக்கம்</span>
              <span className="text-[10px] text-emerald-400 block mt-1">○ {language === 'ta' ? 'அடுத்து' : 'Upcoming'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-800 text-emerald-300">
              <span className="text-[10px] text-emerald-400 block">76-105 {language === 'ta' ? 'நாள்' : 'days'}</span>
              <span className="font-bold text-white block">மணி திரட்சி (Heading)</span>
              <span className="text-[10px] text-emerald-400 block mt-1">○ {language === 'ta' ? 'அடுத்து' : 'Upcoming'}</span>
            </div>

            <div className="p-2.5 rounded-xl bg-emerald-900/60 border border-emerald-800 text-emerald-300">
              <span className="text-[10px] text-emerald-400 block">106-135 {language === 'ta' ? 'நாள்' : 'days'}</span>
              <span className="font-bold text-white block">அறுவடை (Harvest)</span>
              <span className="text-[10px] text-emerald-400 block mt-1">○ {language === 'ta' ? 'அடுத்து' : 'Upcoming'}</span>
            </div>
          </div>
        </div>

        {/* 2 Columns: Today's Agronomy Checklist + Field Note Logger */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Column A: Interactive Checklist of Today's Field Operations */}
          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <CheckSquare className="w-4 h-4 text-emerald-700" />
                <span>{language === 'ta' ? 'இன்றைய களப்பணி சரிபார்ப்புப் பட்டியல் (Checklist)' : "Today's Field Action Items"}</span>
              </h4>
              <span className="text-[11px] font-bold text-stone-500">
                {cropTasks.filter((t) => t.done).length} / {cropTasks.length} {language === 'ta' ? 'முடிந்தது' : 'done'}
              </span>
            </div>

            <div className="space-y-2">
              {cropTasks.map((task) => (
                <div
                  key={task.id}
                  onClick={() => handleToggleTask(task.id)}
                  className={`p-3 rounded-xl border text-xs flex items-start gap-2.5 cursor-pointer transition-all ${
                    task.done
                      ? 'bg-emerald-50/80 border-emerald-200 text-stone-500'
                      : 'bg-white border-stone-200 text-stone-800 hover:border-emerald-300 shadow-2xs'
                  }`}
                >
                  <button
                    type="button"
                    className={`mt-0.5 w-4 h-4 rounded flex items-center justify-center shrink-0 border ${
                      task.done ? 'bg-emerald-600 border-emerald-600 text-white' : 'border-stone-400 bg-white'
                    }`}
                  >
                    {task.done && <CheckSquare className="w-3.5 h-3.5 text-white" />}
                  </button>
                  <span className={`flex-1 leading-snug ${task.done ? 'line-through text-stone-400' : 'font-semibold'}`}>
                    {language === 'ta' ? task.textTa : task.textEn}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Column B: Field Activity Log & Quick Add Note */}
          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-700" />
                  <span>{language === 'ta' ? 'விவசாயக் குறிப்புகள் (Field Activity Log)' : 'Field Activity Notes'}</span>
                </h4>
                <span className="text-[10px] text-stone-500">{activityNotes.length} notes</span>
              </div>

              <div className="space-y-1.5 max-h-36 overflow-y-auto">
                {activityNotes.map((note, idx) => (
                  <div key={idx} className="p-2 bg-white rounded-lg border border-stone-200 text-xs text-stone-700">
                    {note}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick Add Note Form */}
            <form onSubmit={handleAddActivityNote} className="flex gap-2 pt-2 border-t border-stone-200">
              <input
                type="text"
                value={newNoteInput}
                onChange={(e) => setNewNoteInput(e.target.value)}
                placeholder={language === 'ta' ? 'புதிய களக்குறிப்பை உள்ளிடுக...' : 'Add a quick agronomy note...'}
                className="flex-1 text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:outline-none focus:ring-1 focus:ring-emerald-600"
              />
              <button
                type="submit"
                disabled={!newNoteInput.trim()}
                className="bg-emerald-800 hover:bg-emerald-700 disabled:bg-stone-300 text-white font-bold px-3 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{language === 'ta' ? 'சேர்' : 'Save'}</span>
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 3. DEDICATED LOCATION TRACKING SYSTEM (Visible, Functional & Accessible) */}
      {/* ========================================================================= */}
      <section className="bg-white rounded-3xl p-5 sm:p-7 border-2 border-emerald-300 shadow-sm space-y-5 bg-gradient-to-br from-white via-emerald-50/20 to-white">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-100">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-8 h-8 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                <Crosshair className="w-4 h-4 text-amber-300 animate-pulse" />
              </span>
              <h3 className="text-lg sm:text-xl font-black text-stone-900">
                {language === 'ta'
                  ? 'கள GPS அமைவிடம் & நில அளவீடு (Location Tracking System)'
                  : 'Field GPS Location & Farm Land Tracking System'}
              </h3>
            </div>
            <p className="text-xs text-stone-600">
              {language === 'ta'
                ? 'நேரலை ஜிபிஎஸ் மூலம் உங்கள் வயல் எல்லைகளை அளவிட்டு, அருகிலுள்ள கொள்முதல் மண்டிகள் மற்றும் பூச்சித் தாக்குதல் தூரத்தைக் கண்காணிக்கவும்.'
                : 'Real-time GPS positioning, plot boundary acreage calculator, and nearest agri-facility routing.'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleToggleDashboardGps}
              className={`px-3.5 py-2 rounded-xl text-xs font-black flex items-center gap-1.5 transition-all shadow-xs active:scale-95 ${
                isGpsActive
                  ? 'bg-amber-400 hover:bg-amber-300 text-stone-950 ring-2 ring-amber-300'
                  : 'bg-emerald-700 hover:bg-emerald-600 text-white'
              }`}
            >
              <Navigation className={`w-3.5 h-3.5 ${isGpsActive ? 'animate-spin' : ''}`} />
              <span>
                {isGpsActive
                  ? language === 'ta' ? 'GPS இயங்குகிறது' : 'Live GPS ON'
                  : language === 'ta' ? 'GPS தொடங்கு' : 'Start Live GPS'}
              </span>
            </button>

            <button
              onClick={() => onNavigate('location-tracker')}
              className="px-3.5 py-2 bg-stone-100 hover:bg-emerald-100 text-emerald-900 font-bold rounded-xl text-xs flex items-center gap-1 transition-colors border border-stone-200"
            >
              <span>{language === 'ta' ? 'முழு வரைபடம்' : 'Full Map'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Pinned Feedback */}
        {pinnedToast && (
          <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-900 font-bold flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>
              {language === 'ta'
                ? 'வயல் அமைவிடம் உங்கள் கணக்கில் வெற்றிகரமாக பதிவு செய்யப்பட்டது!'
                : 'Farm GPS coordinates pinned and updated to your active farmer account!'}
            </span>
          </div>
        )}

        {/* GPS Live Positioning Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">
              {language === 'ta' ? 'அட்சரேகை (Latitude)' : 'Latitude'}
            </span>
            <span className="text-base sm:text-lg font-black text-stone-900 font-mono">
              {gpsCoords.latitude.toFixed(5)}° N
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              {addressDetails.taluk}
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">
              {language === 'ta' ? 'தீர்க்கரேகை (Longitude)' : 'Longitude'}
            </span>
            <span className="text-base sm:text-lg font-black text-stone-900 font-mono">
              {gpsCoords.longitude.toFixed(5)}° E
            </span>
            <span className="text-[10px] text-emerald-700 font-bold block mt-0.5">
              {addressDetails.basin.split('(')[0]}
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">
              {language === 'ta' ? 'GPS துல்லியம்' : 'GPS Accuracy'}
            </span>
            <span className="text-base sm:text-lg font-black text-emerald-700">
              ±{gpsCoords.accuracy} m
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              {language === 'ta' ? 'உயர் துல்லிய சிக்னல்' : 'High Precision Lock'}
            </span>
          </div>

          <div className="p-3.5 bg-stone-50 rounded-2xl border border-stone-200">
            <span className="text-[10px] font-bold text-stone-500 uppercase block">
              {language === 'ta' ? 'கிராமம் & மாவட்டம்' : 'Village & District'}
            </span>
            <span className="text-sm font-extrabold text-stone-900 truncate block">
              {addressDetails.village.split('(')[0]}
            </span>
            <span className="text-[10px] text-stone-500 block mt-0.5">
              {addressDetails.district.split('(')[0]}
            </span>
          </div>
        </div>

        {/* 2 Sub-panels: Field Boundary Acreage Walker + Proximity Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Sub-panel 1: Perimeter Walk & Acreage Measurement */}
          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <Footprints className="w-4 h-4 text-emerald-700" />
                <span>
                  {language === 'ta'
                    ? 'வயல் எல்லை & பரப்பு அளவீடு (Field Boundary)'
                    : 'Field Boundary & Acreage Calculator'}
                </span>
              </h4>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-md">
                Shoelace GPS GIS
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2 py-1 text-center">
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">
                  {language === 'ta' ? 'மொத்த பரப்பு' : 'Plot Area'}
                </span>
                <span className="text-lg font-black text-emerald-700">
                  {fieldBoundary.acres} ac
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">
                  {language === 'ta' ? 'சென்ட்' : 'Cents'}
                </span>
                <span className="text-lg font-black text-stone-900">
                  {fieldBoundary.cents} ct
                </span>
              </div>
              <div className="bg-white p-2.5 rounded-xl border border-stone-200">
                <span className="text-[10px] text-stone-500 block">
                  {language === 'ta' ? 'சுற்றளவு' : 'Perimeter'}
                </span>
                <span className="text-lg font-black text-stone-900">
                  {fieldBoundary.perimeterMeters} m
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between gap-2 pt-2 border-t border-stone-200">
              <button
                type="button"
                onClick={handleToggleDashboardWalk}
                className={`flex-1 py-2 px-3 rounded-xl text-xs font-black flex items-center justify-center gap-1.5 transition-all ${
                  isMeasuringWalk
                    ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-300'
                    : 'bg-emerald-800 hover:bg-emerald-700 text-white shadow-xs'
                }`}
              >
                <Footprints className="w-3.5 h-3.5" />
                <span>
                  {isMeasuringWalk
                    ? language === 'ta' ? 'எல்லை அளவீடு இயங்குகிறது' : 'Recording Boundary...'
                    : language === 'ta' ? 'எல்லையை சுற்றி அளவிடு' : 'Walk Field Boundary'}
                </span>
              </button>

              <button
                type="button"
                onClick={handlePinLocation}
                className="py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 border border-stone-300 rounded-xl text-xs font-bold transition-colors flex items-center gap-1"
                title="Save Location to Profile"
              >
                <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                <span>{language === 'ta' ? 'அமைவிடம் பதிவு செய்' : 'Pin to Profile'}</span>
              </button>
            </div>
          </div>

          {/* Sub-panel 2: Agricultural Proximity Radar */}
          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200 space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-stone-200">
              <h4 className="text-sm font-extrabold text-stone-900 flex items-center gap-2">
                <Compass className="w-4 h-4 text-emerald-700" />
                <span>
                  {language === 'ta'
                    ? 'அருகிலுள்ள விவசாய வசதிகள் & பூச்சி எச்சரிக்கை'
                    : 'Agri Facility & Outbreak Radar'}
                </span>
              </h4>
              <span className="text-[10px] text-stone-500 font-bold">
                {language === 'ta' ? 'நேரலை தூரம்' : 'Haversine GPS'}
              </span>
            </div>

            <div className="space-y-2">
              {/* Facility item */}
              <div className="p-2.5 bg-white rounded-xl border border-stone-200 flex items-center justify-between text-xs">
                <div>
                  <span className="font-extrabold text-stone-900 block">
                    {language === 'ta' ? nearestFacility?.nameTa : nearestFacility?.nameEn}
                  </span>
                  <span className="text-[10px] text-stone-500">
                    {language === 'ta' ? nearestFacility?.typeTa : nearestFacility?.typeEn}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-emerald-700 block">
                    {nearestFacility?.distanceKm || 1.8} km
                  </span>
                  <span className="text-[9px] text-stone-400 font-medium">
                    {language === 'ta' ? 'நேரடி தூரம்' : 'Direct distance'}
                  </span>
                </div>
              </div>

              {/* Outbreak radar item */}
              <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-amber-950 flex items-center gap-1">
                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                    <span>{language === 'ta' ? nearestOutbreak?.diseaseTa : nearestOutbreak?.diseaseEn}</span>
                  </span>
                  <span className="text-[10px] text-amber-800">
                    {nearestOutbreak?.locationName}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-black text-amber-800 block">
                    {nearestOutbreak?.distanceKm || 18.2} km
                  </span>
                  <span className="text-[9px] font-bold text-emerald-700">
                    {language === 'ta' ? 'பாதுகாப்பு மண்டலம்' : 'Safe buffer >15km'}
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-1 text-center">
              <button
                type="button"
                onClick={() => onNavigate('location-tracker')}
                className="text-xs font-bold text-emerald-800 hover:text-emerald-950 hover:underline inline-flex items-center gap-1"
              >
                <span>{language === 'ta' ? 'அனைத்து மண்டிகள் & ஆய்வக தூரத்தை காண்க →' : 'View all regional Mandis & Labs in GPS Tracker →'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Farmer Tool: Fertilizer Bag Dosage Calculator */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-2xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
              <h3 className="text-base sm:text-lg font-black text-stone-900">
                {language === 'ta'
                  ? 'உர மூட்டை அளவீட்டுக் கருவி (Fertilizer Bag Dosage in Real Bags)'
                  : 'Practical Fertilizer Dosage Calculator (in Bags for your Field)'}
              </h3>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              {language === 'ta'
                ? `உங்கள் ${acres} ஏக்கர் நிலத்திற்கு தேவையான உர மூட்டைகள் (TNAU பரிந்துரைப்படி)`
                : `Calculated exact 50kg/45kg bags required for your ${acres} acre plot`}
            </p>
          </div>

          {/* Stage selection tabs */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl gap-1 text-xs font-bold overflow-x-auto">
            <button
              onClick={() => setSelectedCropStage('basal')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCropStage === 'basal'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ta' ? 'அடி உரம்' : 'Basal'}
            </button>
            <button
              onClick={() => setSelectedCropStage('tillering')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCropStage === 'tillering'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ta' ? 'தூர்க்கட்டு (தற்போதைய)' : 'Tillering (Current)'}
            </button>
            <button
              onClick={() => setSelectedCropStage('panicle')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCropStage === 'panicle'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ta' ? 'கதிர் உருவாக்கம்' : 'Panicle'}
            </button>
            <button
              onClick={() => setSelectedCropStage('heading')}
              className={`px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap ${
                selectedCropStage === 'heading'
                  ? 'bg-white text-emerald-900 shadow-2xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              {language === 'ta' ? 'மணி திரட்சி' : 'Heading'}
            </button>
          </div>
        </div>

        {/* Selected Stage Output */}
        <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200/80 space-y-4">
          <div className="flex items-center justify-between">
            <span className="font-extrabold text-sm text-stone-900">
              {language === 'ta' ? currentDose.stageTa : currentDose.stageEn}
            </span>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded">
              {acres} {language === 'ta' ? 'ஏக்கருக்கு' : 'Acres'}
            </span>
          </div>

          {/* 3 Metric boxes */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 font-bold block uppercase">யூரியா (Urea 45kg)</span>
              <span className="text-xl font-black text-stone-900">{currentDose.ureaBags}</span>
              <span className="text-[10px] text-stone-400 block">{language === 'ta' ? 'மூட்டைகள்' : 'Bags'}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 font-bold block uppercase">டி.ஏ.பி (DAP 50kg)</span>
              <span className="text-xl font-black text-stone-900">{currentDose.dapBags}</span>
              <span className="text-[10px] text-stone-400 block">{language === 'ta' ? 'மூட்டைகள்' : 'Bags'}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 font-bold block uppercase">பொட்டாஷ் (MOP 50kg)</span>
              <span className="text-xl font-black text-stone-900">{currentDose.potashBags}</span>
              <span className="text-[10px] text-stone-400 block">{language === 'ta' ? 'மூட்டைகள்' : 'Bags'}</span>
            </div>

            <div className="bg-white p-3 rounded-xl border border-stone-200">
              <span className="text-[10px] text-stone-500 font-bold block uppercase">நுண்ணூட்டம் (Zinc/Gypsum)</span>
              <span className="text-xl font-black text-stone-900">{currentDose.zincKg}</span>
              <span className="text-[10px] text-stone-400 block">கிலோ (kg)</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-amber-950 flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <b>{language === 'ta' ? 'விவசாயிக்கு குறிப்பு: ' : 'Agronomy Tip: '}</b>
              {language === 'ta' ? currentDose.instructionsTa : currentDose.instructionsEn}
            </p>
          </div>
        </div>
      </div>

      {/* Field Card Modal Component */}
      <FarmerFieldCardModal
        isOpen={isFieldCardOpen}
        onClose={() => setIsFieldCardOpen(false)}
      />
    </div>
  );
};
