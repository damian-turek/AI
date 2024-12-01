"use strict";
const msg = "Hello";
alert(msg);
function changeCSS(href) {
    const link = document.getElementById('theme-link');
    link.href = href;
}
const toggleButton = document.getElementById('toggle-theme');
if (toggleButton) {
    toggleButton.addEventListener('click', () => {
        const currentTheme = document.getElementById('theme-link').href;
        if (currentTheme.includes('theme-light.css')) {
            changeCSS('css/theme-dark.css');
        }
        else {
            changeCSS('css/theme-light.css');
        }
    });
}
