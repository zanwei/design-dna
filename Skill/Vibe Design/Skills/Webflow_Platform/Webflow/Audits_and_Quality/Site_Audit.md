---
title: "Webflow Skill: Site Audit"
tags: [webflow, mcp, skill, site-audit]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Site Audit

> **Имя скилла:** `site-audit`  
> **Локальный путь:** `/root/.agent/skills/site-audit/SKILL.md`

---

# Site Audit

Comprehensive audit of a Webflow site's structure, content health, and quality with detailed analysis and multiple export formats.

## Important Note

**ALWAYS use Webflow MCP tools for all operations:**
- Use Webflow MCP's `data_sites_tool` with action `list_sites` for listing available sites
- Use Webflow MCP's `data_sites_tool` with action `get_site` for detailed site information
- Use Webflow MCP's `data_pages_tool` with action `list_pages` for retrieving all pages
- Use Webflow MCP's `data_cms_tool` with action `get_collection_list` for listing CMS collections
- Use Webflow MCP's `data_cms_tool` with action `get_collection_details` for detailed collection schemas
- Use Webflow MCP's `data_cms_tool` with action `list_collection_items` for counting items
- Use Webflow MCP's `webflow_guide_tool` to get best practices before starting
- DO NOT use any other tools or methods for Webflow operations
- All tool calls must include the required `context` parameter (15-25 words, third-person perspective)

## Instructions

### Phase 1: Site Selection & Discovery
1. **Get site**: Identify the target site. If user does not provide site ID, ask for it.
2. **Fetch site details**: Use Webflow MCP's `data_sites_tool` with action `get_site` to retrieve:
   - Site name and ID
   - Last published date
   - Last updated date
   - Timezone
   - Locales (primary and secondary)
   - Custom domains
3. **Ask user preferences**: Ask what level of detail they want:
   - Quick summary (counts only)
   - Standard inventory (pages + collections + counts)
   - Detailed inventory (includes all field schemas, item samples, SEO data)
   - Full export (everything + export to file format)

### Phase 2: Pages Inventory
4. **List all pages**: Use Webflow MCP's `data_pages_tool` with action `list_pages` to fetch all pages
5. **Categorize pages**:
   - Static pages (no collectionId)
   - CMS template pages (has collectionId)
   - Archived pages
   - Draft pages
6. **Analyze page structure**:
   - Count pages by type
   - Identify pages missing SEO metadata
   - Detect orphaned pages (no navigation links)
   - Check for duplicate slugs

### Phase 3: CMS Collections Inventory
7. **List all collections**: Use Webflow MCP's `data_cms_tool` with action `get_collection_list`
8. **For each collection**:
   - Get detailed schema using Webflow MCP's `data_cms_tool` with action `get_collection_details`
   - Count items using Webflow MCP's `data_cms_tool` with action `list_collection_items`
   - Analyze field types and requirements
   - Identify required vs optional fields
   - Detect reference fields and relationships
9. **Collection analysis**:
   - Empty collections (0 items)
   - Unused collections (no template page)
   - Large collections (100+ items)
   - Collections with missing required fields

### Phase 4: Analysis & Insights
10. **Generate insights**:
    - Total content count (pages + items)
    - Content health score
    - SEO readiness
    - Recommended improvements
11. **Identify issues**:
    - Missing SEO metadata
    - Empty collections
    - Orphaned pages
    - Draft content ratio
12. **Show relationships**:
    - Which pages use which collections
    - Reference field connections
    - Content dependencies

### Phase 5: Export & Formatting
13. **Ask export format** (if user wants full export):
    - Markdown (readable, great for documentation)
    - JSON (machine-readable, for migrations)
    - CSV (spreadsheet-friendly, for analysis)
    - Text summary (console output only)
14. **Generate report** in requested format
15. **Provide actionable insights**: Suggest next steps based on findings

## Examples

**User prompt:**
```
Give me a complete inventory of my site.
```

**Step 1: Initial Report (Standard Inventory)**
```
📊 Site Audit: MCP Demo#1

**Site Details:**
- Site ID: 6924868ede9d3fbbc3195eb0
- Last published: January 9, 2026
- Last updated: January 9, 2026
- Timezone: Asia/Calcutta
- Primary locale: English (en)

---

**Pages (2 total):**

Static Pages (1):
├── Home (/)

CMS Template Pages (1):
└── Blog Posts Template (/post)
    - Collection: Blog Posts

---

**CMS Collections (1):**

Blog Posts (9 items)
├── Slug: post
├── Fields (8):
│   ├── Name (PlainText, required)
│   ├── Slug (PlainText, required)
│   ├── Post Body (RichText)
│   ├── Post Summary (PlainText)
│   ├── Main Image (Image)
│   ├── Thumbnail image (Image)
│   ├── Featured? (Switch)
│   └── Color (Color)

---

**Summary:**
- ✅ 2 pages (1 static, 1 CMS template)
- ✅ 1 CMS collection with 9 published items
- ✅ Site fully published and up-to-date

Would you like a detailed analysis or export in a specific format?
```

**Step 2: Detailed Analysis (when user requests)**
```
🔍 Detailed Analysis: MCP Demo#1

**Content Health Score: 85/100**

✅ Strengths:
- All collections have items (no empty collections)
- All pages are published (no drafts)
- Site recently published (Jan 9, 2026)
- Consistent field structure in Blog Posts

⚠️ Areas for Improvement:
- No SEO metadata on template page (missing meta description)
- Limited page count (consider adding About, Contact pages)
- No reference fields (could link categories/authors to posts)

💡 Recommendations:
1. Add meta descriptions to all pages for better SEO
2. Consider creating a Categories collection for post organization
3. Add an Authors collection for multi-author blog support
4. Create navigation pages (About, Contact, Privacy Policy)

**Collection Breakdown:**

Blog Posts:
- 9 published items (0 drafts, 0 archived)
- 5 featured posts (56%)
- All required fields populated ✓
- Field usage:
  - Name: 100% (9/9)
  - Slug: 100% (9/9)
  - Post Body: 100% (9/9)
  - Post Summary: 100% (9/9)
  - Main Image: 100% (9/9)
  - Thumbnail: 100% (9/9)
  - Featured: 100% (9/9)
  - Color: 100% (9/9)

**Sample Items:**
1. "Why Webflow is the Best Choice for 2026" (featured)
2. "Top Webflow Features to Look Forward to in 2026"
3. "Webflow vs. Competitors: Who Will Win in 2026?" (featured)

---

Export this inventory? (markdown/json/csv/no)
```

**Step 3: Export Options**
```
📥 Export Format Options:

1. **Markdown** - Human-readable documentation
   - Great for README files, wikis, documentation
   - Preserves structure and formatting

2. **JSON** - Machine-readable structured data
   - Perfect for migrations, integrations
   - Includes all raw API data

3. **CSV** - Spreadsheet-friendly
   - Easy to analyze in Excel/Google Sheets
   - Separate files for pages and collections

Which format would you like? (1/2/3)
```

## Guidelines

### Phase 1: Critical Requirements

**Site Information:**
- Always fetch complete site details using `data_sites_tool` with action `get_site`
- Include last published and last updated dates
- Show timezone and locale information
- Display custom domains if configured

**User Options:**
Offer multiple detail levels:
- Quick: Just counts
- Standard: Pages + collections + basic info
- Detailed: Full schema + analysis + insights
- Export: Everything + file output

### Phase 2: Pages Analysis

**Page Categorization:**
- Separate static pages from CMS template pages
- Flag archived and draft pages separately
- Show page slugs/URLs for reference
- Identify pages with missing SEO metadata

**Page Health Checks:**
- Missing meta descriptions
- Missing OG tags
- Duplicate slugs (error condition)
- Orphaned pages (not linked in nav)

### Phase 3: Collections Analysis

**Collection Details:**
For each collection, show:
- Display name and singular name
- Slug (URL structure)
- Total field count
- Required vs optional fields breakdown
- Item count (published/draft/archived)
- Last updated date

**Field Analysis:**
Categorize by type:
- Text fields (PlainText, RichText)
- Media fields (Image, Video, File)
- Relationship fields (Reference, MultiReference)
- Data fields (DateTime, Number, Color)
- Boolean fields (Switch)
- Selection fields (Option)

**Field Validation:**
- Show max length constraints
- Show validation patterns
- Flag required fields
- Identify reference field targets

### Phase 4: Analysis & Insights

**Content Health Score (0-100):**
Calculate based on:
- SEO metadata completeness (25 points)
- Content-to-page ratio (20 points)
- Field utilization (20 points)
- Recent updates (15 points)
- Structure quality (20 points)

**Issue Detection:**
- 🔴 Critical: Missing required fields, duplicate slugs
- ⚠️ Warning: Empty collections, missing SEO, drafts
- 💡 Suggestion: Add pages, create relationships, organize

**Recommendations:**
Suggest improvements based on:
- Missing page types (About, Contact, etc.)
- Underutilized collections
- Missing relationships between collections
- SEO optimization opportunities

### Phase 5: Export Formats

**Markdown Export:**
```markdown
# Site Audit: [Site Name]

## Site Information
- ID: [site-id]
- Last Published: [date]

## Pages
### Static Pages
- Home (/)
- About (/about)

### CMS Templates
- Blog Post (/post/[slug])

## Collections
### Blog Posts (47 items)
**Fields:**
- Title (PlainText, required)
- Slug (PlainText, required)
- Content (RichText)
...
```

**JSON Export:**
```json
{
  "site": {
    "id": "...",
    "name": "...",
    "lastPublished": "..."
  },
  "pages": [...],
  "collections": [...]
}
```

**CSV Export:**
Generate separate files:
- `pages.csv`: All pages with metadata
- `collections.csv`: Collection metadata
- `fields.csv`: All fields across collections
- `items.csv`: Item counts per collection

### Performance Optimization

**Batch Processing:**
- For sites with 20+ collections, show progress
- For collections with 100+ items, paginate counts
- Provide estimated time for large sites

**Error Handling:**
- If `data_pages_tool` with action `list_pages` fails, continue with collections
- If `data_cms_tool` with action `get_collection_details` fails, show basic collection info
- Report partial successes separately
- Offer to retry failed operations

**Data Efficiency:**
- Use pagination for large result sets
- Only fetch detailed schemas when needed
- Limit item samples to 3-5 per collection
- Cache site info for repeat operations

### Best Practices

**Read-Only Operation:**
- No confirmation needed (read-only)
- Safe to run multiple times
- No side effects or modifications

**Clear Organization:**
- Group by content type (pages/collections)
- Use visual hierarchy (├── └──)
- Show counts prominently
- Highlight issues with icons (✅ ⚠️ 🔴 💡)

**Actionable Output:**
- Always end with recommendations
- Offer export options for detailed inventories
- Suggest next steps based on findings
- Provide comparison against best practices

**Version Tracking:**
If user runs inventory multiple times:
- Compare with previous run
- Show changes (new pages, deleted collections)
- Track content growth over time
- Alert on significant changes