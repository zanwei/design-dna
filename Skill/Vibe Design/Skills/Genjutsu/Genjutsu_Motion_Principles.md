---
title: "Genjutsu Motion Principles"
tags: [genjutsu, motion, easing, physics, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/Genjutsu"
---

# ⚡ Genjutsu Motion Principles

> **Имя скилла:** `motion-principles`  
> **Локальный путь:** `/root/.agent/skills/_jutsu/motion-principles/SKILL.md`  
> **Описание:** Фундаментальные принципы анимации, тайминг, плавностей и доступности.

---

# Motion Principles

> The foundation. Loaded by every creative skill invocation.
> Concise rules here. Deep-dive in `references/`.

---

## Timing Rules

| Context | Duration | Why |
|---|---|---|
| Micro-interaction (toggle, hover, focus) | 100-150ms | Instant feedback, no perceived delay |
| UI transition (modal, drawer, tab switch) | 200-300ms | Smooth but never sluggish |
| Page/route transition | 300-500ms | Establishes spatial narrative |
| Scroll-driven / 3D | Free (progress-based) | Tied to user input, no fixed duration |

**Frequency rule:** The more often an animation plays, the shorter and subtler it must be.
A button hover (1000x/day) = 100ms opacity. An onboarding reveal (1x ever) = 600ms+ full choreography.

---

## Easing Cheat Sheet

| Action | Easing | Why |
|---|---|---|
| Element enters | `ease-out` / spring | Decelerates into resting position (natural arrival) |
| Element exits | `ease-in` | Accelerates away (gets out of the way) |
| Element moves between states | `ease-in-out` | Smooth start and stop |
| Scroll-synced | `linear` / `none` | Matches 1:1 with input, no lag perception |
| Bouncy/playful | spring (underdamped) | Overshoot creates life |
| Snappy UI | `cubic-bezier(0.2, 0, 0, 1)` | Fast start, smooth land |

> **Exit is always more subtle than enter.**
> Enter: 300ms ease-out, full choreography. Exit: 200ms ease-in, opacity only.

### Native easing equivalents (cross-platform)

| Web (CSS / JS) | SwiftUI | Compose |
|---|---|---|
| `cubic-bezier(0.2, 0, 0, 1)` | `.spring(response: 0.4, dampingFraction: 0.85)` or `.snappy` | `spring(stiffness = Spring.StiffnessMedium, dampingRatio = 0.85f)` |
| `ease-out` | `.easeOut(duration: 0.3)` | `tween(durationMillis = 300, easing = LinearOutSlowInEasing)` |
| `ease-in` | `.easeIn(duration: 0.2)` | `tween(durationMillis = 200, easing = FastOutLinearInEasing)` |
| spring (bouncy) | `.bouncy` (iOS 17+) | `spring(stiffness = Spring.StiffnessLow, dampingRatio = Spring.DampingRatioMediumBouncy)` |
| spring (smooth) | `.smooth` (iOS 17+) | `spring(stiffness = Spring.StiffnessMedium, dampingRatio = Spring.DampingRatioNoBouncy)` |

---

## Accessibility (Non-Negotiable)

### Reduced motion - MANDATORY

Every animated component must respect the user's reduced-motion preference. No exceptions, regardless of platform.

| Platform | API |
|---|---|
| Web CSS | `@media (prefers-reduced-motion: reduce)` |
| Web JS | `window.matchMedia('(prefers-reduced-motion: reduce)')` |
| SwiftUI | `@Environment(\.accessibilityReduceMotion) var reduceMotion` |
| UIKit | `UIAccessibility.isReduceMotionEnabled` (+ `reduceMotionStatusDidChangeNotification`) |
| Compose | Custom helper using `Settings.Global.ANIMATOR_DURATION_SCALE` (deep-dive in `mobile-principles/references/accessibility-mobile.md`) |

**CSS:**
```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

**SwiftUI:**
```swift
struct AnimatedView: View {
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    @State var visible = false

    var body: some View {
        Text("Hello")
            .opacity(visible ? 1 : 0)
            .animation(reduceMotion ? .none : .spring(response: 0.4, dampingFraction: 0.85), value: visible)
    }
}
```

**Compose:**
```kotlin
@Composable
fun rememberReduceMotion(): Boolean {
    val context = LocalContext.current
    return remember {
        Settings.Global.getFloat(context.contentResolver, Settings.Global.ANIMATOR_DURATION_SCALE, 1f) == 0f
    }
}

@Composable
fun AnimatedComponent(visible: Boolean) {
    val reduce = rememberReduceMotion()
    val alpha by animateFloatAsState(
        targetValue = if (visible) 1f else 0f,
        animationSpec = if (reduce) snap() else spring(stiffness = Spring.StiffnessMedium)
    )
}
```

### Other a11y requirements
- Focus indicators must never be hidden by animations
- Animated content must meet WCAG contrast ratios at every frame (no mid-transition fading to invisible text)
- Looping animations: provide a pause mechanism

---

## Universal "Do Not" Rules

### 1. Never animate width/height/top/left

Triggers layout recalculation every frame = jank.

```css
/* BAD */
.drawer { transition: height 0.3s ease; }
.drawer.open { height: 400px; }

/* GOOD */
.drawer { transition: transform 0.3s ease-out; transform: translateY(100%); }
.drawer.open { transform: translateY(0); }
```

**SwiftUI equivalent (BAD vs GOOD):**
```swift
// BAD - animates frame (causes layout pass)
.frame(height: open ? 400 : 0)
.animation(.easeInOut, value: open)

// GOOD - animates transform via offset
.offset(y: open ? 0 : 400)
.animation(.spring(), value: open)
```

**Compose equivalent (BAD vs GOOD):**
```kotlin
// BAD - animates size (full layout pass)
val height by animateDpAsState(if (open) 400.dp else 0.dp)

// GOOD - animates Y offset via graphicsLayer
val translation by animateFloatAsState(if (open) 0f else 400f)
Box(modifier = Modifier.graphicsLayer { translationY = translation })
```

### 2. Never scale to 0

`scale(0)` causes elements to vanish in a black hole. Always keep a minimum.

```css
/* BAD */
.modal-exit { transform: scale(0); }

/* GOOD */
.modal-exit { transform: scale(0.95); opacity: 0; }
```

**SwiftUI equivalent:**
```swift
// BAD
.scaleEffect(visible ? 1.0 : 0.0)

// GOOD
.scaleEffect(visible ? 1.0 : 0.95)
.opacity(visible ? 1.0 : 0.0)
```

**Compose equivalent:**
```kotlin
// BAD
Modifier.graphicsLayer { scaleX = if (visible) 1f else 0f; scaleY = if (visible) 1f else 0f }

// GOOD
Modifier.graphicsLayer {
    scaleX = if (visible) 1f else 0.95f
    scaleY = if (visible) 1f else 0.95f
    alpha = if (visible) 1f else 0f
}
```

### 3. Never ease-in on an entry

Ease-in = slow start. An entering element that hesitates feels broken.

```css
/* BAD */
.card-enter { animation: fadeIn 0.3s ease-in; }

/* GOOD */
.card-enter { animation: fadeIn 0.3s ease-out; }
/* OR spring via JS for natural feel */
```

### 4. Never exceed 500ms on a UI interaction

Modals, dropdowns, tooltips, tabs -- users are waiting. Respect their time.

```js
// BAD
gsap.to(modal, { opacity: 1, y: 0, duration: 0.8 });

// GOOD
gsap.to(modal, { opacity: 1, y: 0, duration: 0.25, ease: "power2.out" });
```

**SwiftUI:**
```swift
// BAD
.animation(.easeInOut(duration: 0.8), value: state)

// GOOD
.animation(.spring(response: 0.25, dampingFraction: 0.85), value: state)
```

**Compose:**
```kotlin
// BAD
animateContentSize(animationSpec = tween(800))

// GOOD
animateContentSize(animationSpec = spring(stiffness = Spring.StiffnessMediumLow))
```

### 5. Never skip prefers-reduced-motion

This is an accessibility requirement, not a nice-to-have.

```js
// BAD
gsap.from('.hero-title', { opacity: 0, y: 40, duration: 0.6 });

// GOOD
const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
if (!prefersReduced) {
  gsap.from('.hero-title', { opacity: 0, y: 40, duration: 0.6 });
}
```

> See the cross-platform Reduced Motion section above for SwiftUI / Compose equivalents.

---

## Performance Checklist

- Only animate `transform` and `opacity` (composite-only properties)
- Use `will-change` sparingly and remove it after animation completes
- Prefer `requestAnimationFrame` over `setTimeout`/`setInterval` for JS animations
- For scroll-driven: CSS `animation-timeline` > JS `IntersectionObserver` > scroll listeners
- Test on low-end devices (throttle CPU 4x in DevTools)

---

## Quick Reference: Loading Sub-skills

| Need | Load |
|---|---|
| Easing deep-dive, spring configs | `references/easing-guide.md` |
| Copy-paste enter/exit patterns | `references/enter-exit-recipes.md` |
| Designer-weighted style choice | `references/designers.md` |
| Mobile UX context | `../mobile-principles/SKILL.md` |
| Desktop UX context | `../desktop-principles/SKILL.md` |
| GSAP specifics | `../gsap/SKILL.md` |
| Framer Motion specifics | `../framer-motion/SKILL.md` |
| CSS-only animations | `../css-native/SKILL.md` |
| Three.js / R3F | `../threejs-r3f/SKILL.md` |
| Canvas / generative | `../canvas-generative/SKILL.md` |
| Compose Android animations | `../compose-motion/SKILL.md` |
| Compose Multiplatform | `../compose-multiplatform/SKILL.md` |
| SwiftUI iOS/macOS animations | `../swiftui-motion/SKILL.md` |
| Compose advanced graphics | `../compose-graphics/SKILL.md` |
| SwiftUI advanced graphics | `../swiftui-graphics/SKILL.md` |
| Visual / motion / a11y audit | `../design-audit/SKILL.md` |
| UI/UX intelligence (84 styles, 192 palettes) | `../ui-ux-pro-max/SKILL.md` |
