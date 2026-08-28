---
title: "Webflow Skill: Review Comments"
tags: [webflow, mcp, skill, review-comments]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Review Comments

> **Имя скилла:** `review-comments`  
> **Локальный путь:** `/root/.agent/skills/review-comments/SKILL.md`

---

Review open comment threads on a Webflow site and triage each one.

**Input:** `$ARGUMENTS` — a site name (e.g. "Workhaus"), site ID (e.g. `6808fd4eff835ee3af009d6f`), or either with the `-reply` flag (e.g. `Workhaus -reply`).

**Flags:**
- `-reply` — in addition to writing the report, post a bot reply to each non-open thread. Without this flag, the skill runs in report-only mode (read-only).

Parse `$ARGUMENTS` at the start: strip `-reply` from the input to get the site identifier, and set `replyMode = true` if `-reply` was present, `false` otherwise.

---

## Step 1 — Resolve the site

### If the site identifier is empty or blank — cross-site comment survey

1. Call `data_sites_tool > list_sites` to get all sites. Page through until all are collected.
2. For each site, call `data_comments_tool > list_comment_threads` with `isResolved: false` and `limit: 100`. Page through until all unresolved threads are collected. If the API does not support `isResolved` filtering, fetch all threads and filter client-side to `isResolved === false`. Process sites in batches of 20 (batch multiple actions in a single tool call). After each batch completes, log a progress line: `Batch {N}/{total} done (sites {start}–{end}): {summary of findings, e.g. "all 0 threads" or "SiteName has X threads, rest 0"}.`
3. For each site, compute:
   - `unresolvedCount` = total unresolved threads
   - `newestDate` = the maximum `lastUpdated` value across all unresolved threads for that site (ISO → human-readable date, e.g. "Apr 3, 2026"). If no threads, show `—`.
   - `oldestDate` = the minimum `lastUpdated` value across all unresolved threads for that site (ISO → human-readable date). If no threads, show `—`.
4. Sort sites by `unresolvedCount` descending. Take the top 10.
5. Above the table, show a heading line: `### Checked {totalSiteCount} sites — {sitesWithUnresolved} have unresolved comments.`
6. Display a table in this format (link just the site name to `https://webflow.com/design/{siteId}`):

```
| Site | Unresolved Comments | Newest / Oldest |
|------|---------------------|-----------------|
| [Site Name](https://webflow.com/design/{siteId}) ({siteId}) | {N} | {newestDate} / {oldestDate} |
```

7. After the table, tell the user: "Run `/webflow-mcp:review-comments <site name or ID>` to review a specific site."
8. Write the survey output to a file:
   - Ensure `comment-reviews/` exists (create with `mkdir comment-reviews` if not).
   - Filename: `comment-reviews/triage-report-{YYYY-MM-DD-HH-MM}.md` using the current local time (zero-padded).
   - File contents: a bold H1 title `# **Webflow Comment Review**`, then a blank line, then an H3 line `### Report created on: {human-readable date, time, and timezone, e.g. "April 16, 2026 at 10:39 AM PDT"}`, then a blank line, then the H3 heading line (`### Checked …`) and the full table from steps 5–6 above, in markdown.
   - Log the path after writing, e.g. `Report written to comment-reviews/triage-report-2026-04-16-14-30.md`.
9. **Stop** — do not proceed to Step 2.

### If the site identifier looks like a Webflow site ID (24-char hex), use it directly.

### Otherwise call `data_sites_tool > list_sites` and find the site whose `displayName` matches the identifier (case-insensitive). If no match, tell the user and stop.

---

## Step 2 — Fetch all open threads

**Always make a fresh API call here — never reuse thread data from earlier in the conversation. The user may have added or resolved comments since the last run.**

Call `data_comments_tool > list_comment_threads` with `isResolved: false` and `limit: 100`. Page through results until all threads are collected.

Log: `Site: {displayName}` and `Found {N} open thread(s)`.

---

## Step 3 — Build page-level element map

From the already-fetched thread list, build a frequency map of `elementId.element → Set<pageId>` across all threads. Any `elementId.element` that appears on **2 or more distinct pages** is almost certainly the page root/body element (a real element ID would be page-scoped; only shared structural roots repeat across pages).

No API calls needed — this is a local computation on the thread data.

---

## Step 4 — Triage each thread

For each thread:

### 4a — Fetch replies

Call `data_comments_tool > list_comment_replies` for this thread.

### 4b — Dedup check

Look for replies whose `content` includes the string `— 🤖 Comment Review Agent`.

If found, note the most recent one (`lastAgentReply`). If no human reply exists with a `createdOn` after `lastAgentReply.createdOn`, **skip this thread** (increment skipped count, continue to next thread).

### 4c — Compute element context

- `elementId` = `thread.elementId?.element`
- `isPageLevel` = `elementId` appears on 2 or more distinct `pageId`s in the frequency map from Step 3

### 4d — Classify the thread

Use the following criteria:

**noise** — No real design or engineering value:
- Test/placeholder text ("hello world", "testing", "asdf", random characters)
- Casual reactions with no ask ("looks nice", "nice!", "hey hey")
- Duplicate sentiments that add nothing

**stale** — Real concern, but old and likely handled:
- Substantive comments older than 14 days with no replies and no follow-up
- Questions that are probably resolved ("beta for how long?", "is this good contrast?")
- Action items that normal review would have caught

**open** — Real, actionable concern needing attention:
- Explicit tasks ("Should be sentence case", "fix image", "Look at name wrt L10N")
- Design decisions still required
- Specific and concrete concerns

**page-level** — Comment is on the page root, not a specific element:
- Use this when `isPageLevel` is true
- The comment is not anchored to any specific element — it may be intentional or may be an orphan from a deleted element

### 4e — Compose reply

Always compose the reply text (it appears in the report regardless of mode):

- **noise**: one sentence confirming it's safe to resolve. E.g. `"Looks like test text — safe to resolve."`
- **stale**: state the age in days, suggest resolving, invite reopen. E.g. `"This is 302 days old with no follow-up. Safe to resolve — reply here if it's still relevant."`
- **open**: no reply text — surface in report only.
- **page-level**: one sentence noting it's not attached to a specific element. E.g. `"This comment is on the page root rather than a specific element — it may be an orphan from a deleted element. Safe to resolve if no longer relevant."`

Append `\n\n— 🤖 Comment Review Agent` to every reply text.

### 4f — Post reply (only if `replyMode = true`)

If `replyMode` is `true` and verdict is not `open`, call `data_comments_tool > create_reply` with the composed reply content.

Log each thread as:
```
{VERDICT_EMOJI} {verdict}  "{preview (60 chars)}"
                {one-sentence classification reason}
                ↳ {reply posted | no reply — report only | skipped}
```

Verdict emojis: noise = 🗑, stale = 🕰, open = 🔴, page-level = 📄

---

## Step 5 — Write the report

After processing all threads:

1. Check whether a `comment-reviews/` directory exists at the top level of the working directory. If it does not exist, create it with `mkdir comment-reviews`.
2. Write a markdown report to `comment-reviews/{slugified-site-name}-comments-triage-report.md` (lowercase, hyphens, no special chars).

Report format:

```markdown
# Comment Review — [{siteName} ({siteId})](https://webflow.com/design/{siteId})

**Run:** {human-readable date and time}
**Mode:** {Report only | Report + replies posted}
**Threads:** {total} total | 🔴 {open} open | 🕰 {stale} stale | 📄 {page-level} page-level | 🗑 {noise} noise | ⏭ {skipped} skipped

---

## 🔴 Needs Attention ({count})

| Comment | Author | Age | Link |
|---------|--------|-----|------|
| "{first 80 chars of content}" | {author.name} | {age in days}d | [Open ↗]({thread.url}) |

## 🕰 Stale — Candidates to Resolve ({count})

| Comment | Author | Age | Suggested Reply | Link |
|---------|--------|-----|-----------------|------|
| "{first 80 chars of content}" | {author.name} | {age in days}d | {composed reply text, without the `— 🤖 Comment Review Agent` suffix} | [Open ↗]({thread.url}) |

## 📄 Page-level — Not Anchored to a Specific Element ({count})

| Comment | Author | Age | Suggested Reply | Link |
|---------|--------|-----|-----------------|------|
...

---

**🗑 Noise:** {count} thread(s) — {if replyMode: "replied to" | if report-only: "suggested replies in report"}. Safe to bulk-resolve.
```

Use `_None._` for any section with no entries.

Log a summary line and confirm the report path.