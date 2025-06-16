
const express = require('express');
const router = express.Router();
const { isAuthenticated, isPaciente } = require('../middlewares/auth.middleware');
const JournalEntry = require('../models/JournalEntry.model');
const Appointment = require('../models/Appoitment.model')
const MedicalRecord = require('../models/MedicalRecord.model');


router.use(isAuthenticated, isPaciente);



router.get('/journals', async (req, res) => {
  try {
    const journals = await JournalEntry.find({ pacienteId: req.user._id }).sort({ fecha: -1 }); //ordena por fecha descendentejo
    res.json(journals);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener el journaling' });
  }
});

router.get('/journals/:id', async (req, res) => {
  try {
    const journal = await JournalEntry.findOne({ _id: req.params.id, pacienteId: req.user._id });
    if (!journal) return res.status(404).json({ msg: 'Entrada no encontrada' });
    res.json(journal);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener la entrada' });
  }
});
router.post('/journals', async (req, res) => {
  const { estadoAnimo, diario } = req.body;
  try {
    const newEntry = await JournalEntry.create({
      pacienteId: req.user._id,
      estadoAnimo,
      diario,
      fecha: new Date(),
    });
    res.status(201).json(newEntry);
  } catch (err) {
    res.status(400).json({ msg: 'Error al crear entrada' });
  }
});
router.put('/journals/:id', async (req, res) => {
  try {
    const updated = await JournalEntry.findOneAndUpdate(
      { _id: req.params.id, pacienteId: req.user._id },
      req.body,
      { new: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Entrada no encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: 'Error al actualizar entrada' });
  }
});

router.delete('/journals/:id', async (req, res) => {
  try {
    const deleted = await JournalEntry.findOneAndDelete({ _id: req.params.id, pacienteId: req.user._id });
    if (!deleted) return res.status(404).json({ msg: 'Entrada no encontrada' });
    res.json({ msg: 'Eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar entrada' });
  }
});


router.get("/appointments", isAuthenticated, async (req, res) => {
  try {
    const userId = req.user._id;

    const appointments = await Appointment.find({ pacienteId: userId })
      .populate("medicoId", "name lastname");

    res.json(appointments);
  } catch (err) {
    res.status(500).json({ message: "Error al obtener citas" });
  }
});


router.get('/medical-records', async (req, res) => {
  try {
    const records = await MedicalRecord.find({ pacienteId: req.user._id }).populate('medicoId', 'name lastname');
    res.json(records);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener historial médico' });
  }
});

module.exports = router;
