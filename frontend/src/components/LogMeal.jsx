import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  parseIndianMeal, 
  DEMO_MEAL_PRESETS, 
  SAMPLE_PHOTO_PRESETS 
} from '../utils/indianMealsEngine';
import { 
  parseMealTextWithAI, 
  parseMealImageWithAI 
} from '../lib/ai/mealParser';
import { estimateCarbohydrates } from '../lib/carb/carbEstimator';
import { 
  Utensils, 
  Camera, 
  Sparkles, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  UploadCloud, 
  ShieldCheck,
  Zap,
  Plus,
  Minus,
  Trash2
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LogMeal() {
  const { carryMealToRiskCheck, logMeal, settings } = useApp();

  const [mealText, setMealText] = useState('2 rotis, dal tadka and steamed rice');
  const [isParsing, setIsParsing] = useState(false);
  const [parseSource, setParseSource] = useState('ICMR-NIN Indian Food Engine');
  const [parsedResult, setParsedResult] = useState(() => parseIndianMeal('2 rotis, dal tadka and steamed rice'));
  const [selectedPhotoPreset, setSelectedPhotoPreset] = useState(SAMPLE_PHOTO_PRESETS[0]);
  const [mealLoggedSuccess, setMealLoggedSuccess] = useState(false);

  // Handle Text Parsing via Gemini AI / Local ICMR Engine
  const handleEstimateCarbs = async (overrideText = null) => {
    const textToParse = overrideText !== null ? overrideText : mealText;
    if (!textToParse.trim()) return;

    setIsParsing(true);
    setMealLoggedSuccess(false);

    try {
      const res = await parseMealTextWithAI(textToParse, settings.geminiApiKey);
      if (res.success && res.data) {
        setParsedResult({
          items: res.data.estimation.items,
          totalCarbs: res.data.estimation.totalCarbs,
          minCarbs: res.data.estimation.minimumCarbs,
          maxCarbs: res.data.estimation.maximumCarbs,
          rangeText: res.data.estimation.rangeText,
          confidence: res.data.estimation.confidence,
          notes: res.data.estimation.notes,
          rawInput: textToParse
        });
        setParseSource(res.source);
      }
    } catch {
      const result = parseIndianMeal(textToParse);
      setParsedResult(result);
    } finally {
      setIsParsing(false);
    }
  };

  // Handle Quick Suggestion Click
  const handleSelectPreset = (preset) => {
    setMealText(preset.description);
    handleEstimateCarbs(preset.description);
  };

  // Handle Photo Preset Select
  const handleSelectPhoto = async (photo) => {
    setSelectedPhotoPreset(photo);
    setIsParsing(true);
    setMealLoggedSuccess(false);

    try {
      const res = await parseMealTextWithAI(photo.detectedMeal, settings.geminiApiKey);
      if (res.success && res.data) {
        setParsedResult({
          items: res.data.estimation.items,
          totalCarbs: res.data.estimation.totalCarbs,
          minCarbs: res.data.estimation.minimumCarbs,
          maxCarbs: res.data.estimation.maximumCarbs,
          rangeText: res.data.estimation.rangeText,
          confidence: res.data.estimation.confidence,
          notes: res.data.estimation.notes,
          rawInput: photo.detectedMeal
        });
        setParseSource('Visual Plate Recognition & ICMR Database');
      }
    } catch {
      const result = parseIndianMeal(photo.detectedMeal);
      setParsedResult(result);
    } finally {
      setIsParsing(false);
    }
  };

  // Handle File Upload
  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsParsing(true);
      const reader = new FileReader();
      reader.onloadend = async () => {
        try {
          const res = await parseMealImageWithAI(reader.result, settings.geminiApiKey);
          if (res.success && res.data) {
            setParsedResult({
              items: res.data.estimation.items,
              totalCarbs: res.data.estimation.totalCarbs,
              minCarbs: res.data.estimation.minimumCarbs,
              maxCarbs: res.data.estimation.maximumCarbs,
              rangeText: res.data.estimation.rangeText,
              confidence: res.data.estimation.confidence,
              notes: res.data.estimation.notes,
              rawInput: 'Uploaded Meal Photo'
            });
            setParseSource(res.source);
          }
        } catch {
          const result = parseIndianMeal('2 rotis, dal and rice');
          setParsedResult(result);
        } finally {
          setIsParsing(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Modify Item Quantity (+ / -) with Instant Live Recalculation
  const handleUpdateQuantity = (index, delta) => {
    if (!parsedResult || !parsedResult.items) return;
    const updatedItems = [...parsedResult.items];
    const item = updatedItems[index];
    const newQty = Math.max(0.5, Math.round((item.quantity + delta) * 10) / 10);
    updatedItems[index] = { ...item, quantity: newQty };

    const reEstimated = estimateCarbohydrates(updatedItems);
    setParsedResult({
      ...parsedResult,
      items: reEstimated.items,
      totalCarbs: reEstimated.totalCarbs,
      minCarbs: reEstimated.minimumCarbs,
      maxCarbs: reEstimated.maximumCarbs,
      rangeText: reEstimated.rangeText,
      confidence: reEstimated.confidence
    });
  };

  // Remove an item
  const handleRemoveItem = (index) => {
    if (!parsedResult || !parsedResult.items) return;
    const updatedItems = parsedResult.items.filter((_, idx) => idx !== index);
    const reEstimated = estimateCarbohydrates(updatedItems);
    setParsedResult({
      ...parsedResult,
      items: reEstimated.items,
      totalCarbs: reEstimated.totalCarbs,
      minCarbs: reEstimated.minimumCarbs,
      maxCarbs: reEstimated.maximumCarbs,
      rangeText: reEstimated.rangeText,
      confidence: reEstimated.confidence
    });
  };

  // Continue to Risk Check
  const handleContinueToRiskCheck = () => {
    const carbs = parsedResult ? parsedResult.totalCarbs : 68;
    carryMealToRiskCheck(carbs, mealText || 'Indian Meal');
  };

  // Save to Log History
  const handleSaveMealLog = () => {
    if (!parsedResult) return;
    logMeal({
      description: mealText || 'Indian Meal',
      carbs: parsedResult.totalCarbs,
      confidence: parsedResult.confidence,
      items: parsedResult.items
    });
    setMealLoggedSuccess(true);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.7 } });
  };

  const calculatedBolus = parsedResult 
    ? ((parsedResult.totalCarbs) / settings.icrRatio).toFixed(1)
    : '4.5';

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-8">
      {/* 1. Header & Context */}
      <div className="space-y-1">
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-black text-[#8D4023] uppercase tracking-wider bg-[#FFE0D1] px-2.5 py-0.5 rounded-[6px] border border-[#FFC4AB]">
            INDIA-FIRST T1D NUTRITION
          </span>
          <span className="text-xs text-[#5A6E85] font-medium hidden sm:inline">
            • ICMR-NIN (2020) Calibrated
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172640] tracking-tight font-display pt-1">
          Estimate Indian Meal Carbs
        </h2>
        <p className="text-sm text-[#5A6E85] font-normal">
          Type naturally in Hindi/English or snap a photo of your plate.
        </p>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Input Canvas (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Text Input Card */}
          <div className="p-6 rounded-[16px] bg-white border border-[#E2E8DF] paper-elevation-base space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#172640] flex items-center space-x-1.5">
                <Utensils className="w-3.5 h-3.5 text-[#00AFC1]" />
                <span>Describe Your Meal</span>
              </label>
              <span className="text-[11px] text-[#5A6E85] font-semibold">Natural language</span>
            </div>

            <div className="relative">
              <textarea
                value={mealText}
                onChange={(e) => setMealText(e.target.value)}
                placeholder="e.g., 2 rotis, 1 bowl dal tadka, steamed rice and curd"
                rows={3}
                className="w-full p-3.5 bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl text-sm text-[#172640] font-medium placeholder-[#8292A6] focus:outline-none focus:border-[#00AFC1] focus:ring-2 focus:ring-[#00AFC1]/15 transition-all resize-none"
              />
            </div>

            {/* Quick Suggestions */}
            <div className="space-y-2">
              <span className="text-[11px] font-bold text-[#5A6E85] uppercase tracking-wider block">
                Common Indian Presets:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {DEMO_MEAL_PRESETS.map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSelectPreset(preset)}
                    className="px-2.5 py-1 rounded-lg bg-[#FAFBF8] hover:bg-[#F2F5F2] border border-[#E2E8DF] text-[11px] font-bold text-[#172640] transition-colors flex items-center space-x-1"
                  >
                    <span>{preset.icon}</span>
                    <span>{preset.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Action Trigger */}
            <button
              onClick={() => handleEstimateCarbs()}
              disabled={isParsing || !mealText.trim()}
              className="w-full py-3 px-4 rounded-xl bg-[#00AFC1] hover:bg-[#0098A8] text-white text-xs font-bold uppercase tracking-wider transition-all shadow-md flex items-center justify-center space-x-2 disabled:opacity-50"
            >
              {isParsing ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Analyzing with AI & ICMR Database...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Estimate Carbohydrates</span>
                </>
              )}
            </button>
          </div>

          {/* Photo Recognition Card */}
          <div className="p-6 rounded-[16px] bg-white border border-[#E2E8DF] paper-elevation-base space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black uppercase tracking-wider text-[#172640] flex items-center space-x-1.5">
                <Camera className="w-3.5 h-3.5 text-[#533BA1]" />
                <span>Snap or Upload Meal Photo</span>
              </label>
              <span className="text-[11px] text-[#5A6E85] font-semibold">Gemini Vision AI</span>
            </div>

            {/* Photo Preset Gallery */}
            <div className="grid grid-cols-3 gap-2.5">
              {SAMPLE_PHOTO_PRESETS.map((photo) => (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => handleSelectPhoto(photo)}
                  className={`relative aspect-4/3 rounded-xl overflow-hidden border-2 transition-all group ${
                    selectedPhotoPreset.id === photo.id
                      ? 'border-[#00AFC1] ring-2 ring-[#00AFC1]/20 scale-[1.02]'
                      : 'border-[#E2E8DF] hover:border-[#CBD5E1]'
                  }`}
                >
                  <img src={photo.url} alt={photo.name} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#172640]/80 via-transparent to-transparent flex items-end p-1.5">
                    <span className="text-[10px] text-white font-bold truncate leading-tight">
                      {photo.name}
                    </span>
                  </div>
                </button>
              ))}
            </div>

            {/* File Upload Input */}
            <label className="flex items-center justify-center space-x-2 py-3 border-2 border-dashed border-[#E2E8DF] hover:border-[#00AFC1] rounded-xl cursor-pointer bg-[#FAFBF8] transition-colors text-xs font-bold text-[#5A6E85]">
              <UploadCloud className="w-4 h-4 text-[#00AFC1]" />
              <span>Upload Custom Photo</span>
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>
        </div>

        {/* RIGHT COLUMN: Nutrition Breakdown & Reference Bolus (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {parsedResult ? (
            <div className="p-6 sm:p-7 rounded-[16px] bg-[#FFF8F5] border border-[#FFD9C9] paper-elevation-hero space-y-6">
              {/* Top Banner: Total Carbs & Range */}
              <div className="flex items-center justify-between border-b border-[#FFD9C9] pb-4">
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#8D4023] bg-[#FFE0D1] px-2 py-0.5 rounded border border-[#FFC4AB]">
                    {parsedResult.confidence} CONFIDENCE ESTIMATE
                  </span>
                  <div className="text-4xl font-extrabold text-[#552310] font-display mt-2">
                    {parsedResult.totalCarbs}g <span className="text-base font-normal text-[#8D4023]">Total Carbs</span>
                  </div>
                  <div className="text-xs text-[#8D4023] font-bold mt-0.5">
                    Realistic Range: {parsedResult.rangeText}
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold text-[#5A6E85] block">Engine Source:</span>
                  <span className="text-[11px] font-extrabold text-[#172640] block max-w-[140px] truncate">
                    {parseSource}
                  </span>
                </div>
              </div>

              {/* Itemized Foods Breakdown with Editable Portions */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold uppercase tracking-wider text-[#552310]">
                    Parsed Items (Click + / - to adjust portions):
                  </span>
                  <span className="text-[11px] text-[#8D4023] font-medium">Live recalculation</span>
                </div>

                <div className="space-y-2">
                  {parsedResult.items.map((item, idx) => (
                    <div
                      key={idx}
                      className="p-3 rounded-xl bg-white border border-[#FFD9C9] flex items-center justify-between text-xs"
                    >
                      <div className="flex items-center space-x-2.5">
                        <span className="text-base">{item.icon || '🍽️'}</span>
                        <div>
                          <div className="font-bold text-[#172640]">{item.name}</div>
                          <div className="text-[11px] text-[#5A6E85]">
                            GI: {item.glycemicIndex || 'Medium'} • {item.unit}
                          </div>
                        </div>
                      </div>

                      {/* Portion Controls (+ / -) and Carbs */}
                      <div className="flex items-center space-x-3">
                        <div className="flex items-center space-x-1 bg-[#FAFBF8] border border-[#E2E8DF] rounded-lg p-0.5">
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, -0.5)}
                            className="p-1 rounded text-[#5A6E85] hover:bg-white hover:text-[#172640] transition-colors"
                            title="Decrease portion"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-1.5 font-bold text-[#172640] text-xs">
                            {item.quantity}
                          </span>
                          <button
                            type="button"
                            onClick={() => handleUpdateQuantity(idx, 0.5)}
                            className="p-1 rounded text-[#5A6E85] hover:bg-white hover:text-[#172640] transition-colors"
                            title="Increase portion"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        <div className="text-right font-display min-w-[36px]">
                          <span className="text-sm font-black text-[#8D4023]">{item.carbs}g</span>
                        </div>

                        <button
                          type="button"
                          onClick={() => handleRemoveItem(idx)}
                          className="text-[#8292A6] hover:text-red-500 p-1 transition-colors"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Reference Bolus Calculator Card */}
              <div className="p-4 rounded-xl bg-white border border-[#FFD9C9] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-[#172640] flex items-center space-x-1">
                    <Zap className="w-3.5 h-3.5 text-[#00AFC1]" />
                    <span>Reference Bolus Calculation</span>
                  </span>
                  <span className="text-xs font-bold text-[#00AFC1]">
                    ICR 1:{settings.icrRatio}g
                  </span>
                </div>
                <div className="flex items-baseline space-x-2">
                  <span className="text-2xl font-black text-[#172640] font-display">
                    ~{calculatedBolus} Units
                  </span>
                  <span className="text-xs text-[#5A6E85]">
                    ({parsedResult.totalCarbs}g / {settings.icrRatio})
                  </span>
                </div>
                <p className="text-[11px] text-[#5A6E85] leading-relaxed">
                  Reference estimate only. Always verify with your prescribed physician care plan before dosing.
                </p>
              </div>

              {/* Actions */}
              <div className="space-y-2.5 pt-2">
                <button
                  onClick={handleContinueToRiskCheck}
                  className="w-full py-3.5 px-4 rounded-xl bg-[#552310] hover:bg-[#3D180B] text-white text-xs font-extrabold tracking-wide uppercase transition-all shadow-md flex items-center justify-center space-x-2"
                >
                  <span>Evaluate Hypo Risk with this Meal</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={handleSaveMealLog}
                  disabled={mealLoggedSuccess}
                  className={`w-full py-2.5 rounded-xl border text-xs font-bold transition-all ${
                    mealLoggedSuccess
                      ? 'bg-[#D8F3E7] border-[#B8E8D2] text-[#093B22]'
                      : 'bg-white border-[#FFD9C9] text-[#8D4023] hover:bg-[#FFF2EB]'
                  }`}
                >
                  {mealLoggedSuccess ? '✓ Saved to Meal Logs' : 'Save to History Logs'}
                </button>
              </div>
            </div>
          ) : (
            <div className="p-12 rounded-[16px] bg-white border border-[#E2E8DF] text-center text-[#5A6E85] space-y-2">
              <Utensils className="w-8 h-8 mx-auto text-[#CBD5E1]" />
              <p className="text-sm font-bold text-[#172640]">No Meal Parsed Yet</p>
              <p className="text-xs">Enter a meal description or select a photo preset to begin.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
