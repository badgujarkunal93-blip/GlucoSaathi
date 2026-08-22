import React from 'react';
import { Utensils, Sparkles, ShieldCheck, HeartPulse } from 'lucide-react';

export default function CapabilitiesSection() {
  const capabilities = [
    {
      num: '01',
      title: 'India-First Meal Context',
      desc: 'Built around regional Indian culinary traditions (rotis, thalis, biryanis, dosa-sambar, poha) mapped deterministically to the ICMR-NIN Indian Food Composition Tables (IFCT 2017).',
      icon: Utensils,
      color: '#8D4023',
      bg: '#FCECE6'
    },
    {
      num: '02',
      title: 'Multimodal AI Input',
      desc: 'Type natural language in Hindi or English ("2 rotis, dal tadka and rice") or pick plate photos. Structured food entities and volumetric units are extracted instantly.',
      icon: Sparkles,
      color: '#075B57',
      bg: '#DFF4E8'
    },
    {
      num: '03',
      title: 'Explainable Risk Modeling',
      desc: 'LightGBM classifier trained on OhioT1DM & HUPA-UCM datasets with Platt scaling calibration. Surfacing normalized attribution drivers (Momentum, IOB, Exercise).',
      icon: ShieldCheck,
      color: '#075B57',
      bg: '#DFF4E8'
    },
    {
      num: '04',
      title: 'Clinical Continuity',
      desc: 'Transforms isolated decision-support assessments into longitudinal health journals, Bento dashboards, and exportable endocrinologist consultation reports.',
      icon: HeartPulse,
      color: '#1E9E67',
      bg: '#DFF4E8'
    }
  ];

  return (
    <section id="capabilities" className="py-16 sm:py-24 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DFF4E8] text-[#075B57] text-xs font-black uppercase tracking-widest border border-[#B8E8D2]">
          <span>CORE SYSTEM CAPABILITIES</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063F3D] font-display tracking-tight">
          Engineered for Indian T1D complexity.
        </h2>
        <p className="text-xs sm:text-sm text-[#66716F] leading-relaxed">
          Four foundational pillars combining cultural nutritional accuracy, machine learning rigor, and clinical transparency.
        </p>
      </div>

      {/* 4 Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {capabilities.map((cap) => {
          const Icon = cap.icon;
          return (
            <div 
              key={cap.num}
              className="editorial-card p-8 bg-white border border-black/8 hover:border-[#075B57] transition-all space-y-4 shadow-sm"
            >
              <div className="flex items-center justify-between">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center shadow-xs"
                  style={{ backgroundColor: cap.bg, color: cap.color }}
                >
                  <Icon className="w-5 h-5" />
                </div>
                <span className="text-xl font-black text-[#66716F] font-display">
                  {cap.num}
                </span>
              </div>

              <div className="space-y-1.5">
                <h3 className="text-lg font-extrabold text-[#063F3D] font-display">
                  {cap.title}
                </h3>
                <p className="text-xs sm:text-sm text-[#66716F] leading-relaxed">
                  {cap.desc}
                </p>
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
