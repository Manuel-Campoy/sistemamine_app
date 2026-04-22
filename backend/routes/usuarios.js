const express = require('express');
const bcrypt = require('bcryptjs');
const { verificarToken } = require('../middlewares/auth.middleware');

const router = express.Router();

module.exports = (prisma) => {
    // ==========================================
    // CATÁLOGO DE USUARIOS
    // ==========================================
    router.get('/', verificarToken(prisma), async (req, res) => {
        try { 
            const page = parseInt(req.query.page) || 1;
            const limit = parseInt(req.query.limit) || 50;
            const skip = (page - 1) * limit;

            const [usuariosRaw, total] = await prisma.$transaction([
                prisma.usuario.findMany({
                    skip: skip,
                    take: limit,
                    include: { rol: true },
                    orderBy: { nombre: 'asc' }
                }),
                prisma.usuario.count()
            ]);

            const usuariosEstandarizados = usuariosRaw.map(u => ({
                idusuario: u.idusuario, nombre: u.nombre, apellidopaterno: u.apellidopaterno,
                correo: u.correo, activo: u.activo, rol: { nombre: u.rol?.nombre || 'Sin Rol' }
            }));
            
            res.json({
                data: usuariosEstandarizados,
                pagination: { page, limit, total, pages: Math.ceil(total / limit) }
            });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno del servidor al consultar la base de datos' }); 
        }
    });

    router.get('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const usuarioRaw = await prisma.usuario.findUnique({ where: { idusuario: id }, include: { rol: true } });
            if (!usuarioRaw) return res.status(404).json({ error: 'Usuario no encontrado' });
            res.json({
                idusuario: usuarioRaw.idusuario, nombre: usuarioRaw.nombre, apellidopaterno: usuarioRaw.apellidopaterno,
                apellidomaterno: usuarioRaw.apellidomaterno || '', correo: usuarioRaw.correo, nombreusuario: usuarioRaw.nombreusuario,
                celular: usuarioRaw.celular || '', activo: usuarioRaw.activo, rol: usuarioRaw.rol?.nombre || '', 
            });
        } catch (error) { 
            res.status(500).json({ error: 'Error del servidor: ' + error.message }); 
        }
    });

    router.post('/', verificarToken(prisma), async (req, res) => {
        try {
            const { nombre, apellidopaterno, apellidomaterno, correo, nombreusuario, celular, rol, password } = req.body;
            const rolEncontrado = await prisma.rol.findFirst({ where: { nombre: { equals: rol, mode: 'insensitive' } } });
            if (!rolEncontrado) return res.status(400).json({ error: `El rol '${rol}' no existe en la base de datos.` });
            const existeCorreo = await prisma.usuario.findFirst({ where: { correo: { equals: correo, mode: 'insensitive' } } });
            if (existeCorreo) return res.status(400).json({ error: 'Este correo electrónico ya está registrado.' });

            const salt = await bcrypt.genSalt(10);
            const hashedPassword = await bcrypt.hash(password, salt);

            await prisma.usuario.create({
                data: {
                    idrol: rolEncontrado.idrol, nombre, apellidopaterno, apellidomaterno: apellidomaterno || null,
                    correo, celular: celular || null, nombreusuario: nombreusuario || correo.split('@')[0],
                    contrasenahash: hashedPassword, activo: true,
                }
            });
            res.status(201).json({ mensaje: 'Usuario creado exitosamente' });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno: ' + error.message }); 
        }
    });

    router.put('/:id', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const { nombre, apellidopaterno, apellidomaterno, correo, nombreusuario, celular, rol, password, activo } = req.body;
            const rolEncontrado = await prisma.rol.findFirst({ where: { nombre: { equals: rol, mode: 'insensitive' } } });
            if (!rolEncontrado) return res.status(400).json({ error: `El rol '${rol}' no existe.` });

            let updateData = { idrol: rolEncontrado.idrol, nombre, apellidopaterno, apellidomaterno: apellidomaterno || null, correo, nombreusuario, celular: celular || null, activo: activo };
            if (password) {
                const salt = await bcrypt.genSalt(10);
                updateData.contrasenahash = await bcrypt.hash(password, salt);
            }
            const userCheck = await prisma.usuario.findUnique({ where: { idusuario: id } });
            if (!userCheck) return res.status(404).json({ error: 'Usuario no encontrado' });
            
            await prisma.usuario.update({ where: { idusuario: id }, data: updateData });
            res.json({ mensaje: 'Usuario actualizado exitosamente' });
        } catch (error) { 
            res.status(500).json({ error: 'Error interno: ' + error.message }); 
        }
    });

    router.put('/:id/estado', verificarToken(prisma), async (req, res) => {
        try {
            const { id } = req.params;
            const { activo } = req.body;
            await prisma.usuario.update({ where: { idusuario: id }, data: { activo: activo } });
            res.json({ mensaje: `Estado actualizado a ${activo ? 'Activo' : 'Inactivo'}` });
        } catch (error) { 
            res.status(500).json({ error: 'Error al cambiar estado' }); 
        }
    });

    return router;
};
