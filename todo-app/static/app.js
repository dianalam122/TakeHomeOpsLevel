const listEl = document.getElementById("todo-list");
const missingEl = document.getElementById("missing-priorities");
const formEl = document.getElementById("todo-form");
const titleInput = document.getElementById("todo-title");
const priorityInput = document.getElementById("todo-priority");

const messageEl = document.createElement("p");
messageEl.className = "app-message";
messageEl.setAttribute("role", "status");
messageEl.setAttribute("aria-live", "polite");
document.querySelector(".page-header").after(messageEl);

function showError(text) {
  messageEl.textContent = text;
}

function clearError() {
  messageEl.textContent = "";
}

async function readErrorBody(res) {
  try {
    const data = await res.json();
    if (data.detail == null) return res.statusText || "Request failed";
    if (Array.isArray(data.detail)) {
      return data.detail.map((d) => (typeof d === "string" ? d : d.msg || JSON.stringify(d))).join(" ");
    }
    return String(data.detail);
  } catch {
    return res.statusText || "Request failed";
  }
}

async function load() {
  clearError();
  let todosRes;
  let missingRes;
  try {
    [todosRes, missingRes] = await Promise.all([
      fetch("/todos"),
      fetch("/missing-priorities"),
    ]);
  } catch {
    showError("Could not reach the server.");
    missingEl.textContent = "—";
    listEl.innerHTML = '<p class="empty">Unable to load.</p>';
    return;
  }

  if (!todosRes.ok) {
    showError(await readErrorBody(todosRes));
    missingEl.textContent = "—";
    listEl.innerHTML = '<p class="empty">Unable to load.</p>';
    return;
  }
  if (!missingRes.ok) {
    showError(await readErrorBody(missingRes));
    listEl.innerHTML = '<p class="empty">Unable to load.</p>';
    return;
  }

  const todos = await todosRes.json();
  const missing = await missingRes.json();
  missingEl.textContent = missing.length ? missing.join(", ") : "None";
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
  clearError();
  let res;
  try {
    res = await fetch(`/todos/${id}`, { method: "DELETE" });
  } catch {
    showError("Could not reach the server.");
    return;
  }
  if (!res.ok && res.status !== 204) {
    showError(await readErrorBody(res));
    return;
  }
  await load();
}

formEl.addEventListener("submit", async (e) => {
  e.preventDefault();
  clearError();

  const title = titleInput.value.trim();
  const priority = Number.parseInt(String(priorityInput.value), 10);

  if (!title) {
    showError("Please enter a title.");
    titleInput.focus();
    return;
  }
  if (!Number.isInteger(priority) || priority < 1) {
    showError("Priority must be a whole number 1 or greater.");
    priorityInput.focus();
    return;
  }

  let res;
  try {
    res = await fetch("/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, priority }),
    });
  } catch {
    showError("Could not reach the server.");
    return;
  }

  if (!res.ok) {
    showError(await readErrorBody(res));
    return;
  }

  titleInput.value = "";
  priorityInput.value = "1";
  await load();
});

load();
