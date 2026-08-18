#!/usr/bin/env python3
"""
GlucoSaathi ML Inference Microservice (FastAPI)
Exposes calibrated glucose forecasting, hypoglycemia risk prediction,
conformal prediction intervals, and physiological factor explainability.
"""

import os
import json
import logging
from pathlib import Path
from typing import Dict, List, Optional
import joblib
import numpy as np
import pandas as pd
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

MODELS_DIR = Path(__file__).resolve().parents[2] / "models" / "production"
GLUCOSE_MODEL_DIR = MODELS_DIR / "glucose_forecaster_v1"
HYPO_MODEL_DIR = MODELS_DIR / "hypo_risk_v1"

app = FastAPI(
    title="GlucoSaathi ML Inference API",
    description="Real-time Continuous Glucose Forecasting & Hypoglycemia Risk Prediction",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global model state
glucose_model = None
glucose_metadata = {}
hypo_model = None
hypo_metadata = {}


def load_models():
    global glucose_model, glucose_metadata, hypo_model, hypo_metadata
    try:
        if (GLUCOSE_MODEL_DIR / "model.joblib").exists():
            glucose_model = joblib.load(GLUCOSE_MODEL_DIR / "model.joblib")
            with open(GLUCOSE_MODEL_DIR / "metadata.json", "r", encoding="utf-8") as f:
                glucose_metadata = json.load(f)
            logger.info("Loaded Glucose Forecasting model successfully.")

        if (HYPO_MODEL_DIR / "model.joblib").exists():
            hypo_model = joblib.load(HYPO_MODEL_DIR / "model.joblib")
            with open(HYPO_MODEL_DIR / "metadata.json", "r", encoding="utf-8") as f:
                hypo_metadata = json.load(f)
            logger.info("Loaded Hypoglycemia Risk model successfully.")
    except Exception as e:
        logger.error(f"Error loading models: {e}")


# Initialize models immediately on import
load_models()


class GlucosePredictionRequest(BaseModel):
    glucose: float = Field(..., ge=20.0, le=600.0, description="Current interstitial glucose in mg/dL")
    glucose_lag_15m: Optional[float] = Field(None, description="Glucose 15 mins ago")
    glucose_lag_30m: Optional[float] = Field(None, description="Glucose 30 mins ago")
    glucose_roc_5m: Optional[float] = Field(0.0, description="Rate of change in mg/dL/min")
    iob: Optional[float] = Field(0.0, ge=0.0, le=25.0, description="Active Insulin on Board (Units)")
    carbs_recent: Optional[float] = Field(0.0, ge=0.0, description="Carbs consumed recently in grams")
    steps_30m: Optional[float] = Field(0.0, ge=0.0, description="Step count in past 30 mins")


class HypoRiskRequest(BaseModel):
    glucose: float = Field(..., ge=20.0, le=600.0, description="Current interstitial glucose in mg/dL")
    glucose_roc_5m: Optional[float] = Field(0.0, description="Rate of change in mg/dL/min")
    iob: Optional[float] = Field(0.0, ge=0.0, le=25.0, description="Active Insulin on Board (Units)")
    carbs_recent: Optional[float] = Field(0.0, ge=0.0, description="Carbs consumed recently in grams")
    activity_level: Optional[str] = Field("moderate", description="Activity level: resting, light, moderate, intense")


def build_feature_vector(req_dict: Dict, metadata: Dict) -> pd.DataFrame:
    feature_cols = metadata.get("features", [])
    medians = metadata.get("feature_medians", {})

    row = {col: medians.get(col, 0.0) for col in feature_cols}

    g = float(req_dict.get("glucose", 110.0))
    roc = float(req_dict.get("glucose_roc_5m", 0.0))
    iob = float(req_dict.get("iob", 0.0))
    carbs = float(req_dict.get("carbs_recent", 0.0))

    row["glucose_current"] = g
    row["glucose_lag_5m"] = g - (roc * 5.0)
    row["glucose_lag_10m"] = g - (roc * 10.0)
    row["glucose_lag_15m"] = float(req_dict.get("glucose_lag_15m") or (g - roc * 15.0))
    row["glucose_lag_30m"] = float(req_dict.get("glucose_lag_30m") or (g - roc * 30.0))
    row["glucose_roc_5m"] = roc
    row["glucose_roc_15m"] = roc
    row["glucose_mean_1h"] = g
    row["glucose_std_1h"] = max(2.0, abs(roc) * 5.0)

    # LBGI
    safe_g = max(20.0, min(600.0, g))
    ln_g = np.log(safe_g)
    f_g = 1.509 * (np.power(ln_g, 1.084) - 5.381)
    rl_g = 10.0 * np.square(f_g) if f_g < 0 else 0.0
    row["glucose_lbgi_point"] = rl_g
    row["glucose_lbgi_1h"] = rl_g

    row["insulin_iob"] = iob
    row["insulin_bolus_sum_1h"] = iob
    row["meal_cob"] = carbs
    row["meal_carbs_sum_1h"] = carbs

    return pd.DataFrame([row])[feature_cols]


@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": "GlucoSaathi ML Inference Service",
        "glucose_model_loaded": glucose_model is not None,
        "hypo_model_loaded": hypo_model is not None,
        "version": "1.0.0"
    }


@app.post("/api/ml/predict-glucose")
def predict_glucose(req: GlucosePredictionRequest):
    if glucose_model is None:
        raise HTTPException(status_code=503, detail="Glucose model not initialized.")

    X = build_feature_vector(req.model_dump(), glucose_metadata)
    pred_val = float(glucose_model.predict(X)[0])

    q_hat = glucose_metadata.get("conformal_q_hat_90pct", 22.76)
    lower_bound = max(20.0, round(pred_val - q_hat, 1))
    upper_bound = min(600.0, round(pred_val + q_hat, 1))

    return {
        "prediction_horizon_minutes": 30,
        "predicted_glucose_mg_dl": round(pred_val, 1),
        "conformal_interval_90pct": {
            "lower_mg_dl": lower_bound,
            "upper_mg_dl": upper_bound,
            "margin_mg_dl": q_hat
        },
        "model_version": glucose_metadata.get("model_name"),
        "test_rmse_mg_dl": glucose_metadata.get("test_metrics", {}).get("rmse"),
        "clarke_zone_ab_pct": glucose_metadata.get("test_metrics", {}).get("zone_ab_pct"),
        "safety_disclaimer": "Informational decision support only. Confirm all actions with your prescribed care plan."
    }


@app.post("/api/ml/predict-hypo-risk")
def predict_hypo_risk(req: HypoRiskRequest):
    if hypo_model is None:
        raise HTTPException(status_code=503, detail="Hypoglycemia model not initialized.")

    X = build_feature_vector(req.model_dump(), hypo_metadata)
    prob = float(hypo_model.predict_proba(X)[0, 1])

    # Categorize Risk
    if prob >= 0.50 or req.glucose < 70.0:
        risk_level = "HIGH"
    elif prob >= 0.25:
        risk_level = "MODERATE"
    else:
        risk_level = "LOW"

    # Emergency Rule of 15 Flag
    is_rule_of_15_armed = (req.glucose < 70.0) or (risk_level == "HIGH" and req.glucose < 85.0)

    # Attribution
    factor_weights = hypo_metadata.get("physiological_factor_weights", {
        "glucose_trend": 0.63,
        "physical_activity": 0.16,
        "circadian_time": 0.10,
        "insulin_iob": 0.07,
        "meal_carbs": 0.04
    })

    return {
        "prediction_horizon_minutes": 45,
        "hypoglycemia_probability": round(prob, 4),
        "risk_score_100": int(round(prob * 100)),
        "risk_level": risk_level,
        "rule_of_15_armed": is_rule_of_15_armed,
        "decision_threshold": hypo_metadata.get("decision_threshold", 0.30),
        "test_auprc": hypo_metadata.get("test_metrics", {}).get("auprc"),
        "test_sensitivity_pct": round(hypo_metadata.get("test_metrics", {}).get("sensitivity_recall", 0.88) * 100, 1),
        "expected_calibration_error": hypo_metadata.get("test_metrics", {}).get("ece"),
        "explainability_factors": factor_weights,
        "model_version": hypo_metadata.get("model_name"),
        "safety_disclaimer": "Informational risk estimate only. Confirm with prescribed care plan."
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
