import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { DEMO_WEATHER } from '../services/marketWeatherService';
import {
  CloudSun,
  CloudRain,
  Wind,
  Droplets,
  CheckCircle2,
  AlertTriangle,
  Sun,
  Calendar,
} from 'lucide-react';

export const WeatherPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { farmer } = useAuth();

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <CloudSun className="w-3.5 h-3.5 text-amber-300" />
            <span>IMD Agro-Meteorological Advisory Bulletins</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.weather.title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t.weather.subtitle}
          </p>
        </div>
      </div>

      {/* Current Real-time Microclimate Card */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-stone-100 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
              <Sun className="w-9 h-9" />
            </div>
            <div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                {farmer?.district || 'Thanjavur'}, {farmer?.village || 'Thiruvaiyaru'}
              </span>
              <div className="text-4xl font-black text-stone-900 mt-0.5">
                {DEMO_WEATHER.tempC}°C
              </div>
              <div className="text-sm font-semibold text-stone-600">
                {language === 'ta' ? DEMO_WEATHER.conditionTa : DEMO_WEATHER.conditionEn}
              </div>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4 text-xs">
            <div className="bg-stone-50 p-3 rounded-xl text-center">
              <Droplets className="w-4 h-4 text-cyan-600 mx-auto mb-1" />
              <div className="text-[10px] text-stone-400 font-bold">{t.weather.humidity}</div>
              <div className="text-sm font-black text-stone-900">{DEMO_WEATHER.humidityPct}%</div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl text-center">
              <CloudRain className="w-4 h-4 text-amber-500 mx-auto mb-1" />
              <div className="text-[10px] text-stone-400 font-bold">{t.weather.rainChance}</div>
              <div className="text-sm font-black text-amber-600">{DEMO_WEATHER.rainProbabilityPct}%</div>
            </div>

            <div className="bg-stone-50 p-3 rounded-xl text-center">
              <Wind className="w-4 h-4 text-stone-500 mx-auto mb-1" />
              <div className="text-[10px] text-stone-400 font-bold">{t.weather.windSpeed}</div>
              <div className="text-sm font-black text-stone-900">{DEMO_WEATHER.windSpeedKmh} km/h</div>
            </div>
          </div>
        </div>

        {/* Agricultural Spraying and Farm Work Window */}
        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-emerald-950">
                {language === 'ta' ? 'பூச்சி மருந்து தெளிக்கும் சூழல்: சாதகமானது' : 'Pesticide Foliar Spray Window: Favorable'}
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {language === 'ta'
                  ? 'காற்றின் வேகம் 14 கி.மீ/மணி குறைவாக உள்ளதால் காலை 6:30 முதல் 9:00 மணி வரை தெளிக்கலாம். வியாழன் மழையை கருத்தில் கொண்டு முன்கூட்டியே முடிக்கவும்.'
                  : 'Wind speed is calm (<15 km/h). Ideal for foliar biological spraying between 6:30 AM – 9:00 AM before midday evaporation.'}
              </p>
            </div>
          </div>

          <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <h4 className="font-bold text-xs sm:text-sm text-amber-950">
                {language === 'ta' ? 'உர மேலுரமிடுதல் எச்சரிக்கை' : 'Top-dressing Fertilizer Advisory'}
              </h4>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                {language === 'ta'
                  ? 'நாளை மற்றும் வியாழன் அன்று இடியுடன் கூடிய மழை வாய்ப்புள்ளதால், யூரியா போன்ற நீரில் கரையும் உரங்களை இடுவதை 2 நாட்கள் ஒத்திவைக்கவும்.'
                  : 'Convective rainfall expected within 48h. Postpone urea top-dressing to prevent leaching losses.'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 5-Day Agro Forecast Cards */}
      <div className="space-y-4">
        <h3 className="font-extrabold text-base text-stone-900 flex items-center gap-2">
          <Calendar className="w-5 h-5 text-emerald-700" />
          <span>{t.weather.forecast5Day}</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {DEMO_WEATHER.forecast.map((day, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-center flex flex-col justify-between space-y-3 bg-white ${
                day.rainProb >= 50 ? 'border-amber-300 ring-1 ring-amber-300/50' : 'border-stone-200'
              }`}
            >
              <div>
                <span className="font-bold text-xs text-stone-800 block">
                  {language === 'ta' ? day.dayTa : day.dayEn}
                </span>
                <span className="text-[11px] text-stone-400">{day.date}</span>
              </div>

              <div className="w-10 h-10 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-amber-500">
                {day.rainProb >= 50 ? (
                  <CloudRain className="w-5 h-5 text-cyan-600" />
                ) : (
                  <Sun className="w-5 h-5 text-amber-500" />
                )}
              </div>

              <div>
                <div className="text-lg font-black text-stone-900">
                  {day.maxTemp}° <span className="text-xs text-stone-400 font-normal">/ {day.minTemp}°</span>
                </div>
                <div className="text-[11px] text-stone-600 mt-0.5 font-medium">
                  {language === 'ta' ? day.conditionTa : day.conditionEn}
                </div>
              </div>

              <div className="pt-2 border-t border-stone-100 text-[11px]">
                <span className="text-stone-400 block text-[10px]">Rain probability</span>
                <span
                  className={`font-black ${
                    day.rainProb >= 50 ? 'text-amber-600' : 'text-stone-700'
                  }`}
                >
                  {day.rainProb}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
