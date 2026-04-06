# 📚 LibDB - Documentação

## 🚀 Visão Geral

O **LibDB** é um projeto web que utiliza o **Vite.js** como ferramenta principal de build e desenvolvimento, rodando sobre o  **Node.js** .

O objetivo desta documentação é explicar:

* Como instalar as dependências do projeto
* Como criar uma nova página
* Como navegar entre páginas

---

## ⚙️ Instalação das Dependências

Antes de tudo, é necessário ter o **Node.js** instalado na máquina.

Depois disso, dentro da pasta do projeto, execute:

```js
npm install
```

Esse comando irá instalar todas as dependências necessárias, incluindo o  **Vite** .

* OBS: O projeto não funciona com a extensão Live Server do vscode,
  Porém, o propio Vitejs ja recarrega a pagina automaticamente apos uma mudança detectada no html ou css
  Então para testar o frontend, somente é necessario iniciar o vitejs

---

## ⚡ Sobre o Vite.js

O **Vite.js** é uma ferramenta moderna de build para projetos web.

Ele funciona basicamente de duas formas:

* Em desenvolvimento: usa ES Modules nativos do navegador (extremamente rápido)
* Em produção: faz o bundle otimizado dos arquivos

Principais vantagens:

* Hot reload muito rápido
* Menos configuração
* Melhor organização modular

Para rodar o projeto:

```js
npm run dev

```

---

## 📁 Estrutura de Páginas

Todas as páginas ficam dentro da pasta:

```js
/templates
```

### Criando uma nova página

1. Crie uma nova pasta dentro de `templates` com o nome da página:

```js
/templates/login
/templates/cadastro
/templates/home
```

2. Dentro dessa pasta, crie  **3 arquivos obrigatórios** :

```js
nome-da-pagina.html
nome-da-pagina.css
nome-da-pagina.js
```

### Exemplo:

```js
/templates/login/
  ├── login.html
  ├── login.css
  └── login.js
```

---

## 🧩 Estrutura dos Arquivos

### 📄 HTML

Aqui você define a estrutura da página normalmente:

```html
<div class="login-container">
  <h1>Login</h1>
  <button id="btnLogin">Entrar</button>
</div>
```

---

### 🎨 CSS

Aqui você define o estilo da página:

```css
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
```

---

### 🧠 JavaScript (Vite)

Esse é o arquivo mais importante.

Ele é responsável por:

* Importar o HTML
* Importar o CSS
* Renderizar a página no DOM
* Controlar interações

### ⚠️ IMPORTANTE

**O CSS NÃO é linkado no HTML.**

Em vez disso, você importa ele no JavaScript.

---

### ✅ Exemplo de `login.js`


```js
import html from './login.html?raw';
import './login.css';
import { loadHome } from '../home/home.js';

export function loadLogin() {
  document.body.innerHTML = html;

  const btn = document.getElementById('btnLogin');

  btn.addEventListener('click', () => {
    loadHome();
  });
}
```

---

## 🔄 Navegação entre páginas

A navegação é feita chamando a função da outra página.

### Exemplo:

Suponha que você quer ir da página de login para a home.

---

### 📄 `login.js`

```js
import html from './login.html?raw';
import './login.css';
import { loadHome } from '../home/home.js';

export function loadLogin() {
  document.body.innerHTML = html;

  const btn = document.getElementById('btnLogin');

  btn.addEventListener('click', () => {
    loadHome();
  });
}
```

### 📄 `home.js`

```js
import html from './home.html?raw';
import './home.css';

export function loadHome() {
  document.body.innerHTML = html;
}
```

## 🧠 Como isso funciona

Basicamente:

* Cada página é um módulo JavaScript
* O HTML é carregado como string (`?raw`)
* O CSS é injetado automaticamente pelo Vite
* A troca de páginas acontece substituindo o `document.body.innerHTML`

---

## 📌 Resumo

* Use **Node.js + Vite**
* Cada página tem sua própria pasta
* Cada página tem:
* HTML
* CSS
* JS
* CSS é importado no JS
* Navegação é feita chamando funções entre módulos
