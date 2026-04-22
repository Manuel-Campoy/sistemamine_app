# Backend - Sistema Mine ERP

API REST de Node.js + Express para la gestión integral de operaciones mineras. Arquitectura modular con 11 módulos de rutas independientes.

---

## Inicio Rápido

### 1. Instalación de dependencias

\`\`\`bash
npm install
\`\`\`

### 2. Configurar variables de entorno

\`\`\`bash
cp .env.example .env
\`\`\`

Edita \`.env\`:
\`\`\`env
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/sistemamine"
JWT_SECRET="GeneraUnaClaveLargaYSegura123!@#"
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app
EMAIL_GERENCIA=gerencia@empresa.com
EMAIL_JEFE_PLANTA=jefe@empresa.com
PORT=3000
\`\`\`

### 3. Sincronizar base de datos

\`\`\`bash
npx prisma db push
\`\`\`

### 4. Ejecutar servidor

\`\`\`bash
npm start
# O con nodemon (desarrollo):
npm run dev
\`\`\`

---

## Estructura

- **server.js** - Punto de entrada (120 líneas, limpio)
- **routes/** - 11 módulos independientes:
  - auth.js, usuarios.js, vehiculos.js, minas.js
  - prospeccion.js, movimientos.js, dashboard.js
  - produccion.js, reportes.js, combustible.js, permisos.js
- **middlewares/** - JWT verification
- **utils/** - Email, helpers
- **prisma/** - Schema ORM

---

## Endpoints Principales

| Módulo | Endpoints | Funcionalidad |
|--------|-----------|---------------|
| **auth** | /login, /logout, /roles | Autenticación |
| **usuarios** | CRUD + /estado | Gestión usuarios |
| **vehiculos** | CRUD + /estado | Gestión flota |
| **minas** | CRUD + /estado | Catálogo empresas |
| **prospeccion** | CRUD + /estatus | Lotes de minería |
| **movimientos** | CRUD, /lote/{id} | Acarreo de tierra + email |
| **dashboard** | /resumen, /auditoria, /notificaciones | Métricas y alertas |
| **produccion** | CRUD ciclos + /estatus | Ciclos de lixiviación + email |
| **reportes** | /inversionista, /balance, /auditoria | Reportes ejecutivos |
| **combustible** | CRUD + WebSocket | Recargas combustible |
| **permisos** | /rol-permisos (CRUD) | Matriz RBAC dinámica |

---

## Seguridad

- ✅ JWT expira 8 horas
- ✅ Rate limiting: 1000 req/15min (general), 5/15min (login)
- ✅ CORS whitelist
- ✅ DATABASE_URL y JWT_SECRET obligatorios
- ✅ Cookies httpOnly

---

## Notificaciones Automáticas

1. **Acarreo completado** (≥99% estimado) → EMAIL_JEFE_PLANTA
2. **Cambio estatus lote** → Email especificado
3. **Ciclo producción finalizado** → EMAIL_GERENCIA

---

## WebSockets

Eventos: nueva_notificacion, nueva_dompada, nueva_recarga, nueva_produccion

---

## Stack

- Node.js 18+
- Express 5.2.1
- PostgreSQL + Prisma ORM 7.4.2
- Socket.IO 4.8.3
- JWT + bcryptjs
- Nodemailer

---

## Scripts

\`\`\`bash
npm start         # Iniciar servidor
npm run dev       # Desarrollo (nodemon)
\`\`\`

---

**Última actualización:** Abril 2026
**Versión:** 1.0.0