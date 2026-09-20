import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Package, 
  Wallet, 
  Mic, 
  MapPin, 
  ShieldAlert, 
  Bell, 
  Sparkles, 
  Volume2, 
  RotateCcw, 
  ArrowRight,
  ChevronRight,
  TrendingUp,
  Clock,
  CheckCircle2,
  SlidersHorizontal,
  Flame,
  BatteryCharging
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { t } from '../i18n/translations';
import { OfflineSyncBanner } from '../components/OfflineSyncBanner';
import { AudioReadoutButton } from '../components/AudioReadoutButton';
import { VoiceAssistantModal } from '../components/VoiceAssistantModal';
import { MaterialCategory, Language } from '../types';
import { LocalizedAudioText } from '../i18n/audioScripts';

export const HomeScreen: React.FC = () => {
  const { 
    collector, 
    updateCollector, 
    lots, 
    language, 
    setActiveScreen, 
    speakText, 
    notifications,
    unreadNotifsCount,
    markNotificationRead,
    setRole
  } = useApp();

  const [voiceModalOpen, setVoiceModalOpen] = useState(false);
  const [notifDrawerOpen, setNotifDrawerOpen] = useState(false);

  // Computed metrics
  const activeLots = lots.filter(l => l.status !== 'PAID');
  const pendingLots = lots.filter(l => l.status === 'HANDED_OVER' && l.paymentStatus === 'PENDING');
  const paidLots = lots.filter(l => l.paymentStatus === 'PAID');
  const todayEarnings = paidLots.reduce((acc, l) => acc + (l.totalAmount || 0), 0);
  const totalWeightFormalized = paidLots.reduce((acc, l) => acc + l.weightKg, 0);

  const greeting = language === 'ta'
    ? `வணக்கம், ${collector.name}`
    : language === 'hi'
    ? `नमस्ते, ${collector.name}`
    : language === 'mr'
    ? `नमस्कार, ${collector.name}`
    : `Welcome, ${collector.name}`;

  const localizedHomeAudio: LocalizedAudioText = {
    en: `Hello ${collector.name}. You have ${activeLots.length} active scrap lots and ${pendingLots.length} pending payouts. Today's realized earnings are ₹${todayEarnings}. Tap Sell Material to register a new scrap lot.`,
    ta: `வணக்கம் ${collector.name}. உங்களிடம் ${activeLots.length} நடப்பு கழிவுத் தொகுப்புகளும் ${pendingLots.length} நிலுவைத் தொகைகளும் உள்ளன. இன்றைய மொத்த வருமானம் ₹${todayEarnings}. புதிய கழிவைச் சேர்க்க 'பொருட்களை விற்க' என்பதைத் தட்டவும்.`,
    hi: `नमस्ते ${collector.name}। आपके पास ${activeLots.length} सक्रिय कबाड़ लॉट और ${pendingLots.length} बकाया भुगतान हैं। आज की प्राप्त आय ₹${todayEarnings} है। नया कबाड़ जोड़ने के लिए 'सामग्री बेचें' पर टैप करें।`,
    mr: `नमस्कार ${collector.name}. आपल्याकडे ${activeLots.length} सक्रिय भंगार लॉट्स आणि ${pendingLots.length} प्रलंबित पेमेंट्स आहेत. आजची जमा कमाई ₹${todayEarnings} आहे. नवीन भंगार जोडण्यासाठी 'माल विका' वर टॅप करा.`,
  };

  const handleVoiceResult = (parsed: { material?: MaterialCategory; weight?: number }) => {
    // Navigate to Add Material with prefilled params
    setActiveScreen('ADD_MATERIAL');
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-50 text-slate-900 pb-20">
      {/* Offline Status & Sync Bar */}
      <OfflineSyncBanner />

      {/* Collector Header Bar */}
      <div className="px-5 pt-4 pb-3 bg-white border-b border-slate-200/80 flex items-center justify-between">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <h1 className="text-lg font-black text-slate-900 tracking-tight">{greeting}</h1>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full">
              Collector ID: {collector.id}
            </span>
          </div>
          <div className="flex items-center gap-1 text-xs text-slate-500 font-medium">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span>{collector.area}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Language Switcher */}
          <button
            type="button"
            onClick={() => setActiveScreen('LANGUAGE_SELECT')}
            className="px-2.5 py-1.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center gap-1 text-[11px] font-black uppercase tracking-wider transition-colors"
            title="Change Language"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
            <span>{language.toUpperCase()}</span>
          </button>

          {/* Notifications Button */}
          <button
            type="button"
            onClick={() => setNotifDrawerOpen(!notifDrawerOpen)}
            className="p-2.5 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 relative active:scale-95 transition-transform"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadNotifsCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center animate-pulse">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          {/* Audio Readout */}
          <AudioReadoutButton text={localizedHomeAudio} label="Listen" />
        </div>
      </div>

      {/* Notifications Drawer (Slide down overlay) */}
      {notifDrawerOpen && (
        <div className="px-4 py-3 bg-emerald-950 text-white border-b border-emerald-900 animate-in slide-in-from-top duration-200">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black uppercase tracking-wider text-emerald-300">
              Live Activity Notifications ({notifications.length})
            </span>
            <button
              type="button"
              onClick={() => setNotifDrawerOpen(false)}
              className="text-xs text-emerald-400 hover:text-white"
            >
              Close
            </button>
          </div>
          <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
            {notifications.map((n) => (
              <div
                key={n.id}
                onClick={() => markNotificationRead(n.id)}
                className={`p-2.5 rounded-xl text-xs cursor-pointer transition-colors ${
                  n.read ? 'bg-emerald-900/40 text-emerald-200' : 'bg-emerald-800 text-white font-bold border border-emerald-600'
                }`}
              >
                <div className="flex justify-between items-start">
                  <span>{n.title}</span>
                  <span className="text-[10px] text-emerald-400">{n.timestamp}</span>
                </div>
                <p className="text-[11px] font-normal text-emerald-100/80 mt-0.5">{n.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Content Body */}
      <div className="p-4 space-y-4">
        {/* Simple Mode Toggle Bar (Requirement 16: Low-Digital-Literacy Mode) */}
        <div className="flex items-center justify-between p-3.5 bg-emerald-50 rounded-2xl border border-emerald-200 shadow-2xs">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-emerald-700 text-white flex items-center justify-center">
              <SlidersHorizontal className="w-4 h-4" />
            </div>
            <div>
              <span className="text-xs font-extrabold text-emerald-950 block">
                {t('simpleMode', language)}
              </span>
              <span className="text-[11px] text-emerald-800">
                Extra large touch targets, simplified icons & loud voice prompts
              </span>
            </div>
          </div>

          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={collector.simpleMode}
              onChange={(e) => updateCollector({ simpleMode: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-11 h-6 bg-slate-300 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-700"></div>
          </label>
        </div>

        {/* Dashboard KPI Counter Grid */}
        <div className="grid grid-cols-3 gap-2.5">
          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs font-bold text-slate-400 block mb-0.5">Today Payout</span>
            <span className="text-xl font-black text-emerald-700 tracking-tight">
              ₹{todayEarnings}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 block mt-0.5">Instant UPI/Cash</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs font-bold text-slate-400 block mb-0.5">Active Lots</span>
            <span className="text-xl font-black text-slate-900 tracking-tight">
              {activeLots.length}
            </span>
            <span className="text-[10px] font-semibold text-slate-500 block mt-0.5">In collection</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-slate-200 shadow-2xs text-center">
            <span className="text-xs font-bold text-slate-400 block mb-0.5">Pending Pay</span>
            <span className={`text-xl font-black tracking-tight ${pendingLots.length > 0 ? 'text-amber-600' : 'text-slate-400'}`}>
              {pendingLots.length}
            </span>
            <span className="text-[10px] font-semibold text-amber-700 block mt-0.5">Awaiting Yard</span>
          </div>
        </div>

        {/* FOUR PRIMARY LARGE TOUCH ACTIONS */}
        <div className="space-y-3 pt-1">
          <span className="text-xs font-black text-slate-400 uppercase tracking-wider block px-1">
            Primary Collector Actions
          </span>

          {/* 1. SELL / ADD MATERIAL (Primary Hero Action) */}
          <button
            type="button"
            onClick={() => setActiveScreen('ADD_MATERIAL')}
            className={`w-full text-left bg-gradient-to-r from-emerald-800 to-emerald-700 text-white rounded-2xl p-5 shadow-lg shadow-emerald-950/20 border-2 border-emerald-600 flex items-center justify-between active:scale-98 transition-all ${
              collector.simpleMode ? 'py-6 text-lg' : ''
            }`}
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-white/15 border border-white/20 flex items-center justify-center shadow-inner">
                <Plus className="w-8 h-8 text-white stroke-[2.5]" />
              </div>
              <div className="space-y-0.5">
                <span className="text-lg font-black tracking-tight block">
                  {t('sellMaterial', language)}
                </span>
                <span className="text-xs text-emerald-100 font-medium block">
                  AI camera photo, weight & instant price estimation
                </span>
              </div>
            </div>
            <div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <ArrowRight className="w-5 h-5 text-white" />
            </div>
          </button>

          {/* 2. FIND RECYCLER */}
          <button
            type="button"
            onClick={() => setActiveScreen('RECYCLER_DIRECTORY')}
            className={`w-full text-left bg-white hover:bg-slate-50 text-slate-900 rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between active:scale-98 transition-all ${
              collector.simpleMode ? 'py-5' : ''
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-sky-100 text-sky-800 flex items-center justify-center">
                <Search className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {t('findRecycler', language)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {t('findRecyclerSub', language)}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* 3. MY LOTS */}
          <button
            type="button"
            onClick={() => setActiveScreen('MY_LOTS')}
            className={`w-full text-left bg-white hover:bg-slate-50 text-slate-900 rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between active:scale-98 transition-all ${
              collector.simpleMode ? 'py-5' : ''
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {t('myLots', language)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {t('myLotsSub', language)}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>

          {/* 4. EARNINGS */}
          <button
            type="button"
            onClick={() => setActiveScreen('EARNINGS')}
            className={`w-full text-left bg-white hover:bg-slate-50 text-slate-900 rounded-2xl p-4 border border-slate-200 shadow-2xs flex items-center justify-between active:scale-98 transition-all ${
              collector.simpleMode ? 'py-5' : ''
            }`}
          >
            <div className="flex items-center gap-3.5">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <span className="text-base font-extrabold text-slate-900 block">
                  {t('earnings', language)}
                </span>
                <span className="text-xs text-slate-500 font-medium">
                  {t('earningsSub', language)}
                </span>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        {/* Large Voice Assistant Strip (Requirement 17: Voice Assistant) */}
        <div 
          onClick={() => setVoiceModalOpen(true)}
          className="p-4 bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl shadow-md cursor-pointer border border-emerald-800 flex items-center justify-between active:scale-98 transition-all"
        >
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-emerald-600 flex items-center justify-center shadow-md animate-pulse">
              <Mic className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-sm font-black text-white block">
                {t('voiceAssistantBanner', language)}
              </span>
              <span className="text-xs text-emerald-200 font-medium">
                {t('voiceAssistantPrompt', language)}
              </span>
            </div>
          </div>
          <span className="text-xs bg-white/20 text-white font-extrabold px-3 py-1.5 rounded-xl">
            {t('speak', language)}
          </span>
        </div>

        {/* Safety Guide Strip (Requirement 14: Safety Assistant) */}
        <div 
          onClick={() => setActiveScreen('SAFETY')}
          className="p-3.5 bg-amber-50 rounded-2xl border border-amber-200 flex items-center justify-between cursor-pointer hover:bg-amber-100/60 transition-colors"
        >
          <div className="flex items-center gap-3">
            <ShieldAlert className="w-6 h-6 text-amber-600 shrink-0" />
            <div>
              <span className="text-xs font-black text-amber-950 block">
                {t('safetyNotice', language)}
              </span>
              <span className="text-[11px] text-amber-800 font-medium">
                Do not dismantle batteries • Never burn e-waste cables
              </span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-amber-600" />
        </div>

        {/* Formal Recycling Impact Pill */}
        <div 
          onClick={() => setActiveScreen('IMPACT')}
          className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between cursor-pointer text-xs"
        >
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-slate-600 font-medium">
              Formal diversion: <strong className="text-emerald-800 font-black">{totalWeightFormalized} kg scrap</strong>
            </span>
          </div>
          <span className="text-emerald-700 font-extrabold flex items-center gap-1 text-[11px]">
            View Impact <ChevronRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>

      <VoiceAssistantModal
        isOpen={voiceModalOpen}
        onClose={() => setVoiceModalOpen(false)}
        onResult={handleVoiceResult}
      />
    </div>
  );
};
