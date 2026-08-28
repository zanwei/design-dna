---
title: "SaaS Payments & Subscriptions Guide"
tags: [payments, stripe, lemonsqueezy, billing, subscriptions]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/AI_SaaS"
---

# 💳 SaaS Payments & Subscriptions Guide

Интеграция монетизации, чекаутов и подписок в AI SaaS приложения.

---

## 🛒 Провайдеры Оплат

- **Stripe**: Стандарт для большинства стран (Checkout, Billing, Portal).
- **LemonSqueezy / Merchant of Record**: Автоматическая уплата налогов (VAT) по всему миру.
- **Polar / Dodo Payments**: Современные провайдеры для AI продуктов.

---

## 🔁 Логика Подписок & Вебхуков

1. Пользователь выбирает тариф на фронтенде (`Free` / `Pro` / `Enterprise`).
2. Перенаправление на Stripe Checkout Session.
3. Stripe отправляет вебхук `customer.subscription.created` на бэкенд.
4. Supabase обновляет статус пользователя в таблице `subscriptions`.