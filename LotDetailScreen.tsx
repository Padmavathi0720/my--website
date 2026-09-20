import React, { useState } from 'react';
import { 
  ArrowLeft, 
  ShieldCheck, 
  QrCode, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Banknote, 
  FileText, 
  Phone, 
  MapPin, 
  AlertCircle,
  Share2,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Lot, PaymentMethod } from '../types';
import { QRCodeView } from '../components/QRCodeView';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { TraceabilityModal } from '../components/TraceabilityModal';
import { audioScripts } from '../i18n/audioScripts';

interface LotDetailScreenProps {
  lotId: string;
  onBack: () => void;
}

export const LotDetailScreen: React.FC<LotDetailScreenProps> = ({ lotId, onBack }) => {
  const { lots, updateLotStatus, markLotPaid, collector, speakText } = useApp();
  const [traceabilityOpen, setTraceabilityOpen] = useState(false);
  const [selectedPayMethod, setSelectedPayMethod] = useState<PaymentMethod>('UPI');
  const [showReceipt, setShowReceipt] = useState(false);

  const lot = lots.find((l) => l.id === lotId) || lots[0];

  if (!lot) {
    return (
      <div className="p-6 text-center">
        <p>Lot not found.</p>
        <button onClick={onBack} className="mt-4 px-4 py-2 bg-slate-200 rounded-xl">
          Back
        </button>
      </div>
    );
  }

  const isCollected = lot.status === 'COLLECTED' || lot.status === 'HANDED_OVER' || lot.status === 'PAID';
  const isHandedOver = lot.status === 'HANDED_OVER' || lot.status === 'PAID';
  const isPaid = lot.status === 'PAID' && lot.paymentStatus === 'PAID';

  const handleConfirmHandover = () => {
    updateLotStatus(
      lot.id,
      'HANDED_OVER',
      'Collector and driver verified scale reading. Scrap handed over to logistics truck.',
      `Collector (${collector.name})`
    );
    speakText({
      en: 'Handover confirmed. Scrap lot handed over to logistics truck.',
      ta: 'ஒப்படைப்பு உறுதி செய்யப்பட்டது. கழிவுத் தொகுப்பு லாரியில் ஏற்றப்பட்டது.',
      hi: 'हैंडओवर की पुष्टि हो गई। कबाड़ लॉट ट्रक को सौंप दिया गया।',
      mr: 'हस्तांतरण नक्की झाले. भंगार लॉट ट्रकमध्ये चढवला गेला.',
    });
  };

  const handleRecyclerReceipt = () => {
    updateLotStatus(
      lot.id,
      'HANDED_OVER',
      'Yard weighbridge verified gross & tare weight. Accepted into recycling intake queue.',
      `${lot.recyclerName || 'Green Cycle Yard'}`
    );
    speakText({
      en: 'Recycler confirmed receipt. Ready for digital payout settlement.',
      ta: 'மறுசுழற்சியாளர் பெற்றுக்கொண்டதை உறுதிப்படுத்தியுள்ளார். உடனடி பணப் பரிவர்த்தனைக்குத் தயார்.',
      hi: 'रीसाइक्लर ने सामग्री प्राप्ति की पुष्टि की। भुगतान निपटान के लिए तैयार।',
      mr: 'खरेदीदाराने माल मिळाल्याची पुष्टी केली. पेमेंट जमा करण्यासाठी सज्ज.',
    });
  };

  const handleSettlePayment = () => {
    markLotPaid(lot.id, selectedPayMethod);
    setShowReceipt(true);
    speakText({
      en: `Payment of ₹${(lot.totalAmount || 3840).toLocaleString()} settled via ${selectedPayMethod}. Digital receipt generated.`,
      ta: `${selectedPayMethod} மூலம் ₹${(lot.totalAmount || 3840).toLocaleString()} தொகை செலுத்தப்பட்டது. டிஜிட்டல் ரசீது உருவாக்கப்பட்டது.`,
      hi: `${selectedPayMethod} के माध्यम से ₹${(lot.totalAmount || 3840).toLocaleString()} का भुगतान पूरा हुआ। डिजिटल रसीद तैयार।`,
      mr: `${selectedPayMethod} द्वारे ₹${(lot.totalAmount || 3840).toLocaleString()} चे पेमेंट झाले. डिजिटल पावती तयार झाली.`,
    });
  };

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
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">{lot.id}</h2>
              {lot.isOfflineCreated && (
                <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded">
                  Offline Saved
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 font-medium">
              {lot.weightKg} kg • {lot.material}
            </p>
          </div>
        </div>

        <AudioReadoutButton
          text={audioScripts.lotDetail(lot.id, lot.weightKg, lot.material, lot.status)}
          label="Listen"
        />
      </div>

      <div className="p-4 flex-1 space-y-4 overflow-y-auto">
        {/* Status Alert Badge */}
        <div className={`p-4 rounded-2xl border flex items-center justify-between ${
          isPaid 
            ? 'bg-emerald-50 border-emerald-300 text-emerald-950' 
            : isHandedOver 
            ? 'bg-amber-50 border-amber-300 text-amber-950' 
            : 'bg-sky-50 border-sky-300 text-sky-950'
        }`}>
          <div className="flex items-center gap-3">
            {isPaid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-700 shrink-0" />
            ) : isHandedOver ? (
              <Clock className="w-6 h-6 text-amber-700 shrink-0" />
            ) : (
              <Truck className="w-6 h-6 text-sky-700 shrink-0" />
            )}
            <div>
              <span className="text-xs font-black uppercase tracking-wider block">
                Status: {lot.status.replace(/_/g, ' ')}
              </span>
              <p className="text-xs font-medium">
                {isPaid
                  ? 'Payment fully settled. Digital invoice generated.'
                  : isHandedOver
                  ? 'Handover completed. Payout processing.'
                  : 'Pickup truck dispatched to your locality.'}
              </p>
            </div>
          </div>
        </div>

        {/* QR Code & Lot Pass Card */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-xs flex flex-col items-center text-center space-y-3">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
            Digital Handover QR Pass
          </span>

          <QRCodeView value={lot.qrPayload} size={160} />

          <div className="space-y-0.5">
            <span className="text-sm font-mono font-black text-slate-900">{lot.id}</span>
            <p className="text-xs text-slate-500 font-medium">
              Driver scans this pass at your location to confirm physical handover
            </p>
          </div>
        </div>

        {/* Financial Details Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2.5 text-xs">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              Agreed Valuation
            </span>
            <span className={`font-black text-xs px-2 py-0.5 rounded-full ${
              isPaid ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
            }`}>
              {lot.paymentStatus}
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-slate-600 font-medium">Offered Rate / kg</span>
            <span className="text-sm font-black text-slate-800">
              ₹{lot.finalPricePerKg || 320} / kg
            </span>
          </div>

          <div className="flex justify-between items-baseline">
            <span className="text-slate-600 font-medium">Verified Weight</span>
            <span className="text-sm font-black text-slate-800">{lot.weightKg} kg</span>
          </div>

          <div className="pt-2 border-t border-slate-100 flex justify-between items-baseline">
            <span className="text-sm font-black text-slate-900">Total Lot Payout</span>
            <span className="text-2xl font-black text-emerald-700">
              ₹{(lot.totalAmount || Math.round(lot.weightKg * (lot.finalPricePerKg || 320))).toLocaleString()}
            </span>
          </div>
        </div>

        {/* Assigned Recycler Logistics Card */}
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <span className="text-xs font-extrabold text-slate-400 uppercase tracking-wider block">
            Recycler & Logistics Fleet
          </span>
          <p className="text-sm font-extrabold text-slate-800">
            {lot.recyclerName || 'Green Cycle E-Waste Solutions Pvt Ltd'}
          </p>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>Pickup Point: {lot.collectorArea}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-500 font-medium">
            <Phone className="w-3.5 h-3.5 text-emerald-700" />
            <span>Yard Dispatcher: +91 98200 11223</span>
          </div>
        </div>

        {/* HANDOVER & PAYMENT ACTIONS */}
        <div className="space-y-3 pt-2">
          {/* Action 1: Confirm Handover */}
          {!isHandedOver && (
            <div className="space-y-2 bg-emerald-50 p-4 rounded-2xl border border-emerald-200">
              <span className="text-xs font-black text-emerald-950 block">
                Dual Verification Handover
              </span>
              <p className="text-xs text-emerald-800">
                Confirm when the truck driver loads the scrap and verifies weight on the mobile scale.
              </p>
              <button
                type="button"
                onClick={handleConfirmHandover}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <CheckCircle2 className="w-4 h-4" />
                CONFIRM HANDOVER
              </button>
            </div>
          )}

          {/* Action 2: Recycler / Yard Receipt Simulation */}
          {isHandedOver && !isPaid && (
            <div className="space-y-3 bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm">
              <span className="text-xs font-black text-slate-900 block">
                Disburse Payout to Collector
              </span>

              <div className="space-y-1.5">
                <span className="text-[11px] font-bold text-slate-500 block">
                  Select Payout Method (Cash Fully Supported):
                </span>
                <div className="grid grid-cols-3 gap-2">
                  {(['UPI', 'Cash', 'Bank Transfer'] as PaymentMethod[]).map((m) => (
                    <button
                      key={m}
                      type="button"
                      onClick={() => setSelectedPayMethod(m)}
                      className={`p-2 rounded-xl text-xs font-extrabold border transition-colors ${
                        selectedPayMethod === m 
                          ? 'bg-emerald-700 text-white border-emerald-700' 
                          : 'bg-slate-50 text-slate-700 border-slate-200'
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="button"
                onClick={handleSettlePayment}
                className="w-full py-3.5 bg-emerald-700 hover:bg-emerald-800 text-white font-black rounded-xl text-sm shadow-md flex items-center justify-center gap-2 active:scale-98 transition-all"
              >
                <Banknote className="w-4 h-4" />
                SETTLE ₹{(lot.totalAmount || 3840).toLocaleString()} ({selectedPayMethod})
              </button>
            </div>
          )}

          {/* Paid Certificate & Receipt */}
          {isPaid && (
            <div className="p-4 bg-emerald-800 text-white rounded-2xl shadow-md space-y-2">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-300" />
                <span className="font-black text-sm">Payment Complete & Verified</span>
              </div>
              <p className="text-xs text-emerald-100">
                ₹{(lot.totalAmount || 3840).toLocaleString()} credited via {lot.paymentMethod || 'UPI'}. EPR recycling receipt generated.
              </p>
            </div>
          )}

          {/* Digital Traceability Trail Button (Requirement 20) */}
          <button
            type="button"
            onClick={() => setTraceabilityOpen(true)}
            className="w-full py-3.5 bg-white hover:bg-slate-100 text-emerald-900 border border-emerald-300 font-black rounded-2xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-700" />
            <span>VIEW DIGITAL TRACEABILITY AUDIT TRAIL</span>
          </button>
        </div>
      </div>

      {/* Traceability Modal */}
      <TraceabilityModal
        lot={lot}
        isOpen={traceabilityOpen}
        onClose={() => setTraceabilityOpen(false)}
      />
    </div>
  );
};
