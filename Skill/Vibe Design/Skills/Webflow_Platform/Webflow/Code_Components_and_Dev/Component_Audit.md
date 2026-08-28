---
title: "Webflow Skill: Component Audit"
tags: [webflow, mcp, skill, component-audit]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Component Audit

> **Имя скилла:** `component-audit`  
> **Локальный путь:** `/root/.agent/skills/component-audit/SKILL.md`

---

# Component Audit

Audit existing code components for **Webflow-specific architecture decisions**. This skill focuses on how well components integrate with Webflow Designer, not generic React best practices.

## When to Use This Skill

**Use when:**
- User wants to improve how their components work in Webflow Designer
- Reviewing whether the right things are exposed as props vs hardcoded
- Checking if state management patterns are Webflow-compatible
- Looking for opportunities to make components more designer-friendly
- Component isn't rendering or behaving as expected in Webflow

**Do NOT use when:**
- Validating before deployment (use pre-deploy-check instead)
- Creating new components (use component-scaffold instead)
- Converting a React component (use convert-component instead)
- Generic code quality review (use a linter)

## Core Philosophy

This audit answers three questions:

1. **Designer Control**: Are the right things exposed as props for designers to customize?
2. **Webflow Compatibility**: Does the component work within Webflow's constraints (Shadow DOM, SSR, isolated React roots)?
3. **Component Architecture**: Is this the right level of granularity, or should it be split/combined?

## Instructions

### Phase 1: Discovery

1. **Find all components**:
   - Locate webflow.json
   - Find all .webflow.tsx files
   - Read corresponding React components

2. **Understand intent**: Ask user what the components are for and any specific concerns

### Phase 2: Analysis

For each component, analyze these Webflow-specific areas:

#### A. Prop Exposure Analysis

**Goal**: Identify what designers SHOULD be able to control but currently can't.

| Look For | Recommendation |
|----------|----------------|
| Hardcoded text strings | Expose as `props.Text()` |
| Text that designers should edit on canvas | Expose as `props.RichText()` |
| Hardcoded values from a fixed set of options | Expose as `props.Variant({ options: [...] })` |
| Hardcoded image URLs | Expose as `props.Image()` |
| Hardcoded link URLs | Expose as `props.Link()` |
| Hardcoded HTML `id` attributes | Expose as `props.Id()` |
| Conditional rendering with boolean | Expose as `props.Boolean()` or `props.Visibility()` |
| Internal state that affects appearance | Consider exposing initial value as prop |
| `children` not using Slot | Convert to `props.Slot()` |

> **Aliases:** `props.String` = `props.Text`, `props.Children` = `props.Slot`. Treat these as equivalent during audit.

**Questions to ask:**
- "What would a designer want to change?"
- "What requires a code change that shouldn't?"

#### B. State Management Architecture

**Goal**: Identify patterns that won't work in Webflow.

| Anti-Pattern | Why It Fails | Alternative |
|--------------|--------------|-------------|
| React Context for cross-component state | Each component has isolated React root | Use nano stores, custom events, or URL params |
| Prop drilling through Slots | Slot children are separate React apps | Use nano stores or custom events |
| Shared state via module-level variables | May cause SSR issues | Use browser storage or nano stores |
| Global event listeners without cleanup | Memory leaks, SSR issues | Use useEffect with cleanup |

**Refactoring recommendations:**
- If components need to communicate → suggest cross-component state pattern
- If using Context internally only → that's fine, document it
- If components are tightly coupled → suggest decomposition

#### C. Slot Opportunities

**Goal**: Identify hardcoded content that should be designer-controlled.

| Current Pattern | Better Pattern |
|-----------------|----------------|
| Hardcoded button inside card | Slot for actions area |
| Hardcoded icon component | Slot or Image prop |
| Fixed header/footer structure | Slots for header and footer |
| Hardcoded list items | Consider if this should be multiple components |

**When NOT to use Slots:**
- When content has specific behavioral requirements
- When content needs to interact with component state
- When the structure is truly fixed and not customizable

#### D. Shadow DOM Compatibility

**Goal**: Ensure styles work in isolation.

| Issue | Detection | Fix |
|-------|-----------|-----|
| Using site/global CSS classes | Class names like `.container`, `.btn` | Use CSS Modules or component-scoped styles |
| CSS-in-JS not configured | styled-components/Emotion without decorator | Add globals.ts with `styledComponentsShadowDomDecorator` (styled-components) or `emotionShadowDomDecorator` (Emotion/MUI) |
| Missing style imports | Styles defined but not imported in .webflow.tsx | Add import statement |
| Relying on inherited styles | Expecting parent styles to cascade | Use explicit styles or CSS variables |
| Needs tag selectors (h1, p, etc.) | Tags not styled inside Shadow DOM | Enable `applyTagSelectors: true` in component options |

> **SSR Note:** When using styled-components or Emotion, you must also configure the server renderer in `webflow.json` for SSR to work correctly:
> - styled-components: `"library": { "renderer": { "server": "@webflow/styled-components-utils/server" } }`
> - Emotion: `"library": { "renderer": { "server": "@webflow/emotion-utils/server" } }`

#### E. SSR Safety

**Goal**: Identify browser-only code that runs during render.

| Pattern | Problem | Solution |
|---------|---------|----------|
| `window.innerWidth` in render | SSR error | Use useEffect or set `ssr: false` |
| `document.getElementById` in render | SSR error | Use useEffect or refs |
| `localStorage.getItem` outside useEffect | SSR error | Wrap in useEffect with useState |
| Third-party library that requires window | SSR error | Dynamic import or `ssr: false` |

#### F. Component Granularity

**Goal**: Determine if component is at the right level of abstraction.

**Signs a component should be SPLIT:**
- Too many props (>10) making Designer UI cluttered
- Multiple distinct sections that could be independent
- Designers want to use parts separately
- Component handles multiple unrelated concerns

**Signs components should be COMBINED:**
- Always used together
- Tightly coupled state that's awkward to sync
- Small components with no standalone use

### Phase 3: Report

Generate actionable report with:

1. **Summary**: Quick overview of findings
2. **By Component**: Specific issues and recommendations for each
3. **Architecture Recommendations**: Cross-cutting concerns
4. **Priority Actions**: What to fix first

## Audit Checklist

### Designer Control (Most Important for Webflow)

| Check | Question |
|-------|----------|
| Prop completeness | Can designers customize everything they'd want to? |
| Prop types | Are the right Webflow prop types used? |
| Default values | Do props have sensible defaults? |
| Prop naming | Are names clear for non-developers? |
| Slot usage | Is nested content handled via Slots? |
| Visibility props | Can sections be shown/hidden? |

### Webflow Compatibility

| Check | Question |
|-------|----------|
| SSR safe | Does component render without browser APIs? |
| Style isolation | Do styles work in Shadow DOM? |
| State independence | Does component work without Context from parent? |
| No function props | Are there callback props that won't work? |

### Architecture

| Check | Question |
|-------|----------|
| Single responsibility | Does component do one thing well? |
| Right granularity | Is this the right size for Designer use? |
| Cross-component state | If needed, is it implemented correctly? |

## Example

**User prompt:**
```
Audit my ProductCard component
```

**Response:**
```markdown
## Audit: ProductCard

### Component Overview

```typescript
// Current props
props: {
  title: props.Text(),
  price: props.Number(),
  imageUrl: props.Text()  // ⚠️ Should be Image
}
```

---

### A. Prop Exposure Analysis

| Finding | Severity | Recommendation |
|---------|----------|----------------|
| `imageUrl` is Text, not Image | Warning | Change to `props.Image()` for proper asset handling |
| "Add to Cart" button text is hardcoded | Suggestion | Expose as prop: `addToCartText: props.Text()` |
| Sale badge is conditionally rendered but not controllable | Suggestion | Add `showSaleBadge: props.Boolean()` |
| Badge color is hardcoded red | Suggestion | Add `badgeVariant: props.Variant({ options: ["sale", "new", "featured"] })` |

**Hardcoded Content Found:**
```typescript
// Line 24 - hardcoded, should be prop
<button>Add to Cart</button>

// Line 18 - hardcoded, should be prop or removed
{onSale && <span className="badge">SALE</span>}
```

**Recommended Props to Add:**
```typescript
props: {
  // ...existing
  addToCartLabel: props.Text({
    name: "Button Label",
    defaultValue: "Add to Cart"
  }),
  showBadge: props.Boolean({
    name: "Show Badge",
    defaultValue: false
  }),
  badgeType: props.Variant({
    name: "Badge Type",
    options: ["sale", "new", "featured"],
    defaultValue: "sale"
  })
}
```

---

### B. State Management

| Finding | Severity |
|---------|----------|
| Uses `localStorage` for cart count | Warning |
| No React Context dependencies | OK |

**Issue: localStorage in render**
```typescript
// Line 8 - will break SSR
const cartCount = localStorage.getItem('cart');
```

**Fix:**
```typescript
const [cartCount, setCartCount] = useState(0);
useEffect(() => {
  setCartCount(parseInt(localStorage.getItem('cart') || '0'));
}, []);
```

---

### C. Slot Opportunities

| Current | Recommendation |
|---------|----------------|
| Hardcoded button | Consider: `actions: props.Slot()` for flexible CTAs |

If designers need to put different content (button, link, custom element) in the action area:
```typescript
props: {
  actions: props.Slot({
    name: "Actions"
  })
}

// Component
<div className={styles.actions}>
  {actions}
</div>
```

**However**, if button behavior is tied to cart logic, keep it hardcoded.

---

### D. Shadow DOM Compatibility

| Check | Status |
|-------|--------|
| Styles imported in .webflow.tsx | ✅ OK |
| CSS Modules used | ✅ OK |
| No global class references | ✅ OK |

---

### E. SSR Safety

| Check | Status |
|-------|--------|
| window usage | ✅ None |
| document usage | ✅ None |
| localStorage usage | ⚠️ Needs guard (see fix above) |

---

### F. Component Granularity

**Current size**: 4 props (will be 7 after recommendations)
**Verdict**: Good granularity - single purpose, manageable props

---

## Summary

| Category | Status |
|----------|--------|
| Designer Control | ⚠️ Needs work - 4 hardcoded items found |
| State Management | ⚠️ localStorage needs SSR guard |
| Shadow DOM | ✅ Good |
| SSR Safety | ⚠️ One issue |
| Granularity | ✅ Good |

**Priority Actions:**
1. Fix localStorage SSR issue (blocks deployment)
2. Change imageUrl from Text to Image prop
3. Expose badge controls as props
4. Consider exposing button label
```

## Guidelines

### What This Audit Does NOT Check

This is not a generic code quality audit. Skip:
- Generic React performance patterns (let users use React DevTools)
- Generic accessibility (let users use axe or similar)
- Code formatting (let users use Prettier/ESLint)
- Generic TypeScript best practices

Focus only on Webflow-specific concerns.

### Prop Exposure Heuristics

**Should be a prop:**
- Any text visible in the UI
- Any image or media
- Any color or size that might vary
- Any boolean that controls visibility
- Any value that changes per-use

**Should NOT be a prop:**
- Internal implementation details
- State that changes during interaction
- Values derived from other props
- Animation timing/easing (unless explicitly customizable)

### When to Recommend Slots vs Props

**Use Slot when:**
- Designer wants to put arbitrary Webflow elements inside
- Content structure is flexible
- Nested content doesn't need to interact with component state

**Use Props when:**
- Content is simple (text, image, link)
- Component needs to process/transform the content
- Specific structure is required

### State Pattern Recommendations

If components need to share state, recommend in this order:
1. **URL parameters** - if state should be shareable/bookmarkable
2. **Nano stores** - for real-time sync between components
3. **Custom events** - for fire-and-forget communication
4. **Browser storage** - for persistence across sessions