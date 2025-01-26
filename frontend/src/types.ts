export type AppointmentType = 'physical' | 'phone' | 'video';

export interface Appointment {
  id: string;
  date: Date;
  type: AppointmentType;
  duree: number; // durée en minutes
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  location?: string;
  meetLink?: string;
  notes?: string;
  compteRendu?: {
    contenu: string;
    dateAjout: Date;
  };
}

export interface Client {
  id: string;
  name: string;
  email: string;
  phone: string;
  notes?: string;
}
