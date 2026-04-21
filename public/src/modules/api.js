const OPEN_LIBRARY_URL = 'https://openlibrary.org/'


export async function pegar_livros_por_titulo(titulo){
    const query = OPEN_LIBRARY_URL + "search.json" + "?title=" + encodeURIComponent(titulo)
    console.log(query)
    try{
        const response = await fetch(query)

        if(!response.ok){
            throw new Error("ERRO NA REDE: " + response.status)
        }

        const data = await response.json()
        return data

    } catch(error){
        console.log(error.message)
    }

}
export async function pegar_livros_por_autor(autor){
    const query = OPEN_LIBRARY_URL + "search.json" + "?author=" + encodeURIComponent(autor)
    console.log(query)
    try{
        const response = await fetch(query)

        if(!response.ok){
            throw new Error("ERRO NA REDE: " + response.status)
        }

        const data = await response.json()
        return data

    } catch(error){
        console.log(error.message)
    }

}

export async function pegar_livros_por_tema(tema){
    const query = OPEN_LIBRARY_URL + "subjects" + "/" + tema + " .json"
    console.log(query)
    try{
        const response = await fetch(query)

        if(!response.ok){
            throw new Error("ERRO NA REDE: " + response.status)
        }

        const data = await response.json()
        return data

    } catch(error){
        console.log(error.message)
    }

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