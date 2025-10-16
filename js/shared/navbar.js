// // Add scroll effect to navigation
window.addEventListener('scroll', function() {
  const nav = document.querySelector('nav');
  if (window.scrollY > 500) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
});

