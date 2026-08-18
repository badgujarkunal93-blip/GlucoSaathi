/**
 * GlucoSaathi — Explainable Hypoglycemia Risk & Insulin Bolus Engine
 * Transparent deterministic prototype rule system for hackathon demonstration.
 */
import { 
  evaluateHypoglycemiaRisk, 
  calculateBolusReference 
} from '../lib/risk/riskEngine';
import { 
  RISK_CONFIG, 
  DEMO_PRESET_SCENARIOS 
} from '../lib/risk/riskConfig';

export const ACTIVITY_FACTORS = {
  'None': { label: 'None / Resting', multiplier: 1.0, impact: 'Baseline glucose clearance' },
  'Light': { label: 'Light (Walking, casual movement)', multiplier: 1.15, impact: 'Mildly increases insulin sensitivity' },
  'Moderate': { label: 'Moderate (Brisk walk, yoga, cycling)', multiplier: 1.35, impact: 'Accelerates glucose uptake by muscles' },
  'Intense': { label: 'Intense (Running, gym workout, sports)', multiplier: 1.6, impact: 'Sharp increase in glucose burn and sensitivity' }
};

export const DEMO_SCENARIOS = DEMO_PRESET_SCENARIOS;

/**
 * Calculates suggested reference insulin dose based on prescribed Insulin-to-Carb Ratio (ICR)
 * Always clearly flagged as reference calculation.
 */
export function calculateInsulinDose(carbs, icrRatio = 15, currentGlucose = 108, targetGlucose = 110) {
  const result = calculateBolusReference({
    carbohydrates: carbs,
    insulinCarbRatio: icrRatio,
    currentGlucose,
    targetGlucose
  });
  return result.totalSuggestedDose;
}

/**
 * Evaluates hypoglycemia risk and generates explainable clinical reasons
 */
export function evaluateHypoRisk(params) {
  return evaluateHypoglycemiaRisk(params);
}

export { evaluateHypoglycemiaRisk, calculateBolusReference, RISK_CONFIG };
