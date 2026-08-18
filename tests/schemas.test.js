import { describe, it, expect } from 'vitest';
import { 
  GlucoseLogSchema, 
  InsulinLogSchema, 
  ParsedFoodItemSchema,
  UserProfileSchema 
} from '../frontend/src/lib/validation/schemas';

describe('Domain Validation Schemas (Zod)', () => {
  it('validates a valid glucose reading', () => {
    const validGlucose = {
      value: 120,
      unit: 'mg/dL',
      trend: 'stable',
      mealRelation: 'fasting'
    };

    const res = GlucoseLogSchema.safeParse(validGlucose);
    expect(res.success).toBe(true);
  });

  it('rejects biologically impossible glucose values', () => {
    const invalidGlucose = {
      value: 12, // too low
      unit: 'mg/dL'
    };

    const res = GlucoseLogSchema.safeParse(invalidGlucose);
    expect(res.success).toBe(false);
  });

  it('validates insulin bolus inputs within safety boundaries', () => {
    const validDose = {
      amount: 4.5,
      deliveryType: 'bolus',
      carbsCovered: 60
    };

    const res = InsulinLogSchema.safeParse(validDose);
    expect(res.success).toBe(true);
  });

  it('validates user profiles with custom ICR ratios', () => {
    const profile = {
      name: 'Priya Patel',
      age: 12,
      diabetesType: 'Type 1 Diabetes',
      insulinCarbRatio: 12,
      correctionFactor: 60
    };

    const res = UserProfileSchema.safeParse(profile);
    expect(res.success).toBe(true);
  });
});
