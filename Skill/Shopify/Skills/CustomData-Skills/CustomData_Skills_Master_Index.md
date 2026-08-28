---
title: "Shopify Custom Data & Metafields Master Index"
tags: [shopify, skills, liquid, theme, mcp]
date: 2026-07-30
status: ✅ Активен
category: "Shopify/Skills/CustomData-Skills"
---

# 🗃️ Shopify Custom Data & Metafields Master Index

Специализированная коллекция руководств по проектированию, объявлению и управлению **Metafields** (метаполями) и **Metaobjects** (метаобъектами) в Shopify (включая бренд **Awruma**).

---

## 📂 Документы и Модули

| Документ | Описание |
| :--- | :--- |
| **[[shopify-custom-data-architecture]]** | Официальный архитектурный стандарт объявления Metafields / Metaobjects через `shopify.app.toml` и GraphQL |

---

## 💡 Основные Правила Работы с Метаданными

1. **Декларативное объявление через TOML**: Объявление типов метаполей (`[product.metafields.app.key]`) и метаобъектов (`[metaobjects.app.name]`) в конфигурации приложения `shopify.app.toml`.
2. **Запись и Выгрузка значений**: Использование GraphQL мутаций `metafieldsSet` и `metaobjectCreate`.
3. **Отображение на фронтенде темы**: Прямой вывод метаполей в шаблонах Liquid 2.0 (`{{ product.metafields.app.care_guide.value }}`).
