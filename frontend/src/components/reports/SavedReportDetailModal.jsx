import React from 'react';
import { X, FileText, Download, Printer, ShieldCheck, Calendar, Activity, CheckCircle2 } from 'lucide-react';

export default function SavedReportDetailModal({ report, isOpen, onClose, onReassess }) {
  if (!isOpen || !report) return null;

  const formattedDate = report.createdAt 
    ? new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
    : 'Unknown Date';

  const handlePrint = () => {
    window.print();
  };

  const handleExportCSV = () => {
    const headers = ['Report_ID', 'Timestamp', 'Patient', 'Glucose (mg/dL)', 'Trend', 'IOB (U)', 'Carbs (g)', 'Activity', 'Risk Score', 'Risk Level', '30m Forecast (mg/dL)'];
    const row = [
      report.id,
      report.createdAt,
      `"${report.patient?.name || 'Patient'}"`,
      report.clinicalParameters?.glucose || '',
      report.clinicalParameters?.glucoseTrend || '',
      report.clinicalParameters?.activeInsulin || '',
      report.meal?.estimatedCarbs || '',
      report.activity?.level || '',
      report.prediction?.riskScore || '',
      report.prediction?.riskLevel || '',
      report.prediction?.forecast30Min || ''
    ];

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), row.join(',')].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `GlucoSaathi_Report_${report.id}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
              <div className="flex items-center space-x-2">
                <h3 className="text-xl font-extrabold text-[#063F3D] font-display">
                  Saved Assessment Snapshot
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#F3F1EA] text-[#063F3D]">
                  Historical Record
                </span>
              </div>
              <p className="text-xs text-[#66716F]">
                Recorded: {formattedDate} • ID: {report.id}
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
            <span className="font-extrabold text-[#063F3D] text-sm">{report.patient?.name || 'Aarav'}</span>
          </div>
          <div>
            <span className="text-[#66716F] block">Diagnosis:</span>
            <span className="font-bold text-[#063F3D]">{report.patient?.diagnosis || 'Type 1 Diabetes'}</span>
          </div>
          <div>
            <span className="text-[#66716F] block">Prescribed ICR:</span>
            <span className="font-bold text-[#075B57]">{report.clinicalParameters?.icr || '1:15'}</span>
          </div>
          <div>
            <span className="text-[#66716F] block">Target Range:</span>
            <span className="font-bold text-[#1E9E67]">{report.clinicalParameters?.targetRange || '70-140'} mg/dL</span>
          </div>
        </div>

        {/* Key Telemetry at time of assessment */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66716F]">
              Recorded Glucose
            </span>
            <div className="text-2xl font-black text-[#063F3D] font-display">
              {report.clinicalParameters?.glucose || 108} <span className="text-xs font-normal text-[#66716F]">mg/dL</span>
            </div>
            <span className="text-[11px] text-[#66716F]">
              Trend: {report.clinicalParameters?.glucoseTrend || 'Stable'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66716F]">
              Meal Carbs (IFCT 2017)
            </span>
            <div className="text-2xl font-black text-[#8D4023] font-display">
              {report.meal?.estimatedCarbs || 68} <span className="text-xs font-normal text-[#66716F]">g</span>
            </div>
            <span className="text-[11px] text-[#66716F] truncate block">
              {report.meal?.description || 'Indian Meal'}
            </span>
          </div>

          <div className="p-4 rounded-xl bg-white border border-black/10 space-y-1">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#66716F]">
              Model Risk Outcome
            </span>
            <div className="text-2xl font-black text-[#075B57] font-display">
              {report.prediction?.riskLevel || 'LOW'} <span className="text-xs font-normal text-[#66716F]">({report.prediction?.riskScore || 15}/100)</span>
            </div>
            <span className="text-[11px] text-[#075B57] font-semibold">
              Forecast: ~{report.prediction?.forecast30Min || 98} mg/dL
            </span>
          </div>
        </div>

        {/* Clinical Disclaimer */}
        <div className="p-3.5 rounded-xl bg-[#F3F1EA] border border-black/5 text-[11px] text-[#66716F] space-y-1">
          <div className="flex items-center space-x-1.5 text-[#063F3D] font-bold">
            <ShieldCheck className="w-4 h-4 text-[#075B57]" />
            <span>Physician Decision-Support Notice</span>
          </div>
          <p>
            This historical snapshot was generated by GlucoSaathi decision-support prototype. Confirm all therapeutic adjustments with the treating endocrinologist.
          </p>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-black/8">
          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={handlePrint}
              className="px-4 py-2.5 rounded-xl bg-[#F3F1EA] hover:bg-[#EAE6DC] text-xs font-bold text-[#063F3D] transition-colors flex items-center justify-center space-x-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print PDF</span>
            </button>

            <button
              type="button"
              onClick={handleExportCSV}
              className="px-4 py-2.5 rounded-xl bg-[#F3F1EA] hover:bg-[#EAE6DC] text-xs font-bold text-[#063F3D] transition-colors flex items-center justify-center space-x-1.5"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => {
                onClose();
                if (onReassess) onReassess(report);
              }}
              className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold transition-all shadow-xs flex items-center justify-center space-x-1.5"
            >
              <span>Reassess With These Values →</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
