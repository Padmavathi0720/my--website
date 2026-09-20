import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Truck, 
  Star, 
  Banknote, 
  Check, 
  ArrowLeft, 
  Filter, 
  SlidersHorizontal,
  ChevronRight,
  PhoneCall,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Recycler, Lot, MaterialCategory } from '../types';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

interface RecyclerMatchScreenProps {
  draftLot: any;
  onLotCreated: (lot: Lot) => void;
  onBack: () => void;
}

export const RecyclerMatchScreen: React.FC<RecyclerMatchScreenProps> = ({
  draftLot,
  onLotCreated,
  onBack,
}) => {
  const { recyclers, createLot, speakText } = useApp();
  const [sortBy, setSortBy] = useState<'price' | 'distance' | 'speed'>('price');
  const [selectedRecyclerModal, setSelectedRecyclerModal] = useState<Recycler | null>(null);

  // Filter recyclers that accept the draft lot's material
  const matchingRecyclers = recyclers.filter((r) =>
    r.acceptedMaterials.includes(draftLot.material)
  );

  const getRateBand = (recycler: Recycler): [number, number] => {
    const mat = draftLot.material as MaterialCategory;
    const band = recycler.priceRangePerKg[mat];
    return band ?? [280, 320];
  };

  // Sorting
  const sortedRecyclers = [...matchingRecyclers].sort((a, b) => {
    if (sortBy === 'price') {
      const priceA = getRateBand(a)[1];
      const priceB = getRateBand(b)[1];
      return priceB - priceA;
    }
    if (sortBy === 'distance') {
      return a.distanceKm - b.distanceKm;
    }
    if (sortBy === 'speed') {
      return a.pickupAvailable ? -1 : 1;
    }
    return 0;
  });

  const handleSelectRecycler = (recycler: Recycler) => {
    const offeredRate = getRateBand(recycler)[1];
    const totalAmount = Math.round((draftLot.weightKg || 12) * offeredRate);

    const newLot = createLot({
      ...draftLot,
      recyclerId: recycler.id,
      recyclerName: recycler.businessName,
      finalPricePerKg: offeredRate,
      totalAmount,
      status: 'PICKUP_SCHEDULED',
      paymentMethod: 'UPI',
    });

    speakText({
      en: `Lot created and matched with ${recycler.businessName}. Pickup scheduled.`,
      ta: `தொகுப்பு உருவாக்கப்பட்டு ${recycler.businessName} நிறுவனத்துடன் இணைக்கப்பட்டது. பிக்-அப் திட்டமிடப்பட்டுள்ளது.`,
      hi: `लॉट बनाया गया और ${recycler.businessName} के साथ मैच हुआ। पिकअप तय हो गया है।`,
      mr: `लॉट तयार झाला आणि ${recycler.businessName} सोबत जोडला गेला. पिकअप निश्चित करण्यात आला आहे.`,
    });
    onLotCreated(newLot);
  };

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
            <h2 className="text-base font-black text-slate-900">Verified Recyclers</h2>
            <p className="text-xs text-slate-500 font-medium">
              {matchingRecyclers.length} Authorized Buyers for {draftLot.material}
            </p>
          </div>
        </div>

        <AudioReadoutButton
          text={audioScripts.recyclerMatch(matchingRecyclers.length)}
          label="Listen"
        />
      </div>

      {/* Filter / Sort Bar */}
      <div className="px-4 py-2.5 bg-white border-b border-slate-200 flex items-center justify-between gap-2 text-xs">
        <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[10px] shrink-0">
          Sort by:
        </span>
        <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
          <button
            type="button"
            onClick={() => setSortBy('price')}
            className={`px-3 py-1 rounded-full font-extrabold text-xs transition-colors shrink-0 ${
              sortBy === 'price' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Highest Price
          </button>
          <button
            type="button"
            onClick={() => setSortBy('distance')}
            className={`px-3 py-1 rounded-full font-extrabold text-xs transition-colors shrink-0 ${
              sortBy === 'distance' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Nearest (Distance)
          </button>
          <button
            type="button"
            onClick={() => setSortBy('speed')}
            className={`px-3 py-1 rounded-full font-extrabold text-xs transition-colors shrink-0 ${
              sortBy === 'speed' ? 'bg-emerald-700 text-white' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Fastest Pickup
          </button>
        </div>
      </div>

      {/* Recycler Cards List */}
      <div className="p-4 flex-1 space-y-3.5 overflow-y-auto">
        {sortedRecyclers.map((r) => {
          const rateBand = getRateBand(r);
          const topRate = rateBand[1];
          const estimatedTotal = Math.round((draftLot.weightKg || 12) * topRate);

          return (
            <div
              key={r.id}
              className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-shadow p-4 space-y-3"
            >
              {/* Top Row: Business Name + Verified Badge */}
              <div className="flex items-start justify-between gap-2">
                <div>
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <h3 className="font-extrabold text-slate-900 text-base leading-tight">
                      {r.businessName}
                    </h3>
                    <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-md">
                      <ShieldCheck className="w-3 h-3 text-emerald-700" /> CPCB VERIFIED
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Contact: {r.name} • Lic: {r.licenseNumber}
                  </p>
                </div>

                <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg border border-amber-200 text-amber-900 shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-xs font-black">{r.rating}</span>
                </div>
              </div>

              {/* Price & Payout Highlight */}
              <div className="bg-emerald-50/70 p-3 rounded-xl border border-emerald-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block">Indicative Offer</span>
                  <span className="text-lg font-black text-emerald-950">
                    ₹{topRate} <span className="text-xs font-semibold text-slate-600">/ kg</span>
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[11px] font-bold text-slate-500 block">Lot Total ({draftLot.weightKg} kg)</span>
                  <span className="text-lg font-black text-emerald-900">
                    ₹{estimatedTotal.toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Logistics & Logistics Info */}
              <div className="grid grid-cols-2 gap-2 text-xs text-slate-600">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{r.distanceKm} km away</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{r.pickupAvailable ? r.pickupTimeline : 'Self Drop-off'}</span>
                </div>
                <div className="flex items-center gap-1.5 col-span-2">
                  <Banknote className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Payout options: {r.paymentMethods.join(' • ')}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setSelectedRecyclerModal(r)}
                  className="py-2.5 px-3 rounded-xl border border-slate-300 text-slate-700 font-extrabold text-xs hover:bg-slate-100 transition-colors"
                >
                  View Yard Details
                </button>
                <button
                  type="button"
                  onClick={() => handleSelectRecycler(r)}
                  className="py-2.5 px-3 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs flex items-center justify-center gap-1.5 transition-all active:scale-95"
                >
                  <Check className="w-4 h-4" />
                  SELECT BUYER
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Yard Details Modal */}
      {selectedRecyclerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-xs p-4">
          <div className="w-full max-w-sm bg-white rounded-3xl p-5 space-y-4 border border-slate-200 shadow-2xl">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-base font-black text-slate-900">{selectedRecyclerModal.businessName}</h3>
                <span className="text-xs text-emerald-700 font-bold">{selectedRecyclerModal.licenseNumber}</span>
              </div>
              <button 
                type="button"
                onClick={() => setSelectedRecyclerModal(null)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <div className="space-y-2 text-xs text-slate-600">
              <p><strong>Yard Location:</strong> {selectedRecyclerModal.location}</p>
              <p><strong>Daily Recycling Capacity:</strong> {selectedRecyclerModal.capacityPerDayKg.toLocaleString()} kg/day</p>
              <p><strong>Direct Dispatch Phone:</strong> {selectedRecyclerModal.phone}</p>
              <p><strong>Accepted Materials:</strong> {selectedRecyclerModal.acceptedMaterials.join(', ')}</p>
            </div>

            <button
              type="button"
              onClick={() => {
                const r = selectedRecyclerModal;
                setSelectedRecyclerModal(null);
                handleSelectRecycler(r);
              }}
              className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-xs"
            >
              CONFIRM & SCHEDULE PICKUP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
