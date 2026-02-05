// Trilp AI — Ripple Resonance Game
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

    return { storage, createVisibilityObserver };
  })();

  // ========================================================================
  // Ripple Resonance
  // ========================================================================
  (() => {
    const container = document.getElementById('ripple-resonance');
    if (!container) return;

    const canvas = document.getElementById('rr-canvas');
    const ctx = canvas?.getContext('2d');
    const centerEl = document.getElementById('rr-center');
    const overlay = document.getElementById('rr-overlay');
    const finalEl = document.getElementById('rr-final');
    const restartBtn = document.getElementById('rr-restart');
    const scoreEl = document.getElementById('rr-score');
    const bestEl = document.getElementById('rr-best');
    const timeEl = document.getElementById('rr-time');

    if (!canvas || !ctx) return;

    const STORAGE_KEY = 'trilpai_ripple_best';
    const CONFIG = {
      GAME_DURATION: 30000, // 30 seconds
      RIPPLE_SPEED: 3,
      RIPPLE_FADE: 0.008,
      TARGET_PULSE_SPEED: 0.015, // Slower pulse for easier timing
      TARGET_WINDOW: 0.5, // Much wider timing window (top 50% of pulse)
      COLLISION_TOLERANCE: 25, // Wider collision detection
      TARGET_SPAWN_INTERVAL: 2500,
      MIN_TARGET_RADIUS: 0.2,
      MAX_TARGET_RADIUS: 0.42,
    };

    // Colors
    const COLORS = {
      ripple: 'rgba(79, 157, 247, 0.6)',
      rippleFade: 'rgba(79, 157, 247, 0)',
      target: 'rgba(79, 157, 247, 0.3)',
      targetActive: 'rgba(79, 157, 247, 0.8)',
      hit: 'rgba(79, 157, 247, 0.9)',
      miss: 'rgba(215, 38, 56, 0.6)',
      guide: 'rgba(11, 18, 32, 0.06)',
    };

    let score = 0;
    let best = GameUtils.storage.getNumber(STORAGE_KEY, 0);
    let running = false;
    let isVisible = true;
    let rafId = 0;

    let ripples = [];
    let targets = [];
    let hitEffects = [];
    let particles = [];
    let scorePopups = [];
    let targetsHit = 0;
    let lastSpawnTime = 0;
    let gameStartTime = 0;

    let canvasSize = { w: 0, h: 0 };
    let center = { x: 0, y: 0 };

    function resizeCanvas() {
      const rect = container.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvasSize.w = rect.width;
      canvasSize.h = rect.height;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + 'px';
      canvas.style.height = rect.height + 'px';
      ctx.scale(dpr, dpr);
      center.x = canvasSize.w / 2;
      center.y = canvasSize.h / 2;
    }

    function updateScore(val) {
      score = val;
      if (scoreEl) scoreEl.textContent = String(score);
    }

    function updateBest(val) {
      best = val;
      if (bestEl) bestEl.textContent = String(best);
      GameUtils.storage.setString(STORAGE_KEY, best);
    }

    function showOverlay(msg) {
      if (finalEl) finalEl.textContent = msg;
      overlay?.classList.remove('hidden');
      overlay?.classList.add('flex');
    }

    function hideOverlay() {
      overlay?.classList.add('hidden');
      overlay?.classList.remove('flex');
    }

    function emitRipple() {
      if (!running) return;
      ripples.push({
        radius: 24,
        opacity: 1,
        maxRadius: Math.max(canvasSize.w, canvasSize.h),
      });

      // Pulse animation on center
      centerEl?.classList.add('scale-90');
      setTimeout(() => centerEl?.classList.remove('scale-90'), 100);
    }

    function createHitCelebration(targetRadius, points) {
      // Create particles bursting outward from the hit location
      const numParticles = 12 + Math.floor(points / 2);
      for (let i = 0; i < numParticles; i++) {
        const angle = (Math.PI * 2 * i) / numParticles + Math.random() * 0.3;
        const speed = 2 + Math.random() * 3;
        const distance = targetRadius;
        particles.push({
          x: center.x + Math.cos(angle) * distance,
          y: center.y + Math.sin(angle) * distance,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 1,
          size: 3 + Math.random() * 4,
          color: points > 10 ? 'gold' : 'lightblue',
        });
      }

      // Create score popup
      const popupAngle = Math.random() * Math.PI * 2;
      scorePopups.push({
        x: center.x + Math.cos(popupAngle) * targetRadius,
        y: center.y + Math.sin(popupAngle) * targetRadius,
        text: `+${points}`,
        life: 1,
        vy: -1.5,
      });

      // Pulse the score display
      scoreEl?.classList.add('score-pop');
      setTimeout(() => scoreEl?.classList.remove('score-pop'), 200);
    }

    function spawnTarget() {
      const minR = Math.min(canvasSize.w, canvasSize.h) * CONFIG.MIN_TARGET_RADIUS;
      const maxR = Math.min(canvasSize.w, canvasSize.h) * CONFIG.MAX_TARGET_RADIUS;
      const radius = minR + Math.random() * (maxR - minR);

      targets.push({
        radius,
        pulse: 0,
        pulseDir: 1,
        hit: false,
        missed: false,
        fadeOut: 1,
      });
    }

    function updateTimer(timestamp) {
      const elapsed = timestamp - gameStartTime;
      const remaining = Math.max(0, CONFIG.GAME_DURATION - elapsed);
      const seconds = Math.ceil(remaining / 1000);
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      if (timeEl) {
        timeEl.textContent = `${mins}:${secs.toString().padStart(2, '0')}`;
      }
      return remaining;
    }

    function checkCollisions() {
      for (const target of targets) {
        if (target.hit || target.missed) continue;

        for (const ripple of ripples) {
          // Check if ripple is crossing the target radius (wider tolerance)
          const distance = Math.abs(ripple.radius - target.radius);
          const rippleCrossing = distance < CONFIG.COLLISION_TOLERANCE && ripple.opacity > 0.2;

          if (rippleCrossing) {
            // Any hit while target is visible counts!
            // Bonus points if pulse is high (better timing)
            const timingBonus = Math.floor(target.pulse * 10);
            const points = 5 + timingBonus;
            target.hit = true;
            targetsHit++;
            updateScore(score + points);

            hitEffects.push({
              radius: target.radius,
              opacity: 1,
              type: 'hit',
            });

            // Celebration!
            createHitCelebration(target.radius, points);
            break;
          }
        }

        // Target expired without being hit (pulse completes full cycle)
        if (!target.hit && target.pulse >= 1 && target.pulseDir === 1) {
          target.pulseDir = -1;
        }
        if (!target.hit && !target.missed && target.pulse <= 0 && target.pulseDir === -1) {
          target.missed = true;
          // No penalty for missing - just no points
          hitEffects.push({
            radius: target.radius,
            opacity: 0.5,
            type: 'miss',
          });
        }
      }
    }

    function update(timestamp) {
      // Update timer and check if game is over
      const remaining = updateTimer(timestamp);
      if (remaining <= 0) {
        endRound();
        return;
      }

      // Spawn targets continuously
      if (timestamp - lastSpawnTime > CONFIG.TARGET_SPAWN_INTERVAL) {
        spawnTarget();
        lastSpawnTime = timestamp;
      }

      // Update ripples
      for (const ripple of ripples) {
        ripple.radius += CONFIG.RIPPLE_SPEED;
        ripple.opacity -= CONFIG.RIPPLE_FADE;
      }
      ripples = ripples.filter(r => r.opacity > 0);

      // Update targets
      for (const target of targets) {
        if (!target.hit && !target.missed) {
          target.pulse += CONFIG.TARGET_PULSE_SPEED * target.pulseDir;
          target.pulse = Math.max(0, Math.min(1, target.pulse));
        } else {
          target.fadeOut -= 0.03;
        }
      }
      targets = targets.filter(t => t.fadeOut > 0);

      // Update hit effects
      for (const effect of hitEffects) {
        effect.opacity -= 0.04;
      }
      hitEffects = hitEffects.filter(e => e.opacity > 0);

      // Update particles
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.1; // gravity
        p.life -= 0.025;
      }
      particles = particles.filter(p => p.life > 0);

      // Update score popups
      for (const popup of scorePopups) {
        popup.y += popup.vy;
        popup.life -= 0.02;
      }
      scorePopups = scorePopups.filter(p => p.life > 0);

      // Check collisions
      checkCollisions();
    }

    function draw() {
      ctx.clearRect(0, 0, canvasSize.w, canvasSize.h);

      // Draw guide circles
      const guideRadii = [0.25, 0.35, 0.45];
      ctx.strokeStyle = COLORS.guide;
      ctx.lineWidth = 1;
      for (const frac of guideRadii) {
        const r = Math.min(canvasSize.w, canvasSize.h) * frac;
        ctx.beginPath();
        ctx.arc(center.x, center.y, r, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw targets
      for (const target of targets) {
        const alpha = target.fadeOut;
        // Pulse width grows as target becomes more "ready"
        const pulseWidth = 2 + target.pulse * 8;

        // Color intensity based on pulse (brighter = better time to hit)
        let r = 79, g = 157, b = 247; // brand-lightblue
        let intensity = 0.3 + target.pulse * 0.6;

        if (target.hit) {
          intensity = 0.9;
        } else if (target.missed) {
          r = 215; g = 38; b = 56; // brand-red
          intensity = 0.5;
        }

        ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${intensity * alpha})`;
        ctx.lineWidth = pulseWidth;
        ctx.beginPath();
        ctx.arc(center.x, center.y, target.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw ripples
      for (const ripple of ripples) {
        const gradient = ctx.createRadialGradient(
          center.x,
          center.y,
          ripple.radius - 8,
          center.x,
          center.y,
          ripple.radius + 8
        );
        gradient.addColorStop(0, COLORS.rippleFade);
        gradient.addColorStop(0.5, COLORS.ripple.replace(/[\d.]+\)$/, `${ripple.opacity})`));
        gradient.addColorStop(1, COLORS.rippleFade);

        ctx.strokeStyle = gradient;
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(center.x, center.y, ripple.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw hit effects
      for (const effect of hitEffects) {
        ctx.strokeStyle =
          effect.type === 'hit'
            ? COLORS.hit.replace(/[\d.]+\)$/, `${effect.opacity})`)
            : COLORS.miss.replace(/[\d.]+\)$/, `${effect.opacity})`);
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(center.x, center.y, effect.radius, 0, Math.PI * 2);
        ctx.stroke();
      }

      // Draw particles
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
        if (p.color === 'gold') {
          ctx.fillStyle = `rgba(250, 204, 21, ${p.life})`;
        } else {
          ctx.fillStyle = `rgba(79, 157, 247, ${p.life})`;
        }
        ctx.fill();
      }

      // Draw score popups
      ctx.font = 'bold 18px Inter, sans-serif';
      ctx.textAlign = 'center';
      for (const popup of scorePopups) {
        ctx.fillStyle = `rgba(79, 157, 247, ${popup.life})`;
        ctx.fillText(popup.text, popup.x, popup.y);
      }
    }

    function loop(timestamp) {
      if (!running || !isVisible) return;

      update(timestamp);
      draw();

      rafId = requestAnimationFrame(loop);
    }

    function endRound() {
      running = false;
      cancelAnimationFrame(rafId);

      showOverlay(`Time's up! Score: ${score}`);

      if (score > best) {
        updateBest(score);
      }
    }

    function start() {
      resizeCanvas();
      hideOverlay();

      ripples = [];
      targets = [];
      hitEffects = [];
      particles = [];
      scorePopups = [];
      targetsHit = 0;

      const now = performance.now();
      gameStartTime = now;
      lastSpawnTime = now;

      updateScore(0);
      updateBest(best);
      if (timeEl) timeEl.textContent = '0:30';

      running = true;
      rafId = requestAnimationFrame(loop);

      // Spawn first target immediately
      spawnTarget();
    }

    // Event handlers
    centerEl?.addEventListener('pointerdown', e => {
      e.preventDefault();
      emitRipple();
    });

    container.addEventListener('keydown', e => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (running) {
          emitRipple();
        }
      }
    });

    restartBtn?.addEventListener('pointerup', e => {
      e.preventDefault();
      e.stopPropagation();
      start();
    });

    window.addEventListener('resize', () => {
      if (running) {
        resizeCanvas();
      }
    });

    GameUtils.createVisibilityObserver(
      container,
      () => {
        isVisible = true;
        resizeCanvas();
        if (running) rafId = requestAnimationFrame(loop);
      },
      () => {
        isVisible = false;
        cancelAnimationFrame(rafId);
      }
    );

    // Initialize
    updateBest(best);
    start();
  })();
})();
