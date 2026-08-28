---
title: "Webflow Skill: Code Component Command"
tags: [webflow, mcp, skill, code-component-command]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Code Component Command

> **Имя скилла:** `code-component-command`  
> **Локальный путь:** `/root/.agent/skills/code-component-command/SKILL.md`

---

# Code Component

Create, build, and deploy React components to Webflow Designer with comprehensive validation and deployment verification.

## Important Note

**ALWAYS use Bash tool for all Webflow CLI operations:**
- Execute `webflow` CLI commands via Bash tool
- Use Read tool to examine generated files (never modify)
- Use Glob tool to discover project files
- Verify CLI installation: `webflow --version`
- Check authentication: On first `webflow library share`, workspace authentication happens automatically
- DO NOT use Webflow MCP tools for CLI workflows
- All CLI commands require proper descriptions (not context parameters)

**Package Manager Detection:**
- Check for lock files: `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn)
- If no lock file found, ask user which package manager to use (npm/pnpm/yarn)
- Use detected package manager for all install/build commands

## Instructions

### Phase 1: Environment Verification
1. **Verify CLI installed**: Run `webflow --version` to confirm CLI is installed
2. **Check project state**: Determine if user has existing React project or needs guidance
3. **Identify workspace**: Explain that workspace authentication happens on first share
4. **Review configuration**: Check if webflow.json exists with library configuration

### Phase 2: Project Configuration
5. **Ask operation type**: Clarify what user wants to do:
   - Configure existing React project for Code Components
   - Add components to already-configured project
   - Build and share existing library
6. **Configure webflow.json**: Add library configuration to webflow.json:
   - Library name (appears in Webflow Designer)
   - Components glob pattern (e.g., `./src/**/*.webflow.tsx`)
   - Optional bundleConfig for custom webpack
7. **Read configuration files**: Use Read tool to show:
   - `webflow.json` - Library configuration
   - `package.json` - Dependencies and scripts
   - Component file structure
8. **Verify dependencies**: Ensure React is installed and build scripts exist

### Phase 3: Build & Bundle Validation
9. **Run build**: Execute user's build command (e.g., `npm run build`, `yarn build`)
10. **Validate build output**: Check for build errors or warnings
11. **Run bundle command**: Execute `webflow library bundle` for local validation
12. **Analyze bundle**:
    - Bundle size (should be < 2MB)
    - Dependencies included
    - Output location (default: `./dist`)
    - Validation warnings
13. **Preview bundle details**: Show bundle summary with validation status

### Phase 4: Preview & Approval
14. **Show deployment preview**:
    - Library name from webflow.json
    - Component files included
    - Bundle size and validation status
    - Target workspace (will be selected on first share)
    - Explain workspace authentication if first time
15. **Explain deployment**: What happens when library is shared
16. **Require explicit confirmation**: User must type "share" or "deploy" to proceed
17. **Confirm workspace**: Explain browser will open for workspace selection (first time only)

### Phase 5: Deployment & Verification
18. **Execute share command**: Run `webflow library share`
19. **Monitor deployment**: Show CLI output and progress
20. **Handle workspace auth**: If first time, guide user through browser authentication
21. **Verify deployment success**: Confirm library appears in workspace
22. **Show .env updates**: Explain WEBFLOW_WORKSPACE_ID and WEBFLOW_WORKSPACE_API_TOKEN added
23. **Provide next steps**:
    - How to use components in Designer
    - How to update components
    - Testing recommendations
    - Using `webflow library log` for debugging

## Examples

### Example 1: Configure Existing React Project

**User prompt:**
```
I have a React project with some components I want to share to Webflow
```

**Step 1: Environment Verification**
```
🔍 Webflow CLI Environment Check

Checking CLI installation...
✓ Webflow CLI installed: v1.5.2

Current directory: /Users/user/projects/my-components
✓ Found package.json with React project
✓ Found src/ directory with components

Checking webflow.json...
⚠️ No webflow.json found - needs configuration

Ready to configure for Code Components? (yes/no)
```

*User confirms: yes*

**Step 2: Project Configuration**
```
📋 Configure Code Components Library

I'll help you add the library configuration to webflow.json.

Questions:
1. What should your library be called in Webflow Designer?
   Example: "My Component Library"

2. Where are your component files located?
   Pattern examples:
   - "./src/**/*.webflow.tsx" (components with .webflow.tsx extension)
   - "./src/components/**/*.tsx" (all components in src/components/)
   - "./src/Button.tsx" (specific files)

Let me know the library name and component pattern.
```

*User provides: "Acme Components" and "./src/**/*.webflow.tsx"*

```
Creating webflow.json configuration...

{
  "library": {
    "name": "Acme Components",
    "components": ["./src/**/*.webflow.tsx"]
  }
}

✓ Configuration ready

Found component files:
- src/Button.webflow.tsx
- src/Card.webflow.tsx
- src/Hero.webflow.tsx

Next: Build your components and run bundle command.
```

**Step 3: Build & Bundle Validation**
```
🔨 Building Components

What build command do you use? (e.g., npm run build, yarn build)
```

*User responds: npm run build*

```
Executing: npm run build

Output:
✓ TypeScript compilation successful
✓ Components built to dist/

Creating bundle for validation...
Executing: webflow library bundle

Output:
✓ Analyzing 3 components
✓ Bundling dependencies
✓ Creating bundle
✓ Bundle created: dist/bundle.js

📦 Bundle Analysis:
- Size: 287 KB (✓ within 2MB limit)
- Components: 3 (Button, Card, Hero)
- Dependencies: react@18.2.0, react-dom@18.2.0
- Output: ./dist
- Validation: ✅ All checks passed
```

**Step 4: Preview & Approval**
```
📋 Deployment Preview

Library: Acme Components
Components: 3 (Button, Card, Hero)
Bundle Size: 287 KB

Workspace Authentication:
⚠️ This appears to be your first deployment. When you run 'share':
1. Browser will open for workspace authentication
2. Select your target Webflow workspace
3. Grant access to deploy components
4. CLI will create .env with credentials:
   - WEBFLOW_WORKSPACE_ID
   - WEBFLOW_WORKSPACE_API_TOKEN

Validation Status: ✅ Ready to deploy
- Bundle size: ✓ 287 KB (< 2MB limit)
- Dependencies: ✓ Valid (React 18.2.0)
- Configuration: ✓ webflow.json valid
- Components: ✓ 3 components found

⚠️ Type "share" to deploy this library to your workspace.
```

*User confirms: share*

**Step 5: Deployment & Verification**
```
🚀 Deploying Library

Executing: webflow library share

Output:
✓ Bundling library (287 KB)
✓ Opening browser for workspace authentication...

[Browser opens - user authenticates and selects workspace]

✓ Workspace authenticated: Acme Corp
✓ Uploading bundle
✓ Validating components
✓ Registering with workspace
✓ Library deployed successfully

✅ Library Deployed: Acme Components

Workspace: Acme Corp
Components: 3 (Button, Card, Hero)
Version: Latest
Status: Active

📁 Environment Updated:
Created .env file with:
- WEBFLOW_WORKSPACE_ID=workspace_abc123
- WEBFLOW_WORKSPACE_API_TOKEN=************

⚠️ Important: Add .env to your .gitignore file!

📋 Next Steps:
1. Open Webflow Designer
2. Go to Add Elements → Code Components
3. Find "Acme Components" in the list
4. Drag components onto canvas to use

💡 To update components:
1. Make changes to your component files
2. Run: npm run build
3. Run: webflow library share
   (No re-authentication needed - uses .env credentials)

🔍 For debugging:
- View logs: webflow library log
- Bundle locally: webflow library bundle
- Check bundle size: webflow library bundle --verbose

Component Library URL: https://webflow.com/dashboard/workspaces/acme-corp/components
```

### Example 2: Update Existing Library

**User prompt:**
```
Update my Code Components library with new changes
```

**Step 1: Environment Verification**
```
🔍 Code Components Library Check

Checking configuration...
✓ webflow.json found with library config
✓ Library name: Acme Components
✓ Components pattern: ./src/**/*.webflow.tsx

Checking authentication...
✓ Found .env with workspace credentials
✓ Workspace: Acme Corp

Found components:
- src/Button.webflow.tsx (modified)
- src/Card.webflow.tsx
- src/Hero.webflow.tsx
- src/Form.webflow.tsx (new)

Ready to build and share updates? (yes/no)
```

**Step 2-3: Build & Bundle**
```
🔨 Building Components

Executing: npm run build
✓ Build complete

Bundling for validation...
Executing: webflow library bundle

📦 Bundle Analysis:
- Size: 312 KB (✓ within 2MB limit)
- Components: 4 (Button, Card, Hero, Form) [+1 new]
- Changes: Button updated, Form added
- Validation: ✅ All checks passed
```

**Step 4: Preview**
```
📋 Update Preview

Library: Acme Components
Workspace: Acme Corp (already authenticated)

Changes:
✓ Button component (updated)
✓ Form component (new)
  Card component (unchanged)
  Hero component (unchanged)

Bundle Size: 312 KB (+25 KB from 287 KB)

No re-authentication needed - using existing workspace credentials.

⚠️ Type "share" to update the library.
```

**Step 5: Deployment**
```
🚀 Updating Library

Executing: webflow library share

Output:
✓ Bundling library (312 KB)
✓ Using workspace: Acme Corp
✓ Uploading bundle
✓ Validating components
✓ Updating library
✓ Library updated successfully

✅ Library Updated: Acme Components

Changes deployed:
- Button: Updated ✨
- Form: Added 🆕
- Card: Unchanged
- Hero: Unchanged

💡 Refresh Webflow Designer to see changes:
1. Open Designer
2. Components may auto-refresh
3. Or refresh browser if needed

Components updated in workspace!
```

### Example 3: First-Time Bundle Testing

**User prompt:**
```
I want to test my bundle locally before sharing
```

**Step 1-2: Verification & Configuration**
```
🔍 Local Bundle Testing

✓ webflow.json configured
✓ Library: My Components
✓ Components: ./src/**/*.webflow.tsx

Running local bundle only (no deployment)...
```

**Step 3: Bundle Validation**
```
🔨 Building Components

Executing: npm run build
✓ Build complete

Creating local bundle...
Executing: webflow library bundle

Output:
✓ Analyzing components
✓ Bundling dependencies
✓ Optimizing output
✓ Bundle created: dist/bundle.js

📦 Bundle Details:

Size: 1.2 MB (✓ within 2MB limit)

Components (5):
├── Button.webflow.tsx (25 KB)
├── Card.webflow.tsx (18 KB)
├── Hero.webflow.tsx (45 KB)
├── Form.webflow.tsx (32 KB)
└── Modal.webflow.tsx (28 KB)

Dependencies:
├── react@18.2.0 (included)
├── react-dom@18.2.0 (included)
└── classnames@2.3.1 (included)

Output Directory: ./dist/
- bundle.js (1.2 MB)
- manifest.json

Validation: ✅ All checks passed

💡 Bundle is valid and ready to share!
   Run: webflow library share (when ready to deploy)
```

### Example 4: Bundle Too Large

**User prompt:**
```
Share my components library
```

**Bundle Validation Error:**
```
🔨 Building and Bundling

Executing: npm run build
✓ Build complete

Executing: webflow library bundle

Output:
✓ Analyzing components
✓ Bundling dependencies
⚠️ Bundle size check...

📦 Bundle Analysis:
- Size: 2.4 MB (❌ exceeds 2MB limit)
- Components: 6
- Dependencies: react@18.2.0, react-dom@18.2.0, lodash@4.17.21, moment@2.29.4
- Validation: ❌ Issues found

❌ Bundle Too Large

Current size: 2.4 MB
Maximum allowed: 2 MB
Exceeded by: 400 KB

📊 Size Breakdown:
- React + React DOM: ~800 KB
- lodash: ~500 KB ⚠️
- moment: ~350 KB ⚠️
- Your components: ~750 KB

💡 Recommendations:
1. Remove lodash (use native JS instead)
   - Replace _.map with Array.map
   - Replace _.filter with Array.filter
   - Or use lodash-es and import specific functions

2. Replace moment with lighter alternative
   - Use date-fns (~15 KB vs 350 KB)
   - Or use native Intl.DateTimeFormat

3. Optimize component code
   - Remove unused imports
   - Enable tree-shaking
   - Split large components

4. Use external assets
   - Host large images externally
   - Use CDN for static assets

Would you like to:
1. Continue anyway (using --force flag, not recommended)
2. Review component imports to optimize
3. Cancel and fix manually
```

### Example 5: CI/CD Deployment

**User prompt:**
```
How do I deploy in CI/CD pipeline?
```

**Response:**
```
🤖 CI/CD Deployment Setup

For automated deployments, use non-interactive mode with API tokens.

### Setup Steps:

1. **Get Workspace API Token**
   - Open Workspace Settings in Webflow
   - Go to Integrations → Workspace API Token
   - Generate new token
   - Copy token securely

2. **Add to CI/CD Secrets**
   - Add as environment variable: WORKSPACE_API_TOKEN
   - Never commit tokens to version control

3. **Deployment Command**
   ```bash
   webflow library share --api-token $WORKSPACE_API_TOKEN --no-input
   ```

### Example: GitHub Actions

```yaml
name: Deploy Components
on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: 18

      - name: Install dependencies
        run: npm install

      - name: Install Webflow CLI
        run: npm install -g @webflow/webflow-cli

      - name: Build components
        run: npm run build

      - name: Deploy to Webflow
        run: |
          webflow library share \
            --api-token ${{ secrets.WORKSPACE_API_TOKEN }} \
            --no-input \
            --force
        env:
          WORKSPACE_API_TOKEN: ${{ secrets.WORKSPACE_API_TOKEN }}
```

### Multiple Workspaces:

```bash
# Deploy to workspace 1
webflow library share \
  --api-token $WORKSPACE_1_TOKEN \
  --no-input

# Deploy to workspace 2
webflow library share \
  --api-token $WORKSPACE_2_TOKEN \
  --no-input
```

### Options:
- `--no-input` - Disables interactive prompts
- `--force` - Continues even with warnings
- `--verbose` - Shows detailed output
- `--dev` - Bundles in development mode (for testing)

⚠️ Security:
- Never commit .env files
- Use secrets management in CI/CD
- Rotate tokens regularly
- Limit token permissions
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

**Project Check:**
```bash
# Check for existing configuration
ls webflow.json

# Check for React project
ls package.json

# Check for components
ls src/
```

**Authentication Note:**
Unlike site authentication, workspace authentication for Code Components happens automatically on first `webflow library share`. The CLI will:
1. Open browser for authentication
2. Let user select workspace
3. Create .env with WEBFLOW_WORKSPACE_ID and WEBFLOW_WORKSPACE_API_TOKEN

### Phase 2: Project Configuration

**webflow.json Structure:**
```json
{
  "library": {
    "name": "<Your Library Name>",
    "components": ["./src/**/*.webflow.@(js|jsx|mjs|ts|tsx)"],
    "bundleConfig": "./webpack.webflow.js"
  }
}
```

**Configuration Fields:**
- **name** (required): Library name as it appears in Webflow Designer
- **components** (required): Glob pattern matching component files
  - Example: `"./src/**/*.webflow.tsx"` - all .webflow.tsx files in src/
  - Example: `"./src/components/**/*.tsx"` - all .tsx files in src/components/
- **bundleConfig** (optional): Path to custom webpack configuration

**Component Naming Convention:**
- Add `.webflow` before extension: `Button.webflow.tsx`
- Or use glob pattern to include all files in specific directory
- Components must be React components

**No Init Command:**
Unlike other CLI products, Code Components don't have an `init` command. Users configure existing React projects by adding webflow.json with library configuration.

### Phase 3: Build & Bundle

**Build Process:**
```bash
# Use project's build script
npm run build
# or
yarn build
# or
pnpm build

# Check for errors
echo $?  # 0 = success, non-zero = failure
```

**Bundle Command:**
```bash
# Bundle locally (optional - for testing/validation)
webflow library bundle

# Bundle output: ./dist/ (default)
# Can override: webflow library bundle --output-path ./build
```

**Bundle Options:**
- `--output-path <path>` - Override output directory (default: `./dist`)
- `--public-path <path>` - Override public path
- `--force` - Force bundling even with warnings
- `--debug-bundler` - Show webpack configuration
- `--dev` - Bundle in development mode
- `--verbose` - Show detailed output

**Bundle Validation:**
Check these aspects:
- **Size limit**: Must be < 2MB
- **Dependencies**: React versions compatible
- **Output**: Bundle created in dist/ directory
- **Components**: All component files included

**Common Build Errors:**
- TypeScript compilation errors → Fix type issues
- Missing dependencies → Run npm install
- Import errors → Check file paths
- Bundle too large → Optimize dependencies

### Phase 4: Deployment Preview

**Preview Format:**
```
📋 Deployment Preview

Library: [Name from webflow.json]
Components: [Count] ([List of components])
Bundle Size: [Size in KB/MB]

Workspace Authentication:
[First time: Explain browser auth flow]
[Subsequent: Show workspace from .env]

Validation Status:
✓ Bundle size: [X KB] (< 2MB limit)
✓ Dependencies: Valid
✓ Configuration: webflow.json valid
✓ Components: [N] components found

⚠️ Type "share" to proceed
```

**First-Time Authentication:**
Explain clearly:
1. Browser will open
2. User authenticates with Webflow
3. User selects target workspace
4. CLI creates .env with credentials
5. Future shares use these credentials (no re-auth)

### Phase 5: Deployment Execution

**Share Command:**
```bash
# Standard share (interactive)
webflow library share

# Non-interactive (for CI/CD)
webflow library share --api-token <TOKEN> --no-input

# Force share (ignore warnings)
webflow library share --force

# Development mode
webflow library share --dev
```

**Share Options:**
- `--manifest` - Path to webflow.json (default: scans current directory)
- `--api-token` - Workspace API token (for CI/CD)
- `--no-input` - Disable interactive prompts
- `--force` - Force bundling even with warnings
- `--debug-bundler` - Show bundler configuration
- `--dev` - Bundle in development mode
- `--verbose` - Show detailed output

**Success Indicators:**
- Bundle uploaded successfully
- Library registered in workspace
- Components available in Designer
- .env file created/updated (first time)

**Environment File (.env):**
After first successful share:
```
WEBFLOW_WORKSPACE_ID=your-workspace-id
WEBFLOW_WORKSPACE_API_TOKEN=your-api-token
```

⚠️ **Critical**: Always add .env to .gitignore!

**Verification Steps:**
1. Check CLI output for success message
2. Verify .env file created (first time)
3. Provide Designer access instructions
4. Show workspace dashboard URL

### Phase 6: Debugging

**Log Command:**
```bash
# Show latest log file location
webflow library log

# Example output:
# Latest log: /Users/user/.webflow/logs/library-2024-01-20-15-30-45.log
```

Use this command when:
- Bundle fails with unclear error
- Share command produces warnings
- Need to debug webpack configuration
- Investigating dependency issues

**Common Issues:**

**Issue: "Could not find webflow.json"**
```
❌ Configuration Not Found

The CLI couldn't find webflow.json in the current directory.

Solution:
1. Ensure you're in the project root
2. Create webflow.json with library configuration:
   {
     "library": {
       "name": "Your Library Name",
       "components": ["./src/**/*.webflow.tsx"]
     }
   }
3. Run command again
```

**Issue: "No components found"**
```
❌ No Components Found

The components glob pattern didn't match any files.

Current pattern: "./src/**/*.webflow.tsx"

Solution:
1. Check component files have correct naming
2. Verify glob pattern in webflow.json
3. Common patterns:
   - "./src/**/*.webflow.tsx" (requires .webflow in name)
   - "./src/components/**/*.tsx" (all tsx in folder)
   - "./src/Button.tsx" (specific file)

Found files:
- src/Button.tsx (not matching pattern)
- src/Card.tsx (not matching pattern)

Suggestion: Rename to Button.webflow.tsx or update pattern
```


### Error Handling

**CLI Not Installed:**
```
❌ Webflow CLI Not Found

The Webflow CLI is required for Code Components.

Installation:
npm install -g @webflow/webflow-cli

After installation, verify:
webflow --version

Documentation: https://developers.webflow.com/cli
```



**Build Failures:**
```
❌ Build Failed

Error: [Specific error message]

Common Fixes:
- TypeScript errors: Review type definitions
- Missing deps: Run npm install
- Import errors: Check file paths
- Syntax errors: Check React component syntax

Show build output for details.
Need help? Run: webflow library log
```

**Bundle Failures:**
```
❌ Bundle Failed

Error: [Specific error from CLI]

Common Causes:
- Invalid component files
- Webpack configuration errors
- Dependency conflicts
- File path issues

View detailed logs: webflow library log

Possible solutions:
1. Check component file syntax
2. Verify webflow.json configuration
3. Remove bundleConfig to use defaults
4. Check dependencies in package.json
```

**Deployment Failures:**
```
❌ Share Failed

Error: [Specific error from CLI]

Possible Causes:
- Network connection issues
- Workspace authentication expired
- Bundle validation failed
- Workspace permissions

Solutions:
1. Check internet connection
2. Re-authenticate: Remove .env and run share again
3. Fix bundle issues: Run webflow library bundle first
4. Verify workspace access in Webflow dashboard

Retry share? (yes/no)
```

### File Operations

**Reading Files:**
Always use Read tool (never modify):
```
# View library configuration
Read: webflow.json

# View package dependencies
Read: package.json

# View component source
Read: src/Button.webflow.tsx

# View environment (if exists)
Read: .env
```

**Discovering Files:**
Use Glob tool to find files:
```
# Find all webflow components
Glob: **/*.webflow.tsx

# Find configuration files
Glob: *.json

# Find source files
Glob: src/**/*

# Find build output
Glob: dist/**/*
```

**Never Use Write/Edit Tools:**
- Don't create webflow.json with Write (show user the structure)
- Don't modify component files
- Don't edit package.json
- Let user make file changes
- Only read files to show content

### Progress Indicators

**For Bundling:**
```
🔄 Bundling Components...

Analyzing components... ✓
Resolving dependencies... ✓
Building bundle... ⏳
Optimizing... ⏳

Elapsed: 8s
```

**For Deployment:**
```
🚀 Sharing Library...

Creating bundle... ✓
Uploading to workspace... ⏳
Validating components... ⏳

Uploaded: 287 KB
Elapsed: 12s
```

### Safety Patterns

**Confirmation Keywords:**
- "share" - Share library to workspace
- "deploy" - Alternative to "share"
- "proceed" - Continue with operation
- "cancel" - Cancel operation
- "skip" - Skip optional step

**Preview Before Share:**
Always show:
- What will be shared (library name, components)
- Where it will go (workspace, or first-time auth needed)
- Bundle size and validation status
- Impact of changes (new/updated components)

**Transparency:**
- Show all CLI commands before execution
- Display CLI output in full
- Report success/failure clearly
- Provide troubleshooting guidance
- Show log location for debugging

### Best Practices

**Component Development:**
- Use TypeScript for type safety
- Follow React best practices
- Keep bundle size small (< 1MB ideal)
- Name files with .webflow extension for clarity
- Document component props

**Dependency Management:**
- Keep dependencies minimal
- Avoid large libraries (lodash, moment)
- Use tree-shakeable packages
- Check bundle impact: `webflow library bundle --verbose`
- Peer dependencies for React (not bundled)

**Updates and Versioning:**
- Build before sharing
- Test bundle locally: `webflow library bundle`
- Share to update: `webflow library share`
- No version numbers needed (always "latest")
- Test in Designer after deployment

**Workspace Management:**
- One workspace per .env file
- Use --api-token for multiple workspaces
- Add .env to .gitignore
- Rotate tokens in CI/CD
- Document which workspace is configured

**Configuration:**
- Keep webflow.json in project root
- Use clear library names
- Use specific component glob patterns
- Add bundleConfig only if needed
- Version control webflow.json (not .env)

### Component Lifecycle

**Initial Setup:**
1. Create/have React project
2. Add webflow.json with library configuration
3. Name component files (e.g., .webflow.tsx)
4. Build: `npm run build`
5. Test bundle: `webflow library bundle`
6. Share: `webflow library share` (authenticates first time)

**Making Updates:**
1. Edit component source files
2. Build: `npm run build`
3. Share: `webflow library share` (uses saved credentials)
4. Refresh Designer to see changes

**Testing:**
1. Bundle locally: `webflow library bundle`
2. Check bundle size and validation
3. Fix any issues
4. Share when ready: `webflow library share`
5. Open Webflow Designer
6. Add components to page
7. Test functionality

**Debugging:**
1. View logs: `webflow library log`
2. Bundle with verbose: `webflow library bundle --verbose`
3. Check configuration: cat webflow.json
4. Verify build: npm run build
5. Test in development mode: `webflow library share --dev`

### CLI Command Reference

**Installation:**
```bash
# Install CLI globally
npm install -g @webflow/webflow-cli

# Verify installation
webflow --version
```

**Library Commands:**
```bash
# Bundle locally (testing/validation)
webflow library bundle [options]

# Share to workspace (bundle + deploy)
webflow library share [options]

# View latest log file
webflow library log
```

**Bundle Options:**
```bash
# Custom output path
webflow library bundle --output-path ./build

# Force bundling (ignore warnings)
webflow library bundle --force

# Development mode
webflow library bundle --dev

# Show bundler config
webflow library bundle --debug-bundler

# Verbose output
webflow library bundle --verbose
```

**Share Options:**
```bash
# Standard interactive share
webflow library share

# Non-interactive (CI/CD)
webflow library share --no-input --api-token <TOKEN>

# Force share (ignore warnings)
webflow library share --force

# Development mode
webflow library share --dev

# Custom manifest location
webflow library share --manifest ./config/webflow.json
```

**Global Options:**
```bash
# Show version
webflow --version

# Show help
webflow --help
webflow library --help
webflow library share --help
```

## Quick Reference

**Workflow:** configure webflow.json → build → bundle → share

**Key Commands:**
- `webflow library bundle` - Bundle locally for testing
- `webflow library share` - Bundle and deploy to workspace
- `webflow library log` - View debug logs

**Configuration:** webflow.json with library section

**Authentication:** Automatic on first `webflow library share` (opens browser)

**Environment:** WEBFLOW_WORKSPACE_ID and WEBFLOW_WORKSPACE_API_TOKEN in .env

**Verification:** Always check `webflow --version` first

**Preview:** Show bundle details before sharing

**Confirmation:** Require "share" keyword to proceed

**Documentation:** https://developers.webflow.com/code-components/introduction