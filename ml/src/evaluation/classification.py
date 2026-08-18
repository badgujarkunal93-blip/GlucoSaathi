#!/usr/bin/env python3
"""
Clinical Hypoglycemia Classification & Imbalance Metrics
Computes Sensitivity, Specificity, Precision, F1, AUROC, AUPRC, and False Alarm Rates.
"""

import numpy as np
from typing import Dict
from sklearn.metrics import (
    roc_auc_score,
    precision_recall_curve,
    auc,
    confusion_matrix,
    f1_score,
    brier_score_loss
)


def evaluate_hypo_classification(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    threshold: float = 0.5
) -> Dict[str, float]:
    """
    Evaluates hypoglycemia risk classification under severe class imbalance.
    """
    y_pred = (y_prob >= threshold).astype(int)
    y_true_int = y_true.astype(int)

    # Confusion Matrix: TN, FP, FN, TP
    tn, fp, fn, tp = confusion_matrix(y_true_int, y_pred, labels=[0, 1]).ravel()

    sensitivity = tp / (tp + fn) if (tp + fn) > 0 else 0.0
    specificity = tn / (tn + fp) if (tn + fp) > 0 else 0.0
    precision = tp / (tp + fp) if (tp + fp) > 0 else 0.0
    f1 = f1_score(y_true_int, y_pred, zero_division=0)

    # AUROC
    try:
        auroc = roc_auc_score(y_true_int, y_prob)
    except Exception:
        auroc = 0.5

    # AUPRC (Area Under Precision-Recall Curve)
    try:
        precisions, recalls, _ = precision_recall_curve(y_true_int, y_prob)
        auprc = auc(recalls, precisions)
    except Exception:
        auprc = 0.0

    brier = brier_score_loss(y_true_int, y_prob)

    # False Alarm Rate per patient-week (assuming 5-min intervals: 2016 intervals/week)
    total_intervals = len(y_true)
    patient_weeks = max(1.0, total_intervals / 2016.0)
    false_alarms_per_week = fp / patient_weeks

    return {
        "sensitivity_recall": round(float(sensitivity), 4),
        "specificity": round(float(specificity), 4),
        "precision": round(float(precision), 4),
        "f1_score": round(float(f1), 4),
        "auroc": round(float(auroc), 4),
        "auprc": round(float(auprc), 4),
        "brier_score": round(float(brier), 4),
        "false_alarms_per_week": round(float(false_alarms_per_week), 2),
        "tp": int(tp),
        "fp": int(fp),
        "fn": int(fn),
        "tn": int(tn)
    }
