import React from 'react';
import { Camera, Scale, ShieldCheck, HeartPulse } from 'lucide-react';

export default function HowItWorksSection() {
  const steps = [
    {
      number: '01',
      title: 'Log your meal naturally',
      icon: Camera,
      badge: 'MULTIMODAL AI',
      description: 'Describe what you ate in natural Hindi/English (e.g. "2 rotis and 1 bowl dal") or snap a photo of your plate. Google Gemini 1.5 Flash identifies dishes and maps them to our ICMR-NIN database.'
    },
    {
      number: '02',
      title: 'Understand carb ranges',
      icon: Scale,
      badge: 'NO FALSE PRECISION',
      description: 'Because home recipes vary, GlucoSaathi provides realistic carbohydrate ranges (e.g. 68g, 60–75g) and confidence scores instead of misleading single-digit absolutes.'
    },
    {
      number: '03',
      title: 'Evaluate contextual risk',
      icon: ShieldCheck,
      badge: 'EXPLAINABLE ENGINE',
      description: 'Our transparent 4-factor engine weighs your current glucose, active Insulin On Board (IOB), carb coverage, and exercise to predict hypoglycemia risk with clear "Why?" explanations.'
    },
    {
      number: '04',
      title: 'Bridge to your doctor',
      icon: HeartPulse,
      badge: 'CLINICAL CONTINUITY',
      description: 'All meals, glucose readings, and risk alerts synchronize into a structured journal. Generate 1-click clinical visit summaries and CSV datasets for your endocrinologist.'
    }
  ];

  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto space-y-12">
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] font-display">
          THE 4-STAGE CLINICAL JOURNEY
        </span>
        <h2 className="text-3xl sm:text-5xl font-extrabold text-[#063F3D] font-editorial tracking-tight">
          How GlucoSaathi works for you.
        </h2>
        <p className="text-base text-[#66716F]">
          Transforming uncertainty into calm, explainable health decisions in seconds.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="editorial-card p-8 flex flex-col justify-between space-y-6 hover:shadow-xl transition-all relative overflow-hidden group"
            >
              <div className="flex items-start justify-between">
                <div className="w-12 h-12 rounded-2xl bg-[#DFF4E8] text-[#075B57] flex items-center justify-center font-display font-black text-lg">
                  {s.number}
                </div>
                <span className="text-[10px] font-extrabold text-[#075B57] bg-[#F3F1EA] px-2.5 py-1 rounded-full border border-black/5">
                  {s.badge}
                </span>
              </div>

              <div className="space-y-2.5">
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#063F3D] font-editorial">
                  {s.title}
                </h3>
                <p className="text-sm text-[#66716F] leading-relaxed">
                  {s.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
