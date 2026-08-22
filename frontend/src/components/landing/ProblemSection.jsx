import React from 'react';
import { AlertCircle, Scale, Clock, TrendingDown } from 'lucide-react';

export default function ProblemSection() {
  const problems = [
    {
      number: '01',
      tag: 'IDENTIFICATION',
      question: 'What did I actually eat?',
      description: 'Indian meals are rarely single ingredients. Thalis, biryanis, and curries combine multiple grains, legumes, fats, and regional spices that Western nutrition apps fail to dissect.'
    },
    {
      number: '02',
      tag: 'QUANTIFICATION',
      question: 'How many carbs are really there?',
      description: 'Volumetric household measures (katoris, ladles, variable roti thickness) and hidden cooking fats introduce substantial ±15–20g carbohydrate estimation variance.'
    },
    {
      number: '03',
      tag: 'PHYSIOLOGICAL RISK',
      question: 'What happens in the next 45 minutes?',
      description: 'Carbohydrates alone do not determine risk. Active insulin stacking and postprandial physical activity can rapidly precipitate acute, life-threatening hypoglycemia.'
    }
  ];

  return (
    <section id="problem" className="py-16 sm:py-24 bg-[#063F3D] text-white rounded-3xl my-12 shadow-2xl relative overflow-hidden">
      
      {/* Background Subtle Geometry */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#1E9E67]/10 rounded-full blur-3xl pointer-events-none" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-12">
        
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[#FFE280] text-xs font-black uppercase tracking-widest border border-white/15">
            <span>THE T1D CHALLENGE IN INDIA</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold font-display tracking-tight text-white leading-tight">
            Every meal is a chain of decisions.
          </h2>
          <p className="text-sm sm:text-base text-[#DFF4E8]/85 leading-relaxed font-normal">
            For people living with Type 1 Diabetes in India, managing blood glucose is a continuous calculation involving cultural composite diets, non-standardized portions, active insulin dynamics, and unpredictable daily schedules.
          </p>
        </div>

        {/* 3 Large Problem Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {problems.map((prob) => (
            <div 
              key={prob.number}
              className="p-8 rounded-2xl bg-white/5 border border-white/10 space-y-4 hover:border-white/20 transition-colors flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-[#FFE280] font-display">
                    {prob.number}
                  </span>
                  <span className="text-[10px] font-black uppercase tracking-widest text-[#DFF4E8]/70 bg-white/10 px-2.5 py-0.5 rounded-full">
                    {prob.tag}
                  </span>
                </div>
                <h3 className="text-xl font-extrabold text-white font-display">
                  "{prob.question}"
                </h3>
                <p className="text-xs sm:text-sm text-[#DFF4E8]/80 leading-relaxed font-normal">
                  {prob.description}
                </p>
              </div>

              <div className="pt-4 border-t border-white/10 text-[11px] font-bold text-[#FFE280]/80">
                Critical clinical decision point
              </div>
            </div>
          ))}
        </div>

      </div>

    </section>
  );
}
