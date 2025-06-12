
const express = require('express');
const router = express.Router();
const { isAuthenticated, isSanitario } = require('../middlewares/auth.middleware');


const {
  getOwnAppointments,
  getPacienteDetails,
  getMedicalRecordsByPaciente,
  addMedicalRecord,
  getJournalingByPaciente
} = require('../controllers/sanitarios.controller');

router.use(isAuthenticated, isSanitario);

router.get('/appointments', getOwnAppointments);
router.get('/pacientes/:id', getPacienteDetails);
router.get('/pacientes/:id/medical-records', getMedicalRecordsByPaciente);
router.post('/pacientes/:id/medical-records', addMedicalRecord);
router.get('/pacientes/:id/journals', getJournalingByPaciente);

module.exports = router;
