"use client";

import React, { useState } from 'react';
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
import { 
  Book, 
  PenTool, 
  Activity, 
  User
} from 'lucide-react';

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

  const sidebarStyle = {
    background: '#092b46', 
    color: 'white',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  };

  const listItemStyle = (isActive: boolean) => ({
    margin: '8px 16px',
    borderRadius: '8px',
    transition: 'all 0.3s ease',
    backgroundColor: isActive ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.05)',
    },
  });

  const iconStyle = (isActive: boolean) => ({
    color: isActive ? '#3498db' : 'white',
    transition: 'all 0.3s ease',
  });

  const navItems = [
    { id: 'learn', icon: Book, label: 'Learn' },
    { id: 'practice', icon: PenTool, label: 'Practice' },
    { id: 'streaks', icon: Activity, label: 'Streaks' },
    { id: 'profile', icon: User, label: 'Profile' },
  ];

  return isMobile ? (
    <BottomNavigation
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
        height: '64px',
        ...sidebarStyle,
      }}
    >
      {navItems.map((item) => (
        <BottomNavigationAction
          key={item.id}
          value={item.id}
          icon={<item.icon size={24} style={iconStyle(value === item.id)} />}
          sx={{ 
            color: 'white',
            '&.Mui-selected': {
              color: '#3498db',
            }
          }}
        />
      ))}
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
          ...sidebarStyle,
          marginTop: '64px',
          zIndex: 10
        }
      }}
    >
      <List>
        {navItems.map((item) => (
          <ListItem
            button
            key={item.id}
            onClick={() => handleListItemClick(item.id)}
            sx={listItemStyle(value === item.id)}
          >
            <ListItemIcon sx={{ minWidth: '40px' }}>
              <item.icon size={24} style={iconStyle(value === item.id)} className=' -mt-[10px]' />
            </ListItemIcon>
            <ListItemText 
              primary={item.label} 
              sx={{ 
                '& .MuiListItemText-primary': { 
                  fontWeight: value === item.id ? 'bold' : 'normal',
                  fontSize: '16px',
                  color: value === item.id ? '#3498db' : 'white',
                } 
              }} 
            />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
};

export default Sidebar;