import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, Syringe, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function LogInsulinModal({ isOpen, onClose }) {
  const { logInsulinDose, settings } = useApp();
  const [amount, setAmount] = useState(4.0);
  const [deliveryType, setDeliveryType] = useState('bolus');
  const [insulinType, setInsulinType] = useState('Rapid Acting (Novorapid / Aspart)');
  const [carbsCovered, setCarbsCovered] = useState(60);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const dose = Number(amount);
    if (!dose || dose <= 0) return;

    logInsulinDose({
      amount: dose,
      deliveryType,
      insulinType,
      carbsCovered: Number(carbsCovered) || 0
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
            <div className="w-9 h-9 rounded-xl bg-[#FFE0D1] border border-[#FFC4AB] text-[#552310] flex items-center justify-center">
              <Syringe className="w-5 h-5 text-[#E65100]" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-[#172640] font-display">Log Insulin Dose</h3>
              <p className="text-xs text-[#5A6E85]">Updates Active Insulin on Board (IOB)</p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#5A6E85] hover:bg-[#F2F5F2] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {success ? (
          <div className="p-6 rounded-xl bg-[#D8F3E7] border border-[#B8E8D2] text-[#093B22] flex flex-col items-center space-y-2 animate-scale-up text-center">
            <CheckCircle2 className="w-10 h-10 text-[#00AFC1]" />
            <h4 className="font-bold text-base">Insulin Dose Logged!</h4>
            <p className="text-xs text-[#166442]">Active IOB calculation updated in real-time.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Units Input */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                Insulin Dose (Units)
              </label>
              <div className="relative">
                <input
                  type="number"
                  step="0.5"
                  min="0.5"
                  max="60"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  className="w-full text-3xl font-black text-[#172640] bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-4 py-3 focus:outline-none focus:border-[#E65100] focus:ring-2 focus:ring-[#E65100]/20 font-display"
                  required
                />
                <span className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#5A6E85]">
                  Units (U)
                </span>
              </div>
            </div>

            {/* Dose Type */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                Dose Category
              </label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {[
                  { id: 'bolus', label: 'Meal Bolus' },
                  { id: 'correction', label: 'Correction' },
                  { id: 'basal', label: 'Basal / Long' }
                ].map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setDeliveryType(item.id)}
                    className={`py-2 px-3 rounded-lg border transition-all ${
                      deliveryType === item.id
                        ? 'bg-[#FFE0D1] border-[#FFC4AB] text-[#552310] font-black'
                        : 'bg-[#FAFBF8] border-[#E2E8DF] text-[#5A6E85]'
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Carbs Covered */}
            {deliveryType === 'bolus' && (
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#172640] mb-2">
                  Carbohydrates Covered (Grams)
                </label>
                <input
                  type="number"
                  value={carbsCovered}
                  onChange={(e) => setCarbsCovered(e.target.value)}
                  className="w-full bg-[#FAFBF8] border border-[#E2E8DF] rounded-xl px-4 py-2.5 text-sm font-bold text-[#172640] focus:outline-none focus:border-[#00AFC1]"
                />
              </div>
            )}

            {/* Medical Disclaimer Banner */}
            <div className="p-3 rounded-xl bg-[#FFF1B8]/60 border border-[#FFE280] flex items-start space-x-2 text-[11px] text-[#4B3903]">
              <ShieldAlert className="w-4 h-4 text-[#785E09] shrink-0 mt-0.5" />
              <span>
                Safety note: Always follow your prescribed pen/syringe markings and physician insulin protocol.
              </span>
            </div>

            {/* Actions */}
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
                className="w-2/3 py-2.5 rounded-xl bg-[#E65100] hover:bg-[#D84315] text-white text-xs font-bold shadow-md transition-all"
              >
                Save Insulin Log
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
