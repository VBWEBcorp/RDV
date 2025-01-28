export type AppointmentType = 'physique' | 'telephone' | 'video';
export type ProfileType = 'lead' | 'prospect' | 'client' | 'staff' | 'partenaire';

export interface Client {
  id: string;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  profile: ProfileType;
  notes?: string;
}

export interface Appointment {
  id: string;
  date: string;
  duree: number;
  type: AppointmentType;
  nom: string;
  prenom: string;
  email: string;
  telephone: string;
  notes?: string;
  profile: ProfileType;
  location?: string;
  meetLink?: string;
  compteRendu?: string;
}
