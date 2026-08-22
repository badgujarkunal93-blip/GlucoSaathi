import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Utensils, 
  Syringe, 
  Flame, 
  Sparkles, 
  Cpu, 
  ShieldCheck, 
  LayoutDashboard, 
  ArrowRight,
  TrendingDown,
  CheckCircle2
} from 'lucide-react';

export default function HeroIntelligenceVisual() {
  const [pulseStep, setPulseStep] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseStep((prev) => (prev + 1) % 4);
    }, 2400);
    return () => clearInterval(timer);
  }, []);

  const inputSignals = [
    { id: 'glu', label: 'Glucose Telemetry', value: '108 mg/dL ↘', icon: Activity, color: '#075B57', bg: '#DFF4E8' },
    { id: 'meal', label: 'Indian Meal', value: '2 Rotis + Dal Tadka', icon: Utensils, color: '#8D4023', bg: '#FCECE6' },
    { id: 'ins', label: 'Active Insulin', value: '0.8 U Active IOB', icon: Syringe, color: '#075B57', bg: '#DFF4E8' },
    { id: 'act', label: 'Physical Movement', value: 'Light Walk (30 min)', icon: Flame, color: '#1E9E67', bg: '#DFF4E8' }
  ];

  return (
    <div className="relative w-full max-w-xl mx-auto">
      {/* Decorative Outer Glow */}
      <div className="absolute -inset-1.5 bg-gradient-to-r from-[#075B57]/15 to-[#1E9E67]/20 rounded-3xl blur-lg pointer-events-none" />

      {/* Main Glass Panel */}
      <div className="relative bg-white/95 backdrop-blur-md rounded-2xl border border-black/10 shadow-2xl p-6 sm:p-7 space-y-5">
        
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-black/8 pb-3.5">
          <div className="flex items-center space-x-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#075B57] text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4 text-[#DFF4E8]" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="text-xs font-black text-[#063F3D] font-display uppercase tracking-wider">
                  GLUCOSAATHI INTELLIGENCE CORE
                </span>
              </div>
              <span className="text-[10px] text-[#66716F]">
                Continuous Multimodal Context Synthesis
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-[#DFF4E8] text-[#075B57] text-[10px] font-black uppercase tracking-wider border border-[#B8E8D2]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E67] animate-pulse" />
            <span>LIVE CONTEXT FLOW</span>
          </div>
        </div>

        {/* Input Signals Stream */}
        <div className="space-y-2">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-[#66716F] block">
            PATIENT CONTEXT SIGNALS
          </span>
          <div className="grid grid-cols-2 gap-2">
            {inputSignals.map((sig, i) => {
              const Icon = sig.icon;
              const isPulsing = pulseStep === i;
              return (
                <div 
                  key={sig.id}
                  className={`p-2.5 rounded-xl border transition-all duration-300 flex items-center space-x-2.5 ${
                    isPulsing
                      ? 'bg-white border-[#075B57] shadow-sm ring-1 ring-[#075B57]/20 scale-102'
                      : 'bg-[#F7F8F5] border-black/5'
                  }`}
                >
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                    style={{ backgroundColor: sig.bg, color: sig.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-[#66716F] block uppercase truncate">
                      {sig.label}
                    </span>
                    <span className="text-xs font-black text-[#063F3D] truncate block">
                      {sig.value}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dynamic Convergence Visual Conduit */}
        <div className="relative py-1 flex items-center justify-center">
          <div className="w-full h-px bg-gradient-to-r from-transparent via-[#075B57]/30 to-transparent" />
          <div className="absolute px-3 py-0.5 bg-white border border-black/10 rounded-full text-[9px] font-extrabold text-[#075B57] uppercase tracking-wider shadow-xs">
            TRANSFORMATION & INFERENCE
          </div>
        </div>

        {/* 3-Stage Pipeline Output Cards */}
        <div className="grid grid-cols-3 gap-2 text-center">
          
          {/* Stage 1: AI Nutrition */}
          <div className="p-3 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-1">
            <span className="text-[9px] font-black uppercase text-[#8D4023] block tracking-tight">
              01 • NUTRITION
            </span>
            <div className="text-xs font-black text-[#063F3D]">
              ICMR-NIN IFCT
            </div>
            <span className="text-[10px] text-[#66716F] block">
              60–76g Carbs
            </span>
          </div>

          {/* Stage 2: ML Inference */}
          <div className="p-3 rounded-xl bg-[#DFF4E8]/60 border border-[#B8E8D2] space-y-1 shadow-xs">
            <span className="text-[9px] font-black uppercase text-[#075B57] block tracking-tight">
              02 • ML MODEL
            </span>
            <div className="text-xs font-black text-[#075B57]">
              Calibrated LightGBM
            </div>
            <span className="text-[10px] text-[#075B57] font-bold block">
              P(Hypo) = 15%
            </span>
          </div>

          {/* Stage 3: Forecast */}
          <div className="p-3 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-1">
            <span className="text-[9px] font-black uppercase text-[#063F3D] block tracking-tight">
              03 • 30M FORECAST
            </span>
            <div className="text-xs font-black text-[#063F3D]">
              Conformal Band
            </div>
            <span className="text-[10px] text-[#66716F] block">
              ~79 mg/dL
            </span>
          </div>

        </div>

        {/* Footer Guarantee Strip */}
        <div className="p-2.5 rounded-xl bg-[#F3F1EA] border border-black/5 flex items-center justify-between text-[10px] text-[#063F3D] font-bold">
          <div className="flex items-center space-x-1.5">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#1E9E67]" />
            <span>Deterministic Safety Rules + Clinical Explainability</span>
          </div>
          <span className="text-[9px] text-[#66716F] uppercase">UN SDG 3</span>
        </div>

      </div>
    </div>
  );
}
