# Component Review Checklist

Expanded audit checklist organized by category. Use as a structured reference during review — items are grouped as **Canon** (shadcn's explicit conventions) vs **Project** (common patterns that vary by team/style).

## Quick Audit (10-second pass)

For simple reviews, run through this minimal checklist:

- [ ] Uses `gap-*` in flex/grid containers (not `space-y-*`, `space-x-*`, or child margins)
- [ ] Uses Tailwind scale values (no `gap-3`, `gap-5`, `gap-7`, `gap-[13px]`)
- [ ] Uses `size-*` when width equals height (`size-10` not `w-10 h-10`)
- [ ] Uses semantic color tokens (`text-muted-foreground`, not `text-neutral-500`)
- [ ] Has `data-slot` attributes on semantic sub-elements
- [ ] Accepts `className` merged via `cn()`
- [ ] Uses theme-variable-backed radius (`rounded-md`, not `rounded-[20px]`)
- [ ] Focus-visible states present on interactive elements
- [ ] Mobile-first spacing (`gap-X md:gap-Y`, not just `gap-Y`)

## Detailed Review

### 1. Structure & Composition

**Canon:**

- [ ] Main wrapper has `data-slot="<component-name>"`
- [ ] Sub-components have semantic `data-slot` values (`data-slot="card-header"`, etc.)
- [ ] Composes existing primitives rather than forking `@/components/ui/*`
- [ ] Uses `asChild` / `Slot` pattern when delegating rendering (Radix) or the equivalent base-ui pattern
- [ ] Forwards refs where relevant (e.g. when used in forms, tooltips, popovers)

**Project:**

- [ ] Sub-component naming follows project convention (`Card.Header` vs `CardHeader` — both are valid, but a project should pick one)
- [ ] File location matches project's ui vs components structure

### 2. Spacing Audit

**Canon:**

- [ ] `gap-*` in flex/grid, never `space-y-*`/`space-x-*` or child margins
- [ ] Tailwind spacing scale values only (1, 1.5, 2, 4, 6, 8, 10, 12, 16 — not 3, 5, 7)
- [ ] No arbitrary pixel values unless genuinely necessary (`gap-[13px]` is a smell)
- [ ] Responsive pattern: `gap-X md:gap-Y` (smaller mobile, larger desktop)
- [ ] Padding follows standard Tailwind scale
- [ ] `size-*` when width = height

**Project (varies by visual style — see [theme-styles.md](theme-styles.md)):**

- [ ] Section/card padding matches project's style density (Vega `p-6`, Nova `p-4`, Mira `p-3`, etc.)
- [ ] Internal gaps match project's style (Maia tends generous, Mira tends dense)

### 3. Design Tokens

**Canon (no exceptions):**

- [ ] No hardcoded Tailwind color scales: `neutral-*`, `gray-*`, `slate-*`, `zinc-*`, `stone-*`
- [ ] Text colors: `text-foreground`, `text-muted-foreground`, `text-primary`, `text-destructive`, `text-accent-foreground`, etc.
- [ ] Background colors: `bg-background`, `bg-card`, `bg-muted`, `bg-accent`, `bg-primary`, `bg-destructive`, etc.
- [ ] Borders: `border-border`, `border-input`, `border-ring`
- [ ] Ring: `ring-ring` (usually combined with `focus-visible:ring-*`)
- [ ] Radius via theme variable (`rounded-md`, `rounded-lg`) not hardcoded values

**Quick scan:**

```bash
# Flag any hardcoded Tailwind color scale usage in the file
grep -rE '\b(neutral|gray|slate|zinc|stone)-[0-9]{2,3}\b' <path>

# Flag hardcoded radius values
grep -rE 'rounded-\[' <path>
```

### 4. Composability

**Canon:**

- [ ] Takes a `className` prop, merged via `cn()` at the end
- [ ] CVA used for variants when variation is likely (`variant`, `size`)
- [ ] Doesn't hardcode content strings — accepts `children` or content-shaped props
- [ ] Variants expose sensible defaults via `defaultVariants`
- [ ] Props are properly typed (uses `VariantProps<typeof xVariants>` for CVA)

**Project:**

- [ ] Prop naming follows project convention
- [ ] Component can be reused across at least two different contexts

### 5. Responsive Design

**Canon:**

- [ ] Mobile-first baseline — designed for < 768px first, enhanced at `md:` and `lg:`
- [ ] Responsive spacing uses `gap-X md:gap-Y` (not pure desktop-first)
- [ ] Responsive typography uses `text-base md:text-lg` etc.
- [ ] Interactive elements have minimum ~44px touch target on mobile
- [ ] `min-w-0` on flex children that contain text (prevents overflow)
- [ ] Long text uses `truncate` or `line-clamp-*` where appropriate

### 6. Accessibility

**Canon:**

- [ ] Uses semantic HTML (buttons are `<button>`, headings are `<h1>`–`<h6>`, not styled `<div>`s)
- [ ] Interactive elements have visible `focus-visible:` states (ring or border change)
- [ ] Form elements paired with `<Label>` via `htmlFor` / `id`
- [ ] ARIA attributes where semantic HTML isn't enough (`aria-label`, `aria-describedby`, `aria-invalid`)
- [ ] Icon-only buttons have accessible names (`aria-label` or `sr-only` text)
- [ ] Decorative icons marked `aria-hidden` or otherwise hidden from AT
- [ ] Motion uses `motion-safe:` / respects `prefers-reduced-motion`

**Project:**

- [ ] Keyboard navigation tested (Tab, Enter, Escape, arrow keys per component type)
- [ ] Color contrast meets project's accessibility target (WCAG AA minimum)

### 7. Animation (if present)

**Canon:**

- [ ] Transitions specify what's transitioning (`transition-colors`, `transition-transform`) not `transition-all`
- [ ] Durations are standard (150ms fast, 200ms normal, 300ms slow — not 500ms+ for UI interactions)
- [ ] Transform and opacity preferred over width/height for performance
- [ ] Radix `data-state` used for enter/exit animations on primitive components
- [ ] `motion-safe:` prefix on transform-based animations

See [animation-patterns.md](animation-patterns.md) for detail.

## Output Format for Reviews

Structured, scannable, actionable:

```markdown
## Review: `<ComponentName />`

**Structure** ✅ `data-slot` present, composes Card primitive
**Spacing** ⚠️ Uses `space-y-4` in flex container (line 18)
**Tokens** ❌ Hardcoded `text-neutral-500` (line 24)
**Composability** ✅ Accepts className, variant props via CVA
**Responsive/a11y** ⚠️ Missing `min-w-0` on flex child (line 14)

**Fixes:**
- Line 18: `flex flex-col space-y-4` → `flex flex-col gap-4`
- Line 24: `text-neutral-500` → `text-muted-foreground`
- Line 14: add `min-w-0` to the wrapping `<div>`

Want me to apply these?
```

### Severity Marks

- ✅ Passes / no action needed
- ⚠️ Suggestion — not wrong per se, but would improve the component
- ❌ Blocking — violates shadcn canon; fix before merging

When nothing is worth flagging, a single ✅ summary line is fine. Don't manufacture issues to fill the template.

## Common Issues and Fixes

### `space-y-*` or child margins in flex containers

```tsx
// ❌
<div className="flex flex-col space-y-4">
<div className="flex flex-col">
  <div className="mb-4">...</div>
</div>

// ✅
<div className="flex flex-col gap-4">
```

### Hardcoded Tailwind color scale

```tsx
// ❌
<p className="text-neutral-500">
<div className="bg-gray-100 hover:bg-gray-200">

// ✅
<p className="text-muted-foreground">
<div className="bg-muted hover:bg-accent">
```

### Duplicate width/height

```tsx
// ❌
<div className="w-10 h-10 rounded-full" />

// ✅
<div className="size-10 rounded-full" />
```

### Missing `data-slot` attributes

```tsx
// ❌
<div className="flex flex-col gap-4">
  <div>Header</div>
  <div>Content</div>
</div>

// ✅
<div data-slot="panel" className="flex flex-col gap-4">
  <div data-slot="panel-header">Header</div>
  <div data-slot="panel-content">Content</div>
</div>
```

### Arbitrary radius values

```tsx
// ❌
<Card className="rounded-[20px]">

// ✅ (adapts to theme)
<Card className="rounded-xl">
<Card className="rounded-lg">
```

### Missing `min-w-0` on flex children with text

```tsx
// ❌ (text may overflow container on narrow screens)
<div className="flex gap-2">
  <div className="flex-1">
    <p>Long text that might overflow...</p>
  </div>
</div>

// ✅
<div className="flex gap-2">
  <div className="flex-1 min-w-0">
    <p className="truncate">Long text that might overflow...</p>
  </div>
</div>
```

## Related References

- **Main skill:** [../SKILL.md](../SKILL.md)
- **Theme styles (per-style patterns):** [theme-styles.md](theme-styles.md)
- **Animation patterns:** [animation-patterns.md](animation-patterns.md)
- **shadcn theming docs:** [ui.shadcn.com/docs/theming](https://ui.shadcn.com/docs/theming)
- **Live component reference:** `npx shadcn@latest docs <component>`
