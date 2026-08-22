import React from 'react';
import { Activity, ShieldCheck, ExternalLink } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="relative z-10 bg-[#063F3D] text-white pt-14 pb-12 border-t border-white/10 mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Purpose (6 cols) */}
          <div className="md:col-span-6 space-y-3.5">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xl bg-[#1E9E67] flex items-center justify-center text-[#063F3D]">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <div className="flex items-baseline space-x-2">
                <span className="text-xl font-black text-white font-display">
                  Gluco<span className="text-[#1E9E67]">Saathi</span>
                </span>
                <span className="text-[11px] text-[#DFF4E8]/80 font-bold">
                  T1D Clinical Decision Support
                </span>
              </div>
            </div>
            <p className="text-xs text-[#DFF4E8]/80 leading-relaxed max-w-md">
              AI-assisted Indian meal understanding and explainable short-term hypoglycemia risk prediction for people living with Type 1 Diabetes. Built for <strong>AI4SDG Global Hackathon 2026 (Problem Statement PS-102)</strong>.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-[11px] font-semibold text-[#DFF4E8]">
              <span>🎯 UN SDG 3: Good Health & Well-Being</span>
            </div>
          </div>

          {/* Product Navigation (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#DFF4E8]">
              Product Modules
            </h4>
            <ul className="space-y-1.5 text-xs text-[#DFF4E8]/80">
              <li>
                <button onClick={() => onNavigate('overview')} className="hover:text-white transition-colors">
                  Overview & Live Snapshot
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('meal')} className="hover:text-white transition-colors">
                  Indian Meal Analyzer
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('risk')} className="hover:text-white transition-colors">
                  Risk Prediction Sandbox
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Health Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('journal')} className="hover:text-white transition-colors">
                  Health Journal Telemetry
                </button>
              </li>
            </ul>
          </div>

          {/* References & Standards (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#DFF4E8]">
              Clinical Standards
            </h4>
            <ul className="space-y-1.5 text-xs text-[#DFF4E8]/80">
              <li>• Nutrition reference: ICMR-NIN IFCT 2017</li>
              <li>• Clinical Rule of 15 Hypo Protocol</li>
              <li>• Conformal 30-min trajectory modeling</li>
              <li>• OhioT1DM & HUPA-UCM validated datasets</li>
            </ul>
          </div>
        </div>

        {/* Medical Safety Disclaimer Callout */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#DFF4E8]/80 leading-relaxed flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-[#1E9E67] shrink-0 mt-0.5" />
          <p>
            <strong>Medical Safety Disclaimer:</strong> Prototype decision-support system for educational and hackathon demonstration purposes. Not a substitute for professional medical advice or autonomous insulin dosing. All nutritional and risk estimates are for reference only and must be confirmed with your physician-prescribed diabetes care plan.
          </p>
        </div>

        {/* Bottom copyright */}
        <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#DFF4E8]/60 gap-2">
          <span>© 2026 GlucoSaathi Team. All rights reserved.</span>
          <span>Innovate 4 Impact — AI4SDG Global Hackathon 2026 (PS-102)</span>
        </div>
      </div>
    </footer>
  );
}
