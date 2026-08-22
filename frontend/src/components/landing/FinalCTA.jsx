import React from 'react';
import { ArrowRight, Sparkles, Activity } from 'lucide-react';

export default function FinalCTA({ onStartAssessment }) {
  const handleScrollToPipeline = (e) => {
    e.preventDefault();
    const elem = document.querySelector('#pipeline');
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="py-16 sm:py-24 bg-[#063F3D] text-white rounded-3xl my-12 shadow-2xl relative overflow-hidden text-center">
      
      {/* Subtle Background Radial Glow */}
      <div className="absolute inset-0 bg-gradient-to-r from-[#075B57] via-[#063F3D] to-[#063F3D] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#1E9E67]/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="inline-flex items-center space-x-2 px-3.5 py-1 rounded-full bg-white/10 text-[#DFF4E8] text-xs font-black uppercase tracking-widest border border-white/15">
          <Sparkles className="w-3.5 h-3.5" />
          <span>START PATIENT EVALUATION</span>
        </div>

        <div className="space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            Ready to understand the whole picture?
          </h2>
          <p className="text-sm sm:text-base text-[#DFF4E8]/85 max-w-xl mx-auto leading-relaxed">
            Enter your patient metrics, decompose composite Indian meals with ICMR-NIN accuracy, and generate explainable near-term risk forecasts in seconds.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3.5 pt-2">
          <button
            onClick={onStartAssessment}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white hover:bg-[#F3F1EA] text-[#063F3D] text-sm font-black uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2.5 transition-all hover:scale-102 cursor-pointer group"
          >
            <span>Start Assessment</span>
            <ArrowRight className="w-4 h-4 text-[#075B57] group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={handleScrollToPipeline}
            className="w-full sm:w-auto px-6 py-4 rounded-2xl bg-white/10 hover:bg-white/15 border border-white/20 text-xs font-bold text-white flex items-center justify-center space-x-1.5 transition-all"
          >
            <span>Explore The Pipeline</span>
          </button>
        </div>

        <div className="pt-6 border-t border-white/10 text-[11px] text-[#DFF4E8]/70 flex items-center justify-center space-x-2">
          <Activity className="w-3.5 h-3.5 text-[#1E9E67]" />
          <span>Innovate 4 Impact: AI4SDG Global Hackathon 2026 • UN SDG 3</span>
        </div>

      </div>

    </section>
  );
}
