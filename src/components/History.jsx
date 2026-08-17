import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  History as HistoryIcon, 
  UtensilsCrossed, 
  Activity, 
  Calendar, 
  ChevronRight
} from 'lucide-react';

export default function History() {
  const { history, carryMealToRiskCheck } = useApp();
  const [activeFilter, setActiveFilter] = useState('all');

  const filteredHistory = history.filter(item => {
    if (activeFilter === 'meals') return item.type === 'meal';
    if (activeFilter === 'risk') return item.type === 'risk-check';
    return true;
  });

  const groupedByDay = filteredHistory.reduce((acc, item) => {
    const group = item.dayGroup || 'Today';
    if (!acc[group]) acc[group] = [];
    acc[group].push(item);
    return acc;
  }, {});

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-8">
      {/* Header & Filter Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-[6px] bg-[#E9E3FF] text-[#2B1D61]">
              📖 PERSONAL HEALTH JOURNAL
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#172640] tracking-tight font-display pt-2">
            Health logs & timeline
          </h2>
          <p className="text-sm lg:text-base text-[#5A6E85] font-normal mt-1">
            Chronological record of your meals, carbs, and glucose risk evaluations.
          </p>
        </div>

        {/* Clean Filter Tabs */}
        <div className="flex p-1 rounded-[10px] bg-white border border-[#E2E8DF] paper-elevation-base self-start sm:self-auto space-x-1">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#00AFC1] text-white shadow-xs'
                : 'text-[#5A6E85] hover:text-[#172640] hover:bg-[#F2F5F2]'
            }`}
          >
            All Logs
          </button>
          <button
            onClick={() => setActiveFilter('meals')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'meals'
                ? 'bg-[#FFE0D1] text-[#552310] shadow-xs'
                : 'text-[#5A6E85] hover:text-[#172640] hover:bg-[#F2F5F2]'
            }`}
          >
            Meals Only
          </button>
          <button
            onClick={() => setActiveFilter('risk')}
            className={`px-3 py-1.5 rounded-[8px] text-xs font-black transition-all cursor-pointer ${
              activeFilter === 'risk'
                ? 'bg-[#D8F3E7] text-[#093B22] shadow-xs'
                : 'text-[#5A6E85] hover:text-[#172640] hover:bg-[#F2F5F2]'
            }`}
          >
            Risk Checks
          </button>
        </div>
      </div>

      {/* Journal Timeline Feed with Alternating Soft Pastel Cards and Elevation */}
      <div className="space-y-7">
        {Object.keys(groupedByDay).length === 0 ? (
          <div className="p-8 rounded-[14px] bg-white border border-[#E2E8DF] paper-elevation-base text-center space-y-1">
            <p className="text-sm font-bold text-[#172640]">No logs found for this filter.</p>
            <p className="text-xs text-[#5A6E85]">Log an Indian meal or perform a risk check to see entries here.</p>
          </div>
        ) : (
          Object.entries(groupedByDay).map(([dayLabel, items]) => (
            <div key={dayLabel} className="space-y-3">
              {/* Day Header */}
              <div className="flex items-center space-x-3 px-1">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#172640] bg-white px-2.5 py-1 rounded-[6px] border border-[#E2E8DF] paper-elevation-base">
                  📅 {dayLabel}
                </span>
                <div className="flex-1 h-[1px] bg-[#E2E8DF]" />
              </div>

              {/* Colorful Health Journal Cards */}
              <div className="space-y-2.5">
                {items.map((item) => {
                  const isMeal = item.type === 'meal';
                  const isLowRisk = item.riskLevel === 'LOW';

                  return (
                    <div
                      key={item.id}
                      className={`p-4 sm:p-5 rounded-[12px] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all duration-150 paper-elevation-base hover:translate-y-[-1px] ${
                        isMeal
                          ? 'bg-[#FFE0D1] text-[#552310] border-[#FFC4AB]'
                          : isLowRisk
                          ? 'bg-[#D8F3E7] text-[#093B22] border-[#B8E8D2]'
                          : 'bg-[#FFF1B8] text-[#4B3903] border-[#FFE280]'
                      }`}
                    >
                      {/* Left: Time, Icon & Title */}
                      <div className="flex items-center space-x-3.5">
                        <span className="text-xs font-black opacity-80 w-12 shrink-0 font-mono">
                          {item.timestamp}
                        </span>

                        <div className="w-9 h-9 rounded-[8px] bg-white flex items-center justify-center text-base shrink-0 shadow-xs">
                          {isMeal ? '🍽️' : '🟢'}
                        </div>

                        <div>
                          <div className="flex items-center space-x-2">
                            <h4 className="text-sm sm:text-base font-black font-display">
                              {item.title}
                            </h4>
                            {!isMeal && (
                              <span className="text-[9px] font-black px-1.5 py-0.5 rounded-[4px] bg-[#093B22] text-[#D8F3E7]">
                                {item.riskLevel} RISK
                              </span>
                            )}
                          </div>
                          <p className="text-xs font-semibold opacity-90 mt-0.5">
                            {isMeal ? item.description : item.summary || `Glucose ${item.glucose} mg/dL • Calculated dose 4.5U`}
                          </p>
                        </div>
                      </div>

                      {/* Right: Metrics & Action */}
                      <div className="flex items-center justify-between sm:justify-end space-x-4 pl-16 sm:pl-0">
                        <div className="text-left sm:text-right">
                          {isMeal ? (
                            <div>
                              <span className="text-lg font-black font-display">
                                {item.carbs}g
                              </span>
                              <span className="text-xs font-bold opacity-80 ml-1">carbs</span>
                            </div>
                          ) : (
                            <div>
                              <span className="text-lg font-black font-display">
                                {item.glucose}
                              </span>
                              <span className="text-xs font-bold opacity-80 ml-1">mg/dL</span>
                            </div>
                          )}
                        </div>

                        {isMeal && (
                          <button
                            onClick={() => carryMealToRiskCheck(item.carbs, item.description)}
                            className="px-2.5 py-1 rounded-[8px] bg-white hover:bg-slate-50 text-[#552310] text-xs font-black flex items-center space-x-1 shadow-xs transition-all cursor-pointer"
                            title="Calculate risk with this meal"
                          >
                            <span>Check risk</span>
                            <ChevronRight className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
