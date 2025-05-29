// server/routes/bookingRoutes.js
import express from 'express';
import { createBookingGroup, getBookingGroups } from '../controllers/bookingController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/book', authMiddleware, createBookingGroup);
router.get('/booking-groups', getBookingGroups);


export default router;
