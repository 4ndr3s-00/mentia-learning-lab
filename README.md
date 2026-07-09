# Mentia

Mentia is an adaptive learning platform that diagnoses a student's learning profile, recommends personalized study methodologies, and measures their effectiveness through a dynamic ranking system.

Instead of relying on AI/ML models, Mentia's core logic is fully rule-based: a weighted scoring formula across three learning dimensions, an if/else decision tree that maps students into four learner profiles, and SQL aggregation to rank methodology effectiveness over time.

## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Current Status](#current-status)
- [Getting Started](#getting-started)
- [Git Workflow](#git-workflow)
- [Roadmap](#roadmap)
- [License](#license)

## Overview

Mentia helps students understand *how* they learn best. Users go through a short diagnostic, get classified into one of four learner profiles, and receive study methodology recommendations tailored to that profile. As students submit activities and track progress, a ranking engine evaluates which methodologies are actually working, so recommendations keep improving over time.

## Key Features

- **User authentication** — registration and login with secure password handling.
- **Diagnostic engine** — a short assessment scores students across three learning dimensions and classifies them into one of four learner profiles using a rule-based (if/else) decision tree.
- **Personalized recommendations** — study methodologies suggested based on the student's profile.
- **Activity submissions** — students upload academic activities to track progress over time.
- **Dynamic ranking** — a ranking engine aggregates submission and methodology data with SQL to surface which methodologies produce the best results.
- **Admin panel** — management view for overseeing users, methodologies, and platform data.

## Tech Stack

**Backend**
- Python 3 with [FastAPI](https://fastapi.tiangolo.com/)
- PostgreSQL as the primary database
- SQLAlchemy ORM

**Frontend**
- Vanilla JavaScript SPA (no framework)
- [Vite](https://vitejs.dev/) as the build tool
- [Tailwind CSS](https://tailwindcss.com/) for styling

**Tooling & Workflow**
- Git with GitFlow branching (`main` / `develop` as permanent branches; `feature/`, `fix/`, `hotfix/`, `release/` as temporary branches)
- [Conventional Commits](https://www.conventionalcommits.org/) for commit messages

## Project Structure

```
mentia-learning-lab/
├── backend/
│   ├── app/
│   │   ├── core/          # App configuration and database setup
│   │   ├── models/        # SQLAlchemy models (user, profile, submission, methodology, ranking)
│   │   ├── routers/       # API endpoints (auth, users, profiles, submissions, methodologies, ranking, admin)
│   │   ├── schemas/       # Pydantic schemas
│   │   ├── services/      # Business logic (diagnostic engine, recommendation engine, ranking engine)
│   │   ├── utils/         # Shared utilities (security, etc.)
│   │   └── main.py        # FastAPI application entry point
│   ├── tests/
│   ├── requirements.txt
│   └── .env.example
├── frontend/
│   ├── src/
│   │   ├── api/           # API client
│   │   ├── components/    # Shared UI components (navbar, etc.)
│   │   ├── views/         # SPA views (login, dashboard, diagnostic, submissions, ranking, admin)
│   │   ├── styles/        # Tailwind entry point
│   │   ├── main.js        # App entry point
│   │   └── router.js      # Client-side routing
│   ├── login/              # Standalone login/register pages (legacy UI)
│   ├── actividades/         # Standalone "my activities" page (legacy UI)
│   ├── pag-subirarc/        # Standalone "upload activity" page (legacy UI)
│   ├── index.html           # Standalone AI-result dashboard page (legacy UI)
│   ├── vite.config.js
│   └── tailwind.config.js
├── database/
│   └── er_diagram.md      # Entity-relationship diagram
├── docs/
│   ├── documento_tecnico.md
│   ├── historias_usuario.md
│   └── product_backlog.md
└── README.md
```

## Current Status

Mentia is under active development.

- The **legacy frontend pages** (`login/`, `actividades/`, `pag-subirarc/`, `index.html`) are functional static HTML/CSS/JS screens built early in the project to validate the UI/UX flow (auth, activity upload, activity history, AI-result dashboard).
- The **new modular architecture** — the FastAPI backend (`backend/app/`) and the Vite-based SPA (`frontend/src/`) — is scaffolded with its full intended file structure (routers, models, schemas, services, views, etc.), but implementation is still in progress. Sprint 1 is focused on the authentication module.
- Documentation (`docs/`, `database/er_diagram.md`) is being written alongside the implementation.

The goal is to progressively migrate the functionality proven in the legacy pages into the FastAPI + SPA architecture.

## Getting Started

> ⚠️ The backend is still under construction — endpoints and business logic are being implemented sprint by sprint. The steps below reflect the intended setup once the backend is functional.

### Backend (FastAPI)

```bash
cd backend
python -m venv venv
source venv/bin/activate      # on Windows: venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env          # fill in your database credentials
uvicorn app.main:app --reload
```

### Frontend (Vite SPA)

```bash
cd frontend
npm install
npm run dev
```

### Legacy standalone pages

These pages don't require a build step — open them directly in the browser:

```
frontend/login/login.html
frontend/index.html
frontend/actividades/actividades.html
frontend/pag-subirarc/pag-subirarch.html
```

## Git Workflow

This project follows **GitFlow**:

- `main` and `develop` are permanent branches.
- `feature/*`, `fix/*`, `hotfix/*`, and `release/*` are temporary branches, created from and merged back into `develop` (or `main` for hotfixes).
- Commits follow the **Conventional Commits** format (e.g. `feat: add login endpoint`, `fix: correct ranking query`).

## Roadmap

- [x] Project scaffolding (backend + frontend structure)
- [x] Legacy UI screens for auth, activity upload, activity history, and AI-result dashboard
- [ ] Authentication module (Sprint 1)
- [ ] Diagnostic engine (three-dimension scoring + four-profile classification)
- [ ] Recommendation engine
- [ ] Submissions module
- [ ] Ranking engine
- [ ] Admin panel
- [ ] Migrate legacy pages into the Vite SPA

## License

© Mentia
