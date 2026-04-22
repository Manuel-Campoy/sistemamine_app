const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // MÓDULO DE COMBUSTIBLE
    // ==========================================
    router.get('/', verificarToken(prisma), async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const skip = (page - 1) * limit;

            const [recargas, total] = await prisma.$transaction([
                prisma.recargacombustible.findMany({
                    skip: skip,
                    take: limit,
                    orderBy: { fechayhora: 'desc' },
                    select: {
                        idrecarga: true,
                        fechayhora: true,
                        litros: true,
                        turno: true,
                        horometro: true,
                        observaciones: true,
                        vehiculo: { select: { numeroeconomico: true, marca: true } },
                        usuario: { select: { nombre: true, apellidopaterno: true } }
                    }
                }),
                prisma.recargacombustible.count()
            ]);

            res.json({
                data: recargas,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            });
        } catch (error) {
            console.error("Error al consultar historial de combustible:", error);
            res.status(500).json({ error: 'Error al obtener el historial de recargas' });
        }
    });

    router.post('/', verificarToken(prisma), async (req, res) => {
        const { 
            idvehiculo, 
            idusuario, 
            fechayhora, 
            litros, 
            horometro, 
            turno, 
            observaciones 
        } = req.body;

        try {
            const nuevaRecarga = await prisma.recargacombustible.create({
                data: {
                    idvehiculo: idvehiculo,
                    idusuario: idusuario || req.usuario.id, 
                    fechayhora: fechayhora ? new Date(fechayhora) : new Date(), 
                    litros: parseFloat(litros),
                    horometro: horometro ? parseFloat(horometro) : null,
                    turno: turno,
                    observaciones: observaciones || ''
                }
            });
            
            const io = req.app.get('socketio');
            if (io) {
                io.emit('nueva_recarga');
            }
            res.status(201).json(nuevaRecarga);
        } catch (error) {
            console.error("Error al registrar combustible:", error);
            res.status(500).json({ error: 'Error interno al registrar la recarga de combustible' });
        }
    });

    return router;
};
