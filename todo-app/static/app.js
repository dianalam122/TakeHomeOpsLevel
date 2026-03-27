const listEl = document.getElementById("todo-list");
const formEl = document.getElementById("todo-form");
const titleInput = document.getElementById("todo-title");

const api = (path, options = {}) =>
  fetch(path, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

async function loadTodos() {
  const res = await api("/api/todos");
  if (!res.ok) throw new Error("Failed to load todos");
  const todos = await res.json();
  renderTodos(todos);
}

function renderTodos(todos) {
  listEl.innerHTML = "";
  if (todos.length === 0) {
    const p = document.createElement("p");
    p.className = "empty";
    p.textContent = "No tasks yet. Add one above.";
    listEl.appendChild(p);
    return;
  }
  for (const todo of todos) {
    listEl.appendChild(todoRow(todo));
  }
}

function todoRow(todo) {
  const li = document.createElement("li");
  li.className = "todo-item" + (todo.completed ? " completed" : "");
  li.dataset.id = String(todo.id);

  const cb = document.createElement("input");
  cb.type = "checkbox";
  cb.checked = todo.completed;
  cb.addEventListener("change", () => toggleTodo(todo.id, cb.checked));

  const span = document.createElement("span");
  span.className = "todo-title";
  span.textContent = todo.title;

  const del = document.createElement("button");
  del.type = "button";
  del.className = "todo-delete";
  del.textContent = "Delete";
  del.addEventListener("click", () => deleteTodo(todo.id));

  li.append(cb, span, del);
  return li;
}

async function toggleTodo(id, completed) {
  const res = await api(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify({ completed }),
  });
  if (!res.ok) throw new Error("Failed to update");
  await loadTodos();
}

async function deleteTodo(id) {
  const res = await api(`/api/todos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
  await loadTodos();
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  if (!title) return;
  const res = await api("/api/todos", {
    method: "POST",
    body: JSON.stringify({ title }),
  });
  if (!res.ok) throw new Error("Failed to create");
  titleInput.value = "";
  await loadTodos();
});

loadTodos().catch((err) => {
  console.error(err);
  listEl.innerHTML = `<p class="empty">Could not load todos. Is the server running?</p>`;
});
