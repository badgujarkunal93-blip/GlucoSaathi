import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ACTIVITY_FACTORS, DEMO_SCENARIOS, evaluateHypoRisk, calculateInsulinDose } from '../utils/riskEngine';
import { 
  Activity, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  ArrowRight, 
  Sliders, 
  RefreshCw, 
  CheckCircle2, 
  HeartPulse
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function RiskCheck() {
  const { 
    riskInputs, 
    setRiskInputs, 
    riskResult, 
    settings, 
    saveRiskCheck, 
    navigateTo,
    applyScenario 
  } = useApp();

  const [isCalculating, setIsCalculating] = useState(false);
  const [activeScenarioKey, setActiveScenarioKey] = useState('low');
  const [saveSuccess, setSaveSuccess] = useState(false);

  const timePresets = [
    { label: '30m', value: 0.5 },
    { label: '1h', value: 1 },
    { label: '2h', value: 2 },
    { label: '3h', value: 3 },
    { label: '4h+', value: 4.5 }
  ];

  const activityOptions = ['None', 'Light', 'Moderate', 'Intense'];

  const handleInputChange = (field, value) => {
    setRiskInputs(prev => ({
      ...prev,
      [field]: value
    }));
    setSaveSuccess(false);
  };

  const handleScenarioSelect = (scenarioKey) => {
    setActiveScenarioKey(scenarioKey);
    applyScenario(scenarioKey);
    setSaveSuccess(false);
  };

  const handleCheckRisk = () => {
    setIsCalculating(true);
    setSaveSuccess(false);

    setTimeout(() => {
      setIsCalculating(false);
    }, 400);
  };

  const handleSaveAndReturn = () => {
    saveRiskCheck();
    setSaveSuccess(true);
    confetti({
      particleCount: 50,
      spread: 70,
      origin: { y: 0.7 }
    });

    setTimeout(() => {
      navigateTo('dashboard');
    }, 750);
  };

  const calculatedDose = calculateInsulinDose(riskInputs.carbsConsumed, settings.icrRatio);

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-8">
      {/* Header */}
      <div>
        <div className="flex items-center space-x-2">
          <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-[6px] bg-[#D9F5F6] text-[#08444B]">
            🩺 CLINICAL RISK ASSESSMENT
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172640] tracking-tight font-display pt-2">
          How are you feeling right now?
        </h2>
        <p className="text-sm lg:text-base text-[#5A6E85] font-normal mt-1">
          Let's look at your current glucose, activity and recent Indian meal.
        </p>
      </div>

      {/* 2-Column Risk Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-7 items-start">
        {/* LEFT COLUMN: Structured Form Cards with 12px Radius (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Card 1: Glucose (Sky Blue) */}
          <div className="p-5 sm:p-6 rounded-[12px] bg-[#DCEBFF] text-[#0F315E] border border-[#B8D7FF] paper-elevation-base space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#25589A] flex items-center space-x-1.5">
                <span>🩸</span>
                <span>CURRENT BLOOD GLUCOSE</span>
              </span>
              <span className="text-xs font-bold text-[#25589A]">
                Target: {settings.targetMin}–{settings.targetMax} mg/dL
              </span>
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative flex-1">
                <input
                  type="number"
                  value={riskInputs.glucose}
                  onChange={(e) => handleInputChange('glucose', Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-[10px] bg-white text-[#0F315E] border border-[#B8D7FF] text-2xl font-black focus:outline-none focus:ring-1 focus:ring-[#0F315E] font-display"
                  placeholder="108"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#25589A]">
                  mg/dL
                </span>
              </div>

              <div className="flex space-x-1.5">
                <button
                  onClick={() => handleInputChange('glucose', Math.max(40, Number(riskInputs.glucose) - 10))}
                  className="px-3 py-2.5 rounded-[10px] bg-white text-[#0F315E] font-black text-xs border border-[#B8D7FF] hover:bg-[#C9E0FF] cursor-pointer"
                >
                  -10
                </button>
                <button
                  onClick={() => handleInputChange('glucose', Math.min(400, Number(riskInputs.glucose) + 10))}
                  className="px-3 py-2.5 rounded-[10px] bg-white text-[#0F315E] font-black text-xs border border-[#B8D7FF] hover:bg-[#C9E0FF] cursor-pointer"
                >
                  +10
                </button>
              </div>
            </div>
          </div>

          {/* Card 2: Carbs Consumed (Mint) */}
          <div className="p-5 sm:p-6 rounded-[12px] bg-[#D8F3E7] text-[#093B22] border border-[#B8E8D2] paper-elevation-base space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#166442] flex items-center space-x-1.5">
                <span>🍽️</span>
                <span>CARBS CONSUMED</span>
              </span>
              <span className="text-[10px] font-black px-2 py-0.5 rounded-[6px] bg-[#093B22] text-[#D8F3E7]">
                From latest meal
              </span>
            </div>

            <div className="relative">
              <input
                type="number"
                value={riskInputs.carbsConsumed}
                onChange={(e) => handleInputChange('carbsConsumed', Number(e.target.value))}
                className="w-full px-4 py-2.5 rounded-[10px] bg-white text-[#093B22] border border-[#B8E8D2] text-2xl font-black focus:outline-none focus:ring-1 focus:ring-[#093B22] font-display"
                placeholder="68"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-black text-[#166442]">
                grams
              </span>
            </div>
          </div>

          {/* Card 3: Activity Level (Lavender) */}
          <div className="p-5 sm:p-6 rounded-[12px] bg-[#E9E3FF] text-[#2B1D61] border border-[#CEBFFC] paper-elevation-base space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black uppercase tracking-wider text-[#533BA1] flex items-center space-x-1.5">
                <span>🏃‍♂️</span>
                <span>PHYSICAL ACTIVITY</span>
              </span>
              <span className="text-xs font-bold text-[#533BA1]">
                {ACTIVITY_FACTORS[riskInputs.activityLevel]?.impact}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2">
              {activityOptions.map((level) => (
                <button
                  key={level}
                  onClick={() => handleInputChange('activityLevel', level)}
                  className={`py-2 rounded-[10px] text-xs font-black transition-all cursor-pointer ${
                    riskInputs.activityLevel === level
                      ? 'bg-[#2B1D61] text-[#E9E3FF] shadow-xs'
                      : 'bg-white text-[#2B1D61] border border-[#CEBFFC] hover:bg-[#DDD1FC]'
                  }`}
                >
                  {level}
                </button>
              ))}
            </div>
          </div>

          {/* Card 4 & 5: Time Since Meal (Peach) & Insulin on Board (Sun Yellow) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Time */}
            <div className="p-5 rounded-[12px] bg-[#FFE0D1] text-[#552310] border border-[#FFC4AB] paper-elevation-base space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#8D4023] block">
                ⏳ TIME SINCE MEAL
              </span>
              <div className="flex space-x-1">
                {timePresets.map((t) => (
                  <button
                    key={t.label}
                    onClick={() => handleInputChange('timeSinceMealHours', t.value)}
                    className={`flex-1 py-1.5 rounded-[8px] text-xs font-black transition-all cursor-pointer ${
                      riskInputs.timeSinceMealHours === t.value
                        ? 'bg-[#552310] text-[#FFE0D1]'
                        : 'bg-white text-[#552310] hover:bg-[#FFD9C7]'
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            {/* IOB */}
            <div className="p-5 rounded-[12px] bg-[#FFF1B8] text-[#4B3903] border border-[#FFE280] paper-elevation-base space-y-2.5">
              <span className="text-xs font-black uppercase tracking-wider text-[#785E09] block">
                💉 ACTIVE INSULIN (IOB)
              </span>
              <div className="relative">
                <input
                  type="number"
                  step="0.1"
                  value={riskInputs.insulinOnBoard}
                  onChange={(e) => handleInputChange('insulinOnBoard', Number(e.target.value))}
                  className="w-full px-3 py-1.5 rounded-[8px] bg-white text-[#4B3903] border border-[#FFE280] text-base font-black focus:outline-none"
                  placeholder="0.8"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-black text-[#785E09]">
                  Units
                </span>
              </div>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            onClick={handleCheckRisk}
            disabled={isCalculating}
            className="w-full flex items-center justify-center space-x-2 py-3 px-5 rounded-[10px] bg-[#00AFC1] hover:bg-[#0098A8] text-white font-black text-sm shadow-xs transition-all cursor-pointer"
          >
            {isCalculating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>Evaluating risk factors...</span>
              </>
            ) : (
              <>
                <HeartPulse className="w-5 h-5 stroke-[2.5]" />
                <span>Check hypoglycemia risk →</span>
              </>
            )}
          </button>

          {/* Prototype Demo Preset Controller (Light Box) */}
          <div className="p-4 sm:p-5 rounded-[12px] bg-white border border-[#E2E8DF] paper-elevation-base space-y-2.5">
            <div className="flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-[#00AFC1]" />
              <span className="text-xs font-black text-[#172640] uppercase tracking-wider">
                PROTOTYPE DEMO CONTROL
              </span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {Object.entries(DEMO_SCENARIOS).map(([key, item]) => {
                const isSelected = activeScenarioKey === key;
                return (
                  <button
                    key={key}
                    onClick={() => handleScenarioSelect(key)}
                    className={`py-2 px-3 rounded-[10px] text-left font-bold border transition-all cursor-pointer ${
                      isSelected
                        ? key === 'low'
                          ? 'bg-[#D8F3E7] text-[#093B22] border-[#093B22] shadow-xs'
                          : key === 'moderate'
                          ? 'bg-[#FFF1B8] text-[#4B3903] border-[#4B3903] shadow-xs'
                          : 'bg-[#FFD9D4] text-[#5A150D] border-[#5A150D] shadow-xs'
                        : 'bg-[#FAFBF8] text-[#172640] border-[#E2E8DF] hover:bg-[#F2F5F2]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-black truncate">{item.name}</span>
                      <span className={`w-2 h-2 rounded-full ${
                        key === 'low' ? 'bg-emerald-600' : key === 'moderate' ? 'bg-amber-600' : 'bg-red-600'
                      }`} />
                    </div>
                    <span className="text-[10px] text-[#5A6E85] block mt-0.5">
                      {item.glucose} mg/dL • {item.insulinOnBoard}U
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: Risk Result & Careful Insulin Dose (5 cols) */}
        <div className="lg:col-span-5 space-y-5 sticky top-6">
          {/* Main Risk Result Paper Card */}
          <div className={`p-6 sm:p-7 rounded-[14px] border paper-elevation-hero transition-all duration-150 ${
            riskResult.riskLevel === 'LOW'
              ? 'bg-[#D8F3E7] text-[#093B22] border-[#B8E8D2]'
              : riskResult.riskLevel === 'MODERATE'
              ? 'bg-[#FFF1B8] text-[#4B3903] border-[#FFE280]'
              : 'bg-[#FFD9D4] text-[#5A150D] border-[#FFB4A8]'
          }`}>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className={`px-2.5 py-1 rounded-[6px] text-xs font-black uppercase tracking-wider flex items-center space-x-1.5 ${
                  riskResult.riskLevel === 'LOW'
                    ? 'bg-[#093B22] text-[#D8F3E7]'
                    : riskResult.riskLevel === 'MODERATE'
                    ? 'bg-[#4B3903] text-[#FFF1B8]'
                    : 'bg-[#5A150D] text-[#FFD9D4]'
                }`}>
                  {riskResult.riskLevel === 'LOW' && <ShieldCheck className="w-3.5 h-3.5" />}
                  {riskResult.riskLevel === 'MODERATE' && <AlertTriangle className="w-3.5 h-3.5" />}
                  {riskResult.riskLevel === 'HIGH' && <AlertOctagon className="w-3.5 h-3.5" />}
                  <span>{riskResult.riskLevel} RISK ASSESSMENT</span>
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-black tracking-tight font-display">
                  {riskResult.headline}
                </h3>
                <p className="text-xs sm:text-sm font-semibold leading-relaxed mt-1.5 opacity-90">
                  {riskResult.explanation}
                </p>
              </div>

              {/* Contributing Factors Mini Blocks */}
              <div className="pt-3.5 border-t border-black/10 space-y-2">
                <span className="text-[10px] font-black uppercase tracking-wider opacity-80 block">
                  CONTRIBUTING TELEMETRY FACTORS:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 rounded-[8px] bg-white/80 border border-black/5 paper-elevation-base">
                    <p className="text-[10px] font-black uppercase opacity-75">Glucose</p>
                    <p className="text-sm font-black mt-0.5">{riskInputs.glucose} mg/dL</p>
                  </div>
                  <div className="p-2.5 rounded-[8px] bg-white/80 border border-black/5 paper-elevation-base">
                    <p className="text-[10px] font-black uppercase opacity-75">Active IOB</p>
                    <p className="text-sm font-black mt-0.5">{riskInputs.insulinOnBoard} U</p>
                  </div>
                  <div className="p-2.5 rounded-[8px] bg-white/80 border border-black/5 paper-elevation-base">
                    <p className="text-[10px] font-black uppercase opacity-75">Time Since Meal</p>
                    <p className="text-sm font-black mt-0.5">{riskInputs.timeSinceMealHours}h</p>
                  </div>
                  <div className="p-2.5 rounded-[8px] bg-white/80 border border-black/5 paper-elevation-base">
                    <p className="text-[10px] font-black uppercase opacity-75">Activity</p>
                    <p className="text-sm font-black mt-0.5">{riskInputs.activityLevel}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Insulin Calculation Card with Visual Equation */}
          <div className="p-5 sm:p-6 rounded-[14px] bg-[#DCEBFF] text-[#0F315E] border border-[#B8D7FF] paper-elevation-hero space-y-3.5">
            <div className="flex items-center justify-between pb-3 border-b border-[#B8D7FF]">
              <div>
                <span className="text-xs font-black uppercase tracking-wider text-[#25589A] block">
                  INSULIN CALCULATION
                </span>
                <p className="text-xs font-bold text-[#0F315E]">Suggested Bolus Dose</p>
              </div>

              <div className="flex items-baseline space-x-1">
                <span className="text-4xl font-black text-[#0F315E] font-display">
                  {calculatedDose}
                </span>
                <span className="text-lg font-black text-[#25589A]">U</span>
              </div>
            </div>

            {/* Visual Equation */}
            <div className="p-3 rounded-[10px] bg-white/90 border border-[#B8D7FF] paper-elevation-base text-center font-mono text-xs font-bold text-[#0F315E] space-y-1">
              <div className="flex items-center justify-center space-x-2 text-sm">
                <span>{riskInputs.carbsConsumed}g carbs</span>
                <span>÷</span>
                <span>{settings.icrRatio}g per unit</span>
                <span>=</span>
                <span className="text-base font-black font-display text-[#00AFC1]">{calculatedDose} U</span>
              </div>
              <p className="text-[10px] font-sans font-medium text-[#25589A]">
                Calculated using your prescribed ratio (1 Unit : {settings.icrRatio}g)
              </p>
            </div>

            <p className="text-[11px] text-[#25589A] font-semibold italic text-center">
              Follow your healthcare professional's prescribed plan.
            </p>
          </div>

          {/* Success note */}
          {saveSuccess && (
            <div className="p-3 rounded-[10px] bg-[#D8F3E7] text-[#093B22] border border-[#B8E8D2] text-xs font-bold flex items-center space-x-2 animate-fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#093B22] shrink-0" />
              <span>Risk check recorded! Returning to dashboard...</span>
            </div>
          )}

          {/* Action Button */}
          <button
            onClick={handleSaveAndReturn}
            className="w-full flex items-center justify-center space-x-2 py-3 px-5 rounded-[10px] bg-[#093B22] hover:bg-[#062917] text-[#D8F3E7] font-black text-sm shadow-xs transition-all cursor-pointer group"
          >
            <span>Save & View Dashboard</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>
      </div>
    </div>
  );
}
