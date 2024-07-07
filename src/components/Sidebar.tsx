// components/Sidebar.tsx
import {
  BottomNavigation,
  BottomNavigationAction,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme
} from '@mui/material';

import TrendingUpRoundedIcon from '@mui/icons-material/TrendingUpRounded';
import RestartAltRoundedIcon from '@mui/icons-material/RestartAltRounded';
import WhatshotRoundedIcon from '@mui/icons-material/WhatshotRounded';
import AccountCircleRoundedIcon from '@mui/icons-material/AccountCircleRounded';
import React, { useState } from 'react';

interface SidebarProps {
  setSection: React.Dispatch<React.SetStateAction<string>>;
}

const Sidebar: React.FC<SidebarProps> = ({ setSection }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [value, setValue] = useState('learn');

  const handleListItemClick = (section: string) => {
    setSection(section);
    setValue(section);
  };

  return isMobile ? (
    <BottomNavigation
      showLabels
      value={value}
      onChange={(event, newValue) => {
        handleListItemClick(newValue);
      }}
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1100,
        bgcolor: '#1F2937'
      }}
    >
      <BottomNavigationAction
        label=""
        value="learn"
        icon={<TrendingUpRoundedIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
      />
      <BottomNavigationAction
        label=""
        value="practice"
        icon={<RestartAltRoundedIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
      />
      <BottomNavigationAction
        label=""
        value="streaks"
        icon={<WhatshotRoundedIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
      />
      <BottomNavigationAction
        label=""
        value="profile"
        icon={<AccountCircleRoundedIcon style={{ color: 'white' }} />}
        sx={{ color: 'white' }}
      />
    </BottomNavigation>
  ) : (
    <Drawer
      variant="permanent"
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
          boxSizing: 'border-box',
          bgcolor: '#1F2937',
          marginTop: '64px', // Adjust to ensure it does not overlap the navbar
          zIndex: 10 // Ensure sidebar is below the navbar
        }
      }}
    >
      <div className="flex flex-col h-full">
        <List>
          <ListItem button onClick={() => handleListItemClick('learn')}>
            <ListItemIcon>
              <TrendingUpRoundedIcon style={{ color: 'white',fontSize:'30px' }} />
            </ListItemIcon>
            <ListItemText primary="Learn" sx={{ color: 'white' }} />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('practice')}>
            <ListItemIcon>
              <RestartAltRoundedIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Practice" sx={{ color: 'white' }} />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('streaks')}>
            <ListItemIcon>
              <WhatshotRoundedIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Daily Streaks" sx={{ color: 'white' }} />
          </ListItem>
          <ListItem button onClick={() => handleListItemClick('profile')}>
            <ListItemIcon>
              <AccountCircleRoundedIcon style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Profile" sx={{ color: 'white' }} />
          </ListItem>
        </List>
      </div>
    </Drawer>
  );
};

export default Sidebar;
