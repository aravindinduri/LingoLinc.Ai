// components/AdvancedSidebar.tsx
import React from 'react';
import { List, ListItem, ListItemText, ListItemButton, Divider, Box, Typography, ListItemIcon } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SchoolIcon from '@mui/icons-material/School';
import BadgeIcon from '@mui/icons-material/Badge';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import { useTheme } from '@mui/material/styles';

interface AdvancedSidebarProps {
  setSection: (section: string) => void;
}

const AdvancedSidebar: React.FC<AdvancedSidebarProps> = ({ setSection }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: 240,
        height: '100vh',
        backgroundColor: theme.palette.background.paper,
        borderRight: `1px solid ${theme.palette.divider}`,
        zIndex: 10,  // Set z-index to 10
      }}
    >
      <Box p={2}>
        <Typography variant="h6" sx={{ mb: 2, fontWeight: 'bold' }}>Menu</Typography>
        <List>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setSection('learn')}>
              <ListItemIcon>
                <HomeIcon />
              </ListItemIcon>
              <ListItemText primary="Learn" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setSection('practice')}>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Practice" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setSection('streaks')}>
              <ListItemIcon>
                <BadgeIcon />
              </ListItemIcon>
              <ListItemText primary="Daily Streaks" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton onClick={() => setSection('profile')}>
              <ListItemIcon>
                <AccountCircleIcon />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </ListItemButton>
          </ListItem>
        </List>
        <Divider sx={{ my: 2 }} />
        <List>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Settings" />
            </ListItemButton>
          </ListItem>
          <ListItem disablePadding>
            <ListItemButton>
              <ListItemText primary="Help" />
            </ListItemButton>
          </ListItem>
        </List>
      </Box>
    </Box>
  );
};

export default AdvancedSidebar;
