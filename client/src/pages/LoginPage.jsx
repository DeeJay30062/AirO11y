// client/src/pages/LoginPage.jsx

import { useState } from "react";
import { TextField, Button, Typography, Box, Alert } from "@mui/material";
import axios from "axios";
import api from "../api/axiosInstance";
import { useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/api/auth/login", {
        username,
        password,
      });
      console.log("login response:", res.data);
      const profile = await api.get("/api/user/profile");
      console.log("✅ Profile fetched right after login:", profile.data);

      // Store only username and token
      localStorage.setItem(
        "user",
        JSON.stringify({
          username: res.data.user.username,
        })
      );

      navigate("/book/search");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", mt: 8 }}>
      <Typography variant="h4" gutterBottom>
        Login
      </Typography>

      <form onSubmit={handleLogin}>
        <TextField
          fullWidth
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          margin="normal"
          required
        />
        <TextField
          fullWidth
          type="password"
          label="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          required
        />
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}
        <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
          Sign In
        </Button>
        <Button
          fullWidth
          variant="text"
          sx={{ mt: 1 }}
          onClick={() => navigate("/register")}
        >
          Don’t have an account? Register
        </Button>
      </form>
    </Box>
  );
};

export default LoginPage;
