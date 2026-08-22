/**
 * GlucoSaathi ML Inference Client Service
 * Connects frontend to the real Python FastAPI Microservice
 * (LightGBM Hypoglycemia Classifier & Conformal Forecaster)
 */

import { evaluateHypoglycemiaRisk, calculateBolusReference } from '../lib/risk/riskEngine';

const ML_API_BASE = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_ML_API_URL
  ? import.meta.env.VITE_ML_API_URL
  : 'http://localhost:8000';

const REQUEST_TIMEOUT_MS = 3500;

class MLService {
  constructor() {
    this.status = 'unknown'; // 'online' | 'offline' | 'loading'
    this.lastChecked = null;
    this.activeModelVersion = 'hypo_risk_v1_lightgbm';
  }

  /**
   * Health Check: tests if Python FastAPI service is reachable
   */
  async checkHealth() {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      const res = await fetch(`${ML_API_BASE}/health`, {
        method: 'GET',
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.status = 'online';
        this.lastChecked = new Date();
        return {
          online: true,
          details: data
        };
      }
    } catch {
      // Backend not running on 8000; check Express proxy /api/health
      try {
        const resProxy = await fetch('/api/ml/health');
        if (resProxy.ok) {
          const data = await resProxy.json();
          this.status = 'online';
          return { online: true, details: data };
        }
      } catch {
        // ML microservice offline
      }
    }

    this.status = 'offline';
    return { online: false, details: null };
  }

  /**
   * Predict Hypoglycemia Risk via real FastAPI LightGBM endpoint
   */
  async predictHypoRisk({ glucose, glucoseRoc = 0.0, iob = 0.0, carbs = 0.0, activityLevel = 'light' }) {
    const payload = {
      glucose: Number(glucose),
      glucose_roc_5m: Number(glucoseRoc),
      iob: Number(iob),
      carbs_recent: Number(carbs),
      activity_level: activityLevel.toLowerCase()
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const res = await fetch(`${ML_API_BASE}/api/ml/predict-hypo-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        this.status = 'online';
        return {
          success: true,
          source: 'FastAPI Calibrated LightGBM (Online)',
          probability: data.hypoglycemia_probability,
          riskScore: data.risk_score_100,
          riskLevel: data.risk_level,
          isRuleOf15Armed: data.rule_of_15_armed,
          explainability: data.explainability_factors,
          predictionHorizonMinutes: data.prediction_horizon_minutes || 45,
          modelVersion: data.model_version || 'hypo_risk_v1_lightgbm_calibrated'
        };
      }
    } catch (err) {
      console.warn('ML Service unreachable, utilizing deterministic physiological fallback:', err.message);
    }

    // Fallback to validated local physiological risk engine
    this.status = 'offline';
    const fallback = evaluateHypoglycemiaRisk({
      glucose,
      insulinOnBoard: iob,
      carbsConsumed: carbs,
      carbsCovered: carbs,
      activityLevel
    });

    const prob = Math.min(0.98, Math.max(0.04, fallback.score / 100));

    return {
      success: false,
      source: 'Deterministic Clinical Engine (Offline Fallback)',
      probability: prob,
      riskScore: fallback.score,
      riskLevel: fallback.riskLevel,
      isRuleOf15Armed: fallback.isEmergencyHypo,
      explainability: {
        glucose_momentum: fallback.factors[0]?.score || 0.60,
        active_insulin: fallback.factors[1]?.score || 0.18,
        physical_activity: fallback.factors[2]?.score || 0.12,
        carb_absorption: fallback.factors[3]?.score || 0.10
      },
      predictionHorizonMinutes: 45,
      modelVersion: 'deterministic_safety_engine_v1'
    };
  }

  /**
   * Predict 30-min Glucose Forecast with 90% Conformal Uncertainty Interval
   */
  async predictGlucoseForecast({ glucose, glucoseRoc = 0.0, iob = 0.0, carbs = 0.0, steps = 0.0 }) {
    const payload = {
      glucose: Number(glucose),
      glucose_roc_5m: Number(glucoseRoc),
      iob: Number(iob),
      carbs_recent: Number(carbs),
      steps_30m: Number(steps)
    };

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

      const res = await fetch(`${ML_API_BASE}/api/ml/predict-glucose`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        return {
          success: true,
          predictedGlucose: data.predicted_glucose_mg_dl,
          intervalLower: data.conformal_interval_90pct?.lower_mg_dl,
          intervalUpper: data.conformal_interval_90pct?.upper_mg_dl,
          margin: data.conformal_interval_90pct?.margin_mg_dl || 22.8,
          horizonMinutes: data.prediction_horizon_minutes || 30
        };
      }
    } catch {
      // Offline fallback
    }

    // Deterministic momentum fallback
    const g = Number(glucose);
    const drop = (Number(iob) * 8.5) + (glucoseRoc * -15);
    const carbBuff = Math.min(25, Number(carbs) * 0.22);
    const est = Math.max(40, Math.min(350, Math.round(g - drop + carbBuff)));

    return {
      success: false,
      predictedGlucose: est,
      intervalLower: Math.max(40, est - 22),
      intervalUpper: Math.min(350, est + 22),
      margin: 22.0,
      horizonMinutes: 30
    };
  }
}

export const mlClient = new MLService();
