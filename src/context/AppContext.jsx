import React, { createContext, useContext, useState, useEffect } from 'react';
import { evaluateHypoRisk, calculateInsulinDose, DEMO_SCENARIOS } from '../utils/riskEngine';
import { parseIndianMeal } from '../utils/indianMealsEngine';

const AppContext = createContext();

const INITIAL_HISTORY = [
  {
    id: 'rc-1',
    type: 'risk-check',
    timestamp: '9:05 AM',
    dayGroup: 'Today',
    title: 'Hypo Risk Check',
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
    id: 'meal-2',
    type: 'meal',
    timestamp: '7:58 PM',
    dayGroup: 'Yesterday',
    title: 'Dinner',
    description: '2 rotis, mixed sabzi and curd',
    carbs: 52,
    confidence: 'High',
    items: [
      { name: 'Whole Wheat Roti', quantity: '2 pieces', carbs: 24, icon: '🫓' },
      { name: 'Mixed Vegetable Sabzi', quantity: '1 bowl', carbs: 18, icon: '🥬' },
      { name: 'Plain Dahi / Curd', quantity: '1 bowl', carbs: 10, icon: '🥣' }
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
    confidence: 'Medium',
    items: [
      { name: 'Masala Chai', quantity: '1 cup', carbs: 9, icon: '☕' },
      { name: 'Roasted Chana', quantity: '1 handful', carbs: 13, icon: '🥜' }
    ]
  },
  {
    id: 'rc-2',
    type: 'risk-check',
    timestamp: '1:45 PM',
    dayGroup: 'Yesterday',
    title: 'Post-Lunch Risk Check',
    riskLevel: 'LOW',
    glucose: 114,
    insulinOnBoard: 1.1,
    calculatedDose: 3.8,
    summary: 'Glucose stable post-lunch.'
  }
];

export function AppProvider({ children }) {
  // Navigation
  const [currentView, setCurrentView] = useState('dashboard');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // User Profile & Settings
  const [settings, setSettings] = useState({
    name: 'Aarav Sharma',
    condition: 'Type 1 Diabetes (4 yrs)',
    icrRatio: 15, // 1 Unit per 15g carbs
    targetMin: 70,
    targetMax: 140,
    activeInsulinType: 'Rapid Acting (Novorapid / Aspart)',
    basalNote: '16 U Tresiba at 10 PM'
  });

  // History state
  const [history, setHistory] = useState(INITIAL_HISTORY);

  // Latest Meal state (for quick carryover)
  const [latestMeal, setLatestMeal] = useState({
    description: '2 rotis, dal and rice',
    carbs: 68,
    timestamp: '8:42 AM',
    items: [
      { name: 'Whole Wheat Roti', quantity: '2 pieces', carbs: 24, icon: '🫓' },
      { name: 'Dal Tadka', quantity: '1 bowl', carbs: 18, icon: '🍲' },
      { name: 'Steamed Basmati Rice', quantity: '1 bowl', carbs: 26, icon: '🍚' }
    ]
  });

  // Risk Check Inputs & Evaluation
  const [riskInputs, setRiskInputs] = useState({
    glucose: 108,
    insulinOnBoard: 0.8,
    carbsConsumed: 68,
    activityLevel: 'Light',
    timeSinceMealHours: 2,
    isFromLatestMeal: true
  });

  // Evaluated Risk Result
  const [riskResult, setRiskResult] = useState(() => evaluateHypoRisk(riskInputs));

  // Today's summary metrics
  const [todayMetrics, setTodayMetrics] = useState({
    carbsConsumed: 68,
    mealsCount: 2,
    riskChecksCount: 1,
    lastGlucose: 108,
    lastIob: 0.8
  });

  // When risk inputs change, evaluate risk
  useEffect(() => {
    const evaluated = evaluateHypoRisk(riskInputs);
    setRiskResult(evaluated);
  }, [riskInputs]);

  // Navigate helper
  const navigateTo = (view) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Carry carbs to risk check
  const carryMealToRiskCheck = (mealCarbs, mealDesc = '') => {
    setRiskInputs(prev => ({
      ...prev,
      carbsConsumed: Number(mealCarbs) || 68,
      isFromLatestMeal: true
    }));
    navigateTo('risk-check');
  };

  // Log a new meal
  const logMeal = (mealData) => {
    const carbs = Number(mealData.totalCarbs) || 0;
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newHistoryItem = {
      id: `meal-${Date.now()}`,
      type: 'meal',
      timestamp: timeStr,
      dayGroup: 'Today',
      title: mealData.mealTitle || 'Logged Meal',
      description: mealData.description || mealData.rawInput || 'Indian Meal',
      carbs: carbs,
      confidence: mealData.confidence || 'High',
      items: mealData.items || []
    };

    setHistory(prev => [newHistoryItem, ...prev]);

    setLatestMeal({
      description: mealData.description || mealData.rawInput,
      carbs: carbs,
      timestamp: timeStr,
      items: mealData.items || []
    });

    setTodayMetrics(prev => ({
      ...prev,
      carbsConsumed: prev.carbsConsumed + carbs,
      mealsCount: prev.mealsCount + 1
    }));

    setRiskInputs(prev => ({
      ...prev,
      carbsConsumed: carbs,
      isFromLatestMeal: true
    }));
  };

  // Perform a new risk check & record
  const saveRiskCheck = () => {
    const evaluated = evaluateHypoRisk(riskInputs);
    const now = new Date();
    const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dose = calculateInsulinDose(riskInputs.carbsConsumed, settings.icrRatio);

    const newHistoryItem = {
      id: `rc-${Date.now()}`,
      type: 'risk-check',
      timestamp: timeStr,
      dayGroup: 'Today',
      title: 'Hypo Risk Check',
      riskLevel: evaluated.riskLevel,
      glucose: Number(riskInputs.glucose),
      insulinOnBoard: Number(riskInputs.insulinOnBoard),
      calculatedDose: dose,
      summary: evaluated.headline,
      timeAgo: 'Just now'
    };

    setHistory(prev => [newHistoryItem, ...prev]);
    setRiskResult(evaluated);

    setTodayMetrics(prev => ({
      ...prev,
      riskChecksCount: prev.riskChecksCount + 1,
      lastGlucose: Number(riskInputs.glucose),
      lastIob: Number(riskInputs.insulinOnBoard)
    }));
  };

  // Apply demo scenario preset
  const applyScenario = (scenarioKey) => {
    const scenario = DEMO_SCENARIOS[scenarioKey];
    if (!scenario) return;

    setRiskInputs({
      glucose: scenario.glucose,
      insulinOnBoard: scenario.insulinOnBoard,
      carbsConsumed: scenario.carbsConsumed,
      activityLevel: scenario.activityLevel,
      timeSinceMealHours: scenario.timeSinceMealHours,
      isFromLatestMeal: true
    });
  };

  const calculatedDose = calculateInsulinDose(riskInputs.carbsConsumed, settings.icrRatio);

  return (
    <AppContext.Provider
      value={{
        currentView,
        navigateTo,
        settings,
        setSettings,
        isSettingsOpen,
        setIsSettingsOpen,
        history,
        latestMeal,
        riskInputs,
        setRiskInputs,
        riskResult,
        calculatedDose,
        todayMetrics,
        carryMealToRiskCheck,
        logMeal,
        saveRiskCheck,
        applyScenario
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
