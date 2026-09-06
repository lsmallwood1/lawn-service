(function () {
  "use strict";

  var form = document.querySelector("[data-quote-form]");
  if (!form) return;

  var steps = Array.prototype.slice.call(form.querySelectorAll(".form-step"));
  var progressSegments = Array.prototype.slice.call(document.querySelectorAll(".progress-track span"));
  var current = 0;

  function showStep(index) {
    steps.forEach(function (step, i) {
      step.classList.toggle("is-active", i === index);
    });
    progressSegments.forEach(function (seg, i) {
      seg.classList.toggle("is-done", i <= index);
    });
    var heading = steps[index].querySelector("h2, h3");
    if (heading) heading.setAttribute("tabindex", "-1"), heading.focus({ preventScroll: true });
    window.scrollTo({ top: form.getBoundingClientRect().top + window.scrollY - 110, behavior: "smooth" });
  }

  function validateStep(index) {
    var step = steps[index];
    var fields = step.querySelectorAll("input[required], select[required], textarea[required]");
    var valid = true;

    fields.forEach(function (field) {
      var wrap = field.closest(".field");
      var groupOk = true;

      if (field.type === "radio" || field.type === "checkbox") {
        var name = field.name;
        var group = step.querySelectorAll("input[name='" + CSS.escape(name) + "']");
        groupOk = Array.prototype.some.call(group, function (g) {
          return g.checked;
        });
        if (wrap) wrap.classList.toggle("has-error", !groupOk);
        if (!groupOk) valid = false;
        return;
      }

      var ok = field.checkValidity();
      if (wrap) wrap.classList.toggle("has-error", !ok);
      if (!ok) valid = false;
    });

    return valid;
  }

  form.querySelectorAll("[data-next]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      if (!validateStep(current)) return;
      current = Math.min(current + 1, steps.length - 1);
      showStep(current);
    });
  });

  form.querySelectorAll("[data-prev]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      current = Math.max(current - 1, 0);
      showStep(current);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    if (!validateStep(current)) return;

    var submitBtn = form.querySelector("[data-submit]");
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending...";
    }

    // Demonstration mode: this is a fictional company built for the
    // Lost A Digit Digital portfolio. No lead data leaves the browser —
    // it is only mirrored to the console and to session storage so the
    // flow can be reviewed, then the success state is shown.
    var data = {};
    new FormData(form).forEach(function (value, key) {
      if (data[key] === undefined) {
        data[key] = value;
      } else if (Array.isArray(data[key])) {
        data[key].push(value);
      } else {
        data[key] = [data[key], value];
      }
    });

    console.info("[Green Knack demo] Quote request captured (not transmitted):", data);
    try {
      window.sessionStorage.setItem("gk-demo-quote", JSON.stringify(data));
    } catch (err) {
      /* sessionStorage unavailable — safe to ignore in a demo flow */
    }

    window.setTimeout(function () {
      form.hidden = true;
      var progress = document.querySelector(".progress-track");
      if (progress) progress.hidden = true;
      var success = document.querySelector("[data-quote-success]");
      if (success) {
        success.hidden = false;
        success.setAttribute("tabindex", "-1");
        success.focus({ preventScroll: false });
      }
    }, 600);
  });

  showStep(0);
})();
