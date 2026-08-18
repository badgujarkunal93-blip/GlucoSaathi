import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Activity, AlertTriangle, CheckCircle2, TrendingUp, TrendingDown, Minus } from 'lucide-react';

export default function LogGlucoseModal({ isOpen, onClose }) {
  const { logGlucoseReading } = useApp();
  const [value, setValue] = useState(110);
  const [mealRelation, setMealRelation] = useState('pre_meal');
  const [trend, setTrend] = useState('stable');
  const [notes, setNotes] = useState('');
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const num = Number(value);
    if (!num || num < 20 || num > 600) return;

    logGlucoseReading({
      value: num,
      mealRelation,
      trend,
      notes
    });

    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      onClose();
    }, 650);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172640]/60 backdrop-blur-xs animate-fade-in">
      <div className="w-full max-w-md bg-white rounded-[18px] border border-[#E2E8DF] p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DCEBFF] border border-[#B8D7FF] text-[#0F315E] flex items-center justify-center">
              <Activity className="w-5 h-5 text-[#00AFC1]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#172640] font-display">Log Blood Glucose</h3>
              <p className="text-xs text-[#5A6E85]">Manual entry or fingerstick / CGM</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#5A6E85] hover:bg-[#F2F5F2] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-[#D8F3E7] border border-[#B8E8D2] text-[#093B22] flex flex-col items-center space-y-2 animate-scale-up text-center">
            <CheckCircle2 className="w-10 h-10 text-[#00AFC1]" />
            <h4 className="font-bold text-base">Glucose Reading Saved!</h4>
            <p className="text-xs text-[#166442]">Telemetry and risk indicators have been synchronized.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Value Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                Glucose Value (mg/dL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="30"
                  max="500"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  className="w-full text-3xl font-black text-[#172640] bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#00AFC1] focus:ring-2 focus:ring-[#00AFC1]/20 font-display"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5A6E85]">
                  mg/dL
                </span>
              </div>
              {value < 70 && (
                <div className="mt-2 flex items-center space-x-1.5 text-xs text-red-600 font-bold">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Rule of 15 alert: Glucose is in hypoglycemia range!</span>
                </div>
              )}
            </div>

            {/* Timing Context */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                Context / Timing
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {[
                  { id: 'fasting', label: 'Fasting' },
                  { id: 'pre_meal', label: 'Pre-Meal' },
                  { id: 'post_meal', label: 'Post-Meal' },
                  { id: 'bedtime', label: 'Bedtime' },
                  { id: 'random', label: 'Random' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setMealRelation(item.id)}
                    className={`py-2 px-3 rounded-lg border transition-all ${
                      mealRelation === item.id
                        ? 'bg-[#E5F7F8] border-[#00AFC1] text-[#008694] font-black'
                        : 'bg-[#FAFBF8] border-[#E2E8DF] text-[#5A6E85] hover:border-[#CBD5E1]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Trend Direction */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                Trend Direction (CGM / Sensation)
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {[
                  { id: 'falling', label: 'Falling ↓', icon: TrendingDown },
                  { id: 'stable', label: 'Stable →', icon: Minus },
                  { id: 'rising', label: 'Rising ↑', icon: TrendingUp }
                ].map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setTrend(item.id)}
                      className={`py-2 px-2.5 rounded-lg border flex items-center justify-center space-x-1.5 transition-all ${
                        trend === item.id
                          ? 'bg-[#E9E3FF] border-[#CEBFFC] text-[#2B1D61] font-black'
                          : 'bg-[#FAFBF8] border-[#E2E8DF] text-[#5A6E85]'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit */}
            <div className="pt-2 flex items-center space-x-3">
              <button
                type="button"
                onClick={onClose}
                className="w-1/3 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#5A6E85] hover:bg-[#F2F5F2]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="w-2/3 py-2.5 rounded-xl bg-[#00AFC1] hover:bg-[#0098A8] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <span>Save Reading</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
