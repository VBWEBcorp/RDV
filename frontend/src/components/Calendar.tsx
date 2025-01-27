import React from 'react';
import { Box, Typography, Stack, Chip, Paper, IconButton } from '@mui/material';
import { format, eachDayOfInterval, startOfWeek, endOfWeek, isSameDay, isToday, addWeeks, subWeeks } from 'date-fns';
import { fr } from 'date-fns/locale';
import { Appointment } from '../types';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';

interface CalendarProps {
  appointments: Appointment[];
  onSelectEvent: (appointment: Appointment) => void;
}

export function Calendar({ appointments, onSelectEvent }: CalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const weekStart = startOfWeek(currentDate, { locale: fr });
  const weekEnd = endOfWeek(currentDate, { locale: fr });
  const daysOfWeek = eachDayOfInterval({ start: weekStart, end: weekEnd });

  const handlePreviousWeek = () => {
    setCurrentDate(prevDate => subWeeks(prevDate, 1));
  };

  const handleNextWeek = () => {
    setCurrentDate(prevDate => addWeeks(prevDate, 1));
  };

  const getAppointmentsForDay = (date: Date) => {
    return appointments.filter(apt => isSameDay(new Date(apt.date), date));
  };

  const getAppointmentColor = (type: string) => {
    switch (type) {
      case 'physical':
        return '#4caf50';
      case 'phone':
        return '#ff9800';
      case 'video':
        return '#2196f3';
      default:
        return '#9e9e9e';
    }
  };

  return (
    <Box sx={{ width: '100%' }}>
      <Stack 
        direction="row" 
        spacing={2} 
        alignItems="center" 
        justifyContent="space-between"
        sx={{ mb: 2 }}
      >
        <IconButton 
          onClick={handlePreviousWeek}
          sx={{ 
            color: '#4EBAEC',
            '&:hover': {
              backgroundColor: 'rgba(78,186,236,0.1)',
            }
          }}
        >
          <ChevronLeft />
        </IconButton>
        <Typography 
          variant="h6" 
          sx={{ 
            color: '#4EBAEC',
            fontWeight: 600,
            fontSize: { xs: '1rem', sm: '1.25rem' }
          }}
        >
          {format(weekStart, 'd MMMM', { locale: fr })} - {format(weekEnd, 'd MMMM yyyy', { locale: fr })}
        </Typography>
        <IconButton 
          onClick={handleNextWeek}
          sx={{ 
            color: '#4EBAEC',
            '&:hover': {
              backgroundColor: 'rgba(78,186,236,0.1)',
            }
          }}
        >
          <ChevronRight />
        </IconButton>
      </Stack>

      <Stack spacing={2}>
        {daysOfWeek.map((day) => (
          <Paper
            key={day.toISOString()}
            elevation={0}
            sx={{
              p: 2,
              background: isToday(day) 
                ? 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)'
                : 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
              borderRadius: 2,
              border: isToday(day) ? '2px solid #4EBAEC' : '1px solid rgba(0,0,0,0.08)',
              position: 'relative',
            }}
          >
            <Typography
              variant="h6"
              sx={{
                mb: 2,
                fontWeight: isToday(day) ? 600 : 500,
                color: isToday(day) ? '#4EBAEC' : 'text.primary',
                fontSize: { xs: '1rem', sm: '1.25rem' },
                wordBreak: 'break-word'
              }}
            >
              {format(day, 'EEEE d MMMM', { locale: fr })}
            </Typography>

            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ gap: 1 }}>
              {getAppointmentsForDay(day).map((apt) => (
                <Chip
                  key={apt.id}
                  label={`${format(new Date(apt.date), 'HH:mm')} - ${apt.nom} ${apt.prenom}`}
                  onClick={() => onSelectEvent(apt)}
                  sx={{
                    backgroundColor: getAppointmentColor(apt.type),
                    color: 'white',
                    fontWeight: 500,
                    fontSize: { xs: '0.75rem', sm: '0.875rem' },
                    height: 'auto',
                    '& .MuiChip-label': {
                      px: 2,
                      py: 1,
                      whiteSpace: 'normal',
                      display: 'block'
                    },
                    '&:hover': {
                      backgroundColor: getAppointmentColor(apt.type),
                      filter: 'brightness(0.9)',
                      transform: 'translateY(-1px)',
                    },
                    transition: 'all 0.2s ease-in-out',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                  }}
                />
              ))}
              {getAppointmentsForDay(day).length === 0 && (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    fontStyle: 'italic',
                    py: 1
                  }}
                >
                  Aucun rendez-vous
                </Typography>
              )}
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
