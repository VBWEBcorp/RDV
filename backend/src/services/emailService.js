const nodemailer = require('nodemailer');
const schedule = require('node-schedule');

// Créer un transporteur SMTP réutilisable
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: process.env.SMTP_PORT,
  secure: process.env.SMTP_PORT === '465',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Fonction pour envoyer un email
const sendEmail = async (to, subject, text) => {
  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject,
      text,
    });
    console.log('Email envoyé:', info.messageId);
    return info;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email:', error);
    throw error;
  }
};

// Fonction pour programmer un rappel
exports.scheduleReminder = (appointment) => {
  const reminderDate = new Date(appointment.date);
  reminderDate.setHours(reminderDate.getHours() - 24); // Rappel 24h avant

  // Annuler tout rappel existant pour ce rendez-vous
  if (schedule.scheduledJobs[`reminder-${appointment.id}`]) {
    schedule.scheduledJobs[`reminder-${appointment.id}`].cancel();
  }

  // Programmer le nouveau rappel
  if (reminderDate > new Date()) {
    schedule.scheduleJob(`reminder-${appointment.id}`, reminderDate, async () => {
      try {
        const subject = 'Rappel de rendez-vous';
        const text = `
Bonjour ${appointment.prenom} ${appointment.nom},

Ceci est un rappel pour votre rendez-vous prévu demain à ${new Date(appointment.date).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.

Type de rendez-vous : ${appointment.type}
${appointment.meetLink ? `Lien de visioconférence : ${appointment.meetLink}` : ''}
${appointment.location ? `Lieu : ${appointment.location}` : ''}

À bientôt !
        `;

        await sendEmail(appointment.email, subject, text);
      } catch (error) {
        console.error('Erreur lors de l\'envoi du rappel:', error);
      }
    });
  }
};
