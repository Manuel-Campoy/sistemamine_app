# Sistema Mine ERP - Gestión y Trazabilidad Minera

Sistema web progresivo (PWA) diseñado para la gestión integral, trazabilidad y control operativo de una mina, con arquitectura **Offline-First** para operadores en campo.

---

## 📋 Requisitos Previos

- **Node.js** 18+ 
- **PostgreSQL** 14+
- **Git**
- **npm** o **yarn**

---

## Instalación y Configuración

### 1. Clonar el repositorio

```bash
git clone https://github.com/tu_usuario/sistemamine_app.git
cd sistemamine_app
```

### 2. Configurar Variables de Entorno

#### Backend

```bash
cd backend
cp .env.example .env
```

Edita `backend/.env` y completa:
- `DATABASE_URL`: Tu conexión PostgreSQL
- `JWT_SECRET`: Una clave segura y única
- `EMAIL_USER` y `EMAIL_PASS`: Credenciales para envío de correos
- `EMAIL_GERENCIA`, `EMAIL_JEFE_PLANTA`: Correos de destino

**Ejemplo:**
```env
DATABASE_URL="postgresql://postgres:tu_contraseña@localhost:5432/sistemamine?schema=public"
JWT_SECRET="GeneraUnaClaveLargaYSegura123!@#"
EMAIL_USER=tu_email@gmail.com
EMAIL_PASS=tu_contraseña_app_gmail
EMAIL_GERENCIA=gerencia@tuempresa.com
EMAIL_JEFE_PLANTA=jefe@tuempresa.com
PORT=3000
```

#### Frontend

```bash
cd ../frontend
```

Opcionalmente, crea `.env.local` si necesitas sobrescribir URLs de API:
```env
VITE_API_URL=http://localhost:3000
```

### 3. Instalar dependencias

#### Backend

```bash
cd backend
npm install
```

Sincronizar Prisma con la BD:
```bash
npx prisma migrate deploy
# O si es la primera vez:
npx prisma db push
```

#### Frontend

```bash
cd ../frontend
npm install
```

---

## Ejecutar el Proyecto

### En desarrollo (2 terminales)

**Terminal 1 - Backend:**
```bash
cd backend
npm start
# O si tienes nodemon: npm run dev
```
Backend correrá en: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```
Frontend correrá en: `http://localhost:5173`

---

## Estructura del Proyecto

```
sistemamine_app/
├── backend/                    # API Node.js + Express 
│   ├── server.js              # Punto de entrada 
│   ├── package.json           # Scripts: npm start | npm run dev
│   ├── .env.example           # Plantilla de variables
│   ├── prisma/
│   │   └── schema.prisma      # Modelo de BD
│   ├── routes/                # 11 módulos de rutas separadas 
│   │   ├── auth.js            # Login, logout, roles
│   │   ├── usuarios.js        # CRUD usuarios
│   │   ├── vehiculos.js       # CRUD vehículos
│   │   ├── minas.js           # CRUD minas/empresas
│   │   ├── prospeccion.js     # CRUD lotes + estatus
│   │   ├── movimientos.js     # CRUD movimientos tierra + email
│   │   ├── dashboard.js       # Resumen + auditoría + notificaciones
│   │   ├── produccion.js      # CRUD ciclos + email
│   │   ├── reportes.js        # Reportes (inversionista, balance, auditoría)
│   │   ├── combustible.js     # CRUD combustible
│   │   └── permisos.js        # Gestión permisos dinámicos (RBAC)
│   ├── middlewares/           # Auth, validación, etc.
│   │   └── auth.middleware.js # JWT verification
│   └── utils/                 # Helpers (mailer, etc)
│
├── frontend/                   # React + Vite + PWA
│   ├── src/
│   │   ├── pages/             # Vistas por módulo
│   │   │   ├── catalogos/     # Usuarios, vehículos, minas
│   │   │   ├── prospeccion/   # Prospección + seguimiento
│   │   │   ├── produccion/    # Ciclos + post-cierre
│   │   │   ├── movimiento/    # Acarreo de tierra
│   │   │   ├── combustible/   # Recargas
│   │   │   ├── reportes/      # Reportes ejecutivos
│   │   │   └── notificaciones/# Centro de notificaciones
│   │   ├── components/        # Componentes reutilizables
│   │   ├── context/           # Context API (Auth, etc)
│   │   ├── api/               # Axios config, Socket.IO
│   │   └── db/                # IndexedDB local (Dexie)
│   ├── package.json           # Scripts: npm run dev | npm run build
│   └── vite.config.ts         # Config PWA
│
├── .editorconfig              # Consistencia de indentación 
├── .prettierrc                # Formato automático de código 
└── README.md                  # Este archivo
```

---

## Seguridad

- ✅ Nunca comitees archivos `.env` con secretos reales
- ✅ Usa `.env.example` como plantilla
- ✅ JWT_SECRET debe ser único y fuerte
- ✅ Credenciales de email: usa contraseña de aplicación (no tu contraseña real)
- ✅ En producción: usa variables de entorno desde tu hosting

---

## Base de Datos

El proyecto usa **Prisma ORM** + **PostgreSQL**.

### Crear migraciones

```bash
cd backend
npx prisma migrate dev --name nombre_migracion
```

### Ver estado de migraciones

```bash
npx prisma migrate status
```

### Sincronizar schema con BD (desarrollo)

```bash
npx prisma db push
```

### Abrir Prisma Studio (interfaz gráfica)

```bash
npx prisma studio
```

---

## Características Principales

- **Prospección y Lotes:** Registro de áreas y estimación de tonelajes
- **Movimiento de Tierra:** Viajes de camiones con soporte Offline
- **Producción:** Ciclos de lixiviación y cálculo de oro
- **Post-Producción:** Conciliación de oro estimado vs real
- **Combustible:** Panel gerencial con KPIs
- **RBAC:** Matriz de permisos dinámica
- **Notificaciones:** WebSockets + correos automáticos
- **Reportes:** Excel y PDF
- **Offline-First:** Sincronización automática de datos

---

## Arquitectura Modular

- **Backend Refactorizado:** 11 módulos independientes en `/routes/`
- **Factory Pattern:** Cada ruta inyecta `prisma` como dependencia
- **Socket.IO Centralizado:** Configurado en `server.js` (120 líneas)
- **Email Automático:** Notificaciones en movimientos, producción y dashboard
- **RBAC Dinámico:** Matriz de permisos configurable por rol

## Scripts Disponibles

### Backend

```bash
npm start              # Iniciar servidor
npm test               # Ejecutar tests (aún no configurados)
```

### Frontend

```bash
npm run dev            # Desarrollo con Vite
npm run build          # Build producción
npm run lint           # Verificar código con ESLint
npm run preview        # Preview de build local
```

---

## Troubleshooting

### Error: `DATABASE_URL` no configurada
```
Solución: Crea backend/.env y agrega DATABASE_URL
```

### Error: `ECONNREFUSED` en PostgreSQL
```
Verifica que PostgreSQL está corriendo:
- Windows: Services > PostgreSQL > Status
- Linux: sudo systemctl status postgresql
```

### Error: Puerto 3000 en uso
```
Cambia en backend/.env:
PORT=3001
```

### Cambios en frontend no se ven
```
Limpia caché:
rm -rf frontend/node_modules/.vite
npm run dev
```

---

## Documentación Adicional

- [Prisma ORM](https://www.prisma.io/docs)
- [React 19](https://react.dev)
- [Express.js](https://expressjs.com)
- [Socket.IO](https://socket.io)
- [Vite](https://vitejs.dev)

---

## Licencia

ISC

---

## Contacto / Soporte

Para problemas o sugerencias, abre un issue en este repositorio.

---

**Última actualización:** Abril 2026
