---
title: "Webflow Skill: Pre Deploy Check"
tags: [webflow, mcp, skill, pre-deploy-check]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Pre Deploy Check

> **Имя скилла:** `pre-deploy-check`  
> **Локальный путь:** `/root/.agent/skills/pre-deploy-check/SKILL.md`

---

# Build Validate

Validate code components before deployment to catch issues early.

## When to Use This Skill

**Use when:**
- User is about to deploy and wants to check for issues first
- Proactively before running `webflow library share`
- User asks to validate, check, or verify their components
- After making significant changes to components

**Do NOT use when:**
- Deployment already failed (use troubleshoot-deploy instead)
- Just building for local development
- Auditing code quality (use component-audit instead)

## Instructions

### Phase 1: Project Structure Check

1. **Verify webflow.json exists**:
   - Check for required fields (`library.name`, `library.components`)
   - Validate glob pattern matches component files — the recommended pattern is `"./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"` covering all supported extensions
   - Check `globals` path if specified — file must exist and be importable
   - Check `bundleConfig` path if specified — file must exist

2. **Check dependencies**:
   - Verify `@webflow/webflow-cli` installed
   - Verify `@webflow/data-types` installed
   - Verify `@webflow/react` installed
   - Check for version compatibility (check installed versions, don't assume specific versions)

3. **Verify component files**:
   - Find all `.webflow.tsx` / `.webflow.ts` files matching the glob pattern
   - Ensure matching React components exist
   - Check for orphaned definition files

4. **Validate imports in `.webflow.tsx` files**:
   - Must import `declareComponent` from `@webflow/react`
   - Must import `props` from `@webflow/data-types` (if props are defined)
   - Must import the actual React component being declared

### Phase 2: Component Analysis

5. **For each component, check**:
   - `declareComponent` is called with the component and a config object
   - `name` is provided in the config
   - All props have `name` properties and appropriate `defaultValue` where applicable
   - Prop types are valid — the 11 supported types are:
     - **Text** (alias: String) — single line text input
     - **RichText** — multi-line text with formatting
     - **TextNode** — single/multi-line text editable on canvas
     - **Link** — URL input (returns `{ href, target, preload }` object)
     - **Image** — image upload and selection
     - **Number** — numeric input
     - **Boolean** — true/false toggle
     - **Variant** — dropdown with predefined options (requires `options` array)
     - **Visibility** — show/hide controls
     - **Slot** — content areas for child components
     - **ID** — HTML element ID

6. **Validate component options**:
   - If `options` object is present, validate:
     - `applyTagSelectors` is a boolean (default: `false`) — enables site tag selectors in Shadow DOM
     - `ssr` is a boolean (default: `true`) — controls server-side rendering

7. **Check for SSR issues**:
   - Scan for browser-only API usage outside of `useEffect` or guarded blocks:
     - `window`, `document`, `localStorage`, `sessionStorage`, `navigator`
   - Flag dynamic/personalized content patterns (user-specific dashboards, authenticated views)
   - Flag heavy/interactive UI that doesn't benefit from SSR (charts, 3D scenes, maps, animation-heavy elements)
   - Flag non-deterministic output (random numbers, time-based values that differ server vs client)
   - Suggest `ssr: false` in options if component is purely interactive or browser-dependent

8. **Check styling**:
   - Verify styles are imported in `.webflow.tsx` or via globals file
   - Check for site class usage — site classes do NOT work in Shadow DOM
   - Site variables DO work: `var(--variable-name, fallback)`
   - Inherited CSS properties DO work: `font-family: inherit`
   - Tag selectors work IF `applyTagSelectors: true` is set in component options
   - Validate CSS-in-JS setup if used (see CSS-in-JS detection below)

9. **Check for Shadow DOM + React Context issues**:
   - If a component uses slots (`props.Slot`) AND imports/uses `useContext` or a Context Provider:
     - Warn that parent and child components in slots cannot share React Context — each child renders in its own Shadow DOM with a separate React root
     - Suggest alternatives: Nano Stores, custom events, URL parameters, or browser storage

### Phase 3: Build Test

10. **Run TypeScript/build check**:
    - Check for TypeScript compilation errors
    - Verify all imports resolve correctly
    - Identify any build-time issues

11. **Check bundle size**:
    - If a build output exists, verify total bundle size is under **50MB** (maximum bundle limit)
    - If over limit, flag as error and suggest optimization

12. **Run local bundle test** (optional, suggest to user):
    - Suggest running `npx webflow library bundle --public-path http://localhost:4000/` to test bundling before sharing
    - If bundling issues occur, suggest `--debug-bundler` flag to inspect the final webpack config

### Phase 4: Detect Framework-Specific Setup

13. **CSS-in-JS library detection**:
    - If project uses **styled-components**: verify `@webflow/styled-components-utils` is installed and `styledComponentsShadowDomDecorator` is exported from globals decorators array
    - If project uses **Emotion** or **Material UI** (`@emotion/styled`, `@emotion/react`, `@mui/material`): verify `@webflow/emotion-utils` is installed and `emotionShadowDomDecorator` is exported from globals decorators array

14. **Tailwind CSS detection**:
    - If project uses **Tailwind CSS** (`tailwindcss` in dependencies):
      - Verify `@tailwindcss/postcss` is installed
      - Verify `postcss.config.mjs` exists with `@tailwindcss/postcss` plugin
      - Verify Tailwind CSS is imported in globals file (e.g., `@import "tailwindcss"` in globals.css)

15. **Sass/Less preprocessor detection**:
    - If project uses **Sass** (`.scss` files or `sass` in dependencies): verify `sass` and `sass-loader` are installed, and a webpack config adds the `.scss` rule
    - If project uses **Less** (`.less` files or `less` in dependencies): verify `less` and `less-loader` are installed, and a webpack config adds the `.less` rule
    - For either: verify `bundleConfig` is set in `webflow.json` pointing to the webpack config

16. **Webpack custom config validation** (if `bundleConfig` is specified):
    - Verify the file exists at the specified path
    - Verify it uses CommonJS exports (`module.exports`)
    - Warn if it attempts to override blocked properties: `entry`, `output`, `target` (these are silently filtered out)
    - Verify `module.rules` uses function syntax `(currentRules) => { ... }`, not an array

### Phase 5: Report Results

17. **Generate validation report**:
    - List all checks performed
    - Show passed/failed/warning status
    - Provide fix suggestions for failures
    - Indicate deployment readiness

## Validation Checks

### Required Checks

| Check | Severity | Description |
|-------|----------|-------------|
| webflow.json exists | Error | Required for CLI |
| Dependencies installed | Error | `@webflow/webflow-cli`, `@webflow/data-types`, `@webflow/react` |
| Component files exist | Error | React + definition files present |
| declareComponent called | Error | Required in .webflow.tsx with correct imports |
| Valid prop types | Error | Only the 11 supported types (Text/String, RichText, TextNode, Link, Image, Number, Boolean, Variant, Visibility, Slot, ID) |
| Build succeeds | Error | No compilation errors |
| Bundle size < 50MB | Error | Maximum bundle limit enforced by Webflow |

### Warning Checks

| Check | Severity | Description |
|-------|----------|-------------|
| Props have defaults | Warning | Better designer experience |
| SSR compatibility | Warning | Browser APIs, dynamic content, heavy UI, non-deterministic output |
| Styles imported | Warning | Styles may not appear in Shadow DOM |
| Site class usage | Warning | Site classes don't work in Shadow DOM — use component-specific classes |
| Shadow DOM + Context | Warning | Slots prevent React Context sharing between parent/child |
| CSS-in-JS decorator | Warning | styled-components/Emotion need Shadow DOM decorators |
| Tailwind setup | Warning | Missing postcss config or globals import |
| Sass/Less setup | Warning | Missing loaders or webpack config |
| Webpack blocked props | Warning | `entry`, `output`, `target` overrides are silently ignored |
| Webpack rules format | Warning | Must use function syntax, not array |
| Component options | Warning | `applyTagSelectors` and `ssr` must be booleans |
| Glob pattern coverage | Warning | Pattern should cover all supported extensions (.js, .jsx, .mjs, .ts, .tsx) |
| bundleConfig file | Warning | File must exist if specified in webflow.json |

### Info Checks

| Check | Severity | Description |
|-------|----------|-------------|
| Component count | Info | Number of components |
| Prop count | Info | Props per component |
| Bundle size | Info | Current bundle size vs 50MB limit |
| Frameworks detected | Info | CSS-in-JS, Tailwind, Sass/Less usage |

## Examples

**User prompt:**
```
Check if my components are ready to deploy
```

**Response:**
```
🔍 Build Validation: My Component Library

Running pre-deployment checks...

---

## Project Structure

✅ webflow.json found
✅ library.name: "My Component Library"
✅ library.components: "./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"
✅ globals: "./src/globals.ts"
✅ bundleConfig: not specified (using defaults)

---

## Dependencies

✅ @webflow/webflow-cli: installed
✅ @webflow/data-types: installed
✅ @webflow/react: installed
✅ react: installed
✅ typescript: installed

---

## Frameworks Detected

✅ Tailwind CSS detected
  ✅ @tailwindcss/postcss installed
  ✅ postcss.config.mjs found
  ✅ globals.css imports Tailwind

---

## Components Found (4)

### 1. Button ✅
- File: src/components/Button/Button.webflow.tsx
- Imports: ✅ declareComponent, ✅ props, ✅ Button component
- Props: label (Text), variant (Variant), disabled (Boolean)
- All props have defaults ✅
- SSR compatible ✅
- Options: applyTagSelectors: true ✅
- Styles imported ✅

### 2. Card ✅
- File: src/components/Card/Card.webflow.tsx
- Imports: ✅ declareComponent, ✅ props, ✅ Card component
- Props: title (Text), image (Image), content (RichText), link (Link)
- All props have defaults ✅
- SSR compatible ✅
- Styles imported ✅

### 3. Modal ⚠️
- File: src/components/Modal/Modal.webflow.tsx
- Imports: ✅ declareComponent, ✅ props, ✅ Modal component
- Props: title (Text), isOpen (Boolean), content (Slot)
- All props have defaults ✅
- ⚠️ SSR Issue: Uses `document.body` in render
  → Suggestion: Add `ssr: false` to options or wrap in useEffect
- Styles imported ✅

### 4. CartIcon ⚠️
- File: src/components/CartIcon/CartIcon.webflow.tsx
- Imports: ✅ declareComponent, ✅ CartIcon component
- Props: none
- ⚠️ Missing props - component has no editable properties
  → Suggestion: Consider adding props for designer customization
- ⚠️ Uses localStorage without SSR guard
  → Suggestion: Wrap in useEffect or useState initializer
- Styles imported ✅

---

## Build Test

✅ Build completed successfully
✅ No TypeScript errors
✅ No webpack errors
✅ Bundle size: 2.3MB / 50MB limit

---

## Summary

| Category | Status |
|----------|--------|
| Project Structure | ✅ Pass |
| Dependencies | ✅ Pass |
| Frameworks | ✅ Pass |
| Components | ⚠️ 2 warnings |
| Build | ✅ Pass |

---

## Ready to Deploy: ⚠️ WITH WARNINGS

You can deploy, but consider fixing these issues:

1. **Modal SSR Issue**
   Add to Modal.webflow.tsx:
   ```typescript
   options: {
     ssr: false
   }
   ```

2. **CartIcon localStorage Usage**
   Update CartIcon.tsx:
   ```typescript
   const [count, setCount] = useState(() => {
     if (typeof window === "undefined") return 0;
     return parseInt(localStorage.getItem("cartCount") || "0");
   });
   ```

---

💡 To deploy: `npx webflow library share`
💡 To test locally first: `npx webflow library bundle --public-path http://localhost:4000/`
```

---

**Example: Build Failure**

```
🔍 Build Validation: My Component Library

Running pre-deployment checks...

---

## Project Structure

✅ webflow.json found
⚠️ library.components uses narrow glob: "./src/**/*.webflow.tsx"
  → Recommendation: Use "./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)" to cover all supported extensions

---

## Dependencies

❌ Missing: @webflow/react
   Fix: npm install --save-dev @webflow/react

---

## Build Test

❌ Build Failed

Error in src/components/Button/Button.webflow.tsx:
```
Module not found: Error: Can't resolve '@webflow/react'
```

---

## Summary

| Category | Status |
|----------|--------|
| Dependencies | ❌ 1 error |
| Build | ❌ Failed |

---

## Ready to Deploy: ❌ NO

Fix the following before deployment:

1. **Install missing dependency**
   ```bash
   npm install --save-dev @webflow/react
   ```

2. **Re-run validation**
   After installing, run this check again.
```

---

**Example: CSS-in-JS Missing Decorator**

```
🔍 Build Validation: My Component Library

---

## Frameworks Detected

⚠️ styled-components detected but Shadow DOM decorator not configured
  → Install: npm install @webflow/styled-components-utils
  → Add to globals.ts:
    ```typescript
    import { styledComponentsShadowDomDecorator } from "@webflow/styled-components-utils";
    export const decorators = [styledComponentsShadowDomDecorator];
    ```
  → Reference globals in webflow.json:
    ```json
    { "library": { "globals": "./src/globals.ts" } }
    ```

Without this, styled-components styles will be injected into document.head
instead of the Shadow DOM, and your components will appear unstyled.
```

---

**Example: Webpack Config Issues**

```
🔍 Build Validation: My Component Library

---

## Webpack Configuration

⚠️ webpack.webflow.js: `module.rules` uses array syntax
  → Must use function syntax: `rules: (currentRules) => { return [...]; }`
  → Array syntax will not work — the function receives current rules to extend

⚠️ webpack.webflow.js: overrides `output` property
  → The `output` property is blocked and will be silently ignored
  → Blocked properties: entry, output, target

💡 Use `--debug-bundler` flag to inspect the final merged webpack config:
   npx webflow library bundle --debug-bundler
```

---

**Example: Shadow DOM Context Warning**

```
## Components Found (2)

### 1. ThemeProvider ⚠️
- File: src/components/ThemeProvider/ThemeProvider.webflow.tsx
- Props: theme (Variant), children (Slot)
- ⚠️ Shadow DOM + React Context Issue:
  Component uses Slot prop AND React Context (ThemeContext).
  Children placed in slots render in separate Shadow DOM containers
  with their own React roots — they cannot access this Context.

  Alternatives for cross-component state:
  - Nano Stores (lightweight reactive state)
  - Custom events (window.dispatchEvent/addEventListener)
  - URL parameters (for shareable state)
  - Browser storage (localStorage/sessionStorage)
```

---

## Guidelines

### Validation Order

Run checks in this order for efficiency:

1. Project structure (fast, catches obvious issues)
2. Dependencies (medium, required for build)
3. Component analysis (medium, catches code issues)
4. Framework detection (medium, validates CSS-in-JS/Tailwind/Sass setup)
5. Build test (slow, but required)

### SSR Detection Patterns

Look for these patterns that indicate SSR issues:

```typescript
// Direct browser API usage (will break SSR)
window.innerWidth
document.getElementById
localStorage.getItem
navigator.userAgent
sessionStorage.getItem

// Dynamic/personalized content (may cause hydration mismatch)
// User-specific dashboards, authenticated views

// Heavy/interactive UI (SSR adds no value, re-renders anyway)
// Charts, 3D scenes, maps, animation-driven elements

// Non-deterministic output (differs server vs client)
Math.random()
new Date().toLocaleString()

// Safe patterns (in useEffect or state initializer)
useEffect(() => {
  // Browser APIs here are fine
}, []);

useState(() => {
  if (typeof window === "undefined") return default;
  return window.innerWidth;
});
```

When SSR issues are found, prominently suggest the `ssr: false` option:
```typescript
export default declareComponent(MyComponent, {
  name: "My Component",
  options: {
    ssr: false  // Disables server-side rendering
  },
});
```

### CSS-in-JS / Tailwind / Preprocessor Detection

Check project dependencies and files to detect styling frameworks:

**styled-components:**
- Detect: `styled-components` in package.json dependencies
- Require: `@webflow/styled-components-utils` installed
- Require: `styledComponentsShadowDomDecorator` in globals decorators array

**Emotion / Material UI:**
- Detect: `@emotion/styled`, `@emotion/react`, or `@mui/material` in dependencies
- Require: `@webflow/emotion-utils` installed
- Require: `emotionShadowDomDecorator` in globals decorators array

**Tailwind CSS:**
- Detect: `tailwindcss` in dependencies
- Require: `@tailwindcss/postcss` installed
- Require: `postcss.config.mjs` with `@tailwindcss/postcss` plugin
- Require: Tailwind import in globals CSS (`@import "tailwindcss"`)

**Sass:**
- Detect: `.scss` files in src or `sass` in dependencies
- Require: `sass` and `sass-loader` installed as dev dependencies
- Require: webpack config with `.scss` rule using function syntax for module.rules
- Require: `bundleConfig` set in webflow.json

**Less:**
- Detect: `.less` files in src or `less` in dependencies
- Require: `less` and `less-loader` installed as dev dependencies
- Require: webpack config with `.less` rule using function syntax for module.rules
- Require: `bundleConfig` set in webflow.json

### Webpack Config Validation Rules

When `bundleConfig` is specified in webflow.json:

1. File must exist at the specified path
2. Must use CommonJS: `module.exports = { ... }`
3. Blocked properties that are silently ignored: `entry`, `output`, `target`
4. `module.rules` must be a function, not an array: `rules: (currentRules) => { ... }`
5. `ModuleFederationPlugin` and `MiniCssExtractPlugin` are auto-deduplicated

### Common Build Errors

| Error | Cause | Fix |
|-------|-------|-----|
| "Can't resolve '@webflow/react'" | Missing dependency | `npm i -D @webflow/react` |
| "Cannot find module './Component'" | Wrong import path | Check relative paths |
| "Type 'X' is not assignable" | TypeScript error | Fix type mismatch |
| "Unexpected token" | Syntax error | Check JSX/TS syntax |
| "Maximum call stack" | Circular import | Break dependency cycle |
| Bundle exceeds 50MB | Too many/large dependencies | Tree-shake, lazy load, replace heavy libs |
| Styles not appearing | Missing Shadow DOM decorator | Add CSS-in-JS decorator or import styles in .webflow.tsx |

### Bundle Size Optimization

Quick wins for reducing bundle size:

1. **Use production build**: Ensure minification is enabled
2. **Tree-shake imports**: Import specific exports
3. **Replace heavy libraries**: moment → date-fns, lodash → lodash-es
4. **Lazy load**: Dynamic imports for heavy components
5. **Check for duplicates**: Multiple React versions, etc.
6. **Monitor size**: Bundle must stay under 50MB limit