---
title: "LaunchKit Architecture Guide"
tags: [launchkit, saas, stack, supabase, stripe, tanstack]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/AI_SaaS"
---

# 🏗️ LaunchKit Architecture Guide

**LaunchKit** (`launchkit.getdesign.md`) — это готовый промышленный стек и архитектурный шаблон для быстрой разработки SaaS-приложений с помощью ИИ-агентов.

---

## 🛠️ Промышленный Стек (Industry Standard Stack)

- **Frontend**: TypeScript, React, TanStack Router / Query, Tailwind CSS, shadcn/ui.
- **Backend / Database**: Supabase (PostgreSQL, Row Level Security, Storage, Edge Functions).
- **Authentication**: Supabase Auth (Email, Passwordless, Social OAuth, MFA, Passkeys).
- **Payments & Billing**: Stripe / LemonSqueezy (Subscriptions, Webhooks, Customer Portal).
- **Transactional Emails**: Resend + React Email.
- **Analytics & Monitoring**: PostHog + Sentry.
- **Deployment**: Vercel / Netlify / Cloudflare Workers.

---

## 🚀 Почему LaunchKit экономит 600+ часов разработки

1. **Все экраны уже сверстаны**: Экраны входа, восстановления доступа, профиля, настроек, тарифов и админ-панели уже готовы.
2. **ИИ не "изобретает колесо"**: Агент сразу дописывает логику вашей уникальной фичи, а не тратит токены на верстку форм входа.
3. **Готовые DB-миграции**: Структуры таблиц пользователей, подписок и прав уже созданы.