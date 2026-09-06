(function () {
  "use strict";

  document.documentElement.classList.add("js");

  /* Decorative hero B-roll: force muted for autoplay reliability, and
     never run it for users who've asked for reduced motion. Shared by
     every page that uses the background-video hero system. */
  var heroVideo = document.querySelector(".hero-video");
  if (heroVideo) {
    if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      heroVideo.removeAttribute("autoplay");
      heroVideo.pause();
    } else {
      heroVideo.muted = true;
      heroVideo.defaultMuted = true;
      var playPromise = heroVideo.play();
      if (playPromise && playPromise.catch) playPromise.catch(function () {});
    }
  }

  /* ---------------------------------------------------------------- */
  /* Mobile nav toggle                                                  */
  /* ---------------------------------------------------------------- */
  var navToggle = document.querySelector("[data-nav-toggle]");
  var header = document.querySelector(".site-header");

  /* Keep the header visually integrated with the hero, then give it a
     readable surface as soon as the page starts moving. */
  function updateHeaderSurface() {
    if (!header) return;
    header.classList.toggle("is-scrolled", window.scrollY > 24);
    document.body.classList.toggle("page-scrolled", window.scrollY > 24);
  }
  updateHeaderSurface();
  window.addEventListener("scroll", updateHeaderSurface, { passive: true });

  /* Give each desktop service-menu item a compact, recognizable icon. */
  var serviceMenuIcons = {
    "/services/lawn-mowing/": '<circle cx="7" cy="17" r="2.2"/><circle cx="17" cy="17" r="2.2"/><path d="M7 17h6.5L18 8h-3.5L11 13H9M18 8l2.5-1M11 13 8.5 9.5"/>',
    "/services/shrub-hedge-care/": '<circle cx="6" cy="6" r="2.2"/><circle cx="6" cy="18" r="2.2"/><path d="M8 7.4 20 18M20 6 8 16.6"/>',
    "/services/seasonal-cleanup/": '<path d="M20 4c0 8-6 14-14 14H4c0-8 6-14 14-14ZM9 15 20 4"/>',
    "/services/commercial-lawn-care/": '<rect x="4" y="7" width="16" height="13" rx="1.5"/><path d="M8 7V4h8v3M8 11h2M14 11h2M8 15h2M14 15h2"/>'
  };
  document.querySelectorAll(".dropdown a:not(.dropdown-all)").forEach(function (link) {
    var icon = link.querySelector(".svg-mini");
    var path = new URL(link.href, window.location.href).pathname;
    if (icon && serviceMenuIcons[path]) icon.innerHTML = serviceMenuIcons[path];
  });

  /* Service pages share the same compact proof bar. Keeping it here avoids
     five copies of identical presentation markup drifting out of sync. */
  var isServicePage = window.location.pathname === "/services/" ||
    window.location.pathname.indexOf("/services/") === 0;
  var serviceHero = document.querySelector(".service-hero, .page-hero");
  if (isServicePage && serviceHero && !serviceHero.nextElementSibling?.classList.contains("trust-strip")) {
    var serviceTrust = document.createElement("section");
    serviceTrust.className = "trust-strip";
    serviceTrust.setAttribute("aria-label", "Why customers trust Green Knack");
    serviceTrust.innerHTML = '<div class="container trust-strip__inner">' +
      '<div class="trust-strip__item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="9" cy="8" r="3.2"/><path d="M3.5 20a5.5 5.5 0 0 1 11 0"/><circle cx="17.2" cy="9.3" r="2.6"/><path d="M15.3 20a4.7 4.7 0 0 1 6.2-3.8"/></svg><span><strong>Locally Run</strong>Tampa Bay Crew</span></div>' +
      '<div class="trust-strip__item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="8.5"/><circle cx="12" cy="12" r="4.8"/><circle cx="12" cy="12" r="1.1" fill="currentColor"/></svg><span><strong>Reliable</strong>Scheduled Service</span></div>' +
      '<div class="trust-strip__item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m12 3 2.7 5.9 6.3.7-4.7 4.4 1.2 6.3L12 17.2 6.5 20.3l1.2-6.3-4.7-4.4 6.3-.7Z"/></svg><span><strong>4.9 / 5</strong>Average Customer Rating</span></div>' +
      '<div class="trust-strip__item"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3.2 2"/></svg><span><strong>Fast Quotes</strong>Usually Within 48 Hours</span></div>' +
      '</div>';
    serviceHero.insertAdjacentElement("afterend", serviceTrust);
  }

  function setHeaderHeight() {
    if (!header) return;
    document.documentElement.style.setProperty("--header-h", header.offsetHeight + "px");
  }
  setHeaderHeight();
  window.addEventListener("resize", setHeaderHeight);

  if (navToggle) {
    navToggle.addEventListener("click", function () {
      var isOpen = document.body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", isOpen ? "true" : "false");
      document.body.style.overflow = isOpen ? "hidden" : "";
    });
  }

  function closeMobileNav() {
    document.body.classList.remove("nav-open");
    document.body.style.overflow = "";
    if (navToggle) navToggle.setAttribute("aria-expanded", "false");
  }

  document.querySelectorAll(".mobile-nav a").forEach(function (a) {
    a.addEventListener("click", closeMobileNav);
  });

  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && document.body.classList.contains("nav-open")) {
      closeMobileNav();
      if (navToggle) navToggle.focus();
    }
  });

  /* ---------------------------------------------------------------- */
  /* Mobile submenu accordion (Services)                                */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll("[data-sub-toggle]").forEach(function (btn) {
    var submenu = document.getElementById(btn.getAttribute("aria-controls"));
    if (!submenu) return;
    btn.addEventListener("click", function () {
      var isOpen = submenu.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", isOpen ? "true" : "false");
    });
  });

  /* ---------------------------------------------------------------- */
  /* Scroll reveal                                                     */
  /* ---------------------------------------------------------------- */
  var revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    var io = new IntersectionObserver(
      function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    revealEls.forEach(function (el) {
      io.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add("is-visible");
    });
  }

  /* ---------------------------------------------------------------- */
  /* FAQ accordion                                                      */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll(".faq-item").forEach(function (item) {
    var btn = item.querySelector(".faq-q");
    if (!btn) return;
    btn.addEventListener("click", function () {
      var isOpen = item.getAttribute("data-open") === "true";
      item.setAttribute("data-open", isOpen ? "false" : "true");
      btn.setAttribute("aria-expanded", isOpen ? "false" : "true");
    });
  });

  /* ---------------------------------------------------------------- */
  /* Before / after slider                                             */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll("[data-ba-slider]").forEach(function (slider) {
    var afterLayer = slider.querySelector(".ba-after");
    var handle = slider.querySelector(".ba-handle");
    var range = slider.querySelector(".ba-range");
    if (!afterLayer || !handle || !range) return;

    function update(value) {
      var v = Math.min(100, Math.max(0, value));
      afterLayer.style.clipPath = "inset(0 0 0 " + v + "%)";
      handle.style.left = v + "%";
      range.value = v;
    }

    range.addEventListener("input", function () {
      update(Number(range.value));
    });

    // Pointer drag directly on the visual for a nicer feel.
    var dragging = false;
    function pointerToValue(clientX) {
      var rect = slider.getBoundingClientRect();
      var pct = ((clientX - rect.left) / rect.width) * 100;
      return pct;
    }
    slider.addEventListener("pointerdown", function (e) {
      dragging = true;
      update(pointerToValue(e.clientX));
    });
    window.addEventListener("pointermove", function (e) {
      if (!dragging) return;
      update(pointerToValue(e.clientX));
    });
    window.addEventListener("pointerup", function () {
      dragging = false;
    });

    update(50);
  });

  /* ---------------------------------------------------------------- */
  /* Service-area ZIP checker (front-end demo logic)                   */
  /* ---------------------------------------------------------------- */
  var zipForm = document.querySelector("[data-zip-form]");
  if (zipForm) {
    var covered = [
      "33510","33511","33534","33547","33548","33549","33556","33558",
      "33559","33563","33565","33566","33567","33569","33570","33572",
      "33573","33578","33579","33584","33592","33594","33596","33598",
      "33601","33602","33603","33604","33605","33606","33607","33609",
      "33610","33611","33612","33613","33614","33615","33616","33617",
      "33618","33619","33621","33624","33625","33626","33629","33634",
      "33635","33637","33647","33701","33702","33703","33704","33705",
      "33706","33707","33708","33709","33710","33711","33712","33713",
      "33714","33715","33716","33755","33756","33759","33760","33761",
      "33762","33763","33764","33765","33767","33770","33771","33772",
      "33773","33774","33776","33777","33778","33781","33782","34205",
      "34677","34683","34684","34685","34689","34698"
    ];
    zipForm.addEventListener("submit", function (e) {
      e.preventDefault();
      var input = zipForm.querySelector("input[name='zip']");
      var result = zipForm.querySelector("[data-zip-result]");
      var zip = (input.value || "").trim();
      if (!/^[0-9]{5}$/.test(zip)) {
        result.textContent = "Enter a valid 5-digit ZIP code.";
        result.className = "zip-result show out-area";
        return;
      }
      if (covered.indexOf(zip) !== -1) {
        result.textContent = "Good news — " + zip + " is inside the Green Knack service area. Get your free quote below.";
        result.className = "zip-result show in-area";
      } else {
        result.textContent = "We're not quite in " + zip + " yet, but Tampa Bay is growing fast — request a quote and we'll let you know as soon as we are.";
        result.className = "zip-result show out-area";
      }
    });
  }

  /* ---------------------------------------------------------------- */
  /* Current-year stamp                                                 */
  /* ---------------------------------------------------------------- */
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
})();
