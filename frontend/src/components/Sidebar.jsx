import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  LayoutDashboard, 
  UtensilsCrossed, 
  Activity, 
  History as HistoryIcon, 
  Settings as SettingsIcon, 
  HeartPulse
} from 'lucide-react';

export default function Sidebar() {
  const { currentView, navigateTo, setIsSettingsOpen, settings, riskResult, todayMetrics } = useApp();

  const navItems = [
    {
      id: 'dashboard',
      label: 'Home',
      icon: LayoutDashboard
    },
    {
      id: 'log-meal',
      label: 'Log Meal',
      icon: UtensilsCrossed,
      tag: 'AI'
    },
    {
      id: 'risk-check',
      label: 'Risk Check',
      icon: Activity,
      riskState: riskResult.riskLevel
    },
    {
      id: 'history',
      label: 'History',
      icon: HistoryIcon
    }
  ];

  return (
    <aside className="hidden lg:flex flex-col w-[250px] xl:w-[260px] bg-[#FCFDFB] border-r border-[#E5ECE2] p-5 shrink-0 select-none overflow-y-auto">
      {/* 1. Brand Area with Healthcare Presentation */}
      <div className="pb-5 border-b border-[#EAEFE8]">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-[10px] bg-[#D9F5F6] border border-[#B2ECF0] flex items-center justify-center text-[#00AFC1] shadow-xs">
            <HeartPulse className="w-5 h-5 stroke-[2.5]" />
          </div>
          <div>
            <span className="font-display font-extrabold text-xl tracking-tight text-[#172640] block leading-none">
              Gluco<span className="text-[#00AFC1]">Saathi</span>
            </span>
            <span className="text-[11px] text-[#5A6E85] font-semibold tracking-wide block mt-1">
              T1D companion for India
            </span>
          </div>
        </div>

        {/* Tiny decorative heartbeat pulse line */}
        <div className="mt-3.5 flex items-center space-x-1 opacity-75">
          <div className="h-[1px] flex-1 bg-[#E2E8DF]" />
          <span className="text-[9px] font-mono text-[#00AFC1] font-bold tracking-tight">♥ steady state</span>
          <div className="h-[1px] flex-1 bg-[#E2E8DF]" />
        </div>
      </div>

      {/* 2. Primary Navigation Group: YOUR HEALTH */}
      <div className="pt-4 space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8292A6] px-3 mb-1.5 block">
          YOUR HEALTH
        </span>

        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentView === item.id;
            return (
              <button
                key={item.id}
                onClick={() => navigateTo(item.id)}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-[10px] text-[13.5px] font-bold transition-all duration-150 relative ${
                  isActive
                    ? 'bg-[#EBF8F2] text-[#172640]'
                    : 'text-[#5A6E85] hover:text-[#172640] hover:bg-[#F2F5F2]'
                }`}
              >
                {/* Slim 3px left teal indicator */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-[3px] bg-[#00AFC1] rounded-r-full" />
                )}

                <div className="flex items-center space-x-3 pl-1">
                  <Icon className={`w-4 h-4 transition-colors ${
                    isActive ? 'text-[#00AFC1] stroke-[2.5]' : 'text-[#5A6E85]'
                  }`} />
                  <span>{item.label}</span>
                </div>

                {item.tag && (
                  <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-[#D9F5F6] text-[#08444B] border border-[#B2ECF0]">
                    {item.tag}
                  </span>
                )}

                {item.riskState && (
                  <span className={`w-2 h-2 rounded-full ${
                    item.riskState === 'LOW' ? 'bg-emerald-500' : item.riskState === 'MODERATE' ? 'bg-amber-500' : 'bg-red-500'
                  }`} />
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* 3. Secondary Group: YOUR PROFILE */}
      <div className="pt-4 space-y-1">
        <span className="text-[10px] font-black uppercase tracking-wider text-[#8292A6] px-3 mb-1.5 block">
          YOUR PROFILE
        </span>
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-[13px] font-bold text-[#5A6E85] hover:text-[#172640] hover:bg-[#F2F5F2] transition-colors"
        >
          <div className="flex items-center space-x-3 pl-1">
            <SettingsIcon className="w-4 h-4 text-[#5A6E85]" />
            <span>Settings & ICR</span>
          </div>
          <span className="text-[10px] font-extrabold text-[#00AFC1] bg-[#E5F7F8] px-1.5 py-0.5 rounded">
            1:{settings.icrRatio}
          </span>
        </button>
      </div>

      {/* 4. Compact Sidebar Health Snapshot Card (~75px tall, no giant gap) */}
      <div className="pt-5 mt-4 border-t border-[#EAEFE8] space-y-2.5">
        <div className="p-3 rounded-[10px] bg-[#D8F3E7] text-[#093B22] border border-[#B8E8D2] space-y-1 paper-elevation-base">
          <div className="flex items-center justify-between">
            <span className="text-[9px] font-black uppercase tracking-wider text-[#166442]">
              TODAY'S SNAPSHOT
            </span>
            <span className="text-[9px] font-black px-1.5 py-0.2 rounded bg-[#093B22] text-[#D8F3E7] flex items-center space-x-1">
              <span>●</span>
              <span>{riskResult.riskLevel}</span>
            </span>
          </div>
          <div className="flex items-baseline justify-between pt-0.5">
            <span className="text-sm font-black font-display text-[#093B22]">
              {todayMetrics.totalCarbsToday}g <span className="text-[10px] font-semibold text-[#166442]">carbs</span>
            </span>
            <span className="text-xs font-bold text-[#166442]">
              {todayMetrics.lastGlucose || 108} mg/dL
            </span>
          </div>
          <p className="text-[10px] text-[#166442] font-semibold italic">
            "Looking steady today."
          </p>
        </div>

        {/* 5. Profile Row (Directly below snapshot) */}
        <button
          onClick={() => setIsSettingsOpen(true)}
          className="w-full flex items-center justify-between p-2 rounded-[10px] bg-white hover:bg-[#F7F9F6] border border-[#E2E8DF] paper-elevation-base transition-all text-left group"
        >
          <div className="flex items-center space-x-2.5 overflow-hidden">
            <div className="w-7 h-7 rounded-lg bg-[#D9F5F6] text-[#08444B] flex items-center justify-center font-black text-xs shrink-0 border border-[#B2ECF0]">
              AS
            </div>
            <div className="truncate">
              <p className="text-xs font-bold text-[#172640] truncate">
                {settings.name}
              </p>
              <p className="text-[10px] text-[#5A6E85] font-medium truncate">
                T1D companion
              </p>
            </div>
          </div>
          <SettingsIcon className="w-3.5 h-3.5 text-[#8292A6] group-hover:text-[#172640] shrink-0" />
        </button>
      </div>
    </aside>
  );
}
