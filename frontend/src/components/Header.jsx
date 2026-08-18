import React from 'react';
import { useApp } from '../context/AppContext';
import { HeartPulse } from 'lucide-react';

export default function Header() {
  const { currentView, settings, setIsSettingsOpen, riskResult } = useApp();

  const getPageTitle = () => {
    switch (currentView) {
      case 'dashboard':
        return 'Overview';
      case 'log-meal':
        return 'Meal Journal';
      case 'risk-check':
        return 'Risk Check';
      case 'history':
        return 'Health Logs';
      default:
        return 'Overview';
    }
  };

  return (
    <header className="flex items-center justify-between px-6 lg:px-10 py-3.5 border-b border-[#E5ECE3] bg-white select-none">
      {/* Friendly Greeting & Breadcrumb */}
      <div className="flex items-center space-x-3">
        {/* Mobile Logo */}
        <div className="lg:hidden flex items-center space-x-2">
          <div className="w-8 h-8 rounded-[8px] bg-[#D9F5F6] border border-[#B2ECF0] text-[#00AFC1] flex items-center justify-center font-bold">
            <HeartPulse className="w-4 h-4 stroke-[2.5]" />
          </div>
          <span className="font-bold font-display text-base text-[#172640]">
            Gluco<span className="text-[#00AFC1]">Saathi</span>
          </span>
        </div>

        {/* Desktop Title & Greeting */}
        <div className="hidden lg:block">
          <div className="flex items-center space-x-2 text-[11px] text-[#5A6E85] font-semibold">
            <span>GlucoSaathi</span>
            <span>•</span>
            <span className="text-[#00AFC1]">{getPageTitle()}</span>
          </div>
          <h1 className="text-base lg:text-lg font-extrabold text-[#172640] font-display tracking-tight mt-0.5">
            Namaste, {settings.name.split(' ')[0]} 👋
          </h1>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-2.5">
        {/* Risk Status Pill (Pills are allowed for status) */}
        <div className={`flex items-center space-x-1.5 px-3 py-1 rounded-full text-xs font-bold border ${
          riskResult.riskLevel === 'LOW' 
            ? 'bg-[#D8F3E7] text-[#093B22] border-[#B8E8D2]' 
            : riskResult.riskLevel === 'MODERATE'
            ? 'bg-[#FFF1B8] text-[#4B3903] border-[#FFE280]'
            : 'bg-[#FFD9D4] text-[#5A150D] border-[#FFB4A8]'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            riskResult.riskLevel === 'LOW' ? 'bg-emerald-600' : riskResult.riskLevel === 'MODERATE' ? 'bg-amber-600' : 'bg-red-600'
          }`} />
          <span>{riskResult.riskLevel} Risk</span>
        </div>

        {/* Profile Avatar Button */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="flex items-center space-x-2 p-1.5 pr-2.5 rounded-[10px] bg-[#F2F5F2] hover:bg-[#E8ECE7] border border-[#DEE5DC] text-[#172640] transition-all text-xs font-bold"
          title="User Profile & Settings"
        >
          <div className="w-6 h-6 rounded-[6px] bg-[#D9F5F6] text-[#08444B] flex items-center justify-center text-[11px] font-extrabold border border-[#B2ECF0]">
            AS
          </div>
          <span className="hidden sm:inline font-bold text-[#172640]">{settings.name.split(' ')[0]}</span>
        </button>
      </div>
    </header>
  );
}
