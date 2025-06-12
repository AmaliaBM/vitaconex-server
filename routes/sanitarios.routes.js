const express = require('express');
const router = express.Router();
const Appoitment = require('../models/Appoitment.model');
const User = require('../models/User.model');
const MedicalRecord = require('../models/MedicalRecord.model');
const JournalEntry = require('../models/JournalEntry.model');

const { isAuthenticated, isSanitario } = require('../middlewares/auth.middleware');

// CITAS
router.get('/citas', async (req, res) => {
  try {
    const start = new Date(); //--> define el inicio y fin del día completo (de medianoche a medianoche), no las horas laborales de los sanitarios.
    start.setHours(0, 0, 0, 0);
    const end = new Date();
    end.setHours(23, 59, 59, 999);

    const citas = await Appoitment.find({
      medicoId: req.user.id,
      datetime: { $gte: start, $lte: end }
    }).populate('pacienteId', 'name lastname');

    res.json(citas);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener citas del día' });
  }
});

// PACIENTES
router.get('/pacientes', async (req, res) => {
  try {
    const pacientes = await User.find({ assignedSanitarios: req.user.id }, 'name lastname email');
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener pacientes asignados' });
  }
});
router.get('/pacientes/:pacienteId', getPatientDetails);

// HISTORIAL MÉDICO
router.get('/pacientes/:pacienteId/medical-records', async (req, res) => {
  try {
    const paciente = await User.findById(req.params.pacienteId);
    if (!paciente) return res.status(404).json({ msg: 'Paciente no encontrado' });

    const records = await MedicalRecord.find({ pacienteId: paciente._id });
    res.json({ paciente, historial: records });
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener detalles del paciente' });
  }
});

// CREAR REGISTRO MÉDICO
router.post('/pacientes/:pacienteId/medical-records', async (req, res) => {
  const { pacienteId } = req.params;
  const { contenido } = req.body;
  try {
    const newRecord = await MedicalRecord.create({
      pacienteId,
      medicoId: req.user.id,
      contenido,
      fecha: new Date()
    });
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ msg: 'Error al crear registro' });
  }
});

// JOURNALING
router.get('/pacientes/:pacienteId/journaling', async (req, res) => {
  const { pacienteId } = req.params;
  try {
    const journals = await JournalEntry.find({ pacienteId }).sort({ fecha: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener journaling' });
  }
});

module.exports = router;

