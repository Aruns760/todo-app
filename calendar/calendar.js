const monthSelect = document.getElementById("month-select");
    const yearSelect = document.getElementById("year-select");
    const calendarGrid = document.getElementById("calendar-grid");
    const themeSwitch = document.getElementById("theme-switch");
    const modal = document.getElementById("task-modal");
    const selectedDateEl = document.getElementById("selected-date");
    const taskInput = document.getElementById("calendar-task-input");
    const taskTime = document.getElementById("calendar-task-time");
    const saveTaskBtn = document.getElementById("save-task");
    const taskList = document.getElementById("calendar-task-list");
    const closeModal = document.getElementById("close-modal");

let selectedDate = null;
let tasks = JSON.parse(localStorage.getItem("calendarTasks")) || {};

    const months = ["January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"];

    function init() {
      populateSelectors();
      loadCalendar();
      themeSwitch.addEventListener('change', () => {
        const isDark = themeSwitch.checked;
        document.body.classList.toggle('dark', isDark);
        localStorage.setItem('theme', isDark ? 'dark' : 'light');
      });
      const saved = localStorage.getItem('theme');
      const isDark = saved === 'dark';
      document.body.classList.toggle('dark', isDark);
      themeSwitch.checked = isDark;
      saveTaskBtn.addEventListener("click", saveTask);
      closeModal.addEventListener("click", () => modal.style.display = "none");
      window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
      });

      document.getElementById("prev-month").onclick = () => changeMonth(-1);
      document.getElementById("next-month").onclick = () => changeMonth(1);
    }
function populateSelectors() {
      for (let i = 0; i < 12; i++) {
        const opt = document.createElement("option");
        opt.value = i;
        opt.textContent = months[i];
        monthSelect.appendChild(opt);
      }
      const year = new Date().getFullYear();
      for (let y = year - 10; y <= year + 10; y++) {
        const opt = document.createElement("option");
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
      }

      const now = new Date();
      monthSelect.value = now.getMonth();
      yearSelect.value = now.getFullYear();
      monthSelect.onchange = loadCalendar;
      yearSelect.onchange = loadCalendar;
    }


function loadCalendar() {
  const month = parseInt(monthSelect.value);
  const year = parseInt(yearSelect.value);
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  calendarGrid.innerHTML = "";

  for (let i = 0; i < firstDay; i++) {
    calendarGrid.innerHTML += `<div></div>`;
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dateStr = `${year}-${month + 1}-${day}`;
    const div = document.createElement("div");
    div.textContent = day;
    if (tasks[dateStr]) div.classList.add("has-task");
    if (isToday(year, month, day)) div.classList.add("today");
    div.onclick = () => openModal(dateStr);
    calendarGrid.appendChild(div);
  }
}

function openModal(dateStr) {
  selectedDate = dateStr;
  selectedDateEl.textContent = dateStr;
  modal.style.display = "flex";
  taskInput.value = "";
  taskTime.value = "";
  renderTasks();
}

function renderTasks() {
  taskList.innerHTML = "";
  if (tasks[selectedDate]) {
    tasks[selectedDate].forEach((task, i) => {
      const li = document.createElement("li");
      li.textContent = task;
      const del = document.createElement("button");
      del.textContent = "❌";
      del.onclick = () => {
            calendarTasks[selectedDate].splice(i, 1);
            if (calendarTasks[selectedDate].length === 0) delete calendarTasks[selectedDate];
            localStorage.setItem("calendarTasks", JSON.stringify(calendarTasks));
            renderTasks();
            loadCalendar();
          };
          li.appendChild(del);
          taskList.appendChild(li);
        });
  }
}
function saveTask() {
      const text = taskInput.value.trim();
      const time = taskTime.value;
      if (!text || !selectedDate) return;

      if (!calendarTasks[selectedDate]) {
        calendarTasks[selectedDate] = [];
      }

      calendarTasks[selectedDate].push({ text, time });
      localStorage.setItem("calendarTasks", JSON.stringify(calendarTasks));

      taskInput.value = "";
      taskTime.value = "";
      renderTasks();
      loadCalendar();
    }


function isExpired(taskDate) {
  const today = new Date().setHours(0, 0, 0, 0); // midnight today
  const dueDate = new Date(taskDate).setHours(0, 0, 0, 0); // task date
  return dueDate < today;
}
 function isToday(y, m, d) {
      const today = new Date();
      return y === today.getFullYear() && m === today.getMonth() && d === today.getDate();
    }

    function changeMonth(offset) {
      let m = parseInt(monthSelect.value) + offset;
      let y = parseInt(yearSelect.value);

      if (m < 0) {
        m = 11;
        y -= 1;
      } else if (m > 11) {
        m = 0;
        y += 1;
      }
      monthSelect.value = m;
      yearSelect.value = y;
      loadCalendar();
    }

function changeMonth(offset) {
  let m = parseInt(monthSelect.value) + offset;
  let y = parseInt(yearSelect.value);

  if (m < 0) {
    m = 11;
    y -= 1;
  } else if (m > 11) {
    m = 0;
    y += 1;
  }
  monthSelect.value = m;
  yearSelect.value = y;
  loadCalendar();
}

function toggleTheme() {
  document.body.classList.toggle("dark");
  localStorage.setItem("theme", document.body.classList.contains("dark") ? "dark" : "light");
}

window.onload = () => {
  if (localStorage.getItem("theme") === "dark") {
    document.body.classList.add("dark");
    themeSwitch.checked = true;
  }
  init();
};
