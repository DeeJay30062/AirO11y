import express from 'express';
import {
  getAllOrigins,
  getDestinationsByOrigin,
  searchFlights
} from '../controllers/flightController.js';

const router = express.Router();

// GET /api/origins
router.get('/origins', getAllOrigins);

// GET /api/destinations/:origin
router.get('/destinations/:origin', getDestinationsByOrigin);

router.get('/flights/search', searchFlights);

export default router;