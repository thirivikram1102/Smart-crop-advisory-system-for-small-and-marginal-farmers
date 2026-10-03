import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  CROP_MATURITY_CATALOGUE,
  CropMaturityInfo,
  HarvestScheduleRecord,
  CalculatedHarvestDetails,
  calculateHarvestSchedule,
} from '../services/harvestService';
import { firestoreService } from '../services/firestoreService';
import {
  Calendar,
  Clock,
  Sprout,
  CheckCircle2,
  AlertCircle,
  Plus,
  Trash2,
  Edit3,
  Check,
  ChevronRight,
  TrendingUp,
  Droplets,
  Layers,
  Sparkles,
  Info,
  CalendarCheck,
  CheckSquare,
  Square,
  RotateCcw,
} from 'lucide-react';

interface HarvestSchedulerTrackerProps {
  onScheduleChange?: (record: HarvestScheduleRecord, calc: CalculatedHarvestDetails) => void;
}

export const HarvestSchedulerTracker: React.FC<HarvestSchedulerTrackerProps> = ({
  onScheduleChange,
}) => {
  const { language } = useLanguage();
  const { farmer } = useAuth();

  // Pre-seed default Samba Paddy schedule
  const defaultPlantingDate = useMemo(() => {
    // Default to ~38 days ago so user immediately sees active tillering stage
    const d = new Date();
    d.setDate(d.getDate() - 38);
    return d.toISOString().split('T')[0];
  }, []);

  const [schedules, setSchedules] = useState<HarvestScheduleRecord[]>(() => {
    const saved = localStorage.getItem(`crop_schedules_${farmer?.id || 'demo'}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (e) {
        console.error(e);
      }
    }

    return [
      {
        id: 'sch_paddy_main',
        userId: farmer?.id || 'demo',
        cropId: 'paddy-samba',
        cropName: 'Samba Paddy (Late Duration)',
        cropNameTa: 'சம்பா நெல் (நீண்ட கால நெல்)',
        variety: 'CR 1009 (Ponmani)',
        plantingDate: defaultPlantingDate,
        durationDays: 135,
        expectedHarvestDate: new Date(new Date(defaultPlantingDate).getTime() + 135 * 86400000)
          .toISOString()
          .split('T')[0],
        plotName: 'Field 01 - Main Wetland',
        acres: farmer?.farmSizeAcres || 2.5,
        status: 'active',
      },
    ];
  });

  const [activeScheduleId, setActiveScheduleId] = useState<string>(() => {
    return schedules[0]?.id || 'sch_paddy_main';
  });

  // Modal / Form state for Adding or Editing a crop schedule
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditingActive, setIsEditingActive] = useState(false);

  // Form Fields
  const [formCropId, setFormCropId] = useState<string>('paddy-samba');
  const [formVariety, setFormVariety] = useState<string>('CR 1009 (Ponmani)');
  const [formPlantingDate, setFormPlantingDate] = useState<string>(defaultPlantingDate);
  const [formDurationDays, setFormDurationDays] = useState<number>(135);
  const [formPlotName, setFormPlotName] = useState<string>('Field 01 - Main Wetland');
  const [formAcres, setFormAcres] = useState<number>(farmer?.farmSizeAcres || 2.5);

  // Pre-harvest checklist completed tasks state
  const [checkedActionIds, setCheckedActionIds] = useState<Record<string, boolean>>(() => {
    try {
      const saved = localStorage.getItem(`harvest_checklist_${farmer?.id || 'demo'}`);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  // Sync schedules from Cloud Firestore
  useEffect(() => {
    if (!farmer?.id) return;
    const unsubscribe = firestoreService.subscribeHarvestSchedules(farmer.id, (loaded) => {
      if (loaded && loaded.length > 0) {
        setSchedules(loaded);
        if (!loaded.find((s) => s.id === activeScheduleId)) {
          setActiveScheduleId(loaded[0].id);
        }
      }
    });
    return () => unsubscribe();
  }, [farmer?.id]);

  // Persist locally whenever schedules change
  useEffect(() => {
    try {
      localStorage.setItem(`crop_schedules_${farmer?.id || 'demo'}`, JSON.stringify(schedules));
    } catch (e) {
      console.error(e);
    }
  }, [schedules, farmer?.id]);

  // Active Schedule
  const currentSchedule = useMemo(() => {
    return (
      schedules.find((s) => s.id === activeScheduleId) ||
      schedules[0] || {
        id: 'fallback',
        userId: farmer?.id || 'demo',
        cropId: 'paddy-samba',
        cropName: 'Samba Paddy',
        cropNameTa: 'சம்பா நெல்',
        variety: 'CR 1009',
        plantingDate: defaultPlantingDate,
        durationDays: 135,
        expectedHarvestDate: defaultPlantingDate,
        plotName: 'Main Plot',
        acres: 2.5,
        status: 'active' as const,
      }
    );
  }, [schedules, activeScheduleId, defaultPlantingDate, farmer?.id]);

  // Calculation output
  const calculation = useMemo(() => {
    return calculateHarvestSchedule(
      currentSchedule.plantingDate,
      currentSchedule.durationDays,
      currentSchedule.cropId
    );
  }, [currentSchedule.plantingDate, currentSchedule.durationDays, currentSchedule.cropId]);

  // Notify parent if needed
  useEffect(() => {
    if (onScheduleChange && currentSchedule) {
      onScheduleChange(currentSchedule, calculation);
    }
  }, [currentSchedule, calculation, onScheduleChange]);

  // Handle crop selection in form (auto-fill default duration and variety)
  const handleSelectCropInForm = (cropId: string) => {
    setFormCropId(cropId);
    const found = CROP_MATURITY_CATALOGUE.find((c) => c.id === cropId);
    if (found) {
      setFormDurationDays(found.defaultDurationDays);
      if (found.commonVarieties.length > 0) {
        setFormVariety(language === 'ta' ? found.commonVarieties[0].ta : found.commonVarieties[0].en);
      }
    }
  };

  // Quick preset days helper for planting date
  const setPlantingPreset = (daysAgo: number) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const dateStr = d.toISOString().split('T')[0];
    setFormPlantingDate(dateStr);
  };

  // Save new plot / planting
  const handleSaveNewSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const cropInfo = CROP_MATURITY_CATALOGUE.find((c) => c.id === formCropId);
    const expectedHDate = new Date(
      new Date(formPlantingDate).getTime() + formDurationDays * 86400000
    )
      .toISOString()
      .split('T')[0];

    const newRecord: HarvestScheduleRecord = {
      id: `sch_${Date.now()}`,
      userId: farmer?.id || 'demo',
      cropId: formCropId,
      cropName: cropInfo?.nameEn || 'Selected Crop',
      cropNameTa: cropInfo?.nameTa || 'தேர்ந்தெடுக்கப்பட்ட பயிர்',
      variety: formVariety || 'Standard Variety',
      plantingDate: formPlantingDate,
      durationDays: Number(formDurationDays),
      expectedHarvestDate: expectedHDate,
      plotName: formPlotName || `Plot ${schedules.length + 1}`,
      acres: Number(formAcres) || 1,
      status: 'active',
      createdAt: new Date().toISOString(),
    };

    setSchedules((prev) => [newRecord, ...prev]);
    setActiveScheduleId(newRecord.id);
    setIsAddModalOpen(false);

    if (farmer?.id) {
      firestoreService.saveHarvestSchedule(farmer.id, newRecord);
    }
  };

  // Update existing active schedule
  const handleUpdateActiveSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    const cropInfo = CROP_MATURITY_CATALOGUE.find((c) => c.id === formCropId);
    const expectedHDate = new Date(
      new Date(formPlantingDate).getTime() + formDurationDays * 86400000
    )
      .toISOString()
      .split('T')[0];

    const updated: HarvestScheduleRecord = {
      ...currentSchedule,
      cropId: formCropId,
      cropName: cropInfo?.nameEn || currentSchedule.cropName,
      cropNameTa: cropInfo?.nameTa || currentSchedule.cropNameTa,
      variety: formVariety,
      plantingDate: formPlantingDate,
      durationDays: Number(formDurationDays),
      expectedHarvestDate: expectedHDate,
      plotName: formPlotName,
      acres: Number(formAcres),
      updatedAt: new Date().toISOString(),
    };

    setSchedules((prev) => prev.map((s) => (s.id === updated.id ? updated : s)));
    setIsEditingActive(false);

    if (farmer?.id) {
      firestoreService.saveHarvestSchedule(farmer.id, updated);
    }
  };

  // Delete a plot schedule
  const handleDeleteSchedule = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (schedules.length <= 1) {
      alert(
        language === 'ta'
          ? 'குறைந்தது ஒரு பயிர் அட்டவணை இருக்க வேண்டும்!'
          : 'At least one harvest schedule is required.'
      );
      return;
    }
    const filtered = schedules.filter((s) => s.id !== id);
    setSchedules(filtered);
    if (activeScheduleId === id) {
      setActiveScheduleId(filtered[0].id);
    }
    if (farmer?.id) {
      firestoreService.deleteHarvestSchedule(farmer.id, id);
    }
  };

  // Start editing active schedule
  const openEditModal = () => {
    setFormCropId(currentSchedule.cropId);
    setFormVariety(currentSchedule.variety);
    setFormPlantingDate(currentSchedule.plantingDate);
    setFormDurationDays(currentSchedule.durationDays);
    setFormPlotName(currentSchedule.plotName);
    setFormAcres(currentSchedule.acres);
    setIsEditingActive(true);
  };

  // Toggle pre-harvest action checklist
  const toggleActionCheck = (actionIndex: number) => {
    const key = `${currentSchedule.id}_action_${actionIndex}`;
    const nextState = { ...checkedActionIds, [key]: !checkedActionIds[key] };
    setCheckedActionIds(nextState);
    try {
      localStorage.setItem(
        `harvest_checklist_${farmer?.id || 'demo'}`,
        JSON.stringify(nextState)
      );
    } catch (e) {
      console.error(e);
    }
  };

  // Format readable dates
  const formatNiceDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString(language === 'ta' ? 'ta-IN' : 'en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner / Plot Switcher Ribbon */}
      <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-stone-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                <CalendarCheck className="w-5 h-5" />
              </span>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-stone-900">
                  {language === 'ta'
                    ? 'அறுவடை கால அட்டவணை கண்காணிப்பாளர்'
                    : 'Harvest Scheduling Tracker'}
                </h2>
                <p className="text-xs text-stone-500 font-medium">
                  {language === 'ta'
                    ? 'விதைத்த தேதியை அடிப்படையாகக் கொண்டு துல்லியமான அறுவடை நாள் & வளர்ச்சிப் படிநிலைகள்'
                    : 'Calculates expected harvest dates & stage milestones based on planting date'}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                setFormCropId('paddy-samba');
                setFormVariety('CR 1009');
                setFormPlantingDate(new Date().toISOString().split('T')[0]);
                setFormDurationDays(135);
                setFormPlotName(`Plot 0${schedules.length + 1}`);
                setFormAcres(1.5);
                setIsAddModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>{language === 'ta' ? 'புதிய பயிர் / நிலம் சேர்' : '+ New Crop Plot'}</span>
            </button>
          </div>
        </div>

        {/* Plot Selector Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-xs font-bold text-stone-400 uppercase tracking-wider shrink-0 mr-1 flex items-center gap-1">
            <Layers className="w-3.5 h-3.5" />
            <span>{language === 'ta' ? 'வயல்கள்:' : 'Plots:'}</span>
          </span>
          {schedules.map((sch) => {
            const isSelected = sch.id === currentSchedule.id;
            return (
              <div
                key={sch.id}
                onClick={() => setActiveScheduleId(sch.id)}
                className={`group flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-extrabold cursor-pointer transition-all border shrink-0 ${
                  isSelected
                    ? 'bg-emerald-800 text-white border-emerald-900 shadow-xs'
                    : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <Sprout className={`w-3.5 h-3.5 ${isSelected ? 'text-lime-300' : 'text-emerald-700'}`} />
                <span>{sch.plotName}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.5 rounded-full ${
                    isSelected ? 'bg-emerald-900/80 text-emerald-200' : 'bg-stone-200 text-stone-600'
                  }`}
                >
                  {language === 'ta' ? sch.cropNameTa.split(' ')[0] : sch.cropName.split(' ')[0]}
                </span>
                {schedules.length > 1 && (
                  <button
                    onClick={(e) => handleDeleteSchedule(sch.id, e)}
                    title="Delete plot"
                    className={`ml-1 p-0.5 rounded hover:bg-red-500 hover:text-white transition-colors ${
                      isSelected ? 'text-emerald-200 hover:text-white' : 'text-stone-400'
                    }`}
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Active Schedule Overview Card */}
        <div className="bg-gradient-to-br from-emerald-50/70 via-stone-50 to-emerald-100/30 rounded-2xl p-5 border border-emerald-200/80">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            {/* Left: Crop & Planting Details */}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-emerald-700 text-white text-[11px] font-black px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                  {currentSchedule.plotName}
                </span>
                <span className="bg-white text-stone-700 border border-stone-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
                  {currentSchedule.acres} {language === 'ta' ? 'ஏக்கர்' : 'Acres'}
                </span>
                <span className="bg-white text-stone-700 border border-stone-200 text-[11px] font-bold px-2 py-0.5 rounded-md">
                  {language === 'ta' ? 'ரகம்' : 'Variety'}: {currentSchedule.variety}
                </span>
                <button
                  onClick={openEditModal}
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 hover:text-emerald-950 underline ml-1"
                >
                  <Edit3 className="w-3 h-3" />
                  <span>{language === 'ta' ? 'மாற்று / திருத்து' : 'Change Date / Crop'}</span>
                </button>
              </div>

              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 leading-tight">
                {language === 'ta' ? currentSchedule.cropNameTa : currentSchedule.cropName}
              </h3>

              <div className="flex flex-wrap items-center gap-4 text-xs text-stone-600 pt-1">
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-stone-400" />
                  <span>{language === 'ta' ? 'விதைத்த நாள்' : 'Sown / Planted'}:</span>
                  <b className="text-stone-900">{formatNiceDate(calculation.plantingDate)}</b>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5 text-stone-400" />
                  <span>{language === 'ta' ? 'மொத்த பயிர் காலம்' : 'Duration'}:</span>
                  <b className="text-stone-900">
                    {calculation.durationDays} {language === 'ta' ? 'நாட்கள்' : 'Days'}
                  </b>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1.5">
                  <Sprout className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{language === 'ta' ? 'கடந்த நாட்கள்' : 'Elapsed'}:</span>
                  <b className="text-emerald-800 font-extrabold">
                    {calculation.daysElapsed} {language === 'ta' ? 'நாட்கள்' : 'Days'}
                  </b>
                </div>
              </div>
            </div>

            {/* Right: Big Countdown & Harvest Target Gauge */}
            <div className="flex flex-col sm:flex-row items-center gap-4 bg-white/95 backdrop-blur-xs p-4 sm:p-5 rounded-2xl border border-emerald-300 shadow-xs shrink-0">
              <div className="text-center sm:text-left space-y-1">
                <span className="text-[11px] font-extrabold text-stone-500 uppercase tracking-wider block">
                  {language === 'ta' ? 'எதிர்பார்க்கப்படும் அறுவடை நாள்' : 'Expected Harvest Date'}
                </span>
                <div className="text-xl sm:text-2xl font-black text-emerald-900">
                  {formatNiceDate(calculation.expectedHarvestDate)}
                </div>
                <div className="text-xs text-emerald-700 font-semibold">
                  {language === 'ta' ? 'அறுவடை இடைவெளி' : 'Harvest Window'}:{' '}
                  <span className="font-extrabold">
                    {formatNiceDate(calculation.harvestWindowStart)} –{' '}
                    {formatNiceDate(calculation.harvestWindowEnd)}
                  </span>
                </div>
              </div>

              <div className="h-10 w-px bg-stone-200 hidden sm:block" />

              <div className="text-center bg-emerald-900 text-white px-5 py-3 rounded-xl min-w-[130px] shadow-xs">
                {calculation.isReadyForHarvest ? (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-lime-300 block">
                      {language === 'ta' ? 'நிலை' : 'Status'}
                    </span>
                    <span className="text-lg font-black text-white block">
                      {language === 'ta' ? 'அறுவடைக்கு தயார்!' : 'Harvest Ready!'}
                    </span>
                  </>
                ) : calculation.isOverdue ? (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300 block">
                      {language === 'ta' ? 'தாமதம்' : 'Overdue'}
                    </span>
                    <span className="text-lg font-black text-white block">
                      {Math.abs(calculation.daysRemaining)} {language === 'ta' ? 'நாள் தாமதம்' : 'Days Over'}
                    </span>
                  </>
                ) : (
                  <>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-300 block">
                      {language === 'ta' ? 'மீதமுள்ள நாட்கள்' : 'Days Remaining'}
                    </span>
                    <span className="text-2xl font-black text-white block leading-tight">
                      {calculation.daysRemaining}
                    </span>
                    <span className="text-[10px] text-emerald-200 font-medium">
                      {language === 'ta' ? 'நாட்கள் வரை' : 'days to harvest'}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Progress Bar & Growth Percentage */}
          <div className="mt-5 pt-4 border-t border-emerald-200/60 space-y-2">
            <div className="flex items-center justify-between text-xs font-extrabold">
              <span className="text-stone-700 flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping inline-block" />
                <span>
                  {language === 'ta' ? 'தற்போதைய பயிர் நிலை:' : 'Current Growth Stage:'}{' '}
                  <strong className="text-emerald-900">
                    {language === 'ta' ? calculation.currentStageNameTa : calculation.currentStageNameEn}
                  </strong>
                </span>
              </span>
              <span className="text-emerald-800 font-black">
                {calculation.progressPct}% {language === 'ta' ? 'முதிர்ச்சி' : 'Maturity Progress'}
              </span>
            </div>

            <div className="w-full h-3.5 bg-stone-200/80 rounded-full overflow-hidden p-0.5 border border-stone-300/50 shadow-inner">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 via-emerald-600 to-lime-500 rounded-full transition-all duration-700 shadow-xs"
                style={{ width: `${Math.min(100, Math.max(4, calculation.progressPct))}%` }}
              />
            </div>

            <div className="flex justify-between text-[11px] text-stone-500 font-medium pt-0.5">
              <span>{language === 'ta' ? 'நாற்று / விதைப்பு' : 'Sowing (Day 0)'}</span>
              <span>
                {language === 'ta' ? 'நாள்' : 'Day'} {calculation.daysElapsed} / {calculation.durationDays}
              </span>
              <span className="text-emerald-700 font-bold">
                {language === 'ta' ? 'அறுவடை' : 'Harvest (Day ' + calculation.durationDays + ')'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Calculated Timeline View */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div className="space-y-0.5">
            <h3 className="font-extrabold text-lg sm:text-xl text-stone-900 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-emerald-700" />
              <span>
                {language === 'ta'
                  ? 'கணக்கிடப்பட்ட வளர்ச்சி மற்றும் அறுவடை காலக்கோடு'
                  : 'Calculated Phenology & Harvest Timeline'}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'ta'
                ? 'உங்கள் விதைத்த தேதியின்படி ஒவ்வொரு பருவமும் தொடங்கும் மற்றும் முடியும் நாள்காட்டி தேதிகள்'
                : 'Exact calendar dates calculated for every growth phase until final harvest'}
            </p>
          </div>

          <div className="inline-flex items-center gap-2 bg-stone-100 text-stone-700 px-3 py-1 rounded-full text-xs font-semibold self-start sm:self-auto">
            <span>{calculation.milestones.length} Stages</span>
          </div>
        </div>

        {/* Milestone Steps Cards */}
        <div className="relative pl-6 sm:pl-8 space-y-6 before:content-[''] before:absolute before:left-3 sm:before:left-4 before:top-4 before:bottom-6 before:w-0.5 before:bg-stone-200">
          {calculation.milestones.map((stg, idx) => {
            const isCompleted = stg.status === 'completed';
            const isCurrent = stg.status === 'current';
            const isHarvest = stg.isHarvest;

            return (
              <div key={idx} className="relative group">
                {/* Timeline Bullet Node */}
                <div
                  className={`absolute -left-6 sm:-left-8 top-3.5 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center text-xs font-black shadow-xs transition-all ${
                    isCurrent
                      ? 'bg-emerald-600 text-white ring-4 ring-emerald-100 animate-pulse'
                      : isCompleted
                      ? 'bg-emerald-700 text-white'
                      : isHarvest
                      ? 'bg-amber-500 text-white ring-2 ring-amber-100'
                      : 'bg-stone-100 text-stone-500 border border-stone-300'
                  }`}
                >
                  {isCompleted ? (
                    <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[3]" />
                  ) : isHarvest ? (
                    '🌾'
                  ) : (
                    stg.stageNumber
                  )}
                </div>

                {/* Milestone Details Card */}
                <div
                  className={`p-4 sm:p-6 rounded-2xl border transition-all ${
                    isCurrent
                      ? 'bg-emerald-50/90 border-emerald-500 ring-2 ring-emerald-500/20 shadow-xs'
                      : isHarvest
                      ? 'bg-gradient-to-r from-amber-50/60 to-stone-50 border-amber-300 shadow-xs'
                      : isCompleted
                      ? 'bg-stone-50/70 border-stone-200 opacity-90'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-2 border-b border-stone-200/60">
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-base sm:text-lg text-stone-900">
                          {language === 'ta' ? stg.nameTa : stg.nameEn}
                        </h4>
                        {isHarvest && (
                          <span className="text-[10px] font-black uppercase tracking-wider bg-amber-500 text-white px-2 py-0.5 rounded-full">
                            {language === 'ta' ? 'இலக்கு அறுவடை' : 'Target Harvest'}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-xs text-stone-500 mt-1 font-medium">
                        <span className="text-emerald-800 font-bold bg-emerald-100/70 px-2 py-0.5 rounded">
                          {stg.dayRange}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1 text-stone-700">
                          <Calendar className="w-3.5 h-3.5 text-stone-400" />
                          <span>
                            {formatNiceDate(stg.startDate)} – {formatNiceDate(stg.endDate)}
                          </span>
                        </span>
                      </div>
                    </div>

                    <span
                      className={`text-xs font-black px-3 py-1 rounded-full self-start sm:self-auto shrink-0 ${
                        isCurrent
                          ? 'bg-emerald-700 text-white'
                          : isCompleted
                          ? 'bg-emerald-100 text-emerald-800'
                          : isHarvest
                          ? 'bg-amber-100 text-amber-900 border border-amber-300'
                          : 'bg-stone-100 text-stone-500'
                      }`}
                    >
                      {isCurrent
                        ? (language === 'ta' ? 'தற்போது இயங்கும் பருவம்' : 'Active Stage')
                        : isCompleted
                        ? (language === 'ta' ? 'முடிந்தது ✓' : 'Completed ✓')
                        : isHarvest
                        ? (language === 'ta' ? 'அறுவடை தருணம் 🌾' : 'Harvest Window 🌾')
                        : (language === 'ta' ? 'வரவிருக்கும் பருவம்' : 'Upcoming Stage')}
                    </span>
                  </div>

                  {/* Stage Agronomic Advice */}
                  <div className="mt-3 flex items-start gap-2.5 text-xs sm:text-sm text-stone-700 leading-relaxed bg-white/80 p-3 rounded-xl border border-stone-200/50">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-extrabold text-stone-900 mr-1.5">
                        {language === 'ta' ? 'பரிந்துரைக்கப்படும் களப்பணி:' : 'Key Protocol:'}
                      </span>
                      <span>{language === 'ta' ? stg.adviceTa : stg.adviceEn}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Pre-Harvest Preparation Action Checklist & Machinery Planner */}
      <div className="bg-white rounded-3xl p-5 sm:p-8 border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-stone-100">
          <div>
            <h3 className="font-extrabold text-base sm:text-lg text-stone-900 flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-700" />
              <span>
                {language === 'ta'
                  ? 'அறுவடைக்கு முந்தைய ஆயத்தப் பணிகள் (Checklist)'
                  : 'Pre-Harvest Action Readiness & Machinery Checklist'}
              </span>
            </h3>
            <p className="text-xs text-stone-500">
              {language === 'ta'
                ? 'அறுவடை இழப்புகளைத் தவிர்க்கவும், தரமான தானிய விற்பனைக்கும் இந்த பணிகளை குறித்த நாளில் முடிக்கவும்'
                : 'Complete these key operational steps before harvest to prevent post-harvest loss'}
            </p>
          </div>

          <span className="text-xs text-emerald-800 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200 self-start sm:self-auto">
            {language === 'ta' ? 'அறுவடைக்கு முந்தைய 14 நாட்கள்' : 'T-minus 14 Days Planner'}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {calculation.preHarvestActionTips.map((tip, idx) => {
            const key = `${currentSchedule.id}_action_${idx}`;
            const isChecked = Boolean(checkedActionIds[key]);

            return (
              <div
                key={idx}
                onClick={() => toggleActionCheck(idx)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                  isChecked
                    ? 'bg-emerald-50/80 border-emerald-300 opacity-90'
                    : 'bg-stone-50 border-stone-200 hover:bg-stone-100/70 hover:border-stone-300'
                }`}
              >
                <button
                  type="button"
                  className={`mt-0.5 shrink-0 transition-colors ${
                    isChecked ? 'text-emerald-700' : 'text-stone-400'
                  }`}
                >
                  {isChecked ? (
                    <CheckSquare className="w-5 h-5 fill-emerald-100" />
                  ) : (
                    <Square className="w-5 h-5" />
                  )}
                </button>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-black uppercase tracking-wider px-2 py-0.5 rounded ${
                        isChecked ? 'bg-emerald-200/80 text-emerald-900' : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      T-{tip.daysBefore} {language === 'ta' ? 'நாட்கள்' : 'Days'}
                    </span>
                    <span className="text-[11px] text-stone-500 font-medium">
                      Target: {formatNiceDate(tip.dateStr)}
                    </span>
                  </div>

                  <p
                    className={`text-xs sm:text-sm font-extrabold ${
                      isChecked ? 'line-through text-stone-500' : 'text-stone-900'
                    }`}
                  >
                    {language === 'ta' ? tip.ta : tip.en}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal: Add New Crop Schedule */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Sprout className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-black text-stone-900">
                  {language === 'ta' ? 'புதிய பயிர் அறுவடை அட்டவணை' : 'Add New Crop Planting Schedule'}
                </h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveNewSchedule} className="space-y-4">
              {/* Plot Name & Acres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ta' ? 'வயல் / நிலத்தின் பெயர்' : 'Plot / Field Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formPlotName}
                    onChange={(e) => setFormPlotName(e.target.value)}
                    placeholder="Field 02 - Garden Plot"
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ta' ? 'பரப்பளவு (ஏக்கர்)' : 'Farm Area (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formAcres}
                    onChange={(e) => setFormAcres(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'பயிரைத் தேர்ந்தெடுக்கவும்' : 'Select Crop'}
                </label>
                <select
                  value={formCropId}
                  onChange={(e) => handleSelectCropInForm(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
                >
                  {CROP_MATURITY_CATALOGUE.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'ta' ? c.nameTa : c.nameEn} ({c.defaultDurationDays}{' '}
                      {language === 'ta' ? 'நாட்கள்' : 'Days'} - {c.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Variety Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'பயிர் ரகம்' : 'Crop Variety / Hybrid'}
                </label>
                <input
                  type="text"
                  value={formVariety}
                  onChange={(e) => setFormVariety(e.target.value)}
                  placeholder="e.g. CR 1009, ADT 43, VBN 8"
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Planting Date with Quick Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ta' ? 'விதைத்த / நட்ட நாள்' : 'Planting / Sowing Date'}
                </label>
                <input
                  type="date"
                  required
                  value={formPlantingDate}
                  onChange={(e) => setFormPlantingDate(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                />

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-400 font-bold mr-1">Quick:</span>
                  {[
                    { label: 'Today', days: 0 },
                    { label: '15d ago', days: 15 },
                    { label: '30d ago', days: 30 },
                    { label: '45d ago', days: 45 },
                    { label: '60d ago', days: 60 },
                  ].map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => setPlantingPreset(p.days)}
                      className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 border border-stone-200 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration in Days */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    {language === 'ta' ? 'அறுவடை வரை மொத்த நாட்கள்' : 'Total Duration (Days to Harvest)'}
                  </label>
                  <span className="text-xs font-extrabold text-emerald-800">
                    {formDurationDays} {language === 'ta' ? 'நாட்கள்' : 'Days'}
                  </span>
                </div>
                <input
                  type="number"
                  min="40"
                  max="400"
                  required
                  value={formDurationDays}
                  onChange={(e) => setFormDurationDays(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-xs"
                >
                  {language === 'ta' ? 'அட்டவணையைச் சேமி' : 'Save Schedule'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Active Schedule */}
      {isEditingActive && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl border border-stone-200 space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2">
                <Edit3 className="w-5 h-5 text-emerald-700" />
                <h3 className="text-lg font-black text-stone-900">
                  {language === 'ta' ? 'பயிர் / விதைத்த நாள் மாற்றம்' : 'Update Crop & Planting Date'}
                </h3>
              </div>
              <button
                onClick={() => setIsEditingActive(false)}
                className="text-stone-400 hover:text-stone-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleUpdateActiveSchedule} className="space-y-4">
              {/* Plot Name & Acres */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ta' ? 'வயல் / நிலத்தின் பெயர்' : 'Plot / Field Name'}
                  </label>
                  <input
                    type="text"
                    required
                    value={formPlotName}
                    onChange={(e) => setFormPlotName(e.target.value)}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 mb-1">
                    {language === 'ta' ? 'பரப்பளவு (ஏக்கர்)' : 'Farm Area (Acres)'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0.1"
                    required
                    value={formAcres}
                    onChange={(e) => setFormAcres(Number(e.target.value))}
                    className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                  />
                </div>
              </div>

              {/* Crop Selector */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'பயிரைத் தேர்ந்தெடுக்கவும்' : 'Select Crop'}
                </label>
                <select
                  value={formCropId}
                  onChange={(e) => handleSelectCropInForm(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white font-medium"
                >
                  {CROP_MATURITY_CATALOGUE.map((c) => (
                    <option key={c.id} value={c.id}>
                      {language === 'ta' ? c.nameTa : c.nameEn} ({c.defaultDurationDays}{' '}
                      {language === 'ta' ? 'நாட்கள்' : 'Days'} - {c.category})
                    </option>
                  ))}
                </select>
              </div>

              {/* Variety Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  {language === 'ta' ? 'பயிர் ரகம்' : 'Crop Variety / Hybrid'}
                </label>
                <input
                  type="text"
                  value={formVariety}
                  onChange={(e) => setFormVariety(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              {/* Planting Date with Quick Presets */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-stone-700">
                  {language === 'ta' ? 'விதைத்த / நட்ட நாள்' : 'Planting / Sowing Date'}
                </label>
                <input
                  type="date"
                  required
                  value={formPlantingDate}
                  onChange={(e) => setFormPlantingDate(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none bg-white"
                />

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                  <span className="text-[11px] text-stone-400 font-bold mr-1">Quick:</span>
                  {[
                    { label: 'Today', days: 0 },
                    { label: '15d ago', days: 15 },
                    { label: '30d ago', days: 30 },
                    { label: '38d ago', days: 38 },
                    { label: '60d ago', days: 60 },
                  ].map((p) => (
                    <button
                      key={p.days}
                      type="button"
                      onClick={() => setPlantingPreset(p.days)}
                      className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-emerald-100 hover:text-emerald-900 border border-stone-200 transition-colors"
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration in Days */}
              <div>
                <div className="flex justify-between items-center mb-1">
                  <label className="text-xs font-bold text-stone-700">
                    {language === 'ta' ? 'அறுவடை வரை மொத்த நாட்கள்' : 'Total Duration (Days to Harvest)'}
                  </label>
                  <span className="text-xs font-extrabold text-emerald-800">
                    {formDurationDays} {language === 'ta' ? 'நாட்கள்' : 'Days'}
                  </span>
                </div>
                <input
                  type="number"
                  min="40"
                  max="400"
                  required
                  value={formDurationDays}
                  onChange={(e) => setFormDurationDays(Number(e.target.value))}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditingActive(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 text-xs font-bold text-stone-700 hover:bg-stone-50"
                >
                  {language === 'ta' ? 'ரத்து செய்' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-extrabold shadow-xs"
                >
                  {language === 'ta' ? 'புதுப்பி' : 'Update & Recalculate'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
