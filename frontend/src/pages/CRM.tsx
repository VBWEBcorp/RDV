import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Chip,
  TextField,
  InputAdornment,
  Stack,
  FormControlLabel,
  Switch,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { useApp } from '../context/AppContext';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { 
  Search as SearchIcon,
  Check as CheckIcon,
  Close as CloseIcon 
} from '@mui/icons-material';
import { motion } from 'framer-motion';
import { ClientDetailsDialog } from '../components/ClientDetailsDialog';
import { CompteRenduDialog } from '../components/CompteRenduDialog';
import { Appointment } from '../types';

export function CRM() {
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

  const handleProfileChange = (_event: React.MouseEvent<HTMLElement>, newProfile: string | null) => {
    if (newProfile !== null) {
      setSelectedProfile(newProfile);
    }
  };

  // Regrouper les rendez-vous par client (email)
  const clientGroups = React.useMemo(() => {
    const groups = new Map<string, Appointment[]>();
    
    appointments.forEach(appointment => {
      const existingGroup = groups.get(appointment.email) || [];
      groups.set(appointment.email, [...existingGroup, appointment]);
    });

    return Array.from(groups.entries()).map(([email, appointments]) => {
      // Trier les rendez-vous par date pour chaque client
      const sortedAppointments = appointments.sort((a, b) => 
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
      
      // Utiliser le rendez-vous le plus récent comme référence pour le client
      return sortedAppointments[0];
    });
  }, [appointments]);

  const filteredClients = React.useMemo(() => {
    return clientGroups
      .filter((client) => {
        const searchString = searchQuery.toLowerCase();
        
        // Filtre par profil
        if (selectedProfile !== 'all' && client.profile !== selectedProfile) {
          return false;
        }

        // Si la recherche est vide, on montre tout
        if (!searchString) return true;

        // Formatage de la date pour la recherche
        const appointmentDate = format(new Date(client.date), 'dd/MM/yyyy HH:mm', { locale: fr }).toLowerCase();
        const dateForSearch = format(new Date(client.date), 'dd MM yyyy HH mm', { locale: fr }).toLowerCase();
        
        // Recherche dans tous les champs pertinents
        return client.nom.toLowerCase().includes(searchString) ||
          client.prenom.toLowerCase().includes(searchString) ||
          client.email.toLowerCase().includes(searchString) ||
          client.telephone.toLowerCase().includes(searchString) ||
          appointmentDate.includes(searchString) ||
          dateForSearch.includes(searchString) ||
          client.type.toLowerCase().includes(searchString) ||
          client.profile.toLowerCase().includes(searchString) ||
          client.notes?.toLowerCase().includes(searchString) ||
          client.compteRendu?.toLowerCase().includes(searchString);
      })
      .sort((a, b) => {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortByRecent ? dateB - dateA : dateA - dateB;
      });
  }, [clientGroups, searchQuery, selectedProfile, sortByRecent]);

  const getProfileLabel = (profile: string): { icon: string; label: string } => {
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
        Gestion des contacts
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
        {filteredClients.map((client) => (
          <Grid item xs={12} key={client.email}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      spacing={2}
                    >
                      <Stack spacing={1}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Typography variant="h6">
                            {client.prenom} {client.nom}
                          </Typography>
                          <Chip
                            label={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                {getProfileLabel(client.profile).icon}{' '}
                                {getProfileLabel(client.profile).label}
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
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {client.email} • {client.telephone}
                        </Typography>
                      </Stack>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          onClick={() => handleOpenClientDetails(client)}
                        >
                          Détails client
                        </Button>
                      </Stack>
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
