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
  private currentAudioElement: HTMLAudioElement | null = null;
  private isAudioPlaying = false;
  private memoryAudioCache = new Map<string, { audioBase64: string; mimeType: string }>();

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
    return !!this.synth || typeof Audio !== 'undefined';
  }

  public isSpeaking(): boolean {
    return this.isAudioPlaying || (!!this.synth && this.synth.speaking);
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
   * Play base64 audio directly via HTML5 Audio element
   */
  public playAudioData(
    audioBase64: string,
    mimeType = 'audio/wav',
    onComplete?: () => void
  ): boolean {
    this.stopSpeaking();

    try {
      const audioUrl = `data:${mimeType};base64,${audioBase64}`;
      const audio = new Audio(audioUrl);
      this.currentAudioElement = audio;
      this.isAudioPlaying = true;

      audio.onended = () => {
        this.isAudioPlaying = false;
        this.currentAudioElement = null;
        if (onComplete) onComplete();
      };

      audio.onerror = (e) => {
        console.warn('Audio playback notice:', e);
        this.isAudioPlaying = false;
        this.currentAudioElement = null;
        if (onComplete) onComplete();
      };

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch((err) => {
          console.warn('Audio play notice (user interaction required):', err);
          this.isAudioPlaying = false;
          this.currentAudioElement = null;
          if (onComplete) onComplete();
        });
      }
      return true;
    } catch (err) {
      console.warn('Failed to initialize Audio element:', err);
      this.isAudioPlaying = false;
      this.currentAudioElement = null;
      if (onComplete) onComplete();
      return false;
    }
  }

  /**
   * Speak text in natural Tamil or English.
   * If direct audio base64 is provided or Tamil is requested, uses high-fidelity Tamil TTS audio.
   * Falls back smoothly to browser Web Speech API synthesis if needed.
   */
  public async speak(
    text: string,
    requestedLang?: 'auto' | 'ta' | 'en',
    onComplete?: () => void,
    directAudioBase64?: string,
    mimeType = 'audio/wav'
  ): Promise<void> {
    if (!text || !text.trim()) {
      if (onComplete) onComplete();
      return;
    }

    this.stopSpeaking();

    // 1. If direct pre-generated audio is supplied, play it immediately!
    if (directAudioBase64) {
      this.playAudioData(directAudioBase64, mimeType, onComplete);
      return;
    }

    // Determine target spoken language
    const lang =
      !requestedLang || requestedLang === 'auto'
        ? detectLanguage(text)
        : requestedLang;

    // 2. For Tamil language: request high-quality spoken Tamil audio via /api/tts
    if (lang === 'ta') {
      const cleanKey = text.trim();
      const cached = this.memoryAudioCache.get(cleanKey);
      if (cached) {
        this.playAudioData(cached.audioBase64, cached.mimeType, onComplete);
        return;
      }

      try {
        const response = await fetch('/api/tts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, lang: 'ta' }),
        });

        if (response.ok) {
          const data = await response.json();
          if (data && data.success && data.audioBase64) {
            this.memoryAudioCache.set(cleanKey, {
              audioBase64: data.audioBase64,
              mimeType: data.mimeType || 'audio/wav',
            });
            this.playAudioData(data.audioBase64, data.mimeType || 'audio/wav', onComplete);
            return;
          }
        }
      } catch (e) {
        console.warn('Server TTS fetch notice, using browser speech synthesis:', e);
      }
    }

    // 3. Fallback: Browser Web Speech API SpeechSynthesis
    if (!this.synth) {
      if (onComplete) onComplete();
      return;
    }

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
    if (this.currentAudioElement) {
      try {
        this.currentAudioElement.pause();
        this.currentAudioElement.currentTime = 0;
        this.currentAudioElement = null;
      } catch (e) {
        // Ignore
      }
    }
    this.isAudioPlaying = false;

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
