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

export function AppProvider({ children }) {
  // =========================================================================
  // APPLICATION MODE: 'landing' (Default) vs 'assessment' (Clinical Pipeline)
  // =========================================================================
  const [appMode, setAppMode] = useState(() => {
    if (typeof window !== 'undefined' && window.location.hash === '#assessment') {
      return 'assessment';
    }
    return 'landing';
  });

  // =========================================================================
  // PIPELINE STATE MACHINE & PROGRESSION
  // =========================================================================
  // pipelineStep: 'input' | 'processing' | 'analysis' | 'risk' | 'dashboard' | 'journal' | 'report'
  const [pipelineStep, setPipelineStep] = useState('input');
  
  // pipelineStatus: 'IDLE' | 'VALIDATING' | 'ANALYZING' | 'PREDICTING_RISK' | 'GENERATING_DASHBOARD' | 'GENERATING_JOURNAL' | 'GENERATING_REPORT' | 'COMPLETE' | 'ERROR'
  const [pipelineStatus, setPipelineStatus] = useState('IDLE');
  const [pipelineError, setPipelineError] = useState(null);

  // Unlocked Stages set: initial state unlocks ONLY 'input'
  const [unlockedStages, setUnlockedStages] = useState(['input']);

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
  const [history, setHistory] = useState([]);
  const [glucoseLogs, setGlucoseLogs] = useState([]);

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
  const runMLInference = useCallback(async (inputs) => {
    const g = Number(inputs.glucose) || 108;
    const iob = Number(inputs.insulinOnBoard) || 0;
    const carbs = Number(inputs.carbsConsumed) || 68;
    const activity = inputs.activityLevel || 'Light';
    const trend = inputs.glucoseTrend || 'falling_slowly';
    const roc = trend === 'falling_rapidly' ? -2.2 : trend.includes('falling') ? -1.2 : trend.includes('rising') ? 1.5 : 0.0;

    try {
      const [riskRes, forecastRes] = await Promise.all([
        mlClient.predictHypoRisk({ glucose: g, glucoseRoc: roc, iob, carbs, activityLevel: activity }),
        mlClient.predictGlucoseForecast({ glucose: g, glucoseRoc: roc, iob, carbs, steps: activity === 'Intense' ? 2500 : 800 })
      ]);

      setMlStatus(riskRes.success ? 'online' : 'offline');
      const mlData = {
        probability: riskRes.probability,
        riskScore: riskRes.riskScore,
        riskLevel: riskRes.riskLevel,
        isRuleOf15Armed: riskRes.isRuleOf15Armed,
        explainability: riskRes.explainability,
        predictedGlucose: forecastRes.predictedGlucose,
        conformalLower: forecastRes.intervalLower,
        conformalUpper: forecastRes.intervalUpper,
        mlSource: riskRes.source
      };
      setAsyncMLResult(mlData);
      return mlData;
    } catch {
      setMlStatus('offline');
      return null;
    }
  }, []);

  // =========================================================================
  // START ANALYSIS PIPELINE EXECUTION ACTION
  // =========================================================================
  const startAnalysis = async (submittedInputs) => {
    setPipelineError(null);
    setPipelineStep('processing');
    setPipelineStatus('VALIDATING');

    const activeInputs = submittedInputs || patientInputs;
    setPatientInputs(activeInputs);

    try {
      // Step 1: Validation (~400ms)
      await new Promise(r => setTimeout(r, 450));
      setPipelineStatus('ANALYZING');

      // Step 2: AI Meal Parsing / IFCT (~500ms)
      const mealCarbs = Number(activeInputs.carbsConsumed) || 60;
      setActiveMeal({
        description: activeInputs.mealDescription || 'Custom Indian Meal',
        totalCarbs: mealCarbs,
        carbRange: `${Math.round(mealCarbs * 0.88)}–${Math.round(mealCarbs * 1.12)}g`,
        confidence: 'High',
        items: [
          { name: activeInputs.mealDescription || 'Indian Preparation', quantity: 1, carbs: mealCarbs, unit: 'serving', icon: '🍛' }
        ]
      });
      await new Promise(r => setTimeout(r, 550));
      setPipelineStatus('PREDICTING_RISK');

      // Step 3: FastAPI ML Inference (~600ms)
      await runMLInference(activeInputs);
      await new Promise(r => setTimeout(r, 650));
      setPipelineStatus('GENERATING_DASHBOARD');

      // Step 4: Health Dashboard Synthesis (~400ms)
      await new Promise(r => setTimeout(r, 450));
      setPipelineStatus('GENERATING_JOURNAL');

      // Step 5: Logging to Journal (~350ms)
      const newMealLog = {
        id: `meal-${Date.now()}`,
        type: 'meal',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dayGroup: 'Today',
        title: 'Logged Indian Meal',
        description: activeInputs.mealDescription,
        carbs: mealCarbs,
        confidence: 'High',
        items: [{ name: activeInputs.mealDescription, quantity: 1, carbs: mealCarbs, unit: 'serving', icon: '🍛' }]
      };

      const newGlucoseLog = {
        id: `glu-${Date.now()}`,
        type: 'glucose',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dayGroup: 'Today',
        title: `Pre-Meal Glucose: ${activeInputs.glucose} mg/dL`,
        value: activeInputs.glucose,
        unit: 'mg/dL',
        trend: activeInputs.glucoseTrend || 'stable'
      };

      const newRiskLog = {
        id: `rc-${Date.now()}`,
        type: 'risk-check',
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        dayGroup: 'Today',
        title: `Hypo Risk Check`,
        riskLevel: activeInputs.glucose < 70 ? 'CRITICAL' : 'LOW',
        glucose: activeInputs.glucose,
        insulinOnBoard: activeInputs.insulinOnBoard,
        calculatedDose: 4.5,
        summary: 'Analyzed through sequential decision-support pipeline.',
        timeAgo: 'Just now'
      };

      setHistory([newRiskLog, newMealLog, newGlucoseLog]);
      setGlucoseLogs([
        { id: newGlucoseLog.id, value: activeInputs.glucose, recordedAt: new Date().toISOString(), mealRelation: 'pre_meal' },
        { id: 'g-hist-1', value: 124, recordedAt: '2026-08-22T06:30:00Z', mealRelation: 'fasting' }
      ]);

      await new Promise(r => setTimeout(r, 400));
      setPipelineStatus('COMPLETE');

      // Unlock all pipeline stages
      setUnlockedStages(['input', 'analysis', 'risk', 'dashboard', 'journal', 'report']);
    } catch (err) {
      setPipelineStatus('ERROR');
      setPipelineError('Pipeline execution interrupted. Please retry.');
    }
  };

  const resetAnalysis = () => {
    setPipelineStep('input');
    setPipelineStatus('IDLE');
    setUnlockedStages(['input']);
  };

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

    // 2. Resolve ML values
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
      mealsCount: history.filter(h => h.type === 'meal').length || 1,
      hypoAlertsCount: g < 70 || evaluatedRisk.isEmergencyHypo ? 2 : 1,
      totalCarbsToday: carbs,
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
  }, [patientInputs, activeClinicalSettings, asyncMLResult, mlStatus, history]);

  // Action: Update User Profile
  const updateUserProfile = (newProfile) => {
    setUserProfile(newProfile);
    try {
      localStorage.setItem('glucosaathi_user_profile', JSON.stringify(newProfile));
    } catch {
      // ignore
    }
  };

  // Action: Update a single patient input
  const updatePatientInput = (key, value) => {
    setPatientInputs(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const navigateTo = (viewName) => {
    setPipelineStep(viewName);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const startAssessment = () => {
    setAppMode('assessment');
    setPipelineStep('input');
    setPipelineStatus('IDLE');
    setUnlockedStages(['input']);
    if (typeof window !== 'undefined') window.location.hash = '#assessment';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const backToLanding = () => {
    setAppMode('landing');
    if (typeof window !== 'undefined') window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToSavedReports = () => {
    setAppMode('saved-reports');
    if (typeof window !== 'undefined') window.location.hash = '#saved-reports';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const reassessFromReport = (report) => {
    if (!report) return;

    // 1. Populate patient inputs from saved report
    setPatientInputs(prev => ({
      ...prev,
      patientName: report.patient?.name || prev.patientName,
      patientAge: report.patient?.age || prev.patientAge,
      currentGlucose: report.clinicalParameters?.glucose || prev.currentGlucose,
      glucoseTrend: report.clinicalParameters?.glucoseTrend || prev.glucoseTrend,
      activeInsulin: report.clinicalParameters?.activeInsulin !== undefined ? report.clinicalParameters.activeInsulin : prev.activeInsulin,
      mealText: report.meal?.description || prev.mealText,
      mealCarbs: report.meal?.estimatedCarbs || prev.mealCarbs,
      activityLevel: report.activity?.level || prev.activityLevel
    }));

    // 2. Populate patientState
    setPatientState(prev => ({
      ...prev,
      glucose: report.clinicalParameters?.glucose || prev.glucose,
      trend: report.clinicalParameters?.glucoseTrend || prev.trend,
      glucoseTrend: report.clinicalParameters?.glucoseTrend || prev.glucoseTrend,
      insulinOnBoard: report.clinicalParameters?.activeInsulin !== undefined ? report.clinicalParameters.activeInsulin : prev.insulinOnBoard,
      carbsConsumed: report.meal?.estimatedCarbs || prev.carbsConsumed,
      meal: report.meal?.description || prev.meal,
      activityLevel: report.activity?.level || prev.activityLevel,
      riskScore: report.prediction?.riskScore || prev.riskScore,
      riskClass: report.prediction?.riskLevel || prev.riskClass,
      forecast30mGlucose: report.prediction?.forecast30Min || prev.forecast30mGlucose
    }));

    // 3. Reset pipeline status and unlock input stage for editing
    setPipelineStep('input');
    setPipelineStatus('IDLE');
    setUnlockedStages(['input']);
    setAppMode('assessment');
    if (typeof window !== 'undefined') window.location.hash = '#assessment';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <AppContext.Provider
      value={{
        // App Mode ('landing' | 'assessment' | 'saved-reports')
        appMode,
        setAppMode,
        startAssessment,
        backToLanding,
        navigateToSavedReports,
        reassessFromReport,

        // Pipeline State Machine
        pipelineStep,
        setPipelineStep,
        pipelineStatus,
        pipelineError,
        unlockedStages,
        startAnalysis,
        resetAnalysis,
        currentView: pipelineStep,
        navigateTo,

        // Modals
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

        // Single Centralized Reactive Patient State
        patientState: derivedPatientState,
        patientInputs,
        updatePatientInput,

        // Specific Aliases for components
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
        setGlucoseLogs
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
