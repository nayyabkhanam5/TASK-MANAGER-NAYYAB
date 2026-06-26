// Global tasks array — shared across all files
let tasks = [];


// Move task to next column (right arrow)
function moveTaskRight(id) {

    const task =
    tasks.find(task => task.id === id);

    if (!task) return;

    if (task.status === "todo") {
        task.status = "progress";
    }
    else if (task.status === "progress") {
        task.status = "done";
    }

    saveTasks();
    renderTasks();
    updateStats();

}


// Move task to previous column (left arrow)
function moveTaskLeft(id) {

    const task =
    tasks.find(task => task.id === id);

    if (!task) return;

    if (task.status === "done") {
        task.status = "progress";
    }
    else if (task.status === "progress") {
        task.status = "todo";
    }

    saveTasks();
    renderTasks();
    updateStats();

}


// Delete task — opens confirmation modal
function deleteTask(id) {

    deleteTaskId = id;

    document.getElementById("deleteModal")
    .style.display = "flex";

}