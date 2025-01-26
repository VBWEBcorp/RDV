# Application de Gestion de Rendez-vous

## Fonctionnalités

### Gestion des rendez-vous
- Planification avec date et heure
- Types de rendez-vous :
  - Physique (avec champ pour le lieu)
  - Téléphonique
  - Visioconférence (génération automatique de lien Google Meet)
- Informations requises pour chaque rendez-vous :
  - Nom du client*
  - Prénom du client*
  - Email du client*
  - Téléphone du client*
  - Notes (optionnel)
- Modification et suppression des rendez-vous

### Interface
- Vue des rendez-vous à venir
- Historique des rendez-vous passés
- CRM avec informations clients

## Notes techniques
- Frontend : React avec TypeScript
- État géré via Context API
- Interface responsive et moderne
- Validation des champs obligatoires (marqués par *)

## Installation et démarrage
1. Installer les dépendances : `npm install`
2. Démarrer l'application : `npm run dev`
3. Accéder à l'application : http://localhost:5173
