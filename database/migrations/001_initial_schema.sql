-- ==========================================================
-- GlucoSaathi — Migration 001: Initial Relational Schema
-- ==========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  age INTEGER NOT NULL,
  diabetes_type TEXT DEFAULT 'Type 1 Diabetes',
  insulin_carb_ratio NUMERIC NOT NULL DEFAULT 15,
  target_glucose INTEGER DEFAULT 110,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Meals Table
CREATE TABLE IF NOT EXISTS meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  parsed_items JSONB NOT NULL,
  total_carbs NUMERIC NOT NULL,
  carb_min NUMERIC,
  carb_max NUMERIC,
  confidence TEXT DEFAULT 'High',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Glucose Readings Table
CREATE TABLE IF NOT EXISTS glucose_readings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  value INTEGER NOT NULL,
  unit TEXT DEFAULT 'mg/dL',
  source TEXT DEFAULT 'manual',
  trend TEXT DEFAULT 'stable',
  meal_relation TEXT DEFAULT 'pre_meal',
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insulin Logs Table
CREATE TABLE IF NOT EXISTS insulin_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  insulin_type TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  delivery_type TEXT DEFAULT 'bolus',
  carbs_covered NUMERIC,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Activity Logs Table
CREATE TABLE IF NOT EXISTS activity_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  activity_type TEXT NOT NULL,
  intensity TEXT DEFAULT 'Moderate',
  duration_minutes INTEGER NOT NULL,
  recorded_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Risk Calculations Table
CREATE TABLE IF NOT EXISTS risk_calculations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  glucose INTEGER NOT NULL,
  insulin_on_board NUMERIC NOT NULL,
  carbs_consumed NUMERIC NOT NULL,
  physical_activity TEXT NOT NULL,
  time_since_last_meal NUMERIC NOT NULL,
  risk_level TEXT NOT NULL,
  risk_score INTEGER NOT NULL,
  explanation TEXT NOT NULL,
  factors JSONB NOT NULL,
  recommendations TEXT[],
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Audit Logs Table
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id TEXT NOT NULL,
  action TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for Query Performance
CREATE INDEX IF NOT EXISTS idx_meals_user ON meals(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_glucose_user ON glucose_readings(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_insulin_user ON insulin_logs(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_user ON activity_logs(user_id, recorded_at DESC);
CREATE INDEX IF NOT EXISTS idx_risk_user ON risk_calculations(user_id, created_at DESC);
