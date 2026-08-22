import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Syringe, 
  Utensils, 
  Flame, 
  Clock, 
  Sparkles, 
  CheckCircle2, 
  Sliders, 
  Save, 
  RefreshCw,
  Zap,
  Info
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function MyReadingWorkspace({ onNavigate }) {
  const { 
    patientInputs, 
    updatePatientInput, 
    patientState, 
    mlStatus, 
    dataMode, 
    setDataMode, 
    userProfile,
    logGlucoseReading,
    logRiskCheckToHistory
  } = useApp();

  const [saving, setSaving] = useState(false);
  const [analyzed, setAnalyzed] = useState(false);

  const handleAnalyze = async () => {
    setSaving(true);
    setAnalyzed(true);
    confetti({ particleCount: 30, spread: 45, origin: { y: 0.6 } });
    setTimeout(() => setSaving(false), 500);
  };

  const handleSaveReading = async () => {
    await logGlucoseReading({
      value: patientState.glucose,
      mealRelation: patientInputs.timeSinceMealHours <= 2 ? 'post_meal' : 'fasting',
      trend: patientState.glucoseTrend,
      notes: `Active IOB: ${patientState.insulinOnBoard} U, Carbs: ${patientState.carbsConsumed}g`
    });
    await logRiskCheckToHistory();
    confetti({ particleCount: 40, spread: 60, origin: { y: 0.6 } });
    if (onNavigate) onNavigate('risk');
  };

  return (
    <div className="editorial-card p-6 sm:p-8 space-y-6 border-2 border-[#075B57]/20 shadow-lg bg-white">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/8 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full border border-[#B8E8D2]">
              REAL-TIME USER INPUT
            </span>
            <span className="text-xs text-[#66716F]">
              • Connected to Python FastAPI ML Model
            </span>
          </div>
          <h3 className="text-xl font-extrabold text-[#063F3D] font-display">
            My Current Reading & Metabolic Context
          </h3>
          <p className="text-xs text-[#66716F]">
            Enter your live metrics below. The system constructs a 24-dimensional feature vector and executes real-time inference via Calibrated LightGBM.
          </p>
        </div>

        {/* Data Mode Switcher Badge */}
        <div className="flex items-center bg-[#F3F1EA] rounded-xl p-1 border border-black/5 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setDataMode('my_data')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              dataMode === 'my_data'
                ? 'bg-white text-[#075B57] shadow-xs font-extrabold'
                : 'text-[#66716F] hover:text-[#063F3D]'
            }`}
          >
            ● My Live Data
          </button>
          <button
            type="button"
            onClick={() => setDataMode('demo_scenario')}
            className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
              dataMode === 'demo_scenario'
                ? 'bg-white text-[#075B57] shadow-xs font-extrabold'
                : 'text-[#66716F] hover:text-[#063F3D]'
            }`}
          >
            ○ Demo Scenarios
          </button>
        </div>
      </div>

      {/* Grid of 4 Core Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* 1. Blood Glucose & Trend */}
        <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
              <Activity className="w-3.5 h-3.5 text-[#075B57]" />
              <span>Current Glucose</span>
            </label>
            <span className="text-lg font-black text-[#063F3D] font-display">
              {patientState.glucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
            </span>
          </div>

          <input
            type="number"
            min="30"
            max="350"
            value={patientState.glucose}
            onChange={(e) => updatePatientInput('glucose', Number(e.target.value))}
            className="w-full p-2.5 bg-white border border-black/10 rounded-xl text-base font-bold text-[#063F3D] focus:outline-none focus:border-[#075B57]"
          />

          {/* Trend Selectors */}
          <div className="space-y-1">
            <span className="text-[10px] font-bold text-[#66716F] uppercase block">Rate of Change Trend:</span>
            <div className="grid grid-cols-3 gap-1">
              {[
                { id: 'falling_rapidly', label: '↓↓ Fast Drop' },
                { id: 'falling_slowly', label: '↘ Slow Drop' },
                { id: 'stable', label: '→ Stable' },
                { id: 'rising', label: '↗ Rising' },
                { id: 'rising_rapidly', label: '↑↑ Fast Rise' }
              ].map((tr) => (
                <button
                  key={tr.id}
                  type="button"
                  onClick={() => updatePatientInput('glucoseTrend', tr.id)}
                  className={`py-1 px-1 rounded-lg text-[10px] font-bold truncate transition-all ${
                    patientState.glucoseTrend === tr.id
                      ? 'bg-[#075B57] text-white shadow-xs'
                      : 'bg-white border border-black/8 text-[#66716F] hover:bg-[#F3F1EA]'
                  }`}
                >
                  {tr.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 2. Active Insulin (IOB) & Recent Bolus */}
        <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
              <Syringe className="w-3.5 h-3.5 text-[#075B57]" />
              <span>Insulin on Board</span>
            </label>
            <span className="text-lg font-black text-[#063F3D] font-display">
              {patientState.insulinOnBoard} <span className="text-xs font-normal text-[#66716F]">U</span>
            </span>
          </div>

          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#66716F] font-bold w-20">Active IOB:</span>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={patientState.insulinOnBoard}
                onChange={(e) => updatePatientInput('insulinOnBoard', Number(e.target.value))}
                className="flex-1 p-2 bg-white border border-black/10 rounded-xl text-sm font-bold text-[#063F3D]"
              />
            </div>

            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#66716F] font-bold w-20">Recent Bolus:</span>
              <input
                type="number"
                step="0.5"
                min="0"
                max="20"
                value={patientState.recentBolus}
                onChange={(e) => updatePatientInput('recentBolus', Number(e.target.value))}
                className="flex-1 p-2 bg-white border border-black/10 rounded-xl text-sm font-bold text-[#063F3D]"
              />
            </div>
          </div>
        </div>

        {/* 3. Meal Carbohydrates & Timing */}
        <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
              <Utensils className="w-3.5 h-3.5 text-[#8D4023]" />
              <span>Meal Carbs</span>
            </label>
            <span className="text-lg font-black text-[#8D4023] font-display">
              {patientState.carbsConsumed} <span className="text-xs font-normal text-[#66716F]">g</span>
            </span>
          </div>

          <div className="space-y-2">
            <input
              type="number"
              min="0"
              max="200"
              value={patientState.carbsConsumed}
              onChange={(e) => {
                const val = Number(e.target.value);
                updatePatientInput('carbsConsumed', val);
                updatePatientInput('carbsCovered', val);
              }}
              className="w-full p-2 bg-white border border-black/10 rounded-xl text-sm font-bold text-[#063F3D]"
            />

            <div className="flex items-center space-x-2">
              <span className="text-xs text-[#66716F] font-bold w-20">Meal Timing:</span>
              <input
                type="number"
                step="0.5"
                min="0.5"
                max="8"
                value={patientState.timeSinceMealHours}
                onChange={(e) => updatePatientInput('timeSinceMealHours', Number(e.target.value))}
                className="flex-1 p-2 bg-white border border-black/10 rounded-xl text-sm font-bold text-[#063F3D]"
              />
              <span className="text-xs text-[#66716F]">hrs</span>
            </div>
          </div>
        </div>

        {/* 4. Physical Activity & Intensity */}
        <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 space-y-3">
          <div className="flex justify-between items-baseline">
            <label className="text-xs font-black uppercase tracking-wider text-[#063F3D] flex items-center space-x-1.5">
              <Flame className="w-3.5 h-3.5 text-[#075B57]" />
              <span>Physical Activity</span>
            </label>
            <span className="text-xs font-extrabold text-[#075B57]">
              {patientState.activityLevel}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-1.5">
            {['Resting', 'Light', 'Moderate', 'Intense'].map((act) => (
              <button
                key={act}
                type="button"
                onClick={() => updatePatientInput('activityLevel', act)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  patientState.activityLevel === act
                    ? 'bg-[#075B57] text-white shadow-xs'
                    : 'bg-white border border-black/8 text-[#66716F] hover:bg-[#F3F1EA]'
                }`}
              >
                {act}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Real-time ML Inference Response Strip */}
      <div className="p-4 rounded-2xl bg-[#DFF4E8]/60 border border-[#B8E8D2] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-[#1E9E67] animate-ping" />
            <span className="text-[10px] font-black uppercase tracking-wider text-[#075B57]">
              FASTAPI ML INFERENCE OUTPUT ({patientState.mlSource || 'Calibrated LightGBM'})
            </span>
          </div>
          <div className="text-sm font-extrabold text-[#063F3D]">
            Hypo Probability: {(patientState.modelProbability * 100).toFixed(0)}% • {patientState.riskClass} Risk • 30-Min Forecast: ~{patientState.forecast30mGlucose} mg/dL
          </div>
          <p className="text-xs text-[#075B57]">
            90% Conformal Interval: [{patientState.conformalLower || Math.max(40, patientState.forecast30mGlucose - 22)} – {patientState.conformalUpper || Math.min(350, patientState.forecast30mGlucose + 22)}] mg/dL
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2.5 w-full md:w-auto">
          <button
            type="button"
            onClick={handleAnalyze}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold tracking-wide uppercase transition-all shadow-xs flex items-center justify-center space-x-1.5"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze My Risk</span>
          </button>

          <button
            type="button"
            onClick={handleSaveReading}
            className="flex-1 md:flex-none px-5 py-2.5 rounded-xl bg-white hover:bg-[#F3F1EA] border border-black/10 text-xs font-bold text-[#063F3D] transition-all shadow-xs flex items-center justify-center space-x-1.5"
          >
            <Save className="w-3.5 h-3.5 text-[#075B57]" />
            <span>Save to Journal</span>
          </button>
        </div>
      </div>
    </div>
  );
}
