#!/usr/bin/env python3
"""
Naive Persistence Baseline Model
Assumes future glucose equals current glucose: G(t+h) = G(t).
"""

import numpy as np


class PersistenceGlucoseForecaster:
    def fit(self, X, y=None):
        return self

    def predict(self, X):
        # X[:, 0] is assumed to be glucose_current
        if hasattr(X, "iloc"):
            return X["glucose_current"].values
        return X[:, 0]
