import React from 'react';
import { ShieldCheck, Eye, Lock, Stethoscope, CheckCircle2 } from 'lucide-react';

export default function ResponsibleAISection() {
  const trustPoints = [
    {
      title: 'Transparent Reasoning',
      desc: 'No black-box predictions. Every assessment breaks down relative attribution weights across glucose momentum, active insulin, exercise, and carbohydrate absorption.',
      icon: Eye
    },
    {
      title: 'Patient-Controlled Baseline',
      desc: 'All ICR ratios, correction factors, and glycemic target ranges are entered directly from your clinician’s prescription. The system never infers medication parameters.',
      icon: Lock
    },
    {
      title: 'Zero Autonomous Dosing',
      desc: 'GlucoSaathi is an investigational decision-support tool. It does not prescribe, adjust, or administer insulin doses autonomously.',
      icon: ShieldCheck
    },
    {
      title: 'Endocrinologist Collaboration',
      desc: 'Standardized visit summaries and longitudinal CSV exports provide structured clinical evidence for high-signal medical appointments.',
      icon: Stethoscope
    }
  ];

  return (
    <section id="trust" className="py-16 sm:py-24 space-y-12">
      
      {/* Header */}
      <div className="max-w-3xl space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DFF4E8] text-[#075B57] text-xs font-black uppercase tracking-widest border border-[#B8E8D2]">
          <span>RESPONSIBLE CLINICAL AI</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063F3D] font-display tracking-tight">
          Built to explain. Designed to assist.
        </h2>
        <p className="text-xs sm:text-sm text-[#66716F] leading-relaxed">
          GlucoSaathi follows strict medical AI ethics, separating statistical machine learning forecasts from hardcoded physiological emergency guardrails.
        </p>
      </div>

      {/* Grid of Trust Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {trustPoints.map((tp) => {
          const Icon = tp.icon;
          return (
            <div 
              key={tp.title}
              className="editorial-card p-6 sm:p-7 bg-white border border-black/8 space-y-3 shadow-xs"
            >
              <div className="w-9 h-9 rounded-xl bg-[#DFF4E8] text-[#075B57] flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
              <h3 className="text-base font-extrabold text-[#063F3D] font-display">
                {tp.title}
              </h3>
              <p className="text-xs sm:text-sm text-[#66716F] leading-relaxed">
                {tp.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Emergency Notice Banner */}
      <div className="p-4 rounded-2xl bg-[#FEF7E6] border border-[#FFE280] flex items-start space-x-3 text-xs text-[#8D4023]">
        <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
        <p className="leading-relaxed">
          <strong>Clinical Rule of 15 Protocol Armed:</strong> If blood glucose falls below 70 mg/dL at any point, the emergency safety protocol triggers unconditionally regardless of statistical model output.
        </p>
      </div>

    </section>
  );
}
