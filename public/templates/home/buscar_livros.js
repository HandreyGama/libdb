import {
    pegar_livros_por_autor,
    pegar_livros_por_tema,
    pegar_livros_por_titulo,
    pegar_capa_livro
} from '../../src/modules/api.js'
import {
    addBookToMyList,
    loadReaderState,
    getMyLibraryCount,
    upsertBook
} from '../../src/modules/reader_store.js'

const CATEGORIA_LABELS = {
    todos: 'Todos os Livros',
    ficcao: 'Ficcao',
    'nao-ficcao': 'Nao-ficcao',
    romance: 'Romance',
    fantasia: 'Fantasia',
    misterio: 'Misterio',
    biografia: 'Biografia',
    infantojuvenil: 'Infantojuvenil',
    poesia: 'Poesia',
    drama: 'Drama',
    'ficcao-cientifica': 'Ficcao Cientifica'
}

const dom = {}
let livrosBase = []
let livrosAtuais = []
let categoriaAtiva = 'todos'
let autorAtivo = 'todos'
let statusBibliotecaAtivo = 'todos'
let ordenacaoAtiva = 'relevancia'
let requestCounter = 0
let debounceTimer

document.addEventListener('DOMContentLoaded', inicializarHome)

async function inicializarHome() {
    dom.searchInput = document.getElementById('search-input')
    dom.grid = document.getElementById('livros-grid')
    dom.semResultados = document.getElementById('sem-resultados')
    dom.secaoTitulo = document.getElementById('secao-titulo')
    dom.total = document.getElementById('stat-total')
    dom.encontrados = document.getElementById('stat-encontrados')
    dom.listaCategorias = document.getElementById('categoria-lista')
    dom.filtrosBtn = document.getElementById('filtros-btn')
    dom.bibliotecaCounter = document.getElementById('biblioteca-counter')
    dom.filterAuthor = document.getElementById('filter-author')
    dom.filterLibrary = document.getElementById('filter-library')
    dom.sortSelect = document.getElementById('sort-select')
    dom.resetFilters = document.getElementById('reset-filters')
    dom.sidebarFilters = document.getElementById('sidebar-filters')

    if (!dom.searchInput || !dom.grid || !dom.listaCategorias) {
        return
    }

    configurarEventos()
    atualizarContadorBiblioteca()
    await carregarLivrosIniciais()
    aplicarFiltrosLocais('')
}

function configurarEventos() {
    dom.searchInput.addEventListener('input', () => {
        const termo = dom.searchInput.value.trim()
        clearTimeout(debounceTimer)
        debounceTimer = setTimeout(() => {
            pesquisar(termo)
        }, 350)
    })

    dom.listaCategorias.addEventListener('click', (event) => {
        const item = event.target.closest('.categoria-item')
        if (!item) {
            return
        }

        document.querySelectorAll('.categoria-item').forEach((categoria) => {
            categoria.classList.remove('active')
        })

        item.classList.add('active')
        categoriaAtiva = item.dataset.genero || 'todos'
        aplicarFiltrosLocais(dom.searchInput.value.trim())
    })

    if (dom.filterAuthor) {
        dom.filterAuthor.addEventListener('change', () => {
            autorAtivo = dom.filterAuthor.value
            aplicarFiltrosLocais(dom.searchInput.value.trim())
        })
    }

    if (dom.filterLibrary) {
        dom.filterLibrary.addEventListener('change', () => {
            statusBibliotecaAtivo = dom.filterLibrary.value
            aplicarFiltrosLocais(dom.searchInput.value.trim())
        })
    }

    if (dom.sortSelect) {
        dom.sortSelect.addEventListener('change', () => {
            ordenacaoAtiva = dom.sortSelect.value
            aplicarFiltrosLocais(dom.searchInput.value.trim())
        })
    }

    if (dom.resetFilters) {
        dom.resetFilters.addEventListener('click', limparFiltros)
    }

    if (dom.filtrosBtn) {
        dom.filtrosBtn.addEventListener('click', () => {
            const aberto = dom.sidebarFilters?.classList.toggle('filters-open')
            dom.filtrosBtn.setAttribute('aria-expanded', aberto ? 'true' : 'false')

            if (aberto) {
                dom.sidebarFilters?.scrollIntoView({ behavior: 'smooth', block: 'start' })
                dom.filterAuthor?.focus()
            }
        })
    }
}

async function carregarLivrosIniciais() {
    mostrarLoading('Carregando biblioteca...')

    const fallbackLocal = await carregarLivrosFallback()
    if (fallbackLocal.length) {
        livrosBase = [...fallbackLocal]
        livrosAtuais = [...fallbackLocal]
        atualizarOpcoesAutor(livrosBase)
        aplicarFiltrosLocais(dom.searchInput?.value.trim() || '')
    }

    try {
        const respostaAutores = await fetch('/data/autores.json')
        const dataAutores = await respostaAutores.json()
        const autores = Array.isArray(dataAutores.autores) ? dataAutores.autores : []

        const respostas = await Promise.all(
            autores.map((autor) => pegar_livros_por_autor(autor))
        )

        const docs = respostas.flatMap((resposta) => (resposta?.docs || []).slice(0, 12))
        const remotos = normalizarLivros(docs)

        if (remotos.length > 0) {
            livrosBase = remotos
            livrosAtuais = [...remotos]
            atualizarOpcoesAutor(livrosBase)
        }
    } catch (error) {
        console.error('Falha ao carregar livros iniciais:', error)
    }
}

async function pesquisar(termo) {
    const requestId = ++requestCounter

    if (!termo) {
        livrosAtuais = [...livrosBase]
        aplicarFiltrosLocais('')
        return
    }

    mostrarLoading('Buscando livros...')

    try {
        const [resultadoTitulo, resultadoAutor, resultadoTema] = await Promise.all([
            pegar_livros_por_titulo(termo),
            pegar_livros_por_autor(termo),
            pegar_livros_por_tema(termo)
        ])

        if (requestId !== requestCounter) {
            return
        }

        const docsBusca = [
            ...(resultadoTitulo?.docs || []),
            ...(resultadoAutor?.docs || []),
            ...(resultadoTema?.works || [])
        ]

        const normalizados = normalizarLivros(docsBusca)
        livrosAtuais = normalizados.length
            ? normalizados
            : livrosBase.filter((livro) => {
                const titulo = normalizarTexto(livro.titulo)
                const autor = normalizarTexto(livro.autor)
                const termoNormalizado = normalizarTexto(termo)
                return titulo.includes(termoNormalizado) || autor.includes(termoNormalizado)
            })

        atualizarOpcoesAutor(livrosAtuais.length ? livrosAtuais : livrosBase)
        aplicarFiltrosLocais(termo)
    } catch (error) {
        console.error('Falha na busca de livros:', error)
        livrosAtuais = livrosBase.filter((livro) => {
            const titulo = normalizarTexto(livro.titulo)
            const autor = normalizarTexto(livro.autor)
            const termoNormalizado = normalizarTexto(termo)
            return titulo.includes(termoNormalizado) || autor.includes(termoNormalizado)
        })
        aplicarFiltrosLocais(termo)
    }
}

function aplicarFiltrosLocais(termo) {
    const termoNormalizado = normalizarTexto(termo)
    const state = loadReaderState()

    let filtrados = livrosAtuais.filter((livro) => {
        if (categoriaAtiva !== 'todos' && livro.categoria !== categoriaAtiva) {
            return false
        }

        if (autorAtivo !== 'todos' && normalizarTexto(livro.autor) !== autorAtivo) {
            return false
        }

        const estaNaLista = Boolean(state.books?.[livro.id] && state.books[livro.id].inMyList !== false)
        if (statusBibliotecaAtivo === 'na-lista' && !estaNaLista) {
            return false
        }
        if (statusBibliotecaAtivo === 'fora-da-lista' && estaNaLista) {
            return false
        }

        return true
    })

    if (termoNormalizado) {
        filtrados = filtrados.filter((livro) => {
            const titulo = normalizarTexto(livro.titulo)
            const autor = normalizarTexto(livro.autor)
            return titulo.includes(termoNormalizado) || autor.includes(termoNormalizado)
        })
    }

    filtrados = ordenarLivros(filtrados)

    renderizarLivros(filtrados)
    atualizarCabecalho(termo)
    atualizarEstatisticas(filtrados.length)
}

function renderizarLivros(listaLivros) {
    dom.grid.innerHTML = ''
    const state = loadReaderState()

    if (listaLivros.length === 0) {
        dom.semResultados.style.display = 'block'
        return
    }

    dom.semResultados.style.display = 'none'

    listaLivros.forEach((livro) => {
        const livroState = state.books?.[livro.id]
        const jaAdicionado = Boolean(livroState && livroState.inMyList !== false)

        const card = document.createElement('article')
        card.className = 'livro-card'
        card.tabIndex = 0
        card.setAttribute('role', 'button')
        card.setAttribute('aria-label', `Abrir detalhes de ${livro.titulo}`)

        const capaWrapper = document.createElement('div')
        capaWrapper.className = 'livro-capa-wrapper'

        if (livro.capaUrl) {
            const img = document.createElement('img')
            img.className = 'livro-capa'
            img.src = livro.capaUrl
            img.alt = `Capa do livro ${livro.titulo}`
            capaWrapper.appendChild(img)
        } else {
            const semCapa = document.createElement('div')
            semCapa.className = 'livro-capa sem-capa'
            semCapa.textContent = 'Sem capa'
            capaWrapper.appendChild(semCapa)
        }

        const overlay = document.createElement('div')
        overlay.className = 'livro-overlay'

        const botao = document.createElement('button')
        botao.className = 'btn-ver'
        botao.type = 'button'
        botao.textContent = 'Ver detalhes'
        botao.addEventListener('click', (event) => {
            event.stopPropagation()
            abrirDetalhesLivro(livro)
        })
        overlay.appendChild(botao)
        capaWrapper.appendChild(overlay)

        const info = document.createElement('div')
        info.className = 'livro-info'

        const titulo = document.createElement('h3')
        titulo.className = 'livro-titulo'
        titulo.textContent = livro.titulo

        const autor = document.createElement('p')
        autor.className = 'livro-autor'
        autor.textContent = livro.autor

        const tag = document.createElement('span')
        tag.className = 'livro-genero-tag'
        tag.textContent = CATEGORIA_LABELS[livro.categoria] || CATEGORIA_LABELS.ficcao

        const acoes = document.createElement('div')
        acoes.className = 'livro-acoes'

        const btnAddLista = document.createElement('button')
        btnAddLista.className = 'btn-add-lista'
        btnAddLista.type = 'button'
        btnAddLista.textContent = jaAdicionado ? 'Adicionado' : 'Adicionar'
        btnAddLista.addEventListener('click', (event) => {
            event.stopPropagation()
            adicionarLivroNaBiblioteca(livro, btnAddLista)
        })

        acoes.appendChild(btnAddLista)

        info.appendChild(titulo)
        info.appendChild(autor)
        info.appendChild(tag)
        info.appendChild(acoes)

        card.appendChild(capaWrapper)
        card.appendChild(info)

        card.addEventListener('click', () => abrirDetalhesLivro(livro))
        card.addEventListener('keydown', (event) => {
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                abrirDetalhesLivro(livro)
            }
        })

        dom.grid.appendChild(card)
    })
}

function atualizarCabecalho(termo) {
    const categoriaTexto = CATEGORIA_LABELS[categoriaAtiva] || CATEGORIA_LABELS.todos
    if (termo) {
        dom.secaoTitulo.textContent = `Resultados: ${termo}`
        return
    }

    dom.secaoTitulo.textContent = categoriaTexto
}

function atualizarEstatisticas(totalEncontrados) {
    if (dom.total) {
        dom.total.textContent = String(livrosBase.length)
    }
    if (dom.encontrados) {
        dom.encontrados.textContent = String(totalEncontrados)
    }
}

function atualizarOpcoesAutor(listaLivros) {
    if (!dom.filterAuthor) {
        return
    }

    const autoresUnicos = Array.from(new Set(
        listaLivros
            .map((livro) => livro.autor)
            .filter(Boolean)
    )).sort((a, b) => a.localeCompare(b, 'pt-BR'))

    const valorAtual = autorAtivo
    dom.filterAuthor.innerHTML = '<option value="todos">Todos os autores</option>'

    autoresUnicos.forEach((autor) => {
        const option = document.createElement('option')
        option.value = normalizarTexto(autor)
        option.textContent = autor
        dom.filterAuthor.appendChild(option)
    })

    dom.filterAuthor.value = autoresUnicos.some((autor) => normalizarTexto(autor) === valorAtual)
        ? valorAtual
        : 'todos'
    autorAtivo = dom.filterAuthor.value
}

function ordenarLivros(listaLivros) {
    const copia = [...listaLivros]

    if (ordenacaoAtiva === 'titulo') {
        return copia.sort((a, b) => a.titulo.localeCompare(b.titulo, 'pt-BR'))
    }

    if (ordenacaoAtiva === 'autor') {
        return copia.sort((a, b) => a.autor.localeCompare(b.autor, 'pt-BR'))
    }

    if (ordenacaoAtiva === 'ano') {
        return copia.sort((a, b) => Number(b.ano || 0) - Number(a.ano || 0))
    }

    return copia
}

function limparFiltros() {
    categoriaAtiva = 'todos'
    autorAtivo = 'todos'
    statusBibliotecaAtivo = 'todos'
    ordenacaoAtiva = 'relevancia'

    if (dom.searchInput) {
        dom.searchInput.value = ''
    }
    if (dom.filterAuthor) {
        dom.filterAuthor.value = 'todos'
    }
    if (dom.filterLibrary) {
        dom.filterLibrary.value = 'todos'
    }
    if (dom.sortSelect) {
        dom.sortSelect.value = 'relevancia'
    }

    document.querySelectorAll('.categoria-item').forEach((categoria) => {
        categoria.classList.remove('active')
    })
    document.querySelector('.categoria-item[data-genero="todos"]')?.classList.add('active')

    livrosAtuais = [...livrosBase]
    atualizarOpcoesAutor(livrosBase)
    aplicarFiltrosLocais('')
}

async function carregarLivrosFallback() {
    try {
        const resposta = await fetch('/data/livros_fallback.json')
        const data = await resposta.json()
        return normalizarLivros(data?.docs || [])
    } catch (error) {
        console.error('Falha ao carregar fallback local:', error)
        return []
    }
}

function mostrarLoading(mensagem) {
    dom.grid.innerHTML = `
        <div class="loading-estado">
            <div class="loading-spinner"></div>
            <p>${mensagem}</p>
        </div>
    `
    dom.semResultados.style.display = 'none'
}

function normalizarLivros(lista) {
    const mapa = new Map()

    lista.forEach((item) => {
        const livro = converterLivro(item)
        if (!livro) {
            return
        }

        if (!mapa.has(livro.id)) {
            mapa.set(livro.id, livro)
        }
    })

    return Array.from(mapa.values())
}

function converterLivro(item) {
    const titulo = (item?.title || '').trim()
    if (!titulo) {
        return null
    }

    const autor =
        item?.author_name?.[0] ||
        item?.authors?.[0]?.name ||
        'Autor desconhecido'

    const id =
        item?.key ||
        item?.cover_edition_key ||
        item?.edition_key?.[0] ||
        `${titulo}-${autor}`

    return {
        id,
        titulo,
        autor,
        capaUrl: montarCapaUrl(item),
        categoria: inferirCategoria(item),
        descricao: extrairDescricao(item),
        assuntos: extrairAssuntos(item),
        ano: item?.first_publish_year || item?.publish_year?.[0] || null,
        isbn: item?.isbn?.[0] || null,
        paginas: item?.number_of_pages_median || item?.number_of_pages || null,
        idioma: item?.language?.[0] || 'pt'
    }
}

function extrairDescricao(item) {
    if (typeof item?.description === 'string') {
        return item.description
    }

    if (typeof item?.description?.value === 'string') {
        return item.description.value
    }

    if (typeof item?.first_sentence === 'string') {
        return item.first_sentence
    }

    if (typeof item?.first_sentence?.[0] === 'string') {
        return item.first_sentence[0]
    }

    return ''
}

function extrairAssuntos(item) {
    const assuntos = [
        ...(item?.subject || []),
        ...(item?.subjects || []),
        ...(item?.subject_key || [])
    ]

    return assuntos
        .filter((assunto) => typeof assunto === 'string' && assunto.trim())
        .slice(0, 8)
}

function montarCapaUrl(item) {
    if (item?.cover_edition_key) {
        return pegar_capa_livro(item.cover_edition_key)
    }

    if (item?.edition_key?.[0]) {
        return pegar_capa_livro(item.edition_key[0])
    }

    const coverId = item?.cover_i || item?.cover_id
    if (coverId) {
        return `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
    }

    return null
}

function inferirCategoria(item) {
    const titulo = normalizarTexto(String(item?.title || ''))
    const autor = normalizarTexto(String(item?.author_name?.[0] || item?.authors?.[0]?.name || ''))

    const assuntos = [
        ...(item?.subject || []),
        ...(item?.subject_key || []),
        item?.first_subject || '',
        titulo,
        autor
    ]
        .map((texto) => normalizarTexto(String(texto)))
        .filter(Boolean)

    const inclui = (termos) => termos.some((termo) => assuntos.some((s) => s.includes(termo)))

    if (inclui(['biography', 'autobiography', 'memoir', 'biografia'])) {
        return 'biografia'
    }
    if (inclui(['science fiction', 'sci-fi', 'ficcao cientifica', 'distopia'])) {
        return 'ficcao-cientifica'
    }
    if (inclui(['fantasy', 'fantasia', 'wizard', 'magic', 'dragon', 'middle earth', 'hogwarts'])) {
        return 'fantasia'
    }
    if (inclui(['mystery', 'detective', 'crime', 'misterio', 'thriller'])) {
        return 'misterio'
    }
    if (inclui(['poetry', 'poesia', 'poems'])) {
        return 'poesia'
    }
    if (inclui(['drama', 'theater', 'teatro', 'tragedia'])) {
        return 'drama'
    }
    if (inclui(['children', 'juvenile', 'young adult', 'infanto', 'infantil'])) {
        return 'infantojuvenil'
    }
    if (inclui(['nonfiction', 'nao ficcao', 'history', 'essay', 'science'])) {
        return 'nao-ficcao'
    }
    if (inclui(['romance', 'love', 'relationship', 'amor', 'marriage'])) {
        return 'romance'
    }

    // Fallback por autor quando a API nao retorna assuntos suficientes.
    if (autor.includes('tolkien') || autor.includes('rowling')) {
        return 'fantasia'
    }
    if (autor.includes('jane austen') || autor.includes('colleen hoover') || autor.includes('ali hazelwood')) {
        return 'romance'
    }
    if (autor.includes('machado de assis')) {
        return 'drama'
    }

    return 'ficcao'
}

function normalizarTexto(texto) {
    return texto
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .trim()
}

function abrirDetalhesLivro(livro) {
    upsertBook(livro)

    window.location.href = `/book?id=${encodeURIComponent(livro.id)}`
}

function adicionarLivroNaBiblioteca(livro, botao) {
    addBookToMyList(livro)
    atualizarContadorBiblioteca()

    if (botao) {
        botao.textContent = 'Adicionado'
    }

    aplicarFiltrosLocais(dom.searchInput?.value.trim() || '')
}

function atualizarContadorBiblioteca() {
    if (!dom.bibliotecaCounter) {
        return
    }

    dom.bibliotecaCounter.textContent = String(getMyLibraryCount())
}