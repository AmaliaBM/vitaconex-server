
const express = require('express');
const router = express.Router();
const { isAuthenticated, isPaciente } = require('../middlewares/auth.middleware');


const {
  getJournals,
  getJournalById,
  createJournal,
  updateJournal,
  deleteJournal,
  getAppointments,
  getMedicalRecords
} = require('../controllers/pacientes.controller');

router.use(isAuthenticated, isPaciente);


router.get('/journals', getJournals);
router.get('/journals/:id', getJournalById);
router.post('/journals', createJournal);
router.put('/journals/:id', updateJournal);
router.delete('/journals/:id', deleteJournal);


router.get('/appointments', getAppointments);
router.get('/medical-records', getMedicalRecords);

module.exports = router;
