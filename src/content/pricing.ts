/** 价格页数据：个人作者、机构客户、加价项。 */

export interface PriceRow {
  service: string;
  price: string;
  suitableFor: string;
  /** 关联服务锚点（可点击跳转服务页） */
  href?: string;
}

export const authorPricing: PriceRow[] = [
  {
    service: "基础期刊格式排版",
    price: "¥99–199 / 篇",
    suitableFor: "简单 Word 期刊稿、短论文、普通会议论文",
    href: "/services#journal-basic",
  },
  {
    service: "标准投稿排版",
    price: "¥199–499 / 篇",
    suitableFor: "SCI、SSCI、Scopus、EI、PubMed 等正式投稿稿件",
    href: "/services#submission-standard",
  },
  {
    service: "技术论文 / LaTeX 排版",
    price: "¥499–799 / 篇",
    suitableFor: "IEEE、ACM、Springer、Elsevier、Overleaf、LaTeX 稿件",
    href: "/services#latex",
  },
];

export const institutionPricing: PriceRow[] = [
  {
    service: "期刊文章出版排版",
    price: "¥300–1000 / 篇",
    suitableFor: "期刊录用后 PDF 出版排版、编辑部单篇排版",
    href: "/services#production",
  },
  {
    service: "期刊 / 会议批量排版",
    price: "按项目报价",
    suitableFor: "杂志社、会议、专刊、论文集、编辑部",
    href: "/services#batch",
  },
  {
    service: "JATS XML 生成 / 转换",
    price: "¥199–1500 / 篇",
    suitableFor: "期刊、出版社、编辑部、OA 平台上传需求",
    href: "/services#jats-xml",
  },
  {
    service: "PDF + XML 组合服务",
    price: "¥700–1500 / 篇",
    suitableFor: "需要 PDF 出版排版和 JATS XML 的期刊客户",
    href: "/services#jats-xml",
  },
];

/** 期刊 / 会议批量排版参考价格。 */
export interface BatchPriceRow {
  project: string;
  price: string;
}

export const batchReferencePricing: BatchPriceRow[] = [
  { project: "5–10 篇小批量", price: "¥3000–8000" },
  { project: "10–30 篇会议论文", price: "¥8000–25000" },
  { project: "整期期刊出版排版", price: "¥5000–20000 / 期" },
  { project: "长期月度排版支持", price: "¥5000–30000 / 月" },
  { project: "海外会议 / 期刊项目", price: "$800–5000+ / 项目" },
];

export interface AddonRow {
  item: string;
  rule: string;
}

export const addons: AddonRow[] = [
  { item: "24 小时加急", rule: "+50%" },
  { item: "12 小时超急", rule: "+100%" },
  { item: "更换目标期刊重新排版", rule: "原价 50%–80%" },
  { item: "超过 8000 字", rule: "+20%–40%" },
  { item: "超过 10 个图表", rule: "+20%" },
  { item: "超过 80 条参考文献", rule: "+20%" },
  { item: "复杂 LaTeX 表格", rule: "+¥300–1000" },
  { item: "Word 转 LaTeX", rule: "单独报价" },
  { item: "大量参考文献重新整理", rule: "+¥300–1500" },
  { item: "额外修改轮次", rule: "+¥100–500" },
  { item: "XML 复杂公式 / 表格", rule: "+¥300–1000" },
  { item: "XML 平台特殊规范", rule: "单独报价" },
  { item: "客户新增大量内容", rule: "单独报价" },
  { item: "更换模板或更换目标期刊", rule: "单独报价" },
  { item: "批量项目加急", rule: "单独报价" },
];

export const priceNote =
  "最终报价取决于稿件长度、图表数量、参考文献数量、目标期刊格式要求、LaTeX 复杂度、XML 复杂度和交付时间。";
