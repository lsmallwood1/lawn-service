(function () {
  "use strict";

  var form = document.querySelector("[data-contact-form]");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    var fields = form.querySelectorAll("input[required], textarea[required]");
    var valid = true;
    fields.forEach(function (field) {
      var wrap = field.closest(".field");
      var ok = field.checkValidity();
      if (wrap) wrap.classList.toggle("has-error", !ok);
      if (!ok) valid = false;
    });
    if (!valid) return;

    var submitBtn = form.querySelector("[data-submit]");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    var data = {};
    new FormData(form).forEach(function (value, key) {
      data[key] = value;
    });
    console.info("[Green Knack demo] Contact message captured (not transmitted):", data);

    window.setTimeout(function () {
      form.hidden = true;
      var success = document.querySelector("[data-contact-success]");
      if (success) {
        success.hidden = false;
        success.setAttribute("tabindex", "-1");
        success.focus({ preventScroll: false });
      }
    }, 500);
  });
})();
