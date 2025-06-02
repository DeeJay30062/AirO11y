import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import YAML from "yamljs";
import swaggerUi from "swagger-ui-express";
import { connectMongo } from "./config/db.js";
import "./config/redis.js"; // top-level await connects
import cookieParser from "cookie-parser";
import flightRoutes from "./routes/flightRoutes.js"; // adjust if needed
import bookingRoutes from "./routes/bookingRoutes.js";
import profileRoutes from "./routes/profile.js";

import flightsRouter from "./routes/flights.js";
//import originRoutes from './routes/originRoutes.js'; // adjust path if needed
import authRoutes from "./routes/auth.js";
import path from "path";
import { fileURLToPath } from "url";

import logger from "./lib/logger.js"; // Winston Logger
import fs from "fs";
import https from "https";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const app = express();
// Define default safe dev/Docker origins

const defaultDevOrigins = [
  "http://localhost:3000",
  "http://127.0.0.1:3000",
  "http://host.docker.internal:3000",
];

// Pull lab IP from env
const labOrigin = process.env.CLIENT_ORIGIN;

// Build full allowed origin list
const allowedOrigins = [...defaultDevOrigins, labOrigin].filter(Boolean);
//const allowedOrigins = ["http://localhost:3000", "http://10.103.1.251:3000"];
//app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);
/*
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`Blocked by CORS: ${origin}`);
        callback(new Error(`Not allowed by CORS: ${origin}`));
      }
    },
    credentials: true,
  })
);
*/

app.use(express.json());

app.use(cookieParser());

// Optional: Log every request (can comment this out if too noisy)
app.use((req, res, next) => {
  logger.info(`[${req.method}] ${req.originalUrl}`);
  next();
});

//changed to work with NGINX
// Load Swagger YAML spec
const swaggerDocument = YAML.load(
  path.resolve(__dirname, "./swagger/api.yaml")
);

// Serve Swagger UI
app.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerDocument, {
    swaggerOptions: {
      url: "/api-docs/swagger.yaml", // Tell the UI where to load the spec from
    },
  })
);

// Serve the actual YAML file
app.get("/api-docs/swagger.yaml", (req, res) => {
  res.sendFile(path.resolve(__dirname, "./swagger/api.yaml"));
});

app.use("/api/flights", flightsRouter);
//app.use('/api/origins', originRoutes);
app.use("/api/auth", authRoutes);
// Mount the flight routes
app.use("/api", flightRoutes);
// Mount the booking routes
app.use("/api", bookingRoutes);

app.use("/api", profileRoutes);

// Health check
app.get("/", (req, res) => {
  logger.info("Health check endpoint hit");
  res.send("AirO11y API is live ✈️");
});

/*
const PORT = process.env.PORT || 5050;
// Start server
app.listen(PORT, "0.0.0.0", async () => {
  await connectMongo();
  logger.info(`✅ Server running on port ${PORT}`);
  logger.info(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
});
*/

const PORT = process.env.PORT || 5050;
(async () => {
  await connectMongo();

    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`✅ HTTP server running on port ${PORT}`);
    });

  logger.info(`🌍 Environment: ${process.env.NODE_ENV}`);
})();

// Global error handling for unhandled rejections
process.on("unhandledRejection", (err) => {
  logger.error(`💥 Unhandled Rejection: ${err.message}`);
  process.exit(1);
});

