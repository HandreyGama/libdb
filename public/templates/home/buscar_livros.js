import {
    pegar_livros_por_autor,
    pegar_livros_por_tema,
    pegar_livros_por_titulo,
    pegar_capa_livro} from '../../src/modules/api'


document.addEventListener('DOMContentLoaded',() =>{
    
})


async function buscar_livro(text){
    const textbox = document.getElementById('buscar-livro')
    const query = textbox.value.trim()
    if(query.length === 0){
        window.alert("Digite um livro/autor/tema para pesquisar!")
        return 0
    }
    livros_titulo = await pegar_livros_por_titulo(text)
    livros_autor = await pegar_livros_por_autor(text)
    livros_tema = await pegar_livros_por_tema(text)
    if (livros_titulo.length !== 0){
        
    }
    if (livros_titulo.length !== 0){
        
    }
    if (livros_autor.length !== 0){
        
    }
    if (livros_tema.length !== 0){
        
    }
}