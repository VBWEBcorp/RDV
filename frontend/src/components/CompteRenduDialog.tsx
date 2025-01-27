import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  Divider,
  SelectChangeEvent
} from '@mui/material';
import { useApp } from '../context/AppContext';
import { Appointment, ProfileType } from '../types/appointment';

interface CompteRenduDialogProps {
  appointment: Appointment;
  open: boolean;
  onClose: () => void;
}

export function CompteRenduDialog({ appointment, open, onClose }: CompteRenduDialogProps) {
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

  const handleProfileChange = (event: SelectChangeEvent<ProfileType>) => {
    setProfile(event.target.value as ProfileType);
  };

  const getProfileIcon = (profileType: ProfileType) => {
    switch (profileType) {
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
        return '🌱';
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ pb: 1 }}>Détails du rendez-vous</DialogTitle>
      <DialogContent>
        <Box sx={{ mt: 2, mb: 3 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Profil du contact
          </Typography>
          <FormControl fullWidth size="small">
            <InputLabel>Profil</InputLabel>
            <Select
              value={profile}
              onChange={handleProfileChange}
              label="Profil"
              sx={{
                '& .MuiSelect-select': {
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1
                }
              }}
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
                👥 Staff
              </MenuItem>
              <MenuItem value="partenaire" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                🤝 Partenaire
              </MenuItem>
            </Select>
          </FormControl>
        </Box>

        <Divider sx={{ my: 2 }} />

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Compte-rendu
          </Typography>
          <TextField
            multiline
            rows={4}
            value={compteRendu}
            onChange={(e) => setCompteRendu(e.target.value)}
            fullWidth
            placeholder="Saisissez votre compte-rendu..."
            size="small"
          />
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} variant="outlined">
          Annuler
        </Button>
        <Button 
          onClick={handleSave} 
          variant="contained"
          sx={{ 
            bgcolor: '#4EBAEC',
            '&:hover': {
              bgcolor: '#3A9BC8'
            }
          }}
        >
          Enregistrer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
