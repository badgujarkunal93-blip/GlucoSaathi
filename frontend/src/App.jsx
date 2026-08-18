import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import LandingJourney from './components/landing/LandingJourney';
import Dashboard from './components/Dashboard';
import LogMeal from './components/LogMeal';
import RiskCheck from './components/RiskCheck';
import History from './components/History';
import SettingsModal from './components/SettingsModal';
import LogGlucoseModal from './components/LogGlucoseModal';
import LogInsulinModal from './components/LogInsulinModal';
import LogActivityModal from './components/LogActivityModal';
import DoctorReportModal from './components/DoctorReportModal';
import Lenis from 'lenis';

function MainContent() {
  const { 
    currentView, 
    navigateTo,
    isSettingsOpen,
    setIsSettingsOpen,
    isGlucoseModalOpen, 
    setIsGlucoseModalOpen,
    isInsulinModalOpen,
    setIsInsulinModalOpen,
    isActivityModalOpen,
    setIsActivityModalOpen,
    isDoctorReportModalOpen,
    setIsDoctorReportModalOpen,
    applyPresetScenario
  } = useApp();

  const [activeTab, setActiveTab] = useState('story');

  // Initialize Lenis Smooth Scroll
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  // Sync context navigation with activeTab
  const handleTabSwitch = (tab) => {
    setActiveTab(tab);
    if (tab === 'meal') navigateTo('log-meal');
    else if (tab === 'risk') navigateTo('risk-check');
    else if (tab === 'dashboard') navigateTo('dashboard');
    else if (tab === 'history') navigateTo('history');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartDemo = () => {
    applyPresetScenario('MODERATE_CAUTION');
    handleTabSwitch('dashboard');
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'story':
        return (
          <LandingJourney 
            onNavigate={handleTabSwitch}
            onStartDemo={handleStartDemo}
          />
        );
      case 'meal':
        return <LogMeal />;
      case 'risk':
        return <RiskCheck />;
      case 'dashboard':
        return <Dashboard />;
      case 'history':
        return <History />;
      default:
        return (
          <LandingJourney 
            onNavigate={handleTabSwitch}
            onStartDemo={handleStartDemo}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#111817] flex flex-col justify-between selection:bg-[#1E9E67]/20 selection:text-[#075B57] font-sans">
      {/* 1. Floating Editorial Navbar */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabSwitch}
        onOpenDoctorReport={() => setIsDoctorReportModalOpen(true)}
        onOpenSettings={() => setIsSettingsOpen(true)}
      />

      {/* 2. Main Canvas View */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        {renderActiveView()}
      </main>

      {/* 3. Editorial Footer */}
      <Footer onNavigate={handleTabSwitch} />

      {/* 4. Clinical Modals & Drawers */}
      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
      />

      <LogGlucoseModal 
        isOpen={isGlucoseModalOpen} 
        onClose={() => setIsGlucoseModalOpen(false)} 
      />

      <LogInsulinModal 
        isOpen={isInsulinModalOpen} 
        onClose={() => setIsInsulinModalOpen(false)} 
      />

      <LogActivityModal 
        isOpen={isActivityModalOpen} 
        onClose={() => setIsActivityModalOpen(false)} 
      />

      <DoctorReportModal 
        isOpen={isDoctorReportModalOpen} 
        onClose={() => setIsDoctorReportModalOpen(false)} 
      />
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
