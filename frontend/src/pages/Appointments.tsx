import React from 'react';
import { Box, Typography, Grid, Stack, Fab, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Container, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useApp } from '../context/AppContext';
import { Calendar } from '../components/Calendar';
import { AppointmentForm } from '../components/AppointmentForm';
import { CalendarMonth, ViewList, Edit } from '@mui/icons-material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { v4 as uuidv4 } from 'uuid';
import { Appointment } from '../types/appointment';

export function Appointments() {
  const { appointments, addAppointment, updateAppointment } = useApp();
  const [showForm, setShowForm] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | undefined>(undefined);
  const [viewMode, setViewMode] = React.useState<'calendar' | 'list'>('calendar'); // 'calendar' ou 'list'

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
    setSelectedAppointment(undefined);
  };

  const handleViewModeChange = (_: React.MouseEvent<HTMLElement>, newMode: 'calendar' | 'list') => {
    if (newMode !== null) {
      setViewMode(newMode);
    }
  };

  const getAppointmentTypeColor = (type: Appointment['type']) => {
    switch (type) {
      case 'video':
        return 'primary';
      case 'physique':
        return 'success';
      case 'telephone':
        return 'warning';
      default:
        return 'default';
    }
  };

  const getAppointmentTypeLabel = (type: Appointment['type']) => {
    switch (type) {
      case 'video':
        return 'Vidéo';
      case 'physique':
        return 'Physique';
      case 'telephone':
        return 'Téléphone';
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
        p: { xs: 0, sm: 3, md: 4 },
        minHeight: '100vh',
        backgroundColor: '#f8fafc',
      }}
    >
      <Container 
        maxWidth="lg" 
        disableGutters={true}
        sx={{ 
          mx: 'auto',
          px: { xs: 0, sm: 2 },
        }}
      >
          <Box sx={{
            maxWidth: '800px',
            mx: 'auto',
            width: '100%',
          }}>
            <Typography 
              variant="h4" 
              component="h1" 
              sx={{
                mb: 4,
                color: '#4EBAEC',
                fontWeight: 600,
                textAlign: 'center',
              }}
            >
              Gestion des Rendez-vous
            </Typography>

            <Box sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              width: '100%',
              mb: 4,
            }}>
              <ToggleButtonGroup
                value={viewMode}
                exclusive
                onChange={handleViewModeChange}
                aria-label="view mode"
                sx={{
                  mb: 3,
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
            </Box>

            <Box sx={{
              width: '100%',
              backgroundColor: 'white',
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              overflow: 'hidden',
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
              setSelectedAppointment(undefined);
            }}
            initialData={selectedAppointment}
          />
        )}

        <Fab
          color="primary"
          aria-label="add"
          onClick={() => {
            setSelectedAppointment(undefined);
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
