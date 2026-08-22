import express from 'express';

const router = express.Router();

/**
 * GET /api/dashboard
 * Aggregates live overview metrics for the active patient
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: {
      patient: {
        id: 'aarav_sharma',
        name: 'Aarav Sharma',
        condition: 'Type 1 Diabetes (4 yrs)'
      },
      currentGlucose: {
        value: 112,
        unit: 'mg/dL',
        trend: 'falling_slowly',
        targetRange: [70, 140],
        lastRecorded: new Date().toISOString()
      },
      todaySummary: {
        timeInRangePct: 82,
        averageGlucoseMgDl: 126,
        mealsLogged: 4,
        hypoAlertsCount: 1,
        totalCarbsGrams: 142,
        activeIobUnits: 1.2
      },
      nearTermForecast: {
        horizonMinutes: 30,
        forecastGlucose: 94,
        hypoProbabilityPct: 18,
        riskLevel: 'LOW',
        conformalBand90: [78, 110]
      },
      disclaimer: 'GlucoSaathi is an investigational decision-support tool. Not for automated insulin delivery.'
    }
  });
});

export default router;
