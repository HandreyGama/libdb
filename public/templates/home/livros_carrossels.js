import { pegar_livros_por_autor, pegar_capa_livro } from "../../src/modules/api.js"



document.addEventListener('DOMContentLoaded',async () =>{
    const data = await carregarAutores()
    data.autores.forEach(async element => {
        await gerar_carrossel_autores(element)
    });
})

async function gerar_carrossel_autores(autor) {

    const div_carrossels = document.getElementById('livros-carossels')

    const carrossel_autor = document.createElement("div")
    const carrossel_autor_livros = document.createElement("div")
    const titulo_autor = document.createElement("h1")
    titulo_autor.innerText = autor
    const btnPrev = document.createElement("button")
    const btnNext = document.createElement("button")

    carrossel_autor.classList.add("carrossel-autor")
    carrossel_autor_livros.classList.add("autor-carrossel-livros")

    btnPrev.classList.add("livros-carrossel-button")
    btnNext.classList.add("livros-carrossel-button")

    btnPrev.innerText = "<"
    btnNext.innerText = ">"

    const livros_autor = await pegar_livros_por_autor(autor)
    const lista_livros = livros_autor.docs

    for (const element of lista_livros) {
        if (!element.cover_edition_key) continue;

        const card_livros = document.createElement("div")

        const link_capa_livro = pegar_capa_livro(element.cover_edition_key)

        card_livros.innerHTML = `
            <h3 class="livros-cards">${element.title}</h3>
            <img class="livro-capa" src="${link_capa_livro}" alt="">
        `

        carrossel_autor_livros.appendChild(card_livros)
    }

    div_carrossels.append(titulo_autor)
    carrossel_autor.appendChild(btnPrev)
    carrossel_autor.appendChild(carrossel_autor_livros)
    carrossel_autor.appendChild(btnNext)

    div_carrossels.appendChild(carrossel_autor)

    const livros = carrossel_autor_livros.querySelectorAll('.livro-capa')

    let currentBook = 0;
    let livro_em_foco = livros[currentBook]

    function centralizarItem(item) {
        const itemCenter = item.offsetLeft + item.offsetWidth / 2
        const containerCenter = carrossel_autor_livros.offsetWidth / 2

        const scrollPara = itemCenter - containerCenter

        carrossel_autor_livros.scrollTo({
            left: scrollPara,
            behavior: 'smooth'
        })
    }

    btnNext.addEventListener('click', () => {
        if (livro_em_foco) {
            livro_em_foco.classList.remove('on')
        }

        currentBook++
        if (currentBook >= livros.length) currentBook = livros.length - 1

        livro_em_foco = livros[currentBook]
        livro_em_foco.classList.add('on')

        centralizarItem(livro_em_foco)
    })


    btnPrev.addEventListener('click', () => {
        if (livro_em_foco) {
            livro_em_foco.classList.remove('on')
        }

        currentBook--
        if (currentBook < 0) currentBook = 0

        livro_em_foco = livros[currentBook]
        livro_em_foco.classList.add('on')

        centralizarItem(livro_em_foco)
    })
}
async function carregarAutores() {
    const res = await fetch('/data/autores.json')
    return await res.json()
}