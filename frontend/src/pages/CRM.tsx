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
  const [selectedProfile, setSelectedProfile] = React.useState<string | null>(null);
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
        
        // Si la recherche est vide, on montre tout
        if (!searchString) return true;

        // Formatage de la date pour la recherche
        const appointmentDate = format(new Date(client.date), 'dd/MM/yyyy HH:mm', { locale: fr }).toLowerCase();
        const dateForSearch = format(new Date(client.date), 'dd MM yyyy HH mm', { locale: fr }).toLowerCase();
        
        // Recherche dans tous les champs pertinents
        const matchesSearch =
          client.nom.toLowerCase().includes(searchString) ||
          client.prenom.toLowerCase().includes(searchString) ||
          client.email.toLowerCase().includes(searchString) ||
          client.telephone.toLowerCase().includes(searchString) ||
          appointmentDate.includes(searchString) ||
          dateForSearch.includes(searchString) ||
          client.type.toLowerCase().includes(searchString) ||
          client.profile.toLowerCase().includes(searchString) ||
          client.notes?.toLowerCase().includes(searchString) ||
          client.compteRendu?.toLowerCase().includes(searchString);

        const matchesProfile =
          selectedProfile === null || client.profile === selectedProfile;

        return matchesSearch && matchesProfile;
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
        <Box sx={{ 
          display: 'flex',
          gap: 1,
          overflowX: 'auto',
          pb: 1,
          width: '100%',
          '&::-webkit-scrollbar': {
            height: '4px',
          },
          '&::-webkit-scrollbar-track': {
            background: '#f1f1f1',
            borderRadius: '2px',
          },
          '&::-webkit-scrollbar-thumb': {
            background: '#888',
            borderRadius: '2px',
          },
        }}>
          <Chip
            label="Tous"
            onClick={() => setSelectedProfile(null)}
            variant={selectedProfile === null ? 'filled' : 'outlined'}
            color={selectedProfile === null ? 'primary' : 'default'}
            sx={{ minWidth: 'fit-content' }}
          />
          <Chip
            icon={<span>🎯</span>}
            label="Lead"
            onClick={() => setSelectedProfile('lead')}
            variant={selectedProfile === 'lead' ? 'filled' : 'outlined'}
            color={selectedProfile === 'lead' ? 'primary' : 'default'}
            sx={{ minWidth: 'fit-content' }}
          />
          <Chip
            icon={<span>🌱</span>}
            label="Prospect"
            onClick={() => setSelectedProfile('prospect')}
            variant={selectedProfile === 'prospect' ? 'filled' : 'outlined'}
            color={selectedProfile === 'prospect' ? 'primary' : 'default'}
            sx={{ minWidth: 'fit-content' }}
          />
          <Chip
            icon={<span>⭐</span>}
            label="Client"
            onClick={() => setSelectedProfile('client')}
            variant={selectedProfile === 'client' ? 'filled' : 'outlined'}
            color={selectedProfile === 'client' ? 'primary' : 'default'}
            sx={{ minWidth: 'fit-content' }}
          />
          <Chip
            icon={<span>👤</span>}
            label="Staff"
            onClick={() => setSelectedProfile('staff')}
            variant={selectedProfile === 'staff' ? 'filled' : 'outlined'}
            color={selectedProfile === 'staff' ? 'primary' : 'default'}
            sx={{ minWidth: 'fit-content' }}
          />
          <Chip
            icon={<span>🤝</span>}
            label="Partenaire"
            onClick={() => setSelectedProfile('partenaire')}
            variant={selectedProfile === 'partenaire' ? 'filled' : 'outlined'}
            color={selectedProfile === 'partenaire' ? 'primary' : 'default'}
            sx={{ minWidth: 'fit-content' }}
          />
        </Box>
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
