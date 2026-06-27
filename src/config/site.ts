/**
 * 站点全局配置 —— Single source of truth.
 * 注意：网站前台只展示 ScholarFormat Studio 品牌，不显示公司主体名称、不显示 ICP 备案信息。
 */

export const site = {
  brand: "ScholarFormat Studio",
  brandZh: "学术论文排版服务",
  tagline: "Academic Manuscript Formatting for Journal Submission",

  /** 正式域名（同时用于 astro.config.mjs 的 site 字段）。 */
  url: "https://scholarformatstudio.com",

  /** 联系方式。微信 / WhatsApp 暂未提供，留空则页面自动隐藏，不编造。 */
  contact: {
    email: "sfs@scholarformatstudio.com",
    wechat: "", // 暂未提供，请勿编造
    whatsapp: "", // 暂未提供，请勿编造
  },

  /**
   * 表单提交接收地址（联系表单 / 上传表单）。
   * 联系表单和上传表单都通过服务端接口发送邮件。
   */
  forms: {
    contactEndpoint: "/api/contact",
    uploadEndpoint: "/api/upload",
    maxUploadMB: 50,
    /** 提交成功提示（来自需求文档）。 */
    contactSuccess: "感谢提交，我们会根据您提供的信息评估稿件复杂度，并尽快回复报价。",
    uploadSuccess: "文件已提交。我们会尽快查看稿件和目标期刊要求，并回复报价和预计交付时间。",
  },

  /** SEO 默认值 */
  seo: {
    defaultTitle: "ScholarFormat Studio · 学术论文排版服务",
    titleTemplate: "%s · ScholarFormat Studio",
    description:
      "ScholarFormat Studio 专注学术论文投稿排版：为科研作者、学生作者、期刊与会议提供 Word / LaTeX 论文排版、投稿文件整理、期刊文章 PDF production 与 JATS XML 生成服务。专业、保密、价格灵活。",
    keywords: [
      "论文排版",
      "投稿排版",
      "期刊排版",
      "LaTeX 排版",
      "JATS XML",
      "Word 排版",
      "author guidelines 排版",
      "academic manuscript formatting",
      "journal submission formatting",
    ],
    ogImage: "/og-image.png",
    locale: "zh-CN",
  },
} as const;

export type Site = typeof site;
