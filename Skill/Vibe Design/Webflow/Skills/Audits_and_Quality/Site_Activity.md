---
title: "Webflow Skill: Site Activity"
tags: [webflow, mcp, skill, site-activity]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Site Activity

> **Имя скилла:** `site-activity`  
> **Локальный путь:** `/root/.agent/skills/site-activity/SKILL.md`

---

# Site Activity

Query, analyze, and summarize Webflow site activity logs for enterprise sites. Provides natural-language querying of recent changes, filtered summaries by event type or user, and formatted reports for team sharing.

## Important Note

**ALWAYS use Webflow MCP tools for all operations:**
- Use Webflow MCP's `data_sites_tool` with action `list_sites` for listing available sites
- Use Webflow MCP's `data_sites_tool` with action `get_site` for detailed site information
- Use Webflow MCP's `data_enterprise_tool` with action `list_site_activity_logs` for retrieving activity log events
- Use Webflow MCP's `webflow_guide_tool` to get best practices before starting
- DO NOT use any other tools or methods for Webflow operations
- All tool calls must include the required `context` parameter (15-25 words, third-person perspective)

**Enterprise Only:** Activity logs are only available for sites on Enterprise hosting plans. If the tool returns an error, inform the user that this feature requires an Enterprise plan.

**Tool Parameters for `list_site_activity_logs`:**
- `site_id` (required): The site's unique identifier
- `limit` (optional): Maximum records to return (max 100)
- `offset` (optional): Pagination offset for fetching beyond the first page

## Instructions

### Phase 1: Site Selection & Context
1. **Identify target site**: If the user does not provide a site ID, use `data_sites_tool` with action `list_sites`. Each site in the response has `displayName`, `lastPublished`, and `lastUpdated`.

    **Sort order**:
    1. ⚠️ sites (unpublished changes) before ✅ sites (up to date)
    2. Within each group, most recently updated first (by `lastUpdated` descending)

    **Truncation**: Show the top **10** sites only. If there are more than 10 total, append a line `…and N more sites. Reply "show all" to see the rest.` below the list. When the user replies "show all" (or similar), re-present the full list in the same format.

    Present the list in this exact format:

    ```
    📋 Site Activity — Site Selection

    Available Enterprise Sites:

    1. <Site Name> ⚠️  — last published <short date>, updated <short date> (<N> days unpublished)
    2. <Site Name> ✅  — published & updated <short date>
    3. <Site Name> ⚠️  — never published, updated <short date>

    …and 4 more sites. Reply "show all" to see the rest.

    Which site would you like to review?
    ```

    Format rules:
    - Dates: abbreviated ("Mar 6", "Apr 14"). Add the year only if it isn't the current year.
    - Use ⚠️ when `lastUpdated > lastPublished` OR `lastPublished` is null; ✅ when `lastUpdated <= lastPublished`.
    - When `lastPublished == lastUpdated`, collapse the right-hand side to "published & updated <date>".
    - Omit the "…and N more sites" line when the workspace has 10 or fewer sites.
    - Do not omit the status flag or the dates — they are required for every site.
2. **Fetch selected-site details**: After the user selects a site (or when a site ID was provided up front), call `data_sites_tool` with action `get_site` **once, for the selected site only**, to retrieve fields not returned by `list_sites` — in particular:
    - Custom domains
    - Locale / localization settings
    - Any additional site metadata needed for the analysis

    `lastPublished` and `lastUpdated` are already known from step 1 (or from `get_site` if the user provided a site ID directly). Keep these in memory for the pre-publish filter in Phase 3.
3. **Infer intent from the prompt** (do not ask a follow-up question if the prompt is clear). Map the request to one of:
    - Recent activity summary ("what changed this week?")
    - Specific user's activity ("what did Sarah change?")
    - Specific activity type ("any CMS changes recently?")
    - Pre-publish review ("what's changed since last publish?")
    - General overview (default when the prompt is ambiguous)

    Only ask a clarifying question if the request is genuinely ambiguous (e.g., "show me activity" with no time window, user, or event type context).

### Phase 2: Fetch Activity Logs
4. **Fetch activity logs**: Use `list_site_activity_logs` with the site ID
    - Default to `limit: 100` (maximum per request) for comprehensive results
    - The API returns events in reverse chronological order (newest first)
5. **Handle pagination**: If the user needs older activity or the results suggest more data exists:
    - Use `offset` parameter to fetch additional pages
    - Combine results across pages for analysis
    - Warn the user if going back further than available data

### Phase 3: Analysis & Summarization
6. **Parse each activity log entry**: Each event contains:
    - `id`: Unique event identifier
    - `createdOn`: Timestamp (ISO 8601)
    - `lastUpdated`: Last update timestamp
    - `event`: Event type string (see Event Types below)
    - `user`: Object with `id` and `displayName` (absent for system events like backups)
    - `resourceOperation`: The operation performed (`CREATED`, `MODIFIED`, `DELETED`)
    - `resourceId`: ID of the affected resource (when applicable)
    - `resourceName`: Human-readable name of the affected resource
    - `payload`: Additional event-specific details (see Payload Details below)
7. **Categorize events** into human-readable groups (41 event types):

   **Page Changes:**
    - `page_dom_modified` — Page structure/element changes
    - `page_created` — New page creation
    - `page_deleted` — Page deletion
    - `page_duplicated` — Page duplication
    - `page_renamed` — Page rename
    - `page_settings_modified` — Page settings updates (SEO, slug, etc.)
    - `page_custom_code_modified` — Page-level custom code changes
    - `page_settings_custom_code_modified` — Page settings custom code changes

   **Style & Variable Changes:**
    - `styles_modified` — Style/class changes
    - `variable_modified` — Single variable change
    - `variables_modified` — Multiple variable changes

   **Component Changes:**
    - `symbols_modified` — Component/symbol created, modified, or deleted

   **Interactions:**
    - `ix2_modified_on_page` — Interaction changes on a page
    - `ix2_modified_on_component` — Interaction changes on a component
    - `ix2_modified_on_class` — Interaction changes on a class

   **CMS Changes:**
    - `cms_item` — Collection item created, modified, or deleted
    - `cms_collection` — Collection schema created, modified, or deleted

   **Site Management:**
    - `site_published` — Site published
    - `site_unpublished` — Site unpublished
    - `site_custom_code_modified` — Site-level custom code changes
    - `backup_created` — Automatic or manual backup
    - `backup_restored` — Backup restored

   **Localization:**
    - `secondary_locale_page_content_modified` — Localized page content changed
    - `locale_added` — New locale added
    - `locale_removed` — Locale removed
    - `locale_enabled` — Locale enabled
    - `locale_disabled` — Locale disabled
    - `locale_display_name_updated` — Locale display name changed
    - `locale_subdirectory_updated` — Locale subdirectory changed
    - `locale_tag_updated` — Locale tag changed

   **Branches:**
    - `branch_created` — Branch created
    - `branch_merged` — Branch merged
    - `branch_deleted` — Branch deleted
    - `branch_review_created` — Branch review requested
    - `branch_review_approved` — Branch review approved
    - `branch_review_canceled` — Branch review canceled

   **Library:**
    - `library_shared` — Library shared with other sites
    - `library_unshared` — Library unshared
    - `library_installed` — Library installed from another site
    - `library_uninstalled` — Library uninstalled
    - `library_update_shared` — Library update published
    - `library_update_accepted` — Library update accepted

   Note: If an event type not listed above appears, categorize it as "Other" and display the raw `event` string.
8. **Apply filters** based on user's request:
    - By event category (e.g., only CMS changes)
    - By user (match on `user.displayName`)
    - By time window (filter `createdOn` timestamps client-side)
    - By resource (match on `resourceName`)
    - **Pre-publish review**: When the user wants to see changes since the last publish, use the site's `lastPublished` timestamp (from Phase 1) and filter to events where `createdOn > lastPublished`. If `lastPublished` is null (never published), all events qualify as unpublished.
9. **Generate insights** (include in the Highlights section of the report):
    - Most active user in the time period
    - Event type distribution (which category dominated)
    - Busiest day or hour
    - Single-user concentration (flag when one person made 40%+ of changes)
    - Unpublished changes (count of events where `createdOn > lastPublished`)

### Phase 4: Reporting
10. **Generate summary report** with these sections:
    - Time range covered and total event count
    - Breakdown by activity type
    - Breakdown by user
    - **Highlights** — call out patterns such as high-frequency changes to a single page/collection, multiple users editing the same resource, unpublished changes (since last publish), and system events vs. user-initiated changes
11. **Answer the user's specific question**: If the user asked something specific, lead with the direct answer before the structured report.
12. **Pick the detail level** from the prompt:
    - "counts only" / "how many" / "just numbers" → **Quick summary** (counts by category only)
    - default → **Standard report** (categorized events with user attribution — see Example 1)
    - "walk me through" / "show every change" / "timeline" → **Detailed report** (chronological per-event view with payload)
    - "share" / "export" / "for my team" / "summary to send" → **Shareable/Export report** (see Example 3)

    The detail-level switch is always surfaced as one of the follow-up options in step 13 so the user can request a different level.
13. **Always end every report with a follow-up options section.** This is required, not optional. Use the exact format below, tailoring the numbered options to what's relevant for the query just answered:

    ```
    ---

    Would you like to:
    1. Filter by a specific user
    2. Filter by activity type
    3. Fetch older activity (pagination)
    4. Switch to a quick summary (counts only) or a detailed view (per-event payloads)
    5. Export as markdown or JSON
    ```

    If the report was a shareable/export format (e.g., "summary I can share"), place this block **outside** the shareable content so the user can copy the report cleanly without the follow-up menu in it.

## Event Payload Details

Different event types include different payload fields:

**`page_dom_modified`:**
- `pageTitle`: Name of the modified page
- `pageId`: ID of the modified page
- `count`: Number of modifications in this batch
- `branchId`/`branchName`: Branch context (null if main)

**`cms_item`:**
- `cmsCollectionId`: ID of the parent collection
- `cmsCollectionName`: Name of the parent collection
- `count`: Number of items affected
- `name`: Locale name (e.g., "English", "Spanish")

**`styles_modified`:**
- `selector`: CSS selector (if applicable)
- `variant`: Breakpoint/pseudo-class variant string
- `parentChain`: Array of parent style names (combo class chain)
- `type`: Style type (e.g., "class")
- `branchId`/`branchName`: Branch context

**`symbols_modified`:**
- `branchId`/`branchName`: Branch context

**`page_settings_modified`:**
- `pageTitle`: Name of the modified page
- `branchId`/`branchName`: Branch context

**`backup_created`:**
- No payload; `resourceName` indicates backup type (e.g., "Automatic backup", "Maintenance backup")
- No `user` field (system-initiated)

## Examples

**User prompt:**
```
What happened on my site this week?
```

**Step 1: Site Selection**
```
📋 Site Activity — Site Selection

Available Enterprise Sites:

1. Acme Corp Website ⚠️  — last published Apr 14, updated Apr 16 (2 days unpublished)
2. Acme Blog ✅  — published & updated Apr 10

Which site would you like to review?
```

**Step 2: Activity Summary**
```
📋 Site Activity: Acme Corp Website
   April 10–16, 2026 (93 events)

**93 events this week from 3 team members. 28 are unpublished since the last publish on Apr 14.**

---

## Activity Breakdown

📄 Page modifications       34 events
🎨 Class changes            22 events
📝 CMS updates              18 events
🧩 Component changes         8 events
🔤 Variable changes          5 events
🚀 Publishes                 3 events
💾 Backups                   2 events
🌿 Branch activity           1 event

---

## Activity by User

**Sarah Chen** — 42 events
└── Page modifications (18), Class changes (15), CMS updates (9)

**Alex Kim** — 31 events
└── CMS updates (9), Page modifications (12), Component changes (8), Variables (2)

**Jordan Lee** — 17 events
└── Class changes (7), Page modifications (4), Publishes (3), Backups (2), Branch (1)

**System** — 3 events
└── Backups (auto)

---

## Highlights

- ⚠️ **Unpublished changes**: 28 events since last publish (Apr 14)
- 📊 **Busiest day**: April 15 (41 events)
- 👤 **Most active**: Sarah Chen (45% of all activity)
- 🧩 8 component changes by Alex Kim — may affect multiple pages

---

Would you like to:
1. Filter by a specific user
2. Filter by activity type
3. See details for unpublished changes only
4. Switch to a quick summary (counts only) or detailed view (per-event payloads)
5. Fetch older activity
```

**User prompt:**
```
Show me CMS changes on site 6924868ede9d3fbbc3195eb0
```

**Response:**
```
📋 CMS Activity: Acme Corp Website
   April 10–16, 2026 (18 CMS events)

**18 CMS events from 2 users over 5 days. 3 changes are unpublished.**

---

## CMS Breakdown

📝 Items modified       11 events
➕ Items created         5 events
📚 Collection changes    2 events

---

## Activity by User

**Sarah Chen** — 10 events
└── 2 items created, 7 items modified, 1 collection modified

**Alex Kim** — 8 events
└── 3 items created, 4 items modified, 1 bulk publish

---

## Highlights

- ⚠️ **Unpublished**: 3 CMS changes since last publish (Apr 14)
- 📊 **Busiest day**: April 15 (8 events)
- 📚 **Schema changes**: 2 collection edits this week (review carefully before publish)

---

Would you like to:
1. Filter to a specific collection
2. Filter by user (Sarah or Alex)
3. See only the unpublished CMS changes
4. Switch to a timeline view (chronological per-event) or counts only
5. Fetch older CMS activity
```

**User prompt:**
```
Give me a weekly summary I can share with my team for Acme Corp Website
```

(Naming the site inline skips Phase 1 step 1. If the user doesn't name a site, run the site-selection list first before producing this report.)

**Response:**
```
📋 Weekly Site Activity Report
   Acme Corp Website — Week of April 10–16, 2026

---

### Overview
- **93 total changes** across 3 team members
- **3 publishes** (Apr 10, Apr 12, Apr 14)
- **28 unpublished changes** pending review
- **Last publish:** April 14 at 18:30 UTC

### What Changed
- 34 page modifications across 8 pages
- 22 class/style updates
- 18 CMS content changes (5 new items, 11 edits, 2 schema changes)
- 8 component updates
- 5 variable changes

### Team Activity
| Team Member  | Changes | Top Activity                  |
|-------------|---------|-------------------------------|
| Sarah Chen  | 42      | Page edits, style updates     |
| Alex Kim    | 31      | CMS content, components       |
| Jordan Lee  | 17      | Styles, publishing, backups   |

### Action Items
- ⚠️ 28 changes are unpublished — consider reviewing and publishing
- 🧩 8 component changes may affect shared layouts — verify before publish
- 💾 Last backup: April 14 — consider creating a fresh backup

---
Generated from Webflow Site Activity Log
```

Would you like to:
1. Filter to a specific user's changes
2. Break down unpublished changes in detail
3. Regenerate with a different date range
4. Switch to a quick summary (counts only) or detailed per-event view
5. Export as JSON instead of markdown

## Guidelines

### Enterprise-Only Access

**Plan Requirement:**
- `list_site_activity_logs` is available only on Enterprise hosting plans
- If the API returns a permissions error, clearly inform the user:
  ```
  ⚠️ Site Activity Logs require an Enterprise hosting plan.
  This site does not appear to have Enterprise access.
  ```
- Do not retry on permissions errors — the issue is plan-level, not transient

### API Constraints

**Pagination:**
- Maximum 100 events per request
- Use `offset` to paginate: first call offset=0, second call offset=100, etc.
- 100 events typically covers approximately one week for an active enterprise site
- No native date filtering — all filtering must be done client-side after fetching

**When to paginate:**
- User asks for more than one week of activity
- User needs a complete picture and first page returns exactly 100 events
- Always tell the user how much data you have: "Showing the last 93 events (Apr 10–16)"

**Rate awareness:**
- Avoid unnecessary pagination — fetch only what is needed to answer the question
- If user asks "any publishes recently?" — 100 events is likely enough
- If user asks "full month of activity" — explain the limitation and paginate up to 300 events maximum

### Error Handling

**Common errors:**
- **403 / Permission denied**: Enterprise plan required — inform user clearly
- **404 / Site not found**: Verify site ID, offer to list available sites
- **Empty results**: Site may have no recent activity — confirm with user and check site details

**Graceful degradation:**
- If site details fetch fails, still attempt activity logs
- If pagination fails mid-way, report what was successfully fetched
- Always show partial results rather than nothing