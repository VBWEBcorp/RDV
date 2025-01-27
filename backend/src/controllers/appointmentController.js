const { scheduleReminder } = require('../services/emailService');

// Stockage temporaire des rendez-vous (à remplacer par une base de données)
let appointments = [];

exports.createAppointment = (req, res) => {
  const appointment = {
    id: Date.now().toString(),
    ...req.body
  };
  
  appointments.push(appointment);
  
  // Programmer le rappel par email
  scheduleReminder(appointment);
  
  res.status(201).json(appointment);
};

exports.getAppointments = (req, res) => {
  res.json(appointments);
};

exports.updateAppointment = (req, res) => {
  const { id } = req.params;
  const appointmentIndex = appointments.findIndex(apt => apt.id === id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ message: 'Rendez-vous non trouvé' });
  }
  
  const updatedAppointment = {
    ...appointments[appointmentIndex],
    ...req.body
  };
  
  appointments[appointmentIndex] = updatedAppointment;
  
  // Reprogrammer le rappel si la date a changé
  if (req.body.date) {
    scheduleReminder(updatedAppointment);
  }
  
  res.json(updatedAppointment);
};

exports.deleteAppointment = (req, res) => {
  const { id } = req.params;
  appointments = appointments.filter(apt => apt.id !== id);
  res.status(204).send();
};
