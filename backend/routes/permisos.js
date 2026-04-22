const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // MÓDULO DE SEGURIDAD Y PERMISOS DINÁMICOS
    // ==========================================
    router.get('/rol-permisos/:rol', verificarToken(prisma), async (req, res) => {
        try {
            const { rol } = req.params;
            const permisos = await prisma.rolPermiso.findMany({
                where: { rol: rol },
                select: { permisoClave: true }
            });
            
            res.json(permisos.map(p => p.permisoClave));
        } catch (error) {
            console.error("Error al obtener permisos del rol:", error);
            res.status(500).json({ error: 'Error interno al obtener permisos' });
        }
    });

    router.post('/rol-permisos', verificarToken(prisma), async (req, res) => {
        const { rol, permisoClave, modulo } = req.body;
        
        try {
            const nuevoPermiso = await prisma.rolPermiso.create({
                data: {
                    rol: rol,
                    permisoClave: permisoClave,
                    modulo: modulo || 'General'
                }
            });
            res.status(201).json(nuevoPermiso);
        } catch (error) {
            if (error.code === 'P2002') {
                return res.status(400).json({ error: 'El rol ya tiene este permiso asignado' });
            }
            console.error("Error al asignar permiso:", error);
            res.status(500).json({ error: 'Error interno al asignar permiso' });
        }
    });

    router.delete('/rol-permisos', verificarToken(prisma), async (req, res) => {
        const { rol, permisoClave } = req.body; 
        
        try {
            await prisma.rolPermiso.deleteMany({
                where: {
                    rol: rol,
                    permisoClave: permisoClave
                }
            });
            res.json({ mensaje: 'Permiso revocado exitosamente' });
        } catch (error) {
            console.error("Error al revocar permiso:", error);
            res.status(500).json({ error: 'Error interno al revocar permiso' });
        }
    });

    return router;
};
