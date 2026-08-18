# ⚖️ Medical Device Regulation & SaMD Classification Analysis
### **GlucoSaathi — Global Regulatory Landscape (India, US, EU)**

---

## 1. Regulatory Jurisdiction Mapping for Software Functions

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 SaMD REGULATORY SPECTRUM                               │
├───────────────────────────────┬────────────────────────────────────────────────────────┤
│ NON-DEVICE DECISION SUPPORT   │ REGULATED SOFTWARE AS A MEDICAL DEVICE (SaMD)          │
│ • Educational meal carb lookup│ • Automated insulin bolus dose calculators             │
│ • Retrospective logbook       │ • Autonomous closed-loop control algorithms            │
│ • Transparent clinical CDS    │ • Diagnostic claims for acute medical intervention     │
└───────────────────────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Detailed Multi-Jurisdiction Analysis

### **A. India — Central Drugs Standard Control Organisation (CDSCO)**
* **Statutory Framework**: *Medical Device Rules, 2017 (MDR 2017)*, as amended, issued under the *Drugs and Cosmetics Act, 1940*.
* **SaMD Applicability**: CDSCO classifies medical software into four risk tiers (Class A: Low risk, Class B: Low-moderate risk, Class C: Moderate-high risk, Class D: High risk).
* **Classification Evaluation for GlucoSaathi**:
  * *Component 1: Indian Meal Carb Estimation (Nutritional Database)*: **Confirmed Non-Medical Device (Wellness / Nutritional Information Tool)**.
  * *Component 2: Time-Series Hypoglycemia Risk Early Warning (Decision Support)*: **Likely Class B SaMD** under MDR 2017 (Software providing patient decision support for non-critical health monitoring).
  * *Component 3: Bolus Dose Recommendation*: If autonomous dosing were enabled, it would constitute **Class C SaMD** requiring formal clinical trial data and CDSCO Form MD-14/15 licensing.
  * *Mitigation in GlucoSaathi*: GlucoSaathi operates strictly as a **Non-Prescriptive Reference Calculator** based explicitly on user-entered clinician-prescribed ratios, with mandatory user confirmation and clear disclaimers.

---

### **B. United States — Food and Drug Administration (FDA)**
* **Statutory Framework**: *21st Century Cures Act (Section 3060)* & *FDA Clinical Decision Support Software Guidance (September 2022)*.
* **The 4-Criterion Non-Device CDS Test (FD&C Act § 520(o)(1)(E))**:
  1. *Criterion 1*: Software is NOT intended to acquire, process, or analyze medical images or signals from in vitro diagnostics. $\to$ **Meets criterion** if patient manually logs or imports standardized numerical streams.
  2. *Criterion 2*: Software is intended for displaying, analyzing, or printing medical information. $\to$ **Meets criterion**.
  3. *Criterion 3*: Software is intended to support or provide recommendations to a health care professional or patient about prevention, diagnosis, or treatment. $\to$ **Meets criterion**.
  4. *Criterion 4*: Software enables the user to **independently review the basis for the recommendations** (Explainability / Transparency). $\to$ **Meets criterion** via GlucoSaathi's explicit SHAP factor decomposition and transparent mathematical formulas.
* **Classification Status**:
  * Informational / Transparent CDS: **Non-Device CDS (Enforcement Discretion)**.
  * Predictive Hypo Alarm / Insulin Bolus Calculator: **Class II Medical Device (510(k) Pre-Market Notification under 21 CFR § 880.5725 or De Novo)**.

---

### **C. European Union — EU Medical Device Regulation (EU MDR 2017/745)**
* **Statutory Framework**: *Regulation (EU) 2017/745, Annex VIII, Rule 11*.
* **Rule 11 SaMD Criteria**:
  * Software intended to provide information used to take decisions with diagnosis or therapeutic purposes is classified as:
    * **Class IIa**: If decisions have an impact that may cause a non-serious deterioration of a person's state of health.
    * **Class IIb**: If decisions may cause death or an irreversible deterioration of a person's state of health (e.g. severe hypoglycemia shock / coma).
* **Classification Status for GlucoSaathi**: **Requires Formal Notified Body Assessment (Likely Class IIa)** prior to commercial deployment in the European Union.

---

## 3. Traceable Regulatory Status Matrix

| Module / Feature | India (CDSCO) | United States (FDA) | European Union (EU MDR) | Regulatory Condition |
| :--- | :--- | :--- | :--- | :--- |
| **Indian Meal Carb Lookup (ICMR-NIN)** | **Confirmed Non-Device** | **Confirmed Non-Device** | **Confirmed Non-Device** | Pure dietary composition table. |
| **Multimodal Meal Image Recognition** | **Confirmed Non-Device** | **Confirmed Non-Device** | **Confirmed Non-Device** | Must output confidence intervals and allow manual user override. |
| **Continuous Glucose Visualization / TIR** | **Confirmed Wellness** | **Confirmed Non-Device (General Wellness)** | **Class I / Non-Device** | Retrospective data display without real-time diagnostic claims. |
| **Hypoglycemia Predictive Risk Engine** | **Likely Class B SaMD** | **Class II (510(k) Required if prescriptive)** | **Class IIa SaMD** | Must maintain transparent "Why?" explainability layer to support user review. |
| **Reference Bolus Dose Calculator** | **Requires Assessment (Class B/C)** | **Class II (21 CFR 880.5725)** | **Class IIa / IIb SaMD** | Strictly non-autonomous; displays only clinician-prescribed ICR/ISF formulas. |

---

## 4. Strict Clinical Safety & Non-Prescription Boundary

To remain compliant with medical device safety mandates across all jurisdictions:
1. **Never Autonomous**: The software never autonomously prescribes, calculates, or triggers insulin administration.
2. **Mandatory Clinical Confirmation Notice**: Every screen displaying bolus reference calculations must state:
   > *"Reference estimate only based on your clinician-prescribed ICR. Always confirm with your prescribed care plan."*
3. **Emergency Rule of 15 Decoupling**: If blood glucose drops $<70\text{ mg/dL}$, predictive calculations are superseded by the standard **ADA/RSSDI Rule of 15 Emergency Guidance** (15g fast-acting sugar, re-test in 15 minutes).
