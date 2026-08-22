import { describe, it, expect } from 'vitest';
import { generateDynamicTrajectory, TREND_SLOPES, ACTIVITY_MODIFIERS } from '../frontend/src/lib/forecast/forecastEngine';

describe('Dynamic Glucose Trajectory & Forecast Engine', () => {
  it('TEST 1: Calculates Safe Baseline Trajectory (108 mg/dL, slow_fall, 0.8U IOB, 68g carbs, Light)', () => {
    const trajectory = generateDynamicTrajectory({
      currentGlucose: 108,
      trend: 'slow_fall',
      activeInsulin: 0.8,
      mealCarbs: 68,
      activityLevel: 'Light'
    });

    expect(trajectory.currentGlucose).toBe(108);
    expect(trajectory.historyPoints).toHaveLength(13);
    expect(trajectory.forecastPoints).toHaveLength(6);
    expect(trajectory.uncertaintyBand).toHaveLength(6);
    expect(trajectory.historyPoints[12].value).toBe(108); // NOW marker
    expect(trajectory.isElevatedHypoRisk).toBe(false);
  });

  it('TEST 2: Triggers Elevated Hypoglycemia Warning on Hypo Alert (65 mg/dL, rapid_fall, 2.2U IOB, 0g carbs)', () => {
    const trajectory = generateDynamicTrajectory({
      currentGlucose: 65,
      trend: 'rapid_fall',
      activeInsulin: 2.2,
      mealCarbs: 0,
      activityLevel: 'Resting'
    });

    expect(trajectory.currentGlucose).toBe(65);
    expect(trajectory.predicted30mGlucose).toBeLessThan(70);
    expect(trajectory.isElevatedHypoRisk).toBe(true);
    expect(trajectory.forecastPoints.some(p => p.isHypoRisk)).toBe(true);
  });

  it('TEST 3: Rises on Rapid Rise with High Carbohydrates (110 mg/dL, rapid_rise, 0.2U IOB, 85g carbs)', () => {
    const trajectory = generateDynamicTrajectory({
      currentGlucose: 110,
      trend: 'rapid_rise',
      activeInsulin: 0.2,
      mealCarbs: 85,
      activityLevel: 'Resting'
    });

    expect(trajectory.predicted30mGlucose).toBeGreaterThan(110);
    expect(trajectory.net30mDelta).toBeGreaterThan(0);
  });

  it('TEST 4: Increased Downward Pressure with Intense Exercise and High IOB', () => {
    const light = generateDynamicTrajectory({
      currentGlucose: 120,
      trend: 'stable',
      activeInsulin: 1.0,
      mealCarbs: 30,
      activityLevel: 'Light'
    });

    const intense = generateDynamicTrajectory({
      currentGlucose: 120,
      trend: 'stable',
      activeInsulin: 3.5,
      mealCarbs: 30,
      activityLevel: 'Intense'
    });

    expect(intense.predicted30mGlucose).toBeLessThan(light.predicted30mGlucose);
  });

  it('TEST 5: Integrates Real CGM Sensor Records when uploaded via CSV', () => {
    const mockCgm = [
      { timestamp: '2026-08-22T10:00:00Z', glucose: 130 },
      { timestamp: '2026-08-22T10:05:00Z', glucose: 126 },
      { timestamp: '2026-08-22T10:10:00Z', glucose: 120 },
      { timestamp: '2026-08-22T10:15:00Z', glucose: 115 },
      { timestamp: '2026-08-22T10:20:00Z', glucose: 110 }
    ];

    const trajectory = generateDynamicTrajectory({
      currentGlucose: 110,
      trend: 'slow_fall',
      cgmHistory: mockCgm
    });

    expect(trajectory.hasRealHistory).toBe(true);
    expect(trajectory.historyPoints.length).toBeGreaterThanOrEqual(5);
    expect(trajectory.historyPoints[0].source).toBe('Real CGM Telemetry');
  });
});
