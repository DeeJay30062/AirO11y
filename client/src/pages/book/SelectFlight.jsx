import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Grid,
  Container,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const SelectFlight = () => {
  const navigate = useNavigate();
  const searchQuery = JSON.parse(sessionStorage.getItem("searchQuery"));
  const [departFlights, setDepartFlights] = useState([]);
  const [returnFlights, setReturnFlights] = useState([]);
  const [selectedDepartFlight, setSelectedDepartFlight] = useState(null);
  const [selectedReturnFlight, setSelectedReturnFlight] = useState(null);

  useEffect(() => {
    if (!searchQuery) return navigate("/book/search");

    const fetchDepart = async () => {
      const res = await api.get("/api/flights/search", {
        params: {
          origin: searchQuery.from,
          dest: searchQuery.to,
          date: searchQuery.departureDate,
          seatClass: searchQuery.seatClass,
        },
      });
      setDepartFlights(res.data);
    };

    const fetchReturn = async () => {
      if (searchQuery.tripType === "roundtrip" && searchQuery.returnDate) {
        const res = await api.get("/api/flights/search", {
          params: {
            origin: searchQuery.to,
            dest: searchQuery.from,
            date: searchQuery.returnDate,
            seatClass: searchQuery.seatClass,
          },
        });
        setReturnFlights(res.data);
      }
    };

    fetchDepart();
    fetchReturn();
  }, []);

  useEffect(() => {
    const isRoundTrip = searchQuery.tripType === 'roundtrip';
    const hasDepart = !!selectedDepartFlight;
    const hasReturn = !!selectedReturnFlight;

    if ((isRoundTrip && hasDepart && hasReturn) || (!isRoundTrip && hasDepart)) {
      // Save and auto-navigate
      sessionStorage.setItem("selectedFlights", JSON.stringify({
        depart: selectedDepartFlight,
        return: selectedReturnFlight,
      }));
      navigate("/book/passenger");
    }
  }, [selectedDepartFlight, selectedReturnFlight]);

  const renderFlightCard = (flight, selectedId, setSelected) => (
    <Grid item xs={12} md={6} key={flight._id}>
      <Card
        variant="outlined"
        sx={{
          borderColor: selectedId === flight._id ? "primary.main" : "grey.300",
          cursor: "pointer",
        }}
        onClick={() => setSelected(flight)}
      >
        <CardContent>
          <Typography variant="h6">
            {flight.flightScheduleId.flightNumber} —{" "}
            {flight.flightScheduleId.origin} to {flight.flightScheduleId.destination}
          </Typography>
          <Typography>
            Departure: {flight.flightScheduleId.departureTime}, Duration:{" "}
            {flight.flightScheduleId.durationMinutes} mins
          </Typography>
          <Typography>
            Price: ${flight.pricing?.finalCost || flight.baseCost}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );

  return (
    <Container sx={{ mt: 3 }}>
      <Typography variant="h5" gutterBottom>
        Select Your Flight
      </Typography>

      <Typography variant="h6" sx={{ mt: 2 }}>
        Departure Flights
      </Typography>
      <Grid container spacing={2}>
        {departFlights.map((flight) =>
          renderFlightCard(flight, selectedDepartFlight?._id, setSelectedDepartFlight)
        )}
      </Grid>

      {searchQuery.tripType === "roundtrip" && (
        <>
          <Typography variant="h6" sx={{ mt: 4 }}>
            Return Flights
          </Typography>
          <Grid container spacing={2}>
            {returnFlights.map((flight) =>
              renderFlightCard(flight, selectedReturnFlight?._id, setSelectedReturnFlight)
            )}
          </Grid>
        </>
      )}
    </Container>
  );
};

export default SelectFlight;