import DailyFlight from "../models/DailyFlight.js";
import FlightSchedule from "../models/FlightSchedule.js";

// GET /api/origins
export const getAllOrigins = async (req, res) => {
  try {
    const origins = await FlightSchedule.distinct("origin");
    res.status(200).json(origins);
  } catch (err) {
    console.error("❌ Error in getAllOrigins:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/destinations/:origin
export const getDestinationsByOrigin = async (req, res) => {
  try {
    const { origin } = req.params;
    const destinations = await FlightSchedule.find({ origin }).distinct(
      "destination"
    );
    res.status(200).json(destinations);
  } catch (err) {
    console.error("❌ Error in getDestinationsByOrigin:", err);
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/flights/search?origin=X&dest=Y&date=Z

export const searchFlights = async (req, res) => {
  try {
    const { origin, dest, date } = req.query;

    if (!origin || !dest || !date) {
      return res.status(400).json({ error: "Missing origin, dest, or date" });
    }

    // Parse date string to JS Date
    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Find matching flight schedules
    const schedules = await FlightSchedule.find({ origin, destination: dest });
    const scheduleIds = schedules.map((s) => s._id);

    const startOfDay = new Date(parsedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);

    const endOfDay = new Date(parsedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    // Find DailyFlights on that date with matching schedule
    const flights = await DailyFlight.find({
      date: { $gte: startOfDay, $lt: endOfDay },
      flightScheduleId: { $in: scheduleIds },
    }).populate("flightScheduleId");

    res.status(200).json(flights);
  } catch (err) {
    console.error("❌ Error in searchFlights:", err);
    res.status(500).json({ error: "Server error" });
  }
};
