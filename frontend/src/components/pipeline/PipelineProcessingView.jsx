import React from 'react';
import { 
  CheckCircle2, 
  Loader2, 
  Cpu, 
  Sparkles, 
  ShieldCheck, 
  LayoutDashboard, 
  BookOpen, 
  FileText,
  AlertTriangle,
  ArrowRight
} from 'lucide-react';

export default function PipelineProcessingView({ pipelineStatus, error, onRetry, onComplete }) {
  const steps = [
    {
      id: 'VALIDATING',
      label: 'Patient Data Validation & Normalization',
      desc: 'Checking clinical glucose ranges, timestamps, active IOB, and meal parameters',
      icon: CheckCircle2,
      isDone: ['ANALYZING', 'PREDICTING_RISK', 'GENERATING_DASHBOARD', 'GENERATING_JOURNAL', 'GENERATING_REPORT', 'COMPLETE'].includes(pipelineStatus),
      isActive: pipelineStatus === 'VALIDATING'
    },
    {
      id: 'ANALYZING',
      label: 'Multimodal AI & ICMR-NIN IFCT 2017 Lookup',
      desc: 'Extracting structured food entities and calculating authoritative carbohydrate ranges',
      icon: Sparkles,
      isDone: ['PREDICTING_RISK', 'GENERATING_DASHBOARD', 'GENERATING_JOURNAL', 'GENERATING_REPORT', 'COMPLETE'].includes(pipelineStatus),
      isActive: pipelineStatus === 'ANALYZING'
    },
    {
      id: 'PREDICTING_RISK',
      label: 'FastAPI ML Inference & Conformal Forecaster',
      desc: 'Executing calibrated LightGBM classifier (45m horizon) and 90% uncertainty trajectory',
      icon: Cpu,
      isDone: ['GENERATING_DASHBOARD', 'GENERATING_JOURNAL', 'GENERATING_REPORT', 'COMPLETE'].includes(pipelineStatus),
      isActive: pipelineStatus === 'PREDICTING_RISK'
    },
    {
      id: 'GENERATING_DASHBOARD',
      label: 'Clinical Health Insights & TIR Synthesis',
      desc: 'Evaluating Time-In-Range, Glycemic Management Index, and metabolic factor attributions',
      icon: LayoutDashboard,
      isDone: ['GENERATING_JOURNAL', 'GENERATING_REPORT', 'COMPLETE'].includes(pipelineStatus),
      isActive: pipelineStatus === 'GENERATING_DASHBOARD'
    },
    {
      id: 'GENERATING_JOURNAL',
      label: 'Telemetry Logging & Doctor Report Generation',
      desc: 'Constructing structured chronological health journal and endocrinologist visit summary',
      icon: FileText,
      isDone: pipelineStatus === 'COMPLETE',
      isActive: ['GENERATING_JOURNAL', 'GENERATING_REPORT'].includes(pipelineStatus)
    }
  ];

  // Calculate percentage
  let progressPct = 15;
  if (pipelineStatus === 'VALIDATING') progressPct = 25;
  else if (pipelineStatus === 'ANALYZING') progressPct = 48;
  else if (pipelineStatus === 'PREDICTING_RISK') progressPct = 72;
  else if (pipelineStatus === 'GENERATING_DASHBOARD') progressPct = 88;
  else if (pipelineStatus === 'GENERATING_JOURNAL' || pipelineStatus === 'GENERATING_REPORT') progressPct = 96;
  else if (pipelineStatus === 'COMPLETE') progressPct = 100;

  return (
    <div className="max-w-3xl mx-auto my-8 space-y-8 animate-fade-in">
      
      {/* Central Card */}
      <div className="editorial-card p-8 sm:p-10 bg-white border-2 border-[#075B57]/20 shadow-xl space-y-8">
        
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DFF4E8] text-[#075B57] text-xs font-black uppercase tracking-widest border border-[#B8E8D2]">
            <Sparkles className="w-3.5 h-3.5 animate-spin" />
            <span>SEQUENTIAL CLINICAL ANALYSIS PIPELINE</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#063F3D] font-display">
            {pipelineStatus === 'COMPLETE' ? 'Analysis Complete' : 'Processing Patient Telemetry...'}
          </h2>
          <p className="text-xs sm:text-sm text-[#66716F] max-w-lg mx-auto leading-relaxed">
            Synthesizing glucose velocity, active insulin on board, ICMR-NIN meal carbohydrates, and physical movement through our calibrated decision-support engine.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold text-[#063F3D]">
            <span>Pipeline Progress</span>
            <span>{progressPct}%</span>
          </div>
          <div className="w-full h-2.5 bg-[#F3F1EA] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#075B57] to-[#1E9E67] transition-all duration-500 ease-out rounded-full"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Pipeline Nodes List */}
        <div className="space-y-4 pt-2">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div 
                key={step.id}
                className={`p-4 rounded-xl border transition-all flex items-start space-x-3.5 ${
                  step.isDone 
                    ? 'bg-[#DFF4E8]/40 border-[#B8E8D2] text-[#075B57]'
                    : step.isActive
                      ? 'bg-white border-[#075B57] shadow-md ring-2 ring-[#075B57]/15 text-[#063F3D]'
                      : 'bg-[#F7F8F5] border-black/5 text-[#66716F]/70'
                }`}
              >
                <div className="mt-0.5 shrink-0">
                  {step.isDone ? (
                    <CheckCircle2 className="w-5 h-5 text-[#1E9E67]" />
                  ) : step.isActive ? (
                    <Loader2 className="w-5 h-5 text-[#075B57] animate-spin" />
                  ) : (
                    <div className="w-5 h-5 rounded-full border-2 border-current flex items-center justify-center text-[10px] font-bold">
                      {idx + 1}
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-xs font-extrabold ${step.isActive ? 'text-[#063F3D]' : ''}`}>
                      {step.label}
                    </h4>
                    {step.isDone && (
                      <span className="text-[10px] font-black uppercase text-[#1E9E67]">
                        COMPLETE
                      </span>
                    )}
                    {step.isActive && (
                      <span className="text-[10px] font-black uppercase text-[#075B57] animate-pulse">
                        RUNNING
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-[#66716F]">
                    {step.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Error state if any */}
        {error && (
          <div className="p-4 rounded-xl bg-[#FDE8E9] border border-[#FFB4A8] text-xs text-[#C84B52] flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertTriangle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
            <button
              onClick={onRetry}
              className="px-3 py-1 rounded-lg bg-[#C84B52] text-white font-bold text-xs hover:bg-[#A8383E]"
            >
              Retry
            </button>
          </div>
        )}

        {/* Completion Action */}
        {pipelineStatus === 'COMPLETE' && (
          <div className="pt-4 border-t border-black/8 flex flex-col sm:flex-row items-center justify-between gap-4 animate-fade-in">
            <div className="text-xs text-[#075B57] font-bold flex items-center space-x-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#1E9E67]" />
              <span>All 6 clinical decision-support stages computed successfully.</span>
            </div>
            <button
              onClick={onComplete}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold shadow-md flex items-center justify-center space-x-2 transition-all hover:scale-102"
            >
              <span>Explore Risk Prediction & Insights</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
}
