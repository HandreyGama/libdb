const STORAGE_KEY = 'libdb_reader_state_v1'

export function getInitialReaderState() {
    return {
        selectedBookId: null,
        books: {},
        listOrder: []
    }
}

export function loadReaderState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY)
        if (!raw) {
            return getInitialReaderState()
        }

        const parsed = JSON.parse(raw)
        return {
            selectedBookId: parsed?.selectedBookId || null,
            books: parsed?.books || {},
            listOrder: Array.isArray(parsed?.listOrder) ? parsed.listOrder : []
        }
    } catch (error) {
        console.error('Falha ao carregar estado do leitor:', error)
        return getInitialReaderState()
    }
}

export function saveReaderState(state) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function upsertBook(book) {
    return addBookToMyList(book, true)
}

export function addBookToMyList(book, selectBook = false) {
    const state = loadReaderState()
    const current = state.books?.[book.id] || {}
    const merged = {
        ...current,
        ...book,
        readingProgress: Number(current.readingProgress || 0),
        inMyList: current.inMyList ?? true,
        favorite: current.favorite ?? false,
        status: current.status || 'quero-ler',
        notes: current.notes || '',
        highlights: Array.isArray(current.highlights) ? current.highlights : [],
        updatedAt: new Date().toISOString()
    }

    const books = {
        ...(state.books || {}),
        [book.id]: merged
    }

    const listOrder = Array.isArray(state.listOrder) ? [...state.listOrder] : []
    if (!listOrder.includes(book.id)) {
        listOrder.unshift(book.id)
    }

    const nextState = {
        ...state,
        selectedBookId: selectBook ? book.id : (state.selectedBookId || null),
        books,
        listOrder
    }

    saveReaderState(nextState)
    return nextState
}

export function getMyLibraryBooks(state = loadReaderState()) {
    return (state.listOrder || [])
        .map((id) => state.books?.[id])
        .filter((book) => Boolean(book) && book.inMyList !== false)
}

export function getMyLibraryCount(state = loadReaderState()) {
    return getMyLibraryBooks(state).length
}

export function updateBookById(bookId, updater) {
    const state = loadReaderState()
    const base = state.books?.[bookId]
    if (!base) {
        return state
    }

    const nextBook = updater(base)
    const nextState = {
        ...state,
        books: {
            ...state.books,
            [bookId]: {
                ...nextBook,
                updatedAt: new Date().toISOString()
            }
        }
    }

    saveReaderState(nextState)
    return nextState
}

export function setSelectedBook(bookId) {
    const state = loadReaderState()
    const nextState = {
        ...state,
        selectedBookId: bookId
    }
    saveReaderState(nextState)
    return nextState
}

export function removeBookFromMyList(bookId) {
    const state = loadReaderState()
    const book = state.books?.[bookId]
    if (!book) {
        return state
    }

    const nextState = {
        ...state,
        books: {
            ...state.books,
            [bookId]: {
                ...book,
                inMyList: false,
                updatedAt: new Date().toISOString()
            }
        },
        listOrder: state.listOrder.filter((id) => id !== bookId)
    }

    saveReaderState(nextState)
    return nextState
}
