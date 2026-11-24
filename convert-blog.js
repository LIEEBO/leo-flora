const fs = require('fs');
const path = require('path');

const EN_DIR = './en';
const BLOG_DIR = './en/blog';
const DOMAIN = 'https://www.leofaux.com';

if (!fs.existsSync(BLOG_DIR)) fs.mkdirSync(BLOG_DIR, { recursive: true });

const WA_SVG = '<svg viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

const SHARED_NAV = `<div class="announcement">LEO FAUX · Factory-Direct Artificial Flowers Wholesale · Yiwu Global Digital Trade Center T6 1F 1088</div>
<nav class="site-nav" aria-label="Main navigation">
  <a href="/" class="logo"><img src="/favicon.png" alt="Leo Faux logo"><span>LEO FAUX</span></a>
  <div class="nav-links">
    <a href="/">Home</a>
    <a href="/shop.html">Catalog (3,300+)</a>
    <a href="/en/artificial-flowers.html">Artificial Flowers</a>
    <a href="/en/silk-flowers.html">Silk &amp; Real-Touch</a>
    <a href="/en/wedding-artificial-flowers.html">Wedding &amp; Events</a>
    <a href="/en/blog/" aria-current="page">Blog</a>
    <a href="/en/about-us.html">About Us</a>
    <a href="/en/faq.html">FAQ</a>
    <a href="/#contact" class="nav-cta">Request Quote</a>
  </div>
</nav>`;

const SHARED_FOOTER = `<footer class="site-footer">
  <div class="footer-grid">
    <div>
      <h4>Leo Faux (Leo Flowers)</h4>
      <p>Factory-direct artificial flowers, real-touch florals, faux trees &amp; floral walls manufacturer in Yiwu, China.</p>
      <p style="margin-top:8px;color:#fffaf2;">Showroom: Shop 1088, 1F Commercial Street, T6 Office Building, Global Digital Trade Center (District 6, Yiwu International Trade City), Yiwu, Jinhua, Zhejiang, China</p>
    </div>
    <div>
      <h4>Collections</h4>
      <a href="/shop.html">All Wholesale Products (3,300+)</a>
      <a href="/en/artificial-flowers.html">Artificial Flowers</a>
      <a href="/en/silk-flowers.html">Silk &amp; Real-Touch Flowers</a>
      <a href="/en/wedding-artificial-flowers.html">Wedding &amp; Event Florals</a>
    </div>
    <div>
      <h4>Company</h4>
      <a href="/en/about-us.html">About Us &amp; Showroom</a>
      <a href="/en/blog/">SEO &amp; Sourcing Blog</a>
      <a href="/en/faq.html">Wholesale FAQ</a>
      <a href="/#contact">Contact Us</a>
    </div>
    <div>
      <h4>Connect With Us</h4>
      <a href="https://wa.me/8618657926791" target="_blank" rel="noopener">WhatsApp: +86 186 5792 6791</a>
      <a href="mailto:yiwuleofaux@gmail.com">Email: yiwuleofaux@gmail.com</a>
      <div class="social-pills">
        <a href="https://www.instagram.com/leo.flower_" target="_blank" rel="noopener">Instagram</a>
        <a href="https://www.facebook.com/profile.php?id=100080001653002" target="_blank" rel="noopener">Facebook</a>
        <a href="https://www.tiktok.com/@leo18657926791" target="_blank" rel="noopener">TikTok</a>
        <a href="https://vk.com/id1062674233" target="_blank" rel="noopener">VK</a>
        <a href="https://www.threads.net/@leo.flower_" target="_blank" rel="noopener">Threads</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">&copy; 2026 Leo Faux (Leo Flowers / Leo Flora). All rights reserved. | Yiwu Artificial Flowers Manufacturer</div>
</footer>
<a class="wa-float" href="https://wa.me/8618657926791" target="_blank" rel="noopener" aria-label="Chat on WhatsApp">${WA_SVG}</a>`;

function parseFrontmatter(content) {
  const normalized = content.replace(/\r\n/g, '\n');
  const match = normalized.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) return null;
  const fm = {};
  match[1].split('\n').forEach(line => {
    const m = line.match(/^(\w+):\s*(.+?)$/);
    if (!m) return;
    if (m[1] === 'tags') {
      try { fm.tags = JSON.parse(m[2]); } catch { fm.tags = []; }
    } else {
      fm[m[1]] = m[2].replace(/^["']|["']$/g, '').replace(/\\"/g, '"');
    }
  });
  return { frontmatter: fm, body: match[2] };
}

function formatInline(text) {
  return text
    .replace(/\[([^\]]+)\]\((https?:\/\/[^\s)]+|\/[^\s)]+)\)/g, '<a href="$2" class="inline-link">$1</a>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>');
}

function mdToHtml(body) {
  let html = '', inUl = false, inOl = false;
  for (let rawLine of body.split('\n')) {
    const line = rawLine.trim();
    const h = line.match(/^(#{1,6})\s+(.+)$/);
    if (h) {
      closeLists();
      const level = h[1].length === 1 ? 2 : h[1].length;
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
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
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

function generateArticlePage({ title, date, body, slug, description, keyword, lang, tags }) {
  const safeLang = ['en', 'es', 'pt', 'ar'].includes(lang) ? lang : 'en';
  const dirAttr = safeLang === 'ar' ? ' dir="rtl"' : '';
  const canonical = `${DOMAIN}/en/blog/${slug}.html`;
  const metaDesc = description || keyword || title;
  const cta = getCtaCopy(safeLang);
  const tagBadges = (Array.isArray(tags) && tags.length > 0 ? tags.slice(0, 4) : ['Artificial Flowers'])
    .map(t => `<span style="background:rgba(227,168,88,.18);color:#f3d29b;padding:3px 10px;border-radius:999px;font-size:12px;">${esc(t)}</span>`).join(' ');

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
  <link rel="stylesheet" href="/assets/brand.css">
  <link rel="stylesheet" href="/assets/pages.css">
  <script type="application/ld+json">${ldJson}</script>
  <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
  <script defer src="/_vercel/insights/script.js"></script>
  <style>
    .article-body { background:#fff; border:1px solid var(--leo-line); border-radius:18px; padding:40px 36px; }
    .article-body h2 { font-family:var(--leo-serif); font-weight:400; font-size:24px; color:var(--leo-ink); margin:32px 0 12px; }
    .article-body h3 { font-size:18px; color:var(--leo-wine); margin:24px 0 8px; }
    .article-body p { margin-bottom:16px; font-size:15.5px; color:#3d3536; }
    .article-body ul, .article-body ol { margin:12px 0 20px 24px; }
    .article-body li { margin-bottom:8px; font-size:15.5px; color:#3d3536; }
    .article-body a.inline-link { color:var(--leo-wine); text-decoration:underline; font-weight:600; }
    @media(max-width:640px){ .article-body{ padding:24px 18px; } }
  </style>
</head>
<body>
${SHARED_NAV}
<article class="page-hero" style="padding:52px 24px 44px;">
  <span class="kicker">LEO FAUX · FLORAL SOURCING &amp; DESIGN JOURNAL</span>
  <h1>${esc(title)}</h1>
  <div style="margin-top:14px;display:flex;justify-content:center;align-items:center;gap:8px;flex-wrap:wrap;font-size:13px;color:rgba(255,250,242,.75);">
    <span>${esc(date)}</span> ${tagBadges}
  </div>
</article>
<div class="container-narrow">
  <main class="article-body">${body}</main>
  <section class="cta-banner cta-box">
    <h3>${esc(cta.heading)}</h3>
    <p>${esc(cta.sub)}</p>
    <div class="hero-actions" style="margin-top:0;">
      <a href="/shop.html" class="btn-gold">${esc(cta.btn1)}</a>
      <a href="https://wa.me/8618657926791?text=Hello%20LEO%20FAUX%2C%20I%20would%20like%20a%20wholesale%20catalog%20and%20quote." target="_blank" rel="noopener" class="btn-outline-light">${esc(cta.btn2)}</a>
    </div>
  </section>
  <div style="text-align:center;margin-top:28px;font-size:14px;">
    <a href="/en/blog/">← Back to Blog</a> &nbsp;|&nbsp; <a href="/shop.html">Wholesale Catalog (3,300+)</a> &nbsp;|&nbsp; <a href="/">Home</a>
  </div>
</div>
${SHARED_FOOTER}
</body>
</html>`;
}

function generateBlogListing(posts) {
  // Compact JSON index for fast client-side search & pagination (24 per page)
  const compact = posts.map(p => [p.slug, p.title, p.date, p.desc.slice(0, 140), p.tag, p.lang]);
  const initialHtml = posts.slice(0, 24).map(p => `
    <article class="blog-row">
      <div class="blog-row-meta"><span>${esc(p.date)}</span><span class="blog-tag">${esc(p.tag)}</span></div>
      <h2><a href="/en/blog/${esc(p.slug)}.html">${esc(p.title)}</a></h2>
      <p>${esc(p.desc)}</p>
    </article>`).join('\n');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Artificial Flowers Blog — Wholesale &amp; Floral Decor Guides | Leo Faux</title>
  <meta name="description" content="Expert B2B guides on wholesale artificial flowers, real-touch roses, phalaenopsis orchids, faux trees, and floral walls from Leo Faux factory in Yiwu, China.">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="canonical" href="${DOMAIN}/en/blog/">
  <link rel="icon" href="/favicon.png" type="image/png">
  <link rel="stylesheet" href="/assets/brand.css">
  <link rel="stylesheet" href="/assets/pages.css">
  <script>window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };</script>
  <script defer src="/_vercel/insights/script.js"></script>
  <style>
    .blog-controls { display:flex; gap:12px; flex-wrap:wrap; margin-bottom:24px; align-items:center; justify-content:space-between; }
    .blog-search { flex:1; min-width:240px; padding:12px 18px; border:1px solid #d2c0b7; border-radius:999px; font-size:15px; background:#fff; outline:none; }
    .blog-search:focus { border-color:var(--leo-wine); }
    .blog-count { font-size:13.5px; color:var(--leo-muted); }
    .blog-grid-list { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:20px; }
    .blog-row { background:#fff; border:1px solid var(--leo-line); border-radius:16px; padding:22px 24px; display:flex; flex-direction:column; transition:border-color .2s; }
    .blog-row:hover { border-color:var(--leo-wine); }
    .blog-row-meta { display:flex; justify-content:space-between; align-items:center; gap:8px; font-size:12px; color:var(--leo-muted); margin-bottom:8px; }
    .blog-tag { background:#f6ece4; color:var(--leo-wine); padding:2px 9px; border-radius:999px; font-weight:600; font-size:11.5px; }
    .blog-row h2 { font-family:var(--leo-serif); font-weight:400; font-size:19px; line-height:1.35; margin-bottom:8px; }
    .blog-row h2 a { color:var(--leo-ink); }
    .blog-row h2 a:hover { color:var(--leo-wine); }
    .blog-row p { font-size:13.5px; color:var(--leo-muted); line-height:1.55; margin-top:auto; }
    .pager { display:flex; justify-content:center; align-items:center; gap:12px; margin-top:36px; flex-wrap:wrap; }
    .pager button { padding:9px 18px; border-radius:999px; border:1px solid var(--leo-line); background:#fff; color:var(--leo-ink); font-weight:600; cursor:pointer; }
    .pager button:disabled { opacity:.4; cursor:not-allowed; }
    .pager button:not(:disabled):hover { border-color:var(--leo-wine); color:var(--leo-wine); }
    @media(max-width:720px){ .blog-grid-list{ grid-template-columns:1fr; } }
  </style>
</head>
<body>
${SHARED_NAV}
<section class="page-hero">
  <span class="kicker">LEO FAUX JOURNAL · ${posts.length.toLocaleString()} ARTICLES</span>
  <h1>Wholesale Floral Sourcing &amp; Design Guides</h1>
  <p>Practical B2B insights on real-touch roses, phalaenopsis orchids, wedding flower walls, commercial faux trees, and global sourcing from Yiwu.</p>
</section>
<div class="container">
  <div class="blog-controls">
    <input type="search" id="blog-search" class="blog-search" placeholder="Search articles (e.g. rose, orchid, flower wall, wholesale, tree)...">
    <span class="blog-count" id="blog-count">Showing 1–24 of ${posts.length.toLocaleString()} articles</span>
  </div>
  <div class="blog-grid-list" id="blog-list">${initialHtml}</div>
  <div class="pager" id="blog-pager">
    <button id="prev-page">← Previous</button>
    <span id="page-info" style="font-size:14px;color:var(--leo-muted);">Page 1</span>
    <button id="next-page">Next →</button>
  </div>
</div>
${SHARED_FOOTER}
<script>
const POSTS = ${JSON.stringify(compact)};
const PER_PAGE = 24;
let filtered = POSTS;
let page = 1;
function escH(s){return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');}
function render(){
  const totalPages = Math.max(1, Math.ceil(filtered.length / PER_PAGE));
  if(page > totalPages) page = totalPages;
  const start = (page - 1) * PER_PAGE;
  const slice = filtered.slice(start, start + PER_PAGE);
  document.getElementById('blog-list').innerHTML = slice.map(p =>
    '<article class="blog-row">' +
      '<div class="blog-row-meta"><span>' + escH(p[2]) + '</span><span class="blog-tag">' + escH(p[4]) + '</span></div>' +
      '<h2><a href="/en/blog/' + escH(p[0]) + '.html">' + escH(p[1]) + '</a></h2>' +
      '<p>' + escH(p[3]) + '</p>' +
    '</article>'
  ).join('') || '<p style="color:var(--leo-muted);">No matching articles found.</p>';
  document.getElementById('blog-count').textContent = filtered.length ? 'Showing ' + (start+1) + '–' + (start+slice.length) + ' of ' + filtered.length.toLocaleString() + ' articles' : '0 articles found';
  document.getElementById('page-info').textContent = 'Page ' + page + ' of ' + totalPages;
  document.getElementById('prev-page').disabled = page <= 1;
  document.getElementById('next-page').disabled = page >= totalPages;
}
document.getElementById('prev-page').onclick = () => { if(page>1){ page--; render(); window.scrollTo({top:280,behavior:'smooth'}); } };
document.getElementById('next-page').onclick = () => { if(page*PER_PAGE<filtered.length){ page++; render(); window.scrollTo({top:280,behavior:'smooth'}); } };
let t;
document.getElementById('blog-search').oninput = e => {
  clearTimeout(t);
  t = setTimeout(() => {
    const q = e.target.value.trim().toLowerCase();
    filtered = q ? POSTS.filter(p => (p[1]+' '+p[3]+' '+p[4]).toLowerCase().includes(q)) : POSTS;
    page = 1;
    render();
  }, 200);
};
render();
</script>
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
    lang: lang || 'en',
    time: dateClean
  });
});

allPosts.sort((a, b) => b.time.localeCompare(a.time));
fs.writeFileSync(path.join(BLOG_DIR, 'index.html'), generateBlogListing(allPosts));
const latestEn = allPosts.filter(p => p.lang === 'en').slice(0, 6).map(({ slug, title, date, desc }) => ({ slug, title, date, desc }));
fs.writeFileSync(path.join(BLOG_DIR, 'latest.json'), JSON.stringify(latestEn, null, 2));

console.log(`✅ Done. ${converted} articles built with unified Leo Faux brand theme & paginated index.`);
