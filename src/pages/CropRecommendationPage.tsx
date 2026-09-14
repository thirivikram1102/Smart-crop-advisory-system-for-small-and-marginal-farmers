import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { CropRecommendationInput, CropRecommendationResult } from '../types';
import { recommendCrops } from '../services/cropRecommendationService';
import {
  Sprout,
  Sparkles,
  Droplets,
  Coins,
  Calendar,
  Layers,
  ArrowRight,
  TrendingUp,
  CheckCircle2,
  Filter,
  Info,
} from 'lucide-react';

export const CropRecommendationPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { farmer } = useAuth();

  const [formData, setFormData] = useState<CropRecommendationInput>({
    soilType: farmer?.soilType?.includes('Clay') ? 'Clay Loam' : 'Red Sandy Loam',
    ph: 6.8,
    nitrogen: 85,
    phosphorus: 42,
    potassium: 54,
    temperature: 30,
    humidity: 75,
    rainfall: 850,
    season: 'Samba',
    district: farmer?.district || 'Thanjavur',
    village: farmer?.village || 'Thiruvaiyaru',
    availableWater: 'High',
    farmSize: farmer?.farmSizeAcres || 2.5,
    previousCrop: 'Paddy',
    irrigationType: 'Canal & Borewell',
    preferredCategory: 'All',
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CropRecommendationResult[] | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const recs = await recommendCrops(formData);
      setResults(recs);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Multi-Parameter Agro Decision System</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.cropRec.title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t.cropRec.subtitle}
          </p>
        </div>
      </div>

      {/* Input Parameters Form */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-stone-100 mb-6">
          <h2 className="text-base sm:text-lg font-black text-stone-900 flex items-center gap-2">
            <Filter className="w-5 h-5 text-emerald-600" />
            <span>
              {language === 'ta'
                ? 'உங்கள் நிலம் & பருவநிலை தகவல்கள்'
                : 'Field & Environmental Parameters'}
            </span>
          </h2>
          <span className="text-xs text-stone-500 hidden sm:inline">
            Auto-filled with your profile defaults
          </span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Row 1: Location & Soil */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.cropRec.district}
              </label>
              <input
                type="text"
                value={formData.district}
                onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.cropRec.village}
              </label>
              <input
                type="text"
                value={formData.village}
                onChange={(e) => setFormData({ ...formData, village: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.cropRec.soilType}
              </label>
              <select
                value={formData.soilType}
                onChange={(e) => setFormData({ ...formData, soilType: e.target.value })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Clay Loam">Clay Loam (களிமண் கலந்த வண்டல்)</option>
                <option value="Red Sandy Loam">Red Sandy Loam (செம்மண் மணற்பாங்கான மண்)</option>
                <option value="Alluvial">Alluvial (டெல்டா வண்டல் மண்)</option>
                <option value="Black Soil">Black Cotton Soil (கரிசல் மண்)</option>
                <option value="Laterite">Laterite Soil (செங்கல்படிவு மண்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.cropRec.soilPh}
              </label>
              <input
                type="number"
                step="0.1"
                min="4.5"
                max="9.0"
                value={formData.ph}
                onChange={(e) => setFormData({ ...formData, ph: parseFloat(e.target.value) || 7 })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Row 2: Soil Nutrients (NPK) */}
          <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
            <div className="text-xs font-black text-emerald-900 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-emerald-700" />
              <span>
                {language === 'ta'
                  ? 'மண் சத்துக்கள் (மண் பரிசோதனை அட்டை அடிப்படையில்)'
                  : 'Soil Nutrients (Soil Health Card Values)'}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.cropRec.nitrogen}
                </label>
                <input
                  type="number"
                  value={formData.nitrogen}
                  onChange={(e) => setFormData({ ...formData, nitrogen: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.cropRec.phosphorus}
                </label>
                <input
                  type="number"
                  value={formData.phosphorus}
                  onChange={(e) => setFormData({ ...formData, phosphorus: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {t.cropRec.potassium}
                </label>
                <input
                  type="number"
                  value={formData.potassium}
                  onChange={(e) => setFormData({ ...formData, potassium: parseInt(e.target.value) || 0 })}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
                />
              </div>
            </div>
          </div>

          {/* Row 3: Season & Water Availability */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.cropRec.season}
              </label>
              <select
                value={formData.season}
                onChange={(e) => setFormData({ ...formData, season: e.target.value as any })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Samba">Samba (சம்பா - Aug to Jan)</option>
                <option value="Kuruvai">Kuruvai (குறுவை - Jun to Sep)</option>
                <option value="Navarai">Navarai (நவரை - Dec to Mar)</option>
                <option value="Kharif">Kharif (காரிப் - Monsoon)</option>
                <option value="Rabi">Rabi (ரபி - Winter)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.cropRec.waterAvailability}
              </label>
              <select
                value={formData.availableWater}
                onChange={(e) => setFormData({ ...formData, availableWater: e.target.value as any })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="High">High (கால்வாய் & ஆழ்துளை நீர் நிறைவு)</option>
                <option value="Medium">Medium (மிதமான கிணற்று பாசனம்)</option>
                <option value="Low">Low (மானாவாரி / மழை சார்ந்தது)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.cropRec.farmSize}
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={formData.farmSize}
                onChange={(e) => setFormData({ ...formData, farmSize: parseFloat(e.target.value) || 1 })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1.5">
                {t.cropRec.preferredCategory}
              </label>
              <select
                value={formData.preferredCategory}
                onChange={(e) => setFormData({ ...formData, preferredCategory: e.target.value as any })}
                className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="All">All Categories (அனைத்து வகைகள்)</option>
                <option value="Cereals">Cereals / Paddy (தானியங்கள் & நெல்)</option>
                <option value="Pulses">Pulses (பயறு வகைகள்)</option>
                <option value="Vegetables">Vegetables (காய்கறிகள்)</option>
                <option value="Cash Crops">Cash Crops (பணப்பயிர்கள்)</option>
                <option value="Fruits">Fruits / Banana (பழப்பயிர்கள்)</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black px-8 py-3.5 rounded-2xl text-sm sm:text-base shadow-md transition-all hover:scale-102 active:scale-98 disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4 text-amber-300" />
              <span>{loading ? (language === 'ta' ? 'பகுப்பாய்வு செய்கிறது...' : 'Analyzing Agro Data...') : t.cropRec.submitBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>

      {/* Top 3 Ranked Recommendations */}
      {results && (
        <div className="space-y-6 animate-in fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                {t.cropRec.topPicks}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                {language === 'ta'
                  ? 'உங்கள் மண் கார அமிலத்தன்மை, சத்துக்கள் மற்றும் நீர் இருப்பிற்கான தரவரிசை'
                  : 'Ranked by suitability score and projected profitability for your soil health'}
              </p>
            </div>
            <span className="text-xs bg-emerald-100 text-emerald-800 font-bold px-3 py-1 rounded-full">
              {results.length} Crops Analyzed
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {results.slice(0, 3).map((crop, idx) => (
              <div
                key={crop.id}
                className={`bg-white rounded-3xl border overflow-hidden shadow-xs hover:shadow-lg transition-all flex flex-col justify-between ${
                  idx === 0
                    ? 'border-emerald-500 ring-2 ring-emerald-500/30'
                    : 'border-stone-200'
                }`}
              >
                {/* Crop Card Image & Suitability Badge */}
                <div className="relative h-44 overflow-hidden bg-stone-100">
                  <img
                    src={crop.image}
                    alt={crop.nameEn}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-3 left-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs font-black px-2.5 py-1 rounded-lg">
                    #{idx + 1} {idx === 0 ? (language === 'ta' ? 'முதலிடம்' : 'Top Match') : ''}
                  </div>
                  <div className="absolute top-3 right-3 bg-emerald-600 text-white text-xs font-extrabold px-3 py-1 rounded-full shadow">
                    {crop.suitabilityScore}% {language === 'ta' ? 'பொருத்தம்' : 'Suitability'}
                  </div>
                  <div className="absolute bottom-2 left-3 right-3 bg-stone-950/60 backdrop-blur-xs p-2 rounded-xl text-white">
                    <div className="font-black text-sm sm:text-base leading-tight">
                      {language === 'ta' ? crop.nameTa : crop.nameEn}
                    </div>
                    <div className="text-[11px] text-emerald-300 font-semibold">
                      {crop.suitableSeason} • {crop.durationDays} {language === 'ta' ? 'நாட்கள்' : 'days'}
                    </div>
                  </div>
                </div>

                {/* Economics & Yield Metrics */}
                <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                  <div className="grid grid-cols-2 gap-2 bg-stone-50 p-3 rounded-2xl border border-stone-100 text-xs">
                    <div>
                      <span className="text-[10px] text-stone-500 block">
                        {language === 'ta' ? 'மதிப்பிடப்பட்ட மகசூல்' : 'Expected Yield'}
                      </span>
                      <span className="font-extrabold text-stone-900 text-sm">
                        {crop.expectedYieldPerAcre} {crop.expectedYieldUnit}/acre
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-500 block">
                        {language === 'ta' ? 'லாபம் / ஏக்கர்' : 'Est. Profit/Acre'}
                      </span>
                      <span className="font-extrabold text-emerald-700 text-sm">
                        ₹{crop.estimatedProfitPerAcre.toLocaleString()}
                      </span>
                    </div>
                  </div>

                  <div>
                    <div className="text-xs font-bold text-stone-800 mb-1 flex items-center gap-1">
                      <Info className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{t.cropRec.reason}</span>
                    </div>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {language === 'ta' ? crop.reasonTa : crop.reasonEn}
                    </p>
                  </div>

                  {/* Key Cultural Practices */}
                  <div className="pt-2 border-t border-stone-100">
                    <div className="text-[11px] font-bold text-stone-700 mb-1.5">
                      {language === 'ta' ? 'முக்கிய சாகுபடி முறைகள்:' : 'Key Practices:'}
                    </div>
                    <ul className="text-xs text-stone-600 space-y-1">
                      {(language === 'ta' ? crop.keyPracticesTa : crop.keyPracticesEn).map(
                        (p, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                            <span>{p}</span>
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
