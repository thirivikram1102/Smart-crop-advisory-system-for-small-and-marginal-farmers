export interface CropDiseasePreventionTip {
  id: string;
  cropKey: string;
  cropNameEn: string;
  cropNameTa: string;
  diseaseEn: string;
  diseaseTa: string;
  stageEn: string;
  stageTa: string;
  titleEn: string;
  titleTa: string;
  preventionTipEn: string;
  preventionTipTa: string;
  actionProtocolEn: string;
  actionProtocolTa: string;
  urgency: 'info' | 'warning' | 'alert';
}

export const CROP_DISEASE_PREVENTION_CATALOGUE: CropDiseasePreventionTip[] = [
  // --- Paddy / Rice (நெல்) ---
  {
    id: 'tip-paddy-01',
    cropKey: 'paddy',
    cropNameEn: 'Paddy / Rice',
    cropNameTa: 'நெல் பயிர்',
    diseaseEn: 'Brown Plant Hopper (BPH)',
    diseaseTa: 'புகையான் பூச்சி தாக்குதல்',
    stageEn: 'Tillering to Panicle Initiation',
    stageTa: 'தூர்க்கட்டும் பருவம் முதல் சூல்பருவம் வரை',
    titleEn: 'Daily Tip: Prevent BPH Flare-Up with AWD',
    titleTa: 'தினசரி வழிகாட்டல்: புகையான் தாக்குதலைத் தடுக்க AWD பாசனம்',
    preventionTipEn:
      'Avoid continuous stagnant water in paddy fields. Practice Alternate Wetting and Drying (AWD) to expose the tiller base to sunlight, which naturally suppresses BPH nymph multiplication.',
    preventionTipTa:
      'வயலில் எப்போதும் நீர் தேங்கி நிற்பதைத் தவிர்க்கவும். காய்ச்சலும் பாய்ச்சலுமாக (AWD) நீர் பாய்ச்சுவதன் மூலம் தூர்களின் அடிப்பகுதியில் சூரிய ஒளி பட்டு புகையான் குஞ்சுகள் பெருகுவது தடுக்கப்படும்.',
    actionProtocolEn: 'Drain water for 2-3 days; spray 5% Neem Seed Kernel Extract (NSKE) or Neem oil.',
    actionProtocolTa: '2-3 நாட்களுக்கு வயல் நீரை வடிக்கவும்; 5% வேப்பங்கொட்டை சாறு அல்லது வேப்ப எண்ணெய் தெளிக்கவும்.',
    urgency: 'warning',
  },
  {
    id: 'tip-paddy-02',
    cropKey: 'paddy',
    cropNameEn: 'Paddy / Rice',
    cropNameTa: 'நெல் பயிர்',
    diseaseEn: 'Rice Blast (Magnaporthe oryzae)',
    diseaseTa: 'நெல் குலைநோய் (இலை & கழுத்து குலைநோய்)',
    stageEn: 'Seedling to Booting Stage',
    stageTa: 'நாற்றங்கால் முதல் கதிர் உருவாகும் நிலை',
    titleEn: 'Daily Tip: Avoid High Nitrogen to Prevent Blast',
    titleTa: 'தினசரி வழிகாட்டல்: அதிக தழைச்சத்தை தவிர்த்து குலைநோயை தடுக்கவும்',
    preventionTipEn:
      'Over-application of Urea causes lush vegetative growth vulnerable to blast fungus spores. Apply Nitrogen in 3-4 split doses and treat seeds with Pseudomonas fluorescens bio-agent @ 10g/kg.',
    preventionTipTa:
      'அதிகப்படியான யூரியா இடுவதால் பயிர் அளவுக்கு மிஞ்சி செழித்து குலைநோய் பூஞ்சானை ஈர்க்கும். தழைச்சத்தை 3-4 முறை பிரித்து இடவும்; சூடோமோனாஸ் கொண்டு விதைநேர்த்தி செய்யவும்.',
    actionProtocolEn: 'Foliar spray Tricyclazole 75 WP @ 0.6g/L or Pseudomonas @ 2.5kg/acre in 200L water.',
    actionProtocolTa: 'டிரைசைக்ளசோல் 75 WP 0.6 கிராம்/லிட்டர் அல்லது சூடோமோனாஸ் தெளிக்கவும்.',
    urgency: 'alert',
  },
  {
    id: 'tip-paddy-03',
    cropKey: 'paddy',
    cropNameEn: 'Paddy / Rice',
    cropNameTa: 'நெல் பயிர்',
    diseaseEn: 'Bacterial Leaf Blight (BLB)',
    diseaseTa: 'பாக்டீரியா இலைக்கருகல் நோய்',
    stageEn: 'Tillering & Heading Phase',
    stageTa: 'தூர்க்கட்டுதல் & கதிர் வெளிவரும் தருணம்',
    titleEn: 'Daily Tip: Manage Cyclone & Strong Wind Leaf Bruising',
    titleTa: 'தினசரி வழிகாட்டல்: காற்று மழையால் இலை கிழியும்போது பாக்டீரியா பரவல் தடுப்பு',
    preventionTipEn:
      'Heavy delta winds cause leaf-tip tears allowing Xanthomonas bacteria entry. Spray fresh cow dung extract 20% supernatant to build leaf immunity.',
    preventionTipTa:
      'பலத்த காற்று மற்றும் மழையால் நெல் இலை நுனிகள் கிழிந்து பாக்டீரியா நுழையக்கூடும். 20% சாணக்கரைசல் தெளித்து இயற்கை நோய் எதிர்ப்புத் திறனை அதிகரிக்கவும்.',
    actionProtocolEn: 'Spray Streptomycin sulphate + Tetracycline (100g) + Copper Oxychloride (500g) per acre.',
    actionProtocolTa: 'ஸ்ட்ரெப்டோமைசின் மற்றும் காப்பர் ஆக்ஸிகுளோரைடு ஏக்கருக்கு 500 கிராம் கலந்து தெளிக்கவும்.',
    urgency: 'warning',
  },
  {
    id: 'tip-paddy-04',
    cropKey: 'paddy',
    cropNameEn: 'Paddy / Rice',
    cropNameTa: 'நெல் பயிர்',
    diseaseEn: 'Yellow Stem Borer (குருத்துப்பூச்சி)',
    diseaseTa: 'மஞ்சள் தண்டு துளைப்பான்',
    stageEn: 'Vegetative & Heading Stage',
    stageTa: 'வளர்ச்சிப் பருவம் & பால் பிடிக்கும் பருவம்',
    titleEn: 'Daily Tip: Install Pheromone Traps for Stem Borer',
    titleTa: 'தினசரி வழிகாட்டல்: தண்டு துளைப்பானைக் கட்டுப்படுத்த இனக்கவர்ச்சி பொறி',
    preventionTipEn:
      'Early detection of dead hearts or white ears starts with monitoring adult moths. Install 5 sex-pheromone traps per acre to disrupt mating cycles.',
    preventionTipTa:
      'வெண்கதிர் மற்றும் குருத்து காய்வதை முன்கூட்டியே தடுக்க ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறிகளை அமைத்து அந்துப்பூச்சிகளை கவர்ந்து அழிக்கவும்.',
    actionProtocolEn: 'Clip seedling tips before transplanting to remove egg masses; release Trichogramma japonicum.',
    actionProtocolTa: 'நடவு செய்யும் முன் நாற்றுகளின் நுனியை கிள்ளி நட்டால் முட்டைக்குவியல்கள் அழியும்.',
    urgency: 'info',
  },

  // --- Groundnut / Peanut (நிலக்கடலை) ---
  {
    id: 'tip-groundnut-01',
    cropKey: 'groundnut',
    cropNameEn: 'Groundnut / Peanut',
    cropNameTa: 'நிலக்கடலை',
    diseaseEn: 'Tikka Leaf Spot (Cercospora)',
    diseaseTa: 'டிக்கா இலைப்புள்ளி நோய்',
    stageEn: 'Pegging to Pod Filling',
    stageTa: 'விழுது இறங்குதல் & காய் பிடித்தல்',
    titleEn: 'Daily Tip: Prevent Tikka Leaf Spots & Defoliation',
    titleTa: 'தினசரி வழிகாட்டல்: டிக்கா இலைப்புள்ளி மற்றும் இலை உதிர்வைத் தடுத்தல்',
    preventionTipEn:
      'Inspect lower canopy leaves for circular dark brown spots with yellow halos. Remove affected lower leaves and maintain field border cleanliness.',
    preventionTipTa:
      'கீழ் இலைகளில் மஞ்சள் வளையத்துடன் கூடிய கரும்பழுப்பு புள்ளிகள் உள்ளதா என கண்காணிக்கவும். நிலக்கடலை வயல் வரப்புகளை சுத்தமாக வைக்கவும்.',
    actionProtocolEn: 'Spray Mancozeb 1000g or Carbendazim 200g/acre mixed in 200L water.',
    actionProtocolTa: 'மேன்கோசெப் 1000 கிராம் அல்லது கார்பென்டாசிம் 200 கிராம்/ஏக்கர் தெளிக்கவும்.',
    urgency: 'warning',
  },
  {
    id: 'tip-groundnut-02',
    cropKey: 'groundnut',
    cropNameEn: 'Groundnut / Peanut',
    cropNameTa: 'நிலக்கடலை',
    diseaseEn: 'Collar Rot & Root Rot',
    diseaseTa: 'வேரழுகல் மற்றும் தண்டு அழுகல்',
    stageEn: 'Seedling & Early Vegetative',
    stageTa: 'முளைப்பு & இளம்பயிர் பருவம்',
    titleEn: 'Daily Tip: Prevent Soil-Borne Fungal Rot with Trichoderma',
    titleTa: 'தினசரி வழிகாட்டல்: டிரைக்கோடெர்மா மூலம் வேரழுகல் நோய் தடுப்பு',
    preventionTipEn:
      'Over-irrigation in red soils creates damp conditions causing seedling collar collapse. Apply Trichoderma viride enriched Farmyard Manure (FYM) to root zone.',
    preventionTipTa:
      'அதிக பாசனத்தால் இளஞ்செடிகள் அழுகி சாயக்கூடும். மக்கிய தொழுவுரத்துடன் டிரைக்கோடெர்மா விரிடி கலந்து வேர்ப்பகுதியில் இடவும்.',
    actionProtocolEn: 'Soil drench with Carbendazim 1g/L if collar rot patches appear in field hills.',
    actionProtocolTa: 'பாதிக்கப்பட்ட இடங்களில் கார்பென்டாசிம் 1 கிராம்/லிட்டர் கொண்டு வேர் நனையும்படி ஊற்றவும்.',
    urgency: 'alert',
  },

  // --- Tomato (தக்காளி) ---
  {
    id: 'tip-tomato-01',
    cropKey: 'tomato',
    cropNameEn: 'Tomato',
    cropNameTa: 'தக்காளி',
    diseaseEn: 'Tomato Leaf Curl Virus (TLCV)',
    diseaseTa: 'தக்காளி இலை சுருட்டு வைரஸ்',
    stageEn: 'Vegetative to Early Flowering',
    stageTa: 'செடி வளர்ச்சி & முதல் பூத்தல்',
    titleEn: 'Daily Tip: Erect Yellow Sticky Traps for Whitefly Vectors',
    titleTa: 'தினசரி வழிகாட்டல்: வெள்ளை ஈக்களை கவர்ந்து அழிக்க மஞ்சள் ஒட்டுப்பொறி',
    preventionTipEn:
      'Leaf curl virus is spread rapidly by Bemisia tabaci whiteflies. Install 12-15 yellow sticky cards per acre slightly above crop canopy.',
    preventionTipTa:
      'இலை சுருட்டு வைரஸ் வெள்ளை ஈக்கள் மூலம் வேகமாக பரவும். ஏக்கருக்கு 12-15 மஞ்சள் நிற ஒட்டும் அட்டைகளை பயிர் உயரத்திற்கு மேல் மாட்டவும்.',
    actionProtocolEn: 'Spray Neem oil 3ml/L or Imidacloprid 17.8 SL @ 0.3ml/L at early vegetative stage.',
    actionProtocolTa: 'வேப்ப எண்ணெய் 3 மி.லி/லிட்டர் அல்லது இமிடாக்ளோபிரிட் 0.3 மி.லி/லிட்டர் தெளிக்கவும்.',
    urgency: 'alert',
  },
  {
    id: 'tip-tomato-02',
    cropKey: 'tomato',
    cropNameEn: 'Tomato',
    cropNameTa: 'தக்காளி',
    diseaseEn: 'Early Blight & Buckeye Rot',
    diseaseTa: 'முன் பருவ கருகல் & காய் அழுகல்',
    stageEn: 'Fruit Formation & Breaker Stage',
    stageTa: 'காய் பிடித்தல் & நிறம் மாறுதல்',
    titleEn: 'Daily Tip: Mulch and Stake to Keep Leaves Dry',
    titleTa: 'தினசரி வழிகாட்டல்: மூடாக்கு & முட்டு கொடுத்து இலைகளை தரையிலிருந்து உயர்த்தவும்',
    preventionTipEn:
      'Avoid overhead watering that splashes soil fungi onto lower fruits. Stake plants and strip bottom 15 cm of foliage to improve airflow.',
    preventionTipTa:
      'மழை அல்லது தெளிப்பு நீர் மண்ணிலுள்ள பூஞ்சானை காய்களில் தெளிக்காமல் இருக்க மூங்கில் குச்சி நட்டு செடிகளை உயர்த்தவும்.',
    actionProtocolEn: 'Spray Chlorothalonil 2g/L or Copper Oxychloride 2.5g/L before rain spells.',
    actionProtocolTa: 'மழைக்கு முன் காப்பர் ஆக்ஸிகுளோரைடு 2.5 கிராம்/லிட்டர் தெளிக்கவும்.',
    urgency: 'warning',
  },

  // --- Cotton (பருத்தி) ---
  {
    id: 'tip-cotton-01',
    cropKey: 'cotton',
    cropNameEn: 'Cotton',
    cropNameTa: 'பருத்தி',
    diseaseEn: 'Pink Bollworm (இளஞ்சிவப்பு காய்ப்புழு)',
    diseaseTa: 'இளஞ்சிவப்பு காய்ப்புழு தாக்குதல்',
    stageEn: 'Squaring to Boll Formation',
    stageTa: 'அரும்பு & காய் உருவாக்கம்',
    titleEn: 'Daily Tip: Destroy Rosette Flowers to Stop Bollworm',
    titleTa: 'தினசரி வழிகாட்டல்: ரோஜா பூ வடிவில் உள்ள அரும்புகளை அகற்றுதல்',
    preventionTipEn:
      'Inspect flower buds for characteristic rosette-shaped twisting caused by young larvae feeding inside. Pluck and bury rosette flowers immediately.',
    preventionTipTa:
      'ரோஜா மலர் போல முறுக்கிக் கொண்டிருக்கும் அரும்புகளை கவனித்து உடனே பறித்து மண்ணில் புதைக்கவும்.',
    actionProtocolEn: 'Install 5 Pherolure traps/acre; spray Profenofos 2ml/L if trap catches exceed 8 moths/day.',
    actionProtocolTa: 'ஏக்கருக்கு 5 இனக்கவர்ச்சி பொறி வைக்கவும்; புரோபனோபாஸ் 2 மி.லி/லிட்டர் தெளிக்கவும்.',
    urgency: 'alert',
  },

  // --- Blackgram / Pulses (உளுந்து & பாசிப்பயறு) ---
  {
    id: 'tip-pulses-01',
    cropKey: 'blackgram',
    cropNameEn: 'Blackgram / Pulses',
    cropNameTa: 'உளுந்து / பயறு வகைகள்',
    diseaseEn: 'Yellow Mosaic Virus (YMV)',
    diseaseTa: 'மஞ்சள் தேமல் நோய் (மஞ்சள் நச்சுயிரி)',
    stageEn: 'Vegetative to Flowering',
    stageTa: 'பயிர் வளர்ச்சி முதல் பூக்கும் பருவம்',
    titleEn: 'Daily Tip: Rogue Out Yellow Mosaic Infected Plants',
    titleTa: 'தினசரி வழிகாட்டல்: மஞ்சள் தேமல் தாக்கிய செடிகளை உடனே பிடுங்கி அழிக்கவும்',
    preventionTipEn:
      'Even a single plant showing bright yellow mosaic patches can infect the entire field through whiteflies. Rogue out early sick plants into a plastic bag.',
    preventionTipTa:
      'மஞ்சள் புள்ளிகளுடன் காணப்படும் நோய் தாக்கிய செடிகளை ஆரம்பத்திலேயே பிடுங்கி நெகிழி பையில் போட்டு தீயிட்டு அழிக்கவும்.',
    actionProtocolEn: 'Spray Dimethoate 30 EC @ 1.7ml/L or 3% Neem oil to arrest whitefly transmission.',
    actionProtocolTa: 'வெள்ளை ஈயை கட்டுப்படுத்த டைமெத்தோயேட் 1.7 மி.லி/லிட்டர் அல்லது 3% வேப்ப எண்ணெய் தெளிக்கவும்.',
    urgency: 'alert',
  },
  {
    id: 'tip-pulses-02',
    cropKey: 'blackgram',
    cropNameEn: 'Blackgram / Pulses',
    cropNameTa: 'உளுந்து / பயறு வகைகள்',
    diseaseEn: 'Powdery Mildew (Erysiphe polygoni)',
    diseaseTa: 'சாம்பல் நோய்',
    stageEn: 'Pod Formation Stage',
    stageTa: 'காய் பிடித்தல் & முதிர்ச்சி பருவம்',
    titleEn: 'Daily Tip: Check Leaf Surface for White Ash Coating',
    titleTa: 'தினசரி வழிகாட்டல்: இலைகளில் வெள்ளை சாம்பல் படலத்தை கவனியுங்கள்',
    preventionTipEn:
      'Cool night temperatures combined with morning dew favor powdery mildew. Spray wettable sulfur in early morning or fermented sour buttermilk spray.',
    preventionTipTa:
      'பனிப்பொழிவு மற்றும் குளிர்ந்த இரவுகளில் இலைகளில் வெள்ளை மாவு போன்ற படலம் தோன்றும். புளித்த மோர் கரைசல் அல்லது நனையும் கந்தகம் தெளிக்கவும்.',
    actionProtocolEn: 'Spray Wettable Sulfur 2.5g/L or Carbendazim 1g/L on both leaf surfaces.',
    actionProtocolTa: 'நனையும் கந்தகம் 2.5 கிராம்/லிட்டர் அல்லது கார்பென்டாசிம் 1 கிராம்/லிட்டர் தெளிக்கவும்.',
    urgency: 'info',
  },

  // --- Maize / Corn (மக்காச்சோளம்) ---
  {
    id: 'tip-maize-01',
    cropKey: 'maize',
    cropNameEn: 'Maize / Corn',
    cropNameTa: 'மக்காச்சோளம்',
    diseaseEn: 'Fall Armyworm (Spodoptera frugiperda)',
    diseaseTa: 'படைப்புழு தாக்குதல்',
    stageEn: 'Knee-High to Whorl Stage',
    stageTa: 'முழங்கால் அளவு வளர்ச்சி முதல் பூஞ்சாமரம் வரை',
    titleEn: 'Daily Tip: Whorl Sand + Ash Mixture Against Armyworm',
    titleTa: 'தினசரி வழிகாட்டல்: படைப்புழுவுக்கு குறுத்தில் மணல் + சாம்பல் போடுதல்',
    preventionTipEn:
      'Young larvae shelter inside central whorl leaves. Drop a pinch of dry river sand mixed with neem cake or wood ash (9:1) directly into whorls.',
    preventionTipTa:
      'குறுத்து இலைகளுக்குள் புழுக்கள் பதுங்கியிருக்கும். ஆற்று மணல் மற்றும் வேப்பம் புண்ணாக்கு அல்லது சாம்பல் (9:1) கலந்து குறுத்தில் ஒரு சிட்டிகை போடவும்.',
    actionProtocolEn: 'Spray Emamectin benzoate 5 SG @ 0.4g/L or Metarhizium anisopliae bio-fungicide @ 5g/L.',
    actionProtocolTa: 'எமாமெக்டின் பென்சோயேட் 0.4 கிராம்/லிட்டர் அல்லது மெட்டாரைசியம் உயிரி மருந்து தெளிக்கவும்.',
    urgency: 'alert',
  },

  // --- Banana (வாழை) ---
  {
    id: 'tip-banana-01',
    cropKey: 'banana',
    cropNameEn: 'Banana',
    cropNameTa: 'வாழை',
    diseaseEn: 'Sigatoka Leaf Spot',
    diseaseTa: 'சிகடோகா இலைப்புள்ளி நோய்',
    stageEn: 'Vegetative to Shooting',
    stageTa: 'மரம் வளரும் பருவம் & குலை தள்ளுதல்',
    titleEn: 'Daily Tip: Sanitation & Leaf Stripping for Sigatoka',
    titleTa: 'தினசரி வழிகாட்டல்: சிகடோகா நோய் பரவலைத் தடுக்க காய்ந்த இலைகளை நீக்குதல்',
    preventionTipEn:
      'Prune and burn lower dead leaves showing black spindle streaks to break the spore ejection cycle in wet humid weather.',
    preventionTipTa:
      'கருப்பு கோடுகளுடன் காய்ந்து தொங்கும் கீழ் இலைகளை வெட்டி வயலுக்கு வெளியே போட்டு எரிக்கவும்.',
    actionProtocolEn: 'Spray Propiconazole 1ml/L + mineral oil emulsion 10ml/L or Pseudomonas 20g/L.',
    actionProtocolTa: 'புரோபிகோனசோல் 1 மி.லி/லிட்டர் மற்றும் மினரல் ஆயில் கலந்து தெளிக்கவும்.',
    urgency: 'warning',
  },

  // --- Chilli (மிளகாய்) ---
  {
    id: 'tip-chilli-01',
    cropKey: 'chilli',
    cropNameEn: 'Chilli',
    cropNameTa: 'மிளகாய்',
    diseaseEn: 'Anthracnose & Fruit Rot (Dieback)',
    diseaseTa: 'கனி அழுகல் மற்றும் நுனிக்கருகல் நோய்',
    stageEn: 'Flowering & Fruiting Stage',
    stageTa: 'பூத்தல் & காய் முதிர்ச்சி பருவம்',
    titleEn: 'Daily Tip: Prevent Sunken Spots on Red Chilli Fruits',
    titleTa: 'தினசரி வழிகாட்டல்: மிளகாய் பழ அழுகல் மற்றும் வத்தல் கரும்புள்ளியைத் தடுத்தல்',
    preventionTipEn:
      'High humidity during fruit ripening causes black concentric ring lesions. Pick firm ripe chillies promptly and avoid morning sprinkler watering.',
    preventionTipTa:
      'பழங்கள் பழுக்கும் நேரத்தில் அதிக ஈரப்பதம் இருந்தால் காய் அழுகல் ஏற்படும். பழுத்த மிளகாய்களை உடனுக்குடன் பறித்து உலர்த்தவும்.',
    actionProtocolEn: 'Spray Azoxystrobin 1ml/L or Mancozeb 2g/L at 15-day intervals.',
    actionProtocolTa: 'அஸாக்ஸிஸ்ட்ரோபின் 1 மி.லி/லிட்டர் அல்லது மேன்கோசெப் 2 கிராம்/லிட்டர் தெளிக்கவும்.',
    urgency: 'warning',
  },

  // --- Sugarcane (கரும்பு) ---
  {
    id: 'tip-sugarcane-01',
    cropKey: 'sugarcane',
    cropNameEn: 'Sugarcane',
    cropNameTa: 'கரும்பு',
    diseaseEn: 'Red Rot (செவ்வழுகல் நோய்)',
    diseaseTa: 'செவ்வழுகல் நோய்',
    stageEn: 'Formative & Internode Elongation',
    stageTa: 'தூர்க்கட்டுதல் & தண்டு வளர்ச்சி பருவம்',
    titleEn: 'Daily Tip: Avoid Using Setts from Stunted Stalks',
    titleTa: 'தினசரி வழிகாட்டல்: செவ்வழுகல் பரவாமல் இருக்க தரமான விதைக்கரணைகள் தேர்வு',
    preventionTipEn:
      'Inspect split cane stalks for red discoloration with crosswise white patches. Never use infected fields for ratoon cropping.',
    preventionTipTa:
      'கரும்பு தண்டின் உள்பகுதி சிவப்பாகவும் குறுக்கு வெள்ளை வரிகளுடனும் இருந்தால் அது செவ்வழுகல். அந்த வயலில் மறுதாம்பு பயிர் செய்யக்கூடாது.',
    actionProtocolEn: 'Dip setts in Carbendazim 0.1% before planting; rogue out dried clumps with roots.',
    actionProtocolTa: 'கரணைகளை 0.1% கார்பென்டாசிம் கரைசலில் 15 நிமிடம் நனைத்து நடவும்.',
    urgency: 'alert',
  },
];

/**
 * Intelligent helper to select a relevant disease prevention tip
 * based on the user's currently tracked crops and history.
 */
export function getDiseasePreventionTipForCrops(
  trackedCropNames: string[],
  lastTipId?: string
): CropDiseasePreventionTip {
  // Normalize tracked crop names into keywords
  const normalized = trackedCropNames.map((c) => c.toLowerCase());

  // Search matching tips
  const matchingTips = CROP_DISEASE_PREVENTION_CATALOGUE.filter((tip) => {
    return normalized.some((name) => {
      if (tip.cropKey === 'paddy' && (name.includes('paddy') || name.includes('rice') || name.includes('samba') || name.includes('kuruvai') || name.includes('நெல்'))) return true;
      if (tip.cropKey === 'groundnut' && (name.includes('groundnut') || name.includes('peanut') || name.includes('நிலக்கடலை'))) return true;
      if (tip.cropKey === 'tomato' && (name.includes('tomato') || name.includes('தக்காளி'))) return true;
      if (tip.cropKey === 'cotton' && (name.includes('cotton') || name.includes('பருத்தி'))) return true;
      if (tip.cropKey === 'blackgram' && (name.includes('blackgram') || name.includes('urad') || name.includes('green') || name.includes('pulse') || name.includes('உளுந்து') || name.includes('பயறு'))) return true;
      if (tip.cropKey === 'maize' && (name.includes('maize') || name.includes('corn') || name.includes('சோளம்'))) return true;
      if (tip.cropKey === 'banana' && (name.includes('banana') || name.includes('வாழை'))) return true;
      if (tip.cropKey === 'chilli' && (name.includes('chilli') || name.includes('pepper') || name.includes('மிளகாய்'))) return true;
      if (tip.cropKey === 'sugarcane' && (name.includes('sugarcane') || name.includes('cane') || name.includes('கரும்பு'))) return true;
      return false;
    });
  });

  // Pick pool of tips: if matching tips exist, pick from them; else pick from all paddy/staple tips
  const candidatePool = matchingTips.length > 0
    ? matchingTips
    : CROP_DISEASE_PREVENTION_CATALOGUE.filter((t) => t.cropKey === 'paddy');

  // Avoid repeating the exact last tip if candidate pool has > 1
  const available = candidatePool.filter((t) => t.id !== lastTipId);
  const selectedList = available.length > 0 ? available : candidatePool;

  // Pick random or rotating
  const randomIndex = Math.floor(Math.random() * selectedList.length);
  return selectedList[randomIndex];
}
