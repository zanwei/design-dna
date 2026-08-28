---
title: "Webflow Skill: Bulk Cms Update"
tags: [webflow, mcp, skill, bulk-cms-update]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Bulk Cms Update

> **Имя скилла:** `bulk-cms-update`  
> **Локальный путь:** `/root/.agent/skills/bulk-cms-update/SKILL.md`

---

# Bulk CMS Update

Create or update multiple CMS items with comprehensive validation, granular approval, and rollback capability.

## Important Note

**ALWAYS use Webflow MCP tools for all operations:**
- Use Webflow MCP's `data_sites_tool` with action `list_sites` for listing available sites
- Use Webflow MCP's `data_cms_tool` with action `get_collection_list` for listing CMS collections
- Use Webflow MCP's `data_cms_tool` with action `get_collection_details` for fetching collection schemas
- Use Webflow MCP's `data_cms_tool` with action `list_collection_items` for retrieving existing items
- Use Webflow MCP's `data_cms_tool` with action `create_collection_items` for creating items (draft or published)
- Use Webflow MCP's `data_cms_tool` with action `update_collection_items` for updating items (draft or published)
- Use Webflow MCP's `data_cms_tool` with action `publish_collection_items` for publishing draft items
- Use Webflow MCP's `webflow_guide_tool` to get best practices before starting
- DO NOT use any other tools or methods for Webflow operations
- All tool calls must include the required `context` parameter (15-25 words, third-person perspective)

## Instructions

### Phase 1: Site & Collection Selection
1. **Get site**: Identify the target site. If user does not provide site ID, ask for it.
2. **List collections**: Use Webflow MCP's `data_cms_tool` with action `get_collection_list` to show available collections
3. **Ask user to select collection**: User specifies which collection to work with
4. **Fetch collection schema**: Use Webflow MCP's `data_cms_tool` with action `get_collection_details` to retrieve:
   - All field definitions with types
   - Required vs optional fields
   - Field validations (max length, patterns, etc.)
   - Reference field targets

### Phase 2: Data Collection & Parsing
5. **Ask operation type**: Clarify what user wants to do:
   - Create new items only
   - Update existing items only
   - Both create and update
6. **Receive data from user**: Accept data in flexible formats:
   - Structured format (JSON-like)
   - Natural language descriptions
   - CSV-style data
   - Bullet lists
7. **Parse and normalize**: Convert user data into structured format
8. **Fetch existing items** (if updates involved): Use Webflow MCP's `data_cms_tool` with action `list_collection_items` to get current data

   **IMPORTANT - Efficient Item Lookup:**
   - When searching for specific items by name, ALWAYS use the `name` parameter to filter (e.g., `name: "Pikachu"`)
   - When searching by slug, use the `slug` parameter to filter
   - NEVER fetch all items first and then search through the results - this wastes API calls and tokens
   - Only fetch the full list when you need to display all items or don't know which specific items to target

### Phase 3: Validation & Analysis
9. **Validate all data**:
   - **Field names**: Check all field names exist in schema
   - **Required fields**: Ensure all required fields are provided
   - **Field types**: Validate data types match schema
   - **Constraints**: Check max lengths, patterns, allowed values
   - **Slugs**: Ensure slugs are unique and valid
   - **Reference fields**: Verify referenced items exist
10. **Detect conflicts**:
    - Duplicate slugs (within batch or with existing items)
    - Missing required fields
    - Invalid data types
    - Constraint violations
11. **Analyze impact**:
    - Count creates vs updates
    - Identify which fields will change
    - Calculate batch size and processing time

### Phase 4: Preview & Granular Approval
12. **Generate detailed preview**:
    - Show each item with validation status
    - Display warnings for any issues
    - For updates, show diffs (old → new)
    - For creates, show all field values
    - Number each item for selective approval
13. **Present granular approval options**:
    - Allow user to select specific items to process
    - Options: "all", "none", specific numbers, number ranges
    - Show estimated processing time
14. **Offer publish options**:
    - Publish immediately (use `*_live` endpoints)
    - Create as drafts (use regular endpoints + manual publish)

### Phase 5: Execution & Reporting
15. **Store rollback data**: Before any changes, save:
    - Original values for all updated items
    - Timestamp
    - Operation details
16. **Process in batches**:
    - Maximum 50 items per batch
    - Show progress indicator
    - Handle rate limits gracefully
17. **Execute operations**: Use appropriate Webflow MCP tools based on user choice
18. **Handle errors gracefully**:
    - Continue processing on single item failures
    - Track successes and failures separately
    - Provide detailed error messages
19. **Generate comprehensive report**:
    - Summary (success/failure counts)
    - Detailed results per item
    - Item IDs for created/updated items
    - Error details for failed items
20. **Offer rollback option**: Allow user to undo changes if needed

## Examples

**User prompt:**
```
Add 2 blog posts about Webflow MCP and update the first blog to say "Top" instead of "Best"
```

**Step 1: Site & Collection Selection**
```
📋 Bulk CMS Update Setup

Available Sites:
1. MCP Demo#1
2. MCP Demo#2
3. MCP Demo#3

Please select a site (1-3):
```

*User selects: 1*

```
Available Collections in MCP Demo#1:
└── Blog Posts (9 items)
    Fields: name, slug, post-body, post-summary, main-image, thumbnail-image, featured, color

Proceed with Blog Posts collection? (yes/no)
```

*User confirms: yes*

**Step 2: Data Collection**
```
🔍 Collection Schema: Blog Posts

Required Fields:
- name (PlainText, max 256 chars)
- slug (PlainText, max 256 chars, alphanumeric only)

Optional Fields:
- post-body (RichText)
- post-summary (PlainText)
- main-image (Image)
- thumbnail-image (Image)
- featured (Switch, true/false)
- color (Color, hex format)

I'll parse your request:
- Create 2 new posts about Webflow MCP
- Update first post: "Best" → "Top"

Generating items...
```

**Step 3: Validation & Preview**
```
📋 Preview: Bulk CMS Update

Collection: Blog Posts
Operations: Create 2 items + Update 1 item

---

### 🆕 Items to Create (2)

[1] ✓ NEW POST
    name: "Webflow MCP: The Future of Web Development"
    slug: "webflow-mcp-future-web-development"
    post-summary: "Discover how Webflow MCP is revolutionizing..."
    post-body: "<h1>The Future is Here</h1><p>..."
    featured: true
    color: "#9B59B6"
    ✅ All validations passed

[2] ✓ NEW POST
    name: "Why Webflow MCP Will Transform Your Workflow in 2026"
    slug: "webflow-mcp-transform-workflow-2026"
    post-summary: "Learn how Webflow MCP's integration..."
    post-body: "<h1>Transform Your Workflow</h1><p>..."
    featured: true
    color: "#3498DB"
    ✅ All validations passed

---

### ✏️ Items to Update (1)

[3] ✓ UPDATE EXISTING
    Item ID: 69615f84fc6ce1aa444d24d5
    Slug: why-webflow-is-best-2026-ai

    Changes:
      name: "Why Webflow is the Best Choice for 2026" → "Why Webflow is the Top Choice for 2026"

    ✅ All validations passed

---

**Summary:**
- ✅ 2 items will be created
- ✅ 1 item will be updated
- ⚠️ 0 warnings
- ❌ 0 errors

**Publish Options:**
1. Publish immediately (recommended)
2. Save as drafts

Which items would you like to process?
- Type "all" to process all 3 items
- Type numbers to skip (e.g., "2" to skip item 2)
- Type "none" to cancel

Select publish option (1/2): _
Select items: _
```

*User selects: 1, all*

```
⚠️ You're about to:
- Create 2 new blog posts (published live)
- Update 1 existing blog post (changes published live)

Type "confirm" to proceed.
```

*User confirms: confirm*

**Step 4: Execution & Results**
```
🔄 Processing bulk update...

Creating items: ██████████ 100% (2/2)
Updating items: ██████████ 100% (1/1)

✅ Bulk CMS Update Complete!

---

### 🆕 Created Items (2)

✓ [1] "Webflow MCP: The Future of Web Development"
      ID: 6961640c66de07bed9aacf3e
      Slug: webflow-mcp-future-web-development
      Published: Jan 9, 2026, 8:24 PM

✓ [2] "Why Webflow MCP Will Transform Your Workflow in 2026"
      ID: 6961640c66de07bed9aacf41
      Slug: webflow-mcp-transform-workflow-2026
      Published: Jan 9, 2026, 8:24 PM

---

### ✏️ Updated Items (1)

✓ [3] "Why Webflow is the Top Choice for 2026"
      ID: 69615f84fc6ce1aa444d24d5
      Changed: title updated
      Published: Jan 9, 2026, 8:24 PM

---

**Summary:**
- ✅ 2 items created successfully
- ✅ 1 item updated successfully
- ❌ 0 failures
- ⏱️ Completed in 3.2 seconds

**Total Items:** 11 (was 9)

📋 Rollback Available:
Last update: 3 items modified just now
Type "undo" within 5 minutes to revert all changes
```

**Alternative: With Validation Warnings**
```
📋 Preview: Bulk CMS Update

[1] ⚠️ NEW POST
    name: "Test Post"
    slug: "test"
    post-summary: "Hi"
    ⚠️ Warning: post-summary too short (< 20 chars) - may affect SEO
    ⚠️ Warning: slug too generic - consider more descriptive slug
    ⚠️ Warning: missing post-body - content will be empty
    ✅ Required fields present (can proceed)

[2] ❌ NEW POST
    name: "Another Post!!!"
    slug: "another post"
    ❌ Error: slug contains spaces (must be alphanumeric with hyphens only)
    ❌ Error: name contains special characters not allowed
    🔴 Cannot proceed - fix errors first

---

**Summary:**
- ✅ 1 item can be created (with warnings)
- ❌ 1 item has errors (cannot create)

Fix item 2 or skip it? (fix/skip)
```

## Guidelines

### Phase 1: Critical Requirements

**Site & Collection Selection:**
- Always fetch actual site list using `data_sites_tool` with action `list_sites`
- Never assume site IDs
- Show collection names and item counts
- Display field schema before accepting data
- Confirm collection selection with user

### Phase 2: Data Parsing

**Flexible Input Formats:**
Accept data in multiple formats:

1. **Structured (JSON-like):**
```
CREATE:
- name: "Post Title"
  slug: "post-slug"
  featured: true
```

2. **Natural Language:**
```
"Add a blog post called 'Getting Started' with slug 'getting-started'"
```

3. **CSV-style:**
```
name,slug,featured
"Post 1","post-1",true
"Post 2","post-2",false
```

4. **Bullet Lists:**
```
- Post 1: "Title" (slug: title-slug)
- Post 2: "Another" (slug: another-slug)
```

**Parsing Rules:**
- Be lenient with format variations
- Infer missing optional fields
- Ask for clarification if ambiguous
- Never assume required field values

**Efficient Item Lookup:**
When fetching existing items for updates, use filter parameters to minimize API calls:

```
# Good - Filter by name when you know the item name
data_cms_tool(action: "list_collection_items", collection_id, name: "Pikachu")

# Good - Filter by slug when you know the slug
data_cms_tool(action: "list_collection_items", collection_id, slug: "pikachu")

# Bad - Fetching all items then searching through results
data_cms_tool(action: "list_collection_items", collection_id)  # Returns 100 items
# Then manually searching for "Pikachu" in results...
```

- ALWAYS use `name` or `slug` parameters when searching for specific items
- This reduces API calls, response size, and token usage
- Only fetch unfiltered lists when displaying all items or when the target is unknown

### Phase 3: Validation Rules

**Field Name Validation:**
- Check all field names exist in schema
- Case-sensitive matching
- Suggest corrections for typos
- Example: "autor" → Did you mean "author"?

**Required Fields:**
- `name` and `slug` are ALWAYS required for Webflow CMS
- Check collection-specific required fields from schema
- List all missing required fields clearly
- Cannot proceed if required fields missing

**Field Type Validation:**

**PlainText:**
- Check max length constraints
- Validate patterns if specified
- No HTML allowed

**RichText:**
- Must be valid HTML
- Check for unclosed tags
- Allow common HTML elements

**Image/File:**
- Accept file IDs or URLs
- Validate file exists (if possible)
- Optional alt text

**Switch (Boolean):**
- Accept: true/false, yes/no, 1/0
- Normalize to boolean

**Color:**
- Must be hex format (#RRGGBB)
- Validate hex characters
- Example: #FF5733 ✓, red ✗

**Reference Fields:**
- Must reference existing item IDs
- Validate referenced items exist
- Show referenced item names for clarity

**Slug Validation:**
- CRITICAL: Must be alphanumeric with hyphens only
- No spaces, underscores, or special characters
- Max 256 characters
- Must be unique (check against existing + batch)
- Auto-suggest slugs from titles if missing
- Example:
  - ❌ "My Post!" → ⚠️ Contains special characters
  - ✅ "my-post" → Valid

**Constraint Validation:**
- Max length: Warn if approaching limit, error if exceeds
- Patterns: Test regex patterns from schema
- Allowed values: Check against enumerated options

### Phase 4: Preview & Approval

**Preview Format:**

For **Create Operations:**
```
[1] ✓ NEW POST
    field1: "value1"
    field2: "value2"
    field3: "value3"
    ✅ All validations passed
```

For **Update Operations:**
```
[2] ✓ UPDATE EXISTING
    Item ID: xxx
    Slug: existing-slug

    Changes:
      field1: "old value" → "new value"
      field2: (no change)
      field3: "old" → "new"

    ✅ All validations passed
```

For **Items with Warnings:**
```
[3] ⚠️ NEW POST
    name: "Title"
    ⚠️ Warning: Missing optional field 'post-body'
    ⚠️ Warning: Slug may be too generic
    ✅ Can proceed (warnings only)
```

For **Items with Errors:**
```
[4] ❌ NEW POST
    name: "Title!!!"
    slug: "bad slug"
    ❌ Error: slug contains spaces
    ❌ Error: name has special characters
    🔴 Cannot proceed - must fix errors
```

**Granular Approval:**
- Number each item: [1], [2], [3]...
- Allow selective processing
- Accept formats:
  - "all" - process everything
  - "none" - cancel operation
  - "1,3,5" - process items 1, 3, and 5
  - "1-5" - process items 1 through 5
  - "2" - skip only item 2, process rest

**Publish Options:**
- Immediate publish: Use `*_live` endpoints (recommended)
- Draft mode: Use regular endpoints, publish later
- Explain implications of each choice

### Phase 5: Execution & Reporting

**Batch Processing:**
- Maximum 50 items per batch
- Show progress bar:
  ```
  Processing: ████████░░ 80% (40/50 items)
  ```
- Estimated time remaining
- Handle rate limits (pause/retry)

**Error Handling:**

**For Single Item Failures:**
```
Processing item 3/10...
❌ Failed: "Post Title"
   Error: Slug already exists
   → Skipping to next item
```

**Continue Processing:**
- Don't fail entire batch for one error
- Track all successes and failures
- Report both separately

**For Critical Failures:**
```
❌ Critical Error: API connection lost

Items processed before error: 7/50
- 5 created successfully
- 2 updated successfully
- 43 not processed

Retry failed items? (yes/no)
```

**Success Report Format:**
```
✅ Operation Complete

Created: 25 items
- Show first 5 with IDs
- "[+20 more]" if > 5

Updated: 10 items
- Show first 5 with IDs
- "[+5 more]" if > 5

Failed: 2 items
- "Item Name": Error reason
- "Item Name": Error reason

Total time: 12.5 seconds
Items per second: 2.8
```

**Rollback Capability:**

**Store Before Changes:**
```json
{
  "timestamp": "2026-01-09T20:24:44Z",
  "operations": [
    {
      "type": "update",
      "itemId": "xxx",
      "originalValues": {
        "name": "Old Title",
        "featured": false
      },
      "newValues": {
        "name": "New Title",
        "featured": true
      }
    }
  ]
}
```

**Offer Rollback:**
```
📋 Rollback Available:
Last update: 15 items modified 2 minutes ago

Rollback will:
- Restore 10 updated items to previous values
- Delete 5 newly created items

⚠️ Type "undo" to rollback all changes
⚠️ Rollback expires in 3 minutes
```

### Performance Optimization

**Batch Size:**
- Default: 50 items per batch
- Adjust based on field complexity
- Heavy images: 20 items per batch
- Simple text fields: 100 items per batch

**Progress Indicators:**
```
Creating items...
Batch 1/3: ████████████████████ 100% (50/50)
Batch 2/3: ████████████████████ 100% (50/50)
Batch 3/3: ██████░░░░░░░░░░░░░░ 30% (15/50)
```

**Rate Limiting:**
- Respect Webflow API rate limits
- Pause between batches if needed
- Show user why waiting
- Retry failed requests automatically (max 3 attempts)

### Error Messages

**Clear and Actionable:**

❌ **Bad:**
```
"Error: validation failed"
```

✅ **Good:**
```
"Validation Error on item 3:
 - Slug 'my post' contains spaces
 - Change to: 'my-post' (alphanumeric with hyphens only)"
```

**Error Categories:**
- 🔴 **Critical**: Cannot proceed at all (API down, invalid auth)
- ❌ **Error**: This item cannot be processed (fix or skip)
- ⚠️ **Warning**: Can proceed but not recommended (missing optional fields)
- 💡 **Suggestion**: Best practices (slug too generic, summary too short)

### Best Practices

**Always:**
- ✅ Show preview before any changes
- ✅ Require explicit confirmation
- ✅ Validate all data thoroughly
- ✅ Process in batches for large operations
- ✅ Report successes and failures separately
- ✅ Offer rollback for recent changes
- ✅ Use granular approval for flexibility

**Never:**
- ❌ Apply changes without user confirmation
- ❌ Fail entire batch for single item error
- ❌ Assume field names or values
- ❌ Process without validating first
- ❌ Hide validation warnings from user

**Edge Cases:**
- Duplicate slugs: Auto-append number (post-title-2)
- Missing optional fields: Leave empty (don't invent values)
- Large batches: Warn about processing time
- Reference fields: Validate targets exist
- Image fields: Accept URLs or file IDs

**User Experience:**
- Show collection schema upfront
- Number items for easy reference
- Use visual hierarchy (├── └──)
- Provide actionable error messages
- Estimate processing time
- Allow cancellation mid-process