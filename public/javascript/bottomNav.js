

document.addEventListener("DOMContentLoaded", () => {
    const navItems = document.querySelectorAll(".navL");

    navItems.forEach(item => {
        item.addEventListener("click", () => {
            // Remove 'active' class from all list items
            navItems.forEach(navItem => navItem.classList.remove("active"));
            // Add 'active' class to the clicked list item
            item.classList.add("active");
        });
    });
});


