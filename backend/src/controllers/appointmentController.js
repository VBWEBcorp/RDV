const Appointment = require('../models/Appointment');
const nodemailer = require('nodemailer');
require('dotenv').config();

// Configuration du transporteur email
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Créer un rendez-vous
exports.createAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.create(req.body);
    
    // Envoyer un email de confirmation
    await transporter.sendMail({
      from: process.env.SMTP_USER,
      to: appointment.patientEmail,
      subject: 'Confirmation de rendez-vous',
      text: `Votre rendez-vous a été programmé pour le ${appointment.date} à ${appointment.time}.`
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir tous les rendez-vous
exports.getAllAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll({
      order: [['date', 'ASC'], ['time', 'ASC']]
    });
    res.json(appointments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Obtenir un rendez-vous par ID
exports.getAppointmentById = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    res.json(appointment);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Mettre à jour un rendez-vous
exports.updateAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    
    await appointment.update(req.body);
    
    // Envoyer un email de mise à jour si le statut a changé
    if (req.body.status) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: appointment.patientEmail,
        subject: 'Mise à jour de votre rendez-vous',
        text: `Le statut de votre rendez-vous du ${appointment.date} à ${appointment.time} a été mis à jour : ${req.body.status}`
      });
    }

    res.json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Supprimer un rendez-vous
exports.deleteAppointment = async (req, res) => {
  try {
    const appointment = await Appointment.findByPk(req.params.id);
    if (!appointment) {
      return res.status(404).json({ message: 'Rendez-vous non trouvé' });
    }
    
    await appointment.destroy();
    res.json({ message: 'Rendez-vous supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
