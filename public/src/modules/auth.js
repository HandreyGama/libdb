const USERS_STORAGE_KEY = 'libdb_users';
const CURRENT_USER_KEY = 'libdb_current_user';

function normalizarEmail(email = '') {
    return email.trim().toLowerCase();
}

export function registrarUsuario(email, senha) {
    const emailNormalizado = normalizarEmail(email);
    const senhaNormalizada = String(senha || '').trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'Email e senha sao obrigatorios.' };
    }

    const usuarios = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const jaExiste = usuarios.some((usuario) => usuario.email === emailNormalizado);

    if (jaExiste) {
        return { sucesso: false, mensagem: 'Este email ja esta cadastrado.' };
    }

    usuarios.push({
        email: emailNormalizado,
        senha: btoa(senhaNormalizada),
        criadoEm: new Date().toISOString()
    });

    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usuarios));
    return { sucesso: true, mensagem: 'Cadastro realizado com sucesso!' };
}

export function fazerLogin(email, senha) {
    const emailNormalizado = normalizarEmail(email);
    const senhaNormalizada = String(senha || '').trim();

    if (!emailNormalizado || !senhaNormalizada) {
        return { sucesso: false, mensagem: 'Email e senha sao obrigatorios.' };
    }

    const usuarios = JSON.parse(localStorage.getItem(USERS_STORAGE_KEY)) || [];
    const usuario = usuarios.find(
        (item) => item.email === emailNormalizado && item.senha === btoa(senhaNormalizada)
    );

    if (!usuario) {
        return { sucesso: false, mensagem: 'Email ou senha invalidos.' };
    }

    localStorage.setItem(CURRENT_USER_KEY, usuario.email);
    return { sucesso: true, mensagem: 'Login realizado com sucesso!' };
}

export function fazerLogout() {
    localStorage.removeItem(CURRENT_USER_KEY);
}

export function obterUsuarioAtual() {
    return localStorage.getItem(CURRENT_USER_KEY);
}

export function estaLogado() {
    return Boolean(obterUsuarioAtual());
}
