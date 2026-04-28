(function () {
  "use strict";

  const root = document.documentElement;
  const body = document.body;
  const navToggle = document.querySelector("[data-nav-toggle]");
  const navPanel = document.querySelector("[data-nav-panel]");
  const uploadForm = document.querySelector("[data-upload-form]");
  const uploadZone = document.querySelector("[data-upload-zone]");
  const fileInput = document.querySelector("[data-file-input]");
  const fileName = document.querySelector("[data-file-name]");
  const submitButton = document.querySelector("[data-submit-button]");
  const copyButtons = document.querySelectorAll("[data-copy-button]");
  const revealItems = document.querySelectorAll(".reveal");

  if (navToggle && navPanel) {
    navToggle.addEventListener("click", function () {
      const isOpen = body.classList.toggle("nav-open");
      navToggle.setAttribute("aria-expanded", String(isOpen));
    });

    navPanel.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        body.classList.remove("nav-open");
        navToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  const updateFileState = function () {
    if (!fileInput || !fileName) {
      return;
    }

    const files = fileInput.files;

    if (!files || !files.length) {
      fileName.textContent = "No file selected";
      return;
    }

    if (files.length === 1) {
      fileName.textContent = files[0].name;
      return;
    }

    fileName.textContent = files.length + " files selected";
  };

  if (uploadZone && fileInput) {
    ["dragenter", "dragover"].forEach(function (eventName) {
      uploadZone.addEventListener(eventName, function (event) {
        event.preventDefault();
        uploadZone.classList.add("is-dragover");
      });
    });

    ["dragleave", "dragend", "drop"].forEach(function (eventName) {
      uploadZone.addEventListener(eventName, function (event) {
        event.preventDefault();
        uploadZone.classList.remove("is-dragover");
      });
    });

    uploadZone.addEventListener("drop", function (event) {
      if (event.dataTransfer && event.dataTransfer.files && event.dataTransfer.files.length) {
        fileInput.files = event.dataTransfer.files;
        updateFileState();
      }
    });

    uploadZone.addEventListener("keydown", function (event) {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        fileInput.click();
      }
    });

    fileInput.addEventListener("change", updateFileState);
  }

  if (uploadForm && submitButton) {
    uploadForm.addEventListener("submit", function () {
      uploadForm.classList.add("is-submitting");
      submitButton.setAttribute("aria-busy", "true");
      submitButton.disabled = true;
    });
  }

  copyButtons.forEach(function (button) {
    button.addEventListener("click", async function () {
      const copyValue = button.getAttribute("data-copy-value");

      if (!copyValue) {
        return;
      }

      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          await navigator.clipboard.writeText(copyValue);
        } else {
          const tempInput = document.createElement("input");
          tempInput.value = copyValue;
          document.body.appendChild(tempInput);
          tempInput.select();
          document.execCommand("copy");
          document.body.removeChild(tempInput);
        }

        button.classList.add("is-copied");
        window.setTimeout(function () {
          button.classList.remove("is-copied");
        }, 1800);
      } catch (error) {
        console.error("Copy failed", error);
      }
    });
  });

  if ("IntersectionObserver" in window && revealItems.length) {
    const observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15
    });

    revealItems.forEach(function (item) {
      observer.observe(item);
    });
  } else {
    revealItems.forEach(function (item) {
      item.classList.add("is-visible");
    });
  }

  root.classList.add("js-ready");
})();
