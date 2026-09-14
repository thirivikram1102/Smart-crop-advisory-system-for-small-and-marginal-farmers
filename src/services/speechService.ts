/**
 * Web Speech API Abstraction Layer for Tamil & English Voice Assistant
 * Designed for low-literacy farmers with Tamil voice recognition and synthesis.
 */

// Browser SpeechRecognition type definition
type SpeechRecognitionType = any;

export interface SpeechRecognitionResultState {
  transcript: string;
  isFinal: boolean;
}

export class SpeechService {
  private recognition: SpeechRecognitionType | null = null;
  private isListening = false;
  private synth: SpeechSynthesis | null = null;

  constructor() {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        this.recognition = new SpeechRecognition();
        this.recognition.continuous = false;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 1;
      }
      if ('speechSynthesis' in window) {
        this.synth = window.speechSynthesis;
      }
    }
  }

  public isRecognitionSupported(): boolean {
    return !!this.recognition;
  }

  public isSynthesisSupported(): boolean {
    return !!this.synth;
  }

  public startListening(
    lang: 'ta' | 'en',
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
    }

    this.recognition.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';

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

      onResult({
        transcript: finalTranscript || interimTranscript,
        isFinal: !!finalTranscript,
      });
    };

    this.recognition.onerror = (event: any) => {
      console.warn('Speech recognition error:', event.error);
      this.isListening = false;
      let msg = 'Voice recognition error. Please type your question.';
      if (event.error === 'not-allowed') {
        msg = 'Microphone access was denied. Please allow microphone permissions.';
      } else if (event.error === 'no-speech') {
        msg = 'No speech detected. Please speak closer to the microphone.';
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

  public speak(text: string, lang: 'ta' | 'en', onComplete?: () => void): void {
    if (!this.synth) return;

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang === 'ta' ? 'ta-IN' : 'en-IN';
    utterance.rate = lang === 'ta' ? 0.9 : 0.95; // Slightly relaxed pace for rural clarity
    utterance.pitch = 1.0;

    // Look for Tamil voice if available in system
    const voices = this.synth.getVoices();
    if (lang === 'ta') {
      const tamilVoice = voices.find((v) => v.lang.includes('ta') || v.name.toLowerCase().includes('tamil'));
      if (tamilVoice) {
        utterance.voice = tamilVoice;
      }
    }

    utterance.onend = () => {
      if (onComplete) onComplete();
    };

    utterance.onerror = (e) => {
      console.warn('TTS playback error:', e);
      if (onComplete) onComplete();
    };

    this.synth.speak(utterance);
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

export const speechService = new SpeechService();
