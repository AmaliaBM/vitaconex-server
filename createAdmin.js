
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/User.model');

// Conecta a la base de datos
//Este archivo me permite haber creado desde el código un usuario y así hacer las pruebas pertinentes en postman de una forma más fluida. Para la entrega del proyecto este archivo se puede borrar o ignorar. 
mongoose.connect('mongodb://localhost:27017/data-vitaconex', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  console.log('Conectado a MongoDB');

  const email = 'admin@vitaconex.com';
  const password = '1234';

  // Verificar si el admin ya existe
  const existingAdmin = await User.findOne({ email });
  if (existingAdmin) {
    console.log('Usuario admin ya existe');
    mongoose.disconnect();
    return;
  }

  // Hashear la contraseña
  const hashedPassword = await bcrypt.hash(password, 10);

  // Crear nuevo usuario admin
  const adminUser = new User({
    name: 'Admin',
    lastname: 'User',
    datebirth: new Date("1992-02-24"),
    email: email,
    password: hashedPassword,
    role: 'admin',
    isActive: true,
  });

  // Guardar en DB
  await adminUser.save();

  console.log('Usuario súper admin creado con éxito');
  mongoose.disconnect();
})
.catch(err => {
  console.error('Error:', err);
});
