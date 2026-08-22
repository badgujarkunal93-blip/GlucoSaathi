import React from 'react';
import HeroIntelligenceVisual from './HeroIntelligenceVisual';
import { ArrowRight, ChevronDown } from 'lucide-react';

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
    <section className="relative min-h-[calc(100vh-76px)] flex items-center justify-center py-6 sm:py-10 lg:py-12 overflow-hidden">
      
      {/* 1. Ambient Background Video Layer (Subtle 10-15% Opacity) */}
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
          <div className="absolute inset-0 bg-gradient-to-b from-[#F7F8F4]/80 via-[#F7F8F4]/90 to-[#F7F8F4]" />
        </div>
      )}

      {/* 2. Hero Content Container (Vertically Centered Composition) */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-center">
          
          {/* Left Column: Headlines, Copy & CTAs (7 Cols) */}
          <div className="lg:col-span-7 flex flex-col justify-center text-left">
            
            {/* Clinical Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#DFF4E8] text-[#075B57] text-xs font-black uppercase tracking-widest border border-[#B8E8D2] shadow-xs mb-5 self-start">
              <span className="w-2 h-2 rounded-full bg-[#1E9E67] animate-ping" />
              <span>T1D CLINICAL DECISION SUPPORT</span>
            </div>

            {/* Giant Editorial Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-[66px] xl:text-[74px] font-extrabold text-[#063F3D] font-display tracking-tight leading-[0.98] mb-5">
              Understand your meal. <br />
              Understand <span className="text-[#1E9E67]">your risk.</span>
            </h1>

            {/* Supporting Paragraph */}
            <p className="text-base sm:text-lg text-[#5A6E85] max-w-xl font-normal leading-relaxed mb-7">
              AI-assisted analysis of Indian meals, continuous glucose velocity, active insulin on board, and physical activity — designed to make Type 1 diabetes decisions transparent, explainable, and proactive.
            </p>

            {/* CTA Buttons Row */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 mb-7">
              <button
                onClick={onStartAssessment}
                className="h-[54px] sm:h-[58px] px-8 rounded-2xl bg-[#075B57] hover:bg-[#063F3D] text-white text-sm font-black uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2.5 transition-all hover:scale-102 cursor-pointer group"
              >
                <span>Start Assessment</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={handleScrollToProblem}
                className="h-[54px] sm:h-[58px] px-6 rounded-2xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-xs font-bold text-[#063F3D] shadow-xs flex items-center justify-center space-x-1.5 transition-all cursor-pointer"
              >
                <span>See How It Works</span>
                <ChevronDown className="w-4 h-4 text-[#66716F]" />
              </button>
            </div>

            {/* Capability Metadata Strip (No full-width dividing line) */}
            <div className="flex flex-wrap items-center gap-y-2 gap-x-5 text-xs font-bold text-[#66716F]">
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#075B57]" />
                <span>Natural Language Meal Extraction</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E67]" />
                <span>ICMR–NIN IFCT Reference</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-[#8D4023]" />
                <span>Explainable Hypoglycemia Risk</span>
              </span>
            </div>

          </div>

          {/* Right Column: Intelligence Core Panel (5 Cols - Vertically Centered) */}
          <div className="lg:col-span-5 flex items-center justify-center lg:justify-end">
            <HeroIntelligenceVisual />
          </div>

        </div>
      </div>

    </section>
  );
}
