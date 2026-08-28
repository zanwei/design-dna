---
title: "Genjutsu Compose Motion"
tags: [genjutsu, compose, android, kotlin, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/Genjutsu"
---

# ⚡ Genjutsu Compose Motion

> **Имя скилла:** `compose-motion`  
> **Локальный путь:** `/root/.agent/skills/_jutsu/compose-motion/SKILL.md`  
> **Описание:** Анимации Jetpack Compose: пружины, SharedTransitionLayout, AnimatedVisibility.

---

# Compose Motion - Sub-skill

> Jetpack Compose animation core. Loaded for Android Compose and Compose Multiplatform projects.
> Concise rules here. Deep-dive in `references/`.
> Baseline: current stable Jetpack Compose (1.7+). Modern stable APIs only - no `swipeable`, no `animateContentSize` hacks where `AnimatedContent` is correct.

---

## API Decision Tree

| Need | API |
|---|---|
| Single value over time | `animateFloatAsState`, `animateDpAsState`, `animateColorAsState`, etc. |
| Visibility / mount-unmount | `AnimatedVisibility(visible) { ... }` |
| Crossfade between states | `Crossfade(target) { state -> ... }` |
| Multi-state coordinated | `updateTransition(target).animateFloat { ... }` |
| Manual control / interruption | `Animatable(initialValue)` + `animateTo(...)` |
| Looping / infinite | `rememberInfiniteTransition().animateFloat(...)` |
| Shared elements | `SharedTransitionLayout` + `Modifier.sharedElement(...)` (Compose 1.7+) |
| Layout swap with anim | `AnimatedContent(target) { ... }` |
| Drag / swipe | `Modifier.draggable` + `Animatable.snapTo`/`animateTo`, or `Modifier.anchoredDraggable` for snap-points |

**Rule:** climb the ladder only when needed. `animate*AsState` covers 70% of cases. Reach for `Animatable` only when you need to interrupt, chain, or read velocity.

---

## Spring API (opinionated defaults)

| Use | Spec |
|---|---|
| UI snap (modal, drawer, tab) | `spring(stiffness = Spring.StiffnessMediumLow, dampingRatio = Spring.DampingRatioNoBouncy)` |
| Tactile (button press release, toggle) | `spring(stiffness = Spring.StiffnessMedium, dampingRatio = 0.85f)` |
| Bouncy reveal (toast, FAB, success) | `spring(stiffness = Spring.StiffnessLow, dampingRatio = Spring.DampingRatioMediumBouncy)` |
| Drag follow (1:1 finger tracking) | `spring(stiffness = Spring.StiffnessHigh, dampingRatio = 1f)` |

Stiffness constants: `VeryLow` 200, `Low` 400, `MediumLow` 700, `Medium` 1500, `High` 10000. Higher = faster settle. Damping constants: `HighBouncy` 0.2, `MediumBouncy` 0.5, `LowBouncy` 0.75, `NoBouncy` 1.0. Below 1.0 overshoots. Springs ignore `durationMillis`; if you need a deterministic duration, use `tween(...)` instead.

---

## `animate*AsState` - The Bread and Butter

```kotlin
val targetAlpha = if (visible) 1f else 0f
val alpha by animateFloatAsState(
    targetValue = targetAlpha,
    animationSpec = spring(stiffness = Spring.StiffnessMedium),
    label = "alpha",
)
Box(modifier = Modifier.alpha(alpha))
```

The `label` shows up in Layout Inspector / Animation Preview - always set it, future-you will thank present-you. Variants ship for `Dp`, `Color`, `Offset`, `IntOffset`, `Size`, `Rect`, `Float`, `Int`, and a generic `animateValueAsState` for custom types via `TwoWayConverter`.

---

## `AnimatedVisibility` - Mount / Unmount with Anim

```kotlin
AnimatedVisibility(
    visible = expanded,
    enter = slideInVertically(initialOffsetY = { -it }) + fadeIn(),
    exit = slideOutVertically(targetOffsetY = { -it }) + fadeOut(animationSpec = tween(150)),
) {
    Panel()
}
```

Combine multiple enter/exit transitions with `+`. Respect motion-principles: exit shorter and simpler than enter (here 150ms tween fade vs full slide+fade enter). The content composable only runs while visible OR animating - safe to mount expensive children inside.

---

## `AnimatedContent` - State-Driven Layout Swap

```kotlin
AnimatedContent(
    targetState = currentTab,
    transitionSpec = {
        (slideInHorizontally { it } + fadeIn()) togetherWith
            (slideOutHorizontally { -it } + fadeOut())
    },
    label = "tabs",
) { tab ->
    TabContent(tab)
}
```

`togetherWith` runs enter and exit in parallel; `using SizeTransform(clip = false)` controls how the container resizes between contents. Keys matter: if `targetState` doesn't change identity, no transition fires.

---

## `Crossfade` - Simple Fade Between States

```kotlin
Crossfade(targetState = isLoading, label = "loadState") { loading ->
    if (loading) Spinner() else Content()
}
```

Use when you only need a fade. For anything richer (slide, scale, layout-aware), reach for `AnimatedContent`. `Crossfade` does NOT animate size - the container takes the size of the new content immediately.

---

## `updateTransition` - Multi-Property Coordinated

```kotlin
val transition = updateTransition(targetState = expanded, label = "expand")
val width by transition.animateDp(label = "width") { if (it) 300.dp else 100.dp }
val color by transition.animateColor(label = "color") { if (it) Color.Blue else Color.Gray }
val corner by transition.animateDp(label = "corner") { if (it) 24.dp else 8.dp }

Box(
    Modifier
        .width(width)
        .background(color, RoundedCornerShape(corner)),
)
```

Use when several properties animate together based on the same state. All children share the same transition timeline, so they finish in sync. Each `animate*` call accepts its own `transitionSpec` lambda for per-property tuning.

---

## `Animatable` - Manual Control

```kotlin
val offsetX = remember { Animatable(0f) }
LaunchedEffect(triggerEvent) {
    offsetX.animateTo(100f, spring())
    offsetX.animateTo(0f, spring(dampingRatio = Spring.DampingRatioMediumBouncy))
}
Box(Modifier.offset { IntOffset(offsetX.value.roundToInt(), 0) })
```

Reach for `Animatable` when you need to interrupt (`stop()`), chain (`animateTo` returns when finished), read live velocity, or kick off decay (`animateDecay`). It is the imperative escape hatch for drag-then-fling, snap-back, and any flow `animate*AsState` cannot express.

---

## `SharedTransitionLayout` (Compose 1.7+) - Hero Animations

```kotlin
SharedTransitionLayout {
    AnimatedContent(targetState = currentScreen, label = "nav") { screen ->
        when (screen) {
            Screen.List -> ListScreen(
                sharedTransitionScope = this@SharedTransitionLayout,
                animatedVisibilityScope = this@AnimatedContent,
            )
            is Screen.Detail -> DetailScreen(
                item = screen.item,
                sharedTransitionScope = this@SharedTransitionLayout,
                animatedVisibilityScope = this@AnimatedContent,
            )
        }
    }
}

// Inside ListScreen, on the card image:
with(sharedTransitionScope) {
    Image(
        painter = painter,
        contentDescription = null,
        modifier = Modifier.sharedElement(
            state = rememberSharedContentState(key = "hero-${item.id}"),
            animatedVisibilityScope = animatedVisibilityScope,
        ),
    )
}
```

Two scopes plumbed down: `SharedTransitionScope` (where `Modifier.sharedElement` extension lives) and `AnimatedVisibilityScope` (the visibility context that drives the transition). `rememberSharedContentState(key)` keys MUST match across screens or no animation fires. Deep-dive in `references/shared-transitions.md`.

---

## `InfiniteTransition` - Looping

```kotlin
val infinite = rememberInfiniteTransition(label = "loader")
val rotation by infinite.animateFloat(
    initialValue = 0f,
    targetValue = 360f,
    animationSpec = infiniteRepeatable(
        animation = tween(1000, easing = LinearEasing),
        repeatMode = RepeatMode.Restart,
    ),
    label = "rotation",
)
Icon(Icons.Default.Refresh, contentDescription = null, modifier = Modifier.rotate(rotation))
```

`RepeatMode.Restart` jumps back to start each cycle; `RepeatMode.Reverse` ping-pongs. Always provide a pause / off path for accessibility (see Reduced Motion section below). For one-shot decay (fling), use `Animatable.animateDecay` instead.

---

## Gestures (quick map)

| Need | Modifier |
|---|---|
| Tap | `Modifier.clickable(onClick = ...)` |
| Tap + long-press | `Modifier.combinedClickable(onClick = ..., onLongClick = ...)` |
| Drag (single axis) | `Modifier.draggable(state, orientation)` |
| Multi-touch / custom | `Modifier.pointerInput { detectDragGestures { ... } }` |
| Scroll offset reading | `LazyListState` or `ScrollState.value` |
| Swipe-to-dismiss / snap points | `Modifier.anchoredDraggable(state)` (Compose 1.6+, replaces `swipeable`) |
| Pinch + pan + rotate | `Modifier.transformable(state)` |

Deep-dive in `references/gestures-compose.md` (NestedScrollConnection, conflict resolution, fling decay).

---

## Anti-Patterns (BAD / GOOD)

### 1. Animating layout size instead of transform

```kotlin
// BAD - animateDpAsState on width forces a layout pass every frame
val w by animateDpAsState(if (expanded) 300.dp else 100.dp)
Box(Modifier.width(w).height(60.dp))
```

```kotlin
// GOOD - animate scale via graphicsLayer (composite-only, no layout)
val scale by animateFloatAsState(if (expanded) 3f else 1f, label = "scale")
Box(
    Modifier
        .width(100.dp)
        .height(60.dp)
        .graphicsLayer {
            scaleX = scale
            transformOrigin = TransformOrigin(0f, 0.5f)
        },
)
```

If the actual layout size MUST change (parent depends on it), use `Modifier.animateContentSize()` so neighbors animate too, or wrap the swap in `AnimatedContent`.

### 2. `LaunchedEffect(true)` / `LaunchedEffect(Unit)` with hidden inputs

```kotlin
// BAD - re-runs only once, BUT also fires on every recomposition surprise
//        when callers swap the composable instance. Worse: anything captured
//        in the lambda is stale.
LaunchedEffect(true) {
    offsetX.animateTo(target)
}
```

```kotlin
// GOOD - explicit key tied to the trigger
LaunchedEffect(triggerKey) {
    offsetX.animateTo(target)
}
```

If you genuinely want "run once", use `LaunchedEffect(Unit)` on purpose AND ensure you don't capture varying state - or hoist the captured values out. When in doubt, key on the values you read.

### 3. Forgetting `key` in a `LazyColumn` with item animations

```kotlin
// BAD - on insert/delete/reorder, items animate to wrong slots
LazyColumn {
    items(list) { item ->
        AnimatedVisibility(visible = item.expanded) { ItemRow(item) }
    }
}
```

```kotlin
// GOOD - stable key by id, plus Modifier.animateItem for reorder anim
LazyColumn {
    items(list, key = { it.id }) { item ->
        Row(modifier = Modifier.animateItem()) {
            AnimatedVisibility(visible = item.expanded) { ItemRow(item) }
        }
    }
}
```

`Modifier.animateItem()` (Compose 1.7+, replaces `animateItemPlacement`) handles insert/remove/move automatically when `key` is stable.

### 4. Nesting `AnimatedContent` inside scrolling list items

```kotlin
// BAD - every item runs its own transition graph; scroll = jank
LazyColumn {
    items(list, key = { it.id }) { item ->
        AnimatedContent(targetState = item.state) { state -> Row(state) }
    }
}
```

```kotlin
// GOOD - lift state, animate only the changing prop on the row
LazyColumn {
    items(list, key = { it.id }) { item ->
        val color by animateColorAsState(if (item.selected) selBg else bg, label = "rowBg")
        Row(Modifier.background(color)) { Content(item) }
    }
}
```

Rule: heavy animation containers (`AnimatedContent`, `SharedTransitionLayout`) belong at screen scope, not per row.

---

## Reduced Motion - Respect It

See `../motion-principles/SKILL.md` for the cross-platform doctrine.

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

val reduce = rememberReduceMotion()
val alpha by animateFloatAsState(
    targetValue = if (visible) 1f else 0f,
    animationSpec = if (reduce) snap() else spring(),
    label = "alpha",
)
```

`ANIMATOR_DURATION_SCALE` reads the animator duration scale directly. The cleaner call is `ValueAnimator.areAnimatorsEnabled()` (API 26+), which returns `false` when that scale is 0 - set by the developer-options "Animation off" toggle, Battery Saver, and the user-facing "Remove animations" (Settings -> Accessibility) toggle alike. Deep-dive in `../mobile-principles/references/accessibility-mobile.md`.

---

## Quick Reference

| Need | Load |
|---|---|
| Shared transitions deep-dive | `references/shared-transitions.md` |
| Gestures + nestedScroll patterns | `references/gestures-compose.md` |
| Recomposition / jank / Layout Inspector | `references/recomposition-and-anim.md` |
| Advanced (M3 Expressive, AGSL, Canvas) | `../compose-graphics/SKILL.md` |
| CMP / KMP patterns | `../compose-multiplatform/SKILL.md` |
| Mobile UX context | `../mobile-principles/SKILL.md` |
| Foundation (timing, easing, a11y) | `../motion-principles/SKILL.md` |

---

## Sources

- [aldefy/compose-skill](https://github.com/aldefy/compose-skill) - animation reference
- [skydoves/Orbital](https://github.com/skydoves/Orbital) - shared element transitions
- [mutualmobile/compose-animation-examples](https://github.com/mutualmobile/compose-animation-examples)
- [fornewid/material-motion-compose](https://github.com/fornewid/material-motion-compose)
- [Android Compose animations docs](https://developer.android.com/develop/ui/compose/animation/introduction)
- [Android SharedTransitionLayout](https://developer.android.com/develop/ui/compose/animation/shared-elements)
