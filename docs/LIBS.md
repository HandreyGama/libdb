📦 Bibliotecas Utilizadas

## 1️⃣ Anime.js

**Anime.js** é uma biblioteca leve para criar **animações em JavaScript** de forma fácil e fluida.

### 🔹 Para que serve

* Animar elementos no DOM (posição, opacidade, escala, rotação)
* Criar efeitos de entrada, saída ou transformações complexas
* Suporte a timelines e easings

### 🔹 Como adicionar ao projeto

#### Usando npm:

```bash
npm install animejs
```

#### Importando no seu JS:

```javascript
import anime from 'animejs/lib/anime.es.js';
```

### 🔹 Exemplo de uso

```javascript
import anime from 'animejs/lib/anime.es.js';

// Animar um botão
anime({
  targets: '#btnLogin',
  translateX: 250,
  rotate: '1turn',
  duration: 2000,
  easing: 'easeInOutQuad'
});
```

**Dica:** Anime.js funciona melhor quando o elemento já existe no DOM, então coloque dentro de funções de renderização de página, como `loadLogin()`.

---

## 2️⃣ Chart.js

**Chart.js** é uma biblioteca para criar **gráficos interativos e responsivos** usando `<canvas>`.

### 🔹 Para que serve

* Visualizar dados de forma gráfica (barras, linhas, pizza, radar, etc.)
* Criar dashboards e relatórios visuais
* Fácil customização de cores, labels e animações

### 🔹 Como adicionar ao projeto

#### Usando npm:

```bash
npm install chart.js
```

#### Importando no seu JS:

```javascript
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);
```

### 🔹 Exemplo de uso

```javascript
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

const ctx = document.getElementById('myChart').getContext('2d');

const myChart = new Chart(ctx, {
  type: 'bar', // tipo de gráfico
  data: {
    labels: ['Janeiro', 'Fevereiro', 'Março'],
    datasets: [{
      label: 'Vendas',
      data: [12, 19, 7],
      backgroundColor: ['red', 'blue', 'green']
    }]
  },
  options: {
    responsive: true
  }
});
```

**Dica:** Sempre crie um `<canvas>` no HTML para renderizar o gráfico:

```html
<canvas id="myChart" width="400" height="200"></canvas>
```

---

Se você quiser, posso já preparar um **exemplo de página completa** do LibDB usando **Vite.js** com **Anime.js** e **Chart.js** integrados, mostrando uma animação de botão que depois abre uma página com gráfico. Isso deixaria o Docs bem visual e prático.

Quer que eu faça isso?
