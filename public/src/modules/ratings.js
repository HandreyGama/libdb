

const RATINGS_STORAGE_KEY = 'libdb_ratings';

export function salvarAvaliacao(livroId, titulo, autor, estrelas, comentario = '') {
    if (estrelas < 1 || estrelas > 5) {
        return { sucesso: false, mensagem: 'Avaliação deve ser entre 1 e 5 estrelas' };
    }

    let avaliacoes = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY)) || [];

    avaliacoes = avaliacoes.filter(a => a.livroId !== livroId);
    

    avaliacoes.push({
        livroId,
        titulo,
        autor,
        estrelas,
        comentario,
        dataAvaliacao: new Date().toISOString()
    });

    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(avaliacoes));
    return { sucesso: true, mensagem: 'Avaliação salva com sucesso!' };
}

export function obterAvaliacao(livroId) {
    const avaliacoes = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY)) || [];
    return avaliacoes.find(a => a.livroId === livroId) || null;
}

export function obterTódasAvaliacoes() {
    return JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY)) || [];
}

export function excluirAvaliacao(livroId) {
    let avaliacoes = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY)) || [];
    avaliacoes = avaliacoes.filter(a => a.livroId !== livroId);
    localStorage.setItem(RATINGS_STORAGE_KEY, JSON.stringify(avaliacoes));
    return { sucesso: true, mensagem: 'Avaliação removida' };
}

export function calcularMediaAvaliacoes() {
    const avaliacoes = JSON.parse(localStorage.getItem(RATINGS_STORAGE_KEY)) || [];
    if (avaliacoes.length === 0) return 0;
    
    const soma = avaliacoes.reduce((acc, a) => acc + a.estrelas, 0);
    return (soma / avaliacoes.length).toFixed(1);
}
