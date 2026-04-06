import html from './home.html?raw';
import './home.css';

export function loadHome(){
    document.body.innerHTML = html;
}