// Global filter variable
let currentFilter = 'all';

// DOM Ready
window.onload = function () {
  const toggleBtn = document.getElementById("theme-toggle");
  const taskInput = document.getElementById("task-input");

  // Load theme
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    toggleBtn.textContent = "☀️";
  }

  // Theme toggle
  toggleBtn.onclick = function () {
    document.body.classList.toggle("dark");
    if (document.body.classList.contains("dark")) {
      localStorage.setItem("theme", "dark");
      toggleBtn.textContent = "☀️";
    } else {
      localStorage.setItem("theme", "light");
      toggleBtn.textContent = "🌙";
    }
  };

  // Sidebar toggle
  document.getElementById("menu-toggle").addEventListener("click", () => {
    document.getElementById("sidebar").classList.toggle("open");
  });

  // Sidebar link auto-close
  document.querySelectorAll("#sidebar a").forEach(link => {
    link.addEventListener("click", () => {
      document.getElementById("sidebar").classList.remove("open");
    });
  });

  // Search filter
  document.getElementById("search-bar").addEventListener("input", (e) => {
    const query = e.target.value.toLowerCase();
    const tasks = document.querySelectorAll("#task-list li");
    tasks.forEach(task => {
      const text = task.textContent.toLowerCase();
      task.style.display = text.includes(query) ? "flex" : "none";
    });
  });

  updateDateTime();
  setInterval(updateDateTime, 1000);
  loadTasks();
};

function updateDateTime() {
  const now = new Date();
  document.getElementById("current-date").textContent = now.toLocaleDateString('en-US', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
  });
  document.getElementById("current-time").textContent = now.toLocaleTimeString();
}function addTask() {
  const taskInput = document.getElementById("task-input");
  const taskText = taskInput.value.trim();
  const taskDate = new Date().toLocaleString(); // 📅 Automatically get current datetime

  if (taskText === "") {
    showToast("❗ Please enter a task", "error");
    return;
  }

  const task = {
    text: taskText,
    completed: false,
    createdAt: taskDate
  };

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.push(task);
  localStorage.setItem("tasks", JSON.stringify(tasks));

  taskInput.value = "";
  loadTasks();
  showToast("✅ Task added", "success");
}


function loadTasks() {
  const taskList = document.getElementById("task-list");
  taskList.innerHTML = "";

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

  // Filter based on current view
  let filteredTasks = tasks.filter(task => {
    if (currentFilter === 'all') return true;
    if (currentFilter === 'active') return !task.completed;
    if (currentFilter === 'completed') return task.completed;
  });

  filteredTasks.forEach((task, index) => {
    const li = document.createElement("li");
    if (task.completed) li.classList.add("completed");

    // Task text
    const span = document.createElement("span");
    span.textContent = task.text;
    span.ondblclick = () => editTask(index, span);
    li.appendChild(span);

    // Meta info container
    const metaDiv = document.createElement("div");
    metaDiv.className = "task-meta";

    // Due Date
    if (task.date) {
      const dueDate = document.createElement("small");
      dueDate.textContent = `📅 Due: ${task.date}`;
      dueDate.className = "task-date";
      metaDiv.appendChild(dueDate);
    }

    // Created At
    if (task.createdAt) {
      const createdAt = document.createElement("small");
      createdAt.textContent = `🕒 Created: ${task.createdAt}`;
      createdAt.className = "task-created";
      metaDiv.appendChild(createdAt);
    }

    li.appendChild(metaDiv);

    // Complete Task Button
    const checkBtn = document.createElement("button");
    checkBtn.textContent = "✅";
    checkBtn.onclick = (e) => {
      e.stopPropagation();
      toggleTask(index);
    };
    li.appendChild(checkBtn);

    // Delete Task Button
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

function deleteTask(index) {
  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  tasks.splice(index, 1);
  localStorage.setItem("tasks", JSON.stringify(tasks));
  loadTasks();
  showToast("❌ Task deleted");
}

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

function setFilter(filter) {
  currentFilter = filter;
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
  toast.className = "show";

  if (type === "success") toast.style.backgroundColor = "#28a745";
  else if (type === "error") toast.style.backgroundColor = "#dc3545";
  else if (type === "info") toast.style.backgroundColor = "#007bff";
  else toast.style.backgroundColor = "#333";

  setTimeout(() => {
    toast.className = "";
  }, 2000);
}
