import React, { useState } from 'react';
import { Sparkles, Utensils, RefreshCw, CheckCircle2, ArrowRight } from 'lucide-react';

export default function MealStorySection({ onNavigateToMeal }) {
  const [mealInput, setMealInput] = useState('2 rotis, 1 bowl dal tadka and steamed rice');
  const [parsingStep, setParsingStep] = useState(0); // 0: Idle, 1..4: Parsing, 5: Parsed
  const [isParsing, setIsParsing] = useState(false);

  const handleSimulateParse = () => {
    setIsParsing(true);
    setParsingStep(1);

    setTimeout(() => setParsingStep(2), 500);
    setTimeout(() => setParsingStep(3), 1000);
    setTimeout(() => setParsingStep(4), 1500);
    setTimeout(() => {
      setParsingStep(5);
      setIsParsing(false);
    }, 2000);
  };

  const parsingMessages = [
    'Analyzing meal text...',
    'Identifying food items & portions...',
    'Matching ICMR-NIN Indian database...',
    'Estimating realistic carb ranges...'
  ];

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white text-[#103331]">
      <div className="max-w-6xl mx-auto space-y-16">
        {/* Section Header */}
        <div className="max-w-3xl space-y-3">
          <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] font-display">
            STAGE 03 • AI MEAL PARSING & CARB ESTIMATION
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-[#043F3D] font-editorial tracking-tight">
            "What did you eat?"
          </h2>
          <p className="text-sm sm:text-base text-[#657572]">
            Type in everyday Hindi or English. Google Gemini identifies individual dishes and computes calibrated carbohydrate loads.
          </p>
        </div>

        {/* Interactive Parsing Demonstration Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Natural Input Canvas (6 cols) */}
          <div className="lg:col-span-6 p-7 rounded-[26px] bg-[#F7F7F3] border border-[#DCE6E2] space-y-5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#043F3D] flex items-center space-x-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#075B57]" />
                <span>Natural Meal Input</span>
              </label>
              <span className="text-[11px] text-[#657572] font-semibold">Gemini 1.5 NLP</span>
            </div>

            <textarea
              value={mealInput}
              onChange={(e) => setMealInput(e.target.value)}
              rows={3}
              placeholder="e.g., 2 rotis, dal tadka and steamed rice"
              className="w-full p-4 bg-white border border-[#DCE6E2] rounded-2xl text-sm font-medium text-[#103331] focus:outline-none focus:border-[#075B57] resize-none shadow-xs"
            />

            {/* Quick Demo Sentence Chips */}
            <div className="space-y-1.5">
              <span className="text-[10px] font-bold text-[#657572] uppercase block">
                Quick Example Dishes:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {[
                  '2 rotis, dal and rice',
                  '2 idlis and 1 bowl sambar',
                  '1 masala dosa with chutney',
                  '1 plate pav bhaji'
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setMealInput(preset);
                      setParsingStep(0);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-white border border-[#DCE6E2] text-xs font-semibold text-[#043F3D] hover:border-[#075B57] transition-colors"
                  >
                    {preset}
                  </button>
                ))}
              </div>
            </div>

            {/* Parse Button */}
            <button
              onClick={handleSimulateParse}
              disabled={isParsing}
              className="w-full py-3.5 px-4 rounded-xl bg-[#075B57] hover:bg-[#043F3D] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2"
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>{parsingMessages[parsingStep - 1] || 'Analyzing...'}</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Analyze Meal & Estimate Carbs</span>
                </>
              )}
            </button>
          </div>

          {/* Right Column: Structured Output & Animated Carb Bars (6 cols) */}
          <div className="lg:col-span-6 p-7 rounded-[26px] bg-[#EFF8F3] border border-[#DCE6E2] space-y-6">
            {/* Top Carb Total Hero */}
            <div className="flex items-center justify-between border-b border-[#075B57]/15 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#075B57] bg-white px-2.5 py-0.5 rounded-full border border-[#075B57]/20">
                  HIGH CONFIDENCE ESTIMATION
                </span>
                <div className="text-4xl sm:text-5xl font-black text-[#043F3D] font-editorial mt-2">
                  76g <span className="text-base font-normal text-[#657572]">Total Carbs</span>
                </div>
                <span className="text-xs font-bold text-[#075B57]">
                  Realistic Culinary Range: 68–84g
                </span>
              </div>

              <div className="text-right">
                <span className="text-[10px] font-bold text-[#657572] block">Reference Bolus:</span>
                <span className="text-2xl font-black text-[#043F3D] font-display">
                  ~5.1 U
                </span>
                <span className="text-[10px] text-[#657572] block">(ICR 1:15)</span>
              </div>
            </div>

            {/* Itemized Horizontal Carbohydrate Bars */}
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-wider text-[#043F3D] block">
                Itemized Carbohydrate Contribution:
              </span>

              {/* Bar 1: Roti */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[#043F3D]">
                  <span>🫓 Whole Wheat Roti × 2</span>
                  <span>30g (39%)</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-black/5">
                  <div className="h-full bg-[#075B57] rounded-full transition-all duration-700" style={{ width: '39%' }} />
                </div>
              </div>

              {/* Bar 2: Dal Tadka */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[#043F3D]">
                  <span>🍲 Toor Dal Tadka × 1 bowl</span>
                  <span>18g (24%)</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-black/5">
                  <div className="h-full bg-[#24A66A] rounded-full transition-all duration-700" style={{ width: '24%' }} />
                </div>
              </div>

              {/* Bar 3: Steamed Rice */}
              <div className="space-y-1 text-xs">
                <div className="flex justify-between font-bold text-[#043F3D]">
                  <span>🍚 Steamed White Rice × 1 bowl</span>
                  <span>28g (37%)</span>
                </div>
                <div className="w-full h-2.5 bg-white rounded-full overflow-hidden border border-black/5">
                  <div className="h-full bg-[#E7B84B] rounded-full transition-all duration-700" style={{ width: '37%' }} />
                </div>
              </div>
            </div>

            <button
              onClick={onNavigateToMeal}
              className="w-full py-3 rounded-xl bg-white hover:bg-[#F7F7F3] border border-[#075B57]/30 text-xs font-bold text-[#075B57] uppercase transition-all shadow-xs flex items-center justify-center space-x-1.5"
            >
              <span>Open Full Meal Estimator (+ / - Adjust Portions)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
