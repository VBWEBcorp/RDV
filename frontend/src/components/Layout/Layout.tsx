import React from 'react';
import {
  AppBar,
  Box,
  CssBaseline,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Event as EventIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
} from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const drawerWidth = 240;

interface Props {
  children: React.ReactNode;
}

const menuItems = [
  { text: 'Rendez-vous', icon: <EventIcon />, path: '/' },
  { text: 'Historique', icon: <HistoryIcon />, path: '/history' },
  { text: 'CRM', icon: <PeopleIcon />, path: '/crm' },
  { text: 'Statistiques', icon: <BarChartIcon />, path: '/statistics' },
];

export function Layout({ children }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const location = useLocation();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const drawer = (
    <Box sx={{ overflow: 'auto' }}>
      <List sx={{ pt: 2 }}>
        {menuItems.map((item, index) => (
          <motion.div
            key={item.text}
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: index * 0.1 }}
          >
            <ListItem disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path);
                  if (isMobile) {
                    handleDrawerToggle();
                  }
                }}
                sx={{
                  backgroundColor: location.pathname === item.path ? 'rgba(78, 186, 236, 0.08)' : 'transparent',
                  '&:hover': {
                    backgroundColor: 'rgba(78, 186, 236, 0.15)',
                  },
                  borderRadius: 2,
                  mx: 1,
                  my: 0.5,
                  height: '60px',
                  transition: 'all 0.3s ease',
                }}
              >
                <ListItemIcon
                  sx={{
                    color: location.pathname === item.path ? '#4EBAEC' : 'inherit',
                    minWidth: 40,
                    '& .MuiSvgIcon-root': {
                      fontSize: '1.75rem',
                      transition: 'transform 0.3s ease',
                      transform: location.pathname === item.path ? 'scale(1.1)' : 'scale(1)',
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: '1.2rem',
                    fontWeight: location.pathname === item.path ? 600 : 400,
                  }}
                  sx={{
                    color: location.pathname === item.path ? '#4EBAEC' : 'inherit',
                  }}
                />
              </ListItemButton>
            </ListItem>
          </motion.div>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'white',
          boxShadow: 'none',
          borderBottom: '1px solid #e2e8f0',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            backgroundColor: { xs: '#4EBAEC', sm: 'white' },
            borderRadius: { xs: '0 0 32px 32px', sm: 0 },
            boxShadow: {
              xs: '0 8px 32px rgba(78, 186, 236, 0.15)',
              sm: 'none',
            },
            minHeight: { xs: '80px', sm: '64px' },
            transition: 'all 0.3s ease',
            backdropFilter: { xs: 'blur(10px)', sm: 'none' },
            background: {
              xs: 'linear-gradient(135deg, #4EBAEC 0%, #2196F3 100%)',
              sm: 'white',
            },
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{
              mr: 2,
              display: { sm: 'none' },
              color: 'white',
              '& .MuiSvgIcon-root': {
                fontSize: '2.5rem',
                transition: 'transform 0.3s ease',
                transform: mobileOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              },
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
              padding: 1.5,
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            noWrap
            component="div"
            sx={{
              color: { xs: 'white', sm: '#4EBAEC' },
              display: 'block',
              fontSize: { xs: '1.5rem', sm: '1.25rem' },
              fontWeight: 600,
              textShadow: { xs: '0 2px 4px rgba(0,0,0,0.1)', sm: 'none' },
            }}
          >
            Admin RDV
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="nav"
        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
        aria-label="mailbox folders"
      >
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{
            keepMounted: true,
          }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'white',
              borderRight: '1px solid #e2e8f0',
              borderRadius: '0 32px 32px 0',
              boxShadow: '8px 0 32px rgba(0,0,0,0.1)',
            },
          }}
        >
          <Toolbar
            sx={{
              borderBottom: '1px solid rgba(78, 186, 236, 0.1)',
              background: 'linear-gradient(135deg, #4EBAEC 0%, #2196F3 100%)',
              display: 'flex',
              justifyContent: 'space-between',
              minHeight: '80px !important',
              borderRadius: '0 32px 0 0',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '1.5rem',
                textShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            >
              Admin RDV
            </Typography>
            <IconButton
              onClick={handleDrawerToggle}
              sx={{
                color: 'white',
                '&:hover': {
                  backgroundColor: 'rgba(255, 255, 255, 0.1)',
                },
                '& .MuiSvgIcon-root': {
                  transition: 'transform 0.3s ease',
                  transform: 'rotate(90deg)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          </Toolbar>
          {drawer}
        </Drawer>
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: 'white',
              borderRight: '1px solid #e2e8f0',
            },
          }}
          open
        >
          <Toolbar sx={{ borderBottom: '1px solid #e2e8f0' }}>
            <Typography variant="h6" sx={{ color: '#4EBAEC', fontWeight: 600 }}>
              Admin RDV
            </Typography>
          </Toolbar>
          {drawer}
        </Drawer>
      </Box>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: '#f8fafc',
          minHeight: '100vh',
          p: 0,
        }}
      >
        <Toolbar />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          style={{ padding: 0 }}
        >
          {children}
        </motion.div>
      </Box>
    </Box>
  );
}
