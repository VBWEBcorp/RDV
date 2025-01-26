import React, { createContext, useContext, useState } from 'react';
import { Appointment, Client } from '../types';

interface AppContextType {
  appointments: Appointment[];
  clients: Client[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, appointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
  addClient: (client: Client) => void;
  updateClient: (id: string, client: Client) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [clients, setClients] = useState<Client[]>([]);

  const addAppointment = (appointment: Appointment) => {
    setAppointments([...appointments, appointment]);
  };

  const updateAppointment = (id: string, appointment: Appointment) => {
    setAppointments(appointments.map(a => a.id === id ? appointment : a));
  };

  const deleteAppointment = (id: string) => {
    setAppointments(appointments.filter(a => a.id !== id));
  };

  const addClient = (client: Client) => {
    setClients([...clients, client]);
  };

  const updateClient = (id: string, client: Client) => {
    setClients(clients.map(c => c.id === id ? client : c));
  };

  return (
    <AppContext.Provider value={{
      appointments,
      clients,
      addAppointment,
      updateAppointment,
      deleteAppointment,
      addClient,
      updateClient,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
