// =========================
// RESET PAGE POSITION
// =========================

if ("scrollRestoration" in history) {
    history.scrollRestoration = "manual";
}

window.addEventListener("load", () => {
    window.scrollTo(0, 0);
});

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

const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

const savedTheme = localStorage.getItem("theme");

if (savedTheme) {
    root.setAttribute("data-theme", savedTheme);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
    root.setAttribute("data-theme", "dark");
}

function updateThemeButton() {
    const isDark = root.getAttribute("data-theme") === "dark";

    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    themeToggle.textContent = isDark ? "Light Mode" : "Dark Mode";
}

updateThemeButton();

themeToggle.addEventListener("click", () => {
    const isDark = root.getAttribute("data-theme") === "dark";
    const newTheme = isDark ? "light" : "dark";

    if (newTheme === "dark") {
        root.setAttribute("data-theme", "dark");
    } else {
        root.removeAttribute("data-theme");
    }

    localStorage.setItem("theme", newTheme);

    updateThemeButton();
});

// =========================
// PROJECT CAROUSEL
// =========================

const projectCards = document.querySelectorAll(".project-card");
const previousProjectButton = document.getElementById("project-previous");
const nextProjectButton = document.getElementById("project-next");
const projectCounter = document.getElementById("project-counter");

let currentProjectIndex = 0;

function updateProjectCards() {
    projectCards.forEach((card, index) => {
        card.classList.remove(
            "is-active",
            "is-next",
            "is-far-next"
        );

        if (index === currentProjectIndex) {
            card.classList.add("is-active");
        } else if (index === currentProjectIndex + 1) {
            card.classList.add("is-next");
        } else if (index === currentProjectIndex + 2) {
            card.classList.add("is-far-next");
        }
    });

    updateProjectControls();
    updateProjectCounter();
}

function updateProjectControls() {
    previousProjectButton.disabled = currentProjectIndex === 0;
    nextProjectButton.disabled =
        currentProjectIndex === projectCards.length - 1;
}

function updateProjectCounter() {
    projectCounter.textContent =
        `${currentProjectIndex + 1} / ${projectCards.length}`;
}

function showNextProject() {
    if (currentProjectIndex < projectCards.length - 1) {
        currentProjectIndex++;
        updateProjectCards();
    }
}

function showPreviousProject() {
    if (currentProjectIndex > 0) {
        currentProjectIndex--;
        updateProjectCards();
    }
}

nextProjectButton.addEventListener("click", showNextProject);

previousProjectButton.addEventListener("click", showPreviousProject);


// =========================
// KEYBOARD NAVIGATION
// =========================

document.addEventListener("keydown", (event) => {
    const activeElement = document.activeElement;
    const isFormField =
        activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "SELECT";

    if (isFormField) {
        return;
    }

    if (event.key === "ArrowRight") {
        event.preventDefault();
        showNextProject();
    }

    if (event.key === "ArrowLeft") {
        event.preventDefault();
        showPreviousProject();
    }
});

// =========================
// TOUCH / SWIPE NAVIGATION
// =========================

let touchStartX = 0;
let touchEndX = 0;

const minimumSwipeDistance = 50;

projectCards.forEach((card) => {
    card.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
    });

    card.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].screenX;

        const swipeDistance = touchEndX - touchStartX;

        if (Math.abs(swipeDistance) < minimumSwipeDistance) {
            return;
        }

        if (swipeDistance < 0) {
            showNextProject();
        } else {
            showPreviousProject();
        }
    });
});


// =========================
// INITIALIZE CAROUSEL
// =========================

updateProjectCards();

// =========================
// MOUSE / TRACKPAD DRAG
// =========================

let mouseStartX = 0;
let isDragging = false;

projectCards.forEach((card) => {
    card.addEventListener("mousedown", (event) => {
        mouseStartX = event.clientX;
        isDragging = true;
    });

    card.addEventListener("mouseup", (event) => {
        if (!isDragging) {
            return;
        }

        const mouseEndX = event.clientX;
        const dragDistance = mouseEndX - mouseStartX;

        isDragging = false;

        if (Math.abs(dragDistance) < minimumSwipeDistance) {
            return;
        }

        if (dragDistance < 0) {
            showNextProject();
        } else {
            showPreviousProject();
        }
    });

    card.addEventListener("mouseleave", () => {
        isDragging = false;
    });
});