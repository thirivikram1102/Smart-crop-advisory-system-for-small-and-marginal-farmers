import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlerts } from '../contexts/AlertsContext';
import {
  LayoutDashboard,
  Sprout,
  ScanEye,
  AlertOctagon,
  Mic,
} from 'lucide-react';

interface BottomNavProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenVoiceModal: () => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  setActiveTab,
  onOpenVoiceModal,
}) => {
  const { language } = useLanguage();
  const { unreadCount } = useAlerts();

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg px-2 py-1.5 flex items-center justify-around">
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center p-1 min-w-[56px] text-[10px] font-medium transition-colors ${
          activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-stone-500'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5" />
        <span>{language === 'ta' ? 'முகப்பு' : 'Home'}</span>
      </button>

      <button
        onClick={() => setActiveTab('crop-recommendation')}
        className={`flex flex-col items-center justify-center p-1 min-w-[56px] text-[10px] font-medium transition-colors ${
          activeTab === 'crop-recommendation' ? 'text-emerald-700 font-bold' : 'text-stone-500'
        }`}
      >
        <Sprout className="w-5 h-5 mb-0.5" />
        <span>{language === 'ta' ? 'பயிர்' : 'Crop'}</span>
      </button>

      {/* Center scan plant disease action button */}
      <button
        onClick={() => setActiveTab('disease-detection')}
        className="flex flex-col items-center justify-center -mt-5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-full w-13 h-13 shadow-md border-4 border-white transition-transform active:scale-95"
        aria-label="Scan Plant Disease"
      >
        <ScanEye className="w-6 h-6" />
        <span className="text-[9px] font-extrabold">{language === 'ta' ? 'ஸ்கேன்' : 'Scan'}</span>
      </button>

      <button
        onClick={() => setActiveTab('alerts')}
        className={`relative flex flex-col items-center justify-center p-1 min-w-[56px] text-[10px] font-medium transition-colors ${
          activeTab === 'alerts' ? 'text-emerald-700 font-bold' : 'text-stone-500'
        }`}
      >
        <AlertOctagon className="w-5 h-5 mb-0.5" />
        <span>{language === 'ta' ? 'எச்சரிக்கை' : 'Alerts'}</span>
        {unreadCount > 0 && (
          <span className="absolute top-0 right-3 w-4 h-4 bg-red-500 text-white rounded-full text-[9px] font-bold flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </button>

      <button
        onClick={onOpenVoiceModal}
        className="flex flex-col items-center justify-center p-1 min-w-[56px] text-[10px] font-semibold text-amber-700 hover:text-amber-800"
      >
        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mb-0.5">
          <Mic className="w-3.5 h-3.5 text-amber-800" />
        </div>
        <span>{language === 'ta' ? 'பேசுங்கள்' : 'Voice'}</span>
      </button>
    </nav>
  );
};
