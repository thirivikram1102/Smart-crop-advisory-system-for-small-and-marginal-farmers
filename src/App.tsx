import React, { useState, useEffect } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlertsProvider } from './contexts/AlertsContext';

import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { FooterDisclaimer } from './components/FooterDisclaimer';
import { TamilVoiceAssistantModal } from './components/TamilVoiceAssistantModal';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { FarmerProfileModal } from './components/FarmerProfileModal';

import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './pages/DashboardPage';
import { CropRecommendationPage } from './pages/CropRecommendationPage';
import { DiseaseDetectionPage } from './pages/DiseaseDetectionPage';
import { DiseaseAlertsPage } from './pages/DiseaseAlertsPage';
import { IrrigationPage } from './pages/IrrigationPage';
import { ProfitPredictionPage } from './pages/ProfitPredictionPage';
import { CropManagementPage } from './pages/CropManagementPage';
import { MarketPage } from './pages/MarketPage';
import { WeatherPage } from './pages/WeatherPage';

// Auth & Profile Pages
import { LoginPage } from './pages/LoginPage';
import { SignUpPage } from './pages/SignUpPage';
import { FarmerOnboardingPage } from './pages/FarmerOnboardingPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { FarmerProfilePage } from './pages/FarmerProfilePage';

import { Mic } from 'lucide-react';

const PROTECTED_TABS = new Set([
  'dashboard',
  'crop-recommendation',
  'disease-detection',
  'alerts',
  'irrigation',
  'profit-prediction',
  'crop-management',
  'yield-prediction',
  'market',
  'weather',
  'profile',
]);

const AUTH_PAGES = new Set(['login', 'register', 'forgot-password', 'onboarding', 'landing']);

const AppContent: React.FC = () => {
  const { language } = useLanguage();
  const { isAuthenticated, pendingUserId } = useAuth();

  // Initial tab: If user has a pending onboarding session, go to onboarding;
  // else if authenticated, go to dashboard; otherwise start at login or landing.
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (pendingUserId) return 'onboarding';
    return isAuthenticated ? 'dashboard' : 'login';
  });

  const [protectedNotice, setProtectedNotice] = useState<string | null>(null);
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Synchronize active tab with authentication status
  useEffect(() => {
    if (pendingUserId && activeTab !== 'onboarding') {
      setActiveTab('onboarding');
      return;
    }

    if (!isAuthenticated && PROTECTED_TABS.has(activeTab)) {
      setProtectedNotice(
        language === 'ta'
          ? 'இந்த விவசாய அம்சத்தைப் பயன்படுத்த தயவுசெய்து உள்நுழையவும்.'
          : 'Please log in to access this farming feature.'
      );
      setActiveTab('login');
    }
  }, [isAuthenticated, pendingUserId]);

  const handleNavigate = (tab: string) => {
    // If not authenticated and attempting to access a protected farming tab:
    if (!isAuthenticated && PROTECTED_TABS.has(tab)) {
      const notice =
        language === 'ta'
          ? 'களப்பலகை மற்றும் விவசாய சேவைகளைப் பெற முதலில் உள்நுழையவும் அல்லது புதிய கணக்கு தொடங்கவும்.'
          : 'Please log in or register first to access the dashboard and farming features.';
      setProtectedNotice(notice);
      setActiveTab('login');
      setIsMobileSidebarOpen(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Clear protected notice on valid explicit navigation
    setProtectedNotice(null);
    setActiveTab(tab);
    setIsMobileSidebarOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const isAuthOrLanding = AUTH_PAGES.has(activeTab);
  const showSidebar = !isAuthOrLanding && isAuthenticated;

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 font-sans text-stone-900 antialiased selection:bg-emerald-200">
      {/* Top Navbar with Profile Icon and Farmer Name */}
      <Navbar
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        onToggleMobileSidebar={() => setIsMobileSidebarOpen((prev) => !prev)}
        isMobileSidebarOpen={isMobileSidebarOpen}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
      />

      {/* Main Body with Desktop Sidebar + Content Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6">
        {/* Desktop / Tablet Sidebar (hidden on auth pages and landing) */}
        {showSidebar && (
          <Sidebar
            activeTab={activeTab}
            setActiveTab={handleNavigate}
            isOpenMobile={isMobileSidebarOpen}
            onCloseMobile={() => setIsMobileSidebarOpen(false)}
            onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            onOpenAdminModal={() => setIsAdminModalOpen(true)}
            onOpenProfileModal={() => setIsProfileModalOpen(true)}
          />
        )}

        {/* Dynamic Page Container */}
        <main className={`flex-1 min-w-0 transition-all ${isAuthOrLanding ? 'w-full' : ''}`}>
          {/* Public Landing Page */}
          {activeTab === 'landing' && (
            <LandingPage
              onGetStarted={() => handleNavigate(isAuthenticated ? 'dashboard' : 'login')}
              onExploreFeatures={(feat) => handleNavigate(feat)}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            />
          )}

          {/* Authentication Pages */}
          {activeTab === 'login' && (
            <LoginPage onNavigate={handleNavigate} protectedNotice={protectedNotice} />
          )}

          {activeTab === 'register' && (
            <SignUpPage
              onNavigate={handleNavigate}
              onRegisteredSuccess={() => handleNavigate('onboarding')}
            />
          )}

          {activeTab === 'onboarding' && (
            <FarmerOnboardingPage onComplete={() => handleNavigate('dashboard')} />
          )}

          {activeTab === 'forgot-password' && (
            <ForgotPasswordPage onNavigate={handleNavigate} />
          )}

          {/* Farmer Profile / Account Page */}
          {activeTab === 'profile' && <FarmerProfilePage onNavigate={handleNavigate} />}

          {/* Protected Farming Modules */}
          {activeTab === 'dashboard' && (
            <DashboardPage onNavigate={handleNavigate} onOpenVoiceModal={() => setIsVoiceModalOpen(true)} />
          )}

          {activeTab === 'crop-recommendation' && <CropRecommendationPage />}
          {activeTab === 'disease-detection' && <DiseaseDetectionPage />}
          {activeTab === 'alerts' && <DiseaseAlertsPage />}
          {activeTab === 'irrigation' && <IrrigationPage />}
          {activeTab === 'profit-prediction' && <ProfitPredictionPage />}
          {activeTab === 'crop-management' && <CropManagementPage />}
          {activeTab === 'market' && <MarketPage />}
          {activeTab === 'weather' && <WeatherPage />}
        </main>
      </div>

      {/* Floating Persistent Voice Assistant Button */}
      <button
        onClick={() => setIsVoiceModalOpen(true)}
        className="fixed bottom-20 lg:bottom-8 right-4 sm:right-8 z-40 flex items-center gap-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-stone-950 font-black px-4 sm:px-5 py-3 rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 group border-2 border-white"
        aria-label="Open Tamil Voice Assistant"
      >
        <div className="w-8 h-8 rounded-full bg-stone-950 text-amber-400 flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform">
          <Mic className="w-4 h-4" />
        </div>
        <div className="text-left">
          <span className="text-xs sm:text-sm block leading-none font-black">
            {language === 'ta' ? 'பேசுங்கள்' : 'Voice Help'}
          </span>
          <span className="text-[10px] text-stone-800 font-semibold leading-none">
            {language === 'ta' ? 'தமிழ் குரல் AI' : 'Tamil AI'}
          </span>
        </div>
      </button>

      {/* Mobile Bottom Navigation (Visible for authenticated users or on dashboard) */}
      {isAuthenticated && (
        <BottomNav
          activeTab={activeTab}
          setActiveTab={handleNavigate}
          onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        />
      )}

      {/* Footer & Agricultural Extension Disclaimer */}
      <FooterDisclaimer />

      {/* Modals (preserved so no existing functionality is lost) */}
      <TamilVoiceAssistantModal
        isOpen={isVoiceModalOpen}
        onClose={() => setIsVoiceModalOpen(false)}
        onNavigateToTab={handleNavigate}
      />

      <AdminDashboardModal
        isOpen={isAdminModalOpen}
        onClose={() => setIsAdminModalOpen(false)}
      />

      <FarmerProfileModal
        isOpen={isProfileModalOpen}
        onClose={() => setIsProfileModalOpen(false)}
      />
    </div>
  );
};

export default function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AlertsProvider>
          <AppContent />
        </AlertsProvider>
      </AuthProvider>
    </LanguageProvider>
  );
}
