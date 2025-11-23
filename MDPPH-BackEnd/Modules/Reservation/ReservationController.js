// Modules/Reservation/ReservationController.js
const Reservation = require('../../Models/Reservation');

exports.createReservation = async (req, res) => {
    try {
        const { nombreHuesped, fechaReservacion, tipoIntegrantes, cantidadIntegrantes, hotel } = req.body;
        const userId = req.user.id; // Asumiendo que authMiddleware agrega req.user

        // Validaciones adicionales (opcional, ya que el frontend valida)
        if (!nombreHuesped || !fechaReservacion || !tipoIntegrantes || !cantidadIntegrantes || !hotel) {
            return res.status(400).json({ message: 'Todos los campos son requeridos.' });
        }

        // Crear la reservación
        const newReservation = new Reservation({
            nombreHuesped,
            fechaReservacion: new Date(fechaReservacion), // Asegura formato Date
            tipoIntegrantes,
            cantidadIntegrantes: parseInt(cantidadIntegrantes),
            hotel,
            userId
        });

        await newReservation.save();
        res.status(201).json({ message: 'Reservación creada exitosamente.', reservation: newReservation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear la reservación.' });
    }
};

// Opcional: Obtener reservaciones del usuario
exports.getUserReservations = async (req, res) => {
    try {
        const userId = req.user.id;
        const reservations = await Reservation.find({ userId }).sort({ createdAt: -1 });
        res.status(200).json(reservations);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener reservaciones.' });
    }
};