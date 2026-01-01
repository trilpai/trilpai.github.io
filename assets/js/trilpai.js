// Trilp AI — Focus Drift (pointer-events unified; reliable restart)
(() => {
  const container = document.getElementById('focus-drift');
  if (!container) return;

  const dot = document.getElementById('fd-dot');
  const zone = document.getElementById('fd-zone');
  const overlay = document.getElementById('fd-overlay');
  const scoreEl = document.getElementById('fd-score');
  const restartBtn = document.getElementById('fd-restart');

  let cx, cy, vx, vy;
  let zoneInset = 32;
  let driftSpeed = 0.4;
  let startTime;
  let rafId;
  let running = true;

  function reset() {
    // stop any existing loop cleanly
    cancelAnimationFrame(rafId);

    const rect = container.getBoundingClientRect();
    cx = rect.width / 2;
    cy = rect.height / 2;

    // re-seed velocity
    vx = (Math.random() - 0.5) * driftSpeed;
    vy = (Math.random() - 0.5) * driftSpeed;

    zoneInset = 32;
    driftSpeed = 0.4;
    startTime = performance.now();
    running = true;

    overlay?.classList.add('hidden');
    overlay?.classList.remove('flex');

    updateZone();
    loop();
  }

  function updateZone() {
    if (!zone) return;
    zone.style.inset = zoneInset + 'px';
  }

  function loop() {
    if (!running) return;

    cx += vx;
    cy += vy;

    // gentle randomness
    vx += (Math.random() - 0.5) * 0.02;
    vy += (Math.random() - 0.5) * 0.02;

    dot.style.left = cx + 'px';
    dot.style.top = cy + 'px';

    const z = zone.getBoundingClientRect();
    const d = dot.getBoundingClientRect();

    if (d.left < z.left || d.right > z.right || d.top < z.top || d.bottom > z.bottom) {
      gameOver();
      return;
    }

    // difficulty ramp
    const elapsed = (performance.now() - startTime) / 1000;
    driftSpeed = 0.4 + elapsed * 0.03;
    zoneInset = Math.max(12, 32 - elapsed * 0.6);
    updateZone();

    rafId = requestAnimationFrame(loop);
  }

  function gameOver() {
    running = false;
    cancelAnimationFrame(rafId);

    const seconds = ((performance.now() - startTime) / 1000).toFixed(1);
    if (scoreEl) scoreEl.textContent = `You lasted ${seconds}s`;

    overlay?.classList.remove('hidden');
    overlay?.classList.add('flex');
  }

  function nudgeFromClientXY(clientX, clientY) {
    if (!running) return;

    const rect = container.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const dx = cx - x;
    const dy = cy - y;

    vx += dx * 0.01;
    vy += dy * 0.01;
  }

  // Unified input: pointerdown for mouse + touch + pen (prevents ghost clicks)
  container.addEventListener(
    'pointerdown',
    e => {
      // prevent double-tap zoom / selection oddities
      e.preventDefault?.();
      nudgeFromClientXY(e.clientX, e.clientY);
    },
    { passive: false }
  );

  // Reliable restart (same approach as Stack)
  restartBtn?.addEventListener('pointerup', e => {
    e.preventDefault?.();
    e.stopPropagation?.();
    reset();
  });

  reset();
})();

// Trilp AI — Stack the Thought
(() => {
  const root = document.getElementById('stack-thought');
  if (!root) return;

  const stage = document.getElementById('st-stage');
  const overlay = document.getElementById('st-overlay');
  const finalEl = document.getElementById('st-final');
  const restartBtn = document.getElementById('st-restart');

  const scoreEl = document.getElementById('st-score');
  const bestEl = document.getElementById('st-best');
  const scoreElM = document.getElementById('st-score-m');
  const bestElM = document.getElementById('st-best-m');

  const STORAGE_KEY = 'trilpai_stack_best';

  // --- Ensure moving block exists (robust if HTML changes) ---
  let moving = document.getElementById('st-block');
  if (!moving) {
    moving = document.createElement('div');
    moving.id = 'st-block';
    moving.className =
      'absolute h-4 rounded-sm bg-brand-blue/70 shadow-[0_1px_0_rgba(0,43,91,0.22)]';
    stage.appendChild(moving);
  }

  // State
  let rafId = null;
  let running = false;

  let dir = 1; // 1 -> right, -1 -> left
  let speed = 1.25; // px per frame baseline
  let level = 0; // number of successful drops
  let best = Number(localStorage.getItem(STORAGE_KEY) || 0);

  let current = {
    width: 0, // px
    x: 0, // left px (within root)
    y: 0, // top px
  };

  let last = null; // last stacked block {x,width,y}
  const stack = []; // DOM nodes + geometry

  // Helpers
  function setText(el, v) {
    if (el) el.textContent = String(v);
  }

  function setScore(v) {
    setText(scoreEl, v);
    setText(scoreElM, v);
  }

  function setBest(v) {
    setText(bestEl, v);
    setText(bestElM, v);
  }

  function px(n) {
    return `${Math.round(n)}px`;
  }

  function rootRect() {
    return root.getBoundingClientRect();
  }

  function resetUI() {
    if (!overlay) return;
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }

  function showOverlay() {
    if (!overlay) return;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  }

  function clearStack() {
    stack.forEach(item => item.el.remove());
    stack.length = 0;
    last = null;
  }

  function layoutMoving() {
    moving.style.width = px(current.width);
    moving.style.left = px(current.x);
    moving.style.top = px(current.y);
    moving.style.transform = 'none'; // we position via px
  }

  function newMovingBlock() {
    const r = rootRect();
    const pad = 14; // inner comfort
    const usable = r.width - pad * 2;

    // Start width: 70% of container, but if last exists, inherit last width
    const w = last ? last.width : usable * 0.7;

    // Alternate direction looks nice
    const startFromLeft = level % 2 === 0;
    const x = startFromLeft ? pad : pad + usable - w;

    // Vertical position: stack from bottom
    const blockH = 16;
    const gap = 6;
    const y = r.height - 18 - level * (blockH + gap) - blockH;

    current.width = w;
    current.x = x;
    current.y = y;

    dir = startFromLeft ? 1 : -1;

    // Difficulty ramps gently
    speed = 1.25 + level * 0.08;

    layoutMoving();
  }

  function makeStackBlock(x, y, width) {
    const el = document.createElement('div');
    el.className = 'absolute h-4 rounded-sm bg-brand-blue/70 shadow-[0_1px_0_rgba(0,43,91,0.22)]';
    el.style.left = px(x);
    el.style.top = px(y);
    el.style.width = px(width);
    stage.appendChild(el);
    return el;
  }

  function gameOver() {
    running = false;
    cancelAnimationFrame(rafId);

    const score = level;
    if (finalEl) finalEl.textContent = `Score: ${score}`;

    if (score > best) {
      best = score;
      localStorage.setItem(STORAGE_KEY, String(best));
      setBest(best);
    }

    showOverlay();
  }

  function drop() {
    if (!running) return;

    // First drop: accept as base
    if (!last) {
      const el = makeStackBlock(current.x, current.y, current.width);
      stack.push({ el, x: current.x, y: current.y, width: current.width });
      last = { x: current.x, y: current.y, width: current.width };
      level += 1;
      setScore(level);
      newMovingBlock();
      return;
    }

    // Compare with last for overlap
    const overlapLeft = Math.max(current.x, last.x);
    const overlapRight = Math.min(current.x + current.width, last.x + last.width);
    const overlap = overlapRight - overlapLeft;

    // Small tolerance (feels fair)
    const tolerance = 3;
    if (overlap <= tolerance) {
      gameOver();
      return;
    }

    // Trim to overlap
    const trimmedWidth = overlap;
    const trimmedX = overlapLeft;

    const el = makeStackBlock(trimmedX, current.y, trimmedWidth);
    stack.push({ el, x: trimmedX, y: current.y, width: trimmedWidth });
    last = { x: trimmedX, y: current.y, width: trimmedWidth };

    level += 1;
    setScore(level);

    // If stack reaches top-ish, keep calm: recycle
    if (current.y <= 20) {
      clearStack();
      last = null;
      newMovingBlock();
      return;
    }

    newMovingBlock();
  }

  function loop() {
    if (!running) return;

    const r = rootRect();
    const pad = 14;
    const minX = pad;
    const maxX = r.width - pad - current.width;

    current.x += dir * speed;

    if (current.x <= minX) {
      current.x = minX;
      dir = 1;
    } else if (current.x >= maxX) {
      current.x = maxX;
      dir = -1;
    }

    moving.style.left = px(current.x);
    moving.style.top = px(current.y);

    rafId = requestAnimationFrame(loop);
  }

  function start() {
    clearStack();
    level = 0;
    setScore(0);
    setBest(best);
    resetUI();

    newMovingBlock();
    running = true;
    rafId = requestAnimationFrame(loop);
  }

  // --- EVENTS ---
  // Use pointer events (fixes mobile/touch + desktop in one go)
  function onPointerDown(e) {
    if (!running) return;
    // prevents double-tap zoom + accidental text selection on mobile
    e.preventDefault?.();
    drop();
  }

  root.addEventListener('pointerdown', onPointerDown, { passive: false });

  // Try again must work on mobile:
  // - use pointerup
  // - stopPropagation so the underlying board doesn't also receive the event
  restartBtn?.addEventListener('pointerup', e => {
    e.preventDefault?.();
    e.stopPropagation?.();
    start();
  });

  // Start on load
  start();
})();

// Trilp AI — Signal vs Noise
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

  if (!gridEl || !ruleEl || !timeEl || !overlay || !finalEl || !restartBtn || !scoreEl || !bestEl) {
    console.error('[SignalNoise] Missing required DOM elements.');
    return;
  }

  const STORAGE_KEY = 'trilpai_signal_best';
  let best = Number(localStorage.getItem(STORAGE_KEY) || 0);

  let score = 0;
  let running = false;

  // round config
  let roundMs = 9000; // total time per round
  let revealMs = 1200; // rule visible strongly at start
  let tickId = null;
  let endAt = 0;

  let rule = null;
  let signalSet = new Set(); // indices that are "signal"
  let remainingSignals = 0;

  function setText(el, v) {
    el.textContent = String(v);
  }
  function setScore(v) {
    score = v;
    setText(scoreEl, v);
  }
  function setBest(v) {
    best = v;
    setText(bestEl, v);
  }

  function showOverlay(msg) {
    finalEl.textContent = msg;
    overlay.classList.remove('hidden');
    overlay.classList.add('flex');
  }

  function hideOverlay() {
    overlay.classList.add('hidden');
    overlay.classList.remove('flex');
  }

  function randInt(a, b) {
    return Math.floor(a + Math.random() * (b - a + 1));
  }

  // ---- Rules ----
  // We keep it simple + readable + calm:
  // 1) Prime numbers
  // 2) Even numbers
  // 3) Contains a vowel (letters)
  // 4) Buzzword vs real word (tiny curated set)
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

  function makeCells() {
    // grid size adapts a bit by viewport
    const w = root.getBoundingClientRect().width;
    const cols = w >= 640 ? 7 : 6;
    const rows = w >= 640 ? 6 : 6;
    const total = cols * rows;

    gridEl.innerHTML = '';
    signalSet = new Set();

    const cells = [];

    if (rule.kind === 'number') {
      // numbers between 10..99
      for (let i = 0; i < total; i++) {
        const n = randInt(10, 99);
        cells.push({ text: String(n), isSignal: rule.id === 'prime' ? isPrime(n) : n % 2 === 0 });
      }
    } else {
      // words
      for (let i = 0; i < total; i++) {
        if (rule.id === 'real') {
          // mostly noise buzz, some real
          const useReal = Math.random() < 0.32;
          const word = useReal
            ? WORDS_REAL[randInt(0, WORDS_REAL.length - 1)]
            : WORDS_BUZZ[randInt(0, WORDS_BUZZ.length - 1)];
          cells.push({ text: word, isSignal: useReal });
        } else {
          // vowel rule: mix vowel words and consonant-only strings
          const useVowel = Math.random() < 0.55;
          const word = useVowel
            ? WORDS_REAL[randInt(0, WORDS_REAL.length - 1)]
            : ['rhythm', 'myth', 'crypt', 'brrr', 'tsktsk', 'nth'][randInt(0, 5)];
          const hasVowel = /[aeiou]/i.test(word);
          cells.push({ text: word, isSignal: hasVowel });
        }
      }
    }

    // Ensure at least a few signals exist
    let signalCount = cells.filter(c => c.isSignal).length;
    if (signalCount < 5) {
      // force some signals
      for (let i = 0; i < 6; i++) cells[i].isSignal = true;
      signalCount = cells.filter(c => c.isSignal).length;
    }
    remainingSignals = signalCount;

    // render
    cells.forEach((c, idx) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'sn-cell';
      btn.textContent = c.text;
      btn.dataset.idx = String(idx);
      btn.dataset.signal = c.isSignal ? '1' : '0';
      gridEl.appendChild(btn);

      if (c.isSignal) signalSet.add(idx);
    });
  }

  function endRound(reason = 'Time.') {
    running = false;
    clearInterval(tickId);
    tickId = null;

    // scoring: if you cleared all signals early, bonus
    const msg = `Score: ${score}`;
    showOverlay(msg);

    if (score > best) {
      setBest(score);
      localStorage.setItem(STORAGE_KEY, String(best));
    }
  }

  function tick() {
    const msLeft = Math.max(0, endAt - performance.now());
    const sLeft = (msLeft / 1000).toFixed(1);
    timeEl.textContent = sLeft;

    if (msLeft <= 0) endRound('Time');
  }

  function startRound() {
    hideOverlay();
    running = true;

    rule = pickRule();
    ruleEl.textContent = rule.label;

    makeCells();

    const BASE_TIME = 15000; // 15 seconds for early rounds
    const MIN_TIME = 6500; // never go below ~6.5s

    const difficulty = Math.min(1.6, 1 + score * 0.03);
    roundMs = Math.max(MIN_TIME, BASE_TIME / difficulty);

    endAt = performance.now() + roundMs;
    tick();
    clearInterval(tickId);
    tickId = setInterval(tick, 100);

    // rule “reveal” feel (slightly stronger for first ~revealMs)
    root.classList.add('sn-reveal');
    setTimeout(() => root.classList.remove('sn-reveal'), revealMs);
  }

  function restart() {
    setScore(0);
    setBest(best);
    startRound();
  }

  // --- interactions ---
  gridEl.addEventListener(
    'pointerdown',
    e => {
      if (!running) return;

      const btn = e.target?.closest?.('.sn-cell');
      if (!btn) return;

      e.preventDefault?.();

      const idx = Number(btn.dataset.idx);
      const isSignal = btn.dataset.signal === '1';

      // prevent double tapping same cell for score
      if (btn.dataset.used === '1') return;
      btn.dataset.used = '1';

      if (isSignal) {
        btn.classList.add('is-hit');
        setScore(score + 1);
        remainingSignals -= 1;

        // round clear -> next round immediately (calm)
        if (remainingSignals <= 0) startRound();
      } else {
        btn.classList.add('is-miss');
        // penalty: -1 but not below 0
        setScore(Math.max(0, score - 1));
      }
    },
    { passive: false }
  );

  restartBtn.addEventListener('pointerup', e => {
    e.preventDefault?.();
    e.stopPropagation?.();
    restart();
  });

  // init
  setBest(best);
  restart();
})();
