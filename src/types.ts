export type Language = 'ta' | 'en';

export interface FarmerProfile {
  id: string;
  name: string;
  mobile: string;
  email?: string;
  state: string;
  district: string;
  village: string;
  farmSizeAcres: number;
  soilType: string;
  irrigationType: string;
  mainCrops: string[];
  preferredLanguage: Language;
  createdAt: string;
}

export interface CropRecommendationInput {
  soilType: string;
  ph: number;
  nitrogen: number;
  phosphorus: number;
  potassium: number;
  temperature: number;
  humidity: number;
  rainfall: number;
  season: 'Kharif' | 'Rabi' | 'Zaid' | 'Navarai' | 'Samba' | 'Kuruvai';
  district: string;
  village: string;
  availableWater: 'High' | 'Medium' | 'Low';
  farmSize: number;
  previousCrop?: string;
  irrigationType: string;
  preferredCategory?: 'Cereals' | 'Pulses' | 'Vegetables' | 'Cash Crops' | 'Fruits' | 'All';
}

export interface CropRecommendationResult {
  id: string;
  nameEn: string;
  nameTa: string;
  category: string;
  suitabilityScore: number;
  expectedYieldPerAcre: number;
  expectedYieldUnit: string;
  durationDays: number;
  waterRequirement: 'Low' | 'Medium' | 'High';
  estimatedCostPerAcre: number;
  expectedSellingPricePerQuintal: number;
  expectedRevenuePerAcre: number;
  estimatedProfitPerAcre: number;
  suitableSeason: string;
  seasonTa: string;
  reasonEn: string;
  reasonTa: string;
  soilSuitability: string;
  keyPracticesEn: string[];
  keyPracticesTa: string[];
  image: string;
}

export interface DiseasePrediction {
  id: string;
  crop: string;
  cropTa: string;
  detectedDiseaseEn: string;
  detectedDiseaseTa: string;
  confidence: number;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  symptomsEn: string[];
  symptomsTa: string[];
  treatmentEn: string[];
  treatmentTa: string[];
  preventionEn: string[];
  preventionTa: string[];
  hygieneEn: string[];
  hygieneTa: string[];
  imageUrl?: string;
  timestamp: string;
  requiresExpertHelp: boolean;
  scientificName?: string;
}

export interface DiseaseAlert {
  id: string;
  diseaseEn: string;
  diseaseTa: string;
  cropEn: string;
  cropTa: string;
  district: string;
  village: string;
  severity: 'Low' | 'Moderate' | 'High' | 'Severe';
  reportedDate: string;
  activeCasesCount: number;
  recommendationEn: string;
  recommendationTa: string;
  isVerifiedByOfficer: boolean;
}

export interface IrrigationAdviceInput {
  crop: string;
  growthStage: string;
  soilType: string;
  soilMoisturePct: number;
  recentRainfallMm: number;
  forecastRainPct: number;
  temperatureC: number;
  irrigationMethod: string;
}

export interface IrrigationScheduleResult {
  status: string;
  statusTa: string;
  nextDate: string;
  recommendedTimeOfDay: string;
  waterVolumeLitersPerAcre: number;
  waterDepthMm: number;
  rainProbabilityPct: number;
  savingLitres: number;
  reasonEn: string;
  reasonTa: string;
  tipsEn: string[];
  tipsTa: string[];
}

export interface IrrigationAdvice {
  irrigationRequired: boolean;
  nextIrrigationDate: string;
  recommendedTime: string;
  waterRequirementMm: number;
  waterRequirementLevel: 'Low' | 'Medium' | 'High';
  soilMoisturePct: number;
  reasonEn: string;
  reasonTa: string;
  waterSavingTipEn: string;
  waterSavingTipTa: string;
  rainWarning: boolean;
  methodAdviceEn: string;
  methodAdviceTa: string;
}

export interface YieldProfitInput {
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
}

export interface YieldProfitResult {
  totalCost: number;
  totalCostPerAcre: number;
  expectedYieldTotal: number;
  expectedYieldPerAcre: number;
  yieldUnit: string;
  minYield: number;
  maxYield: number;
  grossRevenue: number;
  netProfit: number;
  netProfitPerAcre: number;
  roiPct: number;
  breakEvenPricePerUnit: number;
  scenarios: {
    highPriceProfit: number;
    normalPriceProfit: number;
    lowPriceProfit: number;
  };
}

export interface CropStageInfo {
  stageNumber: number;
  stageNameEn: string;
  stageNameTa: string;
  dayStart: number;
  dayEnd: number;
  status: 'completed' | 'current' | 'upcoming';
  activitiesEn: string[];
  activitiesTa: string[];
  fertilizerEn: string[];
  fertilizerTa: string[];
  irrigationScheduleEn: string;
  irrigationScheduleTa: string;
  pestCheckEn: string[];
  pestCheckTa: string[];
}

export interface YieldPredictionResult {
  cropEn: string;
  cropTa: string;
  farmAreaAcres: number;
  estimatedYieldTotalTons: number;
  estimatedYieldPerAcreTons: number;
  rangeMinTons: number;
  rangeMaxTons: number;
  confidencePct: number;
  benchmarkAverageTons: number;
  factors: {
    factorEn: string;
    factorTa: string;
    impact: 'positive' | 'neutral' | 'negative';
    detailEn: string;
    detailTa: string;
  }[];
}

export interface ProfitPredictionResult {
  farmAreaAcres: number;
  cropEn: string;
  cropTa: string;
  costs: {
    seeds: number;
    fertilizers: number;
    pesticides: number;
    labour: number;
    irrigation: number;
    equipment: number;
    other: number;
  };
  totalCost: number;
  expectedYieldTotalQuintals: number;
  sellingPricePerQuintal: number;
  expectedRevenue: number;
  expectedProfit: number;
  profitMarginPct: number;
  profitPerAcre: number;
  breakEvenPricePerQuintal: number;
  suggestionsEn: string[];
  suggestionsTa: string[];
}

export interface WeatherData {
  district: string;
  village: string;
  tempC: number;
  humidityPct: number;
  rainProbabilityPct: number;
  windSpeedKmh: number;
  conditionEn: string;
  conditionTa: string;
  updatedAt: string;
  forecast: {
    date: string;
    dayEn: string;
    dayTa: string;
    maxTemp: number;
    minTemp: number;
    rainProb: number;
    conditionEn: string;
    conditionTa: string;
    agriculturalAdviceEn: string;
    agriculturalAdviceTa: string;
  }[];
}

export interface MarketPrice {
  cropEn: string;
  cropTa: string;
  mandiEn: string;
  mandiTa: string;
  district: string;
  modalPrice: number;
  minPrice: number;
  maxPrice: number;
  changePct: number;
  unit: string;
  date: string;
  trend: { date: string; price: number }[];
}

export interface NotificationItem {
  id: string;
  category: 'disease' | 'weather' | 'irrigation' | 'crop' | 'market';
  titleEn: string;
  titleTa: string;
  messageEn: string;
  messageTa: string;
  severity: 'info' | 'warning' | 'alert';
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

export interface AssistantMessage {
  id: string;
  sender: 'user' | 'assistant';
  textEn: string;
  textTa: string;
  timestamp: string;
  audioAvailable?: boolean;
  suggestedPrompts?: { en: string; ta: string }[];
}
