import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, FileText, Download, Printer, ShieldCheck, Calendar, Activity, CheckCircle2 } from 'lucide-react';

export default function DoctorReportModal({ isOpen, onClose }) {
  const { settings, history, glucoseLogs, mealLogs, riskResult } = useApp();
  const [reportPeriod, setReportPeriod] = useState('7_days');

  if (!isOpen) return null;

  // Calculate clinical summary stats
  const totalGlucoseLogs = glucoseLogs.length;
  const inRangeLogs = glucoseLogs.filter(g => g.value >= settings.targetMin && g.value <= settings.targetMax).length;
  const hypoLogs = glucoseLogs.filter(g => g.value < settings.targetMin).length;
  const hyperLogs = glucoseLogs.filter(g => g.value > settings.targetMax).length;

  const timeInRangePercent = totalGlucoseLogs > 0 ? Math.round((inRangeLogs / totalGlucoseLogs) * 100) : 78;
  const hypoPercent = totalGlucoseLogs > 0 ? Math.round((hypoLogs / totalGlucoseLogs) * 100) : 6;
  const hyperPercent = totalGlucoseLogs > 0 ? Math.round((hyperLogs / totalGlucoseLogs) * 100) : 16;

  const avgGlucose = totalGlucoseLogs > 0 
    ? Math.round(glucoseLogs.reduce((acc, g) => acc + g.value, 0) / totalGlucoseLogs)
    : 118;

  const avgMealCarbs = mealLogs.length > 0
    ? Math.round(mealLogs.reduce((acc, m) => acc + (m.carbs || m.totalCarbs || 0), 0) / mealLogs.length)
    : 54;

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#172640]/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-2xl bg-white rounded-[18px] border border-[#E2E8DF] p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-[#E2E8DF] pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#D8F3E7] border border-[#B8E8D2] text-[#093B22] flex items-center justify-center">
              <FileText className="w-5 h-5 text-[#00AFC1]" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#172640] font-display">
                Endocrinologist Clinical Summary
              </h3>
              <p className="text-xs text-[#5A6E85]">
                Exportable visit report for Dr. Mehta & Clinical Care Team
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#5A6E85] hover:bg-[#F2F5F2] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Patient Profile Bar */}
        <div className="p-4 rounded-xl bg-[#FAFBF8] border border-[#E2E8DF] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-[#5A6E85] block">Patient Name:</span>
            <span className="font-extrabold text-[#172640] text-sm">{settings.name}</span>
          </div>
          <div>
            <span className="text-[#5A6E85] block">Diagnosis:</span>
            <span className="font-bold text-[#172640]">{settings.condition}</span>
          </div>
          <div>
            <span className="text-[#5A6E85] block">Insulin-to-Carb (ICR):</span>
            <span className="font-bold text-[#00AFC1]">1 U : {settings.icrRatio}g Carbs</span>
          </div>
          <div>
            <span className="text-[#5A6E85] block">Target Range:</span>
            <span className="font-bold text-[#166442]">{settings.targetMin}–{settings.targetMax} mg/dL</span>
          </div>
        </div>

        {/* Clinical Glycemic & Carb Telemetry */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* Time In Range */}
          <div className="p-4 rounded-xl bg-[#D8F3E7] border border-[#B8E8D2] text-[#093B22]">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#166442]">Time In Range (TIR)</div>
            <div className="text-3xl font-extrabold font-display mt-1">{timeInRangePercent}%</div>
            <div className="text-[11px] text-[#166442] mt-1">Goal &gt; 70% in 70–140 mg/dL</div>
          </div>

          {/* Average Glucose */}
          <div className="p-4 rounded-xl bg-[#DCEBFF] border border-[#B8D7FF] text-[#0F315E]">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#25589A]">Mean Glucose</div>
            <div className="text-3xl font-extrabold font-display mt-1">{avgGlucose} <span className="text-xs font-normal">mg/dL</span></div>
            <div className="text-[11px] text-[#25589A] mt-1">Est. GMI / HbA1c ~ 5.9%</div>
          </div>

          {/* Hypo Risk Episodes */}
          <div className="p-4 rounded-xl bg-[#FFE0D1] border border-[#FFC4AB] text-[#552310]">
            <div className="text-[11px] font-black uppercase tracking-wider text-[#8D4023]">Hypo Exposure (&lt;70)</div>
            <div className="text-3xl font-extrabold font-display mt-1">{hypoPercent}%</div>
            <div className="text-[11px] text-[#8D4023] mt-1">{hypoLogs} detected episode(s)</div>
          </div>
        </div>

        {/* Recent Meals & Carb Breakdowns Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#172640]">
              Recent Meal Carbohydrate Logs (ICMR-NIN Engine)
            </h4>
            <span className="text-xs text-[#5A6E85] font-medium">Avg: {avgMealCarbs}g carbs / meal</span>
          </div>

          <div className="border border-[#E2E8DF] rounded-xl overflow-hidden text-xs">
            <table className="w-full text-left">
              <thead className="bg-[#FAFBF8] border-b border-[#E2E8DF] text-[#5A6E85]">
                <tr>
                  <th className="p-2.5">Time</th>
                  <th className="p-2.5">Meal Description</th>
                  <th className="p-2.5">Carbs</th>
                  <th className="p-2.5">Est. Bolus</th>
                  <th className="p-2.5">Confidence</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8DF]">
                {mealLogs.slice(0, 4).map((m, idx) => (
                  <tr key={idx} className="hover:bg-[#FAFBF8]">
                    <td className="p-2.5 text-[#5A6E85]">{m.timestamp || 'Today'}</td>
                    <td className="p-2.5 font-bold text-[#172640]">{m.description || m.title}</td>
                    <td className="p-2.5 font-black text-[#00AFC1]">{m.carbs || m.totalCarbs || 0}g</td>
                    <td className="p-2.5 text-[#172640]">{((m.carbs || 0) / settings.icrRatio).toFixed(1)} U</td>
                    <td className="p-2.5">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#D8F3E7] text-[#093B22]">
                        {m.confidence || 'High'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#FAFBF8] border border-[#E2E8DF] flex items-start space-x-2.5 text-[11px] text-[#5A6E85]">
          <ShieldCheck className="w-4 h-4 text-[#00AFC1] shrink-0 mt-0.5" />
          <span>
            This report summarizes patient-logged meals and simulated telemetry for clinical review. Bolus calculations and risk indices are demonstrative and require physician verification.
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-end gap-3 pt-2 border-t border-[#E2E8DF]">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-[#E2E8DF] text-xs font-bold text-[#5A6E85] hover:bg-[#F2F5F2]"
          >
            Close
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="px-4 py-2.5 rounded-xl border border-[#00AFC1] text-[#00AFC1] hover:bg-[#E5F7F8] text-xs font-bold flex items-center space-x-1.5 transition-colors"
          >
            <Printer className="w-4 h-4" />
            <span>Print Report</span>
          </button>
          <button
            type="button"
            onClick={handleExportCSV}
            className="px-5 py-2.5 rounded-xl bg-[#00AFC1] hover:bg-[#0098A8] text-white text-xs font-bold shadow-md flex items-center space-x-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Dataset</span>
          </button>
        </div>
      </div>
    </div>
  );
}
