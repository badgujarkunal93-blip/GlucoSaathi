import React from 'react';
import HeroIntelligenceVisual from './HeroIntelligenceVisual';
import { ArrowRight, ChevronDown, Sparkles, Shield, HeartPulse, Scale } from 'lucide-react';

export default function HeroSection({ onStartAssessment }) {
  const videoUrl = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_HERO_VIDEO_URL
    ? import.meta.env.VITE_HERO_VIDEO_URL
    : null;

  const handleScrollToProblem = (e) => {
    e.preventDefault();
    const elem = document.querySelector('#problem');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative min-h-[85vh] sm:min-h-[90vh] flex items-center justify-center py-12 lg:py-20 overflow-hidden">
      
      {/* 1. Ambient Background Video (Subtle 10-15% Opacity with Clinical Overlay) */}
      {videoUrl && (
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-12 filter blur-xs"
          >
            <source src={videoUrl} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-[#F7F8F5]/80 via-[#F7F8F5]/90 to-[#F7F8F5]" />
        </div>
      )}

      {/* 2. Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Left Column: Headlines & CTAs (7 Cols) */}
          <div className="lg:col-span-7 space-y-6 text-left">
            
            {/* Clinical Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DFF4E8] text-[#075B57] text-xs font-black uppercase tracking-widest border border-[#B8E8D2] shadow-xs">
              <span className="w-2 h-2 rounded-full bg-[#1E9E67] animate-ping" />
              <span>T1D CLINICAL DECISION SUPPORT</span>
            </div>

            {/* Giant Editorial Heading */}
            <div className="space-y-1">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-[#063F3D] font-display tracking-tight leading-[1.08]">
                Understand your meal. <br />
                Understand <span className="text-[#1E9E67]">your risk.</span>
              </h1>
            </div>

            {/* Supporting Paragraph */}
            <p className="text-sm sm:text-base lg:text-lg text-[#5A6E85] max-w-xl font-normal leading-relaxed">
              AI-assisted analysis of Indian meals, continuous glucose velocity, active insulin on board, and physical activity — designed to make Type 1 diabetes decisions transparent, explainable, and proactive.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-2">
              <button
                onClick={onStartAssessment}
                className="px-8 py-4 rounded-2xl bg-[#075B57] hover:bg-[#063F3D] text-white text-sm font-black uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2.5 transition-all hover:scale-102 cursor-pointer group"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleScrollToProblem}
                className="px-6 py-4 rounded-2xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-xs font-bold text-[#063F3D] shadow-xs flex items-center justify-center space-x-1.5 transition-all"
              >
                <span>See How It Works</span>
                <ChevronDown className="w-4 h-4 text-[#66716F]" />
              </button>
            </div>

            {/* Value Pillars Strip */}
            <div className="pt-4 border-t border-black/8 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs font-bold text-[#66716F]">
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#075B57]" />
                <span>Natural Language Meal Extraction</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E67]" />
                <span>ICMR-NIN IFCT 2017 Ground-Truth</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D4023]" />
                <span>Explainable Hypoglycemia Risk</span>
              </span>
            </div>

          </div>

          {/* Right Column: Hero Intelligence Visual (5 Cols) */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <HeroIntelligenceVisual />
          </div>

        </div>
      </div>

    </section>
  );
}
