import React from 'react';
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Divider } from '@mui/material';
import { Dashboard, People, Gavel, Payment, HealthAndSafety } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const menuItems = [
    { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard' },
    { text: 'Vendors', icon: <People />, path: '/vendors' },
    { text: 'Disputes', icon: <Gavel />, path: '/disputes' },
    { text: 'Transactions', icon: <Payment />, path: '/transactions' },
    { text: 'System Health', icon: <HealthAndSafety />, path: '/system-health' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: 240, boxSizing: 'border-box' },
        display: { xs: 'none', sm: 'block' },
      }}
    >
      <List>
        <ListItem>
          <ListItemText primary="Made in Cameroon" primaryTypographyProps={{ variant: 'h6' }} />
        </ListItem>
        <Divider />
        {menuItems.map((item) => (
          <ListItem button key={item.text} onClick={() => navigate(item.path)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;