// client/src/layouts/Topbar.jsx
import { AppBar, Toolbar, Typography, IconButton, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Topbar = ({isSidebarOpen, setIsSidebarOpen}) => {
  return (
    <AppBar position="static" elevation={1}>
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {!isSidebarOpen && (
            <IconButton color="inherit" onClick={() => setIsSidebarOpen(true)} edge="start" sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
        <Typography variant="h6">AirO11y</Typography>
        </Box>
        <IconButton color="inherit">
          <AccountCircleIcon />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
};

export default Topbar;
