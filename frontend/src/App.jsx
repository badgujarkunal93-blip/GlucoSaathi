import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import StagePatientInput from './components/pipeline/StagePatientInput';
import PipelineProcessingView from './components/pipeline/PipelineProcessingView';
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
import InteractiveCrossGrid from './components/background/InteractiveCrossGrid';
import { ArrowRight, RotateCcw } from 'lucide-react';
import Lenis from 'lenis';

function MainContent() {
  const { 
    pipelineStep,
    setPipelineStep,
    pipelineStatus,
    pipelineError,
    startAnalysis,
    resetAnalysis,
    unlockedStages,
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

  const handleNavigate = (step) => {
    setPipelineStep(step);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderActiveView = () => {
    if (pipelineStep === 'processing') {
      return (
        <PipelineProcessingView 
          pipelineStatus={pipelineStatus}
          error={pipelineError}
          onRetry={() => startAnalysis()}
          onComplete={() => handleNavigate('risk')}
        />
      );
    }

    switch (pipelineStep) {
      case 'input':
        return <StagePatientInput />;
      case 'analysis':
        return (
          <div className="space-y-8">
            <LogMeal onNavigate={handleNavigate} />
            <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-[#063F3D]">
                Step 02 of 06 Complete: Meal Carbohydrates Resolved
              </span>
              <button
                onClick={() => handleNavigate('risk')}
                className="px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-xs"
              >
                <span>Proceed to Risk Prediction</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'risk':
        return (
          <div className="space-y-8">
            <RiskCheck onNavigate={handleNavigate} />
            <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-[#063F3D]">
                Step 03 of 06 Complete: Near-Term Hypoglycemia Risk Predicted
              </span>
              <button
                onClick={() => handleNavigate('dashboard')}
                className="px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-xs"
              >
                <span>Proceed to Health Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'dashboard':
        return (
          <div className="space-y-8">
            <Dashboard onNavigate={handleNavigate} />
            <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-[#063F3D]">
                Step 04 of 06 Complete: Health Trends Synthesized
              </span>
              <button
                onClick={() => handleNavigate('journal')}
                className="px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-xs"
              >
                <span>Proceed to Health Journal</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      case 'journal':
        return (
          <div className="space-y-8">
            <History onNavigate={handleNavigate} />
            <div className="p-4 rounded-2xl bg-white border border-black/8 shadow-xs flex items-center justify-between">
              <span className="text-xs font-bold text-[#063F3D]">
                Step 05 of 06 Complete: Longitudinal Timeline Updated
              </span>
              <button
                onClick={() => setIsDoctorReportModalOpen(true)}
                className="px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold flex items-center space-x-1.5 shadow-xs"
              >
                <span>Generate Doctor Report</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        );
      default:
        return <StagePatientInput />;
    }
  };

  return (
    <div className="min-h-screen relative overflow-x-hidden bg-[#F7F8F5] text-[#111817] flex flex-col justify-between selection:bg-[#1E9E67]/20 selection:text-[#075B57] font-sans">
      {/* 0. Subtle Medical Telemetry Interactive Cross Grid (Sits at z-0 behind content) */}
      <InteractiveCrossGrid 
        crossSize={5.5}
        strokeWidth={1.1}
        interactionRadius={130}
        maxDisplacement={8}
        springStrength={0.08}
        damping={0.82}
        baseOpacity={0.09}
        activeColor="#075B57"
        accentColor="#1E9E67"
        enableRipple={true}
        enableConnections={true}
        enableCursorGlow={true}
      />

      {/* 1. Sequential Pipeline Stepper Top Header (z-50) */}
      <Navbar 
        onOpenDoctorReport={() => setIsDoctorReportModalOpen(true)}
        onOpenSettings={() => setIsUserProfileOpen(true)}
      />

      {/* 2. Main Application Content Container (z-10, max width 1440px / 7xl) */}
      <main className="relative z-10 flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 pb-12">
        {renderActiveView()}
      </main>

      {/* 3. Responsive Mobile Bottom Navigation */}
      <BottomNav 
        activeTab={pipelineStep} 
        setActiveTab={handleNavigate} 
      />

      {/* 4. Editorial Application Footer */}
      <Footer onNavigate={handleNavigate} />

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
