import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import YAML from 'yamljs';
import swaggerUi from 'swagger-ui-express';
import { connectMongo } from './config/db.js';
import './config/redis.js'; // top-level await connects
import cookieParser from 'cookie-parser';

import flightsRouter from './routes/flights.js';
import originRoutes from './routes/originRoutes.js'; // adjust path if needed
import authRoutes from './routes/auth.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cookieParser());

// Load Swagger YAML spec
//const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger/api.yaml'));

//const swaggerDocument = YAML.load('./swagger/api.yaml');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
//changed to work with NGINX
// Load Swagger YAML spec
const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger/api.yaml'));

//const swaggerDocument = YAML.load(path.resolve(__dirname, './swagger/api.yaml'));

//const swaggerDocument = YAML.load('./swagger/api.yaml');
//app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
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
app.use('/api/origins', originRoutes);
app.use('/api/auth', authRoutes);


app.get('/', (req, res) => res.send('AirO11y API is live ✈️'));

const PORT = process.env.PORT || 5050;
app.listen(PORT, '0.0.0.0', async () => {
  await connectMongo();
  console.log(`[✓] Server running on port ${PORT}`);
});


