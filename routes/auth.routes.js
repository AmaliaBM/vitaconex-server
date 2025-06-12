
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const express = require('express');
const router = express.Router();




router.post('/login', async (req, res) => { 
  const { email, password } = req.body;
 
  try {
    const user = await User.findOne({ email });
   
    if (!user) return res.status(404).json({ msg: 'Usuario no encontrado' });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ msg: 'Credenciales incorrectas' });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1d',
    });

    res.json({ token, user: { id: user._id, name: user.name, role: user.role } });
  } catch (err) { 
    
    res.status(500).json({ msg: 'Error en login'});
  }
});
router.post('/register', async (req, res) => {
  const { name, lastname, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, lastname, email, password: hash, role });
    res.status(201).json(newUser);
  } catch (err) {
    res.status(400).json({ msg: 'Error al registrar usuario' });
  }
});
router.post('/logout', (req, res) => {

  res.json({ msg: 'Sesión cerrada correctamente' });
});

module.exports = router;
