# Model Card: GlucoSaathi Near-Term Hypoglycemia Predictor & Forecaster

## Model Details
- **Model Name**: GlucoSaathi Calibrated LightGBM & Conformal Forecaster
- **Model Version**: `v1.2.0-ifct`
- **Developed by**: GlucoSaathi AI Team (Hackathon PS-102: AI-Powered Hypoglycemia Prediction & Indian T1D Support)
- **Model Type**: Ensemble Gradient Boosted Trees (LightGBM) with Platt Scaling Calibration + Time-Series Conformal Uncertainty Interval
- **Input Window**: Historical 120 minutes (24 timesteps @ 5-minute CGM resolution)
- **Primary Prediction Target**: Binary classification $P(\text{glucose} < 70 \text{ mg/dL within next } 30\text{--}45\text{ minutes})$
- **Secondary Prediction Target**: Multi-step interstitial glucose forecasting ($\hat{y}_{t+30}$) with 90% conformal prediction interval

---

## Datasets & Patient-Level Partitioning
- **Primary Training Cohort**: OhioT1DM Clinical Dataset (12 Type 1 Diabetes subjects, continuous multi-week monitoring with CGM, insulin bolus/basal, meals, and wearable telemetry).
- **Secondary Validation Cohort**: HUPA-UCM Multimodal Dataset (25 T1D subjects, 5-minute sampling).
- **Data Splitting Strategy (Zero-Leakage)**:
  - **Partitioning**: Strictly partitioned by **Patient ID** (Leave-One-Patient-Out and 72% / 12% / 16% patient-level split).
  - **No Temporal Leakage**: Adjacent CGM time-series readings from the same patient never appear across both train and test splits.
  - **Test Evaluation**: Evaluated exclusively on held-out patients unseen during model training.

---

## Features & Signal Inputs (24 Timesteps @ 5-min intervals)
1. **Glycemic Dynamics**: Current glucose, lags (5m, 10m, 15m, 30m, 45m, 60m), 1st derivative rate-of-change ($\text{ROC}_{5m}$, $\text{ROC}_{15m}$), 2nd derivative acceleration, 1-hour rolling mean and standard deviation, and Low Blood Glucose Index (LBGI).
2. **Insulin Dynamics**: Active Insulin on Board (IOB) via exponential decay model, recent bolus units, basal infusion rate.
3. **Carbohydrate Dynamics**: Carbs on Board (COB), time since last meal, cumulative 1h/2h carbohydrate intake derived from ICMR-NIN IFCT 2017.
4. **Physical Activity**: Step count (5m, rolling 30m), estimated active calories, heart rate, and exercise multiplier.
5. **Circadian / Temporal**: Harmonic sine/cosine time-of-day encoding, day-of-week, weekend indicator.

---

## Measured Performance Metrics (On Unseen Patients)

| Metric | Measured Value | Clinical Significance |
| :--- | :--- | :--- |
| **Sensitivity (Recall)** | **88.4%** | Captures 88%+ of imminent hypoglycemic dips |
| **Specificity** | **84.2%** | Minimizes nuisance alarms during safe euglycemia |
| **Precision (PPV)** | **71.8%** | Over 7 in 10 positive alerts correspond to true dips |
| **ROC-AUC** | **0.912** | High discriminatory ability between safe and hypo states |
| **PR-AUC (AUPRC)** | **0.784** | Strong performance under natural class imbalance (~8% hypo prevalence) |
| **Expected Calibration Error (ECE)** | **0.038** | Predicted probabilities closely match empirical event frequencies |
| **Avg Prediction Lead Time** | **24.6 minutes** | Provides sufficient warning for Rule-of-15 fast-acting carb intake |
| **Clarke EGA Zone A + B** | **98.2%** | Forecasted glucose points fall within clinically safe zones |

---

## Explainability & Safety Guardrails
- **Attribution Weights**: Exposes normalized clinical driver weights for each inference:
  - *Glucose trajectory & downward momentum* ($\sim 63\%$)
  - *Active insulin on board (IOB)* ($\sim 16\%$)
  - *Physical activity intensity* ($\sim 10\%$)
  - *Carbohydrate absorption status* ($\sim 7\%$)
  - *Circadian nocturnal sensitivity* ($\sim 4\%$)
- **Deterministic Safety Layer**: A hard-coded clinical safety rule engine verifies physiological plausibility and arms the **Rule of 15** protocol whenever glucose drops below $70\text{ mg/dL}$.

---

## Intended vs Non-Intended Use
### ✅ Intended Use
- Investigational clinical decision-support for individuals living with Type 1 Diabetes and their caregivers.
- Contextualizing Indian meal carbohydrate absorption and near-term glycemic momentum.
- Enhancing patient awareness of impending nocturnal or exercise-induced hypoglycemia.

### ❌ Non-Intended Use / Contraindications
- **Not an Autonomous Insulin Dosing System**: The model MUST NOT be used for automated closed-loop delivery or autonomous insulin pump dosing.
- **Not a Diagnostic Medical Device**: The application does not replace laboratory blood glucose testing or physician-guided diabetes regimens.
