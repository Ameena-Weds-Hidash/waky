// ============================================================
// waky — shared site script
// ============================================================

// ⚠️ REPLACE THIS with your real WhatsApp Business number.
// Country code + number only, no "+", no spaces, no dashes.
// Example: 14155552671 for +1 415 555 2671
const WHATSAPP_NUMBER = "10000000000";

// ---------- footer year ----------
document.querySelectorAll("#year").forEach(function (el) {
  el.textContent = new Date().getFullYear();
});

// ---------- mobile nav toggle ----------
(function () {
  var toggle = document.getElementById("navToggle");
  var links = document.getElementById("navLinks");
  if (!toggle || !links) return;

  toggle.addEventListener("click", function () {
    var isOpen = links.classList.toggle("open");
    toggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
  });

  links.querySelectorAll("a").forEach(function (a) {
    a.addEventListener("click", function () {
      links.classList.remove("open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
})();

// ---------- pipeline signature animation (plays once when scrolled into view) ----------
(function () {
  var pipelines = document.querySelectorAll(".pipeline");
  if (!pipelines.length) return;

  if (!("IntersectionObserver" in window)) {
    pipelines.forEach(function (p) { p.classList.add("in-view", "done"); });
    return;
  }

  var observer = new IntersectionObserver(function (entries, obs) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        var el = entry.target;
        el.classList.add("in-view");
        var dot = el.querySelector(".pipeline-dot");
        if (dot) {
          dot.addEventListener("animationend", function () {
            el.classList.add("done");
          }, { once: true });
        }
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.4 });

  pipelines.forEach(function (p) { observer.observe(p); });
})();

// ---------- contact form → WhatsApp redirect ----------
(function () {
  var form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var name = form.name.value.trim();
    var company = form.company.value.trim();
    var email = form.email.value.trim();
    var phone = form.phone.value.trim();
    var interest = form.interest.value;
    var message = form.message.value.trim();
    var status = document.getElementById("formStatus");

    if (!name || !email) {
      if (status) status.textContent = "Please add your name and email so we know who's reaching out.";
      return;
    }

    var details = [
      "Name: " + name,
      company ? "Company: " + company : null,
      "Email: " + email,
      phone ? "Phone: " + phone : null,
      "Interested in: " + interest,
      message ? "Details: " + message : null
    ].filter(Boolean).join("\n");

    var lines = "Hi Waky, I'd like to book a free consultation.\n\n" + details;

    var url = "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(lines);

    if (status) status.textContent = "Opening WhatsApp…";
    window.open(url, "_blank", "noopener");
  });
})();
