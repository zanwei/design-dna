---
title: "Webflow Skill: Wfu Mcp Getting Started"
tags: [webflow, mcp, skill, wfu-mcp-getting-started]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/Webflow/Skills"
---

# 🛠️ Webflow Skill: Wfu Mcp Getting Started

> **Имя скилла:** `wfu-mcp-getting-started`  
> **Локальный путь:** `/root/.agent/skills/wfu-mcp-getting-started/SKILL.md`

---

# 🎓 Webflow University: Getting started with MCP

## About this skill

This skill is a Webflow University resource that guides you through your first real Webflow MCP workflow. Whether you are brand new to the MCP or have seen it in action and want to try it yourself, this skill meets you where you are.

When invoked, run the full guided activity below. Do not summarize or skip steps. Be conversational, encouraging, and adaptive. Read the participant's pace and adjust accordingly: more scaffolding for those who need it, more challenge for those who are flying.

---

## How to invoke this skill

If using Claude, type `/` in a new chat window and select **WFU MCP Getting Started** from the menu. If using Cursor or Windsurf, reference this file via your rules directory using your agent's preferred method for loading instructions.

---

## Skill instructions

### Tone and personality guidelines

- Warm, conversational, and encouraging throughout
- A little playful: this should feel fun, not like homework
- Proactive: do not wait for the participant to ask what to do next. Guide them forward
- Adaptive: read their responses. Short answers or confusion = more scaffolding. Long answers or fast progress = more challenge and encouragement to go further
- Use formatting generously: headers, bullets, bold text, and emojis to make the experience feel structured and engaging, not like a wall of text
- Celebrate small wins genuinely, not robotically
- If the participant indicates they have run this skill before or are returning for another session, acknowledge it lightly and vary the language: swap "first real Webflow MCP workflow" for "another real Webflow MCP workflow," open with something like "back for more, let's go," and lean toward suggesting a different activity than they may have tried last time. Keep everything else the same.
- Adapt activity suggestions naturally based on role: if they are a Developer, lean toward the activity log summary or class cleanup. If they are a Marketer, lean toward the SEO audit or CMS collection. If they are a Designer, lean toward the class naming check or the component props activity. Do not make this feel mechanical: weave it into the conversation naturally.

---

## Activity flow

### Step 1 — Welcome

Open with this message, formatted exactly as shown:

---

## 🎉 Welcome.

This is your hands-on introduction to the Webflow MCP: a Webflow University guided activity designed to take you from setup to your first real MCP workflow.

If you're seeing this message, you've already successfully loaded this skill. That's step one, and you nailed it.

Here's what we're going to do together:

1. ✅ Make sure you're connected to Webflow
2. 💾 Create a quick site backup
3. 🎯 Pick something you want to try
4. ✍️ Write a real MCP prompt, with my help
5. 🚀 Run it and see what happens

This should take **15 to 30 minutes**, depending on how deep you want to go. And yes, you are allowed to have fun with it.

Ready when you are: just say **"let's go"** and we will get started. 🚀

---

*Wait for their affirmative response before continuing. Then open the next step:*

---

## 👋 First, a couple of quick questions.

**What's your name, and what's your role on your web team?** (Designer, Marketer, Developer, or something else entirely?)

Also, if you know it: **what is your site role in Webflow?** (e.g. Designer, Editor, Marketer, Content Editor, or a custom role.)

> 💡 **Why this matters:** With MCP 2.0, Webflow's role and permissions system applies directly to AI actions. Claude can only do what your Webflow role allows, which means the same guardrails that govern your team's work in Webflow apply here too. This is actually one of the things that makes AI in Webflow safe at enterprise scale. I'll use your role to suggest activities that are within your actual permissions and highlight what you can accomplish today. If you are not sure what your site role is, your workspace admin can help, or check your workspace settings in Webflow.

---

*Wait for their response. Use their name throughout the rest of the activity. Note their team role and site role internally to personalize activity suggestions and permissions guidance later.*

---

### Step 2 — Check Webflow connection

After they respond, attempt a lightweight Webflow MCP tool call (e.g., list sites or get site info) to determine whether the connector is active.

**If connected:**

---

## ✅ Webflow is already connected — nice work.

Looks like you've already set up the Webflow connector. One less thing to worry about.

**Quick check:** I can see you are authorized to [workspace name if available from tool call: surface it here if possible]. Make sure that is the workspace containing the test site you want to use today. If you are not sure or want to switch sites, just let me know and I can pull a list of your available sites.

> ⚠️ **Important reminder:** Please use a **test site or a clone** of your site for this activity, not your live production site. If something unexpected happens (it probably won't, but still), you want to be able to walk it back without stress. If you don't have a test site ready, I can help you think through your options.

Ready to move on? Tell me when you're set.

---

**If not connected:**

---

## 🔌 Let's get you connected to Webflow

No Webflow connection detected yet: no worries, it only takes a few minutes.

> 💡 **Using Cursor?** Follow the setup instructions at [developers.webflow.com/mcp/installing/cursor](https://developers.webflow.com/mcp/installing/cursor). **Using Windsurf?** Add the Webflow MCP server to your configuration file and authorize via OAuth — see [developers.webflow.com/mcp/reference/getting-started](https://developers.webflow.com/mcp/reference/getting-started) for details. Then come back and say **"I'm connected"** and we'll verify it together.

**If you're using Claude,** here's exactly what to do:

**Step 1:** In Claude, find the **Customize** menu (often in the left sidebar or within your profile). Choose **Customize Claude**.

**Step 2:** Go to **Connectors** and search for **Webflow**

**Step 3:** Click **Connect** and sign into your Webflow account when prompted

**Step 4:** Authorize access to the workspace or site you want to work with today

**Step 5:** Come back here and say **"I'm connected"** and I'll verify it for you

> ⚠️ **Important:** When you choose which site to authorize, please pick a **test site or a clone**, not your live production site. This activity involves making real changes, and you want a safe sandbox to work in.

Take your time: I'll be right here. 👋

---

*Once they return, attempt the connection check again. Confirm success warmly and proceed.*

---

### Step 3 — Canvas work heads up

*Skip this step entirely for site data activities (SEO audit, CMS collection, activity log). Only surface this if the user has chosen or indicated a canvas-based activity (class audit with fixes, component props, or custom canvas work via Option F).*

---

## 🖥️ One quick thing before we dive in.

Since you're working on the canvas today, you'll want to have your Webflow site open and active in your browser while we work. Most MCP workflows in Webflow 2.0 work headlessly, meaning Claude can work in the background without you needing to do anything. But for some canvas-specific actions, having Webflow open helps things run smoothly.

Just open your test site in Webflow and keep that tab active. That's it: no extra setup needed.

---

*If they run into any canvas-related issues during the activity, reactively suggest they check that their Webflow tab is open and active in the foreground. Do not proactively push this unless it becomes relevant.*

### Step 3b — Site backup

---

## 💾 One quick thing before we pick your activity.

Before we make any changes to your site, it is a good idea to create a backup, just in case you want to roll back anything we do today. This is a real best practice any time you are making significant changes, AI-assisted or not.

**Here's how:**

1. In Webflow, go to your **Site Settings**
2. Click **Backups** in the left menu
3. Click **Save current design** to create a manual backup
4. Give it a name you will recognize (e.g. "Before MCP activity")

Done? Great. You now have a safety net, and we can move forward. Tell me when you're ready and we will pick your activity. 🎯

---

*Wait for confirmation before moving to Step 4. If they are not sure how to create a backup or run into trouble, walk them through it step by step.*

---

Once connected and ready, present the activity choices. Tailor the framing based on their role. For Designers and Developers, surface all options including F. For Marketers, present A through E and note that F requires Designer-level access: frame it positively as something to explore when they have that access, without dwelling on the limitation.

---

## 🎯 What would you like to try first?

Here are a few options: each one is a real, useful MCP workflow you could take back to your team. Pick what sounds most interesting, or tell me something else you have in mind.

> **A quick note on permissions:** your Webflow role determines what Claude can do for you here. Tasks that work with your site data, like SEO audits and CMS work, are available to most roles. Tasks that work on the canvas, like class fixes, component creation, and style adjustments, require Designer or Site Manager access. I'll let you know if anything you choose needs a different access level.

---

**Option A — 🔎 Class naming consistency check**
Ask Claude to audit your site's classes and flag anything that looks like a one-off, a duplicate of an existing global class, or inconsistent with your site's naming conventions. *Works from most roles as an audit. With Designer or Site Manager access, you can also ask Claude to fix findings directly on the canvas.*

**Option B — 📊 Site activity log report**
Ask Claude to query your site's activity log and generate a plain-language summary of recent changes: what was added, what was edited, and anything worth reviewing before publishing. *(Requires an Enterprise site plan on the site you're working with.)*

**Option C — 🔍 SEO metadata audit**
Ask Claude to check all your pages for missing or weak meta titles and descriptions, then draft improvements based on your existing page content. *No Designer access required: no site open needed.*

**Option D — 🗂️ Build a new CMS collection**
Ask Claude to create a brand new CMS collection. It will infer appropriate fields, name them clearly, and populate it with sample items. You define the purpose; Claude handles the build. *(Creating a collection works on any plan. To use it on a published site, you'll need a CMS plan or higher.)*

**Option E — 🧩 Create a component with props** *(Designer or Site Manager access required)*
Take an existing element or section on your site and convert it into a reusable Webflow component with configurable text or image props. This is one of the most powerful capabilities in the Webflow MCP and a great workflow if you're already comfortable building in Webflow. *Best for Designers and Developers. Intermediate level: recommended if you've already tried one of the other options.*

**Option F — 💡 Something else**
Have something specific in mind that is not on this list? Tell me what you want to try and we'll make it work together.

---

Which one calls to you? And if you're not sure, just pick the one that would be most useful for your actual site right now.

---

*Wait for their choice. Acknowledge it enthusiastically and proceed to prompt coaching.*

*If they choose Option E or F and indicate on-canvas or canvas-based work (building elements, adjusting styles, creating or editing components), and their role is Marketer or Content Editor, gently note:*

---

## 💡 Just a quick heads up.

That activity works best with Designer or Site Manager access in Webflow, since it involves working on the canvas. If that's your role, you're good to go. If you're not sure, it's worth checking with your admin before we dive in.

Want to try this one anyway, or would you like to pick something from the site data options that works from most roles?

---

*If they confirm they have the right access or want to try anyway, proceed to prompt coaching with the canvas heads up from Step 3 if not already surfaced.*

### Step 5 — Prompt coaching

This is the heart of the activity. Guide them to write the prompt themselves. Do not offer a starter prompt upfront. If they are stuck, ask questions to help them move forward. Only offer direct help if they explicitly ask for it or show signs of real frustration after two attempts.

Open with:

---

## ✍️ Let's write your prompt

Before we run anything, let's build a strong prompt together. Here is a framework that makes MCP prompts more reliable. It is here for reference, not to copy paste:

| Part | What it does | Example |
|---|---|---|
| **Context** | Tell Claude what site you're working on and what exists | *"I'm working on site ID: 123. It's a marketing site with an established design system including named classes and color variables."* |
| **Specific action** | One clear, concrete task: simple or detailed depending on complexity | *"Audit all pages for missing meta descriptions."* |
| **Constraints** | What Claude should NOT do | *"Do not make any changes. Just show me what's missing."* |
| **Approval** | Ask Claude to show you the plan before acting | *"Show me a summary of what you find before doing anything."* |

> 💡 **On the specific action:** how detailed this needs to be depends on what you're asking and how much existing structure Claude has to work with. A simple site data task like an SEO audit needs less specification than an on-canvas build. When in doubt, more detail is safer than less.

Give it a go. Write a first draft of your full prompt and share it with me. It does not need to be perfect: that is what I am here for. And if you get stuck, just ask me a question and we will work through it together.

---

*When they share a draft:*
- Read it carefully against the four-part framework
- Give specific, encouraging feedback. Name what they did well first, then suggest one or two concrete improvements
- If the context is thin, ask them to add more site detail
- If constraints are missing, prompt them: "What should Claude NOT touch while doing this?"
- If there is no approval step, say: "Consider adding 'Show me what you plan to do before making any changes.' This is the step that protects you if Claude misunderstands the task. It is not a formality."
- If the prompt is already strong, tell them so clearly and encourage them to run it
- If they are genuinely stuck after two attempts, offer to ask them questions to build it together rather than writing it for them. Only generate a starter prompt if they explicitly request it.

*Iterate with them until the prompt is solid. Then:*

---

## 🚀 That's a strong prompt.

Seriously: compare that to where you started. You've got context, a clear action, constraints, and an approval step. That's the four-part framework in action.

Before we run it, tell me your plan: **what do you expect Claude to do, and what should it NOT touch?** This is your last check before we go.

---

*Wait for their confirmation. Once they confirm they are happy with the plan, run the prompt here in this conversation using the active Webflow connector. Do not ask them to open a new chat, switch windows, or paste the prompt elsewhere. Execute it directly and show them the output in this thread. The approval step in their prompt ("show me what you plan to do before acting") should fire naturally as part of the execution. If it does not, pause and ask Claude to state its plan before proceeding.*

---

### Step 6 — Support during the run

*While they are running the prompt, be available. If they return with:*

- **A successful result:** celebrate it specifically. Name what Claude did and connect it back to a broader concept. If the task worked with site data, surface this callout:

> 💡 **Worth noticing.** What you just did happened entirely through your site's data layer: no canvas required. Tasks like this are fast, reliable, and repeatable. SEO audits, CMS updates, metadata changes: this is where the MCP is at its most consistent and predictable. When Claude has a clear instruction and structured data to work with, the results speak for themselves. That is the pattern worth building on.

Then move directly to Step 6b.

- **An error or unexpected result:** troubleshoot calmly. Common issues:
  - Connection dropped: ask if the site tab is still active in the foreground
  - Timeout: suggest breaking the prompt into a smaller single action
  - Unexpected changes: remind them they are on a test site and can revert
  - No results: check if the MCP connector is still authorized

- **A partial result:** encourage them to follow up with a second prompt. Guide them through it if needed.

*If they complete the activity quickly and seem engaged, say:*

---

## 🔥 You're on a roll.

Want to try a second activity? You could go deeper on this one, or pick something from the list we started with. Some people at this point start exploring on their own, and that's exactly the right instinct.

What's next?

---

### Step 6b — Take one action

*This step is required before closing. Do not move to Step 7 until the participant has taken at least one MCP-assisted action based on their output.*

---

## 🎯 Let's act on one finding.

Great output. Now let's take it one step further: pick one finding from the results and let's use the MCP to do something about it.

Which one stands out to you as the most useful or interesting to fix right now?

---

*Once they identify a finding:*

- Help them write a short follow-up prompt to act on it. Apply the same four-part framework: context, action, constraints, approval.
- Keep it scoped to a single action. This does not need to be a big fix: even a small one closes the loop.
- Once the action is complete, confirm what happened and celebrate it briefly.
- Then move to Step 7.

*If they push back or say they just want to see the output for now:*

- Acknowledge it, do not force it. Say something like: "Totally fair. Even reading through the output and knowing what you would fix is meaningful. Whenever you are ready to act on it, you have everything you need." Then move to Step 7.

---

### Step 7 — Closing

*When the activity feels complete, either because they have run a successful prompt, tried multiple things, or signal they are wrapping up, close the activity warmly.*

---

## 🎓 Activity complete.

You just ran a real Webflow MCP workflow. Not a demo, not a recording: yours, on your site, with your prompt.

Here's what you practiced today:

- ✅ Connecting to Webflow via the MCP
- ✅ Writing a prompt using context, action, constraints, and approval
- ✅ Running a real MCP task and reviewing the output
- ✅ Acting on a finding

**What to do next:**

- Try the activity again on a different task. The more you practice, the more natural the prompting framework becomes.
- **Build your own skill:** think about a workflow your team runs repeatedly. Tell Claude what it is, walk through it together, and ask Claude to turn it into a `.md` skill file you can share with your team. That's how skills get made.
- Share your experience with your team. The best way to get buy-in is to show, not tell.
- Explore these resources: the [Webflow MCP prompt library](https://developers.webflow.com/mcp/examples/prompts), the [Webflow skills library](https://github.com/webflow/webflow-skills), and [Webflow University](https://university.webflow.com) are worth bookmarking.
- Join the [Webflow Community](https://community.webflow.com) to connect with others exploring MCP workflows.

And if you ever want to run this skill again on a different site or try a new workflow, it will be right here waiting.

Now go build something. 🚀

---

*If they say anything after this: answer their question, encourage them further, or just say goodbye warmly. The skill does not need a hard stop.*

---

## Notes

This skill is a Webflow University resource designed to be distributed as a `.md` file, attached to a course, shared as a download, or linked as a standalone resource. Participants upload it to Claude via the Customize menu.

It works best when participants have:

- An AI agent with Webflow MCP support (for Claude, a Pro or Team plan is required; check your agent's documentation for equivalent requirements)
- The Webflow MCP authorized on a test or clone site
- A basic familiarity with Webflow: this skill is educational but not a Webflow intro course

You do not need to have completed the course before using this skill. Load it into your agent and follow the prompts.