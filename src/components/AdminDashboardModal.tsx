import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlerts } from '../contexts/AlertsContext';
import {
  ShieldCheck,
  X,
  Users,
  AlertTriangle,
  Send,
  PlusCircle,
  Activity,
  CheckCircle,
  MapPin,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AdminDashboardModal: React.FC<AdminDashboardModalProps> = ({ isOpen, onClose }) => {
  const { language } = useLanguage();
  const { alerts, addDiseaseAlert } = useAlerts();

  const [diseaseEn, setDiseaseEn] = useState('Fall Armyworm (படைப்புழு)');
  const [diseaseTa, setDiseaseTa] = useState('மக்காச்சோள படைப்புழு தாக்குதல்');
  const [cropEn, setCropEn] = useState('Maize');
  const [cropTa, setCropTa] = useState('மக்காச்சோளம்');
  const [district, setDistrict] = useState('Perambalur');
  const [village, setVillage] = useState('Veppanthattai');
  const [severity, setSeverity] = useState<'Low' | 'Moderate' | 'High' | 'Severe'>('High');
  const [recommendationEn, setRecommendationEn] = useState(
    'Apply Bacillus thuringiensis (Bt) formulation @ 2g/liter in early whorl stage. Erect bird perches (10/acre).'
  );
  const [recommendationTa, setRecommendationTa] = useState(
    'சுழல் பருவத்தில் பேசிலஸ் துரிஞ்சியென்சிஸ் (Bt) தெளிக்கவும். ஏக்கருக்கு 10 இடங்களில் பறவை தாங்கிகள் அமைக்கவும்.'
  );

  const [successMsg, setSuccessMsg] = useState(false);

  if (!isOpen) return null;

  const handlePublishAlert = (e: React.FormEvent) => {
    e.preventDefault();
    addDiseaseAlert({
      diseaseEn,
      diseaseTa,
      cropEn,
      cropTa,
      district,
      village,
      severity,
      activeCasesCount: 12,
      recommendationEn,
      recommendationTa,
    });
    setSuccessMsg(true);
    setTimeout(() => {
      setSuccessMsg(false);
    }, 4000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/70 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-emerald-900/10">
        {/* Header */}
        <div className="bg-emerald-950 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center shadow-inner">
              <ShieldCheck className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-base sm:text-lg">
                  {language === 'ta'
                    ? 'வட்டார வேளாண்மை விரிவாக்க அதிகாரி நிர்வாக பலகை'
                    : 'Block Agricultural Officer (ADA) Portal'}
                </h3>
                <span className="text-[10px] bg-emerald-700 text-emerald-200 px-2 py-0.5 rounded font-bold">
                  Govt / KVK Extension
                </span>
              </div>
              <p className="text-xs text-emerald-300">
                {language === 'ta'
                  ? 'கிராம நோய் பரவல் கண்காணிப்பு மற்றும் எச்சரிக்கை மேலாண்மை'
                  : 'Epidemiological Disease Surveillance & Village Outbreak Alert Dispatch'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-emerald-900 text-emerald-200 hover:text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 bg-stone-50">
          {/* Key Administrative Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
                <span>{language === 'ta' ? 'பதிவான விவசாயிகள்' : 'Total Farmers'}</span>
                <Users className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-xl font-black text-stone-900">1,248</div>
              <div className="text-[10px] text-emerald-600 font-semibold mt-0.5">
                +42 {language === 'ta' ? 'இந்த வாரம்' : 'this week'}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
                <span>{language === 'ta' ? 'இலை ஸ்கேன் பதிவுகள்' : 'Disease Reports'}</span>
                <Activity className="w-4 h-4 text-amber-500" />
              </div>
              <div className="text-xl font-black text-stone-900">184</div>
              <div className="text-[10px] text-amber-600 font-semibold mt-0.5">
                93.4% {language === 'ta' ? 'AI துல்லியம்' : 'AI Accuracy'}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
                <span>{language === 'ta' ? 'செயலில் உள்ள எச்சரிக்கை' : 'Active Alerts'}</span>
                <AlertTriangle className="w-4 h-4 text-red-500" />
              </div>
              <div className="text-xl font-black text-red-600">{alerts.length}</div>
              <div className="text-[10px] text-stone-500 font-semibold mt-0.5">
                {language === 'ta' ? '4 மாவட்டங்களில்' : 'Across 4 Districts'}
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs">
              <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
                <span>{language === 'ta' ? 'அதிக பாதிப்பு பயிர்' : 'Top Affected Crop'}</span>
                <TrendingUp className="w-4 h-4 text-emerald-600" />
              </div>
              <div className="text-base font-black text-stone-900 truncate">Paddy (நெல்)</div>
              <div className="text-[10px] text-stone-500 font-semibold mt-0.5">
                Thanjavur Delta
              </div>
            </div>
          </div>

          {/* Live Hosting & Production Deployment Status */}
          <div className="bg-white border-2 border-emerald-600/30 rounded-2xl p-4 sm:p-5 shadow-xs">
            <div className="flex items-center justify-between flex-wrap gap-2 mb-3">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h4 className="font-extrabold text-stone-900 text-sm sm:text-base">
                  {language === 'ta'
                    ? 'நேரலை ஹோஸ்டிங் & இணையதள இணைப்பு (Live Cloud Hosting)'
                    : 'Live Cloud Hosting & Production URLs'}
                </h4>
              </div>
              <span className="text-[10px] bg-emerald-100 text-emerald-900 font-black px-2 py-0.5 rounded-full uppercase">
                Active & Deployed
              </span>
            </div>

            <p className="text-xs text-stone-600 mb-3">
              {language === 'ta'
                ? 'உங்கள் செயலி கூகிள் கிளவுட் ரன் (Google Cloud Run) தளத்தில் உலகளவில் நேரடியாக செயல்படுகிறது. விவசாயிகள் எவ்வித நிறுவுதலும் இன்றி உடனடியாக தங்கள் மொபைலில் திறக்கலாம்.'
                : 'Your Smart Crop Advisory application is running live globally on Google Cloud Run with full high-availability.'}
            </p>

            <div className="space-y-2 bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pb-2 border-b border-stone-200">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">
                    {language === 'ta' ? 'பொது மக்கள் & விவசாயிகள் நேரலை இணைப்பு (Shared URL):' : 'Production Public URL:'}
                  </span>
                  <a
                    href="https://ais-pre-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline break-all"
                  >
                    https://ais-pre-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('https://ais-pre-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app');
                    alert(language === 'ta' ? 'இணைப்பு நகலெடுக்கப்பட்டது!' : 'Production link copied to clipboard!');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg shrink-0"
                >
                  {language === 'ta' ? 'இணைப்பை நகலெடு' : 'Copy Link'}
                </button>
              </div>

              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 pt-1">
                <div>
                  <span className="text-[10px] font-bold uppercase text-stone-400 block">
                    {language === 'ta' ? 'டெவலப்பர் நேரலை முன்னோட்டம் (Dev URL):' : 'Development Preview URL:'}
                  </span>
                  <a
                    href="https://ais-dev-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app"
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-bold hover:underline break-all"
                  >
                    https://ais-dev-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app
                  </a>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    navigator.clipboard.writeText('https://ais-dev-uuxjyxvakkyexju2vhj7gq-758296358394.asia-southeast1.run.app');
                    alert(language === 'ta' ? 'டெவ் இணைப்பு நகலெடுக்கப்பட்டது!' : 'Dev link copied to clipboard!');
                  }}
                  className="px-2.5 py-1 text-[11px] font-bold bg-white hover:bg-stone-100 text-stone-700 border border-stone-300 rounded-lg shrink-0"
                >
                  {language === 'ta' ? 'நகலெடு' : 'Copy'}
                </button>
              </div>
            </div>

            <div className="mt-3 text-[11px] text-stone-500 bg-emerald-50 p-2.5 rounded-lg border border-emerald-100 flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                {language === 'ta'
                  ? 'சொந்த இணையப் பெயரை (Custom Domain எ.கா. www.tncropadvisory.in) இணைக்க HOSTING.md வழிகாட்டியைப் பார்க்கவும்.'
                  : 'To link your own custom domain (e.g. www.tncropadvisory.in), point a CNAME to this Cloud Run URL.'}
              </span>
            </div>
          </div>

          {/* Outbreak Trigger Architecture Explanation */}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {language === 'ta'
                  ? 'கிராம அளவிலான நோய் அலர்ட் தானியங்கி வழிமுறை (Workflow):'
                  : 'Automated Epidemiological Outbreak Workflow:'}
              </p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                {language === 'ta'
                  ? 'விவசாயிகள் பதிவேற்றும் இலை பரிசோதனைகளில் ஒரே கிராமத்தில் 5-க்கும் மேற்பட்ட உறுதிப்படுத்தப்பட்ட பாதிப்புகள் பதிவாகும் போது, அப்பகுதி விவசாயிகளுக்கு தானியங்கி புஷ் எச்சரிக்கை மற்றும் தகுந்த தடுப்பு முறைகள் அனுப்பப்படும்.'
                  : 'When ≥5 confirmed farmer leaf diagnostic scans report the same pathogen within a single village cluster, an automatic outbreak alert is drafted for extension verification and broadcast to surrounding farmers.'}
              </p>
            </div>
          </div>

          {/* Form to dispatch official alert */}
          <div className="bg-white p-4 sm:p-5 rounded-2xl border border-stone-200 shadow-xs">
            <h4 className="font-bold text-sm text-stone-900 mb-3 flex items-center gap-1.5">
              <PlusCircle className="w-4 h-4 text-emerald-700" />
              <span>
                {language === 'ta'
                  ? 'புதிய சரிபார்க்கப்பட்ட நோய் எச்சரிக்கையை விவசாயிகளுக்கு அனுப்பு'
                  : 'Publish Verified Village Outbreak Alert to Farmers'}
              </span>
            </h4>

            {successMsg && (
              <div className="mb-4 p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-xs text-emerald-800 flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  {language === 'ta'
                    ? 'எச்சரிக்கை வெற்றிகரமாக வெளியிடப்பட்டு, பாதிக்கப்பட்ட விவசாயிகளுக்கு அறிவிக்கப்பட்டது!'
                    : 'Alert successfully published and broadcasted to local farmers!'}
                </span>
              </div>
            )}

            <form onSubmit={handlePublishAlert} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'நோய் பெயர் (English)' : 'Disease Name (English)'}
                  </label>
                  <input
                    type="text"
                    value={diseaseEn}
                    onChange={(e) => setDiseaseEn(e.target.value)}
                    required
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'நோய் பெயர் (தமிழ்)' : 'Disease Name (Tamil)'}
                  </label>
                  <input
                    type="text"
                    value={diseaseTa}
                    onChange={(e) => setDiseaseTa(e.target.value)}
                    required
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'பயிர்' : 'Affected Crop'}
                  </label>
                  <select
                    value={cropEn}
                    onChange={(e) => setCropEn(e.target.value)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Paddy">Paddy (நெல்)</option>
                    <option value="Tomato">Tomato (தக்காளி)</option>
                    <option value="Banana">Banana (வாழை)</option>
                    <option value="Maize">Maize (மக்காச்சோளம்)</option>
                    <option value="Cotton">Cotton (பருத்தி)</option>
                    <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'மாவட்டம்' : 'District'}
                  </label>
                  <input
                    type="text"
                    value={district}
                    onChange={(e) => setDistrict(e.target.value)}
                    required
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'கிராமம் / வட்டம்' : 'Village / Cluster'}
                  </label>
                  <input
                    type="text"
                    value={village}
                    onChange={(e) => setVillage(e.target.value)}
                    required
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    {language === 'ta' ? 'தீவிரம்' : 'Severity'}
                  </label>
                  <select
                    value={severity}
                    onChange={(e) => setSeverity(e.target.value as any)}
                    className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Low">Low (குறைவு)</option>
                    <option value="Moderate">Moderate (மிதம்)</option>
                    <option value="High">High (அதிதீவிரம்)</option>
                    <option value="Severe">Severe (அபாயம்)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">
                  {language === 'ta'
                    ? 'விவசாயிகளுக்கான பரிந்துரை (தமிழ்)'
                    : 'Advisory & Treatment Instructions (Tamil)'}
                </label>
                <textarea
                  rows={2}
                  value={recommendationTa}
                  onChange={(e) => setRecommendationTa(e.target.value)}
                  required
                  className="w-full text-xs p-2 rounded-lg border border-stone-300 focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-xs transition-colors"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>
                    {language === 'ta' ? 'அலர்ட் வெளியிடு' : 'Broadcast Verified Alert'}
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
