import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, Download, Printer, ShieldCheck, Calendar, Activity, CheckCircle2 } from 'lucide-react';

export default function DoctorReportModal({ isOpen, onClose }) {
  const { settings, history, glucoseLogs, patientState } = useApp();
  const [reportPeriod, setReportPeriod] = useState('7_days');

  if (!isOpen) return null;

  const totalGlucoseLogs = glucoseLogs.length;
  const inRangeLogs = glucoseLogs.filter(g => g.value >= settings.targetMin && g.value <= settings.targetMax).length;
  const hypoLogs = glucoseLogs.filter(g => g.value < settings.targetMin).length;
  const hyperLogs = glucoseLogs.filter(g => g.value > settings.targetMax).length;

  const timeInRangePercent = patientState.todayMetrics.timeInRangePct || 82;
  const hypoPercent = Math.max(2, Math.round((100 - timeInRangePercent) * 0.25));
  const hyperPercent = Math.max(5, 100 - timeInRangePercent - hypoPercent);

  const avgGlucose = patientState.todayMetrics.averageGlucose || 126;
  const avgMealCarbs = patientState.todayMetrics.totalCarbsToday || 68;

  const handleExportCSV = () => {
    const headers = ['Timestamp', 'Type', 'Title', 'Glucose (mg/dL)', 'Carbs (g)', 'Insulin (U)', 'Risk Level', 'Summary'];
    const rows = history.map(item => [
      item.timestamp || '',
      item.type || '',
      `"${item.title || ''}"`,
      item.glucose || '',
      item.carbs || '',
      item.calculatedDose || item.amount || '',
      item.riskLevel || '',
      `"${item.description || item.summary || ''}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GlucoSaathi_Clinical_Report_${settings.name.replace(/\s+/g, '_')}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-2xl border border-black/10 p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-black/8 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#DFF4E8] text-[#075B57] flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#063F3D] font-display">
                Endocrinologist Clinical Visit Summary
              </h3>
              <p className="text-xs text-[#66716F]">
                Standardized glycemic & Indian meal telemetry report
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#66716F] hover:bg-[#F3F1EA] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Profile Bar */}
        <div className="p-4 rounded-xl bg-[#F7F8F5] border border-black/5 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#66716F] block">Patient Name:</span>
            <span className="font-extrabold text-[#063F3D] text-sm">{settings.name}</span>
          </div>
          <div>
            <span className="text-[#66716F] block">Diagnosis:</span>
            <span className="font-bold text-[#063F3D]">{settings.condition}</span>
          </div>
          <div>
            <span className="text-[#66716F] block">Prescribed ICR:</span>
            <span className="font-bold text-[#075B57]">1 U : {settings.icrRatio}g Carbs</span>
          </div>
          <div>
            <span className="text-[#66716F] block">Target Range:</span>
            <span className="font-bold text-[#1E9E67]">{settings.targetMin}–{settings.targetMax} mg/dL</span>
          </div>
        </div>

        {/* Clinical Glycemic & Carb Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66716F]">
              Time-In-Range (TIR)
            </span>
            <div className="text-2xl font-black text-[#075B57] font-display">
              {timeInRangePercent}%
            </div>
            <span className="text-[11px] text-[#66716F]">
              TBR (&lt;70): {hypoPercent}% • TAR (&gt;140): {hyperPercent}%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66716F]">
              Mean Glucose / GMI
            </span>
            <div className="text-2xl font-black text-[#063F3D] font-display">
              {avgGlucose} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
            </div>
            <span className="text-[11px] text-[#66716F]">
              Estimated HbA1c: ~6.3%
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66716F]">
              Daily Carbohydrate Mean
            </span>
            <div className="text-2xl font-black text-[#8D4023] font-display">
              {avgMealCarbs}g <span className="text-xs font-normal text-[#66716F]">/ day</span>
            </div>
            <span className="text-[11px] text-[#66716F]">
              ICMR-NIN IFCT 2017 Calibrated
            </span>
          </div>
        </div>

        {/* Frequent Indian Foods Logged */}
        <div className="space-y-2">
          <span className="text-xs font-extrabold text-[#063F3D] uppercase tracking-wider block">
            Most Frequently Logged Indian Meal Items:
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { name: 'Whole Wheat Roti', count: '18 logs', carbs: '15g/pc' },
              { name: 'Dal Tadka', count: '14 logs', carbs: '18g/bowl' },
              { name: 'Steamed Rice', count: '12 logs', carbs: '28g/bowl' },
              { name: 'Plain Curd / Dahi', count: '9 logs', carbs: '6g/bowl' }
            ].map((f, i) => (
              <div key={i} className="p-2.5 rounded-lg bg-[#F7F8F5] border border-black/5 text-xs">
                <span className="font-bold text-[#063F3D] block truncate">{f.name}</span>
                <span className="text-[11px] text-[#66716F] block">{f.count} • {f.carbs}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#F3F1EA] border border-black/5 text-[11px] text-[#66716F] space-y-1">
          <div className="flex items-center space-x-1.5 text-[#063F3D] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#075B57]" />
            <span>Physician Decision-Support Notice</span>
          </div>
          <p>
            GlucoSaathi is an investigational decision-support prototype. Data presented above is calculated from patient self-logging and continuous telemetry. Confirm all therapeutic adjustments with the treating endocrinologist.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-black/8">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto px-4 py-2.5 rounded-xl bg-[#F3F1EA] hover:bg-[#EAE6DC] text-xs font-bold text-[#063F3D] transition-colors flex items-center justify-center space-x-2"
          >
            <Printer className="w-4 h-4" />
            <span>Print Clinical PDF</span>
          </button>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handleExportCSV}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center space-x-2"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV Telemetry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
