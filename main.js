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

function toggleFAQ(element) {
  // Close all other FAQs
  document.querySelectorAll(".faq-item").forEach((item) => {
    if (item !== element) {
      item.classList.remove("active");
    }
  });

  // Toggle current FAQ
  element.classList.toggle("active");

  // Add event listener to close when clicking outside
  document.addEventListener("click", function handleClickOutside(event) {
    if (!element.contains(event.target)) {
      element.classList.remove("active");
      document.removeEventListener("click", handleClickOutside);
    }
  });
}
document.getElementById("year").textContent = new Date().getFullYear();
