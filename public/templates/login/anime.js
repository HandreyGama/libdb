import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';

document.addEventListener("DOMContentLoaded", () => {

    anime({
        targets: "#login",
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        easing: 'easeOutQuad'
    });

    const passwordInput = document.getElementById("password-input");
    const showPasswordCheckbox = document.getElementById("show-password-checkbox");

    showPasswordCheckbox.addEventListener("change", () => {
        passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
    });

});