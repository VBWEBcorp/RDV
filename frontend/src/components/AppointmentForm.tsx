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
  Stack,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Appointment } from '../types';

interface AppointmentFormProps {
  onSubmit: (data: Omit<Appointment, 'id'>) => void;
  onCancel: () => void;
  initialData?: Appointment;
}

export function AppointmentForm({ onSubmit, onCancel, initialData }: AppointmentFormProps) {
  const [formData, setFormData] = React.useState<Omit<Appointment, 'id'>>({
    nom: initialData?.nom || '',
    prenom: initialData?.prenom || '',
    email: initialData?.email || '',
    telephone: initialData?.telephone || '',
    date: initialData?.date || new Date(),
    duree: initialData?.duree || 30,
    type: initialData?.type || 'physical',
    location: initialData?.location || '',
    meetLink: initialData?.meetLink || '',
    notes: initialData?.notes || '',
  });

  const handleChange = (field: keyof Omit<Appointment, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: event.target.value,
    }));
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData(prev => ({
        ...prev,
        date: newDate,
      }));
    }
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
                label="Nom"
                value={formData.nom}
                onChange={handleChange('nom')}
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
                label="Prénom"
                value={formData.prenom}
                onChange={handleChange('prenom')}
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
                label="Email"
                type="email"
                value={formData.email}
                onChange={handleChange('email')}
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
                label="Téléphone"
                value={formData.telephone}
                onChange={handleChange('telephone')}
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
              <DateTimePicker
                label="Date et heure"
                value={formData.date}
                onChange={handleDateChange}
                slotProps={{
                  textField: {
                    fullWidth: true,
                    required: true,
                    sx: {
                      '& .MuiOutlinedInput-root': {
                        '&.Mui-focused fieldset': {
                          borderColor: '#2196f3',
                          borderWidth: 2,
                        },
                      },
                    },
                  },
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                label="Durée (minutes)"
                type="number"
                value={formData.duree}
                onChange={handleChange('duree')}
                fullWidth
                required
                inputProps={{ min: 15, step: 15 }}
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
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel sx={{ color: '#2196f3' }}>Type de rendez-vous</InputLabel>
                <Select
                  value={formData.type}
                  label="Type de rendez-vous"
                  onChange={handleChange('type')}
                  sx={{
                    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                      borderColor: '#2196f3',
                      borderWidth: 2,
                    },
                  }}
                >
                  <MenuItem value="physical">Rendez-vous physique</MenuItem>
                  <MenuItem value="phone">Appel téléphonique</MenuItem>
                  <MenuItem value="video">Visioconférence</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {formData.type === 'physical' && (
              <Grid item xs={12}>
                <TextField
                  label="Lieu"
                  value={formData.location}
                  onChange={handleChange('location')}
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
            )}
            {formData.type === 'video' && (
              <Grid item xs={12}>
                <TextField
                  label="Lien de visioconférence"
                  value={formData.meetLink}
                  onChange={handleChange('meetLink')}
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
            )}
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
