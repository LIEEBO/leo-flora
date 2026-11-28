---
name: Leo Faux Editorial Botanical Wholesale
colors:
  surface: '#fffaf2'
  surface-dim: '#e6d9ca'
  surface-bright: '#fffdf9'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#faf3e8'
  surface-container: '#f1e8dc'
  surface-container-high: '#eadfd4'
  surface-container-highest: '#dfd1c2'
  on-surface: '#251f20'
  on-surface-variant: '#6d6263'
  inverse-surface: '#28181b'
  inverse-on-surface: '#f8eee8'
  outline: '#b7a598'
  outline-variant: '#eadfd4'
  surface-tint: '#7f1d2d'
  primary: '#7f1d2d'
  on-primary: '#ffffff'
  primary-container: '#521822'
  on-primary-container: '#f8eee8'
  inverse-primary: '#e3a858'
  secondary: '#e3a858'
  on-secondary: '#28181b'
  secondary-container: '#f1e8dc'
  on-secondary-container: '#5a3a14'
  tertiary: '#28181b'
  on-tertiary: '#fffaf2'
  tertiary-container: '#3d252a'
  on-tertiary-container: '#e7bd84'
  error: '#b42318'
  on-error: '#ffffff'
  error-container: '#fdece9'
  on-error-container: '#7a1610'
  primary-fixed: '#f7dde1'
  primary-fixed-dim: '#e2adb6'
  on-primary-fixed: '#3a0a12'
  on-primary-fixed-variant: '#651422'
  secondary-fixed: '#faead1'
  secondary-fixed-dim: '#e7bd84'
  on-secondary-fixed: '#2e1d08'
  on-secondary-fixed-variant: '#a16827'
  tertiary-fixed: '#ece1e3'
  tertiary-fixed-dim: '#d5c6ca'
  on-tertiary-fixed: '#28181b'
  on-tertiary-fixed-variant: '#4e4546'
  background: '#fffaf2'
  on-background: '#251f20'
  surface-variant: '#f1e8dc'
typography:
  display-xl:
    fontFamily: Cormorant Garamond
    fontSize: 72px
    fontWeight: '400'
    lineHeight: 74px
    letterSpacing: -0.035em
  headline-lg:
    fontFamily: Cormorant Garamond
    fontSize: 44px
    fontWeight: '400'
    lineHeight: 50px
    letterSpacing: -0.025em
  headline-md:
    fontFamily: Cormorant Garamond
    fontSize: 28px
    fontWeight: '500'
    lineHeight: 34px
    letterSpacing: -0.015em
  body-base:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 27px
    letterSpacing: '0'
  body-bold:
    fontFamily: Plus Jakarta Sans
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 26px
    letterSpacing: '0'
  label-kicker:
    fontFamily: Plus Jakarta Sans
    fontSize: 12px
    fontWeight: '700'
    lineHeight: 16px
    letterSpacing: 0.14em
  mono-sku:
    fontFamily: JetBrains Mono
    fontSize: 13px
    fontWeight: '600'
    lineHeight: 18px
    letterSpacing: 0.04em
rounded:
  sm: 0.5rem
  DEFAULT: 0.75rem
  md: 1rem
  lg: 1.25rem
  xl: 1.75rem
  full: 9999px
spacing:
  unit: 4px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 56px
  section: 82px
  gutter: 24px
  margin-mobile: 20px
  margin-desktop: 32px
---

# Design System: Leo Faux (`www.leofaux.com`)

> **版本定位**：新版统一设计规范（v2.0 — 暖调轻奢植物画廊 × B2B 源头制造专业感）  
> **适用范围**：官网首页 (`index.html`)、3,300+ SKU 批发目录页 (`shop.html`)、品牌内页与博客 (`en/*`)、以及后续 Google Stitch 新页面设计与重构。  
> **核心升级**：彻底清除早期代码残留的冷蓝 (`#2c3e50`) 与亮红 (`#e74c3c`)，全面收敛至「勃艮第酒红 × 暖象牙奶油 × 深黑檀梅子 × 香槟古铜金」单一暖调色盘，并引入高定衬线 + 清晰无衬线 + 等宽货号字体的三层排版体系。

---

## 1. Visual Theme & Atmosphere（视觉主题与氛围定调）

**Leo Faux** 的视觉气质如同一座采光充沛的**欧洲植物标本画廊与高定花艺展厅**，同时兼具中国义乌源头大厂的秩序感与可信赖度。页面以温润的象牙奶油纸张色（`#fffaf2`）作为画布基底，搭配深沉而克制的黑檀梅子深色块（`#28181b`）与勃艮第酒红（`#7f1d2d`），让高饱和度的仿真花朵、丝绸花瓣与绿植实拍图成为绝对的视觉主角，而非被杂乱的装饰元素抢戏。

整体在**呼吸感与商业效率**之间取得精准平衡：品牌展示页（首页、关于我们、博客）偏向画廊级的编辑部排版——大留白、非对称构图、克制的细线边框与柔和摄影过渡；而面向海外批发商的 3,300+ SKU 选品目录页（`/shop.html`）则切换为高清晰度的工具化网格，以极低噪点的卡片、清晰的等宽货号标签与流畅的收藏导出动线，服务于真实 B2B 采购场景。

- **画面密度（Density）**：首页 `4 / 10`（画廊舒展感）；选品目录页 `6 / 10`（高效率采购平衡态）
- **版式变化度（Variance）**：`7 / 10`（非对称分屏 Hero、交错比例网格、图文分栏节奏）
- **动效克制度（Motion）**：`5 / 10`（优雅流畅的 CSS 与弹簧微交互，拒绝浮夸炫技）

---

## 2. Color Palette & Roles（色彩体系与功能角色）

全站严格遵守**单一暖调中性色系统**，禁止混入冷灰或纯黑（`#000000`）。所有阴影均以深黑檀梅子色（`#28181b`）的低透明度着色，保持色彩温度统一。

### 2.1 Primary Foundation（基础画布与层级表面）
| 语义名称 | Hex 色值 | CSS Token | 功能角色与使用场景 |
| :--- | :--- | :--- | :--- |
| **Warm Ivory Cream（暖象牙奶油）** | `#fffaf2` | `--leo-cream` | 全站默认页面主背景、顶部导航底色、弹窗与询盘表单表面 |
| **Pure Gallery White（纯净画廊白）** | `#ffffff` | `--leo-white` | 商品卡片、工艺卡片、FAQ 手风琴、官方二维码卡片的纯白承托面 |
| **Warm Oat Surface（暖燕麦浅底）** | `#f1e8dc` | `--leo-oat` | 交替区块背景（`.bg-accent`）、SKU 货号徽章、工厂统计块底色 |
| **Warm Linen Hairline（亚麻细线）** | `#eadfd4` | `--leo-line` | 1px 结构分割线、卡片默认边框、导航底部边线 |
| **Deep Espresso Plum（深黑檀梅子）** | `#28181b` | `--leo-deep` | 顶部公告栏、首页 Hero 左侧暗底、全站页脚、暗色画廊卡片衬底 |

### 2.2 Accent & Interactive（品牌强调与交互色）
| 语义名称 | Hex 色值 | CSS Token | 功能角色与使用场景 |
| :--- | :--- | :--- | :--- |
| **Burgundy Wine（勃艮第酒红）** | `#7f1d2d` | `--leo-wine` | **唯一主强调色**：主 CTA 按钮、导航激活态、类目选中药丸、数据高亮、询盘大卡片主底色 |
| **Deep Merlot Hover（深梅洛酒红）** | `#651422` | `--leo-wine-hover` | 主按钮 Hover / Active 按压反馈态 |
| **Antique Champagne Gold（香槟古铜金）** | `#e3a858` | `--leo-gold` | 暗色背景上的点缀强调：Hero 标题斜体关键词、Kicker 眉题、页脚栏目标题、次级金色按钮 |
| **Burnished Amber Focus（琥珀焦糖金）** | `#b77826` | `--leo-focus` | 键盘无障碍焦点环（`:focus-visible` `3px solid`）、步骤编号装饰色（`#a16827`） |

### 2.3 Typography & Text Hierarchy（文字层级）
| 语义名称 | Hex 色值 | CSS Token | 功能角色与使用场景 |
| :--- | :--- | :--- | :--- |
| **Warm Charcoal Ink（暖炭黑墨）** | `#251f20` | `--leo-ink` | 浅底主标题、正文核心文字、Logo 品牌字标（替代纯黑 `#000000`） |
| **Warm Stone Muted（暖灰褐）** | `#6d6263` | `--leo-muted` | 次级说明文字、副标题、产品规格详情、时间戳、未激活导航链接 |
| **Soft Blush Cream（柔粉奶油字）** | `#f8eee8` | `--leo-on-dark` | 深色背景（`#28181b` / `#7f1d2d`）上的主文案与标题 |
| **Dusty Rose Mist（烟粉柔灰）** | `#d5c6ca` | `--leo-on-dark-muted` | 深色背景（Hero 副文案、页脚链接）上的次级可读文字 |

### 2.4 Functional & Channel States（功能状态与外贸渠道色）
| 语义名称 | Hex 色值 | 功能角色与使用场景 |
| :--- | :--- | :--- |
| **Botanical Sage Success（植物鼠尾草绿）** | `#2e6f40` | 表单提交成功、Excel 导出完成、库存现货状态提示 |
| **Crimson Terracotta Error（赤陶警示红）** | `#b42318` | 表单必填校验失败、网络请求错误提示（配浅底 `#fdece9`） |
| **WhatsApp Official Green（WhatsApp 渠道绿）** | `#25d366` | 仅限右下角 WhatsApp 悬浮球与明确标识 WhatsApp 渠道的直连按钮（Hover `#1da851`） |
| **WeChat Official Green（WeChat 渠道绿）** | `#07c160` | 仅限联系弹窗中的微信直连按钮 |

> **废弃色清单**：严禁在新页面或重构中继续使用旧版 `#2c3e50`（海军蓝）、`#1a2a3a`（冷深蓝）、`#e74c3c`（亮警示红）、`#f8f9fa`（冷浅灰）及 `#1a1a2e`（冷紫黑）。

---

## 3. Typography Rules（字体与排版规则）

### 3.1 Font Stack（三层字体架构）
1. **Display / Editorial Serif（展示与章节标题）**：`'Cormorant Garamond', 'Instrument Serif', Georgia, serif`
   - **气质**：优雅的高对比度现代衬线体，带有花瓣舒展般的收笔弧度，赋予 B2B 仿真花官网以轻奢花艺杂志的辨识度。
   - **用法**：仅用于 `H1`、`H2`、卡片大标题、核心统计大数字与步骤序数（`01`–`04`）；采用 `font-weight: 400` 常规字重配合收紧字距，靠比例与留白而非粗笨加粗建立层级。
2. **Body & UI Sans（正文、导航与交互控件）**：`'Plus Jakarta Sans', 'Noto Sans SC', -apple-system, BlinkMacSystemFont, sans-serif`
   - **气质**：温润且具有几何秩序感的人文无衬线体，在小字号与多语言（EN / 中文 / ES / AR）混排下依然具备极高易读性。
   - **用法**：导航、按钮、正文段落、表单标签、FAQ 问答、商品名称。
3. **Technical Mono（货号与 B2B 数据）**：`'JetBrains Mono', ui-monospace, monospace`
   - **气质**：精准、工业化的等宽数字与字母对齐，强化源头工厂 SKU 管理的专业感。
   - **用法**：产品货号（如 `H007487`）、数量步进器数字、装箱规格、MOQ 与报价单编号。

### 3.2 Type Scale & Hierarchy（字阶规范）
| 层级角色 | 字体族 | 字号（桌面 / 流动） | 字重 | 行高 | 字距 | 典型应用场景 |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Hero Display (`H1`)** | Serif | `clamp(3.1rem, 5.7vw, 5.2rem)` | `400` | `1.02` | `-0.04em` | 首页主标题，核心情感词用 `<em>` 染香槟金 `#e3a858` |
| **Section Title (`H2`)** | Serif | `clamp(2rem, 3.5vw, 3.25rem)` | `400` | `1.12` | `-0.03em` | 首页与内页章节大标题 |
| **Card / Modal Title (`H3`)** | Serif | `1.5rem – 1.875rem` (`24–30px`) | `400` | `1.20` | `-0.015em` | 7 大类目卡片标题、询盘弹窗标题、展厅浮标 |
| **UI Subtitle (`H4`)** | Sans | `1.0625rem` (`17px`) | `600` | `1.40` | `0` | 工艺步骤标题、Why Us 标题、博客文章标题 |
| **Body Copy** | Sans | `1rem` (`16px`) | `400` | `1.70` | `0` | 正文段落，最大行宽控制在 `60–65ch`（约 `530–680px`） |
| **UI Meta / Secondary** | Sans | `0.875rem` (`14px`) | `500` | `1.55` | `0` | 导航链接、表单标签、产品规格、页脚链接 |
| **Kicker / Eyebrow** | Sans | `0.75rem – 0.8125rem` (`12–13px`) | `700` | `1.30` | `+0.14em` | 全大写章节眉题（如 `OUR COLLECTIONS`、`HOW TO ORDER`） |
| **SKU / Badge Mono** | Mono | `0.8125rem` (`13px`) | `600` | `1.30` | `+0.04em` | 商品卡片货号标签、统计计数徽章 |

---

## 4. Component Stylings（核心组件规范）

### 4.1 Buttons（按钮系统）
全站按钮统一采用**全圆角胶囊形态（`border-radius: 999px`）**，传达花艺的柔美与现代轻奢感；严禁霓虹外发光阴影。
- **Primary（主按钮 — 勃艮第酒红）**：填充 `#7f1d2d`，文字 `#ffffff`，内边距 `13px 26px`，最小高度 `46px`。Hover 变为 `#651422` 并微幅上浮 `translateY(-1px)`；Active 态下沉 `translateY(1px)` 提供触觉回弹。
- **Secondary on Dark（暗底描边按钮）**：透明底、`1px solid rgba(255, 250, 242, 0.45)`，文字 `#fffaf2`。Hover 时边框提亮至 `#fffaf2` 并叠加 `rgba(255, 250, 242, 0.08)` 微弱底色。
- **Accent Gold（香槟金强调按钮）**：填充 `#e3a858`，文字 `#28181b`（字重 `700`），仅用于暗色 Banner 中的次级高转化动作（如“下载报价单”）。
- **Ghost / Filter Pill（类目筛选药丸）**：纯白底 `#ffffff` + `1px solid #eadfd4`，文字 `#6d6263`，内边距 `8px 16px`。Hover 边框与文字转 `#7f1d2d`；激活态（`.active`）转为酒红实心填充 + 白字。

### 4.2 Cards & Containers（卡片与容器）
摒弃厚重投影，坚持**细线边界（`1px solid #eadfd4`）+ 表面色差**构建层次；仅在浮动卡片（如 Hero 展厅浮标）使用低饱和暖色扩散阴影 `0 8px 30px rgba(40, 24, 27, 0.15)`。
- **标准信息卡片（工艺 / 工厂 / 博客 / 评价）**：背景 `#ffffff`，圆角 `16px`（`1rem`），边框 `1px solid #eadfd4`，内边距 `24px–28px`。
- **7 大类目画廊卡片（`.collection-card`）**：大圆角 `20px`，最小高度 `355px`，全出血高清花艺实拍图，底部覆盖深梅子渐变遮罩 `linear-gradient(transparent 15%, rgba(40, 24, 27, 0.92) 100%)`；文字严格锚定底部左对齐，顶部配有香槟金编号眉题（如 `01 · SINGLE STEMS`），Hover 时图片缓慢缩放 `scale(1.04)`。
- **SKU 批发商品卡片（`.product-card`）**：背景 `#ffffff`，圆角 `16px`，边框 `1px solid #eadfd4`，图片区固定高度（桌面 `240px` / 移动 `145px`）且支持 `cursor: zoom-in` 点击灯箱放大；右上角悬浮圆形收藏心形按钮（`40px × 40px`，毛玻璃白底，激活态为 `#7f1d2d`）；信息区包含暖燕麦底色等宽货号徽章、产品标题及底部细线分隔的规格详情。

### 4.3 Navigation & Announcement Bar（导航与顶部公告）
- **顶部公告栏**：深黑檀梅子底 `#28181b`，字号 `12px–13px`，字距 `+0.08em`，居中展示品牌核心定位（`LEO FAUX · Wholesale artificial flowers from Yiwu, China`）。
- **主导航栏**：Sticky 吸顶，半透明暖象牙奶油底 `rgba(255, 250, 242, 0.94)` + `backdrop-filter: blur(10px)` + 底部 `1px solid #eadfd4`。左侧为 `38px` 品牌 Logo + 宽字距 `LEO FAUX` 字标（`letter-spacing: 0.13em`）；右侧水平排列主导航链接，当前页（`aria-current="page"`）以勃艮第酒红 `#7f1d2d` 加粗标识。目录页最右侧集成多语言选择器（ZH / EN / ES / AR）与客户登录状态胶囊。

### 4.4 Inputs & Wholesale Enquiry Form（表单与 B2B 询盘模块）
- **大询盘容器（`.contact-box`）**：圆角 `28px`，勃艮第酒红底 `#7f1d2d`，左右双栏非对称布局（左侧 `1.05fr` 展厅信息与 4 枚官方二维码，右侧 `1fr` 嵌入暖象牙白 `#fffaf2` 表单卡片）。
- **表单控件规范**：标签永远位于输入框上方（禁用浮动标签），字号 `14px`、字重 `600`；输入框纯白底 `#ffffff`、边框 `1px solid #d2c0b7`、圆角 `8px`、最小高度 `46px`；焦点态切换为酒红边框或琥珀焦点环。

### 4.5 Domain-Specific Components（Leo Faux 专属业务组件）
1. **7 大标准类目筛选栏（`.cat-bar`）**：严格对应 `assets/product-categories.json` 的 7 大形态单选（All / Single Stems / Bouquets / Greenery / Flower & Plant Walls / Artificial Trees / Garlands & Vines / Phalaenopsis & Orchids），采用横向胶囊药丸组。
2. **选品浮动汇总条 & Excel 导出弹窗（`.floating-bar` + `.modal-content`）**：当买家收藏 ≥1 款 SKU 时，页面底部居中浮现酒红深色胶囊条，实时显示已选数量徽章，点击打开暖奶油底色弹窗，支持 `32px+` 步进器调整采购数量并一键导出带实拍缩略图的 Excel 询盘单。
3. **4 码合一官方二维码网格（`.qr-grid`）**：固定 4 列（移动端 2×2）纯白细线圆角卡片（`border-radius: 10–14px`），展示 `whatsapp.jpg`、`wechat.jpg`、`line.jpg`、`linktr.png`（无损原图），下方配清晰渠道标签。
4. **全屏商品图片灯箱（`.viewer-overlay`）**：深黑檀 `rgba(40, 24, 27, 0.96)` 遮罩，顶部左右为页码计数胶囊与 `44px` 关闭键，左右 `44px+` 切换箭头，底部悬浮展示当前 SKU 货号与名称。

---

## 5. Layout Principles & Responsive Rules（布局原则与响应式规范）

### 5.1 Grid & Containment（网格与容器边界）
- **内容最大宽度**：品牌首页 `1180px`、选品目录页 `1200px`、内页与文章详情页 `1120px` / 窄阅读区 `820px`，水平居中。
- **Hero 非对称分屏**：桌面端采用 `1.05fr : 1fr` 左文右图分屏，底部带 `30px` 大圆角收口；右侧高清花艺图左侧叠加 `linear-gradient(90deg, #28181b, transparent 22%)` 柔光过渡，左下角悬浮义乌展厅卡片（`hero-showroom`）。全屏高度优先使用 `min-height: min(85dvh, 680px)` 或 `min-h-[100dvh]`，严禁使用 `100vh` 造成移动端浏览器跳动。
- **拒绝呆板均分**：首页类目网格采用 `1.1fr 1fr 1fr` 视觉重心微偏移；下单流程（`order-steps`）采用无边框卡片、仅以顶部 `1px solid #ceb8a3` 细线与衬线大序数引导阅读，打破“全页都是圆角方框”的审美疲劳。

### 5.2 Whitespace Strategy（留白节奏）
- 以 **`4px / 8px`** 为原子基数：元素内微距 `8–12px`，卡片内边距 `24–28px`，网格间距 `20–28px`，大章节上下内边距桌面端 `82px`、移动端自适应缩减至 `clamp(3rem, 8vw, 5.125rem)`。

### 5.3 Responsive Breakpoints & Touch（响应式断点与触控）
| 断点 | 布局降级策略 |
| :--- | :--- |
| **`≤ 960px`（平板）** | 导航栏居中换行；下单 4 步流降级为 `2×2`；Hero 内边距收紧；展厅浮标贴齐左右安全边距 |
| **`≤ 700px`（大屏手机）** | Hero 降级为上下单栏（上文下图，过渡渐变改为自上而下）；所有多列内容网格（类目/工艺/工厂/评价/询盘盒）强制坍缩为单列；统计条转为 2 列并将末项跨满整行 |
| **`≤ 640px`（目录页手机端）** | `/shop.html` 商品网格固定为 **2 列双排**（提升移动端选品浏览效率），图片高度 `130–145px`；WhatsApp 悬浮球自动上移避让底部选品汇总条 |
| **`≤ 380px`（超小屏）** | 页脚与步骤流全面降级为单列；严禁出现任何横向滚动条（`overflow-x: hidden`） |
| **触控热区标准** | 所有可点击按钮、输入框、收藏图标、灯箱关闭按钮最小点击热区 ≥ **`44px × 44px`**（或通过透明外扩热区保证） |

---

## 6. Motion & Interaction Philosophy（动效与微交互规范）

- **物理手感与缓动曲线**：告别生硬的 `linear` 线性过渡。常规 Hover 交互使用 `cubic-bezier(0.22, 1, 0.36, 1)`（时长 `220ms–350ms`）；弹簧类交互（弹窗展开、收藏心形回弹、选品条弹出）遵循 `stiffness: 100, damping: 20` 的沉稳阻尼质感。
- **硬件加速铁律**：所有动效**仅允许操作 `transform` 与 `opacity`**，严禁对 `top`、`left`、`width`、`height` 执行动画。
- **标志性微交互**：
  - 类目画廊卡片 Hover：底图 `scale(1.04)` 缓慢推近（`350ms`），文字层保持静止清晰。
  - 目录页收藏飞入动效（`.fly-item`）：点击收藏后，商品缩略图沿贝塞尔抛物线（`0.8s cubic-bezier(0.19, 1, 0.22, 1)`）飞入底部选品汇总条，强化 B2B 选品加购确认感。
  - 加载与空态：数据加载必须使用与商品卡片等比例的暖燕麦色骨架屏微光（Shimmer），禁用通用旋转圈（Spinner）；无搜索结果时提供清晰的重置筛选按钮与热门类目推荐。
- **无障碍动效尊重**：强制保留 `@media (prefers-reduced-motion: reduce)`，在用户开启减弱动态效果时关闭平滑滚动与全部过渡动画。

---

## 7. Brand Compliance & Anti-Patterns（品牌红线与禁止项）

### 7.1 Leo Faux 业务合规红线（MUST FOLLOW）
1. **展厅地址去个人化**：官网任何位置严禁出现个人姓名，统一仅展示官方展厅地址：
   - 中文：`浙江省金华市义乌市国际商贸城六区全球数贸中心T6写字楼一楼商业街1088号`
   - 英文：`Shop 1088, 1F Commercial Street, T6 Office Building, Global Digital Trade Center (District 6, Yiwu International Trade City), Yiwu, Jinhua, Zhejiang, China`
2. **二维码合规**：仅允许展示官方沟通与社媒矩阵二维码（WhatsApp / WeChat / LINE / Linktree `linktr.png` 无损原图），**严禁上传任何收款码**。
3. **7 大类目严格边界**：所有产品归类与导航筛选严格遵守 `single` / `bouquets` / `greenery` / `walls` / `trees` / `vines` / `orchids` 7 大形态单选；其中 `orchids` 仅收纯正蝴蝶兰/泰国兰/蕙兰，严禁混入仿真树或其他花卉。
4. **数据真实性**：仅展示经确认的品牌实绩（如 `10+ Years`、`3,300+ SKUs`、`50+ Countries`、`500+ B2B Clients`、`OEM/ODM`），严禁编造虚假的“99.98% 准时率”“124ms 响应”等 AI 假数据。

### 7.2 视觉反模式清单（NEVER DO）
- ❌ **严禁纯黑 (`#000000`)** — 全部替换为暖炭黑墨 (`#251f20`) 或深黑檀梅子 (`#28181b`)。
- ❌ **严禁 AI 紫蓝霓虹美学** — 禁止紫色渐变按钮、霓虹外发光阴影、赛博风发光边框。
- ❌ **严禁混入旧版冷色调** — 禁止 `#2c3e50`、`#e74c3c`、`#f8f9fa` 等冷色回流。
- ❌ **严禁泛滥默认字体** — 禁止使用 `Inter`、`Times New Roman` 作为主设计字体。
- ❌ **严禁使用 Emoji 替代图标** — 工艺、优势、导航与状态图标一律使用纤细线性 SVG（`stroke-width: 1.6–1.8`）或高质量实拍缩略图。
- ❌ **严禁无意义填充文案** — 禁止 "Scroll to explore"、跳动向下箭头、"Elevate / Seamless / Next-Gen" 等 AI 套话，禁止 `LABEL // 2026` 斜杠装饰格式。
- ❌ **严禁文字与图片无序重叠** — 除经过深色渐变遮罩保护的画廊卡片外，正文与标题不得直接压在未处理的亮色花朵图片上。
- ❌ **严禁首页居中套路 Hero** — 首页桌面端始终保持非对称分屏构图。

---

## 8. Design System Notes for Stitch Generation（Google Stitch 生成提示词指南）

当使用 Google Stitch 为 `www.leofaux.com` 设计新页面或改版现有模块时，请直接引用以下语义描述与提示词模板。

### 8.1 Language to Use（推荐氛围词）
> "Editorial botanical gallery meets B2B wholesale showroom", "warm ivory cream paper canvas", "deep espresso plum and burgundy wine accents", "antique champagne gold editorial kickers", "sculptural high-contrast serif headlines paired with crisp humanist sans-serif and monospace SKU codes", "hairline warm linen borders instead of heavy drop shadows", "pill-shaped tactile buttons", "zero emojis, zero neon glow, zero cold grays".

### 8.2 Color Reference Quick-Sheet（Stitch 速查表）
- Background Canvas: **Warm Ivory Cream** (`#fffaf2`)
- Elevated Card Surface: **Pure Gallery White** (`#ffffff`) with **Warm Linen Hairline** (`#eadfd4`)
- Alternate Section / Badge Tint: **Warm Oat Surface** (`#f1e8dc`)
- Dark Editorial Block / Footer: **Deep Espresso Plum** (`#28181b`)
- Primary CTA & Brand Accent: **Burgundy Wine** (`#7f1d2d`), hover **Deep Merlot** (`#651422`)
- Editorial Highlight on Dark: **Antique Champagne Gold** (`#e3a858`)
- Primary Text: **Warm Charcoal Ink** (`#251f20`), Secondary Text: **Warm Stone Muted** (`#6d6263`)

### 8.3 Ready-to-Use Component Prompts（可直接用于 Stitch）

**Prompt 1 — 首页非对称分屏 Hero（Desktop & Mobile）**
> Design an editorial asymmetric split-screen Hero section for Leo Faux, a Yiwu-based wholesale artificial flowers manufacturer. Left column (52% width) sits on a Deep Espresso Plum (`#28181b`) background with generous padding: an uppercase Antique Champagne Gold (`#e3a858`) eyebrow label "YIWU · ARTIFICIAL FLOWER WHOLESALE", a sculptural Cormorant Garamond serif headline "Nature's beauty, made to last." with "made to last." italicized in Antique Champagne Gold, a concise warm-tinted description (`#d5c6ca`), one primary pill-shaped Burgundy Wine (`#7f1d2d`) CTA button "Browse Products →" and one subtle light-outlined secondary pill CTA "Request a Quote". Right column (48% width) is a full-bleed high-resolution photograph of soft pink silk peonies and roses with a subtle left-edge plum gradient blend and a floating Warm Ivory Cream (`#fffaf2`) rounded card in the bottom-left reading "Visit us in Yiwu — Global Digital Trade Center, T6 · 1F · Shop 1088". Round the bottom corners of the hero container by 30px against the Warm Ivory Cream (`#fffaf2`) page canvas. No emojis, no scroll-down arrows.

**Prompt 2 — 3,300+ SKU 批发选品目录页（`/shop.html`）**
> Design a B2B wholesale artificial flower catalog page on a Warm Ivory Cream (`#fffaf2`) background. Sticky translucent cream header with hairline Warm Linen (`#eadfd4`) bottom border, wide-tracked "LEO FAUX" wordmark, clean navigation links, and a compact language switcher (EN / ZH / ES / AR). Below a concise serif page intro, place a full-width rounded pill search input and a horizontal row of 8 pill-shaped category filters (All, Single Stems, Bouquets, Greenery, Flower & Plant Walls, Artificial Trees, Garlands & Vines, Phalaenopsis & Orchids) with the active pill in solid Burgundy Wine (`#7f1d2d`). Render a responsive 4-column desktop (2-column mobile) product grid of Pure Gallery White (`#ffffff`) cards with 1px Warm Linen (`#eadfd4`) borders and 16px radius: tall botanical product photo with a floating circular heart favorite button in the top-right, a Warm Oat (`#f1e8dc`) monospace SKU badge (e.g., `H007487` in JetBrains Mono), crisp Plus Jakarta Sans product title, and subtle specification metadata at the bottom. Float a centered Deep Espresso Plum (`#28181b`) pill bar at the bottom showing selected SKU count in Burgundy Wine with an "Export Excel Enquiry" action.

**Prompt 3 — 酒红高定 B2B 询盘与官方二维码模块**
> Design a rounded 28px B2B wholesale contact container in Burgundy Wine (`#7f1d2d`) sitting on a Warm Ivory Cream (`#fffaf2`) page section. Split into two balanced columns: Left column features an Antique Champagne Gold (`#e3a858`) kicker "LET'S TALK FLOWERS", a Cormorant Garamond serif heading "Find the right flowers for your market.", structured showroom address details (Global Digital Trade Center, T6 1F Shop 1088, Yiwu — no personal names), WhatsApp and email links, and a neat 4-column row of Pure Gallery White (`#ffffff`) rounded cards displaying official QR codes for WhatsApp, WeChat, LINE, and Linktree. Right column houses an embedded Warm Ivory Cream (`#fffaf2`) 18px-rounded enquiry form card with top-aligned labels, clean white inputs (`#d2c0b7` border, 46px height) for Name/Company, Country/Region, Product Category dropdown, Requirements textarea, and a full-width Burgundy Wine pill submit button "Continue to WhatsApp →".

### 8.4 Incremental Iteration Guidance（迭代原则）
1. 每次在 Stitch 中生成新页面后，优先核对**背景是否为 `#fffaf2`、主按钮是否为 `#7f1d2d` 胶囊形、是否意外混入了纯黑 `#000000` 或冷灰 `#f8f9fa`**。
2. 保持摄影画面占比 ≥45%，通过高质量仿真花与义乌展厅实拍图传递真实供应链实力，而非堆砌矢量插画。
3. 导出为前端代码后，所有颜色与字体直接绑定 `assets/brand.css` 中的 `--leo-*` 变量，确保首页、目录页与博客内页视觉 100% 一致。
