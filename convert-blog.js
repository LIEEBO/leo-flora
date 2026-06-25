const fs = require('fs');
const path = require('path');

const EN_DIR = './en';
const BLOG_DIR = './en/blog';
const DOMAIN = 'https://www.leofaux.com';

// Ensure blog dir exists
if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

// --- Parse frontmatter ---
function parseFrontmatter(content) {
  const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const fm = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.+?)$/);
    if (m) fm[m[1]] = m[1] === 'tags' ? m[2] : m[2].replace(/^["']|["']$/g, '');
  });
  return { frontmatter: fm, body: match[2] };
}

// --- Simple markdown to HTML ---
function mdToHtml(body) {
  let html = '', inUl = false, inOl = false;
  for (let line of body.split('\n')) {
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) { closeLists(); html += `<h${h[1].length}>${h[2]}</h${h[1].length}>\n`; continue; }
    const ul = line.match(/^-\s+(.+)$/);
    if (ul) { if (inOl) { html += '</ol>\n'; inOl = false; } if (!inUl) { html += '<ul>\n'; inUl = true; } html += `  <li>${ul[1]}</li>\n`; continue; }
    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) { if (inUl) { html += '</ul>\n'; inUl = false; } if (!inOl) { html += '<ol>\n'; inOl = true; } html += `  <li>${ol[1]}</li>\n`; continue; }
    if (line.trim() === '') { closeLists(); continue; }
    line = line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>').replace(/\*(.+?)\*/g, '<em>$1</em>');
    html += `<p>${line.trim()}</p>\n`;
  }
  closeLists();
  return html;
  function closeLists() { if (inUl) { html += '</ul>\n'; inUl = false; } if (inOl) { html += '</ol>\n'; inOl = false; } }
}

// --- Generate article HTML ---
function generateArticlePage(title, date, body, slug, keyword) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${esc(title)} | Leo Faux Blog</title>
  <meta name="description" content="${esc(keyword || title)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/favicon.png" type="image/png">
  <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
  <script defer src="/_vercel/insights/script.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#333;line-height:1.8;background:#fff}
    nav.site-nav{background:#fff;padding:14px 24px;box-shadow:0 1px 6px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
    nav.site-nav .logo{font-size:20px;font-weight:700;color:#2c3e50;text-decoration:none;display:flex;align-items:center;gap:8px}
    nav.site-nav .nav-links{display:flex;gap:18px;flex-wrap:wrap}
    nav.site-nav .nav-links a{color:#555;text-decoration:none;font-size:14px;font-weight:500}
    nav.site-nav .nav-links a:hover{color:#e74c3c}
    .post-header{background:#f8f9fa;padding:40px 24px;text-align:center;border-bottom:1px solid #f0f0f0}
    .post-header h1{font-size:28px;color:#2c3e50;max-width:800px;margin:0 auto 8px}
    .post-header .post-meta{font-size:13px;color:#999}
    .post-body{max-width:720px;margin:0 auto;padding:40px 24px 60px}
    .post-body h2{font-size:22px;color:#2c3e50;margin:36px 0 12px}
    .post-body h3{font-size:18px;color:#2c3e50;margin:28px 0 10px}
    .post-body p{margin-bottom:16px;font-size:15px;color:#444}
    .post-body ul,.post-body ol{margin:12px 0 20px 24px}
    .post-body li{margin-bottom:8px;font-size:15px;color:#444}
    .post-body strong{color:#2c3e50}
    .post-footer{max-width:720px;margin:0 auto;padding:24px;border-top:1px solid #f0f0f0;text-align:center}
    .post-footer a{color:#e74c3c;text-decoration:none}
    @media(max-width:640px){.post-header h1{font-size:22px}.post-body{padding:24px 16px 40px}}
  </style>
</head>
<body>
<nav class="site-nav">
  <a href="/en/" class="logo">Leo Faux</a>
  <div class="nav-links">
    <a href="/en/">Home</a>
    <a href="/en/artificial-flowers.html">Products</a>
    <a href="/en/blog/">Blog</a>
    <a href="/en/about-us.html">About</a>
    <a href="/en/faq.html">FAQ</a>
  </div>
</nav>
<article class="post-header">
  <h1>${esc(title)}</h1>
  <div class="post-meta">${date} · ${esc(keyword || '')}</div>
</article>
<div class="post-body">${body}</div>
<div class="post-footer">
  <a href="/en/blog/">← Back to Blog</a> &nbsp;|&nbsp; <a href="/en/">← Back to Home</a>
</div>
</body>
</html>`;
}

function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;'); }

// --- Generate blog listing page ---
function generateBlogListing(posts) {
  const cards = posts.map(p => `
    <div class="blog-item">
      <div class="blog-icon">💐</div>
      <div class="blog-content">
        <div class="blog-date">${p.date}</div>
        <h2><a href="/en/blog/${p.slug}.html">${esc(p.title)}</a></h2>
        <div class="blog-desc">${esc(p.desc)}</div>
        <span class="blog-tag">${p.tag}</span>
      </div>
    </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Artificial Flowers Blog — Wedding & Decoration Ideas | Leo Faux</title>
  <meta name="description" content="Expert articles about artificial flowers, silk flower wedding decor, and floral decoration ideas. From Leo Faux, professional artificial flowers manufacturer.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="icon" href="/favicon.png" type="image/png">
  <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
  <script defer src="/_vercel/insights/script.js"></script>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#333;line-height:1.6;background:#f8f9fa}
    nav.site-nav{background:#fff;padding:14px 24px;box-shadow:0 1px 6px rgba(0,0,0,.06);display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:10px}
    nav.site-nav .logo{font-size:20px;font-weight:700;color:#2c3e50;text-decoration:none}
    nav.site-nav .nav-links{display:flex;gap:18px;flex-wrap:wrap}
    nav.site-nav .nav-links a{color:#555;text-decoration:none;font-size:14px;font-weight:500}
    nav.site-nav .nav-links a:hover{color:#e74c3c}
    .page-header{background:#2c3e50;color:#fff;padding:50px 24px;text-align:center}
    .page-header h1{font-size:32px;margin-bottom:8px}
    .page-header p{opacity:.8;font-size:15px;max-width:600px;margin:0 auto}
    .container{max-width:900px;margin:0 auto;padding:40px 24px}
    .blog-list{display:flex;flex-direction:column;gap:20px}
    .blog-item{background:#fff;border-radius:12px;box-shadow:0 2px 8px rgba(0,0,0,.04);display:flex;gap:20px;padding:24px;transition:box-shadow .2s}
    .blog-item:hover{box-shadow:0 4px 16px rgba(0,0,0,.08)}
    .blog-item .blog-icon{width:60px;height:60px;background:linear-gradient(135deg,#667eea,#764ba2);border-radius:12px;display:flex;align-items:center;justify-content:center;font-size:28px;flex-shrink:0}
    .blog-item .blog-content{flex:1}
    .blog-item .blog-date{font-size:12px;color:#999}
    .blog-item h2{font-size:17px;font-weight:600;margin:4px 0 6px}
    .blog-item h2 a{color:#2c3e50;text-decoration:none}
    .blog-item h2 a:hover{color:#e74c3c}
    .blog-item .blog-desc{font-size:13px;color:#777;line-height:1.5}
    .blog-item .blog-tag{display:inline-block;font-size:11px;color:#e74c3c;background:#fef0ef;padding:2px 8px;border-radius:4px;margin-top:8px}
    @media(max-width:640px){.blog-item{flex-direction:column}.blog-item .blog-icon{width:44px;height:44px;font-size:20px}}
  </style>
</head>
<body>
<nav class="site-nav">
  <a href="/en/" class="logo">Leo Faux</a>
  <div class="nav-links">
    <a href="/en/">Home</a>
    <a href="/en/artificial-flowers.html">Products</a>
    <a href="/en/blog/">Blog</a>
    <a href="/en/about-us.html">About</a>
    <a href="/en/faq.html">FAQ</a>
  </div>
</nav>
<section class="page-header">
  <h1>🌸 Leo Faux Blog</h1>
  <p>Artificial flower decoration ideas, wedding inspiration, and expert tips from our factory team.</p>
</section>
<div class="container"><div class="blog-list">${cards}</div></div>
</body>
</html>`;
}

// --- MAIN ---
let converted = 0;
let allPosts = [];

fs.readdirSync(EN_DIR).forEach(file => {
  if (!file.endsWith('.md')) return;
  const mdPath = path.join(EN_DIR, file);
  const content = fs.readFileSync(mdPath, 'utf-8');
  const parsed = parseFrontmatter(content);
  
  if (!parsed) {
    console.log(`  ⚠️  No frontmatter: ${file}`);
    return;
  }

  const { title, slug, date, description, focus_keyword } = parsed.frontmatter;
  if (!slug) {
    console.log(`  ⚠️  No slug: ${file}`);
    return;
  }

  const dateClean = date ? date.substring(0, 10) : '';
  const htmlPath = path.join(BLOG_DIR, `${slug}.html`);

  // Only convert if HTML doesn't exist yet
  if (!fs.existsSync(htmlPath)) {
    const bodyHtml = mdToHtml(parsed.body);
    const page = generateArticlePage(title, dateClean, bodyHtml, slug, focus_keyword || '');
    fs.writeFileSync(htmlPath, page);
    console.log(`  ✅ New: ${slug}.html`);
    converted++;
  }

  allPosts.push({
    slug, title,
    date: dateClean,
    desc: description || title,
    tag: 'Wedding Ideas',
    time: dateClean
  });
});

// Sort by date descending
allPosts.sort((a, b) => b.time.localeCompare(a.time));

// Regenerate blog listing
const listingHtml = generateBlogListing(allPosts);
fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), listingHtml);
console.log(`  ✅ Blog listing regenerated (${allPosts.length} posts)`);

console.log(`\n✅ Done. ${converted} new articles converted, ${allPosts.length} total.`);
