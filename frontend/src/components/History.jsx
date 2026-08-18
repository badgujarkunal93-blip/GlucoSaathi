import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History as HistoryIcon, 
  Filter, 
  Utensils, 
  Activity, 
  ShieldCheck, 
  ChevronRight, 
  Download,
  Calendar,
  Sparkles,
  Printer
} from 'lucide-react';

export default function History() {
  const { history, setIsDoctorReportModalOpen } = useApp();
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = filterType === 'all' 
    ? history 
    : history.filter(item => item.type === filterType);

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-8">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black text-[#0F315E] uppercase tracking-wider bg-[#DCEBFF] px-2.5 py-0.5 rounded-[6px] border border-[#B8D7FF]">
              GLYCEMIC & MEAL JOURNAL
            </span>
            <span className="text-xs text-[#5A6E85] font-medium hidden sm:inline">
              • Unified Health Logs
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172640] tracking-tight font-display pt-1">
            Logs & Clinical History
          </h2>
          <p className="text-sm text-[#5A6E85] font-normal">
            Track and review your past meals, glucose readings, insulin doses, and risk evaluations.
          </p>
        </div>

        {/* Doctor Report CTA */}
        <button
          onClick={() => setIsDoctorReportModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#00AFC1] hover:bg-[#0098A8] text-white text-xs font-bold shadow-md transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Clinical Report</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-xl border border-[#E2E8DF] shadow-xs">
        {[
          { id: 'all', label: 'All Records', count: history.length },
          { id: 'meal', label: '🍛 Meals', count: history.filter(h => h.type === 'meal').length },
          { id: 'glucose', label: '🩸 Glucose', count: history.filter(h => h.type === 'glucose').length },
          { id: 'risk-check', label: '🛡️ Risk Checks', count: history.filter(h => h.type === 'risk-check').length },
          { id: 'activity', label: '🏃 Activity', count: history.filter(h => h.type === 'activity').length }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center space-x-1.5 ${
              filterType === tab.id
                ? 'bg-[#172640] text-white shadow-xs'
                : 'text-[#5A6E85] hover:bg-[#FAFBF8] hover:text-[#172640]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filterType === tab.id ? 'bg-white/20 text-white' : 'bg-[#F2F5F2] text-[#5A6E85]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Chronological Log Feed */}
      <div className="space-y-4">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const isMeal = item.type === 'meal';
            const isGlucose = item.type === 'glucose';
            const isRisk = item.type === 'risk-check';
            const isActivity = item.type === 'activity';

            return (
              <div
                key={item.id}
                className="p-5 rounded-[16px] bg-white border border-[#E2E8DF] paper-elevation-base hover:border-[#CBD5E1] transition-all space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                      isMeal 
                        ? 'bg-[#FFE0D1] text-[#552310] border border-[#FFC4AB]' 
                        : isGlucose
                        ? 'bg-[#DCEBFF] text-[#0F315E] border border-[#B8D7FF]'
                        : isActivity
                        ? 'bg-[#E9E3FF] text-[#2B1D61] border border-[#CEBFFC]'
                        : 'bg-[#D8F3E7] text-[#093B22] border border-[#B8E8D2]'
                    }`}>
                      {isMeal ? '🍛' : isGlucose ? '🩸' : isActivity ? '🏃' : '🛡️'}
                    </div>

                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-extrabold text-[#172640] font-display">
                          {item.title || item.description}
                        </span>
                        {item.riskLevel && (
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                            item.riskLevel === 'HIGH' ? 'bg-[#FFD9D4] text-[#5A150D]' : item.riskLevel === 'MODERATE' ? 'bg-[#FFE0D1] text-[#552310]' : 'bg-[#D8F3E7] text-[#093B22]'
                          }`}>
                            {item.riskLevel} Risk
                          </span>
                        )}
                      </div>

                      <div className="text-xs text-[#5A6E85] flex flex-wrap items-center gap-2">
                        <span>{item.dayGroup || 'Recent'} at {item.timestamp}</span>
                        {item.carbs && <span>• <strong className="text-[#8D4023]">{item.carbs}g Carbs</strong></span>}
                        {item.value && <span>• <strong className="text-[#00AFC1]">{item.value} mg/dL</strong></span>}
                        {item.calculatedDose && <span>• <strong>{item.calculatedDose} U Bolus</strong></span>}
                        {item.durationMinutes && <span>• <strong>{item.durationMinutes} min ({item.intensity})</strong></span>}
                      </div>
                    </div>
                  </div>

                  <span className="text-xs text-[#8292A6] font-medium hidden sm:inline">
                    {item.timeAgo || 'Logged'}
                  </span>
                </div>

                {/* Sub-items if Meal */}
                {isMeal && item.items && item.items.length > 0 && (
                  <div className="pt-2 border-t border-[#E2E8DF] flex flex-wrap gap-2 text-xs">
                    {item.items.map((sub, sIdx) => (
                      <span key={sIdx} className="px-2.5 py-1 rounded-lg bg-[#FAFBF8] border border-[#E2E8DF] text-[#172640] font-medium">
                        {sub.name} ({sub.quantity || sub.carbs + 'g'})
                      </span>
                    ))}
                  </div>
                )}

                {/* Explanation text if Risk */}
                {isRisk && item.summary && (
                  <div className="pt-2 border-t border-[#E2E8DF] text-xs text-[#5A6E85] leading-relaxed">
                    {item.summary}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="p-12 rounded-[16px] bg-white border border-[#E2E8DF] text-center text-[#5A6E85] space-y-2">
            <HistoryIcon className="w-8 h-8 mx-auto text-[#CBD5E1]" />
            <p className="text-sm font-bold text-[#172640]">No records found in this filter.</p>
            <p className="text-xs">Log a meal, glucose reading, or risk check to see it here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
