import React, { useState } from 'react';
import { useAlerts } from '../contexts/AlertsContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  BellRing,
  Send,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  Layers,
  Globe,
  Sprout,
  ShieldCheck,
  ToggleLeft,
  ToggleRight,
  Info,
} from 'lucide-react';
import { CROP_MATURITY_CATALOGUE } from '../services/harvestService';

export const PushNotificationSimulatorCard: React.FC = () => {
  const { language } = useLanguage();
  const {
    simulateDailyPushNotification,
    isPushSimulationActive,
    togglePushSimulation,
    browserPermission,
    requestBrowserPermission,
    trackedCrops,
  } = useAlerts();

  const [selectedSimCrop, setSelectedSimCrop] = useState<string>('auto');
  const [justSimulated, setJustSimulated] = useState(false);

  const handleTriggerSimulation = () => {
    const cropArg = selectedSimCrop === 'auto' ? undefined : selectedSimCrop;
    simulateDailyPushNotification(cropArg);
    setJustSimulated(true);
    setTimeout(() => setJustSimulated(false), 2500);
  };

  return (
    <div className="bg-gradient-to-br from-white via-emerald-50/40 to-stone-50 rounded-3xl p-5 sm:p-7 border border-emerald-200/90 shadow-sm space-y-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/70">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-2xl bg-emerald-800 text-white flex items-center justify-center shadow-xs">
            <BellRing className="w-5 h-5 text-amber-300 animate-bounce" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-black text-base sm:text-lg text-stone-900">
                {language === 'ta'
                  ? 'பயிர்க்கான தினசரி நோய் தடுப்பு புஷ் அறிவிப்பு சிமுலேட்டர்'
                  : 'Daily Crop Disease Prevention Push Simulator'}
              </h3>
              <span className="text-[10px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                Active
              </span>
            </div>
            <p className="text-xs text-stone-500 font-medium">
              {language === 'ta'
                ? 'உங்கள் டாஷ்போர்டில் கண்காணிக்கப்படும் குறிப்பிட்ட பயிர்களுக்கு ஏற்ப தினசரி நோய் தடுப்பு வழிகாட்டல்கள்'
                : 'Dispatches targeted prevention tips based on specific crops currently tracked in your dashboard'}
            </p>
          </div>
        </div>

        {/* Toggle switch for automated simulation */}
        <div className="flex items-center gap-2 self-start sm:self-auto bg-white px-3 py-1.5 rounded-xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-bold text-stone-700">
            {language === 'ta' ? 'தானியங்கி புஷ்:' : 'Auto Push:'}
          </span>
          <button
            onClick={togglePushSimulation}
            className="flex items-center text-xs font-black transition-colors"
            title="Toggle automated simulation"
          >
            {isPushSimulationActive ? (
              <span className="flex items-center gap-1 text-emerald-700">
                <ToggleRight className="w-6 h-6 fill-emerald-600" />
                <span>{language === 'ta' ? 'இயங்குகிறது' : 'Enabled'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-stone-400">
                <ToggleLeft className="w-6 h-6" />
                <span>{language === 'ta' ? 'முடக்கப்பட்டது' : 'Disabled'}</span>
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Currently Tracked Crops Ribbon */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-extrabold text-stone-700 flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>
              {language === 'ta'
                ? 'தற்போது டாஷ்போர்டில் கண்காணிக்கப்படும் பயிர்கள்:'
                : 'Currently Tracked Crops in Your Dashboard:'}
            </span>
          </span>
          <span className="text-stone-400 font-medium text-[11px]">
            {trackedCrops.length} {language === 'ta' ? 'பயிர்கள்' : 'active crops'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {trackedCrops.map((c, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-xs font-extrabold text-emerald-900 shadow-2xs"
            >
              <Sprout className="w-3.5 h-3.5 text-emerald-600" />
              <span>{c}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </span>
          ))}
        </div>
      </div>

      {/* Simulation Controls: Crop Choice & Trigger Button */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="w-full md:w-auto flex-1 space-y-1">
          <label className="block text-xs font-bold text-stone-700">
            {language === 'ta' ? 'குறிப்பிட்ட பயிருக்கு சிமுலேட் செய்:' : 'Simulate For Specific Crop:'}
          </label>
          <select
            value={selectedSimCrop}
            onChange={(e) => setSelectedSimCrop(e.target.value)}
            className="w-full text-xs font-bold p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-stone-50"
          >
            <option value="auto">
              ✨ {language === 'ta' ? 'தானாக கண்டறி (கண்காணிக்கப்படும் பயிர்கள்)' : 'Auto-Detect (From Active Tracked Crops)'}
            </option>
            {CROP_MATURITY_CATALOGUE.map((c) => (
              <option key={c.id} value={c.nameEn}>
                {language === 'ta' ? c.nameTa : c.nameEn} ({c.category})
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          <button
            onClick={handleTriggerSimulation}
            className={`flex-1 md:flex-initial inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl font-black text-xs shadow-md transition-all ${
              justSimulated
                ? 'bg-emerald-600 text-white scale-98'
                : 'bg-emerald-800 hover:bg-emerald-900 text-white hover:scale-102 active:scale-98'
            }`}
          >
            <Send className="w-4 h-4 text-lime-300" />
            <span>
              {justSimulated
                ? (language === 'ta' ? 'புஷ் அனுப்பப்பட்டது! ✓' : 'Push Notification Sent! ✓')
                : (language === 'ta' ? 'புஷ் அறிவிப்பை சிமுலேட் செய்' : 'Send Simulated Push Tip Now')}
            </span>
          </button>

          {/* Browser notification permission request */}
          {browserPermission !== 'granted' && (
            <button
              onClick={requestBrowserPermission}
              className="inline-flex items-center gap-1.5 px-3 py-3 rounded-xl border border-stone-300 bg-stone-50 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors"
              title="Enable OS/Browser Notifications"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span className="hidden sm:inline">
                {language === 'ta' ? 'பிரவுசர் புஷ் இயக்கு' : 'Allow Desktop Push'}
              </span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
