---
name: shadcn-component-discovery
description: Discover shadcn-compatible components and registries across the entire ecosystem before writing any custom UI. Use PROACTIVELY before building tables, forms, modals, animations, dashboards, auth pages, or any UI component. Use when the user says "find a component for...", "is there something for...", "search registries", "what exists for...", or asks about shadcn blocks, Magic UI, Aceternity, ReUI, Animate UI, DiceUI, Tailark, AI Elements, or any other shadcn-compatible registry. Complements the official shadcn skill by surfacing registries beyond the user's configured `components.json` — use when exploring what's available to add, not just what's already installed.
---

# shadcn Component Discovery

Surface existing components from across the shadcn ecosystem — including registries the user hasn't configured yet — before spending effort on custom implementations.

## How This Complements the Official shadcn Skill

The official `shadcn` skill (shipped with CLI v4) searches the registries declared in the user's `components.json`. That's the right tool once the user has decided which registries to use.

This skill fills the *upstream* gap: ecosystem-wide awareness. It helps the user find and choose registries they may not yet have configured — Magic UI for animations, Aceternity for hero sections, AI Elements for chat interfaces, ElevenLabs UI for voice components, and so on. Use this skill for "what exists out there"; let the official skill handle "install this thing I know about."

When both skills apply, this one runs first (discovery), then the official skill takes over for installation and project-aware work.

## Core Principle

Search before building. Most UI needs have been solved in the shadcn ecosystem. The cost of a 10-second registry check is almost always less than custom-building something that already exists.

## When to Trigger

**Proactive triggers** (activate before writing any component code):

- User asks to build a table, form, modal, sidebar, dashboard, auth page, landing section, animation, carousel, chart, or any standard UI pattern
- User describes a feature that implies UI (e.g. "add user accounts management" → table; "let users pick a date range" → date picker)
- User mentions building something "like X" where X is a common pattern

**Explicit triggers** (user directly requests search):

- "Find a component for..."
- "Is there a shadcn component for..."
- "Search registries for..."
- "What exists for..."
- "Any good [category] components?"
- Direct mentions of specific registries (@animate-ui, Magic UI, Aceternity, Tailark, etc.)

## Workflow

### Step 1: Clarify the Need

Before searching, confirm:

- **Functionality**: What must it do? (e.g. sortable + filterable + paginated table)
- **Style**: Animated, minimal, accessible-first, dense, brutalist?
- **Constraints**: Must support keyboard nav? Drag-drop? Mobile-first? SSR?

A two-sentence clarification beats five searches with the wrong query.

### Step 2: Search

Three paths depending on tool availability. The **official shadcn MCP** is strongly preferred when the user has a shadcn project — it returns real results with code examples.

#### Path A: Official shadcn MCP (preferred)

If the shadcn MCP server is running (configured via `npx shadcn@latest mcp init` or equivalent), use its tools directly:

```text
1. mcp__shadcn__search_items_in_registries
   - registries: ["@shadcn", "@blocks", "@animate-ui", "@reui", "@diceui"]
   - query: "<search term>"
   - limit: 10

2. For promising results, get full details:
   mcp__shadcn__view_items_in_registries
   - items: ["@registry/component-name", "@registry/other"]

3. For implementation examples:
   mcp__shadcn__get_item_examples_from_registries
   - query: "<component>-demo"

4. For the install command:
   mcp__shadcn__get_add_command_for_items
   - items: ["@registry/chosen-component"]
```

The MCP only searches registries configured in the user's `components.json`. If the user is looking for something specialized, suggest adding a relevant registry to `components.json` first — see `references/registries.md` for recommendations and configuration snippets.

#### Path B: shadcn CLI (no MCP, but shadcn project)

If there's a `components.json` but no MCP is configured, use the CLI commands that shipped with CLI v3:

```bash
# Search across configured registries
npx shadcn@latest search "<term>"

# Preview a component before installing
npx shadcn@latest view @registry/component-name

# List everything available in a registry
npx shadcn@latest list @registry
```

Suggest adding the MCP for better agent integration: `npx shadcn@latest mcp init`.

#### Path C: No project context

If there's no shadcn project yet, or the user is just exploring:

- Recommend registries from `references/registries.md` based on their described need
- Link directly to the registry's website so they can browse
- Offer to help set up a shadcn project (`npx shadcn@latest init`) once they've picked direction

### Step 3: Present Findings

Match the response format to the context. Keep it scannable — the user is about to make a decision, not read an essay.

#### Proactive check (during build flow)

When the user didn't explicitly ask to search but you searched anyway:

```markdown
Before building custom, I found existing options:

1. **@registry/component-name** — [one-line description]
2. **@registry/alternative** — [one-line description]

Want me to install one, or build custom?
```

Keep it under five lines. The user is in flow; don't derail them.

#### Explicit search (user asked)

```markdown
## Results for "<query>"

**Top matches:**

### @registry/component-name ⭐
[What it does in one sentence]
- Fits because: [specific to their need]
- Install: `npx shadcn@latest add @registry/component-name`

### @registry/alternative
[What it does in one sentence]
- Fits because: [specific to their need]
- Install: `npx shadcn@latest add @registry/alternative`

---
Install [1] or [2], see more results, view code example, or build custom?
```

#### Comparison (multiple good options, choice matters)

Use a short table when 3+ options are genuinely viable and trade off differently. Follow with a recommendation and the install command for the recommended one. Don't table-ify everything — it's heavier than plain prose and should earn its place.

### Step 4: Execute the Choice

- **Install chosen**: Run the `add` command, then customize via props / composition as needed
- **See more**: Return additional matches, continue pagination
- **View code**: Fetch example via `get_item_examples_from_registries` or the registry's demo URL
- **Build custom**: Proceed — but reference the closest existing component for composition patterns (CVA, `cn()`, `data-slot`, semantic tokens)

## Search Strategy

### Effective Query Terms

Short, concrete nouns work best. Keep queries to 1–3 words.

| Looking for… | Try searching… |
|---|---|
| Data display | `table`, `data-grid`, `list` |
| User input | `form`, `input`, `field`, `select`, `combobox` |
| Navigation | `sidebar`, `nav`, `menu`, `tabs`, `breadcrumb` |
| Feedback | `toast`, `sonner`, `alert`, `notification` |
| Overlays | `dialog`, `modal`, `sheet`, `popover`, `drawer` |
| Media | `carousel`, `gallery`, `image` |
| Animation | `animate`, `motion`, `transition` |
| Layout | `card`, `section`, `hero`, `grid`, `stack` |
| Date/time | `calendar`, `date-picker`, `date-range` |

### Registry Specialties (Quick Pick)

| Need | Check first |
|---|---|
| Core UI primitives | `@shadcn` |
| Page sections, pre-built blocks | `@blocks`, Tailark, HextaUI |
| Data grids, advanced tables | `@reui` |
| Animated components | `@animate-ui`, Magic UI, Aceternity UI |
| AI / chat interfaces | AI Elements, assistant-ui |
| Accessibility-first (React Aria) | `@diceui`, JollyUI, Intent UI |
| Voice / audio | ElevenLabs UI |
| Marketing / landing pages | Tailark, Eldora UI |
| Style variants (brutalist, retro, glass) | See `references/registries.md` |

For the full catalog including URLs, configuration snippets, and registry specialties, see [references/registries.md](references/registries.md).

## Response Requirements

Every discovery response should surface:

1. **What was searched** — the query used
2. **Top 2–3 recommendations** — registry-qualified name, one-line description, why it fits
3. **Install command** — ready to copy
4. **A recommendation** — which to pick, when there's a clear fit
5. **Next-step options** — install, view code, see more, build custom

Skip anything beyond this unless the user asks. Brevity respects flow.

## Examples

### Proactive check

**User:** "Add a table showing user accounts with sorting"

**Response:**

> Before building custom, I found existing options:
>
> 1. **@reui/data-grid-table** — Full-featured grid with sorting, filtering, pagination
> 2. **@shadcn/table** — Unstyled primitives (pair with TanStack Table for sorting)
>
> `@reui/data-grid-table` looks like the fit — install it?

### Explicit search

**User:** "Find me an animated accordion"

**Response:**

> ## Results for "animated accordion"
>
> ### @animate-ui/components-base-accordion ⭐
> Accordion with smooth enter/exit transitions built on Motion.
> - Fits because: Animation is built-in, accessible, keyboard nav included
> - Install: `npx shadcn@latest add @animate-ui/components-base-accordion`
>
> ### @shadcn/accordion
> Standard Radix-based accordion, unanimated by default.
> - Fits because: Lighter dependency footprint; you add your own motion
> - Install: `npx shadcn@latest add @shadcn/accordion`
>
> ---
> Install animated [1], install plain [2], or see more?

### No good match

**User:** "Find a component for visualizing git commit lineage"

**Response:**

> ## Results for "git commit lineage"
>
> No directly matching components in the shadcn ecosystem. Closest adjacencies:
> - `@reui/tree` — tree visualizations (could adapt)
> - `@shadcn/chart` — generic charting (Recharts-based)
>
> This is a custom build. Want me to sketch an approach using one of these as a foundation, or look at non-shadcn libraries like `@gitgraph/react`?

## Best Practices

**Do:**
- Search before writing component code — always
- Surface 2–3 options, not 10
- Explain *why* each fits the specific need
- Include the install command, not just the name
- Recommend when the choice is clear

**Don't:**
- Skip searching because "it's faster to build" (it usually isn't)
- Dump the full search-result list — curate
- Present registries the user hasn't configured without mentioning the `components.json` step
- Recommend unmaintained or abandoned registries (check `references/registries.md` for current status)

## Resources

- **Registry catalog**: [references/registries.md](references/registries.md)
- **Official shadcn docs**: https://ui.shadcn.com
- **Official shadcn MCP docs**: https://ui.shadcn.com/docs/mcp
- **Registry browser**: https://registry.directory
- **Component index**: https://shadcnregistry.com
