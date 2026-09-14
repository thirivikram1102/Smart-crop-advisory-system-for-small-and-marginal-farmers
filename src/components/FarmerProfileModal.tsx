import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  User,
  Phone,
  MapPin,
  Sprout,
  Droplets,
  Layers,
  X,
  CheckCircle,
  Save,
} from 'lucide-react';

interface FarmerProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FarmerProfileModal: React.FC<FarmerProfileModalProps> = ({ isOpen, onClose }) => {
  const { language, setLanguage, t } = useLanguage();
  const { farmer, updateFarmer } = useAuth();

  const [name, setName] = useState(farmer?.name || 'ரவி குமார் (Ravi Kumar)');
  const [phone, setPhone] = useState(farmer?.phone || '+91 98421 78945');
  const [district, setDistrict] = useState(farmer?.district || 'Thanjavur');
  const [village, setVillage] = useState(farmer?.village || 'Thiruvaiyaru');
  const [farmSize, setFarmSize] = useState(farmer?.farmSizeAcres || 2.5);
  const [soilType, setSoilType] = useState(farmer?.soilType || 'Clay Loam (களிமண் கலந்த வண்டல்)');
  const [irrigationSource, setIrrigationSource] = useState(
    farmer?.irrigationSource || 'Canal & Borewell'
  );
  const [currentCrop, setCurrentCrop] = useState(farmer?.currentCrop || 'Samba Paddy (CR 1009)');

  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateFarmer({
      name,
      phone,
      district,
      village,
      farmSizeAcres: farmSize,
      soilType,
      irrigationSource,
      currentCrop,
    });
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-xl max-h-[92vh] flex flex-col overflow-hidden border border-emerald-900/10">
        {/* Header */}
        <div className="bg-emerald-900 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-700 text-white flex items-center justify-center font-black">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-base sm:text-lg">
                {t.nav.profile}
              </h3>
              <p className="text-xs text-emerald-200">
                {language === 'ta'
                  ? 'உங்கள் நிலம் மற்றும் பண்ணை விவரங்களை புதுப்பிக்கவும்'
                  : 'Manage your farm identity and default agro parameters'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-emerald-800 text-emerald-100 hover:bg-emerald-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-4 bg-stone-50">
          {savedSuccess && (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600" />
              <span>
                {language === 'ta'
                  ? 'விவரங்கள் வெற்றிகரமாக சேமிக்கப்பட்டன!'
                  : 'Profile saved successfully!'}
              </span>
            </div>
          )}

          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 shadow-2xs">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'ta' ? 'விவசாயி பெயர்' : 'Farmer Name'}
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'அலைபேசி எண்' : 'Phone Number'}
                </label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full text-xs sm:text-sm p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'விருப்ப மொழி' : 'Language'}
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setLanguage('ta')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border ${
                      language === 'ta'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-stone-700 border-stone-300'
                    }`}
                  >
                    தமிழ்
                  </button>
                  <button
                    type="button"
                    onClick={() => setLanguage('en')}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border ${
                      language === 'en'
                        ? 'bg-emerald-700 text-white border-emerald-700'
                        : 'bg-white text-stone-700 border-stone-300'
                    }`}
                  >
                    English
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Farm Location & Characteristics */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 space-y-3 shadow-2xs">
            <h4 className="text-xs font-black text-stone-900 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-emerald-700" />
              <span>{language === 'ta' ? 'நிலம் மற்றும் பாசன அமைப்புகள்' : 'Land & Soil Profile'}</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ta' ? 'மாவட்டம்' : 'District'}
                </label>
                <input
                  type="text"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ta' ? 'கிராமம்' : 'Village'}
                </label>
                <input
                  type="text"
                  value={village}
                  onChange={(e) => setVillage(e.target.value)}
                  required
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ta' ? 'மொத்த நிலப்பரப்பு (ஏக்கர்)' : 'Farm Size (Acres)'}
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  value={farmSize}
                  onChange={(e) => setFarmSize(parseFloat(e.target.value) || 1)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ta' ? 'மண் வகை' : 'Soil Type'}
                </label>
                <input
                  type="text"
                  value={soilType}
                  onChange={(e) => setSoilType(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ta' ? 'பாசன ஆதாரம்' : 'Irrigation Source'}
                </label>
                <input
                  type="text"
                  value={irrigationSource}
                  onChange={(e) => setIrrigationSource(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ta' ? 'தற்போது சாகுபடி பயிர்' : 'Current Active Crop'}
                </label>
                <input
                  type="text"
                  value={currentCrop}
                  onChange={(e) => setCurrentCrop(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-6 py-2.5 rounded-xl text-xs sm:text-sm shadow-xs transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>{language === 'ta' ? 'விவரங்களை சேமி' : 'Save Farm Profile'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
