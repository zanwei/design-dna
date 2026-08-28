---
title: "Webflow Skill: Figma To Webflow"
tags: [webflow, mcp, skill, figma-to-webflow]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Figma To Webflow

> **Имя скилла:** `figma-to-webflow`  
> **Локальный путь:** `/root/.agent/skills/figma-to-webflow/SKILL.md`

---

# Figma → Webflow

Translate a Figma design into a live Webflow project: real elements, styles,
assets, fonts, and (optionally) custom code + interactions.

## Instructions

Follow this order exactly. When a step says to read a reference file, read it
before doing that work; those files contain the failure modes for that step.

## Non-Negotiable Gates

Treat these as build gates, not suggestions. If you cannot satisfy one, stop
and explain the tradeoff instead of silently substituting.

- **Bridge gate:** Designer Bridge is the default build mode. If selected, provide the Designer launch link (opens Designer with the MCP Bridge App) and wait for the user to open it with that tab foregrounded before bridge-dependent steps. If the bridge disconnects, keep structural work headless and reconnect before snapshots/canvas inspection.
- **Native style gate:** apply styles with `data_style_tool`, never with the `data_whtml_builder` `css` param or raw `var()` strings. Otherwise styles land in Custom properties instead of native controls. Bind Webflow variables with `variable_as_value`.
- **Visible element gate:** build with real Designer-visible elements and native classes. Do not use embed `<style>` blocks, `::before` / `::after`, or other hidden constructs for normal layout/decorative elements.
- **Class existence gate:** create every class with `data_style_tool create_style` before using it in WHTML/element class lists. Webflow can silently drop class names that do not exist yet.
- **Variables gate:** decide the Webflow variable/design-system strategy before creating styles. Do not hard-code repeated colors/type/spacing/radii unless the user explicitly chooses hard-coded output.
- **Vector gate:** logos, icons, and marks must be inline SVG embeds, not PNG/JPG uploads, unless the user explicitly approves raster fallback.
- **Raster quality gate:** hero/product/mockup images must use a confirmed 2x source where crispness matters.
- **Dashed accent gate:** dashed lines, dividers, grids, accents, and underlines must use `repeating-linear-gradient`, not `border-style:dashed`, unless the user explicitly accepts browser-default dash rhythm.
- **Navbar gate:** custom navbar mobile behavior must be CSS-only, not JavaScript. Use the checkbox/sibling-selector pattern in `references/navbar.md`.
- **Verification gate:** never call a build done until you have verified rendered output. If visual verification is blocked, say what is unverified and ask the user to check it.
- **Capability gate:** do not assert that Webflow or MCP "can't" do something until you have tested the relevant tool path or clearly label it as untested.
- **Publish gate:** do not publish by default. Offer `.webflow.io` publish only after build/review, and only proceed on explicit user confirmation.

## Tool Surfaces

| Surface | Examples | Needs Designer open? |
|---|---|---|
| **Data API** (headless) | `data_whtml_builder`, `data_element_builder`, `data_element_tool`, `data_style_tool`, `data_fonts_tool`, `data_pages_tool`, `data_scripts_tool`, `data_assets_tool`, publish | No |
| **Designer Bridge** | `element_snapshot_tool`, `designer_tool` canvas/selection/navigation, `asset_tool upload_image_by_url` | **Yes — Designer tab open AND foregrounded** |

- Call `webflow_guide_tool` once before other Webflow tools. Confirm auth/site with `whoami` + `get_site`.
- Prefer bridge-assisted builds by default for better visual feedback, while still using `data_*` tools for DOM, classes/styles, text, semantic tags, responsive overrides, fonts, scripts, pages, and asset records.
- If Designer is disconnected, continue structural work headlessly with `query_styles`, `get_all_elements`, and `query_elements`; reconnect the bridge for snapshots, canvas inspection, and any still-required bridge-gated image processing fallback.
- If a bridge tool returns `status:false` or "Unable to connect to Webflow Designer," provide the Designer launch link (opens Designer with the MCP Bridge App) and ask the user to open it **and keep that browser tab in the foreground** — it idles/disconnects when backgrounded. Retry before assuming anything broke.

## Workflow

### 1. Gather And Decide

1. Use Figma MCP:
   - `get_metadata` for structure.
   - `get_design_context` for major frames/sections.
   - `get_variable_defs` for colors, type, spacing, radii.
   - Read page/canvas background; do not assume white.
2. Use Webflow MCP:
   - `webflow_guide_tool` first.
   - Confirm target site/page and inspect existing variables/styles.
3. Ask the required setup prompts below.
4. Confirm ambiguous design intent before building. If Figma component instances contain repeated placeholder labels, ask for intended copy instead of copying placeholders.

### Required Prompts

Before creating Webflow variables, classes, or CSS, ask these four questions:

- **Build mode:** Designer Bridge during build (default, better visual QA; requires Designer tab open/foregrounded) or headless first (faster, structural checks only until bridge needed).
- **Variables/design system:** read existing variables and create missing ones (default), create a new design system from scratch, use existing variables only, or hard-code with no Webflow variables.
- **Style naming:** FlowKit naming (default; reference `webflow-mcp:flowkit-naming`), existing Webflow design-system naming, or clear semantic kebab-case names.
- **Units:** `px` (default), `rem`, or `em`. Keep units consistent; only mix when there is a clear reason.

If the user does not choose, use the defaults above. For a blank site, recommend creating a new design system from scratch and explain why.

### 2. Build Foundations And Sections

Before creating variables/classes/styles, read [CSS rules](references/css-rules.md).

1. Create or map Webflow variables according to the selected strategy.
2. Create reusable primitives first: page wrapper, containers, typography, spacing, buttons, image-fill, cards, nav.
3. Create needed classes with `data_style_tool create_style` before referencing them in WHTML/element class lists.
4. Use `data_whtml_builder` for DOM/structure only: one root section per action, semantic tags, nesting, text, and existing class names.
5. Style with `data_style_tool update_style`. Repeat: do **not** use the WHTML `css` param or embed `<style>` blocks for normal styling.
6. Capture returned element ids. Re-find later with `query_elements`, then filter by exact class/type before acting.
7. Build in section-sized batches. Prefer structural verification with `query_elements` / `query_styles` between visual checks.

### 3. Attach Assets

Before handling images or vectors, read [Assets and SVG](references/assets-and-svg.md).

1. Use `data_assets_tool create_asset` for raster assets. Download source bytes locally, compute MD5, POST to presigned S3, then verify nonzero size/variants before placement.
2. For hero/product/mockup images, confirm 2x source before placement.
3. Bind images by asset ID with `set_image_asset`; never rely on raw `<img src="...">`.
4. Inline vector marks as `HtmlEmbed` SVGs and set embed code with `data_element_tool set_settings`.
5. Upload fonts with `data_fonts_tool`; never add Google Fonts `<link>` tags to head.

### 4. Navbar And Custom Behavior

If the build includes a navbar, read [Navbar](references/navbar.md) before building it.

- Ask which breakpoint should collapse to hamburger.
- Webflow native Navbar cannot be created via API/WHTML. Build a semantic custom nav or ask the user to add the native element in Designer.
- Put CSS-only component behavior in an HtmlEmbed inside the component root. Do not use JavaScript for the custom navbar.

### 5. Responsive And QA

Before responsive/final verification, read [Verification](references/verification.md).

1. Use `data_style_tool update_style` with breakpoint ids (`main`, `medium`, `small`, `tiny`). Desktop-first: set base, override downward.
2. If Designer Bridge is selected, snapshot groups/wrappers rather than every element. Keep the Designer tab foregrounded.
3. Verify overlays/layering with a full-page composite, not isolated-section snapshots.
4. Do not trust first snapshots for fonts; warm cache and re-snapshot before changing font implementation.
5. Test tool capabilities before asserting limitations. If you cannot test, say "untested" and describe the uncertainty.
6. Do not claim embed behavior, custom code, blur, WebGL, animation, or mobile widths are verified from your side. Ask the user to confirm in preview/published site.
7. Offer publish/review next steps. Default remains **no publish**.

## Checklist before declaring done

- [ ] Required reference files were read at their point of use.
- [ ] All CSS longhand; correct breakpoints; flexbox-first.
- [ ] Styles applied via `data_style_tool` (native controls), variables bound with `variable_as_value`, and only truly non-native CSS (`backdrop-filter`, `aspect-ratio`, `repeating-linear-gradient`, etc.) left as custom properties.
- [ ] All class names used in WHTML/element class lists exist as Webflow styles; none were silently dropped.
- [ ] No embed `<style>` blocks or `::before` / `::after` pseudo-elements used for normal layout/decorative elements.
- [ ] Build mode followed: bridge-assisted by default with Designer tab open and foregrounded, or headless-first if the user chose it.
- [ ] Webflow variables handled according to the selected strategy; repeated colors/type/spacing/radii are mapped or created unless hard-coding was explicitly selected.
- [ ] Images attached by asset ID (not orphan `<img src>`); 2× source confirmed where crispness matters.
- [ ] Vector marks are clean inline-SVG embeds (backgrounds stripped), or user explicitly approved raster fallback.
- [ ] Dashed accents/dividers/grids use `repeating-linear-gradient`, not `border-style:dashed`, unless user explicitly approved browser-default dashes.
- [ ] Fonts uploaded + referenced by exact family name; temp `<head>` link removed.
- [ ] Runtime-toggled classes have guaranteed CSS (not stripped).
- [ ] Responsive overrides at medium/small/tiny.
- [ ] Rendered output verified visually, or unverified items clearly reported to the user.
- [ ] No untested capability limitation was stated as fact.
- [ ] If published to subdomain, user asked to confirm anything you can't self-verify (embeds, WebGL, blur, mobile).