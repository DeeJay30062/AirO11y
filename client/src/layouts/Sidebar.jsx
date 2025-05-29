// client/src/layouts/Sidebar.jsx
import { Drawer, List, ListItemButton, ListItemText, IconButton, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloseIcon from '@mui/icons-material/Close';


const navItems = [
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'Book Flights', path: '/book/search' },
  { text: 'Admin Flights', path: '/admin/flights' },
  { text: 'Observability', path: '/o11y' }
];

const Sidebar = ({isOpen, setIsOpen}) => {
  const navigate = useNavigate();

  return (
    <Drawer variant="persistent" 
      open={isOpen} sx={{ width: 240, flexShrink: 0, '& .MuiDrawer-paper': { width: 240, boxSizing: 'border-box' }, }}>
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
        <IconButton onClick={() => setIsOpen(false)}>
          <CloseIcon />
        </IconButton>
      </Box>
      <List >
        {navItems.map((item) => (
          <ListItemButton key={item.text} onClick={() => navigate(item.path)}>
            <ListItemText primary={item.text} />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;
