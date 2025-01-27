// Fonction pour générer un lien Google Meet unique
export function generateGoogleMeetLink(): string {
  // Générer un ID unique pour la réunion (10 caractères)
  const meetingId = Math.random().toString(36).substring(2, 12);
  
  // Créer le lien Google Meet avec l'ID
  return `https://meet.google.com/${meetingId}`;
}
