# Mentia

## Description

**Mentia** is a web platform focused on supporting programming learning. It allows students to upload source code or project files to be analyzed using artificial intelligence, obtaining strengths, areas for improvement, and a personalized study plan.

The application is made up of three main components:

- A **frontend** built with HTML, JavaScript, and Tailwind CSS.
- A **backend** built with Node.js and Express that handles authentication, activities, and communication with the database and the AI service.
- An **AI microservice** built in Python with FastAPI, responsible for sending the code to the Google Gemini API and processing the response.

The entire project runs **locally**.

---

# Features

- User login.
- Student profile management.
- Activity uploads.
- Uploading code files and compressed projects (.zip).
- Automatic code analysis via artificial intelligence.
- Display of strengths and areas for improvement.
- Generation of a personalized study plan.
- Activity history lookup.

---

# Architecture

```text
User
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
   └────────────► AI Microservice
                    (Python + FastAPI)
                            │
                            ▼
                   Google Gemini API
```

---

# Technologies used

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

## Database

- PostgreSQL 16
- DBeaver

## Artificial Intelligence

- Python
- FastAPI
- Google Gemini API

---

# Prerequisites

Before running the project, you need to have:

- Node.js 18 or higher.
- Python 3.10 or higher.
- PostgreSQL 16.
- Git.
- DBeaver (optional).
- A Google Gemini API Key.

---

# Installation

## 1. Clone the repository

```bash
git clone <REPOSITORY_URL>

cd mentia-learning-lab
```

---

## 2. Set up the database

Create a database called:

```text
mentia
```

Then run the file:

```text
database/schema.sql
```

If the project includes test data, also run:

```text
database/inserts.sql
```

---

## 3. Set up the backend

Go into the folder:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

Create a file named:

```text
.env
```

with the following content:

```env
PORT=3000

DATABASE_URL=postgres://USER:PASSWORD@localhost:5432/mentia

JWT_SECRET=YourSecureKey

IA_ANALISIS_URL=http://127.0.0.1:8001/analizar
```

Replace **USER** and **PASSWORD** with your PostgreSQL credentials.

---

## 4. Set up the AI microservice

Go into the folder:

```bash
cd ia-analisis
```

Install the dependencies:

```bash
python -m pip install -r requirements.txt
```

Create a file:

```text
.env
```

with the following content:

```env
GEMINI_API_KEY=YOUR_API_KEY

GEMINI_MODEL=gemini-2.5-flash-lite
```

> **Note:** Use a Gemini model available for the API being used.

---

# Running the project

The application requires two services to be running.

## Terminal 1 – AI Microservice

```bash
cd ia-analisis

python -m uvicorn main:app --reload --port 8001
```

If everything works correctly, you'll see:

```text
Uvicorn running on http://127.0.0.1:8001
```

---

## Terminal 2 – Backend

```bash
cd backend

npm start
```

If the server starts correctly, you'll see:

```text
Mentia running at http://localhost:3000
```

---

## Accessing the application

Open your browser at:

```text
http://localhost:3000
```

There's no need to run the frontend separately, since the backend automatically serves the application's files.

---

## Optional variant: frontend with Vite (development only)

The frontend doesn't need its own installation to use the application: the backend serves it directly as static files. This variant is only useful if you want to edit the frontend with hot reload.

```bash
cd frontend

npm install

npm run dev
```

This spins up a separate server (by default at `http://localhost:5173`). Since the frontend makes API requests using relative paths (same origin), for login and other calls to work in this mode you need the backend (Terminal 2) to also be running, and you need to access it via `http://localhost:3000`, not through the Vite port. If you're not going to touch the frontend, skip this step entirely.

---

# Workflow

1. The user logs into the platform.
2. Uploads an activity or a code file.
3. The backend receives the information sent from the frontend.
4. The backend sends the activity to the AI microservice.
5. The microservice queries the Google Gemini API.
6. Gemini analyzes the code and generates a diagnosis.
7. The result is sent back to the backend.
8. The backend stores the analysis and study plan in PostgreSQL.
9. Finally, the user views the results on the platform.

---

# Project structure

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

# Notes

- The application is designed to run in a local environment.
- PostgreSQL must be running before starting the backend.
- The AI microservice must be running for the code analysis feature to be available.
- The Google Gemini API Key must be valid and have permissions to use the configured model.

---

# Authors
