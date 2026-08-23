# AutoVault — Car Dealership Inventory System

A full-stack web application for managing car dealership inventory. Built with FastAPI, React, and SQLite using test-driven development.

---

## Problem Statement

Car dealerships need a simple and reliable way to manage their vehicle inventory while allowing customers to view available vehicles and make purchases.

AutoVault provides a web-based inventory management system where:

- Customers can register, log in, browse vehicles, search and filter, and purchase vehicles
- Administrators can add, update, delete, and restock vehicles
- The system securely controls access using JWT authentication and role-based authorization
- Vehicle quantities are always consistent and never become negative

---

## Features

**Customer**
- Register and log in
- Browse all available vehicles
- Search by make, model, category, and price range
- Purchase vehicles (decreases stock by 1)
- Out of stock vehicles are clearly indicated and cannot be purchased

**Admin**
- All customer features
- Add new vehicles to inventory
- Edit existing vehicle details
- Delete vehicles with confirmation
- Restock vehicles

---

## Technology Stack

| Layer | Technology |
|-------|-----------|
| Backend | Python, FastAPI |
| ORM | SQLAlchemy |
| Database | SQLite (persistent) |
| Authentication | JWT (python-jose), bcrypt (passlib) |
| Testing | Pytest, pytest-cov |
| Frontend | React 19, Vite |
| Styling | Tailwind CSS |
| HTTP Client | Axios |
| Routing | React Router v7 |

---

## Architecture

```
backend/
├── app/
│   ├── main.py          # FastAPI app, router registration
│   ├── database.py      # SQLAlchemy engine, session, Base
│   ├── models.py        # User and Vehicle ORM models
│   ├── schemas.py       # Pydantic request/response schemas
│   ├── auth.py          # Password hashing, JWT creation/decoding
│   ├── dependencies.py  # get_current_user, require_admin
│   └── routes/
│       ├── auth.py      # /api/auth endpoints
│       └── vehicles.py  # /api/vehicles endpoints
└── tests/
    ├── conftest.py      # Test DB, TestClient, shared fixtures
    ├── test_auth.py     # Registration, login, JWT tests
    ├── test_vehicles.py # CRUD and search tests
    └── test_inventory.py # Purchase and restock tests

frontend/
└── src/
    ├── api/client.js        # Axios instance with JWT interceptor
    ├── context/AuthContext  # Global auth state
    ├── components/
    │   ├── Navbar.jsx
    │   ├── VehicleCard.jsx
    │   └── VehicleForm.jsx
    └── pages/
        ├── Login.jsx
        ├── Register.jsx
        ├── CustomerDashboard.jsx
        └── AdminDashboard.jsx
```

Request flow:

```
React (Axios) → FastAPI Routes → Services/Logic → SQLAlchemy → SQLite
```

---

## Database Schema

```
users
─────────────────────────────────────
id            INTEGER  PRIMARY KEY AUTOINCREMENT
name          TEXT     NOT NULL
email         TEXT     NOT NULL UNIQUE
password_hash TEXT     NOT NULL
role          TEXT     NOT NULL DEFAULT 'USER'
created_at    DATETIME DEFAULT CURRENT_TIMESTAMP

vehicles
─────────────────────────────────────
id            INTEGER  PRIMARY KEY AUTOINCREMENT
make          TEXT     NOT NULL
model         TEXT     NOT NULL
category      TEXT     NOT NULL
price         REAL     NOT NULL  CHECK(price >= 0)
quantity      INTEGER  NOT NULL  CHECK(quantity >= 0)
created_at    DATETIME DEFAULT CURRENT_TIMESTAMP
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/auth/register` | Public | Register a new user |
| POST | `/api/auth/login` | Public | Login and receive JWT |
| GET | `/api/auth/me` | Authenticated | Get current user info |

### Vehicles

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/api/vehicles` | Authenticated | List all vehicles |
| GET | `/api/vehicles/search` | Authenticated | Search/filter vehicles |
| POST | `/api/vehicles` | Admin | Add a vehicle |
| PUT | `/api/vehicles/{id}` | Admin | Update a vehicle |
| DELETE | `/api/vehicles/{id}` | Admin | Delete a vehicle |

### Inventory

| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/api/vehicles/{id}/purchase` | Authenticated | Purchase a vehicle |
| POST | `/api/vehicles/{id}/restock` | Admin | Restock a vehicle |

### Search Query Parameters

```
GET /api/vehicles/search?make=Toyota&model=Camry&category=Sedan&min_price=20000&max_price=40000
```

All parameters are optional and combinable.

---

## Authentication and Authorization

- Passwords are hashed using **bcrypt** via passlib — never stored in plaintext
- On login, the server returns a signed **JWT** (HS256, 30 min expiry)
- The frontend stores the token in `localStorage` and sends it as `Authorization: Bearer <token>`
- Every protected route uses the `get_current_user` FastAPI dependency to decode and validate the token
- The `require_admin` dependency wraps `get_current_user` and returns 403 if the user role is not ADMIN
- The frontend has route guards but backend authorization is the real security boundary

**Roles:**

| Role | Permissions |
|------|------------|
| USER | Register, login, browse vehicles, search, purchase |
| ADMIN | All USER permissions + add, edit, delete, restock vehicles |

---

## Setup Instructions

### Prerequisites

- Python 3.12+
- Node.js 18+
- Git

### Backend

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# macOS/Linux
source venv/bin/activate

pip install -r requirements.txt
uvicorn app.main:app --reload
```

Backend runs at: http://localhost:8000

API docs available at: http://localhost:8000/docs

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: http://localhost:5173

### Creating an Admin User

Register normally through the UI or API, then update the role directly in the database:

```bash
cd backend
python -c "
from app.database import SessionLocal
from app.models import User
db = SessionLocal()
user = db.query(User).filter(User.email == 'your@email.com').first()
user.role = 'ADMIN'
db.commit()
print('Done')
"
```

---

## Environment Variables

No `.env` file is required for local development. The following values are hardcoded for development and should be changed for production:

| Variable | Location | Default |
|----------|----------|---------|
| `SECRET_KEY` | `app/auth.py` | `autovault-secret-key-change-in-production` |
| `DATABASE_URL` | `app/database.py` | `sqlite:///./autovault.db` |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | `app/auth.py` | `30` |

---

## Testing Instructions

```bash
cd backend

# Run all tests
pytest tests/ -v

# Run with coverage
pytest tests/ -v --cov=app --cov-report=term-missing

# Run a specific test file
pytest tests/test_auth.py -v
pytest tests/test_vehicles.py -v
pytest tests/test_inventory.py -v
```

---

## Actual Test Results

```
62 passed in 111.28s

Name                     Stmts   Miss  Cover   Missing
------------------------------------------------------
app\__init__.py              0      0   100%
app\auth.py                 20      0   100%
app\database.py             12      4    67%
app\dependencies.py         20      1    95%
app\main.py                  7      0   100%
app\models.py               21      0   100%
app\routes\__init__.py       0      0   100%
app\routes\auth.py          27      1    96%
app\routes\vehicles.py      71      0   100%
app\schemas.py              87      2    98%
------------------------------------------------------
TOTAL                      265      8    97%
```

Test breakdown:

| File | Tests | Coverage |
|------|-------|----------|
| test_auth.py | 16 | Registration, login, JWT |
| test_vehicles.py | 32 | CRUD, search, authorization |
| test_inventory.py | 14 | Purchase, restock, edge cases |
| **Total** | **62** | **97%** |

---

## Screenshots

> Screenshots to be added after running the application locally.

---

## TDD Approach

This project followed strict Red-Green-Refactor TDD for all backend features:

1. **RED** — Write failing tests before any implementation
2. **GREEN** — Write the minimum code to make tests pass
3. **REFACTOR** — Improve code without changing behavior
4. **REGRESSION** — Run the full suite after each feature

The Git history reflects this approach — every feature has a `test:` commit before its `feat:` commit.

Example from the project history:

```
test: add user registration tests       ← RED
feat: implement user registration       ← GREEN
test: add login and JWT tests           ← RED
feat: implement login and JWT           ← GREEN
test: add vehicle creation tests        ← RED
feat: implement vehicle creation        ← GREEN
...
```

---

## AI Usage

Amazon Q Developer was used as an AI assistant during development.

AI helped with:
- Suggesting project structure and architecture
- Explaining concepts (JWT, TDD cycle, SQLAlchemy sessions)
- Generating test cases and implementation code
- Debugging issues (bcrypt version incompatibility)
- Writing documentation

All AI interactions are logged in [PROMPTS.md](./PROMPTS.md).

Commits where AI materially contributed include the co-author trailer:
```
Co-authored-by: Amazon Q <amazonq@amazon.com>
```

---

## Git Workflow

Conventional commit prefixes were used throughout:

| Prefix | Purpose |
|--------|---------|
| `chore:` | Setup, config, dependencies |
| `feat:` | New features |
| `test:` | Adding or updating tests |
| `fix:` | Bug fixes |
| `refactor:` | Code improvements |
| `docs:` | Documentation |

Development followed an incremental TDD workflow — small focused commits, tests before implementation, no large squashed commits.

---

## Future Improvements

- Add pagination to vehicle listing
- Add purchase history tracking per user
- Add image upload for vehicles
- Environment variable configuration via `.env`
- Deploy backend to AWS (Lambda + API Gateway or EC2)
- Deploy frontend to AWS S3 + CloudFront
- Add refresh token support
- Add admin user management UI
