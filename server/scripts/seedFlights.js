import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FlightSchedule from '../models/FlightSchedule.js';
import DailyFlight from '../models/DailyFlight.js';
import flightSchedules from '../seed-data/flightSchedules.js';

dotenv.config();
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/airO11y';
console.log('process.env.MONGO_URI', process.env.MONGO_URI);
console.log('MONGO_URI ',MONGO_URI)
await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
console.log('🔌 Connected to MongoDB. Seeding flights...', mongoose.connection.name);

// STEP 1: Clear existing data
await FlightSchedule.deleteMany({});
await DailyFlight.deleteMany({});
console.log('🧹 Cleared existing schedules and daily flights.');

// STEP 2: Insert FlightSchedules
const schedules = await FlightSchedule.insertMany(flightSchedules);
console.log(`📦 Inserted ${schedules.length} FlightSchedules.`);

// STEP 3: Generate DailyFlights for next 90 days
const daysToGenerate = 90;
const dailyFlights = [];

for (let i = 0; i < daysToGenerate; i++) {
  const date = new Date();
  date.setDate(date.getDate() + i);
  const dayOfWeek = ['Su', 'M', 'T', 'W', 'Th', 'F', 'Sa'][date.getDay()];

  for (const schedule of schedules) {
    if (schedule.daysOfWeek.includes(dayOfWeek)) {
      const seats = schedule.seatConfig;
      dailyFlights.push({
        date,
        flightScheduleId: schedule._id,
        baseCost: 200 + Math.floor(Math.random() * 150), // $200–$350
        seatsAvailable: {
          first: seats.first,
          economyPlus: seats.economyPlus,
          coach: seats.coach,
        },
        status: 'scheduled',
      });
    }
  }
}

await DailyFlight.insertMany(dailyFlights);
console.log(`🛫 Inserted ${dailyFlights.length} DailyFlights.`);

await mongoose.disconnect();
console.log('✅ Seeding complete. Connection closed.');
