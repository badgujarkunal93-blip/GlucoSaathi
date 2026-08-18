#!/usr/bin/env python3
"""
HUPA-UCM Diabetes Dataset Downloader
Mendeley Data DOI: 10.17632/3hbcscwz44.1
License: CC BY 4.0
Downloads real multimodal 5-min T1D records for 25 human participants.
"""

import os
import sys
import json
import time
import urllib.request
import logging
from pathlib import Path

logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(message)s")
logger = logging.getLogger(__name__)

DATASET_API_URL = "https://data.mendeley.com/public-api/datasets/3hbcscwz44?view=all"
RAW_DATA_DIR = Path(__file__).resolve().parents[3] / "data" / "raw" / "hupa_ucm"
METADATA_DIR = Path(__file__).resolve().parents[3] / "data" / "metadata"


def fetch_dataset_metadata():
    logger.info("Querying Mendeley Data API for HUPA-UCM dataset metadata...")
    req = urllib.request.Request(
        DATASET_API_URL,
        headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)", "Accept": "application/json"}
    )
    with urllib.request.urlopen(req, timeout=30) as resp:
        data = json.loads(resp.read().decode("utf-8"))
    return data


def download_patient_files():
    RAW_DATA_DIR.mkdir(parents=True, exist_ok=True)
    METADATA_DIR.mkdir(parents=True, exist_ok=True)

    metadata = fetch_dataset_metadata()
    files = metadata.get("files", [])
    logger.info(f"Retrieved metadata for {len(files)} total files in HUPA-UCM.")

    # Save manifest
    manifest_path = METADATA_DIR / "hupa_ucm_manifest.json"
    with open(manifest_path, "w", encoding="utf-8") as f:
        json.dump({
            "dataset_name": metadata.get("name"),
            "doi": metadata.get("doi", {}).get("id"),
            "version": metadata.get("version"),
            "total_files": len(files),
            "download_timestamp": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }, f, indent=2)
    logger.info(f"Saved dataset manifest to {manifest_path}")

    # Identify the 25 patient aggregate CSV files
    patient_files = [
        f for f in files
        if f.get("filename", "").endswith(".csv") and len(f.get("filename", "").split("_")) == 1
    ]
    logger.info(f"Identified {len(patient_files)} core patient aggregate CSV files.")

    downloaded_count = 0
    for pf in patient_files:
        filename = pf["filename"]
        file_id = pf["id"]
        target_path = RAW_DATA_DIR / filename

        if target_path.exists() and target_path.stat().st_size > 0:
            logger.info(f"File {filename} already exists ({target_path.stat().st_size} bytes). Skipping.")
            downloaded_count += 1
            continue

        download_url = f"https://data.mendeley.com/public-files/datasets/3hbcscwz44/files/{file_id}/file_downloaded"
        logger.info(f"Downloading {filename} (ID: {file_id})...")
        
        req = urllib.request.Request(
            download_url,
            headers={"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"}
        )
        try:
            with urllib.request.urlopen(req, timeout=60) as resp, open(target_path, "wb") as out_file:
                out_file.write(resp.read())
            logger.info(f"Successfully downloaded {filename} ({target_path.stat().st_size} bytes).")
            downloaded_count += 1
            time.sleep(0.2)  # Respectful rate limiting
        except Exception as e:
            logger.error(f"Failed to download {filename}: {e}")

    logger.info(f"HUPA-UCM Download complete: {downloaded_count}/{len(patient_files)} patient files available.")
    return downloaded_count


if __name__ == "__main__":
    download_patient_files()
