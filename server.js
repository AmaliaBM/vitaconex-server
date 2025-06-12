require('dotenv').config();

const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const indexRoutes = require('./routes/index.routes');
const connectDB = require('./db/index'); // asumiendo que exportas la conexión

connectDB();

const app = express();

app.use(cors());
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', indexRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});
