import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Wallet, 
  TrendingUp, 
  Calendar, 
  Award, 
  Scale, 
  CheckCircle2, 
  FileText,
  Banknote
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

interface EarningsScreenProps {
  onBack: () => void;
}

export const EarningsScreen: React.FC<EarningsScreenProps> = ({ onBack }) => {
  const { lots, speakText } = useApp();
  const [period, setPeriod] = useState<'today' | 'week' | 'month'>('week');

  const paidLots = lots.filter((l) => l.paymentStatus === 'PAID');
  const totalEarned = paidLots.reduce((sum, l) => sum + (l.totalAmount || 0), 0);
  const totalKg = paidLots.reduce((sum, l) => sum + l.weightKg, 0);
  const avgPricePerKg = totalKg > 0 ? Math.round(totalEarned / totalKg) : 325;

  // Day-by-day simulated bar chart for current week
  const weekDays = [
    { day: 'Mon', amount: 1450, height: '40%' },
    { day: 'Tue', amount: 2100, height: '60%' },
    { day: 'Wed', amount: 980, height: '30%' },
    { day: 'Thu', amount: 3200, height: '85%' },
    { day: 'Fri', amount: 1800, height: '50%' },
    { day: 'Sat', amount: 2805, height: '75%' },
    { day: 'Sun', amount: 3840, height: '100%' },
  ];

  const localizedAudio = audioScripts.earnings(totalEarned, totalKg, paidLots.length);

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
            <h2 className="text-base font-black text-slate-900">Collector Earnings</h2>
            <p className="text-xs text-slate-500 font-medium">Transparent Digital Payouts</p>
          </div>
        </div>

        <AudioReadoutButton text={localizedAudio} label="Listen" />
      </div>

      <div className="p-4 flex-1 space-y-4 overflow-y-auto">
        {/* Period Selector */}
        <div className="flex bg-slate-200/70 p-1 rounded-xl gap-1">
          {(['today', 'week', 'month'] as const).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => setPeriod(p)}
              className={`flex-1 py-1.5 rounded-lg text-xs font-black capitalize transition-all ${
                period === p ? 'bg-white text-emerald-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        {/* Big Payout Card */}
        <div className="p-6 bg-emerald-800 text-white rounded-3xl shadow-md space-y-2 border border-emerald-700">
          <span className="text-xs font-bold text-emerald-200 uppercase tracking-wider block">
            Realized Payout ({period})
          </span>
          <div className="text-3xl sm:text-4xl font-black tracking-tight">
            ₹{totalEarned.toLocaleString()}
          </div>
          <p className="text-xs text-emerald-100 font-medium">
            100% directly transferred via Instant UPI & Cash on Handover
          </p>
        </div>

        {/* 3 Metric Pills */}
        <div className="grid grid-cols-3 gap-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 block">Lots Settled</span>
            <span className="text-lg font-black text-slate-900">{paidLots.length}</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 block">Formalized Kg</span>
            <span className="text-lg font-black text-slate-900">{totalKg} kg</span>
          </div>
          <div className="bg-white p-3 rounded-2xl border border-slate-200 text-center">
            <span className="text-[11px] font-bold text-slate-400 block">Avg Rate</span>
            <span className="text-lg font-black text-emerald-700">₹{avgPricePerKg}/kg</span>
          </div>
        </div>

        {/* Weekly Trend Bar Chart */}
        <div className="bg-white p-4 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-400 uppercase tracking-wider">
              Daily Earnings Flow (Weekly)
            </span>
            <span className="text-xs font-bold text-emerald-700">Fair Mandi Rates</span>
          </div>

          <div className="h-36 flex items-end justify-between gap-2 pt-4 px-2 border-b border-slate-100 pb-2">
            {weekDays.map((d, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                <div 
                  className="w-full bg-emerald-600 rounded-t-lg transition-all hover:bg-emerald-500"
                  style={{ height: d.height }}
                  title={`₹${d.amount}`}
                />
                <span className="text-[11px] font-extrabold text-slate-500">{d.day}</span>
              </div>
            ))}
          </div>

          <p className="text-[11px] text-slate-500 text-center">
            Elimination of unauthorized middlemen yields an average +18% to +24% higher realization.
          </p>
        </div>

        {/* Realized Transaction Invoices */}
        <div className="space-y-2">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block px-1">
            Settled Lot Receipts
          </span>

          {paidLots.map((lot) => (
            <div
              key={lot.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200 flex items-center justify-between text-xs"
            >
              <div className="space-y-0.5">
                <span className="font-mono font-black text-slate-900 block">{lot.id}</span>
                <span className="text-slate-500">
                  {lot.weightKg} kg {lot.material} • {lot.recyclerName}
                </span>
                <span className="text-emerald-700 font-bold block text-[11px]">
                  Paid via {lot.paymentMethod || 'UPI'}
                </span>
              </div>

              <div className="text-right">
                <span className="text-base font-black text-emerald-700 block">
                  ₹{(lot.totalAmount || 2805).toLocaleString()}
                </span>
                <span className="text-[10px] text-slate-400">Tax Invoice ✓</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
