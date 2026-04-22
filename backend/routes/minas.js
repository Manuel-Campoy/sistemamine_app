const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // CATÁLOGO DE MINAS
    // ==========================================
    router.get('/', verificarToken(prisma), async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const skip = (page - 1) * limit;

            const [minas, total] = await prisma.$transaction([
                prisma.minaempresa.findMany({
                    skip: skip,
                    take: limit,
                    orderBy: { idmina: 'desc' }
                }),
                prisma.minaempresa.count()
            ]);

            res.json({
                data: minas,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            });
        } catch (error) { 
            res.status(500).json({ error: 'Error del servidor al consultar minas' }); 
        }
    });

    router.get('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const mina = await prisma.minaempresa.findUnique({ where: { idmina: id } });
            if (!mina) return res.status(404).json({ error: 'Mina no encontrada' });
            res.json(mina);
        } catch (error) { 
            res.status(500).json({ error: 'Error del servidor' }); 
        }
    });

    router.post('/', verificarToken(prisma), async (req, res) => {
        try {
            const data = req.body;
            const existeMina = await prisma.minaempresa.findFirst({
                where: { OR: [{ claveminera: data.claveminera }, { nombreempresa: data.nombreempresa }, { aliasmina: data.aliasmina }] }
            });
            if (existeMina) return res.status(400).json({ error: 'Ya existe una mina con esa Clave, Nombre de Empresa o Alias.' });
            
            const nuevaMina = await prisma.minaempresa.create({
                data: {
                    claveminera: data.claveminera, nombreempresa: data.nombreempresa, aliasmina: data.aliasmina, tipomina: data.tipomina,
                    metodoextraccion: data.metodoextraccion, mineralesprincipales: data.mineralesprincipales, estatusoperacion: data.estatusoperacion || 'Activa',
                    direccionmina: data.direccionmina, poligonoubicacion: data.poligonoubicacion, calleoficina: data.calleoficina, numerooficina: data.numerooficina,
                    cpoficina: data.cpoficina, coloniaoficina: data.coloniaoficina, municipiooficina: data.municipiooficina, estadooficina: data.estadooficina,
                    paisoficina: data.paisoficina || 'México', correoelectronico: data.correoelectronico, telefonofijo: data.telefonofijo, extension: data.extension,
                    telefonomovil: data.telefonomovil, activo: data.activo !== undefined ? data.activo : true
                }
            });
            res.status(201).json({ mensaje: 'Mina registrada exitosamente', id: nuevaMina.idmina });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno: ' + error.message }); 
        }
    });

    router.put('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await prisma.minaempresa.update({
                where: { idmina: id },
                data: {
                    claveminera: data.claveminera, nombreempresa: data.nombreempresa, aliasmina: data.aliasmina, tipomina: data.tipomina, metodoextraccion: data.metodoextraccion,
                    mineralesprincipales: data.mineralesprincipales, estatusoperacion: data.estatusoperacion, direccionmina: data.direccionmina, poligonoubicacion: data.poligonoubicacion,
                    calleoficina: data.calleoficina, numerooficina: data.numerooficina, cpoficina: data.cpoficina, coloniaoficina: data.coloniaoficina, municipiooficina: data.municipiooficina,
                    estadooficina: data.estadooficina, paisoficina: data.paisoficina, correoelectronico: data.correoelectronico, telefonofijo: data.telefonofijo, extension: data.extension,
                    telefonomovil: data.telefonomovil, activo: data.activo
                }
            });
            res.json({ mensaje: 'Mina actualizada exitosamente' });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno al actualizar.' }); 
        }
    });

    router.put('/:id/estado', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const { activo } = req.body;
            await prisma.minaempresa.update({ where: { idmina: id }, data: { activo: activo } });
            res.json({ mensaje: `Mina ${activo ? 'Habilitada' : 'Deshabilitada'}` });
        } catch (error) { 
            res.status(500).json({ error: 'Error al cambiar estado' }); 
        }
    });

    return router;
};
