#!/usr/bin/env python3
"""
Carbohydrate-On-Board (COB) & Meal Dynamics Feature Extractor
Models gastrointestinal carbohydrate absorption and cumulative exposure.
"""

import pandas as pd
import numpy as np


def compute_cob(carbs_series: np.ndarray, absorption_rate_g_per_hr=30.0) -> np.ndarray:
    """
    Computes unabsorbed Carbohydrate-On-Board (COB) in grams.
    absorption_rate_g_per_hr: default 30g/hr = 2.5g per 5-min step.
    """
    n = len(carbs_series)
    cob = np.zeros(n)
    decay_per_step = absorption_rate_g_per_hr / 12.0  # 5 min = 1/12 hour

    current_cob = 0.0
    for i in range(n):
        new_carbs = carbs_series[i]
        current_cob = max(0.0, current_cob + new_carbs - decay_per_step)
        cob[i] = current_cob

    return cob


def extract_meal_features(df: pd.DataFrame, absorption_rate_g_per_hr=30.0) -> pd.DataFrame:
    """
    Extracts COB, cumulative carbs in past 1h, 2h, 4h, and meal event indicators.
    """
    out = pd.DataFrame(index=df.index)
    carbs = df["carbs"].fillna(0.0).values

    out["meal_cob"] = compute_cob(carbs, absorption_rate_g_per_hr=absorption_rate_g_per_hr)
    out["meal_carbs_current"] = carbs
    out["meal_is_event"] = (carbs > 0.0).astype(float)

    # Cumulative intake in past 1h (12 steps), 2h (24 steps), 4h (48 steps)
    out["meal_carbs_sum_1h"] = df["carbs"].rolling(window=12, min_periods=1).sum().fillna(0.0)
    out["meal_carbs_sum_2h"] = df["carbs"].rolling(window=24, min_periods=1).sum().fillna(0.0)
    out["meal_carbs_sum_4h"] = df["carbs"].rolling(window=48, min_periods=1).sum().fillna(0.0)

    return out
