import type { APIRoute } from "astro";
import { site } from "../config/site";

/**
 * 在构建期生成 robots.txt，Sitemap 地址来自 site.url（单一数据源）。
 * 这样换域名时只改 src/config/site.ts，robots.txt 自动同步，无需手动维护 public/robots.txt。
 */
export const GET: APIRoute = () => {
  const body = `User-agent: *
Allow: /

Sitemap: ${new URL("sitemap-index.xml", site.url).href}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
