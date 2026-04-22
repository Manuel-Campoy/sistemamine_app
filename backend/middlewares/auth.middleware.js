const jwt = require('jsonwebtoken');

const verificarToken = (prisma) => {
    return async (req, res, next) => {
        let token = req.cookies?.token;

        if (!token && req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
            token = req.headers.authorization.split(' ')[1];
        }

        if (!token) {
            return res.status(401).json({ error: 'Acceso denegado. No se proporcionó token de seguridad.' });
        }

        try {
            const decodificado = jwt.verify(token, process.env.JWT_SECRET || 'super_secreto_minero_2026');
            
            const usuario = await prisma.usuario.findUnique({
                where: { idusuario: decodificado.id }
            });

            if (!usuario || !usuario.activo) {
                return res.status(403).json({ error: 'Cuenta inválida o deshabilitada.' });
            }

            req.usuario = decodificado;
            next();
        } catch (error) {
            return res.status(401).json({ error: 'Token inválido o expirado. Inicia sesión nuevamente.' });
        }
    };
};

module.exports = { verificarToken };