# Backend de Mentia (Node.js vanilla)

Backend simple en JavaScript puro (Node + Express) + SQL directo a PostgreSQL. El análisis de código lo hace un servicio aparte en Python (`../ia-analisis`) que usa la IA de Gemini — este backend solo le habla por internet (HTTP) y guarda el resultado en la base de datos.

Este backend también sirve el frontend (los archivos de `../frontend`), así que con un solo `npm start` queda todo arriba: no hace falta correr nada en la carpeta `frontend`.

## Archivos

- `server.js` — el archivo principal: arranca el servidor, tiene todas las rutas (URLs) de la API y sirve el frontend.
- `db.js` — la conexión a PostgreSQL.
- `auth.js` — encriptar contraseñas y manejar el token de sesión (login).
- `ia.js` — habla con `ia-analisis` y guarda el análisis + plan de estudio en la base de datos.
- `uploads/` — aquí quedan guardados los archivos/imágenes que suben los estudiantes.

## Cómo correr todo (se necesitan 2 terminales)

**Terminal 1 — el servicio de IA (Python + Gemini):**
```
cd ia-analisis
pip install -r requirements.txt
uvicorn main:app --reload --port 8001
```

**Terminal 2 — backend + frontend juntos (Node):**
```
cd backend
npm install
npm start
```
Antes de correrlo, copia `.env.example` a `.env` y pon los datos reales de tu base de datos (`DATABASE_URL`) y una `JWT_SECRET` cualquiera.

Abre **http://localhost:3000** en el navegador — ahí está la app completa (login incluido).

## Base de datos

Corre `database/schema.sql` en tu PostgreSQL una vez (crea las tablas), y si quieres datos de ejemplo, `database/inserts.sql` (crea el usuario `juan@mentia.com` con contraseña `123456`).
