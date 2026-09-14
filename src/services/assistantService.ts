import { AssistantMessage } from '../types';

export async function askAssistant(
  prompt: string,
  lang: 'ta' | 'en' = 'ta'
): Promise<{ textEn: string; textTa: string }> {
  try {
    const res = await fetch('/api/assistant/query', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, lang }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data && (data.textTa || data.textEn)) {
        return {
          textEn: data.textEn || data.reply,
          textTa: data.textTa || data.replyTa || data.reply,
        };
      }
    }
  } catch (err) {
    console.warn('Backend assistant API unreachable, using local Tamil agricultural knowledge engine:', err);
  }

  // Knowledge base matcher
  const q = prompt.toLowerCase();

  if (q.includes('பயிர்') || q.includes('crop') || q.includes('நல்லது') || q.includes('best')) {
    return {
      textEn: 'Based on your soil and seasonal moisture in Thanjavur, Samba Paddy (CR 1009 / ADT 43) or Blackgram (VBN 8) are optimal choices with strong returns.',
      textTa: 'உங்கள் நிலத்தின் மண் வகை மற்றும் காவிரி டெல்டா நீர் இருப்பின்படி, தற்போது சம்பா நெல் (CR 1009 / பொன்னி) அல்லது உளுந்து (வம்பன் 8) சாகுபடி செய்வது அதிக லாபம் தரும்.',
    };
  }

  if (q.includes('தண்ணீர்') || q.includes('பாசனம்') || q.includes('irrigation') || q.includes('water')) {
    return {
      textEn: 'Soil moisture is estimated at 72% and rain is forecast within 48 hours. Postpone flood irrigation today to avoid waterlogging and root asphyxiation.',
      textTa: 'வயலில் தற்போது 72% வரை போதுமான ஈரப்பதம் உள்ளது. மேலும் அடுத்த 48 மணி நேரத்தில் மழை பெய்ய வாய்ப்புள்ளதால், இன்று தண்ணீர் பாய்ச்சுவதை ஒத்திவைக்கவும்.',
    };
  }

  if (q.includes('நோய்') || q.includes('இலை') || q.includes('disease') || q.includes('leaf') || q.includes('பூச்சி')) {
    return {
      textEn: 'Please capture a clear photo of the affected leaf in the "Scan Plant Disease" tab. Our AI will diagnose the exact pathogen and recommend safe bio-treatments.',
      textTa: 'பாதிக்கப்பட்ட பயிர் இலையின் தெளிவான புகைப்படத்தை "இலை நோய் பரிசோதனை" பகுதியில் பதிவேற்றுங்கள். நான் உடனடியாக பரிசோதித்து தகுந்த மருந்து பரிந்துரை செய்கிறேன்.',
    };
  }

  if (q.includes('உரம்') || q.includes('fertilizer') || q.includes('யூரியா')) {
    return {
      textEn: 'Apply neem-coated urea in 3 split doses: 25% basal, 50% at tillering (25-30 days), and 25% at panicle initiation. Always check weather before broadcasting.',
      textTa: 'வேப்பெண்ணெய் பூசிய யூரியாவை மூன்று தவணைகளாக இடவும்: அடியுரமாக 25%, தூர்க்கட்டும் பருவத்தில் (25-30 நாள்) 50%, கதிர் உருவாகும் போது 25% இடவும். மழை வருவதற்கு முன் இடாதீர்கள்.',
    };
  }

  if (q.includes('விலை') || q.includes('market') || q.includes('price') || q.includes('மண்டி')) {
    return {
      textEn: 'Paddy Grade A is trading at ₹2,380/quintal at Thanjavur Regulated Market today with positive demand. Check the Market Prices tab for 7-day price curves.',
      textTa: 'தஞ்சாவூர் ஒழுங்குமுறை விற்பனைக்கூடத்தில் இன்று சன்ன ரக நெல் குவிண்டாலுக்கு ₹2,380 ஆக விற்பனையாகிறது. விலை உயரும் போக்கில் உள்ளது.',
    };
  }

  return {
    textEn: `Regarding "${prompt}": For optimal farm decisions, maintain adequate soil aeration, inspect leaves weekly for pest vectors, and follow Tamil Nadu Agricultural University (TNAU) package of practices.`,
    textTa: `உங்கள் கேள்வி குறித்து: வயலில் நீர் தேங்காமல் பார்த்துக் கொள்ளவும், வாரத்திற்கு ஒருமுறை பூச்சி தாக்குதலை கண்காணிக்கவும். தேவையான வழிகாட்டல்களை எங்கள் பயிர் மேலாண்மை பக்கத்தில் காணலாம்.`,
  };
}
