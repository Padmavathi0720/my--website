import React from 'react';
import { Volume2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { t } from '../i18n/translations';
import { LocalizedAudioText } from '../i18n/audioScripts';

interface AudioReadoutButtonProps {
  text?: string | LocalizedAudioText;
  textMap?: LocalizedAudioText;
  label?: string;
  compact?: boolean;
  className?: string;
}

export const AudioReadoutButton: React.FC<AudioReadoutButtonProps> = ({ 
  text, 
  textMap,
  label, 
  compact = false,
  className = ''
}) => {
  const { speakText, isSpeaking, language } = useApp();

  // Resolve the spoken text based on current user language
  const resolvedText: string = (() => {
    if (textMap && textMap[language]) {
      return textMap[language];
    }
    if (typeof text === 'object' && text !== null) {
      return text[language] || text.en || '';
    }
    if (typeof text === 'string') {
      return text;
    }
    return '';
  })();

  // Resolve localized label
  const resolvedLabel: string | undefined = (() => {
    if (label === undefined) {
      return undefined;
    }
    // If the label is "Listen" or default, use the translated string
    if (label.toLowerCase() === 'listen') {
      return t('listen', language);
    }
    return label;
  })();

  const handleSpeak = () => {
    if (!resolvedText) return;
    speakText(resolvedText, language);
  };

  return (
    <button
      type="button"
      onClick={handleSpeak}
      className={`inline-flex items-center gap-1.5 rounded-full font-bold transition-all select-none active:scale-95 ${
        isSpeaking 
          ? 'bg-emerald-600 text-white shadow-md shadow-emerald-700/20 ring-2 ring-emerald-400' 
          : 'bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200/80'
      } ${compact ? 'p-2' : 'px-3 py-1.5 text-xs'} ${className}`}
      title={t('listen', language)}
      aria-label={t('listen', language)}
    >
      {isSpeaking ? (
        <div className="flex items-center gap-0.5 h-3.5">
          <span className="w-1 h-3 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
          <span className="w-1 h-3.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
          <span className="w-1 h-2 bg-white rounded-full animate-bounce" />
        </div>
      ) : (
        <Volume2 className="w-3.5 h-3.5 text-emerald-700" />
      )}
      {resolvedLabel && <span className="font-extrabold text-[11px]">{resolvedLabel}</span>}
    </button>
  );
};
