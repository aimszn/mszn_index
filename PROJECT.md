# 麻升智能工作室网站 — 项目目录结构说明书

> **版本**：v1.0  
> **最后更新**：2026-06-06  
> **适用对象**：智能体开发终端、运维人员、内容编辑人员

---

## 一、项目概述

麻升智能工作室官方网站（aimszn.studio）是一个**纯静态单页应用（SPA）**，由一个 9,117 行的单体 HTML 文件经过四个阶段的模块化拆分而成。

| 指标 | 原始状态 | 当前状态 |
|------|---------|---------|
| 入口文件 | `mszn_index.html`（9,117 行 / 697 KB） | `index.html`（96 行骨架） |
| CSS | 全部内联 `<style>` | 3 个独立文件（749 行） |
| JavaScript | 全部内联 `<script>` | 7 个模块文件（3,165 行） |
| HTML 内容 | 全部内联 | 13 个 partial 片段（4,405 行） |
| 数据 | 硬编码在 JS 中 | 19 个 JSON 文件（1,658 行） |
| 生产输出 | 无 | `dist/index.html`（477 KB，零依赖） |

### 技术栈

| 层级 | 技术 | 引入方式 |
|------|------|---------|
| CSS 框架 | Tailwind CSS | CDN（`cdn.tailwindcss.com`） |
| 图表 | Chart.js | CDN |
| 日期选择 | Flatpickr | CDN |
| 脚本 | 原生 JavaScript（ES2017+） | 无框架、无构建工具 |
| AI 助理 | Dify 聊天机器人 | 动态注入 |

---

## 二、完整目录结构

```
mszn_index/
│
├── index.html                          开发入口（96 行骨架）
├── build.py                            构建脚本（180 行）
├── CLAUDE.md                           智能体协作指令
├── PROJECT.md                          本说明书
│
│── css/                                ── 样式层 ──────────────
│   ├── base.css                        154 行 | 全局基础样式
│   ├── components.css                  579 行 | 通用组件与动画
│   └── sections/
│       └── cases.css                    16 行 | 案例页专属样式
│
│── js/                                 ── 脚本层 ──────────────
│   ├── config.js                        14 行 | 配置加载器
│   ├── data.js                          78 行 | 数据组装器
│   ├── partials-loader.js               44 行 | HTML 片段加载器
│   ├── app.js                        1,440 行 | 主应用逻辑
│   ├── dify.js                          97 行 | Dify AI 助理
│   ├── workspace.js                    287 行 | 沉浸式工作台
│   └── cases.js                     1,212 行 | 案例/方案/图表
│
│── data/                               ── 数据层 ──────────────
│   ├── config.json                      85 行 | 品牌/API/Dify/Agent 配置
│   ├── profile.json                     34 行 | 创始人 + 安全策略
│   ├── policies.json                    10 行 | 服务条款 + 隐私政策
│   ├── manifesto.json                    5 行 | 品牌宣言
│   ├── metrics.json                     22 行 | 核心指标数据
│   ├── pain-points.json                 22 行 | 痛点卡片
│   ├── guarantees.json                  22 行 | 服务承诺
│   ├── blueprints.json                  90 行 | B 端工作流蓝图
│   ├── c-blueprints.json                59 行 | C 端工作流蓝图
│   ├── resources.json                   50 行 | 资源下载列表
│   ├── daily-agents.json                62 行 | 每日智能体推荐
│   ├── digital-employees.json           50 行 | 数字员工列表
│   ├── pricing.json                     44 行 | 定价方案
│   ├── faqs.json                        14 行 | 常见问题
│   ├── testimonials.json                20 行 | 客户证言
│   ├── blogs.json                      442 行 | 博客文章（40 篇）
│   ├── demands.json                    218 行 | 实时需求动态（10 条）
│   ├── sandbox-mocks.json               26 行 | AI 视觉沙盒预设
│   ├── gallery.json                     68 行 | 数字画廊作品
│   └── dashboard.json                  402 行 | 仪表盘图表数据（5 类）
│
│── partials/                           ── 视图层 ──────────────
│   ├── nav.html                         93 行 | 导航栏 + 移动端侧边栏
│   ├── home/
│   │   └── home.html                   306 行 | 首页（Hero/痛点/雷达/ROI）
│   ├── masheng/
│   │   └── masheng.html                345 行 | 麻升智能 ToB 页
│   ├── moying/
│   │   └── moying.html                 447 行 | 墨影聆风 ToC 页
│   ├── cases.html                    1,339 行 | 交付案例（6 行业 × 6 案例）
│   ├── solutions.html                   208 行 | 行业解决方案
│   ├── arsenal.html                     113 行 | AI 兵器谱
│   ├── blog.html                        138 行 | 博客列表
│   ├── dashboard.html                   169 行 | 运营大盘
│   ├── trust.html                       584 行 | 信任背书/FAQ/表单/证言
│   ├── contact.html                      92 行 | 联系区域
│   ├── footer.html                      127 行 | 底部版权与链接
│   └── modals.html                      482 行 | 所有弹窗（含案例详情 Drawer）
│
│── assets/                             ── 静态资源 ────────────
│   ├── images/
│   │   └── aimszn_studio_logo.png       品牌 Logo
│   └── videos/                          视频资源（预留目录）
│
│── dist/                               ── 生产构建输出 ────────
│   ├── index.html                     477 KB | 全量内联单文件
│   └── assets/                          静态资源副本
│
└── html/                               ── 历史备份 ────────────
    ├── mszn_index.html                  原始 9,117 行单体文件
    └── aimszn_studio_logo.png           原始 Logo 副本
```

---

## 三、架构设计说明

### 3.1 分层架构

项目采用 **四层分离** 架构，每层职责单一：

```
┌─────────────────────────────────────────────────────┐
│                    index.html                        │  骨架层
│        HTML 容器 + CDN 引用 + 脚本加载顺序            │  结构定义
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                   partials/                          │  视图层
│      13 个 HTML 片段，由 partials-loader.js 注入       │  页面结构
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                    js/                               │  逻辑层
│   config → data → app (渲染/事件/路由) → 业务模块      │  交互行为
└───────────────────────┬─────────────────────────────┘
                        │
┌───────────────────────▼─────────────────────────────┐
│                   data/                              │  数据层
│         19 个 JSON 文件，纯内容数据                     │  文案/配置
└─────────────────────────────────────────────────────┘
```

### 3.2 数据流

#### 开发模式（HTTP 服务器）

```
浏览器加载 index.html
       │
       ├─→ CDN: Tailwind / Chart.js / Flatpickr / Google Fonts
       ├─→ css/base.css + components.css + sections/cases.css
       │
       ├─→ js/config.js ──── fetch ──→ data/config.json
       │     └→ window.MSZN_GLOBAL_CONFIG
       │
       ├─→ js/data.js ───── 并行 fetch ──→ data/*.json (19 个)
       │     └→ 等待 config 就绪
       │     └→ 组装 window.LOCAL_CMS_DATA + window.DASHBOARD_DATA
       │
       ├─→ js/partials-loader.js ── 并行 fetch ──→ partials/*.html (13 个)
       │     └→ 注入到对应的 DOM 占位 div
       │
       ├─→ js/app.js ────── DOMContentLoaded
       │     ├→ 等待 partials 加载完成
       │     ├→ 等待 LOCAL_CMS_DATA 就绪
       │     ├→ 渲染所有动态内容（Renderers.*）
       │     ├→ 绑定事件代理
       │     └→ bootstrap() 启动
       │
       ├─→ js/dify.js ───── 注入 Dify 聊天机器人
       ├─→ js/workspace.js ─ 沉浸式工作台
       └─→ js/cases.js ──── 案例过滤/方案切换/图表
```

#### 生产模式（dist/index.html）

```
浏览器打开 dist/index.html（单文件，477 KB）
       │
       ├─→ CDN: Tailwind / Chart.js / Flatpickr / Google Fonts
       ├─→ <style> 全部 CSS 内联
       │
       ├─→ <script> window.MSZN_GLOBAL_CONFIG = {...}; </script>
       ├─→ <script> window._PROFILE / _POLICIES / _BLOGS / ... = {...}; </script>
       ├─→ <script> window.LOCAL_CMS_DATA = {...}; </script>
       ├─→ <script> window.DASHBOARD_DATA = {...}; </script>
       │
       ├─→ HTML partials 已内联到 DOM 中
       │
       └─→ <script> app.js + dify.js + workspace.js + cases.js 内联 </script>
            └→ 直接执行，无需 fetch，零网络请求（除 CDN）
```

### 3.3 JS 模块加载顺序与依赖

```
① config.js          ← 无依赖，最先加载
       ↓ (异步)
② data.js            ← 依赖 config.js 完成后组装
       ↓ (异步)
③ partials-loader.js ← 无依赖，与 ①② 并行
       ↓ (异步)
④ app.js             ← 等待 ②③ 都完成后执行
       ↓
⑤ dify.js            ← 依赖 config 中的 difyChatbot 配置
⑥ workspace.js       ← 独立
⑦ cases.js           ← 依赖 data 中的 DASHBOARD_DATA
```

> **关键约束**：`<script defer>` 保证按文档顺序执行，但异步 IIFE 内的 fetch 不阻塞后续脚本加载。`app.js` 内部通过 `while` 轮询等待数据就绪。

### 3.4 页面区块与 partials 映射

| 区块 ID | partial 文件 | 路由切换 | 核心内容 |
|---------|-------------|---------|---------|
| `view-home` | `partials/home/home.html` | 默认显示 | Hero + 痛点 + AI 雷达 + ROI 计算器 |
| `view-masheng` | `partials/masheng/masheng.html` | 切换显示 | ToB 企业自动化 + 三层架构 + 定价 |
| `view-moying` | `partials/moying/moying.html` | 切换显示 | ToC 数字艺术 + AI 视觉沙盒 |
| `view-cases` | `partials/cases.html` | 切换显示 | 6 行业 × 6 案例卡片 |
| `view-solutions` | `partials/solutions.html` | 切换显示 | 行业解决方案 |
| `view-arsenal` | `partials/arsenal.html` | 切换显示 | AI 兵器谱工具矩阵 |
| `view-blog` | `partials/blog.html` | 切换显示 | 博客文章列表（40 篇） |
| `view-dashboard` | `partials/dashboard.html` | 切换显示 | 运营大盘图表 |
| — | `partials/trust.html` | 始终渲染 | 信任背书/FAQ/表单/证言 |
| `contact` | `partials/contact.html` | 始终渲染 | 联系表单 |
| — | `partials/footer.html` | 始终渲染 | 底部版权 |
| — | `partials/modals.html` | 按需弹出 | 所有弹窗组件 |
| — | `partials/nav.html` | 始终渲染 | 导航栏 |

---

## 四、各文件详细说明

### 4.1 入口文件

#### `index.html`（96 行）

开发模式的骨架文件。仅包含：
- `<head>`：SEO meta、CDN 引用、CSS 链接
- `<body>`：容灾错误边界、水印层、13 个 partial 占位 div、7 个 script 标签

**不包含任何页面内容**，所有内容由 partials 和 JS 动态注入。

#### `build.py`（180 行）

Python 构建脚本，执行以下操作：
1. 读取 `index.html` 骨架
2. 将所有 `partials/*.html` 内联到对应的占位 div
3. 将所有 `data/*.json` 内联为 `<script>window.* = {...};</script>`
4. 将所有 CSS 合并为内联 `<style>`
5. 将所有 JS 合并为内联 `<script>`
6. 输出到 `dist/index.html`

**用法**：`python build.py`

---

### 4.2 CSS 文件

#### `css/base.css`（154 行）

全局基础样式，包括：
- CSS 变量（`--b-accent`、`--c-accent`、`--bg-dark`）
- 基础字号设置（17px / 18px 响应式）
- body 背景、噪点纹理、滚动条美化
- 字体类（`.font-mono`、`.font-serif`）
- 系统容灾降级样式（`#error-boundary`）
- 防盗水印层样式
- 打印样式（`@media print`）

#### `css/components.css`（579 行）

通用 UI 组件样式，包括：
- `.glass-card` 玻璃拟态卡片
- `.view-section` 视图切换区块
- `.dot-grid-*` 点阵背景
- `.bg-tech-grid` 科技网格
- `.nav-link` 导航链接
- `.reveal-on-scroll` 滚动视差
- `.article-content` 博客正文排版
- 所有 `@keyframes` 动画（marquee、spin、scanner、orbit 等）
- Dify 聊天窗口定位样式
- Range 滑块美化

#### `css/sections/cases.css`（16 行）

案例页专属的横向滚动动画（`@keyframes scrollLeft`）。

---

### 4.3 JavaScript 模块

#### `js/config.js`（14 行）— 配置加载器

```js
(async function () {
    const resp = await fetch('data/config.json');
    window.MSZN_GLOBAL_CONFIG = await resp.json();
})();
```

- 异步加载 `data/config.json`
- 挂载到 `window.MSZN_GLOBAL_CONFIG` 全局变量
- 包含降级兜底（加载失败时使用空配置）
- **被依赖方**：`data.js`、`dify.js`

#### `js/data.js`（78 行）— 数据组装器

- 并行 fetch 所有 19 个 JSON 文件
- 等待 `config.js` 完成后，用 config 的值组装 `LOCAL_CMS_DATA`
- 输出两个全局变量：
  - `window.LOCAL_CMS_DATA`：页面全部内容数据
  - `window.DASHBOARD_DATA`：仪表盘图表数据

#### `js/partials-loader.js`（44 行）— HTML 片段加载器

- 定义 `window.loadPartials()` 全局函数
- 并行 fetch 13 个 partial HTML 文件
- 将内容注入到对应的 `#partial-*` 占位 div
- 由 `app.js` 在 DOMContentLoaded 中 await 调用

#### `js/app.js`（1,440 行）— 主应用逻辑

核心模块，包含：

| 区域 | 行数范围 | 职责 |
|------|---------|------|
| 状态变量 | 顶部 | `isCsOpen`、`isAudioPlaying`、`chartRevInstance` 等 |
| `fetchSystemConfig()` | ~30 行 | 返回已加载的 LOCAL_CMS_DATA |
| `Renderers` 对象 | ~400 行 | 12 个渲染方法，将数据填充到 DOM |
| `Handlers` 对象 | ~700 行 | 事件处理：弹窗、ROI 计算、表单提交、音频等 |
| 事件代理 | ~90 行 | `document.addEventListener('click/input')` |
| `bootstrap()` | ~120 行 | 启动引擎：渲染 + 媒体 + 水印 + 视差 |

**启动流程**：
```
DOMContentLoaded
  → await loadPartials()
  → await 等待 LOCAL_CMS_DATA
  → await bootstrap()
    → 渲染所有区块（Renderers.*）
    → 绑定全局品牌信息
    → 初始化视频/音频
    → 绑定 IntersectionObserver
    → 默认展示第一个方案
```

#### `js/dify.js`（97 行）— Dify AI 助理

三段式结构（原三个独立 script 块合并）：
1. 设置 `window.difyChatbotConfig`（从 config 读取 token/baseUrl）
2. 动态创建 `<script>` 加载 Dify embed.min.js
3. Flatpickr 日期选择器初始化 + Dify 窗口滚动锁定

#### `js/workspace.js`（287 行）— 沉浸式工作台

`window.WorkspaceUI` 对象，提供：
- `init()`：动态创建全屏工作台 DOM
- `close()`：关闭工作台
- 侧边栏菜单、工具面板等

#### `js/cases.js`（1,212 行）— 案例与解决方案

包含三部分：
1. **案例过滤逻辑**：行业分类按钮 → 卡片显隐动画
2. **方案切换逻辑**：需求列表 → 方案详情 Drawer
3. **仪表盘图表**：Chart.js 初始化 + 分类切换
4. **案例详情数据**：`CASE_DETAILS_DATA` 字典（Before/After 对比 + 代码块）

---

### 4.4 数据文件（data/）

所有数据文件为纯 JSON，可直接用文本编辑器修改。

#### `data/config.json` — 统一配置中心

```json
{
  "base": { "brand", "brandEn", "logo", "email", "wechat", "copyrightYear" },
  "media": { "demoAudio", "videoB_Url", "videoB_Poster", "social": { ... } },
  "api": { "n8nWebhook", "newsletterWebhook" },
  "difyChatbot": { "baseUrl", "token", "inputs" },
  "agents": { "floatingCs", "booking", "credit", ... (15 个智能体 URL) }
}
```

**运维重点**：修改 API 地址、Dify Token、智能体链接时只改此文件。

#### `data/profile.json` — 创始人与安全策略

```json
{
  "founder": { "name", "role", "avatar", "philosophy", "techStack" },
  "security": [{ "icon", "title", "desc" }, ...]
}
```

#### `data/blogs.json` — 博客文章（40 篇）

```json
[{ "id", "title", "date", "category", "readTime", "featured", "summary", "image", "content" }, ...]
```

分类：架构前沿、同城实体、自媒体IP、学术科研、职场效能

#### `data/demands.json` — 实时需求动态（10 条）

```json
[{ "id", "time", "type", "label", "client", "req", "title", "tags", "roi", "workflow" }, ...]
```

#### `data/dashboard.json` — 仪表盘图表（5 个分类）

```json
{
  "all":      { "stats", "rev": { "labels", "datasets" }, "alloc": { "labels", "data", "colors" } },
  "local":    { ... },
  "creator":  { ... },
  "workedu":  { ... },
  "enterprise": { ... }
}
```

#### 其余数据文件

| 文件 | 内容 | 条目数 |
|------|------|--------|
| `pain-points.json` | 首页痛点卡片 | 4 |
| `guarantees.json` | 服务承诺卡片 | 4 |
| `metrics.json` | 核心指标数字 | 4 |
| `manifesto.json` | 品牌宣言 | 1 |
| `blueprints.json` | B 端工作流蓝图 | 4 |
| `c-blueprints.json` | C 端工作流蓝图 | 3 |
| `resources.json` | 资源下载列表 | 6 |
| `daily-agents.json` | 每日智能体推荐 | 3 |
| `digital-employees.json` | 数字员工列表 | 4 |
| `pricing.json` | 定价方案 | 4 |
| `faqs.json` | 常见问题 | 3 |
| `testimonials.json` | 客户证言 | 3 |
| `sandbox-mocks.json` | AI 视觉沙盒预设 | 3 |
| `gallery.json` | 数字画廊作品 | 6 |
| `policies.json` | 服务条款 + 隐私政策 | 2 |

---

### 4.5 HTML 片段（partials/）

每个 partial 文件包含一个完整的 HTML 区块，**不含** `<html>`、`<head>`、`<body>` 标签。

#### 特殊说明

| 文件 | 说明 |
|------|------|
| `nav.html` | 包含 `<nav>` + 移动端侧边栏 `<div>` |
| `home/home.html` | 包含多个子区块：Hero、跑马灯、痛点网格、AI 雷达、ROI 计算器、指标、宣言、推荐语 |
| `cases.html` | 最大的 partial（1,339 行），包含 6 个行业分类下的 36 个案例卡片 |
| `modals.html` | 包含 10+ 个弹窗组件 + 案例详情 Drawer |
| `trust.html` | 包含「为什么选择麻升」、交付地图、创始人、架构对比、SLA 大屏、FAQ、表单、证言 |

---

## 五、运维指南

### 5.1 内容更新流程

```
1. 编辑 data/ 下对应的 JSON 文件
2. 运行 python build.py
3. 部署 dist/ 目录到服务器
```

#### 常见更新场景

| 更新需求 | 修改文件 | 示例 |
|---------|---------|------|
| 更换 Logo | `assets/images/` + `data/config.json` | 更新 `base.logo` 路径 |
| 修改邮箱/微信 | `data/config.json` | 更新 `base.email` |
| 更换 Dify Token | `data/config.json` | 更新 `difyChatbot.token` |
| 更新智能体链接 | `data/config.json` | 更新 `agents.*` |
| 添加博客文章 | `data/blogs.json` | 在数组末尾追加新对象 |
| 修改定价 | `data/pricing.json` | 更新对应方案的 `price` 和 `features` |
| 更新客户证言 | `data/testimonials.json` | 修改 `content` 和 `author` |
| 添加案例 | `data/demands.json` + `partials/cases.html` | JSON 加数据 + HTML 加卡片 |
| 修改 FAQ | `data/faqs.json` | 更新问答内容 |
| 更新仪表盘数据 | `data/dashboard.json` | 更新图表 labels 和 datasets |
| 修改页面结构 | `partials/` 下对应文件 | 直接编辑 HTML |
| 调整样式 | `css/` 下对应文件 | 编辑 CSS |
| 修改交互逻辑 | `js/` 下对应文件 | 编辑 JS |

### 5.2 构建与部署

```bash
# 开发模式（需要 HTTP 服务器）
python -m http.server 8080
# 浏览器访问 http://localhost:8080

# 生产构建
python build.py
# 输出 dist/index.html（477 KB，可直接打开）

# 部署
# 上传 dist/ 目录到任意静态托管服务
# 推荐：GitHub Pages / Vercel / Cloudflare Pages / Nginx
```

### 5.3 部署检查清单

- [ ] `python build.py` 构建成功，无报错
- [ ] 浏览器打开 `dist/index.html` 无控制台错误
- [ ] 所有页面区块正常显示（首页/ToB/ToC/案例/方案/博客/仪表盘）
- [ ] 导航切换正常
- [ ] AI 雷达问卷 + ROI 计算器交互正常
- [ ] Dify 聊天窗口正常加载
- [ ] 移动端响应式布局正常
- [ ] 图片资源路径正确（`assets/images/`）

---

## 六、智能体开发约定

### 6.1 文件修改规则

| 修改类型 | 目标文件 | 禁止操作 |
|---------|---------|---------|
| 修改文案/数据 | `data/*.json` | 不要改 JS 中的硬编码数据 |
| 修改页面结构 | `partials/*.html` | 不要改 `index.html` |
| 修改样式 | `css/*.css` | 不要在 HTML 中写 `<style>` |
| 修改交互逻辑 | `js/*.js` | 不要在 HTML 中写 `<script>` |
| 修改配置 | `data/config.json` | 不要改 `js/config.js` |
| 添加新页面 | 新建 `partials/xxx.html` + 更新 `index.html` 占位 | — |
| 添加新样式 | 新建 `css/sections/xxx.css` + `index.html` 引用 | — |

### 6.2 修改后验证流程

```
1. 编辑目标文件
2. python -m http.server 启动本地服务器
3. 浏览器验证修改效果
4. python build.py 构建生产版本
5. 浏览器打开 dist/index.html 验证
6. 确认无控制台报错
```

### 6.3 注意事项

1. **JSON 格式**：所有 `data/*.json` 必须是合法 JSON（双引号、无尾逗号）
2. **图片路径**：统一使用相对路径 `assets/images/filename.png`
3. **外部链接**：CDN 资源使用 HTTPS
4. **编码**：所有文件统一 UTF-8
5. **原始备份**：`html/mszn_index.html` 不做任何修改，保留为历史参考
6. **构建输出**：`dist/` 目录由 `build.py` 自动生成，不要手动编辑

---

## 附录 A：四阶段拆分记录

| 阶段 | 目标 | 输入 | 输出 | 行数变化 |
|------|------|------|------|---------|
| 一 | CSS 分离 | 906 行 `<style>` | `css/base.css` + `components.css` + `sections/cases.css` | 9,117 → 8,241 |
| 二 | JS 模块化 | 3,749 行 `<script>` | 7 个 JS 模块文件 | 8,241 → 4,637 |
| 三 | HTML 拆分 | 4,405 行 HTML 内容 | 13 个 partial 片段 | 4,637 → 96 |
| 四 | 数据外置 | 硬编码在 JS 中 | 19 个 JSON 文件 | JS 645→78 行 |

## 附录 B：全局变量清单

| 变量名 | 定义位置 | 类型 | 说明 |
|--------|---------|------|------|
| `window.MSZN_GLOBAL_CONFIG` | config.js | Object | 品牌/API/Dify/Agent 配置 |
| `window.LOCAL_CMS_DATA` | data.js | Object | 页面全部内容数据 |
| `window.DASHBOARD_DATA` | data.js | Object | 仪表盘图表数据 |
| `window.loadPartials` | partials-loader.js | Function | HTML 片段加载函数 |
| `window.WorkspaceUI` | workspace.js | Object | 沉浸式工作台控制器 |
| `window.CASE_DETAILS_DATA` | cases.js | Object | 案例详情 Before/After 数据 |

## 附录 C：CDN 依赖清单

| 资源 | URL | 用途 |
|------|-----|------|
| Tailwind CSS | `cdn.tailwindcss.com` | CSS 框架 |
| Chart.js | `cdn.jsdelivr.net/npm/chart.js` | 图表渲染 |
| Flatpickr | `cdn.jsdelivr.net/npm/flatpickr` | 日期选择器 |
| Google Fonts | `fonts.googleapis.com` | Inter + JetBrains Mono + Noto Serif SC |
| Dify Embed | `dify.cursormax.fun/embed.min.js` | AI 聊天窗口 |
