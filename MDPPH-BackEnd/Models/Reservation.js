// Models/Reservation.js
const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    nombreHuesped: { type: String, required: true }, // Nombre del huésped
    fechaReservacion: { type: Date, required: true }, // Fecha de la reservación
    tipoIntegrantes: { type: String, required: true }, // e.g., '1-6', 'otro', etc.
    cantidadIntegrantes: { type: Number, required: true }, // Número final de integrantes (calculado)
    hotel: { type: String, required: true }, // Nombre del hotel/paquete
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Referencia al usuario que reserva (para autenticación)
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Reservation', reservationSchema);