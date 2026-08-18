#!/usr/bin/env python3
"""
Probability Calibration & Reliability Curve Analysis
Computes Expected Calibration Error (ECE) and provides Platt Scaling calibration.
"""

import numpy as np
from typing import Dict, Tuple
from sklearn.calibration import calibration_curve


def compute_expected_calibration_error(
    y_true: np.ndarray,
    y_prob: np.ndarray,
    n_bins: int = 10
) -> Tuple[float, Dict]:
    """
    Computes Expected Calibration Error (ECE) across n_bins equal probability intervals.
    """
    prob_true, prob_pred = calibration_curve(y_true, y_prob, n_bins=n_bins, strategy="uniform")

    bin_edges = np.linspace(0.0, 1.0, n_bins + 1)
    bin_assignments = np.digitize(y_prob, bin_edges) - 1

    ece = 0.0
    n_total = len(y_true)

    bin_stats = []
    for b in range(n_bins):
        mask = bin_assignments == b
        n_b = np.sum(mask)
        if n_b > 0:
            acc_b = np.mean(y_true[mask])
            conf_b = np.mean(y_prob[mask])
            diff = abs(acc_b - conf_b)
            ece += (n_b / n_total) * diff
            bin_stats.append({
                "bin": b,
                "count": int(n_b),
                "accuracy": round(float(acc_b), 4),
                "confidence": round(float(conf_b), 4)
            })

    return round(float(ece), 4), {"bin_stats": bin_stats}
