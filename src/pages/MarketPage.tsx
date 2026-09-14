import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { DEMO_MARKET_PRICES } from '../services/marketWeatherService';
import {
  TrendingUp,
  TrendingDown,
  Minus,
  Store,
  Filter,
  Calendar,
  ShieldCheck,
} from 'lucide-react';

export const MarketPage: React.FC = () => {
  const { language, t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState('All');

  const filteredPrices = DEMO_MARKET_PRICES.filter((p) => {
    if (selectedDistrict === 'All') return true;
    return p.district === selectedDistrict;
  });

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Store className="w-3.5 h-3.5 text-amber-300" />
            <span>Agmarknet & Daily Regulated Mandi Feeds</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.market.title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t.market.subtitle}
          </p>
        </div>
      </div>

      {/* Filter and Agmarknet Notice */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-emerald-600" />
          <span className="text-xs font-bold text-stone-700">{t.cropRec.district}:</span>
          <select
            value={selectedDistrict}
            onChange={(e) => setSelectedDistrict(e.target.value)}
            className="text-xs font-medium p-2 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
          >
            <option value="All">All Tamil Nadu Markets (அனைத்து சந்தைகள்)</option>
            <option value="Thanjavur">Thanjavur (தஞ்சாவூர்)</option>
            <option value="Dindigul">Dindigul (திண்டுக்கல்)</option>
            <option value="Tiruchirappalli">Tiruchirappalli (திருச்சி)</option>
            <option value="Madurai">Madurai (மதுரை)</option>
            <option value="Villupuram">Villupuram (விழுப்புரம்)</option>
            <option value="Salem">Salem (சேலம்)</option>
          </select>
        </div>

        <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5 text-stone-400" />
          <span>{language === 'ta' ? 'இன்றைய நேரடி சந்தை விலை பட்டியல்' : 'Updated Live from Uzhavar Sandhai & Mandis'}</span>
        </div>
      </div>

      {/* Market Prices Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {filteredPrices.map((item, idx) => {
          const isPositive = item.changePct > 0;
          const isNegative = item.changePct < 0;

          return (
            <div
              key={idx}
              className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs hover:shadow-md transition-all flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-extrabold text-base text-stone-900 leading-tight">
                      {language === 'ta' ? item.cropTa : item.cropEn}
                    </h3>
                    <div className="text-xs text-stone-500 mt-0.5">
                      {language === 'ta' ? item.mandiTa : item.mandiEn}
                    </div>
                  </div>

                  <div
                    className={`flex items-center gap-1 text-xs font-black px-2 py-0.5 rounded-full ${
                      isPositive
                        ? 'bg-emerald-100 text-emerald-800'
                        : isNegative
                        ? 'bg-red-100 text-red-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}
                  >
                    {isPositive ? (
                      <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
                    ) : isNegative ? (
                      <TrendingDown className="w-3.5 h-3.5 text-red-600" />
                    ) : (
                      <Minus className="w-3.5 h-3.5 text-stone-500" />
                    )}
                    <span>{item.changePct > 0 ? `+${item.changePct}%` : `${item.changePct}%`}</span>
                  </div>
                </div>

                {/* Price Details */}
                <div className="mt-4 flex items-baseline justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      {t.market.currentPrice}
                    </span>
                    <div className="text-2xl font-black text-stone-900">
                      ₹{item.modalPrice.toLocaleString()}
                    </div>
                    <div className="text-[11px] text-stone-500 font-medium">
                      {item.unit}
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 uppercase font-bold block">
                      Range (Min - Max)
                    </span>
                    <div className="text-xs font-extrabold text-stone-700">
                      ₹{item.minPrice} - ₹{item.maxPrice}
                    </div>
                    <div className="text-[10px] text-stone-400">{item.date}</div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
                <span>{item.district} District</span>
                <span className="font-semibold text-emerald-700">Modal Mandi Rate</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Advisory on Direct Farmer Markets (Uzhavar Sandhai) */}
      <div className="bg-emerald-50 border border-emerald-200 rounded-3xl p-5 text-xs text-emerald-950 flex items-start gap-3">
        <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-extrabold text-sm">
            {language === 'ta'
              ? 'உழவர் சந்தை & நேரடி கொள்முதல் நிலைய வழிகாட்டுதல்:'
              : 'Direct Procurement & Mandi Advisory:'}
          </p>
          <p className="text-stone-700 leading-relaxed">
            {language === 'ta'
              ? 'நெல் கொள்முதல் நிலையங்களில் (DPC) 17% ஈரப்பதத்திற்குள் கொண்டு வரும் நெல்லுக்கு உடனடியாக முழு கொள்முதல் விலை (MSP + தமிழ்நாடு அரசு ஊக்கத்தொகை) வழங்கப்படுகிறது. காய்கறிகளை உழவர் சந்தைகளில் இடைத்தரகர்கள் இன்றி விற்பனை செய்து 15-20% கூடுதல் வருவாய் பெறலாம்.'
              : 'Direct Purchase Centers (DPCs) strictly enforce 17% paddy moisture limit for immediate MSP settlement with state bonus. Farmers can sell fruits and vegetables in Uzhavar Sandhai without middlemen margins.'}
          </p>
        </div>
      </div>
    </div>
  );
};
