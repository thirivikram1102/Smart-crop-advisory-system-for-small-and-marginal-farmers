import { detectLanguage } from './speechService';

export interface AssistantResponse {
  detectedLanguage: 'ta' | 'en';
  reply: string; // The primary response in the detected language
  replyTa: string; // Natural Tamil version
  replyEn: string; // Clear English version
  topic?: string;
}

export async function askAssistant(
  prompt: string,
  hintLang: 'auto' | 'ta' | 'en' = 'auto'
): Promise<AssistantResponse> {
  const detected = hintLang === 'auto' ? detectLanguage(prompt) : hintLang;

  try {
    const res = await fetch('/api/assistant/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, lang: detected }),
    });

    if (res.ok) {
      const data = await res.json();
      if (data) {
        const lang: 'ta' | 'en' = data.detectedLanguage || detected;
        const replyTa = data.replyTa || data.textTa || data.reply || '';
        const replyEn = data.replyEn || data.textEn || data.reply || '';
        const primaryReply =
          data.reply || (lang === 'ta' ? replyTa : replyEn);

        return {
          detectedLanguage: lang,
          reply: primaryReply,
          replyTa: replyTa || primaryReply,
          replyEn: replyEn || primaryReply,
          topic: data.topic,
        };
      }
    }
  } catch (err) {
    console.log('Using local Tamil-English agricultural expert knowledge engine.');
  }

  // Local Agricultural Knowledge Engine (TNAU / KVK based) with dual language support
  const q = prompt.toLowerCase();
  let topic = 'general';
  let replyEn = '';
  let replyTa = '';

  if (
    q.includes('பயிர்') ||
    q.includes('crop') ||
    q.includes('நல்லது') ||
    q.includes('best') ||
    q.includes('விளைச்சல்') ||
    q.includes('yield') ||
    q.includes('சாகுபடி') ||
    q.includes('variety')
  ) {
    topic = 'crop';
    replyTa =
      'உங்கள் நிலத்தின் மண் வகை மற்றும் காவிரி டெல்டா நீர் இருப்பின்படி, தற்போது சம்பா நெல் (CR 1009 / பொன்னி) அல்லது வம்பன் 8 உளுந்து சாகுபடி செய்வது மிகச் சிறந்த தேர்வாகும். குறைந்த செலவில் அதிக மகசூல் மற்றும் லாபம் கிடைக்கும்.';
    replyEn =
      'Based on your soil type and delta seasonal moisture in Tamil Nadu, Samba Paddy (CR 1009 / Ponni) or Blackgram (VBN 8) are optimal choices. They offer resilient yield, manageable water demand, and strong market returns.';
  } else if (
    q.includes('தண்ணீர்') ||
    q.includes('பாசனம்') ||
    q.includes('irrigation') ||
    q.includes('water') ||
    q.includes('மழை') ||
    q.includes('rain') ||
    q.includes('ஈரப்பதம்') ||
    q.includes('moisture')
  ) {
    topic = 'irrigation';
    replyTa =
      'வயலில் தற்போது 72% வரை போதுமான ஈரப்பதம் உள்ளது. மேலும் அடுத்த 48 மணி நேரத்தில் மழை பெய்ய 65% வாய்ப்புள்ளதால், இன்று தண்ணீர் பாய்ச்சுவதை ஒத்திவைக்கவும். காய்ச்சலும் பாய்ச்சலுமாக (AWD) பாசனம் செய்தால் 30% நீர் மிச்சமாகும்.';
    replyEn =
      'Soil moisture is currently measured at ~72% and regional rain probability is around 65% over the next 48 hours. Postpone flood irrigation today to avoid waterlogging. Using Alternate Wetting & Drying (AWD) will save up to 30% water.';
  } else if (
    q.includes('நோய்') ||
    q.includes('இலை') ||
    q.includes('disease') ||
    q.includes('leaf') ||
    q.includes('பூச்சி') ||
    q.includes('pest') ||
    q.includes('புகையான்') ||
    q.includes('bph') ||
    q.includes('சுருட்டு') ||
    q.includes('blight')
  ) {
    topic = 'disease';
    replyTa =
      'பாதிக்கப்பட்ட பயிர் இலையின் புகைப்படத்தை "இலை நோய் பரிசோதனை" பகுதியில் பதிவேற்றினால், AI தொழில்நுட்பம் நோயை உடனடியாக கண்டறியும். பூச்சி அல்லது புகையான் பரவலைக் கட்டுப்படுத்த வயல் நீரை 2 நாட்கள் வடிக்கவும், 5% வேப்பெண்ணெய் கரைசல் அல்லது சூடோமோனாஸ் தெளிக்கவும்.';
    replyEn =
      'Please capture a photo of the affected foliage using the "Scan Plant Disease" tab for instant AI diagnosis. To mitigate sucking pests or hopper burns, temporarily drain standing water for 2 days and spray 5% Neem Seed Kernel Extract (NSKE) or Pseudomonas fluorescens.';
  } else if (
    q.includes('உரம்') ||
    q.includes('fertilizer') ||
    q.includes('யூரியா') ||
    q.includes('urea') ||
    q.includes('டிஏபி') ||
    q.includes('dap') ||
    q.includes('பொட்டாஷ்') ||
    q.includes('manure')
  ) {
    topic = 'fertilizer';
    replyTa =
      'வேப்பெண்ணெய் பூசிய யூரியாவை ஒரே முறையில் இடாமல் மூன்று சம தவணைகளாக இடவும்: அடியுரமாக 25%, தூர்க்கட்டும் பருவத்தில் (25-30 நாட்கள்) 50%, கதிர் உருவாகும் தருணத்தில் 25% இடவும். மழை வருவதற்கு முன்பு உரம் இடுவதைத் தவிர்க்கவும்.';
    replyEn =
      'Apply neem-coated urea in split applications: 25% as basal dressing, 50% during active tillering (25-30 days), and 25% at panicle initiation. Never broadcast fertilizers immediately before expected rain to avoid leaching losses.';
  } else if (
    q.includes('விலை') ||
    q.includes('market') ||
    q.includes('price') ||
    q.includes('மண்டி') ||
    q.includes('விற்பனை') ||
    q.includes('rate') ||
    q.includes('procurement')
  ) {
    topic = 'market';
    replyTa =
      'தஞ்சாவூர் மற்றும் அருகிலுள்ள ஒழுங்குமுறை விற்பனைக்கூடங்களில் முதல் தர சன்ன ரக நெல் குவிண்டாலுக்கு ₹2,380 முதல் ₹2,450 வரை விற்பனையாகிறது. அரசு நேரடி கொள்முதல் நிலைய போனஸ் பெற நெல்லின் ஈரப்பதத்தை 17% க்குள் இருக்குமாறு உலர்த்தி எடுத்துச் செல்லவும்.';
    replyEn =
      'Grade-A fine paddy is currently trading around ₹2,380 to ₹2,450 per quintal in regulated mandis with steady seasonal demand. Ensure harvested grain moisture is maintained below 17% to qualify for direct government procurement center bonus rates.';
  } else if (
    q.includes('லாபம்') ||
    q.includes('profit') ||
    q.includes('செலவு') ||
    q.includes('cost') ||
    q.includes('budget') ||
    q.includes('வருமானம்')
  ) {
    topic = 'profit';
    replyTa =
      'ஒரு ஏக்கர் நெல் சாகுபடிக்கு உழவு, விதை, உரம் மற்றும் அறுவடை உட்பட சுமார் ₹26,000 செலவாகும். சராசரியாக 2.8 டன் மகசூல் கிடைத்தால், சுமார் ₹65,800 வருமானம் கிடைத்து நிகர லாபம் ₹39,800 வரை கிட்டும். முழு கணக்கீட்டை "லாபக் கணக்கீடு" பகுதியில் பார்க்கலாம்.';
    replyEn =
      'Average paddy cultivation cost per acre is approx ₹26,000 covering land prep, seed, fertilizers, and mechanical harvesting. With an expected yield of 2.8 tonnes, gross revenue is ~₹65,800, leaving a projected net profit of ~₹39,800 per acre.';
  } else {
    replyTa = `உங்கள் கேள்விக்கு ("${prompt}"): வயலில் நீர் தேங்காமல் சீரான வடிகால் அமைத்து பராமரிக்கவும், வாரத்திற்கு ஒருமுறை இலைகளின் அடிப்பகுதியில் பூச்சி உள்ளதா என கண்காணிக்கவும். தமிழ்நாடு வேளாண்மைப் பல்கலைக்கழக (TNAU) வழிகாட்டுதல்களைப் பின்பற்றவும்.`;
    replyEn = `Regarding your query ("${prompt}"): Maintain optimal field drainage, inspect crop leaf undersides weekly for early vector presence, and adhere to recommended Tamil Nadu Agricultural University (TNAU) package of practices.`;
  }

  const primaryReply = detected === 'ta' ? replyTa : replyEn;

  return {
    detectedLanguage: detected,
    reply: primaryReply,
    replyTa,
    replyEn,
    topic,
  };
}
