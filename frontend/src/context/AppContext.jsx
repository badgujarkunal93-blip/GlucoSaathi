import React, { createContext, useContext, useState, useMemo, useEffect } from 'react';
import { evaluateHypoglycemiaRisk, calculateBolusReference } from '../lib/risk/riskEngine';
import { estimateCarbohydrates } from '../lib/carb/carbEstimator';
import { DataService } from '../services/dataService';

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
  },
  {
    id: 'meal-2',
    type: 'meal',
    timestamp: '7:58 PM',
    dayGroup: 'Yesterday',
    title: 'Dinner',
    description: '2 rotis, mixed sabzi and curd',
    carbs: 48,
    confidence: 'High',
    items: [
      { name: 'Whole Wheat Roti', quantity: 2, carbs: 30, unit: 'piece', icon: '🫓' },
      { name: 'Mixed Vegetable Sabzi', quantity: 1, carbs: 12, unit: 'bowl', icon: '🥬' },
      { name: 'Plain Curd / Dahi', quantity: 1, carbs: 6, unit: 'bowl', icon: '🥣' }
    ]
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

  // Active Persona & Clinical Settings
  const [currentPersonaKey, setCurrentPersonaKey] = useState('aarav');
  const currentPersona = DEMO_PERSONAS[currentPersonaKey] || DEMO_PERSONAS.aarav;
  const [settings, setSettings] = useState(currentPersona);

  // =========================================================================
  // SINGLE SOURCE OF TRUTH: Centralized Patient Input Telemetry
  // =========================================================================
  const [patientInputs, setPatientInputs] = useState(currentPersona.defaultInputs);

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

  // =========================================================================
  // REACTIVE DERIVATION PIPELINE: Derives ML risk, forecast & clinical state
  // =========================================================================
  const derivedPatientState = useMemo(() => {
    const g = Number(patientInputs.glucose) || 108;
    const iob = Number(patientInputs.insulinOnBoard) || 0;
    const carbs = Number(patientInputs.carbsConsumed) || 68;
    const covered = Number(patientInputs.carbsCovered) || carbs;
    const activity = patientInputs.activityLevel || 'Light';
    const hours = Number(patientInputs.timeSinceMealHours) || 2.0;
    const trend = patientInputs.glucoseTrend || 'falling_slowly';

    // 1. Evaluate Risk Engine
    const evaluatedRisk = evaluateHypoglycemiaRisk({
      glucose: g,
      insulinOnBoard: iob,
      carbsConsumed: carbs,
      carbsCovered: covered,
      activityLevel: activity,
      timeSinceMealHours: hours
    });

    // 2. Derive Hypoglycemia Probability (0.00 to 1.00)
    let modelProb = Math.min(0.98, Math.max(0.04, evaluatedRisk.score / 100));
    if (g < 70) modelProb = Math.max(0.85, modelProb);

    let riskClass = 'LOW';
    if (modelProb >= 0.75 || g < 70) riskClass = 'CRITICAL';
    else if (modelProb >= 0.50) riskClass = 'HIGH';
    else if (modelProb >= 0.25) riskClass = 'MODERATE';
    else riskClass = 'LOW';

    // 3. Generate 30-Min Dynamic Trajectory Forecast
    const slope = trend === 'falling_rapidly' ? -2.2 : trend === 'falling' || trend === 'falling_slowly' ? -1.3 : trend === 'rising' ? 1.4 : trend === 'rising_rapidly' ? 2.5 : 0.0;
    const iobDrop = iob * 9;
    const carbBuffer = Math.min(30, carbs * 0.25);
    const predicted30m = Math.max(40, Math.min(350, Math.round(g + (slope * 30) - iobDrop + carbBuffer)));

    // 4. Reference Carbohydrate Coverage Calculation
    const refBolus = calculateBolusReference({
      carbohydrates: carbs,
      insulinCarbRatio: settings.icrRatio,
      currentGlucose: g,
      targetGlucose: (settings.targetMin + settings.targetMax) / 2,
      correctionFactor: settings.correctionFactor,
      activeIob: iob
    });

    // 5. Aggregate Daily Clinical Summary
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
      riskScore: Math.round(modelProb * 100),
      riskClass,
      riskLevel: evaluatedRisk.riskLevel,
      color: evaluatedRisk.color,
      headline: evaluatedRisk.headline,
      explanation: evaluatedRisk.explanation,
      riskContributors: evaluatedRisk.factors,
      recommendations: evaluatedRisk.recommendations,
      isEmergencyHypo: g < 70 || evaluatedRisk.isEmergencyHypo,
      ruleOf15Armed: g < 70 || (modelProb >= 0.50 && g < 85),
      forecast30mGlucose: predicted30m,
      referenceBolus: refBolus,
      todayMetrics,
      modelConfidence: 84
    };
  }, [patientInputs, settings]);

  // Action: Switch Persona and sync full telemetry
  const switchPersona = (personaKey) => {
    if (DEMO_PERSONAS[personaKey]) {
      const p = DEMO_PERSONAS[personaKey];
      setCurrentPersonaKey(personaKey);
      setSettings(p);
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

  // Action: Update a single patient input (e.g. from sliders or buttons)
  const updatePatientInput = (key, value) => {
    setPatientInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  // Action: Apply preset scenario (e.g., Safe, Active IOB, Hypo Alert)
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

  // Action: Log Meal and sync into PatientState
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

  // Action: Log Blood Glucose and sync into PatientState
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

  // Action: Log Insulin Dose and increase IOB
  const logInsulinDose = async ({ amount, deliveryType, insulinType, carbsCovered }) => {
    const num = Number(amount);
    const newLog = {
      id: `ins-${Date.now()}`,
      type: 'insulin',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dayGroup: 'Today',
      title: `${deliveryType === 'bolus' ? 'Meal Bolus' : 'Basal'} Dose: ${num} U`,
      amount: num,
      insulinType,
      carbsCovered,
      calculatedDose: num
    };

    setHistory(prev => [newLog, ...prev]);
    setPatientInputs(prev => ({
      ...prev,
      insulinOnBoard: Math.round((prev.insulinOnBoard + (num * 0.7)) * 10) / 10,
      recentBolus: num
    }));

    await DataService.saveInsulin(newLog);
  };

  // Action: Log Physical Activity and sync
  const logPhysicalActivity = async ({ activityType, intensity, durationMinutes }) => {
    const newLog = {
      id: `act-${Date.now()}`,
      type: 'activity',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dayGroup: 'Today',
      title: `${activityType} (${durationMinutes} min)`,
      activityType,
      intensity,
      durationMinutes
    };

    setHistory(prev => [newLog, ...prev]);
    setPatientInputs(prev => ({
      ...prev,
      activityLevel: intensity || 'Moderate'
    }));

    await DataService.saveActivity(newLog);
  };

  // Action: Save Current Risk Assessment to Journal History
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

        // Persona & Settings
        settings,
        setSettings,
        currentPersonaKey,
        currentPersona,
        DEMO_PERSONAS: Object.values(DEMO_PERSONAS),
        switchPersona,

        // Single Centralized Reactive Patient State
        patientState: derivedPatientState,
        patientInputs,
        updatePatientInput,
        applyPresetScenario,

        // Specific Aliases for existing components (guarantees backward compatibility)
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
        glucoseLogs,

        // Mutators / Actions
        logMeal,
        logGlucoseReading,
        logInsulinDose,
        logPhysicalActivity,
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
