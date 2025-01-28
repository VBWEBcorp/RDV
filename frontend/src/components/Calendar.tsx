import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  Stack,
  Paper,
  Link
} from '@mui/material';
import { format, startOfWeek, addDays, isSameDay } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '../types';
import { ClientDetailsDialog } from './ClientDetailsDialog';
import { CompteRenduDialog } from './CompteRenduDialog';
import { Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';

interface CalendarProps {
  appointments: Appointment[];
  onEditAppointment: (appointment: Appointment) => void;
}

export function Calendar({ appointments, onEditAppointment }: CalendarProps) {
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [openClientDetails, setOpenClientDetails] = React.useState(false);
  const [openCompteRendu, setOpenCompteRendu] = React.useState(false);

  const startOfCurrentWeek = startOfWeek(new Date(), { weekStartsOn: 1 }); // Commence le lundi
  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(startOfCurrentWeek, i));

  const handleOpenClientDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenClientDetails(true);
  };

  const handleCloseClientDetails = () => {
    setOpenClientDetails(false);
    setSelectedAppointment(null);
  };

  const handleOpenCompteRendu = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setOpenCompteRendu(true);
  };

  const handleCloseCompteRendu = () => {
    setOpenCompteRendu(false);
    setSelectedAppointment(null);
  };

  const getTypeColor = (type: string): string => {
    const colors: Record<string, string> = {
      physique: '#9e9e9e',
      telephone: '#2196F3',
      video: '#4CAF50'
    };
    return colors[type] || '#9e9e9e';
  };

  const getProfileLabel = (profile: string): { icon: string; label: string } => {
    switch (profile) {
      case 'lead':
        return { icon: '🎯', label: 'Lead' };
      case 'prospect':
        return { icon: '🌱', label: 'Prospect' };
      case 'client':
        return { icon: '⭐', label: 'Client' };
      case 'staff':
        return { icon: '👤', label: 'Staff' };
      case 'partenaire':
        return { icon: '🤝', label: 'Partenaire' };
      default:
        return { icon: '👥', label: profile };
    }
  };

  return (
    <Box>
      <Stack spacing={2} sx={{ mt: 4 }}>
        {weekDays.map((day) => {
          const dayAppointments = appointments.filter((apt) => 
            isSameDay(new Date(apt.date), day)
          );

          return (
            <Box key={day.toISOString()}>
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
                    textTransform: 'capitalize',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                  }}
                >
                  {format(day, 'EEEE d MMMM', { locale: fr })}
                  {dayAppointments.length > 0 && (
                    <Typography 
                      component="span" 
                      variant="body2" 
                      sx={{ 
                        color: 'text.secondary',
                        fontWeight: 400,
                      }}
                    >
                      ({dayAppointments.length} RDV)
                    </Typography>
                  )}
                </Typography>

                <Stack spacing={1}>
                  {dayAppointments.length === 0 ? (
                    <Typography color="text.secondary" sx={{ fontStyle: 'italic', fontSize: '0.9rem' }}>
                      Aucun rendez-vous
                    </Typography>
                  ) : (
                    dayAppointments.map((appointment) => (
                      <Card 
                        key={appointment._id}
                        sx={{ 
                          borderRadius: 1.5,
                          boxShadow: 'none',
                          border: '1px solid',
                          borderColor: `${getTypeColor(appointment.type)}30`,
                          background: `${getTypeColor(appointment.type)}08`,
                          transition: 'all 0.2s ease-in-out',
                          '&:hover': {
                            background: `${getTypeColor(appointment.type)}12`,
                            transform: 'translateX(4px)',
                          },
                        }}
                      >
                        <CardContent sx={{ py: 1, px: 2, '&:last-child': { pb: 1 } }}>
                          <Grid container spacing={1} alignItems="center">
                            <Grid item xs={12} md={2}>
                              <Typography 
                                variant="body2" 
                                sx={{ 
                                  fontWeight: 500,
                                  color: getTypeColor(appointment.type),
                                }}
                              >
                                {format(new Date(appointment.date), 'HH:mm')}
                              </Typography>
                            </Grid>

                            <Grid item xs={12} md={7}>
                              <Stack direction="row" spacing={1} alignItems="center">
                                <Box sx={{ 
                                  display: 'flex', 
                                  alignItems: 'center', 
                                  gap: 1,
                                  color: 'text.primary',
                                }}>
                                  {getProfileLabel(appointment.profile).icon}
                                  <Typography variant="body2">
                                    {appointment.prenom} {appointment.nom}
                                  </Typography>
                                </Box>
                                {appointment.email && (
                                  <Link
                                    href={`mailto:${appointment.email}`}
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                      color: 'inherit',
                                      textDecoration: 'none',
                                      '&:hover': {
                                        color: 'inherit'
                                      }
                                    }}
                                  >
                                    <Typography variant="body2" color="text.secondary">
                                      ✉️
                                    </Typography>
                                  </Link>
                                )}
                                {appointment.telephone && (
                                  <Link
                                    href={`tel:${appointment.telephone}`}
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                      color: 'inherit',
                                      textDecoration: 'none',
                                      '&:hover': {
                                        color: 'inherit'
                                      }
                                    }}
                                  >
                                    <Typography variant="body2" color="text.secondary">
                                      📱
                                    </Typography>
                                  </Link>
                                )}
                                {appointment.location && (
                                  <Link
                                    href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.location)}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                      color: 'inherit',
                                      textDecoration: 'none',
                                      '&:hover': {
                                        color: 'inherit'
                                      }
                                    }}
                                  >
                                    <Typography variant="body2" color="text.secondary">
                                      📍
                                    </Typography>
                                  </Link>
                                )}
                                {appointment.meetLink && (
                                  <Link
                                    href={appointment.meetLink}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={(e) => e.stopPropagation()}
                                    sx={{
                                      color: 'inherit',
                                      textDecoration: 'none',
                                      '&:hover': {
                                        color: 'inherit'
                                      }
                                    }}
                                  >
                                    <Typography variant="body2" color="text.secondary">
                                      🔗
                                    </Typography>
                                  </Link>
                                )}
                              </Stack>
                            </Grid>

                            <Grid item xs={12} md={3}>
                              <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => onEditAppointment(appointment)}
                                  sx={{ 
                                    minWidth: 'auto',
                                    color: getTypeColor(appointment.type),
                                    '&:hover': {
                                      bgcolor: `${getTypeColor(appointment.type)}15`,
                                    }
                                  }}
                                >
                                  Modifier
                                </Button>
                                <Button
                                  variant="text"
                                  size="small"
                                  onClick={() => handleOpenClientDetails(appointment)}
                                  sx={{ 
                                    minWidth: 'auto',
                                    color: getTypeColor(appointment.type),
                                    '&:hover': {
                                      bgcolor: `${getTypeColor(appointment.type)}15`,
                                    }
                                  }}
                                >
                                  Détails
                                </Button>
                              </Stack>
                            </Grid>
                          </Grid>
                        </CardContent>
                      </Card>
                    ))
                  )}
                </Stack>
              </Paper>
            </Box>
          );
        })}
      </Stack>

      {selectedAppointment && (
        <>
          <ClientDetailsDialog
            open={openClientDetails}
            onClose={handleCloseClientDetails}
            appointment={selectedAppointment}
          />
          <CompteRenduDialog
            open={openCompteRendu}
            onClose={handleCloseCompteRendu}
            appointment={selectedAppointment}
          />
        </>
      )}
    </Box>
  );
}
