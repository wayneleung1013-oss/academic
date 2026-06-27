// @ts-check
import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";
import node from "@astrojs/node";

// 站点地址：部署前请改成你的正式域名（用于生成 canonical 链接、sitemap、Open Graph）。
// Production URL — change this to your real domain before deploying.
const SITE_URL = process.env.SITE_URL || "https://scholarformatstudio.com";

// https://astro.build/config
export default defineConfig({
  site: SITE_URL,
  devToolbar: {
    enabled: false,
  },
  security: {
    allowedDomains: [
      {
        protocol: "https",
        hostname: "scholarformatstudio.com",
        port: "443",
      },
      {
        protocol: "https",
        hostname: "www.scholarformatstudio.com",
        port: "443",
      },
      {
        protocol: "http",
        hostname: "127.0.0.1",
        port: "4321",
      },
      {
        protocol: "http",
        hostname: "localhost",
        port: "4321",
      },
    ],
  },
  // Server output is required for /api/upload mail delivery.
  output: "server",
  adapter: node({
    mode: "standalone",
  }),
  // 开启链接预取，站内跳转近乎瞬时。
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "viewport",
  },
  build: {
    // 小样式内联、大样式拆分，首屏更快。
    inlineStylesheets: "auto",
  },
  // 压缩 HTML，减小体积。
  compressHTML: true,
  integrations: [sitemap()],
});
