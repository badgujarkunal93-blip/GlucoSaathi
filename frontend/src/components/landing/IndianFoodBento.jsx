import React from 'react';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function IndianFoodBento({ onSelectFood }) {
  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#F1EEE6] text-[#103331]">
      <div className="max-w-6xl mx-auto space-y-12">
        {/* Editorial Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-3 max-w-2xl">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] font-display">
              STAGE 02 • THE MEAL
            </span>
            <h2 className="text-3xl sm:text-5xl font-black text-[#043F3D] font-editorial tracking-tight">
              Food shouldn't need a translation.
            </h2>
            <p className="text-sm sm:text-base text-[#657572]">
              Indian meals are rarely one ingredient. GlucoSaathi maps traditional dishes directly against ICMR-NIN (2020) nutrition tables.
            </p>
          </div>

          <div className="text-xs font-bold text-[#075B57] bg-white px-4 py-2 rounded-full border border-[#DCE6E2] shadow-xs self-start md:self-auto">
            ✓ 60+ Curated Indian Dishes
          </div>
        </div>

        {/* Asymmetrical Bento Grid (1 Large, 2 Medium, 3 Small) */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* 1. Large Card: Standard North Indian Thali (Roti + Dal) - 7 cols */}
          <div 
            onClick={() => onSelectFood('2 rotis, dal tadka and steamed rice')}
            className="md:col-span-7 p-7 rounded-[26px] bg-white border border-[#DCE6E2] shadow-sm hover:shadow-md hover:border-[#075B57] transition-all cursor-pointer flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🫓 🍲</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#075B57] bg-[#DFF4E8] px-2.5 py-1 rounded-full">
                  MOST COMMON THALI
                </span>
              </div>
              <h3 className="text-2xl font-extrabold text-[#043F3D] font-editorial group-hover:text-[#075B57] transition-colors">
                Whole Wheat Roti & Dal Tadka
              </h3>
              <p className="text-xs sm:text-sm text-[#657572] leading-relaxed">
                2 Phulkas (30g carbs) paired with 1 katori Toor Dal (18g carbs). High protein and dietary fiber balance glycemic absorption.
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#657572] block">Composite Carb Load:</span>
                <strong className="text-xl font-extrabold text-[#043F3D] font-display">~48g Carbs</strong>
                <span className="text-[10px] text-[#657572] font-semibold ml-1.5">(Range: 42–54g)</span>
              </div>
              <span className="text-xs font-bold text-[#075B57] flex items-center space-x-1">
                <span>Try Meal</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>

          {/* 2. Medium Card: Steamed White Rice - 5 cols */}
          <div 
            onClick={() => onSelectFood('1 bowl steamed white rice')}
            className="md:col-span-5 p-7 rounded-[26px] bg-white border border-[#DCE6E2] shadow-sm hover:shadow-md hover:border-[#075B57] transition-all cursor-pointer flex flex-col justify-between space-y-6 group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-3xl">🍚</span>
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#8D4023] bg-[#FFE0D1] px-2.5 py-1 rounded-full">
                  FAST DIGESTION
                </span>
              </div>
              <h3 className="text-xl font-extrabold text-[#043F3D] font-editorial group-hover:text-[#075B57] transition-colors">
                Steamed White Rice (Chawal)
              </h3>
              <p className="text-xs text-[#657572]">
                1 medium katori (cooked, 150g). High glycemic index causes rapid post-meal glucose rise.
              </p>
            </div>

            <div className="pt-4 border-t border-black/5 flex items-center justify-between">
              <div>
                <span className="text-[11px] text-[#657572] block">Estimated Carbs:</span>
                <strong className="text-lg font-extrabold text-[#043F3D] font-display">28g Carbs</strong>
              </div>
              <span className="text-xs font-bold text-[#075B57] flex items-center space-x-1">
                <span>Try</span>
                <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
              </span>
            </div>
          </div>

          {/* 3. Medium Card: Aloo Sabzi - 4 cols */}
          <div 
            onClick={() => onSelectFood('1 bowl aloo gobi sabzi')}
            className="md:col-span-4 p-6 rounded-[22px] bg-white border border-[#DCE6E2] shadow-sm hover:shadow-md hover:border-[#075B57] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🥘</span>
                <span className="text-[10px] font-extrabold text-[#075B57] bg-[#DFF4E8] px-2 py-0.5 rounded-md">
                  HOMESTYLE
                </span>
              </div>
              <h4 className="text-base font-extrabold text-[#043F3D] font-display">
                Aloo Gobi Sabzi
              </h4>
              <p className="text-xs text-[#657572]">1 bowl (120g) homestyle vegetable curry.</p>
            </div>
            <div className="pt-2 border-t border-black/5 flex justify-between items-center text-xs">
              <strong className="text-[#043F3D] font-display">16g Carbs</strong>
              <span className="text-[#075B57] font-bold">Try →</span>
            </div>
          </div>

          {/* 4. Small Card: Idli Sambar - 4 cols */}
          <div 
            onClick={() => onSelectFood('2 idlis and 1 bowl sambar')}
            className="md:col-span-4 p-6 rounded-[22px] bg-white border border-[#DCE6E2] shadow-sm hover:shadow-md hover:border-[#075B57] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🥟</span>
                <span className="text-[10px] font-extrabold text-[#075B57] bg-[#DFF4E8] px-2 py-0.5 rounded-md">
                  FERMENTED
                </span>
              </div>
              <h4 className="text-base font-extrabold text-[#043F3D] font-display">
                Idli Sambar (2 Pcs)
              </h4>
              <p className="text-xs text-[#657572]">2 steamed rice cakes + 1 bowl vegetable sambar.</p>
            </div>
            <div className="pt-2 border-t border-black/5 flex justify-between items-center text-xs">
              <strong className="text-[#043F3D] font-display">38g Carbs</strong>
              <span className="text-[#075B57] font-bold">Try →</span>
            </div>
          </div>

          {/* 5. Small Card: Kanda Poha - 4 cols */}
          <div 
            onClick={() => onSelectFood('1 plate kanda poha')}
            className="md:col-span-4 p-6 rounded-[22px] bg-white border border-[#DCE6E2] shadow-sm hover:shadow-md hover:border-[#075B57] transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
          >
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-2xl">🥣</span>
                <span className="text-[10px] font-extrabold text-[#075B57] bg-[#DFF4E8] px-2 py-0.5 rounded-md">
                  BREAKFAST
                </span>
              </div>
              <h4 className="text-base font-extrabold text-[#043F3D] font-display">
                Kanda Poha
              </h4>
              <p className="text-xs text-[#657572]">1 medium plate tempered flattened rice with peanuts.</p>
            </div>
            <div className="pt-2 border-t border-black/5 flex justify-between items-center text-xs">
              <strong className="text-[#043F3D] font-display">42g Carbs</strong>
              <span className="text-[#075B57] font-bold">Try →</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
