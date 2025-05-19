import { Router } from 'express';
import Flight from '../models/Flight.js';

const router = Router();

// GET all flights
router.get('/', async (req, res) => {
  try {
    const flights = await Flight.find();
    res.json(flights);
  } catch (err) {
    res.status(500).json({ error: 'Server error retrieving flights' });
  }
});

// POST add a flight
router.post('/', async (req, res) => {
  try {
    const flight = new Flight(req.body);
    const saved = await flight.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('[X] Failed to save flight:', err);
    res.status(400).json({ error: 'Invalid flight data' });
  }
});

export default router;
