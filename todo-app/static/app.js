const listEl = document.getElementById("todo-list");
const formEl = document.getElementById("todo-form");
const titleInput = document.getElementById("todo-title");
const priorityInput = document.getElementById("todo-priority");

const api = (path, options = {}) =>
  fetch(path, {
    headers: { "Content-Type": "application/json", ...options.headers },
    ...options,
  });

async function loadTodos() {
  const res = await api("/todos");
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
  li.className = "todo-item";
  li.dataset.id = String(todo.id);

  const pri = document.createElement("span");
  pri.className = "todo-priority";
  pri.textContent = String(todo.priority);

  const span = document.createElement("span");
  span.className = "todo-title";
  span.textContent = todo.title;

  const del = document.createElement("button");
  del.type = "button";
  del.className = "todo-delete";
  del.textContent = "Delete";
  del.addEventListener("click", () => deleteTodo(todo.id));

  li.append(pri, span, del);
  return li;
}

async function deleteTodo(id) {
  const res = await api(`/todos/${id}`, { method: "DELETE" });
  if (!res.ok && res.status !== 204) throw new Error("Failed to delete");
  await loadTodos();
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  const title = titleInput.value.trim();
  const priority = Number.parseInt(String(priorityInput.value), 10);
  if (!title) return;
  if (!Number.isFinite(priority) || priority < 1) return;
  const res = await api("/todos", {
    method: "POST",
    body: JSON.stringify({ title, priority }),
  });
  if (!res.ok) throw new Error("Failed to create");
  titleInput.value = "";
  priorityInput.value = "1";
  await loadTodos();
});

loadTodos().catch((err) => {
  console.error(err);
  listEl.innerHTML = `<p class="empty">Could not load todos. Is the server running?</p>`;
});
