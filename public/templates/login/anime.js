import anime from 'https://cdn.jsdelivr.net/npm/animejs@3.2.1/lib/anime.es.js';
  
  

anime({
    targets: "#login",
    opacity: [0, 1],
    translateY: [50, 0],
    duration: 800,
    easing: 'easeOutQuad'
  });
