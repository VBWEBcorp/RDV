import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  useTheme,
  Stack,
  Fade,
  Grow,
} from '@mui/material';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { useApp } from '../context/AppContext';
import { format, startOfMonth, endOfMonth, subMonths, isWithinInterval } from 'date-fns';
import { fr } from 'date-fns/locale';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

interface ProfileStats {
  lead: number;
  prospect: number;
  client: number;
  staff: number;
  partenaire: number;
  [key: string]: number;
}

const PROFILE_COLORS: { [key: string]: string } = {
  lead: '#FF6B6B',
  prospect: '#4ECDC4',
  client: '#45B7D1',
  staff: '#96CEB4',
  partenaire: '#FFEEAD'
};

const PROFILE_ICONS: { [key: string]: string } = {
  lead: '🎯',
  prospect: '🌱',
  client: '⭐',
  staff: '👥',
  partenaire: '🤝'
};

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <Paper
        elevation={3}
        sx={{
          p: 2,
          backgroundColor: 'rgba(255, 255, 255, 0.95)',
          border: '1px solid #e2e8f0',
        }}
      >
        <Typography variant="subtitle2" sx={{ mb: 1 }}>
          {label}
        </Typography>
        {payload.map((entry: any) => (
          <Box key={entry.name} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 0.5 }}>
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                backgroundColor: entry.fill,
              }}
            />
            <Typography variant="body2">
              {entry.name}: {entry.value}
            </Typography>
          </Box>
        ))}
      </Paper>
    );
  }
  return null;
};

export function Statistics() {
  const { appointments } = useApp();
  const theme = useTheme();
  const [selectedMonth] = React.useState(new Date());

  // Fonction pour obtenir les statistiques du mois
  const getMonthStats = (date: Date) => {
    const start = startOfMonth(date);
    const end = endOfMonth(date);
    
    const monthAppointments = appointments.filter(apt => 
      isWithinInterval(new Date(apt.date), { start, end })
    );

    const profileStats: ProfileStats = {
      lead: 0,
      prospect: 0,
      client: 0,
      staff: 0,
      partenaire: 0
    };

    monthAppointments.forEach(apt => {
      if (apt.profile) {
        profileStats[apt.profile]++;
      }
    });

    return {
      total: monthAppointments.length,
      profiles: profileStats,
      byProfile: Object.entries(profileStats).map(([key, value]) => ({
        name: key,
        value: value,
        icon: PROFILE_ICONS[key]
      }))
    };
  };

  // Données pour le graphique des 6 derniers mois
  const getLastSixMonthsData = () => {
    const data = [];
    for (let i = 5; i >= 0; i--) {
      const monthDate = subMonths(new Date(), i);
      const stats = getMonthStats(monthDate);
      data.push({
        name: format(monthDate, 'MMM', { locale: fr }),
        ...stats.profiles
      });
    }
    return data;
  };

  const currentStats = getMonthStats(selectedMonth);
  const sixMonthsData = getLastSixMonthsData();

  // Calcul de la variation par rapport au mois précédent
  const previousMonthStats = getMonthStats(subMonths(selectedMonth, 1));
  const variation = previousMonthStats.total === 0 ? 100 : 
    ((currentStats.total - previousMonthStats.total) / previousMonthStats.total) * 100;

  return (
    <Box sx={{ p: { xs: 2, md: 3 } }}>
      <Fade in timeout={800}>
        <Typography 
          variant="h4" 
          sx={{ 
            mb: 4,
            color: '#4EBAEC',
            fontWeight: 600,
          }}
        >
          Statistiques
        </Typography>
      </Fade>

      <Grid container spacing={3}>
        {/* Carte des statistiques du mois */}
        <Grid item xs={12} md={4}>
          <Grow in timeout={1000}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
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
                <Stack spacing={3}>
                  <Box>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      {format(selectedMonth, 'MMMM yyyy', { locale: fr })}
                    </Typography>
                    <Typography variant="h3" component="div" sx={{ mb: 1 }}>
                      {currentStats.total}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {variation >= 0 ? (
                        <TrendingUp sx={{ color: 'success.main' }} />
                      ) : (
                        <TrendingDown sx={{ color: 'error.main' }} />
                      )}
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: variation >= 0 ? 'success.main' : 'error.main',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5,
                        }}
                      >
                        {Math.abs(variation).toFixed(1)}% vs mois précédent
                      </Typography>
                    </Box>
                  </Box>

                  <Box>
                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                      Répartition par profil
                    </Typography>
                    <Stack spacing={1.5}>
                      {Object.entries(currentStats.profiles).map(([profile, count]) => (
                        <Box 
                          key={profile}
                          sx={{ 
                            display: 'flex', 
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            p: 1,
                            borderRadius: 1,
                            backgroundColor: 'rgba(0,0,0,0.02)',
                            transition: 'all 0.2s ease-in-out',
                            '&:hover': {
                              backgroundColor: 'rgba(0,0,0,0.04)',
                            },
                          }}
                        >
                          <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            {PROFILE_ICONS[profile]} {profile}
                          </Typography>
                          <Typography variant="body2" fontWeight="500">
                            {count}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Graphique des 6 derniers mois */}
        <Grid item xs={12} md={8}>
          <Grow in timeout={1200}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
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
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Évolution sur 6 mois
                </Typography>
                <Box sx={{ width: '100%', height: 300 }}>
                  <ResponsiveContainer>
                    <BarChart
                      data={sixMonthsData}
                      margin={{
                        top: 20,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                      <XAxis dataKey="name" stroke="#64748b" />
                      <YAxis stroke="#64748b" />
                      <Tooltip content={<CustomTooltip />} />
                      <Legend />
                      {Object.keys(PROFILE_COLORS).map((profile) => (
                        <Bar
                          key={profile}
                          dataKey={profile}
                          stackId="a"
                          fill={PROFILE_COLORS[profile]}
                          radius={[4, 4, 0, 0]}
                        />
                      ))}
                    </BarChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>

        {/* Graphique en camembert */}
        <Grid item xs={12}>
          <Grow in timeout={1400}>
            <Card 
              elevation={0}
              sx={{ 
                height: '100%',
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
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Répartition des profils
                </Typography>
                <Box sx={{ width: '100%', height: 300, display: 'flex', justifyContent: 'center' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={currentStats.byProfile}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value, icon }) => `${icon} ${value}`}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {currentStats.byProfile.map((entry, index) => (
                          <Cell 
                            key={`cell-${index}`} 
                            fill={PROFILE_COLORS[entry.name]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </Box>
              </CardContent>
            </Card>
          </Grow>
        </Grid>
      </Grid>
    </Box>
  );
}
