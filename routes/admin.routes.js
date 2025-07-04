const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User.model');
const Appointment = require('../models/Appoitment.model')



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
  try {
    let { name, lastname, email, password, role, datebirth, assignedSanitarios } = req.body;

    if (!assignedSanitarios) {
      assignedSanitarios = null;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      lastname,
      email,
      password: hashedPassword,
      role,
      datebirth,
      assignedSanitarios,
    });

    await newUser.save();

    // Para no enviar la contraseña en la respuesta:
    const userResponse = newUser.toObject();
    delete userResponse.password;

    res.status(201).json(userResponse);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error al crear usuario' });
  }
});

// PUT /admin/users/:id
router.put('/users/:id', async (req, res) => {
  try {
    const updates = { ...req.body };

    if (updates.assignedSanitarios === "") {
      updates.assignedSanitarios = null;
    }

    if (updates.password) {
      updates.password = await bcrypt.hash(updates.password, 10);
    }

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, { new: true }).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ msg: 'Usuario no encontrado' });
    }

    res.json(updatedUser);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error al actualizar usuario' });
  }
});

// DELETE /admin/users/:id/secure
router.delete('/users/:id/secure', async (req, res) => {
  const { password } = req.body;
  const userMakingRequest = req.user; // viene del middleware isAuthenticated

  try {
    const adminUser = await User.findById(userMakingRequest._id);
    if (!adminUser) return res.status(401).json({ msg: 'Admin no encontrado' });

    const validPassword = await bcrypt.compare(password, adminUser.password);
    if (!validPassword) {
      return res.status(401).json({ msg: 'Contraseña incorrecta' });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Usuario no encontrado' });

    res.json({ msg: 'Usuario eliminado correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar usuario' });
  }
});

// GET citas
router.get("/appointments", isAuthenticated, async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate("pacienteId", "name lastname")
      .populate("medicoId", "name lastname");
    res.json(appointments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error al obtener citas" });
  }
});

// GET cita por id
router.get('/appointments/:id', isAuthenticated, async (req, res) => {
  try {
    const cita = await Appointment.findById(req.params.id)
      .populate('pacienteId', 'name lastname')
      .populate('medicoId', 'name lastname');
    if (!cita) return res.status(404).json({ msg: 'Cita no encontrada' });
    res.json(cita);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al obtener cita' });
  }
});

// POST crear cita
router.post('/appointments', isAuthenticated, async (req, res) => {
  const { pacienteId, medicoId, datetime, estado } = req.body;
  try {
    const nuevaCita = await Appointment.create({
      pacienteId,
      medicoId,
      datetime,
      estado
    });
    res.status(201).json(nuevaCita);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error al crear cita' });
  }
});

// PUT actualizar cita
router.put('/appointments/:id', isAuthenticated, async (req, res) => {
  try {
    const updated = await Appointment.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updated) return res.status(404).json({ msg: 'Cita no encontrada' });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(400).json({ msg: 'Error al actualizar cita' });
  }
});

// DELETE cita
router.delete('/appointments/:id', isAuthenticated, async (req, res) => {
  try {
    const deleted = await Appointment.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ msg: 'Cita no encontrada' });
    res.json({ msg: 'Cita eliminada correctamente' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Error al eliminar cita' });
  }
});

module.exports = router;
