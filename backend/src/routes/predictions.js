import express from 'express';
import { HypoPredictionSchema } from '../validators/schemas.js';
import { getMLGlucosePrediction, getMLHypoRiskPrediction } from '../services/mlService.js';

const router = express.Router();

/**
 * POST /api/predictions/glucose
 * 30-min continuous glucose trajectory with conformal intervals
 */
router.post('/glucose', async (req, res) => {
  const parseResult = HypoPredictionSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.errors[0].message
    });
  }

  try {
    const result = await getMLGlucosePrediction(parseResult.data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * POST /api/predictions/hypoglycemia
 * Predict P(glucose < 70 mg/dL within 30-45m)
 */
router.post('/hypoglycemia', async (req, res) => {
  const parseResult = HypoPredictionSchema.safeParse(req.body);
  if (!parseResult.success) {
    return res.status(400).json({
      success: false,
      error: parseResult.error.errors[0].message
    });
  }

  try {
    const result = await getMLHypoRiskPrediction(parseResult.data);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
