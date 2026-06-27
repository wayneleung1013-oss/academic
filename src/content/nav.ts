/** 站点导航与底部链接。 */

export interface NavItem {
  label: string;
  href: string;
}

/** 主导航：首页｜服务｜价格｜FAQ｜联系｜上传稿件 */
export const mainNav: NavItem[] = [
  { label: "首页", href: "/" },
  { label: "服务", href: "/services" },
  { label: "价格", href: "/pricing" },
  { label: "FAQ", href: "/faq" },
  { label: "联系", href: "/contact" },
  { label: "上传稿件", href: "/upload" },
];

/** 底部链接。 */
export const footerNav: { title: string; items: NavItem[] }[] = [
  {
    title: "服务",
    items: [
      { label: "基础期刊格式排版", href: "/services#journal-basic" },
      { label: "标准投稿排版", href: "/services#submission-standard" },
      { label: "技术论文 / LaTeX 排版", href: "/services#latex" },
      { label: "JATS XML 生成 / 转换", href: "/services#jats-xml" },
    ],
  },
  {
    title: "导航",
    items: [
      { label: "首页 Home", href: "/" },
      { label: "服务 Services", href: "/services" },
      { label: "价格 Pricing", href: "/pricing" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "提交与政策",
    items: [
      { label: "联系 Contact", href: "/contact" },
      { label: "上传稿件 Upload", href: "/upload" },
      { label: "隐私政策 Privacy Policy", href: "/privacy" },
      { label: "服务条款 Terms of Service", href: "/terms" },
      { label: "保密与学术伦理 Confidentiality & Ethics", href: "/confidentiality" },
    ],
  },
];
