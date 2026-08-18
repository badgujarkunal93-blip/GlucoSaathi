#!/usr/bin/env python3
"""
Inductive Conformal Prediction Intervals
Provides finite-sample guaranteed prediction intervals for continuous glucose forecasts.
"""

import numpy as np


class ConformalPredictor:
    def __init__(self, alpha: float = 0.10):
        """
        alpha: Miscoverage rate (e.g. alpha=0.10 -> 90% coverage interval)
        """
        self.alpha = alpha
        self.q_hat = 0.0

    def calibrate(self, y_true_cal: np.ndarray, y_pred_cal: np.ndarray):
        """
        Computes the empirical non-conformity score quantile on calibration set.
        """
        residuals = np.abs(y_true_cal - y_pred_cal)
        n = len(residuals)
        # Quantile index: ceil((n + 1) * (1 - alpha)) / n
        q_level = min(1.0, np.ceil((n + 1) * (1.0 - self.alpha)) / n)
        self.q_hat = float(np.quantile(residuals, q_level))
        return self.q_hat

    def predict_interval(self, y_pred: np.ndarray) -> np.ndarray:
        """
        Returns [lower, upper] interval bounds for predictions.
        """
        lower = np.clip(y_pred - self.q_hat, 20.0, 600.0)
        upper = np.clip(y_pred + self.q_hat, 20.0, 600.0)
        return np.column_stack([lower, upper])
