---
title: "Webflow Skill: Designer Extension Command"
tags: [webflow, mcp, skill, designer-extension-command]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Designer Extension Command

> **Имя скилла:** `designer-extension-command`  
> **Локальный путь:** `/root/.agent/skills/designer-extension-command/SKILL.md`

---

# Designer Extension

Create and develop Designer Extensions for Webflow with template selection, local development server, and bundling for distribution.

## Important Note

**ALWAYS use Bash tool for all Webflow CLI operations:**
- Execute `webflow extension` commands via Bash tool
- Use Read tool to examine generated files and schema (never modify)
- Use Glob tool to discover project files
- Verify CLI installation: `webflow --version`
- Check authentication: `webflow auth login` (if needed)
- DO NOT use Webflow MCP tools for CLI workflows
- All CLI commands require proper descriptions (not context parameters)

**Package Manager Detection:**
- Check for lock files: `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn)
- If no lock file found, ask user which package manager to use (npm/pnpm/yarn)
- Use detected package manager for all install/build commands

## Instructions

### Phase 1: Environment Verification
1. **Verify CLI installed**: Run `webflow --version` to confirm CLI is installed
2. **Check project state**: Check if already in an extension project (look for webflow.json with extension schema)
3. **Identify operation type**: Determine if user wants to:
   - List available templates
   - Initialize new extension
   - Bundle existing extension
   - Serve extension locally

### Phase 2: Template Listing & Selection
4. **List templates** (if user asks or before init): Run `webflow extension list`
5. **Show available templates**:
   - `default` - Basic HTML/CSS/JavaScript template
   - `react` - React-based template
   - `typescript-alt` - Alternative TypeScript template
6. **Ask user to select template** if initializing new extension

### Phase 3: Extension Initialization
7. **Choose project name**: Ask user for project directory name
8. **Run init command**: Execute `webflow extension init <project-name> <template>`
9. **Read generated schema**: Use Read tool to examine webflow.json
10. **Show schema structure**: Display the 5 schema fields:
    - `name` (required) - Extension name as it appears in Webflow
    - `apiVersion` (required) - API version (2)
    - `publicDir` (required) - Directory to build from (dist)
    - `appIntents` (optional) - Element types that can create connections
    - `appConnections` (optional) - Connection configurations
11. **Install dependencies**: Run `npm install` in project directory

### Phase 4: Local Development
12. **Start dev server**: Execute `webflow extension serve [port]`
13. **Show dev server info**:
    - Default port: 1337 (unless user specifies different port)
    - Local URL: http://localhost:[port]
    - How to load in Designer
14. **Provide loading instructions**:
    - Open Webflow Designer
    - Load extension from local URL
    - Test functionality

### Phase 5: Bundling for Upload
15. **Run bundle command**: Execute `webflow extension bundle`
16. **Show bundle output**: Display bundle.zip location and size
17. **Provide upload instructions**: Guide for uploading to Webflow
18. **Document next steps**: Testing and distribution guidance

## Examples

### Example 1: List Available Templates

**User prompt:**
```
Show me the available Designer Extension templates
```

**Response:**
```
🔍 Designer Extension Templates

Listing available templates...
Executing: webflow extension list

Output:
Available templates:
1. default        - Basic HTML, CSS, and JavaScript
2. react          - React-based extension
3. typescript-alt - Alternative TypeScript template

To create a new extension:
webflow extension init <project-name> <template>

Example:
webflow extension init my-extension react
```

### Example 2: Initialize New Extension

**User prompt:**
```
Create a new Designer Extension called gallery-manager using React
```

**Step 1: Initialize Project**
```
📋 Initialize Designer Extension

Project name: gallery-manager
Template: react

Executing: webflow extension init gallery-manager react

Output:
✓ Created extension project at ./gallery-manager
✓ Generated project structure
✓ Created webflow.json with extension schema
✓ Set up React template

📁 Project Structure:
./gallery-manager/
├── webflow.json         # Extension schema
├── package.json         # Dependencies
├── src/
│   ├── index.html
│   ├── index.tsx
│   └── styles.css
├── dist/                # Build output
└── README.md

Installing dependencies...
Executing: cd gallery-manager && npm install

✓ Dependencies installed (45 packages)
```

**Step 2: Show Schema**
```
📋 Extension Schema (webflow.json)

Reading webflow.json...

{
  "name": "Gallery Manager",
  "apiVersion": "2",
  "publicDir": "dist",
  "appIntents": {},
  "appConnections": []
}

Schema Fields:
✓ name (required)      - Extension name in Webflow
✓ apiVersion (required) - API version: 2
✓ publicDir (required)  - Build directory: dist
  appIntents (optional) - Element connection types
  appConnections (optional) - Connection configs

Extension ready for development!
```

### Example 3: Serve Extension Locally

**User prompt:**
```
Run the extension on my local dev server
```

**Default Port (1337):**
```
🚀 Starting Development Server

Executing: webflow extension serve

Output:
✓ Building extension
✓ Starting dev server
✓ Extension ready

📋 Development Server Running

Local URL: http://localhost:1337
Status: ✓ Active

How to Load in Designer:
1. Open Webflow Designer
2. Open any site
3. Load extension from URL: http://localhost:1337

Press Ctrl+C to stop server
```

**Custom Port:**
```
User: "Run on port 3000 instead"

🚀 Starting Development Server

Executing: webflow extension serve 3000

Output:
✓ Building extension
✓ Starting dev server on port 3000
✓ Extension ready

📋 Development Server Running

Local URL: http://localhost:3000
Status: ✓ Active

Load in Designer: http://localhost:3000
```

### Example 4: Bundle Extension

**User prompt:**
```
Bundle my extension for upload
```

**Step 1: Bundle**
```
📦 Bundling Extension

Executing: webflow extension bundle

Output:
✓ Building production bundle
✓ Creating bundle.zip
✓ Bundle created successfully

Bundle Details:
- File: bundle.zip
- Location: ./dist/bundle.zip
- Size: 245 KB

✅ Bundle ready for upload!
```

**Step 2: Upload Instructions**
```
📤 Upload Instructions

Your extension is bundled and ready to upload.

Upload Steps:
1. Go to Webflow Designer Extensions dashboard
2. Upload bundle.zip
3. Test the extension
4. Submit for review (if distributing)

Bundle location: ./dist/bundle.zip
```

### Example 5: Complete Workflow

**User prompt:**
```
Create a new Designer Extension for managing colors
```

**Step 1: List Templates**
```
🔍 Designer Extension Workflow

First, let me show available templates.

Executing: webflow extension list

Available templates:
1. default        - Basic HTML/CSS/JavaScript
2. react          - React-based (recommended)
3. typescript-alt - TypeScript alternative

Which template would you like to use? (default/react/typescript-alt)
```

*User selects: react*

**Step 2: Initialize**
```
📋 Creating Extension

Project name: color-manager
Template: react

Executing: webflow extension init color-manager react

✓ Project created at ./color-manager
✓ webflow.json generated
✓ React template configured

Installing dependencies...
✓ npm install complete

📋 Extension Schema:
{
  "name": "Color Manager",
  "apiVersion": "2",
  "publicDir": "dist",
  "appIntents": {},
  "appConnections": []
}
```

**Step 3: Start Development**
```
🚀 Starting Dev Server

Executing: webflow extension serve

✓ Server running at http://localhost:1337

Load in Designer:
1. Open Webflow Designer
2. Load extension from: http://localhost:1337
3. Start developing!

Server running... (Press Ctrl+C to stop)
```

## Guidelines

### Phase 1: CLI Verification

**Installation Check:**
```bash
# Check if CLI is installed
webflow --version

# If not installed, guide user:
npm install -g @webflow/cli
```

**Authentication (if needed):**
```bash
# Site authentication if required
webflow auth login
```

### Phase 2: Template Management

**List Templates Command:**
```bash
webflow extension list
```

**Available Templates:**
- **default** - Basic HTML, CSS, and JavaScript template
- **react** - React-based extension with modern tooling
- **typescript-alt** - Alternative TypeScript template

### Phase 3: Initialization

**Init Command:**
```bash
webflow extension init <project-name> <template>
```

**Arguments:**
- `<project-name>` (required) - Name of the new project directory
- `<template>` (required) - One of: default, react, typescript-alt

**Example Commands:**
```bash
# Initialize with default template
webflow extension init my-extension default

# Initialize with React template
webflow extension init my-extension react

# Initialize with TypeScript template
webflow extension init my-extension typescript-alt
```

**Project Structure After Init:**
```
/project-name/
├── webflow.json         # Extension schema (required)
├── package.json         # Dependencies
├── src/                 # Source files
│   ├── index.html
│   ├── index.tsx (or .js)
│   └── styles.css
├── dist/                # Build output directory
└── README.md
```

### Phase 4: Extension Schema

**Schema in webflow.json:**
```json
{
  "name": "<Your Extension Name>",
  "apiVersion": "2",
  "publicDir": "dist",
  "appIntents": {
    "image": ["manage"],
    "form": ["manage"]
  },
  "appConnections": [
    "myAppImageConnection",
    "myAppFormConnection"
  ]
}
```

**Schema Fields:**

| Field            | Description                                         | Default | Required |
| ---------------- | --------------------------------------------------- | ------- | -------- |
| `name`           | Extension name as it appears in Webflow             | -       | Yes      |
| `apiVersion`     | API version to use for extension                    | `2`     | Yes      |
| `publicDir`      | Directory to build and serve extension from         | `dist`  | Yes      |
| `appIntents`     | Element types that can create connections           | `{}`    | No       |
| `appConnections` | Connection configurations for extension             | `[]`    | No       |

**Required Fields:**
- `name` - Must be unique and descriptive
- `apiVersion` - Currently must be "2"
- `publicDir` - Directory where built files are placed (default: "dist")

**Optional Fields:**
- `appIntents` - Defines which element types can connect to your extension
  - Example: `{"image": ["manage"], "form": ["manage"]}`
- `appConnections` - Array of connection identifiers
  - Example: `["myAppImageConnection", "myAppFormConnection"]`

### Phase 5: Local Development

**Serve Command:**
```bash
# Serve on default port (1337)
webflow extension serve

# Serve on custom port
webflow extension serve 3000
```

**Arguments:**
- `[port]` (optional) - Port number to serve on (default: 1337)

**Development Server:**
- Default URL: http://localhost:1337
- Custom port: http://localhost:[port]
- Auto-rebuilds on file changes
- Hot reload for faster development

**Loading in Designer:**
1. Open Webflow Designer
2. Open any site
3. Go to Extensions menu
4. Load extension from local URL: http://localhost:[port]
5. Extension appears in Designer

### Phase 6: Bundling

**Bundle Command:**
```bash
webflow extension bundle
```

**Output:**
- Creates `bundle.zip` file in project directory
- Contains all built files from `publicDir`
- Ready to upload to Webflow

**Bundle Contents:**
- Built JavaScript and CSS files
- HTML entry points
- Assets from publicDir
- Extension schema

### Error Handling

**CLI Not Installed:**
```
❌ Webflow CLI Not Found

Designer Extensions require the Webflow CLI.

Installation:
npm install -g @webflow/cli

After installation, verify:
webflow --version

Documentation: https://developers.webflow.com/cli
```

**Invalid Template:**
```
❌ Invalid Template

Error: Template "vue" not found

Available templates:
- default
- react
- typescript-alt

Retry with valid template:
webflow extension init my-extension react
```

**Port Already in Use:**
```
❌ Development Server Failed to Start

Error: Port 1337 is already in use

Solutions:
1. Stop other process on port 1337
2. Use different port:
   webflow extension serve 3000

Find process using port:
lsof -ti:1337 | xargs kill -9
```

**Missing webflow.json:**
```
❌ Extension Schema Not Found

Error: webflow.json not found in current directory

This directory is not an extension project.

Solutions:
1. Initialize new extension:
   webflow extension init <name> <template>
2. Navigate to existing extension directory
3. Create webflow.json with required schema
```

**Bundle Failed:**
```
❌ Bundle Creation Failed

Error: Build failed with errors

Common Causes:
- Missing dependencies (run: npm install)
- Build errors in source files
- Invalid webflow.json schema
- Missing publicDir directory

Fix errors and retry:
webflow extension bundle
```

### File Operations

**Reading Extension Files:**
Always use Read tool (never modify):
```
# View extension schema
Read: webflow.json

# View package dependencies
Read: package.json

# View source files
Read: src/index.html
Read: src/index.tsx
```

**Discovering Project Files:**
Use Glob tool to find files:
```
# Find all source files
Glob: src/**/*

# Find configuration files
Glob: *.json

# Find built files
Glob: dist/**/*
```

**Never Use Write/Edit Tools:**
- Don't create or modify webflow.json with Write tool
- Don't edit generated files
- Let CLI generate all project files
- Only read files to show content

### Progress Indicators

**For Init:**
```
📋 Creating Extension...

[████████████████████████] 100%

✓ Project created
✓ Dependencies installed
Elapsed: 12s
```

**For Bundle:**
```
📦 Bundling Extension...

[████████████████████████] 100%

✓ Bundle created: bundle.zip
Elapsed: 5s
```

**For Serve:**
```
🚀 Starting Server...

[████████████████████████] 100%

✓ Server ready at http://localhost:1337
Elapsed: 3s
```

### Best Practices

**Template Selection:**
- Use **react** template for modern component-based development
- Use **default** template for simple extensions or learning
- Use **typescript-alt** for TypeScript-based projects

**Development Workflow:**
1. List available templates
2. Initialize project with chosen template
3. Install dependencies
4. Serve locally for development
5. Test in Designer
6. Bundle for upload
7. Upload to Webflow

**Schema Configuration:**
- Always include required fields: name, apiVersion, publicDir
- Set appropriate appIntents if your extension connects to elements
- Define appConnections for element integrations
- Keep name descriptive and unique

**Local Development:**
- Use default port 1337 for consistency
- Keep dev server running during development
- Test frequently in Designer
- Check console for errors

**Bundling:**
- Bundle only when ready for upload or distribution
- Verify build completes without errors
- Check bundle.zip size
- Test bundled version before uploading

## Quick Reference

**Workflow:** list templates → init → serve → develop → bundle → upload

**Key Commands:**
- `webflow extension list` - Show available templates
- `webflow extension init <project-name> <template>` - Create new extension
- `webflow extension serve [port]` - Start dev server (default: 1337)
- `webflow extension bundle` - Create bundle.zip for upload

**Templates:** default, react, typescript-alt

**Schema Fields (webflow.json):**
- `name` (required) - Extension name
- `apiVersion` (required) - API version (2)
- `publicDir` (required) - Build directory
- `appIntents` (optional) - Element connection types
- `appConnections` (optional) - Connection configs

**Dev Server:** http://localhost:1337 (or custom port)

**Bundle Output:** bundle.zip in project directory

**Documentation:** https://developers.webflow.com/designer/reference/introduction