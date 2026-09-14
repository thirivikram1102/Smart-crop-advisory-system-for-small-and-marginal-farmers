import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAlerts } from '../contexts/AlertsContext';
import {
  LayoutDashboard,
  Sprout,
  ScanEye,
  AlertOctagon,
  Droplets,
  CalendarCheck2,
  TrendingUp,
  Calculator,
  CloudSun,
  Store,
  Mic,
  Tractor,
  ShieldAlert,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
  onOpenVoiceModal: () => void;
  onOpenAdminModal: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile,
  onCloseMobile,
  onOpenVoiceModal,
  onOpenAdminModal,
}) => {
  const { language, t } = useLanguage();
  const { unreadCount } = useAlerts();

  const navigationItems = [
    {
      id: 'dashboard',
      label: t.nav.dashboard,
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'crop-recommendation',
      label: t.nav.cropRecommendation,
      icon: Sprout,
      badge: 'AI',
    },
    {
      id: 'disease-detection',
      label: t.nav.diseaseDetection,
      icon: ScanEye,
      badge: 'Vision',
    },
    {
      id: 'alerts',
      label: t.nav.diseaseAlerts,
      icon: AlertOctagon,
      badge: unreadCount > 0 ? `${unreadCount}` : null,
      badgeColor: 'bg-red-500 text-white',
    },
    {
      id: 'irrigation',
      label: t.nav.irrigation,
      icon: Droplets,
      badge: null,
    },
    {
      id: 'crop-management',
      label: t.nav.cropManagement,
      icon: CalendarCheck2,
      badge: null,
    },
    {
      id: 'yield-prediction',
      label: t.nav.yieldPrediction,
      icon: TrendingUp,
      badge: null,
    },
    {
      id: 'profit-prediction',
      label: t.nav.profitPrediction,
      icon: Calculator,
      badge: '₹',
    },
    {
      id: 'weather',
      label: t.nav.weather,
      icon: CloudSun,
      badge: null,
    },
    {
      id: 'market',
      label: t.nav.marketPrices,
      icon: Store,
      badge: null,
    },
    {
      id: 'voice-assistant',
      label: t.nav.voiceAssistant,
      icon: Mic,
      badge: 'தமிழ்',
      badgeColor: 'bg-amber-400 text-stone-950 font-bold',
      action: onOpenVoiceModal,
    },
    {
      id: 'profile',
      label: t.nav.myFarm,
      icon: Tractor,
      badge: null,
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-stone-900/60 z-40 lg:hidden backdrop-blur-xs"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-16 left-0 bottom-0 z-40 w-64 bg-white border-r border-stone-200 flex flex-col transition-transform duration-200 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-3 border-b border-stone-100 bg-stone-50/70">
          <div className="text-[11px] font-bold text-stone-500 uppercase tracking-wider px-2">
            {language === 'ta' ? 'விவசாய வழிகாட்டி மெனு' : 'Agricultural Navigation'}
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (item.action) {
                    item.action();
                  } else {
                    setActiveTab(item.id);
                  }
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left ${
                  isActive
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-stone-700 hover:bg-emerald-50 hover:text-emerald-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon
                    className={`w-4 h-4 shrink-0 ${
                      isActive ? 'text-white' : 'text-emerald-700'
                    }`}
                  />
                  <span className="truncate">{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-bold shrink-0 ${
                      item.badgeColor || (isActive ? 'bg-emerald-600 text-white' : 'bg-stone-100 text-stone-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Agricultural Officer Admin shortcut */}
        <div className="p-3 border-t border-stone-200 bg-stone-50">
          <button
            onClick={() => {
              onOpenAdminModal();
              onCloseMobile();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-800 text-xs font-bold rounded-lg border border-emerald-200 shadow-2xs transition-colors"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.nav.admin}</span>
          </button>
          <p className="text-[10px] text-stone-500 text-center mt-1.5">
            TNAU / KVK Verified Advice
          </p>
        </div>
      </aside>
    </>
  );
};
