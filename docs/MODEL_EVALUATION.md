# 📏 Model Evaluation, Clinical Metrics & Calibration
### **GlucoSaathi — Multi-Dimensional Validation Framework**

---

## 1. Glucose Regression Evaluation Metrics

Standard statistical metrics (MAE, RMSE) treat all errors symmetrically, whereas in clinical diabetes management, an overestimation error during hypoglycemia is vastly more dangerous than an underestimation error during hyperglycemia.

```
          PREDICTED GLUCOSE
                 ▲
           400   │      /  Zone B  /   Zone A (Clinically Accurate)
                 │     /          /
                 │    /  Zone C  /
                 │   /          /
           180   │  /          /  Zone B (Benign Treatment)
                 │ /  Zone D  /
                 │/ (Dangerous)
            70   │───────────/
                 │ Zone E   /  Zone C / D (Severe Overestimation)
            20   │─────────/─────────────────────────────►
                 0    20   70   180                     400  REFERENCE GLUCOSE (mg/dL)
```

---

### **A. Root Mean Squared Error (RMSE) & Mean Absolute Error (MAE)**
$$\text{RMSE} = \sqrt{\frac{1}{N}\sum_{i=1}^{N} (G_i - \hat{G}_i)^2}, \quad \text{MAE} = \frac{1}{N}\sum_{i=1}^{N} |G_i - \hat{G}_i|$$

### **B. Mean Absolute Relative Difference (MARD)**
The regulatory standard metric for continuous glucose sensor accuracy (FDA & ISO 15197):
$$\text{MARD} = \frac{1}{N}\sum_{i=1}^{N} \frac{|G_i - \hat{G}_i|}{G_i} \times 100\%$$
* *Clinical Target*: MARD $< 10\%$ represents high clinical accuracy; MARD $10\text{--}14\%$ represents acceptable clinical forecasting at $h=30\text{ min}$.

### **C. Clarke Error Grid Analysis (EGA)**
Categorizes pairs $(G_{\text{ref}}, \hat{G}_{\text{pred}})$ into clinical risk zones:
* **Zone A (Clinically Accurate)**: Predictions within $20\%$ of reference or both $<70\text{ mg/dL}$. Leads to correct treatment decisions.
* **Zone B (Benign Errors)**: Errors $>20\%$ that lead to benign or no treatment action.
* **Zone C (Overcorrection Errors)**: Unnecessary corrective action leading to glycemic overshoot.
* **Zone D (Dangerous Failure to Detect)**: Failure to detect hypoglycemia ($G_{\text{ref}} < 70$, $\hat{G} > 70$) or hyperglycemia.
* **Zone E (Catastrophic Inversion)**: Erroneous treatment of hypoglycemia as hyperglycemia or vice versa.
* *Clinical Target*: **Zone A + Zone B $> 98.0\%$**, with **Zone D + Zone E $< 0.5\%$**.

---

## 2. Hypoglycemia Classification & Imbalance Metrics

In real-world T1D CGM data, hypoglycemia ($<70\text{ mg/dL}$) accounts for only **$3\text{--}8\%$ of all readings**. Standard accuracy is useless (a dummy model predicting "no hypo" achieves $95\%$ accuracy but 0% clinical utility).

| Metric | Mathematical Definition | Clinical Importance | Target Value |
| :--- | :--- | :--- | :--- |
| **Sensitivity (Recall)** | $\frac{TP}{TP + FN}$ | Fraction of true hypoglycemia events successfully detected. | **$> 85.0\%$** at $h=30\text{ min}$ |
| **Specificity** | $\frac{TN}{TN + FP}$ | Fraction of non-hypo periods correctly classified as safe. | **$> 88.0\%$** |
| **Precision (PPV)** | $\frac{TP}{TP + FP}$ | Reliability of alarms (avoids alarm fatigue). | **$> 60.0\%$** |
| **AUPRC** | Area under Precision-Recall curve | Unbiased performance under severe class imbalance. | Maximize ($> 0.65$) |
| **False Alarm Rate** | $\text{FP per patient-week}$ | Number of false alarms causing user frustration. | **$< 3.0$ alarms/week** |
| **Lead Time** | $t_{\text{alert}} - t_{\text{hypo onset}}$ | Advance warning buffer for carbohydrate ingestion. | **$20\text{--}35\text{ minutes}$** |

---

## 3. Probability Calibration & Reliability

A risk engine asserting a **$70\%$ probability of hypoglycemia** must be empirically calibrated such that out of 100 instances with score 0.70, exactly 70 result in true hypoglycemia.

### **A. Expected Calibration Error (ECE)**
Partition predictions into $M=10$ bins $B_m \subset (0, 1]$:
$$\text{ECE} = \sum_{m=1}^{M} \frac{|B_m|}{N} \left| \text{acc}(B_m) - \text{conf}(B_m) \right|$$
* *Calibration Techniques*: Apply **Platt Scaling (logistic calibration)** or **Isotonic Regression** on validation folds to ensure unskewed risk scores.

### **B. Brier Score**
$$\text{Brier} = \frac{1}{N}\sum_{i=1}^{N} (p_i - y_i)^2 \in [0, 1]$$
Measures the mean squared difference between predicted probability $p_i$ and true binary outcome $y_i$.

---

## 4. Uncertainty Quantification & Conformal Prediction

To prevent false precision, GlucoSaathi uses **Inductive Conformal Prediction** to output rigorous, finite-sample guaranteed prediction intervals:

$$\Gamma^{\epsilon}(x) = [\hat{G}_{\text{lower}}(x), \hat{G}_{\text{upper}}(x)]$$
such that for any chosen significance level $\alpha = 0.10$, the true future glucose satisfies:
$$P(G(t+h) \in \Gamma^{\alpha}(\mathbf{x}_t)) \ge 1 - \alpha = 90\%$$

* *User Interface Representation*: The system displays:
  $$\text{"Predicted Glucose at 30 min: } 112\text{ mg/dL (90% Expected Range: } 94\text{--}128\text{ mg/dL)}"$$
  rather than a single deterministic number.
