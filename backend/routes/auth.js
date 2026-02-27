const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient({
    datasources: {
        db: {
            url: process.env.DATABASE_URL
        }
    }
});

const JWT_SECRET = 'SuperSecretoMinero2026!#'; 

// ==========================================
// 1. ENDPOINT: INICIAR SESIÓN REAL (/api/auth/login)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // 2. Buscamos al usuario REAL en la base de datos por su correo
        // Nota: Prisma suele poner la primera letra en minúscula. Si tu tabla en SQL 
        // se llama "Usuarios", en Prisma será "usuarios". 
        const usuarioDB = await prisma.usuarios.findFirst({
            where: { 
                correoElectronico: usuario 
            }
        });

        // 3. Si no existe en la base de datos...
        if (!usuarioDB) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // 4. Verificamos la contraseña
        // Por ahora comparamos texto plano asumiendo que así las guardaste en SQL Server.
        // Más adelante aplicaremos bcrypt.compare() cuando crees el módulo de Registro.
        const passwordValida = (password === usuarioDB.contrasenaHash);

        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // 5. ¡Usuario verificado! Generamos su token digital
        const token = jwt.sign(
            { idUsuario: usuarioDB.idUsuario, idRol: usuarioDB.idRol },
            JWT_SECRET,
            { expiresIn: '8h' }
        );

        // 6. Enviamos los datos a Flutter
        res.status(200).json({
            token: token,
            usuario: {
                idUsuario: usuarioDB.idUsuario,
                idRol: usuarioDB.idRol,
                nombres: usuarioDB.nombres,
                apellidoPaterno: usuarioDB.apellidoPaterno,
                correoElectronico: usuarioDB.correoElectronico
            }
        });

    } catch (error) {
        console.error("Error en el Login:", error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// ... (Aquí mantienes las otras rutas de recuperar, verificar-codigo y cambiar-password que ya tenías)