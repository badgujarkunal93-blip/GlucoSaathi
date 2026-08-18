#!/usr/bin/env python3
"""
Patient-Level Data Splitting & Leakage Verification
Partitions clinical dataset by Subject ID to prevent inter-patient and temporal leakage.
"""

import logging
from pathlib import Path
from typing import Tuple, List, Dict
import pandas as pd
import numpy as np

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

FEATURE_COLS = [
    # Glucose features
    "glucose_current",
    "glucose_lag_5m",
    "glucose_lag_10m",
    "glucose_lag_15m",
    "glucose_lag_30m",
    "glucose_lag_45m",
    "glucose_lag_60m",
    "glucose_roc_5m",
    "glucose_roc_15m",
    "glucose_roc_30m",
    "glucose_accel",
    "glucose_mean_1h",
    "glucose_std_1h",
    "glucose_lbgi_point",
    "glucose_lbgi_1h",
    # Insulin features
    "insulin_iob",
    "insulin_bolus_current",
    "insulin_basal_rate",
    "insulin_bolus_sum_1h",
    "insulin_bolus_sum_2h",
    # Meal features
    "meal_cob",
    "meal_carbs_current",
    "meal_is_event",
    "meal_carbs_sum_1h",
    "meal_carbs_sum_2h",
    "meal_carbs_sum_4h",
    # Activity features
    "activity_steps_5m",
    "activity_steps_rolling_30m",
    "activity_steps_rolling_1h",
    "activity_calories_5m",
    "activity_heart_rate",
    "activity_s_ex_multiplier",
    # Temporal features
    "temporal_sin_time",
    "temporal_cos_time",
    "temporal_day_of_week",
    "temporal_is_weekend",
    "temporal_is_night"
]


def patient_level_split(
    df: pd.DataFrame,
    seed: int = 42,
    train_ratio: float = 0.72,
    val_ratio: float = 0.12
) -> Dict[str, pd.DataFrame]:
    patients = sorted(df["patient_id"].unique())
    rng = np.random.default_rng(seed)
    shuffled_patients = rng.permutation(patients)

    n_total = len(patients)
    n_train = int(np.round(n_total * train_ratio))
    n_val = int(np.round(n_total * val_ratio))

    train_pids = list(shuffled_patients[:n_train])
    val_pids = list(shuffled_patients[n_train : n_train + n_val])
    test_pids = list(shuffled_patients[n_train + n_val :])

    logger.info(f"Split {n_total} patients -> Train ({len(train_pids)}), Val ({len(val_pids)}), Test ({len(test_pids)})")
    logger.info(f"Train Patients: {train_pids}")
    logger.info(f"Val Patients: {val_pids}")
    logger.info(f"Test Patients (Held Unseen): {test_pids}")

    # Verify zero patient overlap
    assert len(set(train_pids) & set(val_pids)) == 0, "Leakage: Train & Val patient overlap!"
    assert len(set(train_pids) & set(test_pids)) == 0, "Leakage: Train & Test patient overlap!"
    assert len(set(val_pids) & set(test_pids)) == 0, "Leakage: Val & Test patient overlap!"

    train_df = df[df["patient_id"].isin(train_pids)].copy()
    val_df = df[df["patient_id"].isin(val_pids)].copy()
    test_df = df[df["patient_id"].isin(test_pids)].copy()

    # Fill remaining NaNs in features with column medians from training set
    feature_medians = train_df[FEATURE_COLS].median()
    train_df[FEATURE_COLS] = train_df[FEATURE_COLS].fillna(feature_medians)
    val_df[FEATURE_COLS] = val_df[FEATURE_COLS].fillna(feature_medians)
    test_df[FEATURE_COLS] = test_df[FEATURE_COLS].fillna(feature_medians)

    return {
        "train": train_df,
        "val": val_df,
        "test": test_df,
        "train_patients": train_pids,
        "val_patients": val_pids,
        "test_patients": test_pids,
        "feature_medians": feature_medians.to_dict()
    }
