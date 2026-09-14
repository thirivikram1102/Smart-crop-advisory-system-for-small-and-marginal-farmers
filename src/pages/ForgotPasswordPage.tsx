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
  KeyRound,
  ArrowLeft,
  Globe,
  Sparkles,
} from 'lucide-react';

interface ForgotPasswordPageProps {
  onNavigate: (tab: string) => void;
}

export const ForgotPasswordPage: React.FC<ForgotPasswordPageProps> = ({ onNavigate }) => {
  const { language, setLanguage, t } = useLanguage();
  const { requestPasswordReset, resetPasswordWithOtp } = useAuth();

  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [identifier, setIdentifier] = useState('');
  const [otp, setOtp] = useState('');
  const [generatedOtp, setGeneratedOtp] = useState<string | null>(null);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const auth = (t as any).auth || {};

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    const cleanId = identifier.trim();

    if (!cleanId) {
      setErrors({ identifier: auth.errIdentifierRequired || 'Please enter mobile number or email' });
      return;
    }

    setIsSubmitting(true);
    const res = await requestPasswordReset(cleanId);
    setIsSubmitting(false);

    if (res.success && res.otp) {
      setGeneratedOtp(res.otp);
      setOtp(res.otp); // Pre-fill for user convenience in prototype demo
      setStep('reset');
    } else {
      setErrors({ general: auth.errAccountNotFound || 'No registered account found with this contact.' });
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const errs: Record<string, string> = {};
    if (!otp.trim()) errs.otp = auth.errRequiredField || 'Please enter OTP';
    if (!newPassword) {
      errs.newPassword = auth.errPasswordRequired || 'Please enter new password';
    } else if (newPassword.length < 6) {
      errs.newPassword = auth.errPasswordTooShort || 'Password must be at least 6 characters';
    }
    if (confirmPassword !== newPassword) {
      errs.confirmPassword = auth.errPasswordMismatch || 'Passwords do not match';
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setIsSubmitting(true);
    const res = await resetPasswordWithOtp(identifier, otp, newPassword);
    setIsSubmitting(false);

    if (res.success) {
      setStep('success');
    } else {
      setErrors({ general: auth.errInvalidOtp || 'Invalid or expired OTP' });
    }
  };

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
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-emerald-800 to-emerald-700 text-white p-6 sm:p-7 text-center relative">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-600/60 border border-emerald-400/30 text-emerald-100 shadow-inner mb-2.5">
              <KeyRound className="w-6 h-6 text-emerald-200" />
            </div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {step === 'reset'
                ? auth.resetPasswordTitle || 'Set New Password'
                : auth.forgotPasswordTitle || 'Forgot Password?'}
            </h2>
            <p className="text-xs sm:text-sm text-emerald-100/90 mt-1 max-w-xs mx-auto">
              {step === 'reset'
                ? auth.resetPasswordSubtitle || 'Enter verification code and choose new password'
                : auth.forgotPasswordSubtitle || 'Enter your registered contact to receive verification code'}
            </p>
          </div>

          <div className="p-6 sm:p-8 space-y-5">
            {errors.general && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errors.general}</span>
              </div>
            )}

            {/* STEP 1: Request OTP */}
            {step === 'request' && (
              <form onSubmit={handleRequestOtp} className="space-y-4">
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
                        if (errors.identifier) setErrors((prev) => ({ ...prev, identifier: '' }));
                      }}
                      placeholder={auth.identifierPlaceholder || 'e.g. 9842176540'}
                      className={`w-full pl-10 pr-3.5 py-2.5 bg-stone-50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none transition-colors ${
                        errors.identifier ? 'border-rose-400' : 'border-stone-300 focus:border-emerald-600'
                      }`}
                    />
                  </div>
                  {errors.identifier && (
                    <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.identifier}</p>
                  )}
                  <p className="mt-1.5 text-[11px] text-stone-500">
                    {language === 'ta'
                      ? 'பதிவுசெய்யப்பட்ட அலைபேசி எண்ணிற்கு 6 இலக்க சரிபார்ப்புக் குறியீடு அனுப்பப்படும்.'
                      : 'A 6-digit OTP will be generated to verify your identity.'}
                  </p>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{auth.sendOtpButton || 'Send Verification Code'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 2: Verify OTP & Set New Password */}
            {step === 'reset' && (
              <form onSubmit={handleResetPassword} className="space-y-4">
                {/* Simulated OTP notice box */}
                <div className="p-3 bg-amber-50 border border-amber-300 rounded-xl text-xs text-amber-900 space-y-1">
                  <div className="flex items-center gap-1.5 font-bold text-amber-950">
                    <Sparkles className="w-4 h-4 text-amber-600" />
                    <span>{auth.otpSentNotice || 'Verification code sent'}</span>
                  </div>
                  <p className="text-[11px] text-amber-800">
                    {language === 'ta' ? 'மாதிரி OTP குறியீடு:' : 'Demo Verification OTP:'}{' '}
                    <strong className="text-emerald-800 font-mono text-sm tracking-wider">
                      {generatedOtp || '123456'}
                    </strong>
                  </p>
                </div>

                {/* OTP Input */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    {auth.otpLabel || 'Verification Code (OTP)'}
                  </label>
                  <input
                    type="text"
                    maxLength={6}
                    value={otp}
                    onChange={(e) => {
                      setOtp(e.target.value);
                      if (errors.otp) setErrors((prev) => ({ ...prev, otp: '' }));
                    }}
                    placeholder={auth.otpPlaceholder || 'Enter 6-digit OTP'}
                    className={`w-full px-3.5 py-2.5 text-center tracking-widest font-mono text-lg bg-stone-50 border rounded-xl font-bold focus:bg-white focus:outline-none transition-colors ${
                      errors.otp ? 'border-rose-400' : 'border-stone-300 focus:border-emerald-600'
                    }`}
                  />
                  {errors.otp && <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.otp}</p>}
                </div>

                {/* New Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    {auth.newPasswordLabel || 'New Password'}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                      <Lock className="w-4 h-4" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (errors.newPassword) setErrors((prev) => ({ ...prev, newPassword: '' }));
                      }}
                      placeholder={auth.newPasswordPlaceholder || 'Min. 6 characters'}
                      className={`w-full pl-10 pr-11 py-2.5 bg-stone-50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none transition-colors ${
                        errors.newPassword ? 'border-rose-400' : 'border-stone-300 focus:border-emerald-600'
                      }`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.newPassword}</p>
                  )}
                </div>

                {/* Confirm New Password */}
                <div>
                  <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                    {auth.confirmPasswordLabel || 'Confirm Password'}
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (errors.confirmPassword) setErrors((prev) => ({ ...prev, confirmPassword: '' }));
                    }}
                    placeholder={auth.confirmPasswordPlaceholder || 'Re-enter password'}
                    className={`w-full px-3.5 py-2.5 bg-stone-50 border rounded-xl text-sm font-medium focus:bg-white focus:outline-none transition-colors ${
                      errors.confirmPassword ? 'border-rose-400' : 'border-stone-300 focus:border-emerald-600'
                    }`}
                  />
                  {errors.confirmPassword && (
                    <p className="mt-1 text-[11px] text-rose-600 font-semibold">{errors.confirmPassword}</p>
                  )}
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <span>{auth.resetButton || 'Reset Password'}</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* STEP 3: Success Screen */}
            {step === 'success' && (
              <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
                <div className="w-14 h-14 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-stone-900">
                    {language === 'ta' ? 'கடவுச்சொல் வெற்றிகரமாக மாற்றப்பட்டது!' : 'Password Reset Successfully!'}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1 max-w-xs mx-auto">
                    {auth.successReset || 'Your password has been updated. You can now log in to your account.'}
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('login')}
                  className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <span>{auth.backToLogin || 'Back to Login'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Bottom link to login */}
            {step !== 'success' && (
              <div className="pt-3 border-t border-stone-100 text-center">
                <button
                  type="button"
                  onClick={() => onNavigate('login')}
                  className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>{auth.backToLogin || 'Back to Login'}</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
