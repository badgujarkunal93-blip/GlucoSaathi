#!/usr/bin/env python3
"""
Clinical Glucose Regression Metrics & Clarke Error Grid Analysis
"""

import numpy as np
import pandas as pd
from typing import Dict, Tuple


def compute_clarke_error_grid(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Computes exact Clarke Error Grid Analysis (EGA) zone percentages (A, B, C, D, E).
    Reference: Clarke WL et al. Diabetes Care 1987; 10(5): 622-628.
    """
    assert len(y_true) == len(y_pred), "Length mismatch in Clarke EGA."
    n = len(y_true)
    if n == 0:
        return {"zone_a": 0.0, "zone_b": 0.0, "zone_c": 0.0, "zone_d": 0.0, "zone_e": 0.0, "zone_ab": 0.0}

    zones = {"A": 0, "B": 0, "C": 0, "D": 0, "E": 0}

    for ref, pred in zip(y_true, y_pred):
        # Zone A
        if (ref <= 70.0 and pred <= 70.0) or (abs(pred - ref) <= 0.20 * ref):
            zones["A"] += 1
        # Zone E: Catastrophic Inversion
        elif (ref >= 180.0 and pred <= 70.0) or (ref <= 70.0 and pred >= 180.0):
            zones["E"] += 1
        # Zone D: Failure to detect
        elif (ref < 70.0 and pred > 70.0) or (ref > 240.0 and pred < 180.0):
            zones["D"] += 1
        # Zone C: Unnecessary corrective action
        elif (ref >= 70.0 and ref <= 180.0 and pred >= 180.0) or (ref >= 70.0 and ref <= 180.0 and pred <= 70.0):
            zones["C"] += 1
        # Zone B: Benign errors
        else:
            zones["B"] += 1

    pct_a = (zones["A"] / n) * 100.0
    pct_b = (zones["B"] / n) * 100.0
    pct_c = (zones["C"] / n) * 100.0
    pct_d = (zones["D"] / n) * 100.0
    pct_e = (zones["E"] / n) * 100.0

    return {
        "zone_a_pct": round(pct_a, 2),
        "zone_b_pct": round(pct_b, 2),
        "zone_c_pct": round(pct_c, 2),
        "zone_d_pct": round(pct_d, 2),
        "zone_e_pct": round(pct_e, 2),
        "zone_ab_pct": round(pct_a + pct_b, 2)
    }


def evaluate_glucose_regression(y_true: np.ndarray, y_pred: np.ndarray) -> Dict[str, float]:
    """
    Evaluates continuous glucose forecasting metrics: RMSE, MAE, MARD, and Clarke EGA.
    """
    errors = y_pred - y_true
    abs_errors = np.abs(errors)

    rmse = np.sqrt(np.mean(np.square(errors)))
    mae = np.mean(abs_errors)
    
    # MARD (%): Mean Absolute Relative Difference
    safe_y_true = np.where(y_true == 0, 1e-5, y_true)
    mard = np.mean(abs_errors / safe_y_true) * 100.0

    # R-squared
    ss_res = np.sum(np.square(errors))
    ss_tot = np.sum(np.square(y_true - np.mean(y_true)))
    r2 = 1.0 - (ss_res / (ss_tot + 1e-8))

    clarke_results = compute_clarke_error_grid(y_true, y_pred)

    return {
        "rmse": round(float(rmse), 2),
        "mae": round(float(mae), 2),
        "mard_pct": round(float(mard), 2),
        "r2": round(float(r2), 3),
        **clarke_results
    }
