from models import Todo

_todos: list[Todo] = []
_next_id: int = 1


def _sorted_copy() -> list[Todo]:
    # Priority ascending (lower number = higher priority), then id for stable ties.
    return sorted(_todos, key=lambda t: (t.priority, t.id))


def list_todos() -> list[Todo]:
    return _sorted_copy()


def get_todo(todo_id: int) -> Todo | None:
    for t in _todos:
        if t.id == todo_id:
            return t
    return None


def create_todo(title: str, priority: int) -> Todo:
    global _next_id
    todo = Todo(id=_next_id, title=title, priority=priority)
    _next_id += 1
    _todos.append(todo)
    return todo


def delete_todo(todo_id: int) -> bool:
    global _todos
    before = len(_todos)
    _todos = [t for t in _todos if t.id != todo_id]
    return len(_todos) < before


def get_missing_priorities() -> list[int]:
    if not _todos:
        return []
    max_priority = max(t.priority for t in _todos)
    used = {t.priority for t in _todos}
    return [p for p in range(1, max_priority + 1) if p not in used]
