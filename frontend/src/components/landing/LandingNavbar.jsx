import React, { useState } from 'react';
import { Activity, ArrowRight, Menu, X, Sparkles } from 'lucide-react';

export default function LandingNavbar({ onStartAssessment }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: 'The Problem', href: '#problem' },
    { label: 'Pipeline Workflow', href: '#pipeline' },
    { label: 'Capabilities', href: '#capabilities' },
    { label: 'Responsible AI', href: '#trust' },
  ];

  const handleScrollTo = (e, href) => {
    e.preventDefault();
    const elem = document.querySelector(href);
    if (elem) {
      elem.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#F7F8F5]/90 backdrop-blur-md border-b border-black/8 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="h-16 sm:h-[72px] flex items-center justify-between gap-4">
          
          {/* 1. Left: Brand Identity */}
          <div className="flex items-center space-x-3 cursor-pointer group">
            <div className="w-9 h-9 rounded-xl bg-[#075B57] flex items-center justify-center text-white shadow-xs group-hover:scale-105 transition-transform">
              <Activity className="w-5 h-5 text-[#DFF4E8]" />
            </div>
            <div className="flex flex-col">
              <div className="flex items-baseline space-x-1.5">
                <span className="text-lg font-black text-[#063F3D] font-display tracking-tight">
                  Gluco<span className="text-[#1E9E67]">Saathi</span>
                </span>
                <span className="text-[10px] font-bold text-[#66716F] hidden md:inline">
                  ग्लूको-साथी
                </span>
              </div>
              <span className="text-[10px] font-bold text-[#075B57] tracking-wider uppercase">
                T1D Clinical Decision Support
              </span>
            </div>
          </div>

          {/* 2. Center: Marketing Navigation Links */}
          <nav className="hidden md:flex items-center space-x-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={(e) => handleScrollTo(e, link.href)}
                className="text-xs font-bold text-[#66716F] hover:text-[#063F3D] transition-colors"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* 3. Right: Primary Action Button */}
          <div className="hidden sm:flex items-center space-x-3">
            <button
              onClick={onStartAssessment}
              className="px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-black uppercase tracking-wider shadow-sm flex items-center space-x-1.5 transition-all hover:scale-102 cursor-pointer group"
            >
              <span>Start Assessment</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center space-x-2 md:hidden">
            <button
              onClick={onStartAssessment}
              className="px-3.5 py-1.5 rounded-xl bg-[#075B57] text-white text-xs font-bold"
            >
              Start
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl bg-white border border-black/10 text-[#075B57]"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-black/8 bg-white p-4 shadow-lg animate-fade-in space-y-3">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={(e) => handleScrollTo(e, link.href)}
              className="block p-2 rounded-lg text-xs font-bold text-[#063F3D] hover:bg-[#F7F8F5]"
            >
              {link.label}
            </a>
          ))}
          <div className="pt-2 border-t border-black/5">
            <button
              onClick={onStartAssessment}
              className="w-full py-3 rounded-xl bg-[#075B57] text-white text-xs font-black uppercase tracking-wider flex items-center justify-center space-x-2"
            >
              <span>Start Assessment Pipeline</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
