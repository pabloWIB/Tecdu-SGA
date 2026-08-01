/**
 * Punto de entrada: conecta los módulos con el marcado de la página.
 *
 * Los datos del perfil son de demostración; esta interfaz no está conectada a
 * ningún sistema académico.
 */
(function (root) {
  "use strict";

  var PROFILE = {
    name: "Juan Carlos Pérez González",
    id: "123456789",
    program: "Ingeniería de Sistemas"
  };

  function byId(id) {
    return document.getElementById(id);
  }

  function start() {
    var roleSelect = byId("roleSelect");
    var periodSelect = byId("periodSelect");
    var catalog = root.TecduCatalog;

    root.TecduTheme.init({
      button: byId("themeToggle")
    });

    root.TecduCatalogView.init({
      main: byId("moduleCatalog"),
      filters: byId("moduleFilters"),
      search: byId("moduleSearch"),
      title: byId("panelTitle"),
      subtitle: byId("panelSubtitle"),
      roleIcon: byId("panelRoleIcon")
    });

    root.TecduCredential.init({
      dialog: byId("credentialDialog"),
      canvas: byId("credentialCanvas"),
      trigger: byId("credentialButton"),
      closeButton: byId("credentialClose"),
      downloadButton: byId("credentialDownload"),
      shareButton: byId("credentialShare"),
      error: byId("credentialError"),
      summaryRole: byId("credentialRole"),
      summaryPeriod: byId("credentialPeriod"),
      profile: PROFILE
    });

    root.TecduAccount.init({
      dialog: byId("passwordDialog"),
      form: byId("passwordForm"),
      trigger: byId("passwordButton"),
      closeButton: byId("passwordClose"),
      cancelButton: byId("passwordCancel"),
      currentPassword: byId("currentPassword"),
      newPassword: byId("newPassword"),
      confirmPassword: byId("confirmPassword"),
      currentError: byId("currentPasswordError"),
      newError: byId("newPasswordError"),
      confirmError: byId("confirmPasswordError"),
      status: byId("passwordStatus"),
      avatarButton: byId("avatarButton"),
      avatarInput: byId("avatarInput"),
      avatarImage: byId("avatarImage"),
      avatarFallback: byId("avatarFallback"),
      avatarRemove: byId("avatarRemove"),
      avatarError: byId("avatarError")
    });

    function syncRole() {
      var role = roleSelect.value;
      var data = catalog[role];
      if (!data) {
        return;
      }
      root.TecduCatalogView.setRole(role);
      root.TecduCredential.setRole(data.label);
      byId("profileEmail").textContent = data.email;
      byId("profileRole").textContent = data.label;

      /* El programa académico solo aplica al perfil de estudiante. */
      var isStudent = role === "estudiante";
      byId("profileProgramItem").hidden = !isStudent;
      root.TecduCredential.setProgram(isStudent ? PROFILE.program : "");
    }

    function syncPeriod() {
      var period = periodSelect.value;
      byId("panelPeriod").textContent = period;
      root.TecduCredential.setPeriod(period);
    }

    if (roleSelect) {
      roleSelect.addEventListener("change", syncRole);
      syncRole();
    }

    if (periodSelect) {
      periodSelect.addEventListener("change", syncPeriod);
      syncPeriod();
    }

    byId("profileName").textContent = PROFILE.name;
    byId("profileId").textContent = PROFILE.id;
    byId("profileIdFull").textContent = PROFILE.id;
    byId("profileProgram").textContent = PROFILE.program;
    byId("credentialName").textContent = PROFILE.name;
    byId("credentialId").textContent = PROFILE.id;
    byId("accountUser").value = PROFILE.id;
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", start);
  } else {
    start();
  }
})(window);
