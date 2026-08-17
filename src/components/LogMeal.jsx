import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  parseIndianMeal, 
  DEMO_MEAL_PRESETS, 
  SAMPLE_PHOTO_PRESETS 
} from '../utils/indianMealsEngine';
import { 
  Utensils, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  UploadCloud, 
  ShieldCheck,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LogMeal() {
  const { carryMealToRiskCheck, logMeal } = useApp();

  const [mealText, setMealText] = useState('2 rotis, dal and rice');
  const [isParsing, setIsParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState(() => parseIndianMeal('2 rotis, dal and rice'));
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState(SAMPLE_PHOTO_PRESETS[0]);
  const [mealLoggedSuccess, setMealLoggedSuccess] = useState(false);

  // Handle Text Parsing
  const handleEstimateCarbs = (overrideText = null) => {
    const textToParse = overrideText !== null ? overrideText : mealText;
    if (!textToParse.trim()) return;

    setIsParsing(true);
    setMealLoggedSuccess(false);

    setTimeout(() => {
      const result = parseIndianMeal(textToParse);
      setParsedResult(result);
      setIsParsing(false);
    }, 550);
  };

  // Handle Quick Suggestion Click
  const handleSelectPreset = (preset) => {
    setMealText(preset.description);
    handleEstimateCarbs(preset.description);
  };

  // Handle Photo Preset Select
  const handleSelectPhoto = (photo) => {
    setSelectedPhotoPreset(photo);
    setIsParsing(true);
    setMealLoggedSuccess(false);

    setTimeout(() => {
      const result = parseIndianMeal(photo.detectedMeal);
      setParsedResult(result);
      setIsParsing(false);
    }, 600);
  };

  // Handle File Upload Simulation
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsParsing(true);
      setTimeout(() => {
        const result = parseIndianMeal('2 rotis, dal and rice');
        setParsedResult(result);
        setIsParsing(false);
      }, 650);
    }
  };

  // Hero Demo Action: Continue to Risk Check
  const handleContinueToRiskCheck = () => {
    const carbs = parsedResult ? parsedResult.totalCarbs : 68;
    carryMealToRiskCheck(carbs, mealText || 'Indian Meal');
  };

  // Save to Log only
  const handleSaveAndLog = () => {
    if (!parsedResult) return;
    logMeal({
      mealTitle: 'Logged Meal',
      description: mealText || (selectedPhotoPreset ? selectedPhotoPreset.title : 'Indian Meal'),
      totalCarbs: parsedResult.totalCarbs,
      confidence: parsedResult.confidence,
      items: parsedResult.items
    });
    setMealLoggedSuccess(true);
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.7 }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-[6px] bg-[#FFE0D1] text-[#552310]">
            🍽️ INDIAN NUTRITION JOURNAL
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172640] tracking-tight font-display pt-2">
          What did you eat?
        </h2>
        <p className="text-sm lg:text-base text-[#5A6E85] font-normal mt-1">
          Tell GlucoSaathi about your meal. We calculate exact Indian carb counts and portions.
        </p>
      </div>

      {/* 2-Column Food Journal Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN: Input Card & Photo Upload (7 cols) */}
        <div className="lg:col-span-7 space-y-5">
          {/* Main White Input Card */}
          <div className="p-6 sm:p-7 rounded-[14px] bg-white border border-[#E2E8DF] paper-elevation-base space-y-5">
            <div className="space-y-2">
              <label className="text-xs font-black text-[#172640] uppercase tracking-wider block">
                DESCRIBE YOUR MEAL
              </label>

              <textarea
                value={mealText}
                onChange={(e) => setMealText(e.target.value)}
                placeholder="Example: 2 rotis, dal, rice and curd"
                rows={3}
                className="w-full px-4 py-3 rounded-[10px] bg-[#F7F8F4] border border-[#DEE5DC] text-[#172640] placeholder-[#8292A6] text-sm font-semibold focus:outline-none focus:bg-white focus:border-[#00AFC1] focus:ring-1 focus:ring-[#00AFC1] transition-all resize-none leading-relaxed"
              />
            </div>

            {/* Quick Demo Indian Meal Suggestions */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase text-[#5A6E85] flex items-center space-x-1">
                <Zap className="w-3.5 h-3.5 text-[#00AFC1]" />
                <span>QUICK DEMO SUGGESTIONS:</span>
              </span>

              <div className="flex flex-wrap gap-2">
                {DEMO_MEAL_PRESETS.map((preset, index) => {
                  const isSelected = mealText === preset.description;
                  return (
                    <button
                      key={index}
                      onClick={() => handleSelectPreset(preset)}
                      className={`text-xs px-3 py-1.5 rounded-[8px] font-bold border transition-all flex items-center space-x-1.5 cursor-pointer ${
                        isSelected
                          ? 'bg-[#00AFC1] text-white border-[#00AFC1] shadow-xs'
                          : 'bg-[#F2F5F2] text-[#172640] border-[#DEE5DC] hover:bg-[#E8EDE8]'
                      }`}
                    >
                      <span>{preset.icon}</span>
                      <span>{preset.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Primary Action CTA */}
            <button
              onClick={() => handleEstimateCarbs()}
              disabled={isParsing || !mealText.trim()}
              className="w-full flex items-center justify-center space-x-2 py-3 px-5 rounded-[10px] bg-[#00AFC1] hover:bg-[#0098A8] disabled:opacity-50 text-white font-black text-sm shadow-xs transition-all cursor-pointer"
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing Indian food items...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Estimate carbs →</span>
                </>
              )}
            </button>
          </div>

          {/* Photo Recognition Card */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-white border border-[#B8E8D2] paper-elevation-base space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <span className="text-lg">📷</span>
                <h4 className="text-xs font-black uppercase tracking-wider text-[#172640]">
                  ADD A PHOTO OF YOUR MEAL
                </h4>
              </div>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-[6px] bg-[#D8F3E7] text-[#093B22]">
                Simulated AI
              </span>
            </div>
            <p className="text-xs text-[#5A6E85] font-medium">
              Take a photo or upload an image to identify rotis, rice portions & curries.
            </p>

            {/* Photo Preset Cards */}
            <div className="grid grid-cols-3 gap-2.5">
              {SAMPLE_PHOTO_PRESETS.map((photo) => (
                <button
                  key={photo.id}
                  onClick={() => handleSelectPhoto(photo)}
                  className={`p-3 rounded-[10px] text-left border transition-all flex flex-col justify-between cursor-pointer ${
                    selectedPhotoPreset?.id === photo.id
                      ? 'bg-[#D8F3E7] text-[#093B22] border-[#093B22] shadow-xs'
                      : 'bg-[#FAFBF8] text-[#172640] border-[#E2E8DF] hover:bg-[#F2F5F2]'
                  }`}
                >
                  <span className="text-xl mb-1">{photo.imagePlaceholder}</span>
                  <p className="text-xs font-black truncate">{photo.title}</p>
                  <p className="text-[10px] font-bold text-[#00AFC1] mt-0.5">{photo.carbs}g carbs</p>
                </button>
              ))}
            </div>

            {/* Custom Upload Dropzone */}
            <label className="flex items-center justify-center space-x-3 p-3 border border-dashed border-[#B8E8D2] hover:border-[#00AFC1] rounded-[10px] bg-[#FAFBF8] cursor-pointer transition-colors group">
              <UploadCloud className="w-4 h-4 text-[#00AFC1]" />
              <span className="text-xs font-bold text-[#172640]">
                Upload local meal image
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN: Result Card (Warm Peach #FFE0D1) (5 cols) */}
        <div className="lg:col-span-5 space-y-5 sticky top-6">
          {/* Loading state */}
          {isParsing && (
            <div className="p-9 rounded-[14px] bg-[#FFE0D1] text-[#552310] border border-[#FFC4AB] paper-elevation-hero text-center space-y-3 animate-pulse">
              <div className="w-11 h-11 mx-auto rounded-[10px] bg-[#552310] text-[#FFE0D1] flex items-center justify-center animate-spin text-xl font-bold">
                <RefreshCw className="w-5 h-5" />
              </div>
              <h4 className="text-lg font-black text-[#552310] font-display">
                Estimating carbohydrates...
              </h4>
              <p className="text-xs text-[#8D4023] font-medium">
                Parsing Roti, Dal, Rice portions...
              </p>
            </div>
          )}

          {/* Result Panel */}
          {!isParsing && parsedResult && parsedResult.items && (
            <div className="rounded-[14px] bg-[#FFE0D1] text-[#552310] border border-[#FFC4AB] paper-elevation-hero p-6 sm:p-7 space-y-5 animate-fade-in">
              {/* Header */}
              <div className="pb-4 border-b border-[#FFC4AB] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black uppercase tracking-wider text-[#8D4023]">
                    ESTIMATED CARBOHYDRATES
                  </span>
                  <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#552310] text-[#FFE0D1]">
                    <ShieldCheck className="w-3 h-3" />
                    <span>{parsedResult.confidence} Confidence</span>
                  </span>
                </div>

                <div className="flex items-baseline space-x-2 pt-1">
                  <span className="text-5xl font-black text-[#552310] font-display">
                    {parsedResult.totalCarbs}
                  </span>
                  <span className="text-2xl font-black text-[#8D4023]">g carbs</span>
                </div>
              </div>

              {/* Food Item Breakdown Blocks */}
              <div className="space-y-2">
                <span className="text-xs font-black text-[#8D4023] uppercase tracking-wider block">
                  MEAL BREAKDOWN
                </span>

                <div className="space-y-2">
                  {parsedResult.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-[10px] bg-white text-[#552310] border border-[#FFC4AB] paper-elevation-base flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-xl">{item.icon || '🍛'}</span>
                        <div>
                          <p className="text-xs font-black text-[#552310]">
                            {item.name}
                          </p>
                          <p className="text-[11px] text-[#8D4023] font-medium">
                            {item.quantity}
                          </p>
                        </div>
                      </div>

                      <span className="text-sm font-black text-[#552310] font-display">
                        {item.carbs}g
                      </span>
                    </div>
                  ))}
                </div>

                {/* Total Row */}
                <div className="pt-2 flex items-center justify-between text-xs font-black text-[#552310] px-1">
                  <span>TOTAL CARBOHYDRATES</span>
                  <span className="text-base text-[#552310] font-display">{parsedResult.totalCarbs}g</span>
                </div>
              </div>

              {/* Success Notification if Logged */}
              {mealLoggedSuccess && (
                <div className="p-3 rounded-[10px] bg-[#D8F3E7] text-[#093B22] border border-[#B8E8D2] text-xs font-bold flex items-center space-x-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 text-[#093B22] shrink-0" />
                  <span>Logged to your personal health history!</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="space-y-2 pt-2">
                <button
                  onClick={handleContinueToRiskCheck}
                  className="w-full flex items-center justify-center space-x-2 py-3 px-5 rounded-[10px] bg-[#552310] hover:bg-[#3B170A] text-[#FFE0D1] font-black text-sm shadow-xs transition-all cursor-pointer group"
                >
                  <span>Continue to risk check</span>
                  <span className="opacity-90 font-normal">({parsedResult.totalCarbs}g)</span>
                  <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </button>

                <button
                  onClick={handleSaveAndLog}
                  className="w-full py-2 rounded-[10px] bg-white hover:bg-[#F2F5F2] text-[#552310] font-bold text-xs border border-[#FFC4AB] transition-all cursor-pointer"
                >
                  Save to log only
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
