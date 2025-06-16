const express = require('express');
const router = express.Router();
const Appointment = require('../models/Appoitment.model')
const User = require('../models/User.model');
const MedicalRecord = require('../models/MedicalRecord.model');
const JournalEntry = require('../models/JournalEntry.model');

const { isAuthenticated, isSanitario } = require('../middlewares/auth.middleware');


router.use(isAuthenticated, isSanitario);

// CITAS
router.get("/appointments", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await Appointment.find({ medicoId: userId })
      .populate("pacienteId", "name lastname");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener citas" });
  }
});


// PACIENTES
router.get('/users', async (req, res) => {
  try {
    const pacientes = await User.find({ assignedSanitarios: req.user._id }, 'name lastname email');
    res.json(pacientes);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener pacientes asignados' });
  }
});

//PACIENTE EN CONCRETO

router.get('/users/:userId',  async (req, res) => {
  try {
    const paciente = await User.findById(req.params.userId);
    if (!paciente) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(paciente);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
});

// HISTORIAL MÉDICO
router.get('/medical-records/:userId', async (req, res) => {
  try {
    const paciente = await User.findById(req.params.userId);
    if (!paciente) return res.status(404).json({ msg: 'Paciente no encontrado' });

    const records = await MedicalRecord.find({ pacienteId: paciente._id });
    res.json({ paciente, historial: records });
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener detalles del paciente' });
  }
});


// CREAR REGISTRO MÉDICO
router.post('/medical-records/:userId', async (req, res) => {
  const { userId } = req.params;
  const { contenido } = req.body;
  try {
    const newRecord = await MedicalRecord.create({
      pacienteId: userId,
      medicoId: req.user._id,
      contenido,
      fecha: new Date()
    });
    res.status(201).json(newRecord);
  } catch (err) {
    res.status(400).json({ msg: 'Error al crear registro' });
  }
});

// JOURNALING
router.get('/journaling/:userId', async (req, res) => {
  const { userId } = req.params;
  try {
    const journals = await JournalEntry.find({ pacienteId: userId }).sort({ fecha: -1 });
    res.json(journals);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener journaling' });
  }
});

module.exports = router;

