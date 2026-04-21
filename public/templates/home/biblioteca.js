import { protegerPagina, obterUsuarioAtual, fazerLogout } from '../../src/modules/auth.js';
import { obterAvaliacao } from '../../src/modules/ratings.js';
import { obterBibliotecaCompleta, removerLivroBiblioteca, limparBiblioteca } from '../../src/modules/library.js';

function atualizarResumo(total) {
    const resumo = document.getElementById('library-total');
    resumo.textContent = `${total} ${total === 1 ? 'livro' : 'livros'}`;
}

function montarEstrelas(estrelas = 0) {
    const ativas = '⭐'.repeat(estrelas);
    const inativas = '☆'.repeat(5 - estrelas);
    return `${ativas}${inativas}`;
}

function criarCardLivro(livro) {
    const avaliacao = obterAvaliacao(livro.id);
    const capa = livro.capa || 'https://via.placeholder.com/200x300?text=Sem+Capa';
    const estrelas = avaliacao?.estrelas || 0;
    const comentario = avaliacao?.comentario?.trim();

    const item = document.createElement('article');
    item.className = 'livro-item';
    item.innerHTML = `
        <div class="livro-capa-wrapper">
            <img class="livro-capa" src="${capa}" alt="${livro.titulo}">
            <div class="livro-overlay">
                <div class="overlay-buttons">
                    <button class="btn-remover-biblioteca" data-livro-id="${livro.id}">Remover</button>
                </div>
            </div>
        </div>
        <div class="livro-info">
            <h3 class="livro-titulo">${livro.titulo}</h3>
            <p class="livro-autor">${livro.autor || 'Autor desconhecido'}</p>
            <div class="livro-rating">
                <span class="livro-rating-stars">${montarEstrelas(estrelas)}</span>
                <span class="livro-rating-text">${estrelas}/5</span>
            </div>
            <p class="livro-rating-comment">${comentario || 'Sem comentario de avaliacao.'}</p>
        </div>
    `;

    item.querySelector('.btn-remover-biblioteca').addEventListener('click', () => {
        const resultado = removerLivroBiblioteca(livro.id);
        alert(resultado.mensagem);
        renderizarBiblioteca();
    });

    return item;
}

function renderizarBiblioteca() {
    const livros = obterBibliotecaCompleta();
    const estadoVazio = document.getElementById('biblioteca-vazia');
    const secaoLivros = document.getElementById('biblioteca-livros');
    const grid = document.getElementById('livros-grid');
    const limparBtn = document.getElementById('limpar-biblioteca-button');

    atualizarResumo(livros.length);
    grid.innerHTML = '';

    if (livros.length === 0) {
        estadoVazio.style.display = 'flex';
        secaoLivros.style.display = 'none';
        limparBtn.style.display = 'none';
        return;
    }

    estadoVazio.style.display = 'none';
    secaoLivros.style.display = 'block';
    limparBtn.style.display = 'inline-block';

    livros.forEach((livro) => {
        grid.appendChild(criarCardLivro(livro));
    });
}

document.addEventListener('DOMContentLoaded', () => {
    protegerPagina();
    document.getElementById('user-email-biblioteca').textContent = obterUsuarioAtual();

    document.getElementById('voltar-button').addEventListener('click', () => {
        window.location.href = '/home';
    });

    document.getElementById('ir-para-home').addEventListener('click', () => {
        window.location.href = '/home';
    });

    document.getElementById('logout-button-biblioteca').addEventListener('click', () => {
        if (confirm('Tem certeza que quer sair?')) {
            fazerLogout();
            window.location.href = '/';
        }
    });

    document.getElementById('limpar-biblioteca-button').addEventListener('click', () => {
        if (confirm('Deseja remover todos os livros da sua biblioteca?')) {
            const resultado = limparBiblioteca();
            alert(resultado.mensagem);
            renderizarBiblioteca();
        }
    });

    renderizarBiblioteca();
});
