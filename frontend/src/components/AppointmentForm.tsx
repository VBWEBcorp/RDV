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
  Typography
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers';
import { Appointment } from '../types';
import { generateGoogleMeetLink } from '../utils/googleMeet';

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
    profile: initialData?.profile || 'prospect'
  });

  // Générer un lien Meet une seule fois quand le type change à "video"
  React.useEffect(() => {
    if (formData.type === 'video' && !formData.meetLink) {
      const meetLink = `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`;
      setFormData(prev => ({
        ...prev,
        meetLink
      }));
    }
  }, [formData.type]);

  const handleChange = (field: keyof Omit<Appointment, 'id'>) => (
    event: React.ChangeEvent<HTMLInputElement | { value: unknown }>
  ) => {
    const value = event.target.value;
    
    if (field === 'type') {
      if (value === 'video') {
        // Ne pas changer le meetLink s'il existe déjà
        setFormData(prev => ({
          ...prev,
          [field]: value,
          meetLink: prev.meetLink || `https://meet.google.com/${Math.random().toString(36).substring(2, 12)}`
        }));
      } else {
        setFormData(prev => ({
          ...prev,
          [field]: value,
          meetLink: '' // Effacer le lien si ce n'est pas une visio
        }));
      }
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
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
      <DialogTitle>
        <Typography variant="h4" sx={{ 
          fontWeight: 600,
          color: '#4EBAEC',
          fontSize: '1.35rem',
          mb: 1
        }}>
          {initialData ? 'Modifier le rendez-vous' : 'Nouveau rendez-vous'}
        </Typography>
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
              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Type de rendez-vous</InputLabel>
                  <Select
                    value={formData.type}
                    onChange={handleChange('type')}
                    label="Type de rendez-vous"
                  >
                    <MenuItem value="physical">Physique</MenuItem>
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
            {formData.type === 'physical' && (
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
                bgcolor: '#4EBAEC',
                '&:hover': {
                  bgcolor: '#3da8d9'
                }
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
