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
  Chip,
} from '@mui/material';
import { Client } from '../types';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientDetailsDialogProps {
  client: Client;
  appointment: {
    notes?: string;
    compteRendu?: string;
  };
  open: boolean;
  onClose: () => void;
}

export function ClientDetailsDialog({ client, appointment, open, onClose }: ClientDetailsDialogProps) {
  const { appointments } = useApp();
  
  // Calculer les statistiques des rendez-vous
  const clientStats = React.useMemo(() => {
    const clientAppointments = appointments.filter(
      apt => apt.nom === client.nom && apt.prenom === client.prenom
    );
    
    const lastAppointment = clientAppointments.length > 0
      ? clientAppointments.reduce((latest, current) => 
          new Date(current.date) > new Date(latest.date) ? current : latest
        )
      : null;

    return {
      total: clientAppointments.length,
      lastAppointment
    };
  }, [appointments, client]);

  const getProfileIcon = (profile: string) => {
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
        return { icon: '🌱', label: 'Prospect' };
    }
  };

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
      <DialogTitle sx={{ pb: 0 }}>
        <Stack spacing={1}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {getProfileIcon(client.profile).icon}
            <Typography variant="h5" component="span" fontWeight="600">
              {client.nom} {client.prenom}
            </Typography>
          </Box>
          <Typography variant="subtitle1" color="text.secondary" sx={{ 
            display: 'flex',
            alignItems: 'center',
            gap: 0.5,
            color: '#94A3B8',
            fontSize: '0.875rem'
          }}>
            {getProfileIcon(client.profile).label}
          </Typography>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ pt: 1 }}>
          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
              Informations personnelles
            </Typography>
            <Typography variant="h6" sx={{ mt: 1 }}>
              {client.nom} {client.prenom}
            </Typography>
            <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
              <Chip
                label={`${clientStats.total} rendez-vous`}
                size="small"
                sx={{
                  backgroundColor: 'rgba(78,186,236,0.1)',
                  color: '#4EBAEC',
                  fontWeight: 500,
                }}
              />
              {clientStats.lastAppointment && (
                <Chip
                  label={`Dernier RDV: ${format(new Date(clientStats.lastAppointment.date), 'dd/MM/yyyy', { locale: fr })}`}
                  size="small"
                  sx={{
                    backgroundColor: 'rgba(78,186,236,0.1)',
                    color: '#4EBAEC',
                    fontWeight: 500,
                  }}
                />
              )}
            </Stack>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
              Contact
            </Typography>
            <Stack spacing={1} sx={{ mt: 1 }}>
              {client.telephone && (
                <Typography variant="body1">
                  📱 {client.telephone}
                </Typography>
              )}
              {client.email && (
                <Typography variant="body1">
                  ✉️ {client.email}
                </Typography>
              )}
            </Stack>
          </Box>

          {appointment.compteRendu && (
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ fontWeight: 500 }}>
                Compte rendu du dernier rendez-vous
              </Typography>
              <Typography 
                variant="body1" 
                sx={{ 
                  mt: 1,
                  p: 2,
                  backgroundColor: 'rgba(0,0,0,0.02)',
                  borderRadius: 1,
                  borderLeft: '3px solid #4EBAEC'
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
            borderColor: '#4EBAEC',
            color: '#4EBAEC',
            '&:hover': {
              borderColor: '#3A9BC8',
              backgroundColor: 'rgba(78,186,236,0.05)',
            }
          }}
        >
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
