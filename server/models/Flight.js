import mongoose from 'mongoose';

const FlightSchema = new mongoose.Schema({
  flightNumber: { type: String, required: true, unique: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  departureTime: { type: Date, required: true },
  arrivalTime: { type: Date, required: true },
  price: { type: Number, required: true },
  availableSeats: { type: Number, required: true },
  airline: { type: String, default: 'AirO11y' }
}, {
  timestamps: true
});

const Flight = mongoose.model('Flight', FlightSchema);
export default Flight;
