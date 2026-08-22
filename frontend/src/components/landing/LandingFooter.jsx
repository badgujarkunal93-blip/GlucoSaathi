import React from 'react';
import { Activity, ShieldCheck, ExternalLink } from 'lucide-react';

export default function LandingFooter({ onStartAssessment, onOpenSavedReports }) {
  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const elem = document.querySelector(href);
    if (elem) elem.scrollIntoView({ behavior: 'smooth' });
  };

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
              Navigation
            </h4>
            <ul className="space-y-1.5 text-xs text-[#DFF4E8]/80">
              <li>
                <button onClick={onStartAssessment} className="hover:text-white transition-colors cursor-pointer">
                  Start Assessment Pipeline
                </button>
              </li>
              {onOpenSavedReports && (
                <li>
                  <button onClick={onOpenSavedReports} className="hover:text-white transition-colors text-[#FFE280] font-semibold cursor-pointer">
                    Saved Reports Archive
                  </button>
                </li>
              )}
              <li>
                <a href="#problem" onClick={(e) => handleScrollTo(e, '#problem')} className="hover:text-white transition-colors">
                  The Indian T1D Challenge
                </a>
              </li>
              <li>
                <a href="#pipeline" onClick={(e) => handleScrollTo(e, '#pipeline')} className="hover:text-white transition-colors">
                  7-Stage Architecture
                </a>
              </li>
              <li>
                <a href="#capabilities" onClick={(e) => handleScrollTo(e, '#capabilities')} className="hover:text-white transition-colors">
                  Core Capabilities
                </a>
              </li>
            </ul>
          </div>

          {/* Clinical & Scientific References (3 cols) */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#DFF4E8]">
              Scientific Evidence
            </h4>
            <ul className="space-y-1.5 text-xs text-[#DFF4E8]/80">
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E67] shrink-0" />
                <span>ICMR-NIN IFCT 2017 Ground-Truth</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E67] shrink-0" />
                <span>OhioT1DM & HUPA-UCM Cohorts</span>
              </li>
              <li className="flex items-center space-x-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-[#1E9E67] shrink-0" />
                <span>Platt Scaling ECE = 0.038</span>
              </li>
              <li className="pt-2">
                <a 
                  href="https://github.com/badgujarkunal93-blip/GlucoSaathi" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-flex items-center space-x-1 text-xs text-[#FFE280] font-bold hover:underline"
                >
                  <span>GitHub Repository</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Safety Disclaimer */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-[11px] text-[#DFF4E8]/70 text-center md:text-left">
          <p>
            © 2026 GlucoSaathi (ग्लूको-साथी) • Investigational Clinical Decision Support Prototype. Not an autonomous insulin delivery device.
          </p>
          <div className="flex items-center space-x-4">
            <span>Privacy & Local Storage</span>
            <span>•</span>
            <span>MIT Open Source</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
