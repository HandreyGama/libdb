// Sistema de autenticação local com localStorage

const USERS_STORAGE_KEY = 'libdb_users';
const CURRENT_USER_KEY = 'libdb_current_user';

export function registrarUsuario(email, senha) {
    if (!email || !senha) {
        return { sucesso: false, mensagem: 'Email e senha são obrigatórios' };
    }

    let usuarios = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    
    if (usuarios.find(u => u.email === email)) {
        return { sucesso: false, mensagem: 'Este email já está registrado' };
    }

    usuarios.push({
        email,
        senha: btoa(senha), 
        dataCriacao: new Date().toISOString()
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usuarios));
    return { sucesso: true, mensagem: 'Usuário registrado com sucesso!' };
}

export function fazerLogin(email, senha) {
    if (!email || !senha) {
        return { sucesso: false, mensagem: 'Email e senha são obrigatórios' };
    }

    const usuarios = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const usuario = usuarios.find(u => u.email === email && u.senha === btoa(senha));

    if (!usuario) {
        return { sucesso: false, mensagem: 'Email ou senha inválidos' };
    }

    localStorage.setItem(CURRENT_USER_KEY, email);
    return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
}

export function fazerLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function obterUsuarioAtual() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

export function estaLogado() {
    return localStorage.getItem(CURRENT_USER_KEY) !== null;
}

export function protegerPagina() {
    if (!estaLogado()) {
        window.location.href = '/';
    }
}
