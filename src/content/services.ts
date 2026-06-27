/** 六大服务的完整数据（服务页 + 首页概览共用）。 */

export interface XmlPriceRow {
  type: string;
  price: string;
  scenario: string;
}

export interface Service {
  /** 锚点 id，用于 /services#id 与底部链接 */
  id: string;
  /** 英文服务名 */
  name: string;
  /** 中文服务名 */
  nameZh: string;
  /** 完整价格区间，如 "¥99–199 / 篇" 或 "按项目报价" */
  price: string;
  /** 首页卡片用的「起价」标签，如 "¥99 起" */
  fromLabel: string;
  /** 一句话简介（首页卡片 / SEO） */
  summary: string;
  /** 面向人群 */
  audience: "author" | "institution" | "both";
  /** 图标键名（映射到内联 SVG） */
  icon: "format" | "submit" | "latex" | "production" | "batch" | "xml";
  /** 适合对象 */
  suitableFor: string[];
  /** 适合稿件类型（如服务三） */
  manuscriptTypes?: string[];
  /** 适合场景（如服务四） */
  scenarios?: string[];
  /** 包含服务 */
  includes: string[];
  /** 不包含 */
  excludes?: string[];
  /** 可选增值服务（如服务五） */
  valueAdded?: string[];
  /** XML 价格区分表（服务六） */
  xmlPricing?: XmlPriceRow[];
  /** 适用范围建议（服务一、二） */
  suitableRange?: string;
  /** 补充说明 */
  note?: string;
}

export const services: Service[] = [
  {
    id: "journal-basic",
    name: "Journal Format Basic",
    nameZh: "基础期刊格式排版",
    price: "¥99–199 / 篇",
    fromLabel: "¥99 起",
    summary: "适合简单 Word 期刊稿、短论文和普通会议论文，快速完成基础格式整理。",
    audience: "author",
    icon: "format",
    suitableFor: [
      "简单 Word 期刊稿",
      "简短通讯类论文",
      "病例报告",
      "简短研究论文",
      "普通会议论文",
      "图表较少、格式要求不复杂的稿件",
    ],
    includes: [
      "按目标期刊基本格式调整",
      "字体、字号、行距、页边距整理",
      "标题层级统一",
      "摘要、关键词、正文结构格式整理",
      "图表标题基础格式统一",
      "表格基础格式整理",
      "参考文献格式基础统一",
      "Word + PDF 文件交付",
      "1 次小修改",
    ],
    excludes: [
      "LaTeX 排版",
      "大量复杂表格处理",
      "参考文献逐条深度核对",
      "图表与正文引用逐项核查",
      "标题页深度整理",
      "匿名稿深度处理",
      "XML 生成",
      "语言润色",
      "毕业论文格式调整",
    ],
    suitableRange: "适用于 6000 字以内、图表 5 个以内、参考文献 50 条以内的简单 Word 稿件。",
  },
  {
    id: "submission-standard",
    name: "Journal Submission Standard",
    nameZh: "标准投稿排版",
    price: "¥199–499 / 篇",
    fromLabel: "¥199 起",
    summary:
      "适合 SCI、SSCI、Scopus、EI、PubMed 等正式投稿稿件，按投稿指南完整排版。",
    audience: "author",
    icon: "submit",
    suitableFor: [
      "准备正式投稿期刊的作者",
      "SCI、SSCI、Scopus、EI、PubMed 投稿作者",
      "普通英文期刊投稿作者",
    ],
    includes: [
      "按目标期刊投稿指南完整排版",
      "标题层级统一",
      "字体、行距、页边距整理",
      "图表编号统一",
      "正文图表引用一致性基础检查",
      "表格格式整理",
      "参考文献格式统一",
      "标题页整理",
      "匿名稿处理",
      "资助声明、利益冲突声明、伦理声明等位置检查",
      "文件命名整理",
      "Word + PDF 文件交付",
      "2 次小修改",
    ],
    excludes: [
      "语言润色",
      "学术内容修改",
      "投稿信重新写作",
      "代投稿",
      "图片重绘",
      "数据检查",
      "XML 生成",
      "毕业论文格式调整",
    ],
    suitableRange: "适用于 8000 字以内、图表 10 个以内、参考文献 80 条以内的 Word 稿件。",
  },
  {
    id: "latex",
    name: "Technical & LaTeX Formatting",
    nameZh: "技术论文 / LaTeX 排版",
    price: "¥499–799 / 篇",
    fromLabel: "¥499 起",
    summary:
      "适合 IEEE、ACM、Springer、Elsevier、Overleaf 与 LaTeX 稿件，含模板套用与编译修复。",
    audience: "author",
    icon: "latex",
    suitableFor: [
      "计算机、工程、数学、物理领域作者",
      "电磁、通信、材料领域作者",
      "人工智能、机器人等领域作者",
    ],
    manuscriptTypes: [
      "IEEE 模板稿件",
      "ACM 模板稿件",
      "Springer 模板稿件",
      "Elsevier LaTeX 模板稿件",
      "Overleaf 项目",
      "LaTeX 投稿稿件",
      "技术类会议论文",
      "Word 转 LaTeX 基础处理稿件",
    ],
    includes: [
      "LaTeX 模板套用",
      "Word 转 LaTeX 基础处理",
      "Overleaf 项目整理",
      "BibTeX / BibLaTeX 参考文献整理",
      "公式编号格式整理",
      "图表浮动体处理",
      "表格格式调整",
      "IEEE / ACM / Springer / Elsevier 模板排版",
      "编译错误基础修复",
      "PDF 输出",
      "LaTeX 源文件 + PDF 文件交付",
      "2 次小修改",
    ],
    excludes: [
      "数学公式正确性检查",
      "代码结果检查",
      "学术内容改写",
      "复杂 TikZ 绘图",
      "大量公式重排",
      "严重损坏的 LaTeX 项目重构",
      "XML 生成",
      "语言润色",
    ],
    note: "如涉及大量复杂公式、复杂表格、模板重构、严重编译错误或大规模 Word 转 LaTeX，应单独报价。",
  },
  {
    id: "production",
    name: "Article Production Formatting",
    nameZh: "期刊文章出版排版",
    price: "¥300–1000 / 篇",
    fromLabel: "¥300 起",
    summary: "面向期刊录用后的 PDF 出版排版阶段，按期刊固定模板生成正式文章版面。",
    audience: "institution",
    icon: "production",
    suitableFor: [
      "小型期刊",
      "OA 期刊",
      "编辑部",
      "出版社",
      "学术协会",
      "已录用文章出版排版阶段",
    ],
    scenarios: [
      "录用稿转正式 PDF",
      "在线优先发表文章",
      "单篇文章版面排版",
      "期刊固定模板排版",
      "OJS 上传前文件整理",
    ],
    includes: [
      "按期刊固定模板排版",
      "作者、单位、通讯作者格式整理",
      "摘要、关键词、正文、参考文献格式统一",
      "DOI、卷、期、页码、文章编号位置整理",
      "收稿日期、修回日期、录用日期、上线日期整理",
      "图表位置与标题统一",
      "页眉页脚处理",
      "PDF 输出",
      "单篇文章出版文件交付",
    ],
    excludes: [
      "XML 生成",
      "图片专业重绘",
      "语言润色",
      "内容编辑",
      "DOI 注册",
      "OJS 全流程管理",
      "数据或学术内容检查",
    ],
    note: "XML 可作为增值服务单独收费。",
  },
  {
    id: "batch",
    name: "Journal & Conference Batch Formatting",
    nameZh: "期刊 / 会议批量排版",
    price: "按项目报价",
    fromLabel: "按项目报价",
    summary: "面向杂志社、会议、专刊与论文集，建立统一模板批量排版。",
    audience: "institution",
    icon: "batch",
    suitableFor: [
      "杂志社",
      "学术会议",
      "专刊",
      "会议论文集",
      "学术协会",
      "编辑部",
      "出版服务机构",
      "科研服务公司",
    ],
    includes: [
      "建立统一排版模板",
      "批量文章格式统一",
      "单篇 PDF 输出",
      "整期 PDF 或论文集 PDF 输出",
      "目录页",
      "页码",
      "卷期号",
      "DOI / 文章编号位置整理",
      "作者和单位格式统一",
      "图表和参考文献格式统一",
      "文件夹结构整理",
      "OJS 上传前文件整理",
    ],
    valueAdded: [
      "JATS XML 生成",
      "PDF + XML 组合交付",
      "OJS 上传前文件整理",
      "期刊模板设计",
      "会议论文集封面和目录页排版",
      "批量文件命名与归档",
    ],
  },
  {
    id: "jats-xml",
    name: "JATS XML Conversion",
    nameZh: "JATS XML 生成 / 转换",
    price: "¥199–1500 / 篇",
    fromLabel: "按篇 / 按项目报价",
    summary:
      "面向期刊、出版社、编辑部与 OA 平台，将稿件转为结构化 JATS XML 用于收录与上传。",
    audience: "institution",
    icon: "xml",
    suitableFor: [
      "期刊",
      "出版社",
      "编辑部",
      "OA 平台",
      "需要数据库收录或平台上传的期刊",
      "需要结构化 XML 文件的出版项目",
    ],
    includes: [
      "Word / PDF / 排版稿转 JATS XML",
      "文章元数据标记",
      "标题、摘要、关键词标记",
      "作者与单位标记",
      "资助声明、利益冲突声明、伦理声明标记",
      "参考文献标记",
      "图表基础标记",
      "DOI、卷、期、页码 / 文章编号标记",
      "XML 文件交付",
      "基础结构检查",
    ],
    xmlPricing: [
      {
        type: "基础 JATS XML",
        price: "¥199–399 / 篇",
        scenario: "结构简单、图表少、公式少、参考文献清楚",
      },
      {
        type: "标准 JATS XML",
        price: "¥399–799 / 篇",
        scenario: "正式期刊文章，有图表、DOI、完整作者单位和声明信息",
      },
      {
        type: "复杂 JATS XML",
        price: "¥800–1500 / 篇",
        scenario: "公式多、表格复杂、参考文献多、多作者多单位、平台规范复杂",
      },
      {
        type: "批量 XML，20 篇以上",
        price: "¥200–600 / 篇",
        scenario: "期刊整期、会议论文集、批量出版项目",
      },
    ],
  },
];

/** 首页服务概览（需求文档「首页服务概览」，含每张卡的按钮文案）。 */
export const homeServiceOverview = [
  {
    id: "journal-basic",
    title: "基础期刊格式排版",
    desc: "适合简单 Word 期刊稿、短论文和普通会议论文。",
    price: "¥99 起",
    cta: { label: "查看详情", href: "/services#journal-basic" },
  },
  {
    id: "submission-standard",
    title: "标准投稿排版",
    desc: "适合 SCI、SSCI、Scopus、EI、PubMed 等正式投稿稿件。",
    price: "¥199 起",
    cta: { label: "查看详情", href: "/services#submission-standard" },
  },
  {
    id: "latex",
    title: "技术论文 / LaTeX 排版",
    desc: "适合 IEEE、ACM、Springer、Elsevier、Overleaf 和 LaTeX 稿件。",
    price: "¥499 起",
    cta: { label: "查看详情", href: "/services#latex" },
  },
  {
    id: "batch",
    title: "期刊 / 会议批量排版",
    desc: "适合杂志社、会议、专刊、论文集和编辑部。",
    price: "按项目报价",
    cta: { label: "获取机构报价", href: "/contact" },
  },
  {
    id: "jats-xml",
    title: "JATS XML 生成 / 转换",
    desc: "适合期刊、出版社、编辑部和 OA 平台上传需求。",
    price: "按篇或按项目报价",
    cta: { label: "咨询 XML 服务", href: "/contact" },
  },
] as const;
