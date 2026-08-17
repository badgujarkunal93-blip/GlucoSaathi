import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import Dashboard from './components/Dashboard';
import LogMeal from './components/LogMeal';
import RiskCheck from './components/RiskCheck';
import History from './components/History';
import SettingsModal from './components/SettingsModal';

function MainContent() {
  const { currentView } = useApp();

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'log-meal':
        return <LogMeal />;
      case 'risk-check':
        return <RiskCheck />;
      case 'history':
        return <History />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F4] text-[#172640] flex flex-col justify-center p-0 lg:p-6 xl:p-8 selection:bg-teal-500/20 selection:text-teal-900">
      {/* Light Refined Healthcare Workspace Container with 18px Architectural Radius */}
      <div className="w-full max-w-[1440px] mx-auto min-h-screen lg:min-h-[860px] lg:max-h-[940px] lg:h-[92vh] flex flex-col lg:flex-row bg-[#FFFFFF] lg:rounded-[18px] lg:border lg:border-[#E2E8DF] shell-elevation overflow-hidden relative">
        {/* Left Refined Health Companion Sidebar */}
        <Sidebar />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#FAFBF8] overflow-hidden">
          {/* Light Header */}
          <Header />

          {/* Scrollable Content Canvas */}
          <main className="flex-1 overflow-y-auto px-4 sm:px-8 lg:px-10 py-6 lg:py-8">
            <div className="max-w-5xl mx-auto">
              {renderCurrentView()}
            </div>
          </main>
        </div>
      </div>

      {/* Floating Bottom Navigation (Mobile 390px) */}
      <BottomNav />

      {/* Profile & Regimen Settings Modal */}
      <SettingsModal />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
