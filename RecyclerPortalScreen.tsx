import React, { useState } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  Truck, 
  Scale, 
  Banknote, 
  CheckCircle2, 
  Package, 
  MapPin, 
  Phone, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Lot, PaymentMethod } from '../types';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { audioScripts } from '../i18n/audioScripts';

export const RecyclerPortalScreen: React.FC = () => {
  const { lots, updateLotStatus, markLotPaid, setRole, speakText } = useApp();
  const [activeTab, setActiveTab] = useState<'INCOMING' | 'PICKUP' | 'SETTLED'>('INCOMING');

  const incomingLots = lots.filter(l => l.status === 'CREATED' || l.status === 'RECYCLER_ACCEPTED');
  const pickupLots = lots.filter(l => l.status === 'PICKUP_SCHEDULED' || l.status === 'COLLECTED' || l.status === 'HANDED_OVER');
  const settledLots = lots.filter(l => l.status === 'PAID');

  const handleAcceptLot = (lot: Lot) => {
    updateLotStatus(
      lot.id,
      'PICKUP_SCHEDULED',
      'Rate ₹320/kg accepted by Green Cycle Yard. Tata Ace truck MH-01-AB-1234 scheduled.',
      'Green Cycle Dispatch Office'
    );
    speakText({
      en: `Lot ${lot.id} accepted. Pickup van scheduled.`,
      ta: `தொகுப்பு ${lot.id} ஏற்கப்பட்டது. பிக்-அப் வாகனம் திட்டமிடப்பட்டது.`,
      hi: `लॉट ${lot.id} स्वीकार किया गया। पिकअप वैन तय की गई।`,
      mr: `लॉट ${lot.id} स्वीकारला गेला. पिकअप व्हॅन पाठवली जात आहे.`,
    });
  };

  const handleConfirmIntake = (lot: Lot) => {
    updateLotStatus(
      lot.id,
      'HANDED_OVER',
      'Yard weighbridge verified gross weight: 12.00 kg. Scrap moved into secondary processing shredder.',
      'Yard Weighbridge Operator'
    );
    speakText({
      en: `Weighbridge verification complete for ${lot.id}. Payout ready.`,
      ta: `${lot.id} க்கான எடை மேடை சரிபார்ப்பு முடிந்தது. தொகை வழங்கத் தயார்.`,
      hi: `${lot.id} के लिए धर्मकांटा वजन सत्यापन पूरा हुआ। भुगतान तैयार।`,
      mr: `${lot.id} साठी वजनकाटा पडताळणी पूर्ण झाली. पेमेंट तयार आहे.`,
    });
  };

  const handleDisbursePayment = (lot: Lot) => {
    markLotPaid(lot.id, 'UPI');
    speakText({
      en: `Instant UPI payout transferred for ${lot.id}.`,
      ta: `${lot.id} க்கான உடனடி யுபிஐ தொகை வெற்றிகரமாக அனுப்பப்பட்டது.`,
      hi: `${lot.id} के लिए त्वरित यूपीआई भुगतान भेज दिया गया।`,
      mr: `${lot.id} साठी तत्काळ यूपीआय पेमेंट पाठवले गेले.`,
    });
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-900 text-slate-100 pb-20">
      {/* Recycler Header */}
      <div className="p-5 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-black uppercase tracking-wider text-emerald-400">
              Recycler Intake Facility View
            </span>
          </div>
          <h2 className="text-base font-black text-white mt-0.5">
            Green Cycle E-Waste Solutions
          </h2>
          <p className="text-xs text-slate-400">CPCB Lic: MPCB/RO-HQ/E-WASTE/2026/041</p>
        </div>

        <div className="flex items-center gap-2">
          <AudioReadoutButton text={audioScripts.recyclerPortal} label="Listen" />
          <button
            type="button"
            onClick={() => setRole('collector')}
            className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-colors"
          >
            Switch to Collector View
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-950 px-4 py-2 border-b border-slate-800 gap-2">
        <button
          type="button"
          onClick={() => setActiveTab('INCOMING')}
          className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-colors ${
            activeTab === 'INCOMING' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Incoming ({incomingLots.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('PICKUP')}
          className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-colors ${
            activeTab === 'PICKUP' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          In Transit ({pickupLots.length})
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('SETTLED')}
          className={`flex-1 py-1.5 rounded-xl font-bold text-xs transition-colors ${
            activeTab === 'SETTLED' ? 'bg-emerald-700 text-white' : 'bg-slate-800 text-slate-400'
          }`}
        >
          Paid Lots ({settledLots.length})
        </button>
      </div>

      {/* Lots Content */}
      <div className="p-4 flex-1 space-y-3.5 overflow-y-auto">
        {activeTab === 'INCOMING' && (
          <div className="space-y-3">
            {incomingLots.length === 0 ? (
              <p className="text-xs text-slate-500 text-center py-8">No incoming lots awaiting approval.</p>
            ) : (
              incomingLots.map(lot => (
                <div key={lot.id} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="font-mono text-xs font-black text-emerald-400">{lot.id}</span>
                      <h4 className="font-extrabold text-white text-sm mt-0.5">{lot.weightKg} kg • {lot.material}</h4>
                      <p className="text-xs text-slate-400">{lot.collectorName} ({lot.collectorArea})</p>
                    </div>
                    <span className="text-base font-black text-emerald-400">
                      ₹{(lot.totalAmount || Math.round(lot.weightKg * 320)).toLocaleString()}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleAcceptLot(lot)}
                    className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    Accept Lot & Dispatch Pickup Van
                  </button>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === 'PICKUP' && (
          <div className="space-y-3">
            {pickupLots.map(lot => (
              <div key={lot.id} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-black text-amber-400">{lot.id}</span>
                    <h4 className="font-extrabold text-white text-sm mt-0.5">{lot.weightKg} kg • {lot.material}</h4>
                    <p className="text-xs text-slate-400">Collector: {lot.collectorName}</p>
                    <span className="inline-block mt-1 text-[10px] bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded font-bold">
                      {lot.status}
                    </span>
                  </div>
                  <span className="text-base font-black text-emerald-400">
                    ₹{(lot.totalAmount || 3840).toLocaleString()}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => handleConfirmIntake(lot)}
                    className="py-2.5 bg-slate-700 hover:bg-slate-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Scale className="w-3.5 h-3.5" />
                    Weighbridge Scan
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDisbursePayment(lot)}
                    className="py-2.5 bg-emerald-700 hover:bg-emerald-600 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5"
                  >
                    <Banknote className="w-3.5 h-3.5" />
                    Pay ₹{(lot.totalAmount || 3840).toLocaleString()}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'SETTLED' && (
          <div className="space-y-3">
            {settledLots.map(lot => (
              <div key={lot.id} className="p-4 bg-slate-800 rounded-2xl border border-slate-700 flex justify-between items-center text-xs">
                <div>
                  <span className="font-mono text-emerald-400 font-bold">{lot.id}</span>
                  <p className="font-bold text-white text-sm">{lot.weightKg} kg {lot.material}</p>
                  <span className="text-slate-400">Paid to {lot.collectorName} via {lot.paymentMethod || 'UPI'}</span>
                </div>
                <div className="text-right">
                  <span className="font-black text-emerald-400 text-base">₹{(lot.totalAmount || 2805).toLocaleString()}</span>
                  <span className="block text-[10px] text-emerald-300">CPCB EPR Certified ✓</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
