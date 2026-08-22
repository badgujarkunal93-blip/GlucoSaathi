/**
 * GlucoSaathi Dynamic Glucose Trajectory & Forecast Engine
 * Calculates historical and short-term (+30 min) continuous glycemic trajectories
 * using multi-factor physiological feature engineering (Glucose Momentum, Active IOB,
 * Carbohydrate Absorption Kinetics, and Physical Activity Modifiers).
 */

export const TREND_SLOPES = {
  rapid_fall: -2.2,     // mg/dL per 5-min step (~ -26 mg/dL / hr)
  falling_rapidly: -2.2,
  slow_fall: -1.1,      // mg/dL per 5-min step (~ -13 mg/dL / hr)
  falling_slowly: -1.1,
  falling: -1.1,
  stable: 0.0,          // steady
  slow_rise: 1.1,       // mg/dL per 5-min step
  rising_slowly: 1.1,
  rising: 1.1,
  rapid_rise: 2.2,      // mg/dL per 5-min step
  rising_rapidly: 2.2
};

export const ACTIVITY_MODIFIERS = {
  Resting: 0,
  Light: -4,           // small downward pressure over 30 min
  Moderate: -12,       // moderate muscular glucose uptake
  Intense: -22         // strong acute glucose consumption
};

/**
 * Generates a full 90-minute trajectory (-60m to +30m)
 * @param {Object} params
 * @param {number} params.currentGlucose - Current mg/dL reading
 * @param {string} params.trend - Trend direction
 * @param {number} params.activeInsulin - Active IOB in Units
 * @param {number} params.mealCarbs - Total meal carbohydrates in grams
 * @param {string} params.activityLevel - Resting | Light | Moderate | Intense
 * @param {Array} [params.cgmHistory] - Optional real CGM timestamp/glucose records
 * @param {number} [params.targetMin=70]
 * @param {number} [params.targetMax=140]
 */
export function generateDynamicTrajectory({
  currentGlucose = 108,
  trend = 'slow_fall',
  activeInsulin = 0.8,
  mealCarbs = 68,
  activityLevel = 'Light',
  cgmHistory = null,
  targetMin = 70,
  targetMax = 140
}) {
  const g = Number(currentGlucose) || 108;
  const iob = Number(activeInsulin) || 0;
  const carbs = Number(mealCarbs) || 0;
  const now = Date.now();

  const slope = TREND_SLOPES[trend] !== undefined ? TREND_SLOPES[trend] : -0.8;
  const actMod = ACTIVITY_MODIFIERS[activityLevel] || 0;

  // -------------------------------------------------------------
  // 1. HISTORICAL TRAJECTORY (-60m to NOW, 5-minute intervals)
  // -------------------------------------------------------------
  const historyPoints = [];
  const hasRealHistory = Array.isArray(cgmHistory) && cgmHistory.length >= 5;

  if (hasRealHistory) {
    // Normalize real CGM history records
    const recent = cgmHistory.slice(-13);
    recent.forEach((pt, idx) => {
      const minutesAgo = (recent.length - 1 - idx) * 5;
      historyPoints.push({
        timeOffset: -minutesAgo,
        label: minutesAgo === 0 ? 'NOW' : `-${minutesAgo}m`,
        value: Number(pt.glucose) || g,
        isForecast: false,
        source: 'Real CGM Telemetry',
        timestamp: pt.timestamp ? new Date(pt.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : `-${minutesAgo}m`
      });
    });
  } else {
    // Generate mathematically continuous simulated pre-meal baseline leading to NOW = g
    for (let i = 12; i >= 0; i--) {
      const minutesAgo = i * 5;
      const noise = Math.sin(i * 0.75) * 1.8;
      const simVal = Math.max(40, Math.min(320, Math.round(g - (slope * i) + noise)));

      historyPoints.push({
        timeOffset: -minutesAgo,
        label: minutesAgo === 0 ? 'NOW' : `-${minutesAgo}m`,
        value: i === 0 ? g : simVal,
        isForecast: false,
        source: 'Simulated baseline',
        timestamp: new Date(now - minutesAgo * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      });
    }
  }

  // -------------------------------------------------------------
  // 2. SHORT-TERM FORECAST TRAJECTORY (NOW -> +30m)
  // -------------------------------------------------------------
  // Feature Interactions:
  // - Momentum delta: 6 steps of slope
  // - Insulin drop: - (IOB * 7.5 mg/dL)
  // - Carb buffer: + (Carbs / 15 * 6.5 mg/dL)
  // - Activity drop: actMod
  const momentumDelta = slope * 6;
  const insulinDrop = -(iob * 8.5);
  const carbRise = +(carbs > 0 ? (carbs / 15) * 6.0 : 0);
  const net30mDelta = momentumDelta + insulinDrop + carbRise + actMod;

  const predicted30mGlucose = Math.max(35, Math.min(380, Math.round(g + net30mDelta)));

  const forecastPoints = [];
  const uncertaintyBand = [];

  for (let j = 1; j <= 6; j++) {
    const minutesAhead = j * 5;
    const progress = j / 6;
    
    // Non-linear trajectory easing
    const easedProgress = Math.pow(progress, 1.15);
    const pointValue = Math.max(35, Math.min(380, Math.round(g + (net30mDelta * easedProgress))));

    // Expanding model uncertainty interval
    const uncertaintyMargin = Math.round(10 + (j * 2.2));
    const lower = Math.max(35, pointValue - uncertaintyMargin);
    const upper = Math.min(380, pointValue + uncertaintyMargin);

    const isHypoRisk = pointValue < targetMin || lower < targetMin;

    forecastPoints.push({
      timeOffset: minutesAhead,
      label: `+${minutesAhead}m`,
      value: pointValue,
      isForecast: true,
      lowerBound: lower,
      upperBound: upper,
      isHypoRisk,
      timestamp: new Date(now + minutesAhead * 60 * 1000).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    });

    uncertaintyBand.push({
      timeOffset: minutesAhead,
      lower,
      upper
    });
  }

  return {
    currentGlucose: g,
    predicted30mGlucose,
    hasRealHistory,
    historyPoints,
    forecastPoints,
    uncertaintyBand,
    isElevatedHypoRisk: predicted30mGlucose < targetMin,
    net30mDelta: Math.round(net30mDelta)
  };
}
