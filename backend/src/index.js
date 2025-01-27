const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const sequelize = require('./config/database');
const appointmentRoutes = require('./routes/appointmentRoutes');

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/appointments', appointmentRoutes);

// Test de connexion à la base de données
sequelize.authenticate()
  .then(() => {
    console.log('Connexion à la base de données établie avec succès.');
  })
  .catch(err => {
    console.error('Impossible de se connecter à la base de données:', err);
  });

// Synchronisation des modèles avec la base de données
sequelize.sync({ alter: true })
  .then(() => {
    console.log('Base de données synchronisée');
  })
  .catch(err => {
    console.error('Erreur lors de la synchronisation:', err);
  });

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
