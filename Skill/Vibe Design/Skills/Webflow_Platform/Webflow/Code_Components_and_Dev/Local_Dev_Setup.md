---
title: "Webflow Skill: Local Dev Setup"
tags: [webflow, mcp, skill, local-dev-setup]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Local Dev Setup

> **Имя скилла:** `local-dev-setup`  
> **Локальный путь:** `/root/.agent/skills/local-dev-setup/SKILL.md`

---

# Local Dev Setup

Set up a new Webflow Code Components project from scratch.

## When to Use This Skill

**Use when:**
- Starting a brand new code components project
- User asks to set up, initialize, or create a new project
- Adding code components to an existing React project
- Setting up the development environment for the first time

**Do NOT use when:**
- Project already exists and is configured (just answer questions directly)
- Creating individual components (use component-scaffold instead)
- Deploying components (use deploy-guide instead)

## Instructions

### Phase 1: Assess Current State

1. **Check if project exists**:
   - Is there an existing package.json?
   - Is there an existing webflow.json?
   - What's the current project structure?

2. **Determine setup type**:
   - New project from scratch
   - Add to existing React project
   - Add to existing Next.js/Vite project

### Phase 2: Project Initialization

3. **Create project structure** (if new):
   - Initialize npm project
   - Set up TypeScript
   - Create folder structure

4. **Install dependencies**:
   - Core: React, TypeScript
   - Webflow: CLI, data-types, react utils
   - Optional: Styling libraries

### Phase 3: Configuration

5. **Create webflow.json**:
   - Set library name
   - Configure component glob pattern
   - Set up globals if needed

6. **Configure TypeScript**:
   - Set up tsconfig.json
   - Enable JSX support

### Phase 4: Create Starter Files

7. **Create example component**:
   - Simple Button component
   - Definition file
   - Basic styling

8. **Create globals file** (optional):
   - For shared styles
   - For decorators

### Phase 5: Verify Setup

9. **Verify bundle compiles**:
   - Run `npx webflow library bundle --public-path http://localhost:4000/` to catch build errors locally
   - This verifies your components, imports, and configuration are correct
   - Full testing in the Webflow Designer requires deploying with `npx webflow library share`

10. **Provide next steps**:
    - How to create more components
    - How to deploy
    - Development workflow

## Examples

For detailed step-by-step examples, see [references/EXAMPLES.md](references/EXAMPLES.md).

**Available examples:**
1. **New Project from Scratch** - Complete setup with React, TypeScript, and CSS Modules
2. **Add to Existing React Project** - Integrate code components into an existing codebase
3. **With Tailwind CSS** - Setup with Tailwind CSS support

**Quick Start (New Project):**

```bash
# 1. Create project
mkdir my-webflow-components && cd my-webflow-components
npm init -y

# 2. Install dependencies
npm install react react-dom
npm install -D typescript @types/react @types/react-dom
npm install -D @webflow/webflow-cli @webflow/data-types @webflow/react

# 3. Create webflow.json
echo '{"library":{"name":"My Library","components":["./src/**/*.webflow.tsx"]}}' > webflow.json

# 4. Create component directory
mkdir -p src/components/Button
```

Then create your component files (.tsx, .webflow.tsx, .module.css). See Example 1 in [references/EXAMPLES.md](references/EXAMPLES.md) for complete file contents including component, definition, and CSS files.

Deploy with:
```bash
npx webflow library share
```

## Validation

After setup, verify the project is correctly configured:

| Check | How to Verify |
|-------|---------------|
| `webflow.json` exists in project root | `cat webflow.json` |
| Dependencies installed | `npm list @webflow/webflow-cli` |
| Bundle compiles without errors | `npx webflow library bundle --public-path http://localhost:4000/` |
| At least one component found | Check bundle output for "Found N component(s)" |

## Guidelines

### Minimum Requirements

Every code components project needs:

1. **package.json** with dependencies
2. **webflow.json** with library config
3. **tsconfig.json** (for TypeScript)
4. At least one `.webflow.tsx` file

### Recommended Structure

```
project/
├── src/
│   ├── components/
│   │   └── [ComponentName]/
│   │       ├── [ComponentName].tsx
│   │       ├── [ComponentName].webflow.tsx
│   │       └── [ComponentName].module.css
│   ├── hooks/           # Custom hooks
│   ├── utils/           # Utilities
│   ├── declarations.d.ts # CSS module types
│   ├── globals.ts       # Decorators/global imports
│   └── globals.css      # Global styles
├── package.json
├── tsconfig.json
├── webflow.json
└── .gitignore
```

### Development Workflow

1. **Create component**: Use [component-scaffold](../component-scaffold/SKILL.md) skill
2. **Develop locally**: Run React project to iterate (e.g., `npm run dev`)
3. **Validate**: Use [pre-deploy-check](../pre-deploy-check/SKILL.md) skill
4. **Deploy**: Use [deploy-guide](../deploy-guide/SKILL.md) skill or run `npx webflow library share`
5. **Test in Webflow**: Add component to page in Designer