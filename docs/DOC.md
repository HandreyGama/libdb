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

<pre class="overflow-visible! px-0!" data-start="681" data-end="704"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="w-full overflow-x-hidden overflow-y-auto"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span class="ͼs">npm</span><span> install</span></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

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

<pre class="overflow-visible! px-0!" data-start="1182" data-end="1205"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="w-full overflow-x-hidden overflow-y-auto"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span class="ͼs">npm</span><span> run dev</span></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

## 📁 Estrutura de Páginas

Todas as páginas ficam dentro da pasta:

<pre class="overflow-visible! px-0!" data-start="1281" data-end="1299"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="w-full overflow-x-hidden overflow-y-auto pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>/templates</span></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

### Criando uma nova página

1. Crie uma nova pasta dentro de `templates` com o nome da página:

<pre class="overflow-visible! px-0!" data-start="1398" data-end="1458"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="w-full overflow-x-hidden overflow-y-auto pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>/templates/login</span><br/><span>/templates/cadastro</span><br/><span>/templates/home</span></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

2. Dentro dessa pasta, crie  **3 arquivos obrigatórios** :

<pre class="overflow-visible! px-0!" data-start="1518" data-end="1582"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="w-full overflow-x-hidden overflow-y-auto pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>nome-da-pagina.html</span><br/><span>nome-da-pagina.css</span><br/><span>nome-da-pagina.js</span></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

### Exemplo:

<pre class="overflow-visible! px-0!" data-start="1598" data-end="1671"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute end-1.5 top-1 z-2 md:end-2 md:top-1"></div><div class="w-full overflow-x-hidden overflow-y-auto pe-11 pt-3"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>/templates/login/</span><br/><span>  ├── login.html</span><br/><span>  ├── login.css</span><br/><span>  └── login.js</span></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

## 🧩 Estrutura dos Arquivos

### 📄 HTML

Aqui você define a estrutura da página normalmente:

<pre class="overflow-visible! px-0!" data-start="1774" data-end="1879"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="w-full overflow-x-hidden overflow-y-auto"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span class="ͼv"><div</span><span></span><span class="ͼu">class</span><span class="ͼn">=</span><span class="ͼr">"login-container"</span><span class="ͼv">></span><br/><span></span><span class="ͼv"><h1></span><span>Login</span><span class="ͼv"></h1></span><br/><span></span><span class="ͼv"><button</span><span></span><span class="ͼu">id</span><span class="ͼn">=</span><span class="ͼr">"btnLogin"</span><span class="ͼv">></span><span>Entrar</span><span class="ͼv"></button></span><br/><span class="ͼv"></div></span></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

---

### 🎨 CSS

Aqui você define o estilo da página:

<pre class="overflow-visible! px-0!" data-start="1936" data-end="2033"><div class="relative w-full mt-4 mb-1"><div class=""><div class="relative"><div class="h-full min-h-0 min-w-0"><div class="h-full min-h-0 min-w-0"><div class="border border-token-border-light border-radius-3xl corner-superellipse/1.1 rounded-3xl"><div class="h-full w-full border-radius-3xl bg-token-bg-elevated-secondary corner-superellipse/1.1 overflow-clip rounded-3xl lxnfua_clipPathFallback"><div class="pointer-events-none absolute inset-x-4 top-12 bottom-4"><div class="pointer-events-none sticky z-40 shrink-0 z-1!"><div class="sticky bg-token-border-light"></div></div></div><div class="w-full overflow-x-hidden overflow-y-auto"><div class="relative z-0 flex max-w-full"><div id="code-block-viewer" dir="ltr" class="q9tKkq_viewer cm-editor z-10 light:cm-light dark:cm-light flex h-full w-full flex-col items-stretch ͼk ͼy"><div class="cm-scroller"><div class="cm-content q9tKkq_readonly"><span>.</span><span class="ͼs">login-container</span><span> {</span><br/><span>  display: </span><span class="ͼq">flex</span><span>;</span><br/><span>  flex-direction: </span><span class="ͼq">column</span><span>;</span><br/><span>  align-items: </span><span class="ͼq">center</span><span>;</span><br/><span>}</span></div></div></div></div></div></div></div></div></div><div class=""><div class=""></div></div></div></div></div></pre>

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
