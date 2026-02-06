# CLAUDE.md - AI Assistant Guide for trilpai.github.io

## Project Overview

**Trilp AI** was an independent software consulting studio based in Pune, India, operating from late 2022 through 2025. This site is preserved as a record of that phase and showcases two engineering frameworks: **3 Octaves** and **RIPPLES**.

- **Live URL:** https://www.trilp.in
- **Backup:** https://trilpai.github.io
- **Founder:** Pradyumna Das Roy
- **Status:** Preserved as a record of independent consulting work (concluded late 2025)

---

## Tech Stack

| Layer       | Technology                        | Notes                                      |
|-------------|-----------------------------------|--------------------------------------------|
| Framework   | Static HTML                       | No build framework, pure HTML              |
| Styling     | Tailwind CSS v4                   | Compiled via CLI, source in `tailwind.css` |
| Fonts       | Inter (local `.woff2`)            | Self-hosted for performance                |
| JavaScript  | Vanilla ES6+ (IIFE modules)       | No framework, no bundler                   |
| Deployment  | GitHub Pages                      | Auto-deploy on push to `main`              |
| Node        | v22+ (see `.nvmrc`)               | For Tailwind CLI only                      |

---

## Project Structure

```
.
├── index.html              # Main landing page with Ripple Resonance game
├── 3octaves/
│   └── index.html          # 3 Octaves maturity model page
├── ripples/
│   └── index.html          # RIPPLES AI transition playbook
├── 404.html                # Custom 404 page
├── assets/
│   ├── css/
│   │   ├── tailwind.css    # SOURCE - Edit this file
│   │   └── style.css       # COMPILED - Do not edit directly
│   ├── css/font/           # Inter font files
│   ├── img/                # Logos, OG images, favicons
│   └── js/
│       ├── site.js         # Nav highlight, progress bar, section reveal
│       └── trilpai.js      # Ripple Resonance game
├── docs/                   # Markdown documentation
│   ├── 3_octaves.md        # Full 3 Octaves philosophy document
│   ├── ripples.md          # RIPPLES AI transition guide
│   └── 37signals-principles.md  # 37signals principles reference
├── CNAME                   # Custom domain: trilp.in
├── robots.txt              # Search engine directives
├── sitemap.xml             # XML sitemap
├── humans.txt              # Human-readable attribution
├── package.json            # npm scripts for Tailwind
├── tailwind.config.js      # Tailwind v4 configuration
├── .editorconfig           # Editor formatting rules
├── .prettierrc             # Prettier configuration
└── .vscode/                # VSCode workspace settings
```

---

## Key Commands

```bash
# Install dependencies
npm install

# Build CSS (production, minified)
npm run build

# Watch mode (development)
npm run watch

# Local server
python -m http.server
```

---

## Important Conventions

### CSS
- **Edit only `assets/css/tailwind.css`** - this is the source file
- `assets/css/style.css` is generated - never edit directly
- Uses Tailwind v4 with `@theme` tokens for brand colors
- Custom properties defined in `:root` for header/footer heights

### JavaScript
- Pure vanilla JS, no dependencies
- IIFE pattern with `'use strict'`
- Uses `IntersectionObserver` for visibility-based optimizations
- `requestAnimationFrame` throttled scroll handlers
- LocalStorage for game high scores (key: `trilpai_ripple_best`)

### HTML
- Semantic HTML5 with ARIA attributes
- Focus-visible outlines for accessibility
- Skip-to-content link
- Structured data (JSON-LD) for SEO

### Code Style
- 2 spaces indentation
- Single quotes in JS
- Trailing commas (ES5 style)
- LF line endings
- Prettier for formatting

---

## Brand Colors (Tailwind Tokens)

```css
--color-brand-blue: #002b5b      /* Primary brand */
--color-brand-red: #d72638       /* Accent */
--color-brand-lightblue: #4f9df7 /* Interactive elements */
--color-brand-lightred: #ff4c4c  /* Alerts */
--color-ink: #0b1220             /* Text */
--color-paper: #ffffff           /* Background */
--color-paper-soft: #f7f8fa      /* Alternate sections */
--color-line: #e8ebf0            /* Borders */
--color-accent: #facc15          /* Nav highlight, progress bar */
```

---

## Interactive Game (trilpai.js)

### Ripple Resonance (`#ripple-resonance`)
- Emit ripples from center to hit pulsing target rings
- Brighter targets = more points
- 30-second timed rounds
- Score persisted to localStorage

---

## SEO & Metadata

- OpenGraph tags for social sharing
- Twitter Card support
- Local SEO metadata (Pune, Maharashtra)
- JSON-LD structured data: Organization, WebSite, WebPage
- Canonical URLs configured
- Sitemap and robots.txt present

---

## Documentation Files (docs/)

### 3_octaves.md
The complete "3 Octaves" philosophy - a maturity model for software engineering with 8 principles across 3 phases:
- **Octave 1:** Signal Definition (understanding before acting)
- **Octave 2:** Signal Construction (building what was meant)
- **Octave 3:** Signal Propagation (owning what runs)

### ripples.md
RIPPLES playbook for engineering leadership navigating AI transition:
- **Phase 1:** AI Accelerated (humans lead, AI assists)
- **Phase 2:** AI Native (AI leads routine, humans govern)
- **Phase 3:** AI Autonomous (AI operates within boundaries)

### 37signals-principles.md
Reference document of 37signals company principles (inspiration).

---

## Common Tasks

### Adding a new page
1. Create HTML file following existing structure
2. Include same header/footer markup
3. Add to `tailwind.config.js` content array
4. Run `npm run build`
5. Add to sitemap.xml

### Modifying styles
1. Edit `assets/css/tailwind.css`
2. Use existing `@theme` tokens where possible
3. Run `npm run build` or `npm run watch`
4. Never edit `style.css` directly

### Updating the game
1. Edit `assets/js/trilpai.js`
2. Game uses IIFE pattern with GameUtils
3. Test in browser with console open

---

## Do Not

- Edit `assets/css/style.css` directly (it's compiled output)
- Add npm dependencies unless absolutely necessary
- Use frameworks or bundlers (keep it simple)
- Add analytics beyond existing Google Analytics
- Change the fixed header/footer height without updating CSS variables

---

## Testing Checklist

- [ ] All pages render correctly (index, 3octaves, ripples, 404)
- [ ] Navigation highlights work on scroll
- [ ] Progress bar updates on scroll
- [ ] Ripple Resonance game functions on desktop and mobile
- [ ] Focus-visible outlines appear on keyboard navigation
- [ ] Reduced motion preferences respected
- [ ] OG images display correctly when shared
