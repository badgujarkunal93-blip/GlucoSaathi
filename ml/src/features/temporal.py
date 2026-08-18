#!/usr/bin/env python3
"""
Circadian & Temporal Chronobiology Feature Extractor
Extracts harmonic 24-hour cyclical representations and sleep window indicators.
"""

import pandas as pd
import numpy as np


def extract_temporal_features(df: pd.DataFrame) -> pd.DataFrame:
    """
    Extracts cyclical sin/cos transformations of time-of-day.
    """
    out = pd.DataFrame(index=df.index)
    ts = pd.to_datetime(df["timestamp"])

    minute_of_day = ts.dt.hour * 60.0 + ts.dt.minute
    radians = (2.0 * np.pi * minute_of_day) / 1440.0

    out["temporal_sin_time"] = np.sin(radians)
    out["temporal_cos_time"] = np.cos(radians)
    out["temporal_day_of_week"] = ts.dt.dayofweek
    out["temporal_is_weekend"] = (ts.dt.dayofweek >= 5).astype(float)
    out["temporal_is_night"] = ((ts.dt.hour >= 23) | (ts.dt.hour < 7)).astype(float)

    return out
