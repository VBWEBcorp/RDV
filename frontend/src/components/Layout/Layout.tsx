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
          backgroundColor: '#F8FAFC',
          boxShadow: 'none',
          borderBottom: '1px solid rgba(0,0,0,0.05)',
        }}
      >
        <Toolbar
          sx={{
            display: 'flex',
            justifyContent: { xs: 'space-between', sm: 'flex-start' },
            backgroundColor: '#F8FAFC',
            minHeight: { xs: '64px', sm: '64px' },
            transition: 'all 0.3s ease',
            backdropFilter: { xs: 'blur(10px)', sm: 'none' },
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
              backgroundColor: '#4EBAEC',
              '& .MuiSvgIcon-root': {
                fontSize: '2rem',
                transition: 'transform 0.3s ease',
                transform: mobileOpen ? 'rotate(90deg)' : 'rotate(0deg)',
              },
              '&:hover': {
                backgroundColor: '#2196F3',
              },
              padding: 1.2,
              borderRadius: '12px',
              boxShadow: '0 4px 12px rgba(78, 186, 236, 0.2)',
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
              borderRight: 'none',
              borderRadius: '0 24px 24px 0',
              boxShadow: '4px 0 24px rgba(0, 0, 0, 0.1)',
            },
          }}
        >
          <Box
            sx={{
              background: 'linear-gradient(135deg, #4EBAEC 0%, #2196F3 100%)',
              p: 2,
              borderRadius: '0 24px 0 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              mb: 1,
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: 'white',
                fontWeight: 600,
                fontSize: '1.3rem',
                textShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
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
              }}
            >
              <MenuIcon />
            </IconButton>
          </Box>
          <List sx={{ px: 2 }}>
            {menuItems.map((item, index) => (
              <motion.div
                key={item.text}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                <ListItem disablePadding sx={{ mb: 1 }}>
                  <ListItemButton
                    onClick={() => {
                      navigate(item.path);
                      handleDrawerToggle();
                    }}
                    sx={{
                      backgroundColor: location.pathname === item.path
                        ? 'rgba(78, 186, 236, 0.1)'
                        : 'transparent',
                      borderRadius: '12px',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        backgroundColor: 'rgba(78, 186, 236, 0.15)',
                        transform: 'translateX(4px)',
                      },
                      height: '56px',
                      position: 'relative',
                      overflow: 'hidden',
                      '&::before': location.pathname === item.path ? {
                        content: '""',
                        position: 'absolute',
                        left: 0,
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '4px',
                        height: '60%',
                        backgroundColor: '#4EBAEC',
                        borderRadius: '0 4px 4px 0',
                      } : {},
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        color: location.pathname === item.path ? '#4EBAEC' : '#666',
                        minWidth: 40,
                        '& .MuiSvgIcon-root': {
                          fontSize: '1.5rem',
                          transition: 'transform 0.2s ease',
                        },
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.text}
                      primaryTypographyProps={{
                        fontSize: '1rem',
                        fontWeight: location.pathname === item.path ? 600 : 400,
                        color: location.pathname === item.path ? '#4EBAEC' : '#333',
                      }}
                    />
                  </ListItemButton>
                </ListItem>
              </motion.div>
            ))}
          </List>
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
