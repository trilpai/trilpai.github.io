# AGENTS.md - AI Agent Instructions for trilpai.github.io

## Quick Reference

**Project:** Trilp AI website (static HTML + Tailwind CSS + vanilla JS)
**URL:** https://www.trilp.in
**Deployment:** GitHub Pages (auto-deploy on push to `main`)
**Status:** Preserved record of consulting work (concluded late 2025)

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                    GitHub Pages                          │
│                    (Static Host)                         │
└─────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┐
        │                  │                  │
   index.html        3octaves/           ripples/
   (Main + Game)     index.html          index.html
        │            (Philosophy)        (AI Playbook)
   ┌────┴────┐
   │ assets/ │
   ├─────────┤
   │ css/    │ ← tailwind.css (source) → style.css (compiled)
   │ js/     │ ← site.js + trilpai.js (vanilla ES6+)
   │ img/    │ ← logos, favicons, OG images
   │ font/   │ ← Inter variable font
   └─────────┘
```

---

## Site Pages

| Page | URL | Purpose |
|------|-----|---------|
| Home | `/` | Landing with 3 Octaves intro, Ripples game, About section |
| 3 Octaves | `/3octaves/` | Full 3 Octaves maturity model philosophy |
| RIPPLES | `/ripples/` | AI transition playbook for engineering leadership |
| 404 | `/404.html` | Custom error page |

---

## File Responsibilities

| File | Purpose | Editable |
|------|---------|----------|
| `index.html` | Landing page with Ripple Resonance game | Yes |
| `3octaves/index.html` | 3 Octaves maturity model content | Yes |
| `ripples/index.html` | RIPPLES AI transition playbook | Yes |
| `assets/css/tailwind.css` | Tailwind source with @theme tokens | **Yes - Primary CSS source** |
| `assets/css/style.css` | Compiled CSS output | **No - Never edit** |
| `assets/js/site.js` | Nav highlighting, progress bar, reveals | Yes |
| `assets/js/trilpai.js` | Ripple Resonance game | Yes |
| `docs/*.md` | Philosophy documentation | Yes (content only) |

---

## Development Workflow

1. **Setup:** `npm install`
2. **Development:** `npm run watch` (auto-recompiles CSS)
3. **Production:** `npm run build` (minified CSS)
4. **Preview:** `python -m http.server` or any static server
5. **Deploy:** Push to `main` branch

---

## Key Patterns

### JavaScript Game Structure
```javascript
(() => {
  'use strict';

  const root = document.getElementById('game-id');
  if (!root) return;

  // State
  let running = false;
  let isVisible = true;

  // Use IntersectionObserver for visibility
  GameUtils.createVisibilityObserver(root, onVisible, onHidden);

  // Use rAF for animations
  function loop() {
    if (!running || !isVisible) return;
    // ... game logic
    requestAnimationFrame(loop);
  }
})();
```

### Tailwind Theme Tokens
```css
@theme {
  --color-brand-blue: #002b5b;
  --color-brand-lightblue: #4f9df7;
  --color-ink: #0b1220;
  --color-paper: #ffffff;
  --color-accent: #facc15;
}
```

### Accessibility Pattern
```html
<section id="section-name" aria-label="Section description">
  <!-- Content with focus-visible outlines -->
  <button class="focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-lightblue">
    Action
  </button>
</section>
```

---

## Constraints

### Must Do
- Preserve ARIA attributes and accessibility features
- Maintain JSON-LD structured data
- Use semantic HTML elements
- Keep JavaScript dependency-free
- Test with keyboard navigation

### Must Not
- Edit `style.css` directly
- Add external JavaScript libraries
- Remove skip-to-content links
- Break reduced-motion support
- Change localStorage key prefixes

---

## Testing Priorities

1. **Visual:** Pages render correctly across browsers
2. **Interactive:** Game responds to mouse, touch, and keyboard
3. **Accessible:** Screen reader compatible, focus visible
4. **Performance:** Animations smooth, no layout thrashing
5. **SEO:** OG images and structured data valid

---

## Documentation Reference

- **3 Octaves Philosophy:** `docs/3_octaves.md`
- **RIPPLES Playbook:** `docs/ripples.md`
- **37signals Principles:** `docs/37signals-principles.md`

### 3 Octaves (8 principles × 3 phases)
- Octave 1: Signal Definition (clarity, thinking)
- Octave 2: Signal Construction (building, verification)
- Octave 3: Signal Propagation (operations, ownership)

### RIPPLES (3 phases of AI transition)
- Phase 1: AI Accelerated (humans lead, AI assists)
- Phase 2: AI Native (AI leads routine, humans govern)
- Phase 3: AI Autonomous (AI operates within boundaries)
