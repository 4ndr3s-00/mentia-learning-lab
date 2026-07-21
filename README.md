# Mentia

## Descripción

**Mentia** es una plataforma web orientada al apoyo del aprendizaje en programación. Permite que los estudiantes carguen código fuente o archivos de un proyecto para que sean analizados mediante inteligencia artificial, obteniendo fortalezas, oportunidades de mejora y un plan de estudio personalizado.

La aplicación está compuesta por tres componentes principales:

- Un **frontend** desarrollado con HTML, JavaScript y Tailwind CSS.
- Un **backend** desarrollado en Node.js y Express que gestiona la autenticación, las actividades y la comunicación con la base de datos y el servicio de inteligencia artificial.
- Un **microservicio de IA** desarrollado en Python con FastAPI, encargado de enviar el código a la API de Google Gemini y procesar la respuesta.

Todo el proyecto se ejecuta de manera **local**.

---

# Características

- Inicio de sesión de usuarios.
- Gestión del perfil del estudiante.
- Carga de actividades.
- Carga de archivos de código y proyectos comprimidos (.zip).
- Análisis automático del código mediante inteligencia artificial.
- Visualización de fortalezas y aspectos por mejorar.
- Generación de un plan de estudio personalizado.
- Consulta del historial de actividades.

---

# Arquitectura

```text
Usuario
   │
   ▼
Frontend
(HTML + JavaScript + Tailwind CSS)
   │
HTTP / JSON
   ▼
Backend
(Node.js + Express)
   ├────────────► PostgreSQL 16
   │
   └────────────► Microservicio IA
                    (Python + FastAPI)
                            │
                            ▼
                   API de Google Gemini
```

---

# Tecnologías utilizadas

## Frontend

- HTML5
- JavaScript (Vanilla)
- Tailwind CSS

## Backend

- Node.js
- Express.js
- JSON Web Token (JWT)
- bcryptjs
- Multer
- PostgreSQL (pg)

## Base de datos

- PostgreSQL 16
- DBeaver

## Inteligencia Artificial

- Python
- FastAPI
- Google Gemini API

---

# Requisitos previos

Antes de ejecutar el proyecto es necesario contar con:

- Node.js 18 o superior.
- Python 3.10 o superior.
- PostgreSQL 16.
- Git.
- DBeaver (opcional).
- Una API Key de Google Gemini.

---

# Instalación

## 1. Clonar el repositorio

```bash
git clone <URL_DEL_REPOSITORIO>

cd mentia-learning-lab
```

---

## 2. Configurar la base de datos

Crear una base de datos llamada:

```text
mentia
```

Posteriormente ejecutar el archivo:

```text
database/schema.sql
```

Si el proyecto incluye datos de prueba, ejecutar además:

```text
database/inserts.sql
```

---

## 3. Configurar el backend

Ingresar a la carpeta:

```bash
cd backend
```

Instalar las dependencias:

```bash
npm install
```

Crear un archivo llamado:

```text
.env
```

con la siguiente información:

```env
PORT=3000

DATABASE_URL=postgres://USUARIO:CONTRASEÑA@localhost:5432/mentia

JWT_SECRET=UnaClaveSegura

IA_ANALISIS_URL=http://127.0.0.1:8001/analizar
```

Reemplazar **USUARIO** y **CONTRASEÑA** por las credenciales de PostgreSQL.

---

## 4. Configurar el microservicio de IA

Ingresar a la carpeta:

```bash
cd ia-analisis
```

Instalar las dependencias:

```bash
python -m pip install -r requirements.txt
```

Crear un archivo:

```text
.env
```

con el siguiente contenido:

```env
GEMINI_API_KEY=TU_API_KEY

GEMINI_MODEL=gemini-2.5-flash-lite
```

> **Nota:** Utilizar un modelo de Gemini disponible para la API utilizada.

---

# Ejecución del proyecto

La aplicación requiere ejecutar dos servicios.

## Terminal 1 – Microservicio de IA

```bash
cd ia-analisis

python -m uvicorn main:app --reload --port 8001
```

Si todo funciona correctamente aparecerá:

```text
Uvicorn running on http://127.0.0.1:8001
```

---

## Terminal 2 – Backend

```bash
cd backend

npm start
```

Si el servidor inicia correctamente aparecerá:

```text
Mentia corriendo en http://localhost:3000
```

---

## Acceder a la aplicación

Abrir el navegador en:

```text
http://localhost:3000
```

No es necesario ejecutar el frontend por separado, ya que el backend sirve automáticamente los archivos de la aplicación.

---

## Variante opcional: frontend con Vite (solo para desarrollo)

El frontend no necesita instalación propia para usar la aplicación: el backend lo sirve directo como archivos estáticos. Esta variante solo es útil si quieres editar el frontend con recarga en caliente.

```bash
cd frontend

npm install

npm run dev
```

Esto levanta un servidor aparte (por defecto en `http://localhost:5173`). Como el frontend hace las peticiones a la API con rutas relativas (mismo origen), para que el login y las demás llamadas funcionen en este modo necesitas que el backend (Terminal 2) también esté corriendo y acceder vía `http://localhost:3000`, no por el puerto de Vite. Si no vas a tocar el frontend, omite este paso por completo.

---

# Flujo de funcionamiento

1. El usuario inicia sesión en la plataforma.
2. Carga una actividad o un archivo de código.
3. El backend recibe la información enviada desde el frontend.
4. El backend envía la actividad al microservicio de inteligencia artificial.
5. El microservicio consulta la API de Google Gemini.
6. Gemini analiza el código y genera un diagnóstico.
7. El resultado es enviado nuevamente al backend.
8. El backend almacena el análisis y el plan de estudio en PostgreSQL.
9. Finalmente, el usuario visualiza los resultados desde la plataforma.

---

# Estructura del proyecto

```text
mentia-learning-lab/
│
├── backend/
│   ├── server.js
│   ├── auth.js
│   ├── db.js
│   ├── ia.js
│   ├── uploads/
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   ├── components/
│   │   ├── api.js
│   │   ├── router.js
│   │   └── main.js
│   ├── public/img/
│   ├── index.html
│   └── package.json
│
├── ia-analisis/
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── database/
│   ├── schema.sql
│   └── inserts.sql
│
└── README.md
```

---

# Consideraciones

- La aplicación está diseñada para ejecutarse en un entorno local.
- Es necesario que PostgreSQL se encuentre en ejecución antes de iniciar el backend.
- El microservicio de inteligencia artificial debe estar iniciado para que la funcionalidad de análisis de código esté disponible.
- La API Key de Google Gemini debe ser válida y contar con permisos para utilizar el modelo configurado.

---

# Autores
