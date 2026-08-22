import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import CGMTrajectory from './CGMTrajectory';
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
  HelpCircle,
  Sliders,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RiskCheck({ onNavigate }) {
  const { 
    patientState, 
    patientInputs, 
    updatePatientInput, 
    applyPresetScenario, 
    logRiskCheckToHistory,
    settings 
  } = useApp();

  const [savedSuccess, setSavedSuccess] = useState(false);
  const [showClinicianMath, setShowClinicianMath] = useState(false);

  const handleSaveToHistory = () => {
    logRiskCheckToHistory();
    setSavedSuccess(true);
    confetti({ particleCount: 35, spread: 50, origin: { y: 0.6 } });
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  const getRiskStyles = (level) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          color: '#C84B52',
          bgColor: '#FDE8E9',
          borderColor: '#FFB4A8',
          label: `${patientState.riskScore}% HIGH RISK`
        };
      case 'MODERATE':
        return {
          color: '#8D4023',
          bgColor: '#FEF7E6',
          borderColor: '#FFE280',
          label: `${patientState.riskScore}% MODERATE RISK`
        };
      default:
        return {
          color: '#075B57',
          bgColor: '#DFF4E8',
          borderColor: '#B8E8D2',
          label: `${patientState.riskScore}% LOW RISK`
        };
    }
  };

  const riskStyles = getRiskStyles(patientState.riskClass);
  const isEmergency = patientState.glucose < 70 || patientState.isEmergencyHypo;

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-12 pt-2">
      {/* 1. Rule of 15 Emergency Protocol Banner (When BG < 70) */}
      {isEmergency && (
        <div className="p-4 sm:p-5 rounded-2xl bg-[#FDE8E9] border-2 border-[#C84B52] shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 animate-bounce-subtle">
          <div className="flex items-start space-x-3 text-[#C84B52]">
            <AlertOctagon className="w-6 h-6 shrink-0 mt-0.5" />
            <div className="space-y-1">
              <h4 className="text-sm font-black uppercase tracking-wider">
                CLINICAL RULE OF 15 PROTOCOL ARMED (Glucose: {patientState.glucose} mg/dL)
              </h4>
              <p className="text-xs text-[#822428] leading-relaxed">
                1. Consume <strong>15 grams of fast-acting glucose</strong> (fruit juice, 3 glucose tabs, or sugar in water).<br />
                2. Rest for <strong>15 minutes</strong> and recheck blood sugar.<br />
                3. Repeat until glucose returns above 70 mg/dL.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleSaveToHistory()}
            className="px-4 py-2 rounded-xl bg-[#C84B52] hover:bg-[#A8373E] text-white text-xs font-extrabold uppercase tracking-wider shrink-0 transition-colors shadow-xs"
          >
            Log Emergency Event
          </button>
        </div>
      )}

      {/* 2. Top Header & Scenario Presets */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-black/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
              EXPLAINABLE CLINICAL REASONING
            </span>
            <span className="text-xs text-[#66716F]">
              • Calibrated ML + Safety Rules
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-editorial tracking-tight pt-1">
            Hypoglycemia Risk Prediction & Reasoning
          </h2>
          <p className="text-sm text-[#66716F]">
            Observe how continuous glucose momentum, active insulin on board, and physical exercise interact to alter near-term risk.
          </p>
        </div>

        {/* Preset Evaluator Scenarios */}
        <div className="flex flex-wrap items-center gap-1.5 self-start sm:self-auto">
          <span className="text-[11px] font-bold text-[#66716F] mr-1">Presets:</span>
          <button
            onClick={() => applyPresetScenario('SAFE_LOW')}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-[#DFF4E8] text-[#075B57] hover:opacity-85 transition-opacity"
          >
            Safe Baseline
          </button>
          <button
            onClick={() => applyPresetScenario('MODERATE_CAUTION')}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FEF7E6] text-[#8D4023] hover:opacity-85 transition-opacity"
          >
            Active IOB
          </button>
          <button
            onClick={() => applyPresetScenario('HIGH_RISK')}
            className="px-3 py-1 rounded-lg text-xs font-bold bg-[#FDE8E9] text-[#C84B52] hover:opacity-85 transition-opacity"
          >
            Hypo Alert
          </button>
        </div>
      </div>

      {/* 3. Hero Continuous CGM Trajectory Chart */}
      <CGMTrajectory 
        currentGlucose={patientState.glucose}
        trend={patientState.glucoseTrend}
        iob={patientState.insulinOnBoard}
        recentCarbs={patientState.carbsConsumed}
        activityLevel={patientState.activityLevel}
        targetMin={settings.targetMin}
        targetMax={settings.targetMax}
        forecastGlucose={patientState.forecast30mGlucose}
        hypoProbability={patientState.modelProbability}
      />

      {/* 4. Main Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT: Interactive Parameter Sliders (6 cols) */}
        <div className="lg:col-span-6 space-y-6">
          <div className="editorial-card p-6 sm:p-7 space-y-6">
            <h3 className="text-base font-extrabold text-[#063F3D] font-display flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#075B57]" />
              <span>Live Patient Telemetry Sliders</span>
            </h3>

            {/* Slider 1: Blood Glucose */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold uppercase tracking-wider text-[#66716F]">
                  Current Blood Glucose:
                </label>
                <span className="text-xl font-black text-[#063F3D] font-display">
                  {patientState.glucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="260"
                step="1"
                value={patientState.glucose}
                onChange={(e) => updatePatientInput('glucose', Number(e.target.value))}
                className="w-full accent-[#075B57] h-2 bg-[#F3F1EA] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#66716F] font-bold">
                <span className="text-[#C84B52]">40 (Severe Hypo)</span>
                <span className="text-[#1E9E67]">70–140 (Target Range)</span>
                <span className="text-[#8D4023]">260 (High)</span>
              </div>
            </div>

            {/* Slider 2: Active Insulin On Board (IOB) */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold uppercase tracking-wider text-[#66716F]">
                  Active Insulin on Board (IOB):
                </label>
                <span className="text-xl font-black text-[#063F3D] font-display">
                  {patientState.insulinOnBoard} <span className="text-xs font-normal text-[#66716F]">Units</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="6"
                step="0.1"
                value={patientState.insulinOnBoard}
                onChange={(e) => updatePatientInput('insulinOnBoard', Number(e.target.value))}
                className="w-full accent-[#075B57] h-2 bg-[#F3F1EA] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#66716F] font-bold">
                <span>0 U (None)</span>
                <span>2.0 U (Moderate)</span>
                <span>6.0 U (Heavy Stacking)</span>
              </div>
            </div>

            {/* Slider 3: Carbs Consumed */}
            <div className="space-y-2">
              <div className="flex justify-between items-baseline">
                <label className="text-xs font-bold uppercase tracking-wider text-[#66716F]">
                  Carbohydrates Consumed:
                </label>
                <span className="text-xl font-black text-[#063F3D] font-display">
                  {patientState.carbsConsumed} <span className="text-xs font-normal text-[#66716F]">g</span>
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="140"
                step="2"
                value={patientState.carbsConsumed}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  updatePatientInput('carbsConsumed', val);
                  updatePatientInput('carbsCovered', val);
                }}
                className="w-full accent-[#075B57] h-2 bg-[#F3F1EA] rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-[#66716F] font-bold">
                <span>0g (Skipped)</span>
                <span>68g (Standard Thali)</span>
                <span>140g (Large)</span>
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
                    onClick={() => updatePatientInput('activityLevel', act)}
                    className={`py-2 rounded-xl text-xs font-bold transition-all ${
                      patientState.activityLevel === act
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
          <div className="editorial-card p-6 sm:p-7 space-y-6">
            {/* Top Risk Status */}
            <div className="flex items-center justify-between border-b border-black/5 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-[#66716F] block">
                  EVALUATED HYPOGLYCEMIA RISK (NEXT 30 MIN)
                </span>
                <div className="text-3xl sm:text-4xl font-extrabold font-editorial mt-1" style={{ color: riskStyles.color }}>
                  {riskStyles.label}
                </div>
                <span className="text-xs font-bold text-[#66716F]">
                  P(Hypo): {(patientState.modelProbability * 100).toFixed(0)}% • Model Confidence: {patientState.modelConfidence}%
                </span>
              </div>

              <div className="w-16 h-16 rounded-full flex items-center justify-center font-display font-black text-lg border-4" style={{
                backgroundColor: riskStyles.bgColor,
                borderColor: riskStyles.color,
                color: riskStyles.color
              }}>
                {patientState.riskScore}%
              </div>
            </div>

            {/* Headline & Explanation */}
            <div className="p-4 rounded-2xl border space-y-1.5" style={{ backgroundColor: riskStyles.bgColor, borderColor: riskStyles.borderColor }}>
              <h4 className="text-sm font-extrabold" style={{ color: riskStyles.color }}>
                {patientState.headline}
              </h4>
              <p className="text-xs leading-relaxed" style={{ color: riskStyles.color }}>
                {patientState.explanation}
              </p>
            </div>

            {/* Vertical Explanation Timeline ("Why?") */}
            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
                <HelpCircle className="w-3.5 h-3.5 text-[#075B57]" />
                <span>Physiological Factor Attribution ("Why?"):</span>
              </span>

              <div className="space-y-2">
                {patientState.riskContributors?.map((factor, idx) => (
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

            {/* Carbohydrate Coverage Reference */}
            <div className="p-4 rounded-xl bg-[#F3F1EA] border border-black/5 space-y-2">
              <div className="flex items-center justify-between text-xs font-bold text-[#063F3D]">
                <span>Carbohydrate Coverage Reference</span>
                <span className="text-[#075B57]">Prescribed ICR 1:{settings.icrRatio}g</span>
              </div>
              <div className="text-2xl font-black text-[#063F3D] font-display">
                {patientState.carbsConsumed}g Estimated
              </div>
              <p className="text-[11px] text-[#66716F]">
                Demonstration reference calculation only. Never dose insulin without following your physician care plan.
              </p>
            </div>

            {/* Save to History Action */}
            <button
              onClick={handleSaveToHistory}
              className={`w-full py-3 rounded-xl text-xs font-bold uppercase tracking-wider transition-all shadow-xs flex items-center justify-center space-x-2 ${
                savedSuccess
                  ? 'bg-[#DFF4E8] text-[#075B57]'
                  : 'bg-[#075B57] hover:bg-[#063F3D] text-white'
              }`}
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  <span>✓ Saved Assessment to Health Journal</span>
                </>
              ) : (
                <span>Save Assessment to Health Journal</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
