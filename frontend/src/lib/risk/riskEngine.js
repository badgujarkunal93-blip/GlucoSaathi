import { RISK_CONFIG } from './riskConfig';

/**
 * Calculates suggested reference insulin dose based on user's prescribed ICR
 * ALWAYS flagged as reference-only.
 */
export function calculateBolusReference({
  carbohydrates = 0,
  insulinCarbRatio = 15,
  currentGlucose = 108,
  targetGlucose = 110,
  correctionFactor = 50,
  activeIob = 0
}) {
  const carbs = Math.max(0, Number(carbohydrates) || 0);
  const icr = Math.max(1, Number(insulinCarbRatio) || 15);
  const glucose = Number(currentGlucose) || 108;
  const target = Number(targetGlucose) || 110;
  const isf = Math.max(1, Number(correctionFactor) || 50);
  const iob = Math.max(0, Number(activeIob) || 0);

  if (carbs <= 0 && glucose <= target) {
    return {
      totalSuggestedDose: 0,
      carbDose: 0,
      correctionDose: 0,
      iobSubtracted: 0,
      disclaimer: 'Reference estimate only — always confirm with your doctor/care plan.'
    };
  }

  // 1. Carb Bolus = Carbs / ICR
  const rawCarbDose = carbs / icr;

  // 2. Correction Bolus = (Glucose - Target) / ISF (if above target)
  const rawCorrectionDose = glucose > target ? (glucose - target) / isf : 0;

  // 3. Gross Dose minus active IOB (prevent insulin stacking)
  const grossDose = rawCarbDose + rawCorrectionDose;
  const netDose = Math.max(0, grossDose - (iob * 0.5)); // Safety offset

  return {
    totalSuggestedDose: Math.round(netDose * 10) / 10,
    carbDose: Math.round(rawCarbDose * 10) / 10,
    correctionDose: Math.round(rawCorrectionDose * 10) / 10,
    iobSubtracted: Math.round((iob * 0.5) * 10) / 10,
    formulaExplanation: `Carb Bolus (${(carbs / icr).toFixed(1)} U) + Correction (${rawCorrectionDose.toFixed(1)} U) - IOB buffer`,
    disclaimer: 'For educational & reference purposes only. Never adjust prescribed medical dosing without physician consultation.'
  };
}

/**
 * Evaluates hypoglycemia risk and provides transparent, explainable reasoning
 */
export function evaluateHypoglycemiaRisk({
  glucose = 108,
  insulinOnBoard = 0.8,
  carbsConsumed = 68,
  carbsCovered = 68,
  activityLevel = 'Light',
  timeSinceMealHours = 2.0
}) {
  const g = Number(glucose) || 108;
  const iob = Number(insulinOnBoard) || 0;
  const eatenCarbs = Number(carbsConsumed) || 0;
  const coveredCarbs = Number(carbsCovered) || eatenCarbs;
  const hours = Number(timeSinceMealHours) || 0;
  const activity = activityLevel || 'Light';

  const cfg = RISK_CONFIG;
  const factorBreakdowns = [];

  // 1. Factor: Insulin On Board (Weight 40%)
  let iobScore = 0;
  let iobImpact = 'Low';
  let iobExplanation = 'Active insulin is at a manageable baseline level.';
  if (iob >= cfg.iobThresholds.high) {
    iobScore = 1.0;
    iobImpact = 'High';
    iobExplanation = `Elevated insulin on board (${iob.toFixed(1)} U) increases rapid glucose clearance.`;
  } else if (iob >= cfg.iobThresholds.moderate) {
    iobScore = 0.60;
    iobImpact = 'Moderate';
    iobExplanation = `Moderate active insulin (${iob.toFixed(1)} U) requires ongoing monitoring.`;
  } else {
    iobScore = 0.15;
  }
  factorBreakdowns.push({
    factor: 'Insulin On Board (IOB)',
    weight: cfg.weights.insulinOnBoard,
    impact: iobImpact,
    score: iobScore,
    explanation: iobExplanation
  });

  // 2. Factor: Carbs Consumed vs Covered (Weight 30%)
  let carbScore = 0;
  let carbImpact = 'Low';
  let carbExplanation = 'Carbohydrate intake is well-balanced with insulin dose.';
  const carbDeficitRatio = coveredCarbs > 0 ? (coveredCarbs - eatenCarbs) / coveredCarbs : 0;
  
  if (carbDeficitRatio >= 0.3) {
    carbScore = 1.0;
    carbImpact = 'High';
    carbExplanation = `Carbs eaten are ${Math.round(carbDeficitRatio * 100)}% lower than insulin coverage — significant hypo risk.`;
  } else if (carbDeficitRatio >= 0.15) {
    carbScore = 0.65;
    carbImpact = 'Moderate';
    carbExplanation = `Slight carb deficit relative to bolus dosage.`;
  } else {
    carbScore = 0.10;
  }
  factorBreakdowns.push({
    factor: 'Carb Balance vs Bolus',
    weight: cfg.weights.carbsConsumedVsCovered,
    impact: carbImpact,
    score: carbScore,
    explanation: carbExplanation
  });

  // 3. Factor: Physical Activity (Weight 20%)
  const actCfg = cfg.activityMultipliers[activity] || cfg.activityMultipliers['Light'];
  const actScore = actCfg.weight;
  let actImpact = actScore >= 0.8 ? 'High' : actScore >= 0.4 ? 'Moderate' : 'Low';
  let actExplanation = `${actCfg.label} increases muscle insulin sensitivity and glucose consumption rate.`;
  factorBreakdowns.push({
    factor: 'Physical Activity',
    weight: cfg.weights.physicalActivity,
    impact: actImpact,
    score: actScore,
    explanation: actExplanation
  });

  // 4. Factor: Time Since Last Meal (Weight 10%)
  let timeScore = 0;
  let timeImpact = 'Low';
  let timeExplanation = `Recent meal (${hours.toFixed(1)}h ago) provides active digestive glucose absorption.`;
  if (hours >= cfg.mealTimingHours.extendedFast) {
    timeScore = 1.0;
    timeImpact = 'High';
    timeExplanation = `Extended interval (${hours.toFixed(1)}h since last meal) leaves minimal active food absorption.`;
  } else if (hours >= cfg.mealTimingHours.moderateInterval) {
    timeScore = 0.55;
    timeImpact = 'Moderate';
    timeExplanation = `${hours.toFixed(1)} hours since last meal; food absorption is tapering off.`;
  } else {
    timeScore = 0.10;
  }
  factorBreakdowns.push({
    factor: 'Digestion & Fasting Time',
    weight: cfg.weights.timeSinceLastMeal,
    impact: timeImpact,
    score: timeScore,
    explanation: timeExplanation
  });

  // Calculate Weighted Base Score (0 to 100)
  let rawWeightedScore = (
    iobScore * cfg.weights.insulinOnBoard +
    carbScore * cfg.weights.carbsConsumedVsCovered +
    actScore * cfg.weights.physicalActivity +
    timeScore * cfg.weights.timeSinceLastMeal
  ) * 100;

  // Direct Glucose Level Adjustments & Emergency Triggers
  let isEmergencyHypo = false;
  let riskLevel = 'LOW';
  let color = 'emerald';
  let headline = 'Safer Glycemic Range';
  let recommendations = [];

  if (g < cfg.glucoseThresholds.emergencySevereLow) {
    isEmergencyHypo = true;
    riskLevel = 'HIGH';
    rawWeightedScore = Math.max(92, rawWeightedScore);
    color = 'red';
    headline = '🚨 SEVERE HYPOGLYCEMIA ALERT (Critical)';
    recommendations = [
      'Take 15–20g of FAST-ACTING glucose immediately (e.g. 1/2 cup fruit juice, 4 glucose tablets, or 3 tsp sugar in water).',
      'Sit down and avoid all physical movement.',
      'Re-check blood glucose in 15 minutes (Clinical Rule of 15).',
      'If unable to swallow or feeling disoriented, alert family/guardian immediately.'
    ];
  } else if (g < cfg.glucoseThresholds.clinicalLow) {
    isEmergencyHypo = true;
    riskLevel = 'HIGH';
    rawWeightedScore = Math.max(82, rawWeightedScore);
    color = 'red';
    headline = '⚠️ Low Blood Sugar Warning (<70 mg/dL)';
    recommendations = [
      'Apply Rule of 15: Consume 15g fast carbs (fruit juice, glucose tabs).',
      'Pause workouts or strenuous movement.',
      'Re-test blood sugar in 15 minutes before continuing normal activity.'
    ];
  } else if (g <= cfg.glucoseThresholds.borderlineLow && (iob >= 1.2 || activity === 'Intense' || activity === 'Moderate')) {
    riskLevel = 'HIGH';
    rawWeightedScore = Math.max(72, rawWeightedScore);
    color = 'red';
    headline = 'Elevated Risk of Upcoming Hypoglycemia';
    recommendations = [
      'Glucose is borderline low with active insulin/exercise.',
      'Keep 15g fast-acting carbs within arms reach.',
      'Consider a small 10–15g complex snack if planning further exercise.'
    ];
  } else if (rawWeightedScore >= 45 || (g <= 95 && iob >= 1.0)) {
    riskLevel = 'MODERATE';
    rawWeightedScore = Math.max(48, Math.min(68, rawWeightedScore));
    color = 'orange';
    headline = 'Moderate Risk — Be Attentive';
    recommendations = [
      'Monitor glucose trajectory over the next 30–60 minutes.',
      'Ensure fast-acting carbs are available if engaging in physical activity.',
      'Verify timing of your next scheduled meal or snack.'
    ];
  } else {
    riskLevel = 'LOW';
    rawWeightedScore = Math.min(35, Math.max(12, rawWeightedScore));
    color = 'emerald';
    headline = 'Your Current Risk Appears Low';
    recommendations = [
      'Glucose is currently in target range and active insulin is manageable.',
      'Continue following your usual meal and care schedule.'
    ];
  }

  // Generate plain language explanation
  const highFactors = factorBreakdowns.filter(f => f.impact === 'High');
  const modFactors = factorBreakdowns.filter(f => f.impact === 'Moderate');

  let explanation = '';
  if (isEmergencyHypo) {
    explanation = `Your blood glucose is currently ${g} mg/dL, which is dangerously below the safe threshold of 70 mg/dL.`;
  } else if (highFactors.length > 0) {
    explanation = `Risk is elevated primarily due to: ${highFactors.map(f => f.factor.toLowerCase()).join(' and ')}.`;
  } else if (modFactors.length > 0) {
    explanation = `Moderate caution advised due to ${modFactors.map(f => f.factor.toLowerCase()).join(' and ')}.`;
  } else {
    explanation = 'Glucose levels are stable with low active insulin and balanced meal coverage.';
  }

  return {
    riskLevel,
    score: Math.round(rawWeightedScore),
    color,
    headline,
    explanation,
    factors: factorBreakdowns,
    recommendations,
    isEmergencyHypo,
    calculatedAt: new Date().toISOString()
  };
}
