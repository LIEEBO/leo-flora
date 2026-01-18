const fs = require('fs');
const path = require('path');

// --- 配置项 ---
const DOMAIN = 'https://www.leofaux.com';
const TARGET_DIR = './en'; // 扫描的文件夹路径
const SITEMAP_PATH = './sitemap.xml';

// 获取所有 .html 文件
function getHtmlFiles(dir, files_ = []) {
    const files = fs.readdirSync(dir);
    for (const i in files) {
        const name = dir + '/' + files[i];
        if (fs.statSync(name).isDirectory()) {
            getHtmlFiles(name, files_);
        } else if (name.endsWith('.html')) {
            // 将路径转换为 URL 格式
            const urlPath = name.replace('./', '/');
            files_.push(urlPath);
        }
    }
    return files_;
}

// 生成 XML 内容
function generateSitemap() {
    const files = getHtmlFiles(TARGET_DIR);
    // 加上首页
    if (!files.includes('/en/index.html')) files.unshift('/en/');

    const urlTags = files.map(file => {
        const url = `${DOMAIN}${file.replace('index.html', '')}`;
        const priority = file === '/en/' ? '1.0' : '0.8';
        return `  <url>
    <loc>${url}</loc>
    <changefreq>weekly</changefreq>
    <priority>${priority}</priority>
  </url>`;
    }).join('\n');

    const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="https://www.sitemaps.org/schemas/sitemap/0.9">
${urlTags}
</urlset>`;

    fs.writeFileSync(SITEMAP_PATH, sitemapContent);
    console.log('✅ sitemap.xml 已自动更新！');
}

generateSitemap();
