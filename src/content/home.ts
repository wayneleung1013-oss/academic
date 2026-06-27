/** 首页内容数据。 */

export const hero = {
  eyebrow: "ScholarFormat Studio",
  title: "学术论文排版服务",
  titleEn: "Academic Manuscript Formatting for Journal Submission",
  subtitle:
    "为科研作者、学生作者、期刊和会议提供快速、可靠、价格灵活的 Word / PDF / LaTeX 论文排版、投稿文件整理、期刊文章排版和 JATS XML 生成服务。",
  primaryCta: { label: "获取报价", href: "/contact" },
  secondaryCta: { label: "上传稿件", href: "/upload" },
};

/** 首页核心卖点（需求文档「首页核心卖点」）。 */
export const sellingPoints: { icon: string; text: string }[] = [
  { icon: "target", text: "专注期刊和会议论文排版" },
  { icon: "file", text: "支持 Word、LaTeX、Overleaf" },
  { icon: "guidelines", text: "可按目标期刊 author guidelines 排版" },
  { icon: "anonymous", text: "支持 title page 和 blinded manuscript 整理" },
  { icon: "pdf", text: "支持期刊文章 PDF production" },
  { icon: "xml", text: "支持 JATS XML 生成" },
  { icon: "lock", text: "文件保密处理" },
];

/**
 * 我们怎么做 / 怎么收费 —— 使用需求文档「可以写」的合规表述。
 * （professional / journal submission / editor-checked / confidential /
 *  fast turnaround / affordable / no ghostwriting / no fake references /
 *  no data manipulation / no publication guarantees）
 */
export const trustSignals: { title: string; desc: string }[] = [
  {
    title: "专业排版，编辑校对",
    desc: "Professional, editor-checked formatting：由排版编辑按目标期刊要求逐项整理格式，而非简单套模板。",
  },
  {
    title: "文件全程保密",
    desc: "Confidential file handling：客户文件仅用于本次排版，不公开展示、不用于宣传，除非获得明确授权。",
  },
  {
    title: "交付快、价格灵活",
    desc: "Fast turnaround & affordable pricing：个人稿件通常 1–3 个工作日交付，价格按稿件实际情况灵活报价。",
  },
  {
    title: "边界清晰、诚实可信",
    desc: "No ghostwriting、no fake references、no data manipulation、no publication guarantees：不代写、不编造参考文献、不修改数据、不承诺录用。",
  },
];

/** 提交流程（首页「如何提交稿件获取报价」）。 */
export const steps: { step: string; title: string; desc: string }[] = [
  {
    step: "01",
    title: "提交需求或上传稿件",
    desc: "填写联系表单或上传稿件，告诉我们目标期刊 / 会议、稿件字数、图表与参考文献数量、是否需要 LaTeX 或 XML。",
  },
  {
    step: "02",
    title: "确认报价与交付时间",
    desc: "我们根据稿件长度、格式要求与交付时间确认报价，与你确认服务范围后再开始。",
  },
  {
    step: "03",
    title: "排版交付与修改",
    desc: "按目标期刊要求完成排版，交付 Word / PDF / LaTeX / XML 文件，并提供约定范围内的小修改。",
  },
];

/** 我们能做 / 不做（合规边界，对应需求文档第十一节）。 */
export const scope = {
  weDo: [
    "期刊与会议论文投稿格式排版",
    "Word、LaTeX、Overleaf 排版",
    "按 author guidelines 排版",
    "title page 与 blinded manuscript 整理",
    "期刊文章 PDF production",
    "JATS XML 生成 / 转换",
  ],
  weDont: [
    "代写论文",
    "修改或编造研究数据",
    "编造参考文献",
    "承诺录用或保证发表",
    "代替作者投稿或冒充作者",
    "毕业论文 / 学位论文格式调整",
  ],
};
