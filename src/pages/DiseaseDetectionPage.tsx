import React, { useState, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertsContext';
import { DiseasePrediction } from '../types';
import { detectPlantDisease } from '../services/diseaseDetectionService';
import {
  UploadCloud,
  Camera,
  X,
  Sparkles,
  ShieldAlert,
  AlertTriangle,
  CheckCircle2,
  Share2,
  RefreshCw,
  HelpCircle,
  FileText,
} from 'lucide-react';

export const DiseaseDetectionPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { farmer } = useAuth();
  const { addDiseaseAlert } = useAlerts();

  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [cropType, setCropType] = useState('Paddy (Rice)');
  const [analyzing, setAnalyzing] = useState(false);
  const [prediction, setPrediction] = useState<DiseasePrediction | null>(null);
  const [reportedSuccessfully, setReportedSuccessfully] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 8 * 1024 * 1024) {
      alert(language === 'ta' ? 'படத்தின் அளவு 8MB-க்கு குறைவாக இருக்க வேண்டும்.' : 'Image size must be under 8MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setSelectedImage(reader.result as string);
      setPrediction(null);
      setReportedSuccessfully(false);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedImage) return;
    setAnalyzing(true);
    setReportedSuccessfully(false);
    try {
      const result = await detectPlantDisease(selectedImage, cropType);
      setPrediction(result);
    } catch (err) {
      console.error(err);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClear = () => {
    setSelectedImage(null);
    setPrediction(null);
    setReportedSuccessfully(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';
  };

  const handleReportOutbreak = () => {
    if (!prediction) return;
    addDiseaseAlert({
      diseaseEn: prediction.detectedDiseaseEn,
      diseaseTa: prediction.detectedDiseaseTa,
      cropEn: prediction.crop,
      cropTa: prediction.cropTa,
      district: farmer?.district || 'Thanjavur',
      village: farmer?.village || 'Thiruvaiyaru',
      severity: prediction.severity,
      activeCasesCount: 1,
      recommendationEn: prediction.treatmentEn[0] || 'Inspect field foliage immediately.',
      recommendationTa: prediction.treatmentTa[0] || 'பயிர்களை ஆய்வு செய்து கட்டுப்படுத்தவும்.',
    });
    setReportedSuccessfully(true);
  };

  // Sample leaf images for quick demo testing
  const sampleImages = [
    {
      title: language === 'ta' ? 'மாதிரி 1: நெல் குலை நோய்' : 'Sample 1: Rice Blast',
      crop: 'Paddy (Rice)',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    },
    {
      title: language === 'ta' ? 'மாதிரி 2: தக்காளி இலை கருகல்' : 'Sample 2: Tomato Blight',
      crop: 'Tomato',
      url: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=400&q=80',
    },
  ];

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Multimodal Vision Plant Pathology</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.disease.title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t.disease.subtitle}
          </p>
        </div>
      </div>

      {/* Main Upload / Camera Area */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900">
              {language === 'ta' ? 'இலை புகைப்படத்தை பதிவேற்றவும்' : 'Upload Plant Leaf Photo'}
            </h2>
            <p className="text-xs text-stone-500">
              {t.disease.supportedCrops}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-700">{language === 'ta' ? 'பயிர் வகை:' : 'Crop:'}</span>
            <select
              value={cropType}
              onChange={(e) => setCropType(e.target.value)}
              className="text-xs font-semibold p-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
            >
              <option value="Paddy (Rice)">Paddy (நெல்)</option>
              <option value="Tomato">Tomato (தக்காளி)</option>
              <option value="Banana">Banana (வாழை)</option>
              <option value="Cotton">Cotton (பருத்தி)</option>
              <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
              <option value="Sugarcane">Sugarcane (கரும்பு)</option>
              <option value="Auto-detect">Auto-detect (தானியங்கி)</option>
            </select>
          </div>
        </div>

        {/* Hidden inputs */}
        <input
          type="file"
          ref={fileInputRef}
          accept="image/*"
          onChange={handleImageSelect}
          className="hidden"
        />
        <input
          type="file"
          ref={cameraInputRef}
          accept="image/*"
          capture="environment"
          onChange={handleImageSelect}
          className="hidden"
        />

        {/* Dropzone Box */}
        {!selectedImage ? (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="border-2 border-dashed border-stone-300 hover:border-emerald-600 rounded-3xl p-8 sm:p-12 text-center bg-stone-50/70 hover:bg-emerald-50/40 transition-colors cursor-pointer space-y-4"
          >
            <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 mx-auto flex items-center justify-center shadow-xs">
              <UploadCloud className="w-8 h-8" />
            </div>
            <div className="space-y-1">
              <p className="font-extrabold text-sm sm:text-base text-stone-800">
                {t.disease.dropzoneText}
              </p>
              <p className="text-xs text-stone-500">
                PNG, JPG or WebP up to 8MB • Clear daytime lighting recommended
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  fileInputRef.current?.click();
                }}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs"
              >
                <UploadCloud className="w-4 h-4" />
                <span>{t.actions.uploadPhoto}</span>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  cameraInputRef.current?.click();
                }}
                className="flex items-center gap-2 bg-stone-800 hover:bg-stone-900 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-xs"
              >
                <Camera className="w-4 h-4" />
                <span>{t.actions.takePhoto}</span>
              </button>
            </div>
          </div>
        ) : (
          /* Preview and Action Controls */
          <div className="space-y-4">
            <div className="relative max-w-md mx-auto rounded-2xl overflow-hidden border-2 border-emerald-500 shadow-md bg-stone-900">
              <img
                src={selectedImage}
                alt="Leaf scan preview"
                className="w-full max-h-80 object-contain"
                referrerPolicy="no-referrer"
              />
              <button
                onClick={handleClear}
                className="absolute top-3 right-3 p-1.5 bg-stone-900/80 text-white hover:bg-stone-950 rounded-full shadow"
                aria-label="Remove image"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                onClick={handleAnalyze}
                disabled={analyzing}
                className="flex items-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-black px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all hover:scale-102 disabled:opacity-50"
              >
                {analyzing ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>{t.disease.analyzing}</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 text-amber-300" />
                    <span>{t.actions.analyzeImage}</span>
                  </>
                )}
              </button>

              <button
                onClick={handleClear}
                disabled={analyzing}
                className="px-4 py-3 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-50"
              >
                {t.actions.reset}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Diagnosis Report Card */}
      {prediction && (
        <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-md space-y-6 animate-in fade-in">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-stone-100 gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Verified AI Diagnosis
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-stone-900 mt-1">
                {language === 'ta' ? prediction.detectedDiseaseTa : prediction.detectedDiseaseEn}
              </h3>
              <p className="text-xs text-stone-500 font-mono">
                {prediction.scientificName} • {prediction.crop}
              </p>
            </div>

            <div className="flex items-center gap-3">
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  {t.disease.confidence}
                </span>
                <span className="text-2xl font-black text-emerald-700">
                  {prediction.confidence}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-[10px] text-stone-400 uppercase font-bold block">
                  {t.disease.severity}
                </span>
                <span
                  className={`inline-block px-2 py-0.5 rounded-md text-xs font-extrabold ${
                    prediction.severity === 'High' || prediction.severity === 'Severe'
                      ? 'bg-red-100 text-red-700'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {prediction.severity}
                </span>
              </div>
            </div>
          </div>

          {/* Confidence bar */}
          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${prediction.confidence}%` }}
            />
          </div>

          {/* Symptoms Grid */}
          <div className="bg-stone-50 p-4 sm:p-5 rounded-2xl border border-stone-200">
            <h4 className="font-extrabold text-xs sm:text-sm text-stone-800 mb-2.5">
              {t.disease.symptoms}
            </h4>
            <ul className="text-xs sm:text-sm text-stone-600 space-y-1.5">
              {(language === 'ta' ? prediction.symptomsTa : prediction.symptomsEn).map((s, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <span className="text-emerald-600 font-bold">•</span>
                  <span>{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Treatment & Management Steps */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="bg-emerald-50/60 p-4 sm:p-5 rounded-2xl border border-emerald-200 space-y-2.5">
              <h4 className="font-black text-xs sm:text-sm text-emerald-950 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-700" />
                <span>{t.disease.treatment}</span>
              </h4>
              <ul className="text-xs text-stone-700 space-y-2">
                {(language === 'ta' ? prediction.treatmentTa : prediction.treatmentEn).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-emerald-700">{i + 1}.</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-amber-50/60 p-4 sm:p-5 rounded-2xl border border-amber-200 space-y-2.5">
              <h4 className="font-black text-xs sm:text-sm text-amber-950 flex items-center gap-1.5">
                <ShieldAlert className="w-4 h-4 text-amber-700" />
                <span>{t.disease.prevention}</span>
              </h4>
              <ul className="text-xs text-stone-700 space-y-2">
                {(language === 'ta' ? prediction.preventionTa : prediction.preventionEn).map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="font-bold text-amber-700">•</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Field Hygiene Precautions */}
          <div className="p-4 bg-stone-100 rounded-2xl text-xs text-stone-700 space-y-1">
            <span className="font-bold text-stone-900 block">{t.disease.fieldHygiene}</span>
            <ul className="list-disc list-inside space-y-0.5 text-stone-600">
              {(language === 'ta' ? prediction.hygieneTa : prediction.hygieneEn).map((h, idx) => (
                <li key={idx}>{h}</li>
              ))}
            </ul>
          </div>

          {/* Low Confidence Expert Warning Notice (Section 25 Safety Requirement) */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{language === 'ta' ? 'அதிகாரப்பூர்வ வேளாண் ஆலோசனை குறிப்பு:' : 'When to Seek Qualified Expert Guidance:'}</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                {t.disease.expertNotice}
              </p>
            </div>
          </div>

          {/* Action to share/alert village */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-stone-100">
            <div className="text-xs text-stone-500">
              {reportedSuccessfully ? (
                <span className="text-emerald-700 font-bold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4" />
                  {language === 'ta'
                    ? 'இந்த நோய் தாக்குதல் உங்கள் கிராம எச்சரிக்கை பட்டியலில் சேர்க்கப்பட்டது.'
                    : 'Reported to village disease surveillance network.'}
                </span>
              ) : (
                language === 'ta'
                  ? 'உங்கள் பகுதியில் இந்த நோய் பரவாமல் தடுக்க அருகாமை விவசாயிகளுக்கு எச்சரிக்கை அனுப்பலாம்.'
                  : 'Broadcast this finding to alert neighboring farmers in your village.'
              )}
            </div>

            <button
              onClick={handleReportOutbreak}
              disabled={reportedSuccessfully}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-extrabold px-5 py-2.5 rounded-xl text-xs shadow-xs transition-colors disabled:opacity-50"
            >
              <Share2 className="w-3.5 h-3.5 text-stone-950" />
              <span>
                {reportedSuccessfully
                  ? (language === 'ta' ? 'பதிவானது ✓' : 'Reported ✓')
                  : (language === 'ta' ? 'கிராம எச்சரிக்கை பட்டியலில் சேர்க்க' : 'Broadcast to Village Alerts')}
              </span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
