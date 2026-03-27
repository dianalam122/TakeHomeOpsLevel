from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

import services
from models import Todo, TodoCreate

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="Todo (in-memory)")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/todos", response_model=list[Todo])
def list_todos() -> list[Todo]:
    return services.list_todos()


@app.post("/todos", response_model=Todo, status_code=201)
def create_todo(body: TodoCreate) -> Todo:
    return services.create_todo(body.title, body.priority)


@app.delete("/todos/{todo_id}", status_code=204)
def delete_todo(todo_id: int) -> None:
    if not services.delete_todo(todo_id):
        raise HTTPException(
            status_code=404,
            detail=f"No todo exists with id {todo_id}.",
        )


@app.get("/missing-priorities", response_model=list[int])
def missing_priorities() -> list[int]:
    return services.get_missing_priorities()
