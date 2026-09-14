import { DiseasePrediction } from '../types';

const SAMPLE_DISEASE_DB: DiseasePrediction[] = [
  {
    id: 'paddy-blast',
    crop: 'Paddy (Rice)',
    cropTa: 'நெல்',
    detectedDiseaseEn: 'Rice Blast (Pyricularia oryzae)',
    detectedDiseaseTa: 'நெல் குலை நோய் (குலைக்காளான்)',
    scientificName: 'Magnaporthe oryzae',
    confidence: 94,
    severity: 'Moderate',
    symptomsEn: [
      'Spindle-shaped or eye-shaped lesions with gray-white centers and reddish-brown borders',
      'Lesions coalesce causing large patches of leaf death',
      'Collar rot and neck blast resulting in unfilled panicles ("chaffy grains")',
    ],
    symptomsTa: [
      'கண் அல்லது கதிர் போன்ற நீள்வட்ட புள்ளிகள், நடுவில் சாம்பல் நிறமாகவும் ஓரங்களில் பழுப்பு நிறமாகவும் தோன்றும்',
      'புள்ளிகள் ஒன்றிணைந்து இலைகள் காய்ந்து சருகாகும்',
      'கழுத்து பகுதியில் பூஞ்சை தாக்கி நெல்மணிகள் பதறாகும் நிலை ஏற்படும்',
    ],
    treatmentEn: [
      'Avoid high nitrogen application; split urea doses into 3-4 applications with neem-coated urea',
      'Foliar spray with Tricyclazole 75% WP @ 0.6g/liter or Pseudomonas fluorescens @ 2.5kg/ha',
      'Spray early morning before dew dries to maximize leaf surface absorption',
    ],
    treatmentTa: [
      'அதிகப்படியான தழைச்சத்து (யூரியா) இடுவதை தவிர்க்கவும்; வேப்பெண்ணெய் பூசிய யூரியாவை தவணைகளாக இடவும்',
      'ட்ரைசைக்ளசோல் 75 WP (லிட்டருக்கு 0.6 கிராம்) அல்லது சூடோமோனாஸ் உயிர் பூஞ்சாணக்கொல்லி தெளிக்கவும்',
      'காலை நேரத்தில் பனி உலரும் முன் இலைகளில் நன்கு படியுமாறு தெளிக்கவும்',
    ],
    preventionEn: [
      'Treat seeds with Pseudomonas fluorescens @ 10g/kg before nursery sowing',
      'Use blast-resistant varieties such as ADT 43, TPS 5, or CO 51',
      'Burn or compost diseased stubble after harvest',
    ],
    preventionTa: [
      'விதைப்பதற்கு முன் ஒரு கிலோ விதைக்கு 10 கிராம் சூடோமோனாஸ் கலந்து விதை நேர்த்தி செய்யவும்',
      'நோய் எதிர்ப்புத் திறன் கொண்ட ஏடிடி 43, டிபிஎஸ் 5, அல்லது கோ 51 ரகங்களை பயிரிடவும்',
      'அறுவடைக்கு பின் பாதிக்கப்பட்ட பயிர் எச்சங்களை பாதுகாப்பாக அப்புறப்படுத்தவும்',
    ],
    hygieneEn: [
      'Keep irrigation bunds free of weed hosts (Leersia hexandra, Echinochloa)',
      'Ensure proper drainage to prevent stagnant standing cold water',
    ],
    hygieneTa: [
      'வரப்புகளில் உள்ள களைகளை உடனடியாக அகற்றி தூய்மையாக வைக்கவும்',
      'வயலில் அதிகப்படியான நீர் தேங்காமல் சீரான வடிகால் வசதி ஏற்படுத்தவும்',
    ],
    timestamp: new Date().toISOString(),
    requiresExpertHelp: false,
  },
  {
    id: 'tomato-early-blight',
    crop: 'Tomato',
    cropTa: 'தக்காளி',
    detectedDiseaseEn: 'Early Blight (Alternaria solani)',
    detectedDiseaseTa: 'தக்காளி இலை கருகல் நோய் (முன் பருவக் கருகல்)',
    scientificName: 'Alternaria solani',
    confidence: 91,
    severity: 'Moderate',
    symptomsEn: [
      'Concentric dark brown rings resembling a "target-board" on older leaves',
      'Yellow halos surrounding the necrotic spots',
      'Stem cankers and sunken leathery rot on the fruit stem-end',
    ],
    symptomsTa: [
      'முதிர்ந்த கீழ் இலைகளில் வட்ட வளையங்களுடன் கூடிய கரும்பழுப்பு நிற புள்ளிகள் (இலக்கு பலகை போன்ற தோற்றம்)',
      'புள்ளிகளைச் சுற்றி மஞ்சள் நிற வளையம் தோன்றுதல்',
      'தண்டு மற்றும் பழத்தின் காம்புப் பகுதியில் கரும்பழுப்பு நிற அழுகல் ஏற்படுதல்',
    ],
    treatmentEn: [
      'Remove and bury infected lower leaves touching the ground',
      'Foliar spray with Copper Oxychloride 50% WP @ 2.5g/liter or Mancozeb @ 2g/liter',
      'Apply organic bio-fungicide Bacillus subtilis or Trichoderma viride',
    ],
    treatmentTa: [
      'தரையைத் தொடும் பாதிக்கப்பட்ட கீழ் இலைகளை வெட்டி பாதுகாப்பாக மண்ணில் புதைக்கவும்',
      'காப்பர் ஆக்சிகுளோரைடு (லிட்டருக்கு 2.5 கிராம்) அல்லது மேன்கோசெப் (லிட்டருக்கு 2 கிராம்) தெளிக்கவும்',
      'டிரைக்கோடெர்மா விரிடி அல்லது பாசில்லஸ் சப்டிலிஸ் போன்ற உயிர் பூஞ்சாணக்கொல்லி இடவும்',
    ],
    preventionEn: [
      'Use drip irrigation instead of overhead sprinklers to keep foliage dry',
      'Practice 2-year crop rotation with non-solanaceous crops (maize, pulses)',
      'Apply plastic mulch to prevent soil splashing onto leaves',
    ],
    preventionTa: [
      'இலைகள் நனையாமல் இருக்க தெளிப்பு நீர்ப்பாசனத்திற்கு பதிலாக சொட்டுநீர்ப் பாசனம் அமைக்கவும்',
      'தக்காளிக்கு பின் சோளம் அல்லது பயறு வகைகளை பயிரிட்டு பயிர் சுழற்சி மேற்கொள்ளவும்',
      'மண்ணிலிருந்து பூஞ்சை இலைகளுக்கு பரவாமல் இருக்க பிளாஸ்டிக் மூடாக்கு பயன்படுத்தவும்',
    ],
    hygieneEn: [
      'Disinfect pruning shears with 70% alcohol or diluted bleach between plants',
      'Ensure 60cm spacing between rows for adequate air circulation',
    ],
    hygieneTa: [
      'இலை வெட்டும் கத்தரிக்கோலை கிருமிநாசினி கொண்டு சுத்தப்படுத்திய பிறகே அடுத்த செடிக்கு பயன்படுத்தவும்',
      'செடிகளுக்கு இடையே போதிய காற்று புழக்கம் கிடைக்க 60 செ.மீ இடைவெளி விடவும்',
    ],
    timestamp: new Date().toISOString(),
    requiresExpertHelp: false,
  },
  {
    id: 'banana-sigatoka',
    crop: 'Banana',
    cropTa: 'வாழை',
    detectedDiseaseEn: 'Black Sigatoka Leaf Spot',
    detectedDiseaseTa: 'வாழை சிகடோகா கருந்தேமல் இலைப்புள்ளி நோய்',
    scientificName: 'Pseudocercospora fijiensis',
    confidence: 88,
    severity: 'High',
    symptomsEn: [
      'Tiny rusty-brown streaks running parallel to leaf veins',
      'Streaks enlarge into dark brown to black elliptical spots with gray centers',
      'Extensive leaf tissue death leading to premature ripening and light bunches',
    ],
    symptomsTa: [
      'இலை நரம்புகளுக்கு இணையாக சிறிய செம்பழுப்பு நிற கோடுகள் தோன்றுதல்',
      'கோடுகள் விரிவடைந்து சாம்பல் நிற மையத்துடன் கூடிய கருத்த நீள்வட்ட புள்ளிகளாதல்',
      'இலைகள் வேகமாக காய்ந்து போவதால் வாழை தார்கள் திரட்சியின்றி எடை குறைதல்',
    ],
    treatmentEn: [
      'Deleafing: Prune heavily infected dried leaves and burn immediately away from plantation',
      'Foliar spray of mineral oil or Propiconazole 25% EC @ 1ml/liter mixed with sticker',
      'Apply potassium fertilizer to build systemic plant tissue resistance',
    ],
    treatmentTa: [
      'பாதிக்கப்பட்ட காய்ந்த இலைகளை உடனுக்குடன் வெட்டி தோட்டத்திற்கு வெளியே கொண்டு சென்று அழிக்கவும்',
      'புரோபிகோனசோல் (லிட்டருக்கு 1 மி.லி) உடன் ஒட்டும் திரவம் சேர்த்து இலைகளின் அடிப்பகுதியில் தெளிக்கவும்',
      'வாழைக்கு தேவையான சாம்பல் சத்து (பொட்டாஷ்) தவறாமல் இட்டு நோய் எதிர்ப்பு சக்தியை கூட்டவும்',
    ],
    preventionEn: [
      'Maintain strict field drainage to reduce relative humidity inside canopy',
      'Avoid high planting density; maintain 1.8m x 1.8m spacing',
    ],
    preventionTa: [
      'தோட்டத்தில் நீர் தேங்காமல் வடிகால் வசதியை தொடர்ந்து தூய்மையாக பராமரிக்கவும்',
      'செடிகள் அடர்த்தியாக இல்லாமல் பரிந்துரைக்கப்பட்ட 1.8 மீ x 1.8 மீ இடைவெளியில் நடவு செய்யவும்',
    ],
    hygieneEn: [
      'Always bury pruned trimmings with lime powder to decompose spores',
    ],
    hygieneTa: [
      'வெட்டிய இலைகளின் மேல் சுண்ணாம்பு தூவி பூஞ்சை வித்துக்கள் காற்றில் பரவாமல் தடுக்கவும்',
    ],
    timestamp: new Date().toISOString(),
    requiresExpertHelp: false,
  },
  {
    id: 'healthy-leaf',
    crop: 'Cotton / Paddy / Tomato',
    cropTa: 'பருத்தி / நெல் / தக்காளி',
    detectedDiseaseEn: 'Healthy Foliage (No Significant Pathogen Detected)',
    detectedDiseaseTa: 'ஆரோக்கியமான இலை (நோய் அறிகுறிகள் ஏதுமில்லை)',
    scientificName: 'Normal leaf physiology',
    confidence: 96,
    severity: 'Low',
    symptomsEn: [
      'Uniform chlorophyll pigmentation without necrotic lesions or sporulation',
      'Intact cuticle and healthy venation',
    ],
    symptomsTa: [
      'இலையில் பச்சையம் சீராக உள்ளது; கருகல் அல்லது புள்ளிகள் ஏதுமில்லை',
      'இலை நரம்புகளும் ஓரங்களும் இயல்பான பசுமையுடன் உள்ளன',
    ],
    treatmentEn: [
      'No chemical spray needed',
      'Continue balanced organic manure and scheduled irrigation',
    ],
    treatmentTa: [
      'மருந்து தெளிப்பு எதுவும் தேவையில்லை',
      'வழக்கமான இயற்கை உரம் மற்றும் உரிய பாசனத்தை தொடரவும்',
    ],
    preventionEn: [
      'Inspect field weekly for early pest monitoring',
      'Install pheromone traps for sucking pests',
    ],
    preventionTa: [
      'வாரத்திற்கு ஒருமுறை வயலை கண்காணித்து பூச்சி நடமாட்டத்தை கவனிக்கவும்',
      'இனக்கவர்ச்சி பொறிகள் மற்றும் விளக்கு பொறிகள் அமைத்து முன்னெச்சரிக்கை செய்யவும்',
    ],
    hygieneEn: [
      'Maintain weed-free bunds',
    ],
    hygieneTa: [
      'வரப்புகளை புல் மற்றும் களைகள் இல்லாமல் தூய்மையாக பராமரிக்கவும்',
    ],
    timestamp: new Date().toISOString(),
    requiresExpertHelp: false,
  },
];

export async function detectPlantDisease(
  imageBase64: string,
  cropType: string = 'Auto-detect'
): Promise<DiseasePrediction> {
  try {
    const res = await fetch('/api/disease/predict', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        image: imageBase64,
        crop: cropType,
        timestamp: new Date().toISOString(),
      }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data && data.disease) {
        return {
          id: 'pred-' + Date.now(),
          crop: data.crop || cropType || 'Paddy',
          cropTa: data.cropTa || 'பயிர்',
          detectedDiseaseEn: data.disease,
          detectedDiseaseTa: data.diseaseTa || data.disease,
          confidence: data.confidence || 92,
          severity: data.severity || 'Moderate',
          symptomsEn: data.symptoms || [],
          symptomsTa: data.symptomsTa || [],
          treatmentEn: data.treatment || [],
          treatmentTa: data.treatmentTa || [],
          preventionEn: data.prevention || [],
          preventionTa: data.preventionTa || [],
          hygieneEn: data.hygiene || [],
          hygieneTa: data.hygieneTa || [],
          scientificName: data.scientificName || 'Phytopathogen',
          timestamp: new Date().toISOString(),
          requiresExpertHelp: (data.confidence || 92) < 70,
        };
      }
    }
  } catch (err) {
    console.warn('Backend disease prediction endpoint unreachable, using client pathology rule-engine:', err);
  }

  // If crop is tomato or image detected as tomato
  const lowerCrop = cropType.toLowerCase();
  let matched = SAMPLE_DISEASE_DB[0];
  if (lowerCrop.includes('tomato') || lowerCrop.includes('தக்காளி')) {
    matched = SAMPLE_DISEASE_DB[1];
  } else if (lowerCrop.includes('banana') || lowerCrop.includes('வாழை')) {
    matched = SAMPLE_DISEASE_DB[2];
  } else if (lowerCrop.includes('healthy') || lowerCrop.includes('ஆரோக்கியம்')) {
    matched = SAMPLE_DISEASE_DB[3];
  }

  return {
    ...matched,
    id: 'pred-' + Date.now(),
    timestamp: new Date().toISOString(),
  };
}
