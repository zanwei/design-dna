# design-dna

**Language / 语言:** [English](README.md) · [简体中文](README.zh-CN.md)

---

面向编程智能体（Cursor、Claude Code、Codex 等，完整列表见 [skills CLI 文档](https://github.com/vercel-labs/skills#supported-agents)）的 [Agent Skill](https://agentskills.io)。它提供一套结构化流程，把视觉设计身份整理成可机读的「Design DNA」，并覆盖三个层面：**设计系统（可度量 token）**、**设计风格（定性感受）**与**视觉特效（非常规纯 CSS 的表现）**。

可通过开源 [`skills` CLI](https://github.com/vercel-labs/skills) 从本仓库安装。更多技能见 [skills.sh](https://skills.sh/)。

## 功能概览

| 维度 | 说明 |
|------|------|
| **设计系统** | 可度量 token：色彩、字体、间距、版式、形状、层级、动效、组件等 |
| **设计风格** | 定性描述：情绪、视觉语言、构图、图像风格、交互气质、品牌语气等 |
| **视觉特效** | 超出「普通 CSS」的实现：Canvas、WebGL、3D、粒子、着色器、滚动驱动动效、光标效果、SVG 动画、玻璃拟态等 |

技能内置 **三阶段** 工作流：

1. **结构** — 展示完整 schema 与各字段含义（见 `references/schema.md`）。
2. **分析** — 根据截图、图片或 URL，输出 **字段齐全的 JSON 画像**（无空字段；多参考冲突时注明主方案与变体）。
3. **生成** — 在已有 DNA JSON + 内容的前提下落地实现（默认：自包含 HTML/CSS/JS），并遵循 `references/generation-guide.md` 中的质量检查。

各阶段可单独使用，也可串联（例如：分析 → 生成）。

## 安装

需要本机已安装 [Node.js](https://nodejs.org/)（用于 `npx`）。**本仓库：** [github.com/zanwei/design-dna](https://github.com/zanwei/design-dna)。

```bash
# 安装到 CLI 检测到的智能体（交互式）
npx skills add zanwei/design-dna

# 仅 Cursor、非交互、安装到用户全局目录
npx skills add zanwei/design-dna -a cursor -g -y
```

**只列出仓库内技能、不安装：**

```bash
npx skills add https://github.com/zanwei/design-dna --list
```

**从本地路径安装：**

```bash
npx skills add /path/to/design-dna -a cursor -y
```

安装后的具体路径因智能体而异；Cursor 请参阅 [Cursor Skills 文档](https://cursor.com/docs/context/skills)（全局安装常见位置为 `~/.cursor/skills/`）。

## 仓库结构

```
design-dna/
├── SKILL.md                    # 技能入口：YAML 头信息 + 智能体执行说明
├── references/
│   ├── schema.md               # 完整 JSON 字段与语义
│   └── generation-guide.md     # 从 DNA 到实现与自检
├── README.md                   # 英文说明
├── README.zh-CN.md             # 本文件（中文）
├── LICENSE
└── .gitignore
```

`SKILL.md` 通过相对路径引用 `references/`；Fork 或再发布时请保持该目录关系。

## 何时应加载本技能

`SKILL.md` 的 `description` 中列出了英文触发词。概括而言，适合在用户需要以下任一能力时使用：

- 查看或讲解 **Design DNA 的结构 / schema**
- 根据 **参考图、截图或网页 URL** 做结构化 **分析并输出 JSON**
- 在已有 **DNA JSON** 的前提下 **生成界面或原型**
- 明确涉及 **视觉特效**（WebGL、粒子、着色器、滚动场景等）的分析或实现

## 兼容性

- 符合 [Agent Skills 规范](https://agentskills.io)。
- 可通过 [`vercel-labs/skills` CLI](https://github.com/vercel-labs/skills) 安装到 [其支持的智能体](https://github.com/vercel-labs/skills#supported-agents)。

## 安全说明

安装任何技能前请自行审阅仓库内容。本仓库仅包含 Markdown 说明与参考文档，**不包含**可执行脚本。若需报告与生态相关的安全问题，可参考 [skills.sh 文档](https://skills.sh/docs)中的指引。

## 贡献

欢迎提 Issue 与 Pull Request。若修改技能行为，请同步更新 `SKILL.md` 及 `references/` 下相关文件，保持文档与行为一致。

## 许可证

MIT — 见 [LICENSE](LICENSE)。
