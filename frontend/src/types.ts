export type AppointmentType = 'physique' | 'telephone' | 'video';

export interface Appointment {
  id: string;
  date: string;
  duree: number;
  type: AppointmentType;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  lienVisio?: string;
  notes?: string;
  compteRendu?: string;
  profile: 'lead' | 'prospect' | 'client' | 'staff' | 'partenaire';
}

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  adresse?: string;
  lastVisit?: Date;
  lastAppointment?: {
    compteRendu?: string;
  };
  profile?: 'lead' | 'prospect' | 'client' | 'staff' | 'partenaire';
}
