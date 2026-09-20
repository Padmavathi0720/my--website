import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Language, 
  UserRole, 
  CollectorProfile, 
  Recycler, 
  Lot, 
  LotStatus, 
  PaymentMethod,
  NotificationItem 
} from '../types';
import { 
  SEEDED_COLLECTORS, 
  SEEDED_RECYCLERS, 
  INITIAL_LOTS, 
  INITIAL_NOTIFICATIONS 
} from '../data/mockData';
import { ttsService } from '../services/ttsService';
import { LocalizedAudioText } from '../i18n/audioScripts';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  collector: CollectorProfile;
  updateCollector: (patch: Partial<CollectorProfile>) => void;
  recyclers: Recycler[];
  lots: Lot[];
  notifications: NotificationItem[];
  unreadNotifsCount: number;
  markNotificationRead: (id: string) => void;
  isOffline: boolean;
  setIsOffline: (val: boolean) => void;
  pendingSyncCount: number;
  createLot: (newLotData: Partial<Lot>) => Lot;
  updateLotStatus: (lotId: string, status: LotStatus, note: string, actor: string) => void;
  markLotPaid: (lotId: string, paymentMethod: PaymentMethod) => void;
  syncOfflineData: () => void;
  resetDemoData: () => void;
  speakText: (text: string | LocalizedAudioText, overrideLang?: Language) => void;
  isSpeaking: boolean;
  activeScreen: string;
  setActiveScreen: (screen: string) => void;
  selectedLotId: string | null;
  setSelectedLotId: (id: string | null) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY_LOTS = 'kc_app_lots_v1';
const LOCAL_STORAGE_KEY_COLLECTOR = 'kc_app_collector_v1';
const LOCAL_STORAGE_KEY_OFFLINE = 'kc_app_offline_v1';

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>('collector');
  const [language, setLanguage] = useState<Language>('en');
  const [collector, setCollector] = useState<CollectorProfile>(SEEDED_COLLECTORS[0]);
  const [recyclers, setRecyclers] = useState<Recycler[]>(SEEDED_RECYCLERS);
  const [lots, setLots] = useState<Lot[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY_LOTS);
      if (saved) return JSON.parse(saved);
    } catch {
      // Fallback
    }
    return INITIAL_LOTS;
  });
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [isOffline, setIsOfflineState] = useState<boolean>(false);
  const [pendingSyncCount, setPendingSyncCount] = useState<number>(0);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const [activeScreen, setActiveScreen] = useState<string>('SPLASH');
  const [selectedLotId, setSelectedLotId] = useState<string | null>(null);

  // Sync to local storage for realistic offline-first persistent capability
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY_LOTS, JSON.stringify(lots));
    } catch {
      // ignore
    }
  }, [lots]);

  // Subscribe to TTS status
  useEffect(() => {
    const unsub = ttsService.addListener((speaking) => {
      setIsSpeaking(speaking);
    });
    return unsub;
  }, []);

  const setIsOffline = (val: boolean) => {
    setIsOfflineState(val);
    if (!val && pendingSyncCount > 0) {
      syncOfflineData();
    }
  };

  const updateCollector = (patch: Partial<CollectorProfile>) => {
    setCollector(prev => ({ ...prev, ...patch }));
    if (patch.language) {
      setLanguage(patch.language);
    }
  };

  const markNotificationRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const unreadNotifsCount = notifications.filter(n => !n.read).length;

  const createLot = (newLotData: Partial<Lot>): Lot => {
    const lotCounter = lots.length + 125;
    const lotId = `KC-2026-${String(lotCounter).padStart(6, '0')}`;
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const todayDate = new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

    const newLot: Lot = {
      id: lotId,
      collectorId: collector.id,
      collectorName: collector.name,
      collectorPhone: collector.phone,
      collectorArea: collector.area,
      material: newLotData.material || 'E-waste',
      subCategory: newLotData.subCategory || 'Mixed Electronic Scrap',
      weightKg: newLotData.weightKg || 12,
      photoUrl: newLotData.photoUrl || 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?auto=format&fit=crop&w=600&q=80',
      aiDetected: newLotData.aiDetected || 'Mixed Electronic Scrap (Confidence 87%)',
      aiConfidence: newLotData.aiConfidence || 87,
      alternativeOptions: newLotData.alternativeOptions || ['Computer parts', 'Household appliances'],
      estimatedPriceMin: newLotData.estimatedPriceMin || 3360,
      estimatedPriceMax: newLotData.estimatedPriceMax || 4080,
      finalPricePerKg: newLotData.finalPricePerKg || 320,
      totalAmount: newLotData.totalAmount || Math.round((newLotData.weightKg || 12) * 320),
      recyclerId: newLotData.recyclerId,
      recyclerName: newLotData.recyclerName,
      status: newLotData.status || 'CREATED',
      paymentMethod: newLotData.paymentMethod || 'UPI',
      paymentStatus: 'PENDING',
      isOfflineCreated: isOffline,
      createdAt: `${todayDate}, ${nowTime}`,
      qrPayload: `${lotId}|${newLotData.material || 'E-WASTE'}|${newLotData.weightKg || 12}KG|${collector.name}`,
      timeline: [
        {
          status: 'CREATED',
          timestamp: nowTime,
          note: isOffline ? 'Saved to phone storage (Offline Mode Queue)' : 'Scrap lot registered with AI verification',
          actor: `Collector (${collector.name})`,
          verified: true,
          locationStamp: '19.0434° N, 72.8567° E (Dharavi Ward)',
        },
        ...(newLotData.recyclerName ? [{
          status: 'RECYCLER_ACCEPTED' as LotStatus,
          timestamp: nowTime,
          note: `Auto-matched & approved by ${newLotData.recyclerName}`,
          actor: newLotData.recyclerName,
          verified: true,
        }] : [])
      ]
    };

    setLots(prev => [newLot, ...prev]);

    if (isOffline) {
      setPendingSyncCount(c => c + 1);
    }

    // Add alert notification
    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: isOffline ? 'Lot Saved in Offline Storage' : 'New Scrap Lot Published',
        message: `Lot ${lotId} (${newLot.weightKg} kg ${newLot.material}) is registered and traceable.`,
        timestamp: 'Just now',
        type: isOffline ? 'sync' : 'accept',
        read: false,
        lotId,
      },
      ...prev
    ]);

    return newLot;
  };

  const updateLotStatus = (lotId: string, status: LotStatus, note: string, actor: string) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLots(prev =>
      prev.map(lot => {
        if (lot.id !== lotId) return lot;
        return {
          ...lot,
          status,
          timeline: [
            ...lot.timeline,
            {
              status,
              timestamp: nowTime,
              note,
              actor,
              verified: true,
              locationStamp: '19.0434° N, 72.8567° E (Geo-stamped Handover)',
              hashSignature: `0x${Math.random().toString(16).substring(2, 10)}...`
            }
          ]
        };
      })
    );

    // Push notification for key changes
    if (status === 'HANDED_OVER') {
      setNotifications(prev => [
        {
          id: `NOTIF-${Date.now()}`,
          title: 'Handover Certificate Confirmed',
          message: `Digital handover completed for ${lotId}. Awaiting final payment disbursement.`,
          timestamp: 'Just now',
          type: 'pickup',
          read: false,
          lotId
        },
        ...prev
      ]);
    }
  };

  const markLotPaid = (lotId: string, paymentMethod: PaymentMethod) => {
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    setLots(prev =>
      prev.map(lot => {
        if (lot.id !== lotId) return lot;
        const total = lot.totalAmount || Math.round(lot.weightKg * (lot.finalPricePerKg || 320));
        return {
          ...lot,
          status: 'PAID',
          paymentStatus: 'PAID',
          paymentMethod,
          totalAmount: total,
          timeline: [
            ...lot.timeline,
            {
              status: 'PAID',
              timestamp: nowTime,
              note: `Payment of ₹${total.toLocaleString()} settled via ${paymentMethod} to ${lot.collectorName}.`,
              actor: 'Recycler Payout Desk',
              verified: true,
              hashSignature: `0x${Math.random().toString(16).substring(2, 10)}...`
            }
          ]
        };
      })
    );

    setNotifications(prev => [
      {
        id: `NOTIF-${Date.now()}`,
        title: 'Payment Received! ₹3,840',
        message: `Settled via ${paymentMethod} for Lot ${lotId}. Digital tax receipt saved.`,
        timestamp: 'Just now',
        type: 'payment',
        read: false,
        lotId
      },
      ...prev
    ]);
  };

  const syncOfflineData = () => {
    if (pendingSyncCount === 0) return;
    setTimeout(() => {
      setLots(prev => prev.map(l => ({ ...l, isOfflineCreated: false })));
      setPendingSyncCount(0);
      setIsOfflineState(false);
      setNotifications(prev => [
        {
          id: `NOTIF-${Date.now()}`,
          title: 'Offline Sync Completed',
          message: 'All local lots and photos successfully synchronized with the cloud network.',
          timestamp: 'Just now',
          type: 'sync',
          read: false,
        },
        ...prev
      ]);
    }, 1000);
  };

  const resetDemoData = () => {
    setLots(INITIAL_LOTS);
    setRecyclers(SEEDED_RECYCLERS);
    setCollector(SEEDED_COLLECTORS[0]);
    setNotifications(INITIAL_NOTIFICATIONS);
    setIsOfflineState(false);
    setPendingSyncCount(0);
    localStorage.removeItem(LOCAL_STORAGE_KEY_LOTS);
  };

  const speakText = (text: string | LocalizedAudioText, overrideLang?: Language) => {
    const targetLang = overrideLang || language;
    let spoken = '';
    if (typeof text === 'object' && text !== null) {
      spoken = text[targetLang] || text.en || '';
    } else {
      spoken = text;
    }
    if (!spoken) return;
    ttsService.speak(spoken, targetLang);
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        collector,
        updateCollector,
        recyclers,
        lots,
        notifications,
        unreadNotifsCount,
        markNotificationRead,
        isOffline,
        setIsOffline,
        pendingSyncCount,
        createLot,
        updateLotStatus,
        markLotPaid,
        syncOfflineData,
        resetDemoData,
        speakText,
        isSpeaking,
        activeScreen,
        setActiveScreen,
        selectedLotId,
        setSelectedLotId,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};
