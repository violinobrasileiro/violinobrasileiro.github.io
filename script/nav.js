/* Violino Brasileiro — header interactions.
   1. Mobile/tablet: injects a hamburger button + full-screen overlay menu
      (hidden by CSS at >= 920px, so it's a no-op on desktop).
   2. All breakpoints: hides the header on scroll-down, reveals it on
      scroll-up, via the .header-hidden class (animated in CSS).
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

    var lastY = window.pageYOffset || 0;
    var ticking = false;
    var REVEAL_AT_TOP = 4;   /* always show near the very top */
    var HIDE_AFTER = 80;     /* don't hide until scrolled past this */

    function update() {
      ticking = false;
      var y = window.pageYOffset || 0;

      /* menu open => leave the header alone */
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

    window.addEventListener("scroll", function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
  }

  function init() {
    initMenu();
    initHeaderScroll();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
