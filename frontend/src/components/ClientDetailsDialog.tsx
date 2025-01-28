import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  Stack,
  Link,
} from '@mui/material';
import { Appointment } from '../types';
import { useApp } from '../context/AppContext';
import { useLocation } from 'react-router-dom';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
}

export function ClientDetailsDialog({ open, onClose, appointment }: ClientDetailsDialogProps) {
  const location = useLocation();
  const { appointments } = useApp();
  const isCRMPage = location.pathname === '/crm';

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

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'consultation':
        return 'Consultation';
      case 'formation':
        return 'Formation';
      case 'réunion':
        return 'Réunion';
      default:
        return type;
    }
  };

  const getTypeColor = (type: string): string => {
    switch (type) {
      case 'consultation':
        return '#2196f3';
      case 'formation':
        return '#4caf50';
      case 'réunion':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  const clientAppointments = appointments.filter(
    apt => apt.email === appointment.email
  );

  const totalAppointments = clientAppointments.length;
  const lastAppointmentDate = clientAppointments
    .map(apt => new Date(apt.date))
    .sort((a, b) => b.getTime() - a.getTime())[0];

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      maxWidth="sm" 
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        },
      }}
    >
      <DialogTitle>
        <Stack spacing={1}>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: 1.5 
          }}>
            <Box sx={{ 
              width: 40, 
              height: 40, 
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: `${getTypeColor(appointment.type)}15`,
              color: getTypeColor(appointment.type),
              fontSize: '1.5rem'
            }}>
              {getProfileLabel(appointment.profile).icon}
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 600 }}>
              {appointment.prenom} {appointment.nom}
            </Typography>
          </Box>
        </Stack>
      </DialogTitle>

      <DialogContent sx={{ bgcolor: '#fafafa' }}>
        <Stack spacing={2} sx={{ pt: 1 }}>
          <Box sx={{ 
            bgcolor: 'white', 
            p: 2.5, 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1rem',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              👤 Contact
            </Typography>
            <Stack spacing={1.5}>
              {appointment.email && (
                <Link
                  href={`mailto:${appointment.email}`}
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  <Typography variant="body2">
                    ✉️ {appointment.email}
                  </Typography>
                </Link>
              )}
              {appointment.telephone && (
                <Link
                  href={`tel:${appointment.telephone}`}
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  <Typography variant="body2">
                    📱 {appointment.telephone}
                  </Typography>
                </Link>
              )}
            </Stack>
          </Box>

          <Box sx={{ 
            bgcolor: 'white', 
            p: 2.5, 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1rem',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              📅 Rendez-vous
            </Typography>
            <Stack spacing={1.5}>
              <Box sx={{ 
                display: 'flex', 
                gap: 3, 
                flexWrap: 'wrap'
              }}>
                <Typography variant="body2" sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1,
                  minWidth: '180px'
                }}>
                  🗓️ {format(new Date(appointment.date), 'EEEE d MMMM yyyy', { locale: fr })}
                </Typography>
                <Typography variant="body2" sx={{ 
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}>
                  ⏰ {format(new Date(appointment.date), 'HH:mm')} ({appointment.duree} min)
                </Typography>
              </Box>
              {appointment.location && (
                <Link
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(appointment.location)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  <Typography variant="body2">
                    📍 {appointment.location}
                  </Typography>
                </Link>
              )}
              {appointment.meetLink && (
                <Link
                  href={appointment.meetLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  sx={{
                    color: 'text.primary',
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    p: 1,
                    borderRadius: 1,
                    transition: 'all 0.2s',
                    '&:hover': {
                      color: 'text.primary',
                      bgcolor: 'rgba(0,0,0,0.02)'
                    }
                  }}
                >
                  <Typography variant="body2">
                    🔗 Lien visioconférence
                  </Typography>
                </Link>
              )}
            </Stack>
          </Box>

          <Box sx={{ 
            bgcolor: 'white', 
            p: 2.5, 
            borderRadius: 2,
            boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
          }}>
            <Typography 
              variant="h6" 
              color="primary" 
              sx={{ 
                fontWeight: 600,
                fontSize: '1rem',
                mb: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 1
              }}
            >
              📊 Historique
            </Typography>
            <Stack spacing={1.5}>
              <Typography variant="body2">
                {totalAppointments} rendez-vous au total
              </Typography>
              {lastAppointmentDate && (
                <Typography variant="body2">
                  Dernier rendez-vous : {format(lastAppointmentDate, 'PPP', { locale: fr })}
                </Typography>
              )}
            </Stack>
          </Box>

          {appointment.notes && (
            <Box sx={{ 
              bgcolor: 'white', 
              p: 2.5, 
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <Typography 
                variant="h6" 
                color="primary" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                📝 Notes
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  p: 1.5,
                  bgcolor: 'rgba(0,0,0,0.02)',
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6
                }}
              >
                {appointment.notes}
              </Typography>
            </Box>
          )}

          {appointment.compteRendu && (
            <Box sx={{ 
              bgcolor: 'white', 
              p: 2.5, 
              borderRadius: 2,
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)'
            }}>
              <Typography 
                variant="h6" 
                color="primary" 
                sx={{ 
                  fontWeight: 600,
                  fontSize: '1rem',
                  mb: 2,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }}
              >
                📋 Compte rendu
              </Typography>
              <Typography 
                variant="body2" 
                sx={{ 
                  p: 1.5,
                  bgcolor: 'rgba(0,0,0,0.02)',
                  borderRadius: 1,
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6
                }}
              >
                {appointment.compteRendu}
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 2, pt: 0 }}>
        <Button 
          onClick={onClose}
          variant="outlined"
          sx={{ 
            borderColor: 'primary.main',
            color: 'primary.main',
            '&:hover': {
              borderColor: 'primary.dark',
              bgcolor: 'primary.50',
            }
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
