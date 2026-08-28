---
title: "Webflow Skill: Link Checker"
tags: [webflow, mcp, skill, link-checker]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Link Checker

> **Имя скилла:** `link-checker`  
> **Локальный путь:** `/root/.agent/skills/link-checker/SKILL.md`

---

# Link Checker

Audit and fix broken or insecure links across your Webflow site to improve SEO and user experience.

## Important Note

**ALWAYS use Webflow MCP tools for all operations:**
- Use Webflow MCP's `webflow_guide_tool` to get best practices before starting
- Use Webflow MCP's `data_sites_tool` with action `list_sites` to identify available sites
- Use Webflow MCP's `data_sites_tool` with action `get_site` to retrieve site details
- Use Webflow MCP's `data_pages_tool` with action `list_pages` to get all pages
- Use Webflow MCP's `data_pages_tool` with action `get_page_content` to extract links from static pages
- Use Webflow MCP's `data_pages_tool` with action `update_static_content` to fix links on static pages
- Use Webflow MCP's `data_cms_tool` with action `get_collection_list` to get all CMS collections
- Use Webflow MCP's `data_cms_tool` with action `get_collection_details` to get collection schemas
- Use Webflow MCP's `data_cms_tool` with action `list_collection_items` to get CMS items with links
- Use Webflow MCP's `data_cms_tool` with action `update_collection_items` to fix links in CMS (draft)
- Use Webflow MCP's `data_cms_tool` with action `publish_collection_items` to publish fixed CMS items
- DO NOT use any other tools or methods for Webflow operations
- All tool calls must include the required `context` parameter (15-25 words, third-person perspective)
- No Designer connection is required — both static page and CMS link fixes go through `data_` tools

## Instructions

### Phase 1: Site Selection & Discovery
1. **Get site information**: Use Webflow MCP's `data_sites_tool` with action `list_sites` to identify target site
2. **Confirm scope**: Ask user if they want to check:
   - Static pages only
   - CMS content only
   - Both static pages and CMS content
3. **List pages**: Use Webflow MCP's `data_pages_tool` with action `list_pages` to get all pages
4. **List collections**: Use Webflow MCP's `data_cms_tool` with action `get_collection_list` to get all CMS collections

### Phase 2: Link Extraction & Validation
5. **Extract links from static pages**: Use Webflow MCP's `data_pages_tool` with action `get_page_content` for each page
   - Identify all link elements (Link, Button, TextLink, LinkBlock)
   - Capture: pageId, nodeName, URL, link text
6. **Extract links from CMS**: Use Webflow MCP's `data_cms_tool` with action `list_collection_items` for each collection
   - Identify Link fields and Rich Text fields with links
   - Capture: collectionId, itemId, fieldName, URL
7. **Validate each link**: Test URL accessibility
   - Check for 4xx/5xx errors (broken links)
   - Check for HTTP vs HTTPS (insecure links)
   - Test if HTTP has HTTPS equivalent available
   - Flag redirects (3xx status codes)
8. **Categorize results**:
   - ✅ Working links (2xx status)
   - ❌ Broken links (4xx/5xx errors)
   - ⚠️ Insecure links (HTTP when HTTPS available)
   - 🔄 Redirects (3xx status)
   - ⚪ Manual review needed (timeouts, DNS errors, etc.)

### Phase 3: Analysis & Reporting
9. **Calculate statistics**:
   - Total links scanned
   - Links by type (internal vs external)
   - Links by status (working, broken, insecure, redirects)
   - Links by location (static pages vs CMS)
10. **Generate health score**: Calculate link health (0-100)
    - Working links: +1 point each
    - Broken links: -5 points each
    - Insecure links: -2 points each
    - Redirects: -1 point each
    - Normalize to 0-100 scale
11. **Identify critical issues**: Prioritize fixes
    - 🔴 Critical: Broken links on high-traffic pages
    - ⚠️ Warning: Insecure HTTP links
    - 💡 Suggestion: Optimize redirects

### Phase 4: Suggestion Generation & Approval
12. **Generate fix suggestions**: For each problematic link, suggest fix
    - Broken links: Remove link or update to correct URL
    - Insecure links: Upgrade HTTP to HTTPS
    - Redirects: Update to final destination URL
13. **Show preview with validation**:
    ```
    [1] ✓ Fix insecure link
        Page: About Us
        Element: Button "Learn More"
        Current: http://example.com
        Suggested: https://example.com
        ✅ HTTPS version verified working

    [2] ⚠️ Fix broken link
        Page: Blog Post "Getting Started"
        Element: Text link
        Current: https://oldsite.com/page
        Suggested: [REMOVE LINK or provide correct URL]
        ❌ URL returns 404 - manual review needed
    ```
14. **Implement granular approval**: Ask user which fixes to apply
    - Type numbers to skip (e.g., "2,4")
    - Type "all" to proceed with all automatic fixes
    - Type "none" to cancel
    - Flag manual review items separately

### Phase 5: Execution & Confirmation
15. **Apply fixes to static pages**: Use Webflow MCP's `data_pages_tool` with action `update_static_content`
    - Update link URLs in nodes
    - Process in batches of 20 links
16. **Apply fixes to CMS content**: Use Webflow MCP's `data_cms_tool` with action `update_collection_items`
    - Update Link fields directly
    - Update links in Rich Text fields
    - Process in batches of 50 items
17. **Publish changes** (if requested): Use Webflow MCP's `data_cms_tool` with action `publish_collection_items`
18. **Show progress**: Display progress indicators for large operations
19. **Generate final report**:
    - Links scanned: X
    - Links fixed: Y
    - Links requiring manual review: Z
    - Health score improvement: Before → After

### Phase 6: Verification & Recommendations
20. **Verify fixes**: Re-check fixed links to confirm success
21. **Report failures**: Clearly identify any fixes that failed
22. **Provide recommendations**:
    - Schedule regular link checks (monthly/quarterly)
    - Set up monitoring for critical external links
    - Consider using 301 redirects for changed URLs
23. **Export report** (optional): Offer to export findings

## Examples

### Example 1: Complete Site Audit

**User prompt:**
```
Run a complete link check on my site and fix any issues
```

**Step 1: Site Selection**
```
🔍 Link Checker: Site Selection

Available sites:
1. Company Website
2. Blog Site
3. Portfolio

Which site would you like to audit? (1/2/3)
```

**Step 2: Scope Confirmation**
```
📋 Link Checker Scope

What would you like to check?
1. Static pages only (faster)
2. CMS content only
3. Both static pages and CMS content (comprehensive)

Recommendation: Option 3 for complete audit

Your choice? (1/2/3)
```

**Step 3: Extraction & Validation**
```
🔄 Scanning Links...

Progress: ████████████████████ 100%

Found 247 links:
├── Static pages: 89 links (15 pages)
├── CMS content: 158 links (3 collections)
│   ├── Blog Posts: 142 links
│   ├── Team Members: 12 links
│   └── Products: 4 links

Validating links...

Progress: ████████████████████ 100% (247/247 checked)

✅ Working: 215 links (87%)
❌ Broken: 8 links (3%)
⚠️ Insecure: 18 links (7%)
🔄 Redirects: 6 links (2%)
```

**Step 4: Analysis Report**
```
📊 Link Health Report: Company Website

Overall Health Score: 76/100 ⚠️

## Issues Found:

### 🔴 Critical: Broken Links (8)
├── [1] Page: "About Us"
│   └── Link to: https://partner-site.com/old-page
│       Status: 404 Not Found
│       Impact: High (homepage)
│
├── [2] CMS: Blog Post "Product Launch"
│   └── Link to: https://press-release.com/announcement
│       Status: 404 Not Found
│       Impact: Medium
│
├── [3-8] 6 more broken links...

### ⚠️ Warning: Insecure Links (18)
├── [9] Page: "Contact"
│   └── Link: http://social-media.com/company
│       Fix: https://social-media.com/company
│       ✅ HTTPS verified working
│
├── [10] CMS: Blog Post "Getting Started"
│   └── Link: http://tutorial-site.com
│       Fix: https://tutorial-site.com
│       ✅ HTTPS verified working
│
├── [11-26] 16 more insecure links...

### 💡 Suggestion: Redirects (6)
├── [27] Page: "Services"
│   └── Link: https://example.com/old-url
│       Redirects to: https://example.com/new-url
│       Suggestion: Update to final destination
│
├── [28-32] 5 more redirects...

---

💡 Recommendations:
1. Fix 8 broken links immediately (SEO impact)
2. Upgrade 18 HTTP links to HTTPS (security)
3. Update 6 redirects to final URLs (performance)

Estimated time to fix: ~5 minutes
```

**Step 5: Fix Preview**
```
🔧 Proposed Fixes (26 total)

### Automatic Fixes Available (24):

[1] ✓ Upgrade to HTTPS
    Page: Contact
    Element: Button "Follow Us"
    Current: http://social-media.com/company
    New: https://social-media.com/company
    ✅ HTTPS verified working

[2] ✓ Upgrade to HTTPS
    CMS: Blog Posts > "Getting Started" > content field
    Current: http://tutorial-site.com
    New: https://tutorial-site.com
    ✅ HTTPS verified working

[3] ✓ Update redirect
    Page: Services
    Element: Text link "Learn more"
    Current: https://example.com/old-url
    New: https://example.com/new-url
    ✅ Final destination verified

[4-24] ... 21 more automatic fixes

### Manual Review Required (2):

[25] ⚠️ Broken link - needs correction
    Page: About Us
    Element: Button "View Partner Site"
    Current: https://partner-site.com/old-page
    Issue: 404 Not Found
    Action needed: Provide correct URL or remove link

[26] ⚠️ Broken link - needs correction
    CMS: Blog Posts > "Product Launch" > content field
    Current: https://press-release.com/announcement
    Issue: 404 Not Found
    Action needed: Update with correct URL or remove

---

Which fixes would you like to apply?
- Type "all" to apply all 24 automatic fixes
- Type numbers to skip (e.g., "3,5,7")
- Type "none" to cancel
```

**Step 6: After User Approves "all"**
```
✅ Applying Fixes...

Progress: ████████████████████ 100%

Static Pages:
- Updated 8 links on 5 pages
- ✅ Contact page: 3 links fixed
- ✅ Services page: 2 links fixed
- ✅ About page: 1 link fixed
- ✅ Blog page: 2 links fixed

CMS Content:
- Updated 16 links in 12 items
- ✅ Blog Posts: 14 links fixed
- ✅ Team Members: 2 links fixed

---

🎉 Link Fixes Complete!

Summary:
- Links scanned: 247
- Links fixed: 24 ✅
- Manual review needed: 2 ⚠️
- Failed: 0 ❌

Health Score: 76 → 95 (+19) ✨

---

⚠️ Manual Review Items:

[1] About Us page - broken partner link
    Current: https://partner-site.com/old-page
    Action: Update or remove manually

[2] Blog post "Product Launch" - broken press release
    Current: https://press-release.com/announcement
    Action: Update or remove manually

---

💡 Next Steps:
1. Fix the 2 manual review items
2. Re-run link checker in 1 month
3. Set up monitoring for critical external links
4. Consider 301 redirects for any URL changes

Would you like to export this report? (yes/no)
```

### Example 2: CMS-Only Link Check

**User prompt:**
```
Check all links in my blog posts
```

**Step 1: Collection Selection**
```
🔍 Link Checker: CMS Collections

Found 3 collections:
1. Blog Posts (47 items)
2. Team Members (8 items)
3. Categories (6 items)

You requested blog posts. Checking "Blog Posts" collection...
```

**Step 2: Link Extraction**
```
🔄 Extracting Links from Blog Posts...

Progress: ████████████████████ 100% (47/47 items)

Found 142 links in Blog Posts:
├── Link fields: 23 links
├── Rich Text content: 119 links
└── Total unique URLs: 87 (55 appear multiple times)

Validating links...

Progress: ████████████████████ 100% (87/87 unique URLs checked)

Results:
✅ Working: 79 links (91%)
❌ Broken: 3 links (3%)
⚠️ Insecure: 5 links (6%)
🔄 Redirects: 0 links
```

**Step 3: Issue Report**
```
📊 Blog Posts Link Health: 91/100 ✅

## Issues Found:

### 🔴 Broken Links (3):
[1] Post: "Getting Started with Webflow"
    Field: content (Rich Text)
    Link: https://old-docs.example.com/guide
    Status: 404 Not Found
    Appears in: 3 posts

[2] Post: "Best Practices 2024"
    Field: external-link (Link)
    Link: https://expired-resource.com
    Status: 410 Gone

[3] Post: "Tutorial Series Part 3"
    Field: content (Rich Text)
    Link: https://video-host.com/deleted-video
    Status: 404 Not Found

### ⚠️ Insecure Links (5):
[4] Post: "Case Study: Company A"
    Field: content (Rich Text)
    Link: http://company-a-site.com
    Fix: https://company-a-site.com
    ✅ HTTPS available and working

[5-8] 4 more insecure links...

---

🔧 Proposed Fixes:

[1] ⚠️ Remove broken link (manual review)
    Posts affected: 3 (Getting Started, Tutorial 1, Tutorial 2)
    Link: https://old-docs.example.com/guide
    Suggestion: Update to new docs URL if available

[2] ⚠️ Remove broken link (manual review)
    Post: "Best Practices 2024"
    Link: https://expired-resource.com
    Suggestion: Remove or replace with alternative

[3] ⚠️ Remove broken link (manual review)
    Post: "Tutorial Series Part 3"
    Link: https://video-host.com/deleted-video
    Suggestion: Update with new video URL

[4] ✓ Upgrade to HTTPS
    Post: "Case Study: Company A"
    Current: http://company-a-site.com
    New: https://company-a-site.com
    ✅ HTTPS verified working

[5-8] ... 4 more HTTPS upgrades

---

Which fixes would you like to apply?
- Type "4-8" to apply only HTTPS upgrades
- Type "all" for all automatic fixes
- Type "none" to cancel
```

### Example 3: Static Pages Only (Quick Check)

**User prompt:**
```
Quick check on my static pages for broken links
```

**Response:**
```
🔍 Quick Link Check: Static Pages

Scanning 15 static pages...

Progress: ████████████████████ 100%

Found 89 links across 15 pages

Validation Results:
✅ All links working! (89/89)

Health Score: 100/100 ✨

Your static pages have no broken or insecure links.

💡 Tip: Run a full audit including CMS content for comprehensive coverage.
```

### Example 4: Fixing Specific Issues

**User prompt:**
```
I have some broken links on my About page. Can you fix them?
```

**Response:**
```
🔍 Checking Links on "About" Page...

Found 12 links on About page

Validation Results:
✅ Working: 9 links
❌ Broken: 2 links
⚠️ Insecure: 1 link

---

Issues Found:

[1] ❌ Broken: Partner site link
    Element: Button "Visit Partner"
    Link: https://partner-old-site.com
    Status: 404 Not Found
    Fix: Manual review needed

[2] ❌ Broken: Team member profile
    Element: Text link "Meet Sarah"
    Link: /team/sarah-old-profile
    Status: 404 Not Found
    Fix: Update to /team/sarah-johnson?

[3] ⚠️ Insecure: Social media link
    Element: Link "Follow us"
    Link: http://social.com/company
    Fix: https://social.com/company
    ✅ HTTPS verified

---

Which fixes would you like to apply?
- Type "3" to only fix the insecure link
- Type "2,3" to fix items 2 and 3
- Type "all" for automatic fixes
- Type "none" to cancel

Note: Item [1] requires manual correction with correct URL
```

## Guidelines

### Phase 1: Discovery Best Practices

**Site Selection:**
- Use `data_sites_tool` with action `list_sites` to get available sites
- Never assume site ID
- Confirm site name with user

**Scope Definition:**
- Ask if checking static pages, CMS, or both
- Estimate time based on scope:
  - Static pages only: 1-3 minutes
  - CMS only: 2-5 minutes (depends on item count)
  - Full site: 5-10 minutes

**Collection Selection:**
- List all collections with item counts
- If user specifies collection, focus on that
- If "all CMS", check all collections

### Phase 2: Link Extraction Best Practices

**Static Page Link Extraction:**
- Use `data_pages_tool` with action `get_page_content` to get page nodes
- Look for these node types:
  - Link (a tag)
  - Button (with link)
  - TextLink
  - LinkBlock
- Extract href/url property
- Capture link text for reporting
- Track nodeId for fixing later

**CMS Link Extraction:**
- Use `data_cms_tool` with action `get_collection_details` to identify Link and Rich Text fields
- Use `data_cms_tool` with action `list_collection_items` to get all items
- For Link fields: Extract URL directly
- For Rich Text fields: Parse HTML to extract <a> tags
- Track: collectionId, itemId, fieldName for fixing

**Link Validation:**
- Test each unique URL (avoid duplicate tests)
- Use HEAD request first (faster than GET)
- Fallback to GET if HEAD fails
- Handle timeouts (10 second max)
- For HTTP links: Test HTTPS equivalent
- Record status code and final URL (after redirects)

**Categorization Rules:**
```
✅ Working (2xx):
- 200 OK
- 201 Created
- 204 No Content

❌ Broken (4xx/5xx):
- 400 Bad Request
- 401 Unauthorized
- 403 Forbidden
- 404 Not Found
- 410 Gone
- 500 Internal Server Error
- 502 Bad Gateway
- 503 Service Unavailable

⚠️ Insecure (HTTP):
- URL starts with http://
- HTTPS equivalent exists and returns 2xx
- Mark as "upgrade to HTTPS"

🔄 Redirects (3xx):
- 301 Moved Permanently
- 302 Found
- 307 Temporary Redirect
- 308 Permanent Redirect

⚪ Manual Review:
- Timeout errors
- DNS resolution failures
- Connection refused
- SSL certificate errors
```

### Phase 3: Analysis Best Practices

**Health Score Calculation:**
```
Formula:
1. Base score = 100
2. Working links: No change
3. Broken links: -5 points each
4. Insecure links: -2 points each
5. Redirects: -1 point each
6. Minimum score: 0
7. Maximum score: 100

Example:
- Total links: 200
- Working: 180 (no penalty)
- Broken: 5 (−25 points)
- Insecure: 10 (−20 points)
- Redirects: 5 (−5 points)
- Score: 100 − 25 − 20 − 5 = 50/100
```

**Issue Prioritization:**
```
🔴 Critical (fix immediately):
- Broken links on homepage
- Broken links on high-traffic pages
- Broken links in navigation
- 404 errors on important external references

⚠️ Warning (fix soon):
- Insecure HTTP links (security risk)
- Broken links on blog posts
- Broken links in footer
- 410 Gone errors

💡 Suggestion (optimize):
- 301 redirects (update to final destination)
- 302 redirects (may change, monitor)
- External links with slow response times
```

**Statistics to Report:**
```
Essential:
- Total links scanned
- Working links count & percentage
- Broken links count & percentage
- Insecure links count & percentage
- Redirect links count & percentage

Detailed:
- Links by location (static vs CMS)
- Links by type (internal vs external)
- Most common issues
- Pages/items with most issues
- External domains with most broken links
```

### Phase 4: Suggestion Generation Best Practices

**Automatic Fix Criteria:**
```
Can auto-fix:
✅ HTTP → HTTPS (if HTTPS verified working)
✅ Redirects → Final destination (if final URL verified)
✅ Relative URLs → Absolute URLs (for external sites)

Needs manual review:
⚠️ Broken links (404, 410, 5xx) - requires correct URL
⚠️ HTTP with no HTTPS equivalent
⚠️ Timeouts or connection errors
⚠️ SSL certificate errors
⚠️ Authentication required (401, 403)
```

**Preview Format:**
```
[X] ✓ Auto-fix available
    Location: [Page name or CMS item]
    Element: [Element type + text]
    Current: [Current URL]
    New: [Proposed URL]
    ✅ Verification: [Status]

[Y] ⚠️ Manual review needed
    Location: [Page name or CMS item]
    Element: [Element type + text]
    Current: [Current URL]
    Issue: [Error description]
    Suggestion: [What to do]
```

**Granular Approval:**
- Number each fix starting from 1
- Show all automatic fixes first
- Show manual review items separately
- Allow user to select specific fixes
- Options: "all", "none", or specific numbers
- Example: "1,3,5-10" applies fixes 1, 3, and 5 through 10

### Phase 5: Execution Best Practices

**Static Page Updates:**
```
Requirements:
- Use data_pages_tool with action update_static_content
- Update nodes array with new URLs
- Process in batches of 20 links per page
- Verify updates after each batch

Error Handling:
- If Designer not connected: Report and skip static pages
- If update fails: Mark link and continue with others
- Report partial successes separately
```

**CMS Updates:**
```
For Link Fields:
- Direct update: fieldData[fieldName] = "new-url"
- Use data_cms_tool with action update_collection_items
- Option: update live or draft

For Rich Text Fields:
- Parse HTML content
- Find and replace <a> tags
- Preserve other HTML formatting
- Update fieldData[fieldName] with new HTML

Batch Processing:
- Process 50 items per batch
- Show progress for large collections
- Handle API rate limits gracefully
```

**Publishing:**
```
Ask user:
"Would you like to publish the changes immediately?"
- Yes: Use data_cms_tool with action publish_collection_items
- No: Leave as drafts

For static pages:
- Changes are immediate (Designer updates live)
- Warn user that static page changes are live
```

### Phase 6: Verification Best Practices

**Re-validation:**
- Re-check all fixed links
- Confirm status changed (404 → 200, HTTP → HTTPS)
- Report any fixes that didn't work
- Calculate new health score

**Failure Reporting:**
```
If any fixes failed:
❌ Fixes that failed (X):

[1] Failed to update
    Location: Contact page
    Reason: Page content changed since last read (conflict)
    Action: Re-fetch the page and retry

[2] URL still broken
    Location: Blog post "Guide"
    Reason: HTTPS version returned 404
    Action: Manual correction needed
```

**Success Reporting:**
```
✅ Summary:

Before:
- Health Score: 76/100
- Broken links: 8
- Insecure links: 18
- Redirects: 6

After:
- Health Score: 95/100 (+19)
- Broken links: 2 (6 fixed, 2 need manual review)
- Insecure links: 0 (18 fixed)
- Redirects: 0 (6 fixed)

Changes:
- Static pages: 8 links updated on 5 pages
- CMS content: 16 links updated in 12 items
- Total fixes: 24 ✅
- Manual review: 2 ⚠️
```

**Recommendations:**
```
Always provide:
1. Schedule for next check (monthly/quarterly)
2. Monitoring suggestions for critical links
3. Best practices for avoiding broken links
4. URL redirect strategies if applicable

Example:
💡 Recommendations:

1. **Schedule regular checks**
   - Run link checker monthly for active sites
   - Run quarterly for static sites
   - Set calendar reminder

2. **Monitor critical external links**
   - Key partners: company-a.com, partner-site.com
   - Documentation: docs.example.com
   - Social media profiles

3. **Set up URL redirects**
   - If changing URLs, create 301 redirects
   - Test redirects before going live
   - Keep redirect map updated

4. **Best practices**
   - Test external links before adding
   - Use relative URLs for internal links
   - Avoid deep linking to external pages
   - Verify links after major redesigns
```

### Phase 7: Export Options

**Report Formats:**
```
Offer to export findings:

1. **Markdown** - Human-readable report
   - Include all statistics
   - List all issues found
   - Show fixes applied
   - Add recommendations
   - Great for documentation

2. **CSV** - Spreadsheet format
   - Columns: Location, Element, URL, Status, Issue, Fix Applied
   - Easy to filter and analyze
   - Good for sharing with team

3. **JSON** - Machine-readable data
   - Complete raw data
   - Useful for integrations
   - Archive for historical tracking
```

**Export Example (Markdown):**
```markdown
# Link Audit Report: Company Website
Date: January 10, 2026

## Summary
- Total links scanned: 247
- Health score: 95/100
- Links fixed: 24
- Manual review needed: 2

## Issues Found
### Broken Links (8)
1. About Us > Button "Visit Partner"
   - URL: https://partner-old-site.com
   - Status: 404 Not Found
   - Fix: Manual review needed

...

## Recommendations
1. Schedule monthly link checks
2. Monitor key external links
3. Set up 301 redirects for URL changes
```

### Phase 8: Performance Optimization

**Batch Processing:**
```
For large sites:
- Process pages in batches of 10
- Process CMS items in batches of 50
- Show progress: "Processing batch 1 of 5..."
- Timeout protection: Skip after 30s per batch
```

**Caching Validation Results:**
```
- Cache validation results by unique URL
- If same URL appears 10 times, validate once
- Report: "Checking 87 unique URLs (out of 247 total links)"
- Reduces validation time significantly
```

**Parallel vs Sequential:**
```
Parallel (faster):
- Link validation (test multiple URLs simultaneously)
- Page content extraction (fetch multiple pages)

Sequential (required):
- Link updates (one at a time to avoid conflicts)
- Publishing (one batch at a time)
```

### Phase 9: Error Handling

**Common Errors:**

**1. Designer Not Connected:**
```
❌ Error: Cannot update static pages

Reason: Designer MCP app not connected

Solution:
1. Open Webflow Designer
2. Open the target site
3. Connect Designer MCP app
4. Retry static page fixes

Note: CMS fixes can proceed without Designer
```

**2. Rate Limits:**
```
⚠️ Warning: Rate limit reached

Pausing for 60 seconds...

Progress will resume automatically.
Current: 50/200 links validated
```

**3. Timeout Errors:**
```
⚠️ Link validation timeout

Link: https://very-slow-site.com
Timeout: 10 seconds exceeded

Marked for manual review.
Continuing with remaining links...
```

**4. SSL Certificate Errors:**
```
⚠️ SSL Certificate Error

Link: https://expired-cert-site.com
Issue: Certificate expired

Cannot verify HTTPS. Marked for manual review.
```

### Phase 10: Edge Cases

**Case 1: No Issues Found**
```
🎉 Excellent! No Issues Found

All 247 links are working correctly!

Health Score: 100/100 ✨

Your site has:
✅ No broken links
✅ No insecure HTTP links
✅ No unnecessary redirects

💡 Recommendation:
Run this check monthly to maintain link health.
```

**Case 2: All Links Broken**
```
❌ Critical: Multiple Broken Links

Found 89 broken links across all pages.

This suggests a possible site-wide issue:
- Domain migration not configured?
- External service outage?
- Relative URL path issues?

🔍 Recommended Action:
1. Check if external services are down
2. Verify domain and SSL configuration
3. Test a few links manually
4. Contact Webflow support if needed

Shall I still proceed with individual link fixes? (yes/no)
```

**Case 3: Mixed HTTP/HTTPS Site**
```
⚠️ Mixed Content Warning

Your site uses HTTPS but has 18 HTTP links.

This creates:
- Security warnings in browsers
- SEO penalties
- Trust issues for visitors

🔧 Recommendation:
Upgrade all HTTP links to HTTPS (all 18 can be auto-fixed)

Proceed with upgrade? (yes/no)
```

**Case 4: Redirect Chains**
```
⚠️ Redirect Chain Detected

Link: https://example.com/old
  → 301 to: https://example.com/temp
  → 301 to: https://example.com/final

Recommendation: Update directly to final URL
- Improves page load speed
- Reduces redirect overhead
- Better for SEO

Fix: Update to https://example.com/final

Apply fix? (yes/no)
```

## Production Checklist

Before considering link checker implementation complete:

### ✅ Discovery
- [ ] Sites listed with all details
- [ ] Scope confirmed (static/CMS/both)
- [ ] All pages retrieved
- [ ] All collections identified
- [ ] User understands time estimate

### ✅ Link Extraction
- [ ] Static page links extracted correctly
- [ ] CMS link fields identified
- [ ] Rich Text links parsed correctly
- [ ] All link elements captured (nodeId, URL, text)
- [ ] Duplicate URLs consolidated for validation

### ✅ Validation
- [ ] Each unique URL validated
- [ ] Status codes captured correctly
- [ ] HTTP/HTTPS checking works
- [ ] Redirects detected and final URLs captured
- [ ] Timeout handling implemented
- [ ] Error categorization accurate

### ✅ Analysis
- [ ] Health score calculated correctly
- [ ] Issues prioritized (Critical/Warning/Suggestion)
- [ ] Statistics complete and accurate
- [ ] Internal vs external links separated
- [ ] Location tracking (page/CMS) accurate

### ✅ Suggestion Generation
- [ ] Automatic fixes identified correctly
- [ ] Manual review items flagged
- [ ] HTTPS upgrades verified before suggesting
- [ ] Redirect final destinations verified
- [ ] Preview format clear and detailed
- [ ] Validation status shown for each fix

### ✅ Approval System
- [ ] Granular approval implemented
- [ ] User can select specific fixes
- [ ] "all"/"none"/numbers format works
- [ ] Manual review items separated
- [ ] Clear instructions provided

### ✅ Execution
- [ ] Static page updates work (Designer connected)
- [ ] CMS Link field updates work
- [ ] CMS Rich Text link updates work
- [ ] Batch processing implemented
- [ ] Progress indicators shown
- [ ] Error handling graceful

### ✅ Verification
- [ ] Fixed links re-validated
- [ ] New health score calculated
- [ ] Failures reported clearly
- [ ] Partial successes vs full failures separated
- [ ] Before/after comparison shown

### ✅ Reporting
- [ ] Final summary complete
- [ ] Statistics accurate
- [ ] Recommendations provided
- [ ] Export options offered
- [ ] Next steps clear

### ✅ Error Handling
- [ ] Designer disconnected handled
- [ ] Timeout errors handled
- [ ] Rate limits handled
- [ ] SSL errors handled
- [ ] Partial failures reported separately

### ✅ Performance
- [ ] Batch processing for scale
- [ ] URL deduplication for validation
- [ ] Progress indicators for long operations
- [ ] Timeout protection implemented
- [ ] Efficient API usage

### ✅ User Experience
- [ ] Clear feedback at each step
- [ ] Progress indicators shown
- [ ] Warnings shown before changes
- [ ] Success confirmation clear
- [ ] Recommendations actionable