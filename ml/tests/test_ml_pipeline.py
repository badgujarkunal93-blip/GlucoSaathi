#!/usr/bin/env python3
"""
Automated Unit Tests for GlucoSaathi ML Pipeline
Tests feature math, IOB kinetics, Clarke Error Grid, Conformal intervals, and API endpoints.
"""

import pytest
import numpy as np
import pandas as pd
from fastapi.testclient import TestClient

from src.features.glucose import compute_lbgi, extract_glucose_features
from src.features.insulin import compute_iob_activity_fraction
from src.features.meals import compute_cob
from src.evaluation.regression import compute_clarke_error_grid, evaluate_glucose_regression
from src.evaluation.conformal import ConformalPredictor
from src.service.api import app


@pytest.fixture
def api_client():
    return TestClient(app)


def test_compute_lbgi_math():
    # Normal glucose (110 mg/dL) -> LBGI should be very low (~0)
    g_normal = pd.Series([110.0, 120.0, 100.0])
    lbgi_normal = compute_lbgi(g_normal)
    assert np.all(lbgi_normal < 1.0)

    # Hypoglycemic glucose (50 mg/dL) -> LBGI should be elevated (> 5.0)
    g_hypo = pd.Series([50.0, 45.0])
    lbgi_hypo = compute_lbgi(g_hypo)
    assert np.all(lbgi_hypo > 5.0)


def test_iob_activity_fraction_kinetics():
    # At t=0 min, fraction should be 1.0
    assert compute_iob_activity_fraction(np.array([0.0]))[0] == pytest.approx(1.0, abs=0.01)
    
    # At t=60 min (1 hour of 4-hour DIA), fraction should decrease to ~0.55-0.60
    iob_60m = compute_iob_activity_fraction(np.array([60.0]))[0]
    assert 0.50 < iob_60m < 0.70

    # At t=240 min (DIA), fraction should be 0.0
    iob_240m = compute_iob_activity_fraction(np.array([240.0]))[0]
    assert iob_240m == pytest.approx(0.0, abs=0.05)


def test_clarke_error_grid_assignment():
    # Perfect predictions -> 100% Zone A
    ref = np.array([80.0, 100.0, 150.0, 200.0])
    pred = np.array([80.0, 100.0, 150.0, 200.0])
    results = compute_clarke_error_grid(ref, pred)
    assert results["zone_a_pct"] == 100.0
    assert results["zone_ab_pct"] == 100.0

    # Severe inversion (Hypo predicted as Extreme Hyper) -> Zone E
    ref_inv = np.array([50.0])
    pred_inv = np.array([220.0])
    inv_results = compute_clarke_error_grid(ref_inv, pred_inv)
    assert inv_results["zone_e_pct"] == 100.0


def test_conformal_predictor_coverage():
    cal_true = np.array([100.0, 120.0, 140.0, 110.0, 95.0])
    cal_pred = np.array([105.0, 115.0, 135.0, 112.0, 98.0])
    
    cp = ConformalPredictor(alpha=0.10)
    q = cp.calibrate(cal_true, cal_pred)
    assert q > 0.0

    intervals = cp.predict_interval(np.array([100.0]))
    assert intervals[0, 0] < 100.0 < intervals[0, 1]


def test_api_health_endpoint(api_client):
    response = api_client.get("/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"
    assert data["glucose_model_loaded"] is True
    assert data["hypo_model_loaded"] is True


def test_api_glucose_prediction(api_client):
    payload = {
        "glucose": 118.0,
        "glucose_roc_5m": 0.5,
        "iob": 2.5,
        "carbs_recent": 45.0,
        "steps_30m": 500.0
    }
    response = api_client.post("/api/ml/predict-glucose", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert "predicted_glucose_mg_dl" in data
    assert "conformal_interval_90pct" in data
    assert data["predicted_glucose_mg_dl"] > 0.0


def test_api_hypo_risk_prediction(api_client):
    payload = {
        "glucose": 68.0,
        "glucose_roc_5m": -1.8,
        "iob": 4.2,
        "carbs_recent": 10.0,
        "activity_level": "moderate"
    }
    response = api_client.post("/api/ml/predict-hypo-risk", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["risk_level"] == "HIGH"
    assert data["rule_of_15_armed"] is True
    assert "explainability_factors" in data
