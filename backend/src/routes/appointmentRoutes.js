const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');

// Routes pour les rendez-vous
router.get('/', appointmentController.getAppointments);
router.post('/', appointmentController.createAppointment);
router.put('/:id', appointmentController.updateAppointment);
router.delete('/:id', appointmentController.deleteAppointment);

module.exports = router;
