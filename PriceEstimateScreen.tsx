import React from 'react';
import { 
  IndianRupee, 
  ArrowRight, 
  ArrowLeft, 
  Info, 
  TrendingUp, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  Scale,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

interface PriceEstimateScreenProps {
  draftLot: any;
  onProceedToRecyclers: () => void;
  onBack: () => void;
}

export const PriceEstimateScreen: React.FC<PriceEstimateScreenProps> = ({
  draftLot,
  onProceedToRecyclers,
  onBack,
}) => {
  const { speakText } = useApp();

  const minTotal = draftLot.estimatedPriceMin || 3360;
  const maxTotal = draftLot.estimatedPriceMax || 4080;
  const minRate = Math.round(minTotal / (draftLot.weightKg || 12));
  const maxRate = Math.round(maxTotal / (draftLot.weightKg || 12));

  const localizedReadout = audioScripts.priceEstimate(draftLot.weightKg || 12, minTotal, maxTotal);

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 pb-16">
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
            <h2 className="text-base font-black text-slate-900">Price Estimation</h2>
            <p className="text-xs text-slate-500 font-medium">Transparent Mandi Valuation</p>
          </div>
        </div>

        <AudioReadoutButton text={localizedReadout} label="Listen" />
      </div>

      <div className="p-5 flex-1 space-y-4 overflow-y-auto">
        {/* Main Payout Card */}
        <div className="p-6 bg-gradient-to-br from-emerald-800 to-emerald-950 text-white rounded-3xl shadow-xl shadow-emerald-950/20 space-y-4 border border-emerald-700">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-emerald-300 uppercase tracking-widest flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Estimated Payout Band
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] bg-emerald-700/60 text-emerald-200 px-2.5 py-0.5 rounded-full font-bold">
              <CheckCircle2 className="w-3 h-3 text-emerald-300" /> High Confidence
            </span>
          </div>

          <div>
            <div className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              ₹{minTotal.toLocaleString()} – ₹{maxTotal.toLocaleString()}
            </div>
            <p className="text-xs text-emerald-200 mt-1">
              For {draftLot.weightKg} kg • {draftLot.subCategory || draftLot.material}
            </p>
          </div>

          <div className="pt-3 border-t border-emerald-700/60 flex items-center justify-between text-xs">
            <div>
              <span className="text-emerald-300 block text-[11px]">Indicative Unit Rate</span>
              <strong className="text-base font-extrabold text-white">
                ₹{minRate} – ₹{maxRate} <span className="text-xs font-normal">/ kg</span>
              </strong>
            </div>
            <div className="text-right">
              <span className="text-emerald-300 block text-[11px]">Pricing Source</span>
              <span className="text-white font-bold">Dharavi-Kurla Mandi Index</span>
            </div>
          </div>
        </div>

        {/* Mandatory Transparency Notice (Requirement 6: Never hide uncertainty) */}
        <div className="p-4 bg-amber-50 rounded-2xl border-2 border-amber-300 flex items-start gap-3">
          <Info className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
          <div className="text-xs text-amber-950 leading-relaxed">
            <strong className="font-extrabold block text-sm mb-0.5">
              Notice: Prices are indicative and may change after inspection.
            </strong>
            Final payout is calculated upon physical weighment and verification of contamination/moisture by the authorized recycler. You have full right to decline any offer.
          </div>
        </div>

        {/* Price Breakdown Details */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block">
            Valuation Parameters
          </span>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Scrap Category</span>
            <span className="font-bold text-slate-800">{draftLot.material}</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Entered Weight</span>
            <span className="font-bold text-slate-800">{draftLot.weightKg} kg</span>
          </div>

          <div className="flex justify-between py-1 border-b border-slate-100">
            <span className="text-slate-500 font-medium">Market Baseline (Last Updated)</span>
            <span className="font-bold text-slate-800 flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" /> Today 09:30 AM
            </span>
          </div>

          <div className="flex justify-between py-1">
            <span className="text-slate-500 font-medium">Middleman Margin Elimination</span>
            <span className="font-bold text-emerald-700">+18% Direct-to-Recycler Uplift</span>
          </div>
        </div>

        {/* Proceed Action Button */}
        <button
          type="button"
          onClick={onProceedToRecyclers}
          className="w-full py-4 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-2xl shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 text-base active:scale-98 transition-all"
        >
          <span>SEE VERIFIED RECYCLERS</span>
          <ArrowRight className="w-5 h-5 text-white" />
        </button>
      </div>
    </div>
  );
};
