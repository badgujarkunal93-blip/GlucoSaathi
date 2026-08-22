import React from 'react';
import { 
  Activity, 
  Sparkles, 
  Database, 
  TrendingDown, 
  Cpu, 
  LayoutDashboard, 
  FileText,
  ArrowRight
} from 'lucide-react';

export default function PipelineSection({ onStartAssessment }) {
  const steps = [
    {
      num: '01',
      title: 'Patient Data',
      subtitle: 'Glucose, IOB, Meal & Activity',
      desc: 'Real-time telemetry and user-submitted meal parameters.',
      icon: Activity,
      color: '#075B57',
      bg: '#DFF4E8'
    },
    {
      num: '02',
      title: 'AI Meal Parsing',
      subtitle: 'Multimodal Decomposition',
      desc: 'Structured component extraction from text or plate photos.',
      icon: Sparkles,
      color: '#8D4023',
      bg: '#FCECE6'
    },
    {
      num: '03',
      title: 'Carb Estimation',
      subtitle: 'ICMR-NIN IFCT 2017',
      desc: 'Authoritative Indian food composition tables ground-truth.',
      icon: Database,
      color: '#075B57',
      bg: '#DFF4E8'
    },
    {
      num: '04',
      title: 'Glucose Forecast',
      subtitle: 'Conformal 30m Bands',
      desc: 'Projected glycemic trajectory with 90% uncertainty margin.',
      icon: TrendingDown,
      color: '#075B57',
      bg: '#DFF4E8'
    },
    {
      num: '05',
      title: 'Risk Engine',
      subtitle: 'Calibrated LightGBM',
      desc: 'Platt-scaled classification for near-term hypoglycemia.',
      icon: Cpu,
      color: '#C84B52',
      bg: '#FDE8E9'
    },
    {
      num: '06',
      title: 'Health Insights',
      subtitle: 'Factor Attribution',
      desc: 'Explainable decomposition (Momentum, IOB, Exercise).',
      icon: LayoutDashboard,
      color: '#075B57',
      bg: '#DFF4E8'
    },
    {
      num: '07',
      title: 'Doctor Report',
      subtitle: 'Clinical Continuity',
      desc: 'Standardized visit report with TIR, GMI, and CSV export.',
      icon: FileText,
      color: '#075B57',
      bg: '#DFF4E8'
    }
  ];

  return (
    <section id="pipeline" className="py-16 sm:py-24 space-y-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="max-w-2xl space-y-2">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DFF4E8] text-[#075B57] text-xs font-black uppercase tracking-widest border border-[#B8E8D2]">
            <span>END-TO-END CLINICAL ARCHITECTURE</span>
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063F3D] font-display tracking-tight">
            From patient data to explainable insight.
          </h2>
          <p className="text-xs sm:text-sm text-[#66716F] leading-relaxed">
            A sequential decision-support pipeline that guarantees every downstream risk assessment and clinical summary is grounded in genuine patient inputs.
          </p>
        </div>

        <button
          onClick={onStartAssessment}
          className="px-6 py-3 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-black uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all self-start md:self-auto shrink-0"
        >
          <span>Run Pipeline</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Horizontal Pipeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-3">
        {steps.map((st) => {
          const Icon = st.icon;
          return (
            <div 
              key={st.num}
              className="editorial-card p-5 bg-white border border-black/8 hover:border-[#075B57] space-y-3 flex flex-col justify-between transition-all hover:shadow-md group"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#66716F] font-display">
                    {st.num}
                  </span>
                  <div 
                    className="w-7 h-7 rounded-lg flex items-center justify-center transition-transform group-hover:scale-110"
                    style={{ backgroundColor: st.bg, color: st.color }}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="space-y-0.5">
                  <h4 className="text-xs font-black text-[#063F3D]">
                    {st.title}
                  </h4>
                  <span className="text-[10px] font-bold text-[#075B57] block truncate">
                    {st.subtitle}
                  </span>
                </div>

                <p className="text-[11px] text-[#66716F] leading-snug">
                  {st.desc}
                </p>
              </div>

              <div className="pt-2 border-t border-black/5 text-[9px] font-black uppercase tracking-wider text-[#66716F]/70">
                Stage {st.num}
              </div>
            </div>
          );
        })}
      </div>

    </section>
  );
}
