import mongoose from 'mongoose';

const dailyFlightSchema = new mongoose.Schema({
  date: { type: Date, required: true},
  flightScheduleId: { type: mongoose.Types.ObjectId, ref: "FlightSchedule", required: true},
  status: { type: String, enum: ['scheduled', 'cancelled','delayed' ], default: 'scheduled'},

  baseCost: { type: Number, required: true },
  seatsAvailable: 
      {
        first: {type: Number, required: true},
        economyPlus: {type: Number, required: true},
        coach: {type: Number, required: true},
      },
    

  }, {
  timestamps: true
});

const DailyFlight = mongoose.model('DailyFlight', dailyFlightSchema);
export default DailyFlight;
