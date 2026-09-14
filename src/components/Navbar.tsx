import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useAlerts } from '../contexts/AlertsContext';
import {
  Sprout,
  Mic,
  Bell,
  Globe,
  User,
  CloudSun,
  AlertTriangle,
  Menu,
  X,
  ChevronDown,
  ShieldCheck,
  LogOut,
  LogIn,
  UserPlus,
} from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onOpenVoiceModal: () => void;
  onOpenAdminModal: () => void;
  onToggleMobileSidebar?: () => void;
  isMobileSidebarOpen?: boolean;
  onOpenProfileModal?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenVoiceModal,
  onOpenAdminModal,
  onToggleMobileSidebar,
  isMobileSidebarOpen = false,
  onOpenProfileModal,
}) => {
  const { language, setLanguage, t } = useLanguage();
  const { farmer, isAuthenticated, logout } = useAuth();
  const { notifications, unreadCount, markAsRead, markAllAsRead } = useAlerts();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const auth = (t as any).auth || {};

  return (
    <header className="sticky top-0 z-40 bg-emerald-900 text-white shadow-md">
      {/* Top emergency outbreak ticker */}
      <div className="bg-amber-500 text-stone-950 px-4 py-1 text-xs font-semibold flex items-center justify-between overflow-hidden">
        <div className="flex items-center gap-2 truncate">
          <AlertTriangle className="w-3.5 h-3.5 text-stone-950 shrink-0" />
          <span className="truncate">
            {language === 'ta'
              ? 'எச்சரிக்கை: தஞ்சாவூர் மற்றும் திண்டுக்கல் மாவட்டங்களில் புகையான் & இலை சுருட்டு வைரஸ் பரவல் கண்காணிக்கப்படுகிறது.'
              : 'Alert: Active pest surveillance in Thanjavur & Dindigul for BPH and Leaf Curl Virus.'}
          </span>
        </div>
        <button
          onClick={() => setActiveTab('alerts')}
          className="ml-2 underline hover:text-stone-800 shrink-0 text-xs font-bold"
        >
          {language === 'ta' ? 'விவரம் காண்க →' : 'View Alerts →'}
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Left: Mobile hamburger + App Branding */}
          <div className="flex items-center gap-3">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-lg bg-emerald-800 text-white hover:bg-emerald-700"
              aria-label="Toggle menu"
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <button
              onClick={() => setActiveTab(isAuthenticated ? 'dashboard' : 'landing')}
              className="flex items-center gap-2.5 text-left group"
            >
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-emerald-100 flex items-center justify-center shadow-inner group-hover:bg-emerald-500 transition-colors">
                <Sprout className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-tight">
                    {language === 'ta' ? 'உழவன் வழிகாட்டி' : 'Smart Crop Advisory'}
                  </span>
                  <span className="hidden sm:inline-block text-[10px] uppercase font-bold bg-emerald-700 text-emerald-200 px-1.5 py-0.5 rounded">
                    TN Agri
                  </span>
                </div>
                <p className="text-[11px] text-emerald-200 truncate max-w-[200px] sm:max-w-xs leading-none">
                  {language === 'ta' ? 'சிறு மற்றும் குறு விவசாயிகளுக்கான சேவை' : 'For Small & Marginal Farmers'}
                </p>
              </div>
            </button>
          </div>

          {/* Center/Right quick tools */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Weather pill */}
            {farmer && (
              <button
                onClick={() => setActiveTab('weather')}
                className="hidden md:flex items-center gap-1.5 bg-emerald-800/80 hover:bg-emerald-800 text-emerald-100 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors"
              >
                <CloudSun className="w-4 h-4 text-amber-300" />
                <span>31°C</span>
                <span className="text-emerald-300">•</span>
                <span className="truncate max-w-[90px]">{farmer?.district || 'Thanjavur'}</span>
              </button>
            )}

            {/* Tamil Voice Assistant Button */}
            <button
              onClick={onOpenVoiceModal}
              className="flex items-center gap-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-3 py-1.5 rounded-xl text-xs sm:text-sm shadow-sm transition-all hover:scale-105 active:scale-95 animate-voice-pulse"
              title="Tamil Voice Assistant"
            >
              <Mic className="w-4 h-4 text-stone-950" />
              <span>{language === 'ta' ? 'பேசுங்கள்' : 'Speak (Tamil)'}</span>
            </button>

            {/* Language Switcher */}
            <button
              onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
              className="flex items-center gap-1 bg-emerald-800 hover:bg-emerald-700 text-white px-2.5 py-1.5 rounded-lg text-xs font-semibold border border-emerald-700"
              title="Switch Language"
            >
              <Globe className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'ta' ? 'English' : 'தமிழ்'}</span>
            </button>

            {/* Notification Center Bell (only for authenticated users or show default notifications) */}
            {isAuthenticated && (
              <div className="relative">
                <button
                  onClick={() => setShowNotifications(!showNotifications)}
                  className="relative p-2 rounded-lg bg-emerald-800 hover:bg-emerald-700 text-emerald-100 transition-colors"
                  aria-label="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center shadow">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Popover */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white text-stone-900 rounded-xl shadow-2xl border border-stone-200 z-50 overflow-hidden animate-in fade-in zoom-in-95">
                    <div className="p-3 bg-emerald-900 text-white flex items-center justify-between">
                      <div className="flex items-center gap-2 font-bold text-sm">
                        <Bell className="w-4 h-4 text-emerald-300" />
                        <span>{t.nav.notifications}</span>
                        {unreadCount > 0 && (
                          <span className="bg-red-500 text-white text-xs px-1.5 py-0.2 rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllAsRead}
                          className="text-xs text-emerald-200 hover:text-white underline"
                        >
                          {language === 'ta' ? 'அனைத்தும் படித்ததாக குறி' : 'Mark all read'}
                        </button>
                      )}
                    </div>
                    <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                      {notifications.length === 0 ? (
                        <div className="p-4 text-center text-sm text-stone-500">
                          {language === 'ta' ? 'புதிய அறிவிப்புகள் ஏதுமில்லை' : 'No new notifications'}
                        </div>
                      ) : (
                        notifications.slice(0, 5).map((n) => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markAsRead(n.id);
                              if (n.category === 'disease') setActiveTab('alerts');
                              if (n.category === 'irrigation') setActiveTab('irrigation');
                              if (n.category === 'weather') setActiveTab('weather');
                              if (n.category === 'market') setActiveTab('market');
                              setShowNotifications(false);
                            }}
                            className={`p-3 text-xs cursor-pointer hover:bg-stone-50 transition-colors flex gap-2.5 ${
                              !n.read ? 'bg-emerald-50/60 font-medium' : ''
                            }`}
                          >
                            <div className="mt-0.5">
                              {n.severity === 'alert' && <AlertTriangle className="w-4 h-4 text-red-500 shrink-0" />}
                              {n.severity === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />}
                              {n.severity === 'info' && <Sprout className="w-4 h-4 text-emerald-600 shrink-0" />}
                            </div>
                            <div className="flex-1">
                              <div className="text-stone-900 font-semibold leading-tight">
                                {language === 'ta' ? n.titleTa : n.titleEn}
                              </div>
                              <div className="text-stone-600 text-[11px] mt-0.5 leading-snug">
                                {language === 'ta' ? n.messageTa : n.messageEn}
                              </div>
                              <div className="text-stone-400 text-[10px] mt-1">{n.timestamp}</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                    <div className="p-2 bg-stone-50 text-center border-t border-stone-200">
                      <button
                        onClick={() => {
                          setActiveTab('alerts');
                          setShowNotifications(false);
                        }}
                        className="text-xs text-emerald-700 font-bold hover:underline"
                      >
                        {language === 'ta' ? 'அனைத்து எச்சரிக்கைகளையும் காண்க →' : 'View all alerts →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Farmer Profile Menu (when logged in) OR Login/Register buttons (when logged out) */}
            {isAuthenticated && farmer ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-white text-xs font-semibold transition-all border border-emerald-700/60 shadow-inner"
                  title="Farmer Account Menu"
                >
                  {/* Farmer Profile Icon / Avatar with initial */}
                  <div className="w-7 h-7 rounded-lg bg-emerald-500 ring-2 ring-emerald-300/60 flex items-center justify-center text-white text-xs font-black shadow-xs">
                    {farmer.name ? farmer.name[0].toUpperCase() : 'R'}
                  </div>

                  {/* Farmer Name in Dashboard Header */}
                  <span className="hidden sm:inline truncate max-w-[120px] font-bold text-emerald-50">
                    {farmer.name}
                  </span>

                  <ChevronDown className="w-3.5 h-3.5 text-emerald-300" />
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-60 bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 z-50 overflow-hidden py-1">
                    <div className="px-3.5 py-3 border-b border-stone-100 bg-emerald-50/50">
                      <div className="flex items-center gap-2 mb-1">
                        <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-xs">
                          {farmer.name ? farmer.name[0] : 'R'}
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-extrabold text-stone-900 truncate">{farmer.name}</p>
                          <p className="text-[10px] text-stone-500 truncate">
                            {farmer.village ? `${farmer.village}, ` : ''}{farmer.district}
                          </p>
                        </div>
                      </div>
                      <span className="inline-block mt-1 text-[10px] bg-emerald-100 text-emerald-900 font-semibold px-2 py-0.5 rounded-full border border-emerald-200">
                        {farmer.farmSizeAcres} Acres • {farmer.mainCrop || farmer.mainCrops?.[0] || 'Paddy'}
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setActiveTab('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2.5 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2.5 font-medium"
                    >
                      <User className="w-4 h-4 text-emerald-700" />
                      <span>{language === 'ta' ? 'உழவர் சுயவிவரம் & கணக்கு' : 'Farmer Profile & Account'}</span>
                    </button>

                    <button
                      onClick={() => {
                        onOpenAdminModal?.();
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-stone-700 hover:bg-stone-50 flex items-center gap-2.5"
                    >
                      <ShieldCheck className="w-4 h-4 text-stone-500" />
                      <span>{t.nav.admin}</span>
                    </button>

                    <div className="border-t border-stone-100 my-1" />

                    <button
                      onClick={() => {
                        logout();
                        setActiveTab('login');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-3.5 py-2 text-xs text-rose-600 hover:bg-rose-50 flex items-center gap-2.5 font-bold"
                    >
                      <LogOut className="w-4 h-4 text-rose-600" />
                      <span>{auth.logoutButton || 'Log Out'}</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setActiveTab('login')}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-700 text-emerald-100 border border-emerald-700 transition-colors"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'உள்நுழைக' : 'Log In'}</span>
                </button>
                <button
                  onClick={() => setActiveTab('register')}
                  className="hidden sm:flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl bg-white text-emerald-900 hover:bg-emerald-50 transition-colors shadow-xs"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'பதிவு' : 'Sign Up'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

