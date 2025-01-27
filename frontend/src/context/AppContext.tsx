import React, { createContext, useContext, useState, useEffect } from 'react';
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
    date: '2025-01-27T10:00:00',
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
    date: '2025-01-27T14:30:00',
    duree: 30,
    type: 'video',
    nom: 'Martin',
    prenom: 'Sophie',
    email: 'sophie.martin@example.com',
    telephone: '0987654321',
    notes: 'Suivi projet',
    profile: 'client'
  },
  {
    id: '3',
    date: '2025-01-28T09:00:00',
    duree: 45,
    type: 'telephone',
    nom: 'Bernard',
    prenom: 'Pierre',
    email: 'pierre.bernard@example.com',
    telephone: '0654321987',
    notes: 'Point mensuel',
    profile: 'partenaire'
  }
];

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appointments, setAppointments] = useState<Appointment[]>(() => {
    const savedAppointments = localStorage.getItem('appointments');
    if (savedAppointments) {
      return JSON.parse(savedAppointments);
    }
    // Si pas de rendez-vous sauvegardés, utiliser les données de test
    return testAppointments;
  });

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

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

  return (
    <AppContext.Provider
      value={{
        appointments,
        addAppointment,
        updateAppointment,
        deleteAppointment,
      }}
    >
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
