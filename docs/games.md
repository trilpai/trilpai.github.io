# Game Concepts for Trilp AI

*Interactive games that embody the 3 Octaves and RIPPLES philosophies*

---

## Overview

These games are designed to be simple, meditative interactions that reinforce the core concepts from the 3 Octaves framework and RIPPLES guide. Each game should:

- Be playable in under 60 seconds per round
- Work on both desktop (mouse/keyboard) and mobile (touch)
- Have no dependencies (vanilla JavaScript)
- Respect reduced motion preferences
- Store high scores in localStorage

---

## 1. Ripple Resonance

**Philosophy Connection:** RIPPLES concentric circle model, wave propagation, constructive/destructive interference

### Concept

Click at the center to create ripples that expand outward. Target rings appear at various distances. Ripples must reach target rings at precisely the right moment to score. Multiple ripples in play can interfere with each other — constructive interference (ripples in phase) creates bonus points, destructive interference (ripples out of phase) cancels them out.

### Mechanics

- **Arena:** Circular play area with a central origin point
- **Action:** Click/tap center to emit a ripple
- **Targets:** Rings appear at random distances, pulsing to indicate timing window
- **Scoring:**
  - Ripple hits target in sync: +10 points
  - Two ripples hit same target in phase: +25 points (resonance bonus)
  - Ripples cancel each other: 0 points (destructive interference)
  - Miss timing window: -5 points
- **Difficulty:** Targets appear faster, timing windows shrink, multiple targets simultaneously

### Visual Design

- Minimal concentric circles as guides
- Ripples as expanding rings with fade-out
- Targets as glowing rings that pulse
- Interference visualized as brightness (constructive) or dimming (destructive)

### Philosophy Embodied

> "AI capability dominates the Middle Circle first... As AI accelerates construction, human responsibility migrates to the edges."

The player acts from the center (intent), but must understand how signals propagate outward to hit targets (reality).

---

## 2. Signal Integrity

**Philosophy Connection:** 3 Octaves signal flow, entropy, verification at each stage

### Concept

A signal pulse travels across the screen through three zones: Definition (left), Construction (center), and Propagation (right). Entropy constantly tries to corrupt the signal — visualized as noise/static accumulating on the pulse. Click to "verify" and restore signal clarity. The goal is to deliver the signal to the far right with maximum integrity.

### Mechanics

- **Arena:** Horizontal strip divided into three colored zones
- **Signal:** A pulse/wave that moves left to right automatically
- **Entropy:** Noise accumulates on the signal over time (visual corruption)
- **Action:** Click/tap on the signal to verify — removes accumulated noise
- **Constraints:**
  - Limited verifications per zone (forces strategic use)
  - Verification has cooldown
  - Signal moves faster in later zones
- **Scoring:**
  - Signal integrity percentage at destination (0-100%)
  - Bonus for using fewer verifications
  - Multiplier for consecutive successful deliveries
- **Failure:** Signal integrity drops to 0% before reaching destination

### Visual Design

- Three distinct zones with subtle color coding
- Signal as a clean waveform that gets progressively noisier
- Verification as a "clarifying" pulse effect
- Entropy as visual static/distortion

### Philosophy Embodied

> "The history of engineering failure is the history of signal degradation: intent that was never clear, clarity that was not preserved, or preservation that was never tested against the world."

Direct representation of signal passing through octaves, requiring verification at each stage.

---

## 3. Entropy Resistance

**Philosophy Connection:** "Entropy is patient," maintaining system coherence, continuous verification

### Concept

A grid of interconnected nodes, each with a state (color/symbol). The system naturally drifts toward chaos — nodes randomly change state over time. Click nodes to realign them to the "coherent" state. The goal is to maintain system coherence (percentage of aligned nodes) as long as possible against accelerating entropy.

### Mechanics

- **Arena:** Grid of nodes (e.g., 5x5 or 6x6)
- **States:** Each node has a "coherent" state and "chaotic" states
- **Entropy:** Random nodes flip to chaotic states at intervals
- **Action:** Click/tap a node to restore it to coherent state
- **Scoring:**
  - Time survived with >50% coherence
  - Bonus for maintaining >80% coherence
  - Streak bonus for consecutive high-coherence intervals
- **Difficulty:** Entropy rate increases over time, eventually overwhelming the player
- **Failure:** Coherence drops below 50% for more than 3 seconds

### Visual Design

- Nodes as circles or hexagons in a grid
- Coherent state: unified color (e.g., blue)
- Chaotic states: various other colors or patterns
- Connections between nodes that pulse when aligned
- Overall "health" indicator showing coherence percentage

### Philosophy Embodied

> "Entropy is patient. The signal begins with you. It passes through systems you shape or choose. It produces consequences you must own."

The player experiences the relentless pull of entropy and the constant effort required to maintain system integrity.

---

## 4. Harmonic Alignment

**Philosophy Connection:** 3 Octaves resonating together, same principle at different frequencies

### Concept

Three concentric rings rotate at different speeds (representing the three octaves). Symbols appear on each ring. When symbols on all three rings align vertically, tap to "resonate" and score. Tapping when misaligned creates dissonance and costs points. The goal is to recognize alignment patterns and tap at precisely the right moment.

### Mechanics

- **Arena:** Three concentric rotating rings
- **Symbols:** Simple shapes (circles, squares, triangles) placed on rings
- **Rotation:** Each ring rotates at a different speed
  - Outer ring (Octave 3 - Propagation): fastest
  - Middle ring (Octave 2 - Construction): medium
  - Inner ring (Octave 1 - Definition): slowest
- **Action:** Tap when symbols across all three rings align
- **Scoring:**
  - Perfect alignment: +15 points
  - Near alignment (small tolerance): +5 points
  - Misaligned tap: -10 points
  - Missed alignment (didn't tap): -5 points
- **Difficulty:** More symbols added, rotation speeds increase, tolerance decreases

### Visual Design

- Three distinct rings with different visual treatments
- Symbols as simple geometric shapes
- Alignment indicated by a radial line or glow
- Resonance visualized as a harmonic pulse/ripple
- Dissonance as a shake/distortion effect

### Philosophy Embodied

> "They are not phases to complete and leave behind. They are frequencies that must sound together, or the signal collapses into noise."

The player must see across all three octaves simultaneously and recognize when they resonate.

---

## 5. Feedback Loop

**Philosophy Connection:** Learning flows backward, signal flows forward, the octaves as a cycle

### Concept

A circular flow representing the continuous cycle of the octaves. Signal flows clockwise (Definition → Construction → Propagation). Learning flows counter-clockwise (Propagation → Construction → Definition). The player must maintain both flows by tapping at the right moments. Blockages in either direction cause system imbalance and eventual failure.

### Mechanics

- **Arena:** Circular track divided into three sections (the octaves)
- **Flows:**
  - Signal particles flow clockwise (blue)
  - Learning particles flow counter-clockwise (gold)
- **Gates:** Checkpoints between sections that periodically close
- **Action:** Tap gates to open them, allowing particles through
- **Balance:**
  - Both flows must be maintained
  - If one flow stops, the system becomes imbalanced
  - Imbalance meter fills; when full, game over
- **Scoring:**
  - Points for each particle completing a full cycle
  - Bonus for maintaining balance
  - Multiplier increases with continuous balanced flow
- **Difficulty:** Particles move faster, gates close more frequently, timing windows shrink

### Visual Design

- Circular track with three distinct sections
- Particles as small dots flowing in their respective directions
- Gates as barriers that open/close
- Balance indicator in the center
- Visual warning when flows are blocked or imbalanced

### Philosophy Embodied

> "Without this loop, errors repeat — faster, at scale. The octaves are a cycle: signal forward, learning backward."

The player directly experiences the importance of the feedback loop and the consequences of blocking learning.

---

## Implementation Priority

Recommended order based on:
- Philosophy alignment
- Visual impact
- Implementation complexity

1. **Signal Integrity** - Most direct representation of 3 Octaves, moderate complexity
2. **Ripple Resonance** - Strong visual metaphor for RIPPLES, moderate complexity
3. **Entropy Resistance** - Universal concept, simpler mechanics
4. **Harmonic Alignment** - Elegant representation, requires careful tuning
5. **Feedback Loop** - Most complex, but powerful metaphor

---

## Technical Considerations

- All games should use `requestAnimationFrame` for smooth animation
- Pause when tab/section not visible (IntersectionObserver)
- Support keyboard controls (Space/Enter for primary action)
- Store high scores with `trilpai_[game]_best` localStorage keys
- Graceful degradation for reduced motion preferences
- Touch-friendly hit targets (minimum 44x44px)

---

*Games should feel meditative, not frantic. The goal is reflection through interaction.*
