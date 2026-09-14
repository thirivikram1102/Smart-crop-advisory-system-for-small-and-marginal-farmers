import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlerts } from '../contexts/AlertsContext';
import {
  AlertOctagon,
  Filter,
  MapPin,
  Calendar,
  AlertTriangle,
  PlusCircle,
  ShieldCheck,
  Building,
  CheckCircle2,
} from 'lucide-react';

export const DiseaseAlertsPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { alerts, addDiseaseAlert } = useAlerts();

  const [selectedDistrict, setSelectedDistrict] = useState('All');
  const [selectedSeverity, setSelectedSeverity] = useState('All');
  const [selectedCrop, setSelectedCrop] = useState('All');

  const [showReportForm, setShowReportForm] = useState(false);
  const [newCrop, setNewCrop] = useState('Paddy');
  const [newDisease, setNewDisease] = useState('');
  const [newVillage, setNewVillage] = useState('');
  const [newDistrict, setNewDistrict] = useState('Thanjavur');
  const [newSeverity, setNewSeverity] = useState<'Low' | 'Moderate' | 'High' | 'Severe'>('Moderate');
  const [newRec, setNewRec] = useState('');

  const filteredAlerts = alerts.filter((item) => {
    if (selectedDistrict !== 'All' && item.district !== selectedDistrict) return false;
    if (selectedSeverity !== 'All' && item.severity !== selectedSeverity) return false;
    if (selectedCrop !== 'All' && item.cropEn !== selectedCrop) return false;
    return true;
  });

  const handleCreateReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDisease.trim() || !newVillage.trim()) return;

    addDiseaseAlert({
      diseaseEn: newDisease,
      diseaseTa: newDisease,
      cropEn: newCrop,
      cropTa: newCrop,
      district: newDistrict,
      village: newVillage,
      severity: newSeverity,
      activeCasesCount: 1,
      recommendationEn: newRec || 'Inspect fields and consult local agricultural officer.',
      recommendationTa: newRec || 'வயலை ஆய்வு செய்து வட்டார வேளாண் விரிவாக்க மையத்தில் தெரிவிக்கவும்.',
    });

    setShowReportForm(false);
    setNewDisease('');
    setNewVillage('');
    setNewRec('');
  };

  // District surveillance summary for Tamil Nadu
  const districtSummaries = [
    { name: 'Thanjavur (தஞ்சாவூர்)', outbreaks: 1, status: 'High', crop: 'Paddy' },
    { name: 'Dindigul (திண்டுக்கல்)', outbreaks: 1, status: 'High', crop: 'Tomato' },
    { name: 'Tiruchirappalli (திருச்சி)', outbreaks: 1, status: 'Moderate', crop: 'Banana' },
    { name: 'Villupuram (விழுப்புரம்)', outbreaks: 1, status: 'Moderate', crop: 'Groundnut' },
    { name: 'Madurai (மதுரை)', outbreaks: 0, status: 'Safe', crop: 'Cotton' },
    { name: 'Coimbatore (கோவை)', outbreaks: 0, status: 'Safe', crop: 'Vegetables' },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <AlertOctagon className="w-3.5 h-3.5 text-amber-300" />
            <span>Hyperlocal Plant Health Surveillance</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.alerts.title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t.alerts.subtitle}
          </p>
        </div>

        <button
          onClick={() => setShowReportForm(!showReportForm)}
          className="flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-4 py-2.5 rounded-xl text-xs sm:text-sm shadow-md transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{t.alerts.reportOutbreak}</span>
        </button>
      </div>

      {/* New Outbreak Form (Toggleable) */}
      {showReportForm && (
        <div className="bg-white rounded-3xl p-5 sm:p-7 border border-amber-300 shadow-md space-y-4 animate-in fade-in">
          <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>
              {language === 'ta'
                ? 'உங்கள் கிராமத்தில் தென்பட்ட புதிய நோய் பாதிப்பை பதிவு செய்க'
                : 'Report a Suspected Outbreak in Your Village'}
            </span>
          </h3>

          <form onSubmit={handleCreateReport} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'பயிர்' : 'Crop'}
                </label>
                <select
                  value={newCrop}
                  onChange={(e) => setNewCrop(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Paddy">Paddy (நெல்)</option>
                  <option value="Tomato">Tomato (தக்காளி)</option>
                  <option value="Banana">Banana (வாழை)</option>
                  <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
                  <option value="Cotton">Cotton (பருத்தி)</option>
                  <option value="Chilli">Chilli (மிளகாய்)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'நோய் அல்லது பூச்சி பெயர்' : 'Suspected Pest / Disease'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Leaf blast / Brown plant hopper"
                  value={newDisease}
                  onChange={(e) => setNewDisease(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'தீவிர நிலை' : 'Severity'}
                </label>
                <select
                  value={newSeverity}
                  onChange={(e) => setNewSeverity(e.target.value as any)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="Low">Low (குறைவு)</option>
                  <option value="Moderate">Moderate (மிதம்)</option>
                  <option value="High">High (அதிகம்)</option>
                  <option value="Severe">Severe (அபாயம்)</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'மாவட்டம்' : 'District'}
                </label>
                <input
                  type="text"
                  required
                  value={newDistrict}
                  onChange={(e) => setNewDistrict(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'கிராமம்' : 'Village'}
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Thiruvaiyaru / Kandiyur"
                  value={newVillage}
                  onChange={(e) => setNewVillage(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'ta' ? 'அறிகுறி அல்லது தீர்வு குறிப்பு' : 'Observation / Immediate Action Note'}
              </label>
              <textarea
                rows={2}
                value={newRec}
                onChange={(e) => setNewRec(e.target.value)}
                placeholder="Observed yellowing at stem bases across 4 nearby fields..."
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setShowReportForm(false)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-xs font-semibold text-stone-700 hover:bg-stone-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold shadow-xs"
              >
                {language === 'ta' ? 'பதிவு செய்க' : 'Submit Outbreak Alert'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tamil Nadu District Surveillance Heat Grid (Visual District Representation) */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-2xs space-y-4">
        <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
          <Building className="w-4 h-4 text-emerald-600" />
          <span>
            {language === 'ta'
              ? 'தமிழ்நாடு மாவட்ட அளவிலான நோய் பரவல் வரைபடம் / நிலை'
              : 'Tamil Nadu District Outbreak Surveillance Map Representation'}
          </span>
        </h3>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {districtSummaries.map((d, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between ${
                d.status === 'High'
                  ? 'bg-red-50 border-red-200 text-red-950'
                  : d.status === 'Moderate'
                  ? 'bg-amber-50 border-amber-200 text-amber-950'
                  : 'bg-emerald-50/70 border-emerald-200 text-emerald-950'
              }`}
            >
              <div>
                <div className="font-bold text-xs truncate">{d.name.split(' ')[0]}</div>
                <div className="text-[10px] opacity-75 mt-0.5">{d.crop}</div>
              </div>
              <div className="mt-3 flex items-center justify-between text-[11px] font-extrabold">
                <span className="text-[10px] uppercase">{d.status}</span>
                <span>{d.outbreaks} alert</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Filter Bar */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-2xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-600">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span>Filters:</span>
        </div>

        <select
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          className="text-xs p-2 rounded-lg border border-stone-300 bg-white"
        >
          <option value="All">All Districts (அனைத்து மாவட்டங்கள்)</option>
          <option value="Thanjavur">Thanjavur (தஞ்சாவூர்)</option>
          <option value="Dindigul">Dindigul (திண்டுக்கல்)</option>
          <option value="Tiruchirappalli">Tiruchirappalli (திருச்சி)</option>
          <option value="Villupuram">Villupuram (விழுப்புரம்)</option>
        </select>

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          className="text-xs p-2 rounded-lg border border-stone-300 bg-white"
        >
          <option value="All">All Severity (அனைத்து நிலைகள்)</option>
          <option value="High">High / Severe Only (அதிதீவிரம்)</option>
          <option value="Moderate">Moderate (மிதம்)</option>
          <option value="Low">Low (குறைவு)</option>
        </select>

        <select
          value={selectedCrop}
          onChange={(e) => setSelectedCrop(e.target.value)}
          className="text-xs p-2 rounded-lg border border-stone-300 bg-white"
        >
          <option value="All">All Crops (அனைத்து பயிர்கள்)</option>
          <option value="Paddy">Paddy (நெல்)</option>
          <option value="Tomato">Tomato (தக்காளி)</option>
          <option value="Banana">Banana (வாழை)</option>
          <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
        </select>
      </div>

      {/* Alert Cards List */}
      <div className="space-y-4">
        {filteredAlerts.length === 0 ? (
          <div className="bg-white p-8 rounded-3xl border border-stone-200 text-center text-stone-500 text-sm">
            {language === 'ta'
              ? 'தேர்ந்தெடுக்கப்பட்ட வடிகட்டிகளுக்கு எச்சரிக்கைகள் ஏதுமில்லை.'
              : 'No alerts match the selected criteria.'}
          </div>
        ) : (
          filteredAlerts.map((alert) => (
            <div
              key={alert.id}
              className="bg-white rounded-3xl p-5 sm:p-6 border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 ${
                      alert.severity === 'High' || alert.severity === 'Severe'
                        ? 'bg-red-100 text-red-700'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    <AlertTriangle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                      {language === 'ta' ? alert.diseaseTa : alert.diseaseEn}
                    </h3>
                    <div className="text-xs text-stone-500 flex items-center gap-1.5 mt-0.5">
                      <span className="font-semibold text-emerald-800">
                        {language === 'ta' ? alert.cropTa : alert.cropEn}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-0.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        {alert.village}, {alert.district}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 self-start sm:self-auto">
                  {alert.isVerifiedByOfficer && (
                    <span className="inline-flex items-center gap-1 bg-emerald-50 border border-emerald-200 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-600" />
                      <span>{language === 'ta' ? 'அதிகாரி சரிபார்த்தது' : 'Officer Verified'}</span>
                    </span>
                  )}
                  <span
                    className={`text-xs font-black px-2.5 py-0.5 rounded-full uppercase ${
                      alert.severity === 'High' || alert.severity === 'Severe'
                        ? 'bg-red-600 text-white'
                        : 'bg-amber-500 text-white'
                    }`}
                  >
                    {alert.severity}
                  </span>
                </div>
              </div>

              {/* Recommendation Body */}
              <div className="bg-stone-50 p-3.5 rounded-2xl border border-stone-200/80 text-xs sm:text-sm text-stone-700 leading-relaxed">
                <span className="font-bold text-stone-900 block mb-1">
                  {language === 'ta' ? 'உடனடி பாதுகாப்பு வழிகாட்டுதல்:' : 'Extension Treatment Guidance:'}
                </span>
                {language === 'ta' ? alert.recommendationTa : alert.recommendationEn}
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                <span>
                  {language === 'ta' ? 'பதிவான நாள்' : 'Reported'}: {alert.reportedDate}
                </span>
                <span className="font-semibold text-stone-700">
                  {alert.activeCasesCount} {language === 'ta' ? 'அருகாமை பண்ணைகள் கண்காணிப்பில்' : 'farms under surveillance'}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
