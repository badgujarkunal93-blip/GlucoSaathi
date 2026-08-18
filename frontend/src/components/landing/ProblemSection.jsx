import React from 'react';
import { UtensilsCrossed, HelpCircle, ShieldAlert } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      step: '01',
      question: 'What am I eating?',
      tag: 'COMPOSITE INDIAN THALIS',
      description: 'Indian meals are rarely single ingredients. A standard plate is a composite blend of rotis, dal tadka, rice, sabzi, curd, and sweets, making traditional calorie counters inaccurate.',
      icon: UtensilsCrossed,
      color: '#DFF4E8',
      accent: '#24A66A'
    },
    {
      step: '02',
      question: 'How many carbs are actually there?',
      tag: 'NO REGIONAL CARB DATA',
      description: 'Western databases fail at Indian cooking. Variations in flour, ghee, and traditional portion units (katoris vs grams) cause unpredictable post-prandial glycemic spikes.',
      icon: HelpCircle,
      color: '#FEF7E6',
      accent: '#E7B84B'
    },
    {
      step: '03',
      question: 'Could this put me at risk later?',
      tag: 'THE 180-DECISION BURDEN',
      description: 'An insulin overestimate triggers sudden hypoglycemia (<70 mg/dL). Existing tools only react after blood glucose crashes instead of providing predictive warnings.',
      icon: ShieldAlert,
      color: '#FDE8E9',
      accent: '#D95C62'
    }
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#043F3D] text-white">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Editorial Section Heading */}
        <div className="max-w-3xl space-y-4">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#24A66A] font-display">
            STAGE 01 • THE PROBLEM
          </span>
          <h2 className="text-4xl sm:text-6xl md:text-7xl font-black font-editorial tracking-tight text-white leading-[1.05]">
            Every meal is a decision.
          </h2>
          <p className="text-base sm:text-lg text-[#DFF4E8]/80 font-normal leading-relaxed max-w-2xl">
            For 37 million Indians living with diabetes, carbohydrate estimation isn't a fitness tracking exercise—it's a critical daily calculation to prevent life-threatening hypoglycemic crashes.
          </p>
        </div>

        {/* 3 Large Staged Question Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-8 rounded-[24px] bg-white/5 border border-white/10 flex flex-col justify-between space-y-8 hover:bg-white/8 hover:border-[#24A66A]/40 transition-all group"
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black tracking-widest text-[#DFF4E8]/60">
                      STEP {p.step}
                    </span>
                    <div className="p-2.5 rounded-full bg-white/10 text-white group-hover:scale-110 transition-transform">
                      <Icon className="w-4 h-4" style={{ color: p.accent }} />
                    </div>
                  </div>

                  <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-white/10 text-[#DFF4E8] block w-fit">
                    {p.tag}
                  </span>

                  <h3 className="text-2xl sm:text-3xl font-extrabold text-white font-editorial leading-snug">
                    "{p.question}"
                  </h3>
                </div>

                <p className="text-xs sm:text-sm text-[#DFF4E8]/75 leading-relaxed">
                  {p.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
