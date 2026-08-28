# Webflow Skills

A collection of [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) for working with Webflow sites through the Webflow MCP server. Manage CMS content, audit site health, optimize assets, build in Webflow Designer, create Code Components, run Webflow CLI workflows, and safely publish changes.

## Installing

These skills work with any agent that supports the Agent Skills standard, including Claude Code, Cursor, and others.

### Claude Code

Install using the [plugin marketplace](https://code.claude.com/docs/en/discover-plugins#how-marketplaces-work):

```
# Add the marketplace
claude plugin marketplace add webflow/webflow-skills
# Install the plugin
claude plugin install webflow-skills@webflow-skills
```

### Cursor

Install from the Cursor Marketplace or add manually via **Settings > Rules > Add Rule > Remote Rule (Github)** with `webflow/webflow-skills`.

### npx skills

Install using the [`npx skills`](https://skills.sh) CLI:

```
npx skills add https://github.com/webflow/webflow-skills
```

### Clone / Copy

Clone this repo and copy the skill folders into the appropriate directory for your agent:

| Agent | Skill Directory | Docs |
|-------|-----------------|------|
| Claude Code | `~/.claude/skills/` | [docs](https://code.claude.com/docs/en/skills) |
| Cursor | `~/.cursor/skills/` | [docs](https://cursor.com/docs/skills) |
| OpenCode | `~/.config/opencode/skills/` | [docs](https://opencode.ai/docs/skills/) |
| OpenAI Codex | `~/.codex/skills/` | [docs](https://developers.openai.com/codex/skills/) |
| Pi | `~/.pi/agent/skills/` | [docs](https://github.com/badlogic/pi-mono/tree/main/packages/coding-agent#skills) |

## Prerequisites

**Webflow MCP Server and CLI Tooling**

Site, CMS, audit, Designer, and publishing skills require the [Webflow MCP server](https://developers.webflow.com/mcp) to be installed and configured. CLI and Code Component workflows also require Node.js and the Webflow CLI.

### What You Need

1. **Webflow Account** - Active Webflow account with sites
2. **Webflow MCP Server** - Installed and configured in your MCP environment
3. **Node.js and Webflow CLI** - Required for Webflow CLI and Code Component workflows
4. **Compatible Agent** - Any agent with MCP and skills support enabled

### Quick Setup

1. **Add the Webflow MCP server** to your agent's MCP configuration
2. **Authenticate** with your Webflow account when prompted
3. **Verify** the connection by listing your Webflow sites

For detailed setup instructions, visit the [Webflow MCP Documentation](https://developers.webflow.com/mcp).

## Skills

All skills ship from the single `webflow-skills` plugin.

### Webflow MCP Skills

| Skill | Description |
|-------|-------------|
| webflow-mcp:bulk-cms-update | Batch create/update CMS items with validation and preview |
| webflow-mcp:cms-collection-setup | Create collections with custom fields and relationships (16 field types) |
| webflow-mcp:cms-best-practices | Expert guidance on CMS architecture and optimization |
| webflow-mcp:compress-cms-image | Compress and convert CMS item image fields to webp or avif |
| webflow-mcp:site-audit | Comprehensive health check with scoring (0-100) and recommendations |
| webflow-mcp:asset-audit | Identify optimization opportunities for images and files |
| webflow-mcp:link-checker | Scan and fix broken/insecure links across pages and CMS content |
| webflow-mcp:accessibility-audit | WCAG 2.1 compliance check with detailed reports and fixes |
| webflow-mcp:safe-publish | Preview, confirm, publish workflow with verification |
| webflow-mcp:custom-code-management | Manage tracking scripts and custom code safely |
| webflow-mcp:flowkit-naming | Apply Webflow's official FlowKit CSS naming conventions |
| webflow-mcp:designer-tools | Build and manage page structure, elements, components, and styles in Webflow Designer |
| webflow-mcp:figma-to-webflow | Build pages, sections, components, or full sites from Figma designs using Figma MCP and Webflow MCP |

### Webflow CLI Skills

| Skill | Description |
|-------|-------------|
| webflow-cli:cloud | Initialize, build, and deploy full-stack Webflow applications to Webflow Cloud hosting |
| webflow-cli:devlink | Export Webflow Designer components to React/Next.js code for external projects |
| webflow-cli:designer-extension | Build Designer Extensions for custom Webflow Designer functionality |
| webflow-cli:code-component | Create and deploy reusable React components for Webflow Designer |
| webflow-cli:troubleshooter | Diagnose and fix Webflow CLI issues including installation, auth, build, and bundle problems |

### Webflow Code Component Skills

| Skill | Description |
|-------|-------------|
| webflow-code-component:component-scaffold | Generate new Code Component boilerplate with React component and definition file |
| webflow-code-component:convert-component | Convert an existing React component into a Webflow Code Component |
| webflow-code-component:component-audit | Audit Code Components for architecture decisions and Shadow DOM compatibility |
| webflow-code-component:deploy-guide | Step-by-step guide for deploying Code Components to a workspace |
| webflow-code-component:local-dev-setup | Initialize a new Code Components project from scratch |
| webflow-code-component:pre-deploy-check | Pre-deployment validation for bundle size, dependencies, SSR compatibility |
| webflow-code-component:troubleshoot-deploy | Debug deployment failures with root cause analysis and fixes |

### Webflow University Skills

Guided, educational skills from [Webflow University](https://university.webflow.com) that teach MCP workflows hands-on.

| Skill | Description |
|-------|-------------|
| webflow-university:mcp-getting-started | Guided onboarding for your first Webflow MCP workflow — checks your connection, helps you pick a real task, coaches your prompt, and runs it with you |

## Resources

- [Webflow MCP Documentation](https://developers.webflow.com/mcp)
- [Prompt Library](https://developers.webflow.com/mcp/v1.0.0/examples) - Ready-to-use example prompts
- [Available Tools](https://developers.webflow.com/mcp/v1.0.0/reference/how-it-works#available-tools) - Complete tool reference
- [Agent Skills](https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills) - Learn about the Agent Skills standard

## License

MIT
