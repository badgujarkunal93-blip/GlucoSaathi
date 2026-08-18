import React, { useState } from 'react';
import { useApp, DEMO_PERSONAS } from '../context/AppContext';
import { X, Settings, User, Syringe, Sparkles, Key, CheckCircle2, ShieldCheck } from 'lucide-react';

export default function SettingsModal() {
  const { 
    isSettingsOpen, 
    setIsSettingsOpen, 
    settings, 
    setSettings, 
    currentPersonaKey, 
    switchPersona 
  } = useApp();

  const [formData, setFormData] = useState(settings);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isSettingsOpen) return null;

  const handlePersonaSelect = (key) => {
    switchPersona(key);
    setFormData(DEMO_PERSONAS[key]);
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSettings(formData);
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      setIsSettingsOpen(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172640]/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-lg bg-white rounded-[18px] border border-[#E2E8DF] p-6 sm:p-7 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#FAFBF8] border border-[#E2E8DF] text-[#172640] flex items-center justify-center">
              <Settings className="w-5 h-5 text-[#00AFC1]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#172640] font-display">T1D Profile & Clinical Ratios</h3>
              <p className="text-xs text-[#5A6E85]">Personalize your ICR and care plan settings</p>
            </div>
          </div>
          <button onClick={() => setIsSettingsOpen(false)} className="p-1.5 rounded-lg text-[#5A6E85] hover:bg-[#F2F5F2] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Persona Switcher */}
        <div className="p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E2E8DF] space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-[#5A6E85] block">
            Switch Evaluation Persona (PS-102 Demo):
          </span>
          <div className="grid grid-cols-3 gap-2 text-xs font-bold">
            {[
              { id: 'aarav', label: '🧑 Aarav (24y)' },
              { id: 'priya', label: '👧 Priya (12y)' },
              { id: 'rajesh', label: '👨 Rajesh (45y)' }
            ].map((p) => (
              <button
                key={p.id}
                type="button"
                onClick={() => handlePersonaSelect(p.id)}
                className={`py-2 px-2 rounded-lg border text-center transition-all ${
                  currentPersonaKey === p.id
                    ? 'bg-[#00AFC1] text-white border-[#00AFC1] shadow-xs'
                    : 'bg-white border-[#E2E8DF] text-[#5A6E85] hover:border-[#CBD5E1]'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {savedSuccess ? (
          <div className="p-6 rounded-xl bg-[#D8F3E7] border border-[#B8E8D2] text-[#093B22] flex flex-col items-center space-y-2 text-center">
            <CheckCircle2 className="w-10 h-10 text-[#00AFC1]" />
            <h4 className="font-bold text-base">Profile Settings Saved!</h4>
            <p className="text-xs text-[#166442]">Your clinical ratios have been updated.</p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-4">
            {/* Patient Name */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-1.5">
                Patient Full Name
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                required
              />
            </div>

            {/* Insulin-to-Carb Ratio (ICR) & Correction Factor */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-1.5">
                  Insulin-to-Carb (ICR)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="2"
                    max="50"
                    value={formData.icrRatio}
                    onChange={(e) => setFormData(prev => ({ ...prev, icrRatio: Number(e.target.value) }))}
                    className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#5A6E85]">
                    g/Unit
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-1.5">
                  ISF (Correction Factor)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="1"
                    min="10"
                    max="150"
                    value={formData.correctionFactor}
                    onChange={(e) => setFormData(prev => ({ ...prev, correctionFactor: Number(e.target.value) }))}
                    className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#5A6E85]">
                    mg/dL drop
                  </span>
                </div>
              </div>
            </div>

            {/* Target Glucose Range */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-1.5">
                  Target Min (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.targetMin}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetMin: Number(e.target.value) }))}
                  className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-1.5">
                  Target Max (mg/dL)
                </label>
                <input
                  type="number"
                  value={formData.targetMax}
                  onChange={(e) => setFormData(prev => ({ ...prev, targetMax: Number(e.target.value) }))}
                  className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                />
              </div>
            </div>

            {/* Regimen Note */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-1.5">
                Active Regimen & Basal Notes
              </label>
              <input
                type="text"
                value={formData.basalRegimen}
                onChange={(e) => setFormData(prev => ({ ...prev, basalRegimen: e.target.value }))}
                placeholder="e.g. 16 U Tresiba at 10 PM"
                className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-3.5 py-2.5 text-xs font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
              />
            </div>

            {/* Optional Gemini API Key */}
            <div className="p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E2E8DF] space-y-2">
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] flex items-center space-x-1.5">
                <Key className="w-3.5 h-3.5 text-[#00AFC1]" />
                <span>Google Gemini API Key (Optional)</span>
              </label>
              <input
                type="password"
                value={formData.geminiApiKey || ''}
                onChange={(e) => setFormData(prev => ({ ...prev, geminiApiKey: e.target.value }))}
                placeholder="AIzaSy... (Leave empty to use built-in ICMR engine)"
                className="w-full bg-white border border-[#E2E8DF] rounded-lg px-3 py-2 text-xs text-[#172640] focus:outline-none focus:border-[#00AFC1]"
              />
              <p className="text-[10px] text-[#5A6E85]">
                GlucoSaathi automatically runs in full offline demo mode with 60+ curated foods if no key is supplied.
              </p>
            </div>

            {/* Submit */}
            <div className="pt-3 flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsSettingsOpen(false)}
                className="w-1/3 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#5A6E85] hover:bg-[#F2F5F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-[#00AFC1] hover:bg-[#0098A8] text-white text-xs font-bold shadow-md transition-all"
              >
                Save Profile Settings
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
