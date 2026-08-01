# Registro de cambios

Reorganización completa del proyecto, por fases. El estado de partida está en
[auditoria.md](auditoria.md).

Todo el trabajo es local: **no se ejecutó ningún comando de git**.

---

## Fase 1 — Auditoría

- Inventario de las 2 páginas, 2 hojas de estilo (una inline), 2 archivos JS
  (uno inline), 2 imágenes, 2 PDF y 3 dependencias externas en `auditoria.md`.
- Detectados 5 destinos rotos, 11 bloques de CSS muerto o duplicado, 12
  elementos de interfaz sin implementación y 8 fallos de accesibilidad.

## Fase 2 — Estructura

- `home/index.html` promovido a `index.html`. La pasarela anterior se eliminó
  (ver "Secciones retiradas").
- `home/css/styles.css` (2126 líneas) reescrito y repartido en
  `assets/css/base.css`, `layout.css` y `components.css`.
- `home/js/script.js` (1814 líneas) reescrito y repartido en
  `assets/js/main.js` y seis módulos bajo `assets/js/modules/`.
- `home/Group 8.png` → `assets/img/logo/tecdu.webp`.
- `home/Group 9white.png` → `assets/img/logo/tecdu-inverse.webp`.
- `home/reqs/*.pdf` → `docs/requisitos/`, con nombres en minúsculas y guiones.
- Creados `404.html`, `robots.txt`, `sitemap.xml` y `.gitignore`.

## Fase 3 — Higiene

- Eliminado `home/reqs/reqs.md` (0 bytes).
- Eliminado `.htaccess`: el despliegue real es Vercel, donde Apache no
  interviene. Además forzaba `www.` en todos los hosts, lo que habría roto
  `tecdusga.wib.digital`, y sus tres `ErrorDocument` apuntaban a páginas
  inexistentes.
- Retirado el `console.log` que volcaba la contraseña actual y la nueva **en
  claro** en la consola del navegador.
- Eliminado el código muerto: `showQRImage()`, `showNotification()`,
  `integrateWithExistingSystem()`, el bloque comentado dentro de
  `downloadQRCode()` y las reglas `.demo-placeholder`, `.welcome-message`,
  `.qr-code-image` y `.no-results`.
- Eliminada la duplicación del bloque `@media (max-width: 1024px)` y del
  `:root` repetido entre las dos páginas.
- Normalizado el formato: 2 espacios, comillas dobles en HTML, punto y coma en
  JS y salto de línea final en todos los archivos.
- No se encontraron credenciales, tokens ni claves de API en el código.

## Fase 4 — Imágenes

- Los dos logotipos medían **5528 × 1536 px** y pesaban **1,46 MB** entre
  ambos, para mostrarse a 150 px de ancho. Convertidos a WebP a 300 × 83 px:
  **22 KB en total**, un 98,5 % menos.
- Generados `assets/img/icons/favicon.png` (128 px) y `apple-touch-icon.png`
  (180 px) recortando la marca del propio logotipo. Sustituyen a los cuatro
  favicons que se enlazaban en caliente desde `edutechsolutionsllc.com`.
- Generada `assets/img/og-cover.png` (1200 × 630) componiendo el logotipo sobre
  el índigo de marca, para que `og:image` apunte a un archivo real.
- Todas las `<img>` llevan `width`, `height` y `alt` descriptivo.

## Fase 5 — HTML, SEO y accesibilidad

- Estructura semántica con `<header>`, `<main>`, `<aside>`, `<section>` y
  `<footer>`. Un solo `<h1>` por página y jerarquía sin saltos (verificado).
- `<title>` de 57 caracteres y `description` de 153, únicos por página.
- Añadidos Open Graph, `canonical` y favicons locales.
- Corregido el título de trabajo "Portal Académico - Navbar".
- Los desplegables de rol y período, que eran `<div>` con `click` y sin acceso
  por teclado, ahora son `<select>` nativos con `<label>` asociado.
- Los diálogos usan `<dialog>` nativo: foco atrapado, cierre con `Escape` y
  devolución del foco al elemento que los abrió.
- Añadidos `aria-label` a los botones de solo icono, enlace de salto al
  contenido y estilos `:focus-visible` en toda la interfaz.
- Añadido un campo de usuario oculto en el formulario de contraseña, que Chrome
  reclamaba para los gestores de contraseñas.

## Fase 6 — CSS y sistema de diseño

- Paleta derivada del logotipo real: índigo `#1709AC` y verde `#0BFF0B`,
  muestreados del archivo. Antes se usaban azules genéricos ajenos a la marca.
- Escala de espaciado de 4/8/16/24/32/48/64/96 y escala tipográfica de seis
  pasos, ambas en variables.
- Una sola familia tipográfica: la pila del sistema. Se retiró `Inter` del
  `font-family` porque **nunca se llegaba a cargar**.
- Eliminados los dos `!important` heredados, los estilos inline y los
  degradados decorativos, el barrido animado del avatar y el giro de 180° del
  botón de tema.
- Transiciones acotadas a 180 ms sobre propiedades concretas, en lugar de
  `transition: all 0.3s` sobre `body` y otras 40 reglas.
- El cambio de logotipo entre temas pasó de JavaScript a CSS: así también
  funciona en `404.html`, que no carga scripts, y no parpadea al alternar.
- Contraste verificado automáticamente en ambos temas, en los tres roles y en
  los dos diálogos: **sin fallos AA**.

## Fase 7 — Responsive

- Reescrito a mobile-first con `min-width` en 480, 768, 1024 y 1440.
- Eliminada la altura forzada en móvil (`height: calc(100vh - 70px)` con
  `.right-section { height: 60% }`) que recortaba el contenido.
- Sin scroll horizontal a 360, 768, 1024 ni 1440 px (verificado con
  `scrollWidth > innerWidth`).
- Todas las áreas táctiles a 44 × 44 px o más (verificado). Antes había botones
  de 32, 36 y 40 px.

## Fase 8 — UX/UI

- El buscador **nunca había estado enlazado** a su input: `handleSearch()`
  estaba definida y sin conectar. Ahora filtra en vivo e ignora acentos.
- Los filtros por categoría se extendieron al rol administrativo, que no los
  tenía, y se corrigió el error por el que en el rol profesor los módulos
  destacados salían duplicados al pulsar "Todos".
- Retirados ~90 botones sin ninguna acción (ver "Secciones retiradas").
- Los módulos destacados encabezan su grupo con una etiqueta, en lugar de
  repetirse en una sección aparte.
- Estados `hover`, `focus-visible`, `active` y `disabled` en todo elemento
  interactivo.
- Ancho de línea limitado a 66 caracteres en los bloques de texto.

## Fase 9 — JavaScript

- De 44 constantes globales a un módulo por responsabilidad, cada uno recibiendo
  sus elementos por `init()`.
- Eliminadas las seis funciones de sincronización (`syncMobileRole`,
  `syncDesktopRole`, `syncHeaderRole` y equivalentes de período) junto con las
  tres copias duplicadas de cada desplegable que mantenían en paso.
- Eliminado el `MutationObserver` que espiaba `#roleText` para detectar cambios
  de rol que el propio código provocaba.
- Eliminados los `alert()` y el `setTimeout` de 500 ms que fingía latencia.
- Sin `var`, sin globales sueltas, con comprobación de existencia antes de
  operar sobre cada elemento.
- Cero errores y cero avisos en consola (verificado).

### Generador de códigos QR

El QR anterior no existía: era un `<div>` con el icono `fa-qrcode` dentro de un
recuadro discontinuo, y sus botones lanzaban `alert('Aquí implementarás...')`.

Se escribió `assets/js/modules/qr.js`, una implementación propia de ISO/IEC
18004 en modo byte, nivel de corrección M, versiones 1 a 10, sin dependencias:
aritmética en GF(256), corrección Reed–Solomon, patrones de función, colocación
en zigzag y las ocho máscaras puntuadas con las reglas de penalización de la
norma.

**Verificación.** Contrastado con dos decodificadores independientes, OpenCV y
ZBar, sobre 13 casos: la capacidad exacta de cada versión de la 1 a la 10, texto
ASCII corto, texto con acentos y la propia carga de la credencial. Los 13
devuelven la cadena original en ambos decodificadores. Las tablas BCH de formato
y versión se compararon con los valores publicados en la norma, y la rutina
Reed–Solomon con su ejemplo resuelto.

Durante el desarrollo se localizaron y corrigieron tres errores propios:

1. La reserva de la información de formato pisaba los módulos de
   sincronización en `(8,6)` y `(6,8)`.
2. La segunda copia de la información de formato repartía los bits 8/7 en lugar
   de 7/8, dejando `(8, size-8)` sin escribir.
3. Los 15 bits de formato se colocaban empezando por el bit menos
   significativo; la norma empieza por el más significativo.

También se añadió el designador **ECI 26**: sin él, el modo byte se interpreta
como ISO-8859-1 y ZBar leía `é` como katakana de ancho medio.

## Fase 10 — Rendimiento

- Todos los scripts con `defer`.
- Font Awesome pasa de `all.min.css` (102 KB, incluye las familias *brands* y
  *regular* sin usar) a `fontawesome.min.css` + `solid.min.css` (81 KB).
  Verificado que los 58 iconos que la página usa resuelven en el set *solid*.
- Añadido `preconnect` al origen del CDN.
- Sin fuentes web: se usa la pila del sistema.
- **Primera carga: 331 KB**, frente al objetivo de 1 MB. Solo los logotipos
  ocupaban 1,46 MB antes.

## Fase 11 — QA

Comprobado con un arnés automatizado sobre Chrome (30 comprobaciones, todas
correctas): consola limpia, sin peticiones fallidas, catálogo correcto por rol
(13/13/30), un solo `<h1>`, jerarquía sin saltos, longitudes de `title` y
`description`, ausencia de scroll horizontal en los cuatro anchos, áreas
táctiles, búsqueda, estado vacío, filtros, apertura y cierre de los diálogos,
validación de contraseña, persistencia del tema, cambio de logotipo, 404 y peso
de la primera carga.

Además: auditoría de contraste sin fallos AA, verificación de que las 21
referencias locales existen en disco, comprobación de que no queda texto de
plantilla ni credenciales, y prueba de apertura directa con `file://`.

## Fase 12 — Documentación

- `readme.md` reescrito: la versión anterior describía funciones que ya no
  existen y anunciaba un QR que se podía "ver, descargar y compartir" cuando no
  había ninguno.
- Creados `docs/auditoria.md` y este registro.

## Fase 13 — Despliegue

- Verificado abriendo `index.html` directamente (`file://`) y con
  `npx serve@latest`.
- Sin rutas absolutas de la máquina. Todas las rutas internas son relativas y
  en minúsculas.
- No se creó configuración de hosting: no se indicó destino y Vercel sirve
  `404.html` sin necesidad de ella.

---

## Secciones y elementos retirados

Retirados por no tener contenido o destino real, no por preferencia de diseño.

| Elemento | Motivo |
|---|---|
| Pasarela `index.html` original | Buscador, spinner y estado "sin resultados" sobre **una sola** tarjeta, que además navegaba a sí misma |
| Menú lateral móvil | Contenía tres botones y duplicaba controles ya presentes; en su lugar la cabecera se reorganiza en dos filas |
| Botones "Acceder" e "Info" | ~84 botones (2 por tarjeta × 42 módulos). `openModule()` solo hacía una animación; `showModuleInfo()` estaba vacía |
| Botón "Cerrar sesión" | No hay autenticación que cerrar; no tenía listener |
| Sección "Manuales de Usuario" | No existe ningún manual. Los PDF del repositorio son especificaciones de módulos del cliente, no guías de usuario |
| Correo personal y teléfono del perfil | Datos de contacto inventados de una persona ficticia, sin aportar nada a la demostración |
| Campo "Programa" en roles no estudiantiles | Un administrativo no cursa un programa académico |

## Comportamientos que cambiaron de forma deliberada

| Antes | Ahora |
|---|---|
| El formulario de contraseña esperaba 2 s y decía "¡Contraseña cambiada exitosamente!" | Valida en vivo y, al enviar, indica que no hay servidor detrás y que la contraseña no se ha modificado |
| "Subir Imagen" no tenía ningún listener | Recorta la imagen a cuadrado, la reduce a 160 px y la guarda en local, con opción de quitarla |
| "Descargar" y "Compartir" del QR lanzaban `alert()` | Descargan un PNG real y comparten el archivo. Si el navegador no admite compartir archivos, el botón se retira en lugar de fallar |
| El período se elegía y no afectaba a nada | Se refleja en la cabecera del panel y entra en el contenido del QR |
