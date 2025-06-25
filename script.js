
window.onload = function () {
  const toggleBtn = document.getElementById("theme-toggle");
  const taskInput = document.getElementById("task-input");

  // Load saved theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
  }

  // Set up theme toggle
  toggleBtn.onclick = function () {
    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "☀️ Light Mode";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.textContent = "🌙 Dark Mode";
    }
  };

  // Initial load
  loadTasks();
};

// Add a new task
function addTask() {
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim();

  if (taskText === "") return;

  const task = {
    text: taskText,
    completed: false,
  };

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  taskInput.value = "";
  loadTasks();             // First reload the task list
  showToast("Task added"); // Then show the toast message
}


// Load tasks with current filter
function loadTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  let filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    const span = document.createElement("span");
        span.textContent = task.text;
        span.ondblclick = () => editTask(index, span);
        li.appendChild(span);

    if (task.completed) li.classList.add("completed");

    li.onclick = () => toggleTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

// Toggle task completion
function toggleTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks[index].completed = !tasks[index].completed;
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();

  if (tasks[index].completed) {
    showToast("✅ Task completed");
  } else {
    showToast("🔄 Task marked active");
  }
}

// Edit task
function editTask(index, spanElement) {
  const tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  const input = document.createElement("input");
  input.type = "text";
  input.value = tasks[index].text;
  input.className = "edit-input";

  spanElement.replaceWith(input);
  input.focus();

  input.onblur = () => {
    tasks[index].text = input.value.trim() || tasks[index].text;
    localStorage.setItem("tasks", JSON.stringify(tasks));
    loadTasks();
  };

  input.onkeydown = (e) => {
    if (e.key === "Enter") input.blur();
  };
}

// Delete a task
function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  showToast("❌ Task deleted");
}

// Set filter and reload tasks
function setFilter(filter) {
  currentFilter = filter;

  // Highlight active button
  document.querySelectorAll(".filters button").forEach(btn => {
    btn.classList.remove("active");
    if (btn.textContent.toLowerCase() === filter) {
      btn.classList.add("active");
    }
  });

  loadTasks();
}

function showToast(message, type = "default") {
  const toast = document.getElementById("toast");
  toast.textContent = message;

  // Color classes based on type
  toast.className = "show";
  if (type === "success") toast.style.backgroundColor = "#28a745";
  else if (type === "error") toast.style.backgroundColor = "#dc3545";
  else if (type === "info") toast.style.backgroundColor = "#007bff";
  else toast.style.backgroundColor = "#333"; // default

  setTimeout(() => {
    toast.className = "";
  }, 2000);
}

// filter
let currentFilter = 'all'; // Default 

function setFilter(filter) {
  currentFilter = filter;
  loadTasks();
}

function loadTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Filter tasks
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.textContent = task.text;
    if (task.completed) li.classList.add("completed");

    li.onclick = () => toggleTask(index);

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "❌";
    deleteBtn.onclick = (e) => {
      e.stopPropagation();
      deleteTask(index);
    };

    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });
}

const toggleBtn = document.getElementById("theme-toggle");

// Load theme on page load
window.onload = function () {
  loadTasks();
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️ Light Mode";
  }
};

// Toggle dark mode
toggleBtn.onclick = function () {
  document.body.classList.toggle("dark");

  if (document.body.classList.contains("dark")) {
    localStorage.setItem("theme", "dark");
    toggleBtn.textContent = "☀️ Light Mode";
  } else {
    localStorage.setItem("theme", "light");
    toggleBtn.textContent = "🌙 Dark Mode";
  }
};
