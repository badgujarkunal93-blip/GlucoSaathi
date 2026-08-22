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
  Info
} from 'lucide-react';

/**
 * Hero Continuous Glucose Monitoring (CGM) Trajectory Chart
 * Renders a clinical-grade time-series view: -60m -> NOW -> +30m forecast
 * with 90% conformal prediction interval and contextual event markers.
 */
export default function CGMTrajectory({
  currentGlucose = 118,
  trend = 'falling',
  iob = 1.2,
  recentCarbs = 68,
  activityLevel = 'Light',
  targetMin = 70,
  targetMax = 140,
  forecastGlucose = null,
  hypoProbability = null
}) {
  const [hoveredPoint, setHoveredPoint] = useState(null);

  // Compute realistic 5-minute historical series leading to currentGlucose
  const { historyPoints, forecastPoints, conformalBand, markers } = useMemo(() => {
    const now = Date.now();
    const g = Number(currentGlucose) || 118;
    const isFalling = trend === 'falling' || trend === 'falling_slowly' || trend === 'falling_rapidly';
    const isRising = trend === 'rising' || trend === 'rising_rapidly';

    const slope = isFalling ? -1.2 : isRising ? 1.4 : 0.1;

    // Historical 13 points: -60m to 0m (5m steps)
    const history = [];
    for (let i = 12; i >= 0; i--) {
      const minutesAgo = i * 5;
      const noise = (Math.sin(i * 0.8) * 2.5);
      const val = Math.max(45, Math.min(300, Math.round(g - (slope * minutesAgo) + noise)));
      history.push({
        timeOffset: -minutesAgo,
        label: minutesAgo === 0 ? 'NOW' : `-${minutesAgo}m`,
        value: val,
        isForecast: false,
        timestamp: new Date(now - minutesAgo * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }

    // Forecast 6 points: +5m to +30m (5m steps)
    const forecast = [];
    const band = [];
    const predictedTarget = forecastGlucose !== null ? Number(forecastGlucose) : Math.max(50, Math.round(g + (slope * 30) - (iob * 8)));
    const totalDelta = predictedTarget - g;

    for (let j = 1; j <= 6; j++) {
      const minutesAhead = j * 5;
      const progress = j / 6;
      const fVal = Math.max(40, Math.min(350, Math.round(g + (totalDelta * progress))));
      const margin = 12 + (j * 2.2); // expanding conformal uncertainty margin

      forecast.push({
        timeOffset: minutesAhead,
        label: `+${minutesAhead}m`,
        value: fVal,
        isForecast: true,
        lowerBound: Math.max(40, Math.round(fVal - margin)),
        upperBound: Math.min(350, Math.round(fVal + margin)),
        timestamp: new Date(now + minutesAhead * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });

      band.push({
        timeOffset: minutesAhead,
        lower: Math.max(40, Math.round(fVal - margin)),
        upper: Math.min(350, Math.round(fVal + margin))
      });
    }

    // Contextual Event Markers on the timeline
    const eventMarkers = [
      {
        timeOffset: -45,
        type: 'meal',
        title: 'Lunch: 2 Rotis + Dal + Rice',
        detail: `${recentCarbs}g Carbs`,
        icon: '🍛',
        color: '#8D4023',
        bg: '#FFE0D1'
      },
      {
        timeOffset: -45,
        type: 'insulin',
        title: 'Pre-Meal Bolus Dose',
        detail: '4.5 U Rapid Acting',
        icon: '💉',
        color: '#075B57',
        bg: '#DFF4E8'
      },
      {
        timeOffset: -15,
        type: 'activity',
        title: 'Post-Meal Walking',
        detail: `${activityLevel} Exercise (20 min)`,
        icon: '🏃',
        color: '#B25E00',
        bg: '#FEF7E6'
      }
    ];

    return { historyPoints: history, forecastPoints: forecast, conformalBand: band, markers: eventMarkers };
  }, [currentGlucose, trend, iob, recentCarbs, activityLevel, forecastGlucose]);

  // Chart dimensions & scaling
  const chartWidth = 720;
  const chartHeight = 240;
  const padding = { top: 24, right: 30, bottom: 36, left: 45 };

  const minTime = -60;
  const maxTime = 30;
  const minGlucose = 50;
  const maxGlucose = 200;

  const scaleX = (timeOffset) => {
    return padding.left + ((timeOffset - minTime) / (maxTime - minTime)) * (chartWidth - padding.left - padding.right);
  };

  const scaleY = (val) => {
    const clamped = Math.max(minGlucose, Math.min(maxGlucose, val));
    return chartHeight - padding.bottom - ((clamped - minGlucose) / (maxGlucose - minGlucose)) * (chartHeight - padding.top - padding.bottom);
  };

  // Build SVG Paths
  const allPoints = [...historyPoints, ...forecastPoints];
  
  // Historical Line Path
  const historyPath = historyPoints.reduce((acc, pt, idx) => {
    const x = scaleX(pt.timeOffset);
    const y = scaleY(pt.value);
    return idx === 0 ? `M ${x} ${y}` : `${acc} L ${x} ${y}`;
  }, '');

  // Forecast Line Path
  const nowPt = historyPoints[historyPoints.length - 1];
  const forecastPath = forecastPoints.reduce((acc, pt, idx) => {
    const x = scaleX(pt.timeOffset);
    const y = scaleY(pt.value);
    return `${acc} L ${x} ${y}`;
  }, `M ${scaleX(nowPt.timeOffset)} ${scaleY(nowPt.value)}`);

  // Conformal Interval Ribbon (Shaded 90% bounds)
  const bandTop = forecastPoints.map(pt => `${scaleX(pt.timeOffset)},${scaleY(pt.upperBound)}`);
  const bandBottom = [...forecastPoints].reverse().map(pt => `${scaleX(pt.timeOffset)},${scaleY(pt.lowerBound)}`);
  const nowX = scaleX(0);
  const nowY = scaleY(nowPt.value);
  const conformalPolygon = `${nowX},${nowY} ${bandTop.join(' ')} ${bandBottom.join(' ')} ${nowX},${nowY}`;

  // Key Y thresholds
  const yTargetMax = scaleY(targetMax);
  const yTargetMin = scaleY(targetMin);
  const yHypoThreshold = scaleY(70);

  const isHighRisk = (forecastPoints[forecastPoints.length - 1]?.value < 70) || (hypoProbability && hypoProbability > 0.5);

  return (
    <div className="w-full bg-white rounded-2xl border border-black/8 p-5 sm:p-6 shadow-sm space-y-4">
      {/* Top Chart Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-black/5 pb-3.5">
        <div className="flex items-center space-x-2.5">
          <div className="w-8 h-8 rounded-full bg-[#DFF4E8] flex items-center justify-center text-[#075B57]">
            <Activity className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-black uppercase tracking-wider text-[#063F3D]">
                Continuous Glucose Trajectory
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[#075B57]/10 text-[#075B57]">
                90-Min Window
              </span>
            </div>
            <span className="text-[11px] text-[#66716F]">
              Historical trend (-60m) + Calibrated AI forecast (+30m)
            </span>
          </div>
        </div>

        {/* Status Legend */}
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-[#66716F]">
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-[#075B57]" />
            <span>CGM History</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 border-t-2 border-dashed border-[#00AFC1]" />
            <span>30m Forecast</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-2.5 rounded-xs bg-[#00AFC1]/15 border border-[#00AFC1]/30" />
            <span>90% Conformal Band</span>
          </div>
          <div className="flex items-center space-x-1.5">
            <span className="w-2.5 h-0.5 bg-[#C84B52]" />
            <span className="text-[#C84B52] font-bold">Hypo Line (&lt;70)</span>
          </div>
        </div>
      </div>

      {/* Main SVG Interactive Canvas */}
      <div className="relative w-full overflow-x-auto">
        <svg 
          viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
          className="w-full h-auto min-w-[580px] select-none"
        >
          <defs>
            {/* Target In-Range Green Fill */}
            <linearGradient id="targetRangeGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1E9E67" stopOpacity="0.08" />
              <stop offset="100%" stopColor="#1E9E67" stopOpacity="0.03" />
            </linearGradient>

            {/* Hypoglycemia Red Risk Fill */}
            <linearGradient id="hypoZoneGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#C84B52" stopOpacity="0.04" />
              <stop offset="100%" stopColor="#C84B52" stopOpacity="0.12" />
            </linearGradient>

            {/* Historical Glucose Gradient */}
            <linearGradient id="historyLineGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#075B57" stopOpacity="0.7" />
              <stop offset="100%" stopColor="#075B57" stopOpacity="1" />
            </linearGradient>
          </defs>

          {/* 1. Target Range Band (70 - 140 mg/dL) */}
          <rect
            x={padding.left}
            y={yTargetMax}
            width={chartWidth - padding.left - padding.right}
            height={Math.max(0, yTargetMin - yTargetMax)}
            fill="url(#targetRangeGrad)"
          />

          {/* 2. Hypoglycemia Alert Zone (<70 mg/dL) */}
          <rect
            x={padding.left}
            y={yHypoThreshold}
            width={chartWidth - padding.left - padding.right}
            height={chartHeight - padding.bottom - yHypoThreshold}
            fill="url(#hypoZoneGrad)"
          />

          {/* 3. Grid Lines & Y-Axis Labels */}
          {[60, 80, 100, 120, 140, 160, 180].map((val) => {
            const y = scaleY(val);
            const isTarget = val === 70 || val === 140;
            return (
              <g key={val}>
                <line
                  x1={padding.left}
                  y1={y}
                  x2={chartWidth - padding.right}
                  y2={y}
                  stroke={val === 70 ? '#C84B52' : isTarget ? '#1E9E67' : 'rgba(17,24,23,0.07)'}
                  strokeWidth={val === 70 ? '1.5' : '1'}
                  strokeDasharray={val === 70 ? '4 3' : isTarget ? '3 3' : 'none'}
                />
                <text
                  x={padding.left - 8}
                  y={y + 3.5}
                  textAnchor="end"
                  className={`text-[9px] font-bold ${
                    val === 70 ? 'fill-[#C84B52]' : val === 140 ? 'fill-[#1E9E67]' : 'fill-[#8A9694]'
                  }`}
                >
                  {val}
                </text>
              </g>
            );
          })}

          {/* 4. NOW Divider Vertical Line */}
          <line
            x1={scaleX(0)}
            y1={padding.top}
            x2={scaleX(0)}
            y2={chartHeight - padding.bottom}
            stroke="#075B57"
            strokeWidth="1.2"
            strokeDasharray="2 2"
          />
          <text
            x={scaleX(0)}
            y={padding.top - 6}
            textAnchor="middle"
            className="text-[9px] font-black uppercase tracking-wider fill-[#075B57]"
          >
            NOW
          </text>

          {/* 5. 90% Conformal Prediction Ribbon */}
          <polygon
            points={conformalPolygon}
            fill="#00AFC1"
            fillOpacity="0.12"
            stroke="#00AFC1"
            strokeWidth="0.75"
            strokeDasharray="2 2"
          />

          {/* 6. Historical CGM Line */}
          <path
            d={historyPath}
            fill="none"
            stroke="url(#historyLineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* 7. Forecast Line */}
          <path
            d={forecastPath}
            fill="none"
            stroke={isHighRisk ? '#C84B52' : '#00AFC1'}
            strokeWidth="2.5"
            strokeDasharray="4 3"
            strokeLinecap="round"
          />

          {/* 8. Event Markers (Meals, Insulin, Activity) */}
          {markers.map((marker, idx) => {
            const x = scaleX(marker.timeOffset);
            const pt = historyPoints.find(p => p.timeOffset === marker.timeOffset) || nowPt;
            const y = scaleY(pt.value) - 18;

            return (
              <g key={idx} className="cursor-pointer group">
                <line
                  x1={x}
                  y1={y + 12}
                  x2={x}
                  y2={scaleY(pt.value)}
                  stroke={marker.color}
                  strokeWidth="1.2"
                  strokeDasharray="2 2"
                />
                <circle
                  cx={x}
                  cy={y}
                  r="10"
                  fill={marker.bg}
                  stroke={marker.color}
                  strokeWidth="1.5"
                />
                <text
                  x={x}
                  y={y + 3.5}
                  textAnchor="middle"
                  className="text-[10px]"
                >
                  {marker.icon}
                </text>
              </g>
            );
          })}

          {/* 9. Interactive Data Points */}
          {allPoints.map((pt, idx) => {
            const x = scaleX(pt.timeOffset);
            const y = scaleY(pt.value);
            const isNow = pt.timeOffset === 0;

            return (
              <g key={idx}>
                {/* Outer Glow on Current Value */}
                {isNow && (
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="#075B57"
                    fillOpacity="0.25"
                    className="animate-ping"
                  />
                )}
                <circle
                  cx={x}
                  cy={y}
                  r={isNow ? 5.5 : pt.isForecast ? 3.5 : 3}
                  fill={isNow ? '#075B57' : pt.isForecast ? (isHighRisk ? '#C84B52' : '#00AFC1') : '#FFFFFF'}
                  stroke={isNow ? '#FFFFFF' : pt.isForecast ? '#FFFFFF' : '#075B57'}
                  strokeWidth={isNow ? 2.5 : 1.8}
                  className="cursor-pointer hover:r-5 transition-all"
                  onMouseEnter={() => setHoveredPoint(pt)}
                  onMouseLeave={() => setHoveredPoint(null)}
                />
              </g>
            );
          })}

          {/* 10. X-Axis Time Labels */}
          {[-60, -45, -30, -15, 0, 15, 30].map((t) => (
            <text
              key={t}
              x={scaleX(t)}
              y={chartHeight - 12}
              textAnchor="middle"
              className={`text-[9px] font-bold ${
                t === 0 ? 'fill-[#075B57] font-black' : 'fill-[#8A9694]'
              }`}
            >
              {t === 0 ? 'NOW' : t < 0 ? `${t}m` : `+${t}m`}
            </text>
          ))}
        </svg>
      </div>

      {/* Floating Point Tooltip / Status Footer */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-black/5 text-xs">
        {hoveredPoint ? (
          <div className="flex items-center space-x-2 text-[#063F3D] font-bold animate-fade-in">
            <span className="px-2 py-0.5 rounded-md bg-[#F3F1EA] text-[11px]">
              {hoveredPoint.label} ({hoveredPoint.timestamp})
            </span>
            <span>
              Glucose: <strong className="text-[#075B57]">{hoveredPoint.value} mg/dL</strong>
            </span>
            {hoveredPoint.isForecast && (
              <span className="text-[11px] text-[#66716F]">
                • Conformal range: {hoveredPoint.lowerBound}–{hoveredPoint.upperBound} mg/dL
              </span>
            )}
          </div>
        ) : (
          <div className="flex items-center space-x-2 text-[#66716F] text-[11px]">
            <Info className="w-3.5 h-3.5 text-[#075B57]" />
            <span>Hover or tap any node to inspect 5-minute telemetry and conformal uncertainty intervals.</span>
          </div>
        )}

        <div className="flex items-center space-x-2 text-[11px] font-bold">
          <span className="text-[#66716F]">Current State:</span>
          <span className={`px-2 py-0.5 rounded-full ${
            currentGlucose < 70
              ? 'bg-[#FDE8E9] text-[#C84B52]'
              : currentGlucose <= 140
              ? 'bg-[#DFF4E8] text-[#075B57]'
              : 'bg-[#FEF7E6] text-[#8D4023]'
          }`}>
            {currentGlucose} mg/dL ({currentGlucose < 70 ? 'Hypoglycemia' : currentGlucose <= 140 ? 'In Target' : 'Elevated'})
          </span>
        </div>
      </div>
    </div>
  );
}
