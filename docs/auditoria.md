# Auditoría del proyecto — Tecdu SGA

Estado registrado **antes** de la reorganización. Documento de trabajo interno.

---

## 1. Inventario de archivos

### 1.1 Páginas HTML

| Archivo | `<title>` | `<h1>` | Propósito real | Estado |
|---|---|---|---|---|
| `index.html` | Tecdu SGA - Portal de Módulos | Portal de Módulos | Pasarela con buscador sobre **una sola** tarjeta ("Inicio") que enlaza a `home/` | Relleno: buscador, spinner y estado vacío sobre 1 elemento |
| `home/index.html` | Portal Académico - Navbar | *(ninguno en el HTML; se inyecta por JS)* | Aplicación real: portal por rol, perfil, QR, cambio de contraseña | Funcional, con título de trabajo sin corregir |
| `404.html` | — | — | — | **No existe** (referenciado por `.htaccess`) |
| `403.html` / `500.html` | — | — | — | **No existen** (referenciados por `.htaccess`) |

### 1.2 CSS

| Archivo | Peso | Cargado por | Observaciones |
|---|---|---|---|
| `home/css/styles.css` | 40,2 KB · 2126 líneas | `home/index.html` | Único CSS externo del proyecto |
| *(inline)* `index.html` `<style>` | ~11 KB · 440 líneas | `index.html` | Duplica variables, reset, header, botones y tarjetas de `styles.css` |

### 1.3 JavaScript

| Archivo | Peso | Cargado por | Observaciones |
|---|---|---|---|
| `home/js/script.js` | 64,2 KB · 1814 líneas | `home/index.html` | Sin `defer`; todo en ámbito global |
| *(inline)* `index.html` `<script>` | ~5 KB · 158 líneas | `index.html` | Reimplementa tema y búsqueda |

### 1.4 Imágenes

| Archivo | Peso | Dimensiones | Formato | Uso | Problema |
|---|---|---|---|---|---|
| `home/Group 8.png` | 830,3 KB | 5528 × 1536 | PNG RGBA | Logo tema claro (`home/index.html`, `script.js`) | 37× más ancho que su contenedor (150 px CSS). Nombre con espacio y mayúscula |
| `home/Group 9white.png` | 666,2 KB | 5528 × 1536 | PNG RGBA | Logo tema oscuro (`script.js`) | Idéntico problema |

Peso de imágenes: **1,46 MB** para dos logotipos que se muestran a 150 px de ancho.

### 1.5 Documentos

| Archivo | Peso | Referenciado desde | Observaciones |
|---|---|---|---|
| `home/reqs/Distribucion de modulos.pdf` | 124,3 KB | ninguno | Documentación de requisitos del cliente, servida desde la raíz web |
| `home/reqs/Modulos Tecdu.pdf` | 83,9 KB | ninguno | Ídem |
| `home/reqs/reqs.md` | **0 bytes** | ninguno | Archivo vacío |

### 1.6 Dependencias externas

| Dependencia | Origen | Uso | Riesgo |
|---|---|---|---|
| Font Awesome 6.4.0 (`all.min.css`) | cdnjs.cloudflare.com | 77 iconos distintos, todos del set *solid* | Carga los sets *brands* y *regular* sin usarlos. Sin `preconnect`. CSS bloqueante |
| Fuente `Inter` | *ninguno* | Declarada en `font-family` de ambos archivos | **Nunca se carga.** Siempre cae al stack del sistema |
| Favicons | edutechsolutionsllc.com | 4 `<link>` en `index.html` | Hotlink al sitio del proveedor: dependencia de un dominio de terceros |

### 1.7 Archivos basura y de configuración

| Archivo | Estado |
|---|---|
| `.bak`, `copia de`, `final_v2`, `.DS_Store`, `Thumbs.db`, `node_modules` | Ninguno presente |
| `.gitignore` | **No existe** |
| `robots.txt`, `sitemap.xml` | **No existen** |
| `.htaccess` | Existe, pero el despliegue real es Vercel (ver 2.6) |

---

## 2. Problemas detectados

### 2.1 Enlaces rotos y destinos inexistentes

| Ubicación | Elemento | Problema |
|---|---|---|
| `index.html:462` | `<a href="#" class="logo">` | Ancla vacía sin motivo |
| `home/index.html:15` | `<a href="#" class="logo">` | Ancla vacía sin motivo |
| `index.html:505` | `<a href="home/" class="results-grid">` | Un `<a>` usado como contenedor de grid. `displayResults()` lo vacía con `innerHTML = ''`, así que tras cualquier búsqueda el enlace queda sin contenido |
| `index.html:663` | `window.location.href = 'index.html'` | Al pulsar la tarjeta "Inicio" navega **a sí misma**; además compite con el `<a href="home/">` que la envuelve |
| `.htaccess:34-36` | `ErrorDocument 404/403/500` | Apuntan a `/404.html`, `/403.html`, `/500.html`: los tres faltan |

### 2.2 Imágenes rotas

Ninguna ruta de imagen apunta a un archivo inexistente. Las dos que hay resuelven correctamente.

### 2.3 CSS y JS referenciados

Todas las referencias `<link>` y `<script>` resuelven. No hay archivos huérfanos en disco.

### 2.4 CSS muerto, duplicado o inalcanzable

| Selector | Problema |
|---|---|
| `.demo-placeholder` (+ `h3`, `p`) | Ninguna página genera ese marcado |
| `.welcome-message` (+ variantes dark) | Ídem: 8 reglas sin uso |
| `.qr-code-image` (+ `:hover`) | No existe ningún elemento con `id="qrCodeImage"` |
| `.no-results` (`index.html`) | El bloque existe pero `display: none` nunca se revierte con una sola tarjeta |
| `@media (max-width: 1024px)` | **Declarado dos veces** (líneas 1002 y 1046) con `.nav-desktop { display: none }` repetido |
| `.content-subtitle { p { … } }` | Anidamiento imposible: `.content-subtitle` **es** un `<p>`; no puede contener otro |
| `.left-section { height: auto !important }` | `!important` para pelear con una regla del mismo archivo |
| `.priority-title { font-size: 1rem !important }` | Ídem |
| Variables `--gradient-hero`, `--accent-blue` | Definidas en `index.html`; `--accent-blue` no se usa en ninguna regla |
| Bloque `:root` completo | Duplicado íntegro entre `index.html` y `styles.css`, con valores divergentes |

### 2.5 HTML duplicado entre páginas

`index.html` y `home/index.html` repiten: reset `*`, bloque `:root` y `[data-theme="dark"]`, `.header`, `.header-container`, `.logo`, `.action-btn`, `.theme-toggle`, `.module-card`, `.module-icon`, `@keyframes spin`. También duplican la lógica JS de tema (`toggleTheme`, `loadUserPreferences`) y de búsqueda.

### 2.6 Configuración de servidor inconsistente

`.htaccess` es configuración de Apache, pero el README documenta el despliegue en **Vercel**, donde el archivo no se ejecuta. Además:

- `RewriteRule` fuerza `www.` en todos los hosts. Aplicado a `tecdusga.wib.digital` redirigiría a `www.tecdusga.wib.digital`, un host que no está publicado.
- Los tres `ErrorDocument` apuntan a páginas que no existen.

### 2.7 Funcionalidad anunciada que no funciona

| Elemento | Comportamiento real |
|---|---|
| Buscador de cabecera (`#searchInput`) y móvil (`#mobileSearchInput`) | `handleSearch()` está **definida pero nunca enlazada**. Escribir no hace nada |
| Código QR | No hay QR. Es un `<div class="qr-placeholder">` con el icono `fa-qrcode` |
| Botón "Descargar" del QR | `alert('Función de descarga - Aquí implementarás la descarga del QR')` |
| Botón "Compartir" del QR | `navigator.share()` comparte la **URL de la página**, no el QR. Sin soporte: `alert('Función de compartir - Aquí implementarás las opciones de compartir')` |
| Botón "Subir Imagen" (`#uploadImageBtn`) | Sin ningún listener. No hace absolutamente nada |
| Botón "Cerrar sesión" escritorio (`#logoutBtn`) | Sin ningún listener |
| "Cerrar Sesión" móvil (`#mobileLogoutBtn`) | Solo cierra el menú |
| "Manual Estudiante" | `<div>` sin `href`, sin listener. No abre nada |
| Botones "Acceder" e "Info" | **~84 botones** (2 por tarjeta × 42 módulos): `openModule()` solo hace una animación de escala; `showModuleInfo()` es una función **vacía** |
| Formulario de contraseña | Simula 2 s de carga y muestra `alert('¡Contraseña cambiada exitosamente!')`. No hay backend |
| Filtro de categorías (rol Profesor) | `filterModules()` filtra sobre `data.modules` (todos) pero pinta en `#modulesGrid`, que es la rejilla "Otros Módulos": al pulsar "Todos" aparecen duplicados los módulos destacados |

### 2.8 Problemas de JavaScript

| Ubicación | Problema |
|---|---|
| `script.js:987` | `console.log('Cambiando contraseña...', { currentPassword, newPassword })` — **vuelca contraseñas en claro a la consola** |
| `script.js:1721` | `openModule()` usa el global implícito `event`, obsoleto y no disponible en modo estricto |
| `script.js:1-48` | 44 constantes en el ámbito global; dos módulos (`index.html` y `script.js`) declaran `isDarkTheme` y `header` con el mismo nombre |
| `script.js:769-775` | `showQRImage()` nunca se llama y opera sobre `qrCodeImage`, que siempre es `null` |
| `script.js:1737-1766` | `showNotification()` definida y nunca usada; incrusta un degradado morado ajeno a la paleta |
| `script.js:749-754` | Bloque de código comentado dentro de `downloadQRCode()` |
| `script.js:1512-1518` | `setTimeout(..., 100)` para enlazar listeners a elementos que ya existen |
| `script.js:50` y `:1805` | Dos listeners `DOMContentLoaded` separados |
| `script.js:1772-1803` | `integrateWithExistingSystem()` usa un `MutationObserver` sobre `#roleText` para detectar cambios de rol que el propio código provoca |
| `index.html:615` | `setTimeout(..., 500)` que finge latencia de búsqueda |
| `index.html:665` | `alert()` como respuesta a una interacción |
| Ambos archivos | `<script>` sin `defer` |

### 2.9 Accesibilidad

| Problema | Detalle |
|---|---|
| Sin `<h1>` en el HTML | `home/index.html` no tiene ninguno; el `<h1>` lo inyecta JS. Los `<h3 class="section-title">` aparecen antes |
| Jerarquía de encabezados rota | Se salta de `<h3>` (aside) a `<h1>` (main, inyectado) a `<h2>` |
| Desplegables no accesibles | Rol y período son `<div>` con `click`: sin foco, sin teclado, sin `aria-expanded`, sin `role` |
| Inputs sin `<label>` | `#searchInput` y `#mobileSearchInput` solo tienen `placeholder` |
| Botones solo icono sin `aria-label` | `#passwordBtn`, `#themeToggle`, `#logoutBtn`, `#mobileMenuBtn`, cierres de popup, `.password-toggle` (solo llevan `title`) |
| Sin estilos de foco | No hay una sola regla `:focus-visible` en todo el CSS |
| Contraste insuficiente | `--text-muted: #94a3b8` sobre blanco = **2,56:1** (mínimo 4,5). Afecta a `.profile-id`, `.detail-label`, `.mobile-user-email`, iconos de búsqueda |
| Contraste insuficiente | Texto blanco sobre `#3b82f6` = **3,1:1** en `.role-badge`, `.priority-card h4/p`, `.filter-tag.active` |
| Contraste insuficiente | `[data-theme="dark"] .filter-tag.active`: `#cbd5e1` sobre `#3b82f6` = **2,4:1** |
| Sin `<footer>` | Ninguna página tiene pie |

### 2.10 SEO y `<head>`

| Falta | `index.html` | `home/index.html` |
|---|---|---|
| `<meta name="description">` | ✗ | ✗ |
| Open Graph (`og:*`) | ✗ | ✗ |
| `<link rel="canonical">` | ✗ | ✗ |
| Favicon local | ✗ (externo) | ✗ (ninguno) |
| `<title>` correcto | Sí | **No**: "Portal Académico - Navbar" |
| `robots.txt` / `sitemap.xml` | ✗ | ✗ |

### 2.11 Responsive

| Problema | Detalle |
|---|---|
| Enfoque *desktop-first* | Todas las media queries son `max-width` |
| Puntos de ruptura | Solo 480, 768 y 1024. Sin 1440 |
| Altura forzada en móvil | `@media (max-width:1024px)`: `.main-layout { height: calc(100vh - 70px) }` + `.right-section { height: 60% }` recorta el contenido y crea scroll anidado |
| Áreas táctiles | `.action-btn` 40×40, `.qr-popup-close` 36×36, `.password-toggle` 32×32, `.dropdown-option` ~40 px de alto. Mínimo exigido: 44×44 |
| Menú móvil | Se cierra con la ✕ y con clic en el overlay, pero **no con `Escape`** |
| Selectores posicionales | `.header-right .header-actions > :nth-child(1|2|3) { display: none }` oculta botones por posición |

### 2.12 Contenido de relleno y datos ficticios

| Ubicación | Contenido |
|---|---|
| `home/index.html` `<title>` | "Portal Académico - **Navbar**" — título de trabajo |
| `home/index.html` | Perfil ficticio: "Juan Carlos Pérez González", cédula 123.456.789, `juan.perez@gmail.com`, +57 300 123 4567 |
| `home/index.html:16` | `alt="logo"` — no descriptivo |
| `styles.css` | `.demo-placeholder` con borde discontinuo y `.welcome-message`: restos de maqueta |
| `index.html` | Sección de resultados, spinner y estado "No se encontraron módulos" para un catálogo de **un** elemento |

### 2.13 Sistema de diseño

| Problema | Detalle |
|---|---|
| Paleta ajena a la marca | El sitio usa azules genéricos (`#1e40af`, `#3b82f6`). El logotipo real es **índigo `#1709AC` + verde `#0BFF0B`** |
| Sin escala de espaciado | Mezcla px y rem sin sistema: 6, 8, 10, 12, 16, 20, 24, 32 px junto a 0.75, 1.25, 1.5, 2, 3.5 rem |
| Valores en crudo | Docenas de colores literales (`#3b82f6`, `#f8fafc`, `#e2e8f0`, `#64748b`…) fuera de `:root`, sobre todo en el bloque de módulos |
| Estilos inline en HTML | `index.html:460` `style="display: none;"` en el `<header>` — **la cabecera del portal está oculta**, así que su botón de tema es inalcanzable |
| Estilos inline desde JS | `.style.transform`, `.style.opacity`, `.style.cssText` en 9 puntos |
| `transition: all` | En `body` y en ~40 reglas más; anima propiedades de layout innecesariamente |
| Duración de transiciones | 300-400 ms (`0.4s` en `.module-card`); el rango recomendado es 150-250 ms |
| Degradados decorativos | `--gradient-primary` en avatares e iconos, radial en `.profile-section`, degradado en `.welcome-message`, barrido `::after` en `.profile-avatar` |
| Animaciones gratuitas | `scale(0.9) rotate(180deg)` al cambiar de tema; `translateY(-6px)` en tarjetas que no llevan a ningún sitio |

---

## 3. Resumen

1. **Qué es**: reconstrucción de interfaz de Tecdu SGA, un sistema de gestión académica. Dos páginas: una pasarela y un portal por rol (estudiante / profesor / administrativo) con perfil, credencial QR y cambio de contraseña. HTML, CSS y JS sin framework ni paso de compilación.

2. **Estado**: el portal `home/index.html` está bien construido en su núcleo — el renderizado por rol y la validación de contraseña en vivo son código sólido — pero convive con una capa de interfaz que no hace nada.

3. **Lo más grave**: la funcionalidad anunciada no existe. **No hay código QR** (es un icono en un recuadro discontinuo), el **buscador nunca se enlazó** a su input, y hay **~90 botones que no ejecutan ninguna acción**, incluidos "Acceder" e "Info" en las 42 tarjetas de módulo.

4. **Segundo más grave**: `script.js:987` escribe la contraseña actual y la nueva **en claro en la consola** del navegador.

5. **Peso y accesibilidad**: 1,46 MB en dos logotipos de 5528 px que se pintan a 150 px, y fallos de contraste por debajo de 4,5:1 en el texto secundario y en todo el texto blanco sobre azul.
