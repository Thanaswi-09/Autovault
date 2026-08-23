# PROMPTS.md — AI Conversation Log

This file documents my conversations with Amazon Q during the development of AutoVault.
I used it mainly to ask questions, get suggestions, and understand concepts — not to generate the entire project.

---

## Entry 1 — Project Structure

**My Prompt:**
I'm starting a FastAPI project. What's a good way to structure the folders?

**AI Response Summary:**
Amazon Q suggested separating concerns into routes, a services layer, and database access. It recommended keeping models, schemas, and auth utilities at the app root level and using APIRouter for grouping endpoints. I used this as a reference when deciding my own folder layout.

---

## Entry 2 — Understanding JWT

**My Prompt:**
How does JWT authentication work in a REST API? Where does the token get created and how does the client use it?

**AI Response Summary:**
Amazon Q explained that the server creates a signed JWT on login and returns it to the client. The client stores it and sends it in the Authorization header as `Bearer <token>` on every protected request. The server validates the token on each request. I used this understanding to design my own auth flow.

---

## Entry 3 — TDD Approach

**My Prompt:**
I need to follow TDD for this project. Can you explain the Red-Green-Refactor cycle and how strictly I should follow it?

**AI Response Summary:**
Amazon Q explained writing a failing test first (RED), implementing just enough to pass it (GREEN), then cleaning up without changing behavior (REFACTOR). It suggested working on one small group of related tests at a time rather than writing all tests upfront. I applied this cycle for every backend feature.

---

## Entry 4 — Database Design

**My Prompt:**
What fields should a vehicle inventory system typically have for users and vehicles in the database?

**AI Response Summary:**
Amazon Q suggested standard fields like id, name, email, hashed password, and role for users, and make, model, category, price, quantity for vehicles. It also recommended adding check constraints at the database level to prevent negative prices or quantities. I used this as a reference when writing my own models.

---

## Entry 5 — SQLAlchemy Sessions

**My Prompt:**
What does the SQLAlchemy session object actually do and when should I commit vs just query?

**AI Response Summary:**
Amazon Q explained that the session acts as a unit of work that tracks object changes and only writes to the database on commit. Queries don't require a commit but inserts and updates do. I used this to understand how to structure my database operations correctly.

---

## Entry 6 — Git Workflow

**My Prompt:**
What are conventional commit prefixes and should I use them for a student project?

**AI Response Summary:**
Amazon Q explained prefixes like feat:, test:, fix:, refactor:, docs:, and chore: and said they are a widely used industry standard that makes Git history readable. It suggested using them consistently to show professional development habits. I adopted this for all commits in this project.

---

## Entry 7 — Pytest Fixtures

**My Prompt:**
How do pytest fixtures work and how do I share a test database and test client across multiple test files?

**AI Response Summary:**
Amazon Q explained that fixtures defined in conftest.py are automatically available to all test files in the same directory. It suggested using a function-scoped fixture to create and drop tables before and after each test to keep tests isolated. I used this pattern in my conftest.py.

---

## Entry 8 — Pydantic Validation

**My Prompt:**
How do I validate request data in FastAPI? Can I add custom validation rules like minimum password length?

**AI Response Summary:**
Amazon Q explained that FastAPI uses Pydantic models for request validation and that custom validators can be added using the field_validator decorator. It showed how to raise a ValueError inside a validator to return a 422 response automatically. I used this for password length, empty string, and negative number validation in my schemas.

---

## Entry 9 — bcrypt Compatibility Issue

**My Prompt:**
My tests are failing with a bcrypt error about password length. What's going on?

**AI Response Summary:**
Amazon Q identified that bcrypt 5.x introduced a breaking change that is incompatible with passlib 1.7.4. It suggested downgrading bcrypt to 4.0.1 and pinning it in requirements.txt. This fixed the issue immediately.

---

## Entry 10 — FastAPI Dependencies

**My Prompt:**
What is the best way to protect routes in FastAPI so that some routes require a logged-in user and others require an admin?

**AI Response Summary:**
Amazon Q explained FastAPI's Depends() system and suggested creating two reusable dependencies — get_current_user which decodes the JWT and returns the user, and require_admin which wraps get_current_user and raises a 403 if the role is not ADMIN. I implemented this pattern in dependencies.py.

---

## Entry 11 — React State Management

**My Prompt:**
What is the simplest way to manage logged-in user state across multiple pages in React without using Redux?

**AI Response Summary:**
Amazon Q suggested using React Context with a custom useAuth hook. It explained that storing the user object and token in localStorage on login and reading it back on page load handles persistence without needing a heavy state management library. I implemented this in AuthContext.jsx.

---

## Entry 12 — Axios Interceptors

**My Prompt:**
How do I automatically attach the JWT token to every API request in React without repeating it in every component?

**AI Response Summary:**
Amazon Q explained Axios request interceptors — a function that runs before every request and can modify the config. It suggested reading the token from localStorage in the interceptor and adding it to the Authorization header. I used this in api/client.js.

---

## Entry 13 — React Router Protected Routes

**My Prompt:**
How do I redirect unauthenticated users away from protected pages in React Router?

**AI Response Summary:**
Amazon Q suggested creating a ProtectedRoute wrapper component that checks the auth context and returns a Navigate component to redirect to login if no user is found. It also showed how to extend this for role-based access by checking user.role. I used this pattern in App.jsx.

---

## Entry 14 — Tailwind CSS Dark Theme

**My Prompt:**
What Tailwind CSS color classes should I use for a clean dark theme UI?

**AI Response Summary:**
Amazon Q suggested using gray-950 for the page background, gray-900 for cards and panels, gray-800 for inputs, and blue-600 for primary actions. It recommended keeping text hierarchy with white for headings, gray-300 for body text, and gray-400 for labels. I used this palette consistently across all pages.

---
