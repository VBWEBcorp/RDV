import React from 'react';
import { Box, Typography, Grid, Stack, ToggleButtonGroup, ToggleButton, Card, CardContent, Button, Chip, TextField, InputAdornment, IconButton, FormControlLabel, Switch } from '@mui/material';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search as SearchIcon, Sort as SortIcon, NoteAdd, Person as PersonIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { ClientDetailsDialog } from '../components/ClientDetailsDialog';
import { CompteRenduDialog } from '../components/CompteRenduDialog';
import { motion } from 'framer-motion';
import { AppointmentType, Appointment, ProfileType } from '../types';

export function History() {
  const { appointments } = useApp();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [sortByRecent, setSortByRecent] = React.useState(true);
  const [selectedProfile, setSelectedProfile] = React.useState<string>('all');
  const [showClientDetails, setShowClientDetails] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [compteRenduDialogOpen, setCompteRenduDialogOpen] = React.useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSortChange = () => {
    setSortByRecent(!sortByRecent);
  };

  const handleProfileChange = (_event: React.MouseEvent<HTMLElement>, newProfile: string | null) => {
    if (newProfile !== null) {
      setSelectedProfile(newProfile);
    }
  };

  const handleOpenClientDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowClientDetails(true);
  };

  const handleCloseClientDetails = () => {
    setShowClientDetails(false);
    setSelectedAppointment(null);
  };

  const handleOpenCompteRendu = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCompteRenduDialogOpen(true);
  };

  const handleCloseCompteRendu = () => {
    setCompteRenduDialogOpen(false);
    setSelectedAppointment(null);
  };

  const filteredAppointments = React.useMemo(() => {
    return appointments
      .filter((appointment) => {
        const searchString = searchQuery.toLowerCase();
        
        // Filtre par profil
        if (selectedProfile !== 'all' && appointment.profile !== selectedProfile) {
          return false;
        }

        // Si la recherche est vide, on montre tout
        if (!searchString) return true;

        // Formatage de la date pour la recherche
        const appointmentDate = format(new Date(appointment.date), 'dd/MM/yyyy HH:mm', { locale: fr }).toLowerCase();
        const dateForSearch = format(new Date(appointment.date), 'dd MM yyyy HH mm', { locale: fr }).toLowerCase();
        
        // Recherche dans tous les champs pertinents
        return appointment.nom.toLowerCase().includes(searchString) ||
          appointment.prenom.toLowerCase().includes(searchString) ||
          appointment.email.toLowerCase().includes(searchString) ||
          appointment.telephone.toLowerCase().includes(searchString) ||
          appointmentDate.includes(searchString) ||
          dateForSearch.includes(searchString) ||
          appointment.type.toLowerCase().includes(searchString) ||
          appointment.profile.toLowerCase().includes(searchString) ||
          appointment.notes?.toLowerCase().includes(searchString) ||
          appointment.compteRendu?.toLowerCase().includes(searchString);
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortByRecent ? dateB - dateA : dateA - dateB;
      });
  }, [appointments, searchQuery, selectedProfile, sortByRecent]);

  const getProfileLabel = (profile: ProfileType): { icon: string; label: string } => {
    switch (profile) {
      case 'lead':
        return { icon: '🎯', label: 'Lead' };
      case 'prospect':
        return { icon: '🌱', label: 'Prospect' };
      case 'client':
        return { icon: '⭐', label: 'Client' };
      case 'staff':
        return { icon: '👤', label: 'Staff' };
      case 'partenaire':
        return { icon: '🤝', label: 'Partenaire' };
      default:
        return { icon: '👥', label: profile };
    }
  };

  const getTypeColor = (type: AppointmentType): string => {
    const colors: Record<AppointmentType, string> = {
      physique: '#9e9e9e',
      telephone: '#2196F3',
      video: '#4CAF50'
    };
    return colors[type] || '#9e9e9e';
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      flexDirection: 'column',
      gap: 2,
      width: '100%',
      p: { xs: 2, sm: 3 },
    }}>
      {/* Titre de la page */}
      <Typography
        variant="h4"
        sx={{
          color: 'primary.main',
          fontWeight: 600,
          textAlign: { xs: 'center', sm: 'left' },
          mb: 2
        }}
      >
        Historique des RDV
      </Typography>

      {/* Filtres de profil */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        width: '100%',
      }}>
        <ToggleButtonGroup
          value={selectedProfile}
          exclusive
          onChange={handleProfileChange}
          aria-label="profil filter"
          size="small"
        >
          <ToggleButton value="all">Tous</ToggleButton>
          <ToggleButton value="lead">
            <span>🎯</span> Lead
          </ToggleButton>
          <ToggleButton value="prospect">
            <span>🌱</span> Prospect
          </ToggleButton>
          <ToggleButton value="client">
            <span>⭐</span> Client
          </ToggleButton>
          <ToggleButton value="staff">
            <span>👤</span> Staff
          </ToggleButton>
          <ToggleButton value="partenaire">
            <span>🤝</span> Partenaire
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Contrôles de recherche et tri */}
      <Box sx={{ 
        display: 'flex',
        flexDirection: { xs: 'column', sm: 'row' },
        gap: 2,
        width: '100%',
      }}>
        <TextField
          placeholder="Rechercher..."
          value={searchQuery}
          onChange={handleSearchChange}
          variant="outlined"
          size="small"
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ flexGrow: 1 }}
        />
        <FormControlLabel
          control={
            <Switch
              checked={sortByRecent}
              onChange={handleSortChange}
              color="primary"
            />
          }
          label="Plus récents en premier"
          sx={{ 
            minWidth: 'fit-content',
            m: 0,
            alignItems: 'center',
          }}
        />
      </Box>

      <Grid container spacing={2}>
        {filteredAppointments.map((appointment) => (
          <Grid item xs={12} key={appointment.id}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6">
                        {appointment.prenom} {appointment.nom}
                      </Typography>
                      <Stack direction="row" spacing={1}>
                        <Chip
                          label={
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                              {getProfileLabel(appointment.profile as ProfileType).icon}{' '}
                              {getProfileLabel(appointment.profile as ProfileType).label}
                            </Box>
                          }
                          size="small"
                          sx={{
                            bgcolor: 'white',
                            border: 1,
                            borderColor: 'divider',
                            '& .MuiChip-label': {
                              display: 'flex',
                              alignItems: 'center',
                            },
                          }}
                        />
                        <Chip
                          label={appointment.type}
                          size="small"
                          sx={{
                            bgcolor: getTypeColor(appointment.type),
                            color: 'white',
                          }}
                        />
                      </Stack>
                    </Stack>

                    <Typography variant="body2" color="text.secondary">
                      {format(new Date(appointment.date), 'EEEE d MMMM yyyy à HH:mm', {
                        locale: fr,
                      })}
                    </Typography>

                    <Stack direction="row" spacing={1}>
                      <Button
                        startIcon={<PersonIcon />}
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenClientDetails(appointment)}
                      >
                        Détails client
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenCompteRendu(appointment)}
                        sx={{ 
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1,
                          color: 'primary.main',
                          borderColor: 'primary.main',
                          '&:hover': {
                            borderColor: 'primary.dark',
                            backgroundColor: 'primary.50',
                          }
                        }}
                      >
                        Compte rendu
                        {appointment.compteRendu ? (
                          <CheckIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        ) : (
                          <CloseIcon sx={{ fontSize: 16, color: 'primary.main' }} />
                        )}
                      </Button>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        ))}
      </Grid>

      {selectedAppointment && (
        <>
          <ClientDetailsDialog
            open={showClientDetails}
            onClose={handleCloseClientDetails}
            appointment={selectedAppointment}
          />
          <CompteRenduDialog
            open={compteRenduDialogOpen}
            onClose={handleCloseCompteRendu}
            appointment={selectedAppointment}
          />
        </>
      )}
    </Box>
  );
}
