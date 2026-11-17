
const taskForm = document.getElementById("taskForm");
const taskInput = document.getElementById("taskInput");
const taskList = document.getElementById("taskList");
const taskCount = document.getElementById("taskCount");
const errorMessage = document.getElementById("errorMessage");
const filters = document.querySelector(".filters");

// Load tasks from LocalStorage
let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

let currentFilter = "all";

// Save tasks to LocalStorage
function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Display tasks
function renderTasks() {
    taskList.innerHTML = "";

    const filteredTasks = tasks.filter(task => {
        if (currentFilter === "active") {
            return !task.completed;
        }

        if (currentFilter === "completed") {
            return task.completed;
        }

        return true;
    });

    if (filteredTasks.length === 0) {
        const emptyMessage = document.createElement("p");
        emptyMessage.className = "empty-state";

        emptyMessage.textContent =
            currentFilter === "active"
                ? "No active tasks."
                : currentFilter === "completed"
                ? "No completed tasks."
                : "No tasks yet. Add your first task!";

        taskList.appendChild(emptyMessage);
    }

    filteredTasks.forEach(task => {
        const taskItem = document.createElement("div");
        taskItem.className = "task-item";

        if (task.completed) {
            taskItem.classList.add("completed");
        }

        taskItem.dataset.id = task.id;

        const checkButton = document.createElement("button");
        checkButton.className = "task-check";
        checkButton.dataset.action = "toggle";
        checkButton.setAttribute(
            "aria-label",
            task.completed ? "Mark as active" : "Mark as completed"
        );

        const taskText = document.createElement("span");
        taskText.className = "task-text";
        taskText.textContent = task.text;

        const actions = document.createElement("div");
        actions.className = "task-actions";

        const editButton = document.createElement("button");
        editButton.className = "action-btn";
        editButton.dataset.action = "edit";
        editButton.textContent = "Edit";

        const deleteButton = document.createElement("button");
        deleteButton.className = "action-btn delete-btn";
        deleteButton.dataset.action = "delete";
        deleteButton.textContent = "Delete";

        actions.append(editButton, deleteButton);
        taskItem.append(checkButton, taskText, actions);

        taskList.appendChild(taskItem);
    });

    const remainingTasks = tasks.filter(task => !task.completed).length;

    taskCount.textContent =
        `${remainingTasks} ${remainingTasks === 1 ? "task" : "tasks"} remaining`;
    
    // Update filter buttons
    document.querySelectorAll(".filter-btn").forEach(button => {
        button.classList.toggle(
            "active",
            button.dataset.filter === currentFilter
        );
    });
}

// Add a new task
taskForm.addEventListener("submit", function(event) {
    event.preventDefault();

    const taskText = taskInput.value.trim();

    if (!taskText) {
        errorMessage.textContent = "Please enter a task before adding.";
        taskInput.focus();
        return;
    }

    errorMessage.textContent = "";

    const newTask = {
        id: Date.now().toString() + Math.random().toString(16).slice(2),
        text: taskText,
        completed: false
    };

    tasks.push(newTask);

    saveTasks();
    currentFilter = "all";
    renderTasks();

    taskInput.value = "";
    taskInput.focus();
});

// Filter tasks using event delegation
filters.addEventListener("click", function(event) {
    const button = event.target.closest(".filter-btn");

    if (!button) return;

    currentFilter = button.dataset.filter;
    renderTasks();
});

// Handle task actions using event delegation
taskList.addEventListener("click", function(event) {
    const button = event.target.closest("button[data-action]");

    if (!button) return;

    const taskItem = button.closest(".task-item");

    if (!taskItem) return;

    const taskId = taskItem.dataset.id;

    const task = tasks.find(item => item.id === taskId);

    if (!task) return;

    const action = button.dataset.action;

    // Mark task as completed or active
    if (action === "toggle") {
        task.completed = !task.completed;
    }

    // Edit existing task
    else if (action === "edit") {
        const updatedText = prompt("Edit your task:", task.text);

        if (updatedText === null) return;

        const newText = updatedText.trim();

        if (!newText) {
            alert("Task cannot be empty.");
            return;
        }

        task.text = newText;
    }

    // Delete task
    else if (action === "delete") {
        const confirmed = confirm("Are you sure you want to delete this task?");

        if (!confirmed) return;

        tasks = tasks.filter(item => item.id !== taskId);
    }

    saveTasks();
    renderTasks();
});

// Initial rendering
renderTasks();