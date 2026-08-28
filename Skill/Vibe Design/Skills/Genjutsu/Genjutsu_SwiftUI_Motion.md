---
title: "Genjutsu SwiftUI Motion"
tags: [genjutsu, swiftui, apple, ios, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/Genjutsu"
---

# ⚡ Genjutsu SwiftUI Motion

> **Имя скилла:** `swiftui-motion`  
> **Локальный путь:** `/root/.agent/skills/_jutsu/swiftui-motion/SKILL.md`  
> **Описание:** Анимации в SwiftUI: PhaseAnimator, KeyframeAnimator, matchedGeometryEffect.

---

# SwiftUI Motion

> SwiftUI animation core. Loaded for any SwiftUI project (iOS, macOS, multi-target Apple).
> Concise rules here. Deep-dive in `references/`.
> Pair with `../motion-principles/SKILL.md` (foundation) and `../mobile-principles/SKILL.md` (touch UX).

---

## Animation API decision tree

| Need | API |
|---|---|
| Single value over time | `withAnimation { } + @State` or `.animation(_, value:)` |
| Multiple coordinated states | `PhaseAnimator(phases)` (iOS 17+) |
| Time-based keyframes | `KeyframeAnimator(initialValue:repeating:content:)` (iOS 17+) |
| Custom property animations | `@Animatable` macro (iOS 26+) or `Animatable` protocol (iOS 13+) |
| Shared element transitions | `matchedGeometryEffect(id:in:)` |
| Gesture-driven | `DragGesture` / `MagnifyGesture` + `.offset` / `.scaleEffect` |
| Loop forever | `.animation(.linear.repeatForever(autoreverses: true), value: ...)` or `.phaseAnimator` |

**Rule:** start with `withAnimation`. Reach for `PhaseAnimator` only when you have 3+ ordered states. Reach for `KeyframeAnimator` only when you need parallel time-based tracks.

---

## Springs (the only easing you should care about)

SwiftUI ships 4 named springs (iOS 17+). Use them. Tune `response` / `dampingFraction` only when a preset is wrong.

| Preset (iOS 17+) | Equivalent | Mood |
|---|---|---|
| `.snappy` | `.spring(response: 0.5, dampingFraction: 0.85)` | UI snappy |
| `.bouncy` | `.spring(response: 0.5, dampingFraction: 0.7)` | playful |
| `.smooth` | `.spring(response: 0.5, dampingFraction: 1.0)` | calm, no bounce |
| `.interactiveSpring()` | `.spring(response: 0.15, dampingFraction: 0.86)` | gesture follow |

`response` is the time the spring takes to settle (lower = snappier, higher = softer). `dampingFraction` is the overshoot intensity in `0...1` (1 = no overshoot, 0 = perpetual oscillation - never use 0). For UI work, stay in `response: 0.2...0.5` and `dampingFraction: 0.7...1.0`. Deep-dive: `references/springs-cheatsheet.md`.

iOS 17+ also exposes `.spring(duration:bounce:)` where `bounce` is `0...1` (0 = critically damped, 1 = full bounce). It's the same spring, exposed in a more designer-friendly way:

```swift
.animation(.spring(duration: 0.4, bounce: 0.3), value: state)
```

---

## Implicit vs explicit animations

```swift
// Implicit - via .animation modifier (binds to a value)
Circle()
    .scaleEffect(scale)
    .animation(.spring(.snappy), value: scale)
```

```swift
// Explicit - via withAnimation block
Button("Grow") {
    withAnimation(.smooth) { scale = 1.5 }
}
```

**Rule:** prefer explicit (`withAnimation`) for state changes triggered by user actions; use implicit when *any* change to a value should always animate (e.g., a progress bar that updates from anywhere). Never both on the same property - the outer `withAnimation` wins, but the implicit `.animation` modifier still runs and stacks confusingly.

---

## Transitions

Transitions drive insertion / removal of views inside an `if`, `switch`, or `ForEach`. They run when the parent's animation context fires (so wrap state mutations in `withAnimation`).

```swift
if visible {
    Card().transition(.asymmetric(
        insertion: .move(edge: .bottom).combined(with: .opacity),
        removal: .opacity.animation(.easeIn(duration: 0.15))
    ))
}
```

**BAD - vanish into a black hole:**
```swift
Card().transition(.scale)  // scales to 0, the universal "broken" feel
```

**GOOD - never scale to 0:**
```swift
Card().transition(
    .scale(scale: 0.95).combined(with: .opacity)
)
```

iOS 17+ also has the `.transition(_:)` modifier with custom transitions via the `Transition` protocol - useful for shared timing across many views. For 90% of work, the built-in combinators (`.move`, `.opacity`, `.scale`, `.slide`, `.push`, `.asymmetric`, `.combined(with:)`) are enough.

---

## matchedGeometryEffect (hero animations)

Tag two views with the same `id` in the same `Namespace`. SwiftUI interpolates frame and position when the source view is replaced.

```swift
struct Gallery: View {
    @Namespace private var ns
    @State private var expanded = false

    var body: some View {
        ZStack {
            if expanded {
                LargeCard()
                    .matchedGeometryEffect(id: "card", in: ns)
                    .onTapGesture { withAnimation(.spring(.smooth)) { expanded = false } }
            } else {
                SmallCard()
                    .matchedGeometryEffect(id: "card", in: ns)
                    .onTapGesture { withAnimation(.spring(.smooth)) { expanded = true } }
            }
        }
    }
}
```

`isSource: true` (default on the source-of-truth view) tells SwiftUI which frame to interpolate from. Common gotchas: id collisions across unrelated namespaces, view identity instability (use stable ids, not array indices), and animating out of an `if` branch where the destination view doesn't exist yet (wrap both branches inside the same parent, use opacity to hide instead of removing).

---

## PhaseAnimator (iOS 17+)

For ordered state choreography. Define a `CaseIterable + Hashable` enum, SwiftUI walks through phases sequentially, settling on the last one.

```swift
enum SuccessPhase: CaseIterable { case start, scaleUp, rotate, settle }

struct SuccessCheck: View {
    @State private var trigger = false

    var body: some View {
        Image(systemName: "checkmark.circle.fill")
            .font(.system(size: 64))
            .foregroundStyle(.green)
            .phaseAnimator(SuccessPhase.allCases, trigger: trigger) { view, phase in
                view
                    .scaleEffect(phase == .start ? 0 : phase == .settle ? 1 : 1.2)
                    .rotationEffect(.degrees(phase == .rotate ? 360 : 0))
                    .opacity(phase == .start ? 0 : 1)
            } animation: { phase in
                switch phase {
                case .start: .smooth(duration: 0.05)
                case .scaleUp: .spring(.bouncy, blendDuration: 0.25)
                case .rotate: .spring(response: 0.4, dampingFraction: 0.8)
                case .settle: .smooth(duration: 0.2)
                }
            }
            .onTapGesture { trigger.toggle() }
    }
}
```

`trigger:` is optional - omit it to advance through phases automatically once on appear. Use it when you need an external signal (button tap, model update). Phases run sequentially, never in parallel - if you need parallelism, use `KeyframeAnimator`.

---

## KeyframeAnimator (iOS 17+)

For continuous, time-based animations with parallel tracks. Each `KeyframeTrack` animates one keypath independently; SwiftUI runs them all together.

```swift
struct AnimationValues {
    var scale: Double = 1
    var rotation: Angle = .zero
    var opacity: Double = 1
}

struct HeartTap: View {
    @State private var counter = 0

    var body: some View {
        Image(systemName: "heart.fill")
            .font(.system(size: 64))
            .foregroundStyle(.pink)
            .keyframeAnimator(initialValue: AnimationValues(), trigger: counter) { content, values in
                content
                    .scaleEffect(values.scale)
                    .rotationEffect(values.rotation)
                    .opacity(values.opacity)
            } keyframes: { _ in
                KeyframeTrack(\.scale) {
                    SpringKeyframe(1.3, duration: 0.15)
                    SpringKeyframe(1.0, duration: 0.3, spring: .bouncy)
                }
                KeyframeTrack(\.rotation) {
                    CubicKeyframe(.degrees(15), duration: 0.1)
                    CubicKeyframe(.degrees(-15), duration: 0.2)
                    CubicKeyframe(.degrees(0), duration: 0.15)
                }
            }
            .onTapGesture { counter += 1 }
    }
}
```

Four keyframe types: `LinearKeyframe` (constant velocity between points), `SpringKeyframe` (settles with spring), `CubicKeyframe` (cubic bezier ease), `MoveKeyframe` (jump cut, no interpolation). Trigger on a value change to re-run the animation. Deep-dive: `references/phase-keyframe-deep.md`.

---

## Animatable / @Animatable

For custom drawing that needs interpolation. The `@Animatable` macro (iOS 26+, WWDC25) auto-synthesizes `animatableData` for any `Equatable` properties; the older `Animatable` protocol (iOS 13+) still works pre-26.

```swift
struct ProgressRing: Shape {
    var progress: Double  // 0...1

    var animatableData: Double {
        get { progress }
        set { progress = newValue }
    }

    func path(in rect: CGRect) -> Path {
        var p = Path()
        p.addArc(
            center: CGPoint(x: rect.midX, y: rect.midY),
            radius: rect.width / 2,
            startAngle: .degrees(-90),
            endAngle: .degrees(-90 + 360 * progress),
            clockwise: false
        )
        return p
    }
}

ProgressRing(progress: progress)
    .stroke(.tint, lineWidth: 6)
    .animation(.spring(.smooth), value: progress)
```

For multi-property shapes use `AnimatablePair<A, B>` (or nested pairs) as `animatableData`. The `@Animatable` macro removes that boilerplate when properties are `Equatable + Animatable`.

---

## Gestures

| Gesture | Type | Use |
|---|---|---|
| `TapGesture` | discrete | tap, double-tap (`count: 2`) |
| `LongPressGesture` | discrete + continuous (`onEnded`/`onChanged`) | context menus, hold-to-record |
| `DragGesture` | continuous | drag, swipe-to-dismiss |
| `MagnifyGesture` | continuous | pinch-zoom (iOS 17+, replaces `MagnificationGesture`) |
| `RotateGesture` | continuous | rotate (iOS 17+, replaces `RotationGesture`) |
| `SpatialTapGesture` | discrete | tap with location info |

```swift
let tap = TapGesture().onEnded { print("tap") }
let drag = DragGesture().onChanged { value in offset = value.translation }
ZStack { ... }
    .gesture(tap.simultaneously(with: drag))
```

Three composition operators: `.simultaneously(with:)` (parallel recognition), `.sequenced(before:)` (one must complete first), `.exclusively(before:)` (one or the other, not both). For fine-grained control over when child views can claim the gesture, use `.simultaneousGesture(_, including: GestureMask)` with `.gesture`, `.subviews`, `.all`, or `.none`. Deep-dive: `references/gestures-swiftui.md`.

---

## Anti-Patterns (BAD / GOOD)

### 1. Deprecated `.animation` form (no value binding)

```swift
// BAD - implicit-anim-everywhere, deprecated in iOS 15+
Circle().scaleEffect(scale).animation(.easeInOut)
```

```swift
// GOOD - bind to a specific value
Circle().scaleEffect(scale).animation(.easeInOut, value: scale)
// OR
withAnimation(.easeInOut) { scale = 1.5 }
```

### 2. Animating frame size directly

```swift
// BAD - .frame() drives layout pass every frame, drops fps under load
Card().frame(height: expanded ? 400 : 100)
    .animation(.spring(), value: expanded)
```

```swift
// GOOD - animate transform-equivalents (scale, offset) that the compositor handles
Card()
    .frame(height: 400)
    .scaleEffect(expanded ? 1 : 0.4, anchor: .top)
    .animation(.spring(), value: expanded)
// OR for actual layout transitions, use matchedGeometryEffect
```

### 3. Scale to 0 (the vanish-into-nothing trap)

```swift
// BAD - element vanishes into a black hole, feels broken
Card().transition(.scale)
```

```swift
// GOOD - minimum scale 0.9-0.95 + opacity
Card().transition(.scale(scale: 0.95).combined(with: .opacity))
```

### 4. `withAnimation` inside `body`

```swift
// BAD - body runs on every render, animation re-fires arbitrarily
var body: some View {
    let _ = withAnimation(.spring()) { scale = 1.2 }  // never do this
    Circle().scaleEffect(scale)
}
```

```swift
// GOOD - trigger from user actions or .onChange
var body: some View {
    Circle()
        .scaleEffect(scale)
        .onTapGesture {
            withAnimation(.spring()) { scale = scale == 1 ? 1.2 : 1 }
        }
}
```

---

## Reduced motion respect

Mandatory. SwiftUI exposes the iOS / macOS "Reduce Motion" accessibility setting via the environment. See `../motion-principles/SKILL.md` for the cross-platform rationale.

```swift
struct Hero: View {
    @Environment(\.accessibilityReduceMotion) var reduceMotion
    @State private var shown = false

    var body: some View {
        Text("Welcome")
            .opacity(shown ? 1 : 0)
            .offset(y: shown ? 0 : (reduceMotion ? 0 : 20))
            .animation(reduceMotion ? .none : .spring(.smooth), value: shown)
            .onAppear { shown = true }
    }
}
```

Rule: cross-fades and opacity are still allowed under reduced motion; large translations, scale-from-zero, parallax, and looping motion must be neutralized.

---

## Quick Reference: Loading sub-skills

| Need | Load |
|---|---|
| Springs deep-dive (response/dampingFraction tuning, mood) | `references/springs-cheatsheet.md` |
| PhaseAnimator + KeyframeAnimator complex sequences | `references/phase-keyframe-deep.md` |
| Gesture composition + conflict resolution | `references/gestures-swiftui.md` |
| Advanced visuals (Metal, Liquid Glass) | `../swiftui-graphics/SKILL.md` |
| Cross-platform UX (mobile, desktop) | `../mobile-principles/SKILL.md`, `../desktop-principles/SKILL.md` |
| Foundation (timing, easing, a11y) | `../motion-principles/SKILL.md` |

---

## Sources

- [twostraws/SwiftUI-Agent-Skill](https://github.com/twostraws/SwiftUI-Agent-Skill)
- [GetStream/swiftui-spring-animations](https://github.com/GetStream/swiftui-spring-animations)
- [amosgyamfi/open-swiftui-animations](https://github.com/amosgyamfi/open-swiftui-animations)
- [AvdLee/SwiftUI-Agent-Skill](https://github.com/AvdLee/SwiftUI-Agent-Skill)
- [Apple SwiftUI Animations](https://developer.apple.com/documentation/swiftui/animations)
- [Apple PhaseAnimator](https://developer.apple.com/documentation/swiftui/phaseanimator)
- [Apple KeyframeAnimator](https://developer.apple.com/documentation/swiftui/keyframeanimator)
- [WWDC23 Animate with springs](https://developer.apple.com/videos/play/wwdc2023/10158/)
- [WWDC23 Wind your way through advanced animations](https://developer.apple.com/videos/play/wwdc2023/10157/)
