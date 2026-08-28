---
title: "SaaS Auth & Security Guide"
tags: [auth, security, supabase, oauth, passkeys, mfa]
date: 2026-07-29
status: ✅ Активен
category: "Vibe Design/AI_SaaS"
---

# 🔒 SaaS Auth & Security Guide

Руководство по внедрению безопасной аутентификации в AI SaaS веб-приложения.

---

## 🔑 Поддерживаемые Модели Входа

1. **Email & Passwordless**: Magic Links, OTP коды.
2. **Social OAuth**: Google, GitHub, Apple Sign-In.
3. **Passkeys & Biometrics**: Face ID / Touch ID через WebAuthn.
4. **MFA (2FA)**: Authenticator Apps (TOTP).
5. **Enterprise SSO**: SAML 2.0 (Okta, Azure AD).

---

## 🛡️ Контроль Доступа & Роли (RBAC)

- `Owner`: Полный доступ, биллинг, удаление проекта.
- `Admin`: Управление пользователями и контентом.
- `Member`: Стандартный доступ к функциям.
- `Impersonation`: Возможность администратора войти «под видом» пользователя для отладки ошибок.