const Client = require('../Models/Client'); // Nota el cambio en la ruta

// Crear un nuevo cliente
exports.createClient = async (req, res) => {
  try {
    const newClient = new Client(req.body);
    await newClient.save();
    res.status(201).json(newClient);
  } catch (error) {
    res.status(400).json({ error: 'Error al crear el usuario. Verifique los datos.' });
  }
};
// Obtener todos los clientes
exports.getAllClient = async (req, res) => {
  try {
    const clients = await Client.find();
    res.status(200).json(clients);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener los usuarios.' });
  }
};