import React from 'react';
import { Check, ArrowRight, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

export const LanguageScreen: React.FC = () => {
  const { language, setLanguage, updateCollector, setActiveScreen, speakText } = useApp();

  const languages: { code: Language; name: string; local: string; greeting: string; audioPhrase: string }[] = [
    {
      code: 'en',
      name: 'English',
      local: 'English',
      greeting: 'Welcome to Kabadiwala Connect.',
      audioPhrase: 'English language selected.',
    },
    {
      code: 'ta',
      name: 'Tamil',
      local: 'தமிழ்',
      greeting: 'வணக்கம்! கபடிவாலா கனெக்ட்டிற்கு உங்களை வரவேற்கிறோம்.',
      audioPhrase: 'தமிழ் மொழி தேர்ந்தெடுக்கப்பட்டது.',
    },
    {
      code: 'hi',
      name: 'Hindi',
      local: 'हिन्दी',
      greeting: 'नमस्ते! कबाड़ीवाला कनेक्ट में आपका स्वागत है।',
      audioPhrase: 'हिन्दी भाषा चुनी गई।',
    },
    {
      code: 'mr',
      name: 'Marathi',
      local: 'मराठी',
      greeting: 'नमस्कार! कबाडीवाला कनेक्टमध्ये आपले स्वागत आहे.',
      audioPhrase: 'मराठी भाषा निवडली आहे.',
    },
  ];

  const handleSelect = (code: Language, audioPhrase: string) => {
    setLanguage(code);
    updateCollector({ language: code });
    speakText(audioPhrase);
  };

  const handleProceed = () => {
    setActiveScreen('LOGIN');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-50 text-slate-900 min-h-[600px]">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-800">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-extrabold text-slate-900">Choose Language</h2>
              <p className="text-xs text-slate-500">English / தமிழ் / हिन्दी / मराठी</p>
            </div>
          </div>

          <AudioReadoutButton
            text={audioScripts.languageSelect}
            label="Listen"
          />
        </div>

        {/* Informative Note */}
        <p className="text-xs text-slate-600 bg-white p-3.5 rounded-2xl border border-slate-200">
          Vernacular audio guidance, AI scrap grading, and digital receipts available in your language.
        </p>

        {/* Language Cards */}
        <div className="space-y-3 pt-2">
          {languages.map((l) => {
            const isSelected = language === l.code;
            return (
              <button
                key={l.code}
                type="button"
                onClick={() => handleSelect(l.code, l.audioPhrase)}
                className={`w-full p-4 rounded-2xl border-2 transition-all flex items-center justify-between text-left active:scale-98 ${
                  isSelected 
                    ? 'border-emerald-700 bg-emerald-50/80 shadow-md ring-2 ring-emerald-600/20' 
                    : 'border-slate-200 bg-white hover:border-slate-300'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-black text-slate-900">{l.local}</span>
                    <span className="text-xs font-bold text-slate-400">({l.name})</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">{l.greeting}</p>
                </div>

                <div className="flex items-center gap-2">
                  {isSelected ? (
                    <div className="w-7 h-7 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-xs">
                      <Check className="w-4 h-4" />
                    </div>
                  ) : (
                    <div className="w-7 h-7 rounded-full border-2 border-slate-300" />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Bottom Button */}
      <div className="pt-6 space-y-2">
        <button
          type="button"
          onClick={handleProceed}
          className="w-full py-4 px-6 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 text-base active:scale-98 transition-all"
        >
          <span>Continue</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>

        <p className="text-center text-[11px] text-slate-400 font-medium">
          You can change this anytime from Profile Settings
        </p>
      </div>
    </div>
  );
};
