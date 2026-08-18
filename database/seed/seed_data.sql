-- ==========================================================
-- GlucoSaathi — Seed Data (Demo Evaluation Scenarios)
-- ==========================================================

-- Demo User Profile (Aarav Sharma)
INSERT INTO profiles (user_id, name, age, diabetes_type, insulin_carb_ratio, target_glucose)
VALUES ('demo_aarav', 'Aarav Sharma', 24, 'Type 1 Diabetes', 15, 110)
ON CONFLICT (user_id) DO NOTHING;

-- Demo Glucose Reading
INSERT INTO glucose_readings (user_id, value, unit, source, trend, meal_relation)
VALUES ('demo_aarav', 108, 'mg/dL', 'meter', 'stable', 'fasting');

-- Demo Meal
INSERT INTO meals (user_id, description, parsed_items, total_carbs, carb_min, carb_max, confidence)
VALUES (
  'demo_aarav',
  '2 rotis, dal tadka and steamed rice',
  '[{"name": "Whole Wheat Roti", "quantity": 2, "carbs": 30}, {"name": "Dal Tadka", "quantity": 1, "carbs": 18}, {"name": "Steamed Rice", "quantity": 1, "carbs": 28}]'::jsonb,
  76,
  68,
  84,
  'High'
);
