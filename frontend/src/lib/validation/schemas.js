import { z } from 'zod';

/**
 * Meal Input & Parsing Schemas
 */
export const ParsedFoodItemSchema = z.object({
  name: z.string().min(1, 'Food name is required'),
  quantity: z.number().positive('Quantity must be greater than 0').default(1),
  unit: z.string().default('piece'),
  matchedFoodId: z.string().optional(),
  carbsPerUnit: z.number().nonnegative().optional(),
  carbs: z.number().nonnegative().optional(),
  glycemicIndex: z.enum(['Low', 'Low-Med', 'Medium', 'Med-High', 'High']).optional(),
  confidence: z.enum(['High', 'Medium', 'Low']).default('High'),
  icon: z.string().optional()
});

export const MealParseResponseSchema = z.object({
  items: z.array(ParsedFoodItemSchema).min(1, 'At least one food item must be identified'),
  confidence: z.enum(['High', 'Medium', 'Low']).default('High'),
  rawInput: z.string().default('')
});

export const CarbEstimationSchema = z.object({
  totalCarbs: z.number().nonnegative(),
  minimumCarbs: z.number().nonnegative(),
  maximumCarbs: z.number().nonnegative(),
  rangeText: z.string(),
  confidence: z.enum(['High', 'Medium', 'Low']),
  items: z.array(ParsedFoodItemSchema),
  notes: z.string().optional()
});

/**
 * Glucose Log Schema
 */
export const GlucoseLogSchema = z.object({
  id: z.string().optional(),
  value: z.number().min(20, 'Glucose reading must be realistic (>20)').max(600, 'Glucose reading too high (>600)'),
  unit: z.enum(['mg/dL', 'mmol/L']).default('mg/dL'),
  source: z.enum(['manual', 'meter', 'cgm']).default('manual'),
  trend: z.enum(['falling_rapidly', 'falling', 'stable', 'rising', 'rising_rapidly']).default('stable'),
  mealRelation: z.enum(['fasting', 'pre_meal', 'post_meal', 'bedtime', 'random']).default('random'),
  notes: z.string().optional(),
  recordedAt: z.string().default(() => new Date().toISOString())
});

/**
 * Insulin Log Schema
 */
export const InsulinLogSchema = z.object({
  id: z.string().optional(),
  amount: z.number().positive('Insulin dose must be greater than 0').max(100, 'Single dose exceeds safety threshold'),
  insulinType: z.string().default('Rapid Acting (Novorapid / Aspart)'),
  deliveryType: z.enum(['bolus', 'basal', 'correction']).default('bolus'),
  carbsCovered: z.number().nonnegative().optional(),
  notes: z.string().optional(),
  recordedAt: z.string().default(() => new Date().toISOString())
});

/**
 * Physical Activity Schema
 */
export const ActivityLogSchema = z.object({
  id: z.string().optional(),
  activityType: z.string().min(1, 'Activity description is required'),
  intensity: z.enum(['Light', 'Moderate', 'Intense', 'None']).default('Light'),
  durationMinutes: z.number().positive('Duration must be positive').default(30),
  notes: z.string().optional(),
  recordedAt: z.string().default(() => new Date().toISOString())
});

/**
 * Hypoglycemia Risk Evaluation Schema
 */
export const RiskInputSchema = z.object({
  glucose: z.number().min(20).max(600).default(108),
  insulinOnBoard: z.number().min(0).max(50).default(0.8),
  carbsConsumed: z.number().min(0).max(500).default(68),
  carbsCovered: z.number().min(0).max(500).optional(),
  activityLevel: z.enum(['None', 'Light', 'Moderate', 'Intense']).default('Light'),
  timeSinceMealHours: z.number().min(0).max(24).default(2),
  glucoseTrend: z.string().optional()
});

export const RiskFactorBreakdownSchema = z.object({
  factor: z.string(),
  weight: z.number(),
  impact: z.enum(['Low', 'Moderate', 'High']),
  score: z.number(),
  explanation: z.string()
});

export const RiskResultSchema = z.object({
  riskLevel: z.enum(['LOW', 'MODERATE', 'HIGH']),
  score: z.number().min(0).max(100),
  color: z.enum(['green', 'orange', 'red', 'emerald']),
  headline: z.string(),
  explanation: z.string(),
  factors: z.array(RiskFactorBreakdownSchema),
  recommendations: z.array(z.string()),
  calculatedDose: z.number().nonnegative(),
  isEmergencyHypo: z.boolean().default(false),
  calculatedAt: z.string().default(() => new Date().toISOString())
});

/**
 * User Profile & Clinical Settings Schema
 */
export const UserProfileSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Name is required').default('Aarav Sharma'),
  age: z.number().min(1).max(120).default(24),
  diabetesType: z.enum(['Type 1 Diabetes', 'Type 2 Diabetes', 'LADA']).default('Type 1 Diabetes'),
  diagnosisYear: z.number().optional().default(2022),
  insulinCarbRatio: z.number().positive().default(15), // 1 Unit per X grams
  correctionFactor: z.number().positive().default(50), // 1 Unit lowers glucose by X mg/dL
  targetGlucoseMin: z.number().default(70),
  targetGlucoseMax: z.number().default(140),
  activeInsulinType: z.string().default('Rapid Acting (Novorapid / Aspart)'),
  basalRegimen: z.string().default('16 U Tresiba at 10 PM'),
  geminiApiKey: z.string().optional()
});
