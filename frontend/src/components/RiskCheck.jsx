import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Activity, 
  Clock, 
  Flame, 
  Utensils, 
  Syringe, 
  Info, 
  CheckCircle2, 
  Zap, 
  ArrowRight,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { calculateBolusReference } from '../lib/risk/riskEngine';

export default function RiskCheck() {
  const { 
    riskInputs, 
    setRiskInputs, 
    riskResult, 
    applyPresetScenario, 
    logRiskCheckToHistory,
    settings 
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSaveToHistory = () => {
    logRiskCheckToHistory();
    setSavedSuccess(true);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const calculatedBolus = calculateBolusReference({
    carbohydrates: riskInputs.carbsConsumed,
    insulinCarbRatio: settings.icrRatio,
    currentGlucose: riskInputs.glucose,
    targetGlucose: 110,
    correctionFactor: settings.correctionFactor,
    activeIob: riskInputs.insulinOnBoard
  });

  const getRiskStyles = (level) => {
    switch (level) {
      case 'HIGH':
        return {
          color: '#C84B52',
          bgColor: '#FDE8E9',
          borderColor: '#FFB4A8',
          label: 'HIGH RISK ALERT'
        };
      case 'MODERATE':
        return {
          color: '#8D4023',
          bgColor: '#FEF7E6',
          borderColor: '#FFE280',
          label: 'MODERATE RISK'
        };
      default:
        return {
          color: '#075B57',
          bgColor: '#DFF4E8',
          borderColor: '#B8E8D2',
          label: 'LOW RISK (SAFE)'
        };
    }
  };

  const riskStyles = getRiskStyles(riskResult.riskLevel);

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-8 pt-4">
      {/* 1. Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
              EXPLAINABLE CLINICAL REASONING
            </span>
            <span className="text-xs text-[#66716F]">
              • 4-Factor Weighted Model
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight pt-1">
            Hypoglycemia Risk Evaluation
          </h2>
          <p className="text-sm text-[#66716F]">
            Adjust your current parameters to see how insulin, meals, and exercise interact.
          </p>
        </div>

        {/* Preset Evaluator Scenarios */}
        <div className="flex flex-wrap items-center gap-1.5 self-start md:self-auto">
          <span className="text-[11px] font-bold text-[#66716F] mr-1">Presets:</span>
          <button
            onClick={() => applyPresetScenario('SAFE_LOW')}
            className="px-3 py-1 rounded-full text-xs font-bold bg-[#DFF4E8] text-[#075B57] hover:opacity-80 transition-opacity"
          >
            Safe State
          </button>
          <button
            onClick={() => applyPresetScenario('MODERATE_CAUTION')}
            className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF7E6] text-[#8D4023] hover:opacity-80 transition-opacity"
          >
            Active IOB
          </button>
          <button
            onClick={() => applyPresetScenario('HIGH_RISK')}
            className="px-3 py-1 rounded-full text-xs font-bold bg-[#FDE8E9] text-[#C84B52] hover:opacity-80 transition-opacity"
          >
            Hypo Alert
          </button>
        </div>
      </div>

      {/* 2. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT: Interactive Parameter Controls (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="editorial-card p-6 sm:p-7 space-y-6">
            <h3 className="text-base font-extrabold text-[#063F3D] font-display flex items-center space-x-2">
              <Activity className="w-4 h-4 text-[#075B57]" />
              <span>Current Contextual Parameters</span>
            </h3>

            {/* Slider 1: Blood Glucose */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold uppercase tracking-wider text-[#66716F]">
                  Current Blood Glucose:
                </label>
                <span className="text-xl font-black text-[#063F3D] font-display">
                  {riskInputs.glucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="300"
                step="1"
                value={riskInputs.glucose}
                onChange={(e) => setRiskInputs(prev => ({ ...prev, glucose: Number(e.target.value) }))}
                className="w-full accent-[#075B57] h-2 bg-[#F3F1EA] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#66716F] font-bold">
                <span className="text-[#C84B52]">40 (Severe Hypo)</span>
                <span className="text-[#1E9E67]">70–140 (Target Range)</span>
                <span className="text-[#8D4023]">300 (High)</span>
              </div>
            </div>

            {/* Slider 2: Active Insulin On Board (IOB) */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold uppercase tracking-wider text-[#66716F]">
                  Active Insulin on Board (IOB):
                </label>
                <span className="text-xl font-black text-[#063F3D] font-display">
                  {riskInputs.insulinOnBoard} <span className="text-xs font-normal text-[#66716F]">Units</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="8"
                step="0.1"
                value={riskInputs.insulinOnBoard}
                onChange={(e) => setRiskInputs(prev => ({ ...prev, insulinOnBoard: Number(e.target.value) }))}
                className="w-full accent-[#075B57] h-2 bg-[#F3F1EA] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#66716F] font-bold">
                <span>0 U (None)</span>
                <span>2.0 U (Moderate)</span>
                <span>8.0 U (Heavy Stacking)</span>
              </div>
            </div>

            {/* Slider 3: Carbs Consumed */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold uppercase tracking-wider text-[#66716F]">
                  Carbohydrates Consumed:
                </label>
                <span className="text-xl font-black text-[#063F3D] font-display">
                  {riskInputs.carbsConsumed} <span className="text-xs font-normal text-[#66716F]">g</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="150"
                step="2"
                value={riskInputs.carbsConsumed}
                onChange={(e) => setRiskInputs(prev => ({ ...prev, carbsConsumed: Number(e.target.value), carbsCovered: Number(e.target.value) }))}
                className="w-full accent-[#075B57] h-2 bg-[#F3F1EA] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#66716F] font-bold">
                <span>0g (Skipped)</span>
                <span>68g (Standard Thali)</span>
                <span>150g (Large)</span>
              </div>
            </div>

            {/* Selector: Physical Activity */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-[#66716F] block">
                Recent Physical Activity:
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['Resting', 'Light', 'Moderate', 'Intense'].map((act) => (
                  <button
                    key={act}
                    type="button"
                    onClick={() => setRiskInputs(prev => ({ ...prev, activityLevel: act }))}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      riskInputs.activityLevel === act
                        ? 'bg-[#075B57] text-white shadow-xs'
                        : 'bg-[#F7F8F5] border border-black/5 text-[#66716F] hover:bg-[#F3F1EA]'
                    }`}
                  >
                    {act}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Visual Risk Centerpiece & "Why?" Breakdown (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          {/* Risk Gauge Card */}
          <div className="editorial-card p-6 sm:p-7 space-y-6">
            {/* Top Risk Status & Gauge */}
            <div className="flex items-center justify-between border-b border-black/5 pb-5">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#66716F] block">
                  EVALUATED HYPOGLYCEMIA RISK
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-editorial mt-1" style={{ color: riskStyles.color }}>
                  {riskResult.riskLevel}
                </div>
                <span className="text-xs font-bold text-[#66716F]">
                  Risk Score: {riskResult.score} / 100
                </span>
              </div>

              <div className="w-16 h-16 rounded-full flex items-center justify-center font-display font-black text-lg border-4" style={{
                backgroundColor: riskStyles.bgColor,
                borderColor: riskStyles.color,
                color: riskStyles.color
              }}>
                {riskResult.score}
              </div>
            </div>

            {/* Headline & Explanation */}
            <div className="p-4 rounded-2xl border space-y-1.5" style={{ backgroundColor: riskStyles.bgColor, borderColor: riskStyles.borderColor }}>
              <h4 className="text-sm font-extrabold" style={{ color: riskStyles.color }}>
                {riskResult.headline}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: riskStyles.color }}>
                {riskResult.explanation}
              </p>
            </div>

            {/* Rule of 15 Emergency Card (Only when Glucose < 70) */}
            {riskResult.isEmergencyHypo && (
              <div className="p-4 rounded-2xl bg-[#FDE8E9] border-2 border-[#C84B52] space-y-2 animate-bounce-subtle">
                <div className="flex items-center space-x-2 text-[#C84B52]">
                  <AlertOctagon className="w-5 h-5 shrink-0" />
                  <strong className="text-xs font-black uppercase tracking-wider">
                    CLINICAL RULE OF 15 EMERGENCY PROTOCOL
                  </strong>
                </div>
                <p className="text-xs text-[#C84B52] leading-relaxed">
                  1. Immediately consume <strong>15 grams of fast-acting carbohydrates</strong> (3 glucose tablets, 1/2 cup fruit juice, or 3 tsp sugar in water).<br />
                  2. Rest and re-test blood glucose in <strong>15 minutes</strong>.<br />
                  3. If still below 70 mg/dL, repeat treatment.
                </p>
              </div>
            )}

            {/* Vertical Explanation Timeline ("Why?") */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#075B57]" />
                <span>Explainable Factor Breakdown ("Why?"):</span>
              </span>

              <div className="space-y-2">
                {riskResult.factors.map((factor, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-xl bg-[#F7F8F5] border border-black/5 flex items-start justify-between text-xs gap-3"
                  >
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-[#063F3D]">
                        {factor.factor}
                      </div>
                      <p className="text-[11px] text-[#66716F]">
                        {factor.explanation}
                      </p>
                    </div>
                    <span className="text-[10px] font-bold text-[#075B57] bg-[#DFF4E8] px-2 py-0.5 rounded-md shrink-0">
                      {Math.round(factor.weight * 100)}% Weight
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Bolus Card */}
            <div className="p-4 rounded-xl bg-[#F3F1EA] border border-black/5 space-y-1.5">
              <div className="flex items-center justify-between text-xs font-bold text-[#063F3D]">
                <span>Reference Bolus Calculation</span>
                <span className="text-[#075B57]">ICR 1:{settings.icrRatio}</span>
              </div>
              <div className="text-xl font-extrabold text-[#063F3D] font-display">
                ~{calculatedBolus.totalSuggestedDose} Units
              </div>
              <p className="text-[10px] text-[#66716F]">
                Reference estimate only. Confirm with your physician-prescribed diabetes care plan.
              </p>
            </div>

            {/* Actions */}
            <button
              onClick={handleSaveToHistory}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-sm flex items-center justify-center space-x-2 ${
                savedSuccess
                  ? 'bg-[#DFF4E8] text-[#075B57]'
                  : 'bg-[#075B57] hover:bg-[#063F3D] text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Saved Assessment to Journal</span>
                </>
              ) : (
                <span>Save Assessment to Journal</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
