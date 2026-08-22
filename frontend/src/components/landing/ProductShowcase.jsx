import React, { useState } from 'react';
import { 
  Activity, 
  ShieldCheck, 
  LayoutDashboard, 
  FileText, 
  Sparkles,
  TrendingDown,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function ProductShowcase({ onStartAssessment }) {
  const [activeTab, setActiveTab] = useState('risk');

  const tabs = [
    { id: 'input', label: '01 Patient Input', icon: Activity },
    { id: 'risk', label: '02 Risk & Forecast', icon: ShieldCheck },
    { id: 'dashboard', label: '03 Health Dashboard', icon: LayoutDashboard },
    { id: 'report', label: '04 Doctor Report', icon: FileText }
  ];

  return (
    <section className="py-16 sm:py-24 space-y-12">
      
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DFF4E8] text-[#075B57] text-xs font-black uppercase tracking-widest border border-[#B8E8D2]">
          <span>PRODUCT INTERFACE SHOWCASE</span>
        </div>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063F3D] font-display tracking-tight">
          One assessment. One complete picture.
        </h2>
        <p className="text-xs sm:text-sm text-[#66716F] leading-relaxed">
          Explore the clinical interface that bridges everyday Indian culinary realities with continuous metabolic risk forecasting.
        </p>
      </div>

      {/* Browser / Device Mockup Frame */}
      <div className="max-w-5xl mx-auto rounded-3xl bg-white border border-black/10 shadow-2xl overflow-hidden">
        
        {/* Mockup Browser Top Bar */}
        <div className="bg-[#F3F1EA] border-b border-black/8 px-4 sm:px-6 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-[#FF5F56]" />
            <span className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
            <span className="w-3 h-3 rounded-full bg-[#27C93F]" />
          </div>

          {/* Interactive Feature Selectors */}
          <div className="flex items-center space-x-1 bg-white p-1 rounded-xl border border-black/5 shadow-xs">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
                    isActive 
                      ? 'bg-[#075B57] text-white shadow-xs' 
                      : 'text-[#66716F] hover:text-[#063F3D]'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">{tab.label}</span>
                </button>
              );
            })}
          </div>

          <div className="text-[10px] font-bold text-[#66716F] hidden md:block">
            app.glucosaathi.org
          </div>
        </div>

        {/* Mockup Content Body */}
        <div className="p-6 sm:p-10 bg-[#F7F8F5]">
          
          {/* Tab 1: Input Showcase */}
          {activeTab === 'input' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-black/8 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#075B57]">
                  Clinical Patient Input Workspace
                </span>
                <span className="text-xs text-[#66716F]">Step 01</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-white border border-black/5 space-y-2">
                  <span className="text-[10px] font-bold text-[#66716F] uppercase">Current Glucose</span>
                  <div className="text-2xl font-black text-[#063F3D]">108 <span className="text-xs text-[#66716F]">mg/dL</span></div>
                  <span className="text-[11px] font-bold text-[#075B57]">↘ Falling slowly</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-black/5 space-y-2">
                  <span className="text-[10px] font-bold text-[#66716F] uppercase">Active Insulin (IOB)</span>
                  <div className="text-2xl font-black text-[#063F3D]">0.8 <span className="text-xs text-[#66716F]">Units</span></div>
                  <span className="text-[11px] text-[#66716F]">Recent bolus: 4.5 U</span>
                </div>
                <div className="p-4 rounded-xl bg-white border border-black/5 space-y-2">
                  <span className="text-[10px] font-bold text-[#66716F] uppercase">Meal Composition</span>
                  <div className="text-sm font-bold text-[#8D4023]">2 Rotis + Dal + Rice</div>
                  <span className="text-[11px] font-bold text-[#075B57]">68g Carbs (IFCT 2017)</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Risk Showcase */}
          {activeTab === 'risk' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-black/8 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#075B57]">
                  Explainable Risk Prediction & 30-Min Conformal Trajectory
                </span>
                <span className="text-xs text-[#66716F]">Step 03</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 rounded-2xl bg-white border border-black/5 space-y-3">
                  <div className="text-xs font-bold text-[#66716F] uppercase">Calibrated ML Risk Level</div>
                  <div className="text-3xl font-black text-[#075B57]">15% LOW RISK</div>
                  <p className="text-xs text-[#66716F]">
                    Expected 30m glucose: ~79 mg/dL with 90% confidence interval [58 – 102 mg/dL].
                  </p>
                </div>
                <div className="p-5 rounded-2xl bg-white border border-black/5 space-y-2">
                  <div className="text-xs font-bold text-[#66716F] uppercase">Normalized Factor Attribution</div>
                  <div className="space-y-1.5 text-xs">
                    <div className="flex justify-between font-bold"><span>Glucose Momentum</span><span>62%</span></div>
                    <div className="w-full bg-[#F3F1EA] h-1.5 rounded-full"><div className="bg-[#075B57] h-full rounded-full" style={{ width: '62%' }} /></div>
                    <div className="flex justify-between font-bold"><span>Active Insulin (IOB)</span><span>18%</span></div>
                    <div className="w-full bg-[#F3F1EA] h-1.5 rounded-full"><div className="bg-[#075B57] h-full rounded-full" style={{ width: '18%' }} /></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Dashboard Showcase */}
          {activeTab === 'dashboard' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-black/8 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#075B57]">
                  Clinical Bento Health Dashboard
                </span>
                <span className="text-xs text-[#66716F]">Step 04</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 rounded-xl bg-white border border-black/5">
                  <span className="text-[10px] font-bold text-[#66716F] uppercase">Time in Range (70-140)</span>
                  <div className="text-3xl font-black text-[#075B57]">82%</div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-black/5">
                  <span className="text-[10px] font-bold text-[#66716F] uppercase">Average Glucose</span>
                  <div className="text-3xl font-black text-[#063F3D]">118 <span className="text-xs font-normal">mg/dL</span></div>
                </div>
                <div className="p-4 rounded-xl bg-white border border-black/5">
                  <span className="text-[10px] font-bold text-[#66716F] uppercase">Active Regimen</span>
                  <div className="text-sm font-bold text-[#063F3D] pt-2">Rapid-Acting Aspart</div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Report Showcase */}
          {activeTab === 'report' && (
            <div className="space-y-6 animate-fade-in">
              <div className="flex items-center justify-between border-b border-black/8 pb-3">
                <span className="text-xs font-black uppercase tracking-wider text-[#075B57]">
                  Standardized Endocrinologist Visit Summary
                </span>
                <span className="text-xs text-[#66716F]">Step 06</span>
              </div>
              <div className="p-6 rounded-2xl bg-white border border-black/5 space-y-3">
                <h4 className="text-sm font-black text-[#063F3D]">Structured Clinical Report Ready</h4>
                <p className="text-xs text-[#66716F] leading-relaxed">
                  Exportable summary containing GMI, TIR %, carbohydrate frequencies, and factor attributions for high-signal clinical consultations.
                </p>
                <div className="pt-2 flex items-center space-x-3">
                  <span className="px-3 py-1 rounded-lg bg-[#DFF4E8] text-[#075B57] text-xs font-bold">
                    ✓ 1-Click CSV Export
                  </span>
                  <span className="px-3 py-1 rounded-lg bg-[#DFF4E8] text-[#075B57] text-xs font-bold">
                    ✓ Print-Ready Clinical PDF
                  </span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </section>
  );
}
