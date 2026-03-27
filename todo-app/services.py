from models import Todo, TodoCreate

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
    todo = Todo(id=_next_id, title=data.title, priority=data.priority)
    _next_id += 1
    _todos.append(todo)
    return todo


def delete_todo(todo_id: int) -> bool:
    global _todos
    before = len(_todos)
    _todos = [t for t in _todos if t.id != todo_id]
    return len(_todos) < before
