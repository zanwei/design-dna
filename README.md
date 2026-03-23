# design-dna

English | [中文](README.zh-CN.md)

An agent skill for extracting, structuring, and applying visual design identity as machine-readable "Design DNA" across three dimensions: design tokens, qualitative style, and visual effects.

## Prerequisites

- [Node.js](https://nodejs.org/) environment installed
- Ability to run `npx` commands

## Installation

### Quick Install (Recommended)

```bash
npx skills add zanwei/design-dna
```

### Install to Specific Agent

```bash
# Cursor only, non-interactive, global install
npx skills add zanwei/design-dna -a cursor -g -y

# Claude Code only
npx skills add zanwei/design-dna -a claude-code -g -y
```

### Install from Local Clone

```bash
git clone https://github.com/zanwei/design-dna.git
npx skills add ./design-dna -y
```

### List Available Skills

```bash
npx skills add zanwei/design-dna --list
```

## What It Does

| Dimension | Role |
|-----------|------|
| **Design System** | Measurable tokens: color, typography, spacing, layout, shape, elevation, motion, components |
| **Design Style** | Qualitative perception: mood, visual language, composition, imagery, interaction feel, brand voice |
| **Visual Effects** | Beyond plain CSS: Canvas, WebGL, 3D, particles, shaders, scroll-driven motion, cursor effects, SVG animation, glassmorphism, etc. |

The skill drives a **three-phase** workflow:

1. **Structure** — Surface the full schema and field meanings (see `references/schema.md`).
2. **Analyze** — From screenshots, images, or URLs, produce a complete JSON profile (every field filled; conflicts noted).
3. **Generate** — Given DNA JSON plus content, implement the design (default: self-contained HTML/CSS/JS), following `references/generation-guide.md`.

Phases can be used alone or chained (e.g. Analyze → Generate).

### Recommended Workflow

1. **Curate references** — Gather screenshots, images, or live URLs of designs whose visual identity you want to replicate.
2. **Extract DNA** — Feed those references to the skill. It analyzes every visual property and outputs a quantified Design DNA JSON covering all three dimensions.
3. **Generate from DNA** — Provide the DNA JSON together with your own content. The agent produces pixel-accurate implementations that faithfully reproduce the original design language.

This turns subjective "make it look like that" requests into a **reproducible, version-controllable specification** that any agent can consume consistently.

## Compatibility

Follows the [Agent Skills specification](https://agentskills.io). Installable via [`skills` CLI](https://github.com/vercel-labs/skills) to all [supported agents](https://github.com/vercel-labs/skills#supported-agents) including Cursor, Claude Code, Codex, GitHub Copilot, and [39 more](https://github.com/vercel-labs/skills#supported-agents).

## Contributing

Issues and pull requests are welcome. For substantive behavior changes, update `SKILL.md` and any affected files under `references/` so the skill stays internally consistent.

## License

MIT
