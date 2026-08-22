import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, User, ShieldCheck, CheckCircle2, Save, Info, AlertTriangle } from 'lucide-react';

export default function UserProfileModal({ isOpen, onClose }) {
  const { userProfile, updateUserProfile, dataMode, setDataMode } = useApp();

  const [formData, setFormData] = useState(userProfile);
  const [savedSuccess, setSavedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    updateUserProfile(formData);
    setDataMode('my_data');
    setSavedSuccess(true);
    setTimeout(() => {
      setSavedSuccess(false);
      onClose();
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-black/10 p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#DFF4E8] text-[#075B57] flex items-center justify-center">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#063F3D] font-display">
                My Clinical Profile
              </h3>
              <p className="text-xs text-[#66716F]">
                Personalized metabolic parameters for individualized decision support
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#66716F] hover:bg-[#F3F1EA] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Clinical Disclaimer Notice */}
        <div className="p-3.5 rounded-xl bg-[#FEF7E6] border border-[#FFE280] text-xs text-[#8D4023] flex items-start space-x-2.5">
          <Info className="w-4 h-4 shrink-0 mt-0.5" />
          <p className="leading-relaxed">
            <strong>Physician Prescription Notice:</strong> Enter only target ranges, ICR ratios, and correction factors provided directly by your treating endocrinologist. GlucoSaathi does not prescribe therapeutic parameters.
          </p>
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="space-y-4 text-xs">
          
          {/* Row 1: Name & Age */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#063F3D] uppercase tracking-wider block">
                Full Name / Alias:
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                required
                className="w-full p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl text-sm font-medium focus:outline-none focus:border-[#075B57]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#063F3D] uppercase tracking-wider block">
                Age (years):
              </label>
              <input
                type="number"
                min="3"
                max="100"
                value={formData.age}
                onChange={(e) => handleChange('age', Number(e.target.value))}
                required
                className="w-full p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl text-sm font-medium focus:outline-none focus:border-[#075B57]"
              />
            </div>
          </div>

          {/* Row 2: Condition & Therapy */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#063F3D] uppercase tracking-wider block">
                Diagnosis / Duration:
              </label>
              <input
                type="text"
                value={formData.condition}
                onChange={(e) => handleChange('condition', e.target.value)}
                className="w-full p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl text-sm font-medium focus:outline-none focus:border-[#075B57]"
              />
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#063F3D] uppercase tracking-wider block">
                Active Insulin Type:
              </label>
              <select
                value={formData.activeInsulinType}
                onChange={(e) => handleChange('activeInsulinType', e.target.value)}
                className="w-full p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl text-sm font-medium focus:outline-none focus:border-[#075B57]"
              >
                <option value="Rapid Acting (Aspart / Novorapid)">Rapid Acting (Aspart / Novorapid)</option>
                <option value="Rapid Acting (Lispro / Humalog)">Rapid Acting (Lispro / Humalog)</option>
                <option value="Ultra-Rapid (Fiasp / Lyumjev)">Ultra-Rapid (Fiasp / Lyumjev)</option>
                <option value="Regular Insulin + NPH Mixed">Regular Insulin + NPH Mixed</option>
              </select>
            </div>
          </div>

          {/* Row 3: ICR & ISF */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-bold text-[#063F3D] uppercase tracking-wider block">
                Insulin-to-Carb Ratio (ICR):
              </label>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#66716F]">1 U :</span>
                <input
                  type="number"
                  min="2"
                  max="50"
                  value={formData.icrRatio}
                  onChange={(e) => handleChange('icrRatio', Number(e.target.value))}
                  required
                  className="flex-1 p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl text-sm font-bold text-[#075B57] focus:outline-none focus:border-[#075B57]"
                />
                <span className="font-bold text-[#66716F]">g Carbs</span>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-bold text-[#063F3D] uppercase tracking-wider block">
                Correction Factor (ISF):
              </label>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-[#66716F]">1 U drops</span>
                <input
                  type="number"
                  min="10"
                  max="150"
                  value={formData.correctionFactor}
                  onChange={(e) => handleChange('correctionFactor', Number(e.target.value))}
                  required
                  className="flex-1 p-2.5 bg-[#F7F8F5] border border-black/10 rounded-xl text-sm font-bold text-[#075B57] focus:outline-none focus:border-[#075B57]"
                />
                <span className="font-bold text-[#66716F]">mg/dL</span>
              </div>
            </div>
          </div>

          {/* Row 4: Target Glucose Range */}
          <div className="space-y-1">
            <label className="font-bold text-[#063F3D] uppercase tracking-wider block">
              Clinician Target Glucose Range (mg/dL):
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center space-x-2">
                <span className="text-[#66716F] font-bold">Min:</span>
                <input
                  type="number"
                  min="60"
                  max="120"
                  value={formData.targetMin}
                  onChange={(e) => handleChange('targetMin', Number(e.target.value))}
                  className="w-full p-2 bg-[#F7F8F5] border border-black/10 rounded-lg text-sm font-bold"
                />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-[#66716F] font-bold">Max:</span>
                <input
                  type="number"
                  min="130"
                  max="250"
                  value={formData.targetMax}
                  onChange={(e) => handleChange('targetMax', Number(e.target.value))}
                  className="w-full p-2 bg-[#F7F8F5] border border-black/10 rounded-lg text-sm font-bold"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end space-x-2.5 pt-4 border-t border-black/8">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl bg-[#F7F8F5] text-xs font-bold text-[#66716F] hover:bg-[#F3F1EA]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold shadow-xs flex items-center space-x-1.5"
            >
              {savedSuccess ? (
                <>
                  <CheckCircle2 className="w-4 h-4 text-[#1E9E67]" />
                  <span>Profile Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Save Profile</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
