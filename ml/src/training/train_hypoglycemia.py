#!/usr/bin/env python3
"""
Hypoglycemia Risk Prediction Training Pipeline (Task B)
Trains Logistic Regression and Calibrated LightGBM models to predict hypoglycemia (<70 mg/dL in 45m).
Evaluates using Sensitivity, Specificity, Precision, AUROC, AUPRC, Brier Score, and ECE.
"""

import os
import json
import logging
import joblib
from pathlib import Path
import pandas as pd
import numpy as np
from sklearn.linear_model import LogisticRegression
from sklearn.calibration import CalibratedClassifierCV
import lightgbm as lgb

from src.data.split import patient_level_split, FEATURE_COLS
from src.evaluation.classification import evaluate_hypo_classification
from src.evaluation.calibration import compute_expected_calibration_error
from src.models.explainability.explainer import ClinicalRiskExplainer

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

PROCESSED_DIR = Path(__file__).resolve().parents[2] / "data" / "processed"
PRODUCTION_DIR = Path(__file__).resolve().parents[2] / "models" / "production" / "hypo_risk_v1"
REPORTS_DIR = Path(__file__).resolve().parents[2] / "reports" / "evaluation"


def run_hypoglycemia_training():
    PRODUCTION_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    feature_matrix_path = PROCESSED_DIR / "feature_matrix.csv"
    if not feature_matrix_path.exists():
        raise FileNotFoundError(f"Missing {feature_matrix_path}. Run feature pipeline first.")

    logger.info("Loading feature matrix for hypoglycemia prediction...")
    df = pd.read_csv(feature_matrix_path)

    # 1. Patient-Level Split
    splits = patient_level_split(df, seed=42)
    train_df, val_df, test_df = splits["train"], splits["val"], splits["test"]

    X_train, y_train = train_df[FEATURE_COLS], train_df["target_hypo_45m"].values
    X_val, y_val = val_df[FEATURE_COLS], val_df["target_hypo_45m"].values
    X_test, y_test = test_df[FEATURE_COLS], test_df["target_hypo_45m"].values

    hypo_prevalence_train = (np.sum(y_train) / len(y_train)) * 100.0
    hypo_prevalence_test = (np.sum(y_test) / len(y_test)) * 100.0
    logger.info(f"Class Distribution: Train Hypo={hypo_prevalence_train:.2f}%, Test Hypo={hypo_prevalence_test:.2f}%")

    # 2. Benchmark Classifiers
    models = {
        "logistic_regression": LogisticRegression(class_weight="balanced", max_iter=500, random_state=42),
        "lightgbm": lgb.LGBMClassifier(
            n_estimators=200,
            learning_rate=0.03,
            max_depth=5,
            scale_pos_weight=4.0,
            random_state=42,
            verbosity=-1
        )
    }

    benchmark_results = {}
    best_model_name = None
    best_val_auprc = -1.0

    # 3. Train and Evaluate
    for name, model in models.items():
        logger.info(f"Training {name} classifier...")
        model.fit(X_train, y_train)

        # Validation Probabilities
        val_probs = model.predict_proba(X_val)[:, 1]
        val_metrics = evaluate_hypo_classification(y_val, val_probs, threshold=0.35)
        val_ece, _ = compute_expected_calibration_error(y_val, val_probs)
        val_metrics["ece"] = val_ece

        # Test Probabilities on Unseen Patients
        test_probs = model.predict_proba(X_test)[:, 1]
        test_metrics = evaluate_hypo_classification(y_test, test_probs, threshold=0.35)
        test_ece, _ = compute_expected_calibration_error(y_test, test_probs)
        test_metrics["ece"] = test_ece

        logger.info(f"[{name.upper()}] Val AUPRC: {val_metrics['auprc']} | Test AUPRC: {test_metrics['auprc']} | Sensitivity: {test_metrics['sensitivity_recall']*100:.1f}% | Specificity: {test_metrics['specificity']*100:.1f}% | ECE: {test_metrics['ece']}")

        benchmark_results[name] = {
            "val_metrics": val_metrics,
            "test_metrics": test_metrics
        }

        if val_metrics["auprc"] > best_val_auprc:
            best_val_auprc = val_metrics["auprc"]
            best_model_name = name

    # 4. Calibrate Best Classifier using Platt Scaling (CalibratedClassifierCV)
    logger.info(f"Calibrating best model ({best_model_name.upper()})...")
    base_best = models[best_model_name]
    calibrated_clf = CalibratedClassifierCV(
        estimator=lgb.LGBMClassifier(
            n_estimators=200,
            learning_rate=0.03,
            max_depth=5,
            scale_pos_weight=4.0,
            random_state=42,
            verbosity=-1
        ),
        method="sigmoid",
        cv=3
    )
    calibrated_clf.fit(X_train, y_train)

    cal_test_probs = calibrated_clf.predict_proba(X_test)[:, 1]
    cal_test_metrics = evaluate_hypo_classification(y_test, cal_test_probs, threshold=0.30)
    cal_test_ece, _ = compute_expected_calibration_error(y_test, cal_test_probs)
    cal_test_metrics["ece"] = cal_test_ece

    logger.info(f"[CALIBRATED {best_model_name.upper()}] Test AUPRC: {cal_test_metrics['auprc']} | Sensitivity: {cal_test_metrics['sensitivity_recall']*100:.1f}% | ECE: {cal_test_metrics['ece']}")

    # 5. Extract Explainability Weights
    explainer = ClinicalRiskExplainer(base_best, FEATURE_COLS)
    global_importance = explainer.get_global_importance()
    logger.info(f"Global Physiological Factor Attribution: {global_importance}")

    # 6. Save Production Artifacts
    joblib.dump(calibrated_clf, PRODUCTION_DIR / "model.joblib")
    joblib.dump(base_best, PRODUCTION_DIR / "base_tree_model.joblib")

    metadata = {
        "model_name": f"hypo_risk_45m_{best_model_name}_calibrated",
        "task": "hypoglycemia_risk_prediction",
        "horizon_minutes": 45,
        "decision_threshold": 0.30,
        "features": FEATURE_COLS,
        "feature_medians": splits["feature_medians"],
        "train_patients": splits["train_patients"],
        "val_patients": splits["val_patients"],
        "test_patients": splits["test_patients"],
        "test_metrics": cal_test_metrics,
        "benchmark_comparison": benchmark_results,
        "physiological_factor_weights": global_importance,
        "clinical_safety_notice": "Informational risk estimate only. Confirm with prescribed care plan."
    }

    with open(PRODUCTION_DIR / "metadata.json", "w", encoding="utf-8") as f:
        json.dump(metadata, f, indent=2)

    with open(REPORTS_DIR / "hypoglycemia_benchmark.json", "w", encoding="utf-8") as f:
        json.dump(benchmark_results, f, indent=2)

    logger.info(f"Saved production hypoglycemia model to {PRODUCTION_DIR}")
    return benchmark_results


if __name__ == "__main__":
    run_hypoglycemia_training()
