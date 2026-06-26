// Mobile tab switching — shows one column at a time
function showTab(tabName) {

    // Remove active from all columns
    document.getElementById("col-todo")
    .classList.remove("active-tab");

    document.getElementById("col-progress")
    .classList.remove("active-tab");

    document.getElementById("col-done")
    .classList.remove("active-tab");

    // Remove active from all tab buttons
    document.querySelectorAll(".tab-btn")
    .forEach(function(btn) {
        btn.classList.remove("active");
    });

    // Show selected column
    if (tabName === "todo") {
        document.getElementById("col-todo")
        .classList.add("active-tab");
        document.querySelectorAll(".tab-btn")[0]
        .classList.add("active");
    }
    else if (tabName === "progress") {
        document.getElementById("col-progress")
        .classList.add("active-tab");
        document.querySelectorAll(".tab-btn")[1]
        .classList.add("active");
    }
    else if (tabName === "done") {
        document.getElementById("col-done")
        .classList.add("active-tab");
        document.querySelectorAll(".tab-btn")[2]
        .classList.add("active");
    }

}

// On mobile, show "To Do" column by default
function initMobileTabs() {

    if (window.innerWidth < 600) {
        showTab("todo");
    }

}