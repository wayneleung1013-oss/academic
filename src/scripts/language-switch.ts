type Language = "zh" | "en";

const storageKey = "sfs-language";
const originalText = new WeakMap<Text, string>();

const zhToEn: Record<string, string> = {
  "跳到主要内容": "Skip to main content",
  "中文": "中文",
  "首页": "Home",
  "服务": "Services",
  "价格": "Pricing",
  "联系": "Contact",
  "上传稿件": "Upload manuscript",
  "获取报价": "Get a quote",
  "首页 Home": "Home",
  "服务 Services": "Services",
  "价格 Pricing": "Pricing",
  "联系 Contact": "Contact",
  "上传稿件 Upload": "Upload manuscript",
  "隐私政策 Privacy Policy": "Privacy Policy",
  "服务条款 Terms of Service": "Terms of Service",
  "保密与学术伦理 Confidentiality & Ethics": "Confidentiality & Ethics",
  "提交与政策": "Submit & policies",
  "导航": "Navigation",

  "学术论文排版服务": "Academic Manuscript Formatting",
  "为科研作者、学生作者、期刊和会议提供快速、可靠、价格灵活的 Word / PDF / LaTeX 论文排版、投稿文件整理、期刊文章排版和 JATS XML 生成服务。":
    "Fast, reliable, and flexible Word, PDF, LaTeX, submission-file, journal production, and JATS XML services for researchers, students, journals, and conferences.",
  "上传文件并获取报价": "Upload files for a quote",
  "文件保密处理": "Confidential file handling",
  "通常 1–3 个工作日": "Usually 1-3 business days",
  "专注期刊和会议论文排版": "Focused on journal and conference papers",
  "支持 Word、LaTeX、Overleaf": "Word, LaTeX, and Overleaf supported",
  "可按目标期刊 author guidelines 排版": "Formatted to target journal author guidelines",
  "支持 title page 和 blinded manuscript 整理": "Title page and blinded manuscript preparation",
  "支持期刊文章 PDF production": "Journal PDF production support",
  "支持 JATS XML 生成": "JATS XML conversion available",
  "服务概览": "Service overview",
  "覆盖从个人投稿到期刊出版的排版需求": "Formatting support from individual submission to journal production",
  "无论是单篇期刊投稿，还是杂志社、会议的批量排版与 XML 生成，都能找到对应服务。":
    "Whether you need one manuscript formatted or batch production and XML for a journal or conference, there is a service tier for it.",
  "查看全部 6 项服务": "View all 6 services",
  "含期刊文章出版排版等机构服务": "Includes journal production services for institutions",
  "如何开始": "How it works",
  "三步获取报价并交付": "Three steps from quote to delivery",
  "流程清晰、边界明确，先确认服务范围与报价，再开始排版。":
    "A clear process: we confirm scope and price before formatting begins.",
  "提交需求或上传稿件": "Send details or upload files",
  "填写联系表单或上传稿件，告诉我们目标期刊 / 会议、稿件字数、图表与参考文献数量、是否需要 LaTeX 或 XML。":
    "Use the contact form or upload your manuscript, including target journal/conference, word count, figures, references, and whether LaTeX or XML is needed.",
  "确认报价与交付时间": "Confirm quote and timeline",
  "我们根据稿件长度、格式要求与交付时间确认报价，与你确认服务范围后再开始。":
    "We quote based on manuscript length, formatting requirements, and delivery timing, then confirm scope before starting.",
  "排版交付与修改": "Formatting, delivery, and revisions",
  "按目标期刊要求完成排版，交付 Word / PDF / LaTeX / XML 文件，并提供约定范围内的小修改。":
    "We format to the target requirements, deliver Word/PDF/LaTeX/XML files, and provide small revisions within the agreed scope.",
  "为什么可信": "Why clients trust us",
  "专业、保密、边界清晰": "Professional, confidential, and ethically clear",
  "专业排版，编辑校对": "Professional, editor-checked formatting",
  "Professional, editor-checked formatting：由排版编辑按目标期刊要求逐项整理格式，而非简单套模板。":
    "Formatting editors check each requirement against the target journal instead of simply applying a template.",
  "文件全程保密": "Confidential handling",
  "Confidential file handling：客户文件仅用于本次排版，不公开展示、不用于宣传，除非获得明确授权。":
    "Your files are used only for the requested service and are not displayed or used for promotion without explicit permission.",
  "交付快、价格灵活": "Fast turnaround, flexible pricing",
  "Fast turnaround & affordable pricing：个人稿件通常 1–3 个工作日交付，价格按稿件实际情况灵活报价。":
    "Individual manuscripts are usually delivered within 1-3 business days, with pricing based on the actual manuscript.",
  "边界清晰、诚实可信": "Clear ethical boundaries",
  "No ghostwriting、no fake references、no data manipulation、no publication guarantees：不代写、不编造参考文献、不修改数据、不承诺录用。":
    "No ghostwriting, fake references, data manipulation, or publication guarantees.",
  "服务边界": "Service boundaries",
  "我们做什么，不做什么": "What we do and do not provide",
  "我们提供": "We provide",
  "我们不提供": "We do not provide",
  "期刊与会议论文投稿格式排版": "Journal and conference submission formatting",
  "Word、LaTeX、Overleaf 排版": "Word, LaTeX, and Overleaf formatting",
  "按 author guidelines 排版": "Formatting to author guidelines",
  "title page 与 blinded manuscript 整理": "Title page and blinded manuscript preparation",
  "期刊文章 PDF production": "Journal article PDF production",
  "代写论文": "Ghostwriting",
  "修改或编造研究数据": "Changing or fabricating research data",
  "编造参考文献": "Fabricating references",
  "承诺录用或保证发表": "Publication or acceptance guarantees",
  "代替作者投稿或冒充作者": "Submitting or acting as the author",
  "毕业论文 / 学位论文格式调整": "Thesis/dissertation formatting",
  "常见问题": "FAQ",
  "投稿排版常见问题": "Common submission-formatting questions",
  "查看全部常见问题": "View all FAQs",
  "准备整理您的投稿文件？": "Ready to prepare your submission files?",
  "请提交稿件基本信息、目标期刊或会议要求和期望交付时间，我们将根据稿件复杂度提供报价。":
    "Send manuscript details, target requirements, and timing. We will quote based on complexity.",
  "提交需求，获取报价": "Send details and get a quote",

  "基础期刊格式排版": "Journal Format Basic",
  "标准投稿排版": "Journal Submission Standard",
  "技术论文 / LaTeX 排版": "Technical & LaTeX Formatting",
  "期刊文章出版排版": "Article Production Formatting",
  "期刊 / 会议批量排版": "Journal & Conference Batch Formatting",
  "JATS XML 生成 / 转换": "JATS XML Conversion",
  "JATS XML 生成": "JATS XML Conversion",
  "查看详情": "View details",
  "获取机构报价": "Request institutional quote",
  "咨询 XML 服务": "Ask about XML service",
  "¥99 起": "from ¥99",
  "¥199 起": "from ¥199",
  "¥300 起": "from ¥300",
  "¥499 起": "from ¥499",
  "按项目报价": "Project quote",
  "按篇或按项目报价": "Per article or project quote",
  "适合简单 Word 期刊稿、短论文和普通会议论文。":
    "For simple Word manuscripts, short papers, and standard conference papers.",
  "适合 SCI、SSCI、Scopus、EI、PubMed 等正式投稿稿件。":
    "For SCI, SSCI, Scopus, EI, PubMed, and other formal journal submissions.",
  "适合 IEEE、ACM、Springer、Elsevier、Overleaf 和 LaTeX 稿件。":
    "For IEEE, ACM, Springer, Elsevier, Overleaf, and LaTeX manuscripts.",
  "适合杂志社、会议、special issue、论文集和编辑部。":
    "For journals, conferences, special issues, proceedings, and editorial offices.",
  "适合期刊、出版社、编辑部和 OA 平台上传需求。":
    "For journals, publishers, editorial offices, and OA platform uploads.",
  "简单 Word 期刊稿": "Simple Word journal manuscripts",
  "简短 research article": "Short research articles",
  "普通会议论文": "Standard conference papers",
  "图表较少、格式要求不复杂的稿件": "Manuscripts with few figures/tables and straightforward requirements",
  "按目标期刊基本格式调整": "Basic formatting to target journal requirements",
  "字体、字号、行距、页边距整理": "Fonts, sizes, spacing, and margins",
  "标题层级统一": "Consistent heading hierarchy",
  "摘要、关键词、正文结构格式整理": "Abstract, keywords, and body-structure formatting",
  "图表标题基础格式统一": "Basic figure/table caption consistency",
  "表格基础格式整理": "Basic table formatting",
  "参考文献格式基础统一": "Basic reference-style consistency",
  "Word + PDF 文件交付": "Word + PDF delivery",
  "1 次小修改": "1 small revision",
  "LaTeX 排版": "LaTeX formatting",
  "大量复杂表格处理": "Large or complex table processing",
  "参考文献逐条深度核对": "Line-by-line reference verification",
  "图表与正文引用逐项核查": "Detailed figure/table citation checks",
  "title page 深度整理": "Extensive title-page preparation",
  "blinded manuscript 深度处理": "Extensive blinded-manuscript processing",
  "XML 生成": "XML creation",
  "语言润色": "Language editing",
  "适用于 6000 字以内、图表 5 个以内、参考文献 50 条以内的简单 Word 稿件。":
    "Recommended for simple Word manuscripts under 6,000 words, with up to 5 figures/tables and 50 references.",
  "准备正式投稿期刊的作者": "Authors preparing formal journal submissions",
  "SCI、SSCI、Scopus、EI、PubMed 投稿作者": "Authors submitting to SCI, SSCI, Scopus, EI, or PubMed journals",
  "普通英文期刊投稿作者": "Authors submitting to general English-language journals",
  "按目标期刊 author guidelines 完整排版": "Complete formatting to target journal author guidelines",
  "字体、行距、页边距整理": "Font, spacing, and margin cleanup",
  "图表编号统一": "Consistent figure/table numbering",
  "正文图表引用一致性基础检查": "Basic consistency check for in-text figure/table citations",
  "表格格式整理": "Table formatting",
  "参考文献格式统一": "Reference-style consistency",
  "title page 整理": "Title page preparation",
  "blinded manuscript 匿名稿处理": "Blinded manuscript preparation",
  "funding、conflict of interest、ethics statement 等声明位置检查":
    "Placement check for funding, conflict of interest, ethics statement, and related declarations",
  "文件命名整理": "File naming cleanup",
  "2 次小修改": "2 small revisions",
  "学术内容修改": "Academic-content editing",
  "cover letter 重新写作": "Cover letter rewriting",
  "代投稿": "Submission on behalf of the author",
  "图片重绘": "Figure redrawing",
  "数据检查": "Data checking",
  "适用于 8000 字以内、图表 10 个以内、参考文献 80 条以内的 Word 稿件。":
    "Recommended for Word manuscripts under 8,000 words, with up to 10 figures/tables and 80 references.",
  "计算机、工程、数学、物理领域作者": "Authors in computer science, engineering, mathematics, and physics",
  "电磁、通信、材料领域作者": "Authors in electromagnetics, communications, and materials",
  "人工智能、机器人等领域作者": "Authors in AI, robotics, and related fields",
  "IEEE 模板稿件": "IEEE template manuscripts",
  "ACM 模板稿件": "ACM template manuscripts",
  "Springer 模板稿件": "Springer template manuscripts",
  "Elsevier LaTeX 模板稿件": "Elsevier LaTeX template manuscripts",
  "Overleaf 项目": "Overleaf projects",
  "LaTeX 投稿稿件": "LaTeX submissions",
  "技术类会议论文": "Technical conference papers",
  "Word 转 LaTeX 基础处理稿件": "Basic Word-to-LaTeX conversion manuscripts",
  "LaTeX 模板套用": "LaTeX template application",
  "Word 转 LaTeX 基础处理": "Basic Word-to-LaTeX conversion",
  "Overleaf 项目整理": "Overleaf project cleanup",
  "BibTeX / BibLaTeX 参考文献整理": "BibTeX / BibLaTeX reference cleanup",
  "公式编号格式整理": "Equation numbering cleanup",
  "图表浮动体处理": "Figure/table float handling",
  "表格格式调整": "Table formatting adjustment",
  "IEEE / ACM / Springer / Elsevier 模板排版": "IEEE / ACM / Springer / Elsevier template formatting",
  "编译错误基础修复": "Basic compile-error fixes",
  "PDF 输出": "PDF output",
  "LaTeX 源文件 + PDF 文件交付": "LaTeX source + PDF delivery",
  "数学公式正确性检查": "Mathematical correctness checking",
  "代码结果检查": "Code-result checking",
  "学术内容改写": "Academic-content rewriting",
  "复杂 TikZ 绘图": "Complex TikZ drawing",
  "大量公式重排": "Large-scale equation reformatting",
  "严重损坏的 LaTeX 项目重构": "Rebuilding severely broken LaTeX projects",
  "如涉及大量复杂公式、复杂表格、模板重构、严重编译错误或大规模 Word 转 LaTeX，应单独报价。":
    "Large numbers of complex equations/tables, template rebuilding, severe compile errors, or large-scale Word-to-LaTeX conversion require a separate quote.",
  "小型期刊": "Small journals",
  "OA 期刊": "OA journals",
  "出版社": "Publishers",
  "学术协会": "Academic associations",
  "已录用文章 production 阶段": "Accepted manuscripts in production",
  "accepted manuscript 转正式 PDF": "Accepted manuscript to final PDF",
  "online first article": "Online-first articles",
  "单篇 article layout": "Single-article layout",
  "期刊固定模板排版": "Journal fixed-template layout",
  "OJS 上传前文件整理": "Pre-OJS upload file preparation",
  "按期刊固定模板排版": "Layout to the journal's fixed template",
  "作者、单位、通讯作者格式整理": "Author, affiliation, and corresponding-author formatting",
  "摘要、关键词、正文、参考文献格式统一": "Consistent abstract, keywords, body, and references",
  "DOI、卷、期、页码、文章编号位置整理": "DOI, volume, issue, pages, and article-number placement",
  "收稿日期、修回日期、录用日期、上线日期整理": "Received/revised/accepted/online date formatting",
  "图表位置与标题统一": "Consistent figure/table placement and captions",
  "页眉页脚处理": "Header and footer handling",
  "单篇文章 production 文件交付": "Single-article production-file delivery",
  "copyediting": "Copyediting",
  "DOI 注册": "DOI registration",
  "OJS 全流程管理": "Full OJS management",
  "XML 可作为增值服务单独收费。": "XML can be quoted as an optional add-on.",
  "special issue": "Special issues",
  "会议论文集": "Conference proceedings",
  "出版服务机构": "Publishing-service providers",
  "科研服务公司": "Research-service companies",
  "建立统一排版模板": "Create a unified layout template",
  "批量文章格式统一": "Batch article-format consistency",
  "单篇 PDF 输出": "Individual PDF output",
  "整期 PDF 或 proceedings PDF 输出": "Full-issue PDF or proceedings PDF output",
  "目录页": "Table of contents",
  "页码": "Pagination",
  "卷期号": "Volume and issue numbers",
  "DOI / article number 位置整理": "DOI / article-number placement",
  "作者和单位格式统一": "Consistent author and affiliation formatting",
  "图表和参考文献格式统一": "Consistent figures/tables and references",
  "文件夹结构整理": "Folder-structure cleanup",
  "PDF + XML 组合交付": "PDF + XML combined delivery",
  "期刊模板设计": "Journal template design",
  "会议论文集封面和目录页排版": "Proceedings cover and contents layout",
  "批量文件命名与归档": "Batch file naming and archiving",
  "期刊": "Journals",
  "OA 平台": "OA platforms",
  "需要数据库收录或平台上传的期刊": "Journals needing database indexing or platform uploads",
  "需要结构化 XML 文件的出版项目": "Publishing projects needing structured XML files",
  "Word / PDF / 排版稿转 JATS XML": "Word / PDF / layout file to JATS XML",
  "article metadata 标记": "Article metadata tagging",
  "title、abstract、keywords 标记": "Title, abstract, and keywords tagging",
  "author and affiliation 标记": "Author and affiliation tagging",
  "funding、conflict of interest、ethics statement 标记":
    "Funding, conflict of interest, and ethics statement tagging",
  "references 标记": "References tagging",
  "figures and tables 基础标记": "Basic figures and tables tagging",
  "DOI、volume、issue、page / article number 标记": "DOI, volume, issue, page / article-number tagging",
  "XML 文件交付": "XML file delivery",
  "基础结构检查": "Basic structure check",
  "基础 JATS XML": "Basic JATS XML",
  "标准 JATS XML": "Standard JATS XML",
  "复杂 JATS XML": "Complex JATS XML",
  "批量 XML，20 篇以上": "Batch XML, 20+ articles",
  "结构简单、图表少、公式少、参考文献清楚": "Simple structure, few figures/equations, clear references",
  "正式期刊文章，有图表、DOI、完整作者单位和声明信息":
    "Formal journal article with figures, DOI, complete affiliations, and declarations",
  "公式多、表格复杂、参考文献多、多作者多单位、平台规范复杂":
    "Many equations, complex tables, many references, multiple authors/affiliations, or complex platform rules",
  "期刊整期、会议论文集、批量出版项目": "Full journal issues, proceedings, or batch publishing projects",
  "简单 Word 期刊稿、短论文、普通会议论文": "Simple Word journal manuscripts, short papers, standard conference papers",
  "SCI、SSCI、Scopus、EI、PubMed 等正式投稿稿件": "Formal SCI, SSCI, Scopus, EI, PubMed submissions",
  "IEEE、ACM、Springer、Elsevier、Overleaf、LaTeX 稿件": "IEEE, ACM, Springer, Elsevier, Overleaf, and LaTeX manuscripts",
  "期刊录用后 PDF production、编辑部单篇排版": "Post-acceptance PDF production and single-article editorial layout",
  "杂志社、会议、special issue、论文集、编辑部": "Journals, conferences, special issues, proceedings, and editorial offices",
  "期刊、出版社、编辑部、OA 平台上传需求": "Journal, publisher, editorial office, and OA platform upload needs",
  "需要 PDF production 和 JATS XML 的期刊客户": "Journal clients needing both PDF production and JATS XML",
  "5–10 篇小批量": "Small batch of 5-10 articles",
  "10–30 篇会议论文": "10-30 conference papers",
  "整期期刊 production": "Full-issue journal production",
  "长期月度排版支持": "Long-term monthly formatting support",
  "海外会议 / 期刊项目": "International conference / journal projects",
  "24 小时加急": "24-hour rush",
  "12 小时超急": "12-hour urgent rush",
  "更换目标期刊重新排版": "Reformatting for a changed target journal",
  "超过 8000 字": "Over 8,000 words",
  "超过 10 个图表": "More than 10 figures/tables",
  "超过 80 条参考文献": "More than 80 references",
  "复杂 LaTeX 表格": "Complex LaTeX tables",
  "Word 转 LaTeX": "Word to LaTeX",
  "大量参考文献重新整理": "Large-scale reference cleanup",
  "额外修改轮次": "Additional revision rounds",
  "XML 复杂公式 / 表格": "Complex XML equations / tables",
  "XML 平台特殊规范": "Special XML platform rules",
  "客户新增大量内容": "Large amount of new client content",
  "更换模板或更换目标期刊": "Changing template or target journal",
  "批量项目加急": "Rush batch project",
  "原价 50%–80%": "50%-80% of original price",
  "单独报价": "Separate quote",

  "Services": "Services",
  "服务快捷导航": "Service quick navigation",
  "快捷导航": "Quick navigation",
  "个人作者": "Individual authors",
  "机构客户": "Institutions",
  "个人 / 机构": "Authors / institutions",
  "面向个人作者的排版服务": "Services for individual authors",
  "适合准备投稿期刊或会议的研究者，按目标期刊 author guidelines 完成排版，交付 Word / LaTeX 与 PDF 文件。":
    "For researchers preparing journal or conference submissions. We format to author guidelines and deliver Word/LaTeX and PDF files.",
  "面向期刊 / 会议 / 编辑部的服务": "Services for journals, conferences, and editorial offices",
  "面向编辑部、出版社、会议与协会，提供录用后出版排版、批量排版与结构化 JATS XML 转换。":
    "Production formatting, batch layout, and structured JATS XML conversion for editorial offices, publishers, conferences, and associations.",
  "服务 01": "Service 01",
  "服务 02": "Service 02",
  "服务 03": "Service 03",
  "服务 04": "Service 04",
  "服务 05": "Service 05",
  "服务 06": "Service 06",
  "适合对象": "Best for",
  "适合稿件类型": "Manuscript types",
  "适合场景": "Use cases",
  "包含服务": "Included",
  "不包含": "Not included",
  "可选增值服务": "Optional add-ons",
  "XML 价格区分": "XML pricing tiers",
  "XML 类型": "XML type",
  "适用范围建议：": "Suggested scope: ",
  "就此服务获取报价": "Get a quote for this service",

  "Pricing": "Pricing",
  "价格按稿件长度、图表与参考文献数量、目标期刊格式要求、LaTeX / XML 复杂度和交付时间灵活确定。以下为常见区间，最终以确认报价为准。":
    "Pricing depends on manuscript length, figures, references, target journal requirements, LaTeX/XML complexity, and turnaround time. The ranges below are typical; final pricing is confirmed by quote.",
  "个人作者服务": "Individual author services",
  "机构客户服务": "Institutional services",
  "期刊 / 会议批量排版参考价格": "Batch formatting reference pricing",
  "项目类型": "Project type",
  "建议价格": "Reference price",
  "批量项目的最终报价按篇数、稿件复杂度、模板要求与交付周期确定，欢迎提交项目信息获取机构报价。":
    "Batch-project pricing depends on article count, complexity, template requirements, and timeline. Send project details for an institutional quote.",
  "加价项": "Add-ons",
  "加价规则": "Add-on rules",
  "价格说明": "Pricing note",
  "最终报价取决于稿件长度、图表数量、参考文献数量、目标期刊格式要求、LaTeX 复杂度、XML 复杂度和交付时间。":
    "Final pricing depends on manuscript length, figure/table count, references, target requirements, LaTeX complexity, XML complexity, and turnaround time.",
  "如不确定该选哪种服务或具体费用，欢迎先提交需求，我们会根据你的稿件给出明确报价后再开始。":
    "If you are not sure which service fits, send your details first. We will provide a clear quote before starting.",
  "需要一份确切报价？": "Need an exact quote?",
  "提交稿件信息（字数、图表、参考文献、目标期刊与交付时间），我们会尽快给出明确价格。":
    "Send manuscript details such as word count, figures, references, target journal, and timing. We will respond with a clear price.",

  "联系我们": "Contact us",
  "Tell us about your manuscript": "Tell us about your manuscript",
  "填写下面的表单，告诉我们目标期刊 / 会议与稿件信息，我们会尽快确认服务范围并给出报价。":
    "Fill out the form with target journal/conference and manuscript details. We will confirm scope and pricing as soon as possible.",
  "提交前可准备": "Helpful details to prepare",
  "以下信息能帮助我们更快确认服务范围并给出准确报价。":
    "These details help us confirm scope and quote accurately.",
  "目标期刊 / 会议名称": "Target journal / conference",
  "author guidelines 链接或排版模板": "Author guidelines link or template",
  "稿件字数": "Word count",
  "图表与参考文献数量": "Number of figures/tables and references",
  "是否需要 LaTeX / XML": "Whether LaTeX / XML is needed",
  "期望交付时间": "Expected delivery time",
  "响应时间": "Response time",
  "通常 1 个工作日内回复。个人稿件一般在 1–3 个工作日内交付，加急需求可另行约定。":
    "We usually respond within one business day. Individual manuscripts are often delivered within 1-3 business days; rush work can be arranged separately.",
  "想直接上传文件？": "Prefer to upload files now?",
  "如果稿件已经准备好，也可以先上传，我们看过后再与您确认细节。":
    "If your files are ready, you can upload them first and we will confirm details after review.",
  "其他联系方式": "Other contact methods",
  "请通过联系表单提交需求，我们会尽快回复。":
    "Please submit your request through the contact form. We will reply as soon as possible.",
  "微信：": "WeChat: ",
  "邮箱：": "Email: ",

  "姓名": "Name",
  "邮箱": "Email",
  "微信 / WhatsApp": "WeChat / WhatsApp",
  "客户类型": "Customer type",
  "需要的服务": "Services needed",
  "（可多选）": "(multiple selections allowed)",
  "目标期刊 author guidelines 链接": "Author guidelines link",
  "图表数量": "Figures / tables",
  "参考文献数量": "References",
  "是否需要 LaTeX": "Need LaTeX?",
  "是否需要 XML": "Need XML?",
  "备注说明": "Notes",
  "我已阅读并同意": "I have read and agree to the",
  "隐私政策": "Privacy Policy",
  "并理解文件仅用于本次排版服务。": "and understand that files are used only for this formatting service.",
  "学生作者": "Student author",
  "杂志社": "Journal",
  "学术会议": "Academic conference",
  "编辑部": "Editorial office",
  "科研服务机构": "Research service provider",
  "其他": "Other",
  "不确定，需要建议": "Not sure, need advice",
  "是": "Yes",
  "否": "No",

  "Upload Manuscript": "Upload Manuscript",
  "Upload your files for a quote": "Upload your files for a quote",
  "请上传 Word、LaTeX、PDF、图片、模板或压缩包文件。文件仅用于本次排版服务，不会公开展示或用于其他用途。":
    "Upload Word, LaTeX, PDF, image, template, or archive files. Files are used only for this service and are not publicly displayed or used for other purposes.",
  "稿件类型": "Manuscript type",
  "上传原始稿件": "Upload manuscript files",
  "点击选择或拖放文件到此处": "Click to choose or drag files here",
  "支持 Word、LaTeX、PDF、图片、模板或压缩包，单文件 ≤ 50MB，可多选":
    "Word, LaTeX, PDF, images, templates, or archives supported. Max 50MB per file; multiple files allowed.",
  "上传其他材料": "Upload additional materials",
  "可一并上传：目标期刊模板、author guidelines 文件、图表文件、参考文献文件、补充材料。":
    "You may also upload target journal templates, author guidelines, figure files, references, and supplementary materials.",
  "点击选择或拖放其他材料（选填）": "Click or drag additional materials (optional)",
  "模板 / guidelines / 图表 / 参考文献 / 补充材料，可多选":
    "Templates / guidelines / figures / references / supplementary files; multiple files allowed",
  "目标期刊 / 会议链接": "Target journal / conference link",
  "是否需要 blinded manuscript": "Need a blinded manuscript?",
  "是否需要 title page": "Need a title page?",
  "是否需要 JATS XML": "Need JATS XML?",
  "是否加急": "Rush delivery?",
  "特殊说明": "Special instructions",
  "文件仅用于本次排版服务，不会公开或用于其他用途。":
    "Files are used only for this formatting service and will not be made public or used for other purposes.",
  "可以一起上传": "You can upload",
  "原始稿件（Word / LaTeX / PDF）": "Manuscript files (Word / LaTeX / PDF)",
  "目标期刊模板": "Target journal template",
  "author guidelines 文件": "Author guidelines file",
  "图表文件": "Figure/table files",
  "参考文献文件": "Reference files",
  "补充材料": "Supplementary materials",
  "文件保密": "File confidentiality",
  "文件仅用于本次排版服务，不会公开展示、不用于案例宣传，除非获得你的明确授权。":
    "Files are used only for this service and are not publicly displayed or used in case studies without your explicit permission.",
  "不方便上传？": "Not ready to upload?",
  "如果暂时不便上传文件，可先通过联系表单说明需求，我们会与你确认后续方式。":
    "If you cannot upload files yet, use the contact form first and we will confirm the next step.",
  "改用联系表单": "Use contact form instead",

  "Frequently asked questions": "Frequently asked questions",
  "关于排版服务范围、交付、修改与保密的常见问题。还有疑问可直接联系我们。":
    "Common questions about service scope, delivery, revisions, and confidentiality. Contact us if you need more detail.",
  "没找到答案？": "Still have questions?",
  "直接联系我们，说明你的稿件与目标期刊，我们会具体解答并给出报价。":
    "Contact us with your manuscript and target journal. We will answer specifically and provide a quote.",
  "你们做毕业论文或学位论文格式调整吗？": "Do you format theses or dissertations?",
  "不做。ScholarFormat Studio 专注于期刊和会议论文的投稿格式排版，目前不提供毕业论文或学位论文格式调整服务。":
    "No. ScholarFormat Studio focuses on journal and conference submission formatting and does not currently provide thesis or dissertation formatting.",
  "你们提供论文代写吗？": "Do you provide ghostwriting?",
  "不提供。我们只提供排版、格式整理、参考文献样式统一、图表编号、LaTeX 排版、PDF production 和 JATS XML 生成服务。":
    "No. We only provide formatting, style cleanup, reference-style consistency, figure/table numbering, LaTeX formatting, PDF production, and JATS XML services.",
  "你们提供语言润色吗？": "Do you provide language editing?",
  "目前不以语言润色作为主服务。我们的核心服务是学术论文排版和投稿文件整理。":
    "Not as a core service. Our core work is academic formatting and submission-file preparation.",
  "你们能保证论文录用吗？": "Can you guarantee acceptance?",
  "不能。我们不承诺录用，也不影响期刊的学术评审结果。我们的服务仅限于帮助作者整理格式、减少投稿前的格式问题。":
    "No. We do not guarantee acceptance or influence peer review. Our service helps reduce formatting issues before submission.",
  "你们可以按目标期刊 author guidelines 排版吗？": "Can you format to author guidelines?",
  "可以。客户需要提供目标期刊名称、author guidelines 链接或模板文件。":
    "Yes. Please provide the target journal name, author guidelines link, or template files.",
  "你们可以处理 LaTeX 或 Overleaf 吗？": "Can you work with LaTeX or Overleaf?",
  "可以。我们可以处理 LaTeX 模板套用、Overleaf 项目整理、BibTeX / BibLaTeX 参考文献、基础编译错误修复和 PDF 输出。":
    "Yes. We can handle LaTeX templates, Overleaf project cleanup, BibTeX/BibLaTeX references, basic compile-error fixes, and PDF output.",
  "你们可以生成 JATS XML 吗？": "Can you create JATS XML?",
  "可以。JATS XML 生成属于单独服务，通常面向期刊、出版社、编辑部或 OA 平台上传需求。":
    "Yes. JATS XML is a separate service, usually for journals, publishers, editorial offices, or OA platform uploads.",
  "交付时间多久？": "How long does delivery take?",
  "普通个人作者稿件通常 1–3 个工作日。LaTeX 稿件、复杂稿件、批量项目和 XML 项目根据复杂度确定时间。加急服务需另行加价。":
    "Standard individual manuscripts usually take 1-3 business days. LaTeX, complex manuscripts, batch projects, and XML work are quoted by complexity. Rush service may cost extra.",
  "可以修改几次？": "How many revisions are included?",
  "基础期刊格式排版包含 1 次小修改。标准投稿排版和 LaTeX 排版包含 2 次小修改。超出范围的大量新增内容、更换期刊模板或大幅修改需另行报价。":
    "Basic formatting includes one small revision. Standard submission formatting and LaTeX formatting include two small revisions. Major added content, template changes, or large revisions require a separate quote.",
  "文件会保密吗？": "Are files confidential?",
  "会。客户文件仅用于本次排版服务，不会公开展示，不会用于案例宣传，除非获得客户明确授权。":
    "Yes. Client files are used only for this service and are not displayed or used as case studies without explicit permission.",
  "你们会代替作者投稿吗？": "Will you submit on behalf of authors?",
  "不代替作者投稿，也不冒充作者操作投稿系统。如客户需要，我们可以协助整理投稿文件清单，但投稿操作应由作者本人完成。":
    "No. We do not submit or operate submission systems as the author. We can help prepare a submission-file checklist, but submission should be completed by the author.",

  "准备好开始了吗？": "Ready to get started?",
  "提交稿件信息或直接上传文件，我们会尽快确认服务范围并给出报价。":
    "Send manuscript details or upload files. We will confirm scope and quote as soon as possible.",
  "ScholarFormat Studio 专注学术论文投稿排版，为科研作者、学生作者、期刊与会议提供 Word / LaTeX 排版、投稿文件整理、PDF production 与 JATS XML 生成服务。":
    "ScholarFormat Studio provides academic manuscript formatting, submission-file preparation, PDF production, and JATS XML services for researchers, students, journals, and conferences.",
  "返回首页": "Back to home",
  "← 返回首页": "← Back to home",
};

const placeholderEn: Record<string, string> = {
  "您的称呼": "Your name",
  "微信号或 WhatsApp 号码（选填）": "WeChat ID or WhatsApp number (optional)",
  "如 IEEE Access、某会议名称": "e.g. IEEE Access or conference name",
  "如 6000": "e.g. 6000",
  "如 8": "e.g. 8",
  "如 45": "e.g. 45",
  "如 3 个工作日 / 某月某日前": "e.g. 3 business days / before a specific date",
  "补充任何有助于我们报价的信息，如学科领域、特殊格式要求等。":
    "Add any details that help us quote, such as field, special formatting requirements, etc.",
  "补充任何特殊要求，如目标格式、命名规范、保密要求等。":
    "Add any special requirements, such as target format, naming rules, or confidentiality needs.",
};

function normalize(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

function withOriginalSpacing(original: string, replacement: string): string {
  const leading = original.match(/^\s*/)?.[0] ?? "";
  const trailing = original.match(/\s*$/)?.[0] ?? "";
  return `${leading}${replacement}${trailing}`;
}

export function getActiveLanguage(): Language {
  if (typeof document === "undefined") return "zh";
  return document.documentElement.dataset.language === "en" ? "en" : "zh";
}

export function localized(zh: string, en: string): string {
  return getActiveLanguage() === "en" ? en : zh;
}

function applyTextLanguage(lang: Language): void {
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
    acceptNode(node) {
      const parent = node.parentElement;
      if (!parent) return NodeFilter.FILTER_REJECT;
      if (["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(parent.tagName)) {
        return NodeFilter.FILTER_REJECT;
      }
      if (!normalize(node.nodeValue ?? "")) return NodeFilter.FILTER_REJECT;
      return NodeFilter.FILTER_ACCEPT;
    },
  });

  const textNodes: Text[] = [];
  while (walker.nextNode()) textNodes.push(walker.currentNode as Text);

  for (const node of textNodes) {
    const original = originalText.get(node) ?? node.nodeValue ?? "";
    originalText.set(node, original);
    const key = normalize(original);
    const en = zhToEn[key];
    node.nodeValue = lang === "en" && en ? withOriginalSpacing(original, en) : original;
  }
}

function applyAttributeLanguage(lang: Language): void {
  document.querySelectorAll<HTMLInputElement | HTMLTextAreaElement>("[placeholder]").forEach((el) => {
    const original = el.dataset.i18nOriginalPlaceholder ?? el.getAttribute("placeholder") ?? "";
    el.dataset.i18nOriginalPlaceholder = original;
    const en = placeholderEn[normalize(original)];
    el.setAttribute("placeholder", lang === "en" && en ? en : original);
  });

  document.querySelectorAll<HTMLElement>("[aria-label]").forEach((el) => {
    const original = el.dataset.i18nOriginalAriaLabel ?? el.getAttribute("aria-label") ?? "";
    el.dataset.i18nOriginalAriaLabel = original;
    const en = zhToEn[normalize(original)];
    if (en) el.setAttribute("aria-label", lang === "en" ? en : original);
  });
}

function applyControlState(lang: Language): void {
  document.querySelectorAll<HTMLButtonElement>("[data-lang-control]").forEach((button) => {
    const active = button.dataset.langControl === lang;
    button.setAttribute("aria-pressed", String(active));
  });
}

function setLanguage(lang: Language): void {
  document.documentElement.lang = lang === "en" ? "en" : "zh-CN";
  document.documentElement.dataset.language = lang;
  localStorage.setItem(storageKey, lang);
  applyTextLanguage(lang);
  applyAttributeLanguage(lang);
  applyControlState(lang);
}

export function initLanguageSwitch(): void {
  const saved = localStorage.getItem(storageKey);
  const initial: Language = saved === "en" ? "en" : "zh";
  setLanguage(initial);

  document.querySelectorAll<HTMLButtonElement>("[data-lang-control]").forEach((button) => {
    button.addEventListener("click", () => {
      const next = button.dataset.langControl === "en" ? "en" : "zh";
      setLanguage(next);
    });
  });
}
