// FIX: Sab code ek named function ke andar wrap kiya
// Pehle yeh code global scope mein tha — ab initFilters() ke andar hai
function initFilters() {

    const priorityFilter =
    document.getElementById("priorityFilter");

    const sortTasks =
    document.getElementById("sortTasks");

    const clearFilters =
    document.getElementById("clearFilters");


    if (priorityFilter) {

        priorityFilter.addEventListener(
            "change",
            renderTasks
        );

    }


    if (sortTasks) {

        sortTasks.addEventListener(
            "change",
            renderTasks
        );

    }


    if (clearFilters) {

        clearFilters.addEventListener(
            "click",
            function() {

                document.getElementById(
                    "searchInput"
                ).value = "";

                document.getElementById(
                    "priorityFilter"
                ).value = "all";

                document.getElementById(
                    "sortTasks"
                ).value = "created";

                renderTasks();

            }
        );

    }

}