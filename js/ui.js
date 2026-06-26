// ========================
// MODAL OPEN / CLOSE
// ========================

const addTaskBtn =
document.getElementById("addTaskBtn");

const modal =
document.querySelector(".modal");

const closeModalBtn =
document.getElementById("closeModal");

addTaskBtn.addEventListener("click",
function() {
    openModalForAdd();
});

closeModalBtn.addEventListener("click",
function() {
    closeModal();
});

function openModalForAdd() {
    window.editingTaskId = null;
    document.querySelector(".task-form h2")
    .textContent = "Add New Task";
    taskForm.reset();
    clearTagPills();
    modal.style.display = "flex";
}

function closeModal() {
    modal.style.display = "none";
    taskForm.reset();
    clearTagPills();
    window.editingTaskId = null;
}


// ========================
// TAG PILLS SYSTEM
// ========================

let currentTags = [];

function clearTagPills() {
    currentTags = [];
    renderTagPills();
    document.getElementById("taskTags")
    .value = "";
}

function renderTagPills() {
    const container =
    document.getElementById("tagPillsContainer");

    container.innerHTML =
    currentTags.map((tag, index) =>
        `<span class="tag-pill">
            ${tag}
            <button type="button"
                class="remove-tag"
                onclick="removeTag(${index})">
                ×
            </button>
        </span>`
    ).join("");
}

function removeTag(index) {
    currentTags.splice(index, 1);
    renderTagPills();
}

// Add tag when user presses Enter or comma
document.getElementById("taskTags")
.addEventListener("keydown", function(e) {

    if (e.key === "Enter" || e.key === ",") {

        e.preventDefault();

        const val = this.value.trim()
        .replace(/,/g, "");

        if (val !== "" &&
            !currentTags.includes(val)) {
            currentTags.push(val);
            renderTagPills();
        }

        this.value = "";
    }

});


// ========================
// FORM SUBMIT
// ========================

const taskForm =
document.getElementById("taskForm");

taskForm.addEventListener("submit",
function(event) {

    event.preventDefault();

    const title =
    document.getElementById("taskTitle")
    .value;

    const description =
    document.getElementById("taskDescription")
    .value;

    const priority =
    document.getElementById("taskPriority")
    .value;

    const status =
    document.getElementById("taskStatus")
    .value;

    const date =
    document.getElementById("taskDate")
    .value;

    // Clear previous errors
    document.getElementById("titleError")
    .textContent = "";

    document.getElementById("dateError")
    .textContent = "";

    let isValid = true;
    const cleanTitle = title.trim();

    // Title validation
    if (cleanTitle.length === 0) {
        document.getElementById("titleError")
        .textContent = "Task title is required.";
        isValid = false;
    }
    else if (cleanTitle.length < 3) {
        document.getElementById("titleError")
        .textContent =
        "Title must be at least 3 characters.";
        isValid = false;
    }

    // Date validation
    if (date === "") {
        document.getElementById("dateError")
        .textContent = "Please select a due date.";
        isValid = false;
    }
    else {
        const today =
        new Date().toISOString().split("T")[0];
        if (date < today) {
            document.getElementById("dateError")
            .textContent =
            "Past dates are not allowed.";
            isValid = false;
        }
    }

    if (!isValid) return;

    // Edit or Add
    const existingIndex =
    tasks.findIndex(
        t => t.id === window.editingTaskId
    );

    if (existingIndex !== -1) {

        // UPDATE existing task
        tasks[existingIndex].title = cleanTitle;
        tasks[existingIndex].description =
        description;
        tasks[existingIndex].priority = priority;
        tasks[existingIndex].status = status;
        tasks[existingIndex].date = date;
        tasks[existingIndex].tags =
        [...currentTags];

        window.editingTaskId = null;
        showToast("Task Updated Successfully");

    } else {

        // ADD new task
        const task = {
            id: Date.now(),
            title: cleanTitle,
            description: description,
            priority: priority,
            date: date,
            tags: [...currentTags],
            status: status,
            createdAt: Date.now()
        };

        tasks.push(task);
        showToast("Task Saved Successfully");

    }

    saveTasks();
    renderTasks();
    closeModal();

});


// ========================
// EDIT TASK (open modal pre-filled)
// ========================

function editTask(id) {

    const task =
    tasks.find(t => t.id === id);

    if (!task) return;

    document.querySelector(".task-form h2")
    .textContent = "Edit Task";

    document.getElementById("taskTitle")
    .value = task.title;

    document.getElementById("taskDescription")
    .value = task.description;

    document.getElementById("taskPriority")
    .value = task.priority;

    document.getElementById("taskStatus")
    .value = task.status;

    document.getElementById("taskDate")
    .value = task.date;

    // Load tags as pills
    currentTags = Array.isArray(task.tags)
        ? [...task.tags]
        : (task.tags
            ? task.tags.split(",")
              .map(t => t.trim())
              .filter(t => t !== "")
            : []);

    renderTagPills();

    window.editingTaskId = id;
    modal.style.display = "flex";

}


// ========================
// SEARCH
// ========================

document.getElementById("searchInput")
.addEventListener("input", function() {
    renderTasks();
});


// ========================
// DARK / LIGHT MODE
// ========================

const themeBtn =
document.getElementById("themeBtn");

// Apply saved theme on load
if (localStorage.getItem("theme") === "true") {
    document.body.classList.add("dark-mode");
    document.documentElement
    .classList.add("dark-mode");
    themeBtn.textContent = "Light Mode";
} else {
    themeBtn.textContent = "Dark Mode";
}

themeBtn.addEventListener("click",
function() {

    document.body.classList.toggle("dark-mode");
    document.documentElement
    .classList.toggle("dark-mode");

    const isDark =
    document.body.classList.contains("dark-mode");

    localStorage.setItem("theme", isDark);

    themeBtn.textContent =
    isDark ? "Light Mode" : "Dark Mode";

});


// ========================
// DISABLE PAST DATES
// ========================

const taskDateInput =
document.getElementById("taskDate");

if (taskDateInput) {
    const today =
    new Date().toISOString().split("T")[0];
    taskDateInput.min = today;
}


// ========================
// TOAST NOTIFICATION
// ========================

function showToast(message) {

    const toast =
    document.getElementById("toast");

    toast.textContent = message;
    toast.classList.add("show");

    setTimeout(function() {
        toast.classList.remove("show");
    }, 2000);

}


// ========================
// DELETE MODAL
// ========================

const deleteModal =
document.getElementById("deleteModal");

const cancelDelete =
document.getElementById("cancelDelete");

const confirmDelete =
document.getElementById("confirmDelete");

if (cancelDelete) {
    cancelDelete.addEventListener("click",
    function() {
        deleteModal.style.display = "none";
    });
}

if (confirmDelete) {
    confirmDelete.addEventListener("click",
    function() {

        tasks = tasks.filter(
            task => task.id !== deleteTaskId
        );

        saveTasks();
        renderTasks();
        deleteModal.style.display = "none";
        showToast("Task Deleted Successfully");

    });
}


// ========================
// EXPORT CSV
// ========================

const exportBtn =
document.getElementById("exportBtn");

if (exportBtn) {
    exportBtn.addEventListener("click",
    function() {

        let csv =
        "Title,Description,Priority," +
        "Due Date,Tags,Status\n";

        tasks.forEach(function(task) {
            const tags = Array.isArray(task.tags)
                ? task.tags.join("|")
                : task.tags;
            csv +=
            `"${task.title}",` +
            `"${task.description}",` +
            `"${task.priority}",` +
            `"${task.date}",` +
            `"${tags}",` +
            `"${task.status}"\n`;
        });

        const blob =
        new Blob([csv], { type: "text/csv" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tasks.csv";
        a.click();
        URL.revokeObjectURL(url);
        showToast("CSV Downloaded Successfully");

    });
}


// ========================
// EXPORT JSON
// ========================

const exportJsonBtn =
document.getElementById("exportJsonBtn");

if (exportJsonBtn) {
    exportJsonBtn.addEventListener("click",
    function() {

        const json =
        JSON.stringify(tasks, null, 4);

        const blob =
        new Blob([json],
        { type: "application/json" });

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "tasks.json";
        a.click();
        URL.revokeObjectURL(url);
        showToast("JSON Downloaded Successfully");

    });
}


// ========================
// KEYBOARD SHORTCUTS
// ========================

document.addEventListener("keydown",
function(event) {

    const tag =
    document.activeElement.tagName;

    const isTyping =
    tag === "INPUT" ||
    tag === "TEXTAREA" ||
    tag === "SELECT";

    // N = open new task modal
    // (only when not typing in a field)
    if (event.key === "n" && !isTyping) {
        event.preventDefault();
        openModalForAdd();
    }

    // / = focus search bar
    if (event.key === "/" && !isTyping) {
        event.preventDefault();
        document.getElementById("searchInput")
        .focus();
    }

    // Escape = close any open modal
    if (event.key === "Escape") {
        closeModal();
        deleteModal.style.display = "none";
    }

});