import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { 
  BookOpen, 
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

export default function History({ onNavigate }) {
  const { history, setIsDoctorReportModalOpen, settings } = useApp();
  const [filterType, setFilterType] = useState('all');

  const filteredHistory = filterType === 'all' 
    ? history 
    : history.filter(item => item.type === filterType);

  return (
    <div className="space-y-8 animate-fade-in pb-20 lg:pb-12 pt-2">
      {/* 1. Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/5 pb-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold text-[#075B57] uppercase tracking-wider bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
              GLYCEMIC & MEAL JOURNAL
            </span>
            <span className="text-xs text-[#66716F] font-semibold hidden sm:inline">
              • Synchronized Health Logs
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] tracking-tight font-editorial pt-1">
            Health Journal Telemetry
          </h2>
          <p className="text-sm text-[#66716F]">
            Review past meals, fingerstick glucose checks, insulin events, and risk evaluations for {settings.name}.
          </p>
        </div>

        {/* Doctor Report CTA */}
        <button
          onClick={() => setIsDoctorReportModalOpen(true)}
          className="px-4 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-bold shadow-xs transition-all flex items-center space-x-2 shrink-0 self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Export Clinical Report</span>
        </button>
      </div>

      {/* 2. Filter Bar */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-xl border border-black/8 shadow-xs">
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
                ? 'bg-[#063F3D] text-white shadow-xs'
                : 'text-[#66716F] hover:bg-[#F3F1EA] hover:text-[#063F3D]'
            }`}
          >
            <span>{tab.label}</span>
            <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${
              filterType === tab.id ? 'bg-white/20 text-white' : 'bg-[#F7F8F5] text-[#66716F]'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      {/* 3. Chronological Log Feed */}
      <div className="space-y-3.5">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item) => {
            const isMeal = item.type === 'meal';
            const isGlucose = item.type === 'glucose';
            const isRisk = item.type === 'risk-check';
            const isActivity = item.type === 'activity';

            return (
              <div
                key={item.id}
                className="editorial-card p-5 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold shrink-0 ${
                      isMeal 
                        ? 'bg-[#FFE0D1] text-[#8D4023]' 
                        : isGlucose 
                        ? 'bg-[#DFF4E8] text-[#075B57]' 
                        : isRisk 
                        ? 'bg-[#FEF7E6] text-[#8D4023]' 
                        : 'bg-[#F3F1EA] text-[#063F3D]'
                    }`}>
                      {isMeal ? '🍛' : isGlucose ? '🩸' : isRisk ? '🛡️' : '🏃'}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center space-x-2">
                        <h4 className="text-sm font-extrabold text-[#063F3D] font-display">
                          {item.title}
                        </h4>
                        <span className="text-[10px] font-bold text-[#66716F] bg-[#F7F8F5] px-2 py-0.5 rounded">
                          {item.timestamp}
                        </span>
                      </div>
                      <p className="text-xs text-[#66716F]">
                        {item.description || item.summary || 'Logged telemetry entry'}
                      </p>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-sm font-black text-[#075B57] font-display block">
                      {item.carbs ? `${item.carbs}g Carbs` : item.value ? `${item.value} mg/dL` : item.riskLevel || 'Logged'}
                    </span>
                    {item.confidence && (
                      <span className="text-[10px] text-[#66716F] font-semibold">
                        {item.confidence} Confidence
                      </span>
                    )}
                  </div>
                </div>

                {/* Sub-items for meals */}
                {item.items && item.items.length > 0 && (
                  <div className="pt-2 border-t border-black/5 flex flex-wrap gap-1.5">
                    {item.items.map((sub, idx) => (
                      <span key={idx} className="px-2 py-0.5 rounded-md bg-[#F7F8F5] border border-black/5 text-[11px] text-[#66716F]">
                        {sub.name} ({sub.quantity} {sub.unit || 'pc'}) — {sub.carbs}g
                      </span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="editorial-card p-12 text-center text-[#66716F] space-y-2">
            <BookOpen className="w-8 h-8 mx-auto text-[#8A9694]" />
            <p className="text-sm font-bold text-[#063F3D]">No Entries Found</p>
            <p className="text-xs">No records matched the selected filter.</p>
          </div>
        )}
      </div>
    </div>
  );
}
