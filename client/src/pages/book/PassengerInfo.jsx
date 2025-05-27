import {
  Box,
  Button,
  Container,
  Grid,
  TextField,
  Typography,
  MenuItem,
  Alert,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axiosInstance";

const PassengerInfo = () => {
  const navigate = useNavigate();
  const [passengers, setPassengers] = useState([]);
  const [error, setError] = useState("");
  const [isTraveling, setIsTraveling] = useState(false);
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    const searchQuery = JSON.parse(sessionStorage.getItem("searchQuery"));
    if (!searchQuery || !searchQuery.seatCount) {
      setError("Missing booking context. Please restart your booking.");
      return;
    }

    const initialPassengers = Array.from(
      { length: searchQuery.seatCount },
      () => ({
        name: "",
        dob: "",
        sex: "",
        loyaltyId: "",
        tsaNumber: "",
      })
    );

    setPassengers(initialPassengers);

    const fetchProfile = async () => {
      try {
        const token = JSON.parse(localStorage.getItem("user"))?.token;
        if (!token) return;
        const res = await api.get("/api/user/profile");

      

        const { fullName, dateOfBirth, loyaltyId, tsaPrecheckNumber } =
          res.data;

        const formattedName = `${fullName.first} ${fullName.middle || ""} ${
          fullName.last
        }${fullName.suffix ? " " + fullName.suffix : ""}`.trim();

        setUserProfile({
          name: formattedName,
          dob: dateOfBirth?.split("T")[0] || "",
          sex: "",
          loyaltyId: loyaltyId || "",
          tsaNumber: tsaPrecheckNumber || "",
        });
      } catch (err) {
        console.error("Failed to fetch user profile", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);
  };

  const handleTravelingCheck = (checked) => {
    setIsTraveling(checked);
    if (checked && userProfile) {
      const updated = [...passengers];
      updated[0] = { ...userProfile };
      setPassengers(updated);
    }
  };

  const handleSubmit = () => {
    const hasEmptyFields = passengers.some(
      (p) => !p.name || !p.dob || !p.sex || !p.loyaltyId
    );

    if (hasEmptyFields) {
      setError("Please complete all required fields for all passengers.");
      return;
    }

    sessionStorage.setItem("passengerInfo", JSON.stringify(passengers));
    sessionStorage.setItem("isTraveling", JSON.stringify(isTraveling));
    navigate("/book/confirm");
  };

  if (error) {
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/book/search")}>
          Back to Search
        </Button>
      </Container>
    );
  }

  return (
    <Container>
      <Typography variant="h5" gutterBottom>
        Passenger Information
      </Typography>

      {passengers.map((passenger, index) => (
        <Box key={index} sx={{ mb: 3, borderBottom: "1px solid #ccc", pb: 2 }}>
          <Typography variant="h6">Passenger {index + 1}</Typography>
          {index === 0 && (
            <FormControlLabel
              control={
                <Checkbox
                  checked={isTraveling}
                  onChange={(e) => handleTravelingCheck(e.target.checked)}
                />
              }
              label="I am traveling"
              sx={{ mt: 1, mb: 1 }}
            />
          )}
          <Grid container spacing={2} sx={{ mt: 1 }}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Full Name"
                fullWidth
                required
                value={passenger.name}
                onChange={(e) => handleChange(index, "name", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Date of Birth"
                type="date"
                fullWidth
                required
                InputLabelProps={{ shrink: true }}
                value={passenger.dob}
                onChange={(e) => handleChange(index, "dob", e.target.value)}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                select
                label="Sex"
                fullWidth
                required
                value={passenger.sex}
                onChange={(e) => handleChange(index, "sex", e.target.value)}
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Loyalty ID"
                fullWidth
                required
                value={passenger.loyaltyId}
                onChange={(e) =>
                  handleChange(index, "loyaltyId", e.target.value)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="TSA Number (optional)"
                fullWidth
                value={passenger.tsaNumber}
                onChange={(e) =>
                  handleChange(index, "tsaNumber", e.target.value)
                }
              />
            </Grid>
          </Grid>
        </Box>
      ))}

      <Button variant="contained" fullWidth onClick={handleSubmit}>
        Continue to Confirmation
      </Button>
    </Container>
  );
};

export default PassengerInfo;
