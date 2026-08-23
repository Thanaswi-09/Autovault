# PROMPTS.md — AI Conversation Log

This file contains the raw prompts sent to Amazon Q during the development of AutoVault,
including planning questions, technical implementation requests, and general learning questions.

---

## Entry 1 — Project Planning

**My Prompt:**
I am building a full-stack Car Dealership Inventory System called "AutoVault" for a technical evaluation. I want to plan it properly before writing any code. Can you help me think through the project structure, database schema, API design, and TDD approach? I have a short deadline so I don't want to over-engineer it.

**What I used this for:**
Getting an overall plan before starting — structure, schema, API routes, git commit plan, and edge cases.

---

## Entry 2 — Learning Question (JWT)

**My Prompt:**
I've heard of JWT tokens but I'm not 100% sure how they work in a REST API. Can you explain how JWT authentication works in a FastAPI app like where the token gets created, how the client sends it, and how the server validates it? Just a simple explanation, not code yet.

**What I used this for:**
Understanding JWT before implementing it so I could explain it myself in an interview.

---

## Entry 3 — Learning Question (TDD)

**My Prompt:**
What is the Red-Green-Refactor cycle in TDD? I understand the concept but I want to make sure I'm doing it correctly — like should I write ALL tests first or just one at a time? And what counts as "minimum implementation" in the Green phase?

**What I used this for:**
Making sure I understood TDD properly before applying it to this project.

---

## Entry 4 — Project Setup

**My Prompt:**
Okay I'm ready to start. Please set up the project scaffold for AutoVault — the folder structure, requirements.txt, placeholder files, conftest.py with test fixtures, and .gitignore. Don't write any application logic yet, just the skeleton.

**What I used this for:**
Generating the initial project structure so I could start from a clean, organized base.

---

## Entry 5 — Learning Question (SQLAlchemy)

**My Prompt:**
What is the difference between SQLAlchemy Core and SQLAlchemy ORM? Which one should I use for a project like this and why? Also what does the session object actually do?

**What I used this for:**
Understanding SQLAlchemy before writing the models so I knew what I was actually doing.

---

<!-- New entries will be added here as development continues -->
