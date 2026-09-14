import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import {
  Sprout,
  Lock,
  Phone,
  Eye,
  EyeOff,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Globe,
  UserPlus,
} from 'lucide-react';

interface SignUpPageProps {
  onNavigate: (tab: string) => void;
  onRegisteredSuccess: () => void;
}

export const SignUpPage: React.FC<SignUpPageProps> = ({ onNavigate, onRegisteredSuccess }) => {
  const { language, setLanguage, t } = useLanguage();
  const { signUp, isLoading } = useAuth();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(true);

  const [errors, setErrors] = useState<{
    identifier?: string;
    password?: string;
    confirmPassword?: string;
    terms?: string;
    general?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validate = (): boolean => {
    const errs: {
      identifier?: string;
      password?: string;
      confirmPassword?: string;
      terms?: string;
    } = {};
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

    if (!confirmPassword) {
      errs.confirmPassword = (t as any).auth?.errRequiredField || 'Please confirm your password';
    } else if (confirmPassword !== password) {
      errs.confirmPassword = (t as any).auth?.errPasswordMismatch || 'Passwords do not match';
    }

    if (!acceptTerms) {
      errs.terms = language === 'ta' ? 'விதிமுறைகளை ஏற்க வேண்டும்' : 'Please accept the advisory terms';
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    if (!validate()) return;

    setIsSubmitting(true);
    const result = await signUp(identifier, password);
    setIsSubmitting(false);

    if (result.success) {
      onRegisteredSuccess();
    } else {
      const authObj = (t as any).auth;
      let msg = authObj?.errAccountExists || 'An account with this mobile/email already exists.';
      if (result.error === 'ACCOUNT_EXISTS') {
        msg = authObj?.errAccountExists || 'An account with this mobile/email already exists. Please log in.';
      }
      setErrors({ general: msg });
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

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200/80 overflow-hidden">
          {/* Progress Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-6 sm:p-7 text-center relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600/60 border border-emerald-400/30 text-emerald-100 shadow-inner mb-2.5">
              <UserPlus className="w-6 h-6 text-emerald-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {auth.registerTitle || 'Farmer Registration'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xs mx-auto">
              {auth.registerSubtitle || 'Create your free smart farming account for tailored field advisory'}
            </p>

            {/* Stepper indicator */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <div className="flex items-center gap-1.5 bg-emerald-900/80 border border-emerald-500/40 rounded-full px-3 py-0.5 text-[11px] font-bold text-amber-300">
                <span className="w-4 h-4 rounded-full bg-amber-400 text-stone-900 flex items-center justify-center text-[10px]">1</span>
                <span>{language === 'ta' ? 'படி 1: கணக்கு' : 'Step 1: Account'}</span>
              </div>
              <div className="w-4 border-t border-emerald-500/60" />
              <div className="flex items-center gap-1.5 opacity-60 text-[11px] text-emerald-200 font-medium">
                <span className="w-4 h-4 rounded-full bg-emerald-800 text-emerald-300 flex items-center justify-center text-[10px]">2</span>
                <span>{language === 'ta' ? 'படி 2: பண்ணை விவரங்கள்' : 'Step 2: Farm Profile'}</span>
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-6 sm:p-8 space-y-5">
            {errors.general && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            <form onSubmit={handleSignUp} className="space-y-4">
              {/* Identifier */}
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
                    placeholder={auth.identifierPlaceholder || 'e.g. 9842176540'}
                    className={`w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none transition-colors ${
                      errors.identifier
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-stone-300 focus:border-emerald-600'
                    }`}
                  />
                </div>
                {errors.identifier && (
                  <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.identifier}</p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {auth.passwordLabel || 'Password'}
                </label>
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
                    placeholder={auth.passwordPlaceholder || 'Min. 6 characters'}
                    className={`w-full pl-10 pr-11 py-2.5 bg-stone-50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none transition-colors ${
                      errors.password
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-stone-300 focus:border-emerald-600'
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

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  {auth.confirmPasswordLabel || 'Confirm Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                    <Lock className="w-4 h-4" />
                  </div>
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: undefined }));
                    }}
                    placeholder={auth.confirmPasswordPlaceholder || 'Re-enter password'}
                    className={`w-full pl-10 pr-11 py-2.5 bg-stone-50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none transition-colors ${
                      errors.confirmPassword
                        ? 'border-rose-400 focus:border-rose-500'
                        : 'border-stone-300 focus:border-emerald-600'
                    }`}
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                    aria-label={showConfirmPassword ? auth.hidePassword : auth.showPassword}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.confirmPassword}</p>
                )}
              </div>

              {/* Terms Checkbox */}
              <div className="pt-1">
                <label className="flex items-start gap-2 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={acceptTerms}
                    onChange={(e) => {
                      setAcceptTerms(e.target.checked);
                      if (errors.terms) setErrors((prev) => ({ ...prev, terms: undefined }));
                    }}
                    className="w-4 h-4 mt-0.5 rounded text-emerald-700 focus:ring-emerald-600 border-stone-300"
                  />
                  <span className="text-xs text-stone-600 leading-snug">
                    {language === 'ta'
                      ? 'தமிழ்நாடு வேளாண் மற்றும் உழவர் நலத்துறை வழிகாட்டுதல்களை ஏற்பதாக ஒப்புக்கொள்கிறேன்.'
                      : 'I agree to receive localized agro-advisories and accept the terms of service.'}
                  </span>
                </label>
                {errors.terms && (
                  <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.terms}</p>
                )}
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting || isLoading}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 active:bg-emerald-900 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 hover:shadow-lg disabled:opacity-50 mt-2"
              >
                {isSubmitting ? (
                  <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>
                    <span>{auth.registerButton || 'Create Account & Continue'}</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Link to Login */}
            <div className="pt-4 border-t border-stone-100 text-center">
              <p className="text-xs text-stone-600">
                {auth.alreadyHaveAccount || 'Already registered?'}{' '}
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
                >
                  {auth.loginHere || 'Log in here'}
                </button>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
