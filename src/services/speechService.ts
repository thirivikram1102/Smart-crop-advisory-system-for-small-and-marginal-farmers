/**
 * Web Speech API Abstraction Layer for Tamil & English Voice Assistant
 * Designed for small and marginal farmers with natural Tamil & English
 * speech recognition, auto language detection, and text-to-speech synthesis.
 */

// Browser SpeechRecognition type definition
type SpeechRecognitionType = any;

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
  detectedLang?: 'ta' | 'en';
}

/**
 * Intelligent language detection helper.
 * Detects whether the input is Tamil (Unicode script or common Tamil/Tanglish agrarian terms)
 * or English.
 */
export function detectLanguage(text: string): 'ta' | 'en' {
  if (!text || !text.trim()) return 'ta';

  // 1. Check for Tamil Unicode characters (\u0B80-\u0BFF)
  if (/[\u0B80-\u0BFF]/.test(text)) {
    return 'ta';
  }

  // 2. Check for common Tanglish / Tamil phonetic agricultural terms
  const lower = text.toLowerCase();
  const tanglishKeywords = [
    'vanakkam', 'ulavan', 'uzhavan', 'vivasayi', 'vivasayam', 'nel', 'nellu',
    'payir', 'poochi', 'ilai', 'karukal', 'thanni', 'thannir', 'pasanam',
    'uravalam', 'uravan', 'kaviri', 'thanjavur', 'samba', 'kuruvai',
    'manila', 'urundai', 'uzhavar', 'thotam', 'eppadi', 'ennathu',
    'vilai', 'mandi', 'sandhai', 'marunthu', 'eruvam', 'puzhu', 'veppam',
    'nalla', 'vilayuma', 'epo', 'paaikalam', 'kelvi', 'solunga', 'potash'
  ];

  const words = lower.split(/[\s,?.!;:—]+/).filter(Boolean);
  for (const w of words) {
    if (tanglishKeywords.includes(w)) {
      return 'ta';
    }
  }

  // Default to English if predominantly Latin alphabet without Tanglish terms
  return 'en';
}

export class SpeechService {
  private recognition: SpeechRecognitionType | null = null;
  private isListening = false;
  private synth: SpeechSynthesis | null = null;
  private cachedVoices: SpeechSynthesisVoice[] = [];
  private currentLanguageMode: 'auto' | 'ta' | 'en' = 'auto';

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition =
        (window as any).SpeechRecognition ||
        (window as any).webkitSpeechRecognition ||
        (window as any).mozSpeechRecognition ||
        (window as any).msSpeechRecognition;

      if (SpeechRecognition) {
        try {
          this.recognition = new SpeechRecognition();
          this.recognition.continuous = false;
          this.recognition.interimResults = true;
          this.recognition.maxAlternatives = 1;
        } catch (e) {
          console.warn('SpeechRecognition initialization error:', e);
        }
      }

      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
        this.loadVoices();
        if (this.synth.onvoiceschanged !== undefined) {
          this.synth.onvoiceschanged = () => {
            this.loadVoices();
          };
        }
      }
    }
  }

  private loadVoices(): void {
    if (!this.synth) return;
    try {
      this.cachedVoices = this.synth.getVoices();
    } catch (e) {
      console.warn('Error fetching voices:', e);
    }
  }

  public isRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  public isSynthesisSupported(): boolean {
    return !!this.synth;
  }

  public getAvailableVoices(): SpeechSynthesisVoice[] {
    if (this.cachedVoices.length === 0 && this.synth) {
      this.loadVoices();
    }
    return this.cachedVoices;
  }

  /**
   * Start listening for voice input.
   * If langMode is 'auto', it initiates in Tamil ('ta-IN') as priority for Tamil Nadu farmers,
   * while detecting if the transcript comes back in English or Tamil.
   */
  public startListening(
    langMode: 'auto' | 'ta' | 'en',
    onResult: (result: SpeechRecognitionResultState) => void,
    onError: (err: string) => void,
    onEnd: () => void
  ): boolean {
    if (!this.recognition) {
      onError('Speech recognition is not supported in this browser. Please type your message.');
      return false;
    }

    if (this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListening = false;
    }

    this.currentLanguageMode = langMode;
    // Set speech recognition language
    const recognitionLang = langMode === 'en' ? 'en-IN' : 'ta-IN';
    this.recognition.lang = recognitionLang;

    this.recognition.onstart = () => {
      this.isListening = true;
    };

    this.recognition.onresult = (event: any) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript;
        } else {
          interimTranscript += event.results[i][0].transcript;
        }
      }

      const activeText = finalTranscript || interimTranscript;
      const detected = detectLanguage(activeText);

      onResult({
        transcript: activeText,
        isFinal: !!finalTranscript,
        detectedLang: detected,
      });
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition event error:', event.error);
      this.isListening = false;
      let msg = 'Voice recognition error. Please type your question.';
      if (event.error === 'not-allowed' || event.error === 'service-not-allowed') {
        msg = 'Microphone permission was denied. Please enable microphone access in browser settings.';
      } else if (event.error === 'no-speech') {
        msg = 'No voice detected. Please speak closer to the microphone.';
      } else if (event.error === 'network') {
        msg = 'Speech recognition network timeout. Please check internet connection or type below.';
      } else if (event.error === 'aborted') {
        return; // Normal cancel
      }
      onError(msg);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      onEnd();
    };

    try {
      this.recognition.start();
      return true;
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      this.isListening = false;
      onError('Unable to start voice input. Please try again or type.');
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        // Ignore
      }
      this.isListening = false;
    }
  }

  /**
   * Speak text in either Tamil or English with proper voice selection.
   */
  public speak(
    text: string,
    requestedLang?: 'auto' | 'ta' | 'en',
    onComplete?: () => void
  ): void {
    if (!this.synth) {
      if (onComplete) onComplete();
      return;
    }

    this.stopSpeaking();

    // Determine target spoken language
    const lang =
      !requestedLang || requestedLang === 'auto'
        ? detectLanguage(text)
        : requestedLang;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = lang === 'ta' ? 0.9 : 0.95; // Gentle pace for rural farmer clarity
    utterance.pitch = 1.0;

    const voices = this.getAvailableVoices();

    if (lang === 'ta') {
      // Find best Tamil voice: Chrome/Android "Google தமிழ்", Edge "Microsoft Valluvar", etc.
      const tamilVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().replace('_', '-').includes('ta-in') ||
          v.lang.toLowerCase().startsWith('ta') ||
          v.name.toLowerCase().includes('tamil') ||
          v.name.toLowerCase().includes('valluvar')
      );
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
    } else {
      // Find best English voice: en-IN (Indian English) preferred for South Indian farmers
      const enInVoice = voices.find(
        (v) =>
          v.lang.toLowerCase().replace('_', '-').includes('en-in') ||
          v.name.toLowerCase().includes('india')
      );
      const generalEnVoice = voices.find((v) => v.lang.toLowerCase().startsWith('en'));
      if (enInVoice) {
        utterance.voice = enInVoice;
      } else if (generalEnVoice) {
        utterance.voice = generalEnVoice;
      }
    }

    utterance.onend = () => {
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn('TTS playback notice:', e);
      if (onComplete) onComplete();
    };

    try {
      this.synth.speak(utterance);
    } catch (e) {
      console.warn('Synth speak error:', e);
      if (onComplete) onComplete();
    }
  }

  public stopSpeaking(): void {
    if (this.synth) {
      try {
        this.synth.cancel();
      } catch (e) {
        // Ignore
      }
    }
  }
}

export const speechService = new SpeechService();
