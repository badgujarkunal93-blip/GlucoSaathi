/**
 * GlucoSaathi — Explainable Hypoglycemia Risk & Insulin Bolus Engine
 * Transparent deterministic prototype rule system for hackathon demonstration.
 */

export const ACTIVITY_FACTORS = {
  'None': { label: 'None / Resting', multiplier: 1.0, impact: 'Baseline glucose clearance' },
  'Light': { label: 'Light (Walking, casual movement)', multiplier: 1.15, impact: 'Mildly increases insulin sensitivity' },
  'Moderate': { label: 'Moderate (Brisk walk, yoga, cycling)', multiplier: 1.35, impact: 'Accelerates glucose uptake by muscles' },
  'Intense': { label: 'Intense (Running, gym workout, sports)', multiplier: 1.6, impact: 'Sharp increase in glucose burn and sensitivity' }
};

export const DEMO_SCENARIOS = {
  'low': {
    id: 'low',
    name: 'Normal (Low Risk)',
    description: 'Stable glucose, recent meal, safe IOB',
    glucose: 108,
    insulinOnBoard: 0.8,
    activityLevel: 'Light',
    timeSinceMealHours: 2,
    carbsConsumed: 68
  },
  'moderate': {
    id: 'moderate',
    name: 'Moderate Risk',
    description: 'Borderline glucose, moderate activity & higher IOB',
    glucose: 88,
    insulinOnBoard: 1.8,
    activityLevel: 'Moderate',
    timeSinceMealHours: 3.5,
    carbsConsumed: 45
  },
  'high': {
    id: 'high',
    name: 'High Risk Alert',
    description: 'Low glucose, intense activity, stacked IOB',
    glucose: 64,
    insulinOnBoard: 2.4,
    activityLevel: 'Intense',
    timeSinceMealHours: 4.5,
    carbsConsumed: 30
  }
};

/**
 * Calculates suggested insulin dose based on prescribed Insulin-to-Carb Ratio (ICR)
 * Default ratio: 1 U per 15g carbs
 */
export function calculateInsulinDose(carbs, icrRatio = 15) {
  const numCarbs = Number(carbs) || 0;
  const ratio = Number(icrRatio) || 15;
  if (numCarbs <= 0 || ratio <= 0) return 0;
  
  const rawDose = numCarbs / ratio;
  // Round to nearest 0.5 or 0.1 unit typical for pens/pumps
  return Math.round(rawDose * 10) / 10;
}

/**
 * Evaluates hypoglycemia risk and generates explainable clinical reasons
 */
export function evaluateHypoRisk({
  glucose = 108,
  insulinOnBoard = 0.8,
  carbsConsumed = 68,
  activityLevel = 'Light',
  timeSinceMealHours = 2
}) {
  const g = Number(glucose);
  const iob = Number(insulinOnBoard);
  const carbs = Number(carbsConsumed);
  const hours = Number(timeSinceMealHours);
  const activity = activityLevel || 'Light';

  let riskLevel = 'LOW'; // 'LOW' | 'MODERATE' | 'HIGH'
  let headline = 'Your current risk appears low.';
  let explanation = '';
  let color = 'emerald';
  let badgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  let cardBorder = 'border-emerald-500/30';
  let recommendations = [];
  let score = 15; // 0 to 100 risk score

  // 1. High Risk Detection
  if (g < 70 || (g < 85 && (iob >= 2.0 || activity === 'Intense')) || (g < 90 && iob >= 2.5)) {
    riskLevel = 'HIGH';
    score = g < 70 ? 88 : 78;
    headline = 'Elevated Risk of Hypoglycemia';
    color = 'red';
    badgeClass = 'bg-red-500/15 text-red-400 border-red-500/40';
    cardBorder = 'border-red-500/40';

    if (g < 70) {
      explanation = `Your current glucose (${g} mg/dL) is below the standard safe threshold (70 mg/dL). With ${iob} U active insulin and ${activity.toLowerCase()} activity, risk of further drop is significant.`;
      recommendations = [
        'Take 15g of fast-acting glucose immediately (fruit juice, 3-4 glucose tablets, or 1 tbsp sugar in water).',
        'Re-test blood glucose in 15 minutes.',
        'Pause active exercise until glucose is above 90 mg/dL.'
      ];
    } else {
      explanation = `Your glucose is approaching lower limits (${g} mg/dL) while Insulin-on-Board (${iob} U) is elevated and activity is ${activity.toLowerCase()}.`;
      recommendations = [
        'Keep fast-acting carbohydrates within arm’s reach.',
        'Consider a small preventative snack (e.g., 10-15g slow-acting carbs like roasted chana or a biscuit).',
        'Monitor glucose trend closely over the next 30 minutes.'
      ];
    }
  }
  // 2. Moderate Risk Detection
  else if (
    (g >= 70 && g <= 89) ||
    (g <= 110 && iob >= 1.6) ||
    (activity === 'Intense' && hours >= 2.5) ||
    (activity === 'Moderate' && iob >= 1.5 && hours >= 3)
  ) {
    riskLevel = 'MODERATE';
    score = 52;
    headline = 'Moderate Risk — Caution Advised';
    color = 'amber';
    badgeClass = 'bg-amber-500/15 text-amber-400 border-amber-500/40';
    cardBorder = 'border-amber-500/40';

    explanation = `Your glucose (${g} mg/dL) combined with active insulin (${iob} U) and ${activity.toLowerCase()} activity may cause a gradual downward drift over the next 1–2 hours.`;
    recommendations = [
      'Check glucose again before engaging in additional physical activity.',
      'If driving or exercising, have a quick carb snack ready.',
      'Ensure your CGM / glucometer is accessible.'
    ];
  }
  // 3. Low Risk (Default Safe State)
  else {
    riskLevel = 'LOW';
    score = 12;
    headline = 'Your current risk appears low.';
    color = 'emerald';
    badgeClass = 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
    cardBorder = 'border-emerald-500/30';

    explanation = `Your glucose (${g} mg/dL) is currently in a safer range, you recently ate (${hours}h ago), and insulin on board (${iob} U) is relatively low.`;
    recommendations = [
      'Normal routine. Continue usual monitoring schedule.',
      'Log any upcoming snacks or activity changes.'
    ];
  }

  return {
    riskLevel,
    headline,
    explanation,
    color,
    badgeClass,
    cardBorder,
    score,
    recommendations,
    telemetry: {
      glucose: `${g} mg/dL`,
      insulinOnBoard: `${iob} U`,
      timeSinceMeal: `${hours}h`,
      activity: activity,
      carbsConsumed: `${carbs}g`
    }
  };
}
