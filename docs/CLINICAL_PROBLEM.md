# 🩺 Clinical Problem Definition & Technical Scope
### **GlucoSaathi — Scientific & Physiological Architecture**

---

## 1. Taxonomic Separation of Capabilities

To ensure scientific rigor and regulatory clarity, GlucoSaathi decomposes blood glucose intelligence into seven distinct technical modules. Each module addresses a unique physiological problem with distinct inputs, mathematical formulations, and regulatory implications.

```
                               ┌─────────────────────────────────────────────────┐
                               │             GLUCOSAATHI ARCHITECTURE            │
                               └───────────────────────┬─────────────────────────┘
                                                       │
         ┌─────────────────────┬───────────────────────┼───────────────────────┬─────────────────────┐
         │                     │                       │                       │                     │
         ▼                     ▼                       ▼                       ▼                     ▼
┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐  ┌──────────────────┐
│    MODULE A:     │  │    MODULE B:     │  │    MODULE C:     │  │    MODULE D:     │  │    MODULE E:     │
│Glucose Monitoring│  │Glucose Forecast  │  │Hypoglycemia Risk │  │Indian Carb Engine│  │Insulin & Activity│
│  (State Track)   │  │ (Trajectory)     │  │ (Classification) │  │  (Decomposition) │  │  (PK/PD Models)  │
└──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘  └──────────────────┘
                                                       │
                                       ┌───────────────┴───────────────┐
                                       │                               │
                                       ▼                               ▼
                             ┌──────────────────┐            ┌──────────────────┐
                             │    MODULE F:     │            │    MODULE G:     │
                             │ Explainable Risk │            │Clinical Decision │
                             │  (SHAP / Why?)   │            │Support (Boundary)│
                             └──────────────────┘            └──────────────────┘
```

---

### **Module A: Glucose Monitoring (State Estimation)**
* **Technical Definition**: Continuous or intermittent acquisition, filtering, and calibration of interstitial or capillary blood glucose values.
* **Physiological Reality**: Measures subcutaneous interstitial fluid glucose ($G_{\text{ISF}}$), which exhibits a 5–15 minute physiological lag behind arterial/capillary blood glucose ($G_{\text{plasma}}$) during rapid glycemic transients (Rebrin & Steil, 2000).
* **Mathematical Function**: $G(t)$ sampled at discrete intervals $\Delta t \in \{1\text{ min}, 5\text{ min}, 15\text{ min}\}$.

---

### **Module B: Glucose Forecasting (Time-Series Regression)**
* **Technical Definition**: Extrapolative multi-step prediction of future interstitial glucose trajectories $G(t + h)$ over a prediction horizon $h \in \{15, 30, 45, 60\}\text{ minutes}$.
* **Physiological Reality**: Must model non-linear interactions between subcutaneous insulin absorption ($I(t)$), carbohydrate digestion/gastric emptying ($M(t)$), endogenous hepatic glucose production ($EGP(t)$), and peripheral glucose utilization ($U(t)$).
* **Mathematical Function**: $\hat{G}(t+h) = f(G_{t-k:t}, I_{t-m:t}, M_{t-n:t}, A_{t-p:t}; \Theta)$.

---

### **Module C: Hypoglycemia Risk Prediction (Classification / Time-to-Event)**
* **Technical Definition**: Estimating the instantaneous probability $P(\text{Hypo}_{t \to t+h} = 1)$ or time $T_{\text{hypo}}$ until blood glucose drops below clinical safety thresholds ($\le 70\text{ mg/dL}$ or $\le 54\text{ mg/dL}$).
* **Physiological Reality**: Hypoglycemia in Type 1 Diabetes (T1D) is frequently caused by *insulin stacking* (overlapping boluses without sufficient substrate coverage), unannounced or delayed exercise sensitivity, or mismatched meal absorption profiles.
* **Mathematical Function**: $\hat{p}_{\text{hypo}}(t, h) = \sigma(g(\mathbf{x}_t; \mathbf{w})) \in [0, 1]$.

---

### **Module D: Indian Meal Carbohydrate Estimation (Nutritional Decomposition)**
* **Technical Definition**: Computer vision and natural language decomposition of mixed, composite Indian dishes into ingredient-level mass, carbohydrate content, and glycemic index (GI) ranges based on authoritative food composition tables.
* **Physiological Reality**: Indian cuisine relies heavily on composite dishes (*dal-chawal*, *rajma-chawal*, *roti-sabzi*, *dosa-sambar*) with high fat/protein content that induces biphasic or delayed glucose peaks (Bell et al., 2015).
* **Mathematical Function**: $C_{\text{meal}} = \sum_{i=1}^{N} q_i \cdot c_i \pm \delta_i$, where $q_i$ is portion multiplier, $c_i$ is grams carbs per serving, and $\delta_i$ is culinary variance.

---

### **Module E: Insulin & Metabolic Context (PK/PD Modeling)**
* **Technical Definition**: Modeling subcutaneous rapid-acting and basal insulin pharmacokinetics ($PK$) and pharmacodynamics ($PD$) to calculate active **Insulin-On-Board (IOB)** and remaining metabolic clearance curves.
* **Physiological Reality**: Rapid-acting insulin analogs (Aspart, Lispro, Glulisine) exhibit peak activity at $t_{\max} \approx 50\text{--}70\text{ minutes}$ and an effective biological duration of $3\text{--}5\text{ hours}$ (Mudaliar et al., 1999).
* **Mathematical Function**: $\text{IOB}(t) = \sum_{k} D_k \cdot \phi(t - t_k)$, where $\phi(\tau)$ is the biexponential decay function.

---

### **Module F: Explainable Risk Analysis (Feature Attribution)**
* **Technical Definition**: Decomposition of the risk prediction score into transparent, additive, clinically intelligible physiological factor contributions using Shapley Additive Explanations (SHAP) or deterministic weighting.
* **Physiological Reality**: Clinicians and patients cannot trust black-box alarms; they must know whether risk is driven by excessive active IOB, delayed exercise uptake, or inadequate meal carbohydrate coverage.
* **Mathematical Function**: $\hat{f}(\mathbf{x}) = \phi_0 + \sum_{j=1}^{M} \phi_j(\mathbf{x})$, where $\phi_j$ represents the marginal contribution of factor $j$.

---

### **Module G: Clinical Decision Support (CDS Boundary)**
* **Technical Definition**: Non-autonomous, evidence-based contextual guidance that translates algorithmic output into actionable patient safety protocols (e.g. Clinical Rule of 15 for hypoglycemia recovery) without executing or prescribing automated therapy.

---

## 2. Target Variable Analysis & Recommendation

Choosing the prediction target fundamentally dictates data requirements, evaluation metrics, and clinical utility.

| Target Option | Mathematical Type | Target Variable ($y$) | Horizon ($h$) | Clinical Meaning | Primary Limitations | Recommended Metrics |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Target A: Future Glucose Value** | Continuous Regression | $G(t+h) \in \mathbb{R}^+$ | $30, 60\text{ min}$ | Direct estimation of blood sugar level at a future point. | Penalizes near-misses heavily; does not directly reflect clinical urgency. | RMSE, MAE, MARD, Clarke EGA (Zones A+B) |
| **Target B: Glucose Trajectory** | Multi-step Regression | $\mathbf{G}_{t+1:t+h} \in \mathbb{R}^h$ | $15\text{--}60\text{ min}$ | Full forward curve indicating rate and direction of change ($\frac{dG}{dt}$). | Autoregressive error compounding; requires dense CGM streams. | Dynamic Time Warping (DTW), Continuous EGA |
| **Target C: Binary Hypoglycemia Horizon** | Binary Classification | $\mathbb{I}(\min_{k \in [1, h]} G(t+k) < 70) \in \{0, 1\}$ | $30\text{--}45\text{ min}$ | Direct early warning: will blood sugar drop $<70\text{ mg/dL}$ within 45 min? | Severe class imbalance (~3–8% positive instances in real-world data). | Sensitivity @ 90% Specificity, AUPRC, Lead Time |
| **Target D: Time-to-Hypoglycemia** | Survival / Time-to-Event | $T_{\text{hypo}} = \inf\{s > 0 : G(t+s) < 70\}$ | Censored at $h=120\text{ min}$ | Estimates exact minutes remaining before hypoglycemia onset. | Complex right-censoring when glucose recovers without hypo. | C-index, Brier Score at $t$ |
| **Target E: Risk Category** | Ordinal Classification | $\text{Risk} \in \{\text{Low}, \text{Moderate}, \text{High}\}$ | $30\text{--}60\text{ min}$ | Action-oriented clinical state categorization. | Boundaries between tiers are discrete rather than continuous. | Ordinal Weighted Cohen's $\kappa$, Multi-class AUROC |
| **Target F: Post-Meal Excursion** | Peak / AUC Regression | $\Delta G_{\text{peak}} = \max_{k \in [0, 180]} G(t+k) - G(t)$ | $180\text{ min}$ | Measures glycemic spike magnitude after a meal. | Highly dependent on unmeasured gastric emptying and fat content. | $R^2$, MAE, Peak Time Error |

### **Recommended Target Strategy for GlucoSaathi**
1. **Primary Operational Target**: **Target C (Binary Hypoglycemia within $h=30\text{--}45\text{ minutes}$)** combined with **Target A (Point Forecast at $h=30\text{ min}$)**.
   * *Clinical Rationale*: A 30–45 minute lead time provides patients sufficient buffer to consume fast-acting carbohydrates (15g glucose) and prevent hypoglycemic neuroglycopenia before symptoms disable cognitive function.
2. **Secondary Nutritional Target**: **Target F (Post-prandial glycemic excursion $\Delta G_{\text{peak}}$ at $h=120\text{ min}$)** for meal carb-matching evaluation.

---

## 3. Clinical Definitions & Thresholds

All clinical definitions implemented in GlucoSaathi are grounded in consensus guidelines established by the American Diabetes Association (ADA), European Association for the Study of Diabetes (EASD), and International Society for Pediatric and Adolescent Diabetes (ISPAD).

### **Consensus Hypoglycemia Classification (ADA / EASD 2023)**
* **Level 1 Hypoglycemia (Alert Value)**: Glucose **$< 70\text{ mg/dL}$ ($< 3.9\text{ mmol/L}$)** and $\ge 54\text{ mg/dL}$.
  * *Clinical Significance*: Represents the physiological threshold for activation of counter-regulatory neuroendocrine defenses (glucagon, epinephrine). Requires consumption of fast-acting carbohydrates.
* **Level 2 Hypoglycemia (Clinically Significant / Serious)**: Glucose **$< 54\text{ mg/dL}$ ($< 3.0\text{ mmol/L}$)**.
  * *Clinical Significance*: Threshold at which neuroglycopenic symptoms (confusion, cognitive impairment, visual disturbances) occur. High risk of immediate adverse clinical events.
* **Level 3 Hypoglycemia (Severe)**: A severe event characterized by altered mental and/or physical status requiring external assistance for recovery, irrespective of biochemical glucose value.

### **Glycemic Targets (ADA Standards of Care 2024 & RSSDI 2023)**
* **Target Range (Time-in-Range / TIR)**: **$70\text{--}180\text{ mg/dL}$ ($3.9\text{--}10.0\text{ mmol/L}$)**. Clinical consensus target is **$> 70\%$ of readings** within this window (Battelino et al., 2019).
* **Time Below Range (TBR)**:
  * TBR $< 70\text{ mg/dL}$: Target **$< 4\%$** of readings per day ($< 1\text{ hour/day}$).
  * TBR $< 54\text{ mg/dL}$: Target **$< 1\%$** of readings per day ($< 15\text{ min/day}$).
* **Fasting / Pre-prandial Blood Glucose**: **$80\text{--}130\text{ mg/dL}$ ($4.4\text{--}7.2\text{ mmol/L}$)**.
* **Post-prandial Peak Glucose (1–2h post meal)**: **$< 180\text{ mg/dL}$ ($< 10.0\text{ mmol/L}$)**.

---

## 4. Key Authoritative Citations

1. **American Diabetes Association (ADA)**: *Standards of Care in Diabetes—2024*. Diabetes Care 2024; 47 (Suppl. 1): S111–S125. [URL: https://diabetesjournals.org/care/issue/47/Supplement_1]
2. **Battelino T, Danne T, Bergenstal RM, et al.**: *Clinical Targets for Continuous Glucose Monitoring Data Interpretation: Recommendations From the International Consensus on Time in Range*. Diabetes Care 2019; 42(8): 1593–1603. [DOI: 10.2337/dci19-0028]
3. **Research Society for the Study of Diabetes in India (RSSDI)**: *RSSDI Clinical Practice Recommendations for Management of Type 1 Diabetes Mellitus 2021*. Int J Diabetes Dev Ctries 2021; 41 (Suppl 1): S1–S60.
4. **Bell KJ, Smart CE, Steil GM, et al.**: *Impact of fat, protein, and glycemic index on postprandial glucose control in type 1 diabetes: implications for intensive diabetes management in the continuous glucose monitoring era*. Diabetes Care 2015; 38(6): 1008–1015. [DOI: 10.2337/dc15-0100]
5. **Mudaliar SR, Lindberg FA, Joyce M, et al.**: *Insulin aspart (B28 asp-insulin): a fast-acting analog of human insulin*. Diabetes Care 1999; 22(9): 1501–1506.
