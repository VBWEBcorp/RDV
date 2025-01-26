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

interface CreateAppointmentDialogProps {
  open: boolean;
  onClose: () => void;
}

type AppointmentType = 'physical' | 'phone' | 'video';

interface AppointmentForm {
  date: Date | null;
  type: AppointmentType;
  location: string;
  notes: string;
}

export default function CreateAppointmentDialog({ open, onClose }: CreateAppointmentDialogProps) {
  const [form, setForm] = useState<AppointmentForm>({
    date: null,
    type: 'physical',
    location: '',
    notes: '',
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
              <MenuItem value="video">Visioconférence</MenuItem>
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

          <TextField
            label="Notes"
            fullWidth
            multiline
            rows={4}
            value={form.notes}
            onChange={(e) => handleChange('notes', e.target.value)}
            placeholder="Ajoutez des notes ou des informations complémentaires..."
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleSubmit} variant="contained" color="primary">
          Créer le rendez-vous
        </Button>
      </DialogActions>
    </Dialog>
  );
}
