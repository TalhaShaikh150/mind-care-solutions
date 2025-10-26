function toggleFAQ(element) {
  // Close all other FAQs
  document.querySelectorAll(".faq-item").forEach((item) => {
    if (item !== element) {
      item.classList.remove("active");
    }
  });

  // Toggle current FAQ
  element.classList.toggle("active");
}

// Optional: Auto-open first FAQ
document.addEventListener("DOMContentLoaded", function () {
  const firstFAQ = document.querySelector(".faq-item");
  if (firstFAQ) {
    firstFAQ.classList.add("active");
  }
});
