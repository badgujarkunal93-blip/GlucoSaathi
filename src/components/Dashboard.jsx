import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  UtensilsCrossed, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  ChevronRight,
  Clock,
  Sparkles
} from 'lucide-react';

export default function Dashboard() {
  const { 
    navigateTo, 
    riskResult, 
    riskInputs, 
    todayMetrics, 
    history, 
    settings 
  } = useApp();

  const recentActivities = history.slice(0, 3);

  return (
    <div className="space-y-8 lg:space-y-9 animate-fade-in pb-20 lg:pb-8">
      {/* 1. Hero Greeting (Visually Dominant) */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-black text-[#00AFC1] uppercase tracking-wider bg-[#E5F7F8] px-2.5 py-0.5 rounded-[6px] border border-[#B2ECF0]">
            NAMASTE, {settings.name.toUpperCase()}
          </span>
          <span className="text-xs text-[#5A6E85] font-medium hidden sm:inline">
            • Daily T1D Companion
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#172640] tracking-tight font-display pt-1">
          Good morning
        </h2>
        <p className="text-sm lg:text-base text-[#5A6E85] font-normal">
          Let's keep your day steady and balanced.
        </p>
      </div>

      {/* 2. ASYMMETRICAL EDITORIAL GRID WITH STRUCTURED PAPER CARDS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* CARD 1: PRIMARY HEALTH CARD (Mint Paper Card with Layered Offset — 7 cols) */}
        <div className="lg:col-span-7 relative group">
          {/* Subtle 2-3px Layered Paper Offset behind Hero Card */}
          <div className="absolute inset-0 bg-[#C8EBDB] rounded-[14px] translate-x-1 translate-y-1 -z-10 transition-transform group-hover:translate-x-1.5 group-hover:translate-y-1.5" />

          <div className="h-full p-6 sm:p-7 rounded-[14px] bg-[#D8F3E7] text-[#093B22] border border-[#B8E8D2] paper-elevation-hero flex flex-col justify-between space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-[6px] bg-[#093B22] text-[#D8F3E7] flex items-center space-x-1.5 shadow-xs">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{riskResult.riskLevel} RISK STATUS</span>
                </span>

                <span className="text-xs font-bold text-[#166442] flex items-center space-x-1">
                  <Clock className="w-3.5 h-3.5" />
                  <span>Updated 2m ago</span>
                </span>
              </div>

              <h3 className="text-2xl sm:text-3xl font-extrabold text-[#093B22] tracking-tight font-display">
                {riskResult.riskLevel === 'LOW' ? "You're doing well today" : riskResult.headline}
              </h3>

              <p className="text-sm text-[#166442] font-medium leading-relaxed max-w-lg">
                {riskResult.explanation || "Your glucose is currently in a safer range, you recently ate, and insulin on board is relatively low."}
              </p>
            </div>

            {/* Structured Divider & Telemetry */}
            <div className="pt-4 border-t border-[#B8E8D2] flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center space-x-6">
                <div>
                  <p className="text-[10px] font-black uppercase text-[#166442] tracking-wider">Glucose</p>
                  <p className="text-2xl sm:text-3xl font-black text-[#093B22] font-display">
                    {todayMetrics.lastGlucose || riskInputs.glucose} <span className="text-xs font-bold text-[#166442]">mg/dL</span>
                  </p>
                </div>

                <div className="w-[1px] h-9 bg-[#B8E8D2]" />

                <div>
                  <p className="text-[10px] font-black uppercase text-[#166442] tracking-wider">Active Insulin</p>
                  <p className="text-2xl sm:text-3xl font-black text-[#093B22] font-display">
                    {todayMetrics.lastIob || riskInputs.insulinOnBoard} <span className="text-xs font-bold text-[#166442]">U</span>
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigateTo('risk-check')}
                className="px-3.5 py-2 rounded-[10px] bg-[#093B22] hover:bg-[#062917] text-[#D8F3E7] text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-xs group/btn"
              >
                <span>Analyze active factors</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover/btn:translate-x-0.5" />
              </button>
            </div>
          </div>
        </div>

        {/* CARD 2: MEAL CARD (Peach Paper Card — 5 cols) */}
        <div className="lg:col-span-5 p-6 sm:p-7 rounded-[14px] bg-[#FFE0D1] text-[#552310] border border-[#FFC4AB] paper-elevation-base flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#8D4023] flex items-center space-x-1.5">
              <span>🍽️</span>
              <span>LAST MEAL</span>
            </span>
            <span className="text-xs font-extrabold px-2.5 py-0.5 rounded-[6px] bg-[#552310] text-[#FFE0D1]">
              Breakfast
            </span>
          </div>

          <div className="space-y-1">
            <h4 className="text-xl font-black text-[#552310] font-display">
              2 rotis, dal and rice
            </h4>
            <p className="text-xs text-[#8D4023] font-bold">
              Roti 24g • Dal 18g • Rice 26g
            </p>
          </div>

          <div className="pt-3 border-t border-[#FFC4AB] flex items-center justify-between">
            <div>
              <span className="text-3xl font-black text-[#552310] font-display">
                68
              </span>
              <span className="text-sm font-bold text-[#8D4023] ml-1">g carbs</span>
            </div>

            <button
              onClick={() => navigateTo('log-meal')}
              className="text-xs font-black text-[#552310] hover:text-black flex items-center space-x-1 underline decoration-2 underline-offset-2"
            >
              <span>Log new meal</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* CARD 3: GLUCOSE CARD (Sky Blue Card — 4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-[12px] bg-[#DCEBFF] text-[#0F315E] border border-[#B8D7FF] paper-elevation-base space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#25589A] flex items-center space-x-1.5">
              <span>🩸</span>
              <span>CURRENT GLUCOSE</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-[#0F315E] text-[#DCEBFF]">
              In Range
            </span>
          </div>

          <div className="flex items-baseline space-x-2">
            <span className="text-4xl font-black text-[#0F315E] font-display">
              {todayMetrics.lastGlucose || riskInputs.glucose}
            </span>
            <span className="text-sm font-bold text-[#25589A]">mg/dL</span>
          </div>

          <div className="space-y-1 pt-1">
            <div className="h-2 w-full bg-[#B8D7FF] rounded-full overflow-hidden flex">
              <div className="w-[30%] bg-[#DCEBFF]" />
              <div className="w-[45%] bg-[#0F315E] rounded-full" />
              <div className="w-[25%] bg-[#B8D7FF]" />
            </div>
            <p className="text-[11px] text-[#25589A] font-bold">
              Target: <strong>{settings.targetMin}–{settings.targetMax} mg/dL</strong>
            </p>
          </div>
        </div>

        {/* CARD 4: ACTIVITY CARD (Lavender Card — 4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-[12px] bg-[#E9E3FF] text-[#2B1D61] border border-[#CEBFFC] paper-elevation-base flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#533BA1] flex items-center space-x-1.5">
              <span>🏃‍♂️</span>
              <span>TODAY'S ACTIVITY</span>
            </span>
            <span className="text-xs font-bold text-[#533BA1]">
              2h ago
            </span>
          </div>

          <div>
            <h4 className="text-xl font-black text-[#2B1D61] font-display">
              {riskInputs.activityLevel} activity
            </h4>
            <p className="text-xs text-[#533BA1] font-medium mt-1">
              "Nice and steady pace."
            </p>
          </div>

          <div className="pt-2 border-t border-[#CEBFFC] text-[11px] font-bold text-[#533BA1]">
            ✓ Baseline glucose clearance
          </div>
        </div>

        {/* CARD 5: INSULIN CARD (Soft Yellow Card — 4 cols) */}
        <div className="lg:col-span-4 p-5 sm:p-6 rounded-[12px] bg-[#FFF1B8] text-[#4B3903] border border-[#FFE280] paper-elevation-base flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-[#785E09] flex items-center space-x-1.5">
              <span>💉</span>
              <span>INSULIN ON BOARD</span>
            </span>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-[6px] bg-[#4B3903] text-[#FFF1B8]">
              Active
            </span>
          </div>

          <div className="flex items-baseline space-x-1.5">
            <span className="text-4xl font-black text-[#4B3903] font-display">
              {todayMetrics.lastIob || riskInputs.insulinOnBoard}
            </span>
            <span className="text-sm font-bold text-[#785E09]">Units (U)</span>
          </div>

          <div className="pt-2 border-t border-[#FFE280] text-[11px] font-bold text-[#785E09]">
            Ratio: 1 Unit per {settings.icrRatio}g carbs
          </div>
        </div>
      </div>

      {/* 3. TACTILE QUICK ACTION CARDS (Soft Aqua & Lavender) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Action 1: Log a Meal (Aqua Paper Card) */}
        <button
          onClick={() => navigateTo('log-meal')}
          className="p-5 sm:p-6 rounded-[12px] bg-[#D9F5F6] text-[#08444B] border border-[#B2ECF0] paper-elevation-interactive text-left group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-[10px] bg-[#08444B] text-[#D9F5F6] flex items-center justify-center font-bold text-xl shadow-xs transition-transform group-hover:scale-105">
              🍴
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base sm:text-lg font-black text-[#08444B] font-display">
                  Log a meal
                </h4>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#08444B] text-[#D9F5F6]">
                  AI PARSER
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#146B76] font-semibold mt-0.5">
                Estimate carbs from your Indian meal
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#08444B] text-[#D9F5F6] flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>

        {/* Action 2: Check Risk (Lavender Paper Card) */}
        <button
          onClick={() => navigateTo('risk-check')}
          className="p-5 sm:p-6 rounded-[12px] bg-[#E9E3FF] text-[#2B1D61] border border-[#CEBFFC] paper-elevation-interactive text-left group flex items-center justify-between cursor-pointer"
        >
          <div className="flex items-center space-x-4">
            <div className="w-11 h-11 rounded-[10px] bg-[#2B1D61] text-[#E9E3FF] flex items-center justify-center font-bold text-xl shadow-xs transition-transform group-hover:scale-105">
              🩺
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-base sm:text-lg font-black text-[#2B1D61] font-display">
                  Check risk
                </h4>
                <span className="text-[9px] font-black px-1.5 py-0.5 rounded bg-[#2B1D61] text-[#E9E3FF]">
                  HYPO ENGINE
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#533BA1] font-semibold mt-0.5">
                Understand your current risk
              </p>
            </div>
          </div>

          <div className="w-8 h-8 rounded-full bg-[#2B1D61] text-[#E9E3FF] flex items-center justify-center shrink-0 group-hover:translate-x-1 transition-transform">
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </div>
        </button>
      </div>

      {/* 4. TODAY'S SNAPSHOT (Structured Pastel Mini Tiles) */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center space-x-2">
          <Sparkles className="w-4 h-4 text-[#00AFC1]" />
          <span className="text-xs font-black uppercase tracking-wider text-[#172640]">
            YOUR DAY AT A GLANCE
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
          {/* Carbs (Peach) */}
          <div className="p-4 rounded-[10px] bg-[#FFE0D1] text-[#552310] border border-[#FFC4AB] paper-elevation-base">
            <span className="text-[10px] font-black uppercase text-[#8D4023]">Carbs Consumed</span>
            <p className="text-2xl font-black text-[#552310] font-display mt-1">
              {todayMetrics.carbsConsumed}g
            </p>
            <p className="text-[11px] text-[#8D4023] font-semibold">Daily count</p>
          </div>

          {/* Meals (Aqua) */}
          <div className="p-4 rounded-[10px] bg-[#D9F5F6] text-[#08444B] border border-[#B2ECF0] paper-elevation-base">
            <span className="text-[10px] font-black uppercase text-[#146B76]">Meals Logged</span>
            <p className="text-2xl font-black text-[#08444B] font-display mt-1">
              {todayMetrics.mealsCount}
            </p>
            <p className="text-[11px] text-[#146B76] font-semibold">Breakfast & Lunch</p>
          </div>

          {/* Risk Checks (Mint) */}
          <div className="p-4 rounded-[10px] bg-[#D8F3E7] text-[#093B22] border border-[#B8E8D2] paper-elevation-base">
            <span className="text-[10px] font-black uppercase text-[#166442]">Risk Checks</span>
            <p className="text-2xl font-black text-[#093B22] font-display mt-1">
              {todayMetrics.riskChecksCount}
            </p>
            <p className="text-[11px] text-[#166442] font-semibold">Low risk</p>
          </div>

          {/* Activity (Lavender) */}
          <div className="p-4 rounded-[10px] bg-[#E9E3FF] text-[#2B1D61] border border-[#CEBFFC] paper-elevation-base">
            <span className="text-[10px] font-black uppercase text-[#533BA1]">Activity Level</span>
            <p className="text-2xl font-black text-[#2B1D61] font-display mt-1">
              {riskInputs.activityLevel}
            </p>
            <p className="text-[11px] text-[#533BA1] font-semibold">Steady pacing</p>
          </div>
        </div>
      </div>

      {/* 5. RECENT ACTIVITY TIMELINE */}
      <div className="space-y-3.5 pt-1">
        <div className="flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-wider text-[#172640]">
            RECENT ACTIVITY TIMELINE
          </span>
          <button
            onClick={() => navigateTo('history')}
            className="text-xs font-bold text-[#00AFC1] hover:text-[#0891B2] flex items-center space-x-1"
          >
            <span>View full journal</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-2.5">
          {recentActivities.map((act) => (
            <div
              key={act.id}
              className="p-4 rounded-[10px] bg-white text-[#172640] border border-[#E2E8DF] paper-elevation-base flex flex-col sm:flex-row sm:items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center space-x-3.5">
                <div className={`w-9 h-9 rounded-[8px] flex items-center justify-center text-base shrink-0 ${
                  act.type === 'meal'
                    ? 'bg-[#FFE0D1] text-[#552310]'
                    : 'bg-[#D8F3E7] text-[#093B22]'
                }`}>
                  {act.type === 'meal' ? '🍛' : '🩺'}
                </div>

                <div>
                  <div className="flex items-center space-x-2">
                    <h5 className="text-sm font-extrabold text-[#172640] font-display">
                      {act.title}
                    </h5>
                    <span className="text-[11px] text-[#5A6E85]">
                      • {act.timestamp}
                    </span>
                  </div>
                  <p className="text-xs text-[#5A6E85] font-medium mt-0.5">
                    {act.type === 'meal' ? act.description : `Glucose ${act.glucose} mg/dL • Low risk`}
                  </p>
                </div>
              </div>

              <div className="text-right pl-12 sm:pl-0">
                {act.type === 'meal' ? (
                  <span className="text-xs font-black px-2.5 py-1 rounded-[6px] bg-[#FFE0D1] text-[#552310] font-display inline-block">
                    {act.carbs}g carbs
                  </span>
                ) : (
                  <span className="text-xs font-black px-2.5 py-1 rounded-[6px] bg-[#D8F3E7] text-[#093B22] font-display inline-block">
                    {act.glucose} mg/dL
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
