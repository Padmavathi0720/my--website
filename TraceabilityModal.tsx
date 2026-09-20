import React from 'react';
import { X, ShieldCheck, CheckCircle2, FileCheck, MapPin, Hash } from 'lucide-react';
import { Lot } from '../types';

interface TraceabilityModalProps {
  lot: Lot | null;
  isOpen: boolean;
  onClose: () => void;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  lot,
  isOpen,
  onClose,
}) => {
  if (!isOpen || !lot) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/70 backdrop-blur-xs p-0 sm:p-4 animate-in fade-in duration-200">
      <div 
        className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        role="dialog"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-emerald-900 text-white border-b border-emerald-800">
          <div>
            <div className="inline-flex items-center gap-1.5 text-[11px] font-extrabold text-emerald-300 uppercase tracking-wider">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              CPCB EPR Digital Audit Chain
            </div>
            <h3 className="text-base font-extrabold text-white mt-0.5">
              Traceability Trail: {lot.id}
            </h3>
          </div>
          <button 
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-emerald-800 text-emerald-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5 overflow-y-auto">
          {/* Metadata Grid */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 grid grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-slate-400 font-medium block">Material Type</span>
              <span className="font-extrabold text-slate-800 text-sm">{lot.material}</span>
              <span className="text-slate-500 block truncate">{lot.subCategory}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Verified Net Weight</span>
              <span className="font-extrabold text-slate-800 text-sm">{lot.weightKg} kg</span>
              <span className="text-emerald-700 font-semibold">Calibrated Scale</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Informal Collector</span>
              <span className="font-bold text-slate-800">{lot.collectorName}</span>
              <span className="text-slate-500 block">{lot.collectorArea}</span>
            </div>
            <div>
              <span className="text-slate-400 font-medium block">Authorized Recycler</span>
              <span className="font-bold text-slate-800 truncate block">{lot.recyclerName || 'Matching in progress'}</span>
              <span className="text-emerald-700 font-semibold">Licensed Yard</span>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-wider mb-3">
              Immutable Verification Chain
            </h4>
            <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-emerald-200">
              {lot.timeline.map((step, idx) => (
                <div key={idx} className="relative">
                  {/* Node icon */}
                  <div className="absolute -left-6 top-0.5 w-5 h-5 rounded-full bg-emerald-700 border-2 border-white flex items-center justify-center shadow-sm">
                    <CheckCircle2 className="w-3 h-3 text-white" />
                  </div>

                  <div className="bg-white p-3.5 rounded-xl border border-slate-200/90 shadow-2xs space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-emerald-900 uppercase tracking-wide">
                        {step.status.replace(/_/g, ' ')}
                      </span>
                      <span className="text-[11px] font-semibold text-slate-400">
                        {step.timestamp}
                      </span>
                    </div>
                    <p className="text-xs text-slate-700 font-medium leading-relaxed">
                      {step.note}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 pt-1 text-[10px] text-slate-500 font-medium">
                      <span className="bg-slate-100 px-2 py-0.5 rounded text-slate-700">
                        Actor: {step.actor}
                      </span>
                      {step.locationStamp && (
                        <span className="inline-flex items-center gap-1 text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                          <MapPin className="w-2.5 h-2.5" /> {step.locationStamp}
                        </span>
                      )}
                      {step.hashSignature && (
                        <span className="inline-flex items-center gap-1 font-mono text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                          <Hash className="w-2.5 h-2.5" /> {step.hashSignature}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Regulatory Certificate Banner */}
          <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
            <FileCheck className="w-6 h-6 text-emerald-700 shrink-0 mt-0.5" />
            <div className="text-xs">
              <span className="font-extrabold text-emerald-950 block">
                Extended Producer Responsibility (EPR) Certificate Ready
              </span>
              <p className="text-emerald-800 mt-0.5 leading-relaxed">
                This transaction qualifies for official recycling certificates under Ministry of Environment, Forest and Climate Change (MoEFCC) guidelines.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-colors"
          >
            Close Audit Trail
          </button>
        </div>
      </div>
    </div>
  );
};
