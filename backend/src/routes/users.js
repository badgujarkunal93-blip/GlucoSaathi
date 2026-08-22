import express from 'express';
import { UserProfileSchema } from '../validators/schemas.js';

const router = express.Router();

let currentProfile = {
  id: 'aarav_sharma',
  name: 'Aarav Sharma',
  age: 24,
  condition: 'Type 1 Diabetes (4 yrs)',
  icrRatio: 15,
  correctionFactor: 50,
  targetMin: 70,
  targetMax: 140,
  activeInsulinType: 'Rapid Acting (Novorapid / Aspart)',
  basalRegimen: '16 U Tresiba at 10 PM',
  emergencyContacts: [
    { name: 'Kavita Sharma (Mother)', relation: 'Parent', phone: '+91 98765 43210' }
  ]
};

router.get('/profile', (req, res) => {
  res.json({
    success: true,
    data: currentProfile
  });
});

router.post('/profile', (req, res) => {
  const result = UserProfileSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      success: false,
      error: result.error.errors[0].message
    });
  }

  currentProfile = { ...currentProfile, ...result.data };
  res.json({
    success: true,
    data: currentProfile
  });
});

export default router;
