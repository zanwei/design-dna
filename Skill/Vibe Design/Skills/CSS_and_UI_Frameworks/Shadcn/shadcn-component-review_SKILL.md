---
name: shadcn-component-review
description: Review custom components and layouts against shadcn design patterns, visual style conventions (Vega, Nova, Maia, Lyra, Mira), composition rules, design token usage, and Radix/Base UI composition patterns. Use PROACTIVELY after writing or modifying any custom UI component, page layout, or variant of a shadcn component. Use when the user says "review this component", "check my spacing", "does this follow shadcn patterns", "audit this layout", "is this shadcn-idiomatic", or shares a component for feedback. Catches spacing drift, hardcoded colors, missing data-slot attributes, inconsistent theme application, and composition anti-patterns that shipping-fast-with-AI tools often miss.
---

# shadcn Component Review

Systematic audit process for ensuring custom components align with shadcn design patterns, the project's chosen visual style, and modern composition conventions.

## How This Complements the Official shadcn Skill

The official `shadcn` skill (shipped with CLI v4) enforces rules at *generation time* — telling agents "use `gap-*` not `space-y-*`, use semantic colors, use `size-*` for equal width/height," and so on. That's correct behavior when writing new code.

This skill is for *post-hoc audit* — reviewing components that already exist (written by Claude, by a teammate, by a previous iteration) against those same rules *plus* the visual-style-specific patterns that vary by theme (Vega spacing differs from Maia differs from Mira). When the two skills both apply, the official handles forward-generation and this one handles retrospective review. They don't conflict — they check the same rules from different directions.

## Core Principle

Reviews catch drift. Even with the official skill enforcing rules during generation, components drift over time: someone copies from an older project, an LLM suggests `space-y-4` and nobody catches it, a component was built before the project standardized on Maia, or a contributor uses Tailwind's color scale instead of semantic tokens. This skill finds those issues systematically.

## When to Trigger

**Proactive triggers** (activate after components are written):

- Claude just finished writing or modifying a custom component
- User says "I built this" and pastes a component
- User asks to add styling to an existing element
- User is iterating on a layout

**Explicit triggers** (user directly requests review):

- "Review this component"
- "Check my spacing"
- "Is this shadcn-idiomatic?"
- "Does this follow the patterns?"
- "Audit this layout"

## Before Reviewing: Project Context

Before applying theme-specific patterns, understand the project. If the shadcn CLI is available, run:

```bash
npx shadcn@latest info --json
```

This returns: framework (Next.js / Vite / etc.), Tailwind version, base library (`radix` or `base`), installed components, icon library, resolved file paths, and the current style. Use this output to:

- Match spacing/shape expectations to the project's visual style
- Apply the correct composition pattern for the primitive base (Radix vs Base UI — APIs differ)
- Know which components are already installed vs suggesting installs

If the CLI isn't available, infer from `components.json` directly, or ask the user: "Which visual style is this project using — Vega, Nova, Maia, Lyra, or Mira?"

## Review Workflow

### Step 1: Structure & Composition

Check the component is structured using shadcn conventions.

**`data-slot` attributes.** Every semantic element within a component should carry a `data-slot` attribute naming its role. This enables styling hooks, testing selectors, and consistent theming. Confirmed current pattern in shadcn source (e.g. `<button data-slot="button" data-variant={variant} data-size={size}>`).

**Composition, not modification.** Custom components should compose primitives from `@/components/ui/*`, not fork and modify them. If a primitive needs different behavior, wrap it; don't edit the source.

**Primitive base awareness.** If the project uses Radix (`--base radix`), expect `asChild` and `Slot` patterns, Radix data-state attributes. If Base UI (`--base base`), expect different composition APIs. Reference the current docs for the installed primitive: `npx shadcn@latest docs <component>`.

### Step 2: Spacing Audit

Spacing is where most drift happens. Check against the project's visual style — see [references/theme-styles.md](references/theme-styles.md) for per-style patterns.

**Universal rules (apply to all themes):**

- Use `gap-*` in flex/grid containers, never `space-y-*` / `space-x-*` or margins
- Use Tailwind's standard spacing scale (multiples of 4px: 1, 1.5, 2, 4, 6, 8 — avoid 3, 5, 7)
- Use `size-*` when width and height are equal (`size-10` not `w-10 h-10`)
- Responsive spacing uses `gap-X md:gap-Y` pattern

**Style-specific rules:** density and radius expectations differ by style. Reference [references/theme-styles.md](references/theme-styles.md) for the specifics.

### Step 3: Design Tokens

Verify semantic tokens only — no hardcoded Tailwind color scale values.

| Category | Use | Avoid |
|---|---|---|
| Text color | `text-foreground`, `text-muted-foreground`, `text-primary` | `text-neutral-500`, `text-gray-900`, `text-slate-700` |
| Background | `bg-background`, `bg-card`, `bg-muted`, `bg-accent` | `bg-gray-100`, `bg-white`, `bg-neutral-50` |
| Border | `border-border`, `border-input` | `border-gray-200`, `border-neutral-300` |
| Border radius | `rounded-md`, `rounded-lg` (uses `--radius`) | `rounded-[20px]`, `rounded-[8px]` |

Quick grep to flag hardcoded colors:

```bash
grep -rE '\b(neutral|gray|slate|zinc|stone)-[0-9]{2,3}\b' <path>
```

### Step 4: Composability

Check the component can be reused without modification.

- Takes a `className` prop merged via `cn()`
- Exposes variants via CVA where variation is likely
- Doesn't hardcode content; accepts `children` or content-shaped props
- Isn't tightly coupled to a specific data model or route

### Step 5: Responsive & Accessibility

- Mobile-first baseline (< 768px design), progressive enhancement via `md:`, `lg:`
- Touch targets minimum ~44px on interactive elements
- `min-w-0` on flex children to prevent overflow
- Semantic HTML (buttons are `<button>`, not styled `<div>`)
- Focus-visible states present (`focus-visible:ring-*`, `focus-visible:border-*`)
- Motion respects `motion-safe:` / `prefers-reduced-motion`

See [references/review-checklist.md](references/review-checklist.md) for the expanded checklist.

## Foundational Patterns

### CVA (Class Variance Authority)

Variants are declared via `cva()`, typed via `VariantProps`:

```tsx
import { cva, type VariantProps } from "class-variance-authority"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-all",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border bg-background hover:bg-accent",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 px-3 text-xs",
      },
    },
    defaultVariants: { variant: "default", size: "default" },
  }
)

type ButtonProps = React.ComponentProps<"button"> & VariantProps<typeof buttonVariants>
```

Extend with new variants; don't modify the base layer.

### cn() Utility

Combines `clsx` (conditionals) + `tailwind-merge` (conflict resolution). Always use for className composition:

```tsx
import { cn } from "@/lib/utils"

<div className={cn(
  "base-classes",
  isActive && "active-classes",
  className // consumer overrides win
)} />
```

### Theme-Aware Styling

shadcn themes use CSS variables (OKLCH-based since 2025). Key variables: `--radius`, `--background`, `--foreground`, `--primary`, `--secondary`, `--accent`, `--muted`, `--card`, `--popover`, `--destructive`, `--border`, `--input`, `--ring`.

Use Tailwind's semantic class names that map to these (`rounded-md` → `--radius`, `bg-primary` → `--primary`) rather than hardcoded values.

### Animation

Brief conventions:
- Hover/focus/active: Tailwind transitions, 150ms
- Color/state transitions: 200ms
- Enter/exit of DOM elements: Tailwind `animate-in`/`animate-out` with Radix `data-state`, or Motion's `AnimatePresence`
- Always respect `motion-safe:` for transform-based animations

See [references/animation-patterns.md](references/animation-patterns.md) for the full guide.

## Visual Styles Reference

shadcn ships five official visual styles, configurable via `npx shadcn create` or via preset codes (CLI v4):

| Style | Density | Shape | Canonical use |
|---|---|---|---|
| **Vega** | Standard | Classic | Default shadcn look |
| **Nova** | Compact | Standard | Dense UIs, data-heavy apps |
| **Maia** | Generous | Soft/rounded (often pill) | Consumer apps, friendly interfaces |
| **Lyra** | Standard | Boxy/sharp | Developer tools, mono fonts |
| **Mira** | Dense | Compact | Admin dashboards, power users |

Each style affects spacing scale, border radius, and component dimensions. See [references/theme-styles.md](references/theme-styles.md) for per-style spacing patterns and common mistakes.

**Presets** (new in CLI v4) pack style + theme + fonts + icons + radius into a single short code applied via `npx shadcn@latest apply --preset <code>`. When reviewing, check the project's preset if configured — it's the source of truth for many of these conventions.

## Scope: What This Skill Does NOT Enforce

Be explicit about the difference between shadcn canon and project-specific conventions. This skill reviews against shadcn canon. Project-specific conventions (e.g. "our team always uses `gap-4` between form fields") belong in the project's own style guide or a project-specific skill, not this one.

When in doubt, cite the source: "shadcn components use `data-slot` — see the button source at `ui.shadcn.com/docs/components/button`" vs "your project consistently uses `gap-4` between form fields."

## Output Format

A good review:

1. **Summarizes** what was reviewed in one line
2. **Flags issues** grouped by category (structure, spacing, tokens, composability, responsive/a11y)
3. **Severity-marks** each issue: ✅ passes, ⚠️ suggestion, ❌ blocking
4. **Shows the fix** inline where the fix is short and obvious; references the relevant pattern file where the fix is nuanced
5. **Offers to apply fixes** if the user wants

Keep it scannable. Don't belabor passing items — a single ✅ summary line for what's good is enough.

### Example Review Output

```markdown
## Review: `<PageHeader />`

**Structure** ✅ `data-slot` present, composition clean
**Spacing** ⚠️ Uses `space-y-4` in flex container — swap to `gap-4`
**Tokens** ❌ `text-neutral-500` on line 12 — use `text-muted-foreground`
**Composability** ✅ Accepts className, variant props via CVA
**Responsive/a11y** ⚠️ Missing `min-w-0` on flex child (may overflow on narrow screens)

Fixes:
- Line 8: `space-y-4` → `gap-4`
- Line 12: `text-neutral-500` → `text-muted-foreground`
- Line 18: Add `min-w-0` to wrapping `<div>`

Want me to apply these?
```

## Reference Files

- [references/theme-styles.md](references/theme-styles.md) — Per-style spacing, shape, and common mistakes
- [references/review-checklist.md](references/review-checklist.md) — Expanded audit checklist by category
- [references/animation-patterns.md](references/animation-patterns.md) — Timing, easing, Radix data-state, Motion patterns

## Resources

- **Official shadcn docs:** [ui.shadcn.com](https://ui.shadcn.com)
- **Component reference (live):** `npx shadcn@latest docs <component>` — returns current doc and example URLs
- **Project context:** `npx shadcn@latest info --json`
- **Theme creator:** [ui.shadcn.com/create](https://ui.shadcn.com/create)
- **TweakCN (interactive theme editor):** [tweakcn.com](https://tweakcn.com)
