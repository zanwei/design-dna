---
title: "Webflow Skill: Devlink Command"
tags: [webflow, mcp, skill, devlink-command]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Devlink Command

> **Имя скилла:** `devlink-command`  
> **Локальный путь:** `/root/.agent/skills/devlink-command/SKILL.md`

---

# DevLink

Export and sync Webflow Designer components to React/Next.js code with validation, diffs, and integration guidance.

## Important Note

**ALWAYS use Bash tool for all Webflow CLI operations:**
- Execute `webflow devlink sync` via Bash tool
- Use Read tool to examine synced files and webflow.json (never modify)
- Use Glob tool to discover generated components
- Verify CLI installation: `webflow --version`
- Check authentication: Use `webflow auth login` for site authentication
- DO NOT use Webflow MCP tools for CLI workflows
- All CLI commands require proper descriptions (not context parameters)

**Package Manager Detection:**
- Check for lock files: `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn)
- If no lock file found, ask user which package manager to use (npm/pnpm/yarn)
- Use detected package manager for all install/build commands

## Instructions

### Phase 1: Environment Verification
1. **Verify CLI installed**: Run `webflow --version` to confirm CLI is installed
2. **Check authentication**: Verify site authentication (created via `webflow auth login`)
3. **Discover project state**: Check if webflow.json exists with devlink configuration
4. **Identify target framework**: Determine if React, Next.js, or other

### Phase 2: DevLink Configuration
5. **Check for existing config**: Look for `webflow.json` with devlink section
6. **Read configuration**: If exists, show current devlink settings:
   - `rootDir`: Directory to export components into
   - `cssModules`: Whether to use CSS modules
   - `fileExtensions`: File extensions for generated files
   - Other configuration options
7. **Ask operation type**: Clarify what user wants to do:
   - Configure DevLink for first time
   - Sync all components
   - Sync specific components (using `components` regex pattern)
   - Update existing sync
8. **Store baseline** (if updating): Use Read tool to capture current files before sync

### Phase 3: Sync Execution
9. **Run sync command**: Execute `webflow devlink sync` with options:
   - `--api-token` or `-t`: Override API token from .env
   - `--site-id` or `-s`: Override site ID from .env
10. **Monitor sync progress**: Show CLI output and sync status
11. **Capture sync results**: Record files created/modified in rootDir
12. **Validate generated code**:
    - Check for TypeScript errors (if using TS)
    - Verify import statements
    - Confirm component exports
    - Check CSS module references

### Phase 4: Analysis & Diff Preview
13. **Compare before/after**: Show what changed:
    - New files created in rootDir
    - Existing files modified
    - Components added or updated
14. **Show file diffs**: Display key changes for modified files
15. **Analyze component structure**:
    - Component count
    - New components added
    - Updated components
    - CSS files generated
16. **List dependencies**: Show what needs to be imported

### Phase 5: Integration Guidance
17. **Provide import statements**: Show exact code to import components
18. **Show usage examples**: Demonstrate how to use each component
19. **Document sync timestamp**: Record when sync occurred
20. **Provide next steps**: Guide user on testing and integration

## Examples

### Example 1: First-Time DevLink Setup

**User prompt:**
```
Sync my Webflow components to my Next.js project
```

**Step 1: Environment Verification**
```
🔍 DevLink Environment Check

Checking CLI installation...
✓ Webflow CLI installed: v1.5.2

Current directory: /Users/user/projects/my-nextjs-app
Framework detected: Next.js 14

Checking for DevLink configuration...
⚠️ No webflow.json with devlink configuration found

This appears to be your first DevLink sync.
Ready to configure? (yes/no)
```

*User confirms: yes*

**Step 2: Configuration Setup**
```
📋 DevLink Configuration

DevLink syncs Webflow components to your local project as React code.

Configuration needed in webflow.json:

{
  "devlink": {
    "rootDir": "./devlink",           // Where to export components
    "cssModules": true,                // Use CSS modules
    "fileExtensions": {
      "js": "jsx"                      // or "tsx" for TypeScript
    }
  }
}

I'll help you create this configuration.

Questions:
1. Where should components be exported? (default: ./devlink)
2. Use TypeScript? (yes for tsx, no for jsx)
3. Use CSS modules? (recommended: yes)
```

*User provides: ./src/devlink, yes (TypeScript), yes (CSS modules)*

```
Creating webflow.json configuration...

{
  "devlink": {
    "rootDir": "./src/devlink",
    "cssModules": true,
    "fileExtensions": {
      "js": "tsx"
    }
  }
}

✓ Configuration created

⚠️ Authentication Required:
DevLink needs your Webflow site ID and API token.

Run: webflow auth login
This will create a .env file with:
- WEBFLOW_SITE_ID
- WEBFLOW_SITE_API_TOKEN

After authentication, run sync again.
```

### Example 2: First Sync After Configuration

**User prompt:**
```
Run the DevLink sync
```

**Step 1: Verification**
```
🔍 DevLink Sync Check

Checking configuration...
✓ webflow.json found with devlink config
✓ Root directory: ./src/devlink
✓ CSS modules: enabled
✓ File extensions: tsx

Checking authentication...
✓ .env found with WEBFLOW_SITE_ID and WEBFLOW_SITE_API_TOKEN

Ready to sync components from Webflow.
```

**Step 2: Sync Execution**
```
🔄 Syncing Components

Executing: webflow devlink sync

Output:
✓ Connecting to Webflow site
✓ Fetching components
✓ Exporting components to ./src/devlink
✓ Generating React components
✓ Creating CSS module files
✓ Creating index file

Sync complete!

📁 Generated Files:
./src/devlink/
├── index.ts (module exports)
├── Navigation.tsx (component)
├── Navigation.module.css (styles)
├── Hero.tsx (component)
├── Hero.module.css (styles)
├── Footer.tsx (component)
├── Footer.module.css (styles)
└── _webflow-style.css (global styles)

📊 Sync Summary:
- Components synced: 3
- Files created: 8
- Total size: 45 KB
```

**Step 3: Integration Guidance**
```
✅ DevLink Sync Complete!

📋 Components Available:
1. Navigation
2. Hero
3. Footer

💡 How to Use:

Import components in your Next.js pages:
```tsx
import { Navigation, Hero, Footer } from './src/devlink'

export default function Home() {
  return (
    <>
      <Navigation />
      <Hero />
      <Footer />
    </>
  )
}
```

Global Styles:
Import the global DevLink styles in your _app.tsx or layout:
```tsx
import '../src/devlink/_webflow-style.css'
```

📦 No additional dependencies required!
DevLink components use only React (already in your project).

🔄 Future Updates:
Run `webflow devlink sync` again to pull latest design changes.
```

### Example 3: Update Existing Sync

**User prompt:**
```
Sync latest changes from Webflow
```

**Step 1: Pre-Sync State**
```
🔍 DevLink Update Check

Current state:
✓ Configuration: ./src/devlink
✓ Existing components: 3 (Navigation, Hero, Footer)
✓ Last sync: 2 days ago

Capturing current state for comparison...
✓ Baseline captured
```

**Step 2: Sync**
```
🔄 Syncing Updates

Executing: webflow devlink sync

Output:
✓ Connecting to Webflow site
✓ Fetching components
✓ Detecting changes
✓ Updating components
✓ Regenerating files

Sync complete!
```

**Step 3: Diff Analysis**
```
📊 Sync Analysis

Changes detected:

Modified Components:
1. Navigation.tsx
   - Added new "Contact" link
   - Updated styles for mobile view

2. Hero.tsx
   - Changed heading text
   - Updated button styling

New Components:
3. CallToAction.tsx (new)
   - New CTA section added

Unchanged:
- Footer.tsx

📁 Files Updated:
- ./src/devlink/Navigation.tsx (modified)
- ./src/devlink/Navigation.module.css (modified)
- ./src/devlink/Hero.tsx (modified)
- ./src/devlink/Hero.module.css (modified)
- ./src/devlink/CallToAction.tsx (new)
- ./src/devlink/CallToAction.module.css (new)
- ./src/devlink/index.ts (updated exports)

✅ 3 components updated, 1 new component added

💡 New Component Available:
```tsx
import { CallToAction } from './src/devlink'

<CallToAction />
```
```

### Example 4: Sync Specific Components

**User prompt:**
```
Only sync the navigation component from Webflow
```

**Configuration Update:**
```
📋 Filtering Components

To sync only specific components, update webflow.json:

Current configuration:
{
  "devlink": {
    "rootDir": "./src/devlink",
    "cssModules": true,
    "fileExtensions": {
      "js": "tsx"
    }
  }
}

Add components regex pattern:
{
  "devlink": {
    "rootDir": "./src/devlink",
    "cssModules": true,
    "fileExtensions": {
      "js": "tsx"
    },
    "components": "Navigation"     // Regex pattern to match
  }
}

Pattern options:
- "Navigation" - Only Navigation component
- "Nav.*" - All components starting with "Nav"
- "Navigation|Footer" - Multiple specific components
- ".*" - All components (default)

Update webflow.json? (yes/no)
```

*User confirms: yes*

```
✓ Configuration updated

Syncing with filter: "Navigation"

Executing: webflow devlink sync

Output:
✓ Connecting to Webflow site
✓ Fetching components
✓ Applying filter: Navigation
✓ Exporting 1 component

📁 Generated:
./src/devlink/
├── index.ts
├── Navigation.tsx
└── Navigation.module.css

✅ Synced 1 component (Navigation only)
```

### Example 5: Override Site ID and Token

**User prompt:**
```
Sync from a different Webflow site
```

**Response:**
```
🔄 Sync from Different Site

To sync from a different site, use --site-id and --api-token options.

Get credentials:
1. Go to Webflow site settings
2. Get Site ID
3. Generate API token (if needed)

Sync command:
```bash
webflow devlink sync --site-id <SITE_ID> --api-token <API_TOKEN>
```

Example:
```bash
webflow devlink sync \
  --site-id 5f8a9b2c3d4e5f6g7h8i9j0k \
  --api-token wfp_1234567890abcdef
```

This overrides the .env file values for this sync only.

⚠️ Note: You can also:
1. Update .env file with new WEBFLOW_SITE_ID and WEBFLOW_SITE_API_TOKEN
2. Or maintain multiple .env files (.env.site1, .env.site2)
3. Then run: webflow devlink sync (uses .env)

Proceed with override? (yes/no)
```

### Example 6: TypeScript Configuration

**User prompt:**
```
Set up DevLink with TypeScript
```

**Response:**
```
📋 DevLink TypeScript Configuration

For TypeScript projects, configure file extensions:

webflow.json:
{
  "devlink": {
    "rootDir": "./src/devlink",
    "cssModules": true,
    "fileExtensions": {
      "js": "tsx"        // Use .tsx for TypeScript
    }
  }
}

Benefits:
✓ Type-safe components
✓ Better IDE support
✓ Auto-completion
✓ Compile-time error checking

After sync, components will be generated as:
- Navigation.tsx (instead of .jsx)
- Hero.tsx
- Footer.tsx

Usage with TypeScript:
```tsx
import { Navigation } from '@/src/devlink'

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <Navigation />
      {children}
    </div>
  )
}
```

Ready to sync? (yes/no)
```

## Guidelines

### Phase 1: CLI Verification

**Installation Check:**
```bash
# Check if CLI is installed
webflow --version

# If not installed, guide user:
npm install -g @webflow/webflow-cli
```

**Authentication Check:**
```bash
# Site authentication creates .env file
# Check for:
cat .env

# Should contain:
# WEBFLOW_SITE_ID=your-site-id
# WEBFLOW_SITE_API_TOKEN=your-token

# If missing, authenticate:
webflow auth login
```

### Phase 2: Configuration

**webflow.json DevLink Schema:**
```json
{
  "devlink": {
    "rootDir": "./devlink",
    "cssModules": true,
    "fileExtensions": {
      "js": "jsx"
    }
  }
}
```

**All Configuration Options:**

| Option | Description | Default | Required |
|--------|-------------|---------|----------|
| `host` | Webflow API host URL | `https://api.webflow.com` | No |
| `rootDir` | Directory to export components into | `./devlink` | Yes |
| `siteId` | Webflow site ID | `process.env.WEBFLOW_SITE_ID` | No |
| `authToken` | Webflow API authentication token | `process.env.WEBFLOW_SITE_API_TOKEN` | No |
| `cssModules` | Enable CSS modules for component styles | `true` | No |
| `allowTelemetry` | Allow anonymous usage analytics | `true` | No |
| `envVariables` | Inject environment variables into exported components | `{}` | No |
| `components` | Regex pattern to match components to export | `.*` | No |
| `overwriteModule` | Whether to overwrite the module file | `true` | No |
| `fileExtensions` | File extensions for exported components | `{ js: ".js", css: ".css" }` | No |
| `skipTagSelectors` | Exclude tag/ID/attribute selectors from global CSS | `false` | No |
| `relativeHrefRoot` | Control how relative `href` attributes are resolved | `/` | No |

**Common Configurations:**

**React with JavaScript:**
```json
{
  "devlink": {
    "rootDir": "./src/components/webflow",
    "cssModules": true,
    "fileExtensions": {
      "js": "jsx"
    }
  }
}
```

**Next.js with TypeScript:**
```json
{
  "devlink": {
    "rootDir": "./src/devlink",
    "cssModules": true,
    "fileExtensions": {
      "js": "tsx"
    }
  }
}
```

**Sync Specific Components:**
```json
{
  "devlink": {
    "rootDir": "./src/devlink",
    "cssModules": true,
    "components": "Navigation|Hero|Footer"
  }
}
```

### Phase 3: Sync Command

**Basic Sync:**
```bash
# Uses webflow.json config and .env credentials
webflow devlink sync
```

**Sync with Options:**
```bash
# Override site ID
webflow devlink sync --site-id 5f8a9b2c3d4e5f6g7h8i9j0k

# Override API token
webflow devlink sync --api-token wfp_1234567890abcdef

# Override both
webflow devlink sync \
  --site-id 5f8a9b2c3d4e5f6g7h8i9j0k \
  --api-token wfp_1234567890abcdef

# Short flags
webflow devlink sync -s <site-id> -t <api-token>
```

**Sync Options:**
- `--api-token` / `-t`: The API token to use, overriding the `.env` file
- `--site-id` / `-s`: The site ID to sync from, overriding the `.env` file

### Phase 4: Generated Files

**Directory Structure:**
After sync, rootDir contains:
```
./devlink/
├── index.ts                  // Module exports
├── ComponentName.tsx         // Component file
├── ComponentName.module.css  // Component styles (if cssModules: true)
├── AnotherComponent.tsx
├── AnotherComponent.module.css
└── _webflow-style.css        // Global Webflow styles
```

**Component Structure:**
Generated components are React functional components:
```tsx
import React from 'react'
import styles from './ComponentName.module.css'

export function ComponentName() {
  return (
    <div className={styles.container}>
      {/* Component markup */}
    </div>
  )
}
```

**Index File:**
Exports all components for easy importing:
```ts
export { ComponentName } from './ComponentName'
export { AnotherComponent } from './AnotherComponent'
```

### Error Handling

**CLI Not Installed:**
```
❌ Webflow CLI Not Found

The Webflow CLI is required for DevLink.

Installation:
npm install -g @webflow/webflow-cli

After installation, verify:
webflow --version

Documentation: https://developers.webflow.com/cli
```

**Not Authenticated:**
```
❌ Not Authenticated

DevLink needs authentication to access your Webflow site.

Steps:
1. Run: webflow auth login
2. Follow authentication prompts in browser
3. Select your site when prompted
4. Verify: .env file created with:
   - WEBFLOW_SITE_ID
   - WEBFLOW_SITE_API_TOKEN
5. Retry sync

Need help? https://developers.webflow.com/cli/authentication
```

**No Configuration:**
```
❌ DevLink Not Configured

No webflow.json with devlink configuration found.

Create webflow.json in project root:
{
  "devlink": {
    "rootDir": "./devlink",
    "cssModules": true,
    "fileExtensions": {
      "js": "jsx"  // or "tsx" for TypeScript
    }
  }
}

Required fields:
- rootDir: Where to export components

After configuration, run: webflow devlink sync
```

**Sync Failures:**
```
❌ Sync Failed

Error: [Specific error from CLI]

Common Causes:
- Network connection issues
- Invalid site ID or API token
- Insufficient permissions
- Site has no components to export

Solutions:
1. Check internet connection
2. Verify credentials in .env
3. Check site permissions in Webflow
4. Ensure site has published components
5. Try: webflow devlink sync --site-id <id> --api-token <token>

Retry sync? (yes/no)
```

**Invalid Site ID:**
```
❌ Invalid Site ID

The provided site ID is invalid or inaccessible.

Check:
1. Verify WEBFLOW_SITE_ID in .env
2. Ensure you have access to the site
3. Check site ID in Webflow dashboard

Get site ID:
1. Open site in Webflow
2. Go to Site Settings
3. Find Site ID in General tab

Update .env and retry sync.
```

### File Operations

**Reading Files:**
Always use Read tool (never modify):
```
# View DevLink configuration
Read: webflow.json

# View environment
Read: .env

# View generated component
Read: ./devlink/Navigation.tsx

# View generated styles
Read: ./devlink/Navigation.module.css
```

**Discovering Files:**
Use Glob tool to find files:
```
# Find all generated components
Glob: ./devlink/**/*.tsx

# Find all CSS modules
Glob: ./devlink/**/*.module.css

# Find configuration
Glob: webflow.json
```

**Never Use Write/Edit Tools:**
- Don't create webflow.json with Write (show user the structure)
- Don't modify generated components
- Let CLI handle file generation
- Only read files to show content and diffs

### Progress Indicators

**For Sync:**
```
🔄 Syncing Components...

Connecting to Webflow... ✓
Fetching components... ✓
Generating React code... ⏳
Creating CSS modules... ⏳

Processed: 3/5 components
Elapsed: 8s
```

### Best Practices

**Configuration:**
- Keep webflow.json in project root
- Use TypeScript (.tsx) for better type safety
- Enable CSS modules for scoped styling
- Use specific component regex patterns for large sites

**Development Workflow:**
1. Design in Webflow Designer
2. Publish changes
3. Run `webflow devlink sync`
4. Review diffs before integrating
5. Test components in your app

**Integration:**
- Import global styles (_webflow-style.css) in app entry point
- Import components where needed
- Don't modify generated files (will be overwritten)
- Wrap DevLink components if customization needed

**Version Control:**
- Commit webflow.json
- Add .env to .gitignore
- Commit generated devlink/ directory (or add to .gitignore)
- Document last sync timestamp

**Multiple Sites:**
- Use different rootDir for each site
- Or use `components` pattern to filter
- Override credentials with --site-id and --api-token
- Maintain separate .env files

## Quick Reference

**Workflow:** configure webflow.json → authenticate → sync

**Key Commands:**
- `webflow devlink sync` - Sync components from Webflow
- `webflow devlink sync -s <id> -t <token>` - Sync with overrides

**Sync Options:**
- `-s` / `--site-id` - Override site ID
- `-t` / `--api-token` - Override API token

**Configuration:** webflow.json with devlink section

**Schema (Required):**
```json
{
  "devlink": {
    "rootDir": "./devlink"  // Required
  }
}
```

**Schema (Common):**
```json
{
  "devlink": {
    "rootDir": "./devlink",
    "cssModules": true,
    "fileExtensions": {
      "js": "jsx"  // or "tsx"
    }
  }
}
```

**Authentication:** Site authentication via `webflow auth login`

**Environment:** WEBFLOW_SITE_ID and WEBFLOW_SITE_API_TOKEN in .env

**Verification:** Check `webflow --version` and site authentication first

**Generated Files:** React components in rootDir with CSS modules

**Documentation:** https://developers.webflow.com/devlink