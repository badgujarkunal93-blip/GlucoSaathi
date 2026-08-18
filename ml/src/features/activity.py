#!/usr/bin/env python3
"""
Physical Activity & Exercise Dynamics Feature Extractor
Computes rolling steps, MET estimates, and post-exercise insulin sensitivity.
"""

import pandas as pd
import numpy as np


def compute_post_exercise_sensitivity(steps_series: np.ndarray, threshold_steps=200, decay_half_life_steps=36) -> np.ndarray:
    """
    Computes elevated post-exercise insulin sensitivity multiplier S_ex >= 1.0.
    decay_half_life_steps: 36 steps = 3 hours.
    """
    n = len(steps_series)
    s_ex = np.ones(n)

    current_boost = 0.0
    decay_factor = np.exp(-1.0 / decay_half_life_steps)

    for i in range(n):
        step_val = steps_series[i]
        if step_val >= threshold_steps:
            # Exercise detected (adds boost up to +0.35)
            added_intensity = min(0.35, (step_val - threshold_steps) / 1000.0)
            current_boost = max(current_boost, added_intensity)
        else:
            current_boost *= decay_factor

        s_ex[i] = 1.0 + current_boost

    return s_ex


def extract_activity_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts step counts, rolling activity levels, and S_ex multipliers.
    """
    out = pd.DataFrame(index=df.index)
    steps = df["steps"].fillna(0.0).values
    calories = df.get("calories", pd.Series(0.0, index=df.index)).fillna(0.0).values
    hr = df.get("heart_rate", pd.Series(75.0, index=df.index)).fillna(75.0).values

    out["activity_steps_5m"] = steps
    out["activity_steps_rolling_30m"] = df["steps"].rolling(window=6, min_periods=1).sum().fillna(0.0)
    out["activity_steps_rolling_1h"] = df["steps"].rolling(window=12, min_periods=1).sum().fillna(0.0)
    
    out["activity_calories_5m"] = calories
    out["activity_heart_rate"] = hr
    out["activity_s_ex_multiplier"] = compute_post_exercise_sensitivity(steps)

    return out
