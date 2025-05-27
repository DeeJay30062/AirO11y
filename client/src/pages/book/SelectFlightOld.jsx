import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Typography,
  Alert,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const SelectFlight = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(null);
  const [flights, setFlights] = useState([]);
  const [departureFlight, setDepartureFlight] = useState(null);
  const [returnFlights, setReturnFlights] = useState([]);
  const [returnFlight, setReturnFlight] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    try {
      const query = sessionStorage.getItem("searchQuery");
      const results = sessionStorage.getItem("searchResults");

      if (!query || !results) {
        setError("Missing search data. Please start again.");
        return;
      }

      const parsedQuery = JSON.parse(query);
      const parsedResults = JSON.parse(results);

      setSearchQuery(parsedQuery);
      setFlights(parsedResults);
    } catch (err) {
      console.error("Failed to parse session data", err);
      setError("Corrupt search data. Please start over.");
    }
  }, []);

  useEffect(() => {
    const fetchReturnFlights = async () => {
      if (
        searchQuery?.tripType === "roundtrip" &&
        departureFlight &&
        searchQuery.returnDate
      ) {
        try {
          const res = await fetch(
            `/api/flights/search?origin=${searchQuery.to}&dest=${searchQuery.from}&date=${searchQuery.returnDate}`
          );
          const data = await res.json();
          setReturnFlights(data);
        } catch (err) {
          console.error("Error fetching return flights", err);
        }
      }
    };

    fetchReturnFlights();
  }, [departureFlight, searchQuery]);

  const handleContinue = () => {
    const selected = [departureFlight];
    if (searchQuery.tripType === "roundtrip" && returnFlight) {
      selected.push(returnFlight);
    }

    sessionStorage.setItem("selectedFlights", JSON.stringify(selected));
    navigate("/book/passenger");
  };

  const renderFlightCard = (flight, onSelect, isSelected) => (
    <Card
      key={flight._id}
      variant="outlined"
      sx={{
        mb: 2,
        borderColor: isSelected ? "primary.main" : "grey.300",
        cursor: "pointer",
      }}
      onClick={() => onSelect(flight)}
    >
      <CardContent>
        <Typography variant="h6">
          {flight.flightScheduleId.origin} → {flight.flightScheduleId.destination}
        </Typography>
        <Typography>Date: {new Date(flight.date).toLocaleDateString()}</Typography>
        <Typography>
          Depart: {flight.flightScheduleId.departureTime} | Duration:{" "}
          {flight.flightScheduleId.durationMinutes} min
        </Typography>
        <Typography>Class: {searchQuery.seatClass}</Typography>
        <Typography>
          Price: ${flight.pricing?.finalCost || flight.baseCost}
        </Typography>
      </CardContent>
    </Card>
  );

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>{error}</Alert>
        <Button onClick={() => navigate("/book/search")} sx={{ mt: 2 }}>
          Go Back to Search
        </Button>
      </Container>
    );
  }

  if (!searchQuery) {
    return (
      <Container>
        <Typography variant="body1" sx={{ mt: 4 }}>
          Loading search data...
        </Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Select {departureFlight ? "Return" : "Departure"} Flight
      </Typography>

      {!departureFlight &&
        flights.map((flight) =>
          renderFlightCard(flight, setDepartureFlight, departureFlight?._id === flight._id)
        )}

      {departureFlight && searchQuery.tripType === "roundtrip" && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Select Return Flight
          </Typography>
          {returnFlights.length === 0 && (
            <Alert severity="info">No return flights found for selected date.</Alert>
          )}
          {returnFlights.map((flight) =>
            renderFlightCard(flight, setReturnFlight, returnFlight?._id === flight._id)
          )}
        </>
      )}

      {(searchQuery.tripType === "oneway" && departureFlight) ||
      (searchQuery.tripType === "roundtrip" && departureFlight && returnFlight) ? (
        <Button
          variant="contained"
          fullWidth
          sx={{ mt: 3 }}
          onClick={handleContinue}
        >
          Continue to Passenger Info
        </Button>
      ) : null}
    </Container>
  );
};

export default SelectFlight;
