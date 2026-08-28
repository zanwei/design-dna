---
title: "Мастер-руководство по Tailwind CSS v4 Engine & @tailwindcss/cli"
tags: [tailwind, css-first, cli, vite, postcss, theme, migration]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design / Skills / Tailwind"
---

# 🚀 Tailwind CSS v4 Engine — Полный Справочник

## 📌 Способы Сборки в Tailwind v4

### 1. Автономный CLI (`@tailwindcss/cli`)
Идеально для чистых HTML/JS проектов, скриптов сборки и быстрого компилирования CSS без Vite или PostCSS:

```bash
npm install tailwindcss @tailwindcss/cli
```

**Команда компиляции:**
```bash
# Режим слежения (Dev Watch)
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --watch

# Продакшн сборка с минификацией
npx @tailwindcss/cli -i ./src/input.css -o ./dist/output.css --minify
```

---

### 2. Подключение в Vite (`@tailwindcss/vite`)
```bash
npm install tailwindcss @tailwindcss/vite
```

```typescript
// vite.config.ts
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [tailwindcss()],
})
```

---

### 3. Главный CSS файл (`src/input.css` или `src/index.css`)
```css
@import "tailwindcss";

@theme {
  --font-display: "Outfit", sans-serif;
  --font-body: "Inter", sans-serif;

  --color-primary: #6366f1;
  --color-primary-hover: #4f46e5;
  --color-dark-bg: #090d16;

  --breakpoint-3xl: 120rem;
}
```
