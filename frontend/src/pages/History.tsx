import React from 'react';
import { Box, Typography, Card, CardContent, Stack, Chip } from '@mui/material';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';
import { useApp } from '../context/AppContext';

export function History() {
  const app = useApp();
  const pastAppointments = app.appointments.filter(apt => new Date(apt.date) < new Date());

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
        Historique des rendez-vous
      </Typography>

      <Stack spacing={2}>
        {pastAppointments.length > 0 ? (
          pastAppointments
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((appointment) => (
              <Card
                key={appointment.id}
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
                      {format(new Date(appointment.date), 'EEEE d MMMM yyyy', { locale: fr })}
                    </Typography>
                    <Typography variant="body1">
                      {appointment.nom} {appointment.prenom}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="center">
                      <Chip
                        label={`${format(new Date(appointment.date), 'HH:mm')}`}
                        size="small"
                        sx={{
                          backgroundColor: 'rgba(33, 150, 243, 0.1)',
                          color: '#2196f3',
                          fontWeight: 500
                        }}
                      />
                      <Chip
                        label={
                          appointment.type === 'physical' ? 'Physique' :
                          appointment.type === 'phone' ? 'Téléphone' : 'Visio'
                        }
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
            ))
        ) : (
          <Card sx={{ 
            p: 4, 
            textAlign: 'center',
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: 2,
            boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
            border: '1px solid rgba(0,0,0,0.08)',
          }}>
            <Typography color="text.secondary">
              Aucun rendez-vous passé
            </Typography>
          </Card>
        )}
      </Stack>
    </Box>
  );
}
