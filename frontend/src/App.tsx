import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { fr } from 'date-fns/locale';
import { Navigation } from './components/Navigation';
import { theme } from './theme';
import { AppProvider } from './context/AppContext';
import { Appointments } from './pages/Appointments';
import { History } from './pages/History';
import { CRM } from './pages/CRM';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={fr}>
        <AppProvider>
          <Router>
            <div style={{ display: 'flex', minHeight: '100vh' }}>
              <Navigation />
              <Routes>
                <Route path="/" element={<Appointments />} />
                <Route path="/historique" element={<History />} />
                <Route path="/crm" element={<CRM />} />
              </Routes>
            </div>
          </Router>
        </AppProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
