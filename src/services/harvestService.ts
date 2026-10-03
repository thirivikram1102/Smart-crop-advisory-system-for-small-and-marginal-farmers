export interface CropMaturityInfo {
  id: string;
  nameEn: string;
  nameTa: string;
  category: 'Cereals' | 'Pulses' | 'Oilseeds' | 'Cash Crops' | 'Vegetables' | 'Horticulture';
  defaultDurationDays: number;
  minDurationDays: number;
  maxDurationDays: number;
  commonVarieties: { en: string; ta: string }[];
  stages: {
    nameEn: string;
    nameTa: string;
    startPct: number;
    endPct: number;
    adviceEn: string;
    adviceTa: string;
  }[];
}

export interface HarvestMilestone {
  stageNumber: number;
  nameEn: string;
  nameTa: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  dayRange: string;
  status: 'completed' | 'current' | 'upcoming';
  isHarvest: boolean;
  adviceEn: string;
  adviceTa: string;
}

export interface HarvestScheduleRecord {
  id: string;
  userId: string;
  cropId: string;
  cropName: string;
  cropNameTa: string;
  variety: string;
  plantingDate: string; // YYYY-MM-DD
  durationDays: number;
  expectedHarvestDate: string; // YYYY-MM-DD
  plotName: string;
  acres: number;
  status: 'active' | 'completed' | 'archived';
  createdAt?: string;
  updatedAt?: string;
}

export interface CalculatedHarvestDetails {
  plantingDate: string;
  expectedHarvestDate: string;
  harvestWindowStart: string;
  harvestWindowEnd: string;
  durationDays: number;
  daysElapsed: number;
  daysRemaining: number;
  progressPct: number;
  isReadyForHarvest: boolean;
  isOverdue: boolean;
  currentStageNameEn: string;
  currentStageNameTa: string;
  milestones: HarvestMilestone[];
  preHarvestActionTips: { en: string; ta: string; daysBefore: number; dateStr: string }[];
}

export const CROP_MATURITY_CATALOGUE: CropMaturityInfo[] = [
  {
    id: 'paddy-samba',
    nameEn: 'Samba Paddy (Late Duration)',
    nameTa: 'சம்பா நெல் (நீண்ட கால நெல்)',
    category: 'Cereals',
    defaultDurationDays: 135,
    minDurationDays: 130,
    maxDurationDays: 145,
    commonVarieties: [
      { en: 'CR 1009 (Ponmani)', ta: 'சி.ஆர் 1009 (பொன்மணி)' },
      { en: 'BPT 5204 (Andhra Ponni)', ta: 'பி.பி.டி 5204 (ஆந்திர பொன்னி)' },
      { en: 'CO 52', ta: 'கோ 52' },
      { en: 'ADT 45', ta: 'ஏ.டி.டி 45' },
    ],
    stages: [
      {
        nameEn: 'Nursery & Seedling Raising',
        nameTa: 'நாற்றங்கால் & விதை முளைப்பு',
        startPct: 0,
        endPct: 18,
        adviceEn: 'Maintain thin layer of water; treat seeds with Pseudomonas.',
        adviceTa: 'மிதமான நீர் பராமரிக்கவும்; சூடோமோனாஸ் விதைநேர்த்தி செய்யவும்.',
      },
      {
        nameEn: 'Transplanting & Active Tillering',
        nameTa: 'நடவு & தூர்க்கட்டும் பருவம்',
        startPct: 18,
        endPct: 40,
        adviceEn: 'Run cono-weeder for aeration; apply first Urea + Potash top dressing.',
        adviceTa: 'கோனோ-வீடர் மூலம் களை எடுத்து காற்றோட்டம் கூட்டவும்; யூரியா + பொட்டாஷ் மேலுரம் இடவும்.',
      },
      {
        nameEn: 'Panicle Initiation & Booting',
        nameTa: 'கதிர் உருவாகும் பருவம் (சூல்பருவம்)',
        startPct: 40,
        endPct: 62,
        adviceEn: 'Critical water stage! Do not allow soil to crack; inspect for stem borer.',
        adviceTa: 'முக்கிய நீர் தேவை பருவம்! வயல் காயாமல் பார்த்துக் கொள்ளவும்; தண்டு துளைப்பான் கவனிக்கவும்.',
      },
      {
        nameEn: 'Flowering & Grain Filling',
        nameTa: 'பூக்கும் & பால் பிடிக்கும் பருவம்',
        startPct: 62,
        endPct: 82,
        adviceEn: 'Maintain steady 2.5cm water film; avoid spraying chemicals during morning pollination.',
        adviceTa: '2.5 செ.மீ நீர் பராமரிக்கவும்; காலை மகரந்த சேர்க்கை நேரத்தில் மருந்து தெளிக்க வேண்டாம்.',
      },
      {
        nameEn: 'Dough Stage & Pre-Harvest Water Cutoff',
        nameTa: 'மணி முதிர்தல் & நீர் வடித்தல்',
        startPct: 82,
        endPct: 93,
        adviceEn: 'Drain water completely 10-12 days before harvest to facilitate uniform grain drying.',
        adviceTa: 'அறுவடைக்கு 10-12 நாட்களுக்கு முன் வயல் நீரை முழுமையாக வடிக்கவும்.',
      },
      {
        nameEn: 'Harvest Maturity (80% golden grains)',
        nameTa: 'அறுவடைக்கு உகந்த முதிர்ச்சி',
        startPct: 93,
        endPct: 100,
        adviceEn: 'Harvest when 80-85% grains turn golden straw color. Grain moisture ~20-22%.',
        adviceTa: '80-85% நெல்மணிகள் பொன்னிறமாக மாறியதும் உடனே அறுவடை செய்யவும்.',
      },
    ],
  },
  {
    id: 'paddy-kuruvai',
    nameEn: 'Kuruvai Paddy (Short Duration)',
    nameTa: 'குறுவை நெல் (குறுகிய கால நெல்)',
    category: 'Cereals',
    defaultDurationDays: 110,
    minDurationDays: 105,
    maxDurationDays: 118,
    commonVarieties: [
      { en: 'ADT 43', ta: 'ஏ.டி.டி 43' },
      { en: 'CO 51', ta: 'கோ 51' },
      { en: 'TPS 5', ta: 'டி.பி.எஸ் 5' },
    ],
    stages: [
      {
        nameEn: 'Nursery & Early Transplanting',
        nameTa: 'நாற்றங்கால் & நடவு',
        startPct: 0,
        endPct: 20,
        adviceEn: 'Transplant 14-16 day old young seedlings for SRI method.',
        adviceTa: '14-16 நாள் இளம் நாற்றுகளை செம்மை நெல் முறைப்படி நடவு செய்யவும்.',
      },
      {
        nameEn: 'Tillering & Vegetative Surge',
        nameTa: 'தீவிர தூர்க்கட்டு பருவம்',
        startPct: 20,
        endPct: 45,
        adviceEn: 'Alternate wetting & drying (AWD) saves groundwater and prevents lodging.',
        adviceTa: 'காய்ச்சலும் பாய்ச்சலுமாக நீர் பாய்ச்சி தூர்களை பெருக்கவும்.',
      },
      {
        nameEn: 'Heading & Panicle Primordia',
        nameTa: 'கதிர் வெளிவருதல்',
        startPct: 45,
        endPct: 70,
        adviceEn: 'Apply split dose of Potash to enhance grain weight.',
        adviceTa: 'மணி திரட்சிக்கு தேவையான பொட்டாஷ் உரத்தை இடவும்.',
      },
      {
        nameEn: 'Ripening & AWD Field Drying',
        nameTa: 'முதிர்ச்சி & வயல் உலர்த்துதல்',
        startPct: 70,
        endPct: 90,
        adviceEn: 'Cutoff water supply 10 days prior to combine harvester arrival.',
        adviceTa: 'அறுவடை இயந்திரம் இறங்க ஏதுவாக 10 நாள் முன்பு தண்ணீர் பாய்ச்சுவதை நிறுத்தவும்.',
      },
      {
        nameEn: 'Combine Harvesting Window',
        nameTa: 'முழுமையான அறுவடை தருணம்',
        startPct: 90,
        endPct: 100,
        adviceEn: 'Harvest promptly to avoid lodging and sudden monsoon showers.',
        adviceTa: 'திடீர் மழையில் மணி உதிர்வதை தடுக்க குறித்த நாளில் அறுவடை முடிக்கவும்.',
      },
    ],
  },
  {
    id: 'blackgram',
    nameEn: 'Blackgram / Urad (உளுந்து)',
    nameTa: 'உளுந்து (வம்பன் - நவரை / தரிசு)',
    category: 'Pulses',
    defaultDurationDays: 70,
    minDurationDays: 65,
    maxDurationDays: 75,
    commonVarieties: [
      { en: 'Vamban 8 (VBN 8)', ta: 'வம்பன் 8 (VBN 8)' },
      { en: 'VBN 6', ta: 'வம்பன் 6' },
      { en: 'T9', ta: 'டி 9' },
    ],
    stages: [
      {
        nameEn: 'Germination & Seedling',
        nameTa: 'முளைப்பு & பயிர் உருவாக்கம்',
        startPct: 0,
        endPct: 25,
        adviceEn: 'Treat with Rhizobium & Phosphobacteria bio-fertilizers.',
        adviceTa: 'ரைசோபியம் மற்றும் பாஸ்போபாக்டீரியா கொண்டு விதைநேர்த்தி செய்யவும்.',
      },
      {
        nameEn: 'Branching & Pre-Flowering',
        nameTa: 'கிளைத்தல் & மொட்டு உருவாக்கம்',
        startPct: 25,
        endPct: 50,
        adviceEn: 'Foliar spray DAP 2% or TNAU Pulse Wonder to prevent flower drop.',
        adviceTa: 'பூ உதிர்வதை தடுக்க 2% டி.ஏ.பி அல்லது பல்ஸ் வொண்டர் தெளிக்கவும்.',
      },
      {
        nameEn: 'Pod Formation & Seed Filling',
        nameTa: 'காய் பிடித்தல் & மணி திரட்சி',
        startPct: 50,
        endPct: 80,
        adviceEn: 'Ensure soil has slight residual moisture; monitor for pod borer caterpillars.',
        adviceTa: 'மிதமான ஈரப்பதம் பராமரிக்கவும்; காய்ப்புழு தாக்குதலை கண்காணிக்கவும்.',
      },
      {
        nameEn: 'Pod Desiccation & Harvesting',
        nameTa: 'காய் முதிர்ச்சி & செடி அறுவடை',
        startPct: 80,
        endPct: 100,
        adviceEn: 'Harvest when 75-80% of pods turn dark black. Dry on threshing floor for 2-3 days.',
        adviceTa: '75-80% காய்கள் கருமை நிறமாக மாறியதும் செடியை பிடுங்கி களத்தில் காயவைக்கவும்.',
      },
    ],
  },
  {
    id: 'groundnut',
    nameEn: 'Groundnut / Peanut (நிலக்கடலை)',
    nameTa: 'நிலக்கடலை (மணிலா)',
    category: 'Oilseeds',
    defaultDurationDays: 105,
    minDurationDays: 100,
    maxDurationDays: 115,
    commonVarieties: [
      { en: 'TMV 7', ta: 'டி.எம்.வி 7' },
      { en: 'VRI 2', ta: 'வி.ஆர்.ஐ 2' },
      { en: 'Kadiri 6', ta: 'கதிரி 6' },
    ],
    stages: [
      {
        nameEn: 'Emergence & Early Rooting',
        nameTa: 'விதை முளைப்பு & வேர் வளர்ச்சி',
        startPct: 0,
        endPct: 20,
        adviceEn: 'Apply Trichoderma viride seed treatment to prevent root rot.',
        adviceTa: 'வேர் அழுகலை தடுக்க டிரைக்கோடெர்மா விரிடி விதைநேர்த்தி செய்யவும்.',
      },
      {
        nameEn: 'Flowering & Peg Penetration (விழுது இறங்குதல்)',
        nameTa: 'பூத்தல் & விழுது இறங்குதல்',
        startPct: 20,
        endPct: 50,
        adviceEn: 'CRITICAL: Earth up soil around plants and apply Gypsum @ 200kg/acre; never disturb soil once pegs enter ground.',
        adviceTa: 'மிக முக்கியம்: ஜிப்சம் ஏக்கருக்கு 200 கிலோ இட்டு மண் அணைக்கவும்; விழுது இறங்கிய பின் மண்ணை கிளறக் கூடாது.',
      },
      {
        nameEn: 'Pod Development & Kernels Growth',
        nameTa: 'காய் பிடித்தல் & பருப்பு பெருக்கம்',
        startPct: 50,
        endPct: 85,
        adviceEn: 'Maintain adequate moisture for pod filling; avoid water stress.',
        adviceTa: 'பருப்பு நன்றாக திரள மிதமான பாசனம் வழங்கவும்.',
      },
      {
        nameEn: 'Harvest Readiness Check',
        nameTa: 'முதிர்ச்சி ஆய்வு & பிடுங்குதல்',
        startPct: 85,
        endPct: 100,
        adviceEn: 'Pull sample plants: inner pod shell should show dark brown/black veins. Irrigate lightly before pulling if soil is hard.',
        adviceTa: 'மாதிரி செடியை பிடுங்கி பார்க்கும்போது ஓட்டின் உள்பகுதி கருஞ்சிவப்பாக இருந்தால் உடனே அறுவடை செய்யவும்.',
      },
    ],
  },
  {
    id: 'tomato',
    nameEn: 'Tomato (தக்காளி)',
    nameTa: 'ஹைபிரிட் தக்காளி',
    category: 'Vegetables',
    defaultDurationDays: 115,
    minDurationDays: 105,
    maxDurationDays: 125,
    commonVarieties: [
      { en: 'Shivam Hybrid', ta: 'சிவம் ஹைபிரிட்' },
      { en: 'Arka Rakshak', ta: 'அர்கா ரக்ஷக்' },
      { en: 'PKM 1', ta: 'பி.கே.எம் 1' },
    ],
    stages: [
      {
        nameEn: 'Transplanting & Staking',
        nameTa: 'நடவு & முட்டு கொடுத்தல்',
        startPct: 0,
        endPct: 25,
        adviceEn: 'Provide bamboo stake support; apply silver-black mulch for weed suppression.',
        adviceTa: 'செடிகள் சாயாமல் மூங்கில் குச்சி கட்டவும்; மூடாக்கு பயன்படுத்தவும்.',
      },
      {
        nameEn: 'Flowering & Early Fruit Set',
        nameTa: 'பூத்தல் & பிஞ்சு பிடித்தல்',
        startPct: 25,
        endPct: 55,
        adviceEn: 'Spray Boron 0.2% to improve fruit set and reduce blossom end rot.',
        adviceTa: 'பூக்கள் காயாக மாற போரான் தெளிக்கவும்; சொட்டுநீர் மூலம் உரம் பாய்ச்சவும்.',
      },
      {
        nameEn: 'Fruit Sizing & Breaker Stage',
        nameTa: 'காய் பெருக்கம் & நிறம் மாறுதல்',
        startPct: 55,
        endPct: 80,
        adviceEn: 'First pickings begin as green fruit shows faint pink star at blossom end.',
        adviceTa: 'காயின் நுனியில் லேசான இளஞ்சிவப்பு நிறம் தோன்றும் போது முதல் அறுவடை செய்யலாம்.',
      },
      {
        nameEn: 'Peak Harvest Waves (Multiple Pickings)',
        nameTa: 'தொடர் அறுவடை பருவம்',
        startPct: 80,
        endPct: 100,
        adviceEn: 'Pick firm ripe fruits every 3-4 days in early morning hours for maximum market shelf life.',
        adviceTa: 'அதிகாலை வேளையில் 3-4 நாட்களுக்கு ஒருமுறை பழங்களை பறித்து கூடைகளில் அடுக்கவும்.',
      },
    ],
  },
  {
    id: 'cotton',
    nameEn: 'Cotton (பருத்தி)',
    nameTa: 'பருத்தி',
    category: 'Cash Crops',
    defaultDurationDays: 155,
    minDurationDays: 145,
    maxDurationDays: 170,
    commonVarieties: [
      { en: 'MCU 5', ta: 'எம்.சி.யூ 5' },
      { en: 'Suraj', ta: 'சூரஜ்' },
      { en: 'SVPR 2', ta: 'எஸ்.வி.பி.ஆர் 2' },
    ],
    stages: [
      {
        nameEn: 'Germination & Monopodial Branching',
        nameTa: 'முளைப்பு & பக்கக் கிளைகள்',
        startPct: 0,
        endPct: 30,
        adviceEn: 'Gap fill within 10 days; thin to one healthy seedling per hill.',
        adviceTa: '10 நாட்களுக்குள் இடைவெளி நிரப்பி ஒரு குழிக்கு ஒரு செடி மட்டும் வைக்கவும்.',
      },
      {
        nameEn: 'Squaring & Flowering (பூக்கும் பருவம்)',
        nameTa: 'அரும்பு & பூ மலர்தல்',
        startPct: 30,
        endPct: 60,
        adviceEn: 'Install pheromone traps (5/acre) for pink bollworm detection; spray NAA for flower retention.',
        adviceTa: 'இளஞ்சிவப்பு காய்ப்புழுவிற்கு இனக்கவர்ச்சி பொறி வைக்கவும்; பிளானோபிக்ஸ் தெளிக்கவும்.',
      },
      {
        nameEn: 'Boll Development & Maturation',
        nameTa: 'காய் பிடித்தல் & முதிர்தல்',
        startPct: 60,
        endPct: 85,
        adviceEn: 'Top shoot nipping at 80-90th day to divert nutrients to developing bolls.',
        adviceTa: '80-90 நாட்களில் நுனி கிள்ளி பக்கவாட்டு காய்களை பெருக்கச் செய்யவும்.',
      },
      {
        nameEn: 'Boll Bursting & Fluffy Picking',
        nameTa: 'பஞ்சு வெடித்தல் & எடுக்கும் பருவம்',
        startPct: 85,
        endPct: 100,
        adviceEn: 'Pick clean, well-burst cotton bolls in dry sunny morning hours without leaf trash.',
        adviceTa: 'நன்கு வெடித்த வெண்பஞ்சை இலைச்சருகுகள் படாமல் பக்குவமாக எடுக்கவும்.',
      },
    ],
  },
  {
    id: 'maize',
    nameEn: 'Maize / Corn (மக்காச்சோளம்)',
    nameTa: 'மக்காச்சோளம்',
    category: 'Cereals',
    defaultDurationDays: 105,
    minDurationDays: 95,
    maxDurationDays: 115,
    commonVarieties: [
      { en: 'CO 6', ta: 'கோ 6' },
      { en: 'Pioneer 30V92', ta: 'பயனீர் 30V92' },
      { en: 'NK 6240', ta: 'என்.கே 6240' },
    ],
    stages: [
      {
        nameEn: 'Knee-high Stage & Whorl Vigor',
        nameTa: 'முழங்கால் அளவு வளர்ச்சி',
        startPct: 0,
        endPct: 30,
        adviceEn: 'Inspect whorl leaves for Fall Armyworm (படைப்புழு) damage; apply Metarhizium or Emamectin.',
        adviceTa: 'படைப்புழு தாக்குதல் உள்ளதா என குறுத்து இலைகளை கண்காணிக்கவும்.',
      },
      {
        nameEn: 'Tasseling & Silking (பூஞ்சாமரம் & கதிர் முடி)',
        nameTa: 'பூஞ்சாமரம் & சூல்முடி தோன்றுதல்',
        startPct: 30,
        endPct: 65,
        adviceEn: 'Most sensitive water stress period! Never allow moisture stress during pollination.',
        adviceTa: 'மகரந்த சேர்க்கை நடைபெறும் காலம் என்பதால் தண்ணீர் தட்டுப்பாடு இல்லாமல் பாய்ச்சவும்.',
      },
      {
        nameEn: 'Cob Filling & Milk to Dough',
        nameTa: 'கதிர் பால் பிடித்தல்',
        startPct: 65,
        endPct: 88,
        adviceEn: 'Grains harden rapidly; protect cobs from bird and wild boar damage.',
        adviceTa: 'மணிகள் திரளும் தருணம்; பறவைகள் மற்றும் காட்டுப்பன்றிகளிடமிருந்து பாதுகாக்கவும்.',
      },
      {
        nameEn: 'Black Layer & Husks Drying',
        nameTa: 'கருப்பு வளையம் & அறுவடை',
        startPct: 88,
        endPct: 100,
        adviceEn: 'Outer husk turns dry straw yellow; black layer visible at grain base. Ready for dehusking.',
        adviceTa: 'மட்டை காய்ந்து வெளிறியதும், தானியத்தின் அடிப்பகுதியில் கருப்பு வளையம் தோன்றினால் அறுவடை செய்யலாம்.',
      },
    ],
  },
  {
    id: 'sugarcane',
    nameEn: 'Sugarcane (கரும்பு)',
    nameTa: 'கரும்பு (ஆலைக்கரும்பு)',
    category: 'Cash Crops',
    defaultDurationDays: 345,
    minDurationDays: 320,
    maxDurationDays: 365,
    commonVarieties: [
      { en: 'Co 86032 (Nayana)', ta: 'கோ 86032 (நயனா)' },
      { en: 'Co 0212', ta: 'கோ 0212' },
      { en: 'CoC 24', ta: 'கோ.சி 24' },
    ],
    stages: [
      {
        nameEn: 'Germination & Formative Tillering',
        nameTa: 'முளைப்பு & தூர்க்கட்டுதல்',
        startPct: 0,
        endPct: 30,
        adviceEn: 'Plant two-budded setts; earthing up and apply basal Nitrogen.',
        adviceTa: 'இரு பரு கரணைகளை நடவும்; முதல் மண் அணைத்து தழைச்சத்து இடவும்.',
      },
      {
        nameEn: 'Grand Growth & Internode Elongation',
        nameTa: 'தீவிர கரும்பு தண்டு வளர்ச்சி',
        startPct: 30,
        endPct: 70,
        adviceEn: 'Trash mulching to conserve moisture; wrap canes to prevent lodging.',
        adviceTa: 'சோகை மூடாக்கு இடவும்; கரும்புகள் சாயாமல் சோகைகளை சுற்றி கட்டவும்.',
      },
      {
        nameEn: 'Sucrose Accumulation & Ripening',
        nameTa: 'சர்க்கரை சத்து திரள் பருவம்',
        startPct: 70,
        endPct: 92,
        adviceEn: 'Withhold irrigation 15-20 days prior to harvest for peak Brix sucrose reading.',
        adviceTa: 'சர்க்கரை அளவு அதிகரிக்க அறுவடைக்கு 15-20 நாட்களுக்கு முன் பாசனத்தை நிறுத்தவும்.',
      },
      {
        nameEn: 'Harvesting & Sugar Mill Cutting Window',
        nameTa: 'ஆலை வெட்டு & முழு அறுவடை',
        startPct: 92,
        endPct: 100,
        adviceEn: 'Cut canes close to ground level using sharp cane billhooks; transport to mill within 24 hours.',
        adviceTa: 'தரை மட்டத்திற்கு ஆழமாக வெட்டி 24 மணி நேரத்திற்குள் சர்க்கரை ஆலைக்கு கொண்டு செல்லவும்.',
      },
    ],
  },
  {
    id: 'banana',
    nameEn: 'Banana (வாழை)',
    nameTa: 'வாழை (நேந்திரன் / பூவன் / ஜி9)',
    category: 'Horticulture',
    defaultDurationDays: 330,
    minDurationDays: 300,
    maxDurationDays: 360,
    commonVarieties: [
      { en: 'Grand Naine (G9)', ta: 'ஜி9 (திசு வாழை)' },
      { en: 'Poovan', ta: 'பூவன்' },
      { en: 'Nendran', ta: 'நேந்திரன்' },
      { en: 'Rasthali', ta: 'ரஸ்தாளி' },
    ],
    stages: [
      {
        nameEn: 'Sucker Establishment & Shooting Leaves',
        nameTa: 'கன்று வேரூன்றுதல் & இலைகள் பெருக்கம்',
        startPct: 0,
        endPct: 35,
        adviceEn: 'Dip sword suckers in cow dung slurry with Pseudomonas; apply drip fertigation.',
        adviceTa: 'கன்றுகளை சாணக்கரைசல் மற்றும் சூடோமோனாஸில் நனைத்து நடவும்.',
      },
      {
        nameEn: 'Bunch Shooting & Inflorescence',
        nameTa: 'குலை தள்ளுதல் (ஈனுதல்)',
        startPct: 35,
        endPct: 70,
        adviceEn: 'Provide Casuarina pole staking to prevent stem snap from heavy winds.',
        adviceTa: 'காற்றுக்கு மரம் சாயாமல் சவுக்கு முட்டுக் கொடுத்து தாங்கவும்.',
      },
      {
        nameEn: 'Finger Sizing & Bunch Sleeving',
        nameTa: 'காய் திரட்சி & குலை உறை போடுதல்',
        startPct: 70,
        endPct: 90,
        adviceEn: 'Remove male flower bud (denavelling); cover bunch with blue polypropylene sleeves.',
        adviceTa: 'ஆண் பூ மொட்டை ஒடித்து நீக்கவும்; நீல பாலித்தீன் உறை அணிவித்து காய் தரம் காக்கவும்.',
      },
      {
        nameEn: 'Angles Disappearing & Harvest',
        nameTa: 'காய் பட்டை மறைந்து திரட்சி & அறுவடை',
        startPct: 90,
        endPct: 100,
        adviceEn: 'Harvest when fruit ridges become round and light green; handle bunch gently to avoid bruising.',
        adviceTa: 'காயின் கோணங்கள்/பட்டைகள் மறைந்து உருண்டையானதும் குலையை வெட்டவும்.',
      },
    ],
  },
  {
    id: 'chilli',
    nameEn: 'Chilli / Red Pepper (மிளகாய்)',
    nameTa: 'மிளகாய் (குண்டு / சாம்பல்)',
    category: 'Vegetables',
    defaultDurationDays: 135,
    minDurationDays: 120,
    maxDurationDays: 150,
    commonVarieties: [
      { en: 'K2 Chilli', ta: 'கே 2 மிளகாய்' },
      { en: 'Ramnad Mundu', ta: 'ராமநாதபுரம் குண்டு மிளகாய்' },
      { en: 'PKM 1', ta: 'பி.கே.எம் 1' },
    ],
    stages: [
      {
        nameEn: 'Nursery to Mainfield Transplanting',
        nameTa: 'நாற்று நடவு & செடி நிலைபெறுதல்',
        startPct: 0,
        endPct: 25,
        adviceEn: 'Transplant 35-day sturdy seedlings on ridges; drench with Trichoderma.',
        adviceTa: 'பார் அமைத்து 35 நாள் நாற்றுகளை நடவும்; வேரழுகல் வராமல் பராமரிக்கவும்.',
      },
      {
        nameEn: 'Branching & Profuse Flowering',
        nameTa: 'பக்கவாட்டு கிளைகள் & பூத்தல்',
        startPct: 25,
        endPct: 55,
        adviceEn: 'Install yellow sticky traps for thrips and whiteflies; spray micronutrient mixture.',
        adviceTa: 'இலைப்பேன் மற்றும் வெள்ளை ஈ கட்டுப்படுத்த மஞ்சள் ஒட்டுப்பொறி வைக்கவும்.',
      },
      {
        nameEn: 'Green Chilli Pickings',
        nameTa: 'பச்சை மிளகாய் பறிப்பு',
        startPct: 55,
        endPct: 75,
        adviceEn: 'Pick plump shiny dark green pods periodically to boost further flowering.',
        adviceTa: 'பளபளப்பான பச்சை மிளகாய்களை வாரம் ஒருமுறை பறித்து சந்தைப்படுத்தவும்.',
      },
      {
        nameEn: 'Deep Red Pod Drying Harvest',
        nameTa: 'சிவப்பு வத்தல் முதிர்ச்சி அறுவடை',
        startPct: 75,
        endPct: 100,
        adviceEn: 'Harvest well-ripened red fruits; dry under sun on clean tarpaulin sheets to 10% moisture.',
        adviceTa: 'நன்கு பழுத்த செங்காய்களை பறித்து தார்ப்பாயில் 10% ஈரப்பதம் வரும் வரை உலர்த்தி வத்தலாக்கவும்.',
      },
    ],
  },
  {
    id: 'greengram',
    nameEn: 'Green Gram / Moong (பாசிப்பயறு)',
    nameTa: 'பாசிப்பயறு (பயறு)',
    category: 'Pulses',
    defaultDurationDays: 65,
    minDurationDays: 60,
    maxDurationDays: 72,
    commonVarieties: [
      { en: 'CO (Gg) 7', ta: 'கோ 7' },
      { en: 'VBN (Gg) 2', ta: 'வம்பன் 2' },
      { en: 'VRM (Gg) 1', ta: 'வி.ஆர்.எம் 1' },
    ],
    stages: [
      {
        nameEn: 'Germination & Early Leafing',
        nameTa: 'முளைப்பு & இலை வளர்ச்சி',
        startPct: 0,
        endPct: 25,
        adviceEn: 'Treat with Rhizobium bio-fertilizer; maintain loose weed-free soil.',
        adviceTa: 'ரைசோபியம் விதைநேர்த்தி செய்யவும்; களைகளை நீக்கவும்.',
      },
      {
        nameEn: 'Flower Blooming & Pod Set',
        nameTa: 'மஞ்சரி மலர்தல் & பிஞ்சு பிடித்தல்',
        startPct: 25,
        endPct: 55,
        adviceEn: 'Foliar spray DAP 2% at flower initiation to retain maximum pods.',
        adviceTa: 'பூக்கள் உதிராமல் இருக்க 2% டிஏபி கரைசல் தெளிக்கவும்.',
      },
      {
        nameEn: 'Pod Maturation & Color Change',
        nameTa: 'காய் கருமை நிறம் மாறுதல்',
        startPct: 55,
        endPct: 85,
        adviceEn: 'Pods turn from olive green to brownish-black; guard against birds.',
        adviceTa: 'காய்கள் பழுப்பு மற்றும் கருமை நிறமாக மாறும் தருணம்.',
      },
      {
        nameEn: 'Harvest & Sun Drying',
        nameTa: 'செடி அறுவடை & கதிர் அடித்தல்',
        startPct: 85,
        endPct: 100,
        adviceEn: 'Harvest early morning when pods are supple to prevent shattering in field.',
        adviceTa: 'காய்கள் வெடித்து சிதறாமல் இருக்க அதிகாலை பனியில் செடிகளை அறுவடை செய்யவும்.',
      },
    ],
  },
  {
    id: 'sesame',
    nameEn: 'Sesame / Gingelly (எள்ளு)',
    nameTa: 'எள்ளு (வெள்ளை / கருப்பு எள்ளு)',
    category: 'Oilseeds',
    defaultDurationDays: 80,
    minDurationDays: 75,
    maxDurationDays: 88,
    commonVarieties: [
      { en: 'TMV 3', ta: 'டி.எம்.வி 3' },
      { en: 'TMV 7', ta: 'டி.எம்.வி 7' },
      { en: 'SVPR 1', ta: 'எஸ்.வி.பி.ஆர் 1' },
    ],
    stages: [
      {
        nameEn: 'Emergence & Hill Thinning',
        nameTa: 'முளைப்பு & செடி கலைத்தல்',
        startPct: 0,
        endPct: 25,
        adviceEn: 'Thin seedlings to 15cm spacing at 15th-20th day for strong branching.',
        adviceTa: '15-20 நாட்களில் செடிகளை கலைத்து 15 செ.மீ இடைவெளி விடவும்.',
      },
      {
        nameEn: 'Capsule Formation & Flowering',
        nameTa: 'பூத்தல் & காய் உருவாக்கம்',
        startPct: 25,
        endPct: 65,
        adviceEn: 'Irrigate at 65-70% flowering stage; avoid waterlogging.',
        adviceTa: 'பூக்கும் தருணத்தில் பாசனம் செய்யவும்; நீர் தேங்க விடக்கூடாது.',
      },
      {
        nameEn: 'Leaves Shedding & Capsule Yellowing',
        nameTa: 'இலைகள் உதிர்தல் & காய் வெளிறல்',
        startPct: 65,
        endPct: 90,
        adviceEn: 'Lower leaves turn yellow and drop; bottom capsules turn pale yellow.',
        adviceTa: 'அடி இலைகள் உதிர்ந்து கீழ் காய்கள் மஞ்சள் நிறமாக மாறும்.',
      },
      {
        nameEn: 'Harvesting & Bundle Curing',
        nameTa: 'அறுவடை & கட்டு கட்டி காய்ச்சுதல்',
        startPct: 90,
        endPct: 100,
        adviceEn: 'Cut plants before top capsules burst; stack in conical shocks for 7 days before threshing.',
        adviceTa: 'காய்கள் வெடிப்பதற்குள் செடிகளை அறுத்து கட்டு கட்டி 7 நாட்கள் களத்தில் குவித்து பின் அடிக்கவும்.',
      },
    ],
  },
  {
    id: 'ragi',
    nameEn: 'Finger Millet / Ragi (கேழ்வரகு)',
    nameTa: 'கேழ்வரகு / ராகி (ஆரியம்)',
    category: 'Cereals',
    defaultDurationDays: 105,
    minDurationDays: 95,
    maxDurationDays: 115,
    commonVarieties: [
      { en: 'GPU 28', ta: 'ஜி.பி.யூ 28' },
      { en: 'CO 14', ta: 'கோ 14' },
      { en: 'Paiyur 2', ta: 'பையூர் 2' },
    ],
    stages: [
      {
        nameEn: 'Seedling Raising & Transplanting',
        nameTa: 'நாற்று நடுதல் & தூர்க்கட்டுதல்',
        startPct: 0,
        endPct: 30,
        adviceEn: 'Transplant 18-20 day seedlings; apply Azospirillum bio-fertilizer.',
        adviceTa: '18-20 நாள் நாற்றுகளை நடவும்; அசோஸ்பைரில்லம் பயன்படுத்தவும்.',
      },
      {
        nameEn: 'Earhead Emergence (Finger Shaping)',
        nameTa: 'கதிர் வெளிவருதல் (விரல் வடிவம்)',
        startPct: 30,
        endPct: 65,
        adviceEn: 'Maintain light soil moisture; inspect for blast disease lesions.',
        adviceTa: 'லேசான ஈரப்பதம் பராமரிக்கவும்; குலைநோய் அறிகுறி உள்ளதா என கவனிக்கவும்.',
      },
      {
        nameEn: 'Grain Filling & Brown Browning',
        nameTa: 'மணி திரட்சி & பழுப்பு நிறம் பெறுதல்',
        startPct: 65,
        endPct: 88,
        adviceEn: 'Earheads turn from green to characteristic chocolate-brown color.',
        adviceTa: 'கதிர்கள் பச்சையிலிருந்து சாக்லேட் பழுப்பு நிறத்திற்கு மாறும்.',
      },
      {
        nameEn: 'Earhead Harvesting',
        nameTa: 'கதிர் அறுவடை & களம் சேர்த்தல்',
        startPct: 88,
        endPct: 100,
        adviceEn: 'Cut mature brown earheads with sickles; dry on threshing floor for 3 days before threshing.',
        adviceTa: 'பழுப்பு நிற கதிர்களை மட்டும் அரிவாளால் அறுத்து களத்தில் உலர்த்தி மணி பிரிக்கவும்.',
      },
    ],
  },
];

/**
 * Core mathematical engine to calculate expected harvest date,
 * timeline milestones, countdown, and pre-harvest agronomic reminders.
 */
export function calculateHarvestSchedule(
  plantingDateStr: string,
  durationDays: number,
  cropId?: string
): CalculatedHarvestDetails {
  const pDate = new Date(plantingDateStr);
  const now = new Date();

  // Validate date
  const validPDate = isNaN(pDate.getTime()) ? new Date() : pDate;

  // Expected harvest date
  const hDate = new Date(validPDate.getTime() + durationDays * 24 * 60 * 60 * 1000);

  // Harvest Window: earliest to latest safe harvest (± 4 days)
  const windowStart = new Date(hDate.getTime() - 4 * 24 * 60 * 60 * 1000);
  const windowEnd = new Date(hDate.getTime() + 4 * 24 * 60 * 60 * 1000);

  // Days calculations
  const msPerDay = 24 * 60 * 60 * 1000;
  const daysElapsed = Math.max(0, Math.floor((now.getTime() - validPDate.getTime()) / msPerDay));
  const daysRemaining = Math.ceil((hDate.getTime() - now.getTime()) / msPerDay);
  const rawProgress = Math.min(100, Math.max(0, Math.round((daysElapsed / durationDays) * 100)));

  const isReadyForHarvest = daysRemaining <= 3 && daysElapsed >= durationDays * 0.9;
  const isOverdue = daysRemaining < 0;

  // Retrieve crop stages definition or build standard 5-stage phenological progression
  const cropConfig = CROP_MATURITY_CATALOGUE.find((c) => c.id === cropId);
  const stagesDef = cropConfig?.stages || [
    {
      nameEn: 'Germination & Early Emergence',
      nameTa: 'முளைப்பு & தொடக்க வளர்ச்சி',
      startPct: 0,
      endPct: 20,
      adviceEn: 'Ensure optimum soil moisture and monitor seed emergence.',
      adviceTa: 'சீரான மண் ஈரப்பதம் பராமரித்து முளைப்பை கவனிக்கவும்.',
    },
    {
      nameEn: 'Active Vegetative Growth',
      nameTa: 'தீவிர செடி வளர்ச்சி',
      startPct: 20,
      endPct: 50,
      adviceEn: 'Apply scheduled nitrogen & potassium top dressing; remove weeds.',
      adviceTa: 'மேலுரம் இடவும்; களைகளை அகற்றி வேர்களுக்கு காற்றோட்டம் தரவும்.',
    },
    {
      nameEn: 'Flowering & Reproductive Phase',
      nameTa: 'பூக்கும் & காய்/கதிர் பிடிக்கும் பருவம்',
      startPct: 50,
      endPct: 75,
      adviceEn: 'Peak water requirement stage. Avoid moisture stress.',
      adviceTa: 'அதிக நீர் தேவைப்படும் பருவம். வயல் காயாமல் பார்த்துக் கொள்ளவும்.',
    },
    {
      nameEn: 'Maturity & Pre-Harvest Water Cutoff',
      nameTa: 'முதிர்ச்சி & நீர் வடித்தல்',
      startPct: 75,
      endPct: 92,
      adviceEn: 'Cutoff irrigation 10-12 days before harvest for uniform ripening.',
      adviceTa: 'அறுவடைக்கு 10-12 நாட்கள் முன்பு தண்ணீர் பாய்ச்சுவதை நிறுத்தவும்.',
    },
    {
      nameEn: 'Peak Harvest Readiness',
      nameTa: 'அறுவடைக்கு உகந்த முதிர்ச்சி',
      startPct: 92,
      endPct: 100,
      adviceEn: 'Harvest timely when grains or pods reach peak market specifications.',
      adviceTa: 'சரியான ஈரப்பதத்தில் உடனே அறுவடை செய்து விற்பனைக்கு தயார் செய்யவும்.',
    },
  ];

  let currentStageNameEn = stagesDef[0].nameEn;
  let currentStageNameTa = stagesDef[0].nameTa;

  const milestones: HarvestMilestone[] = stagesDef.map((stg, idx) => {
    const stageStartDays = Math.round((stg.startPct / 100) * durationDays);
    const stageEndDays = Math.round((stg.endPct / 100) * durationDays);

    const stageStartDate = new Date(validPDate.getTime() + stageStartDays * msPerDay);
    const stageEndDate = new Date(validPDate.getTime() + stageEndDays * msPerDay);

    const isCompleted = daysElapsed >= stageEndDays;
    const isCurrent = daysElapsed >= stageStartDays && daysElapsed < stageEndDays;
    const isUpcoming = daysElapsed < stageStartDays;

    if (isCurrent) {
      currentStageNameEn = stg.nameEn;
      currentStageNameTa = stg.nameTa;
    }

    const isHarvest = idx === stagesDef.length - 1;

    return {
      stageNumber: idx + 1,
      nameEn: stg.nameEn,
      nameTa: stg.nameTa,
      startDate: stageStartDate.toISOString().split('T')[0],
      endDate: stageEndDate.toISOString().split('T')[0],
      dayRange: `Day ${stageStartDays} - ${stageEndDays}`,
      status: isCompleted ? 'completed' : isCurrent ? 'current' : 'upcoming',
      isHarvest,
      adviceEn: stg.adviceEn,
      adviceTa: stg.adviceTa,
    };
  });

  // Actionable pre-harvest checklist items
  const drainageDate = new Date(hDate.getTime() - 10 * msPerDay);
  const machineryBookingDate = new Date(hDate.getTime() - 14 * msPerDay);
  const mandiRateCheckDate = new Date(hDate.getTime() - 5 * msPerDay);
  const gunnyBagsDate = new Date(hDate.getTime() - 7 * msPerDay);

  const preHarvestActionTips = [
    {
      en: 'Book Combine Harvester / Farm Machinery',
      ta: 'அறுவடை இயந்திரம் / கூலி ஆட்களை முன்கூட்டியே முன்பதிவு செய்தல்',
      daysBefore: 14,
      dateStr: machineryBookingDate.toISOString().split('T')[0],
    },
    {
      en: 'Field Drainage Cutoff (AWD Final Drying)',
      ta: 'வயலில் நீர் பாய்ச்சுவதை முற்றிலுமாக நிறுத்தி நிலத்தை காயவிடுதல்',
      daysBefore: 10,
      dateStr: drainageDate.toISOString().split('T')[0],
    },
    {
      en: 'Procure Gunny Bags & Tarpaulins for Threshing',
      ta: 'சாக்குப்பைகள் & தார்ப்பாய்கள் சேகரித்து உழவர் களம் தயார் செய்தல்',
      daysBefore: 7,
      dateStr: gunnyBagsDate.toISOString().split('T')[0],
    },
    {
      en: 'Check Regulated Mandi / DPC Procurement Rates',
      ta: 'ஒழுங்குமுறை விற்பனைக்கூட கொள்முதல் விலை & ஈரப்பதம் சரிபார்த்தல்',
      daysBefore: 5,
      dateStr: mandiRateCheckDate.toISOString().split('T')[0],
    },
  ];

  return {
    plantingDate: validPDate.toISOString().split('T')[0],
    expectedHarvestDate: hDate.toISOString().split('T')[0],
    harvestWindowStart: windowStart.toISOString().split('T')[0],
    harvestWindowEnd: windowEnd.toISOString().split('T')[0],
    durationDays,
    daysElapsed,
    daysRemaining,
    progressPct: rawProgress,
    isReadyForHarvest,
    isOverdue,
    currentStageNameEn,
    currentStageNameTa,
    milestones,
    preHarvestActionTips,
  };
}
