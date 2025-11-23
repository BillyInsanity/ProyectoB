// Server.js
const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config({ path: './Config/.env' }); // Carga .env desde Config/

const app = express();

// Middlewares
app.use(express.json()); // Para parsear JSON
app.use(express.static('public')); // Sirve archivos estáticos desde 'public/'

// Conectar a MongoDB
const connectDB = require('./Config/MongoDB');
connectDB();

// Rutas (comenta las que no uses por ahora)
app.use('/api/auth', require('./Modules/Auth/authRoutes'));
// app.use('/api/client', require('./Modules/Client/ClientRoutes'));
// app.use('/api/user', require('./Modules/User/UserRoutes'));

// Ruta para reservaciones (la única activa por ahora)
app.use('/api/reservation', require('./Modules/Reservation/ReservationRoutes'));

// Puerto
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Servidor corriendo en puerto ${PORT}`));