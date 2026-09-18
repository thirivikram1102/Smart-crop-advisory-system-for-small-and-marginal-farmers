import React, { useState } from 'react';
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
} from 'lucide-react';

interface DashboardPageProps {
  onNavigate: (tabId: string) => void;
  onOpenVoiceModal: () => void;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({
  onNavigate,
  onOpenVoiceModal,
}) => {
  const { language, t } = useLanguage();
  const { farmer } = useAuth();
  const { alerts } = useAlerts();

  const [isFieldCardOpen, setIsFieldCardOpen] = useState(false);
  const [selectedCropStage, setSelectedCropStage] = useState<'basal' | 'tillering' | 'panicle' | 'heading'>('tillering');

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
                {farmer?.village || 'திருவையாறு'}, {farmer?.district || 'தஞ்சாவூர்'} • காவிரி டெல்டா
              </span>
              <span className="text-xs text-amber-300 font-bold flex items-center gap-1 bg-amber-950/40 px-2.5 py-1 rounded-full border border-amber-800/40">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>TNAU & KVK பரிந்துரை நெறிமுறை</span>
              </span>
            </div>

            <h2 className="text-xl sm:text-2xl lg:text-3xl font-black tracking-tight text-white">
              {language === 'ta'
                ? `வணக்கம், ${farmer?.name || 'ரவி குமார்'}!`
                : `Vanakkam, ${farmer?.name || 'Ravi Kumar'}!`}
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
            <span>{farmer?.district || 'Thanjavur'} Microclimate</span>
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
                {language === 'ta' ? 'சம்பா நெல் (CR 1009 / பொன்னி)' : 'Samba Paddy (CR 1009)'}
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
              <span>{nearbyAlert?.village}, {nearbyAlert?.district}</span>
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
              <span className="text-sm font-black text-cyan-700">72% (போதுமானது)</span>
            </div>
            {/* Visual Moisture Bar */}
            <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
              <div className="bg-cyan-500 h-full rounded-full" style={{ width: '72%' }} />
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
      </div>

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
