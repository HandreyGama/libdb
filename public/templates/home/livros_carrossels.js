import { pegar_livros_por_autor, pegar_capa_livro } from "../../src/modules/api.js"

document.addEventListener('DOMContentLoaded',async () =>{
    const div_carrossels = document.getElementById('livros-carossels')
    const div_livros_autores = document.getElementById('livros-autores')
    const livros_tolkien = await pegar_livros_por_autor('tolkien')
    const titulo_autor = document.getElementById("livros-autor")
    const btnPrev = document.getElementById("livros-carrossel-button-left")
    const btnNext = document.getElementById("livros-carrossel-button-right")
    let currentBook = 0;
    titulo_autor.innerText = "tolkien"
    const lista_livros = livros_tolkien.docs
    
    for (const element of lista_livros) {
        if (!element.cover_edition_key) continue;
        const card_livros = document.createElement("div")
        const cover_edition_key = element.cover_edition_key
        const link_capa_livro = pegar_capa_livro(cover_edition_key)
        console.log(link_capa_livro)
        card_livros.innerHTML = `
        <h3 class="livros-cards"> ${element.title} </h3>
        <img class="livro-capa" src="${link_capa_livro}" alt="">
        `
        div_carrossels.appendChild(card_livros)
    };
    const livros = document.querySelectorAll('.livro-capa')
    let livro_em_foco = livros[currentBook]
    function centralizarItem(item) {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2
        const containerCenter = div_carrossels.offsetWidth / 2

        let scrollPara = itemCenter - containerCenter
        div_carrossels.scrollTo({
            left: scrollPara,
            behavior: 'smooth'
        })
    }
    btnNext.addEventListener('click',() =>{
        if(livro_em_foco){
            livro_em_foco.classList.remove('on')
        }
 
        currentBook += 1;
        if (currentBook >= livros.length) currentBook = livros.length - 1
        livro_em_foco = livros[currentBook]
        livro_em_foco.classList.add('on')
        centralizarItem(livro_em_foco)
    })

        btnPrev.addEventListener('click',() =>{
        if(livro_em_foco){
            livro_em_foco.classList.remove('on')
        }
        currentBook -= 1;
        if (currentBook < 0) currentBook = 0
        livro_em_foco = livros[currentBook] 
        livro_em_foco.classList.add('on')
        centralizarItem(livro_em_foco)
    })
})