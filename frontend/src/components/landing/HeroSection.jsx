import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import InteractiveWaveBackground from './InteractiveWaveBackground';
import GlucoseOrb from './GlucoseOrb';
import HealthSignalPanel from './HealthSignalPanel';
import { 
  ArrowRight, 
  Zap, 
  ChevronDown, 
  Activity, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';

export default function HeroSection({ onStartMeal, onExploreStory, onStartDemo }) {
  const { currentPersona, riskInputs, riskEvaluation } = useApp();
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    const { innerWidth, innerHeight } = window;
    const x = (clientX / innerWidth - 0.5) * 30;
    const y = (clientY / innerHeight - 0.5) * 30;
    setMousePos({ x, y });
  };

  return (
    <section 
      onMouseMove={handleMouseMove}
      className="relative min-h-[95vh] flex flex-col justify-between pt-24 pb-12 px-4 sm:px-6 lg:px-8 overflow-hidden bg-[#F7F7F3]"
    >
      {/* 1. Interactive Living Glucose Data Wave */}
      <InteractiveWaveBackground 
        glucose={riskInputs.glucose} 
        riskLevel={riskEvaluation.riskLevel}
        mousePos={mousePos}
      />

      {/* 2. Main Narrative & Orb Container */}
      <div className="relative max-w-6xl mx-auto w-full text-center space-y-8 z-10 my-auto">
        {/* Subtle Brand Badge */}
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#EFF8F3] border border-[#DCE6E2] shadow-xs">
          <span className="w-2 h-2 rounded-full bg-[#24A66A] animate-pulse" />
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] font-display">
            GLUCOSAATHI • INDIA-FIRST T1D COMPANION
          </span>
          <span className="text-[11px] text-[#657572] font-medium hidden sm:inline">
            • AI4SDG Hackathon 2026
          </span>
        </div>

        {/* Huge Editorial Headline */}
        <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-[5.5rem] font-black text-[#043F3D] font-editorial tracking-tight leading-[1.03] max-w-4xl mx-auto">
          Eat with clarity. <br className="hidden sm:inline" />
          <span className="text-[#075B57]">Live with confidence.</span>
        </h1>

        {/* Supporting Editorial Paragraph */}
        <p className="text-base sm:text-lg md:text-xl text-[#657572] font-normal max-w-2xl mx-auto leading-relaxed">
          AI-assisted meal understanding and explainable hypoglycemia risk insights designed around Indian meals and Type 1 diabetes.
        </p>

        {/* CTA Button Row */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            onClick={onStartMeal}
            className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#075B57] hover:bg-[#043F3D] text-white text-sm font-bold tracking-wide uppercase transition-all shadow-md hover:shadow-lg flex items-center justify-center space-x-2 group"
          >
            <span>Estimate Indian Meal</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>

          <button
            onClick={onStartDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-full bg-white hover:bg-[#F1EEE6] border border-[#DCE6E2] text-sm font-bold text-[#075B57] transition-all shadow-xs flex items-center justify-center space-x-2"
          >
            <Zap className="w-4 h-4 text-[#E7B84B]" />
            <span>Try Interactive Demo</span>
          </button>
        </div>

        {/* 3. Central Focal: Glucose Intelligence Orb */}
        <div className="pt-6 sm:pt-8">
          <GlucoseOrb 
            glucose={riskInputs.glucose}
            iob={riskInputs.insulinOnBoard}
            carbs={riskInputs.carbsConsumed}
            activity={riskInputs.activityLevel}
          />
        </div>

        {/* 4. Horizontal Health Signal Instrument Panel */}
        <div className="pt-4 sm:pt-6">
          <HealthSignalPanel 
            glucose={riskInputs.glucose}
            iob={riskInputs.insulinOnBoard}
            carbs={riskInputs.carbsConsumed}
            riskLevel={riskEvaluation.riskLevel}
            riskScore={riskEvaluation.score}
          />
        </div>

        {/* Active Persona Snapshot */}
        <div className="text-xs text-[#657572] font-medium pt-1">
          Evaluating as <strong className="text-[#043F3D]">{currentPersona.name} ({currentPersona.age}y)</strong> • {currentPersona.regimen}
        </div>
      </div>

      {/* 5. Scroll to Explore Indicator */}
      <div className="relative text-center pt-8 z-10">
        <button
          onClick={onExploreStory}
          className="inline-flex flex-col items-center space-y-1 text-xs font-bold text-[#657572] hover:text-[#075B57] transition-colors group cursor-pointer"
        >
          <span className="tracking-wider uppercase text-[10px]">Scroll to explore journey</span>
          <ChevronDown className="w-4 h-4 transition-transform group-hover:translate-y-1 text-[#24A66A]" />
        </button>
      </div>
    </section>
  );
}
