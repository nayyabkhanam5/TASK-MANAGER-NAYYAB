// Runs before body renders — prevents dark mode flash
if (localStorage.getItem("theme") === "true") {
    document.documentElement
    .classList.add("dark-mode");
}