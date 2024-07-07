// components/MainContent.tsx
"use client";

import React, { useState } from 'react';
import Box from '@mui/material/Box';
import CssBaseline from '@mui/material/CssBaseline';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import AdvancedSidebar from './Sidebar';
import Toolbar from '@mui/material/Toolbar';

const drawerWidth = 240;

const MainContent: React.FC = () => {
  const [section, setSection] = useState<string>('learn');
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const renderSection = () => {
    switch (section) {
      case 'learn':
        return <div>Learn Section</div>;
      case 'practice':
        return <div>Practice Section</div>;
      case 'streaks':
        return <div>Daily Streaks Section</div>;
      case 'profile':
        return <div>Profile Section</div>;
      default:
        return <div>Learn Section</div>;
    }
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{ 
          width: { sm: drawerWidth }, 
          flexShrink: { sm: 0 },
          zIndex: 10,  // Set z-index to 10
          position: 'relative',  // Ensure correct stacking context
        }}
        aria-label="sections"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
        >
          <AdvancedSidebar setSection={setSection} />
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
          }}
          open
        >
          <AdvancedSidebar setSection={setSection} />
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          ml: { sm: `${drawerWidth}px` },  // Adjust main content padding based on sidebar width
          mt: 8,  // Add margin top to account for the height of the AppBar (Navbar)
        }}
      >
        <Toolbar />
        {/* Mobile menu button */}
        <IconButton
          color="inherit"
          aria-label="open drawer"
          edge="start"
          onClick={handleDrawerToggle}
          sx={{ display: { sm: 'none' }, position: 'absolute', top: 8, left: 16 }}
        >
          <MenuIcon />
        </IconButton>
        {renderSection()}
      </Box>
    </Box>
  );
};

export default MainContent;
