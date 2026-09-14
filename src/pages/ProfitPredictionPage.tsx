import React, { useState } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { YieldProfitInput, YieldProfitResult } from '../types';
import { calculateYieldAndProfit } from '../services/yieldProfitService';
import {
  Calculator,
  Coins,
  TrendingUp,
  TrendingDown,
  Layers,
  Sparkles,
  PieChart,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from 'lucide-react';

export const ProfitPredictionPage: React.FC = () => {
  const { language, t } = useLanguage();
  const { farmer } = useAuth();

  const [input, setInput] = useState<YieldProfitInput>({
    crop: 'Paddy',
    acres: farmer?.farmSizeAcres || 2,
    soilType: 'Clay Loam',
    season: 'Samba',
    expectedPricePerUnit: 2350, // ₹ per quintal (Govt MSP + bonus)
    priceUnit: '₹ / Quintal',
    costs: {
      landPreparation: 3500,
      seeds: 1800,
      fertilizers: 4800,
      pesticides: 2500,
      irrigation: 1500,
      labor: 9500,
      harvestingTransport: 3000,
      miscellaneous: 1000,
    },
  });

  const [result, setResult] = useState<YieldProfitResult>(() =>
    calculateYieldAndProfit(input)
  );

  const handleUpdateCost = (field: keyof typeof input.costs, val: number) => {
    const updated = {
      ...input,
      costs: {
        ...input.costs,
        [field]: val || 0,
      },
    };
    setInput(updated);
    setResult(calculateYieldAndProfit(updated));
  };

  const handleCropChange = (crop: string) => {
    let price = 2350;
    let unit = '₹ / Quintal';
    if (crop === 'Tomato') {
      price = 22;
      unit = '₹ / kg';
    } else if (crop === 'Banana') {
      price = 320;
      unit = '₹ / Bunch';
    } else if (crop === 'Cotton') {
      price = 7200;
      unit = '₹ / Quintal';
    }

    const updated = { ...input, crop, expectedPricePerUnit: price, priceUnit: unit };
    setInput(updated);
    setResult(calculateYieldAndProfit(updated));
  };

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="bg-emerald-900 text-white rounded-3xl p-6 sm:p-8 shadow-sm">
        <div className="max-w-3xl space-y-2">
          <div className="inline-flex items-center gap-2 bg-emerald-800 text-emerald-200 px-3 py-1 rounded-full text-xs font-semibold">
            <Calculator className="w-3.5 h-3.5 text-lime-300" />
            <span>Farm Cost Budgeting & Revenue Analytics</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
            {t.profit.title}
          </h1>
          <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
            {t.profit.subtitle}
          </p>
        </div>
      </div>

      {/* Main Grid: Parameters & Cost Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Inputs & Cost Items (7 cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-5">
          <h2 className="text-base font-black text-stone-900 flex items-center gap-2">
            <Coins className="w-5 h-5 text-emerald-600" />
            <span>{language === 'ta' ? 'பயிர் & சாகுபடி செலவுகள்' : 'Crop & Cultivation Expenses'}</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {t.cropRec.crop}
              </label>
              <select
                value={input.crop}
                onChange={(e) => handleCropChange(e.target.value)}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white focus:ring-2 focus:ring-emerald-600"
              >
                <option value="Paddy">Paddy (நெல்)</option>
                <option value="Tomato">Tomato (தக்காளி)</option>
                <option value="Banana">Banana (வாழை)</option>
                <option value="Cotton">Cotton (பருத்தி)</option>
                <option value="Groundnut">Groundnut (நிலக்கடலை)</option>
                <option value="Maize">Maize (மக்காச்சோளம்)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'ta' ? 'நிலப்பரப்பு (ஏக்கர்)' : 'Farm Size (Acres)'}
              </label>
              <input
                type="number"
                step="0.5"
                min="0.5"
                value={input.acres}
                onChange={(e) => {
                  const acres = parseFloat(e.target.value) || 1;
                  const updated = { ...input, acres };
                  setInput(updated);
                  setResult(calculateYieldAndProfit(updated));
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                {language === 'ta' ? `விற்பனை விலை (${input.priceUnit})` : `Selling Price (${input.priceUnit})`}
              </label>
              <input
                type="number"
                value={input.expectedPricePerUnit}
                onChange={(e) => {
                  const price = parseFloat(e.target.value) || 0;
                  const updated = { ...input, expectedPricePerUnit: price };
                  setInput(updated);
                  setResult(calculateYieldAndProfit(updated));
                }}
                className="w-full text-xs p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-600"
              />
            </div>
          </div>

          {/* Granular Cost Line-Items Per Acre */}
          <div className="space-y-3 pt-2">
            <div className="text-xs font-bold text-stone-700 flex justify-between items-center">
              <span>{language === 'ta' ? 'செலவு விவரங்கள் (ஏக்கருக்கு ₹):' : 'Itemized Costs per Acre (₹):'}</span>
              <span className="text-emerald-700 font-extrabold">
                {language === 'ta' ? 'மொத்தம்' : 'Total Cost'}: ₹{result.totalCost.toLocaleString()}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  {language === 'ta' ? 'உழவு & நிலம் தயாரிப்பு' : 'Plowing & Land Prep'}
                </label>
                <input
                  type="number"
                  value={input.costs.landPreparation}
                  onChange={(e) => handleUpdateCost('landPreparation', parseInt(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  {language === 'ta' ? 'விதை / நாற்று வாங்குதல்' : 'Seed / Seedlings'}
                </label>
                <input
                  type="number"
                  value={input.costs.seeds}
                  onChange={(e) => handleUpdateCost('seeds', parseInt(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  {language === 'ta' ? 'உரம் & தொழுவுரம்' : 'Fertilizer & Manure'}
                </label>
                <input
                  type="number"
                  value={input.costs.fertilizers}
                  onChange={(e) => handleUpdateCost('fertilizers', parseInt(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  {language === 'ta' ? 'பூச்சி மருந்து & பாதுகாப்பு' : 'Pesticides & Bio-control'}
                </label>
                <input
                  type="number"
                  value={input.costs.pesticides}
                  onChange={(e) => handleUpdateCost('pesticides', parseInt(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  {language === 'ta' ? 'பயிர்க்கூலி (நடவு, களை, பராமரிப்பு)' : 'Labor (Planting, Weeding)'}
                </label>
                <input
                  type="number"
                  value={input.costs.labor}
                  onChange={(e) => handleUpdateCost('labor', parseInt(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-stone-600 mb-0.5">
                  {language === 'ta' ? 'அறுவடை & வண்டி வாடகை' : 'Harvesting & Transport'}
                </label>
                <input
                  type="number"
                  value={input.costs.harvestingTransport}
                  onChange={(e) => handleUpdateCost('harvestingTransport', parseInt(e.target.value))}
                  className="w-full text-xs p-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Financial Profitability Summary (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="bg-white rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-sm space-y-4">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Financial Projections
            </span>

            {/* Big Net Profit Display */}
            <div>
              <div className="text-xs text-stone-500 font-semibold">{t.profit.netProfit} ({input.acres} {language === 'ta' ? 'ஏக்கர்' : 'Acres'})</div>
              <div
                className={`text-3xl sm:text-4xl font-black mt-1 ${
                  result.netProfit >= 0 ? 'text-emerald-700' : 'text-red-600'
                }`}
              >
                ₹{result.netProfit.toLocaleString()}
              </div>
              <div className="text-xs font-bold text-stone-600 mt-1 flex items-center gap-1.5">
                <span>{language === 'ta' ? 'ஏக்கருக்கு நிகர லாபம்:' : 'Net profit/acre:'}</span>
                <span className="text-emerald-700 font-black">₹{result.netProfitPerAcre.toLocaleString()}</span>
              </div>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-stone-100 text-xs">
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-500 block text-[10px]">{t.profit.totalCost}</span>
                <span className="font-extrabold text-stone-900 text-sm">₹{result.totalCost.toLocaleString()}</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-500 block text-[10px]">{t.profit.grossRevenue}</span>
                <span className="font-extrabold text-stone-900 text-sm">₹{result.grossRevenue.toLocaleString()}</span>
              </div>
              <div className="bg-emerald-50 p-3 rounded-xl">
                <span className="text-emerald-800 block text-[10px]">{t.profit.roi}</span>
                <span className="font-black text-emerald-700 text-sm">{result.roiPct}%</span>
              </div>
              <div className="bg-stone-50 p-3 rounded-xl">
                <span className="text-stone-500 block text-[10px]">{t.profit.breakEven}</span>
                <span className="font-black text-stone-800 text-sm">₹{result.breakEvenPricePerUnit}</span>
              </div>
            </div>

            {/* Yield Estimate Range */}
            <div className="bg-amber-50/50 p-3.5 rounded-xl border border-amber-200/70 text-xs text-amber-950 space-y-1">
              <div className="font-bold flex items-center justify-between">
                <span>{t.profit.estimatedYield} ({input.crop}):</span>
                <span className="font-black text-amber-900 text-sm">
                  {result.estimatedYieldTotal} {result.yieldUnit}
                </span>
              </div>
              <p className="text-[11px] text-stone-600">
                Range: {result.minYield} - {result.maxYield} {result.yieldUnit} based on TNAU average in Cauvery delta.
              </p>
            </div>
          </div>

          {/* Scenario Sensitivity Analysis */}
          <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-2xs space-y-3">
            <h4 className="font-extrabold text-xs text-stone-800">
              {language === 'ta' ? 'சந்தை விலை மாறுதல் வாய்ப்புகள் (Sensitivity Scenarios):' : 'Market Price Sensitivity Scenarios:'}
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-emerald-50 text-emerald-900">
                <span className="font-medium">{language === 'ta' ? 'உயர் விலை (+15% Demand)' : 'High Market Price (+15%)'}</span>
                <span className="font-black text-emerald-700">₹{result.scenarios.highPriceProfit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-stone-50 text-stone-800 font-bold">
                <span>{language === 'ta' ? 'சராசரி விலை (Current Rate)' : 'Normal Expected Price'}</span>
                <span className="font-black text-stone-900">₹{result.scenarios.normalPriceProfit.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-red-50 text-red-900">
                <span className="font-medium">{language === 'ta' ? 'விலை சரிவு (-15% Glut)' : 'Low Price Drop (-15%)'}</span>
                <span className="font-black text-red-700">₹{result.scenarios.lowPriceProfit.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
