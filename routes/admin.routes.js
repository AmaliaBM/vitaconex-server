const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Appoitment = require('../models/Appoitment.model');



// Middleware de autenticación y autorización 
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');

// Todas las rutas requieren estar autenticado y tener rol admin
router.use(isAuthenticated, isAdmin);

// ==== USUARIOS ====

// GET /admin/users?role=sanitario&search=juan
router.get('/users', async (req, res) => {
  try {
    const { role, search } = req.query;
    let query = {};

    // Si hay un rol, lo añadimos al filtro
    if (role) {
      query.role = role;
    }

    let users;

    // Si hay un término de búsqueda, hacemos una búsqueda por separado
    if (search) {
      const regex = new RegExp(search, 'i');
      users = await User.find({
        ...query,
        $or: [
          { name: regex },
          { lastname: regex },
          { email: regex }
        ]
      }).select('-password');
    } else {
      users = await User.find(query).select('-password'); //En mongoose significa: "Devuélveme todos los campos del documento, excepto el campo password."
    }

    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener usuarios' });
  }
});


// GET /admin/users/:id
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener usuario' });
  }
});

// POST /admin/users
router.post('/users', async (req, res) => {
  const { name, lastname, email, password, role, datebirth, assignedSanitarios } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      name,
      lastname,
      email,
      password: hash,
      role,
      datebirth,
      isActive: true,
      assignedSanitarios
    });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ msg: 'Error al crear usuario' });
  }
});

// PUT /admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const updates = { ...req.body };
    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }
    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');
    if (!updatedUser) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json(updatedUser);
  } catch (err) {
    res.status(400).json({ msg: 'Error al actualizar usuario' });
  }
});

// DELETE /admin/users/:id
router.delete('/users/:id',async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Usuario no encontrado' });
    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
});

// ==== CITAS ====

// GET /admin/appointments?userId=xyz
router.get('/appointments', async (req, res) => {
  try {
    const { userId } = req.query;
    const filter = {};

    if (userId) {
      filter.$or = [{ pacienteId: userId }, { medicoId: userId }];
    }

    const citas = await Appoitment.find(filter).populate('pacienteId', 'name lastname').populate('medicoId', 'name lastname');
    res.json(citas);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener citas' });
  }
});

// GET /admin/appointments/:id
router.get('/appointments/:id', async (req, res) => {
  try {
    const cita = await Appoitment.findById(req.params.id).populate('pacienteId', 'name lastname').populate('medicoId', 'name lastname');
    if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' });
    res.json(cita);
  } catch (err) {
    res.status(500).json({ msg: 'Error al obtener cita' });
  }
});

// POST /admin/appointments
router.post('/appointments', async (req, res) => {
  const { pacienteId, medicoId, datetime, estado } = req.body;
  try {
    const nuevaCita = await Appoitment.create({
      pacienteId,
      medicoId,
      datetime,
      estado
    });
    res.status(201).json(nuevaCita);
  } catch (err) {
    res.status(400).json({ msg: 'Error al crear cita' });
  }
});

// PUT /admin/appointments/:id
router.put('/appointments/:id', async (req, res) => {
  try {
    const updated = await Appoitment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Cita no encontrada' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: 'Error al actualizar cita' });
  }
});

// DELETE /admin/appointments/:id
router.delete('/appointments/:id', async (req, res) => {
  try {
    const deleted = await Appoitment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Cita no encontrada' });
    res.json({ msg: 'Cita eliminada correctamente' });
  } catch (err) {
    res.status(500).json({ msg: 'Error al eliminar cita' });
  }
});

module.exports = router;
