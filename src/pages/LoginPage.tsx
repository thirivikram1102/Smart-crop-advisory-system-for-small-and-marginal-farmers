import React, { useState, useEffect, useRef } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Sprout,
  Phone,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe,
  ArrowRight,
  ArrowLeft,
  RefreshCw,
  Edit2,
  Lock,
  MessageSquare,
  Check,
  MapPin,
  User,
  UserPlus,
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
  protectedNotice?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, protectedNotice }) => {
  const { language, setLanguage } = useLanguage();
  const { sendOtp, verifyOtp, isLoading } = useAuth();

  // Step 1: 'phone' | Step 2: 'otp'
  const [step, setStep] = useState<'phone' | 'otp'>('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [receivedOtp, setReceivedOtp] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [district, setDistrict] = useState('Thanjavur');
  const [isNewFarmer, setIsNewFarmer] = useState(false);

  // Timers & State
  const [timer, setTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const otpInputsRef = useRef<(HTMLInputElement | null)[]>([]);

  // Timer countdown for resend OTP
  useEffect(() => {
    let interval: any = null;
    if (step === 'otp' && timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      setCanResend(true);
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  // Clean phone input (digits only, max 10)
  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, '');
    if (raw.length <= 10) {
      setPhone(raw);
      setError(null);
    }
  };

  // Quick select sample mobile number
  const handleSelectSample = (samplePhone: string, sampleName: string, sampleDistrict: string) => {
    setPhone(samplePhone);
    setName(sampleName);
    setDistrict(sampleDistrict);
    setError(null);
  };

  // Submit phone to request OTP
  const handleRequestOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setError(null);

    const clean = phone.trim();
    if (!clean) {
      setError(
        language === 'ta'
          ? 'தயவுசெய்து உங்கள் 10-இலக்க மொபைல் எண்ணை உள்ளிடவும்'
          : 'Please enter your 10-digit mobile number'
      );
      return;
    }

    if (!/^[6-9]\d{9}$/.test(clean)) {
      setError(
        language === 'ta'
          ? 'சரியான இந்திய மொபைல் எண்ணை உள்ளிடவும் (6, 7, 8, 9-ல் தொடங்க வேண்டும்)'
          : 'Please enter a valid 10-digit Indian mobile number starting with 6, 7, 8, or 9'
      );
      return;
    }

    const res = await sendOtp(clean);
    if (res.success) {
      setReceivedOtp(res.otp || '123456');
      setStep('otp');
      setTimer(45);
      setCanResend(false);
      setSuccessMsg(
        language === 'ta'
          ? `சரிபார்ப்புக் குறியீடு +91 ${clean.slice(0, 5)} ${clean.slice(5)}-க்கு அனுப்பப்பட்டது.`
          : `OTP sent to +91 ${clean.slice(0, 5)} ${clean.slice(5)}.`
      );
      // Auto-focus first OTP input box
      setTimeout(() => {
        otpInputsRef.current[0]?.focus();
      }, 150);
    } else {
      setError(res.error || res.message || 'Failed to send OTP. Please try again.');
    }
  };

  // Handle single OTP box change with auto-focus next
  const handleOtpBoxChange = (index: number, val: string) => {
    const digit = val.replace(/\D/g, '').slice(-1);
    const newOtp = [...otp];
    newOtp[index] = digit;
    setOtp(newOtp);
    setError(null);

    if (digit && index < 5) {
      otpInputsRef.current[index + 1]?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpInputsRef.current[index - 1]?.focus();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted) {
      const newOtp = ['', '', '', '', '', ''];
      for (let i = 0; i < pasted.length; i++) {
        newOtp[i] = pasted[i];
      }
      setOtp(newOtp);
      const nextFocus = Math.min(pasted.length, 5);
      otpInputsRef.current[nextFocus]?.focus();
    }
  };

  // Auto-fill received OTP helper
  const handleAutoFillOtp = () => {
    if (receivedOtp && receivedOtp.length === 6) {
      const arr = receivedOtp.split('');
      setOtp(arr);
      otpInputsRef.current[5]?.focus();
    }
  };

  // Submit OTP Verification
  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const fullOtp = otp.join('');
    if (fullOtp.length !== 6) {
      setError(
        language === 'ta'
          ? 'தயவுசெய்து 6-இலக்க OTP குறியீட்டை முழுமையாக உள்ளிடவும்'
          : 'Please enter the complete 6-digit OTP code'
      );
      return;
    }

    const res = await verifyOtp(phone, fullOtp, name, district);
    if (res.success) {
      // Requirement 4: After successful OTP verification, open the dashboard with Smart Irrigation, Crop Management, Crop Recommendation, Disease Detection, and Profit Prediction features.
      onNavigate('dashboard');
    } else {
      setError(
        res.error ||
          (language === 'ta'
            ? 'தவறான குறியீடு. தயவுசெய்து மீண்டும் சரிபார்க்கவும்.'
            : 'Invalid or expired OTP. Please check the code and try again.')
      );
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    if (!canResend) return;
    setError(null);
    const res = await sendOtp(phone);
    if (res.success) {
      setReceivedOtp(res.otp || '123456');
      setTimer(45);
      setCanResend(false);
      setSuccessMsg(
        language === 'ta' ? 'புதிய OTP அனுப்பப்பட்டது!' : 'Fresh OTP sent successfully!'
      );
    } else {
      setError(res.error || 'Failed to resend OTP');
    }
  };

  return (
    <div className="min-h-[82vh] flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-md">
        {/* Top Floating Bar: Back Button in Left Corner & Language Switcher */}
        <div className="flex justify-between items-center mb-3">
          <button
            onClick={() => {
              if (step === 'otp') {
                setStep('phone');
                setError(null);
              } else {
                onNavigate('landing');
              }
            }}
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-black px-4 py-2 bg-white hover:bg-stone-50 text-stone-800 rounded-full border border-stone-300 shadow-sm transition-all hover:scale-105 active:scale-95 group"
            title={language === 'ta' ? 'பின்செல்க' : 'Go Back'}
          >
            <ArrowLeft className="w-4 h-4 text-emerald-700 group-hover:-translate-x-0.5 transition-transform" />
            <span>
              {step === 'otp'
                ? language === 'ta'
                  ? '← எண் மாற்று (Back to Phone)'
                  : '← Back to Phone'
                : language === 'ta'
                ? '← பின்செல் (Back to Home)'
                : '← Back to Home'}
            </span>
          </button>

          <button
            onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
            className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 rounded-full border border-stone-200 shadow-2xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'ta' ? 'English' : 'தமிழ் பதிப்பு'}</span>
          </button>
        </div>

        {/* Protected Notice Banner if redirected */}
        {protectedNotice && (
          <div className="mb-4 p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">
                {language === 'ta' ? 'பாதுகாக்கப்பட்ட பகுதி • உள்நுழைக' : 'Authentication Required'}
              </p>
              <p className="text-[11px] text-amber-800 mt-0.5">{protectedNotice}</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/90 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-br from-[#123824] via-[#1b4b32] to-[#0e2c1c] text-white p-6 sm:p-7 text-center relative overflow-hidden">
            {/* Prominent Back Button in Left Side Corner */}
            <button
              onClick={() => {
                if (step === 'otp') {
                  setStep('phone');
                  setError(null);
                } else {
                  onNavigate('landing');
                }
              }}
              className="absolute top-3.5 left-3.5 px-3 py-1.5 sm:px-3.5 sm:py-2 rounded-xl bg-black/35 hover:bg-black/50 text-white backdrop-blur-md border border-white/30 flex items-center gap-1.5 text-xs font-black transition-all z-20 shadow-md active:scale-95"
              title={language === 'ta' ? 'பின்செல்க' : 'Go Back'}
              aria-label="Back"
            >
              <ArrowLeft className="w-4 h-4 text-amber-300" />
              <span>{language === 'ta' ? 'பின்செல்' : 'Back'}</span>
            </button>

            {/* Background Pattern */}
            <div className="absolute -right-6 -bottom-6 opacity-10 pointer-events-none">
              <Sprout className="w-36 h-36 text-white" />
            </div>

            <div className="relative z-10 pt-2 sm:pt-0">
              <div className="inline-flex items-center justify-center w-13 h-13 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 text-emerald-300 shadow-inner mb-2.5">
                <Sprout className="w-7 h-7 text-amber-300" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white leading-tight">
                {language === 'ta' ? 'உழவர் போர்டல் உள்நுழைவு' : 'Farmer Portal Login'}
              </h2>
              <p className="text-xs text-emerald-100/90 mt-1 max-w-xs mx-auto leading-relaxed">
                {language === 'ta'
                  ? 'இந்திய மொபைல் எண் (+91) மூலம் பாதுகாப்பான OTP சரிபார்ப்பு'
                  : 'Secure Indian Mobile Number (+91) OTP Verification'}
              </p>

              <div className="mt-2.5 inline-flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-500/30 rounded-full px-3 py-0.5 text-[10px] font-semibold text-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {language === 'ta' ? 'தனித்தனி பாதுகாப்பான உழவர் கணக்கு' : 'Isolated Private Farmer Session'}
                </span>
              </div>
            </div>
          </div>

          {/* Form Body */}
          <div className="p-5 sm:p-7 space-y-4">
            {/* Segmented Switcher: Login vs Sign Up (Instant switch if user realized they need Sign Up) */}
            <div className="flex bg-stone-100 p-1 rounded-2xl border border-stone-200 shadow-inner">
              <button
                type="button"
                className="flex-1 py-2 text-xs sm:text-sm font-black rounded-xl bg-white text-emerald-900 shadow-xs flex items-center justify-center gap-1.5 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                <span>{language === 'ta' ? 'உள்நுழைவு (Login)' : 'Login'}</span>
              </button>
              <button
                type="button"
                onClick={() => onNavigate('register')}
                className="flex-1 py-2 text-xs sm:text-sm font-bold rounded-xl text-stone-600 hover:text-stone-900 hover:bg-white/70 flex items-center justify-center gap-1.5 transition-all"
              >
                <UserPlus className="w-3.5 h-3.5 text-stone-500" />
                <span>{language === 'ta' ? 'புதிய பதிவு (Sign Up)' : 'Sign Up'}</span>
              </button>
            </div>
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{error}</span>
              </div>
            )}

            {/* Success Message */}
            {successMsg && !error && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-800 flex items-start gap-2 animate-in fade-in">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-snug">{successMsg}</span>
              </div>
            )}

            {/* STEP 1: Enter Mobile Number */}
            {step === 'phone' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1.5">
                    {language === 'ta' ? 'இந்திய மொபைல் எண்' : 'Indian Mobile Number'}
                  </label>

                  <div className="flex rounded-xl border border-stone-300 focus-within:ring-2 focus-within:ring-emerald-600 focus-within:border-emerald-600 overflow-hidden shadow-2xs bg-white">
                    {/* Country Code Prefix */}
                    <div className="flex items-center gap-1.5 bg-stone-100 px-3 border-r border-stone-200 text-stone-800 select-none">
                      <span className="text-sm">🇮🇳</span>
                      <span className="text-xs font-black tracking-wide">+91</span>
                    </div>

                    <input
                      type="tel"
                      inputMode="numeric"
                      value={phone}
                      onChange={handlePhoneChange}
                      placeholder="98421 76540"
                      autoFocus
                      className="w-full text-sm sm:text-base font-bold text-stone-900 px-3.5 py-3 focus:outline-none placeholder:text-stone-400 placeholder:font-normal"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1">
                    <span>{language === 'ta' ? '10 இலக்க எண் (எ.கா: 9842176540)' : '10 digits without +91 or 0'}</span>
                  </p>
                </div>

                {/* Optional: Personalize Profile Name */}
                <div className="pt-1">
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setIsNewFarmer(!isNewFarmer)}
                      className="text-xs text-emerald-700 hover:text-emerald-900 font-bold flex items-center gap-1"
                    >
                      <User className="w-3.5 h-3.5" />
                      <span>
                        {isNewFarmer
                          ? language === 'ta' ? 'சுயவிவரப் பெயரை மறைக்க' : 'Hide Profile Name'
                          : language === 'ta' ? '+ பெயர் / மாவட்டம் சேர்க்க (விருப்பத்தேர்வு)' : '+ Add Name & District (Optional)'}
                      </span>
                    </button>
                  </div>

                  {isNewFarmer && (
                    <div className="mt-2.5 space-y-2.5 p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs animate-in fade-in">
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'உழவர் பெயர்' : 'Farmer Name'}
                        </label>
                        <input
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder={language === 'ta' ? 'எ.கா: செல்வம்' : 'e.g. Selvam'}
                          className="w-full p-2 bg-white rounded-lg border border-stone-300 focus:ring-1 focus:ring-emerald-600 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-bold text-stone-700 mb-1">
                          {language === 'ta' ? 'மாவட்டம்' : 'District'}
                        </label>
                        <select
                          value={district}
                          onChange={(e) => setDistrict(e.target.value)}
                          className="w-full p-2 bg-white rounded-lg border border-stone-300 focus:ring-1 focus:ring-emerald-600 focus:outline-none text-xs font-semibold"
                        >
                          <option value="Thanjavur">Thanjavur (தஞ்சாவூர்)</option>
                          <option value="Tiruvarur">Tiruvarur (திருவாரூர்)</option>
                          <option value="Nagapattinam">Nagapattinam (நாகப்பட்டினம்)</option>
                          <option value="Madurai">Madurai (மதுரை)</option>
                          <option value="Coimbatore">Coimbatore (கோயம்புத்தூர்)</option>
                          <option value="Dindigul">Dindigul (திண்டுக்கல்)</option>
                          <option value="Tiruchirappalli">Tiruchirappalli (திருச்சிராப்பள்ளி)</option>
                          <option value="Salem">Salem (சேலம்)</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || phone.length < 10}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{language === 'ta' ? 'OTP அனுப்பப்படுகிறது...' : 'Sending OTP...'}</span>
                    </>
                  ) : (
                    <>
                      <span>{language === 'ta' ? 'OTP பெறுக' : 'Get OTP Verification Code'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>

                {/* Feature highlights accessible upon login */}
                <div className="pt-3 border-t border-stone-100">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-2">
                    {language === 'ta' ? 'உள்நுழைந்த பின் கிடைக்கும் 5 முக்கிய அம்சங்கள்:' : '5 Core Features Unlocked on Dashboard:'}
                  </span>
                  <div className="grid grid-cols-2 gap-2 text-[11px] text-stone-700">
                    <div className="flex items-center gap-1.5 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 font-medium">
                      <span className="text-cyan-700 font-black">💧</span>
                      <span>{language === 'ta' ? 'நுண்ணறிவு பாசனம்' : 'Smart Irrigation'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 font-medium">
                      <span className="text-emerald-700 font-black">🌱</span>
                      <span>{language === 'ta' ? 'பயிர் மேலாண்மை' : 'Crop Management'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 font-medium">
                      <span className="text-teal-700 font-black">🌾</span>
                      <span>{language === 'ta' ? 'பயிர் பரிந்துரை' : 'Crop Recommendation'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 font-medium">
                      <span className="text-rose-700 font-black">🔬</span>
                      <span>{language === 'ta' ? 'இலை நோய் கண்டறிதல்' : 'Disease Detection'}</span>
                    </div>
                  </div>
                  <div className="mt-2 flex items-center gap-1.5 bg-emerald-50/60 p-2 rounded-lg border border-emerald-100 text-[11px] text-stone-700 font-medium">
                    <span className="text-lime-700 font-black">💰</span>
                    <span>{language === 'ta' ? 'லாபக் கணிப்பு (Profit Prediction & Economics)' : 'Profit Prediction & Economics'}</span>
                  </div>
                </div>
              </form>
            )}

            {/* STEP 2: Enter & Verify OTP */}
            {step === 'otp' && (
              <form onSubmit={handleVerifyOtp} className="space-y-4">
                {/* Target Phone Indicator with Edit Option */}
                <div className="flex items-center justify-between p-2.5 bg-emerald-50/80 border border-emerald-200 rounded-xl text-xs">
                  <div className="flex items-center gap-2">
                    <Phone className="w-3.5 h-3.5 text-emerald-700" />
                    <span className="font-extrabold text-emerald-950">
                      +91 {phone.slice(0, 5)} {phone.slice(5)}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setStep('phone');
                      setError(null);
                      setSuccessMsg(null);
                    }}
                    className="text-[11px] font-bold text-emerald-700 hover:text-emerald-900 flex items-center gap-1"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>{language === 'ta' ? 'எண் மாற்றுக' : 'Change'}</span>
                  </button>
                </div>

                {/* SMS OTP Simulation Notification Card */}
                {receivedOtp && (
                  <div className="p-3 bg-amber-50 border-2 border-amber-300 rounded-xl text-xs text-amber-950 space-y-1.5 shadow-2xs">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1.5 font-bold">
                        <MessageSquare className="w-3.5 h-3.5 text-amber-700" />
                        <span>{language === 'ta' ? 'உடனடி SMS அறிவிப்பு' : 'Live SMS OTP Code'}</span>
                      </div>
                      <span className="text-[9px] bg-amber-200 text-amber-900 font-extrabold px-1.5 py-0.5 rounded">
                        Valid for 5m
                      </span>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <div>
                        <span className="text-[10px] text-stone-600 block">
                          {language === 'ta' ? 'உங்கள் OTP குறியீடு:' : 'Your 6-Digit OTP:'}
                        </span>
                        <span className="text-xl font-black tracking-widest text-emerald-900 font-mono">
                          {receivedOtp}
                        </span>
                      </div>

                      <button
                        type="button"
                        onClick={handleAutoFillOtp}
                        className="px-2.5 py-1.5 bg-amber-400 hover:bg-amber-300 text-stone-950 font-black text-xs rounded-lg shadow-2xs transition-transform active:scale-95"
                      >
                        {language === 'ta' ? 'தானாக நிரப்புக' : 'Auto-Fill OTP'}
                      </button>
                    </div>
                  </div>
                )}

                {/* 6 Digit Input Boxes */}
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-2 text-center">
                    {language === 'ta' ? '6-இலக்க OTP குறியீட்டை உள்ளிடவும்' : 'Enter 6-Digit OTP Code'}
                  </label>

                  <div className="flex justify-between gap-1.5 sm:gap-2">
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (otpInputsRef.current[idx] = el)}
                        type="tel"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpBoxChange(idx, e.target.value)}
                        onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                        onPaste={handleOtpPaste}
                        className="w-11 sm:w-13 h-12 sm:h-14 text-center text-xl font-black text-stone-900 bg-stone-50 border-2 border-stone-300 rounded-xl focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all"
                      />
                    ))}
                  </div>
                </div>

                {/* Resend Timer */}
                <div className="flex items-center justify-between text-xs pt-1">
                  <span className="text-stone-500">
                    {language === 'ta' ? 'OTP வரவில்லையா?' : "Didn't receive code?"}
                  </span>
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResendOtp}
                      disabled={isLoading}
                      className="font-bold text-emerald-700 hover:underline flex items-center gap-1"
                    >
                      <RefreshCw className="w-3 h-3" />
                      <span>{language === 'ta' ? 'மீண்டும் அனுப்புக' : 'Resend OTP'}</span>
                    </button>
                  ) : (
                    <span className="text-stone-400 font-medium">
                      {language === 'ta' ? `மீண்டும் அனுப்ப ${timer} விநாடிகள்` : `Resend in ${timer}s`}
                    </span>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isLoading || otp.join('').length < 6}
                  className="w-full bg-emerald-800 hover:bg-emerald-700 disabled:bg-stone-300 disabled:cursor-not-allowed text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 min-h-[48px]"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>{language === 'ta' ? 'சரிபார்க்கப்படுகிறது...' : 'Verifying OTP...'}</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>
                        {language === 'ta'
                          ? 'சரிபார்த்து களப்பலகையைத் திறக்க'
                          : 'Verify & Open Farm Dashboard'}
                      </span>
                    </>
                  )}
                </button>
              </form>
            )}
            {/* New Farmer Sign Up Link */}
            <div className="pt-3 border-t border-stone-200/80 space-y-2 text-center">
              <div className="text-xs text-stone-600">
                <span>{language === 'ta' ? 'புதிய விவசாயியா?' : "Don't have an account yet?"}{' '}</span>
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="font-black text-emerald-800 hover:text-emerald-950 underline inline-flex items-center gap-1"
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>{language === 'ta' ? 'புதிய கணக்கு தொடங்க (Sign Up)' : 'Sign Up / Register Now'}</span>
                </button>
              </div>

              <div>
                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="text-[11px] font-bold text-stone-500 hover:text-emerald-800 transition-colors inline-flex items-center gap-1"
                >
                  <ArrowLeft className="w-3 h-3" />
                  <span>{language === 'ta' ? 'முகப்புப் பக்கம் செல்ல (Home Page)' : 'Return to Public Home Page'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Footer Highlights */}
          <div className="p-3.5 bg-stone-50 border-t border-stone-200/80 text-[11px] text-stone-500 flex items-center justify-center gap-4 flex-wrap">
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'ta' ? 'தனிநபர் தகவல் பாதுகாப்பு' : 'Strict Data Privacy'}</span>
            </span>
            <span className="flex items-center gap-1">
              <Lock className="w-3.5 h-3.5 text-emerald-600" />
              <span>{language === 'ta' ? 'OTP அங்கீகாரம்' : '2-Factor OTP Security'}</span>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
