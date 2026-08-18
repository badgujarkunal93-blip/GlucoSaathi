import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Flame, CheckCircle2, HeartPulse } from 'lucide-react';

export default function LogActivityModal({ isOpen, onClose }) {
  const { logPhysicalActivity } = useApp();
  const [activityType, setActivityType] = useState('Brisk Walking');
  const [intensity, setIntensity] = useState('Moderate');
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!activityType.trim()) return;

    logPhysicalActivity({
      activityType,
      intensity,
      durationMinutes: Number(durationMinutes) || 30
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
            <div className="w-9 h-9 rounded-xl bg-[#E9E3FF] border border-[#CEBFFC] text-[#2B1D61] flex items-center justify-center">
              <Flame className="w-5 h-5 text-[#533BA1]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#172640] font-display">Log Physical Activity</h3>
              <p className="text-xs text-[#5A6E85]">Updates muscle glucose burn factor in risk engine</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#5A6E85] hover:bg-[#F2F5F2] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-[#D8F3E7] border border-[#B8E8D2] text-[#093B22] flex flex-col items-center space-y-2 animate-scale-up text-center">
            <CheckCircle2 className="w-10 h-10 text-[#00AFC1]" />
            <h4 className="font-bold text-base">Activity Logged!</h4>
            <p className="text-xs text-[#166442]">Insulin sensitivity factor updated for risk prediction.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Quick Presets */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                Quick Activity Presets
              </label>
              <div className="grid grid-cols-2 gap-2 text-xs font-bold">
                {[
                  { name: 'Brisk Walking', intensity: 'Light', dur: 30 },
                  { name: 'Yoga / Stretching', intensity: 'Light', dur: 45 },
                  { name: 'Cycling / Commute', intensity: 'Moderate', dur: 30 },
                  { name: 'Running / Gym', intensity: 'Intense', dur: 45 }
                ].map((preset, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setActivityType(preset.name);
                      setIntensity(preset.intensity);
                      setDurationMinutes(preset.dur);
                    }}
                    className={`p-2.5 rounded-xl border text-left transition-all ${
                      activityType === preset.name
                        ? 'bg-[#E9E3FF] border-[#533BA1] text-[#2B1D61] font-black'
                        : 'bg-[#FAFBF8] border-[#E2E8DF] text-[#5A6E85] hover:border-[#CBD5E1]'
                    }`}
                  >
                    <div className="text-xs text-[#172640] font-bold">{preset.name}</div>
                    <div className="text-[10px] text-[#5A6E85] font-normal">{preset.intensity} • {preset.dur} min</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Custom Description */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                Activity Name
              </label>
              <input
                type="text"
                value={activityType}
                onChange={(e) => setActivityType(e.target.value)}
                placeholder="e.g. Cricket practice, Badmintion, House chores"
                className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-4 py-2.5 text-sm font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                required
              />
            </div>

            {/* Intensity & Duration */}
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                  Intensity
                </label>
                <select
                  value={intensity}
                  onChange={(e) => setIntensity(e.target.value)}
                  className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-3 py-2.5 text-xs font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                >
                  <option value="Light">Light (Walking)</option>
                  <option value="Moderate">Moderate (Brisk / Yoga)</option>
                  <option value="Intense">Intense (Sports / Gym)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                  Duration (Minutes)
                </label>
                <input
                  type="number"
                  min="5"
                  max="300"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(e.target.value)}
                  className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-3 py-2.5 text-xs font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                />
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
                className="w-2/3 py-2.5 rounded-xl bg-[#533BA1] hover:bg-[#432E85] text-white text-xs font-bold shadow-md transition-all flex items-center justify-center space-x-1.5"
              >
                <HeartPulse className="w-4 h-4" />
                <span>Save Activity</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
