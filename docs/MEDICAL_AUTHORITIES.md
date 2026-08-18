# 🏛️ Medical Authorities, Clinical Societies & Guideline Mapping
### **GlucoSaathi — Regulatory & Clinical Authority Framework**

---

## 1. Indian National Authorities & Clinical Societies

Every clinical reference, diagnostic threshold, and nutritional baseline in GlucoSaathi is aligned with the following statutory bodies and professional societies in India:

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 INDIAN HEALTH AUTHORITIES                              │
├─────────────────────────────────────────┬──────────────────────────────────────────────┤
│ STATUTORY & REGULATORY BODIES           │ CLINICAL & RESEARCH SOCIETIES                │
│ • CDSCO (Medical Device Rules 2017)     │ • ICMR (National Ethical Guidelines / T1D)   │
│ • MoHFW (Telemedicine & Clinical Rules) │ • NIN (Indian Food Composition Tables 2020)  │
│ • NHA / ABDM (Health Data Interoperability)│ • RSSDI (Clinical Practice Recommendations)│
└─────────────────────────────────────────┴──────────────────────────────────────────────┘
```

---

### **1. Central Drugs Standard Control Organisation (CDSCO)**
* **Role**: National regulatory authority for pharmaceuticals, medical devices, and diagnostic tools in India.
* **Governing Legislation**: *Medical Device Rules, 2017 (MDR 2017)* under the *Drugs and Cosmetics Act, 1940*.
* **Relevance to GlucoSaathi**: Evaluates whether software functions constitute **Software as a Medical Device (SaMD)**. Non-prescriptive clinical decision support tools providing reference estimates are categorized differently from automated insulin pump controllers (Class C/D).
* **Official Source**: [https://cdsco.gov.in](https://cdsco.gov.in)

---

### **2. Indian Council of Medical Research (ICMR)**
* **Role**: Apex apex body in India for the formulation, coordination, and promotion of biomedical research.
* **Key Publications**:
  * *ICMR Guidelines for Management of Type 1 Diabetes (2022)*: Recommends multi-dose insulin regimens, carbohydrate counting education, and regular screening for nocturnal hypoglycemia.
  * *National Ethical Guidelines for Biomedical and Health Research Involving Human Participants (2017)*: Mandatory ethical guidelines for prospective clinical trials, informed consent, and health data research in India.
* **Official Source**: [https://main.icmr.nic.in](https://main.icmr.nic.in)

---

### **3. National Institute of Nutrition (ICMR-NIN, Hyderabad)**
* **Role**: Premier national nutrition research institute under ICMR.
* **Key Publication**: *Indian Food Composition Tables (IFCT 2020)*.
  * Provides authoritative proximate principles, total dietary fiber, available carbohydrates, fatty acid profiles, and micronutrient values across 528 key Indian foods analyzed via AOAC-validated laboratory assays.
* **Relevance to GlucoSaathi**: **Exclusive primary ground truth** for all Indian food database lookup and carbohydrate estimation.
* **Official Source**: [https://www.nin.res.in](https://www.nin.res.in)

---

### **4. Research Society for the Study of Diabetes in India (RSSDI)**
* **Role**: Largest professional organization of diabetes healthcare professionals and researchers in Asia.
* **Key Publication**: *RSSDI Clinical Practice Recommendations for the Management of Type 1 Diabetes (2021)*.
  * Defines glycemic targets: Fasting $80\text{--}130\text{ mg/dL}$, Post-prandial $<180\text{ mg/dL}$, Time-in-Range $>70\%$, and formalizes the **Rule of 15** for acute hypoglycemia management in Indian settings.
* **Official Source**: [https://www.rssdi.in](https://www.rssdi.in)

---

### **5. National Health Authority (NHA) / Ayushman Bharat Digital Mission (ABDM)**
* **Role**: Agency responsible for building the digital health backbone of India.
* **Relevance to GlucoSaathi**: Interoperability standards for the **Ayushman Bharat Health Account (ABHA)**, FHIR (Fast Healthcare Interoperability Resources) profile integration for sharing visit summaries with treating endocrinologists.
* **Official Source**: [https://abdm.gov.in](https://abdm.gov.in)

---

## 2. International Clinical & Standards Authorities

| Authority | Jurisdiction | Primary Guideline / Mandate | Relevance to GlucoSaathi | Official URL |
| :--- | :--- | :--- | :--- | :--- |
| **American Diabetes Association (ADA)** | Global / USA | *Standards of Care in Diabetes (2024)* | Defines Level 1 ($<70$), Level 2 ($<54$), Level 3 Hypoglycemia consensus definitions. | [https://diabetesjournals.org/care](https://diabetesjournals.org/care) |
| **European Association for the Study of Diabetes (EASD)** | Europe / Global | *Continuous Glucose Monitoring Consensus (Battelino et al., 2019)* | Established Time-in-Range (TIR) metrics: $>70\%$ TIR ($70\text{--}180\text{ mg/dL}$), $<4\%$ TBR ($<70\text{ mg/dL}$). | [https://www.easd.org](https://www.easd.org) |
| **International Society for Pediatric and Adolescent Diabetes (ISPAD)** | Global | *ISPAD Clinical Practice Consensus Guidelines (2022)* | Pediatric glycemic targets, hypoglycemia recognition in young children, ketone monitoring triggers. | [https://www.ispad.org](https://www.ispad.org) |
| **US Food and Drug Administration (FDA)** | USA | *Clinical Decision Support Software Guidance (Sept 2022)* & *21 CFR 880* | Regulatory boundaries between non-device CDS software and regulated medical devices. | [https://www.fda.gov](https://www.fda.gov) |
| **World Health Organization (WHO)** | Global | *WHO Technical Guidance on Digital Health Interventions (2023)* | Classifies patient-targeted decision support and clinical safety frameworks for NCDs. | [https://www.who.int](https://www.who.int) |
