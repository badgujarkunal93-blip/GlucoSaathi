# 🎬 GlucoSaathi — 5–7 Minute Hackathon Video Presentation Guide
### **Innovate 4 Impact: AI4SDG Global Hackathon 2026 — Problem Statement PS-102**
**Theme**: UN SDG 3 — Good Health & Well-Being

---

## ⏱️ Video Presentation Timeline

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│  0:00 - 0:45 │ 1. The 180-Decision Daily Burden of T1D in India & PS-102 Problem       │
│  0:45 - 1:45 │ 2. The Solution: GlucoSaathi Live Dashboard & Daily Telemetry           │
│  1:45 - 3:00 │ 3. AI Multimodal Indian Meal Parsing & Range-Based Carb Estimation       │
│  3:00 - 4:15 │ 4. Explainable Hypoglycemia Risk Engine & Clinical "Why?" Breakdown     │
│  4:15 - 5:15 │ 5. Multi-Persona Evaluation (Priya, Rajesh, Aarav) & Doctor Export      │
│  5:15 - 6:00 │ 6. UN SDG Impact, Architecture, & Future ML Roadmap                      │
└────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## 🎙️ Step-by-Step Speaker Script

### **Segment 1 (0:00 – 0:45): The Problem Statement (PS-102)**
* **Visual**: Show slide / opening shot with GlucoSaathi logo and the title: *"AI-Powered Hypoglycemia Prediction & Indian Meal Carb-Counting for Type 1 Diabetes."*
* **Speaker**: 
  > *"Namaste judges! For the 37 million Indians living with diabetes—especially children and adults with Type 1 Diabetes—managing blood glucose means making over 180 life-or-death decisions every single day. The greatest fear is hypoglycemia: an insulin over-dose relative to carb intake that can trigger seizures, unconsciousness, or death in minutes.*  
  > *Western apps only know pizza and pasta, and fail completely at composite Indian meals like dal-rice-sabzi-roti. Today, we are proud to present **GlucoSaathi**, an India-first AI decision-support companion designed for UN SDG 3."*

---

### **Segment 2 (0:45 – 1:45): Live Dashboard & Persona Context**
* **Visual**: Screen recording of the **GlucoSaathi Dashboard**. Click the persona switcher to highlight **Aarav Sharma (24y)**.
* **Speaker**:
  > *"Here is GlucoSaathi's clean, distraction-free dashboard. At a glance, Aarav sees his real-time Hypoglycemia Risk status, his active Insulin on Board (IOB: 0.8 Units), and his current glucose of 108 mg/dL.*  
  > *Notice our evaluation persona switcher at the top: judges can instantly switch between Aarav, Priya (a 12-year-old child needing school lunch carb counts), or Rajesh (a 45-year-old on an NPH insulin regimen)."*

---

### **Segment 3 (1:45 – 3:00): Multimodal Indian Meal Parsing & Carb Range**
* **Visual**: Navigate to **Log Meal**. 
  1. Click the preset: *"2 rotis, 1 bowl dal tadka and 1 bowl steamed rice"*.
  2. Click **Estimate Carbohydrates**. Show the breakdown.
  3. Click `+` on Roti to increase quantity from 2 to 3. Show live recalculation from 76g to 91g carbs and range updating.
  4. Highlight the reference bolus card: `~6.1 Units` at ICR 1:15 with the clear disclaimer.
* **Speaker**:
  > *"Now let's log an Indian meal. Users can type naturally in Hindi or English, or snap a plate photo using our Gemini 1.5 Flash Vision parser.*  
  > *Our engine recognizes complex multi-ingredient thalis and maps them to our curated 60+ item ICMR-NIN database. Notice that instead of false precision, we provide a realistic range—68 to 84 grams—reflecting authentic home cooking variations.*  
  > *Patients can adjust portions with one click, and the reference bolus dynamically recalculates according to their doctor-prescribed Insulin-to-Carb ratio."*

---

### **Segment 4 (3:00 – 4:15): Explainable Hypoglycemia Risk Engine & "Why?" Breakdown**
* **Visual**: Click **"Evaluate Hypo Risk with this Meal"** $\rightarrow$ Navigate to **Risk Check**.
  1. Drag the Blood Glucose slider down to **62 mg/dL**.
  2. The Gauge immediately switches to **HIGH RISK ALERT** in red with the **Rule of 15 Emergency Guidance**.
  3. Expand the **Transparent Factor Breakdown ("Why?")** showing the 4 weighted factors: IOB (40%), Carb Balance (30%), Exercise (20%), Digestion Time (10%).
* **Speaker**:
  > *"Black-box AI cannot be trusted in healthcare. GlucoSaathi uses a transparent, explainable 4-factor rule engine.*  
  > *Watch what happens when blood sugar drops to 62 mg/dL or active insulin is stacked: the app triggers the Clinical Rule of 15 emergency protocol—directing the patient to take 15 grams of fast carbs and retest in 15 minutes.*  
  > *Crucially, we explain WHY the score was calculated so patients and parents learn their glycemic triggers."*

---

### **Segment 5 (4:15 – 5:15): Doctor Clinical Report & 1-Click Export**
* **Visual**: Click **Doctor Report** in the top header / quick action bar.
  1. Modal opens with **Time-in-Range (TIR: 78%)**, mean glucose (118 mg/dL), hypo exposure, and recent meal logs.
  2. Click **Export CSV Dataset** and show the downloaded file.
* **Speaker**:
  > *"GlucoSaathi bridges the doctor-patient gap. With one click, the patient can generate a comprehensive clinical summary for their endocrinologist, Dr. Mehta, complete with Time-in-Range percentages and a downloadable CSV log."*

---

### **Segment 6 (5:15 – 6:00): Impact & Future Scope**
* **Visual**: Return to Dashboard / Architecture slide.
* **Speaker**:
  > *"GlucoSaathi combines the speed of modern React and Vite, the multimodal intelligence of Google Gemini, the authoritative standards of ICMR-NIN, and a deterministic safety-first risk engine.*  
  > *In Phase 2, we will integrate CGM stream data and personalized predictive ML models to alert patients 30 minutes before nighttime hypoglycemia occurs.*  
  > *Thank you for your time, and we look forward to your questions!"*
