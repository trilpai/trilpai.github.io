// Trilp AI — Games bundle (performance + accessibility tuned)
(() => {
  'use strict';

  // ---------- Utilities ----------
  const GameUtils = (() => {
    const storage = {
      getNumber(key, fallback = 0) {
        try {
          const v = localStorage.getItem(key);
          const n = Number(v);
          return Number.isFinite(n) ? n : fallback;
        } catch {
          return fallback;
        }
      },
      setString(key, value) {
        try {
          localStorage.setItem(key, String(value));
          return true;
        } catch {
          return false;
        }
      },
    };

    const debouncedSave = (() => {
      const timeouts = new Map();
      return (key, value, delay = 300) => {
        const t = timeouts.get(key);
        if (t) clearTimeout(t);
        const id = setTimeout(() => storage.setString(key, value), delay);
        timeouts.set(key, id);
      };
    })();

    function updateText(els, v) {
      const s = String(v);
      for (const el of els) if (el) el.textContent = s;
    }

    function createVisibilityObserver(el, onVisible, onHidden) {
      let visible = true;
      const obs = new IntersectionObserver(
        entries => {
          for (const e of entries) {
            const now = !!e.isIntersecting;
            if (now === visible) continue;
            visible = now;
            if (visible) onVisible?.();
            else onHidden?.();
          }
        },
        { threshold: 0.15 }
      );
      obs.observe(el);
      return () => obs.disconnect();
    }

    return { storage, debouncedSave, updateText, createVisibilityObserver };
  })();

  // ========================================================================
  // Focus Drift
  // ========================================================================
  (() => {
    const container = document.getElementById('focus-drift');
    if (!container) return;

    const dot = document.getElementById('fd-dot');
    const overlay = document.getElementById('fd-overlay');
    const scoreEl = document.getElementById('fd-score');
    const restartBtn = document.getElementById('fd-restart');

    const CONFIG = {
      DOT_R: 8,
      INITIAL_ZONE_INSET: 32,
      MIN_ZONE_INSET: 12,
      ZONE_SHRINK_RATE: 0.6,
      INITIAL_SPEED: 0.4,
      SPEED_GROWTH: 0.03,
      RANDOM_PUSH: 0.02,
      NUDGE_STRENGTH: 0.01,
    };

    let cx = 0,
      cy = 0,
      vx = 0,
      vy = 0;
    let zoneInset = CONFIG.INITIAL_ZONE_INSET;
    let startTime = 0;
    let rafId = 0;
    let running = false;
    let isVisible = true;

    function showOverlay(msg) {
      if (scoreEl) scoreEl.textContent = msg;
      overlay?.classList.remove('hidden');
      overlay?.classList.add('flex');
      overlay?.setAttribute('aria-live', 'assertive');
    }

    function hideOverlay() {
      overlay?.classList.add('hidden');
      overlay?.classList.remove('flex');
      overlay?.setAttribute('aria-live', 'polite');
    }

    function updateZoneEl() {
      const zone = document.getElementById('fd-zone');
      if (!zone) return;
      zone.style.inset = zoneInset + 'px';
    }

    function reset() {
      cancelAnimationFrame(rafId);

      const rect = container.getBoundingClientRect();
      cx = rect.width / 2;
      cy = rect.height / 2;

      vx = (Math.random() - 0.5) * CONFIG.INITIAL_SPEED;
      vy = (Math.random() - 0.5) * CONFIG.INITIAL_SPEED;

      zoneInset = CONFIG.INITIAL_ZONE_INSET;
      startTime = performance.now();
      running = true;

      hideOverlay();
      updateZoneEl();

      if (isVisible) loop();
    }

    function gameOver() {
      running = false;
      cancelAnimationFrame(rafId);
      const seconds = ((performance.now() - startTime) / 1000).toFixed(1);
      showOverlay(`You lasted ${seconds}s`);
    }

    function nudgeFromClientXY(clientX, clientY) {
      if (!running) return;
      const rect = container.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      const dx = cx - x;
      const dy = cy - y;

      vx += dx * CONFIG.NUDGE_STRENGTH;
      vy += dy * CONFIG.NUDGE_STRENGTH;
    }

    function nudgeFromCenter() {
      const rect = container.getBoundingClientRect();
      nudgeFromClientXY(rect.left + rect.width / 2, rect.top + rect.height / 2);
    }

    function loop() {
      if (!running || !isVisible) return;

      cx += vx;
      cy += vy;

      // gentle randomness
      vx += (Math.random() - 0.5) * CONFIG.RANDOM_PUSH;
      vy += (Math.random() - 0.5) * CONFIG.RANDOM_PUSH;

      // update DOM (single write each)
      if (dot) {
        dot.style.left = cx + 'px';
        dot.style.top = cy + 'px';
      }

      // Difficulty ramp
      const elapsed = (performance.now() - startTime) / 1000;
      const speed = CONFIG.INITIAL_SPEED + elapsed * CONFIG.SPEED_GROWTH;
      // normalize-ish: keep velocity from collapsing, but don’t explode
      const mag = Math.hypot(vx, vy) || 1;
      vx = (vx / mag) * Math.min(speed, 2.6);
      vy = (vy / mag) * Math.min(speed, 2.6);

      zoneInset = Math.max(
        CONFIG.MIN_ZONE_INSET,
        CONFIG.INITIAL_ZONE_INSET - elapsed * CONFIG.ZONE_SHRINK_RATE
      );
      updateZoneEl();

      // Containment check (math, no per-frame DOM reads)
      const rect = container.getBoundingClientRect();
      const min = zoneInset + CONFIG.DOT_R;
      const maxX = rect.width - zoneInset - CONFIG.DOT_R;
      const maxY = rect.height - zoneInset - CONFIG.DOT_R;

      if (cx < min || cx > maxX || cy < min || cy > maxY) {
        gameOver();
        return;
      }

      rafId = requestAnimationFrame(loop);
    }

    // Pointer input (needs non-passive because we call preventDefault)
    container.addEventListener(
      'pointerdown',
      e => {
        if (!running) return;
        e.preventDefault?.();
        nudgeFromClientXY(e.clientX, e.clientY);
      },
      { passive: false }
    );

    // Keyboard input
    container.addEventListener('keydown', e => {
      if (!running) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        nudgeFromCenter();
      }
    });

    restartBtn?.addEventListener('pointerup', e => {
      e.preventDefault?.();
      e.stopPropagation?.();
      reset();
    });

    // Pause when off-screen
    GameUtils.createVisibilityObserver(
      container,
      () => {
        isVisible = true;
        if (running) loop();
      },
      () => {
        isVisible = false;
        cancelAnimationFrame(rafId);
      }
    );

    reset();
  })();

  // ========================================================================
  // Stack the Thought
  // ========================================================================
  (() => {
    const root = document.getElementById('stack-thought');
    if (!root) return;

    const stage = document.getElementById('st-stage');
    const overlay = document.getElementById('st-overlay');
    const finalEl = document.getElementById('st-final');
    const restartBtn = document.getElementById('st-restart');

    const scoreEls = [document.getElementById('st-score')].filter(Boolean);
    const bestEls = [document.getElementById('st-best')].filter(Boolean);

    const STORAGE_KEY = 'trilpai_stack_best';
    const CONFIG = {
      PAD: 14,
      BLOCK_H: 16,
      GAP: 6,
      START_WIDTH_FRAC: 0.7,
      SPEED_BASE: 1.25,
      SPEED_INC: 0.08,
      TOLERANCE: 3,
    };

    let moving = document.getElementById('st-block');
    if (!moving) {
      moving = document.createElement('div');
      moving.id = 'st-block';
      moving.className =
        'absolute h-4 rounded-sm bg-brand-blue/70 shadow-[0_1px_0_rgba(0,43,91,0.22)]';
      stage?.appendChild(moving);
    }

    let rafId = 0;
    let running = false;
    let isVisible = true;

    let dir = 1;
    let speed = CONFIG.SPEED_BASE;
    let level = 0;

    let best = GameUtils.storage.getNumber(STORAGE_KEY, 0);

    let cachedW = 0;
    let cachedH = 0;

    const current = { width: 0, x: 0, y: 0 };
    let last = null;
    const stack = [];

    function refreshSize() {
      const r = root.getBoundingClientRect();
      cachedW = r.width;
      cachedH = r.height;
    }

    window.addEventListener('resize', refreshSize, { passive: true });

    function showOverlay(msg) {
      if (finalEl) finalEl.textContent = msg;
      overlay?.classList.remove('hidden');
      overlay?.classList.add('flex');
      overlay?.setAttribute('aria-live', 'assertive');
    }

    function hideOverlay() {
      overlay?.classList.add('hidden');
      overlay?.classList.remove('flex');
      overlay?.setAttribute('aria-live', 'polite');
    }

    function clearStack() {
      for (const item of stack) item.el.remove();
      stack.length = 0;
      last = null;
    }

    function px(n) {
      return `${Math.round(n)}px`;
    }

    function layoutMoving() {
      if (!moving) return;
      moving.style.width = px(current.width);
      moving.style.left = px(current.x);
      moving.style.top = px(current.y);
      moving.style.transform = 'none';
      moving.style.willChange = 'left, top, width';
    }

    function newMovingBlock() {
      const usable = cachedW - CONFIG.PAD * 2;
      const w = last ? last.width : usable * CONFIG.START_WIDTH_FRAC;

      const startFromLeft = level % 2 === 0;
      const x = startFromLeft ? CONFIG.PAD : CONFIG.PAD + usable - w;

      const y = cachedH - 18 - level * (CONFIG.BLOCK_H + CONFIG.GAP) - CONFIG.BLOCK_H;

      current.width = w;
      current.x = x;
      current.y = y;

      dir = startFromLeft ? 1 : -1;
      speed = CONFIG.SPEED_BASE + level * CONFIG.SPEED_INC;

      layoutMoving();
    }

    function makeStackBlock(x, y, width) {
      const el = document.createElement('div');
      el.className = 'absolute h-4 rounded-sm bg-brand-blue/70 shadow-[0_1px_0_rgba(0,43,91,0.22)]';
      el.style.left = px(x);
      el.style.top = px(y);
      el.style.width = px(width);
      stage?.appendChild(el);
      return el;
    }

    function gameOver() {
      running = false;
      cancelAnimationFrame(rafId);

      const score = level;
      showOverlay(`Score: ${score}`);

      if (score > best) {
        best = score;
        GameUtils.debouncedSave(STORAGE_KEY, best, 0);
        GameUtils.updateText(bestEls, best);
      }
    }

    function setScore(v) {
      GameUtils.updateText(scoreEls, v);
    }

    function drop() {
      if (!running) return;

      if (!last) {
        const el = makeStackBlock(current.x, current.y, current.width);
        stack.push({ el, x: current.x, y: current.y, width: current.width });
        last = { x: current.x, y: current.y, width: current.width };
        level += 1;
        setScore(level);
        newMovingBlock();
        return;
      }

      const overlapLeft = Math.max(current.x, last.x);
      const overlapRight = Math.min(current.x + current.width, last.x + last.width);
      const overlap = overlapRight - overlapLeft;

      if (overlap <= CONFIG.TOLERANCE) {
        gameOver();
        return;
      }

      const trimmedWidth = overlap;
      const trimmedX = overlapLeft;

      const el = makeStackBlock(trimmedX, current.y, trimmedWidth);
      stack.push({ el, x: trimmedX, y: current.y, width: trimmedWidth });
      last = { x: trimmedX, y: current.y, width: trimmedWidth };

      level += 1;
      setScore(level);

      if (current.y <= 20) {
        clearStack();
        last = null;
        newMovingBlock();
        return;
      }

      newMovingBlock();
    }

    function loop() {
      if (!running || !isVisible) return;

      const minX = CONFIG.PAD;
      const maxX = cachedW - CONFIG.PAD - current.width;

      current.x += dir * speed;

      if (current.x <= minX) {
        current.x = minX;
        dir = 1;
      } else if (current.x >= maxX) {
        current.x = maxX;
        dir = -1;
      }

      if (moving) {
        moving.style.left = px(current.x);
        moving.style.top = px(current.y);
      }

      rafId = requestAnimationFrame(loop);
    }

    function start() {
      refreshSize();
      clearStack();
      level = 0;

      setScore(0);
      GameUtils.updateText(bestEls, best);

      hideOverlay();
      newMovingBlock();

      running = true;
      if (isVisible) rafId = requestAnimationFrame(loop);
    }

    function onPointerDown(e) {
      if (!running) return;
      // prevent double-tap zoom on mobile
      e.preventDefault?.();
      drop();
    }

    root.addEventListener('pointerdown', onPointerDown, { passive: false });

    // Keyboard
    root.addEventListener('keydown', e => {
      if (!running) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        drop();
      }
    });

    restartBtn?.addEventListener('pointerup', e => {
      e.preventDefault?.();
      e.stopPropagation?.();
      start();
    });

    // Pause when off-screen
    GameUtils.createVisibilityObserver(
      root,
      () => {
        isVisible = true;
        if (running) loop();
      },
      () => {
        isVisible = false;
        cancelAnimationFrame(rafId);
      }
    );

    start();
  })();

  // ========================================================================
  // Signal vs Noise
  // ========================================================================
  (() => {
    const root = document.getElementById('signal-noise');
    if (!root) return;

    const gridEl = document.getElementById('sn-grid');
    const ruleEl = document.getElementById('sn-rule');
    const timeEl = document.getElementById('sn-time');

    const overlay = document.getElementById('sn-overlay');
    const finalEl = document.getElementById('sn-final');
    const restartBtn = document.getElementById('sn-restart');

    const scoreEl = document.getElementById('sn-score');
    const bestEl = document.getElementById('sn-best');

    if (!gridEl || !ruleEl || !timeEl || !overlay || !finalEl || !restartBtn || !scoreEl || !bestEl)
      return;

    const STORAGE_KEY = 'trilpai_signal_best';
    let best = GameUtils.storage.getNumber(STORAGE_KEY, 0);

    const CONFIG = {
      BASE_TIME: 15000,
      MIN_TIME: 6500,
      REVEAL_MS: 1200,
    };

    let score = 0;
    let running = false;
    let isVisible = true;

    let rule = null;
    let remainingSignals = 0;

    let rafId = 0;
    let roundStart = 0;
    let roundMs = CONFIG.BASE_TIME;

    const WORDS_REAL = [
      'clarity',
      'signal',
      'focus',
      'proof',
      'stack',
      'model',
      'craft',
      'method',
      'logic',
      'truth',
      'reason',
      'design',
    ];
    const WORDS_BUZZ = [
      'synergy',
      'disrupt',
      'hyper',
      'growth',
      'vibes',
      'viral',
      'scale',
      'hustle',
      'guru',
      'magic',
      'crypto',
      'ai-ai',
    ];

    function setScore(v) {
      score = v;
      scoreEl.textContent = String(v);
    }
    function setBest(v) {
      best = v;
      bestEl.textContent = String(v);
    }

    function showOverlay(msg) {
      finalEl.textContent = msg;
      overlay.classList.remove('hidden');
      overlay.classList.add('flex');
      overlay.setAttribute('aria-live', 'assertive');
    }
    function hideOverlay() {
      overlay.classList.add('hidden');
      overlay.classList.remove('flex');
      overlay.setAttribute('aria-live', 'polite');
    }

    function randInt(a, b) {
      return Math.floor(a + Math.random() * (b - a + 1));
    }

    function pickRule() {
      const r = randInt(1, 4);
      if (r === 1) return { id: 'prime', label: 'Tap PRIME numbers', kind: 'number' };
      if (r === 2) return { id: 'even', label: 'Tap EVEN numbers', kind: 'number' };
      if (r === 3) return { id: 'vowel', label: 'Tap words WITH a vowel', kind: 'word' };
      return { id: 'real', label: 'Tap REAL words (not buzz)', kind: 'word' };
    }

    function isPrime(n) {
      if (n < 2) return false;
      if (n % 2 === 0) return n === 2;
      for (let i = 3; i * i <= n; i += 2) if (n % i === 0) return false;
      return true;
    }

    function forceSignals(cells, minSignals = 5) {
      const indices = [];
      for (let i = 0; i < cells.length; i++) if (!cells[i].isSignal) indices.push(i);
      // randomly flip some to signal
      while (cells.filter(c => c.isSignal).length < minSignals && indices.length) {
        const j = indices.splice(randInt(0, indices.length - 1), 1)[0];
        cells[j].isSignal = true;
      }
    }

    function makeCells() {
      const w = root.getBoundingClientRect().width;
      const cols = w >= 640 ? 7 : 6;
      const rows = 6;
      const total = cols * rows;

      gridEl.innerHTML = '';

      const cells = [];

      if (rule.kind === 'number') {
        for (let i = 0; i < total; i++) {
          const n = randInt(10, 99);
          cells.push({ text: String(n), isSignal: rule.id === 'prime' ? isPrime(n) : n % 2 === 0 });
        }
      } else {
        for (let i = 0; i < total; i++) {
          if (rule.id === 'real') {
            const useReal = Math.random() < 0.32;
            const word = useReal
              ? WORDS_REAL[randInt(0, WORDS_REAL.length - 1)]
              : WORDS_BUZZ[randInt(0, WORDS_BUZZ.length - 1)];
            cells.push({ text: word, isSignal: useReal });
          } else {
            const useVowel = Math.random() < 0.55;
            const word = useVowel
              ? WORDS_REAL[randInt(0, WORDS_REAL.length - 1)]
              : ['rhythm', 'myth', 'crypt', 'brrr', 'tsktsk', 'nth'][randInt(0, 5)];
            const hasVowel = /[aeiou]/i.test(word);
            cells.push({ text: word, isSignal: hasVowel });
          }
        }
      }

      if (cells.filter(c => c.isSignal).length < 5) forceSignals(cells, 5);

      remainingSignals = cells.filter(c => c.isSignal).length;

      for (let idx = 0; idx < cells.length; idx++) {
        const c = cells[idx];
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'sn-cell';
        btn.textContent = c.text;
        btn.dataset.idx = String(idx);
        btn.dataset.signal = c.isSignal ? '1' : '0';
        gridEl.appendChild(btn);
      }
    }

    function endRound() {
      running = false;
      cancelAnimationFrame(rafId);
      showOverlay(`Score: ${score}`);

      if (score > best) {
        setBest(score);
        GameUtils.debouncedSave(STORAGE_KEY, best, 0);
      }
    }

    function tick(ts) {
      if (!running || !isVisible) return;

      const elapsed = ts - roundStart;
      const msLeft = Math.max(0, roundMs - elapsed);
      timeEl.textContent = (msLeft / 1000).toFixed(1);

      if (msLeft <= 0) {
        endRound();
        return;
      }
      rafId = requestAnimationFrame(tick);
    }

    function startRound() {
      hideOverlay();
      running = true;

      rule = pickRule();
      ruleEl.textContent = rule.label;

      makeCells();

      const difficulty = Math.min(1.6, 1 + score * 0.03);
      roundMs = Math.max(CONFIG.MIN_TIME, CONFIG.BASE_TIME / difficulty);

      roundStart = performance.now();
      tick(roundStart);

      root.classList.add('sn-reveal');
      setTimeout(() => root.classList.remove('sn-reveal'), CONFIG.REVEAL_MS);
    }

    function restart() {
      setScore(0);
      setBest(best);
      startRound();
    }

    // interactions
    gridEl.addEventListener(
      'pointerdown',
      e => {
        if (!running) return;
        const btn = e.target?.closest?.('.sn-cell');
        if (!btn) return;

        // no preventDefault necessary here; keep scroll smooth
        const isSignal = btn.dataset.signal === '1';
        if (btn.dataset.used === '1') return;
        btn.dataset.used = '1';

        if (isSignal) {
          btn.classList.add('is-hit');
          setScore(score + 1);
          remainingSignals -= 1;
          if (remainingSignals <= 0) startRound();
        } else {
          btn.classList.add('is-miss');
          setScore(Math.max(0, score - 1));
        }
      },
      { passive: true }
    );

    // Keyboard support: Space/Enter activates focused cell
    gridEl.addEventListener('keydown', e => {
      const btn = e.target?.closest?.('.sn-cell');
      if (!btn) return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        btn.dispatchEvent(new PointerEvent('pointerdown', { bubbles: true }));
      }
    });

    restartBtn.addEventListener('pointerup', e => {
      e.preventDefault?.();
      e.stopPropagation?.();
      restart();
    });

    // Pause when off-screen
    GameUtils.createVisibilityObserver(
      root,
      () => {
        isVisible = true;
        if (running) rafId = requestAnimationFrame(tick);
      },
      () => {
        isVisible = false;
        cancelAnimationFrame(rafId);
      }
    );

    setBest(best);
    restart();
  })();
})();
