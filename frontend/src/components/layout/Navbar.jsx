import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  Utensils, 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  User, 
  Menu, 
  X,
  AlertOctagon,
  Sparkles,
  BookOpen,
  UploadCloud,
  Cpu,
  Lock,
  Check,
  RotateCcw
} from 'lucide-react';

export default function Navbar({ onOpenDoctorReport, onOpenSettings }) {
  const { 
    patientState,
    mlStatus,
    dataMode,
    setDataMode,
    setIsCSVImportOpen,
    setIsUserProfileOpen,
    pipelineStep,
    setPipelineStep,
    unlockedStages,
    resetAnalysis,
    pipelineStatus
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const pipelineStages = [
    { id: 'input', label: '01 Input', fullLabel: 'Patient Input', icon: Activity },
    { id: 'analysis', label: '02 AI Analysis', fullLabel: 'Meal & Nutrition', icon: Utensils },
    { id: 'risk', label: '03 Risk', fullLabel: 'Risk Prediction', icon: ShieldCheck },
    { id: 'dashboard', label: '04 Health', fullLabel: 'Health Dashboard', icon: LayoutDashboard },
    { id: 'journal', label: '05 Journal', fullLabel: 'Health Journal', icon: BookOpen },
    { id: 'report', label: '06 Report', fullLabel: 'Doctor Report', icon: FileText },
  ];

  const isEmergency = patientState.glucose < 70 || patientState.isEmergencyHypo;
  const isCompleted = unlockedStages.length > 1 && pipelineStatus === 'COMPLETE';

  const handleStageClick = (stageId) => {
    if (!unlockedStages.includes(stageId)) return;
    if (stageId === 'report') {
      onOpenDoctorReport();
    } else {
      setPipelineStep(stageId);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F8F5]/95 backdrop-blur-md border-b border-black/8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[72px] flex items-center justify-between gap-4">
          
          {/* 1. Left: Brand Identity */}
          <div 
            onClick={() => setPipelineStep('input')}
            className="flex items-center space-x-3 cursor-pointer group shrink-0"
          >
            <div className="w-9 h-9 rounded-xl bg-[#075B57] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-[#DFF4E8]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black text-[#063F3D] font-display tracking-tight">
                  Gluco<span className="text-[#1E9E67]">Saathi</span>
                </span>
                <span className="text-[10px] font-bold text-[#66716F] hidden md:inline">
                  ग्लूको-साथी
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#075B57] tracking-wider uppercase">
                Clinical Decision Pipeline
              </span>
            </div>
          </div>

          {/* 2. Center: Sequential Pipeline Stepper */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#F3F1EA] p-1 rounded-xl border border-black/5">
            {pipelineStages.map((stage, idx) => {
              const isUnlocked = unlockedStages.includes(stage.id);
              const isActive = pipelineStep === stage.id;
              const isDone = isUnlocked && pipelineStep !== stage.id && pipelineStatus === 'COMPLETE';

              return (
                <button
                  key={stage.id}
                  onClick={() => handleStageClick(stage.id)}
                  disabled={!isUnlocked}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-white text-[#075B57] shadow-xs font-extrabold ring-1 ring-[#075B57]/15'
                      : isUnlocked
                        ? 'text-[#063F3D] hover:bg-white/60 cursor-pointer'
                        : 'text-[#66716F]/50 cursor-not-allowed opacity-60'
                  }`}
                  title={!isUnlocked ? 'Stage locked — complete previous steps first' : stage.fullLabel}
                >
                  {isDone ? (
                    <span className="w-4 h-4 rounded-full bg-[#1E9E67]/20 text-[#1E9E67] flex items-center justify-center text-[10px] font-black">
                      ✓
                    </span>
                  ) : !isUnlocked ? (
                    <Lock className="w-3 h-3 text-[#66716F]/40" />
                  ) : (
                    <span className="w-1.5 h-1.5 rounded-full bg-[#075B57]" />
                  )}
                  <span>{stage.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Right: AI Model Status, New Analysis & Settings */}
          <div className="hidden sm:flex items-center space-x-2 shrink-0">
            
            {/* Reset / New Analysis Button when pipeline is complete */}
            {isCompleted && (
              <button
                onClick={resetAnalysis}
                className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-xs font-bold text-[#063F3D] flex items-center space-x-1 transition-all shadow-xs"
                title="Start New Patient Analysis"
              >
                <RotateCcw className="w-3.5 h-3.5 text-[#075B57]" />
                <span className="hidden xl:inline">New Analysis</span>
              </button>
            )}

            {/* Live Model Connection Indicator */}
            <div 
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center space-x-1.5 transition-all ${
                mlStatus === 'online'
                  ? 'bg-[#DFF4E8] text-[#075B57] border-[#B8E8D2]'
                  : 'bg-[#FEF7E6] text-[#8D4023] border-[#FFE280]'
              }`}
              title={mlStatus === 'online' ? 'Python FastAPI LightGBM Service Connected' : 'Local Deterministic Engine Running'}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: mlStatus === 'online' ? '#1E9E67' : '#F2B84B' }} />
              <span className="hidden xl:inline">
                {mlStatus === 'online' ? 'AI Model Online' : 'Local Engine'}
              </span>
            </div>

            {/* Profile Settings Trigger */}
            <button
              onClick={() => setIsUserProfileOpen(true)}
              className="w-8 h-8 rounded-xl bg-white border border-black/10 hover:border-[#075B57] flex items-center justify-center text-[#075B57] transition-all shadow-xs"
              title="My Clinical Profile Settings"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-black/10 text-[#075B57]"
              aria-label="Toggle pipeline menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/8 bg-white p-4 shadow-lg animate-fade-in space-y-3">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#66716F] block pb-1">
              Decision-Support Pipeline Stages
            </span>
            <div className="grid grid-cols-2 gap-2">
              {pipelineStages.map((stage) => {
                const isUnlocked = unlockedStages.includes(stage.id);
                const isActive = pipelineStep === stage.id;

                return (
                  <button
                    key={stage.id}
                    disabled={!isUnlocked}
                    onClick={() => {
                      handleStageClick(stage.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`p-2.5 rounded-xl text-left text-xs font-bold flex items-center space-x-2 ${
                      isActive 
                        ? 'bg-[#DFF4E8] text-[#075B57] font-extrabold' 
                        : isUnlocked
                          ? 'bg-[#F7F8F5] text-[#063F3D]'
                          : 'bg-[#F7F8F5]/50 text-[#66716F]/40 cursor-not-allowed'
                    }`}
                  >
                    {!isUnlocked ? (
                      <Lock className="w-3.5 h-3.5 text-[#66716F]/40" />
                    ) : (
                      <Check className="w-3.5 h-3.5 text-[#1E9E67]" />
                    )}
                    <span>{stage.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
