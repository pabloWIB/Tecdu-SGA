/**
 * Credencial con código QR: generación, descarga y compartición.
 *
 * El QR se genera en el navegador con assets/js/modules/qr.js y se dibuja en un
 * canvas, de modo que descargar y compartir operan sobre la imagen real.
 */
(function (root) {
  "use strict";

  var refs = {};
  var profile = {};
  var roleLabel = "Estudiante";
  var period = "";
  var program = "";
  var lastFocused = null;

  function payload() {
    var lines = ["TECDU SGA", roleLabel + ": " + profile.name, "ID: " + profile.id];
    if (program) {
      lines.push("Programa: " + program);
    }
    lines.push("Período: " + period);
    return lines.join("\n");
  }

  function draw() {
    try {
      root.TecduQR.render(refs.canvas, payload(), {
        size: 216,
        margin: 4,
        dark: "#000000",
        light: "#ffffff"
      });
      refs.canvas.setAttribute(
        "aria-label",
        "Código QR con los datos de la credencial de " + profile.name
      );
      refs.error.hidden = true;
      return true;
    } catch (error) {
      refs.error.hidden = false;
      refs.error.textContent = "No se pudo generar el código QR.";
      return false;
    }
  }

  function fileName() {
    return "credencial-tecdu-" + profile.id + ".png";
  }

  function withBlob(callback) {
    if (!refs.canvas.toBlob) {
      return;
    }
    refs.canvas.toBlob(function (blob) {
      if (blob) {
        callback(blob);
      }
    }, "image/png");
  }

  function download() {
    withBlob(function (blob) {
      var url = URL.createObjectURL(blob);
      var link = document.createElement("a");
      link.href = url;
      link.download = fileName();
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    });
  }

  function canShareFiles() {
    if (!root.navigator.canShare || !root.navigator.share || !root.File) {
      return false;
    }
    try {
      return root.navigator.canShare({
        files: [new File([new Blob([""], { type: "image/png" })], "t.png", { type: "image/png" })]
      });
    } catch (error) {
      return false;
    }
  }

  function share() {
    withBlob(function (blob) {
      var file = new File([blob], fileName(), { type: "image/png" });
      root.navigator
        .share({
          files: [file],
          title: "Credencial Tecdu SGA",
          text: "Credencial de " + profile.name
        })
        .catch(function () {
          /* El usuario canceló el diálogo del sistema. */
        });
    });
  }

  function open() {
    if (!draw()) {
      return;
    }
    lastFocused = document.activeElement;
    document.body.classList.add("has-open-dialog");
    refs.dialog.showModal();
  }

  function close() {
    document.body.classList.remove("has-open-dialog");
    if (refs.dialog.open) {
      refs.dialog.close();
    }
  }

  function init(options) {
    refs = options;
    profile = options.profile;

    if (!refs.dialog || !refs.canvas || !refs.trigger) {
      return;
    }

    refs.trigger.addEventListener("click", open);
    refs.closeButton.addEventListener("click", close);
    refs.downloadButton.addEventListener("click", download);

    refs.dialog.addEventListener("close", function () {
      document.body.classList.remove("has-open-dialog");
      if (lastFocused && lastFocused.focus) {
        lastFocused.focus();
      }
    });

    /* Cerrar al pulsar fuera del panel. */
    refs.dialog.addEventListener("click", function (event) {
      if (event.target === refs.dialog) {
        close();
      }
    });

    /* Compartir archivos no está disponible en todos los navegadores: si no lo
       está, se retira el botón en lugar de dejarlo sin efecto. */
    if (canShareFiles()) {
      refs.shareButton.addEventListener("click", share);
    } else {
      refs.shareButton.remove();
    }
  }

  function setRole(label) {
    roleLabel = label;
    if (refs.summaryRole) {
      refs.summaryRole.textContent = label;
    }
  }

  function setPeriod(value) {
    period = value;
    if (refs.summaryPeriod) {
      refs.summaryPeriod.textContent = value;
    }
  }

  /* Cadena vacía: el programa no se muestra ni entra en el QR. */
  function setProgram(value) {
    program = value || "";
  }

  root.TecduCredential = {
    init: init,
    setRole: setRole,
    setPeriod: setPeriod,
    setProgram: setProgram
  };
})(window);
