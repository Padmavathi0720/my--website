import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Package, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  Filter, 
  QrCode,
  Calendar,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Lot } from '../types';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

interface MyLotsScreenProps {
  onSelectLot: (lotId: string) => void;
  onBack: () => void;
}

export const MyLotsScreen: React.FC<MyLotsScreenProps> = ({ onSelectLot, onBack }) => {
  const { lots, speakText } = useApp();
  const [filter, setFilter] = useState<'ALL' | 'ACTIVE' | 'PAID'>('ALL');

  const filteredLots = lots.filter((l) => {
    if (filter === 'ACTIVE') return l.status !== 'PAID';
    if (filter === 'PAID') return l.status === 'PAID';
    return true;
  });

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
            <h2 className="text-base font-black text-slate-900">My Scrap Lots</h2>
            <p className="text-xs text-slate-500 font-medium">
              {filteredLots.length} Lots Registered • Traceable
            </p>
          </div>
        </div>

        <AudioReadoutButton
          text={audioScripts.myLots(lots.length, lots.filter(l => l.status !== 'PAID').length)}
          label="Listen"
        />
      </div>

      {/* Filter Tabs */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex gap-2">
        <button
          type="button"
          onClick={() => setFilter('ALL')}
          className={`flex-1 py-1.5 rounded-xl font-extrabold text-xs transition-colors ${
            filter === 'ALL' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          All ({lots.length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('ACTIVE')}
          className={`flex-1 py-1.5 rounded-xl font-extrabold text-xs transition-colors ${
            filter === 'ACTIVE' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Active ({lots.filter(l => l.status !== 'PAID').length})
        </button>
        <button
          type="button"
          onClick={() => setFilter('PAID')}
          className={`flex-1 py-1.5 rounded-xl font-extrabold text-xs transition-colors ${
            filter === 'PAID' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
          }`}
        >
          Paid ({lots.filter(l => l.status === 'PAID').length})
        </button>
      </div>

      {/* Lots List */}
      <div className="p-4 flex-1 space-y-3 overflow-y-auto">
        {filteredLots.length === 0 ? (
          <div className="p-8 text-center bg-white rounded-2xl border border-slate-200 text-slate-500 space-y-2">
            <Package className="w-10 h-10 text-slate-300 mx-auto" />
            <p className="text-sm font-bold">No lots found in this filter.</p>
          </div>
        ) : (
          filteredLots.map((lot) => {
            const isPaid = lot.status === 'PAID';
            return (
              <div
                key={lot.id}
                onClick={() => onSelectLot(lot.id)}
                className="bg-white rounded-2xl p-4 border border-slate-200 shadow-2xs hover:border-emerald-500 cursor-pointer active:scale-98 transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-slate-800">
                        {lot.id}
                      </span>
                      {lot.isOfflineCreated && (
                        <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">
                          Offline
                        </span>
                      )}
                    </div>
                    <h3 className="font-extrabold text-slate-900 text-sm">
                      {lot.weightKg} kg • {lot.material}
                    </h3>
                    <p className="text-xs text-slate-500 truncate max-w-[240px]">
                      {lot.subCategory}
                    </p>
                  </div>

                  <span className={`text-[11px] font-black px-2.5 py-1 rounded-full uppercase tracking-wider ${
                    isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-900'
                  }`}>
                    {lot.status.replace(/_/g, ' ')}
                  </span>
                </div>

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{lot.createdAt}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-black text-emerald-700 text-sm">
                      ₹{(lot.totalAmount || Math.round(lot.weightKg * (lot.finalPricePerKg || 320))).toLocaleString()}
                    </span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
