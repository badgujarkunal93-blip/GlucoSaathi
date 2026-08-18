import express from 'express';
import cors from 'cors';
import mlRoutes from './routes/mlRoutes.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// ML Inference Routes
app.use('/api/ml', mlRoutes);

// Health Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    data: {
      status: 'healthy',
      version: '1.0.0',
      timestamp: new Date().toISOString(),
      service: 'GlucoSaathi Backend API'
    }
  });
});

app.listen(PORT, () => {
  console.log(`GlucoSaathi Backend API running on port ${PORT}`);
});

export default app;
