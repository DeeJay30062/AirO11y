import {
  Alert,
  Box,
  Button,
  Container,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const BookSearchFlights = () => {
  const navigate = useNavigate();
  const [airports, setAirports] = useState([]);
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [seatClass, setSeatClass] = useState("coach");
  const [tripType, setTripType] = useState("oneway");
  const [seatCount, setSeatCount] = useState(1);

  const [departureWarning, setDepartureWarning] = useState("");
  const [returnWarning, setReturnWarning] = useState("");
  const [searchError, setSearchError] = useState("");


  useEffect(() => {
  const saved = JSON.parse(sessionStorage.getItem("searchQuery"));
  if (saved) {
    setFrom(saved.from || "");
    setTo(saved.to || "");
    setDepartureDate(saved.departureDate || "");
    setReturnDate(saved.returnDate || "");
    setTripType(saved.tripType || "oneway");
    setSeatClass(saved.seatClass || "coach");
    setSeatCount(saved.seatCount || 1);
  }
}, []);

  useEffect(() => {
    api.get("/api/origins")
      .then((res) => setAirports(res.data))
      .catch((err) => {
        console.error("Failed to fetch origins", err);
        setAirports([]);
      });
  }, []);

  const [toOptions, setToOptions] = useState([]);

  useEffect(() => {
    if (from) {
      api.get(`/api/destinations/${from}`)
        .then((res) => setToOptions(res.data))
        .catch(() => setToOptions([]));
    }
  }, [from]);

  const checkFlightAvailability = async (origin, dest, date, setter) => {
    try {
      const res = await api.get("/api/flights/search", {
        params: { origin, dest, date },
      });
      if (res.data.length === 0) {
        setter("No flights found for this route and date.");
      } else {
        setter("");
      }
    } catch {
      setter("Error checking flight availability.");
    }
  };

  useEffect(() => {
    if (from && to && departureDate) {
      checkFlightAvailability(from, to, departureDate, setDepartureWarning);
    }
  }, [from, to, departureDate]);

  useEffect(() => {
    if (tripType === "roundtrip" && from && to && returnDate) {
      checkFlightAvailability(to, from, returnDate, setReturnWarning);
    }
  }, [tripType, from, to, returnDate]);

  const handleSubmit = async () => {
    if (!from || !to || !departureDate || !seatCount || seatCount < 1) {
      setSearchError("Please complete all fields including number of seats.");
      return;
    }

    try {
      const response = await api.get("/api/flights/search", {
        params: {
          origin: from,
          dest: to,
          date: departureDate,
          seatClass,
        },
      });

      if (response.data.length === 0) {
        setDepartureWarning("No flights found. Please try a different route or date.");
        return;
      }

      sessionStorage.setItem(
        "searchQuery",
        JSON.stringify({
          from,
          to,
          departureDate,
          returnDate: tripType === "roundtrip" ? returnDate : null,
          seatClass,
          seatCount,
          tripType,
        })
      );

      sessionStorage.setItem("searchResults", JSON.stringify(response.data));
      navigate("/book/select");
    } catch (err) {
      console.error("Search error", err);
      setSearchError("Server error during flight search.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Typography variant="h4" gutterBottom>
        Search Flights
      </Typography>

      {searchError && (
        <Alert severity="error" sx={{ mb: 2 }}>{searchError}</Alert>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>From</InputLabel>
        <Select value={from} onChange={(e) => setFrom(e.target.value)} label="From">
          {airports.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>To</InputLabel>
        <Select value={to} onChange={(e) => setTo(e.target.value)} label="To">
          {toOptions.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormLabel component="legend">Trip Type</FormLabel>
        <RadioGroup row value={tripType} onChange={(e) => setTripType(e.target.value)}>
          <FormControlLabel value="oneway" control={<Radio />} label="One-Way" />
          <FormControlLabel value="roundtrip" control={<Radio />} label="Round-Trip" />
        </RadioGroup>
      </FormControl>

      <TextField
        label="Departure Date"
        type="date"
        fullWidth
        value={departureDate}
        onChange={(e) => setDepartureDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 2 }}
      />
      {departureWarning && (
        <Alert severity="warning" sx={{ mb: 2 }}>{departureWarning}</Alert>
      )}

      {tripType === "roundtrip" && (
        <>
          <TextField
            label="Return Date"
            type="date"
            fullWidth
            value={returnDate}
            onChange={(e) => setReturnDate(e.target.value)}
            InputLabelProps={{ shrink: true }}
            sx={{ mb: 2 }}
          />
          {returnWarning && (
            <Alert severity="warning" sx={{ mb: 2 }}>{returnWarning}</Alert>
          )}
        </>
      )}

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Seat Class</InputLabel>
        <Select value={seatClass} onChange={(e) => setSeatClass(e.target.value)} label="Seat Class">
          <MenuItem value="coach">Coach</MenuItem>
          <MenuItem value="economyPlus">Economy Plus</MenuItem>
          <MenuItem value="first">First</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Number of Seats</InputLabel>
        <Select value={seatCount} onChange={(e) => setSeatCount(parseInt(e.target.value))} label="Number of Seats">
          {[...Array(9)].map((_, i) => (
            <MenuItem key={i + 1} value={i + 1}>
              {i + 1}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Search Flights
      </Button>
    </Container>
  );
};

export default BookSearchFlights;