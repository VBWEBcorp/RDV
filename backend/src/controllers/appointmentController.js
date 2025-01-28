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
      to: appointment.email,
      subject: 'Confirmation de rendez-vous',
      text: `Votre rendez-vous a été confirmé pour le ${appointment.date}`
    });

    res.status(201).json(appointment);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Obtenir tous les rendez-vous
exports.getAppointments = async (req, res) => {
  try {
    const appointments = await Appointment.findAll();
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
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }

    await appointment.update(req.body);
    
    // Envoyer un email de mise à jour si nécessaire
    if (req.body.date) {
      await transporter.sendMail({
        from: process.env.SMTP_USER,
        to: appointment.email,
        subject: 'Mise à jour du rendez-vous',
        text: `Votre rendez-vous a été mis à jour pour le ${appointment.date}`
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
    const { id } = req.params;
    const appointment = await Appointment.findByPk(id);
    
    if (!appointment) {
      return res.status(404).json({ error: 'Rendez-vous non trouvé' });
    }

    await appointment.destroy();
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
