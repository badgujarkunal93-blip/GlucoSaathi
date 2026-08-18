import express from 'express';
import { getMLGlucosePrediction, getMLHypoRiskPrediction } from '../services/mlService.js';

const router = express.Router();

router.post('/predict-glucose', async (req, res) => {
  try {
    const result = await getMLGlucosePrediction(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/predict-hypo-risk', async (req, res) => {
  try {
    const result = await getMLHypoRiskPrediction(req.body);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
