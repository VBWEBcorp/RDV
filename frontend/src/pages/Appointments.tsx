import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Fab } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../context/AppContext';
import { Calendar } from '../components/Calendar';
import { AppointmentForm } from '../components/AppointmentForm';

export function Appointments() {
  const { appointments } = useApp();
  const [showForm, setShowForm] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState(null);

  const futureAppointments = React.useMemo(() => {
    return appointments
      .filter(apt => new Date(apt.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments]);

  const handleSelectEvent = (appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleSubmit = async (appointmentData) => {
    setShowForm(false);
    setSelectedAppointment(null);
  };

  return (
    <Box sx={{ p: 3, width: '100%' }}>
      <Box sx={{ 
        mb: 4,
        mt: { xs: 8, sm: 2 }
      }}>
        <Typography 
          variant="h4" 
          component="h1" 
          gutterBottom 
          fontWeight="600"
          sx={{
            background: 'linear-gradient(45deg, #2196f3 30%, #90caf9 90%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            mb: { xs: 3, sm: 4 },
            fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
            pt: { xs: 2, sm: 0 }
          }}
        >
          Rendez-vous à venir
        </Typography>

        <Grid container spacing={2} sx={{ mb: { xs: 3, sm: 4 } }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #2196f3, #90caf9)',
              }
            }}>
              <CardContent>
                <Typography color="text.secondary" variant="overline" sx={{ letterSpacing: 1 }}>
                  Total
                </Typography>
                <Typography variant="h3" component="div" fontWeight="600" sx={{ 
                  color: '#2196f3',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}>
                  {futureAppointments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ 
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              position: 'relative',
              overflow: 'hidden',
              '&::before': {
                content: '""',
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '4px',
                background: 'linear-gradient(90deg, #42a5f5, #90caf9)',
              }
            }}>
              <CardContent>
                <Typography color="text.secondary" variant="overline" sx={{ letterSpacing: 1 }}>
                  Dans 24h
                </Typography>
                <Typography variant="h3" component="div" fontWeight="600" sx={{ 
                  color: '#42a5f5',
                  fontSize: { xs: '2rem', sm: '2.5rem', md: '3rem' }
                }}>
                  {futureAppointments.filter(apt => {
                    const timeDiff = new Date(apt.date).getTime() - new Date().getTime();
                    return timeDiff / (1000 * 60 * 60) <= 24;
                  }).length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="flex-end"
          sx={{ mb: 3 }}
        >
          <Typography variant="body2" color="text.secondary" sx={{ mr: 'auto' }}>
            Vue de la semaine
          </Typography>
        </Stack>
      </Box>

      <Calendar 
        appointments={futureAppointments}
        onSelectEvent={handleSelectEvent}
      />

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => setShowForm(true)}
        sx={{
          position: 'fixed',
          bottom: 16,
          right: 16,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.1)',
          },
        }}
      >
        <AddIcon />
      </Fab>

      {showForm && (
        <AppointmentForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedAppointment(null);
          }}
          initialData={selectedAppointment || undefined}
        />
      )}
    </Box>
  );
}
