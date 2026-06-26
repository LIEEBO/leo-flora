# Leo Faux 网站改造全记录

## 项目概况
- **域名**: https://www.leofaux.com/ (英文品牌首页)
- **产品页**: https://www.leofaux.com/shop.html (Supabase 产品数据)
- **英文子站**: https://www.leofaux.com/en/ (与根域名相同)
- **博客**: https://www.leofaux.com/en/blog/
- **GitHub**: https://github.com/LIEEBO/leo-flora
- **部署**: Vercel (自动从 GitHub 部署)
- **本地备份**: `~/Desktop/leo-flora-backup/`

---

## 网站结构（最终版）

```
leofaux.com/
├── / (index.html)              ← 英文品牌首页
│   ├── Hero 大图背景（hero-bouquet.jpg）
│   ├── 公司数据（10+年/2000+产品/50+出口国/500+客户/OEM）
│   ├── 生产工艺（4步流程）
│   ├── 工厂实拍（3张照片）
│   ├── 产品分类卡片（3张照片 → 跳转 /shop.html）
│   ├── 为什么选我们（6张照片）
│   ├── 客户评价
│   ├── Blog 预览（3张照片）
│   ├── WhatsApp 浮动按钮
│   └── 页脚
│
├── /shop.html                  ← 产品展示页（原首页）
│   ├── 工厂展示区
│   ├── 强制登录弹窗（必须填姓名+联系方式才能看到产品）
│   ├── 搜索框（SKU 搜索）
│   ├── Supabase 产品网格
│   ├── 收藏/Excel 导出
│   └── WhatsApp 按钮
│
├── /en/                        ← 英文品牌首页（同根域名）
│
└── /en/blog/                   ← 博客系统（21篇文章）
    ├── index.html（博客列表）
    └── *.html（独立文章页）
```

---

## 模型配置（Hermes Agent）

### 当前可用模型（4个）
| 提供商 | 模型 | 说明 |
|--------|------|------|
| **DeepSeek** | deepseek-chat / deepseek-v4-flash | 主模型，余额 ¥25.61 |
| **Groq** | qwen/qwen3.6-27b | 免费无限用 |
| **PipeLLM** | gpt-5.4 | 免费，限速 6 RPM |
| **Gemini** | gemini-2.5-flash | 免费 |

### 已删除的模型
- 智谱 GLM（余额不足）
- StepFun（不可用）

### PipeLLM 额外可用模型
- Claude Opus 4.8 / 4.7 / 4.6（需 `/openai/v1` 端点）
- Claude Sonnet 4.6
- Claude Haiku 4.5
- GPT 5.5
- Gemini 3.5 Flash

### Groq 额外可用模型
- Llama 4 Scout 17B
- Llama 3.3 70B
- Groq Compound
- Qwen3 32B
- GPT-OSS 120B

---

## Skills 安装（23个新增）
| Skill | 用途 |
|-------|------|
| duckduckgo-search | 免费网页搜索（已安装 ddgs 包） |
| docker-management | Docker 管理 |
| pinggy-tunnel | localhost 隧道 |
| agentmail | Agent 邮箱 |
| cloudflare-temporary-deploy | 零账号部署 Worker |
| code-wiki | Wiki + 图表文档 |
| concept-diagrams | SVG 概念图 |
| meme-generation | 梗图生成 |
| osint-investigation | 公开情报调查 |
| scrapling | 网页抓取 |
| searxng-search | 元搜索引擎 |
| rest-graphql-debug | API 调试 |
| stocks | 股票行情 |
| watchers | RSS/GitHub 轮询 |
| pptx-author | PowerPoint 生成 |
| outlines | 结构化 LLM 输出 |
| baoyu-article-illustrator | 文章插图 |
| pixel-art | 像素画 |
| here.now | 静态网站发布 |
| memento-flashcards | 记忆卡片 |
| excel-author | Excel 工作簿 |
| shopify | Shopify 管理 |
| web-pentest | 渗透测试 |
| baoyu-comic | 知识漫画 |
| domain-intel | 域名侦察 |

---

## 网站优化内容

### Hero 区
- 全屏花束背景图（`/images/hero-bouquet.jpg`）
- 渐变遮罩保证文字可读性
- 3个 CTA 按钮：Browse Products / See Production / Get Free Quote (WhatsApp)

### 工厂展示区
- 3张真实照片：workshop.jpg / craftsmen.jpg / display.jpg
- 位于 `images/home/` 目录

### Why Choose Us（6张缩略图）
- 60x60 圆形照片，从用户上传的原始图中裁剪
- 放在 `images/home/choose-*.jpg`

### 产品分类卡片（3张）
- 600x400 照片背景 + 深色遮罩
- `images/home/cat-*.jpg`

### Blog 卡片（3张）
- 400x300 照片背景
- `images/home/blog-*.jpg`

### 响应式设计
- 手机端按钮竖排、网格变单列/双列
- 导航横向滚动
- WhatsApp 提示自动隐藏

### 强制登录（shop.html）
- 弹窗默认显示，无关闭按钮
- 搜索框+产品默认隐藏
- 填完姓名+联系方式后才显示产品

---

## 博客系统

### 自动转换流程
1. AI 推送 `.md` 文件到 `en/` 目录
2. 本地运行 `npm run build` 或 `node convert-blog.js`
3. 自动生成 `en/blog/*.html` 文章页
4. 自动更新博客列表页
5. 自动更新 sitemap.xml

### 文件说明
- `convert-blog.js` — 将 `.md` 转为 `.html` 的脚本
- `generate-sitemap.js` — 更新 sitemap
- `package.json` — `npm run build` 同时执行以上两个脚本

### 当前文章
21 篇婚礼/仿真花相关的 SEO 文章，覆盖长尾关键词。

---

## 修复记录

### 浏览器不可用
- 安装了 Chrome 150 到 `~/.agent-browser/browsers/`
- `agent-browser` 在 `~/.hermes/hermes-agent/node_modules/.bin/`

### ripgrep 未安装
- 下载安装到 `~/.local/bin/rg`

### 审批模式
- `approvals.mode` → `off`（等于 `--yolo`）
- `security.tirith_enabled` → `false`
- `approvals.cron_mode` → `allow`

---

## 首页图片目录
所有首页照片集中在 `images/home/`：
```
images/home/
├── workshop.jpg          ← 工厂车间
├── craftsmen.jpg         ← 工人制作
├── display.jpg           ← 产品陈列
├── choose-factory.jpg    ← Why Choose 1
├── choose-global.jpg     ← Why Choose 2
├── choose-oem.jpg        ← Why Choose 3
├── choose-bulk.jpg       ← Why Choose 4
├── choose-quality.jpg    ← Why Choose 5
├── choose-support.jpg    ← Why Choose 6
├── cat-artificial.jpg    ← 产品分类1
├── cat-silk.jpg          ← 产品分类2
├── cat-wedding.jpg       ← 产品分类3
├── blog-1.jpg            ← Blog 1
├── blog-2.jpg            ← Blog 2
├── blog-3.jpg            ← Blog 3
└── leofaux*.jpg/png      ← 原始照片（用户上传）
```
