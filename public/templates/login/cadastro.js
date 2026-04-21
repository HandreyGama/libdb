import { registrarUsuario, fazerLogin, estaLogado } from '../../src/modules/auth.js';

document.addEventListener('DOMContentLoaded', () => {
    if (estaLogado()) {
        window.location.href = '/home';
        return;
    }

    const form = document.getElementById('login-form');
    const nomeInput = document.getElementById('nome-input');
    const emailInput = document.getElementById('email-input');
    const passwordInput = document.getElementById('password-input');
    const loginButton = document.getElementById('register-button');

    loginButton.addEventListener('click', () => {
        window.location.href = '/';
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim().toLowerCase();
        const senha = passwordInput.value.trim();

        if (!nome) {
            alert('Nome e obrigatorio');
            return;
        }

        const cadastro = registrarUsuario(email, senha);
        alert(cadastro.mensagem);

        if (!cadastro.sucesso) {
            return;
        }

        const login = fazerLogin(email, senha);
        if (login.sucesso) {
            window.location.href = '/home';
        }
    });
});
