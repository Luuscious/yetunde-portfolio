const menuToggle = document.getElementById("menu-toggle");
const primaryNavigation = document.getElementById("primary-navigation");

menuToggle.addEventListener("click", () => {
    const isOpen = menuToggle.getAttribute("aria-expanded") === "true";

    menuToggle.setAttribute("aria-expanded", String(!isOpen));
    menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Open navigation menu" : "Close navigation menu"
    );

    primaryNavigation.classList.toggle("is-open", !isOpen);
});

const navigationLinks = primaryNavigation.querySelectorAll("a");

navigationLinks.forEach((link) => {
    link.addEventListener("click", () => {
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation menu");
        primaryNavigation.classList.remove("is-open");
    });
});