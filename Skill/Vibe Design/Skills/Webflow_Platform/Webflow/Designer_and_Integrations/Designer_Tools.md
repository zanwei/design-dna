---
title: "Webflow Skill: Designer Tools"
tags: [webflow, mcp, skill, designer-tools]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Designer Tools

> **Имя скилла:** `designer-tools`  
> **Локальный путь:** `/root/.agent/skills/designer-tools/SKILL.md`

---

# Page Structure

Build, inspect, and manage page elements and components in the Webflow Designer.

## Important Note

**ALWAYS use Webflow MCP tools for all operations:**
- Use Webflow MCP's `webflow_guide_tool` to get best practices **before any other tool call**
- Use Webflow MCP's `data_sites_tool` with action `list_sites` to identify the target site
- Use Webflow MCP's `data_pages_tool` with action `list_pages` to find the target page by name or slug — headless, works against any page
- Use Webflow MCP's `data_pages_tool` with action `create_page` to create new pages — headless
- Use Webflow MCP's `data_element_tool` with action `get_all_elements` or `query_elements` to retrieve or filter page elements — headless, pass the page's ID directly
- Use Webflow MCP's `data_element_builder` to create new elements — headless, pass the page's ID and a parent element ID
- Use Webflow MCP's `data_element_tool` with action `set_attributes`, `set_text`, `set_style`, or `set_link` to modify elements — headless
- Use Webflow MCP's `element_snapshot_tool` to get visual previews of elements before and after changes — this is a Designer tool and requires a Designer connection
- Use Webflow MCP's `data_style_tool` to create and update styles on elements — headless
- Use Webflow MCP's `webflow_guide_tool` to check supported style properties
- Use Webflow MCP's `data_component_tool` with action `get_all_components` or `query_components` to list site components — headless
- Use Webflow MCP's `data_component_tool` with action `get_component` to inspect a component's metadata — headless
- Use Webflow MCP's `data_element_tool` scoped with `scope_component_id` to inspect or edit a component's internal elements (its "content") — headless
- Use Webflow MCP's `data_component_props_tool` to manage prop definitions and set prop values on component instances — headless
- Use Webflow MCP's `data_component_variants_tool` to manage variants and per-variant style overrides — headless
- Use Webflow MCP's `data_component_tool` with action `insert_component_instance` or `unlink_component_instance` to manage component instances on a page — headless, not Designer-gated
- Use Webflow MCP's `designer_tool` only for actions that need a live canvas: `get_current_page`/`switch_page` (what's open in Designer right now), `select_element`/`get_selected_element` (interactive canvas selection), `create_page_folder` (page folders are Designer-only, unlike page creation itself), and `open_component_view` (viewing a component's canvas)
- DO NOT use any other tools or methods for Webflow operations
- All tool calls must include the required `context` parameter (15-25 words, third-person perspective)
- **Designer connection is required for `designer_tool` actions and for `element_snapshot_tool`.** Building, styling, inspecting, and updating elements, components, props, and variants (the `data_` tools) runs headlessly against an explicit page ID from `data_pages_tool`'s `list_pages` — but the before/after visual snapshots this skill relies on for safe mutation need Designer open and connected. If Designer isn't available, skip the snapshot steps and rely on `query_elements` output to describe changes instead.

## Instructions

### Phase 1: Discovery
1. **Call `webflow_guide_tool` first** — always the first MCP tool call in any workflow
2. **Get the site**: Use `data_sites_tool` with action `list_sites` to identify the target site. If only one site exists, use it automatically.
3. **Get the target page**: Use `data_pages_tool` with action `list_pages` to find the page by name or slug — no Designer connection needed. If the user is actively working in an open Designer session and wants "the page I have open," use `designer_tool` with action `get_current_page` instead.
4. **If user specifies a different page**: Just use that page's ID directly in later calls — no page "switch" is needed for headless operations. Only use `designer_tool` with action `switch_page` if the user wants the Designer canvas itself to navigate there.
5. **Identify the task type**:
   - **Inspect**: List elements, view structure, preview → go to Phase 2
   - **Build/Modify/Delete**: Add, update, restructure, remove → go to Phase 3
   - **Components**: List, inspect, update → go to Phase 2 or Phase 3 depending on read vs write

### Phase 2: Inspection (read-only operations)
6. **List page elements**: Use `data_element_tool` with `get_all_elements` (or `query_elements` to filter by type/text/attribute) to retrieve page structure, passing the page ID from Phase 1. Present a summary of sections, elements, and nesting.
7. **Preview elements**: Use `element_snapshot_tool` to get visual previews of specific sections — requires Designer
8. **List components**: Use `data_component_tool` with action `get_all_components` or `query_components` to list all site components
9. **Inspect a component**: Use `data_component_tool` with action `get_component` for metadata (props, variants), or `data_element_tool` with `scope_component_id` set to the component's ID to inspect its internal elements

### Phase 3: Planning (before any mutation)
Before creating, updating, or deleting anything:
10. **Snapshot current state**: Use `element_snapshot_tool` to capture the area being changed — requires Designer; if unavailable, describe the current state from `query_elements` output instead
11. **Present the plan**: Describe exactly what will be created, modified, or deleted
12. **Request explicit confirmation**: Ask the user before proceeding:
    - "Would you like me to proceed with these changes?"
    - "Shall I go ahead and create this?"
    - "Do you want me to apply these changes?"
    - "Before I make changes, here's what I'll do: [plan]. Confirm to proceed."
13. **For destructive operations** (delete, restructure): Require "confirm" or "delete", warn about child elements that will also be affected

### Phase 4: Execution (after confirmation only)
14. **Build elements**: Use `data_element_builder` to create new elements (max 3 levels deep), passing the page ID and the parent element ID. For deeper structures, build in multiple passes.
15. **Style elements**: Use `data_style_tool` to apply or update styles on created or existing elements
16. **Modify elements**: Use `data_element_tool` with `set_attributes`, `set_text`, `set_style`, or `set_link` to update attributes, text, or links
17. **Update components**: Use `data_element_tool` (scoped with `scope_component_id`) to edit a component's internal elements; `data_component_props_tool` to change prop definitions or instance prop values; `data_component_variants_tool` to manage variants; `data_component_tool` with `insert_component_instance`/`unlink_component_instance` to add or unlink instances on a page
18. **Create pages**: Use `data_pages_tool` with action `create_page`. To create a page **folder**, use `designer_tool` with action `create_page_folder` — this specific action requires a Designer connection

### Phase 5: Verification
19. **Snapshot the result**: Use `element_snapshot_tool` to capture the new state — requires Designer; if unavailable, summarize the change from the tool response instead
20. **Report what changed**: Summarize the changes made

## Examples

### Example 1: List page elements

**User:** "Show me all elements on the homepage"

1. Call `webflow_guide_tool` for best practices
2. Call `data_sites_tool` with `list_sites` to identify the site
3. Call `data_pages_tool` with `list_pages` to find the homepage's page ID
4. Call `data_element_tool` with `get_all_elements` (using that page ID) to retrieve page structure
5. Present organized summary of sections, elements, and nesting

### Example 2: Build a hero section

**User:** "Add a hero section with a heading and CTA button"

1. Call `webflow_guide_tool` for best practices
2. Call `data_sites_tool` with `list_sites` to identify the site
3. Call `data_pages_tool` with `list_pages` to find the target page's ID
4. Call `element_snapshot_tool` to capture current state
5. Present plan: "I'll create a Section with a Heading and Button. Would you like me to proceed?"
6. After confirmation: call `data_element_builder` with nested structure
7. Call `data_style_tool` to apply styles (padding, background, typography)
8. Call `element_snapshot_tool` to show the result

### Example 3: Update a component

**User:** "Update the footer copyright text to 2026"

1. Call `webflow_guide_tool` for best practices
2. Call `data_sites_tool` with `list_sites` to identify the site
3. Call `data_component_tool` with `query_components` to find the footer component
4. Call `data_element_tool` (scoped with `scope_component_id`) to inspect its internal elements and find the copyright text element
5. Present: "I'll update the copyright text from '2025' to '2026'. Would you like me to proceed?"
6. After confirmation: call `data_element_tool` with `set_text` (scoped with `scope_component_id`)
7. Report the change

### Example 4: Restructure a section

**User:** "Restructure the hero section layout"

1. Call `webflow_guide_tool` for best practices
2. Call `data_sites_tool` with `list_sites` to identify the site
3. Call `data_pages_tool` with `list_pages` to find the target page's ID
4. Call `element_snapshot_tool` to capture current hero section
5. Call `data_element_tool` with `query_elements` to inspect current structure
6. Present restructuring plan with before/after description
7. After confirmation: apply changes using `data_element_tool` (`move_element`, `set_style`, etc.) and/or `data_element_builder`
8. Call `element_snapshot_tool` to show the result

### Example 5: Create a two-column layout

**User:** "Create a two-column layout with text on left and image on right"

1. Call `webflow_guide_tool` for best practices
2. Call `data_sites_tool` with `list_sites` to identify the site
3. Call `data_pages_tool` with `list_pages` to find the target page's ID
4. Call `element_snapshot_tool` to capture current state
5. Present plan: "I'll create a Grid with two columns — text block on left, image on right. Would you like me to proceed?"
6. After confirmation: call `data_element_builder` with grid structure
7. Call `data_style_tool` to set grid layout properties
8. Call `element_snapshot_tool` to show the result

## Guidelines

- **`webflow_guide_tool` always first** — before any other MCP tool in every workflow
- **Snapshot before and after** — use `element_snapshot_tool` before mutations and after to show results
- **Never silently mutate** — every write operation requires explicit user confirmation
- **Headless for building and editing** — get the page ID once via `data_pages_tool`'s `list_pages`, then pass it directly to `data_element_tool`, `data_element_builder`, and `data_style_tool`. Reach for `designer_tool` only when the task specifically needs the live canvas (current-page detection, interactive selection, page folders, component canvas view).
- **Visual snapshots need Designer** — `element_snapshot_tool` is a Designer tool; if Designer isn't connected, fall back to describing changes from `query_elements`/tool response data instead of skipping the before/after check entirely.
- **Batch changes need itemized preview** — if modifying multiple elements, list each change
- Prefer Webflow's native layout tools (Grid, Flexbox) over manual positioning
- Components shared across pages should be updated via `data_element_tool` scoped to the component (changes propagate to all instances)
- Component instance management (`insert_component_instance`, `unlink_component_instance`) is headless via `data_component_tool` — not Designer-gated
- `data_element_builder` supports max 3 levels per call — build deeper structures in stages
- Check `webflow_guide_tool` for supported style properties when unsure