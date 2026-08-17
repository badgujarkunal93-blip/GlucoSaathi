import React from 'react';
import { useApp } from '../context/AppContext';
import { LayoutDashboard, UtensilsCrossed, Activity, History as HistoryIcon } from 'lucide-react';

export default function BottomNav() {
  const { currentView, navigateTo, riskResult } = useApp();

  const tabs = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard,
      activeColor: 'bg-[#D8F3E7] text-[#093B22] border-[#B8E8D2]'
    },
    {
      id: 'log-meal',
      label: 'Meal',
      icon: UtensilsCrossed,
      isAi: true,
      activeColor: 'bg-[#FFE0D1] text-[#552310] border-[#FFC4AB]'
    },
    {
      id: 'risk-check',
      label: 'Risk',
      icon: Activity,
      riskLevel: riskResult.riskLevel,
      activeColor: 'bg-[#D9F5F6] text-[#08444B] border-[#B2ECF0]'
    },
    {
      id: 'history',
      label: 'History',
      icon: HistoryIcon,
      activeColor: 'bg-[#E9E3FF] text-[#2B1D61] border-[#CEBFFC]'
    }
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#E2E8DF] px-4 py-2 shadow-md">
      <nav className="flex items-center justify-around max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = currentView === tab.id;

          return (
            <button
              key={tab.id}
              onClick={() => navigateTo(tab.id)}
              className={`relative flex items-center space-x-1.5 py-2 px-3 rounded-[10px] border transition-all duration-150 cursor-pointer ${
                isActive
                  ? `${tab.activeColor} font-black shadow-xs`
                  : 'text-[#5A6E85] hover:text-[#172640] border-transparent'
              }`}
            >
              <div className="relative">
                <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-105' : ''}`} />
                {tab.isAi && !isActive && (
                  <span className="absolute -top-1 -right-2 text-[7px] bg-[#00AFC1] text-white font-bold px-1 rounded-full">
                    AI
                  </span>
                )}
                {tab.riskLevel && !isActive && (
                  <span className={`absolute -top-1 -right-2 w-2 h-2 rounded-full ring-2 ring-white ${
                    tab.riskLevel === 'LOW' ? 'bg-emerald-500' : tab.riskLevel === 'MODERATE' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                )}
              </div>

              {isActive && (
                <span className="text-xs font-black tracking-tight">
                  {tab.label}
                </span>
              )}
            </button>
          );
        })}
      </nav>
    </div>
  );
}
