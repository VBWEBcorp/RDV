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
    date: initialData?.date || new Date().toISOString(),
    duree: initialData?.duree || 30,
    type: initialData?.type || 'physique',
    location: initialData?.location || '',
    meetLink: initialData?.meetLink || '',
    notes: initialData?.notes || '',
    profile: initialData?.profile || 'prospect',
    status: initialData?.status || 'pending'
  });

  const handleChange = (name: keyof Omit<Appointment, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }> | SelectChangeEvent
  ) => {
    if (name === 'type') {
      const newType = event.target.value as AppointmentType;
      setFormData(prev => ({
        ...prev,
        type: newType,
        meetLink: newType === 'video' 
          ? (prev.meetLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`)
          : ''
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: event.target.value
      }));
    }
  };

  const handleDateChange = (newDate: Date | null) => {
    if (newDate) {
      setFormData(prev => ({
        ...prev,
        date: newDate.toISOString()
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
              <Stack spacing={2}>
                <DateTimePicker
                  label="Date et heure"
                  value={new Date(formData.date)}
                  onChange={handleDateChange}
                  sx={{
                    width: '100%',
                    '& .MuiOutlinedInput-root': {
                      '& fieldset': {
                        borderColor: '#E0E3E7',
                      },
                      '&:hover fieldset': {
                        borderColor: '#B2BAC2',
                      },
                      '&.Mui-focused fieldset': {
                        borderColor: '#6F7E8C',
                      },
                    },
                  }}
                />
              </Stack>
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Type de rendez-vous</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleChange('type')}
                    label="Type de rendez-vous"
                  >
                    <MenuItem value="physique">Physique</MenuItem>
                    <MenuItem value="phone">Téléphone</MenuItem>
                    <MenuItem value="video">Visioconférence</MenuItem>
                  </Select>
                </FormControl>

                <FormControl fullWidth>
                  <InputLabel>Profil</InputLabel>
                  <Select
                    value={formData.profile}
                    onChange={handleChange('profile')}
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
              </Stack>
            </Grid>
            {formData.type === 'video' && (
              <Grid item xs={12}>
                <TextField
                  label="Lien de visioconférence"
                  value={formData.meetLink}
                  InputProps={{
                    readOnly: true,
                  }}
                  fullWidth
                  sx={{
                    '& .MuiInputBase-input': {
                      color: '#4EBAEC',
                      cursor: 'pointer',
                    }
                  }}
                />
              </Grid>
            )}
            {formData.type === 'physique' && (
              <Grid item xs={12}>
                <TextField
                  label="Lieu"
                  value={formData.location}
                  onChange={handleChange('location')}
                  fullWidth
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
