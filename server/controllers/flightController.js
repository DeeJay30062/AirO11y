import DailyFlight from "../models/DailyFlight.js";
import FlightSchedule from "../models/FlightSchedule.js";
import axios from "axios";
import logger from "../lib/logger.js";
import { stackClasses } from "@mui/material";

// GET /api/origins
export const getAllOrigins = async (req, res) => {
  try {
    const origins = await FlightSchedule.distinct("origin");
    res.status(200).json(origins);
  } catch (err) {
    logger.error("Error in getAllOrigins:", { error: err });
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
    logger.error("Error in getDestinationsByOrigin:", { error: err });
    res.status(500).json({ error: "Server error" });
  }
};

// GET /api/flights/search?origin=X&dest=Y&date=Z
export const searchFlights = async (req, res) => {
  try {
    const { origin, dest, date, seatClass } = req.query;
    const normalizedSeatClass = seatClass || "coach";

    logger.info("Flight search params", {
      origin,
      dest,
      date,
      seatClass: normalizedSeatClass,
    });

    if (!origin || !dest || !date) {
      return res.status(400).json({ error: "Missing origin, dest, or date" });
    }

    const parsedDate = new Date(date);
    if (isNaN(parsedDate)) {
      return res.status(400).json({ error: "Invalid date format" });
    }

    // Validate seatClass
    const allowedClasses = ["coach", "economyPlus", "first"];
    if (!allowedClasses.includes(normalizedSeatClass)) {
      return res.status(400).json({ error: "Invalid seatClass" });
    }

    const schedules = await FlightSchedule.find({ origin, destination: dest });
    const scheduleIds = schedules.map((s) => s._id);

    const startOfDay = new Date(parsedDate);
    startOfDay.setUTCHours(0, 0, 0, 0);
    const endOfDay = new Date(parsedDate);
    endOfDay.setUTCHours(23, 59, 59, 999);

    const flights = await DailyFlight.find({
      date: { $gte: startOfDay, $lt: endOfDay },
      flightScheduleId: { $in: scheduleIds },
    }).populate("flightScheduleId");

    const today = new Date();
    const baseURL = process.env.PRICING_URL || "http://localhost:8000";
    if (!process.env.PRICING_URL) {
      logger.warn("PRICING_URL not set. Falling back to default", { baseURL });
    } else {
      logger.info("Using configured PRICING_URL", { baseURL });
    }

    const enrichedFlights = await Promise.all(
      flights.map(async (flight) => {
        const baseCost = flight.baseCost;
        const seatsRemaining = flight.seatsAvailable[normalizedSeatClass];
        const totalSeats =
          flight.flightScheduleId.seatConfig[normalizedSeatClass];
        const daysUntilFlight = Math.ceil(
          (flight.date - today) / (1000 * 60 * 60 * 24)
        );

        let finalCost = baseCost;
        let modifiers = {};

        try {
          const response = await axios.post(`${baseURL}/price`, {
            baseCost,
            seatClass: normalizedSeatClass,
            daysUntilFlight,
            seatsRemaining,
            totalSeats,
          });

          finalCost = response.data.finalCost;
          modifiers = response.data.modifiers;

          logger.info("Pricing modifiers received", {
            flightId: flight._id,
            modifiers,
          });
        } catch (err) {
          logger.error("Pricing service error", {
            error: err.message,
            stack: err.stack,
            flightId: flight._id,
          });
        }

        return {
          ...flight.toObject(),
          pricing: {
            finalCost,
            modifiers,
          },
        };
      })
    );

    res.status(200).json(enrichedFlights);
  } catch (err) {
    logger.error("Error in searchFlights", {
      error: err.message,
      stack: err.stack,
    });
    res.status(500).json({ error: "Server error" });
  }
};
