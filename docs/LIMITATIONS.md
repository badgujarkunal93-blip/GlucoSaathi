# ⚠️ Scientific, Algorithmic & Physiological Limitations
### **GlucoSaathi — Explicit Clinical Disclosure & Operational Boundaries**

---

## 1. Physiological Limitations

1. **Interstitial Sensor Lag (5–15 Minutes)**:
   * Continuous Glucose Monitors (CGM) sample subcutaneous interstitial fluid ($G_{\text{ISF}}$), not intravascular capillary blood ($G_{\text{plasma}}$).
   * During rapid glycemic drops (e.g. rate of change $<-2.5\text{ mg/dL/min}$ after strenuous exercise or intravenous bolus), interstitial readings lag arterial blood glucose by **$5\text{--}15\text{ minutes}$** (Rebrin & Steil, 2000; Basu et al., 2013).
   * *Clinical Consequence*: A CGM displaying $82\text{ mg/dL}$ with a steep downward arrow may correspond to a true capillary glucose already at $65\text{ mg/dL}$. Patients experiencing adrenergic or neuroglycopenic symptoms must verify immediately with a fingerstick capillary blood glucose test.

2. **Intra-Individual Insulin Sensitivity Variation**:
   * A patient's Insulin Sensitivity Factor ($ISF$) and Insulin-to-Carbohydrate Ratio ($ICR$) are not static physiological constants. They fluctuate by up to **$30\text{--}50\%$ day-to-day** due to:
     * Acute physiological stress / cortisol release.
     * Subclinical viral infections / inflammation.
     * Nocturnal circadian hormones (*Dawn Phenomenon* between 04:00–08:00 AM).
     * Menstrual cycle phases (elevated luteal phase progesterone increases insulin resistance).
     * Ambient temperature and local injection site lipohypertrophy.

---

## 2. Indian Dietary & Nutritional Limitations

1. **Culinary Variance in Home Cooking**:
   * While the **ICMR-NIN Indian Food Composition Tables (IFCT 2020)** provide gold-standard laboratory assays, domestic preparation introduces unavoidable variance:
     * Added cooking oils, *ghee*, and butter (which delay gastric emptying by 1–3 hours).
     * Flour blending ratios (e.g. *multigrain atta* containing variable proportions of wheat, barley, chickpea, and soy).
     * Added table sugar or jaggery (*gur*) in regional curries (e.g. Gujarati *dal* vs Punjabi *dal*).
2. **Volumetric vs Gravimetric Serving Inaccuracy**:
   * Traditional Indian portion units (*katoris*, *spoons*, *ladles*, *pieces*) vary significantly in volume ($1\text{ small katori} \approx 100\text{g}$ vs $1\text{ large katori} \approx 200\text{g}$).
   * *Mitigation*: GlucoSaathi provides **live quantity increment/decrement controls (`+` / `-`)** and computes a calibrated uncertainty range (e.g. $\pm 10\text{--}15\%$) rather than a false-precision single value.

---

## 3. Machine Learning & Dataset Limitations

1. **Demographic Training Bias in Public Datasets**:
   * Benchmark datasets (OhioT1DM, D1NAMO) represent North American/European adult cohorts consuming Western dietary patterns.
   * Direct transfer to Indian populations without domain adaptation and local clinical calibration may underestimate post-prandial glycemic excursions resulting from high-GI refined grains or sweet confectionery (*mithai*).
2. **Pediatric and Geriatric Generalization**:
   * Models trained primarily on adult data cannot be assumed to generalize safely to pediatric patients (under age 18) or geriatric patients without age-stratified retrospective re-validation.

---

## 4. Operational & Clinical Safety Boundaries

1. **Non-Prescriptive Decision Support**:
   * GlucoSaathi is strictly a **Clinical Decision Support (CDS) tool**, not an autonomous medical device or automated insulin pump controller.
   * The platform **NEVER** autonomously dispenses, orders, or prescribes medication doses.
2. **Overriding Clinical Protocol (Rule of 15)**:
   * In any event where blood glucose is confirmed or suspected to be $<70\text{ mg/dL}$, predictive calculations are immediately superseded by the standard **ADA/RSSDI Clinical Rule of 15 Emergency Protocol** (15g fast-acting carbohydrate, rest, re-test in 15 minutes).
