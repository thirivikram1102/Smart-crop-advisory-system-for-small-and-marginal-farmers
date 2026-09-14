import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Sprout,
  Lock,
  Mail,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Globe,
  HelpCircle,
} from 'lucide-react';

interface LoginPageProps {
  onNavigate: (tab: string) => void;
  protectedNotice?: string | null;
}

export const LoginPage: React.FC<LoginPageProps> = ({ onNavigate, protectedNotice }) => {
  const { language, setLanguage, t } = useLanguage();
  const { login, loginAsDemo, isLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Form validation errors
  const [errors, setErrors] = useState<{ identifier?: string; password?: string; general?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: { identifier?: string; password?: string } = {};
    const trimmedId = identifier.trim();

    if (!trimmedId) {
      errs.identifier = (t as any).auth?.errIdentifierRequired || 'Please enter your mobile number or email';
    } else {
      const isPhone = /^[6-9]\d{9}$/.test(trimmedId);
      const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedId);
      if (!isPhone && !isEmail) {
        errs.identifier = (t as any).auth?.errInvalidIdentifier || 'Please enter a valid 10-digit mobile number or valid email address';
      }
    }

    if (!password) {
      errs.password = (t as any).auth?.errPasswordRequired || 'Please enter your password';
    } else if (password.length < 6) {
      errs.password = (t as any).auth?.errPasswordTooShort || 'Password must be at least 6 characters long';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await login(identifier, password, rememberMe);
    setIsSubmitting(false);

    if (result.success) {
      onNavigate('dashboard');
    } else {
      const authObj = (t as any).auth;
      let msg = authObj?.errInvalidCredentials || 'Invalid mobile/email or password.';
      if (result.error === 'INVALID_CREDENTIALS') {
        msg = authObj?.errAccountNotFound || 'No registered account found with this contact. Please sign up.';
      } else if (result.error === 'WRONG_PASSWORD') {
        msg = authObj?.errInvalidCredentials || 'Incorrect password. Please try again or click Forgot Password.';
      }
      setErrors({ general: msg });
    }
  };

  const handleDemoLogin = async () => {
    setIsSubmitting(true);
    const ok = await loginAsDemo();
    setIsSubmitting(false);
    if (ok) {
      onNavigate('dashboard');
    }
  };

  const auth = (t as any).auth || {};

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-3 sm:px-6 py-6 sm:py-10">
      <div className="w-full max-w-md">
        {/* Top Floating Language Switcher */}
        <div className="flex justify-end mb-3">
          <button
            onClick={() => setLanguage(language === 'ta' ? 'en' : 'ta')}
            className="flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 bg-white hover:bg-stone-50 text-stone-700 rounded-full border border-stone-200 shadow-2xs transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600" />
            <span>{language === 'ta' ? 'English' : 'தமிழ் மொழிக்கு மாற்றுக'}</span>
          </button>
        </div>

        {/* Protected Notice Banner if redirected */}
        {protectedNotice && (
          <div className="mb-4 p-3 bg-amber-50 border border-amber-300 rounded-2xl text-xs text-amber-900 flex items-start gap-2.5 shadow-2xs animate-in fade-in">
            <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">{language === 'ta' ? 'உள்நுழைவு தேவை' : 'Authentication Required'}</p>
              <p className="text-[11px] text-amber-800">{protectedNotice}</p>
            </div>
          </div>
        )}

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-6 sm:p-8 text-center relative">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-emerald-600/60 border border-emerald-400/30 text-emerald-100 shadow-inner mb-3">
              <Sprout className="w-8 h-8 text-emerald-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {auth.loginTitle || 'Farmer Portal Login'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xs mx-auto">
              {auth.loginSubtitle || 'Sign in to access personalized agro-climatic advisory and farm insights'}
            </p>
            <div className="mt-3 inline-flex items-center gap-1.5 bg-emerald-900/60 border border-emerald-600/40 rounded-full px-3 py-1 text-[11px] font-medium text-emerald-200">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
              <span>{language === 'ta' ? 'பாதுகாப்பான உழவர் சேவை' : 'Secure Agricultural Access'}</span>
            </div>
          </div>

          {/* Form */}
          <div className="p-6 sm:p-8 space-y-5">
            {errors.general && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {/* Identifier (Phone or Email) */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {auth.identifierLabel || 'Mobile Number or Email'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    type="text"
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: undefined }));
                    }}
                    placeholder={auth.identifierPlaceholder || 'e.g. 9842176540 or farmer@example.com'}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none transition-colors ${
                      errors.identifier
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400'
                        : 'border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                    }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.identifier}</p>
                )}
              </div>

              {/* Password with Visibility Toggle */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider">
                    {auth.passwordLabel || 'Password'}
                  </label>
                  <button
                    type="button"
                    onClick={() => onNavigate('forgot-password')}
                    className="text-xs font-semibold text-emerald-700 hover:text-emerald-800 hover:underline"
                  >
                    {auth.forgotPasswordLink || 'Forgot password?'}
                  </button>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
                    }}
                    placeholder={auth.passwordPlaceholder || 'Enter password'}
                    className={`w-full pl-10 pr-11 py-2.5 bg-stone-50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none transition-colors ${
                      errors.password
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-400'
                        : 'border-stone-300 focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                    aria-label={showPassword ? auth.hidePassword : auth.showPassword}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.password}</p>
                )}
              </div>

              {/* Remember Me Option */}
              <div className="flex items-center justify-between pt-1">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded text-emerald-700 focus:ring-emerald-600 border-stone-300"
                  />
                  <span className="text-xs text-stone-600 font-medium">
                    {auth.rememberMe || 'Remember me for 30 days'}
                  </span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{auth.loginButton || 'Log In to Dashboard'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Login Option */}
            <div className="pt-2">
              <div className="relative flex items-center justify-center my-4">
                <div className="border-t border-stone-200 w-full" />
                <span className="bg-white px-3 text-[11px] font-bold text-stone-400 uppercase tracking-wider">
                  {language === 'ta' ? 'அல்லது மாதிரி உள்நுழைவு' : 'Or Instant Access'}
                </span>
              </div>

              <button
                type="button"
                onClick={handleDemoLogin}
                disabled={isSubmitting || isLoading}
                className="w-full py-2.5 px-4 bg-amber-50 hover:bg-amber-100 text-amber-950 border border-amber-300/80 font-bold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-center gap-2 group"
              >
                <Sparkles className="w-4 h-4 text-amber-600 group-hover:rotate-12 transition-transform" />
                <span>{auth.demoLoginButton || 'Instant Demo Login (Ravi Kumar - Thanjavur)'}</span>
              </button>
              <p className="text-[10px] text-stone-500 text-center mt-1">
                {auth.demoLoginDesc || 'Explore the platform immediately with pre-loaded delta farmland data'}
              </p>
            </div>

            {/* Link to Register */}
            <div className="pt-3 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-600">
                {auth.dontHaveAccount || "Don't have an account?"}{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('register')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  {auth.signUpNow || 'Sign up now'}
                </button>
              </p>
              <div className="mt-2">
                <button
                  type="button"
                  onClick={() => onNavigate('landing')}
                  className="text-[11px] text-stone-400 hover:text-stone-600 underline"
                >
                  {language === 'ta' ? '← பொது அறிமுக பக்கத்திற்குச் செல்' : '← Back to Public Landing Page'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
