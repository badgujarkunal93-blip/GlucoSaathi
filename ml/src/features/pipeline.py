#!/usr/bin/env python3
"""
Master Feature Pipeline
Extracts all physiological, insulin, meal, activity, and temporal features
patient-by-patient to ensure strict non-leakage, and generates targets.
"""

import logging
from pathlib import Path
import pandas as pd
import numpy as np

from src.features.glucose import extract_glucose_features
from src.features.insulin import extract_insulin_features
from src.features.meals import extract_meal_features
from src.features.activity import extract_activity_features
from src.features.temporal import extract_temporal_features

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

PROCESSED_DIR = Path(__file__).resolve().parents[2] / "data" / "processed"


def build_feature_matrix(harmonized_df: pd.DataFrame = None) -> pd.DataFrame:
    if harmonized_df is None:
        csv_path = PROCESSED_DIR / "harmonized_5min.csv"
        if not csv_path.exists():
            raise FileNotFoundError(f"Missing harmonized dataset at {csv_path}. Run harmonizer first.")
        logger.info(f"Loading harmonized dataset from {csv_path}...")
        harmonized_df = pd.read_csv(csv_path)

    patients = harmonized_df["patient_id"].unique()
    logger.info(f"Extracting features across {len(patients)} unique patients...")

    patient_feature_dfs = []

    for pid in patients:
        pdf = harmonized_df[harmonized_df["patient_id"] == pid].copy()
        pdf = pdf.sort_values("timestamp").reset_index(drop=True)

        if len(pdf) < 50:
            logger.warning(f"Patient {pid} has too few points ({len(pdf)}). Skipping.")
            continue

        # Extract sub-domain features
        g_feat = extract_glucose_features(pdf)
        i_feat = extract_insulin_features(pdf)
        m_feat = extract_meal_features(pdf)
        a_feat = extract_activity_features(pdf)
        t_feat = extract_temporal_features(pdf)

        # Target A: Glucose at t + 30 min (6 steps of 5 mins)
        target_g30 = pdf["glucose"].shift(-6)

        # Target B: Hypoglycemia (< 70 mg/dL) within next 45 min (9 steps of 5 mins)
        # Check if min glucose over next 1..9 steps is < 70
        future_min_glucose_45m = pd.concat(
            [pdf["glucose"].shift(-k) for k in range(1, 10)], axis=1
        ).min(axis=1)
        target_hypo_45m = (future_min_glucose_45m < 70.0).astype(float)
        # Where future glucose is missing, target should be NaN
        target_hypo_45m[future_min_glucose_45m.isna()] = np.nan

        # Combine all features for this patient
        combined = pd.concat([
            pd.Series(pid, index=pdf.index, name="patient_id"),
            pdf["timestamp"].rename("timestamp"),
            g_feat,
            i_feat,
            m_feat,
            a_feat,
            t_feat,
            target_g30.rename("target_glucose_30m"),
            target_hypo_45m.rename("target_hypo_45m")
        ], axis=1)

        # Drop rows where target or key glucose lag features are NaN (warmup & trailing edges)
        valid_mask = ~combined["target_glucose_30m"].isna() & ~combined["glucose_mean_1h"].isna()
        cleaned_patient = combined[valid_mask].copy()

        patient_feature_dfs.append(cleaned_patient)
        logger.info(f"Patient {pid}: {len(cleaned_patient)} valid feature rows generated.")

    master_features = pd.concat(patient_feature_dfs, ignore_index=True)
    out_path = PROCESSED_DIR / "feature_matrix.csv"
    master_features.to_csv(out_path, index=False)
    logger.info(f"Successfully generated master feature matrix ({len(master_features)} rows) -> {out_path}")

    return master_features


if __name__ == "__main__":
    build_feature_matrix()
