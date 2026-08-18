/**
 * GlucoSaathi — Centralized Risk Factor Weights & Clinical Thresholds
 * Transparent prototype rule-based configuration for hackathon demonstration.
 */
export const RISK_CONFIG = {
  // Factor weights summing to 1.0 (100%)
  weights: {
    insulinOnBoard: 0.40,      // Active insulin stacking
    carbsConsumedVsCovered: 0.30, // Carb deficit / un-buffered insulin
    physicalActivity: 0.20,    // Muscle glucose uptake
    timeSinceLastMeal: 0.10    // Fasting interval / digestion curve
  },

  // Glucose safety thresholds (mg/dL)
  glucoseThresholds: {
    emergencySevereLow: 54,     // Level 2 Hypoglycemia (critical)
    clinicalLow: 70,            // Level 1 Hypoglycemia (Rule of 15 trigger)
    borderlineLow: 90,          // Caution range if active IOB exists
    targetMin: 70,
    targetMax: 140,
    highAlert: 240
  },

  // Insulin On Board (IOB) thresholds (Units)
  iobThresholds: {
    high: 2.2,
    moderate: 1.2,
    low: 0.5
  },

  // Activity multipliers
  activityMultipliers: {
    'None': { weight: 0.0, label: 'Resting / Sedentary' },
    'Light': { weight: 0.25, label: 'Light (Walking, casual movement)' },
    'Moderate': { weight: 0.65, label: 'Moderate (Brisk walk, yoga, cycling)' },
    'Intense': { weight: 1.0, label: 'Intense (Running, sports, gym)' }
  },

  // Meal timing intervals (Hours)
  mealTimingHours: {
    extendedFast: 4.0,
    moderateInterval: 2.5,
    recentMeal: 1.5
  }
};

export const DEMO_PRESET_SCENARIOS = {
  'low': {
    id: 'low',
    name: 'Normal (Low Risk)',
    description: 'Stable glucose (108 mg/dL), recent meal, safe low IOB (0.8 U)',
    glucose: 108,
    insulinOnBoard: 0.8,
    activityLevel: 'Light',
    timeSinceMealHours: 1.5,
    carbsConsumed: 68,
    expectedLevel: 'LOW'
  },
  'moderate': {
    id: 'moderate',
    name: 'Moderate Risk Warning',
    description: 'Borderline glucose (86 mg/dL), active IOB (1.8 U), post-exercise',
    glucose: 86,
    insulinOnBoard: 1.8,
    activityLevel: 'Moderate',
    timeSinceMealHours: 3.2,
    carbsConsumed: 45,
    expectedLevel: 'MODERATE'
  },
  'high': {
    id: 'high',
    name: 'High Risk Alert (Hypo Danger)',
    description: 'Low glucose (62 mg/dL), high active IOB (2.6 U), skipped carb intake',
    glucose: 62,
    insulinOnBoard: 2.6,
    activityLevel: 'Intense',
    timeSinceMealHours: 4.5,
    carbsConsumed: 20,
    expectedLevel: 'HIGH'
  }
};
