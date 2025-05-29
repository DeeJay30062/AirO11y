import mongoose from 'mongoose';
import dotenv from 'dotenv';
import FlightSchedule from '../models/FlightSchedule.js';
import DailyFlight from '../models/DailyFlight.js';

console.log("Good Morning and welcome to myTest");

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



const flightSchedules = [];

function addFlightSchedule(
  flightNumber,
  origin,
  destination,
  durationMinutes,
  departureTime
) {
  flightSchedules.push({
    flightNumber,
    origin,
    destination,
    daysOfWeek: ["M", "T", "W", "Th", "F", "Sa", "Su"],
    departureTime,
    durationMinutes,
    seatConfig: {
      first: 16,
      economyPlus: 24,
      coach: 120,
    },
  });
}
const hubs = ["ATL", "DFW", "LAX", "SLC", "SEA"];
const duration = {
  ATL: { DFW: 130, LAX: 250, SLC: 210, SEA: 270 },
  DFW: { ATL: 130, LAX: 190, SLC: 160, SEA: 220 },
  LAX: { ATL: 250, DFW: 190, SLC: 120, SEA: 110 },
  SLC: { ATL: 210, DFW: 160, LAX: 120, SEA: 100 },
  SEA: { ATL: 270, DFW: 220, LAX: 110, SLC: 100 },
};
const timeOffset = { ATL: 0, DFW: 1, LAX: 3, SLC: 2, SEA: 3 };
const flightDays = ["M", "T", "W", "Th", "F", "Sa", "Su"];
let i = 1;
let departureTime = 0;

for (const origin of hubs) {
  console.log("This is origin [%s]", origin);
  for (const dest of hubs) {
    if (origin != dest) {
      for (let j = 8; j < 23; j++) {
        
        addFlightSchedule("AO" + i.toString().padStart(3, "0"), origin, dest, duration[origin][dest], j.toString().padStart(2,"0") + ":00");

        i++;
      }
    }
  }
}

console.log("==========================================");
//console.log(flightSchedules);

// STEP 3: Insert FlightSchedules
let schedules;
try {
  schedules = await FlightSchedule.insertMany(flightSchedules);
  console.log(`📦 Inserted ${schedules.length} FlightSchedules.`);

  // Check total documents in the collection after insert
  const totalCount = await FlightSchedule.countDocuments();
  console.log(`📊 Total FlightSchedules in DB now: ${totalCount}`);
} catch (error) {
  console.error('❌ Error inserting flight schedules:', error);
}

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

console.log("exiting");

/*
for (let i = 0; i < daysToGenerate; i++) {
const seatSchema = new mongoose.Schema({
  first: { type: Number, required: true },
  economyPlus: { type: Number, required: true },
  coach: { type: Number, required: true },
});

flightNumber: { type: String, required: true, unique: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  daysOfWeek: [{ type: String, enum: ['M', 'T', 'W', 'Th', 'F', 'Sa', 'Su'] }],
  departureTime: { type: String, required: true }, // HH:mm format
  durationMinutes: { type: Number, required: true },
  seatConfig: { type: seatSchema, required: true }
  */
