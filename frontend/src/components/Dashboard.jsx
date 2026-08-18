import React from 'react';
import { useApp } from '../context/AppContext';
import { 
  UtensilsCrossed, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  ArrowRight, 
  Clock, 
  Sparkles, 
  Syringe, 
  Flame, 
  FileText, 
  TrendingUp, 
  PlusCircle,
  Zap,
  CheckCircle2
} from 'lucide-react';

export default function Dashboard() {
  const { 
    navigateTo, 
    riskResult, 
    riskInputs, 
    todayMetrics, 
    history, 
    settings,
    currentPersona,
    setIsGlucoseModalOpen,
    setIsInsulinModalOpen,
    setIsActivityModalOpen,
    setIsDoctorReportModalOpen
  } = useApp();

  const recentLogs = history.slice(0, 5);

  const getRiskBadge = (level) => {
    switch (level) {
      case 'HIGH':
        return { bg: 'bg-[#FDE8E9]', text: 'text-[#C84B52]', border: 'border-[#FFB4A8]', label: 'HIGH RISK' };
      case 'MODERATE':
        return { bg: 'bg-[#FEF7E6]', text: 'text-[#8D4023]', border: 'border-[#FFE280]', label: 'MODERATE RISK' };
      default:
        return { bg: 'bg-[#DFF4E8]', text: 'text-[#075B57]', border: 'border-[#B8E8D2]', label: 'LOW RISK' };
    }
  };

  const riskBadge = getRiskBadge(riskResult.riskLevel);

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-8 pt-4">
      {/* 1. Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
              T1D HEALTH CANVAS
            </span>
            <span className="text-xs text-[#66716F]">
              • {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight pt-1">
            Good morning, {settings.name.split(' ')[0]}
          </h2>
          <p className="text-sm text-[#66716F]">
            Here is your contextual glycemic state and nutritional telemetry.
          </p>
        </div>

        {/* Quick Clinical Doctor Summary Trigger */}
        <button
          onClick={() => setIsDoctorReportModalOpen(true)}
          className="px-4 py-2 rounded-xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-xs font-bold text-[#075B57] transition-all shadow-xs flex items-center space-x-2 self-start md:self-auto"
        >
          <FileText className="w-4 h-4 text-[#1E9E67]" />
          <span>Doctor Visit Summary & CSV</span>
        </button>
      </div>

      {/* 2. Bento Grid Section */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
        {/* BENTO CARD 1: Risk Centerpiece (8 cols) */}
        <div className="md:col-span-8 editorial-card p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
                  <ShieldCheck className="w-4 h-4 text-[#1E9E67]" />
                  <span>Hypoglycemia Risk Evaluation</span>
                </span>
              </div>
              <span className={`text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                {riskBadge.label} ({riskResult.score}/100)
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-black/5 space-y-2">
              <h3 className="text-lg font-extrabold text-[#063F3D] font-display">
                {riskResult.headline}
              </h3>
              <p className="text-xs sm:text-sm text-[#66716F] leading-relaxed">
                {riskResult.explanation}
              </p>
            </div>

            {/* Quick Factors Preview */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
              <div className="p-2.5 rounded-xl bg-white border border-black/5 text-xs">
                <span className="text-[10px] font-bold text-[#66716F] uppercase block">Active IOB</span>
                <strong className="text-sm font-extrabold text-[#063F3D] font-display">{riskInputs.insulinOnBoard} U</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-black/5 text-xs">
                <span className="text-[10px] font-bold text-[#66716F] uppercase block">Meal Carbs</span>
                <strong className="text-sm font-extrabold text-[#063F3D] font-display">{riskInputs.carbsConsumed}g (Covered)</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-black/5 text-xs">
                <span className="text-[10px] font-bold text-[#66716F] uppercase block">Activity</span>
                <strong className="text-sm font-extrabold text-[#063F3D] font-display">{riskInputs.activityLevel}</strong>
              </div>
            </div>
          </div>

          <div className="pt-3 border-t border-black/5 flex items-center justify-between">
            <span className="text-[11px] font-semibold text-[#66716F]">
              Deterministic 4-Factor Weighted Model
            </span>
            <button
              onClick={() => navigateTo('risk')}
              className="text-xs font-bold text-[#075B57] hover:text-[#063F3D] flex items-center space-x-1"
            >
              <span>View Full "Why?" Factors</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* BENTO CARD 2: Current Glucose (4 cols) */}
        <div className="md:col-span-4 editorial-card p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-[#075B57]" />
                <span>Latest Glucose</span>
              </span>
              <span className="text-[11px] font-bold text-[#1E9E67] bg-[#DFF4E8] px-2 py-0.5 rounded-full">
                CGM: Stable →
              </span>
            </div>

            <div className="pt-2">
              <div className="text-4xl sm:text-5xl font-extrabold text-[#063F3D] font-editorial">
                {riskInputs.glucose} <span className="text-lg font-normal text-[#66716F]">mg/dL</span>
              </div>
              <span className="text-xs text-[#66716F] block mt-1">
                Target: 70–140 mg/dL • Fasting
              </span>
            </div>

            <div className="p-3 rounded-xl bg-[#F7F8F5] border border-black/5 text-xs text-[#66716F] space-y-1">
              <div className="flex justify-between">
                <span>Time-in-Range (TIR):</span>
                <strong className="text-[#075B57]">78% (Goal &gt;70%)</strong>
              </div>
              <div className="flex justify-between">
                <span>Estimated HbA1c:</span>
                <strong className="text-[#063F3D]">~6.2%</strong>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsGlucoseModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-[#F3F1EA] hover:bg-[#EAE6DC] text-xs font-bold text-[#063F3D] transition-colors flex items-center justify-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Blood Glucose</span>
          </button>
        </div>

        {/* BENTO CARD 3: Today's Carbs (4 cols) */}
        <div className="md:col-span-4 editorial-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
                <UtensilsCrossed className="w-4 h-4 text-[#8D4023]" />
                <span>Today's Carbs</span>
              </span>
              <span className="text-[10px] font-bold text-[#8D4023] bg-[#FFE0D1] px-2 py-0.5 rounded-md">
                {todayMetrics.mealsCount} Meals
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#063F3D] font-display pt-1">
              {todayMetrics.carbs}g <span className="text-sm font-normal text-[#66716F]">Total</span>
            </div>
            <p className="text-xs text-[#66716F]">
              Latest: 2 rotis, dal tadka & rice (~76g)
            </p>
          </div>

          <button
            onClick={() => navigateTo('meal')}
            className="w-full py-2 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1"
          >
            <span>Estimate New Meal</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* BENTO CARD 4: Insulin Context (4 cols) */}
        <div className="md:col-span-4 editorial-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
                <Syringe className="w-4 h-4 text-[#075B57]" />
                <span>Active Insulin</span>
              </span>
              <span className="text-[10px] font-bold text-[#075B57] bg-[#DFF4E8] px-2 py-0.5 rounded-md">
                ICR 1:{settings.icrRatio}g
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#063F3D] font-display pt-1">
              {riskInputs.insulinOnBoard} <span className="text-sm font-normal text-[#66716F]">Units IOB</span>
            </div>
            <p className="text-xs text-[#66716F]">
              Today's Bolus: {todayMetrics.insulin} U • Basal: 14 U
            </p>
          </div>

          <button
            onClick={() => setIsInsulinModalOpen(true)}
            className="w-full py-2 rounded-xl bg-[#F3F1EA] hover:bg-[#EAE6DC] text-xs font-bold text-[#063F3D] transition-colors flex items-center justify-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Insulin Dose</span>
          </button>
        </div>

        {/* BENTO CARD 5: Physical Activity (4 cols) */}
        <div className="md:col-span-4 editorial-card p-6 flex flex-col justify-between space-y-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
                <Flame className="w-4 h-4 text-[#F2B84B]" />
                <span>Physical Activity</span>
              </span>
              <span className="text-[10px] font-bold text-[#063F3D] bg-[#F3F1EA] px-2 py-0.5 rounded-md">
                Active
              </span>
            </div>
            <div className="text-3xl font-extrabold text-[#063F3D] font-display pt-1">
              {todayMetrics.activityMinutes} <span className="text-sm font-normal text-[#66716F]">Mins</span>
            </div>
            <p className="text-xs text-[#66716F]">
              Latest: {riskInputs.activityLevel} (Brisk Walk)
            </p>
          </div>

          <button
            onClick={() => setIsActivityModalOpen(true)}
            className="w-full py-2 rounded-xl bg-[#F3F1EA] hover:bg-[#EAE6DC] text-xs font-bold text-[#063F3D] transition-colors flex items-center justify-center space-x-1"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Exercise</span>
          </button>
        </div>

        {/* BENTO CARD 6: Recent Journal & Quick Action Bar (12 cols) */}
        <div className="md:col-span-12 editorial-card p-6 sm:p-7 space-y-6">
          <div className="flex items-center justify-between border-b border-black/5 pb-4">
            <div>
              <h3 className="text-base font-extrabold text-[#063F3D] font-display">
                Recent Journal Entries
              </h3>
              <p className="text-xs text-[#66716F]">
                Synchronized telemetry across meals, glucose, and risk checks.
              </p>
            </div>
            <button
              onClick={() => navigateTo('history')}
              className="text-xs font-bold text-[#075B57] hover:underline"
            >
              View All History →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentLogs.map((log) => (
              <div
                key={log.id}
                className="p-3.5 rounded-xl bg-[#F7F8F5] border border-black/5 flex items-center justify-between text-xs"
              >
                <div className="space-y-0.5">
                  <div className="font-bold text-[#063F3D] truncate max-w-[180px]">
                    {log.title}
                  </div>
                  <div className="text-[11px] text-[#66716F]">
                    {log.time} • {log.type}
                  </div>
                </div>
                <div className="text-right">
                  <span className="font-extrabold text-[#075B57] font-display">
                    {log.value}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
