import React from 'react';
import { LayoutDashboard, ArrowRight, Activity, ShieldCheck, Utensils, Syringe, Flame } from 'lucide-react';

export default function DashboardAssemblySection({ onNavigateToDashboard }) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F1EEE6] text-[#103331]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] font-display">
              STAGE 05 • BENTO DASHBOARD
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#043F3D] font-editorial tracking-tight">
              Your health picture, together.
            </h2>
            <p className="text-sm sm:text-base text-[#657572]">
              Asymmetrical Bento architecture bringing real-time glucose trends, active IOB clearance, carb breakdowns, and clinical visit summaries into one clean interface.
            </p>
          </div>

          <button
            onClick={onNavigateToDashboard}
            className="px-6 py-3 rounded-full bg-[#075B57] hover:bg-[#043F3D] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center space-x-1.5 self-start md:self-auto"
          >
            <span>Open Bento Dashboard</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Bento Dashboard Preview Assembly */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Card 1: Risk Status - 8 cols */}
          <div className="md:col-span-8 p-7 rounded-[26px] bg-white border border-[#DCE6E2] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#043F3D] flex items-center space-x-1.5">
                <ShieldCheck className="w-4 h-4 text-[#1E9E67]" />
                <span>Contextual Risk Telemetry</span>
              </span>
              <span className="text-[10px] font-extrabold text-[#8D4023] bg-[#FEF7E6] px-2.5 py-0.5 rounded-full border border-[#FFE280]">
                MODERATE CAUTION (58/100)
              </span>
            </div>
            <p className="text-sm text-[#657572]">
              Active IOB of 1.8 U clearance with post-walk insulin sensitivity requires ongoing monitoring over next 45 minutes.
            </p>
            <div className="grid grid-cols-3 gap-2 pt-2 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7F7F3] border border-black/5">
                <span className="text-[10px] font-bold text-[#657572] block">IOB</span>
                <strong className="text-sm font-extrabold text-[#043F3D]">1.8 U</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F7F3] border border-black/5">
                <span className="text-[10px] font-bold text-[#657572] block">Carbs</span>
                <strong className="text-sm font-extrabold text-[#043F3D]">45g</strong>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F7F3] border border-black/5">
                <span className="text-[10px] font-bold text-[#657572] block">Activity</span>
                <strong className="text-sm font-extrabold text-[#043F3D]">Moderate</strong>
              </div>
            </div>
          </div>

          {/* Card 2: Current Glucose - 4 cols */}
          <div className="md:col-span-4 p-7 rounded-[26px] bg-white border border-[#DCE6E2] shadow-sm flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#043F3D] flex items-center space-x-1.5">
                <Activity className="w-4 h-4 text-[#075B57]" />
                <span>Glucose</span>
              </span>
              <span className="text-[10px] font-bold text-[#1E9E67] bg-[#DFF4E8] px-2 py-0.5 rounded-full">
                Stable →
              </span>
            </div>
            <div>
              <div className="text-4xl font-extrabold text-[#043F3D] font-display">
                108 <span className="text-sm font-normal text-[#657572]">mg/dL</span>
              </div>
              <span className="text-xs text-[#657572] block mt-1">
                78% Time-in-Range (TIR)
              </span>
            </div>
            <span className="text-[11px] text-[#075B57] font-bold">
              ✓ Fasting Target Met
            </span>
          </div>

          {/* Card 3: Last Meal - 4 cols */}
          <div className="md:col-span-4 p-6 rounded-[22px] bg-white border border-[#DCE6E2] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#043F3D]">Last Meal</span>
              <span className="text-[10px] font-bold text-[#8D4023] bg-[#FFE0D1] px-2 py-0.5 rounded-md">ICMR</span>
            </div>
            <strong className="text-base font-bold text-[#043F3D] block truncate">
              2 Rotis, Dal Tadka & Rice
            </strong>
            <span className="text-xl font-extrabold text-[#043F3D] font-display block">76g Carbs</span>
          </div>

          {/* Card 4: Insulin Context - 4 cols */}
          <div className="md:col-span-4 p-6 rounded-[22px] bg-white border border-[#DCE6E2] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#043F3D]">Active Insulin</span>
              <span className="text-[10px] font-bold text-[#075B57] bg-[#DFF4E8] px-2 py-0.5 rounded-md">ICR 1:15</span>
            </div>
            <strong className="text-base font-bold text-[#043F3D] block">
              Novorapid Rapid
            </strong>
            <span className="text-xl font-extrabold text-[#043F3D] font-display block">4.2 U Active IOB</span>
          </div>

          {/* Card 5: Activity - 4 cols */}
          <div className="md:col-span-4 p-6 rounded-[22px] bg-white border border-[#DCE6E2] shadow-sm space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase text-[#043F3D]">Activity</span>
              <span className="text-[10px] font-bold text-[#063F3D] bg-[#F3F1EA] px-2 py-0.5 rounded-md">30 min</span>
            </div>
            <strong className="text-base font-bold text-[#043F3D] block">
              Brisk Walking
            </strong>
            <span className="text-xl font-extrabold text-[#043F3D] font-display block">Moderate Sink</span>
          </div>
        </div>
      </div>
    </section>
  );
}
