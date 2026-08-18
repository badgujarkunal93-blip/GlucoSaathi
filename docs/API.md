# 📡 GlucoSaathi API Specification

GlucoSaathi provides a clean, validated API layer for Indian meal carbohydrate estimation, hypoglycemia risk assessment, and clinical journal synchronization.

---

## 1. Meal Parsing & Carb Estimation

### `POST /api/meals/parse`
Parses free-text meal descriptions or uploaded camera photos and maps items against the ICMR-NIN Indian food database.

**Request Body:**
```json
{
  "description": "2 rotis, 1 bowl dal tadka and steamed rice",
  "photoBase64": "data:image/jpeg;base64,... (optional)"
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "source": "Gemini 1.5 Flash (Live AI) | ICMR-NIN Engine",
  "data": {
    "totalCarbs": 76,
    "minimumCarbs": 68,
    "maximumCarbs": 84,
    "rangeText": "68–84 g",
    "confidence": "High",
    "items": [
      {
        "name": "Whole Wheat Roti / Chapati",
        "quantity": 2,
        "unit": "1 piece",
        "carbsPerUnit": 15,
        "carbs": 30,
        "glycemicIndex": "Medium",
        "confidence": "High",
        "icon": "🫓",
        "source": "ICMR-NIN, 2020"
      },
      {
        "name": "Toor Dal / Dal Tadka",
        "quantity": 1,
        "unit": "1 katori / bowl (150ml)",
        "carbsPerUnit": 18,
        "carbs": 18,
        "glycemicIndex": "Low-Med",
        "confidence": "High",
        "icon": "🍲",
        "source": "ICMR-NIN, 2020"
      },
      {
        "name": "Steamed White Rice",
        "quantity": 1,
        "unit": "1 katori / bowl (cooked)",
        "carbsPerUnit": 28,
        "carbs": 28,
        "glycemicIndex": "High",
        "confidence": "High",
        "icon": "🍚",
        "source": "ICMR-NIN, 2020"
      }
    ],
    "notes": "Matched authoritative ICMR-NIN portion tables."
  }
}
```

---

## 2. Hypoglycemia Risk Engine

### `POST /api/risk/calculate`
Evaluates multi-factor clinical telemetry to predict hypoglycemia probability with explainable factor breakdown.

**Request Body:**
```json
{
  "glucose": 86,
  "insulinOnBoard": 1.8,
  "carbsConsumed": 45,
  "carbsCovered": 60,
  "activityLevel": "Moderate",
  "timeSinceMealHours": 3.2
}
```

**Response (`200 OK`):**
```json
{
  "success": true,
  "data": {
    "riskLevel": "MODERATE",
    "score": 58,
    "color": "orange",
    "headline": "Moderate Risk — Be Attentive",
    "explanation": "Moderate caution advised due to active IOB and post-exercise muscle glucose uptake.",
    "isEmergencyHypo": false,
    "factors": [
      {
        "factor": "Insulin On Board (IOB)",
        "weight": 0.40,
        "impact": "Moderate",
        "score": 0.60,
        "explanation": "Moderate active insulin (1.8 U) requires ongoing monitoring."
      },
      {
        "factor": "Carb Balance vs Bolus",
        "weight": 0.30,
        "impact": "Moderate",
        "score": 0.65,
        "explanation": "Slight carb deficit relative to bolus dosage."
      },
      {
        "factor": "Physical Activity",
        "weight": 0.20,
        "impact": "Moderate",
        "score": 0.65,
        "explanation": "Moderate (Brisk walk, yoga, cycling) increases muscle insulin sensitivity and glucose consumption rate."
      },
      {
        "factor": "Digestion & Fasting Time",
        "weight": 0.10,
        "impact": "Moderate",
        "score": 0.55,
        "explanation": "3.2 hours since last meal; food absorption is tapering off."
      }
    ],
    "recommendations": [
      "Monitor glucose trajectory over the next 30–60 minutes.",
      "Ensure fast-acting carbs are available if engaging in physical activity.",
      "Verify timing of your next scheduled meal or snack."
    ]
  }
}
```

---

## 3. Glucose Logging

### `POST /api/glucose`
Logs blood glucose readings and triggers real-time telemetry updates.

**Request Body:**
```json
{
  "value": 108,
  "unit": "mg/dL",
  "source": "meter",
  "trend": "stable",
  "mealRelation": "pre_meal",
  "notes": "Fasting morning reading"
}
```

---

## 4. Reference Bolus Calculation

### `POST /api/insulin/calculate-bolus`
Provides a reference-only bolus computation for educational guidance.

**Request Body:**
```json
{
  "carbohydrates": 68,
  "insulinCarbRatio": 15,
  "currentGlucose": 108,
  "targetGlucose": 110,
  "correctionFactor": 50,
  "activeIob": 0.8
}
```

**Response:**
```json
{
  "totalSuggestedDose": 4.1,
  "carbDose": 4.5,
  "correctionDose": 0.0,
  "iobSubtracted": 0.4,
  "disclaimer": "For educational & reference purposes only. Never adjust prescribed medical dosing without physician consultation."
}
```
