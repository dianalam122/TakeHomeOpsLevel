# Priority Todo — Take-Home

A small full-stack exercise: create, list, and delete todos with integer priorities, view gaps in the priority sequence, and a plain HTML/CSS/JS frontend served by the same FastAPI app.

## Tech stack

- **Backend:** Python 3, FastAPI, Pydantic, Uvicorn  
- **Frontend:** Static HTML, CSS, and JavaScript (no framework)

## Run locally

```bash
cd todo-app
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload
```

Open [http://127.0.0.1:8000](http://127.0.0.1:8000). Interactive API docs: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs).

## Assumptions

| Topic | Behavior |
|--------|----------|
| **Storage** | In-memory only; data is lost when the server process stops. |
| **Priorities** | Duplicate priorities are allowed. Lower numbers mean higher priority. |
| **Missing priorities** | Computed over integers **1 … M**, where **M** is the **maximum** priority among current todos. Any integer in that range with **no** todo assigned that priority counts as missing. |

## API (summary)

| Method | Path | Description |
|--------|------|-------------|
| GET | `/todos` | All todos, sorted by priority then id |
| POST | `/todos` | Create (`title`, `priority`) |
| DELETE | `/todos/{id}` | Delete |
| GET | `/missing-priorities` | List of missing priority integers |

## Why keep it simple

The scope is intentionally narrow: a single FastAPI module for HTTP, a small service layer for in-memory logic, Pydantic for request validation, and static assets with vanilla JS. That keeps the exercise easy to read, run, and review without database setup, containers, or extra infrastructure.
