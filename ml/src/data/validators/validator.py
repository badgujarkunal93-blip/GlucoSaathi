#!/usr/bin/env python3
"""
Clinical Data Validator for GlucoSaathi ML Pipeline
Validates file integrity, column schemas, types, and physiological ranges.
"""

import pandas as pd
import numpy as np
import logging
from typing import Dict, List, Tuple

logger = logging.getLogger(__name__)

PHYSIOLOGICAL_BOUNDS = {
    "glucose": (20.0, 600.0),       # mg/dL
    "basal_rate": (0.0, 5.0),       # Units/hour
    "bolus_volume": (0.0, 35.0),     # Units
    "carbs": (0.0, 250.0),          # grams
    "steps": (0.0, 1000.0),         # steps in 5-min window
    "calories": (0.0, 100.0),       # kcal in 5-min window
    "heart_rate": (30.0, 220.0),    # BPM
}


class DataQualityReport:
    def __init__(self, patient_id: str):
        self.patient_id = patient_id
        self.total_rows = 0
        self.valid_rows = 0
        self.glucose_missing_pct = 0.0
        self.out_of_bounds_counts = {}
        self.time_gaps_count = 0
        self.is_valid = True
        self.warnings: List[str] = []

    def to_dict(self) -> Dict:
        return {
            "patient_id": self.patient_id,
            "total_rows": self.total_rows,
            "valid_rows": self.valid_rows,
            "glucose_missing_pct": round(self.glucose_missing_pct, 2),
            "out_of_bounds_counts": self.out_of_bounds_counts,
            "time_gaps_count": self.time_gaps_count,
            "is_valid": self.is_valid,
            "warnings": self.warnings
        }


def validate_patient_dataframe(df: pd.DataFrame, patient_id: str) -> Tuple[pd.DataFrame, DataQualityReport]:
    report = DataQualityReport(patient_id)
    report.total_rows = len(df)

    if report.total_rows == 0:
        report.is_valid = False
        report.warnings.append("Empty dataset.")
        return df, report

    # 1. Validate Timestamp
    if "time" not in df.columns:
        report.is_valid = False
        report.warnings.append("Missing required 'time' column.")
        return df, report

    df["timestamp"] = pd.to_datetime(df["time"], errors="coerce")
    invalid_times = df["timestamp"].isna().sum()
    if invalid_times > 0:
        report.warnings.append(f"{invalid_times} rows with unparseable timestamps.")
        df = df.dropna(subset=["timestamp"])

    df = df.sort_values("timestamp").reset_index(drop=True)

    # 2. Check for Duplicates
    duplicates = df.duplicated(subset=["timestamp"]).sum()
    if duplicates > 0:
        report.warnings.append(f"{duplicates} duplicate timestamps dropped.")
        df = df.drop_duplicates(subset=["timestamp"]).reset_index(drop=True)

    # 3. Validate Physiological Ranges & Flag Sensor Glitches
    cleaned_df = df.copy()
    cleaned_df["patient_id"] = patient_id

    for col, (low, high) in PHYSIOLOGICAL_BOUNDS.items():
        if col in cleaned_df.columns:
            cleaned_df[col] = pd.to_numeric(cleaned_df[col], errors="coerce")
            out_of_bounds = ((cleaned_df[col] < low) | (cleaned_df[col] > high)).sum()
            report.out_of_bounds_counts[col] = int(out_of_bounds)
            if out_of_bounds > 0:
                report.warnings.append(f"{col}: {out_of_bounds} values out of bounds [{low}, {high}]. Clamped/Masked.")
                # Mask extreme non-physiological sensor faults
                if col == "glucose":
                    cleaned_df.loc[(cleaned_df[col] < low) | (cleaned_df[col] > high), col] = np.nan

    # 4. Check Glucose Missingness
    if "glucose" in cleaned_df.columns:
        missing_glucose = cleaned_df["glucose"].isna().sum()
        report.glucose_missing_pct = (missing_glucose / len(cleaned_df)) * 100.0

    # 5. Check Time Continuity (5-minute expected grid)
    time_diffs = cleaned_df["timestamp"].diff().dt.total_seconds() / 60.0
    large_gaps = (time_diffs > 15.0).sum()
    report.time_gaps_count = int(large_gaps)

    report.valid_rows = len(cleaned_df)
    return cleaned_df, report
