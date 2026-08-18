import React, { createContext, useContext, useState, useEffect } from 'react';
import { evaluateHypoglycemiaRisk, calculateBolusReference } from '../lib/risk/riskEngine';
import { parseIndianMeal } from '../utils/indianMealsEngine';
import { DataService } from '../services/dataService';
import { DEMO_PRESET_SCENARIOS } from '../lib/risk/riskConfig';

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
    story: 'Working software professional managing meals and gym workouts.'
  },
  priya: {
    id: 'priya',
    name: 'Priya Patel (Child T1D)',
    age: 12,
    condition: 'Type 1 Diabetes (Diagnosed Age 8)',
    icrRatio: 12,
    correctionFactor: 60,
    targetMin: 80,
    targetMax: 150,
    activeInsulinType: 'Rapid Acting (Humalog)',
    basalRegimen: '10 U Lantus at Bedtime',
    story: 'School student needing safe carb counts for rajma-chawal and sports class.'
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
    story: 'Traditional Indian diet with mixed thalis, prone to afternoon NPH peaks.'
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
    summary: 'Safer glucose range and low active insulin.',
    timeAgo: '15 min ago'
  },
  {
    id: 'meal-1',
    type: 'meal',
    timestamp: '8:42 AM',
    dayGroup: 'Today',
    title: 'Breakfast',
    description: '2 rotis, dal and rice',
    carbs: 68,
    confidence: 'High',
    items: [
      { name: 'Whole Wheat Roti', quantity: '2 pieces', carbs: 24, icon: '🫓' },
      { name: 'Dal Tadka', quantity: '1 bowl', carbs: 18, icon: '🍲' },
      { name: 'Steamed Rice', quantity: '1 bowl', carbs: 26, icon: '🍚' }
    ]
  },
  {
    id: 'glu-1',
    type: 'glucose',
    timestamp: '8:30 AM',
    dayGroup: 'Today',
    title: 'Fasting Glucose',
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
      { name: 'Whole Wheat Roti', quantity: '2 pieces', carbs: 24, icon: '🫓' },
      { name: 'Mixed Vegetable Sabzi', quantity: '1 bowl', carbs: 18, icon: '🥬' },
      { name: 'Plain Dahi / Curd', quantity: '1 bowl', carbs: 6, icon: '🥣' }
    ]
  },
  {
    id: 'meal-3',
    type: 'meal',
    timestamp: '4:30 PM',
    dayGroup: 'Yesterday',
    title: 'Evening Snack',
    description: '1 cup masala chai & roasted chana',
    carbs: 22,
    confidence: 'High',
    items: [
      { name: 'Masala Chai', quantity: '1 cup', carbs: 9, icon: '☕' },
      { name: 'Roasted Chana', quantity: '1 handful', carbs: 13, icon: '🥜' }
    ]
  },
  {
    id: 'act-1',
    type: 'activity',
    timestamp: '5:15 PM',
    dayGroup: 'Yesterday',
    title: 'Evening Walk',
    activityType: 'Brisk Walking',
    durationMinutes: 30,
    intensity: 'Light'
  }
];

export function AppProvider({ children }) {
  // Navigation View
  const [currentView, setCurrentView] = useState('dashboard');
  
  // Modals state
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isGlucoseModalOpen, setIsGlucoseModalOpen] = useState(false);
  const [isInsulinModalOpen, setIsInsulinModalOpen] = useState(false);
  const [isActivityModalOpen, setIsActivityModalOpen] = useState(false);
  const [isDoctorReportModalOpen, setIsDoctorReportModalOpen] = useState(false);

  // Active Persona & Settings
  const [currentPersonaKey, setCurrentPersonaKey] = useState('aarav');
  const [settings, setSettings] = useState(DEMO_PERSONAS.aarav);

  // History & Logs
  const [history, setHistory] = useState(INITIAL_HISTORY);
  const [glucoseLogs, setGlucoseLogs] = useState([
    { id: 'g1', value: 108, recordedAt: '2026-08-18T08:30:00Z', mealRelation: 'fasting' },
    { id: 'g2', value: 135, recordedAt: '2026-08-17T20:30:00Z', mealRelation: 'post_meal' },
    { id: 'g3', value: 112, recordedAt: '2026-08-17T14:00:00Z', mealRelation: 'post_meal' },
    { id: 'g4', value: 94, recordedAt: '2026-08-17T08:15:00Z', mealRelation: 'fasting' }
  ]);

  // Latest Meal
  const [latestMeal, setLatestMeal] = useState({
    description: '2 rotis, dal and rice',
    carbs: 68,
    confidence: 'High',
    items: [
      { name: 'Whole Wheat Roti', quantity: '2 pieces', carbs: 24, icon: '🫓' },
      { name: 'Dal Tadka', quantity: '1 bowl', carbs: 18, icon: '🍲' },
      { name: 'Steamed Rice', quantity: '1 bowl', carbs: 26, icon: '🍚' }
    ]
  });

  // Risk Engine State
  const [riskInputs, setRiskInputs] = useState({
    glucose: 108,
    insulinOnBoard: 0.8,
    activityLevel: 'Light',
    timeSinceMealHours: 2.0,
    carbsConsumed: 68,
    carbsCovered: 68
  });

  // Computed Risk State
  const [riskResult, setRiskResult] = useState(() => evaluateHypoglycemiaRisk({
    glucose: 108,
    insulinOnBoard: 0.8,
    activityLevel: 'Light',
    timeSinceMealHours: 2.0,
    carbsConsumed: 68
  }));

  // Re-evaluate risk whenever riskInputs change
  useEffect(() => {
    const res = evaluateHypoglycemiaRisk(riskInputs);
    setRiskResult(res);
  }, [riskInputs]);

  // Switch Persona function for judges
  const switchPersona = (personaKey) => {
    if (DEMO_PERSONAS[personaKey]) {
      setCurrentPersonaKey(personaKey);
      setSettings(DEMO_PERSONAS[personaKey]);
    }
  };

  // Quick preset scenario loader (Low / Moderate / High)
  const applyPresetScenario = (scenarioKey) => {
    const sc = DEMO_PRESET_SCENARIOS[scenarioKey];
    if (sc) {
      setRiskInputs({
        glucose: sc.glucose,
        insulinOnBoard: sc.insulinOnBoard,
        activityLevel: sc.activityLevel,
        timeSinceMealHours: sc.timeSinceMealHours,
        carbsConsumed: sc.carbsConsumed,
        carbsCovered: sc.carbsConsumed
      });
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

    setLatestMeal({
      description,
      carbs: mealCarbs,
      confidence,
      items
    });

    setHistory(prev => [newMealRecord, ...prev]);
    setRiskInputs(prev => ({
      ...prev,
      carbsConsumed: mealCarbs,
      carbsCovered: mealCarbs,
      timeSinceMealHours: 0.2
    }));

    await DataService.saveMeal(newMealRecord);
  };

  // Action: Carry Meal from Logger to Risk Check
  const carryMealToRiskCheck = (carbs, description) => {
    setRiskInputs(prev => ({
      ...prev,
      carbsConsumed: Number(carbs) || 68,
      carbsCovered: Number(carbs) || 68,
      timeSinceMealHours: 0.5
    }));
    setCurrentView('risk-check');
  };

  // Action: Log Blood Glucose
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
      trend,
      notes
    };

    setHistory(prev => [newLog, ...prev]);
    setGlucoseLogs(prev => [{ id: newLog.id, value: num, recordedAt: new Date().toISOString(), mealRelation }, ...prev]);
    
    // Update live risk engine telemetry with new glucose reading
    setRiskInputs(prev => ({
      ...prev,
      glucose: num
    }));

    await DataService.saveGlucose(newLog);
  };

  // Action: Log Insulin Dose
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

    // Increase active insulin on board (IOB)
    setRiskInputs(prev => ({
      ...prev,
      insulinOnBoard: Math.round((prev.insulinOnBoard + (num * 0.7)) * 10) / 10
    }));

    await DataService.saveInsulin(newLog);
  };

  // Action: Log Physical Activity
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

    setRiskInputs(prev => ({
      ...prev,
      activityLevel: intensity
    }));

    await DataService.saveActivity(newLog);
  };

  // Save manual Risk Check to history
  const logRiskCheckToHistory = async () => {
    const calculatedDose = calculateBolusReference({
      carbohydrates: riskInputs.carbsConsumed,
      insulinCarbRatio: settings.icrRatio,
      currentGlucose: riskInputs.glucose,
      targetGlucose: (settings.targetMin + settings.targetMax) / 2,
      correctionFactor: settings.correctionFactor,
      activeIob: riskInputs.insulinOnBoard
    }).totalSuggestedDose;

    const newRecord = {
      id: `rc-${Date.now()}`,
      type: 'risk-check',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      dayGroup: 'Today',
      title: `${riskResult.riskLevel} Risk Check (${riskResult.score}/100)`,
      riskLevel: riskResult.riskLevel,
      glucose: riskInputs.glucose,
      insulinOnBoard: riskInputs.insulinOnBoard,
      calculatedDose,
      summary: riskResult.headline,
      timeAgo: 'Just now'
    };

    setHistory(prev => [newRecord, ...prev]);
    await DataService.saveRiskAssessment(newRecord);
  };

  const navigateTo = (viewName) => {
    setCurrentView(viewName);
  };

  // Calculated daily metrics
  const mealLogs = history.filter(h => h.type === 'meal');
  const todayMeals = mealLogs.filter(h => h.dayGroup === 'Today');
  const totalCarbsToday = todayMeals.reduce((acc, m) => acc + (m.carbs || 0), 0);

  const todayMetrics = {
    totalCarbsToday: totalCarbsToday || 68,
    lastGlucose: riskInputs.glucose,
    insulinOnBoard: riskInputs.insulinOnBoard,
    timeSinceMeal: riskInputs.timeSinceMealHours,
    activityLevel: riskInputs.activityLevel
  };

  const currentPersona = DEMO_PERSONAS[currentPersonaKey] || DEMO_PERSONAS.aarav;

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

        // Settings & Personas
        settings,
        setSettings,
        currentPersonaKey,
        currentPersona,
        DEMO_PERSONAS: Object.values(DEMO_PERSONAS),
        switchPersona,

        // Data & Telemetry
        history,
        glucoseLogs,
        mealLogs,
        latestMeal,
        riskInputs,
        setRiskInputs,
        riskResult,
        riskEvaluation: riskResult,
        todayMetrics,

        // Actions
        logMeal,
        carryMealToRiskCheck,
        logGlucoseReading,
        logInsulinDose,
        logPhysicalActivity,
        logRiskCheckToHistory,
        applyPresetScenario
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
