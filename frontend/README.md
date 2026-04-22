# Sistema Mine ERP - Gestión y Trazabilidad Minera 

Sistema web progresivo (PWA) diseñado para la gestión integral, trazabilidad y control operativo de una mina. Este sistema digitaliza el flujo completo de extracción de oro, desde la prospección y el movimiento de tierra (acarreo) hasta el procesamiento en planta y la conciliación final.

Destaca por su **arquitectura Offline-First**, permitiendo a los operadores en campo (usando tablets o celulares) registrar viajes, consumir combustible y reportar ciclos de producción sin conexión a internet, sincronizando los datos automáticamente al recuperar la señal.

---

## Características Principales (Módulos)

* **Prospección y Lotes:** Registro de áreas de extracción, estimación de tonelajes y leyes, y control de estatus operativo (Exploración, Barrenación, Extracción).
* **Movimiento de Tierra (Acarreo):** Registro de viajes por turno, control de camiones (origen-destino) y barra de progreso de extracción por lote. **100% Offline.**
* **Producción (Planta):** Bitácora de ciclos de lixiviación, cálculo automático de colas y oro estimado, y seguimiento de fases (Pendiente, En Proceso, Finalizado).
* **Post-Producción y Cierre:** Conciliación de oro estimado vs. real, control de humedad/merma y consumo de reactivos.
* **Control de Combustible:** Panel gerencial con KPIs de consumo de diésel y vista simplificada de despachador (Tablet) con soporte offline.
* **Seguridad Dinámica (Matriz de Permisos):** Sistema de control de acceso basado en Roles (RBAC) administrable desde una interfaz gráfica, respaldado al 100% por la base de datos.
* **Notificaciones y Alertas:** WebSockets para actualizaciones en tiempo real en pantalla y envío de correos electrónicos automáticos (Alertas Gerenciales) para eventos de alto valor.
* **Reportes Automáticos:** Exportación nativa de tablas y bitácoras a Excel y PDF estructurado.

---

## Tecnologías y Paquetes Utilizados

El proyecto está dividido en dos partes principales: **Frontend** (React) y **Backend** (Node.js).

### Frontend (Cliente PWA)
* **React 18 + Vite:** Framework de UI y empaquetador ultrarrápido.
* **React Router DOM:** Para el enrutamiento y protección de vistas.
* **Axios:** Para peticiones HTTP al servidor con interceptores de tokens.
* **LocalForage / Dexie.js:** Bases de datos locales en el navegador (IndexedDB) para la cola de sincronización offline.
* **Socket.io-client:** Para escuchar eventos en tiempo real.
* **XLSX & jsPDF (con jspdf-autotable):** Para la generación y descarga de reportes.

### Backend (Servidor API)
* **Node.js + Express:** Servidor principal y enrutador de la API REST.
* **Prisma ORM:** Modelado, migraciones y consultas a la base de datos PostgreSQL.
* **JSON Web Tokens (JWT) & bcrypt:** Autenticación de usuarios y encriptación de contraseñas.
* **Socket.io:** Motor de WebSockets para notificaciones interactivas.
* **Nodemailer:** Motor para el envío de alertas y reportes por correo electrónico.
* **CORS:** Comunicación cruzada entre puertos y dispositivos en red local.

---

## Requisitos Previos

Antes de ejecutar el proyecto, asegúrate de tener instalado:
* [Node.js](https://nodejs.org/) (v18 o superior)
* [PostgreSQL](https://www.postgresql.org/) (Base de datos relacional en ejecución)

---

## Instalación y Despliegue Local

### 1. Clonar el repositorio
```bash
git clone [https://github.com/tu-usuario/sistemamine_app.git]
cd sistemamine_app
\`\`\`

### 2. Configuración del Backend
Abre una terminal en la carpeta del backend y ejecuta los siguientes comandos:

\`\`\`bash
cd backend
# Instalar dependencias
npm install

# Generar cliente de Prisma y empujar esquemas a la BD
npx prisma generate
npx prisma db push

# Iniciar el servidor (Por defecto en http://localhost:3000)
npm run dev
# o usando node: node server.js
\`\`\`

**Variables de entorno (.env) del Backend:**
Crea un archivo `.env` en la raíz de la carpeta `backend` con la siguiente estructura:
\`\`\`env
# URL de conexión a tu base de datos PostgreSQL
DATABASE_URL="postgresql://usuario:contraseña@localhost:5432/nombre_base_datos?schema=public"

# Puerto del servidor
PORT=3000

# Semilla secreta para los tokens de sesión
JWT_SECRET="tu_super_secreto_seguro_2026"
\`\`\`

# Credenciales para el envío de correos automatizados
EMAIL_USER="tu_correo@gmail.com"
EMAIL_PASS="tu_contraseña_de_aplicacion_google"

### 3. Configuración del Frontend
Abre una nueva terminal en la carpeta del frontend:

\`\`\`bash
cd frontend
# Instalar dependencias
npm install
\`\`\`

#### ⚠️ IMPORTANTE: Modos de Ejecución del Frontend

**A) Modo Desarrollo (Para editar código)**
\`\`\`bash
npm run dev
\`\`\`
*Levanta la app en \`http://localhost:5173\`. Nota: En este modo el Service Worker (Modo Offline) no se instalará por políticas de seguridad del navegador.*

**B) Modo Producción Simulada (Para probar la PWA y el modo Offline)**
\`\`\`bash
npm run build
npm run preview
\`\`\`
*Levanta la app empaquetada, generalmente en \`http://localhost:4173\`. **Este es el modo correcto para instalar la aplicación en el escritorio y probar apagar el WiFi para la sincronización.***

---

## Contexto del Proyecto
Este software fue desarrollado como proyecto de Práctica Profesional, enfocado en resolver el problema de trazabilidad de material y la falta de conectividad a internet en las zonas operativas de campo.