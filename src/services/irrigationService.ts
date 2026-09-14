import { IrrigationAdvice } from '../types';

export interface IrrigationInput {
  crop: string;
  growthStage: string;
  soilType: string;
  soilMoisturePct: number;
  tempC: number;
  rainForecastPct: number;
  irrigationMethod: string;
  lastIrrigationDaysAgo: number;
  farmSizeAcres: number;
}

export function calculateIrrigationAdvice(input: IrrigationInput): IrrigationAdvice {
  const isRainLikely = input.rainForecastPct >= 50;
  const isMoistureAdequate = input.soilMoisturePct >= 65;

  let irrigationRequired = false;
  let waterReqMm = 30;
  let level: 'Low' | 'Medium' | 'High' = 'Medium';
  let recommendedTime = 'Tomorrow at 06:30 AM (காலை 6:30 மணி)';
  let nextDate = 'Tomorrow Morning';

  if (isRainLikely) {
    irrigationRequired = false;
    nextDate = 'Postpone by 3 days';
    recommendedTime = 'After rain evaluation (மழை நின்ற பிறகு)';
  } else if (!isMoistureAdequate || input.lastIrrigationDaysAgo >= 4) {
    irrigationRequired = true;
    waterReqMm = input.crop.toLowerCase().includes('paddy') ? 45 : 25;
    level = waterReqMm > 35 ? 'High' : 'Medium';
    nextDate = 'Today / Tomorrow Morning';
    recommendedTime = '06:00 AM - 08:30 AM (வெயில் ஏறும் முன்)';
  } else {
    irrigationRequired = false;
    nextDate = 'In 3-4 days';
    recommendedTime = 'Thursday Morning (வியாழன் காலை)';
  }

  const reasonEn = isRainLikely
    ? `Rain probability is ${input.rainForecastPct}%. Suspend irrigation to prevent waterlogging and fertilizer washout.`
    : irrigationRequired
    ? `Soil moisture is at ${input.soilMoisturePct}%, below the critical 65% threshold for active ${input.growthStage} stage.`
    : `Soil moisture (${input.soilMoisturePct}%) is adequate. Crop root zone has sufficient moisture for current evapotranspiration rate.`;

  const reasonTa = isRainLikely
    ? `அடுத்த 48 மணி நேரத்தில் ${input.rainForecastPct}% மழை வாய்ப்புள்ளது. நீர் தேங்குவதையும் உரம் அடித்துச் செல்வதையும் தடுக்க பாசனத்தை ஒத்திவைக்கவும்.`
    : irrigationRequired
    ? `மண் ஈரப்பதம் ${input.soilMoisturePct}% ஆக குறைந்துள்ளது. பயிர் ${input.growthStage} பருவத்தில் உள்ளதால் போதிய நீர் கட்டாயம் தேவை.`
    : `மண் ஈரப்பதம் (${input.soilMoisturePct}%) போதுமான அளவு உள்ளது. தற்போது தண்ணீர் பாய்ச்ச தேவையில்லை.`;

  const waterSavingTipEn = input.irrigationMethod.toLowerCase().includes('drip')
    ? 'Drip system running efficiently: saves 40% water compared to furrow irrigation. Check dripper emitters for salt clogging.'
    : 'Adopt alternate wetting and drying (AWD) in paddy: irrigating 1-2 days after disappearance of ponded water saves 30% groundwater.';

  const waterSavingTipTa = input.irrigationMethod.toLowerCase().includes('drip')
    ? 'சொட்டுநீர்ப் பாசனம் 40% தண்ணீரை சேமிக்கிறது. சொட்டுநீர் துளைகளில் அடைப்பு உள்ளதா என வாரம் ஒருமுறை கவனியுங்கள்.'
    : 'நெல் பயிரில் "காய்ச்சலும் பாய்ச்சலும்" முறையை பின்பற்றுங்கள்: தண்ணீர் வடிந்து 1-2 நாட்கள் கழித்து நீர் பாய்ச்சினால் 30% நிலத்தடி நீர் மிச்சமாகும்.';

  return {
    irrigationRequired,
    nextIrrigationDate: nextDate,
    recommendedTime,
    waterRequirementMm: waterReqMm,
    waterRequirementLevel: level,
    soilMoisturePct: input.soilMoisturePct,
    reasonEn,
    reasonTa,
    waterSavingTipEn,
    waterSavingTipTa,
    rainWarning: isRainLikely,
    methodAdviceEn: 'Operate pumps during early morning (6 AM - 8 AM) to reduce evaporative water loss.',
    methodAdviceTa: 'ஆவியாதலை குறைக்க அதிகாலை 6 மணி முதல் 8 மணிக்குள் அல்லது மாலை வேளையில் பாசனம் செய்யவும்.',
  };
}

export function calculateIrrigationSchedule(input: {
  crop: string;
  growthStage: string;
  soilType: string;
  soilMoisturePct: number;
  recentRainfallMm: number;
  forecastRainPct: number;
  temperatureC: number;
  irrigationMethod: string;
}) {
  const isRainHigh = input.forecastRainPct >= 50;
  const isDry = input.soilMoisturePct < 55;

  let status = 'Postpone Irrigation';
  let statusTa = 'பாசனத்தை ஒத்திவைக்கவும்';
  let nextDate = 'Thursday Morning (3 days later)';
  let recommendedTimeOfDay = '06:30 AM - 08:30 AM';
  let depthMm = 30;
  let volumeLiters = 30000;

  if (isRainHigh) {
    status = 'Postpone Irrigation';
    statusTa = 'பாசனத்தை ஒத்திவைக்கவும் (மழை வாய்ப்பு)';
    nextDate = 'After rain subsides (மழைக்கு பின்)';
    recommendedTimeOfDay = 'Morning (காலை வேளை)';
  } else if (isDry) {
    status = 'Irrigate Now';
    statusTa = 'உடனடியாக நீர் பாய்ச்சவும்';
    nextDate = 'Today / Tomorrow Morning';
    recommendedTimeOfDay = '06:00 AM - 08:30 AM';
    depthMm = input.crop.toLowerCase().includes('paddy') ? 40 : 25;
    volumeLiters = depthMm * 1000;
  } else {
    status = 'Optimal Moisture';
    statusTa = 'மிதமான ஈரப்பதம் உள்ளது';
    nextDate = 'In 2-3 Days';
    recommendedTimeOfDay = 'Morning 07:00 AM';
  }

  const reasonEn = isRainHigh
    ? `Rain probability is ${input.forecastRainPct}%. Delaying irrigation saves electric pumping costs and avoids water stagnation.`
    : isDry
    ? `Soil moisture has depleted to ${input.soilMoisturePct}%. Crop requires prompt root wetting during ${input.growthStage} stage.`
    : `Soil moisture (${input.soilMoisturePct}%) is in optimal range for ${input.crop}.`;

  const reasonTa = isRainHigh
    ? `அடுத்த 48 மணி நேரத்தில் ${input.forecastRainPct}% மழை வாய்ப்புள்ளதால், மின்சாரம் மற்றும் தண்ணீரை மிச்சப்படுத்த பாசனத்தை ஒத்திவைக்கவும்.`
    : isDry
    ? `மண் ஈரப்பதம் ${input.soilMoisturePct}% ஆக குறைந்துள்ளது. பயிர் வாடாமல் இருக்க உடனடியாக நீர் பாய்ச்சவும்.`
    : `மண் ஈரப்பதம் (${input.soilMoisturePct}%) பயிர் வளர்ச்சிக்கு உகந்த அளவில் உள்ளது.`;

  return {
    status,
    statusTa,
    nextDate,
    recommendedTimeOfDay,
    waterVolumeLitersPerAcre: volumeLiters,
    waterDepthMm: depthMm,
    rainProbabilityPct: input.forecastRainPct,
    savingLitres: isRainHigh ? volumeLiters : 0,
    reasonEn,
    reasonTa,
    tipsEn: [
      'Operate irrigation during early morning (6:00 AM - 8:30 AM) to minimize midday solar evaporation.',
      'Maintain strong field bunds to harvest forecasted rainfall directly in the root zone.',
      'For paddy, practice Alternate Wetting and Drying (AWD) to save up to 30% groundwater and diesel pumping costs.',
      'Check irrigation channel leaks and remove silt blocks to prevent head-tail water inequality.',
    ],
    tipsTa: [
      'வெயில் ஏறும் முன் அதிகாலை (6:00 - 8:30 மணிக்குள்) பாசனம் செய்வதால் 20% நீர் ஆவியாதல் தவிர்க்கப்படும்.',
      'மழை நீரை வயலிலேயே சேமிக்க வரப்புகளை உயர்த்தி செப்பனிட்டு வைக்கவும்.',
      'நெல் பயிரில் "காய்ச்சலும் பாய்ச்சலும்" முறையை கடைபிடித்து 30% நிலத்தடி நீரை சேமிக்கலாம்.',
      'பாசன வாய்க்கால்களில் தூர்வாரி நீர் கசிவை தடுத்து வயலின் கடைமடை வரை சீராக பாய்ச்சவும்.',
    ],
  };
}
