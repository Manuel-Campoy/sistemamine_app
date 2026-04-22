const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // MÓDULO DE REPORTES
    // ==========================================
    router.get('/inversionista', verificarToken(prisma), async (req, res) => {
        try {
            const ciclos = await prisma.produccionciclo.findMany({ 
                where: { activo: true },
                take: 500  
            });
            let totalTons = 0, totalEstimado = 0, totalRecuperado = 0;
            
            ciclos.forEach(c => { 
                totalTons += Number(c.toneladasprocesadas || 0); 
                totalEstimado += Number(c.oroestimadogramos || 0); 
                totalRecuperado += Number(c.oroobtenidogramos || 0); 
            });

            const lotesActivos = await prisma.prospeccion.count({ 
                where: { estatus: { descripcion: { not: 'Cerrado' } } } 
            });

            const tendenciaMap = ciclos.reduce((acc, c) => {
                const mes = c.fechaoperacion.toISOString().substring(0, 7); 
                if (!acc[mes]) acc[mes] = { mes, estimado: 0, real: 0 };
                acc[mes].estimado += Number(c.oroestimadogramos || 0);
                acc[mes].real += Number(c.oroobtenidogramos || 0);
                return acc;
            }, {});

            const tendenciaMensual = Object.values(tendenciaMap).sort((a, b) => a.mes.localeCompare(b.mes));
            res.json({ 
                kpis: { lotesActivos, tonsProcesadas: totalTons, oroEstimado: totalEstimado, oroRecuperado: totalRecuperado }, 
                tendenciaMensual 
            });
        } catch (error) { 
            res.status(500).json({ error: 'Error al generar métricas ejecutivas.' }); 
        }
    });

    router.get('/balance', verificarToken(prisma), async (req, res) => {
        try {
            const [lotes, movimientos, ciclos] = await prisma.$transaction([
                prisma.prospeccion.findMany({
                    select: { idarealote: true, nombrealias: true, leyestimada: true }
                }),
                prisma.movimientotierra.findMany({
                    select: { idarealote: true, cantidadextraida: true }
                }),
                prisma.produccionciclo.findMany({
                    where: { activo: true },
                    select: { idarealote: true, toneladasprocesadas: true, leyciclo: true, oroestimadogramos: true, oroobtenidogramos: true }
                })
            ]);

            const lotesMap = new Map(lotes.map(l => [l.idarealote, l]));
            const movimientosMap = new Map();
            const ciclosMap = new Map();

            movimientos.forEach(m => {
                if (!movimientosMap.has(m.idarealote)) movimientosMap.set(m.idarealote, []);
                movimientosMap.get(m.idarealote).push(m);
            });

            ciclos.forEach(c => {
                if (!ciclosMap.has(c.idarealote)) ciclosMap.set(c.idarealote, []);
                ciclosMap.get(c.idarealote).push(c);
            });

            const balance = Array.from(lotesMap.entries()).map(([idlote, lote]) => {
                const loteMov = movimientosMap.get(idlote) || [];
                const loteCiclos = ciclosMap.get(idlote) || [];

                const tonsMovidas = loteMov.reduce((sum, m) => sum + Number(m.cantidadextraida || 0), 0);
                let tonsProcesadas = 0, totalOroEstimado = 0, totalOroReal = 0, sumLeyTons = 0;

                loteCiclos.forEach(c => {
                    const tons = Number(c.toneladasprocesadas || 0);
                    tonsProcesadas += tons;
                    totalOroEstimado += Number(c.oroestimadogramos || 0);
                    totalOroReal += Number(c.oroobtenidogramos || 0);
                    sumLeyTons += tons * Number(c.leyciclo || 0);
                });

                const leyPromedioReal = tonsProcesadas > 0 ? (sumLeyTons / tonsProcesadas) : 0;
                const recuperacionGlobal = totalOroEstimado > 0 ? ((totalOroReal / totalOroEstimado) * 100) : 0;
                const rentabilidad = recuperacionGlobal >= 90 ? 'Excelente' : (recuperacionGlobal >= 75 ? 'Aceptable' : 'Pérdida');

                return { 
                    idarealote: idlote, 
                    loteAlias: lote.nombrealias, 
                    tonsMovidas, 
                    tonsProcesadas, 
                    leyEstimada: Number(lote.leyestimada || 0), 
                    leyPromedioReal, 
                    oroEstimado: totalOroEstimado, 
                    oroObtenido: totalOroReal, 
                    recuperacion: recuperacionGlobal, 
                    rentabilidad 
                };
            }).filter(b => b.tonsMovidas > 0 || b.tonsProcesadas > 0);

            res.json(balance);
        } catch (error) { 
            res.status(500).json({ error: 'Error al calcular balance por lotes.' }); 
        }
    });

    router.get('/auditoria', verificarToken(prisma), async (req, res) => {
        try {
            const registros = await prisma.auditoriabitacora.findMany({ 
                orderBy: { fechahora: 'desc' }, 
                take: 200, 
                include: { usuario: { select: { nombre: true, apellidopaterno: true } } } 
            });
            const datosMapeados = registros.map(r => ({ 
                idauditoria: r.idauditoria, 
                fecha: r.fechahora, 
                usuario: `${r.usuario.nombre} ${r.usuario.apellidopaterno}`, 
                accion: r.accion, 
                entidad: r.entidadafectada, 
                detallesAntes: r.valoresantes, 
                detallesDespues: r.valoresdespues 
            }));
            res.json(datosMapeados);
        } catch (error) { 
            res.status(500).json({ error: 'Error al cargar los registros de auditoría.' }); 
        }
    });

    return router;
};
