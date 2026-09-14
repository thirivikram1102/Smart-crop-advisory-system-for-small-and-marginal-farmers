import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Sprout,
  CheckCircle2,
  Clock,
  Calendar,
  Layers,
  FileEdit,
  Plus,
  Droplets,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface TimelineStage {
  id: string;
  nameEn: string;
  nameTa: string;
  dayRange: string;
  status: 'completed' | 'current' | 'upcoming';
  instructionsEn: string;
  instructionsTa: string;
}

export const CropManagementPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { farmer } = useAuth();

  const [notes, setNotes] = useState<string[]>([
    '08-Aug: Basal DAP (50kg) + Neem cake applied during final puddling.',
    '22-Aug: Hand weeding completed; cono-weeder run in SRI plots.',
    '02-Sep: 25kg Urea + 15kg MOP applied at active tillering stage.',
  ]);
  const [newNote, setNewNote] = useState('');

  const stages: TimelineStage[] = [
    {
      id: 's1',
      nameEn: 'Nursery & Seedling Raising',
      nameTa: 'நாற்றங்கால் தயாரிப்பு & பராமரிப்பு',
      dayRange: 'Day 1 - 25',
      status: 'completed',
      instructionsEn: 'Treat seeds with Pseudomonas fluorescens @ 10g/kg. Maintain thin film of water.',
      instructionsTa: 'விதைகளை சூடோமோனாஸ் உடன் விதைநேர்த்தி செய்யவும். மிதமான நீர் பராமரிக்கவும்.',
    },
    {
      id: 's2',
      nameEn: 'Active Tillering & Root Establishment',
      nameTa: 'தூர்க்கட்டும் பருவம் (தற்போதைய நிலை)',
      dayRange: 'Day 26 - 55 (Current: Day 38)',
      status: 'current',
      instructionsEn: 'Maintain 2.5 cm shallow water depth. Apply cono-weeder across rows. Top dress with Nitrogen & Potassium.',
      instructionsTa: 'வயலில் 2.5 செ.மீ மெல்லிய நீர் நிறுத்தவும். கோனோ-வீடர் மூலம் களை எடுத்து காற்றோட்டம் கூட்டவும்.',
    },
    {
      id: 's3',
      nameEn: 'Panicle Primordia Initiation',
      nameTa: 'கதிர் உருவாகும் பருவம் (சூல்பருவம்)',
      dayRange: 'Day 56 - 75',
      status: 'upcoming',
      instructionsEn: 'Critical water requirement stage. Never allow soil to crack. Monitor for stem borer and leaf folder.',
      instructionsTa: 'முக்கிய நீர் தேவை பருவம். வயல் வெடிக்காமல் பாதுகாக்கவும். தண்டு துளைப்பான் கண்காணிக்கவும்.',
    },
    {
      id: 's4',
      nameEn: 'Flowering & Milking Stage',
      nameTa: 'பூக்கும் மற்றும் பால் பிடிக்கும் பருவம்',
      dayRange: 'Day 76 - 105',
      status: 'upcoming',
      instructionsEn: 'Avoid foliar sprays during peak morning pollination (9 AM - 11 AM). Ensure steady moisture.',
      instructionsTa: 'காலை மகரந்த சேர்க்கை நேரத்தில் பூச்சி மருந்து தெளிப்பதை தவிர்க்கவும்.',
    },
    {
      id: 's5',
      nameEn: 'Grain Hardening & Harvesting',
      nameTa: 'முதிர்ச்சி மற்றும் அறுவடை பருவம்',
      dayRange: 'Day 106 - 135',
      status: 'upcoming',
      instructionsEn: 'Drain water completely 10 days before harvest to facilitate combine harvester operation.',
      instructionsTa: 'அறுவடைக்கு 10 நாட்களுக்கு முன் நீரை முழுமையாக வடிக்கவும்.',
    },
  ];

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;
    setNotes([`${new Date().toLocaleDateString('en-GB')}: ${newNote.trim()}`, ...notes]);
    setNewNote('');
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Sprout className="w-3.5 h-3.5 text-lime-300" />
            <span>Field Phenology & Growth Calendar</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.cropManagement.title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t.cropManagement.subtitle}
          </p>
        </div>
      </div>

      {/* Current Crop Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
            {farmer?.district || 'Thanjavur'} • Field 01 ({farmer?.farmSizeAcres || 2.5} Acres)
          </span>
          <h2 className="text-2xl font-black text-stone-900">
            {language === 'ta' ? 'சம்பா நெல் (CR 1009 / பொன்னி)' : 'Samba Paddy (CR 1009 / Ponni)'}
          </h2>
          <div className="flex flex-wrap items-center gap-3 text-xs text-stone-600">
            <span>{language === 'ta' ? 'விதைத்த நாள்' : 'Sown'}: <b>06-Aug-2026</b></span>
            <span>•</span>
            <span>{language === 'ta' ? 'நடந்த நாட்கள்' : 'Elapsed'}: <b className="text-emerald-700">38 {language === 'ta' ? 'நாட்கள்' : 'Days'}</b></span>
            <span>•</span>
            <span>{language === 'ta' ? 'எதிர்பார்க்கப்படும் அறுவடை' : 'Harvest'}: <b>18-Nov-2026</b></span>
          </div>
        </div>

        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-2xl text-center min-w-[200px]">
          <span className="text-xs text-emerald-800 font-bold block">{language === 'ta' ? 'தற்போதைய பயிர் நிலை' : 'Current Stage'}</span>
          <span className="text-lg font-black text-emerald-950 mt-0.5 block">
            {language === 'ta' ? 'தூர்க்கட்டும் பருவம்' : 'Active Tillering'}
          </span>
          <span className="text-xs text-emerald-700 font-medium">Stage 2 of 5</span>
        </div>
      </div>

      {/* Growth Stages Timeline */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <h3 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-700" />
          <span>{language === 'ta' ? 'பயிர் வளர்ச்சி காலக்கோடு' : 'Growth Timeline & Stage Protocols'}</span>
        </h3>

        <div className="space-y-4">
          {stages.map((st) => (
            <div
              key={st.id}
              className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                st.status === 'current'
                  ? 'bg-emerald-50/70 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                  : st.status === 'completed'
                  ? 'bg-stone-50/80 border-stone-200 opacity-80'
                  : 'bg-white border-stone-200'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-2 gap-2 border-b border-stone-100">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold ${
                      st.status === 'completed'
                        ? 'bg-emerald-600 text-white'
                        : st.status === 'current'
                        ? 'bg-emerald-700 text-white animate-pulse'
                        : 'bg-stone-200 text-stone-600'
                    }`}
                  >
                    {st.status === 'completed' ? '✓' : st.id.replace('s', '')}
                  </div>
                  <div>
                    <h4 className="font-extrabold text-sm sm:text-base text-stone-900">
                      {language === 'ta' ? st.nameTa : st.nameEn}
                    </h4>
                    <span className="text-xs text-stone-500 font-medium">{st.dayRange}</span>
                  </div>
                </div>

                <span
                  className={`text-xs font-extrabold px-2.5 py-0.5 rounded-full self-start sm:self-auto ${
                    st.status === 'current'
                      ? 'bg-emerald-600 text-white'
                      : st.status === 'completed'
                      ? 'bg-stone-200 text-stone-700'
                      : 'bg-stone-100 text-stone-500'
                  }`}
                >
                  {st.status === 'current'
                    ? (language === 'ta' ? 'செயலில் உள்ளது' : 'Active Stage')
                    : st.status === 'completed'
                    ? (language === 'ta' ? 'முடிந்தது' : 'Completed')
                    : (language === 'ta' ? 'அடுத்த நிலை' : 'Upcoming')}
                </span>
              </div>

              <p className="mt-3 text-xs sm:text-sm text-stone-700 leading-relaxed">
                {language === 'ta' ? st.instructionsTa : st.instructionsEn}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Field Activity Journal / Notebook */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <h3 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-2">
          <FileEdit className="w-5 h-5 text-emerald-700" />
          <span>{language === 'ta' ? 'களக் குறிப்பேடு (பயிர்க் குறிப்புகள்)' : 'Field Activity Journal'}</span>
        </h3>

        <form onSubmit={handleAddNote} className="flex gap-2">
          <input
            type="text"
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            placeholder={
              language === 'ta'
                ? 'இன்று செய்த பணி (உரமிடுதல், களை எடுத்தல், நீர் பாய்ச்சல்)...'
                : 'Log farm activity (fertilizer applied, weeding, spraying)...'
            }
            className="flex-1 text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
          />
          <button
            type="submit"
            className="flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-4 rounded-xl text-xs shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>{language === 'ta' ? 'சேர்' : 'Add'}</span>
          </button>
        </form>

        <div className="space-y-2">
          {notes.map((note, idx) => (
            <div
              key={idx}
              className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-start gap-2"
            >
              <span className="text-emerald-700 font-bold">•</span>
              <span>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
