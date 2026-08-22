import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { reportStorage } from '../../services/reportStorage';
import SavedReportCard from './SavedReportCard';
import SavedReportDetailModal from './SavedReportDetailModal';
import { 
  FileText, 
  Plus, 
  ArrowLeft, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export default function SavedReportsPage({ onStartNewAssessment, onBackToHome }) {
  const { reassessFromReport } = useApp();
  const [reports, setReports] = useState([]);
  const [selectedReport, setSelectedReport] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  const loadReports = () => {
    const list = reportStorage.getReports();
    setReports(list);
  };

  useEffect(() => {
    loadReports();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleDelete = (id) => {
    const updated = reportStorage.deleteReport(id);
    setReports(updated);
    showToast('Report deleted successfully');
  };

  const handleReassess = (report) => {
    if (reassessFromReport) {
      reassessFromReport(report);
    } else if (onStartNewAssessment) {
      onStartNewAssessment();
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16 pt-2 max-w-7xl mx-auto">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-3.5 px-4 rounded-xl bg-[#063F3D] text-white text-xs font-bold shadow-xl border border-white/10 flex items-center space-x-2 animate-slide-up">
          <CheckCircle2 className="w-4 h-4 text-[#1E9E67]" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header & Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-black/8 pb-5">
        <div className="space-y-2">
          <button
            onClick={onBackToHome}
            className="inline-flex items-center space-x-1.5 text-xs font-bold text-[#66716F] hover:text-[#075B57] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </button>
          
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-extrabold uppercase tracking-widest text-[#075B57] bg-[#DFF4E8] px-2.5 py-0.5 rounded-full">
              CLINICAL ARCHIVE
            </span>
            <span className="text-xs text-[#66716F]">
              • {reports.length} {reports.length === 1 ? 'Assessment' : 'Assessments'} Saved
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#063F3D] font-display tracking-tight">
            Saved Clinical Reports
          </h2>
          <p className="text-xs sm:text-sm text-[#66716F] max-w-2xl leading-relaxed">
            Review previous GlucoSaathi assessments, inspect historical decision-support snapshots, or start a new patient reassessment.
          </p>
        </div>

        {/* Primary Action Button */}
        <div className="flex items-center space-x-3 self-start sm:self-auto shrink-0">
          <button
            onClick={onStartNewAssessment}
            className="px-5 py-3 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm flex items-center space-x-2 transition-all hover:scale-102 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>+ Start New Assessment</span>
          </button>
        </div>
      </div>

      {/* Saved Reports Grid */}
      {reports.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <SavedReportCard
              key={report.id}
              report={report}
              onView={(r) => setSelectedReport(r)}
              onReassess={handleReassess}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="p-12 sm:p-16 text-center bg-white rounded-3xl border border-black/8 shadow-sm space-y-5 max-w-xl mx-auto my-8">
          <div className="w-14 h-14 rounded-2xl bg-[#DFF4E8] text-[#075B57] flex items-center justify-center mx-auto shadow-xs">
            <FileText className="w-7 h-7" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-extrabold text-[#063F3D] font-display">
              No saved assessments yet
            </h3>
            <p className="text-xs sm:text-sm text-[#66716F] max-w-md mx-auto leading-relaxed">
              Complete your first patient assessment, evaluate the near-term risk trajectory, and click "Save & View Reports" to archive it here.
            </p>
          </div>

          <div className="pt-2">
            <button
              onClick={onStartNewAssessment}
              className="px-6 py-3 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold uppercase tracking-wider shadow-sm inline-flex items-center space-x-2 transition-all hover:scale-102"
            >
              <span>Start First Assessment →</span>
            </button>
          </div>
        </div>
      )}

      {/* Historical Report Snapshot Viewer Modal */}
      <SavedReportDetailModal
        report={selectedReport}
        isOpen={Boolean(selectedReport)}
        onClose={() => setSelectedReport(null)}
        onReassess={handleReassess}
      />

    </div>
  );
}
