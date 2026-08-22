import React, { useRef } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  ShieldCheck, 
  AlertOctagon, 
  UtensilsCrossed, 
  Utensils,
  Syringe, 
  Flame, 
  ArrowRight, 
  Sliders, 
  Sparkles, 
  Zap, 
  CheckCircle2, 
  HelpCircle,
  Clock,
  Info,
  Layers,
  ChevronRight,
  FileText,
  HeartPulse,
  Scale,
  Calendar,
  Lock
} from 'lucide-react';

export default function Overview({ onNavigate }) {
  const { 
    patientState, 
    patientInputs, 
    updatePatientInput, 
    applyPresetScenario, 
    settings,
    setIsDoctorReportModalOpen,
    setIsGlucoseModalOpen
  } = useApp();

  const simulatorRef = useRef(null);

  const isEmergency = patientState.glucose < 70 || patientState.isEmergencyHypo;

  const scrollToSimulator = () => {
    if (simulatorRef.current) {
      simulatorRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return { 
          bg: 'bg-[#FDE8E9]', 
          text: 'text-[#C84B52]', 
          border: 'border-[#FFB4A8]', 
          label: `${patientState.riskScore}% HIGH RISK`,
          qualitative: 'HIGH'
        };
      case 'MODERATE':
        return { 
          bg: 'bg-[#FEF7E6]', 
          text: 'text-[#8D4023]', 
          border: 'border-[#FFE280]', 
          label: `${patientState.riskScore}% MODERATE RISK`,
          qualitative: 'MODERATE'
        };
      default:
        return { 
          bg: 'bg-[#DFF4E8]', 
          text: 'text-[#075B57]', 
          border: 'border-[#B8E8D2]', 
          label: `${patientState.riskScore}% LOW RISK`,
          qualitative: 'LOW'
        };
    }
  };

  const riskBadge = getRiskBadge(patientState.riskClass);

  // Mini trajectory sparkline coordinates for the Hero Snapshot Card
  const currentG = patientState.glucose;
  const forecastG = patientState.forecast30mGlucose;
  const past60G = Math.round(currentG + (patientState.glucoseTrend.includes('falling') ? 18 : -15));
  const past30G = Math.round(currentG + (patientState.glucoseTrend.includes('falling') ? 9 : -8));

  // Compute SVG Y coordinates for [past60, past30, current, forecast] clamped to 40..250 range
  const getY = (val) => {
    const minVal = 40;
    const maxVal = 220;
    const clamped = Math.max(minVal, Math.min(maxVal, val));
    return Math.round(80 - ((clamped - minVal) / (maxVal - minVal)) * 60);
  };

  const p0 = { x: 10, y: getY(past60G) };
  const p1 = { x: 70, y: getY(past30G) };
  const p2 = { x: 130, y: getY(currentG) };
  const p3 = { x: 200, y: getY(forecastG) };
  const hypoThresholdY = getY(70);

  return (
    <div className="space-y-16 sm:space-y-24 animate-fade-in pb-20 lg:pb-16 pt-2 text-[#111817]">
      
      {/* 00. RULE OF 15 EMERGENCY BANNER (If BG < 70) */}
      {isEmergency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FDE8E9] border-2 border-[#C84B52] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-bounce-subtle">
          <div className="flex items-start space-x-3 text-[#C84B52]">
            <AlertOctagon className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wider">
                HYPOGLYCEMIA ALERT: Glucose Below 70 mg/dL ({patientState.glucose} mg/dL)
              </h4>
              <p className="text-xs text-[#822428] leading-relaxed">
                Apply the <strong>Clinical Rule of 15</strong>: Immediately consume <strong>15 grams of fast-acting carbohydrates</strong> (fruit juice, 3 glucose tablets, or 3 tsp sugar in water). Rest and re-test blood glucose in <strong>15 minutes</strong>.
              </p>
            </div>
          </div>
          <button
            onClick={() => setIsGlucoseModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#C84B52] hover:bg-[#A8373E] text-white text-xs font-extrabold uppercase tracking-wider shrink-0 transition-colors shadow-xs"
          >
            Log Follow-Up Reading
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 01. HERO SECTION (50/50 Desktop Two-Column Layout) */}
      {/* ========================================================================= */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center pt-2">
        {/* Left Column: Product Narrative & CTAs (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="inline-flex items-center space-x-2 bg-[#DFF4E8] text-[#075B57] px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-widest border border-[#B8E8D2]">
            <Activity className="w-3.5 h-3.5" />
            <span>T1D CLINICAL DECISION SUPPORT</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-[56px] font-extrabold text-[#063F3D] font-editorial tracking-tight leading-[1.12]">
            Understand your meal. <br />
            Understand <span className="text-[#1E9E67]">your risk.</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5A6E85] font-normal leading-relaxed max-w-2xl">
            AI-assisted Indian meal understanding and explainable short-term hypoglycemia risk prediction, built around real-world composite meals and continuous glucose context.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('meal')}
              className="px-6 py-3.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-sm font-extrabold tracking-wide uppercase shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 group"
            >
              <span>Analyze an Indian Meal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>

            <button
              onClick={scrollToSimulator}
              className="px-6 py-3.5 rounded-xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-[#063F3D] text-sm font-extrabold tracking-wide transition-all shadow-xs flex items-center justify-center space-x-2"
            >
              <Sliders className="w-4 h-4 text-[#075B57]" />
              <span>Explore Live Demo</span>
            </button>
          </div>

          <div className="text-xs font-semibold text-[#66716F] flex flex-wrap items-center gap-x-2 gap-y-1 pt-1">
            <span>Natural language</span>
            <span>•</span>
            <span>Meal photos</span>
            <span>•</span>
            <span>CGM context</span>
            <span>•</span>
            <span>Explainable risk</span>
          </div>
        </div>

        {/* Right Column: Single Contextual "Live Patient Snapshot" (5 cols) */}
        <div className="lg:col-span-5">
          <div className="editorial-card p-6 sm:p-7 space-y-5 border-2 border-[#075B57]/15 shadow-xl bg-white relative overflow-hidden">
            {/* Top Bar: Live Status */}
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-[#1E9E67] animate-pulse" />
                <span className="text-xs font-black uppercase tracking-wider text-[#063F3D]">
                  LIVE PATIENT SNAPSHOT
                </span>
              </div>
              <span className="text-[11px] font-bold text-[#66716F]">
                {settings.name.split(' ')[0]} ({settings.age}y)
              </span>
            </div>

            {/* Current Glucose + 30-min Outlook Grid */}
            <div className="grid grid-cols-2 gap-4">
              {/* Current BG */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#66716F] block">
                  Current Glucose
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-display">
                  {patientState.glucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
                </div>
                <span className="text-[11px] font-bold text-[#075B57] flex items-center space-x-1">
                  <TrendingDown className="w-3 h-3 text-[#1E9E67]" />
                  <span>Falling slowly</span>
                </span>
              </div>

              {/* 30-Min Outlook (Strictly separated from risk score) */}
              <div className="space-y-1 p-2.5 rounded-xl bg-[#F7F8F5] border border-black/5">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66716F] block">
                  30-Min Outlook
                </span>
                <div className="text-2xl sm:text-3xl font-black text-[#063F3D] font-display">
                  ~{patientState.forecast30mGlucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
                </div>
                <span className="text-[10px] font-bold text-[#66716F] block">
                  Conformal forecast band
                </span>
              </div>
            </div>

            {/* Mini Contextual Sparkline SVG */}
            <div className="p-3 rounded-xl bg-[#FAFBF8] border border-black/5 space-y-1.5">
              <div className="flex items-center justify-between text-[10px] text-[#66716F] font-bold">
                <span>-60m</span>
                <span>NOW</span>
                <span className="text-[#075B57] font-extrabold">+30m Forecast</span>
              </div>
              
              <svg viewBox="0 0 210 90" className="w-full h-16 overflow-visible">
                {/* Safe Target Zone Background 70–140 */}
                <rect x="0" y={getY(140)} width="210" height={getY(70) - getY(140)} fill="#DFF4E8" fillOpacity="0.4" rx="4" />
                
                {/* Hypoglycemia 70 mg/dL threshold dashed line */}
                <line x1="0" y1={hypoThresholdY} x2="210" y2={hypoThresholdY} stroke="#C84B52" strokeWidth="1" strokeDasharray="3,3" />
                <text x="2" y={hypoThresholdY - 3} fill="#C84B52" fontSize="8" fontWeight="bold">70 mg/dL (Hypo)</text>

                {/* Past Trajectory Solid Line */}
                <path d={`M ${p0.x} ${p0.y} L ${p1.x} ${p1.y} L ${p2.x} ${p2.y}`} fill="none" stroke="#075B57" strokeWidth="2.5" strokeLinecap="round" />
                
                {/* Forecast Dashed Line */}
                <path d={`M ${p2.x} ${p2.y} L ${p3.x} ${p3.y}`} fill="none" stroke="#1E9E67" strokeWidth="2.5" strokeDasharray="4,4" strokeLinecap="round" />

                {/* Conformal Uncertainty Cone */}
                <polygon points={`${p2.x},${p2.y} ${p3.x},${p3.y - 7} ${p3.x},${p3.y + 7}`} fill="#1E9E67" fillOpacity="0.15" />

                {/* Node Points */}
                <circle cx={p0.x} cy={p0.y} r="2.5" fill="#075B57" />
                <circle cx={p1.x} cy={p1.y} r="2.5" fill="#075B57" />
                <circle cx={p2.x} cy={p2.y} r="4" fill="#075B57" stroke="#FFFFFF" strokeWidth="1.5" />
                <circle cx={p3.x} cy={p3.y} r="3.5" fill="#1E9E67" />
              </svg>
            </div>

            {/* Meal, Carbs & Hypo Risk Row */}
            <div className="grid grid-cols-2 gap-3 pt-1 border-t border-black/5 text-xs">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold text-[#66716F] uppercase block">
                  Meal Carbs:
                </span>
                <span className="font-extrabold text-[#063F3D] block text-sm">
                  {patientState.carbsConsumed}g Carbs
                </span>
                <span className="text-[10px] text-[#66716F] truncate block max-w-[140px]" title={patientState.mealDescription}>
                  {patientState.mealDescription || '2 rotis, dal tadka & rice'}
                </span>
              </div>

              <div className="space-y-0.5 text-right">
                <span className="text-[10px] font-bold text-[#66716F] uppercase block">
                  Hypo Risk:
                </span>
                <span className={`text-xs font-black px-2 py-0.5 rounded-full inline-block border ${riskBadge.bg} ${riskBadge.text} ${riskBadge.border}`}>
                  {riskBadge.label}
                </span>
                <span className="text-[10px] text-[#66716F] block">
                  IOB: {patientState.insulinOnBoard} U active
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 02. TRUST / VALUE STRIP */}
      {/* ========================================================================= */}
      <section className="bg-white border border-black/8 rounded-2xl p-4 sm:p-6 shadow-xs">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 divide-y md:divide-y-0 md:divide-x divide-black/5">
          <div className="space-y-1 pt-3 md:pt-0">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#075B57] block">
              INDIAN FOOD CONTEXT
            </span>
            <p className="text-xs font-bold text-[#063F3D]">
              Nutrition reference: ICMR-NIN IFCT 2017
            </p>
          </div>

          <div className="space-y-1 pt-3 md:pt-0 md:pl-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#075B57] block">
              MULTIMODAL AI
            </span>
            <p className="text-xs font-bold text-[#063F3D]">
              Natural text & meal photo recognition
            </p>
          </div>

          <div className="space-y-1 pt-3 md:pt-0 md:pl-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#075B57] block">
              EXPLAINABLE
            </span>
            <p className="text-xs font-bold text-[#063F3D]">
              Clear factor attribution drivers shown
            </p>
          </div>

          <div className="space-y-1 pt-3 md:pt-0 md:pl-6">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#075B57] block">
              CLINICAL CONTINUITY
            </span>
            <p className="text-xs font-bold text-[#063F3D]">
              Structured health journal & visit reports
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 03. THE PROBLEM SECTION (Dark Teal) */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-[#063F3D] text-white p-8 sm:p-12 lg:p-14 space-y-10 shadow-xl">
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFE280] bg-white/10 px-3 py-1 rounded-full">
            THE T1D CHALLENGE IN INDIA
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-editorial tracking-tight text-[#FAFBF8]">
            Every meal changes the equation.
          </h2>
          <p className="text-sm sm:text-base text-[#DFF4E8]/85 leading-relaxed font-normal">
            For people living with Type 1 diabetes, an Indian meal is rarely a single ingredient. Portion sizes, composite preparations, carbohydrate density, active insulin on board, physical movement, and metabolic timing all interact dynamically.
          </p>
        </div>

        {/* 3 Concise Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Problem 1 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="text-xs font-black text-[#FFE280] tracking-widest uppercase font-display">
              01 • IDENTIFICATION
            </div>
            <h3 className="text-lg font-bold text-white font-editorial">
              "What am I actually eating?"
            </h3>
            <p className="text-xs text-[#DFF4E8]/80 leading-relaxed font-normal">
              Composite Indian dishes like thalis, biryanis, and curries are difficult to dissect into accurate nutritional components using Western food trackers.
            </p>
          </div>

          {/* Problem 2 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="text-xs font-black text-[#FFE280] tracking-widest uppercase font-display">
              02 • QUANTIFICATION
            </div>
            <h3 className="text-lg font-bold text-white font-editorial">
              "How many carbs are really there?"
            </h3>
            <p className="text-xs text-[#DFF4E8]/80 leading-relaxed font-normal">
              Home recipes, oil content, and non-standardised bowl servings introduce significant carbohydrate variability (e.g. ±15–20g per meal).
            </p>
          </div>

          {/* Problem 3 */}
          <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3">
            <div className="text-xs font-black text-[#FFE280] tracking-widest uppercase font-display">
              03 • HYPOGLYCEMIA RISK
            </div>
            <h3 className="text-lg font-bold text-white font-editorial">
              "Could my glucose fall later?"
            </h3>
            <p className="text-xs text-[#DFF4E8]/80 leading-relaxed font-normal">
              Carbohydrates alone do not describe risk. Active insulin stacking and post-meal physical exercise can rapidly cause acute hypoglycemia.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 04. HOW GLUCOSAATHI WORKS (Horizontal Transformation Pipeline) */}
      {/* ========================================================================= */}
      <section className="space-y-8">
        <div className="max-w-2xl space-y-2">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight">
            From Indian plate to explainable prediction.
          </h2>
          <p className="text-sm text-[#5A6E85]">
            A transparent pipeline integrating authoritative nutrition references, multimodal understanding, and continuous physiological telemetry.
          </p>
        </div>

        {/* Horizontal Pipeline Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 items-stretch">
          
          {/* Step 1 */}
          <div className="editorial-card p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#075B57] uppercase tracking-wider block">
                01 • INPUT
              </span>
              <h4 className="text-xs font-black text-[#063F3D]">
                Indian Meal
              </h4>
              <p className="text-[11px] text-[#5A6E85]">
                "2 rotis, dal tadka & steamed rice"
              </p>
            </div>
            <div className="text-lg">🍛</div>
          </div>

          {/* Step 2 */}
          <div className="editorial-card p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#075B57] uppercase tracking-wider block">
                02 • PARSING
              </span>
              <h4 className="text-xs font-black text-[#063F3D]">
                AI Understanding
              </h4>
              <p className="text-[11px] text-[#5A6E85]">
                Extracts structured food components & portions
              </p>
            </div>
            <div className="text-lg">✨</div>
          </div>

          {/* Step 3 */}
          <div className="editorial-card p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#075B57] uppercase tracking-wider block">
                03 • NUTRITION
              </span>
              <h4 className="text-xs font-black text-[#063F3D]">
                ICMR-NIN IFCT 2017
              </h4>
              <p className="text-[11px] text-[#5A6E85]">
                Authoritative carbohydrate database lookup
              </p>
            </div>
            <div className="text-lg">📚</div>
          </div>

          {/* Step 4 */}
          <div className="editorial-card p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#075B57] uppercase tracking-wider block">
                04 • ESTIMATION
              </span>
              <h4 className="text-xs font-black text-[#063F3D]">
                Carbohydrate Range
              </h4>
              <p className="text-[11px] text-[#5A6E85]">
                68g total (60–76g range with confidence)
              </p>
            </div>
            <div className="text-lg">⚖️</div>
          </div>

          {/* Step 5 */}
          <div className="editorial-card p-4 space-y-2 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#075B57] uppercase tracking-wider block">
                05 • TELEMETRY
              </span>
              <h4 className="text-xs font-black text-[#063F3D]">
                Glucose + IOB + Exercise
              </h4>
              <p className="text-[11px] text-[#5A6E85]">
                Glucose: {patientState.glucose} • IOB: {patientState.insulinOnBoard}U • {patientState.activityLevel}
              </p>
            </div>
            <div className="text-lg">🩸</div>
          </div>

          {/* Step 6 */}
          <div className="editorial-card p-4 space-y-2 flex flex-col justify-between bg-[#DFF4E8]/50 border-[#B8E8D2]">
            <div className="space-y-1">
              <span className="text-[10px] font-black text-[#075B57] uppercase tracking-wider block">
                06 • OUTPUT
              </span>
              <h4 className="text-xs font-black text-[#075B57]">
                Explainable Risk
              </h4>
              <p className="text-[11px] text-[#075B57] font-bold">
                {riskBadge.label} • ~{patientState.forecast30mGlucose} mg/dL
              </p>
            </div>
            <div className="text-lg">🛡️</div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 05. LIVE INTERACTIVE DEMO (The Centerpiece Hackathon Simulator) */}
      {/* ========================================================================= */}
      <section ref={simulatorRef} id="live-demo" className="space-y-6 pt-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-4">
          <div className="space-y-1 max-w-2xl">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#075B57]" />
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
                LIVE INTERACTIVE DEMO
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight pt-1">
              Change the inputs. Watch the risk change.
            </h2>
            <p className="text-sm text-[#5A6E85]">
              Explore how glucose momentum, active insulin on board, meal carbohydrates, and physical activity affect short-term risk in real time.
            </p>
          </div>

          {/* Quick Presets */}
          <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
            <span className="text-xs font-bold text-[#66716F] mr-1">Presets:</span>
            <button
              onClick={() => applyPresetScenario('SAFE_LOW')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#DFF4E8] text-[#075B57] hover:opacity-85 transition-opacity"
            >
              Safe Baseline
            </button>
            <button
              onClick={() => applyPresetScenario('MODERATE_CAUTION')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FEF7E6] text-[#8D4023] hover:opacity-85 transition-opacity"
            >
              Active IOB Caution
            </button>
            <button
              onClick={() => applyPresetScenario('HIGH_RISK')}
              className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FDE8E9] text-[#C84B52] hover:opacity-85 transition-opacity"
            >
              Hypo Alert (&lt;70)
            </button>
          </div>
        </div>

        {/* Clean 2x3 Grid of Inputs */}
        <div className="editorial-card p-6 sm:p-8 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Input 1: Blood Glucose */}
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-black uppercase tracking-wider text-[#66716F]">
                  Blood Glucose
                </label>
                <span className="text-xl font-extrabold text-[#063F3D] font-display">
                  {patientState.glucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="260"
                step="1"
                value={patientState.glucose}
                onChange={(e) => updatePatientInput('glucose', Number(e.target.value))}
                className="w-full accent-[#075B57] h-2 bg-white rounded-lg cursor-pointer"
              />
              <div className="flex justify-between gap-1 pt-1">
                {[65, 85, 108, 150, 220].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updatePatientInput('glucose', v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      patientState.glucose === v
                        ? 'bg-[#075B57] text-white'
                        : 'bg-white border border-black/8 text-[#66716F] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    {v}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 2: Active Insulin (IOB) */}
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-black uppercase tracking-wider text-[#66716F]">
                  Active Insulin (IOB)
                </label>
                <span className="text-xl font-extrabold text-[#063F3D] font-display">
                  {patientState.insulinOnBoard} <span className="text-xs font-normal text-[#66716F]">Units</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.1"
                value={patientState.insulinOnBoard}
                onChange={(e) => updatePatientInput('insulinOnBoard', Number(e.target.value))}
                className="w-full accent-[#075B57] h-2 bg-white rounded-lg cursor-pointer"
              />
              <div className="flex justify-between gap-1 pt-1">
                {[0, 0.8, 2.0, 3.5, 5.0].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => updatePatientInput('insulinOnBoard', v)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      patientState.insulinOnBoard === v
                        ? 'bg-[#075B57] text-white'
                        : 'bg-white border border-black/8 text-[#66716F] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    {v}U
                  </button>
                ))}
              </div>
            </div>

            {/* Input 3: Meal Carbohydrates */}
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-black uppercase tracking-wider text-[#66716F]">
                  Meal Carbohydrates
                </label>
                <span className="text-xl font-extrabold text-[#063F3D] font-display">
                  {patientState.carbsConsumed} <span className="text-xs font-normal text-[#66716F]">g</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="2"
                value={patientState.carbsConsumed}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updatePatientInput('carbsConsumed', val);
                  updatePatientInput('carbsCovered', val);
                }}
                className="w-full accent-[#075B57] h-2 bg-white rounded-lg cursor-pointer"
              />
              <div className="flex justify-between gap-1 pt-1">
                {[15, 30, 68, 90, 120].map((v) => (
                  <button
                    key={v}
                    type="button"
                    onClick={() => {
                      updatePatientInput('carbsConsumed', v);
                      updatePatientInput('carbsCovered', v);
                    }}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      patientState.carbsConsumed === v
                        ? 'bg-[#075B57] text-white'
                        : 'bg-white border border-black/8 text-[#66716F] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    {v}g
                  </button>
                ))}
              </div>
            </div>

            {/* Input 4: Physical Activity */}
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-black uppercase tracking-wider text-[#66716F]">
                  Physical Activity
                </label>
                <span className="text-sm font-extrabold text-[#063F3D]">
                  {patientState.activityLevel}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-1.5 pt-1">
                {['Resting', 'Light', 'Moderate', 'Intense'].map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => updatePatientInput('activityLevel', act)}
                    className={`py-1.5 rounded-lg text-xs font-bold transition-all ${
                      patientState.activityLevel === act
                        ? 'bg-[#075B57] text-white shadow-xs'
                        : 'bg-white border border-black/8 text-[#66716F] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>

            {/* Input 5: Meal Timing */}
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-black uppercase tracking-wider text-[#66716F]">
                  Time Since Last Meal
                </label>
                <span className="text-sm font-extrabold text-[#063F3D]">
                  {patientState.timeSinceMealHours} hrs ago
                </span>
              </div>
              <input
                type="range"
                min="0.5"
                max="6"
                step="0.5"
                value={patientState.timeSinceMealHours}
                onChange={(e) => updatePatientInput('timeSinceMealHours', Number(e.target.value))}
                className="w-full accent-[#075B57] h-2 bg-white rounded-lg cursor-pointer"
              />
              <div className="flex justify-between gap-1 pt-1">
                {[0.5, 1.5, 2.0, 3.5, 5.0].map((h) => (
                  <button
                    key={h}
                    type="button"
                    onClick={() => updatePatientInput('timeSinceMealHours', h)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      patientState.timeSinceMealHours === h
                        ? 'bg-[#075B57] text-white'
                        : 'bg-white border border-black/8 text-[#66716F] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    {h}h
                  </button>
                ))}
              </div>
            </div>

            {/* Input 6: Glucose Trend */}
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-2.5">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-black uppercase tracking-wider text-[#66716F]">
                  Glucose Trend
                </label>
                <span className="text-xs font-extrabold text-[#075B57] capitalize">
                  {patientState.glucoseTrend.replace('_', ' ')}
                </span>
              </div>
              <div className="grid grid-cols-3 gap-1 pt-1">
                {[
                  { id: 'falling_rapidly', label: '↓↓ Fast Drop' },
                  { id: 'falling_slowly', label: '↘ Slow Drop' },
                  { id: 'stable', label: '→ Stable' },
                  { id: 'rising', label: '↗ Rising' },
                  { id: 'rising_rapidly', label: '↑↑ Fast Rise' }
                ].map((tr) => (
                  <button
                    key={tr.id}
                    type="button"
                    onClick={() => updatePatientInput('glucoseTrend', tr.id)}
                    className={`py-1.5 px-1 rounded-lg text-[10px] font-bold truncate transition-all ${
                      patientState.glucoseTrend === tr.id
                        ? 'bg-[#075B57] text-white shadow-xs'
                        : 'bg-white border border-black/8 text-[#66716F] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    {tr.label}
                  </button>
                ))}
              </div>
            </div>

          </div>

          {/* Dynamic Recomputation Result Banner */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#DFF4E8]/50 border border-[#B8E8D2] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="space-y-0.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-[#075B57]">
                LIVE RECOMPUTATION RESULT
              </span>
              <div className="text-sm font-extrabold text-[#063F3D]">
                {patientState.headline}
              </div>
              <p className="text-xs text-[#075B57]">
                30-min outlook: ~{patientState.forecast30mGlucose} mg/dL • Hypo Risk: {riskBadge.label}
              </p>
            </div>

            <button
              onClick={() => onNavigate('risk')}
              className="px-4 py-2 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-bold shrink-0 transition-colors shadow-xs"
            >
              Open Full Risk Sandbox →
            </button>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 06. EXPLAINABLE RISK ENGINE (Dark Teal Section) */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-[#063F3D] text-white p-8 sm:p-12 lg:p-14 space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/10 pb-6">
          <div className="space-y-2 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFE280] bg-white/10 px-3 py-1 rounded-full">
              EXPLAINABLE PHYSIOLOGICAL REASONING
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold font-editorial text-[#FAFBF8] tracking-tight pt-1">
              Risk is more than a number.
            </h2>
            <p className="text-sm text-[#DFF4E8]/85">
              Rather than a black-box percentage, GlucoSaathi attributes risk to specific physiological and behavioral drivers.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/10 border border-white/15 text-right shrink-0">
            <span className="text-[10px] font-bold text-[#DFF4E8] uppercase block">
              Evaluated Hypo Risk
            </span>
            <span className="text-2xl font-black text-[#FFE280] font-display block">
              {patientState.riskScore}% {patientState.riskClass}
            </span>
          </div>
        </div>

        {/* Qualitative Factor Contribution Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Factor 1 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#DFF4E8]">
                Glucose Momentum
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-[#FFE280]">
                {patientState.glucose < 85 ? 'HIGH IMPACT' : 'MODERATE'}
              </span>
            </div>
            <p className="text-xs text-[#DFF4E8]/80 leading-relaxed font-normal">
              {patientState.glucose < 70
                ? 'Current level is below clinical safety threshold (<70 mg/dL).'
                : `Current level (${patientState.glucose} mg/dL) with ${patientState.glucoseTrend.replace('_', ' ')} momentum.`}
            </p>
          </div>

          {/* Factor 2 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#DFF4E8]">
                Active Insulin (IOB)
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-[#FFE280]">
                {patientState.insulinOnBoard >= 2.0 ? 'ELEVATED' : 'LOW IMPACT'}
              </span>
            </div>
            <p className="text-xs text-[#DFF4E8]/80 leading-relaxed font-normal">
              {patientState.insulinOnBoard} U active bolus accelerates ongoing cellular glucose clearance.
            </p>
          </div>

          {/* Factor 3 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#DFF4E8]">
                Physical Activity
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-[#FFE280]">
                {patientState.activityLevel === 'Intense' || patientState.activityLevel === 'Moderate' ? 'HIGH UPTAKE' : 'BASELINE'}
              </span>
            </div>
            <p className="text-xs text-[#DFF4E8]/80 leading-relaxed font-normal">
              {patientState.activityLevel} activity increases skeletal muscle insulin-independent glucose uptake.
            </p>
          </div>

          {/* Factor 4 */}
          <div className="p-5 rounded-2xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase text-[#DFF4E8]">
                Carb Absorption
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white/10 text-[#DFF4E8]">
                PROTECTIVE
              </span>
            </div>
            <p className="text-xs text-[#DFF4E8]/80 leading-relaxed font-normal">
              {patientState.carbsConsumed}g carbohydrate intake buffers glucose downward trajectory during digestion.
            </p>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 07. HEALTH DASHBOARD PREVIEW */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-4">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
              CLINICAL DASHBOARD
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight pt-1">
              Your health picture, together.
            </h2>
            <p className="text-sm text-[#5A6E85]">
              Real-time glycemic metrics, Indian meal logs, and proactive alerts organized for daily clarity.
            </p>
          </div>

          <button
            onClick={() => onNavigate('dashboard')}
            className="px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold tracking-wide uppercase transition-all shadow-xs flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <span>Open Health Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Dashboard Realistic Preview Card */}
        <div className="editorial-card p-6 sm:p-8 space-y-6 border border-black/10">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-1">
              <span className="text-[10px] font-bold text-[#66716F] uppercase block">
                Current Glucose
              </span>
              <div className="text-2xl font-black text-[#063F3D] font-display">
                {patientState.glucose} mg/dL
              </div>
              <span className="text-[11px] text-[#075B57] font-bold">Target 70–140</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-1">
              <span className="text-[10px] font-bold text-[#66716F] uppercase block">
                Time in Range (TIR)
              </span>
              <div className="text-2xl font-black text-[#075B57] font-display">
                {patientState.todayMetrics.timeInRangePct}%
              </div>
              <span className="text-[11px] text-[#66716F]">Goal &gt;70%</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-1">
              <span className="text-[10px] font-bold text-[#66716F] uppercase block">
                30-Min Outlook
              </span>
              <div className="text-2xl font-black text-[#063F3D] font-display">
                ~{patientState.forecast30mGlucose} mg/dL
              </div>
              <span className="text-[11px] text-[#66716F]">Trajectory forecast</span>
            </div>

            <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-1">
              <span className="text-[10px] font-bold text-[#66716F] uppercase block">
                Hypo Risk
              </span>
              <div className="text-2xl font-black text-[#063F3D] font-display">
                {patientState.riskScore}%
              </div>
              <span className="text-[11px] text-[#075B57] font-bold">{patientState.riskClass}</span>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#F3F1EA] border border-black/5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
            <div className="space-y-0.5">
              <span className="font-bold text-[#063F3D]">Recent Logged Meal:</span>
              <span className="text-[#66716F] ml-1">
                {patientState.mealDescription || '2 rotis, dal tadka & rice'} ({patientState.carbsConsumed}g carbs • ICMR-NIN IFCT 2017)
              </span>
            </div>
            <span className="text-[#075B57] font-bold shrink-0">
              Active IOB: {patientState.insulinOnBoard} U
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 08. DOCTOR REPORT PREVIEW */}
      {/* ========================================================================= */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-4">
          <div className="space-y-1 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
              CLINICAL CONTINUITY
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight pt-1">
              Doctor Visit Summary
            </h2>
            <p className="text-sm text-[#5A6E85]">
              Structured clinical telemetry and meal reports designed for endocrinologists and diabetes educators.
            </p>
          </div>

          <button
            onClick={() => setIsDoctorReportModalOpen(true)}
            className="px-5 py-2.5 rounded-xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-xs font-extrabold text-[#063F3D] tracking-wide uppercase transition-all shadow-xs flex items-center space-x-1.5 self-start sm:self-auto"
          >
            <FileText className="w-3.5 h-3.5 text-[#1E9E67]" />
            <span>Open Doctor Report</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Document-Style Preview Card */}
        <div className="editorial-card p-6 sm:p-8 space-y-5 bg-white border border-black/10 shadow-sm">
          <div className="flex items-center justify-between border-b border-black/8 pb-4">
            <div>
              <span className="text-[10px] font-bold text-[#66716F] uppercase">Clinical Summary</span>
              <h3 className="text-lg font-extrabold text-[#063F3D] font-display">
                GlucoSaathi Telemetry Report — {settings.name}
              </h3>
            </div>
            <span className="text-xs font-bold text-[#075B57] bg-[#DFF4E8] px-3 py-1 rounded-full">
              ICMR-NIN IFCT 2017
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
            <div>
              <span className="text-[#66716F] block">Diagnosis:</span>
              <span className="font-bold text-[#063F3D]">{settings.condition}</span>
            </div>
            <div>
              <span className="text-[#66716F] block">Prescribed ICR:</span>
              <span className="font-bold text-[#075B57]">1 U : {settings.icrRatio}g Carbs</span>
            </div>
            <div>
              <span className="text-[#66716F] block">Time In Range:</span>
              <span className="font-bold text-[#075B57]">{patientState.todayMetrics.timeInRangePct}% (70–140 mg/dL)</span>
            </div>
            <div>
              <span className="text-[#66716F] block">Mean Glucose:</span>
              <span className="font-bold text-[#063F3D]">{patientState.todayMetrics.averageGlucose} mg/dL (Est. HbA1c 6.3%)</span>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 09. FINAL CTA SECTION (Dark Teal) */}
      {/* ========================================================================= */}
      <section className="rounded-3xl bg-[#063F3D] text-white p-8 sm:p-12 lg:p-14 text-center space-y-6 shadow-xl">
        <div className="max-w-2xl mx-auto space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#FFE280] bg-white/10 px-3 py-1 rounded-full">
            START WITH CLARITY
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-editorial text-[#FAFBF8] tracking-tight">
            Your next meal starts with clarity.
          </h2>
          <p className="text-sm sm:text-base text-[#DFF4E8]/85 leading-relaxed font-normal">
            Turn everyday Indian meals and glucose context into explainable, proactive decision support.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={() => onNavigate('meal')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-[#1E9E67] hover:bg-[#178556] text-white text-sm font-extrabold tracking-wide uppercase transition-all shadow-md flex items-center justify-center space-x-2"
          >
            <span>Analyze an Indian Meal</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            onClick={() => onNavigate('dashboard')}
            className="w-full sm:w-auto px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-sm font-extrabold tracking-wide transition-all flex items-center justify-center space-x-2"
          >
            <span>Open Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </section>

    </div>
  );
}
