import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { firestoreService, FirestoreCropNote } from '../services/firestoreService';
import { HarvestSchedulerTracker } from '../components/HarvestSchedulerTracker';
import {
  Sprout,
  FileEdit,
  Plus,
  Trash2,
} from 'lucide-react';

export const CropManagementPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { farmer } = useAuth();

  const [notes, setNotes] = useState<FirestoreCropNote[]>([
    { id: 'n1', userId: farmer?.id || 'demo', date: '08-Aug', text: 'Basal DAP (50kg) + Neem cake applied during final puddling.' },
    { id: 'n2', userId: farmer?.id || 'demo', date: '22-Aug', text: 'Hand weeding completed; cono-weeder run in SRI plots.' },
    { id: 'n3', userId: farmer?.id || 'demo', date: '02-Sep', text: '25kg Urea + 15kg MOP applied at active tillering stage.' },
  ]);
  const [newNote, setNewNote] = useState('');

  // Sync Crop Notes from Cloud Firestore
  useEffect(() => {
    if (!farmer?.id) return;
    const unsubscribe = firestoreService.subscribeCropNotes(farmer.id, (loadedNotes) => {
      if (loadedNotes && loadedNotes.length > 0) {
        setNotes(loadedNotes);
      }
    });
    return () => unsubscribe();
  }, [farmer?.id]);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNote.trim()) return;

    const dateStr = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' });
    const noteObj: FirestoreCropNote = {
      id: `note_${Date.now()}`,
      userId: farmer?.id || 'demo',
      date: dateStr,
      text: newNote.trim(),
    };

    setNotes((prev) => [noteObj, ...prev]);
    setNewNote('');

    if (farmer?.id) {
      firestoreService.addCropNote(farmer.id, noteObj);
    }
  };

  const handleDeleteNote = (noteId: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== noteId));
    if (farmer?.id) {
      firestoreService.deleteCropNote(farmer.id, noteId);
    }
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

      {/* Dynamic Harvest Scheduling Tracker with Stage Timeline & Pre-harvest Actions */}
      <HarvestSchedulerTracker />

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
          {notes.map((note) => (
            <div
              key={note.id}
              className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs text-stone-700 flex items-center justify-between gap-2 hover:bg-stone-100/70 transition-colors"
            >
              <div className="flex items-start gap-2">
                <span className="text-emerald-700 font-bold shrink-0 mt-0.5">•</span>
                <div>
                  <span className="font-extrabold text-stone-900 mr-2">[{note.date}]</span>
                  <span>{note.text}</span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => handleDeleteNote(note.id)}
                className="text-stone-400 hover:text-red-600 p-1 rounded-lg transition-colors shrink-0"
                title="Delete note"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
          {notes.length === 0 && (
            <div className="text-center py-4 text-xs text-stone-500">
              {language === 'ta' ? 'குறிப்புகள் எதுவும் இல்லை. மேலே உங்கள் பணிகளை பதிவு செய்யுங்கள்.' : 'No notes recorded yet. Log your first field operation above.'}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
