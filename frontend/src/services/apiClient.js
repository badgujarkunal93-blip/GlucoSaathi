/**
 * GlucoSaathi — Unified API & Service Client Layer
 * Encapsulates all backend/AI operations with Zod validation and consistent response formatting.
 */
import { parseMealTextWithAI, parseMealImageWithAI } from '../lib/ai/mealParser';
import { estimateCarbohydrates, findFoodItem } from '../lib/carb/carbEstimator';
import { evaluateHypoglycemiaRisk, calculateBolusReference } from '../lib/risk/riskEngine';
import { DataService } from './dataService';
import { 
  GlucoseLogSchema, 
  InsulinLogSchema, 
  ActivityLogSchema, 
  RiskInputSchema, 
  UserProfileSchema 
} from '../lib/validation/schemas';

/**
 * Standard API Response Formatter
 */
function createResponse(data, error = null) {
  if (error) {
    return {
      success: false,
      error: {
        code: error.code || 'API_ERROR',
        message: error.message || String(error)
      }
    };
  }
  return {
    success: true,
    data
  };
}

export const ApiClient = {
  // 1. Health Check
  async checkHealth() {
    return createResponse({
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      services: {
        aiParser: 'active',
        icmrDatabase: 'active (60+ foods)',
        riskEngine: 'active (rule-based)',
        persistence: 'active'
      }
    });
  },

  // 2. Meal Parsing & Estimation
  async parseMeal({ description, photoBase64, apiKey = null }) {
    try {
      if (photoBase64) {
        const aiResult = await parseMealImageWithAI(photoBase64, apiKey);
        return createResponse(aiResult.data);
      }
      const aiResult = await parseMealTextWithAI(description, apiKey);
      return createResponse(aiResult.data);
    } catch (err) {
      return createResponse(null, { code: 'PARSE_ERROR', message: err.message });
    }
  },

  // 3. Recalculate Carbs for modified items
  recalculateCarbs(items) {
    try {
      const estimation = estimateCarbohydrates(items);
      return createResponse(estimation);
    } catch (err) {
      return createResponse(null, { code: 'CALC_ERROR', message: err.message });
    }
  },

  // 4. Save Meal
  async saveMeal(mealData) {
    try {
      const saved = await DataService.saveMeal(mealData);
      return createResponse(saved);
    } catch (err) {
      return createResponse(null, { code: 'DB_ERROR', message: err.message });
    }
  },

  // 5. Glucose Logging
  async logGlucose(reading) {
    const validation = GlucoseLogSchema.safeParse(reading);
    if (!validation.success) {
      return createResponse(null, {
        code: 'VALIDATION_ERROR',
        message: validation.error.errors[0].message
      });
    }
    const saved = await DataService.saveGlucose(validation.data);
    return createResponse(saved);
  },

  // 6. Insulin Logging
  async logInsulin(dose) {
    const validation = InsulinLogSchema.safeParse(dose);
    if (!validation.success) {
      return createResponse(null, {
        code: 'VALIDATION_ERROR',
        message: validation.error.errors[0].message
      });
    }
    const saved = await DataService.saveInsulin(validation.data);
    return createResponse(saved);
  },

  // 7. Activity Logging
  async logActivity(activity) {
    const validation = ActivityLogSchema.safeParse(activity);
    if (!validation.success) {
      return createResponse(null, {
        code: 'VALIDATION_ERROR',
        message: validation.error.errors[0].message
      });
    }
    const saved = await DataService.saveActivity(validation.data);
    return createResponse(saved);
  },

  // 8. Risk Engine Evaluation
  async evaluateRisk(riskParams) {
    const validation = RiskInputSchema.safeParse(riskParams);
    if (!validation.success) {
      return createResponse(null, {
        code: 'VALIDATION_ERROR',
        message: validation.error.errors[0].message
      });
    }
    const result = evaluateHypoglycemiaRisk(validation.data);
    await DataService.saveRiskAssessment({
      ...result,
      context: validation.data
    });
    return createResponse(result);
  },

  // 9. Reference Bolus Calculation
  calculateBolus(params) {
    const result = calculateBolusReference(params);
    return createResponse(result);
  },

  // 10. Profile Management
  async updateProfile(profile) {
    const validation = UserProfileSchema.safeParse(profile);
    if (!validation.success) {
      return createResponse(null, {
        code: 'VALIDATION_ERROR',
        message: validation.error.errors[0].message
      });
    }
    const saved = await DataService.saveProfile(validation.data);
    return createResponse(saved);
  }
};
