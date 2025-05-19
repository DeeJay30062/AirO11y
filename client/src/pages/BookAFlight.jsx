// client/src/pages/BookAFlight.jsx
import { Outlet } from 'react-router-dom';
import { Box, Typography } from '@mui/material';

const BookAFlight = () => {
  return (
    <Box sx={{ p: 2 }}>
      <Typography variant="h4" gutterBottom>Book A Flight</Typography>
      <Outlet />
    </Box>
  );
};

export default BookAFlight;
