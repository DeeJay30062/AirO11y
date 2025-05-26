import Booking from '../models/Booking.js';
import BookingGroup from '../models/BookingGroup.js';
import Passenger from '../models/Passenger.js';
import DailyFlight from '../models/DailyFlight.js';
import axios from 'axios';

export const createBookingGroup = async (req, res) => {
  try {
    const { flightIds, passengers, seatClass } = req.body;
    const userId = req.user?._id || null;

    if (!flightIds || !Array.isArray(flightIds) || flightIds.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid flightIds' });
    }

    if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
      return res.status(400).json({ error: 'Missing or invalid passengers' });
    }

    if (!seatClass || !['coach', 'economyPlus', 'first'].includes(seatClass)) {
      return res.status(400).json({ error: 'Invalid seatClass' });
    }

    const flights = await DailyFlight.find({ _id: { $in: flightIds } }).populate('flightScheduleId');
    if (flights.length !== flightIds.length) {
      return res.status(404).json({ error: 'One or more flights not found' });
    }

    const today = new Date();
    const bookingGroup = new BookingGroup({ userId, bookings: [] });
    await bookingGroup.save();

    const bookings = [];

    for (const passengerData of passengers) {
      let passenger = await Passenger.findOne({ loyaltyId: passengerData.loyaltyId });
      if (!passenger) {
        passenger = new Passenger(passengerData);
        await passenger.save();
      }

      for (const flight of flights) {
        const seatsRemaining = flight.seatsAvailable[seatClass];
        const totalSeats = flight.flightScheduleId.seatConfig[seatClass];
        if (seatsRemaining <= 0) {
          return res.status(400).json({ error: `No ${seatClass} seats left for flight ${flight._id}` });
        }

        const daysUntilFlight = Math.ceil((new Date(flight.date) - today) / (1000 * 60 * 60 * 24));
        let finalCost = flight.baseCost;

        try {
          const response = await axios.post(process.env.PRICING_URL || 'http://localhost:8000/price', {
            baseCost: flight.baseCost,
            seatClass,
            daysUntilFlight,
            seatsRemaining,
            totalSeats
          });
          finalCost = response.data.finalCost;
        } catch (err) {
          console.warn('Pricing service error, defaulting to baseCost');
        }

        const booking = new Booking({
          flightID: flight._id,
          passengerID: passenger._id,
          cost: finalCost,
          milesEarned: Math.floor(finalCost * 0.1),
          seatClass,
          status: 'booked',
          bookingGroupId: bookingGroup._id
        });

        await booking.save();
        bookingGroup.bookings.push(booking._id);

        // Decrement seat count
        flight.seatsAvailable[seatClass] -= 1;
        await flight.save();

        bookings.push(booking);
      }
    }

    await bookingGroup.save();

    res.status(201).json({
      bookingGroupId: bookingGroup._id,
      bookings
    });

  } catch (err) {
    console.error('❌ Booking error:', err);
    res.status(500).json({ error: 'Server error during booking' });
  }
};