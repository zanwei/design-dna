# shadcn Visual Styles Reference

Reference guide for shadcn's five official visual styles (Vega, Nova, Maia, Lyra, Mira) and their per-style density, shape, and spacing patterns.

## Quick Overview

| Style | Density | Shape | Canonical use |
|---|---|---|---|
| **Vega** | Standard | Classic | Default shadcn look, general-purpose |
| **Nova** | Compact | Standard | Dense UIs, data-heavy apps |
| **Maia** | Generous | Soft / rounded (often pill) | Consumer apps, friendly interfaces |
| **Lyra** | Standard | Boxy / sharp | Developer tools, mono fonts |
| **Mira** | Dense | Compact | Admin dashboards, power users |

Styles are applied at init time (`npx shadcn@latest init`) or switched via preset codes (`npx shadcn@latest apply --preset <code>` in CLI v4+). The chosen style is stored in `components.json`.

## Style-by-Style

### Vega — Classic shadcn

Balanced spacing, medium radius. The default aesthetic if the user didn't specify.

- Section spacing: `gap-4` baseline
- Internal spacing: `gap-2`
- Card padding: `p-6`
- Button height: `h-9` (default), `h-8` (sm), `h-10` (lg)
- Border radius: `rounded-md` for interactive elements, `rounded-lg` for surfaces

### Nova — Compact

Reduced padding and margins without feeling cramped. Good for screens dense with information but not extreme.

- Section spacing: `gap-2` to `gap-3`
- Internal spacing: `gap-1.5`
- Card padding: `p-4`
- Button height: `h-8` typical
- Border radius: `rounded-md` (same as Vega)

**Best for:** data tables, sidebars, toolbars, mobile-first designs.

### Maia — Soft & rounded

Friendly, generous aesthetic. Pill-shaped interactive elements, larger surface radius, more breathing room.

- Section spacing: `gap-6` baseline (larger responsive jumps: `gap-4 md:gap-6`, `gap-6 md:gap-8`)
- Internal spacing: `gap-2` to `gap-4`
- Card padding: `p-6` (or larger)
- Button height: `h-10` typical, often with `rounded-full` for pill shape
- Border radius: `rounded-xl` for cards, `rounded-full` for buttons/inputs/badges

**Best for:** consumer apps, onboarding flows, marketing sites.

### Lyra — Boxy & sharp

Technical, precise aesthetic with minimal border radius. Pairs well with mono fonts.

- Section spacing: `gap-4` (similar to Vega)
- Internal spacing: `gap-2`
- Card padding: `p-6`
- Button height: `h-9` typical
- Border radius: `rounded-sm` or `rounded-none`

**Best for:** developer tools, code editors, technical dashboards.

### Mira — Dense

Maximum information density. Every pixel counts.

- Section spacing: `gap-1` to `gap-2`
- Internal spacing: `gap-1`
- Card padding: `p-3`
- Button height: `h-7` (extra compact)
- Border radius: `rounded-sm`
- Typography: smaller sizes (`text-xs`, `text-sm`)

**Best for:** admin panels, trading interfaces, data-heavy monitoring tools.

## Spacing Scale Comparison

Typical spacing by style (use as starting points, not absolutes — individual components may vary):

| Context | Vega | Nova | Maia | Lyra | Mira |
|---|---|---|---|---|---|
| Section gap | `gap-4` | `gap-2` | `gap-6` | `gap-4` | `gap-1.5` |
| Internal gap | `gap-2` | `gap-1.5` | `gap-2` | `gap-2` | `gap-1` |
| Card padding | `p-6` | `p-4` | `p-6`+ | `p-6` | `p-3` |
| Button height | `h-9` | `h-8` | `h-10` | `h-9` | `h-7` |

## Border Radius Comparison

| Element | Vega | Nova | Maia | Lyra | Mira |
|---|---|---|---|---|---|
| Button | `rounded-md` | `rounded-md` | `rounded-full` | `rounded-sm` | `rounded-sm` |
| Input | `rounded-md` | `rounded-md` | `rounded-full` | `rounded-sm` | `rounded-sm` |
| Card | `rounded-lg` | `rounded-md` | `rounded-xl` | `rounded-sm` | `rounded-md` |
| Badge | `rounded-md` | `rounded-sm` | `rounded-full` | `rounded-sm` | `rounded-sm` |

**Important:** prefer theme-variable-backed classes (`rounded-md`, `rounded-lg`) over hardcoded values (`rounded-[20px]`). The theme-variable-backed classes adapt when the user changes style or preset.

## Universal Spacing Principles (All Styles)

### 1. Use `gap-*` in flex and grid containers

```tsx
// ✅ Correct
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>

// ❌ Avoid
<div className="flex flex-col space-y-4">
<div className="flex flex-col">
  <div className="mb-4">…</div>
</div>
```

`gap-*` respects directional reversal, handles RTL correctly, and doesn't need special-casing for the last child.

### 2. Stick to the Tailwind spacing scale

Use multiples of 4px. Valid: `1`, `1.5`, `2`, `4`, `6`, `8`, `10`, `12`, `16`. Avoid: `3`, `5`, `7`, `9` (not canonical and visually inconsistent with the rest of the system).

### 3. Use `size-*` when width equals height

```tsx
// ✅
<div className="size-10 rounded-full" />

// ❌ (verbose, duplicates intent)
<div className="w-10 h-10 rounded-full" />
```

### 4. Responsive spacing pattern

```tsx
// Compact → standard
<div className="gap-2 md:gap-4">

// Standard → generous
<div className="gap-4 md:gap-6">

// Generous → spacious (Maia-style)
<div className="gap-6 md:gap-8">
```

## Common Mistakes

### `space-y-*` / `space-x-*` in flex containers

```tsx
// ❌
<div className="flex flex-col space-y-4">

// ✅
<div className="flex flex-col gap-4">
```

### Hardcoded margins instead of gap

```tsx
// ❌
<div className="flex flex-col">
  <div className="mb-4">Item 1</div>
  <div className="mb-4">Item 2</div>
</div>

// ✅
<div className="flex flex-col gap-4">
  <div>Item 1</div>
  <div>Item 2</div>
</div>
```

### Mixing style densities

```tsx
// ❌ Maia spacing with Lyra radius
<Card className="gap-6 p-6 rounded-sm">

// ✅ Consistent style application
<Card className="gap-6 p-6 rounded-xl">  {/* Maia */}
<Card className="gap-4 p-6 rounded-sm">  {/* Lyra */}
```

### Arbitrary pixel values

```tsx
// ❌
<Button className="rounded-[20px]">

// ✅ (respects the theme's --radius)
<Button className="rounded-full">
<Button className="rounded-md">
```

## Detecting the Project's Style

Three ways, in order of precedence:

1. **CLI:** `npx shadcn@latest info --json` returns the current style directly
2. **components.json:** the `style` field (`"style": "maia"`, etc.)
3. **CSS variables:** inspect `--radius` — `>=1rem` suggests Maia, `0.25rem` suggests Lyra/Mira, `0.5rem` suggests Vega/Nova

If none of those are accessible, ask the user: "Which visual style — Vega, Nova, Maia, Lyra, or Mira?"

## Presets (CLI v4+)

Presets bundle style + theme colors + fonts + icons + radius into a single short code. Applied via:

```bash
# Full apply (reinstalls components with preset styling)
npx shadcn@latest apply --preset <code>

# Partial apply (theme and font only, no component reinstall)
npx shadcn@latest apply --preset <code> --only theme,font
```

Build presets interactively at [ui.shadcn.com/create](https://ui.shadcn.com/create) and share the short code. When reviewing a project that has a preset applied, the preset is the source of truth for spacing/radius expectations rather than the raw style name.

## Reference Links

- **Theme picker:** [ui.shadcn.com/themes](https://ui.shadcn.com/themes)
- **Theme creator (preset builder):** [ui.shadcn.com/create](https://ui.shadcn.com/create)
- **Tailwind spacing:** [tailwindcss.com/docs/theme#spacing](https://tailwindcss.com/docs/theme#spacing)
- **TweakCN (visual theme editor):** [tweakcn.com](https://tweakcn.com)
