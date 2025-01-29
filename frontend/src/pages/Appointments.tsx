import React from 'react';
import { Box, Typography, Grid, Card, CardContent, Stack, Fab, ToggleButtonGroup, ToggleButton, List, ListItem, ListItemText, ListItemSecondaryAction, IconButton, Chip, Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Paper, Link } from '@mui/material';
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

  const getTypeColor = (type) => {
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

  const getProfileLabel = (profile: string) => {
    switch (profile) {
      case 'lead':
        return { icon: '🎯', label: 'Lead' };
      case 'prospect':
        return { icon: '🌱', label: 'Prospect' };
      case 'client':
        return { icon: '⭐', label: 'Client' };
      case 'staff':
        return { icon: '👥', label: 'Staff' };
      case 'partenaire':
        return { icon: '🤝', label: 'Partenaire' };
      default:
        return { icon: '', label: profile };
    }
  };

  return (
    <Box 
      component="main" 
      sx={{ 
        p: { xs: 0, sm: 3 },
        minHeight: '100vh',
      }}
    >
      <Box sx={{ 
        mb: 4,
        mt: { xs: 8, sm: 2 },
        px: { xs: 2, sm: 0 },
        pt: { xs: 2, sm: 0 },
      }}>
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 2,
          mb: 3
        }}>
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{
              mb: 4,
              color: '#4EBAEC',
              fontWeight: 600,
            }}
          >
            Gestion des Rendez-vous
          </Typography>

          <ToggleButtonGroup
            value={viewMode}
            exclusive
            onChange={handleViewModeChange}
            aria-label="view mode"
            size="small"
            sx={{
              '& .MuiToggleButton-root': {
                border: '1px solid rgba(78,186,236,0.5)',
                color: '#4EBAEC',
                '&.Mui-selected': {
                  backgroundColor: 'rgba(78,186,236,0.1)',
                  color: '#4EBAEC',
                  '&:hover': {
                    backgroundColor: 'rgba(78,186,236,0.2)',
                  }
                },
                '&:hover': {
                  backgroundColor: 'rgba(78,186,236,0.05)',
                }
              }
            }}
          >
            <ToggleButton value="calendar" aria-label="calendar view">
              <CalendarMonth />
            </ToggleButton>
            <ToggleButton value="list" aria-label="list view">
              <ViewList />
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              borderRadius: '12px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography 
                  color="text.secondary" 
                  variant="caption" 
                  sx={{ 
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    color: '#94A3B8'
                  }}
                >
                  Aujourd'hui
                </Typography>
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    color: '#4EBAEC',
                    fontSize: '2rem',
                    fontWeight: 500,
                    mt: 0.5
                  }}
                >
                  {todayAppointments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              borderRadius: '12px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography 
                  color="text.secondary" 
                  variant="caption" 
                  sx={{ 
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    color: '#94A3B8'
                  }}
                >
                  Cette semaine
                </Typography>
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    color: '#4EBAEC',
                    fontSize: '2rem',
                    fontWeight: 500,
                    mt: 0.5
                  }}
                >
                  {weekAppointments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} sm={4}>
            <Card sx={{ 
              background: '#fff',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
              borderRadius: '12px',
            }}>
              <CardContent sx={{ p: 2 }}>
                <Typography 
                  color="text.secondary" 
                  variant="caption" 
                  sx={{ 
                    letterSpacing: 0.5,
                    textTransform: 'uppercase',
                    fontSize: '0.75rem',
                    color: '#94A3B8'
                  }}
                >
                  Total à venir
                </Typography>
                <Typography 
                  variant="h3" 
                  component="div" 
                  sx={{ 
                    color: '#4EBAEC',
                    fontSize: '2rem',
                    fontWeight: 500,
                    mt: 0.5
                  }}
                >
                  {futureAppointments.length}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {viewMode === 'calendar' ? (
          <Calendar 
            appointments={weekAppointments} 
            onEditAppointment={handleSelectEvent}
          />
        ) : (
          <Stack spacing={4} sx={{ mt: 4 }}>
            {futureAppointments.length === 0 ? (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 3,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                  textAlign: 'center'
                }}
              >
                <Typography color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                  Aucun rendez-vous à venir
                </Typography>
              </Paper>
            ) : (
              <Paper 
                elevation={0}
                sx={{ 
                  p: 2,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider',
                  bgcolor: 'background.paper',
                }}
              >
                <Typography 
                  variant="h6" 
                  sx={{ 
                    mb: 2, 
                    fontWeight: 500,
                    color: 'text.primary',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  Prochains rendez-vous
                  <Typography 
                    component="span" 
                    variant="body2" 
                    sx={{ 
                      color: 'text.secondary',
                      fontWeight: 400,
                    }}
                  >
                    ({futureAppointments.length} RDV)
                  </Typography>
                </Typography>

                <Stack spacing={4}>
                  {futureAppointments.map((appointment) => (
                    <Card 
                      key={appointment.id}
                      sx={{ 
                        borderRadius: 1.5,
                        boxShadow: 'none',
                        border: '1px solid',
                        borderColor: `${getTypeColor(appointment.type)}30`,
                        background: `${getTypeColor(appointment.type)}08`,
                        transition: 'background-color 0.2s ease-in-out',
                        cursor: 'pointer',
                        '&:hover': {
                          background: `${getTypeColor(appointment.type)}12`,
                        },
                      }}
                      onClick={() => handleSelectEvent(appointment)}
                    >
                      <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                        <Grid container spacing={1} alignItems="center">
                          <Grid item xs={12} md={3}>
                            <Stack spacing={0.5}>
                              <Typography
                                variant="subtitle2"
                                sx={{
                                  color: 'text.primary',
                                  fontWeight: 600,
                                  textTransform: 'capitalize',
                                  fontSize: '0.95rem',
                                }}
                              >
                                {format(new Date(appointment.date), 'EEEE d MMMM', { locale: fr })}
                              </Typography>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography 
                                  variant="body1" 
                                  sx={{ 
                                    fontWeight: 600,
                                    color: getTypeColor(appointment.type),
                                    fontSize: '1.1rem',
                                  }}
                                >
                                  {format(new Date(appointment.date), 'HH:mm')}
                                </Typography>
                                <Typography
                                  variant="caption"
                                  sx={{
                                    color: getTypeColor(appointment.type),
                                    opacity: 0.9,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 0.5,
                                    fontSize: '0.85rem',
                                  }}
                                >
                                  {appointment.type === 'video' && '🎥'}
                                  {appointment.type === 'phone' && '📱'}
                                  {appointment.type === 'physical' && '🏥'}
                                  {appointment.duree} min
                                </Typography>
                              </Box>
                            </Stack>
                          </Grid>

                          <Grid item xs={12} md={9}>
                            <Stack spacing={0.5}>
                              <Box sx={{ 
                                display: 'flex', 
                                alignItems: 'center', 
                                gap: 1,
                                color: 'text.primary',
                              }}>
                                {getProfileLabel(appointment.profile).icon}
                                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                                  {appointment.prenom} {appointment.nom}
                                </Typography>
                              </Box>

                              <Stack 
                                direction="row" 
                                spacing={2} 
                                sx={{ 
                                  flexWrap: 'wrap', 
                                  gap: 1,
                                  '& > a': {
                                    minWidth: 'fit-content'
                                  }
                                }}
                              >
                                {appointment.email && (
                                  <Link
                                    href={`mailto:${appointment.email}`}
                                    sx={{
                                      color: 'text.secondary',
                                      textDecoration: 'none',
                                      fontSize: '0.875rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      '&:hover': {
                                        color: getTypeColor(appointment.type),
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    ✉️ {appointment.email}
                                  </Link>
                                )}
                                {appointment.telephone && (
                                  <Link
                                    href={`tel:${appointment.telephone}`}
                                    sx={{
                                      color: 'text.secondary',
                                      textDecoration: 'none',
                                      fontSize: '0.875rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      '&:hover': {
                                        color: getTypeColor(appointment.type),
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    📱 {appointment.telephone}
                                  </Link>
                                )}
                                {appointment.location && (
                                  <Link
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      color: 'text.secondary',
                                      textDecoration: 'none',
                                      fontSize: '0.875rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      '&:hover': {
                                        color: getTypeColor(appointment.type),
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    📍 {appointment.location}
                                  </Link>
                                )}
                                {appointment.meetLink && (
                                  <Link
                                    href={appointment.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    sx={{
                                      color: 'text.secondary',
                                      textDecoration: 'none',
                                      fontSize: '0.875rem',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: 0.5,
                                      '&:hover': {
                                        color: getTypeColor(appointment.type),
                                      }
                                    }}
                                    onClick={(e) => e.stopPropagation()}
                                  >
                                    🔗 Lien visio
                                  </Link>
                                )}
                              </Stack>
                            </Stack>
                          </Grid>
                        </Grid>

                        {appointment.notes && (
                          <Typography 
                            variant="body2" 
                            color="text.secondary"
                            sx={{
                              mt: 1,
                              pt: 1,
                              borderTop: '1px solid',
                              borderColor: 'divider',
                              fontSize: '0.875rem'
                            }}
                          >
                            📝 {appointment.notes}
                          </Typography>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </Stack>
              </Paper>
            )}
          </Stack>
        )}
      </Box>

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
