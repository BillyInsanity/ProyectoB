const express = require('express');
const router = express.Router();
const clientController = require('./clientController'); // La ruta al controlador es local

// Rutas
router.post('/', clientController.creatClient); // Ruta POST para crear cliente
router.get('/', clientController.getAllClient); // Ruta GET para crear clientes

module.exports = router;