import React, { useRef } from 'react';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import IndianFoodBento from './IndianFoodBento';
import MealStorySection from './MealStorySection';
import ContextRiskSection from './ContextRiskSection';
import DashboardAssemblySection from './DashboardAssemblySection';
import HowItWorksSection from './HowItWorksSection';
import { ArrowRight, Zap, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LandingJourney({ onNavigate, onStartDemo }) {
  const howItWorksRef = useRef(null);

  const handleExploreStory = () => {
    howItWorksRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleBentoFoodSelect = (foodDescription) => {
    onNavigate('meal');
  };

  const handleTriggerDemo = () => {
    onStartDemo();
    confetti({ particleCount: 45, spread: 60, origin: { y: 0.6 } });
  };

  return (
    <div className="w-full space-y-0 animate-fade-in overflow-hidden -mx-4 sm:-mx-6 lg:-mx-8">
      {/* 1. HERO SECTION (Warm White #F7F7F3) */}
      <HeroSection 
        onStartMeal={() => onNavigate('meal')}
        onExploreStory={handleExploreStory}
        onStartDemo={handleTriggerDemo}
      />

      {/* 2. THE PROBLEM SECTION (Deep Teal #043F3D) */}
      <ProblemSection />

      {/* 3. INDIAN FOOD BENTO SECTION (Warm Cream #F1EEE6) */}
      <IndianFoodBento onSelectFood={handleBentoFoodSelect} />

      {/* 4. AI MEAL PARSING & CARB ESTIMATION SECTION (White #FFFFFF) */}
      <MealStorySection onNavigateToMeal={() => onNavigate('meal')} />

      {/* 5. EXPLAINABLE HYPOGLYCEMIA RISK SECTION (Deep Teal #043F3D) */}
      <ContextRiskSection onNavigateToRisk={() => onNavigate('risk')} />

      {/* 6. BENTO DASHBOARD ASSEMBLY SECTION (Warm Cream #F1EEE6) */}
      <DashboardAssemblySection onNavigateToDashboard={() => onNavigate('dashboard')} />

      {/* 7. 4-STAGE HOW IT WORKS SECTION (White #FFFFFF) */}
      <div ref={howItWorksRef} className="bg-white">
        <HowItWorksSection />
      </div>

      {/* 8. FINAL EDITORIAL CTA (Deep Teal #075B57) */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-[#075B57] to-[#043F3D] text-white text-center">
        <div className="max-w-4xl mx-auto space-y-8">
          <div className="space-y-4">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#DFF4E8] font-display">
              READY FOR HACKATHON EVALUATION
            </span>
            <h2 className="text-4xl sm:text-6xl font-black font-editorial tracking-tight text-white leading-[1.05]">
              Your next meal starts with clarity.
            </h2>
            <p className="text-base sm:text-lg text-[#DFF4E8]/80 max-w-xl mx-auto leading-relaxed">
              Experience the complete interactive journey with real Indian thalis, live glucose context, and transparent clinical risk reasoning.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('meal')}
              className="px-8 py-3.5 rounded-full bg-[#24A66A] hover:bg-[#1E8E5A] text-white text-sm font-bold tracking-wide uppercase transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span>Estimate an Indian Meal</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              onClick={() => onNavigate('dashboard')}
              className="px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white text-sm font-bold transition-all border border-white/20"
            >
              Open Bento Dashboard
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
