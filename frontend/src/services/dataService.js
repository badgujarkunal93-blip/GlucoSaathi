import { db, isFirebaseConfigured } from '../lib/firebase/config';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';

const STORAGE_KEYS = {
  MEALS: 'glucosaathi_meals',
  GLUCOSE: 'glucosaathi_glucose',
  INSULIN: 'glucosaathi_insulin',
  ACTIVITY: 'glucosaathi_activity',
  RISK: 'glucosaathi_risk',
  PROFILE: 'glucosaathi_profile'
};

/**
 * Helper to get local data
 */
function getLocal(key, defaultVal = []) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : defaultVal;
  } catch {
    return defaultVal;
  }
}

/**
 * Helper to save local data
 */
function setLocal(key, val) {
  try {
    localStorage.setItem(key, JSON.stringify(val));
  } catch (e) {
    console.error('Failed to save to localStorage', e);
  }
}

export const DataService = {
  // Meals
  async saveMeal(meal) {
    const newMeal = {
      ...meal,
      id: meal.id || `meal_${Date.now()}`,
      createdAt: new Date().toISOString()
    };

    // Save locally
    const current = getLocal(STORAGE_KEYS.MEALS);
    setLocal(STORAGE_KEYS.MEALS, [newMeal, ...current]);

    // Save to Firebase if active
    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'meals'), newMeal);
      } catch (err) {
        console.warn('Firebase meal sync skipped:', err.message);
      }
    }

    return newMeal;
  },

  async getMeals() {
    return getLocal(STORAGE_KEYS.MEALS);
  },

  // Glucose Readings
  async saveGlucose(reading) {
    const newReading = {
      ...reading,
      id: reading.id || `glu_${Date.now()}`,
      recordedAt: reading.recordedAt || new Date().toISOString()
    };

    const current = getLocal(STORAGE_KEYS.GLUCOSE);
    setLocal(STORAGE_KEYS.GLUCOSE, [newReading, ...current]);

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'glucose_readings'), newReading);
      } catch (err) {
        console.warn('Firebase glucose sync skipped:', err.message);
      }
    }

    return newReading;
  },

  async getGlucoseReadings() {
    return getLocal(STORAGE_KEYS.GLUCOSE);
  },

  // Insulin Logs
  async saveInsulin(dose) {
    const newDose = {
      ...dose,
      id: dose.id || `ins_${Date.now()}`,
      recordedAt: dose.recordedAt || new Date().toISOString()
    };

    const current = getLocal(STORAGE_KEYS.INSULIN);
    setLocal(STORAGE_KEYS.INSULIN, [newDose, ...current]);

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'insulin_logs'), newDose);
      } catch (err) {
        console.warn('Firebase insulin sync skipped:', err.message);
      }
    }

    return newDose;
  },

  // Activity Logs
  async saveActivity(activity) {
    const newActivity = {
      ...activity,
      id: activity.id || `act_${Date.now()}`,
      recordedAt: activity.recordedAt || new Date().toISOString()
    };

    const current = getLocal(STORAGE_KEYS.ACTIVITY);
    setLocal(STORAGE_KEYS.ACTIVITY, [newActivity, ...current]);

    if (isFirebaseConfigured && db) {
      try {
        await addDoc(collection(db, 'activity_logs'), newActivity);
      } catch (err) {
        console.warn('Firebase activity sync skipped:', err.message);
      }
    }

    return newActivity;
  },

  // Risk Calculations
  async saveRiskAssessment(riskData) {
    const record = {
      ...riskData,
      id: riskData.id || `risk_${Date.now()}`,
      calculatedAt: new Date().toISOString()
    };

    const current = getLocal(STORAGE_KEYS.RISK);
    setLocal(STORAGE_KEYS.RISK, [record, ...current]);

    return record;
  },

  // User Profile
  async saveProfile(profile) {
    setLocal(STORAGE_KEYS.PROFILE, profile);
    return profile;
  },

  async getProfile() {
    return getLocal(STORAGE_KEYS.PROFILE, null);
  }
};
