import React from 'react';
import { ShieldCheck, AlertTriangle, AlertOctagon, HelpCircle, Activity, ArrowRight } from 'lucide-react';

export default function ContextRiskSection({ onNavigateToRisk }) {
  const factors = [
    {
      name: 'Insulin On Board (IOB)',
      weight: '40% Weight',
      impact: 'HIGH IMPACT',
      explanation: 'Active circulating bolus from previous meal. Stacking insulin without sufficient carbs is the primary driver of hypoglycemia.',
      color: '#DFF4E8'
    },
    {
      name: 'Carbohydrate Absorption Balance',
      weight: '30% Weight',
      impact: 'BALANCING FACTOR',
      explanation: 'Digestible carbohydrates counteracting insulin action. Low carb consumption or delayed gastric emptying elevates risk.',
      color: '#FEF7E6'
    },
    {
      name: 'Physical Activity & Muscle Sensitivity',
      weight: '20% Weight',
      impact: 'GLUCOSE SINK',
      explanation: 'Exercise enhances muscle glucose uptake independently of insulin, accelerating blood sugar drops post-workout.',
      color: '#EFF8F3'
    },
    {
      name: 'Fasting Duration & Meal Timing',
      weight: '10% Weight',
      impact: 'TEMPORAL DRIFT',
      explanation: 'Time elapsed since last meal; absorption tapers off after 3 hours while basal insulin continues baseline clearance.',
      color: '#F7F7F3'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#043F3D] text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Editorial Section Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#24A66A] font-display">
            STAGE 04 • EXPLAINABLE HYPOGLYCEMIA RISK
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-editorial tracking-tight text-white leading-[1.04]">
            Risk is more than a number. <br />
            <span className="text-[#24A66A]">Understand why.</span>
          </h2>
          <p className="text-base sm:text-lg text-[#DFF4E8]/80 leading-relaxed max-w-2xl">
            Carbs are only part of the story. Active insulin, exercise, and timing converge dynamically. GlucoSaathi breaks down every contributing factor with plain clinical transparency.
          </p>
        </div>

        {/* 2-Column Risk & Explainability Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left: Large Radial Risk Centerpiece (5 cols) */}
          <div className="lg:col-span-5 p-8 rounded-[28px] bg-white/5 border border-white/10 flex flex-col justify-between space-y-8">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black uppercase tracking-wider text-[#DFF4E8]">
                  EVALUATION CENTERPIECE
                </span>
                <span className="text-[10px] font-bold text-[#103331] bg-[#24A66A] px-2.5 py-0.5 rounded-full">
                  LIVE SCORE: 58/100
                </span>
              </div>

              {/* Central Radial Ring Visual */}
              <div className="text-center py-4 space-y-2">
                <div className="w-32 h-32 mx-auto rounded-full border-4 border-[#E7B84B] bg-[#E7B84B]/10 flex flex-col items-center justify-center shadow-lg">
                  <span className="text-3xl font-black font-editorial text-white">
                    MODERATE
                  </span>
                  <span className="text-[11px] font-bold text-[#E7B84B]">
                    Hypo Risk
                  </span>
                </div>
                <p className="text-xs text-[#DFF4E8]/80 max-w-xs mx-auto pt-2">
                  Moderate caution advised: active IOB clearance coinciding with post-walk muscle sensitivity.
                </p>
              </div>

              {/* Rule of 15 Protocol Badge */}
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#DFF4E8] space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-[#24A66A]">
                  <ShieldCheck className="w-4 h-4" />
                  <span>Clinical Rule of 15 Armed</span>
                </div>
                <p className="text-[11px] text-[#DFF4E8]/70">
                  Auto-triggers immediate fast-acting carbohydrate protocol if glucose drops below 70 mg/dL.
                </p>
              </div>
            </div>

            <button
              onClick={onNavigateToRisk}
              className="w-full py-3.5 rounded-xl bg-[#24A66A] hover:bg-[#1E8E5A] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-1.5"
            >
              <span>Test Interactive Risk Sliders</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Right: Vertical "Why?" Factor Breakdown Timeline (7 cols) */}
          <div className="lg:col-span-7 p-8 rounded-[28px] bg-white/5 border border-white/10 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <span className="text-xs font-black uppercase tracking-wider text-[#DFF4E8] flex items-center space-x-1.5">
                <HelpCircle className="w-4 h-4 text-[#24A66A]" />
                <span>Deterministic 4-Factor Breakdown ("Why?"):</span>
              </span>
              <span className="text-[11px] text-[#DFF4E8]/60">Transparent Math</span>
            </div>

            <div className="space-y-3">
              {factors.map((f, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/8 transition-colors space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <strong className="text-sm font-bold text-white font-display">
                      {f.name}
                    </strong>
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#24A66A] bg-white/10 px-2 py-0.5 rounded-md">
                      {f.weight}
                    </span>
                  </div>
                  <p className="text-xs text-[#DFF4E8]/75 leading-relaxed">
                    {f.explanation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
