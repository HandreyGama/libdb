import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';
import { registrarUsuario, estaLogado } from '../../src/modules/auth.js';

document.addEventListener("DOMContentLoaded", () => {

    // Redireciona se já estiver logado
    if (estaLogado()) {
        window.location.href = '/home';
        return;
    }

    anime({
        targets: "#login",
        opacity: [0, 1],
        translateY: [50, 0],
        duration: 800,
        easing: 'easeOutQuad'
    });

    const passwordInput = document.getElementById("password-input");
    const showPasswordCheckbox = document.getElementById("show-password-checkbox");
    const loginForm = document.getElementById("login-form");
    
    console.log(passwordInput, showPasswordCheckbox);
    
    showPasswordCheckbox.addEventListener("click", () => {
        passwordInput.type = showPasswordCheckbox.checked ? "text" : "password";
    });

    // Cadastro funcional
    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        
        const nome = document.getElementById("nome-input").value;
        const email = document.getElementById("email-input").value;
        const senha = document.getElementById("password-input").value;
        
        // Validações simples
        if (!nome || !email || !senha) {
            alert("Preencha todos os campos!");
            return;
        }
        
        if (senha.length < 6) {
            alert("A senha deve ter no mínimo 6 caracteres!");
            return;
        }
        
        const resultado = registrarUsuario(email, senha);
        
        if (resultado.sucesso) {
            alert(resultado.mensagem);
            anime({
                targets: "#login",
                opacity: [1, 0],
                translateY: [0, 50],
                duration: 500,
                easing: 'easeInQuad',
                complete: () => {
                    window.location.href = '/';
                }
            });
        } else {
            alert(resultado.mensagem);
        }
    });

});
