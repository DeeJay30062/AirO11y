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
import { useBooking } from "../../context/BookingContext";

const PassengerInfo = () => {
	console.log("Entering PassengerInfo");

  const { data, setData } = useBooking();
  const navigate = useNavigate();

  const [passengers, setPassengers] = useState(() => {
    return data.passengers?.length
      ? data.passengers
      : Array.from({ length: data.searchQuery?.seatCount || 1 }, () => ({
          name: "",
          dob: "",
          sex: "",
          loyaltyId: "",
          tsaNumber: "",
        }));
  });

  const [isTraveling, setIsTraveling] = useState(data.searchQuery?.isTraveling || false);
  const [userProfile, setUserProfile] = useState(null);
  const [error, setError] = useState("");
  const [validationErrors, setValidationErrors] = useState([]);
  //---------------------------
  //WAS const [passengers, setPassengers] = useState([]);

  useEffect(() => {
   // const searchQuery = JSON.parse(sessionStorage.getItem("searchQuery"));
   const searchQuery = data.searchQuery;
console.log("in useEffect [data.searchQuery]");
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
        //need to update to be in HttpOnly Cookie
//        const token = JSON.parse(localStorage.getItem("user"))?.token;
//        if (!token) return;
        console.log("Trying to get the profile");
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
  }, [data.searchQuery]);

  // Clear error for field when user types
  const clearError = (index, field) => {
    setValidationErrors((prev) => {
      const copy = [...prev];
      if (!copy[index]) copy[index] = {};
      copy[index][field] = false;
      return copy;
    });
  };

  const handleChange = (index, field, value) => {
    const updated = [...passengers];
    updated[index][field] = value;
    setPassengers(updated);

    clearError(index, field);
  };

  const handleTravelingCheck = (checked) => {
   setIsTraveling(checked);
    if (checked && userProfile) {
      const updated = [...passengers];
      updated[0] = { ...userProfile };
      setPassengers(updated);
	   
    }
  };

  // Validate required fields per passenger, track errors
  const validate = () => {
    const errors = passengers.map((p) => ({
      name: !p.name.trim(),
      dob: !p.dob,
      sex: !p.sex,
      //loyaltyId: !p.loyaltyId.trim(),
    }));

    setValidationErrors(errors);

    // Return true if no errors
    return !errors.some((e) => Object.values(e).some(Boolean));
  };

  const handleSubmit = () => {
    if (!validate()) {
      setError("Please complete all required fields for all passengers.");
      return;
    }

    setError("");
    setData({
  ...data,
  passengers,
  searchQuery: {
    ...data.searchQuery,
    isTraveling,
  },
});

    //WAS 
    //sessionStorage.setItem("passengers", JSON.stringify(passengers));
    //sessionStorage.setItem("isTraveling", JSON.stringify(isTraveling));
    navigate("/book/confirm");
  };

  if (error && !passengers.length) {
    // Critical error, show alert and back button
    return (
      <Container>
        <Alert severity="error" sx={{ mt: 4 }}>
          {error}
        </Alert>
        <Button sx={{ mt: 2 }} onClick={() => navigate("/book/confirm")}>
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

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

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
              label="I am traveling!"
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
                error={!!validationErrors[index]?.name}
                helperText={validationErrors[index]?.name && "Full name is required"}
                disabled={isTraveling && index === 0}
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
                error={!!validationErrors[index]?.dob}
                helperText={validationErrors[index]?.dob && "Date of birth is required"}
                disabled={isTraveling && index === 0}
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
                error={!!validationErrors[index]?.sex}
                helperText={validationErrors[index]?.sex && "Sex is required"}
                //disabled={isTraveling && index === 0}
              >
                <MenuItem value="M">Male</MenuItem>
                <MenuItem value="F">Female</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Loyalty ID"
                fullWidth
                //required
                value={passenger.loyaltyId}
                onChange={(e) => handleChange(index, "loyaltyId", e.target.value)}
                //error={!!validationErrors[index]?.loyaltyId}
                //helperText={validationErrors[index]?.loyaltyId && "Loyalty ID is required"}
                disabled={isTraveling && index === 0}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="TSA Number (optional)"
                fullWidth
                value={passenger.tsaNumber}
                onChange={(e) => handleChange(index, "tsaNumber", e.target.value)}
                disabled={isTraveling && index === 0}
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
