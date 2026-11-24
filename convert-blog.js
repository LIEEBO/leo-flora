const fs = require('fs');
const path = require('path');

const EN_DIR = './en';
const BLOG_DIR = './en/blog';
const DOMAIN = 'https://www.leofaux.com';

if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

// --- Parse frontmatter (supports LF and CRLF) ---
function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const fm = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.+?)$/);
    if (!m) return;
    if (m[1] === 'tags') {
      try {
        fm.tags = JSON.parse(m[2]);
      } catch {
        fm.tags = [];
      }
    } else {
      fm[m[1]] = m[2].replace(/^["']|["']$/g, '').replace(/\\"/g, '"');
    }
  });
  return { frontmatter: fm, body: match[2] };
}

// --- Inline Markdown formatter (links, bold, italic) ---
function formatInline(text) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g, '<a href="$2" class="inline-link">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

// --- Markdown to HTML ---
function mdToHtml(body) {
  let html = '', inUl = false, inOl = false;
  for (let rawLine of body.split('\n')) {
    const line = rawLine.trim();
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      closeLists();
      const level = h[1].length === 1 ? 2 : h[1].length; // avoid duplicate H1
      html += `<h${level}>${formatInline(h[2])}</h${level}>\n`;
      continue;
    }
    const ul = line.match(/^[-*]\s+(.+)$/);
    if (ul) {
      if (inOl) { html += '</ol>\n'; inOl = false; }
      if (!inUl) { html += '<ul>\n'; inUl = true; }
      html += `  <li>${formatInline(ul[1])}</li>\n`;
      continue;
    }
    const ol = line.match(/^\d+\.\s+(.+)$/);
    if (ol) {
      if (inUl) { html += '</ul>\n'; inUl = false; }
      if (!inOl) { html += '<ol>\n'; inOl = true; }
      html += `  <li>${formatInline(ol[1])}</li>\n`;
      continue;
    }
    if (line === '') { closeLists(); continue; }
    html += `<p>${formatInline(line)}</p>\n`;
  }
  closeLists();
  return html;
  function closeLists() {
    if (inUl) { html += '</ul>\n'; inUl = false; }
    if (inOl) { html += '</ol>\n'; inOl = false; }
  }
}

function esc(s) {
  return String(s || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function getCtaCopy(lang) {
  const map = {
    es: {
      heading: '¿Busca flores artificiales al por mayor directo de fábrica?',
      sub: 'Leo Faux (Yiwu, China) ofrece más de 3,300 modelos: rosas tacto real, orquídeas, hortensias, árboles artificiales y muros de flores con envío mundial.',
      btn1: 'Ver Catálogo Mayorista (3,300+ SKU)',
      btn2: 'Cotizar por WhatsApp'
    },
    pt: {
      heading: 'Procurando flores artificiais no atacado direto da fábrica?',
      sub: 'A Leo Faux (Yiwu, China) fornece mais de 3.300 itens: rosas toque real, orquídeas, hortênsias, árvores e paredes florais com envio global.',
      btn1: 'Explorar Catálogo Atacado',
      btn2: 'Solicitar Orçamento WhatsApp'
    },
    ar: {
      heading: 'هل تبحث عن زهور صناعية بالجملة مباشرة من المصنع؟',
      sub: 'يوفر مصنع Leo Faux في ييوو بالصين أكثر من 3,300 منتج من الورد الطبيعي الملمس والأوركيد والأشجار الصناعية وجدران الزهور.',
      btn1: 'تصفح كتالوج الجملة (3,300+ منتج)',
      btn2: 'اطلب عرض سعر عبر واتساب'
    }
  };
  return map[lang] || {
    heading: 'Source Factory-Direct Artificial Flowers from Yiwu, China',
    sub: 'Leo Faux supplies 3,300+ wholesale styles including Real-Touch Roses, Phalaenopsis Orchids, Velvet Peonies, Hydrangeas, Faux Trees & Flower Walls. OEM/ODM & bulk export supported.',
    btn1: 'Browse Wholesale Catalog (3,300+ SKUs)',
    btn2: 'Get Free Quote on WhatsApp'
  };
}

// --- Generate article HTML ---
function generateArticlePage({ title, date, body, slug, description, keyword, lang, tags }) {
  const safeLang = ['en', 'es', 'pt', 'ar'].includes(lang) ? lang : 'en';
  const dirAttr = safeLang === 'ar' ? ' dir="rtl"' : '';
  const canonical = `${DOMAIN}/en/blog/${slug}.html`;
  const metaDesc = description || keyword || title;
  const cta = getCtaCopy(safeLang);
  const tagBadges = (Array.isArray(tags) && tags.length > 0 ? tags.slice(0, 4) : ['Artificial Flowers'])
    .map(t => `<span class="meta-tag">${esc(t)}</span>`).join(' ');

  const ldJson = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: title,
    description: metaDesc,
    datePublished: date || '2026-01-01',
    inLanguage: safeLang,
    mainEntityOfPage: canonical,
    author: { '@type': 'Organization', name: 'Leo Faux', url: DOMAIN },
    publisher: { '@type': 'Organization', name: 'Leo Faux', url: DOMAIN }
  });

  return `<!DOCTYPE html>
<html lang="${safeLang}"${dirAttr}>
<head>
  <meta charset="UTF-8">
  <title>${esc(title)} | Leo Faux Blog</title>
  <meta name="description" content="${esc(metaDesc)}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(metaDesc)}">
  <meta property="og:url" content="${canonical}">
  <link rel="icon" href="/favicon.png" type="image/png">
  <script type="application/ld+json">${ldJson}</script>
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
    .post-header h1{font-size:28px;color:#2c3e50;max-width:800px;margin:0 auto 10px;line-height:1.35}
    .post-header .post-meta{font-size:13px;color:#888;display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap}
    .meta-tag{background:#fef0ef;color:#c0392b;padding:2px 8px;border-radius:4px;font-size:12px}
    .post-body{max-width:760px;margin:0 auto;padding:36px 24px 32px}
    .post-body h2{font-size:22px;color:#2c3e50;margin:34px 0 12px}
    .post-body h3{font-size:18px;color:#2c3e50;margin:24px 0 8px}
    .post-body p{margin-bottom:16px;font-size:15.5px;color:#444}
    .post-body ul,.post-body ol{margin:12px 0 20px 24px}
    .post-body li{margin-bottom:8px;font-size:15.5px;color:#444}
    .post-body strong{color:#2c3e50}
    .post-body a.inline-link{color:#c0392b;text-decoration:underline;font-weight:500}
    .cta-box{max-width:760px;margin:12px auto 36px;padding:28px 24px;background:linear-gradient(135deg,#2c3e50,#34495e);color:#fff;border-radius:12px;text-align:center}
    .cta-box h3{font-size:20px;margin-bottom:10px}
    .cta-box p{font-size:14.5px;opacity:.9;margin-bottom:18px;max-width:620px;margin-left:auto;margin-right:auto}
    .cta-actions{display:flex;justify-content:center;gap:12px;flex-wrap:wrap}
    .cta-btn{display:inline-block;padding:11px 20px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px}
    .cta-primary{background:#e74c3c;color:#fff}
    .cta-secondary{background:#25D366;color:#fff}
    .post-footer{max-width:760px;margin:0 auto;padding:24px;border-top:1px solid #f0f0f0;text-align:center}
    .post-footer a{color:#e74c3c;text-decoration:none}
    @media(max-width:640px){.post-header h1{font-size:22px}.post-body{padding:24px 16px 24px}.cta-box{margin:12px 16px 28px}}
  </style>
</head>
<body>
<nav class="site-nav">
  <a href="/en/" class="logo">Leo Faux</a>
  <div class="nav-links">
    <a href="/en/">Home</a>
    <a href="/shop.html">Wholesale Catalog</a>
    <a href="/en/artificial-flowers.html">Products</a>
    <a href="/en/blog/">Blog</a>
    <a href="/en/about-us.html">About</a>
    <a href="/en/faq.html">FAQ</a>
  </div>
</nav>
<article class="post-header">
  <h1>${esc(title)}</h1>
  <div class="post-meta"><span>${esc(date)}</span> ${tagBadges}</div>
</article>
<main class="post-body">${body}</main>
<section class="cta-box">
  <h3>${esc(cta.heading)}</h3>
  <p>${esc(cta.sub)}</p>
  <div class="cta-actions">
    <a href="/shop.html" class="cta-btn cta-primary">${esc(cta.btn1)}</a>
    <a href="https://wa.me/8618657926791?text=Hello%20LEO%20FAUX%2C%20I%20would%20like%20a%20wholesale%20catalog%20and%20quote." target="_blank" rel="noopener" class="cta-btn cta-secondary">${esc(cta.btn2)}</a>
  </div>
</section>
<div class="post-footer">
  <a href="/en/blog/">← Back to Blog</a> &nbsp;|&nbsp; <a href="/shop.html">Wholesale Catalog</a> &nbsp;|&nbsp; <a href="/en/">Home</a>
</div>
</body>
</html>`;
}

// --- Generate blog listing page ---
function generateBlogListing(posts) {
  const cards = posts.map(p => `
    <div class="blog-item">
      <div class="blog-icon">💐</div>
      <div class="blog-content">
        <div class="blog-date">${esc(p.date)}</div>
        <h2><a href="/en/blog/${esc(p.slug)}.html">${esc(p.title)}</a></h2>
        <div class="blog-desc">${esc(p.desc)}</div>
        <span class="blog-tag">${esc(p.tag)}</span>
      </div>
    </div>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Artificial Flowers Blog — Wholesale & Floral Decor Guides | Leo Faux</title>
  <meta name="description" content="Expert B2B guides on wholesale artificial flowers, real-touch roses, phalaenopsis orchids, faux trees, and floral walls from Leo Faux factory in Yiwu, China.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="${DOMAIN}/en/blog/">
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
    .page-header p{opacity:.85;font-size:15px;max-width:620px;margin:0 auto}
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
    <a href="/shop.html">Wholesale Catalog</a>
    <a href="/en/artificial-flowers.html">Products</a>
    <a href="/en/blog/">Blog</a>
    <a href="/en/about-us.html">About</a>
    <a href="/en/faq.html">FAQ</a>
  </div>
</nav>
<section class="page-header">
  <h1>🌸 Leo Faux Blog</h1>
  <p>Wholesale artificial flowers guides, commercial floral design trends, and factory sourcing insights.</p>
</section>
<div class="container"><div class="blog-list">${cards}</div></div>
</body>
</html>`;
}

// --- MAIN ---
let converted = 0;
let allPosts = [];
const seenSlugs = new Set();

fs.readdirSync(EN_DIR).forEach(file => {
  if (!file.endsWith('.md')) return;
  const mdPath = path.join(EN_DIR, file);
  const content = fs.readFileSync(mdPath, 'utf-8');
  const parsed = parseFrontmatter(content);
  if (!parsed) return;

  const { title, slug, date, description, focus_keyword, lang, tags } = parsed.frontmatter;
  if (!slug || seenSlugs.has(slug)) return;
  seenSlugs.add(slug);

  const dateClean = date ? date.substring(0, 10) : '';
  const htmlPath = path.join(BLOG_DIR, `${slug}.html`);
  const bodyHtml = mdToHtml(parsed.body);
  const page = generateArticlePage({
    title, date: dateClean, body: bodyHtml, slug,
    description, keyword: focus_keyword || '', lang: lang || 'en', tags
  });
  fs.writeFileSync(htmlPath, page);
  converted++;

  const firstTag = (Array.isArray(tags) && tags.length > 0) ? tags[0] : (focus_keyword || 'Artificial Flowers');
  allPosts.push({
    slug, title,
    date: dateClean,
    desc: description || title,
    tag: firstTag,
    time: dateClean
  });
});

allPosts.sort((a, b) => b.time.localeCompare(a.time));
const listingHtml = generateBlogListing(allPosts);
fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), listingHtml);
console.log(`✅ Done. ${converted} articles built with enhanced SEO & CTA, ${allPosts.length} total.`);
