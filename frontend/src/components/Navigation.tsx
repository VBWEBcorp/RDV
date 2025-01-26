import React, { useState } from 'react';
import {
  AppBar,
  Box,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  People as PeopleIcon,
} from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export function Navigation() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { text: 'Agenda', icon: <CalendarIcon />, path: '/' },
    { text: 'Historique', icon: <HistoryIcon />, path: '/historique' },
    { text: 'CRM', icon: <PeopleIcon />, path: '/crm' },
  ];

  const drawer = (
    <Box sx={{ 
      height: '100%',
      background: 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)',
    }}>
      <Box sx={{ 
        p: 2, 
        display: 'flex', 
        alignItems: 'center',
        borderBottom: '1px solid rgba(0, 0, 0, 0.08)',
        background: 'linear-gradient(45deg, #2196f3 30%, #90caf9 90%)',
      }}>
        <Typography 
          variant="h6" 
          sx={{ 
            color: 'white',
            fontWeight: 600,
            textShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          Admin RDV
        </Typography>
      </Box>
      <List sx={{ p: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            onClick={() => {
              navigate(item.path);
              if (isMobile) setMobileOpen(false);
            }}
            sx={{
              mb: 1,
              borderRadius: 2,
              backgroundColor: location.pathname === item.path ? 'rgba(33, 150, 243, 0.08)' : 'transparent',
              color: location.pathname === item.path ? '#2196f3' : 'text.primary',
              '&:hover': {
                backgroundColor: 'rgba(33, 150, 243, 0.12)',
              },
              transition: 'all 0.2s ease-in-out',
            }}
          >
            <ListItemIcon sx={{ 
              color: location.pathname === item.path ? '#2196f3' : 'text.primary',
              minWidth: 40,
            }}>
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                sx: { 
                  fontWeight: location.pathname === item.path ? 600 : 400,
                }
              }}
            />
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <AppBar
        position="fixed"
        sx={{
          display: { md: 'none' },
          backgroundColor: 'white',
          boxShadow: '0 2px 12px 0 rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar>
          <IconButton
            color="primary"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography 
            variant="h6" 
            sx={{ 
              background: 'linear-gradient(45deg, #2196f3 30%, #90caf9 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 600,
            }}
          >
            Admin RDV
          </Typography>
        </Toolbar>
      </AppBar>

      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile
          }}
          sx={{
            display: { xs: 'block', md: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
              border: 'none',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', md: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              boxShadow: '4px 0 24px rgba(0,0,0,0.05)',
              border: 'none',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Toolbar spacer for mobile */}
      <Box
        component="div"
        sx={{
          display: { xs: 'block', md: 'none' },
          ...theme.mixins.toolbar,
        }}
      />
    </>
  );
}
