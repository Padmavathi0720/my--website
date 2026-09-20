import React, { useState } from 'react';
import { 
  ArrowLeft, 
  Search, 
  ShieldCheck, 
  MapPin, 
  Truck, 
  Phone, 
  Star, 
  Filter,
  CheckCircle2,
  Cpu,
  Layers,
  Scale
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { MaterialCategory, Recycler } from '../types';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

interface RecyclerDirectoryScreenProps {
  onBack: () => void;
}

export const RecyclerDirectoryScreen: React.FC<RecyclerDirectoryScreenProps> = ({ onBack }) => {
  const { recyclers, speakText } = useApp();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterial, setSelectedMaterial] = useState<MaterialCategory | 'ALL'>('ALL');
  const [onlyPickup, setOnlyPickup] = useState(false);

  const filteredRecyclers = recyclers.filter((r) => {
    if (selectedMaterial !== 'ALL' && !r.acceptedMaterials.includes(selectedMaterial)) {
      return false;
    }
    if (onlyPickup && !r.pickupAvailable) {
      return false;
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        r.businessName.toLowerCase().includes(q) ||
        r.location.toLowerCase().includes(q) ||
        r.licenseNumber.toLowerCase().includes(q)
      );
    }
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
            <h2 className="text-base font-black text-slate-900">Recycler Directory</h2>
            <p className="text-xs text-slate-500 font-medium">Verified CPCB Authorized Buyers</p>
          </div>
        </div>

        <AudioReadoutButton
          text={audioScripts.recyclerDirectory(recyclers.length)}
          label="Listen"
        />
      </div>

      {/* Search Input */}
      <div className="p-4 bg-white border-b border-slate-200 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by yard name, locality or license..."
            className="w-full pl-10 pr-4 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-emerald-600"
          />
        </div>

        {/* Material Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-xs">
          {(['ALL', 'E-waste', 'Plastic', 'Metal', 'Paper'] as const).map((m) => (
            <button
              key={m}
              type="button"
              onClick={() => setSelectedMaterial(m)}
              className={`px-3 py-1 rounded-full font-extrabold shrink-0 transition-colors ${
                selectedMaterial === m 
                  ? 'bg-emerald-700 text-white' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {m}
            </button>
          ))}
          <button
            type="button"
            onClick={() => setOnlyPickup(!onlyPickup)}
            className={`px-3 py-1 rounded-full font-extrabold shrink-0 transition-colors ${
              onlyPickup 
                ? 'bg-amber-600 text-white' 
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            🚚 Truck Pickup Only
          </button>
        </div>
      </div>

      {/* Directory List */}
      <div className="p-4 flex-1 space-y-3 overflow-y-auto">
        {filteredRecyclers.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl border border-slate-200 p-4 shadow-2xs space-y-3"
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-extrabold text-slate-900 text-sm">
                    {r.businessName}
                  </h3>
                  <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                    <ShieldCheck className="w-3 h-3 text-emerald-700" /> CPCB
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Lic: <span className="font-mono">{r.licenseNumber}</span>
                </p>
              </div>

              <div className="flex items-center gap-1 text-amber-900 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200 text-xs font-black">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{r.rating}</span>
              </div>
            </div>

            <div className="space-y-1.5 text-xs text-slate-600">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{r.location} ({r.distanceKm} km)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{r.pickupAvailable ? `Pickup: ${r.pickupTimeline}` : 'Self drop-off only'}</span>
              </div>
            </div>

            {/* Accepted Materials tags */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {r.acceptedMaterials.map((mat) => (
                <span
                  key={mat}
                  className="px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-bold text-[10px]"
                >
                  {mat}
                </span>
              ))}
            </div>

            {/* Call Dispatcher Button */}
            <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-medium">
                Capacity: {r.capacityPerDayKg.toLocaleString()} kg/day
              </span>

              <a
                href={`tel:${r.phone.replace(/\s+/g, '')}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-black text-xs shadow-xs"
              >
                <Phone className="w-3.5 h-3.5" />
                <span>Call Yard</span>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
