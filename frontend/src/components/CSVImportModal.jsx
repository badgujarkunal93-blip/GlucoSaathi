import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, UploadCloud, FileText, CheckCircle2, AlertTriangle, ArrowRight, Table } from 'lucide-react';

export default function CSVImportModal({ isOpen, onClose }) {
  const { setHistory, setGlucoseLogs } = useApp();

  const [file, setFile] = useState(null);
  const [parsing, setParsing] = useState(false);
  const [parsedData, setParsedData] = useState(null);
  const [error, setError] = useState(null);
  const [importedSuccess, setImportedSuccess] = useState(false);

  if (!isOpen) return null;

  const handleFileChange = (e) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;

    setFile(selectedFile);
    setError(null);
    setParsing(true);

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);

        if (lines.length < 2) {
          throw new Error('CSV must contain a header row and at least one data row.');
        }

        const headers = lines[0].toLowerCase().split(',').map(h => h.trim().replace(/['"]/g, ''));
        const glucoseIdx = headers.findIndex(h => h.includes('glucose') || h === 'bg' || h === 'sgv');
        const timestampIdx = headers.findIndex(h => h.includes('time') || h.includes('date') || h === 'timestamp');
        const insulinIdx = headers.findIndex(h => h.includes('insulin') || h.includes('bolus') || h === 'iob');
        const carbsIdx = headers.findIndex(h => h.includes('carb') || h.includes('cho') || h === 'meal');
        const stepsIdx = headers.findIndex(h => h.includes('step') || h.includes('activity'));

        if (glucoseIdx === -1 && timestampIdx === -1) {
          throw new Error('Could not identify valid glucose or timestamp columns. Expected headers: timestamp, glucose, insulin, carbs');
        }

        const rows = [];
        let validGlucoseCount = 0;
        let glucoseSum = 0;
        let hypoCount = 0;

        for (let i = 1; i < lines.length; i++) {
          const cols = lines[i].split(',').map(c => c.trim().replace(/['"]/g, ''));
          if (cols.length < headers.length) continue;

          const rawGlucose = glucoseIdx !== -1 ? Number(cols[glucoseIdx]) : NaN;
          const rawTime = timestampIdx !== -1 ? cols[timestampIdx] : new Date().toISOString();
          const rawInsulin = insulinIdx !== -1 ? Number(cols[insulinIdx]) : 0;
          const rawCarbs = carbsIdx !== -1 ? Number(cols[carbsIdx]) : 0;
          const rawSteps = stepsIdx !== -1 ? cols[stepsIdx] : 'light';

          if (!isNaN(rawGlucose) && rawGlucose > 20 && rawGlucose < 600) {
            validGlucoseCount++;
            glucoseSum += rawGlucose;
            if (rawGlucose < 70) hypoCount++;

            rows.push({
              id: `csv-${Date.now()}-${i}`,
              timestamp: rawTime,
              glucose: rawGlucose,
              insulin: isNaN(rawInsulin) ? 0 : rawInsulin,
              carbs: isNaN(rawCarbs) ? 0 : rawCarbs,
              steps: rawSteps
            });
          }
        }

        if (rows.length === 0) {
          throw new Error('No valid glycemic rows found in uploaded file.');
        }

        setParsedData({
          totalRows: rows.length,
          avgGlucose: Math.round(glucoseSum / validGlucoseCount),
          hypoCount,
          previewRows: rows.slice(0, 5),
          fullRows: rows
        });
      } catch (err) {
        setError(err.message || 'Failed to parse CSV file.');
      } finally {
        setParsing(false);
      }
    };
    reader.readAsText(selectedFile);
  };

  const handleImport = () => {
    if (!parsedData || !parsedData.fullRows) return;

    // Convert CSV rows to History logs
    const newLogs = parsedData.fullRows.map((r, i) => ({
      id: `imported-${Date.now()}-${i}`,
      type: r.carbs > 0 ? 'meal' : r.insulin > 0 ? 'insulin' : 'glucose',
      timestamp: r.timestamp.includes('T') ? r.timestamp.split('T')[1].slice(0, 5) : r.timestamp,
      dayGroup: 'Imported History',
      title: r.carbs > 0 ? `Meal: ${r.carbs}g Carbs` : `Glucose: ${r.glucose} mg/dL`,
      value: r.glucose,
      carbs: r.carbs,
      amount: r.insulin,
      unit: 'mg/dL',
      trend: 'stable'
    }));

    setHistory(prev => [...newLogs.slice(0, 30), ...prev]);
    setGlucoseLogs(prev => [...parsedData.fullRows.slice(0, 30).map(r => ({ id: r.id, value: r.glucose, recordedAt: r.timestamp, mealRelation: 'cgm' })), ...prev]);
    
    setImportedSuccess(true);
    setTimeout(() => {
      setImportedSuccess(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in overflow-y-auto">
      <div className="w-full max-w-xl bg-white rounded-2xl border border-black/10 p-6 sm:p-8 shadow-2xl space-y-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-black/8 pb-4">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-[#DFF4E8] text-[#075B57] flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-xl font-extrabold text-[#063F3D] font-display">
                Import Glucose & Telemetry CSV
              </h3>
              <p className="text-xs text-[#66716F]">
                Load real longitudinal CGM, insulin, meal, and activity history
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 rounded-lg text-[#66716F] hover:bg-[#F3F1EA] transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Upload Zone */}
        {!parsedData && (
          <div className="space-y-4">
            <label className="border-2 border-dashed border-black/15 hover:border-[#075B57] rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer bg-[#F7F8F5] transition-colors text-center space-y-2">
              <UploadCloud className="w-8 h-8 text-[#075B57]" />
              <span className="text-sm font-bold text-[#063F3D]">
                Click or drag your CGM / Health CSV here
              </span>
              <span className="text-xs text-[#66716F]">
                Supported columns: timestamp, glucose, insulin, carbs, steps, activity
              </span>
              <input type="file" accept=".csv,text/csv" onChange={handleFileChange} className="hidden" />
            </label>

            {error && (
              <div className="p-3 rounded-xl bg-[#FDE8E9] border border-[#FFB4A8] text-xs text-[#C84B52] flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}
          </div>
        )}

        {/* Parsed Summary Preview */}
        {parsedData && (
          <div className="space-y-4 text-xs">
            <div className="grid grid-cols-3 gap-3 p-4 rounded-xl bg-[#F7F8F5] border border-black/5 text-center">
              <div>
                <span className="text-[#66716F] block uppercase font-bold text-[10px]">Readings</span>
                <span className="text-lg font-black text-[#063F3D]">{parsedData.totalRows}</span>
              </div>
              <div>
                <span className="text-[#66716F] block uppercase font-bold text-[10px]">Mean Glucose</span>
                <span className="text-lg font-black text-[#075B57]">{parsedData.avgGlucose} mg/dL</span>
              </div>
              <div>
                <span className="text-[#66716F] block uppercase font-bold text-[10px]">Hypo Dips (&lt;70)</span>
                <span className="text-lg font-black text-[#C84B52]">{parsedData.hypoCount}</span>
              </div>
            </div>

            {/* Table Preview */}
            <div className="space-y-1.5">
              <span className="font-bold text-[#063F3D] block">Data Preview (First 5 records):</span>
              <div className="overflow-x-auto border border-black/8 rounded-xl">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#F3F1EA] text-[#063F3D] text-[10px] uppercase font-bold">
                      <th className="p-2">Timestamp</th>
                      <th className="p-2">Glucose</th>
                      <th className="p-2">Insulin</th>
                      <th className="p-2">Carbs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-black/5 text-[11px]">
                    {parsedData.previewRows.map((r, i) => (
                      <tr key={i}>
                        <td className="p-2 text-[#66716F]">{r.timestamp}</td>
                        <td className="p-2 font-bold text-[#063F3D]">{r.glucose} mg/dL</td>
                        <td className="p-2 text-[#66716F]">{r.insulin} U</td>
                        <td className="p-2 text-[#66716F]">{r.carbs} g</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-between pt-4 border-t border-black/8">
              <button
                type="button"
                onClick={() => { setParsedData(null); setFile(null); }}
                className="px-4 py-2 rounded-xl bg-[#F7F8F5] text-xs font-bold text-[#66716F] hover:bg-[#F3F1EA]"
              >
                Choose Different File
              </button>

              <button
                type="button"
                onClick={handleImport}
                className="px-5 py-2.5 rounded-xl bg-[#075B57] hover:bg-[#063F3D] text-white text-xs font-extrabold shadow-xs flex items-center space-x-1.5"
              >
                {importedSuccess ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-[#1E9E67]" />
                    <span>Imported Successfully!</span>
                  </>
                ) : (
                  <>
                    <span>Import into Health History</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
