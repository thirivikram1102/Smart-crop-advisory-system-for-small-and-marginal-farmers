import React, { useEffect, useState } from 'react';
import { useAlerts } from '../contexts/AlertsContext';
import { useLanguage } from '../contexts/LanguageContext';
import {
  Bell,
  X,
  CheckCircle2,
  AlertTriangle,
  Info,
  ShieldAlert,
  Sprout,
  ExternalLink,
  Volume2,
} from 'lucide-react';

interface PushNotificationToastBannerProps {
  onNavigateToAlerts?: () => void;
}

export const PushNotificationToastBanner: React.FC<PushNotificationToastBannerProps> = ({
  onNavigateToAlerts,
}) => {
  const { activeToast, dismissToast, markAsRead } = useAlerts();
  const { language } = useLanguage();

  const [progress, setProgress] = useState(100);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (!activeToast) return;
    setProgress(100);

    const DURATION_MS = 8000;
    const INTERVAL_MS = 100;
    const step = (INTERVAL_MS / DURATION_MS) * 100;

    const timer = setInterval(() => {
      if (!isPaused) {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            dismissToast();
            return 0;
          }
          return Math.max(0, prev - step);
        });
      }
    }, INTERVAL_MS);

    return () => clearInterval(timer);
  }, [activeToast, isPaused, dismissToast]);

  if (!activeToast) return null;

  const isAlert = activeToast.severity === 'alert';
  const isWarning = activeToast.severity === 'warning';

  const handleMarkRead = () => {
    markAsRead(activeToast.notifId);
    dismissToast();
  };

  const handleViewAlerts = () => {
    markAsRead(activeToast.notifId);
    dismissToast();
    if (onNavigateToAlerts) {
      onNavigateToAlerts();
    }
  };

  return (
    <div
      role="alert"
      aria-live="assertive"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="fixed top-3 right-3 sm:top-5 sm:right-5 z-50 max-w-md w-[calc(100vw-24px)] sm:w-full bg-white text-stone-900 rounded-2xl shadow-2xl border border-stone-200 overflow-hidden animate-in slide-in-from-top-4 duration-300 ring-1 ring-stone-900/10"
    >
      {/* Top Banner Header */}
      <div className="bg-stone-900 text-white px-3.5 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-emerald-600 flex items-center justify-center text-white">
            <Sprout className="w-3.5 h-3.5" />
          </div>
          <span className="font-extrabold tracking-wide text-emerald-300">
            {language === 'ta' ? 'உழவன் புஷ் அறிவிப்பு' : 'Smart Crop Advisory Push'}
          </span>
          <span className="text-stone-400">•</span>
          <span className="text-stone-400 text-[11px] flex items-center gap-1">
            <Volume2 className="w-3 h-3 text-emerald-400" />
            <span>{activeToast.timestamp}</span>
          </span>
        </div>

        <button
          onClick={dismissToast}
          aria-label="Dismiss notification"
          className="text-stone-400 hover:text-white p-1 rounded-md transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Main Toast Content */}
      <div className="p-4 space-y-3 bg-gradient-to-b from-white to-stone-50">
        <div className="flex items-start gap-3">
          <div
            className={`p-2 rounded-xl shrink-0 mt-0.5 ${
              isAlert
                ? 'bg-rose-100 text-rose-700 ring-2 ring-rose-200'
                : isWarning
                ? 'bg-amber-100 text-amber-800 ring-2 ring-amber-200'
                : 'bg-emerald-100 text-emerald-800 ring-2 ring-emerald-200'
            }`}
          >
            {isAlert ? (
              <ShieldAlert className="w-5 h-5" />
            ) : isWarning ? (
              <AlertTriangle className="w-5 h-5" />
            ) : (
              <Info className="w-5 h-5" />
            )}
          </div>

          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="inline-block bg-emerald-800 text-white text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
                🌾 {language === 'ta' ? activeToast.cropTa : activeToast.cropEn}
              </span>
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                  isAlert
                    ? 'bg-rose-100 text-rose-800'
                    : isWarning
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-stone-200 text-stone-700'
                }`}
              >
                {language === 'ta' ? 'தினசரி நோய் தடுப்பு' : 'Daily Prevention Tip'}
              </span>
            </div>

            <h4 className="font-extrabold text-sm sm:text-base text-stone-900 leading-snug">
              {language === 'ta' ? activeToast.titleTa : activeToast.titleEn}
            </h4>

            <p className="text-xs text-stone-600 leading-relaxed">
              {language === 'ta' ? activeToast.messageTa : activeToast.messageEn}
            </p>
          </div>
        </div>

        {/* Action Protocol Chip */}
        <div className="bg-emerald-50/80 border border-emerald-200/90 rounded-xl p-2.5 text-xs text-emerald-950 flex items-start gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <span className="font-black text-emerald-900 mr-1">
              {language === 'ta' ? 'உடனடி களப்பணி:' : 'Immediate Action:'}
            </span>
            <span>{language === 'ta' ? activeToast.actionTa : activeToast.actionEn}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-stone-200/60">
          <button
            onClick={handleMarkRead}
            className="text-xs font-bold text-stone-600 hover:text-stone-900 px-2.5 py-1.5 rounded-lg hover:bg-stone-200/60 transition-colors"
          >
            {language === 'ta' ? 'படித்ததாக குறி' : 'Mark as Read'}
          </button>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleViewAlerts}
              className="inline-flex items-center gap-1 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold text-xs px-3 py-1.5 rounded-lg shadow-xs transition-colors"
            >
              <span>{language === 'ta' ? 'அறிக்கைகளைப் பார்' : 'View Alerts'}</span>
              <ExternalLink className="w-3 h-3" />
            </button>
          </div>
        </div>
      </div>

      {/* Progress countdown bar */}
      <div className="w-full h-1 bg-stone-200">
        <div
          className={`h-full transition-all ease-linear ${
            isAlert ? 'bg-rose-500' : isWarning ? 'bg-amber-500' : 'bg-emerald-600'
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
};
