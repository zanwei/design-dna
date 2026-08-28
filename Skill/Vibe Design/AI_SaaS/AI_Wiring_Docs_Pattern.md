---
title: "AI Wiring Docs Pattern (WIRING.md / AGENTS.md)"
tags: [ai-wiring, agents-md, prompt-engineering, vibe-coding]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/AI_SaaS"
---

# 🔌 AI Wiring Docs Pattern (WIRING.md)

**AI Wiring Docs** — это текстовые инструкции в корне проекта (`WIRING.md` или `AGENTS.md`), которые объясняют ИИ-агентам архитектуру приложения, точки подключения API и правила расширения кода.

---

## 📜 Шаблон файла WIRING.md для проекта

```markdown
# PROJECT WIRING & ARCHITECTURE GUIDELINES

## 1. Stack & Directory Map
- `/src/components/ui/`: shadcn/ui components. DO NOT mutate manually without checking design tokens.
- `/src/lib/supabase/`: Supabase client and query helpers.
- `/src/routes/`: TanStack router pages.
- `/src/services/stripe/`: Billing webhooks and checkout sessions.

## 2. DB Schema & Models
- `profiles` table: User metadata linked to `auth.users(id)`.
- `subscriptions` table: Managed via Stripe Webhooks.

## 3. Strict Rules for AI
- NEVER swallow errors silently.
- ALWAYS use Tailwind CSS classes matching DESIGN.md tokens.
- ALWAYS check user session via `useSession()` before mutating data.
```