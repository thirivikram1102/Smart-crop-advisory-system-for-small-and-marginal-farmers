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
    <nav
      className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-200 shadow-lg px-1 py-1 flex items-center justify-around"
      style={{ paddingBottom: 'max(0.25rem, env(safe-area-inset-bottom))' }}
    >
      <button
        onClick={() => setActiveTab('dashboard')}
        className={`flex flex-col items-center justify-center py-1 px-1 flex-1 min-w-0 min-h-[44px] text-[9px] sm:text-[10px] transition-colors ${
          activeTab === 'dashboard' ? 'text-emerald-700 font-bold' : 'text-stone-500 font-medium'
        }`}
      >
        <LayoutDashboard className="w-5 h-5 mb-0.5 shrink-0" />
        <span className="truncate max-w-full">{language === 'ta' ? 'முகப்பு' : 'Home'}</span>
      </button>

      <button
        onClick={() => setActiveTab('crop-recommendation')}
        className={`flex flex-col items-center justify-center py-1 px-1 flex-1 min-w-0 min-h-[44px] text-[9px] sm:text-[10px] transition-colors ${
          activeTab === 'crop-recommendation' ? 'text-emerald-700 font-bold' : 'text-stone-500 font-medium'
        }`}
      >
        <Sprout className="w-5 h-5 mb-0.5 shrink-0" />
        <span className="truncate max-w-full">{language === 'ta' ? 'பயிர்' : 'Crop'}</span>
      </button>

      {/* Center scan plant disease action button */}
      <button
        onClick={() => setActiveTab('disease-detection')}
        className="flex flex-col items-center justify-center -mt-5 bg-emerald-700 hover:bg-emerald-600 active:scale-95 text-white rounded-full w-12 h-12 shrink-0 shadow-md border-3 border-white transition-transform"
        aria-label="Scan Plant Disease"
      >
        <ScanEye className="w-5 h-5" />
        <span className="text-[8px] font-black leading-none mt-0.5">
          {language === 'ta' ? 'ஸ்கேன்' : 'Scan'}
        </span>
      </button>

      <button
        onClick={() => setActiveTab('alerts')}
        className={`relative flex flex-col items-center justify-center py-1 px-1 flex-1 min-w-0 min-h-[44px] text-[9px] sm:text-[10px] transition-colors ${
          activeTab === 'alerts' ? 'text-emerald-700 font-bold' : 'text-stone-500 font-medium'
        }`}
      >
        <div className="relative">
          <AlertOctagon className="w-5 h-5 mb-0.5 shrink-0" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-2 w-3.5 h-3.5 bg-red-500 text-white rounded-full text-[8px] font-black flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </div>
        <span className="truncate max-w-full">{language === 'ta' ? 'எச்சரிக்கை' : 'Alerts'}</span>
      </button>

      <button
        onClick={onOpenVoiceModal}
        className="flex flex-col items-center justify-center py-1 px-1 flex-1 min-w-0 min-h-[44px] text-[9px] sm:text-[10px] font-bold text-amber-800"
      >
        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center mb-0.5 shrink-0">
          <Mic className="w-3.5 h-3.5 text-amber-800" />
        </div>
        <span className="truncate max-w-full">{language === 'ta' ? 'குரல்' : 'Voice'}</span>
      </button>
    </nav>
  );
};
