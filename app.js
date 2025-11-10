let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

// Add new task
function addTask() {
  const name = document.getElementById("taskName").value.trim();
  const category = document.getElementById("taskCategory").value.trim();
  const deadline = document.getElementById("taskDeadline").value;
  const status = document.getElementById("taskStatus").value;

  if (!name || !category || !deadline) {
    alert("Please fill out all fields!");
    return;
  }

  const task = { name, category, deadline, status };
  tasks.push(task);
  saveTasks();
  displayTasks();
  updateCategoryFilter();
  clearInputs();
}

// Display tasks
function displayTasks(filtered = tasks) {
  const tbody = document.querySelector("#taskTable tbody");
  tbody.innerHTML = "";
  const today = new Date().toISOString().split("T")[0];

  filtered.forEach((task, index) => {
    // Mark overdue
    if (task.status !== "Completed" && task.deadline < today) {
      task.status = "Overdue";
    }

    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${task.name}</td>
      <td>${task.category}</td>
      <td>${task.deadline}</td>
      <td class="status-${task.status.replace(" ", "")}">${task.status}</td>
      <td>
        <select data-index="${index}" class="updateStatus">
          <option value="In Progress" ${task.status === "In Progress" ? "selected" : ""}>In Progress</option>
          <option value="Completed" ${task.status === "Completed" ? "selected" : ""}>Completed</option>
          <option value="Overdue" ${task.status === "Overdue" ? "selected" : ""}>Overdue</option>
        </select>
      </td>
    `;
    tbody.appendChild(row);
  });

  // Update status dropdown listener
  document.querySelectorAll(".updateStatus").forEach(sel => {
    sel.addEventListener("change", e => {
      const i = e.target.dataset.index;
      tasks[i].status = e.target.value;
      saveTasks();
      displayTasks();
    });
  });
}

// Save to localStorage
function saveTasks() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

// Filter by status or category
function filterTasks() {
  const status = document.getElementById("statusFilter").value;
  const category = document.getElementById("categoryFilter").value;
  let filtered = tasks;

  if (status !== "All") filtered = filtered.filter(t => t.status === status);
  if (category !== "All") filtered = filtered.filter(t => t.category === category);

  displayTasks(filtered);
}

// Update category dropdown
function updateCategoryFilter() {
  const categoryFilter = document.getElementById("categoryFilter");
  const categories = [...new Set(tasks.map(t => t.category))];
  categoryFilter.innerHTML = '<option value="All">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
}

// Clear form inputs
function clearInputs() {
  document.getElementById("taskName").value = "";
  document.getElementById("taskCategory").value = "";
  document.getElementById("taskDeadline").value = "";
}

// Event Listeners
document.getElementById("addTaskBtn").addEventListener("click", addTask);
document.getElementById("statusFilter").addEventListener("change", filterTasks);
document.getElementById("categoryFilter").addEventListener("change", filterTasks);

// Initialize
updateCategoryFilter();
displayTasks();
