const nodemailer = require('nodemailer');
const schedule = require('node-schedule');
require('dotenv').config();

// Créer le transporteur pour l'envoi d'emails
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Formater la date en français
function formatDate(date) {
  return new Intl.DateTimeFormat('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
}

// Envoyer un email de rappel
async function sendReminderEmail(appointment) {
  const date = new Date(appointment.date);
  const formattedDate = formatDate(date);
  
  const meetingType = {
    'physical': 'Physique',
    'phone': 'Téléphone',
    'video': 'Visioconférence'
  }[appointment.type];

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: 'contact@vbweb.fr',
    subject: `Rappel RDV dans 2h - ${appointment.nom} ${appointment.prenom}`,
    text: `Rappel de rendez-vous

Date : ${formattedDate}
Durée : ${appointment.duree} minutes
Type : ${meetingType}

${appointment.type === 'video' ? `🎥 LIEN DE VISIOCONFÉRENCE
${appointment.meetLink}

` : ''}${appointment.type === 'physical' ? `📍 LIEU
${appointment.location}

` : ''}INFORMATIONS CLIENT
Nom : ${appointment.nom} ${appointment.prenom}
Email : ${appointment.email}
Téléphone : ${appointment.telephone}

${appointment.notes ? `NOTES
${appointment.notes}` : ''}`,
    html: `
      <h2>Rappel de rendez-vous</h2>
      
      <p><strong>Date :</strong> ${formattedDate}<br>
      <strong>Durée :</strong> ${appointment.duree} minutes<br>
      <strong>Type :</strong> ${meetingType}</p>

      ${appointment.type === 'video' ? `
      <div style="margin: 20px 0; padding: 15px; background-color: #f0f9ff; border-left: 4px solid #4EBAEC; border-radius: 4px;">
        <h3 style="margin: 0 0 10px 0; color: #4EBAEC;">🎥 Lien de visioconférence</h3>
        <a href="${appointment.meetLink}" style="color: #4EBAEC; text-decoration: none;">${appointment.meetLink}</a>
      </div>
      ` : ''}
      
      ${appointment.type === 'physical' ? `
      <div style="margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">📍 Lieu</h3>
        <p style="margin: 0;">${appointment.location}</p>
      </div>
      ` : ''}

      <div style="margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">Informations client</h3>
        <p style="margin: 0;">
          <strong>Nom :</strong> ${appointment.nom} ${appointment.prenom}<br>
          <strong>Email :</strong> ${appointment.email}<br>
          <strong>Téléphone :</strong> ${appointment.telephone}
        </p>
      </div>

      ${appointment.notes ? `
      <div style="margin: 20px 0;">
        <h3 style="margin: 0 0 10px 0;">Notes</h3>
        <p style="margin: 0;">${appointment.notes}</p>
      </div>
      ` : ''}
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email de rappel envoyé pour le RDV avec ${appointment.nom} ${appointment.prenom}`);
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de rappel:', error);
  }
}

// Planifier un rappel par email
function scheduleReminder(appointment) {
  const appointmentDate = new Date(appointment.date);
  const reminderDate = new Date(appointmentDate.getTime() - (2 * 60 * 60 * 1000)); // 2 heures avant

  if (reminderDate > new Date()) {
    schedule.scheduleJob(reminderDate, () => {
      sendReminderEmail(appointment);
    });
    console.log(`Rappel programmé pour le RDV avec ${appointment.nom} ${appointment.prenom}`);
  }
}

module.exports = {
  scheduleReminder
};
