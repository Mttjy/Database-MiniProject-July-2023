const sidebar = document.querySelector(".sidebar");
const hamburgerMenuContainer = document.querySelector(".hamburger-menu__container");
const nav = document.querySelector(".nav");

if (sidebar) {
    const init = () => {
        sidebar.classList.add("sidebar--collapsed");

        attachEvents();
    };

    const hamburgerMenu = document.querySelector(".hamburger-menu");

    const attachEvents = () => {
        hamburgerMenuContainer.addEventListener("click", toggleMenu);
    };

    const toggleMenu = () => {
        hamburgerMenu.classList.toggle("hamburger-menu--open");
        nav.classList.toggle("nav--open");
        sidebar.classList.toggle("sidebar--collapsed", !hamburgerMenu.classList.contains("hamburger-menu--open"));
    };

    init();
}
