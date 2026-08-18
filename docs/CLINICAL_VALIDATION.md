# 🧪 Clinical Validation & Prospective Trial Roadmap
### **GlucoSaathi — Evidence Generation & Clinical Study Design**

---

## 1. 4-Phase Clinical Evidence Generation Pathway

GlucoSaathi adheres to a formal 4-phase clinical validation pathway designed to establish physiological validity, algorithmic generalizability, clinical efficacy, and patient safety:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                               CLINICAL VALIDATION ROADMAP                              │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 0: IN SILICO PRECLINICAL SIMULATION                                              │
│ • FDA-Accepted UVA/Padova T1D Simulator (100 Virtual In Silico Patients)               │
│ • Validates PK/PD insulin clearance and carb disturbance models under zero risk.       │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 1: RETROSPECTIVE MULTI-CENTER BENCHMARK VALIDATION                               │
│ • Multi-center open research datasets (OhioT1DM, ShanghaiT1D)                          │
│ • Primary Endpoints: RMSE, MARD, Clarke EGA (Zones A+B > 98%), Hypo Recall > 85%.      │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 2: PROSPECTIVE OBSERVATIONAL FEASIBILITY STUDY                                   │
│ • 50 Outpatient Indian T1D Participants across 2 Endocrine Centers (Mumbai / Delhi)    │
│ • Evaluates Indian food database accuracy and user adherence in daily living.          │
├────────────────────────────────────────────────────────────────────────────────────────┤
│ PHASE 3: RANDOMIZED CONTROLLED CLINICAL TRIAL (RCT)                                    │
│ • Multi-center RCT (Intervention: GlucoSaathi CDS vs Control: Standard Care CGM)       │
│ • Primary Endpoint: Reduction in Time Below Range (% TBR < 70 mg/dL).                  │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Phase 0: In Silico Simulation Protocol (UVA/Padova T1D Simulator)

* **Platform**: The UVA/Padova Type 1 Diabetes Simulator (Man et al., 2014; Kovatchev et al., 2009), recognized by the US FDA as an accepted alternative to animal trials for preclinical testing of diabetes algorithms.
* **Virtual Cohort**: 100 *in silico* subjects (33 adults, 33 adolescents, 34 children) with realistic non-linear glucose-insulin kinetics, meal absorption variations, and sensor noise models.
* **Stress Test Protocol**:
  1. *Unannounced Meals*: Ingestion of $45\text{--}90\text{g}$ carbohydrate without upfront bolus.
  2. *Insulin Stacking*: Consecutive boluses spaced 45 minutes apart to verify active IOB damping.
  3. *Post-Exercise Drop*: 45-minute moderate exercise pulse ($4.5\text{ METs}$) triggering increased glucose utilization.

---

## 3. Phase 2 & 3: Prospective Indian Clinical Study Protocol

### **A. Primary & Secondary Clinical Endpoints**
* **Primary Endpoint**:
  * Absolute percentage change in **Time Below Range (TBR $< 70\text{ mg/dL}$)** measured by CGM over a 12-week intervention period.
  * *Hypothesis*: GlucoSaathi CDS arm will demonstrate a statistically significant relative reduction of $\ge 25\%$ in nocturnal and daytime hypoglycemia exposure compared to standard care ($p < 0.05$).
* **Secondary Endpoints**:
  * **Time in Range (TIR $70\text{--}180\text{ mg/dL}$)** improvement ($\ge 5\%$ absolute increase).
  * **Glycemic Variability (%CV)** reduction ($< 36\%$).
  * **Hypoglycemia Fear Survey (HFS-II)** score reduction.
  * **Carbohydrate Estimation Error (g)** between patient-entered estimate and clinical nutritionist reference weighing.

### **B. Institutional Ethics Committee (IEC) & Regulatory Compliance**
1. **IEC / IRB Approval**: Protocol submission to accredited Institutional Ethics Committees at participating Indian medical colleges and tertiary endocrine centers in compliance with:
   * *ICMR National Ethical Guidelines for Biomedical and Health Research Involving Human Participants (2017)*.
   * *New Drugs and Clinical Trials Rules (NDCTR 2019)* under CDSCO.
2. **Clinical Trial Registry - India (CTRI)**: Mandatory prospective registration on the official CTRI portal ([http://ctri.nic.in](http://ctri.nic.in)) prior to enrolling the first patient.
3. **Informed Consent**: Bi-lingual (English and Hindi/regional language) written informed consent signed by adult participants or parental consent with pediatric assent for minors.
