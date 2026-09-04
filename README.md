# NavSetu

**नवसेतु — The bridge between government problems and startup innovation.**

A startup-friendly public procurement platform built for Smart India Hackathon 2026. NavSetu replaces the traditional 18–24 month tender cycle with a four-stage pipeline — **Identify → Pilot → Procure → Scale** — so government departments can post real problems, run low-risk pilots with startups, and convert successful pilots into full contracts without restarting procurement from scratch.

Built entirely on procurement provisions that already exist (GFR small-value exemptions, GeM Startup Runway) — no new policy required.

---

## Table of Contents

- [The Problem](#the-problem)
- [The Core Workflow](#the-core-workflow)
- [Tech Stack](#tech-stack)
- [Folder Structure](#folder-structure)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Overview](#api-overview)
- [User Roles](#user-roles)
- [MVP Scope](#mvp-scope-hackathon-demo)
- [Roadmap](#roadmap)
- [Contributing](#contributing)

---

## The Problem

Government departments want to buy innovative solutions from startups, but the traditional procurement process — long RFPs, rigid technical specifications, multi-year cycles — is built for buying standardized goods from large, established vendors. Good startups either give up on government contracts entirely, or spend years navigating paperwork before ever getting a real chance to prove their solution works.

**NavSetu is the missing bridge** — a platform that lets a department post a real problem, run a small low-risk trial with a startup, and, if the trial works, convert it into a full contract without restarting the entire procurement process. Once proven, other departments can adopt the same solution instantly.

## The Core Workflow

| Stage | What Happens | What NavSetu Does |
|---|---|---|
| **1. Identify** | Department describes a problem, not a rigid spec | Problem-posting portal + startup discovery, auto-eligibility screening (DPIIT) |
| **2. Pilot** | Startup runs a small, capped-budget, capped-duration trial | Auto-generated pilot agreement, milestone tracker |
| **3. Procure** | Successful pilot converts into a real contract | Auto-generated sole-source justification document backed by pilot performance data |
| **4. Scale** | Other departments adopt the proven solution | Public case-study listing + "adopt this contract" flow |

The platform's real value sits in stages **2 and 3** — turning a successful pilot into a contract without starting over. That is the part that currently breaks in real government procurement.

## Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS, React Router, Axios |
| Backend | Node.js, Express.js, REST API |
| Database | PostgreSQL (via Supabase or self-hosted) |
| Auth | JWT-based, role-based access control |
| Document Generation | pdf-lib / jsPDF |
| Hosting | Vercel (frontend) + Render / Railway (backend) |
| Notifications | Resend / SendGrid |
| Optional AI | Gemini API — problem-statement structuring, eligibility matching |

## Folder Structure

```
navsetu/
├── frontend/                        # React + Tailwind CSS
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── common/               # Navbar, Sidebar, Modal, StatusBadge
│   │   │   ├── department/           # ProblemForm, ApplicationCard, PilotStatusCard
│   │   │   └── startup/              # ApplyForm, MilestoneUpload, ContractStatus
│   │   ├── pages/
│   │   │   ├── department/           # PostProblem, ReviewApplications, PilotTracker, ConvertToContract
│   │   │   ├── startup/              # BrowseProblems, ApplyToProblem, SubmitMilestone
│   │   │   └── Login.jsx
│   │   ├── context/                  # AuthContext.jsx (role-based access)
│   │   ├── services/                 # api.js — single axios instance + endpoint calls
│   │   ├── hooks/
│   │   ├── utils/
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── .env
│   ├── tailwind.config.js
│   └── package.json
│
├── backend/                         # Node.js + Express REST API
│   ├── src/
│   │   ├── config/                   # db.js, env.js
│   │   ├── models/                   # 1:1 with schema tables
│   │   ├── routes/                   # authRoutes, problemRoutes, pilotRoutes, contractRoutes
│   │   ├── controllers/
│   │   ├── services/                 # core logic lives here
│   │   │   ├── eligibilityService.js   # DPIIT/GeM auto-screening
│   │   │   ├── workflowEngine.js       # Applied → Piloting → Converted state machine
│   │   │   ├── conversionEngine.js     # auto-generates justification doc
│   │   │   └── pdfGenerator.js         # pdf-lib / jsPDF wrapper
│   │   ├── middleware/                # auth.js (JWT), roleCheck.js, errorHandler.js
│   │   ├── utils/
│   │   └── app.js
│   ├── prisma/                       # schema.prisma or raw SQL migrations
│   ├── tests/
│   ├── .env
│   └── package.json
│
├── docs/
│   ├── architecture.md
│   ├── api-reference.md
│   └── er-diagram.png
│
├── .gitignore
├── docker-compose.yml                # optional: local Postgres for dev
└── README.md
```

## Getting Started

### Prerequisites
- Node.js v18+
- PostgreSQL 14+ (or a Supabase project)
- npm or yarn

### 1. Clone and install

```bash
git clone https://github.com/keshxvv21/navsetu.git
cd navsetu

# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install
```

### 2. Set up the database

```bash
cd backend
npx prisma migrate dev --name init
npx prisma generate
```

### 3. Run locally

```bash
# Terminal 1 — backend
cd backend
npm run dev        # http://localhost:5000

# Terminal 2 — frontend
cd frontend
npm run dev         # http://localhost:5173
```

## Environment Variables

**`backend/.env`**
```
DATABASE_URL=postgresql://user:password@localhost:5432/navsetu
JWT_SECRET=your_jwt_secret
PORT=5000
GEMINI_API_KEY=your_gemini_key       # optional, for AI Challenge Builder
EMAIL_API_KEY=your_resend_or_sendgrid_key
```

**`frontend/.env`**
```
VITE_API_BASE_URL=http://localhost:5000/api
```

## Database Schema

| Table | Key Fields |
|---|---|
| `departments` | id, name, sector, contact_info |
| `startups` | id, name, dpiit_id, sector, team_size, verified |
| `problems` | id, department_id, title, description, budget_cap, deadline, status |
| `applications` | id, problem_id, startup_id, pitch, status |
| `pilots` | id, application_id, start_date, end_date, budget, success_metrics, status |
| `milestones` | id, pilot_id, title, due_date, status, evidence_url |
| `contracts` | id, pilot_id, converted_at, contract_value, justification_doc_url |
| `adoptions` | id, contract_id, adopting_department_id, adopted_at |

## API Overview

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/auth/login` | Authenticate a user, returns JWT |
| `POST` | `/api/problems` | Department posts a new problem statement |
| `GET` | `/api/problems` | List/browse open problems |
| `POST` | `/api/applications` | Startup applies to a problem |
| `POST` | `/api/pilots/:applicationId` | Convert a selected application into a pilot |
| `POST` | `/api/pilots/:id/milestones` | Submit a milestone update |
| `POST` | `/api/pilots/:id/convert` | Trigger the Conversion Engine → generates contract + justification doc |
| `GET` | `/api/adoptions` | List adoptable, proven case studies |

Full reference: [`docs/api-reference.md`](docs/api-reference.md)

## User Roles

| Role | Access |
|---|---|
| **Department Admin** | Posts problems, reviews applications, approves pilots, converts to contract |
| **Startup User** | Browses problems, applies, submits milestones, views contract status |
| **Platform Admin** *(optional)* | Verifies startup eligibility, moderates listings, monitors pipeline |

## MVP Scope (Hackathon Demo)

- [ ] **Identify** — problem-posting form + application form, with eligibility filter
- [ ] **Pilot** — pilot record on selection; milestone tracker on both dashboards
- [ ] **Procure** — "Convert to Contract" button auto-generates a mock PDF justification doc *(demo's key moment)*
- [ ] **Scale** — static "adoption" screen showing successful cross-department reuse

## Roadmap

- [ ] Real DPIIT / GeM API integration (currently mocked for demo)
- [ ] AI Challenge Builder — Gemini-powered problem-statement structuring
- [ ] Milestone anomaly detection
- [ ] E-signature integration for pilot agreements
- [ ] Public adoption/case-study registry with search

## Contributing

This is a hackathon project built for SIH 2026 by Team **StartupDesk**. Internal contribution flow:

1. Branch off `main` — `feature/<short-description>`
2. Commit with clear messages
3. Open a PR against `main`, tag a teammate for review
4. Keep `services/` changes (workflow engine, conversion engine) especially well-commented — this is the code most likely to be reviewed closely by judges

---

Built for Smart India Hackathon 2026 · Theme: Smart Governance
