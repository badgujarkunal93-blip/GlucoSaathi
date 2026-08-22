# 🔒 Data Governance, Patient Privacy & DPDPA Compliance
### **GlucoSaathi — Indian Digital Personal Data Protection Act (DPDPA 2023) Framework**

---

## 1. Compliance with the Digital Personal Data Protection Act, 2023 (India)

The *Digital Personal Data Protection Act, 2023 (DPDPA 2023)* establishes statutory obligations for entities processing digital personal data in India. In GlucoSaathi:
* **The Patient** is the **Data Principal** ($\S 2(\text{j})$).
* **GlucoSaathi Platform** acts as the **Data Fiduciary** ($\S 2(\text{i})$).

```
┌────────────────────────────────────────────────────────────────────────────────────────┐
│                                 DPDPA 2023 CORE PILLARS                                │
├────────────────────────────────┬───────────────────────────────────────────────────────┤
│ 1. NOTICE & CONSENT (§6)       │ Itemized, plain-language consent in English / Hindi.  │
│ 2. PURPOSE LIMITATION (§7)     │ Data processed strictly for personal glycemic insights│
│ 3. DATA MINIMIZATION (§4)      │ No extraneous location, biometric or contact harvesting│
│ 4. DATA PRINCIPAL RIGHTS (§11) │ Right to access, correct, withdraw consent, and erase. │
│ 5. STORAGE LIMITATION (§8)     │ Automatic archival / purging of telemetry past tenure. │
└────────────────────────────────┴───────────────────────────────────────────────────────┘
```

---

## 2. Technical Data Protection & Security Controls

### **A. Encryption Standards**
* **In Transit**: All network traffic between client browser/mobile devices and GlucoSaathi API servers is strictly enforced over **TLS 1.3** with Perfect Forward Secrecy (PFS) and HTTP Strict Transport Security (HSTS).
* **At Rest**: Continuous glucose streams, meal records, and insulin logs stored in Firestore and Firebase Cloud Storage are encrypted using **AES-256-GCM** with envelope key management via Google Cloud KMS.

### **B. Granular Patient-Mediated Access Control**
* GlucoSaathi enforces **Row-Level Security (RLS)** at the database tier.
* Patients have sole administrative ownership over their telemetry records.
* Doctor Report generation uses ephemeral cryptographically signed tokens ($30\text{--}\text{minute expiration}$) rather than persistent open public links.

### **C. Immutable Audit Trail**
* Every data creation, update, export, and deletion event generates a tamper-evident audit record in `audit_logs` storing:
  * `timestamp_utc`
  * `user_id`
  * `action_type` (`LOG_GLUCOSE`, `GENERATE_DOCTOR_REPORT`, `EXPORT_DATA`, `REVOKE_CONSENT`)
  * `ip_hash` (One-way SHA-256 hash for privacy preservation)

---

## 3. Data Flow & Cross-Border Processing Policy

* **Data Residency**: All identifiable patient health data (CGM streams, insulin profiles, clinical notes) is hosted within **Indian Sovereign Cloud Infrastructure** (e.g. AWS Asia Pacific Mumbai `ap-south-1` or MeitY-empaneled local data centers).
* **AI Model Processing**: When external multimodal LLMs (e.g. Google Gemini 1.5) are invoked for Indian food image parsing:
  1. No Personally Identifiable Information (PII) such as patient name, age, phone number, or medical ID is transmitted.
  2. Only the isolated meal text string or cropped food plate image is sent for nutrient inference.
  3. Zero-retention enterprise API terms are enforced to prevent patient dietary data from being stored or used for model retraining.
