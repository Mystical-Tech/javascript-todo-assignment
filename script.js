// ---------- 1. SELECT HTML ELEMENTS ----------
const taskInput = document.getElementById("taskInput");
const addBtn = document.getElementById("addBtn");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const emptyMsg = document.getElementById("emptyMsg");
const clearBtn = document.getElementById("clearBtn");
const errorMsg = document.getElementById("errorMsg");

// Sign-in and navbar elements
const navbar = document.getElementById("navbar");
const navUser = document.getElementById("navUser");
const signOutBtn = document.getElementById("signOutBtn");
const signInView = document.getElementById("signInView");
const appView = document.getElementById("appView");
const nameInput = document.getElementById("nameInput");
const signInBtn = document.getElementById("signInBtn");
const nameError = document.getElementById("nameError");
const greeting = document.getElementById("greeting");

// ---------- 2. STATE (the single source of truth) ----------
// Each task is an object: { id: 1700000000000, text: "Buy milk", completed: false }
let tasks = loadTasks();

// ---------- 3. LOCAL STORAGE ----------
function loadTasks() {
  const saved = localStorage.getItem("tasks");
  if (saved) {
    return JSON.parse(saved); // turn the saved text back into an array
  } else {
    return []; // first visit: start empty
  }
}

function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks)); // array -> text
}

// ---------- 4. ADD A TASK (with validation) ----------
function addTask() {
  const text = taskInput.value.trim(); // remove spaces at start and end

  if (text === "") {
    errorMsg.textContent = "Please enter a task before adding.";
    taskInput.focus();
    return; // stop here, nothing gets added
  }

  errorMsg.textContent = ""; // clear any old error

  const newTask = {
    id: Date.now(), // unique number based on the current time
    text: text,
    completed: false
  };

  tasks.push(newTask);
  taskInput.value = ""; // empty the input box
  taskInput.focus();

  saveTasks();
  renderTasks();
}

// ---------- 5. DISPLAY TASKS ----------
function renderTasks() {
  taskList.innerHTML = ""; // wipe the list, then rebuild it from the array

  tasks.forEach(function (task) {
    // create the elements
    const li = document.createElement("li");
    li.classList.add("task-item");
    if (task.completed) {
      li.classList.add("completed");
    }

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;

    const span = document.createElement("span");
    span.classList.add("task-text");
    span.textContent = task.text; // textContent is safe; innerHTML is not

    const editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.classList.add("edit-btn");

    const deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.classList.add("delete-btn");

    // attach events
    checkbox.addEventListener("change", function () {
      toggleTask(task.id);
    });

    editBtn.addEventListener("click", function () {
      editTask(task.id);
    });

    deleteBtn.addEventListener("click", function () {
      deleteTask(task.id);
    });

    // put the pieces together and add to the page
    li.appendChild(checkbox);
    li.appendChild(span);
    li.appendChild(editBtn);
    li.appendChild(deleteBtn);
    taskList.appendChild(li);
  });

  updateCounter();
  toggleEmptyMessage();
}

// ---------- 6. MARK AS COMPLETED ----------
function toggleTask(id) {
  tasks.forEach(function (task) {
    if (task.id === id) {
      task.completed = !task.completed; // flip true <-> false
    }
  });
  saveTasks();
  renderTasks();
}

// ---------- 7. DELETE A TASK ----------
function deleteTask(id) {
  tasks = tasks.filter(function (task) {
    return task.id !== id; // keep everything EXCEPT the deleted one
  });
  saveTasks();
  renderTasks();
}

//---------- 8. EDIT A TASK ----------
function editTask(id) {
  const task = tasks.find(function (t) {
    return t.id === id;
  });

  const newText = prompt("Edit your task:", task.text);

  if (newText === null) {
    return;
  }

  const trimmed = newText.trim();

  if (trimmed === "") {
    errorMsg.textContent = "A task cannot be empty.";
    return;
  }

  errorMsg.textContent = "";
  task.text = trimmed;
  saveTasks();
  renderTasks();
}

// ---------- 8. BONUS FEATURES ----------
function updateCounter() {
  const total = tasks.length;
  const done = tasks.filter(function (task) {
    return task.completed;
  }).length;
  taskCount.textContent = "Total: " + total + " | Completed: " + done;
}

function toggleEmptyMessage() {
  if (tasks.length === 0) {
    emptyMsg.classList.remove("hidden");
  } else {
    emptyMsg.classList.add("hidden");
  }
}

function clearAllTasks() {
  if (tasks.length === 0) {
    return;
  }
  if (confirm("Delete all tasks?")) {
    tasks = [];
    saveTasks();
    renderTasks();
  }
}

// ---------- 9. EVENT LISTENERS ----------
addBtn.addEventListener("click", addTask);
clearBtn.addEventListener("click", clearAllTasks);
taskInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    addTask();
  }
});


// ---------- 10. GREETING BY TIME OF DAY ----------
function getGreeting() {
  const hour = new Date().getHours(); // 0 to 23, from the user's computer clock

  if (hour < 12) {
    return "Good morning";
  } else if (hour < 17) {
    return "Good afternoon";
  } else {
    return "Good evening";
  }
}

// ---------- 11. SIGN IN / SIGN OUT ----------
function showApp(name) {
  greeting.textContent = getGreeting() + ", " + name + " \u{1F44B}";
  navUser.textContent = name;

  signInView.classList.add("hidden");
  appView.classList.remove("hidden");
  navbar.classList.remove("hidden");

  renderTasks();
}

function showSignIn() {
  appView.classList.add("hidden");
  navbar.classList.add("hidden");
  signInView.classList.remove("hidden");
  nameInput.value = "";
  nameInput.focus();
}

function signIn() {
  const name = nameInput.value.trim();

  if (name === "") {
    nameError.textContent = "Please enter your name to continue.";
    nameInput.focus();
    return;
  }

  nameError.textContent = "";
  localStorage.setItem("username", name);
  showApp(name);
}

function signOut() {
  localStorage.removeItem("username");
  showSignIn();
}

signInBtn.addEventListener("click", signIn);
signOutBtn.addEventListener("click", signOut);

nameInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    signIn();
  }
});

// ---------- 12. START: decide which screen to show on page load ----------
const savedName = localStorage.getItem("username");

if (savedName) {
  showApp(savedName);
} else {
  showSignIn();
}