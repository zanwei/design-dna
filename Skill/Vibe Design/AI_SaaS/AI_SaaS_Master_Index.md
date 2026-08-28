---
title: "AI SaaS & LaunchKit Master Index"
tags: [ai-saas, launchkit, architecture, auth, billing, wiring, vibe-design]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/AI_SaaS"
---

# 🚀 AI SaaS & LaunchKit — Руководство и Архитектура

Раздел **AI SaaS** содержит материалы, шаблоны архитектуры и руководства по созданию **полноценных веб-приложений, SaaS-платформ и ИИ-сервисов** с помощью ИИ-агентов (LaunchKit, Supabase, Stripe, TanStack, Resend, Tailwind).

---

## 📚 Документы в Разделе AI SaaS

| № | Документ | Тематика и Назначение | Ссылка в Obsidian |
| :-: | :--- | :--- | :--- |
| 1 | **LaunchKit Architecture Guide** | Полная архитектура стартового кита LaunchKit (TanStack + Supabase + Stripe + Resend) | [[LaunchKit_Architecture_Guide]] |
| 2 | **AI Wiring Docs Pattern** | Методология создания WIRING.md / AGENTS.md для ИИ-агентов | [[AI_Wiring_Docs_Pattern]] |
| 3 | **SaaS Auth & Security** | Готовые схемы авторизации (Magic Links, OAuth, Passkeys, Roles, Impersonation) | [[SaaS_Auth_and_Security_Guide]] |
| 4 | **SaaS Payments & Subscriptions** | Модели подписок, биллинг и чекауты (Stripe, LemonSqueezy, Dodo, Polar) | [[SaaS_Payments_and_Subscriptions]] |
| 5 | **AI Agent Skills Registry** | Реестр скиллов и экосистем (VoltAgent, Claude Code, Cursor, Gemini) | [[AI_Agent_Skills_Registry]] |

---

## 💡 Главный принцип AI SaaS разработки

1. **Не промптите "с нуля"**: Используйте готовую архитектурную базу (Auth + DB + Billing).
2. **Передайте ИИ `DESIGN.md`**: Подключите стиль бренда из [[Vibe Design/Design_MD/00_Design_MD_Systems_Index|Каталога 74 Бренд-Систем]].
3. **Используйте shadcn/ui**: Верстайте интерфейсы через [[Vibe Design/Shadcn/00_Shadcn_Skills_Master_Index|shadcn/ui Скиллы]].
4. **Свяжите через `WIRING.md`**: Разрешите ИИ безопасно добавлять функционал.