import DailyFlight from '../models/DailyFlight.js';
import FlightSchedule from '../models/FlightSchedule.js';
import axios from 'axios';

export const searchFlights = async (req, res) => {
  try {
    const { origin, dest, date } = req.query;

    if (!origin || !dest || !date) {
      return res.status(400).json({ error: 'Missing origin, dest, or date' });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: 'Invalid date format' });
    }

    const schedules = await FlightSchedule.find({ origin, destination: dest });
    const scheduleIds = schedules.map(s => s._id);

    const startOfDay = new Date(parsedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const flights = await DailyFlight.find({
      date: { $gte: startOfDay, $lt: endOfDay },
      flightScheduleId: { $in: scheduleIds }
    }).populate('flightScheduleId');

    const today = new Date();

    const enrichedFlights = await Promise.all(flights.map(async (flight) => {
      const seatClass = 'coach'; // simplify for now
      const baseCost = flight.baseCost;
      const seatsRemaining = flight.seatsAvailable[seatClass];
      const totalSeats = flight.flightScheduleId.seatConfig[seatClass];
      const daysUntilFlight = Math.ceil((flight.date - today) / (1000 * 60 * 60 * 24));

      let finalCost = baseCost;
      let modifiers = {};

      try {
        const response = await axios.post('http://localhost:8000/price', {
          baseCost,
          seatClass,
          daysUntilFlight,
          seatsRemaining,
          totalSeats
        });

        finalCost = response.data.finalCost;
        modifiers = response.data.modifiers;
      } catch (err) {
        console.error('⚠️ Pricing service error:', err.message);
      }

      return {
        ...flight.toObject(),
        pricing: {
          finalCost,
          modifiers
        }
      };
    }));

    res.status(200).json(enrichedFlights);
  } catch (err) {
    console.error('❌ Error in searchFlights:', err);
    res.status(500).json({ error: 'Server error' });
  }
};