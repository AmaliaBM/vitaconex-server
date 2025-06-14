const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const router = express.Router();

const User = require("../models/User.model");
const { verifyToken } = require("../middlewares/auth.middleware");

// SIGNUP - Registro
router.post("/signup", async (req, res) => {
  const { name, lastname, email, password, datebirth } = req.body;

  if (!name || !lastname || !email || !password || !datebirth) {
    return res.status(400).json({
      errorMessage:
        "Todos los campos son obligatorios (nombre, apellido, email, contraseña, fecha nacimiento)",
    });
  }

  const regexPassword =
    /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{8,16}$/;
  if (!regexPassword.test(password)) {
    return res.status(400).json({
      errorMessage:
        "La contraseña debe tener al menos una letra, un número, un carácter especial y entre 8 y 16 caracteres",
    });
  }

  try {
    const foundUser = await User.findOne({ email });
    if (foundUser) {
      return res.status(400).json({
        errorMessage: "Ya existe un usuario con ese correo electrónico",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);

    await User.create({
      name,
      lastname,
      datebirth,
      email,
      password: hashPassword,
      role: "paciente",
      isActive: false,
    });

    return res.status(201).json({
      msg: "Tu registro fue enviado. Administración debe aprobar tu cuenta antes de poder acceder.",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Error en el servidor durante el registro" });
  }
});

// LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({ msg: "Usuario no encontrado" });
    }

    const passwordCorrect = await bcrypt.compare(password, user.password);
    if (!passwordCorrect) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const payload = {
      _id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "2d",
    });

    res.status(200).json({
      authToken: token,
      user: payload, // Enviamos toda la info necesaria
    });

  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({ msg: "Error del servidor" });
  }
});

// VERIFY - para verificar token en frontend

router.get("/verify", verifyToken, (req, res) => {
  res.json({ payload: req.user }); // ← Corrige aquí (antes decía req.payload)
});

module.exports = router;