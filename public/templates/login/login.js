import html from './login.html?raw';
import './login.css';
import anime from 'animejs/lib/anime.es.js';

export function loadLogin() {
  document.body.innerHTML = html;

  anime({
    targets: "#login",
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 800,
    easing: 'easeOutQuad'
  });
}