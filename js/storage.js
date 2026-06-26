// Save all tasks to localStorage
function saveTasks() {

    localStorage.setItem(
        "tasks",
        JSON.stringify(tasks)
    );

}


// Load tasks from localStorage on page load
function loadTasks() {

    const savedTasks =
    localStorage.getItem("tasks");

    tasks = savedTasks
        ? JSON.parse(savedTasks)
        : [];

    // Make sure every task has a status
    tasks.forEach(function(task){

        if(!task.status){
            task.status = "todo";
        }

    });

    renderTasks();

    if(typeof updateStats === "function"){
        updateStats();
    }

}