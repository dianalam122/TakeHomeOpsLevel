from models import Todo, TodoCreate, TodoUpdate

_todos: list[Todo] = []
_next_id: int = 1


def list_todos() -> list[Todo]:
    return list(_todos)


def get_todo(todo_id: int) -> Todo | None:
    for t in _todos:
        if t.id == todo_id:
            return t
    return None


def create_todo(data: TodoCreate) -> Todo:
    global _next_id
    todo = Todo(id=_next_id, title=data.title.strip(), completed=False)
    _next_id += 1
    _todos.append(todo)
    return todo


def update_todo(todo_id: int, data: TodoUpdate) -> Todo | None:
    todo = get_todo(todo_id)
    if todo is None:
        return None
    if data.title is None and data.completed is None:
        return todo
    new_title = data.title.strip() if data.title is not None else todo.title
    new_completed = data.completed if data.completed is not None else todo.completed
    updated = Todo(id=todo.id, title=new_title, completed=new_completed)
    for i, t in enumerate(_todos):
        if t.id == todo_id:
            _todos[i] = updated
            break
    return updated


def delete_todo(todo_id: int) -> bool:
    global _todos
    before = len(_todos)
    _todos = [t for t in _todos if t.id != todo_id]
    return len(_todos) < before
