---
title: "Shopify AEO & AI Visibility Prompt Skills"
tags: [shopify, skills, liquid, theme, mcp]
date: 2026-07-30
status: ✅ Активен
category: "Shopify/Skills/AEO-Skills"
---

# 🤖 SurfaceKit AEO & AI Visibility Optimization Index

Комплекс руководств и скриптов для **AEO (Answer Engine Optimization)** — отслеживания, оценки и оптимизации видимости магазина **Shopify** (включая **Awruma**) в ответах нейросетей (Google AI Overviews, ChatGPT, Perplexity, Peec, Athena).

---

## 📂 Файлы и Модули в папке AEO-Skills

| Модуль (Файл) | Назначение и Описание |
| :--- | :--- |
| **[[surfacekit-aeo-prompts]]** | Главный скилл генерации промптов видимости и скоринга выигрышности (Winnability Eval) |
| **[[system-prompts]]** | Системные промпты для эвалюации цитирований, брендов и ссылок источников |
| **[[output-schemas]]** | Схемы метаполей `surfacekit` и JSON-структуры выходных данных |
| **`eval_deterministic.py`** | Детерминированный скрипт вычисления точности, цитирований и метаданных бренд-видимости |

---

## 💡 Режимы Работы Скилла

1. **Режим A: Генерация промптов + Оценка выигрышности (Winnability)** — Сканирование каталога товаров → Выявление архетипа магазина → Генерация 25-30 промптов для ChatGPT/Perplexity → Оценка шанса победы бренда → Запись в метаполя `surfacekit`.
2. **Режим B: Оценка ответов ИИ (Response Eval)** — Классификация ответов нейросетей, проверка цитирования URL магазина и метаполей.
