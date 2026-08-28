---
title: "Genjutsu Canvas Generative"
tags: [genjutsu, canvas, generative, particles, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/Genjutsu"
---

# ⚡ Genjutsu Canvas Generative

> **Имя скилла:** `canvas-generative`  
> **Локальный путь:** `/root/.agent/skills/_jutsu/canvas-generative/SKILL.md`  
> **Описание:** Генеративное искусство на HTML5 Canvas: частицы, шум, фракталы.

---

# Canvas Generative

> Algorithmic and generative art with Canvas 2D.
> Concise rules here. Deep-dive and reference implementations in `references/`.

---

## Canvas 2D Setup

### DPR-Aware Sizing

Every canvas must be sharp on Retina/HiDPI displays. Set the buffer size to the physical pixel size, scale down with CSS.

```js
function setupCanvas(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
```

### Resize Handler

```js
function handleResize(canvas, ctx, draw) {
  const ro = new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    ctx.scale(dpr, dpr);
    draw(); // re-render after resize
  });
  ro.observe(canvas.parentElement);
  return () => ro.disconnect();
}
```

### Animation Loop (RAF)

```js
let animId;
let prevTime = 0;

function loop(time) {
  const dt = Math.min((time - prevTime) / 1000, 0.1); // cap delta to avoid spiral of death
  prevTime = time;

  update(dt);
  render(ctx);

  animId = requestAnimationFrame(loop);
}

// Start
animId = requestAnimationFrame(loop);
// Stop
cancelAnimationFrame(animId);
```

---

## Noise

| Type | Characteristics | Best For |
|---|---|---|
| Perlin | Smooth, grid-aligned bias, cheaper | Terrain, clouds, gentle organic textures |
| Simplex | No grid artifacts, better gradients, slightly costlier | Flow fields, organic motion, seamless tiling |
| Worley (Cellular) | Distance-to-nearest-point, cell-like | Voronoi patterns, caustics, cracks, cell textures |

**Usage rules:**
- Always scale input coordinates (divide by a `noiseScale` factor) -- raw pixel coords produce visual noise
- Use octaves (fractal Brownian motion) for detail: sum multiple noise calls at increasing frequency and decreasing amplitude
- Seed your noise for reproducibility

```js
// fBm pattern
function fbm(x, y, octaves = 4, lacunarity = 2, gain = 0.5) {
  let value = 0, amplitude = 1, frequency = 1, maxAmp = 0;
  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise2D(x * frequency, y * frequency);
    maxAmp += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }
  return value / maxAmp; // normalize to [-1, 1]
}
```

---

## Particle Systems

### Pool Pattern (No GC Pressure)

Pre-allocate a fixed array. Never `new` or `splice` at runtime.

```js
const POOL_SIZE = 10000;
const particles = new Array(POOL_SIZE);
let aliveCount = 0;

// Init pool
for (let i = 0; i < POOL_SIZE; i++) {
  particles[i] = { x: 0, y: 0, vx: 0, vy: 0, life: 0, maxLife: 0, active: false };
}

function spawn(x, y) {
  if (aliveCount >= POOL_SIZE) return;
  const p = particles[aliveCount++];
  p.x = x; p.y = y;
  p.vx = (Math.random() - 0.5) * 2;
  p.vy = (Math.random() - 0.5) * 2;
  p.life = 0; p.maxLife = 60 + Math.random() * 60;
  p.active = true;
}

function update() {
  for (let i = aliveCount - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx; p.y += p.vy;
    p.life++;
    if (p.life >= p.maxLife) {
      // Swap with last alive, shrink pool
      particles[i] = particles[--aliveCount];
      particles[aliveCount] = p;
      p.active = false;
    }
  }
}
```

---

## Flow Fields

Grid of angle vectors that steer particles. The classic generative recipe.

1. **Build grid:** Divide canvas into cells, compute an angle per cell (from noise)
2. **Lookup:** Particle position maps to grid cell, retrieve angle
3. **Steer:** Apply angle as velocity, accumulate over frames

```js
const cols = Math.ceil(width / cellSize);
const rows = Math.ceil(height / cellSize);
const field = new Float32Array(cols * rows);

// Fill with noise-based angles
for (let y = 0; y < rows; y++) {
  for (let x = 0; x < cols; x++) {
    field[y * cols + x] = noise2D(x * 0.05, y * 0.05) * Math.PI * 2;
  }
}

// Particle follow
function followField(p) {
  const col = Math.floor(p.x / cellSize);
  const row = Math.floor(p.y / cellSize);
  if (col >= 0 && col < cols && row >= 0 && row < rows) {
    const angle = field[row * cols + col];
    p.vx += Math.cos(angle) * force;
    p.vy += Math.sin(angle) * force;
  }
  // Damping to prevent runaway velocity
  p.vx *= 0.98;
  p.vy *= 0.98;
}
```

---

## Fractals & L-Systems

An L-system encodes recursive structure as string rewriting + turtle graphics.

| Component | Role |
|---|---|
| Axiom | Starting string (e.g. `"F"`) |
| Rules | Production rules (e.g. `"F" -> "F[+F]F[-F]F"`) |
| Angle | Turtle turn angle per `+`/`-` |
| Iterations | How many times to apply rules |

```js
function lsystem(axiom, rules, iterations) {
  let current = axiom;
  for (let i = 0; i < iterations; i++) {
    current = current.split('').map(c => rules[c] || c).join('');
  }
  return current;
}

function drawLSystem(ctx, commands, len, angle) {
  const stack = [];
  for (const c of commands) {
    switch (c) {
      case 'F': ctx.lineTo(ctx._x += Math.cos(ctx._a) * len, ctx._y += Math.sin(ctx._a) * len); break;
      case '+': ctx._a += angle; break;
      case '-': ctx._a -= angle; break;
      case '[': stack.push({ x: ctx._x, y: ctx._y, a: ctx._a }); break;
      case ']': { const s = stack.pop(); ctx._x = s.x; ctx._y = s.y; ctx._a = s.a; ctx.moveTo(s.x, s.y); } break;
    }
  }
}
```

---

## Double Buffer Pattern

Render to an offscreen canvas, then blit to the visible one. Eliminates flicker and enables trail effects.

```js
const offscreen = document.createElement('canvas');
offscreen.width = canvas.width;
offscreen.height = canvas.height;
const offCtx = offscreen.getContext('2d');

function render() {
  // Draw to offscreen
  offCtx.fillStyle = 'rgba(0, 0, 0, 0.05)'; // trail fade
  offCtx.fillRect(0, 0, offscreen.width, offscreen.height);
  drawParticles(offCtx);

  // Blit to screen
  ctx.drawImage(offscreen, 0, 0);
}
```

---

## Do Not

### 1. Never clearRect every frame for trail effects

Clearing destroys the trail. Use a semi-transparent fill instead.

```js
// BAD -- kills trails
ctx.clearRect(0, 0, w, h);

// GOOD -- fades previous frame
ctx.fillStyle = 'rgba(0, 0, 0, 0.02)';
ctx.fillRect(0, 0, w, h);
```

### 2. Never getImageData in the animation loop

`getImageData` reads back from GPU -- extremely slow. Avoid unless absolutely required (e.g. one-time color sampling).

```js
// BAD -- 60fps GPU readback
function loop() {
  const data = ctx.getImageData(0, 0, w, h); // blocks rendering pipeline
  processPixels(data);
  requestAnimationFrame(loop);
}

// GOOD -- sample once, cache
const colorMap = ctx.getImageData(0, 0, w, h);
function getColor(x, y) {
  const i = (y * w + x) * 4;
  return [colorMap.data[i], colorMap.data[i+1], colorMap.data[i+2]];
}
```

### 3. Always respect DPR for sharpness

A canvas without DPR scaling looks blurry on Retina displays. See setup section above.

```js
// BAD
canvas.width = 800;
canvas.height = 600;

// GOOD
const dpr = window.devicePixelRatio || 1;
canvas.width = 800 * dpr;
canvas.height = 600 * dpr;
canvas.style.width = '800px';
canvas.style.height = '600px';
ctx.scale(dpr, dpr);
```

### 4. Never allocate in the hot loop

No `new`, no object spread, no array creation inside `update()` or `render()`. Pre-allocate everything.

```js
// BAD
function update() {
  particles.forEach(p => {
    const force = { x: Math.cos(a), y: Math.sin(a) }; // new object every frame per particle
    p.vx += force.x;
  });
}

// GOOD
let fx = 0, fy = 0; // reuse
function update() {
  for (let i = 0; i < aliveCount; i++) {
    fx = Math.cos(a); fy = Math.sin(a);
    particles[i].vx += fx;
  }
}
```

---

## Quick Reference: Loading Sub-skills

| Need | Load |
|---|---|
| Noise implementations, particle pool, flow field, L-system, attractors | `references/algorithms.md` |
| Timing and easing for animated transitions | `../motion-principles/SKILL.md` |
| 3D generative (shaders, GPU particles) | `../threejs-r3f/SKILL.md` |
