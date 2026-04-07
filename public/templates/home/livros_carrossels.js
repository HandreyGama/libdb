import { pegar_livros_por_autor, pegar_capa_livro } from "../../src/modules/api.js"

document.addEventListener('DOMContentLoaded',async () =>{
    const div_carrossels = document.getElementById('livros-carossels')
    const div_livros_autores = document.getElementById('livros-autores')
    const livros_tolkien = await pegar_livros_por_autor('colleen-hoover')
    const titulo_autor = document.getElementById("livros-autor")
    titulo_autor.innerText = "colleen hoover"
    const lista_livros = livros_tolkien.docs
    
    for (const element of lista_livros) {
        if (!element.cover_edition_key) continue;
        const card_livros = document.createElement("div")
        const cover_edition_key = element.cover_edition_key
        const link_capa_livro = pegar_capa_livro(cover_edition_key)
        console.log(link_capa_livro)
        card_livros.innerHTML = `
        <h3 class="livros-cards"> ${element.title} </h3>
        <img src="${link_capa_livro}" alt="">
        `
        div_carrossels.appendChild(card_livros)
    };
})