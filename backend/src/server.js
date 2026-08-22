import express from 'express';
import cors from 'cors';
import mealsRoutes from './routes/meals.js';
import glucoseRoutes from './routes/glucose.js';
import predictionsRoutes from './routes/predictions.js';
import dashboardRoutes from './routes/dashboard.js';
import reportsRoutes from './routes/reports.js';
import usersRoutes from './routes/users.js';
import mlRoutes from './routes/mlRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/meals', mealsRoutes);
app.use('/api/glucose', glucoseRoutes);
app.use('/api/predictions', predictionsRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/users', usersRoutes);
app.use('/api/ml', mlRoutes);

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      service: 'GlucoSaathi Backend API',
      database: 'ICMR-NIN IFCT 2017 (Normalized)',
      endpoints: [
        '/api/meals/parse',
        '/api/meals/estimate-carbs',
        '/api/glucose',
        '/api/predictions/glucose',
        '/api/predictions/hypoglycemia',
        '/api/dashboard',
        '/api/reports/summary',
        '/api/users/profile'
      ]
    }
  });
});

app.listen(PORT, () => {
  console.log(`GlucoSaathi Backend API running on port ${PORT}`);
});

export default app;
