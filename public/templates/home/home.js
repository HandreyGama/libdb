import html from '../home/login.html?raw';
import '../home/login.css'
export function loadHome() {
  document.body.innerHTML = html;
}