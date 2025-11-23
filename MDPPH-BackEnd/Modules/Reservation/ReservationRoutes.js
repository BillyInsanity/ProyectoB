// Modules/Reservation/ReservationRoutes.js
const express = require('express');
const router = express.Router();
const reservationController = require('./ReservationController');
const authMiddleware = require('../../Middleware/authMiddleware'); // Protege las rutas

// Ruta para crear una reservación (requiere autenticación)
router.post('/create', reservationController.createReservation);
router.post('/create', authMiddleware, reservationController.createReservation);
// Ruta opcional para obtener reservaciones del usuario
router.get('/my-reservations', reservationController.getUserReservations);
router.get('/my-reservations', authMiddleware, reservationController.getUserReservations);

module.exports = router;