/* SearchFlights.jsx */

import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const airports = ["ATL", "JFK", "LAX", "ORD", "DFW", "SEA", "DEN", "MIA"]; // You can expand this

const SearchFlights = () => {
  const navigate = useNavigate();

  // Form state
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [departureDate, setDepartureDate] = useState("");
  const [oneWay, setOneWay] = useState(true);
  const [origins, setOrigins] = useState([]);
  const [loadingOrigins, setLoadingOrigins] = useState(true);
  const [fetchError, setFetchError] = useState("");

  useEffect(() => {
    const fetchOrigins = async () => {
      try {
        const response = await axios.get("/api/origins");
        console.log('Origin response:', response.data);
        setOrigins(response.data);
        setLoadingOrigins(false);
      } catch (err) {
        console.error("Failed to fetch origins:", err);
        setFetchError("Unable to load origin cities");
        setLoadingOrigins(false);
      }
    };

    fetchOrigins();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.get("/api/flights", {
        params: {
          from,
          to,
          departureDate,
        },
      });

      // Normally you’d use global state or context to pass data between steps
      // For now we’ll use sessionStorage as a simple placeholder
      sessionStorage.setItem("searchResults", JSON.stringify(response.data));
      sessionStorage.setItem(
        "searchQuery",
        JSON.stringify({ from, to, departureDate })
      );

      navigate("/book/select");
    } catch (err) {
      console.error("Flight search failed", err);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: 400 }}
    >
      <Typography variant="h6">Search Flights</Typography>

      <FormControl fullWidth>
        <TextField
          select
          label="From"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
          fullWidth
          margin="normal"
          disabled={loadingOrigins}
          helperText={fetchError || ""}
        >
        {origins.map((city) => (
          <MenuItem key={city} value={city}>
            {city}
          </MenuItem>
        ))} </TextField>
      </FormControl>

      <FormControl fullWidth>
        <InputLabel>To</InputLabel>
        <Select value={to} onChange={(e) => setTo(e.target.value)} required>
          {airports.map((code) => (
            <MenuItem key={code} value={code}>
              {code}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        label="Departure Date"
        type="date"
        InputLabelProps={{ shrink: true }}
        value={departureDate}
        onChange={(e) => setDepartureDate(e.target.value)}
        required
      />

      <FormControlLabel
        control={
          <Switch checked={oneWay} onChange={() => setOneWay(!oneWay)} />
        }
        label="One Way"
      />

      <Button type="submit" variant="contained">
        Search
      </Button>
    </Box>
  );
};

export default SearchFlights;
