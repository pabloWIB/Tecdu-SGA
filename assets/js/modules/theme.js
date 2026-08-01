/**
 * Tema claro y oscuro, con persistencia y respeto por la preferencia del
 * sistema cuando el usuario todavía no ha elegido.
 */
(function (root) {
  "use strict";

  var STORAGE_KEY = "tecdu:theme";

  var button = null;

  function stored() {
    try {
      return root.localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      return null;
    }
  }

  function persist(theme) {
    try {
      root.localStorage.setItem(STORAGE_KEY, theme);
    } catch (error) {
      /* Modo privado o almacenamiento lleno: el tema seguirá funcionando
         durante la sesión, solo no se recuerda. */
    }
  }

  /* El logotipo lo cambia el CSS a partir de data-theme. */
  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);

    if (button) {
      var dark = theme === "dark";
      button.setAttribute("aria-pressed", String(dark));
      button.setAttribute(
        "aria-label",
        dark ? "Cambiar a tema claro" : "Cambiar a tema oscuro"
      );
      var icon = button.querySelector("i");
      if (icon) {
        icon.className = dark ? "fas fa-sun" : "fas fa-moon";
      }
    }
  }

  function current() {
    return document.documentElement.getAttribute("data-theme") === "dark"
      ? "dark"
      : "light";
  }

  function init(options) {
    button = options.button;

    var saved = stored();
    var prefersDark =
      root.matchMedia && root.matchMedia("(prefers-color-scheme: dark)").matches;

    apply(saved || (prefersDark ? "dark" : "light"));

    if (button) {
      button.addEventListener("click", function () {
        var next = current() === "dark" ? "light" : "dark";
        apply(next);
        persist(next);
      });
    }
  }

  root.TecduTheme = { init: init };
})(window);
