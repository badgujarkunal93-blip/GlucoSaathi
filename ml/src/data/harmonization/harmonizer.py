#!/usr/bin/env python3
"""
Canonical Data Harmonization Pipeline
Harmonizes multi-patient raw clinical data into uniform 5-minute canonical format.
"""

import os
import json
import logging
from pathlib import Path
import pandas as pd
import numpy as np
from src.data.validators.validator import validate_patient_dataframe

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

RAW_DIR = Path(__file__).resolve().parents[3] / "data" / "raw" / "hupa_ucm"
PROCESSED_DIR = Path(__file__).resolve().parents[3] / "data" / "processed"
REPORTS_DIR = Path(__file__).resolve().parents[3] / "reports" / "dataset_report"


def harmonize_hupa_ucm():
    PROCESSED_DIR.mkdir(parents=True, exist_ok=True)
    REPORTS_DIR.mkdir(parents=True, exist_ok=True)

    csv_files = sorted(list(RAW_DIR.glob("HUPA*.csv")))
    logger.info(f"Found {len(csv_files)} patient CSV files in {RAW_DIR}")

    if not csv_files:
        raise FileNotFoundError(f"No HUPA patient files found in {RAW_DIR}. Run downloader first.")

    all_patient_dfs = []
    quality_reports = []

    for file_path in csv_files:
        patient_id = file_path.stem  # e.g. "HUPA0001P"
        logger.info(f"Processing patient {patient_id}...")

        try:
            raw_df = pd.read_csv(file_path, sep=";")
            
            # Map column names if needed
            col_map = {
                "bolus_volume_delivered": "bolus_volume",
                "carb_input": "carbs"
            }
            raw_df = raw_df.rename(columns=col_map)

            # Validate
            cleaned_df, report = validate_patient_dataframe(raw_df, patient_id)
            quality_reports.append(report.to_dict())

            if not report.is_valid or len(cleaned_df) == 0:
                logger.warning(f"Skipping invalid patient {patient_id}")
                continue

            # Standardize 5-minute regular grid resampling
            cleaned_df = cleaned_df.set_index("timestamp")
            
            # Aggregate appropriately across modalities:
            # - Glucose, heart_rate, basal_rate: mean interpolation
            # - Bolus, carbs, steps, calories: sum accumulation within window
            agg_dict = {
                "patient_id": "first",
                "glucose": "mean",
                "basal_rate": "mean",
                "heart_rate": "mean",
                "bolus_volume": "sum",
                "carbs": "sum",
                "steps": "sum",
                "calories": "sum"
            }
            available_aggs = {k: v for k, v in agg_dict.items() if k in cleaned_df.columns}
            
            resampled_df = cleaned_df.resample("5min").agg(available_aggs)
            
            # Forward-fill patient_id
            resampled_df["patient_id"] = patient_id
            resampled_df["source_dataset"] = "HUPA-UCM"

            # Interpolate small glucose gaps (<= 15 min / 3 steps)
            resampled_df["glucose"] = resampled_df["glucose"].interpolate(method="linear", limit=3)
            
            # Fill impulse quantities with 0.0
            for zero_col in ["bolus_volume", "carbs", "steps", "calories"]:
                if zero_col in resampled_df.columns:
                    resampled_df[zero_col] = resampled_df[zero_col].fillna(0.0)

            resampled_df = resampled_df.reset_index()
            all_patient_dfs.append(resampled_df)
            logger.info(f"Patient {patient_id}: {len(resampled_df)} harmonized 5-min records.")

        except Exception as e:
            logger.error(f"Error processing {patient_id}: {e}")

    # Combine all patients
    harmonized_master = pd.concat(all_patient_dfs, ignore_index=True)
    out_csv = PROCESSED_DIR / "harmonized_5min.csv"
    harmonized_master.to_csv(out_csv, index=False)
    logger.info(f"Saved master harmonized dataset ({len(harmonized_master)} rows across {len(all_patient_dfs)} patients) to {out_csv}")

    # Save Data Quality Report
    report_json = REPORTS_DIR / "schema_report.json"
    with open(report_json, "w", encoding="utf-8") as f:
        json.dump({
            "total_patients": len(all_patient_dfs),
            "total_harmonized_rows": len(harmonized_master),
            "columns": list(harmonized_master.columns),
            "patient_reports": quality_reports
        }, f, indent=2)
    logger.info(f"Saved quality reports to {report_json}")

    return harmonized_master


if __name__ == "__main__":
    harmonize_hupa_ucm()
