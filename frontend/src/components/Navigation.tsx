import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  IconButton,
  useTheme,
  useMediaQuery,
  Typography,
  Divider,
} from '@mui/material';
import {
  Menu as MenuIcon,
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  BarChart as StatsIcon,
} from '@mui/icons-material';

const drawerWidth = 240;

export function Navigation() {
  const location = useLocation();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const menuItems = [
    { path: '/', label: 'Rendez-vous', icon: <CalendarIcon /> },
    { path: '/historique', label: 'Historique', icon: <HistoryIcon /> },
    { path: '/crm', label: 'CRM', icon: <PeopleIcon /> },
    { path: '/statistiques', label: 'Statistiques', icon: <StatsIcon /> },
  ];

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <Box
        sx={{
          p: 3,
          textAlign: 'center',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            background: 'linear-gradient(45deg, #4EBAEC 30%, #7CCBF1 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          ADMIN VBWEB
        </Typography>
      </Box>
      <List>
        {menuItems.map(({ path, label, icon }) => (
          <ListItem key={path} disablePadding>
            <ListItemButton
              component={Link}
              to={path}
              selected={location.pathname === path}
              sx={{
                '&.Mui-selected': {
                  backgroundColor: 'rgba(78,186,236,0.1)',
                  color: '#4EBAEC',
                  '&:hover': {
                    backgroundColor: 'rgba(78,186,236,0.2)',
                  },
                  '& .MuiListItemIcon-root': {
                    color: '#4EBAEC',
                  },
                },
                '&:hover': {
                  backgroundColor: 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 40,
                  color: location.pathname === path ? '#4EBAEC' : 'inherit',
                }}
              >
                {icon}
              </ListItemIcon>
              <ListItemText 
                primary={label}
                sx={{
                  '& .MuiTypography-root': {
                    fontWeight: location.pathname === path ? 600 : 400,
                  },
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <>
      <IconButton
        color="inherit"
        aria-label="open drawer"
        edge="start"
        onClick={handleDrawerToggle}
        sx={{
          position: 'fixed',
          top: 16,
          left: 16,
          zIndex: 1200,
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          '&:hover': {
            backgroundColor: '#f8fafc',
          },
          display: { sm: 'none' },
        }}
      >
        <MenuIcon />
      </IconButton>

      <Box
        component="nav"
        sx={{
          width: { sm: drawerWidth },
          flexShrink: { sm: 0 },
        }}
      >
        {/* Mobile drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true, // Better open performance on mobile.
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#fff',
              borderRight: '1px solid #e2e8f0',
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: '#fff',
              borderRight: '1px solid #e2e8f0',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>
    </>
  );
}
