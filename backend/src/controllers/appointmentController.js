const db = require('../config/database');
const { scheduleReminder } = require('../services/emailService');

// Stockage temporaire des rendez-vous (à remplacer par une base de données)
// let appointments = [];

exports.createAppointment = async (req, res) => {
  try {
    const {
      date,
      duree,
      type,
      nom,
      prenom,
      email,
      telephone,
      notes,
      profile,
      location,
      meetLink,
      compteRendu
    } = req.body;

    const result = await db.query(
      `INSERT INTO appointments 
       (date, duree, type, nom, prenom, email, telephone, notes, profile, location, meet_link, compte_rendu)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
       RETURNING *`,
      [date, duree, type, nom, prenom, email, telephone, notes, profile, location, meetLink, compteRendu]
    );

    const appointment = result.rows[0];
    
    // Programmer le rappel par email
    if (email) {
      scheduleReminder(appointment);
    }

    res.status(201).json(appointment);
  } catch (error) {
    console.error('Erreur lors de la création du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la création du rendez-vous' });
  }
};

exports.getAppointments = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM appointments ORDER BY date DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Erreur lors de la récupération des rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la récupération des rendez-vous' });
  }
};

exports.updateAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      date,
      duree,
      type,
      nom,
      prenom,
      email,
      telephone,
      notes,
      profile,
      location,
      meetLink,
      compteRendu
    } = req.body;

    const result = await db.query(
      `UPDATE appointments 
       SET date = $1, duree = $2, type = $3, nom = $4, prenom = $5, 
           email = $6, telephone = $7, notes = $8, profile = $9,
           location = $10, meet_link = $11, compte_rendu = $12
       WHERE id = $13
       RETURNING *`,
      [date, duree, type, nom, prenom, email, telephone, notes, profile, 
       location, meetLink, compteRendu, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    const appointment = result.rows[0];
    
    // Reprogrammer le rappel si la date a changé
    if (email && date) {
      scheduleReminder(appointment);
    }

    res.json(appointment);
  } catch (error) {
    console.error('Erreur lors de la mise à jour du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du rendez-vous' });
  }
};

exports.deleteAppointment = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('DELETE FROM appointments WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erreur lors de la suppression du rendez-vous:', error);
    res.status(500).json({ message: 'Erreur lors de la suppression du rendez-vous' });
  }
};
