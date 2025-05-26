import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { connectMongo } from './config/db.js';
import './config/redis.js'; // top-level await connects
import cookieParser from 'cookie-parser';
import flightRoutes from './routes/flightRoutes.js'; // adjust if needed
import bookingRoutes from './routes/bookingRoutes.js';

import flightsRouter from './routes/flights.js';
//import originRoutes from './routes/originRoutes.js'; // adjust path if needed
import authRoutes from './routes/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

import logger from './lib/logger.js';  // Winston Logger



const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());

// Optional: Log every request (can comment this out if too noisy)
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});


//changed to work with NGINX
// Load Swagger YAML spec
const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger/api.yaml'));

// Serve Swagger UI
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument, {
  swaggerOptions: {
    url: '/api-docs/swagger.yaml'  // Tell the UI where to load the spec from
  }
}));

// Serve the actual YAML file
app.get('/api-docs/swagger.yaml', (req, res) => {
  res.sendFile(path.resolve(__dirname, './swagger/api.yaml'));
});

app.use('/api/flights', flightsRouter);
//app.use('/api/origins', originRoutes);
app.use('/api/auth', authRoutes);
// Mount the flight routes
app.use('/api', flightRoutes);
// Mount the booking routes
app.use('/api', bookingRoutes);


// Health check
app.get('/', (req, res) => {
  logger.info('Health check endpoint hit');
  res.send('AirO11y API is live ✈️');
});


const PORT = process.env.PORT || 5050;
// Start server
app.listen(PORT, '0.0.0.0', async () => {
  await connectMongo();
  logger.info(`✅ Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

// Global error handling for unhandled rejections
process.on('unhandledRejection', (err) => {
  logger.error(`💥 Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

