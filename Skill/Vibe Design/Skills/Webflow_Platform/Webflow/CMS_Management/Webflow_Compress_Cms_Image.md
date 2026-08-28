---
title: "Webflow Skill: Webflow Compress Cms Image"
tags: [webflow, mcp, skill, webflow-compress-cms-image]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Webflow Compress Cms Image

> **Имя скилла:** `webflow-compress-cms-image`  
> **Локальный путь:** `/root/.agent/skills/webflow-compress-cms-image/SKILL.md`

---

# Webflow CMS Image Compression

Compress and reformat image fields on a Webflow CMS item to `.webp` or `.avif`.

This skill does not support images embedded inside Rich Text fields at this time. Tell the user that limitation before starting and only process CMS fields whose schema type is `Image` or `MultiImage`.

## Important Note

**ALWAYS use Webflow MCP tools for Webflow operations:**
- Use Webflow MCP's `data_sites_tool` with action `list_sites` to discover the site ID when needed
- Use Webflow MCP's `data_cms_tool` with action `get_collection_details` to fetch collection schemas
- Use Webflow MCP's `data_cms_tool` with action `list_collection_items` to fetch the target CMS item
- Use Webflow MCP's `data_assets_tool` with action `create_asset` to create presigned asset uploads
- Use Webflow MCP's `data_cms_tool` with action `update_collection_items` to update CMS image fields
- Use Webflow MCP's `data_cms_tool` with action `publish_collection_items` to publish the updated item
- All Webflow MCP calls must include the required `context` parameter (15-25 words, third-person perspective)
- Mutating operations require explicit user confirmation. Ask the user to type `confirm` before uploading assets, updating CMS fields, or publishing.
- Rich Text embedded images are not supported. Do not parse or rewrite Rich Text HTML for image compression.

## Instructions

### Phase 1: Gather Parameters

Collect all required inputs in one shot when possible:

1. **Collection ID**: Ask "What is the Collection ID?"
2. **Item ID**: Ask "What is the Item ID?"
3. **Image fields**: Ask "Which image fields should be compressed?"
   - "All image fields" - compress every Image or MultiImage field found on the item
   - "Specify field names" - user will name specific field slugs
4. **Target format**: Ask "Target format?"
   - "webp (Recommended)" - best browser support, good compression
   - "avif" - better compression, slightly less support
5. **Quality (1-100)**: Ask "Quality (1-100)?"
   - "85 - Recommended (webp)" - visually lossless for most photos
   - "75 - Recommended (avif)" - avif is efficient at lower quality
   - "Custom" - user types their own value

If the user chose "Specify field names", follow up for comma-separated field slugs. If the user chose "Custom" quality, follow up for the numeric value. Validate custom quality is an integer from 1 to 100.

### Phase 2: Discover Image Fields

1. Call `data_cms_tool` with action `get_collection_details` and the collection ID.
2. Filter fields where `type === "Image"` or `type === "MultiImage"`.
3. Select target fields:
   - If the user chose "All image fields", use every Image and MultiImage field found.
   - If the user named specific fields, validate each slug exists and is an Image or MultiImage field.
   - Warn and skip requested fields that do not exist or are not image fields.
4. Stop and report if no valid image fields remain.

### Phase 3: Fetch the CMS Item

Call `data_cms_tool` with action `list_collection_items` to fetch the target item. Use the item ID to identify the item directly when the tool supports it; otherwise filter or search the returned items.

Extract current `fieldData` for each target field:
- For Image fields, capture `url` and `fileId`.
- For MultiImage fields, capture each array entry's `url` and `fileId`.
- Skip null, empty, or malformed image values.
- Skip images already in the target format unless the user explicitly asks to recompress them.

### Phase 4: Preview and Confirm

Before downloading or uploading anything, show a preview:

```markdown
Compression Preview

Collection: [collection ID]
Item: [item ID]
Target format: webp
Quality: 85

Fields to process:
- main-image: hero.jpg -> hero.webp
- gallery: 3 images -> webp

Skipped:
- thumbnail: already webp

Type `confirm` to download, convert, upload, update the CMS item, and publish.
```

Proceed only after the user types `confirm`.

### Phase 5: Convert Each Image

For each image:

1. Download to `/tmp/`:

```bash
curl -sL "{url}" -o "/tmp/cms_img_{fieldSlug}_{index}.orig"
```

2. Ensure Pillow is available:

```bash
python3 -c "from PIL import Image" 2>/dev/null || pip3 install Pillow -q
```

For avif, also try:

```bash
pip3 install pillow-avif-plugin -q
```

3. Convert with the user's quality setting:

```bash
python3 - <<'EOF'
from PIL import Image
import os

try:
    import pillow_avif
except ImportError:
    pass

source = "/tmp/cms_img_{fieldSlug}_{index}.orig"
target = "/tmp/cms_img_{fieldSlug}_{index}.{ext}"
img = Image.open(source)
img.save(target, "{FORMAT}", quality={quality})
orig = os.path.getsize(source)
new = os.path.getsize(target)
print(f"Original: {orig:,} bytes -> {FORMAT}: {new:,} bytes ({(1 - new / orig) * 100:.1f}% smaller)")
EOF
```

If avif conversion fails, report the error and ask whether to fall back to webp or abort.

4. Compute the MD5 hash of the converted file:

```bash
md5 -q "/tmp/cms_img_{fieldSlug}_{index}.{ext}"
```

On Linux:

```bash
md5sum "/tmp/cms_img_{fieldSlug}_{index}.{ext}" | cut -d' ' -f1
```

### Phase 6: Upload to Webflow Assets

For each converted file:

1. Determine `site_id`. If it is not known from the collection or prior context, call `data_sites_tool` with action `list_sites`. If multiple sites are available, ask the user which one owns the collection.
2. Call `data_assets_tool` with action `create_asset`:
   - `site_id`: the target site ID
   - `file_name`: original base name plus the new extension, such as `hero.webp`
   - `file_hash`: the MD5 hex string
3. Capture the response values:
   - `uploadUrl`: S3 endpoint
   - `uploadDetails`: form fields
   - `id`: new asset ID
   - `hostedUrl`: CDN URL to use as the CMS source reference
4. POST to S3 as multipart/form-data. Map `uploadDetails` keys to curl fields:
   - `xAmzAlgorithm` -> `X-Amz-Algorithm`
   - `xAmzCredential` -> `X-Amz-Credential`
   - `xAmzDate` -> `X-Amz-Date`
   - `xAmzSignature` -> `X-Amz-Signature`
   - `successActionStatus` -> `success_action_status`
   - `contentType` -> `Content-Type`
   - `cacheControl` -> `Cache-Control`
   - Pass `acl`, `bucket`, `key`, and `policy` as-is
   - Append the file last: `-F "file=@/tmp/cms_img_{fieldSlug}_{index}.{ext};type=image/{ext}"`
5. Expect HTTP 201. If the response is not 201, log the response body and report the upload error. Presigned URLs have a one-hour TTL; restart from asset creation if the URL expires.

### Phase 7: Update and Publish

Call `data_cms_tool` with action `update_collection_items` using only fields that were successfully converted and uploaded.

For Image fields, set:

```json
{
  "fieldSlug": {
    "fileId": "{newAssetId}",
    "url": "{hostedUrl}"
  }
}
```

For MultiImage fields, reconstruct the full image array and replace only successfully processed entries with the new `{ "fileId", "url" }` values. Preserve skipped entries exactly as they were.

After a successful update, call `data_cms_tool` with action `publish_collection_items` for the item ID. The CMS may re-process the image and generate its own CDN URL; the `hostedUrl` from the asset upload is the source reference.

### Phase 8: Report Results

Print a concise summary table:

| Field | Original | Converted | Savings |
|-------|----------|-----------|---------|
| main-image | 118,044 B (JPEG) | 113,260 B (webp) | 4.1% |

Also report:
- Fields skipped because they were null, empty, malformed, already in the target format, or not image fields
- Conversion failures and whether the user chose fallback or abort
- Upload failures, including response bodies when available
- New asset IDs for uploads that succeeded when a later CMS update or publish failed

## Examples

**User prompt:**

```text
Compress the main image on this CMS item to webp.
```

**Response flow:**

```markdown
I need the collection ID, item ID, image fields, target format, and quality before compressing the CMS image.

Compression Preview

Collection: 65f...
Item: 66a...
Target format: webp
Quality: 85

Fields to process:
- main-image: blog-hero.jpg -> blog-hero.webp

Type `confirm` to download, convert, upload, update the CMS item, and publish.
```

**Final report:**

```markdown
CMS Image Compression Complete

| Field | Original | Converted | Savings |
|-------|----------|-----------|---------|
| main-image | 842,911 B (JPEG) | 214,330 B (webp) | 74.6% |

Updated and published item 66a...
```

## Guidelines

- Handle one CMS item at a time. For bulk operations across many items, rerun the skill for each item or extend the workflow with an explicit loop.
- Do not delete the original JPEG or PNG from Webflow's asset store; only update the CMS field reference.
- Preserve filenames by stripping the original extension and appending the target extension. Avoid double extensions such as `hero.jpg.webp`.
- Continue processing other selected fields after a single image conversion or upload failure unless the failed field is the only target.
- Never update or publish the CMS item if no image was successfully converted and uploaded.
- Keep a local in-memory rollback note with the original image field values and include it in the final report when an update succeeds.