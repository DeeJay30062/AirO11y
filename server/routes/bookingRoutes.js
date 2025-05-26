// server/routes/bookingRoutes.js
import express from 'express';
import { createBookingGroup } from '../controllers/bookingController.js';

const router = express.Router();

router.post('/book', createBookingGroup);

export default router;
