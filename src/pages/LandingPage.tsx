import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Sprout,
  ScanEye,
  Mic,
  AlertOctagon,
  Droplets,
  TrendingUp,
  Calculator,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Users,
  Compass,
  Sparkles,
} from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
  onExploreFeatures: (featureId: string) => void;
  onOpenVoiceModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onExploreFeatures,
  onOpenVoiceModal,
}) => {
  const { language, t } = useLanguage();

  const features = [
    {
      id: 'crop-recommendation',
      icon: Sprout,
      title: language === 'ta' ? 'அறிவார்ந்த பயிர் பரிந்துரை' : 'Crop Recommendation',
      desc:
        language === 'ta'
          ? 'மண் வகை, சத்துக்கள் (NPK), கார அமில நிலை, மற்றும் பருவகால மழைக்கேற்ற பயிர்களை தேர்ந்தெடுங்கள்.'
          : 'AI matching based on soil NPK, pH, seasonal rainfall, and market economics for Tamil Nadu agro-zones.',
    },
    {
      id: 'disease-detection',
      icon: ScanEye,
      title: language === 'ta' ? 'இலை நோய் கண்டறிதல்' : 'Leaf Disease Detection',
      desc:
        language === 'ta'
          ? 'இலையின் புகைப்படத்தை பதிவேற்றி துல்லியமான நோய் அறிக்கை, இயற்கை மற்றும் அங்கீகரிக்கப்பட்ட மருந்துகளை பெறுங்கள்.'
          : 'Instant computer vision leaf diagnosis with confidence scores, organic controls, and safe chemical advice.',
    },
    {
      id: 'voice-assistant',
      icon: Mic,
      title: language === 'ta' ? 'தமிழ் குரல் உதவியாளர்' : 'Tamil Voice Assistant',
      desc:
        language === 'ta'
          ? 'எளிய கிராமப்புற தமிழில் பேசி பயிர், பாசனம், உரம் மற்றும் சந்தை விலை பற்றிய உடனடி பதில்களை குரல் வழியே கேளுங்கள்.'
          : 'Natural Tamil speech interaction with speech-to-text and audio playback for small and marginal farmers.',
      highlight: true,
    },
    {
      id: 'alerts',
      icon: AlertOctagon,
      title: language === 'ta' ? 'கிராம அளவிலான நோய் எச்சரிக்கை' : 'Village Disease Alerts',
      desc:
        language === 'ta'
          ? 'உங்கள் கிராமம் மற்றும் மாவட்டத்தில் பரவும் பூச்சி தாக்குதல்கள் பற்றிய முன்கூட்டிய எச்சரிக்கைகள்.'
          : 'Hyperlocal disease surveillance tracking pest outbreaks across neighboring villages to protect crops early.',
    },
    {
      id: 'irrigation',
      icon: Droplets,
      title: language === 'ta' ? 'நுண்ணிய பாசன வழிகாட்டி' : 'Smart Irrigation Advice',
      desc:
        language === 'ta'
          ? 'மண் ஈரப்பதம் மற்றும் 48 மணி நேர மழை வாய்ப்பை கணக்கில் கொண்டு துல்லியமான பாசன அட்டவணை.'
          : 'Precision water scheduling factoring in evapotranspiration, rainfall forecast, and soil moisture.',
    },
    {
      id: 'profit-prediction',
      icon: Calculator,
      title: language === 'ta' ? 'சாகுபடி செலவு & லாபக் கணிப்பு' : 'Yield & Profit Calculator',
      desc:
        language === 'ta'
          ? 'விதை, உரம், உழைப்பு செலவுகளை உள்ளிட்டு முன்கூட்டியே நிகர லாபம் மற்றும் நட்டமில்லா விலையை கணக்கிடுங்கள்.'
          : 'Granular cost of cultivation budgeting, production forecast, break-even price, and profit margin analysis.',
    },
  ];

  const steps = [
    {
      step: '01',
      title: language === 'ta' ? 'நில விவரங்களை உள்ளிடுங்கள்' : 'Enter Farm Details',
      desc: language === 'ta' ? 'மாவட்டம், மண் வகை மற்றும் பாசன வசதியை குறிப்பிடுங்கள்.' : 'Select district, village, soil type, and irrigation source.',
    },
    {
      step: '02',
      title: language === 'ta' ? 'பயிர் பரிந்துரை பெறுங்கள்' : 'Get Crop Recommendation',
      desc: language === 'ta' ? 'உங்கள் நிலத்திற்கு அதிக லாபம் தரும் முதல் 3 பயிர்களை காண்க.' : 'Receive top 3 ranked crops tailored to your soil fertility.',
    },
    {
      step: '03',
      title: language === 'ta' ? 'இலை படம் பதிவேற்றுங்கள்' : 'Upload Leaf Photo',
      desc: language === 'ta' ? 'பயிரில் பூச்சி அல்லது நோய் தென்பட்டால் புகைப்படம் எடுக்கவும்.' : 'Snap a leaf photo when symptoms or pests appear in field.',
    },
    {
      step: '04',
      title: language === 'ta' ? 'துல்லிய தீர்வு வழிகாட்டுதல்' : 'Receive Diagnosis & Care',
      desc: language === 'ta' ? 'நோய் பெயர், தீவிரம் மற்றும் கட்டுப்படுத்தும் முறைகளை உடனடியாக அறியவும்.' : 'Instant AI diagnosis with certified treatment and hygiene steps.',
    },
    {
      step: '05',
      title: language === 'ta' ? 'எச்சரிக்கைகள் & பாசனம் கண்காணிக்க' : 'Monitor Alerts & Irrigation',
      desc: language === 'ta' ? 'அருகாமை கிராம நோய் பரவல் மற்றும் மழை சார்ந்த பாசனத்தை பின்பற்றவும்.' : 'Stay ahead of local pest outbreaks and water wisely.',
    },
    {
      step: '06',
      title: language === 'ta' ? 'மகசூல் & லாபத்தை கணித்திடுங்கள்' : 'Estimate Yield & Profit',
      desc: language === 'ta' ? 'சாகுபடி செலவுகளை பகுப்பாய்வு செய்து கூடுதல் லாபம் ஈட்டுங்கள்.' : 'Optimize farm expenses and plan market selling timing.',
    },
  ];

  return (
    <div className="space-y-16 py-4 sm:py-8">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 text-white shadow-xl">
        {/* Background Subtle Pattern */}
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:16px_16px]" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-8 py-12 sm:py-16 text-center space-y-6">
          <div className="inline-flex items-center gap-2 bg-emerald-800/80 border border-emerald-700/80 px-3 py-1.5 rounded-full text-xs sm:text-sm font-semibold text-emerald-200">
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>
              {language === 'ta'
                ? 'தமிழ்நாடு சிறு மற்றும் குறு விவசாயிகளுக்கான அதிநவீன வழிகாட்டி'
                : 'Empowering Small & Marginal Farmers Across Tamil Nadu'}
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight text-white max-w-4xl mx-auto">
            {language === 'ta' ? (
              <>
                புத்திசாலி விவசாயம். <br />
                <span className="text-emerald-400">சிறந்த முடிவுகள்.</span> அதிக லாபம்.
              </>
            ) : (
              <>
                Smart Farming. <br />
                <span className="text-emerald-400">Better Decisions.</span> Higher Profits.
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
            {language === 'ta'
              ? 'விவசாயிகள் பல செயலிகளைத் தேட வேண்டிய அவசியமின்றி — பயிர் தேர்வு, இலை நோய் பரிசோதனை, தமிழ் குரல் வழிகாட்டி, பாசனம் மற்றும் லாபக் கணக்கீடு அனைத்தும் ஒரே எளிய தளத்தில்.'
              : 'An all-in-one intelligent crop advisory platform designed to help small and marginal farmers make better farming decisions with Tamil voice interaction.'}
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
            <button
              onClick={onGetStarted}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-7 py-3.5 rounded-2xl text-base shadow-lg transition-all hover:scale-105 active:scale-95"
            >
              <span>{language === 'ta' ? 'களப்பலகைக்குச் செல்க' : 'Get Started (Dashboard)'}</span>
              <ArrowRight className="w-5 h-5" />
            </button>

            <button
              onClick={onOpenVoiceModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 bg-emerald-800 hover:bg-emerald-700 text-white font-bold px-6 py-3.5 rounded-2xl text-base border border-emerald-600/60 transition-colors"
            >
              <Mic className="w-5 h-5 text-amber-300" />
              <span>{language === 'ta' ? 'தமிழில் பேசிப்பாருங்கள்' : 'Try Tamil Voice Assistant'}</span>
            </button>
          </div>

          {/* Trust badges */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-4 sm:gap-8 text-xs text-emerald-200 border-t border-emerald-800/80">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ta' ? '100% இலவச சேவை' : 'Open & Free Platform'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ta' ? 'முழுமையான தமிழ் மொழி உதவி' : 'Full Tamil Language Support'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>{language === 'ta' ? 'மொபைலில் எளிதான பயன்பாடு' : 'Mobile-First Design'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Vision Statement */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-stone-200 shadow-sm">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            {language === 'ta' ? 'விவசாயிகளின் சவால் & தீர்வு' : 'The Challenge & Our Unified Vision'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 leading-tight">
            {language === 'ta'
              ? 'விவசாயிகளுக்கு பல செயலிகள் தேவையில்லை. அனைத்தும் ஒரே இடத்தில்.'
              : 'One Platform for Complete Farming Support.'}
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            {language === 'ta'
              ? 'விவசாயிகள் வானிலைக்கு ஒரு செயலி, பயிர் நோய்க்கு ஒரு செயலி, சந்தை விலைக்கு வேறொரு தளம் என தடுமாறுகின்றனர். நமது அமைப்பு இந்த அனைத்து அத்தியாவசிய சேவைகளையும் எளிய தமிழ் மொழியில், குரல் வசதியுடன் ஒரே இடத்தில் வழங்குகிறது.'
              : 'Farmers often depend on multiple fragmented apps for weather, crop advice, disease identification, and market prices. Our system unifies these essential services into one accessible digital companion tailored for smallholders.'}
          </p>
        </div>
      </section>

      {/* Features Grid ("Everything You Need for Smarter Farming") */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
            {language === 'ta' ? 'புத்திசாலி விவசாயத்திற்கான முழுமையான அம்சங்கள்' : 'Everything You Need for Smarter Farming'}
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-xl mx-auto">
            {language === 'ta'
              ? 'பயிர் தேர்வு முதல் அறுவடை லாபம் வரை ஒவ்வொரு கட்டத்திலும் உழவர்களுக்கு துணை நிற்கும் கருவிகள்'
              : 'End-to-end agronomic support from seed sowing to harvest profit realization'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {features.map((feat) => {
            const Icon = feat.icon;
            return (
              <div
                key={feat.id}
                onClick={() => (feat.id === 'voice-assistant' ? onOpenVoiceModal() : onExploreFeatures(feat.id))}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between group ${
                  feat.highlight
                    ? 'bg-amber-50/70 border-amber-300 ring-1 ring-amber-400'
                    : 'bg-white border-stone-200 hover:border-emerald-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${
                        feat.highlight
                          ? 'bg-amber-400 text-stone-950 shadow-sm'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-bold text-emerald-700 group-hover:translate-x-1 transition-transform">
                      {language === 'ta' ? 'தொடங்குக →' : 'Launch →'}
                    </span>
                  </div>
                  <h3 className="font-extrabold text-base sm:text-lg text-stone-900 mb-1.5">
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">{feat.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* How It Works - 6 Steps */}
      <section className="bg-emerald-950 text-white rounded-3xl p-6 sm:p-10 shadow-lg space-y-8">
        <div className="text-center space-y-2 max-w-2xl mx-auto">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-400">
            {language === 'ta' ? 'செயல்முறை விளக்கம்' : 'Step-by-Step Workflow'}
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            {language === 'ta' ? 'எவ்வாறு செயல்படுகிறது?' : 'How It Works for Farmers'}
          </h2>
          <p className="text-xs sm:text-sm text-emerald-200">
            {language === 'ta'
              ? '6 எளிய படிகளில் உங்கள் விவசாயப் பணிகளை எளிதாக்குங்கள்'
              : 'Six clear steps to higher yield and smarter farm management'}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-emerald-900/70 border border-emerald-800 rounded-2xl p-4 sm:p-5 space-y-2 relative overflow-hidden"
            >
              <div className="text-2xl font-black text-amber-400 font-mono opacity-90">{s.step}</div>
              <h3 className="font-bold text-base text-white">{s.title}</h3>
              <p className="text-xs text-emerald-200 leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Final Call To Action */}
      <section className="text-center bg-gradient-to-r from-emerald-800 to-emerald-900 text-white rounded-3xl p-8 sm:p-12 shadow-lg space-y-5">
        <h2 className="text-2xl sm:text-4xl font-extrabold">
          {language === 'ta'
            ? 'உங்கள் புத்திசாலி விவசாய பயணத்தை இப்போதே தொடங்குங்கள்'
            : 'Start Your Smart Farming Journey Today'}
        </h2>
        <p className="text-xs sm:text-sm text-emerald-100 max-w-xl mx-auto leading-relaxed">
          {language === 'ta'
            ? 'தமிழ்நாட்டில் உள்ள ஆயிரக்கணக்கான சிறு மற்றும் குறு விவசாயிகளுக்கு உதவும் இலவச டிஜிட்டல் வழிகாட்டி.'
            : 'Free, accessible, voice-guided digital crop advisor built for smallholders.'}
        </p>
        <button
          onClick={onGetStarted}
          className="inline-flex items-center gap-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black px-8 py-3.5 rounded-2xl text-base shadow-md transition-transform hover:scale-105 active:scale-95"
        >
          <span>{language === 'ta' ? 'களப்பலகை திறக்க' : 'Open Farmer Dashboard'}</span>
          <ArrowRight className="w-5 h-5" />
        </button>
      </section>
    </div>
  );
};
