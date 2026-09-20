import React from 'react';
import { 
  ShieldAlert, 
  BatteryWarning, 
  Flame, 
  Hand, 
  Layers, 
  ArrowLeft, 
  Volume2, 
  AlertTriangle 
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Language } from '../types';
import { AudioReadoutButton } from '../components/AudioReadoutButton';

interface SafetyAssistantScreenProps {
  onBack: () => void;
}

export const SafetyAssistantScreen: React.FC<SafetyAssistantScreenProps> = ({ onBack }) => {
  const { language, speakText } = useApp();

  const guidelines: {
    icon: any;
    color: string;
    title: string;
    translations: Record<Language, string>;
    desc: string;
    badge: string;
  }[] = [
    {
      icon: BatteryWarning,
      color: 'bg-red-500 text-white',
      title: 'Do NOT Dismantle Batteries',
      translations: {
        en: 'Keep sealed and deliver intact to authorized recyclers',
        ta: 'பேட்டரிகளை பிரிக்கவோ உடைக்கவோ வேண்டாம்',
        hi: 'बैटरी कभी न खोलें या तोड़ें',
        mr: 'बॅटरी कधीही उघडू किंवा तोडू नका',
      },
      desc: 'Lithium batteries explode and cause severe chemical burns if punctured. Keep sealed and deliver intact to authorized recyclers.',
      badge: 'High Risk'
    },
    {
      icon: Flame,
      color: 'bg-amber-500 text-white',
      title: 'NEVER Burn Cables or Plastics',
      translations: {
        en: 'Sell intact with insulation for formal recovery',
        ta: 'வயர்கள் அல்லது பிளாஸ்டிக்கை ஒருபோதும் எரிக்க வேண்டாம்',
        hi: 'तार या प्लास्टिक कभी न जलाएं',
        mr: 'वायरी किंवा प्लास्टिक कधीही जाळू नका',
      },
      desc: 'Open burning releases toxic dioxins and heavy metal fumes that permanently damage lungs and brain tissue. Sell intact with insulation.',
      badge: 'Toxic Fumes'
    },
    {
      icon: Hand,
      color: 'bg-sky-500 text-white',
      title: 'Wear Heavy Leather Gloves',
      translations: {
        en: 'Prevent cuts and heavy metal contact',
        ta: 'கனமான பாதுகாப்பு கையுறைகளை அணியுங்கள்',
        hi: 'मोटे सुरक्षा दस्ताने पहनें',
        mr: 'जाड संरक्षणात्मक हातमोजे वापरा',
      },
      desc: 'Electronic circuit boards have sharp solder leads and broken glass fiber that puncture bare hands and cause infections.',
      badge: 'Physical Hazard'
    },
    {
      icon: Layers,
      color: 'bg-emerald-600 text-white',
      title: 'Segregate Hazardous Waste',
      translations: {
        en: 'Keep toxic scrap separate from dry trash',
        ta: 'ஆபத்தான கழிவுகளை தனியாக பிரிக்கவும்',
        hi: 'खतरनाक कचरा अलग रखें',
        mr: 'धोकादायक कचरा वेगळा ठेवा',
      },
      desc: 'Keep broken tube lights, CRT glass, and leaking capacitors in separate sturdy boxes away from organic trash and rain.',
      badge: 'Safe Storage'
    }
  ];

  const fullAudioScript = language === 'ta'
    ? 'கழிவு சேகரிப்பாளர்களுக்கான பாதுகாப்பு வழிகாட்டிகள்: முதலாவதாக, பேட்டரிகளை பிரிக்கவோ உடைக்கவோ வேண்டாம். இரண்டாவதாக, தாமிரம் எடுக்க வயர்களை எரிக்க வேண்டாம். மூன்றாவதாக, சர்க்யூட் பலகைகளை கையாளும்போது தடிமனான கையுறைகளை அணியுங்கள். நான்காவதாக, ஆபத்தான கழிவுகளை உலர்ந்த தனிப் பெட்டியில் வைக்கவும்.'
    : language === 'hi'
    ? 'अनौपचारिक कबाड़ संग्राहकों के लिए सुरक्षा दिशानिर्देश: पहला, बैटरी को कभी न खोलें। दूसरा, तांबा निकालने के लिए तार कभी न जलाएं। तीसरा, सर्किट बोर्ड को छूते समय मोटे दस्ताने पहनें। चौथा, खतरनाक कचरे को अलग और सूखा रखें।'
    : language === 'mr'
    ? 'कचरा संकलकांसाठी सुरक्षा नियम: पहिले, बॅटरी कधीही तोडू नका. दुसरे, तांबे काढण्यासाठी वायर जाळू नका. तिसरे, सर्किट बोर्ड हाताळताना जाड हातमोजे वापरा. चौथे, घातक कचरा वेगळा आणि कोरडा ठेवा.'
    : 'Safety guidelines for informal waste collectors: First, do not dismantle or pierce batteries. Second, never burn cables to extract copper. Third, always wear thick gloves when handling circuit boards. Fourth, keep hazardous scrap dry and separated.';

  const headerSubtitle = language === 'ta'
    ? 'பாதுகாப்பு வழிகாட்டி மற்றும் முன்னெச்சரிக்கைகள்'
    : language === 'hi'
    ? 'सुरक्षा नियम और सावधानियां'
    : language === 'mr'
    ? 'सुरक्षा नियम आणि काळजी'
    : 'Essential Health & Safety Guidelines';

  const listenLabel = language === 'ta'
    ? 'கேட்க'
    : language === 'hi'
    ? 'सुनें'
    : language === 'mr'
    ? 'ऐका'
    : 'Listen';

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 pb-20">
      {/* Header */}
      <div className="px-5 py-3 bg-white border-b border-slate-200 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onBack}
            className="p-1.5 rounded-full hover:bg-slate-100 text-slate-700"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="text-base font-black text-slate-900">Collector Safety Guide</h2>
            <p className="text-xs text-slate-500 font-medium">{headerSubtitle}</p>
          </div>
        </div>

        <AudioReadoutButton text={fullAudioScript} label="Listen" />
      </div>

      <div className="p-4 flex-1 space-y-4 overflow-y-auto">
        {/* Safety Banner */}
        <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
          <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950">
            <strong className="font-extrabold text-sm block">
              Health First, Livelihood Forever
            </strong>
            <p className="mt-0.5 leading-relaxed font-medium">
              Informal scrap collection saves cities, but toxic exposure must be stopped. Government certified recyclers buy your scrap intact at higher rates without you needing to burn or break it.
            </p>
          </div>
        </div>

        {/* Guidelines List */}
        <div className="space-y-3">
          {guidelines.map((item, idx) => {
            const Icon = item.icon;
            const vernacularText = item.translations[language] || item.translations.en;
            return (
              <div
                key={idx}
                className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-2"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 ${item.color}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="font-black text-slate-900 text-sm">{item.title}</h3>
                      <p className="text-xs font-bold text-slate-500">{vernacularText}</p>
                    </div>
                  </div>

                  <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {item.badge}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed pl-1">
                  {item.desc}
                </p>

                <div className="pt-2 border-t border-slate-100 flex justify-end">
                  <button
                    type="button"
                    onClick={() => speakText(`${item.title}. ${vernacularText}. ${item.desc}`)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-700 hover:text-emerald-800"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>{listenLabel}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
