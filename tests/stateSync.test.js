import { describe, it, expect } from 'vitest';
import { evaluateHypoglycemiaRisk, calculateBolusReference } from '../frontend/src/lib/risk/riskEngine';
import { estimateCarbohydrates, findFoodItem } from '../frontend/src/lib/carb/carbEstimator';
import { DEMO_PERSONAS } from '../frontend/src/context/AppContext';

describe('End-to-End Single Patient State & Risk Derivation Pipeline', () => {
  it('TEST 1: Evaluates Safe Low-Risk Baseline (Glucose 108, IOB 0.8U, Carbs 68g, Light Activity)', () => {
    const risk = evaluateHypoglycemiaRisk({
      glucose: 108,
      insulinOnBoard: 0.8,
      carbsConsumed: 68,
      carbsCovered: 68,
      activityLevel: 'Light',
      timeSinceMealHours: 2.0
    });

    expect(risk.riskLevel).toBe('LOW');
    expect(risk.score).toBeLessThanOrEqual(35);
    expect(risk.isEmergencyHypo).toBe(false);
  });

  it('TEST 2: Triggers Immediate High Risk & Rule of 15 when Glucose Drops 108 -> 65 mg/dL', () => {
    const risk = evaluateHypoglycemiaRisk({
      glucose: 65,
      insulinOnBoard: 0.8,
      carbsConsumed: 68,
      carbsCovered: 68,
      activityLevel: 'Light',
      timeSinceMealHours: 2.0
    });

    expect(risk.riskLevel).toBe('HIGH');
    expect(risk.score).toBeGreaterThanOrEqual(80);
    expect(risk.isEmergencyHypo).toBe(true);
    expect(risk.recommendations.some(r => r.includes('Rule of 15'))).toBe(true);
  });

  it('TEST 3: Escalates Risk when Insulin on Board Increases from 0.8 U -> 4.0 U', () => {
    const baseRisk = evaluateHypoglycemiaRisk({
      glucose: 95,
      insulinOnBoard: 0.8,
      carbsConsumed: 50,
      carbsCovered: 50,
      activityLevel: 'Light',
      timeSinceMealHours: 2.0
    });

    const highIobRisk = evaluateHypoglycemiaRisk({
      glucose: 95,
      insulinOnBoard: 4.0, // heavy stacking
      carbsConsumed: 50,
      carbsCovered: 50,
      activityLevel: 'Light',
      timeSinceMealHours: 2.0
    });

    expect(highIobRisk.score).toBeGreaterThan(baseRisk.score);
    expect(['MODERATE', 'HIGH']).toContain(highIobRisk.riskLevel);
  });

  it('TEST 4: Elevated Risk on Carb Deficit (68g -> 15g with 3.0U IOB)', () => {
    const risk = evaluateHypoglycemiaRisk({
      glucose: 92,
      insulinOnBoard: 3.0,
      carbsConsumed: 15,
      carbsCovered: 68,
      activityLevel: 'Moderate',
      timeSinceMealHours: 2.5
    });

    expect(['MODERATE', 'HIGH']).toContain(risk.riskLevel);
    expect(risk.score).toBeGreaterThan(55);
  });

  it('TEST 5: Elevated Risk on Intense Exercise Transition (Light -> Intense)', () => {
    const light = evaluateHypoglycemiaRisk({
      glucose: 98,
      insulinOnBoard: 1.5,
      carbsConsumed: 40,
      carbsCovered: 40,
      activityLevel: 'Light',
      timeSinceMealHours: 2.0
    });

    const intense = evaluateHypoglycemiaRisk({
      glucose: 98,
      insulinOnBoard: 1.5,
      carbsConsumed: 40,
      carbsCovered: 40,
      activityLevel: 'Intense',
      timeSinceMealHours: 2.0
    });

    expect(intense.score).toBeGreaterThan(light.score);
  });

  it('TEST 6: Resolves Regional Indian Food Aliases to Authoritative IFCT 2017 IDs', () => {
    expect(findFoodItem('phulka')?.id).toBe('roti');
    expect(findFoodItem('chawal')?.id).toBe('rice');
    expect(findFoodItem('bhaat')?.id).toBe('rice');
    expect(findFoodItem('dahi')?.id).toBe('curd');
    expect(findFoodItem('kanda poha')?.id).toBe('poha');
  });

  it('TEST 7: Preloads Full Consistent Telemetry Across All Three Personas', () => {
    const aarav = DEMO_PERSONAS.aarav;
    const priya = DEMO_PERSONAS.priya;
    const rajesh = DEMO_PERSONAS.rajesh;

    expect(aarav.defaultInputs.glucose).toBe(108);
    expect(aarav.icrRatio).toBe(15);

    expect(priya.defaultInputs.glucose).toBe(122);
    expect(priya.icrRatio).toBe(12);

    expect(rajesh.defaultInputs.glucose).toBe(94);
    expect(rajesh.icrRatio).toBe(10);
  });
});
