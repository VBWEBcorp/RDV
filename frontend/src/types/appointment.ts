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
    time: string;
    patient_name: string;
    patient_email: string;
    patient_phone: string;
    status: 'pending' | 'confirmed' | 'cancelled';
    notes?: string;
    created_at?: string;
    updated_at?: string;
}
// Force déploiement
