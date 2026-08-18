# 📊 Real Clinical Research Datasets & Data Provenance
### **GlucoSaathi — Scientific Data Repository Audit**

---

## 1. Candidate Clinical Datasets Audit

Every dataset documented below is an authentic, publicly accessible or credentialed clinical research dataset collected from real human participants living with diabetes under Institutional Review Board (IRB) / Ethics Committee approvals.

---

### **1. OhioT1DM Dataset (2018 & 2020 Releases)**
* **Official Source**: Ohio University & Blood Glucose Level Prediction (BGLP) Challenge.
* **Official URL**: [http://smarthealth.cs.ohio.edu/bglp/](http://smarthealth.cs.ohio.edu/bglp/)
* **Publisher / PIs**: Cindy Marling & Razvan Bunescu, Ohio University, USA.
* **Population**: 12 human participants (6 in 2018 release, 6 in 2020 release) with Type 1 Diabetes on continuous subcutaneous insulin infusion (CSII / insulin pumps) and Continuous Glucose Monitors (CGM).
* **Demographics**: Adults aged 20–70 years.
* **CGM Sensor**: Medtronic Enlite (5-minute sampling frequency).
* **Available Features**:
  * Continuous Interstitial Glucose (5-min intervals).
  * Basal Insulin infusion rates and discrete Bolus Insulin doses (units).
  * Self-reported Meal times and carbohydrate grams ($C_{\text{carbs}}$).
  * Fingerstick blood glucose calibrations.
  * Self-reported Exercise intensity, duration, and sleep times.
  * Empatica E4 wristband physiological data: Galvanic Skin Response (GSR), Skin Temperature, Acceleration, and Blood Volume Pulse (BVP / Heart Rate).
* **Time Span**: 8 weeks per participant (over 100,000 total 5-minute data points).
* **Data Format**: XML structured data files with standardized timestamps.
* **License & Research Restrictions**: Non-commercial scientific research use only under formal Data Transfer Agreement (DTA) with Ohio University.
* **Redistribution**: Redistribution of raw data files is prohibited; preprocessing scripts and derived feature extractors are permitted.
* **Role for GlucoSaathi**: **TIER 1 (Gold Standard Benchmark)** for multi-modal time-series glucose regression and hypoglycemia horizon prediction.

---

### **2. ShanghaiT1D and ShanghaiT2D Datasets (2023)**
* **Official Source**: Shanghai Jiao Tong University / *Nature Scientific Data*.
* **Official URL**: [https://doi.org/10.1038/s41597-023-01940-7](https://doi.org/10.1038/s41597-023-01940-7) / [PhysioNet: https://physionet.org/content/cgm-diet-diabetes/1.0.0/](https://physionet.org/content/cgm-diet-diabetes/1.0.0/)
* **Publisher / Authors**: Xiao et al., Shanghai Jiao Tong University Affiliated Sixth People's Hospital, China.
* **Population**: 12 participants with Type 1 Diabetes (ShanghaiT1D) and 100+ participants with Type 2 Diabetes (ShanghaiT2D).
* **CGM Sensor**: Medtronic / Abbott Freestyle Libre (15-minute sampling frequency) and continuous 1-minute streams.
* **Available Features**:
  * Continuous Glucose Monitoring time series.
  * Detailed dietary food intake logs with ingredient macronutrients (carbs, protein, fat, fiber).
  * Insulin delivery logs (Multiple Daily Injections / MDI and CSII pumps).
  * Baseline metabolic profiles (HbA1c, fasting plasma glucose, lipid panel).
* **Time Span**: 14 consecutive days of inpatient/outpatient monitoring.
* **Data Format**: CSV and JSON tabular records.
* **License**: Creative Commons Attribution 4.0 International (CC BY 4.0).
* **Commercial Use**: Permitted with attribution under CC BY 4.0.
* **Role for GlucoSaathi**: **TIER 1** for evaluating macronutrient and dietary interaction with continuous glucose profiles.

---

### **3. D1NAMO Dataset (2018)**
* **Official Source**: University of Bern & Bern University Hospital (Inselspital), Switzerland.
* **Official URL**: [https://doi.org/10.1016/j.bspc.2018.06.012](https://doi.org/10.1016/j.bspc.2018.06.012)
* **Publisher / Authors**: Föll et al., ETH Zurich & University of Bern.
* **Population**: 29 participants (9 with T1D, 20 healthy controls) in real-life non-clinical settings.
* **CGM Sensor**: Dexcom G4 Platinum / Abbott FreeStyle Libre.
* **Available Features**:
  * Wearable chest sensor telemetry: Electrocardiogram (ECG / single lead, 250 Hz), Breathing rate, Accelerometer (3-axis).
  * Continuous glucose time series.
  * Food intake logs with digital photographs of meal plates.
  * Insulin injections.
* **Time Span**: ~1–4 days per participant during daily living.
* **Data Format**: Tabular CSV and image directories.
* **License**: Open research access on Zenodo repository.
* **Role for GlucoSaathi**: **TIER 2** for validating physiological stress and wearable heart rate impact on acute hypoglycemia detection.

---

### **4. DiaTrend Dataset (2023)**
* **Official Source**: IEEE DataPort / Emory University & Georgia Tech.
* **Official URL**: [https://doi.org/10.1109/JBHI.2023.3283256](https://doi.org/10.1109/JBHI.2023.3283256)
* **Population**: 54 participants with T1D wearing Dexcom G6 CGMs and Empatica E4 wristbands.
* **Time Span**: Over 27,000 hours of continuous data.
* **License**: Open research license.
* **Role for GlucoSaathi**: **TIER 2** for testing physiological variability across large outpatient cohorts.

---

### **5. OpenAPS Data Commons (Open Artificial Pancreas System Data)**
* **Official Source**: OpenAPS Community & Open Humans Foundation.
* **Official URL**: [https://www.openhumans.org/activity/openaps-data-commons/](https://www.openhumans.org/activity/openaps-data-commons/)
* **Population**: 100+ DIY closed-loop automated insulin delivery (AID) users.
* **Available Features**: 5-minute CGM streams, micro-boluses, basal rate modulations, temporary targets, carb entries, meal absorption models.
* **Time Span**: Multi-year continuous real-world logs.
* **License**: Donated patient research data under Open Humans Data Sharing Terms.
* **Role for GlucoSaathi**: **TIER 2** for studying complex closed-loop insulin-on-board decay and extended carb absorption dynamics.

---

## 2. Dataset Selection & Strategic Tiering

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DATASET STRATEGY                                       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ TIER 1: CORE BENCHMARK (Train & Validation)                                            │
│   • OhioT1DM (12 Subjects, 8 Weeks, 5-min Dense Multimodal Data)                      │
│   • ShanghaiT1D (12 T1D Subjects, Detailed Macronutrient Meals & Insulin)              │
│                                                                                        │
│ TIER 2: SPECIALIZED VALIDATION                                                         │
│   • D1NAMO (Meal Plate Images + ECG / Heart Rate Stress Signals)                       │
│   • DiaTrend (54 T1D Subjects, Outpatient Wearable Telemetry)                         │
│   • OpenAPS Data Commons (Real-world Insulin Decay & Basal Modulation)                 │
│                                                                                        │
│ TIER 3: PHYSIOLOGICAL NUTRITION REFERENCE                                              │
│   • ICMR-NIN Indian Food Composition Tables (IFCT 2020) — Authoritative Ground Truth   │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 3. Dataset Discrepancies & Harmonization Rules

Merging multi-source diabetes datasets requires strict standardization to prevent semantic mismatch and mathematical errors:

1. **Blood Glucose Units**:
   * *Rule*: All interstitial glucose readings are harmonized to **$\text{mg/dL}$**.
   * *Conversion Formula*: $\text{mg/dL} = \text{mmol/L} \times 18.0182$.
2. **Temporal Resampling & Alignment**:
   * *Rule*: Continuous time series are resampled to a uniform **5-minute discrete grid** ($\Delta t = 5\text{ min}$) using linear interpolation for gaps $< 15\text{ min}$. Gaps $\ge 15\text{ min}$ are marked as missing intervals and do not impute data.
3. **Insulin Delivery Representation**:
   * *Bolus Insulin*: Recorded as instantaneous impulses (Units) occurring at timestamp $t$.
   * *Basal Insulin*: Converted to continuous rate in $\text{Units/hour}$.
4. **Carbohydrate Annotations**:
   * *Rule*: All meal events are formatted as total grams of digestible carbohydrate, timestamp, and duration of meal window.

---

## 4. Documented Dataset Limitations & Population Biases

1. **Geographic & Ethnic Bias**:
   * *Limitation*: OhioT1DM and D1NAMO represent predominantly North American and European Caucasian cohorts consuming Western-style diets.
   * *Impact on GlucoSaathi*: Models trained solely on Western datasets underestimate post-prandial glycemic excursions caused by high-GI refined flours (*maida*) or high-fat Indian composite gravies (*butter chicken*, *paneer tikka masala*).
2. **Pediatric Representation Gap**:
   * *Limitation*: Most open datasets focus on adult T1D subjects (ages 20–70). Pediatric patients (e.g. Priya persona, age 12) exhibit higher insulin sensitivity variability, dynamic growth hormone surges, and unpredictable physical activity.
3. **Sensor Technology Lag**:
   * *Limitation*: Earlier datasets (OhioT1DM 2018) utilize older Medtronic Enlite sensors with higher Mean Absolute Relative Difference (MARD $\approx 14\text{--}17\%$) compared to contemporary Dexcom G6/G7 or Abbott Libre 3 sensors (MARD $< 9\%$).
