const express = require('express');
const app = express();
const indexRoutes = require('./routes/index.routes');

app.use(express.json());
app.use('/api', indexRoutes);

