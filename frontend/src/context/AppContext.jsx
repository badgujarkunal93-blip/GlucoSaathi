import React, { createContext, useContext, useState, useMemo, useEffect, useCallback } from 'react';
import { evaluateHypoglycemiaRisk, calculateBolusReference } from '../lib/risk/riskEngine';
import { estimateCarbohydrates } from '../lib/carb/carbEstimator';
import { DataService } from '../services/dataService';
import { mlClient } from '../services/mlService';

const AppContext = createContext();

export const DEMO_PERSONAS = {
  aarav: {
    id: 'aarav',
    name: 'Aarav Sharma',
    age: 24,
    condition: 'Type 1 Diabetes (4 yrs)',
    icrRatio: 15,
    correctionFactor: 50,
    targetMin: 70,
    targetMax: 140,
    activeInsulinType: 'Rapid Acting (Novorapid / Aspart)',
    basalRegimen: '16 U Tresiba at 10 PM',
    story: 'Active software professional managing post-lunch gym workouts and tech meetings.',
    defaultInputs: {
      glucose: 108,
      glucoseTrend: 'falling_slowly',
      insulinOnBoard: 0.8,
      recentBolus: 4.5,
      carbsConsumed: 68,
      carbsCovered: 68,
      timeSinceMealHours: 2.0,
      activityLevel: 'Light',
      mealDescription: '2 rotis, dal tadka and steamed rice'
    }
  },
  priya: {
    id: 'priya',
    name: 'Priya Patel (School Student)',
    age: 12,
    condition: 'Type 1 Diabetes (Diagnosed Age 8)',
    icrRatio: 12,
    correctionFactor: 60,
    targetMin: 80,
    targetMax: 150,
    activeInsulinType: 'Rapid Acting (Humalog)',
    basalRegimen: '10 U Lantus at Bedtime',
    story: 'School student needing safe carbohydrate counting for rajma-chawal lunch and afternoon sports class.',
    defaultInputs: {
      glucose: 122,
      glucoseTrend: 'stable',
      insulinOnBoard: 1.4,
      recentBolus: 5.0,
      carbsConsumed: 60,
      carbsCovered: 60,
      timeSinceMealHours: 1.5,
      activityLevel: 'Moderate',
      mealDescription: 'Rajma Chawal (1 bowl rajma + 1 bowl rice)'
    }
  },
  rajesh: {
    id: 'rajesh',
    name: 'Rajesh Kumar (NPH Regimen)',
    age: 45,
    condition: 'Type 1 Diabetes (15 yrs)',
    icrRatio: 10,
    correctionFactor: 40,
    targetMin: 70,
    targetMax: 160,
    activeInsulinType: 'Regular Insulin + NPH Mixed',
    basalRegimen: '22 U NPH twice daily',
    story: 'Traditional Indian thali diet prone to afternoon NPH insulin peak dips and delayed digestion.',
    defaultInputs: {
      glucose: 94,
      glucoseTrend: 'falling',
      insulinOnBoard: 2.2,
      recentBolus: 6.0,
      carbsConsumed: 76,
      carbsCovered: 76,
      timeSinceMealHours: 3.5,
      activityLevel: 'Light',
      mealDescription: '2 rotis, mixed vegetable sabzi, dal and curd'
    }
  }
};

const DEFAULT_USER_PROFILE = {
  name: 'Me (My Profile)',
  age: 26,
  condition: 'Type 1 Diabetes',
  icrRatio: 15,
  correctionFactor: 50,
  targetMin: 70,
  targetMax: 140,
  activeInsulinType: 'Rapid Acting (Aspart / Novorapid)',
  basalRegimen: '16 U Basal at 10 PM',
  preferredUnits: 'mg/dL'
};

const INITIAL_HISTORY = [
  {
    id: 'rc-1',
    type: 'risk-check',
    timestamp: '9:05 AM',
    dayGroup: 'Today',
    title: 'Morning Hypo Risk Check',
    riskLevel: 'LOW',
    glucose: 108,
    insulinOnBoard: 0.8,
    calculatedDose: 4.5,
    summary: 'Safe glucose trajectory and manageable active insulin on board.',
    timeAgo: '15 min ago'
  },
  {
    id: 'meal-1',
    type: 'meal',
    timestamp: '8:42 AM',
    dayGroup: 'Today',
    title: 'Breakfast',
    description: '2 rotis, dal tadka and steamed rice',
    carbs: 68,
    confidence: 'High',
    items: [
      { name: 'Whole Wheat Roti', quantity: 2, carbs: 30, unit: 'piece', icon: '🫓' },
      { name: 'Dal Tadka', quantity: 1, carbs: 18, unit: 'bowl', icon: '🍲' },
      { name: 'Steamed Rice', quantity: 1, carbs: 20, unit: 'bowl', icon: '🍚' }
    ]
  },
  {
    id: 'glu-1',
    type: 'glucose',
    timestamp: '8:30 AM',
    dayGroup: 'Today',
    title: 'Fasting Fingerstick Check',
    value: 108,
    unit: 'mg/dL',
    trend: 'stable'
  }
];

export function AppProvider({ children }) {
  // Navigation View State: 'overview' | 'meal' | 'risk' | 'dashboard' | 'journal' | 'report'
  const [currentView, setCurrentView] = useState('overview');

  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState(false);
  const [isInsulinModalOpen, setIsInsulinModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isDoctorReportModalOpen, setIsDoctorReportModalOpen] = useState(false);
  const [isCSVImportOpen, setIsCSVImportOpen] = useState(false);
  const [isUserProfileOpen, setIsUserProfileOpen] = useState(false);

  // Data Mode: 'my_data' (Default) vs 'demo_scenario'
  const [dataMode, setDataMode] = useState('my_data');

  // Real Persistent User Profile
  const [userProfile, setUserProfile] = useState(() => {
    try {
      const saved = localStorage.getItem('glucosaathi_user_profile');
      return saved ? JSON.parse(saved) : DEFAULT_USER_PROFILE;
    } catch {
      return DEFAULT_USER_PROFILE;
    }
  });

  // Active Demo Persona (when in 'demo_scenario' mode)
  const [currentPersonaKey, setCurrentPersonaKey] = useState('aarav');
  const currentPersona = DEMO_PERSONAS[currentPersonaKey] || DEMO_PERSONAS.aarav;

  // Active clinical settings resolved based on dataMode
  const activeClinicalSettings = useMemo(() => {
    if (dataMode === 'demo_scenario') {
      return currentPersona;
    }
    return userProfile;
  }, [dataMode, currentPersona, userProfile]);

  // =========================================================================
  // SINGLE SOURCE OF TRUTH: Centralized Patient Input Telemetry
  // =========================================================================
  const [patientInputs, setPatientInputs] = useState({
    glucose: 108,
    glucoseTrend: 'falling_slowly',
    insulinOnBoard: 0.8,
    recentBolus: 4.5,
    carbsConsumed: 68,
    carbsCovered: 68,
    timeSinceMealHours: 2.0,
    activityLevel: 'Light',
    mealDescription: '2 rotis, dal tadka and steamed rice'
  });

  // ML Service Live Health & Async Prediction State
  const [mlStatus, setMlStatus] = useState('unknown'); // 'online' | 'offline' | 'loading'
  const [asyncMLResult, setAsyncMLResult] = useState(null);

  // History & Journal logs
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [glucoseLogs, setGlucoseLogs] = useState([
    { id: 'g1', value: 108, recordedAt: '2026-08-22T08:30:00Z', mealRelation: 'fasting' },
    { id: 'g2', value: 135, recordedAt: '2026-08-21T20:30:00Z', mealRelation: 'post_meal' },
    { id: 'g3', value: 112, recordedAt: '2026-08-21T14:00:00Z', mealRelation: 'post_meal' },
    { id: 'g4', value: 94, recordedAt: '2026-08-21T08:15:00Z', mealRelation: 'fasting' }
  ]);

  // Active Meal State
  const [activeMeal, setActiveMeal] = useState({
    description: '2 rotis, dal tadka and steamed rice',
    totalCarbs: 68,
    carbRange: '60–76g',
    confidence: 'High',
    items: [
      { name: 'Whole Wheat Roti', quantity: 2, carbs: 30, unit: 'piece', icon: '🫓' },
      { name: 'Dal Tadka', quantity: 1, carbs: 18, unit: 'bowl', icon: '🍲' },
      { name: 'Steamed Rice', quantity: 1, carbs: 20, unit: 'bowl', icon: '🍚' }
    ]
  });

  // Check ML Service Health on mount
  useEffect(() => {
    let isMounted = true;
    mlClient.checkHealth().then((res) => {
      if (isMounted) {
        setMlStatus(res.online ? 'online' : 'offline');
      }
    });
    return () => { isMounted = false; };
  }, []);

  // Async query to FastAPI ML Microservice whenever patient inputs change
  useEffect(() => {
    let isMounted = true;
    const g = Number(patientInputs.glucose) || 108;
    const iob = Number(patientInputs.insulinOnBoard) || 0;
    const carbs = Number(patientInputs.carbsConsumed) || 68;
    const activity = patientInputs.activityLevel || 'Light';
    const trend = patientInputs.glucoseTrend || 'falling_slowly';
    const roc = trend === 'falling_rapidly' ? -2.2 : trend.includes('falling') ? -1.2 : trend.includes('rising') ? 1.5 : 0.0;

    Promise.all([
      mlClient.predictHypoRisk({ glucose: g, glucoseRoc: roc, iob, carbs, activityLevel: activity }),
      mlClient.predictGlucoseForecast({ glucose: g, glucoseRoc: roc, iob, carbs, steps: activity === 'Intense' ? 2500 : 800 })
    ]).then(([riskRes, forecastRes]) => {
      if (isMounted) {
        setMlStatus(riskRes.success ? 'online' : 'offline');
        setAsyncMLResult({
          probability: riskRes.probability,
          riskScore: riskRes.riskScore,
          riskLevel: riskRes.riskLevel,
          isRuleOf15Armed: riskRes.isRuleOf15Armed,
          explainability: riskRes.explainability,
          predictedGlucose: forecastRes.predictedGlucose,
          conformalLower: forecastRes.intervalLower,
          conformalUpper: forecastRes.intervalUpper,
          mlSource: riskRes.source
        });
      }
    }).catch(() => {
      if (isMounted) setMlStatus('offline');
    });

    return () => { isMounted = false; };
  }, [patientInputs]);

  // =========================================================================
  // REACTIVE DERIVATION PIPELINE: Derives clinical risk, forecast & summaries
  // =========================================================================
  const derivedPatientState = useMemo(() => {
    const g = Number(patientInputs.glucose) || 108;
    const iob = Number(patientInputs.insulinOnBoard) || 0;
    const carbs = Number(patientInputs.carbsConsumed) || 68;
    const covered = Number(patientInputs.carbsCovered) || carbs;
    const activity = patientInputs.activityLevel || 'Light';
    const hours = Number(patientInputs.timeSinceMealHours) || 2.0;
    const trend = patientInputs.glucoseTrend || 'falling_slowly';

    // 1. Fallback / Local Physiological Calculation
    const evaluatedRisk = evaluateHypoglycemiaRisk({
      glucose: g,
      insulinOnBoard: iob,
      carbsConsumed: carbs,
      carbsCovered: covered,
      activityLevel: activity,
      timeSinceMealHours: hours
    });

    // 2. Resolve ML values (prefer live FastAPI async result if available)
    const modelProb = asyncMLResult ? asyncMLResult.probability : Math.min(0.98, Math.max(0.04, evaluatedRisk.score / 100));
    const riskScore = asyncMLResult ? asyncMLResult.riskScore : evaluatedRisk.score;
    const riskClass = g < 70 ? 'CRITICAL' : (asyncMLResult ? asyncMLResult.riskLevel : evaluatedRisk.riskLevel);
    const predicted30m = asyncMLResult ? asyncMLResult.predictedGlucose : (g < 70 ? 54 : Math.round(g - (iob * 8.5) + (carbs * 0.2)));

    // 3. Reference Carbohydrate Coverage Calculation
    const refBolus = calculateBolusReference({
      carbohydrates: carbs,
      insulinCarbRatio: activeClinicalSettings.icrRatio,
      currentGlucose: g,
      targetGlucose: (activeClinicalSettings.targetMin + activeClinicalSettings.targetMax) / 2,
      correctionFactor: activeClinicalSettings.correctionFactor,
      activeIob: iob
    });

    // 4. Aggregate Daily Clinical Summary
    const timeInRange = g >= 70 && g <= 140 ? 82 : g < 70 ? 68 : 74;
    const todayMetrics = {
      timeInRangePct: timeInRange,
      averageGlucose: Math.round((g + 126) / 2),
      mealsCount: 4,
      hypoAlertsCount: g < 70 || evaluatedRisk.isEmergencyHypo ? 2 : 1,
      totalCarbsToday: carbs + 74,
      activeIobUnits: iob
    };

    return {
      glucose: g,
      glucoseTrend: trend,
      insulinOnBoard: iob,
      recentBolus: patientInputs.recentBolus || 4.5,
      carbsConsumed: carbs,
      carbsCovered: covered,
      timeSinceMealHours: hours,
      activityLevel: activity,
      mealDescription: patientInputs.mealDescription,
      // ML & Risk derivations
      modelProbability: modelProb,
      riskScore,
      riskClass,
      riskLevel: riskClass,
      color: evaluatedRisk.color,
      headline: evaluatedRisk.headline,
      explanation: evaluatedRisk.explanation,
      riskContributors: evaluatedRisk.factors,
      recommendations: evaluatedRisk.recommendations,
      isEmergencyHypo: g < 70 || evaluatedRisk.isEmergencyHypo,
      ruleOf15Armed: g < 70 || (modelProb >= 0.50 && g < 85),
      forecast30mGlucose: predicted30m,
      conformalLower: asyncMLResult?.conformalLower,
      conformalUpper: asyncMLResult?.conformalUpper,
      mlSource: asyncMLResult?.mlSource || (mlStatus === 'online' ? 'FastAPI LightGBM' : 'Clinical Rule Engine'),
      referenceBolus: refBolus,
      todayMetrics
    };
  }, [patientInputs, activeClinicalSettings, asyncMLResult, mlStatus]);

  // Action: Update User Profile
  const updateUserProfile = (newProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('glucosaathi_user_profile', JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  // Action: Switch Persona (Demo Mode)
  const switchPersona = (personaKey) => {
    if (DEMO_PERSONAS[personaKey]) {
      const p = DEMO_PERSONAS[personaKey];
      setCurrentPersonaKey(personaKey);
      setPatientInputs(p.defaultInputs);
      setActiveMeal({
        description: p.defaultInputs.mealDescription,
        totalCarbs: p.defaultInputs.carbsConsumed,
        carbRange: `${p.defaultInputs.carbsConsumed - 8}–${p.defaultInputs.carbsConsumed + 8}g`,
        confidence: 'High',
        items: [
          { name: p.defaultInputs.mealDescription, quantity: 1, carbs: p.defaultInputs.carbsConsumed, unit: 'serving', icon: '🍛' }
        ]
      });
    }
  };

  // Action: Update a single patient input (e.g. from sliders or inputs)
  const updatePatientInput = (key, value) => {
    setPatientInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Action: Apply preset scenario
  const applyPresetScenario = (scenarioKey) => {
    if (scenarioKey === 'SAFE_LOW') {
      setPatientInputs(prev => ({
        ...prev,
        glucose: 110,
        glucoseTrend: 'stable',
        insulinOnBoard: 0.5,
        carbsConsumed: 60,
        carbsCovered: 60,
        activityLevel: 'Light',
        timeSinceMealHours: 1.5
      }));
    } else if (scenarioKey === 'MODERATE_CAUTION') {
      setPatientInputs(prev => ({
        ...prev,
        glucose: 94,
        glucoseTrend: 'falling',
        insulinOnBoard: 2.2,
        carbsConsumed: 30,
        carbsCovered: 60,
        activityLevel: 'Moderate',
        timeSinceMealHours: 3.0
      }));
    } else if (scenarioKey === 'HIGH_RISK') {
      setPatientInputs(prev => ({
        ...prev,
        glucose: 65,
        glucoseTrend: 'falling_rapidly',
        insulinOnBoard: 3.5,
        carbsConsumed: 15,
        carbsCovered: 65,
        activityLevel: 'Intense',
        timeSinceMealHours: 4.0
      }));
    }
  };

  // Action: Log Meal
  const logMeal = async ({ description, carbs, confidence, items }) => {
    const mealCarbs = Number(carbs) || 0;
    const newMealRecord = {
      id: `meal-${Date.now()}`,
      type: 'meal',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dayGroup: 'Today',
      title: 'Logged Indian Meal',
      description: description || 'Indian Meal',
      carbs: mealCarbs,
      confidence: confidence || 'High',
      items: items || []
    };

    setActiveMeal({
      description,
      totalCarbs: mealCarbs,
      carbRange: `${Math.round(mealCarbs * 0.85)}–${Math.round(mealCarbs * 1.15)}g`,
      confidence,
      items
    });

    setHistory(prev => [newMealRecord, ...prev]);
    setPatientInputs(prev => ({
      ...prev,
      carbsConsumed: mealCarbs,
      carbsCovered: mealCarbs,
      mealDescription: description,
      timeSinceMealHours: 0.2
    }));

    await DataService.saveMeal(newMealRecord);
  };

  // Action: Log Glucose Reading
  const logGlucoseReading = async ({ value, mealRelation, trend, notes }) => {
    const num = Number(value);
    const newLog = {
      id: `glu-${Date.now()}`,
      type: 'glucose',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dayGroup: 'Today',
      title: `${mealRelation === 'fasting' ? 'Fasting' : 'Post-Meal'} Glucose: ${num} mg/dL`,
      value: num,
      unit: 'mg/dL',
      trend: trend || 'stable',
      notes
    };

    setHistory(prev => [newLog, ...prev]);
    setGlucoseLogs(prev => [{ id: newLog.id, value: num, recordedAt: new Date().toISOString(), mealRelation }, ...prev]);
    setPatientInputs(prev => ({
      ...prev,
      glucose: num,
      glucoseTrend: trend || prev.glucoseTrend
    }));

    await DataService.saveGlucose(newLog);
  };

  // Action: Log Risk Check to History
  const logRiskCheckToHistory = async () => {
    const newRecord = {
      id: `rc-${Date.now()}`,
      type: 'risk-check',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dayGroup: 'Today',
      title: `${derivedPatientState.riskClass} Risk Check (${derivedPatientState.riskScore}/100)`,
      riskLevel: derivedPatientState.riskClass,
      glucose: derivedPatientState.glucose,
      insulinOnBoard: derivedPatientState.insulinOnBoard,
      calculatedDose: derivedPatientState.referenceBolus.totalSuggestedDose,
      summary: derivedPatientState.headline,
      timeAgo: 'Just now'
    };

    setHistory(prev => [newRecord, ...prev]);
    await DataService.saveRiskAssessment(newRecord);
  };

  const navigateTo = (viewName) => {
    setCurrentView(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        // Navigation & Modals
        currentView,
        navigateTo,
        isSettingsOpen,
        setIsSettingsOpen,
        isGlucoseModalOpen,
        setIsGlucoseModalOpen,
        isInsulinModalOpen,
        setIsInsulinModalOpen,
        isActivityModalOpen,
        setIsActivityModalOpen,
        isDoctorReportModalOpen,
        setIsDoctorReportModalOpen,
        isCSVImportOpen,
        setIsCSVImportOpen,
        isUserProfileOpen,
        setIsUserProfileOpen,

        // Data Mode & User Profile
        dataMode,
        setDataMode,
        userProfile,
        updateUserProfile,
        settings: activeClinicalSettings,
        setSettings: setUserProfile,

        // ML Status & Connection
        mlStatus,

        // Persona & Demo Scenarios
        currentPersonaKey,
        currentPersona,
        DEMO_PERSONAS: Object.values(DEMO_PERSONAS),
        switchPersona,

        // Single Centralized Reactive Patient State
        patientState: derivedPatientState,
        patientInputs,
        updatePatientInput,
        applyPresetScenario,

        // Specific Aliases for backward compatibility
        riskInputs: {
          glucose: derivedPatientState.glucose,
          insulinOnBoard: derivedPatientState.insulinOnBoard,
          carbsConsumed: derivedPatientState.carbsConsumed,
          carbsCovered: derivedPatientState.carbsCovered,
          activityLevel: derivedPatientState.activityLevel,
          timeSinceMealHours: derivedPatientState.timeSinceMealHours
        },
        riskResult: {
          riskLevel: derivedPatientState.riskClass,
          score: derivedPatientState.riskScore,
          color: derivedPatientState.color,
          headline: derivedPatientState.headline,
          explanation: derivedPatientState.explanation,
          factors: derivedPatientState.riskContributors,
          recommendations: derivedPatientState.recommendations,
          isEmergencyHypo: derivedPatientState.isEmergencyHypo
        },
        riskEvaluation: {
          riskLevel: derivedPatientState.riskClass,
          score: derivedPatientState.riskScore
        },
        todayMetrics: derivedPatientState.todayMetrics,
        latestMeal: activeMeal,
        activeMeal,

        // History & Telemetry
        history,
        setHistory,
        glucoseLogs,
        setGlucoseLogs,

        // Actions
        logMeal,
        logGlucoseReading,
        logRiskCheckToHistory
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
