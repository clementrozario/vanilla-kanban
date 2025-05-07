// ----- Storage Helpers -----
function getTasks() {
  return JSON.parse(localStorage.getItem("tasks") || "[]");
}

function saveTasks(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// ----- UI Helpers -----
function clearForm() {
  document.getElementById("add-task-form").reset();
}

function createTaskElement(task) {
  const card = document.createElement("article");
  card.className = "card";
  card.dataset.id = task.id;
  card.innerHTML = `
    <p contenteditable="false">${task.text}</p>
    <div class="card-actions">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;
  return card;
}

function renderBoard(tasks) {
  document.querySelectorAll(".cards-container").forEach((container) => {
    container.innerHTML = "";
  });

  tasks.forEach((task) => {
    const section = document.querySelector(`section:nth-child(${task.column})`);
    const container = section.querySelector(".cards-container");
    container.appendChild(createTaskElement(task));
  });
}

// ----- Task Form Handler -----
document.getElementById("add-task-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const input = document.getElementById("task-input");
  const taskText = input.value.trim();
  if (!taskText) return;

  const tasks = getTasks();
  const newTask = {
    id: Date.now().toString(),
    text: taskText,
    column: 1 // "To Do"
  };
  tasks.push(newTask);
  saveTasks(tasks);
  renderBoard(tasks);
  clearForm();
});

// ----- Event Delegation for Edit/Delete -----
document.getElementById("main-content").addEventListener("click", (e) => {
  const card = e.target.closest(".card");
  if (!card) return;

  const tasks = getTasks();
  const taskId = card.dataset.id;
  const task = tasks.find((t) => t.id === taskId);

  if (e.target.classList.contains("delete-btn")) {
    const updated = tasks.filter((t) => t.id !== taskId);
    saveTasks(updated);
    renderBoard(updated);
  }

  if (e.target.classList.contains("edit-btn")) {
    const paragraph = card.querySelector("p");

    if (e.target.textContent === "Edit") {
      paragraph.contentEditable = true;
      paragraph.focus();
      e.target.textContent = "Save";
    } else {
      paragraph.contentEditable = false;
      task.text = paragraph.textContent.trim();
      saveTasks(tasks);
      renderBoard(tasks);
    }
  }
});

// ----- Initial Load -----
document.addEventListener("DOMContentLoaded", () => {
  const tasks = getTasks();
  renderBoard(tasks);
});
