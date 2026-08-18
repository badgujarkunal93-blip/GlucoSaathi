#!/usr/bin/env python3
"""
Continuous Glucose Forecasting Training Pipeline (Task A)
Trains Persistence baseline, Ridge, LightGBM, and XGBoost models on real T1D data.
Evaluates using RMSE, MAE, MARD, Clarke Error Grid Analysis, and Conformal intervals.
"""

import os
import json
import logging
import joblib
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.linear_model import Ridge
import lightgbm as lgb
import xgboost as xgb

from src.data.split import patient_level_split, FEATURE_COLS
from src.models.baselines.persistence import PersistenceGlucoseForecaster
from src.evaluation.regression import evaluate_glucose_regression
from src.evaluation.conformal import ConformalPredictor

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

PROCESSED_DIR = Path(__file__).resolve().parents[2] / "data" / "processed"
PRODUCTION_DIR = Path(__file__).resolve().parents[2] / "models" / "production" / "glucose_forecaster_v1"
REPORTS_DIR = Path(__file__).resolve().parents[2] / "reports" / "evaluation"


def run_glucose_training():
    PRODUCTION_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    feature_matrix_path = PROCESSED_DIR / "feature_matrix.csv"
    if not feature_matrix_path.exists():
        raise FileNotFoundError(f"Missing {feature_matrix_path}. Run feature pipeline first.")

    logger.info("Loading feature matrix for glucose forecasting...")
    df = pd.read_csv(feature_matrix_path)

    # 1. Patient-Level Split (72% Train, 12% Val, 16% Test)
    splits = patient_level_split(df, seed=42)
    train_df, val_df, test_df = splits["train"], splits["val"], splits["test"]

    X_train, y_train = train_df[FEATURE_COLS], train_df["target_glucose_30m"].values
    X_val, y_val = val_df[FEATURE_COLS], val_df["target_glucose_30m"].values
    X_test, y_test = test_df[FEATURE_COLS], test_df["target_glucose_30m"].values

    logger.info(f"Dataset partitioned: Train={len(X_train)}, Val={len(X_val)}, Test={len(X_test)} samples.")

    # 2. Benchmark Models Dictionary
    models = {
        "persistence": PersistenceGlucoseForecaster(),
        "ridge": Ridge(alpha=1.0),
        "lightgbm": lgb.LGBMRegressor(
            n_estimators=150,
            learning_rate=0.05,
            max_depth=6,
            subsample=0.8,
            colsample_bytree=0.8,
            random_state=42,
            verbosity=-1
        ),
        "xgboost": xgb.XGBRegressor(
            n_estimators=150,
            learning_rate=0.05,
            max_depth=5,
            subsample=0.8,
            random_state=42,
            verbosity=0
        )
    }

    benchmark_results = {}
    best_model_name = None
    best_val_rmse = float("inf")

    # 3. Train and Evaluate each model
    for name, model in models.items():
        logger.info(f"Training {name} model...")
        model.fit(X_train, y_train)

        # Validation Performance
        val_preds = model.predict(X_val)
        val_metrics = evaluate_glucose_regression(y_val, val_preds)

        # Test Performance on Unseen Patients
        test_preds = model.predict(X_test)
        test_metrics = evaluate_glucose_regression(y_test, test_preds)

        logger.info(f"[{name.upper()}] Val RMSE: {val_metrics['rmse']} mg/dL | Test RMSE: {test_metrics['rmse']} mg/dL | Clarke Zone A+B: {test_metrics['zone_ab_pct']}%")

        benchmark_results[name] = {
            "val_metrics": val_metrics,
            "test_metrics": test_metrics
        }

        if val_metrics["rmse"] < best_val_rmse:
            best_val_rmse = val_metrics["rmse"]
            best_model_name = name

    # 4. Calibrate Conformal Prediction Intervals for Best Model
    best_model = models[best_model_name]
    logger.info(f"Selected Best Model: {best_model_name.upper()} (Val RMSE: {best_val_rmse})")
    
    val_preds_best = best_model.predict(X_val)
    conformal_calibrator = ConformalPredictor(alpha=0.10)  # 90% coverage
    q_hat = conformal_calibrator.calibrate(y_val, val_preds_best)
    logger.info(f"Calibrated 90% Conformal Interval Margin: ±{round(q_hat, 2)} mg/dL")

    # 5. Serialize Production Artifacts
    model_artifact_path = PRODUCTION_DIR / "model.joblib"
    joblib.dump(best_model, model_artifact_path)

    metadata = {
        "model_name": f"glucose_forecaster_30m_{best_model_name}",
        "task": "continuous_glucose_forecasting",
        "horizon_minutes": 30,
        "conformal_q_hat_90pct": round(q_hat, 2),
        "features": FEATURE_COLS,
        "feature_medians": splits["feature_medians"],
        "train_patients": splits["train_patients"],
        "val_patients": splits["val_patients"],
        "test_patients": splits["test_patients"],
        "test_metrics": benchmark_results[best_model_name]["test_metrics"],
        "benchmark_comparison": benchmark_results,
        "clinical_safety_notice": "Informational decision support only. Confirm all actions with your prescribed care plan."
    }

    with open(PRODUCTION_DIR / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    with open(REPORTS_DIR / "glucose_forecasting_benchmark.json", "w", encoding="utf-8") as f:
        json.dump(benchmark_results, f, indent=2)

    logger.info(f"Saved production model and metadata to {PRODUCTION_DIR}")
    return benchmark_results


if __name__ == "__main__":
    run_glucose_training()
