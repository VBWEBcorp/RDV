import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { Navigation } from './components/Navigation';
import { PageTransition } from './components/PageTransition';
import { AppProvider } from './context/AppContext';
import { Appointments } from './pages/Appointments';
import { History } from './pages/History';
import { CRM } from './pages/CRM';
import { Statistics } from './pages/Statistics';
import { theme } from './theme';
import { AnimatePresence } from 'framer-motion';

const drawerWidth = 240;

function AppContent() {
  const location = useLocation();

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      <CssBaseline />
      <Navigation />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, md: 3 },
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          backgroundColor: 'background.default',
          minHeight: '100vh',
          overflow: 'hidden',
        }}
      >
        <AnimatePresence mode="wait">
          <PageTransition key={location.pathname}>
            <Routes location={location} key={location.pathname}>
              <Route path="/" element={<Appointments />} />
              <Route path="/historique" element={<History />} />
              <Route path="/crm" element={<CRM />} />
              <Route path="/statistiques" element={<Statistics />} />
            </Routes>
          </PageTransition>
        </AnimatePresence>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <Router>
          <AppProvider>
            <AppContent />
          </AppProvider>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
