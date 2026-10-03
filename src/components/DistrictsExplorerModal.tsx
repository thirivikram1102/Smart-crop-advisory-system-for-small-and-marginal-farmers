import React, { useState, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { TN_38_DISTRICTS, DistrictDetail } from '../services/districtsData';
import {
  X,
  Search,
  MapPin,
  Compass,
  Droplets,
  CloudRain,
  Sprout,
  Store,
  Layers,
  ChevronRight,
  CheckCircle2,
  Navigation,
  Globe,
  SlidersHorizontal,
} from 'lucide-react';

interface DistrictsExplorerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectDistrict?: (districtName: string) => void;
}

export const DistrictsExplorerModal: React.FC<DistrictsExplorerModalProps> = ({
  isOpen,
  onClose,
  onSelectDistrict,
}) => {
  const { language } = useLanguage();
  const { farmer, updateProfile } = useAuth();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [selectedDistrict, setSelectedDistrict] = useState<DistrictDetail | null>(null);
  const [setSuccessToast, setSetSuccessToast] = useState<string | null>(null);

  // Extract unique zones
  const zones = useMemo(() => {
    const set = new Set<string>();
    TN_38_DISTRICTS.forEach((d) => set.add(d.zoneEn));
    return Array.from(set);
  }, []);

  // Filtered districts
  const filteredDistricts = useMemo(() => {
    return TN_38_DISTRICTS.filter((d) => {
      const matchesZone = selectedZone === 'all' || d.zoneEn === selectedZone;
      const q = searchQuery.toLowerCase().trim();
      if (!q) return matchesZone;

      const inName =
        d.en.toLowerCase().includes(q) ||
        d.ta.includes(q) ||
        d.capitalEn.toLowerCase().includes(q) ||
        d.capitalTa.includes(q);

      const inAreas = d.mainAreas.some(
        (a) =>
          a.en.toLowerCase().includes(q) ||
          a.ta.includes(q) ||
          (a.specialty && a.specialty.toLowerCase().includes(q))
      );

      const inCrops = d.majorCrops.some(
        (c) => c.en.toLowerCase().includes(q) || c.ta.includes(q)
      );

      return matchesZone && (inName || inAreas || inCrops);
    });
  }, [searchQuery, selectedZone]);

  if (!isOpen) return null;

  const handleSetUserDistrict = async (d: DistrictDetail) => {
    if (onSelectDistrict) {
      onSelectDistrict(d.en);
    }
    if (farmer) {
      await updateProfile({
        district: d.en,
        village: d.mainAreas[0] ? (language === 'ta' ? d.mainAreas[0].ta : d.mainAreas[0].en) : d.capitalEn,
      });
      setSetSuccessToast(
        language === 'ta'
          ? `${d.ta} மாவட்டம் உங்கள் பண்ணை இருப்பிடமாக புதுப்பிக்கப்பட்டது.`
          : `${d.en} set as your active farm district.`
      );
      setTimeout(() => setSetSuccessToast(null), 3000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 animate-in fade-in overflow-y-auto">
      <div className="bg-white rounded-3xl w-full max-w-5xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white p-5 sm:p-6 relative shrink-0">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-emerald-700/50 border border-emerald-400/30 text-amber-300 px-3 py-0.5 rounded-full text-xs font-black mb-2">
              <Compass className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'தமிழ்நாடு 38 மாவட்டங்கள் மற்றும் வட்டங்கள்' : 'Tamil Nadu 38 Districts & Agricultural Hubs'}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white">
              {language === 'ta' ? '38 மாவட்டங்கள் & முக்கிய பகுதிகள் அடைவு' : 'All 38 Districts & Main Areas Explorer'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1">
              {language === 'ta'
                ? 'தமிழ்நாட்டின் அனைத்து 38 மாவட்டங்களின் வட்டங்கள், பாசன ஆதாரங்கள், முதன்மை பயிர்கள் மற்றும் வேளாண் மண்டிகளை விரிவாக அறியலாம்.'
                : 'Comprehensive directory of all 38 districts of Tamil Nadu with their taluks, major crops, soil types, water basins, and regulated market hubs.'}
            </p>
          </div>
        </div>

        {/* Success toast */}
        {setSuccessToast && (
          <div className="bg-emerald-600 text-white px-4 py-2 text-xs font-bold text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{setSuccessToast}</span>
          </div>
        )}

        {/* Filter and Search Controls */}
        <div className="p-4 sm:p-5 border-b border-stone-200 bg-stone-50 space-y-3 shrink-0">
          <div className="flex flex-col sm:flex-row gap-3">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={
                  language === 'ta'
                    ? 'மாவட்டம், வட்டம், பகுதி அல்லது பயிர் தேடுக...'
                    : 'Search district, taluk, main area, or crop...'
                }
                className="w-full pl-9 pr-4 py-2.5 bg-white border border-stone-300 rounded-xl text-xs sm:text-sm font-medium focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-600 text-xs font-bold"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Zone Filter */}
            <div className="sm:w-64">
              <select
                value={selectedZone}
                onChange={(e) => setSelectedZone(e.target.value)}
                className="w-full py-2.5 px-3 bg-white border border-stone-300 rounded-xl text-xs font-bold text-stone-700 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
              >
                <option value="all">
                  {language === 'ta' ? 'அனைத்து மண்டலங்களும் (All Zones)' : 'All Agro-Climatic Zones (38)'}
                </option>
                {zones.map((z) => (
                  <option key={z} value={z}>
                    {z}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-1">
            <span>
              {language === 'ta'
                ? `காட்டப்படும் மாவட்டங்கள்: ${filteredDistricts.length} / 38`
                : `Showing ${filteredDistricts.length} of 38 Districts`}
            </span>
            {farmer && (
              <span className="text-emerald-800 font-bold flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                <span>
                  {language === 'ta' ? `தற்போதைய மாவட்டம்: ${farmer.district}` : `Your Active District: ${farmer.district}`}
                </span>
              </span>
            )}
          </div>
        </div>

        {/* Content Body: Split View (List + Detail Modal or Grid) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-stone-100 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredDistricts.map((district) => {
              const isSelected = selectedDistrict?.id === district.id;
              const isUserDistrict = farmer?.district.toLowerCase() === district.en.toLowerCase();

              return (
                <div
                  key={district.id}
                  className={`bg-white rounded-2xl border transition-all p-4 flex flex-col justify-between shadow-2xs hover:shadow-md ${
                    isUserDistrict
                      ? 'border-emerald-500 ring-2 ring-emerald-500/20'
                      : 'border-stone-200 hover:border-emerald-300'
                  }`}
                >
                  <div className="space-y-3">
                    {/* Top Row: Name + Zone Badge */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-base font-black text-stone-900 leading-tight">
                            {language === 'ta' ? district.ta : district.en}
                          </h3>
                          <span className="text-xs text-stone-500 font-semibold">
                            ({language === 'ta' ? district.en : district.ta})
                          </span>
                        </div>
                        <span className="text-[11px] text-emerald-800 font-semibold block mt-0.5">
                          HQ: {language === 'ta' ? district.capitalTa : district.capitalEn}
                        </span>
                      </div>

                      {isUserDistrict && (
                        <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-full shrink-0">
                          {language === 'ta' ? 'உங்கள் மாவட்டம்' : 'My Farm'}
                        </span>
                      )}
                    </div>

                    {/* Zone Badge */}
                    <div className="text-[11px] bg-stone-100 text-stone-700 px-2 py-1 rounded-lg font-medium inline-block">
                      {language === 'ta' ? district.zoneTa : district.zoneEn}
                    </div>

                    {/* Main Areas / Taluks List */}
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        {language === 'ta'
                          ? `முக்கிய பகுதிகள் & வட்டங்கள் (${district.mainAreas.length}):`
                          : `Main Areas & Taluks (${district.mainAreas.length}):`}
                      </span>
                      <div className="flex flex-wrap gap-1 max-h-24 overflow-y-auto">
                        {district.mainAreas.map((area, idx) => (
                          <span
                            key={idx}
                            className="text-[11px] bg-emerald-50/80 text-emerald-900 border border-emerald-200/70 px-2 py-0.5 rounded-md font-medium"
                            title={area.specialty || `${area.type} in ${district.en}`}
                          >
                            {language === 'ta' ? area.ta : area.en}
                            <span className="text-[9px] text-emerald-700 ml-1">({area.type})</span>
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Major Crops */}
                    <div className="pt-2 border-t border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-stone-500 block">
                        {language === 'ta' ? 'முக்கிய பயிர்கள்:' : 'Major Crops:'}
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {district.majorCrops.map((c, i) => (
                          <span
                            key={i}
                            className="text-[10px] bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded font-semibold"
                          >
                            {language === 'ta' ? c.ta : c.en}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Water & Soil Meta */}
                    <div className="grid grid-cols-2 gap-2 text-[10px] text-stone-600 pt-1">
                      <div className="flex items-center gap-1">
                        <CloudRain className="w-3 h-3 text-cyan-600 shrink-0" />
                        <span>{district.annualRainfallMm} mm {language === 'ta' ? 'மழை' : 'Rain'}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-blue-600 shrink-0" />
                        <span className="truncate">{language === 'ta' ? district.waterBasinTa : district.waterBasinEn}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-3 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSelectedDistrict(district)}
                      className="text-xs font-bold text-emerald-800 hover:text-emerald-950 flex items-center gap-1"
                    >
                      <span>{language === 'ta' ? 'முழு விவரம்' : 'Full Details'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => handleSetUserDistrict(district)}
                      className={`text-xs px-2.5 py-1 rounded-lg font-bold transition-all ${
                        isUserDistrict
                          ? 'bg-stone-200 text-stone-600 cursor-default'
                          : 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-2xs active:scale-95'
                      }`}
                    >
                      {isUserDistrict
                        ? language === 'ta' ? 'தேர்ந்தெடுக்கப்பட்டது' : 'Selected'
                        : language === 'ta' ? 'என் பண்ணை மாவட்டம்' : 'Set as My District'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredDistricts.length === 0 && (
            <div className="text-center py-12 bg-white rounded-2xl border border-stone-200 p-6 space-y-2">
              <Compass className="w-8 h-8 text-stone-400 mx-auto" />
              <h4 className="text-sm font-bold text-stone-800">
                {language === 'ta' ? 'மாவட்டங்கள் எதுவும் கிடைக்கவில்லை' : 'No matching districts found'}
              </h4>
              <p className="text-xs text-stone-500">
                {language === 'ta' ? 'வேறு தேடல் சொல்லை உள்ளிட்டு முயற்சிக்கவும்.' : 'Try changing your search term or zone filter.'}
              </p>
            </div>
          )}
        </div>

        {/* Detailed Modal Popup for selected district */}
        {selectedDistrict && (
          <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center p-3 animate-in fade-in">
            <div className="bg-white rounded-3xl max-w-2xl w-full max-h-[85vh] overflow-y-auto p-6 space-y-4 shadow-2xl relative border border-stone-200">
              <button
                onClick={() => setSelectedDistrict(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-stone-100 hover:bg-stone-200 text-stone-600"
              >
                <X className="w-4 h-4" />
              </button>

              <div className="space-y-1">
                <span className="text-xs font-bold text-emerald-700">
                  {language === 'ta' ? selectedDistrict.zoneTa : selectedDistrict.zoneEn}
                </span>
                <h3 className="text-2xl font-black text-stone-900">
                  {language === 'ta' ? selectedDistrict.ta : selectedDistrict.en}{' '}
                  <span className="text-base text-stone-500 font-normal">
                    ({language === 'ta' ? selectedDistrict.en : selectedDistrict.ta})
                  </span>
                </h3>
                <p className="text-xs text-stone-600">
                  {language === 'ta' ? selectedDistrict.specialtyTa : selectedDistrict.specialtyEn}
                </p>
              </div>

              {/* Grid of details */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs bg-stone-50 p-3 rounded-2xl border border-stone-200">
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Capital</span>
                  <span className="font-bold text-stone-800">
                    {language === 'ta' ? selectedDistrict.capitalTa : selectedDistrict.capitalEn}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Rainfall</span>
                  <span className="font-bold text-stone-800">{selectedDistrict.annualRainfallMm} mm/yr</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Net Cropped Area</span>
                  <span className="font-bold text-stone-800">{selectedDistrict.netCroppedAreaHa.toLocaleString()} Ha</span>
                </div>
                <div>
                  <span className="text-[10px] text-stone-500 block uppercase font-bold">Coordinates</span>
                  <span className="font-bold text-stone-800 font-mono text-[11px]">
                    {selectedDistrict.coordinates.lat.toFixed(2)}°N, {selectedDistrict.coordinates.lng.toFixed(2)}°E
                  </span>
                </div>
              </div>

              {/* Main Areas / Taluks Comprehensive Table */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800">
                  {language === 'ta' ? 'முக்கிய பகுதிகள், வட்டங்கள் மற்றும் மையங்கள்' : 'Taluks & Agricultural Main Areas'}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDistrict.mainAreas.map((area, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl border border-emerald-100 bg-emerald-50/50 flex flex-col justify-between"
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-extrabold text-emerald-950">
                          {language === 'ta' ? area.ta : area.en}
                        </span>
                        <span className="text-[10px] bg-emerald-200 text-emerald-900 px-1.5 py-0.5 rounded font-bold">
                          {area.type}
                        </span>
                      </div>
                      {area.specialty && (
                        <span className="text-[10px] text-stone-600 mt-1">
                          {area.specialty}
                        </span>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Mandis */}
              <div className="space-y-2">
                <h4 className="text-xs font-black uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-amber-600" />
                  <span>{language === 'ta' ? 'வேளாண் ஒழுங்குமுறை விற்பனைக்கூடங்கள் (Mandis)' : 'Regulated Agri Mandis & Markets'}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDistrict.keyMandis.map((m, i) => (
                    <div key={i} className="p-2.5 rounded-xl border border-amber-200 bg-amber-50/60 text-xs">
                      <div className="font-bold text-stone-900">
                        {language === 'ta' ? m.nameTa : m.nameEn}
                      </div>
                      <div className="text-[10px] text-stone-600 mt-0.5">{m.speciality}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action buttons */}
              <div className="pt-3 border-t border-stone-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedDistrict(null)}
                  className="px-4 py-2 border border-stone-300 rounded-xl text-xs font-bold text-stone-700 hover:bg-stone-100"
                >
                  {language === 'ta' ? 'மூடுக' : 'Close'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    handleSetUserDistrict(selectedDistrict);
                    setSelectedDistrict(null);
                  }}
                  className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl text-xs font-bold shadow-xs"
                >
                  {language === 'ta' ? 'இந்த மாவட்டத்தை என் பண்ணையாக தேர்வு செய்க' : 'Set as My Farm District'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
