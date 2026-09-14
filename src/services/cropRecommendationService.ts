import { CropRecommendationInput, CropRecommendationResult } from '../types';

const CROPS_DATABASE: CropRecommendationResult[] = [
  {
    id: 'crop-paddy',
    nameEn: 'Paddy (Rice / சம்பா நெல்)',
    nameTa: 'சம்பா நெல் (CR 1009 / பொன்னி)',
    category: 'Cereals',
    suitabilityScore: 94,
    expectedYieldPerAcre: 2.8,
    expectedYieldUnit: 'tonnes',
    durationDays: 135,
    waterRequirement: 'High',
    estimatedCostPerAcre: 26000,
    expectedSellingPricePerQuintal: 2350,
    expectedRevenuePerAcre: 65800,
    estimatedProfitPerAcre: 39800,
    suitableSeason: 'Samba / Kuruvai',
    seasonTa: 'சம்பா / குறுவை பருவம்',
    reasonEn: 'Optimal clay loam retention, high nutrient holding capacity, and planned delta irrigation support high tillering and grain filling.',
    reasonTa: 'களிமண் கலந்த வண்டல் நிலம், போதிய பாசன வசதி மற்றும் தழைச்சத்து இருப்பு ஆகியவற்றால் அதிக தூர்கள் உருவாகி மிகச் சிறந்த விளைச்சல் தரும்.',
    soilSuitability: 'Clay Loam, Alluvial',
    keyPracticesEn: [
      'Maintain 2.5 cm shallow water layer till panicle emergence',
      'Apply bio-fertilizer Azospirillum at 2 kg/acre',
      'Use cono-weeder at 15 and 30 days after transplanting',
    ],
    keyPracticesTa: [
      'கதிர் வரும் வரை 2.5 செ.மீ நீர்மட்டம் பராமரிக்கவும்',
      'அசோஸ்பைரில்லம் உயிர் உரத்தை ஏக்கருக்கு 2 கிலோ இடவும்',
      'நடவு செய்த 15 மற்றும் 30வது நாட்களில் கோனோ வீடர் மூலம் களை எடுக்கவும்',
    ],
    image: 'https://images.unsplash.com/photo-1536657464919-892534f60d6e?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'crop-blackgram',
    nameEn: 'Blackgram (உளுந்து - VBN 8)',
    nameTa: 'உளுந்து (வம்பன் 8 / VBN 8)',
    category: 'Pulses',
    suitabilityScore: 88,
    expectedYieldPerAcre: 0.45,
    expectedYieldUnit: 'tonnes',
    durationDays: 70,
    waterRequirement: 'Low',
    estimatedCostPerAcre: 11000,
    expectedSellingPricePerQuintal: 8200,
    expectedRevenuePerAcre: 36900,
    estimatedProfitPerAcre: 25900,
    suitableSeason: 'Navarai / Rice Fallow',
    seasonTa: 'நவரை / நெல் தரிசு உளுந்து',
    reasonEn: 'Excellent residual moisture utilization as a rice-fallow pulse, fixes atmospheric nitrogen naturally, low input cost.',
    reasonTa: 'நெல் அறுவடைக்கு பின் நிலத்திலுள்ள மிச்ச ஈரப்பதத்தை பயன்படுத்தி குறைந்த செலவில் அதிக லாபம் தரும் பயறு வகை.',
    soilSuitability: 'Clay, Loamy Sand',
    keyPracticesEn: [
      'Broadcast seeds 7-10 days before paddy harvest in moist waxy condition',
      'Foliar spray DAP 2% at flower initiation and pod formation',
    ],
    keyPracticesTa: [
      'நெல் அறுவடைக்கு 7-10 நாட்களுக்கு முன் மெழுகு பதத்தில் விதையுங்கள்',
      'பூக்கும் தருணத்திலும் காய் பிடிக்கும் போதும் 2% டிஏபி தெளிக்கவும்',
    ],
    image: 'https://images.unsplash.com/photo-1515543237350-b3eea1ec8082?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'crop-tomato',
    nameEn: 'Tomato (ஹைபிரிட் தக்காளி)',
    nameTa: 'தக்காளி (சிவம் / அர்கா ரக்ஷக்)',
    category: 'Vegetables',
    suitabilityScore: 85,
    expectedYieldPerAcre: 12.0,
    expectedYieldUnit: 'tonnes',
    durationDays: 110,
    waterRequirement: 'Medium',
    estimatedCostPerAcre: 42000,
    expectedSellingPricePerQuintal: 1400,
    expectedRevenuePerAcre: 168000,
    estimatedProfitPerAcre: 126000,
    suitableSeason: 'Year Round (Avoid excessive monsoon)',
    seasonTa: 'ஆண்டு முழுவதும் (அதிக மழைக்காலம் தவிர)',
    reasonEn: 'Well-drained loamy soil, warm temperatures, and high local mandi demand yield exceptional net profits when drip-irrigated.',
    reasonTa: 'வடிகால் வசதியுள்ள நிலம், சொட்டுநீர்ப் பாசனம் மற்றும் சந்தையில் தொடர் தேவை இருப்பதால் மிக அதிக வருமானம் தரும்.',
    soilSuitability: 'Red Sandy Loam, Well-drained Loam',
    keyPracticesEn: [
      'Adopt silver-black mulching for weed control and moisture preservation',
      'Stake plants with bamboo trellis for disease prevention',
    ],
    keyPracticesTa: [
      'களைகளை கட்டுப்படுத்த மூடாக்கு தாள் பயன்படுத்தவும்',
      'இலை நோய்களைத் தவிர்க்க குச்சிகள் நட்டு செடிகளை கட்டி வைக்கவும்',
    ],
    image: 'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'crop-banana',
    nameEn: 'Banana (வாழை - Grand Naine / நேந்திரன்)',
    nameTa: 'வாழை (ஜி-9 / கதலி / நேந்திரன்)',
    category: 'Fruits',
    suitabilityScore: 82,
    expectedYieldPerAcre: 28.0,
    expectedYieldUnit: 'tonnes',
    durationDays: 330,
    waterRequirement: 'High',
    estimatedCostPerAcre: 95000,
    expectedSellingPricePerQuintal: 1800,
    expectedRevenuePerAcre: 504000,
    estimatedProfitPerAcre: 409000,
    suitableSeason: 'Monsoon / Post-monsoon',
    seasonTa: 'பருவமழை கால நடவு',
    reasonEn: 'Rich alluvial soil and consistent irrigation supply allow high bunch weights and strong export/mandi realization.',
    reasonTa: 'வண்டல் மண் மற்றும் தடையற்ற பாசன வசதி உள்ள நிலங்களுக்கு மிகச் சிறந்த நீண்ட கால பணப்பயிர்.',
    soilSuitability: 'Alluvial Loam, Deep Clay',
    keyPracticesEn: [
      'Provide earthing up and propping with casuarina poles at 7th month',
      'Apply neem cake 500g and Trichoderma per pit before planting',
    ],
    keyPracticesTa: [
      '7-வது மாதத்தில் மண் அணைத்து மூங்கில் முட்டு கொடுக்கவும்',
      'நடவுக்கு முன் குழிக்கு 500 கிராம் வேப்பம்புண்ணாக்கு இடவும்',
    ],
    image: 'https://images.unsplash.com/photo-1528825871115-3581a5387919?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'crop-groundnut',
    nameEn: 'Groundnut (மணிலா / நிலக்கடலை - TMV 13)',
    nameTa: 'நிலக்கடலை (டி.எம்.வி 13 / கதிரி 6)',
    category: 'Pulses',
    suitabilityScore: 79,
    expectedYieldPerAcre: 1.1,
    expectedYieldUnit: 'tonnes',
    durationDays: 105,
    waterRequirement: 'Low',
    estimatedCostPerAcre: 24000,
    expectedSellingPricePerQuintal: 6800,
    expectedRevenuePerAcre: 74800,
    estimatedProfitPerAcre: 50800,
    suitableSeason: 'Kharif / Chithirai Pattam',
    seasonTa: 'சித்திரை பட்டம் / ஆடி பட்டம்',
    reasonEn: 'Red sandy soils provide optimal peg penetration and easy harvesting, strong oil mill procurement.',
    reasonTa: 'செம்மண் நிலத்தில் விழுதுகள் எளிதாக இறங்கி காய் திரட்சி அதிகரிக்கும். எண்ணெய் ஆலைகளில் நிலையான தேவை உண்டு.',
    soilSuitability: 'Red Sandy Loam',
    keyPracticesEn: [
      'Apply gypsum at 200 kg/acre at 40-45 days after sowing',
      'Maintain loose soil around root zone for peg penetration',
    ],
    keyPracticesTa: [
      'விதைத்த 40-45 நாட்களில் ஏக்கருக்கு 200 கிலோ ஜிப்சம் இடவும்',
      'விழுதுகள் நிலத்தில் இறங்க மண்ணை இலகுவாக வைத்திருக்கவும்',
    ],
    image: 'https://images.unsplash.com/photo-1567332210297-0c7724232816?auto=format&fit=crop&w=600&q=80',
  },
  {
    id: 'crop-sugarcane',
    nameEn: 'Sugarcane (கரும்பு - Co 86032)',
    nameTa: 'கரும்பு (கோ 86032 / Co 0212)',
    category: 'Cash Crops',
    suitabilityScore: 76,
    expectedYieldPerAcre: 50.0,
    expectedYieldUnit: 'tonnes',
    durationDays: 360,
    waterRequirement: 'High',
    estimatedCostPerAcre: 68000,
    expectedSellingPricePerQuintal: 320,
    expectedRevenuePerAcre: 160000,
    estimatedProfitPerAcre: 92000,
    suitableSeason: 'Special Season / Margazhi Pattam',
    seasonTa: 'மார்கழி பட்டம் / சிறப்பு பருவம்',
    reasonEn: 'Guaranteed mill tie-ups and high sugar recovery in delta zones, robust ratoon yield.',
    reasonTa: 'சர்க்கரை ஆலைகளின் நேரடி கொள்முதல் உத்தரவாதம் மற்றும் மறுதாம்பு பயிர் மூலம் தொடர்ந்து வருமானம் தரும்.',
    soilSuitability: 'Deep Clay Loam',
    keyPracticesEn: [
      'Adopt single bud chip seedling method for 80% seed cane savings',
      'Install subsurface drip irrigation for 40% water savings',
    ],
    keyPracticesTa: [
      'பரு சீவல் நாற்று முறையில் விதை கரும்பு செலவை 80% குறைக்கவும்',
      'சொட்டுநீர்ப் பாசனம் அமைத்து 40% வரை தண்ணீரை சேமிக்கவும்',
    ],
    image: 'https://images.unsplash.com/photo-1594488518047-97d848128383?auto=format&fit=crop&w=600&q=80',
  },
];

export async function recommendCrops(input: CropRecommendationInput): Promise<CropRecommendationResult[]> {
  try {
    const response = await fetch('/api/crop/recommend', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data.recommendations) && data.recommendations.length > 0) {
        return data.recommendations;
      }
    }
  } catch (err) {
    console.warn('Backend crop recommendation API unreachable, using client-side agro-engine:', err);
  }

  // Client-side rule-based recommendation fallback
  return CROPS_DATABASE.map((crop) => {
    let score = crop.suitabilityScore;
    // Adjust based on water availability
    if (input.availableWater === 'Low' && crop.waterRequirement === 'High') {
      score -= 22;
    } else if (input.availableWater === 'High' && crop.waterRequirement === 'High') {
      score += 4;
    }
    // Adjust based on pH
    if (input.ph < 6.0 && crop.id === 'crop-paddy') {
      score -= 6;
    }
    if (input.ph >= 6.5 && input.ph <= 7.5) {
      score += 3;
    }
    // Adjust based on category preference
    if (input.preferredCategory && input.preferredCategory !== 'All' && crop.category === input.preferredCategory) {
      score += 8;
    }

    return {
      ...crop,
      suitabilityScore: Math.min(99, Math.max(45, score)),
    };
  }).sort((a, b) => b.suitabilityScore - a.suitabilityScore);
}
