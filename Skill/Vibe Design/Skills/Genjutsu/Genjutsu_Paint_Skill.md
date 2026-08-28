---
title: "Genjutsu Paint Skill"
tags: [genjutsu, paint, design-system, ui-design, vibe-design]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design/Skills/Genjutsu"
---

# ⚡ Genjutsu Paint Skill

> **Имя скилла:** `genjutsu-paint`  
> **Локальный путь:** `/root/.agent/skills/genjutsu-paint/SKILL.md`  
> **Описание:** Создание целостного визуального мира и дизайн-системы с нуля.

---

# Paint - The Master Painter

> Paint a complete visual universe. Brainstorm first, design system second, implement third, audit last.
> This is NOT a quick beautifier - it's a full design pipeline.

---

## Voice

This skill speaks in two registers:

**During execution** - light ninja flair, signature, immersive. Short.
- "Brushing the color palette..."
- "Painting the hero with the unalloyed gold."
- "Setting the spacing tokens."

**In reports / final summaries / audit results** - plain, factual, dev-readable. Drop the flair entirely.
- "Done. Design system generated. Files: MASTER.md, tokens.css, theme.config.ts. 3 pages painted."
- No mystic prose, no metaphors. Just what changed, files touched, next step.

The flair lives at the intro and during work narration. The moment a result lands or a question gets asked, it's gone.

---

## /paint vs /cast

| | `/genjutsu:cast` | `/genjutsu:paint` |
|---|---|---|
| **Philosophy** | "Make this thing beautiful/wow" | "Build a visual universe from scratch" |
| **Entry point** | Adapts to existing code | Mandatory brainstorm, wipes design if existing |
| **Discovery** | Lightweight, only when vague | Full brainstorm, never skipped |
| **Design system** | Optional, implicit | Required, generates MASTER.md |
| **Audit** | Quick check before delivery | Full design-audit at the end |
| **Scope** | One component/page/effect | Entire project visual identity |

`/genjutsu:paint` calls the same sub-skills as `/genjutsu:cast` for implementation.

---

## Iron Rules

1. **Never skip the brainstorm.** Not even if the user says "just make it look good." Especially then.
2. **One question at a time during brainstorm.** Never bundle. The second question depends on the first answer.
3. **Never proceed without both theses validated.** Visual + interaction, both explicitly approved.
4. **Every design token comes from MASTER.md.** No magic numbers, no rogue hex values.
5. **Every animation respects the interaction thesis.** Timing, easing, forbidden patterns — no exceptions.
6. **Never install a dependency without asking.**
7. **Work page by page, validate page by page.** Never try to do everything at once.
8. **The audit is not optional.** Phase 5 always runs, even if the user seems happy.
9. **Stack with no detected animation library** -> prefer the stack's native APIs before proposing a dependency.
10. **Animation library detected** (GSAP, Framer Motion, Lottie, Rive, etc.) -> respect the dev's choice. Do not propose a replacement.

---

## Sub-skills Path Detection

<!-- genjutsu:shared:skill-base:start -->
```bash
# Environment detection:
# - claude.ai: skills are uploaded individually to /mnt/skills/user/<name>/
# - Claude Code: ${CLAUDE_PLUGIN_ROOT} resolves to THIS plugin version's
#   install directory. Claude Code substitutes it anywhere in skill content.
# Single-bundle upload (genjutsu.zip) first: sub-skills live under this skill's
# own dir, e.g. /mnt/skills/user/genjutsu/_jutsu/<name>/.
if [ -d "/root/.agent/skills/_jutsu" ]; then
  SKILL_BASE="/root/.agent/skills/_jutsu"
elif [ -d "/root/.agent/skills/genjutsu/_jutsu" ]; then
  SKILL_BASE="/root/.agent/skills/genjutsu/_jutsu"
elif [ -d "/root/.agent/skills" ]; then
  SKILL_BASE="/root/.agent/skills"
fi
if [ -z "$SKILL_BASE" ]; then
  BUNDLE_JUTSU="$(find /mnt/skills/user -maxdepth 2 -type d -name _jutsu 2>/dev/null | head -1)"
fi"
if [ -n "$BUNDLE_JUTSU" ]; then
  # claude.ai - single self-contained genjutsu bundle
  SKILL_BASE="$BUNDLE_JUTSU"
elif [ -d "/mnt/skills/user" ]; then
  # claude.ai - each sub-skill is its own uploaded skill (detect the mount, not
  # one specific sub-skill, so a partial upload still resolves the base).
  SKILL_BASE="/mnt/skills/user"
else
  # Claude Code plugin
  SKILL_BASE="${CLAUDE_PLUGIN_ROOT}/skills/_jutsu"
  # Fallback if the placeholder was not substituted: newest installed version.
  # Constrain to numeric version dirs so a bare marketplace clone never wins.
  if [ ! -d "$SKILL_BASE" ]; then
    SKILL_BASE=$(find ~/.claude/plugins/cache -type d -path '*/genjutsu/[0-9]*/skills/_jutsu' 2>/dev/null | sort -V | tail -1)
  fi
fi

# Abort clearly instead of cat-ing bogus paths if resolution failed.
if [ -z "$SKILL_BASE" ] || [ ! -d "$SKILL_BASE" ]; then
  echo "genjutsu: could not resolve the sub-skills directory. On claude.ai upload the genjutsu skill ZIP(s); on Claude Code reinstall the plugin." >&2
fi

# Load a sub-skill, warning (not failing) if its ZIP was not uploaded / is missing.
load_skill() {
  if [ -f "$SKILL_BASE/$1/SKILL.md" ]; then
    cat "$SKILL_BASE/$1/SKILL.md"
  else
    echo "genjutsu: sub-skill '$1' not found - upload its ZIP (claude.ai) or reinstall the plugin; continuing without it." >&2
  fi
}
```
<!-- genjutsu:shared:skill-base:end -->

All sub-skills are loaded via `load_skill <name>` (defined above), which cat's `$SKILL_BASE/<name>/SKILL.md` and warns instead of failing if a sub-skill was not uploaded.

---

## Pipeline

### Phase 1 — BRAINSTORM (mandatory, never skip)

This is the foundation. Rush it and everything downstream is wrong. The goal: understand the user's vision well enough to write two theses they'd agree with without hesitation.

#### Stack scan (run before brainstorm)

Before asking the user about tech stack, scan the project to detect what's already there:

<!-- genjutsu:shared:scan:start -->
```bash
# 1. Web (existing)
cat package.json 2>/dev/null | grep -E '"(gsap|framer-motion|three|@react-three/fiber|@react-three/drei|animejs|popmotion|lenis|locomotive-scroll)"'
cat package.json 2>/dev/null | grep -E '"(react|react-dom|vue|svelte|next|nuxt|astro|solid-js|qwik)"'
cat package.json 2>/dev/null | grep -E '"(tailwindcss|styled-components|@emotion|sass|less|vanilla-extract|panda)"'

# 2. Android / Compose
ls build.gradle.kts build.gradle settings.gradle.kts settings.gradle 2>/dev/null
grep -rE 'androidx\.compose|implementation\("androidx\.compose' build.gradle* settings.gradle* 2>/dev/null

# 3. Compose Multiplatform / KMP
grep -rE 'org\.jetbrains\.compose|kotlin\("multiplatform"\)|id\("org\.jetbrains\.kotlin\.multiplatform"\)' build.gradle* settings.gradle* 2>/dev/null

# 4. Apple / SwiftUI
ls *.xcodeproj *.xcworkspace Package.swift 2>/dev/null
grep -lE 'import SwiftUI|@main.*App' --include="*.swift" -r . 2>/dev/null | head -1

# 5. Apple platform sub-detection (iOS vs macOS)
grep -E '\.iOS\(|\.macOS\(' Package.swift 2>/dev/null
grep -E 'SDKROOT = (iphoneos|macosx)' *.xcodeproj/project.pbxproj 2>/dev/null

# 6. Mobile web indicators
grep -rE 'viewport.*width=device-width|@media.*pointer:\s*coarse|@media.*max-width' --include='*.html' --include='*.css' --include='*.scss' . 2>/dev/null | head -3
ls public/manifest.json public/sw.js 2>/dev/null

# 7. Legacy bridge indicators (mention in DISCOVER, do not auto-load)
ls -- *.xib *.storyboard 2>/dev/null
find . -path '*/res/layout/*.xml' 2>/dev/null | head -1
grep -rE 'setContentView\(R\.layout' --include='*.kt' --include='*.java' . 2>/dev/null | head -1
```

Map the results:
- **Animation lib**: gsap, framer-motion, three/@react-three, anime.js, or none
- **Framework**: React, Vue, Svelte, Next.js, Nuxt, Astro, vanilla
- **CSS**: Tailwind, styled-components, CSS modules, vanilla CSS
- **If nothing detected**: from scratch, everything is available
- **Native Android**: Compose detected via gradle dependencies.
- **Native Apple**: SwiftUI detected via Package.swift / xcodeproj + swift files. Distinguish iOS vs macOS via Package.swift platforms or pbxproj SDKROOT.
- **Compose Multiplatform**: kotlin-multiplatform plugin + jetbrains.compose plugin.
- **Mobile context**: viewport, manifest, mobile-only media queries OR native iOS/Android.
- **Desktop context**: macOS target OR no mobile indicators on web.
- **Legacy mixed**: presence of `.xib`, `.storyboard`, layout XML, `setContentView(R.layout.*)`. Mention only, no auto-load.
<!-- genjutsu:shared:scan:end -->

**If legacy mixed detected** (XIB / storyboard / layout XML / setContentView(R.layout.\*)):

Ask exactly one question during brainstorm:

> "I see your project mixes [XML layouts / XIBs / classic Activities] with modern UI. For this task, should I stay on pure [Compose/SwiftUI], or integrate into a legacy screen?"

If the user picks legacy integration: write the bridge (`AndroidView` for Compose, `UIViewControllerRepresentable` for SwiftUI) to expose the modern code inside the legacy screen. Never generate new legacy code (no XML, no XIB, no setContentView).

**The five domains to cover:**

1. **Product** — What is it? (app, landing page, portfolio, SaaS, e-commerce, blog, dashboard...)
2. **Audience** — Who uses it? (devs, designers, general public, enterprise, kids, luxury...)
3. **Mood** — 3 to 5 adjectives that define the visual feel
4. **References** — Sites, screenshots, mood boards, anything visual
5. **Tech stack** — What's already in place? Or starting from scratch?

**How to ask:** One question at a time, starting with the least obvious domain. If you already know the tech stack from scanning `package.json`, don't ask — start with mood or audience instead. Each answer reshapes how you ask the next question.

**How to handle vague answers:**

When the user says "modern" or "clean" or "I don't know, just make it nice":

1. **Validate** — "That's a starting point. Let's make it precise."
2. **Offer concrete options** — "Clean like Stripe's editorial whitespace, clean like Linear's dense-but-organized, or clean like Apple's dramatic minimalism?"
3. **Reframe** — "What would feel *wrong*? What sites make you cringe? That's just as useful."
4. **Name the consequence** — "This choice drives the entire color palette and typography. Worth spending a minute on."

**Never** interpret a vague answer as confirmation. "Yeah something like that" means dig deeper — ask which part of "that" resonates.

**When the user pushes to skip or rush brainstorm:**

Do NOT capitulate. Instead:

> "We've covered [covered areas]. I'm still missing [missing areas], which will directly impact [concrete consequence]. Want me to ask one more question, or would you rather I make assumptions and you correct them afterward?"

This gives them an informed choice. If they choose assumptions, name each assumption explicitly in the thesis.

**Never** negotiate the number of remaining questions ("just two more, I promise"). You don't know how many you need until you hear the answers.

**When to stop:** When you can write both theses (visual + interaction) and you'd bet money the user will say "oui parfait." If you'd be guessing on even one aspect, keep asking.

---

### Phase 2 — THESIS (define direction, get validation)

From the brainstorm, produce two theses:

#### Visual Thesis

A single sentence that captures the entire visual identity. **Must explicitly address all four:**

- **Color direction** — dark/light, palette family, accent color
- **Typography spirit** — serif/sans/mono, weight usage, size contrast
- **Spacing philosophy** — dense/airy, base unit feel
- **Component style** — rounded/sharp, bordered/filled, elevated/flat

> Example: "Dark neo-brutalist interface with bold monospace type, fluorescent chartreuse accents, generous whitespace, raw-edged components with offset shadows."

**Self-check:** read your thesis back. If any of the four areas is missing or vague ("nice typography"), rewrite it before presenting.

#### Interaction Thesis

A single sentence that captures the motion and interaction language. **Must explicitly address all four:**

- **Timing range** — fast (100-200ms), medium (200-400ms), or slow (400ms+)
- **Hover behavior** — what happens on hover
- **Scroll behavior** — reveals, parallax, or nothing
- **Forbidden patterns** — what this project will NOT do

> Example: "Fast and dry transitions (100-200ms), hover with subtle scale (1.02), scroll-triggered reveals with stagger, no bounce or elastic — all sharp ease-out."

**Cross-platform thesis examples:**

- "This Compose hero will use a SharedTransitionLayout with a spring(stiffness=Spring.StiffnessMedium, dampingRatio=0.85) for a fluid card-to-detail transition."
- "This SwiftUI tab transition will use matchedGeometryEffect with a .smooth spring (response: 0.5, dampingFraction: 0.85) for a tactile, spatial feel."
- "This macOS dashboard will use 100ms opacity hover states (no scale on hover, desktop subtlety) and a Cmd+1-9 keyboard shortcut to navigate panels."
- "This Android header will use an AGSL shader bound to scrollOffset for a dynamic liquid-glass effect (Android 13+, with a static fallback below)."

**Self-check:** read your thesis back. If you can't immediately derive the CSS/JS properties from it, it's too vague. Rewrite.

**Wait for explicit user validation of BOTH theses before moving on.** If the user pushes back, don't start over — ask what feels wrong and adjust.

---

### Phase 3 — DESIGN SYSTEM

Load `_jutsu/ui-ux-pro-max` sub-skill:

```bash
cat "$SKILL_BASE/ui-ux-pro-max/SKILL.md"
```

#### Stack-aware token generation

The MASTER.md design system file is canonical, but the generated **code** files match the detected stack:

- **Web stack detected**: generate Tailwind config / CSS variables (existing format). Tokens in CSS hex, `cubic-bezier(...)` easings, `rem` spacing. Output paired with `tailwind.config.js` extension or `:root { --token: ... }` CSS.
- **Android Compose stack detected**: generate Kotlin design tokens. Output `Theme.kt`, `Color.kt`, `Type.kt`, `Shapes.kt`, `Motion.kt` referenced from MASTER.md. Color tokens in `Color(0xFF...)`, typography in `TextStyle`, shapes in `RoundedCornerShape`, motion in `MotionScheme` (M3 Expressive when scope is hero / impactful). Spacing in `dp`.
- **SwiftUI stack detected (iOS / macOS / multi-target)**: generate Swift extensions. Output `Color+App.swift`, `Font+App.swift`, `Animation+App.swift`, `Shape+App.swift`. Color tokens via `Color("AssetName")` referencing the asset catalog (or `Color(red:green:blue:)` if no catalog), typography via `Font.system(...)` or `.custom(...)`, animations via `.spring(...)` / `.snappy` / `.bouncy` named presets. Spacing in `CGFloat` constants.
- **Compose Multiplatform stack detected**: generate Kotlin tokens in `commonMain` with `expect/actual` for fonts and platform-specific colors. Same structure as Android Compose, plus a section in MASTER.md describing per-platform deviations.
- **Multi-stack project** (e.g., web admin + native mobile app): generate MASTER.md with clearly delimited sections for each stack, and produce code files for each.

The MASTER.md document itself remains a single canonical source-of-truth file. The generated code files (Theme.kt / Color+App.swift / etc.) are children of MASTER.md and reference it.

Generate the complete design system based on both theses:

- **Color palette** — Primary, secondary, accent, neutrals, semantic (success/warning/error/info). Light + dark if needed.
- **Typography** — Font stack, size scale (fluid or fixed), weight usage, line-height rules.
- **Spacing** — Base unit, scale (4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px...).
- **Radii** — Border radius scale (none, sm, md, lg, full).
- **Shadows** — Elevation levels (0-4), consistent with visual thesis.
- **Base components** — Button, input, card, badge, link — styled per the theses.
- **Motion tokens** — Duration scale (fast/normal/slow), easing names, stagger delay.

#### MASTER.md

Create a `MASTER.md` at project root with the full design system. This file is the single source of truth. Every implementation decision references it.

#### MCP Tools (if available)

Check if these MCPs are connected and use them when available:
- **Stitch** — Generate mockups/wireframes
- **Nano Banana** — Generate visual assets (illustrations, icons, backgrounds)
- **21st.dev Magic** — Generate UI components from descriptions

If MCPs are not available, skip gracefully — the design system + code implementation is the core path.

---

### Phase 4 — IMPLEMENT

Load sub-skills based on tech stack and interaction thesis.

**Always load** (load every sub-skill below via `load_skill <name>`, defined above - it warns instead of failing silently if a ZIP is missing):
- `load_skill motion-principles` - the foundation

<!-- genjutsu:shared:load:start -->
**Context layers** (load when applicable):

| Detected | Load |
|---|---|
| Mobile context (web mobile OR native iOS / Android) | `$SKILL_BASE/mobile-principles/SKILL.md` |
| Desktop context (macOS OR web desktop with no mobile indicators) | `$SKILL_BASE/desktop-principles/SKILL.md` |
| Audit explicitly requested OR scope=full | `$SKILL_BASE/design-audit/SKILL.md` |
| Advanced UI/UX questions | `$SKILL_BASE/ui-ux-pro-max/SKILL.md` |

**Stack-specific** (load by SCAN):

| Detected stack | Sub-skill to load |
|---|---|
| gsap | `$SKILL_BASE/gsap/SKILL.md` |
| framer-motion | `$SKILL_BASE/framer-motion/SKILL.md` |
| Pure CSS / Tailwind / no lib | `$SKILL_BASE/css-native/SKILL.md` |
| three / @react-three | `$SKILL_BASE/threejs-r3f/SKILL.md` |
| Canvas / generative | `$SKILL_BASE/canvas-generative/SKILL.md` |
| Android Compose | `$SKILL_BASE/compose-motion/SKILL.md` (always) + `$SKILL_BASE/compose-graphics/SKILL.md` (if scope=full or thesis is advanced - see below) |
| Compose Multiplatform | `$SKILL_BASE/compose-motion/SKILL.md` + `$SKILL_BASE/compose-multiplatform/SKILL.md` (always); `$SKILL_BASE/swiftui-motion/SKILL.md` if iOS target detected and SwiftUI interop demanded; `$SKILL_BASE/compose-graphics/SKILL.md` if advanced |
| SwiftUI iOS or macOS | `$SKILL_BASE/swiftui-motion/SKILL.md` (always) + `$SKILL_BASE/swiftui-graphics/SKILL.md` (if scope=full or thesis is advanced) |

**"Advanced thesis" trigger** for `compose-graphics` / `swiftui-graphics`:

The thesis is "advanced" (and triggers loading the graphics sub-skill) if it contains any of these terms:
- `shader`, `Metal`, `AGSL`, `RuntimeShader`, `MSL`
- `liquid-glass`, `glassEffect`, `morphing transition`
- `M3 Expressive`, `MotionScheme`, `expressive motion`
- `colorEffect`, `distortionEffect`, `layerEffect`
- `Canvas` (with generative / particle / flow field context)
- `holographic`, `CRT`, `displacement`, `ripple`

Otherwise stick to the base motion sub-skill.
<!-- genjutsu:shared:load:end -->

Implementation rules:
- Work **page by page** or **component by component** — never try to do everything at once.
- Every color, font, spacing, shadow, radius MUST come from MASTER.md tokens. No magic numbers.
- Every animation MUST respect the interaction thesis (timing, easing, forbidden patterns).
- Apply the 5-state rule for interactive elements: **default, hover, focus, active, disabled**.
- Ask the user for validation after each major page/section before moving to the next.

---

### Phase 5 — AUDIT (never skip)

Load `_jutsu/design-audit` sub-skill:

```bash
cat "$SKILL_BASE/design-audit/SKILL.md"
```

Run the full audit checklist matching the detected stack.

**All stacks:**
- [ ] Reduced motion respected (CSS `prefers-reduced-motion`, SwiftUI `accessibilityReduceMotion`, or Compose helper using `ValueAnimator.areAnimatorsEnabled()` / `Settings.Global.ANIMATOR_DURATION_SCALE`).
- [ ] Exit animations present (no abrupt vanishings).
- [ ] No layout-property animations (animate transform / opacity / graphicsLayer instead).
- [ ] Focus visible on interactive elements.
- [ ] Interactive elements have all relevant states (default, hover/press, focus, active, disabled).
- [ ] Colors and spacing consistent with MASTER.md tokens - no rogue hex values.

**Web:**
- [ ] Conditional renders with AnimatePresence (or framework equivalent).
- [ ] Contrast ratio >= 4.5:1 for all text.
- [ ] No forced reflow, `will-change` used sparingly.
- [ ] 60fps target verified via Chrome DevTools Performance panel.
- [ ] No clickable divs without role/button.
- [ ] `aria-hidden` on purely decorative animations.
- [ ] Responsive on 4 breakpoints: 375px (mobile) / 768px (tablet) / 1024px (small desktop) / 1440px (large desktop).

**Compose:**
- [ ] Recomposition counts verified (Layout Inspector / `Modifier.recomposeHighlighter`).
- [ ] No animations on `width`/`height` (use `Modifier.graphicsLayer { translationX/Y, scaleX/Y }`).
- [ ] `Modifier.semantics` set on custom interactive components.
- [ ] Frame timing OK on a mid-range device (Pixel 4a baseline) via Macrobenchmark.

**SwiftUI:**
- [ ] No `body` recomputed on irrelevant state changes (use `@StateObject`, `@ObservableObject` correctly).
- [ ] Hitches Instrument shows no dropped frames during animation.
- [ ] `.accessibilityLabel` / `.accessibilityHint` on all interactive views.
- [ ] Tested with Reduce Motion ON and Dynamic Type at 200%.

**macOS-specific (in addition to SwiftUI):**
- [ ] Hover states present on every interactive element.
- [ ] Keyboard shortcuts (`Cmd+N`, `Cmd+W`, `Cmd+F`, etc.) bound to primary actions.
- [ ] Multi-window state shared coherently if applicable.
- [ ] Focus rings visible on keyboard navigation (no `outline: none` without alternative).

Present findings grouped by severity: **Critical > Important > Nice-to-have**.

---

## Existing Project Protocol

When invoked on a project that already has design/styling:

1. Still run the full BRAINSTORM (Phase 1)
2. Acknowledge existing design, but the thesis overrides it
3. In Phase 4, **replace** existing design tokens/styles with the new design system
4. Preserve functionality and layout structure — only replace the visual layer

This is intentional: `/genjutsu:paint` rebuilds the visual universe. To enhance what exists, use `/genjutsu:cast` instead.

---

## Red Flags — You're About to Violate This Skill

| Thought | Reality |
|---------|---------|
| "The user already said 'minimal dark' — I have enough for a thesis" | Two words aren't five domains. Keep asking. |
| "I'll ask all five brainstorm questions at once" | One at a time. The answer to 'audience' changes how you ask about 'mood'. |
| "The user seems impatient, let's skip to coding" | Use the pressure protocol. A bad thesis costs days, not minutes. |
| "I'll pick colors that feel right" | Every token comes from MASTER.md. No freelancing. |
| "I'll do the whole site in one pass" | Page by page. Validate page by page. |
| "This animation would be cool even though the thesis says no bounce" | The thesis is law. Change it? Re-validate with the user first. |
| "The audit can wait, the user seems happy" | The audit is not optional. Phase 5 always runs. |
| "I'll interpret 'yeah something like that' as a yes" | That's not confirmation. Ask which part resonates. |
