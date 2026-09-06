/* Violino Brasileiro — mobile / tablet navigation.
   Injects a hamburger button into the header and a full-screen overlay menu
   with a close button. Everything is hidden by CSS at >= 920px, so this is a
   no-op on desktop. Markup is built here so no page template had to change. */
(function () {
  "use strict";

  function init() {
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

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
