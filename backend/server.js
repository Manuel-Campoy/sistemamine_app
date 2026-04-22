require('dotenv').config();

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const compression = require('compression');
const cookieParser = require('cookie-parser'); 
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg'); 
const http = require('http');
const { Server } = require('socket.io');

// ==========================================
// IMPORTAR RUTAS
// ==========================================
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const vehiculosRoutes = require('./routes/vehiculos');
const minasRoutes = require('./routes/minas');
const prospeccionRoutes = require('./routes/prospeccion');
const movimientosRoutes = require('./routes/movimientos');
const dashboardRoutes = require('./routes/dashboard');
const produccionRoutes = require('./routes/produccion');
const reportesRoutes = require('./routes/reportes');
const combustibleRoutes = require('./routes/combustible');
const permisosRoutes = require('./routes/permisos');

// ==========================================
// CONFIGURACIÓN DE BASE DE DATOS Y SERVIDOR
// ==========================================
const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
    throw new Error('Falta la variable DATABASE_URL. Configúrala en tu entorno o en backend/.env');
}

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    throw new Error('JWT_SECRET es obligatorio en variables de entorno');
}

const pool = new Pool({ 
    connectionString: databaseUrl,
    max: 50, 
    idleTimeoutMillis: 30000 
});

const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });
const app = express();
const PORT = process.env.PORT || 3000;
const origenesPermitidos = ['http://localhost:5173', 'http://localhost:3000', 'http://localhost:4173'];

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: origenesPermitidos,
        methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        credentials: true
    }
});

app.set('socketio', io); 

// ==========================================
// MIDDLEWARES GLOBALES
// ==========================================
app.use(cors({
    origin: function (origin, callback) {
        if (!origin || origenesPermitidos.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Acceso denegado por políticas de CORS.'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], 
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
}));

app.use(express.json({ limit: '200mb' }));
app.use(express.urlencoded({ limit: '200mb', extended: true }));
app.use(helmet());
app.use(compression());
app.use(cookieParser()); 

const limitadorGeneral = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 1000, 
    message: {error: 'Demasiadas solicitudes desde esta IP, por favor intenta de nuevo después de 15 minutos.'},
    standardHeaders: true,
    legacyHeaders: false,
});

const limitadorLogin = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 5, 
    message: {error: 'Demasiados intentos de login desde esta IP, por favor intenta de nuevo después de 15 minutos.'},
});

app.use('/api/', limitadorGeneral); 
app.use('/api/login', limitadorLogin);

// ==========================================
// HEALTH CHECK (Ping de conexión)
// ==========================================
app.get('/api/ping', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date() });
});

// ==========================================
// RUTAS
// ==========================================
app.use('/api', authRoutes(prisma));
app.use('/api/usuarios', usuariosRoutes(prisma));
app.use('/api/vehiculos', vehiculosRoutes(prisma));
app.use('/api/minas', minasRoutes(prisma));
app.use('/api/prospeccion', prospeccionRoutes(prisma));
app.use('/api/movimientos', movimientosRoutes(prisma));
app.use('/api/dashboard', dashboardRoutes(prisma));
app.use('/api/produccion', produccionRoutes(prisma));
app.use('/api/reportes', reportesRoutes(prisma));
app.use('/api/combustible', combustibleRoutes(prisma));
app.use('/api/auth', permisosRoutes(prisma));


// ==========================================
// INICIO DEL SERVIDOR
// ==========================================
server.listen(PORT, () => {
    console.log(`\nServidor ejecutándose en puerto ${PORT}`);
    console.log(`WebSockets activo en ws://localhost:${PORT}`);
    console.log(`Orígenes permitidos: ${origenesPermitidos.join(', ')}`);
    console.log(`Ambiente: ${process.env.NODE_ENV || 'development'}\n`);
});

// Manejo graceful shutdown
process.on('SIGTERM', async () => {
    console.log('SIGTERM recibido, cerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});

process.on('SIGINT', async () => {
    console.log('SIGINT recibido, cerrando servidor...');
    await prisma.$disconnect();
    process.exit(0);
});
