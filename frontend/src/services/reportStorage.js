/**
 * GlucoSaathi Clinical Report Storage Abstraction Layer
 * Encapsulates localStorage persistence with in-memory fallback for saved patient assessments.
 * Extensible for future backend integrations (Supabase, Firebase, PostgreSQL).
 */

const STORAGE_KEY = 'glucosaathi_saved_reports';

// In-memory fallback if localStorage is unavailable (e.g. Node test environment)
const memoryStore = new Map();

function getStorage() {
  if (typeof globalThis !== 'undefined' && globalThis.localStorage) {
    return {
      getItem: (k) => globalThis.localStorage.getItem(k),
      setItem: (k, v) => globalThis.localStorage.setItem(k, v),
      removeItem: (k) => globalThis.localStorage.removeItem(k)
    };
  }
  return {
    getItem: (k) => memoryStore.get(k) || null,
    setItem: (k, v) => memoryStore.set(k, v),
    removeItem: (k) => memoryStore.delete(k)
  };
}

const SEED_REPORTS = [
  {
    id: 'report_demo_001',
    createdAt: new Date(Date.now() - 3600000 * 4).toISOString(),
    reportVersion: '1.0',
    patient: {
      name: 'Aarav Sharma',
      age: 26,
      diagnosis: 'Type 1 Diabetes (Duration: 8 yrs)'
    },
    clinicalParameters: {
      glucose: 108,
      glucoseTrend: 'slow_fall',
      activeInsulin: 0.8,
      icr: '1:15',
      isf: '1:50',
      targetRange: '70-140'
    },
    meal: {
      description: '2 rotis, dal tadka and steamed rice',
      estimatedCarbs: 68
    },
    activity: {
      level: 'Light'
    },
    prediction: {
      forecast30Min: 98,
      riskScore: 15,
      riskLevel: 'LOW',
      isEmergencyHypo: false,
      riskDrivers: ['Glucose Momentum (62%)', 'Active Insulin (18%)']
    },
    glucoseMetrics: {
      tir: 82,
      meanGlucose: 118,
      gmi: 6.2
    },
    meals: [
      { name: 'Whole Wheat Roti', logs: 18, carbs: '15g/pc' },
      { name: 'Dal Tadka', logs: 14, carbs: '18g/bowl' },
      { name: 'Steamed Rice', logs: 12, carbs: '28g/bowl' }
    ],
    modelInfo: {
      engine: 'LightGBM + ICMR-NIN IFCT 2017',
      mode: 'Calibrated Clinical Decision Support'
    }
  }
];

export const reportStorage = {
  /**
   * Fetch all saved reports (sorted newest first)
   */
  getReports: () => {
    try {
      const storage = getStorage();
      const data = storage.getItem(STORAGE_KEY);
      if (!data) {
        // Seed default report on first use
        storage.setItem(STORAGE_KEY, JSON.stringify(SEED_REPORTS));
        return SEED_REPORTS;
      }
      const parsed = JSON.parse(data);
      if (!Array.isArray(parsed)) return [];
      return parsed.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } catch (err) {
      console.warn('Failed to read saved reports from storage:', err);
      return [];
    }
  },

  /**
   * Save a new assessment report snapshot
   */
  saveReport: (snapshot) => {
    try {
      const current = reportStorage.getReports();

      // Prevent accidental rapid duplicate saves within 3 seconds
      const isDuplicate = current.some(r => {
        const timeDiff = Math.abs(new Date(r.createdAt) - new Date());
        return timeDiff < 3000 && r.clinicalParameters?.glucose === snapshot.clinicalParameters?.glucose;
      });

      if (isDuplicate) {
        return current[0];
      }

      const newId = snapshot.id || `report_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 6)}`;
      const newReport = {
        ...snapshot,
        id: newId,
        createdAt: snapshot.createdAt || new Date().toISOString(),
        reportVersion: '1.0'
      };

      const updated = [newReport, ...current];
      const storage = getStorage();
      storage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return newReport;
    } catch (err) {
      console.error('Failed to save report to storage:', err);
      return snapshot;
    }
  },

  /**
   * Get single report snapshot by ID
   */
  getReportById: (id) => {
    try {
      const reports = reportStorage.getReports();
      return reports.find(r => r.id === id) || null;
    } catch (err) {
      console.warn('Failed to get report by ID:', err);
      return null;
    }
  },

  /**
   * Delete report by ID
   */
  deleteReport: (id) => {
    try {
      const current = reportStorage.getReports();
      const filtered = current.filter(r => r.id !== id);
      const storage = getStorage();
      storage.setItem(STORAGE_KEY, JSON.stringify(filtered));
      return filtered;
    } catch (err) {
      console.error('Failed to delete report:', err);
      return [];
    }
  },

  /**
   * Clear all saved reports
   */
  clearReports: () => {
    try {
      const storage = getStorage();
      storage.removeItem(STORAGE_KEY);
      return [];
    } catch (err) {
      console.error('Failed to clear reports:', err);
      return [];
    }
  }
};
