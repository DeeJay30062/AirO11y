// client/src/pages/AdminFlights.jsx
import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  TextField,
  Typography,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  CircularProgress,
  Paper,
} from "@mui/material";

const AdminFlights = () => {
  const [userName, setUserName] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [bookingGroups, setBookingGroups] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchBookingGroups = async () => {
    setLoading(true);
    setError(null);
    try {
      const responseFrom = dateFrom
        ? await axios.get("/api/booking-groups", {
            params: { userName, date: dateFrom },
          })
        : await axios.get("/api/booking-groups", { params: { userName } });

      let groups = responseFrom.data.bookingGroups || [];

      if (dateTo) {
        const toDate = new Date(dateTo);
        groups = groups
          .map((group) => ({
            ...group,
            bookings: group.bookings.filter(
              (b) => b.flightId && new Date(b.flightId.date) <= toDate
            ),
          }))
          .filter((group) => group.bookings.length > 0);
      }

      setBookingGroups(groups);
    } catch (err) {
      setError(err.response?.data?.error || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 900, mx: "auto", p: 3 }}>
      <Typography variant="h4" mb={3}>
        Search Booking Groups
      </Typography>

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 2 }}>
        <TextField
          label="User Name"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
          required
          sx={{ flex: "1 1 200px" }}
        />

        <TextField
          label="Date From"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateFrom}
          onChange={(e) => setDateFrom(e.target.value)}
          sx={{ flex: "1 1 150px" }}
        />

        <TextField
          label="Date To"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={dateTo}
          onChange={(e) => setDateTo(e.target.value)}
          sx={{ flex: "1 1 150px" }}
        />

        <Button
          variant="contained"
          onClick={fetchBookingGroups}
          disabled={loading || !userName}
          sx={{ alignSelf: "center" }}
        >
          {loading ? <CircularProgress size={24} /> : "Search"}
        </Button>
      </Box>

      {error && (
        <Typography color="error" mb={2}>
          Error: {error}
        </Typography>
      )}

      {bookingGroups.length > 0 ? (
        <Paper>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Booking Group ID</TableCell>
                <TableCell>Booking ID</TableCell>
                <TableCell>Passenger Name</TableCell>
                <TableCell>Flight Date</TableCell>
                <TableCell>Seat Class</TableCell>
                <TableCell>Cost</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Miles Earned</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {bookingGroups.map((group) =>
                group.bookings.map((booking) => (
                  <TableRow key={booking._id}>
                    <TableCell>{group._id}</TableCell>
                    <TableCell>{booking._id}</TableCell>
                    <TableCell>{booking.passengerId?.name || "N/A"}</TableCell>
                    <TableCell>
                      {booking.flightId?.date
                        ? new Date(booking.flightId.date).toLocaleDateString()
                        : "N/A"}
                    </TableCell>
                    <TableCell>{booking.seatClass}</TableCell>
                    <TableCell>{booking.cost}</TableCell>
                    <TableCell>{booking.status}</TableCell>
                    <TableCell>{booking.milesEarned}</TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      ) : (
        !loading && (
          <Typography mt={2} variant="body1">
            No booking groups found.
          </Typography>
        )
      )}
    </Box>
  );
};

export default AdminFlights;
