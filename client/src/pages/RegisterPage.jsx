import {
  Box,
  Button,
  TextField,
  Typography,
  CircularProgress,
  Grid,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import api from "../api/axiosInstance";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    phone: "",
    street: "",
    city: "",
    state: "",
    zip: "",
    country: "",
    first: "",
    middle: "",
    last: "",
    suffix: "",
    dateOfBirth: "",
    loyaltyId: "",
    tsaPrecheckNumber: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const response = await api.post("/api/auth/register", {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        fullName: {
          first: formData.first,
          middle: formData.middle,
          last: formData.last,
          suffix: formData.suffix,
        },
        dateOfBirth: formData.dateOfBirth,
        loyaltyId: formData.loyaltyId,
        tsaPrecheckNumber: formData.tsaPrecheckNumber,
        phone: formData.phone,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zip: formData.zip,
          country: formData.country,
        },
      });

      if (response.status === 201) {
        navigate("/login");
      }
    } catch (err) {
      console.error("Registration failed:", err);
      setError(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit}
      sx={{
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        p: 3,
        display: "flex",
        flexDirection: "column",
        gap: 2,
        boxShadow: 2,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5">Register</Typography>

      <TextField label="Username" name="username" value={formData.username} onChange={handleChange} required />
      <TextField label="Email" name="email" type="email" value={formData.email} onChange={handleChange} required />
      <TextField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />

      <Typography variant="subtitle1">Full Name</Typography>
      <Grid container spacing={2}>
        <Grid item xs={6}><TextField label="First Name" name="first" value={formData.first} onChange={handleChange} required fullWidth /></Grid>
        <Grid item xs={6}><TextField label="Middle Name" name="middle" value={formData.middle} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={6}><TextField label="Last Name" name="last" value={formData.last} onChange={handleChange} required fullWidth /></Grid>
        <Grid item xs={6}><TextField label="Suffix" name="suffix" value={formData.suffix} onChange={handleChange} fullWidth /></Grid>
      </Grid>

      <TextField label="Date of Birth" name="dateOfBirth" type="date" InputLabelProps={{ shrink: true }} value={formData.dateOfBirth} onChange={handleChange} required />
      <TextField label="Loyalty ID" name="loyaltyId" value={formData.loyaltyId} onChange={handleChange} />
      <TextField label="TSA PreCheck Number" name="tsaPrecheckNumber" value={formData.tsaPrecheckNumber} onChange={handleChange} />

      <TextField label="Phone" name="phone" value={formData.phone} onChange={handleChange} />

      <Typography variant="subtitle1">Address</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12}><TextField label="Street" name="street" value={formData.street} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={6}><TextField label="City" name="city" value={formData.city} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={6}><TextField label="State" name="state" value={formData.state} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={6}><TextField label="ZIP" name="zip" value={formData.zip} onChange={handleChange} fullWidth /></Grid>
        <Grid item xs={6}><TextField label="Country" name="country" value={formData.country} onChange={handleChange} fullWidth /></Grid>
      </Grid>

      {error && <Typography color="error">{error}</Typography>}

      <Button type="submit" variant="contained" disabled={loading}>
        {loading ? <CircularProgress size={24} /> : "Register"}
      </Button>
    </Box>
  );
};

export default RegisterPage;