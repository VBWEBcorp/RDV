export type AppointmentType = 'video' | 'physique' | 'telephone';
export type ProfileType = 'lead' | 'prospect' | 'client' | 'staff' | 'partenaire';

export interface Appointment {
    id: string;
    date: string;
    type: AppointmentType;
    email: string;
    telephone: string;
    duree: number;
    nom: string;
    prenom: string;
    adresse?: string;
    location?: string;
    meetLink?: string;
    lienVisio?: string;
    notes?: string;
    compteRendu?: string;
    profile: ProfileType;
    status?: 'pending' | 'confirmed' | 'cancelled';
}
