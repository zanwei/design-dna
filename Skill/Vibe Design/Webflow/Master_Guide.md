---
title: "Мастер-руководство по экосистеме Vibe Design: Webflow, Tailwind v4, Awesome Design, CosmicMind Material, Shadcn/ui & Stitch"
tags: [vibe-design, webflow, tailwind, awesome-design, cosmicmind-material, swift, ios, shadcn, stitch, gsap, mcp, skills, catalog, guide]
date: 2026-07-31
status: ✅ Активен
category: "Vibe Design / Master"
---

# 🚀 Vibe Design & Master Agent Skills Suite — Единое Руководство Экосистемы

Данный документ представляет собой **главный мастер-справочник**, содержащий архитектуру, навигацию и реестр всех интегрированных **Agent Skills**, MCP-серверов и паттернов верстки в экосистеме **Vibe Design**.

---

## 🧭 1. Глобальная Навигация по Разделам Vibe Design

- 📱 **[Раздел CosmicMind Material (iOS/Swift)](file:///root/obsidian/Vibe Design/Skills/CosmicMind_Material/)**: [[Skills/CosmicMind_Material/CosmicMind_Material_Master_Index|Каталог CosmicMind Material (Cards, FABMenu, NavigationDrawer, Motion Animations)]]
- 🌟 **[Раздел Awesome Design Intelligence](file:///root/obsidian/Vibe Design/Skills/Awesome_Design/)**: [[Skills/Awesome_Design/Awesome_Design_Master_Index|Каталог Awesome Design (Стоки, Палитры, Мокапы, Иконки, Typography)]]
- 🎨 **[Раздел Tailwind CSS v4 Suite](file:///root/obsidian/Vibe Design/Skills/Tailwind/)**: [[Skills/Tailwind/Tailwind_Skills_Master_Index|Каталог Tailwind CSS v4 Скиллов (v4 Engine, Standalone CLI, Tokens, UI Components)]]
- 🌐 **[Раздел Webflow Agent Skills](file:///root/obsidian/Vibe Design/Webflow/)**: [[Webflow/Vibe_Design_Webflow_Master_Guide|Реестр 28 Webflow Скиллов, CMS, DevLink и автоматизация]]
- 🎨 **[Раздел Shadcn/ui](file:///root/obsidian/Vibe Design/Skills/Shadcn/)**: [[Skills/Shadcn/Shadcn_Skills_Master_Index|Каталог 5 Shadcn Скиллов]] & Обзор Shadcn/ui
- 💎 **[Раздел DESIGN.md (74 Бренда)](file:///root/obsidian/Vibe Design/Design_MD/)**: [[Design_MD/Design_MD_Systems_Index|Каталог 74 Дизайн-Систем (Linear, Stripe, Vercel, Apple, etc.)]]
- 🚀 **[Раздел AI SaaS & LaunchKit](file:///root/obsidian/Vibe Design/AI_SaaS/)**: [[AI_SaaS/AI_SaaS_Master_Index|Архитектура LaunchKit, Auth, Billing и AI-Wiring]]
- ✨ **[Раздел UI/UX Pro Max](file:///root/obsidian/Vibe Design/Skills/UI_UX_Pro_Max/)**: [[Skills/UI_UX_Pro_Max/UI_UX_Pro_Max_Master_Index|Design Intelligence (57 стилей, 95 палитр, 56 шрифтов, 29 лендингов)]]
- 📁 **[Раздел General](file:///root/obsidian/Vibe Design/General/)**: Пайплайны верстки и архитектура.
- 🎨 **[Раздел Figma MCP & Webflow Pipeline](file:///root/obsidian/Vibe Design/Figma/)**: [[Figma/Figma_MCP_Guide_and_Integration|Спецификация Figma MCP]] & [[General/Figma_to_Webflow_Client_First_Pipeline|Пайплайн Figma ➔ Webflow Client-First]]
- ⚡ **[Раздел GSAP Animations](file:///root/obsidian/Vibe Design/Skills/GSAP/)**: [[Skills/GSAP/GSAP_Skills_Master_Index|GreenSock (8 Скиллов: ScrollTrigger, Timelines, React, SplitText, 60fps)]]
- 🎨 **[Раздел Google Labs Stitch](file:///root/obsidian/Vibe Design/Skills/Stitch/)**: [[Skills/Stitch/Stitch_Skills_Master_Index|Stitch (15 Скиллов: React Components, Design System, Prompt, Remotion, UI)]]

---

## 📱 2. CosmicMind Material Skill (iOS / Swift UI & Motion)

Скилл **`cosmicmind-material`** (`/root/.agent/skills/cosmicmind-material/SKILL.md`) отвечает за разработку и архитектуру нативных интерфейсов мобильных приложений на **Swift для iOS**:
- **UI Компоненты**: `ImageCard`, `PresenterCard`, `FABMenuController`, `NavigationDrawer`, `SearchBarController`, `TabsController`, `Snackbar`.
- **Анимации и переходы Motion**: Анимации на основе физических пружин и смены экранов через `CosmicMind/Motion`.
- **Документация Obsidian**: [[Skills/CosmicMind_Material/CosmicMind_Material_Master_Index|CosmicMind Material Master Index]]

---

## 🌟 3. Awesome Design Intelligence Skill

Скилл **`awesome-design`** (`/root/.agent/skills/awesome-design/SKILL.md`) интегрирует международный реестр дизайнерских ресурсов (gztchan/awesome-design):
- **Цветовые палитры & Градиенты**: Coolors, BrandColors (официальные гексагональные цвета брендов), Color Hunt, uiGradients, WebGradients, Nippon Colors, Colorable (WCAG 2.1).
- **Стоковая фотография & Персоны**: Unsplash, Pexels, UI Faces (генератор профильных аватаров для юзер-персон), Life of Pix, Gratisography.
- **Мокапы устройств**: Shots.so, Screely, Cleanmock.
- **Иконки & Векторные логотипы**: Lucide Icons, Simple Icons (3,000+ брендовых логотипов), Heroicons, Iconify.
- **Документация Obsidian**: [[Skills/Awesome_Design/Awesome_Design_Master_Index|Awesome Design Master Index]]

---

## 🎨 4. Tailwind CSS Agent Skills (v4 Engine, Standalone CLI & Layout)

Набор скиллов для профессиональной верстки на **Tailwind CSS v4**:

1. **`tailwind-v4`** — Движок Tailwind v4:
   - Декларативная CSS-first конфигурация `@theme` без `tailwind.config.js`.
   - Поддержка автономного компилятора `@tailwindcss/cli` (`npx @tailwindcss/cli -i input.css -o output.css --watch`).
   - Интеграция с плагинами `@tailwindcss/vite` и `@tailwindcss/postcss`.
   - Контейнерные запросы `@container` и OKLCH палитры.
2. **`tailwind-design-system`** — Токены дизайна:
   - Иерархия токенов (Primitive ➔ Semantic).
   - Двойные стратегии Dark Mode (Class strategy & Media query).
   - Правила анти-generic верстки (Anti-AI-Slop).
3. **`tailwind-components`** — Шаблоны и компоненты:
   - Hero секции с эффектом матового стекла (Glassmorphism).
   - Адаптивные сетки дашбордов.
   - Формы с плавающими метками (Floating Labels).
- **Документация Obsidian**: [[Skills/Tailwind/Tailwind_Skills_Master_Index|Tailwind Skills Master Index]]

---

## 🌐 5. Webflow Agent Skills — Системный Реестр и Документация (28 Скиллов)

**Расположение в системе:**
- **Исполняемые файлы скиллов (CLI):** `/root/.agent/skills/`
- **Документация и справочники Obsidian:** `/root/obsidian/Vibe Design/Webflow/Skills/`
- **MCP Сервер:** `@webflow/mcp-server` в `/root/mcp_config.json`

### 📚 Полный Реестр 28 Webflow Скиллов

| № | Название скилла | CLI Имя Скилла | Категория | Документ в Obsidian |
| :-: | :--- | :--- | :--- | :--- |
| 1 | **Accessibility Audit** | `accessibility-audit` | Audits & Quality | [[Webflow/Skills/Audits_and_Quality/Accessibility_Audit\|Accessibility Audit]] |
| 2 | **Asset Audit** | `asset-audit` | Audits & Quality | [[Webflow/Skills/Audits_and_Quality/Asset_Audit\|Asset Audit]] |
| 3 | **Bulk CMS Update** | `bulk-cms-update` | CMS Management | [[Webflow/Skills/CMS_Management/Bulk_Cms_Update\|Bulk CMS Update]] |
| 4 | **CMS Best Practices** | `cms-best-practices` | CMS Management | [[Webflow/Skills/CMS_Management/Cms_Best_Practices\|CMS Best Practices]] |
| 5 | **CMS Collection Setup** | `cms-collection-setup` | CMS Management | [[Webflow/Skills/CMS_Management/Cms_Collection_Setup\|CMS Collection Setup]] |
| 6 | **Client-First Naming (Finsweet)** | `client-first-naming` | Client-First | [[Webflow/Skills/Client_First/Client_First_Naming\|Client-First Naming]] |
| 7 | **Code Component Command** | `code-component-command` | Code Components & Dev | [[Webflow/Skills/Code_Components_and_Dev/Code_Component_Command\|Code Component Command]] |
| 8 | **Component Audit** | `component-audit` | Code Components & Dev | [[Webflow/Skills/Code_Components_and_Dev/Component_Audit\|Component Audit]] |
| 9 | **Component Scaffold** | `component-scaffold` | Code Components & Dev | [[Webflow/Skills/Code_Components_and_Dev/Component_Scaffold\|Component Scaffold]] |
| 10 | **Convert Component** | `convert-component` | Code Components & Dev | [[Webflow/Skills/Code_Components_and_Dev/Convert_Component\|Convert Component]] |
| 11 | **Custom Code Management** | `custom-code-management` | Designer & Integrations | [[Webflow/Skills/Designer_and_Integrations/Custom_Code_Management\|Custom Code Management]] |
| 12 | **Deploy Guide** | `deploy-guide` | Deployment & CLI | [[Webflow/Skills/Deployment_and_CLI/Deploy_Guide\|Deploy Guide]] |
| 13 | **Designer Extension Command** | `designer-extension-command` | Deployment & CLI | [[Webflow/Skills/Deployment_and_CLI/Designer_Extension_Command\|Designer Extension Command]] |
| 14 | **Designer Tools** | `designer-tools` | Designer & Integrations | [[Webflow/Skills/Designer_and_Integrations/Designer_Tools\|Designer Tools]] |
| 15 | **DevLink Command** | `devlink-command` | Code Components & Dev | [[Webflow/Skills/Code_Components_and_Dev/Devlink_Command\|DevLink Command]] |
| 16 | **Figma To Webflow** | `figma-to-webflow` | Designer & Integrations | [[Webflow/Skills/Designer_and_Integrations/Figma_To_Webflow\|Figma To Webflow]] |
| 17 | **Flowkit Naming** | `flowkit-naming` | Client-First | [[Webflow/Skills/Client_First/Flowkit_Naming\|Flowkit Naming]] |
| 18 | **Link Checker** | `link-checker` | Audits & Quality | [[Webflow/Skills/Audits_and_Quality/Link_Checker\|Link Checker]] |
| 19 | **Local Dev Setup** | `local-dev-setup` | Code Components & Dev | [[Webflow/Skills/Code_Components_and_Dev/Local_Dev_Setup\|Local Dev Setup]] |
| 20 | **Pre Deploy Check** | `pre-deploy-check` | Deployment & CLI | [[Webflow/Skills/Deployment_and_CLI/Pre_Deploy_Check\|Pre Deploy Check]] |
| 21 | **Review Comments** | `review-comments` | Audits & Quality | [[Webflow/Skills/Audits_and_Quality/Review_Comments\|Review Comments]] |
| 22 | **Safe Publish** | `safe-publish` | Deployment & CLI | [[Webflow/Skills/Deployment_and_CLI/Safe_Publish\|Safe Publish]] |
| 23 | **Site Activity** | `site-activity` | Audits & Quality | [[Webflow/Skills/Audits_and_Quality/Site_Activity\|Site Activity]] |
| 24 | **Site Audit** | `site-audit` | Audits & Quality | [[Webflow/Skills/Audits_and_Quality/Site_Audit\|Site Audit]] |
| 25 | **Troubleshoot Deploy** | `troubleshoot-deploy` | Deployment & CLI | [[Webflow/Skills/Deployment_and_CLI/Troubleshoot_Deploy\|Troubleshoot Deploy]] |
| 26 | **Webflow CLI Troubleshooter** | `webflow-cli-troubleshooter` | Deployment & CLI | [[Webflow/Skills/Deployment_and_CLI/Webflow_Cli_Troubleshooter\|Webflow CLI Troubleshooter]] |
| 27 | **Webflow Cloud Command** | `webflow-cloud-command` | Deployment & CLI | [[Webflow/Skills/Deployment_and_CLI/Webflow_Cloud_Command\|Webflow Cloud Command]] |
| 28 | **Webflow Compress CMS Image** | `webflow-compress-cms-image` | CMS Management | [[Webflow/Skills/CMS_Management/Webflow_Compress_Cms_Image\|Webflow Compress CMS Image]] |
| 29 | **WFU MCP Getting Started** | `wfu-mcp-getting-started` | Designer & Integrations | [[Webflow/Skills/Designer_and_Integrations/Wfu_Mcp_Getting_Started\|WFU MCP Getting Started]] |

---

## 🎨 6. Разработка UI-компонентов Shadcn/ui (5 Скиллов + MCP)

- **`shadcn-component-discovery`** — Поиск компонентов и блоков по всем сторонним реестрам (Magic UI, Aceternity, Animate UI, Tailark, UI Elements).
- **`shadcn` (Core)** — Считывание `components.json` и установка элементов через `npx shadcn add`.
- **`shadcn-component-review`** — Проверка готовых компонентов на отступы, темы, data-слоты и доступность.
- **`shadcn-improve`** — Аудит кодовой базы UI и составление плана рефакторинга.
- **`migrate-radix-to-base`** — Миграция с примитивов Radix UI на новые примитивы Base UI.

---

## 🎨 7. Google Labs Stitch Skills (15 Скиллов)

- **Генерация и верстка**: `stitch-generate-design`, `stitch-code-to-design`, `stitch-react-components`, `stitch-react-vite-dashboard`, `stitch-shadcn-ui`, `stitch-react-native`, `stitch-remotion`.
- **Токены и качество**: `stitch-taste-design`, `stitch-extract-design-md`, `stitch-manage-design-system`, `stitch-enhance-prompt`, `stitch-stitch-loop`.

---

## ⚡ 8. Как задействовать скиллы в ИИ-чате

Каждый скилл автоматически активируется при формулировании соответствующей задачи:
- **Мобильный интерфейс iOS**: *"Спроектируй карточки ImageCard и выдвижное меню в стиле Material Design для iOS на Swift"*
- **Дизайнерские ресурсы**: *"Подобери цветовые палитры с BrandColors и аватарки юзеров из UI Faces"*
- **Верстка на Tailwind v4**: *"Сверстай дашборд на Tailwind CSS v4 с использованием standalone CLI и @theme"*
- **Аудит и публикация**: *"Запусти accessibility audit для сайта Webflow и опубликуй через safe-publish"*
