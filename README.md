# design-dna

**Language / 语言:** [English](README.md) · [简体中文](README.zh-CN.md)

---

An [Agent Skill](https://agentskills.io) for coding agents (Cursor, Claude Code, Codex, and [many others](https://github.com/vercel-labs/skills#supported-agents)). It provides a structured workflow to **extract**, **document**, and **apply** visual design identity as machine-readable “Design DNA” across three dimensions: design tokens, qualitative style, and visual effects.

Install from this repository with the open [`skills` CLI](https://github.com/vercel-labs/skills). Discover more skills at [skills.sh](https://skills.sh/).

## What it does

| Dimension | Role |
|-----------|------|
| **Design system** | Measurable tokens: color, typography, spacing, layout, shape, elevation, motion, components |
| **Design style** | Qualitative perception: mood, visual language, composition, imagery, interaction feel, brand voice |
| **Visual effects** | Beyond “plain CSS”: Canvas, WebGL, 3D, particles, shaders, scroll-driven motion, cursor effects, SVG animation, glassmorphism, etc. |

The skill drives a **three-phase** workflow:

1. **Structure** — Surface the full schema and field meanings (see `references/schema.md`).
2. **Analyze** — From screenshots, images, or URLs, produce a **complete JSON profile** (every field filled; conflicts noted).
3. **Generate** — Given DNA JSON plus content, implement the design (default: self-contained HTML/CSS/JS), following `references/generation-guide.md`.

Phases can be used alone or chained (e.g. analyze → generate).

## Installation

Requires [Node.js](https://nodejs.org/) (for `npx`). **Repository:** [github.com/zanwei/design-dna](https://github.com/zanwei/design-dna).

```bash
# Install into detected agents (interactive)
npx skills add zanwei/design-dna

# Cursor only, non-interactive, global (user-wide) install
npx skills add zanwei/design-dna -a cursor -g -y
```

**Preview skills in the repo without installing:**

```bash
npx skills add https://github.com/zanwei/design-dna --list
```

**Install from a local clone:**

```bash
npx skills add /path/to/design-dna -a cursor -y
```

Paths after install depend on the agent; for Cursor, see [Cursor Skills docs](https://cursor.com/docs/context/skills) (often under `~/.cursor/skills/` for global installs).

## Repository layout

```
design-dna/
├── SKILL.md                    # Skill entry: frontmatter + agent instructions
├── references/
│   ├── schema.md               # Full JSON field list and semantics
│   └── generation-guide.md     # How to turn DNA into implementation + QA
├── README.md                   # This file (English)
├── README.zh-CN.md             # Chinese README
├── LICENSE
└── .gitignore
```

`SKILL.md` uses relative links into `references/`; keep that structure when forking or republishing.

## When the agent should use this skill

The skill’s `description` in `SKILL.md` lists trigger phrases. In short, use it when the user wants any of:

- A **design structure / schema** for “Design DNA”
- **Analysis** of references (images, screenshots, URLs) into structured JSON
- **Generation** of UI from an existing DNA JSON
- **Visual effects** called out explicitly (WebGL, particles, shaders, scroll scenes, etc.)

## Compatibility

- Follows the [Agent Skills specification](https://agentskills.io).
- Installable via [`vercel-labs/skills` CLI](https://github.com/vercel-labs/skills) to [supported agents](https://github.com/vercel-labs/skills#supported-agents).

## Security

Review any skill before installing. This repository contains only Markdown instructions and references—no executable scripts. For reporting security issues in dependencies you use locally, follow your organization’s process; general guidance appears on [skills.sh docs](https://skills.sh/docs).

## Contributing

Issues and pull requests are welcome. For substantive behavior changes, update `SKILL.md` and any affected files under `references/` so the skill stays internally consistent.

## License

MIT — see [LICENSE](LICENSE).
