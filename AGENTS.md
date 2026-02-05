# AGENTS.md - AI Agent Instructions for trilpai.github.io

## Quick Reference

**Project:** Trilp AI website (static HTML + Tailwind CSS + vanilla JS)
**URL:** https://www.trilp.in
**Deployment:** GitHub Pages (auto-deploy on push to `main`)

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
   index.html        3octaves/           404.html
   (Main page)       index.html          (Error page)
        │
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

## File Responsibilities

| File | Purpose | Editable |
|------|---------|----------|
| `index.html` | Landing page with 3 interactive games | Yes |
| `3octaves/index.html` | 3 Octaves maturity model content | Yes |
| `assets/css/tailwind.css` | Tailwind source with @theme tokens | **Yes - Primary CSS source** |
| `assets/css/style.css` | Compiled CSS output | **No - Never edit** |
| `assets/js/site.js` | Nav highlighting, progress bar, reveals | Yes |
| `assets/js/trilpai.js` | Three interactive games | Yes |
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
2. **Interactive:** Games respond to mouse, touch, and keyboard
3. **Accessible:** Screen reader compatible, focus visible
4. **Performance:** Animations smooth, no layout thrashing
5. **SEO:** OG images and structured data valid

---

## Documentation Reference

- **3 Octaves Philosophy:** `docs/3_octaves.md`
- **RIPPLES AI Guide:** `docs/ripples.md`
- **37signals Principles:** `docs/37signals-principles.md`

These documents inform the site's design philosophy and content. The 3 Octaves model has 24 principles across 3 phases (8 each):
- Octave 1: Signal Definition (clarity, thinking)
- Octave 2: Signal Construction (building, verification)
- Octave 3: Signal Propagation (operations, ownership)
