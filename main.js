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

// Toggle FAQ visibility
document
  .getElementById("toggle-faq-btn")
  .addEventListener("click", function () {
    const faqContainer = document.getElementById("faq-container");
    const toggleBtn = document.getElementById("toggle-faq-btn");

    if (faqContainer.classList.contains("show-faq")) {
      // Hide additional FAQs
      faqContainer.classList.remove("show-faq");
      toggleBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                    See More FAQ Questions
                `;
    } else {
      // Show additional FAQs
      faqContainer.classList.add("show-faq");
      toggleBtn.innerHTML = `
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                    </svg>
                    See Less FAQ Questions
                `;
    }
  });
document.getElementById("year").textContent = new Date().getFullYear();
