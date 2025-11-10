// Enhanced phone validation function
function isValidPhone(phone) {
  if (!phone) return false;

  // Remove all non-digit characters except + at the beginning
  const cleaned = phone.replace(/[^\d+]/g, "");

  // Check if it's empty after cleaning
  if (cleaned.length === 0) return false;

  // For North American numbers: +1 (country code) + 10 digits
  if (cleaned.startsWith("+1")) {
    return cleaned.length === 12; // +1 + 10 digits = 12 characters
  }

  // For numbers starting with 1 (without +)
  if (cleaned.startsWith("1") && cleaned.length === 11) {
    return true;
  }

  // For local numbers (10 digits without country code)
  if (cleaned.length === 10 && /^\d+$/.test(cleaned)) {
    return true;
  }

  // For international numbers (minimum 8 digits, maximum 15 digits including country code)
  if (cleaned.startsWith("+")) {
    const digitsOnly = cleaned.slice(1); // Remove the +
    return (
      digitsOnly.length >= 8 &&
      digitsOnly.length <= 15 &&
      /^\d+$/.test(digitsOnly)
    );
  }

  // Default case for other formats
  return cleaned.length >= 8 && cleaned.length <= 15 && /^\d+$/.test(cleaned);
}

// Format phone number for display
function formatPhoneNumber(phone) {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");

  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
      6
    )}`;
  } else if (cleaned.length === 11 && cleaned.startsWith("1")) {
    return `+1 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(
      7
    )}`;
  }

  return phone;
}

// Real-time phone formatting
function setupPhoneFormatting() {
  const phoneInputs = document.querySelectorAll('input[type="tel"]');

  phoneInputs.forEach((input) => {
    input.addEventListener("input", function (e) {
      const value = e.target.value.replace(/\D/g, "");

      if (value.length <= 10) {
        // Format as (XXX) XXX-XXXX
        let formatted = value;
        if (value.length > 3) {
          formatted = `(${value.slice(0, 3)}) ${value.slice(3)}`;
        }
        if (value.length > 6) {
          formatted = `(${value.slice(0, 3)}) ${value.slice(
            3,
            6
          )}-${value.slice(6)}`;
        }
        e.target.value = formatted;
      } else if (value.length === 11 && value.startsWith("1")) {
        // Format as +1 (XXX) XXX-XXXX
        e.target.value = `+1 (${value.slice(1, 4)}) ${value.slice(
          4,
          7
        )}-${value.slice(7)}`;
      }

      // Clear any existing error
      const errorElement = document.getElementById(e.target.id + "-error");
      if (errorElement) {
        errorElement.textContent = "";
      }
      e.target.classList.remove("error-field");
    });

    // Validate on blur
    input.addEventListener("blur", function (e) {
      const value = e.target.value.trim();
      if (value && !isValidPhone(value)) {
        const errorElement = document.getElementById(e.target.id + "-error");
        if (errorElement) {
          errorElement.textContent =
            "Please enter a valid phone number (10-15 digits)";
        }
        e.target.classList.add("error-field");
      }
    });
  });
}

// Function to submit contact form to Formspree
async function submitContactToFormspree(formData) {
  try {
    // Replace with your actual Formspree endpoint for contact form
    const response = await fetch("https://formspree.io/f/mkgkngzy", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: formData.get("name"),
        email: formData.get("email"),
        phone: formData.get("phone"),
        topic: formData.get("topic"),
        message: formData.get("message"),
        consent: formData.get("cConsent") === "on",
        _subject: "New Contact Form Submission",
        _format: "plain",
      }),
    });

    if (!response.ok) throw new Error("Form submission failed");
    return { success: true };
  } catch (error) {
    console.error("Error submitting contact form:", error);
    return { success: false, error: error.message };
  }
}

// Function to submit intake form to Formspree
async function submitIntakeToFormspree(formData) {
  try {
    // Get all form data
    const contactMethods = Array.from(formData.getAll("contactMethod"));
    const concerns = Array.from(formData.getAll("concerns"));

    // Replace with your actual Formspree endpoint for intake form
    const response = await fetch("https://formspree.io/f/xgvrwrzk", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        // Step 1: About You
        full_name: formData.get("fullName"),
        date_of_birth: formData.get("dob") || null,
        phone: formData.get("phone"),
        email: formData.get("email"),
        contact_method: contactMethods.join(", "),
        address: formData.get("address"),

        // Step 2: Background
        occupation: formData.get("occupation"),
        relationship_status: formData.get("relationshipStatus"),
        children: formData.get("children"),
        referred_by: formData.get("referredBy"),
        emergency_contact_name: formData.get("emgName"),
        emergency_contact_phone: formData.get("emgPhone"),
        emergency_contact_relationship: formData.get("emgRelation"),

        // Step 3: Concerns & Goals
        concerns: concerns.join(", "),
        concern_other: formData.get("concernOtherText"),
        presenting_description: formData.get("presentingDesc"),
        therapy_goals: formData.get("goals"),
        current_medications: formData.get("medsNow") === "Yes",
        medications_list: formData.get("medications"),
        previous_therapy: formData.get("therapyBefore") === "Yes",
        previous_therapy_notes: formData.get("prevHelpful"),

        // Step 4: Consent
        consent_given: formData.get("consent") === "on",
        signature: formData.get("signature"),
        signature_date: formData.get("sigDate"),

        _subject: "New Intake Form Submission",
        _format: "plain",
      }),
    });

    if (!response.ok) throw new Error("Form submission failed");
    return { success: true };
  } catch (error) {
    console.error("Error submitting intake form:", error);
    return { success: false, error: error.message };
  }
}

// Modal and Banner Management
function showSuccessModal(title, message, formType) {
  const modal = document.getElementById("successModal");
  const modalMessage = document.getElementById("modalMessage");
  const modalTitle = modal.querySelector("h3");

  // Update modal content
  modalTitle.textContent = title;
  modalMessage.textContent = message;

  // Show modal
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  // Setup modal buttons
  setupModalButtons(formType);
}

function showSuccessBanner(message, type = "success") {
  const banner = document.getElementById("successBanner");
  const bannerMessage = document.getElementById("bannerMessage");

  // Set banner style based on type
  if (type === "error") {
    banner.classList.remove("bg-green-600");
    banner.classList.add("bg-red-600");
  } else {
    banner.classList.remove("bg-red-600");
    banner.classList.add("bg-green-600");
  }

  bannerMessage.textContent = message;
  banner.classList.remove("hidden");

  // Auto-hide after 5 seconds for success messages
  if (type === "success") {
    setTimeout(() => {
      hideBanner();
    }, 5000);
  }
}

function hideModal() {
  const modal = document.getElementById("successModal");
  modal.classList.add("hidden");
  modal.classList.remove("flex");
}

function hideBanner() {
  const banner = document.getElementById("successBanner");
  banner.classList.add("hidden");
}

function setupModalButtons(formType) {
  const closeBtn = document.getElementById("modalCloseBtn");
  const newFormBtn = document.getElementById("modalNewFormBtn");

  // Remove existing event listeners
  closeBtn.replaceWith(closeBtn.cloneNode(true));
  newFormBtn.replaceWith(newFormBtn.cloneNode(true));

  // Get fresh references
  const freshCloseBtn = document.getElementById("modalCloseBtn");
  const freshNewFormBtn = document.getElementById("modalNewFormBtn");

  freshCloseBtn.addEventListener("click", hideModal);

  freshNewFormBtn.addEventListener("click", () => {
    hideModal();
    if (formType === "intake") {
      // Reset intake form and show first step
      document.getElementById("intakeForm").reset();
      showStep(1);
    } else {
      // Reset contact form
      document.getElementById("contactForm").reset();
    }
  });
}

// Banner close button
document.getElementById("closeBanner")?.addEventListener("click", hideBanner);

// Close modal when clicking outside
document.getElementById("successModal")?.addEventListener("click", (e) => {
  if (e.target.id === "successModal") {
    hideModal();
  }
});

// Close modal with Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    hideModal();
  }
});

// Tabs functionality
(function () {
  const tabMsg = document.getElementById("tab-message");
  const tabInt = document.getElementById("tab-intake");
  const panelMsg = document.getElementById("panel-message");
  const panelInt = document.getElementById("panel-intake");

  function setTab(which) {
    const message = which === "message";
    tabMsg.setAttribute("aria-selected", message ? "true" : "false");
    tabInt.setAttribute("aria-selected", message ? "false" : "true");
    panelMsg.classList.toggle("hidden", !message);
    panelInt.classList.toggle("hidden", message);
    if (!message) history.replaceState(null, "", "#intake");
    else history.replaceState(null, "", "#contact");
  }

  tabMsg.addEventListener("click", () => setTab("message"));
  tabInt.addEventListener("click", () => setTab("intake"));

  // Deep link - DEFAULT TO MESSAGE TAB
  const hash = (location.hash || "").replace("#", "");
  // Only switch to intake if hash is explicitly "#intake", otherwise default to message
  setTab(hash === "intake" ? "intake" : "message");
})();

// Contact form validation and submission
(function () {
  const form = document.getElementById("contactForm");
  const status = document.getElementById("contactStatus");

  if (!form) return;

  // Validation functions
  function validateContactForm() {
    let isValid = true;
    clearContactErrors();

    // Name validation
    const name = form.cName.value.trim();
    if (!name) {
      showError("cName", "Full name is required");
      isValid = false;
    } else if (name.length < 2) {
      showError("cName", "Name must be at least 2 characters");
      isValid = false;
    } else if (name.length > 100) {
      showError("cName", "Name must be less than 100 characters");
      isValid = false;
    }

    // Email validation
    const email = form.cEmail.value.trim();
    if (!email) {
      showError("cEmail", "Email is required");
      isValid = false;
    } else if (!isValidEmail(email)) {
      showError("cEmail", "Please enter a valid email address");
      isValid = false;
    } else if (email.length > 255) {
      showError("cEmail", "Email must be less than 255 characters");
      isValid = false;
    }

    // Phone validation (REQUIRED)
    const phone = form.cPhone.value.trim();
    if (!phone) {
      showError("cPhone", "Phone number is required");
      isValid = false;
    } else if (!isValidPhone(phone)) {
      showError("cPhone", "Please enter a valid phone number (10-15 digits)");
      isValid = false;
    } else if (phone.length > 20) {
      showError("cPhone", "Phone number is too long");
      isValid = false;
    }

    // Topic validation
    const topic = form.cTopic.value;
    if (!topic) {
      showError("cTopic", "Please select a topic");
      isValid = false;
    }

    // Message validation
    const message = form.cMessage.value.trim();
    if (!message) {
      showError("cMessage", "Message is required");
      isValid = false;
    } else if (message.length < 10) {
      showError("cMessage", "Message must be at least 10 characters");
      isValid = false;
    } else if (message.length > 2000) {
      showError("cMessage", "Message must be less than 2000 characters");
      isValid = false;
    }

    // Consent validation
    if (!form.cConsent.checked) {
      showError("cConsent", "You must consent to be contacted");
      isValid = false;
    }

    return isValid;
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function showError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + "-error");
    const fieldElement = document.getElementById(fieldId);

    if (errorElement) {
      errorElement.textContent = message;
    }

    if (fieldElement) {
      fieldElement.classList.add("error-field");
    }
  }

  function clearContactErrors() {
    // Clear all error messages and styling
    document.querySelectorAll("#contactForm .error-message").forEach((el) => {
      el.textContent = "";
    });
    document.querySelectorAll("#contactForm .error-field").forEach((el) => {
      el.classList.remove("error-field");
    });
  }

  // Real-time validation
  form.addEventListener("input", function (e) {
    const field = e.target;
    const fieldId = field.id;

    // Clear error when user starts typing
    if (fieldId) {
      const errorElement = document.getElementById(fieldId + "-error");
      if (errorElement) {
        errorElement.textContent = "";
      }
      field.classList.remove("error-field");
    }
  });

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!validateContactForm()) {
      status.textContent = "Please fix the errors above.";
      status.className = "text-sm mt-2 text-red-600";

      // Scroll to first error
      const firstError = document.querySelector(
        "#contactForm .error-message:not(:empty)"
      );
      if (firstError) {
        firstError.scrollIntoView({ behavior: "smooth", block: "center" });
      }
      return;
    }

    status.textContent = "Sending...";
    status.className = "text-sm mt-2 text-gray-600";

    // Disable submit button
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = "Sending...";

    try {
      const formData = new FormData(form);

      // Submit to Formspree
      const result = await submitContactToFormspree(formData);

      if (result.success) {
        // Show success modal
        showSuccessModal(
          "Message Sent Successfully!",
          "Thank you for your message. I'll reply within 1-2 business days.",
          "contact"
        );

        // Reset form
        form.reset();
        status.textContent = "";
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      status.textContent =
        "Something went wrong. Please try again or contact us directly.";
      status.className = "text-sm mt-2 text-red-600";
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Inquiry";
    }
  });
})();

// Intake multi-step + autosave with comprehensive validation
(function () {
  const form = document.getElementById("intakeForm");
  if (!form) return;

  const steps = Array.from(form.querySelectorAll("fieldset[data-step]"));
  const controls = Array.from(form.querySelectorAll("[data-controls]"));
  const dots = [1, 2, 3, 4].map((n) => document.getElementById("dot-" + n));
  let current = 1;

  const status = document.getElementById("formStatus");
  const draftStatus = document.getElementById("draftStatus");

  function showStep(n) {
    current = n;
    steps.forEach((fs) =>
      fs.classList.toggle("hidden", Number(fs.dataset.step) !== n)
    );
    controls.forEach((c) =>
      c.classList.toggle("hidden", Number(c.dataset.controls) !== n)
    );
    dots.forEach((dot, i) => {
      const idx = i + 1;
      dot.className =
        "step-dot " +
        (idx < n ? "step-done" : idx === n ? "step-active" : "step-next");
      dot.textContent = idx < n ? "✓" : String(idx);
    });
    status.textContent = "";
    status.className = "text-sm";
  }

  function clearErrors() {
    // Remove all error messages and styling
    document.querySelectorAll("#intakeForm .error-message").forEach((el) => {
      el.textContent = "";
    });
    document.querySelectorAll("#intakeForm .error-field").forEach((el) => {
      el.classList.remove("error-field");
    });
  }

  function validateStep(step) {
    let isValid = true;
    clearErrors();

    if (step === 1) {
      // Validate Step 1
      const fullName = form.fullName?.value.trim();
      const dob = form.dob?.value; // Now required
      const email = form.email?.value.trim();
      const phone = form.phone?.value.trim(); // OPTIONAL
      const contactMethods = Array.from(
        form.querySelectorAll('input[name="contactMethod"]:checked')
      );

      if (!fullName) {
        showIntakeError("fullName", "Full Name is required");
        isValid = false;
      } else if (fullName.length < 2) {
        showIntakeError("fullName", "Full Name must be at least 2 characters");
        isValid = false;
      }

      // Date of Birth validation (REQUIRED)
      if (!dob) {
        showIntakeError("dob", "Date of Birth is required");
        isValid = false;
      } else {
        // Validate that date is not in the future
        const selectedDate = new Date(dob);
        const today = new Date();
        if (selectedDate > today) {
          showIntakeError("dob", "Date of Birth cannot be in the future");
          isValid = false;
        }
        // Validate that person is at least 13 years old (or adjust as needed)
        const minAgeDate = new Date();
        minAgeDate.setFullYear(today.getFullYear() - 13);
        if (selectedDate > minAgeDate) {
          showIntakeError("dob", "You must be at least 13 years old");
          isValid = false;
        }
      }

      if (!email) {
        showIntakeError("email", "Email is required");
        isValid = false;
      } else if (!isValidEmail(email)) {
        showIntakeError("email", "Please enter a valid email address");
        isValid = false;
      }

      if (!phone) {
        showIntakeError("phone", "Phone number is required");
        isValid = false;
      } else if (!isValidPhone(phone)) {
        showIntakeError(
          "phone",
          "Please enter a valid phone number (10-15 digits)"
        );
        isValid = false;
      }

      if (contactMethods.length === 0) {
        showIntakeError(
          "contactMethod",
          "Please select at least one preferred contact method"
        );
        isValid = false;
      }
    } else if (step === 2) {
      // Validate Step 2 - Background
      const occupation = form.occupation?.value.trim();
      const relationshipStatus = form.relationshipStatus?.value;
      const children = form.children?.value.trim();
      const referredBy = form.referredBy?.value.trim();

      const emgName = form.emgName?.value.trim();
      const emgPhone = form.emgPhone?.value.trim();
      const emgRelation = form.emgRelation?.value.trim();

      // Occupation validation
      if (!occupation) {
        showIntakeError(
          "occupation",
          "Occupation or student status is required"
        );
        isValid = false;
      } else if (occupation.length < 2) {
        showIntakeError(
          "occupation",
          "Please provide a valid occupation or student status"
        );
        isValid = false;
      }

      // Relationship status validation
      if (!relationshipStatus) {
        showIntakeError(
          "relationshipStatus",
          "Please select your relationship status"
        );
        isValid = false;
      }

      // Children validation (optional but if provided, must be reasonable)
      if (children && children.length > 50) {
        showIntakeError(
          "children",
          "Please provide a brief description about children"
        );
        isValid = false;
      }

      // Referred by validation (optional but if provided, must be reasonable)
      if (referredBy && referredBy.length > 100) {
        showIntakeError(
          "referredBy",
          "Referral source description is too long"
        );
        isValid = false;
      }

      // Emergency contact validation - ALL REQUIRED
      if (!emgName) {
        showIntakeError("emgName", "Emergency contact name is required");
        isValid = false;
      } else if (emgName.length < 2) {
        showIntakeError(
          "emgName",
          "Please provide a valid emergency contact name"
        );
        isValid = false;
      }

      if (!emgPhone) {
        showIntakeError("emgPhone", "Emergency contact phone is required");
        isValid = false;
      } else if (!isValidPhone(emgPhone)) {
        showIntakeError(
          "emgPhone",
          "Please enter a valid emergency contact phone number"
        );
        isValid = false;
      }

      if (!emgRelation) {
        showIntakeError(
          "emgRelation",
          "Emergency contact relationship is required"
        );
        isValid = false;
      } else if (emgRelation.length < 2) {
        showIntakeError(
          "emgRelation",
          "Please provide a valid relationship description"
        );
        isValid = false;
      }
    } else if (step === 3) {
      // Validate Step 3
      const concerns = Array.from(
        form.querySelectorAll('input[name="concerns"]:checked')
      );
      const presentingDesc = form.presentingDesc?.value.trim();
      const goals = form.goals?.value.trim();
      const medsNow = form.querySelector('input[name="medsNow"]:checked');
      const therapyBefore = form.querySelector(
        'input[name="therapyBefore"]:checked'
      );

      if (concerns.length === 0) {
        showIntakeError("concerns", "Please select at least one concern");
        isValid = false;
      }

      if (!presentingDesc) {
        showIntakeError(
          "presentingDesc",
          "Please describe what brings you to counselling"
        );
        isValid = false;
      } else if (presentingDesc.length < 10) {
        showIntakeError(
          "presentingDesc",
          "Please provide more details (at least 10 characters)"
        );
        isValid = false;
      }

      if (!goals) {
        showIntakeError(
          "goals",
          "Please describe what you would like to achieve through therapy"
        );
        isValid = false;
      } else if (goals.length < 10) {
        showIntakeError(
          "goals",
          "Please provide more details about your goals (at least 10 characters)"
        );
        isValid = false;
      }

      if (!medsNow) {
        showIntakeError(
          "medsNow",
          "Please indicate if you are currently taking any medications"
        );
        isValid = false;
      }

      if (!therapyBefore) {
        showIntakeError(
          "therapyBefore",
          "Please indicate if you have attended counselling before"
        );
        isValid = false;
      }

      // Validate "Other" concern text if checked
      const concernOther = document.getElementById("concernOther");
      const concernOtherText = document.getElementById("concernOtherText");
      if (
        concernOther?.checked &&
        (!concernOtherText.value || concernOtherText.value.trim().length === 0)
      ) {
        showIntakeError(
          "concernOtherText",
          "Please specify your other concern"
        );
        isValid = false;
      }
    } else if (step === 4) {
      // Validate Step 4
      const consent = form.consent?.checked;
      const signature = form.signature?.value.trim();
      const sigDate = form.sigDate?.value;

      if (!consent) {
        showIntakeError(
          "consent",
          "You must agree to the confidentiality statement"
        );
        isValid = false;
      }

      if (!signature) {
        showIntakeError("signature", "Signature is required");
        isValid = false;
      } else if (signature.length < 2) {
        showIntakeError("signature", "Please enter your full name");
        isValid = false;
      }

      if (!sigDate) {
        showIntakeError("sigDate", "Date is required");
        isValid = false;
      } else {
        const selectedDate = new Date(sigDate);
        const today = new Date();
        if (selectedDate > today) {
          showIntakeError("sigDate", "Date cannot be in the future");
          isValid = false;
        }
      }
    }

    return isValid;
  }

  function showIntakeError(fieldId, message) {
    const errorElement = document.getElementById(fieldId + "-error");
    const fieldElement = document.getElementById(fieldId);

    if (errorElement) {
      errorElement.textContent = message;
    }

    if (fieldElement) {
      fieldElement.classList.add("error-field");
    } else {
      // For radio/checkbox groups
      const fieldGroup = document.querySelector(`[name="${fieldId}"]`);
      if (fieldGroup) {
        const container = fieldGroup.closest("div");
        if (container) {
          container.classList.add("error-field");
        }
      }
    }
  }

  function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  function nextStep() {
    if (validateStep(current)) {
      if (current < steps.length) showStep(current + 1);
    } else {
      // Scroll to first error
      const firstError = document.querySelector(
        "#intakeForm .error-message:not(:empty)"
      );
      if (firstError) {
        firstError.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }
    }
  }

  function prevStep() {
    if (current > 1) showStep(current - 1);
  }

  // Wire buttons
  form
    .querySelectorAll("[data-next]")
    .forEach((b) => b.addEventListener("click", nextStep));
  form
    .querySelectorAll("[data-prev]")
    .forEach((b) => b.addEventListener("click", prevStep));

  // Real-time validation for intake form
  form.addEventListener("input", function (e) {
    const field = e.target;
    const fieldId = field.id;

    // Clear error when user starts typing
    if (fieldId) {
      const errorElement = document.getElementById(fieldId + "-error");
      if (errorElement) {
        errorElement.textContent = "";
      }
      field.classList.remove("error-field");
    }
  });

  // Toggle "Other" concerns
  const concernOther = document.getElementById("concernOther");
  const concernOtherText = document.getElementById("concernOtherText");
  concernOther?.addEventListener("change", () => {
    concernOtherText.classList.toggle("hidden", !concernOther.checked);
    if (concernOther.checked) concernOtherText.focus();
    if (!concernOther.checked) concernOtherText.value = "";
    saveDraft();
  });

  // Toggle medication list
  const medWrap = document.getElementById("medListWrap");
  form.querySelectorAll('input[name="medsNow"]').forEach((r) => {
    r.addEventListener("change", () => {
      medWrap.classList.toggle("hidden", r.value !== "Yes" || !r.checked);
      saveDraft();
    });
  });

  // Toggle previous therapy textarea
  const prevWrap = document.getElementById("prevHelpfulWrap");
  form.querySelectorAll('input[name="therapyBefore"]').forEach((r) => {
    r.addEventListener("change", () => {
      prevWrap.classList.toggle("hidden", r.value !== "Yes" || !r.checked);
      saveDraft();
    });
  });

  // Auto-save to localStorage
  const STORAGE_KEY = "intakeDraft-v1";
  function saveDraft() {
    const data = Object.fromEntries(new FormData(form));
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      draftStatus.textContent = "Saved";
      setTimeout(() => (draftStatus.textContent = "Autosaving…"), 1500);
    } catch {}
  }
  function loadDraft() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return;
      const data = JSON.parse(raw);
      for (const [k, v] of Object.entries(data)) {
        const el = form.elements[k];
        if (!el) continue;
        if (el instanceof RadioNodeList) {
          [...el].forEach((input) => {
            if (Array.isArray(data[k])) {
              input.checked = data[k].includes(input.value);
            } else {
              input.checked = input.value === v;
            }
          });
        } else if (el.type === "checkbox") {
          el.checked = !!v;
        } else {
          el.value = v;
        }
      }
      if (form.medsNow?.value === "Yes") medWrap.classList.remove("hidden");
      if (form.therapyBefore?.value === "Yes")
        prevWrap.classList.remove("hidden");
      if (concernOther?.checked) concernOtherText.classList.remove("hidden");
    } catch {}
  }
  form.addEventListener("input", saveDraft, { passive: true });
  form.addEventListener("change", saveDraft);
  document.getElementById("clearDraft")?.addEventListener("click", () => {
    localStorage.removeItem(STORAGE_KEY);
    location.reload();
  });

  loadDraft();
  showStep(1);

  // Validate contact prefs before submit
  function validateContact() {
    const methods = Array.from(
      form.querySelectorAll('input[name="contactMethod"]:checked')
    );
    const hasMethod = methods.length > 0;

    // Check if phone is selected and provided
    const phoneSelected = methods.some((method) => method.value === "Phone");
    const phoneProvided = form.phone.value.trim() !== "";

    // Check if email is selected and provided
    const emailSelected = methods.some((method) => method.value === "Email");
    const emailProvided = form.email.value.trim() !== "";

    if (!hasMethod) {
      status.textContent =
        "Please select at least one preferred contact method.";
      status.className = "text-sm mt-2 text-red-600";
      return false;
    }

    // Validate that if phone is selected, it must be provided
    if (phoneSelected && !phoneProvided) {
      status.textContent =
        "Please provide your phone number since you selected phone as a contact method.";
      status.className = "text-sm mt-2 text-red-600";
      return false;
    }

    // Validate that if email is selected, it must be provided
    if (emailSelected && !emailProvided) {
      status.textContent =
        "Please provide your email since you selected email as a contact method.";
      status.className = "text-sm mt-2 text-red-600";
      return false;
    }

    // At least one contact method must have the corresponding detail
    const hasValidContact =
      (phoneSelected && phoneProvided) || (emailSelected && emailProvided);

    if (!hasValidContact) {
      status.textContent =
        "Please provide the contact details for your selected contact methods.";
      status.className = "text-sm mt-2 text-red-600";
      return false;
    }

    return true;
  }

  // Submit
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    // Validate all steps before submission
    let allValid = true;
    for (let i = 1; i <= 4; i++) {
      if (!validateStep(i)) {
        allValid = false;
        showStep(i);
        break;
      }
    }

    if (!allValid) {
      status.textContent =
        "Please fix the errors in the form before submitting.";
      status.className = "text-sm mt-2 text-red-600";
      return;
    }

    if (!validateContact()) {
      showStep(1);
      return;
    }

    if (form.website && form.website.value) return;

    const submitBtn = document.getElementById("submitBtn");
    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const formData = new FormData(form);

      // Submit to Formspree
      const result = await submitIntakeToFormspree(formData);

      if (result.success) {
        showSuccessModal(
          "Intake Form Submitted!",
          "Thank you for completing the intake form. We'll review your information and contact you within 24-48 hours to schedule your first session.",
          "intake"
        );

        localStorage.removeItem("intakeDraft-v1");
        form.reset();
        showStep(1);
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      console.error("Submission error:", error);
      showSuccessBanner(
        "Submission failed. Please try again or contact us directly.",
        "error"
      );
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Intake Form";
    }
  });
})();

// Initialize phone formatting when the page loads
document.addEventListener("DOMContentLoaded", function () {
  setupPhoneFormatting();
  console.log("Form validation and Formspree integration loaded");
});
