// Types for appointment management
export type AppointmentType = 'video' | 'physique' | 'telephone';
export type ProfileType = 'lead' | 'prospect' | 'client' | 'staff' | 'partenaire';

export interface Client {
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    profile: ProfileType;
    adresse?: string;
}

export interface Appointment {
    id: string;
    date: string;
    type: AppointmentType;
    client: Client;
    duree: number;
    location: string;
    meetLink: string;
    lienVisio?: string;
    notes?: string;
    compteRendu?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
}
// Force déploiement
