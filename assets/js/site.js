// Trilp AI — site behaviors (nav highlight, progress, section reveal)
(() => {
  'use strict';

  const root = document.documentElement;

  const cssVarPx = (name, fallbackPx) => {
    const v = getComputedStyle(root).getPropertyValue(name).trim();
    const n = Number.parseFloat(v || '');
    return Number.isFinite(n) ? n : fallbackPx;
  };

  // ---- Active menu highlight (probe-line, avoids flicker) ----
  const initActiveNav = () => {
    const menuLinks = Array.from(document.querySelectorAll('a[data-nav]'));
    if (!menuLinks.length) return;

    const ids = menuLinks.map(a => a.dataset.nav).filter(Boolean);
    const sections = ids.map(id => document.getElementById(id)).filter(Boolean);

    const setActive = id => {
      for (const a of menuLinks) {
        const isActive = a.dataset.nav === id;
        a.classList.toggle('nav-highlight', isActive);
        a.classList.toggle('font-medium', isActive);

        // aria-current should be omitted when not active (don't set "false")
        if (isActive) a.setAttribute('aria-current', 'page');
        else a.removeAttribute('aria-current');
      }
    };

    const computeActiveId = () => {
      const headerH = cssVarPx('--header-h', 56);
      const probeY = headerH + 24;

      // default to first data-nav
      let active = ids[0] || 'home';

      for (const sec of sections) {
        const r = sec.getBoundingClientRect();
        if (r.top <= probeY && r.bottom > probeY) {
          active = sec.id;
          break;
        }
      }

      // Near bottom: prefer last section if present
      const d = document.documentElement;
      if (d.scrollTop + d.clientHeight >= d.scrollHeight - 8) {
        const last = sections[sections.length - 1];
        if (last) active = last.id;
      }

      return active;
    };

    let ticking = false;
    const onScrollOrResize = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        setActive(computeActiveId());
      });
    };

    const init = () => {
      const hashId = location.hash?.replace('#', '');
      if (hashId && document.getElementById(hashId)) {
        setActive(hashId);
      } else {
        setActive(computeActiveId());
      }
      onScrollOrResize();
    };

    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize, { passive: true });
    window.addEventListener('hashchange', init);

    // With `defer`, we can initialize immediately (no need to wait for window load)
    init();
  };

  // ---- Top scroll progress bar (rAF throttled) ----
  const initProgress = () => {
    const prog = document.getElementById('progress');
    if (!prog) return;

    let ticking = false;
    const update = () => {
      ticking = false;
      const h = document.documentElement;
      const denom = h.scrollHeight - h.clientHeight || 1;
      prog.style.width = (h.scrollTop / denom) * 100 + '%';
    };

    window.addEventListener(
      'scroll',
      () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(update);
      },
      { passive: true }
    );

    window.addEventListener('resize', () => requestAnimationFrame(update), { passive: true });

    // With `defer`, run once right away (still safe if layout changes later)
    update();
  };

  // ---- Section reveal (respects reduced motion + fallback) ----
  const initSectionReveal = () => {
    const sections = Array.from(document.querySelectorAll('main#main-content > section[id]'));
    if (!sections.length) return;

    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;
    if (reduce || !('IntersectionObserver' in window)) {
      sections.forEach(s => s.classList.add('section-in'));
      return;
    }

    const io = new IntersectionObserver(
      entries => {
        for (const e of entries) {
          if (!e.isIntersecting) continue;
          e.target.classList.add('section-in');
          io.unobserve(e.target);
        }
      },
      { threshold: 0.12, rootMargin: '0px 0px -10% 0px' }
    );

    sections.forEach(s => io.observe(s));
  };

  initActiveNav();
  initProgress();
  initSectionReveal();
})();
