import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  X, 
  Settings as SettingsIcon, 
  Save, 
  Sparkles,
  HeartPulse,
  Info
} from 'lucide-react';

export default function SettingsModal() {
  const { isSettingsOpen, setIsSettingsOpen, settings, setSettings } = useApp();

  const [formData, setFormData] = useState({ ...settings });
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 550);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="relative w-full max-w-lg rounded-[14px] bg-white border border-[#E2E8DF] p-6 sm:p-7 shadow-xl space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5ECE3]">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-[10px] bg-[#D9F5F6] text-[#00AFC1] flex items-center justify-center font-bold border border-[#B2ECF0]">
              <HeartPulse className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <h3 className="text-base font-black text-[#172640] font-display">
                Profile & Insulin Settings
              </h3>
              <p className="text-xs text-[#5A6E85]">
                Personalized Indian T1D clinical parameters
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsSettingsOpen(false)}
            className="p-1.5 rounded-[8px] text-[#5A6E85] hover:text-[#172640] hover:bg-[#F2F5F2] transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="space-y-4">
          {/* User Name & Condition */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-black text-[#172640] uppercase tracking-wide">
                Patient Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full px-3.5 py-2 rounded-[8px] bg-[#FAFBF8] border border-[#DEE5DC] text-sm text-[#172640] font-bold focus:outline-none focus:border-[#00AFC1]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-[#172640] uppercase tracking-wide">
                Diagnosis Profile
              </label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => setFormData({ ...formData, condition: e.target.value })}
                className="w-full px-3.5 py-2 rounded-[8px] bg-[#FAFBF8] border border-[#DEE5DC] text-sm text-[#172640] font-bold focus:outline-none focus:border-[#00AFC1]"
              />
            </div>
          </div>

          {/* Insulin to Carb Ratio (ICR Mint Paper Card) */}
          <div className="p-4 rounded-[10px] bg-[#D8F3E7] text-[#093B22] border border-[#B8E8D2] space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-black text-[#093B22] uppercase tracking-wider flex items-center space-x-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>INSULIN-TO-CARB RATIO (ICR)</span>
              </label>
              <span className="text-xs font-black bg-[#093B22] text-[#D8F3E7] px-2 py-0.5 rounded-[4px]">
                1 Unit : {formData.icrRatio}g carbs
              </span>
            </div>
            <p className="text-xs text-[#166442] font-semibold">
              Grams of carbohydrates covered by 1 Unit of rapid-acting bolus insulin.
            </p>
            <div className="flex items-center space-x-3 pt-1">
              <input
                type="range"
                min="5"
                max="30"
                step="1"
                value={formData.icrRatio}
                onChange={(e) => setFormData({ ...formData, icrRatio: Number(e.target.value) })}
                className="flex-1 accent-[#093B22] cursor-pointer"
              />
              <div className="w-14 px-2 py-1 rounded-[6px] bg-white border border-[#B8E8D2] text-center font-black text-sm text-[#093B22] font-display">
                {formData.icrRatio}g
              </div>
            </div>
          </div>

          {/* Target Glucose Range */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-black text-[#172640] uppercase tracking-wide">
                Target Min (mg/dL)
              </label>
              <input
                type="number"
                value={formData.targetMin}
                onChange={(e) => setFormData({ ...formData, targetMin: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-[8px] bg-[#FAFBF8] border border-[#DEE5DC] text-sm text-[#172640] font-bold focus:outline-none focus:border-[#00AFC1]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-black text-[#172640] uppercase tracking-wide">
                Target Max (mg/dL)
              </label>
              <input
                type="number"
                value={formData.targetMax}
                onChange={(e) => setFormData({ ...formData, targetMax: Number(e.target.value) })}
                className="w-full px-3.5 py-2 rounded-[8px] bg-[#FAFBF8] border border-[#DEE5DC] text-sm text-[#172640] font-bold focus:outline-none focus:border-[#00AFC1]"
              />
            </div>
          </div>

          {/* Active Insulin Notes */}
          <div className="space-y-1">
            <label className="text-xs font-black text-[#172640] uppercase tracking-wide">
              Prescribed Insulin Regimen Notes
            </label>
            <input
              type="text"
              value={formData.activeInsulinType}
              onChange={(e) => setFormData({ ...formData, activeInsulinType: e.target.value })}
              className="w-full px-3.5 py-2 rounded-[8px] bg-[#FAFBF8] border border-[#DEE5DC] text-xs text-[#172640] focus:outline-none focus:border-[#00AFC1]"
            />
          </div>

          {/* Safety Notice Card */}
          <div className="p-3 rounded-[8px] bg-[#FFF1B8] text-[#4B3903] border border-[#FFE280] text-xs flex items-start space-x-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-[#4B3903]" />
            <p className="text-[11px] leading-relaxed font-semibold">
              <strong>Clinical safety notice:</strong> Calculations are educational heuristics for diabetes companion demonstration. Always follow your physician's prescribed regimen.
            </p>
          </div>

          {/* Footer Actions */}
          <div className="pt-3 border-t border-[#E5ECE3] flex space-x-3">
            <button
              type="button"
              onClick={() => setIsSettingsOpen(false)}
              className="flex-1 py-2.5 rounded-[10px] bg-[#F2F5F2] hover:bg-[#E8EDE8] text-[#172640] text-xs font-bold transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="flex-1 flex items-center justify-center space-x-2 py-2.5 rounded-[10px] bg-[#00AFC1] hover:bg-[#0098A8] text-white text-xs font-black shadow-xs transition-all cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>{savedSuccess ? 'Saved!' : 'Save Settings'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
