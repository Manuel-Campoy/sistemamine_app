const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    const JWT_SECRET = process.env.JWT_SECRET;

    // ==========================================
    // CATÁLOGO DE ROLES 
    // ==========================================
    router.get('/roles', verificarToken(prisma), async (req, res) => {
        try {
            const roles = await prisma.rol.findMany({
                orderBy: { nombre: 'asc' }
            });
            res.json(roles);
        } catch (error) {
            console.error("Error al obtener roles:", error);
            res.status(500).json({ error: 'Error del servidor al obtener catálogo de roles.' });
        }
    });

    // ==========================================
    // LOGIN Y LOGOUT
    // ==========================================
    router.post('/login', async (req, res) => {
        const { email, password } = req.body;

        try {
            const usuario = await prisma.usuario.findFirst({
                where: { 
                    correo: { equals: email, mode: 'insensitive' } 
                },
                include: { rol: true } 
            });

            if (!usuario) return res.status(401).json({ error: 'Credenciales incorrectas' });
            if (usuario.activo === false) return res.status(403).json({ error: 'Cuenta deshabilitada. Contacte a TI.' });

            const passwordValida = await bcrypt.compare(password, usuario.contrasenahash);
            if (!passwordValida) return res.status(401).json({ error: 'Credenciales incorrectas (Contraseña invalida)' });

            const token = jwt.sign(
                { id: usuario.idusuario, rol: usuario.rol?.nombre, email: usuario.correo },
                JWT_SECRET, 
                { expiresIn: '8h' }
            );

            res.cookie('token', token, {
                httpOnly: true, 
                secure: false, 
                sameSite: 'lax', 
                maxAge: 8 * 60 * 60 * 1000
            });

            res.json({
                mensaje: 'Login exitoso',
                token: token,
                usuario: {
                    id: usuario.idusuario,
                    nombre: `${usuario.nombre} ${usuario.apellidopaterno}`,
                    rol: usuario.rol?.nombre
                }
            });

        } catch (error) {
            console.error("Error en login:", error);
            res.status(500).json({ error: 'Error interno del servidor' });
        }
    });

    router.post('/logout', (req, res) => {
        res.clearCookie('token');
        res.json({ mensaje: 'Sesión cerrada correctamente' });
    });

    return router;
};
