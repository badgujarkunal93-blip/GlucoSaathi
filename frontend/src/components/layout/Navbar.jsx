import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  Utensils, 
  ShieldAlert, 
  LayoutDashboard, 
  FileText, 
  User, 
  Zap, 
  Menu, 
  X,
  Sparkles
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, onOpenDoctorReport, onOpenSettings }) {
  const { currentPersona, switchPersona, DEMO_PERSONAS, riskEvaluation, openQuickModal } = useApp();
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'story', label: 'Story & Journey', icon: Sparkles },
    { id: 'meal', label: 'Meal & Carbs', icon: Utensils },
    { id: 'risk', label: 'Risk Engine', icon: ShieldAlert },
    { id: 'dashboard', label: 'Bento Dashboard', icon: LayoutDashboard },
    { id: 'history', label: 'Health Journal', icon: FileText },
  ];

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-2.5' : 'py-4'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <nav className="floating-navbar rounded-full px-4 sm:px-6 py-2.5 flex items-center justify-between transition-all">
          {/* 1. Brand Logo */}
          <div 
            onClick={() => setActiveTab('story')}
            className="flex items-center space-x-2.5 cursor-pointer group"
          >
            <div className="w-8 h-8 rounded-full bg-[#075B57] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Activity className="w-4 h-4 text-[#DFF4E8]" />
            </div>
            <div className="flex items-baseline space-x-1">
              <span className="text-base font-extrabold text-[#063F3D] font-display tracking-tight">
                Gluco<span className="text-[#1E9E67]">Saathi</span>
              </span>
              <span className="text-[10px] font-bold text-[#66716F] hidden md:inline">
                ग्लूको-साथी
              </span>
            </div>
          </div>

          {/* 2. Desktop Navigation Center */}
          <div className="hidden lg:flex items-center space-x-1 bg-[#F3F1EA]/80 p-1 rounded-full border border-black/5">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center space-x-1.5 ${
                    isActive
                      ? 'bg-white text-[#075B57] shadow-sm font-bold'
                      : 'text-[#66716F] hover:text-[#111817] hover:bg-white/50'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#1E9E67]' : 'text-[#66716F]'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>

          {/* 3. Action Group Right */}
          <div className="hidden sm:flex items-center space-x-2.5">
            {/* Quick Doctor Report */}
            <button
              onClick={onOpenDoctorReport}
              className="px-3 py-1.5 rounded-full bg-white border border-black/8 hover:border-[#075B57]/30 text-xs font-semibold text-[#075B57] transition-all shadow-xs flex items-center space-x-1"
              title="Clinical Doctor Summary"
            >
              <FileText className="w-3.5 h-3.5 text-[#1E9E67]" />
              <span className="hidden md:inline">Doctor Report</span>
            </button>

            {/* Persona Switcher / Demo Mode */}
            <div className="flex items-center bg-[#F3F1EA] rounded-full p-0.5 border border-black/5">
              <span className="text-[11px] font-bold text-[#66716F] pl-2 pr-1 flex items-center space-x-1">
                <Zap className="w-3 h-3 text-[#F2B84B]" />
                <span className="hidden xl:inline">Demo:</span>
              </span>
              <select
                value={currentPersona.id}
                onChange={(e) => switchPersona(e.target.value)}
                className="bg-white border-0 rounded-full px-2.5 py-1 text-xs font-bold text-[#075B57] focus:outline-none cursor-pointer shadow-xs"
              >
                {DEMO_PERSONAS.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name.split(' ')[0]} ({p.age}y)
                  </option>
                ))}
              </select>
            </div>

            {/* Profile Settings */}
            <button
              onClick={onOpenSettings}
              className="w-8 h-8 rounded-full bg-white border border-black/8 hover:border-[#075B57] flex items-center justify-center text-[#075B57] transition-all shadow-xs"
              title="Patient Settings"
            >
              <User className="w-4 h-4" />
            </button>
          </div>

          {/* Mobile Hamburger */}
          <div className="flex items-center space-x-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-full bg-white border border-black/8 text-[#075B57]"
            >
              {mobileMenuOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>
        </nav>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden mx-4 mt-2 p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-black/8 shadow-xl animate-fade-in space-y-3">
          <div className="grid grid-cols-2 gap-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
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

          <div className="pt-2 border-t border-black/5 flex items-center justify-between">
            <button
              onClick={() => {
                onOpenDoctorReport();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#075B57] flex items-center space-x-1"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Doctor Report</span>
            </button>
            <button
              onClick={() => {
                onOpenSettings();
                setMobileMenuOpen(false);
              }}
              className="text-xs font-bold text-[#66716F] flex items-center space-x-1"
            >
              <User className="w-3.5 h-3.5" />
              <span>Profile Settings</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
