import Booking from '../models/Booking.js';
import BookingGroup from '../models/BookingGroup.js';
import Passenger from '../models/Passenger.js';
import DailyFlight from '../models/DailyFlight.js';
import axios from 'axios';
import mongoose from 'mongoose';

export const createBookingGroup = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { flightIds, passengers, seatClass } = req.body;
      const userId = req.user?._id || null;

      if (!flightIds || !Array.isArray(flightIds) || flightIds.length === 0) {
        throw new Error('Missing or invalid flightIds');
      }

      if (!passengers || !Array.isArray(passengers) || passengers.length === 0) {
        throw new Error('Missing or invalid passengers');
      }

      if (!seatClass || !['coach', 'economyPlus', 'first'].includes(seatClass)) {
        throw new Error('Invalid seatClass');
      }

      const flights = await DailyFlight.find({ _id: { $in: flightIds } }).populate('flightScheduleId');
      if (flights.length !== flightIds.length) {
        throw new Error('One or more flights not found');
      }

      const today = new Date();
      const bookingGroup = new BookingGroup({ userId, bookings: [] });
      await bookingGroup.save({ session });

      const bookings = [];

      for (const passengerData of passengers) {
        // Simulate failure for testing rollback
        if (passengerData.name === "FAIL_ME") {
          throw new Error("Simulated booking failure for observability testing");
        }

        let passenger = await Passenger.findOne({ loyaltyId: passengerData.loyaltyId }).session(session);
        if (!passenger) {
          passenger = new Passenger(passengerData);
          await passenger.save({ session });
        }

        for (const flight of flights) {
          const seatsRemaining = flight.seatsAvailable[seatClass];
          const totalSeats = flight.flightScheduleId.seatConfig[seatClass];
          if (seatsRemaining <= 0) {
            throw new Error(`No ${seatClass} seats left for flight ${flight._id}`);
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
            flightId: flight._id,
            passengerId: passenger._id,
            cost: finalCost,
            milesEarned: Math.floor(finalCost * 0.1),
            seatClass,
            status: 'booked',
            bookingGroupId: bookingGroup._id
          });

          await booking.save({ session });
          bookingGroup.bookings.push(booking._id);

          // Decrement seat count in memory
          flight.seatsAvailable[seatClass] -= 1;
          await flight.save({ session });

          bookings.push(booking);
        }
      }

      await bookingGroup.save({ session });

      res.status(201).json({
        bookingGroupId: bookingGroup._id,
        bookings
      });
    });
  } catch (err) {
    console.error('❌ Booking transaction failed:', err.message);
    res.status(500).json({ error: err.message });
  } finally {
    session.endSession();
  }
};