const OPEN_LIBRARY_URL = 'https://openlibrary.org/'
const FETCH_TIMEOUT_MS = 7000

async function fetchJsonWithTimeout(url, fallbackData) {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS)

    try {
        const response = await fetch(url, {
            signal: controller.signal,
            headers: { Accept: 'application/json' }
        })

        if (!response.ok) {
            throw new Error('ERRO NA REDE: ' + response.status)
        }

        return await response.json()
    } catch (error) {
        console.log('Falha ao buscar livros:', error.message)
        return fallbackData
    } finally {
        clearTimeout(timeoutId)
    }
}

export async function pegar_livros_por_titulo(titulo){
    const query = OPEN_LIBRARY_URL + 'search.json?title=' + encodeURIComponent(titulo)
    return await fetchJsonWithTimeout(query, { docs: [] })
}

export async function pegar_livros_por_autor(autor){
    const query = OPEN_LIBRARY_URL + 'search.json?author=' + encodeURIComponent(autor)
    return await fetchJsonWithTimeout(query, { docs: [] })
}

export async function pegar_livros_por_tema(tema){
    const query = OPEN_LIBRARY_URL + 'subjects/' + encodeURIComponent(tema) + '.json'
    return await fetchJsonWithTimeout(query, { works: [] })
}


export async function pegar_codigo_isbn(code){
    if (!code) return null;
    const url = `https://openlibrary.org/books/${code}.json`
    const res = await fetch(url)
    const edicao = await res.json();
    return edicao.isbn_13?.[0] || edicao.isbn_10?.[0] || null;
}

export  function pegar_capa_livro(cover_edition_key){
    if (!cover_edition_key) return null;
    const url = `https://covers.openlibrary.org/b/olid/${cover_edition_key}-M.jpg`
    
    return url
}