# Leo Faux Website Maintenance Guide

- **Live Site**: https://www.leofaux.com/
- **Product Catalog**: `/shop.html` (powered by Supabase `products` table, 3,378 SKUs)
- **Visual Category Map**: `/assets/product-categories.json` (7 form-based categories: `single`, `bouquets`, `greenery`, `walls`, `trees`, `vines`, `orchids`)
- **Blog Builder**: `node convert-blog.js && node generate-sitemap.js` (auto-run by Vercel on push to `main`)
- **Shared Styles**: `/assets/brand.css`, `/assets/home.css`, `/assets/pages.css`, `/assets/shop-theme.css`
- **Official QR Assets**: `/images/qr/` (`whatsapp.jpg`, `wechat.jpg`, `line.jpg`, `linktr.png`)
