# Trilp AI — Official Website

**Trilp AI** was an independent software consulting studio based in Pune, India, operating from late 2022 through 2025.

This repository contains the source code for the official website: **https://www.trilp.in**

The site is preserved as a record of that independent consulting phase and showcases the engineering philosophies developed during that time.

---

## Philosophy

The site features two engineering frameworks:

### 3 Octaves
A maturity model for software engineering with 8 principles across 3 phases:
- **Octave 1:** Signal Definition (understanding before acting)
- **Octave 2:** Signal Construction (building what was meant)
- **Octave 3:** Signal Propagation (owning what runs)

### RIPPLES
A practical guide for engineering leadership navigating the AI transition:
- **Phase 1:** AI Accelerated (humans lead, AI assists)
- **Phase 2:** AI Native (AI leads routine, humans govern)
- **Phase 3:** AI Autonomous (AI operates within boundaries)

---

## Live Website

**Primary (Custom Domain):**
https://www.trilp.in

**Backup (GitHub Pages):**
https://trilpai.github.io

---

## Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Site | Static HTML | Fast, reliable, low maintenance |
| Styling | Tailwind CSS v4 (locally compiled) | Utility-first, clean, expressive |
| Fonts | Inter (local `.woff2`) | Professional, readable on all devices |
| JavaScript | Vanilla ES6+ | No dependencies, minimal footprint |
| Deployment | GitHub Pages | Zero-infrastructure, HTTPS, auto-deploy |

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
│   │   ├── tailwind.css    # Source styles (edit this)
│   │   └── style.css       # Compiled styles (do not edit)
│   ├── css/font/           # Inter font files
│   ├── img/                # Logos, OG images, favicons
│   └── js/
│       ├── site.js         # Nav highlight, progress bar
│       └── trilpai.js      # Ripple Resonance game
├── docs/                   # Source markdown documentation
│   ├── 3_octaves.md        # 3 Octaves philosophy
│   ├── ripples.md          # RIPPLES framework
│   └── 37signals-principles.md  # Reference material
├── CNAME                   # Custom domain configuration
├── robots.txt              # Search engine instructions
├── sitemap.xml             # XML sitemap
└── humans.txt              # Human-readable attribution
```

---

## Development

Install dependencies:

```sh
npm install
```

Build CSS:

```sh
npm run build
```

Watch & rebuild on save:

```sh
npm run watch
```

Local server:

```sh
python -m http.server
```

> **Note:** Edit only `assets/css/tailwind.css`.
> `assets/css/style.css` is generated — do not modify directly.

---

## Deployment

Commit and push to `main`:

```sh
git add .
git commit -m "Update website"
git push
```

GitHub Pages deploys automatically.

---

## SEO & Metadata

The site includes:
- Organization + WebSite + WebPage schema (JSON-LD)
- OpenGraph preview cards for social sharing
- Twitter/LinkedIn/WhatsApp friendly share images
- Local SEO metadata for Pune, Maharashtra
- Canonical URLs, sitemap, and robots.txt

---

## License & Branding

This project is released under the **MIT License**.
See [`LICENSE`](LICENSE) for the complete text.

> **The Trilp AI name, logo, and brand identity are proprietary.**
> They may not be reused for representation, marketing, or commercial use without explicit permission.

---

## Contact

**Email:** info@trilp.in
**Location:** Pune, Maharashtra, India
**Founder:** Pradyumna Das Roy

Social links:
- [LinkedIn](https://www.linkedin.com/company/trilpai)
- [YouTube](https://www.youtube.com/@trilpai)
- [Instagram](https://www.instagram.com/trilpai/)
- [GitHub](https://github.com/trilpai)
- [Facebook](https://www.facebook.com/trilpai)

---

*Preserved as a record of independent work — now concluded.*
