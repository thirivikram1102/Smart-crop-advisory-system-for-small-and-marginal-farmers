import { ProfitPredictionResult, YieldPredictionResult } from '../types';

export interface YieldPredictionInput {
  crop: string;
  farmAreaAcres: number;
  soilType: string;
  irrigationMethod: string;
  seedVariety: string;
  plantingDate: string;
  pestIncidence: 'None' | 'Low' | 'Moderate' | 'High';
  organicInputsUsed: boolean;
}

export function predictCropYield(input: YieldPredictionInput): YieldPredictionResult {
  // Base benchmarks per acre in tons for Tamil Nadu conditions
  let baseYieldPerAcre = 2.7; // Paddy default
  const lower = input.crop.toLowerCase();
  let cropEn = 'Paddy (Rice)';
  let cropTa = 'நெல் (சம்பா)';

  if (lower.includes('tomato') || lower.includes('தக்காளி')) {
    baseYieldPerAcre = 11.5;
    cropEn = 'Tomato';
    cropTa = 'தக்காளி';
  } else if (lower.includes('banana') || lower.includes('வாழை')) {
    baseYieldPerAcre = 26.0;
    cropEn = 'Banana';
    cropTa = 'வாழை';
  } else if (lower.includes('groundnut') || lower.includes('நிலக்கடலை')) {
    baseYieldPerAcre = 1.05;
    cropEn = 'Groundnut';
    cropTa = 'நிலக்கடலை';
  } else if (lower.includes('blackgram') || lower.includes('உளுந்து')) {
    baseYieldPerAcre = 0.42;
    cropEn = 'Blackgram';
    cropTa = 'உளுந்து';
  } else if (lower.includes('sugarcane') || lower.includes('கரும்பு')) {
    baseYieldPerAcre = 48.0;
    cropEn = 'Sugarcane';
    cropTa = 'கரும்பு';
  }

  // Factor adjustments
  let factorScore = 1.0;
  if (input.organicInputsUsed) factorScore += 0.08;
  if (input.pestIncidence === 'None') factorScore += 0.05;
  if (input.pestIncidence === 'Moderate') factorScore -= 0.12;
  if (input.pestIncidence === 'High') factorScore -= 0.28;
  if (input.irrigationMethod.toLowerCase().includes('drip')) factorScore += 0.1;

  const estimatedYieldPerAcre = Number((baseYieldPerAcre * factorScore).toFixed(2));
  const totalYield = Number((estimatedYieldPerAcre * input.farmAreaAcres).toFixed(2));
  const rangeMin = Number((totalYield * 0.88).toFixed(2));
  const rangeMax = Number((totalYield * 1.12).toFixed(2));

  return {
    cropEn,
    cropTa,
    farmAreaAcres: input.farmAreaAcres,
    estimatedYieldTotalTons: totalYield,
    estimatedYieldPerAcreTons: estimatedYieldPerAcre,
    rangeMinTons: rangeMin,
    rangeMaxTons: rangeMax,
    confidencePct: 89,
    benchmarkAverageTons: Number((baseYieldPerAcre * input.farmAreaAcres).toFixed(2)),
    factors: [
      {
        factorEn: 'Certified Seed Variety & Nursery Age',
        factorTa: 'சான்றளிக்கப்பட்ட விதை மற்றும் உகந்த நாற்று வயது',
        impact: 'positive',
        detailEn: 'Using recommended duration seeds guarantees high tillering coefficient.',
        detailTa: 'பரிந்துரைக்கப்பட்ட விதை ரகம் தூர்களின் எண்ணிக்கையை கூட்டுகிறது.',
      },
      {
        factorEn: 'Soil Organic Matter & Micronutrient Level',
        factorTa: 'மண் கரிம வளம் & நுண்ணூட்டச்சத்து இருப்பு',
        impact: input.organicInputsUsed ? 'positive' : 'neutral',
        detailEn: input.organicInputsUsed
          ? 'Farmyard manure addition enhanced microbial aeration and nutrient absorption.'
          : 'Basal green manuring or vermicompost could lift yields by another 8-12%.',
        detailTa: input.organicInputsUsed
          ? 'தொழுவுரம் மற்றும் மண்புழு உரம் இட்டதால் மண் நுண்ணுயிர்கள் பெருகி வேர் வளர்ச்சி கூடியுள்ளது.'
          : 'தக்கைப்பூண்டு அல்லது பசுந்தாள் உரம் இடுவதன் மூலம் மகசூலை மேலும் 10% கூட்டலாம்.',
      },
      {
        factorEn: 'Pest Surveillance & Timely Intervention',
        factorTa: 'பூச்சி கண்காணிப்பு மற்றும் மேலாண்மை',
        impact: input.pestIncidence === 'None' ? 'positive' : 'neutral',
        detailEn: `Current pest pressure status: ${input.pestIncidence}. Early trapping prevents significant leaf damage.`,
        detailTa: `பூச்சி தாக்குதல் நிலை: ${input.pestIncidence}. முன்னெச்சரிக்கை நடவடிக்கைகளால் சேதம் தவிர்க்கப்பட்டுள்ளது.`,
      },
      {
        factorEn: 'Irrigation Timing Consistency',
        factorTa: 'சீரான பாசன முறை',
        impact: 'positive',
        detailEn: 'Avoiding drought shock during panicle initiation / flowering maximizes grain filling.',
        detailTa: 'பூக்கும் மற்றும் பால் பிடிக்கும் தருணத்தில் நீர் தட்டுப்பாடு இல்லாமல் இருப்பது மகசூலை உறுதிசெய்கிறது.',
      },
    ],
  };
}

export interface ProfitInput {
  farmAreaAcres: number;
  crop: string;
  seedCost: number;
  fertilizerCost: number;
  pesticideCost: number;
  labourCost: number;
  irrigationCost: number;
  equipmentCost: number;
  otherCost: number;
  expectedYieldTotalQuintals: number;
  sellingPricePerQuintal: number;
}

export function calculateFarmProfit(input: ProfitInput): ProfitPredictionResult {
  const totalCost =
    input.seedCost +
    input.fertilizerCost +
    input.pesticideCost +
    input.labourCost +
    input.irrigationCost +
    input.equipmentCost +
    input.otherCost;

  const expectedRevenue = input.expectedYieldTotalQuintals * input.sellingPricePerQuintal;
  const expectedProfit = expectedRevenue - totalCost;
  const profitMarginPct = expectedRevenue > 0 ? Number(((expectedProfit / expectedRevenue) * 100).toFixed(1)) : 0;
  const profitPerAcre = input.farmAreaAcres > 0 ? Math.round(expectedProfit / input.farmAreaAcres) : expectedProfit;
  const breakEvenPricePerQuintal =
    input.expectedYieldTotalQuintals > 0
      ? Math.round(totalCost / input.expectedYieldTotalQuintals)
      : 0;

  const suggestionsEn: string[] = [];
  const suggestionsTa: string[] = [];

  // Tailored financial optimization advice
  const labourShare = totalCost > 0 ? (input.labourCost / totalCost) * 100 : 0;
  if (labourShare > 40) {
    suggestionsEn.push(
      'Labour represents ' +
        labourShare.toFixed(0) +
        '% of your cultivation budget. Renting CHC (Custom Hiring Center) power weeders or transplanters can save up to ₹4,500/acre.'
    );
    suggestionsTa.push(
      `கூலிச் செலவு மொத்த செலவில் ${labourShare.toFixed(0)}% ஆக உள்ளது. வட்டார வாடகை மைய இயந்திரங்களை (Transplanter/Weeder) பயன்படுத்துவதன் மூலம் ஏக்கருக்கு ₹4,500 வரை குறைக்கலாம்.`
    );
  }

  const fertilizerShare = totalCost > 0 ? (input.fertilizerCost / totalCost) * 100 : 0;
  if (fertilizerShare > 22) {
    suggestionsEn.push(
      'Adopt Soil Test-Based Nutrient Application (STCR) and apply neem-coated urea in split doses to eliminate 20% unnecessary fertilizer purchase.'
    );
    suggestionsTa.push(
      'மண் பரிசோதனை அடிப்படையில் மட்டுமே உரம் இடவும். வேப்பெண்ணெய் பூசிய யூரியாவை பிரித்து இடுவதால் 20% உரம் வீணாவது தடுக்கப்படும்.'
    );
  }

  suggestionsEn.push(
    `Your break-even price is ₹${breakEvenPricePerQuintal}/quintal. Aim to sell above this threshold at the nearest Regulated Market (ஒழுங்குமுறை விற்பனைக்கூடம்) or Direct Procurement Center (DPC) to capture minimum support price (MSP).`
  );
  suggestionsTa.push(
    `உங்கள் குறைந்தபட்ச நட்டமில்லா விலை குவிண்டாலுக்கு ₹${breakEvenPricePerQuintal}. இதைவிட கூடுதல் விலைக்கு ஒழுங்குமுறை விற்பனைக்கூடத்திலோ அல்லது நேரடி நெல் கொள்முதல் நிலையத்திலோ (DPC) விற்பனை செய்யுங்கள்.`
  );

  return {
    farmAreaAcres: input.farmAreaAcres,
    cropEn: input.crop,
    cropTa: input.crop,
    costs: {
      seeds: input.seedCost,
      fertilizers: input.fertilizerCost,
      pesticides: input.pesticideCost,
      labour: input.labourCost,
      irrigation: input.irrigationCost,
      equipment: input.equipmentCost,
      other: input.otherCost,
    },
    totalCost,
    expectedYieldTotalQuintals: input.expectedYieldTotalQuintals,
    sellingPricePerQuintal: input.sellingPricePerQuintal,
    expectedRevenue,
    expectedProfit,
    profitMarginPct,
    profitPerAcre,
    breakEvenPricePerQuintal,
    suggestionsEn,
    suggestionsTa,
  };
}

export function calculateYieldAndProfit(input: {
  crop: string;
  acres: number;
  soilType: string;
  season: string;
  expectedPricePerUnit: number;
  priceUnit: string;
  costs: {
    landPreparation: number;
    seeds: number;
    fertilizers: number;
    pesticides: number;
    irrigation: number;
    labor: number;
    harvestingTransport: number;
    miscellaneous: number;
  };
}) {
  const costPerAcre =
    input.costs.landPreparation +
    input.costs.seeds +
    input.costs.fertilizers +
    input.costs.pesticides +
    input.costs.irrigation +
    input.costs.labor +
    input.costs.harvestingTransport +
    input.costs.miscellaneous;

  const totalCost = Math.round(costPerAcre * input.acres);

  // Benchmarks for yield based on crop type
  let yieldPerAcre = 26; // quintals per acre for Paddy (approx 2.6 tonnes)
  let unit = 'Quintals';

  const lower = input.crop.toLowerCase();
  if (lower.includes('tomato') || lower.includes('தக்காளி')) {
    yieldPerAcre = 11000; // kg
    unit = 'kg';
  } else if (lower.includes('banana') || lower.includes('வாழை')) {
    yieldPerAcre = 1050; // bunches
    unit = 'Bunches';
  } else if (lower.includes('cotton') || lower.includes('பருத்தி')) {
    yieldPerAcre = 9.5;
    unit = 'Quintals';
  } else if (lower.includes('groundnut') || lower.includes('நிலக்கடலை')) {
    yieldPerAcre = 11;
    unit = 'Quintals';
  } else if (lower.includes('maize') || lower.includes('மக்காச்சோளம்')) {
    yieldPerAcre = 28;
    unit = 'Quintals';
  }

  const expectedYieldTotal = Math.round(yieldPerAcre * input.acres);
  const minYield = Math.round(expectedYieldTotal * 0.85);
  const maxYield = Math.round(expectedYieldTotal * 1.15);

  const grossRevenue = Math.round(expectedYieldTotal * input.expectedPricePerUnit);
  const netProfit = grossRevenue - totalCost;
  const netProfitPerAcre = Math.round(netProfit / input.acres);
  const roiPct = totalCost > 0 ? Number(((netProfit / totalCost) * 100).toFixed(1)) : 0;
  const breakEvenPricePerUnit =
    expectedYieldTotal > 0 ? Number((totalCost / expectedYieldTotal).toFixed(1)) : 0;

  return {
    totalCost,
    totalCostPerAcre: costPerAcre,
    expectedYieldTotal,
    expectedYieldPerAcre: yieldPerAcre,
    yieldUnit: unit,
    minYield,
    maxYield,
    grossRevenue,
    netProfit,
    netProfitPerAcre,
    roiPct,
    breakEvenPricePerUnit,
    scenarios: {
      highPriceProfit: Math.round(grossRevenue * 1.15 - totalCost),
      normalPriceProfit: netProfit,
      lowPriceProfit: Math.round(grossRevenue * 0.85 - totalCost),
    },
  };
}
