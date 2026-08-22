import express from 'express';

const router = express.Router();

/**
 * GET /api/reports/summary
 * Returns clinical report summary for physician visits
 */
router.get('/summary', (req, res) => {
  res.json({
    success: true,
    data: {
      generatedAt: new Date().toISOString(),
      patient: {
        name: 'Aarav Sharma',
        age: 24,
        condition: 'Type 1 Diabetes',
        icrRatio: '1:15',
        correctionFactor: 50,
        basalRegimen: '16 U Tresiba'
      },
      telemetryWindow: 'Past 14 Days',
      keyMetrics: {
        timeInRange70_140: '78.4%',
        timeBelowRange_under70: '3.1%',
        timeAboveRange_over180: '18.5%',
        averageGlucose: '128 mg/dL',
        glucoseManagementIndicator: '6.4%',
        glycemicVariabilityCV: '28.2%'
      },
      mealTelemetry: {
        averageDailyCarbs: '185g',
        frequentIndianFoods: [
          { name: 'Whole Wheat Roti', frequency: '24 times', avgCarbs: '30g' },
          { name: 'Dal Tadka', frequency: '16 times', avgCarbs: '18g' },
          { name: 'Steamed Rice', frequency: '14 times', avgCarbs: '38g' },
          { name: 'Poha', frequency: '6 times', avgCarbs: '42g' }
        ]
      },
      clinicalSafetyNotice: 'This report is generated from patient-logged data and CGM streams. Consult endocrinologist for therapy adjustments.'
    }
  });
});

export default router;
