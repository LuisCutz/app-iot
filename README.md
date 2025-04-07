# 🌱 App IoT

Este proyecto es un **monorepo** que contiene:

- ⚛️ Un **frontend** hecho con React + Vite + TailwindCSS.
- 🚀 Un **backend** construido con NestJS + Prisma + PostgreSQL.

Su propósito es gestionar y visualizar datos de sensores IoT (humedad, temperatura, lluvia y luz solar) desde un dashboard interactivo. Los datos se obtienen de una API externa y se almacenan localmente.

---

## 📁 Estructura del proyecto

- **`/frontend`**: Aplicación React para el dashboard de visualización.  
- **`/backend`**: API REST con NestJS y Prisma para procesar y almacenar datos.  

Cada carpeta tiene su propio archivo `package.json` y se ejecuta de manera independiente.

---

## ✅ Requisitos previos

Antes de comenzar, asegúrate de tener instalado:
- **Node.js** v22 o superior 👉 `node -v`. Si necesitas instalarla, descárgala desde [nodejs.org](https://nodejs.org/).
- **npm** (incluido con Node.js) 👉 `npm -v`. Este proyecto usa NPM como gestor de paquetes.
- **PostgreSQL** Una base de datos PostgreSQL corriendo localmente (por ejemplo, en `localhost:5432`) o en un servidor remoto. Necesitarás conocer el usuario, contraseña y nombre de la base de datos.

---

## ⚙️ Instalación

Sigue estos pasos cuidadosamente para configurar el proyecto:

### 1. Clona el repositorio
Abre una terminal y ejecuta:
```bash
git clone https://github.com/LuisCutz/app-iot.git
cd app-iot
```
Esto descargará el monorepo y te posicionará en la carpeta raíz.

### 2. Instala las dependencias
### 📦 Frontend
Desde la raíz del proyecto, entra a la carpeta frontend e instala sus paquetes:
```bash
cd frontend
npm install
```
Esto instalará todas las dependencias listadas en frontend/package.json.

- ⏳ Espera a que finalice la instalación antes de continuar con el siguiente paso (puede tardar unos minutos dependiendo de tu conexión). Verás un mensaje en la terminal cuando finalice.
- 💡 Alternativamente, puedes abrir otra terminal para instalar el backend en paralelo.
### 🛠 Backend
```bash
cd ../backend
npm install
```
Esto instalará las dependencias listadas en backend/package.json, incluyendo Prisma y las librerías de NestJS.

## 🔐 Configuración de variables de entorno
### 🖥 Frontend (frontend/.env)
Crea un archivo .env con el siguiente contenido:
```
VITE_MAPBOX_ACCESS_TOKEN=pk.ey...
```
🔑 Reemplaza el token con uno válido obtenido desde mapbox.com.

### 🗄 Backend (backend/.env)
Crea un archivo .env en la carpeta backend/ con:
```
DATABASE_URL="postgresql://postgres:password@localhost:5432/app_iot?schema=public"
JWT_SECRET="secret"
```
🔧 Ajusta:
- postgres:password → Cambia por tu usuario y contraseña de PostgreSQL.
- localhost:5432 → Ajusta si tu base de datos está en otro host o puerto.
- app_iot → Nombre de la base de datos; cámbialo si usas otro.
- JWT_SECRET → Reemplaza "secret" por una clave segura (por ejemplo, una cadena larga y aleatoria) para la autenticación JWT.

---

## 🧱 Preparar base de datos

El backend usa Prisma como ORM para interactuar con PostgreSQL. Sigue estos pasos para preparar la base de datos:

1. Asegúrate de que PostgreSQL esté corriendo (por ejemplo, con psql o una herramienta como pgAdmin).
2. Verifica que la base de datos especificada en DATABASE_URL exista. Si no, créala manualmente:
```bash
psql -U postgres -c "CREATE DATABASE app_iot;"
```
- Ajusta el usuario (-U postgres) según tu configuración.

3. Desde la carpeta backend/, aplica las migraciones de Prisma:
```bash
npx prisma migrate dev
```

- Esto creará las tablas necesarias en la base de datos según el esquema definido en backend/prisma/schema.prisma.
- Nota: Si es la primera vez, Prisma también generará el cliente Prisma. Espera a que el comando termine antes de continuar.

## ▶️ Iniciar la aplicación
**Sugerencia:** Usa dos terminales para ejecutar frontend y backend al mismo tiempo, ya que ambos deben estar activos para que el proyecto funcione completamente.

### 🧩 Frontend
Abre una terminal y desde la raíz ejecuta:
```bash
cd frontend
npm run dev
```

- Esto lanzará el servidor de desarrollo de Vite.
- Una vez que veas un mensaje como "*Local: http://localhost:5173/*", el frontend estará listo.
- Abre esa URL en tu navegador.

### 🧪 Backend
En otra terminal desde la raíz ejecuta:
```bash
cd backend
npm run start:dev
```

- Esto inicia NestJS en modo desarrollo con recarga automática.
- Verás un mensaje como "*LOG [NestApplication] Nest application successfully started*" cuando esté listo.
- Alternativamente, usa npm run start para modo producción (sin recarga automática).

📘 La API corre en: [http://localhost:3000](http://localhost:3000)

Al acceder directamente a esa URL verás un mensaje como:
```json
{"message":"Cannot GET /","error":"Not Found","statusCode":404}
```
🔹 Esto es completamente normal.
La API no tiene una ruta raíz (`/`) porque está diseñada para responder solo en rutas específicas como `/sensores`.<br>
Para probar la API visualmente, puedes abrir la documentación Swagger:

👉 [http://localhost:3000/api](http://localhost:3000/api)

## 📝 Notas finales
- Asegúrate de tener los archivos .env configurados antes de iniciar los servidores.
- Mantén ambas aplicaciones (frontend y backend) corriendo al mismo tiempo para una funcionalidad completa.
- Si tienes errores al migrar con Prisma, revisa la conexión en DATABASE_URL y que PostgreSQL esté activo.

### ¡Listo! 🚀 Con esto ya deberías tener todo funcionando correctamente.
