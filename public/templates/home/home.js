import html from '../home/login.html?raw';
import '../home/login.css';
import anime from 'animejs/lib/anime.es.js';

export function loadHome() {
  document.body.innerHTML = html;

  anime({
    targets: "#login",
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 800,
    easing: 'easeOutQuad'
  });
}