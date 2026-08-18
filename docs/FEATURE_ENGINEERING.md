# ⚙️ Feature Engineering & Physiological Modeling
### **GlucoSaathi — Mathematical & Algorithmic Transformations**

---

## 1. Temporal Glucose Feature Engineering

Continuous Glucose Monitor (CGM) streams exhibit non-linear dynamics, time-lagged correlations, and physiological momentum. We define the following mathematical transformations on discrete 5-minute sampling grids ($t \in \{0, 5, 10, \dots\}\text{ minutes}$):

```
                        t-60m     t-30m     t-15m      t-5m       t (NOW)     t+30m (TARGET)
                         │         │         │          │           │               │
CGM Stream G(t) ─────────●─────────●─────────●──────────●───────────●───────────────▷ ❓
                         └─────────────── HISTORICAL LAGS ──────────┘
                                             │
                                    ┌────────┴────────┐
                                    ▼                 ▼
                              Rate of Change    Acceleration
                               (1st deriv)       (2nd deriv)
```

---

### **A. Historical Lag Windows**
Given current timestamp $t$, construct lag vector $\mathbf{g}_t$:
$$\mathbf{g}_t = [G(t), G(t-5), G(t-10), G(t-15), G(t-30), G(t-45), G(t-60)]^T$$

### **B. Glucose Rate of Change (First Derivative)**
First-order backward differences over discrete interval $\Delta t$:
$$\text{RoC}_{\Delta t}(t) = \frac{G(t) - G(t - \Delta t)}{\Delta t}$$
* GlucoSaathi extracts $\text{RoC}_5(t)$, $\text{RoC}_{15}(t)$, and $\text{RoC}_{30}(t)$ to capture both instantaneous noise and sustained glycemic momentum.

### **C. Glucose Acceleration (Second Derivative)**
Second-order difference capturing trajectory inflection points:
$$\text{Accel}(t) = \frac{\text{RoC}_5(t) - \text{RoC}_5(t-5)}{5} = \frac{G(t) - 2G(t-5) + G(t-10)}{25}$$
* *Clinical Significance*: Negative acceleration during downward slope indicates a compounding precipitous drop towards hypoglycemia.

### **D. Rolling Window Glycemic Variability Metrics**
Over window $W = \{t - 5k : k = 0, \dots, K-1\}$ with $K=12$ (1 hour) or $K=72$ (6 hours):
* **Rolling Mean**: $\mu_W = \frac{1}{K}\sum_{x \in W} G(x)$
* **Rolling Standard Deviation**: $\sigma_W = \sqrt{\frac{1}{K-1}\sum_{x \in W} (G(x) - \mu_W)^2}$
* **Coefficient of Variation (%CV)**: $\%CV = \frac{\sigma_{24\text{h}}}{\mu_{24\text{h}}} \times 100\%$
  * *Clinical Boundary*: Consensus guidelines define $\%CV > 36\%$ as *unstable glycemic variability* associated with high hypoglycemia frequency (Battelino et al., 2019).

### **E. Low Blood Glucose Index (LBGI)**
Non-linear risk transform developed by Kovatchev et al. (2002) that maps glucose from $[20, 600]\text{ mg/dL}$ to a symmetric risk space $f(G)$:
$$f(G) = 1.509 \times \left( [\ln(G)]^{1.084} - 5.381 \right)$$
The low glucose risk component $rl(G)$ is computed as:
$$rl(G) = \begin{cases} 10 \times [f(G)]^2 & \text{if } f(G) < 0 \\ 0 & \text{otherwise} \end{cases}$$
$$\text{LBGI} = \frac{1}{N}\sum_{i=1}^{N} rl(G_i)$$
* *Risk Tiers*: $\text{LBGI} \le 1.1$ (Minimal risk), $1.1 < \text{LBGI} \le 2.5$ (Low risk), $2.5 < \text{LBGI} \le 5.0$ (Moderate risk), $\text{LBGI} > 5.0$ (High risk).

---

## 2. Pharmacokinetic Insulin-On-Board (IOB) Modeling

Subcutaneously injected rapid-acting insulin analog follows a multi-compartment absorption model: subcutaneous depot $\to$ interstitial space $\to$ vascular circulation.

```
       Subcutaneous Depot (Dose D_k) ──► Plasma Clearance ──► Biological Action
                  │
                  └─► Biexponential Decay Curve φ(τ) ──► Active IOB(t)
```

### **Biexponential IOB Clearance Model (Mudaliar / Home / OpenAPS Calibration)**
For a discrete bolus of dose $D_k$ administered at time $t_k$, the remaining biological activity fraction $S(\tau)$ at elapsed time $\tau = t - t_k \ge 0$ is modeled as:
$$S(\tau) = 1 - \frac{S_1(\tau) - S_2(\tau)}{C_{\text{norm}}}$$
where duration of insulin action $\text{DIA} = 4.0\text{ hours}$ ($240\text{ minutes}$) and peak activity $t_{\max} = 60\text{ minutes}$.

Using the continuous polynomial clearance curve (Walsh et al., 2010):
$$S(\tau) = 1 - 0.001929\tau + 1.25 \times 10^{-5}\tau^2 - 2.87 \times 10^{-8}\tau^3$$
The active **Insulin on Board ($\text{IOB}(t)$)** across all prior boluses in the last 6 hours is:
$$\text{IOB}(t) = \sum_{k: 0 \le t - t_k \le 360} D_k \cdot S(t - t_k)$$

* *Clinical Safety Function*: Subtracting active IOB from correction bolus calculations prevents *insulin stacking*, the leading cause of iatrogenic hypoglycemia in outpatient diabetes care.

---

## 3. Indian Meal Macronutrient & Absorption Dynamics

### **Dual-Wave Gastric Absorption for High-Fat / High-Protein Indian Meals**
Traditional North and South Indian meals (e.g. *Rajma Chawal with Ghee*, *Paneer Butter Masala*, *Masala Dosa with Coconut Chutney*) contain substantial fat ($15\text{--}30\text{g}$) and protein ($12\text{--}25\text{g}$).

Physiological studies (Bell et al., 2015; Wolpert et al., 2013) demonstrate that high fat/protein content:
1. Delays gastric emptying via cholecystokinin (CCK) secretion, shifting peak glucose from $45\text{--}60\text{ minutes}$ to $120\text{--}180\text{ minutes}$.
2. Induces late insulin resistance, requiring **extended or dual-wave bolusing** ($60\%$ upfront, $40\%$ over 2–3 hours).

```
   Glucose
   Flux (mg/dL)
     ▲
     │       /---\  (Standard Carb Peak: 45-60 min)
     │      /     \
     │     /       \            /------\  (High-Fat/Protein Indian Meal Delayed Peak: 120-180 min)
     │    /         \          /        \
     │   /           \        /          \
     └──┴─────────────┴──────┴────────────┴─────────────► Time (min)
        0             60     120          180
```

### **Carbohydrate-on-Board ($\text{COB}(t)$) Model**
$$\text{COB}(t) = \max\left(0, C_{\text{meal}} - \int_{t_{\text{meal}}}^{t} r_{\text{abs}}(s) \, ds\right)$$
where absorption rate $r_{\text{abs}}(s)$ is dynamically adjusted based on the meal Glycemic Index ($GI$) and Fat-Protein Units ($FPU$):
$$r_{\text{abs}} = r_{\text{baseline}} \times \left( \frac{\text{GI}}{60} \right) \times \left( \frac{1}{1 + 0.02 \times \text{Fat}_{\text{grams}}} \right)$$

---

## 4. Physical Activity & Circadian Features

1. **Metabolic Equivalent of Task (MET) Scaling**:
   * *Resting*: $1.0\text{ MET}$ (Baseline glucose utilization rate $1.2\text{ mg/kg/min}$).
   * *Moderate Exercise (Brisk walk, yoga, cycling)*: $4.5\text{ METs}$ (Increases glucose utilization to $3.5\text{--}5.0\text{ mg/kg/min}$).
   * *Intense Sport / Gym*: $8.0\text{ METs}$ (Increases insulin-independent GLUT4 translocation to muscle sarcolemma).
2. **Post-Exercise Insulin Sensitivity Multiplier ($S_{\text{ex}}$)**:
   * Elevated insulin sensitivity persists for $2\text{--}12\text{ hours}$ post-exercise (Wasserman, 2009):
   $$S_{\text{ex}}(\Delta t) = 1.0 + 0.35 \cdot \exp\left(-\frac{\Delta t_{\text{ex}}}{180}\right)$$
   where $\Delta t_{\text{ex}}$ is minutes since exercise cessation.
3. **Harmonic Circadian Transformations**:
   $$\theta_t = \frac{2\pi \cdot (\text{hour} \times 60 + \text{minute})}{1440}$$
   $$\mathbf{x}_{\text{time}} = [\sin(\theta_t), \cos(\theta_t)]^T$$
   * Captures the *Dawn Phenomenon* (early morning cortisol/growth hormone surge increasing insulin resistance between 04:00 and 08:00 AM).
