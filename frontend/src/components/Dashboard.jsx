import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CGMTrajectory from './CGMTrajectory';
import { 
  UtensilsCrossed, 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon,
  ArrowRight, 
  Clock, 
  Sparkles, 
  Syringe, 
  Flame, 
  FileText, 
  TrendingUp, 
  TrendingDown,
  PlusCircle,
  Zap,
  CheckCircle2,
  HelpCircle,
  Info,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

export default function Dashboard({ onNavigate }) {
  const { 
    patientState,
    history, 
    settings,
    currentPersona,
    switchPersona,
    DEMO_PERSONAS,
    setIsGlucoseModalOpen,
    setIsInsulinModalOpen,
    setIsActivityModalOpen,
    setIsDoctorReportModalOpen
  } = useApp();

  const [showWhyPanel, setShowWhyPanel] = useState(true);
  const [showClinicianMath, setShowClinicianMath] = useState(false);

  const recentLogs = history.slice(0, 5);

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return { bg: 'bg-[#FDE8E9]', text: 'text-[#C84B52]', border: 'border-[#FFB4A8]', label: `${patientState.riskScore}% HIGH RISK` };
      case 'MODERATE':
        return { bg: 'bg-[#FEF7E6]', text: 'text-[#8D4023]', border: 'border-[#FFE280]', label: `${patientState.riskScore}% MODERATE` };
      default:
        return { bg: 'bg-[#DFF4E8]', text: 'text-[#075B57]', border: 'border-[#B8E8D2]', label: `${patientState.riskScore}% LOW RISK` };
    }
  };

  const riskBadge = getRiskBadge(patientState.riskClass);
  const isEmergency = patientState.glucose < 70 || patientState.isEmergencyHypo;

  return (
    <div className="space-y-7 animate-fade-in pb-20 lg:pb-12 pt-2">
      {/* 1. Rule of 15 Emergency Protocol Banner (When BG < 70) */}
      {isEmergency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FDE8E9] border-2 border-[#C84B52] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-bounce-subtle">
          <div className="flex items-start space-x-3 text-[#C84B52]">
            <AlertOctagon className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wider">
                HYPOGLYCEMIA ALERT: Glucose Below 70 mg/dL ({patientState.glucose} mg/dL)
              </h4>
              <p className="text-xs text-[#822428] leading-relaxed">
                Follow the <strong>Clinical Rule of 15</strong>: Consume <strong>15 grams of fast-acting carbs</strong> (fruit juice, 3 glucose tablets, or sugar in water). Rest and recheck blood glucose in <strong>15 minutes</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGlucoseModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C84B52] hover:bg-[#A8373E] text-white text-xs font-extrabold uppercase tracking-wider shrink-0 transition-colors shadow-xs"
          >
            Log Follow-Up Glucose
          </button>
        </div>
      )}

      {/* 2. Top Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-black/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
              CLINICAL HEALTH DASHBOARD
            </span>
            <span className="text-xs text-[#66716F]">
              • {new Date().toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight pt-1">
            Good afternoon, {settings.name.split(' ')[0]}
          </h2>
          <p className="text-sm text-[#66716F]">
            Here is your contextual glycemic state, active insulin on board, and nutritional telemetry.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2 self-start md:self-auto">
          <button
            onClick={() => setIsDoctorReportModalOpen(true)}
            className="px-3.5 py-2 rounded-xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-xs font-bold text-[#075B57] transition-all shadow-xs flex items-center space-x-1.5"
          >
            <FileText className="w-3.5 h-3.5 text-[#1E9E67]" />
            <span>Doctor Visit Summary</span>
          </button>
        </div>
      </div>

      {/* 3. HERO GLUCOSE TRAJECTORY & METRIC SNAPSHOT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Left: Latest Glucose & Forecast (4 cols) */}
        <div className="lg:col-span-4 editorial-card p-6 sm:p-7 flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-[#075B57]" />
                <span>Latest Glucose</span>
              </span>
              <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                patientState.glucose < 70
                  ? 'bg-[#FDE8E9] text-[#C84B52]'
                  : 'bg-[#DFF4E8] text-[#1E9E67]'
              }`}>
                {patientState.glucose < 70 ? 'Hypo Alert' : 'CGM: Stable ↘'}
              </span>
            </div>

            <div className="pt-1">
              <div className="text-5xl sm:text-6xl font-extrabold text-[#063F3D] font-editorial tracking-tight">
                {patientState.glucose} <span className="text-lg font-normal text-[#66716F]">mg/dL</span>
              </div>
              <span className="text-xs text-[#66716F] block mt-1">
                Target: {settings.targetMin}–{settings.targetMax} mg/dL • Fasting / Pre-Meal
              </span>
            </div>

            {/* 30-Min Forecast Preview */}
            <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-black/5 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66716F]">
                  30-Min Forecast
                </span>
                <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                  {riskBadge.label}
                </span>
              </div>
              <div className="text-2xl font-black text-[#063F3D] font-display">
                ~{patientState.forecast30mGlucose} mg/dL
              </div>
              <p className="text-[11px] text-[#66716F]">
                Estimated 30-min trajectory derived from current momentum and active IOB.
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGlucoseModalOpen(true)}
            className="w-full py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-1.5"
          >
            <PlusCircle className="w-3.5 h-3.5" />
            <span>Log Blood Glucose</span>
          </button>
        </div>

        {/* Right: Continuous CGM Trajectory Canvas (8 cols) */}
        <div className="lg:col-span-8 flex flex-col">
          <CGMTrajectory 
            currentGlucose={patientState.glucose}
            trend={patientState.glucoseTrend}
            iob={patientState.insulinOnBoard}
            recentCarbs={patientState.carbsConsumed}
            activityLevel={patientState.activityLevel}
            targetMin={settings.targetMin}
            targetMax={settings.targetMax}
            forecastGlucose={patientState.forecast30mGlucose}
            hypoProbability={patientState.modelProbability}
          />
        </div>
      </div>

      {/* 4. TODAY'S COMPACT SUMMARY METRICS */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="editorial-card p-4 sm:p-5 space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#66716F] flex items-center justify-between">
            <span>Time in Range (TIR)</span>
            <span className="text-[#1E9E67]">Goal &gt;70%</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#075B57] font-display">
            {patientState.todayMetrics.timeInRangePct}%
          </div>
          <span className="text-[11px] text-[#66716F]">
            70–140 mg/dL target window
          </span>
        </div>

        <div className="editorial-card p-4 sm:p-5 space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#66716F] flex items-center justify-between">
            <span>Average Glucose</span>
            <span className="text-[#075B57]">Past 24h</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#063F3D] font-display">
            {patientState.todayMetrics.averageGlucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
          </div>
          <span className="text-[11px] text-[#66716F]">
            Est. HbA1c: ~6.3%
          </span>
        </div>

        <div className="editorial-card p-4 sm:p-5 space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#66716F] flex items-center justify-between">
            <span>Today's Meals</span>
            <span className="text-[#8D4023]">{patientState.todayMetrics.totalCarbsToday}g Carbs</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#063F3D] font-display">
            {patientState.todayMetrics.mealsCount} <span className="text-xs font-normal text-[#66716F]">meals</span>
          </div>
          <span className="text-[11px] text-[#66716F] truncate" title={patientState.mealDescription}>
            Last: {patientState.mealDescription || 'Indian Meal'}
          </span>
        </div>

        <div className="editorial-card p-4 sm:p-5 space-y-1.5">
          <span className="text-[10px] font-black uppercase tracking-wider text-[#66716F] flex items-center justify-between">
            <span>Hypo Alerts</span>
            <span className="text-[#C84B52]">Prevented</span>
          </span>
          <div className="text-2xl sm:text-3xl font-black text-[#C84B52] font-display">
            {patientState.todayMetrics.hypoAlertsCount} <span className="text-xs font-normal text-[#66716F]">events</span>
          </div>
          <span className="text-[11px] text-[#66716F]">
            Rule of 15 armed @ 11:30 AM
          </span>
        </div>
      </div>

      {/* 5. EXPLAINABLE HYPOGLYCEMIA RISK BREAKDOWN */}
      <div className="editorial-card p-6 sm:p-7 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-4">
          <div>
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-4 h-4 text-[#075B57]" />
              <h3 className="text-base font-extrabold text-[#063F3D] font-display">
                Hypoglycemia Risk Evaluation & Reasoning
              </h3>
            </div>
            <p className="text-xs text-[#66716F]">
              Calibrated ML Model + Deterministic Clinical Safety Engine
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className={`text-xs font-black uppercase tracking-wider px-3 py-1 rounded-full border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
              {riskBadge.label} (Next 30m)
            </span>
          </div>
        </div>

        {/* Risk Summary Headline */}
        <div className="p-4 rounded-2xl bg-[#F7F8F5] border border-black/5 space-y-2">
          <h4 className="text-sm font-extrabold text-[#063F3D] font-display">
            {patientState.headline}
          </h4>
          <p className="text-xs text-[#66716F] leading-relaxed">
            {patientState.explanation}
          </p>
        </div>

        {/* 4 Feature Weights Attribution Grid */}
        <div className="space-y-3">
          <span className="text-xs font-extrabold uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
            <HelpCircle className="w-3.5 h-3.5 text-[#075B57]" />
            <span>Contributing Physiological Drivers ("Why?"):</span>
          </span>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {patientState.riskContributors?.map((fc, idx) => (
              <div key={idx} className="p-3.5 rounded-xl bg-white border border-black/8 space-y-1 text-xs">
                <span className="text-[10px] font-bold uppercase text-[#66716F] block truncate">
                  {fc.factor}
                </span>
                <strong className="text-xs font-black text-[#063F3D] block">
                  {fc.impact} Impact
                </strong>
                <p className="text-[11px] text-[#66716F]">
                  {fc.explanation}
                </p>
                <span className="text-[10px] text-[#075B57] font-bold block pt-1">
                  {Math.round(fc.weight * 100)}% Model Weight
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 6. RECENT JOURNAL TELEMETRY */}
      <div className="editorial-card p-6 sm:p-7 space-y-5">
        <div className="flex items-center justify-between border-b border-black/5 pb-3.5">
          <div>
            <h3 className="text-base font-extrabold text-[#063F3D] font-display">
              Recent Health Journal Telemetry
            </h3>
            <p className="text-xs text-[#66716F]">
              Synchronized events across meals, fingerstick glucose, insulin, and risk evaluations.
            </p>
          </div>
          <button
            onClick={() => onNavigate('journal')}
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
                  {log.timestamp || log.time} • {log.type}
                </div>
              </div>
              <div className="text-right">
                <span className="font-extrabold text-[#075B57] font-display">
                  {log.carbs ? `${log.carbs}g carbs` : log.value ? `${log.value} mg/dL` : log.riskLevel || 'Logged'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
