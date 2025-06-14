const jwt = require('jsonwebtoken');

// Middleware para verificar si el usuario está autenticado
const isAuthenticated = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: 'No autorizado: token faltante o mal formado' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // Guardamos los datos del usuario en req.user
    next();
  } catch {
    return res.status(403).json({ msg: 'Token inválido o expirado' });
  }
};

// Middleware para verificar y obtener el payload del token
const verifyToken = (req, res, next) => {
  console.log("Ejecutando middleware verifyToken");

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ errorMessage: "Token no enviado o mal formado" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET); // Renombrado
    req.user = decodedToken;
    next();
  } catch (error) {
    res.status(401).json({ errorMessage: "Token inválido o expirado" });
  }
};

// Middleware para roles específicos
const isAdmin = (req, res, next) => {
  if (req.user.role !== 'admin') return res.status(403).json({ msg: 'Acceso solo para admins' });
  next();
};

const isSanitario = (req, res, next) => {
  if (req.user.role !== 'sanitario') return res.status(403).json({ msg: 'Acceso solo para sanitarios' });
  next();
};

const isPaciente = (req, res, next) => {
  if (req.user.role !== 'paciente') return res.status(403).json({ msg: 'Acceso solo para pacientes' });
  next();
};

module.exports = {
  isAuthenticated,
  verifyToken,
  isAdmin,
  isSanitario,
  isPaciente
};

