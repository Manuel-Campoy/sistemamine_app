const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // MÓDULO DE PROSPECCIÓN
    // ==========================================
    router.get('/', verificarToken(prisma), async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const skip = (page - 1) * limit;

            const [lotes, total] = await prisma.$transaction([
                prisma.prospeccion.findMany({
                    skip: skip,
                    take: limit,
                    orderBy: { fecharegistro: 'desc' },
                    select: {
                        idarealote: true,
                        nombrealias: true,
                        fecharegistro: true,
                        leyestimada: true,
                        tonelajeestimado: true,
                        idestatusprospeccion: true,
                        coordenadas: true,
                        mina: { select: { aliasmina: true, nombreempresa: true } },
                        estatus: { select: { descripcion: true } },
                        responsable: { select: { nombre: true, apellidopaterno: true } }
                    }
                }),
                prisma.prospeccion.count()
            ]);

            res.json({
                data: lotes,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            });
        } catch (error) { 
            res.status(500).json({ error: 'Error del servidor al consultar prospección' }); 
        }
    });

    router.get('/estatus-prospeccion', verificarToken(prisma), async (req, res) => {
        try {
            const estatus = await prisma.estatusprospeccion.findMany({ orderBy: { descripcion: 'asc' } });
            res.json(estatus);
        } catch (error) { 
            res.status(500).json({ error: 'Error del servidor al consultar estatus.' }); 
        }
    });

    router.get('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            if (!id || id === 'undefined' || id === 'null') return res.status(400).json({ error: 'ID de lote no proporcionado o inválido.' });
            const lote = await prisma.prospeccion.findUnique({ where: { idarealote: id }, include: { mina: true, estatus: true, responsable: true } });
            if (!lote) return res.status(404).json({ error: 'Lote no encontrado' });
            res.json(lote);
        } catch (error) { 
            res.status(500).json({ error: 'Error interno del servidor' }); 
        }
    });

    router.post('/', verificarToken(prisma), async (req, res) => {
        try {
            const data = req.body;
            if (!data.idmina) return res.status(400).json({ error: 'idmina es requerido' });
            if (!data.idestatusprospeccion) return res.status(400).json({ error: 'idestatusprospeccion es requerido' });
            if (!data.nombrealias) return res.status(400).json({ error: 'nombrealias es requerido' });

            const nuevoLote = await prisma.prospeccion.create({ 
                data: {
                    idmina: data.idmina, idestatusprospeccion: data.idestatusprospeccion, idresponsable: data.idresponsable, nombrealias: data.nombrealias,
                    fechayhoramuestreo: data.fechayhoramuestreo ? new Date(data.fechayhoramuestreo) : null, metodomuestreo: data.metodomuestreo,
                    leyestimada: data.leyestimada ? parseFloat(data.leyestimada) : null, tonelajeestimado: data.tonelajeestimado ? parseFloat(data.tonelajeestimado) : null,
                    observaciones: data.observaciones, coordenadas: data.coordenadas || null
                } 
            });

            const io = req.app.get('socketio');
            if (io) {
                io.emit('nueva_notificacion'); 
            }

            res.status(201).json({ mensaje: 'Lote de prospección registrado exitosamente', id: nuevoLote.idarealote });
        } catch (error) { 
            res.status(400).json({ error: 'Error de BD: ' + error.message }); 
        }
    });

    router.put('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await prisma.prospeccion.update({ 
                where: { idarealote: id }, 
                data: {
                    idestatusprospeccion: data.idestatusprospeccion, nombrealias: data.nombrealias, fechayhoramuestreo: data.fechayhoramuestreo ? new Date(data.fechayhoramuestreo) : null,
                    metodomuestreo: data.metodomuestreo, leyestimada: data.leyestimada ? parseFloat(data.leyestimada) : null, tonelajeestimado: data.tonelajeestimado ? parseFloat(data.tonelajeestimado) : null,
                    observaciones: data.observaciones, coordenadas: data.coordenadas
                } 
            });
            res.json({ mensaje: 'Lote actualizado exitosamente' });
        } catch (error) { 
            res.status(400).json({ error: 'Error de BD: ' + error.message }); 
        }
    });

    router.put('/:id/estado', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const { activo } = req.body;
            await prisma.prospeccion.update({ where: { idarealote: id }, data: { activo: activo } });
            res.json({ mensaje: `Lote ${activo ? 'Habilitado' : 'Deshabilitado'} exitosamente` });
        } catch (error) { 
            res.status(500).json({ error: 'Error al cambiar estado' }); 
        }
    });

    router.put('/:id/estatus', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const { idestatusprospeccion } = req.body;
            await prisma.prospeccion.update({ where: { idarealote: id }, data: { idestatusprospeccion: idestatusprospeccion } });
            res.json({ mensaje: `Estatus de prospección actualizado exitosamente` });
        } catch (error) { 
            res.status(500).json({ error: 'Error al cambiar estatus' }); 
        }
    });

    return router;
};
