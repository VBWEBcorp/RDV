import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Box,
  FormHelperText,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { useState } from 'react';
import {
  Person as PersonIcon,
  Business as BusinessIcon,
  Group as GroupIcon,
  Handshake as HandshakeIcon,
  Star as StarIcon,
} from '@mui/icons-material';

interface CreateAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
}

type AppointmentType = 'physical' | 'phone' | 'video';
type ProfileType = 'lead' | 'prospect' | 'client' | 'staff' | 'partner';

interface AppointmentForm {
  date: Date | null;
  type: AppointmentType;
  location: string;
  notes: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  profile: ProfileType;
}

const getProfileIcon = (profile: ProfileType) => {
  switch (profile) {
    case 'lead':
      return <StarIcon />;
    case 'prospect':
      return <PersonIcon />;
    case 'client':
      return <BusinessIcon />;
    case 'staff':
      return <GroupIcon />;
    case 'partner':
      return <HandshakeIcon />;
  }
};

export default function CreateAppointmentDialog({ open, onClose }: CreateAppointmentDialogProps) {
  const [form, setForm] = useState<AppointmentForm>({
    date: null,
    type: 'physical',
    location: '',
    notes: '',
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    profile: 'prospect',
  });

  const handleSubmit = () => {
    console.log('Form submitted:', form);
    if (form.type === 'video') {
      // TODO: Generate Google Meet link
    }
    onClose();
  };

  const handleChange = (field: keyof AppointmentForm, value: any) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Créer un nouveau rendez-vous</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
          <DateTimePicker
            label="Date et heure"
            value={form.date}
            onChange={(newValue) => handleChange('date', newValue)}
          />

          <FormControl fullWidth required>
            <InputLabel>Type de rendez-vous</InputLabel>
            <Select
              value={form.type}
              label="Type de rendez-vous"
              onChange={(e) => handleChange('type', e.target.value)}
            >
              <MenuItem value="physical">Physique</MenuItem>
              <MenuItem value="phone">Téléphonique</MenuItem>
              <MenuItem value="video">Visioconférence (Google Meet)</MenuItem>
            </Select>
          </FormControl>

          {form.type === 'physical' && (
            <TextField
              label="Lieu"
              fullWidth
              required
              value={form.location}
              onChange={(e) => handleChange('location', e.target.value)}
              helperText="Indiquez l'adresse du rendez-vous"
            />
          )}

          {form.type === 'video' && (
            <FormHelperText>
              Un lien Google Meet sera automatiquement généré
            </FormHelperText>
          )}

          <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2 }}>
            <TextField
              label="Prénom"
              fullWidth
              required
              value={form.firstName}
              onChange={(e) => handleChange('firstName', e.target.value)}
            />
            <TextField
              label="Nom"
              fullWidth
              required
              value={form.lastName}
              onChange={(e) => handleChange('lastName', e.target.value)}
            />
          </Box>

          <TextField
            label="Email"
            fullWidth
            required
            type="email"
            value={form.email}
            onChange={(e) => handleChange('email', e.target.value)}
          />

          <TextField
            label="Téléphone"
            fullWidth
            required
            value={form.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
          />

          <FormControl fullWidth required>
            <InputLabel>Profil</InputLabel>
            <Select
              value={form.profile}
              label="Profil"
              onChange={(e) => handleChange('profile', e.target.value as ProfileType)}
              renderValue={(value) => (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {getProfileIcon(value as ProfileType)}
                  {value.charAt(0).toUpperCase() + value.slice(1)}
                </Box>
              )}
            >
              <MenuItem value="lead">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <StarIcon /> Lead
                </Box>
              </MenuItem>
              <MenuItem value="prospect">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon /> Prospect
                </Box>
              </MenuItem>
              <MenuItem value="client">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <BusinessIcon /> Client
                </Box>
              </MenuItem>
              <MenuItem value="staff">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <GroupIcon /> Staff
                </Box>
              </MenuItem>
              <MenuItem value="partner">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <HandshakeIcon /> Partenaire
                </Box>
              </MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Créer
        </Button>
      </DialogActions>
    </Dialog>
  );
}
