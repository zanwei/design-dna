---
title: "Webflow Skill: Webflow Cli Troubleshooter"
tags: [webflow, mcp, skill, webflow-cli-troubleshooter]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Webflow Cli Troubleshooter

> **Имя скилла:** `webflow-cli-troubleshooter`  
> **Локальный путь:** `/root/.agent/skills/webflow-cli-troubleshooter/SKILL.md`

---

# Webflow CLI Troubleshooter

Diagnose and resolve Webflow CLI issues with diagnostic commands and automated fixes.

## Important Note

**ALWAYS use Bash tool for all diagnostic operations:**
- Execute diagnostic commands via Bash tool
- Use Read tool to examine configuration files
- Verify CLI installation: `webflow --version`
- Check authentication: `webflow auth login` (if needed)
- Use CLI diagnostic flags: `--verbose`, `--debug-bundler`, `--help`
- DO NOT use Webflow MCP tools for CLI workflows
- All CLI commands require proper descriptions (not context parameters)

**Package Manager Detection:**
- Check for lock files: `package-lock.json` (npm), `pnpm-lock.yaml` (pnpm), `yarn.lock` (yarn)
- If no lock file found, ask user which package manager to use (npm/pnpm/yarn)
- Use detected package manager for all install/build commands

## Instructions

### Phase 1: Issue Identification
1. **Ask user to describe issue**: What command failed or what error occurred
2. **Determine error category**:
   - CLI not installed or wrong version
   - Authentication failed
   - Build/bundle failed
   - Command not recognized
3. **Capture error message**: Get exact error output

### Phase 2: Run Diagnostics
4. **Check CLI installation**: Run `webflow --version`
5. **Check authentication**: Run `webflow auth login` if needed
6. **Run command with --verbose**: Execute failed command with `--verbose` flag for detailed output
7. **Use --debug-bundler** (if bundle issue): Run with `--debug-bundler` flag to see bundler config
8. **Check --help**: Run `webflow <command> --help` to verify command syntax

### Phase 3: Analyze & Fix
9. **Identify root cause**: Parse error messages and diagnostic output
10. **Present fix**: Show specific solution based on CLI error
11. **Apply fix**: Execute fix commands
12. **Verify**: Re-run original command to confirm resolution

## Examples

### Example 1: CLI Not Installed

**User prompt:**
```
Getting "webflow: command not found"
```

**Diagnostics:**
```
🔍 Checking CLI Installation

Executing: webflow --version

Error: bash: webflow: command not found

❌ Webflow CLI not installed
```

**Fix:**
```
📋 Fix: Install Webflow CLI

Executing: npm install -g @webflow/cli

✓ CLI installed

Verifying...
Executing: webflow --version

Output: @webflow/cli/1.5.2

✅ Issue resolved
```

### Example 2: Build Failed

**User prompt:**
```
Build is failing but I don't know why
```

**Diagnostics:**
```
🔍 Running Build with Diagnostics

Executing: webflow library bundle --verbose

Output:
[verbose] Loading webflow.json
[verbose] Found library config
[verbose] Building components from ./src/**/*.webflow.tsx
[verbose] Running bundler
Error: Failed to resolve import './missing-file.ts'

❌ Build failed: Missing import file
```

**Fix:**
```
📋 Fix: Missing Import

Issue: Component imports './missing-file.ts' which doesn't exist

Solutions:
1. Create the missing file
2. Fix the import path
3. Remove the import if not needed

Check your component imports and ensure all files exist.
```

### Example 3: Bundle Configuration Issue

**User prompt:**
```
Bundle is failing with webpack errors
```

**Diagnostics:**
```
🔍 Checking Bundle Configuration

Executing: webflow library bundle --debug-bundler

Output:
[debug-bundler] Final bundler configuration:
{
  "entry": "./src/Component.tsx",
  "output": {
    "path": "/dist",
    "filename": "bundle.js"
  },
  "resolve": {
    "extensions": [".ts", ".tsx", ".js"]
  }
}

Error: Module not found: Can't resolve 'styled-components'

❌ Bundle failed: Missing dependency
```

**Fix:**
```
📋 Fix: Install Missing Dependency

Executing: npm install styled-components

✓ Dependency installed

Retrying bundle...
Executing: webflow library bundle

✓ Bundle created successfully

✅ Issue resolved
```

## Guidelines

### CLI Diagnostic Commands

**Version Check:**
```bash
webflow --version
# or
webflow -V
```

**Command Help:**
```bash
webflow --help                    # General help
webflow library --help            # Library commands help
webflow library bundle --help     # Specific command help
```

**Verbose Output:**
```bash
# Add --verbose to any command for detailed debugging
webflow library bundle --verbose
webflow cloud deploy --verbose
webflow extension bundle --verbose
```

**Debug Bundler:**
```bash
# Show final bundler configuration
webflow library bundle --debug-bundler
webflow extension bundle --debug-bundler
```

### Common Issues & Fixes

**Issue: CLI Not Found**
- **Diagnostic:** `webflow --version` fails
- **Fix:** `npm install -g @webflow/cli`
- **Verify:** `webflow --version` shows version

**Issue: Wrong CLI Version**
- **Diagnostic:** `webflow --version` shows old version
- **Fix:** `npm update -g @webflow/cli`
- **Verify:** Latest version installed

**Issue: Command Not Recognized**
- **Diagnostic:** "Unknown command" error
- **Fix:** Check command with `webflow --help`
- **Verify:** Use correct command syntax

**Issue: Authentication Failed**
- **Diagnostic:** "Not authenticated" error
- **Fix:** `webflow auth login`
- **Verify:** Authentication succeeds

**Issue: Build Failed**
- **Diagnostic:** Run with `--verbose` flag
- **Fix:** Fix errors shown in verbose output
- **Verify:** Build succeeds

**Issue: Bundle Configuration Error**
- **Diagnostic:** Run with `--debug-bundler` flag
- **Fix:** Adjust bundler config in webflow.json
- **Verify:** Bundle succeeds

**Issue: Missing Dependencies**
- **Diagnostic:** "Module not found" errors
- **Fix:** `npm install` or install specific package
- **Verify:** Build/bundle succeeds

**Issue: Corrupted node_modules**
- **Diagnostic:** Unexplained build failures
- **Fix:** `rm -rf node_modules && npm install`
- **Verify:** Build succeeds

### Error Handling

**CLI Not Installed:**
```
❌ Webflow CLI Not Found

Install:
npm install -g @webflow/cli

Verify:
webflow --version

Docs: https://developers.webflow.com/cli
```

**Authentication Required:**
```
❌ Authentication Failed

Fix:
webflow auth login

Follow browser prompts to authenticate
```

**Build/Bundle Failed:**
```
❌ Build Failed

Run with diagnostics:
webflow library bundle --verbose --debug-bundler

This shows:
- Detailed build steps
- Import resolution
- Bundler configuration
- Exact error location

Fix the errors shown in output
```

**Unknown Error:**
```
❌ Unknown Issue

Gather info:
1. What command are you running?
2. Run command with --verbose flag
3. Check command syntax with --help
4. Share full error output

This helps identify the specific problem
```

### File Operations

**Reading Config Files:**
```
# View webflow.json
Read: webflow.json

# View package.json
Read: package.json

# View build output
Read: dist/
```

**Discovering Files:**
```
# Find config files
Glob: **/webflow.json

# Find components
Glob: src/**/*.webflow.tsx

# Find logs
Glob: **/*.log
```

### Best Practices

**Always Start With:**
1. Check CLI version: `webflow --version`
2. Check command syntax: `webflow <command> --help`
3. Run with verbose: Add `--verbose` flag

**For Build/Bundle Issues:**
1. Use `--verbose` for detailed output
2. Use `--debug-bundler` to see config
3. Check import paths
4. Verify dependencies installed

**For Authentication Issues:**
1. Run `webflow auth login`
2. Follow browser prompts
3. Verify workspace access

**For Installation Issues:**
1. Check Node.js version: `node --version`
2. Install CLI globally: `npm install -g @webflow/cli`
3. Verify installation: `webflow --version`

## Quick Reference

**Workflow:** identify → diagnose → fix → verify

**Diagnostic Flags:**
- `--version` / `-V` - Check CLI version
- `--help` / `-h` - Show command help
- `--verbose` - Detailed debugging output
- `--debug-bundler` - Show bundler config

**Common Fixes:**
- Not installed → `npm install -g @webflow/cli`
- Wrong version → `npm update -g @webflow/cli`
- Auth failed → `webflow auth login`
- Build failed → Check `--verbose` output
- Bundle error → Check `--debug-bundler` output
- Missing deps → `npm install`

**Documentation:** https://developers.webflow.com/cli