
const User = require('../models/User.model');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { verifyToken } = require("../middlewares/auth.middleware");

const express = require('express');
const router = express.Router();

router.post("/signup", async (req, res, next) => {
  //deberia recibir la data del usuario

  console.log(req.body);
  const { name, email, password } = req.body;
  //1. que todos los campos existan y tengas valores
  if (!name || !email || !password) {
    res.status(400).json({
      errorMessage:
        "Todos los campos son obligatorios (username, email, password)",
    });
    return;
  }

  //3. validaciones de la contraseña
  let regexPassword = /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  if (regexPassword.test(password) === false) {
    res.status(400).json({
      errorMessage:
        "La contraseña no es válida, debe contener al menos una letra, un número, un carácter especial y entre 8 y 16 caracteres",
    });
    return;
  }

  try {
    //3. Que el email sea unico
    //*Sería findOne porque queremos encontrar el primer documento que cumpla con esta condición, es igual que el find de js
    const foundUser = await User.findOne({ email: email });
    //*console.log(foundUser);
    if (foundUser !== null) {
      res.status(400).json({
        errorMessage: "Ya existe un usuario con ese correo electrónico",
      });
      return;
    }

    // Cifrado de la contraseña
    const hashPassword = await bcrypt.hash(password, 12);
    //*12 es la cantidad de cifrado qe queremos añadir
    //*Hash viene de la documentacion oficial bcrypt

    //crear el documento en la base de datos
    await User.create({
      name,
      lastname,
      datebirth,
      email,
      password: hashPassword,
    });

    res.sendStatus(201);
  } catch (error) {
    console.log(error);
  }
});



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
router.post('/signup', async (req, res) => {
  const { name, lastname, email, password, role } = req.body;
  try {
    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ name, lastname, email, password: hash, role, isActive: false });
    res.status(201).json(({ msg: 'Usuario registrado. Pendiente de aprobación por administración.' }));
  } catch (err) {
    res.status(400).json({ msg: 'Error al registrar usuario' });
  }
});

//GET "/api/auth/verify" => Validar el token (luego de generarlo
//y cuando el usuario vuelva a la app luego)

router.get("/verify", verifyToken, (req, res) => {
    res.json({ payload: req.payload })
})

module.exports = router;
