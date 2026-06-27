# ScholarFormat Studio · 官网

> 学术论文排版服务官网 · Academic Manuscript Formatting for Journal Submission
> 域名：scholarformatstudio.com ｜ 邮箱：sfs@scholarformatstudio.com
> 注意：网站前台只展示 ScholarFormat Studio 品牌，**不显示公司主体名称、不显示 ICP 备案信息**。

一个**高性能、现代化的 Astro 网站**。上传文件并获取报价已接入服务端 SMTP 发信，
因此生产环境需要部署到支持 Node.js 的服务端 / Serverless 平台，不能只作为纯静态站托管。

- ⚡️ **高性能**：默认零运行时框架 JS，首屏极快；HTML 压缩、样式按需内联、链接预取。
- 🌏 **国内外可访问**：**不使用任何被墙资源**（无 Google Fonts、无 Google Analytics、无外部字体/脚本 CDN），全部资源本地化。
- 🎨 **学术风格**：蓝 / 深灰 / 白，专业、简洁、可信。
- 🧩 **易维护**：文案、价格、服务、FAQ 全部集中在 `src/content/`，联系方式 / 域名 / 表单接收地址集中在 `src/config/site.ts`。
- 🔍 **SEO 完整**：每页 title/description、Open Graph、canonical、`sitemap.xml`、`robots.txt`、JSON-LD 结构化数据（Organization + FAQPage）。
- ♿️ **可访问**：语义化结构、键盘可用、跳转链接、`aria` 标注、尊重 `prefers-reduced-motion`。

---

## 一、本地运行

需要 Node.js ≥ 18（推荐 20/22）。

```bash
npm install        # 安装依赖
npm run dev        # 本地开发，http://localhost:4321
npm run build      # 生产构建，产物在 dist/
npm run preview    # 本地预览构建产物
npm run check      # 类型检查（可选）
```

构建后使用 Astro Node adapter 输出服务端应用；静态资源会在 `dist/client/`，服务端入口在 `dist/server/`。

---

## 二、上线前需要填的配置

只改一个文件：[`src/config/site.ts`](src/config/site.ts)。

| 字段 | 说明 |
| --- | --- |
| `url` | 正式域名，已设为 `https://scholarformatstudio.com`（同时改 `astro.config.mjs` 的 `SITE_URL`，或用环境变量 `SITE_URL`）|
| `contact.email` | 联系邮箱，已设为 `sfs@scholarformatstudio.com`（留空则页面自动隐藏邮箱入口）|
| `contact.wechat` / `contact.whatsapp` | 微信号 / WhatsApp（留空自动隐藏）|
| `forms.contactEndpoint` | 联系表单接收地址（见下文「表单后端」）|
| `forms.uploadEndpoint` | 文件上传接收地址，已设为 `/api/upload` |

> 域名、邮箱、微信等需求文档里「暂未确定」的项，留空即可，网站会优雅降级；确定后填上即生效，**无需改动其它代码**。
>
> 换域名只需改 `url`（及 `astro.config.mjs` 的 `SITE_URL`）：`canonical`、Open Graph、`sitemap.xml`、`robots.txt` 会**全部自动同步**（`robots.txt` 由 [`src/pages/robots.txt.ts`](src/pages/robots.txt.ts) 在构建期按 `site.url` 生成，无需手动维护）。

底部备案号占位在 [`src/components/Footer.astro`](src/components/Footer.astro)（搜索「备案号占位」），备案通过后填入，如 `京ICP备2026XXXXXX号`。

---

## 三、表单后端（联系表单 / 文件上传）

联系表单与上传表单已分别接入内置接口 `/api/contact`、`/api/upload`，会通过服务端邮件接口把表单信息和附件发送到邮箱。请复制 `.env.example` 为 `.env`，或在部署平台里配置同名环境变量：

```bash
SMTP_HOST=smtp.example.com
# 可选：仅当本机 DNS/Fake-IP 导致 SMTP_HOST 解析异常时填写真实 IP
SMTP_HOST_IP=
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user@example.com
SMTP_PASS=your-smtp-password-or-app-password
SMTP_FROM="ScholarFormat Studio <your-smtp-user@example.com>"
UPLOAD_NOTIFY_TO=sfs@scholarformatstudio.com
```

Resend SMTP 可使用：

```bash
MAIL_PROVIDER=resend
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=resend
SMTP_PASS=re_xxx
SMTP_FROM="ScholarFormat Studio <sfs@scholarformatstudio.com>"
UPLOAD_NOTIFY_TO=sfs@scholarformatstudio.com
```

设置 `MAIL_PROVIDER=resend` 后，联系表单和上传接口会优先使用 Resend HTTPS API 发信，以避开部分网络对 SMTP 端口的限制。API key 优先读取 `RESEND_API_KEY`；如果未设置，会复用 `SMTP_PASS`。

使用 Resend 前，请先在 Resend Domains 中添加并验证 `SMTP_FROM` 对应的发件域名，例如 `scholarformatstudio.com`；未验证时 Resend API 会返回 403。

如果本机或服务器使用代理、Fake-IP DNS，或网络阻断 SMTP 端口，可额外配置：

```bash
SMTP_HOST_IP=1.179.116.1
# 或
SMTP_PROXY=http://127.0.0.1:7890
# 或
SMTP_PROXY=socks5://127.0.0.1:7891
```

`SMTP_HOST_IP` 会绕过本机 DNS 直接连接指定 IP，但 TLS 仍会按 `SMTP_HOST` 校验服务器名称。正式服务器 DNS 正常时可以留空。

如果返回 `Your SMTP account is not yet activated`，说明 SMTP Login / SMTP Key 已通过验证，但邮件服务商尚未开通该账号的事务邮件 / SMTP 发信权限。需要在服务商后台开通或联系支持申请激活后，网站才能真正发出邮件。

联系表单默认使用 `/api/contact`，上传表单默认使用 `/api/upload`。如果要将通知发送到不同邮箱，可额外配置 `CONTACT_NOTIFY_TO` 或 `UPLOAD_NOTIFY_TO`。

> 上传大小上限在 `site.forms.maxUploadMB`（默认 50MB），前端会校验；后端也要设置对应限制。

---

## 四、部署：国内外都能访问

> 这是本项目的核心诉求。先看结论，再按你的情况选。

| 方案 | 海外访问 | 国内访问 | 是否支持 SMTP 上传接口 | 上手难度 |
| --- | --- | --- | --- | --- |
| **① Node 服务器 / VPS / 宝塔 Node 项目** | 取决于服务器 | 好（国内服务器需备案）| ✅ | ⭐⭐ |
| **② 支持 Node 的 Serverless 平台** | 通常较好 | 取决于平台节点 | ✅ | ⭐⭐ |
| **③ 纯静态托管 / OSS / COS / GitHub Pages** | 好 | 取决于 CDN | ❌ `/api/upload` 不可用 | ⭐ |

### 方案 ①：Node 服务器 / VPS / 宝塔 Node 项目

适合需要 SMTP 发信和文件附件上传的生产部署。构建后运行 Astro Node server，并在服务器环境变量里配置 SMTP。

```bash
npm install
npm run build
node dist/server/entry.mjs
```

建议用 PM2 / systemd 守护进程，并用 Nginx/Caddy 反向代理到 Node 服务。

### 方案 ②：支持 Node 的 Serverless 平台

可部署到支持 Astro Node/server 输出的平台。注意：部分平台的边缘运行时不支持 SMTP 这种 TCP 连接，需要选择 Node.js runtime。

### 方案 ③：纯静态托管 / 对象存储 + CDN

如果只部署 `dist/client/` 到 OSS/COS/CDN，页面能打开，但 `/api/upload` 不会运行，上传文件发邮件功能不可用。

### 方案 ③：双部署 + 智能 DNS 分线路 —— 国内外都最快（推荐生产）

同一份 `dist/` 部署到两处，用「分线路解析」把国内用户导向国内 CDN、海外用户导向 Cloudflare：

```
              ┌──────── 境内访客 ──────► 阿里云/腾讯云 CDN + OSS/COS（已备案）
  DNS 分线路 ─┤
              └──────── 境外访客 ──────► Cloudflare Pages（全球 CDN）
```

1. 海外侧：方案 ① 部署到 Cloudflare Pages。
2. 国内侧：方案 ② 部署到 OSS/COS + CDN（完成备案）。
3. DNS 用支持「境内/境外（或电信/联通/移动/境外）分线路」的解析服务（如 **DNSPod**、**阿里云云解析 DNS** 企业版）：
   - 「境外」线路 → CNAME 到 Cloudflare Pages 域名。
   - 「境内/默认」线路 → CNAME 到国内 CDN 加速域名。
4. 每次发布：`npm run build` 后，同一份 `dist/` 同步到两侧（可写一个简单脚本/CI 同时 push 仓库并 `ossutil cp`）。

> 如果需要国内 CDN 加速，可让 CDN 回源到 Node 服务，而不是只上传静态文件。

---

## 五、国内访问的注意事项（已为你处理）

- ✅ **未使用 Google Fonts / Google Analytics / 任何境外字体或脚本 CDN**：字体用系统字体栈（PingFang SC、微软雅黑、苹方等），图标为内联 SVG，全部资源随站点本地分发，国内不卡。
- ✅ **HTTPS**：上述各方案均自动或可配 HTTPS。
- ⚠️ **要在国内 CDN 上对外服务，必须 ICP 备案**（法规要求）。备案前可先用方案 ① 让国内外都能访问。
- ⚠️ 若以后接入访问统计，国内建议用**百度统计 / 友盟**等国内服务，避免 Google Analytics。

---

## 六、改文案 / 价格 / 服务（不用懂代码）

所有内容集中在 `src/content/` 与 `src/config/`：

| 要改的内容 | 文件 |
| --- | --- |
| 品牌名、公司、域名、联系方式、表单地址、SEO | [`src/config/site.ts`](src/config/site.ts) |
| 六项服务（名称/价格/适合对象/包含/不包含）| [`src/content/services.ts`](src/content/services.ts) |
| 价格表与加价项 | [`src/content/pricing.ts`](src/content/pricing.ts) |
| 常见问题 FAQ | [`src/content/faq.ts`](src/content/faq.ts) |
| 首页卖点 / 流程 / 信任 / 边界 | [`src/content/home.ts`](src/content/home.ts) |
| 导航与页脚链接 | [`src/content/nav.ts`](src/content/nav.ts) |
| 表单字段选项 | [`src/content/forms.ts`](src/content/forms.ts) |
| 配色 / 字体 / 间距等设计令牌 | [`src/styles/tokens.css`](src/styles/tokens.css) |

改完保存，`npm run build` 重新构建并重新部署即可。

---

## 七、中英文切换

页头已提供中文 / EN 语言切换按钮，切换偏好会保存在浏览器 `localStorage` 中。前台主要页面、导航、表单和页脚文案会跟随切换。

语言切换脚本在 `src/scripts/language-switch.ts`。如新增页面或新增大段文案，请同步补充对应英文文案。

---

## 八、目录结构

```
academic/
├─ astro.config.mjs        # Astro 配置（站点地址、sitemap、预取、压缩）
├─ src/
│  ├─ config/site.ts       # ★ 全局配置：域名/联系方式/表单/SEO
│  ├─ content/             # ★ 全部文案与数据（services/pricing/faq/...）
│  ├─ styles/              # 设计令牌 + 全局样式 + 表单样式
│  ├─ layouts/BaseLayout.astro   # HTML 骨架 + SEO + 结构化数据
│  ├─ components/          # Header/Footer/Button/Section/表单/价格表/FAQ...
│  ├─ scripts/             # 表单交互逻辑（校验/提交/文件拖放）
│  └─ pages/               # 9 个页面：首页/服务/价格/FAQ/联系/上传/隐私/条款/保密与学术伦理
└─ public/                 # favicon、og-image、robots.txt
```

---

## 九、常见问题（部署向）

**Q：能不能完全不用 Node 部署？**
A：如果不需要在线上传文件发邮件，可以改回纯静态部署；但当前 `/api/upload` 使用 SMTP 发信，生产环境需要 Node.js runtime。

**Q：国内一定要备案吗？**
A：用国内云 CDN/服务器对外提供服务，按规定**需要备案**。不想立刻备案，可先用 Cloudflare Pages（方案 ①），国内外都能访问，备案完成后再切到方案 ②/③ 提速。

**Q：表单收不到提交？**
A：检查部署平台是否运行 Node server，并确认 `SMTP_HOST`、`SMTP_PORT`、`SMTP_USER`、`SMTP_PASS`、`SMTP_FROM`、`UPLOAD_NOTIFY_TO` 已配置。
