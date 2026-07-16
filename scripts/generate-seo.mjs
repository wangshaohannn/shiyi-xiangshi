import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { requireSiteUrl } from "../config/env.js";

const rootDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const publicDir = path.join(rootDir, "public");

const siteUrl = requireSiteUrl();

const today = new Date().toISOString().slice(0, 10);

const robots = `User-agent: *
Allow: /
Disallow: /admin
Disallow: /api/

Sitemap: ${siteUrl}/sitemap.xml
`;

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${siteUrl}/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
</urlset>
`;

await fs.mkdir(publicDir, { recursive: true });
await fs.writeFile(path.join(publicDir, "robots.txt"), robots);
await fs.writeFile(path.join(publicDir, "sitemap.xml"), sitemap);

console.log(`SEO files generated for ${siteUrl}`);
