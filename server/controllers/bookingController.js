import Booking from '../models/Booking.js';
import BookingGroup from '../models/BookingGroup.js';
import Passenger from '../models/Passenger.js';
import DailyFlight from '../models/DailyFlight.js';
import axios from 'axios';
import mongoose from 'mongoose';
import User from '../models/User.js';

export const createBookingGroup = async (req, res) => {
  const session = await mongoose.startSession();
  try {
    await session.withTransaction(async () => {
      const { flightIds, passengers, seatClass } = req.body;
      const userId = req.user?._id || null;
      console.log("this is userId [%s", userId);

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

          console.log("process.env.PRICING_URL [%s]", process.env.PRICING_URL);
		try {
            const response = await axios.post(process.env.PRICING_URL || 'http://192.168.1.180:8000/price', {
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

export const getBookingGroups = async (req, res) => {
  console.log("here we are in getBookingGroups");
  try {
    const { userName, date } = req.query;

    if (!userName) {
      return res.status(400).json({ error: 'Missing required userName parameter' });
    }
console.log("Looking for [%s]", userName);
  //Find user by username
  const user = await User.findOne({username: userName});
  if (!user){
    console.log("await User.findOne({username: %s}); didn't work", userName);
    console.log("User not found");
    return res.status(404).json({ error: 'User not found'});
  }

    const query = { userId: user._id };
console.log('Found username [%s] in Users', userName);
console.log('Looking for [%s] in BookingGroup', query);
    // Find BookingGroups by userId only. Filtering by flight date will happen after population.
    let bookingGroups = await BookingGroup.find(query)
      .populate({
        path: 'bookings',
        populate: [
          { path: 'flightId', model: DailyFlight },
          { path: 'passengerId', model: Passenger }
        ]
      })
      .lean();

    // If date filter is provided, convert it and filter bookings inside bookingGroups
    if (date) {
      const filterDate = new Date(date);
      if (isNaN(filterDate)) {
        return res.status(400).json({ error: 'Invalid date format' });
      }

      bookingGroups = bookingGroups.map(group => {
        // Filter bookings where flight date >= filterDate
        const filteredBookings = group.bookings.filter(booking => {
          return booking.flightId?.date && new Date(booking.flightId.date) >= filterDate;
        });
        return {
          ...group,
          bookings: filteredBookings
        };
      }).filter(group => group.bookings.length > 0); // Remove groups with no matching bookings
    }

    // Format response (optional - here just return as is)
    return res.status(200).json({ bookingGroups });
  } catch (err) {
    console.error('Failed to fetch booking groups:', err);
    return res.status(500).json({ error: 'Server error fetching booking groups' });
  }
};
