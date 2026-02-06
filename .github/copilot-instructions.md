# GitHub Copilot Instructions for trilpai.github.io

## Project Summary

Static website for **Trilp AI**, a software consulting studio (concluded late 2025). Built with HTML, Tailwind CSS v4, and vanilla JavaScript. Hosted on GitHub Pages.

## Site Structure

- `/` - Home page with 3 Octaves intro, Ripples game, About
- `/3octaves/` - Full 3 Octaves philosophy
- `/ripples/` - RIPPLES AI transition playbook
- `/404.html` - Error page

## Technology Choices

- **No frameworks** - Pure static HTML
- **Tailwind CSS v4** - Source file is `assets/css/tailwind.css`
- **Vanilla JavaScript** - ES6+ with IIFE modules
- **No bundlers** - Direct browser loading

## Code Generation Guidelines

### When writing CSS

Always add to `assets/css/tailwind.css`, never `style.css`. Use existing theme tokens:

```css
/* Use these color tokens */
var(--color-brand-blue)      /* #002b5b */
var(--color-brand-lightblue) /* #4f9df7 */
var(--color-ink)             /* #0b1220 */
var(--color-paper)           /* #ffffff */
var(--color-accent)          /* #facc15 */
```

### When writing JavaScript

Use this IIFE pattern:

```javascript
(() => {
  'use strict';

  const element = document.getElementById('target');
  if (!element) return;

  // Your code here
})();
```

Use `requestAnimationFrame` for animations. Use `IntersectionObserver` for visibility detection.

### When writing HTML

Include accessibility attributes:

```html
<section id="section-id" aria-label="Description">
  <button
    type="button"
    class="focus:outline-none focus-visible:outline-2 focus-visible:outline-brand-lightblue"
  >
    Button text
  </button>
</section>
```

## File Edit Rules

| File Pattern | Rule |
|--------------|------|
| `assets/css/tailwind.css` | Source CSS - OK to edit |
| `assets/css/style.css` | Compiled - NEVER edit |
| `assets/js/*.js` | Vanilla JS only |
| `*.html` | Semantic HTML with ARIA |

## Build Commands

```bash
npm run build  # Compile Tailwind (production)
npm run watch  # Watch mode (development)
```

## Key Conventions

1. **2 spaces** for indentation
2. **Single quotes** in JavaScript
3. **LF line endings**
4. **No trailing semicolons** optional but be consistent
5. **Trailing commas** in multi-line arrays/objects

## Accessibility Requirements

- All interactive elements must be keyboard accessible
- Use `focus-visible` for focus outlines
- Include `aria-label` on sections and buttons
- Maintain skip-to-content link
- Respect `prefers-reduced-motion`

## Philosophy Documentation

- `docs/3_octaves.md` - 3 Octaves maturity model (8 principles × 3 phases)
- `docs/ripples.md` - RIPPLES AI transition playbook (3 phases)
