import React from 'react';
import HeroSection from './HeroSection';
import ProblemSection from './ProblemSection';
import PipelineSection from './PipelineSection';
import ProductShowcase from './ProductShowcase';
import CapabilitiesSection from './CapabilitiesSection';
import ResponsibleAISection from './ResponsibleAISection';
import FinalCTA from './FinalCTA';

export default function LandingPage({ onStartAssessment }) {
  return (
    <div className="space-y-6 sm:space-y-10 animate-fade-in">
      {/* 01. Hero Section */}
      <HeroSection onStartAssessment={onStartAssessment} />

      {/* 02. The Indian T1D Challenge Problem Section */}
      <ProblemSection />

      {/* 03. The 7-Stage GlucoSaathi Pipeline */}
      <PipelineSection onStartAssessment={onStartAssessment} />

      {/* 04. Product Interface Showcase */}
      <ProductShowcase onStartAssessment={onStartAssessment} />

      {/* 05. Core Capabilities */}
      <CapabilitiesSection />

      {/* 06. Responsible AI & Safety Architecture */}
      <ResponsibleAISection />

      {/* 07. Final Assessment Call-to-Action */}
      <FinalCTA onStartAssessment={onStartAssessment} />
    </div>
  );
}
