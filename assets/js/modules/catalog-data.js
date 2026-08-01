/**
 * Catálogo de módulos del sistema, agrupado por rol.
 *
 * Cada rol define sus grupos; los grupos actúan a la vez como secciones de la
 * página y como filtros. `featured` marca los módulos que se destacan arriba.
 */
(function (root) {
  "use strict";

  var CATALOG = {
    estudiante: {
      label: "Estudiante",
      icon: "fa-user-graduate",
      title: "Panel de Estudiante",
      subtitle: "Accede a tus materias, calificaciones y servicios estudiantiles.",
      email: "estudiante@universidad.edu",
      groups: [
        {
          id: "academico",
          title: "Académico",
          icon: "fa-graduation-cap",
          modules: [
            {
              id: "mis-materias",
              title: "Mis Materias",
              description: "Notas y asistencia del período actual.",
              icon: "fa-book-open",
              featured: true
            },
            {
              id: "mis-horarios",
              title: "Mis Horarios",
              description: "Horarios de clases programados.",
              icon: "fa-calendar-alt",
              featured: true
            },
            {
              id: "record-academico",
              title: "Récord Académico",
              description: "Historial completo de notas.",
              icon: "fa-chart-line",
              featured: true
            },
            {
              id: "solicitudes-secretaria",
              title: "Solicitudes a Secretaría",
              description: "Realiza solicitudes generales a secretaría docente.",
              icon: "fa-file-alt"
            },
            {
              id: "cursos-escuelas",
              title: "Cursos y Escuelas",
              description: "Registro en cursos y escuelas complementarias.",
              icon: "fa-graduation-cap"
            },
            {
              id: "mi-malla",
              title: "Mi Malla Curricular",
              description: "Ver cumplimiento de malla curricular.",
              icon: "fa-sitemap"
            },
            {
              id: "matriculacion",
              title: "Matriculación",
              description: "Proceso de matriculación online.",
              icon: "fa-user-plus"
            }
          ]
        },
        {
          id: "financiero",
          title: "Financiero",
          icon: "fa-dollar-sign",
          modules: [
            {
              id: "mis-finanzas",
              title: "Mis Finanzas",
              description: "Pagos y facturas pendientes.",
              icon: "fa-credit-card",
              featured: true
            },
            {
              id: "becas",
              title: "Becas",
              description: "Historial de becas y nuevas postulaciones.",
              icon: "fa-award"
            }
          ]
        },
        {
          id: "evaluacion",
          title: "Evaluación",
          icon: "fa-star",
          modules: [
            {
              id: "evaluacion-profesores",
              title: "Evaluación de Profesores",
              description: "Evalúa el desempeño de tus docentes.",
              icon: "fa-star"
            }
          ]
        },
        {
          id: "general",
          title: "General",
          icon: "fa-cog",
          modules: [
            {
              id: "encuestas",
              title: "Encuestas",
              description: "Responder encuestas institucionales.",
              icon: "fa-poll"
            },
            {
              id: "votaciones",
              title: "Votaciones",
              description: "Participar en votaciones de autoridades.",
              icon: "fa-vote-yea"
            },
            {
              id: "actualizacion-datos",
              title: "Actualización de Datos",
              description: "Actualizar información personal.",
              icon: "fa-user-edit"
            }
          ]
        }
      ]
    },

    profesor: {
      label: "Profesor",
      icon: "fa-chalkboard-teacher",
      title: "Panel de Profesor",
      subtitle: "Gestiona tus clases, calificaciones y actividades académicas.",
      email: "profesor@universidad.edu",
      groups: [
        {
          id: "academico",
          title: "Académico",
          icon: "fa-graduation-cap",
          modules: [
            {
              id: "mis-clases",
              title: "Mis Clases",
              description: "Planificación de clases según horarios y materias.",
              icon: "fa-chalkboard",
              featured: true
            },
            {
              id: "calificaciones",
              title: "Calificaciones",
              description: "Gestión de calificaciones de estudiantes.",
              icon: "fa-clipboard-list",
              featured: true
            },
            {
              id: "mi-cronograma",
              title: "Mi Cronograma",
              description: "Cronograma detallado de materias.",
              icon: "fa-calendar-week",
              featured: true
            },
            {
              id: "asistencias",
              title: "Asistencias",
              description: "Registro de asistencia a clases.",
              icon: "fa-user-check"
            },
            {
              id: "mis-horarios-prof",
              title: "Mis Horarios",
              description: "Horarios de clases asignadas.",
              icon: "fa-clock"
            }
          ]
        },
        {
          id: "evaluacion",
          title: "Evaluación",
          icon: "fa-star",
          modules: [
            {
              id: "autoevaluacion",
              title: "Autoevaluación",
              description: "Proceso de autoevaluación docente.",
              icon: "fa-user-circle"
            },
            {
              id: "pares-directivos",
              title: "Evaluación de Pares",
              description: "Evaluación de pares y directivos.",
              icon: "fa-users"
            }
          ]
        },
        {
          id: "investigacion",
          title: "Investigación",
          icon: "fa-flask",
          modules: [
            {
              id: "convocatorias-vinculacion",
              title: "Convocatorias Vinculación",
              description: "Proyectos de vinculación con la sociedad.",
              icon: "fa-handshake"
            },
            {
              id: "convocatorias-proyectos",
              title: "Convocatorias Investigación",
              description: "Proyectos de investigación disponibles.",
              icon: "fa-flask"
            }
          ]
        },
        {
          id: "personal",
          title: "Personal",
          icon: "fa-user",
          modules: [
            {
              id: "titulos-experiencia",
              title: "Títulos y Experiencia",
              description: "Registro de títulos y experiencia laboral.",
              icon: "fa-certificate"
            }
          ]
        },
        {
          id: "general",
          title: "General",
          icon: "fa-cog",
          modules: [
            {
              id: "encuestas-prof",
              title: "Encuestas",
              description: "Responder encuestas institucionales.",
              icon: "fa-poll"
            },
            {
              id: "votaciones-prof",
              title: "Votaciones",
              description: "Participar en votaciones de autoridades.",
              icon: "fa-vote-yea"
            },
            {
              id: "actualizacion-datos-prof",
              title: "Actualización de Datos",
              description: "Actualizar información personal.",
              icon: "fa-user-edit"
            }
          ]
        }
      ]
    },

    administrativo: {
      label: "Administrativo",
      icon: "fa-user-tie",
      title: "Panel Administrativo",
      subtitle: "Administra todos los aspectos del sistema académico.",
      email: "admin@universidad.edu",
      groups: [
        {
          id: "gestion-academica",
          title: "Gestión Académica",
          description: "Administración de aspectos académicos.",
          icon: "fa-graduation-cap",
          modules: [
            {
              id: "mallas",
              title: "Mallas Curriculares",
              description: "Gestión de mallas curriculares.",
              icon: "fa-sitemap"
            },
            {
              id: "asignaturas",
              title: "Asignaturas",
              description: "Configuración de asignaturas.",
              icon: "fa-book"
            },
            {
              id: "configuracion-cursos",
              title: "Configuración de Cursos",
              description: "Configuración de cursos y escuelas.",
              icon: "fa-cog"
            },
            {
              id: "horarios-clases",
              title: "Horarios de Clases",
              description: "Configuración de horarios de niveles.",
              icon: "fa-calendar-alt"
            },
            {
              id: "niveles-academicos",
              title: "Niveles Académicos",
              description: "Gestión de niveles y materias.",
              icon: "fa-layer-group"
            },
            {
              id: "registro-calificaciones",
              title: "Registro de Calificaciones",
              description: "Gestión del período de calificaciones.",
              icon: "fa-clipboard-list"
            },
            {
              id: "periodos-academicos",
              title: "Períodos Académicos",
              description: "Administración de períodos lectivos.",
              icon: "fa-calendar-week"
            },
            {
              id: "carreras-programas",
              title: "Carreras y Programas",
              description: "Gestión de oferta académica.",
              icon: "fa-university"
            }
          ]
        },
        {
          id: "gestion-institucional",
          title: "Gestión Institucional",
          description: "Administración institucional y recursos humanos.",
          icon: "fa-building",
          modules: [
            {
              id: "institucion",
              title: "Institución",
              description: "Datos generales de la institución.",
              icon: "fa-university"
            },
            {
              id: "talento-humano",
              title: "Talento Humano",
              description: "Gestión de recursos humanos.",
              icon: "fa-users"
            },
            {
              id: "crm",
              title: "CRM",
              description: "Gestión de la relación con aspirantes y estudiantes.",
              icon: "fa-user-friends"
            },
            {
              id: "matriculas",
              title: "Matrículas",
              description: "Gestión de matrículas de estudiantes.",
              icon: "fa-user-plus"
            },
            {
              id: "inscripciones",
              title: "Inscripciones",
              description: "Registro de nuevos estudiantes.",
              icon: "fa-user-check"
            },
            {
              id: "profesores-admin",
              title: "Profesores",
              description: "Registro y gestión de profesores.",
              icon: "fa-chalkboard-teacher"
            },
            {
              id: "estadisticas",
              title: "Estadísticas",
              description: "Estadísticas administrativas y académicas.",
              icon: "fa-chart-bar"
            },
            {
              id: "elecciones",
              title: "Elecciones",
              description: "Gestión de procesos electorales.",
              icon: "fa-vote-yea"
            }
          ]
        },
        {
          id: "gestion-financiera",
          title: "Gestión Financiera",
          description: "Administración de aspectos financieros.",
          icon: "fa-dollar-sign",
          modules: [
            {
              id: "costos",
              title: "Costos",
              description: "Gestión de costos de programas.",
              icon: "fa-tags"
            },
            {
              id: "finanzas",
              title: "Finanzas",
              description: "Gestión de facturas y cobros.",
              icon: "fa-calculator"
            },
            {
              id: "bancos",
              title: "Bancos",
              description: "Administración de entidades financieras.",
              icon: "fa-university"
            },
            {
              id: "depositos-estudiantes",
              title: "Depósitos de Estudiantes",
              description: "Gestión de depósitos estudiantiles.",
              icon: "fa-piggy-bank"
            },
            {
              id: "convenios-pago",
              title: "Convenios de Pago",
              description: "Administración de convenios de pago.",
              icon: "fa-handshake"
            },
            {
              id: "facturas",
              title: "Facturas",
              description: "Gestión de facturación.",
              icon: "fa-file-invoice"
            }
          ]
        },
        {
          id: "bienestar-estudiantil",
          title: "Bienestar Estudiantil",
          description: "Gestión del bienestar estudiantil.",
          icon: "fa-heart",
          modules: [
            {
              id: "estudiantes-beca",
              title: "Estudiantes con Beca",
              description: "Gestión de estudiantes becados.",
              icon: "fa-award"
            },
            {
              id: "bienestar-perfiles",
              title: "Perfiles Socioeconómicos",
              description: "Gestión de perfiles socioeconómicos.",
              icon: "fa-user-friends"
            }
          ]
        },
        {
          id: "investigacion",
          title: "Investigación",
          description: "Gestión de proyectos de investigación.",
          icon: "fa-flask",
          modules: [
            {
              id: "convocatorias-investigacion",
              title: "Convocatorias",
              description: "Gestión de convocatorias de investigación.",
              icon: "fa-bullhorn"
            },
            {
              id: "proyectos-investigacion",
              title: "Proyectos de Investigación",
              description: "Seguimiento de proyectos.",
              icon: "fa-project-diagram"
            },
            {
              id: "presupuesto-proyectos",
              title: "Presupuesto de Proyectos",
              description: "Gestión de presupuestos.",
              icon: "fa-money-bill-wave"
            }
          ]
        },
        {
          id: "practicas-vinculacion",
          title: "Prácticas y Vinculación",
          description: "Gestión de prácticas y vinculación.",
          icon: "fa-handshake",
          modules: [
            {
              id: "vinculacion-sociedad",
              title: "Vinculación con la Sociedad",
              description: "Administración de proyectos de vinculación.",
              icon: "fa-hands-helping"
            },
            {
              id: "practicas-profesionales",
              title: "Prácticas Profesionales",
              description: "Gestión de prácticas y pasantías.",
              icon: "fa-briefcase"
            },
            {
              id: "empresas",
              title: "Empresas",
              description: "Gestión de convenios con empresas.",
              icon: "fa-building"
            }
          ]
        }
      ]
    }
  };

  root.TecduCatalog = CATALOG;
})(window);
