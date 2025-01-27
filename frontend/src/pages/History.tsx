import React from 'react';
import { Box, Typography, Grid, Stack, ToggleButtonGroup, ToggleButton, Card, CardContent, Button, Chip, TextField, InputAdornment, IconButton } from '@mui/material';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Search as SearchIcon, Sort as SortIcon, NoteAdd, Person as PersonIcon } from '@mui/icons-material';
import { ClientDetailsDialog } from '../components/ClientDetailsDialog';
import { CompteRenduDialog } from '../components/CompteRenduDialog';
import { motion } from 'framer-motion';
import { AppointmentType, Appointment } from '../types';

export function History() {
  const { appointments } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [sortOrder, setSortOrder] = React.useState('desc');
  const [selectedProfile, setSelectedProfile] = React.useState('all');
  const [showClientDetails, setShowClientDetails] = React.useState(false);
  const [selectedAppointment, setSelectedAppointment] = React.useState<Appointment | null>(null);
  const [compteRenduDialogOpen, setCompteRenduDialogOpen] = React.useState(false);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = () => {
    setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc');
  };

  const handleProfileChange = (event: React.MouseEvent<HTMLElement>, newProfile: string) => {
    if (newProfile !== null) {
      setSelectedProfile(newProfile);
    }
  };

  const getAppointmentTypeColor = (type: AppointmentType) => {
    switch (type) {
      case 'physique':
        return '#4caf50';
      case 'telephone':
        return '#ff9800';
      case 'video':
        return '#4EBAEC';
      default:
        return '#9e9e9e';
    }
  };

  const getProfileIcon = (profileType: string) => {
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
      case 'all':
        return '👥';
      default:
        return '🌱';
    }
  };

  const filteredAppointments = appointments
    .filter(apt => 
      (apt.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       apt.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
       apt.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (selectedProfile === 'all' || apt.profile === selectedProfile)
    )
    .sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

  const handleOpenClientDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowClientDetails(true);
  };

  const handleOpenCompteRendu = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setCompteRenduDialogOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            color: '#4EBAEC',
            fontWeight: 600,
          }}
        >
          Historique des rendez-vous
        </Typography>

        <Card
          elevation={0}
          sx={{
            mb: 3,
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
            transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
            },
          }}
        >
          <CardContent>
            <Grid container spacing={3} alignItems="center">
              <Grid item xs={12} md={4}>
                <TextField
                  fullWidth
                  variant="outlined"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: 'text.secondary' }} />
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12} md={6}>
                <ToggleButtonGroup
                  value={selectedProfile}
                  exclusive
                  onChange={handleProfileChange}
                  aria-label="profil filter"
                  sx={{ flexWrap: 'wrap', gap: 1 }}
                >
                  <ToggleButton 
                    value="all"
                    sx={{
                      borderRadius: 2,
                      px: 2,
                      py: 1,
                      display: 'flex',
                      gap: 1,
                      alignItems: 'center',
                      '&.Mui-selected': {
                        backgroundColor: 'primary.main',
                        color: 'white',
                        '&:hover': {
                          backgroundColor: 'primary.dark',
                        },
                      },
                    }}
                  >
                    {getProfileIcon('all')} Tous
                  </ToggleButton>
                  {['lead', 'prospect', 'client', 'staff', 'partenaire'].map((profile) => (
                    <ToggleButton 
                      key={profile} 
                      value={profile}
                      sx={{
                        borderRadius: 2,
                        px: 2,
                        py: 1,
                        display: 'flex',
                        gap: 1,
                        alignItems: 'center',
                        '&.Mui-selected': {
                          backgroundColor: 'primary.main',
                          color: 'white',
                          '&:hover': {
                            backgroundColor: 'primary.dark',
                          },
                        },
                      }}
                    >
                      {getProfileIcon(profile)} {profile}
                    </ToggleButton>
                  ))}
                </ToggleButtonGroup>
              </Grid>
              <Grid item xs={12} md={2}>
                <Button
                  fullWidth
                  variant="outlined"
                  onClick={handleSortChange}
                  startIcon={<SortIcon />}
                  sx={{
                    borderRadius: 2,
                    height: '100%',
                    borderColor: 'divider',
                    '&:hover': {
                      borderColor: 'primary.main',
                      backgroundColor: 'rgba(78,186,236,0.08)',
                    },
                  }}
                >
                  {sortOrder === 'desc' ? 'Plus récent' : 'Plus ancien'}
                </Button>
              </Grid>
            </Grid>
          </CardContent>
        </Card>

        <Grid container spacing={2}>
          {filteredAppointments.map((appointment, index) => (
            <Grid item xs={12} key={appointment.id || index}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card
                  elevation={0}
                  sx={{
                    background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                    border: '1px solid #e2e8f0',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      transform: 'translateY(-2px)',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                      cursor: 'pointer',
                    },
                  }}
                  onClick={() => handleOpenClientDetails(appointment)}
                >
                  <CardContent>
                    <Grid container spacing={2} alignItems="center">
                      <Grid item xs={12} md={3}>
                        <Typography variant="subtitle1" fontWeight={500}>
                          {format(new Date(appointment.date), 'PPP', { locale: fr })}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {format(new Date(appointment.date), 'HH:mm')}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={4}>
                        <Typography variant="subtitle1">
                          {appointment.nom} {appointment.prenom}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {appointment.email}
                        </Typography>
                      </Grid>
                      <Grid item xs={12} md={3}>
                        <Stack direction="row" spacing={1}>
                          <Chip
                            label={appointment.type}
                            size="small"
                            sx={{
                              backgroundColor: `${getAppointmentTypeColor(appointment.type)}20`,
                              color: getAppointmentTypeColor(appointment.type),
                              fontWeight: 500,
                            }}
                          />
                          <Chip
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {getProfileIcon(appointment.profile)} {appointment.profile}
                              </Box>
                            }
                            size="small"
                            sx={{
                              backgroundColor: 'rgba(78,186,236,0.1)',
                              color: 'primary.main',
                              fontWeight: 500,
                              '.MuiChip-label': {
                                px: 1,
                              },
                            }}
                          />
                        </Stack>
                      </Grid>
                      <Grid item xs={12} md={2}>
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenClientDetails(appointment);
                            }}
                            sx={{
                              backgroundColor: 'rgba(78,186,236,0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(78,186,236,0.2)',
                              },
                            }}
                          >
                            <PersonIcon sx={{ color: 'primary.main' }} />
                          </IconButton>
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleOpenCompteRendu(appointment);
                            }}
                            sx={{
                              backgroundColor: 'rgba(78,186,236,0.1)',
                              '&:hover': {
                                backgroundColor: 'rgba(78,186,236,0.2)',
                              },
                            }}
                          >
                            <NoteAdd sx={{ color: 'primary.main' }} />
                          </IconButton>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </motion.div>
            </Grid>
          ))}
        </Grid>
      </Box>
      {selectedAppointment && (
        <ClientDetailsDialog
          client={{
            id: selectedAppointment.id,
            nom: selectedAppointment.nom,
            prenom: selectedAppointment.prenom,
            email: selectedAppointment.email,
            telephone: selectedAppointment.telephone,
          }}
          appointment={{
            notes: selectedAppointment.notes,
            compteRendu: selectedAppointment.compteRendu
          }}
          open={showClientDetails}
          onClose={() => {
            setShowClientDetails(false);
            setSelectedAppointment(null);
          }}
        />
      )}
      {selectedAppointment && (
        <CompteRenduDialog
          open={compteRenduDialogOpen}
          appointment={selectedAppointment}
          onClose={() => {
            setCompteRenduDialogOpen(false);
            setSelectedAppointment(null);
          }}
        />
      )}
    </motion.div>
  );
}
