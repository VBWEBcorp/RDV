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
    duree: number;
    type: AppointmentType;
    nom: string;
    prenom: string;
    email: string;
    telephone: string;
    profile: ProfileType;
    notes?: string;
    compteRendu?: string;
    status?: 'pending' | 'confirmed' | 'cancelled';
    created_at?: string;
    updated_at?: string;
}
// Force déploiement
