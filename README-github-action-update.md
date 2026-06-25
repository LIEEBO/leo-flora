# 更新 GitHub Action

你的 PAT token 没有 workflow 权限，无法自动推送 workflow 文件。
请手动将以下内容复制到 GitHub 上的 `.github/workflows/update-sitemap.yml`：

---

name: Auto Build Blog & Sitemap

on:
  push:
    branches:
      - main
    paths:
      - 'en/**'

jobs:
  build:
    runs-on: ubuntu-latest

    steps:
      - name: Checkout code
        uses: actions/checkout@v3
        with:
          fetch-depth: 0

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Build Blog Pages & Sitemap
        run: npm run build

      - name: Commit and Push changes
        run: |
          git config --local user.email "action@github.com"
          git config --local user.name "GitHub Action"
          git add sitemap.xml en/blog/
          git diff --quiet && git diff --staged --quiet || (git commit -m "auto: update blog pages and sitemap" && git push)


---

或者在 GitHub 网页上操作：
1. 进入 https://github.com/LIEEBO/leo-flora/blob/main/.github/workflows/update-sitemap.yml
2. 点击 Edit 按钮
3. 粘贴上面的内容
4. 保存

完成后，每次AI推送.md文件到 en/ 文件夹，GitHub Action 会自动：
1. 运行 `node convert-blog.js` → 新 .md 转成 .html
2. 更新博客列表页
3. 更新 sitemap.xml
4. 提交回仓库
