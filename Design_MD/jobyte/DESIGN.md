---
title: "Jobyte HR-Tech Platform — Semantic Design System (Client-First v3)"
tags: [jobyte, hr-tech, design-system, client-first, webflow, tailwind, tokens, dark-mode]
date: 2026-07-31
status: ✅ Approved Design System
category: "Vibe Design / Design_MD / Jobyte"
---

# 🚀 Jobyte HR-Tech Platform — Design System Specification

---

## 🎨 1. Design DNA & Anti-Generic Philosophy

Jobyte спроектирован в эстетике **Cybernetic Dark Mode / Modern Engineering** (стиль Linear, Stripe, Vercel). Никаких шаблонных белых карточек, гигантских градиентов или безликих интерфейсов.

### 🔑 Главные визуальные принципы:
1. **Глубокий темный фон (Deep Slate Atmosphere):** Послойное перекрытие темно-синих фонов `#0F172A` -> `#1E293B` с тонкими разделителями `#334155`.
2. **Неоновые нео-кибернетические акценты:** Яркий бирюзовый ослепительный `Electric Cyan` (`#00F2FE`) и глубинная синева `Deep Indigo` (`#4FACFE`).
3. **Glassmorphic Depth:** Карточки вакансий с блюром `backdrop-filter: blur(16px)` и свечением границ при наведении.
4. **Строгий Client-First v3 Webflow костяк:** Идеальная структура классов и гибких оберток (`page-wrapper`, `main-wrapper`, `section_[name]`, `padding-global`, `container-large`, `padding-section-large`).

---

## 🎨 2. Цветовая Палитра & Семантические Токены

```css
:root {
  /* Primitive Background Tokens */
  --color-bg-dark: #0F172A;          /* Slate 900 */
  --color-bg-surface: #1E293B;       /* Slate 800 */
  --color-bg-surface-elevated: #334155; /* Slate 700 */

  /* Primary & Accent Tokens */
  --color-accent-primary: #00F2FE;   /* Electric Cyan */
  --color-accent-secondary: #4FACFE; /* Deep Indigo */
  --color-accent-glow: rgba(0, 242, 254, 0.25);

  /* Typography Tokens */
  --color-text-primary: #F8FAFC;     /* Slate 50 */
  --color-text-secondary: #94A3B8;   /* Slate 400 */
  --color-text-muted: #64748B;       /* Slate 500 */

  /* Status Tokens */
  --color-status-success: #10B981;   /* Emerald 500 */
  --color-status-warning: #F59E0B;   /* Amber 500 */
  --color-status-remote: #8B5CF6;    /* Violet 500 */

  /* Borders & Glassmorphism */
  --color-border-subtle: rgba(255, 255, 255, 0.08);
  --color-border-hover: rgba(0, 242, 254, 0.5);
  --glass-bg: rgba(30, 41, 59, 0.75);
  --glass-blur: blur(16px);
}
```

---

## 🔤 3. Типографика (Typography Scale)

* **Headings & Brand:** `Outfit`, sans-serif (Google Fonts)
* **Body & UI Controls:** `Inter`, system-ui
* **Data, Tech Tags & Salary:** `JetBrains Mono`, monospace

```css
/* Typography Utility Classes (Client-First) */
.heading-style-h1 {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(2.5rem, 5vw, 4rem);
  font-weight: 700;
  line-height: 1.1;
  letter-spacing: -0.02em;
  color: var(--color-text-primary);
}

.heading-style-h2 {
  font-family: 'Outfit', sans-serif;
  font-size: clamp(2rem, 3.5vw, 2.75rem);
  font-weight: 600;
  line-height: 1.2;
  letter-spacing: -0.015em;
}

.text-size-large {
  font-family: 'Inter', sans-serif;
  font-size: 1.25rem; /* 20px */
  line-height: 1.6;
  color: var(--color-text-secondary);
}

.text-size-medium {
  font-family: 'Inter', sans-serif;
  font-size: 1rem; /* 16px */
  line-height: 1.5;
}

.text-size-small {
  font-family: 'Inter', sans-serif;
  font-size: 0.875rem; /* 14px */
  line-height: 1.4;
}

.text-style-mono {
  font-family: 'JetBrains Mono', monospace;
  font-size: 0.9375rem;
  letter-spacing: -0.01em;
}
```

---

## 📐 4. Finsweet Client-First v3 Иерархия Вёрстки в Webflow

Все страницы и секции Jobyte должны строго соответствовать архитектуре Client-First v3:

```text
page-wrapper (div.page-wrapper)
└── main-wrapper (main.main-wrapper)
    ├── section_header (header.section_header)
    │   └── padding-global (div.padding-global)
    │       └── container-large (div.container-large)
    │           └── nav_component (nav.nav_component)
    │
    ├── section_hero (section.section_hero)
    │   └── padding-global (div.padding-global)
    │       └── container-large (div.container-large)
    │           └── padding-section-large (div.padding-section-large)
    │               └── hero_component (div.hero_component)
    │                   ├── hero_content-wrapper (div.hero_content-wrapper)
    │                   ├── hero_heading (h1.heading-style-h1)
    │                   ├── hero_subheading (p.text-size-large)
    │                   └── hero_search-component (form.hero_search-component)
    │
    ├── section_vacancies (section.section_vacancies)
    │   └── padding-global (div.padding-global)
    │       └── container-large (div.container-large)
    │           └── padding-section-large (div.padding-section-large)
    │               └── vacancies_component (div.vacancies_component)
    │                   ├── filters_component (aside.filters_component)
    │                   │   ├── filters_header (div.filters_header)
    │                   │   ├── filters_group (div.filters_group)
    │                   │   └── filters_tags-wrapper (div.filters_tags-wrapper)
    │                   │
    │                   └── feed_component (div.feed_component)
    │                       ├── feed_header (div.feed_header)
    │                       └── job-card_component (article.job-card_component)
    │                           ├── job-card_header (div.job-card_header)
    │                           ├── job-card_title (h3.job-card_title)
    │                           ├── job-card_salary (span.text-style-mono)
    │                           ├── job-card_tags (div.job-card_tags)
    │                           └── job-card_action (a.button_component.is-accent)
    │
    └── footer_component (footer.footer_component)
```

---

## 🕹️ 5. Спецификация UI-Компонентов Client-First

### 1. `button_component` (Кнопки)
- **Основной компонент:** `button_component`
- **Модификаторы:**
  - `is-accent`: Фон `linear-gradient(135deg, #00F2FE, #4FACFE)`, цвет текста `#0F172A`, `font-weight: 600`, подсветка `box-shadow: 0 4px 20px rgba(0, 242, 254, 0.35)`.
  - `is-secondary`: Полупрозрачный фон `rgba(255, 255, 255, 0.05)`, тонкая рамка `1px solid #334155`, цвет текста `#F8FAFC`.
  - `is-small`: `padding: 0.5rem 1rem`, `font-size: 0.875rem`.

### 2. `job-card_component` (Карточка Вакансии)
- **Фон:** `var(--glass-bg)` (`rgba(30, 41, 59, 0.75)`).
- **Блюр:** `backdrop-filter: blur(16px)`.
- **Рамка:** `1px solid var(--color-border-subtle)`.
- **Border-radius:** `1rem` (16px).
- **Hover эффекты:**
  - `transform: translateY(-3px) scale(1.005)`
  - `border-color: var(--color-border-hover)` (`#00F2FE`)
  - `box-shadow: 0 12px 30px rgba(0, 242, 254, 0.15)`
  - `transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1)`

### 3. `tech-tag_component` (Тег Технологий)
- **Фон:** `rgba(0, 242, 254, 0.08)`
- **Рамка:** `1px solid rgba(0, 242, 254, 0.2)`
- **Цвет текста:** `#00F2FE`
- **Шрифт:** `JetBrains Mono` (0.8125rem / 13px)
- **Border-radius:** `9999px` (Pill format)

---

## 🎬 6. Микро-Анимации & Переходы

```javascript
// GSAP Client-First Micro-Interactions for Webflow
gsap.registerPlugin(ScrollTrigger);

// Hero Entrance Animation
gsap.from(".hero_heading, .hero_subheading, .hero_search-component", {
  y: 30,
  opacity: 0,
  duration: 0.8,
  stagger: 0.15,
  ease: "power3.out"
});

// Job Cards Stagger Feed Entrance
gsap.from(".job-card_component", {
  scrollTrigger: {
    trigger: ".feed_component",
    start: "top 80%"
  },
  y: 40,
  opacity: 0,
  duration: 0.6,
  stagger: 0.08,
  ease: "power2.out"
});
```