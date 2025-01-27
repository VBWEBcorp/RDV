import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Fab, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Container, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../context/AppContext';
import { Calendar } from '../components/Calendar';
import { AppointmentForm } from '../components/AppointmentForm';
import { CalendarMonth, ViewList, Edit, NoteAdd } from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import { Appointment } from '../types';

export function Appointments() {
  const { appointments, addAppointment, updateAppointment } = useApp();
  const [showForm, setShowForm] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [viewMode, setViewMode] = React.useState('calendar'); // 'calendar' ou 'list'

  const futureAppointments = React.useMemo(() => {
    return appointments
      .filter(apt => new Date(apt.date) > new Date())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [appointments]);

  const todayAppointments = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && aptDate < tomorrow;
    });
  }, [appointments]);

  const weekAppointments = React.useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(today);
    endOfWeek.setDate(endOfWeek.getDate() + 7);

    return appointments.filter(apt => {
      const aptDate = new Date(apt.date);
      return aptDate >= today && aptDate < endOfWeek;
    });
  }, [appointments]);

  const handleSelectEvent = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowForm(true);
  };

  const handleSubmit = async (appointmentData: Omit<Appointment, 'id'>) => {
    if (selectedAppointment) {
      // Mise à jour d'un rendez-vous existant
      updateAppointment(selectedAppointment.id, {
        ...appointmentData,
        id: selectedAppointment.id,
      });
    } else {
      // Création d'un nouveau rendez-vous
      addAppointment({
        ...appointmentData,
        id: uuidv4(),
      });
    }
    setShowForm(false);
    setSelectedAppointment(null);
  };

  const handleViewModeChange = (event, newMode) => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const getAppointmentTypeColor = (type) => {
    switch (type) {
      case 'physical':
        return '#4caf50';
      case 'phone':
        return '#ff9800';
      case 'video':
        return '#4EBAEC';
      default:
        return '#9e9e9e';
    }
  };

  const getAppointmentTypeLabel = (type) => {
    switch (type) {
      case 'physical':
        return 'Physique';
      case 'phone':
        return 'Téléphone';
      case 'video':
        return 'Vidéo';
      default:
        return type;
    }
  };

  const getProfileIcon = (profile: string) => {
    switch (profile) {
      case 'lead':
        return '🎯';
      case 'prospect':
        return '🌱';
      case 'client':
        return '⭐';
      case 'staff':
        return '👥';
      case 'partenaire':
        return '🤝';
      default:
        return '';
    }
  };

  return (
    <Box 
      component="main" 
      sx={{ 
        p: { xs: 0, sm: 2, md: 3 },
        minHeight: '100vh',
      }}
    >
      <Container 
        maxWidth="lg" 
        sx={{ 
          p: { xs: 0, sm: 2, md: 3 },
          mx: 'auto',
        }}
      >
        <Typography 
          variant="h4" 
          component="h1" 
          sx={{
            mb: 4,
            color: '#4EBAEC',
            fontWeight: 600,
            px: { xs: 2, sm: 0 },
            pt: { xs: 2, sm: 0 },
            textAlign: { xs: 'left', sm: 'center' },
          }}
        >
          Gestion des Rendez-vous
        </Typography>

        <Box sx={{ 
          px: { xs: 2, sm: 0 },
          display: 'flex',
          flexDirection: 'column',
          alignItems: { xs: 'stretch', sm: 'center' },
        }}>
          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            sx={{
              mb: 3,
              alignSelf: { xs: 'stretch', sm: 'center' },
              '& .MuiToggleButton-root': {
                px: 3,
                py: 1,
              },
            }}
          >
            <ToggleButton value="calendar" aria-label="calendar view">
              <CalendarMonth sx={{ mr: 1 }} /> Calendrier
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewList sx={{ mr: 1 }} /> Liste
            </ToggleButton>
          </ToggleButtonGroup>

          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  AUJOURD'HUI
                </Typography>
                <Typography variant="h3" component="div" color="text.primary">
                  {todayAppointments.length}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  CETTE SEMAINE
                </Typography>
                <Typography variant="h3" component="div" color="text.primary">
                  {weekAppointments.length}
                </Typography>
              </Paper>
            </Grid>
            
            <Grid item xs={12} sm={6} md={4}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  height: '100%',
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  textAlign: 'center',
                }}
              >
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  TOTAL À VENIR
                </Typography>
                <Typography variant="h3" component="div" color="text.primary">
                  {futureAppointments.length}
                </Typography>
              </Paper>
            </Grid>
          </Grid>

          <Box sx={{ 
            mt: 4,
            width: '100%',
            maxWidth: viewMode === 'calendar' ? 'none' : 'lg',
            mx: 'auto',
          }}>
            {viewMode === 'calendar' ? (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                }}
              >
                <Calendar appointments={appointments} onSelectEvent={handleSelectEvent} />
              </Paper>
            ) : (
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 2, sm: 3 },
                  background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                  border: '1px solid #e2e8f0',
                  borderRadius: 2,
                }}
              >
                <List sx={{ 
                  bgcolor: 'background.paper',
                  borderRadius: 2,
                  boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                }}>
                  {futureAppointments.map((appointment) => (
                    <ListItem
                      key={appointment.id}
                      sx={{
                        borderBottom: '1px solid rgba(0,0,0,0.05)',
                        '&:last-child': {
                          borderBottom: 'none',
                        },
                        py: 2,
                      }}
                    >
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                            <Typography variant="subtitle1" fontWeight="600">
                              {format(new Date(appointment.date), 'EEEE d MMMM yyyy', { locale: fr })}
                            </Typography>
                            <Chip
                              label={getAppointmentTypeLabel(appointment.type)}
                              size="small"
                              sx={{
                                backgroundColor: getAppointmentTypeColor(appointment.type),
                                color: 'white',
                                fontWeight: 500,
                              }}
                            />
                          </Box>
                        }
                        secondary={
                          <Stack spacing={1}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                              <Typography variant="body1" color="text.primary" sx={{ fontWeight: 500 }}>
                                {format(new Date(appointment.date), 'HH:mm')} ({appointment.duree} min)
                              </Typography>
                              <Typography variant="body1" color="text.primary" sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 1
                              }}>
                                {getProfileIcon(appointment.profile)} {appointment.nom} {appointment.prenom}
                              </Typography>
                            </Box>
                            
                            <Stack direction="row" spacing={2} sx={{ color: 'text.secondary' }}>
                              {appointment.telephone && (
                                <Typography variant="body2" component="span">
                                  📱 {appointment.telephone}
                                </Typography>
                              )}
                              {appointment.email && (
                                <Typography variant="body2" component="span">
                                  ✉️ {appointment.email}
                                </Typography>
                              )}
                            </Stack>

                            {appointment.location && (
                              <Typography variant="body2" color="text.secondary">
                                📍 {appointment.location}
                              </Typography>
                            )}
                            
                            {appointment.type === 'video' && appointment.meetLink && (
                              <Typography variant="body2" color="text.secondary" sx={{ 
                                display: 'flex',
                                alignItems: 'center',
                                gap: 0.5,
                                '& a': {
                                  color: '#4EBAEC',
                                  textDecoration: 'none',
                                  '&:hover': {
                                    textDecoration: 'underline'
                                  }
                                }
                              }}>
                                🎥 <a href={appointment.meetLink} target="_blank" rel="noopener noreferrer">
                                  Rejoindre la visioconférence
                                </a>
                              </Typography>
                            )}

                            {appointment.notes && (
                              <Typography 
                                variant="body2" 
                                color="text.secondary"
                                sx={{
                                  mt: 1,
                                  p: 1.5,
                                  backgroundColor: 'rgba(0,0,0,0.02)',
                                  borderRadius: 1,
                                  borderLeft: '3px solid #4EBAEC'
                                }}
                              >
                                📝 {appointment.notes}
                              </Typography>
                            )}
                          </Stack>
                        }
                      />
                      <ListItemSecondaryAction>
                        <IconButton 
                          onClick={() => handleSelectEvent(appointment)}
                          sx={{ color: '#4EBAEC' }}
                        >
                          <Edit />
                        </IconButton>
                      </ListItemSecondaryAction>
                    </ListItem>
                  ))}
                  {futureAppointments.length === 0 && (
                    <ListItem>
                      <ListItemText
                        primary={
                          <Typography variant="body1" color="text.secondary" sx={{ textAlign: 'center', py: 4 }}>
                            Aucun rendez-vous à venir
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}
                </List>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>

      {showForm && (
        <AppointmentForm
          onSubmit={handleSubmit}
          onCancel={() => {
            setShowForm(false);
            setSelectedAppointment(null);
          }}
          initialData={selectedAppointment}
        />
      )}

      <Fab
        color="primary"
        aria-label="add"
        onClick={() => {
          setSelectedAppointment(null);
          setShowForm(true);
        }}
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
          backgroundColor: '#4EBAEC',
          '&:hover': {
            backgroundColor: '#3A9BC8',
          },
        }}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
}
