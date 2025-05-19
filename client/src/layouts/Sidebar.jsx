// client/src/layouts/Sidebar.jsx
import { Drawer, List, ListItemButton, ListItemText } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const navItems = [
  { text: 'Dashboard', path: '/dashboard' },
  { text: 'Search Flights', path: '/search' },
  { text: 'Admin Flights', path: '/admin/flights' },
  { text: 'Observability', path: '/o11y' }
];

const Sidebar = () => {
  const navigate = useNavigate();

  return (
    <Drawer variant="permanent" sx={{ width: 240, flexShrink: 0 }}>
      <List sx={{ width: 240 }}>
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
