/* ============================================
   App — Navigation, Card Interactions, Sidebar
   ============================================ */

(function () {
  "use strict";

  // --- Sidebar collapse (desktop) ---
  const sidebar = document.querySelector(".sidebar");
  const sidebarToggle = document.querySelector(".sidebar__toggle");

  if (sidebarToggle) {
    sidebarToggle.addEventListener("click", function () {
      sidebar.classList.toggle("sidebar--collapsed");
      const collapsed = sidebar.classList.contains("sidebar--collapsed");
      document.querySelectorAll(".sidebar__brand, .sidebar__user, .nav-item__label").forEach(function (el) {
        el.style.display = collapsed ? "none" : "";
      });
      document.querySelectorAll(".sidebar__brand-icon").forEach(function (el) {
        el.style.display = collapsed ? "flex" : "none";
      });
    });
  }

  // --- Mobile drawer ---
  const hamburger = document.querySelector(".topbar__hamburger");
  const drawer = document.querySelector(".drawer");
  const drawerOverlay = document.querySelector(".drawer-overlay");

  if (hamburger && drawer) {
    hamburger.addEventListener("click", function () {
      drawer.classList.add("drawer--open");
      if (drawerOverlay) drawerOverlay.classList.add("drawer-overlay--open");
    });

    if (drawerOverlay) {
      drawerOverlay.addEventListener("click", function () {
        drawer.classList.remove("drawer--open");
        drawerOverlay.classList.remove("drawer-overlay--open");
      });
    }

    drawer.querySelectorAll(".nav-item").forEach(function (item) {
      item.addEventListener("click", function () {
        drawer.classList.remove("drawer--open");
        if (drawerOverlay) drawerOverlay.classList.remove("drawer-overlay--open");
      });
    });
  }

  // --- Editable card: toggle edit mode ---
  document.querySelectorAll("[data-editable-card]").forEach(function (card) {
    const editBtn = card.querySelector("[data-action='edit']");
    const cancelBtn = card.querySelector("[data-action='cancel']");
    const readView = card.querySelector("[data-view='read']");
    const editView = card.querySelector("[data-view='edit']");

    if (editBtn && readView && editView) {
      editBtn.addEventListener("click", function () {
        readView.style.display = "none";
        editView.style.display = "block";
        editBtn.style.display = "none";
      });
    }

    if (cancelBtn && readView && editView) {
      cancelBtn.addEventListener("click", function () {
        readView.style.display = "block";
        editView.style.display = "none";
        if (editBtn) editBtn.style.display = "";
      });
    }

    // Save button — simulate save then return to read mode
    const saveBtn = card.querySelector("[data-action='save']");
    if (saveBtn && readView && editView) {
      saveBtn.addEventListener("click", function () {
        saveBtn.textContent = "Enregistrement…";
        saveBtn.disabled = true;

        setTimeout(function () {
          readView.style.display = "block";
          editView.style.display = "none";
          if (editBtn) editBtn.style.display = "";
          saveBtn.textContent = "Enregistrer";
          saveBtn.disabled = false;

          // Show saved indicator
          const savedIndicator = card.querySelector("[data-saved-indicator]");
          if (savedIndicator) {
            savedIndicator.style.display = "flex";
            setTimeout(function () {
              savedIndicator.style.display = "none";
            }, 2000);
          }
        }, 800);
      });
    }
  });

  // --- Toggle cards (specializations, modalities) ---
  document.querySelectorAll("[data-toggle-card]").forEach(function (card) {
    card.addEventListener("click", function () {
      card.classList.toggle("toggle-card--selected");
    });
  });

  // --- Chips (languages, practice areas) ---
  document.querySelectorAll("[data-chip]").forEach(function (chip) {
    chip.addEventListener("click", function () {
      chip.classList.toggle("chip--selected");
    });
  });

  // --- Segmented control ---
  document.querySelectorAll("[data-segmented]").forEach(function (control) {
    const options = control.querySelectorAll(".segmented__option");
    options.forEach(function (opt) {
      opt.addEventListener("click", function () {
        options.forEach(function (o) {
          o.classList.remove("segmented__option--selected");
        });
        opt.classList.add("segmented__option--selected");
      });
    });
  });

  // --- Toggle switch ---
  document.querySelectorAll("[data-toggle-switch]").forEach(function (sw) {
    sw.addEventListener("click", function () {
      sw.classList.toggle("toggle-switch--on");
    });
  });

  // --- Modal ---
  document.querySelectorAll("[data-modal-trigger]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const modalId = trigger.getAttribute("data-modal-trigger");
      const modal = document.getElementById(modalId);
      if (modal) modal.classList.add("modal-overlay--open");
    });
  });

  document.querySelectorAll("[data-modal-close]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const modal = btn.closest(".modal-overlay");
      if (modal) modal.classList.remove("modal-overlay--open");
    });
  });

  document.querySelectorAll(".modal-overlay").forEach(function (overlay) {
    overlay.addEventListener("click", function (e) {
      if (e.target === overlay) {
        overlay.classList.remove("modal-overlay--open");
      }
    });
  });

  // --- Inline form toggle (timeline add) ---
  document.querySelectorAll("[data-inline-form-trigger]").forEach(function (trigger) {
    trigger.addEventListener("click", function () {
      const formId = trigger.getAttribute("data-inline-form-trigger");
      const form = document.getElementById(formId);
      if (form) {
        form.style.display = form.style.display === "none" ? "flex" : "none";
      }
    });
  });

  // --- Inline form cancel ---
  document.querySelectorAll("[data-inline-form-cancel]").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const form = btn.closest(".inline-form");
      if (form) form.style.display = "none";
    });
  });
})();
