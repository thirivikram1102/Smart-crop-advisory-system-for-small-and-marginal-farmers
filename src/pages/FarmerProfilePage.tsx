import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { Language } from '../types';
import {
  User,
  Phone,
  Mail,
  MapPin,
  Tractor,
  Layers,
  Droplets,
  Sprout,
  ShieldCheck,
  Save,
  LogOut,
  CheckCircle2,
  AlertCircle,
  Globe,
  KeyRound,
  Calendar,
  Sparkles,
  ArrowLeft,
} from 'lucide-react';

interface FarmerProfilePageProps {
  onNavigate: (tab: string) => void;
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

const CROPS_LIST = [
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

export const FarmerProfilePage: React.FC<FarmerProfilePageProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { farmer, updateProfile, logout } = useAuth();

  const [name, setName] = useState(farmer?.name || 'Ravi Kumar');
  const [mobile, setMobile] = useState(farmer?.mobile || farmer?.phone || '9842176540');
  const [email, setEmail] = useState(farmer?.email || '');
  const [district, setDistrict] = useState(farmer?.district || 'Thanjavur');
  const [village, setVillage] = useState(farmer?.village || 'Thiruvaiyaru');
  const [farmSizeAcres, setFarmSizeAcres] = useState(farmer?.farmSizeAcres?.toString() || '2.5');
  const [soilType, setSoilType] = useState(farmer?.soilType || SOIL_TYPES[0].en);
  const [irrigationType, setIrrigationType] = useState(
    farmer?.irrigationType || farmer?.irrigationSource || IRRIGATION_TYPES[0].en
  );
  const [mainCrop, setMainCrop] = useState(farmer?.mainCrop || farmer?.mainCrops?.[0] || CROPS_LIST[0].en);
  const [prefLang, setPrefLang] = useState<Language>(farmer?.preferredLanguage || language);

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name.trim(),
      mobile: mobile.trim(),
      phone: mobile.trim(),
      email: email.trim() || undefined,
      district,
      village: village.trim(),
      farmSizeAcres: parseFloat(farmSizeAcres) || 2.5,
      soilType,
      irrigationType,
      irrigationSource: irrigationType,
      mainCrop,
      mainCrops: [mainCrop],
      preferredLanguage: prefLang,
    });

    if (prefLang !== language) {
      setLanguage(prefLang);
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  const handleLogout = () => {
    logout();
    onNavigate('login');
  };

  const auth = (t as any).auth || {};

  return (
    <div className="space-y-6 pb-12 animate-in fade-in">
      {/* Top Breadcrumb / Return to Dashboard */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => onNavigate('dashboard')}
          className="inline-flex items-center gap-2 text-xs font-bold text-emerald-800 hover:text-emerald-900 bg-white border border-stone-200 px-3 py-1.5 rounded-xl shadow-2xs hover:bg-stone-50 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{language === 'ta' ? 'களப்பலகைக்குத் திரும்பு' : 'Back to Dashboard'}</span>
        </button>

        <button
          onClick={() => setShowLogoutConfirm(true)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-rose-700 hover:text-rose-800 bg-rose-50 hover:bg-rose-100 border border-rose-200 px-3 py-1.5 rounded-xl transition-colors"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span>{auth.logoutButton || 'Log Out'}</span>
        </button>
      </div>

      {/* Hero Profile Banner */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-emerald-800 text-white rounded-3xl p-6 sm:p-8 shadow-md border border-emerald-600/30">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-5 text-center sm:text-left">
          {/* Large Farmer Avatar Icon */}
          <div className="relative">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-3xl bg-emerald-600 border-4 border-emerald-500/60 shadow-xl flex items-center justify-center text-white text-3xl font-black">
              {farmer?.name ? farmer.name[0].toUpperCase() : 'R'}
            </div>
            <div
              className="absolute -bottom-1 -right-1 bg-amber-400 text-stone-950 p-1.5 rounded-xl shadow-md border-2 border-emerald-800"
              title="Verified Farmer Profile"
            >
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>

          <div className="flex-1 space-y-1.5">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="bg-emerald-900/80 text-emerald-200 font-bold text-xs px-3 py-0.5 rounded-full border border-emerald-600/40">
                {farmer?.district || 'Thanjavur'} • {farmer?.village || 'Thiruvaiyaru'}
              </span>
              <span className="bg-amber-400/20 text-amber-300 font-semibold text-xs px-2.5 py-0.5 rounded-full border border-amber-400/30">
                {language === 'ta' ? 'உறுதிப்படுத்தப்பட்ட உழவர்' : 'Verified Farmer'}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-white">{farmer?.name || 'Ravi Kumar'}</h1>

            <p className="text-xs sm:text-sm text-emerald-100 max-w-xl">
              {language === 'ta'
                ? `${farmer?.farmSizeAcres || 2.5} ஏக்கர் பண்ணை நிலம் • ${farmer?.soilType?.split('(')[0] || 'களிமண் கலந்த வண்டல்'} • ${farmer?.mainCrop || 'சம்பா நெல்'}`
                : `${farmer?.farmSizeAcres || 2.5} Acres Farmland • ${farmer?.soilType?.split('(')[0] || 'Clay Loam'} • ${farmer?.mainCrop || 'Samba Paddy'}`}
            </p>

            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-emerald-200">
              <span className="flex items-center gap-1">
                <Phone className="w-3.5 h-3.5 text-amber-300" />
                <span>{farmer?.mobile || farmer?.phone || '9842176540'}</span>
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {language === 'ta' ? 'பதிவு செய்த நாள்:' : 'Registered:'} {farmer?.createdAt || '2026-01-10'}
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Success Notification */}
      {savedSuccess && (
        <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-2xl text-xs text-emerald-900 flex items-center gap-3 shadow-xs animate-in fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
          <div>
            <p className="font-bold">
              {language === 'ta' ? 'சுயவிவரம் வெற்றிகரமாக சேமிக்கப்பட்டது!' : 'Farm Profile Updated Successfully!'}
            </p>
            <p className="text-emerald-700">
              {language === 'ta'
                ? 'உங்கள் புதிய பண்ணை விவரங்களின்படி அனைத்து பயிர் மற்றும் பாசன ஆலோசனைகளும் உடனடியாக புதுப்பிக்கப்பட்டுள்ளன.'
                : 'All agro-climatic advisories, irrigation calculations, and weather forecasts are synchronized.'}
            </p>
          </div>
        </div>
      )}

      {/* Edit Form Card */}
      <form onSubmit={handleSave} className="bg-white rounded-3xl shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-5 sm:p-6 border-b border-stone-100 bg-stone-50 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Tractor className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm sm:text-base text-stone-900">
                {language === 'ta' ? 'பண்ணை மற்றும் உழவர் விவரங்கள்' : 'Farm Identity & Cultivation Profile'}
              </h2>
              <p className="text-[11px] text-stone-500">
                {language === 'ta'
                  ? 'துல்லியமான AI பயிர் ஆலோசனை பெற நில விவரங்களைச் சரிபார்க்கவும்'
                  : 'Maintain accurate farm data for personalized irrigation and advisory'}
              </p>
            </div>
          </div>

          <button
            type="submit"
            className="inline-flex items-center gap-2 py-2 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'சேமிக்கவும்' : 'Save Changes'}</span>
          </button>
        </div>

        <div className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Personal & Contact */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? '1. உழவர் தொடர்பு விவரங்கள்' : '1. Personal & Contact Information'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.farmerNameLabel || 'Farmer Full Name'}
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.mobileLabel || 'Contact Mobile Number'}
                </label>
                <input
                  type="tel"
                  maxLength={10}
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value.replace(/\D/g, ''))}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'மின்னஞ்சல் முகவரி (விருப்பப்பட்டால்)' : 'Email Address (Optional)'}
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="farmer@example.com"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.preferredLanguageLabel || 'Preferred Advisory Language'}
                </label>
                <select
                  value={prefLang}
                  onChange={(e) => setPrefLang(e.target.value as Language)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  <option value="ta">தமிழ் (Tamil)</option>
                  <option value="en">English</option>
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200" />

          {/* Section 2: Farm & Soil Parameters */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-3 flex items-center gap-1.5">
              <Tractor className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? '2. நிலம் & சாகுபடி பண்புகள்' : '2. Farmland & Crop Parameters'}</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.districtLabel || 'District in Tamil Nadu'}
                </label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  {TN_DISTRICTS.map((d) => (
                    <option key={d.en} value={d.en}>
                      {language === 'ta' ? `${d.ta} (${d.en})` : d.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.villageLabel || 'Village / Taluk'}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.farmSizeLabel || 'Farm Size (in Acres)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={farmSizeAcres}
                  onChange={(e) => setFarmSizeAcres(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.soilTypeLabel || 'Soil Type'}
                </label>
                <select
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  {SOIL_TYPES.map((s) => (
                    <option key={s.en} value={s.en}>
                      {language === 'ta' ? s.ta : s.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.irrigationTypeLabel || 'Primary Irrigation Method'}
                </label>
                <select
                  value={irrigationType}
                  onChange={(e) => setIrrigationType(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  {IRRIGATION_TYPES.map((i) => (
                    <option key={i.en} value={i.en}>
                      {language === 'ta' ? i.ta : i.en}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {auth.mainCropLabel || 'Primary Cultivated Crop'}
                </label>
                <select
                  value={mainCrop}
                  onChange={(e) => setMainCrop(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-300 rounded-xl text-sm font-medium focus:bg-white focus:border-emerald-600 focus:outline-none"
                >
                  {CROPS_LIST.map((c) => (
                    <option key={c.en} value={c.en}>
                      {language === 'ta' ? c.ta : c.en}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="border-t border-stone-200" />

          {/* Section 3: Architecture & Security status */}
          <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="text-xs font-bold text-stone-800">
                  {language === 'ta' ? 'அங்கீகார பாதுகாப்பு நிலை' : 'Authentication & Security Status'}
                </span>
              </div>
              <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                Active Session
              </span>
            </div>
            <p className="text-[11px] text-stone-500">
              {language === 'ta'
                ? 'உங்கள் கணக்கு Firebase & Supabase API தரநிலைப்படுத்தப்பட்ட அமர்வு மூலம் பாதுகாக்கப்பட்டுள்ளது.'
                : 'Session architecture standardized for Firebase & Supabase Auth with persistent local token management.'}
            </p>
          </div>

          {/* Actions bottom */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={() => onNavigate('dashboard')}
              className="py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
            >
              {language === 'ta' ? 'ரத்து செய்க' : 'Cancel'}
            </button>

            <button
              type="submit"
              className="inline-flex items-center gap-2 py-2.5 px-5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition-all"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ta' ? 'மாற்றங்களை சேமிக்கவும்' : 'Save Changes'}</span>
            </button>
          </div>
        </div>
      </form>

      {/* Logout Confirmation Modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border border-stone-200 space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
              <LogOut className="w-6 h-6" />
            </div>
            <div className="text-center">
              <h3 className="text-base font-extrabold text-stone-900">
                {language === 'ta' ? 'கணக்கிலிருந்து வெளியேறவா?' : 'Confirm Log Out'}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {auth.logoutConfirm || 'Are you sure you want to log out of your session?'}
              </p>
            </div>
            <div className="flex gap-2.5 pt-2">
              <button
                type="button"
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs rounded-xl transition-colors"
              >
                {language === 'ta' ? 'இல்லை, தொடர்க' : 'Cancel'}
              </button>
              <button
                type="button"
                onClick={handleLogout}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl transition-colors shadow-xs"
              >
                {language === 'ta' ? 'வெளியேறு' : 'Log Out'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
