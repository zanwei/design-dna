---
title: "Genjutsu Mobile Principles"
tags: [genjutsu, mobile, touch, ux, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/Genjutsu"
---

# ⚡ Genjutsu Mobile Principles

> **Имя скилла:** `mobile-principles`  
> **Локальный путь:** `/root/.agent/skills/_jutsu/mobile-principles/SKILL.md`  
> **Описание:** Мобильные UX-принципы: тач-зоны, жесты, адаптация без ховеров.

---

# Mobile Principles

> Touch-first UX context. Loaded when mobile is detected (web mobile, iOS, Android).
> Concise rules here. Deep-dive in `references/`.

---

## Touch Targets

| Platform | Minimum | Recommended | Spec |
|---|---|---|---|
| Apple iOS | 44pt | 44pt + 8pt spacing | Apple HIG |
| Android | 48dp | 48dp + 8dp spacing | Material Design |
| Web mobile | 44px | 44px + 8px spacing | WCAG 2.5.5 |

**Rule of thumb:** any tap target smaller than the platform minimum is a usability bug, period.
The hit area can extend beyond the visible glyph (use padding, `hitSlop`, or a transparent inner spacer), but the *interactive* surface must reach the minimum. Spacing matters as much as size: two 44pt buttons touching edges are still mistappable.

---

## No-Hover Doctrine

`:hover` does not exist on touch. Treating it as a primary trigger means hidden affordances on every phone. Anything reachable only by hover is, on mobile, simply gone. Visible-by-default is the rule; hover styles are a desktop *enhancement*, never a load-bearing interaction.

**CSS - gate hover styles behind a media query:**
```css
.card { opacity: 1; transform: translateY(0); }

@media (hover: hover) and (pointer: fine) {
  .card { opacity: 0.85; }
  .card:hover { opacity: 1; transform: translateY(-2px); }
}
```

**SwiftUI - tap and long-press, no pseudo-hover:**
```swift
Image(systemName: "heart")
  .onTapGesture { toggleLike() }
  .contextMenu {
    Button("Share", systemImage: "square.and.arrow.up", action: share)
    Button("Report", systemImage: "flag", role: .destructive, action: report)
  }
```

**Compose - combinedClickable for tap + long-press:**
```kotlin
Box(
  modifier = Modifier
    .combinedClickable(
      onClick = { toggleLike() },
      onLongClick = { showContextMenu() },
    )
) {
  Icon(Icons.Default.Favorite, contentDescription = "Like")
}
```

---

## Thumb Zones (Hoober)

Steven Hoober's research shows portrait phone use is overwhelmingly one-handed or cradled, with the thumb pivoting from the bottom corner. The screen splits into reachable zones:

```
+------+----+------+
| HARD | OK | HARD |   <- top: stretch, two-handed only
+------+----+------+
|  OK  | OK |  OK  |   <- middle: comfortable
+------+----+------+
| EASY |EASY| EASY |   <- bottom: natural thumb arc
+------+----+------+
```

- **Bottom third (EASY):** primary CTA, send, confirm, FAB, tab bar.
- **Middle (OK):** content, secondary actions.
- **Top (HARD):** back, close, search, profile - things the user expects to reach for, not hit by reflex.

**Rule:** primary CTA goes in the bottom half. Secondary, less-frequent or destructive actions go in the top. Never put a "Pay" button in the top-right corner of a phone screen.

---

## Safe Areas

| Platform | API | Insets respected |
|---|---|---|
| Web | `env(safe-area-inset-top|right|bottom|left)` + `viewport-fit=cover` | notch, home indicator |
| SwiftUI | `.safeAreaInset(edge: ...)`, `safeAreaInsets` env | nav bar, tab bar, notch, home |
| Compose | `Modifier.windowInsetsPadding(WindowInsets.safeDrawing)` | system bars, IME, cutouts |

**Web:**
```html
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
```
```css
.fab {
  position: fixed;
  bottom: calc(env(safe-area-inset-bottom) + 16px);
  right: calc(env(safe-area-inset-right) + 16px);
}
```

**SwiftUI:**
```swift
ScrollView { content }
  .safeAreaInset(edge: .bottom) {
    PrimaryCTA().padding()
  }
```

**Compose:**
```kotlin
Column(
  modifier = Modifier
    .fillMaxSize()
    .windowInsetsPadding(WindowInsets.safeDrawing)
) { /* content */ }
```

---

## Reduced Motion (cross-platform unified)

| Platform | API |
|---|---|
| Web CSS | `@media (prefers-reduced-motion: reduce)` |
| Web JS | `window.matchMedia('(prefers-reduced-motion: reduce)')` |
| SwiftUI | `@Environment(\.accessibilityReduceMotion) var reduceMotion` |
| UIKit | `UIAccessibility.isReduceMotionEnabled` |
| Compose | Custom helper using `Settings.Global.ANIMATOR_DURATION_SCALE` (see code below; deep-dive in `references/accessibility-mobile.md`) |

**SwiftUI:**
```swift
struct Hero: View {
  @Environment(\.accessibilityReduceMotion) var reduceMotion
  @State private var shown = false

  var body: some View {
    Text("Welcome")
      .opacity(shown ? 1 : 0)
      .offset(y: shown ? 0 : (reduceMotion ? 0 : 20))
      .animation(reduceMotion ? .none : .easeOut(duration: 0.3), value: shown)
      .onAppear { shown = true }
  }
}
```

**UIKit:**
```swift
let duration = UIAccessibility.isReduceMotionEnabled ? 0 : 0.3
UIView.animate(withDuration: duration) {
  view.alpha = 1
  view.transform = .identity
}
```

**Compose (helper pattern):**
```kotlin
@Composable
fun rememberReduceMotion(): Boolean {
  val context = LocalContext.current
  return remember {
    Settings.Global.getFloat(
      context.contentResolver,
      Settings.Global.ANIMATOR_DURATION_SCALE,
      1f,
    ) == 0f
  }
}

val reduceMotion = rememberReduceMotion()
val spec = if (reduceMotion) snap() else tween<Float>(durationMillis = 300)
```

> Note: prefer `ValueAnimator.areAnimatorsEnabled()` (API 26+) - it returns `false` when the animator duration scale is 0, which the developer-options "Animation off" toggle, Battery Saver, and the user-facing "Remove animations" (Settings -> Accessibility) toggle all set. Deep dive in `references/accessibility-mobile.md`.

---

## Mobile Gestures (canonical patterns)

The five gestures users already know. Reusing them is free UX; reinventing them is friction.

- **Swipe-back:** iOS edge-swipe from the left to pop the navigation stack. Never override; mirror it on Android via predictive back (Android 14+).
- **Pull-to-refresh:** downward drag at the top of a scroll surface to refetch. Standard on feeds, mail, lists.
- **Drag-to-dismiss:** modal sheets and image viewers close when dragged downward past a threshold (typically 100-150pt).
- **Pinch-to-zoom:** two-finger spread/pinch on images, maps, and zoomable canvases. Respect minimum/maximum scale.
- **Swipe actions on rows:** horizontal swipe on a list row to reveal contextual actions (delete, archive, mark read). Leading vs trailing swipe = different action sets.

---

## Mobile Performance Budgets

- **Cold start:** <2s on mid-range devices. Baselines: Android Pixel 4a, iPhone SE (2nd gen). If your app takes 4s on a Pixel 4a, it takes 8s on a low-end device users actually own.
- **Frame budget:** 16.67ms per frame at 60fps, 8.33ms at 120fps (ProMotion / high-refresh Android). Anything synchronous on the main thread above that = jank.
- **Binary size:** target <30MB APK and <50MB IPA before adding heavy media libs. Lottie/Rive add 500KB to 2MB. Watch your asset folders; PNGs over WebP / vector are the usual culprit.
- **Battery:** no continuous CPU activity in the background. Coalesce work, use platform schedulers (`WorkManager` on Android, `BGTaskScheduler` on iOS), avoid wake-locks unless the user explicitly asked for foreground media.
- **Network:** respect connection hints. Web: `Save-Data` request header and `navigator.connection.saveData`. iOS: `URLSessionConfiguration.allowsCellularAccess` and `NWPathMonitor` for cellular vs Wi-Fi. Android: `ConnectivityManager` + `NetworkCapabilities` to detect metered networks.

---

## Anti-Patterns (BAD / GOOD)

### 1. Hover as the only reveal

```css
/* BAD - on mobile the action button literally never appears */
.card .actions { opacity: 0; }
.card:hover .actions { opacity: 1; }
```

```css
/* GOOD - visible by default, hover is a desktop enhancement */
.card .actions { opacity: 1; }

@media (hover: hover) and (pointer: fine) {
  .card .actions { opacity: 0; transition: opacity 0.15s ease-out; }
  .card:hover .actions { opacity: 1; }
}
```

### 2. Sub-minimum touch targets

```kotlin
// BAD - 32dp icon button, mistappable, fails Material guideline
IconButton(
  onClick = onDelete,
  modifier = Modifier.size(32.dp),
) { Icon(Icons.Default.Delete, contentDescription = "Delete") }
```

```kotlin
// GOOD - 48dp minimum even when the visible icon is 24dp
IconButton(
  onClick = onDelete,
  modifier = Modifier.size(48.dp),
) {
  Icon(
    Icons.Default.Delete,
    contentDescription = "Delete",
    modifier = Modifier.size(24.dp),
  )
}
```

### 3. Ignoring safe area insets

```swift
// BAD - the CTA sits under the home indicator on every modern iPhone
VStack {
  Spacer()
  Button("Continue", action: next)
    .frame(maxWidth: .infinity)
    .padding()
}
```

```swift
// GOOD - safeAreaInset keeps the button reachable and visible
ScrollView { content }
  .safeAreaInset(edge: .bottom) {
    Button("Continue", action: next)
      .frame(maxWidth: .infinity)
      .padding()
  }
```

---

## Quick Reference: Loading sub-skills

| Need | Load |
|---|---|
| Gesture deep-dive | `references/gestures-deep.md` |
| Mobile a11y deep-dive | `references/accessibility-mobile.md` |
| Compose-specific anim | `../compose-motion/SKILL.md` |
| SwiftUI-specific anim | `../swiftui-motion/SKILL.md` |

---

## Sources

- Steven Hoober, "Designing for Touch" (mobile thumb zones research)
- Apple Human Interface Guidelines (iOS): https://developer.apple.com/design/human-interface-guidelines/
- Material Design (Android): https://m3.material.io/foundations/layout/canonical-layouts/overview
- WCAG 2.5.5 Target Size: https://www.w3.org/WAI/WCAG21/Understanding/target-size.html
