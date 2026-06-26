// Render all tasks on the board
function renderTasks() {

    const todoContainer =
    document.getElementById("todoTasks");

    const progressContainer =
    document.getElementById("progressTasks");

    const doneContainer =
    document.getElementById("doneTasks");

    todoContainer.innerHTML = "";
    progressContainer.innerHTML = "";
    doneContainer.innerHTML = "";

    const searchText =
    document.getElementById("searchInput")
    .value.toLowerCase();

    const priorityValue =
    document.getElementById("priorityFilter")
    .value;

    const sortValue =
    document.getElementById("sortTasks")
    .value;

    // Filter by search text
    let filteredTasks =
    tasks.filter(task =>
        task.title.toLowerCase()
        .includes(searchText)
    );

    // Filter by priority
    if (priorityValue !== "all") {
        filteredTasks =
        filteredTasks.filter(task =>
            task.priority === priorityValue
        );
    }

    // Sort
    if (sortValue === "dueDate") {
        filteredTasks.sort((a, b) =>
            new Date(a.date) - new Date(b.date)
        );
    }
    else if (sortValue === "priority") {
        const priorityOrder = {
            High: 1, Medium: 2, Low: 3
        };
        filteredTasks.sort((a, b) =>
            priorityOrder[a.priority] -
            priorityOrder[b.priority]
        );
    }
    else if (sortValue === "created") {
        filteredTasks.sort((a, b) =>
            b.createdAt - a.createdAt
        );
    }

    const today =
    new Date().toISOString().split("T")[0];

    // Count filtered tasks per column (for badges)
    const filteredTodo =
    filteredTasks.filter(t => t.status === "todo").length;

    const filteredProgress =
    filteredTasks.filter(t => t.status === "progress").length;

    const filteredDone =
    filteredTasks.filter(t => t.status === "done").length;

    document.getElementById("todoCount")
    .textContent = filteredTodo;

    document.getElementById("progressCount")
    .textContent = filteredProgress;

    document.getElementById("doneCount")
    .textContent = filteredDone;

    // Build each card
    filteredTasks.forEach(function(task) {

        const isOverdue =
            task.date &&
            task.date < today &&
            task.status !== "done";

        // Format date nicely: Dec 25, 2025
        const formattedDate = task.date
            ? new Date(task.date + "T00:00:00")
              .toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric"
              })
            : "No date";

        // Overdue badge
        const overdueBadge = isOverdue
            ? "<p class='overdue'>⚠ Overdue</p>"
            : "";

        // Tags as pills
        const tagsArray = Array.isArray(task.tags)
            ? task.tags
            : (task.tags
                ? task.tags.split(",")
                  .map(t => t.trim())
                  .filter(t => t !== "")
                : []);

        const tagPills = tagsArray
            .map(tag =>
                `<span class="tag-pill">${tag}</span>`
            ).join("");

        // Left arrow (hidden on todo)
        const leftBtn =
        task.status !== "todo"
        ? `<button class="move-btn"
               onclick="moveTaskLeft(${task.id})"
               title="Move Left">
               <i class="fa fa-arrow-left"></i>
           </button>`
        : "";

        // Right arrow (hidden on done)
        const rightBtn =
        task.status !== "done"
        ? `<button class="move-btn"
               onclick="moveTaskRight(${task.id})"
               title="Move Right">
               <i class="fa fa-arrow-right"></i>
           </button>`
        : "";

        // Done checkmark
        const checkmark =
        task.status === "done"
        ? "<span class='done-check'>✓ Done</span>"
        : "";

        // Description preview
        const descPreview =
        task.description.length > 60
        ? task.description.substring(0, 60) + "..."
        : task.description;

        // Build card element
        const card =
        document.createElement("div");

        card.classList.add("task-card");

        // Red left border if overdue
        if (isOverdue) {
            card.style.borderLeft =
            "4px solid red";
        }

        // Done styling
        if (task.status === "done") {
            card.classList.add("completed-task");
        }

        card.draggable = true;

        card.addEventListener("dragstart",
        function(event) {
            event.dataTransfer.setData(
                "taskId", task.id
            );
        });

        card.innerHTML = `
            ${checkmark}
            <h3 class="${task.status === "done" ? "done-title" : ""}">
                ${task.title}
            </h3>
            ${overdueBadge}
            <p class="desc-preview">${descPreview}</p>
            <p>
                Priority:
                <span class="priority ${task.priority}">
                    ${task.priority}
                </span>
            </p>
            <p>Due: ${formattedDate}</p>
            <div class="tags-container">
                ${tagPills}
            </div>
            <div class="card-actions">
                ${leftBtn}
                <button class="edit-btn"
                    onclick="editTask(${task.id})"
                    title="Edit">
                    <i class="fa fa-pencil"></i> Edit
                </button>
                <button class="delete-btn"
                    onclick="deleteTask(${task.id})"
                    title="Delete">
                    <i class="fa fa-trash"></i> Delete
                </button>
                ${rightBtn}
            </div>
        `;

        // Add to correct column
        if (task.status === "todo") {
            todoContainer.appendChild(card);
        }
        else if (task.status === "progress") {
            progressContainer.appendChild(card);
        }
        else if (task.status === "done") {
            doneContainer.appendChild(card);
        }

    });

    // Empty state messages
    if (todoContainer.innerHTML === "") {
        todoContainer.innerHTML =
        `<p class="empty-message">No Tasks Available</p>`;
    }

    if (progressContainer.innerHTML === "") {
        progressContainer.innerHTML =
        `<p class="empty-message">No Tasks Available</p>`;
    }

    if (doneContainer.innerHTML === "") {
        doneContainer.innerHTML =
        `<p class="empty-message">No Tasks Available</p>`;
    }

    updateStats();

}


// Set up drag and drop on columns
function initDragDrop() {

    const columns =
    document.querySelectorAll(".column");

    columns.forEach(function(column) {

        column.addEventListener(
        "dragover",
        function(event) {
            event.preventDefault();
        });

        column.addEventListener(
        "drop",
        function(event) {

            event.preventDefault();

            const id = Number(
                event.dataTransfer
                .getData("taskId")
            );

            const task =
            tasks.find(t => t.id === id);

            if (!task) return;

            if (column.querySelector("#todoTasks")) {
                task.status = "todo";
            }
            else if (column.querySelector("#progressTasks")) {
                task.status = "progress";
            }
            else if (column.querySelector("#doneTasks")) {
                task.status = "done";
            }

            saveTasks();
            renderTasks();

        });

    });

}


// Custom delete modal logic
let deleteTaskId = null;