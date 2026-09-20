import React from 'react';
import { Recycle, ArrowRight, ShieldCheck, Award } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

export const SplashScreen: React.FC = () => {
  const { language, setActiveScreen } = useApp();

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-gradient-to-b from-emerald-900 via-emerald-950 to-slate-950 text-white min-h-[600px] relative overflow-hidden">
      {/* Subtle background circular glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-emerald-600/20 rounded-full blur-3xl pointer-events-none" />

      {/* Top Tag & Audio */}
      <div className="flex items-center justify-between z-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-[11px] font-extrabold text-emerald-200">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-300" />
          <span>Formal Recycling Network</span>
        </div>

        <AudioReadoutButton
          text={audioScripts.splash}
          label="Listen"
        />
      </div>

      {/* Center Hero Icon & Branding */}
      <div className="flex flex-col items-center text-center my-auto py-8 z-10 space-y-6">
        {/* Animated Recycling Icon */}
        <div className="relative flex items-center justify-center">
          <div className="w-28 h-28 rounded-full bg-emerald-500/20 animate-ping absolute" />
          <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-emerald-600 to-emerald-400 flex items-center justify-center shadow-xl shadow-emerald-950/80 border-4 border-emerald-300/40">
            <Recycle className="w-14 h-14 text-white animate-spin [animation-duration:12s]" />
          </div>
        </div>

        <div className="space-y-2 max-w-xs">
          <h1 className="text-3xl font-black tracking-tight text-white drop-shadow-sm font-display">
            {t('appName', language)}
          </h1>
          <p className="text-xs uppercase tracking-widest font-extrabold text-emerald-400">
            Formal Recycling Linkage
          </p>
          <p className="text-sm font-medium text-emerald-100/90 leading-relaxed pt-2">
            "{t('tagline', language)}"
          </p>
        </div>

        {/* 3 Core Pillars */}
        <div className="grid grid-cols-3 gap-2 w-full pt-4 text-center">
          <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-xl p-2.5">
            <span className="block text-emerald-300 font-extrabold text-xs">Fair Price</span>
            <span className="text-[10px] text-emerald-100/70">Mandi bands</span>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-xl p-2.5">
            <span className="block text-emerald-300 font-extrabold text-xs">Verified</span>
            <span className="text-[10px] text-emerald-100/70">CPCB authorized</span>
          </div>
          <div className="bg-emerald-900/40 border border-emerald-700/40 rounded-xl p-2.5">
            <span className="block text-emerald-300 font-extrabold text-xs">Traceable</span>
            <span className="text-[10px] text-emerald-100/70">Digital receipts</span>
          </div>
        </div>
      </div>

      {/* Bottom Actions */}
      <div className="space-y-3 z-10">
        <button
          type="button"
          onClick={() => setActiveScreen('LANGUAGE_SELECT')}
          className="w-full py-4 px-6 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black rounded-2xl shadow-lg shadow-emerald-900/50 flex items-center justify-center gap-3 text-base active:scale-98 transition-all"
        >
          <span>{t('continue', language)}</span>
          <ArrowRight className="w-5 h-5 text-slate-950" />
        </button>

        <div className="flex items-center justify-center gap-1.5 text-[11px] text-emerald-300/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Informal Worker Empowerment • Zero replacement of Kabadiwala</span>
        </div>
      </div>
    </div>
  );
};
