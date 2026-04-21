import { obterUsuarioAtual } from './auth.js';

const STORAGE_KEY = 'libdb_library';

function obterStorage() {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};
}

function salvarStorage(data) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function obterChaveUsuario() {
    return obterUsuarioAtual() || 'anonimo';
}

export function obterBibliotecaCompleta() {
    const storage = obterStorage();
    return storage[obterChaveUsuario()] || [];
}

export function verificarLivroNaBiblioteca(livroId) {
    return obterBibliotecaCompleta().some((livro) => livro.id === livroId);
}

export function adicionarLivroBiblioteca(id, titulo, autor, capa = null) {
    if (!id || !titulo) {
        return { sucesso: false, mensagem: 'Livro invalido para adicionar.' };
    }

    const storage = obterStorage();
    const usuario = obterChaveUsuario();
    const biblioteca = storage[usuario] || [];

    if (biblioteca.some((livro) => livro.id === id)) {
        return { sucesso: false, mensagem: 'Este livro ja esta na sua biblioteca.' };
    }

    biblioteca.push({
        id,
        titulo,
        autor: autor || 'Autor desconhecido',
        capa,
        adicionadoEm: new Date().toISOString()
    });

    storage[usuario] = biblioteca;
    salvarStorage(storage);

    return { sucesso: true, mensagem: 'Livro adicionado a sua biblioteca!' };
}

export function removerLivroBiblioteca(id) {
    const storage = obterStorage();
    const usuario = obterChaveUsuario();
    const biblioteca = storage[usuario] || [];

    if (!biblioteca.some((livro) => livro.id === id)) {
        return { sucesso: false, mensagem: 'Livro nao encontrado na biblioteca.' };
    }

    storage[usuario] = biblioteca.filter((livro) => livro.id !== id);
    salvarStorage(storage);

    return { sucesso: true, mensagem: 'Livro removido da sua biblioteca.' };
}

export function limparBiblioteca() {
    const storage = obterStorage();
    const usuario = obterChaveUsuario();
    storage[usuario] = [];
    salvarStorage(storage);
    return { sucesso: true, mensagem: 'Biblioteca esvaziada com sucesso.' };
}
