# Animation Patterns Reference

shadcn components use consistent, subtle animations. This guide covers timing, easing, and common patterns — CSS-based for simple cases, Motion-based for complex orchestration.

## Core Principles

1. **Subtle over dramatic** — animations enhance, never distract
2. **Consistent timing** — same duration and easing for similar interactions
3. **Accessibility first** — always respect `prefers-reduced-motion`
4. **GPU-accelerated** — prefer `transform` and `opacity`; avoid animating `width`/`height`

## Timing Standards

| Context | Duration | Use case |
|---|---|---|
| 150ms | Fast | Hover, active, focus-ring, button press |
| 200ms | Normal | Color transitions, most state changes |
| 300ms | Slow | Modal enter/exit, drawer slide, emphasis |

**Rule of thumb:** if it's a direct response to user action, 150–200ms. If it's a state change the user is watching, 200–300ms. Durations over 400ms feel sluggish for UI interactions.

## Easing Curves

```tsx
// Enter (appearing)
transition={{ ease: "easeOut" }}
className="ease-out"

// Exit (disappearing)
transition={{ ease: "easeIn" }}
className="ease-in"

// Continuous / looping
transition={{ ease: "linear" }}
className="ease-linear"

// Interactive elements (spring physics)
transition={{ type: "spring", stiffness: 400, damping: 17 }}
```

## Tailwind CSS Patterns

### Hover, focus, active

```tsx
// Scale transform (subtle, transform-based)
<Button className="transition-transform duration-150 hover:scale-[1.02] active:scale-[0.98]">

// Color transition
<Card className="transition-colors duration-200 hover:bg-accent">

// Focus ring (standard shadcn pattern)
<Input className="transition-shadow duration-150 focus-visible:ring-[3px] focus-visible:ring-ring/50" />
```

### Loading indicators

```tsx
// Spinner
<Loader className="animate-spin" />

// Skeleton pulse
<div className="animate-pulse bg-muted rounded" />

// Ping (e.g. notification dot)
<span className="animate-ping absolute size-2 rounded-full bg-primary" />
```

### Radix primitive animations (data-state)

Radix exposes `data-state` attributes that can be styled via Tailwind's data-variant selectors:

```tsx
<DialogContent className="
  data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95
  data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95
" />
```

```tsx
<AccordionContent className="
  data-[state=open]:animate-in data-[state=open]:slide-down
  data-[state=closed]:animate-out data-[state=closed]:slide-up
" />
```

Tailwind v4 + `tw-animate-css` ships these classes; earlier setups may use `tailwindcss-animate`.

## Motion (formerly Framer Motion)

In 2025, Framer Motion was renamed to **Motion** and moved from `framer-motion` to `motion/react`. New code should use `motion/react`. Existing code using `framer-motion` still works — both packages are maintained.

```tsx
// New recommended import
import { motion, AnimatePresence } from "motion/react"

// For Next.js RSC
import * as motion from "motion/react-client"
```

### Modal / Dialog

```tsx
<AnimatePresence>
  {isOpen && (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
    >
      <DialogContent />
    </motion.div>
  )}
</AnimatePresence>
```

### Drawer / Sheet (slide-in)

```tsx
<motion.div
  initial={{ x: "100%" }}
  animate={{ x: 0 }}
  exit={{ x: "100%" }}
  transition={{ type: "spring", damping: 25, stiffness: 300 }}
/>
```

### Staggered list

```tsx
const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.05 }
  }
}

const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.2 } }
}

<motion.ul variants={container} initial="hidden" animate="show">
  {items.map(i => (
    <motion.li key={i.id} variants={item}>…</motion.li>
  ))}
</motion.ul>
```

### Respecting reduced motion

```tsx
import { useReducedMotion } from "motion/react"

function Component() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={{
        x: shouldReduceMotion ? 0 : 100,
        opacity: 1, // opacity is generally safe
      }}
    />
  )
}
```

## Tailwind `motion-safe:` Prefix

For purely CSS-driven transforms, use `motion-safe:` to automatically disable animation when the user prefers reduced motion:

```tsx
<Button className="motion-safe:transition-transform motion-safe:hover:scale-105" />
```

For `opacity` and `color` transitions, the `motion-safe:` prefix is usually unnecessary — the motion these create is minimal.

## Decision Tree

```
Is it hover / focus / active state?
  → Tailwind (transition-*, duration-150)

Is it a loading indicator?
  → Tailwind (animate-spin, animate-pulse)

Is it a Radix primitive entering / exiting?
  → Tailwind data-state classes (data-[state=open]:animate-in etc.)

Is it a non-Radix element entering / exiting the DOM?
  → Motion AnimatePresence

Multiple elements entering in sequence?
  → Motion variants with staggerChildren

Gesture-based (drag, whileHover, whileTap)?
  → Motion

Layout change (shared element, reordering)?
  → Motion layout prop

Otherwise?
  → Start with Tailwind, upgrade to Motion only if needed
```

## Anti-Patterns

**Avoid:**

- Durations over 400ms for UI interactions (feels sluggish)
- `transition: all` or `transition-all` (costs performance, animates unintended properties)
- Animating `width` or `height` directly — use `transform: scale` or layout animations
- Forgetting `motion-safe:` prefix on transform-based Tailwind animations
- Dramatic bounces or overshoots for functional UI

**Prefer:**

- Specific transition properties (`transition-transform`, `transition-colors`, `transition-shadow`)
- `transform` and `opacity` only, when possible
- Subtle, professional motion (200ms or less for most interactions)
- Consistent timing across similar components within the same product
- Hardware-accelerated scroll animations (`useScroll` with spring physics in Motion v12+)

## Reference Links

- **Motion (React):** [motion.dev/docs/react](https://motion.dev/docs/react)
- **Motion upgrade guide (from Framer Motion):** [motion.dev/docs/react-upgrade-guide](https://motion.dev/docs/react-upgrade-guide)
- **Tailwind data-* variants:** [tailwindcss.com/docs/hover-focus-and-other-states#data-attributes](https://tailwindcss.com/docs/hover-focus-and-other-states#data-attributes)
- **prefers-reduced-motion:** [developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-reduced-motion)
