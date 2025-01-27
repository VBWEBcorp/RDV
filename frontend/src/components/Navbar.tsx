import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Box, Button, Stack } from '@mui/material';
import {
  CalendarMonth as CalendarIcon,
  History as HistoryIcon,
  People as PeopleIcon,
  BarChart as StatsIcon
} from '@mui/icons-material';

export function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: '/', label: 'Rendez-vous', icon: <CalendarIcon /> },
    { path: '/historique', label: 'Historique', icon: <HistoryIcon /> },
    { path: '/crm', label: 'CRM', icon: <PeopleIcon /> },
    { path: '/statistiques', label: 'Statistiques', icon: <StatsIcon /> },
  ];

  return (
    <Box 
      component="nav" 
      sx={{ 
        py: 2,
        px: 3,
        borderBottom: '1px solid #e2e8f0',
        background: '#fff',
      }}
    >
      <Stack 
        direction="row" 
        spacing={1}
        sx={{
          '& .MuiButton-root': {
            borderRadius: 2,
            px: 2,
            py: 1,
            textTransform: 'none',
            fontWeight: 500,
            color: 'text.secondary',
            '&:hover': {
              backgroundColor: 'rgba(78,186,236,0.05)',
            },
            '&.active': {
              color: '#4EBAEC',
              backgroundColor: 'rgba(78,186,236,0.1)',
            }
          }
        }}
      >
        {navItems.map(({ path, label, icon }) => (
          <Button
            key={path}
            component={Link}
            to={path}
            className={isActive(path) ? 'active' : ''}
            startIcon={icon}
          >
            {label}
          </Button>
        ))}
      </Stack>
    </Box>
  );
}
