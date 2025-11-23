  // Config/MongoDB.js
  const mongoose = require('mongoose');

  const connectDB = async () => {
      try {
          // Conectar usando la URI del .env
          await mongoose.connect(process.env.MONGO_URI, {
              useNewUrlParser: true,
              useUnifiedTopology: true,
              // Opciones adicionales si es necesario (e.g., para Atlas)
          });
          console.log('Conectado a MongoDB exitosamente.');
      } catch (error) {
          console.error('Error al conectar a MongoDB:', error.message);
          process.exit(1); // Detiene el servidor si falla la conexión
      }
  };

  module.exports = connectDB;
  