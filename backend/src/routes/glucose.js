import express from 'express';
import { GlucoseLogSchema } from '../validators/schemas.js';

const router = express.Router();

// In-memory demo store for rapid responses (synchronized with client storage)
let glucoseHistory = [
  { id: 'g-1', glucose: 108, timestamp: new Date(Date.now() - 60 * 60 * 1000).toISOString(), mealRelation: 'fasting', trend: 'stable' },
  { id: 'g-2', glucose: 114, timestamp: new Date(Date.now() - 45 * 60 * 1000).toISOString(), mealRelation: 'pre_meal', trend: 'stable' },
  { id: 'g-3', glucose: 122, timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(), mealRelation: 'post_meal', trend: 'rising' },
  { id: 'g-4', glucose: 118, timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(), mealRelation: 'post_meal', trend: 'falling' },
  { id: 'g-5', glucose: 112, timestamp: new Date().toISOString(), mealRelation: 'post_meal', trend: 'falling' }
];

/**
 * POST /api/glucose
 * Log a new glucose reading
 */
router.post('/', (req, res) => {
  const result = GlucoseLogSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.errors[0].message
    });
  }

  const logEntry = {
    id: `g-${Date.now()}`,
    ...result.data,
    timestamp: result.data.timestamp || new Date().toISOString()
  };

  glucoseHistory.push(logEntry);

  res.status(201).json({
    success: true,
    data: logEntry
  });
});

/**
 * GET /api/glucose/history
 * Fetch time-series glucose readings
 */
router.get('/history', (req, res) => {
  res.json({
    success: true,
    data: {
      count: glucoseHistory.length,
      history: glucoseHistory.slice(-24)
    }
  });
});

export default router;
