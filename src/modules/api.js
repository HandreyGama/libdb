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
    const query = OPEN_LIBRARY_URL + "search.json" + "?author=" + encodeURIComponent(titulo)
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


export async function pegar_capa_livro(ISBN_code){
    const url = `https://covers.openlibrary.org/b/isbn/${ISBN_code}-M.jpg`
    
    try{
        const response = await fetch(url)

        if(!response.ok){
            throw new Error("ERRO NA REDE: " + response.status)
        }

        const blob = await response.blob()
        return URL.createObjectURL(blob)

    } catch(error){
        console.log(error.message)
    }

}

pegar_livros_por_tema("love").then(data => {
    console.log(data)
})