import mongoose from "mongoose";


const bookingSchema = new mongoose.Schema({
  flightId: {type: mongoose.Types.ObjectId, ref: "DailyFlight", required: true},  
  passengerId: { type: mongoose.Types.ObjectId, ref: "Passenger", required: true },
  cost: { type: Number, required: true},
  milesEarned: { type: Number, required: true},
  seatClass: { type: String, enum: ['first', 'economyPlus', 'coach'], required: true },
  status: { type: String, enum: ['booked', 'cancelled','checked-in' ], default: 'booked'},
},
{ timestamps: true }
);

const Booking = mongoose.model('Booking',bookingSchema);

export default Booking;