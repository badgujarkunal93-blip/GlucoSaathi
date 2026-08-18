# 📖 Clinical Data Dictionary & Feature Provenance
### **GlucoSaathi — Variable Definitions & Lineage**

---

## 1. Glucose Domain Variables

| Variable Name | Description | Clinical Unit | Valid Range | Missing Value Strategy | Privacy Sensitivity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `glucose_raw` | Raw uncalibrated interstitial glucose reading from CGM sensor. | $\text{mg/dL}$ | $20\text{--}600$ | Reject $<20$ or $>600$ as hardware fault. | Sensitive Health Data (DPDPA) |
| `glucose_val` | Calibrated interstitial glucose resampled to 5-minute grid. | $\text{mg/dL}$ | $40\text{--}400$ | Linear interpolation for gaps $\le 15\text{ min}$; else `NaN`. | Sensitive Health Data |
| `glucose_roc_5m` | 5-minute Rate of Change: $\frac{G(t) - G(t-5)}{5}$. | $\text{mg/dL/min}$ | $-5.0\text{ to }+5.0$ | Forward fill previous slope if single gap. | Derived Feature |
| `glucose_roc_15m` | 15-minute Rate of Change: $\frac{G(t) - G(t-15)}{15}$. | $\text{mg/dL/min}$ | $-4.0\text{ to }+4.0$ | Computed only if $G(t-15)$ exists. | Derived Feature |
| `glucose_accel` | Acceleration (2nd derivative): $\text{RoC}_{5\text{m}}(t) - \text{RoC}_{5\text{m}}(t-5)$. | $\text{mg/dL/min}^2$ | $-2.0\text{ to }+2.0$ | Zero if slope is steady. | Derived Feature |
| `glucose_mean_1h` | Rolling 1-hour arithmetic mean of glucose: $\frac{1}{12}\sum_{k=0}^{11} G(t - 5k)$. | $\text{mg/dL}$ | $40\text{--}400$ | Minimum 8 valid points required. | Derived Feature |
| `glucose_std_1h` | Rolling 1-hour standard deviation of glucose. | $\text{mg/dL}$ | $0\text{--}150$ | Minimum 8 valid points required. | Derived Feature |
| `glucose_cv` | Coefficient of Variation over 24h: $\frac{\sigma_{24\text{h}}}{\mu_{24\text{h}}} \times 100\%$. | $\%$ | $0\text{--}100\%$ | Minimum 70% 24h coverage required. | Derived Feature |
| `lbgi` | Low Blood Glucose Index (Kovatchev et al.): $10 \times f(G)^2$ where $f(G) < 0$. | Dimensionless | $0\text{--}100$ | Computed per 24h window. | Derived Clinical Risk Index |

---

## 2. Insulin Domain Variables

| Variable Name | Description | Clinical Unit | Valid Range | Missing Value Strategy | Privacy Sensitivity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `insulin_bolus` | Discrete meal or correction insulin dose delivered subcutaneously. | $\text{Units (U)}$ | $0.1\text{--}35.0\text{ U}$ | Default to $0.0\text{ U}$ if no bolus recorded. | Sensitive Health Data |
| `insulin_basal_rate`| Continuous basal delivery rate from CSII pump or split MDI injection. | $\text{Units/hour}$ | $0.0\text{--}5.0\text{ U/hr}$ | Forward fill last valid basal rate. | Sensitive Health Data |
| `insulin_type` | Pharmacokinetic analog category (Aspart, Lispro, Glulisine, Regular, NPH, Degludec, Glargine). | Categorical | Enum | Default to 'Rapid' analog. | Sensitive Health Data |
| `iob` | Active Insulin-on-Board: Calculated metabolic insulin activity remaining in plasma. | $\text{Units (U)}$ | $0.0\text{--}20.0\text{ U}$ | Computed via PK decay curve. | Derived Clinical Metric |
| `time_since_bolus` | Elapsed minutes since last discrete insulin bolus event. | Minutes | $0\text{--}720\text{ min}$ | Clamp to 720 min (12 hours). | Derived Feature |
| `icr_prescribed` | Clinician-prescribed Insulin-to-Carbohydrate Ratio (grams of carbs per unit insulin). | $\text{g/Unit}$ | $3\text{--}40\text{ g/U}$ | User profile configuration. | Sensitive Health Data |
| `isf_prescribed` | Clinician-prescribed Insulin Sensitivity Factor (glucose drop per unit insulin). | $\text{mg/dL/Unit}$ | $10\text{--}150\text{ mg/dL/U}$ | User profile configuration. | Sensitive Health Data |

---

## 3. Nutritional / Meal Domain Variables

| Variable Name | Description | Clinical Unit | Valid Range | Missing Value Strategy | Privacy Sensitivity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `meal_carbs` | Total mass of digestible carbohydrates in meal event. | Grams ($\text{g}$) | $0\text{--}250\text{ g}$ | $0\text{ g}$ if no meal consumed. | Personal Data |
| `meal_protein` | Total dietary protein in meal event. | Grams ($\text{g}$) | $0\text{--}120\text{ g}$ | $0\text{ g}$ if unannotated. | Personal Data |
| `meal_fat` | Total dietary lipid/fat in meal event. | Grams ($\text{g}$) | $0\text{--}100\text{ g}$ | $0\text{ g}$ if unannotated. | Personal Data |
| `meal_fiber` | Total dietary soluble and insoluble fiber. | Grams ($\text{g}$) | $0\text{--}40\text{ g}$ | $0\text{ g}$ if unannotated. | Personal Data |
| `glycemic_index` | Rated Glycemic Index category of meal composite. | Categorical | `Low` ($<55$), `Med` ($56\text{--}69$), `High` ($\ge 70$) | Default to `Medium` (60) if unknown. | Derived Nutrition Token |
| `time_since_meal` | Elapsed minutes since meal ingestion event. | Minutes | $0\text{--}720\text{ min}$ | Clamp to 720 min. | Derived Feature |
| `carb_on_board` | Estimated unabsorbed carbohydrate remaining in gut: $\text{COB}(t)$. | Grams ($\text{g}$) | $0\text{--}150\text{ g}$ | Computed via linear absorption model ($30\text{g/hr}$). | Derived Metric |

---

## 4. Physical Activity & Temporal Context

| Variable Name | Description | Clinical Unit | Valid Range | Missing Value Strategy | Privacy Sensitivity |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `activity_intensity`| Physical exertion category. | Categorical | `Resting`, `Light`, `Moderate`, `Intense` | Default to `Resting`. | Personal Data |
| `activity_duration` | Duration of continuous exercise event. | Minutes | $0\text{--}240\text{ min}$ | $0\text{ min}$ if resting. | Personal Data |
| `activity_met` | Metabolic Equivalent of Task score (Ainsworth et al., 2011). | $\text{METs}$ | $1.0\text{--}12.0$ | Imputed from intensity category ($1.0, 2.5, 4.5, 8.0$). | Derived Metric |
| `time_of_day_sin` | Cyclical time representation: $\sin(\frac{2\pi \cdot t_{\text{mins}}}{1440})$. | Float | $[-1.0, 1.0]$ | Deterministic from timestamp. | Non-sensitive |
| `time_of_day_cos` | Cyclical time representation: $\cos(\frac{2\pi \cdot t_{\text{mins}}}{1440})$. | Float | $[-1.0, 1.0]$ | Deterministic from timestamp. | Non-sensitive |
| `is_sleep_window` | Indicator if timestamp falls within nocturnal hours (23:00–07:00). | Binary | $\{0, 1\}$ | Derived from timestamp. | Non-sensitive |
