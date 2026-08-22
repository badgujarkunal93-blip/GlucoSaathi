import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Overview from './components/Overview';
import Dashboard from './components/Dashboard';
import LogMeal from './components/LogMeal';
import RiskCheck from './components/RiskCheck';
import History from './components/History';
import BottomNav from './components/BottomNav';
import SettingsModal from './components/SettingsModal';
import UserProfileModal from './components/UserProfileModal';
import CSVImportModal from './components/CSVImportModal';
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
    isCSVImportOpen,
    setIsCSVImportOpen,
    isUserProfileOpen,
    setIsUserProfileOpen
  } = useApp();

  const [activeTab, setActiveTab] = useState('overview');

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
    else if (tab === 'journal') navigateTo('history');
    else navigateTo('overview');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview onNavigate={handleTabSwitch} />;
      case 'meal':
        return <LogMeal onNavigate={handleTabSwitch} />;
      case 'risk':
        return <RiskCheck onNavigate={handleTabSwitch} />;
      case 'dashboard':
        return <Dashboard onNavigate={handleTabSwitch} />;
      case 'journal':
        return <History onNavigate={handleTabSwitch} />;
      default:
        return <Overview onNavigate={handleTabSwitch} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8F5] text-[#111817] flex flex-col justify-between selection:bg-[#1E9E67]/20 selection:text-[#075B57] font-sans">
      {/* 1. Professional Healthcare Top Header */}
      <Navbar 
        activeTab={activeTab} 
        setActiveTab={handleTabSwitch}
        onOpenDoctorReport={() => setIsDoctorReportModalOpen(true)}
        onOpenSettings={() => setIsUserProfileOpen(true)}
      />

      {/* 2. Main Application Content Container (Max width 1440px / 7xl) */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {renderActiveView()}
      </main>

      {/* 3. Responsive Mobile Bottom Navigation */}
      <BottomNav 
        activeTab={activeTab} 
        setActiveTab={handleTabSwitch} 
      />

      {/* 4. Editorial Application Footer */}
      <Footer onNavigate={handleTabSwitch} />

      {/* 5. Clinical Modals & Drawers */}
      <UserProfileModal 
        isOpen={isUserProfileOpen} 
        onClose={() => setIsUserProfileOpen(false)} 
      />

      <CSVImportModal 
        isOpen={isCSVImportOpen} 
        onClose={() => setIsCSVImportOpen(false)} 
      />

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
