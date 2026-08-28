# shadcn-Compatible Registry Catalog

Curated catalog of registries that work with the shadcn CLI and MCP, organized by specialty. Recommendations here are for narrowing the field quickly — for an exhaustive live list, see the canonical aggregator at [shadcn.io/awesome/registries](https://www.shadcn.io/awesome/registries).

## Core Registries

Well-maintained registries that cover most project needs. Start here.

### @shadcn — Official primitives
**URL:** [ui.shadcn.com](https://ui.shadcn.com)
**Focus:** Core UI primitives built on Radix or Base UI
**Best for:** Buttons, inputs, cards, dialogs, tables, the foundational layer of any project

### @blocks — Official blocks
**URL:** [ui.shadcn.com/blocks](https://ui.shadcn.com/blocks)
**Focus:** Pre-built page sections using official primitives
**Best for:** Dashboards, auth pages, sidebars, settings layouts — production-ready starting points

### @reui
**URL:** [reui.io](https://reui.io)
**Focus:** Advanced components and full app templates
**Best for:** Data grids, complex forms, admin panels, full page templates beyond basic primitives

### @animate-ui
**URL:** [animate-ui.com](https://animate-ui.com)
**Focus:** Animated components built with Motion (formerly Framer Motion)
**Best for:** Transitions, micro-interactions, animated backgrounds, polished UI

### @aceternity
**URL:** [ui.aceternity.com](https://ui.aceternity.com)
**Focus:** Effect-heavy animated components and landing page elements
**Best for:** Hero sections, 3D cards, spotlight effects, visually striking marketing pages

### @diceui
**URL:** [diceui.com](https://diceui.com)
**Focus:** Accessibility-first components (React Aria based)
**Best for:** Enterprise apps, WCAG-compliant projects, keyboard-heavy UIs

---

## Specialty Registries

### AI & Chat Interfaces

| Registry | Focus | URL |
|---|---|---|
| AI Elements | Radix-style primitives for AI chat, message threads, streaming | [aielements.dev](https://aielements.dev) |
| assistant-ui | AI assistant interfaces with backend adapters (AI SDK, LangGraph, Mastra) | [assistant-ui.com](https://assistant-ui.com) |
| Manifest UI | ChatGPT-style application patterns | [manifest-ui.com](https://manifest-ui.com) |

**Search terms:** `chat`, `message`, `conversation`, `ai`, `assistant`, `streaming`, `thread`

### Animation & Motion

| Registry | Focus | URL |
|---|---|---|
| Magic UI | Animated components, especially landing-page focused | [magicui.design](https://magicui.design) |
| Cult UI | Design-engineer animations and interactions | [cult-ui.com](https://cult-ui.com) |
| Motion Primitives | Low-level motion building blocks | [motion-primitives.com](https://motion-primitives.com) |
| Kokonut UI | Stylized animated UI components | [kokonutui.com](https://kokonutui.com) |

**Search terms:** `animate`, `motion`, `transition`, `hover`, `entrance`, `particles`

### Marketing & Landing Pages

| Registry | Focus | URL |
|---|---|---|
| Tailark | Marketing-focused blocks | [tailark.com](https://tailark.com) |
| Shadcnblocks | Premium block library with 1000+ blocks and templates (paid) | [shadcnblocks.com](https://shadcnblocks.com) |
| Eldora UI | Landing page components | [eldoraui.com](https://eldoraui.com) |
| HextaUI | Extended blocks and components | [hextaui.com](https://hextaui.com) |

**Search terms:** `hero`, `cta`, `pricing`, `features`, `testimonial`, `landing`

### Data & Tables

| Registry | Focus | URL |
|---|---|---|
| @reui | Advanced data grids with sorting/filtering/DnD | [reui.io](https://reui.io) |

**Search terms:** `table`, `data-grid`, `column`, `sort`, `filter`, `pagination`, `virtualized`

**Note:** For very large or complex tables, `@shadcn/table` + TanStack Table is often the better path than a pre-built grid. The shadcn Data Table docs cover this pattern.

### Forms & Validation

| Registry | Focus | URL |
|---|---|---|
| @shadcn | Core form primitives (`form`, `input`, `field`, `field-group`, `input-group`) | [ui.shadcn.com](https://ui.shadcn.com) |
| Shadcn Form Builder | Form-generation utilities | [shadcn-form-builder.vercel.app](https://shadcn-form-builder.vercel.app) |

**Search terms:** `form`, `input`, `field`, `validation`, `submit`

### Voice & Audio

| Registry | Focus | URL |
|---|---|---|
| ElevenLabs UI | Voice agents, audio players, waveform visualizations | [elevenlabs.io](https://elevenlabs.io) |

**Search terms:** `audio`, `voice`, `waveform`, `player`, `orb`

### Style Variants

| Registry | Style | URL |
|---|---|---|
| 8bitcn | Retro 8-bit pixel style | [8bitcn.com](https://8bitcn.com) |
| RetroUI | Neobrutalism | [retroui.dev](https://retroui.dev) |
| Neobrutalism UI | Bold brutalist aesthetic | [neobrutalism.dev](https://neobrutalism.dev) |

**Search terms:** `retro`, `brutalist`, `glass`, `pixel`, `8bit`

### Accessibility-First

| Registry | Focus | URL |
|---|---|---|
| JollyUI | React Aria based | [jollyui.dev](https://jollyui.dev) |
| Intent UI | Accessible, customizable | [intent-ui.com](https://intent-ui.com) |
| Kibo UI | Composable, accessible patterns | [kibo-ui.com](https://kibo-ui.com) |

**Search terms:** `accessible`, `aria`, `a11y`, `keyboard`

### Icons

| Registry | Focus | URL |
|---|---|---|
| pqoqubbw/icons | Animated Lucide icons | [icons.pqoqubbw.dev](https://icons.pqoqubbw.dev) |

**Search terms:** `icon`, `animated-icon`, `lucide`

---

## Quick-Pick by Project Type

| Building… | Start with |
|---|---|
| SaaS dashboard | `@shadcn`, `@blocks`, `@reui` |
| Marketing site | Tailark, Aceternity, Magic UI |
| AI application | AI Elements, assistant-ui, `@animate-ui` |
| Admin panel | `@reui`, `@blocks`, `@diceui` |
| E-commerce | `@shadcn`, `@blocks`, `@reui` |
| Portfolio | Aceternity, Magic UI, Cult UI |
| Enterprise app | `@diceui`, JollyUI, `@shadcn` |
| Voice / audio app | ElevenLabs UI, `@shadcn` |

---

## Configuring Registries

Since shadcn CLI 3.0, registries are declared with namespaces in `components.json` using a `{name}` URL template:

```json
{
  "registries": {
    "@animate-ui": "https://animate-ui.com/r/{name}.json",
    "@aceternity": "https://ui.aceternity.com/registry/{name}.json",
    "@reui": "https://reui.io/r/{name}.json",
    "@magicui": "https://magicui.design/r/{name}.json"
  }
}
```

For each registry, check the registry's own docs for the exact URL — templates occasionally differ. Once registered, install with `npx shadcn@latest add @namespace/component-name`.

### Authenticated Registries

Paid or private registries take a config object with headers:

```json
{
  "registries": {
    "@shadcnblocks": {
      "url": "https://shadcnblocks.com/r/{name}.json",
      "headers": {
        "Authorization": "Bearer ${SHADCNBLOCKS_API_KEY}"
      }
    }
  }
}
```

The `${ENV_VAR}` syntax reads from the environment at CLI/MCP invocation time. Never commit raw tokens.

---

## Discovery Commands (CLI)

shadcn CLI ships search and discovery commands that complement MCP-based discovery:

```bash
# Search configured registries
npx shadcn@latest search "data table"

# Preview a component before installing
npx shadcn@latest view @reui/data-grid-table

# List everything in a registry
npx shadcn@latest list @animate-ui

# Get documentation and examples for an installed component
npx shadcn@latest docs combobox
```

---

## Browsing Registries Manually

When the MCP or CLI isn't available (or the user wants to browse visually):

- **[shadcn.io/awesome/registries](https://www.shadcn.io/awesome/registries)** — Canonical aggregator, maintained alongside the docs
- **[registry.directory](https://registry.directory)** — Third-party registry browser
- **[shadcnregistry.com](https://shadcnregistry.com)** — Searchable component index across registries
- **[ui.shadcn.com/blocks](https://ui.shadcn.com/blocks)** — Official blocks gallery

Each registry's own site typically has demos and copy-pasteable snippets.

---

## Notes on Registry Health

Registry quality and maintenance varies. When recommending a registry, favor:

- Registries referenced on the official shadcn.io/awesome list (signals active maintenance)
- Registries with clear `{name}.json` URL schemas (signals MCP/CLI compatibility)
- Registries with demos and example code (signals commitment to usability)

Avoid recommending registries without recent updates, without clear documentation, or with broken install flows. When in doubt, fall back to `@shadcn` + `@blocks` + build custom.
