import React, { useState } from 'react';
import { 
  FileText, 
  Calendar, 
  Clock, 
  Activity, 
  Utensils, 
  TrendingDown, 
  ShieldCheck, 
  AlertTriangle, 
  Trash2, 
  ArrowRight,
  Eye,
  RotateCcw
} from 'lucide-react';

export default function SavedReportCard({ report, onView, onReassess, onDelete }) {
  const [confirmDelete, setConfirmDelete] = useState(false);

  const formattedDate = report.createdAt 
    ? new Date(report.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })
    : 'Unknown Date';

  const formattedTime = report.createdAt 
    ? new Date(report.createdAt).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })
    : '';

  const riskLevel = report.prediction?.riskLevel || 'LOW';
  const riskScore = report.prediction?.riskScore !== undefined ? report.prediction.riskScore : 15;

  const getRiskBadge = (level) => {
    switch (level) {
      case 'CRITICAL':
      case 'HIGH':
        return {
          bg: '#FDE8E9',
          border: '#FFB4A8',
          text: '#C84B52',
          label: `HIGH RISK • ${riskScore}/100`
        };
      case 'MODERATE':
        return {
          bg: '#FEF7E6',
          border: '#FFE280',
          text: '#8D4023',
          label: `MODERATE • ${riskScore}/100`
        };
      default:
        return {
          bg: '#DFF4E8',
          border: '#B8E8D2',
          text: '#075B57',
          label: `LOW RISK • ${riskScore}/100`
        };
    }
  };

  const badge = getRiskBadge(riskLevel);

  return (
    <div className="editorial-card p-6 bg-white border border-black/8 hover:border-[#075B57] transition-all space-y-4 shadow-sm relative group flex flex-col justify-between">
      
      {/* 1. Card Top Bar: Patient & Timestamp */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#DFF4E8] text-[#075B57] flex items-center justify-center font-black">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-sm font-extrabold text-[#063F3D] font-display">
                {report.patient?.name || 'Patient Assessment'}
              </h4>
              <span className="text-[11px] text-[#66716F]">
                {report.patient?.age ? `${report.patient.age} yrs` : 'Type 1 Diabetes'} • {report.patient?.diagnosis || 'T1D'}
              </span>
            </div>
          </div>

          {/* Risk Level Badge */}
          <span 
            className="px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider border shadow-2xs"
            style={{ backgroundColor: badge.bg, borderColor: badge.border, color: badge.text }}
          >
            {badge.label}
          </span>
        </div>

        {/* Assessment Timestamp */}
        <div className="flex items-center space-x-1.5 text-[11px] text-[#66716F] pt-1">
          <Calendar className="w-3.5 h-3.5" />
          <span>{formattedDate}</span>
          <span>•</span>
          <Clock className="w-3.5 h-3.5" />
          <span>{formattedTime}</span>
        </div>
      </div>

      {/* 2. Key Telemetry Grid */}
      <div className="grid grid-cols-3 gap-2 py-3 border-y border-black/5 bg-[#F7F8F5] p-3 rounded-xl text-center">
        <div>
          <span className="text-[9px] font-bold text-[#66716F] uppercase block">
            Glucose
          </span>
          <span className="text-base font-black text-[#063F3D] font-display">
            {report.clinicalParameters?.glucose || 108} <span className="text-[9px] font-normal text-[#66716F]">mg/dL</span>
          </span>
        </div>

        <div>
          <span className="text-[9px] font-bold text-[#66716F] uppercase block">
            Meal Carbs
          </span>
          <span className="text-base font-black text-[#8D4023] font-display">
            {report.meal?.estimatedCarbs || 68} <span className="text-[9px] font-normal text-[#66716F]">g</span>
          </span>
        </div>

        <div>
          <span className="text-[9px] font-bold text-[#66716F] uppercase block">
            +30m Forecast
          </span>
          <span className="text-base font-black text-[#075B57] font-display">
            ~{report.prediction?.forecast30Min || 98} <span className="text-[9px] font-normal text-[#66716F]">mg/dL</span>
          </span>
        </div>
      </div>

      {/* Meal & Clinical Context summary */}
      <div className="text-xs text-[#66716F] line-clamp-1">
        <span className="font-bold text-[#063F3D]">Meal:</span> {report.meal?.description || '2 rotis + dal tadka'}
      </div>

      {/* 3. Action Buttons */}
      <div className="pt-2 flex items-center justify-between gap-2">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onView(report)}
            className="px-3.5 py-2 rounded-xl bg-[#F3F1EA] hover:bg-[#EAE6DC] text-xs font-bold text-[#063F3D] flex items-center space-x-1.5 transition-colors cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-[#075B57]" />
            <span>View Report</span>
          </button>

          <button
            onClick={() => onReassess(report)}
            className="px-3.5 py-2 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold flex items-center space-x-1.5 transition-all shadow-xs hover:scale-102 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reassess →</span>
          </button>
        </div>

        {/* Delete Confirmation */}
        {confirmDelete ? (
          <div className="flex items-center space-x-1 animate-fade-in">
            <button
              onClick={() => onDelete(report.id)}
              className="px-2 py-1 rounded-lg bg-[#C84B52] text-white text-[10px] font-bold hover:bg-[#A8373E]"
            >
              Confirm
            </button>
            <button
              onClick={() => setConfirmDelete(false)}
              className="px-2 py-1 rounded-lg bg-gray-200 text-gray-700 text-[10px] font-bold"
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-2 rounded-xl text-[#66716F]/60 hover:text-[#C84B52] hover:bg-[#FDE8E9] transition-colors"
            title="Delete this report"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        )}
      </div>

    </div>
  );
}
