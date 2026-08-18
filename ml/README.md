# 🧠 GlucoSaathi — Machine Learning & Clinical Data Engine

This directory contains the reproducible machine learning pipeline, physiological feature extractors, clinical evaluation metrics, and inference microservice for **GlucoSaathi**.

---

## 📊 1. Data Provenance & Real Clinical Datasets

| Dataset | Source | Population & Modalities | Role in Pipeline | License |
| :--- | :--- | :--- | :--- | :--- |
| **HUPA-UCM Diabetes Dataset** | [Mendeley Data DOI: 10.17632/3hbcscwz44.1](https://data.mendeley.com/datasets/3hbcscwz44/1) | **25 real human T1D participants** with 5-minute FreeStyle Libre 2 CGM, basal rates, bolus insulin, carbohydrate entries, steps, calories, and heart rate (over 309,000 5-min records). | **Primary Training & Validation** | **CC BY 4.0** |
| **OhioT1DM Dataset** | [Ohio University](https://webpages.charlotte.edu/rbunescu/data/ohiot1dm/OhioT1DM-dataset.html) | 12 T1D participants over 8 weeks with 5-minute Medtronic CGM and Empatica E4 wristbands. | **Credentialed Benchmark** (Requires DTA access request) | Non-commercial DTA |
| **T1D-UOM Dataset** | [Zenodo (Record 15169264)](https://zenodo.org/records/15169264) | 17 real T1D participants with longitudinal multimodal data. | **External Cross-Cohort Validation** | Open Research |
| **ICMR-NIN IFCT 2020** | [National Institute of Nutrition (NIN)](https://www.nin.res.in) | Authoritative laboratory nutritional composition for 528 Indian foods. | **Nutrition Reference Lookup Layer** | Reference only |

---

## ⚙️ 2. Feature Engineering & Physiological Kinetics

1. **Glucose Dynamics**:
   - Historical lags: $G(t), G(t-5), G(t-10), G(t-15), G(t-30), G(t-45), G(t-60)$
   - Rate of change ($\text{RoC}_5, \text{RoC}_{15}, \text{RoC}_{30}$) and acceleration ($\text{Accel}$)
   - 1-hour rolling mean $\mu_{1\text{h}}$ and volatility $\sigma_{1\text{h}}$
   - Low Blood Glucose Index ($\text{LBGI}$)
2. **Insulin Dynamics**:
   - Active **Insulin-On-Board ($\text{IOB}$)** clearance curve (Mudaliar/Walsh kinetics over 4-hour DIA).
   - Cumulative boluses in past 1h and 2h.
3. **Meal Dynamics**:
   - Carbohydrate-on-Board ($\text{COB}$) absorption model.
   - Cumulative carbohydrate exposure in past 1h, 2h, and 4h.
4. **Physical Activity & Chronobiology**:
   - Rolling 15-min and 30-min step counts.
   - Post-exercise insulin sensitivity multiplier ($S_{\text{ex}} \ge 1.0$).
   - 24-hour cyclical harmonic representations ($\sin, \cos$) and sleep window indicators.

---

## 🏆 3. Trained Model Performance on Strictly Unseen Patients

Models were trained with **Subject-Wise Patient-Level Splitting (72% Train / 12% Val / 16% Test)** with zero subject overlap.

### **Task A: Continuous Glucose Forecasting ($h=30\text{ min}$)**
* **Selected Best Model**: **XGBoost Regressor**
* **Test RMSE on Unseen Patients**: **$17.31\text{ mg/dL}$** (vs Persistence Baseline: $23.47\text{ mg/dL}$, 26.2% error reduction)
* **Clarke Error Grid Analysis**: **$97.12\%$ in Zone A + Zone B** (Zone A: 85.3%, Zone B: 11.8%, Zone E: 0.0%)
* **90% Conformal Prediction Interval Margin**: **$\pm 22.76\text{ mg/dL}$**

### **Task B: Hypoglycemia Risk Prediction ($h=45\text{ min}$)**
* **Selected Best Model**: **Calibrated LightGBM Classifier (Platt Scaled)**
* **Test AUPRC**: **$0.9461$**
* **Test Sensitivity (Recall)**: **$87.8\%$**
* **Test Specificity**: **$97.2\%$**
* **Expected Calibration Error (ECE)**: **$0.0075$** (Excellent probability calibration)
* **Physiological Factor Attribution (SHAP)**:
  - Glucose Trend & Momentum: **$62.93\%$**
  - Physical Activity: **$15.73\%$**
  - Circadian Time of Day: **$9.55\%$**
  - Active Insulin (IOB): **$7.25\%$**
  - Meal Carbohydrates: **$4.54\%$**

---

## 🚀 4. Reproducible CLI Commands

```bash
# 1. Harmonize multi-patient raw dataset into canonical 5-minute grid
PYTHONPATH=ml ml/.venv/bin/python ml/src/data/harmonization/harmonizer.py

# 2. Extract physiological features across patients
PYTHONPATH=ml ml/.venv/bin/python ml/src/features/pipeline.py

# 3. Train continuous glucose forecaster
PYTHONPATH=ml ml/.venv/bin/python ml/src/training/train_glucose.py

# 4. Train calibrated hypoglycemia risk classifier
PYTHONPATH=ml ml/.venv/bin/python ml/src/training/train_hypoglycemia.py

# 5. Run automated test suite
npm run test:ml

# 6. Start the FastAPI Inference Microservice
npm run dev:ml
```

---

## 📡 5. Inference API Endpoints

* **`POST /api/ml/predict-glucose`**:
  ```json
  {
    "glucose": 118.0,
    "glucose_roc_5m": 0.5,
    "iob": 2.5,
    "carbs_recent": 45.0,
    "steps_30m": 500.0
  }
  ```
  *Response*:
  ```json
  {
    "prediction_horizon_minutes": 30,
    "predicted_glucose_mg_dl": 124.2,
    "conformal_interval_90pct": {
      "lower_mg_dl": 101.4,
      "upper_mg_dl": 147.0,
      "margin_mg_dl": 22.76
    },
    "model_version": "glucose_forecaster_30m_xgboost"
  }
  ```

* **`POST /api/ml/predict-hypo-risk`**:
  ```json
  {
    "glucose": 68.0,
    "glucose_roc_5m": -1.8,
    "iob": 4.2,
    "carbs_recent": 10.0,
    "activity_level": "moderate"
  }
  ```
  *Response*:
  ```json
  {
    "prediction_horizon_minutes": 45,
    "hypoglycemia_probability": 0.892,
    "risk_score_100": 89,
    "risk_level": "HIGH",
    "rule_of_15_armed": true,
    "explainability_factors": {
      "glucose_trend": 0.63,
      "physical_activity": 0.16,
      "circadian_time": 0.10,
      "insulin_iob": 0.07,
      "meal_carbs": 0.04
    }
  }
  ```
