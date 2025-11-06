// Mobile menu toggle functionality
function toggleMobileMenu() {
  const menu = document.getElementById("mobileMenu");
  const overlay = document.getElementById("overlay");

  menu.classList.toggle("open");
  overlay.classList.toggle("open");

  // Prevent body scroll when menu is open
  document.body.style.overflow = menu.classList.contains("open")
    ? "hidden"
    : "";
}

// Close menu when pressing Escape key
document.addEventListener("keydown", function (event) {
  if (event.key === "Escape") {
    const menu = document.getElementById("mobileMenu");
    const overlay = document.getElementById("overlay");

    menu.classList.remove("open");
    overlay.classList.remove("open");
    document.body.style.overflow = "";
  }
});

// Close on Esc
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const menu = document.getElementById("mobileMenu");
    if (!menu.classList.contains("hidden")) toggleMobileMenu();
  }
});

// FAQ toggle: expand/collapse with +/−
function toggleFAQ(el) {
  const ans = el.querySelector(".faq-answer");
  const icon = el.querySelector(".faq-icon span");
  const isActive = el.classList.contains("active");

  // Close all others
  document.querySelectorAll(".faq-item.active").forEach((i) => {
    if (i !== el) {
      i.classList.remove("active");
      const a = i.querySelector(".faq-answer");
      const ic = i.querySelector(".faq-icon span");
      if (a) a.style.maxHeight = "0px";
      if (ic) ic.textContent = "+";
      i.setAttribute("aria-expanded", "false");
    }
  });

  el.classList.toggle("active");
  if (!ans) return;
  ans.style.overflow = "hidden";
  ans.style.transition = "max-height .25s ease";

  if (isActive) {
    ans.style.maxHeight = "0px";
    if (icon) icon.textContent = "+";
    el.setAttribute("aria-expanded", "false");
  } else {
    ans.style.maxHeight = ans.scrollHeight + "px";
    if (icon) icon.textContent = "−";
    el.setAttribute("aria-expanded", "true");
  }
}
window.toggleFAQ = toggleFAQ;

// Show/hide extra FAQ block
function initMoreFAQ() {
  const more = document.querySelector(".hidden-faq");
  const btn = document.getElementById("toggle-faq-btn");
  if (!more || !btn) return;
  more.style.display = "none";
  btn.addEventListener("click", () => {
    const open = more.style.display !== "none";
    more.style.display = open ? "none" : "block";
    btn.innerHTML = open
      ? '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg> See More FAQ Questions'
      : '<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" /></svg> See Fewer FAQ Questions';
  });
}

// Init year, icons, and FAQ states
document.addEventListener("DOMContentLoaded", () => {
  // Year
  const y = document.getElementById("year");
  if (y) y.textContent = new Date().getFullYear();

  // Icons (lucide)
  if (window.lucide?.createIcons) {
    window.lucide.createIcons();
  } else {
    // fallback if CDN hiccups
    const s = document.createElement("script");
    s.src = "https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js";
    s.defer = true;
    s.onload = () => window.lucide?.createIcons?.();
    document.head.appendChild(s);
  }

  // Initialize FAQs collapsed
  document
    .querySelectorAll(".faq-answer")
    .forEach((el) => (el.style.maxHeight = "0px"));
  document
    .querySelectorAll(".faq-item")
    .forEach((el) => el.setAttribute("aria-expanded", "false"));

  // Init "more" FAQ
  initMoreFAQ();

  // Close menu on resize to lg+
  let lastW = window.innerWidth;
  window.addEventListener("resize", () => {
    const w = window.innerWidth;
    if (w >= 1024 && lastW < 1024) {
      const menu = document.getElementById("mobileMenu");
      if (!menu.classList.contains("hidden")) toggleMobileMenu();
    }
    lastW = w;
  });
});
