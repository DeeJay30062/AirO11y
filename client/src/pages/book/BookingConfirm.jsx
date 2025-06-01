// client/src/pages/BookingConfirm.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance.js"; // your axios setup
import {useBooking} from "../../context/BookingContext.jsx";


async function submitBookingGroup({
  departFlightId,
  returnFlightId,
  passengers,
  seatClass,
}) {
  const flightIds = [departFlightId];
  if (returnFlightId) flightIds.push(returnFlightId);

  const payload = { flightIds, passengers, seatClass };
  const response = await api.post("/api/book", payload);
  return response.data;
}
const BookingConfirm = () => {
  const {data, setData} = useBooking();
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {

    const searchQuery = data.searchQuery;
  //  const searchQuery = JSON.parse(sessionStorage.getItem("searchQuery"));
//    const selectedFlights = JSON.parse(sessionStorage.getItem("selectedFlights"));
  //  const passengers = JSON.parse(sessionStorage.getItem("passengers"));
    const selectedFlights = data.selectedFlights;
    const passengers = data.passengers;
    const isTravelling = data.searchQuery.isTravelling;

    if (!searchQuery || !selectedFlights || !passengers) {
      console.warn("Missing booking data");
      navigate("/book/search");
      return;
    }

    setSummary({
      searchQuery,
      departFlight: selectedFlights.depart,
      returnFlight: selectedFlights.return,
      passengers,
      isTravelling,
    });
  }, [navigate]);

  if (!summary) return <p>Loading booking summary...</p>;

  const { searchQuery, departFlight, returnFlight, passengers } = summary;

  const handleConfirm = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await submitBookingGroup({
        departFlightId: departFlight._id,
        returnFlightId: returnFlight?._id,
        passengers,
        seatClass: searchQuery.seatClass,
      });
      console.log("Booking successful!", result);
      // Navigate to payment page or show a success message
      navigate("/book/payment", { state: { bookingGroup: result } });
    } catch (err) {
      setError("Booking failed. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-3xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Review Your Booking</h2>

      {/* Flight Summary */}
      <div className="mb-6">
        <h3 className="font-semibold">Flights</h3>
        <ul>
          <li>
            Departure: {departFlight.flightScheduleId?.flightNumber} from{" "}
            {departFlight.flightScheduleId?.origin} to{" "}
            {departFlight.flightScheduleId?.destination} on{" "}
            {new Date(departFlight.date).toLocaleDateString()}
          </li>
          {searchQuery.tripType === "roundtrip" && returnFlight && (
            <li>
              Return: {returnFlight.flightScheduleId?.flightNumber} from{" "}
              {returnFlight.flightScheduleId?.origin} to{" "}
              {returnFlight.flightScheduleId?.destination} on{" "}
              {new Date(returnFlight.date).toLocaleDateString()}
            </li>
          )}
        </ul>
      </div>

      {/* Passenger Info */}
      <div className="mb-6">
        <h3 className="font-semibold">Passengers</h3>
        {passengers.map((p, idx) => (
          <div key={idx} className="border p-2 mb-2 rounded">
            <p>
              <strong>Name:</strong> {p.name}
            </p>
            <p>
              <strong>DOB:</strong> {p.dob}
            </p>
            <p>
              <strong>Loyalty ID:</strong> {p.loyaltyId}
            </p>
            <p>
              <strong>TSA:</strong> {p.tsaNumber}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing Summary (estimation only for now) */}
      <div className="mb-6">
        <h3 className="font-semibold">Estimated Total</h3>
        <p>
          {passengers.length} × $
          {(departFlight.pricing?.finalCost ?? departFlight.baseCost) +
            (returnFlight
              ? returnFlight.pricing?.finalCost ?? returnFlight.baseCost
              : 0)}{" "}
          ={" "}
          <strong>
            $
            {(
              ((departFlight.pricing?.finalCost ?? departFlight.baseCost) +
                (returnFlight
                  ? returnFlight.pricing?.finalCost ?? returnFlight.baseCost
                  : 0)) *
              passengers.length
            ).toFixed(2)}
          </strong>
        </p>
      </div>

      {/* Confirm Booking */}
      <button
        disabled={loading}
        className={`bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 ${
          loading ? "opacity-50 cursor-not-allowed" : ""
        }`}
        onClick={handleConfirm}
      >
        {loading ? "Booking..." : "Confirm Booking"}
      </button>
    </div>
  );
};

export default BookingConfirm;
