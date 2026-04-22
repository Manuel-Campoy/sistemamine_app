const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // MÓDULO DE MOVIMIENTOS DE TIERRA
    // ==========================================
    router.get('/', verificarToken(prisma), async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const skip = (page - 1) * limit;

            const [movimientos, total] = await prisma.$transaction([
                prisma.movimientotierra.findMany({
                    skip: skip,
                    take: limit,
                    orderBy: { fechayhorainicio: 'desc' },
                    select: {
                        idmovimiento: true,
                        fechayhorainicio: true,
                        cantidadextraida: true,
                        turno: true,
                        lote: { select: { nombrealias: true } },
                        vehiculo: { select: { numeroeconomico: true, marca: true, modelo: true } },
                        responsable: { select: { nombre: true, apellidopaterno: true } }
                    }
                }),
                prisma.movimientotierra.count()
            ]);

            res.json({
                data: movimientos,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            });
        } catch (error) { 
            res.status(500).json({ error: 'Error al cargar el historial de movimientos.' }); 
        }
    });

    router.get('/lote/:idarealote', verificarToken(prisma), async (req, res) => {
        try {
            const { idarealote } = req.params;
            const movimientos = await prisma.movimientotierra.findMany({
                where: { idarealote: idarealote }, 
                include: { lote: true, responsable: true, vehiculo: true }, 
                orderBy: { fechayhorainicio: 'desc' }
            });
            res.json(movimientos || []);
        } catch (error) { 
            res.status(500).json({ error: 'Error del servidor al cargar los datos del movimiento.' }); 
        }
    });

    router.post('/', verificarToken(prisma), async (req, res) => {
        const nodemailer = require('nodemailer');
        
        try {
            const data = req.body;
            if (!data.idarealote) return res.status(400).json({ error: 'idarealote es requerido' });

            const nuevoMovimiento = await prisma.movimientotierra.create({
                data: {
                    idarealote: data.idarealote, 
                    idresponsable: data.idresponsable, 
                    idvehiculo: data.idvehiculo, 
                    turno: data.turno,
                    capacidadestimada: data.capacidadestimada ? parseFloat(data.capacidadestimada) : null, 
                    numeroextraccion: parseInt(data.numeroextraccion),
                    fechayhorainicio: new Date(data.fechayhorainicio), 
                    fechayhorafin: data.fechayhorafin ? new Date(data.fechayhorafin) : null,
                    cantidadextraida: data.cantidadextraida ? parseFloat(data.cantidadextraida) : null, 
                    destino: data.destino
                }
            });

            if (nuevoMovimiento.cantidadextraida) {
                const io = req.app.get('socketio');
                io.emit('nueva_dompada', { toneladas: parseFloat(nuevoMovimiento.cantidadextraida) });
            }

            const { idarealote } = req.body;

            try {
                const lote = await prisma.prospeccion.findUnique({
                    where: { idarealote: idarealote }
                });

                if (lote) {
                    const sumaMovimientos = await prisma.movimientotierra.aggregate({
                        where: { idarealote: idarealote },
                        _sum: { cantidadextraida: true }
                    });

                    const acumulado = sumaMovimientos._sum.cantidadextraida || 0;
                    const estimado = Number(lote.tonelajeestimado) || 0;

                    if (estimado > 0 && acumulado >= (estimado * 0.99)) {
                        const transporter = nodemailer.createTransport({
                            service: 'gmail',
                            auth: {
                                user: process.env.EMAIL_USER,
                                pass: process.env.EMAIL_PASS
                            }
                        });

                        const asunto = `Meta de Acarreo Completada - Lote ${lote.nombrealias}`;
                        const mensajeHtml = `
                            <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                                <h2 style="color: #047857;">Acarreo de Lote Finalizado 🚜</h2>
                                <p>El movimiento de tierra para el lote <strong>${lote.nombrealias}</strong> ha alcanzado su tonelaje estimado original.</p>
                                <div style="background-color: #f0fdf4; padding: 15px; border-radius: 8px; border: 1px solid #bbf7d0;">
                                    <ul style="list-style: none; padding: 0;">
                                        <li><strong>Lote:</strong> ${lote.nombrealias}</li>
                                        <li><strong>Tonelaje Estimado Inicial:</strong> ${estimado.toFixed(2)} t</li>
                                        <li><strong>Tonelaje Total Extraído:</strong> ${acumulado.toFixed(2)} t</li>
                                        <li><strong>Porcentaje Completado:</strong> ${((acumulado / estimado) * 100).toFixed(2)}%</li>
                                    </ul>
                                </div>
                                <p>El material se encuentra depositado en su destino final listo para iniciar el procesamiento químico.</p>
                                <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Este es un mensaje automático del Sistema Minero.</p>
                            </div>
                        `;

                        const mailOptions = {
                            from: `"Sistema Minero 🚧" <${process.env.EMAIL_USER}>`,
                            to: process.env.EMAIL_JEFE_PLANTA || 'jefe.planta@ejemplo.com',
                            subject: asunto,
                            html: mensajeHtml
                        };

                        await transporter.sendMail(mailOptions);
                    }
                }
            } catch (errorCorreo) {
                console.error("Error al enviar correo de meta completada:", errorCorreo);
            }

            res.status(201).json({ mensaje: 'Movimiento de tierra registrado exitosamente', id: nuevoMovimiento.idmovimiento });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno: ' + error.message }); 
        }
    });

    router.put('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body;
            await prisma.movimientotierra.update({
                where: { idmovimiento: id },
                data: {
                    idresponsable: data.idresponsable, idvehiculo: data.idvehiculo, turno: data.turno, capacidadestimada: data.capacidadestimada ? parseFloat(data.capacidadestimada) : null,
                    numeroextraccion: parseInt(data.numeroextraccion), fechayhorainicio: new Date(data.fechayhorainicio), fechayhorafin: data.fechayhorafin ? new Date(data.fechayhorafin) : null,
                    cantidadextraida: data.cantidadextraida ? parseFloat(data.cantidadextraida) : null, destino: data.destino
                }
            });
            res.json({ mensaje: 'Movimiento de tierra actualizado exitosamente' });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno: ' + error.message }); 
        }
    });

    return router;
};
