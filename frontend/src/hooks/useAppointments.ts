import { useApp } from '../context/AppContext';

export function useAppointments() {
  const { appointments } = useApp();

  const futureAppointments = appointments
    .filter(apt => new Date(apt.date) > new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const pastAppointments = appointments
    .filter(apt => new Date(apt.date) <= new Date())
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return {
    appointments,
    futureAppointments,
    pastAppointments
  };
}
