import React from 'react';
import { 
  ArrowLeft, 
  Award, 
  Leaf, 
  Users, 
  TrendingUp, 
  CheckCircle2, 
  ShieldCheck, 
  Factory,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

interface ImpactDashboardScreenProps {
  onBack: () => void;
}

export const ImpactDashboardScreen: React.FC<ImpactDashboardScreenProps> = ({ onBack }) => {
  const { lots } = useApp();

  const totalKg = lots.reduce((acc, l) => acc + l.weightKg, 0);
  const paidLots = lots.filter(l => l.paymentStatus === 'PAID');
  const formalizedKg = paidLots.reduce((acc, l) => acc + l.weightKg, 0);
  const co2SavedKg = Math.round(formalizedKg * 2.85); // 2.85 kg CO2e saved per kg formal recycling
  const totalPayout = paidLots.reduce((acc, l) => acc + (l.totalAmount || 0), 0);
  const incomeUplift = Math.round(totalPayout * 0.22); // ~22% middleman elimination margin

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
            <h2 className="text-base font-black text-slate-900">National Impact Metrics</h2>
            <p className="text-xs text-slate-500 font-medium">National Formalization Metric</p>
          </div>
        </div>

        <AudioReadoutButton
          text={audioScripts.impactDashboard(formalizedKg, co2SavedKg, incomeUplift)}
          label="Listen"
        />
      </div>

      <div className="p-4 flex-1 space-y-4 overflow-y-auto">
        {/* Banner */}
        <div className="p-5 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl shadow-md space-y-2 border border-emerald-700">
          <div className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider text-emerald-300">
            <Award className="w-4 h-4 text-amber-300" />
            National Circular Economy Initiative
          </div>
          <h3 className="text-xl font-black leading-snug text-white">
            Bringing Informal Collectors into the Formal Chain
          </h3>
          <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
            Transforming vulnerable scrap collectors into certified environmental service partners with direct market linkage.
          </p>
        </div>

        {/* 4 Large Impact Cards */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Leaf className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-emerald-700 block tracking-tight">
              {formalizedKg} kg
            </span>
            <span className="text-xs font-bold text-slate-800 block">Diverted from Landfills</span>
            <span className="text-[10px] text-slate-500">Zero open burning</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="w-8 h-8 rounded-xl bg-sky-100 text-sky-800 flex items-center justify-center">
              <Factory className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-sky-700 block tracking-tight">
              {co2SavedKg} kg
            </span>
            <span className="text-xs font-bold text-slate-800 block">CO2e Emissions Cut</span>
            <span className="text-[10px] text-slate-500">Clean circular loop</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <TrendingUp className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-amber-700 block tracking-tight">
              +₹{incomeUplift.toLocaleString()}
            </span>
            <span className="text-xs font-bold text-slate-800 block">Collector Income Uplift</span>
            <span className="text-[10px] text-slate-500">+22% over middlemen</span>
          </div>

          <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-1">
            <div className="w-8 h-8 rounded-xl bg-indigo-100 text-indigo-800 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
            <span className="text-2xl font-black text-indigo-700 block tracking-tight">
              5
            </span>
            <span className="text-xs font-bold text-slate-800 block">Collectors Onboarded</span>
            <span className="text-[10px] text-slate-500">Dharavi & Chembur</span>
          </div>
        </div>

        {/* CPCB EPR Compliance Alignment */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 space-y-3">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-700" />
            <h4 className="font-extrabold text-slate-900 text-sm">
              EPR Legal & Regulatory Alignment
            </h4>
          </div>

          <div className="space-y-2 text-xs text-slate-600">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Full compliance with CPCB E-Waste Management Rules (2022/2026).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Digital audit trails qualify for official EPR recycling credits.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
              <span>Protects informal workers from criminalization through formal registration.</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
