// models/FlightSchedule.js

import mongoose from 'mongoose';

const seatSchema = new mongoose.Schema({
  first: { type: Number, required: true },
  economyPlus: { type: Number, required: true },
  coach: { type: Number, required: true },
});

const flightScheduleSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  daysOfWeek: [{ type: String, enum: ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'] }],
  departureTime: { type: String, required: true }, // HH:mm format
  durationMinutes: { type: Number, required: true },
  seatConfig: { type: seatSchema, required: true },
});

const FlightSchedule = mongoose.model('FlightSchedule', flightScheduleSchema);

export default FlightSchedule;
