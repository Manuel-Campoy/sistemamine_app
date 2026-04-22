const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // MÓDULO DE DASHBOARD
    // ==========================================
    router.get('/resumen', verificarToken(prisma), async (req, res) => {
        try {  
            const [sumatoriaTierra, totalLotes, totalViajes] = await prisma.$transaction([
                prisma.movimientotierra.aggregate({ _sum: { cantidadextraida: true } }),
                prisma.prospeccion.count(),
                prisma.movimientotierra.count()
            ]);
            const hace7Dias = new Date();
            hace7Dias.setDate(hace7Dias.getDate() - 7);

            const movimientosRecientes = await prisma.movimientotierra.findMany({ 
                where: { fechayhorainicio: { gte: hace7Dias } }, 
                select: { fechayhorainicio: true, cantidadextraida: true } 
            });
            
            const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
            const datosGraficaMap = { 'Lunes': 0, 'Martes': 0, 'Miércoles': 0, 'Jueves': 0, 'Viernes': 0, 'Sábado': 0, 'Domingo': 0 };

            movimientosRecientes.forEach(mov => {
                const nombreDia = diasSemana[new Date(mov.fechayhorainicio).getDay()];
                datosGraficaMap[nombreDia] += parseFloat(mov.cantidadextraida || 0);
            });

            const graficaDinamica = Object.keys(datosGraficaMap).map(dia => ({ dia: dia, toneladas: datosGraficaMap[dia] }));
            res.json({ 
                kpis: { toneladas: sumatoriaTierra._sum.cantidadextraida || 0, lotes: totalLotes, viajes: totalViajes }, 
                grafica: graficaDinamica 
            });
        } catch (error) { 
            res.status(500).json({ error: 'Error del servidor al calcular métricas.' }); 
        }
    });

    // ==========================================
    // MÓDULO DE AUDITORIA
    // ==========================================
    router.post('/auditoria', verificarToken(prisma), async (req, res) => {
        try {
            const { usuarioId, rol, accion, entidadafectada, idregistroafectado, valoresantes, valoresdespues, fechahora } = req.body;
            if (!usuarioId || !accion || !entidadafectada || !idregistroafectado) {
                return res.status(400).json({ error: 'Campos requeridos: usuarioId, accion, entidadafectada, idregistroafectado' });
            }

            const auditoria = await prisma.auditoriabitacora.create({
                data: {
                    idusuario: usuarioId, accion: accion, entidadafectada: entidadafectada, idregistroafectado: idregistroafectado,
                    valoresantes: valoresantes || null, valoresdespues: valoresdespues || null, fechahora: fechahora ? new Date(fechahora) : new Date()
                }
            });
            res.json({ mensaje: 'Auditoría registrada exitosamente', idauditoria: auditoria.idauditoria });
        } catch (error) { 
            res.status(500).json({ error: 'Error al registrar auditoría: ' + error.message }); 
        }
    });

    // ==========================================
    // MÓDULO DE NOTIFICACIONES
    // ==========================================
    router.post('/notificaciones/lote', verificarToken(prisma), async (req, res) => {
        const nodemailer = require('nodemailer');
        
        try {
            const { loteAlias, estatus, mensaje, correoDestino } = req.body;
            
            const nuevaNotificacion = await prisma.notificacion.create({ 
                data: { 
                    titulo: `Lote ${estatus}: ${loteAlias}`, 
                    mensaje: mensaje || `El lote ${loteAlias} ha sido marcado como ${estatus}.`, 
                    tipo: estatus === 'Autorizado' ? 'Éxito' : 'Alerta', 
                    leida: false 
                } 
            });
            
            const io = req.app.get('socketio');
            if (io) {
                io.emit('nueva_notificacion', nuevaNotificacion);
            }

            const transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: `"Sistema Minero 🚧" <${process.env.EMAIL_USER}>`, 
                to: correoDestino || 'mcampoyteran5@gmail.com', 
                subject: `Notificación de Lote: ${loteAlias} - ${estatus}`,
                html: `
                    <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #d1d5db; border-radius: 10px; max-width: 600px;">
                        <h2 style="color: #1e3a8a;">Actualización de Lote ⛏️</h2>
                        <p>El lote <strong>${loteAlias}</strong> ha cambiado su estatus a: 
                            <span style="background: ${estatus === 'Autorizado' ? '#d1fae5' : '#fee2e2'}; color: ${estatus === 'Autorizado' ? '#065f46' : '#991b1b'}; padding: 5px 10px; border-radius: 5px; font-weight: bold;">
                                ${estatus}
                            </span>
                        </p>
                        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; margin-top: 20px;">
                            <p style="margin: 0; color: #4b5563;"><strong>Detalles / Justificación:</strong></p>
                            <p style="margin: 10px 0 0 0;">${mensaje || 'Sin observaciones.'}</p>
                        </div>
                        <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Este es un mensaje automático del Sistema Minero.</p>
                    </div>
                `
            };
            await transporter.sendMail(mailOptions);
            res.json({ message: 'Notificación guardada y correo enviado exitosamente' });
        } catch (error) { 
            res.status(500).json({ error: 'Error al procesar la notificación.' }); 
        }
    });

    router.get('/notificaciones', verificarToken(prisma), async (req, res) => {
        try {
            const notificaciones = await prisma.notificacion.findMany({ orderBy: { fechacreacion: 'desc' }, take: 50 });
            res.json(notificaciones);
        } catch (error) { 
            res.status(500).json({ error: 'Error al obtener notificaciones.' }); 
        }
    });

    router.put('/notificaciones/:id/leer', verificarToken(prisma), async (req, res) => {
        try {
            await prisma.notificacion.update({ where: { idnotificacion: req.params.id }, data: { leida: true } });
            res.json({ message: 'Marcada como leída' });
        } catch (error) { 
            res.status(500).json({ error: 'Error al actualizar notificación.' }); 
        }
    });

    return router;
};
