# CLAUDE.md

Behavioral guidelines to reduce common LLM coding mistakes. Merge with project-specific instructions as needed.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

## 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

## 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

## 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

## 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

---

# 麻升智能工作室 - 项目指令

> **详细说明书**：完整目录结构、架构设计、各文件说明、运维指南见 [PROJECT.md](PROJECT.md)

## 技术栈
- 纯静态网站，零构建工具
- Tailwind CSS (CDN)、Chart.js、Flatpickr、Google Fonts
- 原生 JavaScript（ES2017+，无框架）
- 入口文件：`index.html`（开发）/ `dist/index.html`（生产）

## 四层架构

```
index.html (骨架) → partials/ (视图) → js/ (逻辑) → data/ (数据)
```

| 层级 | 目录 | 文件数 | 职责 |
|------|------|--------|------|
| 骨架 | `index.html` | 1 | HTML 容器 + CDN + 脚本加载顺序 |
| 视图 | `partials/` | 13 | 页面区块 HTML 片段 |
| 逻辑 | `js/` | 7 | 配置加载、数据组装、渲染、事件 |
| 数据 | `data/` | 19 | 纯 JSON，文案/配置/图表数据 |
| 样式 | `css/` | 3 | 全局基础 + 组件动画 + 区块专属 |

## JS 模块加载链

```
① config.js ──fetch──→ data/config.json → window.MSZN_GLOBAL_CONFIG
② data.js   ──fetch──→ data/*.json (19个) → 等待① → window.LOCAL_CMS_DATA
③ partials-loader.js ──fetch──→ partials/*.html → 注入 DOM
④ app.js ──DOMContentLoaded──→ 等待②③ → Renderers + Handlers + bootstrap()
⑤ dify.js / workspace.js / cases.js
```

> **约束**：`app.js` 内部 `while (!window.LOCAL_CMS_DATA)` 轮询等待数据就绪，修改加载顺序时需注意。

## 全局变量

| 变量 | 来源 | 用途 |
|------|------|------|
| `window.MSZN_GLOBAL_CONFIG` | config.js → config.json | 品牌/API/Dify/Agent 配置 |
| `window.LOCAL_CMS_DATA` | data.js → 19个JSON | 页面全部内容数据 |
| `window.DASHBOARD_DATA` | data.js → dashboard.json | 仪表盘图表数据 |
| `window.loadPartials()` | partials-loader.js | HTML 片段加载函数 |
| `window.WorkspaceUI` | workspace.js | 沉浸式工作台控制器 |

## 构建与部署

```bash
python -m http.server 8080   # 开发：本地服务器
python build.py              # 构建：dist/index.html (477 KB，零 fetch)
```

`build.py` 将 partials 内联到 DOM、JSON 内联为 `<script>window.*</script>`、CSS/JS 合并为内联，输出可直接浏览器打开的单文件。

## 开发约定

1. **数据修改** → 编辑 `data/*.json`，不要改 JS 中的硬编码
2. **结构修改** → 编辑 `partials/*.html`，不要改 `index.html`
3. **样式修改** → 编辑 `css/*.css`，不要写内联 `<style>`
4. **逻辑修改** → 编辑 `js/*.js`，不要写内联 `<script>`
5. **配置修改** → 编辑 `data/config.json`（API/Dify/Agent 地址）
6. **图片资源** → 放入 `assets/images/`，使用相对路径
7. **每次修改后** → `python build.py` 更新生产版本
8. **原始备份** → `html/mszn_index.html` 不做任何修改
