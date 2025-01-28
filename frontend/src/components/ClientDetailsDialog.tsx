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
  Divider
} from '@mui/material';
import { Appointment } from '../types/appointment';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientDetailsDialogProps {
  appointment: Appointment;
  open: boolean;
  onClose: () => void;
}

export function ClientDetailsDialog({ appointment, open, onClose }: ClientDetailsDialogProps) {
  const { appointments } = useApp();
  
  // Calculer les statistiques des rendez-vous
  const clientAppointments = appointments.filter(
    (rdv) => rdv.email === appointment.email
  );
  
  const totalAppointments = clientAppointments.length;
  const lastAppointment = clientAppointments
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Détails du client</DialogTitle>
      <DialogContent>
        <Box sx={{ p: 2 }}>
          <Stack spacing={2}>
            {/* Informations personnelles */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Informations personnelles
              </Typography>
              <Typography>
                <strong>Nom :</strong> {appointment.nom} {appointment.prenom}
              </Typography>
              <Typography>
                <strong>Email :</strong> {appointment.email}
              </Typography>
              <Typography>
                <strong>Téléphone :</strong> {appointment.telephone}
              </Typography>
              <Typography>
                <strong>Profil :</strong>{' '}
                <Chip
                  label={appointment.profile.charAt(0).toUpperCase() + appointment.profile.slice(1)}
                  color="primary"
                  size="small"
                />
              </Typography>
            </Box>

            <Divider />

            {/* Statistiques */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Statistiques
              </Typography>
              <Typography>
                <strong>Nombre total de rendez-vous :</strong> {totalAppointments}
              </Typography>
              {lastAppointment && (
                <Typography>
                  <strong>Dernier rendez-vous :</strong>{' '}
                  {format(new Date(lastAppointment.date), "d MMMM yyyy 'à' HH:mm", {
                    locale: fr,
                  })}
                </Typography>
              )}
            </Box>

            <Divider />

            {/* Notes et compte-rendu */}
            <Box>
              <Typography variant="h6" gutterBottom>
                Notes
              </Typography>
              <Typography
                sx={{
                  whiteSpace: 'pre-wrap',
                  bgcolor: 'grey.100',
                  p: 2,
                  borderRadius: 1,
                }}
              >
                {appointment.notes || 'Aucune note'}
              </Typography>
            </Box>

            {appointment.compteRendu && (
              <Box>
                <Typography variant="h6" gutterBottom>
                  Compte-rendu
                </Typography>
                <Typography
                  sx={{
                    whiteSpace: 'pre-wrap',
                    bgcolor: 'grey.100',
                    p: 2,
                    borderRadius: 1,
                  }}
                >
                  {appointment.compteRendu}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Fermer</Button>
      </DialogActions>
    </Dialog>
  );
}
