const express = require('express');
const router = express.Router();


const authRoutes = require('./auth.routes');
const pacienteRoutes = require('./pacientes.routes');
const adminRoutes = require('./admin.routes');
const sanitarioRoutes = require('./sanitarios.routes');


router.use('/auth', authRoutes);
router.use('/pacientes', pacienteRoutes);
router.use('/admin', adminRoutes);
router.use('/sanitarios', sanitarioRoutes);

module.exports = router;

