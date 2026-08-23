# PROMPTS.md — AI Conversation Log

This file contains the raw prompts sent to Amazon Q during the development of AutoVault,
along with a summary of what the AI responded with and how it was used.

---

## Entry 1 — Learning Question (Project Structure)

**My Prompt:**
I'm starting a full-stack project and I'm not sure how to structure a FastAPI backend properly. What is a good folder structure for a FastAPI app with routes, services, and database access? Should I use blueprints like Flask or does FastAPI do it differently?

**AI Response Summary:**
Amazon Q explained that FastAPI uses APIRouter instead of blueprints. It recommended a simple structure with routes handling HTTP concerns, a services layer for business logic, and database.py for session management. It suggested keeping models, schemas, and auth in separate files at the app root level.

**How I used it:**
Used this to decide the folder layout before starting the project.

---

## Entry 2 — Project Planning

**My Prompt:**
I am building a full-stack Car Dealership Inventory System called "AutoVault" for a technical evaluation. The backend is FastAPI + SQLAlchemy + SQLite, frontend is React + Tailwind CSS. I need help planning the project structure, database schema, API design, authentication approach, TDD order, git commit plan, and important edge cases. Keep it simple — short deadline, no over-engineering.

**AI Response Summary:**
Amazon Q provided a complete project plan including:
- Full folder structure for backend and frontend
- Database schema for `users` and `vehicles` tables with constraints
- Full API design with routes, HTTP methods, and access levels
- JWT authentication design using `get_current_user` and `require_admin` dependencies
- TDD implementation order across 12 phases
- Git commit plan using conventional commit prefixes
- Testing structure for auth, vehicles, search, and inventory
- Important edge cases for auth, vehicles, search, and inventory
- Recommended .gitignore contents

**How I used it:**
Used as the master plan for the entire project before writing any code.

---

## Entry 3 — Learning Question (JWT)

**My Prompt:**
I've heard of JWT tokens but I'm not 100% sure how they work in a REST API. Can you explain how JWT authentication works in a FastAPI app — like where the token gets created, how the client sends it, and how the server validates it? Just a simple explanation, not code yet.

**AI Response Summary:**
Amazon Q explained that JWT tokens are created on the server after successful login, signed with a secret key, and returned to the client. The client stores the token (localStorage) and sends it in the Authorization header as `Bearer <token>` on every request. The server decodes and validates the token on each protected request using a FastAPI dependency.

**How I used it:**
Understanding JWT before implementing it so I could explain it in an interview.

---

## Entry 4 — Learning Question (TDD)

**My Prompt:**
What is the Red-Green-Refactor cycle in TDD? I understand the concept but I want to make sure I'm doing it correctly — like should I write ALL tests first or just one at a time? And what counts as "minimum implementation" in the Green phase?

**AI Response Summary:**
Amazon Q explained that in TDD you write one test (or a small group of related tests) at a time, confirm it fails for the right reason (RED), then write the minimum code to make it pass (GREEN), then clean up the code without changing behavior (REFACTOR). Minimum implementation means just enough to make the test pass — no extra logic.

**How I used it:**
Making sure I understood TDD correctly before applying it to this project.

---

## Entry 5 — Project Setup

**My Prompt:**
Okay I'm ready to start. Please set up the project scaffold for AutoVault — the folder structure, requirements.txt, placeholder files, conftest.py with test fixtures, and .gitignore. Don't write any application logic yet, just the skeleton.

**AI Response Summary:**
Amazon Q created the full project scaffold including:
- All backend directories (`app/`, `app/routes/`, `tests/`)
- Placeholder files for `main.py`, `database.py`, `models.py`, `schemas.py`, `auth.py`, `dependencies.py`, `routes/auth.py`, `routes/vehicles.py`
- `requirements.txt` with all dependencies (FastAPI, SQLAlchemy, passlib, python-jose, pytest, httpx, etc.)
- `conftest.py` with test database setup, TestClient, and shared fixtures (`registered_user`, `admin_user`, `user_headers`, `admin_headers`, `sample_vehicle`)
- Stub test files for `test_auth.py`, `test_vehicles.py`, `test_inventory.py`
- `.gitignore` for Python, Node, and IDE files
- `README.md` and `PROMPTS.md` stubs

**How I used it:**
Generated the initial project skeleton so I could start from a clean, organized base.

---

## Entry 6 — Git Setup

**My Prompt:**
I need to add this to git and push to my GitHub account. My repo is https://github.com/Thanaswi-09/Autovault

**AI Response Summary:**
Amazon Q ran the git commands to initialize the repository, make the first commit with the message `chore: initialize project structure and backend scaffold`, add the remote origin, and push to GitHub. It also set the local git config to use my name and email so commits show under my GitHub account instead of my brother's.

**How I used it:**
Setting up version control and pushing the initial scaffold to GitHub.

---

## Entry 7 — Learning Question (SQLAlchemy)

**My Prompt:**
What is the difference between SQLAlchemy Core and SQLAlchemy ORM? Which one should I use for a project like this and why? Also what does the session object actually do?

**AI Response Summary:**
Amazon Q explained that SQLAlchemy Core is lower-level SQL expression language while ORM maps Python classes to database tables. For a project like this, ORM is the right choice because it keeps the code readable and Pythonic. The session object acts as a unit of work — it tracks changes to objects and flushes them to the database when committed.

**How I used it:**
Understanding SQLAlchemy before writing the models.

---

## Entry 8 — Database Models

**My Prompt:**
Now implement database.py and models.py. The User model needs id, name, email, password_hash, role, created_at. The Vehicle model needs id, make, model, category, price, quantity, created_at. Add check constraints so price and quantity can never be negative. Use a persistent SQLite database, not in-memory.

**AI Response Summary:**
Amazon Q implemented:
- `database.py` with SQLAlchemy engine pointing to `autovault.db`, `SessionLocal`, `Base` using `DeclarativeBase`, and `get_db` dependency
- `models.py` with `User` model (id, name, email, password_hash, role defaulting to "USER", created_at) and `Vehicle` model (id, make, model, category, price, quantity, created_at) with `CheckConstraint` on price >= 0 and quantity >= 0
- Verified tables were created successfully by running the models against the engine

**How I used it:**
Implemented the database layer as the foundation before writing any routes or tests.

---

<!-- New entries will be added here as development continues -->
