import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  FormControl,
  InputLabel,
  Select,
  SelectChangeEvent,
  Stack,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Appointment, AppointmentType, ProfileType } from '../types/appointment';

interface AppointmentFormProps {
  onSubmit: (data: Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => void;
  onCancel: () => void;
  initialData?: Appointment;
}

export function AppointmentForm({ onSubmit, onCancel, initialData }: AppointmentFormProps) {
  const [formData, setFormData] = React.useState<Omit<Appointment, 'id' | 'created_at' | 'updated_at'>>({
    patient_name: initialData?.patient_name || '',
    patient_email: initialData?.patient_email || '',
    patient_phone: initialData?.patient_phone || '',
    date: initialData?.date || new Date().toISOString().split('T')[0],
    time: initialData?.time || new Date().toTimeString().slice(0, 5),
    status: initialData?.status || 'pending',
    notes: initialData?.notes || ''
  });

  const handleChange = (name: keyof Omit<Appointment, 'id' | 'created_at' | 'updated_at'>) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }> | SelectChangeEvent
  ) => {
    setFormData(prev => ({
      ...prev,
      [name]: event.target.value
    }));
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(formData);
  };

  return (
    <Dialog 
      open={true} 
      onClose={onCancel}
      maxWidth="md"
      fullWidth
      TransitionProps={{
        timeout: 300,
      }}
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle sx={{
        background: 'linear-gradient(45deg, #2196f3 30%, #90caf9 90%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 600,
        fontSize: '1.5rem',
        pb: 3,
      }}>
        {initialData ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Nom du patient"
                value={formData.patient_name}
                onChange={handleChange('patient_name')}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Email du patient"
                type="email"
                value={formData.patient_email}
                onChange={handleChange('patient_email')}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Téléphone du patient"
                value={formData.patient_phone}
                onChange={handleChange('patient_phone')}
                fullWidth
                required
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={2}>
                <TextField
                  label="Date"
                  value={formData.date}
                  onChange={handleChange('date')}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2196f3',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Stack spacing={2}>
                <TextField
                  label="Heure"
                  value={formData.time}
                  onChange={handleChange('time')}
                  fullWidth
                  required
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      '&.Mui-focused fieldset': {
                        borderColor: '#2196f3',
                        borderWidth: 2,
                      },
                    },
                  }}
                />
              </Stack>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <InputLabel>Statut</InputLabel>
                <Select
                  value={formData.status}
                  onChange={handleChange('status')}
                  label="Statut"
                >
                  <MenuItem value="pending">En attente</MenuItem>
                  <MenuItem value="confirmed">Confirmé</MenuItem>
                  <MenuItem value="cancelled">Annulé</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                label="Notes"
                value={formData.notes}
                onChange={handleChange('notes')}
                fullWidth
                multiline
                rows={4}
                sx={{
                  '& .MuiOutlinedInput-root': {
                    '&.Mui-focused fieldset': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  },
                }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ p: 3, background: 'rgba(248, 250, 252, 0.8)' }}>
          <Stack direction="row" spacing={2}>
            <Button 
              onClick={onCancel} 
              variant="outlined"
              sx={{
                borderColor: '#2196f3',
                color: '#2196f3',
                '&:hover': {
                  borderColor: '#1769aa',
                  backgroundColor: 'rgba(33, 150, 243, 0.04)',
                },
              }}
            >
              Annuler
            </Button>
            <Button 
              type="submit" 
              variant="contained"
              sx={{
                background: 'linear-gradient(45deg, #2196f3 30%, #42a5f5 90%)',
                boxShadow: '0 3px 5px 2px rgba(33, 150, 243, .3)',
                transition: 'all 0.3s ease-in-out',
                '&:hover': {
                  background: 'linear-gradient(45deg, #1769aa 30%, #2196f3 90%)',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 8px 2px rgba(33, 150, 243, .4)',
                },
              }}
            >
              {initialData ? 'Modifier' : 'Créer'}
            </Button>
          </Stack>
        </DialogActions>
      </form>
    </Dialog>
  );
}
