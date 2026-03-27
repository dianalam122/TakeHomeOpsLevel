from pathlib import Path

from fastapi import FastAPI, HTTPException
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles

import services
from models import Todo, TodoCreate, TodoUpdate

BASE_DIR = Path(__file__).resolve().parent
STATIC_DIR = BASE_DIR / "static"

app = FastAPI(title="Todo (in-memory)")

app.mount("/static", StaticFiles(directory=STATIC_DIR), name="static")


@app.get("/")
def index() -> FileResponse:
    return FileResponse(STATIC_DIR / "index.html")


@app.get("/api/todos", response_model=list[Todo])
def api_list_todos() -> list[Todo]:
    return services.list_todos()


@app.post("/api/todos", response_model=Todo, status_code=201)
def api_create_todo(body: TodoCreate) -> Todo:
    return services.create_todo(body)


@app.get("/api/todos/{todo_id}", response_model=Todo)
def api_get_todo(todo_id: int) -> Todo:
    todo = services.get_todo(todo_id)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.patch("/api/todos/{todo_id}", response_model=Todo)
def api_update_todo(todo_id: int, body: TodoUpdate) -> Todo:
    todo = services.update_todo(todo_id, body)
    if todo is None:
        raise HTTPException(status_code=404, detail="Todo not found")
    return todo


@app.delete("/api/todos/{todo_id}", status_code=204)
def api_delete_todo(todo_id: int) -> None:
    if not services.delete_todo(todo_id):
        raise HTTPException(status_code=404, detail="Todo not found")
