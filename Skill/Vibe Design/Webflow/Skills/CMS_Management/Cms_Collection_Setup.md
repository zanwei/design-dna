---
title: "Webflow Skill: Cms Collection Setup"
tags: [webflow, mcp, skill, cms-collection-setup]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Cms Collection Setup

> **Имя скилла:** `cms-collection-setup`  
> **Локальный путь:** `/root/.agent/skills/cms-collection-setup/SKILL.md`

---

# CMS Collection Setup

Create a new CMS collection with custom fields, relationships, and proper configuration.

## Important Note

**ALWAYS use Webflow MCP tools for all operations:**
- Use Webflow MCP's `webflow_guide_tool` to get best practices before starting
- Use Webflow MCP's `data_sites_tool` with action `list_sites` to identify available sites
- Use Webflow MCP's `data_sites_tool` with action `get_site` to retrieve site details and plan limits
- Use Webflow MCP's `data_cms_tool` with action `get_collection_list` to check for naming conflicts
- Use Webflow MCP's `data_cms_tool` with action `create_collection` to create the collection
- Use Webflow MCP's `data_cms_tool` with action `create_collection_static_field` to create static fields
- Use Webflow MCP's `data_cms_tool` with action `create_collection_option_field` to create option fields
- Use Webflow MCP's `data_cms_tool` with action `create_collection_reference_field` to create reference/multi-reference fields
- Use Webflow MCP's `data_cms_tool` with action `get_collection_details` to verify collection was created correctly
- DO NOT use any other tools or methods for Webflow operations
- All tool calls must include the required `context` parameter (15-25 words, third-person perspective)

## Instructions

### Phase 1: Site Selection & Discovery
1. **Get site information**: Use Webflow MCP's `data_sites_tool` with action `list_sites` to identify target site
2. **Confirm site**: Ask user to select site if multiple available
3. **Check plan limits**: Use Webflow MCP's `data_sites_tool` with action `get_site` to verify collection limits
4. **List existing collections**: Use Webflow MCP's `data_cms_tool` with action `get_collection_list` to check for conflicts
5. **Validate naming**: Ensure new collection name doesn't conflict with existing

### Phase 2: Requirements Gathering
6. **Get collection details**: Ask user for:
   - Collection display name (e.g., "Blog Posts")
   - Singular name (e.g., "Blog Post")
   - Optional: Custom slug (default: auto-generated from display name)
7. **Get field definitions**: For each field, gather:
   - Field name (e.g., "Author Name", "Publish Date")
   - Field type (Text, Rich Text, Image, Option, Reference, etc.)
   - Required vs optional
   - Any validation rules or help text
8. **Identify relationships**: Determine if collection needs:
   - Reference fields (one-to-many relationships)
   - Multi-reference fields (many-to-many relationships)
   - Option fields (controlled vocabulary)

### Phase 3: Schema Validation & Planning
9. **Validate field types**: Check all field types are supported
10. **Check field limits**: Ensure within Webflow limits:
    - Max fields per collection: varies by plan
    - Max 5 multi-reference fields per collection
11. **Plan creation order**: Organize fields by dependency:
    - Create collections in order if references exist
    - Create referenced collections first
    - Create option fields before reference fields
12. **Generate preview**: Show complete schema with all fields

### Phase 4: User Approval
13. **Show complete preview**: Display:
    - Collection name and slug
    - All fields with types and properties
    - Any relationships to other collections
    - Plan limit verification
14. **Validate schema**: Check for common issues:
    - Missing required fields (name, slug always required)
    - Invalid field types
    - Reference to non-existent collections
    - Exceeding plan limits
15. **Request confirmation**: Wait for explicit "create" approval

### Phase 5: Collection Creation
16. **Create collection**: Use Webflow MCP's `data_cms_tool` with action `create_collection` with:
    - Display name
    - Singular name
    - Optional slug
17. **Capture collection ID**: Save for field creation
18. **Show progress**: Report collection created successfully

### Phase 6: Field Creation
19. **Create fields in order**: For each field:
    - Use appropriate creation tool based on type
    - Static fields: `data_cms_tool` with action `create_collection_static_field`
    - Option fields: `data_cms_tool` with action `create_collection_option_field`
    - Reference fields: `data_cms_tool` with action `create_collection_reference_field`
20. **Set field properties**:
    - Display name
    - Required flag
    - Help text (if provided)
    - Validation rules (if applicable)
21. **Show progress**: Report each field created
22. **Handle errors**: If field creation fails, report and continue

### Phase 7: Verification & Reporting
23. **Verify collection**: Use Webflow MCP's `data_cms_tool` with action `get_collection_details` to retrieve full schema
24. **Confirm all fields**: Check that all requested fields were created
25. **Generate report**: Show:
    - Collection ID
    - Collection name and slug
    - All fields created with IDs
    - Any failures or warnings
26. **Provide next steps**: Suggest:
    - Use bulk-cms-update to add initial items
    - Create collection pages in Designer
    - Set up relationships if applicable

## Field Type Reference

### Static Field Types

**PlainText** - Short text (max 256 chars) or long text
- Use for: Titles, names, descriptions, excerpts
- Properties: maxLength validation (256 for short)
- Example: "Title", "Author Name", "Excerpt"

**RichText** - Formatted text with HTML
- Use for: Blog content, bios, articles, long descriptions
- Properties: No length limit
- Example: "Post Content", "Bio", "Description"

**Email** - Email address
- Use for: Contact emails, author emails
- Properties: Email format validation
- Example: "Contact Email", "Author Email"

**Phone** - Phone number
- Use for: Contact numbers
- Properties: E.164 format
- Example: "Phone Number", "Mobile"

**Link** - External URL or internal link
- Use for: Website links, social media, external resources
- Properties: URL validation
- Example: "Website", "LinkedIn Profile"

**Number** - Numeric values
- Use for: Prices, ratings, counts, order numbers
- Properties: Integer or decimal
- Example: "Price", "Rating", "Order"

**Image** - Single image
- Use for: Featured images, photos, thumbnails
- Properties: Max 4MB per image
- Example: "Featured Image", "Photo", "Thumbnail"

**MultiImage** - Multiple images (up to 25)
- Use for: Galleries, product photos
- Properties: Max 25 images, 4MB each
- Example: "Gallery", "Product Photos"

**File** - File upload
- Use for: PDFs, documents, downloads
- Properties: Max 4MB per file
- Example: "Resume PDF", "Brochure", "Manual"

**Video** - Video embed (YouTube/Vimeo)
- Use for: Video content
- Properties: Embed URL
- Example: "Tutorial Video", "Demo"

**DateTime** - Date and/or time
- Use for: Publish dates, event dates, deadlines
- Properties: ISO 8601 format
- Example: "Publish Date", "Event Date"

**Switch** - Boolean (true/false)
- Use for: Featured flags, visibility toggles
- Properties: Boolean value
- Example: "Featured", "Published", "Active"

**Color** - Color value
- Use for: Theme colors, accents, brand colors
- Properties: Hex format
- Example: "Brand Color", "Accent Color"

### Option Field Type

**Option** - Single choice from predefined list
- Use for: Status, category, type, priority
- Properties: List of option names
- Example: "Status" (Draft, Review, Published)
- Creation: Use `data_cms_tool` with action `create_collection_option_field` with options array

**Example:**
```json
{
  "type": "Option",
  "displayName": "Status",
  "metadata": {
    "options": [
      {"name": "Draft"},
      {"name": "In Review"},
      {"name": "Published"}
    ]
  }
}
```

### Reference Field Types

**Reference** - Link to one item in another collection (one-to-many)
- Use for: Author → Post, Category → Post, Brand → Product
- Properties: Collection ID of referenced collection
- Example: "Author" (reference to Authors collection)
- Creation: Use `data_cms_tool` with action `create_collection_reference_field` with collectionId

**MultiReference** - Link to multiple items in another collection (many-to-many)
- Use for: Post → Tags, Product → Features, Project → Technologies
- Properties: Collection ID of referenced collection
- Limit: Max 5 multi-reference fields per collection
- Example: "Tags" (reference to Tags collection)
- Creation: Use `data_cms_tool` with action `create_collection_reference_field` with collectionId

**Reference Field Example:**
```json
{
  "type": "Reference",
  "displayName": "Author",
  "metadata": {
    "collectionId": "abc123..."
  }
}
```

**Multi-Reference Field Example:**
```json
{
  "type": "MultiReference",
  "displayName": "Tags",
  "metadata": {
    "collectionId": "xyz789..."
  }
}
```

## Examples

### Example 1: Simple Blog Collection

**User prompt:**
```
Create a Blog Posts collection with title, content, author, and publish date
```

**Step 1: Discovery**
```
🔍 CMS Collection Setup

Available sites:
1. Company Website
2. Blog Site

Which site? (1/2)
```

**Step 2: After User Selects Site**
```
📊 Existing Collections on Company Website:

Currently: 0 collections
Plan limit: 20 collections (CMS Plan)

✅ You have capacity to create new collections.

---

📋 Collection Requirements

Display Name: Blog Posts
Singular Name: Blog Post
Slug: blog-posts (auto-generated)

Fields to create:
1. Title - Text (required)
2. Content - Rich Text (required)
3. Author - Text
4. Publish Date - Date/Time (required)

Is this correct? (yes/no)
If you want to add/modify fields, describe the changes.
```

**Step 3: Preview**
```
📋 Preview: Create "Blog Posts" Collection

Collection:
├── Display Name: Blog Posts
├── Singular Name: Blog Post
├── Slug: blog-posts
└── Site: Company Website

Fields (6 total):
├── name (PlainText, required) ← Auto-created
├── slug (PlainText, required) ← Auto-created
├── title (PlainText, required)
├── content (RichText, required)
├── author (PlainText)
└── publish-date (DateTime, required)

✅ Validation Passed:
- Collection name available
- Within plan limits (0/20 collections)
- All field types valid
- No dependency issues

⚠️ Type "create" to proceed.
```

**Step 4: Creation**
```
🔄 Creating Collection...

✅ Collection created: Blog Posts (ID: 64f1a2b3...)

Adding fields...
├── ✅ title (PlainText)
├── ✅ content (RichText)
├── ✅ author (PlainText)
└── ✅ publish-date (DateTime)

Progress: ████████████████████ 100% (4/4 fields)

🎉 Collection Setup Complete!

Collection: Blog Posts
ID: 64f1a2b3...
Fields: 6 (2 auto-created + 4 custom)

---

💡 Next Steps:
1. Use bulk-cms-update to add initial blog posts
2. Create collection template page in Designer
3. Set up collection list page for blog index
4. Configure SEO settings for dynamic pages
```

### Example 2: Collection with Relationships

**User prompt:**
```
Create a Products collection with name, price, description, images, brand, and tags
```

**Step 1: After Initial Gathering**
```
📋 Collection Analysis

I see you want:
- Brand: This should be a reference field
- Tags: This should be a multi-reference field

This requires creating additional collections first:
1. Brands collection
2. Tags collection

Then we can create Products with references to them.

Would you like me to:
A) Create all three collections (Brands, Tags, Products)
B) Just create Products (you'll add relationships later)
C) Modify the requirements

Your choice? (A/B/C)
```

**Step 2: After User Selects "A"**
```
📋 Preview: Create 3 Collections

---

### 1. Brands Collection

Fields (4 total):
├── name (PlainText, required) ← Auto
├── slug (PlainText, required) ← Auto
├── logo (Image)
└── description (PlainText)

---

### 2. Tags Collection

Fields (3 total):
├── name (PlainText, required) ← Auto
├── slug (PlainText, required) ← Auto
└── color (Color)

---

### 3. Products Collection

Fields (9 total):
├── name (PlainText, required) ← Auto
├── slug (PlainText, required) ← Auto
├── price (Number, required)
├── description (RichText)
├── images (MultiImage)
├── brand (Reference → Brands)
└── tags (MultiReference → Tags)

---

Creation Order:
1. Brands (no dependencies)
2. Tags (no dependencies)
3. Products (references 1 & 2)

✅ Validation:
- All collections available
- Within plan limits (0/20 collections)
- Multi-reference limit: 1/5 ✅
- All dependencies resolvable

⚠️ Type "create" to proceed with all 3 collections.
```

**Step 3: Creation**
```
🔄 Creating Collections...

[1/3] Creating Brands...
✅ Brands collection created (ID: abc123...)
├── ✅ logo (Image)
└── ✅ description (PlainText)

[2/3] Creating Tags...
✅ Tags collection created (ID: def456...)
└── ✅ color (Color)

[3/3] Creating Products...
✅ Products collection created (ID: ghi789...)
├── ✅ price (Number)
├── ✅ description (RichText)
├── ✅ images (MultiImage)
├── ✅ brand (Reference → Brands)
└── ✅ tags (MultiReference → Tags)

Progress: ████████████████████ 100% (3/3 collections)

🎉 All Collections Created!

Summary:
├── Brands (ID: abc123...)
├── Tags (ID: def456...)
└── Products (ID: ghi789...)

---

💡 Next Steps:
1. Add brand items first (use bulk-cms-update)
2. Add tag items (use bulk-cms-update)
3. Then add products with brand/tag references
4. Create collection pages in Designer
```

### Example 3: Team Members with Option Field

**User prompt:**
```
Create a Team Members collection with name, role (dropdown: Designer, Developer, Manager), bio, photo, email
```

**Step 1: Preview**
```
📋 Preview: Create "Team Members" Collection

Collection:
├── Display Name: Team Members
├── Singular Name: Team Member
└── Slug: team-members

Fields (7 total):
├── name (PlainText, required) ← Auto
├── slug (PlainText, required) ← Auto
├── role (Option, required)
│   Options:
│   ├── Designer
│   ├── Developer
│   └── Manager
├── bio (RichText)
├── photo (Image)
└── email (Email)

✅ Validation Passed

⚠️ Type "create" to proceed.
```

**Step 2: Creation**
```
🔄 Creating Collection...

✅ Collection created: Team Members (ID: jkl012...)

Adding fields...
├── ✅ role (Option: 3 options)
├── ✅ bio (RichText)
├── ✅ photo (Image)
└── ✅ email (Email)

Progress: ████████████████████ 100% (4/4 fields)

🎉 Collection Setup Complete!

Collection: Team Members
Fields: 6 (2 auto + 4 custom)

Field Details:
- role: Option field with 3 choices
  • Designer
  • Developer
  • Manager

---

💡 Next Steps:
1. Add team member items
2. Create team page in Designer
3. Consider adding:
   - LinkedIn profile (Link field)
   - Years of experience (Number field)
   - Specializations (MultiReference to Skills collection)
```

### Example 4: Complex E-commerce Setup

**User prompt:**
```
Create an e-commerce setup with Products, Categories, Brands, and Features
```

**Step 1: Requirements Clarification**
```
📋 E-commerce Collection Planning

I'll create 4 collections:

1. **Categories** - Product categories
2. **Brands** - Product brands
3. **Features** - Product features (e.g., "Waterproof", "Wireless")
4. **Products** - Main product catalog

Relationships:
- Product → Category (Reference)
- Product → Brand (Reference)
- Product → Features (MultiReference)

Fields per collection:

**Categories:**
- Name, Slug (auto)
- Description
- Parent Category (self-reference for hierarchy)
- Icon

**Brands:**
- Name, Slug (auto)
- Logo
- Description

**Features:**
- Name, Slug (auto)
- Icon
- Description

**Products:**
- Name, Slug (auto)
- Price
- Sale Price
- Description
- Images (MultiImage)
- Category (Reference → Categories)
- Brand (Reference → Brands)
- Features (MultiReference → Features)
- In Stock (Switch)
- SKU (PlainText)

Is this structure good? (yes/modify/cancel)
```

**Step 2: Preview (User says "yes")**
```
📋 Preview: Create E-commerce Collections

---

### Collection 1: Categories

Fields (5 total):
├── name (PlainText, required)
├── slug (PlainText, required)
├── description (PlainText)
├── parent-category (Reference → Categories) ← Self-reference
└── icon (Image)

---

### Collection 2: Brands

Fields (4 total):
├── name (PlainText, required)
├── slug (PlainText, required)
├── logo (Image)
└── description (PlainText)

---

### Collection 3: Features

Fields (4 total):
├── name (PlainText, required)
├── slug (PlainText, required)
├── icon (Image)
└── description (PlainText)

---

### Collection 4: Products

Fields (12 total):
├── name (PlainText, required)
├── slug (PlainText, required)
├── price (Number, required)
├── sale-price (Number)
├── description (RichText)
├── images (MultiImage)
├── category (Reference → Categories)
├── brand (Reference → Brands)
├── features (MultiReference → Features)
├── in-stock (Switch)
└── sku (PlainText)

---

Creation Order:
1. Categories (self-reference OK)
2. Brands (no dependencies)
3. Features (no dependencies)
4. Products (references 1, 2, 3)

✅ Validation:
- Within plan limits (0/20 collections)
- Multi-reference count: 1/5 ✅
- All field types valid
- Self-reference supported

⚠️ Type "create" to proceed with all 4 collections.
```

**Step 3: Creation with Progress**
```
🔄 Creating E-commerce Collections...

[1/4] Creating Categories...
✅ Categories created (ID: aaa111...)
Progress: ████████░░░░░░░░░░░░ 25%

[2/4] Creating Brands...
✅ Brands created (ID: bbb222...)
Progress: ████████████░░░░░░░░ 50%

[3/4] Creating Features...
✅ Features created (ID: ccc333...)
Progress: ████████████████░░░░ 75%

[4/4] Creating Products...
✅ Products created (ID: ddd444...)
Progress: ████████████████████ 100%

---

🎉 E-commerce Setup Complete!

Collections Created (4):
├── Categories (ID: aaa111..., 5 fields)
├── Brands (ID: bbb222..., 4 fields)
├── Features (ID: ccc333..., 4 fields)
└── Products (ID: ddd444..., 12 fields)

Relationships Configured:
- Products → Categories (one-to-many)
- Products → Brands (one-to-many)
- Products → Features (many-to-many)
- Categories → Parent Category (self-reference)

---

💡 Recommended Content Order:
1. Add categories first (including parent relationships)
2. Add brands
3. Add features
4. Finally add products (with all references)

💡 Next Steps:
1. Use bulk-cms-update for initial data
2. Create product template page
3. Create product listing page with filters
4. Set up category landing pages
5. Configure e-commerce integration
```

## Guidelines

### Phase 1: Discovery Best Practices

**Site Selection:**
- Always use `data_sites_tool` with action `list_sites` to get available sites
- Never assume site ID
- Verify user has correct site selected

**Plan Limit Checking:**
```
Check limits before creation:
- Starter: 1 collection, 50 items
- Basic: 2 collections, 200 items
- CMS: 20 collections, 2,000 items
- Business: 40 collections, 10,000 items
- Enterprise: Custom

Warn user if approaching limits.
```

**Naming Conflict Prevention:**
- Check existing collection names
- Suggest alternative names if conflict
- Validate slug availability

### Phase 2: Requirements Gathering Best Practices

**Display Name vs Singular Name:**
```
Display Name: Plural form shown in CMS
Singular Name: Singular form for individual items

Examples:
- Display: "Blog Posts" → Singular: "Blog Post"
- Display: "Team Members" → Singular: "Team Member"
- Display: "Products" → Singular: "Product"
- Display: "Categories" → Singular: "Category"
```

**Field Naming Conventions:**
```
✅ Good names:
- author-name (descriptive, hyphenated)
- publish-date (clear purpose)
- featured-image (specifies which)
- main-content (explains use)

❌ Bad names:
- text1 (meaningless)
- field (too generic)
- data (unclear)
- img (which image?)
```

**Detecting Relationships:**
```
If user says:
"... with author" → Likely reference field
"... with tags" → Likely multi-reference field
"... with category" → Likely reference field
"... with related products" → Likely multi-reference field

Ask clarifying questions:
- Is [author] the same across items? → Reference
- Can items have multiple [tags]? → Multi-reference
- Do you have a [Categories] collection? → Check existence
```

### Phase 3: Schema Validation Best Practices

**Field Type Validation:**
```
Common field type mappings:

User says... → Field type:
"title", "name" → PlainText
"description", "summary" → PlainText (long)
"content", "bio", "article" → RichText
"photo", "image", "thumbnail" → Image
"gallery", "photos" → MultiImage
"document", "PDF", "file" → File
"video" → Video
"link", "URL", "website" → Link
"email" → Email
"phone", "mobile" → Phone
"price", "cost", "amount" → Number
"date", "published", "deadline" → DateTime
"featured", "active", "published" → Switch
"status", "type", "category" → Option (if fixed choices)
"color", "theme" → Color
```

**Multi-Reference Limit Check:**
```
Count multi-reference fields requested:

If > 5:
⚠️ Warning: Collection Limit Exceeded

Webflow allows max 5 multi-reference fields per collection.

You requested: 7 multi-reference fields

Options:
1. Choose 5 most important relationships
2. Convert some to reference fields (one-to-many)
3. Create bridging collections
4. Use option fields for simple categorization

Which would you prefer?
```

**Dependency Resolution:**
```
For reference fields:
1. Check if referenced collection exists
2. If not, add to creation queue
3. Create in correct order

Example:
Products needs:
- Categories collection (create first)
- Brands collection (create first)
Then create Products
```

### Phase 4: Preview Best Practices

**Complete Preview Format:**
```
📋 Preview: Create "[Collection Name]"

Collection Details:
├── Display Name: [Name]
├── Singular Name: [Singular]
├── Slug: [slug]
└── Site: [Site Name]

Fields ([X] total):
├── name (PlainText, required) ← Auto-created
├── slug (PlainText, required) ← Auto-created
├── [field-1] ([Type], [required/optional])
├── [field-2] ([Type], [required/optional])
│   [Additional info if Option or Reference]
└── [field-n] ([Type], [required/optional])

Relationships:
├── [field] → [Collection] (Reference)
└── [field] → [Collection] (MultiReference)

✅ Validation Results:
- Collection name available: Yes
- Within plan limits: X/Y collections
- Multi-reference count: X/5
- All field types valid: Yes
- Dependencies resolved: Yes

⚠️ Type "create" to proceed.
```

**Validation Checks:**
```
Before showing preview:
1. ✅ Collection name available
2. ✅ Within plan collection limit
3. ✅ All field types supported
4. ✅ Multi-reference limit ≤ 5
5. ✅ Referenced collections exist or queued
6. ✅ No circular dependencies
7. ✅ Field names follow conventions
```

### Phase 5: Creation Best Practices

**Collection Creation:**
```
Required fields:
- displayName (required)
- singularName (required)
- slug (optional, auto-generated if omitted)

Always include both names for clarity:
✅ {"displayName": "Blog Posts", "singularName": "Blog Post"}
❌ {"displayName": "Blog Posts"} (missing singular)
```

**Error Handling:**
```
If collection creation fails:
❌ Collection Creation Failed

Error: [Error message from API]

Common causes:
- Collection name already exists
- Invalid characters in name/slug
- Plan limit reached
- API authentication issue

Would you like to:
1. Try a different collection name
2. Check existing collections
3. Upgrade plan
4. Cancel operation
```

### Phase 6: Field Creation Best Practices

**Field Creation Order:**
```
Create fields in this order:
1. Static fields (Text, Rich Text, Number, etc.)
2. Option fields (with options defined)
3. Reference fields (after referenced collections exist)

For each field:
- Set displayName
- Set isRequired flag
- Add helpText if provided by user
- Set validation rules if applicable
```

**Field Creation Tools:**
```
Field Type → Tool to use:

PlainText, RichText, Email, Phone, Link, Number,
Image, MultiImage, File, Video, DateTime, Switch, Color
→ data_cms_tool with action create_collection_static_field

Option
→ data_cms_tool with action create_collection_option_field
   (requires metadata.options array)

Reference, MultiReference
→ data_cms_tool with action create_collection_reference_field
   (requires metadata.collectionId)
```

**Progress Reporting:**
```
For each field created:
✅ [field-name] ([FieldType])

If field fails:
❌ [field-name] - [Error message]

Continue with remaining fields even if one fails.
Report all failures at end.
```

**Option Field Creation:**
```
{
  "type": "Option",
  "displayName": "Status",
  "isRequired": false,
  "metadata": {
    "options": [
      {"name": "Draft"},
      {"name": "Published"},
      {"name": "Archived"}
    ]
  }
}

Notes:
- Options have name property
- Options cannot have ID (auto-generated)
- Minimum 2 options required
- Maximum: unlimited
```

**Reference Field Creation:**
```
{
  "type": "Reference",
  "displayName": "Author",
  "isRequired": true,
  "metadata": {
    "collectionId": "abc123..."
  }
}

For MultiReference:
{
  "type": "MultiReference",
  "displayName": "Tags",
  "metadata": {
    "collectionId": "def456..."
  }
}

Notes:
- Must provide collectionId of referenced collection
- Referenced collection must already exist
- Max 5 MultiReference fields per collection
```

### Phase 7: Verification Best Practices

**Post-Creation Verification:**
```
After creating collection and fields:
1. Call data_cms_tool with action get_collection_details with collection ID
2. Verify all fields present
3. Check field properties match request
4. Confirm relationships configured correctly
```

**Final Report Format:**
```
🎉 Collection Setup Complete!

Collection: [Name]
ID: [collection-id]
Slug: [slug]

Fields Created ([X]):
├── name (PlainText, required) ← Auto
├── slug (PlainText, required) ← Auto
├── [field-1] ([Type])
├── [field-2] ([Type])
└── [field-n] ([Type])

[If relationships exist]
Relationships:
├── [field] → [Collection]
└── [field] → [Collection]

[If any failures]
⚠️ Failed Fields ([Y]):
├── [field]: [error]
└── [field]: [error]

---

💡 Next Steps:
[Relevant suggestions based on collection type]
```

**Next Steps Suggestions:**
```
For any collection:
1. Use bulk-cms-update to add initial items
2. Create collection template page in Designer
3. Create collection list page
4. Configure SEO settings

For collections with relationships:
5. Create referenced collections first
6. Add items in dependency order
7. Test relationship displays

For e-commerce:
5. Set up payment integration
6. Configure inventory management
7. Create checkout flow
```

### Phase 8: Error Handling

**Common Errors:**

**1. Collection Name Conflict:**
```
❌ Collection Already Exists

A collection named "Blog Posts" already exists on this site.

Existing collection:
- Name: Blog Posts
- ID: xyz789...
- Created: 2025-12-15

Would you like to:
1. Choose a different name
2. View existing collection
3. Add fields to existing collection
4. Cancel
```

**2. Plan Limit Reached:**
```
❌ Plan Limit Reached

Cannot create collection. You've reached your plan limit.

Current: 20/20 collections (CMS Plan)

Options:
1. Upgrade to Business Plan (40 collections)
2. Delete unused collections
3. Contact Webflow support

Would you like me to show your existing collections?
```

**3. Invalid Field Type:**
```
❌ Invalid Field Type

Field type "dropdown" is not supported by Webflow.

Did you mean:
- "Option" - Single choice from list
- "Reference" - Link to another collection
- "MultiReference" - Link to multiple items

Which would you like to use?
```

**4. Referenced Collection Not Found:**
```
❌ Referenced Collection Not Found

Cannot create reference field to "Authors" collection.

Issue: "Authors" collection doesn't exist yet.

Solutions:
1. Create "Authors" collection first
2. Remove reference field for now
3. Let me create both collections in order

Your choice? (1/2/3)
```

**5. Multi-Reference Limit Exceeded:**
```
❌ Too Many Multi-Reference Fields

You requested 6 multi-reference fields.
Webflow limit: 5 per collection

Requested:
1. Tags
2. Categories
3. Related Products
4. Features
5. Certifications
6. Compatible Products ← Exceeds limit

Choose 5 to keep, or convert one to Reference field.
```

### Phase 9: Advanced Scenarios

**Self-Referencing Collections:**
```
Example: Categories with parent categories

Collection: Categories
Fields:
├── name (PlainText, required)
├── slug (PlainText, required)
├── parent-category (Reference → Categories)
└── level (Number) - 1, 2, 3 for hierarchy

Implementation:
{
  "type": "Reference",
  "displayName": "Parent Category",
  "isRequired": false,
  "metadata": {
    "collectionId": "[same-collection-id]"
  }
}

Note: Must create collection first, then add self-reference field
```

**Multi-Collection Setup:**
```
When creating multiple related collections:

1. Identify dependencies:
   - Which collections reference others?
   - What's the creation order?

2. Create in order:
   - Independent collections first
   - Dependent collections after

3. Show overall progress:
   [1/4] Creating Categories...
   [2/4] Creating Brands...
   [3/4] Creating Tags...
   [4/4] Creating Products...

4. Report collectively:
   All 4 collections created successfully!
```

**Complex Option Fields:**
```
For complex dropdowns:

User: "Create status field with Draft, In Review, Approved, Published, Archived"

Option field with 5 choices:
{
  "type": "Option",
  "displayName": "Status",
  "isRequired": true,
  "metadata": {
    "options": [
      {"name": "Draft"},
      {"name": "In Review"},
      {"name": "Approved"},
      {"name": "Published"},
      {"name": "Archived"}
    ]
  }
}

Tip: Use workflow order for options
```

## Production Checklist

Before considering collection setup complete:

### ✅ Discovery
- [ ] Site selected and confirmed
- [ ] Plan limits checked
- [ ] Existing collections listed
- [ ] No naming conflicts
- [ ] User has appropriate permissions

### ✅ Requirements
- [ ] Display name gathered
- [ ] Singular name gathered
- [ ] All fields defined with types
- [ ] Required vs optional specified
- [ ] Relationships identified

### ✅ Validation
- [ ] All field types valid
- [ ] Multi-reference count ≤ 5
- [ ] Referenced collections exist or queued
- [ ] No circular dependencies
- [ ] Field names follow conventions
- [ ] Within plan limits

### ✅ Preview
- [ ] Complete schema shown
- [ ] All fields listed with properties
- [ ] Relationships displayed
- [ ] Validation results shown
- [ ] User confirmation obtained

### ✅ Creation
- [ ] Collection created successfully
- [ ] Collection ID captured
- [ ] All fields created
- [ ] Field creation errors handled
- [ ] Progress shown to user

### ✅ Verification
- [ ] Collection retrieved and verified
- [ ] All fields present
- [ ] Field properties correct
- [ ] Relationships configured
- [ ] Any errors reported

### ✅ Reporting
- [ ] Final summary provided
- [ ] Collection ID shared
- [ ] Fields listed
- [ ] Failures reported (if any)
- [ ] Next steps suggested

### ✅ Error Handling
- [ ] Collection conflicts handled
- [ ] Plan limits checked
- [ ] Invalid field types caught
- [ ] Missing references detected
- [ ] Partial failures reported