---
title: "Webflow Skill: Safe Publish"
tags: [webflow, mcp, skill, safe-publish]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Safe Publish

> **Имя скилла:** `safe-publish`  
> **Локальный путь:** `/root/.agent/skills/safe-publish/SKILL.md`

---

# Safe Publish

Publish a Webflow site with comprehensive preview, validation, and explicit confirmation workflow.

## Important Note

**ALWAYS use Webflow MCP tools for all operations:**
- Use Webflow MCP's `data_sites_tool` with action `list_sites` for listing available sites
- Use Webflow MCP's `data_sites_tool` with action `get_site` for detailed site information
- Use Webflow MCP's `data_pages_tool` with action `list_pages` for retrieving all pages
- Use Webflow MCP's `data_cms_tool` with action `get_collection_list` for listing CMS collections
- Use Webflow MCP's `data_cms_tool` with action `list_collection_items` for checking draft items
- Use Webflow MCP's `data_sites_tool` with action `publish_site` for publishing the site
- Use Webflow MCP's `webflow_guide_tool` to get best practices before starting
- DO NOT use any other tools or methods for Webflow operations
- All tool calls must include the required `context` parameter (15-25 words, third-person perspective)

## Instructions

### Phase 1: Site Selection & Status Check
1. **Get site**: Identify the target site. If user does not provide site ID, ask for it.
2. **Fetch site details**: Use Webflow MCP's `data_sites_tool` with action `get_site` to retrieve:
   - Last published date
   - Last updated date
   - Custom domains configured
   - Locale settings
3. **Check publish status**: Determine if site has unpublished changes:
   - Compare `lastUpdated` vs `lastPublished` timestamps
   - If `lastPublished` is null, site has never been published
   - If `lastUpdated` > `lastPublished`, site has unpublished changes

### Phase 2: Change Detection & Analysis
4. **List all pages**: Use Webflow MCP's `data_pages_tool` with action `list_pages`
5. **Identify modified pages**:
   - Compare each page's `lastUpdated` with site's `lastPublished`
   - Flag pages modified after last publish
   - Categorize by type (static, CMS template, archived, draft)
6. **List all collections**: Use Webflow MCP's `data_cms_tool` with action `get_collection_list`
7. **Check for draft items**:
   - For each collection, use Webflow MCP's `data_cms_tool` with action `list_collection_items`
   - Count items where `isDraft: true`
   - Count items modified since last publish
8. **Detect issues**:
   - Draft items that won't be published unless explicitly included
   - Pages missing SEO metadata
   - Broken references (if detectable)

### Phase 3: Pre-Publish Validation & Preview
9. **Run pre-publish checks**:
   - Verify no broken collection references
   - Check for pages with missing required fields
   - Warn about draft items that will remain unpublished
10. **Generate detailed preview**:
    - Show all pages to be published
    - Show all CMS items to be published
    - Display warnings for any issues found
    - Show which domains will be updated
11. **Ask for publish scope**:
    - Webflow subdomain only
    - Custom domains only
    - Both subdomain and custom domains

### Phase 4: Confirmation & Publishing
12. **Require explicit confirmation**:
    - User must type "publish" to proceed
    - "yes" or "y" should NOT trigger publish
    - Show clear warning about what will go live
13. **Execute publish**:
    - Use Webflow MCP's `data_sites_tool` with action `publish_site` with correct parameters
    - Handle `customDomains` as empty array if no custom domains
    - Set `publishToWebflowSubdomain` based on user choice
14. **Capture publish timestamp**:
    - Fetch site info again after publish
    - Record exact publish time from `lastPublished` field

### Phase 5: Verification & Reporting
15. **Verify publish success**:
    - Check that `lastPublished` timestamp updated
    - Verify site is accessible at published URL(s)
    - Report any verification failures clearly
16. **Generate success report**:
    - Show publish timestamp
    - List what went live (pages, items)
    - Provide published URL(s)
    - Show verification status
17. **Handle failures gracefully**:
    - If publish fails, show clear error message
    - Suggest remediation steps
    - Do not retry automatically

## Examples

**User prompt:**
```
Publish my site
```

**Step 1: Site Selection**
```
🚀 Safe Publish - Site Selection

Available Sites:

1. **MCP Demo#1**
   - Last published: January 9, 2026 at 20:05:38 UTC
   - Last updated: January 9, 2026 at 20:49:37 UTC
   - ⚠️ **Has unpublished changes** (updated 44 minutes after last publish)

2. **MCP Demo#2**
   - Last updated: January 9, 2026 at 19:32:53 UTC
   - Status: Not yet published

Which site would you like to publish? (1-2)
```

**Step 2: Change Detection & Preview**
```
🚀 Publish Preview: MCP Demo#1

**Last published:** January 9, 2026 at 20:05:38 UTC
**Time since last publish:** ~1 hour 5 minutes

---

## Changes to Publish:

### 📄 Pages Modified: 1
└── **Home** (/)
    - SEO title updated to "Home Page"
    - Last modified: 21:10:52 UTC

### 📝 CMS Items: 2 draft items to publish

**Blog Posts (2 drafts):**

1. **"Why Webflow MCP Will Transform Your Workflow in 2026!"**
   - Status: Draft
   - Created: 20:24:44 UTC
   - Last modified: 21:11:03 UTC
   - Featured: Yes
   - Slug: webflow-mcp-transform-workflow-2026

2. **"Webflow E-commerce: The Future of Online Shopping in 2026!"**
   - Status: Draft
   - Created: 20:05:24 UTC
   - Last modified: 21:11:11 UTC
   - Featured: Yes
   - Slug: webflow-ecommerce-2026

---

**Pre-Publish Checks:**
- ✅ No broken references detected
- ✅ All required fields populated
- ⚠️ 2 draft items will become published

**Publish Targets:**
- Webflow subdomain: mcp-demo-1-e88499.webflow.io
- Custom domains: None configured

**⚠️ Type "publish" to make these changes live.**
```

**Step 3: After user types "publish"**
```
🔄 Publishing MCP Demo#1...

Progress: ████████████████████ 100%

✅ Published Successfully!

**Site:** MCP Demo#1
**Published at:** 2026-01-09 21:12:52 UTC (January 9, 2026 at 21:12:52)

---

## What Went Live:

### 📄 Pages (1)
- ✅ Home (/) - SEO title updated

### 📝 Blog Posts (2)
- ✅ "Why Webflow MCP Will Transform Your Workflow in 2026!"
- ✅ "Webflow E-commerce: The Future of Online Shopping in 2026!"

---

## Verification:

- ✅ **Site accessible:** Yes
- ✅ **URL:** https://mcp-demo-1-e88499.webflow.io
- ✅ **Status:** Page loading successfully
- ✅ **Content delivery:** Webflow CDN responding

---

**🎉 Your site is now live with all changes published!**

All unpublished changes have been successfully published to the Webflow subdomain. The 2 draft blog posts are now visible on your site.
```

**Alternative: With Warnings**
```
🚀 Publish Preview: Company Site

**Last published:** January 8, 2026 at 14:30:00 UTC

---

## Changes to Publish:

### 📄 Pages Modified: 3
├── **About** (/about)
│   └── Content updated
├── **Contact** (/contact)
│   └── Form fields changed
└── **Home** (/)
    └── Hero section updated

### 📝 CMS Items

**Blog Posts:**
- 5 published items modified
- 2 draft items (will NOT be published automatically)

**Products:**
- 3 new items created
- 1 item updated

---

**Pre-Publish Checks:**
⚠️ **Warnings Found:**

1. **Missing SEO Metadata (2 pages):**
   - /about - No meta description
   - /contact - No meta title or description
   - 💡 Recommendation: Add SEO metadata before publishing

2. **Draft Items (2):**
   - "Upcoming Product Launch" (Blog Post)
   - "Holiday Sale Announcement" (Blog Post)
   - ⚠️ These will remain unpublished

3. **Large Change Set:**
   - 3 pages + 9 CMS items will be updated
   - Consider reviewing changes carefully

**Publish Targets:**
- Webflow subdomain: company-site.webflow.io
- Custom domains: example.com, www.example.com

---

**Would you like to:**
1. Proceed with publish (type "publish")
2. Cancel and review (type "cancel")
```

## Guidelines

### Phase 1: Critical Requirements

**Site Status Check:**
- Always fetch complete site details using `data_sites_tool` with action `get_site`
- Compare `lastUpdated` vs `lastPublished` to detect unpublished changes
- If timestamps are identical, inform user "No changes to publish"
- If `lastPublished` is null, warn "First publish - entire site will go live"

**Timestamp Handling:**
- Store both ISO format and human-readable format
- Calculate time elapsed since last publish
- Show timezone (prefer UTC for clarity)

### Phase 2: Change Detection Rules

**Page Change Detection:**
- Compare page `lastUpdated` with site `lastPublished`
- Only flag pages where `lastUpdated > lastPublished`
- Categorize changes:
  - Content changes (hard to detect via API)
  - SEO metadata changes (compare if available)
  - Structural changes (page created/deleted)

**CMS Item Detection:**
- Check `isDraft` field for all items
- Compare `lastUpdated` with site `lastPublished`
- Count items in each state:
  - Published + not modified
  - Published + modified
  - Draft (won't be published)
  - Archived (won't appear on site)

**Collections to Check:**
- Query all collections with `data_cms_tool` with action `get_collection_list`
- For each collection, list items with `data_cms_tool` with action `list_collection_items`
- Batch queries if site has many collections (10+ collections)

### Phase 3: Pre-Publish Validation

**Required Checks:**
1. **Broken References:**
   - Check if referenced items exist
   - Warn if reference field points to deleted/archived item
   - Note: API may not expose this easily - best effort

2. **Missing Required Fields:**
   - Verify all required CMS fields are populated
   - Warn if required fields are empty (shouldn't be possible, but check)

3. **SEO Completeness:**
   - Check pages for missing `seo.title` or `seo.description`
   - Warn but don't block publish
   - Provide recommendations for improvement

4. **Draft Item Warning:**
   - Clearly list all draft items
   - Explain they will remain unpublished
   - Offer to cancel if user wants to publish drafts first

**Warning Levels:**
- 🔴 **Critical**: Would break site (broken refs, missing required fields)
- ⚠️ **Warning**: Suboptimal but publishable (missing SEO, drafts)
- 💡 **Suggestion**: Best practices (add meta descriptions, optimize images)

**When to Block Publish:**
- Only block if critical errors found
- For warnings and suggestions, allow user to proceed
- Always show warnings prominently

### Phase 4: Confirmation & Publishing

**Confirmation Requirements:**
- User MUST type "publish" (case-insensitive)
- Do NOT accept: "yes", "y", "ok", "go", "confirm"
- Rationale: Prevents accidental publishes from generic confirmations
- If user types anything else, ask again or treat as cancel

**Publish API Usage:**
```javascript
// Correct format for data_sites_tool with action publish_site
{
  "site_id": "site-id-here",
  "publishToWebflowSubdomain": true,  // or false
  "customDomains": []  // MUST be array, even if empty
}

// If custom domains exist:
{
  "site_id": "site-id-here",
  "publishToWebflowSubdomain": false,
  "customDomains": ["example.com", "www.example.com"]
}
```

**Domain Selection:**
- If no custom domains: Publish to subdomain only
- If custom domains exist: Ask user which to publish to
  - Subdomain only
  - Custom domains only
  - Both
- Default to subdomain if user doesn't specify

**Error Handling:**
- If `customDomains` validation error: Ensure it's an array
- If `400 Bad Request`: Check request format
- If `403 Forbidden`: Check site publish permissions
- If `500 Server Error`: Retry once after 5 seconds, then report failure

### Phase 5: Verification & Reporting

**Post-Publish Verification:**
1. **Fetch Updated Site Info:**
   - Call `data_sites_tool` with action `get_site` again
   - Verify `lastPublished` timestamp updated
   - If timestamp didn't update, publish may have failed

2. **Site Accessibility Check:**
   - Use WebFetch to check published URL
   - Verify site returns 200 OK
   - Check that content is served (not error page)
   - Measure response time

3. **Custom Domain Checks:**
   - If published to custom domains, verify each domain
   - Some domains may take time to propagate (DNS)
   - Note: "Domain may take a few minutes to update" if slow

**Verification Failure Handling:**
- If site not accessible: Report clearly
- Note: Changes ARE published even if verification fails
- Possible causes:
  - DNS propagation delay
  - CDN cache not yet cleared
  - Temporary Webflow infrastructure issue
- Suggest: "Try accessing the site in 2-3 minutes"

**Success Report Format:**
```
✅ Published Successfully!

Site: [Site Name]
Published at: [ISO Timestamp] ([Human Readable])

What Went Live:
- X pages modified
- Y CMS items published
- Z draft items promoted to published

Verification:
✅ Site accessible
✅ URL: [primary URL]
✅ Response time: [Xms]

[If custom domains]
Custom Domains:
✅ example.com - accessible
⚠️ www.example.com - propagating (may take 2-3 minutes)
```

### Best Practices

**Always:**
- ✅ Show comprehensive preview before publishing
- ✅ Require explicit "publish" confirmation
- ✅ Verify site after publish
- ✅ Report exact publish timestamp
- ✅ List all changes going live
- ✅ Warn about draft items

**Never:**
- ❌ Publish without explicit user confirmation
- ❌ Accept generic confirmations like "yes"
- ❌ Hide warnings from user
- ❌ Retry failed publishes automatically
- ❌ Proceed if critical errors detected

**Edge Cases:**

**No Changes to Publish:**
```
ℹ️ No Changes to Publish

Last published: January 9, 2026 at 20:05:38 UTC
Last updated: January 9, 2026 at 20:05:38 UTC

All changes are already published. Your site is up to date!
```

**First Publish (Never Published Before):**
```
⚠️ First Publish Warning

This site has NEVER been published before.

This will make the ENTIRE site publicly accessible:
- All pages (2 pages)
- All CMS items (47 items across 3 collections)
- All assets

Are you ready to make this site live?
Type "publish" to proceed, or "cancel" to abort.
```

**Publish to Staging Subdomain:**
- If site has custom domains but user chooses subdomain only
- Useful for testing before publishing to production domain
- Explain: "Publishing to subdomain only. Custom domains will continue showing old version."

**Partial Publish Not Supported:**
- Webflow publishes entire site, not individual pages
- Cannot publish specific pages or collections
- If user asks to "publish just the homepage", explain limitation
- Alternative: Use staging subdomain for testing

### Performance Optimization

**For Large Sites:**
- Sites with 100+ pages or 1000+ items may take time to analyze
- Show progress: "Analyzing 150 pages..."
- Batch API calls when possible
- Consider skipping detailed diff for very large change sets

**Caching:**
- Cache site info during workflow (don't refetch unnecessarily)
- Only refetch after publish to verify

**Timeouts:**
- Publish API may take 10-30 seconds for large sites
- Don't timeout too quickly
- Show: "Publishing... this may take up to 30 seconds for large sites"

### Error Messages

**Clear and Actionable:**

❌ **Bad:**
```
"Publish failed"
```

✅ **Good:**
```
"Publish Failed: Validation Error

The Webflow API returned an error:
- customDomains parameter must be an array

This is likely a configuration issue. Retrying...
```

**Common Errors:**

1. **Validation Error (customDomains):**
   - Fix: Ensure `customDomains: []` is an array
   - Don't pass null or omit the field

2. **Site Not Found:**
   - User may have provided wrong site ID
   - List available sites and ask user to select

3. **Insufficient Permissions:**
   - Site may require specific publish permissions
   - Check workspace access settings

4. **Publish Already in Progress:**
   - Another publish may be running
   - Wait 30 seconds and try again