const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json()); // Permite a la API entender el JSON que manda Flutter

// Aquí conectaremos nuestras rutas de autenticación
app.use('/api/auth', require('./routes/auth'));

// Ruta de prueba para saber si el servidor está vivo
app.app.get('/api/health', (req, res) => {
    res.json({ status: 'OK', message: 'Servidor de SistemaMine funcionando ' });
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});