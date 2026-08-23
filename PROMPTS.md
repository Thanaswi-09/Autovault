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

<!-- New entries will be added here as development continues -->
