// // // Add scroll effect to navigation
// window.addEventListener('scroll', function() {
//   const nav = document.querySelector('nav');
//   if (window.scrollY > 500) {
//     nav.classList.add('scrolled');
//   } else {
//     nav.classList.remove('scrolled');
//   }
// });

// Mobile menu functionality
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
const body = document.body;

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('active');
  body.classList.toggle('menu-open');
});

// Close menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function() {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    body.classList.remove('menu-open');
  });
});

// Navigation scroll effects
let lastScrollY = window.scrollY;
const nav = document.querySelector('nav');

window.addEventListener('scroll', function() {
  const currentScrollY = window.scrollY;
  
  // Add scrolled class for background change
  if (currentScrollY > 50) {
    nav.classList.add('scrolled');
  } else {
    nav.classList.remove('scrolled');
  }
  
  lastScrollY = currentScrollY;
});

// Close menu when clicking outside on mobile
document.addEventListener('click', function(event) {
  const isClickInsideNav = nav.contains(event.target);
  if (!isClickInsideNav && navLinks.classList.contains('active')) {
    hamburger.classList.remove('active');
    navLinks.classList.remove('active');
    body.classList.remove('menu-open');
  }
});