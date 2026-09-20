import React, { useState } from 'react';
import { User, Phone, MapPin, KeyRound, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { SEEDED_COLLECTORS } from '../data/mockData';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

export const LoginScreen: React.FC = () => {
  const { collector, updateCollector, setActiveScreen, speakText } = useApp();
  const [phone, setPhone] = useState(collector.phone.replace('+91 ', ''));
  const [otp, setOtp] = useState('4209');
  const [name, setName] = useState(collector.name);
  const [area, setArea] = useState(collector.area);

  const handleQuickSeed = (seedIndex: number) => {
    const seeded = SEEDED_COLLECTORS[seedIndex];
    setPhone(seeded.phone.replace('+91 ', ''));
    setName(seeded.name);
    setArea(seeded.area);
    updateCollector({
      name: seeded.name,
      phone: seeded.phone,
      area: seeded.area,
      language: seeded.language,
    });
    speakText(`Loaded profile for ${seeded.name}`);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    updateCollector({
      name: name || 'Rameshwar Yadav',
      phone: `+91 ${phone || '98231 44521'}`,
      area: area || 'Dharavi Sector 3, Mumbai',
      isLoggedIn: true,
    });
    setActiveScreen('HOME');
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-6 bg-slate-50 text-slate-900 min-h-[600px] overflow-y-auto">
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-black text-slate-900">Collector Quick Profile</h2>
            <p className="text-xs text-slate-500">Quick Collector Sign-In & Verification</p>
          </div>
          <AudioReadoutButton
            text={audioScripts.login}
            label="Listen"
          />
        </div>

        {/* Minimal privacy notice */}
        <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
          <p className="text-xs text-emerald-900 leading-relaxed font-medium">
            <strong className="font-extrabold">Data Privacy:</strong> We collect only your contact and neighborhood to route collection trucks. No Aadhaar or invasive background scans required.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-3.5">
          {/* Mobile number */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Mobile Number
            </label>
            <div className="relative">
              <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                +91
              </span>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98231 44521"
                className="w-full pl-12 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          {/* OTP */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">
                SMS OTP (4-Digit Code)
              </label>
              <span className="text-[11px] text-emerald-700 font-bold">Auto-detected (✓)</span>
            </div>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                maxLength={4}
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-extrabold text-slate-800 tracking-widest focus:outline-none focus:ring-2 focus:ring-emerald-600"
                placeholder="4209"
              />
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Your Name / Nickname
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Rameshwar 'Ramu' Yadav"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          {/* Locality */}
          <div>
            <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider mb-1">
              Area / Locality / Ward
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={area}
                onChange={(e) => setArea(e.target.value)}
                placeholder="e.g. Dharavi Sector 3, Mumbai"
                className="w-full pl-10 pr-4 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-600"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-2 py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-lg shadow-emerald-950/20 flex items-center justify-center gap-2 text-base active:scale-98 transition-all"
          >
            <span>Enter Dashboard</span>
            <ArrowRight className="w-5 h-5 text-white" />
          </button>
        </form>

        {/* Quick Demo Preset Personas */}
        <div className="pt-2 border-t border-slate-200">
          <span className="text-[11px] font-extrabold text-slate-400 uppercase tracking-wider block mb-2">
            Quick Persona Switcher:
          </span>
          <div className="grid grid-cols-3 gap-2">
            <button
              type="button"
              onClick={() => handleQuickSeed(0)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-left text-xs"
            >
              <span className="font-bold text-slate-800 block truncate">Ramu (Mumbai)</span>
              <span className="text-[10px] text-emerald-700">English • E-waste</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSeed(1)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-left text-xs"
            >
              <span className="font-bold text-slate-800 block truncate">Murugan (Chennai)</span>
              <span className="text-[10px] text-emerald-700 font-bold">Tamil • E-waste</span>
            </button>
            <button
              type="button"
              onClick={() => handleQuickSeed(2)}
              className="p-2 rounded-xl bg-white border border-slate-200 hover:border-emerald-400 text-left text-xs"
            >
              <span className="font-bold text-slate-800 block truncate">Shantabai (Mumbai)</span>
              <span className="text-[10px] text-emerald-700">Marathi • Simple</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
