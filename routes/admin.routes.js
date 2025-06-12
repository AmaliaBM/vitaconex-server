
const express = require('express');
const router = express.Router();
const { isAuthenticated, isAdmin } = require('../middlewares/auth.middleware');


const {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getAllAppointments
} = require('../controllers/admin.controller');

router.use(isAuthenticated, isAdmin);


router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.post('/users', createUser);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);


router.get('/appointments', getAllAppointments);

module.exports = router;
