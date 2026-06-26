function updateStats() {

    const totalTasks = tasks.length;

    const inProgressTasks =
    tasks.filter(task =>
        task.status === "progress"
    ).length;

    const completedTasks =
    tasks.filter(task =>
        task.status === "done"
    ).length;

    const today =
    new Date().toISOString().split("T")[0];

    const overdueTasks =
    tasks.filter(task =>
        task.date &&
        task.date < today &&
        task.status !== "done"
    ).length;

    const completionPercentage =
    totalTasks > 0
    ? Math.round(
        (completedTasks / totalTasks) * 100
      )
    : 0;

    document.getElementById("totalTasks")
    .textContent = "Total Tasks: " + totalTasks;

    document.getElementById("inProgressTasks")
    .textContent = "In Progress: " + inProgressTasks;

    document.getElementById("completedTasks")
    .textContent = "Completed: " + completedTasks;

    // Show overdue in red if count > 0
    const overdueEl =
    document.getElementById("overdueTasks");

    overdueEl.textContent =
    "Overdue: " + overdueTasks;

    overdueEl.style.color =
    overdueTasks > 0 ? "red" : "";

    document.getElementById("completionRate")
    .textContent =
    "Completion: " + completionPercentage + "%";

    document.getElementById("completionBar")
    .value = completionPercentage;

}