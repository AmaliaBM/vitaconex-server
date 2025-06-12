
const jwt = require('jsonwebtoken');

const isAuthenticated = (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ msg: 'No autorizado' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch {
    return res.status(403).json({ msg: 'Token inválido' });
  }
};

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

module.exports = { isAuthenticated, isAdmin, isSanitario, isPaciente };
