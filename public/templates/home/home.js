import { protegerPagina, obterUsuarioAtual, fazerLogout } from '../../src/modules/auth.js';
import { salvarAvaliacao, obterAvaliacao } from '../../src/modules/ratings.js';
import { adicionarLivroBiblioteca, removerLivroBiblioteca, obterBibliotecaCompleta, verificarLivroNaBiblioteca } from '../../src/modules/library.js';
import { 
    pegar_livros_por_autor, 
    pegar_livros_por_tema, 
    pegar_livros_por_titulo,
    pegar_capa_livro 
} from '../../src/modules/api.js';
let livroAtualModals = null;

function atualizarContadorBiblioteca() {
    const contador = document.getElementById('library-count');
    if (!contador) return;
    contador.textContent = obterBibliotecaCompleta().length;
}

document.addEventListener('DOMContentLoaded', async () => {

    protegerPagina();


    const usuarioAtual = obterUsuarioAtual();
    document.getElementById('user-email').textContent = usuarioAtual;

    document.getElementById('minha-biblioteca-button').addEventListener('click', () => {
        window.location.href = '/biblioteca';
    });
    atualizarContadorBiblioteca();


    document.getElementById('logout-button').addEventListener('click', () => {
        if (confirm('Tem certeza que quer sair?')) {
            fazerLogout();
            window.location.href = '/';
        }
    });


    await carregarAutores();


    const buscaButton = document.getElementById('buscar-button');
    const buscaInput = document.getElementById('buscar-livro');

    buscaButton.addEventListener('click', () => buscar());
    buscaInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') buscar();
    });

    setupModais();
});

async function carregarAutores() {
    try {
        const response = await fetch('data/autores.json');
        const data = await response.json();
        
        const autoresDiv = document.getElementById('livros-carossels');
        
        for (const autor of data.autores) {
            await gerar_carrossel_autores(autor);
        }
    } catch (error) {
        console.error('Erro ao carregar autores:', error);
    }
}

async function gerar_carrossel_autores(autor) {
    const div_carrossels = document.getElementById('livros-carossels');

    const carrossel_autor = document.createElement("div");
    const carrossel_autor_livros = document.createElement("div");
    const titulo_autor = document.createElement("h1");
    titulo_autor.innerText = autor;
    const btnPrev = document.createElement("button");
    const btnNext = document.createElement("button");

    carrossel_autor.classList.add("carrossel-autor");
    carrossel_autor_livros.classList.add("autor-carrossel-livros");

    btnPrev.classList.add("livros-carrossel-button");
    btnNext.classList.add("livros-carrossel-button");

    btnPrev.innerText = "<";
    btnNext.innerText = ">";

    try {
        const livros_autor = await pegar_livros_por_autor(autor);
        const lista_livros = livros_autor.docs || [];

        for (const element of lista_livros) {
            if (!element.cover_edition_key) continue;

            const card_livros = document.createElement("div");
            card_livros.classList.add("livro-card");
            
            const link_capa_livro = pegar_capa_livro(element.cover_edition_key);
            

            const livroId = `${element.key}`;

            card_livros.innerHTML = `
                <h3 class="livros-cards">${element.title}</h3>
                <img class="livro-capa" src="${link_capa_livro}" alt="${element.title}">
                <button class="btn-avaliar" data-livro-id="${livroId}" data-titulo="${element.title}" data-autor="${element.author_name?.[0] || autor}" data-capa="${link_capa_livro}">⭐ Avaliar</button>
            `;


            card_livros.querySelector('.btn-avaliar').addEventListener('click', (e) => {
                abrirModalAvaliacao(
                    e.target.dataset.livroId,
                    e.target.dataset.titulo,
                    e.target.dataset.autor,
                    e.target.dataset.capa || null
                );
            });

            carrossel_autor_livros.appendChild(card_livros);
        }

        div_carrossels.append(titulo_autor);
        carrossel_autor.appendChild(btnPrev);
        carrossel_autor.appendChild(carrossel_autor_livros);
        carrossel_autor.appendChild(btnNext);

        div_carrossels.appendChild(carrossel_autor);


        const livros = carrossel_autor_livros.querySelectorAll('.livro-capa');

        let currentBook = 0;
        let livro_em_foco = livros[currentBook];

        function centralizarItem(item) {
            const itemCenter = item.offsetLeft + item.offsetWidth / 2;
            const containerCenter = carrossel_autor_livros.offsetWidth / 2;
            const scrollPara = itemCenter - containerCenter;

            carrossel_autor_livros.scrollTo({
                left: scrollPara,
                behavior: 'smooth'
            });
        }

        btnNext.addEventListener('click', () => {
            if (livro_em_foco) {
                livro_em_foco.classList.remove('on');
            }

            currentBook++;
            if (currentBook >= livros.length) currentBook = livros.length - 1;

            livro_em_foco = livros[currentBook];
            livro_em_foco.classList.add('on');

            centralizarItem(livro_em_foco);
        });

        btnPrev.addEventListener('click', () => {
            if (livro_em_foco) {
                livro_em_foco.classList.remove('on');
            }

            currentBook--;
            if (currentBook < 0) currentBook = 0;

            livro_em_foco = livros[currentBook];
            livro_em_foco.classList.add('on');

            centralizarItem(livro_em_foco);
        });
    } catch (error) {
        console.error('Erro ao carregar livros do autor:', error);
    }
}

async function buscar() {
    const query = document.getElementById('buscar-livro').value.trim();
    
    if (query.length === 0) {
        alert("Digite um livro/autor/tema para pesquisar!");
        return;
    }

    try {
        const [livros_titulo, livros_autor, livros_tema] = await Promise.all([
            pegar_livros_por_titulo(query),
            pegar_livros_por_autor(query),
            pegar_livros_por_tema(query)
        ]);

        const resultados = [];

        if (livros_titulo && livros_titulo.docs) {
            resultados.push(...livros_titulo.docs.slice(0, 5));
        }

        if (livros_autor && livros_autor.docs) {
            resultados.push(...livros_autor.docs.slice(0, 5));
        }

        if (livros_tema && livros_tema.works) {
            resultados.push(...livros_tema.works.slice(0, 5));
        }


        const unicos = Array.from(new Map(resultados.map(item => [item.key, item])).values());

        abrirModalBusca(unicos);
    } catch (error) {
        console.error('Erro na busca:', error);
        alert('Erro ao buscar. Tente novamente!');
    }
}

function abrirModalBusca(resultados) {
    const modal = document.getElementById('search-modal');
    const resultsDiv = document.getElementById('search-results');
    
    resultsDiv.innerHTML = '';

    if (resultados.length === 0) {
        resultsDiv.innerHTML = '<p>Nenhum livro encontrado.</p>';
    } else {
        resultados.forEach(livro => {
            const title = livro.title || 'Sem título';
            const author = livro.author_name?.[0] || 'Autor desconhecido';
            const cover = livro.cover_edition_key ? pegar_capa_livro(livro.cover_edition_key) : 'https://via.placeholder.com/150';
            const livroId = livro.key;
            const livroData = {
                id: livroId,
                titulo: title,
                autor: author,
                capa: cover
            };
            
            const livroDiv = document.createElement('div');
            livroDiv.classList.add('search-result-item');
            
            const estaRealizado = verificarLivroNaBiblioteca(livroId);
            
            livroDiv.innerHTML = `
                <img src="${cover}" alt="${title}" class="search-result-cover">
                <div class="search-result-info">
                    <h3>${title}</h3>
                    <p>${author}</p>
                    <div class="search-buttons">
                        <button class="btn-avaliar-search" data-livro-id="${livroId}" data-titulo="${title}" data-autor="${author}" data-cover-id="${livro.cover_edition_key || ''}" >⭐ Avaliar</button>
                        <button class="btn-add-search" data-livro-id="${livroId}" data-titulo="${title}" data-autor="${author}" data-cover-id="${livro.cover_edition_key || ''}">
                            ${estaRealizado ? '🗑️ Remover' : '📚 Adicionar'}
                        </button>
                    </div>
                </div>
            `;

            livroDiv.querySelector('.btn-avaliar-search').addEventListener('click', (e) => {
                const capa = livro.cover_edition_key ? pegar_capa_livro(livro.cover_edition_key) : null;
                abrirModalAvaliacao(e.target.dataset.livroId, e.target.dataset.titulo, e.target.dataset.autor, capa);
                modal.classList.remove('show');
            });

            livroDiv.querySelector('.btn-add-search').addEventListener('click', (e) => {
                const acao = verificarLivroNaBiblioteca(livroData.id)
                    ? removerLivroBiblioteca(livroData.id)
                    : adicionarLivroBiblioteca(livroData.id, livroData.titulo, livroData.autor, livroData.capa);
                alert(acao.mensagem);
                atualizarContadorBiblioteca();
                abrirModalBusca(resultados);
            });

            resultsDiv.appendChild(livroDiv);
        });
    }

    modal.classList.add('show');
}

function abrirModalAvaliacao(livroId, titulo, autor, capa = null) {
    const modal = document.getElementById('rating-modal');
    const infoDiv = document.getElementById('rating-book-info');
    const starsDiv = document.getElementById('rating-stars');
    const commentInput = document.getElementById('rating-comment');
    const saveButton = document.getElementById('save-rating');
    const addToLibraryBtn = document.getElementById('add-to-library-from-rating');


    livroAtualModals = { livroId, titulo, autor, capa };

    infoDiv.innerHTML = `<h3>${titulo}</h3><p>por ${autor}</p>`;
    commentInput.value = '';

    const avaliacaoAnterior = obterAvaliacao(livroId);
    let estrelasSelecionadas = 0;

    if (avaliacaoAnterior) {
        estrelasSelecionadas = avaliacaoAnterior.estrelas;
        commentInput.value = avaliacaoAnterior.comentario;
    }


    const stars = starsDiv.querySelectorAll('.star');
    stars.forEach(star => {
        star.classList.remove('active');
        star.style.cursor = 'pointer';

        if (parseInt(star.dataset.value) <= estrelasSelecionadas) {
            star.classList.add('active');
        }

        star.onclick = null;
        star.addEventListener('click', () => {
            estrelasSelecionadas = parseInt(star.dataset.value);
            stars.forEach(s => s.classList.remove('active'));
            for (let i = 1; i <= estrelasSelecionadas; i++) {
                stars[i - 1].classList.add('active');
            }
        });

        star.addEventListener('mouseenter', () => {
            stars.forEach((s, index) => {
                if (index < parseInt(star.dataset.value)) {
                    s.style.opacity = '0.6';
                } else {
                    s.style.opacity = '1';
                }
            });
        });

        star.addEventListener('mouseleave', () => {
            stars.forEach(s => s.style.opacity = '1');
        });
    });


    saveButton.onclick = () => {
        if (estrelasSelecionadas === 0) {
            alert('Selecione uma avaliação!');
            return;
        }

        const resultado = salvarAvaliacao(livroId, titulo, autor, estrelasSelecionadas, commentInput.value);
        alert(resultado.mensagem);
    };


    addToLibraryBtn.onclick = () => {
        const resultado = adicionarLivroBiblioteca(livroId, titulo, autor, capa);
        alert(resultado.mensagem);
        atualizarContadorBiblioteca();
        

        if (resultado.sucesso) {
            addToLibraryBtn.textContent = '✓ Adicionado à Biblioteca';
            addToLibraryBtn.style.opacity = '0.7';
            addToLibraryBtn.disabled = true;
        }
    };


    if (verificarLivroNaBiblioteca(livroId)) {
        addToLibraryBtn.textContent = '✓ Adicionado à Biblioteca';
        addToLibraryBtn.style.opacity = '0.7';
        addToLibraryBtn.disabled = true;
    } else {
        addToLibraryBtn.textContent = '📚 Adicionar à Biblioteca';
        addToLibraryBtn.style.opacity = '1';
        addToLibraryBtn.disabled = false;
    }

    modal.classList.add('show');
}

function setupModais() {
    const modais = document.querySelectorAll('.modal');
    const closes = document.querySelectorAll('.close');

    closes.forEach(closeBtn => {
        closeBtn.addEventListener('click', () => {
            closeBtn.closest('.modal').classList.remove('show');
        });
    });

    window.addEventListener('click', (event) => {
        modais.forEach(modal => {
            if (event.target === modal) {
                modal.classList.remove('show');
            }
        });
    });
}
