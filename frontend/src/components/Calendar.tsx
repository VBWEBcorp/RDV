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

  const appointmentsForDay = daysOfWeek.map(day => getAppointmentsForDay(day));

  return (
    <Box sx={{ 
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      width: '100%',
      maxWidth: '100%',
      mx: 'auto',
      px: { xs: 1, sm: 2, md: 3 },
    }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%',
        maxWidth: '800px',
        mb: 3,
      }}>
        <IconButton onClick={handlePreviousWeek} size="large" sx={{ color: '#4EBAEC' }}>
          <ChevronLeft />
        </IconButton>
        
        <Typography 
          variant="h6" 
          component="div"
          sx={{
            color: '#4EBAEC',
            fontWeight: 500,
            textAlign: 'center',
            flex: 1,
          }}
        >
          {format(weekStart, 'd MMMM')} - {format(weekEnd, 'd MMMM yyyy')}
        </Typography>

        <IconButton onClick={handleNextWeek} size="large" sx={{ color: '#4EBAEC' }}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box sx={{
        width: '100%',
        maxWidth: '800px',
        overflowX: 'auto',
        '&::-webkit-scrollbar': {
          height: '8px',
        },
        '&::-webkit-scrollbar-track': {
          background: '#f1f1f1',
          borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          background: '#4EBAEC',
          borderRadius: '4px',
        },
      }}>
        <Box sx={{
          display: 'flex',
          flexDirection: 'column',
          minWidth: { xs: '600px', md: '100%' },
        }}>
          {daysOfWeek.map((day, index) => (
            <Box 
              key={day.toISOString()} 
              sx={{
                mb: 2,
                p: 2,
                backgroundColor: isToday(day) ? 'rgba(78, 186, 236, 0.05)' : 'transparent',
                borderRadius: 2,
                border: '1px solid',
                borderColor: isToday(day) ? '#4EBAEC' : 'rgba(0, 0, 0, 0.12)',
              }}
            >
              <Typography 
                variant="subtitle1" 
                sx={{
                  mb: 1,
                  color: isToday(day) ? '#4EBAEC' : 'text.primary',
                  fontWeight: isToday(day) ? 600 : 500,
                }}
              >
                {format(day, 'EEEE d MMMM', { locale: fr })}
              </Typography>

              {appointmentsForDay[index].length > 0 ? (
                <Stack spacing={1}>
                  {appointmentsForDay[index].map((appointment) => (
                    <Paper
                      key={appointment.id}
                      elevation={0}
                      onClick={() => onSelectEvent(appointment)}
                      sx={{
                        p: 1.5,
                        backgroundColor: getAppointmentColor(appointment.type),
                        color: 'white',
                        borderRadius: 1,
                        cursor: 'pointer',
                        transition: 'transform 0.2s ease',
                        '&:hover': {
                          transform: 'translateX(4px)',
                        },
                      }}
                    >
                      <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {format(new Date(appointment.date), 'HH:mm')} ({appointment.duree} min)
                      </Typography>
                      <Typography variant="body2">
                        {appointment.nom} {appointment.prenom}
                      </Typography>
                    </Paper>
                  ))}
                </Stack>
              ) : (
                <Typography 
                  variant="body2" 
                  color="text.secondary"
                  sx={{ 
                    textAlign: 'center',
                    py: 2,
                    fontStyle: 'italic'
                  }}
                >
                  Aucun rendez-vous
                </Typography>
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Box>
  );
}
