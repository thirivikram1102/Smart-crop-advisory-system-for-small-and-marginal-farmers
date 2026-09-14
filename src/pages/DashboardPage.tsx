import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertsContext';
import { QuickActionBanner } from '../components/QuickActionBanner';
import { DEMO_WEATHER } from '../services/marketWeatherService';
import {
  CloudSun,
  Sprout,
  AlertTriangle,
  Droplets,
  HeartPulse,
  TrendingUp,
  Calculator,
  Calendar,
  ChevronRight,
  ShieldCheck,
  CheckCircle2,
  Clock,
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

  const nearbyAlert = alerts[0];

  return (
    <div className="space-y-6 pb-6">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider bg-emerald-900/60 px-2.5 py-0.5 rounded-full text-emerald-200">
              {farmer?.district || 'Thanjavur'} • {farmer?.village || 'Thiruvaiyaru'}
            </span>
            <span className="text-xs text-amber-300 font-semibold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>KVK Verified</span>
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black">
            {language === 'ta'
              ? `வணக்கம், ${farmer?.name || 'ரவி குமார்'}`
              : `Vanakkam, ${farmer?.name || 'Ravi Kumar'}`}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-100">
            {language === 'ta'
              ? 'உங்கள் நிலத்தின் இன்றைய வானிலை, பாசன பரிந்துரை மற்றும் பயிர் கண்காணிப்பு தகவல்கள் தயார்.'
              : 'Real-time agro-climatic advisory, smart irrigation schedules, and local pest alerts.'}
          </p>
        </div>

        <div className="flex items-center gap-2 self-stretch sm:self-auto">
          <button
            onClick={onOpenVoiceModal}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-sm transition-transform active:scale-95"
          >
            <span>🎙 {language === 'ta' ? 'தமிழில் பேச' : 'Voice Assistant'}</span>
          </button>
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
    </div>
  );
};
