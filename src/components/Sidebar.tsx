import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
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
  X,
  User,
  LogIn,
  LogOut,
  Globe,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onOpenVoiceModal?: () => void;
  onOpenAdminModal?: () => void;
  onOpenProfileModal?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  isOpenMobile = false,
  onCloseMobile,
  onOpenVoiceModal,
  onOpenAdminModal,
  onOpenProfileModal,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { farmer, isAuthenticated, logout } = useAuth();
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
      badge: 'தமிழ் AI',
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
      {/* Mobile Drawer Backdrop */}
      {isOpenMobile && (
        <div
          onClick={() => onCloseMobile?.()}
          className="fixed inset-0 bg-stone-950/70 z-50 lg:hidden backdrop-blur-xs transition-opacity"
          aria-hidden="true"
        />
      )}

      {/* Sidebar / Mobile Drawer Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 bottom-0 z-50 lg:z-30 w-72 sm:w-80 lg:w-64 bg-white border-r border-stone-200 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpenMobile ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
        style={{ height: '100dvh' }}
      >
        {/* Drawer Header (Mobile visible) */}
        <div className="p-4 border-b border-stone-200 bg-emerald-900 text-white flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-emerald-700 text-white flex items-center justify-center">
              <Sprout className="w-5 h-5 text-emerald-200" />
            </div>
            <div>
              <h2 className="font-extrabold text-sm text-white leading-tight">
                {language === 'ta' ? 'உழவன் வழிகாட்டி' : 'Smart Crop Advisory'}
              </h2>
              <p className="text-[10px] text-emerald-200 leading-none">
                {language === 'ta' ? 'விவசாய சேவைகள்' : 'Agri Services'}
              </p>
            </div>
          </div>

          <button
            onClick={() => onCloseMobile?.()}
            className="min-w-[40px] min-h-[40px] flex items-center justify-center rounded-lg bg-emerald-800 text-emerald-100 hover:bg-emerald-700"
            aria-label="Close navigation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Farmer Profile Mini Header in Drawer */}
        {isAuthenticated && farmer ? (
          <div className="p-3.5 bg-emerald-50/70 border-b border-emerald-100 flex items-center justify-between">
            <button
              onClick={() => {
                setActiveTab('profile');
                onCloseMobile?.();
              }}
              className="flex items-center gap-2.5 text-left min-w-0 flex-1 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                {farmer.name ? farmer.name[0].toUpperCase() : 'F'}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-black text-stone-900 truncate">{farmer.name}</p>
                <p className="text-[10px] text-stone-500 truncate">
                  {farmer.district} • {farmer.farmSizeAcres || 2} Ac
                </p>
              </div>
            </button>
          </div>
        ) : (
          <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center gap-2">
            <button
              onClick={() => {
                setActiveTab('login');
                onCloseMobile?.();
              }}
              className="flex-1 min-h-[36px] bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1.5 shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'உள்நுழைக' : 'Log In'}</span>
            </button>
            <button
              onClick={() => {
                setActiveTab('register');
                onCloseMobile?.();
              }}
              className="flex-1 min-h-[36px] bg-white hover:bg-stone-50 text-stone-800 border border-stone-300 text-xs font-bold rounded-lg flex items-center justify-center gap-1.5"
            >
              <span>{language === 'ta' ? 'பதிவு' : 'Sign Up'}</span>
            </button>
          </div>
        )}

        {/* Navigation Items */}
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
                  onCloseMobile?.();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-colors text-left min-h-[44px] ${
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
                      item.badgeColor ||
                      (isActive
                        ? 'bg-emerald-600 text-white'
                        : 'bg-stone-100 text-stone-600')
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Bottom Drawer Actions */}
        <div className="p-3 border-t border-stone-200 bg-stone-50 space-y-2">
          {/* Quick Language Toggle inside Drawer */}
          <button
            onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
            className="w-full flex items-center justify-between py-2 px-3 bg-white hover:bg-stone-100 text-stone-800 text-xs font-semibold rounded-lg border border-stone-200 min-h-[38px]"
          >
            <div className="flex items-center gap-2">
              <Globe className="w-3.5 h-3.5 text-emerald-700" />
              <span>{language === 'ta' ? 'Language / மொழி' : 'Language'}</span>
            </div>
            <span className="font-bold text-emerald-700">
              {language === 'ta' ? 'English' : 'தமிழ்'}
            </span>
          </button>

          {/* Admin shortcut */}
          <button
            onClick={() => {
              onOpenAdminModal?.();
              onCloseMobile?.();
            }}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 bg-white hover:bg-emerald-50 text-emerald-900 text-xs font-bold rounded-lg border border-emerald-200 shadow-2xs min-h-[38px]"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-emerald-600" />
            <span>{t.nav.admin}</span>
          </button>

          {isAuthenticated && (
            <button
              onClick={() => {
                logout();
                setActiveTab('login');
                onCloseMobile?.();
              }}
              className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs text-rose-600 hover:text-rose-700 font-bold min-h-[36px]"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>{language === 'ta' ? 'வெளியேறு (Logout)' : 'Log Out'}</span>
            </button>
          )}
        </div>
      </aside>
    </>
  );
};
