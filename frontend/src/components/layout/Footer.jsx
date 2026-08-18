import React from 'react';
import { Activity, ShieldCheck, Heart, ExternalLink } from 'lucide-react';

export default function Footer({ onNavigate }) {
  return (
    <footer className="bg-[#063F3D] text-white pt-16 pb-12 border-t border-white/10 mt-20">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
          {/* Brand & Purpose */}
          <div className="md:col-span-6 space-y-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-[#1E9E67] flex items-center justify-center text-[#063F3D]">
                <Activity className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black text-white font-display">
                Gluco<span className="text-[#1E9E67]">Saathi</span>
              </span>
            </div>
            <p className="text-sm text-[#DFF4E8]/80 leading-relaxed max-w-md">
              An India-first, AI-assisted nutritional decision companion for Type 1 Diabetes. Developed for the <strong>Innovate 4 Impact: AI4SDG Global Hackathon 2026 (Problem Statement PS-102)</strong>.
            </p>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/10 text-xs font-semibold text-[#DFF4E8]">
              <span>🎯 UN SDG 3: Good Health & Well-Being</span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#DFF4E8]">
              Product & Clinical Flow
            </h4>
            <ul className="space-y-2 text-sm text-[#DFF4E8]/70">
              <li>
                <button onClick={() => onNavigate('story')} className="hover:text-white transition-colors">
                  Interactive Story & Journey
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('meal')} className="hover:text-white transition-colors">
                  Indian Meal Carb Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('risk')} className="hover:text-white transition-colors">
                  Explainable Hypo Risk Engine
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('dashboard')} className="hover:text-white transition-colors">
                  Bento Clinical Dashboard
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('history')} className="hover:text-white transition-colors">
                  Patient Health Journal
                </button>
              </li>
            </ul>
          </div>

          {/* Clinical Standards */}
          <div className="md:col-span-3 space-y-3">
            <h4 className="text-xs font-black uppercase tracking-wider text-[#DFF4E8]">
              Authoritative Standards
            </h4>
            <ul className="space-y-2 text-xs text-[#DFF4E8]/70">
              <li>• ICMR-NIN Indian Food Tables (2020)</li>
              <li>• Clinical Rule of 15 Hypo Protocol</li>
              <li>• RSSDI & ADA Clinical Guidelines</li>
              <li>• Google Gemini 1.5 Flash Vision</li>
            </ul>
          </div>
        </div>

        {/* Medical Safety Disclaimer Callout */}
        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-xs text-[#DFF4E8]/80 leading-relaxed flex items-start space-x-3">
          <ShieldCheck className="w-5 h-5 text-[#1E9E67] shrink-0 mt-0.5" />
          <p>
            <strong>Medical Safety Disclaimer:</strong> GlucoSaathi is an educational decision-support prototype designed for hackathon demonstration. It is not an autonomous medical device and does not prescribe or administer insulin. All calculations and estimations are for reference only and must be confirmed with your physician-prescribed diabetes care plan.
          </p>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-xs text-[#DFF4E8]/60 gap-4">
          <div>
            © 2026 GlucoSaathi Team. Open-source prototype under MIT License.
          </div>
          <div className="flex items-center space-x-1">
            <span>Built with care for India's T1D community</span>
            <Heart className="w-3.5 h-3.5 text-[#E56B6F]" />
          </div>
        </div>
      </div>
    </footer>
  );
}
