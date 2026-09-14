import React, { useState } from 'react';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { AlertsProvider, useAlerts } from './contexts/AlertsContext';

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

import { Mic, Sparkles } from 'lucide-react';

const AppContent: React.FC = () => {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [isVoiceModalOpen, setIsVoiceModalOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleNavigate = (tab: string) => {
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-stone-100 font-sans text-stone-900 antialiased selection:bg-emerald-200">
      {/* Top Navbar */}
      <Navbar
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
        onOpenAdminModal={() => setIsAdminModalOpen(true)}
        onOpenProfileModal={() => setIsProfileModalOpen(true)}
        activeTab={activeTab}
        setActiveTab={handleNavigate}
      />

      {/* Main Body with Desktop Sidebar + Content Area */}
      <div className="flex-1 flex w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 gap-6">
        {/* Desktop / Tablet Sidebar (hidden on mobile, and hidden on pure landing page if user wants full-width) */}
        {activeTab !== 'landing' && (
          <Sidebar activeTab={activeTab} setActiveTab={handleNavigate} />
        )}

        {/* Dynamic Page Container */}
        <main
          className={`flex-1 min-w-0 transition-all ${
            activeTab === 'landing' ? 'w-full' : ''
          }`}
        >
          {activeTab === 'landing' && (
            <LandingPage
              onGetStarted={() => handleNavigate('dashboard')}
              onExploreFeatures={(feat) => handleNavigate(feat)}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            />
          )}

          {activeTab === 'dashboard' && (
            <DashboardPage
              onNavigate={handleNavigate}
              onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
            />
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

      {/* Mobile Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={handleNavigate}
        onOpenVoiceModal={() => setIsVoiceModalOpen(true)}
      />

      {/* Footer & Agricultural Extension Disclaimer */}
      <FooterDisclaimer />

      {/* Modals */}
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
