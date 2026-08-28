---
title: "Genjutsu CSS Native"
tags: [genjutsu, css, animations, scroll-driven, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/Genjutsu"
---

# ⚡ Genjutsu CSS Native

> **Имя скилла:** `css-native`  
> **Локальный путь:** `/root/.agent/skills/_jutsu/css-native/SKILL.md`  
> **Описание:** Современные чистые CSS анимации: scroll-driven, view transitions, @starting-style.

---

# CSS Native — Zero-Dependency Animations & Visual Techniques

## When to Use CSS Native vs Library

| Situation | Decision |
|---|---|
| < 3 animations on the page | CSS native |
| Scroll-driven reveal/parallax | CSS native (`animation-timeline`) |
| Enter/exit from `display: none` | CSS native (`@starting-style` + `transition-behavior: allow-discrete`) |
| Tooltip/popover positioning | CSS native (anchor positioning) |
| Page transitions (MPA or SPA) | CSS native (View Transitions API) |
| Complex multi-step timeline (5+ tweens) | GSAP |
| Stagger across dynamic list (unknown count) | GSAP or Framer Motion |
| Physics-based spring with interruption | Framer Motion |
| Morph between SVG shapes | GSAP MorphSVG |

Rule of thumb: if you can express it in a `@keyframes` + one `animation-timeline`, stay in CSS. The moment you need imperative control, sequence coordination, or runtime values — reach for a library.

---

## Scroll-Driven Animations

### Scroll Progress Timeline

Animate based on scroll position of a container.

```css
.progress-bar {
  animation: grow-width linear both;
  animation-timeline: scroll(root block);
}

@keyframes grow-width {
  from { transform: scaleX(0); }
  to   { transform: scaleX(1); }
}
```

- `scroll(<scroller> <axis>)` — scroller: `nearest` | `root` | `self`, axis: `block` | `inline` | `x` | `y`
- Default: `scroll(nearest block)`

### View Progress Timeline

Animate as an element enters/exits the scrollport.

```css
.reveal {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% entry 100%;
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(2rem); }
  to   { opacity: 1; transform: translateY(0); }
}
```

### animation-range

Controls which segment of the timeline drives the animation.

```css
/* Named ranges: cover | contain | entry | exit | entry-crossing | exit-crossing */
animation-range: entry 0% entry 100%;    /* animate during entry only */
animation-range: contain 0% contain 100%; /* animate while fully visible */
animation-range: entry 25% exit 75%;      /* custom start/end */
```

Use the [Scroll-driven Animations tool](https://scroll-driven-animations.style/tools/view-timeline/ranges/) to visualize ranges interactively.

---

## View Transitions API

### Same-Document (SPA)

```js
document.startViewTransition(() => {
  // Update the DOM synchronously
  updateContent();
});
```

```css
/* Control the transition animation */
::view-transition-old(root) {
  animation: fade-out 200ms ease-out;
}
::view-transition-new(root) {
  animation: fade-in 300ms ease-in;
}

/* Named transitions for specific elements */
.hero-image { view-transition-name: hero; }

::view-transition-group(hero) {
  animation-duration: 400ms;
  animation-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Cross-Document (MPA)

```css
/* Both pages need this */
@view-transition { navigation: auto; }

/* Outgoing page */
.card { view-transition-name: card-detail; }

/* Incoming page */
.detail-hero { view-transition-name: card-detail; }
```

### view-transition-class (group styling)

```css
.card { view-transition-class: card; }

::view-transition-group(*.card) {
  animation-duration: 350ms;
  animation-timing-function: var(--ease-spring);
}
```

---

## @starting-style

Native enter animations from `display: none` — no JS timing hacks.

```css
.dialog {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 300ms ease, transform 300ms ease,
              display 300ms allow-discrete;

  @starting-style {
    opacity: 0;
    transform: translateY(-1rem);
  }
}

.dialog[hidden] {
  opacity: 0;
  transform: translateY(-1rem);
  display: none;
}
```

Key rules:
- `transition-behavior: allow-discrete` (or shorthand `allow-discrete` in the transition) enables transitioning `display` and `overlay`
- `@starting-style` block defines the "from" state when the element first renders
- Combine with `[popover]` and `<dialog>` for native modals with zero JS animation code

---

## Anchor Positioning

CSS-native positioning of tooltips, popovers, and floating UI relative to a trigger.

```css
.trigger {
  anchor-name: --my-trigger;
}

.tooltip {
  position: fixed;
  position-anchor: --my-trigger;
  position-area: top center;
  margin-bottom: 0.5rem;

  /* Fallback if no space on top */
  position-try-fallbacks: --bottom;
}

@position-try --bottom {
  position-area: bottom center;
  margin-top: 0.5rem;
}
```

Combine with `@starting-style` for animated tooltips:

```css
.tooltip[popover]:popover-open {
  opacity: 1;
  transform: scale(1);
  transition: opacity 150ms ease, transform 150ms ease,
              display 150ms allow-discrete, overlay 150ms allow-discrete;

  @starting-style {
    opacity: 0;
    transform: scale(0.96);
  }
}
```

---

## Container Queries + Contextual Animations

Adapt animations to the component's container size, not the viewport.

```css
.card-container {
  container-type: inline-size;
  container-name: card;
}

@container card (min-width: 400px) {
  .card-content {
    animation: slide-in-right 400ms var(--ease-out-expo);
  }
}

@container card (max-width: 399px) {
  .card-content {
    animation: fade-in 300ms ease;
  }
}
```

Container-relative units in keyframes:

```css
@keyframes slide-in-right {
  from { transform: translateX(10cqw); opacity: 0; }
  to   { transform: translateX(0); opacity: 1; }
}
```

---

## Advanced Visual Techniques

### clip-path Transitions

```css
.reveal {
  clip-path: inset(0 100% 0 0);
  transition: clip-path 600ms cubic-bezier(0.77, 0, 0.175, 1);
}
.reveal.visible {
  clip-path: inset(0 0 0 0);
}
```

Shape morphing: transition between `circle()`, `ellipse()`, `polygon()`, `inset()` — as long as the function type and point count match.

### backdrop-filter

```css
.glass {
  background: oklch(0.98 0.01 250 / 0.6);
  backdrop-filter: blur(12px) saturate(1.8);
  -webkit-backdrop-filter: blur(12px) saturate(1.8); /* Safari */
}
```

### mix-blend-mode

```css
.overlay-text {
  mix-blend-mode: difference;
  color: white; /* inverts over any background */
}
```

### Mesh Gradients (approximated)

```css
.mesh {
  background:
    radial-gradient(at 20% 30%, oklch(0.7 0.2 310) 0%, transparent 50%),
    radial-gradient(at 80% 60%, oklch(0.6 0.18 250) 0%, transparent 50%),
    radial-gradient(at 50% 80%, oklch(0.75 0.15 170) 0%, transparent 50%),
    oklch(0.15 0.02 280);
}
```

### conic-gradient Effects

```css
.spinner {
  background: conic-gradient(from 0deg, transparent 0%, oklch(0.7 0.15 250) 100%);
  border-radius: 50%;
  mask: radial-gradient(farthest-side, transparent calc(100% - 4px), black calc(100% - 4px));
  animation: spin 1s linear infinite;
}
```

---

## Do Not

| BAD | GOOD | Why |
|---|---|---|
| `transition: all 300ms` | `transition: opacity 300ms, transform 300ms` | `all` triggers transitions on every property change, causes unexpected animations, and prevents browser optimization |
| Animate `width`, `height`, `top`, `left` | Animate `transform`, `opacity`, `clip-path`, `filter` | Layout-triggering properties force reflow on every frame — composite-only properties run on GPU |
| Scroll-driven animations without fallback | `@supports (animation-timeline: scroll()) { ... }` | Firefox only added support in v128+, older Safari versions lack support |
| `@starting-style` without `transition-behavior` | Always pair with `allow-discrete` for display/overlay | Without it, `display: none` transitions are skipped entirely |
| Anchor positioning without `position-try-fallbacks` | Always define fallback positions | Element clips out of viewport if primary position has no space |
| `animation-fill-mode: forwards` on scroll-driven | Use `both` for scroll-driven animations | `forwards` can lock the element in its final state even when scrolling back |

---

## Deep dive

| Need | Reference |
|---|---|
| Browser-support tables, fallback patterns and progressive-enhancement strategies for scroll-driven animations, View Transitions, `@starting-style`, anchor positioning and container queries (plus accessibility and performance notes) | `references/modern-css.md` |
