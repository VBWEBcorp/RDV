import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useApp } from '../context/AppContext';

export function CRM() {
  const { appointments } = useApp();
  const clientStats = React.useMemo(() => {
    const stats = new Map();
    
    appointments.forEach(apt => {
      const clientKey = `${apt.nom} ${apt.prenom}`;
      const existing = stats.get(clientKey) || { count: 0, lastVisit: null };
      
      stats.set(clientKey, {
        count: existing.count + 1,
        lastVisit: !existing.lastVisit || new Date(apt.date) > existing.lastVisit 
          ? new Date(apt.date) 
          : existing.lastVisit
      });
    });
    
    return Array.from(stats.entries())
      .map(([name, data]) => ({
        name,
        ...data
      }))
      .sort((a, b) => b.count - a.count);
  }, [appointments]);

  return (
    <Box sx={{ 
      p: 3, 
      width: '100%',
      mt: { xs: 8, sm: 2 }
    }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        fontWeight="600"
        sx={{
          background: 'linear-gradient(45deg, #2196f3 30%, #90caf9 90%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          mb: { xs: 3, sm: 4 },
          fontSize: { xs: '1.5rem', sm: '2rem', md: '2.125rem' },
          pt: { xs: 2, sm: 0 }
        }}
      >
        Gestion de la clientèle
      </Typography>

      <Stack spacing={2}>
        {clientStats.map((client) => (
          <Card
            key={client.name}
            sx={{
              background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
              border: '1px solid rgba(0,0,0,0.08)',
            }}
          >
            <CardContent>
              <Stack spacing={1}>
                <Typography variant="h6" sx={{ 
                  color: '#2196f3',
                  fontSize: { xs: '1rem', sm: '1.25rem' }
                }}>
                  {client.name}
                </Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    label={`${client.count} rendez-vous`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196f3',
                      fontWeight: 500
                    }}
                  />
                  <Chip
                    label={`Dernier RDV: ${format(client.lastVisit, 'dd/MM/yyyy', { locale: fr })}`}
                    size="small"
                    sx={{
                      backgroundColor: 'rgba(33, 150, 243, 0.1)',
                      color: '#2196f3',
                      fontWeight: 500
                    }}
                  />
                </Stack>
              </Stack>
            </CardContent>
          </Card>
        ))}

        {clientStats.length === 0 && (
          <Card sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.08)',
          }}>
            <Typography color="text.secondary">
              Aucun client enregistré
            </Typography>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
