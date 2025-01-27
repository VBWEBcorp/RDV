import React from 'react';
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  Card,
  CardContent,
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Chip,
  IconButton,
  ToggleButtonGroup,
  ToggleButton,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
import { useApp } from '../context/AppContext';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ClientData {
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profile: string;
  totalAppointments: number;
  lastAppointment: {
    date: string;
    type: string;
    compteRendu?: string;
  } | null;
}

export function CRM() {
  const { appointments } = useApp();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [selectedProfile, setSelectedProfile] = React.useState('all');
  const [selectedClient, setSelectedClient] = React.useState<ClientData | null>(null);

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

  const clients = React.useMemo(() => {
    const clientMap = new Map<string, ClientData>();

    appointments.forEach(apt => {
      const clientKey = `${apt.nom}-${apt.prenom}-${apt.email}`;
      const existingClient = clientMap.get(clientKey);

      if (existingClient) {
        existingClient.totalAppointments++;
        if (!existingClient.lastAppointment || new Date(apt.date) > new Date(existingClient.lastAppointment.date)) {
          existingClient.lastAppointment = {
            date: apt.date,
            type: apt.type,
            compteRendu: apt.compteRendu,
          };
        }
      } else {
        clientMap.set(clientKey, {
          nom: apt.nom,
          prenom: apt.prenom,
          email: apt.email,
          telephone: apt.telephone,
          profile: apt.profile,
          totalAppointments: 1,
          lastAppointment: {
            date: apt.date,
            type: apt.type,
            compteRendu: apt.compteRendu,
          },
        });
      }
    });

    return Array.from(clientMap.values());
  }, [appointments]);

  const filteredClients = React.useMemo(() => {
    return clients.filter(client => {
      const searchDate = searchTerm.split('/').reverse().join('-'); // Convertit dd/mm/yyyy en yyyy-mm-dd
      const matchesSearch = 
        client.nom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.prenom.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        client.telephone.includes(searchTerm) ||
        (client.lastAppointment && client.lastAppointment.date.includes(searchDate));
      
      const matchesProfile = selectedProfile === 'all' || client.profile === selectedProfile;
      
      return matchesSearch && matchesProfile;
    });
  }, [clients, searchTerm, selectedProfile]);

  const handleProfileChange = (event: React.MouseEvent<HTMLElement>, newProfile: string) => {
    if (newProfile !== null) {
      setSelectedProfile(newProfile);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
    >
      <Box sx={{ p: { xs: 0, sm: 3 } }}>
        <Typography
          variant="h4"
          sx={{
            mb: 4,
            color: '#4EBAEC',
            fontWeight: 600,
            px: { xs: 2, sm: 0 },
            pt: { xs: 2, sm: 0 },
          }}
        >
          Gestion des Clients (CRM)
        </Typography>

        <Card
          elevation={0}
          sx={{
            mb: 3,
            mx: { xs: 2, sm: 0 },
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            border: '1px solid #e2e8f0',
            borderRadius: 2,
          }}
        >
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Rechercher par nom, prénom, email, téléphone ou date (jj/mm/aaaa)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: 'text.secondary' }} />
                    </InputAdornment>
                  ),
                }}
              />

              <ToggleButtonGroup
                value={selectedProfile}
                exclusive
                onChange={handleProfileChange}
                aria-label="profil filter"
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
            </Stack>
          </CardContent>
        </Card>

        <Stack spacing={2} sx={{ px: { xs: 2, sm: 0 } }}>
          {filteredClients.map((client, index) => (
            <motion.div
              key={`${client.nom}-${client.prenom}-${client.email}`}
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
                onClick={() => setSelectedClient(client)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>
                      <Typography variant="h6">
                        {client.nom} {client.prenom}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {client.email}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {client.telephone}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <Chip
                        label={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            {getProfileIcon(client.profile)} {client.profile}
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
                      <Typography variant="body2" sx={{ fontWeight: 500 }}>
                        {client.totalAppointments} RDV
                      </Typography>
                      {client.lastAppointment && (
                        <Typography variant="body2" color="text.secondary">
                          Dernier : {format(new Date(client.lastAppointment.date), 'dd/MM/yyyy')}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>
      </Box>

      <Dialog
        open={!!selectedClient}
        onClose={() => setSelectedClient(null)}
        maxWidth="sm"
        fullWidth
      >
        {selectedClient && (
          <>
            <DialogTitle>
              <Typography variant="h6" sx={{ fontWeight: 600 }}>
                {selectedClient.nom} {selectedClient.prenom}
              </Typography>
            </DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Contact
                  </Typography>
                  <Typography variant="body1">{selectedClient.email}</Typography>
                  <Typography variant="body1">{selectedClient.telephone}</Typography>
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Profil
                  </Typography>
                  <Chip
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {getProfileIcon(selectedClient.profile)} {selectedClient.profile}
                      </Box>
                    }
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(78,186,236,0.1)',
                      color: 'primary.main',
                      fontWeight: 500,
                      mt: 1,
                    }}
                  />
                </Box>

                <Box>
                  <Typography variant="subtitle2" color="text.secondary">
                    Statistiques
                  </Typography>
                  <Typography variant="body1">
                    Nombre total de rendez-vous : {selectedClient.totalAppointments}
                  </Typography>
                </Box>

                {selectedClient.lastAppointment && (
                  <Box>
                    <Typography variant="subtitle2" color="text.secondary">
                      Dernier rendez-vous
                    </Typography>
                    <Typography variant="body1">
                      {format(new Date(selectedClient.lastAppointment.date), 'PPP à HH:mm', { locale: fr })}
                    </Typography>
                    <Typography variant="body1">
                      Type : {selectedClient.lastAppointment.type}
                    </Typography>
                    {selectedClient.lastAppointment.compteRendu && (
                      <>
                        <Typography variant="subtitle2" color="text.secondary" sx={{ mt: 1 }}>
                          Compte rendu
                        </Typography>
                        <Typography variant="body1">
                          {selectedClient.lastAppointment.compteRendu}
                        </Typography>
                      </>
                    )}
                  </Box>
                )}
              </Stack>
            </DialogContent>
          </>
        )}
      </Dialog>
    </motion.div>
  );
}
