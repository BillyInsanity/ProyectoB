const express = require('express');
const router = express.Router();
const userController = require('./userController'); // La ruta al controlador es local

// Rutas
router.post('/', userController.createUser); // Ruta POST para crear usuario
router.get('/', userController.getAllUsers); // Ruta GET para obtener usuarios

module.exports = router;