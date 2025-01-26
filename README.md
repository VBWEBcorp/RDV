# Outil de Gestion de Rendez-vous

Application web moderne pour la gestion efficace des rendez-vous professionnels.

## Structure du Projet

```
Admin RDV/
├── frontend/          # Application React (TypeScript)
├── backend/           # API FastAPI (Python)
└── instructions.md    # Spécifications du projet
```

## Prérequis

- Node.js (v16+)
- Python (v3.8+)
- npm ou yarn

## Installation

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
# Activer l'environnement virtuel
.\venv\Scripts\activate  # Windows
source venv/bin/activate # Linux/Mac

# Installer les dépendances
pip install -r requirements.txt

# Lancer le serveur
uvicorn main:app --reload
```

## Fonctionnalités

- Gestion complète des rendez-vous (création, modification, suppression)
- Types de rendez-vous : physique, téléphonique, visioconférence
- Génération automatique des liens Google Meet
- Interface responsive et intuitive
- CRM intégré pour la gestion des clients

## Technologies Utilisées

### Frontend
- React avec TypeScript
- Material-UI (MUI)
- React Router
- Axios
- Date-fns

### Backend
- FastAPI
- SQLAlchemy
- SQLite
- Google Calendar API
- Google Meet API
