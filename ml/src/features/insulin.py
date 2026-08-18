#!/usr/bin/env python3
"""
Insulin-On-Board (IOB) & Pharmacokinetic Feature Extractor
Models subcutaneous rapid-acting insulin analog clearance via Mudaliar/Walsh decay.
"""

import pandas as pd
import numpy as np


def compute_iob_activity_fraction(tau_minutes: np.ndarray, dia_hours=4.0) -> np.ndarray:
    """
    Clearance fraction of active insulin remaining at elapsed time tau.
    Decays smoothly from 1.0 at t=0 to 0.0 at t=DIA (240 min).
    """
    total_minutes = dia_hours * 60.0
    tau = np.clip(tau_minutes, 0.0, total_minutes)
    
    # Quadratic smooth clearance curve: S(tau) = (1 - tau/T)^2
    s = np.square(1.0 - (tau / total_minutes))
    s[tau_minutes >= total_minutes] = 0.0
    return s


def extract_insulin_features(df: pd.DataFrame, dia_hours=4.0) -> pd.DataFrame:
    """
    Extracts active IOB, cumulative doses, and basal context.
    """
    out = pd.DataFrame(index=df.index)
    bolus = df["bolus_volume"].fillna(0.0).values
    n = len(bolus)

    # 1. Compute Active IOB using convolution over past 48 steps (4 hours)
    max_steps = int(dia_hours * 12)  # 48 steps of 5 mins
    iob_curve = np.zeros(n)

    # Precompute decay weights for 0..48 steps
    time_steps = np.arange(max_steps) * 5.0
    weights = compute_iob_activity_fraction(time_steps, dia_hours=dia_hours)

    for i in range(n):
        lookback = min(i + 1, max_steps)
        if lookback > 0:
            past_boluses = bolus[i - lookback + 1 : i + 1][::-1]  # most recent first
            iob_curve[i] = np.sum(past_boluses * weights[:lookback])

    out["insulin_iob"] = iob_curve
    out["insulin_bolus_current"] = df["bolus_volume"].fillna(0.0)
    out["insulin_basal_rate"] = df["basal_rate"].ffill().fillna(0.0)

    # 2. Cumulative bolus in past 1h (12 steps), 2h (24 steps)
    out["insulin_bolus_sum_1h"] = df["bolus_volume"].rolling(window=12, min_periods=1).sum().fillna(0.0)
    out["insulin_bolus_sum_2h"] = df["bolus_volume"].rolling(window=24, min_periods=1).sum().fillna(0.0)

    return out
