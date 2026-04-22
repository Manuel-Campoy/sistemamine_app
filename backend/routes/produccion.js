const express = require('express');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // MÓDULO DE PRODUCCIÓN
    // ==========================================
    router.get('/ciclos', verificarToken(prisma), async (req, res) => {
        try {
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 100; 
            const skip = (page - 1) * limit;

            const [ciclos, total] = await prisma.$transaction([
                prisma.produccionciclo.findMany({
                    skip: skip,
                    take: limit,
                    orderBy: { fechahorainicio: 'desc' },
                    include: {
                        prospeccion: { select: { nombrealias: true } },
                        usuarioRegistra: { select: { nombre: true, apellidopaterno: true } },
                        usuarioEnProceso: { select: { nombre: true, apellidopaterno: true } },
                        usuarioFinalizado: { select: { nombre: true, apellidopaterno: true } }
                    }
                }),
                prisma.produccionciclo.count()
            ]);
            res.json({
                data: ciclos,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            });
        } catch (error) {
            console.error("Error al obtener ciclos:", error);
            res.status(500).json({ error: 'Error interno al cargar la producción.' });
        }
    });

    router.get('/ciclos/lote/:idlote', verificarToken(prisma), async (req, res) => {
        try {
            const { idlote } = req.params;
            const ciclos = await prisma.produccionciclo.findMany({ 
                where: { idarealote: idlote }, 
                orderBy: { numerociclo: 'desc' } 
            });
            res.json(ciclos);
        } catch (error) { 
            res.status(500).json({ error: 'Error al cargar la bitácora del lote.' }); 
        }
    });

    router.post('/ciclos', verificarToken(prisma), async (req, res) => {
        try {
            const data = req.body;
            const nuevoCiclo = await prisma.produccionciclo.create({
                data: {
                    idarealote: data.idarealote, numerociclo: data.numerociclo, turno: data.turno, fechaoperacion: new Date(data.fechaoperacion),
                    fechahorainicio: new Date(data.fechahorainicio), toneladasprocesadas: parseFloat(data.toneladasprocesadas), leyciclo: parseFloat(data.leyciclo),
                    recuperacionporcentaje: parseFloat(data.recuperacionporcentaje), oroestimadogramos: parseFloat(data.oroestimadogramos), colastoneladas: parseFloat(data.colastoneladas),
                    observaciones: data.observaciones, estado: data.estado || 'Pendiente', usuarioregistra: data.usuarioregistra
                }
            });

            const io = req.app.get('socketio');
            if (io) io.emit('nueva_produccion');

            res.status(201).json(nuevoCiclo);
        } catch (error) { 
            res.status(500).json({ error: 'No se pudo guardar el ciclo de producción.' }); 
        }
    });

    router.put('/ciclos/:id/estatus', verificarToken(prisma), async (req, res) => {
        const nodemailer = require('nodemailer');
        
        try {
            const { id } = req.params;
            const { estado, idusuario, motivodeshabilitado } = req.body;
            let dataUpdate = { estado };

            if (estado === 'En Proceso') { 
                dataUpdate.usuarioenproceso = idusuario; 
                dataUpdate.fechaenproceso = new Date(); 
            } 
            else if (estado === 'Finalizado') { 
                dataUpdate.usuariofinalizado = idusuario; 
                dataUpdate.fechafinalizado = new Date(); 
                dataUpdate.fechahorafin = new Date(); 
            } 
            else if (estado === 'Deshabilitado') { 
                dataUpdate.motivodeshabilitado = motivodeshabilitado; 
                dataUpdate.activo = false; 
                dataUpdate.fechafinalizado = new Date(); 
                dataUpdate.usuariofinalizado = idusuario; 
            }

            const cicloActualizado = await prisma.produccionciclo.update({ 
                where: { idciclo: id }, 
                data: dataUpdate,
                include: { prospeccion: true }
            });

            if (estado === 'Finalizado') {
                try {
                    const transporter = nodemailer.createTransport({
                        service: 'gmail',
                        auth: {
                            user: process.env.EMAIL_USER,
                            pass: process.env.EMAIL_PASS
                        }
                    });

                    const asunto = `Ciclo de Planta Finalizado - Lote ${cicloActualizado.prospeccion.nombrealias}`;
                    const mensajeHtml = `
                        <div style="font-family: Arial, sans-serif; padding: 20px; color: #333;">
                            <h2 style="color: #1e40af;">Reporte de Ciclo Finalizado ⚗️</h2>
                            <p>El sistema minero reporta que un ciclo de procesamiento por lixiviación ha concluido en planta.</p>
                            <div style="background-color: #f3f4f6; padding: 15px; border-radius: 8px;">
                                <ul style="list-style: none; padding: 0;">
                                    <li><strong>ID Ciclo:</strong> ${id.substring(0, 8).toUpperCase()}</li>
                                    <li><strong>Lote Origen:</strong> ${cicloActualizado.prospeccion.nombrealias}</li>
                                    <li><strong>Toneladas Procesadas:</strong> ${cicloActualizado.toneladasprocesadas} t</li>
                                    <li><strong>Ley Promedio:</strong> ${cicloActualizado.leyciclo} g/t</li>
                                    <li><strong>Oro Estimado en Planta:</strong> ${Number(cicloActualizado.oroestimadogramos || 0).toFixed(2)} g</li>
                                </ul>
                            </div>
                            <p>El ciclo está listo para la Validación Post-Cierre y conciliación de mermas.</p>
                            <p style="font-size: 12px; color: #9ca3af; margin-top: 30px;">Este es un mensaje automático del Sistema Minero.</p>
                        </div>
                    `;
                    
                    const mailOptions = {
                        from: `"Sistema Minero 🚧" <${process.env.EMAIL_USER}>`,
                        to: process.env.EMAIL_GERENCIA || 'gerencia@ejemplo.com',
                        subject: asunto,
                        html: mensajeHtml
                    };
                    
                    await transporter.sendMail(mailOptions);
                } catch (errorCorreo) {
                    console.error("Error al enviar correo de ciclo finalizado:", errorCorreo);
                }
            }

            const io = req.app.get('socketio');
            if (io) io.emit('nueva_produccion');

            res.json(cicloActualizado);
        } catch (error) { 
            res.status(500).json({ error: 'Error al cambiar el estatus del ciclo.' }); 
        }
    });

    router.put('/ciclos/:id/postcierre', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const data = req.body; 
            const cicloActualizado = await prisma.produccionciclo.update({ where: { idciclo: id }, data: data });
            const io = req.app.get('socketio');
            if (io) io.emit('nueva_produccion');

            res.json(cicloActualizado);
        } catch (error) { 
            res.status(500).json({ error: 'Error al validar el ciclo post-producción.' }); 
        }
    });

    router.put('/ciclos/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const { toneladasprocesadas, leyciclo, recuperacionporcentaje, oroestimadogramos, colastoneladas, observaciones } = req.body;

            const cicloEditado = await prisma.produccionciclo.update({
                where: { idciclo: id },
                data: {
                    toneladasprocesadas: parseFloat(toneladasprocesadas),
                    leyciclo: parseFloat(leyciclo),
                    recuperacionporcentaje: parseFloat(recuperacionporcentaje),
                    oroestimadogramos: parseFloat(oroestimadogramos),
                    colastoneladas: parseFloat(colastoneladas),
                    observaciones: observaciones
                }
            });

            const io = req.app.get('socketio');
            if (io) io.emit('nueva_produccion');

            res.json(cicloEditado);
        } catch (error) { 
            res.status(500).json({ error: 'Error al editar los datos operativos del ciclo.' }); 
        }
    });

    return router;
};
