import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { IrrigationAdviceInput, IrrigationScheduleResult } from '../types';
import { calculateIrrigationSchedule } from '../services/irrigationService';
import {
  Droplets,
  Calendar,
  CloudRain,
  Clock,
  CheckCircle2,
  AlertCircle,
  Lightbulb,
  ArrowRight,
  Gauge,
} from 'lucide-react';

export const IrrigationPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { farmer } = useAuth();

  const [input, setInput] = useState<IrrigationAdviceInput>({
    crop: 'Paddy',
    growthStage: 'Tillering',
    soilType: 'Clay Loam',
    soilMoisturePct: 68,
    recentRainfallMm: 12,
    forecastRainPct: 65,
    temperatureC: 31,
    irrigationMethod: 'Flood / Alternate Wetting and Drying (AWD)',
  });

  const [advice, setAdvice] = useState<IrrigationScheduleResult>(() =>
    calculateIrrigationSchedule(input)
  );

  const handleRecalculate = (e: React.FormEvent) => {
    e.preventDefault();
    const res = calculateIrrigationSchedule(input);
    setAdvice(res);
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Droplets className="w-3.5 h-3.5 text-cyan-300" />
            <span>Precision Evapotranspiration & Water Balance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.irrigation.title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t.irrigation.subtitle}
          </p>
        </div>
      </div>

      {/* Input Parameters Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
          <Gauge className="w-5 h-5 text-cyan-600" />
          <span>
            {language === 'ta' ? 'பாசன சூழல் மற்றும் ஈரப்பதம்' : 'Field Moisture & Weather Settings'}
          </span>
        </h2>

        <form onSubmit={handleRecalculate} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.cropRec.crop}
              </label>
              <select
                value={input.crop}
                onChange={(e) => setInput({ ...input, crop: e.target.value })}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Paddy">Paddy (நெல்)</option>
                <option value="Tomato">Tomato (தக்காளி)</option>
                <option value="Banana">Banana (வாழை)</option>
                <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
                <option value="Cotton">Cotton (பருத்தி)</option>
                <option value="Maize">Maize (மக்காச்சோளம்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'ta' ? 'வளர்ச்சி பருவம்' : 'Growth Stage'}
              </label>
              <select
                value={input.growthStage}
                onChange={(e) => setInput({ ...input, growthStage: e.target.value })}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Vegetative / Seedling">Vegetative / Seedling (நாற்று)</option>
                <option value="Tillering">Tillering (தூர்க்கட்டும் பருவம்)</option>
                <option value="Panicle / Flowering">Panicle / Flowering (பூக்கும் பருவம்)</option>
                <option value="Grain filling / Fruiting">Grain filling / Fruiting (காய் பிடிக்கும் பருவம்)</option>
                <option value="Maturity / Ripening">Maturity (அறுவடைக்கு முந்தைய நிலை)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.cropRec.soilType}
              </label>
              <select
                value={input.soilType}
                onChange={(e) => setInput({ ...input, soilType: e.target.value })}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Clay Loam">Clay Loam (களிமண் கலந்த வண்டல்)</option>
                <option value="Red Sandy Loam">Red Sandy Loam (மணற்பாங்கான செம்மண்)</option>
                <option value="Black Soil">Black Soil (கரிசல்)</option>
                <option value="Alluvial">Alluvial (வண்டல்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'ta' ? 'பாசன முறை' : 'Irrigation Method'}
              </label>
              <select
                value={input.irrigationMethod}
                onChange={(e) => setInput({ ...input, irrigationMethod: e.target.value })}
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Flood / Alternate Wetting and Drying (AWD)">AWD / Flood (காய்ச்சலும் பாய்ச்சலும்)</option>
                <option value="Drip Irrigation">Drip Irrigation (சொட்டு நீர் பாசனம்)</option>
                <option value="Sprinkler">Sprinkler (தெளிப்பு நீர்)</option>
                <option value="Furrow">Furrow (பார் பாசனம்)</option>
              </select>
            </div>
          </div>

          {/* Sliders for Moisture and Forecast */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 bg-cyan-50/50 p-4 rounded-2xl border border-cyan-100">
            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1.5">
                <span>{language === 'ta' ? 'மண் ஈரப்பதம் (சென்சார் / கள ஆய்வு):' : 'Current Soil Moisture:'}</span>
                <span className="text-cyan-800 font-extrabold">{input.soilMoisturePct}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="100"
                value={input.soilMoisturePct}
                onChange={(e) => setInput({ ...input, soilMoisturePct: parseInt(e.target.value) })}
                className="w-full accent-cyan-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>வறண்ட நிலை (Dry)</span>
                <span>போதுமானது (Optimal)</span>
                <span>நிறைவு (Saturated)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-stone-700 mb-1.5">
                <span>{language === 'ta' ? 'அடுத்த 48 மணி நேர மழை வாய்ப்பு:' : 'Rainfall Forecast (Next 48h):'}</span>
                <span className="text-amber-700 font-extrabold">{input.forecastRainPct}%</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={input.forecastRainPct}
                onChange={(e) => setInput({ ...input, forecastRainPct: parseInt(e.target.value) })}
                className="w-full accent-amber-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-stone-500 mt-1">
                <span>மழை இல்லை (0%)</span>
                <span>மிதமான வாய்ப்பு (50%)</span>
                <span>கனமழை (100%)</span>
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="flex items-center gap-2 bg-cyan-700 hover:bg-cyan-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
            >
              <span>{language === 'ta' ? 'பாசன அட்டவணையை புதுப்பி' : 'Update Irrigation Advice'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Decision Output Card */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-md space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-800 bg-cyan-50 px-2.5 py-0.5 rounded-full border border-cyan-200">
              AI Smart Water Advisory
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
              {language === 'ta' ? advice.statusTa : advice.status}
            </h3>
            <p className="text-xs text-stone-600 mt-0.5">
              {language === 'ta' ? advice.reasonTa : advice.reasonEn}
            </p>
          </div>

          <div
            className={`px-4 py-2 rounded-2xl text-center font-extrabold text-sm ${
              advice.status === 'Postpone Irrigation'
                ? 'bg-amber-100 text-amber-900 border border-amber-300'
                : advice.status === 'Irrigate Now'
                ? 'bg-red-100 text-red-900 border border-red-300'
                : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
            }`}
          >
            {advice.status}
          </div>
        </div>

        {/* Schedule & Quantity Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1 font-semibold">
              <Calendar className="w-4 h-4 text-cyan-700" />
              <span>{t.irrigation.nextIrrigation}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-stone-900">
              {advice.nextDate}
            </div>
            <div className="text-[11px] text-stone-500 mt-1 flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'பரிந்துரைக்கப்பட்ட நேரம்: ' : 'Best time: '} {advice.recommendedTimeOfDay}</span>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1 font-semibold">
              <Droplets className="w-4 h-4 text-cyan-700" />
              <span>{t.irrigation.waterVolume}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-stone-900">
              {advice.waterVolumeLitersPerAcre.toLocaleString()} Liters / acre
            </div>
            <div className="text-[11px] text-stone-500 mt-1">
              Depth equivalent: <b>{advice.waterDepthMm} mm</b>
            </div>
          </div>

          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200">
            <div className="flex items-center gap-2 text-stone-500 text-xs mb-1 font-semibold">
              <CloudRain className="w-4 h-4 text-amber-600" />
              <span>{t.irrigation.rainForecast}</span>
            </div>
            <div className="text-base sm:text-lg font-black text-stone-900">
              {advice.rainProbabilityPct}% Probability
            </div>
            <div className="text-[11px] text-emerald-700 font-semibold mt-1">
              Estimated saving: ~{advice.savingLitres.toLocaleString()} L
            </div>
          </div>
        </div>

        {/* Agronomic Water-Saving Tips */}
        <div className="bg-cyan-50/50 p-4 sm:p-5 rounded-2xl border border-cyan-200 space-y-2.5">
          <h4 className="font-extrabold text-xs sm:text-sm text-cyan-950 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-amber-500" />
            <span>{t.irrigation.waterSavingTips}</span>
          </h4>
          <ul className="text-xs text-stone-700 space-y-2">
            {(language === 'ta' ? advice.tipsTa : advice.tipsEn).map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-cyan-700 shrink-0 mt-0.5" />
                <span>{tip}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
