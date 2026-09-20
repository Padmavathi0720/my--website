import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { AndroidDeviceShell } from './components/AndroidDeviceShell';
import { SplashScreen } from './screens/SplashScreen';
import { LanguageScreen } from './screens/LanguageScreen';
import { LoginScreen } from './screens/LoginScreen';
import { HomeScreen } from './screens/HomeScreen';
import { AddMaterialFlow } from './screens/AddMaterialFlow';
import { PriceEstimateScreen } from './screens/PriceEstimateScreen';
import { RecyclerMatchScreen } from './screens/RecyclerMatchScreen';
import { LotDetailScreen } from './screens/LotDetailScreen';
import { MyLotsScreen } from './screens/MyLotsScreen';
import { EarningsScreen } from './screens/EarningsScreen';
import { RecyclerDirectoryScreen } from './screens/RecyclerDirectoryScreen';
import { SafetyAssistantScreen } from './screens/SafetyAssistantScreen';
import { RecyclerPortalScreen } from './screens/RecyclerPortalScreen';
import { ImpactDashboardScreen } from './screens/ImpactDashboardScreen';
import { 
  Home, 
  PlusCircle, 
  Package, 
  Search, 
  Wallet,
  Globe,
  RotateCcw
} from 'lucide-react';
import { Lot } from './types';

const MainAppContent: React.FC = () => {
  const { 
    activeScreen, 
    setActiveScreen, 
    role, 
    selectedLotId, 
    setSelectedLotId 
  } = useApp();

  const [draftLot, setDraftLot] = useState<any>(null);

  // If user role is switched to 'recycler', show Recycler Facility Portal
  if (role === 'recycler') {
    return <RecyclerPortalScreen />;
  }

  const renderScreen = () => {
    switch (activeScreen) {
      case 'SPLASH':
        return <SplashScreen />;

      case 'LANGUAGE_SELECT':
        return <LanguageScreen />;

      case 'LOGIN':
        return <LoginScreen />;

      case 'HOME':
        return <HomeScreen />;

      case 'ADD_MATERIAL':
        return (
          <AddMaterialFlow
            onComplete={(draft) => {
              setDraftLot(draft);
              setActiveScreen('PRICE_ESTIMATE');
            }}
            onCancel={() => setActiveScreen('HOME')}
          />
        );

      case 'PRICE_ESTIMATE':
        return (
          <PriceEstimateScreen
            draftLot={draftLot || {
              material: 'E-waste',
              subCategory: 'Mixed Electronic Scrap',
              weightKg: 12,
              estimatedPriceMin: 3360,
              estimatedPriceMax: 4080,
            }}
            onProceedToRecyclers={() => setActiveScreen('RECYCLER_MATCH')}
            onBack={() => setActiveScreen('ADD_MATERIAL')}
          />
        );

      case 'RECYCLER_MATCH':
        return (
          <RecyclerMatchScreen
            draftLot={draftLot || {
              material: 'E-waste',
              subCategory: 'Mixed Electronic Scrap',
              weightKg: 12,
              estimatedPriceMin: 3360,
              estimatedPriceMax: 4080,
            }}
            onLotCreated={(newLot: Lot) => {
              setSelectedLotId(newLot.id);
              setActiveScreen('LOT_DETAIL');
            }}
            onBack={() => setActiveScreen('PRICE_ESTIMATE')}
          />
        );

      case 'LOT_DETAIL':
        return (
          <LotDetailScreen
            lotId={selectedLotId || 'KC-2026-000124'}
            onBack={() => setActiveScreen('MY_LOTS')}
          />
        );

      case 'MY_LOTS':
        return (
          <MyLotsScreen
            onSelectLot={(id) => {
              setSelectedLotId(id);
              setActiveScreen('LOT_DETAIL');
            }}
            onBack={() => setActiveScreen('HOME')}
          />
        );

      case 'EARNINGS':
        return <EarningsScreen onBack={() => setActiveScreen('HOME')} />;

      case 'RECYCLER_DIRECTORY':
        return <RecyclerDirectoryScreen onBack={() => setActiveScreen('HOME')} />;

      case 'SAFETY':
        return <SafetyAssistantScreen onBack={() => setActiveScreen('HOME')} />;

      case 'IMPACT':
        return <ImpactDashboardScreen onBack={() => setActiveScreen('HOME')} />;

      default:
        return <HomeScreen />;
    }
  };

  // Hide bottom navigation on Splash and Onboarding screens
  const showBottomNav = activeScreen !== 'SPLASH' && activeScreen !== 'LANGUAGE_SELECT' && activeScreen !== 'LOGIN';

  return (
    <div className="flex-1 flex flex-col relative overflow-hidden">
      {/* Active Screen View */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        {renderScreen()}
      </div>

      {/* Android Bottom Navigation Bar */}
      {showBottomNav && (
        <nav 
          aria-label="Main Navigation"
          className="absolute bottom-0 left-0 right-0 bg-white/95 backdrop-blur-md border-t border-slate-200 px-3 py-2 flex items-center justify-around z-40 shadow-lg"
        >
          <button
            type="button"
            onClick={() => setActiveScreen('HOME')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeScreen === 'HOME' ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Home className="w-5 h-5" />
            <span>Home</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('ADD_MATERIAL')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeScreen === 'ADD_MATERIAL' || activeScreen === 'PRICE_ESTIMATE' || activeScreen === 'RECYCLER_MATCH'
                ? 'text-emerald-800'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <div className="w-9 h-9 -mt-3.5 rounded-full bg-emerald-700 text-white flex items-center justify-center shadow-md hover:bg-emerald-800 transition-colors">
              <PlusCircle className="w-5 h-5" />
            </div>
            <span className="mt-0.5">Sell</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('MY_LOTS')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeScreen === 'MY_LOTS' || activeScreen === 'LOT_DETAIL' ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Package className="w-5 h-5" />
            <span>Lots</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('RECYCLER_DIRECTORY')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeScreen === 'RECYCLER_DIRECTORY' ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Search className="w-5 h-5" />
            <span>Buyers</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveScreen('EARNINGS')}
            className={`flex flex-col items-center gap-0.5 text-[10px] font-bold transition-colors ${
              activeScreen === 'EARNINGS' ? 'text-emerald-800' : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            <Wallet className="w-5 h-5" />
            <span>Payouts</span>
          </button>
        </nav>
      )}
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AndroidDeviceShell>
        <MainAppContent />
      </AndroidDeviceShell>
    </AppProvider>
  );
}
