import { describe, it, expect } from 'vitest';
import { evaluateHypoglycemiaRisk, calculateBolusReference } from '../frontend/src/lib/risk/riskEngine';

describe('Explainable Hypoglycemia Risk Engine', () => {
  it('identifies emergency hypoglycemia when glucose is below 70 mg/dL', () => {
    const risk = evaluateHypoglycemiaRisk({
      glucose: 62,
      insulinOnBoard: 1.5,
      carbsConsumed: 30,
      activityLevel: 'Light',
      timeSinceMealHours: 2.0
    });

    expect(risk.riskLevel).toBe('HIGH');
    expect(risk.isEmergencyHypo).toBe(true);
    expect(risk.color).toBe('red');
    expect(risk.recommendations.some(r => r.includes('Rule of 15'))).toBe(true);
  });

  it('evaluates safe low-risk state under normal glycemic telemetry', () => {
    const risk = evaluateHypoglycemiaRisk({
      glucose: 110,
      insulinOnBoard: 0.5,
      carbsConsumed: 60,
      carbsCovered: 60,
      activityLevel: 'Light',
      timeSinceMealHours: 1.5
    });

    expect(risk.riskLevel).toBe('LOW');
    expect(risk.isEmergencyHypo).toBe(false);
    expect(risk.color).toBe('emerald');
  });

  it('elevates risk to moderate/high when IOB is high and carbs are skipped', () => {
    const risk = evaluateHypoglycemiaRisk({
      glucose: 88,
      insulinOnBoard: 2.8, // high active insulin
      carbsConsumed: 10,
      carbsCovered: 60,   // 50g deficit
      activityLevel: 'Intense',
      timeSinceMealHours: 4.5
    });

    expect(['MODERATE', 'HIGH']).toContain(risk.riskLevel);
    expect(risk.score).toBeGreaterThan(60);
  });

  it('calculates reference bolus dosage accurately without prescriptive claim', () => {
    const bolus = calculateBolusReference({
      carbohydrates: 60,
      insulinCarbRatio: 15,
      currentGlucose: 110,
      targetGlucose: 110,
      correctionFactor: 50,
      activeIob: 0
    });

    expect(bolus.totalSuggestedDose).toBe(4.0);
    expect(bolus.disclaimer).toContain('For educational & reference purposes only');
  });
});
