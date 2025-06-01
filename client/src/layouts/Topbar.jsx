// client/src/layouts/Topbar.jsx
import { AppBar, Toolbar, Typography, IconButton, Box } from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useEffect, useState } from "react";
import { Button } from "@mui/material";
import { useBooking } from "../context/BookingContext.jsx";
import api from "../api/axiosInstance";

const Topbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const [user, setUser] = useState(null);
  const { setData } = useBooking();

  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setUser(parsed);
      } catch (err) {
        console.error("Failed to parse user from localStorage");
      }
    }
  }, []);
const handleLogout = async () => {
  try {
    await api.post("/logout"); // if you have one
  } catch (err) {
    console.warn("Logout API failed, moving on anyway.");
  }

  localStorage.removeItem("user");
  setData({}); // not awaited!
  //navigate("/login");
  window.location.href = '/login';

};
/*
  const handleLogout = () => {
    localStorage.removeItem("user");
    sessionStorage.clear();
    setData({});
    await api.post("/auth/logout");
    window.location.href = "/login";
    api.defaults.headers.common["Authorization"] = "";
    navigate("/login");
  };
*/
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          {!isSidebarOpen && (
            <IconButton
              color="inherit"
              onClick={() => setIsSidebarOpen(true)}
              edge="start"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6">AirO11y</Typography>
        </Box>

        {user && (
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Typography variant="body1">
              Logged in as {user.username}
            </Typography>
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
