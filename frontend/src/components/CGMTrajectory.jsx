import React, { useState, useMemo } from 'react';
import { 
  Activity, 
  TrendingDown, 
  TrendingUp, 
  Minus, 
  AlertTriangle, 
  CheckCircle2, 
  Utensils, 
  Syringe, 
  Flame, 
  ShieldAlert,
  Info,
  Layers
} from 'lucide-react';
import { generateDynamicTrajectory } from '../lib/forecast/forecastEngine';

/**
 * Continuous Glucose Monitoring (CGM) Trajectory Chart
 * Dynamically generated from Stage 01 Patient Input parameters
 * Displays: -60m History -> NOW -> +30m Forecast with Prediction Uncertainty Interval
 */
export default function CGMTrajectory({
  currentGlucose = 108,
  trend = 'slow_fall',
  iob = 0.8,
  recentCarbs = 68,
  mealName = '2 Rotis + Dal Tadka',
  activityLevel = 'Light',
  targetMin = 70,
  targetMax = 140,
  cgmHistory = null,
  forecastGlucose = null,
  hypoProbability = null
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Compute dynamic trajectory points using the forecast engine
  const {
    historyPoints,
    forecastPoints,
    uncertaintyBand,
    predicted30mGlucose,
    hasRealHistory,
    isElevatedHypoRisk
  } = useMemo(() => {
    return generateDynamicTrajectory({
      currentGlucose,
      trend,
      activeInsulin: iob,
      mealCarbs: recentCarbs,
      activityLevel,
      cgmHistory,
      targetMin,
      targetMax
    });
  }, [currentGlucose, trend, iob, recentCarbs, activityLevel, cgmHistory, targetMin, targetMax]);

  // Contextual Event Markers based on actual patient inputs
  const markers = useMemo(() => [
    {
      timeOffset: -45,
      type: 'meal',
      title: mealName || 'Recorded Meal',
      detail: `${recentCarbs}g Carbs`,
      icon: '🍛',
      color: '#8D4023',
      bg: '#FFE0D1'
    },
    {
      timeOffset: -45,
      type: 'insulin',
      title: 'Active Insulin (IOB)',
      detail: `${iob} U Active`,
      icon: '💉',
      color: '#075B57',
      bg: '#DFF4E8'
    },
    {
      timeOffset: -15,
      type: 'activity',
      title: 'Physical Activity',
      detail: `${activityLevel} Movement`,
      icon: '🏃',
      color: '#B25E00',
      bg: '#FEF7E6'
    }
  ], [mealName, recentCarbs, iob, activityLevel]);

  // Chart dimensions & dynamic scaling
  const chartWidth = 720;
  const chartHeight = 240;
  const padding = { top: 24, right: 30, bottom: 36, left: 45 };

  const minTime = -60;
  const maxTime = 30;

  // Adapt vertical range dynamically if glucose is very low or very high
  const allValues = [
    ...historyPoints.map(p => p.value),
    ...forecastPoints.map(p => p.upperBound),
    ...forecastPoints.map(p => p.lowerBound),
    Number(currentGlucose) || 108
  ];
  const lowestVal = Math.min(...allValues);
  const highestVal = Math.max(...allValues);

  const minGlucose = Math.max(30, Math.min(50, Math.floor(lowestVal / 10) * 10 - 10));
  const maxGlucose = Math.min(380, Math.max(190, Math.ceil(highestVal / 10) * 10 + 10));

  const scaleX = (timeOffset) => {
    return padding.left + ((timeOffset - minTime) / (maxTime - minTime)) * (chartWidth - padding.left - padding.right);
  };

  const scaleY = (val) => {
    const clamped = Math.max(minGlucose, Math.min(maxGlucose, val));
    return chartHeight - padding.bottom - ((clamped - minGlucose) / (maxGlucose - minGlucose)) * (chartHeight - padding.top - padding.bottom);
  };

  // Build SVG Paths
  const historyPath = useMemo(() => {
    if (!historyPoints.length) return '';
    return historyPoints.reduce((acc, pt, i) => {
      const x = scaleX(pt.timeOffset);
      const y = scaleY(pt.value);
      return i === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
    }, '');
  }, [historyPoints, minGlucose, maxGlucose]);

  const forecastPath = useMemo(() => {
    const nowPt = historyPoints[historyPoints.length - 1];
    if (!nowPt || !forecastPoints.length) return '';
    
    let path = `M ${scaleX(0)} ${scaleY(nowPt.value)}`;
    forecastPoints.forEach(pt => {
      path += ` L ${scaleX(pt.timeOffset)} ${scaleY(pt.value)}`;
    });
    return path;
  }, [historyPoints, forecastPoints, minGlucose, maxGlucose]);

  const bandAreaPath = useMemo(() => {
    const nowPt = historyPoints[historyPoints.length - 1];
    if (!nowPt || !uncertaintyBand.length) return '';

    let topPath = `M ${scaleX(0)} ${scaleY(nowPt.value)}`;
    uncertaintyBand.forEach(pt => {
      topPath += ` L ${scaleX(pt.timeOffset)} ${scaleY(pt.upper)}`;
    });

    let bottomPath = '';
    for (let i = uncertaintyBand.length - 1; i >= 0; i--) {
      const pt = uncertaintyBand[i];
      bottomPath += ` L ${scaleX(pt.timeOffset)} ${scaleY(pt.lower)}`;
    }
    bottomPath += ` L ${scaleX(0)} ${scaleY(nowPt.value)} Z`;

    return topPath + bottomPath;
  }, [historyPoints, uncertaintyBand, minGlucose, maxGlucose]);

  // Target Band & Hypo Line coordinates
  const targetTopY = scaleY(targetMax);
  const targetBottomY = scaleY(targetMin);
  const hypoY = scaleY(targetMin);

  return (
    <div className="w-full bg-white rounded-2xl border border-black/8 shadow-sm p-4 sm:p-6 space-y-4">
      {/* 1. Header with Live Telemetry & Forecast Summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-3">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-xl bg-[#075B57] text-white flex items-center justify-center shadow-xs">
            <Activity className="w-4 h-4 text-[#DFF4E8]" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-extrabold text-[#063F3D] font-display">
                Continuous Glucose Trajectory
              </h3>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#DFF4E8] text-[#075B57]">
                LIVE MODEL OUTPUT
              </span>
            </div>
            <span className="text-[11px] text-[#66716F]">
              {hasRealHistory ? 'Real CGM Sensor Stream' : 'Mathematically Simulated Pre-Meal Baseline'} • -60m to +30m Horizon
            </span>
          </div>
        </div>

        {/* Dynamic Metric Badges */}
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-[#66716F] block">
              Current Telemetry
            </span>
            <span className="text-base font-black text-[#063F3D] font-display">
              {currentGlucose} <span className="text-[11px] font-bold text-[#66716F]">mg/dL</span>
            </span>
          </div>

          <div className="h-6 w-px bg-black/10" />

          <div className="text-right">
            <span className="text-[10px] font-bold uppercase text-[#66716F] block">
              Expected +30m
            </span>
            <span className={`text-base font-black font-display ${isElevatedHypoRisk ? 'text-[#C84B52]' : 'text-[#075B57]'}`}>
              ~{predicted30mGlucose} <span className="text-[11px] font-bold text-[#66716F]">mg/dL</span>
            </span>
          </div>
        </div>
      </div>

      {/* 2. Responsive SVG Chart Area */}
      <div className="relative w-full overflow-x-auto pb-2">
        <svg
          viewBox={`0 0 ${chartWidth} ${chartHeight}`}
          className="w-full min-w-[580px] h-auto select-none"
        >
          <defs>
            {/* Target In-Range Safe Fill */}
            <linearGradient id="targetBandGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E9E67" stopOpacity="0.07" />
              <stop offset="100%" stopColor="#1E9E67" stopOpacity="0.04" />
            </linearGradient>

            {/* Prediction Uncertainty Band Fill */}
            <linearGradient id="uncertaintyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#00A8A8" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#00A8A8" stopOpacity="0.06" />
            </linearGradient>

            {/* Hypoglycemia Critical Fill */}
            <linearGradient id="hypoZoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C84B52" stopOpacity="0.12" />
              <stop offset="100%" stopColor="#C84B52" stopOpacity="0.04" />
            </linearGradient>
          </defs>

          {/* Grid Background Lines (Y-Axis) */}
          {[60, 70, 100, 140, 180].map(val => {
            if (val < minGlucose || val > maxGlucose) return null;
            const y = scaleY(val);
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke="#E8ECEB"
                  strokeWidth="1"
                  strokeDasharray={val === 70 || val === 140 ? '3 3' : 'none'}
                />
                <text
                  x={padding.left - 6}
                  y={y + 3.5}
                  textAnchor="end"
                  fontSize="9"
                  fontWeight="600"
                  fill="#8A9694"
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* Hypoglycemia Critical Region (<70) */}
          <rect
            x={padding.left}
            y={hypoY}
            width={chartWidth - padding.left - padding.right}
            height={scaleY(minGlucose) - hypoY}
            fill="url(#hypoZoneGrad)"
          />

          {/* In-Range Target Region (70 - 140) */}
          <rect
            x={padding.left}
            y={targetTopY}
            width={chartWidth - padding.left - padding.right}
            height={Math.max(0, targetBottomY - targetTopY)}
            fill="url(#targetBandGrad)"
          />

          {/* Critical Threshold Line (70 mg/dL) */}
          <line
            x1={padding.left}
            y1={hypoY}
            x2={chartWidth - padding.right}
            y2={hypoY}
            stroke="#C84B52"
            strokeWidth="1.2"
            strokeDasharray="4 3"
          />
          <text
            x={chartWidth - padding.right}
            y={hypoY - 4}
            textAnchor="end"
            fontSize="8.5"
            fontWeight="bold"
            fill="#C84B52"
          >
            HYPO THRESHOLD (&lt;70 mg/dL)
          </text>

          {/* Vertical NOW Dividing Line (t = 0) */}
          <line
            x1={scaleX(0)}
            y1={padding.top}
            x2={scaleX(0)}
            y2={chartHeight - padding.bottom}
            stroke="#075B57"
            strokeWidth="1.5"
            strokeDasharray="2 2"
          />
          <text
            x={scaleX(0)}
            y={padding.top - 6}
            textAnchor="middle"
            fontSize="9"
            fontWeight="bold"
            fill="#075B57"
          >
            NOW ({currentGlucose} mg/dL)
          </text>

          {/* Uncertainty Band Area (NOW -> +30m) */}
          <path
            d={bandAreaPath}
            fill="url(#uncertaintyGrad)"
            stroke="#00A8A8"
            strokeWidth="0.8"
            strokeDasharray="2 2"
            strokeOpacity="0.4"
          />

          {/* Historical Glucose Curve (-60m to NOW) */}
          <path
            d={historyPath}
            fill="none"
            stroke="#075B57"
            strokeWidth="2.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Forecasted Trajectory Curve (NOW to +30m) */}
          <path
            d={forecastPath}
            fill="none"
            stroke={isElevatedHypoRisk ? "#C84B52" : "#00A8A8"}
            strokeWidth="2.8"
            strokeDasharray="4 3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Event Markers on Timeline */}
          {markers.map((mk, idx) => {
            const x = scaleX(mk.timeOffset);
            return (
              <g key={idx} className="cursor-pointer">
                <line
                  x1={x}
                  y1={padding.top + 8}
                  x2={x}
                  y2={chartHeight - padding.bottom}
                  stroke={mk.color}
                  strokeWidth="1"
                  strokeDasharray="1 3"
                  strokeOpacity="0.6"
                />
                <circle cx={x} cy={padding.top + 8} r="5" fill={mk.bg} stroke={mk.color} strokeWidth="1.2" />
                <text x={x} y={padding.top + 11} textAnchor="middle" fontSize="6.5">
                  {mk.icon}
                </text>
              </g>
            );
          })}

          {/* Interactive Historical Points */}
          {historyPoints.map((pt, i) => {
            const x = scaleX(pt.timeOffset);
            const y = scaleY(pt.value);
            const isNow = pt.timeOffset === 0;
            const isHovered = hoveredPoint?.timeOffset === pt.timeOffset;

            return (
              <g key={`h-${i}`}>
                <circle
                  cx={x}
                  cy={y}
                  r={isNow ? 5.5 : isHovered ? 4.5 : 2.5}
                  fill={isNow ? "#075B57" : "#FFFFFF"}
                  stroke="#075B57"
                  strokeWidth={isNow ? 2.5 : 1.5}
                  className="transition-all cursor-pointer"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
                {/* Large NOW Pulse Ring */}
                {isNow && (
                  <circle
                    cx={x}
                    cy={y}
                    r="9"
                    fill="none"
                    stroke="#1E9E67"
                    strokeWidth="1"
                    className="animate-ping"
                    opacity="0.6"
                  />
                )}
              </g>
            );
          })}

          {/* Interactive Forecast Points */}
          {forecastPoints.map((pt, i) => {
            const x = scaleX(pt.timeOffset);
            const y = scaleY(pt.value);
            const isHovered = hoveredPoint?.timeOffset === pt.timeOffset;

            return (
              <circle
                key={`f-${i}`}
                cx={x}
                cy={y}
                r={isHovered ? 4.5 : 2.8}
                fill={pt.isHypoRisk ? "#FDE8E9" : "#FFFFFF"}
                stroke={pt.isHypoRisk ? "#C84B52" : "#00A8A8"}
                strokeWidth="1.8"
                className="transition-all cursor-pointer"
                onMouseEnter={() => setHoveredPoint(pt)}
                onMouseLeave={() => setHoveredPoint(null)}
              />
            );
          })}

          {/* X-Axis Time Labels */}
          {[-60, -45, -30, -15, 0, 15, 30].map(t => (
            <text
              key={t}
              x={scaleX(t)}
              y={chartHeight - padding.bottom + 16}
              textAnchor="middle"
              fontSize="9"
              fontWeight={t === 0 ? "bold" : "500"}
              fill={t === 0 ? "#075B57" : "#8A9694"}
            >
              {t === 0 ? 'NOW' : t < 0 ? `${t}m` : `+${t}m`}
            </text>
          ))}
        </svg>

        {/* Floating Tooltip */}
        {hoveredPoint && (
          <div 
            className="absolute z-20 pointer-events-none p-2.5 rounded-xl bg-[#063F3D] text-white text-xs shadow-lg space-y-0.5 -translate-x-1/2 -translate-y-full"
            style={{
              left: `${((scaleX(hoveredPoint.timeOffset)) / chartWidth) * 100}%`,
              top: `${((scaleY(hoveredPoint.value)) / chartHeight) * 100}%`,
              marginTop: '-12px'
            }}
          >
            <div className="text-[10px] text-[#DFF4E8] font-bold flex items-center justify-between gap-3">
              <span>{hoveredPoint.timeOffset === 0 ? 'NOW' : hoveredPoint.timeOffset < 0 ? `${hoveredPoint.timeOffset} min` : `+${hoveredPoint.timeOffset} min`}</span>
              <span className="text-[9px] opacity-75">{hoveredPoint.timestamp}</span>
            </div>
            <div className="text-sm font-black font-display text-white">
              {hoveredPoint.value} <span className="text-[10px] font-normal text-[#DFF4E8]">mg/dL</span>
            </div>
            {hoveredPoint.isForecast ? (
              <div className="text-[10px] text-[#00E5E5] font-semibold">
                Uncertainty: [{hoveredPoint.lowerBound} – {hoveredPoint.upperBound} mg/dL]
              </div>
            ) : (
              <div className="text-[9px] text-[#DFF4E8]/80">
                Source: {hoveredPoint.source || 'Telemetry'}
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Legend & Scientific Metadata */}
      <div className="pt-2 border-t border-black/5 flex flex-wrap items-center justify-between gap-3 text-xs text-[#66716F]">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-1 rounded-full bg-[#075B57]" />
            <span className="font-semibold text-[#063F3D]">Historical Trend</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-1 rounded-full bg-[#00A8A8] border-b border-dashed border-white" />
            <span className="font-semibold text-[#063F3D]">+30m Model Forecast</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-2 rounded bg-[#00A8A8]/20 border border-[#00A8A8]/40" />
            <span className="font-semibold text-[#063F3D]">Prediction Uncertainty Interval</span>
          </div>

          <div className="flex items-center space-x-1.5">
            <span className="w-3.5 h-1 bg-[#C84B52]" />
            <span className="font-semibold text-[#C84B52]">Hypo Threshold (&lt;70)</span>
          </div>
        </div>

        <div className="flex items-center space-x-1 text-[11px] text-[#66716F]">
          <Info className="w-3.5 h-3.5" />
          <span>Prototype clinical decision support. Not autonomous medical diagnosis.</span>
        </div>
      </div>
    </div>
  );
}
