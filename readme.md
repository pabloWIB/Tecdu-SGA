# Tecdu-SGA

Interface rebuild for the Tecdu academic management system: a role-aware module catalogue with a student credential whose QR code is generated in the browser.

[![Live demo](https://img.shields.io/badge/demo-tecdusga.wib.digital-2ea44f)](https://tecdusga.wib.digital)
[![Hire me on Fiverr](https://img.shields.io/badge/Hire%20me%20on-Fiverr-1DBF73?style=for-the-badge&logo=fiverr&logoColor=white)](https://www.fiverr.com/pablonietop)
[![License](https://img.shields.io/badge/license-MIT-blue)](license)
![Build step](https://img.shields.io/badge/build%20step-none-lightgrey)

## Description

An academic management system accumulates modules — enrolment, grades, timetables, payments, certificates — until the entry screen becomes a wall of links every user has to read past to reach the two things they actually use. This is a rebuild of that entry point.

One page renders three different products. Selecting a role swaps the whole catalogue: the student sees 13 modules across four categories, the professor 13 across five, the administrator 30 across six. Each category is both a section heading and a filter chip, and the search box narrows the catalogue across all of them, accent-insensitively.

The student credential is the part worth reading the source for. The QR code is not an image asset and not a library call — `assets/js/modules/qr.js` is a from-scratch implementation of ISO/IEC 18004 (byte mode, error correction level M, versions 1–10, Reed–Solomon over GF(256), all eight mask patterns scored by the standard's penalty rules). It renders to a canvas, so **Download** writes a real PNG and **Share** hands a real file to the system share sheet.

## Features

- Three roles — student, professor, administrator — each rendering its own catalogue from one data source.
- Category filters and accent-insensitive search, with an explicit empty state.
- Student credential with a genuine, scannable QR code; download as PNG and native file sharing.
- Profile photo picked from disk, cropped to a square and downscaled to 160 px before being stored locally.
- Password change with live requirement validation.
- Light and dark themes, persisted, defaulting to the operating-system preference and applied before first paint.

## Tech stack

| Layer | Technology | Role in project |
|---|---|---|
| Markup | HTML5 | `index.html` (portal) and `404.html` |
| Styling | CSS3, custom properties | 1060 lines split into base, layout and components |
| Scripting | JavaScript (vanilla, no framework, no build) | 1415 lines across one entry point and five modules |
| QR generation | Own implementation of ISO/IEC 18004 | `assets/js/modules/qr.js`, 664 lines, no dependency |
| Icons | Font Awesome 6.4.0 Free Solid, from cdnjs | Only the `fontawesome` + `solid` stylesheets are loaded |

Fonts are the operating-system stack; nothing is downloaded for typography.

## Verification

The QR encoder was checked against two independent decoders, **OpenCV** and **ZBar**, over 13 cases: the exact byte capacity of each of versions 1 to 10, short ASCII payloads, accented Spanish text and the credential payload itself. All 13 round-trip to the original string in both decoders. The BCH format and version bit tables were compared against the values published in ISO/IEC 18004, and the Reed–Solomon routine against the standard's worked example.

Non-ASCII payloads emit an ECI 26 designator. Without it, byte mode defaults to ISO-8859-1 and ZBar renders `é` as half-width katakana.

## Project structure

```
.
├── index.html                    # The portal: header controls, profile panel, catalogue, two dialogs
├── 404.html                      # Standalone, links back to the portal
├── assets/
│   ├── css/
│   │   ├── base.css              # Custom properties, reset, typography, focus, utilities
│   │   ├── layout.css            # Header grid, page intro, two-column layout, footer
│   │   └── components.css        # Buttons, fields, chips, cards, profile, dialogs
│   ├── js/
│   │   ├── main.js               # Entry point: wires modules to the markup
│   │   └── modules/
│   │       ├── qr.js             # ISO/IEC 18004 encoder and canvas renderer
│   │       ├── catalog-data.js   # Module catalogue for the three roles
│   │       ├── catalog.js        # Rendering, search and category filtering
│   │       ├── credential.js     # Credential dialog, PNG download, file sharing
│   │       ├── account.js        # Password validation and profile photo
│   │       └── theme.js          # Light/dark theme, persisted
│   └── img/
│       ├── logo/                 # Wordmark, light and inverse, WebP
│       ├── icons/                # Favicon and apple-touch-icon
│       └── og-cover.png          # Open Graph card
├── docs/
│   ├── auditoria.md              # State of the project before the rebuild
│   ├── cambios.md                # Change log, grouped by phase
│   └── requisitos/               # Client module-specification PDFs
├── .gitignore
├── robots.txt
├── sitemap.xml
├── license
└── readme.md
```

## Running it locally

No dependencies and no build step. Opening `index.html` directly in a browser works — the scripts are classic scripts with `defer`, not ES modules, precisely so that `file://` stays usable.

For a served origin:

```bash
git clone https://github.com/pabloWIB/Tecdu-SGA.git
cd Tecdu-SGA
npx serve@latest .
```

The version is pinned because a broken global `serve` install shadows the fetched one on some machines.

## Notes on the code

`main.js` holds the demo profile and is the only file that touches the DOM by id. Everything else receives its elements through `init()`, so a module never searches the document for markup it does not own.

Role switching goes through `syncRole()`, which drives four things from one `<select>`: the catalogue, the credential's role label and payload, the institutional e-mail and whether the academic-programme row applies at all. Adding a role means adding an entry to `catalog-data.js` and an `<option>`.

The role and period pickers are native `<select>` elements. The previous build had three synchronised copies of each custom dropdown — header, mobile drawer and content area — kept in step by six sync functions; none of them was reachable by keyboard.

## Known limitations

- **There is no authentication.** The role is chosen in the interface rather than derived from a session, so all three views are reachable by anyone. This is an interface rebuild, not a secured application — do not put it in front of real student data without an auth layer.
- The profile is demonstration data and no form is connected to a backend. The password dialog validates fully in the browser and says so instead of reporting a save that never happens.
- Module cards are informational. The underlying screens do not exist in this repository, so the cards do not link anywhere.

## Deployment

Deployed on Vercel at [tecdusga.wib.digital](https://tecdusga.wib.digital). Static: upload the repository root as-is, with no build command and no output directory. Vercel serves `404.html` for unknown paths automatically.

## License

MIT — see [license](license).

## Author

**Pablo Nieto Pérez** — [wib.digital](https://wib.digital)
GitHub: [@pabloWIB](https://github.com/pabloWIB)

---

## Hire me

I build **custom internal tools, CRMs and dashboards** for small teams, and
**conversion-focused websites** for businesses.

- [Custom internal tool, CRM or dashboard](https://www.fiverr.com/pablonietop/build-a-custom-internal-app-for-your-business) — from $45
- [Conversion-focused website](https://www.fiverr.com/pablonietop/convert-your-landing-page-design-to-code) — from $80
- [All my services on Fiverr](https://www.fiverr.com/pablonietop)
- [wib.digital](https://wib.digital)
