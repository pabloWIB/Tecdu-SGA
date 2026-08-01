/**
 * Renderiza el catálogo de módulos del rol activo y aplica búsqueda y filtros.
 */
(function (root) {
  "use strict";

  var catalog = root.TecduCatalog;

  var state = {
    role: "estudiante",
    group: "todos",
    query: ""
  };

  var elements = {};

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function normalise(value) {
    return value
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "");
  }

  function matchesQuery(module, query) {
    if (!query) {
      return true;
    }
    return (
      normalise(module.title).indexOf(query) !== -1 ||
      normalise(module.description).indexOf(query) !== -1
    );
  }

  /* Grupos del rol activo, ya filtrados por categoría y búsqueda. */
  function visibleGroups() {
    var role = catalog[state.role];
    var query = normalise(state.query.trim());

    return role.groups
      .filter(function (group) {
        return state.group === "todos" || group.id === state.group;
      })
      .map(function (group) {
        return {
          meta: group,
          modules: group.modules.filter(function (module) {
            return matchesQuery(module, query);
          })
        };
      })
      .filter(function (group) {
        return group.modules.length > 0;
      });
  }

  function moduleCard(module) {
    return (
      '<li class="module-card' +
      (module.featured ? " module-card--featured" : "") +
      '">' +
      '<span class="module-card__icon" aria-hidden="true"><i class="fas ' +
      escapeHtml(module.icon) +
      '"></i></span>' +
      '<div class="module-card__body">' +
      '<h4 class="module-card__title">' +
      escapeHtml(module.title) +
      "</h4>" +
      '<p class="module-card__description">' +
      escapeHtml(module.description) +
      "</p>" +
      (module.featured ? '<p class="module-card__badge">Destacado</p>' : "") +
      "</div>" +
      "</li>"
    );
  }

  /* Los módulos destacados encabezan su grupo en lugar de repetirse en una
     sección aparte. */
  function byPriority(a, b) {
    return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
  }

  function renderGroups(groups) {
    return groups
      .map(function (group) {
        var headingId = "group-" + group.meta.id;
        return (
          '<section class="module-group" aria-labelledby="' +
          headingId +
          '">' +
          '<h3 class="module-group__title" id="' +
          headingId +
          '">' +
          '<span class="module-group__icon" aria-hidden="true"><i class="fas ' +
          escapeHtml(group.meta.icon) +
          '"></i></span>' +
          escapeHtml(group.meta.title) +
          '<span class="module-group__count">' +
          group.modules.length +
          "</span>" +
          "</h3>" +
          (group.meta.description
            ? '<p class="module-group__description">' +
              escapeHtml(group.meta.description) +
              "</p>"
            : "") +
          '<ul class="module-grid">' +
          group.modules
            .slice()
            .sort(byPriority)
            .map(moduleCard)
            .join("") +
          "</ul>" +
          "</section>"
        );
      })
      .join("");
  }

  function renderEmptyState() {
    return (
      '<p class="empty-state" role="status">' +
      "Ningún módulo coincide con la búsqueda. Prueba con otro término o vuelve a " +
      '"Todos los módulos".' +
      "</p>"
    );
  }

  function renderFilters(role) {
    var buttons = [
      {
        id: "todos",
        title: "Todos los módulos",
        icon: "fa-th-large"
      }
    ].concat(role.groups);

    elements.filters.innerHTML = buttons
      .map(function (group) {
        var active = group.id === state.group;
        return (
          '<button type="button" class="filter-chip" data-group="' +
          escapeHtml(group.id) +
          '" aria-pressed="' +
          active +
          '">' +
          '<i class="fas ' +
          escapeHtml(group.icon) +
          '" aria-hidden="true"></i>' +
          escapeHtml(group.title) +
          "</button>"
        );
      })
      .join("");
  }

  function render() {
    var role = catalog[state.role];
    var groups = visibleGroups();
    var total = groups.reduce(function (sum, group) {
      return sum + group.modules.length;
    }, 0);

    elements.title.textContent = role.title;
    elements.subtitle.textContent = role.subtitle;
    elements.roleIcon.className = "fas " + role.icon;

    renderFilters(role);

    if (!total) {
      elements.main.innerHTML = renderEmptyState();
      return;
    }

    elements.main.innerHTML =
      '<section class="panel-section" aria-labelledby="all-heading">' +
      '<h2 class="panel-section__title" id="all-heading">' +
      (state.query.trim() ? "Resultados de la búsqueda" : "Catálogo de módulos") +
      '<span class="panel-section__count">' +
      total +
      "</span>" +
      "</h2>" +
      renderGroups(groups) +
      "</section>";
  }

  function setRole(role) {
    if (!catalog[role]) {
      return;
    }
    state.role = role;
    state.group = "todos";
    render();
  }

  function init(options) {
    elements = options;
    if (!elements.main || !elements.filters) {
      return;
    }

    elements.filters.addEventListener("click", function (event) {
      var chip = event.target.closest(".filter-chip");
      if (!chip) {
        return;
      }
      state.group = chip.getAttribute("data-group");
      render();
    });

    if (elements.search) {
      elements.search.addEventListener("input", function (event) {
        state.query = event.target.value;
        render();
      });
    }

    render();
  }

  root.TecduCatalogView = {
    init: init,
    setRole: setRole,
    currentRole: function () {
      return state.role;
    }
  };
})(window);
