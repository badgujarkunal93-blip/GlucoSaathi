import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Syringe, 
  Utensils, 
  Flame, 
  Clock, 
  Play, 
  Sparkles, 
  User, 
  UploadCloud, 
  AlertTriangle,
  Sliders,
  CheckCircle2,
  Info
} from 'lucide-react';

export default function StagePatientInput() {
  const { 
    patientInputs, 
    updatePatientInput, 
    userProfile, 
    updateUserProfile,
    startAnalysis,
    setIsCSVImportOpen,
    setIsUserProfileOpen,
    applyPresetScenario,
    dataMode,
    setDataMode
  } = useApp();

  const [formInputs, setFormInputs] = useState(patientInputs);
  const [validationError, setValidationError] = useState(null);

  const handleInputChange = (field, value) => {
    setFormInputs(prev => ({
      ...prev,
      [field]: value
    }));
    updatePatientInput(field, value);
    setValidationError(null);
  };

  const handleApplyPreset = (presetKey) => {
    if (presetKey === 'SAFE_BASELINE') {
      const p = {
        glucose: 110,
        glucoseTrend: 'stable',
        insulinOnBoard: 0.6,
        recentBolus: 4.0,
        carbsConsumed: 60,
        mealDescription: '2 rotis, dal tadka & steamed rice',
        timeSinceMealHours: 1.5,
        activityLevel: 'Light'
      };
      setFormInputs(p);
      Object.entries(p).forEach(([k, v]) => updatePatientInput(k, v));
    } else if (presetKey === 'ACTIVE_IOB') {
      const p = {
        glucose: 94,
        glucoseTrend: 'falling',
        insulinOnBoard: 2.4,
        recentBolus: 6.0,
        carbsConsumed: 30,
        mealDescription: '1 cup curd & vegetable salad',
        timeSinceMealHours: 3.0,
        activityLevel: 'Moderate'
      };
      setFormInputs(p);
      Object.entries(p).forEach(([k, v]) => updatePatientInput(k, v));
    } else if (presetKey === 'HYPO_ALERT') {
      const p = {
        glucose: 65,
        glucoseTrend: 'falling_rapidly',
        insulinOnBoard: 3.5,
        recentBolus: 7.0,
        carbsConsumed: 15,
        mealDescription: '1 cup black tea (fasting state)',
        timeSinceMealHours: 4.0,
        activityLevel: 'Intense'
      };
      setFormInputs(p);
      Object.entries(p).forEach(([k, v]) => updatePatientInput(k, v));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Clinical Range Validations
    if (!formInputs.glucose || isNaN(formInputs.glucose) || formInputs.glucose < 30 || formInputs.glucose > 450) {
      setValidationError('Please enter a clinically plausible blood glucose reading (30 – 450 mg/dL).');
      return;
    }

    if (formInputs.insulinOnBoard < 0 || formInputs.insulinOnBoard > 25) {
      setValidationError('Insulin on Board (IOB) must be between 0.0 and 25.0 Units.');
      return;
    }

    if (formInputs.carbsConsumed < 0 || formInputs.carbsConsumed > 300) {
      setValidationError('Carbohydrate intake must be between 0 and 300 grams.');
      return;
    }

    setValidationError(null);
    startAnalysis(formInputs);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 animate-fade-in pb-12">
      
      {/* Hero / Pipeline Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3 pt-2">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#DFF4E8] text-[#075B57] text-xs font-black uppercase tracking-widest border border-[#B8E8D2]">
          <span className="w-2 h-2 rounded-full bg-[#1E9E67] animate-ping" />
          <span>STAGE 01 • CLINICAL PATIENT INPUT</span>
        </div>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#063F3D] font-display tracking-tight">
          Enter patient metrics to begin analysis.
        </h1>
        <p className="text-xs sm:text-sm text-[#66716F] leading-relaxed">
          Provide your current glucose reading, active insulin on board (IOB), Indian meal composition, and physical movement. Click <strong>Start Analysis</strong> to execute the full decision-support pipeline.
        </p>

        {/* Demo Presets Bar */}
        <div className="pt-2 flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-bold text-[#66716F]">Load Scenario Preset:</span>
          <button
            type="button"
            onClick={() => handleApplyPreset('SAFE_BASELINE')}
            className="px-3 py-1 rounded-lg bg-white border border-black/10 hover:border-[#075B57] text-xs font-bold text-[#075B57] transition-all shadow-xs"
          >
            Safe Baseline (110 mg/dL)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('ACTIVE_IOB')}
            className="px-3 py-1 rounded-lg bg-white border border-black/10 hover:border-[#8D4023] text-xs font-bold text-[#8D4023] transition-all shadow-xs"
          >
            Active IOB Caution (94 mg/dL)
          </button>
          <button
            type="button"
            onClick={() => handleApplyPreset('HYPO_ALERT')}
            className="px-3 py-1 rounded-lg bg-white border border-black/10 hover:border-[#C84B52] text-xs font-bold text-[#C84B52] transition-all shadow-xs"
          >
            Hypo Alert (65 mg/dL)
          </button>
          <button
            type="button"
            onClick={() => setIsCSVImportOpen(true)}
            className="px-3 py-1 rounded-lg bg-[#DFF4E8] text-xs font-bold text-[#075B57] hover:bg-[#B8E8D2] transition-all flex items-center space-x-1"
          >
            <UploadCloud className="w-3.5 h-3.5" />
            <span>Import CSV</span>
          </button>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* Row 1: Profile & Glucose */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Card 1: Patient Profile & Prescription Settings */}
          <div className="editorial-card p-6 bg-white space-y-4 border border-black/8 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center space-x-2">
                <User className="w-4 h-4 text-[#075B57]" />
                <h3 className="text-sm font-extrabold text-[#063F3D] uppercase tracking-wider">
                  Patient Prescription Profile
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setIsUserProfileOpen(true)}
                className="text-[11px] font-bold text-[#075B57] hover:underline"
              >
                Edit Settings
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-2.5 rounded-xl bg-[#F7F8F5]">
                <span className="text-[#66716F] block text-[10px] uppercase font-bold">Patient Name / Age</span>
                <span className="font-bold text-[#063F3D]">{userProfile.name} ({userProfile.age}y)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8F5]">
                <span className="text-[#66716F] block text-[10px] uppercase font-bold">Insulin-to-Carb (ICR)</span>
                <span className="font-bold text-[#075B57]">1 U : {userProfile.icrRatio}g</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8F5]">
                <span className="text-[#66716F] block text-[10px] uppercase font-bold">Correction Factor (ISF)</span>
                <span className="font-bold text-[#075B57]">1 U : {userProfile.correctionFactor} mg/dL</span>
              </div>
              <div className="p-2.5 rounded-xl bg-[#F7F8F5]">
                <span className="text-[#66716F] block text-[10px] uppercase font-bold">Target Range</span>
                <span className="font-bold text-[#063F3D]">{userProfile.targetMin}–{userProfile.targetMax} mg/dL</span>
              </div>
            </div>
            
            <p className="text-[10px] text-[#66716F] leading-tight">
              * Clinician-prescribed baseline parameters used for reference insulin sensitivity.
            </p>
          </div>

          {/* Card 2: Current Blood Glucose & Velocity Trend */}
          <div className="editorial-card p-6 bg-white space-y-4 border border-black/8 shadow-sm">
            <div className="flex items-center justify-between border-b border-black/5 pb-3">
              <div className="flex items-center space-x-2">
                <Activity className="w-4 h-4 text-[#075B57]" />
                <h3 className="text-sm font-extrabold text-[#063F3D] uppercase tracking-wider">
                  Current Glucose & Trend
                </h3>
              </div>
              <span className="text-xs font-bold text-[#075B57]">mg/dL</span>
            </div>

            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <input
                  type="number"
                  min="30"
                  max="450"
                  value={formInputs.glucose}
                  onChange={(e) => handleInputChange('glucose', Number(e.target.value))}
                  required
                  placeholder="e.g. 108"
                  className="flex-1 p-3 bg-[#F7F8F5] border border-black/10 rounded-xl text-2xl font-black text-[#063F3D] font-display focus:outline-none focus:border-[#075B57]"
                />
                <span className="text-xs text-[#66716F] font-bold">Latest Fingerstick / CGM</span>
              </div>

              {/* Trend Selection */}
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-[#66716F] uppercase block">Rate of Change (Velocity):</span>
                <div className="grid grid-cols-3 gap-1.5">
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
                      onClick={() => handleInputChange('glucoseTrend', tr.id)}
                      className={`py-1.5 px-2 rounded-lg text-xs font-bold truncate transition-all ${
                        formInputs.glucoseTrend === tr.id
                          ? 'bg-[#075B57] text-white shadow-xs'
                          : 'bg-[#F7F8F5] text-[#66716F] hover:bg-[#F3F1EA]'
                      }`}
                    >
                      {tr.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: Insulin, Meal & Movement */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 3: Insulin Dynamics */}
          <div className="editorial-card p-6 bg-white space-y-4 border border-black/8 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-black/5 pb-3">
              <Syringe className="w-4 h-4 text-[#075B57]" />
              <h3 className="text-sm font-extrabold text-[#063F3D] uppercase tracking-wider">
                Active Insulin (IOB)
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#063F3D] block">Insulin on Board (IOB):</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="20"
                    value={formInputs.insulinOnBoard}
                    onChange={(e) => handleInputChange('insulinOnBoard', Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl font-bold text-sm text-[#063F3D]"
                  />
                  <span className="font-bold text-[#66716F]">Units</span>
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#063F3D] block">Recent Meal Bolus:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    max="25"
                    value={formInputs.recentBolus || 4.5}
                    onChange={(e) => handleInputChange('recentBolus', Number(e.target.value))}
                    className="w-full p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl font-bold text-sm text-[#063F3D]"
                  />
                  <span className="font-bold text-[#66716F]">Units</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: Indian Meal Intake */}
          <div className="editorial-card p-6 bg-white space-y-4 border border-black/8 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-black/5 pb-3">
              <Utensils className="w-4 h-4 text-[#8D4023]" />
              <h3 className="text-sm font-extrabold text-[#063F3D] uppercase tracking-wider">
                Indian Meal Intake
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#063F3D] block">Meal Description:</label>
                <input
                  type="text"
                  value={formInputs.mealDescription}
                  onChange={(e) => handleInputChange('mealDescription', e.target.value)}
                  placeholder="e.g. 2 rotis, dal tadka, steamed rice"
                  className="w-full p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl text-xs font-medium text-[#063F3D]"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#063F3D] block">Carbohydrate Load (g):</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    min="0"
                    max="250"
                    value={formInputs.carbsConsumed}
                    onChange={(e) => {
                      const c = Number(e.target.value);
                      handleInputChange('carbsConsumed', c);
                      handleInputChange('carbsCovered', c);
                    }}
                    className="w-full p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl font-bold text-sm text-[#8D4023]"
                  />
                  <span className="font-bold text-[#66716F]">g Carbs</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 5: Movement & Activity */}
          <div className="editorial-card p-6 bg-white space-y-4 border border-black/8 shadow-sm">
            <div className="flex items-center space-x-2 border-b border-black/5 pb-3">
              <Flame className="w-4 h-4 text-[#075B57]" />
              <h3 className="text-sm font-extrabold text-[#063F3D] uppercase tracking-wider">
                Physical Movement
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="space-y-1">
                <label className="font-bold text-[#063F3D] block">Activity Level:</label>
                <div className="grid grid-cols-2 gap-1.5">
                  {['Resting', 'Light', 'Moderate', 'Intense'].map((act) => (
                    <button
                      key={act}
                      type="button"
                      onClick={() => handleInputChange('activityLevel', act)}
                      className={`py-2 rounded-xl text-xs font-bold transition-all ${
                        formInputs.activityLevel === act
                          ? 'bg-[#075B57] text-white shadow-xs'
                          : 'bg-[#F7F8F5] text-[#66716F] hover:bg-[#F3F1EA]'
                      }`}
                    >
                      {act}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[#063F3D] block">Time Since Meal:</label>
                <div className="flex items-center space-x-2">
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="8"
                    value={formInputs.timeSinceMealHours}
                    onChange={(e) => handleInputChange('timeSinceMealHours', Number(e.target.value))}
                    className="w-full p-2 bg-[#F7F8F5] border border-black/10 rounded-xl font-bold text-xs"
                  />
                  <span className="text-[#66716F] font-bold">hours</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Validation Error Notice if any */}
        {validationError && (
          <div className="p-4 rounded-xl bg-[#FDE8E9] border border-[#FFB4A8] text-xs text-[#C84B52] flex items-center space-x-2 animate-fade-in">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <span className="font-bold">{validationError}</span>
          </div>
        )}

        {/* Big Start Analysis Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-black/8">
          <div className="text-xs text-[#66716F]">
            * All calculations, trajectory predictions, and clinical summaries are computed dynamically from your submitted inputs.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#075B57] hover:bg-[#063F3D] text-white text-sm font-black uppercase tracking-wider shadow-lg flex items-center justify-center space-x-2.5 transition-all hover:scale-102 cursor-pointer"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>START ANALYSIS PIPELINE</span>
          </button>
        </div>

      </form>
    </div>
  );
}
