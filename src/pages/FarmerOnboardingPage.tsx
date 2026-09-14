import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { FarmerOnboardingData, Language } from '../types';
import {
  Sprout,
  User,
  Phone,
  MapPin,
  Layers,
  Droplets,
  Tractor,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
} from 'lucide-react';

interface FarmerOnboardingPageProps {
  onComplete: () => void;
}

const TN_DISTRICTS = [
  { en: 'Thanjavur', ta: 'தஞ்சாவூர்' },
  { en: 'Tiruvarur', ta: 'திருவாரூர்' },
  { en: 'Nagapattinam', ta: 'நாகப்பட்டினம்' },
  { en: 'Mayiladuthurai', ta: 'மயிலாடுதுறை' },
  { en: 'Tiruchirappalli', ta: 'திருச்சிராப்பள்ளி' },
  { en: 'Madurai', ta: 'மதுரை' },
  { en: 'Coimbatore', ta: 'கோயம்புத்தூர்' },
  { en: 'Erode', ta: 'ஈரோடு' },
  { en: 'Salem', ta: 'சேலம்' },
  { en: 'Cuddalore', ta: 'கடலூர்' },
  { en: 'Tirunelveli', ta: 'திருநெல்வேலி' },
  { en: 'Villupuram', ta: 'விழுப்புரம்' },
  { en: 'Dindigul', ta: 'திண்டுக்கல்' },
  { en: 'Virudhunagar', ta: 'விருதுநகர்' },
  { en: 'Theni', ta: 'தேனி' },
  { en: 'Pudukkottai', ta: 'புதுக்கோட்டை' },
  { en: 'Dharmapuri', ta: 'தருமபுரி' },
  { en: 'Krishnagiri', ta: 'கிருஷ்ணகிரி' },
  { en: 'Vellore', ta: 'வேலூர்' },
  { en: 'Kanchipuram', ta: 'காஞ்சிபுரம்' },
  { en: 'Tiruvannamalai', ta: 'திருவண்ணாமலை' },
  { en: 'Ramanathapuram', ta: 'ராமநாதபுரம்' },
];

const SOIL_TYPES = [
  { en: 'Clay Loam (களிமண் கலந்த வண்டல் மண்)', ta: 'களிமண் கலந்த வண்டல் மண் (Clay Loam)' },
  { en: 'Alluvial Soil (டெல்டா வண்டல் மண்)', ta: 'வண்டல் மண் - டெல்டா (Alluvial)' },
  { en: 'Red Sandy Loam (செம்மண்)', ta: 'செம்மண் (Red Sandy Loam)' },
  { en: 'Black Cotton Soil (கரிசல் மண்)', ta: 'கரிசல் மண் (Black Cotton Soil)' },
  { en: 'Laterite Soil (சரளை மண்)', ta: 'சரளை மண் (Laterite Soil)' },
];

const IRRIGATION_TYPES = [
  { en: 'Borewell & Tube Well (ஆழ்துளை கிணறு)', ta: 'ஆழ்துளை கிணறு (Borewell)' },
  { en: 'Canal & River Irrigation (பாசன வாய்க்கால்)', ta: 'பாசன வாய்க்கால் (Canal Irrigation)' },
  { en: 'Drip & Micro-irrigation (சொட்டு நீர் பாசனம்)', ta: 'சொட்டு நீர் பாசனம் (Drip)' },
  { en: 'Open Farm Well (திறந்தவெளி கிணறு)', ta: 'திறந்தவெளி கிணறு (Open Well)' },
  { en: 'Rainfed & Dryland (மானாவாரி)', ta: 'மானாவாரி (Rainfed / Dryland)' },
];

const MAIN_CROPS = [
  { en: 'Samba Paddy (சம்பா நெல் - CR 1009/Ponni)', ta: 'சம்பா நெல் (CR 1009 / பொன்னி)' },
  { en: 'Kuruvai Paddy (குறுவை நெல் - ADT 43/CO 51)', ta: 'குறுவை நெல் (ADT 43 / CO 51)' },
  { en: 'Blackgram & Pulses (உளுந்து / பயறு)', ta: 'உளுந்து / பயறு வகைகள் (Blackgram)' },
  { en: 'Sugarcane (கரும்பு)', ta: 'கரும்பு (Sugarcane)' },
  { en: 'Cotton (பருத்தி)', ta: 'பருத்தி (Cotton)' },
  { en: 'Groundnut (மணிலா / நிலக்கடலை)', ta: 'நிலக்கடலை (Groundnut)' },
  { en: 'Banana (வாழை)', ta: 'வாழை (Banana)' },
  { en: 'Maize (மக்காச்சோளம்)', ta: 'மக்காச்சோளம் (Maize)' },
  { en: 'Vegetables (காய்கறிகள்)', ta: 'காய்கறிகள் (Vegetables)' },
  { en: 'Coconut (தென்னை)', ta: 'தென்னை (Coconut)' },
];

export const FarmerOnboardingPage: React.FC<FarmerOnboardingPageProps> = ({ onComplete }) => {
  const { language, setLanguage, t } = useLanguage();
  const { completeOnboarding, isLoading } = useAuth();

  const [name, setName] = useState('');
  const [mobile, setMobile] = useState('');
  const [district, setDistrict] = useState('Thanjavur');
  const [village, setVillage] = useState('');
  const [farmSizeAcres, setFarmSizeAcres] = useState('2.5');
  const [soilType, setSoilType] = useState(SOIL_TYPES[0].en);
  const [irrigationType, setIrrigationType] = useState(IRRIGATION_TYPES[0].en);
  const [mainCrop, setMainCrop] = useState(MAIN_CROPS[0].en);
  const [prefLang, setPrefLang] = useState<Language>(language);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = (t as any).auth || {};

  const validate = (): boolean => {
    const errs: Record<string, string> = {};
    if (!name.trim()) errs.name = auth.errRequiredField || 'Please enter farmer full name';
    
    const cleanMobile = mobile.trim();
    if (!cleanMobile) {
      errs.mobile = auth.errRequiredField || 'Please enter contact mobile number';
    } else if (!/^[6-9]\d{9}$/.test(cleanMobile)) {
      errs.mobile = auth.errInvalidIdentifier || 'Please enter valid 10-digit mobile number';
    }

    if (!village.trim()) errs.village = auth.errRequiredField || 'Please enter village or taluk';
    
    const sizeNum = parseFloat(farmSizeAcres);
    if (isNaN(sizeNum) || sizeNum <= 0) {
      errs.farmSize = language === 'ta' ? 'சரியான ஏக்கர் அளவை உள்ளிடவும் (எ.கா: 2.5)' : 'Please enter valid land size in acres';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    const data: FarmerOnboardingData = {
      name: name.trim(),
      mobile: mobile.trim(),
      district,
      village: village.trim(),
      farmSizeAcres: parseFloat(farmSizeAcres) || 2.5,
      soilType,
      irrigationType,
      mainCrop,
      preferredLanguage: prefLang,
    };

    // Update active language if changed
    if (prefLang !== language) {
      setLanguage(prefLang);
    }

    const res = await completeOnboarding(data);
    setIsSubmitting(false);

    if (res.success) {
      onComplete();
    } else {
      setErrors({ general: res.error || 'Failed to save farm profile. Please retry.' });
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-3 sm:px-6 py-8 sm:py-12">
      <div className="w-full max-w-2xl">
        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white p-6 sm:p-8 text-center relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600/60 border border-emerald-400/30 text-emerald-100 shadow-inner mb-3">
              <Tractor className="w-8 h-8 text-emerald-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {auth.onboardingTitle || 'Set Up Your Farm Profile'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-md mx-auto">
              {auth.onboardingSubtitle || 'Tell us about your land so our AI can provide customized advice'}
            </p>

            {/* Stepper indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 opacity-80 text-[11px] text-emerald-200 font-medium">
                <CheckCircle2 className="w-4 h-4 text-emerald-300" />
                <span>{language === 'ta' ? 'படி 1: கணக்கு முடிந்தது' : 'Step 1: Account Created'}</span>
              </div>
              <div className="w-4 border-t border-emerald-500/60" />
              <div className="flex items-center gap-1.5 bg-emerald-900/80 border border-emerald-500/40 rounded-full px-3 py-0.5 text-[11px] font-bold text-amber-300">
                <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[10px]">2</span>
                <span>{language === 'ta' ? 'படி 2: நில விவரங்கள்' : 'Step 2: Farm Profile'}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6 bg-stone-50/50">
            {errors.general && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
              {/* Farmer Name */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.farmerNameLabel || 'Farmer Full Name'}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors((prev) => ({ ...prev, name: '' }));
                  }}
                  placeholder={auth.farmerNamePlaceholder || 'e.g. Ravi Kumar / ரவி குமார்'}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                    errors.name ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 focus:border-emerald-600'
                  }`}
                />
                {errors.name && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.name}</p>}
              </div>

              {/* Mobile Number */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.mobileLabel || 'Contact Mobile Number'}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => {
                    setMobile(e.target.value.replace(/\D/g, ''));
                    if (errors.mobile) setErrors((prev) => ({ ...prev, mobile: '' }));
                  }}
                  placeholder={auth.mobilePlaceholder || '10-digit mobile number'}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                    errors.mobile ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 focus:border-emerald-600'
                  }`}
                />
                {errors.mobile && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.mobile}</p>}
              </div>

              {/* District */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.districtLabel || 'District in Tamil Nadu'}</span>
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-medium focus:border-emerald-600 focus:outline-none"
                >
                  {TN_DISTRICTS.map((d) => (
                    <option key={d.en} value={d.en}>
                      {language === 'ta' ? `${d.ta} (${d.en})` : d.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Village */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.villageLabel || 'Village / Taluk'}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => {
                    setVillage(e.target.value);
                    if (errors.village) setErrors((prev) => ({ ...prev, village: '' }));
                  }}
                  placeholder={auth.villagePlaceholder || 'e.g. Thiruvaiyaru'}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                    errors.village ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 focus:border-emerald-600'
                  }`}
                />
                {errors.village && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.village}</p>}
              </div>

              {/* Farm Size */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Tractor className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.farmSizeLabel || 'Farm Size (in Acres)'}</span>
                  <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  max="100"
                  value={farmSizeAcres}
                  onChange={(e) => {
                    setFarmSizeAcres(e.target.value);
                    if (errors.farmSize) setErrors((prev) => ({ ...prev, farmSize: '' }));
                  }}
                  placeholder={auth.farmSizePlaceholder || 'e.g. 2.5'}
                  className={`w-full px-3.5 py-2.5 bg-white border rounded-xl text-sm font-medium focus:outline-none transition-colors ${
                    errors.farmSize ? 'border-rose-400 focus:border-rose-500' : 'border-stone-300 focus:border-emerald-600'
                  }`}
                />
                {errors.farmSize && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.farmSize}</p>}
              </div>

              {/* Soil Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Layers className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.soilTypeLabel || 'Soil Type'}</span>
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-medium focus:border-emerald-600 focus:outline-none"
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s.en} value={s.en}>
                      {language === 'ta' ? s.ta : s.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Irrigation Type */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Droplets className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.irrigationTypeLabel || 'Primary Irrigation Method'}</span>
                </label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-medium focus:border-emerald-600 focus:outline-none"
                >
                  {IRRIGATION_TYPES.map((i) => (
                    <option key={i.en} value={i.en}>
                      {language === 'ta' ? i.ta : i.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Main Crop */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.mainCropLabel || 'Primary Cultivated Crop'}</span>
                </label>
                <select
                  value={mainCrop}
                  onChange={(e) => setMainCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-white border border-stone-300 rounded-xl text-sm font-medium focus:border-emerald-600 focus:outline-none"
                >
                  {MAIN_CROPS.map((c) => (
                    <option key={c.en} value={c.en}>
                      {language === 'ta' ? c.ta : c.en}
                    </option>
                  ))}
                </select>
              </div>

              {/* Preferred Language */}
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                  <Globe className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{auth.preferredLanguageLabel || 'Preferred Advisory Language'}</span>
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setPrefLang('ta')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      prefLang === 'ta'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span>தமிழ் (Tamil)</span>
                    {prefLang === 'ta' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                  <button
                    type="button"
                    onClick={() => setPrefLang('en')}
                    className={`py-2.5 px-4 rounded-xl border text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                      prefLang === 'en'
                        ? 'bg-emerald-700 text-white border-emerald-700 shadow-xs'
                        : 'bg-white text-stone-700 border-stone-300 hover:bg-stone-50'
                    }`}
                  >
                    <span>English</span>
                    {prefLang === 'en' && <CheckCircle2 className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-3.5 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{auth.completeRegistrationButton || 'Complete Farm Setup & Launch Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
              <p className="text-[11px] text-stone-500 text-center mt-2">
                {language === 'ta'
                  ? 'இந்த விவரங்கள் நீங்கள் பின்னர் எப்போது வேண்டுமானாலும் சுயவிவரப் பக்கத்தில் மாற்றிக்கொள்ளலாம்.'
                  : 'You can update these farm parameters anytime in your Profile & Account settings.'}
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
