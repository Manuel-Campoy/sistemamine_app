const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { verificarToken } = require('../middlewares/auth.middleware');
const { enviarCorreo } = require('../mailer'); 

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
            if (!passwordValida) return res.status(401).json({ error: 'Credenciales incorrectas' });

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

    // ==========================================
    // RECUPERACIÓN DE CONTRASEÑA
    // ==========================================
    
    // 1. Solicitar Código
    router.post('/olvide-password', async (req, res) => {
        const email = req.body.email || req.body.correo; 

        try {
            const usuario = await prisma.usuario.findFirst({ 
                where: { correo: { equals: email, mode: 'insensitive' } } 
            });
            
            if (!usuario) {
                return res.status(404).json({ error: 'No existe un usuario con este correo electrónico.' });
            }

            const codigo = Math.floor(100000 + Math.random() * 900000).toString();
            const expiracion = new Date(Date.now() + 15 * 60 * 1000); 

            await prisma.usuario.update({
                where: { idusuario: usuario.idusuario },
                data: { 
                    codigorecuperacion: codigo, 
                    expiracioncodigo: expiracion 
                }
            });

            const asunto = 'Código de Recuperación de Contraseña';
            const mensajeHtml = `
                <div style="font-family: Arial, sans-serif; padding: 20px; color: #333; max-width: 600px; margin: 0 auto; border: 1px solid #e5e7eb; border-radius: 8px;">
                    <h2 style="color: #1d4ed8; text-align: center;">Recuperación de Acceso</h2>
                    <p>Hola <strong>${usuario.nombre}</strong>,</p>
                    <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en el Sistema Mine ERP.</p>
                    <div style="background-color: #f3f4f6; padding: 20px; text-align: center; border-radius: 8px; margin: 20px 0;">
                        <span style="font-size: 32px; font-weight: bold; letter-spacing: 5px; color: #1f2937;">${codigo}</span>
                    </div>
                    <p style="color: #ef4444; font-size: 14px; text-align: center;">Este código expirará en 15 minutos.</p>
                    <p style="font-size: 14px; color: #6b7280; text-align: center;">Si no solicitaste este cambio, puedes ignorar este correo de forma segura.</p>
                </div>
            `;

            enviarCorreo(usuario.correo, asunto, mensajeHtml);

            res.json({ mensaje: 'Código enviado exitosamente' });

        } catch (error) {
            console.error("Error al solicitar recuperación:", error);
            res.status(500).json({ error: 'Error del servidor al procesar la solicitud.' });
        }
    });

    // 2. Verificar Código
    router.post('/verificar-codigo', async (req, res) => {
        const { codigo } = req.body;
        const email = req.body.email || req.body.correo;

        try {
            const usuario = await prisma.usuario.findFirst({ 
                where: { correo: { equals: email, mode: 'insensitive' } } 
            });

            if (!usuario || usuario.codigorecuperacion !== codigo) {
                return res.status(400).json({ error: 'El código ingresado es incorrecto.' });
            }

            if (new Date() > new Date(usuario.expiracioncodigo)) {
                return res.status(400).json({ error: 'El código ha caducado. Por favor solicita uno nuevo.' });
            }

            res.json({ mensaje: 'Código verificado con éxito' });

        } catch (error) {
            console.error("Error al verificar código:", error);
            res.status(500).json({ error: 'Error interno al verificar el código.' });
        }
    });

    // 3. Resetear Contraseña
    router.post('/reset-password', async (req, res) => {
        const { codigo, nuevaPassword } = req.body;
        const email = req.body.email || req.body.correo;

        try {
            const usuario = await prisma.usuario.findFirst({ 
                where: { correo: { equals: email, mode: 'insensitive' } } 
            });

            if (!usuario || usuario.codigorecuperacion !== codigo || new Date() > new Date(usuario.expiracioncodigo)) {
                return res.status(400).json({ error: 'Sesión de recuperación inválida o expirada.' });
            }

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(nuevaPassword, salt);

            await prisma.usuario.update({
                where: { idusuario: usuario.idusuario },
                data: {
                    contrasenahash: hashedPassword,
                    codigorecuperacion: null,
                    expiracioncodigo: null
                }
            });

            res.json({ mensaje: 'Contraseña actualizada correctamente.' });

        } catch (error) {
            console.error("Error al cambiar contraseña:", error);
            res.status(500).json({ error: 'Error al actualizar la contraseña.' });
        }
    });

    return router;
};