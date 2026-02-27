const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Llave secreta para firmar los tokens (En producción, esto va en un archivo .env)
const JWT_SECRET = 'SuperSecretoMinero2026!#'; 

// ==========================================
// 1. ENDPOINT: INICIAR SESIÓN (/api/auth/login)
// ==========================================
router.post('/login', async (req, res) => {
    try {
        const { usuario, password } = req.body;

        // TODO: Aquí harías la consulta real a tu base de datos (Ej. SELECT * FROM Usuarios WHERE correo = usuario)
        // Por ahora, simulamos un usuario de la base de datos:
        const usuarioDB = {
            idUsuario: 'UUID-1234',
            idRol: 'ROL-GEOLOGO',
            correoElectronico: 'juan.perez@minera.com',
            nombreUsuario: 'juanp',
            nombres: 'Juan',
            apellidoPaterno: 'Pérez',
            // Esta es la palabra "123456" encriptada con bcrypt:
            contrasenaHash: '$2b$10$X729.8/O32Q0.P9rWbE8/.K.k3.J7K8X1H2Y9Z0A1B2C3D4E5F6G7' 
        };

        // 1. Validamos que el usuario exista
        if (usuario !== usuarioDB.correoElectronico) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // 2. Comparamos la contraseña que envió Flutter con el Hash de la Base de Datos
        // const passwordValida = await bcrypt.compare(password, usuarioDB.contrasenaHash);
        // Para pruebas rápidas, asumiremos que si escribe "123456" es válido:
        const passwordValida = (password === '123456');

        if (!passwordValida) {
            return res.status(401).json({ mensaje: 'Credenciales incorrectas' });
        }

        // 3. ¡Todo es correcto! Generamos el JWT (Gafete digital)
        const token = jwt.sign(
            { idUsuario: usuarioDB.idUsuario, idRol: usuarioDB.idRol },
            JWT_SECRET,
            { expiresIn: '8h' } // El token caduca en 8 horas
        );

        // 4. Respondemos a Flutter con la estructura exacta que espera tu AuthRepositoryImpl
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
        console.error(error);
        res.status(500).json({ mensaje: 'Error interno del servidor' });
    }
});

// ==========================================
// 2. ENDPOINT: SOLICITAR RECUPERACIÓN
// ==========================================
router.post('/recuperar', async (req, res) => {
    const { correo } = req.body;
    // TODO: Buscar el correo en DB y enviar un email real
    console.log(`Simulando envío de código a: ${correo}`);
    res.status(200).json({ mensaje: 'Si el correo existe, se enviará un código' });
});

// ==========================================
// 3. ENDPOINT: VERIFICAR CÓDIGO
// ==========================================
router.post('/verificar-codigo', async (req, res) => {
    const { correo, codigo } = req.body;
    // Simulamos que el código correcto es 123456
    if (codigo === '123456') {
        res.status(200).json({ mensaje: 'Código verificado correctamente' });
    } else {
        res.status(400).json({ mensaje: 'Código inválido' });
    }
});

// ==========================================
// 4. ENDPOINT: CAMBIAR CONTRASEÑA
// ==========================================
router.post('/cambiar-password', async (req, res) => {
    const { correo, nuevaPassword } = req.body;
    // TODO: Encriptar la nueva contraseña con bcrypt y hacer UPDATE en la BD
    console.log(`Actualizando contraseña para: ${correo}`);
    res.status(200).json({ mensaje: 'Contraseña actualizada exitosamente' });
});

module.exports = router;