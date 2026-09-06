/* Violino Brasileiro — header interactions.
   1. Mobile/tablet: injects a hamburger button + full-screen overlay menu
      (hidden by CSS at >= 920px, so it's a no-op on desktop).
   2. All breakpoints: hides the header on scroll-down, reveals it on
      scroll-up, via the .header-hidden class (animated in CSS).
   3. Home page: tints the header to match the section behind it
      (sections carry data-nav-bg / data-nav-theme).
   Markup is built here so no page template had to change. */
(function () {
  "use strict";

  function initMenu() {
    var header = document.querySelector("header");
    var right = document.getElementById("rightContent");
    if (!header || !right) return;

    var sourceList = right.querySelector("ul");
    if (!sourceList) return;

    /* hamburger button, appended to the existing right-hand header slot */
    var toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "nav-toggle";
    toggle.setAttribute("aria-label", "Abrir menu");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span><span></span><span></span>";
    right.appendChild(toggle);

    /* full-screen overlay menu */
    var overlay = document.createElement("div");
    overlay.className = "nav-overlay";
    overlay.setAttribute("role", "dialog");
    overlay.setAttribute("aria-modal", "true");
    overlay.setAttribute("aria-label", "Menu");

    var closeBtn = document.createElement("button");
    closeBtn.type = "button";
    closeBtn.className = "nav-overlay-close";
    closeBtn.setAttribute("aria-label", "Fechar menu");
    closeBtn.innerHTML = "&times;";

    var menu = document.createElement("nav");
    menu.className = "nav-overlay-menu";
    menu.appendChild(sourceList.cloneNode(true));

    overlay.appendChild(closeBtn);
    overlay.appendChild(menu);
    document.body.appendChild(overlay);

    function openMenu() {
      overlay.classList.add("open");
      document.body.classList.add("nav-open");
      toggle.setAttribute("aria-expanded", "true");
      closeBtn.focus();
    }

    function closeMenu() {
      overlay.classList.remove("open");
      document.body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
      toggle.focus();
    }

    toggle.addEventListener("click", openMenu);
    closeBtn.addEventListener("click", closeMenu);
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) closeMenu();
    });
    menu.addEventListener("click", function (e) {
      if (e.target.closest("a")) closeMenu();
    });
    document.addEventListener("keydown", function (e) {
      if ((e.key === "Escape" || e.key === "Esc") && overlay.classList.contains("open")) {
        closeMenu();
      }
    });
  }

  function initHeaderScroll() {
    var header = document.querySelector("header");
    if (!header) return;

    var sections = Array.prototype.slice.call(
      document.querySelectorAll("[data-nav-bg]")
    );

    var lastY = window.pageYOffset || 0;
    var ticking = false;
    var REVEAL_AT_TOP = 4;   /* always show near the very top */
    var HIDE_AFTER = 80;     /* don't hide until scrolled past this */

    function applyTheme() {
      if (!sections.length) return;
      /* which section sits just under the header's bottom edge? */
      var probeY = header.getBoundingClientRect().bottom + 1;
      var current = sections[0];
      for (var i = 0; i < sections.length; i++) {
        var r = sections[i].getBoundingClientRect();
        if (r.top <= probeY) current = sections[i];
      }
      /* header stays transparent — only the logo / nav / hamburger colour
         flips for contrast against the section behind it */
      var theme = current.getAttribute("data-nav-theme");
      if (theme && header.getAttribute("data-nav-theme") !== theme) {
        header.setAttribute("data-nav-theme", theme);
      }
    }

    function update() {
      ticking = false;
      var y = window.pageYOffset || 0;

      applyTheme();

      /* menu open => leave the header visibility alone */
      if (document.body.classList.contains("nav-open")) { lastY = y; return; }

      if (y <= REVEAL_AT_TOP) {
        header.classList.remove("header-hidden");
      } else if (y > lastY && y > HIDE_AFTER) {
        header.classList.add("header-hidden");      /* scrolling down */
      } else if (y < lastY) {
        header.classList.remove("header-hidden");   /* scrolling up */
      }
      lastY = y;
    }

    applyTheme();   /* set the initial tint before any scroll */

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener("resize", applyTheme, { passive: true });
  }

  function initReveal() {
    if (!document.documentElement.classList.contains("reveal-ready")) return;

    var targets = document.querySelectorAll(
      ".homeContent > div, .homeContent > iframe"
    );
    if (!targets.length) return;

    function revealAll() {
      for (var i = 0; i < targets.length; i++) targets[i].classList.add("is-visible");
    }

    if (!("IntersectionObserver" in window)) { revealAll(); return; }

    try {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting) {
            e.target.classList.add("is-visible");
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.12, rootMargin: "0px 0px -8% 0px" });

      for (var i = 0; i < targets.length; i++) io.observe(targets[i]);
    } catch (err) {
      revealAll();
    }
  }

  function init() {
    initMenu();
    initHeaderScroll();
    initReveal();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
