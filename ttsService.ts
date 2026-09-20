import { Language } from '../types';

class TTSService {
  private synth: SpeechSynthesis | null = null;
  private isSupported: boolean = false;
  private onStateChangeListeners: Array<(speaking: boolean) => void> = [];
  private voices: SpeechSynthesisVoice[] = [];

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
      this.isSupported = true;
      this.loadVoices();
      if (typeof window.speechSynthesis.onvoiceschanged !== 'undefined') {
        window.speechSynthesis.onvoiceschanged = () => {
          this.loadVoices();
        };
      }
    }
  }

  private loadVoices() {
    if (!this.synth) return;
    this.voices = this.synth.getVoices();
  }

  public addListener(listener: (speaking: boolean) => void) {
    this.onStateChangeListeners.push(listener);
    return () => {
      this.onStateChangeListeners = this.onStateChangeListeners.filter(l => l !== listener);
    };
  }

  private notify(speaking: boolean) {
    this.onStateChangeListeners.forEach(fn => fn(speaking));
  }

  public speak(text: string, lang: Language = 'en') {
    if (!this.synth || !this.isSupported) {
      // Graceful simulated speaking pulse for environments without TTS
      this.notify(true);
      setTimeout(() => this.notify(false), 2200);
      return;
    }

    try {
      this.synth.cancel(); // Stop any pending speech

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.92; // Slightly measured rate for maximum vernacular clarity
      utterance.pitch = 1.0;

      const availableVoices = this.voices.length > 0 ? this.voices : this.synth.getVoices();

      if (lang === 'ta') {
        utterance.lang = 'ta-IN';
        const taVoice = availableVoices.find(v => 
          v.lang.toLowerCase().startsWith('ta') || 
          v.name.toLowerCase().includes('tamil') ||
          v.lang.toLowerCase().includes('ta-in')
        );
        if (taVoice) utterance.voice = taVoice;
      } else if (lang === 'hi') {
        utterance.lang = 'hi-IN';
        const hiVoice = availableVoices.find(v => 
          v.lang.toLowerCase().startsWith('hi') || 
          v.name.toLowerCase().includes('hindi') ||
          v.lang.toLowerCase().includes('hi-in')
        );
        if (hiVoice) utterance.voice = hiVoice;
      } else if (lang === 'mr') {
        utterance.lang = 'mr-IN';
        const mrVoice = availableVoices.find(v => 
          v.lang.toLowerCase().startsWith('mr') || 
          v.name.toLowerCase().includes('marathi') ||
          v.lang.toLowerCase().includes('mr-in')
        );
        if (mrVoice) {
          utterance.voice = mrVoice;
        } else {
          // Devanagari phonetics fallback if dedicated Marathi voice pack is missing on device
          const hiVoice = availableVoices.find(v => v.lang.toLowerCase().startsWith('hi'));
          if (hiVoice) utterance.voice = hiVoice;
        }
      } else {
        utterance.lang = 'en-IN';
        const enInVoice = availableVoices.find(v => 
          v.lang.toLowerCase() === 'en-in' || 
          v.name.toLowerCase().includes('india')
        );
        if (enInVoice) utterance.voice = enInVoice;
      }

      utterance.onstart = () => this.notify(true);
      utterance.onend = () => this.notify(false);
      utterance.onerror = () => this.notify(false);

      this.synth.speak(utterance);
    } catch {
      this.notify(true);
      setTimeout(() => this.notify(false), 2000);
    }
  }

  public stop() {
    if (this.synth) {
      this.synth.cancel();
    }
    this.notify(false);
  }
}

export const ttsService = new TTSService();
