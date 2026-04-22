const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // CATÁLOGO DE VEHICULOS
    // ==========================================
    router.get('/', verificarToken(prisma), async (req, res) => {
        try {
            const vehiculos = await prisma.vehiculo.findMany({ 
                where: { activo: true }, 
                orderBy: { numeroeconomico: 'asc' } 
            });
            res.json(vehiculos);
        } catch (error) { 
            res.status(500).json({ error: 'Error al obtener vehículos' }); 
        }
    });

    router.get('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const vehiculo = await prisma.vehiculo.findUnique({ where: { idvehiculo: id } });
            if (!vehiculo) return res.status(404).json({ error: 'Vehículo no encontrado' });
            res.json(vehiculo);
        } catch (error) { 
            res.status(500).json({ error: 'Error del servidor' }); 
        }
    });

    router.post('/', verificarToken(prisma), async (req, res) => {
        try {
            const data = req.body;
            const existeVehiculo = await prisma.vehiculo.findFirst({
                where: { OR: [{ codigovehiculo: data.codigovehiculo }, { numeroeconomico: data.numeroeconomico }] }
            });
            if (existeVehiculo) return res.status(400).json({ error: 'El código de vehículo o número económico ya está registrado.' });
            
            await prisma.vehiculo.create({
                data: {
                    codigovehiculo: data.codigovehiculo, numeroeconomico: data.numeroeconomico, categoria: data.categoria, tipovehiculo: data.tipovehiculo,
                    subtipovehiculo: data.subtipovehiculo, marca: data.marca, modelo: data.modelo, anio: parseInt(data.anio),
                    placas: data.placas || null, estadooperacion: data.estadooperacion || 'Disponible', activo: data.activo !== undefined ? data.activo : true
                }
            });
            res.status(201).json({ mensaje: 'Vehículo registrado exitosamente' });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno: ' + error.message }); 
        }
    });

    router.put('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await prisma.vehiculo.update({
                where: { idvehiculo: id },
                data: {
                    codigovehiculo: data.codigovehiculo, numeroeconomico: data.numeroeconomico, categoria: data.categoria, tipovehiculo: data.tipovehiculo,
                    subtipovehiculo: data.subtipovehiculo, marca: data.marca, modelo: data.modelo, anio: parseInt(data.anio), placas: data.placas || null,
                    estadooperacion: data.estadooperacion, activo: data.activo
                }
            });
            res.json({ mensaje: 'Vehículo actualizado exitosamente' });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno al actualizar.' }); 
        }
    });

    router.put('/:id/estado', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const { activo } = req.body;
            await prisma.vehiculo.update({ where: { idvehiculo: id }, data: { activo: activo } });
            res.json({ mensaje: `Estado actualizado a ${activo ? 'Activo' : 'Inactivo'}` });
        } catch (error) { 
            res.status(500).json({ error: 'Error al cambiar estado' }); 
        }
    });

    return router;
};
