#!/usr/bin/env python3
"""
Physiological Glucose Dynamics Feature Extractor
Computes lags, rate of change, acceleration, rolling volatility, and LBGI.
"""

import pandas as pd
import numpy as np


def compute_lbgi(glucose_series: pd.Series) -> pd.Series:
    """
    Computes Low Blood Glucose Index (LBGI) developed by Kovatchev et al.
    """
    # f(G) = 1.509 * ( (ln(G))^1.084 - 5.381 )
    # rl(G) = 10 * f(G)^2 if f(G) < 0 else 0
    safe_g = glucose_series.clip(lower=20.0, upper=600.0)
    ln_g = np.log(safe_g)
    f_g = 1.509 * (np.power(ln_g, 1.084) - 5.381)
    rl_g = np.where(f_g < 0, 10.0 * np.square(f_g), 0.0)
    return pd.Series(rl_g, index=glucose_series.index)


def extract_glucose_features(df: pd.DataFrame, lags_steps=[1, 2, 3, 6, 9, 12]) -> pd.DataFrame:
    """
    Extracts temporal glucose features for a single patient's continuous 5-min series.
    lags_steps correspond to: 5m, 10m, 15m, 30m, 45m, 60m.
    """
    out = pd.DataFrame(index=df.index)
    g = df["glucose"]

    # 1. Current value
    out["glucose_current"] = g

    # 2. Historical Lags
    for step in lags_steps:
        min_label = step * 5
        out[f"glucose_lag_{min_label}m"] = g.shift(step)

    # 3. Rate of Change (first derivative)
    out["glucose_roc_5m"] = (g - g.shift(1)) / 5.0
    out["glucose_roc_15m"] = (g - g.shift(3)) / 15.0
    out["glucose_roc_30m"] = (g - g.shift(6)) / 30.0

    # 4. Acceleration (second derivative)
    out["glucose_accel"] = (out["glucose_roc_5m"] - out["glucose_roc_5m"].shift(1)) / 5.0

    # 5. Rolling Statistics (1-hour = 12 steps)
    out["glucose_mean_1h"] = g.rolling(window=12, min_periods=6).mean()
    out["glucose_std_1h"] = g.rolling(window=12, min_periods=6).std()
    
    # 6. Low Blood Glucose Risk
    out["glucose_lbgi_point"] = compute_lbgi(g)
    out["glucose_lbgi_1h"] = out["glucose_lbgi_point"].rolling(window=12, min_periods=6).mean()

    return out
