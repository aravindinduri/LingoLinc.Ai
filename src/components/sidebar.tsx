"use client";

import { Box, Drawer, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import StreakIcon from '@mui/icons-material/AccessTime';
import PracticeIcon from '@mui/icons-material/WorkOutline';

interface SideBarProps {
  setActiveSection: (section: string) => void;
}

const drawerWidth = 240;

const SideBar: React.FC<SideBarProps> = ({ setActiveSection }) => {
  return (
    <Drawer
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#333',
          color: '#fff',
          borderTop: '1px solid #444',
        },
      }}
      variant="permanent"
      anchor="bottom"
    >
      <Box sx={{ overflow: 'auto' }}>
        <List>
          <ListItem button onClick={() => setActiveSection('learn')}>
            <ListItemIcon><SchoolIcon sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Learn" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('streaks')}>
            <ListItemIcon><StreakIcon sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Daily Streaks" />
          </ListItem>
          <ListItem button onClick={() => setActiveSection('practice')}>
            <ListItemIcon><PracticeIcon sx={{ color: '#fff' }} /></ListItemIcon>
            <ListItemText primary="Practice" />
          </ListItem>
        </List>
      </Box>
    </Drawer>
  );
};

export default SideBar;
