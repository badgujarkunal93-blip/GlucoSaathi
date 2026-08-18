import React, { useState } from 'react';
import { Activity, Utensils, Syringe, Clock, Flame } from 'lucide-react';

export default function GlucoseOrb({ glucose = 118, iob = 4.2, carbs = 68, activity = 'Moderate' }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div 
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative w-72 h-72 sm:w-84 sm:h-84 md:w-96 md:h-96 mx-auto flex items-center justify-center cursor-default transition-transform duration-500 ease-out"
      style={{
        transform: isHovered ? 'scale(1.03)' : 'scale(1)'
      }}
    >
      {/* 1. Concentric Subtle Animated Rings */}
      <div className="absolute inset-0 rounded-full border border-[#075B57]/10 animate-spin" style={{ animationDuration: '45s' }} />
      <div className="absolute inset-4 sm:inset-6 rounded-full border border-dashed border-[#1E9E67]/20 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }} />
      <div className="absolute inset-10 sm:inset-12 rounded-full border border-[#075B57]/15" />
      
      {/* 2. Soft Ambient Glow */}
      <div className="absolute w-48 h-48 sm:w-56 sm:h-56 rounded-full bg-gradient-to-tr from-[#DFF4E8]/50 via-[#EFF8F3]/60 to-transparent blur-2xl pointer-events-none" />

      {/* 3. Orbiting Data Satellite Nodes */}
      {/* TOP: Meal Carbs */}
      <div className="absolute top-1 sm:top-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/8 shadow-xs text-[11px] font-bold text-[#063F3D] transition-transform duration-300 hover:scale-105">
        <Utensils className="w-3 h-3 text-[#8D4023]" />
        <span>MEAL {carbs}g</span>
      </div>

      {/* RIGHT: Insulin On Board */}
      <div className="absolute right-0 sm:right-1 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/8 shadow-xs text-[11px] font-bold text-[#063F3D] transition-transform duration-300 hover:scale-105">
        <Syringe className="w-3 h-3 text-[#075B57]" />
        <span>IOB {iob} U</span>
      </div>

      {/* BOTTOM: Activity */}
      <div className="absolute bottom-1 sm:bottom-2 left-1/2 -translate-x-1/2 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/8 shadow-xs text-[11px] font-bold text-[#063F3D] transition-transform duration-300 hover:scale-105">
        <Flame className="w-3 h-3 text-[#F2B84B]" />
        <span>{activity}</span>
      </div>

      {/* LEFT: Timing Context */}
      <div className="absolute left-0 sm:left-1 top-1/2 -translate-y-1/2 flex items-center space-x-1.5 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md border border-black/8 shadow-xs text-[11px] font-bold text-[#063F3D] transition-transform duration-300 hover:scale-105">
        <Clock className="w-3 h-3 text-[#66716F]" />
        <span>2.5h POST</span>
      </div>

      {/* 4. Central Core Signal Capsule */}
      <div className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-white/95 backdrop-blur-lg border border-[#075B57]/20 shadow-xl flex flex-col items-center justify-center p-4 text-center z-10 transition-all">
        <span className="text-[10px] font-black uppercase tracking-widest text-[#075B57] font-display">
          GLUCOSE
        </span>
        <div className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight leading-none my-1">
          {glucose}
        </div>
        <span className="text-[11px] font-semibold text-[#66716F]">
          mg/dL
        </span>
        <div className="mt-1 flex items-center space-x-1 text-[10px] font-bold text-[#1E9E67] bg-[#DFF4E8] px-2 py-0.5 rounded-full">
          <span className="w-1.5 h-1.5 rounded-full bg-[#1E9E67] animate-pulse" />
          <span>In Target</span>
        </div>
      </div>
    </div>
  );
}
