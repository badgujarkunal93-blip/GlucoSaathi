import React from 'react';
import { ShieldCheck, Activity, Syringe, UtensilsCrossed } from 'lucide-react';

export default function HealthSignalPanel({ glucose = 118, iob = 4.2, carbs = 68, riskLevel = 'MODERATE', riskScore = 58 }) {
  const getRiskColor = (level) => {
    switch (level) {
      case 'HIGH':
        return { dot: 'bg-[#C84B52]', text: 'text-[#C84B52]', badge: 'bg-[#FDE8E9]' };
      case 'MODERATE':
        return { dot: 'bg-[#F2B84B]', text: 'text-[#8D4023]', badge: 'bg-[#FEF7E6]' };
      default:
        return { dot: 'bg-[#1E9E67]', text: 'text-[#075B57]', badge: 'bg-[#DFF4E8]' };
    }
  };

  const riskBadge = getRiskColor(riskLevel);

  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-5 rounded-[22px] bg-white/90 backdrop-blur-md border border-black/8 shadow-lg">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 divide-y md:divide-y-0 md:divide-x divide-black/6">
        {/* Metric 1: Glucose */}
        <div className="p-2 sm:p-3 text-center space-y-0.5">
          <span className="text-[10px] font-bold text-[#66716F] uppercase tracking-wider block">
            BLOOD GLUCOSE
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#063F3D] font-display">
            {glucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
          </div>
          <span className="text-[10px] font-semibold text-[#1E9E67] block">
            Target: 70–140
          </span>
        </div>

        {/* Metric 2: Insulin on Board */}
        <div className="p-2 sm:p-3 text-center space-y-0.5 pt-3 md:pt-2">
          <span className="text-[10px] font-bold text-[#66716F] uppercase tracking-wider block">
            INSULIN ON BOARD
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#063F3D] font-display">
            {iob} <span className="text-xs font-normal text-[#66716F]">Units</span>
          </div>
          <span className="text-[10px] font-semibold text-[#66716F] block">
            Active clearance
          </span>
        </div>

        {/* Metric 3: Meal Carbs */}
        <div className="p-2 sm:p-3 text-center space-y-0.5 pt-3 md:pt-2">
          <span className="text-[10px] font-bold text-[#66716F] uppercase tracking-wider block">
            INDIAN MEAL CARBS
          </span>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#063F3D] font-display">
            {carbs} <span className="text-xs font-normal text-[#66716F]">g</span>
          </div>
          <span className="text-[10px] font-semibold text-[#8D4023] block">
            Range: 60–75g
          </span>
        </div>

        {/* Metric 4: Evaluated Risk */}
        <div className="p-2 sm:p-3 text-center space-y-0.5 pt-3 md:pt-2">
          <span className="text-[10px] font-bold text-[#66716F] uppercase tracking-wider block">
            HYPO RISK LEVEL
          </span>
          <div className="text-xl sm:text-2xl font-extrabold font-display flex items-center justify-center space-x-1.5" style={{ color: riskBadge.text.replace('text-', '') }}>
            <span className={`w-2.5 h-2.5 rounded-full ${riskBadge.dot}`} />
            <span className={riskBadge.text}>{riskLevel}</span>
          </div>
          <span className="text-[10px] font-semibold text-[#66716F] block">
            Score: {riskScore}/100
          </span>
        </div>
      </div>
    </div>
  );
}
