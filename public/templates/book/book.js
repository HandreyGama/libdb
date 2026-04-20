import {
    getMyLibraryCount,
    loadReaderState,
    setSelectedBook,
    updateBookById,
    upsertBook,
    removeBookFromMyList
} from '../../src/modules/reader_store.js'

const dom = {}
let selectedBookId = null
let readerFontSize = 19
const READER_CONTENT_VERSION = 3
const THEMES = ['sepia', 'light', 'dark']

document.addEventListener('DOMContentLoaded', initBookScreen)

function initBookScreen() {
    captureDom()
    bindEvents()

    inicializarLivroAtual()
}

async function inicializarLivroAtual() {
    const queryId = new URLSearchParams(window.location.search).get('id')
    let state = loadReaderState()
    selectedBookId = queryId || state.selectedBookId || null

    if (selectedBookId && !state.books?.[selectedBookId]) {
        await recuperarLivroAusente(selectedBookId)
        state = loadReaderState()
    }

    if (!selectedBookId || !state.books?.[selectedBookId]) {
        renderNoBook()
        renderLibrary(state)
        return
    }

    setSelectedBook(selectedBookId)
    renderAll(loadReaderState())
    enrichSelectedBook()
}

function captureDom() {
    dom.bookMeta = document.getElementById('book-meta')
    dom.libraryList = document.getElementById('library-list')
    dom.libraryCount = document.getElementById('library-count')
    dom.themeToggle = document.getElementById('theme-toggle')
    dom.statusSelect = document.getElementById('status-select')
    dom.progressRange = document.getElementById('progress-range')
    dom.progressLabel = document.getElementById('progress-label')
    dom.btnToggleList = document.getElementById('btn-toggle-list')
    dom.btnFavorite = document.getElementById('btn-favorite')
    dom.notesInput = document.getElementById('notes-input')
    dom.btnSaveNotes = document.getElementById('btn-save-notes')
    dom.highlightInput = document.getElementById('highlight-input')
    dom.btnAddHighlight = document.getElementById('btn-add-highlight')
    dom.highlightsList = document.getElementById('highlights-list')
    dom.readerContent = document.getElementById('reader-content')
    dom.btnOpenLibrary = document.getElementById('btn-open-library')
    dom.btnCloseLibrary = document.getElementById('btn-close-library')
    dom.libraryBackdrop = document.getElementById('library-backdrop')
    dom.fontMinus = document.getElementById('font-minus')
    dom.fontPlus = document.getElementById('font-plus')
    dom.btnPrevPage = document.getElementById('btn-prev-page')
    dom.btnNextPage = document.getElementById('btn-next-page')
    dom.btnFullscreen = document.getElementById('btn-fullscreen')
    dom.pageIndicator = document.getElementById('page-indicator')
    dom.readerStage = document.getElementById('reader-stage')
}

async function recuperarLivroAusente(bookId) {
    const local = await recuperarLivroDoFallback(bookId)
    if (local) {
        upsertBook(local)
        return
    }

    if (!String(bookId).startsWith('/works/')) {
        return
    }

    try {
        const data = await fetchJsonWithTimeout(`https://openlibrary.org${bookId}.json`, null)
        if (!data?.title) {
            return
        }

        upsertBook(mapApiItemToBook(data, bookId))
    } catch (error) {
        console.error('Falha ao recuperar livro ausente:', error)
    }
}

async function recuperarLivroDoFallback(bookId) {
    try {
        const response = await fetch('/data/livros_fallback.json')
        const data = await response.json()
        const item = (data?.docs || []).find((doc) => doc.key === bookId)
        return item ? mapApiItemToBook(item, item.key) : null
    } catch (error) {
        console.error('Falha ao recuperar fallback local do leitor:', error)
        return null
    }
}

async function fetchJsonWithTimeout(url, fallbackValue = null) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 7000)

    try {
        const response = await fetch(url, { signal: controller.signal })
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`)
        }
        return await response.json()
    } catch (error) {
        console.error('Falha de rede no leitor:', error.message)
        return fallbackValue
    } finally {
        clearTimeout(timeoutId)
    }
}

function mapApiItemToBook(item, forcedId = null) {
    const titulo = String(item?.title || 'Livro').trim()
    const autor =
        item?.author_name?.[0] ||
        item?.authors?.[0]?.name ||
        item?.by_statement ||
        'Autor desconhecido'

    const coverEdition = item?.cover_edition_key || item?.edition_key?.[0]
    const coverId = item?.cover_i || item?.covers?.[0] || item?.cover_id

    return {
        id: forcedId || item?.key || `${titulo}-${autor}`,
        titulo,
        autor,
        descricao:
            typeof item?.description === 'string'
                ? item.description
                : item?.description?.value || '',
        assuntos: Array.isArray(item?.subjects)
            ? item.subjects.slice(0, 8)
            : Array.isArray(item?.subject)
                ? item.subject.slice(0, 8)
                : [],
        ano: item?.first_publish_year || item?.created?.value?.slice?.(0, 4) || null,
        idioma: item?.language?.[0] || 'pt',
        paginas: item?.number_of_pages || item?.number_of_pages_median || 40,
        capaUrl: coverEdition
            ? `https://covers.openlibrary.org/b/olid/${coverEdition}-M.jpg`
            : coverId
                ? `https://covers.openlibrary.org/b/id/${coverId}-M.jpg`
                : null
    }
}

function bindEvents() {
    dom.btnOpenLibrary?.addEventListener('click', () => {
        setLibraryOpen(!document.body.classList.contains('library-open'))
    })

    dom.btnCloseLibrary?.addEventListener('click', () => {
        setLibraryOpen(false)
    })

    dom.libraryBackdrop?.addEventListener('click', () => {
        setLibraryOpen(false)
    })

    dom.themeToggle?.addEventListener('click', () => {
        alternarTema()
    })

    dom.statusSelect?.addEventListener('change', () => {
        patchCurrentBook((book) => ({ ...book, status: dom.statusSelect.value }))
    })

    dom.progressRange?.addEventListener('input', () => {
        const targetPage = Number(dom.progressRange.value)
        irParaPagina(targetPage)
    })

    dom.btnToggleList?.addEventListener('click', () => {
        const state = loadReaderState()
        const book = state.books?.[selectedBookId]
        if (!book) {
            return
        }

        if (book.inMyList === false) {
            patchCurrentBook((current) => ({ ...current, inMyList: true }))
        } else {
            removeBookFromMyList(selectedBookId)
        }

        renderAll(loadReaderState())
    })

    dom.btnFavorite?.addEventListener('click', () => {
        patchCurrentBook((book) => ({ ...book, favorite: !book.favorite }))
    })

    dom.btnSaveNotes?.addEventListener('click', () => {
        patchCurrentBook((book) => ({ ...book, notes: dom.notesInput.value.trim() }))
    })

    dom.btnAddHighlight?.addEventListener('click', () => {
        const quote = dom.highlightInput.value.trim()
        if (!quote) {
            return
        }

        patchCurrentBook((book) => {
            const highlights = Array.isArray(book.highlights) ? [...book.highlights] : []
            highlights.unshift({
                id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
                text: quote,
                createdAt: new Date().toISOString()
            })
            return { ...book, highlights: highlights.slice(0, 40) }
        })

        dom.highlightInput.value = ''
    })

    dom.fontMinus?.addEventListener('click', () => {
        readerFontSize = Math.max(15, readerFontSize - 1)
        applyReaderFontSize()
    })

    dom.fontPlus?.addEventListener('click', () => {
        readerFontSize = Math.min(28, readerFontSize + 1)
        applyReaderFontSize()
    })

    dom.btnPrevPage?.addEventListener('click', () => {
        const state = loadReaderState()
        const book = state.books?.[selectedBookId]
        if (!book) {
            return
        }
        irParaPagina((book.currentPage || 1) - 1)
    })

    dom.btnNextPage?.addEventListener('click', () => {
        const state = loadReaderState()
        const book = state.books?.[selectedBookId]
        if (!book) {
            return
        }
        irParaPagina((book.currentPage || 1) + 1)
    })

    dom.btnFullscreen?.addEventListener('click', async () => {
        await alternarTelaCheia()
    })

    document.addEventListener('fullscreenchange', atualizarEstadoTelaCheia)
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            setLibraryOpen(false)
        }
    })

    atualizarIconeTema()
    atualizarEstadoTelaCheia()
    setLibraryOpen(false)
}

function patchCurrentBook(updater) {
    if (!selectedBookId) {
        return
    }

    updateBookById(selectedBookId, updater)
    renderAll(loadReaderState())
}

function renderAll(state) {
    const rawBook = state.books?.[selectedBookId]
    const book = hydrateBookForReading(rawBook)
    if (!book) {
        renderNoBook()
        renderLibrary(state)
        return
    }

    renderBookMeta(book)
    renderControls(book)
    renderHighlights(book)
    renderReader(book)
    renderLibrary(state)
}

function renderNoBook() {
    dom.bookMeta.innerHTML = `
        <div class="empty-state">
            <h2>Nenhum livro selecionado</h2>
            <p>Escolha um livro na home para abrir os detalhes aqui.</p>
            <a class="primary-btn" href="/home">Ir para home</a>
        </div>
    `
    dom.readerContent.innerHTML = ''
    dom.highlightsList.innerHTML = ''
    if (dom.pageIndicator) {
        dom.pageIndicator.textContent = 'Pagina 0 de 0'
    }
}

function renderBookMeta(book) {
    const badges = [
        book.ano ? `Ano: ${book.ano}` : null,
        book.paginas ? `Paginas: ${book.paginas}` : null,
        book.idioma ? `Idioma: ${String(book.idioma).toUpperCase()}` : null,
        book.isbn ? `ISBN: ${book.isbn}` : null
    ].filter(Boolean)

    const subjects = Array.isArray(book.assuntos) ? book.assuntos.slice(0, 3) : []
    const description = resumirTexto(
        limparTextoLivro(book.descricao),
        220
    ) || 'Sem descricao disponivel para este titulo no momento.'

    dom.bookMeta.innerHTML = `
        <div class="cover-area">
            ${book.capaUrl ? `<img src="${book.capaUrl}" alt="Capa de ${escapeHtml(book.titulo)}">` : '<div class="cover-empty">Sem capa</div>'}
        </div>
        <div>
            <h2 class="meta-title">${escapeHtml(book.titulo)}</h2>
            <p class="meta-author">${escapeHtml(book.autor || 'Autor desconhecido')}</p>
            <div class="meta-badges">
                ${badges.map((badge) => `<span>${escapeHtml(badge)}</span>`).join('')}
                ${book.favorite ? '<span>Favorito</span>' : ''}
            </div>
            <p class="meta-description">${escapeHtml(description)}</p>
            <div class="meta-badges">
                ${subjects.map((subject) => `<span>${escapeHtml(subject)}</span>`).join('')}
            </div>
        </div>
    `
}

function renderControls(book) {
    dom.statusSelect.value = book.status || 'quero-ler'
    dom.progressRange.min = '1'
    dom.progressRange.max = String(book.readerPages.length)
    dom.progressRange.value = String(book.currentPage || 1)
    dom.progressLabel.textContent = `${Number(book.readingProgress || 0)}% concluido`

    dom.btnToggleList.textContent = book.inMyList === false
        ? 'Adicionar a minha lista'
        : 'Remover da minha lista'

    dom.btnFavorite.textContent = book.favorite ? 'Remover favorito' : 'Favoritar'
    dom.notesInput.value = book.notes || ''

    if (dom.pageIndicator) {
        dom.pageIndicator.textContent = `Pagina ${book.currentPage || 1} de ${book.readerPages.length}`
    }
}

function renderHighlights(book) {
    const highlights = Array.isArray(book.highlights) ? book.highlights : []

    dom.highlightsList.innerHTML = ''
    if (!highlights.length) {
        dom.highlightsList.innerHTML = '<li>Nenhum destaque salvo.</li>'
        return
    }

    highlights.forEach((item) => {
        const li = document.createElement('li')
        li.innerHTML = `<span>${escapeHtml(item.text)}</span>`

        const removeBtn = document.createElement('button')
        removeBtn.type = 'button'
        removeBtn.className = 'highlight-remove'
        removeBtn.textContent = 'x'
        removeBtn.addEventListener('click', () => {
            patchCurrentBook((bookToUpdate) => {
                const nextHighlights = (bookToUpdate.highlights || []).filter((h) => h.id !== item.id)
                return { ...bookToUpdate, highlights: nextHighlights }
            })
        })

        li.appendChild(removeBtn)
        dom.highlightsList.appendChild(li)
    })
}

function renderReader(book) {
    const currentPage = Math.min(Math.max(book.currentPage || 1, 1), book.readerPages.length)
    const pageText = book.readerPages[currentPage - 1] || 'Conteudo indisponivel para esta pagina.'
    const paragrafos = formatarPaginaLeitura(pageText)

    dom.readerContent.innerHTML = paragrafos
        .map((paragrafo) => `<p>${escapeHtml(paragrafo)}</p>`)
        .join('')

    applyReaderFontSize()
}

function renderLibrary(state) {
    const order = Array.isArray(state.listOrder) ? state.listOrder : []
    const entries = order
        .map((id) => state.books?.[id])
        .filter((book) => Boolean(book) && book.inMyList !== false)

    dom.libraryCount.textContent = String(getMyLibraryCount(state))
    dom.libraryList.innerHTML = ''

    if (!entries.length) {
        dom.libraryList.innerHTML = '<p class="muted">Sua lista esta vazia.</p>'
        return
    }

    entries.forEach((book) => {
        const item = document.createElement('button')
        item.type = 'button'
        item.className = `library-item${book.id === selectedBookId ? ' active' : ''}`

        const thumb = book.capaUrl
            ? `<img src="${book.capaUrl}" alt="Capa de ${escapeHtml(book.titulo)}">`
            : '<div class="library-thumb-fallback">Livro</div>'

        item.innerHTML = `
            ${thumb}
            <span>
                <p class="library-title">${escapeHtml(book.titulo)}</p>
                <p class="library-author">${escapeHtml(book.autor || 'Autor desconhecido')}</p>
            </span>
        `

        item.addEventListener('click', () => {
            selectedBookId = book.id
            setSelectedBook(book.id)
            history.replaceState({}, '', `/book?id=${encodeURIComponent(book.id)}`)
            renderAll(loadReaderState())
            setLibraryOpen(false)
        })

        dom.libraryList.appendChild(item)
    })
}

async function enrichSelectedBook() {
    const state = loadReaderState()
    const selected = state.books?.[selectedBookId]
    if (!selected) {
        return
    }

    const workKey = selected.id?.startsWith('/works/') ? selected.id : null
    if (!workKey) {
        return
    }

    try {
        const response = await fetch(`https://openlibrary.org${workKey}.json`)
        if (!response.ok) {
            return
        }

        const data = await response.json()
        const description = limparTextoLivro(
            typeof data?.description === 'string'
                ? data.description
                : data?.description?.value || selected.descricao
        )

        const subjects = Array.isArray(data?.subjects)
            ? data.subjects.slice(0, 8)
            : selected.assuntos || []

        upsertBook({
            ...selected,
            descricao: description || selected.descricao,
            assuntos: subjects,
            paginas: selected.paginas || data?.number_of_pages || null
        })

        renderAll(loadReaderState())
    } catch (error) {
        console.error('Falha ao enriquecer dados do livro:', error)
    }
}

function buildReaderParagraphs(book) {
    const base = (book.descricao || '').trim()
    const subjectLine = Array.isArray(book.assuntos) && book.assuntos.length
        ? `Temas centrais: ${book.assuntos.slice(0, 4).join(', ')}.`
        : 'Uma obra com potencial para leitura fluida e reflexiva.'

    const opening = base || `Voce abriu ${book.titulo}, de ${book.autor}. Esta e uma previa de leitura para acompanhar seu progresso.`

    return [
        opening,
        subjectLine,
        'Use as anotacoes e destaques para marcar ideias importantes durante a leitura.',
        'O progresso fica salvo automaticamente para voce continuar de onde parou.',
        'A experiencia acima simula um leitor digital com foco em conforto visual e organizacao da sua biblioteca.'
    ]
}

function hydrateBookForReading(book) {
    if (!book) {
        return null
    }

    const desiredPages = limitarPaginas(book.paginas)
    const needsRefresh = book.readerContentVersion !== READER_CONTENT_VERSION
    const existingPages = Array.isArray(book.readerPages) ? book.readerPages.filter(Boolean) : []
    const readerPages = existingPages.length && !needsRefresh
        ? existingPages
        : gerarPaginasLivro(book, desiredPages)
    const currentPage = limitarNumero(book.currentPage || 1, 1, readerPages.length)
    const readingProgress = Math.round((currentPage / readerPages.length) * 100)

    const changed =
        needsRefresh ||
        !existingPages.length ||
        book.currentPage !== currentPage ||
        Number(book.readingProgress || 0) !== readingProgress ||
        Number(book.paginas || 0) !== readerPages.length

    if (changed && selectedBookId) {
        updateBookById(selectedBookId, (current) => ({
            ...current,
            readerPages,
            readerContentVersion: READER_CONTENT_VERSION,
            currentPage,
            paginas: readerPages.length,
            readingProgress
        }))
    }

    return {
        ...book,
        readerPages,
        currentPage,
        paginas: readerPages.length,
        readingProgress
    }
}

function gerarPaginasLivro(book, totalPages) {
    const corpus = gerarCorpusLivro(book, totalPages)
    const blocoTamanho = Math.max(280, Math.floor(corpus.length / totalPages))
    const pages = []

    for (let i = 0; i < totalPages; i += 1) {
        const start = i * blocoTamanho
        const end = i === totalPages - 1 ? corpus.length : (i + 1) * blocoTamanho
        const trecho = corpus.slice(start, end).trim()
        pages.push(`Pagina ${i + 1}. ${trecho || 'Continua na proxima pagina.'}`)
    }

    return pages
}

function gerarCorpusLivro(book, totalPages) {
    const descricaoBase = resumirTexto(
        limparTextoLivro(book.descricao),
        260
    ) || 'Uma historia envolvente, com personagens marcantes e conflitos que evoluem ao longo da narrativa.'

    const assuntos = Array.isArray(book.assuntos) && book.assuntos.length
        ? book.assuntos
        : ['literatura', 'personagens', 'enredo']

    const conectores = ['Enquanto isso', 'Em seguida', 'No mesmo instante', 'Ao longo da jornada', 'Com o passar do tempo']
    const focos = ['ambiente', 'conflito interno', 'decisao dificil', 'relacao entre personagens', 'virada narrativa']
    const tons = ['intenso', 'reflexivo', 'dramatico', 'sensivel', 'surpreendente']

    const blocos = []
    for (let i = 0; i < totalPages; i += 1) {
        const conector = conectores[i % conectores.length]
        const foco = focos[i % focos.length]
        const tom = tons[i % tons.length]
        const assunto = assuntos[i % assuntos.length]

        blocos.push(
            `${conector}, ${book.titulo} desenvolve um momento de ${foco} com tom ${tom}. ` +
            `Nesta parte, o tema ${assunto} ganha destaque e aprofunda a experiencia de leitura. ` +
            `${descricaoBase}`
        )
    }

    return blocos.join(' ')
}

function irParaPagina(targetPage) {
    const state = loadReaderState()
    const book = state.books?.[selectedBookId]
    if (!book) {
        return
    }

    const total = Array.isArray(book.readerPages) && book.readerPages.length
        ? book.readerPages.length
        : limitarPaginas(book.paginas)

    const nextPage = limitarNumero(targetPage, 1, total)
    const progress = Math.round((nextPage / total) * 100)

    patchCurrentBook((current) => ({
        ...current,
        currentPage: nextPage,
        paginas: total,
        readingProgress: progress,
        status: nextPage >= total ? 'concluido' : (current.status === 'quero-ler' ? 'lendo' : current.status)
    }))
}

function limitarPaginas(value) {
    const num = Number(value)
    if (!Number.isFinite(num) || num <= 0) {
        return 40
    }
    return limitarNumero(Math.round(num), 12, 900)
}

function limitarNumero(value, min, max) {
    return Math.min(Math.max(Number(value), min), max)
}

function applyReaderFontSize() {
    dom.readerContent?.style.setProperty('--reader-size', `${readerFontSize}px`)
}

function alternarTema() {
    const atual = document.body.dataset.theme || 'sepia'
    const indexAtual = THEMES.indexOf(atual)
    const proximo = THEMES[(indexAtual + 1) % THEMES.length]
    document.body.dataset.theme = proximo
    atualizarIconeTema()
}

function atualizarIconeTema() {
    if (!dom.themeToggle) {
        return
    }

    const tema = document.body.dataset.theme || 'sepia'
    const labels = {
        sepia: 'Tema sepia',
        light: 'Tema claro',
        dark: 'Tema escuro'
    }

    dom.themeToggle.title = labels[tema] || 'Alternar tema'
    dom.themeToggle.setAttribute('aria-label', `${labels[tema] || 'Tema'} - clicar para alternar`)
}

async function alternarTelaCheia() {
    if (!dom.readerStage) {
        return
    }

    try {
        if (!document.fullscreenElement) {
            await dom.readerStage.requestFullscreen()
        } else {
            await document.exitFullscreen()
        }
    } catch (error) {
        console.error('Falha ao alternar tela cheia:', error)
    }
}

function atualizarEstadoTelaCheia() {
    if (!dom.btnFullscreen) {
        return
    }

    const ativo = Boolean(document.fullscreenElement)
    dom.btnFullscreen.textContent = ativo ? 'Sair da tela cheia' : 'Tela cheia'
}

function formatarPaginaLeitura(texto) {
    const limpo = limparTextoLivro(texto)
    const frases = limpo.split(/(?<=[.!?])\s+/).filter(Boolean)
    const paragrafos = []

    for (let i = 0; i < frases.length; i += 2) {
        const bloco = [frases[i], frases[i + 1]].filter(Boolean).join(' ')
        if (bloco) {
            paragrafos.push(bloco)
        }
    }

    return paragrafos.length ? paragrafos : [limpo]
}

function setLibraryOpen(open) {
    document.body.classList.toggle('library-open', open)
    if (dom.btnOpenLibrary) {
        dom.btnOpenLibrary.setAttribute('aria-expanded', open ? 'true' : 'false')
    }
}

function escapeHtml(value) {
    return String(value)
        .replaceAll('&', '&amp;')
        .replaceAll('<', '&lt;')
        .replaceAll('>', '&gt;')
        .replaceAll('"', '&quot;')
        .replaceAll("'", '&#39;')
}

function limparTextoLivro(texto) {
    if (!texto || typeof texto !== 'string') return ''
    return texto
        .replace(/\r\n/g, ' ')
        .replace(/\n/g, ' ')
        .replace(/\s{2,}/g, ' ')
        .trim()
}

function resumirTexto(texto, limite) {
    if (!texto || typeof texto !== 'string') return ''
    if (texto.length <= limite) return texto
    const corte = texto.lastIndexOf(' ', limite)
    return texto.slice(0, corte > limite - 20 ? corte : limite).trim() + '...'
}
