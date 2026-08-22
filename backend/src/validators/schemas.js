import { z } from 'zod';

export const GlucoseLogSchema = z.object({
  glucose: z.number().min(20).max(600),
  timestamp: z.string().optional(),
  mealRelation: z.enum(['fasting', 'pre_meal', 'post_meal', 'bedtime', 'exercise', 'other']).default('fasting'),
  trend: z.enum(['falling_rapidly', 'falling', 'stable', 'rising', 'rising_rapidly']).default('stable'),
  notes: z.string().max(300).optional()
});

export const MealParseSchema = z.object({
  description: z.string().min(1).max(1000).optional(),
  photoBase64: z.string().optional(),
  apiKey: z.string().optional()
});

export const MealItemSchema = z.object({
  name: z.string().min(1),
  quantity: z.number().positive().default(1),
  unit: z.string().optional()
});

export const MealEstimateSchema = z.object({
  items: z.array(MealItemSchema).min(1)
});

export const HypoPredictionSchema = z.object({
  glucose: z.number().min(20).max(600),
  glucose_roc_5m: z.number().default(0.0),
  glucose_lag_15m: z.number().optional(),
  glucose_lag_30m: z.number().optional(),
  iob: z.number().min(0).max(30).default(0.0),
  carbs_recent: z.number().min(0).max(500).default(0.0),
  activity_level: z.enum(['resting', 'light', 'moderate', 'intense']).default('moderate'),
  steps_30m: z.number().min(0).default(0)
});

export const UserProfileSchema = z.object({
  id: z.string().default('default_patient'),
  name: z.string().min(1).default('Aarav Sharma'),
  age: z.number().int().min(1).max(120).default(24),
  condition: z.string().default('Type 1 Diabetes'),
  icrRatio: z.number().positive().default(15),
  correctionFactor: z.number().positive().default(50),
  targetMin: z.number().min(60).max(120).default(70),
  targetMax: z.number().min(120).max(200).default(140),
  activeInsulinType: z.string().default('Rapid Acting (Novorapid / Aspart)'),
  basalRegimen: z.string().default('16 U Tresiba at 10 PM'),
  emergencyContacts: z.array(z.object({
    name: z.string(),
    relation: z.string(),
    phone: z.string()
  })).default([])
});
