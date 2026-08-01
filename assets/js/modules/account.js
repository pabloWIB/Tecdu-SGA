/**
 * Cuenta: cambio de contraseña con validación en vivo y foto de perfil.
 *
 * La interfaz no tiene servidor detrás. La validación es real y se ejecuta
 * entera en el navegador; el envío lo dice explícitamente en lugar de simular
 * un guardado que no ocurre. La foto se procesa y se guarda en local.
 */
(function (root) {
  "use strict";

  var AVATAR_KEY = "tecdu:avatar";
  var AVATAR_SIZE = 160;
  var MAX_UPLOAD_BYTES = 8 * 1024 * 1024;

  var RULES = [
    { id: "length", label: "Mínimo 8 caracteres", test: function (v) { return v.length >= 8; } },
    { id: "uppercase", label: "Una letra mayúscula", test: function (v) { return /[A-Z]/.test(v); } },
    { id: "lowercase", label: "Una letra minúscula", test: function (v) { return /[a-z]/.test(v); } },
    { id: "number", label: "Un número", test: function (v) { return /\d/.test(v); } }
  ];

  var refs = {};
  var lastFocused = null;

  /* ---------- Contraseña ---------- */

  function evaluate() {
    var value = refs.newPassword.value;
    var allValid = true;

    RULES.forEach(function (rule) {
      var item = refs.dialog.querySelector('[data-rule="' + rule.id + '"]');
      var passed = rule.test(value);
      if (!passed) {
        allValid = false;
      }
      if (item) {
        item.classList.toggle("is-valid", passed);
        item.setAttribute("aria-checked", String(passed));
        var icon = item.querySelector("i");
        if (icon) {
          icon.className = passed ? "fas fa-check" : "fas fa-circle-notch";
        }
      }
    });

    return allValid;
  }

  function setFieldError(input, errorEl, message) {
    if (message) {
      input.setAttribute("aria-invalid", "true");
      errorEl.textContent = message;
      errorEl.hidden = false;
    } else {
      input.removeAttribute("aria-invalid");
      errorEl.textContent = "";
      errorEl.hidden = true;
    }
  }

  function checkConfirmation() {
    var confirmValue = refs.confirmPassword.value;
    if (!confirmValue) {
      setFieldError(refs.confirmPassword, refs.confirmError, "");
      return false;
    }
    var matches = confirmValue === refs.newPassword.value;
    setFieldError(
      refs.confirmPassword,
      refs.confirmError,
      matches ? "" : "Las dos contraseñas no coinciden."
    );
    return matches;
  }

  function resetForm() {
    refs.form.reset();
    evaluate();
    setFieldError(refs.currentPassword, refs.currentError, "");
    setFieldError(refs.newPassword, refs.newError, "");
    setFieldError(refs.confirmPassword, refs.confirmError, "");
    refs.status.hidden = true;
    refs.status.textContent = "";
    refs.dialog.querySelectorAll(".password-toggle").forEach(function (toggle) {
      var input = document.getElementById(toggle.getAttribute("aria-controls"));
      if (input) {
        input.type = "password";
      }
      toggle.setAttribute("aria-pressed", "false");
      toggle.querySelector("i").className = "fas fa-eye";
    });
  }

  function handleSubmit(event) {
    event.preventDefault();

    var valid = true;

    if (!refs.currentPassword.value) {
      setFieldError(
        refs.currentPassword,
        refs.currentError,
        "Escribe tu contraseña actual."
      );
      valid = false;
    } else {
      setFieldError(refs.currentPassword, refs.currentError, "");
    }

    if (!evaluate()) {
      setFieldError(
        refs.newPassword,
        refs.newError,
        "La nueva contraseña no cumple todos los requisitos."
      );
      valid = false;
    } else {
      setFieldError(refs.newPassword, refs.newError, "");
    }

    if (!checkConfirmation()) {
      if (!refs.confirmPassword.value) {
        setFieldError(
          refs.confirmPassword,
          refs.confirmError,
          "Repite la nueva contraseña."
        );
      }
      valid = false;
    }

    if (!valid) {
      refs.status.hidden = true;
      return;
    }

    refs.status.hidden = false;
    refs.status.textContent =
      "Validación superada. Esta es una reconstrucción de interfaz sin servidor " +
      "detrás: la contraseña no se ha modificado.";
  }

  function openPassword() {
    lastFocused = document.activeElement;
    resetForm();
    document.body.classList.add("has-open-dialog");
    refs.dialog.showModal();
  }

  function closePassword() {
    if (refs.dialog.open) {
      refs.dialog.close();
    }
  }

  /* ---------- Foto de perfil ---------- */

  function storedAvatar() {
    try {
      return root.localStorage.getItem(AVATAR_KEY);
    } catch (error) {
      return null;
    }
  }

  function applyAvatar(dataUrl) {
    if (dataUrl) {
      refs.avatarImage.src = dataUrl;
      refs.avatarImage.hidden = false;
      refs.avatarFallback.hidden = true;
      refs.avatarRemove.hidden = false;
    } else {
      refs.avatarImage.removeAttribute("src");
      refs.avatarImage.hidden = true;
      refs.avatarFallback.hidden = false;
      refs.avatarRemove.hidden = true;
    }
  }

  /* Recorta al cuadrado y reduce a 160 px antes de guardar, para no llenar el
     almacenamiento local con la imagen original. */
  function processImage(file) {
    var reader = new FileReader();
    reader.onload = function () {
      var image = new Image();
      image.onload = function () {
        var canvas = document.createElement("canvas");
        canvas.width = AVATAR_SIZE;
        canvas.height = AVATAR_SIZE;
        var side = Math.min(image.width, image.height);
        var context = canvas.getContext("2d");
        context.drawImage(
          image,
          (image.width - side) / 2,
          (image.height - side) / 2,
          side,
          side,
          0,
          0,
          AVATAR_SIZE,
          AVATAR_SIZE
        );
        var dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        applyAvatar(dataUrl);
        try {
          root.localStorage.setItem(AVATAR_KEY, dataUrl);
        } catch (error) {
          refs.avatarError.hidden = false;
          refs.avatarError.textContent =
            "La foto se ve en esta sesión, pero no se pudo guardar.";
        }
      };
      image.onerror = function () {
        refs.avatarError.hidden = false;
        refs.avatarError.textContent = "No se pudo leer esa imagen.";
      };
      image.src = reader.result;
    };
    reader.readAsDataURL(file);
  }

  function handleFile(event) {
    var file = event.target.files && event.target.files[0];
    refs.avatarError.hidden = true;
    if (!file) {
      return;
    }
    if (file.type.indexOf("image/") !== 0) {
      refs.avatarError.hidden = false;
      refs.avatarError.textContent = "Elige un archivo de imagen.";
      return;
    }
    if (file.size > MAX_UPLOAD_BYTES) {
      refs.avatarError.hidden = false;
      refs.avatarError.textContent = "La imagen supera los 8 MB.";
      return;
    }
    processImage(file);
    event.target.value = "";
  }

  function removeAvatar() {
    applyAvatar(null);
    refs.avatarError.hidden = true;
    try {
      root.localStorage.removeItem(AVATAR_KEY);
    } catch (error) {
      /* Sin almacenamiento disponible no hay nada que borrar. */
    }
    refs.avatarButton.focus();
  }

  function init(options) {
    refs = options;

    if (refs.dialog && refs.form) {
      refs.trigger.addEventListener("click", openPassword);
      refs.closeButton.addEventListener("click", closePassword);
      refs.cancelButton.addEventListener("click", closePassword);
      refs.form.addEventListener("submit", handleSubmit);
      refs.newPassword.addEventListener("input", function () {
        evaluate();
        if (refs.confirmPassword.value) {
          checkConfirmation();
        }
      });
      refs.confirmPassword.addEventListener("input", checkConfirmation);

      refs.dialog.addEventListener("click", function (event) {
        if (event.target === refs.dialog) {
          closePassword();
        }
      });

      refs.dialog.addEventListener("close", function () {
        document.body.classList.remove("has-open-dialog");
        if (lastFocused && lastFocused.focus) {
          lastFocused.focus();
        }
      });

      refs.dialog.querySelectorAll(".password-toggle").forEach(function (toggle) {
        toggle.addEventListener("click", function () {
          var input = document.getElementById(toggle.getAttribute("aria-controls"));
          if (!input) {
            return;
          }
          var reveal = input.type === "password";
          input.type = reveal ? "text" : "password";
          toggle.setAttribute("aria-pressed", String(reveal));
          toggle.querySelector("i").className = reveal
            ? "fas fa-eye-slash"
            : "fas fa-eye";
        });
      });

      evaluate();
    }

    if (refs.avatarInput) {
      applyAvatar(storedAvatar());
      refs.avatarButton.addEventListener("click", function () {
        refs.avatarInput.click();
      });
      refs.avatarInput.addEventListener("change", handleFile);
      refs.avatarRemove.addEventListener("click", removeAvatar);
    }
  }

  root.TecduAccount = { init: init, rules: RULES };
})(window);
