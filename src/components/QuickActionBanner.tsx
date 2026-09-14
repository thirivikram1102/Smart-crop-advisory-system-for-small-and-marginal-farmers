import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sprout,
  ScanEye,
  Mic,
  Droplets,
  Calculator,
  AlertTriangle,
} from 'lucide-react';

interface QuickActionBannerProps {
  onSelectAction: (actionId: string) => void;
  onOpenVoiceModal: () => void;
}

export const QuickActionBanner: React.FC<QuickActionBannerProps> = ({
  onSelectAction,
  onOpenVoiceModal,
}) => {
  const { language, t } = useLanguage();

  const actions = [
    {
      id: 'crop-recommendation',
      title: language === 'ta' ? 'பயிர் பரிந்துரை' : 'Recommend Crop',
      subtitle: language === 'ta' ? 'மண் & தட்பவெப்பத்திற்கு ஏற்ப' : 'AI Soil Match',
      icon: Sprout,
      color: 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100/80',
      iconBg: 'bg-emerald-600 text-white',
      badge: 'AI',
    },
    {
      id: 'disease-detection',
      title: language === 'ta' ? 'இலை நோய் ஸ்கேன்' : 'Scan Plant Disease',
      subtitle: language === 'ta' ? 'புகைப்படம் எடுத்து சோதிக்க' : 'Photo Diagnosis',
      icon: ScanEye,
      color: 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100/80',
      iconBg: 'bg-rose-600 text-white',
      badge: 'Vision',
    },
    {
      id: 'voice-assistant',
      title: language === 'ta' ? 'தமிழில் பேசுங்கள்' : 'Ask in Tamil',
      subtitle: language === 'ta' ? 'குரல் வழி விவசாய உதவி' : 'Voice Assistant',
      icon: Mic,
      color: 'bg-amber-50 text-amber-950 border-amber-300 hover:bg-amber-100/80',
      iconBg: 'bg-amber-500 text-stone-950',
      badge: 'தமிழ்',
      onClick: onOpenVoiceModal,
    },
    {
      id: 'irrigation',
      title: language === 'ta' ? 'பாசன ஆலோசனை' : 'Irrigation Advice',
      subtitle: language === 'ta' ? 'மண் ஈரப்பதம் & மழை' : 'Water Schedule',
      icon: Droplets,
      color: 'bg-cyan-50 text-cyan-900 border-cyan-200 hover:bg-cyan-100/80',
      iconBg: 'bg-cyan-600 text-white',
    },
    {
      id: 'profit-prediction',
      title: language === 'ta' ? 'லாபக் கணக்கீடு' : 'Predict Profit',
      subtitle: language === 'ta' ? 'செலவு & நிகர வருவாய்' : 'Cost & Margin',
      icon: Calculator,
      color: 'bg-lime-50 text-lime-900 border-lime-200 hover:bg-lime-100/80',
      iconBg: 'bg-lime-600 text-white',
    },
    {
      id: 'alerts',
      title: language === 'ta' ? 'நோய் எச்சரிக்கைகள்' : 'Disease Alerts',
      subtitle: language === 'ta' ? 'அருகிலுள்ள கிராம தகவல்' : 'Village Outbreaks',
      icon: AlertTriangle,
      color: 'bg-orange-50 text-orange-950 border-orange-200 hover:bg-orange-100/80',
      iconBg: 'bg-orange-500 text-white',
      badge: 'Live',
    },
  ];

  return (
    <div className="space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="font-extrabold text-sm sm:text-base text-stone-900 flex items-center gap-2">
          <span>{t.dashboard.quickActionsTitle}</span>
        </h3>
        <span className="text-[11px] text-stone-500 hidden sm:inline">
          {language === 'ta' ? '1-2 தட்டுகளில் உடனடி தீர்வு' : 'One-tap direct access'}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5 sm:gap-3">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              onClick={() => (act.onClick ? act.onClick() : onSelectAction(act.id))}
              className={`p-3 rounded-2xl border text-left flex flex-col justify-between transition-all hover:shadow-sm active:scale-98 ${act.color}`}
            >
              <div className="flex items-start justify-between w-full mb-2">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center shadow-2xs ${act.iconBg}`}>
                  <Icon className="w-5 h-5" />
                </div>
                {act.badge && (
                  <span className="text-[9px] uppercase font-bold bg-white/80 px-1.5 py-0.5 rounded-full shadow-2xs border border-current">
                    {act.badge}
                  </span>
                )}
              </div>
              <div>
                <div className="font-extrabold text-xs sm:text-sm leading-tight truncate">
                  {act.title}
                </div>
                <div className="text-[10px] opacity-75 truncate mt-0.5 font-medium">
                  {act.subtitle}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
