const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const appointmentRoutes = require('./routes/appointmentRoutes');

app.use(cors());
app.use(express.json());

app.use('/api/appointments', appointmentRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});
