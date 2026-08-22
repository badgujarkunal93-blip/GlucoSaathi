import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  Utensils, 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  User, 
  Zap, 
  Menu, 
  X,
  AlertOctagon,
  Sparkles,
  BookOpen,
  UploadCloud,
  Cpu
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenDoctorReport, onOpenSettings }) {
  const { 
    currentPersona, 
    switchPersona, 
    DEMO_PERSONAS, 
    patientState,
    mlStatus,
    dataMode,
    setDataMode,
    setIsCSVImportOpen,
    setIsUserProfileOpen
  } = useApp();

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'overview', label: 'Overview', icon: Sparkles },
    { id: 'meal', label: 'Meal Analyzer', icon: Utensils },
    { id: 'risk', label: 'Risk Prediction', icon: ShieldCheck },
    { id: 'dashboard', label: 'Health Dashboard', icon: LayoutDashboard },
    { id: 'journal', label: 'Health Journal', icon: BookOpen },
    { id: 'report', label: 'Doctor Report', icon: FileText },
  ];

  const isEmergency = patientState.glucose < 70 || patientState.isEmergencyHypo;

  return (
    <header className="sticky top-0 z-50 bg-[#F7F8F5]/95 backdrop-blur-md border-b border-black/8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[72px] flex items-center justify-between gap-4">
          
          {/* 1. Left: Brand Identity */}
          <div 
            onClick={() => setActiveTab('overview')}
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
                T1D Clinical Decision Support
              </span>
            </div>
          </div>

          {/* 2. Center: Desktop Tab Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 bg-[#F3F1EA] p-1 rounded-xl border border-black/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'report') {
                      onOpenDoctorReport();
                    } else {
                      setActiveTab(item.id);
                    }
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-white text-[#075B57] shadow-xs font-extrabold'
                      : 'text-[#66716F] hover:text-[#111817] hover:bg-white/60'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1E9E67]' : 'text-[#66716F]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 3. Right: AI Model Status, Data Mode & Emergency Status */}
          <div className="hidden sm:flex items-center space-x-2 shrink-0">
            
            {/* Live Model Connection Indicator */}
            <div 
              className={`px-2 py-1 rounded-lg border text-[11px] font-bold flex items-center space-x-1.5 transition-all ${
                mlStatus === 'online'
                  ? 'bg-[#DFF4E8] text-[#075B57] border-[#B8E8D2]'
                  : 'bg-[#FEF7E6] text-[#8D4023] border-[#FFE280]'
              }`}
              title={mlStatus === 'online' ? 'Python FastAPI LightGBM Service Connected' : 'Local Deterministic Safety Engine Running'}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ backgroundColor: mlStatus === 'online' ? '#1E9E67' : '#F2B84B' }} />
              <span className="hidden xl:inline">
                {mlStatus === 'online' ? 'AI Model Online' : 'Local Engine'}
              </span>
            </div>

            {/* CSV Import Trigger */}
            <button
              onClick={() => setIsCSVImportOpen(true)}
              className="px-2.5 py-1 rounded-xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-xs font-bold text-[#063F3D] flex items-center space-x-1 transition-all shadow-xs"
              title="Import Glucose CSV"
            >
              <UploadCloud className="w-3.5 h-3.5 text-[#075B57]" />
              <span className="hidden xl:inline">Import CSV</span>
            </button>

            {/* Live Hypo Alert Badge if < 70 */}
            {isEmergency ? (
              <div className="px-2.5 py-1 rounded-lg bg-[#FDE8E9] border border-[#FFB4A8] text-[#C84B52] text-[11px] font-black flex items-center space-x-1 animate-pulse">
                <AlertOctagon className="w-3.5 h-3.5" />
                <span>HYPO &lt;70</span>
              </div>
            ) : (
              <div className="px-2.5 py-1 rounded-lg bg-[#DFF4E8] text-[#075B57] text-[11px] font-bold flex items-center space-x-1">
                <span>{patientState.glucose} mg/dL</span>
              </div>
            )}

            {/* Data Mode & Scenario Selector */}
            <div className="flex items-center bg-[#F3F1EA] rounded-xl p-0.5 border border-black/5">
              <select
                value={dataMode === 'my_data' ? 'my_data' : currentPersona.id}
                onChange={(e) => {
                  if (e.target.value === 'my_data') {
                    setDataMode('my_data');
                  } else {
                    setDataMode('demo_scenario');
                    switchPersona(e.target.value);
                  }
                }}
                className="bg-white border-0 rounded-lg px-2.5 py-1 text-xs font-bold text-[#075B57] focus:outline-none cursor-pointer shadow-xs"
              >
                <option value="my_data">● My Live Data</option>
                <optgroup label="Demo Scenarios (Judges)">
                  {DEMO_PERSONAS.map((p) => (
                    <option key={p.id} value={p.id}>
                      Demo: {p.name.split(' ')[0]} ({p.age}y - {p.id === 'aarav' ? 'Adult' : p.id === 'priya' ? 'Student' : 'NPH'})
                    </option>
                  ))}
                </optgroup>
              </select>
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
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-black/8 bg-white p-4 shadow-lg animate-fade-in space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'report') {
                      onOpenDoctorReport();
                    } else {
                      setActiveTab(item.id);
                    }
                    setMobileMenuOpen(false);
                  }}
                  className={`p-2.5 rounded-xl text-left text-xs font-bold flex items-center space-x-2 ${
                    isActive ? 'bg-[#DFF4E8] text-[#075B57]' : 'bg-[#F7F8F5] text-[#66716F]'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          <div className="pt-3 border-t border-black/5 flex items-center justify-between">
            <button
              onClick={() => {
                setIsCSVImportOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#075B57] flex items-center space-x-1"
            >
              <UploadCloud className="w-3.5 h-3.5" />
              <span>Import CSV</span>
            </button>

            <button
              onClick={() => {
                setIsUserProfileOpen(true);
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#075B57] flex items-center space-x-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>My Profile</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
