import React, { useState, useEffect } from 'react';
import { Mic, X, Check, Sparkles, AlertCircle } from 'lucide-react';
import { MaterialCategory } from '../types';
import { parseVoiceCommand } from '../services/aiService';
import { useApp } from '../context/AppContext';

interface VoiceAssistantModalProps {
  isOpen: boolean;
  onClose: () => void;
  onResult: (parsed: { material?: MaterialCategory; weight?: number }) => void;
}

export const VoiceAssistantModal: React.FC<VoiceAssistantModalProps> = ({
  isOpen,
  onClose,
  onResult,
}) => {
  const { language, speakText } = useApp();
  const [isListening, setIsListening] = useState(false);
  const [spokenText, setSpokenText] = useState('');
  const [parsed, setParsed] = useState<{ material?: MaterialCategory; weight?: number; raw: string } | null>(null);

  // Pre-configured vernacular sample phrases for fast demo & speech simulation
  const samplePrompts = [
    {
      lang: 'en',
      display: 'I have 12 kilos of electronic waste',
      sub: 'English: 12 kg E-waste',
    },
    {
      lang: 'ta',
      display: 'என்னிடம் 12 கிலோ மின்னணுக் கழிவு உள்ளது',
      sub: 'Tamil: 12 kg E-waste',
    },
    {
      lang: 'hi',
      display: 'मेरे पास 12 किलो ई-कचरा है',
      sub: 'Hindi: 12 kg E-waste',
    },
    {
      lang: 'mr',
      display: 'माझ्याकडे 15 किलो प्लास्टिक बाटल्या आहेत',
      sub: 'Marathi: 15 kg Plastic bottles',
    },
    {
      lang: 'en',
      display: 'I have 20 kilos of copper metal scrap',
      sub: 'English: 20 kg Metal',
    },
  ];

  useEffect(() => {
    if (!isOpen) {
      setIsListening(false);
      setSpokenText('');
      setParsed(null);
    }
  }, [isOpen]);

  const handleStartListening = () => {
    setIsListening(true);
    setSpokenText('');
    setParsed(null);

    // Pick prompt matching collector language
    const sample = samplePrompts.find(p => p.lang === language) || samplePrompts[0];

    // Check if browser has native Web Speech API SpeechRecognition
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.lang = language === 'ta' ? 'ta-IN' : language === 'hi' ? 'hi-IN' : language === 'mr' ? 'mr-IN' : 'en-IN';
        recognition.continuous = false;
        recognition.interimResults = false;

        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setSpokenText(`"${transcript}"`);
          const result = parseVoiceCommand(transcript);
          setParsed(result);
          setIsListening(false);
        };

        recognition.onerror = () => {
          // Fallback to simulated vernacular prompt if microphone access is denied or unavailable in sandbox
          simulateFallbackSpeech(sample.display);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognition.start();
        return;
      } catch {
        // Fallback below
      }
    }

    // Default simulation fallback
    simulateFallbackSpeech(sample.display);
  };

  const simulateFallbackSpeech = (phrase: string) => {
    setTimeout(() => {
      setSpokenText(`"${phrase}"`);
      const result = parseVoiceCommand(phrase);
      setParsed(result);
      setIsListening(false);
    }, 1400);
  };

  const handleSelectSample = (phrase: string) => {
    setIsListening(false);
    setSpokenText(`"${phrase}"`);
    const result = parseVoiceCommand(phrase);
    setParsed(result);
    speakText(`Recognized ${result.weight || ''} kg of ${result.material || ''}`);
  };

  const handleConfirm = () => {
    if (parsed) {
      onResult({
        material: parsed.material,
        weight: parsed.weight,
      });
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-emerald-800 text-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-700 flex items-center justify-center">
              <Mic className="w-5 h-5 text-emerald-100" />
            </div>
            <div>
              <h3 className="font-extrabold text-base leading-tight">Voice Assistant (आवाज सहायक)</h3>
              <p className="text-xs text-emerald-200">Speak material & weight in any language</p>
            </div>
          </div>
          <button 
            type="button"
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-emerald-700/60 transition-colors"
          >
            <X className="w-5 h-5 text-white" />
          </button>
        </div>

        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Main Microphone Button */}
          <div className="flex flex-col items-center justify-center py-4">
            <button
              type="button"
              onClick={handleStartListening}
              className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg transition-all active:scale-95 ${
                isListening 
                  ? 'bg-amber-500 text-white animate-pulse ring-8 ring-amber-200' 
                  : 'bg-emerald-700 hover:bg-emerald-800 text-white ring-8 ring-emerald-100'
              }`}
            >
              <Mic className="w-10 h-10" />
            </button>
            <p className="mt-3 text-sm font-bold text-slate-800">
              {isListening ? 'Listening... Speak now' : 'Tap to Speak (बोलने के लिए दबाएं)'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
              Supports Hindi, Marathi & English speech
            </p>
          </div>

          {/* Spoken Text Display */}
          {spokenText && (
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 text-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Detected Voice Transcript
              </span>
              <p className="text-slate-800 font-semibold text-base italic">{spokenText}</p>
            </div>
          )}

          {/* Parsed Output Card */}
          {parsed && (
            <div className="p-4 bg-emerald-50 rounded-2xl border-2 border-emerald-300 space-y-3">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 bg-emerald-200/70 px-2.5 py-1 rounded-md">
                  <Sparkles className="w-3.5 h-3.5" /> Structured Data Parsed
                </span>
                <span className="text-xs text-emerald-700 font-semibold">Requires Your Confirmation</span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-xs text-slate-500 font-medium block">Material</span>
                  <span className="text-base font-extrabold text-emerald-950">
                    {parsed.material || 'Unspecified'}
                  </span>
                </div>
                <div className="bg-white p-3 rounded-xl border border-emerald-200">
                  <span className="text-xs text-slate-500 font-medium block">Weight</span>
                  <span className="text-base font-extrabold text-emerald-950">
                    {parsed.weight ? `${parsed.weight} kg` : 'Manual entry'}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleConfirm}
                className="w-full py-3 px-4 bg-emerald-700 hover:bg-emerald-800 text-white font-extrabold rounded-xl shadow-md flex items-center justify-center gap-2 text-sm active:scale-98 transition-transform"
              >
                <Check className="w-4 h-4" />
                CONFIRM & PROCEED TO VALUATION
              </button>
            </div>
          )}

          {/* Quick Voice Demo Presets */}
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block mb-2">
              Or tap a sample vernacular phrase:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {samplePrompts.map((p, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectSample(p.display)}
                  className="text-left p-3 rounded-xl border border-slate-200 hover:border-emerald-400 bg-slate-50 hover:bg-emerald-50/50 transition-colors"
                >
                  <p className="text-xs font-bold text-slate-800 leading-snug">{p.display}</p>
                  <span className="text-[11px] text-slate-500 font-medium">{p.sub}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
