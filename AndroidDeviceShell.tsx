import React, { useState, useEffect } from 'react';
import { 
  Wifi, 
  BatteryMedium, 
  Smartphone, 
  Maximize2, 
  Minimize2, 
  RotateCcw,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';

interface AndroidDeviceShellProps {
  children: React.ReactNode;
}

export const AndroidDeviceShell: React.FC<AndroidDeviceShellProps> = ({ children }) => {
  const [currentTime, setCurrentTime] = useState('10:15');
  const [isPhoneFrame, setIsPhoneFrame] = useState(true);
  const { role, setRole, resetDemoData, unreadNotifsCount } = useApp();

  useEffect(() => {
    const update = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-start p-0 sm:p-4 md:p-6 select-none font-sans">
      {/* Top Demo Bar (Controls & View Switcher) */}
      <div className="w-full max-w-md md:max-w-xl flex items-center justify-between px-4 py-2 text-xs text-slate-400 bg-slate-900/90 rounded-none sm:rounded-2xl border-b sm:border border-slate-800 mb-0 sm:mb-4">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-extrabold text-white text-[11px] tracking-wide">
            KABADIWALA CONNECT
          </span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="hidden sm:inline text-slate-300">Collector to Recycler</span>
        </div>

        <div className="flex items-center gap-2">
          {/* Quick Role Switcher */}
          <button
            type="button"
            onClick={() => setRole(role === 'collector' ? 'recycler' : 'collector')}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950 text-emerald-300 hover:bg-emerald-900 border border-emerald-800/80 font-bold text-[11px] transition-all"
            title="Toggle between Collector View and Recycler View"
          >
            <Sparkles className="w-3 h-3 text-emerald-400" />
            <span>Role: {role === 'collector' ? 'Collector' : 'Recycler'}</span>
          </button>

          {/* Reset Demo */}
          <button
            type="button"
            onClick={resetDemoData}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title="Reset demo data to initial state"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          {/* Phone Frame vs Full Responsive Toggle */}
          <button
            type="button"
            onClick={() => setIsPhoneFrame(!isPhoneFrame)}
            className="hidden sm:flex items-center gap-1 p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
            title={isPhoneFrame ? "Expand to Full-Width" : "View in Android Phone Mockup"}
          >
            {isPhoneFrame ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main Container */}
      <div 
        className={`w-full transition-all duration-300 flex flex-col ${
          isPhoneFrame 
            ? 'max-w-[420px] bg-slate-900 rounded-none sm:rounded-[44px] shadow-2xl ring-0 sm:ring-8 sm:ring-slate-800/70 border-0 sm:border-[5px] sm:border-slate-700/80 overflow-hidden min-h-screen sm:min-h-[840px] sm:max-h-[92vh]' 
            : 'max-w-4xl bg-white rounded-none sm:rounded-3xl shadow-2xl border border-slate-800 min-h-screen overflow-hidden'
        }`}
      >
        {/* Android 15 Status Bar */}
        <div className="w-full bg-emerald-900/95 text-white px-5 py-2 flex items-center justify-between text-xs font-semibold select-none shrink-0 z-30">
          <div className="flex items-center gap-2">
            <span className="font-bold tracking-tight text-[13px]">{currentTime}</span>
            <span className="text-[10px] text-emerald-200/80 uppercase font-black bg-emerald-800/80 px-1.5 py-0.2 rounded">
              5G
            </span>
          </div>

          {/* Android Punch-hole Camera */}
          <div className="w-3.5 h-3.5 rounded-full bg-black/90 ring-1 ring-white/10 hidden sm:block shadow-inner" />

          {/* Right Status Icons */}
          <div className="flex items-center gap-2 text-emerald-100">
            <Wifi className="w-3.5 h-3.5" />
            <div className="flex items-center gap-1">
              <span className="text-[11px] font-bold">88%</span>
              <BatteryMedium className="w-4 h-4 text-emerald-300" />
            </div>
          </div>
        </div>

        {/* Inner App Canvas */}
        <div className="flex-1 flex flex-col bg-slate-50 overflow-y-auto relative">
          {children}
        </div>

        {/* Android Gesture Navigation Pill */}
        <div className="w-full bg-white py-2 flex justify-center items-center shrink-0 border-t border-slate-100">
          <div className="w-32 h-1 bg-slate-300 rounded-full" />
        </div>
      </div>
    </div>
  );
};
