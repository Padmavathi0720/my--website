import React from 'react';
import { Wifi, WifiOff, RefreshCw, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const OfflineSyncBanner: React.FC = () => {
  const { isOffline, setIsOffline, pendingSyncCount, syncOfflineData } = useApp();

  return (
    <div className="flex items-center justify-between px-3 py-1.5 bg-slate-900/90 text-white text-xs border-b border-slate-800">
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => setIsOffline(!isOffline)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full font-bold transition-colors active:scale-95 ${
            isOffline 
              ? 'bg-amber-500 text-slate-950 hover:bg-amber-400' 
              : 'bg-emerald-600 text-white hover:bg-emerald-500'
          }`}
          title="Click to toggle Online/Offline mode for demo"
        >
          {isOffline ? (
            <>
              <WifiOff className="w-3.5 h-3.5" />
              <span>Offline Mode</span>
            </>
          ) : (
            <>
              <Wifi className="w-3.5 h-3.5" />
              <span>Online • CPCB Synced</span>
            </>
          )}
        </button>

        {isOffline && (
          <span className="text-[11px] text-amber-200/90 hidden xs:inline">
            Local storage active
          </span>
        )}
      </div>

      <div className="flex items-center gap-2">
        {pendingSyncCount > 0 ? (
          <button
            type="button"
            onClick={syncOfflineData}
            className="flex items-center gap-1 bg-emerald-700/80 hover:bg-emerald-600 text-emerald-100 px-2 py-0.5 rounded-md font-bold text-[11px] animate-pulse"
          >
            <RefreshCw className="w-3 h-3 animate-spin" />
            <span>Sync ({pendingSyncCount} queued)</span>
          </button>
        ) : !isOffline ? (
          <span className="flex items-center gap-1 text-[11px] text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3 h-3" />
            <span>All synced</span>
          </span>
        ) : null}
      </div>
    </div>
  );
};
