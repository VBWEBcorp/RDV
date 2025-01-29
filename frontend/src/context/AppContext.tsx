import React, { createContext, useContext, useState } from 'react';
import { Appointment } from '../types';

interface AppContextType {
  appointments: Appointment[];
  addAppointment: (appointment: Appointment) => void;
  updateAppointment: (id: string, updatedAppointment: Appointment) => void;
  deleteAppointment: (id: string) => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Données de test
const testAppointments: Appointment[] = [
  {
    id: '1',
    date: '2025-01-30T10:00:00',
    duree: 60,
    type: 'physique',
    nom: 'Dupont',
    prenom: 'Jean',
    email: 'jean.dupont@example.com',
    telephone: '0123456789',
    notes: 'Premier rendez-vous',
    profile: 'prospect'
  },
  {
    id: '2',
    date: '2025-01-30T14:30:00',
    duree: 30,
    type: 'video',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@example.com',
    telephone: '0987654321',
    notes: 'Suivi mensuel',
    profile: 'client'
  },
  {
    id: '3',
    date: '2025-01-31T09:00:00',
    duree: 45,
    type: 'telephone',
    nom: 'Bernard',
    prenom: 'Pierre',
    email: 'pierre.bernard@example.com',
    telephone: '0654321987',
    profile: 'lead'
  },
  {
    id: '4',
    date: '2025-02-01T11:00:00',
    duree: 60,
    type: 'physique',
    nom: 'Dubois',
    prenom: 'Marie',
    email: 'marie.dubois@example.com',
    telephone: '0678901234',
    notes: 'Consultation initiale',
    profile: 'prospect'
  },
  {
    id: '5',
    date: '2025-02-05T15:00:00',
    duree: 30,
    type: 'video',
    nom: 'Petit',
    prenom: 'Thomas',
    email: 'thomas.petit@example.com',
    telephone: '0612345678',
    notes: 'Point d\'avancement',
    profile: 'client'
  },
  {
    id: '6',
    date: '2025-02-10T10:30:00',
    duree: 45,
    type: 'telephone',
    nom: 'Moreau',
    prenom: 'Julie',
    email: 'julie.moreau@example.com',
    telephone: '0698765432',
    profile: 'lead'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(testAppointments);

  const addAppointment = (appointment: Appointment) => {
    setAppointments(prev => [...prev, appointment]);
  };

  const updateAppointment = (id: string, updatedAppointment: Appointment) => {
    setAppointments(prev =>
      prev.map(apt => (apt.id === id ? updatedAppointment : apt))
    );
  };

  const deleteAppointment = (id: string) => {
    setAppointments(prev => prev.filter(apt => apt.id !== id));
  };

  const value = {
    appointments,
    addAppointment,
    updateAppointment,
    deleteAppointment
  };

  return (
    <AppContext.Provider value={value}>
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
