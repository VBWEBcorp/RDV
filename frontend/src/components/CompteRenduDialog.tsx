import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
} from '@mui/material';
import { Appointment, ProfileType } from '../types';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useApp } from '../context/AppContext';

interface CompteRenduDialogProps {
  open: boolean;
  onClose: () => void;
  appointment: Appointment;
}

export function CompteRenduDialog({ open, onClose, appointment }: CompteRenduDialogProps) {
  const { updateAppointment } = useApp();
  const [compteRendu, setCompteRendu] = React.useState(appointment.compteRendu || '');
  const [profile, setProfile] = React.useState<ProfileType>(appointment.profile);

  const handleSave = () => {
    updateAppointment(appointment.id, {
      ...appointment,
      compteRendu,
      profile,
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Typography variant="h6">
          Compte rendu - {appointment.prenom} {appointment.nom}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {format(new Date(appointment.date), 'EEEE d MMMM yyyy à HH:mm', { locale: fr })}
        </Typography>
      </DialogTitle>
      <DialogContent>
        <Stack spacing={3} sx={{ mt: 2 }}>
          <FormControl fullWidth>
            <InputLabel>Profil</InputLabel>
            <Select
              value={profile}
              label="Profil"
              onChange={(e) => setProfile(e.target.value as ProfileType)}
            >
              <MenuItem value="lead" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🎯 Lead
              </MenuItem>
              <MenuItem value="prospect" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🌱 Prospect
              </MenuItem>
              <MenuItem value="client" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                ⭐ Client
              </MenuItem>
              <MenuItem value="staff" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                👤 Staff
              </MenuItem>
              <MenuItem value="partenaire" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🤝 Partenaire
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Compte rendu"
            multiline
            rows={6}
            fullWidth
            value={compteRendu}
            onChange={(e) => setCompteRendu(e.target.value)}
          />
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSave} variant="contained" color="primary">
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
