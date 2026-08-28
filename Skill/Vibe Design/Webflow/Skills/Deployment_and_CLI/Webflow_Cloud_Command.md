---
title: "Webflow Skill: Webflow Cloud Command"
tags: [webflow, mcp, skill, webflow-cloud-command]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Webflow Cloud Command

> **Имя скилла:** `webflow-cloud-command`  
> **Локальный путь:** `/root/.agent/skills/webflow-cloud-command/SKILL.md`

---

# Webflow Cloud

Initialize new projects from templates and deploy to Webflow Cloud. Supports two modes: **site-attached** (deploy to an existing Webflow site) and **project app** (deploy as an independent project, no existing site required).

## Instructions

### Step 0: Verify CLI is installed

```bash
webflow --version
```

If the command is not found, install it:

```bash
npm install -g @webflow/webflow-cli@latest
# or yarn global add @webflow/webflow-cli@latest
# or pnpm add -g @webflow/webflow-cli@latest
```

Then proceed to state detection.

### Step 1: Detect project state

Run both checks before deciding which path to follow:

```bash
# Is this project already set up on Webflow Cloud?
cat webflow.json

# Is there a git remote?
git remote get-url origin 2>/dev/null
```

**Quick reference:**

| `cloud.project_id` in `webflow.json` | git remote | → Path |
|---|---|---|
| No | — | **A** — new project |
| Yes | No | **B** — existing project, no git |
| Yes | Yes | **C** — ideal state |

---

> **You are running without a TTY.** The CLI's interactive prompts only fire when `process.stdin.isTTY` is true. As an agent invoking the CLI through a subprocess, you do not have a TTY — every prompt is silently skipped, and any required value that wasn't passed as a flag triggers a hard error like `--project-name cannot be empty`.
>
> **Rule for every command in this skill:** pass all required flags explicitly. Never rely on prompts. Pass `--no-input` when the CLI accepts it to make this contract explicit. The required flag set per command:
>
> | Command | Always pass |
> |---|---|
> | `cloud init` (site-attached) | `--no-input --project-name <3–39 chars> --framework <astro\|nextjs> --mount <path> --site-id <id>` |
> | `cloud init --new` (app) | `--no-input --project-name <3–39 chars> --framework <astro\|nextjs> --workspace-id <id>` |
> | `cloud deploy` (site-attached) | `--no-input --mount <path> --environment <env> --site-id <id>` plus `--project-name` on first deploy |
> | `cloud deploy` (project app, first deploy) | `--no-input --mount <path> --environment <env> --workspace-id <id> --project-name <name>` |
>
> `--site-id`, `--project-id`, `--framework`, and `--workspace-id` on `cloud deploy` let agents override what's in `webflow.json` at deploy time.
>
> **Multi-workspace tokens used to be an agent-fatal hang** because workspace selection had no non-TTY path. Now pass `--workspace-id` to skip the picker. **The workspace ID is not surfaced anywhere in the Webflow dashboard UI** — users can't look it up by hand. If the agent doesn't have it, ask the user to run `webflow cloud deploy` interactively once from inside their project. The preflight prompts for workspace selection and writes `cloud.workspace_id` to `webflow.json`; from that point the agent can read it from the manifest and pass `--workspace-id` on subsequent runs. Do **not** suggest `cloud init --new` for ID discovery — on an existing project it creates a discarded scratch directory. **Exception:** in Path A2 (empty directory) it *is* safe to try `cloud init --new` without `--workspace-id` to auto-resolve a single-workspace token — see [Path A2](#path-a2-empty-directory-scaffold-from-scratch).
>
> **Site IDs are visible in the dashboard.** When `--site-id` is needed but unknown, do not ask the user for a raw `site_XXXX` value — use [`webflow sites list`](#picking-a-site-id-from-a-list) to fetch their sites and present a picker keyed by display name. Users can still check their dashboard to fetch it.

---

### Path A: No `project_id` — new project

The project has not been deployed yet. **Before doing anything else, ask the user one question:**

> "Do you already have source code for this project (an existing Next.js or Astro codebase), or are you starting from an empty directory and want a Webflow starter scaffold?"

That answer chooses the branch — and they're meaningfully different:

| User has... | Branch | Init step |
|---|---|---|
| **Existing code** (their own Next.js / Astro project) | **Path A1** | **Skip `cloud init`.** It would create a `./<project-name>/` subfolder with a hello-world scaffold inside their repo, which they don't want. |
| **Empty directory** or wants a Webflow starter | **Path A2** | Run `cloud init` to scaffold from `Webflow-Examples/hello-world-*`. |

After the branch decision, also ask **site-attached vs app** (only relevant before the first deploy):

| User says... | Mode | Outcome |
|---|---|---|
| "deploy to my Webflow site `<name>`", "site-attached", references an existing site | **Site-attached** | Project is bound to an existing Webflow site; site URL hosts the app at the chosen mount path. Requires `--site-id`. |
| "project app", "standalone", "just an app", "no site", or no existing site mentioned | **Project app** | First deploy provisions a brand-new Webflow site (`<project-name>-<hash>.webflow.io`). |

If the user is ambiguous on either question, **ask**. Do not default.

---

#### Path A1: existing codebase, no Webflow Cloud config yet

The user has working source. `cloud deploy` handles everything — framework detection runs against `package.json`, and the preflight phase resolves identity from flags or prompts the user. No `cloud init` needed, no `webflow.json` to hand-write up front.

**Step 1: One-time auth (human-only).** Tell the user to run this locally; agents cannot drive the browser flow:

```bash
webflow auth login
```

**Step 2: Deploy.** The exact form depends on what the agent knows.

**A1-a — Site-attached, `--site-id` is known:**

```bash
webflow cloud deploy --no-input \
  --site-id site_abc123 \
  --project-name my-app \
  --framework nextjs \
  --mount /app \
  --environment main \
  --skip-mount-path-check \
  --skip-update-check
```

`--framework` is optional if `package.json` has the framework's Cloudflare adapter (`@opennextjs/cloudflare`, `@astrojs/cloudflare`). Pass it explicitly for monorepos or when auto-detection is unreliable.

If the agent doesn't know the user's `--site-id`, do **not** ask for a raw `site_XXXX` value — use [`webflow sites list`](#picking-a-site-id-from-a-list) to fetch the user's sites and present readable display names to pick from.

**A1-b — Project app, `--workspace-id` is known:**

```bash
webflow cloud deploy --no-input \
  --workspace-id ws_abc123 \
  --project-name my-app \
  --framework nextjs \
  --mount / \
  --environment main \
  --skip-mount-path-check \
  --skip-update-check
```

**A1-c — Project app, workspace ID is unknown** (the common gap):

**The workspace ID is not visible anywhere in the Webflow dashboard UI.** Users cannot look it up by hand — the only way to discover it is to run the CLI. So the path is:

**Ask the user to run one interactive deploy locally.** From inside their project directory:

```bash
webflow cloud deploy
```

With no `--no-input` and no identity flags, the preflight prompts: *"This project isn't initialized for Webflow Cloud. How would you like to deploy?"* → user picks "Create a new app" → workspace picker → done. After this one human-driven deploy, `cloud.workspace_id` and `siteId` are written to `webflow.json` and `WEBFLOW_SITE_ID` to `.env`. The agent can then run all subsequent deploys with `--site-id` (the newly provisioned site).

> Do **not** ask the user to run `cloud init --new` to "discover" their workspace ID. On an existing project that creates a discarded `./<project-name>/` scratch directory with a hello-world scaffold inside the user's repo. Use the interactive `cloud deploy` path above — it discovers the workspace ID *and* completes the first deploy in the same step.

**Step 3: Set up git** (if not already) — same as Path A2 step 3 below.

---

#### Path A2: empty directory, scaffold from scratch

1. **Scaffold the project** — pick the form that matches the user's intent:

   ```bash
   # Project app (no site attachment). --workspace-id avoids the multi-workspace hang.
   webflow cloud init --new --no-input \
     --project-name my-app \
     --framework astro \
     --workspace-id ws_abc123
   ```

   ```bash
   # Site-attached (connect to an existing Webflow site). Requires --site-id.
   webflow cloud init --no-input \
     --project-name my-app \
     --framework astro \
     --mount /app \
     --site-id site_abc123
   ```

   See [`cloud init`](#webflow-cloud-init) for all flags.

   **Workspace ID discovery for project apps in Path A2 only:** because Path A2 starts from an empty directory, `cloud init --new` creates a fresh scaffold either way — there's nothing to pollute. So if the agent doesn't have `--workspace-id`, it's safe to **try `cloud init --new` without it first**:

   ```bash
   # Try this first if --workspace-id is unknown (Path A2 only — empty dir)
   webflow cloud init --new --no-input \
     --project-name my-app \
     --framework astro
   ```

   - **Single-workspace tokens:** the CLI auto-selects the only workspace, writes `cloud.workspace_id` to `webflow.json`, and exits 0. Read it back from the manifest and pass it as `--workspace-id` to `cloud deploy` in step 2.
   - **Multi-workspace tokens:** the workspace picker fires and the command hangs (no TTY). **Set a 30-second timeout on the Bash call** (or wrap the command in `timeout 30s ...`) — a successful single-workspace init completes in 10–20 seconds (OAuth check + `GET /v2/workspaces` + scaffold download from GitHub), so anything past 30s with no output is the picker hanging. Once the timeout fires, ask the user for the workspace ID directly and re-run with `--workspace-id`.

   For **site-attached** in Path A2, there is no equivalent auto-discovery — `--site-id` is always required up front. Use the [site picker](#picking-a-site-id-from-a-list) pattern below to help the user pick.

   **Path A1 (existing codebase) does not get this trick.** Running `cloud init --new` in an existing project creates a discarded scratch subdirectory. The Path A1 workspace-ID discovery path stays as documented in Path A1-c.

#### Picking a `--site-id` from a list

When `--site-id` is needed (Path A1 site-attached, Path A2 site-attached, or anywhere else) and the user hasn't given one, use `webflow sites list --json` to enumerate sites the token can see, then present a short list of readable names for the user to choose from. The site ID is visible in the Webflow dashboard URL config, but a numeric-ID prompt is bad UX; surface display names instead unless asked for IDs.

```bash
# Returns a JSON array of sites with id, displayName, lastPublished, etc.
webflow sites list --json
```

Workflow:

1. Run `webflow sites list --json`. The CLI exits 0 with a JSON array.
2. Parse the output. Show the user a short list keyed by `displayName` (and `lastPublished` if the user has many sites). Example:

   ```
   Which site should this project deploy to?

   1. Acme Marketing  (last published 2 days ago)
   2. Acme Docs       (last published 3 weeks ago)
   3. Acme Internal   (never published)
   ```

3. Map the user's pick back to its `id` field. Pass that as `--site-id`.

If `webflow sites list` errors (auth missing / expired), surface the error and ask the user to run `webflow auth login` locally; do not try to drive it from the agent.

2. **Deploy:** pick the form matching the init form above. Pass `--site-id` (or `--workspace-id` for project-app first deploy) so the deploy can't misread the manifest if something is half-written.

   ```bash
   # Project-app first deploy — provisions the Cloud site/project/env
   webflow cloud deploy \
     --no-input \
     --project-name my-app \
     --workspace-id ws_abc123 \
     --mount / \
     --environment main \
     --skip-mount-path-check \
     --skip-update-check
   ```

   ```bash
   # Site-attached first deploy — uses the existing Webflow site
   webflow cloud deploy \
     --no-input \
     --project-name my-app \
     --site-id site_abc123 \
     --mount /app \
     --environment main \
     --skip-mount-path-check \
     --skip-update-check
   ```

   This creates the project on Webflow Cloud and sets `cloud.project_id` in `webflow.json`. Commit the updated `webflow.json`.

3. **Set up git** (if not already):
   ```bash
   git init && git add . && git commit -m "init"
   git remote add origin https://github.com/your-org/my-app.git
   git push -u origin main
   ```

4. **(Optional) Enable push-to-deploy via the Webflow dashboard.** Pushing to GitHub alone does **not** trigger deploys — that wiring lives in the Webflow dashboard, not in the CLI or the repo. Tell the user:

   1. Open the Webflow dashboard → their Cloud project → **Settings** → **Git**
   2. Connect their GitHub account, then select the repository and branch
   3. Confirm — the dashboard runs one initial deploy automatically to verify the connection
   4. From that moment on, every push to the connected branch triggers a deploy

   The CLI cannot perform any of these steps. If the user skips this, every deploy must be a manual `webflow cloud deploy` invocation (Path B–style) or a CI/CD pipeline.

> If a deploy auth error occurs in step 2: run `webflow auth login`, complete the browser flow, then retry.

---

### Path B: `project_id` exists, no git remote — existing project, no git

The project is already on Webflow Cloud but has no git repo. Deploy directly and nudge toward git setup.

1. **Deploy:** read `webflow.json` first. If `siteId` is set, pass `--site-id` matching it. If only `cloud.workspace_id` is set, pass `--workspace-id` matching it.

   ```bash
   webflow cloud deploy \
     --no-input \
     --site-id site_abc123 \
     --mount / \
     --environment main \
     --skip-mount-path-check \
     --skip-update-check
   ```

2. **Nudge toward push-to-deploy:** suggest the user initialize a git repo, push to GitHub, **and then connect the repo in the Webflow dashboard** (project → Settings → Git). The dashboard step is what activates push-to-deploy — the CLI can't do this. See Path A, steps 3–4.

> If a deploy auth error occurs: run `webflow auth login`, complete the browser flow, then retry step 1.

---

### Path C: `project_id` exists + git remote — possibly ideal

The project is deployed and has a git remote, **but the existence of a remote is not proof that push-to-deploy is wired up.** That wiring is a dashboard-side connection that the CLI can't introspect. Confirm before suggesting anything.

> **Always ask the user:** *"Is this repo connected to your Webflow Cloud project in the dashboard (project → Settings → Git, with a branch selected)?"* The answer changes the recommendation:
>
> - **Yes, connected** — push-to-deploy is active. The only action needed is `git push`. Do not suggest re-linking or re-deploying.
> - **No, not connected** — `git push` does nothing on the Webflow side. Either run a manual deploy now, or have the user connect the repo in the dashboard first to activate push-to-deploy for future commits.
> - **Don't know** — assume not connected and recommend the dashboard connection (one-time setup, then push-to-deploy is permanent).

1. **If connected** — just commit and push:
   ```bash
   git add .
   git commit -m "your message"
   git push
   ```
   Webflow Cloud picks up the push and deploys automatically. The first deploy after connection is run by the dashboard itself; subsequent pushes are picked up automatically.

2. **If not connected** — two routes:

   - **Activate push-to-deploy for future commits** (recommended). Tell the user to open the Webflow dashboard → their Cloud project → **Settings** → **Git**, connect the repo, select the branch. The dashboard runs an initial deploy automatically to verify the connection. From then on, every `git push` to that branch deploys.
   - **One-off manual deploy now**, without enabling push-to-deploy. Pass `--site-id` matching the `siteId` in `webflow.json`:
     ```bash
     webflow cloud deploy \
       --no-input \
       --site-id site_abc123 \
       --mount / \
       --environment main \
       --skip-mount-path-check \
       --skip-update-check
     ```
     This deploys the current state but does **not** wire up push-to-deploy. The next `git push` will still be a no-op on the Webflow side.

> If a deploy auth error occurs: run `webflow auth login`, complete the browser flow, then retry.

### Tool usage

- Use the **Bash tool** for all `webflow cloud` commands
- Use the **Read tool** to examine `webflow.json`, `package.json` — never modify these directly
- Use the **Glob tool** to discover project files
- **Do not** use Webflow MCP tools for CLI workflows

### Authentication

```bash
# Interactive — local-only, opens a browser. NOT for agents or CI.
webflow auth login
```

> `webflow auth login` performs an OAuth flow in the user's browser and then writes the token to `.env`. It refuses to run with `--no-input` (exits with `No-input mode enabled. Aborting OAuth authentication`). **Agents cannot drive this command.** If `webflow auth login` is needed (missing or expired token), ask the user to run it locally once and report back when it's done.

The CLI writes the same token env var for **both** modes. There is no per-mode split.

**`webflow auth login` writes to `.env`:**

| Variable | Always written? | Description |
|---|---|---|
| `WEBFLOW_API_TOKEN` | Yes (both modes) | OAuth access token. The canonical token env var. Set by `webflow auth login`. |
| `WEBFLOW_SITE_ID` | Site-attached only (or after first project-app deploy) | Site ID. Written by `cloud init` for site-attached projects, or by `cloud deploy` for project apps after the first deploy provisions a site. |

After the **first project-app deploy**, the CLI provisions a site on the backend and writes `WEBFLOW_SITE_ID` to `.env`. From that point on, the project behaves like a site-attached project — but the token env var is still `WEBFLOW_API_TOKEN`.

**Deprecated legacy:** `WEBFLOW_SITE_API_TOKEN` (and `WEBFLOW_WORKSPACE_API_TOKEN`) are read-only legacy fallbacks. The CLI never writes them, but if it finds one of them set in the environment when `WEBFLOW_API_TOKEN` is not set, it uses the legacy value **and prints a deprecation warning on every run**. Do not put `WEBFLOW_SITE_API_TOKEN` in `.env` or CI secrets for new projects — use `WEBFLOW_API_TOKEN`.

Other env vars (any mode):

| Variable | Description |
|---|---|
| `DO_NOT_TRACK` | Set to `1` to opt out of telemetry. |
| `WEBFLOW_SKIP_UPDATE_CHECKS` | Set to `true` to skip the @webflow package update check. |

> **`WEBFLOW_SITE_ID` env var is read-only.** Used at runtime when no flag or manifest value is set, but never written back to `webflow.json`. Setting `WEBFLOW_SITE_ID=X` in `.env` will not update the manifest — only `cloud init`, `cloud deploy`, and the manifest itself drive that.

> **GitHub Secrets:** use `WEBFLOW_API_TOKEN` for the token in every mode. Also set `WEBFLOW_SITE_ID` for site-attached projects and project apps that have already had their first deploy. Never commit `.env` files. If existing CI uses `WEBFLOW_SITE_API_TOKEN`, rename it — the deploy will still succeed but every run prints a deprecation warning until you switch.

### Configuration — webflow.json

```json
{
  "siteId": "site_abc123",
  "cloud": {
    "project_id": "proj_xyz",
    "environment_id": "env_xyz",
    "workspace_id": "ws_xyz",
    "framework": "nextjs",
    "skipMountPathCheck": false
  }
}
```

All `cloud.*` keys are **snake_case** (`project_id`, not `projectId`).

| Key | When set | Notes |
|---|---|---|
| `siteId` | Site-attached: at `cloud init`. Project app: after first deploy (CLI provisions a site). | Absent on project apps that have not been deployed yet. |
| `cloud.framework` | At `cloud init`. | Required for deploy resolution — see below. |
| `cloud.project_id` | After first deploy. | Auto-written. |
| `cloud.environment_id` | After first **project-app** deploy. | Auto-written by `createCloudApp`. |
| `cloud.workspace_id` | At project-app `cloud init` (`--new`). | Used by the first deploy to provision the site. |
| `cloud.skipMountPathCheck` | User-managed. | Equivalent to `--skip-mount-path-check`. |

The CLI also writes `cloud.deployment_type` (`"ssr" | "ssg" | "spa"`) and `cloud.entrypoint_path` into the **bundled** `webflow.json` at build time (these power the cosmic deployer's wrangler config). They're build-time outputs — do not strip them from the source `webflow.json` if you find them there; missing values silently break Next.js server-side deploys.

**`cloud.framework` resolution at deploy time:**

1. **`webflow.json` exists with `cloud.framework`** — used as-is. Invalid value exits with code 1.
2. **`webflow.json` exists but `cloud.framework` is absent** — throws: _"webflow.json exists but doesn't contain valid framework information under the 'cloud' key"_. Add `"cloud": { "framework": "nextjs" }` manually.
3. **No `webflow.json`** — auto-detected from `package.json`. CLI **writes a new `webflow.json`** on success.

Projects created via `cloud init` always land in case 1.

### Commands

#### webflow cloud list

```bash
webflow cloud list
```

Lists available scaffold templates. Check this before `cloud init --framework` to confirm valid scaffold IDs.

#### webflow cloud init

Bootstrap a new project locally. Two modes: **site-attached** and **app**.

**Site-attached** (connects to an existing Webflow site):

```bash
# Agent / non-TTY — always pass every flag
webflow cloud init \
  --no-input \
  --project-name my-app \
  --framework nextjs \
  --mount /app \
  --site-id site_abc123

# Human at a real terminal — interactive prompts will fill in any missing flag
webflow cloud init
```

Flags:

| Flag | Short | Description |
|---|---|---|
| `--project-name <name>` | `-n` | Project name. **Must be 3–39 characters** — the CLI rejects anything outside this range at init and at the first project-app deploy. |
| `--framework <framework>` | `-f` | Must match a scaffold ID from `cloud list`. Currently: `nextjs`, `astro`. |
| `--mount <path>` | `-m` | Mount path (default `/app` for site-attached, `/` for app). Substituted into config files at scaffold time. Not stored in `webflow.json`. |
| `--site-id <id>` | `-s` | Required in non-interactive site-attached mode. Mutually exclusive with `--workspace-id`. |
| `--workspace-id <id>` | `-w` | Skips the workspace picker for `--new` (app mode). Mutually exclusive with `--site-id`. |
| `--new` | — | Project-app mode (no site). |
| `--no-input` | — | CI mode. Requires `--project-name` and `--framework`. Without `--new`, defaults to app behavior. |

Credential resolution for `--no-input` site-attached: `--site-id` flag → `siteId` in `webflow.json` → `WEBFLOW_SITE_ID` env var → error.

After scaffolding a site-attached project, the CLI automatically runs a **DevLink sync**.

**Project app** (no site attachment):

```bash
# Agent / non-TTY — always pass --workspace-id to skip the workspace picker
webflow cloud init --new --no-input \
  --project-name my-app \
  --framework nextjs \
  --workspace-id ws_abc123

# Human at a real terminal — prompts for workspace if not passed
webflow cloud init --new
```

> If the token sees multiple workspaces and the agent doesn't have a workspace ID, ask the user to run `webflow cloud deploy` interactively from inside their project — the preflight prompt picks a workspace and writes `cloud.workspace_id` to `webflow.json` for subsequent agent-driven runs. The workspace ID is not exposed in the Webflow dashboard UI, so the interactive CLI run is the only practical way to discover it.

| | Site-attached | Project app (`--new`) |
|---|---|---|
| OAuth / site selection | Required at init | Skipped (workspace selection instead) |
| `WEBFLOW_SITE_ID` in `.env` | Written at init | Written **after first deploy** only |
| `WEBFLOW_API_TOKEN` in `.env` | Written | Written |
| `cloud.workspace_id` in `webflow.json` | Not set | Set at init (used by first deploy) |
| Scaffold | `astro`, `nextjs` | `astro`, `nextjs` |
| Mount path | Configurable (default `/app`) | Always `/` |
| DevLink sync | Runs after init | Skipped |

**Workspace selection (project-app mode only):** if `--workspace-id` is **not** passed, the CLI calls `GET /v2/workspaces` to enumerate workspaces the token has access to. Single workspace is auto-selected; multiple workspaces trigger an interactive picker. With `--workspace-id` the API roundtrip is skipped — the CLI trusts the flag and surfaces a 404 later via `createCloudApp` if it's invalid. The chosen ID is persisted as `cloud.workspace_id` in `webflow.json`.

**Agent caveat:** if the user's token sees more than one workspace and the agent can't pass `--workspace-id`, the picker fires and hangs in non-TTY contexts. The workspace ID is not visible in the Webflow dashboard UI, so the recovery is: **ask the user to run `webflow cloud deploy` interactively once from inside their project.** The preflight prompt picks the workspace, completes a first deploy, and writes `cloud.workspace_id` (plus `siteId`, `project_id`, `environment_id`) to `webflow.json`. The agent can then read the workspace ID from the manifest and pass `--workspace-id` (or `--site-id`, now that the site exists) on subsequent runs. To target a different workspace later, delete `cloud.workspace_id` and have the user repeat the interactive deploy.

#### webflow cloud create (deprecated)

`webflow cloud create <name>` still works but **emits a deprecation warning** and will be removed in a future major release. It's hardcoded to `/app` mount in site-attached mode and offers a strict subset of `cloud init`. Always prefer `cloud init` (or `cloud init --new` for app mode).

#### webflow cloud deploy

**Preflight phase: identity resolution.** Before any backend call, `cloud deploy` runs a preflight step that resolves whether this is a site-attached deploy or a project-app first deploy. Resolution order (first match wins):

| # | Source | Result |
|---|---|---|
| 1 | `--site-id <id>` flag | Site-attached, overrides manifest |
| 2 | `--workspace-id <id>` flag | Project-app first deploy, overrides manifest. Mutually exclusive with `--site-id` |
| 3 | `manifest.siteId` (from `webflow.json`) | Site-attached |
| 4 | `manifest.cloud.workspace_id` | Project-app first deploy |
| 5 | `WEBFLOW_SITE_ID` env var | Site-attached (used at runtime only; not persisted back to `webflow.json`) |
| 6 | Interactive picker (no `--no-input`) | Choose: create a new app / attach to existing site / cancel |
| 7 | No match + `--no-input` | Hard error listing required flags |

This preflight phase exists to prevent the project-app deploy path from running and provisioning a Cloud app before identity is locked in — earlier versions could orphan a new Webflow site if any later step failed.

> **Pass `--site-id` or `--workspace-id` explicitly whenever you can.** It defends against half-written manifests and removes the dependence on whatever state `cloud init` happened to leave behind. If the user wants site-attached, pass `--site-id`. For project-app first deploy, pass `--workspace-id`.

**Project-app first deploy** (triggered by `--workspace-id` flag or `manifest.cloud.workspace_id`) calls `POST /cosmic/workspaces/:workspace_id/cloudApps` to atomically create a site, project, and environment. On success it writes `siteId`, `cloud.project_id`, and `cloud.environment_id` into `webflow.json`, writes `WEBFLOW_SITE_ID` into `.env`, and forces `--skip-mount-path-check` for that one deploy. Subsequent deploys behave like normal site-attached deploys.

If `--project-name` is omitted on the first project-app deploy, the CLI uses the **cwd folder name** (when 3–39 chars) and falls back to `"Cloud App"`. Provide `--project-name` explicitly in CI to avoid surprises.

**Uninitialized projects** (no `siteId`, no `workspace_id`, no flag): the CLI prompts the user to create a new project app, attach to an existing site, or cancel. With `--no-input` it hard-errors listing the required flags. Agents running with `--no-input` must always supply `--site-id` or `--workspace-id` on the first deploy of an uninitialized project.

There are two deployment approaches. **GitHub-linked deployment is recommended** — it requires no CI configuration. After a one-time dashboard setup (which the CLI can't do), every push to the connected branch triggers a deploy.

**Option 1 (recommended): GitHub-linked deployment**

Once a one-time dashboard setup is done, every push to the connected branch triggers a deploy — no CLI commands, no workflow file. **The setup is dashboard-only — the CLI cannot reach this state on its own.** Pushing a repo to GitHub does not, by itself, enable push-to-deploy.

1. Push the project to GitHub (the user needs at least one commit pushed)
2. **Tell the user to open the Webflow dashboard** → their Cloud project → **Settings** → **Git** and connect their GitHub account if not already connected
3. Select the repository, then the branch to deploy from (e.g. `main`)
4. Confirm — the dashboard runs an initial deploy automatically to verify the connection
5. From that point on: `git push` to the connected branch = deploy

Steps 2–4 cannot be scripted. If the user wants push-to-deploy, they have to click through the dashboard once. After that, the agent's job for this project is essentially done — future deploys happen on push.

> When suggesting a deployment setup to a user, always lead with this option. Only suggest GitHub Actions if the user needs custom pre/post steps, secrets injection, or multi-environment logic that the native GitHub integration does not cover.

**Option 2: GitHub Actions (manual CI/CD)**

Use when you need custom build steps, environment-specific secrets, or deploy gates not supported by the native GitHub integration. See the [GitHub Actions example](#github-actions-cicd-pipeline) in the Examples section.

**Option 3: Local / manual deploy**

For development and one-off deploys:

```bash
webflow cloud deploy \
  --no-input \
  --mount / \
  --environment main \
  --skip-mount-path-check \
  --skip-update-check
```

All `cloud deploy` flags:

| Flag | Short | Description |
|---|---|---|
| `--no-input` | — | CI mode. Disables most prompts but **not** the project-select prompt — see callout below. |
| `--mount <path>` | `-m` | Mount path. **Always required with `--no-input`.** Not auto-read from `webflow.json`. |
| `--environment <env>` | `-e` | Environment name. Creates if it does not exist. Must be passed with `--mount`. |
| `--project-name <name>` | `-n` | Required on first deploy with `--no-input` when no `cloud.project_id` in `webflow.json`. **Must be 3–39 characters** for project-app first deploy. |
| `--site-id <id>` | `-s` | **New.** Webflow site ID for site-attached deploys. Overrides `siteId` in `webflow.json`. Mutually exclusive with `--workspace-id`. Use this to recover from a half-written manifest without editing JSON. |
| `--workspace-id <id>` | `-w` | Workspace ID for project-app first deploys. Overrides `cloud.workspace_id` in `webflow.json`. Mutually exclusive with `--site-id`. |
| `--project-id <id>` | `-p` | **New.** Cloud project ID. Skips the app picker. Overrides `cloud.project_id` in `webflow.json`. |
| `--framework <fw>` | `-f` | **New.** Override framework detection. Must be `nextjs` or `astro`. Writes the value back into `webflow.json`. Use when auto-detection from `package.json` is unreliable (monorepos, missing dependencies, etc.). |
| `--directory <path>` | `-d` | Project directory (default: cwd). Use for monorepos. |
| `--description <text>` | — | Project description for the first deploy. |
| `--skip-mount-path-check` | — | Skip domain manifest validation. Required in CI. Can also be set in `webflow.json` as `cloud.skipMountPathCheck: true`. |
| `--auto-publish` | — | Publish the Webflow **site** to sync mount path routing. Does not affect app deployment. |
| `--skip-update-check` | — | Skip @webflow package update check. |

> **Agents: pass `--mount` AND `--environment` together, every time.** The deploy prompts (select existing project, name a new project, pick an environment) are gated on whether `--mount` and `--environment` are *both* set — not on `--no-input`. Pass `--no-input` without both and the project-select prompt still fires and hangs in non-TTY contexts. The minimum agent-safe deploy flag set is `--no-input --mount <path> --environment <env> --site-id <id>` (or `--workspace-id <id>` for project-app first deploy), plus `--project-name` whenever `cloud.project_id` is absent from `webflow.json`.

### Frameworks

| Framework | Init scaffold | Deploy support | Detected via package |
|---|---|---|---|
| `nextjs` | ✓ | ✓ | `@opennextjs/cloudflare` |
| `astro` | ✓ | ✓ | `@astrojs/cloudflare` |

Any other value in `cloud.framework` causes `cloud deploy` to exit with code 1.

> **Scaffolds are fetched from GitHub at init time.** The CLI downloads scaffold tarballs from `Webflow-Examples/hello-world-{astro,nextjs}*` (pinned to the `v1` branch). `cloud init` therefore requires network access to `github.com`. Old CLI installs keep working because the registry pins a `vN` branch per scaffold-contract version.

### Global flags

| Flag | Description |
|---|---|
| `--no-input` | Disable all interactive prompts. Required for CI/automation. |
| `--manifest <path>` | Custom path to `webflow.json`. Use for monorepos. |
| `--skip-update-check` | Skip @webflow package update check. Alternatively, set `WEBFLOW_SKIP_UPDATE_CHECKS=true`. |

## Output

After a successful `cloud deploy`, the CLI prints two pieces of output.

**1. Deployment dashboard URL** — always present on success:

```
https://webflow.com/dashboard/sites/{siteId}/webflow-cloud/projects/{projectId}/environments/{environmentId}/deployments/{deploymentId}
```

Always show this to the user. From here they can view build logs, deployment status, history, and environment settings.

**2. Live app URL** — conditional:

```
🌐 Your cloud app will soon be available at:
   https://{your-site}.webflow.io/{mount-path}
```

If a real URL is printed, show it to the user as the live app link. The domain is their Webflow site's domain and the path is whatever `--mount` value was used at deploy time (e.g. `/`, `/app`, or any other user-chosen path).

If the output instead reads `No domains found with the correct mount path configuration yet.`, do not show a live URL — point the user to the dashboard deployment link above to check status and configure their domain.

**Do not** fetch or curl either URL to verify the deploy — just return what the CLI printed.

## Examples

### Full workflow: scaffold → GitHub → dashboard connection → push-to-deploy (recommended)

The CLI handles steps 1 and 2. **Step 3 must happen in the Webflow dashboard — the CLI cannot do it.** Without step 3, pushing to GitHub does not deploy.

```bash
# 1. Scaffold locally (CLI)
webflow cloud init --new --no-input \
  --project-name my-app \
  --framework nextjs \
  --workspace-id ws_abc123

# 2. Push to GitHub (CLI / git)
git init && git add . && git commit -m "init"
git remote add origin https://github.com/your-org/my-app.git
git push -u origin main
```

```
# 3. Connect in the Webflow dashboard (manual, dashboard-only):
#    a. Open the Cloud project → Settings → Git
#    b. Connect the GitHub account (if not already), pick the repo
#    c. Pick the branch to deploy from (e.g. main)
#    d. Confirm — the dashboard runs an initial deploy to verify the wiring
#
# After step 3, every push to the selected branch triggers a deploy automatically.
# Skip step 3 and push-to-deploy is NOT active — deploys must be manual or CI-driven.
```

### Project-app workflow: init → first deploy provisions site

```bash
# Agent-safe init — assumes the token sees a single workspace.
# If the token sees multiple workspaces, ask the user to run this command locally first.
webflow cloud init --new --no-input \
  --project-name my-app \
  --framework astro

# First deploy creates site + project + environment on the backend,
# writes siteId / project_id / environment_id back to webflow.json,
# and writes WEBFLOW_SITE_ID to .env. Subsequent deploys are normal.
cd my-app
webflow cloud deploy --no-input \
  --project-name my-app \
  --mount / \
  --environment main \
  --skip-update-check
```

### Scaffold a site-attached Astro app locally

```bash
webflow cloud init \
  --no-input \
  --project-name my-site-app \
  --framework astro \
  --mount /app \
  --site-id site_abc123
```

### GitHub Actions CI/CD pipeline (when custom steps are needed)

```yaml
name: Deploy to Webflow Cloud

on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20

      - name: Install Webflow CLI
        run: npm install -g @webflow/webflow-cli@latest

      - name: Deploy
        run: |
          webflow cloud deploy \
            --no-input \
            --mount / \
            --environment main \
            --skip-mount-path-check \
            --skip-update-check
        env:
          WEBFLOW_API_TOKEN: ${{ secrets.WEBFLOW_API_TOKEN }}
          WEBFLOW_SITE_ID: ${{ secrets.WEBFLOW_SITE_ID }}
          # For project apps pre-first-deploy, omit WEBFLOW_SITE_ID
```

### Manual deploy (local / one-off)

```bash
webflow cloud deploy \
  --no-input \
  --project-name my-app \
  --mount / \
  --environment main \
  --skip-mount-path-check \
  --skip-update-check
```

### Manual deploy with error handling

```bash
webflow cloud deploy --no-input --mount / --skip-mount-path-check --skip-update-check
if [ $? -ne 0 ]; then
  echo "Deploy failed. Log file:"
  webflow log
  exit 1
fi
```

## Guidelines

### Init vs Deploy in CI

- **`cloud init` is for local, one-time project setup — never run it in CI.** Site-attached mode opens a browser window; there is no headless OAuth path. Run `cloud init` once locally, commit the result, then use `cloud deploy` in CI.

### Mount path

- `--mount` is **always required** with `--no-input`. The CLI does not read a saved mount path from `webflow.json`.
- **Never assume a default.** Assuming `/` or `/app` will cause `ENVIRONMENT_MOUNT_MISMATCH` if the project uses a different path. Check the Webflow dashboard under the project's environment settings.

### Do not add confirmation gates

When `--no-input` is set, do not add a human confirmation step before `cloud deploy`. It blocks unattended CI runs and is unnecessary — the CLI has no built-in prompt to bypass.

### Package manager

The CLI uses **npm only** regardless of lock files present. pnpm and yarn lock files are ignored — those projects silently receive `npm install`.

### Build-time file management

During `cloud deploy`, the CLI temporarily replaces two files and restores them on success or failure:
- **Framework config** (`next.config.ts` / `astro.config.mjs`) — renamed to `clouduser.*`, replaced with CLI template, then restored.
- **`wrangler.json`** — replaced with CLI template (original saved to `clouduser.wrangler.json`), then restored. Do not modify `wrangler.json` during a deploy.

If Astro is the framework and `@astrojs/react` is absent, the CLI runs `npm install --save @astrojs/react` without prompting.

### Cloudflare bindings (D1 / KV / R2)

The CLI merges `wrangler.json` bindings at build time. Limits: **max 5 of each type**. For D1, set `migrations_dir` in the binding — the CLI copies migration files automatically.

### Error handling

- The CLI exits with **code 1 on every error**. Check the exit code — do not match on emoji or text patterns in stdout.
- Use `webflow log` after any failure to get the full error trace.

### Deploy versioning

| Situation | Version tag sent |
|---|---|
| Clean working tree | `git@{40-char-hash}` |
| Uncommitted changes | `git@{40-char-hash}+dirty` |
| Not in a git repo | `noversion@{ISO-timestamp}` |

Commit all changes before deploying to production.

### Known limitations

- No `cloud status` / `cloud logs` — use the Webflow dashboard.
- No `cloud env` commands — runtime env vars managed via dashboard only.
- No `--dry-run` — build validation always triggers a real deployment.
- No `--json` / structured output — deploy URL and project ID must be parsed from stdout.
- No `cloud rollback`.
- **100 MB build size limit** — builds exceeding 104,857,600 bytes fail at upload.

## Troubleshooting

### `--project-name cannot be empty` (or any required-flag error) on `cloud init`

The CLI gates its interactive prompts on `process.stdin.isTTY`. Agents invoke the CLI from a subprocess that does **not** have a TTY, so the prompt block is skipped entirely and the bare validation fires for the first missing required value.

**Fix:** pass every required flag explicitly. For `cloud init`:

```bash
webflow cloud init --new --no-input --project-name my-app --framework astro
# or, site-attached:
webflow cloud init --no-input --project-name my-app --framework astro --mount /app --site-id site_abc123
```

Passing `--no-input` is not strictly required for the prompts to be skipped — the absent TTY already does that — but it makes the contract explicit and matches the Required-flag matrix at the top of this skill.

### `cloud init --new` hangs forever / never returns

Workspace selection in project-app mode prompts unconditionally when the token sees more than one workspace. Pass `--workspace-id` to skip the picker; without it, in a non-TTY context the CLI hangs at the prompt.

**Fix:** pass `--workspace-id <id>` to `cloud init --new`. The workspace ID is not visible in the Webflow dashboard UI, so when the agent doesn't have one, ask the user to run `webflow cloud deploy` interactively from inside an existing project. The preflight prompt picks a workspace and writes `cloud.workspace_id` to `webflow.json` — the agent can then read it and pass `--workspace-id` on future runs. Single-workspace tokens are not affected — selection is auto-skipped.

### Deploy provisioned a new site when I expected site-attached

**Symptom:** user wanted to deploy to an existing Webflow site, but `cloud deploy` printed `Creating Cloud app...` / `Cloud app created: <name>` and the live URL came out as `<name>-<hash>.webflow.io` (a freshly minted site) instead of the user's intended site.

**Cause:** `webflow.json` was in the project-app init state — `cloud.workspace_id` set, `siteId` absent — typically because the project was previously scaffolded with `cloud init --new`. The preflight phase prefers explicit flags but still falls through to the manifest when none are passed.

**Prevention (primary fix):** pass `--site-id <existing-site-id>` to `cloud deploy`. The preflight phase resolves identity from flags first, so this overrides whatever's in `webflow.json` and routes the deploy to the intended Webflow site. The skill should always pass `--site-id` when site-attached intent is known.

```bash
webflow cloud deploy --no-input \
  --site-id site_abc123 \
  --mount /app --environment main \
  --skip-mount-path-check --skip-update-check
```

**Recovery if the new site was already created:**

- **Keep the new project-app site** the deploy just created — do nothing; subsequent deploys will go to the same site (or pass `--site-id` of the new site if there's any ambiguity).
- **Re-target an existing Webflow site instead.** The auto-provisioned site cannot be re-bound to an existing site after creation. Options:
  1. Delete the project app (and its auto-provisioned site) from the Webflow dashboard.
  2. Either edit `webflow.json` (remove `cloud.workspace_id`, `cloud.project_id`, `cloud.environment_id`, `siteId`) and re-run `cloud init` with `--site-id <existing-site-id>`, or skip the manifest edit and run `cloud deploy --site-id <existing-site-id>` directly — the preflight will treat this as a fresh site-attached deploy.

### Auth error on deploy

Run `webflow auth login` and complete the browser flow. The CLI writes a new `WEBFLOW_API_TOKEN` to `.env`. Retry the deploy after login.

In CI, browser auth is not possible — an auth error means `WEBFLOW_API_TOKEN` is missing or expired in your secrets. Fix the secret, do not attempt `webflow auth login`. If the CI uses the legacy `WEBFLOW_SITE_API_TOKEN`, the deploy will still work but the run log shows a deprecation warning; rename the secret to `WEBFLOW_API_TOKEN` to clear it.

### Deploying to a different workspace

For **project apps (`--new`)**: pass `--workspace-id <new-id>` to `cloud init` or `cloud deploy` to override `cloud.workspace_id` in `webflow.json`. Alternatively, delete `cloud.workspace_id` from `webflow.json` and re-run init (or interactive deploy on an existing project) to re-seed it.

For **site-attached projects**, workspace context is implicit in the auth token. Re-run `webflow auth login` and select the target workspace in the browser; the new token replaces the old one in `.env`.

### First project-app deploy fails with `missing_scopes`

The token saved to `.env` doesn't include the scopes needed to create a Cloud app. Re-run `webflow auth login` and re-approve the scopes, then retry the deploy.

### First project-app deploy fails: "your workspace has reached its app limit"

The selected workspace (`cloud.workspace_id`) is at its app cap. Either upgrade the workspace plan or delete unused apps in the Webflow dashboard, then retry.

### First project-app deploy fails with workspace-not-found / 404

The workspace ID (from `--workspace-id` flag, or `cloud.workspace_id` in `webflow.json`) no longer resolves — workspace deleted, or token has no access. The CLI doesn't validate the flag up front: it trusts the value and surfaces the 404 from `createCloudApp`. Fixes:

- Pass `--workspace-id <correct-id>` to `cloud init` or `cloud deploy`.
- Or delete `cloud.workspace_id` from `webflow.json` and either re-run `cloud init --new --workspace-id <id>` (empty directory) or run `webflow cloud deploy` interactively (existing project) so the preflight prompt re-seeds the workspace ID.

### `ENVIRONMENT_MOUNT_MISMATCH`

The `--mount` value does not match the path registered for that environment. Check the Webflow dashboard under the project's environment settings for the correct mount path and pass it explicitly.

### Framework cannot be detected / explicit framework required

A `webflow.json` that has a `cloud` block but no `framework` key does not throw — the CLI falls back to detecting from `package.json`. The legacy error _"webflow.json exists but doesn't contain valid framework information"_ only fires when `cloud.framework` is explicitly set to an unsupported value.

If framework detection still fails (monorepo, missing framework dependency, ambiguous setup), fix it with the new `--framework` flag on `cloud deploy`:

```bash
webflow cloud deploy --no-input --framework nextjs --mount /app --environment main ...
```

This writes `cloud.framework` back into `webflow.json` so subsequent deploys don't need the flag. Or just edit the manifest manually:

```json
{
  "cloud": {
    "framework": "nextjs"
  }
}
```

Valid values: `nextjs`, `astro`. Any other value exits with code 1.

### Build fails, need full trace

```bash
webflow log
```

Prints the path to the latest log file with the full error trace.