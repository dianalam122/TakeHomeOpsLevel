# Todo (take-home)

A minimal FastAPI app with an in-memory todo list and a small static UI.

## Setup

```bash
cd todo-app
python3 -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
```

## Run

```bash
uvicorn main:app --reload
```

Open http://127.0.0.1:8000 in your browser.

## API

| Method | Path | Description |
|--------|------|-------------|
| GET | `/todos` | List all todos (sorted by priority, then id) |
| POST | `/todos` | Create (`{"title": "...", "priority": 1}`) |
| DELETE | `/todos/{id}` | Delete |
| GET | `/missing-priorities` | Gaps from 1 to max priority (empty if no todos) |

Interactive docs: http://127.0.0.1:8000/docs

Data is stored in memory only and resets when the process restarts.
